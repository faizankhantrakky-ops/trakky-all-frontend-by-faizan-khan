import React, { useEffect } from "react";
import "./ContactInfo.css";

const ContactInfo = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/default";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="contact-info-container">
      <div className="live-chat">
        <h3>Live Chat</h3>
        <div id="tawk-to-widget"></div>
      </div>
    </div>
  );
};

export default ContactInfo;
