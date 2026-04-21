import React, {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
} from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Switch } from "@mui/material";

import toast, { Toaster } from "react-hot-toast";
import RefreshIcon from '@mui/icons-material/Refresh';  // Import the icon
import CircularProgress from '@mui/material/CircularProgress';

const AddService = ({ serviceData, setServiceData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nextPage, setNextPage] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [service, setService] = useState(serviceData?.service_name || "");
  const [selectSalonId, setSelectSalonId] = useState(serviceData?.salon || []);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (serviceData) {
      return (
        {
          value: serviceData?.salon,
          label: serviceData?.salon_name,
        } || []
      );
    } else {
      return [];
    }
  });
  const [discount, setDiscount] = useState(serviceData?.discount || "");
  const [price, setPrice] = useState(serviceData?.price || "");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(serviceData?.categories || null);

  // new serch salon

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(serviceData?.city || "");
  const [city, setCity] = useState([]);

  const [masterServiceData, setMasterServiceData] = useState([]);
  const [masterServiceId, setMasterServiceId] = useState(
    serviceData?.master_service || ""
  );

  const [serviceTime, setServiceTime] = useState(
    serviceData?.service_time || {
      days: null,
      hours: null,
      minutes: null,
      seating: null,
    }
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    // Start the loading spinner
    setIsRefreshing(true);
    toast.loading("Refreshing categories...");
    try {
      // Reset fields
      setCategoryId("");
      setMasterServiceId("");
      editorRef.current.root.innerHTML = "";

      // Fetch updated category list from API
      await getCategories(selectSalonId, false);
      toast.dismiss();
      toast.success("Categories refreshed successfully.");

    } catch (error) {
      console.error("Error refreshing categories:", error);
      toast.dismiss();
      toast.error("Failed to refresh categories.");
    } finally {
      // Stop the loading spinner
      setIsRefreshing(false);
    }
  };


  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
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

  useEffect(() => {
    if (serviceData) {
      getCategories(selectSalonId, true);
      // getMasterServices(categoryId);
    }
  }, []);

  const handleSwitchChangeHours = () => {
    setIsEnabled1((prevState) => {
      const newState = !prevState;
      if (newState && !serviceTime.hours) {
        setServiceTime({ ...serviceTime, hours: 0 });
      }
      return newState;
    });
  };

  const handleSwitchChangeSeating = () => {
    setIsEnabled((prevState) => {
      const newState = !prevState;
      if (newState && !serviceTime.seating) {
        setServiceTime({ ...serviceTime, seating: 0 });
      }
      return newState;
    });
  };

  const cleanContent = (content) => {
    return content
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/(?:\r\n|\r|\n)+/g, '<br>') // Replace multiple new lines with a single <br>
      .replace(/<p><\/p>/g, '') // Remove empty paragraph tags
      .replace(/<br\s*\/?>/g, '') // Remove <br> tags
      .trim(); // Trim leading and trailing whitespace
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

    const description = editorRef.current.root.innerHTML; // Get the description
    const cleanedDescription = cleanContent(description);

    const formData = new FormData();
    if (serviceData) {
      formData.append("salon", selectSalonId);
    } else {
      for (var i = 0; i < selectSalonId.length; i++) {
        formData.append("salon_ids", selectSalonId[i]);
      }
    }
    formData.append("description", cleanedDescription);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("categories", categoryId);
    formData.append(
      "service_time",
      JSON.stringify({
        days: serviceTime?.days || 0,
        hours: isEnabled1 ? serviceTime?.hours || 0 : 0,
        minutes: serviceTime?.minutes || 0,
        seating: isEnabled ? serviceTime?.seating || 0 : 0,
      })
    );
    formData.append("master_service", masterServiceId);

    if (serviceData) {
      try {
        let response = await fetch(
          `https://backendapi.trakky.in/salons/service/${serviceData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.status === 401) {
          toast.error("You're logged out", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
          logoutUser();
        } else if (response.status === 200) {
          let data = await response.json();
          setServiceData(data);
          toast.success("Service updated successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "green",
              color: "#FFFFFF",
            },
          });
        } else if (response.status === 400) {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(
            `Error : This master service is already associated with this salon.`,
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#FFFFFF",
              },
            }
          );
        } else if (response.status === 409) {
          const responseData = await response.json();
          const errorMessage =
            responseData.error ||
            `Error : ${response.status} - ${response.statusText}`;
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
        } else {
          console.error(`Error : ${response.status} - ${response.statusText}`);
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
        console.error("Error occured : ", error);
        toast.error("Error occured : ", error, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "red",
            color: "#FFFFFF",
          },
        });
      }
    } else {
      try {
        let response = await fetch(
          `https://backendapi.trakky.in/salons/service/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );

        if (response.status === 401) {
          toast.error("You're logged out", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
          logoutUser();
        } else if (response.status === 201) {
          let data = await response.json();
          toast.success("Service added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "green",
              color: "#FFFFFF",
            },
          });
          setMasterServiceId("");
          setService("");
          setPrice("");
          setDiscount("");
          editorRef.current.root.innerHTML = "";
        } else if (response.status === 400) {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(
            `Error : This master service is already associated with this salon.`,
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#FFFFFF",
              },
            }
          );
        } else if (response.status === 409) {
          const responseData = await response.json();
          const errorMessage =
            responseData.error ||
            `Error : ${response.status} - ${response.statusText}`;
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
        } else {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(`Error `, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
        }
      } catch (error) {
        toast.error("Error occured : ", error, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "red",
            color: "#FFFFFF",
          },
        });
      }
    }
  };

  const getCategories = (selectSalonIds, single) => {
    const requestOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };
    let salonIdsQueryString;
    if (single === true) {
      salonIdsQueryString = selectSalonId;
    } else {
      salonIdsQueryString = selectSalonIds.join(",");
    }

    fetch(
      `https://backendapi.trakky.in/salons/category/?salon_id=${salonIdsQueryString}`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => {
        setCategoryList(data);
      })
      .catch((err) => alert(err));
  };

  const getMasterServices = async (masterCategoryId) => {
    if (!masterCategoryId) {
      return;
    }

    try {
      let url = `https://backendapi.trakky.in/salons/masterservice/?categories=${masterCategoryId}`;

      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, requestOption);

      if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else if (response.status === 200) {
        const data = await response.json();
        setNextPage(data?.next);
        setMasterServiceData(data?.results);
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
      toast.error(`Error occured while fetching master services`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#FFFFFF",
        },
      });
    }
  };

  useEffect(() => {
    if (selectSalonId.length > 0) {
      getCategories(selectSalonId);
    }
  }, [selectSalonId]);

  useEffect(() => {
    let selectedCategory = categoryList.find(
      (item) => item.id === parseInt(categoryId)
    );

    getMasterServices(selectedCategory?.master_category_id);
  }, [categoryId, categoryList]);

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

    // Add listener for cleaning up input on text change
    editorRef.current.on('text-change', () => {
      const content = editorRef.current.root.innerHTML;
      const cleanedContent = cleanContent(content);

      if (cleanedContent !== content) {
        editorRef.current.root.innerHTML = cleanedContent;

        // Get the current selection
        const range = editorRef.current.getSelection();
        if (range) {
          editorRef.current.setSelection(range.index, 0); // Move cursor to the end
        } else {
          // If no selection exists, set it to the end of the content
          const length = editorRef.current.getLength();
          editorRef.current.setSelection(length - 1, 0);
        }
      }
    });

  }, []);

  const fetchMoreServices = async () => {
    if (nextPage === null) {
      return;
    }
    try {
      const response = await fetch(nextPage);
      if (!response.ok) {
        throw new Error("Failed to fetch more services");
      }
      const data = await response.json();
      setMasterServiceData((prevData) => [...prevData, ...data.results]);
      setNextPage(data?.next || null);
    } catch (error) {
      console.error("Error fetching more services:", error);
    }
  };

  useEffect(() => {
    if (nextPage !== null) {
      fetchMoreServices();
    }
  }, [nextPage]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedSalons(selectedOptions);
    setSelectSalonId(selectedOptions.map((option) => option.value));
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {serviceData ? "Update" : "Add"} Service
            </h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={serviceData !== undefined}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setCategoryList([]);
                  setCategoryId("");
                  setMasterServiceId("");
                  editorRef.current.root.innerHTML = "";
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
                isDisabled={serviceData !== undefined}
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                onChange={handleSelectChange}
                value={selectedSalons}
                placeholder="Search salons"
                noOptionsMessage={() => "Enter name to search salons"}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="category">
                Select Category
                <span className="Note_Inp_Classs">
                  Make Sure Selected Category Present In Selected Salon
                </span>
              </label>
              <div className="flex gap-2">
                <select
                  name="category"
                  id="category"
                  required
                  disabled={!selectedSalons}
                  value={categoryId || "not-select"}
                  onChange={(e) => {
                    setMasterServiceId("");
                    editorRef.current.root.innerHTML = "";
                    setCategoryId(e.target.value);
                  }}
                  style={{ flexGrow: 1, display: 'flex', }}
                >
                  <option value="not-select" disabled hidden>
                    ---Select---
                  </option>

                  {categoryList.map((category, index) => (
                    <option value={category.id} key={index}>
                      {category.category_name +
                        " ( " +
                        category.category_gender +
                        " ) " +
                        " ( " +
                        category.city +
                        " )"}
                    </option>
                  ))}
                </select>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  className={`border p-1 border-slate-400 rounded-md ${isRefreshing ? 'bg-gray-400' : ''}`}
                  disabled={selectSalonId.length === 0 || isRefreshing} // Disable if no salon selected or loading
                >
                  {isRefreshing ? (
                    <CircularProgress size={20} /> // Show loading spinner
                  ) : (
                    <RefreshIcon /> // Show refresh icon when not loading
                  )}
                </button>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="service">
                Select Service {/* <span className="Note_Inp_Classs"></span> */}
              </label>
              <select
                name="service"
                id="service"
                required
                disabled={!categoryId}
                value={masterServiceId || "not-select"}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  editorRef.current.root.innerHTML =
                    selectedOption.getAttribute("description");
                  setMasterServiceId(e.target.value);
                }}
              >
                <option value="not-select" selected>
                  ---Select---
                </option>

                {masterServiceData &&
                  masterServiceData.map((service, index) => (
                    <option
                      value={service.id}
                      key={index}
                      description={service.description}
                    >
                      {service.service_name + " ( " + service.gender + " ) "}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Description</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-price col-1 col-2">
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
                  if (e.target.value <= 0) {
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
            <div className="input-box inp-discount col-1 col-2">
              <label htmlFor="discount">Discount Price</label>
              <input
                type="number"
                name="discount"
                id="discount"
                placeholder="Enter Discount"
                value={discount}
                min={0}
                required
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    e.target.value = 0;
                  }
                  setDiscount(e.target.value);
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

          <div className="row col-2 !gap-4 !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4">
            <div className="input-box inp-time col-1">
              <label htmlFor="service-time" style={{ fontSize: "16px" }}>Total hours
                <Switch
                  checked={!isEnabled1}
                  onChange={handleSwitchChangeHours}
                  color="primary"
                />

              </label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.hours || ""}
                placeholder="Hours : E.g. 0 , 1 , 2 ... "
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, hours: e.target.value });
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
                disabled={!isEnabled1}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Minutes</label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.minutes || ""}
                style={{ marginTop: '5px' }}
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, minutes: e.target.value });
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
              <label htmlFor="service-time" style={{ fontSize: "16px" }}>Total Seating
                <Switch
                  checked={!isEnabled}
                  onChange={handleSwitchChangeSeating}
                  color="primary"
                />
              </label>
              <input
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.seating || ""}
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, seating: e.target.value });
                }}
                placeholder="Seating : E.g. 0 , 1 , 2 .."
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
                disabled={!isEnabled}
              />
            </div>
            <div className="input-box inp-time col-1 ">
              <label htmlFor="service-time">Total Days</label>
              <input
                disabled
                type="number"
                name="service-time"
                id="service-time"
                value={serviceTime?.days || ""}
                style={{ marginTop: '5px' }}
                onChange={(e) => {
                  setServiceTime({ ...serviceTime, days: e.target.value });
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
