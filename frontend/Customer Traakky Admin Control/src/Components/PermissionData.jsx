import React, { useState, useEffect, useContext } from "react";
import { AiFillDelete, AiOutlineEdit, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { BsThreeDotsVertical, BsCheckCircle, BsXCircle } from "react-icons/bs";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import { Modal } from "@mui/material";
import CustomPermissions from "./CustomPermissions";

const PermissionData = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [permissionData, setPermissionData] = useState([]);
  const [filterField, setFilterField] = useState("username");
  const [filteredPermissionData, setFilteredPermissionData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPermissionData, setEditPermissionData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const tableHeaders = [
    { key: "index", label: "#", width: "w-16" },
    { key: "username", label: "Username", width: "w-48" },
    { key: "permissions", label: "Permissions", width: "w-96" },
    { key: "superuser", label: "Superuser Status", width: "w-32" },
    { key: "actions", label: "Actions", width: "w-32" },
  ];

  const getPermissionData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/custom-user-permissions/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setPermissionData(data);
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const deletePermission = async (id) => {
    try {
      await confirm({
        description: "This will delete the access data permanently",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/custom-user-permissions/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Access Data Deleted Successfully", {
          duration: 4000,
          position: "top-center",
        });
        setSearchTerm("");
        getPermissionData();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(
          `Error Deleting Access Data with status code ${response.status}`,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getPermissionData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredPermissionData(permissionData);
    }
    setFilteredPermissionData(
      permissionData.filter((permission) => {
        return permission[filterField]
          .toString()
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField, permissionData]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  const toastMessageHandler = (message, type) => {
    if (type === "error") {
      toast.error(message, {
        duration: 4000,
        position: "top-center",
      });
    } else if (type === "success") {
      toast.success(message, {
        duration: 4000,
        position: "top-center",
      });
    } else {
      toast(message, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // Pagination logic
  const currentData = searchTerm ? filteredPermissionData : permissionData;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = currentData.slice(startIndex, startIndex + itemsPerPage);

  const StatusBadge = ({ isSuperuser }) => (
    <span
      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
        isSuperuser
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {isSuperuser ? (
        <>
          <BsCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
          <span className="hidden xs:inline">Yes</span>
          <span className="xs:hidden">Y</span>
        </>
      ) : (
        <>
          <BsXCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
          <span className="hidden xs:inline">No</span>
          <span className="xs:hidden">N</span>
        </>
      )}
    </span>
  );

  const PermissionTags = ({ permissions }) => (
    <div className="flex flex-wrap gap-1">
      {permissions?.slice(0, 2).map((permission, idx) => (
        <span
          key={idx}
          className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200 truncate max-w-[100px] sm:max-w-none"
        >
          {permission.length > 10 ? `${permission.substring(0, 8)}...` : permission}
        </span>
      ))}
      {permissions?.length > 2 && (
        <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded border border-gray-200">
          +{permissions.length - 2}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
      <Toaster />
      
      {/* Header Section */}
      <div className="mx-auto ">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            User Permissions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Manage user access and permissions across the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {permissionData.length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
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
                  {permissionData.filter(p => p.is_superuser).length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BsCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
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
                  {permissionData.filter(p => !p.is_superuser).length}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Active Filters
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {searchTerm ? "1" : "0"}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AiOutlineFilter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Filter Dropdown */}
              <div className="relative w-full sm:w-48">
                <select
                  onChange={(e) => setFilterField(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option value={"username"}>Username</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <AiOutlineFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Search Input */}
              <div className="relative flex-1 max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 font-medium text-left lg:text-right">
              Showing {currentItems.length} of {currentData.length} entries
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${header.width}`}
                    >
                      {header.key === "superuser" ? (
                        <>
                          <span className="hidden sm:inline">Superuser Status</span>
                          <span className="sm:hidden">Status</span>
                        </>
                      ) : header.key === "actions" ? (
                        <>
                          <span className="hidden sm:inline">Actions</span>
                          <span className="sm:hidden">Act.</span>
                        </>
                      ) : (
                        header.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((permission, index) => (
                    <tr
                      key={permission.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">
                          {permission?.username?.length > 15 
                            ? `${permission.username.substring(0, 12)}...` 
                            : permission?.username ?? "-"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <PermissionTags permissions={permission?.access} />
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <StatusBadge isSuperuser={permission?.is_superuser} />
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-1 xs:gap-2">
                          <button
                            onClick={() => {
                              setEditPermissionData(permission);
                              setEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-blue-300 text-blue-700 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 transition-colors w-full xs:w-auto justify-center"
                          >
                            <AiOutlineEdit className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deletePermission(permission.id)}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-red-300 text-red-700 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 transition-colors w-full xs:w-auto justify-center"
                          >
                            <AiFillDelete className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                            <span>Del</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-2 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">No permissions found</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {searchTerm ? "Try adjusting your search criteria" : "No user permissions available"}
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
                  {startIndex + 1} to {Math.min(startIndex + itemsPerPage, currentData.length)} of {currentData.length} entries
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
      </div>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditPermissionData({});
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
        }}
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
          <CustomPermissions
            permissionsData={editPermissionData?.access}
            selectedUserData={editPermissionData?.user}
            objId={editPermissionData?.id}
            closeEditModal={() => {
              setEditModalOpen(false);
              setEditPermissionData({});
            }}
            toastMessageHandler={toastMessageHandler}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PermissionData;