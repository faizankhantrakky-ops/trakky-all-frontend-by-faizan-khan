import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../Context/Auth";
import toast from "react-hot-toast";
import { Search, Loader2 } from "lucide-react";

const Addpermission = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [password, setPassword] = useState("");

  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [fetchingPerms, setFetchingPerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

 // Fetch Users
useEffect(() => {
     if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const [mgrRes, staffRes] = await Promise.all([
        fetch("https://backendapi.trakky.in/salonvendor/manager/", {
          headers: { Authorization: `Bearer ${authTokens?.access_token}` },
        }),
        fetch("https://backendapi.trakky.in/salonvendor/staff/", {
          headers: { Authorization: `Bearer ${authTokens?.access_token}` },
        }),
      ]);

      // ❌ remove managers with leave_date
      let managers = mgrRes.ok ? await mgrRes.json() : [];
      managers = managers.filter((m) => !m.leave_date);

      let staff = staffRes.ok ? await staffRes.json() : [];

      // ✅ Only keep permanent staff
      staff = staff.filter((s) => s.is_permanent === true);

      const formatted = [
        ...managers.map((m) => ({
          id: m.id,
          name: m.managername,
          type: "Manager",
          role_type: "manager",
        })),
        ...staff.map((s) => ({
          id: s.id,
          name: s.staffname,
          type: "Staff",
          role_type: "staff",
        })),
      ];

      setUsers(formatted);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setFetchingUsers(false);
    }
  };

  if (authTokens?.access_token) fetchUsers();
}, [authTokens]);

  // Fetch Permissions
  useEffect(() => {
       if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
        
    const fetchPermissions = async () => {
      setFetchingPerms(true);
      try {
        const res = await fetch(
          "https://backendapi.trakky.in/salonvendor/permissions-pos/",
          {
            headers: { Authorization: `Bearer ${authTokens?.access_token}` },
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAllPermissions(data);
      } catch {
        toast.error("Failed to load permissions");
      } finally {
        setFetchingPerms(false);
      }
    };

    if (authTokens?.access_token) fetchPermissions();
  }, [authTokens]);

  // Filter Permissions
  const filteredPermissions = useMemo(() => {
    if (!searchTerm.trim()) return allPermissions;
    const lower = searchTerm.toLowerCase();
    return allPermissions.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.code.toLowerCase().includes(lower)
    );
  }, [allPermissions, searchTerm]);

  // Toggle Permission
  const togglePermission = (code) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Select / Clear All
  const selectAll = () => {
    setSelectedPermissions(allPermissions.map((p) => p.code));
  };

  const clearAll = () => {
    setSelectedPermissions([]);
  };


    let branchId = localStorage.getItem("branchId") || "";

  // Submit
  const handleSubmit = async () => {
    if (!selectedUser || selectedPermissions.length === 0 || !password) {
      toast.error("Please select a user, at least one permission, and enter a password");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        role_type: selectedUser.role_type,
        permissions: selectedPermissions,
        // branchId : branchId
      };

      if (selectedUser.role_type === "manager") {
        payload.manager_id = selectedUser.id;
      } else if (selectedUser.role_type === "staff") {
        payload.staff_id = selectedUser.id;
      }

      const res = await fetch(
        "https://backendapi.trakky.in/salonvendor/custom-user-permissions-pos/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        // Update password via PATCH
        const updateUrl = selectedUser.role_type === 'manager' 
          ? `https://backendapi.trakky.in/salonvendor/manager/${selectedUser.id}/` 
          : `https://backendapi.trakky.in/salonvendor/staff/${selectedUser.id}/`;
        
        const updateRes = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({ password }),
        });

        if (!updateRes.ok) {
          console.error('Failed to update password');
          toast.error('Permissions assigned, but failed to update password');
        } else {
          toast.success("Permissions assigned and password updated successfully!");
        }
        
        navigate("/user-permissions");
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to assign permissions");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen py-8 px-4 md:pl-24 md:pr-4">
      <div className="w-full mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Assign Permissions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Select a user and assign system access
          </p>
        </div>

        <div className="bg-white border border-gray-300 p-4 md:p-6 rounded-lg shadow-sm">
          {/* User Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            {fetchingUsers ? (
              <div className="h-10 bg-gray-200 border border-gray-300 rounded-md animate-pulse"></div>
            ) : (
              <select
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const user =
                    users.find((u) => u.id === Number(e.target.value)) || null;
                  setSelectedUser(user);
                  setPassword('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">-- Select Manager or Staff --</option>
                {users.length > 0 ? (
                  <>
                    <optgroup label="Managers">
                      {users
                        .filter((u) => u.type === "Manager")
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.type})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Staff">
                      {users
                        .filter((u) => u.type === "Staff")
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.type})
                          </option>
                        ))}
                    </optgroup>
                  </>
                ) : (
                  <option disabled>No users available</option>
                )}
              </select>
            )}
          </div>

          {/* Password Field */}
          {selectedUser && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Password
              </label>
              <input
                type="password"
                placeholder="Enter password for the selected user"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          {/* Search Permissions */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search permissions by name or code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Permissions Grid   */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <h3 className="text-lg font-medium text-gray-800">
                Select Permissions
              </h3>
              <div className="flex gap-2 text-xs items-center">
                <button
                  onClick={selectAll}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={clearAll}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear All
                </button>
                <span className="text-gray-500 ml-2">
                  ({selectedPermissions.length} selected)
                </span>
              </div>
            </div>

            {fetchingPerms ? (
              <PermissionGridSkeleton />
            ) : filteredPermissions.length === 0 ? (
              <div className="text-center py-10 text-gray-500 border border-gray-200 rounded-md">
                <p className="font-medium">No permissions found</p>
                <p className="text-xs mt-1">
                  {searchTerm ? "Try a different search term" : "No permissions available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                {filteredPermissions.map((perm) => (
                  <label
                    key={perm.id}
                    className={`
                      flex items-start p-3 border rounded-md cursor-pointer transition-colors text-sm
                      ${selectedPermissions.includes(perm.code)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.code)}
                      onChange={() => togglePermission(perm.code)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-2 flex-1">
                      <div className="font-medium text-gray-900">
                        {perm.name}
                      </div>
                      <code className="text-xs text-gray-500">
                        {perm.code}
                      </code>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              onClick={() => navigate("/user-permissions")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedUser || selectedPermissions.length === 0 || !password}
              className={`px-6 py-2 rounded-md font-medium text-white flex items-center gap-2 transition-colors order-1 sm:order-2
                ${submitting || !selectedUser || selectedPermissions.length === 0 || !password
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Permissions"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Static Skeleton
const PermissionGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="h-20 bg-gray-200 border border-gray-300 rounded-md animate-pulse"
        style={{ backgroundColor: "#f3f4f6" }}
      />
    ))}
  </div>
);

export default Addpermission;