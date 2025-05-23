import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import chatIcon from "../assets/logo_landlieben.png";

// Dummy list - replace this with the full list or import from a helper
const KNOWN_LOCATIONS = [
  "kusel",
  "rutsweiler",
  "kreimbach_kaulbach",
  "kaulbach",
  "kreimbach",
  "wolfstein",
  "lauterecken",
  "kreimbach_1",
  "kreimbach_3",
  "lohnweiler",
  "hinzweiler",
  "untersulzbach",
  "lohnweiler_rlp",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // State to track follow-up context
  const [awaitingTimeRange, setAwaitingTimeRange] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [currentState, setCurrentState] = useState({
    location: null,
    time_range: null
  });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Load state and messages from sessionStorage
  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    const storedLocation = sessionStorage.getItem("pendingLocation");
    const awaiting = sessionStorage.getItem("awaitingTimeRange") === "true";
    const storedState = sessionStorage.getItem("chatbotState");

    if (storedMessages) {
      const parsed = JSON.parse(storedMessages);
      if (parsed.length > 0) {
        setMessages(parsed);
      } else {
        setMessages([initialBotMessage()]);
      }
    } else {
      setMessages([initialBotMessage()]);
    }

    if (awaiting && storedLocation) {
      setPendingLocation(storedLocation);
      setAwaitingTimeRange(true);
    }

    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        setCurrentState(parsedState);
      } catch (e) {
        console.error("Error parsing stored state:", e);
      }
    }
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Save state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chatbotState", JSON.stringify(currentState));
  }, [currentState]);

  // Watch for bot asking about time range
  useEffect(() => {
    const latestBot = messages
      .slice()
      .reverse()
      .find((m) => !m.fromUser);
    
    if (latestBot && latestBot.text.includes("Für welchen Zeitraum möchtest du")) {
      // Extract the location from the bot's message
      const locationMatch = latestBot.text.match(/für\s+(\w+)\s+sehen/i);
      const location = locationMatch ? locationMatch[1] : extractLocationFromUserMessages(messages);

      if (location) {
        sessionStorage.setItem("awaitingTimeRange", "true");
        sessionStorage.setItem("pendingLocation", location);
        setAwaitingTimeRange(true);
        setPendingLocation(location);
        
        // Update current state with location
        setCurrentState(prev => ({
          ...prev,
          location: location
        }));
      }
    }
  }, [messages]);

  // Extract known location from recent user messages
  const extractLocationFromUserMessages = (msgs) => {
    const userTexts = msgs
      .filter((m) => m.fromUser)
      .map((m) => m.text.toLowerCase());
    for (let i = userTexts.length - 1; i >= 0; i--) {
      for (const loc of KNOWN_LOCATIONS) {
        if (userTexts[i].includes(loc)) return loc;
      }
    }
    return null;
  };

const initialBotMessage = () => ({
  text: `
🌊 **Willkommen beim Wasserstand-Dashboard!**\n\n
Ich kann dir Wasserstandsdaten für verschiedene Messstationen bereitstellen.\n\n
**Verfügbare Messstationen:**\n
• Wolfstein\n
• Rutsweiler a.d. Lauter\n
• Kreimbach 1\n
• Kreimbach 2\n
• Kreimbach 3\n
• Lauterecken\n
• Kusel\n
• Lohnweiler\n
• Lohnweiler (Lauter)\n
• Hinzweiler\n
• Untersulzbach\n\n
**So funktioniert es:**\n
👉 Nenne einen Ort und einen Zeitraum (z.B. 'Kreimbach, 7 Tage')\n
👉 Verfügbare Zeiträume: 24 Stunden, 7 Tage, 30 Tage, 1 Jahr\n
👉 Du kannst allgemeine Anfragen stellen (z.B. 'Daten für Kreimbach, 7 Tage') oder spezifische Fragen wie:\n
   • 'Maximaler Wasserstand in Kusel in den letzten 7 Tagen?'\n
   • 'Wie war der Trend in Lohnweiler im letzten Jahr?'\n\n
**Beispiele:**\n
• 'Kreimbach, letzte 30 Tage'\n
• 'Kusel, 7 Tage'\n
• 'Lohnweiler, 24 Stunden'\n
• 'Was war der niedrigste Wasserstand in Wolfstein in den letzten 30 Tagen?'\n\n
Probiere es einfach aus! 🎯
  `,
  fromUser: false,
});



  const validTimeRanges = [
    "24 stunden",
    "24 hours", 
    "7 tage",
    "7 days",
    "30 tage",
    "30 days",
    "1 jahr",
    "1 year",
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      let userMessage = input.trim();

      // Add to messages immediately for better UX
      setMessages((prev) => [...prev, { text: userMessage, fromUser: true }]);
      setInput("");
      setIsLoading(true);

      // Detect if this is a follow-up to a time range question
      let isFollowUpResponse = false;

      // Check if this looks like a time range selection
      const isTimeRange = validTimeRanges.some((range) =>
        userMessage.toLowerCase().includes(range.toLowerCase())
      );

      // If we were awaiting a time range and this looks like one, mark as follow-up
      if (awaitingTimeRange && isTimeRange) {
        isFollowUpResponse = true;
      }

      try {
        const historyMessages = [
          ...messages,
          { text: userMessage, fromUser: true },
        ].slice(-8);

        const formattedMessages = historyMessages.map((msg) => ({
          role: msg.fromUser ? "user" : "assistant",
          content: msg.text,
        }));

        const requestBody = {
          messages: formattedMessages,
          is_follow_up: isFollowUpResponse,
          pending_location: pendingLocation,
          state: currentState
        };


        

        const response = await fetch("http://127.0.0.1:8000/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        // Update state from backend response
        if (data.state) {
          setCurrentState(data.state);
          
          // Update pending location if needed
          if (data.state.location && data.state.location !== pendingLocation) {
            setPendingLocation(data.state.location);
            sessionStorage.setItem("pendingLocation", data.state.location);
          }
        }

        // Clear follow-up state if this was a successful follow-up
        if (isFollowUpResponse && !data.error) {
          setAwaitingTimeRange(false);
          sessionStorage.removeItem("awaitingTimeRange");
          // Keep pendingLocation until we get a new conversation
        }

        if (data.message) {
          setMessages((prev) => [
            ...prev,
            { text: data.message, fromUser: false },
          ]);
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            { text: `Error: ${data.error}`, fromUser: false },
          ]);
        }
      } catch (error) {
        console.error("Error in API call:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Error connecting to the server.", fromUser: false },
        ]);

        // Clear follow-up state on error
        if (isFollowUpResponse) {
          setAwaitingTimeRange(false);
          sessionStorage.removeItem("awaitingTimeRange");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <>
          <div className="chatbot-header d-flex justify-content-between">
            <h5>Datenanalyst</h5>
            <button className="btn-close" style={{backgroundColor: "white"}} onClick={() => setIsOpen(false)} aria-label="Close"></button>
            
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.fromUser ? "message user-message" : "message bot-message"
                }
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message bot-message">Wird geladen...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Gib deine Nachricht ein..."
              className="form-control"
            />
            <button
              type="submit"
              className="btn btn-primary m-2"
              style={{ backgroundColor: "rgb(220, 53, 69)", borderColor: "rgb(220, 53, 69)" }}
            >
              Senden  
            </button>
          </form>
        </>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center p-2 p-md-3"
          onClick={() => setIsOpen(true)}
        >
          <p className="chat-text fw-bold">Datenanalyst</p>
          <img
            src={chatIcon}
            alt="Chat Icon"
            className="icon"
            style={{ maxHeight: "50px", maxWidth: "50px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;