import React, { useState, useEffect, useContext } from "react";
import {
  Download,
  CalendarDays,
  FileText,
  AlertCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from "../../../Context/Auth";

// INR formatter
const formatINR = (value) => {
  if (isNaN(value) || value === null || value === undefined) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
};

// CSV download helper
const downloadCsv = (filename, rows) => {
  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Paymentreport = () => {
  const { authTokens } = useContext(AuthContext);
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Date formatter for API
  const formatDate = (date) =>
    date ? date.toISOString().split("T")[0] : null;

  // Parse and clean numerical values
  const parseNumber = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate Total Amount as fallback
  const calculateTotalAmount = (row) => {
    const serviceAmount = parseNumber(row["Service Amount"]);
    const productAmount = parseNumber(row["Product Amount"]);
    const discountAmount = parseNumber(row["Discount Amount"]);
    const membershipDiscount = parseNumber(row["Membership Discount"]);
    const taxAmount = parseNumber(row["Tax Amount"]);
    const tipAmount = parseNumber(row["Tip Amount"]);
    return serviceAmount + productAmount - discountAmount - membershipDiscount + taxAmount + tipAmount;
  };

  // Fetch payment report from API
  const fetchPaymentReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments/export/?start_date=${formatDate(
          startDate
        )}&end_date=${formatDate(endDate)}&status=completed`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch payment report");
      const text = await response.text();
      const rows = text.trim().split("\n").map((row) => row.split(","));
      const headers = rows[0];
      const dataRows = rows.slice(1).map((row) => {
        const rowData = headers.reduce((obj, header, index) => {
          obj[header] = row[index] || "";
          return obj;
        }, {});
        // Validate and calculate Total Amount
        const totalAmount = parseNumber(rowData["Total Amount"]);
        rowData["Total Amount"] = isNaN(totalAmount) ? calculateTotalAmount(rowData) : totalAmount;
        return rowData;
      });
      setData(dataRows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authTokens?.access_token && startDate && endDate) {
      fetchPaymentReport();
    }
  }, [startDate, endDate, authTokens]);

  // CSV export
  const handleDownloadCsv = () => {
    const headers = [
      "Booking Date",
      "Total Booking",
      "Total Services",
      "Service Amount",
      "Product Amount",
      "Discount Amount",
      "Membership Discount",
      "Tax Amount",
      "Tip Amount",
      "Cash Amount",
      "Card Amount",
      "UPI Amount",
      "Total Amount",
    ];
    const rows = [
      headers,
      ...data.map((row) =>
        headers.map((header) =>
          header.includes("Amount") ? formatINR(row[header]) : row[header]
        )
      ),
    ];
    downloadCsv(`payment_report_${formatDate(startDate)}_to_${formatDate(endDate)}.csv`, rows);
  };

  return (
    <main
      className="min-h-dvh bg-background text-foreground md:pl-24 pl-4 p-3"
      aria-label="Salon Payment Report"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 mt-4"
        role="banner"
      >
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-md flex items-center justify-center bg-[#502DA6] text-white"
                aria-hidden
              >
                <FileText className="size-5" />
              </div>
              <div>
                <h1 className="text-balance text-lg font-semibold text-[#502DA6]">
                  <FileText className="size-5 inline-block mr-2" aria-hidden />
                  Payment Report
                </h1>
                <p className="text-sm text-muted-foreground">
                  Detailed payment insights for {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-md
                bg-[#502DA6] px-3 py-2 text-sm font-medium text-white
                hover:opacity-95 focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#502DA6] focus-visible:ring-offset-2
              "
              onClick={handleDownloadCsv}
              aria-label="Export payment report to CSV"
              disabled={loading || data.length === 0}
            >
              <Download className="size-4" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto md:px-0 px-4 py-6">
        {/* Date Range Picker */}
        <div className="mb-6 flex items-center gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarDays className="size-4 text-[#502DA6]" aria-hidden />
              Date Range
            </label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="mt-1 w-full max-w-xs rounded-md border border-gray-300 p-2 text-sm focus:ring-[#502DA6] focus:border-[#502DA6]"
              placeholderText="Select date range"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
            <AlertCircle className="size-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
           <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
     <div class="w-12 h-12 rounded-full animate-spin
                    border-8 border-solid border-purple-500 border-t-transparent"></div>
    <span className="mt-4 text-white text-lg font-medium">
      Loading Biils
    </span>
  </div>
        )}

        {/* Payment Report Table */}
        {!loading && data.length > 0 && (
          <div className="rounded-lg bg-white shadow-sm overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#502DA6]/10">
                <tr>
                  {[
                    "Booking Date",
                    "Total Booking",
                    "Total Services",
                    "Service Amount",
                    "Product Amount",
                    "Discount Amount",
                    "Membership Discount",
                    "Tax Amount",
                    "Tip Amount",
                    "Cash Amount",
                    "Card Amount",
                    "UPI Amount",
                    "Total Amount",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-[#502DA6] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{row["Booking Date"]}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row["Total Booking"]}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row["Total Services"]}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Service Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Product Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Discount Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Membership Discount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Tax Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Tip Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Cash Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Card Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["UPI Amount"])}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatINR(row["Total Amount"])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && !error && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600">No payment data available for the selected date range.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Paymentreport;