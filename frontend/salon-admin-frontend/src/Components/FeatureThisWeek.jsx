import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddFeatureThisWeek from "./Forms/AddFeatureThisWeek";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const FeatureThisWeek = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [filteredFeatured, setFilteredFeatured] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchOption, setSearchOption] = useState("Search Salon Name");

  const tableHeaders = [
    "Salon Name",
    "Salon Image",
    "City",
    "Area",
    "Salon Offer Tag",
    "Custom Offer Tag",
    "Actions",
  ];

  // === Fetch Featured Salons ===
  const getFeatured = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/feature-this-week/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authTokens.access,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setFeatured(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching featured:", error);
      toast.error("Failed to fetch featured salons. Please try again later", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  // === Delete Featured ===
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this featured salon?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/feature-this-week/${id}/`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + authTokens.access },
      });

      if (response.status === 204) {
        setFeatured((prev) => prev.filter((p) => p.id !== id));
        toast.success("Deleted Successfully !!", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  // === Search Logic ===
  useEffect(() => {
    const filtered = featured.filter((service) => {
      const term = searchTerm.toLowerCase();
      if (searchOption === "Search City") {
        return service.salon_city.toLowerCase().includes(term);
      } else if (searchOption === "Search Salon Name") {
        return service.salon_name.toLowerCase().includes(term);
      }
      return true;
    });
    setFilteredFeatured(filtered);
  }, [searchTerm, featured, searchOption]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  // === Effects ===
  useEffect(() => {
    if (updateFormOpened === null) {
      getFeatured();
    }
  }, [updateFormOpened]);

  useEffect(() => {
    getFeatured();
  }, []);

  const displayData = searchTerm ? filteredFeatured : featured;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Feature This Week</h1>
                <p className="mt-1 text-sm text-gray-600">Highlight special salon promotions</p>
              </div>
              <Link to="/addfeaturedthisweek">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Feature Salon
                </button>
              </Link>
            </div>
          </div>

          {/* === Search & Filter === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className=" flex gap-3">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="Search City">Search City</option>
                  <option value="Search Salon Name">Search Salon Name</option>
                </select>

                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${searchOption.replace("Search ", "").toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* === Table === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading featured salons...</p>
              </div>
            ) : displayData.length === 0 ? (
              <div className="p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">
                  {searchTerm ? "No featured salons match your search" : "No featured salons yet"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search." : "Click 'Feature Salon' to get started."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {displayData.map((service, index) => (
                      <React.Fragment key={service.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.salon_name}</td>
                          <td className="px-6 py-4">
                            {service?.salon_image ? (
                              <img
                                src={service.salon_image}
                                alt="Salon"
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{service.salon_city}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{service.salon_area || "-"}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{service.salon_offer_tag}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{service.custom_offer_tag || "-"}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 justify-center">
                              <button
                                onClick={() => handleDelete(service.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove Featured"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Edit Details"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Modal */}
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <AddFeatureThisWeek
                                    featured={service}
                                    setFeatured={(data) => {
                                      setFeatured((prev) =>
                                        prev.map((s) => (s.id === data.id ? data : s))
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                    closeModal={() => setUpdateFormOpened(null)}
                                  />
                                </Modal>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureThisWeek;