import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import chatIcon from "../assets/logo_landlieben.png";



const API_URL = process.env.REACT_APP_API_URL.endsWith('/')
  ? process.env.REACT_APP_API_URL
  : `${process.env.REACT_APP_API_URL}/`;

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

  // used for scrolling to user's last message if chat is reopened
  const lastUserMessageRef = useRef(null);


  // State to track follow-up context
  const [awaitingTimeRange, setAwaitingTimeRange] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [currentState, setCurrentState] = useState({
    location: null,
    time_range: null
  });


  // Scroll to bottom function, together with the useEffect underneath providing smoother user experience
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };



useEffect(() => {
  if (isOpen) {
    const onlyGreeting =
      messages.length === 1 &&
      !messages[0].fromUser &&
      messages[0].text.includes("Willkommen beim Wasserstand-Dashboard");

    if (onlyGreeting) return;

    // Scroll to last user message if available
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToBottom(); // Fallback
    }
  }
}, [isOpen, messages]);




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
🌊 Herzlich willkommen, ich bin ein KI-Chatbot und helfe Dir bei der Auswertung der gesammelten Daten.
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

        const response = await fetch( `${API_URL}api/chat/`, {
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
            <h5>KI-Assistent</h5>
            <button className="btn-close" style={{backgroundColor: "white"}} onClick={() => setIsOpen(false)} aria-label="Close"></button>
            
          </div>
          <div className="chatbot-messages">
{messages.map((msg, index) => {
  const isLastUserMessage =
    msg.fromUser &&
    index === messages.map(m => m.fromUser).lastIndexOf(true);

  return (
    <div
      key={index}
      ref={isLastUserMessage ? lastUserMessageRef : null}
      className={
        msg.fromUser ? "message user-message" : "message bot-message"
      }
    >
      {msg.text}
    </div>
  );
})}

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
          className="d-flex flex-column align-items-center justify-content-center py-2 px-2"
          onClick={() => setIsOpen(true)}
            style={{ cursor: 'pointer' }} 

        >
          <p className="chat-text fw-bold p-1 m-0">KI-Assistent</p>
          <img
            src={chatIcon}
            alt="Chat Icon"
            className="icon"
            style={{ maxHeight: "50px", maxWidth: "50px" }}
          />
<p className="chat-text fw-bold m-0 p-0">&gt;&gt; Hier klicken &lt;&lt;</p>

        </div>
      )}
    </div>
  );
};

export default Chatbot;