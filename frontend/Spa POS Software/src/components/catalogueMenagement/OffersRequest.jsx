import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../Context/Auth";
import MiniHeader from "./MiniHeader";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import { Delete, Edit, Add, Search, Refresh, LocalOffer, Percent, Code, Info, CalendarToday } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";
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
import { OutlinedInput } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DescriptionIcon from "@mui/icons-material/Description";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const OffersRequest = () => {
  const [offerRequestData, setOfferRequestData] = useState([]);
  const [offerRequestDataLoading, setOfferRequestDataLoading] = useState(true);
  const [editProductData, setEditProductData] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState([]);

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
      setEditProductData(productData);
    } else {
      setEditProductData(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD MMM YYYY");
  };

  const fetchOfferRequest = async () => {
    setOfferRequestDataLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/offer-request/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offer requests");
      }

      const data = await response.json();
      setOfferRequestData(data);
      setFilteredData(data);
    } catch (error) {
      toast.error("Failed to load offer requests");
    } finally {
      setOfferRequestDataLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferRequest();
  }, []);

  useEffect(() => {
    let filtered = offerRequestData;

    if (search) {
      filtered = filtered.filter(item =>
        item?.offer_name?.toLowerCase().includes(search.toLowerCase()) ||
        item?.offer_type?.toLowerCase().includes(search.toLowerCase()) ||
        item?.coupon_code?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item?.offer_status === statusFilter);
    }

    setFilteredData(filtered);
  }, [search, statusFilter, offerRequestData]);

  const handleEditClick = (item) => {
    setEditProductData(item);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await confirm({
        title: "Delete Offer Request",
        description: "Are you sure you want to delete this offer request? This action cannot be undone.",
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { variant: "contained", color: "error" },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/offer-request/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete offer request");
      }

      toast.success("Offer Request Deleted Successfully");
      setOfferRequestData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      toast.error("Failed to delete offer request");
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

  const calculateDiscountedPrice = (price, percentage) => {
    if (!price || !percentage) return null;
    return price - (price * percentage / 100);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <Toaster position="top-right" />
      
      {/* <MiniHeader title="Offer Requests" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className="mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                    Offer Requests
                  </h1>
                </div>
                <p className="text-gray-600">
                  Create and manage promotional offers for your spa services
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchOfferRequest}
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
                  Add Offer Request
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
                    placeholder="Search by offer name, type, or coupon..."
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
              {offerRequestData.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Offers</p>
                        <p className="text-2xl font-bold text-gray-900">{offerRequestData.length}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <LocalOffer className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {offerRequestData.filter(item => item.offer_status === "pending").length}
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
                          {offerRequestData.filter(item => item.offer_status === "approved").length}
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
                          {offerRequestData.filter(item => item.offer_status === "rejected").length}
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

          {/* Offers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Offer Requests ({filteredData.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Showing {filteredData.length} of {offerRequestData.length} requests
                </div>
              </div>
            </div>

            {/* Loading State */}
            {offerRequestDataLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={50}
                />
                <p className="text-gray-600 font-medium">Loading offer requests...</p>
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
                        Offer Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Service & Pricing
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Coupon
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
                      const discountedPrice = calculateDiscountedPrice(item?.actual_price, item?.offer_percentage);
                      
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

                          {/* Offer Details */}
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {item?.offer_name || "Unnamed Offer"}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item?.offer_type === "massage specific"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}>
                                  {item?.offer_type === "massage specific" ? "Service Specific" : "General Offer"}
                                </span>
                                <BootstrapTooltip 
                                  title={item?.how_to_avail || "No instructions provided"} 
                                  placement="top"
                                >
                                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                </BootstrapTooltip>
                              </div>
                            </div>
                          </td>

                          {/* Discount */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Percent className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg">
                                  {item?.offer_percentage}%
                                </div>
                                <div className="text-xs text-gray-500">OFF</div>
                              </div>
                            </div>
                          </td>

                          {/* Service & Pricing */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="font-medium text-gray-900">
                                {item?.service_name || "All Services"}
                              </div>
                              {item?.actual_price && (
                                <div className="flex items-center gap-2">
                                  <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                                  <div>
                                    <span className="text-gray-500 line-through text-sm">
                                      ₹{item?.actual_price}
                                    </span>
                                    {discountedPrice && (
                                      <span className="text-green-600 font-bold ml-2">
                                        ₹{discountedPrice.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {discountedPrice && item?.actual_price && (
                                <div className="text-xs text-green-600 font-medium">
                                  Save ₹{(item?.actual_price - discountedPrice).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Coupon */}
                          <td className="px-6 py-4">
                            {item?.coupon_code ? (
                              <div className="inline-block">
                                <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                                  <div className="text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1">
                                    Coupon Code
                                  </div>
                                  <div className="font-mono font-bold text-indigo-700 text-center">
                                    {item.coupon_code}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <CalendarToday className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-900">
                                  {formatDate(item?.created_at)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Created
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {getStatusBadge(item?.offer_status)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BootstrapTooltip title="Edit" placement="top">
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className={`p-2 rounded-lg transition-colors duration-200 ${
                                    item?.offer_status === "pending"
                                      ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                                  disabled={item?.offer_status !== "pending"}
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
                  <CardGiftcardIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Offer Requests Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search || statusFilter !== "all" 
                    ? "No offer requests match your search criteria." 
                    : "You haven't created any offer requests yet."}
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
                  {search || statusFilter !== "all" ? "Clear Filters" : "Create First Offer"}
                </button>
              </div>
            )}

            {/* Table Footer */}
            {filteredData?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Showing {filteredData.length} offers</span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-green-600 font-medium">
                      {offerRequestData.filter(item => item.offer_status === "approved").length} approved
                    </span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-yellow-600 font-medium">
                      {offerRequestData.filter(item => item.offer_status === "pending").length} pending
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
          <OfferAddPage
            handleClose={handleClose}
            editProductData={editProductData}
            refreshData={fetchOfferRequest}
          />
        </Box>
      </Modal>
    </div>
  );
};

const OfferAddPage = ({ handleClose, editProductData, refreshData }) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    offer_name: "",
    offer_type: "",
    offer_percentage: "",
    coupon_code: "",
    how_to_avail: "",
    massage_price: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [serviceLoading, setServiceLoading] = useState(false);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState(null);

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

  const fetchMassages = async () => {
    setServiceLoading(true);

    if (!vendorData?.spa) {
      toast.error("Spa information not found");
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/service/?page=${page}&spa_id=${vendorData?.spa}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch services");
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
      toast.error("Failed to load services");
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchMassages();
  }, [vendorData?.spa, page]);

  useEffect(() => {
    if (tempAllServices?.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

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
    if (editProductData) {
      setFormData({
        offer_name: editProductData.offer_name || "",
        offer_type: editProductData.offer_type || "",
        offer_percentage: editProductData.offer_percentage || "",
        coupon_code: editProductData.coupon_code || "",
        how_to_avail: editProductData.how_to_avail || "",
        massage_price: editProductData.actual_price || "",
      });

      if (editProductData.terms_and_conditions) {
        editorRef.current.root.innerHTML = editProductData.terms_and_conditions;
      }

      if (editProductData.service) {
        setSelectedServices(editProductData.service);
      }
    } else {
      setFormData({
        offer_name: "",
        offer_type: "",
        offer_percentage: "",
        coupon_code: "",
        how_to_avail: "",
        massage_price: "",
      });
      setSelectedServices(null);
      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
      }
    }
  }, [editProductData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.offer_name?.trim()) {
      newErrors.offer_name = "Offer name is required";
    }

    if (!formData.offer_type) {
      newErrors.offer_type = "Offer type is required";
    }

    if (!formData.offer_percentage) {
      newErrors.offer_percentage = "Discount percentage is required";
    } else if (isNaN(formData.offer_percentage) || formData.offer_percentage < 1 || formData.offer_percentage > 100) {
      newErrors.offer_percentage = "Please enter a valid percentage (1-100)";
    }

    if (formData.offer_type === "massage specific" && !selectedServices) {
      newErrors.service = "Please select a service";
    }

    const termsContent = editorRef.current?.getText().trim();
    if (!termsContent) {
      newErrors.terms = "Terms and conditions are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      spa: vendorData?.spa,
      offer_type: formData.offer_type,
      service: selectedServices,
      offer_percentage: formData.offer_percentage,
      offer_name: formData.offer_name,
      terms_and_conditions: editorRef.current.root.innerHTML,
      coupon_code: formData.coupon_code,
      how_to_avail: formData.how_to_avail,
      discount_price: "00"
        ? (formData?.massage_price - (formData?.massage_price * formData?.offer_percentage) / 100).toFixed(2)
        : null,
    };

    try {
      const url = editProductData
        ? `https://backendapi.trakky.in/spavendor/offer-request/${editProductData.id}/`
        : "https://backendapi.trakky.in/spavendor/offer-request/";

      const method = editProductData ? "PATCH" : "POST";

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
        throw new Error(errorData.message || "Failed to submit offer request");
      }

      toast.success(
        editProductData
          ? "Offer Request Updated Successfully"
          : "Offer Request Created Successfully"
      );

      refreshData();
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit offer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDiscountedPrice = () => {
    if (!formData.massage_price || !formData.offer_percentage) return null;
    return formData.massage_price - (formData.massage_price * formData.offer_percentage / 100);
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="bg-white rounded-xl">
      {/* Modal Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {editProductData ? "Edit Offer Request" : "Create New Offer Request"}
            </h3>
            <p className="text-gray-600 mt-1">
              {editProductData ? "Update your offer details" : "Create a promotional offer for your spa services"}
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
          {/* Offer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Name *
              </label>
              <TextField
                variant="outlined"
                fullWidth
                name="offer_name"
                value={formData.offer_name}
                onChange={handleChange}
                error={!!errors.offer_name}
                helperText={errors.offer_name}
                placeholder="Enter offer name"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Type *
              </label>
              <FormControl fullWidth error={!!errors.offer_type}>
                <Select
                  name="offer_type"
                  value={formData.offer_type}
                  onChange={handleChange}
                  displayEmpty
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="">
                    <span className="text-gray-400">Select offer type</span>
                  </MenuItem>
                  <MenuItem value="general">General Offer</MenuItem>
                  <MenuItem value="massage specific">Service Specific</MenuItem>
                </Select>
                {errors.offer_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.offer_type}</p>
                )}
              </FormControl>
            </div>
          </div>

          {/* Service Selection (Conditional) */}
          {formData?.offer_type === "massage specific" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service *
                </label>
                <FormControl fullWidth error={!!errors.service}>
                  <Select
                    value={selectedServices || ""}
                    onChange={(e) => {
                      setSelectedServices(e.target.value);
                      const selectedService = allServices.find(
                        (service) => service.id === e.target.value
                      );
                      setFormData(prev => ({
                        ...prev,
                        massage_price: selectedService?.price || "",
                      }));
                    }}
                    displayEmpty
                    sx={{ borderRadius: '8px' }}
                    disabled={serviceLoading}
                  >
                    <MenuItem value="">
                      <span className="text-gray-400">Select a service</span>
                    </MenuItem>
                    {allServices.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.service_names}</span>
                          <span className="text-green-600 font-semibold">₹{service.price}</span>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.service && (
                    <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                  )}
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="massage_price"
                  value={formData?.massage_price || ""}
                  type="number"
                  disabled
                  InputProps={{
                    startAdornment: <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' }
                  }}
                />
              </div>
            </div>
          )}

          {/* Discount Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                variant="outlined"
                fullWidth
                name="offer_percentage"
                value={formData.offer_percentage}
                onChange={handleChange}
                type="number"
                inputProps={{ min: 1, max: 100 }}
                error={!!errors.offer_percentage}
                helperText={errors.offer_percentage || "Enter a value between 1-100"}
                InputProps={{
                  endAdornment: <span className="text-gray-500 mr-2">%</span>,
                  sx: { borderRadius: '8px' }
                }}
              />

              {formData?.offer_type === "massage specific" && formData?.massage_price && formData?.offer_percentage && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Discounted Price</p>
                      <p className="text-xl font-bold text-green-800">₹{discountedPrice?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Save ₹{(formData.massage_price - discountedPrice).toFixed(2)}
                      </p>
                      <p className="text-xs text-red-500">{formData.offer_percentage}% OFF</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div id="editor" style={{ height: "150px" }}></div>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Specify the terms and conditions for this offer
            </p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code (Optional)
              </label>
              <TextField
                variant="outlined"
                fullWidth
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="e.g., SPA20OFF"
                InputProps={{
                  startAdornment: <Code className="h-5 w-5 text-gray-400 mr-2" />,
                  sx: { borderRadius: '8px' }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How to Avail
              </label>
              <TextField
                variant="outlined"
                fullWidth
                name="how_to_avail"
                value={formData.how_to_avail}
                onChange={handleChange}
                placeholder="Instructions for customers"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
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
                  {editProductData ? "Updating..." : "Creating..."}
                </>
              ) : editProductData ? (
                "Update Offer Request"
              ) : (
                "Create Offer Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersRequest;