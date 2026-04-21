import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch, FiMapPin, FiUser, FiPhone, FiMail, FiHome } from "react-icons/fi";
import { Avatar, CircularProgress } from "@mui/material";
import AuthContext from "../Context/AuthContext";
const PosRequest = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [page, setPage] = useState(1);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");
  const totalPages = 1;
  const [salonRequsetDataLoading, setSalonRequstDataLoading] = useState(false);
  const [servicerequestData, setServiceRequestData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const tableHeaders = [
    "Index",
    "Owner Name",
    "Salon Name",
    "Salon Area",
    "Salon City",
    "Contact No",
    "Owner Number",
    "Whatsapp No",
    "Address",
  ];

  useEffect(() => {
    fetchSalonData();
  }, [])

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSalonData(query); // Fetch data based on the search query
  };


  useEffect(() => {
    // Filter the salon data locally whenever searchQuery changes
    if (searchQuery) {
      const filtered = servicerequestData.filter((service) => {
        return (
          service.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.city?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredData(filtered);
      if (filtered.length === 0) {
        setNoDataMessage("No salons available matching your search.");
      }
    } else {
      setFilteredData(servicerequestData); // Show all data if searchQuery is cleared
    }
  }, [searchQuery, servicerequestData]);

  const fetchSalonData = async (searchText = "") => {
    setSalonRequstDataLoading(true);
    setNoDataMessage("");

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/salon-request/`,
        {
          method: "GET",
        }
      );



      if (response.ok) {
        const data = await response.json();
        setServiceRequestData(data);
        if (data.length === 0) {
          setNoDataMessage("No salons available matching your search.");
        }
      } else {
        const errorData = await response.text(); // Log error response text for debugging
        console.error("Error response:", errorData); // Log the error
        toast.error("Failed to fetch salon requests. Please try again later.");
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log fetch error for debugging
      toast.error("Failed to fetch salon requests. Please try again later.");
    } finally {
      setSalonRequstDataLoading(false);
    }
  };


  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              POS Salon Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage pending salon registration requests
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by owner name, salon name, area, or city..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiMapPin className="text-gray-500" />
              <span>Total Requests: <strong className="text-gray-900">{servicerequestData.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {salonRequsetDataLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <CircularProgress size={48} thickness={4} />
                <p className="mt-4 text-base font-medium">Loading salon requests...</p>
              </div>
            ) : filteredData?.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FiSearch className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-500">
                  {noDataMessage || "No salon requests found."}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[1200px] table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10"
                        style={
                          header === "Address"
                            ? { maxWidth: "356px", minWidth: "356px" }
                            : {}
                        }
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData?.map((service, index) => (
                    <tr key={service.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {Math.floor((page - 1) * 30 + index + 1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#502DA6", fontSize: "0.8rem" }}>
                            {service?.owner_name?.[0]?.toUpperCase() || "O"}
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">{service?.owner_name || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {service?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400 text-sm" />
                          <span>{service?.area || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400 text-sm" />
                          <span>{service?.city || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-gray-400 text-sm" />
                          <span>{service?.contact_no || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400 text-sm" />
                          <span>{service?.owner_contact_no || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-green-500 text-sm" />
                          <span>{service?.whatsapp_no || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                        <div className="flex items-start gap-2">
                          <FiHome className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{service?.address || "-"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {!salonRequsetDataLoading && servicerequestData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                Showing <strong>{filteredData.length}</strong> of <strong>{servicerequestData.length}</strong> salon requests
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PosRequest;