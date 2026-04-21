import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import AddSalonProfileOffer from "./Forms/AddSalonProfileOffer";
import { FaEdit } from "react-icons/fa";
import Modal from "./UpdateModal";
import { Select, MenuItem, InputLabel, FormControl, OutlinedInput } from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import { getCity, getAreaNames } from "./Forms/generalFunctions/api";

// Icons
import { FiSearch, FiFilter, FiPlus, FiCalendar, FiClock, FiTag, FiMapPin, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const SalonProfileOffer = () => {
  const [newPriority, setNewPriority] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [uniqueSalons, setUniqueSalons] = useState([]);
  const [selectedSalonName, setSelectedSalonName] = useState("");
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profileOffers, setProfileOffers] = useState([]);
  const [filteredProfileOffers, setFilteredProfileOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [salonProfileId, setSalonProfileId] = useState("");

  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

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

  useEffect(() => {
    if (updateFormOpened === null) {
      setSelectedSalonName("");
      getSalonProfileOffer();
    }
  }, [updateFormOpened]);

  const handleSalons = (event) => {
    setSelectedSalonName(event.target.value);
    getSalonProfileOffer(event.target.value);
    setSelectedAreaName("");
    setSelectedCityName("");
  };

  const getSalonProfileOffer = async (salonName = "", city = "", area = "") => {
    setLoading(true);
    try {
      let url = salonName
        ? `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_name=${encodeURIComponent(salonName)}`
        : `https://backendapi.trakky.in/salons/salon-profile-offer/`;

      if (city !== "" && area !== "" && !salonName) {
        url += `?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}`;
      } else if (city !== "" && !salonName) {
        url += `?city=${encodeURIComponent(city)}`;
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
        setProfileOffers(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUniqueSalons = async () => {
    const url = `https://backendapi.trakky.in/salons/salon-profile-offer/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const salons = data.map((item) => ({
          id: item.salon,
          name: item.salon_name,
          slug: item.salon_slug,
          area: item.salon_area,
          city: item.salon_city,
        }));

        const uniqueSalonsMap = new Map();
        salons.forEach((salon) => uniqueSalonsMap.set(salon.id, salon));
        const uniqueSalonsArray = Array.from(uniqueSalonsMap.values());
        uniqueSalonsArray.sort((a, b) => a.name.localeCompare(b.name));
        setUniqueSalons(uniqueSalonsArray);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch salons.");
    }
  };

  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    getUniqueSalons();
  }, []);

  const deleteSalonProfileOffer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon-profile-offer/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setProfileOffers(profileOffers.filter((p) => p.id !== id));
        toast.success("Offer deleted successfully!");
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to delete offer.");
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/salon-profile-offer/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (res.status === 200) {
        toast.success("Priority updated successfully!");
        setNewPriority("");
        setSalonProfileId("");
        getSalonProfileOffer(selectedSalonName);
      } else {
        toast.error("Failed to update priority.");
        setNewPriority("");
        setSalonProfileId("");
      }
    } catch (err) {
      toast.error("Error updating priority.");
      setNewPriority("");
      setSalonProfileId("");
    }
  };

  const handleCityFilter = (event) => {
    setSelectedSalonName("");
    setSelectedAreaName("");
    setSelectedCityName(event.target.value);
    getSalonProfileOffer("", event.target.value, "");
  };

  const handleAreaFilter = (event) => {
    setSelectedSalonName("");
    setSelectedAreaName(event.target.value);
    getSalonProfileOffer("", selectedCityName, event.target.value);
  };

  const handleSearch = () => {
    const filtered = profileOffers?.filter((offe) => {
      switch (searchOption) {
        case "Search Salon":
          return offe?.salon_name.toLowerCase().includes(searchTerm.toLowerCase());
        case "Search offer":
          return offe?.name.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredProfileOffers(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, profileOffers, searchOption]);

  const tableHeaders = [
    "Priority",
    "Offer Name",
    "Gender",
    "Salon Name",
    "City",
    "Area",
    "Actual Price",
    "Discount Price",
    "Duration",
    "Start Date",
    "End Date",
    "Status",
    "T&C",
    "Image",
    "Actions",
  ];

  if (selectedCityName) {
    tableHeaders.unshift("Set Priority");
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiTag className="w-6 h-6 text-indigo-600" />
                  Salon Profile Offers
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage and prioritize promotional offers across all salons
                </p>
              </div>
              <Link
                to="/addsalonprofileoffer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
              >
                <FiPlus className="w-4 h-4" />
                Add New Offer
              </Link>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline w-4 h-4 mr-1" />
                  City
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedCityName}
                    onChange={handleCityFilter}
                    displayEmpty
                    input={<OutlinedInput />}
                    className="text-sm"
                  >
                    <MenuItem value="">
                      <em>All Cities</em>
                    </MenuItem>
                    {cityName?.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Area Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline w-4 h-4 mr-1" />
                  Area
                </label>
                <FormControl fullWidth size="small">
                  <Select
                    disabled={!selectedCityName}
                    value={selectedAreaName}
                    onChange={handleAreaFilter}
                    displayEmpty
                    input={<OutlinedInput />}
                    className="text-sm"
                  >
                    <MenuItem value="">
                      <em>All Areas</em>
                    </MenuItem>
                    {availableAreaName?.map((area, index) => (
                      <MenuItem key={index} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Search Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiSearch className="inline w-4 h-4 mr-1" />
                  Search By
                </label>
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="Search Salon">Salon Name</option>
                  <option value="Search offer">Offer Name</option>
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFilter className="inline w-4 h-4 mr-1" />
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${searchOption === "Search Salon" ? "salon" : "offer"}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {selectedCityName && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <LowPriorityIcon className="w-4 h-4" />
                  <strong>Note:</strong> You can now adjust offer priority for salons in <strong>{selectedCityName}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <p className="text-gray-500">Loading offers...</p>
                        </div>
                      </td>
                    </tr>
                  ) : searchTerm !== "" && filteredProfileOffers.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-6 py-12 text-center text-gray-500">
                        No results found for "<strong>{searchTerm}</strong>"
                      </td>
                    </tr>
                  ) : (searchTerm !== "" ? filteredProfileOffers : profileOffers).length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-6 py-12 text-center text-gray-500">
                        No offers available
                      </td>
                    </tr>
                  ) : (
                    (searchTerm !== "" ? filteredProfileOffers : profileOffers).map((offer, index) => (
                      <React.Fragment key={offer.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          {/* Priority Change */}
                          {selectedCityName && (
                            <td className="px-5 py-4">
                              <button
                                onClick={() => {
                                  setSalonProfileId(offer.id);
                                  setShowEditPriorityModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 transition"
                              >
                                <LowPriorityIcon className="w-5 h-5" />
                              </button>
                             </td>
                          )}

                          <td className="px-5 py-4 text-sm font-medium text-gray-900">
                            #{offer.priority}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {offer.name}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {offer?.gender || "-"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-900">
                            {offer.salon_name}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {offer.salon_city}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {offer?.salon_area}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-900">
                            <FaRupeeSign className="inline w-4 h-4" />
                            {offer.actual_price}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-green-600">
                            <FaRupeeSign className="inline w-4 h-4" />
                            {offer.discount_price}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600">
                            <div className="flex flex-col gap-1">
                              {offer?.offer_time?.hours && (
                                <span>
                                  <FiClock className="inline w-3 h-3 mr-1" />
                                  {offer.offer_time.hours}h
                                </span>
                              )}
                              {offer?.offer_time?.minutes && (
                                <span>
                                  <FiClock className="inline w-3 h-3 mr-1" />
                                  {offer.offer_time.minutes}m
                                </span>
                              )}
                              {offer?.offer_time?.seating && (
                                <span>
                                  <FiCheckCircle className="inline w-3 h-3 mr-1" />
                                  {offer.offer_time.seating} seats
                                </span>
                              )}
                              {offer?.offer_time?.days && (
                                <span>
                                  <FiCalendar className="inline w-3 h-3 mr-1" />
                                  {offer.offer_time.days} days
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            <FiCalendar className="inline w-4 h-4 mr-1 text-indigo-600" />
                            {offer.starting_date}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            <FiCalendar className="inline w-4 h-4 mr-1 text-red-600" />
                            {offer.expire_date}
                          </td>
                          <td className="px-5 py-4">
                            {offer.active_status ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiXCircle className="w-3 h-3" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600 max-w-sm">
                            <div
                              className="prose prose-xs max-w-none"
                              dangerouslySetInnerHTML={{ __html: offer.terms_and_conditions }}
                            />
                          </td>
                          <td className="px-5 py-4">
                            {offer?.image ? (
                              <img
                                src={offer.image}
                                alt="Offer"
                                className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => deleteSalonProfileOffer(offer.id)}
                                className="text-red-600 hover:text-red-800 transition"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="text-indigo-600 hover:text-indigo-800 transition"
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
                            <td colSpan={tableHeaders.length} className="p-0 bg-gray-50">
                              <Modal closeModal={() => setUpdateFormOpened(null)}>
                                <div className="p-6">
                                  <AddSalonProfileOffer
                                    profileOffers={offer}
                                    setProfileOffers={(data) => {
                                      const updatedOffers = profileOffers.map((o) => 
                                        o.id === data.id ? data : o
                                      );
                                      setProfileOffers(updatedOffers);
                                      setUpdateFormOpened(null);
                                      toast.success("Offer updated successfully!", {
                                        duration: 4000,
                                        position: "top-center",
                                      });
                                    }}
                                  />
                                </div>
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <strong>{(searchTerm !== "" ? filteredProfileOffers : profileOffers).length}</strong> offer(s)
              </p>
            </div>
          </div>
        </div>

        {/* Priority Update Modal */}
        <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Update Offer Priority
            </h3>
            <div className="mb-5">
              <input
                type="number"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                placeholder="Enter priority (e.g., 1)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
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
                onClick={() => {
                  handleUpdatePriority(salonProfileId, newPriority);
                  setShowEditPriorityModal(false);
                }}
                disabled={!newPriority}
                className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                Update Priority
              </button>
            </div>
          </div>
        </GeneralModal>
      </div>
    </>
  );
};

export default SalonProfileOffer;