import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "./UpdateModal";
import UpdatePriority from "./Forms/UpdatePriority";
import { ChangePriority } from "./Forms/UpdatePriority";
import AuthContext from "../Context/AuthContext";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import toast, { Toaster } from "react-hot-toast";

import "./css/salonelist.css";

import GeneralModal from "./generalModal/GeneralModal";

import { useSearchParams } from "react-router-dom";

const Academy = () => {
  const scrollTopRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("city")) {
      setSelectedCityName(searchParams.get("city"));
    }
    if (searchParams.get("area")) {
      setSelectedAreaName(searchParams.get("area"));
    }
  }, []);

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [ChangePriorityFormOpened, setChangePriorityFormOpened] =
    useState(null);
  const [priorityFormOpened, setPriorityFormOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const abortControllerRef = useRef(new AbortController());

  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityCityId, setPriorityCityId] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const tableHeaders = [
    "Change Priority",
    "City",
    "City Priority",
    "Area",
    "Area Priority",
    "Salon Name",
  ];

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  useEffect(() => {
    handleSearch({
      city: selectedCityName,
      area: selectedAreaName,
      pageCount: page,
    });
  }, [page]);
  useEffect(() => {
    if (page === 1) {
      handleSearch({
        city: selectedCityName,
        area: selectedAreaName,
        pageCount: page,
      });
    } else {
      setPage(1);
    }
  }, [selectedCityName, selectedAreaName]);

  const handleSearch = async ({ city, area, pageCount }) => {
    let url = `https://backendapi.trakky.in/salons/salon-academy/?page=${pageCount}`;

    if (city) {
      url += `&city=${city}`;
    }

    if (area) {
      url += `&area=${area}`;
    }

    setLoading(true);
    abortControllerRef.current.abort();

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      if (response.status === 200) {
        let data = await response.json();

        if (selectedAreaName) {
          // sort by area priority
          data.results.sort((a, b) => a.area_priority - b.area_priority);
        }

        setSalonsData(data.results);
        setTotalSalons(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        setLoading(false);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
        });
        setLoading(false);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error during search:", error);
        toast.error("Failed to perform search. Please try again later.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
      setLoading(false);
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      const formData = new FormData();
      // formData.append("priority",parseInt(priority) );
      const payload =
        selectedAreaName !== ""
          ? { area_priority: parseInt(priority) }
          : { priority: parseInt(priority) };

      let res = await fetch(
        `https://backendapi.trakky.in/salons/salon-academy/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify(payload),
        }
      );
      let data = await res.json();
      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityCityId(null);
        if (page === 1) {
          handleSearch({
            city: selectedCityName,
            area: selectedAreaName,
            pageCount: page,
          });
        } else {
          setPage(1);
        }
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityCityId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setPriorityCityId(null);
    }
  };

  const salonsPerPage = 12;
  const totalPages = Math.ceil(totalSalons / salonsPerPage);

  const getCity = async () => {
    try {
      let url = "https://backendapi.trakky.in/salons/city/";

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        const payload = data?.payload || [];
        const cityNames = payload.map((item) => item.name);

        setCityPayloadData(payload);
        setCityName(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error.message);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  function getAreaNames(cityName) {
    try {
      if (!cityPayloadData) {
        throw new Error("City payload data is not available.");
      }

      if (!cityName) {
        return cityPayloadData.flatMap((city) => city?.area_names || []);
      } else {
        const selectedCity = cityPayloadData.find(
          (city) => city.name === cityName
        );
        if (!selectedCity) {
          throw new Error(`City '${cityName}' not found in the payload data.`);
        }
        return selectedCity.area_names || [];
      }
    } catch (error) {
      console.error("Error in getAreaNames function:", error.message);
      return [];
    }
  }

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCityName);

    if (!searchParams.get("area")) {
      setSelectedAreaName("");
    }

    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  const updateCityQueryParam = (newValue) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("city", newValue);
    newParams.delete("area");
    setSearchParams(newParams);
  };

  // Function to add or update the area query parameter
  const updateAreaQueryParam = (newValue) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("area", newValue);
    setSearchParams(newParams);
  };

  const handleCityFilter = (event) => {
    setSelectedCityName(event.target.value);
    updateCityQueryParam(event.target.value);
  };

  const handleAreaFilter = (event) => {
    setSelectedAreaName(event.target.value);
    updateAreaQueryParam(event.target.value);
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-src-input">
                <FormControl
                  FormControl
                  sx={{
                    margin: "8px 2px",
                    minWidth: 100,
                    width: "fit-content",
                  }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCityName}
                    label="Select City"
                    input={<OutlinedInput label="Tag" />}
                    onChange={handleCityFilter}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {cityName?.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="tb-src-input">
                <FormControl
                  FormControl
                  sx={{
                    margin: "8px 2px",
                    minWidth: 100,
                    width: "fit-content",
                  }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">Area</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAreaName}
                    label="Select Area"
                    input={<OutlinedInput label="Tag" />}
                    onChange={handleAreaFilter}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableAreaName?.map((area, index) => (
                      <MenuItem key={index} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  alignSelf: "center",
                  fontStyle: "italic",
                  fontFamily: "sans-serif",
                }}
              >
                Select Area to Change Area's Priority
              </div>
            </div>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={header === "Address" ? "address-field-s" : ""}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Loading
                      </div>
                    </td>
                  </tr>
                ) : salonsData?.length > 0 ? (
                  salonsData?.map((salon, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityCityId(salon.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                          <td>{salon.salon_city}</td>
                          <td>{salon.priority}</td>
                          <td>{salon.salon_area}</td>
                          <td>{salon.area_priority}</td>
                          <td>{salon.salon_name}</td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Not Found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {salonsData?.length} of {totalSalons} entries
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id={parseInt(1)} onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  «
                </span>
              )}
              {page > 2 && (
                <span id={parseInt(page - 2)} onClick={handlePageChange}>
                  {page - 2}
                </span>
              )}
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  {page - 1}
                </span>
              )}
              <span
                id={parseInt(page)}
                onClick={handlePageChange}
                className="active"
              >
                {page}
              </span>
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  {page + 1}
                </span>
              )}
              {page < totalPages - 1 && (
                <span id={parseInt(page + 2)} onClick={handlePageChange}>
                  {page + 2}
                </span>
              )}
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={parseInt(totalPages)} onClick={handlePageChange}>
                »»
              </span>
            </div>
          </div>
        </div>
      </div>
      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => setShowEditPriorityModal(false)}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 0",
          }}
        >
          <center
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Update Priority
          </center>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px  20px",
            }}
          >
            <input
              type="number"
              value={newPriority}
              placeholder="Enter New Priority"
              onChange={(e) => setNewPriority(e.target.value)}
              style={{
                width: "200px",
              }}
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                }
              }}
            />
          </div>
          <div
            className="submit-btn row"
            style={{
              padding: "0 0 20px 0",
              margin: "0",
            }}
          >
            <button
              onClick={() => {
                handleUpdatePriority(priorityCityId, newPriority);
                setShowEditPriorityModal(false);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Academy;
