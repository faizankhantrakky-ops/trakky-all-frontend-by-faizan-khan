import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniHeader from "./MiniHeader";
import AuthContext from "../../Context/Auth";
import { useConfirm } from "material-ui-confirm";
import CreateCustomerMembership from "./form/CreateCustomerMembership";
import { Search, User, Phone, Tag, IndianRupee, Calendar, Building, UserCheck, FileText, Edit, Trash2, Plus, RefreshCw, Info, ChevronRight, CreditCard, Percent, Clock, CheckCircle, X } from "lucide-react";

const CustomerMembership = () => {
  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();
  const [customerMembership, setCustomerMembership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedDrawerData, setSelectedDrawerData] = useState(null);

  const fetchCustomerMembership = async () => {

               if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }
          
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/customer-memberships/`,
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
        applyFilters(data);
      } else {
        toast.error(data.detail || "Failed to fetch customer Memberships");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerMembership = async (id) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this customer Membership?`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/customer-memberships/${id}/`,
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
      toast.error("An error occurred");
    }
  };

  const applyFilters = (data = customerMembership) => {
    let result = data;

    if (searchTerm) {
      result = result.filter((membership) => {
        const customerName = membership?.customer_name ?? membership?.customer_data?.customer_name ?? "";
        const customerPhone = membership?.customer_number ?? membership?.customer_data?.customer_phone ?? "";
        const membershipCode = membership?.membership_code ?? "";
        
        return (
          customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customerPhone.toString().includes(searchTerm) ||
          membershipCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilterData(result);
  };

  useEffect(() => {
    fetchCustomerMembership();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedFilter]);

  const handleOpenModal = (membership = null) => {
    setSelectedMembership(membership);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMembership(null);
    fetchCustomerMembership();
  };

  const handleOpenDrawer = (membership) => {
    setSelectedDrawerData(membership);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerData(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedFilter("all");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPaymentStatus = (amountPaid, totalPrice) => {
    const paid = parseFloat(amountPaid) || 0;
    const total = parseFloat(totalPrice) || 0;
    
    if (paid === 0) return { label: "Not Paid", color: "bg-red-100 text-red-700 border-red-200" };
    if (paid < total) return { label: "Partial", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    if (paid >= total) return { label: "Paid", color: "bg-green-100 text-green-700 border-green-200" };
    return { label: "Unknown", color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <MiniHeader title="Customer Membership" />
      
      <div className="p-6 -mt-5">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mt-2">
                Manage all customer membership subscriptions and payments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCustomerMembership}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Membership
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Memberships
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  placeholder="Search by name, phone, or membership code..."
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Memberships Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#492DBD] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#492DBD] rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading customer memberships...</p>
          </div>
        ) : filterData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filterData.map((membership) => {
              const paymentStatus = getPaymentStatus(membership.amount_paid, membership.membership_price);
              const customerName = membership?.customer_name ?? membership?.customer_data?.customer_name ?? "N/A";
              const customerPhone = membership?.customer_number ?? membership?.customer_data?.customer_phone ?? "N/A";
              
              return (
                <div
                  key={membership.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Membership Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                       
                        <div>
                          <h3 className="font-bold text-gray-900">{customerName}</h3>
                          <p className="text-sm text-gray-500 mt-1">{customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(membership)}
                          className="p-2 text-[#492DBD] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCustomerMembership(membership.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Membership Code & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {membership.membership_code}
                        </span>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${paymentStatus.color}`}>
                        <div className={`w-2 h-2 rounded-full ${paymentStatus.color.includes('red') ? 'bg-red-500' : paymentStatus.color.includes('yellow') ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <span className="text-sm font-medium">{paymentStatus.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Membership Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Total Price</span>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">
                          ₹{membership.membership_price || "0"}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Paid</span>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">
                          ₹{membership.amount_paid || "0"}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Remaining</span>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">
                          ₹{membership.pending_price || "0"}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Percent className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Tax (18%)</span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          ₹{membership.tax_amount || "0"}
                        </p>
                      </div>
                    </div>

                    {/* Membership Type Info */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Membership Type</span>
                        </div>
                        <button
                          onClick={() => handleOpenDrawer(membership)}
                          className="text-[#492DBD] hover:text-[#3a2199] text-sm font-medium flex items-center gap-1"
                        >
                          <Info className="w-3 h-3" />
                          Details
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-900 font-medium">
                          {membership.membership_data?.name || "N/A"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            <span>₹{membership.membership_data?.price || "0"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{membership.membership_data?.validity_in_month || "0"} months</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Branch and Manager Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Branch</span>
                        </div>
                        <p className="text-gray-900">
                          {membership.branch_name || "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Manager</span>
                        </div>
                        <p className="text-gray-900">
                          {membership.manager_name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Membership Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(membership.created_at)}</span>
                      </div>
                      <div className="text-xs">
                        ID: {membership.id}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No memberships found" : "No customer memberships available"}
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-4">
              {searchTerm
                ? "Try adjusting your search to find what you're looking for."
                : "Get started by creating a new customer membership."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Membership
              </button>
            )}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && filterData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div>
                Showing <span className="font-semibold">{filterData.length}</span> membership
                {filterData.length !== 1 ? 's' : ''}
              </div>
              <div className="text-gray-500">
                Total customers: <span className="font-semibold">{customerMembership.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedMembership ? "Edit Customer Membership" : "Create New Customer Membership"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CreateCustomerMembership
                  app={selectedMembership}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Membership Details Drawer */}
      {isDrawerOpen && selectedDrawerData && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseDrawer}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Membership Details</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedDrawerData.membership_data?.name}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseDrawer}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Price Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Original Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{selectedDrawerData.membership_data?.price || "0"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Discount</p>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedDrawerData.membership_data?.discount_percentage || "0"}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Validity */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">Validity Period</h3>
                    </div>
                    <p className="text-gray-700">
                      {selectedDrawerData.membership_data?.validity_in_month || "0"} months
                    </p>
                  </div>

                  {/* Services Included */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">Services Included</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedDrawerData.membership_data?.whole_service ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">All Services Included</span>
                        </div>
                      ) : selectedDrawerData.membership_data?.service_data?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDrawerData.membership_data.service_data.map((service, index) => (
                            <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0">
                              <div>
                                <p className="font-medium text-gray-900">{service.service_name}</p>
                                <p className="text-sm text-gray-500">{service.gender}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">₹{service.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No specific services included</p>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  {selectedDrawerData.membership_data?.term_and_conditions && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Terms & Conditions</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                        <div 
                          dangerouslySetInnerHTML={{ __html: selectedDrawerData.membership_data.term_and_conditions }}
                          className="prose prose-sm max-w-none text-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseDrawer}
                    className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMembership;