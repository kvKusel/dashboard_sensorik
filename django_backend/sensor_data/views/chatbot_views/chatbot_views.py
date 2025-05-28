import json
import logging
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import openai
import os
import difflib
from datetime import datetime

from .data_analytics_for_chatbot import get_water_level_analytics, QUERY_TYPE_MAP
from .chat_logging import get_or_create_session, log_chat_interaction

openai.api_key = os.getenv('OPENAI_API_KEY')

logger = logging.getLogger(__name__)

def format_timestamp(ts):
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return dt.strftime("%d.%m.%Y, %H:%M")
    except:
        return ts

@method_decorator(csrf_exempt, name='dispatch')
class ChatEndpointView(View):

    def create_analytics_prompt(self, analytics: dict, user_input: str) -> str:
        """Create a natural language description of analytics data for GPT"""
        
        def format_ts(ts):
            try:
                return datetime.fromisoformat(ts.replace("Z", "+00:00")).strftime("%d.%m.%Y um %H:%M")
            except:
                return str(ts)
        
        # Format spike and jump timestamps
        spike_times = [format_ts(ts) for ts in analytics.get("spike_timestamps", [])]
        jump_times = [format_ts(ts) for ts in analytics.get("unusual_jump_timestamps", [])]
        out_of_range_times = [format_ts(ts) for ts in analytics.get("out_of_range_timestamps", [])]
        
        analytics_text = f"""
Wasserstandsdaten für {analytics['location']} (Zeitraum: {analytics['days']} Tage):

AKTUELLE WERTE:
- Aktuellster Wasserstand: {analytics['latest_value']} cm (gemessen am {format_ts(analytics['last_measurement_time'])})
- Trend: {analytics['trend']}

STATISTISCHE AUSWERTUNG:
- Durchschnitt: {analytics['mean']} cm
- Minimum: {analytics['min']} cm am {format_ts(analytics['min_time'])}
- Maximum: {analytics['max']} cm am {format_ts(analytics['max_time'])}
- Veränderungsrate: {analytics['rate_of_change_cm_per_day']} cm pro Tag
- Regression: {analytics['regression_slope_cm_per_hour']} cm pro Stunde
- Korrelation mit Niederschlag: {analytics['correlation_with_precipitation']}

AUFFÄLLIGKEITEN:
- Spikes: {analytics['spike_count']} ({', '.join(spike_times) if spike_times else 'keine'})
- Ungewöhnliche Sprünge: {analytics['unusual_jump_count']} ({', '.join(jump_times) if jump_times else 'keine'})
- Werte außerhalb des normalen Bereichs: {analytics['out_of_range_count']} ({', '.join(out_of_range_times) if out_of_range_times else 'keine'})
"""
        return analytics_text

    def fuzzy_match_location(self, input_location):
        """Find the best matching location using fuzzy matching for typos"""
        available_locations = [
            'wolfstein', 'rutsweiler a.d. lauter', 'kreimbach 1', 'kreimbach 2', 
            'kreimbach 3', 'lauterecken', 'kusel', 'lohnweiler (mausbach)', 
            'lohnweiler (lauter)', 'hinzweiler', 'untersulzbach'
        ]
        
        # Direct match first
        if input_location.lower() in available_locations:
            return input_location.lower()
        
        # Fuzzy matching for typos
        matches = difflib.get_close_matches(
            input_location.lower(), 
            available_locations, 
            n=1, 
            cutoff=0.6
        )
        
        if matches:
            logger.info(f"Fuzzy matched '{input_location}' to '{matches[0]}'")
            return matches[0]
        
        return None

    def post(self, request, *args, **kwargs):
        session = None
        session_id = None
        user_input = ""
        
        try:
            data = json.loads(request.body)
            messages = data.get('messages', [])
            session_id = data.get('session_id', '')
            session, session_id = get_or_create_session(session_id)

            if not messages:
                logger.warning("No messages provided in request")
                return self.log_and_respond(session, "", 'No messages provided', status=400)

            messages = messages[-8:]
            user_input = messages[-1]['content']
            logger.info(f"Processing user input: {user_input}")

            # Check for station list request first
            if any(keyword in user_input.lower() for keyword in ['stationen', 'pegelstationen', 'orte', 'welche stationen']):
                station_list = (
                    "🌊 Verfügbare Pegelstationen:\n"
                    "• Wolfstein\n"
                    "• Rutsweiler a.d. Lauter\n"
                    "• Kreimbach 1\n"
                    "• Kreimbach 2\n"
                    "• Kreimbach 3\n"
                    "• Lauterecken\n"
                    "• Kusel\n"
                    "• Lohnweiler (Mausbach)\n"
                    "• Lohnweiler (Lauter)\n"
                    "• Hinzweiler\n"
                    "• Untersulzbach\n"
                    "Bitte nenne einen Ort und einen Zeitraum, um Wasserstandsdaten zu erhalten. 🎯"
                )
                return self.log_and_respond(session, user_input, station_list)

            # Use GPT to extract location and time period
            extracted_data = self.gpt_extract_location_and_days(user_input, data.get("state", {}))
            logger.info(f"GPT extracted data: {extracted_data}")
            
            # Handle Lohnweiler ambiguity
            if extracted_data == "AMBIGUOUS_LOHNWEILER":
                logger.info("Lohnweiler ambiguity detected by GPT, requesting clarification")
                clarification_msg = (
                    "⚠️ Es gibt zwei Stationen in Lohnweiler:\n"
                    "1️⃣ Lohnweiler (Mausbach)\n"
                    "2️⃣ Lohnweiler (Lauter)\n"
                    "\nBitte wähle eine Station (antworte mit 'Mausbach', 'Lauter', '1' oder '2')."
                )
                # Store context that we're waiting for Lohnweiler clarification
                state = {"waiting_for_lohnweiler_choice": True}
                return self.log_and_respond(session, user_input, clarification_msg, state=state)

            if extracted_data:
                location, days = extracted_data
                
                # Validate that we have a location before proceeding
                if not location:
                    logger.warning("No location extracted, falling back to general response")
                    # Fall through to general GPT response
                else:
                    # Apply fuzzy matching to handle typos that GPT might have missed
                    matched_location = self.fuzzy_match_location(location)
                    if matched_location:
                        location = matched_location
                        logger.info(f"Getting analytics for {location}, {days} days")
                        
                        analytics = get_water_level_analytics(location, days)
                        if not analytics or ('error' in analytics):
                            logger.warning(f"No analytics data available for {location}, {days} days")
                            error_msg = (
                                f"Es tut mir leid, aber ich habe derzeit keine Wasserstandsdaten für {location} für diesen Zeitraum verfügbar. "
                                f"Bitte versuche es mit einem anderen Ort oder Zeitraum. 🎯"
                            )
                            return self.log_and_respond(session, user_input, error_msg, state={"location": location, "time_range": f"{days} Tage"})

                        # Create natural language analytics description
                        analytics_description = self.create_analytics_prompt(analytics, user_input)
                        
                        # Simple system prompt for data interpretation
                        system_prompt = (
                            "Du bist ein Wasserstand-Datenanalyst. Beantworte die Benutzerfrage basierend auf den bereitgestellten Daten. "
                            "Sei präzise, verwende die exakten Zahlen aus den Daten, und beende deine Antwort mit 🎯. "
                            "Antworte auf Deutsch, es sei denn die Frage ist klar auf Englisch gestellt."
                        )
                        
                        # Create conversation with analytics data
                        analytics_messages = [
                            {"role": "system", "content": system_prompt},
                            {"role": "system", "content": f"Verfügbare Daten:\n{analytics_description}"},
                        ] + messages

                        gpt_response = openai.chat.completions.create(
                            model="gpt-4-turbo",
                            messages=analytics_messages,
                            temperature=0
                        )

                        reply = gpt_response.choices[0].message.content.strip()
                        return self.log_and_respond(session, user_input, reply, state={"location": location, "time_range": f"{days} Tage"})
                    else:
                        logger.warning(f"No match found for location: {location}")
                        error_msg = (
                            f"Ich konnte den Ort '{location}' nicht finden. "
                            f"Bitte überprüfe die Schreibweise oder wähle einen der verfügbaren Orte. 🎯"
                        )
                        return self.log_and_respond(session, user_input, error_msg)

            # If we get here, no extraction was possible - call GPT for general response
            logger.info("No extraction possible, calling GPT for general response")
            
            simple_prompt = [
                {"role": "system", "content": (
                    "Du bist ein freundlicher Assistent für Wasserstandsdaten. "
                    "Verfügbare Pegelstationen: Wolfstein, Rutsweiler a.d. Lauter, Kreimbach 1/2/3, "
                    "Lauterecken, Kusel, Lohnweiler (Mausbach), Lohnweiler (Lauter), Hinzweiler, Untersulzbach. "
                    "Verfügbare Zeiträume: 24 Stunden, 7 Tage, 30 Tage, 1 Jahr. "
                    "Hilf dem Benutzer bei der Formulierung einer klaren Anfrage."
                )}
            ] + messages
            
            gpt_response = openai.chat.completions.create(
                model="gpt-4-turbo",
                messages=simple_prompt,
                temperature=0
            )

            reply = gpt_response.choices[0].message.content.strip()
            return self.log_and_respond(session, user_input, reply)

        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            import uuid
            fallback_id = str(uuid.uuid4())
            session, _ = get_or_create_session(fallback_id)
            return self.log_and_respond(session, user_input, 'Ich konnte deine Anfrage leider nicht verstehen. Bitte gib einen anderen Ort oder Zeitraum an. 🎯', status=400)

        except Exception as e:
            logger.error(f"Unexpected error processing request: {e}", exc_info=True)
            if not session:
                import uuid
                fallback_id = str(uuid.uuid4())
                session, _ = get_or_create_session(fallback_id)
            return self.log_and_respond(session, user_input, 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es mit einem anderen Ort oder Zeitraum. 🎯', status=500)

    def gpt_extract_location_and_days(self, user_input, state=None):
        """Use GPT to extract location and time period from user input"""
        
        # Build context from previous state
        context_info = ""
        if state:
            if state.get("waiting_for_lohnweiler_choice"):
                context_info = "User is responding to Lohnweiler station choice (Mausbach vs Lauter)"
            elif "location" in state:
                context_info = f"Previous context: User was asking about {state['location']}"
                if "time_range" in state:
                    context_info += f" for {state['time_range']}"
        
        extraction_prompt = [
            {"role": "system", "content": f"""
Du bist ein Datenextraktor für Wasserstandsabfragen. Analysiere die Benutzereingabe und extrahiere:
1. ORT (Pegelstation)  
2. ZEITRAUM (in Tagen)

{context_info}

VERFÜGBARE ORTE - erkenne auch ähnliche Schreibweisen und Tippfehler:
- wolfstein (auch: owlfstein, wolfsten, etc.)
- rutsweiler a.d. lauter  
- kreimbach 1
- kreimbach 2
- kreimbach 3
- lauterecken
- kusel
- lohnweiler (mausbach)
- lohnweiler (lauter)  
- hinzweiler
- untersulzbach

VERFÜGBARE ZEITRÄUME:
- 24 Stunden = 1 Tag
- 7 Tage  
- 30 Tage
- 365 Tage = 1 Jahr

SPEZIELLE REGELN:
- Erkenne auch Tippfehler und ähnliche Schreibweisen bei Ortsnamen
- Wenn nur "lohnweiler" ohne weitere Spezifikation genannt wird: Antworte mit "AMBIGUOUS_LOHNWEILER"
- Bei relativen Zeitangaben wie "letzten Monat", "vergangene Woche" nutze entsprechende Tage
- Wenn kein Zeitraum angegeben, aber statistische Begriffe (Statistik, Analyse, Trend) verwendet werden: Standard 30 Tage
- Bei Follow-up Fragen ohne expliziten Ort: nutze Kontext falls verfügbar
- Wenn User antwortet "mausbach", "lauter", "1", "2" nach Lohnweiler-Frage: setze entsprechend "lohnweiler (mausbach)" oder "lohnweiler (lauter)"
- Wenn nur "lauter" gesagt wird im Kontext von Lohnweiler: nutze "lohnweiler (lauter)"
- Wenn nur "mausbach" gesagt wird im Kontext von Lohnweiler: nutze "lohnweiler (mausbach)"

ANTWORTFORMAT (nur JSON, keine weitere Erklärung):
{{"location": "ort_name oder null", "days": zahl_oder_null, "needs_clarification": "AMBIGUOUS_LOHNWEILER oder null"}}

Beispiele:
"Wolfstein letzte 7 Tage" → {{"location": "wolfstein", "days": 7, "needs_clarification": null}}
"owlfstein, letzte 30 tage" → {{"location": "wolfstein", "days": 30, "needs_clarification": null}}
"Lohnweiler Statistik" → {{"location": null, "days": null, "needs_clarification": "AMBIGUOUS_LOHNWEILER"}}
"mausbach" (nach Lohnweiler-Frage) → {{"location": "lohnweiler (mausbach)", "days": 30, "needs_clarification": null}}
"und lauter" (im Lohnweiler-Kontext) → {{"location": "lohnweiler (lauter)", "days": 30, "needs_clarification": null}}
"und im letzten Jahr?" → {{"location": null, "days": 365, "needs_clarification": null}}
"""},
            {"role": "user", "content": user_input}
        ]

        try:
            response = openai.chat.completions.create(
                model="gpt-4-turbo",
                messages=extraction_prompt,
                temperature=0,
                max_tokens=150
            )
            
            result_text = response.choices[0].message.content.strip()
            logger.info(f"GPT extraction raw response: {result_text}")
            
            # Parse JSON response
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                
                location = result.get("location")
                days = result.get("days") 
                needs_clarification = result.get("needs_clarification")
                
                # Handle Lohnweiler ambiguity
                if needs_clarification == "AMBIGUOUS_LOHNWEILER":
                    return "AMBIGUOUS_LOHNWEILER"
                
                # Use state context for missing values
                if not location and state and "location" in state:
                    location = state["location"]
                    logger.info(f"Using location from state: {location}")
                
                if not days and state and "time_range" in state:
                    days = self.map_time_range_to_days(state["time_range"])
                    logger.info(f"Using days from state: {days}")
                
                # Return result
                if location and days:
                    return (location.lower(), days)
                elif location:
                    return (location.lower(), 30)  # Default to 30 days if location but no time
                elif days:
                    return (None, days)  # Time specified but no location
                else:
                    return None
                    
            else:
                logger.warning("No JSON found in GPT response")
                return None
                
        except Exception as e:
            logger.error(f"Error in GPT extraction: {e}")
            return None

    def log_and_respond(self, session, user_msg, bot_msg, state=None, status=200):
        if session:
            try:
                log_chat_interaction(session, user_msg, bot_msg)
                logger.info(f"Logged interaction - User: '{user_msg}' Bot: '{bot_msg[:100]}...'")
            except Exception as e:
                logger.warning(f"Failed to log interaction: {e}")
        
        response = {"message": bot_msg}
        if state:
            response["state"] = state
        return JsonResponse(response, status=status)

    def map_time_range_to_days(self, time_range_str):
        """Convert time range string to days for backward compatibility"""
        if not time_range_str:
            return None
        t = time_range_str.lower()
        if "24" in t or "1 tag" in t:
            return 1
        if "7" in t:
            return 7
        if "30" in t:
            return 30
        if "365" in t or "jahr" in t:
            return 365
        return None