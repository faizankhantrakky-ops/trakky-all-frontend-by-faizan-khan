import React, { useState, useEffect, useRef } from "react";
import styles from "./faq.module.css";
import downImage from "../../Assets/images/icons/downArrow.png";
import faqData from "./faqdata"; 

const FAQ = () => {
  const [accordionActive, setAccordionActive] = useState(null);
  const [filteredFAQData, setFilteredFAQData] = useState([]);
  const questionRefs = useRef([]);

  useEffect(() => {
    const pathnameSegments = window.location.pathname.split("/");
    const city = pathnameSegments[1]
      ? pathnameSegments[1].toLowerCase()
      : "default";

    const cityData = faqData[city] || [];
    setFilteredFAQData(cityData);
  }, []);
  // Scroll to the selected FAQ question when accordion is expanded
  useEffect(() => {
    if (accordionActive !== null && questionRefs.current[accordionActive]) {
      const questionElement = questionRefs.current[accordionActive];
      const yOffset = -100; // Adjust this value to control scroll position
      const y = questionElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [accordionActive]);
  
  const handleAccordionClick = (index) => {

    setAccordionActive((prevIndex) => (prevIndex === index ? null : index));

  };



  return (
    <div className={styles.faqMain}>
      <div className={styles.mainContainer}>
        <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
        <div className={styles.layout}>
          {filteredFAQData.map((item, index) => (
            <div key={index} className={styles.accordion}>
              <input
                type="checkbox"
                id={`question${index}`}
                name="q"
                className={styles.questions}
                checked={accordionActive === index}
                onChange={() => handleAccordionClick(index)}
              />
              <label
                htmlFor={`question${index}`}
                className={styles.question}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <p>{item.question}</p>
                <img
                  className={`${styles.arrowImages} ${
                    accordionActive === index ? styles.rotate : ""
                  }`}
                  src={downImage}
                  alt="img"
                />
              </label>
              <div className={styles.answers}>
                <div className={styles.ansText}>{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
