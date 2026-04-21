import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniHeader from "./MiniHeader";
import AuthContext from "../../Context/Auth";
import { useConfirm } from "material-ui-confirm";
import CreateMembershipType from "./form/CreateMembershipType";
import {
  Search,
  Filter,
  IndianRupee,
  Percent,
  Calendar,
  Users,
  FileText,
  Edit,
  Trash2,
  Plus,
  Tag,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

const MembershipType = () => {
  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();
  const [membershipTypes, setMembershipTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMembershipType, setModalMembershipType] = useState(null);

  const fetchMembershipTypes = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;   
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/memberships/`,
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
        applyFilters(data);
      } else {
        toast.error(data.detail || "Failed to fetch membership type");
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
        description: `Are you sure you want to delete this membership type?`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/memberships/${id}/`,
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
      toast.error("An error occurred");
    }
  };

  const handleOpenModal = (membershipType = null) => {
    setModalMembershipType(membershipType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMembershipType(null);
    fetchMembershipTypes();
  };

  const applyFilters = (data = membershipTypes) => {
    let result = data;

    if (search) {
      result = result.filter((membershipType) =>
        membershipType?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply additional filters if needed
    setFilterData(result);
  };

  useEffect(() => {
    fetchMembershipTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedFilter]);

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <ToastContainer position="top-right" autoClose={3000} />

      <MiniHeader title="Membership Type" />

      <div className="p-6 -mt-5">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mt-2">
                Create and manage membership's packages for your salon
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMembershipTypes}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  placeholder="Search by membership name..."
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedFilter("all");
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Memberships Grid/Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#492DBD] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#492DBD] rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading memberships...
            </p>
          </div>
        ) : filterData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filterData.map((membershipType) => (
              <div
                key={membershipType.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Membership Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {membershipType.name || "No Name"}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(membershipType.price)}
                          </span>
                        </div>
                        {membershipType.discount_percentage && (
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">
                              {membershipType.discount_percentage}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(membershipType)}
                        className="p-2 text-[#492DBD] hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMembershipType(membershipType.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Membership Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Validity
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {membershipType.validity_in_month || "-"} month
                        {membershipType.validity_in_month > 1 ? "s" : ""}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Discount Price
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">
                        {formatPrice(membershipType.discount_price)}
                      </p>
                    </div>
                  </div>

                  {/* Services Included */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Included Services
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {membershipType.whole_service ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 font-medium">
                            All Services Included
                          </span>
                        </div>
                      ) : membershipType.service_data?.length > 0 ? (
                        <div className="space-y-2">
                          {membershipType.service_data
                            .slice(0, 3)
                            .map((service, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-gray-700">
                                  {service.service_name}
                                </span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {service.gender}
                                </span>
                              </div>
                            ))}
                          {membershipType.service_data.length > 3 && (
                            <div className="text-sm text-gray-500 text-center pt-1">
                              +{membershipType.service_data.length - 3} more
                              services
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No specific services included
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  {membershipType.term_and_conditions && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Terms & Conditions
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 max-h-20 overflow-y-auto">
                        <p className="text-gray-600 text-sm">
                          {truncateText(
                            membershipType.term_and_conditions.replace(
                              /<[^>]*>/g,
                              ""
                            ),
                            120
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Membership Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Membership ID: {membershipType.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No memberships found" : "No memberships available"}
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-4">
              {search
                ? "Try adjusting your search to find what you're looking for."
                : "Get started by creating your first membership package."}
            </p>
            {!search && (
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
                  Showing{" "}
                  <span className="font-semibold">{filterData.length}</span>{" "}
                  membership
                  {filterData.length !== 1 ? "s" : ""}
                </div>
                <div className="text-gray-500">
                  Total memberships:{" "}
                  <span className="font-semibold">{membershipTypes.length}</span>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {modalMembershipType
                      ? "Edit Membership"
                      : "New Membership"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CreateMembershipType
                  app={modalMembershipType}
                  onClose={handleCloseModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipType;