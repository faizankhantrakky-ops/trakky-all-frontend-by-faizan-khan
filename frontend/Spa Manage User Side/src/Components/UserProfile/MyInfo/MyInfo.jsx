import React, { useState, useEffect, useContext } from "react";
import IndiaIcon from "../india.png";
import "../UserProfile.css";

import AuthContext from "../../../context/Auth";
import toast from "react-hot-toast";
import validator from "validator";


const MyInfo = () => {
  const [phoneno, setPhoneno] = useState("");
  const { user, authTokens, userData , fetchUserData} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    dateOfBirth: "",
    country: "",
    city: "",
    area: "",
    phone_number: "",
  });
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    fetch("https://backendapi.trakky.in/spas/city/")
      .then((response) => response.json())
      .then((data) => setCityList(data.payload))
      .catch((error) => console.error("Error fetching city list:", error));
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error("User not found. Please login.");
      return;
    }

    console.log("userData", userData);
    console.log("user", user);

    if (userData && user) {
      setFormData({
        fullName: userData.name,
        phone_number: userData.phone_number,
        email: userData.email,
        dateOfBirth: userData.dob,
        city: userData.city,
        area: userData.area,
        country: userData.country,
        gender: userData.gender,
      });
    }
  }, [user , userData]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validator.isMobilePhone(formData?.phone_number, "en-IN")) {
      toast.error("Please enter a valid mobile number");
    } else {
      let url = `https://backendapi.trakky.in/spas/spauser/${user?.user_id}/`;

      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify({
          name: formData.fullName,
          phone_number: formData.phone,
          email: formData.email,
          dob: formData.dateOfBirth,
          city: formData.city,
          area: formData.area,
          country: formData.country,
          gender: formData.gender,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            toast.success("Profile updated successfully!");
            if (user?.user_id) {
              fetchUserData();
            }
          } else {
            toast.error("Failed to update profile. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile. Please try again.");
        });
    }
  };

  return (
    <div className="edit-Profile-container">
      <h1 className="edit-P-C-heading">Edit Profile</h1>

      <div className="PP-form-container">
        <div className="PP-form-item">
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <label htmlFor="fullName">Full name</label>
        </div>
        <div className="PP-form-item">
          <select
            name="gender"
            id="gender"
            required
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="NA">Prefer not to answer</option>
          </select>
          <label htmlFor="gender">Gender</label>
        </div>
        <div className="PP-form-item PP-item-phone">
          <input
            type="text"
            name="phone_number"
            id="phone"
            required
            value={formData.phone_number}
            onChange={handleInputChange}
          />
          <label htmlFor="phone">Phone</label>
          <div className="img-div">
            <img src={IndiaIcon} alt="India" />
          </div>
        </div>
        <div className="PP-form-item">
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email">Email id</label>
        </div>
        <div className="PP-form-item">
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            // defaultValue={formData.dateOfBirth}
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
          <label htmlFor="dateOfBirth">Date of Birth</label>
        </div>
        <div className="PP-form-item">
          <input
            type="text"
            name="country"
            id="country"
            required
            value={formData.country}
            onChange={handleInputChange}
          />
          <label htmlFor="country">Country</label>
        </div>
        <div className="PP-form-item">
          <select
            name="city"
            id="city"
            required
            value={formData.city}
            onChange={handleInputChange}
          >
            <option value="">Select City</option>
            {cityList.map((cityItem) => (
              <option key={cityItem.id} value={cityItem.name}>
                {cityItem.name}
              </option>
            ))}
          </select>
          <label htmlFor="city">City</label>
        </div>
        <div className="PP-form-item">
          <input
            type="text"
            name="area"
            id="area"
            required
            value={formData.area}
            onChange={handleInputChange}
          />
          <label htmlFor="area">Area</label>
        </div>
      </div>

      <button className="PP-edit-submit-btn" onClick={handleSave}>
        SAVE
      </button>
    </div>
  );
};

export default MyInfo;
