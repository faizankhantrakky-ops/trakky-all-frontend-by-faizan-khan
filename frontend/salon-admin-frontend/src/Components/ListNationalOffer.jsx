import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import AddNationalOffer from "./Forms/AddNationalOffer";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { useConfirm } from "material-ui-confirm";

const ListNationalOffer = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [offersData, setOffersData] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOfferData, setEditOfferData] = useState(null);
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState(null);

  const tableHeaders = ["Priority", "Update Priority", "Offer Title", "More", "Action"];

  // === Fetch Offers ===
  const getOffers = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/national-offers/");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setOffersData(data);
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error(`Error: ${error.message}`, {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  // === Search Filter ===
  useEffect(() => {
    const filtered = offersData.filter((offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOffers(filtered);
  }, [searchTerm, offersData]);

  // === Delete Offer ===
  const deleteOffer = async (id) => {
    try {
      await confirm({ description: "Are you sure you want to delete this offer?" });

      const res = await fetch(`https://backendapi.trakky.in/salons/national-offers/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      if (res.status === 204) {
        toast.success("Offer Deleted Successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
        getOffers();
      } else if (res.status === 401) {
        toast.error("You're logged out", { style: { background: "#ef4444", color: "#fff" } });
        logoutUser();
      } else {
        toast.error(`Something went wrong: ${res.status}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      if (error === "cancel") return;
      toast.error("Something went wrong", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  // === Update Priority ===
  const handleUpdatePriority = async () => {
    if (!newPriority || isNaN(newPriority) || newPriority < 1) {
      toast.error("Enter a valid priority", { style: { background: "#ef4444", color: "#fff" } });
      return;
    }

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/national-offers/${priorityOfferId}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({ priority: parseInt(newPriority) }),
        }
      );

      if (res.ok) {
        toast.success("Priority Updated Successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
        setNewPriority("");
        setPriorityOfferId(null);
        setShowEditPriorityModal(false);
        getOffers();
      } else {
        toast.error(`Something Went Wrong: ${res.status}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`, { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  const displayData = searchTerm ? filteredOffers : offersData;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">National Offers</h1>
                <p className="mt-1 text-sm text-gray-600">Manage nationwide promotional offers</p>
              </div>
              <Link to="/addnationaloffer">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Offer
                </button>
              </Link>
            </div>
          </div>

          {/* === Search === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by offer title..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* === Table === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {displayData.length === 0 ? (
              <div className="p-16 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">
                  {searchTerm ? "No offers match your search" : "No national offers yet"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search." : "Click 'Add Offer' to get started."}
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
                          {/* Priority */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              #{offer.priority}
                            </span>
                          </td>

                          {/* Update Priority */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setPriorityOfferId(offer.id);
                                setNewPriority(offer.priority);
                                setShowEditPriorityModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-800"
                              title="Update Priority"
                            >
                              <LowPriorityIcon className="w-5 h-5" />
                            </button>
                          </td>

                          {/* Title */}
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{offer.title}</td>

                          {/* Expand */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              {expandedRow === index ? (
                                <IoIosArrowDropup className="w-5 h-5" />
                              ) : (
                                <IoIosArrowDropdown className="w-5 h-5" />
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => deleteOffer(offer.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete Offer"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditOfferData(offer);
                                  setShowEditModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Edit Offer"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row - Image Preview */}
                        {expandedRow === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-0 bg-gray-50">
                              <div className="p-6 flex justify-center">
                                <div className="relative group">
                                  <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="max-w-md h-64 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
                                </div>
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
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing 1 to {offersData.length} of {offersData.length} entries
          </div>
        </div>
      </div>

      {/* === Edit Offer Modal === */}
      <GeneralModal open={showEditModal} handleClose={() => setShowEditModal(false)}>
        <AddNationalOffer
          offerData={editOfferData}
          closeModal={() => setShowEditModal(false)}
          updateOffer={getOffers}
        />
      </GeneralModal>

      {/* === Update Priority Modal === */}
      <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Update Priority</h3>
          <div className="flex justify-center mb-6">
            <input
              type="number"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              }}
              placeholder="Enter priority"
              className="w-32 px-4 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowEditPriorityModal(false)}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePriority}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default ListNationalOffer;