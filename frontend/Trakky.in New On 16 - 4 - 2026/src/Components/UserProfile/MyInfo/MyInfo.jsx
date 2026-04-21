import React, { useState, useEffect, useContext } from "react";
import IndiaIcon from "../india.png";
import AuthContext from "../../../context/Auth";
import toast from "react-hot-toast";
import validator from "validator";

const MyInfo = () => {
  const { user, authTokens, userData, fetchUserData } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    preferredPronouns: "",
    email: "",
    dateOfBirth: "",
    country: "",
    state: "",
    city: "",
    area: "",
    streetAddress: "",
    aptNumber: "",
    phone_number: "",
    communicationLanguage: "",
    marketingSms: false,
    marketingEmail: false,
    transactionSms: false,
    transactionEmail: false,
  });

  const [cityList, setCityList] = useState([]);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  useEffect(() => {
    fetch("https://backendapi.trakky.in/salons/city/")
      .then((response) => response.json())
      .then((data) => setCityList(data.payloadForAPI))
      .catch((error) => console.error("Error fetching city list:", error));
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || "",
        phone_number: userData.phone_number || "",
        email: userData.email || "",
        dateOfBirth: userData.dob || "",
        city: userData.city || "",
        area: userData.area || "",
        country: userData.country || "",
        gender: userData.gender || "",
        preferredPronouns: userData.preferred_pronouns || "",
        state: userData.state || "",
        streetAddress: userData.street_address || "",
        aptNumber: userData.apt_number || "",
        communicationLanguage: userData.communication_language || "",
        marketingSms: userData.marketing_sms || false,
        marketingEmail: userData.marketing_email || false,
        transactionSms: userData.transaction_sms || false,
        transactionEmail: userData.transaction_email || false,
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!validator.isMobilePhone(formData.phone_number, "en-IN")) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const payloadForAPI = {
      name: formData.fullName,
      phone_number: formData.phone_number,
      email: formData.email,
      dob: formData.dateOfBirth,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      area: formData.area,
      street_address: formData.streetAddress,
      apt_number: formData.aptNumber,
      gender: formData.gender,
      preferred_pronouns: formData.preferredPronouns,
      communication_language: formData.communicationLanguage,
      marketing_sms: formData.marketingSms,
      marketing_email: formData.marketingEmail,
      transaction_sms: formData.transactionSms,
      transaction_email: formData.transactionEmail,
    };

    fetch(`https://backendapi.trakky.in/salons/salonuser/${user?.user_id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access_token}`,
      },
      body: JSON.stringify(payloadForAPI),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Profile updated successfully!");
        fetchUserData();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile");
      });
  };

  return (
    <div className="m-5 bg-white rounded-xl ">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 ">
        Personal Information
      </h1>

      <form className="space-y-8">
        {/* Grid for form fields - 1 column on mobile, 2 on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="fullName"
              className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
            >
              Full Name
            </label>
          </div>

          {/* Gender */}
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="NA">Prefer not to say</option>
            </select>
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Gender
            </label>
          </div>

          {/* Preferred Pronouns */}
          <div className="relative">
            <select
              name="preferredPronouns"
              value={formData.preferredPronouns}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Preferred Pronouns</option>
              <option value="he/him">He/Him</option>
              <option value="she/her">She/Her</option>
              <option value="they/them">They/Them</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Preferred Pronouns
            </label>
          </div>

          {/* Phone with India Icon */}
          <div className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
            <img src={IndiaIcon} alt="India" className="w-6 h-6 ml-3" />
            <div className="flex-1 relative">
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="peer w-full px-4 pt-6 pb-2 outline-none bg-transparent"
                placeholder=" "
                required
              />
              <label
                className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Phone Number
              </label>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
              required
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Email
            </label>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Date of Birth
            </label>
          </div>

          {/* Street Address */}
          <div className="relative md:col-span-2">
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Street Address
            </label>
          </div>

          {/* Apt Number */}
          <div className="relative">
            <input
              type="text"
              name="aptNumber"
              value={formData.aptNumber}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Apt / Suite / Flat #
            </label>
          </div>

          {/* Country */}
          <div className="relative">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Country
            </label>
          </div>

          {/* State */}
          <div className="relative">
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              State
            </label>
          </div>

          {/* City */}
          <div className="relative">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Select City</option>
              {cityList.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              City
            </label>
          </div>

          {/* Area */}
          <div className="relative">
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Area / Locality
            </label>
          </div>

          {/* Communication Language */}
          <div className="relative md:col-span-2">
            <select
              name="communicationLanguage"
              value={formData.communicationLanguage}
              onChange={handleInputChange}
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="">Preferred Language</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="gujarati">Gujarati</option>
              <option value="other">Other</option>
            </select>
            <label className="absolute left-4 top-2 text-sm text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600">
              Communication Language
            </label>
          </div>
        </div>

        {/* Communication Preferences Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Communication Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Marketing Communication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marketing Communication
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingSms"
                    checked={formData.marketingSms}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">SMS</span>
                </label>

                 <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingSms"
                    checked={formData.marketingSms}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">WhatsApp</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingEmail"
                    checked={formData.marketingEmail}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Email</span>
                </label>
              </div>
            </div>

            {/* Transaction Communication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Communication
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transactionSms"
                    checked={formData.transactionSms}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">SMS</span>
                </label>

                 <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingSms"
                    checked={formData.marketingSms}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">WhatsApp</span>
                </label>


                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="transactionEmail"
                    checked={formData.transactionEmail}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Email</span>
                </label>
              </div>
            </div>
          </div>
        </div>

     
        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyInfo;