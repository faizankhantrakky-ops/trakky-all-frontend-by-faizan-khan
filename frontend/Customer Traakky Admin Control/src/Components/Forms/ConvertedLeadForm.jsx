import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AsyncSelect from "react-select/async";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const ConvertedLeadForm = ({ leadData, onSuccess, onCancel }) => {
  const API_URL = "https://backendapi.trakky.in/salons/convertedleads/";
  const MASTER_SERVICE_API = "https://backendapi.trakky.in/salons/masterservice/";
  const SALON_API = "https://backendapi.trakky.in/salons/A1/search-salon/";
  const CAMPAIGN_API = "https://backendapi.trakky.in/salons/addspend/";
  const CITIES_API = "https://backendapi.trakky.in/salons/city/";
  const CATEGORIES_API = "https://backendapi.trakky.in/salons/mastercategory/";
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCityLoading, setIsCityLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [mobileDebounce, setMobileDebounce] = useState(null);

  const SOURCE_CHOICES = [
    { value: "ads", label: "Ads" },
    { value: "retargeting", label: "Retargeting" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "special_case", label: "Special Case" },
    { value: "website", label: "Website" },
    { value: "direct-message", label: "Direct Message" },
  ];

  const [isPriceRange, setIsPriceRange] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const fetchCustomerDetails = async (mobileNumber) => {
    if (!mobileNumber || mobileNumber.length !== 10) return;

    try {
      const response = await fetch(
        `${API_URL}?customer_mobile_number=${mobileNumber}`,
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          const recentLead = data.results.sort(
            (a, b) => new Date(b.converted_date) - new Date(a.converted_date)
          )[0];

          setFormData((prev) => ({
            ...prev,
            customer_name: recentLead.customer_name || prev.customer_name,
            gender: recentLead.gender || prev.gender,
          }));
          toast.success("Customer details auto-filled from previous leads");
        }
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast(error);
    }
  };

  // Add this useEffect to handle existing lead data
  useEffect(() => {
    if (leadData) {
      setFormData({
        // ... existing formData setup
        price: leadData.price || "",
      });

      // Check if price is a range (contains hyphen)
      if (
        leadData.price &&
        typeof leadData.price === "string" &&
        leadData.price.includes("-")
      ) {
        const [min, max] = leadData.price.split("-").map((p) => p.trim());
        setIsPriceRange(true);
        setPriceRange({
          min: min || "",
          max: max || "",
        });
      }
    }
  }, [leadData]);

  // Add this function to handle price range checkbox change
  const handlePriceRangeChange = (e) => {
    const checked = e.target.checked;
    setIsPriceRange(checked);

    // Reset price field when switching modes
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        price: "",
      }));
      setPriceRange({ min: "", max: "" });
    } else {
      setPriceRange({ min: "", max: "" });
    }
  };

  // Add this function to handle price range input changes
  const handlePriceRangeInputChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form state
  const [formData, setFormData] = useState({
    salon: "",
    masterservice: [],
    gender: "male",
    converted_date: "",
    appointment_date: "",
    booking_time: "",
    customer_name: "",
    customer_mobile_number: "",
    choice: "converted",
    cancel_reason: "",
    remarks: "",
    price: "",
    source_of_lead: "",
    ad_spend: null,
    campaign_name: null,
    does_customer_visited_the_salon: false,
    reason_for_not_visited_the_salon: "",
    number_of_customers: 1,
  });

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate("/convertedlead");
  };

  useEffect(() => {
    if (leadData) {
      setFormData({
        salon: leadData.salon,
        masterservice: leadData.masterservice,
        gender: leadData.gender,
        converted_date: leadData.converted_date,
        appointment_date: leadData.appointment_date,
        booking_time: leadData.booking_time || "",
        customer_name: leadData.customer_name || "",
        customer_mobile_number: leadData.customer_mobile_number,
        choice: leadData.choice,
        cancel_reason: leadData.cancel_reason || "",
        remarks: leadData.remarks || "",
        price: leadData.price || "",
        source_of_lead: leadData.source_of_lead || "",
        ad_spend: leadData.ad_spend || null,
        campaign_name: leadData.campaign_name || null,
        does_customer_visited_the_salon:
          leadData.does_customer_visited_the_salon || false,
        reason_for_not_visited_the_salon:
          leadData.reason_for_not_visited_the_salon || "",
        number_of_customers: leadData.number_of_customers || 1,
      });

      if (leadData.salon) {
        setSelectedSalon({
          value: leadData.salon,
          label: leadData.salon_info?.name || "Selected Salon",
        });
      }

      if (leadData.masterservice && leadData.masterservice.length > 0) {
        setSelectedServices(
          leadData.masterservice_info?.map((service) => ({
            value: service.id,
            label: `${service.service_name} (${service.gender}) - ${service.category_name}`,
          })) ||
            leadData.masterservice.map((id) => ({
              value: id,
              label: `Service ${id}`,
            }))
        );
      }

      if (leadData.ad_spend) {
        setSelectedCampaign({
          value: leadData.ad_spend,
          label: leadData.campaign_name || `Campaign ${leadData.ad_spend}`,
        });
      }
    }
  }, [leadData]);

  const loadSalons = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `${SALON_API}?name=${encodeURIComponent(inputValue)}`,
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
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
  };

  const fetchCities = async () => {
    try {
      setIsCityLoading(true);
      const response = await fetch(CITIES_API, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cities");

      const data = await response.json();
      setCities(data.results || data.payload);
    } catch (error) {
      toast.error("Failed to load cities");
      console.error("Error fetching cities:", error);
    } finally {
      setIsCityLoading(false);
    }
  };

  const [nextPage, setNextPage] = useState(null);

  const loadCategories = async (inputValue, callback) => {
    try {
      let url = `https://backendapi.trakky.in/salons/mastercategory/`;
      if (inputValue) {
        url += `?name=${encodeURIComponent(inputValue)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      setNextPage(data.next);

      const options = data.map((category) => ({
        value: category.id,
        label: `${category.name} - ${category.gender}`,
        ...category,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      callback([]);
    }
  };

  const loadServices = async (inputValue, callback) => {
    if (!selectedCategory || !selectedCategory.id) {
      callback([]);
      return;
    }

    try {
      let url = `https://backendapi.trakky.in/salons/masterservice/`;

      if (inputValue) {
        url += `?service_name=${encodeURIComponent(inputValue)}&categories=${
          selectedCategory?.id
        }`;
      } else {
        url += `?categories=${selectedCategory?.id}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      const options = data.results.map((service) => ({
        value: service.id,
        label: `${service.service_name} (${service.gender})`,
        ...service,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      callback([]);
    }
  };

  const loadCampaigns = async (inputValue, callback) => {
    try {
      let url = CAMPAIGN_API;
      if (inputValue) {
        url += `?campaign_name=${encodeURIComponent(inputValue)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);

      const data = await response.json();
      //   const campaigns = Array.isArray(data) ? data : data.results || [];

      const options = data.results.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_name,
        ...campaign,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
      callback([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If gender changes, we need to reload services to filter by new gender
    if (name === "gender" && formData.salon) {
      setSelectedServices([]);
      setFormData((prev) => ({
        ...prev,
        masterservice: [],
      }));
    }
  };

  const handleSalonChange = (selectedOption) => {
    setSelectedSalon(selectedOption);
    const salonId = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({
      ...prev,
      salon: salonId,
      masterservice: [], // Reset services when salon changes
    }));
    setSelectedServices([]);
  };

  const handleServiceChange = (selectedOptions) => {
    setSelectedServices(selectedOptions || []);
    setFormData((prev) => ({
      ...prev,
      masterservice: (selectedOptions || []).map((option) => option.value),
    }));
  };

  const handleCampaignChange = (selectedOption) => {
    setSelectedCampaign(selectedOption);
    setFormData((prev) => ({
      ...prev,
      ad_spend: selectedOption ? selectedOption.value : null,
      campaign_name: selectedOption ? selectedOption.label : null,
    }));
  };

  const handleCustomerVisitedChange = (visited) => {
    setFormData((prev) => ({
      ...prev,
      does_customer_visited_the_salon: visited,
      reason_for_not_visited_the_salon: visited
        ? ""
        : prev.reason_for_not_visited_the_salon,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsLoading(true);
      const url = leadData ? `${API_URL}${leadData.id}/` : API_URL;
      const method = leadData ? "PATCH" : "POST";

      let formattedPrice = "";
      if (isPriceRange) {
        if (priceRange.min && priceRange.max) {
          formattedPrice = `${priceRange.min} - ${priceRange.max}`;
        } else if (priceRange.min) {
          formattedPrice = priceRange.min;
        } else if (priceRange.max) {
          formattedPrice = priceRange.max;
        }
      } else {
        formattedPrice = formData.price;
      }

      const payload = {
        ...formData,
        price: formattedPrice,
        // Only include reason_for_not_visited_the_salon if customer didn't visit
        reason_for_not_visited_the_salon:
          formData.does_customer_visited_the_salon
            ? null
            : formData.reason_for_not_visited_the_salon,
        // Only include campaign details if source is ads
        ad_spend: formData.source_of_lead === "ads" ? formData.ad_spend : null,
        campaign_name:
          formData.source_of_lead === "ads" ? formData.campaign_name : null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${leadData ? "update" : "create"} lead`);
      }

      toast.success(`Lead ${leadData ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      toast.error(error.message);
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const currentTime = today.toTimeString().slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      converted_date: prev.converted_date || today.toISOString().split("T")[0],
      appointment_date:
        prev.appointment_date || today.toISOString().split("T")[0],
      booking_time: prev.booking_time || currentTime,
    }));
  }, []);

  const [errors, setErrors] = useState({});

  const validateCustomerName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const validateMobileNumber = (number) => {
    const regex = /^\d{10}$/;
    return regex.test(number);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_mobile_number) {
      newErrors.customer_mobile_number = "Mobile number is required";
    } else if (!validateMobileNumber(formData.customer_mobile_number)) {
      newErrors.customer_mobile_number =
        "Please enter a valid 10-digit mobile number";
    }

    if (!formData.converted_date)
      newErrors.converted_date = "Converted date is required";
    if (!formData.appointment_date)
      newErrors.appointment_date = "Appointment date is required";
    if (!formData.booking_time)
      newErrors.booking_time = "Booking time is required";
    if (!formData.choice) newErrors.choice = "Status is required";
    if (!formData.salon) newErrors.salon = "Salon is required";
    if (!formData.masterservice.length)
      newErrors.masterservice = "At least one service is required";
    if (
      formData.customer_name &&
      !validateCustomerName(formData.customer_name)
    ) {
      newErrors.customer_name = "Customer name should not contain numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div className="px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">
            {leadData ? "Edit Converted Lead" : "Add Converted Lead"}
          </h3>
          <button
            type="button"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
            onClick={handleBackToList}
          >
            Show List
          </button>
        </div>

        {/* Row 1: City, Salon, Category, Service, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
            <select
              id="city"
              name="city"
              value={selectedCity?.value || ""}
              onChange={(e) => {
                const city = cities.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setSelectedCity(
                  city ? { value: city.id, label: city.name } : null
                );
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Salon */}
          <div>
            <label htmlFor="salon" className="block text-sm font-medium text-gray-700 mb-2">Select Salon</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadSalons}
              onChange={handleSalonChange}
              value={selectedSalon}
              placeholder="Search salons"
              noOptionsMessage={() => "Type to search salons"}
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
                  padding: '4px',
                  borderRadius: '8px',
                  minHeight: '50px',
                }),
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadCategories}
              onChange={(selected) => setSelectedCategory(selected)}
              value={selectedCategory}
              placeholder="Search categories"
              noOptionsMessage={() => "Type to search categories"}
              isLoading={isCategoryLoading}
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
                  padding: '4px',
                  borderRadius: '8px',
                  minHeight: '50px',
                }),
              }}
            />
          </div>

          {/* Service */}
          <div>
            <label htmlFor="masterservice" className="block text-sm font-medium text-gray-700 mb-2">Select Services</label>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              loadOptions={loadServices}
              onChange={handleServiceChange}
              value={selectedServices}
              placeholder={formData.salon ? "Search services" : "Select salon first"}
              noOptionsMessage={() => "Type to search services"}
              isDisabled={!formData.salon}
              isLoading={isServiceLoading}
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
                  padding: '4px',
                  borderRadius: '8px',
                  minHeight: '50px',
                }),
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex items-center gap-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  className="form-radio h-5 w-5 text-[#502DA6] transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                  className="form-radio h-5 w-5 text-[#502DA6] transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Row 2: Dates, Time, Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Converted Date */}
          <div>
            <label htmlFor="converted_date" className="block text-sm font-medium text-gray-700 mb-2">Converted Date</label>
            <input
              type="date"
              id="converted_date"
              name="converted_date"
              value={formData.converted_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              required
            />
          </div>

          {/* Appointment Date */}
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
            <input
              type="date"
              id="appointment_date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              required
            />
          </div>

          {/* Booking Time */}
          <div>
            <label htmlFor="booking_time" className="block text-sm font-medium text-gray-700 mb-2">Booking Time</label>
            <input
              type="time"
              id="booking_time"
              name="booking_time"
              value={formData.booking_time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              required
            />
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              placeholder="Enter customer name"
            />
            {errors.customer_name && (
              <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
            )}
          </div>

          {/* Customer Mobile */}
          <div>
            <label htmlFor="customer_mobile_number" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input
              type="tel"
              id="customer_mobile_number"
              name="customer_mobile_number"
              value={formData.customer_mobile_number}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              pattern="[0-9]{10}"
              required
              placeholder="10-digit number"
            />
            {errors.customer_mobile_number && (
              <p className="text-red-500 text-xs mt-1">{errors.customer_mobile_number}</p>
            )}
          </div>
        </div>

        {/* Row 3: Price, Source, Number of Customers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Price Section */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <div className="space-y-3">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                disabled={isPriceRange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50 ${isPriceRange ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="Enter price"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPriceRange}
                  onChange={handlePriceRangeChange}
                  className="form-checkbox h-5 w-5 text-[#502DA6] rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Use Price Range</span>
              </label>
              {isPriceRange && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priceMin" className="block text-xs font-medium text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      id="priceMin"
                      name="min"
                      value={priceRange.min}
                      onChange={handlePriceRangeInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label htmlFor="priceMax" className="block text-xs font-medium text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      id="priceMax"
                      name="max"
                      value={priceRange.max}
                      onChange={handlePriceRangeInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                      placeholder="Max"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Source of Lead & Campaign */}
          <div>
            <label htmlFor="source_of_lead" className="block text-sm font-medium text-gray-700 mb-2">Source of Lead</label>
            <select
              id="source_of_lead"
              name="source_of_lead"
              value={formData.source_of_lead}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
            >
              <option value="">Select Source</option>
              {SOURCE_CHOICES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formData.source_of_lead === "ads" && (
              <div className="mt-4">
                <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-2">Select Campaign</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCampaigns}
                  value={selectedCampaign}
                  onChange={handleCampaignChange}
                  placeholder="Search campaigns..."
                  noOptionsMessage={() => "Type to search campaigns"}
                  isLoading={isCampaignLoading}
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
                      padding: '4px',
                      borderRadius: '8px',
                    }),
                  }}
                />
              </div>
            )}
          </div>

          {/* Number of Customers & Visit Status */}
          <div>
            <label htmlFor="number_of_customers" className="block text-sm font-medium text-gray-700 mb-2">Number of Customers</label>
            <input
              type="number"
              id="number_of_customers"
              name="number_of_customers"
              value={formData.number_of_customers}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              min="1"
              required
            />
            {leadData && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Did Customer Visit the Salon?</p>
                <div className="flex items-center gap-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.does_customer_visited_the_salon === true}
                      onChange={() => handleCustomerVisitedChange(true)}
                      className="form-radio h-5 w-5 text-[#502DA6]"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.does_customer_visited_the_salon === false}
                      onChange={() => handleCustomerVisitedChange(false)}
                      className="form-radio h-5 w-5 text-[#502DA6]"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">No</span>
                  </label>
                </div>
                {formData.does_customer_visited_the_salon === false && (
                  <div className="mt-4">
                    <label htmlFor="reason_for_not_visited_the_salon" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Not Visiting
                    </label>
                    <input
                      type="text"
                      id="reason_for_not_visited_the_salon"
                      name="reason_for_not_visited_the_salon"
                      value={formData.reason_for_not_visited_the_salon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                      placeholder="Enter reason"
                      required
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Status, Cancel Reason, Remarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status */}
          <div>
            <label htmlFor="choice" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="choice"
              name="choice"
              value={formData.choice}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
            >
              <option value="converted">Converted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Cancel Reason (conditionally shown) */}
          {formData.choice === "cancelled" && (
            <div>
              <label htmlFor="cancel_reason" className="block text-sm font-medium text-gray-700 mb-2">Cancel Reason</label>
              <input
                type="text"
                id="cancel_reason"
                name="cancel_reason"
                value={formData.cancel_reason}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
                placeholder="Enter cancel reason"
              />
            </div>
          )}

          {/* Remarks */}
          <div className={`${formData.choice === "cancelled" ? 'md:col-span-1' : 'md:col-span-2'}`}>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 bg-gray-50 resize-none"
              placeholder="Enter remarks"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="relative px-6 py-3 bg-[#502DA6] text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </div>
            ) : (
              leadData ? "Update Lead" : "Add Lead"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConvertedLeadForm;