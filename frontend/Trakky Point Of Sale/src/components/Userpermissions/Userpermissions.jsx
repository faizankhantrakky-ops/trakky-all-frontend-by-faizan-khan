import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast from "react-hot-toast";
import {
  Search,
  Loader2,
  Plus,
  Shield,
  User,
  Key,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Settings,
  Smartphone,
  Mail,
  Phone,
  Calendar,
  Clock,
  Globe,
  Lock,
  Users,
  Award,
} from "lucide-react";

const Userpermissions = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [permissionsData, setPermissionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Permissions Data
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }
      if (!authTokens?.access_token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          "https://backendapi.trakky.in/salonvendor/custom-user-permissions-pos",
          {
            headers: {
              Authorization: `Bearer ${authTokens.access_token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch permissions");

        const data = await res.json();
        setPermissionsData(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [authTokens]);

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roles = permissionsData.map((item) => item.role_type);
    return [...new Set(roles)];
  }, [permissionsData]);

  // Filter by search and role
  const filteredData = useMemo(() => {
    let filtered = permissionsData;

    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter(
        (item) => item.role_type.toLowerCase() === selectedRole.toLowerCase(),
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.username && item.username.toLowerCase().includes(lower)) ||
          item.role_type.toLowerCase().includes(lower) ||
          (item.access &&
            item.access.some((perm) => perm.toLowerCase().includes(lower))),
      );
    }

    return filtered;
  }, [permissionsData, searchTerm, selectedRole]);

  // Handle user actions
  const handleAction = (action, userId) => {
    switch (action) {
      case "view":
        const user = permissionsData.find(u => u.id === userId);
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case "edit":
        navigate(`/edit-permission/${userId}`);
        break;
      case "delete":
        toast.success("Delete functionality to be implemented");
        break;
      default:
        break;
    }
  };

  // Stats calculation
  const stats = useMemo(() => ({
    totalPermissions: permissionsData.reduce((acc, user) => acc + (user.access?.length || 0), 0),
    activeUsers: permissionsData.filter((user) => user.access?.length > 0).length,
    uniqueRoles: uniqueRoles.length,
  }), [permissionsData, uniqueRoles]);

  // Close modal function
  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 sm:px-6 lg:px-8 w-full">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 mb-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  User Permissions
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  Control access privileges
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/assign-permission")}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className={`${isMobile ? '' : 'ml-0 lg:ml-20'}`}>
        {/* Header Section */}
        <div className="mb-4 md:mb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              {!isMobile && (
                <div className="flex items-center space-x-4 md:space-x-5">
                  <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      User Permissions
                    </h1>
                    <p className="text-gray-600 mt-1 text-xs md:text-sm">
                      Control and manage access privileges across the system
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between md:space-x-6">
                {!isMobile ? (
                  <>
                    <div className="text-center hidden md:block">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Total Users
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                        {permissionsData.length}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/assign-permission")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 md:px-5 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm md:text-base whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Assign Permission</span>
                      <span className="sm:hidden">New</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Users
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {permissionsData.length}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Filters Section */}
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-4">
              {!isMobile ? (
                <>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-base md:text-lg font-semibold text-gray-900">
                        Permission Directory
                      </h2>
                      <p className="text-gray-500 text-xs md:text-sm mt-1">
                        {loading
                          ? "Loading permissions..."
                          : `${filteredData.length} user${
                              filteredData.length !== 1 ? "s" : ""
                            } found`}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      {/* Role Filter */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer w-full sm:w-auto min-w-[120px]"
                        >
                          <option value="all">All Roles</option>
                          {uniqueRoles.map((role, index) => (
                            <option key={index} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Search Input */}
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search users, roles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Filters */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        Users
                      </h2>
                      <p className="text-gray-500 text-xs mt-1">
                        {filteredData.length} found
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>

                  {showFilters && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      {/* Mobile Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>

                      {/* Mobile Role Filter */}
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
                        >
                          <option value="all">All Roles</option>
                          {uniqueRoles.map((role, index) => (
                            <option key={index} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-hidden">
            {loading ? (
              <TableSkeleton isMobile={isMobile} />
            ) : filteredData.length === 0 ? (
              <EmptyState
                searchTerm={searchTerm}
                selectedRole={selectedRole}
                navigate={navigate}
                isMobile={isMobile}
              />
            ) : isMobile ? (
              <MobileUserList users={filteredData} handleAction={handleAction} />
            ) : (
              <DesktopUserTable users={filteredData} handleAction={handleAction} />
            )}
          </div>

          {/* Footer */}
          {!loading && filteredData.length > 0 && (
            <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredData.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                      {permissionsData.length}
                    </span>{" "}
                    users
                  </span>
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                      <span className="text-xs text-gray-600">Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                      <span className="text-xs text-gray-600">Admin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                      <span className="text-xs text-gray-600">User</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {/* Total Permissions Card */}
          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-md">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Total Permissions
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                  {stats.totalPermissions}
                </p>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-md">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Active Users
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </div>

          {/* Unique Roles Card */}
          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-md">
                <Key className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Unique Roles
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-900 mt-1">
                  {stats.uniqueRoles}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Role Legend */}
        {isMobile && !loading && filteredData.length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Role Legend</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                <span className="text-xs text-gray-600">Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                <span className="text-xs text-gray-600">Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span className="text-xs text-gray-600">User</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-40">
          <div className="flex items-center justify-around">
            <button
              onClick={() => navigate("/assign-permission")}
              className="flex flex-col items-center p-2"
            >
              <div className="p-2 bg-indigo-100 rounded-lg mb-1">
                <UserPlus className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">New</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex flex-col items-center p-2"
            >
              <div className="p-2 bg-gray-100 rounded-lg mb-1">
                <Filter className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Filter</span>
            </button>
            <button className="flex flex-col items-center p-2">
              <div className="p-2 bg-gray-100 rounded-lg mb-1">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay when menu is open */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeModal} />
      )}
    </div>
  );
};

// Mobile User List Component
const MobileUserList = ({ users, handleAction }) => (
  <div className="divide-y divide-gray-200">
    {users.map((user) => {
      const hasPermission = user.access && user.access.length > 0;
      const permissionCount = hasPermission ? user.access.length : 0;
      const roleColor = user.role_type === "manager" ? "bg-purple-50 text-purple-800 border-purple-200" :
                      user.role_type === "admin" ? "bg-red-50 text-red-800 border-red-200" :
                      "bg-green-50 text-green-800 border-green-200";

      return (
        <div key={user.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-semibold border border-gray-300">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.username || "Unnamed User"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Key className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {hasPermission ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleColor}`}>
                      {user.role_type.charAt(0).toUpperCase() + user.role_type.slice(1)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600 font-medium">
                        {permissionCount} permission{permissionCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {hasPermission ? (
                      <div className="flex flex-wrap gap-1.5">
                        {user.access.slice(0, 3).map((perm, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-800 rounded text-xs font-medium border border-blue-200 truncate max-w-[120px]"
                            title={perm}
                          >
                            {perm.length > 15 ? `${perm.substring(0, 15)}...` : perm}
                          </span>
                        ))}
                        {user.access.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            +{user.access.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No permissions assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => handleAction("view", user.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium"
            >
              <Eye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={() => handleAction("edit", user.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

// Desktop User Table Component
const DesktopUserTable = ({ users, handleAction }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 md:px-6 lg:px-8 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            User Information
          </th>
          <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Role Type
          </th>
          <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Access Permissions
          </th>
          <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => {
          const hasPermission = user.access && user.access.length > 0;
          const permissionCount = hasPermission ? user.access.length : 0;

          return (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
              {/* User Information */}
              <td className="px-4 md:px-6 lg:px-8 py-4 md:py-5">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-semibold border border-gray-300">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.username || "Unnamed User"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Key className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Role Type */}
              <td className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-col gap-1">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold border ${
                      user.role_type === "manager"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : user.role_type === "admin"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-green-50 text-green-800 border-green-200"
                    }`}
                  >
                    {user.role_type.charAt(0).toUpperCase() + user.role_type.slice(1)}
                  </span>
                </div>
              </td>

              {/* Permissions */}
              <td className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">
                      {permissionCount} permission{permissionCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {hasPermission ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {user.access.slice(0, 4).map((perm, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-800 rounded text-xs font-medium border border-blue-200 truncate max-w-[140px]"
                          title={perm}
                        >
                          {perm.length > 20 ? `${perm.substring(0, 20)}...` : perm}
                        </span>
                      ))}
                      {user.access.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +{user.access.length - 4} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No permissions assigned
                    </span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex items-center gap-2">
                  {hasPermission ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction("view", user.id)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction("edit", user.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction("delete", user.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// User Details Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  const hasPermission = user.access && user.access.length > 0;
  const permissionCount = hasPermission ? user.access.length : 0;

  const getRoleColor = (role) => {
    switch(role) {
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'manager':
        return <Users className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  User Details
                </h3>
                <p className="text-sm text-gray-500">
                  Complete information and permissions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* User Basic Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl border-2 border-indigo-200">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">
                    {user.username || "Unnamed User"}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Key className="w-4 h-4" />
                      ID: {user.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleColor(user.role_type)}`}>
                      {getRoleIcon(user.role_type)}
                      {user.role_type.charAt(0).toUpperCase() + user.role_type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">
                    Assigned Permissions
                  </h4>
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {permissionCount} total
                </span>
              </div>

              {hasPermission ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.access.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 break-all">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No permissions assigned
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    This user doesn't have any access permissions yet
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-500">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    Access Level
                  </span>
                </div>
                <span className="font-medium text-gray-700">
                  {hasPermission ? `${permissionCount} permission${permissionCount !== 1 ? 's' : ''}` : 'No Access'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Skeleton Loader
const TableSkeleton = ({ isMobile }) => (
  <div className="p-4 md:p-8">
    <div className="space-y-4 md:space-y-6">
      {[...Array(isMobile ? 3 : 6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24 md:w-32"></div>
                <div className="h-2 bg-gray-200 rounded w-20 md:w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-16 md:w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20 md:w-24"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-12 md:w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-10 md:w-12"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-10 md:w-12"></div>
            </div>
            {!isMobile && (
              <div className="flex gap-1">
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
              </div>
            )}
          </div>
          {index < (isMobile ? 2 : 5) && <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>}
        </div>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ searchTerm, selectedRole, navigate, isMobile }) => (
  <div className="w-full text-center py-12 md:py-16 px-4">
    <div className="max-w-md mx-auto">
      <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-gray-200`}>
        <User className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-gray-400`} />
      </div>
      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-700 mb-2 md:mb-3`}>
        {searchTerm || selectedRole !== "all"
          ? "No Matching Records Found"
          : "No Permissions Assigned"}
      </h3>
      <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">
        {searchTerm
          ? "Try adjusting your search terms or filters."
          : "Begin by assigning permissions to users in your system."}
      </p>
      {!searchTerm && selectedRole === "all" && (
        <button
          onClick={() => navigate("/assign-permission")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 md:px-6 py-2.5 md:py-3 rounded-lg inline-flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          {isMobile ? "Assign Permission" : "Assign First Permission"}
        </button>
      )}
    </div>
  </div>
);

export default Userpermissions;