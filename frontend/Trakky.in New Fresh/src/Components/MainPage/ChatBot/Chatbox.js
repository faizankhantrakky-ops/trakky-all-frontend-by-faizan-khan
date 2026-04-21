import React, { useState, useEffect, useRef } from "react";
import { data } from "./trakkytest";
import "./ChatBot.css";
import "./Chatbox.css";
import validator from "validator";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import bot from "../Assets/bot.png";
import TrakkyLogo from "../Assets/trakkylogopurple.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import send from "../../../Assets/images/chatbotimages/send.png";
import { Category, Expand } from "@mui/icons-material";
function Chatbox() {
  const [background, setBackground] = useState("blue");
  const [padding, setPadding] = useState("0px");
  const [expand, setExpand] = useState(true);
  const update = [];
  const elementRef = useRef(null);
  const city = [];
  const area = [];
  const category = ["Hair", "Skin", "Spa", "Make Up"];
  const [btn, setbtn] = useState("visible");
  const [number, setNumber] = useState("");
  const [children, setChildren] = useState([]);
  let salondata = data.filter((item) => {
    return item.model === "salons.salon";
  });
  let salonAllcity = salondata.map((item) => {
    return item.fields.city;
  });

  let saloncity = [...new Set(salonAllcity)];
  const [optbtn, setoptbtn] = useState(saloncity);
  let salonAllarea = salondata.map((item) => {
    return item.fields.area;
  });

  let salonarea = [...new Set(salonAllarea)];

  useEffect(() => {
    console.log(background);
  }, [background]);

  const scrollToElement = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  // Send number functionality
  function sendNumberHandler() {
    if (typeof number === "string" && number.trim() !== "") {
      // Check if 'number' is a non-empty string
      if (validator.isMobilePhone(number, "en-IN")) {
        if (update.length === 0) {
          setPadding("42px");
          scrollToElement();
          let newChild = {
            user: number,
            us: (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <p className="chatbox_heading">Select City</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="chatbot_ul">
                    {saloncity.map((item) => (
                      <li key={item} onClick={areaHandler} id={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            ),
          };
          setChildren((prevChildren) => [...prevChildren, newChild]);
          setbtn("hidden");
          update.push("updated");
          // console.log(update.length);
        } else {
          let newChild = {
            user: "Select another city & area",
            us: (
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <p className="chatbox_heading">Select City</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ul className="chatbot_ul">
                    {saloncity.map((item) => (
                      <li key={item} onClick={areaHandler} id={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            ),
          };
          setChildren((prevChildren) => [...prevChildren, newChild]);
        }
      } else {
        alert("Please enter a valid mobile number");
      }
    } else {
      alert("Please enter a valid number");
    }
  }

  // Area Handler
  function areaHandler(e) {
    scrollToElement();
    let selectedCity = e.target.id;
    city.push(selectedCity);
    // setCity(selectedCity);
    // console.log(city);
    // console.log(selectedCity);

    // Filter areas based on the selected city
    const filteredAreas = data
      .filter((item) => {
        return (
          item.fields.city === selectedCity &&
          !salonarea.includes(item.fields.area) &&
          item.fields.area !== null &&
          item.fields.area !== undefined
        );
      })
      .map((item) => item.fields.area);
    let newSet = [...new Set(filteredAreas)];
    console.log(newSet);
    let newChild = {
      user: selectedCity,
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <p className="chatbox_heading">Select Area </p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              {newSet.map((area, index) => (
                <li key={index} id={area} onClick={CategoryHandler}>
                  {area}
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    setChildren((prevChildren) => [...prevChildren, newChild]);
  }
  // useEffect(()=>{
  //   console.log(expand)
  // },[expand])
  function CategoryHandler(e) {
    console.log(children);
    let selectedArea = e.target.id;
    area.push(selectedArea);
    scrollToElement();
    let newChild = {
      user: e.target.id,
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <p className="chatbox_heading">Select Category</p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              {category.map((item, index) => (
                <li key={index} id={item} onClick={SegmentHandler}>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    setChildren((prevChildren) => [...prevChildren, newChild]);
  }
  function SegmentHandler(e) {
    scrollToElement();
    let newChild = {
      user: e.target.id, // Assuming number is defined elsewhere
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <p className="chatbox_heading">Select an option</p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              <li id="Book an appointment" onClick={bookHandler}>
                Book an appointment
              </li>
              <li id="Which benefits do you want?" onClick={benefitsHandler}>
                Which benefits do you want?
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    setChildren((prevChildren) => [...prevChildren, newChild]);
    console.log(children[0].user);
  }
  function benefitsHandler(e) {
    scrollToElement();
    let newChild = {
      user: e.target.id, // Assuming number is defined elsewhere
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <p className="chatbox_heading">Select an option</p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              <li id="Get an offer" onClick={getOfferHandler}>
                Get Offers
              </li>
              <li id="Popular & Top Rated Salons" onClick={topRatedHandler}>
                Popular & Top Rated Salons
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    setChildren((prevChildren) => [...prevChildren, newChild]);
  }
  function getOfferHandler(e) {
    scrollToElement();
    console.log("clicked");
  }
  function topRatedHandler(e) {
    scrollToElement();
    let lastindexCity = city.length - 1;
    let newcity = city[lastindexCity];
    let link = `https://trakky.in/${newcity}/topratedsalons`;
    let newChild = {
      user: e.target.id, // Assuming number is defined elsewhere
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <p className="chatbox_heading">Top Rated Salons in {newcity}</p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              <li id="Book an appointment">
                <a href={link} target="_blank">
                  Click here to book an appointment at top rated salons in{" "}
                  {newcity}
                </a>
              </li>
              <li onClick={sendNumberHandler}>Select another city and area</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    console.log(children);
    setChildren((prevChildren) => [...prevChildren, newChild]);
  }
  function bookHandler(e) {
    let lastindexCity = city.length - 1;
    let lastindexArea = area.length - 1;
    scrollToElement();
    let link = `https://trakky.in/${city[lastindexCity]}/salons/${area[
      lastindexArea
    ]
      .toLowerCase()
      .replace(" ", "-")}`;
    console.log(link);
    let newChild = {
      user: e.target.id, // Assuming number is defined elsewhere
      us: (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <p className="chatbox_heading">Salons near you</p>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="chatbot_ul">
              <li id="Book an appointment">
                <a href={link} target="_blank">
                  Salons in {area[lastindexArea]}
                </a>
              </li>
              <li onClick={sendNumberHandler}>Select another city & area</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      ),
    };
    children.push(newChild);
    console.log(children);
    setChildren((prevChildren) => [...prevChildren, newChild]);
  }
  function ChangeCityareaHandler() {
    scrollToElement();
  }
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      sendNumberHandler();
    }
  }
  return (
    <div>
      <div className="chat-box-div-2">
        <div
          className="chatbot_greet"
          style={{ paddingLeft: "8px", paddingTop: padding }}
        >
          <p className="bot-text" style={{ width: "200px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#512DC8",
                marginBottom: "10px",
              }}
            >
              Priya
            </span>
            <br />
            <span>Hello,enter your mobile number for further procedure</span>
          </p>
        </div>
        <div className="chatbot_parent">
          {children.map((child, index) => (
            <>
              <div className="chatbot_parent1">
                <div key={index} className="chatbot_user">
                  {child.user}
                </div>
              </div>
              <div className="chatbot_parent2">
                <div
                  key={index}
                  className={"chatbot_us"}
                  onClick={() => {
                    setBackground("black");
                  }}
                >
                  {child.us}
                </div>
              </div>
            </>
          ))}
        </div>
        <div
          className="chatbox_input"
          style={{ visibility: btn }}
          ref={elementRef}
        >
          <input
            className="chatbot_input"
            type="number"
            onChange={(e) => {
              setNumber(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <img
            src={send}
            alt="Send Message"
            className="send_button_chatbox"
            onClick={sendNumberHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
