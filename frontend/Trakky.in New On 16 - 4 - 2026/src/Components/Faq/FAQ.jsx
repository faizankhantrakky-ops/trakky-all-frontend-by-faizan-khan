import React, { useState, useEffect } from "react";
import styles from "./faq.module.css";
import downImage from "../../Assets/images/icons/downArrow.png";
import faqData from "./faqdata"; // Importing FAQ data from external file

const FAQ = () => {
  // State to manage active accordion item
  const [accordionActive, setAccordionActive] = useState(null);
  // State to store filtered FAQ data based on city
  const [filteredFAQData, setFilteredFAQData] = useState([]);

  useEffect(() => {
    // Extract city from the URL and convert it to lowercase
    const pathnameSegments = window.location.pathname.split("/");
    const city = pathnameSegments[1]
      ? pathnameSegments[1].toLowerCase()
      : "default";

    // Filter FAQ data based on the city
    const cityData = faqData[city] || [];
    setFilteredFAQData(cityData);
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  // Function to handle accordion click and toggle active state
  const handleAccordionClick = (index) => {
    setAccordionActive((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.faqMain}>
      <div className={styles.mainContainer}>
        {/* FAQ heading */}
        <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
        <div className={styles.layout}>
          {/* Map through filtered FAQ data and render accordion items */}
          {filteredFAQData.map((item, index) => (
            <div key={index} className={styles.accordion}>
              {/* Checkbox input for accordion */}
              <input
                type="checkbox"
                id={`question${index}`}
                name="q"
                className={styles.questions}
                checked={accordionActive === index}
                onChange={() => handleAccordionClick(index)}
              />
              {/* Label for accordion question */}
              <label htmlFor={`question${index}`} className={styles.question}>
                <p>{item.question}</p>
                {/* Conditional rendering of arrow icon based on active state */}
                <img
                  className={`${styles.arrowImages} ${
                    accordionActive === index ? styles.rotate : ""
                  }`}
                  src={downImage}
                  alt="Scroll Down"
                />
              </label>
              {/* Answer section */}
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
