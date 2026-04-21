import React, { useState, useEffect, useContext, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Switch from "@mui/material/Switch";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AddSpa from "./Forms/SpaForm";
import AuthContext from "../Context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "./css/spaelist.css";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

// multi select
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import GeneralModalTimings from "./generalmodal/GeneralModalTimings";
import GeneralModal from "./generalmodal/GeneralModal";

const Spalist = () => {
  const scrollTopRef = useRef(null);

  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const abortControllerRef = useRef(new AbortController());

  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [spasData, setSpasData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("search");

  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSpas, setTotalSpas] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cityName, setCityName] = React.useState([]);

  const [modalSpaID, setModalSpaID] = useState(null);

  const [showIndividualPhotosModal, setShowIndividualPhotosModal] =
    useState(false);
  const [modalImageData, setModalImageData] = useState([]);
  const getSpas = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/?page=${page}`;
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        setSpasData(data.results);
        setTotalSpas(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      } else {
        toast.error(`Something went wrong ! ${response.status}`, {
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
    } catch (error) {
      toast.error(`${error}`, {
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

  const deleteSpa = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this spa?",
      });

      const response = await fetch(`https://backendapi.trakky.in/spas/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      toast.dismiss();
      if (response.status === 204) {
        toast.success("Spa Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "white",
            backgroundColor: "#333",
          },
        });
        getSpas();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined) {
        return;
      }
      toast.error(`Error occured ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const toggle = async (id, formField, currentStatus) => {
    const formData = new FormData();
    const spa = spasData.find((s) => s.id === id);

    formData.append(formField, currentStatus);

    for (var i = 0; i < spa.facilities.length; i++) {
      formData.append("facilities", spa.facilities[i]);
    }

    try {
      await fetch(`https://backendapi.trakky.in/spas/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      }).then((result) => {
        result.json().then((resp) => {
          if (resp.detail === "Authentication credentials were not provided.") {
            alert("You'r logged out");
            logoutUser();
          } else {
            setSpasData(
              spasData.map((spa) =>
                spa.id === id ? { ...spa, [formField]: currentStatus } : spa
              )
            );
            toast.success("Spa Updated Successfully", {
              duration: 4000,
              position: "top-center",
              style: {
                background: "#333",
                color: "#fff",
              },
            });
          }
        });
      });
    } catch (error) {
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const toggleAddAndRemove = async (id, formField, currentStatus) => {
    let url = `https://backendapi.trakky.in/spas/update-spa-categories/`;

    let payload = {
      spa: id,
      category: formField,
      verification: currentStatus,
    };

    try {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Updated Successfully");
        setSpasData(
          spasData.map((spa) =>
            spa.id === id ? { ...spa, [formField]: currentStatus } : spa
          )
        );
      } else {
        toast.error(`Something went wrong : ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error occured ${error}`);
    }
  };

  const tableHeaders = [
    "Priority",
    "Name",
    "Phone No.",
    "Address",
    "Landmark",
    "Close/Open",
    "City",
    "Area",
    "Facilities",
    "Offer Tag",
    "Price",
    "More",
    "Promises",
    "Timings",
    "Verified",
    "Premium",
    "Best Spa",
    "Luxurious",
    "Top Rated",
    "Body Massage spa",
    "Beauty",
    "Body Massage center",
    "Thai Body Massage",
    "Spa for Men",
    "Spa for Women",
    "Action",
  ];

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleSearch = async () => {
    let url = `https://backendapi.trakky.in/spas/?page=${page}`;

    if (selectedCityName.length > 0) {
      url = url + `&city=${selectedCityName.join(",")}`;
    }

    if (selectedAreaName.length > 0) {
      url = url + `&area=${selectedAreaName.join(",")}`;
    }

    if (searchTerm.length > 0) {
      url = url + `&${filterField}=${searchTerm}`;
    }

    setLoading(true);

    abortControllerRef.current.abort();

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      const data = await response.json();

      if (response.status === 200) {
        setSpasData(data.results);
        setTotalSpas(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      }

      setLoading(false);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSpas / spasPerPage);

  useEffect(() => {
    handleSearch();
  }, [page]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  // multi select
  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 5;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [selectedCityName, setSelectedCityName] = React.useState([]);
  const [availableAreaName, setAvailableAreaName] = React.useState([]);
  const [cityPayloadData, setCityPayloadData] = React.useState(null);
  const [selectedAreaName, setSelectedAreaName] = React.useState([]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/spas/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayloadData(data?.payload);
        let city = data?.payload.map((item) => item.name);
        setCityName(city);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getCity();
  }, []);

  function getAreaNames(cityList) {
    if (!cityList.length) {
      return cityPayloadData?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      for (let cityName of cityList) {
        cityName = cityName.toLowerCase();
        for (let city of cityPayloadData) {
          if (city?.name.toLowerCase() === cityName) {
            selectedAreas = selectedAreas?.concat(city.area_names);
            break;
          }
        }
      }
      return selectedAreas;
    }
  }

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCityName);

    if (selectedAreaName.length > 0) {
      setSelectedAreaName([]);
    }

    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  useEffect(() => {
    if (selectedCityName || selectedAreaName) {
      if (page === 1) {
        handleSearch();
      } else {
        setPage(1);
      }
    }
  }, [selectedCityName, selectedAreaName]);

  const handleCityFilter = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCityName(typeof value === "string" ? value.split(",") : value);
  };

  const handleAreaFilter = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAreaName(typeof value === "string" ? value.split(",") : value);
  };

  const deleteMulImage = async (data) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/spa/${data?.spa}/mulimage/${data?.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setShowIndividualPhotosModal(false);
        setModalImageData(null);
        getSpas();

        toast.success("Image deleted successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        // Handle other status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting image:", error);

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

  const deleteMainImage = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${id}/delete_main_image/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setShowIndividualPhotosModal(false);
        setModalImageData(null);
        setModalSpaID(null);
        getSpas();

        toast.success("Main image deleted successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        // Unauthorized error
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
        // Other HTTP errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting main image:", error);

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

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const suffix = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${suffix}`;
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <FormControl sx={{ m: "8px 2px", width: 110 }} size="small">
                <InputLabel id="demo-multiple-checkbox-label">City</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedCityName}
                  onChange={handleCityFilter}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {cityName.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedCityName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: 110 }} size="small">
                <InputLabel id="demo-multiple-checkbox-label">Area</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedAreaName}
                  onChange={handleAreaFilter}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {availableAreaName?.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={selectedAreaName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: "8px 2px", minWidth: 110 }} size="small">
                <InputLabel id="demo-select-small-label">Type</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={filterField}
                  label="Type"
                  onChange={(e) => setFilterField(e.target.value)}
                >
                  <MenuItem value={"search"}>name</MenuItem>
                  {/* <MenuItem value={"priority"}>priority</MenuItem> */}
                  <MenuItem value={"mobile_number"}>mobilenumber</MenuItem>
                </Select>
              </FormControl>
              {/* <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}>
                  <option value={"name"}> Name</option>
                  <option value={"priority"}> Priority</option>
                  <option value={"mobilenumber"}>phone number</option>
                  <option value={"city"}>City</option>
                  <option value={"area"}>Area</option>
                </select>
              </div> */}
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
                    placeholder="search here.."
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
            <div className="tb-add-item">
              <Link to="/addspa">
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
                ) : spasData && spasData?.length > 0 ? (
                  spasData?.map((spa, index) => {
                    return (
                      <>
                        <tr>
                          <td>{spa.priority}</td>
                          <td>{spa.name}</td>
                          <td>{spa.mobile_number}</td>
                          <td className="address-field-s">{spa.address}</td>
                          <td>{spa.landmark}</td>
                          <td>
                            <Switch
                              checked={spa.open}
                              onChange={() => toggle(spa.id, "open", !spa.open)}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>{spa.city}</td>
                          <td>{spa.area}</td>
                          <td>{spa.facilities.join(", ")}</td>
                          <td>{spa.offer_tag}</td>
                          <td>{spa.price}</td>
                          <td>
                            {isDropdown !== index ? (
                              <IoIosArrowDropdown
                                onClick={() => {
                                  setExpandedRow(index);
                                  setIsDropdown(index);
                                }}
                              />
                            ) : (
                              <IoIosArrowDropup
                                onClick={() => {
                                  setExpandedRow(null);
                                  setIsDropdown(null);
                                }}
                              />
                            )}
                          </td>
                          {spa.promise_description !== null ? (
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: spa.promise_description,
                                }}
                              />
                            </td>
                          ) : (
                            <td>{"-"}</td>
                          )}
                          <td>
                            <span
                              className="view-icon"
                              onClick={() => {
                                setModalData(spa);
                                setShowModal(true);
                              }}
                            >
                              <VisibilityIcon />
                            </span>
                          </td>

                          <td>
                            <Switch
                              checked={spa.verified}
                              onChange={() =>
                                toggle(spa.id, "verified", !spa.verified)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.premium}
                              onChange={() =>
                                toggle(spa.id, "premium", !spa.premium)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.best_spa}
                              onChange={() =>
                                // toggle(spa.id, "best_spa", !spa.best_spa)
                                toggleAddAndRemove(
                                  spa.id,
                                  "best_spa",
                                  !spa.best_spa
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.luxurious}
                              onChange={() =>
                                // toggle(spa.id, "luxurious", !spa.luxurious)
                                toggleAddAndRemove(
                                  spa.id,
                                  "luxurious",
                                  !spa.luxurious
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.top_rated}
                              onChange={() =>
                                // toggle(spa.id, "top_rated", !spa.top_rated)
                                toggleAddAndRemove(
                                  spa.id,
                                  "top_rated",
                                  !spa.top_rated
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>

                          <td>
                            <Switch
                              checked={spa.Body_massage_spas}
                              onChange={() =>
                                // toggle(
                                //   spa.id,
                                //   "Body_massage_spas",
                                //   !spa.Body_massage_spas
                                // )
                                toggleAddAndRemove(
                                  spa.id,
                                  "Body_massage_spas",
                                  !spa.Body_massage_spas
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.Beauty}
                              onChange={() =>
                                // toggle(spa.id, "Beauty", !spa.Beauty)
                                toggleAddAndRemove(spa.id, "Beauty", !spa.Beauty)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.Body_massage_center}
                              onChange={() =>
                                // toggle(
                                //   spa.id,
                                //   "Body_massage_center",
                                //   !spa.Body_massage_center
                                // )
                                toggleAddAndRemove(
                                  spa.id,
                                  "Body_massage_center",
                                  !spa.Body_massage_center
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.Thai_body_massage}
                              onChange={() =>
                                // toggle(
                                //   spa.id,
                                //   "Thai_body_massage",
                                //   !spa.Thai_body_massage
                                // )
                                toggleAddAndRemove(
                                  spa.id,
                                  "Thai_body_massage",
                                  !spa.Thai_body_massage
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.Spas_for_men}
                              onChange={() =>
                                // toggle(
                                //   spa.id,
                                //   "Spas_for_men",
                                //   !spa.Spas_for_men
                                // )
                                toggleAddAndRemove(
                                  spa.id,
                                  "Spas_for_men",
                                  !spa.Spas_for_men
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <Switch
                              checked={spa.Spas_for_women}
                              onChange={() =>
                                // toggle(
                                //   spa.id,
                                //   "Spas_for_women",
                                //   !spa.Spas_for_women
                                // )
                                toggleAddAndRemove(
                                  spa.id,
                                  "Spas_for_women",
                                  !spa.Spas_for_women
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteSpa(spa.id)}
                              style={{
                                cursor: "pointer",
                              }}
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

                        {expandedRow === index ? (
                          <tr
                            className="more_spa_detail__container"
                            key={index}
                          >
                            <td>
                              <div className="image__container">
                                <img
                                  src={spa.main_image}
                                  alt=""
                                  onClick={() => {
                                    setModalImageData(spa.main_image);
                                    setModalSpaID(spa.id);
                                    setShowIndividualPhotosModal(true);
                                  }}
                                />

                                {spa.mul_images.map((img, index) => {
                                  return (
                                    <img
                                      src={img.image}
                                      key={index}
                                      alt="img"
                                      onClick={() => {
                                        setShowIndividualPhotosModal(true);
                                        setModalImageData(img);
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddSpa
                                  spaData={spa}
                                  setSpaData={(data) => {
                                    setSpasData(
                                      spasData.map((spa) =>
                                        spa.id === data.id ? data : spa
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

          <GeneralModal
            open={showIndividualPhotosModal}
            handleClose={() => {
              setShowIndividualPhotosModal(false);
              setModalImageData(null);
            }}
          >
            <div>
              <h2 className="CWP-modal-spa-dht">
                {modalImageData?.image ? "spa Image" : "Spa Main Image"}
              </h2>
              <hr />
              {modalImageData?.image ? (
                <>
                  <div
                    className="CWP-room-images"
                    style={{
                      maxWidth: "50vw",
                      margin: "10px auto",
                      padding: "10px",
                    }}
                  >
                    <img src={modalImageData?.image} alt="img" />
                  </div>
                  <button
                    style={{
                      width: "150px",
                      display: "block",
                      margin: "20px auto",
                      color: "#ff0000",
                      backgroundColor: "#ff000020",
                      padding: "5px 15px",
                      borderRadius: "50px",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      deleteMulImage(modalImageData);
                    }}
                  >
                    Delete Image
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="CWP-room-images"
                    style={{
                      maxWidth: "50vw",
                      margin: "10px auto",
                      padding: "10px",
                    }}
                  >
                    <img src={modalImageData} alt="img" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "40px",
                    }}
                  >
                    <button
                      style={{
                        width: "150px",
                        display: "block",
                        margin: "20px 0",
                        color: "#ff0000",
                        backgroundColor: "#ff000020",
                        padding: "5px 15px",
                        borderRadius: "50px",
                        fontWeight: "600",
                      }}
                      onClick={() => {
                        deleteMainImage(modalSpaID);
                      }}
                    >
                      Delete Image
                    </button>
                  </div>
                </>
              )}
            </div>
          </GeneralModal>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {spasData.length} of {totalSpas} entries
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
        {modalData !== null &&
          modalData !== undefined &&
          modalData.spa_timings !== null &&
          modalData.spa_timings !== undefined && (
            <GeneralModalTimings
              open={showModal}
              handleClose={() => setShowModal(false)}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2 className="RI-modal-spa-dht">{modalData.name} - Timings</h2>
                <div
                  className="RI-modal-spa-details"
                  style={{ display: "flex", flexDirection: "row", gap: "2vw" }}
                >
                  <div style={{ marginLeft: "auto" }}>
                    <h2 className="RI-modal-spa-dht">Days</h2>
                    <label style={{ fontSize: "0.95rem" }}>Monday</label>
                    <label style={{ fontSize: "0.95rem" }}>Tuesday</label>
                    <label style={{ fontSize: "0.95rem" }}>Wednesday</label>
                    <label style={{ fontSize: "0.95rem" }}>Thursday</label>
                    <label style={{ fontSize: "0.95rem" }}>Friday</label>
                    <label style={{ fontSize: "0.95rem" }}>Saturday</label>
                    <label style={{ fontSize: "0.95rem" }}>Sunday</label>
                  </div>
                  <div style={{ marginRight: "auto" }}>
                    <h2 className="RI-modal-spa-dht">Open - Close Time</h2>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.monday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.monday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.monday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.tuesday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.tuesday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.tuesday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.wednesday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.wednesday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.wednesday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.thursday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.thursday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.thursday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.friday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.friday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.friday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.saturday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.saturday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.saturday.close_time
                          )}`
                        : "Closed"}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      {typeof modalData.spa_timings.sunday === "object"
                        ? `${convertTo12HourFormat(
                            modalData.spa_timings.sunday.open_time
                          )} - ${convertTo12HourFormat(
                            modalData.spa_timings.sunday.close_time
                          )}`
                        : "Closed"}
                    </label>
                  </div>
                </div>
              </div>
            </GeneralModalTimings>
          )}
      </div>
    </>
  );
};

export default Spalist;
