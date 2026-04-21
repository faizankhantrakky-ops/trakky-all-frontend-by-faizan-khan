import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaEdit, FaTrash, FaInfoCircle, FaImage, FaVideo, FaTimes, FaPlus, FaSync } from "react-icons/fa";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import CustomerInquiriesForm from "./Forms/CustomerInquiriesForm";
import { useNavigate } from "react-router-dom";
import DateRange from "./DateRange/DateRange"; // Assuming you have this component
import GeneralModal from "./generalModal/GeneralModal"; // Assuming you have this component
import { formatDate } from "./DateRange/formatDate"; // Assuming you have this utility

const CustomerInquiries = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("campaignName");
  const [selectedSalonInfo, setSelectedSalonInfo] = useState(null);
  const [showSalonModal, setShowSalonModal] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const navigate = useNavigate();

  // Date filter states
  const [dateFilterType, setDateFilterType] = useState("starting_date");
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [dateFilterLabel, setDateFilterLabel] = useState("Today");
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const handleBackToForm = () => {
    navigate("/CustomerInquiresForm");
  };

  const searchOptions = [
    { value: "campaignName", label: "Campaign Name" },
    { value: "salonName", label: "Salon Name" },
    { value: "city", label: "City" },
    { value: "area", label: "Area" },
  ];

  const dateFilterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 3 Days", value: "last3" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last 15 Days", value: "last15" },
    { label: "Last 30 Days", value: "last30" },
    { label: "Last 45 Days", value: "last45" },
    { label: "Last 60 Days", value: "last60" },
    { label: "Last 90 Days", value: "last90" },
    { label: "Custom Range", value: "custom" },
  ];

  const dateTypeOptions = [
    { value: "starting_date", label: "Start Date" },
    { value: "expire_date", label: "Expire Date" },
    { value: "created_at", label: "Created At" },
  ];

  useEffect(() => {
    fetchInquiries();
  }, [authTokens.access]);

  const buildApiUrl = (page = 1) => {
    let baseUrl = `https://backendapi.trakky.in/salons/addspend/?page=${page}`;

    // Add date filters if they are set
    if (dateFilterLabel !== "Today") {
      const { startDate, endDate } = dateState[0];
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      if (dateFilterType === "starting_date") {
        baseUrl += `&starting_date_from=${formattedStartDate}&starting_date_to=${formattedEndDate}`;
      } else if (dateFilterType === "expire_date") {
        baseUrl += `&expire_date_from=${formattedStartDate}&expire_date_to=${formattedEndDate}`;
      } else if (dateFilterType === "created_at") {
        baseUrl += `&created_at_from=${formattedStartDate}&created_at_to=${formattedEndDate}`;
      }
    }

    return baseUrl;
  };

  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);
      const url = buildApiUrl(page);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInquiries(data.results);
      setFilteredInquiries(data.results);
      setTotalCount(data.count);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message || "Failed to fetch inquiries. Please try again later."
      );
      setLoading(false);
    }
  };

  const handleDateFilterChange = (value) => {
    setDateFilterLabel(value);

    if (value === "custom") {
      setDateRangeModalOpen(true);
      return;
    }

    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (value) {
      case "today":
        // Already set to today
        break;
      case "yesterday":
        startDate.setDate(today.getDate() - 1);
        endDate.setDate(today.getDate() - 1);
        break;
      case "last3":
        startDate.setDate(today.getDate() - 3);
        break;
      case "last7":
        startDate.setDate(today.getDate() - 7);
        break;
      case "last15":
        startDate.setDate(today.getDate() - 15);
        break;
      case "last30":
        startDate.setDate(today.getDate() - 30);
        break;
      case "last45":
        startDate.setDate(today.getDate() - 45);
        break;
      case "last60":
        startDate.setDate(today.getDate() - 60);
        break;
      case "last90":
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        break;
    }

    setDateState([
      {
        startDate,
        endDate,
        key: "selection",
      },
    ]);

    // Refetch data with new date filter
    fetchInquiries(1);
    setPage(0);
  };

  const handleCustomDateApply = () => {
    setDateRangeModalOpen(false);
    fetchInquiries(1);
    setPage(0);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, inquiries, searchOption]);

  const handleSearch = () => {
    if (!inquiries || !Array.isArray(inquiries)) {
      setFilteredInquiries([]);
      return;
    }

    let filtered = [...inquiries];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((inquiry) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchOption) {
          case "campaignName":
            return inquiry.campaign_name?.toLowerCase().includes(searchValue);
          case "salonName":
            return inquiry.salon_info?.some((salon) =>
              salon.name?.toLowerCase().includes(searchValue)
            );
          case "city":
            return inquiry.salon_info?.some((salon) =>
              salon.city?.toLowerCase().includes(searchValue)
            );
          case "area":
            return inquiry.salon_info?.some((salon) =>
              salon.area?.toLowerCase().includes(searchValue)
            );
          default:
            return true;
        }
      });
    }

    setFilteredInquiries(filtered);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    // For API pagination, we need to fetch the next page
    if (newPage > page && nextPage) {
      fetchInquiries(newPage + 1);
    } else if (newPage < page && prevPage) {
      fetchInquiries(newPage + 1);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // When changing rows per page, we need to refetch data
    fetchInquiries(1);
  };

  const paginatedInquiries = Array.isArray(filteredInquiries)
    ? filteredInquiries.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : [];

  const renderMediaType = (inquiry) => {
    if (inquiry.client_image) {
      return (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-[#502DA6] text-sm text-gray-700 hover:underline"
          onClick={() => {
            setSelectedMedia(inquiry.client_image);
            setMediaType("image");
            setMediaModalOpen(true);
          }}
        >
          <FaImage className="text-sm" />
          <span>Image</span>
        </div>
      );
    } else if (inquiry.video) {
      return (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-[#502DA6] text-sm text-gray-700 hover:underline"
          onClick={() => {
            setSelectedMedia(inquiry.video);
            setMediaType("video");
            setMediaModalOpen(true);
          }}
        >
          <FaVideo className="text-sm" />
          <span>Video</span>
        </div>
      );
    }
    return <span className="text-gray-400">-</span>;
  };

  const handleSalonInfoClick = (salonInfo) => {
    setSelectedSalonInfo(salonInfo);
    setShowSalonModal(true);
  };

  const closeSalonModal = () => {
    setShowSalonModal(false);
    setSelectedSalonInfo(null);
  };

  const isBudgetExceeded = (inquiry) => {
    if (!inquiry.budget_have || !inquiry.budget_spend) return false;
    return parseFloat(inquiry.budget_spend) > parseFloat(inquiry.budget_have);
  };

  // Edit functionality
  const handleEditClick = (inquiry) => {
    setCurrentInquiry(inquiry);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updatedInquiry) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === updatedInquiry.id ? updatedInquiry : item
      )
    );
    setEditModalOpen(false);
    toast.success("Inquiry updated successfully");
    fetchInquiries(page + 1); // Refresh the data for current page
  };

  // Delete functionality
  const deleteInquiry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/addspend/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setInquiries((prev) => prev.filter((p) => p.id !== id));
        toast.success("Deleted Successfully!");
        fetchInquiries(page + 1); // Refresh the data
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again");
        logoutUser();
      } else {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="absolute top-20 left-1/2 transform -translate-x-1/2 text-gray-600 font-medium">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" mx-auto px-6 py-8 min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
        <button
          className="bg-[#502DA6] text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 py-8 min-h-screen bg-gray-50 font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

     {/* Header Section */}
<div className="bg-gradient-to-r from-[#502DA6] to-indigo-700 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-white mb-4">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="w-full sm:w-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-2">
        Ads Spends
      </h1>
      <p className="text-xs sm:text-sm text-indigo-100">
        Manage and monitor customer campaign inquiries
      </p>
    </div>
    
    <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
      <button
        className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm whitespace-nowrap"
        onClick={() => fetchInquiries(page + 1)}
      >
        <FaSync className="text-xs sm:text-sm" />
        <span>Refresh</span>
      </button>
      
      <button
        className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-xs sm:text-sm whitespace-nowrap"
        onClick={handleBackToForm}
      >
        <FaPlus className="text-xs sm:text-sm" />
        <span>Add Ads Spend</span>
      </button>
    </div>
  </div>
</div>
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm mb-8 p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters & Search</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search By</label>
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              {searchOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by {searchOptions.find((o) => o.value === searchOption)?.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder={`Search by ${searchOptions.find((o) => o.value === searchOption)?.label}`}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Filter Type</label>
            <select
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              {dateTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2"></div> {/* Spacer */}
        </div>

        {/* Date Filter Buttons */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Date Range:</p>
          <div className="flex flex-wrap gap-2">
            {dateFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateFilterChange(option.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all duration-200 ${
                  dateFilterLabel === option.value
                    ? "bg-[#502DA6] text-white  shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500 hover:text-[#502DA6] hover:shadow-md"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salon Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Used Images/Videos</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration Of Campaign (In Days)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Caption Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hashtags Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Booking Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Inquiries Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget Spend On Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budget Status Of Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={17} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                      </div>
                      <p className="text-gray-500 mt-4">Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedInquiries.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-6 py-12 text-center">
                    <h3 className="text-lg font-medium text-gray-500">No inquiries found matching your criteria</h3>
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry.id}
                    className={`hover:bg-indigo-50/30 transition-colors duration-150 ${
                      isBudgetExceeded(inquiry) ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page * rowsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.campaign_name || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {inquiry.salon_info && inquiry.salon_info.length > 0 ? (
                        <button
                          onClick={() => handleSalonInfoClick(inquiry.salon_info)}
                          className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                        >
                          <FaInfoCircle className="text-sm" />
                          View Salons
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderMediaType(inquiry)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.starting_date || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.expire_date || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.duration_of_campaign || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {inquiry.caption || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {inquiry.hashtags || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.total_booking || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.total_inqiry || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.budget_have || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.budget_spend || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                          isBudgetExceeded(inquiry)
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {isBudgetExceeded(inquiry) ? "Exceeded" : "Normal"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.last_updated || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inquiry.created_at || "-"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(inquiry)}
                          className="p-2 text-[#502DA6] hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          title="Edit Inquiry"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Delete Inquiry"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(null, page + 1)}
              disabled={!nextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{page * rowsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min((page + 1) * rowsPerPage, totalCount)}</span> of{" "}
                <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <label className="sr-only">Rows Per Page</label>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              >
                {[5, 10, 25].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleChangePage(null, page - 1)}
                  disabled={page === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 px-3 py-2">Page {page + 1}</span>
                <button
                  onClick={() => handleChangePage(null, page + 1)}
                  disabled={!nextPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salon Info Modal */}
      {showSalonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Salon Information</h3>
              <button
                onClick={closeSalonModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              {selectedSalonInfo &&
                selectedSalonInfo.map((salon, index) => (
                  <div key={index} className="mb-6 pb-4 border-b border-gray-100 last:border-b-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{salon.name || "Unnamed Salon"}</h4>
                    <div className="pl-4 space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">City:</span> {salon.city || "-"}</p>
                      <p><span className="font-medium">Area:</span> {salon.area || "-"}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <button
                onClick={closeSalonModal}
                className="w-full bg-[#502DA6] text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {mediaType === "image" ? "Image Preview" : "Video Preview"}
              </h3>
              <button
                onClick={() => setMediaModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 text-center">
              {selectedMedia && mediaType === "image" && (
                <img
                  src={selectedMedia}
                  alt="Campaign content"
                  className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
                />
              )}
              {selectedMedia && mediaType === "video" && (
                <video
                  controls
                  className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-lg"
                >
                  <source src={selectedMedia} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <button
                onClick={() => setMediaModalOpen(false)}
                className="bg-[#502DA6] text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Inquiry Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentInquiry ? `Edit Inquiry: ${currentInquiry.campaign_name}` : "Edit Inquiry"}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              {currentInquiry && (
                <CustomerInquiriesForm
                  inquiryData={currentInquiry}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditModalOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      <GeneralModal
        open={dateRangeModalOpen}
        handleClose={() => setDateRangeModalOpen(false)}
      >
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          setShowDateSelectionModal={setDateRangeModalOpen}
          onApply={handleCustomDateApply}
        />
      </GeneralModal>
    </div>
  );
};

export default CustomerInquiries;