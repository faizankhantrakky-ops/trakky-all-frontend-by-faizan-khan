import React from "react";
import { useState } from "react";
import "./salonprofilemodal.css";
import { X } from "lucide-react";

const AboutUsModal = ({ salon, handleAboutUsClose }) => {
  const [isViewMore, setIsViewMore] = useState(false);

  const handleViewMore = () => {
    setIsViewMore(!isViewMore);
  };

  return (
    // Ye div add karo – yeh overlay ko block karega aur modal ko top pe layega
    <div className="SP-about-us-backdrop" onClick={handleAboutUsClose}>
      <div 
        className="SP-about-us-container" 
        onClick={(e) => e.stopPropagation()} // ye important hai – click inside modal se close na ho
      >
        <div className="SP-salon-facilities-close">
          <div className="SP-salon-faci">
            {salon?.facilities?.map((facility, index) => (
              <div className="SP-salon-faci-item" key={index}>
                <img
                  src={require(`./../../../../Assets/images/icons/${index + 6}.png`)}
                  alt=""
                />
                <span>{facility}</span>
              </div>
            ))}
          </div>
          <div className="SP-salon-close-btn" onClick={handleAboutUsClose}>
            <X size={20} strokeWidth={2} />
          </div>
        </div>

        <div className="SP-salon-about-us-m">
          <h2>About Salon</h2>
          <p>
            {salon?.about_us.length > 110
              ? !isViewMore
                ? salon?.about_us.slice(0, 110)
                : salon?.about_us
              : salon?.about_us}
          </p>
          {salon?.about_us.length > 110 && (
            <span
              onClick={handleViewMore}
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "gray",
                cursor: "pointer"
              }}
            >
              {isViewMore ? "Show Less" : "...Show More"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;