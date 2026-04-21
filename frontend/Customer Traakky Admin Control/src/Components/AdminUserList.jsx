import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "./DateRange/formatDate";
import { AiFillDelete, AiOutlineUser, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { BsShieldCheck, BsShield, BsThreeDotsVertical } from "react-icons/bs";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

const AdminUserList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [usersData, setUsersData] = useState([]);
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [filteredSuperUser, setFilteredSuperUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getAdminUser = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/users/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUsersData(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch customers. Please try again later.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getAdminUser();
  }, []);

  const deleteUser = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this user?",
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { color: "error" }
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/users/${id}/`,
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
        });
        getAdminUser();
      } else if (response.status === 401) {
        toast.error("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    let filteredData = usersData;

    // Apply superuser filter
    if (verifiedFilter !== "all") {
      filteredData = filteredData.filter(
        (user) => user.is_superuser === (verifiedFilter === "true")
      );
    }

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSuperUser(filteredData);
  }, [verifiedFilter, usersData, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSuperUser.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSuperUser.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: usersData.length,
    superUsers: usersData.filter(user => user.is_superuser).length,
    regularUsers: usersData.filter(user => !user.is_superuser).length,
  };

  const StatusBadge = ({ isSuperuser }) => (
    <span
      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
        isSuperuser
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-gray-100 text-gray-600 border border-gray-200"
      }`}
    >
      {isSuperuser ? (
        <>
          <BsShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
          <span className="hidden xs:inline">Super User</span>
          <span className="xs:hidden">Admin</span>
        </>
      ) : (
        <>
          <BsShield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
          <span className="hidden xs:inline">Regular User</span>
          <span className="xs:hidden">User</span>
        </>
      )}
    </span>
  );

  const UserAvatar = ({ username, firstName }) => (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-xs sm:text-sm">
          {(firstName?.charAt(0) || username?.charAt(0) || 'U').toUpperCase()}
        </span>
      </div>
      <div className="min-w-0">
        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-[150px]">
          {username}
        </div>
        {firstName && (
          <div className="text-xs text-gray-500 truncate">{firstName}</div>
        )}
      </div>
    </div>
  );

  const FilterButton = ({ value, label, count, active, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm ${
        active
          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {Icon && <Icon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-500'}`} />}
      <span className="font-medium whitespace-nowrap">{label}</span>
      <span className={`ml-1 sm:ml-2 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-semibold ${
        active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
      <Toaster />
      
      {/* Header Section */}
      <div className="mx-auto ">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Manage system users and their access permissions
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Super Users
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {stats.superUsers}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiUserCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Regular Users
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {stats.regularUsers}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiUserX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <FilterButton
                  value="all"
                  label="All"
                  count={stats.total}
                  active={verifiedFilter === "all"}
                  onClick={() => setVerifiedFilter("all")}
                  icon={FiUsers}
                />
                <FilterButton
                  value="true"
                  label="Super"
                  count={stats.superUsers}
                  active={verifiedFilter === "true"}
                  onClick={() => setVerifiedFilter("true")}
                  icon={FiUserCheck}
                />
                <FilterButton
                  value="false"
                  label="Regular"
                  count={stats.regularUsers}
                  active={verifiedFilter === "false"}
                  onClick={() => setVerifiedFilter("false")}
                  icon={FiUserX}
                />
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 font-medium text-left lg:text-right">
              Showing {currentItems.length} of {filteredSuperUser.length} users
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Profile
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <span className="hidden xs:inline">Password</span>
                    <span className="xs:hidden">Pwd</span>
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <span className="hidden xs:inline">User Type</span>
                    <span className="xs:hidden">Type</span>
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <span className="hidden sm:inline">Full Name</span>
                    <span className="sm:hidden">Name</span>
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <UserAvatar username={user.username} firstName={user.first_name} />
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <span className="hidden xs:inline">Encrypted</span>
                          <span className="xs:hidden">Enc</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <StatusBadge isSuperuser={user.is_superuser} />
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {user.first_name || (
                          <span className="text-gray-400 italic text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-red-300 text-red-700 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <AiFillDelete className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                          <span className="hidden xs:inline">Delete</span>
                          <span className="xs:hidden">Del</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                          <AiOutlineUser className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1">No users found</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {searchTerm || verifiedFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "No users available in the system"
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-700">
                  <span className="hidden xs:inline">Showing </span>
                  {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSuperUser.length)} of {filteredSuperUser.length} entries
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 3 && (
                      <span className="px-1 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-700">...</span>
                    )}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-900">Active Users</p>
                <p className="text-sm sm:text-lg font-bold text-blue-700">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <FiUserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-900">Administrators</p>
                <p className="text-sm sm:text-lg font-bold text-green-700">{stats.superUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <FiUserX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Regular Users</p>
                <p className="text-sm sm:text-lg font-bold text-gray-700">{stats.regularUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;