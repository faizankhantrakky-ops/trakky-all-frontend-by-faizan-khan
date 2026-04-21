import React, { useContext, useEffect, useState } from "react";
import MiniHeader from "./MiniHeader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../Context/Auth";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Delete,
  Edit,
  Search,
  Refresh,
  Person,
  Phone,
  Loyalty,
  Paid,
  CalendarToday,
  Info,
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import CreateCustomerMembership from "./form/CreateCustomerMembership";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Chip,
} from "@mui/material";
// import CurrencyRupeeIcon from "@mui/icons-material/AttachMoney";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Link } from "react-router-dom";

const CustomerMembership = () => {
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

  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();

  const [drawerData, setDrawerdata] = useState(null);
  const [paymentDrawerData, setPaymentDrawerdata] = useState(null);
  const [modalMembershipType, setModalMembershipType] = useState(null);
  const [open, setOpen] = useState(false);
  const [customerMembership, setCustomerMembership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [managerData, setManagerData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentModalFormData, setPaymentModalFormData] = useState({
    payment_amount: "",
    customer_membership: "",
    manager: "",
  });

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 0,
    borderRadius: "12px",
    overflow: "hidden",
  };

  const handleOpen = (membershipType) => {
    setModalMembershipType(membershipType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalMembershipType(null);
    fetchCustomerMembership();
  };

  const fetchCustomerMembership = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/customer-membership-new/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCustomerMembership(data);
        setFilterData(data);
      } else {
        toast.error(data.detail || "Failed to fetch customer memberships");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetails = async (id) => {
    if (!id) return;

    let url = `https://backendapi.trakky.in/spavendor/payment-history/?customer_membership=${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentData(data);
      } else {
        toast.error(data.detail || "Failed to fetch payment details");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteCustomerMembership = async (id) => {
    try {
      await confirm({
        title: "Delete Customer Membership",
        description:
          "Are you sure you want to delete this customer membership? This action cannot be undone.",
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { variant: "contained", color: "error" },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/customer-membership-new/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Customer membership deleted successfully");
        setCustomerMembership(
          customerMembership.filter((membership) => membership.id !== id)
        );
      } else {
        toast.error("Failed to delete customer membership");
      }
    } catch (error) {
      if (error === undefined || error === "cancel") {
        return;
      }
      toast.error("An error occurred: " + error);
    }
  };

  useEffect(() => {
    fetchCustomerMembership();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/manager/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setManagerData(data);
      } else {
        toast.error("Failed to fetch managers");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    let filtered = customerMembership;

    if (search) {
      filtered = filtered.filter((membership) => {
        return (
          (membership?.customer?.customer_name
            ? membership?.customer?.customer_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
            : "") ||
          (membership?.customer?.customer_phone
            ? membership?.customer?.customer_phone
                ?.toLowerCase()
                .includes(search.toLowerCase())
            : "") ||
          (membership?.membership_code
            ? membership?.membership_code
                ?.toLowerCase()
                .includes(search.toLowerCase())
            : "")
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((membership) =>
        statusFilter === "active" ? membership?.active : !membership?.active
      );
    }

    setFilterData(filtered);
  }, [search, statusFilter, customerMembership]);

  const resetSearch = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handlePaymentInstallment = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/payment-history/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(paymentModalFormData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Payment added successfully");
        setPaymentModalOpen(false);
        fetchPaymentDetails(paymentModalFormData.customer_membership);
        fetchCustomerMembership();
      } else {
        toast.error(data?.non_field_errors?.[0] || "Failed to add payment");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const calculateTotalPaid = () => {
    if (!paymentData || paymentData.length === 0) return 0;
    return paymentData.reduce(
      (total, item) => total + parseFloat(item.payment_amount || 0),
      0
    );
  };

  const calculateDueAmount = () => {
    if (!paymentDrawerData?.membership_type_detail?.membership_price) return 0;
    const totalPrice = parseFloat(
      paymentDrawerData.membership_type_detail.membership_price
    );
    return totalPrice - calculateTotalPaid();
  };

  const getStatusChip = (active) => {
    return active ? (
      <Chip
        icon={<CheckCircleIcon />}
        label="Active"
        size="small"
        color="success"
        variant="outlined"
      />
    ) : (
      <Chip
        icon={<CancelIcon />}
        label="Inactive"
        size="small"
        color="error"
        variant="outlined"
      />
    );
  };

  const getPaymentStatusChip = (paid, due) => {
    if (due <= 0) {
      return (
        <Chip
          icon={<Paid />}
          label="Paid in Full"
          size="small"
          color="success"
          variant="outlined"
        />
      );
    } else if (paid === 0) {
      return (
        <Chip
          icon={<AccountBalanceWalletIcon />}
          label="No Payment"
          size="small"
          color="warning"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          icon={<ReceiptIcon />}
          label={`₹${due} Due`}
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }
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

      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className="mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                    Customer Memberships
                  </h1>
                </div>
                <p className="text-gray-600">
                  Manage all customer memberships, track payments, and
                  membership details
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchCustomerMembership}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <Refresh className="h-4 w-4" />
                  Refresh
                </button>
                <Link to={"/catalogue/create-customer-membership"}>
                  <button className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    + Add Membership
                  </button>
                </Link>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors"
                    placeholder="Search by name, phone, or membership code..."
                  />
                </div>

                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                  </Select>
                </FormControl>

                <button
                  onClick={resetSearch}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>

              {/* Stats Summary */}
              {customerMembership.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Memberships
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {customerMembership.length}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Person className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Active Memberships
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {customerMembership.filter((m) => m.active).length}
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
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ₹
                          {customerMembership.reduce(
                            (sum, m) => sum + (parseFloat(m.amount_paid) || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <CurrencyRupeeIcon className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹
                          {customerMembership.reduce(
                            (sum, m) => sum + (parseFloat(m.due_amount) || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <AccountBalanceWalletIcon className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Memberships Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Customer Memberships ({filterData.length})
                </h3>
                <div className="text-sm text-gray-600">
                  Showing {filterData.length} of {customerMembership.length}{" "}
                  memberships
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={50}
                />
                <p className="text-gray-600 font-medium">
                  Loading customer memberships...
                </p>
              </div>
            ) : filterData?.length > 0 ? (
              /* Table Content */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Financials
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Details
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
                    {filterData?.map((membership) => {
                      return (
                        <tr
                          key={membership?.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Customer Details */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <Person className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {membership?.customer?.customer_name || "-"}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {membership?.customer?.customer_phone ||
                                        "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Membership Details */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Loyalty className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-gray-900">
                                  {membership?.membership_code || "-"}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {membership?.membership_type_detail
                                  ?.membership_name || "-"}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <CurrencyRupeeIcon className="h-3.5 w-3.5 text-gray-400" />
                                <span className="font-medium">
                                  ₹
                                  {membership?.membership_type_detail
                                    ?.membership_price || "0"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Points */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                  <span className="font-bold text-green-700">
                                    {membership?.membership_type_detail
                                      ?.total_point || "0"}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Total
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Points
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="text-gray-600">
                                  Remaining:{" "}
                                </span>
                                <span className="font-medium">
                                  {membership?.remaining_point || "0"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Financials */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Paid:
                                </span>
                                <span className="font-medium text-green-600">
                                  ₹{membership?.amount_paid || "0"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                  Due:
                                </span>
                                <span className="font-medium text-red-600">
                                  ₹{membership?.due_amount || "0"}
                                </span>
                              </div>
                              {getPaymentStatusChip(
                                parseFloat(membership?.amount_paid || 0),
                                parseFloat(membership?.due_amount || 0)
                              )}
                            </div>
                          </td>

                          {/* Additional Details */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CalendarToday className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {membership?.created_at?.split("T")[0]}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BusinessIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {membership?.branch_name || "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <SupervisorAccountIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {membership?.manager_detail?.managername ||
                                    "-"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {getStatusChip(membership?.active)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpen(membership)}
                                  className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteCustomerMembership(membership?.id)
                                  }
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Delete"
                                >
                                  <Delete className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setDrawerdata(membership);
                                    toggleDrawer(true)();
                                  }}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1"
                                >
                                  <Info className="h-3 w-3" />
                                  Membership Details
                                </button>
                                <button
                                  onClick={() => {
                                    setPaymentDrawerdata(membership);
                                    setPaymentDrawerOpen(true);
                                    fetchPaymentDetails(membership?.id);
                                  }}
                                  className="text-xs text-green-600 hover:text-green-800 hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1"
                                >
                                  <ReceiptIcon className="h-3 w-3" />
                                  Payments
                                </button>
                              </div>
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
                  <Person className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Customer Memberships Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search || statusFilter !== "all"
                    ? "No memberships match your search criteria."
                    : "You haven't created any customer memberships yet."}
                </p>
                <button
                  onClick={() => {
                    if (search || statusFilter !== "all") {
                      resetSearch();
                    } else {
                      handleOpen(null);
                    }
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  {search || statusFilter !== "all"
                    ? "Clear Filters"
                    : "Create First Membership"}
                </button>
              </div>
            )}

            {/* Table Footer */}
            {filterData?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Showing {filterData.length} memberships</span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-green-600 font-medium">
                      {customerMembership.filter((m) => m.active).length} active
                    </span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-orange-600 font-medium">
                      ₹
                      {customerMembership.reduce(
                        (sum, m) => sum + (parseFloat(m.due_amount) || 0),
                        0
                      )}{" "}
                      total due
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              ...modalStyle,
              width: { xs: "90%", sm: "80%", md: "700px" },
              maxHeight: "90vh", // ✅ max height 90%
              overflowY: "auto", // ✅ scroll enable
            }}
          >
            {modalMembershipType && (
              <CreateCustomerMembership
                editData={modalMembershipType}
                onClose={handleClose}
              />
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Membership Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "90%", sm: "400px" },
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          },
        }}
      >
        <Box className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Membership Details
                </h3>
                <p className="text-gray-600 mt-1">
                  Complete membership information
                </p>
              </div>
              <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Membership Info */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <Loyalty className="h-6 w-6 text-indigo-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {drawerData?.membership_type_detail?.membership_name ||
                        "No Name"}
                    </h4>
                    <p className="text-sm text-gray-600">Membership Type</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹
                      {drawerData?.membership_type_detail?.membership_price ||
                        "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Validity</p>
                    <p className="text-lg font-medium text-gray-900">
                      {drawerData?.membership_type_detail?.validity_in_months ||
                        "0"}{" "}
                      months
                    </p>
                  </div>
                </div>
              </div>

              {/* Points Info */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="font-bold text-green-700">
                        {drawerData?.membership_type_detail?.total_point || "0"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Total Points</p>
                      <p className="text-sm text-gray-600">Available for use</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-gray-400" />
                  Terms & Conditions
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        drawerData?.membership_type_detail
                          ?.terms_and_conditions || "No terms specified",
                    }}
                    className="dangerous-html text-sm text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              fullWidth
              variant="contained"
              onClick={toggleDrawer(false)}
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": { backgroundColor: "#4338CA" },
              }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Drawer>

      {/* Payment Details Drawer */}
      <Drawer
        anchor="right"
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "90%", sm: "450px" },
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          },
        }}
      >
        <Box className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Payment History
                </h3>
                <p className="text-gray-600 mt-1">
                  {paymentDrawerData?.customer?.customer_name || "Customer"} -
                  Membership Payments
                </p>
              </div>
              <IconButton onClick={() => setPaymentDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Payment Summary */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹
                    {paymentDrawerData?.membership_type_detail
                      ?.membership_price || "0"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Paid Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{calculateTotalPaid().toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Due Amount</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{calculateDueAmount().toFixed(2)}
                  </p>
                </div>
              </div>

              {calculateDueAmount() > 0 && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Paid />}
                  onClick={() => {
                    setPaymentModalOpen(true);
                    setPaymentModalFormData({
                      payment_amount: "",
                      customer_membership: paymentDrawerData?.id,
                      manager: "",
                    });
                    fetchManagers();
                  }}
                  sx={{
                    backgroundColor: "#10B981",
                    "&:hover": { backgroundColor: "#059669" },
                  }}
                >
                  Add Payment
                </Button>
              )}
            </div>

            {/* Payment History */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ReceiptIcon className="h-5 w-5 text-gray-400" />
                Payment History
              </h4>

              {paymentData?.length > 0 ? (
                <div className="space-y-3">
                  {paymentData?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            Payment #{index + 1}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item?.created_at?.split("T")[0]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ₹{item?.payment_amount}
                          </p>
                          <p className="text-xs text-gray-500">Amount</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <SupervisorAccountIcon className="h-4 w-4" />
                        <span>
                          {item?.manager_detail?.managername || "No Manager"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ReceiptIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No payment history found</p>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Drawer>

      {/* Add Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setPaymentModalFormData({
            payment_amount: "",
            customer_membership: "",
            manager: "",
          });
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={paymentModalOpen}>
          <Box sx={{ ...modalStyle, width: { xs: "90%", sm: "400px" } }}>
            <div className="bg-white rounded-xl">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Add Payment
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Record a new payment installment
                    </p>
                  </div>
                  <IconButton
                    onClick={() => {
                      setPaymentModalOpen(false);
                      setPaymentModalFormData({
                        payment_amount: "",
                        customer_membership: "",
                        manager: "",
                      });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount *
                    </label>
                    <TextField
                      fullWidth
                      type="number"
                      value={paymentModalFormData.payment_amount}
                      onChange={(e) => {
                        setPaymentModalFormData({
                          ...paymentModalFormData,
                          payment_amount: e.target.value,
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        ),
                        sx: { borderRadius: "8px" },
                      }}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager *
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={paymentModalFormData.manager}
                        onChange={(e) => {
                          setPaymentModalFormData({
                            ...paymentModalFormData,
                            manager: e.target.value,
                          });
                        }}
                        MenuProps={MenuProps}
                        sx={{ borderRadius: "8px" }}
                      >
                        <MenuItem value="">
                          <span className="text-gray-400">Select manager</span>
                        </MenuItem>
                        {managerData?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <SupervisorAccountIcon className="h-4 w-4 text-gray-400" />
                              <span>{item.managername}</span>
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Due Amount Info */}
                  {calculateDueAmount() > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-700">
                          Remaining Due:
                        </span>
                        <span className="font-bold text-yellow-800">
                          ₹{calculateDueAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outlined"
                      onClick={() => setPaymentModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handlePaymentInstallment}
                      sx={{
                        backgroundColor: "#10B981",
                        "&:hover": { backgroundColor: "#059669" },
                      }}
                    >
                      Add Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default CustomerMembership;
