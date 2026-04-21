import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import AddOffer from "./Forms/OfferForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import { useConfirm } from "material-ui-confirm";

const Offerslist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [offerType] = useState("city");
  const [offersData, setoffersData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredOffers, setfilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [loading, setLoading] = useState(false);

  // Priority Modal
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");

  // === Fetch Offers ===
  const getOffers = async (cityParam = selectedCity) => {
    setLoading(true);
    let url = "https://backendapi.trakky.in/salons/offer/";
    if (cityParam) url += `?city=${cityParam}`;

    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        setoffersData(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired.", { style: { background: "#ef4444", color: "#fff" } });
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to load offers.", { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  // === Delete Offer ===
  const deleteOffer = async (id) => {
    try {
      await confirm({ description: "Are you sure you want to delete this offer?" });
      const response = await fetch(`https://backendapi.trakky.in/salons/offer/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + authTokens.access,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("Offer deleted!", { style: { background: "#22c55e", color: "#fff" } });
        getOffers(selectedCity);
      } else if (response.status === 401) {
        logoutUser();
      } else {
        toast.error("Delete failed.", { style: { background: "#ef4444", color: "#fff" } });
      }
    } catch (error) {
      if (error?.name !== "cancel") {
        toast.error("Something went wrong.", { style: { background: "#ef4444", color: "#fff" } });
      }
    }
  };

  // === Search Filter ===
  useEffect(() => {
    setfilteredOffers(
      offersData.filter((offer) =>
        offer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, offersData]);

  // === Load Cities ===
  const getCity = async () => {
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/city/`);
      const data = await res.json();
      setCityPayload(data?.payload || []);
      setCity(data?.payload?.map((item) => item.name) || []);
    } catch (err) {
      toast.error("Failed to load cities.");
    }
  };

  // === Update Priority ===
  const handleUpdatePriority = async (id, priority) => {
    if (!priority || isNaN(priority)) {
      toast.error("Enter a valid priority.");
      return;
    }
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/offer/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authTokens.access,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );
      if (res.status === 200) {
        toast.success("Priority updated!", { style: { background: "#22c55e", color: "#fff" } });
        getOffers(selectedCity);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Update failed.", { style: { background: "#ef4444", color: "#fff" } });
      }
    } catch (err) {
      toast.error("Network error.", { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      setShowEditPriorityModal(false);
      setNewPriority("");
      setPriorityOfferId("");
    }
  };

  // === Effects ===
  useEffect(() => {
    getCity();
    getOffers();
  }, []);

  useEffect(() => {
    getOffers(selectedCity);
  }, [selectedCity]);

  const displayData = searchTerm ? filteredOffers : offersData;
  const tableHeaders = ["Priority", "Offer Name", "Salon Name", "City", "Area", "Slug", "More", "Action"];
  if (selectedCity) tableHeaders.unshift("Change Priority");

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Offers</h1>
                <p className="mt-1 text-sm text-gray-600">View, edit, and prioritize salon offers</p>
              </div>
              <Link to="/addoffer">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Offer
                </button>
              </Link>
            </div>
          </div>

          {/* === Filters === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex gap-3">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={selectedCity}
                    label="City"
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {city.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by offer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            {selectedCity && (
              <p className="mt-3 text-xs text-amber-700 font-medium">
                Note: Select a city to enable priority editing.
              </p>
            )}
          </div>

          {/* === Table === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading offers...</p>
              </div>
            ) : displayData.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-lg font-medium text-gray-600">
                  {searchTerm ? "No offers match your search" : "No offers available"}
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
                    {displayData.map((offer, index) => (
                      <React.Fragment key={offer.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          {selectedCity && (
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => {
                                  setPriorityOfferId(offer.id);
                                  setNewPriority(offer.priority);
                                  setShowEditPriorityModal(true);
                                }}
                                className="text-amber-600 hover:text-amber-800"
                                title="Edit Priority"
                              >
                                <LowPriorityIcon className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{offer.priority}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{offer.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {Object.values(offer.salon_names).join(", ")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{offer.city}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{offer.area || "-"}</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-600">{offer.slug}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setIsDropdown(isDropdown === index ? null : index)}
                              className="text-gray-600 hover:text-indigo-600"
                            >
                              {isDropdown === index ? (
                                <IoIosArrowDropup className="w-5 h-5" />
                              ) : (
                                <IoIosArrowDropdown className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 justify-center">
                              <button
                                onClick={() => deleteOffer(offer.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Edit"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Image */}
                        {isDropdown === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-0 bg-gray-50">
                              <div className="p-6 flex justify-center">
                                <img
                                  src={offer.img_url}
                                  alt={offer.name}
                                  className="max-h-64 rounded-lg shadow-md border border-gray-200"
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Edit Modal */}
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <AddOffer
                                    offerData={offer}
                                    setOfferData={(data) => {
                                      setoffersData((prev) =>
                                        prev.map((o) => (o.id === data.id ? data : o))
                                      );
                                      setUpdateFormOpened(null);
                                    }}
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

          {/* === Footer === */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <p>
              Showing 1 to {offersData.length} of {offersData.length} entries
            </p>
          </div>
        </div>
      </div>

      {/* === Priority Modal === */}
      <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-semibold text-center mb-4">Update Priority</h3>
          <div className="flex justify-center mb-5">
            <input
              type="number"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="New priority"
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowEditPriorityModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdatePriority(priorityOfferId, newPriority)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Offerslist;