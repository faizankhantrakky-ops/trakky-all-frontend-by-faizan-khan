import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/Trakky logo purple.png";
import AuthContext from "../Context/Auth";
import "./Login.css";
import Signup from "./Signup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const { user, loginUser, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user, loginUser, authTokens);

  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const resetFormFields = () => {
    setPhone_number("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setIsOtpSent(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!phone_number) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    let response = await loginUser({ phone_number, password });

    if (response.status === 500) {
      toast.error("Internal Server Error");
    } else if (response.status === 401) {
      toast.error("Invalid Credentials");
    } else if (response.status === 400) {
      toast.error("Bad Request, provide valid credentials");
    } else if (response.status === 200) {
      navigate("/");
      toast.success("Login Successful");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!phone_number) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    const formData = new FormData();
    formData.append("ph_number", phone_number);
    formData.append("password", oldPassword);
    formData.append("new_password", newPassword);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/update-password/",
        {
          method: "POST",
          body: formData,
        }
      );

      // Log the raw response text
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Log the raw response

      // Check if the response is okay and parse it
      if (!response.ok) {
        throw new Error(
          "Failed to update password. Please enter correct details."
        ); // Throw an error if the response is not okay
      }
      const responseData = JSON.parse(responseText); // Parse the response as JSON
      toast.success("Password updated successfully");
      resetFormFields(); // Reset the form fields after successful update
      setNewPassword("");
      setConfirmNewPassword("");
      setIsOtpSent(false);

      // change to login page
      setIsChangingPassword(false);
      setIsForgotPassword(false);

    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.message || "An error occurred while updating the password"
      );
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone_number(value);
      if (value.length === 10) {
        setPhoneError(""); // Clear error if 10 digits
      } else {
        setPhoneError("Phone number must be exactly 10 digits");
      }
    }
  };

  const handleSendOtp = async () => {
    if (phone_number.length === 10) {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/spavendor/otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ph_number: phone_number,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setIsOtpSent(true);
          toast.success("OTP sent to your phone number.");
        } else {
          throw new Error(data.error || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while sending OTP.");
      }
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const handleVerifyOtp = () => {
    // Logic to verify OTP
    if (otp === "") {
      setIsOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP");
    }
  };

  const handleBackToSignIn = () => {
    resetFormFields();
    setIsChangingPassword(false);
    setIsForgotPassword(false);
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/spavendor/otp/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ph_number: phone_number,
          otp: otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password Reset Successfully.");
        setPhone_number("");
        setOtp("");
        setNewPassword("");
        // setIsOtpSent(false);
        setIsForgotPassword(false);
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while resetting password."
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 flex justify-center items-center">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center">
          {/* Left section */}
          <div className="w-full md:w-[60%] hidden md:flex flex-col justify-center items-start p-12 text-white rounded-l-xl">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={logo}
                alt="Spa Management Logo"
                className="w-48 h-auto rounded-lg invert brightness-0"
              />
              <div className="text-2xl font-semibold">Spa Management</div>
            </div>
            <h2 className="text-xl mt-1 mb-2">For Spas</h2>
            <ul className="space-y-4 text-sm list-disc pl-6">
              <li>Streamline spa management with integrated tools.</li>
              <li>Enhance spa operations with a unified solution.</li>
              <li>
                Simplify spa tasks with user-friendly management features.
              </li>
            </ul>
          </div>

          {/* Right section (Form) */}
          <div className="w-full md:w-[40%] bg-white shadow-lg p-8 flex flex-col justify-center md:rounded-xl h-[100vh] md:h-auto">
            {!isChangingPassword && !isForgotPassword ? (
              <div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <form>
                  <h3
                    className="font-semibold text-gray-800"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Sign in
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Welcome back! Please enter your details.
                  </p>

                  {/* Phone number input */}
                  <div className="mt-6">
                    <label className="text-gray-700 text-sm font-semibold">
                      Phone no.
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={phone_number}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm"
                    />
                  </div>

                  {/* Password input */}
                  <div className="mt-4">
                    <label className="text-gray-700 text-sm font-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm leading-4"
                    />
                  </div>

                  {/* Remember me & Change Password */}
                  <div className="flex justify-between mt-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-purple-600 border-2 border-gray-200 rounded focus:ring-0"
                      />
                      <span className="ml-2 text-gray-600 text-sm">
                        Remember me
                      </span>
                    </div>
                    <div className="text-right">
                      <a
                        href="#"
                        className="text-purple-600 text-sm font-medium hover:underline"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Change password?
                      </a>
                    </div>
                  </div>

                  {/* Sign in button */}
                  <button
                    onClick={handleSignIn}
                    className="bg-purple-600 p-2 w-full cursor-pointer font-semibold text-xs rounded-md mt-5 text-white text-center"
                  >
                    Sign in
                  </button>

                  <div className="text-center mt-4">
                    <a
                      href="#"
                      className="text-purple-600 text-sm font-medium hover:underline"
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <p className="text-center text-gray-500 mt-5">
                    Don’t have an account?{" "}
                    <Link
                      to="/Singup"
                      className="text-purple-600 font-medium hover:underline"
                    >
                      Sign up for free!
                    </Link>
                  </p>
                </form>
              </div>
            ) : isChangingPassword ? (
              <div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <form>
                  <h3
                    className="font-semibold text-gray-800"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Change Password
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Please enter your phone number and new password.
                  </p>

                  {/* Phone number input */}
                  <div className="mt-6">
                    <label className="text-gray-700 text-sm font-semibold">
                      Phone no.
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={phone_number}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-gray-700 text-sm font-semibold">
                      Old Password
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="********"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm leading-4"
                    />
                  </div>

                  {/* New Password input */}
                  <div className="mt-4">
                    <label className="text-gray-700 text-sm font-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="********"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm leading-4"
                    />
                  </div>

                  {/* Change password button */}
                  <button
                    onClick={handleChangePassword}
                    className="bg-purple-600 p-2 w-full cursor-pointer font-semibold text-xs rounded-md mt-5 text-white text-center"
                  >
                    Change Password
                  </button>

                  <div className="text-center mt-4">
                    <a
                      href="#"
                      className="text-purple-600 text-sm font-medium hover:underline"
                      onClick={handleBackToSignIn}
                    >
                      Back to login
                    </a>
                  </div>
                </form>
              </div>
            ) : isForgotPassword ? (
              <div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <form>
                  <h3
                    className="font-semibold text-gray-800"
                    style={{ fontSize: "1.125rem" }}
                  >
                    Forgot Password
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Enter your phone number to reset your password.
                  </p>

                  {/* Phone number input */}
                  <div className="mt-6">
                    <label className="text-gray-700 text-sm font-semibold">
                      Phone no.
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      value={phone_number}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm"
                    />
                  </div>

                  {/* Send OTP button */}
                  {!isOtpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="bg-purple-600 p-2 w-full cursor-pointer font-semibold text-xs rounded-md mt-5 text-white text-center"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <>
                      <div className="mt-4">
                        <label className="text-gray-700 text-sm font-semibold">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={handleOtpChange}
                          placeholder="Enter OTP"
                          className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="text-gray-700 text-sm font-semibold">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full border-2 border-gray-200 rounded-lg p-3 mt-1 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow duration-200 ease-in-out shadow-sm text-sm"
                        />
                      </div>

                      <button
                        onClick={handleUpdatePassword}
                        className="bg-purple-600 p-2 w-full cursor-pointer font-semibold text-xs rounded-md mt-5 text-white text-center"
                      >
                        Update Password
                      </button>
                    </>
                  )}

                  <div className="text-center mt-4">
                    <a
                      href="#"
                      className="text-purple-600 text-sm font-medium hover:underline"
                      onClick={handleBackToSignIn}
                    >
                      Back to login
                    </a>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default Login;
