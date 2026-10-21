import React, { useState } from "react";
import { Link } from "react-router-dom";

function AiAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat([...chat, userMessage]);

    try {
      // Call FastAPI AI chat endpoint
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      console.log(data)

      const aiMessage = { sender: "ai", text: data.reply };

      setChat(prev => [...prev, aiMessage]);
      setMessage("");
    } catch (err) {
      console.error("Error fetching AI response:", err);
    }
  };

  return (
    <div className="chat-container">
     

      <h2 className="chat-title">🤖  Nexus AI Assistant</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-msg" : "ai-msg"}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}> ➤</button>
      </div>
    </div>
  );
}

export default AiAssistant;