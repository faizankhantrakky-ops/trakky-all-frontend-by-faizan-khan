import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";

const AddOfferTags = ({ offerTags, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState(offerTags?.salon_city || "");
  const [city, setCity] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (offerTags) {
      return {
        value: offerTags?.salon,
        label: offerTags?.salon_name,
      };
    } else {
      return null;
    }
  });
  const [selectSalonId, setSelectSalonId] = useState(offerTags?.salon || "");
  const [finalOfferSelected, setFinalOfferSelected] = useState("");
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [offerFormat, setOfferFormat] = useState([
    "Get ₹ off",
    "Service at ₹",
    "Get ₹ off on services",
    "Get % off on services",
  ]);
  const [offerFormatSelected, setOfferFormatSelected] = useState("");

  useEffect(() => {
    if (offerTags) {
      const offerTagParts = offerTags.offer_tag.split(" ");
      if (offerTagParts[0] === "Get") {
        if (offerTagParts[1].endsWith("%")) {
          const percentageValue = parseFloat(offerTagParts[1].replace("%", ""));
          setPercentage(percentageValue);
          setOfferFormatSelected(offerFormat[3]);
        } else if (
          offerTagParts[1].startsWith("₹") &&
          offerTagParts[3] === "on"
        ) {
          const amountValue = parseFloat(offerTagParts[1].replace("₹", ""));
          setAmount(amountValue);
          const indexOfOn = offerTagParts.indexOf("on");
          if (indexOfOn !== -1 && indexOfOn < offerTagParts.length - 1) {
            const serviceValue = offerTagParts.slice(indexOfOn + 1).join(" ");
            setServiceName(serviceValue);
            setOfferFormatSelected(offerFormat[2]);
          }
        }
        if (offerTagParts[offerTagParts.length - 1] === "off") {
          const amountValue = parseFloat(offerTagParts[1].replace("₹", ""));
          setAmount(amountValue);
          setOfferFormatSelected(offerFormat[0]);
        } else if (offerTagParts[3] === "on") {
          const indexOfOn = offerTagParts.indexOf("on");
          if (indexOfOn !== -1 && indexOfOn < offerTagParts.length - 1) {
            const serviceValue = offerTagParts.slice(indexOfOn + 1).join(" ");
            setServiceName(serviceValue);
            if (amount !== "") {
              setOfferFormatSelected(offerFormat[2]);
            }
          }
        }
      } else {
        const serviceValue = offerTagParts.slice(0, -2).join(" ");
        setServiceName(serviceValue);
        const amountValue = parseFloat(
          offerTagParts[offerTagParts.length - 1].replace("₹", "")
        );
        setAmount(amountValue);
        setOfferFormatSelected(offerFormat[1]);
      }
    }
  }, [offerTags]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("salon", selectSalonId);
    formData.append("offer_tag", finalOfferSelected);
    let method, url;
    if (offerTags) {
      url = `https://backendapi.trakky.in/salons/salon-offer-tags/${offerTags.id}/`;
      method = "PATCH";
    } else {
      url = `https://backendapi.trakky.in/salons/salon-offer-tags/`;
      method = "POST";
    }
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });
      if (offerTags) {
        if (response.status === 200) {
          toast.success("Updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          closeModal();
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
          setSelectedSalons(null);
          setSelectedCity("");
          setOfferFormatSelected("");
          setFinalOfferSelected("");
        } else if (response.status === 409) {
          toast.error(`Error: Salon already has an offer tag.`, {
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
  const formatOffer = () => {
    let service_name = serviceName;
    if (offerFormatSelected === "Get ₹ off on services") {
      let formattedOffer = offerFormatSelected.replace(
        "services",
        service_name
      );
      formattedOffer = formattedOffer.replace("₹", `₹${amount}`);
      setFinalOfferSelected(formattedOffer);
    } else if (offerFormatSelected === "Service at ₹") {
      let formattedOffer = offerFormatSelected.replace("Service", service_name);
      formattedOffer += `${amount}`;
      setFinalOfferSelected(formattedOffer);
    } else if (offerFormatSelected === "Get ₹ off") {
      let formattedOffer = offerFormatSelected.replace("₹", `₹${amount}`);
      setFinalOfferSelected(formattedOffer);
    } else if (offerFormatSelected === "Get % off on services") {
      let formattedOffer = offerFormatSelected.replace(
        "services",
        service_name
      );
      formattedOffer = formattedOffer.replace("%", `${percentage}%`);
      setFinalOfferSelected(formattedOffer);
    } else {
      setFinalOfferSelected(offerFormatSelected);
    }
  };

  useEffect(() => {
    formatOffer();
  }, [serviceName, offerFormatSelected, amount, percentage]);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {offerTags ? "Update" : "Add"} Offer Tag
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={offerTags}
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
                required
                isDisabled={!selectedCity || offerTags}
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalon) => {
                  setOfferFormatSelected("");
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
              <label htmlFor="id">Select Offer Format</label>
              <select
                required
                name="id"
                id="id"
                value={offerFormatSelected}
                onChange={(e) => {
                  setAmount("");
                  setPercentage("");
                  setOfferFormatSelected(e.target.value);
                }}
              >
                <option value="">Select Offer Format</option>
                {offerFormat.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(offerFormatSelected === "Service at ₹" ||
            offerFormatSelected === "Get ₹ off on services" ||
            offerFormatSelected === "Get % off on services") && (
              <div className="row">
                <div className="input-box inp-service col-1 col-2">
                  <label htmlFor="service-name">Enter Service</label>
                  <input
                    type="text"
                    name="service-name"
                    id="service-name"
                    placeholder="Enter Service"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  />
                </div>
              </div>
            )}
          {(offerFormatSelected === "Get ₹ off" ||
            offerFormatSelected === "Service at ₹" ||
            offerFormatSelected === "Get ₹ off on services") && (
              <div className="row">
                <div className="input-box inp-service col-1 col-2">
                  <label htmlFor="amount">Enter Amount</label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={amount}
                    placeholder="Enter amount here.."
                    onChange={(e) => setAmount(e.target.value)}
                    onWheel={() => document.activeElement.blur()}
                    onKeyDownCapture={(event) => {
                      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            )}
          {offerFormatSelected === "Get % off on services" && (
            <div className="row">
              <div className="input-box inp-service col-1 col-2">
                <label htmlFor="percentage">Enter Percentage</label>
                <input
                  type="number"
                  name="percentage"
                  id="percentage"
                  value={percentage}
                  placeholder="Enter percentage here.."
                  onChange={(e) => setPercentage(e.target.value)}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();

                    }
                  }}
                />
              </div>
            </div>
          )}
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Final Offer Selected</label>
              <input
                type="text"
                name="finalofferselected"
                id="finalofferselected"
                placeholder={finalOfferSelected}
                disabled
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOfferTags;
