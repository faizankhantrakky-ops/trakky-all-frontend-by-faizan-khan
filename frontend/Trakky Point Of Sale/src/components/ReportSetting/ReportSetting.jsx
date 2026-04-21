import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  ReceiptIndianRupee,
  Users,
  TrendingUp,
  Target,
  MessageCircle,
  Shield,
  Smartphone,
  FileText,
  Check,
  Send,
  Loader2,
  Building,
  PieChart,
  Download,
  Phone,
  Filter,
  X,
  Home,
  ClipboardList,
  ShoppingBag,
  User,
  Utensils,
  Users as StaffIcon,
  Settings,
  FileText as ReportIcon,
  StickyNote,
  Calendar as CalendarIcon,
} from "lucide-react";

const ReportSetting = () => {
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [selectedReports, setSelectedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Check if mobile on mount and resize
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Report types based on your menu items
  const reportTypes = [
    {
      id: "dashboard",
      name: "Dashboard Report",
      icon: Home,
      description: "Overall business performance and metrics",
      category: "overview",
      accessKey: "DashaBoard",
    },

    {
      id: "clients",
      name: "Clients Report",
      icon: Users,
      description: "Client information and engagement insights",
      category: "clients",
      accessKey: "Clients",
    },
    {
      id: "staff",
      name: "Staff Performance Report",
      icon: StaffIcon,
      description: "Team performance and productivity metrics",
      category: "operations",
      accessKey: "Staff",
    },
        {
      id: "appointment",
      name: "Appointment Report",
      icon: Calendar,
      description: "Scheduled meetings and booking analytics",
      category: "operations",
      accessKey: "Appointment",
    },
    {
      id: "inventory",
      name: "Beauty Product Report",
      icon: ShoppingBag,
      description: "Product stock levels and sales analytics",
      category: "inventory",
      accessKey: "Inventory",
    },
    {
      id: "daily-expense-list",
      name: "Daily Expenses Report",
      icon: ReceiptIndianRupee,
      description: "Daily operational costs and expense tracking",
      category: "finance",
      accessKey: "DailyExpenses",
    },
   
    {
      id: "customer-segment",
      name: "Customer Report",
      icon: User,
      description: "Types of customers and segmentation analysis",
      category: "clients",
      accessKey: "CustomerSegment",
    },
    {
      id: "settings",
      name: "Settings Report",
      icon: Settings,
      description: "System configuration and settings overview",
      category: "operations",
      accessKey: "Settings",
    },
    {
      id: "sales",
      name: "Sales Analytics Report",
      icon: TrendingUp,
      description: "Revenue and sales performance metrics",
      category: "finance",
      accessKey: "Sales",
    },
    {
      id: "marketing",
      name: "Marketing Performance Report",
      icon: Target,
      description: "Campaign performance and marketing ROI",
      category: "marketing",
      accessKey: "Marketing",
    },
  ];

  const features = [
    {
      icon: MessageCircle,
      text: "Instant Delivery",
      description: "Direct to WhatsApp",
    },
    { icon: Shield, text: "Secure Data", description: "Encrypted transfer" },
    { icon: FileText, text: "PDF Format", description: "Professional layout" },
    { icon: Building, text: "Enterprise Ready", description: "Business grade" },
  ];

  const filterCategories = [
    { id: "all", name: "All Reports", count: reportTypes.length },
    {
      id: "overview",
      name: "Overview",
      count: reportTypes.filter((r) => r.category === "overview").length,
    },
   
    {
      id: "inventory",
      name: "Inventory",
      count: reportTypes.filter((r) => r.category === "inventory").length,
    },
     {
      id: "operations",
      name: "Operations",
      count: reportTypes.filter((r) => r.category === "operations").length,
    },
    {
      id: "clients",
      name: "Clients",
      count: reportTypes.filter((r) => r.category === "clients").length,
    },
    {
      id: "finance",
      name: "Finance",
      count: reportTypes.filter((r) => r.category === "finance").length,
    },
    {
      id: "services",
      name: "Services",
      count: reportTypes.filter((r) => r.category === "services").length,
    },
    {
      id: "marketing",
      name: "Marketing",
      count: reportTypes.filter((r) => r.category === "marketing").length,
    },
  ];

  const filteredReports =
    activeFilter === "all"
      ? reportTypes
      : reportTypes.filter((report) => report.category === activeFilter);

  const toggleReportSelection = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || selectedReports.length === 0) return;

    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      if (start > end) {
        alert("Start date cannot be after end date");
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const selectedNames = selectedReports
        .map((id) => reportTypes.find((r) => r.id === id)?.name)
        .join(", ");

      const dateInfo =
        dateRange.startDate && dateRange.endDate
          ? ` for period ${dateRange.startDate} to ${dateRange.endDate}`
          : "";

      alert(
        `${selectedNames} will be sent to WhatsApp: ${phoneNumber}${dateInfo}`
      );
      setPhoneNumber("");
      setSelectedReports([]);
      setDateRange({ startDate: "", endDate: "" });
    }, 2000);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const clearFilter = () => {
    setActiveFilter("all");
  };

  const selectAllReports = () => {
    setSelectedReports(reportTypes.map((report) => report.id));
  };

  const clearAllReports = () => {
    setSelectedReports([]);
  };

  const clearDateRange = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  const TodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden">
        {/* Responsive Header */}
        <div className="border-b border-gray-300 bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Instant Generate Salon Reports
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Select report's and Receive Via WhatsApp
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm text-gray-500">Reports Selected</div>
              <div className="text-xl sm:text-2xl md:text-2xl font-bold text-[#492DBD]">
                {selectedReports.length}
              </div>
              <div className="text-xs text-gray-500">
                of {reportTypes.length} available
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Flex Container */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Report Selection */}
          <div className="w-full lg:w-2/3 lg:border-r border-gray-200 bg-white">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Header with Select All/Clear All */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Available Reports
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Based on your business Modules
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                    <PieChart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{reportTypes.length} report types</span>
                  </div>
                  <div className="flex space-x-2 order-1 sm:order-2">
                    <button
                      onClick={selectAllReports}
                      className="px-2 sm:px-3 py-1 text-xs bg-[#492DBD] text-white rounded hover:bg-[#3a2199] transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllReports}
                      className="px-2 sm:px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Section - Responsive */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Filter by Categories
                    </span>
                  </div>
                  {activeFilter !== "all" && (
                    <button
                      onClick={clearFilter}
                      className="flex items-center space-x-1 text-xs sm:text-sm text-[#492DBD] hover:text-[#3a2199]"
                    >
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>Clear Filter</span>
                    </button>
                  )}
                </div>

                {/* Responsive Filter Buttons - Horizontal Scroll on Mobile */}
                <div className="overflow-x-auto pb-2 -mx-1 px-1">
                  <div className="flex flex-nowrap lg:flex-wrap gap-2 min-w-min">
                    {filterCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                          activeFilter === category.id
                            ? "bg-[#492DBD] text-white border-[#492DBD]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#492DBD] hover:text-[#492DBD]"
                        }`}
                      >
                        {category.name}
                        <span
                          className={`ml-1.5 sm:ml-2 px-1 sm:px-1.5 py-0.5 rounded text-xs ${
                            activeFilter === category.id
                              ? "bg-white text-[#492DBD]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reports Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => {
                    const IconComponent = report.icon;
                    const isSelected = selectedReports.includes(report.id);

                    return (
                      <div
                        key={report.id}
                        onClick={() => toggleReportSelection(report.id)}
                        className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#492DBD] bg-[#492DBD] bg-opacity-5"
                            : "border-gray-200 hover:border-[#492DBD] hover:border-opacity-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div
                            className={`p-1.5 sm:p-2 rounded ${
                              isSelected ? "bg-[#492DBD]" : "bg-gray-100"
                            }`}
                          >
                            <IconComponent
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                isSelected ? "text-white" : "text-[#492DBD]"
                              }`}
                            />
                          </div>
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 border rounded flex items-center justify-center ${
                              isSelected
                                ? "border-[#492DBD] bg-[#492DBD]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <h3
                          className={`text-sm sm:text-base font-semibold mb-1 ${
                            isSelected ? "text-[#492DBD]" : "text-gray-900"
                          }`}
                        >
                          {report.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div
                            className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded inline-block ${
                              isSelected
                                ? "bg-[#492DBD] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {report.category.charAt(0).toUpperCase() +
                              report.category.slice(1)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {report.accessKey}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-1 sm:col-span-2 text-center py-6 sm:py-8">
                    <div className="text-xs sm:text-sm text-gray-400 mb-2">
                      No report's found for this filter
                    </div>
                    <button
                      onClick={clearFilter}
                      className="text-xs sm:text-sm text-[#492DBD] hover:text-[#3a2199] font-medium"
                    >
                      Clear filter to see all reports
                    </button>
                  </div>
                )}
              </div>

              {/* Features Section - Responsive */}
              <div className="mt-8 sm:mt-12 border-t border-gray-200 pt-6 sm:pt-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                  Enterprise Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {features.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#492DBD] bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <FeatureIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#492DBD]" />
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 mb-0.5 sm:mb-1">
                          {feature.text}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feature.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Delivery Form - Responsive */}
          <div className="w-full lg:w-1/3 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Report Delivery
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Enter your WhatsApp number to receive selected reports instantly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Phone Input */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3"
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>WhatsApp Number</span>
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs sm:text-sm">+</span>
                    </div>
                    <input
                      type="text"
                      id="phone"
                      value={phoneNumber}
                      onChange={handleNumberChange}
                      placeholder="Enter your number"
                      className="block w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD] text-gray-900 placeholder-gray-400"
                      maxLength={15}
                    />
                  </div>
                </div>

                {/* Date Range Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Date Range (Optional)</span>
                    </div>
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">
                        Select report period
                      </span>
                      {(dateRange.startDate || dateRange.endDate) && (
                        <button
                          type="button"
                          onClick={clearDateRange}
                          className="text-xs text-[#492DBD] hover:text-[#3a2199]"
                        >
                          Clear dates
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={dateRange.startDate}
                          onChange={handleDateChange}
                          max={TodayDate()}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD] text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={dateRange.endDate}
                          onChange={handleDateChange}
                          max={TodayDate()}
                          min={dateRange.startDate}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD] text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    {dateRange.startDate && dateRange.endDate && (
                      <div className="bg-blue-50 rounded-md p-2 border border-blue-200">
                        <p className="text-xs text-blue-700 text-center">
                          Reports will be generated for period:
                          <br />
                          <span className="font-medium">
                            {dateRange.startDate} to {dateRange.endDate}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Reports - Responsive */}
                {selectedReports.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                        Selected Reports
                      </h4>
                      <span className="text-xs sm:text-sm text-[#492DBD] bg-[#492DBD] bg-opacity-10 px-2 py-0.5 sm:py-1 rounded">
                        {selectedReports.length} reports
                      </span>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                      {selectedReports.map((reportId) => {
                        const report = reportTypes.find(
                          (r) => r.id === reportId
                        );
                        const ReportIcon = report?.icon;
                        return (
                          <div
                            key={reportId}
                            className="flex items-center justify-between text-xs sm:text-sm py-1.5 sm:py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <ReportIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#492DBD]" />
                              <span className="text-gray-700 truncate max-w-[120px] sm:max-w-[180px]">
                                {report?.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleReportSelection(reportId)}
                              className="text-xs text-gray-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#492DBD] text-white py-3 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-[#3a2199] focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1.5 sm:space-x-2"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Report Send to WhatsApp</span>
                </button>

                {/* Additional Info */}
                <div className="border-t border-gray-300 pt-3 sm:pt-4">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Reports delivered as PDF within 2-3 minutes</span>
                  </div>
                  {dateRange.startDate && dateRange.endDate && (
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">
                        Date range: {dateRange.startDate} to {dateRange.endDate}
                      </span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSetting;