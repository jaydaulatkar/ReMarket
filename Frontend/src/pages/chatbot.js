import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar.js";
import styles from "./chatbot.module.css";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { sender: "user", text: inputMessage.trim() };
        setMessages((prev) => [...prev, userMessage]);

        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await axios.post("/api/chat", {
                prompt: userMessage.text,
            });
            const botMessage = { sender: "bot", text: response.data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                sender: "bot",
                text: "Oops! Something went wrong. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetChat = async () => {
        try {
            await axios.post("/api/chat/reset");
            setMessages([]);
        } catch (error) {
            console.error("Error resetting chat:", error);
            alert("Failed to reset chat. Please try again.");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <Navbar title="E-Mart" />

            <div className={styles.outerContainer}>
                {/* Chat Container */}
                <div className={styles.chatCard}>
                    {/* Chat Header */}
                    <div className={styles.chatHeader}>
                        <h2>E-Mart Chatbot</h2>
                        <button
                            onClick={handleResetChat}
                            className={styles.resetButton}
                        >
                            Reset Chat
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className={styles.messagesArea}
                    >
                        {messages.length === 0 && (
                            <div className={styles.emptyState}>
                                Start a conversation with our AI assistant
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${styles.messageRow} ${msg.sender === "user" ? styles.messageRowUser : styles.messageRowBot}`}
                            >
                                <div
                                    className={`${styles.messageBubble} ${msg.sender === "user" ? styles.userBubble : styles.botBubble}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className={`${styles.messageRow} ${styles.messageRowBot}`}>
                                <div className={styles.typingBubble}>
                                    Typing...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Box */}
                    <div className={styles.inputBar}>
                        <div className={styles.inputBarInner}>
                            <input
                                type="text"
                                className={styles.chatInput}
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={styles.sendButton}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}