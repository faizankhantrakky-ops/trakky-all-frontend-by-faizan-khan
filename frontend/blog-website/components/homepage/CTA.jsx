import React, { useState } from "react";
import style from "../../styles/cta.module.css";
import network from "../../config/network";

const CTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("email", email); 

    try {
      const response = await fetch(`${network.baseURL}/salons/email/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Thank you for subscribing!");
        setEmail("");
      }
       else if (response.status === 409){
        alert("You are already subscribed!");
       }
      else if (response.status === 400){
        alert("Please enter a valid email address!");
      }
      else{
        alert("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className={style.ctaDiv}>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.suscribeDiv}>
          <div className={style.subImg}>
            <img src={"/envelop.svg"} alt="img" />
          </div>
          <div className={style.subText}>
            <h3>Do cool things with us.</h3>
            <p>
              Stay in the loop with updates from our team and community. Once a
              month.
            </p>
          </div>
          <div className={style.subInp}>
            <input
              type="text"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe to newsletter</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CTA;
