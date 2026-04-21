import React, { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../../Context/Auth";
import { 
  Trash2, Plus, FileText, Calendar, Tag, IndianRupee, Percent, 
  ChevronDown, CheckCircle, AlertCircle, Shield, Settings, 
  Search, X, Menu, ChevronLeft 
} from "lucide-react";

const CreateMembershipType = ({ app, onClose }) => {
  const editorRef = useRef(null);
  const quillInitialized = useRef(false);
  const { vendorData, authTokens } = useContext(AuthContext);

  const [ListofServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [page, setPage] = useState(1);
  const [showServicesDropdown, setShowServicesDropdown] = useState(null);
  const [searchTerm, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebar, setShowMobileSidebar] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRefs = useRef([]);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // State
  const [membershipName, setMembershipName] = useState(app?.name || "");
  const [validity, setValidity] = useState(app?.validity_in_month || 0);
  const [services, setServices] = useState(
    app
      ? app.service_data.map((service) => ({
          id: service.id,
          service_name: service.service_name,
          service_time: service.service_time,
          gender: service.gender,
        }))
      : [
          {
            id: "",
            service_name: "",
            service_time: "",
            gender: "",
          },
        ]
  );

  const [discount, setDiscount] = useState(app?.discount_percentage || "");
  const [price, setPrice] = useState(app?.price || "");
  const [minimumOrderValue, setMinimumOrderValue] = useState(app?.minimum_order_value || "");
  const [wholeServiceSelected, setWholeServiceSelected] = useState(app?.whole_service || false);

  useEffect(() => {
    if (app) {
      setMembershipName(app?.name || "");
      setValidity(app?.validity_in_month || 0);
      setServices(
        app.service_data.map((service) => ({
          id: service.id,
          service_name: service.service_name,
          service_time: service.service_time,
          gender: service.gender,
        }))
      );
      setDiscount(app?.discount_percentage || app?.discount_price || "");
      setPrice(app?.price || "");
      setMinimumOrderValue(app?.minimum_order_value || "");
      setWholeServiceSelected(app?.whole_service || false);
      setDiscountType(app?.discount_percentage ? "percentage" : "fixed");
    }
  }, [app]);

  const fetchServices = async (page) => {
    setServiceLoading(true);

    if (!vendorData?.salon) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=${page}&salon_id=${vendorData?.salon}`,
        {}
      );
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          let reducedData = await data.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_name,
              service_time: service?.service_time,
              gender: service?.gender,
            };
          });
          setTempAllServices(reducedData);
        } else {
          let reducedData = await data.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_name,
              service_time: service?.service_time,
              gender: service?.gender,
            };
          });
          setTempAllServices([...tempAllServices, ...reducedData]);
        }

        if (data?.next) {
          setPage(page + 1);
        }
      } else {
        toast.error(`Something went wrong while fetching services: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Something went wrong while fetching services: ${error.message}`);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  const formatTime = (time) => {
    if (!time) return "N/A";
    
    let str = "";
    if (time?.days && time?.days !== "0") {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating !== "0") {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours !== "0") {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes !== "0") {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);
    return str || "N/A";
  };

  useEffect(() => {
    fetchServices(page);
  }, [page, vendorData?.salon]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if click is on any of the service buttons
        const isServiceButton = buttonRefs.current.some(ref => 
          ref && ref.contains(event.target)
        );
        
        if (!isServiceButton) {
          setShowServicesDropdown(null);
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter services based on search
  const filteredServices = ListofServices.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize Quill editor
  useEffect(() => {
    const initQuill = async () => {
      if (quillInitialized.current) return;
      
      try {
        const Quill = (await import('quill')).default;
        
        if (!editorRef.current && document.getElementById("quill-editor")) {
          editorRef.current = new Quill("#quill-editor", {
            theme: "snow",
            modules: {
              toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ list: "bullet" }, { list: "ordered" }],
                [{ color: [] }],
              ],
            },
          });

          if (app?.term_and_conditions) {
            setTimeout(() => {
              if (editorRef.current) {
                editorRef.current.root.innerHTML = app.term_and_conditions;
              }
            }, 100);
          }

          quillInitialized.current = true;
        }
      } catch (error) {
        console.error("Failed to load Quill:", error);
      }
    };

    initQuill();

    return () => {
      quillInitialized.current = false;
    };
  }, [app]);

  const handleSubmit = async () => {
    if (!membershipName.trim()) {
      toast.error("Please enter membership name");
      return;
    }
    if (!validity || validity <= 0) {
      toast.error("Please enter a valid validity period");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!minimumOrderValue || minimumOrderValue <= 0) {
      toast.error("Please enter a valid minimum order value");
      return;
    }
    if (!wholeServiceSelected && services.some(service => !service.id)) {
      toast.error("Please select all services or remove empty service fields");
      return;
    }

    let method = app ? "PATCH" : "POST";
    let url = `https://backendapi.trakky.in/salonvendor/memberships/`;
    if (app) {
      url += `${app?.id}/`;
    }
    
    const formData = new FormData();
    formData.append("name", membershipName);
    formData.append("validity_in_month", validity);
    formData.append("price", price);
    formData.append("minimum_order_value", minimumOrderValue);
    formData.append("whole_service", wholeServiceSelected);
    formData.append("term_and_conditions", editorRef.current?.root?.innerHTML || "");

    // Add discount based on type
    if (discountType === "percentage") {
      formData.append("discount_percentage", discount);
      formData.append("discount_price", "");
    } else {
      formData.append("discount_price", discount);
      formData.append("discount_percentage", "");
    }

    if (services?.length > 0 && !wholeServiceSelected) {
      for (let i = 0; i < services.length; i++) {
        if (services[i].id) {
          formData.append(`included_services`, services[i].id);
        }
      }
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(app ? "Membership type updated successfully." : "Membership type created successfully.");
        
        // Reset form
        setMembershipName("");
        setValidity("");
        setServices([
          {
            id: "",
            service_name: "",
            service_time: "",
            gender: "",
          },
        ]);
        setDiscount("");
        setPrice("");
        setMinimumOrderValue("");
        if (editorRef.current) {
          editorRef.current.root.innerHTML = "";
        }
        
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 500);
      } else {
        toast.error("Something went wrong: " + response.statusText);
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  const toggleServiceDropdown = (index) => {
    if (showServicesDropdown === index) {
      setShowServicesDropdown(null);
      setSearchQuery("");
    } else {
      setShowServicesDropdown(index);
      setSearchQuery("");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full h-full overflow-auto bg-gray-50">
        {/* Mobile Header with Sidebar Toggle */}
        {isMobile && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {app ? "Edit Membership" : "New Membership"}
                  </h1>
                  <p className="text-xs text-gray-500 truncate">
                    Configure membership tier
                  </p>
                </div>
              </div>
              <button
                onClick={() => onClose && onClose()}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="flex">
          {/* Main Content - Left Side */}
          <div className={`${isMobile ? 'w-full' : 'w-full lg:w-2/3'} ${isMobileSidebar ? 'hidden lg:block' : 'block'}`}>
            {/* Desktop Header */}
            {!isMobile && (
              <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {app ? "Edit Membership Type" : "New Membership Type"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure membership tier with services, pricing, and terms
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onClose && onClose()}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{app ? "Update Type" : "Create Type"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="p-4 lg:p-6 mx-auto">
              <div className="space-y-6">
                {/* Basic Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Shield className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-base lg:text-lg font-semibold text-gray-900">Basic Information</h2>
                        <p className="text-xs lg:text-sm text-gray-500">Enter membership name and validity period</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {/* Membership Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-1 text-gray-500" />
                            Membership Name <span className="text-red-500 ml-1">*</span>
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={membershipName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                setMembershipName(value);
                              }
                            }}
                            className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                            placeholder="e.g., Premium Membership"
                          />
                          {membershipName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Validity */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                            Validity (Months) <span className="text-red-500 ml-1">*</span>
                          </span>
                        </label>
                        <input
                          type="number"
                          value={validity}
                          onChange={(e) => setValidity(e.target.value)}
                          min="1"
                          className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                          placeholder="e.g., 12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Selection Card */}
                <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-gray-100 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                          <Settings className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Included Service's</h2>
                          <p className="text-xs lg:text-sm text-gray-500">Select services included in this membership</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={wholeServiceSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setWholeServiceSelected(true);
                                  setServices([]);
                                } else {
                                  setWholeServiceSelected(false);
                                  setServices([
                                    {
                                      id: "",
                                      service_name: "",
                                      service_time: "",
                                      gender: "",
                                    },
                                  ]);
                                }
                              }}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded border flex items-center justify-center ${
                              wholeServiceSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                            }`}>
                              {wholeServiceSelected && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700">Include All Services</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    {!wholeServiceSelected ? (
                      <>
                        {services.map((service, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Service Selection */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Service {index + 1}
                                </label>
                                <div className="relative">
                                  <button
                                    ref={el => buttonRefs.current[index] = el}
                                    type="button"
                                    onClick={() => toggleServiceDropdown(index)}
                                    className={`w-full px-4 py-2.5 lg:py-3 border ${
                                      service.id ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
                                    } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                                  >
                                    <div className="truncate">
                                      {service.id ? (
                                        <div className="flex items-center">
                                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></div>
                                          <span className="font-medium truncate">{service.service_name}</span>
                                          <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                                            {service.gender}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-gray-500">Select service</span>
                                      )}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                                      showServicesDropdown === index ? "rotate-180" : ""
                                    }`} />
                                  </button>
                                </div>
                              </div>

                             
                            </div>
                          </div>
                        ))}

                        {/* Add Service Button */}
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              setServices([
                                ...services,
                                {
                                  id: "",
                                  service_name: "",
                                  service_time: "",
                                  gender: "",
                                },
                              ]);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Another Service</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <h3 className="font-medium text-green-800">All Services Included</h3>
                            <p className="text-sm text-green-600 mt-1">
                              This membership includes all available services.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-base lg:text-lg font-semibold text-gray-900">Terms & Conditions</h2>
                        <p className="text-xs lg:text-sm text-gray-500">Define terms for this membership type</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div id="quill-editor" className="min-h-[120px] lg:min-h-[150px]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the toolbar above to format text, add lists, or change colors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side (Pricing & Actions) */}
          <div className={`${isMobile ? (isMobileSidebar ? 'block' : 'hidden') : 'block'} w-full lg:w-1/3 ${!isMobile && 'border-l border-gray-200'}`}>
            {/* Mobile Sidebar Header */}
            {isMobile && isMobileSidebar && (
              <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm lg:hidden">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Pricing & Actions</h2>
                    <p className="text-xs text-gray-500">Set pricing and validation</p>
                  </div>
                </div>
              </div>
            )}

            <div className={`${isMobile ? 'p-4' : 'p-4 lg:p-6'} space-y-6 h-full overflow-y-auto ${isMobile && isMobileSidebar ? 'block' : ''}`}>
              {/* Pricing Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:sticky lg:top-6">
                <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <IndianRupee className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-base lg:text-lg font-semibold text-gray-900">Pricing & Discount</h2>
                      <p className="text-xs lg:text-sm text-gray-600">Set membership price and discounts</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 lg:p-6 space-y-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
                        Membership Price <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Minimum Order Value */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
                        Minimum Order Value <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={minimumOrderValue}
                        onChange={(e) => setMinimumOrderValue(e.target.value)}
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Discount Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <Tag className="w-4 h-4 mr-1 text-gray-500" />
                        Discount Type
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscountType("percentage")}
                        className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all duration-200 ${
                          discountType === "percentage"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Percent className="w-4 h-4" />
                        <span className="text-sm font-medium">Percentage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType("fixed")}
                        className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all duration-200 ${
                          discountType === "fixed"
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-sm font-medium">Fixed Amount</span>
                      </button>
                    </div>
                  </div>

                  {/* Discount Amount */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {discountType === "percentage" ? "%" : "₹"}
                      </span>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        min="0"
                        max={discountType === "percentage" ? "100" : undefined}
                        className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                        placeholder={discountType === "percentage" ? "0" : "0.00"}
                      />
                    </div>
                    {discount && discountType === "percentage" && (
                      <div className="text-xs text-gray-500">
                        Applied as {discount}% discount on services
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Membership Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{validity || 0} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Services:</span>
                        <span className="font-medium">
                          {wholeServiceSelected 
                            ? "All Services" 
                            : `${services.filter(s => s.id).length} Selected`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min Order Value:</span>
                        <span className="font-medium">₹{minimumOrderValue || 0}</span>
                      </div>
                      {discount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-medium text-green-600">
                            {discount}{discountType === "percentage" ? "%" : "₹"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!membershipName.trim() || !validity || !price || !minimumOrderValue}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                      !membershipName.trim() || !validity || !price || !minimumOrderValue
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow"
                    }`}
                  >
                    {app ? "Update Membership Type" : "Create Membership Type"}
                  </button>

                  {/* Mobile Action Buttons */}
                  {isMobile && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          handleSubmit();
                          setShowMobileSidebar(false);
                        }}
                        disabled={!membershipName.trim() || !validity || !price || !minimumOrderValue}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
                          !membershipName.trim() || !validity || !price || !minimumOrderValue
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                        }`}
                      >
                        {app ? "Update" : "Create"}
                      </button>
                      <button
                        onClick={() => setShowMobileSidebar(false)}
                        className="flex-1 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Status Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-4 lg:px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-900">Validation Status</h3>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      {membershipName.trim() ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">Membership Name</span>
                    </div>
                    <div className="flex items-center">
                      {validity > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">Validity Period</span>
                    </div>
                    <div className="flex items-center">
                      {price > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">Price</span>
                    </div>
                    <div className="flex items-center">
                      {minimumOrderValue > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">Minimum Order Value</span>
                    </div>
                    <div className="flex items-center">
                      {wholeServiceSelected || services.every(s => s.id) ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">Services Selection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Dropdown Modal - This will be rendered outside the normal flow */}
      {showServicesDropdown !== null && (
        <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setShowServicesDropdown(null);
              setSearchQuery("");
            }}
            style={{ pointerEvents: "auto" }}
          />
          
          {/* Dropdown positioned near the button */}
          <div 
            ref={dropdownRef}
            className="absolute bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              width: "90vw",
              maxWidth: "400px"
            }}
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Services List */}
            <div className="overflow-y-auto max-h-64">
              {serviceLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Loading services...</p>
                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => {
                      const newServices = [...services];
                      newServices[showServicesDropdown] = svc;
                      setServices(newServices);
                      setShowServicesDropdown(null);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      services[showServicesDropdown]?.id === svc.id ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center truncate">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></div>
                        <span className="font-medium truncate text-sm">{svc.service_name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                        {svc.gender}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4 truncate">
                      Duration: {formatTime(svc.service_time)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No services found</p>
                  {searchTerm && (
                    <p className="text-xs mt-1">No results for "{searchTerm}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowServicesDropdown(null);
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quill CSS */}
      <style jsx global>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: #d1d5db !important;
          background-color: #f9fafb;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: #d1d5db !important;
          min-height: 120px;
        }
        .ql-editor {
          min-height: 120px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        @media (min-width: 1024px) {
          .ql-container {
            min-height: 150px;
          }
          .ql-editor {
            min-height: 150px;
          }
        }
        
        /* Better touch targets for mobile */
        @media (max-width: 640px) {
          input, button, select, textarea {
            font-size: 16px !important; /* Prevents iOS zoom */
          }
          
          .ql-toolbar .ql-formats {
            margin-right: 4px;
          }
          
          .ql-toolbar button {
            padding: 6px;
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
};

export default CreateMembershipType;