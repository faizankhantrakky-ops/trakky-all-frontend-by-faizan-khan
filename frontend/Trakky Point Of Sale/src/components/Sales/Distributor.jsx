import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Icons
const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const BillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
);

// Stats Icons
const SupplierIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ContactIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WebsiteIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
  </svg>
);

// Bill History Component
const BillHistoryModal = ({ isOpen, onClose, supplier }) => {
  const [expandedBill, setExpandedBill] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock bill history data - replace with actual API call
  const mockBillHistory = [
    {
      id: 1,
      billNumber: "INV-001",
      date: "2024-01-15",
      amount: 1500.00,
      status: "Paid",
      items: [
        { name: "Product A", quantity: 2, price: 500 },
        { name: "Product B", quantity: 1, price: 500 }
      ],
      paymentMethod: "Bank Transfer"
    },
    {
      id: 2,
      billNumber: "INV-002",
      date: "2024-01-20",
      amount: 2300.50,
      status: "Pending",
      items: [
        { name: "Product C", quantity: 3, price: 450 },
        { name: "Product D", quantity: 2, price: 477.25 }
      ],
      paymentMethod: "Credit Card"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
    {
      id: 3,
      billNumber: "INV-003",
      date: "2024-01-25",
      amount: 1800.75,
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: 1200 },
        { name: "Product F", quantity: 2, price: 300.375 }
      ],
      paymentMethod: "Cash"
    },
  ];

  useEffect(() => {
    if (isOpen && supplier) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setBillHistory(mockBillHistory);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, supplier]);

  const toggleBillDetails = (billId) => {
    setExpandedBill(expandedBill === billId ? null : billId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#492DBD]  text-white">
            <div>
              <h2 className="text-xl font-semibold">
                Bill History - {supplier?.name}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                View and manage all bills for this supplier
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600">Loading bill history...</span>
              </div>
            ) : billHistory.length > 0 ? (
              <div className="space-y-4">
                {billHistory.map((bill) => (
                  <div key={bill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Bill Header */}
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => toggleBillDetails(bill.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <BillIcon />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{bill.billNumber}</h3>
                          <p className="text-sm text-gray-600">{bill.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{bill.amount.toFixed(2)}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          {expandedBill === bill.id ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </div>
                      </div>
                    </div>

                    {/* Bill Details */}
                    <AnimatePresence>
                      {expandedBill === bill.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-4 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Items List */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                                <div className="space-y-2">
                                  {bill.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                      <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                      </div>
                                      <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Payment Information */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium text-gray-900">{bill.paymentMethod}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-semibold text-blue-600">₹{bill.amount.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                                      {bill.status}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 mt-6">
                                  <button className="flex-1 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                    Download Invoice
                                  </button>
                                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BillIcon />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bill History</h3>
                <p className="text-gray-600">No bills found for this supplier.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {billHistory.length} bills
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors">
                Export All Bills
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Supplier = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const navigate = useNavigate();
  const tableRef = useRef(null);
  
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [editDistribution, setEditDistribution] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [suppData, setSuppData] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [billHistoryModal, setBillHistoryModal] = useState({ isOpen: false, supplier: null });
  
  // Filter states
  const [searchField, setSearchField] = useState("name");
  const [cityFilter, setCityFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState([]);
  const [stockOrderData, setStockOrderData] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    supplier_description: "",
    address: "",
    state: "",
    city: "",
    country: "",
    pincode: "",
    first_name: "",
    last_name: "",
    mobile_no: "",
    telephone: "",
    email: "",
    website: "",
    payment_information: "",
    payment_status: "due",
    bill_photo: null,
    payment_date: "",
  });

  // Safe fetch function wrapper
  const safeFetch = async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(`Error fetching data: ${error.message}`);
      return null;
    }
  };

  // Fetch stock orders with status
  const fetchStockOrderData = async () => {

             if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    try {
      const data = await safeFetch(
        "https://backendapi.trakky.in/salonvendor/stockorder/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data) {
        setStockOrderData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching stock orders:", error);
      toast.error("Failed to load stock orders");
    }
  };

  // Fetch suppliers data
  const fetchData = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    setLoading(true);
    try {
      const data = await safeFetch(
        "https://backendapi.trakky.in/salonvendor/supplier/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data) {
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => b.id - a.id)
          : [];
        setSuppData(sortedData);
        setFilterData(sortedData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    if (token) {
      fetchData();
      fetchStockOrderData();
    }
  }, [token]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...suppData];
    
    if (search) {
      filtered = filtered.filter((item) => {
        if (searchField === "name") {
          return item?.name?.toLowerCase().includes(search.toLowerCase());
        } else if (searchField === "telephone") {
          return item?.mobile_no?.toString().includes(search);
        } else if (searchField === "email") {
          return item?.email?.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      });
    }
    
    if (cityFilter !== "all") {
      filtered = filtered.filter((item) => item?.city === cityFilter);
    }
    
    if (stateFilter !== "all") {
      filtered = filtered.filter((item) => item?.state === stateFilter);
    }

    const sortedFiltered = [...filtered].sort((a, b) => b.id - a.id);
    setFilterData(sortedFiltered);

    const newActiveFilters = [];
    if (search) newActiveFilters.push(`${searchField}: ${search}`);
    if (cityFilter !== "all") newActiveFilters.push(`city: ${cityFilter}`);
    if (stateFilter !== "all") newActiveFilters.push(`state: ${stateFilter}`);
    setActiveFilters(newActiveFilters);

    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const resetFilters = () => {
    setSearch("");
    setCityFilter("all");
    setStateFilter("all");
    setSearchField("name");
    setFilterData(suppData);
    setActiveFilters([]);
    setShowFilterMenu(false);
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("city:")) {
      setCityFilter("all");
    } else if (filterToRemove.startsWith("state:")) {
      setStateFilter("all");
    } else if (
      filterToRemove.startsWith("name:") ||
      filterToRemove.startsWith("telephone:") ||
      filterToRemove.startsWith("email:")
    ) {
      setSearch("");
    }
  };

  const getUniqueValues = (field) => {
    if (!Array.isArray(suppData)) return [];
    const values = suppData.map((item) => item[field]).filter(Boolean);
    return [...new Set(values)];
  };

  // Delete supplier with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/supplier/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setFilterData((prev) => prev.filter((supplier) => supplier?.id !== id));
        toast.success("Supplier deleted successfully");
        fetchData();
      } else {
        throw new Error("Failed to delete supplier");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Modal handlers
  const handleOpen = (supplier = null) => {
    setEditDistribution(supplier);
    setActiveStep(0);
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleEdit = (supplier) => {
    if (!supplier) return;
    setEditDistribution(supplier);
    setFormData({
      name: supplier.name || "",
      supplier_description: supplier.supplier_description || "",
      address: supplier.address || "",
      state: supplier.state || "",
      city: supplier.city || "",
      country: supplier.country || "",
      pincode: supplier.pincode || "",
      first_name: supplier.first_name || "",
      last_name: supplier.last_name || "",
      mobile_no: supplier.mobile_no || "",
      telephone: supplier.telephone || "",
      email: supplier.email || "",
      website: supplier.website || "",
      payment_information: supplier.payment_information || "",
      payment_status: supplier.payment_status || "due",
      bill_photo: supplier.bill_photo || null,
      payment_date: supplier.payment_date || "",
    });
    setOpen(true);
  };

  // Bill History handlers
  const handleOpenBillHistory = (supplier) => {
    setBillHistoryModal({ isOpen: true, supplier });
  };

  const handleCloseBillHistory = () => {
    setBillHistoryModal({ isOpen: false, supplier: null });
  };

  // Form handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bill_photo: file }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      supplier_description: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      first_name: "",
      last_name: "",
      mobile_no: "",
      telephone: "",
      email: "",
      website: "",
      payment_information: "",
      payment_status: "due",
      bill_photo: null,
      payment_date: "",
    });
    setEditDistribution(null);
  };

  // Stepper configuration
  const steps = editDistribution
    ? [
        "Edit Supplier Details",
        "Edit Physical Address",
        "Edit Contact Information",
        "Edit Payment Information",
      ]
    : ["Supplier Details", "Physical Address", "Contact Information", "Payment Information"];
  
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Submit form with validation
  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Supplier name is required");
      return;
    }

    let billPhotoData = formData.bill_photo;
    if (billPhotoData instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(billPhotoData);
      billPhotoData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    }

    const payload = {
      name: formData.name,
      supplier_description: formData.supplier_description || "",
      address: formData.address || "",
      state: formData.state || "",
      city: formData.city || "",
      country: formData.country || "",
      pincode: formData.pincode || "",
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      mobile_no: formData.mobile_no || "",
      telephone: formData.telephone || "",
      email: formData.email || "",
      website: formData.website || "",
      payment_information: formData.payment_information || "",
      payment_status: formData.payment_status || "due",
      bill_photo: billPhotoData || "",
      payment_date: formData.payment_date || "",
    };

    try {
      const endpoint = editDistribution
        ? `https://backendapi.trakky.in/salonvendor/supplier/${editDistribution.id}/`
        : "https://backendapi.trakky.in/salonvendor/supplier/";
      
      const method = editDistribution ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editDistribution ? "Supplier updated" : "Supplier added");
        setOpen(false);
        fetchData();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Get status from stock orders
  const getSupplierStatus = (supplierId) => {
    const orders = stockOrderData.filter(
      (order) => order?.product_data?.supplier_data?.id === supplierId
    );
    if (orders.length === 0) return null;
    const latestOrder = orders.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];
    return latestOrder?.status || "unknown";
  };

  const getStatusChip = (status) => {
    if (!status) return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        No Order
      </span>
    );
    
    const statusLower = status.toLowerCase();
    let className = "inline-flex px-2 py-1 text-xs font-semibold rounded-full ";
    
    if (statusLower.includes("on-going") || statusLower === "pending") {
      className += "bg-yellow-100 text-yellow-800";
    } else if (statusLower.includes("completed") || statusLower === "delivered") {
      className += "bg-green-100 text-green-800";
    } else if (statusLower.includes("cancelled") || statusLower === "failed") {
      className += "bg-red-100 text-red-800";
    } else {
      className += "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={className}>
        {status.replace(/-/g, " ").toUpperCase()}
      </span>
    );
  };

  const getPaymentStatusChip = (status) => {
    const statusLower = (status || "due").toLowerCase();
    const className = statusLower === "paid" 
      ? "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
      : "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
    
    return (
      <span className={className}>
        {statusLower.toUpperCase()}
      </span>
    );
  };

  // Stats data
  const stats = [
    {
      title: "Total Suppliers",
      value: Array.isArray(filterData) ? filterData.length : 0,
      change: "+8%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <SupplierIcon />
    },
    {
      title: "Active Contacts",
      value: Array.isArray(filterData) && filterData.length > 0
        ? filterData.filter((item) => item?.mobile_no || item?.telephone).length
        : 0,
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <ContactIcon />
    },
    {
      title: "Suppliers with Email",
      value: Array.isArray(filterData)
        ? filterData.filter((item) => item?.email).length
        : 0,
      change: "+12%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <EmailIcon />
    },
    {
      title: "Suppliers with Website",
      value: Array.isArray(filterData)
        ? filterData.filter((item) => item?.website).length
        : 0,
      change: "+3%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <WebsiteIcon />
    },
  ];

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Supplier Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Description
                </label>
                <textarea
                  name="supplier_description"
                  value={formData.supplier_description}
                  onChange={handleChange}
                  placeholder="Enter Supplier Description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter Pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  placeholder="Enter Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  maxLength="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Mobile Number
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Enter Alternate Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail (Optinal)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter  (Optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter Website (Optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Information
              </label>
              <textarea
                name="payment_information"
                value={formData.payment_information}
                onChange={handleChange}
                placeholder="Enter payment details"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            
            {editDistribution && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                
                {formData.bill_photo && typeof formData.bill_photo === "string" && (
                  <div className="mt-2">
                    <img
                      src={formData.bill_photo}
                      alt="Bill Photo"
                      className="max-w-[200px] rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              Supplier Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Your Suppliers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={`Search by ${searchField.replace("_", " ")}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FilterIcon />
                Filters
              </button>

              {/* Filter Menu */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter Options</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search Field
                      </label>
                      <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="name">Name</option>
                        <option value="telephone">Mobile Number</option>
                        <option value="email">Email</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">All Cities</option>
                        {getUniqueValues("city").map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">All States</option>
                        {getUniqueValues("state").map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={applyFilters}
                        className="flex-1 px-3 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Apply
                      </button>
                      <button
                        onClick={resetFilters}
                        className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpen(null)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <AddIcon />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="text-[#492DBD] hover:text-purple-800"
                >
                  <CloseIcon />
                </button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
  <div className="grid grid-cols-4 gap-2 mb-5">
  {stats.map((stat, index) => (
    <motion.div
      key={index}
      className={`${stat.color} rounded-md p-3 py-6 text-white relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">{stat.title}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
        <div className="p-1 bg-white bg-opacity-20 rounded">
          {React.cloneElement(stat.icon, { className: "w-4 h-4" })}
        </div>
      </div>
    </motion.div>
  ))}
</div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Supplier",
                  "Description",
                  "Contact Person",
                  "Mobile",
                  "Email ",
                  "Location",
                  "Status",
                  "Payment Status",
                  "Payment Date",
                  "Bill Photo",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-gray-600">Loading suppliers...</span>
                    </div>
                  </td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData.map((item) => {
                  const status = getSupplierStatus(item.id);
                  return (
                    <tr key={item?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-[#492DBD] font-semibold">
                            {item?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item?.website || "No website"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {item?.supplier_description?.substring(0, 50) || "-"}
                        {item?.supplier_description?.length > 50 ? "..." : ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.first_name || "-"} {item?.last_name || ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.mobile_no || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {[item?.city, item?.state].filter(Boolean).join(", ") || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusChip(status)}
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentStatusChip(item?.payment_status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item?.payment_date || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {item?.bill_photo ? (
                          <img
                            src={item.bill_photo}
                            alt="Bill"
                            className="h-10 w-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-[#492DBD] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleOpenBillHistory(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Bill History"
                          >
                            <BillIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(item?.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editDistribution ? "Edit Supplier" : "Add New Supplier"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Stepper */}
              <div className="px-6 pt-6 mb-6">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= activeStep
                            ? "bg-[#492DBD] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          index <= activeStep ? "text-[#492DBD]" : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-12 h-0.5 mx-4 ${
                            index < activeStep ? "bg-[#492DBD]" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {renderStepContent(activeStep)}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    activeStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Back
                </button>

                {activeStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editDistribution ? "Update Supplier" : "Create Supplier"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bill History Modal */}
      <BillHistoryModal
        isOpen={billHistoryModal.isOpen}
        onClose={handleCloseBillHistory}
        supplier={billHistoryModal.supplier}
      />
    </div>
  );
};

export default Supplier;