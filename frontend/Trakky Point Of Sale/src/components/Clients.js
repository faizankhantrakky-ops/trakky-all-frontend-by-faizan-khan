import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Box,
  Button,
  TextField,
  Tab,
  Tabs,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./Clients.css";
import InputAdornment from "@mui/material/InputAdornment";
import AuthContext from "../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import { FaWhatsapp } from "react-icons/fa";
import { Printer } from "lucide-react";

const Clients = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [gender, setGender] = useState("");
  const [selectedAppointmentForInvoice, setSelectedAppointmentForInvoice] =
    useState(null);
  const [selectedSellForInvoice, setSelectedSellForInvoice] = useState(null);
  const [GeneratingInvoice, IsGeneratingInvoice] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [printLoading, setPrintLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [CustomerName, setItemCustomerName] = useState("");
  const [itemCustomerPhone, setItemCustomerPhone] = useState("");
  const [CustomerEmail, setCustomerEmail] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [loadingstate, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [printLoadingId, setPrintLoadingId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [importType, setImportType] = useState("append");

  // WhatsApp message related state
  const [isWhatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [currentCustomerPhone, setCurrentCustomerPhone] = useState("");

  // Bulk WhatsApp state
  const [bulkWhatsappModalOpen, setBulkWhatsappModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [bulkMessageContent, setBulkMessageContent] = useState("");
  const [showBulkHistory, setShowBulkHistory] = useState(false);
  const [isSendingBulkMessages, setIsSendingBulkMessages] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState({
    country_code: "91",
    login_time: 30,
    new_msg_time: 5,
    send_msg_time: 5,
  });

  // Add these state variables near your other filter states
  const [appointmentNameFilter, setAppointmentNameFilter] = useState("");
  const [appointmentGenderFilter, setAppointmentGenderFilter] = useState("all");
  const [appointmentDateFilter, setAppointmentDateFilter] = useState("");
  const [membershipNameFilter, setMembershipNameFilter] = useState("");
  const [membershipCodeFilter, setMembershipCodeFilter] = useState("");

  // NEW FIELDS: Birthday & Anniversary
  const [birthdayDate, setBirthdayDate] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");

  const sampleFileContent = `customer_name,customer_phone,customer_gender,customer_email,birthday_date,anniversary_date,appointment_date,service_taken,appointment_start_time,appointment_end_time,staff_name,manager_name,actual_amount,final_amount,amount_paid
John Doe,9876543210,Male,john@example.com,1990-05-15,2015-08-20,2025-08-11,Haircut,10:00,11:00,Alex,Emma,500,450,450
Jane Smith,9123456780,Female,jane@example.com,1988-11-22,2018-03-10,2025-08-12,Facial,14:30,15:30,Sophia,Liam,1200,1000,1000`;

  useEffect(() => {
    const savedHistory = localStorage.getItem("whatsappMessageHistory");
    if (savedHistory) {
      setMessageHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "whatsappMessageHistory",
      JSON.stringify(messageHistory),
    );
  }, [messageHistory]);

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
    setBirthdayDate(client.birthday_date || "");
    setAnniversaryDate(client.anniversary_date || "");
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedClient(null);
    setBirthdayDate("");
    setAnniversaryDate("");
  };

  const handleClickOpen = (client) => {
    setSelectedClient(client);
    setViewModalOpen(true);
  };

  const ClickClosetoClose = () => {
    setViewModalOpen(false);
    setSelectedClient(null);
    setSelectedTab(0);

    // Reset all filters
    setAppointmentNameFilter("");
    setAppointmentGenderFilter("all");
    setAppointmentDateFilter("");
    setMembershipNameFilter("");
    setMembershipCodeFilter("");
    setStatusFilters({
      not_started: true,
      completed: true,
      cancelled: true,
    });
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    setCustomer((prevData) =>
      prevData.map((client) =>
        client.number === selectedClient.number ? selectedClient : client,
      ),
    );
    handleEditModalClose();
  };

  const handleGenerateInvoice = async (appointmentId) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    setPrintLoading(true);
    setPrintLoadingId(appointmentId);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in//salonvendor/generate-invoice/${appointmentId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (response.ok) {
        // Get the PDF blob from the response
        const pdfBlob = await response.blob();

        // Create a URL for the PDF blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a temporary link to download the PDF
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = `invoices-${appointmentId}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up the URL object
        URL.revokeObjectURL(pdfUrl);

        // Create WhatsApp share link
        const invoiceMessage = `Your invoice has been generated. Please find the attached PDF.`;
        const encodedMessage = encodeURIComponent(invoiceMessage);
        const whatsappLink = `https://wa.me/91${selectedClient?.customer_phone}?text=${encodedMessage}`;

        // Open WhatsApp after a short delay to allow download to complete
        setTimeout(() => {
          window.open(whatsappLink, "_blank");
          toast.success("Invoice Downloaded and WhatsApp Opened!");
        }, 1000);
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating invoices");
    } finally {
      setPrintLoading(false);
      setPrintLoadingId(null);
    }
  };

  const handleSendBulkMessageses = async () => {
    setIsSendingBulkMessages(true);

    try {
      const processedNumbers = phoneNumbers
        .split(/[\n,]+/)
        .map((num) => num.trim())
        .filter((num) => num.length > 0);

      if (processedNumbers.length === 0) {
        throw new Error("Please enter at least one valid phone number");
      }

      const requestData = {
        name: campaignName,
        message: bulkMessageContent,
        country_code: whatsappConfig.country_code,
        phone_numbers: processedNumbers,
        login_time: whatsappConfig.login_time,
        new_msg_time: whatsappConfig.new_msg_time,
        send_msg_time: whatsappConfig.send_msg_time,
      };

      const response = await fetch(
        "https://backendapi.trakky.in//salonvendor/pos-vendorcampaign/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(requestData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Bulk WhatsApp campaign started successfully");

        const newHistoryEntry = {
          message: bulkMessageContent,
          date: new Date().toISOString(),
          recipients: `${processedNumbers.length} phone numbers`,
          isBulk: true,
          status: "started",
          name: campaignName,
        };

        setMessageHistory((prev) => [newHistoryEntry, ...prev]);

        setBulkWhatsappModalOpen(false);
        setCampaignName("");
        setPhoneNumbers("");
        setBulkMessageContent("");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to start bulk WhatsApp campaign",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSendingBulkMessages(false);
    }
  };

  const getCustomerinformation = async (pageNumber = 1) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pageNumber,
        page_size: rowsPerPage,
      });

      if (search.trim()) params.append("customer_name", search.trim());
      if (phoneSearch.trim())
        params.append("customer_phone", phoneSearch.trim());
      if (genderFilter !== "all")
        params.append("customer_gender", genderFilter);

      const response = await fetch(
        `https://backendapi.trakky.in//salonvendor/customer-table/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCustomer(data.results);
        setFilterData(data.results);
        // Use the count from API response to calculate total pages
        setTotalPages(Math.ceil(data.count / rowsPerPage));
        setPage(pageNumber);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      setItemCustomerName(selectedClient?.customer_name || "");
      setItemCustomerPhone(selectedClient?.customer_phone || "");
      setCustomerEmail(selectedClient?.customer_email || "");
      setBirthdayDate(selectedClient?.birthday_date || "");
      setAnniversaryDate(selectedClient?.anniversary_date || "");
    }
  }, [selectedClient]);

  const handleEditDetails = async (e) => {
    e.preventDefault();
    const data = {
      customer_name: CustomerName,
      customer_phone: itemCustomerPhone,
      customer_email: CustomerEmail,
      birthday_date: birthdayDate || null,
      anniversary_date: anniversaryDate || null,
      customer_gender: gender || null, // <-- Added gender
    };

    try {
      const res = await fetch(
        `https://backendapi.trakky.in//salonvendor/customer-table/${selectedClient?.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (res.ok) {
        const responseData = await res.json();
        toast.success("Client Details Updated Successfully");
        // Reset fields
        setItemCustomerName("");
        setItemCustomerPhone("");
        setCustomerEmail("");
        setBirthdayDate("");
        setAnniversaryDate("");
        setSelectedClient(null);
        getCustomerinformation();
        handleEditModalClose();
      } else {
        toast.error("Please give proper credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    setItemCustomerName(selectedClient?.customer_name);
    setItemCustomerPhone(selectedClient?.customer_phone);
    setCustomerEmail(selectedClient?.customer_email);
  }, [selectedClient]);

  useEffect(() => {
    getCustomerinformation(1);
  }, [search, phoneSearch, genderFilter, rowsPerPage]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleFile = () => {
    const blob = new Blob([sampleFileContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_import_sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("import_type", importType);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in//salonvendor/import-customers-data/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        toast.success("Customers imported successfully");
        getCustomerinformation();
        setImportModalOpen(false);
        setSelectedFile(null);
        setFileContent("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error importing customers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to import customers");
    }
  };

  const handleExport = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await fetch(
        "https://backendapi.trakky.in//salonvendor/export-customers-data/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customers_export.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Customers exported successfully");
      } else {
        toast.error("Error exporting customers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to export customers");
    }
  };

  const openWhatsappModal = (customer) => {
    setCurrentCustomerPhone(customer.customer_phone);
    setWhatsappModalOpen(true);
  };

  const closeWhatsappModal = () => {
    setWhatsappModalOpen(false);
    setMessageContent("");
    setShowHistory(false);
  };

  const handleSendMessage = () => {
    setConfirmSendOpen(true);
  };

  const confirmSendMessage = () => {
    setIsSendingMessage(true);

    const newHistoryEntry = {
      message: messageContent,
      date: new Date().toISOString(),
      customer: currentCustomerPhone,
    };
    setMessageHistory((prev) => [newHistoryEntry, ...prev]);

    const encodedMessage = encodeURIComponent(messageContent);
    const whatsappLink = `https://wa.me/91${currentCustomerPhone}?text=${encodedMessage}`;

    const whatsappWindow = window.open(whatsappLink, "_blank");

    if (whatsappWindow) {
      // toast.success("Message sent successfully!  Redirecting to WhatsApp...");
    } else {
      toast.error("Could not open WhatsApp. Please try again.");
    }

    setConfirmSendOpen(false);
    setWhatsappModalOpen(false);
    setIsSendingMessage(false);
    setMessageContent("");
  };

  const applyHistoryMessage = (message) => {
    setMessageContent(message);
    setShowHistory(false);
  };

  const deleteHistoryMessage = (index) => {
    setMessageHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateSellInvoice = async (sellId) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    setPrintLoading(true);
    setPrintLoadingId(sellId);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in//salonvendor/generate_sell_-invoice/${sellId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (response.ok) {
        // Get the PDF blob from the response
        const pdfBlob = await response.blob();

        // Create a URL for the PDF blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a temporary link to download the PDF
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = `sell-invoice-${sellId}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up the URL object
        URL.revokeObjectURL(pdfUrl);

        // Create WhatsApp share link
        const invoiceMessage = `Your product purchase invoice has been generated. Please find the attached PDF.`;
        const encodedMessage = encodeURIComponent(invoiceMessage);
        const whatsappLink = `https://wa.me/91${selectedClient?.customer_phone}?text=${encodedMessage}`;

        // Open WhatsApp after a short delay to allow download to complete
        setTimeout(() => {
          window.open(whatsappLink, "_blank");
          toast.success("Invoice downloaded and WhatsApp opened!");
        }, 1000);
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating invoice");
    } finally {
      setPrintLoading(false);
      setPrintLoadingId(null);
    }
  };

  const [statusFilters, setStatusFilters] = useState({
    not_started: true,
    completed: true,
    cancelled: true,
  });
  // Format purchase date function
  const formatPurchaseDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      // Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
      const day = date.getDate();
      let daySuffix = "th";
      if (day === 1 || day === 21 || day === 31) daySuffix = "st";
      else if (day === 2 || day === 22) daySuffix = "nd";
      else if (day === 3 || day === 23) daySuffix = "rd";

      // Month names
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Format time (12-hour format with AM/PM)
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      return `${day}${daySuffix} ${
        months[date.getMonth()]
      } ${date.getFullYear()}, ${hours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Function to handle status filter changes
  const handleStatusFilterChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Function to filter appointments based on selected statuses
  const filterAppointmentsByStatus = (appointments) => {
    if (!appointments) return [];

    const selectedStatuses = Object.keys(statusFilters).filter(
      (status) => statusFilters[status],
    );

    if (selectedStatuses.length === 0 || selectedStatuses.length === 3) {
      return appointments;
    }

    return appointments.filter((appointment) =>
      selectedStatuses.includes(appointment.appointment_status?.toLowerCase()),
    );
  };

  useEffect(() => {
    if (!viewModalOpen) {
      setStatusFilters({
        not_started: true,
        completed: true,
        cancelled: true,
      });
    }
  }, [viewModalOpen]);

  const handleGenerateAppointmentInvoice = async (appointment) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    IsGeneratingInvoice(true);
    setSelectedAppointmentForInvoice(appointment);

    try {
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in//salonvendor/generate-invoice-details/${appointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        },
      );

      if (!invoiceResponse.ok) {
        throw new Error("Failed to generate invoice");
      }

      const data = await invoiceResponse.json();

      // Fixed payload - Added appointment_id
      const whatsappPayload = {
        phone_numbers: [`91${appointment.customer_phone}`], // e.g., 918000052438
        appointment_id: appointment.id, // THIS WAS MISSING
        filename: `invoice_${appointment.id}`,
        file_url: data.invoice_url,
        body_values: [
          appointment.customer_name || "Customer",
          "Appointment",
          vendorData?.salon_name || "Salon",
          vendorData?.salon_name || "Salon",
        ],
      };

      console.log("Sending WhatsApp payload:", whatsappPayload); // Debug log

      const whatsappResponse = await fetch(
        "https://backendapi.trakky.in//salonvendor/send-invoice-whatsapp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(whatsappPayload),
        },
      );

      if (whatsappResponse.ok) {
        toast.success("Invoice sent successfully via WhatsApp!");
      } else {
        const errorText = await whatsappResponse.text();
        console.error(
          "WhatsApp API error:",
          whatsappResponse.status,
          errorText,
        );
        throw new Error("Failed to send invoice via WhatsApp: " + errorText);
      }
    } catch (error) {
      console.error("Error in handleGenerateAppointmentInvoice:", error);
      toast.error(error.message || "Error generating or sending invoice");
    } finally {
      IsGeneratingInvoice(false);
      setSelectedAppointmentForInvoice(null);
    }
  };

  const handleGenerateSell_Invoice = async (sell) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    IsGeneratingInvoice(true);
    setSelectedSellForInvoice(sell);

    try {
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in//salonvendor/generate_sell_-invoice-details/${sell.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        },
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
          ],
        };

        const whatsappResponse = await fetch(
          "https://backendapi.trakky.in//salonvendor/send-invoice-whatsapp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access_token}`,
            },
            body: JSON.stringify(whatsappPayload),
          },
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
      IsGeneratingInvoice(false);
      setSelectedSellForInvoice(null);
    }
  };

  const ShowCategoryTable = () => {
    if (!selectedClient) return null;

    if (selectedTab === 0) {
      let filteredAppointments = filterAppointmentsByStatus(
        selectedClient.appointments,
      );

      if (appointmentNameFilter) {
        filteredAppointments = filteredAppointments.filter((appointment) =>
          appointment.customer_name
            .toLowerCase()
            .includes(appointmentNameFilter.toLowerCase()),
        );
      }

      if (appointmentGenderFilter !== "all") {
        filteredAppointments = filteredAppointments.filter(
          (appointment) =>
            appointment.customer_gender.toLowerCase() ===
            appointmentGenderFilter.toLowerCase(),
        );
      }

      if (appointmentDateFilter) {
        filteredAppointments = filteredAppointments.filter(
          (appointment) => appointment.date === appointmentDateFilter,
        );
      }

      return (
        <Box sx={{ overflowX: "auto" }}>
          {/* Status Filters */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Typography
                variant="body1"
                className="font-semibold text-gray-700"
              >
                Filter by Status:
              </Typography>
              <div className="flex flex-wrap gap-4">
                {Object.keys(statusFilters).map((status) => (
                  <div key={status} className="flex items-center">
                    <Checkbox
                      checked={statusFilters[status]}
                      onChange={() => handleStatusFilterChange(status)}
                      size="small"
                      className="text-purple-600"
                    />
                    <Typography
                      variant="body2"
                      className="capitalize text-gray-700"
                    >
                      {status.replace("_", " ")}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Date Filter */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <TextField
                label="Appointment Date"
                type="date"
                value={appointmentDateFilter}
                onChange={(e) => setAppointmentDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                className="w-full sm:w-auto"
              />
              <Button
                variant="outlined"
                onClick={() => setAppointmentDateFilter("")}
                size="small"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filter
              </Button>
            </div>
          </div>

          {/* Appointment Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Appointment Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Appointment Time
                    </th>
                    {!isMobile && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Services
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Offers
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Staff Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Actual Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Discount %
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Discount Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Tax %
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Tax Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Final Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Amount Paid
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Remaining Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Credit Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Manager Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Consultation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Send Invoice
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments && filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment, index) => (
                      <tr
                        key={index}
                        className={
                          appointment.for_consultation
                            ? "bg-amber-50 hover:bg-amber-100"
                            : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {appointment.date
                            ? appointment.date.split("-").reverse().join("-")
                            : ""}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                          {appointment.time_in}
                        </td>
                        {!isMobile && (
                          <>
                            <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                              {appointment.included_services?.map((service) => (
                                <div
                                  key={service.id}
                                  className="mb-1 last:mb-0"
                                >
                                  {service.service_name} - ₹{" "}
                                  {service.final_price}
                                </div>
                              )) || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              {appointment.included_offers?.map((offer) => (
                                <div
                                  key={offer.offer_id}
                                  className="mb-1 last:mb-0"
                                >
                                  {offer.offer_name} - ₹{" "}
                                  {offer.discounted_price}
                                </div>
                              )) || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              {appointment.staff_contributions?.length > 0
                                ? appointment.staff_contributions.map(
                                    (contribution, idx) => (
                                      <div key={idx} className="mb-2 last:mb-0">
                                        {contribution.service_name && (
                                          <div className="font-semibold text-gray-800">
                                            Service: {contribution.service_name}
                                          </div>
                                        )}
                                        {contribution.offer_name && (
                                          <div className="font-semibold text-gray-800">
                                            Offer x: {contribution.offer_name}
                                          </div>
                                        )}
                                        {contribution.staff_distribution?.map(
                                          (staff, staffIdx) => (
                                            <div
                                              key={staffIdx}
                                              className="text-xs text-gray-600 ml-2"
                                            >
                                              {staff.staff_name} (
                                              {staff.staff_role})
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ),
                                  )
                                : appointment.staff_details?.length > 0
                                ? appointment.staff_details.map(
                                    (staffDetail, idx) => (
                                      <div key={idx}>
                                        {staffDetail.staff_contributions?.map(
                                          (contribution, cIdx) => (
                                            <div key={cIdx}>
                                              {
                                                contribution.staff_distribution
                                                  .staff_name
                                              }{" "}
                                              -{" "}
                                              {
                                                contribution.staff_distribution
                                                  .staff_role
                                              }
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ),
                                  )
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.actual_amount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {appointment.discount_percentage || "0"}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.discount_amount || "0"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {appointment.tax_percentage || "0"}%
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.tax_amount || "0"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.final_amount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.amount_paid}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.due_amount || "0"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              ₹{appointment.credit_amount || "0"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {appointment.manager_name || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  appointment.appointment_status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.appointment_status ===
                                      "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {appointment.appointment_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm border-r border-gray-200">
                              {appointment.for_consultation ? (
                                <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                  ✓ Consultation
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">
                                  Regular
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <Tooltip title="Manage The Print">
                                <IconButton
                                  size="small"
                                  className="hover:bg-purple-50"
                                  onClick={() => handlePrint(appointment.id)}
                                  disabled={printLoading}
                                >
                                  <Printer
                                    size={18}
                                    className="text-gray-600"
                                  />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Send Invoice via WhatsApp">
                                <IconButton
                                  onClick={() =>
                                    handleGenerateAppointmentInvoice(
                                      appointment,
                                    )
                                  }
                                  disabled={
                                    GeneratingInvoice &&
                                    selectedAppointmentForInvoice ===
                                      appointment.id
                                  }
                                  size="small"
                                  className="hover:bg-purple-100"
                                >
                                  {printLoading &&
                                  printLoadingId === appointment.id ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <>
                                      <FaWhatsapp className="text-green-600" />
                                    </>
                                  )}
                                </IconButton>
                              </Tooltip>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={isMobile ? 2 : 18}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {selectedClient.appointments &&
                        selectedClient.appointments.length > 0
                          ? "No appointments match the selected filters"
                          : "No Appointments Found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consultation Indicator */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <Typography variant="body2" className="text-amber-800 font-medium">
              Yellow highlighted appointments are for consultation
            </Typography>
          </div>
        </Box>
      );
    } else if (selectedTab === 1) {
      // Filter memberships based on the new filters
      let filteredMemberships = selectedClient.membership || [];

      if (membershipNameFilter) {
        filteredMemberships = filteredMemberships.filter((membership) =>
          membership.membership_data?.name
            ?.toLowerCase()
            .includes(membershipNameFilter.toLowerCase()),
        );
      }

      if (membershipCodeFilter) {
        filteredMemberships = filteredMemberships.filter((membership) =>
          membership.membership_code
            ?.toLowerCase()
            .includes(membershipCodeFilter.toLowerCase()),
        );
      }

      return (
        <Box sx={{ overflowX: "auto" }}>
          {/* Membership Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <TextField
                label="Membership Name"
                value={membershipNameFilter}
                onChange={(e) => setMembershipNameFilter(e.target.value)}
                size="small"
                className="w-full sm:w-48"
              />
              <TextField
                label="Membership Code"
                value={membershipCodeFilter}
                onChange={(e) => setMembershipCodeFilter(e.target.value)}
                size="small"
                className="w-full sm:w-48"
              />
              <Button
                variant="outlined"
                onClick={() => {
                  setMembershipNameFilter("");
                  setMembershipCodeFilter("");
                }}
                size="small"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Membership Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Membership Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Membership Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Membership Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Amount Paid
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Remaining Amount
                    </th>
                    {!isMobile && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Start Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Validity (Months)
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Service Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      T & C
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMemberships.length > 0 ? (
                    filteredMemberships.map((membership, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {membership.membership_data?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {membership.membership_code || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          ₹ {membership.membership_price || "0"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          ₹ {membership.amount_paid || "0"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          ₹ {membership.due_amount || "0"}
                        </td>
                        {!isMobile && (
                          <>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {membership.created_at || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                              {membership?.membership_data?.validity_in_month ||
                                "N/A"}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                          {membership?.membership_data?.whole_service ? (
                            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                              All Services
                            </span>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {membership?.membership_data?.included_services?.map(
                                (service, i) => (
                                  <li key={i} className="text-xs text-gray-600">
                                    {service}
                                  </li>
                                ),
                              ) || (
                                <li className="text-xs text-gray-500">
                                  No services included
                                </li>
                              )}
                            </ul>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                membership?.terms_and_conditions ||
                                "No terms specified",
                            }}
                            className="dangerous-html text-xs text-gray-600 max-w-xs overflow-hidden"
                          ></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={isMobile ? 8 : 10}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {selectedClient.membership &&
                        selectedClient.membership.length > 0
                          ? "No memberships match the selected filters"
                          : "User Not Enrolled Any Memberships"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
      );
    } else if (selectedTab === 2) {
      // Purchasing Product Details tab
      return (
        <Box sx={{ overflowX: "auto" }}>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Gender
                    </th>
                    {!isMobile && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Customer Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Actual Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Discount Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Final Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                          Purchase Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedClient.sell && selectedClient.sell.length > 0 ? (
                    selectedClient.sell.map((sell, index) => (
                      <React.Fragment key={index}>
                        {/* Main row with customer info */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                            {sell.client_details.customer_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                            {sell.client_details.customer_gender}
                          </td>

                          {!isMobile && (
                            <>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                {sell.client_details.customer_type}
                              </td>
                              <td
                                className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200"
                                colSpan={4}
                              >
                                Product List
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                {formatPurchaseDate(sell.created_at)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <Tooltip title="Generate Bill and Download PDF">
                                  <IconButton
                                    onClick={() =>
                                      handleGenerateSell_Invoice(sell)
                                    }
                                    disabled={
                                      GeneratingInvoice &&
                                      selectedSellForInvoice === sell.id
                                    }
                                    size="small"
                                    className="hover:bg-purple-50"
                                  >
                                    {printLoading &&
                                    printLoadingId === sell.id ? (
                                      <CircularProgress size={25} />
                                    ) : (
                                      <FaWhatsapp className="text-green-600" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </td>
                            </>
                          )}
                        </tr>

                        {/* Additional rows for each product */}
                        {!isMobile &&
                          sell.product_list.map((product, productIndex) => (
                            <tr
                              key={`${index}-${productIndex}`}
                              className="hover:bg-gray-50 bg-gray-50"
                            >
                              <td
                                className="px-4 py-2 border-r border-gray-200"
                                colSpan={3}
                              ></td>
                              <td className="px-4 py-2 text-sm text-gray-600 border-r border-gray-200">
                                {product.product_name}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 border-r border-gray-200">
                                {product.price_per_unit}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 border-r border-gray-200">
                                {product.discount}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 border-r border-gray-200">
                                {product.net_sub_total}
                              </td>
                              <td className="px-4 py-2 border-r border-gray-200"></td>
                              <td className="px-4 py-2"></td>
                            </tr>
                          ))}

                        {/* Row for summary information */}
                        {!isMobile && (
                          <tr className="bg-gray-100 hover:bg-gray-200 font-semibold">
                            <td
                              className="px-4 py-3 border-r border-gray-200"
                              colSpan={3}
                            ></td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              Total
                            </td>
                            <td
                              className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200"
                              colSpan={2}
                            >
                              Discount : {sell.net_sub_discount}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              Final : {sell.final_total}
                            </td>
                            <td className="px-4 py-3 border-r border-gray-200"></td>
                            <td className="px-4 py-3"></td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={isMobile ? 2 : 9}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No Product Purchases Found..
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
      );
    }
  };

  const [printModel, setprintModel] = useState(false);

  const handlePrint = (appointmentId) => {
    setprintModel(true);
    console.log("Hello");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#f8fafc",
        pl: { xs: 0, md: "72px" },
        overflowX: "hidden",
      }}
    >
      <ToastContainer />
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customers Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage customer information, contact details, and activity
              seamlessly through a smart dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                onClick={handleExport}
                sx={{
                  backgroundColor: "#2e7d32",
                  "&:hover": { backgroundColor: "#1b5e20" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={() => setImportModalOpen(true)}
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Import
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={() => setBulkWhatsappModalOpen(true)}
                sx={{
                  backgroundColor: "#25D366",
                  "&:hover": { backgroundColor: "#128C7E" },
                  ml: { xs: 0, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Bulk WhatsApp
              </Button>
            </Box>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-3">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <TextField
              type="text"
              name="search"
              id="search"
              placeholder="Search by name...."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  setSearch(value);
                }
              }}
              className="w-full lg:w-72"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              type="text"
              name="phoneSearch"
              id="phoneSearch"
              placeholder="Search by phone...."
              value={phoneSearch}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value) && value.length <= 10) {
                  setPhoneSearch(value);
                }
              }}
              className="w-full lg:w-64"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />

            <FormControl
              className="w-full lg:w-48"
              size={isMobile ? "small" : "medium"}
            >
              <InputLabel id="gender-filter-label">Gender</InputLabel>
              <Select
                labelId="gender-filter-label"
                value={genderFilter}
                label="Gender"
                onChange={(e) => setGenderFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              >
                <MenuItem value="all">All Genders</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="female">Other</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                setSearch("");
                setPhoneSearch("");
                setGenderFilter("all");
                getCustomerinformation(1);
              }}
              className="w-full lg:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sr. no
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sells
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Memberships
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingstate ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <CircularProgress className="text-purple-600" />
                        <span className="ml-3 text-gray-600">
                          Loading customers...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filterData?.length > 0 ? (
                  filterData?.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.customer_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item?.customer_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item?.customer_gender?.toLowerCase() === "male"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {item?.customer_gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item?.customer_email ? item?.customer_email : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                          {item?.customer_type
                            ? item.customer_type.charAt(0).toUpperCase() +
                              item.customer_type.slice(1)
                            : ""}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                          {item?.appointments_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          {item?.sell_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                          {item?.memberships_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md">
                        <IconButton
                          onClick={() => handleClickOpen(item)}
                          size="small"
                          className="hover:bg-purple-50 text-purple-600"
                        >
                          <VisibilityIcon
                            fontSize={isMobile ? "small" : "medium"}
                          />
                        </IconButton>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(item)}
                              size="small"
                              className="hover:bg-gray-100 text-gray-600"
                            >
                              <EditIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send WhatsApp Message">
                            <IconButton
                              onClick={() => openWhatsappModal(item)}
                              size="small"
                              className="hover:bg-green-50 text-green-600"
                            >
                              <WhatsAppIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No customers found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filterData?.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Typography variant="body2" className="text-gray-700">
                    Rows per page:
                  </Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(e.target.value)}
                    size="small"
                    sx={{
                      height: "36px",
                      borderRadius: "6px",
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </div>
                <Typography variant="body2" className="text-gray-700">
                  Page {page} of {totalPages}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 1}
                    onClick={() => getCustomerinformation(page - 1)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => getCustomerinformation(page + 1)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {printModel && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setprintModel(false)}
          />

          {/* Modal Content */}
          <div className="relative z-[9999] bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h1 className="text-2xl font-bold mb-4">Hello</h1>
            <p className="text-gray-600 mb-6">This is a centered modal!</p>

            <button
              onClick={() => setprintModel(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Client Details
              </h2>
              <IconButton
                onClick={handleEditModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {selectedClient && (
            <form onSubmit={handleEditDetails}>
              <div className="p-6 space-y-4">
                <TextField
                  label="Client Name"
                  value={CustomerName}
                  onChange={(e) => setItemCustomerName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <TextField
                  label="Contact No."
                  value={itemCustomerPhone}
                  onChange={(e) => setItemCustomerPhone(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <TextField
                  label="Email"
                  value={CustomerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <TextField
                  label="Date of Birth"
                  type="date"
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                <TextField
                  label="Anniversary Date"
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />

                {/* Gender Selection Dropdown */}
                <FormControl fullWidth size="small">
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-gray-500 text-sm"
                >
                  Old contact no.: {selectedClient?.customer_phone}
                </Typography>
              </div>

              <div className="p-6 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
      {/* View Modal */}
      <Modal open={viewModalOpen} onClose={ClickClosetoClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Client Details
              </h2>
              <IconButton
                onClick={ClickClosetoClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {selectedClient && (
            <div className="p-3 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    Customer Name
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedClient.customer_name}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    Customer Gender
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedClient.customer_gender}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    Total Appointments
                  </div>
                  <div className="text-lg font-semibold text-purple-600 mt-1">
                    {selectedClient.appointments_count}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    User Total Memberships
                  </div>
                  <div className="text-lg font-semibold text-purple-600 mt-1">
                    {selectedClient.memberships_count}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    Customer Mobile No.
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedClient.customer_phone}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-300">
                  <div className="text-sm font-medium text-gray-500">
                    Total Products Purchased
                  </div>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    {selectedClient.sell_count}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  minHeight: "48px",
                },
              }}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="Appointments" />
              <Tab label="Membership" />
              <Tab label="Purchasing Products" />
            </Tabs>
            <div className="mt-6">{ShowCategoryTable()}</div>
          </div>
        </div>
      </Modal>

      {/* WhatsApp Modal */}
      <Modal
        open={isWhatsappModalOpen}
        onClose={closeWhatsappModal}
        aria-labelledby="whatsapp-modal-title"
        disableAutoFocus={true}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Send WhatsApp Message
              </h2>
              <IconButton
                onClick={closeWhatsappModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentCustomerPhone}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <ArrowDropUpIcon className="text-gray-400 mr-1" />
                  <div className="text-sm font-medium text-gray-700">
                    Message Information
                  </div>
                </div>
                <Tooltip title="Message History">
                  <IconButton
                    onClick={() => setShowHistory(!showHistory)}
                    size="small"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            {showHistory && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Message History
                </div>
                {messageHistory.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {messageHistory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        onClick={() => applyHistoryMessage(item.message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-800 line-clamp-2">
                              {item.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(item.date).toLocaleString()}
                            </div>
                          </div>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryMessage(index);
                            }}
                            size="small"
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No message history found
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outlined"
                onClick={closeWhatsappModal}
                disabled={isSendingMessage}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={handleSendMessage}
                disabled={!messageContent || isSendingMessage}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isSendingMessage ? (
                  <div className="flex items-center">
                    <CircularProgress size={20} className="text-white mr-2" />
                    Preparing...
                  </div>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirm Send Dialog */}
      <Dialog
        open={confirmSendOpen}
        onClose={() => setConfirmSendOpen(false)}
        aria-labelledby="confirm-send-dialog"
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle
          id="confirm-send-dialog"
          className="text-lg font-semibold text-gray-900"
        >
          Confirm WhatsApp Message
        </DialogTitle>
        <DialogContent>
          <div className="space-y-3 mt-2">
            <div className="text-sm text-gray-600">
              You are about to send this message to:
            </div>
            <div className="text-sm font-medium text-gray-900">
              {currentCustomerPhone}
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {messageContent.substring(0, 100)}
              {messageContent.length > 100 ? "..." : ""}
            </div>
            <div className="text-sm text-gray-600">
              This will open WhatsApp. Continue?
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-6 border-t border-gray-200 gap-3">
          <Button
            onClick={() => setConfirmSendOpen(false)}
            color="primary"
            size="small"
            className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSendMessage}
            color="success"
            variant="contained"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
            size="small"
          >
            Open WhatsApp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk WhatsApp Modal */}
      <Modal
        open={bulkWhatsappModalOpen}
        onClose={() => setBulkWhatsappModalOpen(false)}
        aria-labelledby="bulk-whatsapp-modal-title"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Bulk WhatsApp Campaign
              </h2>
              <IconButton
                onClick={() => setBulkWhatsappModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <TextField
              label="Campaign Name"
              fullWidth
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <TextField
              label="Phone Numbers (comma or newline separated)"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="Enter phone numbers like: 9876543210, 9123456780, 9988776655"
              helperText="You can paste a list of numbers separated by commas or new lines"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <ArrowDropUpIcon className="text-gray-400 mr-1" />
                  <div className="text-sm font-medium text-gray-700">
                    Message Information
                  </div>
                </div>
                <Tooltip title="Message History">
                  <IconButton
                    onClick={() => setShowBulkHistory(!showBulkHistory)}
                    size="small"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <TextField
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={bulkMessageContent}
                onChange={(e) => setBulkMessageContent(e.target.value)}
                placeholder="Type your message here..."
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </div>

            {showBulkHistory && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Message History
                </div>
                {messageHistory.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {messageHistory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        onClick={() => {
                          setBulkMessageContent(item.message);
                          setShowBulkHistory(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-800 line-clamp-2">
                              {item.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(item.date).toLocaleString()}
                            </div>
                          </div>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistoryMessage(index);
                            }}
                            size="small"
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No message history found
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outlined"
                onClick={() => setBulkWhatsappModalOpen(false)}
                disabled={isSendingBulkMessages}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={handleSendBulkMessageses}
                disabled={
                  !bulkMessageContent ||
                  !phoneNumbers ||
                  !campaignName ||
                  isSendingBulkMessages
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isSendingBulkMessages ? (
                  <div className="flex items-center">
                    <CircularProgress size={20} className="text-white mr-2" />
                    Sending...
                  </div>
                ) : (
                  "Send Messages"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal open={importModalOpen} onClose={() => setImportModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Import Customers
              </h2>
              <IconButton
                onClick={() => setImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">
                Select a CSV file to import
              </div>
              <Button
                variant="text"
                startIcon={<DescriptionIcon />}
                onClick={downloadSampleFile}
                size="small"
                className="text-purple-600 hover:text-purple-700"
              >
                Download Sample
              </Button>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100 transition-colors duration-200"
            />

            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900">
                  Selected file: {selectedFile.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            )}

            <FormControl fullWidth size="small">
              <InputLabel id="import-type-label">Import Type</InputLabel>
              <Select
                labelId="import-type-label"
                value={importType}
                label="Import Type"
                onChange={(e) => setImportType(e.target.value)}
                sx={{
                  borderRadius: "8px",
                }}
              >
                <MenuItem value="append">Append to existing data</MenuItem>
                <MenuItem value="replace">Replace existing data</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outlined"
                onClick={() => setImportModalOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImportSubmit}
                disabled={!selectedFile}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Imports
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Box>
  );
};

export default Clients;
