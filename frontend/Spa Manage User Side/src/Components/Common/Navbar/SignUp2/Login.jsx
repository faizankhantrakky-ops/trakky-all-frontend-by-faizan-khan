import React, { useState } from "react";
import "./Login.css";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login({
  onProceedClick,
  handleOtprequest,
  phoneNumber,
  setPhone,
  fun,
  refferalCode,
  setRefferalCode,
}) {
  const [isValid, setIsValid] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [getUpdates, setGetUpdates] = useState(false);

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const trimmedValue = numericValue.slice(0, 10);
    setPhone(trimmedValue);
    setIsValid(trimmedValue.length === 10);
  };

  const toggleFormVisibility = () => {
    fun();
  };

  return (
    <>
      <div className="ssh-main">
        <div className="ssh-main-div">
          <div className="ssh-div-handler-main">
            <div
              className="ssh-div-handler"
              onClick={toggleFormVisibility}
            ></div>
          </div>

          <div className="ssh-login-content">
            <div className="ssh-login-head-cancel">
              <div className="ssh-login-head">
                <h2 className="ssh-login-head-p">Login/Sign up</h2>
              </div>
              <div className="ssh-cancel" onClick={toggleFormVisibility}>
                {/* <CloseIcon className="ssh-cross-icon" /> */}
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="19.5" cy="19.5" r="19.5" fill="#D9D9D9" />
                  <path
                    d="M11.6143 28.3857L10.6172 27.3886L18.5039 19.5019L10.6172 11.6153L11.6143 10.6182L19.501 18.5048L27.3876 10.6182L28.3847 11.6153L20.4981 19.5019L28.3847 27.3886L27.3876 28.3857L19.501 20.499L11.6143 28.3857Z"
                    fill="black"
                  />
                </svg>
              </div>
            </div>

            <div className="ssh-login-mobile-div">
              <div className="ssh-login-country-code">
                <p className="ssh-login-country-code-p">+91</p>
              </div>
              <div className="ssh-login-mobile-input">
                <input
                  type="tel"
                  placeholder=" "
                  className="ssh-login-mobile-inputbox"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onFocus={() => setIsFormOpen(true)}
                  onBlur={() => setIsFormOpen(phoneNumber.length > 0)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                    //   handleOtprequest();
                    //   onProceedClick(phoneNumber.toString());
                    event.preventDefault();
                    }
                  }}
                />
                <label
                  className={
                    phoneNumber.length > 0
                      ? "ssh-login-mobile-inputbox-label floating"
                      : "ssh-login-mobile-inputbox-label"
                  }
                >
                  Enter mobile number
                </label>
              </div>
            </div>
            <div className="ssh-login-name-input">
              <input
                type="text"
                placeholder="Enter referral code (optional)"
                className="ssh-login-name-inputbox"
                value={refferalCode}
                onChange={(e) => setRefferalCode(e.target.value)}
              />
            </div>
            <div className="ssh-login-verification">
              <InfoOutlinedIcon className="ssh-info-icon" />
              <p className="ssh-login-verification-p">
                This process is for verification only.
              </p>
            </div>
            <div className="ssh-login-whatsapp">
              <input
                type="checkbox"
                className="ssh-checkbox-icon"
                id="ssh-checkbox-1"
                value={getUpdates}
                onChange={(event) => setGetUpdates(event.target.checked)}
              />
              <label htmlFor="ssh-checkbox-1" className="ssh-checkbox-label">
                <p
                  className={
                    getUpdates ? "ssh-getUpdates" : "ssh-login-whatsapp-p"
                  }
                >
                  Get offer updates on WhatsApp
                </p>
              </label>
            </div>
            <button
              className={`ssh-login-button ${isValid ? "valid" : ""}`}
              disabled={!isValid}
              onClick={() => {
                handleOtprequest();
                // onProceedClick(phoneNumber.toString());
              }}
            >
              Proceed
            </button>
            <div className="ssh-login-line-whatsapp">
              <div className="ssh-div1">
                <div className="ssh-login-line-half"></div>
                <div className="ssh-login-line-or">or</div>
                <div className="ssh-login-line-half"></div>
              </div>
            </div>
            <div className="ssh-whatsapp-div">
              <button className="ssh-whatsapp-button2">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.534606 12.4438C0.534017 14.5601 1.08949 16.6266 2.1457 18.4481L0.433594 24.6713L6.83089 23.0014C8.6003 23.9604 10.5828 24.4629 12.5974 24.463H12.6027C19.2533 24.463 24.6671 19.0753 24.6699 12.4532C24.6712 9.24434 23.4171 6.22691 21.1385 3.95676C18.8604 1.6868 15.8305 0.436035 12.6022 0.43457C5.95081 0.43457 0.53745 5.82193 0.534704 12.4438"
                    fill="url(#paint0_linear_923_6215)"
                  />
                  <path
                    d="M0.104935 12.4399C0.104248 14.6325 0.679625 16.7729 1.7735 18.6595L0 25.1059L6.62668 23.3762C8.45255 24.3672 10.5083 24.8897 12.6001 24.8905H12.6055C19.4947 24.8905 25.103 19.3091 25.1059 12.4499C25.1071 9.12571 23.8079 5.99981 21.4479 3.64833C19.0876 1.29715 15.9494 0.00136686 12.6055 0C5.71512 0 0.107681 5.58067 0.104935 12.4399ZM4.05137 18.3346L3.80394 17.9436C2.76381 16.2971 2.21481 14.3945 2.2156 12.4407C2.21775 6.73947 6.87843 2.10105 12.6094 2.10105C15.3848 2.10222 17.9931 3.17931 19.9549 5.13352C21.9166 7.08793 22.996 9.68593 22.9953 12.4491C22.9928 18.1504 18.332 22.7894 12.6055 22.7894H12.6014C10.7368 22.7884 8.90809 22.2899 7.31327 21.3478L6.93374 21.1238L3.00133 22.1502L4.05137 18.3346Z"
                    fill="url(#paint1_linear_923_6215)"
                  />
                  <path
                    d="M9.48139 7.23933C9.24739 6.72159 9.00114 6.71114 8.77862 6.70206C8.5964 6.69425 8.3881 6.69483 8.18 6.69483C7.9717 6.69483 7.63326 6.77284 7.34719 7.0838C7.06083 7.39505 6.25391 8.14722 6.25391 9.67702C6.25391 11.2069 7.37318 12.6854 7.52921 12.893C7.68543 13.1003 9.68998 16.3401 12.8647 17.5865C15.5032 18.6223 16.0401 18.4163 16.6127 18.3644C17.1855 18.3126 18.4608 17.6124 18.7209 16.8863C18.9813 16.1603 18.9813 15.538 18.9033 15.408C18.8252 15.2784 18.6169 15.2006 18.3045 15.0451C17.9921 14.8896 16.4565 14.1374 16.1702 14.0336C15.8839 13.9299 15.6757 13.8781 15.4674 14.1895C15.2591 14.5004 14.6609 15.2006 14.4786 15.408C14.2965 15.6158 14.1142 15.6417 13.802 15.4862C13.4894 15.3301 12.4835 15.0022 11.2901 13.943C10.3616 13.1188 9.7347 12.1009 9.55249 11.7896C9.37027 11.4787 9.53297 11.3102 9.68959 11.1553C9.82993 11.016 10.002 10.7922 10.1584 10.6107C10.3141 10.4291 10.3661 10.2995 10.4702 10.0922C10.5745 9.88459 10.5223 9.70299 10.4443 9.54746C10.3661 9.39193 9.75912 7.85412 9.48139 7.23933Z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_923_6215"
                      x1="1212.25"
                      y1="2424.11"
                      x2="1212.25"
                      y2="0.43457"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#1FAF38" />
                      <stop offset="1" stop-color="#60D669" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_923_6215"
                      x1="1255.3"
                      y1="2510.59"
                      x2="1255.3"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#F9F9F9" />
                      <stop offset="1" stop-color="white" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="ssh-whatsapp-button-p">Sign in with WhatsApp</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
