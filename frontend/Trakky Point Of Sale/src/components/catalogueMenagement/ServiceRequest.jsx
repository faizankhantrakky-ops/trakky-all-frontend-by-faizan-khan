import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniHeader from "./MiniHeader";
import { Trash2, Edit, Search, Filter, Clock, Calendar, IndianRupee, User, Tag, CheckCircle, XCircle, ClockIcon, X, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import { useConfirm } from "material-ui-confirm";

const ServiceRequestPage = () => {
  const [RequestData, setRequestData] = useState([]);
  const [RequestDataLoading, setRequestDataLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const getRequestData = async () => {

    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }


    setRequestDataLoading(true);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/service-request/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRequestData(sortedData);
        applyFilters(sortedData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch service requests");
    } finally {
      setRequestDataLoading(false);
    }
  };

  const applyFilters = (data = RequestData) => {
    let result = data;
    let count = 0;

    if (searchTerm) {
      result = result.filter((item) =>
        item.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      count++;
    }

    if (selectedGender !== "all") {
      result = result.filter((item) => item.gender === selectedGender);
      count++;
    }

    if (selectedCategory) {
      result = result.filter(
        (item) =>
          item.category_id &&
          item.category_id.toString().includes(selectedCategory)
      );
      count++;
    }

    if (selectedStatus !== "all") {
      result = result.filter((item) => item.service_status === selectedStatus);
      count++;
    }

    setFilteredData(result);
    setActiveFilterCount(count);
  };

  useEffect(() => {
    getRequestData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedStatus, selectedGender, selectedCategory]);

  const deleteServiceRequest = async (id) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this service request?`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/service-request/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Service request deleted successfully");
        setRequestData(
          RequestData.filter((item) => item.id !== id)
        );
      } else {
        toast.error("Failed to delete service request");
      }
    } catch (error) {
      if (error === undefined || error === "cancel") {
        console.log("Deletion cancelled");
        return;
      }
      toast.error("An error occurred");
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";

    let str = "";
    const parts = [];

    if (time?.days && time.days !== 0) {
      parts.push(`${time.days} Day${time.days > 1 ? 's' : ''}`);
    }
    if (time?.seating && time.seating !== 0) {
      parts.push(`${time.seating} Seating${time.seating > 1 ? 's' : ''}`);
    }
    if (time?.hours && time.hours !== 0) {
      parts.push(`${time.hours} Hour${time.hours > 1 ? 's' : ''}`);
    }
    if (time?.minutes && time.minutes !== 0) {
      parts.push(`${time.minutes} Min${time.minutes > 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedGender("all");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <MiniHeader title="Service Requests" />

      <div className="p-6">
        {/* Header Section with Filter Button */}
        <div className="mb-4 -mt-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mt-2">
                Manage and review service requests from customers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total: {filteredData.length} requests
              </span>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#492DBD] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Filter className="w-5 h-5 text-[#492DBD]" />
                          <h3 className="font-semibold text-gray-900">Filter Requests</h3>
                        </div>
                        <button
                          onClick={() => setShowFilterDropdown(false)}
                          className="p-1 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {/* Filter Form */}
                      <div className="space-y-4">
                        {/* Search Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Service
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                              placeholder="Search by service name..."
                            />
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {["all", "pending", "approved", "rejected"].map((status) => (
                              <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${selectedStatus === status
                                  ? 'bg-[#492DBD] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Gender Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["all", "male", "female"].map((gender) => (
                              <button
                                key={gender}
                                onClick={() => setSelectedGender(gender)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${selectedGender === gender
                                  ? 'bg-[#492DBD] text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {gender === "all" ? "All" : gender.charAt(0).toUpperCase() + gender.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                              placeholder="Enter category..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Clear all filters
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowFilterDropdown(false)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setShowFilterDropdown(false)}
                            className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors text-sm"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={getRequestData}
                className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors text-sm font-medium"
              >
                Refresh Now
              </button>
            </div>
          </div>

          {/* Active Filters Indicator */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Active filters: {activeFilterCount}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#492DBD] hover:text-[#3a2199] font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {RequestDataLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#492DBD] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#492DBD] rounded-full opacity-20"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading service requests...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Service Details
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category & Gender
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.service_name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            {item.from_masterservice ? (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                Master Service
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                                New Created
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-900">
                            Category: <span className="font-medium">{item.category_id ?? "N/A"}</span>
                          </div>
                          <div className="text-sm text-gray-900">
                            Gender: <span className="font-medium capitalize">{item.gender ?? "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatTime(item.service_time)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {dayjs(item.created_at).format("DD MMM, YYYY")}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(item.service_status)}`}>
                          {getStatusIcon(item.service_status)}
                          <span className="text-sm font-medium capitalize">
                            {item.service_status || "Unknown"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => deleteServiceRequest(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No service requests found
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {activeFilterCount > 0
                  ? "Try adjusting your filters to find what you're looking for."
                  : "There are no service requests available at the moment."}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination/Stats Footer */}
        {!RequestDataLoading && filteredData.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
              <span className="font-semibold">{RequestData.length}</span> requests
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span>Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
};

export default ServiceRequestPage;