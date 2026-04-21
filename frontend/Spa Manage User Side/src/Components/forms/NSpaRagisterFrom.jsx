import React from "react";
import "./NSalonRegister.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import Ragister_logo from "../../Assets/images/logos/Trakky logo purple.png";

const NSpaRagisterFrom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  document.title = "Spa Registration | Trakky";
  const [formData, setFormData] = useState({
    businessName: "",
    contactDetails: "",
    ownerName: "",
    ownerContact: "",
    whatsappNumber: "",
    city: "",
    address: "",
    otherCity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("spa_name", formData.businessName);
    form.append("spa_contact_number", formData.contactDetails);
    form.append("owner_name", formData.ownerName);
    form.append("owner_contact_number", formData.ownerContact);
    form.append("whatsapp_number", formData.whatsappNumber);
    form.append("address", formData.address);
    form.append(
      "city",
      formData.city === "other" ? formData.otherCity : formData.city
    );

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/register-spa/",
        {
          method: "POST",
          body: form,
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          toast.success(
            "Spa registered successfully. Our team will contact you soon"
          );
          setFormData({
            businessName: "",
            contactDetails: "",
            ownerName: "",
            ownerContact: "",
            whatsappNumber: "",
            city: "",
            address: "",
            otherCity: "",
          });

          navigate("/");
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          toast.error("An error occurred while registering the spa");
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="n-salon-register-main-container">
        <div className="n-salon-register-left-side-card">
          {/* Left side content like images, theme design, etc. */}
          <img src={Ragister_logo} alt="" className="n-salon-register-logo" />
          <h2>Register Your Spa with Trakky</h2>
          <p>Be Part of a Thriving Community of Spa.</p>
        </div>
        <div className="n-salon-register-right-side-card">
          <form
            className="n-salon-register-form"
            method="post"
            onSubmit={handleSubmit}
          >
            <div className="n-salon-register-row n-salon-register-title-row">
              <h3 className="n-salon-register-form-title">Spa Registration</h3>
              <Link to="/" className="n-salon-register-close-btn">
                {" "}
                <FaXmark />
              </Link>
            </div>
            <div className="n-salon-register-row">
              <div className="n-salon-register-input-box n-salon-register-col-1">
                <label htmlFor="business-name">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  id="business-name"
                  placeholder="Enter Business Name"
                  required
                />
              </div>
              <div className="n-salon-register-input-box n-salon-register-col-2">
                <label htmlFor="contact-details">Contact Details</label>
                <input
                  type="number"
                  name="contactDetails"
                  value={formData.contactDetails}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setFormData({
                        ...formData,
                        contactDetails: e.target.value,
                      });
                    }
                  }
                  }
                  id="contact-details"

                  placeholder="Enter Contact Details"
                  required
                />
              </div>
            </div>
            <div className="n-salon-register-row">
              <div className="n-salon-register-input-box n-salon-register-col-1">
                <label htmlFor="whatsapp-number">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setFormData({
                        ...formData,
                        whatsappNumber: e.target.value,
                      });
                    }
                  }}
                  id="whatsapp-number"
                  placeholder="Enter WhatsApp Number"
                  required
                />
              </div>
              <div className="n-salon-register-input-box n-salon-register-col-2">
                <label htmlFor="salon-address">Salon Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  id="salon-address"
                  placeholder="Enter Salon Address"
                  required
                />
              </div>
            </div>
            <div className="n-salon-register-row">
              <div className="n-salon-register-input-box n-salon-register-col-1">
                <label htmlFor="owner-name">Owner's Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  id="owner-name"
                  placeholder="Enter Owner's Name"
                  required
                />
              </div>
              <div className="n-salon-register-input-box n-salon-register-col-2">
                <label htmlFor="owner-contact">Owner's Contact Number</label>
                <input
                  type="tel"
                  name="ownerContact"
                  value={formData.ownerContact}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setFormData({
                        ...formData,
                        ownerContact: e.target.value,
                      });
                    }
                  }}
                  id="owner-contact"
                  placeholder="Enter Owner's Contact Number"
                  required
                />
              </div>
            </div>
            <div className="n-salon-register-row">
              <div className="n-salon-register-input-box n-salon-register-col-1">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select City</option>
                  {/* <option value="">Select City</option> */}
                  <option value="ahmedabad">Ahmedabad</option>
                  <option value="surat">Surat</option>
                  <option value="gandhinagar">Gandhinagar</option>
                  <option value="vadodara">Vadodara</option>
                  <option value="rajkot">Rajkot</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="hydrabad">Hydrabad</option>
                  <option value="chennai">Chennai</option>
                  <option value="delhi">Delhi</option>
                  <option value="gurugram">Gurugram</option>
                  <option value="noida">Noida</option>
                  <option value="grater Noida">Grater Noida</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="jaipur">Jaipur</option>
                  <option value="udaipur">Udaipur</option>
                  <option value="jodhpur">Jodhpur</option>
                  <option value="indore">Indore</option>
                  <option value="bhopal">Bhopal</option>
                  <option value="raipur">Raipur</option>
                  <option value="amritsar">Amritsar</option>
                  <option value="ludhiana">Ludhiana</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formData.city === "other" && (
                <div className="n-salon-register-input-box n-salon-register-col-2">
                  <label htmlFor="other-city">Other City</label>
                  <input
                    type="text"
                    name="otherCity"
                    id="other-city"
                    value={formData.otherCity}
                    onChange={handleChange}
                    placeholder="Enter City"
                    required
                  />
                </div>
              )}
            </div>
            <div className="n-salon-register-submit-btn">
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default NSpaRagisterFrom;
