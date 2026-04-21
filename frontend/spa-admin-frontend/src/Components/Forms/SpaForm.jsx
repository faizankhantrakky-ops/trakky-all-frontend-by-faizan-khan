import React, { useRef } from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import CheckBox from "./CheckBox";
import FacilityContext from "./contexts/FacilityContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import RestoreIcon from "@mui/icons-material/Restore";
import ErrorIcon from "@mui/icons-material/Error";
import TimeInput from "./TimeInput";

const AddSpa = ({ spaData, setSpaData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(spaData?.name || "");
  const [phone, setPhone] = useState(spaData?.mobile_number || "");
  const [whatsapp, setWhatsapp] = useState(spaData?.booking_number || "");
  const [address, setAddress] = useState(spaData?.address || "");
  const [landmark, setLandmark] = useState(spaData?.landmark || "");
  const [city, setCity] = useState(spaData?.city || "");

  const [area, setArea] = useState(spaData?.area || "");
  const [googleMapsLink, setGoogleMapsLink] = useState(
    spaData?.gmap_link || ""
  );
  const [latitude, setLatitude] = useState(spaData?.spa_latitude || "");
  const [longitude, setLongitude] = useState(spaData?.spa_longitude || "");
  const [facilities, setFacilities] = useState(spaData?.facilities || []);
  const [slug, setSlug] = useState(spaData?.slug || "");
  const [aboutUs, setAboutUs] = useState(spaData?.about_us || "");
  const [offerTag, setOfferTag] = useState(spaData?.offer_tag || "");
  const [price, setPrice] = useState(spaData?.price || "");
  const [mainImg, setMainImg] = useState(null);
  const [imgs, setImgs] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);

  const [addSpaLoading, setAddSpaLoading] = useState(false);
  const [promises, setPromises] = useState([]);
  const [selectedPromiseId, setSelectedPromiseId] = useState(
    spaData?.Promise || ""
  );

  const [open, setOpen] = useState({
    Monday: spaData?.spa_timings?.monday?.open_time || "",
    Tuesday: spaData?.spa_timings?.tuesday?.open_time || "",
    Wednesday: spaData?.spa_timings?.wednesday?.open_time || "",
    Thursday: spaData?.spa_timings?.thursday?.open_time || "",
    Friday: spaData?.spa_timings?.friday?.open_time || "",
    Saturday: spaData?.spa_timings?.saturday?.open_time || "",
    Sunday: spaData?.spa_timings?.sunday?.open_time || "",
  });
  const [isClosed, setIsClosed] = useState({
    Monday: spaData?.spa_timings?.monday === "closed" || false,
    Tuesday: spaData?.spa_timings?.tuesday === "closed" || false,
    Wednesday: spaData?.spa_timings?.wednesday === "closed" || false,
    Thursday: spaData?.spa_timings?.thursday === "closed" || false,
    Friday: spaData?.spa_timings?.friday === "closed" || false,
    Saturday: spaData?.spa_timings?.saturday === "closed" || false,
    Sunday: spaData?.spa_timings?.sunday === "closed" || false,
  });
  const [close, setClose] = useState({
    Monday: spaData?.spa_timings?.monday?.close_time || "",
    Tuesday: spaData?.spa_timings?.tuesday?.close_time || "",
    Wednesday: spaData?.spa_timings?.wednesday?.close_time || "",
    Thursday: spaData?.spa_timings?.thursday?.close_time || "",
    Friday: spaData?.spa_timings?.friday?.close_time || "",
    Saturday: spaData?.spa_timings?.saturday?.close_time || "",
    Sunday: spaData?.spa_timings?.sunday?.close_time || "",
  });

  const getPromises = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/spas/promises/");
      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status >= 400 && response.status < 500) {
          // Client-side error
          throw new Error(`Client Error: ${response.status} - ${errorMessage}`);
        } else if (response.status >= 500 && response.status < 600) {
          // Server-side error
          throw new Error(`Server Error: ${response.status}`);
        } else {
          // Other errors
          throw new Error(
            `Unexpected Error: ${response.status} - ${errorMessage}`
          );
        }
      }
      const data = await response.json();
      setPromises(data);
    } catch (err) {
      console.log("Error : ", err);
      toast.error(err.message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#ffffff",
        },
      });
    }
  };

  useEffect(() => {
    getPromises();
  }, []);

  const [timings, setTimings] = useState([]);

  const handleSubmit = async (event) => {
    setAddSpaLoading(true);
    // toast.loading("Waiting...");
    event.preventDefault();

    if (phone.length !== 10) {
      // alert("Phone number should be of 10 digits");
      toast.error("Phone number should be of 10 digits", {
        duration: 4000,
        position: "top-center",
      });

      return;
    }

    if (whatsapp.length !== 10) {
      // alert("Whatsapp number should be of 10 digits");
      toast.error("Whatsapp number should be of 10 digits", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    const formData = new FormData();
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
    const spaTimingsJSON = JSON.stringify(timings);

    formData.append("spa_timings", spaTimingsJSON);
    formData.append("name", name);
    formData.append("mobile_number", phone);
    formData.append("booking_number", whatsapp);
    formData.append("gmap_link", googleMapsLink);
    formData.append("spa_latitude", latitude);
    formData.append("spa_longitude", longitude);
    // formData.append("open_time", open);
    // formData.append("close_time", close);
    formData.append("address", address);
    formData.append("landmark", landmark);
    // formData.append("priority", priority);
    formData.append("city", city);
    formData.append("area", area);
    formData.append("slug", slug);
    formData.append("about_us", aboutUs);
    formData.append("offer_tag", offerTag);
    formData.append("price", price);
    formData.append("Promise", selectedPromiseId);

    if (mainImg || !spaData) formData.append("main_image", mainImg);

    for (var i = 0; i < facilities.length; i++) {
      formData.append("facilities", facilities[i]);
    }

    for (let i = 0; i < imgs.length; i++) {
      formData.append("uploaded_images", imgs[i]);
    }

    if (spaData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/${spaData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.status === 401) {
          toast.error("You're logged out.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status === 200) {
          const updatedData = await response.json();
          setSpaData(updatedData);
          toast.success("Spa updated successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
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
          setSelectedPromiseId("");
          document.getElementById("main-img").value = "";
          document.getElementById("imgs").value = "";
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
            duration: 5000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.log("Error occured", error);
        toast.error("Error occured.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } else {
      try {
        const response = await fetch("https://backendapi.trakky.in/spas/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });
        if (response.status === 401) {
          toast.error("You're logged out.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status === 201) {
          toast.success("Spa added successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedPromiseId("");
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
          document.getElementById("main-img").value = "";
          document.getElementById("imgs").value = "";
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
            duration: 5000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Error uploading image.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
    setAddSpaLoading(false);
  };

  useEffect(() => {
    fetch("https://backendapi.trakky.in/spas/city/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        // citiesData.current = data.payload;
        setCitiesData(data.payload);

        // setIsLoading(false);
      })
      .catch((err) =>
        toast.error(err, {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      );
  }, [spaData]);

  useEffect(() => {
    if (spaData) {
      const selectedCityObj = citiesData.filter((c) => c.name === spaData.city);
      setAreasData(selectedCityObj[0] ? selectedCityObj[0].area_names : []);
    }
  }, [citiesData]);

  useEffect(() => {
    setAddSpaLoading(false);
  }, [whatsapp, phone]);

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
            <h3 className="form-title">Add Spa</h3>
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
              <label htmlFor="phonenum">Phone</label>
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
              <label htmlFor="whatsappnum">Whatsapp</label>
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
              <label htmlFor="area">Area</label>
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
              />
            </div>
          </div>
          {/* <div className="input-box inp-timings">
            <label htmlFor="timings" className="timing-label">
              Timings
            </label>
            <div className="timings row">
              <div className="inp-timings-open col-1">
                <label htmlFor="open">From</label>
                <input
                  type="time"
                  name="open"
                  id="open"
                  placeholder="Enter Open Time"
                  required
                  value={open}
                  onChange={(e) => setOpen(e.target.value)}
                />
              </div>
              <div className="inp-timings-close col-2">
                <label htmlFor="close">To</label>
                <input
                  type="time"
                  name="close"
                  id="close"
                  placeholder="Enter Close Time"
                  required
                  value={close}
                  onChange={(e) => setClose(e.target.value)}
                />
              </div>
            </div>
          </div> */}
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
                {spaData ? (
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
            {/* <div className="input-box inp-priority col-1">
              <label htmlFor="priority">Priority</label>
              <input
                type="number"
                name="priority"
                id="priority"
                placeholder="Enter Priority"
                required
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div> */}
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
                min={0}
                placeholder="Enter Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-promise col-1">
              <label htmlFor="promise">Promises</label>
              <select
                name="promise"
                id="promise"
                required
                value={selectedPromiseId ? selectedPromiseId : "not-select"}
                onChange={(e) => setSelectedPromiseId(e.target.value)}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                {promises.map((promiseOption, index) => (
                  <option
                    value={promiseOption.id}
                    key={index}
                    selected={promiseOption.promise === selectedPromiseId}
                  >
                    {/* Split the promise string by <li> tags, then join with commas */}
                    {promiseOption.promise
                      .split("<li>")
                      .filter((item) => item.trim() !== "") // Filter out empty strings
                      .map((item, i, array) => (
                        <span key={i}>
                          {/* Remove any HTML tags and trim extra spaces */}
                          {item.replace(/<\/?[^>]+(>|$)/g, "").trim()}
                          {i !== array.length - 1 && " *"}
                        </span>
                      ))}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-main-img col-1">
              <label htmlFor="mainimg">Main Image</label>
              <input
                type="file"
                name="main-img"
                id="main-img"
                placeholder="Enter Main Image"
                {...(spaData ? {} : { required: true })}
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setMainImg(e.target.files[0])}
              />
            </div>
            <div className="input-box inp-imgs col-2">
              <label>Images</label>
              <input
                type="file"
                name="imgs"
                id="imgs"
                placeholder="Enter Images"
                {...(spaData ? {} : { required: true })}
                multiple
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setImgs(e.target.files)}
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button
              type="submit"
              onSubmit={handleSubmit}
              style={{
                opacity: addSpaLoading ? 0.5 : 1,
              }}
              disabled={addSpaLoading}
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

export default AddSpa;
