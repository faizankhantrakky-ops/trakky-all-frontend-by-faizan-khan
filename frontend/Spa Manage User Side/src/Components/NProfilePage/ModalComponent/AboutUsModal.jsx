import React from "react";
import { useState } from "react";
import "./spaprofilemodal.css";

const AboutUsModal = ({ spa ,handleAboutUsClose }) => {
  const [isViewMore, setIsViewMore] = useState(false);

  const handleViewMore = () => {
    setIsViewMore(!isViewMore);
  };


  return (
    <div className="SP-about-us-container">
      <div className="SP-salon-facilities-close">
        <div className="SP-salon-faci">
          {spa?.facilities?.map((facility, index) => {
            return (
              <div className="SP-salon-faci-item" key={index}>
                <img
                  src={require(`./../../../Assets/images/icons/${
                    index + 6
                  }.png`)}
                  alt="facility"
                />
                <span>{facility}</span>
              </div>
            );
          })}
        </div>
        <div className="SP-salon-close-btn"
        onClick={handleAboutUsClose}
        >X</div>
      </div>
      <div className="SP-salon-about-us-m">
        <h2>About Spa</h2>
        <p>
          {spa?.about_us.length > 110
            ? !isViewMore
              ? spa?.about_us.slice(0, 110)
              : spa?.about_us
            : spa?.about_us}
        </p>
        {spa?.about_us.length > 110 && (
            <span onClick={handleViewMore} style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "gray",  
            }}>
              {isViewMore ? "Show Less" : "...Show More"}
            </span>
          )}
      </div>
    </div>
  );
};

export default AboutUsModal;
