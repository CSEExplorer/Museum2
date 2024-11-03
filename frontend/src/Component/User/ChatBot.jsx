import React, { useState, useEffect, useRef,useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const apiUrl = process.env.REACT_APP_API_URL;
import chatIcon from "../../Media/User/chatIcon.png"
import {AuthContext} from "../../contexts/AuthContext";
const Chatboard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(true); // State to control chat visibility
  const chatRef = useRef(null);
  


  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

  const handleSendMessage = async () => {
    try {
      const sessionId = getSessionId();
      const token = localStorage.getItem("token");
      console.log(token);

      const response = await axios.post(
        `${apiUrl}/dialogflow_webhook/`,
        {
          message: userInput,
          sessionId: sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(response.data);

      setMessages([
        ...messages,
        { text: userInput, sender: "user" },
        { text: data.response, sender: "bot" },
      ]);

      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle clicks outside the chat container to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false); // Close the chat
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  if (!isAuthenticated) {
    return null; // Don't render the chatbot if the user is not authenticated
  }


  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={styles.openChatButton}>
        <img
          src={chatIcon} 
          alt="Open Chat"
          style={styles.chatButtonImage} // Optional: Add styles to the image
        />
      </button>
    );
  }
 
  return (
    <div ref={chatRef} style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatboard;

// Inline styles for a modern chatbot UI
const styles = {
  chatContainer: {
    maxWidth: "400px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  messagesContainer: {
    padding: "10px",
    maxHeight: "300px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    color: "#333",
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    outline: "none",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    cursor: "pointer",
    outline: "none",
  },
  openChatButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "20px",
    backgroundColor: "transparent",
    color: "black",
    border: "2px solid black",
    cursor: "pointer",
  },
  chatButtonImage: {
    backgroundColor: "transparent",
    width: "30px", // Set the width of the image
    height: "30px", // Set the height of the image
    borderRadius: "50%", // This makes the image circular
    overflow: "hidden", // Ensures that any overflow is hidden
    objectFit: "cover", // This keeps the aspect ratio and fills the circle
  },
};
