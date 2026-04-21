import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Chart from "react-apexcharts";
import "./Dashbord1.css";
import AuthContext from "../Context/Auth";
import { Link } from "react-router-dom";
import { Drawer, Skeleton } from "@mui/material";
import {
  Paper,
  Grid,
  CheckCircle,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

import { motion } from "framer-motion";
import posicon from "../assets/pos icon.png";
import posicon1 from "../assets/pos icon 1.png";
import posicon3 from "../assets/2.png";
import posicon4 from "../assets/3.png";
import posicon5 from "../assets/bill.png";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../components/dateModal/daterange.css";
import Checkout from "./Appointment/CheckOutForDashboard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  TextField,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { toast, ToastContainer } from "react-toastify";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import { Close } from "@mui/icons-material";
import {
  addDays,
  addMonths,
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format as dateFnsFormat,
} from "date-fns";
import Modal from "@mui/material/Modal";
// MUI Core components
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import Delete from "@mui/icons-material/Delete";
import WhatsApp from "@mui/icons-material/WhatsApp";

const Dashboard = ({ sendWhatsAppInvoice }) => {
  const { user, authTokens, vendorData } = useContext(AuthContext);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [next7DaysAppointments, setNext7DaysAppointments] = useState([]);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeInvoiceStep, setActiveInvoiceStep] = useState(0);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedAppointmentForInvoice, setSelectedAppointmentForInvoice] =
    useState(null);
  const [selectedSellForInvoice, setSelectedSellForInvoice] = useState(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [userData, setUserData] = useState([]);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("completed");

  const [dashboardStats, setDashboardStats] = useState([
    {
      label: "Revenue (Appointment)",
      count_label: "₹0",
      timestamp_label: "Select date range",
      accessKey: "Clients",
    },
    {
      label: "Appointments",
      count_label: "0 Booked",
      timestamp_label: "Select date range",
      accessKey: "Appointment",
    },
    {
      label: "Upcoming Appointments",
      count_label: "0",
      timestamp_label: "Select date range",
      accessKey: "Appointment", // Same as Appointments
    },
    {
      label: "Product Sales",
      count_label: "₹0",
      timestamp_label: "Select date range",
      accessKey: "Inventory",
    },
    {
      label: "Bill",
      count_label: "₹0",
      timestamp_label: "Select date range",
      accessKey: "Reports",
    },
  ]);

  const [allowedStats, setAllowedStats] = useState([]);

  // Fetch permissions and manage stats visibility
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const fetchPermissions = async () => {
      const tokenStr = localStorage.getItem("salonVendorAuthToken");

      // If no token → show all stats
      if (!tokenStr) {
        setAllowedStats(dashboardStats.map((stat) => stat.accessKey));
        setLoading(false);
        return;
      }

      let tokenData, accessToken;
      try {
        tokenData = JSON.parse(tokenStr);
        accessToken = tokenData.access_token;
      } catch (err) {
        console.error("Invalid token JSON");
        setAllowedStats(dashboardStats.map((stat) => stat.accessKey));
        setLoading(false);
        return;
      }

      if (!accessToken) {
        setAllowedStats(dashboardStats.map((stat) => stat.accessKey));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/custom-user-permissions-pos/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Permission API failed");

        const permissions = await response.json();

        // Extract from tokenData
        const userType = tokenData.user_type;
        const managerId = tokenData.manager_id;
        const staffId = tokenData.staff_id;

        let userPermission = null;

        if (userType === "Manager" && managerId != null) {
          userPermission = permissions.find(
            (p) => p.role_type === "manager" && p.manager == managerId
          );
        } else if (userType === "Staff" && staffId != null) {
          userPermission = permissions.find(
            (p) => p.role_type === "staff" && p.staff == staffId
          );
        }

        // Get allowed access keys or show all if no permissions found
        const accessList =
          userPermission?.access ||
          dashboardStats.map((stat) => stat.accessKey);
        setAllowedStats(accessList);
      } catch (error) {
        console.error("Permission fetch failed:", error);
        // Fallback: show all stats
        setAllowedStats(dashboardStats.map((stat) => stat.accessKey));
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Check if a stat has permission to show "Show All" button
  const hasPermission = (accessKey) => {
    return allowedStats.includes(accessKey);
  };

  const [dashboardData, setDashboardData] = useState({
    salesOverview: {
      total_sales: [],
      months: [],
    },
    revenueOverview: {
      total_revenue: [],
      months: [],
    },
    appointmentsOverview: [],
    bestSellingServices: {
      services: [],
      counts: [],
    },
    topPerformers: {
      staff_names: [],
      total_revenue: [],
      appointment_count: [],
      staff_ids: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [appointmentAnalytics, setAppointmentAnalytics] = useState({
    customerTypes: { new: 0, regular: 0 },
    trakkySources: { fromTrakky: 0, notFromTrakky: 0 },
  });

  const filteredAppointments = appointmentsData.filter(
    (app) =>
      (app.customer_name
        ?.toLowerCase()
        .includes(appointmentSearch.toLowerCase()) ||
        app.customer_phone?.includes(appointmentSearch)) &&
      (statusFilter === "all" || app.appointment_status === statusFilter)
  );

  const filteredProducts = appointmentsData.filter(
    (app) =>
      app.selled_product_details &&
      (app.customer_name?.toLowerCase().includes(productSearch.toLowerCase()) ||
        app.customer_phone?.includes(productSearch) ||
        app.selled_product_details?.product_list?.some((p) =>
          p.product_name?.toLowerCase().includes(productSearch.toLowerCase())
        ))
  );

  const getPaginatedAppointments = () => {
    const startIndex = (currentAppointmentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  };

  const getPaginatedProducts = () => {
    const startIndex = (currentProductPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalAppointmentPages = Math.ceil(
    filteredAppointments.length / itemsPerPage
  );
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add these state variables near your other useState declarations
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

  const [openModelEdit, setOpenModelEdit] = useState(false);

  const handleOpenEdit = () => setOpenModelEdit(true);
  const handleCloseEdit = () => setOpenModelEdit(false);

  // Add these new state variables near the other useState declarations
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [newAppointmentData, setNewAppointmentData] = useState(null);

  // Add this function to handle creating a new appointment
  const handleCreateNewAppointment = async (appointmentData) => {
    try {
      setIsGeneratingInvoice(true);

      // First, create the appointment
      const appointmentResponse = await fetch(
        "https://backendapi.trakky.in/salonvendor/appointments-new/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (appointmentResponse.ok) {
        const newAppointment = await appointmentResponse.json();
        setNewAppointmentData(newAppointment);

        // toast.success("Appointement create Successfully")

        // Return the new appointment data
        return { success: true, data: newAppointment };
      } else {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Error creating appointment");
      return { success: false, error: error.message };
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  // Add this function to handle closing the checkout modal
  const handleCloseCheckoutModal = () => {
    setCheckoutModalOpen(false);
    setNewAppointmentData(null);
  };

  // Add these state variables near your other useState declarations
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [filteredProducts1, setFilteredProducts] = useState([]);

  // Add this form data state
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerNumber: "",
    gender: "male",
    product_list: [],
    net_sub_discount: 0,
    net_sub_price_after_tax: 0,
    final_total: 0,
  });

  // Add these functions
  const calculateTax = (subtotal) => {
    if (!vendorData?.product_is_gst) return 0;

    const taxPercent = vendorData?.product_tax_percent;
    const taxAmount = vendorData?.product_tax_amount;

    if (taxPercent && parseFloat(taxPercent) > 0) {
      return (subtotal * parseFloat(taxPercent)) / 100;
    } else if (taxAmount && parseFloat(taxAmount) > 0) {
      return parseFloat(taxAmount);
    }

    return 0;
  };

  const reCalculatePrice = () => {
    const updatedProductList = formData.product_list.map((product) => {
      const subtotal = product.qauntity * product.price_per_unit;
      const discountAmount =
        product.discount_unit === "percentage"
          ? subtotal * (product.discount / 100)
          : product.discount;

      const priceAfterDiscount = subtotal - discountAmount;

      return {
        ...product,
        net_sub_total: priceAfterDiscount,
      };
    });

    const totalSubtotal = updatedProductList.reduce(
      (acc, product) => acc + product.qauntity * product.price_per_unit,
      0
    );

    const totalDiscount = updatedProductList.reduce((acc, product) => {
      return (
        acc +
        (product.discount_unit === "percentage"
          ? product.qauntity * product.price_per_unit * (product.discount / 100)
          : parseFloat(product.discount))
      );
    }, 0);

    const priceAfterDiscount = totalSubtotal - totalDiscount;
    const taxAmount = calculateTax(priceAfterDiscount);
    const finalTotal = priceAfterDiscount + taxAmount;

    setFormData((prev) => ({
      ...prev,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(totalDiscount),
      net_sub_price_after_tax: parseFloat(taxAmount),
      final_total: parseFloat(finalTotal),
    }));

    return {
      ...formData,
      product_list: updatedProductList,
      net_sub_discount: parseFloat(totalDiscount),
      net_sub_price_after_tax: parseFloat(taxAmount),
      final_total: parseFloat(finalTotal),
    };
  };

  const handleSellAndSendInvoice = async () => {
    if (formData.product_list.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    if (!formData.customerNumber || formData.customerNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsGeneratingInvoice(true);

    try {
      const tempFormData = reCalculatePrice();

      // First, create the sale
      const payload = {
        customer_phone: formData.customerNumber,
        customer_name: formData.customerName,
        customer_gender: formData.gender,
        product_list: tempFormData.product_list,
        net_sub_discount: tempFormData.net_sub_discount,
        net_sub_price_after_tax: tempFormData.net_sub_price_after_tax,
        final_total: tempFormData.final_total,
      };

      const sellResponse = await fetch(
        "https://backendapi.trakky.in/salonvendor/sells/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!sellResponse.ok) {
        throw new Error("Failed to create sale");
      }

      const saleData = await sellResponse.json();

      
    } catch (error) {
      console.error(error);
      toast.error("Error selling product or sending invoice");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  // Add useEffect for product data fetching and filtering
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/selling-inventory/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authTokens.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setProductData(responseData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (invoiceModalOpen) {
      fetchProductData();
    }
  }, [invoiceModalOpen, authTokens.access_token]);

  useEffect(() => {
    if (searchProductTerm === "") {
      setFilteredProducts(productData);
    } else {
      setFilteredProducts(
        productData?.filter((item) =>
          item?.product_details?.product_name
            ?.toLowerCase()
            .includes(searchProductTerm.toLowerCase())
        ) || []
      );
    }
  }, [searchProductTerm, productData]);

  // Recalculate price when product list changes
  useEffect(() => {
    if (formData.product_list.length > 0) {
      reCalculatePrice();
    }
  }, [formData.product_list]);

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
            Authorization: `Bearer ${authTokens.access_token}`,
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

          return customer;
        } else {
          // If customer doesn't exist, reset name but keep number
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

  // Modal style with responsive adjustments
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    maxWidth: "650px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    borderRadius: "12px",
    outline: "none",
    maxHeight: "90vh",
    overflowY: "auto",

    "@media (max-width: 600px)": {
      Padding: "10px",
      p: 1,
    },
  };

  const handleOpenInvoiceModal = () => {
    setInvoiceModalOpen(true);
    fetchAppointmentsForInvoice();
    // fetchProductsForInvoice();
  };

  // Function to close invoice modal
  const handleCloseInvoiceModal = () => {
    setInvoiceModalOpen(false);
    setActiveInvoiceStep(0);
    setCurrentAppointmentPage(1);
    setCurrentProductPage(1);
  };

  const fetchAppointmentsForInvoice = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointmentsData(data);
      }
    } catch (error) {
      console.error("Error fetching appointments for invoice:", error);
    }
  };

  const handleGenerateAppointmentInvoice = async (appointment) => {
    setIsGeneratingInvoice(true);
    setSelectedAppointmentForInvoice(appointment);

    try {
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate-invoice-details/${appointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();

        const whatsappPayload = {
          phone_numbers: [`91${appointment.customer_phone}`],
          filename: `invoice_${appointment.id}`,
          file_url: data.invoice_url,
          body_values: [
            appointment.customer_name,
            "Appointment",
            vendorData?.salon_name,
            vendorData?.salon_name,
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
          throw new Error("Failed to send invoice via WhatsApp");
        }
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating or sending invoice");
    } finally {
      setIsGeneratingInvoice(false);
      setSelectedAppointmentForInvoice(null);
    }
  };

  const handleGenerateSellInvoice = async (sell) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    setIsGeneratingInvoice(true);
    setSelectedSellForInvoice(sell);

    try {
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate_sell_-invoice-details/${sell.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();

       
        const whatsappPayload = {
          phone_numbers: [`91${sell.client_details.customer_phone}`],
          filename: `invoice_${sell.id}`,
          file_url: data.invoice_url,
          body_values: [
            sell.client_details.customer_name,
            "Purchased Product",
            vendorData?.salon_name,
            vendorData?.salon_name,
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
          throw new Error("Failed to send invoice via WhatsApp");
        }
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating or sending invoice");
    } finally {
      setIsGeneratingInvoice(false);
      setSelectedSellForInvoice(null);
    }
  };


  // Handle step change in invoice modal
  const handleInvoiceStepChange = (step) => {
    setActiveInvoiceStep(step);
  };

  const formatDisplayDate = (date) => {
    return dateFnsFormat(date, "dd-MM-yyyy");
  };

  // Format date to YYYY-MM-DD
  const formatDate = useCallback((date) => {
    if (!date) return "";
    return dateFnsFormat(new Date(date), "yyyy-MM-dd");
  }, []);

  const startDate = formatDate(dateRange[0].startDate);
  const endDate = formatDate(dateRange[0].endDate);

  // Handle date range change
  const handleDateChange = useCallback((ranges) => {
    const { selection } = ranges;
    setDateRange([selection]);
  }, []);

  // Apply date range and close modal

  // Add this useEffect for customer lookup
  useEffect(() => {
    if (formData.customerNumber.length === 10) {
      getCustomerByNumber(formData.customerNumber);
    }
  }, [formData.customerNumber]);

  const [activeTab, setActiveTab] = useState(0);

  // Utility function for exporting data

  // Fetch Dashboard Stats
  const fetchDashboardStats = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/dashboard/?start_date=${formatDate(
          dateRange[0].startDate
        )}&end_date=${formatDate(dateRange[0].endDate)}&vendor_user_id=${
          user.user_id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.ok) {
        const statsData = await response.json();
        setDashboardStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, [authTokens.access_token, dateRange, formatDate]);

  // Fetch Appointment Analytics for Pie Chart
  const fetchAppointmentAnalytics = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?start_date=${formatDate(
          dateRange[0].startDate
        )}&end_date=${formatDate(dateRange[0].endDate)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const customerTypes = { new: 0, regular: 0 };
        const trakkySources = { fromTrakky: 0, notFromTrakky: 0 };

        data.forEach((appointment) => {
          if (appointment.customer_type === "new") {
            customerTypes.new++;
          } else {
            customerTypes.regular++;
          }

          if (appointment.from_trakky) {
            trakkySources.fromTrakky++;
          } else {
            trakkySources.notFromTrakky++;
          }
        });

        setAppointmentAnalytics({
          customerTypes,
          trakkySources,
        });
      }
    } catch (error) {
      console.error("Error fetching appointment analytics:", error);
    }
  }, [authTokens.access_token, dateRange, formatDate]);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    setLoading(true);
    try {
      // Fetch dashboard stats
      await fetchDashboardStats();

      // Fetch chart data with date range
      const chartResponse = await fetch(
        `https://backendapi.trakky.in/salonvendor/dashboard-graph/?start_date=${formatDate(
          dateRange[0].startDate
        )}&end_date=${formatDate(dateRange[0].endDate)}&vendor_user_id=${
          user.user_id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (chartResponse.ok) {
        const jsonData = await chartResponse.json();

        setDashboardData((prev) => ({
          ...prev,
          salesOverview: jsonData.sales_overview || prev.salesOverview,
          revenueOverview: jsonData.revenue_overview || prev.revenueOverview,
          appointmentsOverview:
            jsonData.appointments || prev.appointmentsOverview,
          bestSellingServices:
            jsonData.best_selling_services || prev.bestSellingServices,
          topPerformers: jsonData.top_performers || prev.topPerformers,
        }));

        // Process appointments
        const today = dateFnsFormat(new Date(), "yyyy-MM-dd");
        const todayApps =
          jsonData.appointments
            ?.filter((app) => app.appointment_date === today)
            .map((appointment) => ({
              id: appointment.id || "",
              date: appointment.appointment_date || "",
              time: appointment.appointment_time || "",
              client: appointment.customer_name || "Unknown",
              price: appointment.appointment_price || 0,
            })) || [];

        const next7DaysApps =
          jsonData.appointments
            ?.filter((app) => {
              const appDate = new Date(app.appointment_date);
              const today = new Date();
              const nextWeek = new Date();
              nextWeek.setDate(today.getDate() + 7);
              return appDate > today && appDate <= nextWeek;
            })
            .map((appointment) => ({
              id: appointment.id || "",
              date: appointment.appointment_date || "",
              time: appointment.appointment_time || "",
              client: appointment.customer_name || "Unknown",
              price: appointment.appointment_price || 0,
            })) || [];

        setTodayAppointments(todayApps);
        setNext7DaysAppointments(next7DaysApps);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [authTokens.access_token, dateRange, fetchDashboardStats, formatDate]);

  // User Name Data Fetch
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    const fetchData = async () => {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
      );
      if (response.ok) {
        const jsonData = await response.json();
        setUserData(jsonData);
      } else {
        console.log("error");
      }
    };
    fetchData();
  }, [user.user_id]);

  // Main data fetch effect
  useEffect(() => {
    fetchDashboardData();
    fetchAppointmentAnalytics();
  }, [fetchDashboardData, fetchAppointmentAnalytics]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const hoverEffect = {
    scale: 1.02,
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  };

  const applyDateRange = useCallback(() => {
    fetchDashboardData();
    fetchAppointmentAnalytics();
    handleClose();
  }, [fetchDashboardData, fetchAppointmentAnalytics]);

  const SalesChart = ({
    dashboardData = {},
    dateRange = [{ startDate: new Date(), endDate: new Date() }],
  }) => {
    // Default to 'total' tab which shows total revenue
    const [activeTab, setActiveTab] = useState("total");

    // Safely access data with defaults
    const salesData = dashboardData?.salesOverview || {};
    const serviceData = dashboardData?.serviceOverview || {};
    const productData = dashboardData?.productOverview || {};

    const defaultMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get data for each tab
    const totalMonths = salesData.months || defaultMonths.slice(0, 6);
    const totalSales = salesData.total_sales || [];

    const serviceMonths = serviceData.months || totalMonths;
    const serviceRevenue = serviceData.service_revenue || [];

    const productMonths = productData.months || totalMonths;
    const productSales = productData.product_sales || [];

    // Calculate totals
    const totalRevenue = totalSales.reduce((sum, val) => sum + (val || 0), 0);
    const totalServiceRevenue = serviceRevenue.reduce(
      (sum, val) => sum + (val || 0),
      0
    );
    const totalProductSales = productSales.reduce(
      (sum, val) => sum + (val || 0),
      0
    );

    // Total Revenue Chart Options (DEFAULT)
    const totalChartOptions = useMemo(
      () => ({
        chart: {
          type: "line",
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        series: [
          {
            name: "Total Revenue",
            data:
              totalSales.map((val) => val || 0) ||
              Array(totalMonths.length).fill(0),
          },
        ],
        xaxis: {
          categories: totalMonths,
          labels: {
            style: {
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
              colors: "#6B7280",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
            style: {
              colors: "#6B7280",
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
            },
          },
        },
        colors: ["#502DC7"], // Purple for total revenue
        stroke: {
          width: 3,
          curve: "smooth",
          lineCap: "round",
        },
        markers: {
          size: 5,
          colors: ["#502DC7"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: { size: 7 },
        },
        dataLabels: { enabled: false },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 4,
          padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 20,
          },
        },
        tooltip: {
          enabled: true,
          style: { fontSize: "12px" },
          x: { show: true, format: "MMM yyyy" },
          y: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      }),
      [totalSales, totalMonths]
    );

    // Service Overview Chart Options
    const serviceChartOptions = useMemo(
      () => ({
        chart: {
          type: "line",
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        series: [
          {
            name: "Service Revenue",
            data:
              serviceRevenue.map((val) => val || 0) ||
              Array(serviceMonths.length).fill(0),
          },
        ],
        xaxis: {
          categories: serviceMonths,
          labels: {
            style: {
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
              colors: "#6B7280",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
            style: {
              colors: "#6B7280",
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
            },
          },
        },
        colors: ["#6366F1"], // Indigo for services
        stroke: {
          width: 3,
          curve: "smooth",
          lineCap: "round",
        },
        markers: {
          size: 5,
          colors: ["#6366F1"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: { size: 7 },
        },
        dataLabels: { enabled: false },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 4,
          padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 20,
          },
        },
        tooltip: {
          enabled: true,
          style: { fontSize: "12px" },
          x: { show: true, format: "MMM yyyy" },
          y: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      }),
      [serviceRevenue, serviceMonths]
    );

    // Product Overview Chart Options
    const productChartOptions = useMemo(
      () => ({
        chart: {
          type: "area",
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        series: [
          {
            name: "Product Sales",
            data:
              productSales.map((val) => val || 0) ||
              Array(productMonths.length).fill(0),
          },
        ],
        xaxis: {
          categories: productMonths,
          labels: {
            style: {
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
              colors: "#6B7280",
            },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
            style: {
              colors: "#6B7280",
              fontSize: window.innerWidth < 768 ? "10px" : "12px",
            },
          },
        },
        colors: ["#10B981"], // Green for products
        stroke: {
          width: 3,
          curve: "smooth",
          lineCap: "round",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        markers: {
          size: 5,
          colors: ["#10B981"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: { size: 7 },
        },
        dataLabels: { enabled: false },
        grid: {
          borderColor: "#F3F4F6",
          strokeDashArray: 4,
          padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 20,
          },
        },
        tooltip: {
          enabled: true,
          style: { fontSize: "12px" },
          x: { show: true, format: "MMM yyyy" },
          y: {
            formatter: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      }),
      [productSales, productMonths]
    );

    // Format date safely
    const formatDate = (date) => {
      try {
        return dateFnsFormat(date, "MMM d, yyyy");
      } catch (error) {
        return dateFnsFormat(new Date(), "MMM d, yyyy");
      }
    };

    // Get date range safely
    const startDate = dateRange[0]?.startDate
      ? formatDate(dateRange[0].startDate)
      : formatDate(new Date());
    const endDate = dateRange[0]?.endDate
      ? formatDate(dateRange[0].endDate)
      : formatDate(new Date());

    // Get chart title based on active tab
    const getChartTitle = () => {
      switch (activeTab) {
        case "total":
          return "Total Revenue";
        case "service":
          return "Service Revenue";
        case "product":
          return "Product Sales";
        default:
          return "Total Revenue";
      }
    };

    // Get total amount based on active tab
    const getTotalAmount = () => {
      switch (activeTab) {
        case "total":
          return totalRevenue;
        case "service":
          return totalServiceRevenue;
        case "product":
          return totalProductSales;
        default:
          return totalRevenue;
      }
    };

    // Get color based on active tab
    const getTabColor = () => {
      switch (activeTab) {
        case "total":
          return "#502DC7";
        case "service":
          return "#6366F1";
        case "product":
          return "#10B981";
        default:
          return "#502DC7";
      }
    };

    return (
      <div className="bg-white p-4 sm:p-6  h-[450px] rounded-2xl shadow-lg border border-gray-200">
        {/* Header with Tabs and Total Amount */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {getChartTitle()}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">
                {startDate} - {endDate}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex space-x-6">
              {["total", "service", "product"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Revenue
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getTabColor() }}
            ></div>
            <span className="text-sm text-gray-600">
              {activeTab === "total"
                ? "Total Revenue Trend"
                : activeTab === "service"
                ? "Service Revenue Trend"
                : "Product Sales Trend"}
            </span>
          </div>

          {/* Render appropriate chart based on active tab */}
          {activeTab === "total" ? (
            <Chart
              options={totalChartOptions}
              series={totalChartOptions.series}
              type="line"
              height={window.innerWidth < 768 ? 250 : 300}
              className="apexcharts-canvas"
            />
          ) : activeTab === "service" ? (
            <Chart
              options={serviceChartOptions}
              series={serviceChartOptions.series}
              type="line"
              height={window.innerWidth < 768 ? 250 : 300}
              className="apexcharts-canvas"
            />
          ) : (
            <Chart
              options={productChartOptions}
              series={productChartOptions.series}
              type="area"
              height={window.innerWidth < 768 ? 250 : 300}
              className="apexcharts-canvas"
            />
          )}
        </div>
      </div>
    );
  };

  // Revenue Chart Component
  const RevenueChart = () => {
    const options = {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      series: [
        {
          name: "Revenue",
          data: dashboardData.revenueOverview.total_revenue || [],
        },
      ],
      xaxis: {
        categories: dashboardData.revenueOverview.months || [],
        labels: {
          style: {
            fontSize: window.innerWidth < 768 ? "10px" : "12px",
            colors: "#6B7280",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          },
          style: {
            colors: "#6B7280",
          },
        },
      },
      colors: ["#10B981"],
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 4,
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20,
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    };

    return (
      <div
        className="bg-white p-6 rounded-2xl  shadow-lg transition-all duration-300  border border-gray-200"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverEffect}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[#502DC7] mb-2 sm:mb-0">
            Revenue Overview
          </h3>
        </div>

        {
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Selected Period</span>
              </div>
              <div className="text-sm text-gray-600">
                {dateFnsFormat(dateRange[0].startDate, "MMM d, yyyy")} -{" "}
                {dateFnsFormat(dateRange[0].endDate, "MMM d, yyyy")}
              </div>
            </div>

            <Chart
              options={options}
              series={options.series}
              type="bar"
              height={window.innerWidth < 768 ? 250 : 300}
              className="apexcharts-canvas"
            />
          </div>
        }
      </div>
    );
  };

  // Combined Pie Chart Component
  const CombinedPieChart = () => {
    // Calculate total for percentage calculations
    const totalCustomers =
      appointmentAnalytics.customerTypes.new +
      appointmentAnalytics.customerTypes.regular +
      appointmentAnalytics.trakkySources.fromTrakky +
      appointmentAnalytics.trakkySources.notFromTrakky;

    const options = {
      chart: {
        type: "donut",
        height: 350,
        foreColor: "#374151",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      // Add values to labels
      labels: [
        `New Customers: ${appointmentAnalytics.customerTypes.new} (${Math.round(
          (appointmentAnalytics.customerTypes.new / totalCustomers) * 100
        )}%)`,
        `Regular Customers: ${
          appointmentAnalytics.customerTypes.regular
        } (${Math.round(
          (appointmentAnalytics.customerTypes.regular / totalCustomers) * 100
        )}%)`,
        `From Trakky: ${
          appointmentAnalytics.trakkySources.fromTrakky
        } (${Math.round(
          (appointmentAnalytics.trakkySources.fromTrakky / totalCustomers) * 100
        )}%)`,
      ],
      colors: ["#6366F1", "#10B981", "#F59E0B", "#EF4444"],
      series: [
        appointmentAnalytics.customerTypes.new,
        appointmentAnalytics.customerTypes.regular,
        appointmentAnalytics.trakkySources.fromTrakky,
        appointmentAnalytics.trakkySources.notFromTrakky,
      ],
      legend: {
        position: window.innerWidth < 768 ? "bottom" : "right",
        horizontalAlign: "center",
        fontSize: "13px",
        fontFamily: "poppins",
        markers: {
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
        // Optional: Custom formatter for legend if you want more control
        formatter: function (seriesName, opts) {
          return (
            seriesName.split(":")[0] +
            ": " +
            opts.w.globals.series[opts.seriesIndex]
          );
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true, // Changed to true to show values in the center
              total: {
                show: true,
                label: "Total",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
              value: {
                show: true,
                fontSize: "18px",
                fontFamily: "poppins",
                fontWeight: "bold",
                color: "#374151",
              },
            },
          },
          expandOnClick: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (value) {
            return value + " customers";
          },
        },
      },
      stroke: {
        width: 0,
      },
    };

    return (
      <div
        className="bg-white p-6 rounded-2xl h-[450px]  shadow-lg transition-all duration-300 border border-gray-200"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverEffect}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-[#502DC7]">
            Customer Distribution
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Selected Period</span>
          </div>
          <div className="text-sm text-gray-600">
            {dateFnsFormat(dateRange[0].startDate, "MMM d, yyyy")} -{" "}
            {dateFnsFormat(dateRange[0].endDate, "MMM d, yyyy")}
          </div>
        </div>

        {
          <Chart
            options={options}
            series={options.series}
            type="donut"
            height={window.innerWidth < 768 ? 250 : 300}
            className="apexcharts-canvas"
          />
        }
      </div>
    );
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, color, navigateTo, accessKey }) => {
    const bgColorMap = {
      "border-indigo-500": "bg-indigo-50",
      "border-green-500": "bg-green-50",
      "border-yellow-500": "bg-yellow-50",
      "border-red-500": "bg-red-50",
      "border-purple-500": "bg-purple-50",
    };

    const hasAccess = hasPermission(accessKey);

    return (
      <div
        className={`p-2 rounded-md rounded-r-lg border-gray-200 border-l-4 ${color} ${bgColorMap[color]} font-poppins`}
      >
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm sm:text-lg font-bold text-[#502DC7] ">
            {title}
          </p>
        </div>

        <div className="flex justify-between items-center pl-2 sm:pl-6 mb-1">
          <div className="flex flex-col">
            <p className={`text-sm sm:text-lg font-bold text-black`}>
              {loading ? <Skeleton width={80} /> : value}
            </p>
          </div>

          <div className={`bg-opacity-70`}>
            {typeof icon === "string" ? (
              <img
                src={icon}
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 filter drop-shadow-[0_8px_5px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="filter drop-shadow-[0_8px_5px_rgba(0,0,0,0.5)]">
                {icon}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="h-[1px] bg-[#502DC7] w-[calc(100%-7rem)]"></div>
          {hasAccess ? (
            <Link
              to={`${navigateTo}?start_date=${startDate}&end_date=${endDate}`}
              className={`text-xs sm:text-sm font-medium hover:underline text-black`}
            >
              show all
            </Link>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-gray-400 cursor-not-allowed">
              show all
            </span>
          )}
        </div>


      </div>
    );
  };

  // Skeleton component for loading state
  const Skeleton = ({ width }) => (
    <div
      className="h-4 bg-gray-200 rounded animate-pulse"
      style={{ width: `${width}px` }}
    ></div>
  );

  // Appointment Card Component
  const AppointmentCard = ({ appointment, isToday }) => {
    return (
      <div
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 transition-all duration-300 hover:shadow-md hover:translate-x-2 hover:border-slate-200"
        whileHover={{
          translateX: 5,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div className="w-2/3">
            <h4 className="text-sm sm:text-base font-medium text-gray-800 truncate">
              {appointment.client}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500">
              {appointment.time}
            </p>
          </div>
          <div className="text-right w-1/3">
            <p className="text-sm sm:text-base font-bold text-gray-800 truncate">
              ₹{appointment.price}
            </p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isToday
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isToday ? "Today" : "Upcoming"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 sm:p-6 ml-0 sm:ml-20 w-full max-w-full min-h-screen bg-[#FFFFFF]">
        {/* Header Section */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center    transition-all duration-300 bg-gradient-to-r from-slate-50 to-gray-50 p-3 rounded-md mb-4 shadow-sm border border-slate-200 cursor-pointer  hover:border-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-black mb-1 font-poppins">
                Hello, {_.startCase(_.toLower(userData?.ownername)) || "User"}
              </h1>
              <p className="text-black font-poppins font-light text-sm sm:text-base">
                Welcome Back to your dashboard
              </p>
            </div>
          }

          {
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1 sm:mt-0 w-full sm:w-auto">
              {/* Send Invoice Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="w-full sm:w-auto"
              >
                <button
                  onClick={handleOpenInvoiceModal}
                  className="w-full bg-black font-poppins text-white px-4 py-2 rounded-md transition-all shadow-2xl hover:shadow-lg flex items-center justify-center text-sm hover:bg-[#4C2DC2] sm:px-6 sm:text-base"
                >
                  <svg
                    className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 14l6-6m-5.5 0h5.5m-5.5 0v5.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Sell Products
                </button>
              </motion.div>

              {/* Create Invoice Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="w-full sm:w-auto"
              >
                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full bg-black font-poppins text-white px-4 py-2 rounded-md transition-all shadow-2xl hover:shadow-lg flex items-center justify-center text-sm hover:bg-[#4C2DC2] sm:px-6 sm:text-base"
                >
                  <svg
                    className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Create Invoice
                </button>
              </motion.div>

              {/* Add Appointment Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/appointment/add-new-appointment"
                  className="w-full bg-black font-poppins text-white px-4 py-2 rounded-md transition-all shadow-2xl hover:shadow-lg flex items-center justify-center text-sm hover:bg-[#4C2DC2] sm:px-6 sm:text-base"
                >
                  <svg
                    className="w-4 h-4 mr-1 sm:w-5 sm:h-5 sm:mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Appointment
                </Link>
              </motion.div>
            </div>
          }
        </div>
        {/* Date Range Picker */}
        <div
          className="p-3 rounded-md mb-4  cursor-pointer transition-all duration-300  "
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left ">
            <h3 className="hidden sm:block text-base sm:text-lg text-[#502DC7]">
              {/* Select Date Range */}
            </h3>

            <div
              className="flex items-center justify-center sm:justify-end gap-2 text-sm sm:text-base text-gray-600 font-medium"
              onClick={handleOpen}
            >
              {/* Calendar Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#502DC7]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>

              {/* Date Range */}
              <span className="font-semibold">
                {formatDisplayDate(dateRange[0].startDate)} -{" "}
                {formatDisplayDate(dateRange[0].endDate)}
              </span>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8 font-poppins">
          {/* Revenue (Appointment) */}
          <StatCard
            title="Revenue (Appointment)"
            value={dashboardStats[0]?.count_label || "₹0"}
            icon={
              <img
                src={posicon1}
                alt="Revenue"
                className="w-32 sm:w-36 h-28 sm:h-32"
              />
            }
            color="border-indigo-500"
            navigateTo="/client-directory"
            accessKey="Clients"
          />

          {/* Appointments */}
          <StatCard
            title="Appointments"
            value={dashboardStats[1]?.count_label || "0 Booked"}
            icon={
              <img
                src={posicon}
                alt="Appointments"
                className="w-32 sm:w-36 h-28 sm:h-32"
              />
            }
            color="border-green-500"
            navigateTo="/appointment/list-appointment/card"
            accessKey="Appointment"
          />

          {/* Upcoming Appointments */}
          <StatCard
            title="Upcoming Appointments"
            value={dashboardStats[2]?.count_label || "0 Appointments"}
            icon={
              <img
                src={posicon3}
                alt="Upcoming Appointments"
                className="w-32 sm:w-36 h-28 sm:h-32"
              />
            }
            color="border-yellow-500"
            navigateTo="/appointment/list-appointment/card"
            accessKey="Appointment"
          />

          {/* Product Sales */}
          <StatCard
            title="Product Sales"
            value={dashboardStats[3]?.count_label || "₹0"}
            icon={
              <img
                src={posicon4}
                alt="Product Sales"
                className="w-36 sm:w-40 h-28 sm:h-32"
              />
            }
            color="border-red-500"
            navigateTo="/sales/selling-product"
            accessKey="Inventory"
          />

          {/* Total Bill Count */}
          <StatCard
            title="Total Bill Count"
            value={dashboardStats[4]?.count_label || "0 Bills"}
            icon={
              <img
                src={posicon5}
                alt="Total Bill Count"
                className="w-32 sm:w-36 h-28 sm:h-32"
              />
            }
            color="border-purple-500"
            navigateTo="/daily-business-report/payment-report"
            accessKey="Reports"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 font-poppins">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-7">
            <SalesChart />
            {/* <RevenueChart /> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 font-poppins">
              {/* Best Selling Services - Responsive */}
              <div
                className="bg-white p-4 sm:p-6 rounded-2xl  shadow-lg border border-gray-200"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={hoverEffect}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#502DC7]">
                    Top 15 Best Selling Services
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Selected Period
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateFnsFormat(dateRange[0].startDate, "MMM d, yyyy")} -{" "}
                    {dateFnsFormat(dateRange[0].endDate, "MMM d, yyyy")}
                  </div>
                </div>
                {dashboardData.bestSellingServices?.services?.length > 0 ? (
                  <div
                    className="overflow-x-auto"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 text-sm sm:text-base">Rank</th>
                          <th className="pb-3 text-sm sm:text-base">Service</th>
                          <th className="pb-3 text-sm sm:text-base">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.bestSellingServices.services
                          // Create an array of service objects with their counts
                          .map((service, index) => ({
                            service,
                            count:
                              dashboardData.bestSellingServices.counts[index] ||
                              0,
                            originalIndex: index,
                          }))
                          // Sort by count in descending order
                          .sort((a, b) => b.count - a.count)
                          // Take only the top 15
                          .slice(0, 15)
                          // Render the top 5 services
                          .map((item, index) => (
                            <tr
                              key={item.originalIndex}
                              className="border-b text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 text-sm sm:text-base font-medium">
                                {index + 1}
                              </td>
                              <td className="py-3 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                                {item.service || "Unknown Service"}
                              </td>
                              <td className="text-sm sm:text-base font-semibold">
                                {item.count}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p className="text-sm sm:text-base">
                      No services data available
                    </p>
                  </div>
                )}
              </div>

              {/* Top Performing Team Members - Responsive */}
              <div
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={hoverEffect}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#502DC7]">
                    Top Performing Team
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Selected Period
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateFnsFormat(dateRange[0].startDate, "MMM d, yyyy")} -{" "}
                    {dateFnsFormat(dateRange[0].endDate, "MMM d, yyyy")}
                  </div>
                </div>
                {dashboardData.topPerformers?.staff_names?.length > 0 ? (
                  <div
                    className="overflow-x-auto"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 text-sm sm:text-base">Rank</th>
                          <th className="pb-3 text-sm sm:text-base">Name</th>
                          <th className="pb-3 text-sm sm:text-base">
                            Appointments
                          </th>
                          <th className="pb-3 text-sm sm:text-base">Sales</th>
                          <th className="pb-3 text-sm sm:text-base">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.topPerformers.staff_names
                          // Create an array of staff objects with their data
                          .map((staff, index) => ({
                            staff,
                            total_revenue:
                              dashboardData.topPerformers.total_revenue?.[
                                index
                              ] || 0,
                            appointment_count:
                              dashboardData.topPerformers.appointment_count?.[
                                index
                              ] || 0,
                            staff_id:
                              dashboardData.topPerformers.staff_ids?.[index] ||
                              "",
                            originalIndex: index,
                          }))
                          // Sort by appointment count in descending order
                          .sort(
                            (a, b) => b.appointment_count - a.appointment_count
                          )
                          // Render the sorted staff members
                          .map((item, index) => (
                            <tr
                              key={item.originalIndex}
                              className="border-b text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 text-sm sm:text-base font-medium">
                                {index + 1}
                              </td>
                              <td className="py-3 text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                                {item.staff || "Unknown"}
                              </td>
                              <td className="text-sm sm:text-base font-semibold">
                                {item.appointment_count}
                              </td>
                              <td className="text-sm sm:text-base">
                                ₹{item.total_revenue?.toLocaleString() || 0}
                              </td>
                              <td className="text-sm sm:text-base">
                                <Link
                                  to={`/staffmanagement/staffrecord?staff_id=${item.staff_id}`}
                                  className="text-indigo-600 hover:underline"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-sm sm:text-base">
                      No team members found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column  Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            <CombinedPieChart />

            {/* Today's Appointments */}
            <div
              className="bg-white rounded-2xl shadow-lg h-[435px] overflow-hidden border border-gray-100"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={hoverEffect}
            >
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#502DC7]">
                      Today's Appointments
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {todayAppointments.length} appointment
                      {todayAppointments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-blue-50 rounded-full">
                      <span className="text-xs font-medium text-blue-700">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointments List - Table Style */}
              {todayAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Table Header */}
                    <div className="hidden sm:grid sm:grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="col-span-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client & Service
                      </div>
                      <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </div>
                      <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </div>
                      <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                      {todayAppointments.map((appointment, index) => (
                        <div
                          key={index}
                          className="group hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                        >
                          {/* Desktop/Tablet View */}
                          <div className="hidden sm:grid sm:grid-cols-12 px-6 py-4">
                            {/* Client & Service */}
                            <div className="col-span-4">
                              <div className="flex items-center gap-3">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {appointment.client}
                                  </h4>
                                  <p className="text-xs text-gray-500 truncate">
                                    {appointment.service || "Consultation"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Time */}
                            <div className="col-span-3">
                              <div className="text-sm text-gray-900 font-medium">
                                {appointment.time}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(() => {
                                  const now = new Date();
                                  const aptTime = new Date(appointment.time);
                                  const diffHours =
                                    (aptTime - now) / (1000 * 60 * 60);
                                  if (diffHours < 0) return "Past";
                                  if (diffHours < 1) return "Now";
                                  if (diffHours < 2) return "Soon";
                                  return "Upcoming";
                                })()}
                              </div>
                            </div>

                            {/* Amount */}
                            <div className="col-span-3">
                              <div className="text-sm font-semibold text-gray-900">
                                ₹{appointment.price?.toLocaleString() || "0"}
                              </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {appointment.status || "Booked"}
                              </span>
                            </div>
                          </div>

                          {/* Mobile View */}
                          <div className="sm:hidden p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 font-semibold">
                                    {appointment.client
                                      ?.charAt(0)
                                      ?.toUpperCase() || "C"}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {appointment.client}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {appointment.service || "Consultation"}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {appointment.status || "confirmed"}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.time}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {appointment.duration || "30 mins"}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-gray-900">
                                  ₹{appointment.price?.toLocaleString() || "0"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {appointment.payment || "Cash"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center">
                  <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No appointments today
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm">
                    You have no appointments scheduled for today. Enjoy your
                    free time!
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                    Schedule New Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next 7 Days Appointments */}
        <div
          className="bg-white p-4 mt-3   sm:p-6  rounded-2xl  shadow-lg transition-all duration-300  border border-gray-200"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={hoverEffect}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-[#502DC7]">
              Next 7 Days Appointments
            </h3>
          </div>
          {next7DaysAppointments.length > 0 ? (
            <div className="max-h-96 overflow-y-auto pr-2">
              {next7DaysAppointments.map((appointment, index) => (
                <AppointmentCard
                  key={index}
                  appointment={appointment}
                  isToday={false}
                />
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm sm:text-base">
                No upcoming appointments in the next 7 days
              </p>
            </div>
          )}
        </div>
        {/* Bottom Section - Tables - Made Responsive */}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#502DC7]">
                Select Date Range
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="date-range-parent-container"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <DateRangePicker
                onChange={handleDateChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={dateRange}
                direction="vertical"
                scroll={{ enabled: true }}
                preventSnapRefocus={true}
                calendarFocus="backwards"
                staticRanges={[
                  {
                    label: "Today",
                    range: () => ({
                      startDate: new Date(),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "Yesterday",
                    range: () => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      return {
                        startDate: yesterday,
                        endDate: yesterday,
                      };
                    },
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "This Week (Sun - Today)",
                    range: () => ({
                      startDate: startOfWeek(new Date()),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      return (
                        isSameDay(range.startDate, startOfWeek(new Date())) &&
                        isSameDay(range.endDate, new Date())
                      );
                    },
                  },
                  {
                    label: "Last 7 Days",
                    range: () => ({
                      startDate: addDays(new Date(), -6),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "Last Week (Sun - Sat)",
                    range: () => ({
                      startDate: startOfWeek(addDays(new Date(), -7)),
                      endDate: endOfWeek(addDays(new Date(), -7)),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "Last 14 Days",
                    range: () => ({
                      startDate: addDays(new Date(), -13),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "This Month",
                    range: () => ({
                      startDate: startOfMonth(new Date()),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      return (
                        isSameDay(range.startDate, startOfMonth(new Date())) &&
                        isSameDay(range.endDate, new Date())
                      );
                    },
                  },
                  {
                    label: "Last 30 Days",
                    range: () => ({
                      startDate: addDays(new Date(), -29),
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "Last Month",
                    range: () => ({
                      startDate: startOfMonth(addMonths(new Date(), -1)),
                      endDate: endOfMonth(addMonths(new Date(), -1)),
                    }),
                    isSelected(range) {
                      const definedRange = this.range();
                      return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                      );
                    },
                  },
                  {
                    label: "All Time",
                    range: () => ({
                      startDate: new Date(0), // Earliest possible date
                      endDate: new Date(),
                    }),
                    isSelected(range) {
                      return (
                        isSameDay(range.startDate, new Date(0)) &&
                        isSameDay(range.endDate, new Date())
                      );
                    },
                  },
                ]}
              />
            </div>

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm sm:text-base rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={applyDateRange}
                className="px-4 py-2 text-sm sm:text-base rounded-lg bg-[#502DC7] text-white hover:bg-[#3a1f96]"
              >
                Apply
              </button>
            </div>
          </Box>
        </Modal>

        {/* Invoice Modal – fully responsive on small devices */}
        <Drawer
          anchor="right"
          open={invoiceModalOpen}
          onClose={handleCloseInvoiceModal}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: 500, md: 600 },
              maxWidth: "100%",
              height: "100vh",
              borderRadius: { sm: "12px 0 0 12px" },
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <Box className="bg-[#502DC7] text-white p-4 flex justify-between items-center sticky top-0 z-10">
            <Typography variant="h6" className="font-semibold">
              Sell Products & Send Invoice
            </Typography>
            <IconButton onClick={handleCloseInvoiceModal} s7ize="small">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              position: "sticky",
              top: 0,
              zIndex: 9,
            }}
          >
            <Tab label="Customer Information" />
            <Tab label="Products Information" />
          </Tabs>

          {/* Scrollable Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              pb: 10, // space for buttons
              bgcolor: "#f9fafb",
            }}
            className="client-scrollbar"
          >
            {/* Tab Panel: Customer Information */}
            {activeTab === 0 && (
              <Box>
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <TextField
                      fullWidth
                      label="Customer Phone Number"
                      variant="outlined"
                      type="tel"
                      value={formData.customerNumber}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Allow only numbers + max 10 digits
                        if (/^[0-9]*$/.test(value) && value.length <= 10) {
                          setFormData((prev) => ({
                            ...prev,
                            customerNumber: value,
                          }));
                        }
                      }}
                      inputProps={{ maxLength: 10 }}
                      placeholder="Enter 10-digit phone number"
                      size="small"
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                        label="Gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Customer Name"
                      variant="outlined"
                      value={formData.customerName}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Allow only alphabets + spaces
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          setFormData((prev) => ({
                            ...prev,
                            customerName: value,
                          }));
                        }
                      }}
                      placeholder="Customer name"
                      disabled={formData.customerId}
                      size="small"
                    />

                    {formData.customerId && (
                      <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                        Customer found in database. Details auto-filled.
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            )}

            {/* Tab Panel: Products Information */}
            {/* ────────────────────────  PRODUCTS TAB  ──────────────────────── */}
            {activeTab === 1 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* ─────  Product Search  ───── */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Select Products
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search products…"
                    value={searchProductTerm}
                    onChange={(e) => setSearchProductTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      maxHeight: 320,
                      overflowY: "auto",
                      pr: 1,
                      "&::-webkit-scrollbar": { width: 6 },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "grey.400",
                        borderRadius: 3,
                      },
                    }}
                  >
                    {filteredProducts1.length > 0 ? (
                      <Grid container spacing={2}>
                        {filteredProducts1.map((item, idx) => {
                          const isSelected = formData.product_list.some(
                            (p) => p.product_id == item.product
                          );

                          return (
                            <Grid item xs={12} key={idx}>
                              <Card
                                variant="outlined"
                                sx={{
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  border: isSelected
                                    ? "2px solid #502DC7"
                                    : "1px solid #e0e0e0",
                                  bgcolor: isSelected
                                    ? "#f8f5ff"
                                    : "background.paper",
                                  "&:hover": { boxShadow: 3 },
                                }}
                                onClick={() => {
                                  if (isSelected) return;
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_list: [
                                      ...prev.product_list,
                                      {
                                        product_id: item.product,
                                        product_name:
                                          item.product_details?.product_name,
                                        product_brand:
                                          item.product_details?.brand_name,
                                        PIN: item.product_details
                                          ?.product_indentification_number,
                                        qauntity: 1,
                                        price_per_unit:
                                          item.retail_price_per_unit,
                                        discount: 0,
                                        discount_unit: "percentage",
                                        net_sub_total:
                                          item.retail_price_per_unit,
                                      },
                                    ],
                                  }));
                                }}
                              >
                                <CardContent
                                  sx={{
                                    py: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={
                                      item?.product_img ||
                                      "https://via.placeholder.com/48"
                                    }
                                    alt={item?.product_details?.product_name}
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                    }}
                                  />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={500}
                                      noWrap
                                    >
                                      {item?.product_details?.product_name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      ₹{item.retail_price_per_unit}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Typography color="text.secondary" align="center" py={3}>
                        No products found
                      </Typography>
                    )}
                  </Box>
                </Paper>

                {/* ─────  Selected Products  ───── */}
                {formData.product_list.length > 0 && (
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Selected Products
                    </Typography>

                    <Box
                      sx={{
                        maxHeight: 260,
                        overflowY: "auto",
                        pr: 1,
                        "&::-webkit-scrollbar": { width: 6 },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: "grey.400",
                          borderRadius: 3,
                        },
                      }}
                    >
                      {formData.product_list.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            mb: 1,
                            border: "1px solid #e5e7eb",
                            borderRadius: 1.5,
                            bgcolor: "background.default",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            "&:hover": { bgcolor: "grey.50" },
                          }}
                          onClick={() => {
                            setEditProductData({
                              product_id: item.product_id,
                              qauntity: item.qauntity,
                              price_per_unit: item.price_per_unit,
                              discount: item.discount,
                              discount_unit: item.discount_unit || "percentage",
                              tax: item.tax,
                              net_sub_total: item.net_sub_total,
                              product_name: item.product_name,
                              product_brand: item.product_brand,
                              PIN: item.PIN,
                            });
                            handleOpenEdit();
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "grey.200",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {item.qauntity}x
                            </Box>

                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight={500}
                                noWrap
                              >
                                {item.product_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ₹{item.price_per_unit} each
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography fontWeight={600}>
                              ₹
                              {(item.qauntity * item.price_per_unit).toFixed(2)}
                            </Typography>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({
                                  ...prev,
                                  product_list: prev.product_list.filter(
                                    (_, i) => i !== idx
                                  ),
                                }));
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* ─────  Order Summary (Bill-type)  ───── */}
                {formData.product_list.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "#fafafa" }}
                  >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Order Summary
                    </Typography>

                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ border: 0, py: 1 }}
                            >
                              Subtotal
                            </TableCell>
                            <TableCell align="right" sx={{ border: 0, py: 1 }}>
                              ₹
                              {formData.product_list
                                .reduce(
                                  (a, i) => a + i.qauntity * i.price_per_unit,
                                  0
                                )
                                .toFixed(2)}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ border: 0, py: 1 }}
                            >
                              Discount
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ border: 0, py: 1, color: "error.main" }}
                            >
                              -₹
                              {formData.product_list
                                .reduce((a, i) => {
                                  return (
                                    a +
                                    (i.discount_unit === "percentage"
                                      ? i.qauntity *
                                        i.price_per_unit *
                                        (i.discount / 100)
                                      : parseFloat(i.discount))
                                  );
                                }, 0)
                                .toFixed(2)}
                            </TableCell>
                          </TableRow>

                          {/* Tax Section */}
                          {vendorData?.product_is_gst && (
                            <>
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ border: 0, py: 1, fontWeight: 500 }}
                                >
                                  Tax
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ border: 0, py: 1 }}
                                >
                                  {vendorData?.product_tax_percent &&
                                  parseFloat(vendorData.product_tax_percent) > 0
                                    ? `GST (${vendorData.product_tax_percent}%)`
                                    : "Fixed Tax"}
                                </TableCell>
                              </TableRow>

                              {vendorData?.product_tax_percent &&
                              parseFloat(vendorData.product_tax_percent) > 0 ? (
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      border: 0,
                                      pl: 6,
                                      py: 0.5,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Tax Amount
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      border: 0,
                                      py: 0.5,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    ₹
                                    {formData.net_sub_price_after_tax?.toFixed(
                                      2
                                    ) || "0.00"}
                                  </TableCell>
                                </TableRow>
                              ) : vendorData?.product_tax_amount &&
                                parseFloat(vendorData.product_tax_amount) >
                                  0 ? (
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      border: 0,
                                      pl: 6,
                                      py: 0.5,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Fixed Tax
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      border: 0,
                                      py: 0.5,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    ₹{vendorData.product_tax_amount}
                                  </TableCell>
                                </TableRow>
                              ) : null}
                            </>
                          )}

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                borderTop: "1px solid #e0e0e0",
                                pt: 2,
                                fontWeight: 700,
                                fontSize: "1rem",
                              }}
                            >
                              Total Amount
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                borderTop: "1px solid #e0e0e0",
                                pt: 2,
                                fontWeight: 700,
                                fontSize: "1rem",
                              }}
                            >
                              ₹{formData.final_total?.toFixed(2) || "0.00"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
              </Box>
            )}
          </Box>

          {/* Fixed Action Buttons */}
          <Box
            className="border-t bg-white p-4 flex gap-3"
            sx={{ position: "sticky", bottom: 0, zIndex: 10 }}
          >
            {/* Show "Next" if on Customer Tab */}
            {activeTab === 0 && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCloseInvoiceModal}
                  disabled={isGeneratingInvoice}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveTab(1)}
                  disabled={
                    !formData.customerNumber ||
                    formData.customerNumber.length < 10
                  }
                  fullWidth
                >
                  Next
                </Button>
              </>
            )}

            {/* Show "Back" + "Sell & Send" if on Products Tab */}
            {activeTab === 1 && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setActiveTab(0)}
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSellAndSendInvoice}
                  disabled={
                    isGeneratingInvoice ||
                    formData.product_list.length === 0 ||
                    !formData.customerNumber
                  }
                  startIcon={
                    isGeneratingInvoice ? (
                      <CircularProgress size={20} />
                    ) : (
                      <WhatsApp />
                    )
                  }
                  fullWidth
                >
                  {isGeneratingInvoice
                    ? "Sending..."
                    : "Sell & Send via WhatsApp"}
                </Button>
              </>
            )}
          </Box>
        </Drawer>

        {/* Add this modal for creating new appointments */}
        <Modal
          open={checkoutModalOpen}
          onClose={handleCloseCheckoutModal}
          aria-labelledby="checkout-modal-title"
          aria-describedby="checkout-modal-description"
          sx={{
            display: "flex",
            justifyContent: "end",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "100%",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "12px 0 0 12px",
              overflow: "auto",
            }}
          >
            <div className="flex justify-between items-center ml-4">
              <h2
                id="checkout-modal-title"
                className="text-xl font-semibold text-black"
              >
                {newAppointmentData
                  ? "Appointment Created Successfully"
                  : "Create New Appointment & Invoice's"}
              </h2>
              <IconButton onClick={handleCloseCheckoutModal}>
                <Close />
              </IconButton>
            </div>
            <Checkout
              appointment={null}
              // handleToastmessage={(message, type) => {
              //   if (type === "success") {
              //     toast.success(message);
              //   } else {
              //     toast.error(message);
              //   }
              // }}
              closeDrawer={handleCloseCheckoutModal}
              setAppointmentData={setNewAppointmentData}
              isNewAppointment={true}
              onCreateAppointment={async (appointmentData) => {
                const result = await handleCreateNewAppointment(
                  appointmentData
                );
                if (result.success) {
                  setNewAppointmentData(result.data);
                }
                return result;
              }}
            />
          </Box>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          sx={{ zIndex: "10000000" }}
          onClose={handleCloseEdit}
          open={openModelEdit}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Edit product
                </h2>
                <IconButton onClick={handleCloseEdit}>
                  <Close />
                </IconButton>
              </div>

              {/* Product Info */}
              <div className="flex flex-row sm:flex-row gap-4 items-start mt-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    {editProductData.product_name}
                  </p>
                  <p className="text-gray-500">
                    {editProductData.product_brand} • {editProductData.PIN}
                  </p>
                </div>
                <p className="text-xl font-semibold mt-4 sm:mt-0 sm:ml-auto">
                  ₹{editProductData.price_per_unit * editProductData.qauntity}
                </p>
              </div>

              {/* Price and Quantity */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  value={editProductData.price_per_unit}
                />
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  value={editProductData.qauntity}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <div className="flex items-center">
                        <button
                          className="px-3 py-2 text-gray-700"
                          onClick={() => {
                            if (editProductData.qauntity > 1) {
                              setEditProductData({
                                ...editProductData,
                                qauntity: editProductData.qauntity - 1,
                              });
                            }
                          }}
                        >
                          -
                        </button>
                      </div>
                    ),
                    endAdornment: (
                      <div
                        className="flex items-center"
                        onClick={() => {
                          setEditProductData({
                            ...editProductData,
                            qauntity: editProductData.qauntity + 1,
                          });
                        }}
                      >
                        <button className="px-3 py-2 text-gray-700">+</button>
                      </div>
                    ),
                  }}
                />
              </div>

              {/* Discount */}
              <div className="mt-4">
                <TextField
                  label="Discount"
                  variant="outlined"
                  fullWidth
                  helperText={`Discounted amount : ₹ ${
                    editProductData.discount_unit == "percentage"
                      ? editProductData.price_per_unit *
                        editProductData.qauntity *
                        (editProductData.discount / 100)
                      : editProductData.discount
                  }`}
                  InputProps={{
                    startAdornment: (
                      <select
                        value={editProductData.discount_unit}
                        className="px-2 py-1 border-none outline-none bg-transparent mr-3"
                        onChange={(e) => {
                          setEditProductData({
                            ...editProductData,
                            discount_unit: e.target.value,
                          });
                        }}
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">₹</option>
                      </select>
                    ),
                  }}
                  value={editProductData.discount}
                  onChange={(e) => {
                    if (
                      editProductData.discount_unit == "percentage" &&
                      e.target.value > 100
                    ) {
                      return;
                    }

                    if (
                      editProductData.discount_unit == "fixed" &&
                      e.target.value >
                        editProductData.price_per_unit *
                          editProductData.qauntity
                    ) {
                      return;
                    }

                    setEditProductData({
                      ...editProductData,
                      discount: e.target.value,
                    });
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-row sm:flex-row justify-between items-center mt-6">
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => {
                      const updatedProductList = formData.product_list.filter(
                        (product) =>
                          product.product_id != editProductData.product_id
                      );

                      setFormData((prev) => ({
                        ...prev,
                        product_list: updatedProductList,
                      }));

                      handleCloseEdit();
                    }}
                    color="default"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
                <div className="flex flex-row sm:flex-row gap-4 mt-4 sm:mt-0">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={handleCloseEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => {
                      const updatedProductList = formData.product_list.map(
                        (product) =>
                          product.product_id == editProductData.product_id
                            ? {
                                ...product,
                                qauntity: editProductData.qauntity,
                                price_per_unit: editProductData.price_per_unit,
                                discount: editProductData.discount,
                                discount_unit: editProductData.discount_unit,
                                net_sub_total:
                                  editProductData.qauntity *
                                    editProductData.price_per_unit -
                                  (editProductData.discount_unit == "percentage"
                                    ? editProductData.qauntity *
                                      editProductData.price_per_unit *
                                      (editProductData.discount / 100)
                                    : editProductData.discount),
                              }
                            : product
                      );

                      setFormData((prev) => ({
                        ...prev,
                        product_list: updatedProductList,
                      }));

                      handleCloseEdit();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
