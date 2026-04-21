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
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { getCity } from "./Forms/generalFunctions/api";
import { getAreaNames } from "./Forms/generalFunctions/api";

const DailyUpdateList = () => {
  const scrollTopRef = useRef(null);
  const { authTokens } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [dailyUpdateData, setDailyUpdateData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dailyEditData, setDailyEditData] = useState({});

  // Fetch cities on mount
  useEffect(() => {
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    try {
      const { cityPayloadData, cityName } = await getCity();
      setCityPayloadData(cityPayloadData);
      setCityName(cityName);
    } catch (error) {
      toast.error("Failed to load cities");
    }
  };

  useEffect(() => {
    const selectedAreas = getAreaNames(cityPayloadData, selectedCityName);
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  // Main API Call - Unified function for list & search
  const fetchSalons = async (resetPage = false) => {
    if (resetPage) setPage(1);

    const currentPage = resetPage ? 1 : page;
    setLoading(true);

    try {
      let url = "https://backendapi.trakky.in/salons/";

      // If search term exists → use search endpoint
      if (searchTerm.trim()) {
        url = `https://backendapi.trakky.in/salons/search/?query=${encodeURIComponent(searchTerm.trim())}&page=${currentPage}`;
      } else {
        // Otherwise use normal filter
        const params = new URLSearchParams();
        params.append("page", currentPage);
        if (selectedCityName) params.append("city", selectedCityName);
        if (selectedAreaName) params.append("area", selectedAreaName);
        url = `https://backendapi.trakky.in/salons/?${params.toString()}`;
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

        // Handle both { results: [], count: X } and direct array
        const results = data.results || data || [];
        const count = data.count || results.length;

        setSalonsData(results);
        setTotalSalons(count);
        setHasMore(!!data.next);

        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        setSalonsData([]);
        setTotalSalons(0);
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch salons");
      setSalonsData([]);
      setTotalSalons(0);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on search, city, area, or page change
  useEffect(() => {
    fetchSalons(true); // Reset page when search or filter changes
  }, [searchTerm, selectedCityName, selectedAreaName]);

  useEffect(() => {
    if (!searchTerm.trim() && selectedCityName && selectedAreaName) {
      fetchSalons(); // Only for pagination when filters are applied
    } else if (searchTerm.trim()) {
      fetchSalons(); // For search pagination
    }
  }, [page]);

  const handleCityFilter = (e) => {
    setSelectedCityName(e.target.value);
    setSelectedAreaName("");
  };

  const handleAreaFilter = (e) => {
    setSelectedAreaName(e.target.value);
  };

  const handlePageChange = (e) => {
    const newPage = parseInt(e.target.id);
    setPage(newPage);
  };

  const getDailyUpdates = async (id) => {
    setModalLoading(true);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/daily-updates/?salon_id=${id}`,
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setDailyUpdateData(Array.isArray(data) ? data : data.results || []);
      } else {
        setDailyUpdateData([]);
      }
    } catch (err) {
      toast.error("Failed to load daily updates");
      setDailyUpdateData([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteDailyUpdate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;

    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/daily-updates/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (res.status === 204) {
        toast.success("Deleted successfully");
        getDailyUpdates(modalData.id);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const tableHeaders = ["Priority", "Salon Name", "City", "Area", "Phone No.", "Address", "Daily Updates"];

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSalons / spasPerPage);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              {/* City Filter */}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>City</InputLabel>
                <Select value={selectedCityName} label="City" onChange={handleCityFilter}>
                  <MenuItem value="">All Cities</MenuItem>
                  {cityName.map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Area Filter */}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small" disabled={!selectedCityName}>
                <InputLabel>Area</InputLabel>
                <Select value={selectedAreaName} label="Area" onChange={handleAreaFilter}>
                  <MenuItem value="">All Areas</MenuItem>
                  {availableAreaName.map((area) => (
                    <MenuItem key={area} value={area}>{area}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search Box */}
              <div className="tb-body-search">
                <input
                  type="text"
                  placeholder="Search by salon name (partial allowed)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "300px", padding: "8px" }}
                />
              </div>
            </div>

            <div className="tb-add-item">
              <Link to="/adddailyupdates">
                <button type="submit">
                  <AddIcon /> <span>Add Item</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                <tr>
                  {tableHeaders.map((h, i) => (
                    <th key={i} className={h === "Address" ? "address-field-s" : ""}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem" }}>
                      Loading salons...
                    </td>
                  </tr>
                ) : salonsData.length > 0 ? (
                  salonsData.map((salon, index) => (
                    <tr key={salon.id || index}>
                      <td>{salon.priority || "-"}</td>
                      <td>{salon.name || "N/A"}</td>
                      <td>{salon.city || "N/A"}</td>
                      <td>{salon.area || "N/A"}</td>
                      <td>{salon.mobile_number || "N/A"}</td>
                      <td className="address-field-s">{salon.address || "N/A"}</td>
                      <td>
                        <VisibilityIcon
                          className="view-icon"
                          style={{ cursor: "pointer", color: "#1976d2" }}
                          onClick={() => {
                            setModalData(salon);
                            getDailyUpdates(salon.id);
                            setShowModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "50px", fontSize: "1.4rem", color: "#999" }}>
                      {searchTerm || selectedCityName || selectedAreaName
                        ? "No salons found matching your search"
                        : "No salons available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalSalons > spasPerPage && (
            <div className="tb-body-footer">
              <div className="tb-reasult-count">
                Showing {salonsData.length} of {totalSalons} salons
              </div>
              <div className="tb-pagination">
                <span onClick={() => setPage(1)}>{'««'}</span>
                {page > 1 && <span onClick={() => setPage(page - 1)}>{'«'}</span>}
                {[...Array(totalPages)].map((_, i) => {
                  if (i + 1 >= page - 2 && i + 1 <= page + 2) {
                    return (
                      <span
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? "active" : ""}
                      >
                        {i + 1}
                      </span>
                    );
                  }
                  return null;
                })}
                {page < totalPages && <span onClick={() => setPage(page + 1)}>{'»'}</span>}
                <span onClick={() => setPage(totalPages)}>{'»»'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Updates Modal */}
      <GeneralModal open={showModal} handleClose={() => { setShowModal(false); setDailyUpdateData([]); }}>
        <div>
          <h2 className="CWP-modal-spa-dht">Daily Updates - {modalData.name}</h2>
          <div className="CWP-modal-spa-details">
            <table><tbody>
              <tr><th>Name</th><td>: {modalData.name}</td></tr>
              <tr><th>Phone</th><td>: {modalData.mobile_number}</td></tr>
            </tbody></table>
          </div>
          <hr />
          {modalLoading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Loading updates...</p>
          ) : dailyUpdateData.length > 0 ? (
            <table style={{ width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {dailyUpdateData.map((update) => (
                  <tr key={update.id}>
                    <td>
                      {update.daily_update_img ? (
                        <img src={update.daily_update_img} alt="update" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                      ) : "No Image"}
                    </td>
                    <td>{update.daily_update_description || "-"}</td>
                    <td>
                      <FaEdit
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                          setDailyEditData({ ...update, salon_id: modalData.id, salon_name: modalData.name });
                          setShowEditModal(true);
                        }}
                      />
                    </td>
                    <td>
                      <DeleteIcon style={{ cursor: "pointer", color: "red" }} onClick={() => handleDeleteDailyUpdate(update.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: "center", padding: "30px" }}>No daily updates found</p>
          )}
        </div>
      </GeneralModal>

      {/* Edit Modal */}
      <GeneralModal open={showEditModal} handleClose={() => setShowEditModal(false)}>
        <DailyUpdates
          dailyData={dailyEditData}
          closeModal={() => {
            setShowEditModal(false);
            setShowModal(false);
            fetchSalons();
          }}
        />
      </GeneralModal>
    </>
  );
};

export default DailyUpdateList;