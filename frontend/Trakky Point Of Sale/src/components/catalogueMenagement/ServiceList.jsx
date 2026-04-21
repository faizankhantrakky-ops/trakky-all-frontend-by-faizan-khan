import React, { useContext, useEffect, useState, useCallback } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Filter,
  RefreshCw,
  X,
  Edit,
  MoreVertical,
  Clock,
  IndianRupee,
  Tag,
  User,
  Users,
  Calendar,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Grid3x3,
  LayoutList,
  Trash2,
  Eye,
  Plus,
  Folder,
  Hash,
  TrendingUp,
  Package
} from "lucide-react";

const ServiceList = () => {
  const { vendorData, authTokens } = useContext(AuthContext);

  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [categorisedService, setCategorisedService] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    serviceName: "",
    gender: "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    service_name: "",
    price: "",
    gender: "",
    service_time: { days: 0, hours: 0, minutes: 0, seating: 0 },
  });

  const fetchServices = async (pageNum) => {

            if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }
    
    setServiceLoading(true);
    if (!vendorData?.salon) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=${pageNum}&salon_id=${vendorData?.salon}`
      );
      const data = await response.json();
      if (response.ok) {
        const services = data?.results || data || [];
        if (pageNum === 1) {
          setAllServices(services);
          setFilteredServices(services);
        } else {
          setAllServices((prev) => [...prev, ...services]);
          setFilteredServices((prev) => [...prev, ...services]);
        }
        setHasMore(!!data?.next);
      } else {
        toast.error(`Failed to load services: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
    setPage(1);
  }, [vendorData?.salon]);

  useEffect(() => {
    if (page > 1) {
      fetchServices(page);
    }
  }, [page]);

  useEffect(() => {
    let result = [...allServices];

    if (filters.serviceName) {
      result = result.filter((item) =>
        item.service_name
          ?.toLowerCase()
          .includes(filters.serviceName.toLowerCase())
      );
    }

    if (filters.gender) {
      result = result.filter(
        (item) => item.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.category) {
      result = result.filter(
        (item) =>
          item.master_service_data?.category?.name?.toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    setFilteredServices(result);
  }, [filters, allServices]);

  useEffect(() => {
    if (filteredServices.length === 0) {
      setCategorisedService([]);
      return;
    }

    const categoryMap = {};
    filteredServices.forEach((service) => {
      const categoryName =
        service?.master_service_data?.category?.name || "Uncategorized";
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = [];
      }
      categoryMap[categoryName].push(service);
    });

    const transformedData = Object.keys(categoryMap).map((category) => ({
      name: category,
      services: categoryMap[category],
    }));

    setCategorisedService(transformedData);
  }, [filteredServices]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ serviceName: "", gender: "", category: "" });
    setShowFilters(false);
  };

  const formatTime = (time) => {
    if (!time) return "";
    let str = "";
    if (time?.days && time.days !== "0") str += `${time.days}d `;
    if (time?.seating && time.seating !== "0") str += `${time.seating}s `;
    if (time?.hours && time.hours !== "0") str += `${time.hours}h `;
    if (time?.minutes && time.minutes !== "0") str += `${time.minutes}m `;
    return str.trim() || "N/A";
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    if (scrollHeight - (scrollTop + clientHeight) < 100 && 
        !serviceLoading && 
        hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [serviceLoading, hasMore]);

  const uniqueCategories = [
    ...new Set(
      allServices
        .map((service) => service.master_service_data?.category?.name)
        .filter(Boolean)
    ),
  ];

  const openEditModal = (service) => {
    setEditingService(service);
    setEditForm({
      service_name: service.service_name || "",
      price: service.price || "",
      gender: service.gender || "",
      service_time: {
        days: service.service_time?.days || 0,
        hours: service.service_time?.hours || 0,
        minutes: service.service_time?.minutes || 0,
        seating: service.service_time?.seating || 0,
      },
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("service_time.")) {
      const field = name.split(".")[1];
      setEditForm((prev) => ({
        ...prev,
        service_time: { ...prev.service_time, [field]: parseInt(value) || 0 },
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service-pos/${editingService.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        const updatedService = await response.json();
        setAllServices((prev) =>
          prev.map((s) => (s.id === updatedService.id ? updatedService : s))
        );
        toast.success("Service updated successfully!");
        setEditModalOpen(false);
      } else {
        const error = await response.json();
        toast.error(`Update failed: ${error.message || response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <User className="w-3 h-3" />;
      case "female":
        return <Users className="w-3 h-3" />;
      case "unisex":
        return <User className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "female":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "unisex":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStats = () => {
    const total = allServices.length;
    const male = allServices.filter(s => s.gender?.toLowerCase() === 'male').length;
    const female = allServices.filter(s => s.gender?.toLowerCase() === 'female').length;
    const unisex = allServices.filter(s => s.gender?.toLowerCase() === 'unisex').length;
    
    return { total, male, female, unisex };
  };

  const stats = getStats();

  return (
    <div className="w-full h-full bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-4 border-l-4 border-[#492DBD] pl-3">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Service Management</h1>
                <p className="text-xs text-gray-600">
                  Manage salon service's
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border ${showFilters ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
              title="Filter Services"
            >
              <Filter className={`w-4 h-4 ${showFilters ? "text-indigo-600" : "text-gray-600"}`} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-800">Filter Services</h3>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded-md"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="serviceName"
                        value={filters.serviceName}
                        onChange={handleFilterChange}
                        placeholder="Search services..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="gender"
                          value={filters.gender}
                          onChange={handleFilterChange}
                          className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white appearance-none"
                        >
                          <option value="">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      
                      <div className="relative">
                        <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                          className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white appearance-none"
                        >
                          <option value="">All Categories</option>
                          {uniqueCategories.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Filters */}
                  {(filters.serviceName || filters.gender || filters.category) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Active:</span>
                      {filters.serviceName && (
                        <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-200">
                          <span>{filters.serviceName}</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, serviceName: "" }))}
                            className="ml-1 hover:text-indigo-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {filters.gender && (
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs border border-green-200">
                          <span>{filters.gender}</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, gender: "" }))}
                            className="ml-1 hover:text-green-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {filters.category && (
                        <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs border border-purple-200">
                          <span>{filters.category}</span>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, category: "" }))}
                            className="ml-1 hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => fetchServices(1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-base font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-1.5 rounded-md bg-indigo-50">
                <Package className="w-3 h-3 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Male</p>
                <p className="text-base font-bold text-indigo-600">{stats.male}</p>
              </div>
              <div className="p-1.5 rounded-md bg-indigo-50">
                <User className="w-3 h-3 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Female</p>
                <p className="text-base font-bold text-pink-600">{stats.female}</p>
              </div>
              <div className="p-1.5 rounded-md bg-pink-50">
                <Users className="w-3 h-3 text-pink-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Unisex</p>
                <p className="text-base font-bold text-purple-600">{stats.unisex}</p>
              </div>
              <div className="p-1.5 rounded-md bg-purple-50">
                <Tag className="w-3 h-3 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6" onScroll={handleScroll}>
        {serviceLoading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm text-gray-600 font-medium">Loading services...</p>
          </div>
        ) : categorisedService.length > 0 ? (
          <div className="space-y-4">
            {categorisedService.map((category, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-indigo-100">
                      <Folder className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{category.name}</h2>
                      <p className="text-xs text-gray-600">
                        {category.services.length} services
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {category.services.map((item, index1) => (
                        <tr 
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="py-3 px-4">
                            <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100">
                              <span className="font-medium text-xs text-gray-700">{index1 + 1}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.service_name || "No Name"}</p>
                              <p className="text-xs text-gray-500">ID: {item.id}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${getGenderColor(item.gender)}`}>
                              {getGenderIcon(item.gender)}
                              <span className="font-medium capitalize">
                                {item.gender || "Not specified"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{formatTime(item.service_time)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-gray-900 text-sm">₹{item.price || "-"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                title="Edit Service"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                             
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Loading More Indicator */}
            {serviceLoading && page > 1 && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="text-sm text-gray-600">Loading more...</span>
                </div>
              </div>
            )}
          </div>
        ) : !serviceLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 text-center text-sm max-w-xs mb-4">
              No services match your filters
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
              >
                Adjust Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-sm">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">Edit Service</h2>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="service_name"
                    value={editForm.service_name}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                    placeholder="Service name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Price (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Gender
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <select
                        name="gender"
                        value={editForm.gender}
                        onChange={handleEditChange}
                        className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm appearance-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unisex">Unisex</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Service Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Days</label>
                      <input
                        type="number"
                        name="service_time.days"
                        value={editForm.service_time.days}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Hours</label>
                      <input
                        type="number"
                        name="service_time.hours"
                        value={editForm.service_time.hours}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mins</label>
                      <input
                        type="number"
                        name="service_time.minutes"
                        value={editForm.service_time.minutes}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Seats</label>
                      <input
                        type="number"
                        name="service_time.seating"
                        value={editForm.service_time.seating}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;