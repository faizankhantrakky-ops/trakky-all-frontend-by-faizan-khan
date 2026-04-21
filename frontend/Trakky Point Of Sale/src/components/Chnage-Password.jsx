import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Smartphone, Lock, CheckCircle, ArrowLeft, Shield, AlertCircle } from "lucide-react";

const ChangePassword = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const jsonData = await response.json();
        setUserData(jsonData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchData();
  }, [user.user_id]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 25;
    if (/[!@#$%^&*]/.test(newPassword)) strength += 25;
    setPasswordStrength(strength);
  }, [newPassword]);

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userData.ph_number || !oldPassword || !newPassword) {
      toast.error(
        "Phone number, current password, and new password are required."
      );
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      toast.error("Please choose a stronger password.");
      setIsLoading(false);
      return;
    }


    
  let branchId = localStorage.getItem("branchId") || "";


    const formData = new FormData();
    formData.append("ph_number", userData.ph_number);
    formData.append("password", oldPassword);
    formData.append("new_password", newPassword);
    // formData.append("branchId", branchId);


    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/update-password/",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      const responseData = JSON.parse(responseText);

      toast.success("Password updated successfully");
      setTimeout(() => {
        logoutUser();
      }, 1500);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.message || "An error occurred while updating the password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={{
          style: {
            fontSize: isMobile ? '14px' : '16px',
            maxWidth: isMobile ? '90%' : '400px',
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ">
        <div className=" mx-auto">
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-[#492DBD] to-[#5a3cd9] px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-2.5 bg-white bg-opacity-20 rounded-xl backdrop-filter backdrop-blur-sm">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Change Password
                  </h1>
                  <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1 opacity-90">
                    Secure your account with a strong password
                  </p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="px-4 sm:px-6 py-5 sm:py-6">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Phone Number Field - Read Only */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userData.ph_number || "Not Provided"}
                      readOnly
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl bg-gray-50 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Current Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="block w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-transparent transition-all duration-200"
                      placeholder="Enter current password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={handleClickShowOldPassword}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-transparent transition-all duration-200"
                      placeholder="Enter new password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={handleClickShowNewPassword}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <span className={`ml-3 text-xs font-medium ${
                          passwordStrength < 50 ? 'text-red-600' : 
                          passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-transparent transition-all duration-200 ${
                        newPassword && confirmPassword
                          ? newPassword === confirmPassword
                            ? "border-green-300 bg-green-50"
                            : "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
                      {newPassword && confirmPassword && (
                        newPassword === confirmPassword ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={handleClickShowConfirmPassword}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1.5 text-xs sm:text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Passwords do not match
                    </p>
                  )}
                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <p className="mt-1.5 text-xs sm:text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Password Requirements Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <div className="flex items-start space-x-2 sm:space-x-3 mb-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD] mt-0.5" />
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                      Password Requirements
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                   
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-xs ${
                        /[0-9]/.test(newPassword) ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        Number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        /[!@#$%^&*]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-xs ${
                        /[!@#$%^&*]/.test(newPassword) ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        Special character
                      </span>
                    </div>

                     <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-xs ${
                        newPassword.length >= 8 ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-xs ${
                        /[A-Z]/.test(newPassword) ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        Uppercase letter
                      </span>
                    </div>

                    
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-medium text-white bg-gradient-to-r from-[#492DBD] to-[#5a3cd9] hover:from-[#3a2199] hover:to-[#4b2db1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#492DBD] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice - Enhanced */}
              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">
                      Important Security Notice
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                      After successfully changing your password, you will be automatically logged out for security purposes. 
                      Please sign in again with your new password to continue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Tips - Mobile Accordion Style */}
              {isMobile && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700">
                      Tip: Use a unique password you haven't used elsewhere
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note - Desktop */}
          {!isMobile && (
            <p className="text-center text-xs text-gray-500 mt-6">
              Secure password helps protect your account from unauthorized access
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;