import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddSalonProfileOffer = (profileOffers) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState(
    profileOffers?.profileOffers?.salon_city || ""
  );
  const [offerTime, setOfferTime] = useState(
    profileOffers?.profileOffers?.offer_time || {
      days: null,
      hours: null,
      minutes: null,
      seating: null,
    }
  );
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (profileOffers?.profileOffers) {
      const salon = profileOffers.profileOffers;
      return [
        {
          value: salon.salon,
          label: salon.salon_name,
        },
      ];
    } else {
      return [];
    }
  });

  const [offerName, setOfferName] = useState(
    profileOffers?.profileOffers?.name || ""
  );
  const [actualPrice, setActualPrice] = useState(
    profileOffers?.profileOffers?.actual_price || ""
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    profileOffers?.profileOffers?.discount_price || ""
  );
  const [gender, setGender] = useState(
    profileOffers?.profileOffers?.gender || ""
  );
  const [img, setImg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix: Properly format date values for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    // If already in YYYY-MM-DD format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Try to parse the date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return "";
  };

  const [startDate, setStartDate] = useState(() => {
    if (profileOffers?.profileOffers?.starting_date) {
      return formatDateForInput(profileOffers.profileOffers.starting_date);
    }
    return "";
  });
  
  const [endDate, setEndDate] = useState(() => {
    if (profileOffers?.profileOffers?.expire_date) {
      return formatDateForInput(profileOffers.profileOffers.expire_date);
    }
    return "";
  });
  
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }],
        ],
      },
    });
  }, []);
  
  useEffect(() => {
    if (
      editorRef.current &&
      profileOffers?.profileOffers?.terms_and_conditions
    ) {
      editorRef.current.root.innerHTML =
        profileOffers.profileOffers.terms_and_conditions;
    }
  }, [profileOffers]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !offerTime?.days &&
      !offerTime?.hours &&
      !offerTime?.minutes &&
      !offerTime?.seating
    ) {
      toast.error("At least one option in offer time is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#FFFFFF",
        },
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    selectedSalons.forEach((salon) =>
      formData.append("salon_ids", salon.value)
    );
    formData.append("name", offerName);
    formData.append("city", selectedCity);
    formData.append("actual_price", actualPrice);
    formData.append("discount_price", discountedPrice);
    formData.append("terms_and_conditions", editorRef.current.root.innerHTML);
    formData.append("gender", gender);
    formData.append("starting_date", startDate);
    formData.append("expire_date", endDate);
    formData.append(
      "offer_time",
      JSON.stringify({
        days: offerTime?.days || 0,
        hours: offerTime?.hours || 0,
        minutes: offerTime?.minutes || 0,
        seating: offerTime?.seating || 0,
      })
    );
    if (img !== null) {
      formData.append("image", img);
    }

    let method, url;
    if (profileOffers?.profileOffers) {
      method = "PATCH";
      url = `https://backendapi.trakky.in/salons/salon-profile-offer/${profileOffers?.profileOffers?.id}/`;
    } else {
      method = "POST";
      url = `https://backendapi.trakky.in/salons/salon-profile-offer/`;
    }
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      if (profileOffers?.profileOffers) {
        if (response.status === 200) {
          toast.success("Updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          profileOffers.setProfileOffers(responseData);
        } else if (
          response.status === 400 &&
          responseData.salons &&
          responseData.salons.length > 0
        ) {
          toast.error(responseData.salons[0], {
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
      } else {
        if (response.status === 201) {
          toast.success("Added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          setActualPrice("");
          setDiscountedPrice("");
          setOfferName("");
          setImg(null);
          setStartDate("");
          setEndDate("");
          setSelectedCity("");
          setSelectedSalons([]);
          setOfferTime({
            days: null,
            hours: null,
            minutes: null,
            seating: null,
          });
          setGender("");
          if (editorRef.current) {
            editorRef.current.root.innerHTML = "";
          }
          document.getElementById("img").value = "";
        } else if (
          response.status === 400 &&
          responseData.salons &&
          responseData.salons.length > 0
        ) {
          toast.error(responseData.salons[0], {
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
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {profileOffers.profileOffers ? "Update" : "Add"} Salon Profile
              Offer
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={profileOffers?.profileOffers}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSalons([]);
                  setSelectedCity(e.target.value);
                }}
              >
                <option value="">Select City</option>
                {city.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">
                Select Salon
                <span className="Note_Inp_Classs">
                  Salon Must belong to Selected city
                </span>
              </label>
              <AsyncSelect
                isMulti
                required
                isDisabled={!selectedCity || profileOffers?.profileOffers}
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalons) => {
                  setSelectedSalons(selectedSalons);
                }}
                noOptionsMessage={() => "No salons found"}
                placeholder="Search Salon..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ccc",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#ccc",
                    },
                  }),
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Enter Offer Name</label>
              <input
                required
                type="text"
                name="offername"
                id="offername"
                value={offerName}
                placeholder="Enter name here.."
                onChange={(e) => setOfferName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="gender">Select Gender</label>
              <select
                name="gender"
                id="gender"
                required
                value={gender || ""}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              >
                <option value="">
                  ---Select---
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Enter Actual Price</label>
              <input
                required
                type="number"
                name="actualPrice"
                id="actualPrice"
                value={actualPrice}
                placeholder="Enter actual price here.."
                onChange={(e) => setActualPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Enter Discounted Price</label>
              <input
                required
                type="number"
                name="discountedPrice"
                id="discountedPrice"
                value={discountedPrice}
                placeholder="Enter discounted price here.."
                onChange={(e) => setDiscountedPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Terms & Conditions</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>

          <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
            <div className="input-box inp-time col-1">
              <label htmlFor="service-time">Total hours</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={offerTime?.hours || ""}
                placeholder="Hours : E.g. 0 , 1 , 2 ... "
                onChange={(e) => {
                  setOfferTime({ ...offerTime, hours: e.target.value });
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Minutes</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={offerTime?.minutes || ""}
                onChange={(e) => {
                  setOfferTime({ ...offerTime, minutes: e.target.value });
                }}
                placeholder="Minutes : E.g. 0 , 15 , 30 , 45 , 60 ..."
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Seating</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={offerTime?.seating || ""}
                onChange={(e) => {
                  setOfferTime({ ...offerTime, seating: e.target.value });
                }}
                placeholder="Seating : E.g. 0 , 1 , 2 .."
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Days</label>
              <input
                disabled
                type="number"
                name="service-time"
                id="service-time"
                value={offerTime?.days || ""}
                onChange={(e) => {
                  setOfferTime({ ...offerTime, days: e.target.value });
                }}
                placeholder="Days : E.g. 0 , 1 , 2 ..."
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          
          {/* Date Fields - Fixed to properly display during edit */}
          <div className="row" style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div className="input-box" style={{ flex: 1, minWidth: "200px" }}>
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                style={{ 
                  width: "100%", 
                  padding: "8px 12px", 
                  borderRadius: "6px", 
                  border: "1px solid #d1d5db",
                  fontSize: "14px"
                }}
                required
              />
            </div>
            <div className="input-box" style={{ flex: 1, minWidth: "200px" }}>
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                style={{ 
                  width: "100%", 
                  padding: "8px 12px", 
                  borderRadius: "6px", 
                  border: "1px solid #d1d5db",
                  fontSize: "14px"
                }}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 16:9
                </span>
              </label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
              {profileOffers?.profileOffers?.image && (
                <div style={{ marginTop: "10px" }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "5px" }}>Current Image:</p>
                  <img 
                    src={profileOffers.profileOffers.image} 
                    alt="Current offer" 
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="submit-btn row">
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSalonProfileOffer;