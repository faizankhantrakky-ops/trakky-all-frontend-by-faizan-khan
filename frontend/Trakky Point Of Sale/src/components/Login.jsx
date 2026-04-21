import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../Context/Auth";
import "./Login.css";
import logo from "../../src/assets/Trakky logo purple.png";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  IndianRupee,
  Users,
  BarChart3,
  MessageSquare,
  Wallet,
  CreditCard,
  Star,
  Layers,
  Clock,
} from "lucide-react";

import { Turnstile } from "@marsidev/react-turnstile";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [turnstileToken, setTurnstileToken] = useState(null);
  const features = [
    {
      title: "Appointment Booking",
      desc: "Book, reschedule, and track appointments effortlessly",
      icon: CalendarCheck,
    },
    {
      title: "Billing & Payments",
      desc: "Generate GST invoices, accept UPI & cards",
      icon: IndianRupee,
    },
    {
      title: "Customer CRM",
      desc: "Track preferences, history, and loyalty points",
      icon: Users,
    },
    {
      title: "Membership Plans",
      desc: "Monthly & yearly membership management",
      icon: CreditCard,
    },
    {
      title: "Prepaid Cards & Wallet",
      desc: "Advance payments & customer wallet balance",
      icon: Wallet,
    },
    {
      title: "Staff Scheduling",
      desc: "Manage shifts, leaves & availability",
      icon: Clock,
    },
    {
      title: "Payroll & Commission",
      desc: "Automated salary & commission calculation",
      icon: IndianRupee,
    },
    {
      title: "SMS & WhatsApp",
      desc: "Send instant SMS & WhatsApp notifications",
      icon: MessageSquare,
    },
  ];

  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetFormFields = () => {
    setPhone_number("");
    setPassword("");
    setOldPassword("");
    setNewPassword("");
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

    try {
      // Send phone, password + Cloudflare Turnstile token
      const response = await loginUser({
        phone_number,
        password,
        "cf-turnstile-response": turnstileToken, // ← backend must validate this
      });

      if (response.status !== 200) {
        toast.error(response.message || "Login failed. Please try again.");
        return;
      }

      const loginData = response.data;

      if (loginData) {
        const { user_type, manager_id, staff_id, user_id, ph_number } =
          loginData;

        localStorage.setItem("user_id", user_id);
        localStorage.setItem("ph_number", ph_number);
        localStorage.setItem("user_type", user_type);

        if (user_type === "Manager" && manager_id) {
          localStorage.setItem("role_id", manager_id);
          localStorage.setItem("manager_id", manager_id);
        } else if (user_type === "Staff" && staff_id) {
          localStorage.setItem("role_id", staff_id);
          localStorage.setItem("staff_id", staff_id);
        }
      }

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

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
        "https://backendapi.trakky.in/salonvendor/update-password/",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      const responseData = JSON.parse(responseText);
      toast.success("Password updated successfully");
      resetFormFields();
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.message || "An error occurred while updating the password"
      );
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone_number(value);
  };

  const handleSendOtp = async () => {
    if (phone_number.length === 10) {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/otp/",
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
          throw new Error(data.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred while sending OTP.");
      }
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/otp/", {
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
        resetFormFields();
        setIsForgotPassword(false);
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while resetting password."
      );
    }
  };

  const handleBackToSignIn = () => {
    resetFormFields();
    setIsChangingPassword(false);
    setIsForgotPassword(false);
  };

  const renderFormContent = () => {
    if (!isChangingPassword && !isForgotPassword) {
      return (
        <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Phone number input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone_number}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter 10-digit phone number"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                />
                {phone_number.length === 10 && (
                  <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs sm:text-sm text-[#502DA6] hover:text-[#3A1E7A] font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* <div className="py-2 w-full">
              <div className="w-full overflow-hidden">
                <Turnstile
                  siteKey="0x4AAAAAACJ7H9X_1iC_2KIB"
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    setTurnstileToken(null);
                    toast.error("Verification failed. Please try again.");
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                    toast.error("Verification expired. Please complete again.");
                  }}
                  options={{
                    size: "flexible", // 🔥 important
                  }}
                />
              </div>
            </div> */}

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-[#502DA6] hover:bg-[#3A1E7A] text-white py-2.5 sm:py-3 md:py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow text-xs sm:text-sm md:text-base"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Change password option */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="text-xs sm:text-sm text-[#502DA6] hover:text-[#3A1E7A] font-medium"
              >
                Need to change your password?
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-xs sm:text-sm mb-2">
                Don't have an account?
              </p>
              <Link
                to="/Signup"
                className="inline-flex items-center text-[#502DA6] hover:text-[#3A1E7A] font-medium text-xs sm:text-sm border border-[#502DA6] hover:border-[#3A1E7A] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors"
              >
                Create new account
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </form>
      );
    } else if (isChangingPassword) {
      return (
        <form
          onSubmit={handleChangePassword}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="mr-2 sm:mr-3 md:mr-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Update your account security
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Phone number input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone_number}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                />
              </div>
            </div>

            {/* Current Password input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                />
              </div>
            </div>

            {/* New Password input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                />
              </div>
            </div>

            {/* Update button */}
            <button
              type="submit"
              className="w-full bg-[#502DA6] hover:bg-[#3A1E7A] text-white py-2.5 sm:py-3 md:py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow text-xs sm:text-sm md:text-base"
            >
              Update Password
            </button>
          </div>
        </form>
      );
    } else if (isForgotPassword) {
      return (
        <form className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="mr-2 sm:mr-3 md:mr-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                Reset Password
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Enter your phone number to receive OTP
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Phone number input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone_number}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                  disabled={isOtpSent}
                />
              </div>
            </div>

            {!isOtpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phone_number.length !== 10}
                className={`w-full py-2.5 sm:py-3 md:py-4 px-4 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm md:text-base ${
                  phone_number.length === 10
                    ? "bg-[#502DA6] hover:bg-[#3A1E7A] text-white shadow-sm hover:shadow"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send OTP
              </button>
            ) : (
              <>
                {/* OTP input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP sent to your phone"
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* New Password input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] focus:border-[#502DA6] focus:outline-none transition-all bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  className="w-full bg-[#502DA6] hover:bg-[#3A1E7A] text-white py-2.5 sm:py-3 md:py-4 px-4 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow text-xs sm:text-sm md:text-base"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 mt-14 sm:mt-16 md:mt-20 lg:mt-24">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
            {/* Left Side - Brand & Info */}
            <div className="lg:col-span-7 order-2 lg:order-1 mt-6 lg:mt-0">
              <div className="max-w-2xl">
                <div className="mb-5 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
                  <div className="inline-flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    <div>
                      <img
                        src={logo}
                        alt="Trakky Logo"
                        className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
                      />
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#502DA6] font-medium mt-0.5 sm:mt-1 md:mt-2">
                        Complete Salon POS
                      </p>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                    Streamline Your Salon Business
                    <br />
                    <span className="text-gray-700">
                      with Intelligent Management
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    Designed specifically for Indian salons, Trakky provides a
                    comprehensive POS solution that combines traditional
                    business values with modern technology.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                  {features.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 p-2 sm:p-2.5 md:p-3 lg:p-4 border hover:bg-gray-50 rounded-lg md:rounded-xl transition-colors"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-[#502DA6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#502DA6]" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-xs md:text-sm">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="bg-white rounded-xl md:rounded-2xl border border-[#502DA6] shadow-sm shadow-[#502DA6] p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                        Account Login
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                        Access your salon dashboard
                      </p>
                    </div>
                    <div className="text-xs px-2 py-1 bg-[#502DA6]/10 text-[#502DA6] rounded-full font-medium whitespace-nowrap">
                      Secure Access
                    </div>
                  </div>
                </div>

                {renderFormContent()}
              </div>

              {/* Security Note */}
              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-[#502DA6]/5 rounded-lg border border-[#502DA6]/20">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-[#502DA6] mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-700">
                      <span className="font-medium text-[#502DA6]">
                        Bank-grade security
                      </span>{" "}
                      – Your data is encrypted end-to-end with 256-bit SSL
                      protection. 100% compliant with Indian data protection
                      laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-3 sm:py-4 md:py-5 lg:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-0 text-center md:text-left">
              © {new Date().getFullYear()} Trakky POS Systems Pvt. Ltd. All
              rights reserved.
              <span className="block text-xs text-gray-500 mt-0.5 sm:mt-1">
                GSTIN: 07AAJCT1234M1Z5
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-xs md:text-sm text-gray-600">
              <a href="#" className="hover:text-[#502DA6] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#502DA6] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#502DA6] transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-[#502DA6] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#374151",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
          },
          success: {
            style: {
              background: "#502DA6",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
          },
        }}
      />
    </div>
  );
}

export default Login;