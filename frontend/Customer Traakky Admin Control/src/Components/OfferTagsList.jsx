import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddOfferTags from "./Forms/AddOfferTags";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

import "./css/salonelist.css";

const OfferTags = () => {
  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [cityOnceSelected, setCityOnceSelected] = useState(false);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [filteredOfferTags, setFilteredOfferTags] = useState([]);
  const [offerTags, setOfferTags] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (updateFormOpened === null) {
      getOfferTags(selectedCityName, selectedAreaName);
    }
  }, [updateFormOpened]);

  useEffect(() => {
    console.log("selectedCityName2 : ", selectedCityName);
    if (selectedCityName !== undefined && cityOnceSelected === true) {
      getOfferTags(selectedCityName, selectedAreaName);
    }
  }, [selectedCityName, selectedAreaName]);

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
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  useEffect(() => {
    getCity();
  }, []);

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

  const getOfferTags = async (city, area) => {
    console.log("city : ", city);
    console.log("area : ", area);
    setLoading(true);
    let url;
    if (city !== "" && area !== "") {
      url = `https://backendapi.trakky.in/salons/salon-offer-tags/?city=${city}&area=${area}`;
    } else if (city !== "") {
      url = `https://backendapi.trakky.in/salons/salon-offer-tags/?city=${city}`;
    } else {
      url = `https://backendapi.trakky.in/salons/salon-offer-tags/`;
    }
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
        setOfferTags(data);
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

  const deleteOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon-offer-tags/${offerId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setOfferTags(offerTags.filter((p) => p.id !== offerId));
        toast.success("Offer Deleted Successfully !!", {
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

  const tableHeaders = ["Name", "Slug", "City", "Area", "Offer Tag", "Actions"];

  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleCityFilter = (event) => {
    setSelectedAreaName("");
    setCityOnceSelected(true);
    setSelectedCityName(event.target.value);
  };

  const handleAreaFilter = (event) => {
    setSelectedAreaName(event.target.value);
  };

  const handleSearch = () => {
    const filteredOfferTags = offerTags.filter((service) => {
      switch (searchOption) {
        case "Search Salon":
          return service.salon_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search offer tag":
          return service.offer_tag
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredOfferTags(filteredOfferTags);
  };

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
                  <option value="Search offer tag">Search Offer Tag</option>
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
              <Link to="/addoffertags">
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
                  filteredOfferTags.length === 0 ? (
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
                    filteredOfferTags.map((service, index) => (
                      <>
                        <tr key={index}>
                          <td>{service.salon_name}</td>
                          <td>{service.salon_slug}</td>
                          <td>{service.salon_city}</td>
                          <td>{service.salon_area}</td>
                          <td>{service.offer_tag}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteOffer(service.id)}
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
                                <AddOfferTags
                                  offerTags={service}
                                  setOfferTags={(data) => {
                                    setOfferTags(
                                      offerTags.map((service) =>
                                        service.id === data.id ? data : service
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                  closeModal={() => setUpdateFormOpened(null)}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )
                ) : offerTags.length === 0 ? (
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
                  offerTags.map((service, index) => (
                    <>
                      <tr key={index}>
                        <td>{service.salon_name}</td>
                        <td>{service.salon_slug}</td>
                        <td>{service.salon_city}</td>
                        <td>{service.salon_area}</td>
                        <td>{service.offer_tag}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteOffer(service.id)}
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
                              <AddOfferTags
                                offerTags={service}
                                setOfferTags={(data) => {
                                  setOfferTags(
                                    offerTags.map((service) =>
                                      service.id === data.id ? data : service
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                                closeModal={() => setUpdateFormOpened(null)}
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
    </>
  );
};

export default OfferTags;
