import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import { MdDescription } from "react-icons/md";

const AddNationalHeroOffers = ({
  nationalHeroOfferData,
  setNationalHeroOfferData,
  closeModal,
}) => {
  console.log("nationalHeroOfferData : ", nationalHeroOfferData);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  // const [video, setVideo] = useState(null);
  // const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [selectedCity, setSelectedCity] = useState(
    nationalHeroOfferData?.city || ""
  );
  const [city, setCity] = useState([]);

  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (nationalHeroOfferData) {
      return {
        value: nationalHeroOfferData?.salon,
        label: nationalHeroOfferData?.salon_name,
      };
    } else {
      return null;
    }
  });
  const [selectSalonId, setSelectSalonId] = useState(
    nationalHeroOfferData?.salon || ""
  );
  const [isNationalOffers, setIsNationalOffers] = useState(
    nationalHeroOfferData?.is_national || false
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("city", selectedCity);
    if (img !== null) {
      formData.append("image", img);
    }
    // if (video !== null) formData.append("video", video);
    // if (videoThumbnail !== null) formData.append("video_thumbnail", videoThumbnail);
    formData.append("salon", selectSalonId);
    formData.append("is_national", isNationalOffers);
    let method;
    let url;
    if (nationalHeroOfferData) {
      method = "PATCH";
      url = `https://backendapi.trakky.in/salons/national-hero-offers/${nationalHeroOfferData.id}/`;
    } else {
      method = "POST";
      url = `https://backendapi.trakky.in/salons/national-hero-offers/`;
    }
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });
      if (response.ok) {
        let temp;
        if (nationalHeroOfferData) {
          temp = "Updated";
        } else {
          temp = "Added";
        }
        toast.success(`${temp} successfully`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        });
        setSelectedCity("");
        setImg(null);
        // setVideo(null);
        // setVideoThumbnail(null);
        setSelectSalonId("");
        setSelectedSalons(null);
        document.getElementById("img").value = "";
        // document.getElementById("video").value = "";
        // document.getElementById("videoThumbnail").value = "";
        if (nationalHeroOfferData) {
          closeModal();
        }
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        let errorMessage = errorData.image !== undefined ? errorData.image : "";
        errorMessage += " ";
        errorMessage += errorData.city !== undefined ? errorData.city : "";
        if (errorMessage.length === 0) {
          errorMessage += `Something Went Wrong : ${response.status}`;
        }
        toast.error(`${errorMessage}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "white",
          },
        });
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
    }
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
              {nationalHeroOfferData ? "Update" : "Add"} National Hero Offer
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSalons("");
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
                  Salon Must belongs to Selected city
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
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="isnational">Is National offer?</label>
              <select
                name="isnational"
                id="isnational"
                value={isNationalOffers ? "Yes" : "No"}
                onChange={(e) => {
                  setIsNationalOffers(e.target.value === "Yes" ? true : false);
                }}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 4:1
                </span>
              </label>
              <input
                required={nationalHeroOfferData ? false : true}
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
          {/* <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                video
                <span className="Note_Inp_Classs">
                  Recommended video Ratio 4:1
                </span>
              </label>
              <input
                required={nationalHeroOfferData ? false : true}
                type="file"
                name="video"
                id="video"
                placeholder="Enter Image"
                accept="video/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Video Thumbnail
                <span className="Note_Inp_Classs">
                  Recommended Video Thumbnail Ratio 4:1
                </span>
              </label>
              <input
                required={nationalHeroOfferData ? false : true}
                type="file"
                name="videothumbnail"
                id="videothumbanail"
                placeholder="Enter Image"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setVideoThumbnail(e.target.files[0])}
              />
            </div>
          </div> */}
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNationalHeroOffers;
