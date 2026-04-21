import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AuthContext from "../../../Context/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Delete, Add, Info, PointOfSale, CalendarMonth, Description } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import SpaIcon from "@mui/icons-material/Spa";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CreateMembershipType = ({ editData, onClose }) => {
  const editorRef = useRef(null);
  const { vendorData, authTokens } = useContext(AuthContext);

  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    membership_name: "",
    validity_in_months: "",
    service_ids: [
      {
        service_id: "",
        points_per_massage: 0,
        name: "",
        price: "",
      },
    ],
    terms_and_conditions: "",
    membership_price: "",
    total_point: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        membership_name: editData?.membership_name || "",
        validity_in_months: editData?.validity_in_months || "",
        service_ids: editData?.service_ids || [{
          service_id: "",
          points_per_massage: 0,
          name: "",
          price: "",
        }],
        terms_and_conditions: editData?.terms_and_conditions || "",
        membership_price: editData?.membership_price || "",
        total_point: editData?.total_point || "",
      });
    }
  }, [editData]);

  const fetchServices = async (page) => {
    setServiceLoading(true);

    if (!vendorData?.spa) {
      toast.error("Spa information not available");
      setServiceLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/service/?page=${page}&spa_id=${vendorData?.spa}`,
        {}
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (page === 1) {
        let reducedData = data?.results?.map((service) => ({
          id: service?.id,
          service_name: service?.service_names,
          price: service?.price,
          duration: service?.service_time ? 
            `${service.service_time.hours || 0}h ${service.service_time.minutes || 0}m` : 'N/A'
        })) || [];
        setTempAllServices(reducedData);
      } else {
        let reducedData = data?.results?.map((service) => ({
          id: service?.id,
          service_name: service?.service_names,
          price: service?.price,
          duration: service?.service_time ? 
            `${service.service_time.hours || 0}h ${service.service_time.minutes || 0}m` : 'N/A'
        })) || [];
        setTempAllServices([...tempAllServices, ...reducedData]);
      }

      if (data?.next) {
        setPage(page + 1);
      }
    } catch (error) {
      toast.error(`Failed to load services: ${error.message}`);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchServices(page);
  }, [page, vendorData?.spa]);

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

    if (editData && editData?.terms_and_conditions) {
      editorRef.current.root.innerHTML = editData?.terms_and_conditions;
    }
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData?.membership_name?.trim()) {
      errors.membership_name = "Membership name is required";
    }

    if (!formData?.validity_in_months || isNaN(formData.validity_in_months) || formData.validity_in_months <= 0) {
      errors.validity_in_months = "Valid validity period is required (in months)";
    }

    if (!formData?.membership_price || isNaN(formData.membership_price) || formData.membership_price <= 0) {
      errors.membership_price = "Valid membership price is required";
    }

    if (!formData?.total_point || isNaN(formData.total_point) || formData.total_point <= 0) {
      errors.total_point = "Valid total points are required";
    }

    // Validate services
    const validServices = formData?.service_ids?.filter(service => service.service_id);
    if (validServices.length === 0) {
      errors.services = "At least one service must be selected";
    }

    // Validate each service has points
    formData?.service_ids?.forEach((service, index) => {
      if (service.service_id && (!service.points_per_massage || service.points_per_massage <= 0)) {
        errors[`service_${index}_points`] = `Points required for selected service`;
      }
    });

    const termsContent = editorRef.current?.getText().trim();
    if (!termsContent) {
      errors.terms = "Terms and conditions are required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalPoints = () => {
    return formData?.service_ids?.reduce((total, service) => {
      return total + (parseInt(service.points_per_massage) || 0);
    }, 0);
  };

  const calculateTotalServiceValue = () => {
    return formData?.service_ids?.reduce((total, service) => {
      return total + (parseFloat(service.price) || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    let method = editData ? "PATCH" : "POST";
    let url = `https://backendapi.trakky.in/spavendor/membership-type-new/`;
    
    if (editData) {
      url += `${editData?.id}/`;
    }

    let payload = {
      membership_name: formData?.membership_name,
      validity_in_months: parseInt(formData?.validity_in_months),
      terms_and_conditions: editorRef.current.root.innerHTML,
      membership_price: parseFloat(formData?.membership_price),
      total_point: parseInt(formData?.total_point),
      service_ids: formData?.service_ids?.filter((service) => service?.service_id),
    };

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
          ? "Membership type updated successfully!"
          : "Membership type created successfully!"
      );

      // Reset form
      setFormData({
        membership_name: "",
        validity_in_months: "",
        service_ids: [{
          service_id: "",
          points_per_massage: 0,
          name: "",
          price: "",
        }],
        terms_and_conditions: "",
        membership_price: "",
        total_point: "",
      });

      if (editorRef.current) {
        editorRef.current.root.innerHTML = "";
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to save membership type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPoints = calculateTotalPoints();
  const totalServiceValue = calculateTotalServiceValue();
  const discountPercentage = totalServiceValue > 0 
    ? Math.round(((totalServiceValue - parseFloat(formData.membership_price || 0)) / totalServiceValue) * 100)
    : 0;

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
              {editData ? "Edit Membership Type" : "Create New Membership Type"}
            </h3>
            <p className="text-gray-600 mt-1">
              {editData ? "Update membership package details" : "Define a new membership package with services and points"}
            </p>
          </div>
          {editData && (
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Editing
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Basic Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CardMembershipIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                <p className="text-gray-600 text-sm">Enter basic membership details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Name *
                </label>
                <TextField
                  fullWidth
                  value={formData?.membership_name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      membership_name: e.target.value,
                    });
                    setFormErrors(prev => ({ ...prev, membership_name: '' }));
                  }}
                  error={!!formErrors.membership_name}
                  helperText={formErrors.membership_name}
                  InputProps={{
                    startAdornment: <CardMembershipIcon className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' }
                  }}
                  placeholder="e.g., Premium Membership"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity (Months) *
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={formData?.validity_in_months}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      validity_in_months: e.target.value,
                    });
                    setFormErrors(prev => ({ ...prev, validity_in_months: '' }));
                  }}
                  error={!!formErrors.validity_in_months}
                  helperText={formErrors.validity_in_months}
                  InputProps={{
                    startAdornment: <CalendarMonth className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' },
                    inputProps: { min: 1 }
                  }}
                  placeholder="e.g., 12"
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <SpaIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Included Services *</h4>
                <p className="text-gray-600 text-sm">Add services and assign points per massage</p>
              </div>
            </div>

            {formErrors.services && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <ErrorOutlineIcon className="h-4 w-4" />
                  {formErrors.services}
                </p>
              </div>
            )}

            {formData?.service_ids?.map((serviceItem, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-800">Service {index + 1}</h5>
                  {index > 0 && (
                    <button
                      onClick={() => {
                        let temp = [...formData?.service_ids];
                        temp.splice(index, 1);
                        setFormData({
                          ...formData,
                          service_ids: temp,
                        });
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                      title="Remove service"
                    >
                      <Delete className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Service
                    </label>
                    <Autocomplete
                      disablePortal
                      options={allServices}
                      getOptionLabel={(option) =>
                        `${option?.service_name} - ₹${option?.price}`
                      }
                      disabled={serviceLoading}
                      fullWidth
                      renderInput={(params) => (
                        <div className="relative">
                          <TextField
                            {...params}
                            placeholder="Search and select a service"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <SpaIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                              sx: { borderRadius: '8px' }
                            }}
                          />
                          {serviceLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CircularProgress size={20} />
                            </div>
                          )}
                        </div>
                      )}
                      value={
                        allServices.find(
                          (service) => service.id === serviceItem?.service_id
                        ) || null
                      }
                      onChange={(e, value) => {
                        let temp = [...formData?.service_ids];
                        temp[index] = {
                          service_id: value?.id || "",
                          points_per_massage: serviceItem.points_per_massage,
                          name: value?.service_name || "",
                          price: value?.price || "",
                        };
                        setFormData({
                          ...formData,
                          service_ids: temp,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Per Massage *
                    </label>
                    <TextField
                      fullWidth
                      type="number"
                      value={serviceItem?.points_per_massage}
                      onChange={(e) => {
                        let temp = [...formData?.service_ids];
                        temp[index] = {
                          ...temp[index],
                          points_per_massage: parseInt(e.target.value) || 0,
                        };
                        setFormData({
                          ...formData,
                          service_ids: temp,
                        });
                        setFormErrors(prev => ({ ...prev, [`service_${index}_points`]: '' }));
                      }}
                      error={!!formErrors[`service_${index}_points`]}
                      helperText={formErrors[`service_${index}_points`]}
                      InputProps={{
                        startAdornment: <PointOfSale className="h-5 w-5 text-gray-400 mr-2" />,
                        sx: { borderRadius: '8px' },
                        inputProps: { min: 0 }
                      }}
                      placeholder="Enter points"
                    />
                  </div>
                </div>

                {serviceItem?.price && (
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Service Price: ₹{serviceItem.price}</span>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  service_ids: [
                    ...formData?.service_ids,
                    {
                      service_id: "",
                      points_per_massage: 0,
                      name: "",
                      price: "",
                    },
                  ],
                });
              }}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors duration-200"
            >
              <Add className="h-4 w-4" />
              Add Another Service
            </button>

            {/* Service Summary */}
            {totalServiceValue > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Services</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formData?.service_ids?.filter(s => s.service_id).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Service Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalServiceValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Description className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Terms & Conditions *</h4>
                <p className="text-gray-600 text-sm">Define membership terms and rules</p>
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

          {/* Pricing and Points Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
             
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Pricing & Points</h4>
                <p className="text-gray-600 text-sm">Set membership price and total points</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Price *
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={formData?.membership_price}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      membership_price: e.target.value,
                    });
                    setFormErrors(prev => ({ ...prev, membership_price: '' }));
                  }}
                  error={!!formErrors.membership_price}
                  helperText={formErrors.membership_price}
                  InputProps={{
                    sx: { borderRadius: '8px' },
                    inputProps: { min: 0, step: "0.01" }
                  }}
                  placeholder="Enter membership price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Points *
                </label>
                <TextField
                  fullWidth
                  type="number"
                  value={formData?.total_point}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      total_point: e.target.value,
                    });
                    setFormErrors(prev => ({ ...prev, total_point: '' }));
                  }}
                  error={!!formErrors.total_point}
                  helperText={formErrors.total_point}
                  InputProps={{
                    startAdornment: <PointOfSale className="h-5 w-5 text-gray-400 mr-2" />,
                    sx: { borderRadius: '8px' },
                    inputProps: { min: 0 }
                  }}
                  placeholder="Enter total points"
                />
              </div>
            </div>

            {/* Summary Card */}
            {formData?.membership_price && totalServiceValue > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Value Summary</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Individual Service Value:</span>
                        <span className="font-medium">₹{totalServiceValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Membership Price:</span>
                        <span className="font-medium text-green-600">₹{formData.membership_price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Customer Savings:</span>
                        <span className="font-bold text-green-700">
                          ₹{(totalServiceValue - parseFloat(formData.membership_price)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {discountPercentage}% OFF
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Excellent value offer</p>
                  </div>
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
                  {editData ? "Updating..." : "Creating..."}
                </>
              ) : editData ? (
                "Update Membership Type"
              ) : (
                <>
                  <CardMembershipIcon className="h-4 w-4" />
                  Create Membership Type
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembershipType;