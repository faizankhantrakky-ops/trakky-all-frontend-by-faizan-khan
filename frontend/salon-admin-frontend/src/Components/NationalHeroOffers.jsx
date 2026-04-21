import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddNationalHeroOffers from "./Forms/AddNationalHeroOffers";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const NationalHeroOffers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [priorityUpdate, setPriorityUpdate] = useState(null);
  const [priorityInput, setPriorityInput] = useState("");
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nationalHeroOffers, setNationalHeroOffers] = useState([]);
  const [filteredNationalHeroOffers, setFilteredNationalHeroOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("Search City");

  const tableHeaders = [
    "Priority",
    "Salon Name",
    "Offer Name",         // ← New column added here
    "City",
    "Media",
    "Is National?",
    "Actions",
  ];

  // === Fetch Data ===
  useEffect(() => {
    getNationalHeroOffers();
  }, []);

  useEffect(() => {
    if (updateFormOpened === null) {
      getNationalHeroOffers();
    }
  }, [updateFormOpened]);

  const getNationalHeroOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/national-hero-offers/",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        // Sort by priority to ensure consistent order
        setNationalHeroOffers(data.sort((a, b) => a.priority - b.priority));
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error("Failed to fetch offers");
      }
    } catch (error) {
      toast.error("Failed to load hero offers.", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  // === New: Update Priority ===
  const updatePriority = async (offerId, newPriorityInput) => {
    const newPriority = parseInt(newPriorityInput);

    if (isNaN(newPriority) || newPriority < 1) {
      toast.error("Priority must be a positive number.");
      return;
    }

    setPriorityLoading(true);

    try {
      const sortedOffers = [...nationalHeroOffers].sort((a, b) => a.priority - b.priority);

      const targetOffer = sortedOffers.find(o => o.id === offerId);
      if (!targetOffer) return;

      const oldPriority = targetOffer.priority;

      if (oldPriority === newPriority) {
        return;
      }

      let newOrder = sortedOffers.filter(o => o.id !== offerId);
      newOrder.splice(newPriority - 1, 0, targetOffer);

      const updatedOffers = newOrder.map((offer, index) => ({
        ...offer,
        priority: index + 1
      }));

      const changes = updatedOffers.filter(offer => {
        const original = nationalHeroOffers.find(o => o.id === offer.id);
        return original.priority !== offer.priority;
      });

      const patchPromises = changes.map(offer =>
        fetch(`https://backendapi.trakky.in/salons/national-hero-offers/${offer.id}/`, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: offer.priority }),
        })
      );

      const responses = await Promise.all(patchPromises);

      const allSuccessful = responses.every(res => res.ok);

      if (allSuccessful) {
        setNationalHeroOffers(updatedOffers);
        toast.success("Priority updated & all priorities reordered!", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error("Some updates failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update priority. Please try again.", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setPriorityLoading(false);
      setPriorityUpdate(null);
      setPriorityInput("");
    }
  };

  // === Delete Offer ===
  const deleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this hero offer?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/national-hero-offers/${offerId}/`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + authTokens.access },
        }
      );

      if (response.status === 204) {
        setNationalHeroOffers((prev) => prev.filter((p) => p.id !== offerId));
        toast.success("Offer deleted successfully!", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
      } else if (response.status === 401) {
        logoutUser();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Failed to delete offer.", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  // === Search Logic ===
  useEffect(() => {
    handleSearch();
  }, [searchTerm, nationalHeroOffers, searchOption]);

  const handleSearch = () => {
    const filtered = nationalHeroOffers.filter((offer) => {
      const term = searchTerm.toLowerCase();
      if (searchOption === "Search City") {
        return offer.city?.toLowerCase().includes(term);
      }
      return true;
    });
    setFilteredNationalHeroOffers(filtered);
  };

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const displayData = searchTerm ? filteredNationalHeroOffers : nationalHeroOffers;

  // === Media Renderer Component ===
  const MediaPreview = ({ offer }) => {
    const hasImage = offer.image;
    const hasVideo = offer.video;

    if (hasImage) {
      return (
        <img
          src={offer.image}
          alt="Hero"
          className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
        />
      );
    }

    if (hasVideo) {
      return (
        <video
          controls
          className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
          style={{ background: "#000" }}
        >
          <source src={offer.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div className="w-24 h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-400 font-medium">No Media</span>
      </div>
    );
  };

  const openPriorityModal = (offer) => {
    setPriorityUpdate(offer.id);
    setPriorityInput(offer.priority.toString());
  };

  const   PriorityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Priority</h3>
          <div className="space-y-4">
            <input
              type="number"
              min="1"
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value)}
              placeholder="Enter priority (e.g., 1)"
              disabled={priorityLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => updatePriority(priorityUpdate, priorityInput)}
                disabled={priorityLoading}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center text-white ${
                  priorityLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {priorityLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
              <button
                onClick={() => {
                  setPriorityUpdate(null);
                  setPriorityInput("");
                }}
                disabled={priorityLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Page Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">National Hero Offer's</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage featured salon promotions displayed prominently across the platform.
                </p>
              </div>
              <Link to="/addnationalherooffers">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm">
                  <AddIcon className="w-5 h-5" />
                  Add Hero Offer
                </button>
              </Link>
            </div>
          </div>

          {/* === Search & Filter Bar === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex gap-3">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="Search City">Search by City</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by city..."
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <svg
                    className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* === Table Card === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-gray-600">Loading hero offers...</p>
              </div>
            ) : displayData.length === 0 ? (
              <div className="p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {searchTerm ? "No matching offers found" : "No hero offers yet"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search." : "Click 'Add Hero Offer' to get started."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {displayData.map((offer, index) => (
                      <React.Fragment key={offer.id}>
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => openPriorityModal(offer)}
                            title="Click to update priority"
                          >
                            #{offer.priority}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                            {offer.salon_name}
                          </td>
                          {/* === New Offer Name Column === */}
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                            {offer.name || <span className="text-gray-400 italic">No name</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {offer.city}
                          </td>

                          {/* Media Column */}
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <MediaPreview offer={offer} />
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                offer?.is_national
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {offer?.is_national ? "Yes" : "No"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3 justify-center">
                              <button
                                onClick={() => deleteOffer(offer.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                title="Edit"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Modal Row */}
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <AddNationalHeroOffers
                                    nationalHeroOfferData={offer}
                                    onUpdateSuccess={(data) => {
                                      setNationalHeroOffers((prev) =>
                                        prev.map((item) =>
                                          item.id === data.id ? data : item
                                        )
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

          {/* === Footer Note === */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Priority determines display order. Lower number = higher on homepage.</p>
          </div>
        </div>

        {/* === New: Priority Update Modal === */}
        {priorityUpdate && <PriorityModal />}
      </div>
    </>
  );
};

export default NationalHeroOffers;