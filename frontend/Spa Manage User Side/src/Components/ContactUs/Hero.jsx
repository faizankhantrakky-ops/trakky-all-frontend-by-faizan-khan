import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import './Hero.css'
import Cards from "./Cards";
// import Livemap from "./Livemap";
import validator from "validator";
function Hero() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [msg, setmsg] = useState("");
  const [firstNameError, setFirstNameError] = useState("hidden");
  const [lastNameError, setLastNameError] = useState("hidden");
  const [msgerror, setMsgError] = useState("hidden");
  const [mail, setMail] = useState("");
  const [number, setNumber] = useState("");
  const [emailError, setEmailError] = useState("hidden");
  const [numberError, setNumberError] = useState("hidden");
  const [termandcondition, setTermandcondition] = useState(false);
  const [futureUpdates, setFutureUpdates] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFirstNameError("hidden");
    setLastNameError("hidden");
    setMsgError("hidden");
    setNumberError("hidden");
    setEmailError("hidden");
    if (mail && !validator.isEmail(mail)) {
      setEmailError("visible");
    }
    if (number && !validator.isMobilePhone(number, "en-IN")) {
      setNumberError("visible");
    }
    if (validator.isEmpty(firstName)) {
      setFirstNameError("visible");
    }
    if (validator.isEmpty(lastName)) {
      setLastNameError("visible");
    }
    if (validator.isEmpty(msg)) {
      setMsgError("visible");
    }
    if (validator.isEmpty(mail)) {
      setEmailError("visible");
    }
    if (validator.isEmpty(number)) {
      setNumberError("visible");
    }

    if (
      !validator.isEmail(mail) ||
      !validator.isMobilePhone(number, "en-IN") ||
      validator.isEmpty(firstName) ||
      validator.isEmpty(lastName) ||
      validator.isEmpty(msg) ||
      validator.isEmpty(mail) ||
      validator.isEmpty(number)
    ) {
      return;
    }

    try {
      let url = "https://backendapi.trakky.in/salons/contact-us/";

      let formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", mail);
      formData.append("phone_no", number);
      formData.append("message", msg);
      formData.append("platform", "salon");
      formData.append("terms_and_conditions", termandcondition);
      formData.append("future_updates", futureUpdates);


      let response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      let data = await response.json();

      if (response.status === 201) {
        setFirstName("");
        setLastName("");
        setMail("");
        setNumber("");
        setmsg("");
        setTermandcondition(false);
        setFutureUpdates(false);
        alert("Your message has been sent successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    
    <>
  <div className="contactus-main-hero-container">
  <div className="form-main-container">
    <form action="">
      <div className="contactus-title-main">
        <h3>Contact Us Form</h3>
      </div>
      <div className="contactus-form-main-row">
        <div className="contactus-form-main-col first-name-col">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter your first name"
            autoComplete="off"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="contactus-form-main-col last-name-col">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter your last name"
            autoComplete="off"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="contactus-form-main-row">
        <div className="contactus-form-main-col email-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            autoComplete="off"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>
        <div className="contactus-form-main-col phone-col">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            autoComplete="off"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="contactus-form-main-row">
        <div className="contactus-form-main-col message-col">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Enter your message"
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="contactus-form-main-row">
        <div className="contactus-form-main-col checkbox-col">
          <input
            type="checkbox"
            id="terms"
            checked={termandcondition}
            onChange={(e) => setTermandcondition(e.target.checked)}
          />
          <label htmlFor="terms" style={{marginBottom:'0px'}}>
            I agree with terms & conditions
          </label>
        </div>
      </div>
      <div className="contactus-form-main-row">
        <div className="contactus-form-main-col checkbox-col">
          <input
            type="checkbox"
            id="updates"
            checked={futureUpdates}
            onChange={(e) => setFutureUpdates(e.target.checked)}
          />
          <label htmlFor="updates" style={{marginBottom:'0px'}}>
            I agree to receive promotional updates on Whatsapp, SMS & email.
          </label>
        </div>
      </div>
      <div className="contactus-form-main-row">
        <button type="submit" onClick={handleSubmit}>
          Send Message
        </button>
      </div>
    </form>
  </div>
  <Cards />
</div>

  {/* <Livemap/> */}

    </>
  );
}

export default Hero;
