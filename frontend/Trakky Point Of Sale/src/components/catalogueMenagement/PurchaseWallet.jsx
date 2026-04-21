import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { Close } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Settings, CheckCircle, Trash2, Plus, Search } from "lucide-react";

const PurchaseWallet = ({ wallet = null, onClose = null, isEdit = false }) => {
  const editorRef = useRef(null);
  const { authTokens, vendorData } = useContext(AuthContext);
  const [customerData, setCustomerData] = useState(null);
  const quillRef = useRef(null);
  const [vendorSettings, setVendorSettings] = useState({
    Wallet_is_gst: false,
    Wallet_tax_amount: null,
    Wallet_tax_percent: null,
  });

  // Services state
  const [wholeServiceSelected, setWholeServiceSelected] = useState(false);
  const [services, setServices] = useState([]); // Start empty - no mandatory service
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(null);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const defaultEmptyService = {
    id: "",
    service_name: "",
    service_time: null,
    gender: "",
  };

  // Filtered services for modal
  const filteredServices = tempAllServices.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a service is already selected
  const isServiceSelected = (serviceId) => {
    return services.some(service => service.id === serviceId);
  };

  // Fetch all services recursively
  const fetchAllServices = async (currentPage = 1) => {
    setServiceLoading(true);
    if (!vendorData?.salon) return;
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=${currentPage}&salon_id=${vendorData?.salon}`,
        {}
      );
      const data = await response.json();
      if (response.ok) {
        let serviceList = data.results || data;
        let reducedData = serviceList.map((service) => {
          return {
            id: service?.id,
            service_name: service?.service_name,
            service_time: service?.service_time,
            gender: service?.gender,
          };
        });
        if (currentPage === 1) {
          setTempAllServices(reducedData);
        } else {
          setTempAllServices((prev) => [...prev, ...reducedData]);
        }
        if (data?.next) {
          await fetchAllServices(currentPage + 1);
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

  // Open modal for selecting service
  const openServiceModal = (index) => {
    setCurrentSelectingIndex(index);
    setShowServicesModal(true);
  };

  // Select a service
  const selectService = (service) => {
    const newServices = [...services];
    newServices[currentSelectingIndex] = {
      id: service.id,
      service_name: service.service_name,
      service_time: service.service_time,
      gender: service.gender,
    };
    setServices(newServices);
    setShowServicesModal(false);
    setCurrentSelectingIndex(null);
    setSearchTerm("");
  };

  // Add a new empty service slot
  const addServiceSlot = () => {
    setServices([...services, defaultEmptyService]);
  };

  // Remove a service slot (any one, including first)
  const removeServiceSlot = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  // Helper function to format date to dd-mm-yyyy
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Helper function to format date to yyyy-mm-dd
  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  // Set today's date in dd-mm-yyyy format
  const today = new Date();
  const defaultStartDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    gender: "",
    wallet_name: "",
    purchase_price: "",
    discount_type: "none",
    discount_percentage: "",
    purchase_discounted_price: "",
    total_price_benefits: "",
    remaining_price_benefits: "",
    amount_paid: "",
    remaining_amount_to_paid: "",
    Start_date: defaultStartDate,
    end_date: "",
    terms_and_conditions: "",
    wallet_is_gst: false,
    tax_type: "none",
    wallet_tax_amount: "",
    wallet_tax_percent: "",
    status: "Inactive",
    wallet_image: null,
    calculated_total: "0",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch vendor settings
  const fetchVendorSettings = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    try {
      const response = await axios.get(
        `https://backendapi.trakky.in//salonvendor/vendor-pos/${vendorData.id}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      setVendorSettings({
        Wallet_is_gst: response.data.Wallet_is_gst || false,
        Wallet_tax_amount: response.data.Wallet_tax_amount || null,
        Wallet_tax_percent: response.data.Wallet_tax_percent || null,
      });
    } catch (error) {
      console.error("Error fetching vendor settings:", error);
    }
  };

  useEffect(() => {
    fetchVendorSettings();
  }, []);

  useEffect(() => {
    fetchAllServices();
  }, [vendorData?.salon]);

  const fetchCustomerByPhone = async (phoneNumber) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    if (!phoneNumber) {
      setCustomerData(null);
      return;
    }

    try {
      const response = await axios.get(
        `https://backendapi.trakky.in//salonvendor/customer-table/?customer_phone=${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (response.data.count > 0 && response.data.results.length > 0) {
        const customer = response.data.results[0];
        setCustomerData(customer);
        setFormData((prev) => ({
          ...prev,
          customer_name: customer.customer_name || "",
          gender: customer.customer_gender || "",
        }));
      } else {
        setCustomerData(null);
        setFormData((prev) => ({
          ...prev,
          customer_name: "",
          gender: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      setCustomerData(null);
    }
  };

  const createCustomerIfNotExists = async () => {
    if (customerData) {
      return true;
    }

    try {
      const newCustomerData = {
        customer_phone: formData.customer_phone,
        customer_name: formData.customer_name || "",
        customer_gender: formData.gender || "",
        customer_type: "new",
      };

      const response = await axios.post(
        "https://backendapi.trakky.in//salonvendor/customer-table/",
        newCustomerData,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      console.log("New customer created successfully");
      return true;
    } catch (error) {
      console.error("Error creating customer:", error);
      setMessage("Error creating customer. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    if (isEdit && wallet) {
      const initialData = {
        customer_name: wallet.customer_name || "",
        customer_phone: wallet.customer_phone || "",
        gender: wallet.Customer_gender || "",
        wallet_name: wallet.wallet_name || "",
        purchase_price: wallet.purchase_price || "",
        discount_type: wallet.discount_percentage
          ? "percentage"
          : wallet.purchase_discounted_price
            ? "fixed"
            : "none",
        discount_percentage: wallet.discount_percentage || "",
        purchase_discounted_price: wallet.purchase_discounted_price || "",
        total_price_benefits: wallet.total_price_benefits || "",
        remaining_price_benefits: wallet.remaining_price_benefits || "",
        amount_paid: wallet.amount_paid || "",
        remaining_amount_to_paid: wallet.remaining_amount_to_paid || "",
        Start_date: wallet.Start_date
          ? formatToDDMMYYYY(wallet.Start_date.split("T")[0])
          : defaultStartDate,
        end_date: wallet.end_date ? formatToDDMMYYYY(wallet.end_date.split("T")[0]) : "",
        terms_and_conditions: wallet.terms_and_conditions || "",
        wallet_is_gst: wallet.wallet_is_gst || false,
        tax_type: wallet.wallet_tax_percent
          ? "percentage"
          : wallet.wallet_tax_amount
            ? "fixed"
            : "none",
        wallet_tax_amount: wallet.wallet_tax_amount || "",
        wallet_tax_percent: wallet.wallet_tax_percent || "",
        status: wallet.status || "Inactive",
        wallet_image: null,
        calculated_total: "0",
      };

      setFormData(initialData);

      // Handle services for edit
      if (wallet.Benefits) {
        if (wallet.Benefits.all_services) {
          setWholeServiceSelected(true);
          setServices([]);
        } else {
          const benefitServices = Object.values(wallet.Benefits).map((benefit) => ({
            id: "",
            service_name: benefit,
            service_time: null,
            gender: "",
          }));
          setServices(benefitServices.length > 0 ? benefitServices : []);
          setWholeServiceSelected(false);
        }
      }

      setTimeout(() => {
        if (quillRef.current && initialData.terms_and_conditions) {
          quillRef.current.root.innerHTML = initialData.terms_and_conditions;
        }
      }, 100);
    } else {
      // For new wallet - start with no services
      setServices([]);
      setWholeServiceSelected(false);
    }
  }, [isEdit, wallet]);

  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill("#terms-editor", {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "bullet" }, { list: "ordered" }],
            [{ color: [] }],
          ],
        },
      });

      quillRef.current = quill;

      if (formData.terms_and_conditions) {
        quill.root.innerHTML = formData.terms_and_conditions;
      }

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        setFormData((prev) => ({
          ...prev,
          terms_and_conditions: content === "<p><br></p>" ? "" : content,
        }));
      });
    }
  }, []);

  useEffect(() => {
    if (
      quillRef.current &&
      formData.terms_and_conditions !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = formData.terms_and_conditions || "";
    }
  }, [formData.terms_and_conditions]);

  const calculateTotal = () => {
    let basePrice = parseFloat(formData.purchase_price) || 0;

    // Apply discount
    let discountedPrice = basePrice;
    if (
      formData.discount_type === "percentage" &&
      formData.discount_percentage
    ) {
      const discountPercent = parseFloat(formData.discount_percentage) || 0;
      discountedPrice = basePrice - (basePrice * discountPercent) / 100;
    } else if (
      formData.discount_type === "fixed" &&
      formData.purchase_discounted_price
    ) {
      const discountAmount =
        parseFloat(formData.purchase_discounted_price) || 0;
      discountedPrice = basePrice - discountAmount;
    }

    // Apply tax from vendor settings if wallet_is_gst is true
    let finalPrice = discountedPrice;
    if (vendorSettings.Wallet_is_gst) {
      if (vendorSettings.Wallet_tax_percent && !vendorSettings.Wallet_tax_amount) {
        const taxPercent = parseFloat(vendorSettings.Wallet_tax_percent) || 0;
        finalPrice = discountedPrice + (discountedPrice * taxPercent) / 100;
      } else if (
        vendorSettings.Wallet_tax_amount &&
        !vendorSettings.Wallet_tax_percent
      ) {
        const taxAmount = parseFloat(vendorSettings.Wallet_tax_amount) || 0;
        finalPrice = discountedPrice + taxAmount;
      }
    }

    // Update calculated total and remaining amount
    setFormData((prev) => ({
      ...prev,
      calculated_total: finalPrice.toFixed(2),
      remaining_amount_to_paid: (
        finalPrice - (parseFloat(prev.amount_paid) || 0)
      ).toFixed(2),
      wallet_is_gst: vendorSettings.Wallet_is_gst,
      tax_type: vendorSettings.Wallet_tax_percent
        ? "percentage"
        : vendorSettings.Wallet_tax_amount
          ? "fixed"
          : "none",
      wallet_tax_amount: vendorSettings.Wallet_tax_amount || "",
      wallet_tax_percent: vendorSettings.Wallet_tax_percent || "",
    }));
  };

  useEffect(() => {
    calculateTotal();
  }, [
    formData.purchase_price,
    formData.discount_type,
    formData.discount_percentage,
    formData.purchase_discounted_price,
    formData.amount_paid,
    vendorSettings,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "date") {
      if (value) {
        const [year, month, day] = value.split("-");
        const formattedDate = `${day}-${month}-${year}`;
        setFormData((prev) => ({
          ...prev,
          [name]: formattedDate,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "customer_phone" && value.length >= 10 && !isEdit) {
        fetchCustomerByPhone(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let branchId = localStorage.getItem("branchId") || "";
    try {
      if (!isEdit) {
        await createCustomerIfNotExists();
      }

      const submitData = new FormData();



      // Calculate discounted price
      let purchaseDiscountedPrice = 0;
      if (formData.discount_type === "fixed" && formData.purchase_discounted_price) {
        purchaseDiscountedPrice = Math.round(parseFloat(formData.purchase_discounted_price) || 0);
      } else if (formData.discount_type === "percentage" && formData.discount_percentage) {
        const basePrice = parseFloat(formData.purchase_price) || 0;
        const discountPercent = parseFloat(formData.discount_percentage) || 0;
        const discountAmount = (basePrice * discountPercent) / 100;
        purchaseDiscountedPrice = Math.round(basePrice - discountAmount);
      }

      // Handle benefits - only send Selected Service's (with id)
      let benefitsData = {};
      if (wholeServiceSelected) {
        benefitsData = { all_services: true };
      } else if (services.length > 0) {
        benefitsData = services.reduce((acc, service, index) => {
          if (service.id && service.service_name) {
            acc[index + 1] = `${service.service_name} (${service.gender})`;
          }
          return acc;
        }, {});
      }

      // Format dates
      const startDateISO = formData.Start_date ? formatToYYYYMMDD(formData.Start_date) : "";
      const endDateISO = formData.end_date ? formatToYYYYMMDD(formData.end_date) : "";

      const amountPaidInteger = Math.round(parseFloat(formData.amount_paid) || 0);

      const apiData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        Customer_gender: formData.gender,
        wallet_name: formData.wallet_name,
        purchase_price: formData.purchase_price,
        discount_percentage:
          formData.discount_type === "percentage"
            ? formData.discount_percentage
            : "",
        purchase_discounted_price: purchaseDiscountedPrice,
        total_price_benefits: formData.total_price_benefits ? Math.round(parseFloat(formData.total_price_benefits)) : 0,
        remaining_price_benefits: formData.remaining_price_benefits ? Math.round(parseFloat(formData.remaining_price_benefits)) : 0,
        amount_paid: amountPaidInteger,
        remaining_amount_to_paid: Math.round(parseFloat(formData.remaining_amount_to_paid) || 0),
        Start_date: startDateISO,
        end_date: endDateISO,
        Benefits: benefitsData,
        terms_and_conditions: formData.terms_and_conditions,
        wallet_is_gst: vendorSettings.Wallet_is_gst,
        wallet_tax_amount: vendorSettings.Wallet_tax_amount || "",
        wallet_tax_percent: vendorSettings.Wallet_tax_percent || "",
        status: formData.status,
        // branchId: branchId,
      };

      Object.keys(apiData).forEach((key) => {
        if (
          apiData[key] !== null &&
          apiData[key] !== "" &&
          apiData[key] !== undefined
        ) {
          if (key === "Benefits" && typeof apiData[key] === "object") {
            submitData.append(key, JSON.stringify(apiData[key]));
          } else {
            submitData.append(key, apiData[key]);
          }
        }
      });

      if (formData.wallet_image) {
        submitData.append("wallet_image", formData.wallet_image);
      }

      let response;
      if (isEdit && wallet) {
        response = await axios.patch(
          `https://backendapi.trakky.in//salonvendor/wallets/${wallet.id}/`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        toast.success("Wallet updated successfully!");
        setMessage("Wallet updated successfully!");
      } else {
        response = await axios.post(
          "https://backendapi.trakky.in//salonvendor/wallets/",
          submitData,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
        toast.success("Wallet created successfully!");
        setMessage("Wallet created successfully!");
      }

      if (!isEdit) {
        setFormData({
          customer_name: "",
          customer_phone: "",
          gender: "",
          wallet_name: "",
          purchase_price: "",
          discount_type: "none",
          discount_percentage: "",
          purchase_discounted_price: "",
          total_price_benefits: "",
          remaining_price_benefits: "",
          amount_paid: "",
          remaining_amount_to_paid: "",
          Start_date: defaultStartDate,
          end_date: "",
          terms_and_conditions: "",
          wallet_is_gst: vendorSettings.Wallet_is_gst,
          tax_type: vendorSettings.Wallet_tax_percent
            ? "percentage"
            : vendorSettings.Wallet_tax_amount
              ? "fixed"
              : "none",
          wallet_tax_amount: vendorSettings.Wallet_tax_amount || "",
          wallet_tax_percent: vendorSettings.Wallet_tax_percent || "",
          status: "Inactive",
          wallet_image: null,
          calculated_total: "0",
        });

        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }

        setCustomerData(null);
        setServices([]);
        setWholeServiceSelected(false);
      }

      if (isEdit && onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating/updating wallet:", error);

      let errorMessage = "Error processing wallet. Please try again.";

      if (error.response && error.response.data) {
        const data = error.response.data;

        if (typeof data === "object" && !Array.isArray(data)) {
          const firstErrorField = Object.keys(data)[0];
          const firstErrorMessages = data[firstErrorField];

          if (Array.isArray(firstErrorMessages)) {
            errorMessage = firstErrorMessages[0];
          } else if (typeof firstErrorMessages === "string") {
            errorMessage = firstErrorMessages;
          }
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors[0];
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      }

      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className={`${!isEdit ? "min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-4" : ""
          }`}
      >
        <div className={`${isEdit ? "p-1" : "mx-auto"}`}>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {isEdit && (
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Edit Wallet</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {message && (
                <div
                  className={`p-4 rounded-md ${message.includes("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                    }`}
                >
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Phone Number
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="10-digit phone number"
                  />

                  {!isEdit && formData.customer_phone.length >= 10 && (
                    <div className="mt-1 text-sm">
                      {customerData ? (
                        <span className="text-green-600">
                          Existing customer
                        </span>
                      ) : (
                        <span className="text-blue-600">
                          New customer will be created on form submission
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    name="wallet_name"
                    value={formData.wallet_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter wallet name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter purchase price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="none">No Discount</option>
                    <option value="percentage">Discount Percentage</option>
                    <option value="fixed">Discount Amount</option>
                  </select>
                </div>
                {formData.discount_type === "percentage" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter discount percentage"
                    />
                  </div>
                )}
                {formData.discount_type === "fixed" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      name="purchase_discounted_price"
                      value={formData.purchase_discounted_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter discount amount"
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="wallet_is_gst"
                    checked={formData.wallet_is_gst}
                    onChange={handleChange}
                    disabled={!vendorSettings.Wallet_is_gst}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Include GST
                  </label>
                </div>
                {formData.wallet_is_gst && vendorSettings.Wallet_is_gst && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Type
                    </label>
                    <select
                      name="tax_type"
                      value={formData.tax_type}
                      onChange={handleChange}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                      <option value="none">No Tax</option>
                      <option value="percentage">Tax Percentage</option>
                      <option value="fixed">Tax Amount</option>
                    </select>
                  </div>
                )}
                {formData.wallet_is_gst &&
                  vendorSettings.Wallet_is_gst &&
                  formData.tax_type === "percentage" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Percentage
                      </label>
                      <input
                        type="number"
                        name="wallet_tax_percent"
                        value={formData.wallet_tax_percent}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        placeholder="Tax percentage from settings"
                      />
                    </div>
                  )}
                {formData.wallet_is_gst &&
                  vendorSettings.Wallet_is_gst &&
                  formData.tax_type === "fixed" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Amount
                      </label>
                      <input
                        type="number"
                        name="wallet_tax_amount"
                        value={formData.wallet_tax_amount}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        placeholder="Tax amount from settings"
                      />
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <input
                    type="text"
                    value={`₹${formData.calculated_total}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    name="amount_paid"
                    value={formData.amount_paid}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter amount paid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remaining Amount
                  </label>
                  <input
                    type="text"
                    value={`₹${formData.remaining_amount_to_paid}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Price Benefits
                  </label>
                  <input
                    type="number"
                    name="total_price_benefits"
                    value={formData.total_price_benefits}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter total benefits value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remaining Price Benefits
                  </label>
                  <input
                    type="number"
                    name="remaining_price_benefits"
                    value={formData.remaining_price_benefits}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter remaining benefits value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={
                      formData.Start_date
                        ? new Date(formatToYYYYMMDD(formData.Start_date))
                        : null
                    }
                    onChange={(date) => {
                      const formattedDate = date
                        ? `${String(date.getDate()).padStart(2, "0")}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${date.getFullYear()}`
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        Start_date: formattedDate,
                      }));
                    }}
                    dateFormat="dd-MM-yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholderText="Select start date (dd-mm-yyyy)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={
                      formData.end_date
                        ? new Date(formatToYYYYMMDD(formData.end_date))
                        : null
                    }
                    onChange={(date) => {
                      const formattedDate = date
                        ? `${String(date.getDate()).padStart(2, "0")}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${date.getFullYear()}`
                        : "";
                      setFormData((prev) => ({
                        ...prev,
                        end_date: formattedDate,
                      }));
                    }}
                    dateFormat="dd-MM-yyyy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholderText="Select end date (dd-mm-yyyy)"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              {/* Services Selection Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                     
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Included Services</h2>
                        <p className="text-sm text-gray-500">Select services included in this membership</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={wholeServiceSelected}
                            onChange={(e) => {
                              setWholeServiceSelected(e.target.checked);
                              if (e.target.checked) {
                                setServices([]);
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
                <div className="p-6">
                  {!wholeServiceSelected ? (
                    <>
                      {services.map((service, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service {index + 1}
                              </label>
                              <button
                                type="button"
                                onClick={() => openServiceModal(index)}
                                className={`w-full px-4 py-3 border ${
                                  service.id ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
                                } rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200`}
                              >
                                <div>
                                  {service.id ? (
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                                      <span className="font-medium">{service.service_name}</span>
                                      <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                        {service.gender}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select service</span>
                                  )}
                                </div>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeServiceSlot(index)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={addServiceSlot}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Service</span>
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
                            This membership includes all available services. Customers will have access to every service in your catalog.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <div
                  id="terms-editor"
                  ref={editorRef}
                  className="h-32 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Image
                </label>
                <input
                  type="file"
                  name="wallet_image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4">
                {isEdit && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isEdit ? "Update Wallet" : "Create Wallet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Services Selection Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {serviceLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading services...</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No services found</div>
                    ) : (
                      filteredServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => selectService(service)}
                          disabled={isServiceSelected(service.id) && currentSelectingIndex !== null && services[currentSelectingIndex]?.id !== service.id}
                          className={`w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-0 flex justify-between items-center ${
                            isServiceSelected(service.id) && currentSelectingIndex !== null && services[currentSelectingIndex]?.id !== service.id
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{service.service_name}</div>
                            <div className="text-sm text-gray-500">{service.gender}</div>
                          </div>
                          {isServiceSelected(service.id) && currentSelectingIndex !== null && services[currentSelectingIndex]?.id !== service.id && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                              Selected
                            </span>
                          )}
                          {services[currentSelectingIndex]?.id === service.id && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Currently Selecting
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowServicesModal(false);
                    setCurrentSelectingIndex(null);
                    setSearchTerm("");
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseWallet;