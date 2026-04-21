import React, { useState, useEffect } from "react";
import "./Report.css";

import toast, { Toaster } from "react-hot-toast";

const Report = () => {
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [spaList, setSpaList] = useState([]);
  const [selectedSpa, setSelectedSpa] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    // Fetch city list from your API
    fetch("https://backendapi.trakky.in/spas/city/")
      .then((response) => response.json())
      .then((data) => setCityList(data.payload))
      .catch((error) => console.error("Error fetching city list:", error));
  }, []);

  useEffect(() => {
    // Fetch spa list based on the selected city from your API
    if (selectedCity) {
      fetch(`https://backendapi.trakky.in/spas/?city=${selectedCity}`)
        .then((response) => response.json())
        .then((data) => setSpaList(data.results))
        .catch((error) => console.error("Error fetching spa list:", error));
    }
  }, [selectedCity]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSpaChange = (event) => {
    setSelectedSpa(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the submission logic, e.g., send a request to the server
    // Add further actions as needed
    toast.success("Report submitted successfully!");

    // Reset the form
    setSelectedCity("");
    setSelectedSpa("");
    setExperience("");
  };

  return (
    <div className="report-container">
      <Toaster />
      <h1 className="edit-P-C-heading report-heading">Report spa</h1>
      <div className="report-form">
        <div className="PP-form-item">
          <select
            className="select-city"
            id="citySelect"
            style={{ color: "black" }}
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select a City</option>
            {cityList.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <label htmlFor="experienceTextarea">City:</label>
        </div>

        <div className="PP-form-item">
          <select
            className="select-spa"
            id="salonSelect"
            style={{ color: "black" }}
            value={selectedSpa}
            onChange={handleSpaChange}
          >
            <option value="">Select a spa</option>
            {spaList.map((spa) => (
              <option key={spa.id} value={spa.name}>
                {spa.name}
              </option>
            ))}
          </select>
          <label htmlFor="experienceTextarea">spa:</label>
        </div>
        {/* <label htmlFor="experienceTextarea">Write about your experience:</label> */}
        <div className="report-textarea">
          <textarea
            className="experience-textarea"
            id="experienceTextarea"
            value={experience}
            onChange={handleExperienceChange}
          />
          <label htmlFor="experience-textarea"> Share your thoughts...</label>
        </div>
        <button className="report-btn" onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default Report;
