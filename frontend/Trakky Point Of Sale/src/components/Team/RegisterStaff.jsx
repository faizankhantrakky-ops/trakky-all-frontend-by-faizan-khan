import React, { useState, useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../Context/Auth";
import validator from "validator";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Plus, 
  Trash2, 
  Upload,
  Save,
  Loader,
  IndianRupee,
  AlertCircle,
  Clock,
  CreditCard
} from "lucide-react";

function RegisterStaff({ staffData, fetchData, handleClose }) {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const isEdit = !!staffData?.id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [roles, setRoles] = useState([
    "Junior Hair Stylist",
    "Senior Hair Stylist",
    "Intern Hair Stylist",
  ]);
  const [newRole, setNewRole] = useState("");
  const [formData, setFormData] = useState({
    // Basic Info
    staffname: "",
    email: "",
    ph_number: "",
    gender: "Male",
    date_of_birth: "",
    address: "",
    profile_image: null,
    // Employment Info
    staff_role: "Junior Hair Stylist",
    joining_date: "",
    is_permanent: true,
    status: "Active",
    shift_timing: "Morning",
    experience_years: 0,
    // Salary
    salary_type: "Monthly",
    basic_salary: 0,
    amount_paid: 0,
    // Bank Details
    bank_account_number: "",
    ifsc_code: "",
    pan_number: "",
    aadhar_number: "",
    // Emergency
    emergency_contact_name: "",
    emergency_contact_number: "",
    // Commission
    commission_structure: {
      services: [],
      products: [],
      memberships: []
    },
    // Performance
    target_services: 0,
    target_products: 0,
    performance_rating: 0,
    // Existing fields (kept for compatibility)
    id_proof: null,
    commission_slab: [],
    commission_slab_for_product: [],
    commission_slab_for_membership: [],
    commission_results: null,
    commission_results_for_product: null,
    commission_results_for_membership: null,
  });

  useEffect(() => {
    if (staffData && isEdit) {
      const commissionSlabs = staffData.commission_slab
        ? Object.entries(staffData.commission_slab).map(([percentage, range]) => {
            const [min, max] = range.split("-");
            return { percentage: percentage.replace("%", ""), min, max };
          })
        : [];
      const commissionSlabsForProduct = staffData.commission_slab_for_product
        ? Object.entries(staffData.commission_slab_for_product).map(([percentage, range]) => {
            const [min, max] = range.split("-");
            return { percentage: percentage.replace("%", ""), min, max };
          })
        : [];
      const commissionSlabsForMembership = staffData.commission_slab_for_membership
        ? Object.entries(staffData.commission_slab_for_membership).map(([percentage, range]) => {
            const [min, max] = range.split("-");
            return { percentage: percentage.replace("%", ""), min, max };
          })
        : [];
      setFormData({
        // Existing fields
        staffname: staffData.staffname || "",
        ph_number: staffData.ph_number || "",
        address: staffData.address || "",
        id_proof: staffData.id_proof || null,
        joining_date: staffData.joining_date || "",
        is_permanent: staffData.is_permanent || true,
        email: staffData.email || "",
        staff_role: staffData.staff_role || "Junior Hair Stylist",
        gender: staffData.gender || "Male",
        amount_paid: staffData.amount_paid || 0,
        commission_slab: commissionSlabs,
        commission_slab_for_product: commissionSlabsForProduct,
        commission_slab_for_membership: commissionSlabsForMembership,
        commission_results: staffData.commission_results || null,
        commission_results_for_product: staffData.commission_results_for_product || null,
        commission_results_for_membership: staffData.commission_results_for_membership || null,
        shift_timing: staffData.shift_timing || "Morning",
        // New fields
        date_of_birth: staffData.date_of_birth || "",
        profile_image: staffData.profile_image || null,
        status: staffData.status || "Active",
        experience_years: staffData.experience_years || 0,
        salary_type: staffData.salary_type || "Monthly",
        basic_salary: staffData.basic_salary || staffData.salary || 0,
        bank_account_number: staffData.bank_account_number || "",
        ifsc_code: staffData.ifsc_code || "",
        pan_number: staffData.pan_number || "",
        aadhar_number: staffData.aadhar_number || "",
        emergency_contact_name: staffData.emergency_contact_name || "",
        emergency_contact_number: staffData.emergency_contact_number || "",
        commission_structure: staffData.commission_structure ? JSON.parse(staffData.commission_structure) : {
          services: [],
          products: [],
          memberships: []
        },
        target_services: staffData.target_services || 0,
        target_products: staffData.target_products || 0,
        performance_rating: staffData.performance_rating || 0,
      });
      setErrors({});
      setBackendErrors({});
    }
  }, [staffData, isEdit]);

  useEffect(() => {
    if (token) fetchStaffRoles();
  }, [token]);

  const fetchStaffRoles = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(`https://backendapi.trakky.in/salonvendor/staff/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const allRoles = new Set(roles);
        data.forEach((staff) => {
          if (staff.additional_staff_role) {
            try {
              const parsedRoles = JSON.parse(staff.additional_staff_role);
              Object.values(parsedRoles).forEach((role) => {
                if (role) allRoles.add(role);
              });
            } catch (e) {
              console.error("Failed to parse additional_staff_role:", e);
            }
          }
        });
        setRoles(Array.from(allRoles));
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setBackendErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, joining_date: value });
    setErrors((prev) => ({ ...prev, joining_date: "" }));
  };

  const handleDobChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, date_of_birth: value });
    setErrors((prev) => ({ ...prev, date_of_birth: "" }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, id_proof: e.target.files[0] });
  };

  const handleProfileImageChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleAadharChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setFormData({ ...formData, aadhar_number: value });
  };

  const handleEmergencyNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, emergency_contact_number: value });
  };

  const handleCommissionChange = (index, field, value, type) => {
    let key;
    if (type === "service") key = "commission_slab";
    else if (type === "product") key = "commission_slab_for_product";
    else if (type === "membership") key = "commission_slab_for_membership";
    
    const updatedSlabs = [...formData[key]];
    updatedSlabs[index][field] = value;
    setFormData({ ...formData, [key]: updatedSlabs });
  };

  const addCommissionSlab = (type) => {
    let key;
    if (type === "service") key = "commission_slab";
    else if (type === "product") key = "commission_slab_for_product";
    else if (type === "membership") key = "commission_slab_for_membership";
    
    setFormData({ ...formData, [key]: [...formData[key], { percentage: "", min: "", max: "" }] });
  };

  const removeCommissionSlab = (index, type) => {
    let key;
    if (type === "service") key = "commission_slab";
    else if (type === "product") key = "commission_slab_for_product";
    else if (type === "membership") key = "commission_slab_for_membership";
    
    const updatedSlabs = formData[key].filter((_, i) => i !== index);
    setFormData({ ...formData, [key]: updatedSlabs });
  };

  const handleAddNewRole = () => {
    if (!newRole.trim()) {
      toast.error("Please enter a role name");
      return;
    }
    if (roles.includes(newRole.trim())) {
      toast.error("This role already exists");
      return;
    }
    setRoles((prev) => [...prev, newRole.trim()]);
    setNewRole("");
    toast.success("New role added successfully");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewRole();
    }
  };

  // Validation function for all fields
  const validateForm = () => {
    const newErrors = {};
    
    // Personal Information validation
    if (!formData.staffname.trim()) newErrors.staffname = "Staff name is required";
    if (!formData.ph_number || formData.ph_number.length !== 10) newErrors.ph_number = "Phone number must be exactly 10 digits";
    if (!formData.email || !validator.isEmail(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.joining_date) newErrors.joining_date = "Joining date is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    
    // Job Details validation
    if (!formData.staff_role) newErrors.staff_role = "Job role is required";
    if (!formData.basic_salary || parseFloat(formData.basic_salary) <= 0) newErrors.basic_salary = "Valid basic salary is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.shift_timing) newErrors.shift_timing = "Shift timing is required";
    if (!formData.salary_type) newErrors.salary_type = "Salary type is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors({});
    
    if (!validateForm()) {
      setTimeout(() => {
        const firstErrorField = document.querySelector('.error-field');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setLoading(true);
    let submissionSuccess = false;
    try {
      // Service Commission
      const commissionSlabData = {};
      formData.commission_slab.forEach((slab) => {
        if (slab.percentage && slab.min && slab.max) {
          commissionSlabData[`${slab.percentage}%`] = `${slab.min}-${slab.max}`;
        }
      });
      
      // Product Commission
      const commissionSlabForProductData = {};
      formData.commission_slab_for_product.forEach((slab) => {
        if (slab.percentage && slab.min && slab.max) {
          commissionSlabForProductData[`${slab.percentage}%`] = `${slab.min}-${slab.max}`;
        }
      });
      
      // Membership Commission
      const commissionSlabForMembershipData = {};
      formData.commission_slab_for_membership.forEach((slab) => {
        if (slab.percentage && slab.min && slab.max) {
          commissionSlabForMembershipData[`${slab.percentage}%`] = `${slab.min}-${slab.max}`;
        }
      });

        let branchId = localStorage.getItem("branchId") || "";

      
      const formToSubmit = new FormData();
      formToSubmit.append("staffname", formData.staffname);
      formToSubmit.append("joining_date", formData.joining_date);
      formToSubmit.append("address", formData.address);
      formToSubmit.append("staff_role", formData.staff_role);
      formToSubmit.append("ph_number", formData.ph_number);
      formToSubmit.append("is_permanent", formData.is_permanent);
      formToSubmit.append("basic_salary", formData.basic_salary);
      formToSubmit.append("email", formData.email);
      formToSubmit.append("gender", formData.gender);
      formToSubmit.append("amount_paid", formData.amount_paid);
      formToSubmit.append("shift_timing", formData.shift_timing);
      // New fields
      formToSubmit.append("date_of_birth", formData.date_of_birth);
      formToSubmit.append("status", formData.status);
      formToSubmit.append("experience_years", formData.experience_years.toString());
      formToSubmit.append("salary_type", formData.salary_type);
      formToSubmit.append("bank_account_number", formData.bank_account_number);
      formToSubmit.append("ifsc_code", formData.ifsc_code);
      formToSubmit.append("pan_number", formData.pan_number);
      formToSubmit.append("aadhar_number", formData.aadhar_number);
      formToSubmit.append("emergency_contact_name", formData.emergency_contact_name);
      formToSubmit.append("emergency_contact_number", formData.emergency_contact_number);
      formToSubmit.append("target_services", formData.target_services.toString());
      formToSubmit.append("target_products", formData.target_products.toString());
      formToSubmit.append("performance_rating", formData.performance_rating.toString());


      // formToSubmit.append("branchId", formData.branchId);


      if (formData.commission_structure && (formData.commission_structure.services.length > 0 || formData.commission_structure.products.length > 0 || formData.commission_structure.memberships.length > 0)) {
        formToSubmit.append("commission_structure", JSON.stringify(formData.commission_structure));
      }
      if (formData.profile_image && formData.profile_image instanceof File) {
        formToSubmit.append("profile_image", formData.profile_image);
      }
      
      if (Object.keys(commissionSlabData).length > 0) {
        formToSubmit.append("commission_slab", JSON.stringify(commissionSlabData));
      }
      if (Object.keys(commissionSlabForProductData).length > 0) {
        formToSubmit.append("commission_slab_for_product", JSON.stringify(commissionSlabForProductData));
      }
      if (Object.keys(commissionSlabForMembershipData).length > 0) {
        formToSubmit.append("commission_slab_for_membership", JSON.stringify(commissionSlabForMembershipData));
      }
      
      const roleObject = roles.reduce((obj, role, index) => {
        obj[index + 1] = role;
        return obj;
      }, {});
      formToSubmit.append("additional_staff_role", JSON.stringify(roleObject));
      if (formData.id_proof && formData.id_proof instanceof File) {
        formToSubmit.append("id_proof", formData.id_proof);
      }
      const url = isEdit
        ? `https://backendapi.trakky.in/salonvendor/staff/${staffData.id}/`
        : "https://backendapi.trakky.in/salonvendor/staff/";
      const method = isEdit ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formToSubmit,
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        submissionSuccess = true;
        toast.success(isEdit ? "Staff Updated Successfully" : "Staff Registered Successfully");
      } else {
        if (responseData) {
          setBackendErrors(responseData);
          
          Object.keys(responseData).forEach(field => {
            if (Array.isArray(responseData[field])) {
              toast.error(`${field}: ${responseData[field].join(', ')}`);
            } else if (typeof responseData[field] === 'string') {
              toast.error(responseData[field]);
            }
          });
          
          if (Object.keys(responseData).length === 0 && responseData.detail) {
            toast.error(responseData.detail);
          }
          
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        } else {
          toast.error("Operation failed");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Network error occurred during submission");
    } finally {
      setLoading(false);
    }

    if (submissionSuccess) {
      try {
        if (fetchData) await fetchData();
        if (handleClose) handleClose();
        setFormData({
          // Existing defaults
          staffname: "",
          ph_number: "",
          address: "",
          id_proof: null,
          joining_date: "",
          is_permanent: true,
          email: "",
          staff_role: "Junior Hair Stylist",
          gender: "Male",
          amount_paid: 0,
          commission_slab: [],
          commission_slab_for_product: [],
          commission_slab_for_membership: [],
          commission_results: null,
          commission_results_for_product: null,
          commission_results_for_membership: null,
          shift_timing: "Morning",
          // New defaults
          date_of_birth: "",
          profile_image: null,
          status: "Active",
          experience_years: 0,
          salary_type: "Monthly",
          basic_salary: 0,
          bank_account_number: "",
          ifsc_code: "",
          pan_number: "",
          aadhar_number: "",
          emergency_contact_name: "",
          emergency_contact_number: "",
          commission_structure: {
            services: [],
            products: [],
            memberships: []
          },
          target_services: 0,
          target_products: 0,
          performance_rating: 0,
        });
        setNewRole("");
        setErrors({});
        setBackendErrors({});
      } catch (postError) {
        console.error("Post-submission error:", postError);
      }
    }
  };

  // Error display component
  const ErrorMessage = ({ message }) => (
    <div className="flex items-center space-x-1 sm:space-x-2 text-red-600 text-xs sm:text-sm mt-1">
      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      <span>{message}</span>
    </div>
  );

  // Backend error display component
  const BackendErrorMessage = ({ field }) => {
    if (!backendErrors[field]) return null;
    
    return (
      <div className="flex items-center space-x-1 sm:space-x-2 text-red-600 text-xs sm:text-sm mt-1">
        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>
          {Array.isArray(backendErrors[field]) 
            ? backendErrors[field].join(', ')
            : backendErrors[field]
          }
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-4 px-2 sm:px-3 md:px-4">
      <Toaster position="top-center" />
      
      <div className="mx-auto ">
        {/* Form */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal Information */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Personal Information</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                {/* Staff Name */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Staff Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="text"
                      name="staffname"
                      value={formData.staffname}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          setFormData({ ...formData, staffname: value });
                        }
                      }}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.staffname || backendErrors.staffname ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter staff name"
                      required
                    />
                  </div>
                  {errors.staffname && <ErrorMessage message={errors.staffname} />}
                  <BackendErrorMessage field="staffname" />
                </div>

                {/* Joining Date */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Joining Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={handleDateChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.joining_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.joining_date && <ErrorMessage message={errors.joining_date} />}
                </div>

                {/* Phone Number */}
              
                {/* Email */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.email || backendErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="staff@example.com"
                      required
                    />
                  </div>
                  {errors.email && <ErrorMessage message={errors.email} />}
                  <BackendErrorMessage field="email" />
                </div>

                  <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="tel"
                      name="ph_number"
                      value={formData.ph_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData({ ...formData, ph_number: value });
                        if (errors.ph_number) setErrors((prev) => ({ ...prev, ph_number: "" }));
                        if (backendErrors.ph_number) setBackendErrors((prev) => ({ ...prev, ph_number: "" }));
                      }}
                      maxLength={10}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.ph_number || backendErrors.ph_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit phone number"
                      required
                    />
                  </div>
                  {errors.ph_number && <ErrorMessage message={errors.ph_number} />}
                  <BackendErrorMessage field="ph_number" />
                </div>




                {/* Date of Birth - New */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleDobChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.date_of_birth && <ErrorMessage message={errors.date_of_birth} />}
                </div>
              </div>

              {/* Address */}
              <div className="error-field mb-4 sm:mb-5 md:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                {errors.address && <ErrorMessage message={errors.address} />}
              </div>

              {/* Profile Image Upload - New */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Profile Image (Optional)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hidden sm:block" />
                  <input
                    type="file"
                    onChange={handleProfileImageChange}
                    accept="image/*"
                    className="w-full sm:flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Job Details */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Job Details</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                {/* Job Role */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Job Role *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <select
                      name="staff_role"
                      value={formData.staff_role}
                      onChange={handleChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.staff_role || backendErrors.staff_role ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      {roles.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.staff_role && <ErrorMessage message={errors.staff_role} />}
                  <BackendErrorMessage field="staff_role" />
                </div>

                {/* Shift Timing */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Shift Timing *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <select
                      name="shift_timing"
                      value={formData.shift_timing}
                      onChange={handleChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.shift_timing || backendErrors.shift_timing ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="Morning">Morning Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="General">General Shift</option>
                      <option value="Night">Night Shift</option>
                    </select>
                  </div>
                  {errors.shift_timing && <ErrorMessage message={errors.shift_timing} />}
                  <BackendErrorMessage field="shift_timing" />
                </div>

                {/* Employment Status */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Employment Status
                  </label>
                  <select
                    name="is_permanent"
                    value={formData.is_permanent}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value={true}>Permanent</option>
                    <option value={false}>Temporary</option>
                  </select>
                </div>

                {/* Status - New */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>

                {/* Experience Years - New */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="0"
                  />
                </div>

                {/* Salary Type - New */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Salary Type *
                  </label>
                  <select
                    name="salary_type"
                    value={formData.salary_type}
                    onChange={handleChange}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                      errors.salary_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                  </select>
                  {errors.salary_type && <ErrorMessage message={errors.salary_type} />}
                </div>

                {/* Basic Salary */}
                <div className="error-field">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Basic Salary *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="number"
                      name="basic_salary"
                      value={formData.basic_salary}
                      onChange={handleChange}
                      className={`w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] ${
                        errors.basic_salary || backendErrors.basic_salary ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                  {errors.basic_salary && <ErrorMessage message={errors.basic_salary} />}
                  <BackendErrorMessage field="basic_salary" />
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Amount Paid
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="number"
                      name="amount_paid"
                      value={formData.amount_paid}
                      onChange={handleChange}
                      className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
              </div>

              {/* Add New Role */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Add New Role (Optional)
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 max-w-full sm:max-w-md">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter new role name"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewRole}
                    disabled={!newRole.trim()}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* ID Proof Upload */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Upload ID Proof (Optional)
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hidden sm:block" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full sm:flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  />
                </div>
              </div>
            </div>

            {/* New Section: Bank Details */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Bank Details</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter IFSC code"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter PAN"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="tel"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleAadharChange}
                    maxLength={12}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="12-digit Aadhaar"
                  />
                </div>
              </div>
            </div>

            {/* New Section: Emergency Contact */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Emergency Contact</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact_number"
                    value={formData.emergency_contact_number}
                    onChange={handleEmergencyNumberChange}
                    maxLength={10}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="10-digit phone number"
                  />
                </div>
              </div>
            </div>

            {/* New Section: Performance Targets */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Performance Targets</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Target Services
                  </label>
                  <input
                    type="number"
                    name="target_services"
                    value={formData.target_services}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Target Products
                  </label>
                  <input
                    type="number"
                    name="target_products"
                    value={formData.target_products}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Performance Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="performance_rating"
                    value={formData.performance_rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Commission Slabs */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-1.5 sm:space-x-2">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                  <span>Commission Slabs (Optional)</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Set commission percentages for different revenue ranges
                </p>
              </div>

              {/* Service Commission */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-800">Service Commission</h3>
                  <button
                    type="button"
                    onClick={() => addCommissionSlab("service")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add Slab</span>
                  </button>
                </div>

                {formData.commission_slab.map((slab, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg mb-2 sm:mb-3 bg-gray-50">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <input
                        type="number"
                        placeholder="%"
                        value={slab.percentage}
                        onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "service")}
                        className="w-16 sm:w-20 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#492DBD]"
                      />
                      <span className="text-xs sm:text-sm text-gray-500">% for</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={slab.min}
                        onChange={(e) => handleCommissionChange(index, "min", e.target.value, "service")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#492DBD]"
                      />
                      <span className="text-xs sm:text-sm text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={slab.max}
                        onChange={(e) => handleCommissionChange(index, "max", e.target.value, "service")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#492DBD]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCommissionSlab(index, "service")}
                      className="sm:ml-auto p-1 text-red-500 hover:text-red-700 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Product Commission */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-800">Product Commission</h3>
                  <button
                    type="button"
                    onClick={() => addCommissionSlab("product")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add Slab</span>
                  </button>
                </div>

                {formData.commission_slab_for_product.map((slab, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-blue-200 rounded-lg mb-2 sm:mb-3 bg-blue-50">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <input
                        type="number"
                        placeholder="%"
                        value={slab.percentage}
                        onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "product")}
                        className="w-16 sm:w-20 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm text-blue-600">% for</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={slab.min}
                        onChange={(e) => handleCommissionChange(index, "min", e.target.value, "product")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm text-blue-600">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={slab.max}
                        onChange={(e) => handleCommissionChange(index, "max", e.target.value, "product")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCommissionSlab(index, "product")}
                      className="sm:ml-auto p-1 text-red-500 hover:text-red-700 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Membership Commission */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-md font-semibold text-gray-800">Membership Commission</h3>
                  <button
                    type="button"
                    onClick={() => addCommissionSlab("membership")}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add Slab</span>
                  </button>
                </div>

                {formData.commission_slab_for_membership.map((slab, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-purple-200 rounded-lg mb-2 sm:mb-3 bg-purple-50">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <input
                        type="number"
                        placeholder="%"
                        value={slab.percentage}
                        onChange={(e) => handleCommissionChange(index, "percentage", e.target.value, "membership")}
                        className="w-16 sm:w-20 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-xs sm:text-sm text-purple-600">% for</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={slab.min}
                        onChange={(e) => handleCommissionChange(index, "min", e.target.value, "membership")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-xs sm:text-sm text-purple-600">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={slab.max}
                        onChange={(e) => handleCommissionChange(index, "max", e.target.value, "membership")}
                        className="w-16 sm:w-24 px-1.5 sm:px-2 py-1 text-xs sm:text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCommissionSlab(index, "membership")}
                      className="sm:ml-auto p-1 text-red-500 hover:text-red-700 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-3 sm:pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm"
              >
                {loading ? (
                  <>
                    <Loader className="w-3 h-3 sm:w-4 sm:h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-5" />
                    <span>{isEdit ? "Update Staff" : "Register Staff"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterStaff;