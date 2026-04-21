import React, { useState, useEffect, useContext, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";
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

const SpaStats = () => {
  const scrollTopRef = useRef(null);

  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const abortControllerRef = useRef(new AbortController());

  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [spasData, setSpasData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("search");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSpas, setTotalSpas] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cityName, setCityName] = React.useState([]);
  const [spaCountData, setSpaCountData] = useState({});
  const [spaReviewData, setSpaReviewData] = useState({});
  const [selectedSpaName, setSelectedSpaName] = useState("");

  const getSpas = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/?page=${page}`;
      setLoading(true);
      const response = await fetch(url);
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
    toast("Delete Unavailable");
  };

  const tableHeaders = [
    "Index",
    "Name",
    "City",
    "Area",
    "Statistics",
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

  const getCountandReview = async (spa_id, spa_name) => {
    try {
      let url = `https://backendapi.trakky.in/spas/spareviewcalculation/${spa_id}/`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 200) {
        if (data.length === 0) {
          toast.error(`No Statistics Available for ${spa_name}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          return;
        }
        setSpaCountData(data[0].count);
        setSpaReviewData(data[0].review);
        setShowModal(true);
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

  const handleVisibilityClick = (spa_id, spa_name) => {
    getCountandReview(spa_id, spa_name);
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
                          <td>{(page - 1) * spasPerPage + index + 1}</td>
                          <td>{spa.name || "-"}</td>
                          <td>{spa.city || "-"}</td>
                          <td>{spa.area || "-"}</td>
                          <td>
                            <span
                              className="view-icon"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedSpaName(spa.name);
                                handleVisibilityClick(spa.id, spa.name);
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
        {showModal === true && (
          <GeneralModalTimings
            open={showModal}
            handleClose={() => setShowModal(false)}
          >
            <div>
              <h2 className="RI-modal-spa-dht" style={{ fontSize: "1.3rem" }}>
                Statistics - {selectedSpaName}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20%",
                  justifyContent: "center",
                }}
              >
                <div className="RI-modal-spa-details">
                  <h2
                    style={{ fontSize: "1.1rem", textDecoration: "underline" }}
                  >
                    Count
                  </h2>
                  <div style={{ marginLeft: "auto" }}>
                    <label style={{ fontSize: "0.95rem" }}>
                      Rating-1 : {spaCountData.count_rating_1}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Rating-2 : {spaCountData.count_rating_2}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Rating-3 : {spaCountData.count_rating_3}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Rating-4 : {spaCountData.count_rating_4}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Rating-5 : {spaCountData.count_rating_5}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Total Users : {spaCountData.count_rating_total_users}
                    </label>
                  </div>
                </div>
                <div className="RI-modal-spa-details">
                  <h2
                    style={{ fontSize: "1.1rem", textDecoration: "underline" }}
                  >
                    Review
                  </h2>
                  <div>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Hygiene : {spaReviewData.avg_hygiene}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Value for Money :{" "}
                      {spaReviewData.avg_value_for_money}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Behavior : {spaReviewData.avg_behavior}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Staff : {spaReviewData.avg_staff}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Massage Therapy :{" "}
                      {spaReviewData.avg_massage_therapy}
                    </label>
                    <label style={{ fontSize: "0.95rem" }}>
                      Average Overall Rating :{" "}
                      {spaReviewData.avg_overall_rating}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </GeneralModalTimings>
        )}
      </div>
    </>
  );
};

export default SpaStats;
