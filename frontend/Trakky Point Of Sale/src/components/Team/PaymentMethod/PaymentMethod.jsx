import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Wallet,
  Banknote,
  User,
  Search,
} from "lucide-react";
import AuthContext from "../../../Context/Auth";
import { toast, Toaster } from "react-hot-toast";

const PaymentMethod = () => {
  const { authTokens, user } = useContext(AuthContext);

  /* ---------- State ---------- */
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [managers, setManagers] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    status: "Active",
    associatedRole: "",
    associatedId: "",
  });

  /* ---------- FETCH VENDOR (central_payment_method) ---------- */
  const fetchVendor = async () => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`,
      );
      if (!res.ok) throw new Error("Failed to fetch vendor");
      const data = await res.json();
      const methods = (data.central_payment_method || []).map((item, idx) => ({
        ...item,
        id: item.id ?? idx + 1,
      }));
      setPaymentMethods(methods);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load payment methods");
    }
  };

  /* ---------- FETCH MANAGERS ---------- */
  const fetchManagers = async () => {
    try {
      const res = await fetch(
        "https://backendapi.trakky.in/salonvendor/manager/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.ok) {
        const data = await res.json();

        // ❌ leave_date wale managers remove
        const activeManagers = data.filter((manager) => !manager.leave_date);

        setManagers(activeManagers);
      } else {
        toast.error("Failed to load managers");
      }
    } catch (e) {
      toast.error("Failed to load managers");
    }
  };

  /* ---------- FETCH STAFF ---------- */
  const fetchStaff = async () => {
    try {
      const res = await fetch(
        "https://backendapi.trakky.in/salonvendor/staff/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      const data = await res.json();

      // ✅ Keep only staff where is_permanent and is_present are true
      const filteredStaff = Array.isArray(data)
        ? data.filter((staff) => staff.is_permanent === true)
        : [];

      setStaffData(filteredStaff);
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------- FETCH DISTRIBUTORS (SUPPLIERS) ---------- */
  const fetchDistributors = async () => {
    try {
      const res = await fetch(
        "https://backendapi.trakky.in/salonvendor/supplier/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDistributors(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load distributors");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load distributors");
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchVendor();
      fetchManagers();
      fetchStaff();
      fetchDistributors();
    }
  }, [user?.user_id]);

  let branchId = localStorage.getItem("branchId") || "";
  /* ---------- PATCH REQUEST ---------- */
  const patchVendor = async (methods) => {
    const payload = methods.map(({ id, ...rest }) => rest);

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor-pos/${user.user_id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ central_payment_method: payload ,
            // branchId : branchId
          }),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Patch failed");
      }

      toast.success("Payment methods saved successfully");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to save payment methods");
    }
  };

  /* ---------- ICON ---------- */
  const getIcon = (type) => {
    if (type.includes("associated"))
      return <Wallet className="w-4 h-4 text-orange-600" />;
    switch (type) {
      case "card":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "upi":
        return <Wallet className="w-4 h-4 text-green-600" />;
      case "cash":
        return <Banknote className="w-4 h-4 text-yellow-600" />;
      case "bank":
        return <Wallet className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  /* ---------- DIALOG HANDLERS ---------- */
  const openDialog = (method = null) => {
    if (method) {
      setEditMode(true);
      setCurrentId(method.id);

      // Parse type if it's associated
      const typeParts = method.type.split(" - ");
      const isAssociated =
        typeParts.length >= 3 && typeParts[1] === "associated";
      const role = isAssociated ? typeParts[0] : "";
      const personName = isAssociated ? typeParts[2] : "";

      setFormData({
        name: method.name,
        type: isAssociated ? "associated" : method.type,
        description: method.description,
        status: method.status,
        associatedRole: role,
        associatedId: method.associated_id || "",
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({
        name: "",
        type: "",
        description: "",
        status: "Active",
        associatedRole: "",
        associatedId: "",
      });
    }
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------- SAVE (Add / Edit) ---------- */
  const handleSave = () => {
    if (!formData.name || !formData.type) {
      alert("Name and Type are required");
      return;
    }
    if (
      formData.type === "associated" &&
      (!formData.associatedRole || !formData.associatedId)
    ) {
      alert("Select role & person for Associated");
      return;
    }

    // Get selected person name
    let personName = "";
    if (formData.type === "associated" && formData.associatedId) {
      let list = [];
      if (formData.associatedRole === "staff") list = staffData;
      else if (formData.associatedRole === "manager") list = managers;
      else if (formData.associatedRole === "distributor") list = distributors;

      const selected = list.find((i) => i.id === Number(formData.associatedId));
      personName =
        selected?.staffname ||
        selected?.managername ||
        selected?.name ||
        "Unknown";
    }

    // Build final type
    const finalType =
      formData.type === "associated"
        ? `${formData.associatedRole} - associated - ${personName}`
        : formData.type;

    const newObj = {
      id: editMode ? currentId : Date.now(),
      name: formData.name,
      type: finalType,
      description: formData.description,
      status: formData.status,
      associated: formData.type === "associated",
    };

    // Only add associated_id if associated
    if (formData.type === "associated") {
      newObj.associated_id = formData.associatedId;
    }

    let updated = [];
    if (editMode) {
      updated = paymentMethods.map((m) => (m.id === currentId ? newObj : m));
    } else {
      updated = [...paymentMethods, newObj];
    }

    setPaymentMethods(updated);
    patchVendor(updated);
    closeDialog();
  };

  /* ---------- DELETE ---------- */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this payment method?")) return;
    const updated = paymentMethods.filter((m) => m.id !== id);
    setPaymentMethods(updated);
    patchVendor(updated);
  };

  /* ---------- FILTERED PAYMENT METHODS ---------- */
  const filteredMethods = paymentMethods.filter(
    (method) =>
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Payment Methods
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage salon payment options
                </p>
              </div>
            </div>
            <button
              onClick={() => openDialog()}
              className="flex items-center space-x-2 bg-[#492DBD] text-white px-4 py-2 rounded-lg hover:bg-[#3a2199] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payment methods..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
            />
          </div>
        </div>

        {/* Payment Methods Grid */}
        {filteredMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getIcon(method.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {method.type}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      method.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {method.status}
                  </span>
                </div>

                {method.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {method.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-1 text-gray-400">
                    {method.associated && <User className="w-3 h-3" />}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openDialog(method)}
                      className="p-1 text-gray-400 hover:text-[#492DBD] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchQuery
                  ? "No payment methods found"
                  : "No payment methods"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first payment method"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openDialog()}
                  className="flex items-center space-x-2 bg-[#492DBD] text-white px-5 py-3 rounded-lg hover:bg-[#3a2199] transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Payment Method</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editMode ? "Edit Payment Method" : "Add Payment Method"}
                </h3>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="e.g. Distributor Payment, Staff Wallet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="associated">Associated</option>
                  </select>
                </div>

                {/* Associated Role */}
                {formData.type === "associated" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      name="associatedRole"
                      value={formData.associatedRole}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    >
                      <option value="">Select Role</option>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="distributor">Distributor</option>
                    </select>
                  </div>
                )}

                {/* Associated Person */}
                {formData.type === "associated" && formData.associatedRole && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select{" "}
                      {formData.associatedRole.charAt(0).toUpperCase() +
                        formData.associatedRole.slice(1)}
                    </label>
                    <select
                      name="associatedId"
                      value={formData.associatedId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((p) => ({
                          ...p,
                          associatedId: val,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    >
                      <option value="">Select Person</option>
                      {(formData.associatedRole === "staff"
                        ? staffData
                        : formData.associatedRole === "manager"
                        ? managers
                        : distributors
                      ).map((i) => (
                        <option key={i.id} value={i.id}>
                          {formData.associatedRole === "staff"
                            ? i.staffname
                            : formData.associatedRole === "manager"
                            ? i.managername
                            : i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors"
                >
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
