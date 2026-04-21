import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AuthContext from "../../../Context/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import BusinessIcon from "@mui/icons-material/Business";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
// import CurrencyRupeeIcon from "@mui/icons-material/AttachMoney";

import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CreateCustomerMembership = ({ editData, onClose }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const editorRef = useRef(null);
  const { vendorData, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    membership_type: "",
    membership_code: "",
    terms_and_conditions: "",
    branch_name: "",
    manager: "",
    amount_paid: "",
    membership_price: "",
  });

  const [managerData, setManagerData] = useState([]);
  const [membershipTypeData, setMembershipTypeData] = useState([]);
  const [mTLoading, setMTLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [customerLoading, setCustomerLoading] = useState(false);

  const handleApiError = (error, defaultMessage = "An error occurred") => {
    console.error(error);
    let message = defaultMessage;

    if (error.response) {
      if (error.response.data) {
        message = error.response.data.message || error.response.data.detail || JSON.stringify(error.response.data);
      } else {
        message = `Server responded with status ${error.response.status}`;
      }
    } else if (error.request) {
      message = "No response received from server. Please check your network connection.";
    }

    toast.error(message);
    return message;
  };

  const fetchMembershipTypes = async () => {
    setMTLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || response.statusText);
      }

      const data = await response.json();
      setMembershipTypeData(data);
    } catch (error) {
      handleApiError(error, "Failed to load Membership Type's");
    } finally {
      setMTLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/manager/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || response.statusText);
      }

      const data = await response.json();
      setManagerData(data);
    } catch (error) {
      handleApiError(error, "Failed to load managers");
    }
  };

  useEffect(() => {
    fetchMembershipTypes();
    fetchManagers();
  }, []);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "bullet" }, { list: "ordered" }],
            [{ header: [1, 2, 3, false] }],
            [{ color: [] }],
            ["clean"]
          ],
        },
      });
    }
  }, []);

  const getCustomerNameByPhone = async () => {
    setCustomerLoading(true);
    try {
      if (!formData.customer_phone || formData.customer_phone.length !== 10) {
        setCustomerLoading(false);
        return;
      }

      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/customer-table/?customer_phone=${formData.customer_phone}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || response.statusText);
      }

      const data = await response.json();
      if (data.length > 0) {
        setFormData({
          ...formData,
          customer_name: data[0].customer_name,
        });
        toast.success("Customer found! Name auto-filled.");
      } else {
        toast.info("No existing customer found. Please enter details manually.");
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch customer details");
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    if (!editData && formData.customer_phone.length === 10) {
      const timer = setTimeout(() => {
        getCustomerNameByPhone();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData?.customer_phone]);

  const getMembershipCode = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/membershipcodegenerator/"
      );

      if (!response.ok) {
        throw new Error("Failed to generate membership code");
      }

      const data = await response.json();
      setFormData({ ...formData, membership_code: data.membership_code });
    } catch (error) {
      handleApiError(error, "Failed to generate membership code");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.customer_name?.trim()) {
      errors.customer_name = "Customer name is required";
    }

    if (!formData.customer_phone) {
      errors.customer_phone = "Phone number is required";
    } else if (formData.customer_phone.length !== 10) {
      errors.customer_phone = "Phone number must be 10 digits";
    }

    if (!formData.membership_type) {
      errors.membership_type = "Membership type is required";
    }

    if (!formData.branch_name?.trim()) {
      errors.branch_name = "Branch name is required";
    }

    if (!formData.manager) {
      errors.manager = "Manager is required";
    }

    if (!formData.amount_paid) {
      errors.amount_paid = "Amount paid is required";
    } else if (parseFloat(formData.amount_paid) < 0) {
      errors.amount_paid = "Amount cannot be negative";
    }

    const termsContent = editorRef.current?.getText().trim();
    if (!termsContent) {
      errors.terms = "Terms and conditions are required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    let method = editData ? "PATCH" : "POST";
    let url = `https://backendapi.trakky.in/spavendor/customer-membership-new/`;

    if (editData) {
      url += `${editData.id}/`;
    }

    let payload = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      membership_type: formData.membership_type,
      terms_and_conditions: editorRef.current.root.innerHTML,
      branch_name: formData.branch_name,
      manager: formData.manager,
      amount_paid: formData.amount_paid,
    };

    if (!editData) {
      payload = {
        ...payload,
        membership_code: formData.membership_code,
      };
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || response.statusText);
      }

      const data = await response.json();

      toast.success(
        editData
          ? "Customer Membership updated successfully!"
          : "Customer Membership created successfully!"
      );

      if (onClose) {
        setTimeout(() => onClose(), 1500);
      } else {
        navigate("/catalogue/membership-customer");
      }
    } catch (error) {
      toast.error(
        editData
          ? "Failed to update customer membership"
          : "Failed to create customer membership"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!editData) {
      getMembershipCode();
    }
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        customer_name: editData?.customer?.customer_name || "",
        customer_phone: editData?.customer?.customer_phone || "",
        membership_type: editData?.membership_type_detail?.id || "",
        membership_code: editData?.membership_code || "",
        branch_name: editData?.branch_name || "",
        manager: editData?.manager_detail?.id || "",
        amount_paid: editData?.amount_paid || "",
        membership_price: editData?.membership_type_detail?.membership_price || "",
      });

      if (editorRef.current) {
        editorRef.current.root.innerHTML = editData?.terms_and_conditions || "";
      }
    }
  }, [editData]);

  const calculateDueAmount = () => {
    const membershipPrice = parseFloat(formData.membership_price) || 0;
    const amountPaid = parseFloat(formData.amount_paid) || 0;
    return membershipPrice - amountPaid;
  };

  const dueAmount = calculateDueAmount();

  return (
    <div className="bg-white rounded-xl">
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
      
      {/* Form Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {editData ? "Edit Customer Membership" : "Create New Customer Membership"}
            </h3>
            <p className="text-gray-600 mt-1">
              {editData ? "Update customer membership details" : "Create a new membership for a customer"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editData && (
              <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                Editing
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Customer Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <PersonIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Customer Information</h4>
                <p className="text-gray-600 text-sm">Enter customer details for membership</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <TextField
                    fullWidth
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, customer_phone: value });
                      setFormErrors(prev => ({ ...prev, customer_phone: '' }));
                    }}
                    error={!!formErrors.customer_phone}
                    helperText={formErrors.customer_phone}
                    InputProps={{
                      startAdornment: (
                        <div className="flex items-center mr-2">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-500 ml-1">+91</span>
                        </div>
                      ),
                      sx: { borderRadius: '8px' }
                    }}
                    placeholder="Enter 10-digit phone number"
                  />
                  {customerLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CircularProgress size={20} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter phone number to auto-fill customer name if existing
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <TextField
                  fullWidth
                  value={formData.customer_name}
                  onChange={(e) => {
                    setFormData({ ...formData, customer_name: e.target.value });
                    setFormErrors(prev => ({ ...prev, customer_name: '' }));
                  }}
                  error={!!formErrors.customer_name}
                  helperText={formErrors.customer_name}
                  InputProps={{
                    startAdornment: <PersonIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' }
                  }}
                  placeholder="Enter customer full name"
                />
              </div>
            </div>
          </div>

          {/* Membership Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CardMembershipIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Membership Details</h4>
                <p className="text-gray-600 text-sm">Select membership type and generate code</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type *
                </label>
                <Autocomplete
                  disablePortal
                  options={membershipTypeData}
                  disabled={mTLoading}
                  getOptionLabel={(option) =>
                    `${option?.membership_name} - ₹${option?.membership_price}`
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  fullWidth
                  renderInput={(params) => (
                    <div className="relative">
                      <TextField
                        {...params}
                        error={!!formErrors.membership_type}
                        helperText={formErrors.membership_type}
                        placeholder="Select a membership type"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <CardMembershipIcon className="h-5 w-5 text-gray-400 mr-2" />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          sx: { borderRadius: '8px' }
                        }}
                      />
                      {mTLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CircularProgress size={20} />
                        </div>
                      )}
                    </div>
                  )}
                  value={
                    membershipTypeData.find(
                      (item) => item.id === formData.membership_type
                    ) || null
                  }
                  onChange={(e, value) => {
                    setFormData({
                      ...formData,
                      membership_type: value?.id || "",
                      membership_price: value?.membership_price || "",
                    });
                    setFormErrors(prev => ({ ...prev, membership_type: '' }));
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Code
                </label>
                <TextField
                  fullWidth
                  value={formData.membership_code}
                  onChange={(e) => {
                    setFormData({ ...formData, membership_code: e.target.value });
                  }}
                  InputProps={{
                    startAdornment: <CodeIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' },
                    readOnly: true,
                  }}
                  placeholder="Auto-generated"
                  helperText="Unique code auto-generated for tracking"
                />
              </div>
            </div>

            {/* Membership Price Display */}
            {formData.membership_price && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Selected Membership Price</p>
                    <p className="text-2xl font-bold text-blue-800">
                      ₹{formData.membership_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Membership ID: {formData.membership_type}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DescriptionIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Terms & Conditions *</h4>
                <p className="text-gray-600 text-sm">Define membership terms and conditions</p>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div id="editor" style={{ height: "200px" }}></div>
            </div>
            {formErrors.terms && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <ErrorOutlineIcon className="h-3 w-3" />
                {formErrors.terms}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Use the toolbar to format text, add lists, and apply styling
            </p>
          </div>

          {/* Branch and Manager Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name *
                </label>
                <TextField
                  fullWidth
                  value={formData.branch_name}
                  onChange={(e) => {
                    setFormData({ ...formData, branch_name: e.target.value });
                    setFormErrors(prev => ({ ...prev, branch_name: '' }));
                  }}
                  error={!!formErrors.branch_name}
                  helperText={formErrors.branch_name}
                  InputProps={{
                    startAdornment: <BusinessIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' }
                  }}
                  placeholder="Enter branch name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager *
                </label>
                <FormControl fullWidth error={!!formErrors.manager}>
                  <Select
                    value={formData.manager}
                    onChange={(e) => {
                      setFormData({ ...formData, manager: e.target.value });
                      setFormErrors(prev => ({ ...prev, manager: '' }));
                    }}
                    MenuProps={MenuProps}
                    displayEmpty
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="">
                      <span className="text-gray-400">Select a manager</span>
                    </MenuItem>
                    {managerData?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          <SupervisorAccountIcon className="h-4 w-4 text-gray-400" />
                          <span>{item.managername}</span>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.manager && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.manager}</p>
                  )}
                </FormControl>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <CurrencyRupeeIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Payment Information</h4>
                <p className="text-gray-600 text-sm">Enter payment details and track balance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid *
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.amount_paid}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, amount_paid: value });
                    setFormErrors(prev => ({ ...prev, amount_paid: '' }));
                  }}
                  error={!!formErrors.amount_paid}
                  helperText={formErrors.amount_paid}
                  InputProps={{
                    startAdornment: <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' },
                    inputProps: { min: 0, step: "0.01" }
                  }}
                  placeholder="Enter amount paid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Price
                </label>
                <TextField
                  fullWidth
                  value={formData.membership_price || "0"}
                  disabled
                  InputProps={{
                    startAdornment: <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' }
                  }}
                  helperText="Based on selected membership type"
                />
              </div>
            </div>

            {/* Balance Summary */}
            {formData.membership_price && formData.amount_paid && (
              <div className="mt-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{formData.membership_price}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{formData.amount_paid}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Balance Due</p>
                      <p className={`text-xl font-bold ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{dueAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {dueAmount > 0 ? (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-orange-600 font-medium">
                        <ErrorOutlineIcon className="h-4 w-4 inline mr-1" />
                        Customer still owes ₹{dueAmount.toFixed(2)}
                      </p>
                    </div>
                  ) : dueAmount < 0 ? (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-blue-600 font-medium">
                        <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                        Excess payment of ₹{Math.abs(dueAmount).toFixed(2)} recorded
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-green-600 font-medium">
                        <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                        Payment completed in full
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  {editData ? "Updating..." : "Processing..."}
                </>
              ) : editData ? (
                "Update Membership"
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  Create Membership
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerMembership;