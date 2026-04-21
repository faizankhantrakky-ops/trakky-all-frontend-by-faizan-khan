import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
} from "@mui/material";
import "./RegisterStaff.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AuthContext from "../../Context/Auth";
import validator from "validator";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Briefcase,
  UserCheck,
  Upload,
  Save,
  X,
  File
} from 'lucide-react';

function RegisterStaff({ staffData, fetchData, handleClose }) {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;

  const [formData, setFormData] = useState({
    staffname: staffData?.staffname || "",
    joining_date: staffData?.joining_date || null,
    address: staffData?.address || "",
    ph_number: staffData?.ph_number || "",
    is_permanent: staffData?.is_permanent || true,
    salary: staffData?.salary || "",
    email: staffData?.email || "",
    gender: staffData?.gender || "",
    id_proof: "",
    amount_paid: staffData?.amount_paid || 0,
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDate = (newValue) => {
    const formattedDate = newValue.format("YYYY-MM-DD");
    setFormData({
      ...formData,
      joining_date: formattedDate,
    });
    if (errors.joining_date) {
      setErrors(prev => ({ ...prev, joining_date: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedFile(file);
      setFormData({
        ...formData,
        id_proof: file,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staffname.trim()) {
      newErrors.staffname = "Staff name is required";
    }

    if (!formData.joining_date) {
      newErrors.joining_date = "Joining date is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.ph_number.trim()) {
      newErrors.ph_number = "Phone number is required";
    } else if (!validator.isMobilePhone(formData.ph_number, "en-IN")) {
      newErrors.ph_number = "Please enter a valid Indian phone number";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validator.isEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formToSubmit = new FormData();
    formToSubmit.append("staffname", formData.staffname);
    formToSubmit.append("joining_date", formData.joining_date);
    formToSubmit.append("address", formData.address);
    formToSubmit.append("ph_number", formData.ph_number);
    formToSubmit.append("is_permanent", formData.is_permanent);
    formToSubmit.append("salary", formData.salary);
    formToSubmit.append("email", formData.email);
    formToSubmit.append("gender", formData.gender);
    formToSubmit.append("amount_paid", formData.amount_paid);

    if (formData.id_proof) {
      formToSubmit.append("id_proof", formData.id_proof);
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/staff/${staffData ? `${staffData.id}/` : ""}`,
        {
          method: staffData ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formToSubmit,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(staffData ? "Staff updated successfully" : "Staff added successfully");
        
        // Reset form
        setFormData({
          staffname: "",
          joining_date: null,
          address: "",
          ph_number: "",
          is_permanent: true,
          salary: "",
          email: "",
          gender: "",
          id_proof: "",
          amount_paid: 0,
        });
        setSelectedFile(null);
        setErrors({});

        if (staffData) {
          fetchData();
          handleClose();
        }
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error("Please check your input data");
        console.error("Validation errors:", errorData);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Network error occurred");
      console.error(error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="p-5 flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] rounded-lg mr-3">
            {staffData ? (
              <UserCheck className="h-6 w-6 text-white" />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {staffData ? "Edit Staff Member" : "Register New Staff"}
            </h2>
            <p className="text-sm text-gray-600">
              {staffData ? "Update staff information" : "Add a new staff member to the system"}
            </p>
          </div>
        </div>
        {handleClose && (
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              Full Name *
            </label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter staff full name"
              name="staffname"
              value={formData.staffname}
              onChange={handleChange}
              error={!!errors.staffname}
              helperText={errors.staffname}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Joining Date *
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    error: !!errors.joining_date,
                    helperText: errors.joining_date,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }
                  }
                }}
                value={formData.joining_date ? dayjs(formData.joining_date) : null}
                onChange={handleDate}
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              Phone Number *
            </label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter 10-digit phone number"
              name="ph_number"
              type="tel"
              value={formData.ph_number}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  handleChange(e);
                }
              }}
              error={!!errors.ph_number}
              helperText={errors.ph_number}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              Email Address *
            </label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Address *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter complete address"
            name="address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />
        </div>

        {/* Employment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
              Employment Status
            </label>
            <FormControl fullWidth size="small">
              <Select
                name="is_permanent"
                value={formData.is_permanent}
                onChange={handleChange}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <MenuItem value={true}>
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                    Permanent
                  </div>
                </MenuItem>
                <MenuItem value={false}>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-yellow-600" />
                    Temporary
                  </div>
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <FormControl fullWidth size="small" error={!!errors.gender}>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select gender</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
              Monthly Salary *
            </label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter monthly salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              error={!!errors.salary}
              helperText={errors.salary}
              InputProps={{
                startAdornment: <span className="mr-2">₹</span>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Upload className="h-4 w-4 mr-2 text-gray-500" />
            ID Proof Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <File className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFormData(prev => ({ ...prev, id_proof: "" }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload ID proof</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {handleClose && (
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'medium',
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#492DBD',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
              paddingX: 3,
              paddingY: 1,
              '&:hover': {
                bgcolor: '#3a1f9a',
              }
            }}
            startIcon={<Save className="h-4 w-4" />}
          >
            {staffData ? "Update Staff" : "Register Staff"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterStaff;