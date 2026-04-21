import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaRupeeSign, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

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

const StatusUpdateIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Checklist Icon for Products
const ChecklistIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
);

// Stats Icons
const OrdersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ValueIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const PendingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CompletedIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StockOrder = () => {
  const { authTokens, user } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const navigate = useNavigate();
  const tableRef = useRef(null);
  
  // State management
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [suppData, setSuppData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [editStockOrderData, setEditStockOrderData] = useState(null);
  const [openStockStatus, setOpenStockStatus] = useState(false);
  const [editStockStatusItem, setEditStockStatusItem] = useState(null);
  
  // New state for checklist modal
  const [openChecklistModal, setOpenChecklistModal] = useState(false);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState({});
  
  // Filter states
  const [searchField, setSearchField] = useState("product_name");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Multiple products state
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selecteSupplier, setSelectedSupplier] = useState("");
  
  const [formData, setFormData] = useState({
    expected_date: "",
    for_what: "sell",
    total_cost: 0,
  });

  const [editStockStatusFormData, setEditStockStatusFormData] = useState({
    status: "",
    payment_method: "",
    payment_status: "",
    new_expected_date: "",
    cancellation_reason: "",
    approx_payment_date: "",
  });

  // Function to open checklist modal
  const handleOpenChecklist = (order) => {
    // Since the current structure has single product per order,
    // we'll create an array with the product from the order
    if (order) {
      const productList = [{
        id: order.product,
        name: order.product_data?.product_name || "Unknown Product",
        brand: order.product_data?.brand_name || "",
        quantity: order.product_quantity,
        supply_price: order.supply_price,
        retail_price: order.retail_price,
        total: order.total_cost,
        received: false // Initially not received
      }];
      
      setSelectedOrderProducts(productList);
      
      // Initialize checked state for all products as false
      const initialCheckedState = {};
      productList.forEach(product => {
        initialCheckedState[product.id] = false;
      });
      setCheckedProducts(initialCheckedState);
      
      setOpenChecklistModal(true);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (productId) => {
    setCheckedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Function to handle receiving all products
  const handleReceiveAll = () => {
    const allChecked = {};
    selectedOrderProducts.forEach(product => {
      allChecked[product.id] = true;
    });
    setCheckedProducts(allChecked);
    toast.success("All products marked as received!");
  };

  // Function to clear all checks
  const handleClearAll = () => {
    const allUnchecked = {};
    selectedOrderProducts.forEach(product => {
      allUnchecked[product.id] = false;
    });
    setCheckedProducts(allUnchecked);
    toast.success("All checks cleared!");
  };

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

  // Fetch user data for payment methods
  useEffect(() => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }


    const fetchData = async () => {
      try {
        const data = await safeFetch(
          `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
        );
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    if (user?.user_id) {
      fetchData();
    }
  }, [user.user_id]);

  // Stats with enhanced design
  const stats = [
    {
      title: "Total Orders",
      value: Array.isArray(filterData) ? filterData.length : 0,
      change: "+8%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <OrdersIcon />
    },
    {
      title: "Average Order Value",
      value:
        Array.isArray(filterData) && filterData.length > 0
          ? `₹${(
              filterData.reduce(
                (sum, order) => sum + (parseFloat(order?.total_cost) || 0),
                0
              ) / filterData.length
            ).toFixed(2)}`
          : "₹0.00",
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <FaRupeeSign />
    },
    {
      title: "Pending Orders",
      value: Array.isArray(filterData)
        ? filterData.filter((order) => order?.status === "on-going").length
        : 0,
      change: "-2%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <PendingIcon />
    },
    {
      title: "Completed Orders",
      value: Array.isArray(filterData)
        ? filterData.filter((order) => order?.status === "completed").length
        : 0,
      change: "+7%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <CompletedIcon />
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = (stockOrderData = null) => {
    if (stockOrderData) {
      setFormData({
        expected_date: stockOrderData.expected_date?.substring(0, 10) || "",
        for_what: stockOrderData.for_what,
        total_cost: stockOrderData.total_cost,
      });
      setSelectedSupplier(stockOrderData.product_data?.supplier || "");
      setSelectedProducts([{
        product: stockOrderData.product,
        product_name: stockOrderData.product_data?.product_name || "",
        supply_price: stockOrderData.supply_price,
        retail_price: stockOrderData.retail_price,
        product_quantity: stockOrderData.product_quantity,
        total: stockOrderData.total_cost
      }]);
    } else {
      setFormData({
        expected_date: "",
        for_what: "sell",
        total_cost: 0,
      });
      setSelectedSupplier("");
      setSelectedProducts([]);
    }
    setEditStockOrderData(stockOrderData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchSupplier = async () => {
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
          setSuppData(Array.isArray(data) ? data : []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSupplier();
      fetchData();
    }
  }, [token]);

  const fetchProduct = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    if (!selecteSupplier) return;

    try {
      const data = await safeFetch(
        `https://backendapi.trakky.in/salonvendor/product/?supplier_id=${selecteSupplier}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data) {
        setProductData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setProductData([]);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [selecteSupplier]);

  // Add product to selected products
  const handleAddProduct = () => {
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('product-quantity');
    
    if (!productSelect.value) {
      toast.error("Please select a product");
      return;
    }
    
    if (!quantityInput.value || parseInt(quantityInput.value) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const selectedProduct = productData.find(item => item.id === parseInt(productSelect.value));
    if (!selectedProduct) {
      toast.error("Product not found");
      return;
    }

    const quantity = parseInt(quantityInput.value);
    const total = quantity * parseFloat(selectedProduct.supply_price || 0);

    const newProduct = {
      product: selectedProduct.id,
      product_name: selectedProduct.product_name,
      supply_price: selectedProduct.supply_price,
      retail_price: selectedProduct.retail_price,
      product_quantity: quantity,
      total: total
    };

    setSelectedProducts(prev => [...prev, newProduct]);
    
    // Update total cost
    const newTotal = selectedProducts.reduce((sum, item) => sum + item.total, 0) + total;
    setFormData(prev => ({ ...prev, total_cost: newTotal }));

    // Reset inputs
    productSelect.value = "";
    quantityInput.value = "";
  };

  // Remove product from selected products
  const handleRemoveProduct = (index) => {
    const removedProduct = selectedProducts[index];
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    
    // Update total cost
    const newTotal = selectedProducts.reduce((sum, item) => sum + item.total, 0) - removedProduct.total;
    setFormData(prev => ({ ...prev, total_cost: newTotal > 0 ? newTotal : 0 }));
  };

  // Update product quantity
  const handleUpdateProductQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const updatedProducts = [...selectedProducts];
    const oldTotal = updatedProducts[index].total;
    updatedProducts[index].product_quantity = newQuantity;
    updatedProducts[index].total = newQuantity * updatedProducts[index].supply_price;
    
    setSelectedProducts(updatedProducts);
    
    // Update total cost
    const newTotal = selectedProducts.reduce((sum, item) => sum + item.total, 0) - oldTotal + updatedProducts[index].total;
    setFormData(prev => ({ ...prev, total_cost: newTotal }));
  };

  const fetchData = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    setLoading(true);
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
        const sortedOrders = Array.isArray(data)
          ? data.sort((a, b) => {
              if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return b.id - a.id;
            })
          : [];
        setOrders(sortedOrders);
        setFilterData(sortedOrders);
      }
    } finally {
      setLoading(false);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selecteSupplier) {
    toast.error("Please select a supplier");
    return;
  }
  if (selectedProducts.length === 0) {
    toast.error("Please add at least one product");
    return;
  }
  if (!formData.expected_date) {
    toast.error("Please select a date");
    return;
  }

  try {
    // Common data for the order
    const orderData = {
      for_what: formData.for_what || "sell",
      expected_date: formData.expected_date,
      payment_method: formData.payment_method || "",
      payment_status: formData.payment_status || "unpaid",
      items: selectedProducts.map((product) => ({
        product: product.product,                    // product ID
        product_quantity: product.product_quantity,
        supply_price: product.supply_price,
        retail_price: product.retail_price,
        total_cost: product.total || (product.supply_price * product.product_quantity),
      })),
    };

    // EDIT MODE (if your API supports updating a multi-item order)
    if (editStockOrderData) {
      await axios.patch(
        `https://backendapi.trakky.in/salonvendor/stockorder/${editStockOrderData.id}/`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order updated successfully");
    } else {
      // CREATE MODE: Single bulk order with multiple items
      await axios.post(
        "https://backendapi.trakky.in/salonvendor/stockorder/bulk/",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order placed successfully!");
    }

    fetchData();
    handleClose();
  } catch (error) {
    console.error("Submit error:", error);
    const msg = 
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Failed to save order";
    toast.error(typeof msg === "object" ? JSON.stringify(msg) : msg);
  }
};
  // Helper function to get current date and time in ISO format
  const getCurrentDateTime = () => {
    return new Date().toISOString();
  };

  // Handle status change with additional fields
  const handleStatusChange = async (orderId) => {
    try {
      // Prepare data for API call
      const dataToSend = {
        status: editStockStatusFormData.status,
        payment_method: editStockStatusFormData.payment_method,
        payment_status: editStockStatusFormData.payment_status,
      };

      // Add new expected date if status is delayed
      if (editStockStatusFormData.status === "delayed") {
        if (!editStockStatusFormData.new_expected_date) {
          toast.error("Please select a new expected date for delayed order");
          return;
        }
        dataToSend.new_expected_date = editStockStatusFormData.new_expected_date;
      }

      // Add cancellation reason and timestamp if status is cancelled
      if (editStockStatusFormData.status === "cancelled") {
        dataToSend.cancellation_reason = editStockStatusFormData.cancellation_reason || "Order cancelled";
        dataToSend.cancelled_at = getCurrentDateTime();
      }

      // Add approximate payment date if payment status is pending
      if (editStockStatusFormData.payment_status === "pending" && editStockStatusFormData.approx_payment_date) {
        dataToSend.approx_payment_date = editStockStatusFormData.approx_payment_date;
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/stockorder/${orderId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );
      if (response.ok) {
        toast.success("Order status updated successfully");
        fetchData();
        setOpenStockStatus(false);
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/stockorder/${orderId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Order deleted successfully");
        fetchData();
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDeleteConfirmation = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      handleDelete(orderId);
    }
  };

  // Filter functions
  const applyFilters = () => {
    let filtered = [...orders];

    if (search) {
      filtered = filtered.filter((order) => {
        if (searchField === "product_name") {
          return order?.product_data?.product_name
            ?.toLowerCase()
            .includes(search.toLowerCase());
        } else if (searchField === "supplier") {
          return order?.product_data?.supplier_data?.name
            ?.toLowerCase()
            .includes(search.toLowerCase());
        } else if (searchField === "order_id") {
          return order?.id?.toString().includes(search.toLowerCase());
        }
        return true;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order?.status === statusFilter);
    }

    if (purposeFilter !== "all") {
      filtered = filtered.filter((order) => order?.for_what === purposeFilter);
    }

    setFilterData(filtered);

    const newActiveFilters = [];
    if (search) newActiveFilters.push(`${searchField}: ${search}`);
    if (statusFilter !== "all")
      newActiveFilters.push(`status: ${statusFilter}`);
    if (purposeFilter !== "all")
      newActiveFilters.push(`purpose: ${purposeFilter}`);
    setActiveFilters(newActiveFilters);

    if ((search || statusFilter !== "all" || purposeFilter !== "all") && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPurposeFilter("all");
    setSearchField("product_name");
    setFilterData(orders);
    setActiveFilters([]);
    setShowFilterMenu(false);
  };

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, purposeFilter, searchField, orders]);

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("status:")) {
      setStatusFilter("all");
    } else if (filterToRemove.startsWith("purpose:")) {
      setPurposeFilter("all");
    } else if (
      filterToRemove.startsWith("product_name:") ||
      filterToRemove.startsWith("supplier:") ||
      filterToRemove.startsWith("order_id:")
    ) {
      setSearch("");
    }
  };

  // Status configuration
  const statusConfig = {
    "on-going": { label: "Pending", color: "text-yellow-800 bg-yellow-100" },
    "completed": { label: "Approved", color: "text-green-800 bg-green-100" },
    "cancelled": { label: "Cancelled", color: "text-red-800 bg-red-100" },
    "delayed": { label: "Delayed", color: "text-orange-800 bg-orange-100" }
  };

  // Calculate received products count
  const receivedCount = Object.values(checkedProducts).filter(Boolean).length;
  const totalProductsCount = selectedOrderProducts.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              Stock Orders Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Your Product Orders & Inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={`Search by ${searchField.replace("_", " ")}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      >
                        <option value="product_name">Product Name</option>
                        <option value="supplier">Supplier</option>
                        <option value="order_id">Order ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      >
                        <option value="all">All Statuses</option>
                        <option value="on-going">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purpose
                      </label>
                      <select
                        value={purposeFilter}
                        onChange={(e) => setPurposeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      >
                        <option value="all">All Purposes</option>
                        <option value="sell">Sell</option>
                        <option value="use">Use</option>
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
              Place Order
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
                  className="text-purple-600 hover:text-purple-800"
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
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.color} rounded-lg p-3 text-white shadow-md relative overflow-hidden`}
          >
            {/* Background pattern - smaller */}
            <div className="absolute top-0 right-0 w-14 h-14 opacity-10">
              {React.cloneElement(stat.icon, { className: "w-full h-full" })}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
                <div className="p-1.5 bg-white bg-opacity-20 rounded-md">
                  {React.cloneElement(stat.icon, { className: "w-3 h-3" })}
                </div>
              </div>
              
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-200" : "text-red-200"}`}>
                {stat.change} vs last month
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Order ID",
                  "Product Details",
                  "Supplier",
                  "Order Date",
                  "Delivery Date",
                  "Pricing",
                  "Quantity",
                  "Total Cost",
                  "Purpose",
                  "Status",
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
                      <span className="ml-2 text-gray-600">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData.map((order) => {
                  const statusConfigItem = statusConfig[order?.status] || { label: order?.status, color: "text-gray-800 bg-gray-100" };
                  
                  return (
                    <tr key={order?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.product_data?.product_name || "N/A"}
                          </div>
                          {order.product_data?.brand_name && (
                            <div className="text-sm text-gray-500">
                              {order.product_data.brand_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.product_data?.supplier_data?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.created_at?.substring(0, 10) || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.expected_date?.substring(0, 10) || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            Supply: ₹{order.supply_price || "-"}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Retail: ₹{order.retail_price || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.product_quantity || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{order.total_cost || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          order.for_what === 'sell' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.for_what || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfigItem.color}`}>
                          {statusConfigItem.label}
                        </span>
                        {/* Show cancellation date/time if cancelled */}
                        {order.status === "cancelled" && order.cancelled_at && (
                          <div className="text-xs text-red-600 mt-1">
                            Cancelled: {new Date(order.cancelled_at).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {/* Checklist Button - New Addition */}
                          <button
                            onClick={() => handleOpenChecklist(order)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Products Checklist"
                          >
                            <ChecklistIcon />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (order.status === "completed" || order.status === "cancelled") {
                                toast.error("Cannot edit this order");
                                return;
                              }
                              setEditStockStatusItem(order);
                              setEditStockStatusFormData({
                                status: order.status || "",
                                payment_method: order.payment_method || "",
                                payment_status: order.payment_status || "pending",
                                new_expected_date: order.new_expected_date || "",
                                cancellation_reason: order.cancellation_reason || "",
                                approx_payment_date: order.approx_payment_date || "",
                              });
                              setOpenStockStatus(true);
                            }}
                            disabled={order.status === "completed" || order.status === "cancelled"}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Update Status"
                          >
                            <StatusUpdateIcon />
                          </button>
                          <button
                            onClick={() => handleOpen(order)}
                            disabled={order.status === "completed" || order.status === "cancelled"}
                            className="p-2 text-[#492DBD] hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(order?.id)}
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
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
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
                  {editStockOrderData ? "Edit Order" : "Place New Order"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier *
                      </label>
                      <select
                        value={selecteSupplier || ""}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                        required
                      >
                        <option value="">Select Supplier</option>
                        {suppData?.map((item) => (
                          <option key={item?.id} value={item?.id}>
                            {item?.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Products *
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="product-select"
                          disabled={!selecteSupplier}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors disabled:bg-gray-100"
                        >
                          <option value="">Select Product</option>
                          {productData?.map((item) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.product_name} - ₹{item?.supply_price}
                            </option>
                          ))}
                        </select>
                        <input
                          id="product-quantity"
                          type="number"
                          placeholder="Qty"
                          min="1"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                        />
                        <button
                          onClick={handleAddProduct}
                          disabled={!selecteSupplier}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Selected Products List */}
                  {selectedProducts.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Selected Products ({selectedProducts.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {selectedProducts.map((product, index) => (
                          <div key={index} className="px-4 py-3 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm text-gray-600">Supply: ₹{product.supply_price}</span>
                                    <span className="text-sm text-gray-600">Retail: ₹{product.retail_price}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={product.product_quantity}
                                  onChange={(e) => handleUpdateProductQuantity(index, parseInt(e.target.value) || 1)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span className="text-sm text-gray-500">units</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">₹{product.total}</span>
                              <button
                                onClick={() => handleRemoveProduct(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Date *
                      </label>
                      <input
                        type="date"
                        name="expected_date"
                        value={formData.expected_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose
                      </label>
                      <select
                        name="for_what"
                        value={formData.for_what || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                      >
                        <option value="sell">Sell</option>
                        <option value="use">Use</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Total Products: {selectedProducts.length}</p>
                        <p className="text-sm text-purple-600">Total Quantity: {selectedProducts.reduce((sum, item) => sum + item.product_quantity, 0)} units</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-800">Total Order Value</p>
                        <p className="text-2xl font-bold text-purple-900">₹{formData.total_cost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedProducts.length === 0}
                  className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editStockOrderData ? "Update Order" : `Place ${selectedProducts.length > 1 ? `${selectedProducts.length} Orders` : 'Order'}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Products Checklist Modal */}
      <AnimatePresence>
        {openChecklistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Products Checklist
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Mark products as received when they arrive
                  </p>
                </div>
                <button
                  onClick={() => setOpenChecklistModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Received Progress
                    </span>
                    <span className="text-sm font-semibold text-[#492DBD]">
                      {receivedCount}/{totalProductsCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${(receivedCount / totalProductsCount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {receivedCount === totalProductsCount 
                      ? "All products received! 🎉" 
                      : `${totalProductsCount - receivedCount} product(s) remaining`}
                  </p>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  {selectedOrderProducts.length > 0 ? (
                    selectedOrderProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                          checkedProducts[product.id] 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                            checkedProducts[product.id] 
                              ? 'border-green-500 bg-green-100 text-green-600' 
                              : 'border-gray-300 bg-gray-50 text-gray-400'
                          }`}>
                            {checkedProducts[product.id] ? (
                              <FaCheckCircle className="w-5 h-5" />
                            ) : (
                              <FaTimesCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            {product.brand && (
                              <p className="text-sm text-gray-500">Brand: {product.brand}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                              <span className="text-sm text-gray-600">Price: ₹{product.supply_price}</span>
                              <span className="text-sm font-medium text-gray-900">Total: ₹{product.total}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            checkedProducts[product.id] 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {checkedProducts[product.id] ? 'Received' : 'Pending'}
                          </span>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checkedProducts[product.id] || false}
                              onChange={() => handleCheckboxChange(product.id)}
                              className="sr-only"
                            />
                            <div className={`relative w-11 h-6 rounded-full transition-colors ${
                              checkedProducts[product.id] 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}>
                              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                                checkedProducts[product.id] 
                                  ? 'transform translate-x-5' 
                                  : ''
                              }`}></div>
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {checkedProducts[product.id] ? 'Received' : 'Mark as Received'}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No products found for this order.</p>
                    </div>
                  )}
                </div>

             
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={handleReceiveAll}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Mark All as Received
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Clear All Checks
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpenChecklistModal(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      toast.success(`Saved! ${receivedCount} product(s) marked as received.`);
                      setOpenChecklistModal(false);
                    }}
                    className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Checklist
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Update Modal - UPDATED FOR DELAYED STATUS */}
      <AnimatePresence>
        {openStockStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Update Order Status
                </h2>
                <button
                  onClick={() => setOpenStockStatus(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content - UPDATED FOR CONDITIONAL RENDERING */}
              <div className="p-6 space-y-4">
                {/* Status Field - Always Visible */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={editStockStatusFormData.status || ""}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setEditStockStatusFormData({ 
                        ...editStockStatusFormData,
                        status: newStatus,
                        // Clear additional fields when status changes
                        ...(newStatus !== "delayed" && { new_expected_date: "" }),
                        ...(newStatus !== "cancelled" && { cancellation_reason: "" })
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                    required
                  >
                    <option value="on-going">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>

                {/* Conditionally Render Fields Based on Status */}
                {editStockStatusFormData.status === "delayed" ? (
                  /* Show only status and new expected date for delayed status */
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Expected Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={editStockStatusFormData.new_expected_date || ""}
                        onChange={(e) => {
                          setEditStockStatusFormData({ 
                            ...editStockStatusFormData,
                            new_expected_date: e.target.value 
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                        required={editStockStatusFormData.status === "delayed"}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a new expected delivery date for the delayed order
                    </p>
                  </div>
                ) : editStockStatusFormData.status === "cancelled" ? (
                  /* Show only cancellation reason for cancelled status */
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cancellation Reason (Optional)
                    </label>
                    <textarea
                      value={editStockStatusFormData.cancellation_reason || ""}
                      onChange={(e) => {
                        setEditStockStatusFormData({ 
                          ...editStockStatusFormData,
                          cancellation_reason: e.target.value 
                        });
                      }}
                      placeholder="Enter reason for cancellation..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Cancellation date and time will be automatically recorded
                    </p>
                  </div>
                ) : (
                  /* Show all fields for other statuses (pending, completed) */
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={editStockStatusFormData.payment_method || ""}
                        onChange={(e) => {
                          setEditStockStatusFormData({ 
                            ...editStockStatusFormData,
                            payment_method: e.target.value 
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                      >
                        <option value="">Select Payment Method</option>
                        {userData?.central_payment_method?.map((method) => (
                          <option key={method.name} value={method.name}>
                            {method.name} ({method.type})
                          </option>
                        )) || (
                          <option disabled>No payment methods available</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Status *
                      </label>
                      <select
                        value={editStockStatusFormData.payment_status || ""}
                        onChange={(e) => {
                          const newPaymentStatus = e.target.value;
                          setEditStockStatusFormData({ 
                            ...editStockStatusFormData,
                            payment_status: newPaymentStatus,
                            // Clear approximate payment date if payment status is not pending
                            ...(newPaymentStatus !== "pending" && { approx_payment_date: "" })
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>

                    {/* Approximate Payment Date Field - Only show when payment status is "pending" */}
                    {editStockStatusFormData.payment_status === "pending" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approximate Payment Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={editStockStatusFormData.approx_payment_date || ""}
                            onChange={(e) => {
                              setEditStockStatusFormData({ 
                                ...editStockStatusFormData,
                                approx_payment_date: e.target.value 
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          When do you expect to make the payment? (Optional)
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Display Info Messages */}
                {editStockStatusFormData.status === "cancelled" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> Cancelling this order is permanent and will automatically record the current date and time.
                    </p>
                  </div>
                )}

                {editStockStatusFormData.status === "delayed" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Delaying the order will update the expected delivery date.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  onClick={() => setOpenStockStatus(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(editStockStatusItem?.id)}
                  className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={
                    (editStockStatusFormData.status === "delayed" && 
                     !editStockStatusFormData.new_expected_date) ||
                    (editStockStatusFormData.status !== "cancelled" && 
                     editStockStatusFormData.status !== "delayed" && 
                     !editStockStatusFormData.payment_status)
                  }
                >
                  Update Status
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockOrder;