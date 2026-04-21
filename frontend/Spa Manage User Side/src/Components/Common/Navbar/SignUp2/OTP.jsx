import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import "./OTP.css";
import toast from "react-hot-toast";

export default function OTP({
  phoneNumber,
  onEditNumberClick,
  setOtp,
  isAuthenticated,
  setshowComponent2,
  fun,
  otp,
  handleloginUser,
  handleOtprequest,
  refferalCode,
  setRefferalCode,
}) {
  const [timer, setTimer] = useState(30);
  const [isValid, setIsValid] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [resend, setResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
      if (timer <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const toggleFormVisibility = () => {
    fun();
  };

  const regex = {
    phonenumber: /^[0-9]{10}$/,
    otp: /^[0-9]{6}$/,
  };

  const handlePhoneNumberChange = (event) => {
    setOtp(event.target.value);
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const trimmedValue = numericValue.slice(0, 6);
    setIsValid(trimmedValue.length === 6);
  };


  const formattedTimer =
    timer <= 0
      ? "Resend OTP"
      : `${Math.floor(timer / 60)
          .toString()
          .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    if (timer <= 0) {
      setResend(true);
    } else {
      setResend(false);
    }
  }, [timer]);

  const handleResendOTP = () => {
    handleOtprequest();
    setTimer(30);
  };
  return (
    <div className="ssh-main">
      <div className="ssh-main-div">
        <div className="ssh-div-handler-main">
          <div className="ssh-div-handler" onClick={toggleFormVisibility}></div>
        </div>
        <div className="ssh-login-content">
          <div className="ssh-otp-head">
            <p className="ssh-otp-head-p1">Verification code</p>
            <p className="ssh-otp-head-p2">
              <div className="ssh-otp-head-a" onClick={onEditNumberClick}>
                <DriveFileRenameOutlineOutlinedIcon /> Edit number
              </div>
            </p>
          </div>
          <div className="ssh-otp-code-div">
            <p className="ssh-otp-code-p">
              We have sent you a 6-digit code on +91 {phoneNumber}
            </p>
          </div>
          <div className="ssh-div-otp">
            <div className="ssh-div-top-1">
              <input
                type="tel"
                placeholder=" "
                className="ssh-div-otp-input"
                onChange={handlePhoneNumberChange}
                maxLength={6}
                onFocus={() => setIsFormOpen(true)}
                onBlur={() => setIsFormOpen(phoneNumber.length > 0)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    const loginButton =
                      document.querySelector(".ssh-login-button");
                    if (loginButton) {
                      loginButton.click();
                    }
                  }
                }}
                inputMode="numeric"
              />
            </div>
          </div>
          <button
            className="ssh-resend-otp-button"
            onClick={handleResendOTP}
            disabled={!resend}
            style={{
              width: "fit-content",
              marginRight: "auto",
              cursor: resend ? "pointer" : "not-allowed", // Set cursor based on resend state
              pointerEvents: resend ? "auto" : "none", // Enable or disable pointer events based on resend state
            }}
          >
            {formattedTimer}
          </button>

          <div className="ssh-otp-line"></div>
          <button
            onClick={handleloginUser}
            className={`ssh-login-button ${isValid ? "valid" : ""}`}
            disabled={!isValid}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
