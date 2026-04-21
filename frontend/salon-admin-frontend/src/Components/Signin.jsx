import React, { useContext, useEffect } from "react";
import AuthContext from "../Context/AuthContext";

import usernameImg from "./images/username.png";
import passwordImg from "./images/password.png";
import logo from "./images/logo_white.png";

const Signin = () => {
  let { loginUser, logoutUser } = useContext(AuthContext);
  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return (
    <>
      <div className="login-container flex w-screen h-screen bg-gray-50">
        {/* Left Side - Branding Section */}
        <div className="login-left hidden lg:flex lg:w-1/2 bg-[#3F2386] flex-col justify-center items-center p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
          </div>
          
          {/* Logo and Branding */}
          <div className="relative z-10 text-center mb-12">
            <div className="w-48 h-48 mx-auto mb-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <img src={logo} alt="company-logo" className="w-32" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Admin Portal
            </h1>
            <p className="text-xl text-purple-200 font-light">
              Product Management System
            </p>
          </div>

          {/* Features List */}
          <div className="relative z-10 w-full max-w-md mt-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white font-medium">Secure Access Control</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white font-medium">User Management</span>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="relative z-10 mt-auto pt-8">
            <p className="text-purple-200 text-sm text-center">
              © 2024 Admin Panel v2.0 • Secure Access Required
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right flex-1 flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-[#3F2386]  px-4 py-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Administrator Login
                  </h2>
                  <p className="text-purple-200 text-sm">
                    Sign in to your management dashboard
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <div className="px-3 py-8">
                <form onSubmit={loginUser} className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <img
                          src={usernameImg}
                          alt="username"
                          className="w-5 h-5 opacity-70"
                        />
                      </div>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter your username or phone number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3F2386] focus:border-[#3F2386] transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <img
                          src={passwordImg}
                          alt="password"
                          className="w-5 h-5 opacity-70"
                        />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3F2386] focus:border-[#3F2386] transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Options Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember-me" 
                        className="w-4 h-4 text-[#3F2386] border-gray-300 rounded focus:ring-[#3F2386]"
                      />
                      <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-[#3F2386] hover:text-purple-800 transition-colors duration-200">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#3F2386] text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F2386] transition-all duration-200"
                    >
                      Sign In to Dashboard
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Footer - Only shows on small screens */}
              <div className="lg:hidden bg-gray-50 px-8 py-4 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  © 2024 Admin Panel • Secure Access
                </p>
              </div>
            </div>

            {/* Additional Info for Desktop */}
            <div className="hidden lg:block mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact your system administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;