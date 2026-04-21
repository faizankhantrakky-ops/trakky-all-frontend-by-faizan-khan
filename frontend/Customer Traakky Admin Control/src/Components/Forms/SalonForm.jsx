import React, { useRef } from "react";
import "../css/form.css";
import "../css/timings.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import CheckBox from "./CheckBox";
import FacilityContext from "./contexts/FacilityContext";
import { useNavigate } from "react-router-dom";
import RestoreIcon from "@mui/icons-material/Restore";
import ErrorIcon from "@mui/icons-material/Error";

import toast, { Toaster } from "react-hot-toast";

import TimeInput from "./TimeInput";

const AddSalon = ({ salonData, setsalonData, closeModal }) => {
  console.log("salon data : ", salonData);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(salonData?.name || "");
  const [phone, setPhone] = useState(salonData?.mobile_number || "");
  const [whatsapp, setWhatsapp] = useState(salonData?.booking_number || "");
  const [address, setAddress] = useState(salonData?.address || "");
  const [landmark, setLandmark] = useState(salonData?.landmark || "");
  const [city, setCity] = useState(salonData?.city || "");
  const [promises, setPromises] = useState(salonData?.promises || []);

  const [area, setArea] = useState(salonData?.area || "");
  const [googleMapsLink, setGoogleMapsLink] = useState(
    salonData?.gmap_link || ""
  );
  const [latitude, setLatitude] = useState(salonData?.salon_latitude || "");
  const [longitude, setLongitude] = useState(salonData?.salon_longitude || "");
  const [open, setOpen] = useState({
    Monday: salonData?.salon_timings?.monday?.open_time || "",
    Tuesday: salonData?.salon_timings?.tuesday?.open_time || "",
    Wednesday: salonData?.salon_timings?.wednesday?.open_time || "",
    Thursday: salonData?.salon_timings?.thursday?.open_time || "",
    Friday: salonData?.salon_timings?.friday?.open_time || "",
    Saturday: salonData?.salon_timings?.saturday?.open_time || "",
    Sunday: salonData?.salon_timings?.sunday?.open_time || "",
  });
  const [isClosed, setIsClosed] = useState({
    Monday: salonData?.salon_timings?.monday === "closed" || false,
    Tuesday: salonData?.salon_timings?.tuesday === "closed" || false,
    Wednesday: salonData?.salon_timings?.wednesday === "closed" || false,
    Thursday: salonData?.salon_timings?.thursday === "closed" || false,
    Friday: salonData?.salon_timings?.friday === "closed" || false,
    Saturday: salonData?.salon_timings?.saturday === "closed" || false,
    Sunday: salonData?.salon_timings?.sunday === "closed" || false,
  });
  const [close, setClose] = useState({
    Monday: salonData?.salon_timings?.monday?.close_time || "",
    Tuesday: salonData?.salon_timings?.tuesday?.close_time || "",
    Wednesday: salonData?.salon_timings?.wednesday?.close_time || "",
    Thursday: salonData?.salon_timings?.thursday?.close_time || "",
    Friday: salonData?.salon_timings?.friday?.close_time || "",
    Saturday: salonData?.salon_timings?.saturday?.close_time || "",
    Sunday: salonData?.salon_timings?.sunday?.close_time || "",
  });

  const [facilities, setFacilities] = useState(salonData?.facilities || []);
  const [slug, setSlug] = useState(salonData?.slug || "");
  const [aboutUs, setAboutUs] = useState(salonData?.about_us || "");
  const [offerTag, setOfferTag] = useState(salonData?.offer_tag || "");
  const [price, setPrice] = useState(salonData?.price || "");
  const [mainImg, setMainImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  // const citiesData = useRef([]);
  const [areasData, setAreasData] = useState([]);

  const [salon_type, setSalonType] = useState(salonData?.salon_type || "");

  const [addSalonLoading, setAddSalonLoading] = useState(false);
  const [timings, setTimings] = useState([]);
  const [secondaryAreas, setSecondaryAreas] = useState(salonData?.secondary_areas_display || []);
  const [newSecondaryArea, setNewSecondaryArea] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [availableSecondaryAreas, setAvailableSecondaryAreas] = useState([]);

  // Add these functions near your other handler functions
  const handleAddSecondaryArea = () => {
    if (!newSecondaryArea || !newPriority) {
      toast.error("Please select an area and enter priority");
      return;
    }

    // Check if this area is already added
    if (secondaryAreas.some(area => area.name === newSecondaryArea)) {
      toast.error("This area is already added");
      return;
    }

    // Find the selected area from available areas to get its ID
    const selectedArea = availableSecondaryAreas.find(area => area.name === newSecondaryArea);

    const newArea = {
      id: selectedArea.id,
      name: newSecondaryArea,
      priority: parseInt(newPriority)
    };

    setSecondaryAreas([...secondaryAreas, newArea]);
    setNewSecondaryArea("");
    setNewPriority("");
  };

  const handleRemoveSecondaryArea = (id) => {
    setSecondaryAreas(secondaryAreas.filter(area => area.id !== id));
  };

  useEffect(() => {
    const fetchSecondaryAreas = async () => {
      try {
        const response = await fetch("https://backendapi.trakky.in/salons/area/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setAvailableSecondaryAreas(data.payload);
        }
      } catch (error) {
        console.error("Error fetching secondary areas:", error);
      }
    };

    fetchSecondaryAreas();
  }, []);

  const handleSubmit = async (event) => {
    setAddSalonLoading(true);

    event.preventDefault();
    const timings = {
      monday: isClosed.Monday
        ? "closed"
        : { open_time: open.Monday, close_time: close.Monday },
      tuesday: isClosed.Tuesday
        ? "closed"
        : { open_time: open.Tuesday, close_time: close.Tuesday },
      wednesday: isClosed.Wednesday
        ? "closed"
        : { open_time: open.Wednesday, close_time: close.Wednesday },
      thursday: isClosed.Thursday
        ? "closed"
        : { open_time: open.Thursday, close_time: close.Thursday },
      friday: isClosed.Friday
        ? "closed"
        : { open_time: open.Friday, close_time: close.Friday },
      saturday: isClosed.Saturday
        ? "closed"
        : { open_time: open.Saturday, close_time: close.Saturday },
      sunday: isClosed.Sunday
        ? "closed"
        : { open_time: open.Sunday, close_time: close.Sunday },
    };
    setTimings(timings);
    const salonTimingsJSON = JSON.stringify(timings);

    if (phone.length !== 10) {
      toast.error("Phone number should be of 10 digits.");
      setAddSalonLoading(false);
      return;
    }

    if (whatsapp.length !== 10) {
      toast.error("Whatsapp number should be of 10 digits.");
      setAddSalonLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("mobile_number", phone);
    formData.append("booking_number", whatsapp);
    formData.append("gmap_link", googleMapsLink);
    formData.append("salon_latitude", latitude);
    formData.append("salon_longitude", longitude);
    formData.append("open_time", open.Monday);
    formData.append("close_time", close.Monday);
    formData.append("address", address);
    formData.append("landmark", landmark);
    formData.append("city", city);
    formData.append("area", area);
    formData.append("slug", slug);
    formData.append("about_us", aboutUs);
    formData.append("offer_tag", offerTag);
    formData.append("price", price);
    formData.append("salon_timings", salonTimingsJSON);
    formData.append("salon_type", salon_type);
    const secondaryAreasJSON = JSON.stringify(secondaryAreas);

    // Add this to your formData.append calls
    formData.append("secondary_areas_display", secondaryAreasJSON);

    if (mainImg || !salonData) formData.append("main_image", mainImg);

    for (var i = 0; i < facilities.length; i++) {
      formData.append("facilities", facilities[i]);
    }

    for (let i = 0; i < imgs.length; i++) {
      formData.append("uploaded_images", imgs[i]);
    }

    if (salonData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/${salonData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.ok) {
          const resp = await response.json();
          setName("");
          setPhone("");
          setWhatsapp("");
          setAddress("");
          setLandmark("");
          setCity("");
          setArea("");
          setGoogleMapsLink("");
          setLatitude("");
          setLongitude("");
          setOpen("");
          setClose("");
          setFacilities([]);
          setSlug("");
          setAboutUs("");
          setOfferTag("");
          setPrice("");
          setMainImg(null);
          setImgs([]);
          setsalonData(resp);
          setSalonType("");
          toast.success("Salon updated successfully", {
            duration: 4000,
            position: "top-center",
          });
          closeModal();
        } else {
          const errorResponse = await response.json();
          let errorMessage = "An error occurred: ";
          let hasErrors = false;
          for (const key in errorResponse) {
            if (Array.isArray(errorResponse[key])) {
              errorMessage += `\n${errorResponse[key][0]}`;
              hasErrors = true;
            }
          }
          if (!hasErrors) {
            errorMessage =
              "An unexpected error occurred. Please try again later or check console/network tab.";
          }
          console.error("Error occurred:", errorResponse);
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Error occured", error);
        alert("Error occured : " + error.message);
      }

      setAddSalonLoading(false);
    } else {
      try {
        const response = await fetch("https://backendapi.trakky.in/salons/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.ok) {
          toast.success("Salon added successfully", {
            duration: 4000,
            position: "top-center",
          });
          setName("");
          setPhone("");
          setWhatsapp("");
          setAddress("");
          setLandmark("");
          setCity("");
          setArea("");
          setNewPriority("");
          setNewSecondaryArea("");
          setGoogleMapsLink("");
          setLatitude("");
          setLongitude("");
          setOpen("");
          setClose("");
          setFacilities([]);
          setSlug("");
          setAboutUs("");
          setOfferTag("");
          setPrice("");
          setMainImg(null);
          setImgs([]);
          setOpen({
            Monday: "",
            Tuesday: "",
            Wednesday: "",
            Thursday: "",
            Friday: "",
            Saturday: "",
            Sunday: "",
          });
          setClose({
            Monday: "",
            Tuesday: "",
            Wednesday: "",
            Thursday: "",
            Friday: "",
            Saturday: "",
            Sunday: "",
          });
          document.getElementById("main-img").value = "";
          document.getElementById("imgs").value = "";
          setSalonType("");
        } else {
          const errorResponse = await response.json();
          let errorMessage = "An error occurred: ";
          let hasErrors = false;
          for (const key in errorResponse) {
            if (Array.isArray(errorResponse[key])) {
              errorMessage += `\n${errorResponse[key][0]}`;
              hasErrors = true;
            }
          }
          if (!hasErrors) {
            errorMessage =
              "An unexpected error occurred. Please try again later or check console/network tab.";
          }
          console.error("Error occurred:", errorResponse);
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Error occured", error);
        toast.error(`Error occured : ${error.message}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
      setAddSalonLoading(false);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://backendapi.trakky.in/salons/city/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setCitiesData(data.payload);
        } else if (response.status === 401) {
          toast.error("Unauthorized access. Please log in again.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          toast.error(`Error : ${response.status} - ${response.statusText}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Network error:", error.message);
        toast.error("Failed to fetch cities. Please try again later.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    };

    fetchCities();
  }, [salonData]);

  useEffect(() => {
    if (salonData) {
      const selectedCityObj = citiesData.filter(
        (c) => c.name === salonData.city
      );
      setAreasData(selectedCityObj[0] ? selectedCityObj[0].area_names : []);
    }
  }, [citiesData]);

  const handleTimeChange = (e, type, day) => {
    const newValue = e.target.value;

    // Update all days' times if Monday is selected
    if (day === "Monday" && (open.Tuesday === "" || close.Tuesday === "")) {
      const updatedTimes = { [day]: newValue };
      for (const otherDay of Object.keys(open)) {
        if (otherDay !== "Monday") {
          updatedTimes[otherDay] = newValue;
        }
      }
      if (type === "open") {
        setOpen(updatedTimes);
      } else {
        setClose(updatedTimes);
      }
    } else {
      // Update only the selected day's time
      if (type === "open") {
        setOpen((prevOpen) => ({ ...prevOpen, [day]: newValue }));
      } else {
        setClose((prevClose) => ({ ...prevClose, [day]: newValue }));
      }
    }
  };

  const resetTimings = (e) => {
    e.preventDefault();
    setOpen({
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    });
    setClose({
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    });
  };
  const handleCheckboxChange = (day) => {
    setIsClosed((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
    if (!isClosed[day]) {
      setOpen((prevOpen) => ({ ...prevOpen, [day]: "" }));
      setClose((prevClose) => ({ ...prevClose, [day]: "" }));
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="form-container"
        style={{
          marginBottom: "50px",
        }}
      >
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">{salonData ? "Update" : "Add"} Salon</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-box inp-phonenum col-2 relative">
              <label htmlFor="phonenum">
                Phone{" "}
                <span className="Note_Inp_Classs">
                  Phone Number Must be of 10 Digits
                </span>
              </label>
              <input
                type="number"
                name="phonenum"
                id="phonenum"
                placeholder="Enter Phone Number"
                required
                value={phone}
                onChange={(e) => {
                  setPhone((val) => {
                    if (e.target.value.length > 10) {
                      return val;
                    } else if (e.target.value.length < 10) {
                      return e.target.value;
                    } else {
                      return e.target.value;
                    }
                  });
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
              {phone.length !== 10 && phone.length !== 0 && (
                <ErrorIcon
                  className="error-icon absolute right-[20px] bottom-[5px] hidden"
                  color="error"
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-whatsappnum col-1 relative">
              <label htmlFor="whatsappnum">
                Whatsapp{" "}
                <span className="Note_Inp_Classs">
                  Whatsapp Number Must be of 10 Digits
                </span>
              </label>
              <input
                type="number"
                name="whatsappnum"
                id="whatsappnum"
                placeholder="Enter Whatsapp Number"
                required
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp((val) => {
                    if (e.target.value.length > 10) {
                      return val;
                    } else if (e.target.value.length < 10) {
                      return e.target.value;
                    } else {
                      return e.target.value;
                    }
                  });
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
              {whatsapp.length !== 10 && whatsapp.length !== 0 && (
                <ErrorIcon
                  className="error-icon absolute right-[5px] bottom-[5px] hidden"
                  color="error"
                />
              )}
            </div>
            <div className="input-box inp-address col-2">
              <label htmlFor="address">Address</label>
              <textarea
                name="address"
                id="address"
                cols="30"
                rows="3"
                placeholder="Enter Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-landmark col-1">
              <label htmlFor="landmark">Landmark</label>
              <input
                type="text"
                name="landmark"
                id="landmark"
                placeholder="Enter Landmark"
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
            <div className="input-box inp-city col-2">
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
                required
                value={city ? city : "not-select"}
                onChange={(e) => {
                  setCity(e.target.value);
                  const selectedCityObj = citiesData.filter(
                    (c) => c.name === e.target.value
                  );
                  setAreasData(selectedCityObj[0].area_names);
                }}
              >
                <option value="not-select" disabled hidden selected>
                  ---Select---
                </option>
                {citiesData.map((cityoption, index) => (
                  <option
                    value={cityoption.name}
                    key={index}
                    selected={cityoption.name === city ? true : false}
                  >
                    {cityoption.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-area col-1">
              <label htmlFor="area">
                Area{" "}
                <span className="Note_Inp_Classs">
                  City is Compulsory to select Area
                </span>
              </label>
              <select
                name="area"
                id="area"
                required
                value={area ? area : "not-select"}
                onChange={(e) => {
                  setArea(e.target.value);
                }}
              >
                <option value="not-select" disabled hidden selected>
                  ---Select---
                </option>
                {areasData.map((tempArea, index) => (
                  <option
                    value={tempArea}
                    key={index}
                    selected={tempArea === area ? true : false}
                  >
                    {tempArea}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-box inp-google-maps-link col-2">
              <label htmlFor="googlemapslink">Google Maps Link</label>
              <input
                type="text"
                name="googlemapslink"
                id="googlemapslink"
                placeholder="Enter Google Maps Link"
                required
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-latitude col-1">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                placeholder="Enter Latitude"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
            </div>
            <div className="input-box inp-longitude col-2">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                placeholder="Enter Longitude"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
            </div>
          </div>
          <div className="input-box inp-timings">
            <label htmlFor="timings" className="timing-label">
              Timings{" "}
              <span
                onClick={resetTimings}
                style={{
                  cursor: "pointer",
                  fontSize: "0.93rem",
                  fontStyle: "italic",
                }}
              >
                {salonData ? (
                  <span>&nbsp;&nbsp;&nbsp;</span>
                ) : (
                  <RestoreIcon style={{ marginLeft: "7px" }} />
                )}{" "}
                Reset Timings
              </span>
            </label>
            <div></div>
            <div
              className="custom-timings-row"
              style={{ justifyContent: "flex-start", marginLeft: "15px" }}
            >
              <div>
                <label htmlFor="" className="day-label">
                  Monday
                </label>
                <label htmlFor="" className="day-label">
                  Tuesday
                </label>
                <label htmlFor="" className="day-label">
                  Wednesday
                </label>
                <label htmlFor="" className="day-label">
                  Thursday
                </label>
                <label htmlFor="" className="day-label">
                  Friday
                </label>
                <label htmlFor="" className="day-label">
                  Saturday
                </label>
                <label htmlFor="" className="day-label">
                  Sunday
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <DayInput
                  day="Monday"
                  isClosed={isClosed.Monday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Tuesday"
                  isClosed={isClosed.Tuesday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Wednesday"
                  isClosed={isClosed.Wednesday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Thursday"
                  isClosed={isClosed.Thursday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Friday"
                  isClosed={isClosed.Friday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Saturday"
                  isClosed={isClosed.Saturday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
                <DayInput
                  day="Sunday"
                  isClosed={isClosed.Sunday}
                  handleCheckboxChange={handleCheckboxChange}
                  handleTimeChange={handleTimeChange}
                  open={open}
                  close={close}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-facilities col-2">
              <label htmlFor="facilities">Facilities</label>
              <FacilityContext.Provider value={{ facilities, setFacilities }}>
                <div className="flex justify-center items-center flex-wrap w-[100%] gap-8 md:gap-12 py-4">
                  <CheckBox
                    title="Washroom"
                    Img={"./Assets/CheckBox_icons/wc_black.png"}
                    ImgActive={"./Assets/CheckBox_icons/wc_purple.png"}
                  />
                  <CheckBox
                    title="Air conditioning"
                    Img={"./Assets/CheckBox_icons/ac_black.png"}
                    ImgActive={"./Assets/CheckBox_icons/ac_purple.png"}
                  />
                  <CheckBox
                    title="Music"
                    Img={"./Assets/CheckBox_icons/music_black.png"}
                    ImgActive={"./Assets/CheckBox_icons/music_purple.png"}
                  />
                  <CheckBox
                    title="Parking"
                    Img={"./Assets/CheckBox_icons/parking_black.png"}
                    ImgActive={"./Assets/CheckBox_icons/parking_purple.png"}
                  />
                  <CheckBox
                    title="Sanitization"
                    Img={"./Assets/CheckBox_icons/sanitization_black.png"}
                    ImgActive={
                      "./Assets/CheckBox_icons/sanitization_purple.png"
                    }
                  />
                </div>
              </FacilityContext.Provider>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-slug col-1">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                name="slug"
                id="slug"
                placeholder="Enter Slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="input-box inp-aboutus col-2">
              <label htmlFor="aboutus">About Us</label>
              <textarea
                name="aboutus"
                id="aboutus"
                cols="30"
                rows="3"
                placeholder="Enter About Us"
                required
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-offertag col-1">
              <label htmlFor="offertag">Offer Tag</label>
              <input
                type="text"
                name="offertag"
                id="offertag"
                placeholder="Enter Offer Tag"
                required
                value={offerTag}
                onChange={(e) => setOfferTag(e.target.value)}
              />
            </div>
            <div className="input-box inp-price col-2">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Enter Price"
                required
                min={0}
                value={price}
                onChange={(e) => {
                  if (e.target.value < 0) {
                    e.target.value = 0;
                  }
                  setPrice(e.target.value);
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1">
              <label htmlFor="mainimg">
                Main Image{" "}
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 7:5
                </span>
              </label>
              <input
                style={{ cursor: "pointer", width: "fit-content" }}
                type="file"
                name="main-img"
                id="main-img"
                placeholder="Enter Main Image"
                {...(salonData ? {} : { required: true })}
                onChange={(e) => setMainImg(e.target.files[0])}
              />
            </div>
            <div className="input-box inp-imgs col-2">
              <label htmlFor="imgs">
                Images{" "}
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 7:5
                </span>
              </label>
              <input
                style={{ cursor: "pointer", width: "fit-content" }}
                type="file"
                name="imgs"
                id="imgs"
                placeholder="Enter Images"
                {...(salonData ? {} : { required: true })}
                multiple
                onChange={(e) => setImgs(e.target.files)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-secondary-areas col-2">
              <label htmlFor="secondary-areas">Secondary Areas</label>
              <div className="secondary-areas-container">
                {secondaryAreas.map((area) => (
                  <div key={area.id} className="secondary-area-item">
                    <span>{area.name} (Priority: {area.priority})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryArea(area.id)}
                      className="remove-area-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="add-secondary-area">
                  <select
                    value={newSecondaryArea}
                    onChange={(e) => setNewSecondaryArea(e.target.value)}
                    className="secondary-area-select"
                  >
                    <option value="">Select Area</option>
                    {availableSecondaryAreas
                      .filter(area => !secondaryAreas.some(sa => sa.name === area.name))
                      .map((area) => (
                        <option key={area.id} value={area.name}>
                          {area.name}
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Priority"
                    min="1"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="priority-input"
                  />

                  <button
                    type="button"
                    onClick={handleAddSecondaryArea}
                    className="add-area-btn"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="all-service">Salon type</label>
              <div className=" flex gap-5">
                {/* input radio PRIME , classic & LUXURIOUS */}
                {/* CLASSIC
LUXURIOUS
PRIME */}
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    // checked={formData.salon_type === "PRIME"}
                    checked={salon_type === "PRIME"}
                    name="salon_type"
                    value="PRIME"
                    // disabled
                    onChange={(e) => {
                      setSalonType(e.target.value);
                    }}
                  />
                  <label htmlFor="PRIME">Prime</label>
                </div>
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    checked={salon_type === "CLASSIC"}
                    name="salon_type"
                    value="CLASSIC"
                    // disabled
                    onChange={(e) => {
                      setSalonType(e.target.value);
                    }}
                  />
                  <label htmlFor="CLASSIC">Classic</label>
                </div>
                <div className=" flex gap-1">
                  <input
                    type="radio"
                    // checked={formData.salon_type === "LUXURIOUS"}
                    checked={salon_type === "LUXURIOUS"}
                    name="salon_type"
                    value="LUXURIOUS"
                    // disabled
                    // onChange={(e) => {
                    //   setFormData({
                    //     ...formData,
                    //     salon_type: e.target.value,
                    //   });
                    // }}
                    onChange={(e) => {
                      setSalonType(e.target.value);
                    }}
                  />
                  <label htmlFor="LUXURIOUS">LUXURIOUS</label>
                </div>
              </div>
            </div>
          </div>
          <div className="submit-btn row">
            <button
              type="submit"
              onSubmit={handleSubmit}
              style={{
                opacity: addSalonLoading ? 0.5 : 1,
              }}
              disabled={addSalonLoading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

function DayInput({
  day,
  isClosed,
  handleCheckboxChange,
  handleTimeChange,
  open,
  close,
}) {
  return (
    <div className="day-input-container">
      <TimeInput
        label={day.toLowerCase()}
        value={open[day]}
        onChange={(e) => handleTimeChange(e, "open", day)}
        type="open"
        closed={isClosed}
      />
      <TimeInput
        label={day.toLowerCase()}
        value={close[day]}
        onChange={(e) => handleTimeChange(e, "close", day)}
        type="close"
        closed={isClosed}
      />
      <div className="day-input-group">
        Closed{" "}
        <input
          className="checkbox-label"
          type="checkbox"
          checked={isClosed}
          onChange={() => handleCheckboxChange(day)}
        />
      </div>
    </div>
  );
}

export default AddSalon;
