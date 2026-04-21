import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  ArrowLeft,
  MoreVertical,
  Edit2,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  X,
  Clock,
  IndianRupee ,
  Users,
  User,
  Tag,
  AlertCircle,
  Loader2,
  ChevronDown,
  Plus,
} from "lucide-react";

const OffersRequest = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [offerRequestData, setOfferRequestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [offerRequestDataLoading, setOfferRequestDataLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [filters, setFilters] = useState({
    offerName: "",
    gender: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    actual_price: "",
    discounted_price: "",
    terms_and_conditions: "",
    serviceHours: "",
    serviceMinutes: "",
    serviceSeating: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ offerName: "", gender: "", status: "" });
    setShowFilters(false);
  };

  useEffect(() => {
    let result = [...offerRequestData];

    if (filters.offerName) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(filters.offerName.toLowerCase())
      );
    }
    if (filters.gender) {
      result = result.filter((item) => item.gender === filters.gender);
    }
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    setFilteredData(result);
  }, [offerRequestData, filters]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featchofferRequest = async () => {
                if (!navigator.onLine) {
            toast.error("No internet Connection");
            return;
          }
          
    setOfferRequestDataLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests/",
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
        setOfferRequestData(sortedData);
        setFilteredData(sortedData);
      }
    } catch (error) {
      toast.error("Failed to fetch offer requests");
    } finally {
      setOfferRequestDataLoading(false);
    }
  };

  useEffect(() => {
    featchofferRequest();
  }, []);

  const handleOpen = (data = null) => {
    setEditProductData(data);
    if (data) {
      setFormData({
        name: data.name || "",
        gender: data.gender || "",
        actual_price: data.actual_price || "",
        discounted_price: data.discounted_price || "",
        terms_and_conditions: data.terms_and_conditions || "",
        serviceHours: data.offer_timing?.hours || "",
        serviceMinutes: data.offer_timing?.minutes || "",
        serviceSeating: data.offer_timing?.seating || "",
      });
    } else {
      setFormData({
        name: "",
        gender: "",
        actual_price: "",
        discounted_price: "",
        terms_and_conditions: "",
        serviceHours: "",
        serviceMinutes: "",
        serviceSeating: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer request?")) return;
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Offer request deleted Successfully");
        setOfferRequestData((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error("Failed to delete offer request");
      }
    } catch (err) {
      toast.error("Error deleting offer request");
    }
  };

  const formateTime = (time) => {
    let str = "";
    if (time?.days && time.days != 0) str += time.days + " Days, ";
    if (time?.seating && time.seating != 0) str += time.seating + " Seating, ";
    if (time?.hours && time.hours != 0) str += time.hours + " Hours, ";
    if (time?.minutes && time.minutes != 0) str += time.minutes + " Minutes";
    return str || "N/A";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
      case "approved":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
      case "rejected":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/catalogue")}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Offer Requests</h1>
              <p className="text-sm text-gray-600">Manage your offer approval requests</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border ${showFilters ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
              title="Filter Requests"
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
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search offer name..."
                      value={filters.offerName}
                      onChange={(e) => handleFilterChange("offerName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={filters.gender}
                        onChange={(e) => handleFilterChange("gender", e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {Object.values(filters).some((v) => v) && (
                    <div className="mt-3 flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Active:</span>
                      {filters.offerName && (
                        <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-200">
                          <span>{filters.offerName}</span>
                          <button
                            onClick={() => handleFilterChange("offerName", "")}
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
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
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
              onClick={() => featchofferRequest()}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>

            <button   
              onClick={() => handleOpen()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 text-sm md:flex"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Request</span>
            </button>

            {/* Mobile Menu */}
            <div className="md:hidden flex gap-2">
              <button className="p-2 rounded-lg border border-gray-200">
                <MoreVertical className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleOpen()}
                className="p-2 rounded-lg border border-gray-200"
              >
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4  overflow-x-auto">
        {offerRequestDataLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <span className="text-sm text-gray-600">Loading requests...</span>
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Offer Requests</h3>
                  <p className="text-xs text-gray-600">
                    Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{offerRequestData.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Offer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">City</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Original Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Discount Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Timing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Terms & Conditions</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item, index) => {
                    const statusBadge = getStatusBadge(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-sm text-gray-900">{index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize {item.gender === 'male' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}">
                            {item.gender === 'male' ? <User className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                            {item.gender || "Not specified"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{item.city || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">₹{item.actual_price || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-green-600">₹{item.discounted_price || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{formateTime(item.offer_timing)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 max-w-xs overflow-hidden" dangerouslySetInnerHTML={{ __html: item.terms_and_conditions || "No terms" }} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.text} ${statusBadge.bg} ${statusBadge.border}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.status === "pending" && (
                              <button
                                onClick={() => handleOpen(item)}
                                className="p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600 text-center mb-4">
              {Object.values(filters).some((v) => v) ? "Try adjusting your filters" : "No offer requests available"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
              >
                Adjust Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editProductData ? "Edit Offer Request" : "Add New Offer Request"}
              </h2>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded">
              </button>
            </div>
            <OfferAddPage handleClose={handleClose} editProductData={editProductData} refreshData={featchofferRequest} />
          </div>
        </div>
      )}
    </div>
  );
};

const OfferAddPage = ({ handleClose, editProductData, refreshData }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    actual_price: "",
    discounted_price: "",
    terms_and_conditions: "",
    serviceHours: "",
    serviceMinutes: "",
    serviceSeating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }, { list: "ordered" }],
          [{ color: [] }],
        ],
      },
    });
  }, []);

  useEffect(() => {
    if (editProductData) {
      setFormData({
        name: editProductData.name || "",
        gender: editProductData.gender || "",
        actual_price: editProductData.actual_price || "",
        discounted_price: editProductData.discounted_price || "",
        terms_and_conditions: editProductData.terms_and_conditions || "",
        serviceHours: editProductData.offer_timing?.hours || "",
        serviceMinutes: editProductData.offer_timing?.minutes || "",
        serviceSeating: editProductData.offer_timing?.seating || "",
      });
      if (editorRef.current) editorRef.current.root.innerHTML = editProductData.terms_and_conditions || "";
    }
  }, [editProductData]);


    let branchId = localStorage.getItem("branchId") || "";

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      gender: formData.gender,
      actual_price: Number(formData.actual_price),
      discounted_price: Number(formData.discounted_price),
      terms_and_conditions: editorRef.current ? editorRef.current.root.innerHTML : "",
      offer_timing: {
        hours: formData.serviceHours || 0,
        minutes: formData.serviceMinutes || 0,
        seating: formData.serviceSeating || 0,
      },
      vendor_id: vendorData?.id,
      salon: vendorData?.salon,
      // branchId: branchId,
    };

    try {
      const url = editProductData
        ? `https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests/${editProductData.id}/`
        : "https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests/";
      const method = editProductData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editProductData ? "Updated successfully" : "Created successfully");
        refreshData();
        setTimeout(handleClose, 1500);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save");
      }
    } catch (error) {
      toast.error("Error saving offer request");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Offer Name & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Offer Name</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) handleChange(e);
              }}
              placeholder="Enter offer name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Actual Price (₹)</label>
          <div className="relative">
            <IndianRupee  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="actual_price"
              value={formData.actual_price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (₹)</label>
          <div className="relative">
            <IndianRupee  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="discounted_price"
              value={formData.discounted_price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
        <div id="editor" className="border border-gray-300 rounded-lg min-h-[120px]"></div>
      </div>

      {/* Timing */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
          <input
            type="number"
            name="serviceHours"
            value={formData.serviceHours}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
          <input
            type="number"
            name="serviceMinutes"
            value={formData.serviceMinutes}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seating</label>
          <input
            type="number"
            name="serviceSeating"
            value={formData.serviceSeating}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {editProductData ? "Update" : "Create"} Request
        </button>
      </div>
    </div>
  );
};

export default OffersRequest;