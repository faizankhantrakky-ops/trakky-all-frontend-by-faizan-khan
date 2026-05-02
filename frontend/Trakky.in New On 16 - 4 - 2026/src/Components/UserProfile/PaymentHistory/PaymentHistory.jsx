import React, { useState, useEffect } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Dummy data - replace with your real API data later
const mockPayments = [
  {
    id: "PAY-20250123002",
    date: "2025-01-24",
    time: "14:30",
    amount: 899,
    service: "Haircut + Beard Trim + Hair Color",
    salon: "Style & Shine Salon",
    status: "success",
    paymentMethod: "UPI",
  },
  {
    id: "PAY-20250115002",
    date: "2025-01-15",
    time: "11:15",
    amount: 1499,
    service: "Full Body Massage + Facial",
    salon: "Glow Spa & Salon",
    status: "success",
    paymentMethod: "Card",
  },
  {
    id: "PAY-20241228003",
    date: "2024-12-28",
    time: "16:45",
    amount: 499,
    service: "Express Manicure",
    salon: "Nail Art Studio",
    status: "failed",
    paymentMethod: "UPI",
  },
  {
    id: "PAY-20241210004",
    date: "2024-12-10",
    time: "10:00",
    amount: 2499,
    service: "Bridal Package",
    salon: "Luxury Bridal Salon",
    status: "success",
    paymentMethod: "Net Banking",
  },
];

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data (replace with real API call)
  useEffect(() => {
    setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-100 py-9 px-5 md:px-8 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Payment History
          </h1>
          <div className="w-20 h-1 bg-[#502DA6] mb-4"></div>
          <p className="text-gray-600 max-w-md">
            View all your salon service payments, transaction status and details
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#502DA6]"></div>
          </div>
        ) : payments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <ReceiptIcon className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500">
              You haven't made any salon payments yet.
            </p>
          </div>
        ) : (
          /* Payment List */
          <div className="space-y-5">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="w-10 h-10 bg-[#502DA6]/10 rounded-full flex items-center justify-center">
                      <ReceiptIcon className="text-[#502DA6] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{payment.service}</h3>
                      <p className="text-sm text-gray-500">{payment.salon}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-700" />
                      <span className="text-xl font-semibold text-gray-900">
                        {payment.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(payment.date)} • {payment.time}
                    </p>
                  </div>
                </div>

                {/* Card Body - Details */}
                <div className="px-6 py-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                    {/* Transaction ID */}
                    <div>
                      <p className="text-gray-500 mb-1">Transaction ID</p>
                      <p className="font-medium text-gray-800">{payment.id}</p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <p className="text-gray-500 mb-1">Payment Method</p>
                      <p className="font-medium text-gray-800">{payment.paymentMethod}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-1.5">
                        {payment.status === "success" ? (
                          <>
                            <CheckCircleOutlineIcon className="text-green-600 w-5 h-5" />
                            <span className="text-green-700 font-medium">Success</span>
                          </>
                        ) : (
                          <>
                            <HighlightOffIcon className="text-red-600 w-5 h-5" />
                            <span className="text-red-700 font-medium">Failed</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <p className="text-gray-500 mb-1">Date & Time</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <CalendarTodayIcon className="text-gray-500 w-4 h-4" />
                        <span className="text-gray-700">{formatDate(payment.date)}</span>
                        <AccessTimeIcon className="text-gray-500 w-4 h-4 ml-2" />
                        <span className="text-gray-700">{payment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                  <button className="text-[#502DA6] hover:text-[#3e2285] text-sm font-medium flex items-center gap-1.5 transition-colors">
                    <ReceiptIcon className="w-4 h-4" />
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box - same style as Bookings */}
        <div className="mt-10 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#502DA6]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ReceiptIcon className="text-[#502DA6] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                This section shows all payments made for salon services. You can view
                transaction details, payment status, and download receipts. For any
                payment-related questions, please contact support or the respective salon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;