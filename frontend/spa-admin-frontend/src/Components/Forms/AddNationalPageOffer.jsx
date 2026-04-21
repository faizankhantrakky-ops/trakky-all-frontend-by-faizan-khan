import React, { useState, useContext } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddNationalProfileOffer = ({ cityOfferData, setCityOfferData }) => {
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    cityOfferData?.spa_city || ""
  );
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [offerImage, setOfferImage] = useState(null);
  const [selectedSpaId, setSelectedSpaId] = useState(cityOfferData?.spa || "");
  const [selectedSpa, setSelectedSpa] = useState(() => {
    if (cityOfferData) {
      return {
        value: cityOfferData?.spa,
        label: cityOfferData?.spa_name,
      };
    } else {
      return null;
    }
  });
  const [spaProfileOffersData, setSpaProfileOffersData] = useState([]);
  const [selectedSpaProfileOfferId, setSelectedSpaProfileOfferId] = useState(
    cityOfferData?.spa_profile_offer || "not-select"
  );

  useEffect(() => {
    getCity();
  }, []);

  const loadSpas = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      const response = await fetch(url);
      const data = await response.json();

      const options = data?.results?.map((spa) => ({
        value: spa.id,
        label: spa.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      callback([]);
    }
  };

  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/spas/city/`;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("spa", selectedSpaId);
    formData.append("spa_profile_offer", selectedSpaProfileOfferId);
    if (offerImage !== null) {
      formData.append("offer_img", offerImage);
    }

    if (cityOfferData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/national-page-offer/${cityOfferData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          setCityOfferData(response.json());
          toast.success("Offer updated successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
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
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.spa !== undefined ? errorData.spa + " " : "";
          errorMessage +=
            errorData.spa_profile_offer !== undefined
              ? errorData.spa_profile_offer + " "
              : "";
          errorMessage +=
            errorData.offer_img !== undefined ? errorData.offer_img + " " : "";

          if (errorMessage === "") {
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
          toast.error(`Something Went Wrong : ${response.status}`, {
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
        console.log("Error occured : ", error);
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
        const response = await fetch(
          `https://backendapi.trakky.in/spas/national-page-offer/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Offer added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedSpaId("");
          setSelectedSpa(null);
          setSelectedSpaProfileOfferId("");
          setSelectedCity("");
          setOfferImage(null);
          document.getElementById("offerImage").value = "";
        } else if (response.status === 401) {
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
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.spa !== undefined ? errorData.spa + " " : "";
          errorMessage +=
            errorData.spa_profile_offer !== undefined
              ? errorData.spa_profile_offer + " "
              : "";
          errorMessage +=
            errorData.offer_img !== undefined ? errorData.offer_img + " " : "";

          if (errorMessage === "") {
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
          toast.error(`Something Went Wrong : ${response.status}`, {
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
    }
  };

  useEffect(() => {
    getSpaProfileOffers(selectedSpaId);
  }, [selectedSpaId]);

  const getSpaProfileOffers = async (spa_id) => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let response = await fetch(
        `https://backendapi.trakky.in/spas/spa-profile-page-offer/?spa=${spa_id}`,
        requestOption
      );

      let data = await response.json();

      if (response.ok) {
        setSpaProfileOffersData(data);
      } else {
        console.log("Error occured while fetching spa profile offers");
      }
    } catch (error) {
      console.log("Error occured while fetching spaProfileOffer", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {cityOfferData ? "Update" : "Add"} National Page offer
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={city.length === 0}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSpa("");
                  setSelectedSpaId("");
                  setSpaProfileOffersData([]);
                  setSelectedCity(e.target.value);
                }}
                required
              >
                <option value="">
                  {city.length === 0
                    ? "Wait Cities are loading"
                    : "Select City"}
                </option>
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
              <label htmlFor="spas">
                Select Spa
                <span className="Note_Inp_Classs">
                  Spa Must belongs to Selected city
                </span>
              </label>
              <AsyncSelect
                isDisabled={!selectedCity}
                defaultOptions
                loadOptions={loadSpas}
                value={selectedSpa}
                onChange={(selectedSpa) => {
                  setSelectedSpa(selectedSpa);
                  setSelectedSpaId(selectedSpa.value);
                }}
                noOptionsMessage={() => "No spas found"}
                placeholder="Search Spa..."
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
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="spaprofileoffer">Select Spa Profile Offer</label>
              <select
                name="spaprofileoffer"
                id="spaprofileoffer"
                required
                disabled={!selectedSpaId}
                value={selectedSpaProfileOfferId || "not-select"}
                onChange={(e) => setSelectedSpaProfileOfferId(e.target.value)}
              >
                <option value="not-select" selected>
                  ---Select---
                </option>
                {spaProfileOffersData?.map((mOffer, index) => (
                  <option value={mOffer.id} key={index}>
                    {mOffer.offer_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-priority col-1 col-2">
              <label>
                Image <span className="Note_Inp_Classs">Recommended 1 : 1</span>
              </label>
              <input
                type="file"
                name="offerImage"
                id="offerImage"
                placeholder="Enter Image"
                onChange={(e) => setOfferImage(e.target.files[0])}
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

export default AddNationalProfileOffer;
