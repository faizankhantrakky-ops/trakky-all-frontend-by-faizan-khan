import React, { useEffect, useState } from "react";
import './aboutus.css'

const AboutUsSalon = (props) => {
    const [showMore, setShowMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [formatedString, setFormatedString] = useState("");
    const handleClick = () => {
      setShowMore(!showMore);
    };
  
    useEffect(() => {
      if (props.about?.length > 300) {
        setHasMore(true);
      }
    }, [props.about]);
  
    return (
      <div
        className="N-salon_about_us__container "
        style={{
          display: props.about !== "" ? "block" : "none",
        }}
      >  
        <div className="N-salon_about_us__description">
          <p>
            {showMore
              ? props.about
              : props.about?.length > 300
              ? `${props.about.substring(0, 300)}...`
              : props.about}
          </p>
          <button onClick={handleClick}>
            {hasMore ? (showMore ? "Show Less" : "Show More") : ""}
          </button>
        </div>
      </div>
    );
  };

export default AboutUsSalon;