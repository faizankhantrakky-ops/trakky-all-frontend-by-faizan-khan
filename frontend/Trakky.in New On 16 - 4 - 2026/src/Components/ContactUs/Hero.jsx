"use client"

import { useState } from "react"
import validator from "validator"
import { Link } from "react-router-dom"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaComments, FaUserTie } from "react-icons/fa"
import "./Hero.css"

const Cards = () => {
  return (
    <div className="contactus-main">
      {/* Row 1: Report a Concern + Partner Registration */}
      <div className="cards-row">
        {/* Report a Concern */}
        <div className="contactus-card">
          <div className="card-icon-box">
            <FaPhone style={{ rotate: "90deg" }} />
          </div>
          <p className="contactus-heading">Report a Concern</p>
          <div className="contact-items">
            <p className="contactus-number">
              <a href="tel:6355167304">+91 6355167304</a>
            </p>
            <p className="contactus-number">
              <a href="tel:9328382710">+91 9328382710</a>
            </p>
          </div>
          <p className="contactus-number">
            <FaEnvelope style={{ marginRight: "8px" }} />
            <a href="mailto:customercare@trakky.in">customercare@trakky.in</a>
          </p>
        </div>

        {/* For Partner Registration */}
        <div className="contactus-card">
          <div className="card-icon-box">
            <FaUserTie />
          </div>
          <p className="contactus-heading">Partner Registration</p>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", textAlign: "center" }}>
            Join our growing network of partners
          </p>
          <div style={{ textAlign: "center" }}>
            <Link to="/vendor-register">
              <button className="contactus-button">Visit Now</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Feedback + Social Media */}
      <div className="cards-row">
        {/* Feedback */}
        <div className="contactus-card">
          <div className="card-icon-box">
            <FaComments />
          </div>
          <p className="contactus-heading">Give Us Feedback</p>
          <form className="contactus-form">
            <textarea className="contactus-textarea" placeholder="Share your thoughts with us..." rows="4" />
            <button type="submit" className="contactus-button feedback-btn">
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div className="contactus-card">
          <div className="card-icon-box">
            <FaComments />
          </div>
          <p className="contactus-heading">Follow Us</p>
          <div className="social-media-links">
            <a href="https://www.facebook.com/p/Trakky-grooming-61555807924604/" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-link">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/trakky_india/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-link">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Address - Full Width */}
      <div className="contactus-card address-card">
        <FaMapMarkerAlt style={{ marginRight: "8px", color: "#502DA6" }} />
        <p style={{ fontSize: "14px", textAlign: "center", margin: "8px 0 0 0", color: "#666", fontWeight: "500" }}>
          i Hub, Ahmedabad, 380015
        </p>
      </div>
    </div>
  )
}

// ... rest of Hero component remains unchanged
function Hero() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [mail, setMail] = useState("")
  const [number, setNumber] = useState("")
  const [msg, setMsg] = useState("")
  const [termandcondition, setTermandcondition] = useState(false)
  const [futureUpdates, setFutureUpdates] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    message: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      message: false,
    })

    let hasError = false
    const newErrors = { ...errors }

    if (validator.isEmpty(firstName)) {
      newErrors.firstName = true
      hasError = true
    }
    if (validator.isEmpty(lastName)) {
      newErrors.lastName = true
      hasError = true
    }
    if (validator.isEmpty(mail) || !validator.isEmail(mail)) {
      newErrors.email = true
      hasError = true
    }
    if (validator.isEmpty(number) || !validator.isMobilePhone(number, "en-IN")) {
      newErrors.phone = true
      hasError = true
    }
    if (validator.isEmpty(msg)) {
      newErrors.message = true
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitStatus("loading")
      const url = "https://backendapi.trakky.in/salons/contact-us/"
      const formData = new FormData()
      formData.append("first_name", firstName)
      formData.append("last_name", lastName)
      formData.append("email", mail)
      formData.append("phone_no", number)
      formData.append("message", msg)
      formData.append("platform", "salon")
      formData.append("terms_and_conditions", termandcondition)
      formData.append("future_updates", futureUpdates)

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.status === 201) {
        setSubmitStatus("success")
        setFirstName("")
        setLastName("")
        setMail("")
        setNumber("")
        setMsg("")
        setTermandcondition(false)
        setFutureUpdates(false)
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus("error")
        setTimeout(() => setSubmitStatus(null), 5000)
      }
    } catch (error) {
      console.error(error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <>
      <div className="contact-hero-container">
        <div className="contact-header">
          <div className="trakky-logo">Trakky</div>
          <p className="header-subtitle">We're here to help. Get in touch with us today.</p>
        </div>

        <div className="contact-content-wrapper">
          {/* Contact Form */}
          <div className="contact-form-card">
            <div className="form-header">
              <h1 className="contact-form-title border-l-4 border-indigo-700 pl-3 text-2xl font-semibold">
                Get in Touch
              </h1>
              <p className="contact-form-subtitle text-gray-600 mt-2">
                We'd love to hear from you. Please fill out the form and we'll get back to you shortly.
              </p>
            </div>

            {submitStatus === "success" && (
              <div className="status-message success">Thank you! Your message has been sent successfully.</div>
            )}
            {submitStatus === "error" && (
              <div className="status-message error">Something went wrong. Please try again.</div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstname">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={errors.firstName ? "input-field error" : "input-field"}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="error-text">First name is required</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastname">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={errors.lastName ? "input-field error" : "input-field"}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="error-text">Last name is required</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    className={errors.email ? "input-field error" : "input-field"}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <span className="error-text">
                      {validator.isEmpty(mail) ? "Email is required" : "Please enter a valid email"}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className={errors.phone ? "input-field error" : "input-field"}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <span className="error-text">
                      {validator.isEmpty(number) ? "Phone is required" : "Please enter a valid Indian mobile number"}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">
                  Your Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  rows="6"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className={errors.message ? "textarea-field error" : "textarea-field"}
                  placeholder="Tell us what's on your mind..."
                ></textarea>
                {errors.message && <span className="error-text">Message is required</span>}
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={termandcondition}
                    onChange={(e) => setTermandcondition(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">
                      Terms & Conditions
                    </a>
                  </span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={futureUpdates} onChange={(e) => setFutureUpdates(e.target.checked)} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Keep me updated via WhatsApp, SMS & Email</span>
                </label>
              </div>

              <button type="submit" className="submit-btn" disabled={submitStatus === "loading"}>
                {submitStatus === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <Cards />
        </div>
      </div>
    </>
  )
}

export default Hero