import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const apiUrl = process.env.REACT_APP_API_URL;
import chatIcon from "../../Media/User/chatIcon.png";
import { AuthContext } from "../../contexts/AuthContext";

import WelcomeIntent from "../../ChatBot/WelcomeIntent";
import ProfileIntent from "../../ChatBot/ProfileIntent";
import MuseumIntent from "../../ChatBot/MuseumIntent";
import ShowAvailability from "../../ChatBot/ShowAvailability"
import Booking from "../../ChatBot/Booking";
const Chatboard = () => {
  
  
  const { isAuthenticated } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const chatRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const[museum,setMuseum]= useState(""); 
  const[finalBookingDetail,setfinalBookingDetail]=useState("");
  
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  };

    const resetChat = () => {
    setMessages([]);
    setMuseum("");
    setUserInput("");
  };

  const handleBookClick = (museum) => {
    setMuseum(museum);
    setMessages((prev) => [
      ...prev,
      {
        text:'Enter Date(YYYY-MM-DD)',
        sender: "bot",
      },
    ]);
  };
  
  const handleFinalBooking = (selectedDate, selectedShift) => {
    
    setfinalBookingDetail(`${selectedDate}-${selectedShift.shift_type}`);
    
    if (selectedDate && selectedShift) {
     

   
      setMessages((prev) => [
        ...prev,
        {
          text: `Enter Your Email address`,
          sender: "bot",
        },
      ]);
    } else {
      // Handle cases where either selectedDate or selectedShift is missing
      setMessages((prev) => [
        ...prev,
        {
          text: "Please select a valid date and shift.",
          sender: "bot",
        },
      ]);
    }
  };


  const handleSendMessage = async () => {
    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);
    try {
      const sessionId = getSessionId();
      const token = localStorage.getItem("token");
      const payload = {
         message: userInput,
         sessionId: sessionId,
         musuem: museum,
       };


      const response = await axios.post(
        `${apiUrl}/dialogflow_webhook/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      const { intent, response: botResponse } = data;
      console.log(botResponse);


      switch (intent) {
        case "WelcomeIntent":
          // console.log("hii");
          setMessages((prev) => [
            ...prev,
            {
              component: <WelcomeIntent userName={botResponse} />,
              sender: "bot",
            },
          ]);
          break;

        case "ProfileIntent":
          setMessages((prev) => [
            ...prev,
            {
              component: <ProfileIntent profileData={botResponse} />,
              sender: "bot",
            },
          ]);
          break;

        case "FindMuseumByCity":
          setMessages((prev) => [
            ...prev,
            {
              component: (
                <MuseumIntent
                  museums={botResponse}
                  onBookClick={handleBookClick}
                />
              ),
              sender: "bot",
            },
          ]);

          break;
        case "ShowAvailability":
          setMessages((prev) => [
            ...prev,
            {
              component: (
                <ShowAvailability
                  availabilityData={botResponse}
                  onFinalBooking={handleFinalBooking}
                />
              ),
              sender: "bot",
            },
          ]);
          break;
        case "EmailIntent":
          if (botResponse.error) {
            // If there's an error in the response, show an error message instead of the booking component.
            setMessages((prev) => [
              ...prev,
              {
                component: (
                  <div>
                    <p>Error in creating order. Please try again.</p>
                  </div>
                ),
                sender: "bot",
              },
            ]);
          } else {
            // If no error, proceed with the booking component
            setMessages((prev) => [
              ...prev,
              {
                component: (
                  <Booking
                    order={botResponse} // order data from botResponse
                    bookingDetail = {finalBookingDetail} // Booking details like shifts
                    museumDetails={museum}
                    onresetChat={resetChat} // Museum details
                  />
                ),
                sender: "bot",
              },
            ]);
          }
          break;

        default:
          setMessages((prev) => [
            ...prev,
            { text: botResponse, sender: "bot" },
          ]);
          break;
      }

      
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  if (!isOpen) {
    return (
      <button onClick={() => {setIsOpen(true); resetChat();}} style={styles.openChatButton}>
        <img src={chatIcon} alt="Open Chat" style={styles.chatButtonImage} />
      </button>
    );
  }

  return (
    <div ref={chatRef} style={styles.chatContainer}>
      <div style={styles.messagesContainer} ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.component || msg.text}
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

// Inline styles
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
    padding: "5px",
    maxHeight: "400px",
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
    backgroundColor: "#ADD8E6",
    color: "#333",
    padding: "5px 5px",
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
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    overflow: "hidden",
    objectFit: "cover",
  },
};
