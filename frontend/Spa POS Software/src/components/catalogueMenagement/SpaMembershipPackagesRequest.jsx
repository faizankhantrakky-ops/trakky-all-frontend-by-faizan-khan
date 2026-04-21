import React, { useContext } from "react";
import { useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniHeader from "./MiniHeader";
import CircularProgress from "@mui/material/CircularProgress";
import { Delete, Edit, Add, Search, Refresh, AccessTime, CalendarToday, LocalOffer } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import SpaIcon from "@mui/icons-material/Spa";

const SpaMembershipPackagesRequest = () => {
  const [packageRequestData, setPackageRequestData] = useState([]);
  const [packageRequestDataLoading, setpackageRequestDataLoading] = useState(true);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [page, setPage] = useState(1);
  const { authTokens, vendorData } = useContext(AuthContext);
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editMode, setEditMode] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [formData, setFormData] = useState({
    package_name: "",
    actual_price: "",
    discount_price: "",
    serviceHours: "",
    serviceMinutes: "",
    serviceSeating: "",
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.package_name.trim()) {
      errors.package_name = "Package name is required";
    }

    if (!selectedServices.length) {
      errors.services = "At least one service must be selected";
    }

    if (!formData.discount_price || isNaN(formData.discount_price) || formData.discount_price <= 0) {
      errors.discount_price = "Valid discount price is required";
    } else if (parseFloat(formData.discount_price) > parseFloat(formData.actual_price)) {
      errors.discount_price = "Discount price cannot be higher than actual price";
    }

    if (isNaN(formData.serviceHours) || formData.serviceHours < 0) {
      errors.serviceHours = "Hours must be a positive number";
    }

    if (isNaN(formData.serviceMinutes) || formData.serviceMinutes < 0 || formData.serviceMinutes >= 60) {
      errors.serviceMinutes = "Minutes must be between 0-59";
    }

    if (isNaN(formData.serviceSeating) || formData.serviceSeating < 0) {
      errors.serviceSeating = "Seating must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatTime = (time) => {
    let parts = [];
    if (time?.days && time?.days != 0) {
      parts.push(`${time.days} Day${time.days > 1 ? 's' : ''}`);
    }
    if (time?.seating && time?.seating != 0) {
      parts.push(`${time.seating} Seating${time.seating > 1 ? 's' : ''}`);
    }
    if (time?.hours && time?.hours != 0) {
      parts.push(`${time.hours} Hour${time.hours > 1 ? 's' : ''}`);
    }
    if (time?.minutes && time?.minutes != 0) {
      parts.push(`${time.minutes} Minute${time.minutes > 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  const fetchMassages = async () => {
    setServiceLoading(true);

    if (!vendorData?.spa) {
      toast.error("Spa information is missing. Please check your profile.");
      setServiceLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/service/?page=${page}&spa_id=${vendorData?.spa}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      const data = await response.json();

      if (page === 1) {
        setTempAllServices(data?.results || []);
      } else {
        setTempAllServices([...tempAllServices, ...(data?.results || [])]);
      }

      if (data?.next) {
        setPage(page + 1);
      }
    } catch (error) {
      toast.error(`Error loading services: ${error.message}`);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchMassages();
  }, [vendorData?.spa, page]);

  useEffect(() => {
    fetchPackageRequest();
  }, []);

  useEffect(() => {
    if (tempAllServices?.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    let filtered = packageRequestData;

    if (search) {
      filtered = filtered.filter(item =>
        item?.package_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item?.package_status === statusFilter);
    }

    setFilteredData(filtered);
  }, [search, statusFilter, packageRequestData]);

  const fetchPackageRequest = async () => {
    setpackageRequestDataLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/membership-package-request/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.statusText}`);
      }

      const data = await response.json();
      setPackageRequestData(data || []);
      setFilteredData(data || []);
    } catch (error) {
      toast.error(`Error loading packages: ${error.message}`);
    } finally {
      setpackageRequestDataLoading(false);
    }
  };

  const handleOpen = (productData) => {
    if (productData) {
      setEditMode(true);
      setFormData({
        package_name: productData.package_name,
        actual_price: productData.actual_price,
        discount_price: productData.discount_price,
        serviceHours: productData.offer_timing?.hours || 0,
        serviceMinutes: productData.offer_timing?.minutes || 0,
        serviceSeating: productData.offer_timing?.seating || 0,
      });
      setSelectedPackageId(productData.id);
      setSelectedServices(productData.service_ids || []);
    } else {
      setEditMode(false);
      setFormData({
        package_name: "",
        actual_price: "",
        discount_price: "",
        serviceHours: "",
        serviceMinutes: "",
        serviceSeating: "",
      });
      setSelectedPackageId(null);
      setSelectedServices([]);
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    const payload = {
      package_name: formData.package_name,
      actual_price: formData.actual_price,
      discount_price: formData.discount_price,
      offer_timing: {
        hours: parseInt(formData.serviceHours) || 0,
        minutes: parseInt(formData.serviceMinutes) || 0,
        seating: parseInt(formData.serviceSeating) || 0,
      },
      service_ids: selectedServices,
      vendor: vendorData?.id,
      spa: vendorData?.spa,
    };

    try {
      let response;
      const url = editMode
        ? `https://backendapi.trakky.in/spavendor/membership-package-request/${selectedPackageId}/`
        : "https://backendapi.trakky.in/spavendor/membership-package-request/";

      response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = editMode
          ? "Failed to update package"
          : "Failed to create package";

        if (errorData.message) {
          errorMessage += `: ${errorData.message}`;
        } else if (errorData.detail) {
          errorMessage += `: ${errorData.detail}`;
        } else if (errorData.non_field_errors) {
          errorMessage += `: ${errorData.non_field_errors.join(', ')}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (editMode) {
        setPackageRequestData(
          packageRequestData.map((item) =>
            item.id === selectedPackageId ? data : item
          )
        );
        toast.success("Package updated successfully!");
      } else {
        setPackageRequestData([...packageRequestData, data]);
        toast.success("Package created successfully!");
      }

      handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteServiceRequest = async (id) => {
    confirm({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this package? This action cannot be undone.",
      confirmationText: "Delete",
      confirmationButtonProps: { variant: "contained", color: "error" }
    })
      .then(async () => {
        try {
          const response = await fetch(
            `https://backendapi.trakky.in/spavendor/membership-package-request/${id}/`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens.access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete package: ${response.statusText}`);
          }

          toast.success("Package deleted successfully");
          setPackageRequestData(
            packageRequestData.filter((item) => item.id !== id)
          );
        } catch (error) {
          toast.error(`Error deleting package: ${error.message}`);
        }
      })
      .catch(() => {
        // Cancelled
      });
  };

  useEffect(() => {
    const selectedServicesData = allServices.filter((service) =>
      selectedServices.includes(service.id)
    );

    const actualPrice = selectedServicesData.reduce(
      (total, service) => total + (service.price || 0),
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      actual_price: actualPrice,
    }));
  }, [selectedServices]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <CancelIcon className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <PendingIcon className="h-3.5 w-3.5" />
            Pending Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const calculateSavings = (actual, discount) => {
    if (!actual || !discount) return 0;
    return actual - discount;
  };

  const getSavingsPercentage = (actual, discount) => {
    if (!actual || !discount || actual <= 0) return 0;
    return Math.round(((actual - discount) / actual) * 100);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* <MiniHeader title="Package Requests" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className="mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                    Membership Package Requests
                  </h1>
                </div>
                <p className="text-gray-600">
                  Submit and manage membership package requests for approval
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchPackageRequest}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <Refresh className="h-4 w-4" />
                  Refresh
                </button>
                <button
                  onClick={() => handleOpen(null)}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Add className="h-4 w-4" />
                  Add Package Request
                </button>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by package name..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>

              {/* Stats Summary */}
              {packageRequestData.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{packageRequestData.length}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">{packageRequestData.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {packageRequestData.filter(item => item.package_status === "pending").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <PendingIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-green-600">
                          {packageRequestData.filter(item => item.package_status === "approved").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">
                          {packageRequestData.filter(item => item.package_status === "rejected").length}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <CancelIcon className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Package Requests Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Package Requests ({filteredData.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} of {packageRequestData.length} requests
                </div>
              </div>
            </div>

            {/* Loading State */}
            {packageRequestDataLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={50}
                />
                <p className="text-gray-600 font-medium">Loading package requests...</p>
              </div>
            ) : filteredData?.length > 0 ? (
              /* Table Content */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Package Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Services
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData?.map((item, index) => {
                      const savings = calculateSavings(item?.actual_price, item?.discount_price);
                      const savingsPercentage = getSavingsPercentage(item?.actual_price, item?.discount_price);
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Index */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Package Details */}
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {item.package_name || "Unnamed Package"}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                ID: {item.id || "N/A"}
                              </p>
                            </div>
                          </td>

                          {/* Services */}
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <SpaIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {item?.service_names?.length || 0} services
                                </div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {item?.service_names?.slice(0, 3).join(", ")}
                                  {item?.service_names?.length > 3 && "..."}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Pricing */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                                <span className="text-lg font-bold text-gray-900">
                                  {item?.actual_price || "0"}
                                </span>
                                <span className="text-sm text-gray-500">original</span>
                              </div>
                              
                              {item?.discount_price && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <LocalOffer className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-green-600">
                                      ₹{item?.discount_price}
                                    </span>
                                    <span className="text-sm text-gray-500">discounted</span>
                                  </div>
                                  {savings > 0 && (
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Save ₹{savings}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ({savingsPercentage}% off)
                                      </span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </td>

                          {/* Duration */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <AccessTime className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {formatTime(item?.offer_timing)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Total duration
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <CalendarToday className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">
                                  {dayjs(item.created_at).format("DD MMM YYYY")}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {dayjs(item.created_at).format("hh:mm A")}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {getStatusBadge(item?.package_status)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpen(item)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  item?.package_status === "pending"
                                    ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                                disabled={item?.package_status !== "pending"}
                                title={
                                  item?.package_status !== "pending"
                                    ? "Only pending packages can be edited"
                                    : "Edit package"
                                }
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              
                              <button
                                onClick={() => deleteServiceRequest(item.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete package"
                              >
                                <Delete className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <CardMembershipIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Package Requests Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search || statusFilter !== "all" 
                    ? "No package requests match your search criteria." 
                    : "You haven't submitted any package requests yet."}
                </p>
                <button
                  onClick={() => {
                    if (search || statusFilter !== "all") {
                      setSearch("");
                      setStatusFilter("all");
                    } else {
                      handleOpen(null);
                    }
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  {search || statusFilter !== "all" ? "Clear Filters" : "Create First Request"}
                </button>
              </div>
            )}

            {/* Table Footer */}
            {filteredData?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Showing {filteredData.length} requests</span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-green-600 font-medium">
                      {packageRequestData.filter(item => item.package_status === "approved").length} approved
                    </span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-yellow-600 font-medium">
                      {packageRequestData.filter(item => item.package_status === "pending").length} pending
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box sx={{
            width: { xs: '90%', md: '800px' },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: 24,
            p: 0,
          }}>
            <div className="bg-white rounded-xl">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {editMode ? "Edit Package Request" : "Create New Package Request"}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {editMode ? "Update your package details" : "Create a new membership package request"}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Package Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name *
                    </label>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="package_name"
                      value={formData.package_name}
                      onChange={handleChange}
                      error={!!formErrors.package_name}
                      helperText={formErrors.package_name}
                      required
                      placeholder="Enter package name"
                      InputProps={{
                        sx: {
                          borderRadius: '8px',
                        }
                      }}
                    />
                  </div>

                  {/* Services Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Services *
                    </label>
                    <FormControl fullWidth error={!!formErrors.services}>
                      <Select
                        multiple
                        value={selectedServices}
                        onChange={(e) => {
                          setSelectedServices(e.target.value);
                          if (formErrors.services) {
                            setFormErrors(prev => ({ ...prev, services: '' }));
                          }
                        }}
                        input={<OutlinedInput 
                          label="Select Services *" 
                          sx={{ borderRadius: '8px' }}
                        />}
                        MenuProps={MenuProps}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <span className="text-gray-400">Select services...</span>;
                          }
                          return selected
                            .map((id) => {
                              const service = allServices.find(
                                (service) => service.id === id
                              );
                              return service?.service_names;
                            })
                            .join(", ");
                        }}
                        disabled={serviceLoading}
                        sx={{ borderRadius: '8px' }}
                      >
                        {allServices.map((service) => (
                          <MenuItem key={service.id} value={service.id}>
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                            />
                            <ListItemText
                              primary={
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{service.service_names}</span>
                                  <span className="text-green-600 font-semibold">₹{service.price}</span>
                                </div>
                              }
                              secondary={formatTime(service?.service_time)}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.services && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.services}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {selectedServices.length} services selected
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          Total: ₹{formData.actual_price || "0"}
                        </span>
                      </div>
                    </FormControl>
                  </div>

                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price
                      </label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="actual_price"
                        value={formData.actual_price}
                        onChange={handleChange}
                        type="number"
                        disabled
                        InputProps={{
                          startAdornment: <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />,
                          sx: { borderRadius: '8px' }
                        }}
                        helperText="Auto-calculated from selected services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Price *
                      </label>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="discount_price"
                        value={formData.discount_price}
                        onChange={handleChange}
                        type="number"
                        error={!!formErrors.discount_price}
                        helperText={formErrors.discount_price || "Enter your offer price"}
                        required
                        InputProps={{
                          startAdornment: <LocalOffer className="h-5 w-5 text-green-400 mr-2" />,
                          sx: { borderRadius: '8px' }
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </div>
                  </div>

                  {/* Savings Calculator */}
                  {formData.actual_price && formData.discount_price && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-700">Customer Savings</p>
                          <p className="text-xl font-bold text-indigo-800">
                            ₹{calculateSavings(formData.actual_price, formData.discount_price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {getSavingsPercentage(formData.actual_price, formData.discount_price)}% OFF
                          </p>
                          <p className="text-xs text-green-500">Great deal!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Service Timing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Service Duration & Capacity
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <TextField
                          label="Hours"
                          variant="outlined"
                          fullWidth
                          name="serviceHours"
                          value={formData.serviceHours}
                          onChange={handleChange}
                          type="number"
                          error={!!formErrors.serviceHours}
                          helperText={formErrors.serviceHours}
                          inputProps={{ min: 0 }}
                          InputProps={{
                            endAdornment: <span className="text-gray-500">hrs</span>,
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      </div>

                      <div>
                        <TextField
                          label="Minutes"
                          variant="outlined"
                          fullWidth
                          name="serviceMinutes"
                          value={formData.serviceMinutes}
                          onChange={handleChange}
                          type="number"
                          error={!!formErrors.serviceMinutes}
                          helperText={formErrors.serviceMinutes}
                          inputProps={{ min: 0, max: 59 }}
                          InputProps={{
                            endAdornment: <span className="text-gray-500">mins</span>,
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      </div>

                      <div>
                        <TextField
                          label="Seating "
                          variant="outlined"
                          fullWidth
                          name="serviceSeating"
                          value={formData.serviceSeating}
                          onChange={handleChange}
                          type="number"
                          error={!!formErrors.serviceSeating}
                          inputProps={{ min: 1 }}
                          InputProps={{
                            endAdornment: <span className="text-gray-500">Seating</span>,
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      onClick={handleSubmit}
                    >
                      {editMode ? "Update Package Request" : "Submit Package Request"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </motion.div>
      </Modal>
    </div>
  );
};

export default SpaMembershipPackagesRequest;