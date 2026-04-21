import React, { useState, useEffect, useContext, useRef } from "react";

import Modal from "./UpdateModal";
import UpdatePriority from "./Forms/UpdatePriority";
import { ChangePriority } from "./Forms/UpdatePriority";
import AuthContext from "../Context/AuthContext";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import toast, { Toaster } from "react-hot-toast";
import "./css/spaelist.css";

import GeneralModal from "./generalmodal/GeneralModal";

import { useSearchParams } from "react-router-dom";

const CityAndAreaPriority = () => {
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

  const [spasData, setSpasData] = useState([]);
  const [ChangePriorityFormOpened, setChangePriorityFormOpened] =
    useState(null);
  const [priorityFormOpened, setPriorityFormOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [totalSpas, setTotalSpas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = React.useState([]);
  const [selectedCityName, setSelectedCityName] = React.useState("");
  const [availableAreaName, setAvailableAreaName] = React.useState([]);
  const [cityPayloadData, setCityPayloadData] = React.useState(null);
  const [selectedAreaName, setSelectedAreaName] = React.useState("");
  const [apiResponse, setApiResponse] = React.useState(false);

  const abortControllerRef = useRef(new AbortController());
  const getSpas = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/?page=${page}`;

      setLoading(true);
      setPriorityFormOpened(null);

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSpasData(data.results);
        setTotalSpas(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.name !== "AbortError") {
        console.error(error);
        toast.error(`Error: ${error.message}`, {
          duration: 4000,
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

  const tableHeaders = [
    "Change Priority",
    "City",
    "City Priority",
    "Area",
    "Area Priority",
    "Name",
    "Phone No.",
    "Address",
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
  }, [page, selectedCityName, selectedAreaName]);

  const handleSearch = async ({ city, area, pageCount }) => {
    let url = `https://backendapi.trakky.in/spas/?page=${pageCount}`;

    if (city) {
      url = url + `&city=${city}`;
    }

    if (area) {
      url = url + `&area=${area}`;
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();

      if (selectedAreaName) {
        // sort by area priority
        data.results.sort((a, b) => a.area_priority - b.area_priority);
      }

      setSpasData(data.results);
      setTotalSpas(data.count);
      if (scrollTopRef.current) {
        scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.name !== "AbortError") {
        toast.error(`Error: ${error.message}`, {
          duration: 4000,
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

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSpas / spasPerPage);

  // if city is selected than add shift priority in table header from top
  if (selectedCityName || selectedAreaName) {
    tableHeaders.unshift("Shift Priority");
  }

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/city/`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCityPayloadData(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCityName(city);
    } catch (error) {
      console.error(error);
      toast.error(`Error : ${error.message}`, {
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

  useEffect(() => {
    getCity();
  }, []);

  function getAreaNames(cityName) {
    if (!cityName) {
      return cityPayloadData?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      cityPayloadData?.forEach((city) => {
        if (city.name === cityName) {
          selectedAreas = city.area_names;
        }
      });
      return selectedAreas;
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
    setPage(1);
    setSelectedCityName(event.target.value);
    updateCityQueryParam(event.target.value);
  };

  const handleAreaFilter = (event) => {
    setPage(1);
    setSelectedAreaName(event.target.value);
    updateAreaQueryParam(event.target.value);
  };

  // const moveRow = (index, offset) => {
  //   const targetIndex = index + offset;
  //   if (targetIndex < 0 || targetIndex >= spasData?.length) return;

  //   const temp = spasData[index];
  //   spasData[index] = spasData[targetIndex];
  //   spasData[targetIndex] = temp;

  //   const spa1 = spasData[index];
  //   const spa2 = spasData[targetIndex];

  //   let priorityKey =
  //     selectedCityName && !selectedAreaName ? "priority" : "area_priority";
  //   if (selectedCityName && selectedAreaName) {
  //     priorityKey = "area_priority";
  //   }

  //   const priority1 = spa1[priorityKey];
  //   const priority2 = spa2[priorityKey];

  //   spa1[priorityKey] = priority2;
  //   spa2[priorityKey] = priority1;

  //   const confirm = window.confirm(
  //     `Are you sure you want to change the priority of ${spa1.name} and ${spa2.name}`
  //   );

  //   if (confirm) {
  //     handleShiftPriority(spa1, spa2);
  //     if (apiResponse) {
  //       setSpasData([...spasData]);
  //     }
  //   }
  // };
  const moveRow = (index, offset) => {
    const direction = offset === -1 ? "up" : "down";
    const spa1 = spasData[index];

    const confirm = window.confirm(
      `Are you sure you want to change the priority.`
    );
    if (confirm) {
      handleShiftPriority(spa1, direction);
      if (apiResponse) {
        setSpasData([...spasData]);
      }
    }
  };

  const handleShiftPriority = async (spa1, direction) => {
    setApiResponse(false);
    const formData = new FormData();
    if (selectedCityName && !selectedAreaName) {
      formData.append("change_priority", true);
    } else if (selectedAreaName && !selectedCityName) {
      formData.append("change_area_priority", true);
    } else if (selectedAreaName && selectedCityName) {
      formData.append("change_area_priority", true);
    }
    if (direction === "up") {
      formData.append("up", true);
    } else {
      formData.append("down", true);
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${spa1.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );
      if (!response.ok) {
        // Handle non-200 HTTP status codes
        const errorData = await response.json();
        if (
          response.status === 401 &&
          errorData.detail === "Authentication credentials were not provided."
        ) {
          alert("You're logged out");
          logoutUser();
        } else {
          // Handle other errors
          throw new Error(errorData.error || "Something went wrong");
        }
      }
      setApiResponse(true);
      const responseData = await response.json();
      console.log("Response message: ", responseData.message);
      if (response.ok) {
        toast.success("Priority Changed Successfully.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        handleSearch({
          city: selectedCityName,
          area: selectedAreaName,
          pageCount: page,
        });
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message, {
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
            </div>

            <div className="tb-add-item">
              <button onClick={() => setPriorityFormOpened(true)}>
                <SwapHorizontalCircleIcon />
                <div> Exchange Priority</div>
              </button>
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
                ) : spasData?.length > 0 ? (
                  spasData?.map(
                    (spa, index) => {
                      return (
                        <>
                          <tr key={index}>
                            {(selectedCityName || selectedAreaName) && (
                              <td
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <NorthIcon
                                  style={{ width: "50%", cursor: "pointer" }}
                                  onClick={() => moveRow(index, -1)}
                                />
                                <SouthIcon
                                  style={{ width: "50%", cursor: "pointer" }}
                                  onClick={() => moveRow(index, 1)}
                                />
                              </td>
                            )}

                            <td>
                              {" "}
                              <LowPriorityIcon
                                onClick={() => {
                                  setChangePriorityFormOpened(index);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                            <td>{spa.city}</td>
                            <td>{spa.priority}</td>
                            <td>{spa.area}</td>
                            <td>{spa.area_priority}</td>
                            <td>{spa.name}</td>
                            <td>{spa.mobile_number}</td>
                            <td className="address-field-s">{spa.address}</td>
                          </tr>
                          {ChangePriorityFormOpened === index && (
                            <tr key={index}>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() =>
                                    setChangePriorityFormOpened(null)
                                  }
                                >
                                  <ChangePriority
                                    spaData={spa}
                                    // getSpas={getSpas}
                                    closeModal={() =>
                                      setChangePriorityFormOpened(null)
                                    }
                                    handleRefreshData={() =>
                                      handleSearch({
                                        city: selectedCityName,
                                        area: selectedAreaName,
                                        pageCount: page,
                                      })
                                    }
                                  />
                                </Modal>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    }
                    // )
                  )
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

          <GeneralModal
            open={priorityFormOpened}
            handleClose={() => setPriorityFormOpened(false)}
            backgroundColor="transparent"
          >
            <UpdatePriority
              closeModal={() => setPriorityFormOpened(false)}
              getSpas={getSpas}
              handleRefreshData={() =>
                handleSearch({
                  city: selectedCityName,
                  area: selectedAreaName,
                  pageCount: page,
                })
              }
            />
          </GeneralModal>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {spasData?.length} of {totalSpas} entries
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
    </>
  );
};

export default CityAndAreaPriority;
