import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import AuthContext from "../Context/AuthContext";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import Modal from "./UpdateModal";
import { ChangePriority } from "./Forms/UpdatePriority";
import UpdatePriority from "./Forms/UpdatePriority";
import { useSearchParams } from "react-router-dom";

const CityAndAreaPriority = () => {
  const scrollTopRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const abortControllerRef = useRef(null);

  /* ---------- URL Sync ---------- */
  useEffect(() => {
    if (searchParams.get("city")) setSelectedCityName(searchParams.get("city"));
    if (searchParams.get("area")) setSelectedAreaName(searchParams.get("area"));
  }, [searchParams]);

  const { authTokens, logoutUser } = useContext(AuthContext);

  /* ---------- State ---------- */
  const [allSalons, setAllSalons] = useState([]);           // current page data (or all when searching)
  const [page, setPage] = useState(1);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cityName, setCityName] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");

  const [salonNameSearch, setSalonNameSearch] = useState("");
  const [allMatchingSalons, setAllMatchingSalons] = useState([]); // ← new: all results when searching

  const [ChangePriorityFormOpened, setChangePriorityFormOpened] = useState(null);
  const [priorityFormOpened, setPriorityFormOpened] = useState(false);

  const salonsPerPage = 12;

  /* ---------- Table Headers ---------- */
  const baseHeaders = [
    "Change Priority",
    "City",
    "City Priority",
    "Area",
    "Area Priority",
    "Name",
    "Phone No.",
    "Address",
  ];

  const tableHeaders = useMemo(() => {
    const extra = selectedCityName || selectedAreaName ? ["Shift Priority"] : [];
    return [...extra, ...baseHeaders];
  }, [selectedCityName, selectedAreaName]);

  /* ---------- Decide displayed data & total ---------- */
  const isSearching = salonNameSearch.trim().length > 0;

  const displayedSalons = useMemo(() => {
    if (!isSearching) return allSalons;

    const term = salonNameSearch.trim().toLowerCase();
    return allMatchingSalons.filter((s) =>
      s.name?.toLowerCase().includes(term)
    );
  }, [isSearching, allSalons, allMatchingSalons, salonNameSearch]);

  const totalItems = isSearching ? allMatchingSalons.length : totalSalons;
  const totalPages = Math.ceil(totalItems / salonsPerPage);

  const currentPageSalons = useMemo(() => {
    if (!isSearching) return displayedSalons;

    const start = (page - 1) * salonsPerPage;
    const end = start + salonsPerPage;
    return displayedSalons.slice(start, end);
  }, [isSearching, displayedSalons, page]);

  /* ---------- API – FETCH SALONS (normal paginated) ---------- */
  const fetchSalons = useCallback(
    async ({ city, area, pageCount }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let url = `https://backendapi.trakky.in/salons/?page=${pageCount}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;
      if (area) url += `&area=${encodeURIComponent(area)}`;

      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (response.status === 200) {
          const data = await response.json();
          const sorted = selectedAreaName
            ? data.results.sort((a, b) => a.area_priority - b.area_priority)
            : data.results;

          setAllSalons(sorted);
          setTotalSalons(data.count);

          if (scrollTopRef.current) {
            scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else {
          toast.error("Something went wrong", { duration: 4000 });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
          toast.error("Failed to load salons.");
        }
      } finally {
        setLoading(false);
      }
    },
    [authTokens, logoutUser, selectedAreaName]
  );

  /* ---------- NEW: Search across ALL salons by name ---------- */
  const fetchAllMatchingSalons = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setAllMatchingSalons([]);
      return;
    }

    setLoading(true);
    try {
      // You can adjust page_size to a high number or implement pagination on backend if needed
      // Here assuming backend supports large page_size or you fetch in batches
      const url = `https://backendapi.trakky.in/salons/?search=${encodeURIComponent(searchTerm)}&page_size=500`;

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllMatchingSalons(data.results || []);
        setPage(1); // reset to first page when search changes
      } else {
        toast.error("Search failed");
        setAllMatchingSalons([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching salons");
      setAllMatchingSalons([]);
    } finally {
      setLoading(false);
    }
  }, [authTokens]);

  /* ---------- Triggers ---------- */
  useEffect(() => {
    if (isSearching) {
      fetchAllMatchingSalons(salonNameSearch);
    } else {
      fetchSalons({ city: selectedCityName, area: selectedAreaName, pageCount: page });
    }
  }, [page, selectedCityName, selectedAreaName, salonNameSearch, fetchSalons, fetchAllMatchingSalons, isSearching]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [selectedCityName, selectedAreaName, salonNameSearch]);

  /* ---------- Shift Priority (Up/Down) ---------- */
  const moveRow = (index, offset) => {
    const direction = offset === -1 ? "up" : "down";
    const salon = currentPageSalons[index];
    if (window.confirm(`Move this salon ${direction}?`)) {
      handleShiftPriority(salon, direction);
    }
  };

  const handleShiftPriority = async (salon, direction) => {
    const formData = new FormData();
    if (selectedCityName && !selectedAreaName) {
      formData.append("change_priority", true);
    } else if (selectedAreaName) {
      formData.append("change_area_priority", true);
    }
    formData.append(direction, true);

    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/${salon.id}/`, {
        method: "PATCH",
        headers: { Authorization: "Bearer " + String(authTokens.access) },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("You're logged out");
          logoutUser();
          return;
        }
        throw new Error("Failed to shift priority");
      }

      toast.success("Priority shifted successfully.");
      // Refresh current view
      if (isSearching) {
        fetchAllMatchingSalons(salonNameSearch);
      } else {
        fetchSalons({ city: selectedCityName, area: selectedAreaName, pageCount: page });
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  /* ---------- Cities / Areas ---------- */
  const getCity = async () => {
    try {
      const res = await fetch("https://backendapi.trakky.in/salons/city/");
      if (res.status === 200) {
        const data = await res.json();
        const payload = data?.payload || [];
        setCityPayloadData(payload);
        setCityName(payload.map((c) => c.name));
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  useEffect(() => { getCity(); }, []);

  const getAreaNames = useCallback((city) => {
    if (!cityPayloadData) return [];
    if (!city) return cityPayloadData.flatMap((c) => c?.area_names || []);
    const selected = cityPayloadData.find((c) => c.name === city);
    return selected?.area_names || [];
  }, [cityPayloadData]);

  useEffect(() => {
    const areas = getAreaNames(selectedCityName);
    if (!searchParams.get("area")) setSelectedAreaName("");
    setAvailableAreaName(areas);
  }, [selectedCityName, getAreaNames, searchParams]);

  const updateCityQueryParam = (v) => {
    const p = new URLSearchParams(searchParams);
    p.set("city", v);
    p.delete("area");
    setSearchParams(p);
  };

  const updateAreaQueryParam = (v) => {
    const p = new URLSearchParams(searchParams);
    p.set("area", v);
    setSearchParams(p);
  };

  const handleCityFilter = (e) => {
    setSelectedCityName(e.target.value);
    updateCityQueryParam(e.target.value);
  };

  const handleAreaFilter = (e) => {
    setSelectedAreaName(e.target.value);
    updateAreaQueryParam(e.target.value);
  };

  /* ---------- Render ---------- */
  return (
    <>
      <Toaster position="top-center" />
      <div ref={scrollTopRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 font-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 mb-4">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900">City & Area Priority</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage salon priority by city, area, shift order, or search by name
            </p>
          </div>
        </div>

        {/* Filters + Search + Exchange */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-5 mb-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Salon Name Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Salon Name
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={salonNameSearch}
                  onChange={(e) => setSalonNameSearch(e.target.value)}
                  placeholder="e.g. Glow Salon"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
              <select
                value={selectedCityName}
                onChange={handleCityFilter}
                className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">All Cities</option>
                {cityName.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Area</label>
              <select
                value={selectedAreaName}
                onChange={handleAreaFilter}
                className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">All Areas</option>
                {availableAreaName.map((a, i) => (
                  <option key={i} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setPriorityFormOpened(true)}
              className="flex items-center gap-2 px-4 h-11 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition"
            >
              <SwapHorizontalCircleIcon className="h-5 w-5" />
              Exchange Priority
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header, i) => (
                    <th
                      key={i}
                      className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10 ${
                        header === "Address" ? "w-64" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                        <p className="text-base font-medium">Loading salons...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentPageSalons.length > 0 ? (
                  currentPageSalons.map((salon, index) => (
                    <React.Fragment key={salon.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        {(selectedCityName || selectedAreaName) && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => moveRow(index, -1)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                                title="Move Up"
                              >
                                <NorthIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => moveRow(index, 1)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                title="Move Down"
                              >
                                <SouthIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setChangePriorityFormOpened(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Change Priority"
                          >
                            <LowPriorityIcon className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{salon.city}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {salon.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{salon.area}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {salon.area_priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{salon.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{salon.mobile_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{salon.address}</td>
                      </tr>

                      {ChangePriorityFormOpened === index && (
                        <tr>
                          <td colSpan={tableHeaders.length} className="p-0 bg-gray-50">
                            <Modal closeModal={() => setChangePriorityFormOpened(null)}>
                              <ChangePriority
                                salonData={salon}
                                closeModal={() => setChangePriorityFormOpened(null)}
                                refreshData={() => {
                                  if (isSearching) {
                                    fetchAllMatchingSalons(salonNameSearch);
                                  } else {
                                    fetchSalons({ city: selectedCityName, area: selectedAreaName, pageCount: page });
                                  }
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mb-4" />
                        <p className="text-lg font-medium">
                          {isSearching ? "No salons match your search" : "No salons found"}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {isSearching
                            ? "Try a different search term or clear filters"
                            : "Try adjusting city/area filters"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <strong>{currentPageSalons.length}</strong> of <strong>{totalItems}</strong> salons
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    id={1}
                    onClick={(e) => setPage(parseInt(e.target.id))}
                    disabled={loading || page === 1}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    First
                  </button>

                  {page > 1 && (
                    <button
                      id={page - 1}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition"
                    >
                      Previous
                    </button>
                  )}

                  {page > 3 && <span className="px-2 text-sm text-gray-500">...</span>}

                  {page > 2 && (
                    <button
                      id={page - 2}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page - 2}
                    </button>
                  )}

                  {page > 1 && (
                    <button
                      id={page - 1}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page - 1}
                    </button>
                  )}

                  <button
                    disabled
                    className="px-3 py-1.5 text-sm rounded-md border border-blue-500 bg-blue-50 text-blue-700 font-medium cursor-default"
                  >
                    {page}
                  </button>

                  {page < totalPages && (
                    <button
                      id={page + 1}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page + 1}
                    </button>
                  )}

                  {page < totalPages - 1 && (
                    <button
                      id={page + 2}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page + 2}
                    </button>
                  )}

                  {page < totalPages - 2 && <span className="px-2 text-sm text-gray-500">...</span>}

                  {page < totalPages && (
                    <button
                      id={totalPages}
                      onClick={(e) => setPage(parseInt(e.target.id))}
                      disabled={loading || page === totalPages}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Last
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exchange Priority Modal */}
        <GeneralModal
          open={priorityFormOpened}
          handleClose={() => setPriorityFormOpened(false)}
          backgroundColor="transparent"
        >
          <UpdatePriority
            closeModal={() => setPriorityFormOpened(false)}
            refreshData={() => {
              if (isSearching) {
                fetchAllMatchingSalons(salonNameSearch);
              } else {
                fetchSalons({ city: selectedCityName, area: selectedAreaName, pageCount: page });
              }
            }}
          />
        </GeneralModal>
      </div>
    </>
  );
};

export default CityAndAreaPriority;