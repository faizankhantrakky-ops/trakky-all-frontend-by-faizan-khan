import React, { useState, useLayoutEffect, useContext, useRef } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Quill from "quill";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";

const AddService = ({ serviceData, setServiceData }) => {
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(serviceData?.city || "");
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [spasData, setSpasData] = useState([]);
  const [selectedSpaId, setSelectedSpaId] = useState(serviceData?.spa || "");
  const [selectedSpas, setSelectedSpas] = useState(() => {
    if (serviceData) {
      return {
        value: serviceData?.spa,
        label: serviceData?.spa_name,
      };
    } else {
      return null;
    }
  });
  const [service, setService] = useState(serviceData?.service_names || "");
  const [serviceTime, setServiceTime] = useState(
    serviceData?.service_time || {
      days: null,
      hours: null,
      minutes: null,
      seating: null,
    }
  );
  const [discount, setDiscount] = useState(serviceData?.discount || "");
  const [price, setPrice] = useState(serviceData?.price || "");
  // master service data
  const [masterServiceData, setMasterServiceData] = useState([]);
  const [selectedMasterService, setSelectedMasterService] = useState(
    serviceData?.master_service || "not-select"
  );

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

    if (serviceData) {
      editorRef.current.root.innerHTML = serviceData.description;
    }
  }, []);

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

    if (
      !serviceTime?.days &&
      !serviceTime?.hours &&
      !serviceTime?.minutes &&
      !serviceTime?.seating
    ) {
      toast.error("At least one option in service time is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#FFFFFF",
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("spa", selectedSpaId);
    formData.append("master_service", selectedMasterService);
    formData.append("service_names", service);
    formData.append(
      "service_time",
      JSON.stringify({
        days: serviceTime?.days || 0,
        hours: serviceTime?.hours || 0,
        minutes: serviceTime?.minutes || 0,
        seating: serviceTime?.seating || 0,
      })
    );
    // formData.append("description", description);
    formData.append("description", editorRef.current.root.innerHTML);
    formData.append("price", price);
    formData.append("discount", discount);

    if (serviceData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/service/${serviceData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          setServiceData(response.json());
          toast.success("Service updated successfully.", {
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
            errorData.selectedSpaId !== undefined
              ? errorData.selectedSpaId
              : "";
          errorMessage += " ";
          errorMessage +=
            errorData.service !== undefined ? errorData.service : "";
          errorMessage += " ";
          errorMessage +=
            errorData.serviceTime !== undefined ? errorData.serviceTime : "";
          errorMessage +=
            errorData.description !== undefined ? errorData.description : "";
          errorMessage += errorData.price !== undefined ? errorData.price : "";
          errorMessage +=
            errorData.discount !== undefined ? errorData.discount : "";
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
          `https://backendapi.trakky.in/spas/service/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Service added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedSpas("");
          setSelectedCity("");
          setService("");
          setDiscount("");
          setPrice("");
          setServiceTime({ days: "", hours: "", minutes: "", seating: "" });
          setSelectedMasterService("not-select");
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
            errorData.selectedSpaId !== undefined
              ? errorData.selectedSpaId
              : "";
          errorMessage += " ";
          errorMessage +=
            errorData.service !== undefined ? errorData.service : "";
          errorMessage += " ";
          errorMessage +=
            errorData.serviceTime !== undefined ? errorData.serviceTime : "";
          errorMessage +=
            errorData.description !== undefined ? errorData.description : "";
          errorMessage += errorData.price !== undefined ? errorData.price : "";
          errorMessage +=
            errorData.discount !== undefined ? errorData.discount : "";
          errorMessage +=
            errorData.non_field_errors !== undefined
              ? errorData.non_field_errors
              : "";
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

  const getMasterServices = async () => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let response = await fetch(
        `https://backendapi.trakky.in/spas/masterservice/`,
        requestOption
      );

      let data = await response.json();

      if (response.ok) {
        setMasterServiceData(data.results);
      } else {
        console.log("Error occured while fetching master service data");
      }
    } catch (error) {
      console.log("Error occured while fetching master service data", error);
    }
  };

  const getSpas = () => {
    const requestOption = {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/spas/spaadmin/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpasData(data);
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
  };

  useLayoutEffect(() => {
    getSpas();
    getMasterServices();
  }, []);

  useEffect(() => {
    if (selectedMasterService !== "not-select") {
      const selectedMasterServiceData = masterServiceData.filter(
        (mservice) => mservice.id == selectedMasterService
      );
      if (selectedMasterServiceData.length > 0) {
        setService(selectedMasterServiceData[0].service_name);
        // setDescription(selectedMasterServiceData[0].description);
        editorRef.current.root.innerHTML =
          selectedMasterServiceData[0].description;
      }
    }
  }, [selectedMasterService]);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {serviceData ? "Update" : "Add"} Services
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
                  setSelectedSpas("");
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
                value={selectedSpas}
                onChange={(selectedSpa) => {
                  setSelectedSpas(selectedSpa);
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
              <label htmlFor="masterservice">Select Master Service</label>
              <select
                name="masterservice"
                id="masterservice"
                required
                disabled={!selectedSpaId}
                value={selectedMasterService || "not-select"}
                onChange={(e) => setSelectedMasterService(e.target.value)}
              >
                <option value="not-select" selected>
                  ---Select---
                </option>
                {masterServiceData?.map((mservice, index) => (
                  <option value={mservice.id} key={index}>
                    {mservice.service_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Service Name</label>
              <input
                disabled
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Enter Service Name"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Description</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>

          {/* <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="service-time">Select Service Time</label>
              <select
                name="service-time"
                id="service-time"
                required
                value={serviceTime || "not-select"}
                onChange={(e) => setServiceTime(e.target.value)}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                <option value="30 min">30 min</option>
                <option value="30 min">45 min</option>
                <option value="60 min">60 min</option>
                <option value="90 min">90 min</option>
                <option value="120 min">120 min</option>
                <option value="180 min">180 min</option>
              </select>
            </div>
          </div> */}

          <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
            <div className="input-box inp-time col-1">
              <label htmlFor="service-time">Total hours</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.hours}
                placeholder="Hours : E.g. 0 , 1 , 2 ... "
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, hours: e.target.value });
                }}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Minutes</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.minutes}
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, minutes: e.target.value });
                }}
                placeholder="Minutes : E.g. 0 , 15 , 30 , 45 , 60 ..."
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Seating</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.seating}
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, seating: e.target.value });
                }}
                placeholder="Seating : E.g. 0 , 1 , 2 .."
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Days</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.days}
                onChange={(e) => {
                  // setServiceTime({ days: "", : "", minutes: "", seating: "" });
                  setServiceTime({ ...serviceTime, days: e.target.value });
                }}
                placeholder="Days : E.g. 0 , 1 , 2 ..."
              />
            </div>
          </div>

          <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 ">
            <div className="input-box inp-discount col-1 ">
              <label htmlFor="discount">Discounted Price</label>
              <input
                type="number"
                name="discount"
                id="discount"
                min={0}
                placeholder="Enter Discount"
                value={discount}
                required
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="input-box inp-price col-1 ">
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

export default AddService;
