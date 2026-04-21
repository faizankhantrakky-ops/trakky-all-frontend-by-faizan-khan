import React, { useEffect, useState } from "react";
import Login from "./Login";
import OTP from "./OTP";
import AuthContext from "../../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";

function Signup({ fun }) {
  let {
    loginUser,
    logoutUser,
    isAuthenticated,
    otprequest,
  } = React.useContext(AuthContext);

  const regex = {
    phonenumber: /^[0-9]{10}$/,
    otp: /^[0-9]{6}$/,
  };

  const [showComponent1, setShowComponent1] = useState(true);
  const [showComponent2, setShowComponent2] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [refferalCode , setRefferalCode] = useState("");
  const [otp, setotp] = useState(false);


  const handleProceedClick = (phoneNumber) => {
    setShowComponent1(false);
    setShowComponent2(true);
    setPhoneNumber(phoneNumber);
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
    loginUser(phoneNumber, otp);
  };

  const handleOtprequest = async () => {
    if (!regex.phonenumber.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    let res = await otprequest(phoneNumber , refferalCode);

    if (res) {
      setotp(true);
      handleProceedClick(phoneNumber);
    } else {
      setotp(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fun();
      setotp(false);
    } else {
      setotp(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return (
    <>
    {/* <Toaster /> */}
      {showComponent1 && (
        <Login
          setPhone={setPhoneNumber}
          phoneNumber={phoneNumber}
          handleOtprequest={handleOtprequest}
          onProceedClick={(phoneNumber) => handleProceedClick(phoneNumber)}
          fun={fun}
          setRefferalCode={setRefferalCode}
          refferalCode={refferalCode}
        />
      )}
      {showComponent2 && (
        <OTP
          otp={otp}
          setOtp={setotp}
          handleloginUser={handleloginUser}
          phoneNumber={phoneNumber}
          onEditNumberClick={handleEditNumberClick}
          isAuthenticated={isAuthenticated}
          fun={fun}
          handleOtprequest={handleOtprequest}
          setshowComponent2={setShowComponent2}
          refferalCode={refferalCode}
          setRefferalCode={setRefferalCode}
        />
      )}
    </>
  );
}

export default Signup;
