import React, { useContext, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import DailyUpdates from "./Forms/DailyUpdates";
import { FaEdit } from "react-icons/fa";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";

import { getCity, getAreaNames } from "./generalFunctions/api";

const DailyUpdateList = () => {
  const scrollTopRef = useRef(null);

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterField, setFilterField] = useState("name");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);

  const [dailyUpdateData, setDailyUpdateData] = useState([]);

  // edit image

  const [categories_id, setCategoriesId] = useState("");
  const [service_name, setServiceName] = useState("");
  const [img, setImg] = useState("");
  const [client_work_id, setClientWorkId] = useState("");

  const [dailyEditData, setDailyEditData] = useState({});

  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [cityOnceSelected, setCityOnceSelected] = useState(false);

  useEffect(() => {
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    try {
      const { cityPayloadData, cityName } = await getCity();
      setCityPayloadData(cityPayloadData);
      setCityName(cityName);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const selectedAreas = getAreaNames(cityPayloadData, selectedCityName);
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  const getSalons = async (city, area) => {
    try {
      let url = "https://backendapi.trakky.in/salons/";
      if (city !== "" && area !== "") {
        url += `?page=${page}&area=${area}&city=${city}`;
      } else if (city !== "") {
        url += `?page=${page}&city=${city}`;
      } else {
        url += `?page=${page}`;
      }

      setLoading(true);

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setSalonsData(data.results);
        setTotalSalons(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      } else if (response.status === 401) {
        // Unauthorized access
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
        // Other errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch salons. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  const tableHeaders = [
    "Priority",
    "salon Name",
    "City",
    "Area",
    "Phone No.",
    "Address",
    "Daily Updates",
  ];

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleCityFilter = (event) => {
    setSelectedAreaName("");
    setCityOnceSelected(true);
    setSelectedCityName(event.target.value);
    getSalons(event.target.value, "");
  };

  const handleAreaFilter = (event) => {
    setSelectedAreaName(event.target.value);
    getSalons(selectedCityName, event.target.value);
  };

  const handleSearch = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/${"search" + filterField.trim()
        }/?search=${searchTerm.trim()}&page=${page}`;

      setLoading(true);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setSalonsData(data.results);
        setTotalSalons(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      } else if (response.status === 401) {
        // Unauthorized access
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
        // Other errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to perform search. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSalons / spasPerPage);

  useEffect(() => {
    if (searchTerm !== "") {
      handleSearch();
    } else {
      getSalons(selectedCityName, selectedAreaName);
    }
  }, [page]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  const getDailyUpdates = async (id, pageCount = 1) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/daily-updates/?salon_id=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (res.status === 200) {
        const data = await res.json();

        // Check if the response is an array (multiple updates) or single object
        if (Array.isArray(data)) {
          setDailyUpdateData(data);
        } else if (data && typeof data === 'object') {
          // If single object, wrap it in an array
          setDailyUpdateData([data]);
        } else {
          setDailyUpdateData([]);
        }
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to get daily updates. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setDailyUpdateData([]);
    }
  };

  const handleDeleteDailyUpdate = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/daily-updates/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        getSalons(selectedCityName, selectedAreaName);
        toast.success("Daily Update Post Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowModal(false);
        setDailyUpdateData([]);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to delete daily update post. Please try again later.",
        {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
    }
  };

  const handleEditDetails = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("category", categories_id);
    formData.append("service", service_name);
    if (img) {
      formData.append("client_image", img);
    }

    try {
      await fetch(
        `https://backendapi.trakky.in/salons/client-image/${client_work_id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      )
        .then((result) => {
          return result.json();
        })
        .then((resp) => {
          alert("Daily Update Updated Successfully");

          setShowEditModal(false);
          getSalons(selectedCityName, selectedAreaName);
          setShowModal(false);
          setDailyUpdateData([]);
        });
    } catch (error) {
      alert("Error occured", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
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
                      disabled={!selectedCityName}
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
                <div className="tb-body-search">
                  <div className="tb-search-field">
                    <input
                      type={
                        filterField === "mobilenumber" ||
                          filterField === "priority"
                          ? "number"
                          : "text"
                      }
                      name="search-inp"
                      placeholder="Search Salon Name.."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={
                        page === 1
                          ? handleSearch
                          : () => {
                            setPage(1);
                          }
                      }
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/adddailyupdates">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
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
                    <td colSpan={5}>
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
                ) : salonsData && salonsData?.length > 0 ? (
                  salonsData?.map((salon, index) => {
                    return (
                      <>
                        <tr>
                          <td>{salon?.priority}</td>
                          <td>{salon?.name}</td>
                          <td>{salon?.city}</td>
                          <td>{salon?.area}</td>
                          <td>{salon?.mobile_number}</td>
                          <td className="address-field-s">{salon?.address}</td>
                          <td>
                            <span
                              className="view-icon"
                              onClick={async () => {
                                await getDailyUpdates(salon?.id);
                                setModalData(salon);
                                setShowModal(true);
                              }}
                            >
                              <VisibilityIcon />
                            </span>
                          </td>
                        </tr>
                      </>
                    );
                  })
                ) : (
                  <tr className="not-found">
                    <td colSpan={5}>
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
            Showing {salonsData.length} of {totalSalons} entries
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
        open={showModal}
        handleClose={() => {
          setShowModal(false);
          setDailyUpdateData([]);
        }}
      >
        <div>
          <h2 className="CWP-modal-spa-dht">Daily Updates</h2>
          <div className="CWP-modal-spa-details">
            <table>
              <tr>
                <th className="min-w-[170px]">Name</th>
                <td style={{ textAlign: "start" }}>: {modalData?.name}</td>
              </tr>
              <tr>
                <th>Phone number</th>
                <td style={{ textAlign: "start" }}>: {modalData?.mobile_number}</td>
              </tr>
            </table>
          </div>
          <hr />
          {dailyUpdateData?.length > 0 ? (
            <div className="CWP-modal-room-images">
              <table>
                <thead>
                  <tr>
                    <th className="px-3">Daily Update image</th>
                    <th className="px-3">Description</th>
                    <th className="px-3">Edit</th>
                    <th className="px-3">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyUpdateData.map((updatesData, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={updatesData?.daily_update_img}
                          alt="Daily Updates"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{updatesData?.daily_update_description || " - "}</td>
                      <td>
                        <FaEdit
                          onClick={() => {
                            setDailyEditData({
                              ...updatesData,
                              salon_name: modalData?.name,
                            });
                            setShowEditModal(true);
                          }}
                          style={{ margin: "auto", cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <span
                          onClick={() => {
                            handleDeleteDailyUpdate(updatesData?.id);
                          }}
                        >
                          <DeleteIcon style={{ cursor: "pointer" }} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="CWP-room-images">
              <h3 style={{ textAlign: "center", paddingBlock: "20px" }}>
                No Updates Found
              </h3>
            </div>
          )}
        </div>
      </GeneralModal>
      <GeneralModal
        open={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <DailyUpdates
          dailyData={dailyEditData}
          closeModal={() => {
            setShowEditModal(false);
            getSalons(selectedCityName, selectedAreaName);
            setShowModal(false);
            setDailyUpdateData([]);
          }}
        />
      </GeneralModal>
    </>
  );
};

export default DailyUpdateList;
