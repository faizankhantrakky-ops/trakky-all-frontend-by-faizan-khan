import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit2,
  Search,
  Calendar,
  Phone,
  User,
  Shield,
  LogOut,
  Mail,
  MapPin,
  IndianRupee,
  Trash2,
  Upload,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  Briefcase,
  Clock,
  Award,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import dayjs from "dayjs";

const SettingsManager = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [leaveDateOpen, setLeaveDateOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedManagerForView, setSelectedManagerForView] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [leaveDate, setLeaveDate] = useState("");
  
  // Mobile states
  const [expandedManager, setExpandedManager] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Roles list
  const ListOfRoles = [
    "Junior Hair Stylist",
    "Senior Hair Stylist",
    "Intern Hair Stylist",
    "Makeup Artist",
    "Nail Technician",
    "Salon Coordinator",
  ];


  let branchId = localStorage.getItem("branchId") || "";


  const FormFeilds = {
    managername: "",
    ph_number: "",
    email: "",
    address: "",
    joining_date: dayjs().format("YYYY-MM-DD"),
    gender: "Male",
    salary: "0.00",
    amount_paid: "0.00",
    job_role: "Manager Only",
    additional_role: "",
    employment_status: "Permanent",
    id_proof: null,
    commission_slab: [],
    commission_slab_for_product: [],
    // branchId : branchId
  };

  const [newManager, setManager] = useState(FormFeilds);
  const [editingManager, setEditingManager] = useState(FormFeilds);

  // Fetch Vendor Data
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    const fetchVendorData = async () => {
      if (!user?.user_id) return;
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setVendorData(jsonData);
        }
      } catch (error) {
        console.error("Fetch vendor error:", error);
      }
    };
    fetchVendorData();
  }, [user?.user_id]);

  // Fetch Managers
  const fetchManagerData = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/manager/", {
        headers: { Authorization: `Bearer ${authTokens.access_token}` },
      });
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData);
      }
    } catch (error) {
      toast.error("Error fetching managers");
    }
  };

  useEffect(() => {
    if (authTokens) fetchManagerData();
  }, [authTokens]);

  useEffect(() => {
    const filtered = data.filter(
      (manager) =>
        manager.managername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manager.ph_number?.includes(searchQuery) ||
        manager.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const handleAddClose = () => {
    setAddOpen(false);
    setManager(FormFeilds);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingManager(FormFeilds);
  };

  const handleViewDetails = (manager) => {
    setSelectedManagerForView(manager);
    setViewDetailsOpen(true);
  };

  const closeViewDetails = () => {
    setViewDetailsOpen(false);
    setSelectedManagerForView(null);
  };

  const addCommissionSlab = (type, isEdit = false) => {
    const newSlab = { percentage: "", min: "", max: "" };
    if (!isEdit) {
      if (type === "service") {
        setManager((prev) => ({
          ...prev,
          commission_slab: [...prev.commission_slab, newSlab],
        }));
      } else {
        setManager((prev) => ({
          ...prev,
          commission_slab_for_product: [...prev.commission_slab_for_product, newSlab],
        }));
      }
    } else {
      if (type === "service") {
        setEditingManager((prev) => ({
          ...prev,
          commission_slab: [...prev.commission_slab, newSlab],
        }));
      } else {
        setEditingManager((prev) => ({
          ...prev,
          commission_slab_for_product: [...prev.commission_slab_for_product, newSlab],
        }));
      }
    }
  };

  const removeCommissionSlab = (index, type, isEdit = false) => {
    if (!isEdit) {
      if (type === "service") {
        setManager((prev) => ({
          ...prev,
          commission_slab: prev.commission_slab.filter((_, i) => i !== index),
        }));
      } else {
        setManager((prev) => ({
          ...prev,
          commission_slab_for_product: prev.commission_slab_for_product.filter((_, i) => i !== index),
        }));
      }
    } else {
      if (type === "service") {
        setEditingManager((prev) => ({
          ...prev,
          commission_slab: prev.commission_slab.filter((_, i) => i !== index),
        }));
      } else {
        setEditingManager((prev) => ({
          ...prev,
          commission_slab_for_product: prev.commission_slab_for_product.filter((_, i) => i !== index),
        }));
      }
    }
  };

  const handleCommissionChange = (index, field, value, type, isEdit = false) => {
    if (!isEdit) {
      if (type === "service") {
        setManager((prev) => {
          const updated = [...prev.commission_slab];
          updated[index][field] = value;
          return { ...prev, commission_slab: updated };
        });
      } else {
        setManager((prev) => {
          const updated = [...prev.commission_slab_for_product];
          updated[index][field] = value;
          return { ...prev, commission_slab_for_product: updated };
        });
      }
    } else {
      if (type === "service") {
        setEditingManager((prev) => {
          const updated = [...prev.commission_slab];
          updated[index][field] = value;
          return { ...prev, commission_slab: updated };
        });
      } else {
        setEditingManager((prev) => {
          const updated = [...prev.commission_slab_for_product];
          updated[index][field] = value;
          return { ...prev, commission_slab_for_product: updated };
        });
      }
    }
  };

  const PrepareFormData = (formState) => {
    const formData = new FormData();
    formData.append("managername", formState.managername);
    formData.append("ph_number", formState.ph_number || "");
    formData.append("email", formState.email);
    formData.append("address", formState.address || "");
    formData.append("joining_date", formState.joining_date);
    formData.append("gender", formState.gender);
    formData.append("salary", formState.salary);
    formData.append("amount_paid", formState.amount_paid);
    formData.append("employment_status", formState.employment_status);

    if (formState.job_role !== "Manager Only") {
      formData.append("staff_role", formState.additional_role || formState.job_role);
    }

    if (formState.id_proof instanceof File) {
      formData.append("id_proof", formState.id_proof);
    }

    if (formState.commission_slab.length > 0) {
      formData.append("commission_slab", JSON.stringify(formState.commission_slab.map(slab => ({
        [`${slab.percentage}%`]: `${slab.min}-${slab.max}`
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {})));
    }
    if (formState.commission_slab_for_product.length > 0) {
      formData.append("commission_slab_for_product", JSON.stringify(formState.commission_slab_for_product.map(slab => ({
        [`${slab.percentage}%`]: `${slab.min}-${slab.max}`
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {})));
    }

    return formData;
  };

  const addManager = async () => {
    if (!newManager.managername.trim()) return toast.error("Manager name is required");
    if (!newManager.email.trim()) return toast.error("Email is required");
    if (!newManager.address.trim()) return toast.error("Address is required");
    if (newManager.ph_number && !/^\d{10}$/.test(newManager.ph_number)) return toast.error("Phone number must be 10 digits");

    const formData = PrepareFormData(newManager);

    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/manager/", {
        method: "POST",
        headers: { Authorization: `Bearer ${authTokens.access_token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Manager added successfully");
        fetchManagerData();
        handleAddClose();
      } else {
        const err = await response.json();
        toast.error(err.detail || "Failed to add manager");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleEditOpen = (manager) => {
    setEditingManager({
      id: manager.id,
      managername: manager.managername || "",
      ph_number: manager.ph_number || "",
      email: manager.email || "",
      address: manager.address || "",
      joining_date: manager.joining_date || dayjs().format("YYYY-MM-DD"),
      gender: manager.gender || "Male",
      salary: manager.salary || "0.00",
      amount_paid: manager.amount_paid || "0.00",
      job_role: manager.staff_role ? "Manager + Stylist" : "Manager Only",
      additional_role: manager.staff_role || "",
      employment_status: manager.is_permanent ? "Permanent" : "Temporary",
      id_proof: null,
      commission_slab: manager.commission_slab ? Object.entries(manager.commission_slab).map(([percentage, range]) => ({
        percentage: percentage.replace("%", ""),
        min: range.split("-")[0],
        max: range.split("-")[1],
      })) : [],
      commission_slab_for_product: manager.commission_slab_for_product ? Object.entries(manager.commission_slab_for_product).map(([percentage, range]) => ({
        percentage: percentage.replace("%", ""),
        min: range.split("-")[0],
        max: range.split("-")[1],
      })) : [],
    });
    setEditOpen(true);
  };

  const updateManager = async () => {
    if (!editingManager.managername.trim()) return toast.error("Manager name is required");
    if (!editingManager.email.trim()) return toast.error("Email is required");
    if (!editingManager.address.trim()) return toast.error("Address is required");
    if (editingManager.ph_number && !/^\d{10}$/.test(editingManager.ph_number)) return toast.error("Phone number must be 10 digits");

    const formData = PrepareFormData(editingManager);

    try {
      const response = await fetch(`https://backendapi.trakky.in/salonvendor/manager/${editingManager.id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authTokens.access_token}` },
        body: formData,
      });

      if (response.ok) {
        toast.success("Manager updated successfully");
        fetchManagerData();
        handleEditClose();
      } else {
        const err = await response.json();
        toast.error(err.detail || "Failed to update manager");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleLeaveDateOpen = (manager) => {
    setSelectedManagerId(manager.id);
    setLeaveDate(manager.leave_date || "");
    setLeaveDateOpen(true);
  };

  const handleLeaveDateClose = () => {
    setLeaveDateOpen(false);
    setSelectedManagerId(null);
    setLeaveDate("");
  };

  const updateLeaveDate = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/manager/${selectedManagerId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ leave_date: leaveDate || null }),
        }
      );
      if (response.ok) {
        toast.success("Leave date updated");
        fetchManagerData();
        handleLeaveDateClose();
      } else {
        toast.error("Failed to update leave date");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const validatePhoneNumber = (value) => /^\d{0,10}$/.test(value);

  // Mobile Card Component
  const MobileManagerCard = ({ manager, index }) => {
    const isExpanded = expandedManager === manager.id;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#492DBD] to-[#6b4bd4] rounded-xl flex items-center justify-center text-white font-semibold">
                {manager.managername?.charAt(0) || 'M'}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{manager.managername}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                    ID: {manager.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    manager.employment_status === 'Permanent' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {manager.employment_status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setExpandedManager(isExpanded ? null : manager.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {manager.ph_number && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{manager.ph_number}</span>
              </div>
            )}
            {manager.email && (
              <div className="flex items-center space-x-2 text-xs text-gray-600 truncate">
                <Mail className="w-3 h-3" />
                <span className="truncate">{manager.email}</span>
              </div>
            )}
            {manager.joining_date && (
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{dayjs(manager.joining_date).format("DD/MM/YY")}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <LogOut className="w-3 h-3" />
              <span>{manager.leave_date ? dayjs(manager.leave_date).format("DD/MM/YY") : "Active"}</span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {manager.address && (
                <div className="flex items-start space-x-2 text-xs">
                  <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{manager.address}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-xs">
                <IndianRupee className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">Salary: ₹{manager.salary}</span>
                {manager.amount_paid && manager.amount_paid !== "0.00" && (
                  <span className="text-gray-600">Paid: ₹{manager.amount_paid}</span>
                )}
              </div>

              {manager.staff_role && (
                <div className="flex items-center space-x-2 text-xs">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Role: {manager.staff_role}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(manager)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditOpen(manager)}
                  className="px-4 py-2 bg-[#492DBD] text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleLeaveDateOpen(manager)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Leave</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Manager Details Modal Component
  const ManagerDetailsModal = ({ manager, onClose }) => {
    const getStatusColor = () => {
      if (manager.leave_date) return "text-orange-600 bg-orange-50";
      return "text-green-600 bg-green-50";
    };

    const getStatusIcon = () => {
      if (manager.leave_date) return <AlertCircle className="w-5 h-5" />;
      return <CheckCircle className="w-5 h-5" />;
    };

    const getStatusText = () => {
      if (manager.leave_date) return "On Leave";
      return "Active";
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#492DBD] to-[#6b4bd4] rounded-xl">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Manager Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Complete information and performance metrics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#492DBD] to-[#6b4bd4] rounded-xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#492DBD] font-bold text-3xl shadow-lg">
                  {manager.managername?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{manager.managername}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      ID: {manager.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor()}`}>
                      {getStatusIcon()}
                      <span>{getStatusText()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-[#492DBD]" />
                  <h4 className="text-sm font-semibold text-gray-700">Contact Details</h4>
                </div>
                <div className="space-y-2">
                  {manager.ph_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{manager.ph_number}</span>
                    </div>
                  )}
                  {manager.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600 break-all">{manager.email}</span>
                    </div>
                  )}
                  {manager.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                      <span className="text-gray-600">{manager.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[#492DBD]" />
                  <h4 className="text-sm font-semibold text-gray-700">Employment Details</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Joining Date:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {manager.joining_date ? dayjs(manager.joining_date).format("DD MMM YYYY") : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Employment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      manager.employment_status === 'Permanent' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {manager.employment_status}
                    </span>
                  </div>
                  {manager.leave_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Leave Date:</span>
                      <span className="text-sm font-medium text-orange-600">
                        {dayjs(manager.leave_date).format("DD MMM YYYY")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <h4 className="text-sm font-semibold text-gray-700">Salary Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Salary:</span>
                    <span className="text-lg font-bold text-green-700">₹{manager.salary}</span>
                  </div>
                  {manager.amount_paid && manager.amount_paid !== "0.00" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Amount Paid:</span>
                      <span className="text-sm font-medium text-green-600">₹{manager.amount_paid}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-700">Role Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Job Role:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {manager.staff_role ? "Manager + Stylist" : "Manager Only"}
                    </span>
                  </div>
                  {manager.staff_role && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stylist Role:</span>
                      <span className="text-sm font-medium text-blue-700">{manager.staff_role}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gender:</span>
                    <span className="text-sm font-medium text-gray-700">{manager.gender || "Not specified"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Slabs - if applicable */}
            {(manager.commission_slab && Object.keys(manager.commission_slab).length > 0) ||
             (manager.commission_slab_for_product && Object.keys(manager.commission_slab_for_product).length > 0) ? (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#492DBD]" />
                  Commission Structure
                </h4>
                
                {manager.commission_slab && Object.keys(manager.commission_slab).length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Service Commission Slabs</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(manager.commission_slab).map(([percentage, range], idx) => (
                        <div key={idx} className="bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-purple-700">{percentage}</span>
                            <span className="text-xs text-gray-600">Revenue: {range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {manager.commission_slab_for_product && Object.keys(manager.commission_slab_for_product).length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Product Commission Slabs</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(manager.commission_slab_for_product).map(([percentage, range], idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-blue-700">{percentage}</span>
                            <span className="text-xs text-gray-600">Revenue: {range}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : manager.staff_role ? (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">No commission slabs configured for this stylist.</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                handleEditOpen(manager);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#492DBD] rounded-lg hover:bg-[#3a2199] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Manager
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Mobile Filter Modal */}
      {mobileFilterOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter Managers</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-1">
        {/* Software Details Card - Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#492DBD] rounded-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Software Subscription</h3>
              <p className="text-xs sm:text-sm text-gray-500">Your current subscription information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Software Starting Date</div>
              <div className="text-sm sm:text-base font-semibold text-gray-900">
                {vendorData?.software_start_date
                  ? dayjs(vendorData.software_start_date).format("DD-MM-YYYY")
                  : "Not Set"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Renewal Date</div>
              <div className="text-sm sm:text-base font-semibold text-gray-900">
                {vendorData?.software_end_date
                  ? dayjs(vendorData.software_end_date).format("DD-MM-YYYY")
                  : "Not Set"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Duration (Months)</div>
              <div className="text-sm sm:text-base font-semibold text-gray-900">
                {vendorData?.duration_in_months ?? "Not Set"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Manager List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#492DBD] rounded-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Manager Settings</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Manage your team managers</p>
                </div>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center justify-center space-x-2 bg-[#492DBD] text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3a2199] transition-colors"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Add Manager</span>
              </button>
            </div>
          </div>

          {/* Search - Desktop */}
          {!isMobile && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone or email..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Search - Mobile */}
          {isMobile && (
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl text-left text-sm text-gray-500"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search managers...</span>
                </div>
                <span className="text-xs text-gray-400">{filteredData.length} found</span>
              </button>
            </div>
          )}

          {/* Desktop Table View */}
          {!isMobile && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Phone</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Joining</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Leave</th>
                    <th className="text-left p-4 text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((manager) => (
                      <tr key={manager.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-xs sm:text-sm">{manager.id}</td>
                        <td className="p-4 text-xs sm:text-sm font-medium">{manager.managername}</td>
                        <td className="p-4 text-xs sm:text-sm">{manager.ph_number || "N/A"}</td>
                        <td className="p-4 text-xs sm:text-sm truncate max-w-[150px]">{manager.email || "N/A"}</td>
                        <td className="p-4 text-xs sm:text-sm">
                          {manager.joining_date ? dayjs(manager.joining_date).format("DD-MM-YYYY") : "N/A"}
                        </td>
                        <td className="p-4 text-xs sm:text-sm">
                          <span className={manager.leave_date ? 'text-orange-600' : 'text-green-600'}>
                            {manager.leave_date ? dayjs(manager.leave_date).format("DD-MM-YYYY") : "Active"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleViewDetails(manager)} 
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditOpen(manager)} 
                              className="p-1.5 text-[#492DBD] hover:bg-[#492DBD]/10 rounded-lg transition-colors"
                              title="Edit Manager"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleLeaveDateOpen(manager)} 
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Set Leave Date"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500 text-sm">
                        No managers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <div className="p-4">
              {filteredData.length > 0 ? (
                filteredData.map((manager, index) => (
                  <MobileManagerCard key={manager.id} manager={manager} index={index} />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No managers found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Manager Modal - Responsive */}
      {addOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header - Sticky */}
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-20 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold">Add New Manager</h3>
              <button 
                onClick={handleAddClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Basic Info */}
              <div>
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Manager Name *</label>
                      <input
                        type="text"
                        value={newManager.managername}
                        onChange={(e) => setManager({ ...newManager, managername: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={newManager.ph_number}
                          onChange={(e) =>
                            validatePhoneNumber(e.target.value) &&
                            setManager({ ...newManager, ph_number: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                          placeholder="10 digits"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={newManager.email}
                          onChange={(e) => setManager({ ...newManager, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                          placeholder="manager@example.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <textarea
                        value={newManager.address}
                        onChange={(e) => setManager({ ...newManager, address: e.target.value })}
                        rows="2"
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Job Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Job Role *</label>
                    <select
                      value={newManager.job_role}
                      onChange={(e) => setManager({ ...newManager, job_role: e.target.value, additional_role: "" })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                    >
                      <option value="Manager Only">Manager Only</option>
                      <option value="Manager + Stylist">Manager + Stylist Work</option>
                    </select>
                  </div>

                  {newManager.job_role !== "Manager Only" && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Stylist Role *</label>
                      <select
                        value={newManager.additional_role}
                        onChange={(e) => setManager({ ...newManager, additional_role: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                      >
                        <option value="">Select role</option>
                        {ListOfRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or enter new role name"
                        onChange={(e) => setManager({ ...newManager, additional_role: e.target.value })}
                        className="w-full mt-2 px-3 sm:px-4 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Employment Status</label>
                    <select
                      value={newManager.employment_status}
                      onChange={(e) => setManager({ ...newManager, employment_status: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg"
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Gender *</label>
                    <select
                      value={newManager.gender}
                      onChange={(e) => setManager({ ...newManager, gender: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Salary *</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={newManager.salary}
                        onChange={(e) => setManager({ ...newManager, salary: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Amount Paid</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={newManager.amount_paid}
                        onChange={(e) => setManager({ ...newManager, amount_paid: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Joining Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={newManager.joining_date}
                        onChange={(e) => setManager({ ...newManager, joining_date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Proof Upload - Mobile Optimized */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Upload ID Proof (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#492DBD] transition group">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setManager({ ...newManager, id_proof: e.target.files[0] })}
                    className="hidden"
                  />
                  <div className="text-center px-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 group-hover:text-[#492DBD] transition" />
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 break-all">
                      {newManager.id_proof ? newManager.id_proof.name : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                  </div>
                </label>
              </div>

              {/* Commission Slabs - Only if stylist */}
              {newManager.job_role !== "Manager Only" && (
                <div>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                      <span>Commission Slabs (Optional)</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Set commission percentages for different revenue ranges</p>
                  </div>

                  {/* Service Commission */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm sm:text-md font-semibold text-gray-800">Service Commission</h3>
                      <button
                        type="button"
                        onClick={() => addCommissionSlab("service")}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Add Slab</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newManager.commission_slab.map((slab, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="%"
                              value={slab.percentage}
                              onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "service")}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <span className="text-xs sm:text-sm text-gray-500">% for</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={slab.min}
                              onChange={(e) => handleCommissionChange(index, "min", e.target.value, "service")}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <span className="text-xs sm:text-sm text-gray-500">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={slab.max}
                              onChange={(e) => handleCommissionChange(index, "max", e.target.value, "service")}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <button
                              type="button"
                              onClick={() => removeCommissionSlab(index, "service")}
                              className="p-1 text-red-500 hover:text-red-700 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Commission */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm sm:text-md font-semibold text-gray-800">Product Commission</h3>
                      <button
                        type="button"
                        onClick={() => addCommissionSlab("product")}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Add Slab</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newManager.commission_slab_for_product.map((slab, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="%"
                              value={slab.percentage}
                              onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "product")}
                              className="w-20 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-xs sm:text-sm text-blue-600">% for</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={slab.min}
                              onChange={(e) => handleCommissionChange(index, "min", e.target.value, "product")}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-xs sm:text-sm text-blue-600">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={slab.max}
                              onChange={(e) => handleCommissionChange(index, "max", e.target.value, "product")}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeCommissionSlab(index, "product")}
                              className="p-1 text-red-500 hover:text-red-700 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Sticky */}
            <div className="p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
              <button
                onClick={handleAddClose}
                className="px-4 sm:px-6 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={addManager}
                className="px-4 sm:px-6 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors order-1 sm:order-2"
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Manager Modal - Similar responsive changes */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-20 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold">Edit Manager</h3>
              <button 
                onClick={handleEditClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Same fields as Add Modal but with editingManager state */}
              <div>
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Manager Name *</label>
                      <input
                        type="text"
                        value={editingManager.managername}
                        onChange={(e) => setEditingManager({ ...editingManager, managername: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editingManager.ph_number}
                          onChange={(e) =>
                            validatePhoneNumber(e.target.value) &&
                            setEditingManager({ ...editingManager, ph_number: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={editingManager.email}
                          onChange={(e) => setEditingManager({ ...editingManager, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <textarea
                        value={editingManager.address}
                        onChange={(e) => setEditingManager({ ...editingManager, address: e.target.value })}
                        rows="2"
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Job Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Job Role *</label>
                    <select
                      value={editingManager.job_role}
                      onChange={(e) => setEditingManager({ ...editingManager, job_role: e.target.value, additional_role: "" })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                    >
                      <option value="Manager Only">Manager Only</option>
                      <option value="Manager + Stylist">Manager + Stylist Work</option>
                    </select>
                  </div>

                  {editingManager.job_role !== "Manager Only" && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1">Stylist Role *</label>
                      <select
                        value={editingManager.additional_role}
                        onChange={(e) => setEditingManager({ ...editingManager, additional_role: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                      >
                        <option value="">Select role</option>
                        {ListOfRoles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or enter new role name"
                        onChange={(e) => setEditingManager({ ...editingManager, additional_role: e.target.value })}
                        className="w-full mt-2 px-3 sm:px-4 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Employment Status</label>
                    <select
                      value={editingManager.employment_status}
                      onChange={(e) => setEditingManager({ ...editingManager, employment_status: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg"
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Gender *</label>
                    <select
                      value={editingManager.gender}
                      onChange={(e) => setEditingManager({ ...editingManager, gender: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm border rounded-lg"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Salary *</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={editingManager.salary}
                        onChange={(e) => setEditingManager({ ...editingManager, salary: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Amount Paid</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={editingManager.amount_paid}
                        onChange={(e) => setEditingManager({ ...editingManager, amount_paid: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Joining Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={editingManager.joining_date}
                        onChange={(e) => setEditingManager({ ...editingManager, joining_date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Proof Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Upload ID Proof (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#492DBD] transition group">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setEditingManager({ ...editingManager, id_proof: e.target.files[0] })}
                    className="hidden"
                  />
                  <div className="text-center px-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 group-hover:text-[#492DBD] transition" />
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 break-all">
                      {editingManager.id_proof ? editingManager.id_proof.name : "Click to upload new (replaces existing)"}
                    </p>
                  </div>
                </label>
              </div>

              {/* Commission Slabs - Similar to Add Modal with isEdit=true */}
              {editingManager.job_role !== "Manager Only" && (
                <div>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                      <span>Commission Slabs</span>
                    </h2>
                  </div>

                  {/* Service Commission */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm sm:text-md font-semibold text-gray-800">Service Commission</h3>
                      <button
                        type="button"
                        onClick={() => addCommissionSlab("service", true)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Add Slab</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingManager.commission_slab.map((slab, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="%"
                              value={slab.percentage}
                              onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "service", true)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <span className="text-xs sm:text-sm text-gray-500">% for</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={slab.min}
                              onChange={(e) => handleCommissionChange(index, "min", e.target.value, "service", true)}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <span className="text-xs sm:text-sm text-gray-500">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={slab.max}
                              onChange={(e) => handleCommissionChange(index, "max", e.target.value, "service", true)}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD]"
                            />
                            <button
                              type="button"
                              onClick={() => removeCommissionSlab(index, "service", true)}
                              className="p-1 text-red-500 hover:text-red-700 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Commission */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm sm:text-md font-semibold text-gray-800">Product Commission</h3>
                      <button
                        type="button"
                        onClick={() => addCommissionSlab("product", true)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Add Slab</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editingManager.commission_slab_for_product.map((slab, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="%"
                              value={slab.percentage}
                              onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "product", true)}
                              className="w-20 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-xs sm:text-sm text-blue-600">% for</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={slab.min}
                              onChange={(e) => handleCommissionChange(index, "min", e.target.value, "product", true)}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-xs sm:text-sm text-blue-600">to</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={slab.max}
                              onChange={(e) => handleCommissionChange(index, "max", e.target.value, "product", true)}
                              className="w-20 sm:w-24 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeCommissionSlab(index, "product", true)}
                              className="p-1 text-red-500 hover:text-red-700 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
              <button
                onClick={handleEditClose}
                className="px-4 sm:px-6 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={updateManager}
                className="px-4 sm:px-6 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors order-1 sm:order-2"
              >
                Update Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manager Details View Modal */}
      {viewDetailsOpen && selectedManagerForView && (
        <ManagerDetailsModal 
          manager={selectedManagerForView} 
          onClose={closeViewDetails} 
        />
      )}

      {/* Leave Date Modal - Responsive */}
      {leaveDateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-auto">
            <div className="p-4 sm:p-6 border-b flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Set Leave Date</h3>
              <button 
                onClick={handleLeaveDateClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Leave empty to mark as active
              </p>
            </div>
            <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
              <button 
                onClick={handleLeaveDateClose} 
                className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                onClick={updateLeaveDate} 
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
              >
                Update Leave Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsManager;