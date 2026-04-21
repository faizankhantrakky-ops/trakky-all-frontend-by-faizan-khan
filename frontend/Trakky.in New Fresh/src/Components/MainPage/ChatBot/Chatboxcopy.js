import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";
import "./Chatbox.css";
import validator from "validator";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import send from "../../../Assets/images/chatbotimages/send.png";
import { useNavigate } from "react-router-dom";

function Chatbox() {
  // State declarations
  const [saloncity, setSaloncity] = useState([]);
  const [salonarea, setSalonarea] = useState([]);
  const [salonCategories, setSalonCategories] = useState([]);
  const [maleServices, setMaleServices] = useState([]);
  const [femaleServices, setFemaleServices] = useState([]);
  const [visibility, setVisibility] = useState("visible");
  const [padding, setPadding] = useState("0px");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [priya, setPriya] = useState([]);
  const [inputType, setInputType] = useState("text");
  const [salons, setSalons] = useState([]);
  const navigate = useNavigate();

  // Refs for scrolling and selections
  const elementRef = useRef(null); // For input field
  const latestMessageRef = useRef(null); // For latest message or accordion

  // UseRef for selections to avoid state timing issues
  const selectionsRef = useRef({
    selectedCity: "",
    selectedArea: "",
    selectedCategory: "",
    selectedService: "",
    selectedGender: "",
    name: "",
    number: "",
  });

  // State for UI updates
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [number, setNumber] = useState("");

  // Update selectionsRef when state changes
  useEffect(() => {
    selectionsRef.current = {
      selectedCity,
      selectedArea,
      selectedCategory,
      selectedService,
      selectedGender,
      name,
      number,
    };
  }, [
    selectedCity,
    selectedArea,
    selectedCategory,
    selectedService,
    selectedGender,
    name,
    number,
  ]);

  // Scroll to latest message when priya or children updates
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [priya, children]);

  // Helper functions
  const getISTTime = () => {
    const currentDate = new Date();
    return `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  };

  // Data fetching effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("https://backendapi.trakky.in/salons/city/"),
          fetch("https://backendapi.trakky.in/salons/category/"),
          fetch("https://backendapi.trakky.in/salons/service/"),
        ]);

        const [citiesData, categoriesData, servicesData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setSalons(citiesData.payload);
        setSalonCategories([
          ...new Set(categoriesData.map((item) => item.category_name)),
        ]);

        const maleServices = servicesData
          .filter((item) => item.gender === "male")
          .map((item) => item.service_name);
        const femaleServices = servicesData
          .filter((item) => item.gender === "female")
          .map((item) => item.service_name);
        const commonServices = servicesData
          .filter((item) => !item.gender || item.gender === "unisex")
          .map((item) => item.service_name);

        setMaleServices([...new Set([...maleServices, ...commonServices])]);
        setFemaleServices([...new Set([...femaleServices, ...commonServices])]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSaloncity(salons.map((item) => item.name));
    setSalonarea(salons.map((item) => item.area_names));
  }, [salons]);

  // Handler functions
  function sendNameHandler() {
   
    setInputType("number");
    setPriya((prev) => [
      ...prev,
      {
        time: getISTTime(),
        user: name,
        us: `Hi ${name}! Please provide your number for better experience?`,
        next: sendNumberHandler,
      },
    ]);
  }

  function sendNumberHandler() {
    if (!validator.isMobilePhone(number, "en-IN")) {
      alert("Please enter a valid mobile number");
      return;
    }
    setVisibility("hidden");
    setChildren((prev) => [
      ...prev,
      {
        quote: "In which city are you interested in booking a salon?",
        heading: "Select city",
        user: number,
        us: saloncity,
        next: areaHandler,
      },
    ]);
    setActiveAccordion(0);
  }

  function areaHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const city = e.currentTarget.textContent || e.currentTarget.id;
    setSelectedCity(city);
    setPadding("45px");

    const areas = salons.find((item) => item.name === city)?.area_names || [];

    setChildren((prev) => {
      const newIndex = prev.length;
      setTimeout(() => setActiveAccordion(newIndex), 100);
      return [
        ...prev,
        {
          quote: "Explore the beauty in every corner of your city",
          heading: "Select Area",
          user: city,
          us: areas,
          next: CategoryHandler,
        },
      ];
    });
  }

  function CategoryHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const area = e.target.textContent || e.target.id;
    setSelectedArea(area);

    setChildren((prev) => {
      const newIndex = prev.length;
      setTimeout(() => setActiveAccordion(newIndex), 100);
      return [
        ...prev,
        {
          quote: "What service category are you looking for?",
          heading: "Select Category",
          user: area,
          us: salonCategories,
          next: GenderHandler,
        },
      ];
    });
  }

  function GenderHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const category = e.target.textContent || e.target.id;
    setSelectedCategory(category);

    setChildren((prev) => {
      const newIndex = prev.length;
      setTimeout(() => setActiveAccordion(newIndex), 100);
      return [
        ...prev,
        {
          quote: "Please select your gender to see relevant services",
          heading: "Select Gender",
          user: category,
          us: ["Male", "Female"],
          next: ServiceHandler,
        },
      ];
    });
  }

  function ServiceHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const gender = e.target.textContent || e.target.id;
    setSelectedGender(gender);

    const servicesToShow = gender === "Male" ? maleServices : femaleServices;

    setChildren((prev) => {
      const newIndex = prev.length;
      setTimeout(() => setActiveAccordion(newIndex), 100);
      return [
        ...prev,
        {
          quote: `What specific ${gender} service are you interested in?`,
          heading: "Select Service",
          user: gender,
          us: servicesToShow,
          next: SegmentHandler,
        },
      ];
    });
  }

  function SegmentHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    const service = e.target.textContent || e.target.id;
    setSelectedService(service);

    setChildren((prev) => {
      const newIndex = prev.length;
      setTimeout(() => setActiveAccordion(newIndex), 100);
      return [
        ...prev,
        {
          quote: "Make an instant reservation or explore benefits",
          heading: "Select an option",
          user: service,
          us: ["Book an appointment", "Benefits for you only!"],
          next: segmentHanlder2,
        },
      ];
    });
  }

  function segmentHanlder2(e) {
    e.preventDefault();
    e.stopPropagation();

    const option = e.target.textContent || e.target.id;
    const currentSelections = selectionsRef.current;

    if (option === "Book an appointment") {
      if (
        !currentSelections.selectedCity ||
        !currentSelections.selectedArea ||
        !currentSelections.selectedCategory ||
        !currentSelections.selectedService
      ) {
        alert("Please complete all selections before booking.");
        return;
      }

      navigate(`/${currentSelections.selectedCity.toLowerCase()}/offerpage`, {
        state: {
          selectedArea: currentSelections.selectedArea,
          selectedCity: currentSelections.selectedCity,
          category: currentSelections.selectedCategory,
          service: currentSelections.selectedService,
          scrollToSalons: true,
        },
      });
    } else {
      setChildren((prev) => {
        const newIndex = prev.length;
        setTimeout(() => setActiveAccordion(newIndex), 100);
        return [
          ...prev,
          {
            quote:
              "Explore offers on WhatsApp or book an appointment at top rated salons",
            heading: "Select an option",
            user: option,
            us: [
              <span
                key="whatsapp"
                onClick={redirectToWhatsApp}
                style={{ display: "flex", width: "100%", cursor: "pointer" }}
              >
                Get offers
              </span>,
              "Top rated salons",
            ],
            next: next,
          },
        ];
      });
    }
  }

  const redirectToWhatsApp = () => {
    const currentSelections = selectionsRef.current;

    if (
      !currentSelections.selectedCity ||
      !currentSelections.selectedArea ||
      !currentSelections.selectedCategory ||
      !currentSelections.selectedService ||
      !currentSelections.selectedGender
    ) {
      alert("Please complete all selections before getting offers.");
      return;
    }

    const phoneNumber = "6355167304";
    const defaultMessage = `Hello! I'm a ${currentSelections.selectedGender} in ${currentSelections.selectedCity} and looking for offers at ${currentSelections.selectedArea} for ${currentSelections.selectedCategory} services (specifically ${currentSelections.selectedService}).`;
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const option = e.target.textContent || e.target.id;

    if (
      option === "select another city & area" ||
      option === "Select another city & area"
    ) {
      setChildren((prev) => {
        const newIndex = prev.length;
        setTimeout(() => setActiveAccordion(newIndex), 100);
        return [
          ...prev,
          {
            quote: "In which city are you interested in booking a salon?",
            heading: "Select City",
            user: option,
            us: saloncity,
            next: areaHandler,
          },
        ];
      });
    } else if (option === "Top rated salons") {
      const currentSelections = selectionsRef.current;

      if (!currentSelections.selectedCity) {
        alert("Please select a city first.");
        return;
      }

      navigate(
        `/${currentSelections.selectedCity.toLowerCase()}/topratedsalons`
      );
    }
  };

  // API call useEffect with scrolling
  useEffect(() => {
    const currentSelections = selectionsRef.current;

    if (
      currentSelections.selectedService &&
      currentSelections.name &&
      currentSelections.number &&
      currentSelections.selectedCity &&
      currentSelections.selectedArea &&
      currentSelections.selectedCategory
    ) {
      const payload = {
        name: currentSelections.name,
        number: currentSelections.number,
        city: currentSelections.selectedCity,
        area: currentSelections.selectedArea,
        category: currentSelections.selectedCategory,
        service: currentSelections.selectedService,
        children: [],
      };

      axios
        .post("https://backendapi.trakky.in/salons/chatbox/chatdata/", payload)
        .then((response) => {
          console.log("API success:", response.data);
          // Optionally update state with API response if needed
          // Example: setPriya((prev) => [...prev, { time: getISTTime(), user: "API", us: response.data.message }]);
          // Scroll will be handled by the useEffect watching priya/children
        })
        .catch((error) => {
          console.error("API error:", error.response?.data || error.message);
        });
    }
  }, [selectedService]);

  return (
    <div>
      <div className="chat-box-div-2">
        <div className="inputName_chatbox"></div>
        <div
          className="chatbot_greet"
          style={{
            paddingLeft: "8px",
            paddingTop: padding,
            flexDirection: "column",
          }}
        >
          <p className="bot-text mt-5" style={{ width: "200px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#512DC8",
                marginBottom: "10px",
              }}
            >
              Trakky
            </span>
            <br />
            <span>Hello! What is your good name?</span>
          </p>
          {priya.map((item, index) => (
            <React.Fragment key={index}>
              <div className="chatbot_parent1 sm:ml-64 md:ml-[200px]">
                <div className="chatbot_user">{item.user}</div>
              </div>
              <p
                className="bot-text"
                style={{ width: "2000px" }}
                ref={index === priya.length - 1 ? latestMessageRef : null} // Attach ref to latest message
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#512DC8",
                    marginBottom: "10px",
                  }}
                >
                  Trakky
                </span>
                <br />
                <span>{item.us}</span>
              </p>
            </React.Fragment>
          ))}
        </div>
        <div className="chatbot_parent">
          {children.map((child, index) => (
            <React.Fragment key={index}>
              <div className="chatbot_parent1">
                <div className="chatbot_user">{child.user}</div>
              </div>
              <div
                className="chatbot_parent2"
                ref={index === children.length - 1 ? latestMessageRef : null} // Attach ref to latest accordion
              >
                <div className="chatbot_us">
                  <Accordion
                    expanded={activeAccordion === index}
                    onChange={() =>
                      setActiveAccordion(
                        activeAccordion === index ? null : index
                      )
                    }
                  >
                    <AccordionSummary
                      aria-controls="panel-content"
                      id="panel-header"
                    >
                      <p style={{ padding: "10px 0px" }}>{child.quote}</p>
                      <p className="chatbox_heading">
                        {child.heading} <ExpandMoreIcon />
                      </p>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="chatbot_ul">
                        {child.us.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              child.next(e);
                            }}
                            id={typeof item === "string" ? item : ""}
                            style={{ cursor: "pointer", padding: "8px 16px" }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div
          className="chatbox_input"
          style={{ visibility: visibility }}
          ref={elementRef}
        >
          <input
            className="chatbot_input"
            type={inputType}
            value={inputType === "text" ? name : number}
            onChange={
              inputType === "text"
                ? (e) => setName(e.target.value)
                : (e) => setNumber(e.target.value)
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                inputType === "text" ? sendNameHandler() : sendNumberHandler();
              }
            }}
            placeholder={
              inputType === "text" ? "Enter your name" : "Enter your number"
            }
          />
          <img
            src={send}
            alt="Send Message"
            className="send_button_chatbox"
            onClick={inputType === "text" ? sendNameHandler : sendNumberHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;