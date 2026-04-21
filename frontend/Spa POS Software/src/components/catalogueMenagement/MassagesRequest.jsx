import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../Context/Auth";
import MiniHeader from "./MiniHeader";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import { Delete, Edit, Add, Search, Refresh, AccessTime, Info } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DescriptionIcon from "@mui/icons-material/Description";

const MassagesRequest = () => {
  const [massageRequestData, setMassageRequestData] = useState([]);
  const [massageRequestDataLoading, setMassageRequestDataLoading] = useState(true);
  const [editMassageData, setEditMassageData] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      fontSize: "0.75rem",
    },
  }));

  const handleOpen = (productData) => {
    if (productData) {
      setEditMassageData(productData);
    } else {
      setEditMassageData(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatTime = (time) => {
    if (!time) return "Not specified";

    let parts = [];
    if (time?.days && time?.days !== 0) {
      parts.push(`${time.days} Day${time.days > 1 ? 's' : ''}`);
    }
    if (time?.seating && time?.seating !== 0) {
      parts.push(`${time.seating} Seating${time.seating > 1 ? 's' : ''}`);
    }
    if (time?.hours && time?.hours !== 0) {
      parts.push(`${time.hours} Hour${time.hours > 1 ? 's' : ''}`);
    }
    if (time?.minutes && time?.minutes !== 0) {
      parts.push(`${time.minutes} Minute${time.minutes > 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  const fetchMassageRequest = async () => {
    setMassageRequestDataLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/massage-request/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMassageRequestData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching massage requests:", error);
      toast.error("Failed to fetch massage requests");
    } finally {
      setMassageRequestDataLoading(false);
    }
  };

  useEffect(() => {
    fetchMassageRequest();
  }, []);

  useEffect(() => {
    let filtered = massageRequestData;

    if (search) {
      filtered = filtered.filter(item =>
        item?.service_name?.toLowerCase().includes(search.toLowerCase()) ||
        item?.from_masterservice?.toString().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item?.service_status === statusFilter);
    }

    setFilteredData(filtered);
  }, [search, statusFilter, massageRequestData]);

  const handleEditClick = (item) => {
    setEditMassageData(item);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await confirm({
        title: "Delete Massage Request",
        description: "Are you sure you want to delete this massage request? This action cannot be undone.",
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { variant: "contained", color: "error" },
      });

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spavendor/massage-request/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete massage request");
        }

        toast.success("Massage Request Deleted Successfully");
        setMassageRequestData(prevData => prevData.filter(item => item.id !== id));
      } catch (error) {
        toast.error(error.message || "An error occurred");
      }
    } catch (error) {
      // User canceled the confirmation
    }
  };

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

  const calculateSavings = (price, discount) => {
    if (!price || !discount) return 0;
    return price - discount;
  };

  const getSavingsPercentage = (price, discount) => {
    if (!price || !discount || price <= 0) return 0;
    return Math.round(((price - discount) / price) * 100);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <Toaster position="top-right" />
      
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className=" mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                  Massage Requests
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and manage massage service requests
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchMassageRequest}
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
                  Add Request
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
                    placeholder="Search by name or type..."
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
              {massageRequestData.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{massageRequestData.length}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">{massageRequestData.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {massageRequestData.filter(item => item.service_status === "pending").length}
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
                          {massageRequestData.filter(item => item.service_status === "approved").length}
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
                          {massageRequestData.filter(item => item.service_status === "rejected").length}
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

          {/* Massage Requests Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Massage Requests ({filteredData.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} of {massageRequestData.length} requests
                </div>
              </div>
            </div>

            {/* Loading State */}
            {massageRequestDataLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={50}
                />
                <p className="text-gray-600 font-medium">Loading massage requests...</p>
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
                        Massage Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Pricing
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duration
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
                      const savings = calculateSavings(item?.price, item?.discounted_price);
                      const savingsPercentage = getSavingsPercentage(item?.price, item?.discounted_price);
                      
                      return (
                        <tr key={item?.id} className="hover:bg-gray-50 transition-colors duration-150">
                          {/* Index */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Massage Details */}
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {item?.service_name || "Unnamed Service"}
                              </h4>
                              <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item?.from_masterservice 
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {item?.from_masterservice ? "Master Service" : "Custom Service"}
                                </span>
                                <BootstrapTooltip 
                                  title={item?.description?.replace(/<[^>]*>/g, '') || "No description"} 
                                  placement="top"
                                >
                                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                </BootstrapTooltip>
                              </div>
                            </div>
                          </td>

                          {/* Pricing */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                                <span className="text-lg font-bold text-gray-900">
                                  {item?.price || "0"}
                                </span>
                                <span className="text-sm text-gray-500">original</span>
                              </div>
                              
                              {item?.discounted_price && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <LocalOfferIcon className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-green-600">
                                      ₹{item?.discounted_price}
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
                                  {formatTime(item?.massage_time)}
                                </div>
                                {item?.massage_time && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Total duration
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {getStatusBadge(item?.service_status)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BootstrapTooltip title="Edit" placement="top">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className={`p-2 rounded-lg transition-colors duration-200 ${
                                    item?.service_status === "pending"
                                      ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                                  disabled={item?.service_status !== "pending"}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                              </BootstrapTooltip>
                              
                              <BootstrapTooltip title="Delete" placement="top">
                                <button
                                  onClick={() => handleDeleteClick(item.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                  <Delete className="h-5 w-5" />
                                </button>
                              </BootstrapTooltip>
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
                  <DescriptionIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Massage Requests Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search || statusFilter !== "all" 
                    ? "No massage requests match your search criteria." 
                    : "You haven't created any massage requests yet."}
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
                      {massageRequestData.filter(item => item.service_status === "approved").length} approved
                    </span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-yellow-600 font-medium">
                      {massageRequestData.filter(item => item.service_status === "pending").length} pending
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
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '800px' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: 24,
          p: 0,
        }}>
          <MassageAddPage
            handleClose={handleClose}
            editMassageData={editMassageData}
            refreshData={fetchMassageRequest}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default MassagesRequest;

const MassageAddPage = ({ handleClose, editMassageData, refreshData }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    master_service: "",
    service_name: "",
    price: "",
    discounted_price: "",
    serviceHours: "",
    serviceMinutes: "",
    serviceSeating: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [masterServices, setMasterServices] = useState([]);
  const [masterServiceLoading, setMasterServiceLoading] = useState(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.master_service) {
      errors.master_service = "Master service is required";
    }

    if (!formData.service_name) {
      errors.service_name = "Service name is required";
    }

    if (!formData.price || isNaN(formData.price)) {
      errors.price = "Valid price is required";
    }

    if (formData.discounted_price && isNaN(formData.discounted_price)) {
      errors.discounted_price = "Discount must be a valid number";
    }

    if (formData.discounted_price && parseFloat(formData.discounted_price) > parseFloat(formData.price)) {
      errors.discounted_price = "Discount cannot be greater than price";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchMasterMassages = async () => {
    setMasterServiceLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/masterservice/?page=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMasterServices(data?.results || []);
    } catch (error) {
      console.error("Error fetching master services:", error);
      toast.error("Failed to load master services");
    } finally {
      setMasterServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterMassages();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "bullet" }, { list: "ordered" }],
            [{ header: [1, 2, 3, false] }],
            [{ color: [] }],
            ["clean"]
          ],
        },
      });
    }
  }, []);

  useEffect(() => {
    if (editMassageData) {
      setFormData({
        master_service: editMassageData.master_service ? editMassageData.master_service.toString() : "Other",
        service_name: editMassageData.service_name,
        price: editMassageData.price,
        discounted_price: editMassageData.discounted_price,
        serviceHours: editMassageData?.massage_time?.hours,
        serviceMinutes: editMassageData?.massage_time?.minutes,
        serviceSeating: editMassageData?.massage_time?.seating,
      });

      if (editorRef.current) {
        editorRef.current.root.innerHTML = editMassageData.description || "";
      }
    } else {
      setFormData({
        master_service: "",
        service_name: "",
        price: "",
        discounted_price: "",
        serviceHours: "",
        serviceMinutes: "",
        serviceSeating: "",
      });

      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
      }
    }
  }, [editMassageData]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    const description = editorRef.current?.root.innerHTML || "";
    if (!description || description === "<p><br></p>") {
      toast.error("Description is required");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      master_service: formData.master_service === "Other" ? null : parseInt(formData.master_service),
      service_name: formData.service_name,
      price: parseFloat(formData.price),
      discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
      description: description,
      massage_time: {
        hours: formData.serviceHours ? parseInt(formData.serviceHours) : 0,
        minutes: formData.serviceMinutes ? parseInt(formData.serviceMinutes) : 0,
        seating: formData.serviceSeating ? parseInt(formData.serviceSeating) : 0,
        days: 0
      },
      spa: vendorData?.spa,
      from_masterservice: formData.master_service !== "Other",
    };

    try {
      const url = editMassageData
        ? `https://backendapi.trakky.in/spavendor/massage-request/${editMassageData.id}/`
        : "https://backendapi.trakky.in/spavendor/massage-request/";

      const method = editMassageData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
          errorData.message ||
          `Request failed with status ${response.status}`
        );
      }

      toast.success(
        editMassageData
          ? "Massage Request Updated Successfully"
          : "Massage Request Created Successfully"
      );
      refreshData();
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit massage request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSavings = () => {
    if (!formData.price || !formData.discounted_price) return null;
    const savings = parseFloat(formData.price) - parseFloat(formData.discounted_price);
    const percentage = (savings / parseFloat(formData.price)) * 100;
    return { savings, percentage: Math.round(percentage) };
  };

  const savings = calculateSavings();

  return (
    <div className="bg-white rounded-xl">
      {/* Modal Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {editMassageData ? "Edit Massage Request" : "Add New Massage Request"}
            </h3>
            <p className="text-gray-600 mt-1">
              {editMassageData ? "Update the details of your massage request" : "Fill in the details to create a new massage request"}
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
          {/* Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth error={!!formErrors.master_service}>
              <InputLabel id="master-service-label">Master Service</InputLabel>
              <Select
                labelId="master-service-label"
                value={formData.master_service}
                label="Master Service"
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    master_service: value,
                    service_name: value === "Other" 
                      ? "" 
                      : masterServices.find(item => item.id.toString() === value)?.service_name || "",
                  }));
                }}
                disabled={masterServiceLoading}
              >
                {masterServices?.map((item, index) => (
                  <MenuItem value={item.id.toString()} key={index}>
                    {item.service_name}
                  </MenuItem>
                ))}
                <MenuItem value="Other">Custom Service (Other)</MenuItem>
              </Select>
              {formErrors.master_service && (
                <p className="text-red-500 text-xs mt-1">{formErrors.master_service}</p>
              )}
            </FormControl>

            <TextField
              label="Massage Name"
              variant="outlined"
              fullWidth
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              disabled={formData.master_service !== "Other" && formData.master_service !== ""}
              error={!!formErrors.service_name}
              helperText={formErrors.service_name}
              InputLabelProps={{
                shrink: !!formData.service_name,
              }}
            />
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Actual Price (₹)"
              variant="outlined"
              fullWidth
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              error={!!formErrors.price}
              helperText={formErrors.price}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />,
              }}
            />

            <TextField
              label="Discounted Price (₹)"
              variant="outlined"
              fullWidth
              name="discounted_price"
              value={formData.discounted_price}
              onChange={handleChange}
              type="number"
              error={!!formErrors.discounted_price}
              helperText={formErrors.discounted_price}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: <LocalOfferIcon className="h-5 w-5 text-green-400 mr-2" />,
              }}
            />
          </div>

          {savings && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Customer Savings</p>
                  <p className="text-lg font-bold text-green-800">₹{savings.savings.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">{savings.percentage}% Discount</p>
                  <p className="text-xs text-green-500">Great deal for customers!</p>
                </div>
              </div>
            </div>
          )}

          {/* Description Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Description
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div id="editor" style={{ height: "200px" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Describe the massage service in detail. Include benefits, techniques, and any special features.
            </p>
          </div>

          {/* Duration Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Duration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Hours"
                variant="outlined"
                fullWidth
                name="serviceHours"
                value={formData.serviceHours}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 0, max: 24 }}
                InputProps={{
                  startAdornment: <AccessTime className="h-5 w-5 text-gray-400 mr-2" />,
                }}
              />

              <TextField
                label="Minutes"
                variant="outlined"
                fullWidth
                name="serviceMinutes"
                value={formData.serviceMinutes}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 0, max: 59 }}
              />

              <TextField
                label="Seating"
                variant="outlined"
                fullWidth
                name="serviceSeating"
                value={formData.serviceSeating}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 1 }}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  {editMassageData ? "Updating..." : "Creating..."}
                </>
              ) : editMassageData ? (
                "Update Massage Request"
              ) : (
                "Create Massage Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};