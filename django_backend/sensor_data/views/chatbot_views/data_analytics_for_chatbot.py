import numpy as np
import requests
from datetime import datetime
from dateutil import parser

from django.http import JsonResponse
from django.views import View
import numpy as np
import requests
from dateutil import parser
import difflib # for fuzzy matching of location names 


QUERY_TYPE_MAP = {
    "kusel": "water_level_kv",
    "rutsweiler": "water_level_rutsweiler",
    "wolfstein": "water_level_wolfstein",
    "lauterecken": "water_level_lauterecken_1",
    "kreimbach_1": "water_level_kreimbach_1",
    "kreimbach 1": "water_level_kreimbach_1",

    "kreimbach 2": "water_level_kreimbach_3",  # Corrected mapping
    "kreimbach_2": "water_level_kreimbach_3",  # Corrected mapping for consistency
    "kreimbach_3": "water_level_kreimbach_kaulbach", # Corrected mapping
    "kreimbach 3": "water_level_kreimbach_kaulbach", # Corrected mapping

    "lohnweiler (mausbach)": "water_level_lohnweiler_1",
    "mausbach": "water_level_lohnweiler_1",
    "hinzweiler": "water_level_hinzweiler_1",
    "untersulzbach": "water_level_untersulzbach",
    "lohnweiler_rlp": "water_level_lohnweiler_rlp",
    
    "lohnweiler (lauter)": "water_level_lohnweiler_rlp",
    "lauter": "water_level_lohnweiler_rlp",
}

def get_water_level_analytics(location, days):
    loc_key = location.strip().lower()
    query_type = QUERY_TYPE_MAP.get(loc_key)
    if not query_type:
        # Use difflib to find closest matches
        close_matches = difflib.get_close_matches(loc_key, QUERY_TYPE_MAP.keys(), n=1, cutoff=0.6)
        if close_matches:
            suggestion = close_matches[0]
            return {
                "error": (
                    f"Ich bin mir nicht sicher, welchen Ort du meinst mit '{location}'. "
                    f"Meintest du vielleicht '{suggestion}'? Bitte bestätige oder korrigiere den Ortsnamen."
                )
            }
        else:
            return {
                "error": (
                    f"Ich konnte keinen passenden Ort für '{location}' finden. "
                    "Bitte überprüfe den Ortsnamen und gib ihn genauer an."
                )
            }

    wl_resp = requests.get(
        f"https://scdash.eu.pythonanywhere.com/water-level-data/?query_type={query_type}&time_range={days}d"
    )
    wl_data = wl_resp.json()

    # Fetch precipitation data
    pr_resp = requests.get(f"https://scdash.eu.pythonanywhere.com/api/historical-precipitation/?time_range={days}d")
    pr_data = pr_resp.json()
    
    
    if isinstance(wl_data, dict) and "readings" in wl_data:
        wl_data = wl_data["readings"]

    if not wl_data or not isinstance(wl_data, list):
        raise ValueError(f"No water level data found (raw response: {wl_resp.json()})")

    water_levels = [point['water_level_value'] for point in wl_data]
    wl_timestamps = [parser.isoparse(point['timestamp']) for point in wl_data]

    if len(water_levels) < 2:
        raise ValueError("Not enough water level data")

    trend = (
        "rising" if water_levels[-1] > water_levels[0]
        else "falling" if water_levels[-1] < water_levels[0]
        else "stable"
    )
    mean = float(np.mean(water_levels))
    std_dev = float(np.std(water_levels))
    variance = float(np.var(water_levels))
    median = float(np.median(water_levels))
    count = len(water_levels)
    missing = len(wl_data) - count

    total_days = (wl_timestamps[-1] - wl_timestamps[0]).total_seconds() / 86400
    rate_of_change = round((water_levels[-1] - water_levels[0]) / total_days, 2) if total_days > 0 else None

    x = np.array([(ts - wl_timestamps[0]).total_seconds() / 3600 for ts in wl_timestamps])
    y = np.array(water_levels)
    slope, _ = np.polyfit(x, y, 1)
    regression_slope = round(slope, 4)

    spikes = []
    for i in range(1, len(water_levels)):
        delta = abs(water_levels[i] - water_levels[i - 1])
        delta_time = (wl_timestamps[i] - wl_timestamps[i - 1]).total_seconds() / 3600
        if delta_time > 0 and delta / delta_time > 10:
            spikes.append({
                "timestamp": wl_timestamps[i].isoformat(),
                "change": round(delta, 2),
                "rate_cm_per_hour": round(delta / delta_time, 2)
            })

    unusual_jumps = []
    for i in range(1, len(water_levels)):
        change = abs(water_levels[i] - water_levels[i - 1])
        if change > (2 * std_dev):
            unusual_jumps.append({
                "timestamp": wl_timestamps[i].isoformat(),
                "jump": round(change, 2)
            })

    out_of_range = [
        {
            "timestamp": ts.isoformat(),
            "value": val
        }
        for ts, val in zip(wl_timestamps, water_levels)
        if val < 0 
    ]

    pr_values = [p['precipitation'] for p in pr_data if 'precipitation' in p]
    correlation = None
    if len(pr_values) == len(water_levels):
        correlation = round(np.corrcoef(water_levels, pr_values)[0][1], 2)

    return {
        "location": location,
        "days": days,
        "latest_value": round(water_levels[-1], 2),
        "last_measurement_time": wl_timestamps[-1].isoformat(),
        "trend": trend,
        "mean": round(mean, 2),
        "min": min(water_levels),
        "min_time": wl_timestamps[water_levels.index(min(water_levels))].isoformat(),
        "max": max(water_levels),
        "max_time": wl_timestamps[water_levels.index(max(water_levels))].isoformat(),
        "rate_of_change_cm_per_day": rate_of_change,
        "regression_slope_cm_per_hour": regression_slope,
        "correlation_with_precipitation": correlation,
        "spike_count": len(spikes),
        "spike_timestamps": [s["timestamp"] for s in spikes[:3]],
        "unusual_jump_count": len(unusual_jumps),
        "unusual_jump_timestamps": [j["timestamp"] for j in unusual_jumps[:3]],
        "out_of_range_count": len(out_of_range),
        "out_of_range_timestamps": [o["timestamp"] for o in out_of_range[:3]],
    }


class DataAnalyticsForChatbot(View):
    def get(self, request, *args, **kwargs):
        try:
            location = request.GET.get("location", "lohnweiler")
            time_range = request.GET.get("time_range", "").lower().strip()

            if "h" in time_range:
                # e.g. "24 h"
                hours = int(''.join(filter(str.isdigit, time_range)))
                days = max(1, hours // 24)
            elif "tag" in time_range or time_range.endswith("d"):
                # e.g. "7 tage", "30d"
                days = int(''.join(filter(str.isdigit, time_range)))
            else:
                days = int(request.GET.get("days", 365))

            result = get_water_level_analytics(location=location, days=days)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
