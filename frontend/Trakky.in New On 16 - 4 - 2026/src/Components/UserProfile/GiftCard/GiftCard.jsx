import React, { useState, useEffect } from "react";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RedeemIcon from "@mui/icons-material/Redeem";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Dummy data (replace with real data from API)
const mockGiftCards = [
  {
    id: "GC-20250115001",
    code: "TRAKKY-8X9P2Q",
    amount: 1500,
    balance: 1200,
    purchasedDate: "2025-01-15",
    expiryDate: "2025-07-15",
    status: "active",
    usedFor: "Haircut + Facial",
    recipient: "Self",
  },
  {
    id: "GC-20241220001",
    code: "TRAKKY-K7M4N8",
    amount: 2000,
    balance: 0,
    purchasedDate: "2024-12-20",
    expiryDate: "2025-06-20",
    status: "redeemed",
    usedFor: "Bridal Package",
    recipient: "Priya Sharma",
  },
  {
    id: "GC-20241110001",
    code: "TRAKKY-Z3V6R9",
    amount: 999,
    balance: 999,
    purchasedDate: "2024-11-10",
    expiryDate: "2025-05-10",
    status: "active",
    usedFor: null,
    recipient: "Friend",
  },
];


const GiftCard = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGiftCards(mockGiftCards);
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

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

  const handleViewDetails = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Gift card code copied to clipboard!");
  };

  return (
    <div className="bg-gray-50 py-8 px-4 md:px-6 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Gift Cards
          </h1>
          <div className="w-20 h-1 bg-[#502DA6] mb-4"></div>
          <p className="text-gray-600 max-w-md">
            View your gift cards, check balances, and see usage history
          </p>
        </div>

        {/* Loading & Empty State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#502DA6]"></div>
          </div>
        ) : giftCards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <CardGiftcardIcon className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No gift cards found
            </h3>
            <p className="text-gray-500">
              You haven't purchased or received any gift cards yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {giftCards.map((card) => (
              <div
                key={card.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                  isExpired(card.expiryDate) ? "border-red-200 bg-red-50/30" : "border-gray-200"
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="w-10 h-10 bg-[#502DA6]/10 rounded-full flex items-center justify-center">
                      <CardGiftcardIcon className="text-[#502DA6] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Gift Card • {card.code}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {card.recipient === "Self" ? "For Myself" : `For ${card.recipient}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CurrencyRupeeIcon className="w-5 h-5 text-gray-700" />
                      <span className="text-xl font-semibold text-gray-900">
                        {card.balance.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        / {card.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs mt-1 flex items-center justify-end gap-1.5">
                      <CalendarTodayIcon className="w-4 h-4 text-gray-500" />
                      Expires: {formatDate(card.expiryDate)}
                      {isExpired(card.expiryDate) && (
                        <span className="text-red-600 font-medium">(Expired)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between gap-3">
                  <button
                    onClick={() => handleViewDetails(card)}
                    className="text-[#502DA6] hover:text-[#3e2285] text-sm font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <CardGiftcardIcon className="w-4 h-4" />
                    View Details
                  </button>

                  {card.status === "active" && !isExpired(card.expiryDate) && (
                    <button className="bg-[#502DA6] hover:bg-[#3e2285] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                      <RedeemIcon className="w-4 h-4" />
                      Redeem / Use Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-10 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#502DA6]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <InfoOutlinedIcon className="text-[#502DA6] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About Gift Cards</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Gift cards can be used for any salon service or product. Check balance and expiry regularly.
                Once used, amount is deducted from the card. Contact support for any issues.
              </p>
            </div>
          </div>
        </div>

        {/* View Details Modal - FAQ Style */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#502DA6]/10 rounded-full flex items-center justify-center">
                    <CardGiftcardIcon className="text-[#502DA6] w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Gift Card Details</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <CloseIcon className="w-7 h-7" />
                </button>
              </div>

              {/* Modal Body - FAQ Style */}
              <div className="p-6 space-y-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CardGiftcardIcon className="text-[#502DA6]" />
                      Basic Information
                    </h3>

                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Gift Card Code</dt>
                        <dd className="font-mono font-medium text-gray-900 flex items-center gap-2">
                          {selectedCard.code}
                          <button
                            onClick={() => copyToClipboard(selectedCard.code)}
                            className="text-gray-500 hover:text-[#502DA6] transition-colors"
                            title="Copy code"
                          >
                            <ContentCopyIcon className="w-4 h-4" />
                          </button>
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-gray-600">Original Amount</dt>
                        <dd className="font-semibold text-gray-900">
                          ₹{selectedCard.amount.toLocaleString("en-IN")}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-gray-600">Remaining Balance</dt>
                        <dd className="font-bold text-[#502DA6] text-lg">
                          ₹{selectedCard.balance.toLocaleString("en-IN")}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-gray-600">Status</dt>
                        <dd>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                              selectedCard.status === "active" && !isExpired(selectedCard.expiryDate)
                                ? "bg-green-100 text-green-800"
                                : selectedCard.status === "redeemed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedCard.status === "active" && !isExpired(selectedCard.expiryDate)
                              ? "Active"
                              : selectedCard.status === "redeemed"
                              ? "Redeemed"
                              : "Expired"}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CalendarTodayIcon className="text-[#502DA6]" />
                      Dates & Validity
                    </h3>

                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Purchased On</dt>
                        <dd className="font-medium">{formatDate(selectedCard.purchasedDate)}</dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-gray-600">Expiry Date</dt>
                        <dd className="font-medium">
                          {formatDate(selectedCard.expiryDate)}
                          {isExpired(selectedCard.expiryDate) && (
                            <span className="ml-2 text-red-600 font-medium">(Expired)</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <RedeemIcon className="text-[#502DA6]" />
                      Usage Information
                    </h3>

                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Recipient</dt>
                        <dd className="font-medium">
                          {selectedCard.recipient === "Self" ? "For Myself" : selectedCard.recipient}
                        </dd>
                      </div>

                      <div className="flex justify-between">
                        <dt className="text-gray-600">Used For</dt>
                        <dd className="font-medium">
                          {selectedCard.usedFor || "Not used yet"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => copyToClipboard(selectedCard.code)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ContentCopyIcon className="w-5 h-5" />
                    Copy Gift Card Code
                  </button>

                  {selectedCard.status === "active" && !isExpired(selectedCard.expiryDate) && (
                    <button className="flex-1 bg-[#502DA6] hover:bg-[#3e2285] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <RedeemIcon className="w-5 h-5" />
                      Redeem / Use Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard;