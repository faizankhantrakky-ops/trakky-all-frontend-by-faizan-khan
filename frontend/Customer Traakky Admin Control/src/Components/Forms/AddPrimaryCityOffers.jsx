import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddPrimaryCityOffers = ({ offerData, setOfferData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(offerData?.name || "");

  const [slug, setSlug] = useState(offerData?.slug || "");
  const [img, setImg] = useState(null);
  const [salonsData, setSalonsData] = useState([]);
  const cityDataTemp = Object.values(offerData?.city || {});
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    offerData ? (offerData.city ? offerData.city : "") : ""
  );
  // const [selectedAreaName, setSelectedAreaName] = useState(
  //   offerData ? (offerData.area ? offerData.area : "") : ""
  // );
  // const [availableAreaName, setAvailableAreaName] = useState([]);

  // const [salonSearch, setSalonSearch] = useState("");

  const [selectedSalonIds, setSelectedSalons] = useState([]);

  useEffect(() => {
    if (offerData) {
      //map key of data
      const salonDatas = Object.keys(offerData?.salon_name || {}).map((key) => {
        return { value: key, label: offerData?.salon_name[key] };
      });
      setSelectedSalons(salonDatas);
    }
  }, [offerData]);

  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        const cityNames = data?.payload.map((item) => item.name);

        setCityPayload(data?.payload);
        setCity(cityNames);
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

  // function getAreaNames(cityList) {
  //   if (!cityList) {
  //     return cityPayload?.flatMap((city) => city?.area_names);
  //   } else {
  //     let selectedAreas = [];
  //     let cityName = selectedCity.toLowerCase();
  //     for (let city of cityPayload) {
  //       if (city?.name.toLowerCase() === cityName) {
  //         selectedAreas = selectedAreas?.concat(city.area_names);
  //         break;
  //       }
  //     }

  //     return selectedAreas;
  //   }
  // }

  // useEffect(() => {
  //   setAvailableAreaName(getAreaNames(selectedCity));
  // }, [selectedCity, cityPayload]);

  useEffect(() => {
    getCity();
  }, []);

  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      // if (selectedAreaName?.length > 0) {
      //   url += `&area=${selectedAreaName}`;
      // }

      const response = await fetch(url);
      const data = await response.json();

      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: salon.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setIsLoading(true);

    if (selectedSalonIds.length === 0) {
      alert("Please select at least one salon");
      return;
    }

    const offerModel = new FormData();
    offerModel.append("name", name);
    offerModel.append("slug", slug);
    offerModel.append("city", selectedCity);
    // offerModel.append("area", selectedAreaName);

    if (img || !offerData) offerModel.append("offer_image", img);
    for (var i = 0; i < selectedSalonIds.length; i++) {
      offerModel.append("salon", selectedSalonIds[i]?.value);
    }

    if (offerData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-city-offer/${offerData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: offerModel,
          }
        );
        if (response.ok) {
          setOfferData(response.json());
          toast.success("Offer updated successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
          toast.success("Authentication credentials were not provided.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage = errorData.name !== undefined ? errorData.name : "";
          errorMessage += " ";
          errorMessage += errorData.slug !== undefined ? errorData.slug : "";
          errorMessage += " ";
          errorMessage +=
            errorData.offer_image !== undefined ? errorData.offer_image : "";
          errorMessage += " ";
          errorMessage += errorData.salon !== undefined ? errorData.salon : "";
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
        }
      } catch (error) {
        console.error("Error uploading image", error);
      }
    } else {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/salon-city-offer/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
              // ContentType: "multipart/form-data",
            },
            body: offerModel,
          }
        );
        if (response.ok) {
          toast.success("Offer added successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          setImg(null);
          document.getElementById("img").value = "";
          setName("");
          setSlug("");
          setSelectedCity("");
          setSelectedSalons([]);
          // setSelectedAreaName("");
        } else if (response.status === 401) {
          toast.success("Authentication credentials were not provided.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage = errorData.name !== undefined ? errorData.name : "";
          errorMessage += " ";
          errorMessage += errorData.slug !== undefined ? errorData.slug : "";
          errorMessage += " ";
          errorMessage +=
            errorData.offer_image !== undefined ? errorData.offer_image : "";
          errorMessage += " ";
          errorMessage += errorData.salon !== undefined ? errorData.salon : "";
          console.log(errorMessage.length);
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
        }
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {offerData ? "Update" : "Add"} City Offer
            </h3>
          </div>

          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                required
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  // setSelectedAreaName("");
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

          {/* <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select Area</label>
              <select
                disabled={selectedCity === ""}
                required
                name="id"
                id="id"
                value={selectedAreaName}
                onChange={(e) => {
                  setSelectedSalons([]);
                  setSelectedAreaName(e.target.value);
                }}
              >
                <option value="">Select Area</option>
                {availableAreaName.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* <div className="row">
            <p
              style={{
                width: "100%",
                paddingLeft: "15px",
                fontWeight: 500,
              }}
            >
              Note : Area is Mandatory if you select only One Salon
            </p>
          </div> */}
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
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
          </div>
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Salon</label>
              <AsyncSelect
                isDisabled={selectedCity === ""}
                isMulti
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalonIds}
                onChange={(selectedOptions) => {
                  setSelectedSalons(selectedOptions);
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
            <div className="input-box inp-slug col-1 col-2">
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
          </div>

          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>Image</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                {...(offerData ? {} : { required: true })}
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                style={{ width: "fit-content", cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit" onSubmit={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPrimaryCityOffers;
