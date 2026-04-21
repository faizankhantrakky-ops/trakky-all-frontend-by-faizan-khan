import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../../Context/Auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "./Appointment.css";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Delete, PriceChange } from "@mui/icons-material";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Button,
} from "@mui/material";
import { set } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import GeneralModal from "../../generalModal/GeneralModal";
import notificationSound from "../../../assets/ringtone-021-365652.mp3";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers";

const AppointmentForm = ({
  initialDate,
  initialTime,
  initialStaff = [],
  onSuccess,
  onCancel,
}) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSidecard, setShowSidecard] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [membershipUsedCard, setMembershipUsedCard] = useState(null);
  const [staff, setStaff] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const textFieldRef = useRef(null);
  const [customerData, setCustomerData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [services, setServices] = useState([
    {
      id: "",
      service_name: "",
      service_time: "",
      gender: "",
      discount: "",
      price: "",
      from_membership: false,
      membership_id: 0,
      staff: [], // Add staff field for UI
    },
  ]);
  
  // State for tax data
  const [vendorTaxData, setVendorTaxData] = useState({
    tax_amount: null,
    tax_percent: null,
    isLoading: false
  });
  
  console.log("vendor_number", vendorData?.ph_number);
  const [date, setDate] = useState(initialDate || dayjs());
  const [bookingTime, setBookingTime] = useState(
    initialTime ? dayjs().set("hour", initialTime).set("minute", 0) : dayjs()
  );
  // New state for consultation feature
  const [forConsultation, setForConsultation] = useState(false);
  const [consultationRemark, setConsultationRemark] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [gender, setgender] = useState("");
  const [membershipUsed, setMembershipUsed] = useState("N/A");
  const [checked24HourAppointments, setChecked24HourAppointments] = useState(
    new Set()
  );
  const [actualAmount, setActualAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]); // Changed to array for multiple selection
  const [membershipData, setMembershipData] = useState([]);
  const [checkedAppointments, setCheckedAppointments] = useState(new Set());
  const [
    changeServiceMembershipModalOpen,
    setChangeServiceMembershipModalOpen,
  ] = useState(false);
  const [
    changeServiceMembershipModalData,
    setChangeServiceMembershipModalData,
  ] = useState(null);

  const [selectedOffers, setSelectedOffers] = useState([
    {
      id: "",
      offer_name: "",
      offer_time: "",
      actual_price: "",
      discount_price: "",
      staff: [],
    },
  ]);

  const [selectedPackages, setSelectedPackages] = useState([
    {
      id: "",
      package_name: "",
      package_time: "",
      actual_price: "",
      discounted_price: "",
      staff: [],
      additional_included_service: {},
    },
  ]);

  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [page, setPage] = useState(1);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  // Function to fetch vendor tax data
  const fetchVendorTaxData = async () => {
    if (!vendorData?.id) return;
    
    setVendorTaxData(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/salonvendor/vendor/${vendorData.id}/`
      );
      
      if (response.status === 200 && response.data) {
        const taxData = {
          tax_amount: response.data.tax_amount,
          tax_percent: response.data.tax_percent,
          is_gst: response.data.is_gst,
          membership_is_gst: response.data.membership_is_gst,
          product_is_gst: response.data.product_is_gst,
          Wallet_is_gst: response.data.Wallet_is_gst
        };
        
        setVendorTaxData({
          ...taxData,
          isLoading: false
        });
        
        console.log("Tax data fetched:", taxData);
      }
    } catch (error) {
      console.error("Error fetching vendor tax data:", error);
      setVendorTaxData(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Fetch tax data when component mounts
  useEffect(() => {
    if (vendorData?.id) {
      fetchVendorTaxData();
    }
  }, [vendorData]);

  // Function to calculate tax on an amount
  const calculateTax = (amount) => {
    if (!amount || amount === 0) return { taxAmount: 0, totalWithTax: 0 };
    
    const taxPercent = vendorTaxData.tax_percent ? parseFloat(vendorTaxData.tax_percent) : null;
    const taxAmountValue = vendorTaxData.tax_amount ? parseFloat(vendorTaxData.tax_amount) : null;
    
    let tax = 0;
    let taxType = "none";
    
    // Priority: tax_percent takes precedence over tax_amount if both are provided
    if (taxPercent !== null && taxPercent !== 0) {
      tax = (amount * taxPercent) / 100;
      taxType = `percentage (${taxPercent}%)`;
    } else if (taxAmountValue !== null && taxAmountValue !== 0) {
      tax = taxAmountValue;
      taxType = `fixed amount (₹${taxAmountValue})`;
    }
    
    return {
      taxAmount: tax,
      totalWithTax: amount + tax,
      taxType,
      taxPercent: taxPercent,
      taxAmountValue: taxAmountValue
    };
  };

  // Function to display tax info
  const getTaxDisplayInfo = () => {
    if (vendorTaxData.tax_percent && parseFloat(vendorTaxData.tax_percent) !== 0) {
      return {
        type: "percentage",
        value: vendorTaxData.tax_percent,
        display: `${vendorTaxData.tax_percent}% GST/Tax Applied`
      };
    } else if (vendorTaxData.tax_amount && parseFloat(vendorTaxData.tax_amount) !== 0) {
      return {
        type: "fixed",
        value: vendorTaxData.tax_amount,
        display: `₹${vendorTaxData.tax_amount} Fixed Tax Applied`
      };
    } else {
      return {
        type: "none",
        value: null,
        display: "No Tax Applied"
      };
    }
  };

  useEffect(() => {
    if (initialStaff && initialStaff.length > 0) {
      // Only set staff if not already set
      setServices((prevServices) =>
        prevServices.map((service) => ({
          ...service,
          staff: service.staff?.length > 0 ? service.staff : initialStaff,
        }))
      );

      setSelectedOffers((prevOffers) =>
        prevOffers.map((offer) => ({
          ...offer,
          staff: offer.staff?.length > 0 ? offer.staff : initialStaff,
        }))
      );

      setSelectedPackages((prevPackages) =>
        prevPackages.map((pkg) => ({
          ...pkg,
          staff: pkg.staff?.length > 0 ? pkg.staff : initialStaff,
        }))
      );
    }
  }, [initialStaff]);
  
  // Load consultation remark from localStorage on component mount
  useEffect(() => {
    const savedRemark = localStorage.getItem("consultationRemark");
    if (savedRemark) {
      setConsultationRemark(savedRemark);
    }
  }, []);

  // Save consultation remark to localStorage when it changes
  useEffect(() => {
    if (consultationRemark) {
      localStorage.setItem("consultationRemark", consultationRemark);
    }
  }, [consultationRemark]);

  // Add useEffect to handle initialTime prop changes
  useEffect(() => {
    if (initialTime !== undefined) {
      const newTime = dayjs().set("hour", initialTime).set("minute", 0);
      setBookingTime(newTime);
    }
  }, [initialTime]);

  const formateTime = (time) => {
    let str = "";

    if (time?.days && time?.days !== "0") {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating !== "0") {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours !== "0") {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes !== "0") {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };
  
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.currentTime = 0;
    audio.play().catch((e) => console.log("Audio play failed:", e));

    // Vibrate if on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const toggleSidecard = () => {
    setShowSidecard(!showSidecard);
  };

  const handleViewClick = (membership) => {
    setSelectedMembership(membership);
    toggleSidecard(); // Open sidecard
  };

  const fetchOffers = async () => {

         if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }

    
    setOfferLoading(true);

    if (!vendorData?.salon) return;

    let API_URL = `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_id=${vendorData?.salon}`;

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        let tempData = data?.map((offer) => {
          return {
            id: offer?.id,
            offer_name: offer?.name,
            discount_price: offer?.discount_price,
            actual_price: offer?.actual_price,
            offer_time: offer?.offer_time,
          };
        });

        setOffers(tempData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setOfferLoading(false);
    }
  };

  const fetchPackages = async () => {
    setPackageLoading(true);

    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/salons/packages/?salon_id=${vendorData.salon}`,

      );

      if (response.status === 200) {

        setPackages(response.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setPackageLoading(false);
    }
  };

const fetchStaff = async () => {
  try {
    // const today = new Date().toISOString().split("T")[0];

    // -----------------------------
    // 1. Attendance (COMMENTED)
    // -----------------------------
    /*
    const attendanceRes = await axios.get(
      `https://backendapi.trakky.in/salonvendor/staff/attendance/?date=${today}`,
      {
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }
    );
    const attendanceData = attendanceRes?.data || [];
    */

    // -----------------------------
    // 2. Staff List (ACTIVE)
    // -----------------------------
    const staffRes = await axios.get(
      `https://backendapi.trakky.in/salonvendor/staff/`,
      {
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }
    );
    const allStaff = staffRes?.data || [];

    // -----------------------------
    // 3. Merge Attendance + Staff (COMMENTED)
    // -----------------------------
    /*
    const mergedData = attendanceData.map(att => {
      const staffDetail = allStaff.find(s => s.id === att.staff);

      return {
        ...att,
        staff_detail: staffDetail || null,
      };
    });
    */

    // -----------------------------
    // 4. Filter: ONLY Permanent Staff
    // -----------------------------
    const permanentStaff = allStaff.filter(
      staff => staff.is_permanent === true
    );

    // -----------------------------
    // 5. Set Final Staff List
    // -----------------------------
    setStaff(permanentStaff);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};




  const fetchManagers = async () => {
         if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  } 
  try {
    const response = await fetch(
      `https://backendapi.trakky.in/salonvendor/manager/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      // ❌ leave_date wale managers remove
      const filteredManagers = data.filter(
        (manager) => manager.leave_date === null
      );

      setManagerData(filteredManagers);
    } else {
      // toast.error("An error occured :" + response.statusText);
    }
  } catch (error) {
    toast.error("An error occured");
  }
};

  const fetchServices = async (page) => {
    // Don't fetch if we don't have a salon ID
    if (!vendorData?.salon) {
      setServiceLoading(false);
      return;
    }

    setServiceLoading(true);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=${page}&salon_id=${vendorData?.salon}`,
        {}
      );

    

      const data = await response.json();
      console.log("API response data:", data);

      // Handle the data based on your API's pagination structure
      const services = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : [];

      console.log("Extracted services:", services);

      const reducedData = services.map((service) => ({
        id: service?.id,
        service_name: service?.service_name,
        service_time: service?.service_time,
        gender: service?.gender,
        discount: service?.discount,
        price: service?.price,
      }));

      console.log("Processed services:", reducedData);

      // Update state based on pagination
      setTempAllServices((prevServices) =>
        page === 1 ? reducedData : [...prevServices, ...reducedData]
      );

      // Check for more pages - adjust this based on your API's pagination structure
      const hasMore =
        data.next !== null ||
        (data.pagination && data.pagination.has_next) ||
        (data.total_pages && page < data.total_pages);

      if (hasMore) {
        setPage(page + 1);
      } else {
        console.log("Reached end of services");
      }
    } catch (error) {
      console.error("Fetch services error:", error);
      toast.error(`Failed to fetch services: ${error.message}`);
    } finally {
      setServiceLoading(false);
    }
  };

  const fetchCustomerData = async (ph_no) => {
    if (!ph_no || ph_no.length !== 10) {
      setCustomerData([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/salonvendor/customer-table/?customer_phone=${ph_no}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 200 && response.data.results.length > 0) {
        setCustomerData(response.data.results);

        // Auto-fill customer details from the first matching customer
        const customer = response.data.results[0];
        setCustomerName(customer.customer_name || "");
        setgender(customer.customer_gender || "");
      } else {
        setCustomerData([]);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setCustomerData([]);
    }
  };

  const getMembershipData = async (ph_no) => {
    let API_URL = `https://backendapi.trakky.in/salonvendor/customer-memberships/`;

    if (ph_no) {
      API_URL += `?customer_number=${ph_no}`;
    }

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });

      const data = await response.json();
      // console.log("Membership API Response:", data); // Debug log

      if (response.ok) {
        setMembershipData(data);

        // If membership data is found, auto-fill customer details
        if (data.length > 0) {
          const membership = data[0];
          console.log("First membership item:", membership); // Debug log

          // Check different possible field names for customer details
          const customerName =
            membership.customer_name ||
            membership.customer_data?.customer_name ||
            membership.client_details?.customer_name;

          const customerGender =
            membership.customer_gender ||
            membership.customer_data?.customer_gender ||
            membership.client_details?.customer_gender;

          const customerNumberFromAPI =
            membership.customer_number ||
            membership.customer_data?.customer_phone ||
            membership.client_details?.customer_phone;

          if (customerName) {
            setCustomerName(customerName);
          }

          if (customerGender) {
            setgender(customerGender);
          }

          // Only set customer number if it's not already set
          if (customerNumberFromAPI && !customerNumber) {
            setCustomerNumber(customerNumberFromAPI);
          }
        }

        return data;
      } else {
        toast.error("An error occurred: " + response.statusText);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error fetching membership data:", error);
    }
  };

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchStaff();
    fetchManagers();
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchPackages();
    fetchServices(page);
  }, [vendorData]);

  useEffect(() => {
    if (customerNumber.length === 10) {
      // Fetch both membership and customer data
      getMembershipData(customerNumber);
      fetchCustomerData(customerNumber);
    } else {
      setMembershipData([]);
      setCustomerData([]);
      setMembershipUsed("N/A");
    }
  }, [customerNumber]);

  const handleApplyMembership = (membership) => {
    setMembershipUsed(membership?.membership_code);

    // Extract customer details from different possible field structures
    const customerName =
      membership.customer_name ||
      membership.customer_data?.customer_name ||
      membership.client_details?.customer_name;

    const customerGender =
      membership.customer_gender ||
      membership.customer_data?.customer_gender ||
      membership.client_details?.customer_gender;

    const customerNumberFromAPI =
      membership.customer_number ||
      membership.customer_data?.customer_phone ||
      membership.client_details?.customer_phone;

    // console.log("gender", membership.customer_data?.customer_gender)
    // console.log("gender", membership.customer_gender)
    // console.log("gender", membership.client_details?.customer_gender)

    if (customerName) {
      setCustomerName(customerName);
    }

    if (customerGender) {
      setgender(customerGender);
    }

    // Only set customer number if it's not already set
    if (customerNumberFromAPI && !customerNumber) {
      setCustomerNumber(customerNumberFromAPI);
    }
  };

  const sendWhatsAppMessage = async (appointmentData) => {
    try {
      let values = [];

      if (appointmentData.for_consultation) {
        // Consultation-only message
        values = [
          appointmentData.customer_name,                    // {{1}} Customer Name
          "Consultation Appointment",                       // {{2}} Type
          appointmentData.consultation_remark || "N/A",     // {{3}} Remark
          "N/A",                                            // {{4}} Amount (not applicable)
          appointmentData.gst || 18,                        // {{5}} GST
          appointmentData.date,                             // {{6}} Date
          appointmentData.time_in,                          // {{7}} Time
          vendorData?.salon_name || "Salon",                // {{8}} Salon Name
          vendorData?.salon_name || "Team",                 // {{9}} Team
        ];
      } else {
        // Normal appointment message
        values = [
          appointmentData.customer_name, // {{1}}
          appointmentData.included_services.map((s) => s.service_name).join(", "), // {{2}}
          appointmentData.included_services.map((s) => s.service_name).join(", "), // {{3}}
          appointmentData.final_amount, // {{4}}
          appointmentData.gst || 18, // {{5}}
          appointmentData.date, // {{6}}
          appointmentData.time_in, // {{7}}
          vendorData?.salon_name || "Salon", // {{8}}
          vendorData?.salon_name || "Team", // {{9}}
        ];
      }

      const payload = {
        phone_number: `91${appointmentData.customer_phone}`,
        values: values,
      };

      const response = await axios.post(
        "https://backendapi.trakky.in/salonvendor/send-whatsapp-message/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("WhatsApp message sent successfully");
      } else {
        console.error("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  const fetchTodaysAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      return [];
    }
  };

  // Function to send WhatsApp reminder
  const sendWhatsAppReminder = async (appointment) => {
    if (appointment.for_consultation) {
      console.log("Skipping WhatsApp reminder for consultation appointment");
      return false;
    }

    try {
      // Extract values for WhatsApp reminder message
      const payload = {
        phone_numbers: [`91${appointment.customer_phone}`],
        body_1: appointment.customer_name || "Customer", // Customer Name
        body_2: vendorData?.salon_name || "Salon", // Salon Name
        body_3: appointment.time_in, // Appointment Time
        body_4: appointment?.vendor_user_phone, // Salon mobile number
      };

      console.log("WhatsApp payload:", payload);
      // console.log("salon_mobile_number", appointment?.vendor_user_phone)
      // Send WhatsApp reminder message
      const response = await axios.post(
        "https://backendapi.trakky.in/salonvendor/send-whatsapp-message-today/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(
          "WhatsApp reminder sent successfully for appointment:",
          appointment.id
        );
        console.log("Response data:", response.data);

        // Mark this appointment as notified
        setCheckedAppointments((prev) => new Set([...prev, appointment.id]));
        return true;
      }
    } catch (error) {
      console.error("Error sending WhatsApp reminder:", error);
      console.error("Error details:", error.response?.data);
    }
    return false;
  };

  // Function to check if it's 2 hours before appointment
  const isTwoHoursBefore = (appointmentTime) => {
    const now = new Date();
    const appointmentDate = new Date(
      `${appointmentTime.date}T${appointmentTime.time_in}`
    );

    // Calculate difference in milliseconds
    const diffMs = appointmentDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours <= 2 && diffHours > 1.9; // Within the 2-hour window
  };

  const fetchTomorrowsAppointments = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

      const response = await axios.get(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?date=${tomorrowFormatted}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching tomorrow's appointments:", error);
      return [];
    }
  };

  const checkAndSendReminders = async () => {
    const todaysAppointments = await fetchTodaysAppointments();
    const tomorrowsAppointments = await fetchTomorrowsAppointments();

    // Check 2-hour reminders for today's appointments
    for (const appointment of todaysAppointments) {
      // Skip if already notified
      if (checkedAppointments.has(appointment.id)) continue;

      // Check if it's 2 hours before this appointment
      if (isTwoHoursBefore(appointment)) {
        await sendWhatsAppReminder(appointment);
      }
    }

    // Check 24-hour reminders for tomorrow's appointments
    for (const appointment of tomorrowsAppointments) {
      // Skip if already notified for 24-hour reminder
      if (checked24HourAppointments.has(appointment.id)) continue;

      // Check if it's 24 hours before this appointment
      if (isTwentyFourHoursBefore(appointment)) {
        await sendWhatsAppDateReminder(appointment);

        // Mark this appointment as notified for 24-hour reminder
        setChecked24HourAppointments(
          (prev) => new Set([...prev, appointment.id])
        );
      }
    }
  };

  // Set up interval to check for reminders
  useEffect(() => {
    // Check immediately on mount
    checkAndSendReminders();

    // Set up interval to check every minute
    const intervalId = setInterval(checkAndSendReminders, 1800000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [checkedAppointments, checked24HourAppointments]);

  // Function to send 24-hour WhatsApp reminder
  const sendWhatsAppDateReminder = async (appointment) => {
    if (appointment.for_consultation) {
      console.log(
        "Skipping 24-hour WhatsApp reminder for consultation appointment"
      );
      return false;
    }

    try {
      // Extract values for WhatsApp date reminder message
      const payload = {
        phone_numbers: [`91${appointment.customer_phone}`],
        body_1: appointment.customer_name || "Customer",
        body_2: vendorData?.salon_name || "Salon",
        body_3: appointment.date,
        body_4: appointment.time_in,
        body_5: appointment.included_services
          .map((s) => s.service_name)
          .join(", "),
        body_6: appointment?.vendor_user_phone || vendorData?.ph_number,
      };

      console.log("24-hour WhatsApp payload:", payload);

      // Send WhatsApp date reminder message
      const response = await axios.post(
        "https://backendapi.trakky.in/salonvendor/send-whatsapp-message-date/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(
          "24-hour WhatsApp reminder sent successfully for appointment:",
          appointment.id
        );
        console.log("Response data:", response.data);
        return true;
      }
    } catch (error) {
      console.error("Error sending 24-hour WhatsApp reminder:", error);
      console.error("Error details:", error.response?.data);
    }
    return false;
  };

  // Function to check if it's 24 hours before appointment
  const isTwentyFourHoursBefore = (appointmentTime) => {
    const now = new Date();
    const appointmentDate = new Date(
      `${appointmentTime.date}T${appointmentTime.time_in}`
    );

    // Calculate difference in milliseconds
    const diffMs = appointmentDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours <= 24 && diffHours > 23.9; // Within the 24-hour window
  };

  const autoAssignStaff = (serviceId, offerId) => {
    const availableStaff = staff.filter((staffMember) => !staffMember.is_busy);

    if (availableStaff.length === 0) return [];

    // Simple round-robin assignment or based on staff role
    return [availableStaff[0].id]; // Assign first available staff
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({});

    const errors = {};

    if (!customerName) {
      errors.customerName = "Customer name is required";
    }

    if (!customerNumber) {
      errors.customerNumber = "Customer number is required";
    } else if (customerNumber.length !== 10) {
      errors.customerNumber = "Customer number must be 10 digits";
    }

    if (!gender) {
      errors.gender = "Gender is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!customerName) {
      toast.error("Customer name is required");
      return;
    }

    if (!customerNumber) {
      toast.error("Customer number is required");
      return;
    }

    let SO = selectedOffers.filter((offer) => offer.id !== "");
    let SP = selectedPackages.filter((pkg) => pkg.id !== "");
    let SS = services.filter((service) => service.id !== "");

    let valid = true;
    SP.forEach((pkg) => {
      if (pkg.additional_included_service) {
        Object.values(pkg.additional_included_service).forEach((servs) => {
          servs.forEach((serv) => {
            if (serv.time.seating > 0) {
              const dates = serv.seating_dates || [];
              if (dates.length !== serv.time.seating || dates.some((d) => !d)) {
                valid = false;
              }
            }
          });
        });
      }
    });

    if (!valid) {
      toast.error("Please select all required dates for package services");
      return;
    }

    setIsSubmitting(true);

    const allServiceStaffIds = SS.flatMap((service) => service.staff || []);
    const allOfferStaffIds = SO.flatMap((offer) => offer.staff || []);
    const allPackageStaffIds = SP.flatMap((pkg) => pkg.staff || []);

    const staffMap = {};
    staff.forEach((staffMember) => {
      staffMap[staffMember.id] = staffMember;
    });

    const uniqueAllStaffIds = [
      ...new Set([...allServiceStaffIds, ...allOfferStaffIds, ...allPackageStaffIds]),
    ];

    const customerGenderValue = typeof gender === "object" ? gender?.value : gender;

    let branchId = localStorage.getItem("branchId");

    console.log(branchId);

    // Calculate tax on actual_amount and final_amount
    const actualAmountNum = parseFloat(actualAmount) || 0;
    const finalAmountNum = parseFloat(finalAmount) || 0;
    
    // Apply tax to both amounts
    const actualWithTax = calculateTax(actualAmountNum);
    const finalWithTax = calculateTax(finalAmountNum);
    
    const taxInfo = getTaxDisplayInfo();

    const payload = {
      date: date?.format("YYYY-MM-DD"),
      time_in: bookingTime?.format("HH:mm:ss"),
      customer_phone: customerNumber,
      customer_name: customerName,
      customer_gender: customerGenderValue,
      manager: selectedManager,
      service: SS.map((service) => service.id),
      staff: uniqueAllStaffIds,
      included_services: SS.map((service) => ({
        service_id: service.id,
        service_name: service.service_name,
        actual_price: service.price,
        final_price: service.discount,
        from_membership: service.from_membership,
        membership_id: service.membership_id,
        duration: service.service_time,
        gender: service.gender,
        staff: (service.staff || []).map((staffId) => staffId),
      })),
      included_offers: [
        ...SO.map((offer) => ({
          offer_id: offer.id,
          actual_price: offer.actual_price,
          discounted_price: offer.discount_price,
          offer_time: offer.offer_time,
          offer_name: offer.offer_name,
          staff: (offer.staff || []).map((staffId) => staffId),
        })),
        ...SP.map((pkg) => ({
          offer_id: pkg.id,
          actual_price: pkg.actual_price,
          discounted_price: pkg.discounted_price,
          offer_time: pkg.package_time,
          offer_name: pkg.package_name,
          staff: (pkg.staff || []).map((staffId) => staffId),
        })),
      ],
      staff_contributions: [
        ...SS.map((service) => ({
          service_id: service.id,
          service_name: service.service_name,
          staff_distribution: (service.staff || []).map((staffId) => ({
            staff_id: staffId,
            staff_name: staffMap[staffId]?.staffname || "",
            staff_role: staffMap[staffId]?.staff_role || "",
          })),
        })),
        ...SO.map((offer) => ({
          offer_id: offer.id,
          offer_name: offer.offer_name,
          staff_distribution: (offer.staff || []).map((staffId) => ({
            staff_id: staffId,
            staff_name: staffMap[staffId]?.staffname || "",
            staff_role: staffMap[staffId]?.staff_role || "",
          })),
        })),
        ...SP.map((pkg) => ({
          offer_id: pkg.id,
          offer_name: pkg.package_name,
          staff_distribution: (pkg.staff || []).map((staffId) => ({
            staff_id: staffId,
            staff_name: staffMap[staffId]?.staffname || "",
            staff_role: staffMap[staffId]?.staff_role || "",
          })),
        })),
      ],
      package: SP.map((pkg) => pkg.id),
      included_package_details: SP.map((pkg) => pkg.additional_included_service),
      for_consultation: forConsultation,
      consultation_remark: forConsultation ? consultationRemark : "",
      appointment_status: "not_started",
      actual_amount: actualWithTax.totalWithTax, // Send amount with tax
      final_amount: finalWithTax.totalWithTax, // Send amount with tax
      actual_amount_without_tax: actualAmountNum, // Store original without tax
      final_amount_without_tax: finalAmountNum, // Store original without tax
      tax_applied: {
        tax_percent: vendorTaxData.tax_percent,
        tax_amount: vendorTaxData.tax_amount,
        tax_calculated_on_actual: actualWithTax.taxAmount,
        tax_calculated_on_final: finalWithTax.taxAmount,
        tax_type: taxInfo.type,
        tax_display: taxInfo.display
      },
      is_reviewed: false,
      amount_paid: 0,
    };

    if (membershipUsed !== "N/A") {
      let membershipfilter = membershipData?.filter(
        (item) => item?.membership_code == membershipUsed
      );

      if (membershipfilter?.length > 0) {
        payload.membership = [membershipfilter[0]?.id];
      }
    } else {
      payload.membership = [];
    }

    try {
      const response = await axios.post(
        "https://backendapi.trakky.in/salonvendor/appointments-new/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 201) {
        playNotificationSound();
        
        // Show tax applied toast message
        if (taxInfo.type !== "none") {
          toast.success(`Appointment created successfully! ${taxInfo.display} on amounts`);
        } else {
          toast.success("Appointment created successfully");
        }

        // ✅ New POST to appointments/process/
        try {
          await axios.post(
            "https://backendapi.trakky.in/salonvendor/appointments/process/",
            { appointment_id: response.data.id },
            {
              headers: {
                Authorization: `Bearer ${authTokens.access_token}`,
              },
            }
          );
        } catch (processError) {
          console.error("Failed to process appointment:", processError);
          // toast.warning("Appointment created, but processing failed.");
        }

        await sendWhatsAppMessage(payload);

        const appointmentDate = new Date(payload.date);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (
          appointmentDate.getFullYear() === tomorrow.getFullYear() &&
          appointmentDate.getMonth() === tomorrow.getMonth() &&
          appointmentDate.getDate() === tomorrow.getDate()
        ) {
          await sendWhatsAppDateReminder(payload);
        }

        // Reset form
        setCustomerName("");
        setCustomerNumber("");
        setgender("");
        setMembershipUsed("N/A");
        setActualAmount("");
        setFinalAmount("");
        setSelectedStaff([]);
        setSelectedManager("");
        setServices([
          {
            id: "",
            service_name: "",
            service_time: "",
            gender: "",
            discount: "",
            price: "",
            from_membership: false,
            membership_id: 0,
            staff: [],
          },
        ]);
        setSelectedOffers([
          {
            id: "",
            offer_name: "",
            offer_time: "",
            actual_price: "",
            discount_price: "",
            staff: [],
          },
        ]);
        setSelectedPackages([
          {
            id: "",
            package_name: "",
            package_time: "",
            actual_price: "",
            discounted_price: "",
            staff: [],
            additional_included_service: {},
          },
        ]);
        setDate(dayjs());
        setBookingTime(dayjs());
        setForConsultation(false);
        setConsultationRemark("");

        navigate("/appointment/list-appointment/card");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Error creating appointment - unexpected status");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);

      const errorMsg =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.customer_phone?.[0] ||
        "Failed to create appointment. Please check the data and try again.";

      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceChange = () => {
    let actual_amount = 0;
    let final_amount = 0;

    // Calculate services amounts
    services.forEach((service) => {
      if (service.id && service.price) {
        actual_amount += parseFloat(service.price) || 0;
        final_amount += parseFloat(service.discount) || 0;
      }
    });

    // Calculate offers amounts
    selectedOffers.forEach((offer) => {
      if (offer.id && offer.actual_price && offer.discount_price) {
        actual_amount += parseFloat(offer.actual_price) || 0;
        final_amount += parseFloat(offer.discount_price) || 0;
      }
    });

    // Calculate packages amounts
    selectedPackages.forEach((pkg) => {
      if (pkg.id && pkg.actual_price && pkg.discounted_price) {
        actual_amount += parseFloat(pkg.actual_price) || 0;
        final_amount += parseFloat(pkg.discounted_price) || 0;
      }
    });

    setActualAmount(actual_amount);
    setFinalAmount(final_amount);
  };

  useEffect(() => {
    handlePriceChange();
  }, [selectedOffers, selectedPackages, services, membershipUsed]); // Added membershipUsed as dependency

  useEffect(() => {
    if (services?.length > 0) {
      const membershipFilter = membershipData?.find(
        (membership) => membership.membership_code === membershipUsed
      );

      if (!membershipFilter || membershipUsed === "N/A") {
        setServices((prev) => {
          return prev.map((service) => {
            return {
              ...service,
              from_membership: false,
              membership_id: 0,
              discount: service.price,
            };
          });
        });

        return;
      }

      if (
        membershipFilter.membership_data.whole_service &&
        membershipUsed !== "N/A"
      ) {
        setServices(
          services.map((service) => {
            const discountPercentage =
              membershipFilter.membership_data.discount_percentage / 100;
            const discountPrice = service.price * (1 - discountPercentage);

            return {
              ...service,
              from_membership: true,
              membership_id: membershipFilter.id,
              discount: discountPrice,
            };
          })
        );
        return;
      } else if (membershipUsed !== "N/A") {
        const servicesInMembership =
          membershipFilter.membership_data.included_services;

        if (servicesInMembership.length === 0) {
          setServices(
            services.map((service) => ({
              ...service,
              from_membership: false,
              membership_id: 0,
              discount: service.price,
            }))
          );
          return;
        }

        setServices(
          services.map((service) => {
            const isInMembership = servicesInMembership.includes(service.id);
            const discountPercentage =
              membershipFilter.membership_data.discount_percentage / 100;
            const discountPrice = service.price * (1 - discountPercentage);

            return {
              ...service,
              from_membership: isInMembership,
              membership_id: isInMembership ? membershipFilter.id : 0,
              discount: isInMembership ? discountPrice : service.price,
            };
          })
        );
      }
    }
  }, [membershipUsed]);

  const handleDateChange = (pkgIndex, category, servIndex, dateIndex, newValue) => {
    setSelectedPackages(prev => {
      const newPkgs = [...prev];
      const newPkg = { ...newPkgs[pkgIndex] };
      const newIncluded = { ...newPkg.additional_included_service };
      const newServs = [...newIncluded[category]];
      const newServ = { ...newServs[servIndex] };
      const newDates = [...(newServ.seating_dates || Array.from({ length: newServ.time.seating }).fill(null))];
      newDates[dateIndex] = newValue ? newValue.format("YYYY-MM-DD") : null;
      newServ.seating_dates = newDates;
      newServs[servIndex] = newServ;
      newIncluded[category] = newServs;
      newPkg.additional_included_service = newIncluded;
      newPkgs[pkgIndex] = newPkg;
      return newPkgs;
    });
  };

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState(null);
  const [anniversaryDate, setAnniversaryDate] = useState(null);

  // Get tax display info for UI
  const taxDisplayInfo = getTaxDisplayInfo();
  
  // Calculate amounts with tax for display
  const actualWithTaxDisplay = calculateTax(actualAmount);
  const finalWithTaxDisplay = calculateTax(finalAmount);

  return (
    <div className=" h-[calc(100%-64px)] w-full py-2 px-4 overflow-y-auto">
      <ToastContainer />
      <div className=" custom-scrollbar h-20 w-full rounded-lg bg-white shadow-sm overflow-auto">
        <div className="flex gap-4 w-full h-full overflow-x-auto p-2">
          {staff?.map((item, index) => (
            <div
              key={index}
              className="h-full w-fit min-w-24 lg:min-w-32 gap-1 flex items-center flex-col justify-center px-2 py-1 bg-white rounded-lg shadow-sm border border-gray-300 "
            >
              <p
                title={item?.staffname} // hover pe full text dikhega
                className="text-base font-semibold text-center truncate w-28"
              >
                {item?.staffname}
              </p>
              <p
                title={item?.staff_role}
                className="text-xs font-medium text-center truncate w-28 text-gray-600"
              >
                ({item?.staff_role})
              </p>

            </div>
          ))}
        </div>

      </div>
      <div className="flex flex-col esm:flex-row gap-4 w-full esm:w-auto mt-3">
        <div className="sm-auto sm:w-[calc(100%-340px)] border rounded-md h-auto bg-white shadow-sm p-3">
          <div className=" mb-6  rounded-lg bg-white grid gap-x-6 gap-y-6 grid-cols-2 mx-auto py-6 md:py-5 lg:px-12">
            <div className=" col-span-2 -mb-2">
              <h1 className=" text-base font-semibold">
                Appointment Date & Time
              </h1>
            </div>

            <div className=" w-full   ">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{
                  width: "100%",
                }}
              >
                <DatePicker
                  label="Date"
                  value={date}
                  sx={{
                    width: "100%",
                  }}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  format="DD/MM/YYYY"

                />
              </LocalizationProvider>
            </div>
            <div className=" w-full   ">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{
                  width: "100%",
                }}
              >
                <TimePicker
                  label="Booking Time"
                  value={bookingTime}
                  onChange={setBookingTime}
                  referenceDate={date}
                  sx={{
                    width: "100%",
                  }}
              
                />
              </LocalizationProvider>
            </div>


           <LocalizationProvider dateAdapter={AdapterDayjs}>
    {/* Header with Title and Manage Button */}
    <div className="col-span-2 -mb-2 mt-1 flex items-center justify-between">
      <h1 className="text-base font-semibold">Customer Details</h1>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setShowMoreDetails(!showMoreDetails)}
      >
        {showMoreDetails ? "Hide" : "Manage"} Add More Details
      </Button>
    </div>

    {/* Existing Fields */}
    <TextField
      id="number"
      label="Customer Number"
      type="number"
      onWheel={() => document.activeElement.blur()}
      onKeyDownCapture={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
        }
      }}
      variant="outlined"
      fullWidth
      value={customerNumber}
      required
      onChange={(e) => {
        if (e.target.value.length <= 10) {
          setCustomerNumber(e.target.value);
        }
      }}
      inputProps={{ maxLength: 10 }}
      error={!!fieldErrors.customerNumber}
      helperText={
        fieldErrors.customerNumber ||
        (customerNumber.length === 10 && customerData.length > 0
          ? "*Customer found - details auto-filled"
          : customerNumber.length === 10
          ? "*No customer found with this number"
          : "")
      }
    />
    <TextField
      fullWidth
      id="customer-name"
      label="Customer Name"
      variant="outlined"
      value={customerName}
      onChange={(e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value)) {
          setCustomerName(value);
        }
      }}
      required
      error={!!fieldErrors.customerName}
      helperText={fieldErrors.customerName}
    />
    <div className="w-full">
      <Autocomplete
        disablePortal
        id="gender-options"
        options={genderOptions}
        getOptionLabel={(option) => option.label}
        fullWidth
        value={genderOptions.find((option) => option.value === gender) || null}
        onChange={(e, value) => setgender(value ? value.value : "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Gender"
            error={!!fieldErrors.gender}
            helperText={fieldErrors.gender}
          />
        )}
      />
    </div>
    <div className="w-full">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Manager Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedManager}
          label="Manager Name"
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          {managerData?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.managername}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>

    {/* Additional Fields - Shown only when Manage is clicked */}
    {showMoreDetails && (
      <>
        <DesktopDatePicker
          label="Birth Date"
          value={birthdayDate}
          onChange={(newValue) => setBirthdayDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DesktopDatePicker
          label="Anniversary Date"
          value={anniversaryDate}
          onChange={(newValue) => setAnniversaryDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </>
    )}
  </LocalizationProvider>

            <div className=" col-span-2 -mb-2 mt-1">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={forConsultation}
                    onChange={(e) => setForConsultation(e.target.checked)}
                    color="primary"
                  />
                }
                label="For Consultation Only"
              />
            </div>

            {!forConsultation && (
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Membership Details</h1>
              </div>
            )}

            {!forConsultation && (
              <div className=" w-full">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Membership used
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Membership used"
                    value={membershipUsed}
                    onChange={(e) => {
                      setMembershipUsed(e.target.value);
                    }}
                  >
                    <MenuItem value="N/A" selected>
                      No Membership applied
                    </MenuItem>
                    {membershipData?.map((item) => (
                      <MenuItem key={item.id} value={item?.membership_code}>
                        {item.membership_code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {!forConsultation && (
              <div className=" w-full">
                {customerNumber && membershipData?.length > 0 ? (
                  <div
                    className=""
                    style={{
                      color: "green",
                      fontStyle: "italic",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    *Membership available for this contact number
                  </div>
                ) : customerNumber ? (
                  <div
                    className=""
                    style={{
                      color: "red",
                      fontStyle: "italic",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    *No membership available for this contact number
                  </div>
                ) : null}
              </div>
            )}
            {!forConsultation && (
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Service Details</h1>
              </div>
            )}
            {!forConsultation && services.map((service, index) => (
              <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                <div className="  flex gap-2 items-center">
                  <div className=" w-[40%] grow shrink  ">
                    <Autocomplete
                      disablePortal
                      id="service-options"
                      options={allServices}
                      disabled={serviceLoading}
                      getOptionLabel={(option) =>
                        `${option?.service_name} (${option?.gender})`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Service" />
                      )}
                      value={service.id ? service : null}
                      onChange={(e, value) => {
                        let temp = [...services];

                        if (value === null || value === undefined) {
                          temp[index] = {
                            id: value.id,
                            service_name: value.service_name,
                            service_time: value.service_time,
                            gender: value.gender,
                            discount: value.price, // Default to full price initially
                            price: value.price,
                            from_membership: false,
                            membership_id: 0,
                            staff: initialStaff.length > 0 ? initialStaff : [], // Properly initialize staff
                          };
                          setServices(temp);
                          return;
                        }

                        if (membershipUsed !== "N/A") {
                          let membershipfilter = membershipData?.filter(
                            (item) => {
                              return item?.membership_code == membershipUsed;
                            }
                          );

                          if (
                            !membershipfilter ||
                            membershipfilter.length === 0
                          ) {
                            temp[index] = {
                              id: value.id,
                              service_name: value.service_name,
                              service_time: value.service_time,
                              gender: value.gender,
                              discount: value.price,
                              price: value.price,
                              from_membership: false,
                              membership_id: 0,
                              staff:
                                temp[index]?.staff?.length > 0
                                  ? temp[index].staff
                                  : initialStaff,
                            };

                            setServices(temp);
                            return;
                          }
                          if (membershipfilter?.length > 0) {
                            let membershipData = membershipfilter[0];

                            if (membershipData.membership_data.whole_service) {
                              temp[index] = {
                                id: value.id,
                                service_name: value.service_name,
                                service_time: value.service_time,
                                gender: value.gender,
                                discount:
                                  value.price *
                                  (1 -
                                    membershipData.membership_data
                                      .discount_percentage /
                                    100),
                                price: value.price,
                                from_membership: true,
                                membership_id: membershipData.id,
                              };
                              setServices(temp);
                              return;
                            } else {
                              const servicesInMembership =
                                membershipData.membership_data
                                  .included_services;

                              if (servicesInMembership.length === 0) {
                                temp[index] = {
                                  id: value.id,
                                  service_name: value.service_name,
                                  service_time: value.service_time,
                                  gender: value.gender,
                                  discount: value.price,
                                  price: value.price,
                                  from_membership: false,
                                  membership_id: 0,
                                };
                                setServices(temp);
                                return;
                              } else {
                                const isInMembership =
                                  servicesInMembership.includes(value.id);
                                const discountPercentage =
                                  membershipData.membership_data
                                    .discount_percentage / 100;
                                const discountPrice =
                                  value.price * (1 - discountPercentage);

                                temp[index] = {
                                  id: value.id,
                                  service_name: value.service_name,
                                  service_time: value.service_time,
                                  gender: value.gender,
                                  discount: isInMembership
                                    ? discountPrice
                                    : value.price,
                                  price: value.price,
                                  from_membership: isInMembership,
                                  membership_id: isInMembership
                                    ? membershipData.id
                                    : 0,
                                };
                                setServices(temp);
                                return;
                              }
                            }
                          } else {
                            temp[index] = {
                              id: value.id,
                              service_name: value.service_name,
                              service_time: value.service_time,
                              gender: value.gender,
                              discount: value.price,
                              price: value.price,
                              from_membership: false,
                              membership_id: 0,
                            };

                            setServices(temp);
                          }
                        } else {
                          temp[index] = {
                            id: value.id,
                            service_name: value.service_name,
                            service_time: value.service_time,
                            gender: value.gender,
                            discount: value.price,
                            price: value.price,
                            from_membership: false,
                            membership_id: 0,
                            staff:
                              temp[index]?.staff?.length > 0
                                ? temp[index].staff
                                : initialStaff,
                          };
                          setServices(temp);

                          return;
                        }
                      }}
                    />
                  </div>
                
                  <div className="w-1/4">
                    <FormControl
                      fullWidth
                      sx={{
                        backgroundColor: service?.id ? "inherit" : "#f9f9f9",
                        cursor: service?.id ? "auto" : "not-allowed",
                      }}
                    >
                      <InputLabel id={`staff-label-${index}`}>Staff</InputLabel>
                      <Select
                        labelId={`staff-label-${index}`}
                        id={`staff-select-${index}`}
                        multiple
                        value={service.staff || []} // Use service.staff instead of selectedStaff
                        label="Staff"
                        disabled={!service?.id}
                        onChange={(e) => {
                          let temp = [...services];

                          temp[index] = {
                            ...temp[index],
                            staff: e.target.value,
                            // staff: initialStaff.length > 0 ? initialStaff : [],
                          };
                          setServices(temp);
                        }}
                        renderValue={(selected) =>
                          selected
                            .map((id) => {
                              const staffMember = staff.find(
                                (s) => s.id === id
                              );
                              return staffMember ? staffMember.staffname : "";
                            })
                            .join(", ")
                        }
                      >
                        {staff.map((staffMember) => (
                          <MenuItem
                            key={staffMember.id}
                            value={staffMember.id}
                            disabled={staffMember.is_busy}
                            style={{
                              color: staffMember.is_busy ? "#ccc" : "inherit",
                              opacity: staffMember.is_busy ? 0.7 : 1,
                            }}
                          >
                            <Checkbox
                              checked={
                                service.staff?.includes(staffMember.id) || false
                              }
                            />{" "}
                            <ListItemText
                              primary={`${staffMember.staffname} (${staffMember.staff_role
                                }) - ${staffMember.is_busy ? "Busy" : "Free"}`}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Price fields */}
                  <div className="w-1/6">
                    <TextField
                      id={`actual-amount-${index}`}
                      label="Actual Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={service.price}
                      readOnly
                      disabled
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                    />
                  </div>
                  <div className="w-1/6">
                    <TextField
                      id={`final-amount-${index}`}
                      label="Final Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={service.discount}
                      readOnly
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                      disabled
                    />
                  </div>

                  {/* Add/Remove service buttons */}
                  <div className="h-full w-[60px] shrink-0 flex items-center justify-center">
                    {index === services.length - 1 ? (
                      <div
                        className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                        onClick={() => {
                          setServices([
                            ...services,
                            {
                              id: "",
                              service_name: "",
                              service_time: "",
                              gender: "",
                              discount: "",
                              price: "",
                              from_membership: false,
                              membership_id: 0,
                              staff: "",
                            },
                          ]);
                        }}
                      >
                        <AddIcon className="h-full w-full text-white !text-[40px]" />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                        onClick={() => {
                          if (services.length === 1) {
                            let temp = [...services];
                            temp[index] = {
                              id: "",
                              service_name: "",
                              service_time: "",
                              gender: "",
                              discount: "",
                              price: "",
                              from_membership: false,
                              membership_id: 0,
                              staff: "",
                            };
                            setServices(temp);
                            return;
                          }

                          let temp = [...services];
                          temp.splice(index, 1);
                          setServices(temp);
                        }}
                      >
                        <DeleteOutlineIcon className="h-full w-full !text-[32px] text-white" />
                      </div>
                    )}
                  </div>
                </div>
                {service?.id && (
                  <div className=" text-gray-500 text-[13px] pl-2">
                    {membershipUsed !== "N/A" && (
                      <span
                        className=" h-full"
                      >
                        {" "}
                        &nbsp;,
                        <span className=" underline text-black">
                          Membership applied (
                          {service.from_membership ? "Yes" : "No"})
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

          {!forConsultation && (
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Offer Details</h1>
              </div>
            )}
            {!forConsultation && selectedOffers.map((offer, index) => (
              <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                <div className="  flex gap-2 items-center">
                  <div className=" w-[40%] grow shrink  ">
                    <Autocomplete
                      disablePortal
                      id="offers-options"
                      options={offers}
                      disabled={offerLoading}
                      getOptionLabel={(option) =>
                        `${option?.offer_name} (${option?.discount_price})`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Select Offer" />
                      )}
                      value={offer.id ? offer : null}
                      onChange={(e, value) => {
                        let temp = [...selectedOffers];

                        if (value === null || value === undefined) {
                          temp[index] = {
                            id: "",
                            offer_name: "",
                            offer_time: "",
                            actual_price: "",
                            discount_price: "",
                            staff: initialStaff.length > 0 ? initialStaff : [],
                          };
                        } else {
                          temp[index] = {
                            id: value.id,
                            offer_name: value.offer_name,
                            offer_time: value.offer_time,
                            actual_price: value.actual_price,
                            discount_price: value.discount_price,
                            staff:
                              temp[index]?.staff?.length > 0
                                ? temp[index].staff
                                : initialStaff.length > 0
                                  ? initialStaff
                                  : [],
                          };
                        }

                        setSelectedOffers(temp);
                      }}
                    />
                  </div>

                  <div className="w-1/4">
                    <FormControl
                      fullWidth
                      sx={{
                        backgroundColor: offer?.id ? "inherit" : "#f9f9f9",
                        cursor: offer?.id ? "auto" : "not-allowed",
                      }}
                    >
                      <InputLabel id={`staff-label-${index}`}>Staff</InputLabel>
                      <Select
                        labelId={`staff-label-${index}`}
                        id={`staff-select-${index}`}
                        value={offer.staff || []} // Use offer.staff instead of selectedStaff
                        multiple
                        disabled={!offer?.id}
                        label="Staff"
                        onChange={(e) => {
                          let temp = [...selectedOffers];
                          temp[index] = {
                            ...temp[index],
                            staff: e.target.value,
                          };
                          setSelectedOffers(temp);
                        }}
                        renderValue={(selected) =>
                          selected
                            .map((id) => {
                              const staffMember = staff.find(
                                (s) => s.id === id
                              );
                              return staffMember ? staffMember.staffname : "";
                            })
                            .join(", ")
                        }
                      >
                        {staff.map((staffMember) => (
                          <MenuItem
                            key={staffMember.id}
                            value={staffMember.id}
                            disabled={staffMember.is_busy}
                            style={{
                              color: staffMember.is_busy ? "#ccc" : "inherit",
                              opacity: staffMember.is_busy ? 0.7 : 1,
                            }}
                          >
                            <Checkbox
                              checked={
                                offer.staff?.includes(staffMember.id) || false
                              }
                            />{" "}
                            {/* Check against offer.staff */}
                            <ListItemText
                              primary={`${staffMember.staffname} (${staffMember.staff_role
                                }) - ${staffMember.is_busy ? "Busy" : "Free"}`}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className=" w-1/4">
                    <TextField
                      id={`actual-amount-${index}`}
                      label="Actual Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={offer.actual_price}
                      // onChange={(e) => setFinalAmount(e.target.value)}
                      readOnly
                      disabled
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                    />
                  </div>
                  <div className=" w-1/4">
                    <TextField
                      id={`final-amount-${index}`}
                      label="Final Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={offer.discount_price}
                      readOnly
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                      disabled
                    // onChange={(e) => setFinalAmount(e.target.value)}
                    />
                  </div>
                  <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                    {index == selectedOffers?.length - 1 ? (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                        onClick={() => {
                          setSelectedOffers([
                            ...selectedOffers,
                            {
                              id: "",
                              offer_name: "",
                              offer_time: "",
                              actual_price: "",
                              discount_price: "",
                              staff:
                                initialStaff.length > 0 ? initialStaff : [], // Initialize with staff
                            },
                          ]);
                        }}
                      >
                        <AddIcon className=" h-full w-full text-white !text-[40px]" />
                      </div>
                    ) : (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                        onClick={() => {
                          if (selectedOffers.length === 1) {
                            let temp = [...selectedOffers];
                            temp[index] = {
                              id: "",
                              offer_name: "",
                              offer_time: "",
                              actual_price: "",
                              discount_price: "",
                            };

                            setSelectedOffers(temp);

                            return;
                          }

                          let temp = [...selectedOffers];
                          temp.splice(index, 1);
                          setSelectedOffers(temp);
                        }}
                      >
                        <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                      </div>
                    )}
                  </div>
                </div>
                {offer?.id && (
                  <div className=" text-gray-500 text-[13px] pl-2">
                    Approx Time : {formateTime(offer?.offer_time)}
                  </div>
                )}
              </div>
            ))}

            {!forConsultation && (
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Package Details</h1>
              </div>
            )}
            {!forConsultation && selectedPackages.map((pkg, index) => (
              <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                <div className="  flex gap-2 items-center">
                  <div className=" w-[40%] grow shrink  ">
                    <Autocomplete
                      disablePortal
                      id="packages-options"
                      options={packages}
                      disabled={packageLoading}
                      getOptionLabel={(option) =>
                        `${option?.package_name}`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Select Package" />
                      )}
                      value={pkg.id ? pkg : null}
                      onChange={(e, value) => {
                        let temp = [...selectedPackages];

                        if (value === null || value === undefined) {
                          temp[index] = {
                            id: "",
                            package_name: "",
                            package_time: "",
                            actual_price: "",
                            discounted_price: "",
                            staff: initialStaff.length > 0 ? initialStaff : [],
                            additional_included_service: {},
                          };
                        } else {
                          temp[index] = {
                            ...value,
                            staff:
                              temp[index]?.staff?.length > 0
                                ? temp[index].staff
                                : initialStaff.length > 0
                                  ? initialStaff
                                  : [],
                          };
                        }

                        setSelectedPackages(temp);
                      }}
                    />
                  </div>

                  
                  <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                    {index == selectedPackages?.length - 1 ? (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                        onClick={() => {
                          setSelectedPackages([
                            ...selectedPackages,
                            {
                              id: "",
                              package_name: "",
                              package_time: "",
                              actual_price: "",
                              discounted_price: "",
                              staff:
                                initialStaff.length > 0 ? initialStaff : [], // Initialize with staff
                              additional_included_service: {},
                            },
                          ]);
                        }}
                      >
                        <AddIcon className=" h-full w-full text-white !text-[40px]" />
                      </div>
                    ) : (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                        onClick={() => {
                          if (selectedPackages.length === 1) {
                            let temp = [...selectedPackages];
                            temp[index] = {
                              id: "",
                              package_name: "",
                              package_time: "",
                              actual_price: "",
                              discounted_price: "",
                              additional_included_service: {},
                            };

                            setSelectedPackages(temp);

                            return;
                          }

                          let temp = [...selectedPackages];
                          temp.splice(index, 1);
                          setSelectedPackages(temp);
                        }}
                      >
                        <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {pkg?.id && pkg.additional_included_service && (
                  <div className="ml-4 mt-2 border-t pt-2">
                    <h3 className="font-semibold text-base mb-2">{pkg.package_name} Included Services:</h3>
                    {Object.entries(pkg.additional_included_service).map(([category, servs]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-medium text-sm mb-1">{category}</h4>
                        {servs.map((serv, sindex) => (
                          <div key={sindex} className="ml-4 mb-2 border-b pb-2">
                            <p className="text-sm font-medium">{serv.service_name}</p>
                            <p className="text-xs text-gray-600">Time: {formateTime(serv.time)}</p>
                            {serv.time.seating > 0 && (
                              <div className="mt-2 flex flex-col gap-2">
                                {Array.from({ length: serv.time.seating }).map((_, dindex) => (
                                  <LocalizationProvider dateAdapter={AdapterDayjs} key={dindex}>
                                    <DatePicker
                                      label={`Select Date ${dindex + 1} for ${serv.service_name} (${category})`}
                                      value={serv.seating_dates?.[dindex] ? dayjs(serv.seating_dates[dindex]) : null}
                                      onChange={(newValue) => handleDateChange(index, category, sindex, dindex, newValue)}
                                      format="YYYY-MM-DD"
                                      sx={{ width: "100%" }}
                                    />
                                  </LocalizationProvider>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {forConsultation && (
              <div className="col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">
                  Consultation Details
                </h1>
              </div>
            )}

            {forConsultation && (
              <div className="col-span-2 w-full">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id="consultation-remark"
                  label="Consultation Remark"
                  variant="outlined"
                  value={consultationRemark}
                  onChange={(e) => setConsultationRemark(e.target.value)}
                  placeholder="Enter consultation notes here..."
                />
              </div>
            )}

            {!forConsultation && (
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Amount Details</h1>
              </div>
            )}

            {!forConsultation && (
              <div className=" w-full ">
                <TextField
                  id="actual-amount"
                  label="Actual Amount (Without Tax)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            )}
            {!forConsultation && (
              <div className=" w-full ">
                <TextField
                  id="final-amount"
                  label="Final Amount (Without Tax)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
            )}
            
            {/* Tax Information Display */}
            {!forConsultation && vendorTaxData.tax_percent && (
              <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tax Applied:</span>
                  <span className="text-green-600 font-medium">{taxDisplayInfo.display}</span>
                </div>
                {actualAmount && parseFloat(actualAmount) > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Actual Amount with Tax:</span>
                    <span>₹{actualWithTaxDisplay.totalWithTax.toFixed(2)}</span>
                  </div>
                )}
                {finalAmount && parseFloat(finalAmount) > 0 && (
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Final Amount with Tax:</span>
                    <span>₹{finalWithTaxDisplay.totalWithTax.toFixed(2)}</span>
                  </div>
                )}
                {taxDisplayInfo.type === "percentage" && actualAmount && parseFloat(actualAmount) > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tax Calculation: {actualWithTaxDisplay.taxAmount.toFixed(2)} ({taxDisplayInfo.value}% of {actualAmount})
                  </div>
                )}
                {taxDisplayInfo.type === "fixed" && actualAmount && parseFloat(actualAmount) > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tax Calculation: {actualWithTaxDisplay.taxAmount.toFixed(2)} (Fixed ₹{taxDisplayInfo.value})
                  </div>
                )}
              </div>
            )}
           
          <div className=" col-span-2">
  <button
    className={`
      mx-auto block 
      ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} 
      text-white py-2 rounded-md px-6 w-fit min-w-[180px] 
      flex items-center justify-center gap-2
      transition-colors
    `}
    onClick={handleSubmit}
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <CircularProgress size={20} color="inherit" />
        <span>Booking...</span>
      </>
    ) : (
      "Book Appointment"
    )}
  </button>
</div>

            <div className=" col-span-2">
              <Link to={'/appointment/list-appointment/calender'}>
                <button
                  className=" mx-auto block bg-gray-500 text-white py-2 rounded-md px-4 w-fit mt-2"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </Link>
            </div>

          </div>
        </div>
        {!forConsultation && (
          <div className=" w-[340px] h-full flex flex-col gap-3 md:sticky md:top-[75px]">
            <div className=" w-full h-auto  bg-white rounded-md shadow-sm p-2">
              <div className=" font-semibold text-lg border-b border-gray-400">
                Offer Available
              </div>
              <div className=" h-auto max-h-60 flex gap-1 flex-col overflow-auto custom-scrollbar">
                {offerLoading ? (
                  <div className=" h-20 flex items-center justify-center">
                    <CircularProgress
                      sx={{
                        color: "#000",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                ) : offers?.length > 0 ? (
                  offers?.map((item, index) => (
                    <div key={index} className=" w-full flex gap-1 flex-col p-1">
                      <div className=" w-full text-sm font-semibold text-gray-900 line-clamp-1">
                        Offer Name : {item?.offer_name}
                      </div>
                      <div className=" w-full text-sm">
                        Offer price : {item?.discount_price}
                      </div>
                      <div className=" w-full text-sm ">
                        Actual price : {item?.actual_price}
                      </div>
                      <div className=" h-[1px] w-11/12 bg-gray-300 mx-auto"></div>
                    </div>
                  ))
                ) : (
                  <div className=" w-full h-20 flex items-center justify-center">
                    <h1 className=" text-lg font-bold">No Offers Found</h1>
                  </div>
                )}
              </div>
            </div>
            <div className=" w-full h-auto  bg-white rounded-md shadow-sm p-2">
              <div className=" font-semibold text-lg border-b border-gray-400">
                Package Available
              </div>
              <div className=" h-auto max-h-60 flex gap-1 flex-col overflow-auto custom-scrollbar">
                {packageLoading ? (
                  <div className=" h-20 flex items-center justify-center">
                    <CircularProgress
                      sx={{
                        color: "#000",
                        margin: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                ) : packages?.length > 0 ? (
                  packages?.map((item, index) => (
                    <div key={index} className=" w-full flex gap-1 flex-col p-1">
                      <div className=" w-full text-sm font-semibold text-gray-900 line-clamp-1">
                        Package Name : {item?.package_name}
                      </div>
                      <div className=" w-full text-sm">
                        Package price : {item?.discounted_price}
                      </div>
                      <div className=" w-full text-sm ">
                        Actual price : {item?.actual_price}
                      </div>
                      <div className=" h-[1px] w-11/12 bg-gray-300 mx-auto"></div>
                    </div>
                  ))
                ) : (
                  <div className=" w-full h-20 flex items-center justify-center">
                    <h1 className=" text-lg font-bold">No Packages Found</h1>
                  </div>
                )}
              </div>
            </div>
            <div className=" w-full h-auto  bg-white rounded-md shadow-sm p-2">
              <div className=" font-semibold text-lg border-b border-gray-400">
                Membership Available
              </div>
              <div>
                <div className="h-auto max-h-60 flex gap-1 flex-col overflow-auto custom-scrollbar">
                  {membershipData?.length > 0 ? (
                    membershipData.map((item, index) => (
                      <div
                        key={index}
                        className="w-full flex gap-1 p-1 items-center"
                      >
                        <div className="w-full text-sm font-medium text-gray-900 line-clamp-1">
                          {item?.membership_data?.name} - {item?.membership_code}
                        </div>
                        <div className="flex gap-1 items-center">
                          <button
                            className="border border-black px-3 py-[2px] rounded-md w-fit"
                            onClick={() => handleViewClick(item)}
                          >
                            View
                          </button>
                          <button
                            className={`bg-black text-white px-3 py-[2px] rounded-md w-fit ${item?.membership_code === membershipUsed
                                ? "italic"
                                : ""
                              }`}
                            onClick={() => handleApplyMembership(item)}
                          >
                            {item?.membership_code === membershipUsed
                              ? "Used"
                              : "Apply"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-20 flex items-center justify-center">
                      <h1 className="text-base font-normal">
                        No Membership Found
                      </h1>
                    </div>
                  )}
                </div>

                {/* Sidebar Component */}
                {showSidecard && selectedMembership && (
                  <div
                    className={`fixed right-0 top-16 w-100 h-[calc(100%-4rem)] bg-white shadow-lg border-l border-gray-300 transform transition-transform duration-300 ${showSidecard ? "translate-x-0" : "translate-x-full"
                      } z-50 rounded-lg overflow-auto`}
                  >
                    <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-t-lg">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Membership Details
                      </h2>
                      <button
                        onClick={toggleSidecard}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    <div className="p-6 pr-[80px] space-y-4">
                      <ul className="space-y-3">
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Membership Name:
                          </strong>{" "}
                          {selectedMembership?.membership_data.name}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Membership Code:
                          </strong>{" "}
                          {selectedMembership?.membership_code}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Customer Name:
                          </strong>{" "}
                          {selectedMembership?.customer_name}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Customer Phone:
                          </strong>{" "}
                          {selectedMembership?.customer_number}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Membership Price:
                          </strong>{" "}
                          ₹{selectedMembership?.membership_price}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">Amount Paid:</strong>{" "}
                          ₹{selectedMembership?.amount_paid}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">Branch Name:</strong>{" "}
                          {selectedMembership?.branch_name}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">Manager Name:</strong>{" "}
                          {selectedMembership?.manager_name}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Discount Percentage:
                          </strong>{" "}
                          {
                            selectedMembership?.membership_data
                              ?.discount_percentage
                          }
                          %
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">Validityy:</strong>{" "}
                          {selectedMembership?.membership_data?.validity_in_month}{" "}
                          Months
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Included Services:
                          </strong>
                          {selectedMembership?.whole_service
                            ? "All Services Included"
                            : selectedMembership?.membership_data?.service_data
                              .map((service) => service.service_name)
                              .join(", ")}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">Date Created:</strong>{" "}
                          {selectedMembership?.created_at}
                        </li>
                        <li className="text-gray-700">
                          <strong className="text-gray-900">
                            Terms and Conditions:
                          </strong>
                          <div
                            className="terms-and-conditions dangerous-html w-full"
                            dangerouslySetInnerHTML={{
                              __html: selectedMembership?.terms_and_conditions,
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <GeneralModal
        open={changeServiceMembershipModalOpen}
        handleClose={() => {
          setChangeServiceMembershipModalOpen(false);
          setChangeServiceMembershipModalData(null);
        }}
      >
        <div className=" p-5">
          <div className=" flex gap-1">
            <span className=" font-semibold">Service name : </span>
            <span>
              {changeServiceMembershipModalData?.service?.service_name} ({" "}
              {changeServiceMembershipModalData?.service?.gender} )
            </span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Price : </span>
            <span>{changeServiceMembershipModalData?.service?.price}</span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Discount : </span>
            <span>{changeServiceMembershipModalData?.service?.discount}</span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Time : </span>
            <span>
              {formateTime(
                changeServiceMembershipModalData?.service?.service_time
              )}
            </span>
          </div>
          <hr />
          {/* dropdown of yes / no */}
          {changeServiceMembershipModalData?.service?.id ==
            services[changeServiceMembershipModalData?.index]?.id && (
              <div className=" w-full mt-10">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Membership Applied
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Membership Applied"
                    value={
                      services[changeServiceMembershipModalData?.index]
                        ?.from_membership
                    }
                    onChange={(e) => {
                      let temp = [...services];
                      temp[changeServiceMembershipModalData?.index] = {
                        ...temp[changeServiceMembershipModalData?.index],
                        from_membership: e.target.value,
                      };
                      setServices(temp);
                      handlePriceChange();
                    }}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
        </div>
      </GeneralModal>
    </div>
  );
};

export default AppointmentForm;