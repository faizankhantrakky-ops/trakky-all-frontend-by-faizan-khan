import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Package,
  Gift,
  CreditCard,
  Users,
  FileText,
  BarChart,
  ChevronRight,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  Share2,
  PieChart,
  LineChart,
  MoreVertical,
  Clock,
  Target,
  Award,
  Bell,
  Settings,
  Info,
  Shield,
  Database,
  Layers,
  Activity,
  Eye,
  EyeOff,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  X,
  Check,
  IndianRupee,
  LayoutDashboard,
  Briefcase,
  Box,
  User,
  Users as UsersIcon,
  FileBarChart,
  PieChart as PieChartIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Gift as GiftIcon,
  Menu,
  ChevronLeft,
  Receipt,
  BarChart3,
  UserPlus,
  UserCheck,
  Star,
  AlertTriangle,
  ShoppingCart
} from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AuthContext from "../../Context/Auth";
import toast from "react-hot-toast";

const DailyReports = () => {
  const [dateRange, setDateRange] = useState("today");
  const [viewMode, setViewMode] = useState("detailed");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("today");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [expandedSections, setExpandedSections] = useState({
    sales: true,
    metrics: true,
    reconciliation: true,
    payments: false,
  });
  
  // New state for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeReport, setActiveReport] = useState("dashboard");
  const [expandedCategories, setExpandedCategories] = useState({
    overview: true,
    operations: true,
    inventory: true,
    clients: true,
    financess: true,
  });

  const API_URLS = "https://backendapi.trakky.in/salonvendor/analytics/daily-report/";
  const SALES_SUMMARY_URL =
    "https://backendapi.trakky.in/salonvendor/analytics/sales-summary/";
  const SALES_EXCEL_URL =
    "https://backendapi.trakky.in/salonvendor/analytics/sales-summary-excel/";
  const { authTokens, vendorData } = useContext(AuthContext);

  // Report categories with their items
  const reportCategories = [
    {
      id: "overview",
      name: "Overview",
      icon: LayoutDashboard,
      reports: [
        { id: "dashboard", name: "Dashboard Report", path: "/reports/dashboard", icon: LayoutDashboard, description: "Overall business performance and metrics" },
       
      ]
    },
   
   {
  id: "inventory",
  name: "Inventory",
  icon: Box,
  reports: [
    {
      id: "inventory",
      name: "Beauty Product Report",
      path: "/reports/inventory",
      icon: Package,
      description: "Product stock level and sales analytics"
    },
    {
      id: "lowstock",
      name: "Low Stock Report",
      path: "/reports/lowstock",
      icon: AlertTriangle,
      description: "Products that are running low in stock"
    },
    {
      id: "topsellingproducts",
      name: "Top Selling Products Report",
      path: "/reports/top-products",
      icon: TrendingUp,
      description: "Most sold beauty products and sales trends"
    },
    {
      id: "purchasehistory",
      name: "Purchase History Report",
      path: "/reports/purchase-history",
      icon: ShoppingCart,
      description: "Inventory purchase and restock history"
    }
  ]
},

 {
      id: "operations",
      name: "Operations",
      icon: Briefcase,
      reports: [
        { id: "appointment", name: "Appointment Report", path: "/reports/appointment", icon: Calendar, description: "Scheduled meetings and booking analytics" },
        { id: "staff", name: "Staff Performance Report", path: "/reports/staff", icon: Users, description: "Team performance and productivity metrics" },
        { id: "settings", name: "Setting Report", path: "/reports/settings", icon: Settings, description: "System configuration and settings overview" },
      ]
    },


   {
  id: "clients",
  name: "Clients",
  icon: UsersIcon,
  reports: [
    {
      id: "clients",
      name: "Clients Report",
      path: "/reports/clients",
      icon: User,
      description: "Client information and engagement insights"
    },
   
    {
      id: "newclients",
      name: "New Clients Report",
      path: "/reports/newclients",
      icon: UserPlus,
      description: "Track newly acquired clients over time"
    },
     {
      id: "customersegment",
      name: "Customer Segmentation Report",
      path: "/reports/customersegment",
      icon: PieChartIcon,
      description: "Types of customers and segmentation analysis"
    },

    {
      id: "returningclients",
      name: "Returning Clients Report",
      path: "/reports/returningclients",
      icon: UserCheck,
      description: "Clients who revisit and repeat bookings"
    },
    {
      id: "topclients",
      name: "Top Clients Report",
      path: "/reports/topclients",
      icon: Star,
      description: "Highest spending and most loyal clients"
    }
  ]
},
   {
  id: "financess",
  name: "Finance",
  icon: IndianRupee,
  reports: [
    {
      id: "dailyexpenses",
      name: "Daily Expenses Report",
      path: "/reports/dailyexpenses",
      icon: FileBarChart,
      description: "Daily operational costs and expense tracking"
    },
    {
      id: "sales",
      name: "Sales Analytics Report",
      path: "/reports/sales",
      icon: TrendingUpIcon,
      description: "Revenue and sales performance metrics"
    },
   
    {
      id: "profitloss",
      name: "Profit & Loss Report",
      path: "/reports/profit-loss",
      icon: BarChart3,
      description: "Overall profit and loss analysis"
    },
    {
      id: "paymentmethods",
      name: "Payment Methods Report",
      path: "/reports/payment-methods",
      icon: CreditCard,
      description: "Cash, UPI, card and other payment breakdown"
    },
     {
      id: "marketing",
      name: "Marketing Performance Report",
      path: "/reports/marketing",
      icon: GiftIcon,
      description: "Marketing campaign effectiveness and ROI"
    },
    {
      id: "taxsummary",
      name: "Tax Summary Report",
      path: "/reports/tax-summary",
      icon: Receipt,
      description: "GST and tax related financial summary"
    }
  ]
}
  ];

  const fetchReportData = async (params = {}) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URLS, {
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
          "Content-Type": "application/json",
        },
        params: params,
      });
      if (response.data.success) {
        setReportData(response.data);
      } else {
        throw new Error("Failed to fetch report data");
      }
      const salesResponse = await axios.get(SALES_SUMMARY_URL, {
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
          "Content-Type": "application/json",
        },
        params: params,
      });
      setSalesData(salesResponse.data.sales_data || []);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(err.message || "Failed to Load report Data");
      setReportData(getMockDatas());
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockDatas = () => {
    return {
      success: true,
      report_date: "2025-12-20",
      vendor: {
        id: 1,
        business_name: "Test Salon",
        branch_name: "Main Branch",
      },
      filter: "today",
      period: {
        from: "2025-12-01",
        to: "2025-12-19",
      },
      currency: "Indian Rupees ",
      top_metrics: {
        daily_sales_target: {
          value: 0,
          target: 0,
          achievement_percentage: 1,
          status: "Above Target",
        },
        customer_satisfaction: {
          value: 0,
          target: 0,
          achievement_percentage: 0,
          status: "Below Target",
        },
        staff_utilization: {
          value: 0.0,
          target: 0,
          achievement_percentage: 0,
          status: "Above Target",
        },
        repeat_business: {
          value: 0,
          target: 0,
          achievement_percentage: 0,
          status: "Above Target",
        },
      },
      sales_summary: {
        total_sales: 1.1,
        invoice_count: 0,
        customers_served: 0,
        average_ticket: 0,
        per_customer_transaction: 0,
      },
      sales_by_category: {
        services: {
          amount: 0,
          count: 0,
          top_item: "Premium Facial",
        },
        products: {
          amount: 0,
          count: 0,
        },
        memberships: {
          amount: 0,
          count: 0,
        },
        packages: {
          amount: 0.0,
          count: 0,
        },
        gift_cards: {
          amount: 0.0,
          count: 3,
        },
        prepaid_cards: {
          amount: 0.0,
          count: 0,
        },
      },
      payment_method_distribution: {
        credit_card: 0.0,
        cash: 0.0,
        mobile_pay: 0.0,
        digital_wallet: 0.0,
        others: 0,
      },
      performance_metrics: {
        key_ratios: {
          product_to_service_percentage: 0,
          product_to_total_percentage: 0,
          customer_retention_rate: 0,
        },
        value_metrics: {
          avg_service_value: 0,
          avg_product_value: 0,
          avg_invoice_value: 0,
        },
        peak_business_hours: "6:00 PM - 8:00 PM",
      },
      reconciliation_status: {
        status: "Fully Reconciled",
        last_reconciled: "December 19, 10:32 AM",
        matched_invoices: 0,
        pending_reconciliation: 0,
        discrepancies_found: 0,
      },
      business_insights: [
        {
          type: "info",
          title: "Revenue Recognition",
          description:
            "Revenue for memberships, packages, and gift cards is recognized only upon redemption, not at point of sale.",
        },
        {
          type: "success",
          title: "Sales Calculation",
          description:
            "Sale Amount = List Price - Discounts. Taxes are excluded from sales calculations.",
        },
        {
          type: "warning",
          title: "Service Date Consideration",
          description:
            "For services and classes, sales are recorded on service date. For other items, sales date is invoice date.",
        },
      ],
    };
  };

  useEffect(() => {
    fetchReportData({ filter: "today" });
  }, []);

  const filters = [
    { id: "today", label: "Today", apiParam: "today" },
    { id: "yesterday", label: "Yesterday", apiParam: "yesterday" },
    { id: "thisWeek", label: "This Week", apiParam: "this_week" },
    { id: "thisMonth", label: "This Month", apiParam: "this_month" },
    { id: "lastMonth", label: "Last Month", apiParam: "last_month" },
  ];

  const handleFilterClick = (filter) => {
    setDateRange(filter.id);
    setCurrentFilter(filter.apiParam);
    fetchReportData({ filter: filter.apiParam });
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      const params = {
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
      };
      setCurrentFilter("custom");
      setDateRange("custom");
      fetchReportData(params);
    } else {
      toast.error("Please select both start and end date");
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const formatCurrency = (amount, showIcon = true) => {
    if (amount === undefined || amount === null) return "₹0";
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return showIcon ? formattedAmount : formattedAmount.replace("₹", "");
  };

  const formatCurrencyWithIcon = (amount) => {
    if (amount === undefined || amount === null) return "₹0";
    return (
      <span className="flex items-center">
        <IndianRupee className="w-4 h-4 mr-1" />
        {new Intl.NumberFormat("en-IN").format(Math.round(amount))}
      </span>
    );
  };

  const formatNumber = (number) => {
    if (number === undefined || number === null) return "0";
    return new Intl.NumberFormat("en-IN").format(number);
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0%";
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Above Target":
        return "bg-green-100 text-green-800";
      case "Below Target":
        return "bg-yellow-100 text-yellow-800";
      case "On Target":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case "info":
        return (
          <AlertCircle className="w-5 h-5 text-[#4E2DC4] mr-3 flex-shrink-0" />
        );
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
        );
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />;
    }
  };

  const getInsightBgColor = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const baseURL = "https://backendapi.trakky.in";
  const apiEndpoints = {
    trend: "/salonvendor/analytics/trend-report/",
    targets: "/salonvendor/analytics/performance-targets/",
    staff: "/salonvendor/analytics/staff-performance/",
    export: "/salonvendor/analytics/export-reports/",
  };

  const handleAction = async (key, label) => {
    if (!authTokens?.access_token) {
      toast.error("You are not authenticated. Please log in again.");
      return;
    }
    setLoading(key);
    try {
      const response = await fetch(`${baseURL}${apiEndpoints[key]}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Reports exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || `Failed to ${label.toLowerCase()}`);
    } finally {
      setLoading(null);
    }
  };

  const downloadSales = async () => {
    if (!authTokens?.access_token) {
      toast.error("You are not authenticated. Please log in again.");
      return;
    }

    setLoading("sales_excel");

    try {
      let params = {};
      let fileName = "Sales_Summary";

      if (currentFilter === "custom") {
        const start = startDate.format("YYYY-MM-DD");
        const end = endDate.format("YYYY-MM-DD");

        params = {
          start_date: start,
          end_date: end,
        };

        fileName = `Sales_Summary_${start} -to- ${end}`;
      } else {
        params = { filter: currentFilter };
        fileName = `Sales_Summary ${currentFilter} - ${dayjs().format(
          "YYYY-MM-DD"
        )}`;
      }

      const queryString = new URLSearchParams(params).toString();
      const url = `${baseURL}/salonvendor/analytics/sales-summary-excel/?${queryString}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${fileName}.xlsx`;
      a.click();

      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Sales summary exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to download sales summary");
    } finally {
      setLoading(null);
    }
  };

  const handleOpenReport = (reportId) => {
    setActiveReport(reportId);
    // Here you can add logic to fetch data for the selected report
    // For now, we'll just show the dashboard data
    fetchReportData({ filter: currentFilter });
  };

  if (loading && !reportData) {
    return (
      <div className="h-screen bg-gray-100 flex w-full pl-[70px]">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-gray-100 p-4 animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4">
              <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2 ml-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="h-6 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow mb-6">
            <div className="flex gap-3 mb-4">
              <div className="h-9 w-20 bg-gray-200 rounded"></div>
              <div className="h-9 w-24 bg-gray-200 rounded"></div>
              <div className="h-9 w-24 bg-gray-200 rounded"></div>
              <div className="h-9 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !reportData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Error: {error}</p>
          <button
            onClick={() => fetchReportData({ filter: currentFilter })}
            className="mt-4 px-4 py-2 bg-[#4E2DC4] text-white rounded-lg hover:bg-[#4E2DC4]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const kpiCards = [
    {
      label: "Daily Sales Targets",
      value: formatCurrency(reportData.top_metrics.daily_sales_target.value),
      target: formatCurrency(reportData.top_metrics.daily_sales_target.target),
      achievement: formatPercentage(
        reportData.top_metrics.daily_sales_target.achievement_percentage
      ),
      status: reportData.top_metrics.daily_sales_target.status
        .toLowerCase()
        .includes("above")
        ? "exceeded"
        : "below",
    },
    {
      label: "Customer Satisfactions",
      value: formatPercentage(
        reportData.top_metrics.customer_satisfaction.value
      ),
      target: formatPercentage(
        reportData.top_metrics.customer_satisfaction.target
      ),
      achievement: formatPercentage(
        reportData.top_metrics.customer_satisfaction.achievement_percentage
      ),
      status: reportData.top_metrics.customer_satisfaction.status
        .toLowerCase()
        .includes("above")
        ? "exceeded"
        : "below",
    },
    {
      label: "Staff Utilization's",
      value: formatPercentage(reportData.top_metrics.staff_utilization.value),
      target: formatPercentage(reportData.top_metrics.staff_utilization.target),
      achievement: formatPercentage(
        reportData.top_metrics.staff_utilization.achievement_percentage
      ),
      status: reportData.top_metrics.staff_utilization.status
        .toLowerCase()
        .includes("above")
        ? "exceeded"
        : "below",
    },
    {
      label: "Repeat Business",
      value: formatPercentage(reportData.top_metrics.repeat_business.value),
      target: formatPercentage(reportData.top_metrics.repeat_business.target),
      achievement: formatPercentage(
        reportData.top_metrics.repeat_business.achievement_percentage
      ),
      status: reportData.top_metrics.repeat_business.status
        .toLowerCase()
        .includes("above")
        ? "exceeded"
        : "below",
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen bg-gray-50 flex max-w-full overflow-hidden pl-0 md:pl-[70px] ">
        {/* Left Sidebar */}
      <div
  className={`
    ${sidebarOpen ? 'w-72' : 'w-20'} 
    bg-white border-r border-gray-200 
    transition-all duration-300 
    flex flex-col h-screen sticky top-0 overflow-y-auto
  `}
>
  {/* Sidebar Header */}
  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
    {sidebarOpen ? (
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-900">Reports Management</span>
      </div>
    ) : (
      <LayoutDashboard className="w-6 h-6 text-violet-600 mx-auto" />
    )}
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {sidebarOpen ? (
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      ) : (
        <Menu className="w-4 h-4 text-gray-600" />
      )}
    </button>
  </div>

  {/* Report Categories */}
  <div className="flex-1 py-5 px-1">
    {reportCategories.map((category) => {
      const Icon = category.icon;
      return (
        <div key={category.id} className="mb-1.5">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className={`
              group w-full flex items-center justify-between 
              px-4 py-2.5 rounded-lg transition-colors
              ${sidebarOpen ? '' : 'justify-center px-3'}
              hover:bg-gray-50/80 active:bg-gray-100
            `}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`
                  ${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'} 
                  text-gray-700 flex-shrink-0 transition-colors
                  ${!sidebarOpen && 'mx-auto'}
                `}
              />
              {sidebarOpen && (
                <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                  {category.name}
                </span>
              )}
            </div>

            {sidebarOpen && (
              <ChevronRight
                className={`
                  w-4 h-4 text-gray-400 transition-transform duration-200
                  ${expandedCategories[category.id] ? 'rotate-90' : ''}
                `}
              />
            )}
          </button>

          {/* Submenu - Reports */}
          {sidebarOpen && expandedCategories[category.id] && (
            <div className="ml-9 mt-1 space-y-0.5">
              {category.reports.map((report) => {
                const ReportIcon = report.icon;
                const isActive = activeReport === report.id;

                return (
                  <button
                    key={report.id}
                    onClick={() => handleOpenReport(report.id)}
                    className={`
                      group w-full flex items-center gap-2.5 
                      px-3 py-1.5 rounded-md text-left transition-all duration-150
                      ${
                        isActive
                          ? 'bg-violet-50 text-violet-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }
                    `}
                  >
                    <ReportIcon
                      className={`
                        w-3.5 h-3.5 flex-shrink-0 transition-all duration-150
                        ${
                          isActive
                            ? 'text-violet-600 scale-110'
                            : 'text-gray-500 group-hover:text-gray-700'
                        }
                      `}
                    />
                    <div className="flex-1 min-w-0 leading-tight">
                      <p className="text-xs font-medium truncate">{report.name}</p>
                      <p className="text-[10px] text-gray-500/80 truncate opacity-70 group-hover:opacity-100">
                        {report.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Collapsed mode → show report icons when category is "open" */}
          {!sidebarOpen && expandedCategories[category.id] && (
            <div className="mt-1 space-y-1 px-2">
              {category.reports.map((report) => {
                const ReportIcon = report.icon;
                const isActive = activeReport === report.id;

                return (
                  <button
                    key={report.id}
                    onClick={() => handleOpenReport(report.id)}
                    className={`
                      w-full py-2 flex justify-center rounded-md transition-colors
                      ${isActive ? 'bg-violet-100/40' : 'hover:bg-gray-100'}
                    `}
                    title={`${report.name}\n${report.description}`}
                  >
                    <ReportIcon
                      className={`
                        w-5 h-5 transition-colors
                        ${isActive ? 'text-violet-600' : 'text-gray-600 hover:text-gray-800'}
                      `}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>

  {/* Sidebar Footer */}
  <div className="p-4 border-t border-gray-200">
    {sidebarOpen ? (
      <div className="bg-violet-50/60 p-3 rounded-lg">
        <p className="text-xs font-medium text-violet-800 mb-1">Report Period</p>
        <p className="text-xs text-gray-600">
          {reportData.period.from} – {reportData.period.to}
        </p>
      </div>
    ) : (
      <Calendar className="w-5 h-5 text-gray-500 mx-auto" />
    )}
  </div>
</div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {reportCategories
                        .flatMap(c => c.reports)
                        .find(r => r.id === activeReport)?.name || 'Daily Business Reports'}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {reportData.report_date} • {reportData.vendor.business_name} • {reportData.vendor.branch_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Period: {reportData.period.from} to {reportData.period.to}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div

                  
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      reportData.reconciliation_status.status === "Fully Reconciled"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {reportData.reconciliation_status.status}
                  </div>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Report Controls */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Report Controls
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Currency:</span>
                    <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span className="font-medium">{reportData.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => handleFilterClick(filter)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          dateRange === filter.id
                            ? "bg-[#4E2DC4] text-white border-[#4E2DC4]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                height: "40px",
                                fontSize: "14px",
                              },
                            },
                          },
                        }}
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                height: "40px",
                                fontSize: "14px",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <button
                      onClick={handleCustomDateApply}
                      className="flex items-center px-4 py-2 bg-[#4E2DC4] text-white rounded-lg hover:bg-[#4E2DC4]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {kpiCards.map((kpi, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      {kpi.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        reportData.top_metrics[
                          Object.keys(reportData.top_metrics)[index]
                        ].status
                      )}`}
                    >
                      {kpi.achievement}
                    </span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-2">
                    {kpi.value}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Target: {kpi.target}</span>
                    {kpi.status === "exceeded" ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Above Target
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Below Target
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Sales Summary
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Daily sales performance metrics (All amounts in ₹)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1 flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          Total Sales
                        </div>
                        <div className="text-2xl font-semibold text-gray-900 flex items-center">
                          <IndianRupee className="w-5 h-5 mr-1" />
                          {formatNumber(
                            Math.round(reportData.sales_summary.total_sales)
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {reportData.sales_summary.customers_served} customers
                          served
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">
                          Invoice Count
                        </div>
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatNumber(reportData.sales_summary.invoice_count)}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Total transactions processed
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1 flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          Average Ticket
                        </div>
                        <div className="text-2xl font-semibold text-gray-900 flex items-center">
                          <IndianRupee className="w-5 h-5 mr-1" />
                          {formatNumber(
                            Math.round(reportData.sales_summary.average_ticket)
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Per customer transaction
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-2" />
                        Sales by Categories
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Regular categories – services, products, memberships, etc. */}
                        {Object.entries(reportData.sales_by_category)
                          .filter(([key]) => key !== "total")
                          .map(([category, data]) => (
                            <div
                              key={category}
                              className="border border-gray-200 rounded-lg p-4 hover:border-[#4E2DC4] transition-colors"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="font-medium text-gray-900 capitalize">
                                    {category.replace("_", " ")}
                                  </div>
                                  {data.top_item && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Top: {data.top_item}
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {data.count || 0} sold
                                </div>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <div className="text-lg font-semibold text-gray-900 flex items-center">
                                  <IndianRupee className="w-3 h-3 mr-1" />
                                  {formatNumber(Math.round(data.amount || 0))}
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Payment methods – same card style, placed as additional items in the grid */}
                        {reportData.payment_method_distribution &&
                          Object.entries(reportData.payment_method_distribution)
                            .filter(([key]) => key !== "total")
                            .map(([method, data]) => (
                              <div
                                key={`payment-${method}`}
                                className="border border-gray-200 rounded-lg p-4 hover:border-[#4E2DC4] transition-colors bg-blue-50/30"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="font-medium text-gray-900 capitalize">
                                      {method.replace("_", " ")}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Payment method
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-baseline justify-between">
                                  <div className="text-lg font-semibold text-gray-900 flex items-center">
                                    <IndianRupee className="w-3 h-3 mr-1" />
                                    {formatNumber(Math.round(data.amount || 0))}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {data.count || 0} Transaction
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Reconciliation Status
                      </h2>
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span
                          className={`font-semibold ${
                            reportData.reconciliation_status.status ===
                            "Fully Reconciled"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {reportData.reconciliation_status.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Reconciled</span>
                        <span className="font-semibold text-gray-900">
                          {reportData.reconciliation_status.last_reconciled}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Matched Invoices</span>
                        <span className="font-semibold text-gray-900">
                          {reportData.reconciliation_status.matched_invoices}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Pending Reconciliation
                        </span>
                        <span className="font-semibold text-gray-900">
                          {
                            reportData.reconciliation_status
                              .pending_reconciliation
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Discrepancies Found</span>
                        <span className="font-semibold text-gray-900">
                          {reportData.reconciliation_status.discrepancies_found}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <button className="w-full flex items-center justify-center py-2 bg-[#4E2DC4] text-white rounded-lg hover:bg-gray-900">
                          <Database className="w-4 h-4 mr-2" />
                          View Reconciliation Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Quick Actions
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAction("trend", "Generate Report")}
                        disabled={loading === "trend"}
                        className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#4E2DC4] hover:bg-blue-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center">
                          <LineChart className="w-4 h-4 text-[#4E2DC4] mr-3" />
                          <span className="font-medium text-gray-900">
                            Generate Daily Report
                          </span>
                        </div>
                        {loading === "trend" ? (
                          <div className="w-4 h-4 border-2 border-[#4E2DC4] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleAction("trend", "Generate Monthly Report")
                        }
                        disabled={loading === "trend"}
                        className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-[#4E2DC4] hover:bg-blue-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center">
                          <LineChart className="w-4 h-4 text-[#4E2DC4] mr-3" />
                          <span className="font-medium text-gray-900">
                            Generate Monthly Report
                          </span>
                        </div>
                        {loading === "trend" ? (
                          <div className="w-4 h-4 border-2 border-[#4E2DC4] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleAction("staff", "Staff Performance Review")
                        }
                        disabled={loading === "staff"}
                        className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-purple-600 mr-3" />
                          <span className="font-medium text-gray-900">
                            Staff Performance Review
                          </span>
                        </div>
                        {loading === "staff" ? (
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleAction("export", "Export All Reports")
                        }
                        disabled={loading === "export"}
                        className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center">
                          <Download className="w-4 h-4 text-orange-600 mr-3" />
                          <span className="font-medium text-gray-900">
                            Export All Reports
                          </span>
                        </div>
                        {loading === "export" ? (
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Sales Transactions Table */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Detailed Sales Transactions
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    All individual bill records for the selected period
                  </p>
                </div>
                <button
                  onClick={downloadSales}
                  disabled={loading === "sales_excel"}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4E2DC4] text-white rounded-lg hover:bg-[#3a1fa3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading === "sales_excel" ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export to Excel
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        {[
                          "Store Location",
                          "Bill Id",
                          "Date",
                          "Time",
                          "Customer Phone",
                          "Customer Name",
                          "Gender",
                          "Staff",
                          "Bill Amt",
                          "Payable",
                          "Cash Paid",
                          "UPI",
                          "CGST",
                          "SGST",
                          "IGST",
                          "Total GST",
                          "Membership Disc",
                          "Percent Disc",
                          "Cash Disc",
                          "Coupon Disc",
                          "Loyalty Disc",
                          "Pending",
                          "Wallet",
                          "Mem. Wallet",
                          "Source",
                          "Company",
                          "GST No.",
                        ].map((header, i) => (
                          <th
                            key={i}
                            className={`px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                              // Right-align all monetary/numeric columns + Time
                              [
                                "Time",
                                "Bill Amt",
                                "Payable",
                                "Cash Paid",
                                "UPI",
                                "CGST",
                                "SGST",
                                "IGST",
                                "Total GST",
                                "Membership Disc",
                                "Percent Disc",
                                "Cash Disc",
                                "Coupon Disc",
                                "Loyalty Disc",
                                "Pending",
                                "Wallet",
                                "Mem. Wallet",
                              ].includes(header)
                                ? "text-right"
                                : "text-left"
                            }`}
                            style={{
                              minWidth:
                                header === "Store Location" ? "220px" :
                                header === "Customer Name" ? "180px" :
                                header === "Customer Phone" ? "140px" :
                                header === "Bill Id" ? "130px" :
                                header === "Company" ? "160px" :
                                header === "GST No." ? "140px" :
                                "110px",
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesData.length === 0 ? (
                        <tr>
                          <td colSpan={27} className="px-6 py-10 text-center text-gray-500">
                            No sales transactions found for this period
                          </td>
                        </tr>
                      ) : (
                        salesData.map((item, index) => (
                          <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900 font-bold">{item.store_location}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.bill_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.bill_date}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.bill_time}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.customer_phone_number}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.customer_name || item.customerName || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.gender || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.staff_name || "—"}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(item.bill_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{formatCurrency(item.payable_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.cash_paid || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.upi || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.cgst || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.sgst || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.igst || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(item.total_gst || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.membership_discount_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.percent_discount_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.cash_discount_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.coupon_discount_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.loyalty_point_discount_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">{formatCurrency(item.pending_amount || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.wallet_payment || 0)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.membership_wallet_payment || 0)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.customer_registration_source || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.company_name || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.customer_gst_number || "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>

                    {/* Footer with Totals */}
                    {salesData.length > 0 && (
                      <tfoot className="bg-gray-200 font-semibold">
                        <tr>
                          <td className="px-4 py-4 text-left text-gray-900 font-medium">Total</td>
                          <td colSpan={7}></td>
                          <td className="px-4 py-4 text-right font-bold">{formatCurrency(salesData.reduce((sum, i) => sum + (i.bill_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right font-bold">{formatCurrency(salesData.reduce((sum, i) => sum + (i.payable_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.cash_paid || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.upi || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.cgst || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.sgst || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.igst || 0), 0))}</td>
                          <td className="px-4 py-4 text-right font-bold">{formatCurrency(salesData.reduce((sum, i) => sum + (i.total_gst || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.membership_discount_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.percent_discount_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.cash_discount_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.coupon_discount_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.loyalty_point_discount_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right text-red-600">{formatCurrency(salesData.reduce((sum, i) => sum + (i.pending_amount || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.wallet_payment || 0), 0))}</td>
                          <td className="px-4 py-4 text-right">{formatCurrency(salesData.reduce((sum, i) => sum + (i.membership_wallet_payment || 0), 0))}</td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600 bg-gray-50">
                Showing {salesData.length} transaction
                {salesData.length !== 1 ? "s" : ""} • Last updated:{" "}
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </LocalizationProvider>
  );
};

export default DailyReports;

