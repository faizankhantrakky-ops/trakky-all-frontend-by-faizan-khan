import React, { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../../Context/Auth";
import {
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  CreditCard,
  FileText,
  Percent,
  IndianRupee,
  Calendar as CalendarIcon,
  Menu,
  X,
  ChevronLeft,
  Phone,
  Tag,
  DollarSign,
  Users,
  Gift,
  Star
} from "lucide-react";
import dayjs from "dayjs";

const CreateCustomerMembership = ({ app, onClose, open }) => {
  const editorRef = useRef(null);
  const quillInitialized = useRef(false);
  const { vendorData, authTokens, user } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState("details");

  const [customerName, setCustomerName] = useState(app?.customer_name || "");
  const [customerNumber, setCustomerNumber] = useState(
    app?.customer_number || ""
  );
  const [membershipCode, setMembershipCode] = useState(
    app?.membership_code || ""
  );
  const [basePrice, setBasePrice] = useState(app?.original_price || 0);
  const [priceWithTax, setPriceWithTax] = useState(app?.membership_price || "");
  const [amountPaid, setAmountPaid] = useState(app?.amount_paid || "");
  const [remainingAmount, setRemainingAmount] = useState(() => {
    if (!app) return 0;
    if (app.pending_price !== undefined) return app.pending_price;
    return app.membership_price - app.amount_paid || 0;
  });
  const [branchName, setBranchName] = useState(app?.branch_name || "");
  const [selectedManager, setSelectedManager] = useState(app?.manager || "");
  const [managerData, setManagerData] = useState([]);
  const [membershipTypeData, setMembershipTypeData] = useState([]);
  const [mTLoading, setMTLoading] = useState(true);
  const [selectedMembershipType, setSelectedMembershipType] = useState(
    app?.membership_data || ""
  );
  const [taxAmount, setTaxAmount] = useState(app?.tax_amount || 0);
  const [includeGst, setIncludeGst] = useState(app?.include_gst || false);
  const [startDateTime, setStartDateTime] = useState(
    app?.membership_start_date ? dayjs(app.membership_start_date) : dayjs()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedHour, setSelectedHour] = useState(dayjs().hour());
  const [selectedMinute, setSelectedMinute] = useState(dayjs().minute());
  const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);
  const [showMobileTimePicker, setShowMobileTimePicker] = useState(false);
  
  // Modal states for dropdowns
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  
  // New state for family members usage
  const [familyMembersAllowed, setFamilyMembersAllowed] = useState(app?.family_members_allowed || 1);
  
  // New state for membership benefits
  const [membershipBenefits, setMembershipBenefits] = useState(app?.membership_benefits || "");

  // Predefined benefits options
  const benefitOptions = [
    { id: 1, label: "Birthday Discount - 10% off on services", value: "birthday_10" },
    { id: 6, label: "Anniversary Discount - 20% off on services", value: "anniversary_20" },
    { id: 8, label: "Festival Special - 10% extra discount", value: "festival_10" },
    { id: 10, label: "Referral Bonus - 10% discount on next visit", value: "referral_10" },
    { id: 14, label: "Double Points on Anniversary Month", value: "double_points_anniversary" },
  ];

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Vendor Data including central_payment_method
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const fetchVendorData = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch vendor data");
        const jsonData = await response.json();

        const activeMethods =
          jsonData.central_payment_method?.filter(
            (method) => method.status === "Active"
          ) || [];

        setPaymentMethods(activeMethods);

        if (app?.payment_method) {
          const matched = activeMethods.find(
            (m) =>
              m.name === app.payment_method ||
              m.associated_id === app.payment_method_id
          );
          setSelectedPaymentMethod(matched?.name || "");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to load payment methods");
      }
    };

    if (user?.user_id) {
      fetchVendorData();
    }
  }, [user?.user_id, app]);

  // Calculate tax based on global settings and checkbox state
  const calculateTax = () => {
    if (selectedMembershipType) {
      const base = selectedMembershipType.price;
      setBasePrice(base);

      if (includeGst && vendorData?.membership_is_gst) {
        let gstAmount = 0;

        if (vendorData.membership_tax_percent) {
          gstAmount =
            (Number(base) * Number(vendorData.membership_tax_percent)) / 100;
          setTaxAmount(gstAmount);
          setPriceWithTax(Number(base) + Number(gstAmount));
        } else if (vendorData.membership_tax_amount) {
          gstAmount = Number(vendorData.membership_tax_amount);
          setTaxAmount(gstAmount);
          setPriceWithTax(Number(base) + Number(gstAmount));
        } else {
          setTaxAmount(0);
          setPriceWithTax(base);
        }
      } else {
        setTaxAmount(0);
        setPriceWithTax(base);
      }
    }
  };

  useEffect(() => {
    calculateTax();
  }, [selectedMembershipType, vendorData, includeGst]);

  const handleGstChange = (e) => {
    const isChecked = e.target.checked;
    setIncludeGst(isChecked);

    if (isChecked && !vendorData?.membership_is_gst) {
      toast.warning(
        "Membership GST is not enabled in your global tax settings."
      );
    }
  };

  // Initialize Quill editor - fixed approach
  useEffect(() => {
    const initQuill = async () => {
      if (quillInitialized.current) return;

      try {
        // Dynamic import to avoid SSR issues
        const Quill = (await import("quill")).default;

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

          // Set initial content if editing
          if (app && editorRef.current) {
            setTimeout(() => {
              if (editorRef.current && app.terms_and_conditions) {
                editorRef.current.root.innerHTML = app.terms_and_conditions;
              }
            }, 100);
          }

          // Set terms from selected membership type
          if (selectedMembershipType && editorRef.current) {
            editorRef.current.root.innerHTML =
              selectedMembershipType?.term_and_conditions || "";
          }

          quillInitialized.current = true;
        }
      } catch (error) {
        console.error("Failed to load Quill:", error);
      }
    };

    if (open) {
      initQuill();
    }

    return () => {
      quillInitialized.current = false;
    };
  }, [open, app, selectedMembershipType]);

  useEffect(() => {
    if (app?.membership_data && membershipTypeData.length > 0) {
      const foundMembership = membershipTypeData.find(
        (type) => type.id === app.membership_data.id
      );
      if (foundMembership) {
        setSelectedMembershipType(foundMembership);
      }
    }
  }, [app, membershipTypeData]);

  useEffect(() => {
    if (app) {
      setIncludeGst(app.include_gst || false);
      if (app.tax_amount) setTaxAmount(app.tax_amount);
      if (app.family_members_allowed) setFamilyMembersAllowed(app.family_members_allowed);
      if (app.membership_benefits) setMembershipBenefits(app.membership_benefits);
    }
  }, [app]);

  useEffect(() => {
    const price = parseFloat(priceWithTax) || 0;
    const paid = parseFloat(amountPaid) || 0;
    const remaining = price - paid;
    setRemainingAmount(remaining > 0 ? remaining : 0);
  }, [priceWithTax, amountPaid]);

  const fetchMembershipTypes = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    setMTLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/memberships/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) setMembershipTypeData(data);
      else toast.error("Failed to load membership types");
    } catch (error) {
      toast.error("Error loading membership types");
    } finally {
      setMTLoading(false);
    }
  };

  const fetchManagers = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/manager/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const activeManagers = data.filter((manager) => !manager.leave_date);
        setManagerData(activeManagers);
      } else {
        toast.error("Failed to load managers");
      }
    } catch (error) {
      toast.error("Error loading managers");
    }
  };

  useEffect(() => {
    fetchMembershipTypes();
    fetchManagers();
  }, []);

  const getMembershipCode = async () => {
    const response = await fetch(
      "https://backendapi.trakky.in/salonvendor/membershipcodegenerator/"
    );
    if (response.ok) {
      const data = await response.json();
      setMembershipCode(data.membership_code);
    }
  };

  useEffect(() => {
    if (!app) getMembershipCode();
  }, []);

  const htmlToPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const sendWhatsAppMessage = async (phoneNumber, values) => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/send-whatsapp-membership/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
            values: values,
          }),
        }
      );
      if (response.ok) toast.success("WhatsApp message sent.");
      else toast.error("Failed to send WhatsApp message.");
    } catch (error) {
      toast.error("Error sending WhatsApp message.");
    }
  };

  const handleSubmit = async () => {
    if (!customerNumber) {
      toast.error("Please enter a valid 10-digit customer number");
      return;
    }
    if (customerNumber.length !== 10) {
      toast.error("Customer number must be 10 digits");
      return;
    }
    if (!selectedMembershipType) {
      toast.error("Please select a membership type");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!familyMembersAllowed || familyMembersAllowed < 1) {
      toast.error("Please select number of family members allowed");
      return;
    }
    if (!membershipBenefits) {
      toast.error("Please select membership benefits");
      return;
    }

let branchId = localStorage.getItem("branchId") || "";

    // Update startDateTime with selected time
    const finalDateTime = dayjs(startDateTime)
      .hour(selectedHour)
      .minute(selectedMinute);

    let method = app ? "PATCH" : "POST";
    let url = `https://backendapi.trakky.in/salonvendor/customer-memberships/`;
    if (app) url += `${app.id}/`;

    const formData = new FormData();
    formData.append("customer_number", customerNumber);
    formData.append("membership_type", selectedMembershipType?.id);
    formData.append("customer_name", customerName);
    formData.append("membership_code", membershipCode);
    formData.append("membership_price", priceWithTax);
    formData.append("amount_paid", amountPaid);
    formData.append("branch_name", branchName);
    formData.append("terms_and_conditions", "terms_and_conditions");
    formData.append("manager", selectedManager);
    formData.append("pending_price", remainingAmount);
    formData.append("include_gst", includeGst);
    formData.append("gst_percentage", vendorData?.membership_tax_percent || 0);
    formData.append("original_price", basePrice);
    formData.append("tax_amount", taxAmount);
    formData.append(
      "membership_start_date",
      finalDateTime.format("YYYY-MM-DD HH:mm:ss")
    );
    formData.append("payment_method", selectedPaymentMethod);
    formData.append("family_members_allowed", familyMembersAllowed);
    formData.append("membership_benefits", membershipBenefits);
    // formData.append("branchId", branchId);

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
        toast.success(app ? "Membership updated!" : "Membership created!");
        if (!app) {
          const plainTextTerms = htmlToPlainText(
            editorRef.current?.root?.innerHTML || ""
          );
          const selectedBenefit = benefitOptions.find(b => b.value === membershipBenefits);
          const values = [
            customerName,
            selectedMembershipType?.name || "",
            selectedMembershipType?.name || "",
            selectedMembershipType?.validity_in_month || "",
            priceWithTax,
            includeGst
              ? `Including ${vendorData?.membership_tax_percent || 0}% GST`
              : "Excluding GST",
            plainTextTerms,
            vendorData?.salon_name || "Salon Name",
            finalDateTime.format("DD MMMM YYYY, HH:mm"),
            selectedPaymentMethod,
            `Family Members Allowed: ${familyMembersAllowed}`,
            `Benefits: ${selectedBenefit?.label || membershipBenefits}`,
          ];
          await sendWhatsAppMessage(`91${customerNumber}`, values);
        }

        // Reset form
        if (editorRef.current) {
          editorRef.current.root.innerHTML = "";
        }
        setCustomerName("");
        setCustomerNumber("");
        setMembershipCode("");
        setBasePrice(0);
        setPriceWithTax("");
        setAmountPaid("");
        setRemainingAmount(0);
        setBranchName("");
        setSelectedManager("");
        setSelectedMembershipType("");
        setTaxAmount(0);
        setIncludeGst(false);
        setStartDateTime(dayjs());
        setSelectedHour(dayjs().hour());
        setSelectedMinute(dayjs().minute());
        setSelectedPaymentMethod("");
        setFamilyMembersAllowed(1);
        setMembershipBenefits("");

        setTimeout(() => onClose && onClose(), 500);
      } else {
        toast.error("Error: " + (data.message || response.statusText));
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  // Custom date picker functions
  const handleDateSelect = (date) => {
    const newDate = dayjs(startDateTime)
      .date(date)
      .month(dayjs(startDateTime).month())
      .year(dayjs(startDateTime).year());
    setStartDateTime(newDate);
    if (isMobile) {
      setShowMobileDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleMonthChange = (increment) => {
    setStartDateTime(dayjs(startDateTime).add(increment, "month"));
  };

  const generateMonthDays = () => {
    const daysInMonth = dayjs(startDateTime).daysInMonth();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD MMM YYYY");
  };

  const formatTime = () => {
    return `${selectedHour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")}`;
  };

  // Generate hours and minutes for time selection
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  // Family members options (1-10)
  const familyMemberOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // Mobile Navigation Tabs
  const mobileSections = [
    { id: "details", label: "Details", icon: User },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "summary", label: "Summary", icon: DollarSign },
  ];

  // Get benefit label by value
  const getBenefitLabel = (value) => {
    const benefit = benefitOptions.find(b => b.value === value);
    return benefit ? benefit.label : value;
  };

  // Close all modals
  const closeAllModals = () => {
    setShowMembershipModal(false);
    setShowFamilyModal(false);
    setShowBenefitsModal(false);
    setShowPaymentModal(false);
    setShowManagerModal(false);
  };

  return (
    <>
      <ToastContainer />
      
      <div className="w-full h-full overflow-auto bg-gray-50">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 truncate">
                    {app ? "Edit Membership" : "Create Membership"}
                  </h1>
                  <p className="text-xs text-gray-500">Configure membership</p>
                </div>
              </div>
              <button
                onClick={() => onClose && onClose()}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="mt-3 flex space-x-1 bg-gray-100 rounded-lg p-1">
              {mobileSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {app ? "Edit Membership" : "Create Customer Membership"}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="text-sm text-gray-500 truncate">
                    Changes auto-save in real-time
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={() => onClose && onClose()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !customerNumber ||
                    customerNumber.length !== 10 ||
                    !selectedMembershipType ||
                    !selectedPaymentMethod ||
                    !familyMembersAllowed ||
                    familyMembersAllowed < 1 ||
                    !membershipBenefits
                  }
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    !customerNumber ||
                    customerNumber.length !== 10 ||
                    !selectedMembershipType ||
                    !selectedPaymentMethod ||
                    !familyMembersAllowed ||
                    familyMembersAllowed < 1 ||
                    !membershipBenefits
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{app ? "Update" : "Create Membership"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="flex">
          {/* Main Content - Left Side */}
          <div className={`${isMobile ? 'w-full' : 'w-full lg:w-2/3'} ${showMobileSidebar ? 'hidden lg:block' : 'block'}`}>
            <div className="p-4 sm:p-6">
              {/* Mobile Content Switcher */}
              {isMobile ? (
                <>
                  {/* Mobile: Details Section */}
                  {activeSection === "details" && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                              <h2 className="text-base font-semibold text-gray-900 truncate">
                                Customer Details
                              </h2>
                              <p className="text-xs text-gray-500 truncate">
                                Enter customer information
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="space-y-4">
                            {/* Customer Name */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Customer Name
                              </label>
                              <input
                                type="text"
                                value={customerName}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[A-Za-z\s]*$/.test(value)) {
                                    setCustomerName(value);
                                  }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm"
                                placeholder="Enter full name"
                              />
                            </div>

                            {/* Customer Number */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Mobile Number <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="flex">
                                  <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <input
                                    type="text"
                                    value={customerNumber}
                                    onChange={(e) =>
                                      e.target.value.length <= 10 &&
                                      setCustomerNumber(
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm"
                                    placeholder="10-digit number"
                                    maxLength={10}
                                  />
                                </div>
                              </div>
                              {customerNumber && customerNumber.length !== 10 && (
                                <p className="text-xs text-red-500 flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Enter a valid 10-digit number
                                </p>
                              )}
                            </div>

                            {/* Membership Type */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Membership Type <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowMembershipModal(true)}
                                className={`w-full px-4 py-3 border ${
                                  selectedMembershipType
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-300"
                                } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm`}
                              >
                                <div className="truncate">
                                  {selectedMembershipType ? (
                                    <div className="flex items-center">
                                      <Shield className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                                      <div className="truncate">
                                        <span className="font-medium truncate block">
                                          {selectedMembershipType.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          ₹{selectedMembershipType.price} • {selectedMembershipType.validity_in_month} months
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select membership type</span>
                                  )}
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              </button>
                            </div>

                            {/* Family Members Allowed */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Family Members Allowed <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowFamilyModal(true)}
                                className={`w-full px-4 py-3 border ${
                                  familyMembersAllowed
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300"
                                } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm`}
                              >
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                                  <span className="font-medium">
                                    {familyMembersAllowed} {familyMembersAllowed === 1 ? 'Family Member' : 'Family Members'}
                                  </span>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              </button>
                            </div>

                            {/* Membership Benefits */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Membership Benefits <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowBenefitsModal(true)}
                                className={`w-full px-4 py-3 border ${
                                  membershipBenefits
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-gray-300"
                                } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm`}
                              >
                                <div className="flex items-center">
                                  <Gift className="w-4 h-4 mr-2 text-pink-600 flex-shrink-0" />
                                  <span className="font-medium truncate">
                                    {membershipBenefits ? getBenefitLabel(membershipBenefits) : 'Select benefits'}
                                  </span>
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              </button>
                            </div>

                            {/* Date & Time */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Start Date & Time <span className="text-red-500">*</span>
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowMobileDatePicker(true)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm"
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{formatDate(startDateTime)}</span>
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowMobileTimePicker(true)}
                                  className="px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm"
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{formatTime()}</span>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile: Payment Section */}
                  {activeSection === "payment" && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg">
                              <CreditCard className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">
                                Payment Details
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          {/* Payment Method */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Payment Method <span className="text-red-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPaymentModal(true)}
                              className={`w-full px-4 py-3 border ${
                                selectedPaymentMethod
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm`}
                            >
                              <div className="truncate">
                                {selectedPaymentMethod ? (
                                  <span className="font-medium">{selectedPaymentMethod}</span>
                                ) : (
                                  <span className="text-gray-500">Select payment method</span>
                                )}
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                            </button>
                          </div>

                          {/* Amount Paid */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Amount Paid
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const paid = parseFloat(val) || 0;
                                  const total = parseFloat(priceWithTax) || 0;
                                  if (paid > total) {
                                    toast.error("Cannot exceed total price");
                                    setAmountPaid(total);
                                  } else {
                                    setAmountPaid(val);
                                  }
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm"
                                placeholder="0"
                              />
                            </div>
                          </div>

                          {/* GST Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Percent className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Include GST
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeGst}
                                onChange={handleGstChange}
                                disabled={!vendorData?.membership_is_gst}
                                className="sr-only peer"
                              />
                              <div
                                className={`w-10 h-5 rounded-full peer ${
                                  includeGst ? "bg-indigo-600" : "bg-gray-300"
                                } peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                              ></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile: Summary Section */}
                  {activeSection === "summary" && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-green-50 to-green-100">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">
                                Pricing Summary
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Base Price</span>
                              <span className="font-medium">₹{basePrice}</span>
                            </div>
                            {includeGst && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">GST/Tax</span>
                                <span className="font-medium text-green-600">₹{taxAmount}</span>
                              </div>
                            )}
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-base font-medium text-gray-700">Total</span>
                                <span className="text-xl font-bold text-indigo-600">₹{priceWithTax}</span>
                              </div>
                            </div>
                          </div>

                          {/* Family Members Summary */}
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">
                                  Family Members
                                </span>
                              </div>
                              <span className="text-lg font-bold text-purple-700">
                                {familyMembersAllowed}
                              </span>
                            </div>
                          </div>

                          {/* Benefits Summary */}
                          {membershipBenefits && (
                            <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                              <div className="flex items-center">
                                <Gift className="w-4 h-4 mr-2 text-pink-600 flex-shrink-0" />
                                <div>
                                  <span className="text-sm font-medium text-pink-700 block">
                                    Benefits
                                  </span>
                                  <span className="text-xs text-pink-600">
                                    {getBenefitLabel(membershipBenefits)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Remaining Balance
                              </span>
                              <span className={`text-lg font-bold ${
                                remainingAmount > 0 ? "text-yellow-600" : "text-green-600"
                              }`}>
                                ₹{remainingAmount}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={handleSubmit}
                            disabled={
                              !customerNumber ||
                              customerNumber.length !== 10 ||
                              !selectedMembershipType ||
                              !selectedPaymentMethod ||
                              !familyMembersAllowed ||
                              familyMembersAllowed < 1 ||
                              !membershipBenefits
                            }
                            className={`w-full py-3 rounded-lg font-medium text-sm ${
                              !customerNumber ||
                              customerNumber.length !== 10 ||
                              !selectedMembershipType ||
                              !selectedPaymentMethod ||
                              !familyMembersAllowed ||
                              familyMembersAllowed < 1 ||
                              !membershipBenefits
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                            }`}
                          >
                            {app ? "Update Membership" : "Sell Membership"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Desktop Layout */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      {/* Section Header */}
                      <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                              Customer & Membership Details
                            </h2>
                            <p className="text-xs lg:text-sm text-gray-500">
                              Enter customer information and membership preferences
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="p-4 lg:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          {/* Customer Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-gray-500" />
                                Customer Name
                              </span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={customerName}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^[A-Za-z\s]*$/.test(value)) {
                                    setCustomerName(value);
                                  }
                                }}
                                className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                                placeholder="Enter full name"
                              />
                            </div>
                          </div>

                          {/* Customer Number */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1 text-gray-500" />
                                Mobile Number <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <div className="relative">
                              <div className="flex">
                                <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                                  <span className="text-gray-500 text-sm lg:text-base">+91</span>
                                </div>
                                <input
                                  type="text"
                                  value={customerNumber}
                                  onChange={(e) =>
                                    e.target.value.length <= 10 &&
                                    setCustomerNumber(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                  className="flex-1 px-4 py-2.5 lg:py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                                  placeholder="10-digit number"
                                  maxLength={10}
                                />
                              </div>
                              {customerNumber && customerNumber.length !== 10 && (
                                <p className="text-xs text-red-500 flex items-center mt-1">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Enter a valid 10-digit number
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Membership Type */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <Shield className="w-4 h-4 mr-1 text-gray-500" />
                                Membership Type <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowMembershipModal(true)}
                              className={`w-full px-4 py-2.5 lg:py-3 border ${
                                selectedMembershipType
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                            >
                              <div className="truncate">
                                {selectedMembershipType ? (
                                  <div className="flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                                    <div className="truncate">
                                      <span className="font-medium truncate">
                                        {selectedMembershipType.name}
                                      </span>
                                      <div className="text-xs text-gray-500 truncate">
                                        ₹{selectedMembershipType.price} • {selectedMembershipType.validity_in_month} months
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Select membership type</span>
                                )}
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </button>
                          </div>

                          {/* Family Members Allowed */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-purple-500" />
                                Family Members Allowed <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowFamilyModal(true)}
                              className={`w-full px-4 py-2.5 lg:py-3 border ${
                                familyMembersAllowed
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                            >
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                                <span className="font-medium">
                                  {familyMembersAllowed} {familyMembersAllowed === 1 ? 'Family Member' : 'Family Members'}
                                </span>
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </button>
                          </div>

                          {/* Membership Benefits */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <Gift className="w-4 h-4 mr-1 text-pink-500" />
                                Membership Benefits <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowBenefitsModal(true)}
                              className={`w-full px-4 py-2.5 lg:py-3 border ${
                                membershipBenefits
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                            >
                              <div className="flex items-center">
                                <Gift className="w-4 h-4 mr-2 text-pink-600 flex-shrink-0" />
                                <span className="font-medium truncate">
                                  {membershipBenefits ? getBenefitLabel(membershipBenefits) : 'Select benefits'}
                                </span>
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            </button>
                          </div>

                          {/* Start Date & Time */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                                Start Date & Time <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowDatePicker(!showDatePicker)}
                                  className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base"
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{formatDate(startDateTime)}</span>
                                  </div>
                                </button>
                              </div>

                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowDatePicker(true);
                                    setShowMobileTimePicker(true);
                                  }}
                                  className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base"
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{formatTime()}</span>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Manager */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-gray-500" />
                                Manager
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowManagerModal(true)}
                              className={`w-full px-4 py-2.5 lg:py-3 border ${
                                selectedManager
                                  ? "border-indigo-500"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                            >
                              <div className="truncate">
                                {selectedManager ? (
                                  <span className="font-medium truncate">
                                    {managerData.find((m) => m.id === selectedManager)?.managername}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">Select manager</span>
                                )}
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                            </button>
                          </div>

                          {/* Payment Method */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-1 text-gray-500" />
                                Payment Method <span className="text-red-500 ml-1">*</span>
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPaymentModal(true)}
                              className={`w-full px-4 py-2.5 lg:py-3 border ${
                                selectedPaymentMethod
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300"
                              } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-sm lg:text-base`}
                            >
                              <div className="truncate">
                                {selectedPaymentMethod ? (
                                  <span className="font-medium">{selectedPaymentMethod}</span>
                                ) : (
                                  <span className="text-gray-500">Select payment method</span>
                                )}
                              </div>
                              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                            </button>
                          </div>

                          {/* Branch Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              <span className="flex items-center">
                                <FileText className="w-4 h-4 mr-1 text-gray-500" />
                                Branch Name
                              </span>
                            </label>
                            <input
                              type="text"
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                              placeholder="Enter branch name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Right Side (Pricing & Actions) */}
          {!isMobile && (
            <div className="hidden lg:block w-full lg:w-1/3 border-l border-gray-200">
              <div className="p-4 lg:p-6 space-y-6 h-full overflow-y-auto sticky top-24">
                {/* Pricing Summary Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-4 lg:px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <IndianRupee className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                          Pricing Summary
                        </h2>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Membership cost breakdown
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    {/* Base Price */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Base Price</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{basePrice}
                        </span>
                      </div>
                      {selectedMembershipType && (
                        <div className="text-xs text-gray-500 truncate">
                          {selectedMembershipType.name} • {selectedMembershipType.validity_in_month} months
                        </div>
                      )}
                    </div>

                    {/* Family Members Info */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Family Members
                          </span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">
                          {familyMembersAllowed}
                        </span>
                      </div>
                    </div>

                    {/* Benefits Info */}
                    {membershipBenefits && (
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-start">
                          <Gift className="w-4 h-4 mr-2 text-pink-600 mt-1 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-700 block">
                              Selected Benefits
                            </span>
                            <span className="text-xs text-pink-600">
                              {getBenefitLabel(membershipBenefits)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GST Section */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Percent className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            GST/Tax
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeGst}
                            onChange={handleGstChange}
                            disabled={!vendorData?.membership_is_gst}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-10 h-5 rounded-full peer ${
                              includeGst ? "bg-indigo-600" : "bg-gray-300"
                            } peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}
                          ></div>
                        </label>
                      </div>

                      {includeGst && vendorData?.membership_is_gst && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Tax Amount
                            </span>
                            <span className="font-medium text-green-600">
                              ₹{taxAmount}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {vendorData.membership_tax_percent}% GST applied
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total Amount */}
                    <div className="mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-indigo-700">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-indigo-700">
                            ₹{priceWithTax}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-600">
                          {includeGst ? "Including GST" : "Excluding GST"}
                        </div>
                      </div>
                    </div>

                    {/* Amount Paid */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Amount Paid
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={amountPaid}
                          onChange={(e) => {
                            const val = e.target.value;
                            const paid = parseFloat(val) || 0;
                            const total = parseFloat(priceWithTax) || 0;
                            if (paid > total) {
                              toast.error("Cannot exceed total price");
                              setAmountPaid(total);
                            } else {
                              setAmountPaid(val);
                            }
                          }}
                          className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm lg:text-base"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Remaining Amount */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Remaining Balance
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            remainingAmount > 0
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          ₹{remainingAmount}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !customerNumber ||
                        customerNumber.length !== 10 ||
                        !selectedMembershipType ||
                        !selectedPaymentMethod ||
                        !familyMembersAllowed ||
                        familyMembersAllowed < 1 ||
                        !membershipBenefits
                      }
                      className={`w-full mt-6 py-3 rounded-lg font-medium text-sm lg:text-base ${
                        !customerNumber ||
                        customerNumber.length !== 10 ||
                        !selectedMembershipType ||
                        !selectedPaymentMethod ||
                        !familyMembersAllowed ||
                        familyMembersAllowed < 1 ||
                        !membershipBenefits
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-sm hover:shadow"
                      }`}
                    >
                      {app ? "Update Membership" : "Sell Membership"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Membership Type Modal */}
      {showMembershipModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Membership Type</h3>
              <button
                onClick={() => setShowMembershipModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-80px)] p-4">
              {mTLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading...
                </div>
              ) : membershipTypeData.length > 0 ? (
                membershipTypeData.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => {
                      setSelectedMembershipType(type);
                      setShowMembershipModal(false);
                    }}
                    className={`p-4 mb-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMembershipType?.id === type.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-indigo-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-500">
                            Validity: {type.validity_in_month} months
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{type.price}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No membership types available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Family Members Modal */}
      {showFamilyModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Family Members</h3>
              <button
                onClick={() => setShowFamilyModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-80px)] p-4">
              <div className="grid grid-cols-2 gap-3">
                {familyMemberOptions.map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setFamilyMembersAllowed(num);
                      setShowFamilyModal(false);
                    }}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      familyMembersAllowed === num
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <span className="block font-medium">
                      {num} {num === 1 ? 'Member' : 'Members'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Modal */}
      {showBenefitsModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Benefits</h3>
              <button
                onClick={() => setShowBenefitsModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-80px)] p-4">
              {benefitOptions.map((benefit) => (
                <div
                  key={benefit.id}
                  onClick={() => {
                    setMembershipBenefits(benefit.value);
                    setShowBenefitsModal(false);
                  }}
                  className={`p-4 mb-2 rounded-lg border-2 cursor-pointer transition-all ${
                    membershipBenefits === benefit.value
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-3 text-pink-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{benefit.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-80px)] p-4">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div
                    key={method.associated_id}
                    onClick={() => {
                      setSelectedPaymentMethod(method.name);
                      setShowPaymentModal(false);
                    }}
                    className={`p-4 mb-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.name
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No payment methods available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manager Modal */}
      {showManagerModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Manager</h3>
              <button
                onClick={() => setShowManagerModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(80vh-80px)] p-4">
              {managerData.length > 0 ? (
                managerData.map((manager) => (
                  <div
                    key={manager.id}
                    onClick={() => {
                      setSelectedManager(manager.id);
                      setShowManagerModal(false);
                    }}
                    className={`p-4 mb-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedManager === manager.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-medium text-gray-900">{manager.managername}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No managers available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Date Picker Modal */}
      {isMobile && showMobileDatePicker && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
              <button
                onClick={() => setShowMobileDatePicker(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ‹
                </button>
                <div className="font-medium">
                  {dayjs(startDateTime).format("MMMM YYYY")}
                </div>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
                {generateMonthDays().map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`p-2 rounded text-center hover:bg-gray-100 text-sm ${
                      dayjs(startDateTime).date() === day
                        ? "bg-indigo-600 text-white"
                        : ""
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMobileDatePicker(false)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Select Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Time Picker Modal */}
      {isMobile && showMobileTimePicker && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Time</h3>
              <button
                onClick={() => setShowMobileTimePicker(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hour
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        onClick={() => setSelectedHour(hour)}
                        className={`p-3 rounded text-center text-sm ${
                          selectedHour === hour
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {hour.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minute
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        onClick={() => setSelectedMinute(minute)}
                        className={`p-3 rounded text-center text-sm ${
                          selectedMinute === minute
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowMobileTimePicker(false)}
                className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Select Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Date Picker */}
      {!isMobile && showDatePicker && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ‹
                </button>
                <div className="font-medium">
                  {dayjs(startDateTime).format("MMMM YYYY")}
                </div>
                <button
                  onClick={() => handleMonthChange(1)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
                {generateMonthDays().map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`p-2 rounded text-center hover:bg-gray-100 text-sm ${
                      dayjs(startDateTime).date() === day
                        ? "bg-indigo-600 text-white"
                        : ""
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="grid grid-cols-4 gap-2">
                      {hours.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => setSelectedHour(hour)}
                          className={`p-2 rounded text-center text-sm ${
                            selectedHour === hour
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {hour.toString().padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      {minutes.map((minute) => (
                        <button
                          key={minute}
                          onClick={() => setSelectedMinute(minute)}
                          className={`p-2 rounded text-center text-sm ${
                            selectedMinute === minute
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {minute.toString().padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Select Date & Time
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Improve touch targets on mobile */
        @media (max-width: 640px) {
          input, button, select, textarea {
            font-size: 16px !important;
            min-height: 44px;
          }
          
          .overflow-auto {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Modal z-index */
        .z-\[9999\] {
          z-index: 9999 !important;
        }
        
        /* Ensure form elements are readable on small screens */
        @media (max-width: 767px) {
          .text-sm {
            font-size: 14px !important;
          }
          
          .text-xs {
            font-size: 12px !important;
          }
          
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Truncate long text properly */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* Modal animations */
        .fixed {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default CreateCustomerMembership;