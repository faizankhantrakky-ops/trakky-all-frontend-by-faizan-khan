import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CloseIcon from "@mui/icons-material/Close";
import Chatbox2 from "./Chatboxcopy";
import logo from "../../../Assets/images/chatbotimages/logo.png";
import { useSearchParams } from "react-router-dom";

const ChatBot = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#724ae8");

  // Handle body scroll when chatbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('chatbox-open');
    } else {
      document.body.classList.remove('chatbox-open');
    }

    return () => {
      document.body.classList.remove('chatbox-open');
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchParams({ chatbot: !isOpen });
      setBgColor("#0056b3");
    } else {
      setSearchParams("");
      setBgColor("#724ae8");
    }
  };

  // Close chatbox when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatBot = document.querySelector('.chat-bot');
      if (isOpen && chatBot && !chatBot.contains(event.target)) {
        setIsOpen(false);
        setSearchParams("");
        setBgColor("#724ae8");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setSearchParams]);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && window.innerWidth <= 768 && (
        <div className="chatbox-backdrop active" onClick={toggleChat} />
      )}
      
      <div
        className={`chat-bot ${isOpen ? "chatbot_open" : ""}`}
        style={{ zIndex: 99999 }}
      >
        <div 
          className="chatbot_icon-container" 
          onClick={toggleChat}
          style={{ zIndex: 99999 }}
        >
          <QuestionAnswerIcon
            className={`chatbot_icon ${isOpen ? "hide" : "show"}`}
          />
          <CloseIcon className={`chatbot_icon ${isOpen ? "show" : "hide"}`} />
        </div>
        <div 
          className={`chat-box ${isOpen ? "open" : ""}`}
          style={{ zIndex: 99998 }}
        >
          <div className="chat-box-div-1">
            <div className="talktotrakky_chatbot">
              <p className="chat-box-div-1-p">Talk to</p>
              <img
                src={logo}
                alt="Trakky Chatbot Logo"
                className="span_logo_chatbot"
              />
            </div>

            <p className="chat-box-div-2-p pb-5">
              Get best salon booking experience with Trakky
            </p>
          </div>
          <Chatbox2 />
        </div>
      </div>
    </>
  );
};

export default ChatBot;