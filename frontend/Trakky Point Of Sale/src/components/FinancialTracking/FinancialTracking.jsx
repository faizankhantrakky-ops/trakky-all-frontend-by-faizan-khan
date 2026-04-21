import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Settings,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Eye,
  Users,
  TrendingUp,
  Award,
  CreditCard,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  Printer,
  Plus,
  ChevronDown,
  Activity,
  PieChart,
  IndianRupee,
  Sparkles,
  Wallet,
  Calculator,
  Percent,
  Building,
  MapPin,
  UserCheck,
  Shield,
  Bell,
  ArrowUpDown,
  Edit,
  Trash2,
  Upload,
  X,
  Menu,
  Home,
  Mail,
  Phone,
  Star,
  Crown,
  Zap,
  Gift,
  Heart,
  Trophy,
  TrendingDown,
  ChevronLeft,
  Smartphone,
  User,
  DollarSign,
  Grid,
  List,
} from "lucide-react";

const FinancialTracking = () => {
  const [activeTab, setActiveTab] = useState("payroll");
  const [searchTerm, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [payPeriod, setPayPeriod] = useState("01-15 Oct 2024");
  const [commissionFilter, setCommissionFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [ShowTheMobileFilters, setShowMobileFilters] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sample data
  const payrollData = [
    {
      id: 1,
      name: "Aarav Sharma",
      employeeId: "EMP0001",
      role: "Senior Stylist",
      department: "Hair Services",
      basePay: 4200,
      commission: 1800,
      bonus: 3500,
      tips: 4500,
      deductions: 3200,
      netPay: 6530,
      status: "processed",
      payPeriod: "01-15 Oct 2024",
      overtime: 8,
      incentives: 1200,
      attendance: "95%",
      performance: "Excellent",
    },
    {
      id: 2,
      name: "Priya Patel",
      employeeId: "EMP002",
      role: "Beauty Therapist",
      department: "Skin Care",
      basePay: 38000,
      commission: 12500,
      bonus: 2800,
      tips: 3200,
      deductions: 2900,
      netPay: 54600,
      status: "pending",
      payPeriod: "01-15 Oct 2024",
      overtime: 5,
      incentives: 850,
      attendance: "92%",
      performance: "Good",
    },

    {
      id: 4,
      name: "Neha Rajput",
      employeeId: "EMP004",
      role: "Nail Artist",
      department: "Nail Care",
      basePay: 35000,
      commission: 9800,
      bonus: 2200,
      tips: 3800,
      deductions: 260,
      netPay: 4820,
      status: "processed",
      payPeriod: "01-15 Oct 2024",
      overtime: 6,
      incentives: 650,
      attendance: "90%",
      performance: "Good",
    },
  ];

  const DataForCommision = [
    {
      id: 1,
      employee: "Aarav Sharma",
      service: "Hair Coloring Premium",
      serviceCode: "HC-101",
      date: "12 Oct 2024",
      amount: 8500,
      commissionRate: "15%",
      commission: 1275,
      status: "approved",
    },
    {
      id: 2,
      employee: "Priya Patel",
      service: "Gold Facial Treatment",
      serviceCode: "GF-205",
      date: "11 Oct 2024",
      amount: 6500,
      commissionRate: "12%",
      commission: 780,
      status: "pending",
    },
    {
      id: 3,
      employee: "Rohan Singh",
      service: "Hair Spa & Treatment",
      serviceCode: "HS-108",
      date: "10 Oct 2024",
      amount: 4500,
      commissionRate: "10%",
      commission: 450,
      status: "approved",
    },
    {
      id: 4,
      employee: "Neha Gupta",
      service: "Premium Manicure",
      serviceCode: "PM-301",
      date: "09 Oct 2024",
      amount: 3200,
      commissionRate: "8%",
      commission: 256,
      status: "approved",
    },
  ];

  const incentiveData = [
    {
      id: 1,
      type: "Vacation Points",
      icon: Sparkles,
      allocated: 125,
      used: 45,
      remaining: 80,
      value: 25000,
      employees: 12,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      type: "Loyalty Bonus",
      icon: Crown,
      allocated: 2500,
      used: 1250,
      remaining: 1250,
      value: 125000,
      employees: 8,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },

    {
      id: 4,
      type: "Referral Bonus",
      icon: Gift,
      allocated: 500,
      used: 250,
      remaining: 250,
      value: 75000,
      employees: 6,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: 3,
      type: "Performance Points",
      icon: Trophy,
      allocated: 1800,
      used: 850,
      remaining: 950,
      value: 85000,
      employees: 15,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const reportData = [
    {
      id: 1,
      name: "Monthly Payroll Summary",
      type: "Payroll",
      period: "Oct 2024",
      generated: "15 Oct 2024",
      size: "2.4 MB",
      downloads: 24,
    },
    {
      id: 2,
      name: "Commission Report",
      type: "Commission",
      period: "Oct 2024",
      generated: "14 Oct 2024",
      size: "1.8 MB",
      downloads: 18,
    },
    {
      id: 3,
      name: "Incentives Distribution",
      type: "Incentive",
      period: "Q3 2024",
      generated: "01 Oct 2024",
      size: "3.2 MB",
      downloads: 12,
    },
    {
      id: 4,
      name: "Tax Deduction Report",
      type: "Tax",
      period: "Apr-Sep 2024",
      generated: "30 Sep 2024",
      size: "4.1 MB",
      downloads: 8,
    },
  ];

  const settingsData = {
    payPeriods: ["Weekly", "Bi-Weekly", "Monthly", "Custom"],
    commissionRates: {
      "Hair Services": "12-18%",
      "Skin Care": "10-15%",
      "Nail Care": "8-12%",
      Management: "5-8%",
    },
    taxSettings: {
      tds: "10%",
      pf: "12%",
      esi: "1.75%",
    },
  };

  const statusConfig = {
    processed: {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle,
      label: "Processed",
    },
    pending: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: Clock,
      label: "Pending",
    },
    approved: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: CheckCircle,
      label: "Approved",
    },
    rejected: {
      color: "text-red-600",
      bg: "bg-red-50",
      icon: X,
      label: "Rejected",
    },
    error: {
      color: "text-red-600",
      bg: "bg-red-50",
      icon: AlertCircle,
      label: "Error",
    },
  };

  const tabs = [
    { id: "payroll", label: "Payroll Manage", icon: CreditCard },
    { id: "incentives", label: "Incentives Manage", icon: Award },
    { id: "commissions", label: "Commissions Manage", icon: Percent },

    { id: "reports", label: "Reports Manage", icon: BarChart3 },
    { id: "settings", label: "Settings Manage", icon: Settings },
  ];

  // Mobile Navigation Tabs
  const mobileTabs = [
    { id: "payroll", label: "Payroll", icon: CreditCard },
    { id: "commissions", label: "Commission", icon: Percent },
    { id: "incentives", label: "Incentives", icon: Award },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mobile Stats Data
  const mobileStats = [
    {
      label: "Total Payroll",
      value: "₹2,68,900",
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Commission",
      value: "₹12,000",
      icon: Percent,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Incentives",
      value: "₹31,000",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Pending",
      value: "6",
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // Mobile Employee Card
  const MobileEViewmployeeCard = ({ employee }) => {
    const StatusIcon = statusConfig[employee.status]?.icon || Clock;
    const totalEarnings =
      employee.basePay +
      employee.commission +
      employee.bonus +
      employee.tips +
      employee.incentives;

    return (
      <div className="bg-white border border-gray-300 rounded-xl p-4 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">
                  {employee.name}
                </h4>
                <p className="text-xs text-gray-500">{employee.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                {employee.department}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-200 text-blue-600 rounded">
                OT: {employee.overtime}h
              </span>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              statusConfig[employee.status]?.bg
            }`}
          >
            <StatusIcon
              className={`w-3 h-3 ${statusConfig[employee.status]?.color}`}
            />
            <span className={statusConfig[employee.status]?.color}>
              {statusConfig[employee.status]?.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Earnings</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center justify-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              {totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Net Pay</p>
            <p className="text-sm font-bold text-gray-900 flex items-center justify-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              {employee.netPay.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              setSelectedEmployee(employee);
              setShowEmployeeDetails(true);
            }}
            className="text-xs text-blue-600 font-medium"
          >
            View Details
          </button>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Eye className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <Edit className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Commission Card
  const MobileCommissionCard = ({ commission }) => {
    const StatusIcon = statusConfig[commission.status]?.icon || Clock;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-600 text-sm mb-1">
              {commission.service}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                Code: {commission.serviceCode}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{commission.date}</span>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              statusConfig[commission.status]?.bg
            }`}
          >
            <StatusIcon
              className={`w-3 h-3 ${statusConfig[commission.status]?.color}`}
            />
            <span className={statusConfig[commission.status]?.color}>
              {statusConfig[commission.status]?.label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Commission Rate</p>
            <p className="text-sm font-bold text-purple-600">
              {commission.commissionRate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Commission</p>
            <p className="text-sm font-bold text-gray-900 flex items-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              {commission.commission.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Employee</p>
            <p className="text-sm font-medium text-gray-900">
              {commission.employee}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              {commission.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Report Card
  const MobileReportCard = ({ report }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <FileText className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">
            {report.name}
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
              {report.type}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              {report.period}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">Size: {report.size}</div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Eye className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Download className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-gray-500 text-xs">Generated</p>
          <p className="text-gray-900">{report.generated}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs">Downloads</p>
          <p className="text-gray-900">{report.downloads}</p>
        </div>
      </div>
    </div>
  );

  // Mobile Settings Section
  const MobileSettingsSection = () => (
    <div className="space-y-4">
      {/* Payroll Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payroll Settings
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pay Period
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {settingsData.payPeriods.map((period) => (
                <option key={period} value={period.toLowerCase()}>
                  {period}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              defaultValue="2024-10-25"
            />
          </div>
        </div>
      </div>

      {/* Commission Rates */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Percent className="w-4 h-4" />
          Commission Rates
        </h4>
        <div className="space-y-2">
          {Object.entries(settingsData.commissionRates).map(
            ([service, rate]) => (
              <div
                key={service}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-900">{service}</span>
                <span className="text-sm font-bold text-purple-600">
                  {rate}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Tax & Deductions
        </h4>
        <div className="space-y-2">
          {Object.entries(settingsData.taxSettings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-700 capitalize">{key}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Payroll Tab
  const renderPayrollTab = () => (
    <div className="space-y-6">
      {/* Payroll Actions */}
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Payroll Processings
            </h3>
            <p className="text-sm text-gray-500">
              Process and manage employee payroll for {payPeriod}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Select Period</span>
              <span className="sm:hidden">Period</span>
            </button>
            <button className="px-3 py-2 md:px-4 md:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 text-sm">
              <Calculator className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Calculate Payroll</span>
              <span className="sm:hidden">Calculate</span>
            </button>
            <button className="px-3 py-2 md:px-4 md:py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center gap-2 text-sm">
              <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Process Payment</span>
              <span className="sm:hidden">Process</span>
            </button>
          </div>
        </div>

        {/* Payroll Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="p-3 md:p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-emerald-700 mb-1">
                  Total Deductions
                </p>
                <p className="text-lg md:text-2xl font-bold text-emerald-900 flex items-center">
                  <IndianRupee className="w-3 h-3 md:w-5 md:h-5 mr-1" />
                  12,800
                </p>
              </div>
              <TrendingDown className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-blue-700 mb-1">
                  Total Payroll
                </p>
                <p className="text-lg md:text-2xl font-bold text-blue-900 flex items-center">
                  <IndianRupee className="w-3 h-3 md:w-5 md:h-5 mr-1" />
                  2.68L
                </p>
              </div>
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-purple-700 mb-1">
                  Overtime Hours
                </p>
                <p className="text-lg md:text-2xl font-bold text-purple-900">
                  31
                </p>
              </div>
              <Activity className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-amber-700 mb-1">
                  Pending Approval
                </p>
                <p className="text-lg md:text-2xl font-bold text-amber-900">
                  2
                </p>
              </div>
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <div className="space-y-4">
            {payrollData.map((employee) => (
              <MobileEViewmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          /* Desktop Payroll Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-y border-gray-200">
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee Details
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payrollData.map((employee) => {
                  const StatusIcon =
                    statusConfig[employee.status]?.icon || Clock;
                  const totalEarnings =
                    employee.basePay +
                    employee.commission +
                    employee.bonus +
                    employee.tips +
                    employee.incentives;
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="flex items-center">
                          <div>
                            <div
                              className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowEmployeeDetails(true);
                              }}
                            >
                              {employee.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {employee.role} • {employee.employeeId}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
                                {employee.department}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                                OT: {employee.overtime} hrs
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1" />
                            {totalEarnings.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Base: {employee.basePay.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="text-base md:text-xl font-bold text-gray-900 flex items-center">
                          <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {employee.netPay.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium ${
                            statusConfig[employee.status]?.bg
                          }`}
                        >
                          <StatusIcon
                            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                              statusConfig[employee.status]?.color
                            }`}
                          />
                          <span
                            className={statusConfig[employee.status]?.color}
                          >
                            {statusConfig[employee.status]?.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="flex items-center gap-1 md:gap-2">
                          <button
                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center z-50 p-4 ${
            isMobile
              ? "items-end justify-center"
              : "items-center justify-center"
          }`}
        >
          <div
            className={`bg-white rounded-xl ${
              isMobile
                ? "w-full max-h-[90vh] rounded-t-2xl"
                : "max-w-2xl w-full max-h-[80vh]"
            } overflow-auto`}
          >
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  Employee Payroll Details
                </h3>
                <button
                  onClick={() => setShowEmployeeDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Employee Information
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Name:</span>
                      <span className="font-medium text-sm md:text-base">
                        {selectedEmployee.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">
                        Employee ID:
                      </span>
                      <span className="font-medium text-sm md:text-base">
                        {selectedEmployee.employeeId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Department:</span>
                      <span className="font-medium text-sm md:text-base">
                        {selectedEmployee.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">
                        Performance:
                      </span>
                      <span className="font-medium text-emerald-600 text-sm md:text-base">
                        {selectedEmployee.performance}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Payroll Breakdown
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Base Pay:</span>
                      <span className="font-medium text-sm md:text-base flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {selectedEmployee.basePay.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Commission:</span>
                      <span className="font-medium text-sm md:text-base flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {selectedEmployee.commission.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Bonus:</span>
                      <span className="font-medium text-sm md:text-base flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {selectedEmployee.bonus.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-900 font-medium text-sm md:text-base">
                        Net Pay:
                      </span>
                      <span className="font-bold text-base md:text-lg flex items-center">
                        <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {selectedEmployee.netPay.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Commissions Tab
  const renderCommissionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Commission Tracking
            </h3>
            <p className="text-sm text-gray-500">
              Track and manage service commissions
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-gray-700 text-sm w-full md:w-auto"
              value={commissionFilter}
              onChange={(e) => setCommissionFilter(e.target.value)}
            >
              <option value="all">All Services</option>
              <option value="hair">Hair Services</option>
              <option value="skin">Skin Care</option>
              <option value="nails">Nail Care</option>
            </select>
            <button className="px-3 py-2 md:px-4 md:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 text-sm">
              <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Calculate</span>
            </button>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="p-3 md:p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-emerald-700 mb-1">
                  Total Commission
                </p>
                <p className="text-lg md:text-2xl font-bold text-emerald-900 flex items-center">
                  <IndianRupee className="w-3 h-3 md:w-5 md:h-5 mr-1" />
                  61,200
                </p>
              </div>
              <Percent className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-blue-700 mb-1">
                  Pending Approval
                </p>
                <p className="text-lg md:text-2xl font-bold text-blue-900">8</p>
              </div>
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-purple-700 mb-1">
                  Avg. Rate
                </p>
                <p className="text-lg md:text-2xl font-bold text-purple-900">
                  12.5%
                </p>
              </div>
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <div className="space-y-3">
            {DataForCommision.map((commission) => (
              <MobileCommissionCard
                key={commission.id}
                commission={commission}
              />
            ))}
          </div>
        ) : (
          /* Desktop Commission Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 md:py-4 px-3 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DataForCommision.map((commission) => {
                  const StatusIcon =
                    statusConfig[commission.status]?.icon || Clock;
                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div>
                          <div className="font-medium text-gray-900 text-sm md:text-base">
                            {commission.service}
                          </div>
                          <div className="text-xs text-gray-500">
                            Code: {commission.serviceCode}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {commission.date}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="font-medium text-gray-900">
                          {commission.employee}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="space-y-1">
                          <div className="text-base md:text-lg font-bold text-gray-900 flex items-center">
                            <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            {commission.commission.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rate: {commission.commissionRate}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium ${
                            statusConfig[commission.status]?.bg
                          }`}
                        >
                          <StatusIcon
                            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                              statusConfig[commission.status]?.color
                            }`}
                          />
                          <span
                            className={statusConfig[commission.status]?.color}
                          >
                            {statusConfig[commission.status]?.label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <div className="flex items-center gap-1 md:gap-2">
                          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                          </button>
                          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Incentives Tab
  const renderIncentivesTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Incentives & Rewards
            </h3>
            <p className="text-sm text-gray-500">
              Manage employee incentives and loyalty programs
            </p>
          </div>
          <button className="px-3 py-2 md:px-4 md:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 text-sm">
            <Plus className="w-3 h-3 md:w-4 md:h-4" />
            Add New Incentive
          </button>
        </div>

        {/* Incentive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {incentiveData.map((incentive) => {
            const Icon = incentive.icon;
            return (
              <div
                key={incentive.id}
                className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div
                      className={`p-2 md:p-3 ${incentive.bgColor} rounded-xl`}
                    >
                      <Icon
                        className={`w-5 h-5 md:w-6 md:h-6 ${incentive.color}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                        {incentive.type}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {incentive.employees} employees enrolled
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-base md:text-lg font-bold ${incentive.color} flex items-center`}
                  >
                    <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {isMobile
                      ? incentive.value >= 100000
                        ? `${(incentive.value / 100000).toFixed(1)}L`
                        : incentive.value.toLocaleString()
                      : incentive.value.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500">Allocated</span>
                    <span className="font-medium text-gray-900">
                      {incentive.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500">Used</span>
                    <span className="font-medium text-gray-900">
                      {incentive.used.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-medium text-gray-900">
                      {incentive.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 md:mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round((incentive.used / incentive.allocated) * 100)}
                      %
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${incentive.bgColor
                        .replace("bg-", "bg-")
                        .replace("-50", "-500")} rounded-full`}
                      style={{
                        width: `${
                          (incentive.used / incentive.allocated) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Reports Tab
  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Reports & Analytics
            </h3>
            <p className="text-sm text-gray-500">
              Generate and download detailed financial reports
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 text-sm">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Select Range</span>
              <span className="sm:hidden">Range</span>
            </button>
            <button className="px-3 py-2 md:px-4 md:py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 text-sm">
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Bulk Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile View */}
        {isMobile ? (
          <div className="space-y-3">
            {reportData.map((report) => (
              <MobileReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          /* Desktop Report List */
          <div className="space-y-3 md:space-y-4">
            {reportData.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-xl hover:border-gray-300"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      {report.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1 md:gap-3 text-xs text-gray-500 mt-1">
                      <span>Type: {report.type}</span>
                      <span className="hidden md:inline">•</span>
                      <span>Period: {report.period}</span>
                      <span className="hidden md:inline">•</span>
                      <span>Generated: {report.generated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-sm text-gray-500">{report.size}</div>
                    <div className="text-xs text-gray-400">
                      {report.downloads} downloads
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg">
                      <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Settings Tab
  const renderSettingsTab = () => (
    <div className="space-y-6">
      {isMobile ? (
        <MobileSettingsSection />
      ) : (
        <div className="bg-white p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              System Configurations
            </h3>
            <p className="text-sm text-gray-500">
              Configure payroll and commissiosn settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {/* Payroll Settings */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4">
                  Payroll Settings
                </h4>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Pay Period
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-sm">
                      {settingsData.payPeriods.map((period) => (
                        <option key={period} value={period.toLowerCase()}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 md:py-2.5 text-sm"
                      defaultValue="2024-10-25"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Settings */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-4 md:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4">
                  Commission Rates
                </h4>
                <div className="space-y-2 md:space-y-3">
                  {Object.entries(settingsData.commissionRates).map(
                    ([service, rate]) => (
                      <div
                        key={service}
                        className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-900 text-sm md:text-base">
                          {service}
                        </span>
                        <span className="font-bold text-purple-600 text-sm md:text-base">
                          {rate}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "payroll":
        return renderPayrollTab();
      case "commissions":
        return renderCommissionsTab();
      case "incentives":
        return renderIncentivesTab();
      case "reports":
        return renderReportsTab();
      case "settings":
        return renderSettingsTab();
      default:
        return renderPayrollTab();
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-100 w-full ${
        isMobile ? "pb-16" : "ml-0 lg:ml-20"
      }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-300 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
             
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">
                  Financial Tracking
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  Accounting & Payroll Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(!ShowTheMobileFilters)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Filter className="h-5 w-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

        
        </div>
      )}

      {/* Mobile Filters */}
      {isMobile && ShowTheMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay Period
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {settingsData.payPeriods.map((period) => (
                    <option key={period} value={period.toLowerCase()}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Filter
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Services</option>
                  <option value="hair">Hair Services</option>
                  <option value="skin">Skin Care</option>
                  <option value="nails">Nail Care</option>
                </select>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Payroll, Accounting & Commission Management
                </h1>
                <p className="text-gray-500 mt-2 text-sm md:text-base">
                  A powerful financial and payroll management system that
                  simplifies salary calculations, commission tracking,
                  incentives, and financial reporting with smart automation and
                  flexible payment scheduling.
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {mobileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-3 md:p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 mb-1 truncate">
                      {stat.label}
                    </p>
                    <p className="text-base md:text-xl font-bold text-gray-900 flex items-center truncate">
                      {stat.label.includes("₹") && (
                        <IndianRupee className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      )}
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 ${stat.bg} rounded-lg`}>
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Tabs Navigation */}
        {!isMobile && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        isActive
                          ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div>{renderActiveTab()}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-lg z-30">
          <div className="flex items-center justify-around">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center p-2"
                >
                  <div
                    className={`p-2 rounded-lg mb-1 ${
                      isActive ? "bg-indigo-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-indigo-600" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-indigo-600" : "text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialTracking;
