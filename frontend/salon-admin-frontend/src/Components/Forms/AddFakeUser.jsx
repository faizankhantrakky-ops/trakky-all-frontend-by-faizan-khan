import React, { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const AddUser = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  // Realistic Indian name lists
  const firstNamesMale = [
    "Aarav", "Vihaan", "Arjun", "Ishaan", "Reyansh", "Ayaan", "Krishna", "Sai", "Aditya", "Rudra",
    "Aryan", "Veer", "Shaurya", "Kabir", "Rohan", "Dhruv", "Yash", "Advik", "Nivaan", "Aarush",
    "Atharv", "Ansh", "Kiaan", "Vedant", "Pranav", "Siddharth", "Hrithik", "Nikhil", "Om", "Tejas"
  ];

  const firstNamesFemale = [
    "Aaradhya", "Saavi", "Ananya", "Diya", "Aadhya", "Myra", "Kiara", "Siya", "Anika", "Pari",
    "Aarohi", "Ira", "Prisha", "Riya", "Avani", "Saanvi", "Zara", "Navya", "Kyra", "Sia",
    "Vivaan", "Aditi", "Ishita", "Tanvi", "Meera", "Shreya", "Naina", "Riya", "Pooja", "Divya"
  ];

  const lastNames = [
    "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Yadav", "Mehta", "Jain", "Verma",
    "Rao", "Naidu", "Khan", "Malhotra", "Agarwal", "Shah", "Joshi", "Desai", "Pandey", "Chauhan",
    "Dubey", "Mishra", "Trivedi", "Srivastava", "Thakur", "Rajput", "Choudhary", "Bansal", "Goel", "Saxena"
  ];

  const generateIndianName = () => {
    const firstNames = Math.random() < 0.5 ? firstNamesMale : firstNamesFemale;
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
  };

  const generatePhoneNumber = () => {
    const starts = ["7", "8", "9", "6"];
    const start = starts[Math.floor(Math.random() * starts.length)];
    let number = start;
    for (let i = 0; i < 9; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  };

  const [phoneNumber, setPhoneNumber] = useState(generatePhoneNumber());
  const [name, setName] = useState(generateIndianName());

  // Ek hi function jo dono regenerate karega
  const generateNewBoth = () => {
    setPhoneNumber(generatePhoneNumber());
    setName(generateIndianName());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name", {
        duration: 3000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits", {
        duration: 3000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    const data = { phone_number: phoneNumber, name };
    const toastId = toast.loading("Adding user...", { position: "top-center" });

    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/salonuser/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("User added successfully", {
          id: toastId,
          duration: 3000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        generateNewBoth(); // Success ke baad naya name + number
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        if (errorResponse.phone_number?.includes("already exists")) {
          toast.error("Phone number already exists. Generating new...", {
            id: toastId,
            duration: 3000,
            style: { background: "#f59e0b", color: "#fff", borderRadius: "8px" },
          });
          generateNewBoth(); // Duplicate pe bhi naya dono
        } else {
          toast.error("Invalid data. Please check and try again.", {
            id: toastId,
            duration: 4000,
            style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
          });
        }
      } else if (response.status === 401) {
        toast.error("Session expired. Logging out...", {
          id: toastId,
          duration: 3000,
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
        logoutUser();
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        id: toastId,
        duration: 4000,
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  const isValidPhone = phoneNumber.length === 10;

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-6 py-5">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <p className="text-sm text-gray-500 mt-1">
                Create a new salon user with a unique phone number
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-sm p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Auto-generated Indian name"
                required
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-500 ml-2">
                  Starts with 6-9, exactly 10 digits
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhoneNumber(value);
                  }}
                  placeholder="10-digit mobile number"
                  className={`w-full h-12 pl-4 pr-12 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition placeholder-gray-400 ${
                    isValidPhone
                      ? "border-green-500 focus:ring-green-500"
                      : phoneNumber.length > 0
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {phoneNumber.length > 0 && (
                    isValidPhone ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                    )
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {phoneNumber.length}/10 digits
                </p>
                {/* Ek hi "Generate New" button jo name + number dono change kare */}
                <button
                  type="button"
                  onClick={generateNewBoth}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  Generate New
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!name.trim() || !isValidPhone}
                className={`w-full h-12 text-sm font-medium text-white rounded-lg transition ${
                  !name.trim() || !isValidPhone
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                }`}
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUser;