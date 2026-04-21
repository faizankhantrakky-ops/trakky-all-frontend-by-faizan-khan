import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";
import Quill from "quill";

const AddSpaProfileOffer = ({ profileOfferData, setProfileOfferData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [offerName, setOfferName] = useState(
    profileOfferData?.offer_name || ""
  );

  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    profileOfferData?.spa_city || ""
  );
  const [selectedAreaName, setSelectedAreaName] = useState(
    profileOfferData?.spa_area || ""
  );
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedOfferType, setSelectedOfferType] = useState(
    profileOfferData?.offer_type || "general"
  );
  const [selectedSpaId, setSelectedSpaId] = useState(
    profileOfferData
      ? { value: profileOfferData.spa, label: profileOfferData.spa_name }
      : null
  );

  const [massageData, setMassageData] = useState([]);
  const [selectedMassageId, setSelectedMassageId] = useState(
    profileOfferData?.massage || "not-select"
  );
  const [massagePrice, setMassagePrice] = useState(
    profileOfferData?.massage_price || ""
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    profileOfferData?.discount_price || ""
  );

  const [couponCode, setCouponCode] = useState(
    profileOfferData?.coupon_code || ""
  );
  const [avail, setavail] = useState(profileOfferData?.how_to_avial || "");

  const [offerPercentage, setOfferPercentage] = useState(
    profileOfferData?.offer_percentage || ""
  );

  const [selectedType, setSelectedType] = useState("percentage");

  const calculateDiscountedPrice = (massagePrice, offerPercentage) => {
    if (!massagePrice) massagePrice = 0;
    return (massagePrice - (massagePrice * offerPercentage) / 100).toFixed(0);
  };

  const calculateOfferPercentage = (massagePrice, discountedPrice) => {
    if (!massagePrice) massagePrice = 0;
    return (((massagePrice - discountedPrice) / massagePrice) * 100).toFixed(0);
  };

  useEffect(() => {
    if (massagePrice !== "") {
      if (offerPercentage !== "" && selectedType === "percentage") {
        setDiscountedPrice(
          calculateDiscountedPrice(massagePrice, offerPercentage)
        );
      }
    }
  }, [offerPercentage, massagePrice]);

  useEffect(() => {
    if (massagePrice !== "") {
      if (discountedPrice !== "" && selectedType === "discount") {
        setOfferPercentage(
          calculateOfferPercentage(massagePrice, discountedPrice)
        );
      }
    }
  }, [discountedPrice, massagePrice]);

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
    if (profileOfferData) {
      setSelectedSpaId({
        value: profileOfferData.spa,
        label: profileOfferData.spa_name,
      });
      if (profileOfferData.term_and_condition && editorRef.current) {
        editorRef.current.root.innerHTML = profileOfferData.term_and_condition;
      }
      if (selectedOfferType !== "general") {
        getMassages(profileOfferData.spa);
      }
    }
  }, [profileOfferData]);

  const getMassages = async (spaId) => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let response = await fetch(
        `https://backendapi.trakky.in/spas/service/?spa_id=${spaId}`,
        requestOption
      );

      let data = await response.json();

      if (response.ok) {
        setMassageData(data.results);
      } else {
        console.log("Error occured while fetching master service data");
      }
    } catch (error) {
      console.log("Error occured while fetching master service data", error);
    }
  };

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/spas/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) => alert(err));
  };

  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      let cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas = selectedAreas?.concat(city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  useEffect(() => {
    setAvailableAreaName(getAreaNames(selectedCity));
  }, [selectedCity, cityPayload]);

  useEffect(() => {
    getCity();
  }, []);

  const loadspas = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/spas/?offerName=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const options = data?.results?.map((spa) => ({
        value: spa.id,
        label: spa.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      toast.error("Something went wrong !", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      callback([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setIsLoading(true);

    if (selectedSpaId.length === 0) {
      // alert("Please select at least one spa");
      toast.error("Please select at least one spa", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const offerModel = new FormData();
    offerModel.append("spa", selectedSpaId.value);
    if (selectedOfferType !== "general") {
      offerModel.append("massage", selectedMassageId);
      offerModel.append("massage_price", massagePrice);
    }
    if (couponCode !== "") {
      offerModel.append("coupon_code", couponCode);
    }
    if (discountedPrice !== "") {
      offerModel.append("discount_price", discountedPrice);
    }
    offerModel.append("offer_type", selectedOfferType);
    offerModel.append("term_and_condition", editorRef.current.root.innerHTML);
    if (offerPercentage !== "") {
      offerModel.append("offer_percentage", offerPercentage);
    }
    offerModel.append("offer_name", offerName);
    if (avail !== "") {
      offerModel.append("how_to_avial", avail);
    }
    if (profileOfferData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/spa-profile-page-offer/${profileOfferData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: offerModel,
          }
        );
        if (response.ok) {
          setProfileOfferData(response.json());
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
            errorData.spaSlug !== undefined ? errorData.spaSlug : "";
          errorMessage += " ";

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
        console.error("Errorg ", error);
        toast.error("Error", {
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
          `https://backendapi.trakky.in/spas/spa-profile-page-offer/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: offerModel,
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
          setSelectedCity("");
          setSelectedAreaName("");
          setOfferName("");
          setSelectedSpaId([]);
          setDiscountedPrice("");
          setSelectedOfferType("general");
          setOfferPercentage("");
          setMassageData([]);
          setSelectedMassageId("not-selected");
          setCouponCode("");
          editorRef.current.root.innerHTML = "";
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
            errorData.spaSlug !== undefined ? errorData.spaSlug : "";
          errorMessage += " ";
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
        console.error("Error", error);
        toast.error(`Error: ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "white",
          },
        });
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
              {profileOfferData ? "Update" : "Add"} Spa Profile Offer
            </h3>
          </div>

          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                offerName="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedAreaName("");
                  setSelectedSpaId([]);
                  setSelectedOfferType("general");
                  setSelectedCity(e.target.value);
                }}
                required
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
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select Area</label>
              <select
                offerName="id"
                id="id"
                value={selectedAreaName}
                onChange={(e) => {
                  setSelectedSpaId([]);
                  setSelectedOfferType("general");
                  setSelectedAreaName(e.target.value);
                }}
                // required
              >
                <option value="">Select Area</option>
                {availableAreaName.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="spas">Select spa</label>
              <AsyncSelect
                defaultOptions
                loadOptions={loadspas}
                value={selectedSpaId}
                onChange={(selectedOptions) => {
                  setSelectedOfferType("general");
                  setSelectedSpaId(selectedOptions);
                }}
                noOptionsMessage={() => "No spas found"}
                placeholder="Search spa..."
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
            <div className="input-box inp-offerName col-1 col-2">
              <label htmlFor="offerName">Offer Name</label>
              <input
                type="text"
                offerName="offerName"
                id="offerName"
                placeholder="Enter Offer Name"
                required
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="offerType">Select Offer Type</label>
              <select
                disabled={!selectedSpaId}
                name="offerType"
                id="offerType"
                value={selectedOfferType}
                onChange={(e) => {
                  setMassagePrice("");
                  setSelectedMassageId("not-select");
                  setSelectedOfferType(e.target.value);
                  if (selectedOfferType === "general") {
                    getMassages(selectedSpaId.value);
                  }
                }}
                required
              >
                <option value="general">General</option>
                <option value="massage specific">Message Specific</option>
              </select>
            </div>
          </div>
          {selectedOfferType !== "general" ? (
            <>
              <div className="row">
                <div className="input-box inp-time col-1 col-2">
                  <label htmlFor="masterservice">Select Massage</label>
                  <select
                    name="masterservice"
                    id="masterservice"
                    required
                    disabled={!selectedSpaId}
                    value={selectedMassageId || "not-select"}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedOption = e.target.selectedOptions[0];

                      setSelectedMassageId(selectedValue);

                      if (selectedValue === "not-select") {
                        setMassagePrice("0");
                      } else {
                        setMassagePrice(selectedOption.getAttribute("price"));
                      }
                    }}
                  >
                    <option value="not-select" selected>
                      ---Select---
                    </option>
                    {massageData?.map((mservice, index) => (
                      <option
                        value={mservice.id}
                        key={index}
                        price={mservice.price}
                      >
                        {mservice.service_names}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="input-box inp-time col-1 col-2">
                  <label htmlFor="massagePrice">Massage Price</label>
                  <input
                    disabled
                    type="number"
                    id="MassagePrice"
                    value={massagePrice}
                    onChange={(e) => setMassagePrice(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : null}
          {selectedOfferType !== "general" ? (
            <div className="row">
              <div className="input-box inp-salon col-1 col-2 relative">
                <label htmlFor="type">Select Type</label>
                <select
                  name="type"
                  id="type"
                  value={selectedType}
                  onChange={(e) => {
                    setOfferPercentage("");
                    setDiscountedPrice("");
                    setSelectedType(e.target.value);
                  }}
                  required
                >
                  <option value="percentage">Offer Percentage</option>
                  <option value="discount">Discount Price</option>
                </select>
              </div>
            </div>
          ) : null}
          <div className="row">
            <div className="input-box inp-spaSlug col-1 col-2">
              <label htmlFor="offerpercentage">Offer Percentage</label>
              <input
                disabled={selectedType === "discount"}
                type="number"
                offerName="offerpercentage"
                id="offerpercentage"
                placeholder="Enter Offer Percentage"
                required
                value={offerPercentage}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value <= 100 && value >= 0) {
                    setOfferPercentage(value);
                  }
                }}
              />
            </div>
            {selectedOfferType !== "general" ? (
              <div className="input-box inp-spaSlug col-1 col-2">
                <label htmlFor="discountedprice">Discounted Price</label>
                <input
                  disabled={selectedType === "percentage"}
                  type="number"
                  offerName="discountedprice"
                  id="discountedprice"
                  placeholder="Enter discounted price"
                  required
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                />
              </div>
            ) : null}
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Terms & Conditions</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-spaSlug col-1 col-2">
              <label htmlFor="couponcode">Coupon Code (optional)</label>
              <input
                type="text"
                offerName="couponcode"
                id="couponcode"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-spaSlug col-1 col-2">
              <label htmlFor="avail">How to avail</label>
              <input
                type="text"
                offerName="avail"
                id="avail"
                placeholder="Enter How to avail"
                value={avail}
                onChange={(e) => setavail(e.target.value)}
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

export default AddSpaProfileOffer;
