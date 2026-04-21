import React, { useState } from "react";
import "./Login.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import toast from "react-hot-toast";

export default function Login({
  handleOtprequest,
  phoneNumber,
  setPhone,
  fun,
  refferalCode,
  setRefferalCode,
  gender,
  setGender
}) {
  const [isValid, setIsValid] = useState(false);
  const [getUpdates, setGetUpdates] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
    setIsValid(value.length === 10);
  };

  const toggleFormVisibility = () => fun();

  const selectGender = (value) => {
    setGender(value);
    setIsDropdownOpen(false);
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  return (
    <>
      <div className="ssh-main">
        <div className="ssh-main-div">
          <div className="ssh-div-handler-main">
            <div className="ssh-div-handler" onClick={toggleFormVisibility}></div>
          </div>

          <div className="ssh-login-content">

            {/* Header */}
            <div className="ssh-login-head-cancel">
              <div className="ssh-login-head">
                <h2 className="ssh-login-head-p">Login/Sign up</h2>
              </div>
              <div className="ssh-cancel" onClick={toggleFormVisibility}>
                <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="19.5" cy="19.5" r="19.5" fill="#D9D9D9" />
                  <path d="M11.6143 28.3857L10.6172 27.3886L18.5039 19.5019L10.6172 11.6153L11.6143 10.6182L19.501 18.5048L27.3876 10.6182L28.3847 11.6153L20.4981 19.5019L28.3847 27.3886L27.3876 28.3857L19.501 20.499L11.6143 28.3857Z" fill="black" />
                </svg>
              </div>
            </div>

            {/* Mobile Number */}
            <div className="ssh-login-mobile-div">
              <div className="ssh-login-country-code">
                <p className="ssh-login-country-code-p">+91</p>
              </div>
              <div className="ssh-login-mobile-input">
                <input
                  type="tel"
                  className="ssh-login-mobile-inputbox"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder=" "
                />
                <label className={phoneNumber ? "ssh-login-mobile-inputbox-label floating" : "ssh-login-mobile-inputbox-label"}>
                  Enter mobile number
                </label>
              </div>
            </div>

            {/* FULL WIDTH GENDER DROPDOWN - HIGH Z-INDEX */}
            <div className="ssh-gender-fullwidth-container">
              <label className="ssh-gender-label">Select Gender</label>
              
              <div 
                className="ssh-custom-dropdown-fullwidth"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="ssh-dropdown-value">
                  {gender ? genderOptions.find(o => o.value === gender)?.label : "Choose your gender"}
                </span>
                <span className={`ssh-dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>▼</span>

                {isDropdownOpen && (
                  <div className="ssh-dropdown-menu">
                    {genderOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={`ssh-dropdown-item ${gender === opt.value ? "selected" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectGender(opt.value);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Referral Code */}
            <div className="ssh-login-name-input">
              <input
                type="text"
                placeholder="Enter referral code (optional)"
                className="ssh-login-name-inputbox"
                value={refferalCode}
                onChange={(e) => setRefferalCode(e.target.value)}
              />
            </div>

            {/* Verification */}
            <div className="ssh-login-verification">
              <InfoOutlinedIcon className="ssh-info-icon" />
              <p className="ssh-login-verification-p">This process is for verification only.</p>
            </div>

            {/* WhatsApp Updates */}
            <div className="ssh-login-whatsapp">
              <input
                type="checkbox"
                className="ssh-checkbox-icon"
                id="ssh-checkbox-1"
                checked={getUpdates}
                onChange={(e) => setGetUpdates(e.target.checked)}
              />
              <label htmlFor="ssh-checkbox-1" className="ssh-checkbox-label">
                <p className={getUpdates ? "ssh-getUpdates" : "ssh-login-whatsapp-p"}>
                  Get offer updates on WhatsApp
                </p>
              </label>
            </div>

            {/* Proceed Button */}
            <button
              className={`ssh-login-button ${isValid && gender ? "valid" : ""}`}
              disabled={!isValid}
              onClick={() => {
                if (!gender) return toast.error("Please select gender");
                handleOtprequest();
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
}