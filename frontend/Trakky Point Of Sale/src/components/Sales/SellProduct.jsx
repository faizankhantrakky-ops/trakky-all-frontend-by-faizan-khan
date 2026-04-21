import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { confirm, useConfirm } from "material-ui-confirm"; // <-- Add this line

import {
  Search,
  X,
  Filter,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Users,
  Package,
  Download,
  Eye,
  Info,
  Plus,
  ShoppingCart,
  Calendar,
  User,
  Phone,
  Tag,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  PieChart,
  FileText,
  Send,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  Undo2,
  RefreshCw
} from "lucide-react";
import dayjs from 'dayjs';

const SellProduct = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authTokens?.access_token;
  const tableRef = useRef(null);

  // State management
  const [loading, setLoading] = useState(true);
  const [filterData, setFilteredData] = useState([]);
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchSellHistory, setSearchSellHistory] = useState("");
  const [sellHistory, setSellHistory] = useState([]);
  const [filteredSellHistory, setFilteredSellHistory] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [infoProductData, setInfoProductData] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [selectedSellForInvoice, setSelectedSellForInvoice] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchField, setSearchField] = useState("customer_name");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // New state for return functionality
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedSaleForReturn, setSelectedSaleForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnedProducts, setReturnedProducts] = useState({});
  const [isProcessingReturn, setIsProcessingReturn] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerNumber: "",
    gender: "male",
    product_list: [],
    net_sub_discount: 0,
    net_sub_price_after_tax: 0,
    final_total: 0,
    sale_date: dayjs(),
  });

  const [editProductData, setEditProductData] = useState({
    product_id: "",
    qauntity: "",
    price_per_unit: "",
    discount_unit: "percentage",
    discount: "",
    tax: "",
    net_sub_total: "",
    product_name: "",
    product_brand: "",
    PIN: "",
  });

  // Modal handlers
  const handleOpenCustomerModal = () => setOpenCustomerModal(true);
  const handleCloseCustomerModal = () => setOpenCustomerModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenDetailsModal = (item) => {
    setInfoProductData(item);
    setShowDetailsModal(true);
  };
  const handleCloseDetailsModal = () => setShowDetailsModal(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const handleOpenInvoiceModal = (sale) => {
    setSelectedSale(sale);
    setInvoiceModalOpen(true);
  };
  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false);
    setSelectedSale(null);
  };

  // Return modal handlers
  const handleOpenReturnModal = (sale) => {
    setSelectedSaleForReturn(sale);
    
    // Initialize returned products state with all products unchecked
    const initialReturnedState = {};
    sale.product_list?.forEach(product => {
      initialReturnedState[product.product_id] = {
        returned: false,
        quantity: 1,
        maxQuantity: product.qauntity,
        product_name: product.product_name,
        price_per_unit: product.price_per_unit
      };
    });
    
    setReturnedProducts(initialReturnedState);
    setReturnReason("");
    setReturnModalOpen(true);
  };

  const handleCloseReturnModal = () => {
    setReturnModalOpen(false);
    setSelectedSaleForReturn(null);
    setReturnedProducts({});
    setReturnReason("");
  };

  const handleProductReturnToggle = (productId) => {
    setReturnedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        returned: !prev[productId].returned,
        quantity: !prev[productId].returned ? prev[productId].quantity : 1
      }
    }));
  };

  const handleReturnQuantityChange = (productId, newQuantity) => {
    const maxQuantity = returnedProducts[productId]?.maxQuantity || 1;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setReturnedProducts(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
    }
  };

  const handleProcessReturn = async () => {
    if (!selectedSaleForReturn) return;

    // Check if at least one product is selected for return
    const selectedProducts = Object.entries(returnedProducts)
      .filter(([_, product]) => product.returned);

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to return");
      return;
    }

    if (!returnReason.trim()) {
      toast.error("Please provide a return reason");
      return;
    }

    setIsProcessingReturn(true);

    try {
      // Prepare return data
      const returnData = {
        sale_id: selectedSaleForReturn.id,
        return_reason: returnReason,
        returned_products: selectedProducts.map(([productId, product]) => ({
          product_id: productId,
          product_name: product.product_name,
          quantity: product.quantity,
          price_per_unit: product.price_per_unit,
          total_amount: product.quantity * product.price_per_unit
        }))
      };

      // Call return API endpoint
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/process-return/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(returnData),
        }
      );

      if (response.ok) {
        toast.success("Return processed successfully!");
        
        // Refresh sell history
        fetchSellHistory();
        
        // Close modal
        handleCloseReturnModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to process return");
      }
    } catch (error) {
      console.error("Error processing return:", error);
      toast.error("Error processing return");
    } finally {
      setIsProcessingReturn(false);
    }
  };

  const defaultImage = "https://via.placeholder.com/96";

  const calculateTax = (subtotal) => {
    if (!vendorData?.product_is_gst) return 0;

    const taxPercent = parseFloat(vendorData?.product_tax_percent) || 0;
    const taxAmount = parseFloat(vendorData?.product_tax_amount) || 0;

    if (taxPercent > 0) {
      return (subtotal * taxPercent) / 100;
    } else if (taxAmount > 0) {
      return taxAmount;
    }

    return 0;
  };

  const calculatePriceWithTax = (price, quantity = 1) => {
    const subtotal = price * quantity;
    const tax = calculateTax(subtotal);
    return {
      priceWithoutTax: subtotal,
      taxAmount: tax,
      priceWithTax: subtotal + tax,
    };
  };

  const getTaxDisplay = () => {
    if (!vendorData?.product_is_gst) {
      return "If you added the GST, manage from the setting";
    }
    return vendorData?.product_tax_percent
      ? `${vendorData.product_tax_percent}%`
      : `₹${vendorData.product_tax_amount}`;
  };

  const applyFilters = () => {
    let filtered = [...sellHistory];

    // Apply search filter
    if (searchSellHistory) {
      filtered = filtered.filter((item) => {
        if (searchField === "customer_name") {
          return item?.client_details?.customer_name
            ?.toLowerCase()
            .includes(searchSellHistory.toLowerCase());
        } else if (searchField === "customer_phone") {
          return item?.client_details?.customer_phone?.includes(
            searchSellHistory
          );
        } else if (searchField === "product_name") {
          return item?.product_list?.some((product) =>
            product?.product_name
              ?.toLowerCase()
              .includes(searchSellHistory.toLowerCase())
          );
        }
        return true;
      });
    }

    // Apply gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter(
        (item) => item?.client_details?.gender === genderFilter
      );
    }

    // Sort by ID descending (newest first)
    const sortedFiltered = [...filtered].sort((a, b) => b.id - a.id);
    setFilteredSellHistory(sortedFiltered);

    // Update active filters
    const newActiveFilters = [];
    if (searchSellHistory)
      newActiveFilters.push(`${searchField}: ${searchSellHistory}`);
    if (genderFilter !== "all")
      newActiveFilters.push(`gender: ${genderFilter}`);
    setActiveFilters(newActiveFilters);

    // Scroll to table
    setTimeout(() => {
      const tableElement = document.querySelector("table");
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const resetFilters = () => {
    setSearchSellHistory("");
    setGenderFilter("all");
    setSearchField("customer_name");
    setFilteredSellHistory(sellHistory);
    setActiveFilters([]);
    setStartDate(dayjs().format("YYYY-MM-DD"));
    setEndDate(dayjs().format("YYYY-MM-DD"));
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("gender:")) {
      setGenderFilter("all");
    } else if (
      filterToRemove.startsWith("customer_name:") ||
      filterToRemove.startsWith("customer_phone:") ||
      filterToRemove.startsWith("product_name:")
    ) {
      setSearchSellHistory("");
    }
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
  };

 const handleGenerateSell_Invoice = async (sell) => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }



  setIsGeneratingInvoice(true);

  try {
    // Step 1: Generate invoice using the 'sell' parameter directly
    const invoiceResponse = await fetch(
      `https://backendapi.trakky.in/salonvendor/generate_sell_-invoice-details/5/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }
    );

    if (!invoiceResponse.ok) {
      const errorData = await invoiceResponse.json();
      throw new Error(errorData.message || "Failed to generate invoice");
    }

    const data = await invoiceResponse.json();

    // Step 2: Send via WhatsApp
    const whatsappPayload = {
      phone_numbers: [`91${sell.client_details.customer_phone}`],
      appointment_id: sell.id, // Required field - use sale ID
      filename: `invoice_${sell.id}`,
      file_url: data.invoice_url,
      body_values: [
        sell.client_details.customer_name || "Customer",
        "Purchased Product",
        vendorData?.salon_name || "Salon",
        vendorData?.salon_name || "Salon",
      ],
    };

    const whatsappResponse = await fetch(
      "https://backendapi.trakky.in/salonvendor/send-invoice-whatsapp/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify(whatsappPayload),
      }
    );

    if (whatsappResponse.ok) {
      toast.success("Invoice sent successfully via WhatsApp!");
    } else {
      const errorData = await whatsappResponse.json();
      throw new Error(errorData.error || "Failed to send invoice via WhatsApp");
    }
  } catch (error) {
    console.error("Invoice error:", error);
    toast.error(error.message || "Error generating or sending invoice");
  } finally {
    setIsGeneratingInvoice(false);
    setInvoiceModalOpen(false);
  }
};

  // Fetch product data
  const fetchProductData = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/selling-inventory/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setProductData(responseData);
        setFilteredData(responseData);
      } else {
        toast.error("Error while fetching product data");
      }
    } catch (error) {
      toast.error("Error while fetching product data");
    }
  };

  // Fetch sell history
  const fetchSellHistory = async () => {
               if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/sells/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        // Sort by ID descending (newest first)
        const sortedData = Array.isArray(responseData)
          ? responseData.sort((a, b) => b.id - a.id)
          : [];
        setSellHistory(sortedData);
        setFilteredSellHistory(sortedData);
      } else {
        toast.error("Error while fetching sell history");
      }
    } catch (error) {
      toast.error("Error while fetching sell history");
    } finally {
      setLoading(false);
    }
  };

  const reCalculatePrice = () => {
    // Calculate net_sub_total for each product
    const updatedProductList = formData.product_list.map((product) => {
      const subtotal = product.qauntity * product.price_per_unit;
      const discountAmount =
        product.discount_unit === "percentage"
          ? subtotal * (product.discount / 100)
          : parseFloat(product.discount || 0);

      const priceAfterDiscount = subtotal - discountAmount;
      const taxAmount = calculateTax(priceAfterDiscount);

      return {
        ...product,
        net_sub_total: priceAfterDiscount + taxAmount,
        tax: taxAmount,
      };
    });

    // Calculate totals
    const totalSubtotal = updatedProductList.reduce(
      (acc, product) => acc + product.qauntity * product.price_per_unit,
      0
    );

    const totalDiscount = updatedProductList.reduce((acc, product) => {
      return (
        acc +
        (product.discount_unit === "percentage"
          ? product.qauntity * product.price_per_unit * (product.discount / 100)
          : parseFloat(product.discount || 0))
      );
    }, 0);

    // Calculate total tax
    const priceAfterDiscount = totalSubtotal - totalDiscount;
    const totalTax = updatedProductList.reduce(
      (acc, product) => acc + (product.tax || 0),
      0
    );

    const finalTotal = priceAfterDiscount + totalTax;

    setFormData((prev) => ({
      ...prev,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(totalDiscount.toFixed(2)),
      net_sub_price_after_tax: parseFloat(totalTax.toFixed(2)),
      final_total: parseFloat(finalTotal.toFixed(2)),
    }));

    return {
      ...formData,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(totalDiscount.toFixed(2)),
      net_sub_price_after_tax: parseFloat(totalTax.toFixed(2)),
      final_total: parseFloat(finalTotal.toFixed(2)),
    };
  };

  // Handle sell product
  const handleSellProduct = async () => {
    if (formData.product_list.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (!formData.customerNumber || formData.customerNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!formData.sale_date || !dayjs(formData.sale_date).isValid()) {
      toast.error("Please select a valid sale date and time");
      return;
    }

    const tempFormData = reCalculatePrice();
  let branchId = localStorage.getItem("branchId") || "";



    const payload = {
      customer_phone: formData.customerNumber,
      customer_name: formData.customerName,
      customer_gender: formData.gender,
      product_list: tempFormData.product_list,
      net_sub_discount: tempFormData.net_sub_discount,
      net_sub_price_after_tax: tempFormData.net_sub_price_after_tax,
      final_total: tempFormData.final_total,
      // branchId: branchId,
      sale_date: dayjs(formData.sale_date).format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/sells/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Product sold successfully");
        setOpenDrawer(false);
        // Reset form
        setFormData({
          customerId: "",
          customerName: "",
          customerNumber: "",
          gender: "male",
          product_list: [],
          net_sub_discount: 0,
          net_sub_price_after_tax: 0,
          final_total: 0,
          sale_date: dayjs(),
        });
        fetchSellHistory();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error while selling product");
      }
    } catch (error) {
      toast.error("Error while selling product");
    }
  };

  const getCustomerByNumber = async (number) => {

           if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/customer-table/?customer_phone=${number}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.results && responseData.results.length > 0) {
          const customer = responseData.results[0];
          setFormData((prev) => ({
            ...prev,
            customerId: customer.id,
            customerName: customer.customer_name,
            gender: customer.customer_gender?.toLowerCase() || "male",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            customerId: "",
            customerName: "",
            gender: "male",
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          customerId: "",
          customerName: "",
          gender: "male",
        }));
      }
      return null;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Error fetching customer data");
      return null;
    }
  };

  // Effects
  useEffect(() => {
    if (token) {
      fetchProductData();
      fetchSellHistory();
    }
  }, [token, startDate, endDate]);

  useEffect(() => {
    if (searchProductTerm === "") {
      setFilteredProducts(productData);
    } else {
      setFilteredProducts(
        productData?.filter((item) =>
          item?.product_details?.product_name
            ?.toLowerCase()
            .includes(searchProductTerm.toLowerCase())
        )
      );
    }
  }, [searchProductTerm, productData]);

  useEffect(() => {
    if (searchSellHistory === "") {
      const sortedData = [...sellHistory].sort((a, b) => b.id - a.id);
      setFilteredSellHistory(sortedData);
    } else {
      const filtered = sellHistory.filter(
        (item) =>
          item?.client_details?.customer_name
            ?.toLowerCase()
            .includes(searchSellHistory.toLowerCase()) ||
          item?.client_details?.customer_phone
            ?.toLowerCase()
            .includes(searchSellHistory.toLowerCase())
      );
      const sortedFiltered = [...filtered].sort((a, b) => b.id - a.id);
      setFilteredSellHistory(sortedFiltered);
    }

    if (searchSellHistory && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [searchSellHistory, sellHistory]);

  useEffect(() => {
    if (formData.customerNumber.length === 10) {
      getCustomerByNumber(formData.customerNumber);
    }
  }, [formData.customerNumber]);

  useEffect(() => {
    if (formData.product_list.length > 0) {
      reCalculatePrice();
    }
  }, [formData.product_list]);

  // Calculate return summary
  const calculateReturnSummary = () => {
    let totalReturnAmount = 0;
    let totalReturnQuantity = 0;
    let selectedProductsCount = 0;

    Object.entries(returnedProducts).forEach(([_, product]) => {
      if (product.returned) {
        totalReturnQuantity += product.quantity;
        totalReturnAmount += product.quantity * product.price_per_unit;
        selectedProductsCount++;
      }
    });

    return {
      totalReturnAmount,
      totalReturnQuantity,
      selectedProductsCount
    };
  };

  // Stats cards
  const stats = [
    {
      title: "Total Sales",
      value: Array.isArray(sellHistory) ? sellHistory.length : 0,
      change: "+12%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      title: "Average Sale Value",
      value:
        Array.isArray(sellHistory) && sellHistory.length > 0
          ? `₹${(
              sellHistory.reduce(
                (sum, item) => sum + (parseFloat(item?.final_total) || 0),
                0
              ) / sellHistory.length
            ).toFixed(2)}`
          : "₹0.00",
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <IndianRupee className="w-4 h-4" />
    },
    {
      title: "Total Revenue",
      value: Array.isArray(sellHistory)
        ? `₹${sellHistory
            .reduce(
              (sum, item) => sum + (parseFloat(item?.final_total) || 0),
              0
            )
            .toFixed(2)}`
        : "₹0.00",
      change: "+8%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: "Unique Customers",
      value: Array.isArray(sellHistory)
        ? new Set(
            sellHistory
              .map((item) => item?.client_details?.customer_phone)
              .filter((phone) => phone !== undefined && phone !== null)
          ).size
        : 0,
      change: "+3%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <Users className="w-4 h-4" />
    },
  ];

  // Loading spinner
  const LoadingSpinner = () => (
    <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
  );

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  };


    // Delete Sale with confirmation
  const handleDeleteSale = async (sale) => {
    try {
      await confirm({
        title: "Delete Sale?",
        description: `Are you sure you want to permanently delete this sale of ₹${sale.final_total?.toFixed(2)} for ${sale.client_details?.customer_name || "customer"}? This action cannot be undone.`,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { color: "error", variant: "contained" },
        cancellationButtonProps: { variant: "outlined" },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/sells/${sale.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Sale deleted successfully");
        fetchSellHistory(); // Refresh the list
      } else {
        throw new Error("Failed to delete sale");
      }
    } catch (error) {
      if (error === "cancel") return; // User cancelled
      toast.error("Failed to delete sale");
    }
  };


  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header - Desktop */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Your Sales And Transactions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={toggleDrawer}
              className="flex items-center gap-2 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              Sell Products
            </button>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={`Search by ${searchField.replace("_", " ")}...`}
                value={searchSellHistory}
                onChange={(e) => setSearchSellHistory(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
              />
              {searchSellHistory && (
                <button
                  onClick={() => setSearchSellHistory("")}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilterMenu ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"} transition-colors`}
            >
              <Filter className={`w-4 h-4 ${showFilterMenu ? "text-blue-600" : "text-gray-600"}`} />
              Filters
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
                  <X className="w-3 h-3" />
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

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="mb-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Filter Options</h3>
              </div>
              <button
                onClick={() => setShowFilterMenu(false)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Field
                </label>
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm bg-white"
                >
                  <option value="customer_name">Customer Name</option>
                  <option value="customer_phone">Customer Phone</option>
                  <option value="product_name">Product Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm bg-white"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    setShowFilterMenu(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-[#492DBD] text-white hover:bg-purple-700 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.color} rounded-lg p-3 text-white shadow-md relative overflow-hidden`}
          >
            {/* Background pattern */}
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

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Products Qty
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product List
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-gray-600">Loading sales history...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSellHistory?.length > 0 ? (
                filteredSellHistory.map((item) => (
                  <tr key={item?.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item?.client_details?.customer_name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {item?.client_details?.gender || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item?.client_details?.customer_phone || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item?.product_list?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {item?.product_list?.slice(0, 2).map((product, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {product?.product_name?.substring(0, 15)}...
                            </span>
                          ))}
                          {item?.product_list?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{item.product_list.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item?.created_at ? formatDate(item.created_at) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{item?.net_sub_discount?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {vendorData?.product_is_gst ? (
                          `₹${item?.net_sub_price_after_tax?.toFixed(2) || "0.00"}`
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{item?.final_total?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                 <td className="px-6 py-4">
  <div className="flex items-center gap-2">
    <button
      onClick={() => handleOpenDetailsModal(item)}
      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="View Details"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
      onClick={() => handleOpenInvoiceModal(item)}
      className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      title="Send Invoice"
    >
      <Send className="w-4 h-4" />
    </button>
    <button
      onClick={() => handleOpenReturnModal(item)}
      className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
      title="Return Products"
    >
      <Undo2 className="w-4 h-4" />
    </button>
    {/* Delete Button */}
    <button
      onClick={() => handleDeleteSale(item)}
      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete Sale"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No sales history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer for Selling Products */}
      {openDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-6xl h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sell Products</h2>
                <button
                  onClick={toggleDrawer}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Selection Panel */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchProductTerm}
                          onChange={(e) => setSearchProductTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-2">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, index) => {
                          const { priceWithTax, taxAmount } = calculatePriceWithTax(
                            item.retail_price_per_unit
                          );
                          const isProductInList = formData.product_list.find(
                            (product) => product.product_id == item.product
                          );

                          return (
                            <div
                              key={index}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                isProductInList
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                if (isProductInList) return;

                                const priceInfo = calculatePriceWithTax(
                                  item.retail_price_per_unit
                                );

                                setFormData({
                                  ...formData,
                                  product_list: [
                                    ...formData.product_list,
                                    {
                                      product_id: item.product,
                                      product_name: item.product_details?.product_name,
                                      product_brand: item.product_details?.brand_name,
                                      PIN: item.product_details
                                        ?.product_indentification_number,
                                      qauntity: 1,
                                      price_per_unit: item.retail_price_per_unit,
                                      discount: 0,
                                      discount_unit: "percentage",
                                      tax: priceInfo.taxAmount,
                                      net_sub_total: priceInfo.priceWithTax,
                                    },
                                  ],
                                });
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item?.product_details?.product_name}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {item?.product_details?.brand_name || "No brand"}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-lg font-semibold text-gray-900">
                                      ₹{priceWithTax.toFixed(2)}
                                    </span>
                                    {isProductInList && (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Added
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No products found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Checkout</h3>

                    {/* Customer Info */}
                    <div className="mb-6">
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                        onClick={handleOpenCustomerModal}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {formData.customerName || formData.customerNumber || "Add Customer"}
                            </h4>
                            {formData.customerNumber && (
                              <p className="text-sm text-gray-500 mt-1">
                                {formData.customerNumber}
                              </p>
                            )}
                          </div>
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Selected Products */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Selected Products</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {formData.product_list.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.qauntity} × ₹{item.price_per_unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                ₹{item.net_sub_total?.toFixed(2)}
                              </span>
                              <button
                                onClick={() => {
                                  setEditProductData({
                                    product_id: item.product_id,
                                    qauntity: item.qauntity,
                                    price_per_unit: item.price_per_unit,
                                    discount: item.discount,
                                    discount_unit: item.discount_unit,
                                    tax: item.tax,
                                    net_sub_total: item.net_sub_total,
                                    product_name: item.product_name,
                                    product_brand: item.product_brand,
                                    PIN: item.PIN,
                                  });
                                  handleOpenEditModal();
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const updatedProductList = formData.product_list.filter(
                                    (product) => product.product_id != item.product_id
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_list: updatedProductList,
                                  }));
                                }}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-900">
                            ₹{formData.product_list
                              .reduce(
                                (acc, item) => acc + item.qauntity * item.price_per_unit,
                                0
                              )
                              ?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span className="text-red-600">
                            -₹{formData.product_list
                              .reduce((acc, item) => {
                                return (
                                  acc +
                                  (item.discount_unit === "percentage"
                                    ? item.qauntity *
                                      item.price_per_unit *
                                      (item.discount / 100)
                                    : parseFloat(item.discount || 0))
                                );
                              }, 0)
                              ?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax ({getTaxDisplay()})</span>
                          <span className="text-gray-900">
                            {vendorData?.product_is_gst ? (
                              `₹${formData.net_sub_price_after_tax?.toFixed(2) || "0.00"}`
                            ) : (
                              <span className="text-xs text-gray-500">Manage from settings</span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{formData?.final_total?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSellProduct}
                        className="w-full mt-6 py-3 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Complete Sale
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {openCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.customerId ? "Customer Details" : "Add Customer"}
                </h3>
                <button
                  onClick={handleCloseCustomerModal}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formData.customerId && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  Customer found in database. Details auto-filled.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.customerNumber}
                    onChange={(e) => {
                      if (e.target.value.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          customerNumber: e.target.value,
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    maxLength="10"
                    placeholder="10-digit phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    disabled={formData.customerId}
                    placeholder="Customer name"
                  />
                </div>

                <button
                  onClick={handleCloseCustomerModal}
                  className="w-full py-2.5 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {formData.customerId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Product</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{editProductData.product_name}</h4>
                    <p className="text-sm text-gray-500">
                      {editProductData.product_brand} • {editProductData.PIN}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(editProductData.price_per_unit * editProductData.qauntity + (editProductData.tax || 0)).toFixed(2)}
                    </p>
                    {vendorData?.product_is_gst && editProductData.tax > 0 && (
                      <p className="text-xs text-gray-500">Incl. ₹{editProductData.tax.toFixed(2)} tax</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={editProductData.price_per_unit}
                      onChange={(e) => {
                        setEditProductData({
                          ...editProductData,
                          price_per_unit: e.target.value,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => {
                          if (editProductData.qauntity > 1) {
                            setEditProductData({
                              ...editProductData,
                              qauntity: editProductData.qauntity - 1,
                            });
                          }
                        }}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={editProductData.qauntity}
                        className="w-full px-3 py-2 border-x border-gray-300 text-center focus:outline-none"
                        readOnly
                      />
                      <button
                        onClick={() => {
                          setEditProductData({
                            ...editProductData,
                            qauntity: editProductData.qauntity + 1,
                          });
                        }}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={editProductData.discount_unit}
                      onChange={(e) => {
                        setEditProductData({
                          ...editProductData,
                          discount_unit: e.target.value,
                        });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">₹</option>
                    </select>
                    <input
                      type="number"
                      value={editProductData.discount}
                      onChange={(e) => {
                        if (
                          editProductData.discount_unit === "percentage" &&
                          e.target.value > 100
                        ) {
                          return;
                        }
                        setEditProductData({
                          ...editProductData,
                          discount: e.target.value,
                        });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Discounted amount: ₹
                    {editProductData.discount_unit === "percentage"
                      ? (
                          editProductData.price_per_unit *
                          editProductData.qauntity *
                          (editProductData.discount / 100)
                        ).toFixed(2)
                      : editProductData.discount}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => {
                      const updatedProductList = formData.product_list.filter(
                        (product) => product.product_id != editProductData.product_id
                      );
                      setFormData((prev) => ({
                        ...prev,
                        product_list: updatedProductList,
                      }));
                      handleCloseEditModal();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseEditModal}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const priceInfo = calculatePriceWithTax(
                          editProductData.price_per_unit,
                          editProductData.qauntity
                        );
                        const updatedProductList = formData.product_list.map(
                          (product) =>
                            product.product_id === editProductData.product_id
                              ? {
                                  ...product,
                                  qauntity: editProductData.qauntity,
                                  price_per_unit: editProductData.price_per_unit,
                                  discount: parseFloat(editProductData.discount || 0),
                                  discount_unit: editProductData.discount_unit,
                                  tax: priceInfo.taxAmount,
                                  net_sub_total: priceInfo.priceWithTax - (editProductData.discount_unit === "percentage"
                                    ? priceInfo.priceWithoutTax * (editProductData.discount / 100)
                                    : parseFloat(editProductData.discount || 0)),
                                }
                              : product
                        );

                        setFormData((prev) => ({
                          ...prev,
                          product_list: updatedProductList,
                        }));
                        handleCloseEditModal();
                      }}
                      className="px-6 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && infoProductData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Sale Details</h3>
                <button
                  onClick={handleCloseDetailsModal}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{infoProductData?.client_details?.customer_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{infoProductData?.client_details?.customer_phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium capitalize">
                        {infoProductData?.client_details?.customer_gender || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sale Date</p>
                      <p className="font-medium">
                        {infoProductData?.created_at ? formatDate(infoProductData.created_at) : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Products ({infoProductData?.product_list?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {infoProductData?.product_list?.map((product, index) => {
                      const priceInfo = calculatePriceWithTax(
                        product.price_per_unit,
                        product.qauntity
                      );
                      return (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{product.product_name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {product.qauntity} × ₹{product.price_per_unit}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-sm text-red-600">
                                Discount: {product.discount}
                                {product.discount_unit === "percentage" ? "%" : "₹"}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{product.net_sub_total?.toFixed(2)}</p>
                            {vendorData?.product_is_gst && product.tax > 0 && (
                              <p className="text-xs text-gray-500">Incl. ₹{product.tax.toFixed(2)} tax</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>
                        ₹
                        {(
                          infoProductData?.product_list?.reduce(
                            (sum, product) =>
                              sum +
                              (parseFloat(product.qauntity) || 0) *
                                (parseFloat(product.price_per_unit) || 0),
                            0
                          ) || 0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-red-600">
                        -₹{infoProductData?.net_sub_discount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({getTaxDisplay()})</span>
                      <span>
                        {vendorData?.product_is_gst
                          ? `₹${infoProductData?.net_sub_price_after_tax?.toFixed(2) || "0.00"}`
                          : "Manage from settings"}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{infoProductData?.final_total?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModalOpen && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Generate Invoice</h3>
                <button
                  onClick={handleCloseInvoiceModal}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    Customer: {selectedSale?.client_details?.customer_name || "-"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Phone: {selectedSale?.client_details?.customer_phone || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ₹{selectedSale?.final_total?.toFixed(2) || "0.00"}
                  </p>
                </div>

                <button
                  onClick={() => handleGenerateSell_Invoice(selectedSale.id)}
                  disabled={isGeneratingInvoice && selectedSellForInvoice?.id}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isGeneratingInvoice ? "Sending Invoice..." : "Send via WhatsApp"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Products Modal - NEW ADDITION */}
      {returnModalOpen && selectedSaleForReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Return Products</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select products to return for order #{selectedSaleForReturn.id}
                  </p>
                </div>
                <button
                  onClick={handleCloseReturnModal}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-medium">
                        {selectedSaleForReturn?.client_details?.customer_name || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {selectedSaleForReturn?.client_details?.customer_phone || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Purchase Date</p>
                      <p className="font-medium">
                        {selectedSaleForReturn?.created_at ? formatDate(selectedSaleForReturn.created_at) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Total</p>
                      <p className="font-medium">
                        ₹{selectedSaleForReturn?.final_total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products List for Return */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Select Products to Return</h4>
                    <span className="text-sm text-gray-600">
                      {Object.values(returnedProducts).filter(p => p.returned).length} selected
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedSaleForReturn.product_list?.map((product, index) => {
                      const returnProduct = returnedProducts[product.product_id];
                      if (!returnProduct) return null;

                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                            returnProduct.returned 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={returnProduct.returned}
                                onChange={() => handleProductReturnToggle(product.product_id)}
                                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {product.product_name}
                              </h5>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-600">
                                  Price: ₹{product.price_per_unit}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Original Qty: {product.qauntity}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {returnProduct.returned && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleReturnQuantityChange(
                                    product.product_id, 
                                    Math.max(1, returnProduct.quantity - 1)
                                  )}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={returnProduct.maxQuantity}
                                  value={returnProduct.quantity}
                                  onChange={(e) => handleReturnQuantityChange(
                                    product.product_id, 
                                    parseInt(e.target.value) || 1
                                  )}
                                  className="w-16 px-2 py-1 border-x border-gray-300 text-center focus:outline-none"
                                />
                                <button
                                  onClick={() => handleReturnQuantityChange(
                                    product.product_id, 
                                    Math.min(returnProduct.maxQuantity, returnProduct.quantity + 1)
                                  )}
                                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ₹{(returnProduct.quantity * returnProduct.price_per_unit).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Refund Amount
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              

                {/* Return Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Reason *
                  </label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Please provide reason for return..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This information will be recorded for future reference
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={handleCloseReturnModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Reset all checkboxes
                        const resetState = {};
                        Object.keys(returnedProducts).forEach(productId => {
                          resetState[productId] = {
                            ...returnedProducts[productId],
                            returned: false,
                            quantity: 1
                          };
                        });
                        setReturnedProducts(resetState);
                        toast.success("All selections cleared");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleProcessReturn}
                      disabled={isProcessingReturn || calculateReturnSummary().selectedProductsCount === 0}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isProcessingReturn ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Undo2 className="w-4 h-4" />
                          Process Return (₹{calculateReturnSummary().totalReturnAmount.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            Sales Dashboard
          </h3>
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 text-gray-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showMobileSearch && (
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sales..."
                value={searchSellHistory}
                onChange={(e) => setSearchSellHistory(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
              />
              {searchSellHistory && (
                <button
                  onClick={() => setSearchSellHistory("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellProduct;