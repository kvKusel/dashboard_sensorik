import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'; // Correct path to your CSS file
import chatIcon from '../assets/logo_landlieben.png'; // Replace with your icon path

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Add a loading state

    useEffect(() => {
        if (isOpen) {
            setMessages([{ text: "Hi there! How can I help you today?", fromUser: false }]);
        }
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const userMessage = input;
            setMessages([...messages, { text: userMessage, fromUser: true }]);
            setInput('');
            setIsLoading(true);  // Set loading state while waiting for a response

            try {
                const response = await fetch('http://127.0.0.1:8000/api/chat/', {  // Use Django's local address
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: data.message, fromUser: false }  // Display bot response
                    ]);
                } else {
                    const errorData = await response.json();
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: errorData.error || 'An error occurred', fromUser: false }
                    ]);
                }
            } catch (error) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Failed to connect to the server.', fromUser: false }
                ]);
            }

            setIsLoading(false);  // Stop loading once response is received
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen ? (
                <>
                    <div className="chatbot-header d-flex justify-content-between">
                        <h5>Chatbot</h5>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.fromUser ? "message user-message" : "message bot-message"}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message">
                                Loading...
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSend} className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="form-control"
                        />
                        <button type="submit" className="btn btn-primary m-2" style={{backgroundColor: "rgb(220, 53, 69)"}}>Send</button>
                    </form>
                </>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center p-2 p-md-3" onClick={() => setIsOpen(true)}>
                    <div><p className="chat-text fw-bold">AI-Assistant</p></div>
                    <div><img src={chatIcon} alt="Chat Icon" className="icon" style={{maxHeight: "50px", maxWidth: "50px"}} /></div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
