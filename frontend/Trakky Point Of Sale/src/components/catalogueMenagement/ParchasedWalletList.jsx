import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import { Delete, Edit, Add, Search, Clear, Visibility } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import PurchaseWallet from "./PurchaseWallet";

const PurchasedWalletList = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "95vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 0,
    borderRadius: "10px",
    overflow: "auto",
  };

  // Fetch wallets from API
  const fetchWallets = async () => {
     if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
        
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/wallets/",
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
        setWallets(data);
        setFilteredWallets(data);
      } else {
        toast.error(data.detail || "Failed to fetch wallets");
      }
    } catch (error) {
      toast.error("An error occurred while fetching wallets");
    } finally {
      setLoading(false);
    }
  };

  // Auto expire wallet function
  const autoExpireWallet = async (wallet) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/wallets/${wallet.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            status: "Inactive",
          }),
        }
      );

      if (response.ok) {
        setWallets((prevWallets) =>
          prevWallets.map((w) =>
            w.id === wallet.id ? { ...w, status: "Inactive" } : w
          )
        );
        console.log(`Wallet ${wallet.wallet_name} auto-expired`);
      } else {
        console.error("Failed to auto-expire wallet");
      }
    } catch (error) {
      console.error("Error auto-expiring wallet:", error);
    }
  };

  // Check for wallets that need to be expired
  useEffect(() => {
    if (wallets.length > 0 && !loading) {
      wallets.forEach((wallet) => {
        if (wallet.status === "Active") {
          const remainingBenefits =
            parseFloat(wallet.remaining_price_benefits) || 0;
          const endDate = wallet.end_date ? new Date(wallet.end_date) : null;
          const currentDate = new Date();

          const shouldExpireByBenefits = remainingBenefits <= 0;
          const shouldExpireByDate = endDate && endDate < currentDate;

          if (shouldExpireByBenefits || shouldExpireByDate) {
            autoExpireWallet(wallet);
          }
        }
      });
    }
  }, [wallets, loading]);

  // Delete wallet function
  const deleteWallet = async (id, walletName) => {
    const wallet = wallets.find((w) => w.id === id);
    if (wallet && wallet.status === "Inactive") {
      toast.error("Cannot delete expired wallet");
      return;
    }

    try {
      await confirm({
        title: "Confirm Deletion",
        description: `Are you sure you want to delete "${walletName}"?`,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: {
          style: { backgroundColor: "#dc2626", color: "white" },
        },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/wallets/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Wallet successfully deleted");
        setWallets(wallets.filter((wallet) => wallet.id !== id));
      } else {
        toast.error("Failed to delete wallet");
      }
    } catch (error) {
      if (error === undefined || error === "cancel") {
        console.log("Deletion cancelled");
        return;
      }
      toast.error("An error occurred: " + error);
    }
  };

  // Handle edit wallet
  const handleEdit = (wallet) => {
    if (wallet.status === "Inactive") {
      toast.error("Cannot edit expired wallet");
      return;
    }
    setSelectedWallet(wallet);
    setOpenEditModal(true);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedWallet(null);
    fetchWallets();
  };

  // Handle navigation to purchase wallet page
  const handleAddNewWallet = () => {
    navigate("/customer-loyalty/add-purchase-wallet-list");
  };

  // Filter wallets based on search
  useEffect(() => {
    if (search === "") {
      setFilteredWallets(wallets);
    } else {
      const searchLower = search.toLowerCase();
      setFilteredWallets(
        wallets.filter((wallet) => {
          return (
            wallet.customer_name?.toLowerCase().includes(searchLower) ||
            wallet.customer_phone?.includes(search) ||
            wallet.wallet_name?.toLowerCase().includes(searchLower)
          );
        })
      );
    }
  }, [search, wallets]);

  // Reset search
  const resetSearch = () => {
    setSearch("");
    setFilteredWallets(wallets);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format benefits for display
  const formatBenefits = (benefits) => {
    if (!benefits) return "-";

    if (typeof benefits === "string") {
      return benefits;
    }

    if (typeof benefits === "object") {
      return Object.entries(benefits)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }

    return JSON.stringify(benefits);
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Display wallet image
  const displayWalletImage = (walletImage) => {
    if (!walletImage) return "-";
    return (
      <img
        src={walletImage}
        alt="Wallet"
        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
      />
    );
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (wallet) => {
    const price = parseFloat(wallet.purchase_price) || 0;
    const discountPercent = parseFloat(wallet.discount_percentage) || 0;

    if (discountPercent > 0) {
      return price - (price * discountPercent) / 100;
    }

    return wallet.purchase_discounted_price || price;
  };

  // Calculate tax amount
  const calculateTaxAmount = (wallet) => {
    const discountedPrice = calculateDiscountedPrice(wallet);

    if (wallet.wallet_is_gst) {
      if (wallet.wallet_tax_amount) {
        return parseFloat(wallet.wallet_tax_amount);
      } else if (wallet.wallet_tax_percent) {
        const taxPercent = parseFloat(wallet.wallet_tax_percent) || 0;
        return (discountedPrice * taxPercent) / 100;
      }
    }

    return 0;
  };

  // Calculate total price with tax
  const calculateTotalWithTax = (wallet) => {
    const discountedPrice = calculateDiscountedPrice(wallet);
    const taxAmount = calculateTaxAmount(wallet);
    return discountedPrice + taxAmount;
  };

  // Initial fetch
  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
        />

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Purchased Wallets
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your customer wallets
              </p>
            </div>
            <button
              onClick={handleAddNewWallet}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Add sx={{ fontSize: 20 }} />
              <span>Add New Wallet</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                  placeholder="Search by customer name, phone, or wallet name..."
                />
                {search && (
                  <button
                    onClick={resetSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Clear />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={resetSearch}
              className="md:w-32 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wallets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {wallets.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">W</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Wallets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {wallets.filter((w) => w.status === "Active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">A</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired Wallets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {wallets.filter((w) => w.status === "Inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold">E</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price & Benefits
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Validity
                  </th>
                  <th scope="col" className="px6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <CircularProgress className="text-gray-900" />
                      <p className="mt-3 text-gray-600">Loading wallets...</p>
                    </td>
                  </tr>
                ) : filteredWallets?.length > 0 ? (
                  filteredWallets?.map((wallet) => {
                    const discountedPrice = calculateDiscountedPrice(wallet);
                    const taxAmount = calculateTaxAmount(wallet);
                    const totalWithTax = calculateTotalWithTax(wallet);
                    const isExpanded = expandedRows[wallet.id];

                    return (
                      <React.Fragment key={wallet.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {wallet.customer_name || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {wallet.customer_phone || "No phone"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                ID: {wallet.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {displayWalletImage(wallet.wallet_image)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {wallet.wallet_name || "Unnamed Wallet"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Original: ₹{parseFloat(wallet.purchase_price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                ₹{discountedPrice.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Benefits: ₹{parseFloat(wallet.remaining_price_benefits || 0).toFixed(2)} remaining
                              </p>
                              {wallet.discount_percentage && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  {wallet.discount_percentage}% off
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="text-gray-500">From:</span>{" "}
                                <span className="font-medium">{formatDate(wallet.Start_date)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-500">To:</span>{" "}
                                <span className="font-medium">{formatDate(wallet.end_date)}</span>
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                wallet.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {wallet.status === "Active" ? "Active" : "Expired"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {wallet.status === "Active" ? (
                                <>
                                  <button
                                    onClick={() => handleEdit(wallet)}
                                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Edit sx={{ fontSize: 16 }} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteWallet(wallet.id, wallet.wallet_name)}
                                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Delete sx={{ fontSize: 16 }} />
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-400 text-sm">No actions</span>
                              )}
                              <button
                                onClick={() => toggleRowExpansion(wallet.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Visibility sx={{ fontSize: 16 }} />
                                {isExpanded ? "Less" : "More"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Row Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-gray-50 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Payment Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900">Payment Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Amount Paid:</span>
                                      <span className="font-medium">₹{parseFloat(wallet.amount_paid || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Remaining Amount:</span>
                                      <span className="font-medium">₹{parseFloat(wallet.remaining_amount_to_paid || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Discounted Price:</span>
                                      <span className="font-medium">₹{discountedPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Tax Amount:</span>
                                      <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Total with Tax:</span>
                                      <span className="font-medium text-green-600">₹{totalWithTax.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Benefit Details */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900">Benefits</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Total Benefits:</span>
                                      <span className="font-medium">₹{parseFloat(wallet.total_price_benefits || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Remaining Benefits:</span>
                                      <span className="font-medium">₹{parseFloat(wallet.remaining_price_benefits || 0).toFixed(2)}</span>
                                    </div>
                                    {wallet.Benefits && (
                                      <div className="text-sm">
                                        <p className="text-gray-500 mb-1">Details:</p>
                                        <p className="text-gray-700 bg-white p-2 rounded border">
                                          {formatBenefits(wallet.Benefits)}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900">Additional Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">GST Included:</span>
                                      <span className="font-medium">{wallet.wallet_is_gst ? "Yes" : "No"}</span>
                                    </div>
                                    {wallet.wallet_tax_percent && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tax %:</span>
                                        <span className="font-medium">{wallet.wallet_tax_percent}%</span>
                                      </div>
                                    )}
                                    <div className="text-sm">
                                      <p className="text-gray-500 mb-1">Created:</p>
                                      <p className="text-gray-700">{formatDate(wallet.created_at)}</p>
                                    </div>
                                    {wallet.Customer_gender && (
                                      <div className="text-sm">
                                        <p className="text-gray-500 mb-1">Gender:</p>
                                        <p className="text-gray-700">{wallet.Customer_gender}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <svg
                          className="w-12 h-12 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-gray-600 mb-1">No wallets found</p>
                        <p className="text-gray-500">
                          {search ? "Try adjusting your search" : "Get started by adding your first wallet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          aria-labelledby="edit-wallet-modal"
          aria-describedby="edit-wallet-form"
          open={openEditModal}
          onClose={handleCloseEditModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openEditModal}>
            <Box sx={modalStyle}>
              {selectedWallet && (
                <PurchaseWallet
                  wallet={selectedWallet}
                  onClose={handleCloseEditModal}
                  isEdit={true}
                />
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default PurchasedWalletList;