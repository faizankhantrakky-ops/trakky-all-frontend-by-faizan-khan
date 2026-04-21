import React, { useState, useEffect, useContext } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CalendarMonth,
  FilterList,
  Close,
  Message,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WhatsApp,
  Visibility as ViewIcon,
  TrendingUp,
  BusinessCenter,
  LocationOn,
  Schedule,
  Analytics,
  CheckBoxOutlineBlank,
  CheckBox,
  PlaylistAddCheck,
  Person,
  Phone,
  Event,
  Category,
  Cancel,
  Note,
  History,
  Send,
} from "@mui/icons-material";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import DateRange from "./DateRange/CustomDateRange";
import { formatDate } from "./DateRange/formatDate";
import GeneralModal from "./generalModal/GeneralModal";
import ConvertedLeadForm from "./Forms/ConvertedLeadForm";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const BulkMessageModal = ({
  open,
  onClose,
  phoneNumbers,
  salonName = "our salon",
  salonCity = "your city",
  salonArea = "your area",
}) => {
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const toggleMessageType = (type) => {
    if (selectedMessageType === type) {
      setSelectedMessageType(null);
      setEditedMessage("");
    } else {
      setSelectedMessageType(type);
      setEditedMessage(predefinedMessages[type].message);
    }
  };

  const toggleHistoryDropdown = () => {
    setShowHistoryDropdown(!showHistoryDropdown);
  };

  const closeAll = () => {
    setSelectedMessageType(null);
    setShowHistoryDropdown(false);
    setEditedMessage("");
  };

  const predefinedMessages = {
    feedback: {
      title: "Feedback Request",
      message: `Hi there! 👋 We hope you enjoyed your recent visit to ${salonName}. Could you spare a moment to share your feedback? Your opinion helps us serve you better! 💖\n\nPlease rate your experience from 1-5 stars. ⭐⭐⭐⭐⭐\n\nThank you! 😊`,
    },
    offer: {
      title: "Exclusive Offer",
      message: `🌟 Exclusive Offer Just For You! 🌟\n\nEnjoy 20% OFF on your next visit to ${salonName}! 💇‍♀️💅\n\nUse code: GLOW20\n\nBook now: https://trakky.in/ahmedabad/offerpage\n\nPamper yourself with our premium services! 💖\n\nOffer valid until ${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}.`,
    },
    retargeting: {
      title: "We Miss You!",
      message: `Hello valued customer! 💕 It's been a while since we've seen you at ${salonName}. We've got some exciting new services you'll love! ✨\n\nHow about treating yourself to a refreshing makeover this week? Book now and get 15% OFF as our welcome back gift! 🎁\n\nSpecial offers: https://trakky.in/ahmedabad/offerpage\n\nWe can't wait to serve you again! 😊`,
    },
    reschedule: {
      title: "Reschedule Reminder",
      message: `Hi there! 👋 We noticed you have an upcoming appointment with ${salonName}. Need to reschedule? No problem!\n\nWe're happy to find a time that works better for you. Please let us know your preferred date/time. 📅\n\nLooking forward to serving you! 💖`,
    },
    reminder: {
      title: "Appointment Reminder",
      message: `💅✨ Reminder: Your appointment at ${salonName} (${salonCity}, ${salonArea}) is coming up!\n\n📅 Date: soon\n\nPlease arrive 10 minutes early to enjoy:\n• Complimentary beverage ☕\n• Relaxing welcome massage 💆‍♀️\n• Special consultation with our stylist 💫\n\nSee you soon! Can't wait to make you look fabulous! 😊`,
    },
  };

  const handleSendMessage = () => {
    setShowConfirmation(true);
  };

  const confirmSendMessage = () => {
    setMessageHistory((prev) => [
      {
        type: selectedMessageType,
        message: editedMessage,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    phoneNumbers.forEach((phoneNumber) => {
      const encodedMessage = encodeURIComponent(editedMessage);
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
        "_blank"
      );
    });
    setShowConfirmation(false);
    onClose();
    toast.success(`Message sent to ${phoneNumbers.length} customers`);
  };

  const selectFromHistory = (historyItem) => {
    setEditedMessage(historyItem.message);
    setSelectedMessageType(historyItem.type);
    setShowHistoryDropdown(false);
  };

  const filteredHistory = selectedMessageType
    ? messageHistory.filter((item) => item.type === selectedMessageType)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full  bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Bulk Message to {phoneNumbers.length} Customers
            </h2>
            <p className="text-gray-600 mt-1">
              This message will be sent to all selected customers via WhatsApp
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              closeAll();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Message Type Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Select Message Type:
              </label>
              {selectedMessageType && (
                <button
                  onClick={closeAll}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <Close className="w-4 h-4 mr-1" />
                  Close All
                </button>
              )}
            </div>
            <div className="flex space-x-3 overflow-x-auto py-2">
              {Object.entries(predefinedMessages).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleMessageType(key)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedMessageType === key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-green-600"
                  }`}
                >
                  <WhatsApp className="w-4 h-4 mr-2" />
                  {value.title}
                  {selectedMessageType === key && (
                    <Close className="w-4 h-4 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedMessageType && (
            <div className="mb-6 p-4 border-l-4 border-green-600 bg-gray-50 rounded-lg relative">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {predefinedMessages[selectedMessageType].title}
                  </span>
                  <button
                    onClick={toggleHistoryDropdown}
                    className="ml-2 p-1 text-green-800 hover:text-green-900 rounded"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedMessageType(null);
                    setEditedMessage("");
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Close className="w-4 h-4" />
                </button>
              </div>

              {showHistoryDropdown && (
                <div className="absolute right-0 top-full z-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 mt-1 max-h-60 overflow-y-auto">
                  <div className="flex justify-end p-2">
                    <button
                      onClick={toggleHistoryDropdown}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Close className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {filteredHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectFromHistory(item)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {predefinedMessages[item.type]?.title || "Custom Message"}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {item.message.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />

              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to {phoneNumbers.length} Customers
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customers who will receive this message:
            </label>
            <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {phoneNumbers.map((number, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1">
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Bulk Message
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to send this message to {phoneNumbers.length} customers?
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Note: This will open {phoneNumbers.length} WhatsApp tabs/windows.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {editedMessage}
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSendMessage}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <WhatsApp className="w-4 h-4 mr-2" />
                    Send to {phoneNumbers.length} Customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerDetailsModal = ({
  open,
  onClose,
  customerData,
  phoneNumber,
  onEdit,
  onDelete,
}) => {
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const toggleMessageType = (type) => {
    if (selectedMessageType === type) {
      setSelectedMessageType(null);
      setEditedMessage("");
    } else {
      setSelectedMessageType(type);
      setEditedMessage(predefinedMessages[type].message);
    }
  };

  const toggleHistoryDropdown = () => {
    setShowHistoryDropdown(!showHistoryDropdown);
  };

  const closeAll = () => {
    setSelectedMessageType(null);
    setShowHistoryDropdown(false);
    setEditedMessage("");
  };

  const salonName = customerData[0]?.salon_info?.name || "our salon";
  const salonCity = customerData[0]?.salon_info?.city || "your city";
  const salonArea = customerData[0]?.salon_info?.area || "your area";
  const nextAppointment = customerData.find(
    (lead) => lead.appointment_date
  )?.appointment_date;

  const predefinedMessages = {
    feedback: {
      title: "Feedback Request",
      message: `Hi there! 👋 We hope you enjoyed your recent visit to ${salonName}. Could you spare a moment to share your feedback? Your opinion helps us serve you better! 💖\n\nPlease rate your experience from 1-5 stars. ⭐⭐⭐⭐⭐\n\nThank you! 😊`,
    },
    offer: {
      title: "Exclusive Offer",
      message: `🌟 Exclusive Offer Just For You! 🌟\n\nEnjoy 20% OFF on your next visit to ${salonName}! 💇‍♀️💅\n\nUse code: GLOW20\n\nBook now: https://trakky.in/ahmedabad/offerpage\n\nPamper yourself with our premium services! 💖\n\nOffer valid until ${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}.`,
    },
    retargeting: {
      title: "We Miss You!",
      message: `Hello valued customer! 💕 It's been a while since we've seen you at ${salonName}. We've got some exciting new services you'll love! ✨\n\nHow about treating yourself to a refreshing makeover this week? Book now and get 15% OFF as our welcome back gift! 🎁\n\nSpecial offers: https://trakky.in/ahmedabad/offerpage\n\nWe can't wait to serve you again! 😊`,
    },
    reschedule: {
      title: "Reschedule Reminder",
      message: `Hi there! 👋 We noticed you have an upcoming appointment with ${salonName}. Need to reschedule? No problem!\n\nWe're happy to find a time that works better for you. Please let us know your preferred date/time. 📅\n\nLooking forward to serving you! 💖`,
    },
    reminder: {
      title: "Appointment Reminder",
      message: `💅✨ Reminder: Your appointment at ${salonName} (${salonCity}, ${salonArea}) is coming up!\n\n📅 Date: ${
        nextAppointment ? formatDate(new Date(nextAppointment)) : "soon"
      }\n\nPlease arrive 10 minutes early to enjoy:\n• Complimentary beverage ☕\n• Relaxing welcome massage 💆‍♀️\n• Special consultation with our stylist 💫\n\nSee you soon! Can't wait to make you look fabulous! 😊`,
    },
  };

  const handleSendMessage = () => {
    setShowConfirmation(true);
  };

  const confirmSendMessage = () => {
    setMessageHistory((prev) => [
      {
        type: selectedMessageType,
        message: editedMessage,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    const encodedMessage = encodeURIComponent(editedMessage);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
    setShowConfirmation(false);
  };

  const selectFromHistory = (historyItem) => {
    setEditedMessage(historyItem.message);
    setSelectedMessageType(historyItem.type);
    setShowHistoryDropdown(false);
  };

  const filteredHistory = selectedMessageType
    ? messageHistory.filter((item) => item.type === selectedMessageType)
    : [];

  if (!open || !customerData.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full  bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
            <p className="text-gray-600 mt-1">
              Phone: {phoneNumber} | Total Appearances: {customerData.length}
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              closeAll();
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Message Type Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Select Message Type:
              </label>
              {selectedMessageType && (
                <button
                  onClick={closeAll}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <Close className="w-4 h-4 mr-1" />
                  Close All
                </button>
              )}
            </div>
            <div className="flex space-x-3 overflow-x-auto py-2">
              {Object.entries(predefinedMessages).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleMessageType(key)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedMessageType === key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-green-600"
                  }`}
                >
                  <WhatsApp className="w-4 h-4 mr-2" />
                  {value.title}
                  {selectedMessageType === key && (
                    <Close className="w-4 h-4 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedMessageType && (
            <div className="mb-6 p-4 border-l-4 border-green-600 bg-gray-50 rounded-lg relative">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {predefinedMessages[selectedMessageType].title}
                  </span>
                  <button
                    onClick={toggleHistoryDropdown}
                    className="ml-2 p-1 text-green-800 hover:text-green-900 rounded"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedMessageType(null);
                    setEditedMessage("");
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Close className="w-4 h-4" />
                </button>
              </div>

              {showHistoryDropdown && (
                <div className="absolute right-0 top-full z-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 mt-1 max-h-60 overflow-y-auto">
                  <div className="flex justify-end p-2">
                    <button
                      onClick={toggleHistoryDropdown}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Close className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {filteredHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectFromHistory(item)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {predefinedMessages[item.type]?.title || "Custom Message"}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {item.message.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />

              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          )}

          {/* Customer Data Table */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visited</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Not Visited</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerData.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.salon_info?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.salon_info?.city || "N/A"}, {lead.salon_info?.area || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <div>Converted: {lead.converted_date ? formatDate(new Date(lead.converted_date)) : "N/A"}</div>
                        <div>Appointment: {lead.appointment_date ? formatDate(new Date(lead.appointment_date)) : "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {lead.booking_time ? (
                        new Date(`1970-01-01T${lead.booking_time}`).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      ) : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {lead.masterservice_info?.map((service) => (
                          <span
                            key={service.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                          >
                            {service.service_name} ({service.category_name})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.price || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{lead.source_of_lead || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.campaign_name || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.does_customer_visited_the_salon
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {lead.does_customer_visited_the_salon ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.reason_for_not_visited_the_salon || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{lead.number_of_customers || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.choice === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : lead.choice === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {lead.choice ? lead.choice.charAt(0).toUpperCase() + lead.choice.slice(1) : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onClose();
                            onEdit(lead);
                          }}
                          className="p-1 text-[#502DA6] hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit Lead"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onDelete(lead.id);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete Lead"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Message</h3>
                <p className="text-gray-600 mb-4">Are you sure you want to send this message?</p>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{editedMessage}</p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSendMessage}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <WhatsApp className="w-4 h-4 mr-2" />
                    Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ConvertedLead = () => {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    city: "",
    area: "",
    dateRange: [],
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [isDateFilterOn, setIsDateFilterOn] = useState(false);
  const [searchOption, setSearchOption] = useState("customer_mobile_number");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSelectionMode = selectedLeads.length > 0;
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [bulkMessageModalOpen, setBulkMessageModalOpen] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const navigate = useNavigate();

  const [dateFilterType, setDateFilterType] = useState("today");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  const dateFilterOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last3", label: "Last 3 Days" },
    { value: "last7", label: "Last 7 Days" },
    { value: "last15", label: "Last 15 Days" },
    { value: "last30", label: "Last 30 Days" },
    { value: "last45", label: "Last 45 Days" },
    { value: "last60", label: "Last 60 Days" },
    { value: "last90", label: "Last 90 Days" },
    { value: "custom", label: "Custom Range" },
    { value: "latest", label: "Latest Leads" },
  ];

  const searchOptions = [
    { value: "salon_name", label: "Salon Name" },
    { value: "customer_mobile_number", label: "Mobile Number" },
    { value: "city", label: "City" },
    { value: "area", label: "Area" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unisex", label: "Unisex" },
  ];

  // All the existing logic functions remain exactly the same
  const handleViewCustomerDetails = (phoneNumber) => {
    const customerData = data.filter(
      (lead) => lead.customer_mobile_number === phoneNumber
    );
    setSelectedCustomerData(customerData);
    setSelectedPhoneNumber(phoneNumber);
    setCustomerDetailsModalOpen(true);
  };

  const getUniqueCustomerData = () => {
    const uniqueCustomers = [];
    const seenNumbers = new Set();
    data.forEach((lead) => {
      if (!seenNumbers.has(lead.customer_mobile_number)) {
        seenNumbers.add(lead.customer_mobile_number);
        uniqueCustomers.push(lead);
      }
    });
    return uniqueCustomers;
  };

  const uniqueCities = [
    ...new Set(data.map((item) => item.salon_info?.city).filter(Boolean)),
  ];
  const uniqueAreas = [
    ...new Set(data.map((item) => item.salon_info?.area).filter(Boolean)),
  ];

  const filteredData = (
    showSelectedOnly
      ? data.filter((lead) => selectedLeads.includes(lead.id))
      : getUniqueCustomerData()
  ).filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      (searchOption === "salon_name" &&
        lead.salon_info?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchOption === "customer_mobile_number" &&
        lead.customer_mobile_number?.includes(searchTerm)) ||
      (searchOption === "city" &&
        lead.salon_info?.city?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchOption === "area" &&
        lead.salon_info?.area?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGender = filters.gender === "" || lead.gender === filters.gender;
    const matchesCity = filters.city === "" || lead.salon_info?.city === filters.city;
    const matchesArea = filters.area === "" || lead.salon_info?.area === filters.area;

    let matchesDate = true;
    if (isDateFilterOn && dateState[0].startDate && dateState[0].endDate) {
      const convertedDate = new Date(lead.converted_date);
      const startDate = new Date(dateState[0].startDate);
      const endDate = new Date(dateState[0].endDate);
      matchesDate = convertedDate >= startDate && convertedDate <= endDate;
    }

    return matchesSearch && matchesGender && matchesCity && matchesArea && matchesDate;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getUniquePhoneNumbers = (data) => {
    const phoneNumbers = [];
    const seenNumbers = new Set();
    data.forEach((lead) => {
      if (lead.customer_mobile_number && !seenNumbers.has(lead.customer_mobile_number)) {
        seenNumbers.add(lead.customer_mobile_number);
        phoneNumbers.push(lead.customer_mobile_number);
      }
    });
    return phoneNumbers;
  };

  const getBulkMessagePhoneNumbers = () => {
    if (isSelectionMode && showSelectedOnly) {
      const selectedData = data.filter((lead) => selectedLeads.includes(lead.id));
      return getUniquePhoneNumbers(selectedData);
    } else if (isSelectionMode) {
      const selectedData = paginatedData.filter((lead) => selectedLeads.includes(lead.id));
      return getUniquePhoneNumbers(selectedData);
    } else {
      return getUniquePhoneNumbers(filteredData);
    }
  };

  const handleBulkMessageClick = () => {
    const phoneNumbers = getBulkMessagePhoneNumbers();
    if (phoneNumbers.length === 0) {
      toast.error("No customers selected or available to message");
      return;
    }
    const firstLead = filteredData.find((lead) =>
      phoneNumbers.includes(lead.customer_mobile_number)
    );
    if (firstLead) {
      setSelectedSalon({
        name: firstLead.salon_info?.name || "our salon",
        city: firstLead.salon_info?.city || "your city",
        area: firstLead.salon_info?.area || "your area",
      });
    }
    setBulkMessageModalOpen(true);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((lead) => lead.id);
      setSelectedLeads(newSelected);
      return;
    }
    setSelectedLeads([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedLeads.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedLeads, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedLeads.slice(1));
    } else if (selectedIndex === selectedLeads.length - 1) {
      newSelected = newSelected.concat(selectedLeads.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedLeads.slice(0, selectedIndex),
        selectedLeads.slice(selectedIndex + 1)
      );
    }
    setSelectedLeads(newSelected);
  };

  const isSelected = (id) => selectedLeads.indexOf(id) !== -1;

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  const getStatistics = () => {
    const total = filteredData.length;
    const cancelled = filteredData.filter((lead) => lead.choice === "cancelled").length;
    const completed = filteredData.filter((lead) => lead.choice === "completed").length;
    const pending = filteredData.filter((lead) => lead.choice === "pending").length;
    const cancellationRate = total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0;
    return { total, cancelled, completed, pending, cancellationRate };
  };

  const stats = getStatistics();

  const formatDateToAPI = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const getDateRange = (type) => {
    const today = new Date();
    let startDate, endDate;
    switch (type) {
      case "today":
        startDate = today;
        endDate = today;
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case "last3":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 2);
        endDate = today;
        break;
      case "last7":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = today;
        break;
      case "last15":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 14);
        endDate = today;
        break;
      case "last30":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        endDate = today;
        break;
      case "last45":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 44);
        endDate = today;
        break;
      case "last60":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 59);
        endDate = today;
        break;
      case "last90":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 89);
        endDate = today;
        break;
      case "latest":
        startDate = null;
        endDate = null;
        break;
      default:
        startDate = today;
        endDate = today;
    }
    return { startDate, endDate };
  };

  const handleDateFilterChange = (event, newFilter) => {
    if (newFilter === "custom") {
      setShowCustomDateModal(true);
    } else {
      setDateFilterType(newFilter);
      setCustomDateRange({ startDate: null, endDate: null });
    }
  };

  const handleCustomDateApply = (startDate, endDate) => {
    setCustomDateRange({ startDate, endDate });
    setDateFilterType("custom");
    setShowCustomDateModal(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `https://backendapi.trakky.in/salons/convertedleads/`;
      if (dateFilterType === "latest") {
        url += `?ordering=-created_at`;
      } else {
        const filterType = dateFilterType || "today";
        const dates = getDateRange(filterType);
        if (dates.startDate && dates.endDate) {
          url += `?appointment_date_from=${formatDateToAPI(
            dates.startDate
          )}&appointment_date_to=${formatDateToAPI(dates.endDate)}`;
        } else {
          url += `?`;
        }
      }
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens?.access),
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        setData(result.results || []);
        setPagination({
          ...pagination,
          total: result.count || 0,
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch leads. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingLeads = async () => {
    let allLeads = [];
    let page = 1;
    const today = new Date();
    const todayStr = formatDateToAPI(today);
    while (true) {
      const url = `https://backendapi.trakky.in/salons/convertedleads/?appointment_date_from=${todayStr}&page=${page}`;
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + String(authTokens?.access),
        },
      });
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      const result = await response.json();
      allLeads = [...allLeads, ...(result.results || [])];
      if (!result.next) break;
      page++;
    }
    return allLeads;
  };

  const sendReminder = async (lead, type) => {
    let endpoint;
    switch (type) {
      case '48h':
        endpoint = 'send-whatsapp-48hrs/';
        break;
      case '24h':
        endpoint = 'send-whatsapp-24hrs/';
        break;
      case '2h':
        endpoint = 'send-whatsapp-2hrs/';
        break;
      case '30min':
        endpoint = 'send-whatsapp-30min/';
        break;
      default:
        return;
    }
    const baseUrl = 'https://backendapi.trakky.in/salons/';
    const url = baseUrl + endpoint;
    const customerName = lead.customer_name || 'Customer';
    const salonName = lead.salon_info?.name || 'Our Salon';
    const appointmentDate = formatDate(new Date(lead.appointment_date));
    const appointmentTime = lead.booking_time
      ? new Date(`1970-01-01T${lead.booking_time}`).toLocaleTimeString('en-IN', {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : 'N/A';
    let body_values;
    switch (type) {
      case '48h':
        body_values = {
          body_1: { type: 'text', value: `Hey ${customerName}!` },
          body_2: { type: 'text', value: `Just a friendly reminder that your salon appointment at ${salonName} is scheduled for ${appointmentDate} at ${appointmentTime}.` },
          body_3: { type: 'text', value: 'Get ready for a refreshing experience!' },
          body_4: { type: 'text', value: 'Thank you,\nTrakky Team 💇‍♀' },
        };
        break;
      case '24h':
        body_values = {
          body_1: { type: 'text', value: `Hey ${customerName},` },
          body_2: { type: 'text', value: `Your salon time is almost here! 💅 Appointment at ${salonName} tomorrow at ${appointmentTime}.` },
          body_3: { type: 'text', value: `Can't wait to have you pampered! Thank you,\nTrakky Team 💇‍♀` },
        };
        break;
      case '2h':
        body_values = {
          body_1: { type: 'text', value: `Hey ${customerName},` },
          body_2: { type: 'text', value: `just 2 hours left before your appointment at ${salonName}. Please arrive on time so we can make the most of your slot! Thank you,\nTrakky Team 💇‍♀` },
        };
        break;
      case '30min':
        body_values = {
          body_1: { type: 'text', value: `Hi ${customerName},` },
          body_2: { type: 'text', value: `it's almost time! Your salon slot at ${salonName} is in just 30 minutes. Looking forward to giving you that perfect glow! Thank you,\nTrakky Team 💇‍♀` },
        };
        break;
    }
    const payload = {
      integrated_number: "919227198149",
      namespace: "f8a4457f_9e77_47b3_84a1_8c23bf6a1c43",
      phone_numbers: [lead.customer_mobile_number.replace(/^\+/, '')],
      body_values,
    };
    if (type === '48h') {
      payload.template_name = "web_48_hrs";
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + String(authTokens?.access),
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      toast.success(`Sent ${type} reminder to ${lead.customer_mobile_number}`);
    } else {
      toast.error(`Failed to send ${type} reminder to ${lead.customer_mobile_number}`);
    }
  };

  useEffect(() => {
    if (!authTokens) return;
    const remind = async () => {
      try {
        const leads = await fetchUpcomingLeads();
        let sentReminders = JSON.parse(localStorage.getItem('sentReminders')) || {};
        for (const lead of leads) {
          if (lead.choice === 'cancelled') continue;
          if (!lead.appointment_date) continue;
          const apptTime = lead.booking_time || '00:00:00';
          const appointmentDateTime = new Date(`${lead.appointment_date}T${apptTime}`);
          if (isNaN(appointmentDateTime.getTime())) continue;
          const timeLeftMs = appointmentDateTime - new Date();
          if (timeLeftMs < 0) continue;
          const timeLeft = timeLeftMs / 3600000;
          const leadSent = sentReminders[lead.id] || {};
          if (timeLeft <= 48 && timeLeft > 47.9167 && !leadSent['48h']) {
            await sendReminder(lead, '48h');
            leadSent['48h'] = true;
          }
          if (timeLeft <= 24 && timeLeft > 23.9167 && !leadSent['24h']) {
            await sendReminder(lead, '24h');
            leadSent['24h'] = true;
          }
          if (timeLeft <= 2 && timeLeft > 1.9167 && !leadSent['2h']) {
            await sendReminder(lead, '2h');
            leadSent['2h'] = true;
          }
          if (timeLeft <= 0.5 && timeLeft > 0.4167 && !leadSent['30min']) {
            await sendReminder(lead, '30min');
            leadSent['30min'] = true;
          }
          sentReminders[lead.id] = leadSent;
        }
        localStorage.setItem('sentReminders', JSON.stringify(sentReminders));
      } catch (error) {
        console.error('Reminder error:', error);
        toast.error('Failed to process reminders');
      }
    };
    remind();
    const interval = setInterval(remind, 300000);
    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    if (authTokens) {
      fetchData();
    }
  }, [authTokens, dateFilterType, customDateRange]);

  const handleEdit = (lead) => {
    setCurrentLead(lead);
    setEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backendapi.trakky.in/salons/convertedleads/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens?.access),
            },
          }
        );
        if (response.status === 204) {
          fetchData();
          toast.success("Lead deleted successfully");
        } else if (response.status === 401) {
          toast.error("Unauthorized: Please log in again");
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead. Please try again later");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setCurrentLead(null);
  };

  const handleUpdateSuccess = () => {
    fetchData();
    handleModalClose();
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleGenderFilter = (value) => {
    setFilters({ ...filters, gender: value });
    setPage(0);
  };

  const handleCityFilter = (value) => {
    setFilters({ ...filters, city: value });
    setPage(0);
  };

  const handleAreaFilter = (value) => {
    setFilters({ ...filters, area: value });
    setPage(0);
  };

  const clearDateFilter = () => {
    setDateState([{ startDate: null, endDate: null, key: "selection" }]);
    setIsDateFilterOn(false);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBackToForm = () => {
    navigate("/addconvertedlead");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

      {/* Header Section */}
     <div className="mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
  <div className="bg-gradient-to-r from-[#502DA6] to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 text-white">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
      
      {/* Left Section - Title and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Converted Leads
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 opacity-90">
            Manage and monitor your converted leads
          </p>
        </div>
        
        {isSelectionMode && (
          <span className="inline-flex items-center self-start sm:self-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            {selectedLeads.length} Selected
          </span>
        )}
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
        <button
          onClick={handleBulkMessageClick}
          className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
        >
          <Message className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>Bulk Message</span>
        </button>
        
        <button
          onClick={() => fetchData()}
          className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
        >
          <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>Refresh</span>
        </button>
        
        <button
          onClick={handleBackToForm}
          className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-colors text-sm sm:text-base"
        >
          <AddIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>Add Converted Lead</span>
        </button>
      </div>

    </div>
  </div>
</div>

      {/* Statistics Cards */}
      <div className=" mx-auto px-4  mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Converted Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#502DA6]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckBox className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Cancel className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Cancellation Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.cancellationRate}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <WarningIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className=" mx-auto px-4  mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-3">
              <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {searchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${searchOptions.find((o) => o.value === searchOption)?.label}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      handleSearch();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Close className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <select
                value={filters.gender}
                onChange={(e) => handleGenderFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Genders</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={filters.city}
                onChange={(e) => handleCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={filters.area}
                onChange={(e) => handleAreaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Areas</option>
                {uniqueAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter:</label>
            <div className="flex flex-wrap gap-2">
              {dateFilterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateFilterChange(null, option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateFilterType === option.value
                      ? "bg-[#502DA6] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {dateFilterType && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filter:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {dateFilterType === "custom"
                  ? `${formatDate(customDateRange.startDate)} - ${formatDate(customDateRange.endDate)}`
                  : dateFilterType === "latest"
                  ? "Latest Leads"
                  : dateFilterOptions.find((opt) => opt.value === dateFilterType)?.label || "Today"}
                <button
                  onClick={() => {
                    setDateFilterType("today");
                    setCustomDateRange({ startDate: null, endDate: null });
                  }}
                  className="ml-2 text-[#502DA6] hover:text-indigo-800"
                >
                  <Close className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Leads Bar */}
      {isSelectionMode && (
        <div className=" mx-auto px-4  mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedLeads.length} leads selected
                </span>
                <button
                  onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    showSelectedOnly
                      ? "bg-[#502DA6] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showSelectedOnly ? "Show All" : "Show Selected"}
                </button>
                <button
                  onClick={() => {
                    selectedLeads.forEach((id) => handleDelete(id));
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
              <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className=" mx-auto px-4 ">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedData.length > 0 && selectedLeads.length === paginatedData.length}
                      onChange={handleSelectAllClick}
                      className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visited</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason Not Visited</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#502DA6]"></div>
                        <span className="text-gray-600">Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : (showSelectedOnly
                    ? paginatedData.filter((lead) => selectedLeads.includes(lead.id))
                    : paginatedData
                  ).length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-12 text-center">
                      <div className="text-gray-500 text-lg">
                        {showSelectedOnly
                          ? "No selected leads found"
                          : "No leads found matching your criteria"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  (showSelectedOnly
                    ? paginatedData.filter((lead) => selectedLeads.includes(lead.id))
                    : paginatedData
                  ).map((lead, index) => {
                    const isItemSelected = isSelected(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isItemSelected ? "bg-indigo-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isItemSelected}
                            onChange={(event) => handleCheckboxClick(event, lead.id)}
                            className="w-4 h-4 text-[#502DA6] border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {lead.salon_info?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.salon_info?.city || "N/A"}, {lead.salon_info?.area || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.customer_name || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-gray-900 flex items-center">
                              <Person className="w-4 h-4 mr-1 text-gray-400" />
                              {lead.gender ? lead.gender.charAt(0).toUpperCase() + lead.gender.slice(1) : "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-4 h-4 mr-1 text-gray-400" />
                              {lead.customer_mobile_number || "N/A"}
                              <button
                                onClick={() => handleViewCustomerDetails(lead.customer_mobile_number)}
                                className="ml-2 p-1 text-[#502DA6] hover:text-indigo-800 rounded"
                              >
                                <ViewIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <div className="flex items-center">
                              <Event className="w-4 h-4 mr-1 text-gray-400" />
                              Converted: {lead.converted_date ? formatDate(new Date(lead.converted_date)) : "N/A"}
                            </div>
                            <div className="flex items-center mt-1">
                              <Event className="w-4 h-4 mr-1 text-gray-400" />
                              Appointment: {lead.appointment_date ? formatDate(new Date(lead.appointment_date)) : "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.booking_time ? (
                            new Date(`1970-01-01T${lead.booking_time}`).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          ) : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-h-20 overflow-y-auto">
                            {lead.masterservice_info?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {lead.masterservice_info.map((service) => (
                                  <span
                                    key={service.id}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                                  >
                                    <Category className="w-3 h-3 mr-1" />
                                    {service.service_name} ({service.category_name})
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No services</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.price || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                          {lead.source_of_lead || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.campaign_name || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.does_customer_visited_the_salon
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {lead.does_customer_visited_the_salon ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.reason_for_not_visited_the_salon || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {lead.number_of_customers || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.choice === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : lead.choice === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {lead.choice ? lead.choice.charAt(0).toUpperCase() + lead.choice.slice(1) : "N/A"}
                          </span>
                          {lead.choice === "cancelled" && lead.cancel_reason && (
                            <div className="text-xs text-gray-500 mt-1">
                              Reason: {lead.cancel_reason}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Note className="w-4 h-4 mr-1 text-gray-400" />
                            {lead.remarks || "No remarks"}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[5, 10, 25].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
                </span>
                <button
                  onClick={(e) => handleChangePage(e, page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={(e) => handleChangePage(e, page + 1)}
                  disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BulkMessageModal
        open={bulkMessageModalOpen}
        onClose={() => setBulkMessageModalOpen(false)}
        phoneNumbers={getBulkMessagePhoneNumbers()}
        salonName={selectedSalon?.name}
        salonCity={selectedSalon?.city}
        salonArea={selectedSalon?.area}
      />

      <CustomerDetailsModal
        open={customerDetailsModalOpen}
        onClose={() => setCustomerDetailsModalOpen(false)}
        customerData={selectedCustomerData}
        phoneNumber={selectedPhoneNumber}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Date Range Modal */}
      {showCustomDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Select Custom Date Range</h3>
              <button
                onClick={() => setShowCustomDateModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Close />
              </button>
            </div>
            <div className="p-6">
              <DateRange
                dateState={[
                  {
                    startDate: customDateRange.startDate || new Date(),
                    endDate: customDateRange.endDate || new Date(),
                    key: "selection",
                  },
                ]}
                setDateState={(ranges) => {
                  setCustomDateRange({
                    startDate: ranges[0].startDate,
                    endDate: ranges[0].endDate,
                  });
                }}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCustomDateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customDateRange.startDate && customDateRange.endDate) {
                    handleCustomDateApply(customDateRange.startDate, customDateRange.endDate);
                  }
                }}
                className="px-6 py-2 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalVisible && currentLead && (
        <GeneralModal
          open={editModalVisible}
          handleClose={handleModalClose}
          backgroundColor="#fff"
        >
          <ConvertedLeadForm
            leadData={currentLead}
            onSuccess={handleUpdateSuccess}
            onCancel={handleModalClose}
          />
        </GeneralModal>
      )}
    </div>
  );
};

export default ConvertedLead;