import React, { useContext, useState, useEffect } from "react";
import MiniHeader from "./MiniHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import { Delete, Edit, InfoOutlined, Search, Refresh } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CreateMembershipType from "./form/CreateMembershipType";
import CardMembershipIcon from "@mui/icons-material/CardMembership";

import PointsIcon from "@mui/icons-material/Stars";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import SpaIcon from "@mui/icons-material/Spa";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Link } from "react-router-dom";

const MembershipType = () => {
  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalMembershipType, setModalMembershipType] = useState(null);
  const [openPointPerMassage, setOpenPointPerMassage] = useState(false);
  const [pointPerMassageItem, setPointPerMassageItem] = useState(null);

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

  const fetchMembershipTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/membership-type-new/`,
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
        setMembershipTypes(data);
        setFilterData(data);
      } else {
        toast.error(data.detail || "Failed to fetch Membership Type's");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const deleteMembershipType = async (id) => {
    try {
      await confirm({
        title: "Delete Membership Type",
        description: "Are you sure you want to delete this membership type? This action cannot be undone.",
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { variant: "contained", color: "error" },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/membership-type-new/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response?.ok) {
        toast.success("Membership type deleted successfully");
        fetchMembershipTypes();
      } else {
        toast.error("Failed to delete membership type");
      }
    } catch (error) {
      if (error === undefined || error === "cancel") {
        return;
      }
      toast.error("An error occurred: " + error);
    }
  };

  const handleOpen = (membershipType) => {
    setModalMembershipType(membershipType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalMembershipType(null);
    fetchMembershipTypes();
  };

  useEffect(() => {
    fetchMembershipTypes();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilterData(membershipTypes);
    } else {
      setFilterData(
        membershipTypes?.filter((membershipType) =>
          membershipType?.membership_name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, membershipTypes]);

  const calculateTotalServices = (membershipType) => {
    return membershipType?.service_ids?.length || 0;
  };

  const calculateAveragePoints = (membershipType) => {
    const services = membershipType?.service_ids || [];
    if (services.length === 0) return 0;
    const totalPoints = services.reduce((sum, service) => sum + (service.points_per_massage || 0), 0);
    return Math.round(totalPoints / services.length);
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
      
      {/* <MiniHeader title="Membership Type's" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className=" mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                    Membership Type's
                  </h1>
                </div>
                <p className="text-gray-600">
                  Manage and configure all Membership Type's for your spa
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={fetchMembershipTypes}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <Refresh className="h-4 w-4" />
                  Refresh
                </button>
             <Link to={'/catalogue/create-membership-type'}>
                <button
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  + Add Membership
                </button>
             </Link>
              </div>
            </div>

            {/* Search and Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                    placeholder="Search by membership name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setSearch("")}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>

              {/* Stats Summary */}
              {filterData?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Total Memberships</p>
                        <p className="text-2xl font-bold text-gray-900">{filterData.length}</p>
                      </div>
                      <CardMembershipIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {filterData.reduce((sum, mt) => sum + calculateTotalServices(mt), 0)}
                        </p>
                      </div>
                      <SpaIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium">Avg. Points</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {filterData.length > 0 
                            ? Math.round(filterData.reduce((sum, mt) => sum + calculateAveragePoints(mt), 0) / filterData.length)
                            : 0}
                        </p>
                      </div>
                      <PointsIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">Avg. Validity</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {filterData.length > 0 
                            ? Math.round(filterData.reduce((sum, mt) => sum + (mt.validity_in_months || 0), 0) / filterData.length)
                            : 0} months
                        </p>
                      </div>
                      <CalendarMonthIcon className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Membership Type's Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                All Membership Type's ({filterData.length})
              </h3>
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
                <p className="text-gray-600 font-medium">Loading Membership Type's...</p>
              </div>
            ) : filterData?.length > 0 ? (
              /* Table Content */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <CardMembershipIcon className="h-4 w-4" />
                          Membership Details
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <CurrencyRupeeIcon className="h-4 w-4" />
                          Pricing & Validity
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <PointsIcon className="h-4 w-4" />
                          Points
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DescriptionIcon className="h-4 w-4" />
                          Terms
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filterData?.map((membershipType, index) => (
                      <tr key={membershipType.id} className="hover:bg-gray-50 transition-colors duration-150">
                        {/* Index */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-center">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                              {index + 1}
                            </span>
                          </div>
                        </td>

                        {/* Membership Details */}
                        <td className="px-6 py-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {membershipType.membership_name || "Unnamed Membership"}
                            </h4>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <SpaIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {calculateTotalServices(membershipType)} services
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setOpenPointPerMassage(true);
                                  setPointPerMassageItem(membershipType);
                                }}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <InfoOutlined className="h-4 w-4" />
                                View Services
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Pricing & Validity */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CurrencyRupeeIcon className="h-5 w-5 text-gray-700" />
                              <span className="text-xl font-bold text-gray-900">
                                {membershipType.membership_price || "0"}
                              </span>
                              <span className="text-sm text-gray-500">/membership</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarMonthIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {membershipType.validity_in_months || "0"} months validity
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Points */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <PointsIcon className="h-5 w-5 text-purple-600" />
                              <span className="text-lg font-bold text-gray-900">
                                {membershipType.total_point || "0"}
                              </span>
                              <span className="text-sm text-gray-500">total points</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Avg. {calculateAveragePoints(membershipType)} points per massage
                            </div>
                          </div>
                        </td>

                        {/* Terms & Conditions */}
                        <td className="px-6 py-4 max-w-xs">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: membershipType.terms_and_conditions || "No terms specified",
                            }}
                            className="dangerous-html text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all cursor-help"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpen(membershipType)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteMembershipType(membershipType.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Delete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                  No Membership Type's Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {search ? "No Membership Type's match your search." : "You haven't created any Membership Type's yet."}
                </p>
                <button
                  onClick={() => {
                    if (search) setSearch("");
                    else handleOpen(null);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {search ? "Clear Search" : "Create First Membership"}
                </button>
              </div>
            )}

            {/* Table Footer */}
            {filterData?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>Showing {filterData.length} of {membershipTypes.length} memberships</span>
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
        maxHeight: "90vh",     // 🔥 max height 90%
        overflowY: "auto",     // 🔥 scroll enable
      }}
    >
      {modalMembershipType && (
        <CreateMembershipType
          editData={modalMembershipType}
          onClose={handleClose}
        />
      )}
    </Box>
  </Fade>
</Modal>



      {/* Points Per Massage Modal */}
      <Modal
        open={openPointPerMassage}
        onClose={() => setOpenPointPerMassage(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openPointPerMassage}>
          <Box sx={{ ...modalStyle, width: { xs: '90%', sm: '80%', md: '800px' } }}>
            <div className="bg-white rounded-xl">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Service Points Details
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {pointPerMassageItem?.membership_name || "Membership"} - Points per massage
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenPointPerMassage(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Services Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Service Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Price (₹)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Points Per Massage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pointPerMassageItem?.service_ids?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.name || "Unnamed Service"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <CurrencyRupeeIcon className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">{item.price || "0"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <span className="font-bold text-purple-700">
                                  {item.points_per_massage || "0"}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">points</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                {pointPerMassageItem?.service_ids?.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pointPerMassageItem?.service_ids?.length || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Average Points</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {calculateAveragePoints(pointPerMassageItem)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Points</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pointPerMassageItem?.total_point || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setOpenPointPerMassage(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default MembershipType;