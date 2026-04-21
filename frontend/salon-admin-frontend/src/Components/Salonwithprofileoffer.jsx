import React, { useState, useEffect, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import AuthContext from "../Context/AuthContext";

const Salonwithprofileoffer = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [salons, setSalons] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState(null);
  const [newPriority, setNewPriority] = useState("");
  const [newAreaPriority, setNewAreaPriority] = useState("");

  const tableHeaders = [
    "Shift Priority",
    "Priority",
    "Area Priority",
    "Salon Name",
    "City / Area",
    "Slug",
    "Main Image",
    "Offer (Top)",
    "Action",
  ];

  // Load cities once on component mount
  useEffect(() => {
    const fetchCities = async () => {
      if (!authTokens?.access) return;

      try {
        const res = await fetch("https://backendapi.trakky.in/salons/city/", {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        if (res.status === 401) {
          logoutUser();
          toast.error("Session expired. Please login again.");
          return;
        }

        if (!res.ok) throw new Error("Failed to load cities");

        const data = await res.json();
        // Expected structure: { payload: [{ id, name, priority?, ... }, ...] }
        const cityNames = (data.payload || [])
          .map((city) => city.name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b)); // alphabetical sort

        setCities(["All Cities", ...cityNames]);
      } catch (err) {
        console.error("Cities fetch error:", err);
        toast.error("Could not load cities");
        setCities(["All Cities"]);
      }
    };

    fetchCities();
  }, [authTokens, logoutUser]);

  // Fetch salons when page, search, or city changes
  useEffect(() => {
    if (cities.length === 0) return; // wait until cities are loaded

    const fetchSalons = async () => {
      setLoading(true);
      try {
        let url = `https://backendapi.trakky.in/salons/salons-with-offers/?page=${page}&page_size=${itemsPerPage}`;

        if (selectedCity && selectedCity !== "All Cities") {
          url += `&city=${encodeURIComponent(selectedCity)}`;
        }

        if (searchTerm.trim()) {
          url += `&search=${encodeURIComponent(searchTerm.trim())}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });

        if (res.status === 401) {
          logoutUser();
          toast.error("Session expired. Please login again.");
          return;
        }

        if (!res.ok) throw new Error("Failed to load salons");

        const data = await res.json();

        setSalons(data.results || data || []);
        setPagination({
          count: data.count || 0,
          next: data.next,
          previous: data.previous,
        });
      } catch (err) {
        console.error("Salons fetch error:", err);
        toast.error("Could not load salons");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [page, searchTerm, selectedCity, cities, authTokens, logoutUser]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value === "All Cities" ? "" : value);
    setPage(1);
  };

  const handleUpdatePriority = async () => {
    if (!newPriority.trim() || isNaN(newPriority)) {
      toast.error("Enter valid priority number");
      return;
    }

    try {
      const payload = { priority: parseInt(newPriority, 10) };
      if (newAreaPriority.trim() && !isNaN(newAreaPriority)) {
        payload.area_priority = parseInt(newAreaPriority, 10);
      }

      const res = await fetch(
        `https://backendapi.trakky.in/salons/salons-with-offers/${selectedSalonId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update priority");

      toast.success("Priority updated successfully!");
      setShowPriorityModal(false);
      setNewPriority("");
      setNewAreaPriority("");
      // Refresh list
      // You can call fetchSalons() here if you want immediate refresh
    } catch (err) {
      toast.error(err.message || "Failed to update priority");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salon?")) return;

    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/salons-with-offers/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (res.ok || res.status === 204) {
        toast.success("Salon deleted successfully");
        setSalons((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to delete salon");
      }
    } catch (err) {
      toast.error("Error while deleting salon");
    }
  };

  const totalPages = Math.ceil(pagination.count / itemsPerPage) || 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gray-50 pb-10">
        <div className=" mx-auto p-4 ">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow border-b border-gray-200">
            <div className="px-6 py-5">
              <h1 className="text-2xl font-bold text-gray-900">
                Salon with Profile & Offers
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage salons, priorities and featured offers
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow border border-t-0 border-gray-200 rounded-b-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* City Dropdown */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity || "All Cities"}
                  onChange={handleCityChange}
                  disabled={cities.length <= 1}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Salon name, area, slug..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end items-end">
                {/* You can add "Add New Salon" button here if needed */}
              </div>
            </div>
          </div>

          {/* Table / Content */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading salons...</p>
              </div>
            ) : salons.length === 0 ? (
              <div className="py-16 text-center text-gray-600">
                No salons found
                {selectedCity && selectedCity !== "All Cities"
                  ? ` in ${selectedCity}`
                  : ""}
                {searchTerm ? ` matching "${searchTerm}"` : ""}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salons.map((salon) => {
                      const offer = salon.profile_offers?.[0];
                      return (
                        <tr key={salon.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedSalonId(salon.id);
                                setNewPriority(salon.priority?.toString() || "");
                                setNewAreaPriority(salon.area_priority?.toString() || "");
                                setShowPriorityModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <LowPriorityIcon className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {salon.priority ?? "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {salon.area_priority ?? "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {salon.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.city} • {salon.area}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                            {salon.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {salon.main_image ? (
                              <img
                                src={salon.main_image}
                                alt={salon.name}
                                className="h-14 w-14 object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">No image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {offer ? (
                              <div>
                                <div className="font-medium">{offer.name}</div>
                                <div className="text-xs mt-0.5">
                                  ₹{offer.discount_price}{" "}
                                  <s className="text-gray-400">
                                    ₹{offer.actual_price}
                                  </s>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">No offer</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(salon.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <AiFillDelete className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && salons.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-xl shadow border border-gray-200 text-sm text-gray-700">
              <div>
                Showing {(page - 1) * itemsPerPage + 1} –{" "}
                {Math.min(page * itemsPerPage, pagination.count)} of{" "}
                {pagination.count} salons
              </div>
x
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>

                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 border rounded min-w-[2.5rem] ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Update Modal */}
      <GeneralModal open={showPriorityModal} handleClose={() => setShowPriorityModal(false)}>
        <div className="bg-white p-6 sm:p-8 rounded-xl max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-center mb-6">Update Salon Priority</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <input
                type="number"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter priority number"
              />
            </div>

           
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleUpdatePriority}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowPriorityModal(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Salonwithprofileoffer;