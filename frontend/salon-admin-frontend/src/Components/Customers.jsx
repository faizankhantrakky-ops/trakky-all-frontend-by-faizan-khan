import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "./DateRange/formatDate";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch, FiCalendar, FiUser, FiMail, FiPhone, FiMapPin, FiGift, FiCreditCard, FiUsers, FiAward, FiGlobe, FiCalendar as FiCal, FiShield } from "react-icons/fi";
import { CircularProgress, Avatar, Dialog, DialogContent, DialogTitle, IconButton, Chip } from "@mui/material";
import { Close } from "@mui/icons-material";

const Customers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const [customersData, setCustomersData] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filterField, setFilterField] = useState("phone_number");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      {
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      },
    ];
  } else {
    initialDateState = [
      {
        startDate: dateState2[0].startDate,
        endDate: dateState2[0].endDate,
        key: "selection",
      },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  useEffect(() => {
    getCustomers(false);
  }, []);

  /* --------------------------------------------------------------
     API – GET CUSTOMERS
  -------------------------------------------------------------- */
  const getCustomers = async (isDate) => {
    setLoading(true);
    try {
      let url = "";
      if (isDate) {
        const [{ startDate, endDate }] = dateState;
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        url = `https://backendapi.trakky.in/salons/salonuser/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      } else {
        url = `https://backendapi.trakky.in/salons/salonuser/`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const modifiedData = data.map((customer) => ({
          ...customer,
          registrationDateTime: new Date(customer.created_at).toLocaleString(),
        }));
        setCustomersData(modifiedData);
        setFilteredCustomers(modifiedData);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
        logoutUser();
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch customers. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------------
     API – DELETE USER
  -------------------------------------------------------------- */
  const deleteUser = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this user?",
        confirmationText: "Delete",
        cancellationText: "Cancel",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/salonuser/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("User Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        getCustomers(false);
      } else if (response.status === 401) {
        toast.error("You're logged out", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  /* --------------------------------------------------------------
     FILTER LOGIC
  -------------------------------------------------------------- */
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customersData);
    } else {
      setFilteredCustomers(
        customersData.filter((customer) => {
          const fieldValue = customer[filterField];
          return (
            fieldValue &&
            fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }
  }, [searchTerm, filterField, customersData]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  useEffect(() => {
    setFilteredCustomers(
      customersData.filter((customer) => {
        if (verifiedFilter === "all") return true;
        const isVerified = verifiedFilter === "true";
        return customer.verified === isVerified;
      })
    );
  }, [verifiedFilter, customersData]);

  /* --------------------------------------------------------------
     USER DETAILS HANDLER
  -------------------------------------------------------------- */
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  // Only essential columns in table
  const tableHeaders = [
    "Registration Date & Time",
    "Name", 
    "Phone No.",
    "Email",
    "Verified",
    "Profile Image",
    "DOB",
    "Actions"
  ];

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="px-5 py-5">
            <h1 className="text-xl font-bold text-gray-900">Customers Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered salon users
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={filterField === "name" ? "text" : "tel"}
                  placeholder={`Search by ${filterField === "name" ? "name" : "phone number"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Filter by Field */}
              <select
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                className="h-11 w-full sm:w-40 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="name">Name</option>
                <option value="phone_number">Phone Number</option>
              </select>

              {/* Verified Filter */}
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="h-11 w-full sm:w-40 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">All Users</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

            {/* Date Range Button */}
            <button
              onClick={() => setShowDateSelectionModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition whitespace-nowrap"
            >
              <FiCalendar className="text-gray-500" />
              <span>
                {dateState[0].startDate.getDate()}/{dateState[0].startDate.getMonth() + 1}/{dateState[0].startDate.getFullYear()}
                {" ~ "}
                {dateState[0].endDate.getDate()}/{dateState[0].endDate.getMonth() + 1}/{dateState[0].endDate.getFullYear()}
              </span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <CircularProgress size={48} thickness={4} />
                <p className="mt-4 text-base font-medium">Loading customers...</p>
              </div>
            ) : (
              <table className="w-full min-w-[1000px] table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="text-gray-500">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3"></div>
                          <p className="text-lg font-medium">
                            {searchTerm || verifiedFilter !== "all"
                              ? "No customers match your search."
                              : "No customer records found."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer, index) => (
                      <tr key={customer.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.registrationDateTime || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.phone_number || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {customer.email || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {customer.verified ? (
                            <CheckIcon className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <ClearIcon className="h-5 w-5 text-red-600 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {customer.image ? (
                            <img
                              src={customer.image}
                              alt="Profile"
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 mx-auto"
                            />
                          ) : (
                            <Avatar className="w-12 h-12 mx-auto bg-gray-200 text-gray-600 font-semibold text-sm">
                              {customer.name?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {customer.dob || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(customer)}
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                              title="View Details"
                            >
                              <AiOutlineEye className="h-4 w-4" />
                              View More
                            </button>
                            <button
                              onClick={() => deleteUser(customer.id)}
                              className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete User"
                            >
                              <AiFillDelete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <strong>{filteredCustomers.length}</strong> of{" "}
              <strong>{customersData.length}</strong> customer entries
            </p>
          </div>
        </div>

        {/* Date Range Modal */}
        <GeneralModal
          open={showDateSelectionModal}
          handleClose={() => setShowDateSelectionModal(false)}
        >
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setShowDateSelectionModal={setShowDateSelectionModal}
            onApply={() => getCustomers(true)}
          />
        </GeneralModal>

        {/* User Details Modal */}
        <Dialog
          open={userDetailsOpen}
          onClose={() => setUserDetailsOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle className="flex items-center justify-between bg-[#502DA6] text-white">
            <div className="flex items-center gap-3">
              <FiUser className="text-white text-xl" />
              <span className="text-lg font-semibold">User Profile Details</span>
            </div>
            <IconButton onClick={() => setUserDetailsOpen(false)} className="text-white hover:bg-white/20">
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent className="">
            {selectedUser && (
              <div className="p-2">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-xl shadow-sm border">
                 
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name || "No Name Provided"}</h2>
                      <Chip 
                        label={selectedUser.verified ? "Verified" : "Unverified"} 
                        size="small"
                        color={selectedUser.verified ? "success" : "error"}
                        variant="filled"
                      />
                    </div>
                    <p className="text-gray-600 flex items-center gap-2 mb-1">
                      <FiPhone className="text-sm" />
                      <span className="font-medium">{selectedUser.phone_number}</span>
                    </p>
                    {selectedUser.email && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <FiMail className="text-sm" />
                        <span className="font-medium">{selectedUser.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b">
                        <FiUser className="text-blue-600" />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-4">
                        <DetailItem 
                          icon={<FiMail className="text-blue-500" />}
                          label="Email Address"
                          value={selectedUser.email}
                          missingText="No email provided"
                        />
                        <DetailItem 
                          icon={<FiGift className="text-purple-500" />}
                          label="Date of Birth"
                          value={selectedUser.dob}
                          missingText="Not specified"
                        />
                        <DetailItem 
                          icon={<FiAward className="text-orange-500" />}
                          label="Referral Code"
                          value={selectedUser.referral_code}
                          missingText="No referral code"
                        />
                        <DetailItem 
                          icon={<FiCal className="text-green-500" />}
                          label="Registration Date"
                          value={new Date(selectedUser.created_at).toLocaleString()}
                        />
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b">
                        <FiMapPin className="text-red-500" />
                        Location Details
                      </h3>
                      
                      <div className="space-y-4">
                        <DetailItem 
                          icon={<FiMapPin className="text-red-400" />}
                          label="City"
                          value={selectedUser.city}
                          missingText="Not specified"
                        />
                        <DetailItem 
                          icon={<FiMapPin className="text-red-400" />}
                          label="Area"
                          value={selectedUser.area}
                          missingText="Not specified"
                        />
                        <DetailItem 
                          icon={<FiGlobe className="text-red-400" />}
                          label="Country"
                          value={selectedUser.country}
                          missingText="Not specified"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wallet & Referrals */}
                  <div className="space-y-6">
                    {/* Coin Wallet */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b">
                        <FiCreditCard className="text-green-600" />
                        Coin Wallet
                      </h3>
                      
                      {selectedUser.coin_wallet ? (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Current Balance</span>
                            <span className="text-3xl font-bold text-green-600">
                              {selectedUser.coin_wallet.coin_balance}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Coins</span>
                            <span>Wallet ID: {selectedUser.coin_wallet.id}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <p className="text-xs text-gray-500">
                              Created: {new Date(selectedUser.coin_wallet.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
                          <FiCreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 font-medium">No wallet information available</p>
                        </div>
                      )}
                    </div>

                    {/* Referrals Received */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b">
                        <FiUsers className="text-purple-600" />
                        Referrals Received
                      </h3>

                      {selectedUser.referrals_received && selectedUser.referrals_received.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedUser.referrals_received.map((referral, index) => (
                            <div key={referral.id} className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:bg-purple-100 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 mb-1">
                                    Referred by: <span className="text-purple-600">{referral.user_phone}</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Referral Code: <span className="font-mono">{referral.referral_code}</span>
                                  </p>
                                </div>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                  +{referral.coins_assigned} coins
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>ID: {referral.id}</span>
                                <span>{new Date(referral.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
                          <FiUsers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 font-medium">No referrals received</p>
                        </div>
                      )}
                    </div>

                    {/* Account Status */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b">
                        <FiShield className="text-blue-600" />
                        Account Status
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Verification Status</span>
                          <Chip 
                            label={selectedUser.verified ? "Verified" : "Unverified"} 
                            color={selectedUser.verified ? "success" : "error"}
                            variant="filled"
                            size="small"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">User ID</span>
                          <span className="text-sm font-mono text-gray-900">{selectedUser.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                          <span className="text-sm text-gray-900">
                            {[
                              selectedUser.name,
                              selectedUser.email, 
                              selectedUser.phone_number,
                              selectedUser.city
                            ].filter(Boolean).length}/4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

/* --------------------------------------------------------------
   DETAIL ITEM COMPONENT
-------------------------------------------------------------- */
const DetailItem = ({ icon, label, value, missingText = "Not available" }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <p className={`text-sm font-semibold truncate ${
        value ? 'text-gray-900' : 'text-gray-400 italic'
      }`}>
        {value || missingText}
      </p>
    </div>
  </div>
);

export default Customers;