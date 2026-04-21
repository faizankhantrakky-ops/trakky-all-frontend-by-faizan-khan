import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddMainSalonOffers from "./Forms/AddMainSalonOffers";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const MainOffers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [cityOnceSelected, setCityOnceSelected] = useState(false);

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("Search Salon");

  // === Fetch Main Offers ===
  const getMainOffers = async (city, area) => {
    setLoading(true);
    let url = `https://backendapi.trakky.in/salons/offernewpage/`;
    if (city && area) url += `?city=${city}&area=${area}`;
    else if (city) url += `?city=${city}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authTokens.access,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setOffers(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers. Please try again later", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  // === Delete Offer ===
  const deleteOffer = async (offerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/offernewpage/${offerId}/`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + authTokens.access },
        }
      );

      if (response.status === 204) {
        setOffers((prev) => prev.filter((p) => p.id !== offerId));
        toast.success("Offer Deleted Successfully !!", {
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

  // === Load Cities ===
  const getCity = async () => {
    try {
      const url = "https://backendapi.trakky.in/salons/city/";
      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        const payload = data?.payload || [];
        const cityNames = payload.map((item) => item.name);
        setCityPayloadData(payload);
        setCityName(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error.message);
      toast.error("Failed to fetch city data. Please try again later.", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  // === Get Areas ===
  function getAreaNames(cityName) {
    if (!cityPayloadData) return [];
    if (!cityName) return cityPayloadData.flatMap((city) => city?.area_names || []);
    const selectedCity = cityPayloadData.find((city) => city.name === cityName);
    return selectedCity?.area_names || [];
  }

  useEffect(() => {
    const areas = getAreaNames(selectedCityName);
    setAvailableAreaName(areas);
  }, [selectedCityName, cityPayloadData]);

  // === Effects ===
  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    if (updateFormOpened === null) {
      getMainOffers(selectedCityName, selectedAreaName);
    }
  }, [updateFormOpened]);

  useEffect(() => {
    if (selectedCityName && cityOnceSelected) {
      getMainOffers(selectedCityName, selectedAreaName);
    }
  }, [selectedCityName, selectedAreaName]);

  // === Search Logic ===
  useEffect(() => {
    const filtered = offers.filter((offer) => {
      const term = searchTerm.toLowerCase();
      if (searchOption === "Search Salon") {
        return offer.salon_details.salon_name.toLowerCase().includes(term);
      } else if (searchOption === "Search offer") {
        return offer.display_name.toLowerCase().includes(term);
      }
      return true;
    });
    setFilteredOffers(filtered);
  }, [searchTerm, offers, searchOption]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleCityFilter = (e) => {
    setSelectedAreaName("");
    setCityOnceSelected(true);
    setSelectedCityName(e.target.value);
  };

  const handleAreaFilter = (e) => {
    setSelectedAreaName(e.target.value);
  };

  const displayData = searchTerm ? filteredOffers : offers;
  const tableHeaders = [
    "Salon",
    "Slug",
    "City",
    "Area",
    "Offer Name",
    "Sub Name",
    "Code",
    "Services",
    "Start",
    "End",
    "Club",
    "Active",
    "Image",
    "T&C",
    "Actions",
  ];

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Main Offers</h1>
                <p className="mt-1 text-sm text-gray-600">Manage salon main promotional offers</p>
              </div>
              <Link to="/addmainoffers">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Offer
                </button>
              </Link>
            </div>
          </div>

          {/* === Filters === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>City</InputLabel>
                <Select
                  value={selectedCityName}
                  label="City"
                  onChange={handleCityFilter}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {cityName.map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Area */}
              <FormControl size="small" sx={{ minWidth: 120 }} disabled={!selectedCityName}>
                <InputLabel>Area</InputLabel>
                <Select
                  value={selectedAreaName}
                  label="Area"
                  onChange={handleAreaFilter}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {availableAreaName.map((area) => (
                    <MenuItem key={area} value={area}>{area}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Search By */}
              <div className="flex items-end">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="Search Salon">Search Salon</option>
                  <option value="Search offer">Search Offer</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${searchOption === "Search Salon" ? "salon" : "offer"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
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
                    {displayData.map((offer, index) => {
                      const services = offer.all_services
                        ? "All Services"
                        : offer.services_details?.map((s) => s.service_name).join(", ") || "—";

                      return (
                        <React.Fragment key={offer.id}>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{offer.salon_details.salon_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{offer.salon_details.slug}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offer.salon_details.city}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{offer.salon_details.area}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{offer.display_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offer.display_sub_name || "—"}</td>
                            <td className="px-6 py-4 text-sm font-mono text-green-600">{offer.offer_code}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{services}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offer.starting_date}</td>
                            <td className="px-6 py-4 text-sm text-red-600">{offer.expire_date}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${offer.club_with_other_offer ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                                {offer.club_with_other_offer ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${offer.active_status ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                                {offer.active_status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <img
                                src={offer.image}
                                alt="offer"
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                              <div
                                className="prose prose-sm max-w-none line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: offer.terms_and_conditions }}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 justify-center">
                                <button
                                  onClick={() => deleteOffer(offer.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Offer"
                                >
                                  <AiFillDelete className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => setUpdateFormOpened(index)}
                                  className="text-indigo-600 hover:text-indigo-800"
                                  title="Edit Offer"
                                >
                                  <FaEdit className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Edit Modal */}
                          {updateFormOpened === index && (
                            <tr>
                              <td colSpan={15} className="p-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="p-6">
                                  <Modal closeModal={() => setUpdateFormOpened(null)}>
                                    <AddMainSalonOffers
                                      offerItem={offer}
                                      refreshData={getMainOffers}
                                      closeModal={() => setUpdateFormOpened(null)}
                                    />
                                  </Modal>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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

export default MainOffers;