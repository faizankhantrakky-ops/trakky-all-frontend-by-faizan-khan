import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download,
  User,
  Users,
  Tag,
  ChevronDown,
  Loader2,
  AlertTriangle,
  X,
  FileText,
  Hash,
  ChevronRight,
  Menu,
  MoreHorizontal,
  ArrowUpDown
} from "lucide-react";

const CategoryRequest = () => {
  const [categoryRequestData, setCategoryRequestData] = useState([]);
  const [categoryRequestDataLoading, setCategoryRequestDataLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    categoryName: "",
    gender: "",
    status: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    gender: "",
    description: ""
  });

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      categoryName: "",
      gender: "",
      status: "",
    });
    setShowFilters(false);
    setMobileFilterOpen(false);
  };

    let branchId = localStorage.getItem("branchId") || "";



  const getCategoryRequestData = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    
    setCategoryRequestDataLoading(true);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/category-request/",
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
        setCategoryRequestData(sortedData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch category requests");
    } finally {
      setCategoryRequestDataLoading(false);
    }
  };

  useEffect(() => {
    let result = categoryRequestData;

    if (filters.categoryName) {
      result = result.filter((item) =>
        item.category_name
          .toLowerCase()
          .includes(filters.categoryName.toLowerCase())
      );
    }

    if (filters.gender) {
      result = result.filter(
        (item) => item.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.status) {
      result = result.filter((item) => item.category_status === filters.status);
    }

    setFilteredData(result);
  }, [categoryRequestData, filters]);

  useEffect(() => {
    getCategoryRequestData();
  }, []);

  const deleteCategoryRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category request?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/category-request/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Category request deleted successfully");
        setCategoryRequestData(
          categoryRequestData.filter((item) => item.id !== id)
        );
      } else {
        toast.error("Failed to delete category request");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-3 h-3" />,
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          label: "Pending"
        };
      case "approved":
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          label: "Approved"
        };
      case "rejected":
        return {
          icon: <XCircle className="w-3 h-3" />,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          label: "Rejected"
        };
      default:
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          label: "Unknown"
        };
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <User className="w-3 h-3" />;
      case "female":
        return <Users className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "female":
        return "text-pink-600 bg-pink-50 border-pink-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeBadge = (fromMaster) => {
    return fromMaster 
      ? {
          icon: <Tag className="w-3 h-3" />,
          bg: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
          label: "From Master"
        }
      : {
          icon: <Tag className="w-3 h-3" />,
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          label: "New Created"
        };
  };

  const getStats = () => {
    const total = categoryRequestData.length;
    const pending = categoryRequestData.filter(item => item.category_status === 'pending').length;
    const approved = categoryRequestData.filter(item => item.category_status === 'approved').length;
    const rejected = categoryRequestData.filter(item => item.category_status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const handleAddCategory = async () => {
    if (!newCategory.category_name || !newCategory.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/category-request/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            category_name: newCategory.category_name,
            gender: newCategory.gender,
            description: newCategory.description || "",
            // branchId :branchId
          }),
        }
      );

      if (response?.ok) {
        toast.success("Category request submitted successfully");
        setShowAddModal(false);
        setNewCategory({
          category_name: "",
          gender: "",
          description: ""
        });
        getCategoryRequestData();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit request: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
    }
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
      
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#492DBD]" />
              <div>
                <h1 className="text-base font-bold text-gray-900">Category Requests</h1>
                <p className="text-xs text-gray-600">
                  {filteredData.length} requests
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={getCategoryRequestData}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 rounded-lg bg-[#492DBD] text-white hover:bg-[#3a2199]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-start gap-4 border-l-4 border-[#492DBD] pl-3">
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">Category Requests</h1>
                  <p className="text-xs text-gray-600">
                    Manage approval Requests
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border ${showFilters ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
                title="Filter Requests"
              >
                <Filter className={`w-4 h-4 ${showFilters ? "text-indigo-600" : "text-gray-600"}`} />
              </button>

              {/* Filter Dropdown - Desktop */}
              {showFilters && !isMobile && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-800">Filter Requests</h3>
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
                          value={filters.categoryName}
                          onChange={(e) => handleFilterChange("categoryName", e.target.value)}
                          placeholder="Search categories..."
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={filters.gender}
                            onChange={(e) => handleFilterChange("gender", e.target.value)}
                            className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white appearance-none"
                          >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        
                        <div className="relative">
                          <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white appearance-none"
                          >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Active Filters */}
                    {(filters.categoryName || filters.gender || filters.status) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600">Active:</span>
                        {filters.categoryName && (
                          <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-200">
                            <span>{filters.categoryName}</span>
                            <button
                              onClick={() => handleFilterChange("categoryName", "")}
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
                              onClick={() => handleFilterChange("gender", "")}
                              className="ml-1 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {filters.status && (
                          <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs border border-purple-200">
                            <span>{filters.status}</span>
                            <button
                              onClick={() => handleFilterChange("status", "")}
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
                onClick={getCategoryRequestData}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1"
                title="Add Category"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Add new</span>
              </button>
            </div>
          </div>

          {/* Compact Stats - Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-base font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-1.5 rounded-md bg-indigo-50">
                  <Tag className="w-3 h-3 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Pending</p>
                  <p className="text-base font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-1.5 rounded-md bg-yellow-50">
                  <Clock className="w-3 h-3 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Approved</p>
                  <p className="text-base font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="p-1.5 rounded-md bg-green-50">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Rejected</p>
                  <p className="text-base font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="p-1.5 rounded-md bg-red-50">
                  <XCircle className="w-3 h-3 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Panel */}
      {isMobile && mobileFilterOpen && (
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-800">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.categoryName}
                    onChange={(e) => handleFilterChange("categoryName", e.target.value)}
                    placeholder="Category name..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange("gender", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Stats */}
      {isMobile && (
        <div className="grid grid-cols-4 gap-2 p-3 bg-white border-b border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-3 md:p-4 lg:p-6">
        {/* Table Container */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-3 md:px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-sm font-medium text-gray-800">Category Requests</h3>
              <p className="text-xs text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{categoryRequestData.length}</span>
              </p>
            </div>
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  {selectedRows.length} selected
                </span>
                <button className="flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs">
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Table Content */}
          {categoryRequestDataLoading ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 animate-spin mb-2 md:mb-3" />
              <p className="text-xs md:text-sm text-gray-600 font-medium">Loading requests...</p>
            </div>
          ) : filteredData?.length > 0 ? (
            <>
              {/* Mobile Card View */}
              {isMobile ? (
                <div className="divide-y divide-gray-100">
                  {filteredData?.map((item, index) => {
                    const statusBadge = getStatusBadge(item.category_status);
                    const typeBadge = getTypeBadge(item.from_master);
                    
                    return (
                      <div 
                        key={item.id}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100">
                              <span className="font-medium text-xs text-gray-700">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{item.category_name}</p>
                              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs mt-1 ${typeBadge.bg} ${typeBadge.text}`}>
                                {typeBadge.icon}
                                <span>{typeBadge.label}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteCategoryRequest(item.id)}
                              className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                              title="Delete Request"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getGenderColor(item.gender)}`}>
                            {getGenderIcon(item.gender)}
                            <span className="font-medium capitalize truncate">
                              {item.gender || "Not specified"}
                            </span>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.icon}
                            <span className="font-medium truncate">
                              {statusBadge.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Desktop Table View */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData?.map((item, index) => {
                        const statusBadge = getStatusBadge(item.category_status);
                        const typeBadge = getTypeBadge(item.from_master);
                        
                        return (
                          <tr 
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100">
                                <span className="font-medium text-xs text-gray-700">{index + 1}</span>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{item.category_name}</p>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs mt-1 ${typeBadge.bg} ${typeBadge.text}`}>
                                  {typeBadge.icon}
                                  <span>{typeBadge.label}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${getGenderColor(item.gender)}`}>
                                {getGenderIcon(item.gender)}
                                <span className="font-medium capitalize">
                                  {item.gender || "Not specified"}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                {statusBadge.icon}
                                <span className="font-medium">
                                  {statusBadge.label}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">{formatDate(item.created_at)}</span>
                              </div>
                            </td>
                            <td className="py-2 md:py-3 px-3 md:px-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => deleteCategoryRequest(item.id)}
                                  className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                                  title="Delete Request"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 md:mb-3">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2">No Requests Found</h3>
              <p className="text-gray-600 text-center text-xs md:text-sm max-w-xs mb-3 md:mb-4">
                No requests match your current filters
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => isMobile ? setMobileFilterOpen(true) : setShowFilters(true)}
                  className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
                >
                  Adjust Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="px-2 py-1.5 md:px-3 md:py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          {/* Table Footer */}
          {filteredData?.length > 0 && (
            <div className="px-3 md:px-4 py-2 md:py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">{filteredData.length}</span> results
              </div>
              <button className="flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs">
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal - Responsive */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className={`bg-white rounded-lg md:rounded-xl w-full ${isMobile ? 'max-w-full' : 'max-w-sm'}`}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm md:text-base font-bold text-gray-900">Add New Category</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 md:p-4 space-y-2 md:space-y-3">
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={newCategory.category_name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, category_name: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm"
                      placeholder="Category name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <select
                      value={newCategory.gender}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unisex">Unisex</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-3 h-3 text-gray-400" />
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm min-h-[60px] md:min-h-[80px]"
                      placeholder="Description..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 md:pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryRequest;