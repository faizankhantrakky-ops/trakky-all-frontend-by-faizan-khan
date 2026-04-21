import React, { useState, useContext, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  FiUser,
  FiCheck,
  FiX,
  FiSave,
  FiLock,
  FiUsers,
  FiShield,
  FiSettings,
  FiBarChart2,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiBook,
  FiStar
} from "react-icons/fi";

const CustomPermissions = ({
  permissionsData,
  selectedUserData,
  objId,
  closeEditModal,
  toastMessageHandler,
}) => {
  const permissions = [
    {
      name: "General",
      detail: "Dashboard, Customers, Salon Scores, Trakky Ratings, Contact Us",
      value: "general-permission",
      icon: FiSettings,
      category: "Administration"
    },
    {
      name: "Ads Spend",
      detail: "Manage advertising budgets and spending analytics",
      value: "ads-spend-permission",
      icon: FiDollarSign,
      category: "Marketing"
    },
    {
      name: "Inquiry Leads",
      detail: "Access and manage incoming customer inquiries and leads",
      value: "inquiry-leads-permission",
      icon: FiMessageSquare,
      category: "Sales"
    },
    {
      name: "Converted Leads",
      detail: "View and analyze successfully converted customer leads",
      value: "converted-leads-permission",
      icon: FiTrendingUp,
      category: "Sales"
    },
    {
      name: "Collaborated Salons",
      detail: "Manage partnerships and collaborations with salons",
      value: "collaborated-salons-permission",
      icon: FiUsers,
      category: "Partnerships"
    },
    {
      name: "Customer Segmentation",
      detail: "Analyze and segment customer data for targeted marketing",
      value: "customer-segmentation-permission",
      icon: FiBarChart2,
      category: "Analytics"
    },
    {
      name: "Offerpage Booking History",
      detail: "Access booking history and offer page analytics",
      value: "offerpage-booking-history-permission",
      icon: FiCalendar,
      category: "Bookings"
    },
    {
      name: "Chatbot User Data",
      detail: "Manage and analyze chatbot user interactions and data",
      value: "chatbot-user-data-permission",
      icon: FiMessageSquare,
      category: "Automation"
    },
    {
      name: "Create User",
      detail: "Create new user accounts and manage user permissions",
      value: "create-user-permission",
      icon: FiUser,
      category: "Administration"
    },
  ];

  const { authTokens } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(selectedUserData || "");
  const [selectedPermissions, setSelectedPermissions] = useState(permissionsData || []);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {});

  const getUsersData = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        let filteredUsers = result.filter((user) => user.is_superuser);
        setAllUsers(filteredUsers);
      } else {
        toast.error(`Error fetching users data: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Error fetching users data: ${error.message}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handlePermissionChange = (value) => {
    setSelectedPermissions((prev) =>
      prev.includes(value)
        ? prev.filter((perm) => perm !== value)
        : [...prev, value]
    );
  };

  const handleSelectAll = (category) => {
    const categoryPermissions = groupedPermissions[category].map(p => p.value);
    const allSelected = categoryPermissions.every(perm => selectedPermissions.includes(perm));
    
    if (allSelected) {
      // Deselect all in category
      setSelectedPermissions(prev => prev.filter(perm => !categoryPermissions.includes(perm)));
    } else {
      // Select all in category
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    setLoading(true);

    const data = {
      user: selectedUser,
      access: selectedPermissions,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/custom-user-permissions${selectedUserData ? `/${objId}/` : "/"}`,
        {
          method: selectedUserData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.status === 400) {
        toast.error(result?.user || "Error updating permissions");
      }

      if (response.ok) {
        if (selectedUserData) {
          toastMessageHandler("Permissions updated successfully", "success");
          closeEditModal();
        } else {
          toast.success("Permissions created successfully");
          setSelectedPermissions([]);
          setSelectedUser("");
        }
      } else {
        toast.error("Error saving permissions");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const PermissionCard = ({ permission }) => {
    const IconComponent = permission.icon;
    const isSelected = selectedPermissions.includes(permission.value);

    return (
      <div
        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }`}
        onClick={() => handlePermissionChange(permission.value)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
              isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            }`}>
              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                {permission.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                {window.innerWidth < 640 
                  ? permission.detail.length > 40 
                    ? `${permission.detail.substring(0, 40)}...` 
                    : permission.detail
                  : permission.detail
                }
              </p>
            </div>
          </div>
          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected 
              ? "bg-blue-500 border-blue-500" 
              : "border-gray-300"
          }`}>
            {isSelected && <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <Toaster />
      <div className="px-3 sm:px-4 md:px-6  mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            {selectedUserData ? "Edit User Permissions" : "Custom Permissions Management"}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Configure and manage user access permissions across the platform
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* User Selection */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  User Selection
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Select the user you want to assign permissions to
                </p>
              </div>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: { xs: '100%', sm: 240 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    fontSize: { xs: '14px', sm: '16px' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                  }
                }}
                size="small"
              >
                <InputLabel id="user-select-label">Select User</InputLabel>
                <Select
                  labelId="user-select-label"
                  label="Select User"
                  value={selectedUser}
                  onChange={handleUserChange}
                  disabled={selectedUserData}
                >
                  {allUsers.map((user, index) => (
                    <MenuItem key={index} value={user.id}>
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm sm:text-base">{user.username}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="p-4 sm:p-5 md:p-6">
            <div className="mb-4 sm:mb-5 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiLock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Available Permissions
                </h2>
                <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full inline-block w-fit">
                  {selectedPermissions.length} of {permissions.length} selected
                </div>
              </div>

              {/* Permission Categories */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                  const categorySelected = categoryPermissions.filter(p => 
                    selectedPermissions.includes(p.value)
                  ).length;
                  const allSelected = categorySelected === categoryPermissions.length;

                  return (
                    <div key={category} className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{category}</h3>
                            <span className="text-xs text-gray-500 bg-gray-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                              {categorySelected}/{categoryPermissions.length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectAll(category)}
                            className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors text-left sm:text-right"
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {/* Permissions Grid */}
                      <div className="p-3 sm:p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {categoryPermissions.map((permission, index) => (
                            <PermissionCard key={index} permission={permission} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                    Quick Actions
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Manage permission sets quickly
                  </p>
                </div>
                <div className="flex flex-col xs:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPermissions([])}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPermissions(permissions.map(p => p.value))}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Select All
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeEditModal}
                className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border border-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Cancel
              </button>
              
              <div className="flex flex-col xs:flex-row w-full sm:w-auto gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(permissionsData || [])}
                  className="w-full xs:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border border-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !selectedUser}
                  className="w-full xs:w-auto flex items-center justify-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5 sm:mr-2"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden xs:inline">
                        {selectedUserData ? 'Update Permissions' : 'Save Permissions'}
                      </span>
                      <span className="xs:hidden">
                        {selectedUserData ? 'Update' : 'Save'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-4 sm:mt-5 md:mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-purple-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                Permission Summary
              </h3>
              <p className="text-xs sm:text-sm text-purple-700">
                {selectedPermissions.length} permissions selected across {Object.keys(groupedPermissions).length} categories
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(groupedPermissions).map(([category, perms]) => {
                const count = perms.filter(p => selectedPermissions.includes(p.value)).length;
                if (count === 0) return null;
                return (
                  <span key={category} className="bg-white px-2 sm:px-3 py-1 rounded-full text-purple-700 font-medium border border-purple-200 text-xs">
                    {window.innerWidth < 640 ? category.substring(0, 3) : category}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPermissions;