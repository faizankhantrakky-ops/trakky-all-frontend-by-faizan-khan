import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import Select from "react-select";

const AddSalonScore = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [score, setScore] = useState("");
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectSalonId, setSelectSalonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  /* --------------------------------------------------------------
     SAFE JSON PARSE
  -------------------------------------------------------------- */
  const safeJsonParse = async (response) => {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (err) {
      return {};
    }
  };

  /* --------------------------------------------------------------
     SUBMIT – Multiple Users (Separate Requests)
  -------------------------------------------------------------- */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user", { duration: 4000 });
      return;
    }

    if (!selectSalonId || !score) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    const requests = selectedUsers.map(async (user) => {
      const formData = new FormData();
      formData.append("salon", selectSalonId);
      formData.append("user", user.value);
      formData.append("score", score);

      try {
        const response = await fetch(`https://backendapi.trakky.in/salons/fakescore/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        });

        const responseData = await safeJsonParse(response);

        if (response.status === 201) {
          return { success: true, user: user.label || user.value };
        }

        if (response.status === 401) {
          logoutUser();
          return { success: false, error: "Logged out", user: user.label || user.value };
        }

       
      } catch (error) {
        return { success: false, error: "Network error", user: user.label || user.value };
      }
    });

    try {
      const results = await Promise.all(requests);

      const successes = results.filter(r => r.success);
      const failures = results.filter(r => !r.success);

      // Success Toast
      if (successes.length > 0) {
        toast.success(
          `Success for ${successes.length} user(s): ${successes.map(s => s.user).join(", ")}`,
          { duration: 5000, style: { background: "#10b981", color: "#fff" } }
        );
      }

    
// setAllUsers([]);
      // Clear ONLY users, NOT score
      setSelectedUsers([]);

      // Keep: score, city, salon
      // setScore("");  ← REMOVED

    } catch (err) {
      toast.success("Successfully Addedd");
      // setAllUsers([]);
      setSelectedUsers([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --------------------------------------------------------------
     GET CITIES
  -------------------------------------------------------------- */
  const getCity = async () => {
    const url = `https://backendapi.trakky.in/salons/city/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const cityList = data?.payload?.map(item => item.name) || [];
      setCity(cityList);
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------------------------------------------
     LOAD SALONS (Updated with Salon Name - Area format)
  -------------------------------------------------------------- */
  const loadSalons = async (inputValue, callback) => {
    if (!selectedCity || !inputValue) {
      callback([]);
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}&city=${selectedCity}`
      );
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      const options = (data?.results || []).map(salon => ({
        value: salon.id,
        label: `${salon.name} - ${salon.area}`, // Changed to include area
        originalName: salon.name,
        area: salon.area
      }));
      callback(options);
    } catch (error) {
      callback([]);
    }
  };

  /* --------------------------------------------------------------
     GET USERS
  -------------------------------------------------------------- */
  const getAllUsers = async () => {
    const url = `https://backendapi.trakky.in/salons/salonuser/?verified=False`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
      });
      const data = await response.json();
      setAllUsers(data || []);
      setLoadingUsers(false);
    } catch (error) {
      console.error(error);
      setLoadingUsers(false);
    }
  };

  /* --------------------------------------------------------------
     FORMAT USERS
  -------------------------------------------------------------- */
  const formatUserOptions = () => {
    const usersWithName = allUsers.filter(u => u.name);
    const usersWithoutName = allUsers.filter(u => !u.name);

    const sortedWithName = usersWithName.sort((a, b) => a.name.localeCompare(b.name));
    const sortedWithoutName = usersWithoutName.sort((a, b) => a.phone_number.localeCompare(b.phone_number));

    const sorted = [...sortedWithName, ...sortedWithoutName];

    return sorted.map(user => ({
      value: user.id,
      label: user.name ? `${user.name} (${user.phone_number})` : user.phone_number,
    }));
  };

  useEffect(() => {
    getCity();
    getAllUsers();
  }, []);

  /* --------------------------------------------------------------
     STYLES
  -------------------------------------------------------------- */
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#d1d5db",
      borderRadius: "0.375rem",
      boxShadow: "none",
      minHeight: "44px",
      "&:hover": { borderColor: "#9ca3af" },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#dbeafe",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#1e40af",
    }),
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-4 font-sans">
        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Salon Score (Bulk)</h3>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Users <span className="text-red-500">*</span>
                </label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                  <Select
                    isMulti
                    options={formatUserOptions()}
                    value={selectedUsers}
                    onChange={setSelectedUsers}
                    placeholder="Select users..."
                    closeMenuOnSelect={false}
                    styles={selectStyles}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {selectedUsers.length} selected
                </p>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedSalons(null);
                    setSelectSalonId("");
                  }}
                  required
                  className="w-full h-11 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose City</option>
                  {city.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Salon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon <span className="text-red-500">*</span>
                </label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadSalons}
                  value={selectedSalons}
                  onChange={(opt) => {
                    setSelectedSalons(opt);
                    setSelectSalonId(opt?.value || "");
                  }}
                  isDisabled={!selectedCity}
                  placeholder={selectedCity ? "Search salon..." : "Select city first"}
                  noOptionsMessage={() => selectedCity ? "No salons found" : "Select city first"}
                  styles={selectStyles}
                  formatOptionLabel={(option, { context }) => (
                    <div>
                      {context === "menu" ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{option.originalName}</span>
                          <span className="text-xs text-gray-500">Area: {option.area}</span>
                        </div>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score (0-10) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  value={score}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (val >= 0 && val <= 10)) setScore(val);
                  }}
                  required
                  placeholder="8"
                  className="w-full h-11 px-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || selectedUsers.length === 0 || !selectSalonId || !score}
                  className={`w-full h-12 font-medium rounded-md text-white transition-all flex items-center justify-center ${
                    isSubmitting || selectedUsers.length === 0 || !selectSalonId || !score
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    `Submit for ${selectedUsers.length} User(s)`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSalonScore;