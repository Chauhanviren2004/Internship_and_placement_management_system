import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import api, { getApiError } from "../api";

const Messages = () => {
  const [inputText, setInputText] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText("");
    
    // Add user message to chat
    setChat((current) => [...current, { type: "question", text: userMsg }]);
    setLoading(true);

    try {
      const response = await api.post("/chat/", { message: userMsg });
      const botReply = response.data.reply || "No response received.";
      setChat((current) => [...current, { type: "answer", text: botReply }]);
    } catch (err) {
      const errorMsg = getApiError(err, "Failed to get response from AI.");
      setChat((current) => [...current, { type: "answer", text: `Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="messages-container">
        <h2 className="title">AI Help & Support</h2>

        <div className="chat-box" style={{ height: "400px", overflowY: "auto", display: "flex", flexDirection: "column", padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          {chat.length === 0 && (
            <p className="no-messages">Ask me anything about HireHub!</p>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === "question" ? "user" : "bot"}`}
              style={{
                alignSelf: msg.type === "question" ? "flex-end" : "flex-start",
                backgroundColor: msg.type === "question" ? "#007bff" : "#e9ecef",
                color: msg.type === "question" ? "white" : "black",
                padding: "10px",
                borderRadius: "10px",
                margin: "5px 0",
                maxWidth: "80%",
                whiteSpace: "pre-wrap"
              }}
            >
              {msg.text}
            </div>
          ))}
          
          {loading && (
            <div className="message bot" style={{ alignSelf: "flex-start", backgroundColor: "#e9ecef", color: "black", padding: "10px", borderRadius: "10px", margin: "5px 0" }}>
              Typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question..."
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !inputText.trim()}
            style={{ padding: "10px 20px", borderRadius: "4px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default Messages;
