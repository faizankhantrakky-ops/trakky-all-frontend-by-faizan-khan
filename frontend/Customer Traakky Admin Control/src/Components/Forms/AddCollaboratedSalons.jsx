import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { FaTimes } from "react-icons/fa";
import "quill/dist/quill.snow.css";

const AddCollaborated = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectSalonId, setSelectSalonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    no_of_leads: "",
    package_starting_date: "",
    package_expire_date: ""
  });

  const handleBackToList = () => {
    navigate("/collaborated");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const postData = new FormData();
    postData.append("salon", selectSalonId);
    postData.append("no_of_leads", formData.no_of_leads);
    postData.append("package_starting_date", formData.package_starting_date);
    postData.append("package_expire_date", formData.package_expire_date);

    try {
      let response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: postData,
        }
      );
      const responseData = await response.json();
      if (response.status === 201) {
        toast.success("Added successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        });
        setSelectSalonId("");
        setSelectedSalons(null);
        setSelectedCity("");
        setFormData({
          no_of_leads: "",
          package_starting_date: "",
          package_expire_date: ""
        });
      } else if (
        response.status === 400 &&
        responseData.salon &&
        responseData.salon.length > 0
      ) {
        toast.error(responseData.salon[0], {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to add. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      })
      .catch((err) => alert(err));
  };

  const loadSalons = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
            inputValue
          )}&city=${selectedCity}`
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  return (
    <>
      <Toaster />
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8  mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Add Collaborated Salon
            </h3>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              onClick={handleBackToList}
            >
              Show List
            </button>
          </div>

          {/* City Selection */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Select City
            </label>
            <select
              name="city"
              id="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedSalons("");
                setSelectedCity(e.target.value);
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
              required
            >
              <option value="">Select City</option>
              {city.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Salon Selection */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="salons" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Select Salon
              <span className="text-xs text-gray-500 ml-2 block sm:inline">
                (Salon must belong to selected city)
              </span>
            </label>
            <AsyncSelect
              isDisabled={!selectedCity}
              defaultOptions
              loadOptions={loadSalons}
              value={selectedSalons}
              onChange={(selectedSalon) => {
                setSelectedSalons(selectedSalon);
                setSelectSalonId(selectedSalon.value);
              }}
              noOptionsMessage={() => "No salons found"}
              placeholder="Search Salon..."
              classNamePrefix="select"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#9ca3af',
                  },
                  padding: '2px',
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 640 ? '14px' : '16px',
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: window.innerWidth < 640 ? '14px' : '16px',
                }),
                option: (base) => ({
                  ...base,
                  fontSize: window.innerWidth < 640 ? '14px' : '16px',
                  padding: window.innerWidth < 640 ? '8px 12px' : '10px 16px',
                }),
              }}
            />
          </div>

          {/* Number of Leads */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="no_of_leads" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Number of Leads
            </label>
            <input
              type="number"
              name="no_of_leads"
              id="no_of_leads"
              value={formData.no_of_leads}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
              required
              min="1"
              placeholder="Enter number of leads"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label htmlFor="package_starting_date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Package Starting Date
              </label>
              <input
                type="date"
                name="package_starting_date"
                id="package_starting_date"
                value={formData.package_starting_date}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="package_expire_date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Package Expire Date
              </label>
              <input
                type="date"
                name="package_expire_date"
                id="package_expire_date"
                value={formData.package_expire_date}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
                required
                min={formData.package_starting_date}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCollaborated;