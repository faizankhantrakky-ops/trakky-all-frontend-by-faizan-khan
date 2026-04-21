import React, { useEffect, useState } from "react";
import Login from "./Login";
import OTP from "./OTP";
import AuthContext from "../../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";

function Signup({ fun }) {
  let { loginUser, logoutUser, isAuthenticated, otprequest } = React.useContext(AuthContext);

  const regex = {
    phonenumber: /^[0-9]{10}$/,
    otp: /^[0-9]{6}$/,
  };

  const [showComponent1, setShowComponent1] = useState(true);
  const [showComponent2, setShowComponent2] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [refferalCode, setRefferalCode] = useState("");
  const [gender, setGender] = useState(""); // ← NEW: Gender state
  const [otp, setOtp] = useState("");

  const handleProceedClick = () => {
    setShowComponent1(false);
    setShowComponent2(true);
  };

  const handleEditNumberClick = () => {
    setShowComponent2(false);
    setShowComponent1(true);
  };

  const handleloginUser = () => {
    if (!regex.phonenumber.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!regex.otp.test(otp)) {
      toast.error("OTP Length must be 6");
      return;
    }
    loginUser(phoneNumber, otp, gender, refferalCode); // Pass gender if needed in backend
  };

const handleOtprequest = async () => {
  if (!regex.phonenumber.test(phoneNumber)) {
    toast.error("Please enter a valid 10-digit phone number");
    return;
  }
  if (!gender) {
    toast.error("Please select your gender");
    return;
  }

  const success = await otprequest(phoneNumber, refferalCode, gender);

  if (success) {
    handleProceedClick(); // Go to OTP screen
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      fun();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    logoutUser();
  }, []);

  return (
    <>
      {showComponent1 && (
        <Login
          setPhone={setPhoneNumber}
          phoneNumber={phoneNumber}
          handleOtprequest={handleOtprequest}
          onProceedClick={handleProceedClick}
          fun={fun}
          refferalCode={refferalCode}
          setRefferalCode={setRefferalCode}
          gender={gender}
          setGender={setGender}
        />
      )}
      {showComponent2 && (
        <OTP
          otp={otp}
          setOtp={setOtp}
          handleloginUser={handleloginUser}
          phoneNumber={phoneNumber}
          onEditNumberClick={handleEditNumberClick}
          isAuthenticated={isAuthenticated}
          fun={fun}
          handleOtprequest={handleOtprequest}
          setShowComponent2={setShowComponent2}
          refferalCode={refferalCode}
          setRefferalCode={setRefferalCode}
        />
      )}
    </>
  );
}

export default Signup;