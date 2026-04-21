import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import { 
  Delete, 
  Edit, 
  Visibility, 
  Add, 
  Close, 
  Search, 
  Clear,
  AccountCircle,
  CardGiftcard,
  Payment,
  CalendarToday,
  AttachMoney,
  Person,
  Phone,
  DateRange
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import FormForGiftCard from "../FormForGiftCard/FormForGiftCard";

const ListofGiftCard = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [giftCards, setGiftCards] = useState([]);
  const [filteredGiftCards, setFilteredGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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

  // Fetch gift cards from API
  const fetchGiftCards = async () => {
     if (!navigator.onLine) {
              toast.error("No Internet Connection");
              return;
            }
            
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/giftcards",
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
        setGiftCards(data);
        setFilteredGiftCards(data);
      } else {
        toast.error(data.detail || "Failed to fetch gift cards");
      }
    } catch (error) {
      toast.error("An error occurred while fetching gift cards");
    } finally {
      setLoading(false);
    }
  };

  // Auto expire gift card function
  const autoExpireGiftCard = async (giftCard) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/giftcards/${giftCard.id}/`,
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
        setGiftCards((prevGiftCards) =>
          prevGiftCards.map((g) =>
            g.id === giftCard.id ? { ...g, status: "Inactive" } : g
          )
        );
        console.log(`Gift Card ${giftCard.giftcard_name} auto-expired`);
      } else {
        console.error("Failed to auto-expire gift card");
      }
    } catch (error) {
      console.error("Error auto-expiring gift card:", error);
    }
  };

  // Check for gift cards that need to be expired
  useEffect(() => {
    if (giftCards.length > 0 && !loading) {
      giftCards.forEach((giftCard) => {
        if (giftCard.status === "Active") {
          const remainingBenefits =
            parseFloat(giftCard.remaining_price_benefits) || 0;
          const endDate = giftCard.end_date ? new Date(giftCard.end_date) : null;
          const currentDate = new Date();

          const shouldExpireByBenefits = remainingBenefits <= 0;
          const shouldExpireByDate = endDate && endDate < currentDate;

          if (shouldExpireByBenefits || shouldExpireByDate) {
            autoExpireGiftCard(giftCard);
          }
        }
      });
    }
  }, [giftCards, loading]);

  // Delete gift card function
  const deleteGiftCard = async (id, giftCardName) => {
    const giftCard = giftCards.find((g) => g.id === id);
    if (giftCard && giftCard.status === "Inactive") {
      toast.error("Cannot delete expired gift card");
      return;
    }

    try {
      await confirm({
        title: "Confirm Deletion",
        description: `Are you sure you want to delete "${giftCardName}"?`,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: {
          style: { backgroundColor: "#dc2626", color: "white" },
        },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/giftcards/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Gift card successfully deleted");
        setGiftCards(giftCards.filter((giftCard) => giftCard.id !== id));
        setFilteredGiftCards(filteredGiftCards.filter((giftCard) => giftCard.id !== id));
      } else {
        toast.error("Failed to delete gift card");
      }
    } catch (error) {
      if (error === undefined || error === "cancel") {
        console.log("Deletion cancelled");
        return;
      }
      toast.error("An error occurred: " + error);
    }
  };

  // Handle edit gift card
  const handleEdit = (giftCard) => {
    if (giftCard.status === "Inactive") {
      toast.error("Cannot edit expired gift card");
      return;
    }
    setSelectedGiftCard(giftCard);
    setOpenEditModal(true);
  };

  // Handle view gift card
  const handleView = (giftCard) => {
    setSelectedGiftCard(giftCard);
    setOpenViewModal(true);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedGiftCard(null);
    fetchGiftCards();
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedGiftCard(null);
  };

  // Handle navigation to gift card create page
  const handleAddNewGiftCard = () => {
    navigate("/catalogue/gift-card");
  };

  // Filter gift cards based on search
  useEffect(() => {
    if (search === "") {
      if (activeTab === "all") {
        setFilteredGiftCards(giftCards);
      } else if (activeTab === "active") {
        setFilteredGiftCards(giftCards.filter(g => g.status === "Active"));
      } else if (activeTab === "expired") {
        setFilteredGiftCards(giftCards.filter(g => g.status === "Inactive"));
      }
    } else {
      const searchLower = search.toLowerCase();
      setFilteredGiftCards(
        giftCards.filter((giftCard) => {
          const matchesSearch = (
            giftCard.giftcard_purchase_customer_name?.toLowerCase().includes(searchLower) ||
            giftCard.giftcard_benefitted_customer_name?.toLowerCase().includes(searchLower) ||
            giftCard.giftcard_purchase_customer_phone?.includes(search) ||
            giftCard.giftcard_benefitted_customer_phone?.includes(search) ||
            giftCard.giftcard_name?.toLowerCase().includes(searchLower)
          );
          
          if (activeTab === "all") return matchesSearch;
          if (activeTab === "active") return matchesSearch && giftCard.status === "Active";
          if (activeTab === "expired") return matchesSearch && giftCard.status === "Inactive";
          return matchesSearch;
        })
      );
    }
  }, [search, giftCards, activeTab]);

  // Reset search
  const resetSearch = () => {
    setSearch("");
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

  // Format benefits for display (array)
  const formatBenefits = (benefits) => {
    if (!benefits || benefits.length === 0) return "-";
    return benefits.map(b => `${b.service}: ₹${b.value}`).join(", ");
  };

  // Format use history
  const formatUseHistory = (history) => {
    if (!history || history.length === 0) return "-";
    return history.map(h => `${formatDate(h.date)} - ${h.service}: ₹${h.amount_used}`).join(", ");
  };

  // Format payment modes
  const formatPaymentModes = (modes) => {
    if (!modes || modes.length === 0) return "-";
    return modes.join(", ");
  };

  // Format service includes
  const formatServiceIncludes = (services) => {
    if (!services || services.length === 0) return "-";
    return services.join(", ");
  };

  // Initial fetch
  useEffect(() => {
    fetchGiftCards();
  }, []);

  // Calculate stats
  const activeCount = giftCards.filter(g => g.status === "Active").length;
  const expiredCount = giftCards.filter(g => g.status === "Inactive").length;
  const totalValue = giftCards.reduce((sum, g) => sum + (parseFloat(g.purchase_price) || 0), 0);

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

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Gift Cards
              </h1>
              <p className="text-gray-600 mt-1">
                Manage gift cards for your customers
              </p>
            </div>
            <button
              onClick={handleAddNewGiftCard}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Add sx={{ fontSize: 20 }} />
              <span>Add New Gift Card</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gift Cards</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {giftCards.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CardGiftcard className="text-purple-600" sx={{ fontSize: 20 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Gift Cards</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {activeCount}
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
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{totalValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AttachMoney className="text-blue-600" sx={{ fontSize: 20 }} />
                </div>
              </div>
            </div>
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
                  placeholder="Search by customer name, phone, or gift card name..."
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
            <div className="flex gap-2">
              <button
                onClick={resetSearch}
                className="md:w-32 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-200 mt-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "all"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({giftCards.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "active"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "expired"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Expired ({expiredCount})
            </button>
          </div>
        </div>

        {/* Gift Cards List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <CircularProgress className="text-gray-900" />
              <p className="mt-3 text-gray-600">Loading gift cards...</p>
            </div>
          ) : filteredGiftCards?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredGiftCards.map((giftCard) => (
                <div
                  key={giftCard.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section - Card Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CardGiftcard className="text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {giftCard.giftcard_name || "Unnamed Gift Card"}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                giftCard.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {giftCard.status}
                            </span>
                            {giftCard.card_code && (
                              <span className="text-xs text-gray-500 font-mono">
                                Code: {giftCard.card_code}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            {/* Purchase Customer */}
                            <div className="flex items-center gap-2 text-sm">
                              <AccountCircle className="text-gray-400" sx={{ fontSize: 16 }} />
                              <div>
                                <p className="text-gray-500">Purchased by</p>
                                <p className="font-medium text-gray-900">
                                  {giftCard.giftcard_purchase_customer_name || "Unknown"}
                                </p>
                              </div>
                            </div>

                            {/* Benefitted Customer */}
                            <div className="flex items-center gap-2 text-sm">
                              <Person className="text-gray-400" sx={{ fontSize: 16 }} />
                              <div>
                                <p className="text-gray-500">For</p>
                                <p className="font-medium text-gray-900">
                                  {giftCard.giftcard_benefitted_customer_name || "Unknown"}
                                </p>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 text-sm">
                              <Payment className="text-gray-400" sx={{ fontSize: 16 }} />
                              <div>
                                <p className="text-gray-500">Value</p>
                                <p className="font-medium text-gray-900">
                                  ₹{parseFloat(giftCard.purchase_price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Dates and Remaining Benefits */}
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <CalendarToday sx={{ fontSize: 14 }} />
                              <span>Starts: {formatDate(giftCard.Start_date)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <DateRange sx={{ fontSize: 14 }} />
                              <span>Ends: {formatDate(giftCard.end_date)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <AttachMoney sx={{ fontSize: 14 }} />
                              <span>
                                Remaining: ₹{parseFloat(giftCard.remaining_price_benefits || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(giftCard)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Visibility sx={{ fontSize: 16 }} />
                        View
                      </button>
                      
                      {giftCard.status === "Active" ? (
                        <>
                          <button
                            onClick={() => handleEdit(giftCard)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit sx={{ fontSize: 16 }} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteGiftCard(giftCard.id, giftCard.giftcard_name)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Delete sx={{ fontSize: 16 }} />
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 px-3">No actions</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400">
                <CardGiftcard sx={{ fontSize: 60, className: "mx-auto mb-3" }} />
                <p className="text-lg font-medium text-gray-600 mb-1">No gift cards found</p>
                <p className="text-gray-500">
                  {search ? "Try adjusting your search" : "Get started by adding your first gift card"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Modal
          aria-labelledby="edit-gift-card-modal"
          aria-describedby="edit-gift-card-form"
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
              {selectedGiftCard && (
                <FormForGiftCard
                  giftCard={selectedGiftCard}
                  onClose={handleCloseEditModal}
                  isEdit={true}
                />
              )}
            </Box>
          </Fade>
        </Modal>

        {/* View Modal - Enhanced Design */}
        <Modal
          aria-labelledby="view-gift-card-modal"
          aria-describedby="view-gift-card-details"
          open={openViewModal}
          onClose={handleCloseViewModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openViewModal}>
            <Box sx={modalStyle}>
              {selectedGiftCard && (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Gift Card Details</h2>
                      <p className="text-gray-600 mt-1">
                        Complete information about the gift card
                      </p>
                    </div>
                    <button
                      onClick={handleCloseViewModal}
                      className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Close />
                    </button>
                  </div>

                  {/* Main Info Card */}
                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CardGiftcard className="text-purple-600" sx={{ fontSize: 32 }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {selectedGiftCard.giftcard_name || "Unnamed Gift Card"}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                selectedGiftCard.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {selectedGiftCard.status}
                            </span>
                            {selectedGiftCard.card_code && (
                              <span className="text-sm text-gray-600 font-mono">
                                Code: {selectedGiftCard.card_code}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{parseFloat(selectedGiftCard.purchase_price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">Total Value</p>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Purchase Customer */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AccountCircle sx={{ fontSize: 20 }} />
                          Purchase Customer
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{selectedGiftCard.giftcard_purchase_customer_name || "-"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{selectedGiftCard.giftcard_purchase_customer_phone || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Gender</p>
                              <p className="font-medium">{selectedGiftCard.giftcard_purchase_Customer_gender || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefitted Customer */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Person sx={{ fontSize: 20 }} />
                          Benefitted Customer
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{selectedGiftCard.giftcard_benefitted_customer_name || "-"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{selectedGiftCard.giftcard_benefitted_customer_phone || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Gender</p>
                              <p className="font-medium">{selectedGiftCard.giftcard_benefitted_Customer_gender || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CalendarToday sx={{ fontSize: 20 }} />
                          Validity Period
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">{formatDate(selectedGiftCard.Start_date)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">{formatDate(selectedGiftCard.end_date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Pricing Details */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AttachMoney sx={{ fontSize: 20 }} />
                          Pricing Details
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Purchase Price</p>
                              <p className="font-medium">₹{selectedGiftCard.purchase_price || "0.00"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Discount %</p>
                              <p className="font-medium">{selectedGiftCard.discount_percentage || "0"}%</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Discounted Price</p>
                              <p className="font-medium">₹{selectedGiftCard.purchase_discounted_price || "0.00"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Final Amount</p>
                              <p className="font-medium">₹{selectedGiftCard.final_amount || "0.00"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Total Benefits</p>
                              <p className="font-medium">₹{selectedGiftCard.total_price_benefits || "0.00"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Remaining Benefits</p>
                              <p className="font-medium">₹{selectedGiftCard.remaining_price_benefits || "0.00"}</p>
                            </div>
                          </div>
                          {selectedGiftCard.Benefits && selectedGiftCard.Benefits.length > 0 && (
                            <div className="border-t pt-3">
                              <p className="text-sm text-gray-500 mb-2">Services Included:</p>
                              <ul className="space-y-1">
                                {selectedGiftCard.Benefits.map((benefit, index) => (
                                  <li key={index} className="text-sm flex justify-between items-center py-1">
                                    <span>{benefit.service}</span>
                                    <span className="font-medium">₹{benefit.value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment & GST */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment & Tax</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Amount Paid</p>
                              <p className="font-medium">₹{selectedGiftCard.amount_paid || "0.00"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Remaining to Pay</p>
                              <p className="font-medium">₹{selectedGiftCard.remaining_amount_to_paid || "0.00"}</p>
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <p className="text-sm text-gray-500 mb-2">GST Details:</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm">Included</p>
                                <p className="font-medium">{selectedGiftCard.giftcard_is_gst ? "Yes" : "No"}</p>
                              </div>
                              {selectedGiftCard.giftcard_tax_amount && (
                                <div>
                                  <p className="text-sm">Tax Amount</p>
                                  <p className="font-medium">₹{selectedGiftCard.giftcard_tax_amount}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Sections */}
                  <div className="mt-6 space-y-6">
                    {/* Payment Modes & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">Payment Modes</h3>
                        <p className="text-gray-600">
                          {formatPaymentModes(selectedGiftCard.giftcard_payment_mode)}
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">Services Included</h3>
                        <p className="text-gray-600">
                          {formatServiceIncludes(selectedGiftCard.service_includes)}
                        </p>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    {selectedGiftCard.terms_and_conditions && (
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedGiftCard.terms_and_conditions,
                          }}
                          className="text-gray-600 text-sm prose prose-sm max-w-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

export default ListofGiftCard;