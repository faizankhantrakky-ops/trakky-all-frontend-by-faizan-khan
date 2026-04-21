import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import AuthContext from "../Context/AuthContext";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Bridal = () => {
  const scrollTopRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------- URL query sync (city / area) ---------- */
  useEffect(() => {
    if (searchParams.get("city")) setSelectedCityName(searchParams.get("city"));
    if (searchParams.get("area")) setSelectedAreaName(searchParams.get("area"));
  }, []);

  const { authTokens, logoutUser } = useContext(AuthContext);

  /* ---------- State ---------- */
  const [allSalons, setAllSalons] = useState([]);               // raw data from API
  const [page, setPage] = useState(1);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [salonNameSearch, setSalonNameSearch] = useState("");   // client-side search

  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityCityId, setPriorityCityId] = useState("");

  const tableHeaders = [
    "Change Priority",
    "City",
    "City Priority",
    "Area",
    "Area Priority",
    "Salon Name",
  ];

  const salonsPerPage = 12;

  /* ---------- API – FETCH (city / area) ---------- */
  const fetchSalons = async ({ city, area, pageCount }) => {
    let url = `https://backendapi.trakky.in/salons/salon-bridal/?page=${pageCount}`;
    if (city) url += `&city=${city}`;
    if (area) url += `&area=${area}`;

    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const sorted = selectedAreaName
          ? data.results.sort((a, b) => a.area_priority - b.area_priority)
          : data.results;

        setAllSalons(sorted);
        setTotalSalons(data.count);
        if (scrollTopRef.current) scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      toast.error("Failed to load salons.", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Pagination & Filters ---------- */
  const handlePageChange = (e) => setPage(parseInt(e.target.id));

  useEffect(() => {
    fetchSalons({
      city: selectedCityName,
      area: selectedAreaName,
      pageCount: page,
    });
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchSalons({
        city: selectedCityName,
        area: selectedAreaName,
        pageCount: page,
      });
    } else {
      setPage(1);
    }
  }, [selectedCityName, selectedAreaName]);

  /* ---------- Priority Update (unchanged) ---------- */
  const handleUpdatePriority = async (id, priority) => {
    try {
      const payload = selectedAreaName !== ""
        ? { area_priority: parseInt(priority) }
        : { priority: parseInt(priority) };

      const res = await fetch(
        `https://backendapi.trakky.in/salons/salon-bridal/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        setNewPriority("");
        setPriorityCityId("");
        fetchSalons({ city: selectedCityName, area: selectedAreaName, pageCount: page });
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (err) {
      toast.error(`Error: ${err}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  /* ---------- Cities / Areas ---------- */
  const getCity = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/city/");
      if (response.status === 200) {
        const data = await response.json();
        const payload = data?.payload || [];
        setCityPayloadData(payload);
        setCityName(payload.map((c) => c.name));
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => { getCity(); }, []);

  const getAreaNames = (city) => {
    if (!cityPayloadData) return [];
    if (!city) return cityPayloadData.flatMap((c) => c?.area_names || []);
    const selected = cityPayloadData.find((c) => c.name === city);
    return selected?.area_names || [];
  };

  useEffect(() => {
    const areas = getAreaNames(selectedCityName);
    if (!searchParams.get("area")) setSelectedAreaName("");
    setAvailableAreaName(areas);
  }, [selectedCityName, cityPayloadData]);

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

  /* ---------- CLIENT-SIDE FILTER (salon name) ---------- */
  const displayedSalons = useMemo(() => {
    if (!salonNameSearch) return allSalons;
    const term = salonNameSearch.trim().toLowerCase();
    return allSalons.filter((s) =>
      s.salon_name.toLowerCase().includes(term)
    );
  }, [allSalons, salonNameSearch]);

  const totalPages = Math.ceil(totalSalons / salonsPerPage);

  return (
    <>
      <Toaster position="top-center" />
      <div ref={scrollTopRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 font-sans antialiased">

        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 mb-4">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900">Bridal Salons</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage priority order for bridal salons by city, area or name
            </p>
          </div>
        </div>

        {/* Filters + Search */}
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
                  placeholder="e.g. Kult Hair salon"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Area
              </label>
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

          <div className="mt-3 text-sm text-gray-500 italic text-center md:text-left">
            Select Area to change Area Priority
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((h, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
                        <p className="text-base font-medium">Loading salons...</p>
                      </div>
                    </td>
                  </tr>
                ) : displayedSalons.length > 0 ? (
                  displayedSalons.map((salon, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setPriorityCityId(salon.id);
                            setShowEditPriorityModal(true);
                          }}
                          className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Change Priority"
                        >
                          <LowPriorityIcon className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{salon.salon_city}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {salon.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{salon.salon_area}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {salon.area_priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                        {salon.salon_name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mb-4" />
                        <p className="text-lg font-medium">No bridal salons match your search</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try a different name or clear the search box.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer – Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <strong>{displayedSalons.length}</strong> of{" "}
                <strong>{totalSalons}</strong> salons
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    id={1}
                    onClick={handlePageChange}
                    disabled={loading || page === 1}
                    className="px-3 py-1.5 text 诶 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    First
                  </button>

                  {page > 1 && (
                    <button
                      id={page - 1}
                      onClick={handlePageChange}
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
                      onClick={handlePageChange}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page - 2}
                    </button>
                  )}

                  {page > 1 && (
                    <button
                      id={page - 1}
                      onClick={handlePageChange}
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
                      onClick={handlePageChange}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page + 1}
                    </button>
                  )}

                  {page < totalPages - 1 && (
                    <button
                      id={page + 2}
                      onClick={handlePageChange}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {page + 2}
                    </button>
                  )}

                  {page < totalPages - 2 && <span className="px-2 text-sm text-gray-500">...</span>}

                  {page < totalPages && (
                    <button
                      id={page + 1}
                      onClick={handlePageChange}
                      disabled={loading}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition"
                    >
                      Next
                    </button>
                  )}

                  <button
                    id={totalPages}
                    onClick={handlePageChange}
                    disabled={loading || page === totalPages}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Priority Modal */}
        <GeneralModal
          open={showEditPriorityModal}
          handleClose={() => setShowEditPriorityModal(false)}
        >
          <div className="p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
              Update Priority
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                value={newPriority}
                placeholder="Enter new priority"
                onChange={(e) => setNewPriority(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
                }}
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleUpdatePriority(priorityCityId, newPriority);
                    setShowEditPriorityModal(false);
                  }}
                  disabled={!newPriority}
                  className="flex-1 h-11 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Update Priority
                </button>
                <button
                  onClick={() => setShowEditPriorityModal(false)}
                  className="h-11 px-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </GeneralModal>
      </div>
    </>
  );
};

export default Bridal;