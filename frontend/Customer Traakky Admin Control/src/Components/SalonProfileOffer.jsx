import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import AddSalonProfileOffer from "./Forms/AddSalonProfileOffer";
import { FaEdit } from "react-icons/fa";
import Modal from "./UpdateModal";
import "./css/salonelist.css";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import { getCity, getAreaNames } from "./generalFunctions/api";

const SalonProfileOffer = () => {
  const [newPriority, setNewPriority] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [uniqueSalons, setUniqueSalons] = useState([]);
  const [selectedSalonName, setSelectedSalonName] = useState("");
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profileOffers, setProfileOffers] = useState([]);
  const [filteredProfileOffers, setFilteredProfileOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [salonProfileId, setSalonProfileId] = useState("");

  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

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
    console.log(selectedCityName);
    console.log(cityPayloadData);
    const selectedAreas = getAreaNames(cityPayloadData, selectedCityName);
    console.log(selectedAreas);
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  useEffect(() => {
    if (updateFormOpened === null) {
      setSelectedSalonName("");
      getSalonProfileOffer();
    }
  }, [updateFormOpened]);

  useEffect(() => {
    console.log("unique : ", uniqueSalons);
  }, [uniqueSalons]);

  const handleSalons = (event) => {
    setSelectedSalonName(event.target.value);
    getSalonProfileOffer(event.target.value);
    setSelectedAreaName("");
    setSelectedCityName("");
  };

  const getSalonProfileOffer = async (salonName = "", city = "", area = "") => {
    setLoading(true);
    try {
      let url = salonName
        ? `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_name=${encodeURIComponent(
          salonName
        )}`
        : `https://backendapi.trakky.in/salons/salon-profile-offer/`;

      if (city !== "" && area !== "" && !salonName) {
        url += `?city=${encodeURIComponent(city)}&area=${encodeURIComponent(
          area
        )}`;
      } else if (city !== "" && !salonName) {
        url += `?city=${encodeURIComponent(city)}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setProfileOffers(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getUniqueSalons = async () => {
    const url = `https://backendapi.trakky.in/salons/salon-profile-offer/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        const salons = data.map((item) => ({
          id: item.salon,
          name: item.salon_name,
          slug: item.salon_slug,
          area: item.salon_area,
          city: item.salon_city,
        }));

        const uniqueSalonsMap = new Map();
        salons.forEach((salon) => {
          uniqueSalonsMap.set(salon.id, salon);
        });

        const uniqueSalonsArray = Array.from(uniqueSalonsMap.values());

        // Sort salons by name in ascending order
        uniqueSalonsArray.sort((a, b) => a.name.localeCompare(b.name));

        setUniqueSalons(uniqueSalonsArray);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching unique salons:", error);
      toast.error("Failed to fetch unique salons. Please try again later", {
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

  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    getUniqueSalons();
  }, []);

  const deleteSalonProfileOffer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon-profile-offer/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setProfileOffers(profileOffers.filter((p) => p.id !== id));
        toast.success("Deleted Successfully !!", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const tableHeaders = [
    "Priority",
    "Offer Name",
    "Gender",
    "Salon Name",
    "Salon City",
    "Salon Area",
    "Actual Price",
    "Discount Price",
    "Time",
    "Start Date",
    "End Date",
    "Active",
    "Terms and Conditions",
    "Image",
    "Action",
  ];

  if (selectedCityName && selectedCityName !== "") {
    tableHeaders.unshift("Change Priority");
  }

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/salon-profile-offer/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({
            priority: parseInt(priority),
          }),
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
        setSalonProfileId(null);
        getSalonProfileOffer(selectedSalonName);
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setSalonProfileId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setSalonProfileId(null);
    }
  };

  const handleCityFilter = (event) => {
    setSelectedSalonName("");
    setSelectedAreaName("");
    setSelectedCityName(event.target.value);
    getSalonProfileOffer("", event.target.value, "");
  };

  const handleAreaFilter = (event) => {
    setSelectedSalonName("");
    setSelectedAreaName(event.target.value);
    getSalonProfileOffer("", selectedCityName, event.target.value);
  };

  const handleSearch = () => {
    const filteredOffers = profileOffers?.filter((offe) => {
      switch (searchOption) {
        case "Search Salon":
          return offe?.salon_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search offer":
          return offe?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredProfileOffers(filteredOffers);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
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
              </div>
              <div className="tb-body-filter">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option value="Search Salon">Search Salon</option>
                  <option value="Search offer">Search Offer</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    value={searchTerm}
                    placeholder="Search hear.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addsalonprofileoffer">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-start pl-6">
            <p className="text-gray-500 font-bold">(Note : Please first select city then you can change priority)</p>
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
                ) : searchTerm !== "" ? (
                  filteredProfileOffers.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={17}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          No results found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProfileOffers.map((offer, index) => (
                      <>
                        <tr key={index}>
                          {selectedCityName && (
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSalonProfileId(offer.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                          )}
                          <td>{offer.priority}</td>
                          <td>{offer.name}</td>
                          <td>{offer?.gender ? offer.gender : "-"}</td>
                          <td>{offer.salon_name}</td>
                          <td>{offer.salon_city}</td>
                          <td>{offer?.salon_area}</td>
                          <td>{offer.actual_price}</td>
                          <td>{offer.discount_price}</td>
                          <td
                            style={{
                              textAlign: "left",
                            }}
                          >
                            hours : {offer?.offer_time?.hours} <br />
                            minutes : {offer?.offer_time?.minutes} <br />
                            Seating : {offer?.offer_time?.seating} <br />
                            days : {offer?.offer_time?.days} <br />
                          </td>
                          <td>{offer.starting_date}</td>
                          <td>{offer.expire_date}</td>
                          <td>
                            {offer.active_status ? (
                              <span style={{ color: "green" }}>Active</span>
                            ) : (
                              <span style={{ color: "red" }}>Inactive</span>
                            )}
                          </td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: offer.terms_and_conditions,
                              }}
                            />
                          </td>
                          <td>
                            {offer?.image ? (
                              <img
                                src={offer.image}
                                alt={"not found"}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  borderRadius: "5px",
                                  objectFit: "contain",
                                  margin: "0 auto",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteSalonProfileOffer(offer.id)}
                              style={{ cursor: "pointer" }}
                            />
                            &nbsp;&nbsp;
                            <FaEdit
                              onClick={() => setUpdateFormOpened(index)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddSalonProfileOffer
                                  profileOffers={offer}
                                  setProfileOffers={(data) => {
                                    setProfileOffers(
                                      profileOffers.map((offer) =>
                                        offer.id === data.id ? data : offer
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )
                ) : profileOffers.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No Entries
                      </div>
                    </td>
                  </tr>
                ) : (
                  profileOffers.map((offer, index) => (
                    <>
                      <tr key={index}>
                        {selectedCityName && (
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSalonProfileId(offer.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                        )}
                        <td>{offer.priority}</td>
                        <td style={{ minWidth: "150px" }}>{offer.name}</td>
                        <td>{offer?.gender ? offer.gender : "-"}</td>
                        <td>{offer.salon_name}</td>
                        <td>{offer.salon_city}</td>
                        <td>{offer?.salon_area}</td>
                        <td>{offer.actual_price}</td>
                        <td>{offer.discount_price}</td>
                        <td
                          style={{
                            textAlign: "left",
                          }}
                        >
                          hours : {offer?.offer_time?.hours} <br />
                          minutes : {offer?.offer_time?.minutes} <br />
                          Seating : {offer?.offer_time?.seating} <br />
                          days : {offer?.offer_time?.days} <br />
                        </td>
                        <td>{offer.starting_date}</td>
                        <td>{offer.expire_date}</td>
                        <td>
                          {offer.active_status ? (
                            <span style={{ color: "green" }}>Active</span>
                          ) : (
                            <span style={{ color: "red" }}>Inactive</span>
                          )}
                        </td>
                        <td
                          className="description-td-quill"
                          style={{ width: "max-content" }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: offer.terms_and_conditions,
                            }}
                          />
                        </td>
                        <td>
                          {offer?.image ? (
                            <img
                              src={offer.image}
                              alt={"not found"}
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "5px",
                                objectFit: "contain",
                                margin: "0 auto",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteSalonProfileOffer(offer.id)}
                            style={{ cursor: "pointer" }}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setUpdateFormOpened(index)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddSalonProfileOffer
                                profileOffers={offer}
                                setProfileOffers={(data) => {
                                  setProfileOffers(
                                    profileOffers.map((offer) =>
                                      offer.id === data.id ? data : offer
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="tb-body-footer">
        <div className="tb-reasult-count">
          showing {profileOffers?.length} of {profileOffers?.length} entries
        </div>
        {/* <div className="tb-more-results">
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
          </div> */}
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
                handleUpdatePriority(salonProfileId, newPriority);
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

export default SalonProfileOffer;
