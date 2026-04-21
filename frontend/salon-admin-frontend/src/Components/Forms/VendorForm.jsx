import React, { useState, useEffect, useContext } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import ErrorIcon from "@mui/icons-material/Error";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiBriefcase, FiPhone, FiMail, FiLock, FiHome, FiCalendar, FiSettings, FiImage } from "react-icons/fi";
import { Avatar, Chip } from "@mui/material";
  import {FiEye, FiEyeOff } from "react-icons/fi";

const AddVendor = ({ vendorData, setVendorData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);


const [showPassword, setShowPassword] = useState(false);

  // === Form States ===
  const [vendorName, setVendorName] = useState(vendorData?.ownername || "");
  const [businessName, setBusinessName] = useState(vendorData?.businessname || "");
  const [phoneNumber, setPhoneNumber] = useState(vendorData?.ph_number || "");
  const [password, setPassword] = useState(vendorData?.password || "");
  const [email, setEmail] = useState(vendorData?.email || "");
  const [branchname, setBranchname] = useState(vendorData?.branchname || "");
  const [branchcode, setBranchcode] = useState(vendorData?.branchcode || "");
  const [vendorlogo, setVendorLogo] = useState(null);
  const [selectedSalonId, setSelectedSalonId] = useState(vendorData?.salon || "");
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (vendorData) return { value: vendorData?.salon, label: vendorData?.salon_name };
    return null;
  });

  const [softwareStartDate, setSoftwareStartDate] = useState(vendorData?.software_start_date || "");
  const [softwareEndDate, setSoftwareEndDate] = useState(vendorData?.software_end_date || "");
  const [durationInMonths, setDurationInMonths] = useState({ months: 0, days: 0 });

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // === Permissions List ===
  const permissionsList = [
    { id: 41, code: "DashaBoard", name: "Dashboard" },
    { id: 42, code: "Appointment", name: "Appointment" },
    { id: 43, code: "Inventory", name: "Inventory" },
    { id: 44, code: "Clients", name: "Clients" },
    { id: 45, code: "Menu", name: "Menu" },
    { id: 46, code: "DailyExpenses", name: "Daily Expenses" },
    { id: 47, code: "Profile", name: "Profile" },
    { id: 48, code: "CustomerSegment", name: "Customer Segment" },
    { id: 49, code: "Settings", name: "Settings" },
    { id: 50, code: "Reports", name: "Reports" },
    { id: 51, code: "Permissions", name: "Permissions" },
    { id: 52, code: "Staff", name: "Staff" },
  ];

  // === Load Edit Permissions ===
  useEffect(() => {
    if (vendorData?.permission_list) {
      const codes = vendorData.permission_list.map(p => (typeof p === "object" ? p.code : p));
      setSelectedPermissions(codes);
    }
  }, [vendorData]);

  // === Calculate Duration in Months + Days ===
  const calculateDurationInMonths = () => {
    if (!softwareStartDate || !softwareEndDate) return { months: 0, days: 0 };

    const start = new Date(softwareStartDate + "T00:00:00");
    const end = new Date(softwareEndDate + "T00:00:00");

    if (isNaN(start) || isNaN(end) || end < start) return { months: 0, days: 0 };

    // Calculate total days
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (totalDays <= 0) return { months: 0, days: 0 };

    // Calculate months
    let months = 0;
    let tempEnd = new Date(end);
    tempEnd.setDate(1); // Start of month
    
    while (tempEnd > start) {
      months++;
      tempEnd.setMonth(tempEnd.getMonth() - 1);
    }

    // Calculate remaining days
    let remainingDays = 0;
    if (months > 0) {
      const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + months, 0);
      remainingDays = Math.max(0, (end - lastDayOfMonth) / (1000 * 3600 * 24));
    } else {
      remainingDays = totalDays;
    }

    return { 
      months: months, 
      days: Math.round(remainingDays) 
    };
  };

  // === Update Duration on Date Change ===
  useEffect(() => {
    const result = calculateDurationInMonths();
    setDurationInMonths(result);
  }, [softwareStartDate, softwareEndDate]);

  // === Load Salons ===
  const loadSalons = async (inputValue, callback) => {
    if (!inputValue) return callback([]);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}`
      );
      const data = await res.json();
      const options = data?.results?.map(s => ({ value: s.id, label: s.name }));
      callback(options);
    } catch (err) {
      callback([]);
    }
  };

  // === Submit ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) return toast.error("Phone must be 10 digits");
    if (!softwareStartDate) return toast.error("Select Start Date");
    if (!softwareEndDate) return toast.error("Select End Date");
    if (new Date(softwareEndDate) < new Date(softwareStartDate)) {
      return toast.error("End Date cannot be before Start Date");
    }
    if (selectedPermissions.length === 0) return toast.error("Select at least one permission");

    // Calculate total months for backend
    const totalMonthsForBackend = durationInMonths.months + Math.ceil(durationInMonths.days / 30);

    const formData = new FormData();
    formData.append("ownername", vendorName);
    formData.append("businessname", businessName);
    formData.append("ph_number", phoneNumber);
    formData.append("email", email);
    formData.append("branchname", branchname);
    formData.append("branchcode", branchcode);
    formData.append("salon", selectedSalonId);
    formData.append("software_start_date", softwareStartDate);
    formData.append("software_end_date", softwareEndDate);
    formData.append("duration_in_months", totalMonthsForBackend);

    // FIXED: Send as JSON array of objects
    const permissionObjects = selectedPermissions.map(code => ({ code }));
    formData.append("permission_list", JSON.stringify(permissionObjects));

    if (!vendorData) formData.append("password", password);
    if (vendorlogo) formData.append("logo", vendorlogo[0]);

    try {
      const url = `https://backendapi.trakky.in/salonvendor/vendor/${vendorData?.id ? vendorData.id + "/" : ""}`;
      const res = await fetch(url, {
        method: vendorData ? "PATCH" : "POST",
        headers: { Authorization: "Bearer " + authTokens.access },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        // Improved error handling for specific backend errors
        let errorMessage = "An error occurred. Please try again.";
        if (data.salon && data.salon.length > 0) {
          errorMessage = data.salon[0]; // e.g., "vendor user with this salon already exists."
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.ph_number && data.ph_number.length > 0) {
          errorMessage = data.ph_number[0];
        } else if (data.email && data.email.length > 0) {
          errorMessage = data.email[0];
        } else if (data.non_field_errors && data.non_field_errors.length > 0) {
          errorMessage = data.non_field_errors[0];
        }
        toast.error(errorMessage);
        return;
      }

      if (vendorData) {
        setVendorData(data);
        toast.success("Updated!");
      } else {
        toast.success("Added!");
        // Reset
        setVendorName(""); setBusinessName(""); setPhoneNumber(""); setPassword("");
        setEmail(""); setBranchname(""); setBranchcode(""); setSelectedSalons(null);
        setSelectedSalonId(""); setSoftwareStartDate(""); setSoftwareEndDate("");
        setDurationInMonths({ months: 0, days: 0 }); setSelectedPermissions([]);
        setVendorLogo(null); document.getElementById("logo").value = "";
      }
    } catch (err) {
      // Handle network or other unexpected errors
      console.error("Unexpected error:", err);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const togglePermission = (code) => {
    setSelectedPermissions(prev =>
      prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 font-sans antialiased">
        <div className="mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiBriefcase className="text-[#502DA6]" />
                {vendorData ? "Edit Vendor" : "Add New Vendor"}
              </h1>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <FiSettings className="h-4 w-4" />
                Back
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Fill in the details to {vendorData ? "update" : "create"} a vendor profile
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Salon Selection */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    Salon Assignment
                  </h3>
                  <div className="input-box inp-salon">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Salon</label>
                    <AsyncSelect
                      cacheOptions defaultOptions loadOptions={loadSalons}
                      value={selectedSalons}
                      onChange={opt => { setSelectedSalons(opt); setSelectedSalonId(opt?.value || ""); }}
                      placeholder="Search and select a salon..."
                      styles={{ 
                        control: base => ({ 
                          ...base, 
                          borderRadius: "8px", 
                          padding: "2px",
                          border: "1px solid #d1d5db",
                          minHeight: "44px",
                          "&:hover": { borderColor: "#502DA6" }
                        }),
                        placeholder: base => ({ ...base, color: "#9ca3af" })
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Personal & Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="text-[#502DA6]" />
                    Vendor Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter Vendor Name"
                    value={vendorName} 
                    onChange={e => setVendorName(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiBriefcase className="text-[#502DA6]" />
                    Business Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter Business Name"
                    value={businessName} 
                    onChange={e => setBusinessName(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiPhone className="text-[#502DA6]" />
                    Phone Number
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
                    onChange={e => e.target.value.length <= 10 && setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                  {phoneNumber && phoneNumber.length !== 10 && (
                    <ErrorIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                  )}
                </div>
              </div>

              {/* Password (Add only) */}
              {!vendorData && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="input-box col-1">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <FiLock className="text-[#502DA6]" />
        Password
      </label>

      {/* Password Field */}
      <div className="relative">
        <input
        placeholder="Enter Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-[#502DA6]
                     focus:border-transparent transition"
        />

        {/* Show / Hide Icon */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#502DA6]"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>

    <div className="col-span-2" /> {/* Spacer */}
  </div>
)}


              {/* Contact & Branch Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="text-[#502DA6]" />
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={email} 
                    placeholder="Enter Email"
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiHome className="text-[#502DA6]" />
                    Branch Name
                  </label>
                  <input 
                    type="text" 
                    placeholder=" Branch Name"
                    value={branchname} 
                    onChange={e => setBranchname(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Branch Code
                  </label>
                  <input 
                    type="text" 
                    placeholder="Branch Code"
                    value={branchcode} 
                    onChange={e => setBranchcode(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Software Dates & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiCalendar className="text-[#502DA6]" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={softwareStartDate}
                    onChange={e => setSoftwareStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiCalendar className="text-[#502DA6]" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={softwareEndDate}
                    onChange={e => setSoftwareEndDate(e.target.value)}
                    min={softwareStartDate}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] focus:border-transparent transition"
                  />
                </div>
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiSettings className="text-[#502DA6]" />
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Duration"
                    value={
                      durationInMonths.months > 0 || durationInMonths.days > 0
                        ? durationInMonths.months > 0 
                          ? `${durationInMonths.months} Month${durationInMonths.months > 1 ? 's' : ''} ${durationInMonths.days} Day${durationInMonths.days > 1 ? 's' : ''}`
                          : `${durationInMonths.days} Day${durationInMonths.days > 1 ? 's' : ''}`
                        : ''
                    }
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[#502DA6] font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiSettings className="text-[#502DA6]" />
                    Select Permissions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {permissionsList.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.code)}
                          onChange={() => togglePermission(perm.code)}
                          className="mr-3 w-4 h-4 text-[#502DA6] bg-gray-100 border-gray-300 rounded focus:ring-[#502DA6] focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-900">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {selectedPermissions.length} of {permissionsList.length} permissions selected
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="input-box col-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiImage className="text-[#502DA6]" />
                    Vendor Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={e => setVendorLogo(e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#502DA6] file:text-white hover:file:bg-[#401c94]"
                  />
                  {vendorlogo && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar src={URL.createObjectURL(vendorlogo[0])} alt="Preview" sx={{ width: 32, height: 32 }} />
                      <span className="text-sm text-gray-600">Selected: {vendorlogo[0].name}</span>
                    </div>
                  )}
                </div>
                <div className="col-span-2" /> {/* Spacer */}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#502DA6] hover:bg-[#401c94] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200 flex items-center gap-2 text-lg"
                >
                  {vendorData ? "Update Vendor" : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVendor;