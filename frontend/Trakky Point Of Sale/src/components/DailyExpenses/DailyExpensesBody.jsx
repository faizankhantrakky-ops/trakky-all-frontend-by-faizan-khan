import React, { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../Context/Auth";
import { Box, Modal, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Chip, Tooltip, Menu, MenuItem, FormControlLabel, Switch, Avatar, Badge } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress, LinearProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PieChartIcon from "@mui/icons-material/PieChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import GridViewIcon from "@mui/icons-material/GridView";
import TableChartIcon from "@mui/icons-material/TableChart";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

// Advanced Date Range Component
const AdvancedDateRangeModal = ({ open, onClose, dateState, setDateState, onApply }) => {
  const [tempDates, setTempDates] = useState({
    startDate: dayjs(dateState.startDate),
    endDate: dayjs(dateState.endDate)
  });

  const quickDateOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" },
  ];

  const applyQuickDate = (option) => {
    const today = dayjs();
    let start, end;

    switch(option) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = today.subtract(1, 'day');
        break;
      case 'week':
        start = today.startOf('week');
        end = today.endOf('week');
        break;
      case 'month':
        start = today.startOf('month');
        end = today.endOf('month');
        break;
      case 'lastMonth':
        start = today.subtract(1, 'month').startOf('month');
        end = today.subtract(1, 'month').endOf('month');
        break;
      case 'quarter':
        start = today.startOf('quarter');
        end = today.endOf('quarter');
        break;
      case 'year':
        start = today.startOf('year');
        end = today.endOf('year');
        break;
      default:
        return;
    }

    setTempDates({ startDate: start, endDate: end });
  };

  const handleApply = () => {
    setDateState(tempDates);
    onApply();
    onClose();
  };

  return (
  <Modal
  open={open}
  onClose={onClose}
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Box
    sx={{
      backgroundColor: "white",
      width: "90%",
      maxWidth: "800px",
      maxHeight: "80vh",      // ✅ 80% of viewport height
      padding: 0,
      borderRadius: "16px",
      boxShadow: "0 32px 80px rgba(0, 0, 0, 0.12)",
      overflowY: "auto",     // ✅ scroll enabled
      border: "1px solid #e5e7eb",
    }}
  >
    {/* Modal Content */}

        <div className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#4A2DBE] rounded-xl">
                <CalendarMonthIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Advanced Date Range .</h2>
                <p className="text-sm text-gray-600 mt-1">Select or customize your analysis period</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Date Options */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Quick Selections</h3>
              <div className="space-y-2">
                {quickDateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => applyQuickDate(option.value)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#4A2DBE] hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#4A2DBE]">
                        {option.label}
                      </span>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#4A2DBE]" />
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Date Range Summary</h4>
                <p className="text-sm text-gray-600 mb-2">Selected Range:</p>
                <p className="text-lg font-bold text-[#4A2DBE]">
                  {tempDates.startDate.format('DD MMM YYYY')} - {tempDates.endDate.format('DD MMM YYYY')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Total days: {tempDates.endDate.diff(tempDates.startDate, 'day') + 1}
                </p>
              </div>
            </div>

            {/* Custom Date Selection */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Custom Date Range</h3>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <EventIcon className="w-4 h-4" />
                      Start Date
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <DatePicker
                        value={tempDates.startDate}
                        onChange={(newValue) => setTempDates(prev => ({ ...prev, startDate: newValue }))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "standard",
                            InputProps: {
                              disableUnderline: true,
                              style: { padding: '14px 16px' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <EventIcon className="w-4 h-4" />
                      End Date
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <DatePicker
                        value={tempDates.endDate}
                        onChange={(newValue) => setTempDates(prev => ({ ...prev, endDate: newValue }))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "standard",
                            InputProps: {
                              disableUnderline: true,
                              style: { padding: '14px 16px' }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </LocalizationProvider>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Date Comparison</h4>
                  <span className="text-xs text-gray-500">Optional</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Previous Period</p>
                    <p className="text-sm font-medium text-gray-900">
                      {tempDates.startDate.subtract(1, 'month').format('DD MMM YYYY')} - {tempDates.endDate.subtract(1, 'month').format('DD MMM YYYY')}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Year-over-Year</p>
                    <p className="text-sm font-medium text-gray-900">
                      {tempDates.startDate.subtract(1, 'year').format('DD MMM YYYY')} - {tempDates.endDate.subtract(1, 'year').format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setTempDates({
                  startDate: dayjs(),
                  endDate: dayjs()
                });
              }}
              className="px-6 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-semibold"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-[#4A2DBE] text-white py-3.5 rounded-xl hover:bg-[#3A23AE] transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow"
            >
              Apply Date Range
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

// Download Options Modal
const DownloadOptionsModal = ({ open, onClose, data, dateRange, exportType, onExportStart }) => {
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [includeOptions, setIncludeOptions] = useState({
    summary: true,
    details: true,
    categories: true,
    paymentMethods: true,
    charts: false
  });
  const [fileName, setFileName] = useState(`expense-report-${dayjs().format('YYYY-MM-DD')}`);

  const handleExport = () => {
    onExportStart(selectedFormat, includeOptions, fileName);
    onClose();
  };

  const formatOptions = [
    { id: "csv", label: "CSV File", icon: <InsertDriveFileIcon className="w-5 h-5" />, description: "Comma-separated values, editable in Excel" },
    { id: "pdf", label: "PDF Report", icon: <PictureAsPdfIcon className="w-5 h-5" />, description: "Professional formatted document" },
    { id: "excel", label: "Excel File", icon: <TableChartIcon className="w-5 h-5" />, description: "Microsoft Excel format (XLSX)" },
  ];

  return (
   <Modal
  open={open}
  onClose={onClose}
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Box
    sx={{
      backgroundColor: "white",
      width: "90%",
      maxWidth: "800px",
      maxHeight: "80vh",      // ✅ 80% of viewport height
      padding: 0,
      borderRadius: "16px",
      boxShadow: "0 32px 80px rgba(0, 0, 0, 0.12)",
      overflowY: "auto",     // ✅ scroll enabled
      border: "1px solid #e5e7eb",
    }}
  >

        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#4A2DBE] rounded-lg">
                <CloudDownloadIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Export Expense Report.</h2>
                <p className="text-sm text-gray-600 mt-1">Customize and download your expense data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* File Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] focus:border-transparent"
                placeholder="Enter file name"
              />
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Format</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formatOptions.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border transition-all duration-300 ${selectedFormat === format.id ? 'border-[#4A2DBE] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-2 rounded-lg mb-2 ${selectedFormat === format.id ? 'text-[#4A2DBE]' : 'text-gray-500'}`}>
                        {format.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{format.label}</span>
                      <span className="text-xs text-gray-500 mt-1">{format.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Include Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Include in Report</label>
              <div className="space-y-3">
                {Object.entries(includeOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {key === 'summary' && 'Total amounts and transaction counts'}
                        {key === 'details' && 'Complete transaction details'}
                        {key === 'categories' && 'Category-wise breakdown'}
                        {key === 'paymentMethods' && 'Payment method analysis'}
                        {key === 'charts' && 'Visual charts and graphs'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onChange={(e) => setIncludeOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                      color="primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Report Summary</span>
                <span className="text-xs text-gray-500">{data.length} records</span>
              </div>
              <p className="text-sm text-gray-600">
                Date Range: {dateRange.startDate.format('DD MMM YYYY')} - {dateRange.endDate.format('DD MMM YYYY')}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Total Amount: ₹{data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex-1 bg-[#4A2DBE] text-white py-3.5 rounded-xl hover:bg-[#3A23AE] transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow"
            >
              <div className="flex items-center justify-center gap-2">
                <CloudDownloadIcon className="w-4 h-4" />
                Export Report
              </div>
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

const DailyExpensesBody = ({ startDate, endDate }) => {
  const { authTokens, user } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paid_to, setPaid_to] = useState("");
  const [paid_from, setPaid_from] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dailyExpensData, setDailyExpensData] = useState([]);
  const [todayExpensData, setTodayExpensData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayLoading, setTodayLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [todayTotalAmount, setTodayTotalAmount] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("all");
  const [filteredPayment, setFilteredPayment] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table, grid, list
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [dateState, setDateState] = useState({
    startDate: dayjs(startDate),
    endDate: dayjs(endDate)
  });
  const [categoryStats, setCategoryStats] = useState({});
  const [paymentStats, setPaymentStats] = useState({});
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const csvLinkRef = useRef(null);

  // Categories for expense classification
  const expenseCategories = [
    "Tea & Refreshments", "Salary & Wages", "Office Supplies", "Food & Beverages", 
    "Travel & Transportation", "Utilities", "Rent & Lease", "Marketing & Advertising", 
    "Entertainment", "Maintenance", "Taxes", "Insurance", "Software & Subscriptions", 
    "Equipment", "Training & Development", "Professional Services", "Shipping & Delivery", 
    "Miscellaneous"
  ];

  const validateAlphabets = (value) => {
    return /^[A-Za-z\s]*$/.test(value);
  };

  // CSV Data Preparation
  const prepareCSVData = () => {
    const data = activeTab === 'today' ? todayExpensData : dailyExpensData;
    return data.map(expense => ({
      'ID': expense.id,
      'Date': dayjs(expense.created_at).format('DD-MM-YYYY'),
      'Time': dayjs(expense.created_at).format('HH:mm'),
      'Description': expense.name,
      'Category': expense.category || 'Uncategorized',
      'Amount': expense.amount,
      'Paid To': expense.paid_to,
      'Paid From': expense.paid_from,
      'Payment Method': expense.payment_mode || 'Not Specified',
      'Salon Name': expense.salon_name || '',
      'Salon City': expense.salon_city || '',
      'Salon Area': expense.salon_area || ''
    }));
  };

  // PDF Export Function
const exportToPDF = (includeOptions, fileName) => {
  setExporting(true);
  setExportProgress(10);

  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const purple = [107, 70, 193]; // Elegant Purple #6B46C1
    const lightGray = [248, 248, 248];
    const darkText = [30, 30, 30];
    const grayText = [100, 100, 100];

    const data = activeTab === 'today' ? todayExpensData : dailyExpensData;
    const total = data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    let currentY = 15; // Compact start

    // === Compact Classic Header ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26); // Smaller
    doc.setTextColor(...purple);
    doc.text("Trakky", 15, currentY);

    doc.setFontSize(18); // Smaller
    doc.setTextColor(0, 0, 0);
    doc.text("Expense Report", 15, currentY + 9);

    doc.setFontSize(9); // Smaller info
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayText);
    doc.text(`Range: ${dateState.startDate.format('DD MMM YYYY')} - ${dateState.endDate.format('DD MMM YYYY')}`, pageWidth - 15, currentY + 4, { align: "right" });
    doc.text(`Transactions: ${data.length}`, pageWidth - 15, currentY + 9, { align: "right" });
    doc.text(`Total: Rs. ${total.toLocaleString('en-IN')}`, pageWidth - 15, currentY + 14, { align: "right" });
    doc.text(`Generated: ${dayjs().format('DD MMM YYYY, h:mm A')}`, pageWidth - 15, currentY + 19, { align: "right" });

    doc.setDrawColor(...purple);
    doc.setLineWidth(0.6);
    doc.line(15, currentY + 24, pageWidth - 15, currentY + 24);

    currentY += 32; // Reduced space

    setExportProgress(30);

    // === Compact Summary ===
    if (includeOptions.summary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13); // Smaller
      doc.setTextColor(...purple);
      doc.text("Summary", 15, currentY);

      doc.setDrawColor(...purple);
      doc.setLineWidth(0.4);
      doc.line(15, currentY + 2, 50, currentY + 2);

      currentY += 10; // Reduced

      const average = data.length > 0 ? total / data.length : 0;

      doc.autoTable({
        startY: currentY,
        head: [['Metric', 'Value']],
        body: [
          ['Transactions', `${data.length}`],
          ['Total', `Rs. ${total.toLocaleString('en-IN')}`],
          ['Period', `${dateState.startDate.format('DD MMM YYYY')} - ${dateState.endDate.format('DD MMM YYYY')}`],
          ['Generated', dayjs().format('DD MMM YYYY, h:mm A')]
        ],
        theme: 'plain',
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        styles: { overflow: 'linebreak', cellPadding: 5, fontSize: 9 }, // Compact
        headStyles: { fillColor: purple, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: darkText },
        alternateRowStyles: { fillColor: lightGray },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
      });

      currentY = doc.lastAutoTable.finalY + 20; // Reduced space
    }

    setExportProgress(50);

    // === Compact Transaction Details (No Overflow) ===
    if (includeOptions.details && data.length > 0) {
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 30;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...purple);
      doc.text("Transactions", 15, currentY);

      doc.setDrawColor(...purple);
      doc.setLineWidth(0.4);
      doc.line(15, currentY + 2, 70, currentY + 2);

      currentY += 10;

      const tableData = data.map(expense => [
        expense.id?.toString() || '-',
        dayjs(expense.created_at).format('DD-MM-YY'), // Shorter date
        (expense.name || expense.purpose || '-').trim().substring(0, 20) + (expense.name?.length > 20 ? '...' : ''), // Truncate long desc
        expense.category || 'Uncategorized',
        `Rs. ${Number(expense.amount || 0).toLocaleString('en-IN')}`,
        expense.paid_to?.substring(0, 10) || '-', // Shorter
        expense.paid_from?.substring(0, 10) || '-',
        expense.payment_mode?.substring(0, 8) || '-' // Shorter
      ]);

      doc.autoTable({
        startY: currentY,
        head: [['ID', 'Date', 'Desc', 'Cat', 'Amount', 'To', 'By', 'Mode']], // Shorter headers
        body: tableData,
        theme: 'grid',
        pageBreak: 'auto',
        rowPageBreak: 'avoid',
        styles: { overflow: 'linebreak', cellPadding: 4, fontSize: 8 }, // Super compact
        headStyles: { fillColor: purple, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: darkText },
        alternateRowStyles: { fillColor: lightGray },
        columnStyles: {
          0: { cellWidth: 14, halign: 'center' },
          1: { cellWidth: 18, halign: 'center' },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: purple },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 18 }
        },
        margin: { left: 15, right: 15 }
      });

      currentY = doc.lastAutoTable.finalY + 20;
    }

    setExportProgress(90);

    // === Compact Footer ===
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(...purple);
      doc.setLineWidth(0.3);
      doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

      doc.setFontSize(8);
      doc.setTextColor(...grayText);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i}/${pageCount}`, pageWidth / 2, pageHeight - 13, { align: 'center' });

      doc.setFontSize(7);
      doc.setTextColor(...purple);
      doc.setFont("helvetica", "italic");
      doc.text("Trakky • Salon POS Management", pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    const finalFileName = fileName || `Trakky_Report_${dayjs().format('DDMMMYY')}`;
    doc.save(`${finalFileName}.pdf`);

    setExportProgress(100);
    setTimeout(() => {
      setExporting(false);
      setExportProgress(0);
      toast.success('Compact Trakky PDF Generated!');
    }, 500);

  } catch (error) {
    console.error('PDF Error:', error);
    setExporting(false);
    setExportProgress(0);
    toast.error('Failed to generate PDF');
  }
};

  // Excel Export Function (CSV for now)
  const exportToExcel = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
      toast.success('CSV file download started');
    }
  };

  // Handle Export
  const handleExport = (format, includeOptions, fileName) => {
    switch(format) {
      case 'csv':
        exportToExcel();
        break;
      case 'pdf':
        exportToPDF(includeOptions, fileName);
        break;
      case 'excel':
        exportToExcel();
        break;
      default:
        exportToExcel();
    }
  };

  // Fetch Vendor to get central_payment_method
  const fetchVendorss = async () => {

     if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
    if (!user?.user_id) return;
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`
      );
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data = await res.json();
      const methods = (data.central_payment_method || []).map((item, idx) => ({
        ...item,
        id: item.id ?? idx + 1,
      }));
      setPaymentMethods(methods);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load payment methods");
    }
  };

  const fetchData = async () => {
       if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }

    setLoading(true);
    if (!authTokens) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/daily-expensis/?start_date=${dateState.startDate.format('YYYY-MM-DD')}&end_date=${dateState.endDate.format('YYYY-MM-DD')}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const sortedData = responseData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setDailyExpensData(sortedData);
        
        // Calculate statistics
        calculateStatistics(sortedData);
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error("Error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayData = async () => {
       if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
    setTodayLoading(true);
    if (!authTokens) return;

    const today = dayjs().format("YYYY-MM-DD");
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/daily-expensis/?start_date=${today}&end_date=${today}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const sortedData = responseData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setTodayExpensData(sortedData);
      } else {
        toast.error("Error while fetching today's data");
      }
    } catch (error) {
      toast.error("Error while fetching today's data");
    } finally {
      setTodayLoading(false);
    }
  };

  // Calculate statistics
  const calculateStatistics = (data) => {
    const catStats = {};
    const payStats = {};
    
    data.forEach(item => {
      const cat = item.category || "Uncategorized";
      catStats[cat] = (catStats[cat] || 0) + item.amount;
      
      const payMethod = item.payment_mode || "Other";
      payStats[payMethod] = (payStats[payMethod] || 0) + item.amount;
    });
    
    setCategoryStats(catStats);
    setPaymentStats(payStats);
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchVendorss();
    }
    fetchData();
    fetchTodayData();
  }, [dateState.startDate, dateState.endDate, user?.user_id]);

  useEffect(() => {
    const total = dailyExpensData.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(total);
    const todayTotal = todayExpensData.reduce((acc, item) => acc + item.amount, 0);
    setTodayTotalAmount(todayTotal);
    
    calculateStatistics(dailyExpensData);
  }, [dailyExpensData, todayExpensData]);

  // CSV Data for export
  const csvData = prepareCSVData();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setAmount("");
    setPaid_from("");
    setPaid_to("");
    setPaymentMode("");
    setCategory("");
  };

  const handleEditOpen = (expense) => {
    setEditingExpense(expense);
    setName(expense.name);
    setAmount(expense.amount);
    setPaid_to(expense.paid_to);
    setPaid_from(expense.paid_from);
    setPaymentMode(expense.payment_mode || "");
    setCategory(expense.category || "");
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setName("");
    setAmount("");
    setPaid_from("");
    setPaid_to("");
    setPaymentMode("");
    setCategory("");
    setEditingExpense(null);
  };

    let branchId = localStorage.getItem("branchId") || "";

  const handlePOSTdailyExpenses = async () => {
    if (!amount || !name || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    const expenseData = {
      name,
      amount,
      paid_to,
      paid_from,
      payment_mode: paymentMode,
      category,
      // branchId
    };

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/daily-expensis/",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );
      if (response.ok) {
        toast.success("Expense added successfully");
        handleClose();
        fetchData();
        fetchTodayData();
      } else {
        toast.error("Error while adding expense");
      }
    } catch (error) {
      toast.error("Error while adding expense");
    }
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense || !amount || !name || !category) return;

    const expenseData = {
      name,
      amount,
      paid_to,
      paid_from,
      payment_mode: paymentMode,
      category,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/daily-expensis/${editingExpense.id}/`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );
      if (response.ok) {
        toast.success("Expense updated successfully");
        handleEditClose();
        fetchData();
        fetchTodayData();
      } else {
        toast.error("Error while updating expense");
      }
    } catch (error) {
      toast.error("Error while updating expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/daily-expensis/${id}/`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
        }
      );

      if (response.ok) {
        setDailyExpensData(dailyExpensData.filter((item) => item.id !== id));
        setTodayExpensData(todayExpensData.filter((item) => item.id !== id));
        toast.success("Expense Deleted Successfully");
      } else {
        toast.error("Error deleting expense: " + response.statusText);
      }
    } catch (error) {
      toast.error("Failed to delete expense: " + error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedExpenses.size} selected expenses?`)) return;

    const promises = Array.from(selectedExpenses).map(id => 
      fetch(`https://backendapi.trakky.in/salonvendor/daily-expensis/${id}/`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${authTokens.access_token}`,
          "content-type": "application/json",
        },
      })
    );

    try {
      await Promise.all(promises);
      setDailyExpensData(dailyExpensData.filter(item => !selectedExpenses.has(item.id)));
      setTodayExpensData(todayExpensData.filter(item => !selectedExpenses.has(item.id)));
      setSelectedExpenses(new Set());
      setBulkActionsOpen(false);
      toast.success(`${selectedExpenses.size} expenses deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete expenses");
    }
  };

  const getPaymentModeColor = (mode) => {
    const colors = {
      'UPI': 'bg-blue-100 text-blue-800 border border-blue-200',
      'CASH': 'bg-green-100 text-green-800 border border-green-200',
      'CARD': 'bg-purple-100 text-purple-800 border border-purple-200',
      'BANK TRANSFER': 'bg-amber-100 text-amber-800 border border-amber-200',
      'ONLINE': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'DEFAULT': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return colors[mode?.toUpperCase()] || colors['DEFAULT'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tea': 'bg-red-100 text-red-800 border border-red-200',
      'Salary': 'bg-green-100 text-green-800 border border-green-200',
      'Office': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Food': 'bg-amber-100 text-amber-800 border border-amber-200',
      'Travel': 'bg-purple-100 text-purple-800 border border-purple-200',
      'Utilities': 'bg-cyan-100 text-cyan-800 border border-cyan-200',
      'Marketing': 'bg-pink-100 text-pink-800 border border-pink-200',
      'DEFAULT': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return colors[category?.split(' ')[0]] || colors['DEFAULT'];
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let dataToProcess = activeTab === 'today' ? [...todayExpensData] : [...dailyExpensData];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      dataToProcess = dataToProcess.filter(item => 
        item.name?.toLowerCase().includes(term) ||
        item.paid_to?.toLowerCase().includes(term) ||
        item.paid_from?.toLowerCase().includes(term) ||
        item.payment_mode?.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }
    
    if (filteredCategory !== "all") {
      dataToProcess = dataToProcess.filter(item => 
        (item.category || "Uncategorized") === filteredCategory
      );
    }
    
    if (filteredPayment !== "all") {
      dataToProcess = dataToProcess.filter(item => 
        (item.payment_mode || "Other") === filteredPayment
      );
    }
    
    if (sortConfig.key) {
      return dataToProcess.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'ascending' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return dataToProcess;
  }, [todayExpensData, dailyExpensData, sortConfig, activeTab, searchTerm, filteredCategory, filteredPayment]);

  // Toggle expense selection
  const toggleExpenseSelection = (id) => {
    const newSelection = new Set(selectedExpenses);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedExpenses(newSelection);
  };

  const selectAllExpenses = () => {
    if (selectedExpenses.size === filteredAndSortedData.length) {
      setSelectedExpenses(new Set());
    } else {
      setSelectedExpenses(new Set(filteredAndSortedData.map(item => item.id)));
    }
  };

  // Custom Input Component
  const CustomInput = ({ id, label, type = "text", value, onChange, error, helperText, className = "", icon, required = false, ...props }) => {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} border ${error ? 'border-red-400' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] focus:border-transparent transition-all duration-300 text-sm bg-white`}
            required={required}
            {...props}
          />
        </div>
        {helperText && (
          <p className={`text-xs mt-2 ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  };

  // Custom Select Component
  const CustomSelect = ({ id, label, value, onChange, options, className = "", icon, required = false }) => {
    return (
      <div className={`relative ${className}`}>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <select
            id={id}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] focus:border-transparent transition-all duration-300 text-sm bg-white appearance-none`}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.length > 0 ? (
              options.map((option) => (
                <option key={option.id || option} value={option.name || option}>
                  {option.name || option}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        
        </div>
      </div>
    );
  };

  // Quick Stats Component
  const QuickStats = () => {
    const data = activeTab === 'today' ? todayExpensData : dailyExpensData;
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const avgAmount = data.length > 0 ? total / data.length : 0;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{data.length} transactions</p>
          </div>
        </div>  
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Average</p>
              <p className="text-xl font-bold text-gray-900">₹{avgAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUpIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Per transaction</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Categories</p>
              <p className="text-xl font-bold text-gray-900">{Object.keys(categoryStats).length}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CategoryIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Active categories</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Date Range</p>
              <p className="text-sm font-semibold text-gray-900">{dateState.startDate.format('DD MMM')} - {dateState.endDate.format('DD MMM')}</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <CalendarTodayIcon className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">{dateState.endDate.diff(dateState.startDate, 'day') + 1} days</p>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Actions Menu
  const BulkActionsMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={bulkActionsOpen}
      onClose={() => setBulkActionsOpen(false)}
    >
      <MenuItem onClick={() => { setShowDownloadModal(true); setBulkActionsOpen(false); }}>
        <CloudDownloadIcon className="w-4 h-4 mr-2" />
        Export Selected
      </MenuItem>
      <MenuItem onClick={handleBulkDelete} style={{ color: '#dc2626' }}>
        <DeleteIcon className="w-4 h-4 mr-2" />
        Delete Selected ({selectedExpenses.size})
      </MenuItem>
      <MenuItem onClick={() => { setSelectedExpenses(new Set()); setBulkActionsOpen(false); }}>
        <CloseIcon className="w-4 h-4 mr-2" />
        Clear Selection
      </MenuItem>
    </Menu>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="pt-6 px-4 sm:px-6 h-screen overflow-auto bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              borderLeft: '4px solid #4A2DBE',
            },
          }}
        />
        
        {/* Hidden CSV Link */}
        <CSVLink
          data={csvData}
          filename={`expense-report-${dayjs().format('YYYY-MM-DD-HHmm')}.csv`}
          className="hidden"
          ref={csvLinkRef}
          target="_blank"
        >
          Download CSV
        </CSVLink>

        {/* Export Progress */}
        {exporting && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <LinearProgress 
              variant="determinate" 
              value={exportProgress} 
              sx={{ 
                height: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4A2DBE',
                }
              }} 
            />
            <div className="bg-white px-4 py-2 border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudDownloadIcon className="w-5 h-5 text-[#4A2DBE]" />
                  <span className="text-sm font-medium text-gray-900">
                    {exportProgress < 100 ? 'Generating Report...' : 'Report Generated!'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{exportProgress} %</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Advanced Header Section */}
        <div className="mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Expense's Manager</h1>
                    <p className="text-sm text-gray-600 mt-1">Professionas Expense tracking with advanced Analytic</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-300 hover:border-[#4A2DBE] hover:text-[#4A2DBE] transition-all duration-300 text-sm font-semibold"
                  onClick={() => setShowDateSelectionModal(true)}
                >
                  <CalendarTodayIcon className="w-4 h-4" />
                  Date Range
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-300 hover:border-green-600 hover:text-green-600 transition-all duration-300 text-sm font-semibold"
                  onClick={() => setShowDownloadModal(true)}
                >
                  <CloudDownloadIcon className="w-4 h-4" />
                  Export
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-[#4A2DBE] text-white px-5 py-3 rounded-lg hover:bg-[#3A23AE] transition-all duration-300 text-sm font-semibold shadow-sm"
                  onClick={handleOpen}
                >
                  <AddIcon className="w-4 h-4" />
                  New Expense
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Search and Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search expenses by description, category, parties, or payment method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={filteredCategory}
                  onChange={(e) => setFilteredCategory(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] bg-white"
                >
                  <option value="all">All Categories</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select
                  value={filteredPayment}
                  onChange={(e) => setFilteredPayment(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] bg-white"
                >
                  <option value="all">All Payments</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.name}>{method.name}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredCategory("all");
                    setFilteredPayment("all");
                  }}
                  className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
               
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuickStats(!showQuickStats)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {showQuickStats ? 'Hide Stats' : 'Show Stats'}
                </button>
                <button
                  onClick={fetchData}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <RefreshIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedExpenses.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-100 rounded">
                    <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedExpenses.size} expense{selectedExpenses.size > 1 ? 's' : ''} selected
                  </span>
                  <span className="text-sm text-gray-600">
                    Total: ₹{Array.from(selectedExpenses).reduce((sum, id) => {
                      const expense = [...dailyExpensData, ...todayExpensData].find(e => e.id === id);
                      return sum + (expense?.amount || 0);
                    }, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllExpenses}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedExpenses.size === filteredAndSortedData.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <button
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setBulkActionsOpen(true);
                    }}
                    className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 text-sm font-medium"
                  >
                    Bulk Actions
                  </button>
                  <button
                    onClick={() => setSelectedExpenses(new Set())}
                    className="p-1.5 text-gray-500 hover:text-gray-700"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {showQuickStats && <QuickStats />}
        </div>

        <div className="flex flex-col xl:flex-row gap-6 w-full h-auto">
          {/* Main Content Section */}
          <div className="w-full xl:w-[calc(100%-400px)] h-full overflow-auto">
            {/* Advanced Tab Navigation */}
            <div className="flex bg-white rounded-lg p-1 mb-4 border border-gray-200">
              <button
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'today' ? 'bg-[#4A2DBE] text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('today')}
              >
                <div className="flex items-center justify-center gap-2">
                  <CalendarTodayIcon className="w-4 h-4" />
                  Today's Expenses
                  {todayExpensData.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'today' ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {todayExpensData.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-md transition-all duration-300 ${activeTab === 'history' ? 'bg-[#4A2DBE] text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('history')}
              >
                <div className="flex items-center justify-center gap-2">
                  <TimelineIcon className="w-4 h-4" />
                  Expense History
                  {dailyExpensData.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === 'history' ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {dailyExpensData.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
            
            {/* Advanced Table Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4A2DBE] rounded-md">
                      {activeTab === 'today' ? (
                        <ReceiptIcon className="w-4 h-4 text-white" />
                      ) : (
                        <SummarizeIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {activeTab === 'today' ? "Today's Transactions" : "Historical Transactions"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {filteredAndSortedData.length} transactions • ₹{filteredAndSortedData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} total
                        {selectedExpenses.size > 0 && ` • ${selectedExpenses.size} selected`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                      onClick={() => handleSort('created_at')}
                    >
                      <SortIcon className="w-3 h-3" />
                      Sort
                    </button>
                    <Tooltip title="Export all visible data">
                      <button 
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                        onClick={() => setShowDownloadModal(true)}
                      >
                        <DownloadIcon className="w-3 h-3" />
                        Export
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              
              {/* Advanced Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="w-12 py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedExpenses.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                          onChange={selectAllExpenses}
                          className="rounded border-gray-300 text-[#4A2DBE] focus:ring-[#4A2DBE]"
                        />
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          <DescriptionIcon className="w-3 h-3" />
                          Details
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpwardIcon className="w-3 h-3" />
                              : <ArrowDownwardIcon className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('amount')}
                        >
                          Amount
                          {sortConfig.key === 'amount' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpwardIcon className="w-3 h-3" />
                              : <ArrowDownwardIcon className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <PersonIcon className="w-3 h-3" />
                          Parties
                        </div>
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('payment_mode')}
                        >
                          <PaymentIcon className="w-3 h-3" />
                          Payment
                          {sortConfig.key === 'payment_mode' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpwardIcon className="w-3 h-3" />
                              : <ArrowDownwardIcon className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <button 
                          className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('created_at')}
                        >
                          <CalendarTodayIcon className="w-3 h-3" />
                          Date
                          {sortConfig.key === 'created_at' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpwardIcon className="w-3 h-3" />
                              : <ArrowDownwardIcon className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((activeTab === 'today' ? todayLoading : loading) ? (
                      <tr>
                        <td colSpan="7" className="py-16">
                          <div className="flex flex-col items-center justify-center">
                            <CircularProgress size={36} sx={{ color: "#4A2DBE" }} />
                            <p className="mt-4 text-sm text-gray-600 font-medium">Loading transactions...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAndSortedData?.length > 0 ? (
                      filteredAndSortedData?.map((item, index) => (
                        <tr key={item.id} className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group ${selectedExpenses.has(item.id) ? 'bg-blue-50' : ''}`}>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedExpenses.has(item.id)}
                              onChange={() => toggleExpenseSelection(item.id)}
                              className="rounded border-gray-300 text-[#4A2DBE] focus:ring-[#4A2DBE]"
                            />
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-md ${selectedExpenses.has(item.id) ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <ReceiptIcon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item?.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                                    <CategoryIcon className="w-3 h-3" />
                                    {item.category || "Uncategorized"}
                                  </span>
                                  <span className="text-xs text-gray-500">ID: {item.id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex flex-col">
                              <span className="text-base font-bold text-gray-900">₹{item?.amount?.toLocaleString()}</span>
                              <span className="text-xs text-gray-500">INR</span>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <ArrowDownwardIcon className="w-3 h-3 text-green-600" />
                                <div>
                                  <p className="text-xs text-gray-500">To</p>
                                  <p className="text-sm font-medium text-gray-900">{item?.paid_to || "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <ArrowUpwardIcon className="w-3 h-3 text-blue-600" />
                                <div>
                                  <p className="text-xs text-gray-500">From</p>
                                  <p className="text-sm font-medium text-gray-900">{item?.paid_from || "—"}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className={`px-3 py-1.5 rounded ${getPaymentModeColor(item?.payment_mode)}`}>
                              <div className="flex items-center gap-1.5">
                                <PaymentIcon className="w-3 h-3" />
                                <span className="text-xs font-medium">{item?.payment_mode || "Not Specified"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {dayjs(item?.created_at).format("DD MMM YY")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {dayjs(item?.created_at).format("h:mm A")}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-1">
                              <Tooltip title="Edit">
                                <button
                                  onClick={() => handleEditOpen(item)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors group"
                                >
                                  <EditIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <button
                                  onClick={() => handleDeleteExpense(item.id)}
                                  className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                                >
                                  <DeleteIcon className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                                </button>
                              </Tooltip>
                              <Tooltip title="View Details">
                                <button
                                  onClick={() => setSelectedExpense(item)}
                                  className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                                >
                                  <VisibilityIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              </Tooltip>
                           
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <div className="p-3 bg-gray-100 rounded-lg mb-3">
                              <ReceiptIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-base font-semibold text-gray-700">No transactions found</p>
                            <p className="text-sm text-gray-500 mt-2 max-w-md">
                              {searchTerm || filteredCategory !== "all" || filteredPayment !== "all"
                                ? "No expenses match your current filters. Try adjusting your search or filters."
                                : activeTab === 'today' 
                                  ? "No expenses recorded for today. Add your first expense to get started."
                                  : "No expenses found in the selected date range."
                              }
                            </p>
                            {(searchTerm || filteredCategory !== "all" || filteredPayment !== "all") && (
                              <button
                                className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                onClick={() => {
                                  setSearchTerm("");
                                  setFilteredCategory("all");
                                  setFilteredPayment("all");
                                }}
                              >
                                Clear All Filters
                              </button>
                            )}
                            {!searchTerm && filteredCategory === "all" && filteredPayment === "all" && (
                              <button
                                className="mt-6 bg-[#4A2DBE] text-white px-6 py-3 rounded-lg hover:bg-[#3A23AE] transition-all duration-300 text-sm font-semibold shadow-sm"
                                onClick={handleOpen}
                              >
                                <AddIcon className="w-4 h-4 mr-2 inline" />
                                Add First Expense
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Advanced Analytics Sidebar */}
          <div className="w-full xl:w-[400px] h-fit xl:sticky xl:top-6 flex flex-col gap-4">
            {/* Export Quick Actions */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#4A2DBE] rounded-md">
                  <CloudDownloadIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Quick Export</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-[#4A2DBE] hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <PictureAsPdfIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">PDF Report</p>
                      <p className="text-xs text-gray-500">Professional formatted document</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#4A2DBE]" />
                </button>
                
                <button 
                  onClick={exportToExcel}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-green-600 hover:shadow-sm transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <InsertDriveFileIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">CSV For Export</p>
                      <p className="text-xs text-gray-500">Spreadsheet format for analysis</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </button>
                
                <button 
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 hover:border-purple-600 hover:shadow-sm transition-all duration-300 group"
                  onClick={() => setShowDateSelectionModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <CalendarTodayIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Custom Expense Report</p>
                      <p className="text-xs text-gray-500">Select specific date range</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </button>
              </div>
            </div>

            {/* Date Range Summary */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4A2DBE] rounded-md">
                    <CalendarMonthIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Date Range Summary</h3>
                </div>
                <button
                  onClick={() => setShowDateSelectionModal(true)}
                  className="text-xs text-[#4A2DBE] hover:text-[#3A23AE] font-medium flex items-center gap-1"
                >
                  Change
                  <ChevronRightIcon className="w-3 h-3" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <span className="text-sm font-medium text-gray-900">{dateState.startDate.format('DD MMM YYYY')}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">End Date</span>
                  <span className="text-sm font-medium text-gray-900">{dateState.endDate.format('DD MMM YYYY')}</span>
                </div>
                <div className="pt-2">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Period Total</span>
                      <span className="text-lg font-bold text-[#4A2DBE]">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {dailyExpensData.length} transactions in selected range
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Analysis */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-md">
                  <PieChartIcon className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Top Categories</h3>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {Object.keys(categoryStats).length > 0 ? (
                  Object.entries(categoryStats)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([categoryName, amount]) => (
                      <div key={categoryName} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white rounded border border-gray-200">
                            <CategoryIcon className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900 truncate">{categoryName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">₹{amount.toLocaleString()}</span>
                          <p className="text-xs text-gray-500">
                            {totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500">No category data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-md">
                  <PaymentIcon className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Payment Methods</h3>
              </div>
              
              <div className="space-y-2">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded border border-gray-200">
                          <PaymentIcon className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-900">{method.name}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                        Active
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500">No payment methods configured</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AdvancedDateRangeModal
          open={showDateSelectionModal}
          onClose={() => setShowDateSelectionModal(false)}
          dateState={dateState}
          setDateState={setDateState}
          onApply={fetchData}
        />

        <DownloadOptionsModal
          open={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          data={filteredAndSortedData}
          dateRange={dateState}
          onExportStart={handleExport}
        />

        {/* Bulk Actions Menu */}
        <BulkActionsMenu />

      <Modal
          open={open}
          onClose={handleClose}
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              width: "90%",
              maxWidth: "650px",
              padding: 0,
              borderRadius: "16px",
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="px-6 py-5 border-b border-gray-200 bg-[#4A2DBE] ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <AddIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add New Expense</h2>
                    <p className="text-sm text-white/90 mt-1">Enter transaction details</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

         <div className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <CustomSelect
      id="expense-category"
      label="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      options={expenseCategories}
      className="md:col-span-1"
      icon={<CategoryIcon className="w-4 h-4" />}
    />
    
    {/* Amount Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
        Amount (₹)
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onWheel={(e) => e.target.blur()}
          placeholder="0.00"
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
    </div>
    
    <CustomSelect
      id="payment-mode"
      label="Payment Method"
      value={paymentMode}
      onChange={(e) => setPaymentMode(e.target.value)}
      options={paymentMethods}
      className="md:col-span-1"
      icon={<PaymentIcon className="w-4 h-4" />}
    />
    
    {/* Paid To Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="paid-to" className="block text-sm font-medium text-gray-700 mb-1">
        Paid To
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowDownwardIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="paid-to"
          type="text"
          value={paid_to}
          onChange={(e) => {
            if (validateAlphabets(e.target.value)) {
              setPaid_to(e.target.value);
            }
          }}
          placeholder="Recipient name"
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            paid_to && !validateAlphabets(paid_to) 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
        />
      </div>
      {paid_to && !validateAlphabets(paid_to) && (
        <p className="mt-1 text-sm text-red-600">Only alphabets are allowed</p>
      )}
    </div>
    
    {/* Paid By Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="paid-by" className="block text-sm font-medium text-gray-700 mb-1">
        Paid By
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowUpwardIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="paid-by"
          type="text"
          value={paid_from}
          onChange={(e) => {
            if (validateAlphabets(e.target.value)) {
              setPaid_from(e.target.value);
            }
          }}
          placeholder="Payer name"
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            paid_from && !validateAlphabets(paid_from) 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
        />
      </div>
      {paid_from && !validateAlphabets(paid_from) && (
        <p className="mt-1 text-sm text-red-600">Only alphabets are allowed</p>
      )}
    </div>
    
    {/* Expense Details Input - Direct HTML */}
    <div className="md:col-span-2">
      <label htmlFor="expense-details" className="block text-sm font-medium text-gray-700 mb-1">
        Expense Details
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DescriptionIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="expense-details"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Description of expense"
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
    </div>
  </div>

  <div className="flex gap-3">
    <button
      className="flex-1 bg-[#4A2DBE] text-white py-3.5 rounded-xl hover:from-[#3A23AE] hover:to-[#5C53EE] transition-all duration-300 text-sm font-semibold shadow-md"
      onClick={handlePOSTdailyExpenses}
    >
      Save Expense
    </button>
    <button
      className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-semibold"
      onClick={handleClose}
    >
      Cancel
    </button>
  </div>
</div>
          </Box>
        </Modal>


 <Modal
          open={editOpen}
          onClose={handleEditClose}
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              width: "90%",
              maxWidth: "640px",
              padding: 0,
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#4A2DBE] rounded-lg">
                    <EditIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Expense</h2>
                    <p className="text-sm text-gray-600 mt-1">Update transaction details</p>
                  </div>
                </div>
                <button
                  onClick={handleEditClose}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <CloseIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

          <div className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <CustomSelect
      id="edit-expense-category"
      label="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      options={expenseCategories}
      className="md:col-span-1"
      icon={<CategoryIcon className="w-4 h-4" />}
      required={true}
    />
    
    {/* Amount Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="edit-expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
        Amount (₹) <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="edit-expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onWheel={(e) => e.target.blur()}
          placeholder="0.00"
          required
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
    </div>
    
    <CustomSelect
      id="edit-payment-mode"
      label="Payment Method"
      value={paymentMode}
      onChange={(e) => setPaymentMode(e.target.value)}
      options={paymentMethods}
      className="md:col-span-1"
      icon={<PaymentIcon className="w-4 h-4" />}
    />
    
    {/* Paid To Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="edit-paid-to" className="block text-sm font-medium text-gray-700 mb-1">
        Paid To
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowDownwardIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="edit-paid-to"
          type="text"
          value={paid_to}
          onChange={(e) => {
            if (validateAlphabets(e.target.value)) {
              setPaid_to(e.target.value);
            }
          }}
          placeholder="Recipient name"
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            paid_to && !validateAlphabets(paid_to) 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
        />
      </div>
      {paid_to && !validateAlphabets(paid_to) && (
        <p className="mt-1 text-sm text-red-600">Only alphabets are allowed</p>
      )}
    </div>
    
    {/* Paid By Input - Direct HTML */}
    <div className="md:col-span-1">
      <label htmlFor="edit-paid-by" className="block text-sm font-medium text-gray-700 mb-1">
        Paid By
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowUpwardIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="edit-paid-by"
          type="text"
          value={paid_from}
          onChange={(e) => {
            if (validateAlphabets(e.target.value)) {
              setPaid_from(e.target.value);
            }
          }}
          placeholder="Payer name"
          className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            paid_from && !validateAlphabets(paid_from) 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300'
          }`}
        />
      </div>
      {paid_from && !validateAlphabets(paid_from) && (
        <p className="mt-1 text-sm text-red-600">Only alphabets are allowed</p>
      )}
    </div>
    
    {/* Expense Details Input - Direct HTML */}
    <div className="md:col-span-2">
      <label htmlFor="edit-expense-details" className="block text-sm font-medium text-gray-700 mb-1">
        Expense Details <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <DescriptionIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="edit-expense-details"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Description of expense"
          required
          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
    </div>
  </div>

  <div className="flex gap-3">
    <button
      className="flex-1 bg-[#4A2DBE] text-white py-3.5 rounded-lg hover:bg-[#3A23AE] transition-all duration-300 text-sm font-semibold"
      onClick={handleUpdateExpense}
    >
      Update Expense
    </button>
    <button
      className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-semibold"
      onClick={handleEditClose}
    >
      Cancel
    </button>
  </div>
</div>
          </Box>
        </Modal>

   

        {/* Expense Detail Modal */}
        {selectedExpense && (
          <Dialog
            open={!!selectedExpense}
            onClose={() => setSelectedExpense(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4A2DBE] rounded-md">
                    <ReceiptIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Expense Details</h2>
                    <p className="text-sm text-gray-600">Transaction ID: {selectedExpense.id}</p>
                  </div>
                </div>
                <IconButton onClick={() => setSelectedExpense(null)} size="small">
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            
            <DialogContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                  <p className="text-base font-medium text-gray-900">{selectedExpense.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Amount</label>
                    <p className="text-xl font-bold text-gray-900">₹{selectedExpense.amount?.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                    <p className="text-base font-medium text-gray-900">
                      {dayjs(selectedExpense.created_at).format("DD MMM YYYY, h:mm A")}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Paid To</label>
                    <p className="text-base font-medium text-gray-900">{selectedExpense.paid_to || "—"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Paid By</label>
                    <p className="text-base font-medium text-gray-900">{selectedExpense.paid_from || "—"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Payment Method</label>
                    <p className="text-base font-medium text-gray-900">{selectedExpense.payment_mode || "Not Specified"}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                    <p className="text-base font-medium text-gray-900">{selectedExpense.category || "Uncategorized"}</p>
                  </div>
                </div>
                
                {selectedExpense.salon_name && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                    <p className="text-base font-medium text-gray-900">
                      {selectedExpense.salon_name}, {selectedExpense.salon_city}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
            
            <DialogActions className="px-6 py-4 border-t border-gray-200">
              <Button 
                onClick={() => {
                  handleEditOpen(selectedExpense);
                  setSelectedExpense(null);
                }}
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  color: '#4A2DBE',
                  borderColor: '#4A2DBE',
                  '&:hover': {
                    backgroundColor: '#f5f3ff',
                    borderColor: '#3A23AE',
                  }
                }}
              >
                Edit
              </Button>
              <Button 
                onClick={() => {
                  setSelectedExpense(null);
                  handleDeleteExpense(selectedExpense.id);
                }}
                variant="outlined"
                startIcon={<DeleteIcon />}
                sx={{
                  color: '#dc2626',
                  borderColor: '#dc2626',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                    borderColor: '#b91c1c',
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default DailyExpensesBody;