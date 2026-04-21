import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";

const PackageForm = ({ packages, setPackages, closeMOdal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [actualPrice, setActualPrice] = useState(packages?.actual_price || 0);
  const [discountedPrice, setDiscountedPrice] = useState(
    packages?.discount_price || ""
  );
  const [packageName, setPackageName] = useState(packages?.package_name || "");
  const [selectedServices, setSelectedServices] = useState(() => {
    if (packages && packages?.service_included) {
      return packages?.service_included.map((service) => ({
        value: service,
        label: service.service_name,
      }));
    } else {
      return [];
    }
  });

  const [packageTime, setPackageTime] = useState(
    packages?.package_time || {
      days: null,
      hours: null,
      minutes: null,
      seating: null,
    }
  );
  const [selectedCity, setSelectedCity] = useState(
    packages?.service_included[0].city || ""
  );
  const [city, setCity] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (packages) {
      return {
        value: packages?.salon,
        label: packages?.salon_name,
      };
    } else {
      return null;
    }
  });

  const [selectSalonId, setSelectSalonId] = useState(
    packages?.service_included[0].salon || ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !packageTime?.days &&
      !packageTime?.hours &&
      !packageTime?.minutes &&
      !packageTime?.seating
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
    formData.append("package_name", packageName);
    formData.append("salon", selectSalonId);
    formData.append("discount_price", discountedPrice);
    formData.append(
      "package_time",
      JSON.stringify({
        days: packageTime?.days || 0,
        hours: packageTime?.hours || 0,
        minutes: packageTime?.minutes || 0,
        seating: packageTime?.seating || 0,
      })
    );
    selectedServices.forEach((service) => {
      formData.append("service_included", service.value.id);
    });
    let method, url;
    if (packages !== undefined) {
      method = "PATCH";
      url = `https://backendapi.trakky.in/salons/packages/${packages.id}/`;
    } else {
      method = "POST";
      url = `https://backendapi.trakky.in/salons/packages/`;
    }
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });
      if (packages) {
        if (response.status === 200) {
          toast.success("Package Updated Successfully !!", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });

          let data = await response.json();
          closeMOdal();
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
          toast.success("Package added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          setSelectedSalons(null);
          setPackageName("");
          setDiscountedPrice("");
          setActualPrice(0);
          setSelectedServices([]);
          setSelectedCity("");
          setPackageTime({
            days: null,
            hours: null,
            minutes: null,
            seating: null,
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
      toast.error("Failed to add package. Please try again later.", {
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

  // useEffect(() => {
  //   setSelectedServices([]);
  // }, [selectedCity]);

  useEffect(() => {
    if (selectSalonId) {
      // setSelectedServices([]);
      getServices(selectSalonId);
    }
  }, [selectSalonId]);

  useEffect(() => {
    let totalPrice = 0;
    selectedServices.forEach((service) => {
      totalPrice += service.value.price;
    });
    setActualPrice(totalPrice);
  }, [selectedServices]);

  const getServices = async (salonId) => {
    if (!salonId) {
      return;
    }

    try {
      let url = `https://backendapi.trakky.in/salons/service/?salon_id=${salonId}`;

      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, requestOption);

      if (response.status === 200) {
        const data = await response.json();
        setServicesData(data?.results);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      toast.error(`Error occurred while fetching master services`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#FFFFFF",
        },
      });
    }
  };
  const loadServices = async (inputValue, callback) => {
    try {
      if (!inputValue) {
        // If input value is empty, return all service data
        const options = servicesData.map((service) => ({
          value: service,
          label: service.service_name,
        }));
        callback(options);
      } else {
        const filteredData = servicesData.filter((service) =>
          service.service_name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const options = filteredData.map((service) => ({
          value: service,
          label: service.service_name,
        }));
        callback(options);
      }
    } catch (error) {
      console.error("Error loading master services:", error.message);
      callback([]); // Pass an empty array to the callback in case of error
    }
  };

  const defaultOptions = servicesData
    .filter((serviceData) => {
      // Check if the serviceData's id is not present in any of the selectedServices
      return !selectedServices.some(
        (selected) => selected.value.id === serviceData.id
      );
    })
    .map((service) => ({
      value: service,
      label: service.service_name,
    }));

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Service Package</h3>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Package Name</label>
              <input
                type="text"
                name="package-name"
                id="package-name"
                placeholder="Enter Package Name"
                required
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </div>
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
                  setSelectedServices([]);
                  setServicesData([]);
                  setActualPrice(0);
                  setDiscountedPrice("");
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
                  setSelectedServices([]);
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
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="services">Select Services</label>
              <AsyncSelect
                isMulti
                defaultOptions={defaultOptions}
                loadOptions={loadServices}
                value={selectedServices}
                onChange={(selectedOptions) => {
                  setSelectedServices(selectedOptions);
                }}
                noOptionsMessage={() => "No Service found"}
                placeholder="Search Service..."
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
              <label htmlFor="service-name">Actual Price</label>
              <input
                type="text"
                name="actual-price"
                id="actual-price"
                placeholder={actualPrice}
                disabled
                onChange={(e) => setActualPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Discounted Price</label>
              <input
                type="number"
                name="discounted-price"
                id="discounted-price"
                placeholder="Enter Discounted Price"
                required
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
            </div>
          </div>
          <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
            <div className="input-box inp-time col-1">
              <label htmlFor="service-time">Total Hours</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={packageTime?.hours}
                placeholder="Hours: E.g. 0 , 1 , 2 ... "
                onChange={(e) => {
                  setPackageTime({ ...packageTime, hours: e.target.value });
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
                value={packageTime?.minutes}
                onChange={(e) => {
                  setPackageTime({ ...packageTime, minutes: e.target.value });
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
                value={packageTime?.seating}
                onChange={(e) => {
                  setPackageTime({ ...packageTime, seating: e.target.value });
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
                type="number"
                name="service-time"
                id="service-time"
                value={packageTime?.days}
                onChange={(e) => {
                  setPackageTime({ ...packageTime, days: e.target.value });
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
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PackageForm;
