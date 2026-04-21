import React, { useEffect, useContext, useState } from "react";
import * as XLSX from 'xlsx';
import AuthContext from "../../Context/Auth";
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Package,
  BarChart3,
  Percent,
  Calendar,
  Clock,
  TrendingDown,
  Award,
  Target,
  PieChart,
  Activity,
  Eye,
  Download,
  CreditCard,
  Smartphone,
  Users, // for New Membership
} from "lucide-react";

const SalesDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Hardcoded table data from the provided screenshot
 const tableData = [
  {
    sr: 1,
    date: "19.08.23",
    name: "MR. ABHI PATEL",
    contact: "8733947075",
    service: "Balinese Massage",
    memNo: "MEM",
    pendServ: 0,
    cash: 0,
    gPay: 2399,
    card: 0,
    total: 2399,
    dura: "60 MIN",
    therapist: "MEERA",
    inTime: "11:50",
    outTime: "12:50",
    roomNo: "ROOM NO 1",
    clientType: "REPEAT",
  },
  {
    sr: 2,
    date: "19.08.23",
    name: "MR. ABHI PATEL",
    contact: "8733947075",
    service: "Balinese Massage",
    memNo: "MEM",
    pendServ: 0,
    cash: 0,
    gPay: 0,
    card: 2399,
    total: 2399,
    dura: "60 MIN",
    therapist: "PARIYA",
    inTime: "12:00",
    outTime: "01:00",
    roomNo: "ROOM NO 2",
    clientType: "REPEAT",
  },
  {
    sr: 3,
    date: "19.08.23",
    name: "MR. CHINU",
    contact: "9316478071",
    service: "Aroma Therapy",
    memNo: 678,
    pendServ: "1 O/L",
    cash: 0,
    gPay: 0,
    card: 0,
    total: 0,
    dura: "60 MIN",
    therapist: "LEENA",
    inTime: "01:15",
    outTime: "02:15",
    roomNo: "JACUZZI ROOM",
    clientType: "BOOKING",
  },
  {
    sr: 4,
    date: "19.08.23",
    name: "MR. VIJAY S. PATEL",
    contact: "9265743901",
    service: "Deep Tissue Massage",
    memNo: 706,
    pendServ: "10 O/L",
    cash: 10000,
    gPay: 0,
    card: 0,
    total: 10000,
    dura: "60 MIN",
    therapist: "GRACE",
    inTime: "01:30",
    outTime: "02:30",
    roomNo: "STEAM ROOM",
    clientType: "MEMBER",
  },
  {
    sr: 5,
    date: "19.08.23",
    name: "MR. DAKSH PATEL",
    contact: "9265743901",
    service: "Deep Tissue Massage",
    memNo: 706,
    pendServ: "9 O/L",
    cash: 0,
    gPay: 10000,
    card: 0,
    total: 10000,
    dura: "60 MIN",
    therapist: "JENNY",
    inTime: "01:40",
    outTime: "02:40",
    roomNo: "STEAM ROOM",
    clientType: "MEMBER",
  },
  {
    sr: 6,
    date: "19.08.23",
    name: "MR. RAHUL SHARMA",
    contact: "9876543210",
    service: "Swedish Massage",
    memNo: "WALK-IN",
    pendServ: 0,
    cash: 2500,
    gPay: 0,
    card: 0,
    total: 2500,
    dura: "60 MIN",
    therapist: "ANITA",
    inTime: "02:45",
    outTime: "03:45",
    roomNo: "ROOM NO 3",
    clientType: "NEW",
  },
  {
    sr: 7,
    date: "19.08.23",
    name: "MR. SANJAY MEHTA",
    contact: "9825012345",
    service: "Hot Stone Therapy",
    memNo: 712,
    pendServ: "3 O/L",
    cash: 0,
    gPay: 0,
    card: 4500,
    total: 4500,
    dura: "90 MIN",
    therapist: "POOJA",
    inTime: "03:00",
    outTime: "04:30",
    roomNo: "PREMIUM ROOM",
    clientType: "MEMBER",
  },
  {
    sr: 8,
    date: "19.08.23",
    name: "MR. KUNAL JOSHI",
    contact: "9012345678",
    service: "Foot Reflexology",
    memNo: "WALK-IN",
    pendServ: 0,
    cash: 1500,
    gPay: 0,
    card: 0,
    total: 1500,
    dura: "45 MIN",
    therapist: "NEHA",
    inTime: "04:45",
    outTime: "05:30",
    roomNo: "ROOM NO 4",
    clientType: "NEW",
  },
  {
    sr: 9,
    date: "19.08.23",
    name: "MR. HARSH VORA",
    contact: "9090909090",
    service: "Ayurvedic Massage",
    memNo: 725,
    pendServ: "2 O/L",
    cash: 0,
    gPay: 3000,
    card: 0,
    total: 3000,
    dura: "60 MIN",
    therapist: "SANDHYA",
    inTime: "05:30",
    outTime: "06:30",
    roomNo: "AYURVEDIC ROOM",
    clientType: "MEMBER",
  },
  {
    sr: 10,
    date: "19.08.23",
    name: "MR. NIKHIL DESAI",
    contact: "9988776655",
    service: "Couple Massage",
    memNo: "BOOKING",
    pendServ: 0,
    cash: 0,
    gPay: 0,
    card: 7000,
    total: 7000,
    dura: "90 MIN",
    therapist: "MEERA & PARIYA",
    inTime: "06:45",
    outTime: "08:15",
    roomNo: "COUPLE SUITE",
    clientType: "BOOKING",
  },
];


  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/dashboard/sales/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  // Format currency values
  const formatCurrency = (value) => {
    if (typeof value === "number") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value;
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    // Prepare data for export (you can enhance this to include more columns or fetched data if available)
    const exportData = tableData.map((row) => ({
      SR: row.sr,
      Date: row.date,
      Name: row.name,
      "Contact No": row.contact,
      Service: row.service,
      "Mem No": row.memNo,
      "Pend Serv": row.pendServ,
      Cash: formatCurrency(row.cash).replace('₹', ''), // Remove currency symbol for clean export
      "G.Pay": formatCurrency(row.gPay).replace('₹', ''),
      Card: formatCurrency(row.card).replace('₹', ''),
      Total: formatCurrency(row.total).replace('₹', ''),
      Dura: row.dura,
      Therapist: row.therapist,
      In: row.inTime,
      Out: row.outTime,
      "Room No": row.roomNo,
      "Client Type": row.clientType,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Generate filename with date range
    const fileName = `Sales_Transactions_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Get custom icon for specific metrics
  const getCustomIcon = (metric) => {
    if (metric === "Total Bill Amount" || metric === "Average Bill Amount") {
      return <IndianRupee className="w-6 h-6" />;
    }
    if (metric === "Unpaid Bill Amount") {
      return <TrendingDown className="w-6 h-6" />;
    }
    if (metric === "Total Services Duration") {
      return <Clock className="w-6 h-6" />;
    }
    if (metric === "New Membership") { // renamed from Unpaid Membership Amount
      return <Users className="w-6 h-6" />;
    }
    return null;
  };

  // Get gradient for card - all purple
  const getGradient = () => {
    return "from-[#482DBC] to-[#5D46E0]";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#482DBC] mb-4"></div>
        <p className="text-gray-600">Loading sales analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Detailed Metrics Grid */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.fields?.map((metric, index) => {
            // Rename "Unpaid Membership Amount" to "New Membership" and hide payment methods
            let displayMetric = metric;
            if (metric === "Unpaid Membership Amount") {
              displayMetric = "New Membership";
            }
            if (
              metric === "UPI Appointments" ||
              metric === "Card Appointments" ||
              metric === "Cash Appointments"
            ) {
              return null;
            }

            const value = data[metric];
            const isCurrency =
              metric.toLowerCase().includes("revenue") ||
              metric.toLowerCase().includes("amount") ||
              metric.toLowerCase().includes("value") ||
              metric.toLowerCase().includes("profit") ||
              metric === "Unpaid Membership Amount"; // treat as currency
            const isPercentage =
              metric.toLowerCase().includes("rate") ||
              metric.toLowerCase().includes("margin") ||
              metric.toLowerCase().includes("percentage");

            const customIcon = getCustomIcon(displayMetric);

            return (
              <div
                key={index}
                className={`bg-white rounded-xl border transition-all overflow-hidden group ${
                  selectedMetric === metric ? "ring-2 ring-[#482DBC]" : ""
                }`}
                onClick={() => setSelectedMetric(metric)}
              >
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${getGradient()}`}
                ></div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {customIcon && (
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <span className="text-[#482DBC]">{customIcon}</span>
                        </div>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                        {displayMetric}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {isCurrency
                        ? formatCurrency(value)
                        : isPercentage
                        ? `${value}%`
                        : value}
                    </div>
                  </div>

                  {(displayMetric.includes("Rate") ||
                    displayMetric.includes("Retention") ||
                    displayMetric.includes("Satisfaction")) &&
                    typeof value === "string" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{value}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getGradient()} bg-gradient-to-r`}
                            style={{
                              width: parseInt(value) ? `${parseInt(value)}%` : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${getGradient()}`}
                        ></div>
                        Current Period
                      </span>
                      <span className="font-medium text-gray-700">
                        {displayMetric.includes("Active") || displayMetric.includes("Growth")
                          ? "↑"
                          : "↔"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Transactions Table */}
     {/* Professional Transactions Table - Enhanced Design */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
  <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#482DBC]/5 to-[#5D46E0]/5">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
        <p className="mt-1 text-sm text-gray-600">
          Detailed appointments and sales for the selected period ({startDate} to {endDate})
        </p>
      </div>
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#482DBC] text-white font-medium text-sm rounded-lg hover:bg-[#5D46E0] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Download className="w-4 h-4" />
        Export to Excel
      </button>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50/80 backdrop-blur-sm">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SR</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client Name</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mem No</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pend Serv</th>
          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Cash</th>
          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">G.Pay</th>
          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Card</th>
          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Therapist</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">In Time</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Out Time</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room</th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client Type</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {tableData.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-purple-50/30 transition-colors duration-200 even:bg-gray-50/40"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {row.sr}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.date}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {row.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.contact}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{row.service}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {row.memNo}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.pendServ}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
              {formatCurrency(row.cash)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
              {formatCurrency(row.gPay)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
              {formatCurrency(row.card)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
              {formatCurrency(row.total)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.dura}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.therapist}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.inTime}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.outTime}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.roomNo}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex px-3 py-1 text-xs font-bold rounded-full tracking-wide ${
                  row.clientType === "MEMBER"
                    ? "bg-purple-100 text-purple-800"
                    : row.clientType === "REPEAT"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {row.clientType}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Footer */}
  <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
    <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
      <p className="text-gray-600">
        Showing <span className="font-semibold text-gray-900">{tableData.length}</span> transactions
      </p>
      <button className="mt-3 sm:mt-0 text-[#482DBC] hover:text-[#5D46E0] font-semibold transition-colors flex items-center gap-1">
        View All Transactions
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</div>

      {/* Payment Method Summary Cards - All Purple */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* UPI Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="h-2 w-full bg-gradient-to-r from-[#482DBC] to-[#5D46E0]"></div>
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Smartphone className="w-8 h-8 text-[#482DBC]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data["UPI Appointments"] || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">UPI Appointments</div>
          </div>
        </div>

        {/* Card Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="h-2 w-full bg-gradient-to-r from-[#482DBC] to-[#5D46E0]"></div>
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <CreditCard className="w-8 h-8 text-[#482DBC]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data["Card Appointments"] || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Card Appointments</div>
          </div>
        </div>

        {/* Cash Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="h-2 w-full bg-gradient-to-r from-[#482DBC] to-[#5D46E0]"></div>
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <IndianRupee className="w-8 h-8 text-[#482DBC]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data["Cash Appointments"] || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Cash Appointments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;