import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../Context/Auth";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Modal,
  Box,
  TextareaAutosize,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Divider,
  Tooltip,
  InputAdornment,
  Alert,
  Chip,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info"; // Add InfoIcon import
import LoyaltyIcon from "@mui/icons-material/Loyalty"; // Add LoyaltyIcon import
import whatsapp_image from "../../assets/whatsapp_logo.png";
import axios from "axios";

const steps = [
  "Customer Details",
  "Service Details",
  "Product Consumption",
  "Purchase Product",
  "Checkout",
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Checkout = ({
  appointment,
  handleToastmessage,
  closeDrawer,
  setAppointmentData,
  isNewAppointment = false, // Add this prop
  onCreateAppointment, // Add this prop for creating new appointments
}) => {
  const { authTokens, vendorData, user } = useContext(AuthContext);
  const [createdAppointmentId, setCreatedAppointmentId] = useState(null);
  const [createdSaleId, setCreatedSaleId] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [membershipUsed, setMembershipUsed] = useState("N/A");

  const [otp, setOtp] = useState("");
  const [membershipData, setMembershipData] = useState([]);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(
    appointment?.due_amount || 0,
  );
  const [dueAmount, setDueAmount] = useState(appointment?.due_amount || 0);
  const [creditAmount, setCreditAmount] = useState(
    appointment?.credit_amount || 0,
  );
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [managerData, setManagerData] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [openMembershipModal, setOpenMembershipModal] = useState(false);
  const [selectedMembershipDetails, setSelectedMembershipDetails] =
    useState(null);
  const [hasMembership, setHasMembership] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(
    appointment?.customer_phone,
  );
  const [customerType, setCustomerType] = useState(appointment?.customer_type);
  const [customerEmail, setCustomerEmail] = useState(
    appointment?.customer_email,
  );
  const [totalFinalAmount, setTotalFinalAmount] = useState(
    appointment?.final_amount,
  );
  const [amountPaid, setAmountPaid] = useState(appointment?.amount_paid);
  const [paymentStatus, setPaymentStatus] = useState(
    appointment?.payment_status,
  );
  const [paymentMode, setPaymentMode] = useState(appointment?.payment_mode);

  const [page, setPage] = useState(1);
  const [activeStep, setActiveStep] = useState("Customer Details");
  const [InUseProductData, setInUseProductData] = useState([]);
  const [productConsumption, setProductConsumption] = useState([
    {
      id: "",
      name: "",
      per_use_consumption: "",
      remaining_quantity: "",
      measure_unit: "",
      total_use_times: "",
      product_name: "",
    },
  ]);

  // Add these state variables near your other state declarations
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  const [appointmentTime, setAppointmentTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`; // Format: HH:MM
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/vendor/${user.user_id}/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const jsonData = await response.json();

        // Set payment methods from API response
        if (
          jsonData.central_payment_method &&
          Array.isArray(jsonData.central_payment_method)
        ) {
          setPaymentMethods(jsonData.central_payment_method);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    if (user?.user_id) {
      fetchPaymentMethods();
    }
  }, [user?.user_id]);

  // Add these state variables at the top of your component
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [staffContributions, setStaffContributions] = useState({});
  const [staffContributionErrors, setStaffContributionErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [invoicePage, setInvoicePage] = useState(false);
  const [searchProductTerm, setSearchProductTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editProductData, setEditProductData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  // const [createdSaleId, setCreatedSaleId] = useState(null);
  const [offerStaffContributions, setOfferStaffContributions] = useState({});
  // const [taxEnabled, setTaxEnabled] = useState(false);
  // const [taxType, setTaxType] = useState("percentage");
  // const [taxValue, setTaxValue] = useState(0);
  // const [taxAmount, setTaxAmount] = useState(0);
  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);

  const [splitPaymentMode, setSplitPaymentMode] = useState(false);
  const [splitPaymentDetails, setSplitPaymentDetails] = useState([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //

  // New state variables for detailed breakdown
  const [appointmentDiscountPercentage, setAppointmentDiscountPercentage] =
    useState(0);
  const [appointmentTaxPercentage, setAppointmentTaxPercentage] = useState(0);
  const [productDiscountPercentage, setProductDiscountPercentage] = useState(0);
  const [productTaxPercentage, setProductTaxPercentage] = useState(0);

  // Calculated amounts

  // Add these state variables to your component
  // Tax states - automatically set from vendor data
  const [appointmentTaxType, setAppointmentTaxType] = useState("percentage");
  const [appointmentTaxValue, setAppointmentTaxValue] = useState(0);
  const [productTaxType, setProductTaxType] = useState("percentage");
  const [productTaxValue, setProductTaxValue] = useState(0);

  // Discount states (user input)
  const [appointmentDiscountType, setAppointmentDiscountType] =
    useState("percentage");
  const [appointmentDiscountValue, setAppointmentDiscountValue] = useState(0);
  const [productDiscountType, setProductDiscountType] = useState("percentage");
  const [productDiscountValue, setProductDiscountValue] = useState(0);

  // Calculated amounts
  const [appointmentDiscountAmount, setAppointmentDiscountAmount] = useState(0);
  const [appointmentTaxAmount, setAppointmentTaxAmount] = useState(0);
  const [productDiscountAmount, setProductDiscountAmount] = useState(0);
  const [productTaxAmount, setProductTaxAmount] = useState(0);

  // Final calculated amounts
  const [
    finalTotalAppointmentAmountAfterDiscount,
    setFinalTotalAppointmentAmountAfterDiscount,
  ] = useState(0);
  const [
    finalTotalProductSellAmountAfterDiscount,
    setFinalTotalProductSellAmountAfterDiscount,
  ] = useState(0);
  const [
    finalTotalAppointmentAmountAfterTaxDiscount,
    setFinalTotalAppointmentAmountAfterTaxDiscount,
  ] = useState(0);
  const [
    finalTotalProductSellAmountAfterDiscountTax,
    setFinalTotalProductSellAmountAfterDiscountTax,
  ] = useState(0);
  // Get tax settings from vendorData
  const taxEnabled = vendorData?.is_gst || false;
  const taxType = vendorData?.tax_percent
    ? "percentage"
    : vendorData?.tax_amount
    ? "amount"
    : "percentage";
  const taxValue = vendorData?.tax_percent || vendorData?.tax_amount || 0;

  const [discountType, setDiscountType] = useState("percentage"); // "percentage" or "amount"
  const [discountValue, setDiscountValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [productFormData, setProductFormData] = useState({
    product_list: [],
    customerName: appointment?.customer_name || "",
    customerNumber: appointment?.customer_phone || "",
    final_total: 0,
  });

  const [wallets, setWallets] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(
    appointment?.customer_wallet || null,
  );
  const [walletDetails, setWalletDetails] = useState(null);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [isWalletApplied, setIstWalletApplied] = useState(
    appointment?.is_wallet_applied || false,
  );

  useEffect(() => {
    if (appointment?.split_payment_mode) {
      try {
        const splitData = appointment.split_payment_mode;
        if (
          typeof splitData === "object" &&
          Object.keys(splitData).length > 0
        ) {
          setSplitPaymentMode(true);
          const modes = Object.keys(splitData);
          setSelectedPaymentModes(modes);
          const details = modes.map((mode) => ({
            mode: mode,
            amount: parseFloat(splitData[mode]) || 0,
          }));
          setSplitPaymentDetails(details);
        }
      } catch (error) {
        console.error("Error parsing split payment data:", error);
      }
    }
  }, [appointment]);

  const fetchWallets = async (phoneNumber) => {
    if (!phoneNumber) return;

    setWalletLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/wallets/?customer_phone=${phoneNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      } else {
        setWallets([]);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
      setWallets([]);
    } finally {
      setWalletLoading(false);
    }
  };

  const updateWalletBalance = async (walletId, newBalance) => {
    try {
      // Convert to integer to avoid the validation error
      const integerBalance = Math.round(parseFloat(newBalance));

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/wallets/${walletId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            remaining_price_benefits: integerBalance,
          }),
        },
      );

      if (response.ok) {
        console.log("Wallet balance updated successfully");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Failed to update wallet balance:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      return false;
    }
  };

  useEffect(() => {
    if (appointment?.customer_wallet) {
      setSelectedWallet(appointment.customer_wallet);
      setIstWalletApplied(appointment.is_wallet_applied);
    }
  }, [appointment]);

  useEffect(() => {
    if (customerPhone) {
      fetchWallets(customerPhone);
    }
  }, [customerPhone]);

  const [customerGender, setCustomerGender] = useState(
    appointment?.customer_gender || "Male",
  );
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

  const fetchCustomerDetails = async (phoneNumber) => {
    if (phoneNumber.length !== 10) return;

    setIsFetchingCustomer(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/customer-table/?customer_phone=${phoneNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const customer = data.results[0];
          setCustomerName(customer.customer_name);
          setCustomerGender(customer.customer_gender);
          setCustomerType(customer.customer_type);
          if (customer.customer_email) {
            setCustomerEmail(customer.customer_email);
          }

          toast.success("Customer details auto-filled", "success");
        } else {
          // Reset fields if no customer found
          setCustomerName("");
          setCustomerGender("Male");
          setCustomerType("new");
          toast.info("No existing customer found with this number", "info");
        }
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Error fetching customer details", "error");
    } finally {
      setIsFetchingCustomer(false);
    }
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (input.length <= 10) {
      setCustomerPhone(input);

      // Fetch customer details when phone number is exactly 10 digits
      if (input.length === 10) {
        fetchCustomerDetails(input);
      } else if (input.length < 10) {
        // Reset customer details if phone number is incomplete
        setCustomerName("");
        setCustomerGender("Male");
        // setCustomerType("new");
      }
    }
  };

  const handleBlur = () => {
    if (customerPhone.length !== 10) {
      toast.error("Please enter exactly 10 digits for the phone number");
    }
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/staff/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          // ✅ Filter only staff where is_present is true
          const presentStaff = data.filter(
            (staff) => staff.is_present === true,
          );
          setStaffList(presentStaff);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [authTokens]);

  useEffect(() => {
    if (createdAppointment) {
      setProductFormData((prev) => ({
        ...prev,
        customerName: createdAppointment.customer_name,
        customerNumber: createdAppointment.customer_phone,
      }));
    }
  }, [createdAppointment]);

  useEffect(() => {
    // fetchStaff();
    fetchManagers();
  }, []);

  useEffect(() => {
    if (customerPhone) {
      getMembershipData(customerPhone);
    } else {
      // Reset membership data if no phone number
      setMembershipData([]);
      setHasMembership(false);
      setMembershipUsed("N/A");
    }
  }, [customerPhone]);

  const handleOpenMembershipModal = () => {
    if (membershipUsed !== "N/A") {
      const selectedMembership = membershipData.find(
        (membership) => membership.membership_code === membershipUsed,
      );
      setSelectedMembershipDetails(selectedMembership);
      setOpenMembershipModal(true);
    }
  };

  // useEffect(() => {
  //   if (appointment?.staff_contributions) {
  //     const contributions = {};

  //     appointment.staff_contributions.forEach(contribution => {
  //       contributions[contribution.service_id] = contribution.staff_distribution;
  //     });

  //     setStaffContributions(contributions);
  //   }
  // }, [appointment]);

  useEffect(() => {
    if (appointment?.staff_contributions) {
      const serviceContributions = {};
      const offerContributions = {};

      appointment.staff_contributions.forEach((contribution) => {
        if (contribution.service_id) {
          serviceContributions[contribution.service_id] =
            contribution.staff_distribution;
        } else if (contribution.offer_id) {
          offerContributions[contribution.offer_id] =
            contribution.staff_distribution;
        }
      });

      setStaffContributions(serviceContributions);
      setOfferStaffContributions(offerContributions);
    }
  }, [appointment]);

  const validateStaffContributions = (id, contributions, isOffer = false) => {
    const totalPercentage = contributions.reduce(
      (sum, contrib) => sum + contrib.percent,
      0,
    );
    return totalPercentage === 100;
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/manager/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        // ❌ jisme leave_date hai, use remove kar do
        const activeManagers = data.filter((manager) => !manager.leave_date);

        setManagerData(activeManagers);
      } else {
        toast.error("An error occured :" + response.statusText);
      }
    } catch (error) {
      toast.error("An error occured");
    }
  };

  const handleStaffPercentageChange = (serviceId, staffId, newValue) => {
    setStaffContributions((prev) => {
      const updatedContributions = { ...prev };

      if (!updatedContributions[serviceId]) {
        // Initialize if not exists
        updatedContributions[serviceId] = [];
      }

      const existingIndex = updatedContributions[serviceId].findIndex(
        (contrib) => contrib.staff_id === staffId,
      );

      if (existingIndex >= 0) {
        updatedContributions[serviceId][existingIndex].percent = newValue;
      } else {
        // Add new contribution if staff is assigned but not in contributions
        const staffMember = staffList.find((s) => s.id === staffId);
        updatedContributions[serviceId].push({
          staff_id: staffId,
          staff_name: staffMember?.staffname || `Staff #${staffId}`,
          staff_role: staffMember?.staff_role || "Unknown",
          percent: newValue,
        });
      }

      const isValid = validateStaffContributions(
        serviceId,
        updatedContributions[serviceId],
      );

      setStaffContributionErrors((prev) => ({
        ...prev,
        [serviceId]: !isValid,
      }));

      return updatedContributions;
    });
  };

  const [actualAmount, setActualAmount] = useState(0);
  const [combinedDiscountPercentage, setCombinedDiscountPercentage] =
    useState(0);
  const [combinedDiscountAmount, setCombinedDiscountAmount] = useState(0);
  const [combinedTaxPercentage, setCombinedTaxPercentage] = useState(0);
  const [combinedTaxAmount, setCombinedTaxAmount] = useState(0);

  const handleOfferStaffPercentageChange = (offerId, staffId, percentage) => {
    setOfferStaffContributions((prev) => {
      const newContributions = { ...prev };
      const staff = staffList.find((s) => s.id === staffId);

      if (!newContributions[offerId]) {
        newContributions[offerId] = [];
      }

      const existingIndex = newContributions[offerId].findIndex(
        (item) => item.staff_id === staffId,
      );

      if (existingIndex >= 0) {
        newContributions[offerId][existingIndex].percent =
          percentage === "" ? "" : parseFloat(percentage);
      } else if (percentage !== "" && percentage !== 0) {
        newContributions[offerId].push({
          staff_id: staffId,
          staff_name: staff?.staffname || `Staff #${staffId}`,
          staff_role: staff?.role || "Unknown",
          percent: parseFloat(percentage),
        });
      }

      const isValid = validateStaffContributions(
        offerId,
        newContributions[offerId],
        true,
      );

      setStaffContributionErrors((prev) => ({
        ...prev,
        [`offer_${offerId}`]: !isValid,
      }));

      return newContributions;
    });
  };

  const getStaffName = (staffId) => {
    const staff = staffList.find((s) => s.id === staffId);
    return staff ? staff.staffname : `Staff #${staffId}`;
  };

  const getTotalPercentage = (id, isOffer = false) => {
    const contributions = isOffer
      ? offerStaffContributions[id]
      : staffContributions[id];

    console.log("contributions", contributions);

    if (!Array.isArray(contributions) || contributions.length === 0) return 0;

    // ✅ If only one staff, auto-fill total as 100%
    if (contributions.length === 1) {
      console.log("Single staff detected — auto total 100%");
      return 100;
    }

    // ✅ Otherwise, calculate normally from percent values
    const total = contributions.reduce((sum, contrib) => {
      const percent =
        contrib && contrib.percent !== undefined && contrib.percent !== null
          ? parseFloat(contrib.percent)
          : 0;

      console.log("percent", percent);
      return sum + (isNaN(percent) ? 0 : percent);
    }, 0);

    console.log("total", total);

    // ✅ Round to 2 decimals for neat display
    return Math.round(total * 100) / 100;
  };

  useEffect(() => {
    if (
      appointment?.product_details &&
      appointment.product_details.length > 0
    ) {
      const previousProducts = appointment.product_details.map((item) => ({
        id: item.id,
        name: item.name,
        per_use_consumption: item.per_use_consumption,
        remaining_quantity: item.remaining_quantity,
        measure_unit: item.measure_unit,
        total_use_times: item.total_use_times || 1,
      }));

      setProductConsumption(previousProducts);
    }
  }, [appointment]);

  const downloadInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate-invoice/${appointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Set the filename for the download
        a.download = `invoice_${appointment.id}.pdf`;

        // Add the anchor to the DOM and trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("Invoice downloaded successfully", "success");
      } else {
        toast.error("Failed to generate invoice", "error");
      }
    } catch (error) {
      toast.error("Error generating invoice", "error");
      console.error("Error generating invoice:", error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const sendWhatsAppInvoice = async () => {
    setIsGeneratingInvoice(true);

    try {
      // Step 1: Generate the invoice first
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate-invoice-details/${createdAppointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        },
      );

      if (!invoiceResponse.ok) {
        throw new Error("Failed to generate invoice");
      }

      const invoiceData = await invoiceResponse.json();

      // Step 2: Prepare WhatsApp payload with ALL required fields
      const whatsappPayload = {
        phone_numbers: [`91${createdAppointment.customer_phone}`], // e.g., 918000052438
        appointment_id: createdAppointment.id, // This was MISSING before!
        filename: `invoice_${createdAppointment.id}`,
        file_url: invoiceData.invoice_url,
        body_values: [
          createdAppointment.customer_name || "Customer",
          "Appointment",
          vendorData?.salon_name || "Salon",
          vendorData?.salon_name || "Salon",
        ],
      };

      // Step 3: Send invoice via WhatsApp
      const whatsappResponse = await fetch(
        "https://backendapi.trakky.in/salonvendor/send-invoice-whatsapp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(whatsappPayload),
        },
      );

      if (whatsappResponse.ok) {
        const result = await whatsappResponse.json();
        toast.success("Invoice sent successfully via WhatsApp!");
        setOpenModal(false);
      } else {
        const errorData = await whatsappResponse.json().catch(() => ({}));
        console.error("WhatsApp API Error:", errorData);
        throw new Error(
          errorData.error || "Failed to send invoice via WhatsApp",
        );
      }
    } catch (error) {
      console.error("Error sending invoice via WhatsApp:", error);
      toast.error(
        error.message ||
          "Error sending invoice via WhatsApp. Please try again.",
      );
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/selling-inventory/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error("Error fetching products");
      }
    } catch (error) {
      toast.error("Error fetching products");
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (activeStep === "Purchase Product") {
      fetchProducts();
    }
  }, [activeStep]);

  const filteredProducts = products.filter(
    (item) =>
      item.product_details?.product_name
        ?.toLowerCase()
        .includes(searchProductTerm.toLowerCase()) ||
      item.product_details?.brand_name
        ?.toLowerCase()
        .includes(searchProductTerm.toLowerCase()) ||
      item.product_details?.product_indentification_number
        ?.toLowerCase()
        .includes(searchProductTerm.toLowerCase()),
  );

  // Calculate product totals
  useEffect(() => {
    const productTotal = productFormData.product_list.reduce(
      (total, product) => total + (product.net_sub_total || 0),
      0,
    );

    setProductFormData((prev) => ({
      ...prev,
      final_total: productTotal,
    }));
  }, [productFormData.product_list]);

  // Handle product edit
  const handleProductEdit = (updatedProduct) => {
    const updatedList = productFormData.product_list.map((product) =>
      product.product_id === updatedProduct.product_id
        ? updatedProduct
        : product,
    );

    setProductFormData((prev) => ({
      ...prev,
      product_list: updatedList,
    }));
    setOpenEditModal(false);
  };

  // Calculate combined total (appointment + products)
  const productTotal = appointment?.selled_product_details
    ? parseFloat(appointment.selled_product_details.final_total)
    : productFormData.final_total || 0;

  const combinedTotal = (parseFloat(totalFinalAmount) || 0) + productTotal;

  const UseInvertoryListData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/currentuse/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const responseData = await response.json();

        let formatedResponse = responseData.map((item) => {
          return {
            id: item.id,
            use_inventory_details: item.use_inventory_details,
            per_use_consumption: item.per_use_consumption,
            remaining_quantity: item.remaining_quantity,
            measure_unit: item.measure_unit,
            total_use_times: 1,
            name: item.use_inventory_details.product_details.product_name,
          };
        });
        setInUseProductData(formatedResponse);
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error(error);
    }
  };

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

  const getMembershipData = async (ph_no) => {
    let url = `https://backendapi.trakky.in/salonvendor/customer-memberships/`;

    if (ph_no) {
      url += `?customer_number=${ph_no}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMembershipData(data);
        setHasMembership(data.length > 0);

        if (appointment?.membership?.length > 0) {
          let memb = data?.filter(
            (membership) => membership.id === appointment?.membership?.[0],
          );

          if (memb?.length > 0) {
            setMembershipUsed(memb[0]?.membership_code);
          }
        }
      } else {
        toast.error("An error occured :" + response.statusText);
      }
    } catch (error) {
      toast.error("An error occured");
    }
  };

  const fetchServices = async (page) => {
    setServiceLoading(true);

    if (!vendorData?.salon) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service/?page=${page}&salon_id=${vendorData?.salon}`,
        {},
      );
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          let reducedData = await data?.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_name,
              service_time: service?.service_time,
              gender: service?.gender,
              discount: service?.discount,
              price: service?.price,
            };
          });
          setTempAllServices(reducedData);
        } else {
          let reducedData = await data?.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_name,
              service_time: service?.service_time,
              gender: service?.gender,
              discount: service?.discount,
              price: service?.price,
            };
          });
          setTempAllServices([...tempAllServices, ...reducedData]);
        }

        if (data?.next) {
          setPage(page + 1);
        }
      } else {
        toast.error(
          `something went wrong while fetching service : ${response.statusText}`,
        );
      }
    } catch (error) {
      toast.error(
        `something went wrong while fetching service : ${error.message}`,
      );
    } finally {
      setServiceLoading(false);
    }
  };
  // Add this useEffect to properly initialize amounts
  useEffect(() => {
    const total =
      parseFloat(
        finalTotalAppointmentAmountAfterTaxDiscount +
          finalTotalProductSellAmountAfterDiscountTax,
      ) || 0;
    const paid = parseFloat(amountPaid) || 0;

    // Calculate due amount (total - paid)
    const due = Math.max(0, total - paid);
    setDueAmount(Math.round(due * 100) / 100);

    // Calculate credit amount (paid - total, but only if positive)
    const credit = Math.max(0, paid - total);
    setCreditAmount(Math.round(credit * 100) / 100);

    setRemainingAmount(Math.round(due * 100) / 100);
  }, [
    finalTotalAppointmentAmountAfterTaxDiscount,
    finalTotalProductSellAmountAfterDiscountTax,
    amountPaid,
  ]);

  const fetchOffers = async () => {
    setOfferLoading(true);

    if (!vendorData?.salon) return;

    let url = `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_id=${vendorData?.salon}`;

    try {
      const response = await fetch(url, {
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
            name: offer?.name,
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

  useEffect(() => {
    if (appointment?.included_services?.length > 0) {
      let appointmentServices = appointment.included_services.map((service) => {
        return {
          id: service.service_id,
          service_name: service.service_name,
          service_time: service.duration,
          gender: service?.gender,
          discount: service.final_price,
          price: service.actual_price,
          from_membership: service.from_membership,
          membership_id: service.membership_id,
        };
      });

      setServices(appointmentServices);
    } else {
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
        },
      ]);
    }

    if (appointment?.included_offers?.length > 0) {
      const appointmentOffers = appointment.included_offers.map((offer) => {
        return {
          id: offer.offer_id,
          offer_name: offer.offer_name,
          offer_time: offer.offer_time,
          actual_price: offer.actual_price,
          discount_price: offer.discounted_price,
        };
      });

      setSelectedOffers(appointmentOffers);
    } else {
      setSelectedOffers([
        {
          id: "",
          offer_name: "",
          offer_time: "",
          actual_price: "",
          discount_price: "",
        },
      ]);
    }

    getMembershipData(appointment?.customer_phone);
  }, [appointment]);

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchServices(page);
    fetchOffers();
    UseInvertoryListData();
  }, [vendorData]);

  useEffect(() => {
    let actual_amount = 0;
    let final_amount = 0;

    services.forEach((service) => {
      actual_amount = parseInt(actual_amount) + service.price;
      final_amount = parseInt(final_amount) + service.discount;
    });

    selectedOffers.forEach((offer) => {
      actual_amount = parseInt(actual_amount) + offer.actual_price;
      final_amount = parseInt(final_amount) + offer.discount_price;
    });

    setTotalFinalAmount(final_amount);
  }, [selectedOffers, services]);

  useEffect(() => {
    if (services?.length > 0) {
      const membershipFilter = membershipData?.find(
        (membership) => membership.membership_code === membershipUsed,
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
          }),
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
            })),
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
          }),
        );
      }
    }
  }, [membershipUsed]);

  // Calculate discount amount
  useEffect(() => {
    if (discountValue > 0) {
      let calculatedDiscount = 0;

      if (discountType === "percentage") {
        calculatedDiscount = (combinedTotal * discountValue) / 100;
      } else {
        calculatedDiscount = Math.min(discountValue, combinedTotal);
      }

      setDiscountAmount(calculatedDiscount);
    } else {
      setDiscountAmount(0);
    }
  }, [discountValue, discountType, combinedTotal]);

  // Initialize discount from appointment data
  useEffect(() => {
    if (appointment?.discount_percentage || appointment?.discount_amount) {
      if (appointment.discount_percentage > 0) {
        setDiscountType("percentage");
        setDiscountValue(parseFloat(appointment.discount_percentage));
      } else if (appointment.discount_amount > 0) {
        setDiscountType("amount");
        setDiscountValue(parseFloat(appointment.discount_amount));
      }
    }
  }, [appointment]);

  const finalAmountAfterDiscount = parseFloat(
    Math.max(0, combinedTotal - discountAmount),
  ).toFixed(2);

  useEffect(() => {
    if (taxEnabled) {
      let calculatedTax = 0;

      if (vendorData?.tax_percent) {
        calculatedTax =
          (Number(finalAmountAfterDiscount) * Number(vendorData.tax_percent)) /
          100;
      } else if (vendorData?.tax_amount) {
        calculatedTax = parseFloat(vendorData.tax_amount) || 0;
      }

      setCalculatedTaxAmount(calculatedTax);
    } else {
      setCalculatedTaxAmount(0);
    }
  }, [taxEnabled, vendorData, finalAmountAfterDiscount]);

  const finalAmountWithTax = parseFloat(
    Number(finalAmountAfterDiscount) + Number(calculatedTaxAmount),
  ).toFixed(2);

  console.log("amount_tax", finalAmountWithTax);

  useEffect(() => {
    // If we have existing due/credit amounts from the API, use them
    if (
      appointment?.due_amount !== null ||
      appointment?.credit_amount !== null
    ) {
      setDueAmount(appointment?.due_amount || 0);
      setCreditAmount(appointment?.credit_amount || 0);
      setRemainingAmount(appointment?.due_amount || 0);
    } else {
      // Otherwise calculate based on current amounts - use combinedTotal
      const paid = parseFloat(amountPaid) || 0;
      const total = parseFloat(finalAmountWithTax) || 0;

      // Calculate remaining amount (total - paid)
      const remaining = Math.max(0, total - paid);
      setRemainingAmount(remaining);

      // Due amount is the same as remaining amount when payment status is partial or unpaid
      setDueAmount(remaining);

      // Calculate credit amount (paid - total, but only if positive)
      const credit = Math.max(0, paid - total);
      setCreditAmount(credit);

      // Update payment status based on amounts
      if (paid >= total) {
        setPaymentStatus("paid");
      } else if (paid > 0 && paid < total) {
        setPaymentStatus("partial");
      } else if (paid === 0 && total > 0) {
        setPaymentStatus("unpaid");
      }
    }
  }, [
    amountPaid,
    finalAmountWithTax,
    appointment?.due_amount,
    appointment?.credit_amount,
  ]);

  const handleSubmitStep3 = async () => {
    // Set submitting state to true at the start
    setIsSubmitting(true);

    try {
      // Calculate wallet amount from split payments or single payment
      let walletAmount = 0;
      if (isWalletApplied && selectedWallet) {
        if (splitPaymentMode) {
          // Get wallet amount from split payment details
          const walletDetail = splitPaymentDetails.find(
            (d) => d.mode === "wallet",
          );
          walletAmount = walletDetail ? walletDetail.amount : 0;
        } else if (paymentMode === "wallet") {
          // Get wallet amount from single payment
          walletAmount = parseFloat(amountPaid) || 0;
        }
      }

      // Update wallet balance if wallet is applied and amount > 0
      if (isWalletApplied && selectedWallet && walletAmount > 0) {
        const selectedWalletData = wallets.find((w) => w.id === selectedWallet);
        if (selectedWalletData) {
          const currentBalance = parseFloat(
            selectedWalletData.remaining_price_benefits,
          );

          if (walletAmount > currentBalance) {
            toast.error("Insufficient wallet balance", "error");
            setIsSubmitting(false);
            return;
          }

          // Convert to integer to match API requirements
          const newBalance = Math.round(currentBalance - walletAmount);
          setIsUpdatingWallet(true);
          const walletUpdated = await updateWalletBalance(
            selectedWallet,
            newBalance,
          );

          if (!walletUpdated) {
            toast.error("Failed to update wallet balance", "error");
            setIsSubmitting(false);
            setIsUpdatingWallet(false);
            return;
          }
          setIsUpdatingWallet(false);
        }
      }

      // Prepare data for steps 1-3
      let SO = selectedOffers.filter((offer) => offer.id !== "");
      let SS = services.filter((service) => service.id !== "");

      // Format staff contributions (only for services at this point)
      const formattedStaffContributions = Object.keys(staffContributions).map(
        (serviceId) => ({
          service_id: parseInt(serviceId),
          service_name:
            services.find((s) => s.id === parseInt(serviceId))?.service_name ||
            "",
          staff_distribution: staffContributions[serviceId].map((contrib) => ({
            staff_id: contrib.staff_id,
            staff_name: contrib.staff_name,
            staff_role: contrib.staff_role,
            percent: contrib.percent,
          })),
        }),
      );

      const formattedOfferContributions = Object.keys(
        offerStaffContributions,
      ).map((offerId) => ({
        offer_id: parseInt(offerId),
        offer_name:
          selectedOffers.find((o) => o.id === parseInt(offerId))?.offer_name ||
          "",
        staff_distribution: offerStaffContributions[offerId].map((contrib) => ({
          staff_id: contrib.staff_id,
          staff_name: contrib.staff_name,
          staff_role: contrib.staff_role,
          percent: contrib.percent,
        })),
      }));

      // Combine both service and offer contributions
      const allStaffContributions = [
        ...formattedStaffContributions,
        ...formattedOfferContributions,
      ];

      // Format time for backend (ensure HH:MM:SS format)
      let formattedTime = appointmentTime;
      if (!formattedTime.includes(":")) {
        formattedTime = "00:00";
      }
      if (formattedTime.split(":").length === 2) {
        formattedTime = `${formattedTime}:00`;
      }

      // Build payload for steps 1-3
      const payload = {
        date: appointmentDate, // Use selected date
        time_in: formattedTime, // Use selected time
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_gender: customerGender || "Male", // Use the customerGender state
        manager: selectedManager,
        customer_type: customerType,
        included_services: SS.map((service) => ({
          service_id: service.id,
          service_name: service.service_name,
          actual_price: service.price,
          final_price: service.discount,
          from_membership: service.from_membership,
          membership_id: service.membership_id,
          duration: service.service_time,
          gender: service.gender,
        })),
        included_offers: SO.map((offer) => ({
          offer_id: offer.id,
          actual_price: offer.actual_price,
          discounted_price: offer.discount_price,
          offer_time: offer.offer_time,
          offer_name: offer.offer_name || offer.name,
        })),
        staff_contributions: allStaffContributions,
        product_details: productConsumption
          .filter((product) => product.id && product.id !== "")
          .map((product) => ({
            id: product.id,
            name: product.name,
            per_use_consumption: product.per_use_consumption,
            remaining_quantity: product.remaining_quantity,
            measure_unit: product.measure_unit,
            total_use_times: product.total_use_times || 1,
            staff_id: product.staff_id || null,
            staff_name: product.staff_name || null,
          })),
        product_consumption: productConsumption
          .filter((product) => product.id && product.id !== "")
          .map((product) => product.id),
        product_consume: false,
        appointment_status: "completed",
        checkout: false,
        amount_paid: 0,
        customer_wallet: selectedWallet || null,
        is_wallet_applied: isWalletApplied,
        membership: [],
        // Add the new field as per your API requirement
        product_sold_by_staff: productConsumption
          .filter(
            (product) => product.id && product.id !== "" && product.staff_id,
          )
          .reduce((acc, product) => {
            acc[product.name] = {
              staff: {
                staffname:
                  product.staff_name || product.staffname || "Unknown Staff",
              },
            };
            return acc;
          }, {}),
      };

      // Add membership if used
      if (membershipUsed !== "N/A") {
        const membershipfilter = membershipData?.filter(
          (item) => item?.membership_code === membershipUsed,
        );
        if (membershipfilter?.length > 0) {
          payload.membership = [membershipfilter[0]?.id];
        }
      } else {
        payload.membership = [];
      }

      // Make API call to create appointment
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/appointments-new/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Appointment Created Successfully", "success");
        setCreatedAppointmentId(data.id);
        setCreatedAppointment(data); // Store the full appointment data
        setAppointmentData(data);
        return data;
      } else {
        toast.error(
          `Error creating appointment: ${response.statusText}`,
          "error",
        );
        return null;
      }
    } catch (error) {
      toast.error("Error creating appointment", "error");
      console.error("Error creating appointment:", error);
      return null;
    } finally {
      // Reset all loading states
      setIsSubmitting(false);
      setIsUpdatingWallet(false);
    }
  };
  const handleSellProduct = async () => {
    if (!createdAppointment) {
      toast.error("Please create appointment first", "error");
      return null;
    }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/sells/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            ...productFormData,
            customer_id: createdAppointment.customer_id, // Use customer_id from created appointment
            customer_name: customerName,
            customer_phone: customerPhone,
            appointment_id: createdAppointment.id, // Use id from created appointment
          }),
        },
      );

      if (response.ok) {
        const saleData = await response.json();
        setCreatedSaleId(saleData.id);
        toast.success("Products sold successfully", "success");
        return saleData.id;
      } else {
        toast.error("Failed to sell products", "error");
        return null;
      }
    } catch (error) {
      toast.error("Error selling products", "error");
      console.error("Error selling products:", error);
      return null;
    }
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false); // ← NEW state for checkout loading

  const handleFinalCheckout = async (e) => {
    if (e) e.preventDefault();

    if (!createdAppointmentId) {
      toast.error("Appointment not created yet", "error");
      return;
    }

    setIsCheckingOut(true); // ← Loader shuru karo

    try {
      // ------------------- Yeh sab same rahega -------------------
      if (!paymentStatus) {
        toast.error("Please select payment status");
        return;
      }

      let walletAmount = 0;
      if (isWalletApplied && selectedWallet) {
        if (splitPaymentMode) {
          const walletDetail = splitPaymentDetails.find(
            (d) => d.mode === "wallet",
          );
          walletAmount = walletDetail ? walletDetail.amount : 0;
        } else if (paymentMode === "wallet") {
          walletAmount = parseFloat(amountPaid) || 0;
        }
      }

      if (isWalletApplied && selectedWallet && walletAmount > 0) {
        const selectedWalletData = wallets.find((w) => w.id === selectedWallet);
        if (selectedWalletData) {
          const currentBalance = parseFloat(
            selectedWalletData.remaining_price_benefits,
          );
          if (walletAmount > currentBalance) {
            toast.error("Insufficient wallet balance", "error");
            return;
          }
          const newBalance =
            Math.round((currentBalance - walletAmount) * 100) / 100;
          const walletUpdated = await updateWalletBalance(
            selectedWallet,
            newBalance,
          );
          if (!walletUpdated) {
            toast.error("Failed to update wallet balance", "error");
            return;
          }
        }
      }

      let saleId = null;
      if (productFormData.product_list.length > 0) {
        saleId = await handleSellProduct();
        if (!saleId) {
          toast.error("Failed to create product sale", "error");
          return;
        }
      }

      let SO = selectedOffers.filter((offer) => offer.id !== "");
      let SS = services.filter((service) => service.id !== "");

      const formattedStaffContributions = Object.keys(staffContributions).map(
        (serviceId) => ({
          service_id: parseInt(serviceId),
          service_name:
            services.find((s) => s.id === parseInt(serviceId))?.service_name ||
            "",
          staff_distribution: staffContributions[serviceId],
        }),
      );

      const formattedOfferContributions = Object.keys(
        offerStaffContributions,
      ).map((offerId) => ({
        offer_id: parseInt(offerId),
        offer_name:
          selectedOffers.find((o) => o.id === parseInt(offerId))?.offer_name ||
          "",
        staff_distribution: offerStaffContributions[offerId],
      }));

      const allStaffContributions = [
        ...formattedStaffContributions,
        ...formattedOfferContributions,
      ];

      const totalPaid = splitPaymentMode
        ? splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0)
        : parseFloat(amountPaid) || 0;

      const total =
        parseFloat(
          finalTotalAppointmentAmountAfterTaxDiscount +
            finalTotalProductSellAmountAfterDiscountTax,
        ) || 0;
      const due = Math.max(0, total - totalPaid);
      const credit = Math.max(0, totalPaid - total);

      let payload = {
        included_services: SS.map((service) => {
          return {
            service_id: service.id,
            service_name: service.service_name,
            actual_price: service.price,
            final_price: service.discount,
            from_membership: service.from_membership,
            membership_id: service.membership_id,
            duration: service.service_time,
            gender: service.gender,
          };
        }),
        included_offers: SO.map((offer) => {
          return {
            offer_id: offer.id,
            actual_price: offer.actual_price,
            discounted_price: offer.discount_price,
            offer_time: offer.offer_time,
            offer_name: offer.name,
          };
        }),
        customer_email: customerEmail,
        payment_mode: splitPaymentMode ? "split" : paymentMode,
        staff: services
          .flatMap((service) => service.staff || [])
          .filter(Boolean),
        staff_contributions: allStaffContributions,
        payment_status: paymentStatus,
        split_payment_mode:
          splitPaymentMode && splitPaymentDetails.length > 0
            ? splitPaymentDetails.reduce((acc, detail) => {
                acc[detail.mode] = detail.amount.toString();
                return acc;
              }, {})
            : null,

        // Send detailed calculated amounts
        appointment_discount_type: appointmentDiscountType,
        appointment_discount_percentage:
          appointmentDiscountType === "percentage"
            ? parseFloat(appointmentDiscountValue.toFixed(2))
            : 0,
        appointment_discount_amount: parseFloat(
          appointmentDiscountAmount.toFixed(2),
        ),
        appointment_tax_type: appointmentTaxType,
        appointment_tax_percentage:
          appointmentTaxType === "percentage"
            ? parseFloat(appointmentTaxValue.toFixed(2))
            : 0,
        appointment_tax_amount: parseFloat(appointmentTaxAmount.toFixed(2)),

        product_discount_type: productDiscountType,
        product_discount_percentage:
          productDiscountType === "percentage"
            ? parseFloat(productDiscountValue.toFixed(2))
            : 0,
        product_discount_amount: parseFloat(productDiscountAmount.toFixed(2)),
        product_tax_type: productTaxType,
        product_tax_percentage:
          productTaxType === "percentage"
            ? parseFloat(productTaxValue.toFixed(2))
            : 0,
        product_tax_amount: parseFloat(productTaxAmount.toFixed(2)),

        final_total_appointment_amount_after_discount: parseFloat(
          finalTotalAppointmentAmountAfterDiscount.toFixed(2),
        ),
        final_total_product_sell_amount_after_discount: parseFloat(
          finalTotalProductSellAmountAfterDiscount.toFixed(2),
        ),
        final_total_appointment_amount_after_tax_discount: parseFloat(
          finalTotalAppointmentAmountAfterTaxDiscount.toFixed(2),
        ),
        final_total_product_sell_amount_after_discount_tax: parseFloat(
          finalTotalProductSellAmountAfterDiscountTax.toFixed(2),
        ),

        // Original total fields
        Total_appointment_amount: parseFloat(totalFinalAmount) || 0,
        Total_product_sell_amount: productFormData.final_total || 0,

        // Legacy fields
        actual_amount: parseFloat(actualAmount.toFixed(2)),
        discount_percentage: parseFloat(combinedDiscountPercentage.toFixed(2)),
        discount_amount: parseFloat(combinedDiscountAmount.toFixed(2)),
        tax_percentage: parseFloat(combinedTaxPercentage.toFixed(2)),
        tax_amount: parseFloat(combinedTaxAmount.toFixed(2)),

        amount_paid: totalPaid,
        checkout: true,
        product_details: productConsumption.filter(
          (product) => product.id && product.id !== "",
        ),
        product_consumption: productConsumption
          .filter((product) => product.id && product.id !== "")
          .map((product) => product.id),
        product_consume: false,
        due_amount: due,
        credit_amount: credit,
        appointment_status: "completed",
        final_amount: parseFloat(
          (
            finalTotalAppointmentAmountAfterTaxDiscount +
            finalTotalProductSellAmountAfterDiscountTax
          ).toFixed(2),
        ),
        customer_wallet: selectedWallet || null,
        is_wallet_applied: isWalletApplied,
      };

      // Add sale ID if exists
      if (saleId) {
        payload.selled_product = saleId;
      }

      // Add membership if used
      if (membershipUsed !== "N/A") {
        const membershipfilter = membershipData?.filter(
          (item) => item?.membership_code === membershipUsed,
        );
        if (membershipfilter?.length > 0) {
          payload.membership = [membershipfilter[0]?.id];
        }
      } else {
        payload.membership = [];
      }

      // ------------------- API Call -------------------
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/${createdAppointment.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Appointment Updated and Checked Out Successfully",
          "success",
        );
        setAppointmentData(data);
        setInvoicePage(true);
      } else {
        toast.error(
          `An error occurred: ${response.statusText || "Unknown error"}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout", "error");
    } finally {
      setIsCheckingOut(false); // ← Loader hamesha band (success ya error mein)
    }
  };

  const handleNextButton = async () => {
    if (activeStep === "Service Details") {
      // Validate staff contributions before proceeding

      // Check if any service has staff assigned but total is not 100%
      const servicesWithStaff = services.filter(
        (service) => service.id && staffContributions[service.id]?.length > 0,
      );

      const offersWithStaff = selectedOffers.filter(
        (offer) => offer.id && offerStaffContributions[offer.id]?.length > 0,
      );

      // Check for services without staff
      const servicesWithoutStaff = services.filter(
        (service) =>
          service.id &&
          (!staffContributions[service.id] ||
            staffContributions[service.id].length === 0),
      );

      // Check for offers without staff
      const offersWithoutStaff = selectedOffers.filter(
        (offer) =>
          offer.id &&
          (!offerStaffContributions[offer.id] ||
            offerStaffContributions[offer.id].length === 0),
      );

      // Check for invalid totals
      const servicesWithInvalidTotal = servicesWithStaff.some(
        (service) => getTotalPercentage(service.id) !== 100,
      );

      const offersWithInvalidTotal = offersWithStaff.some(
        (offer) => getTotalPercentage(offer.id, true) !== 100,
      );

      // Check if there are any services or offers that need staff assignment
      const hasServicesNeedingStaff = servicesWithoutStaff.length > 0;
      const hasOffersNeedingStaff = offersWithoutStaff.length > 0;
      const hasInvalidTotals =
        servicesWithInvalidTotal || offersWithInvalidTotal;

      if (
        hasServicesNeedingStaff ||
        hasOffersNeedingStaff ||
        hasInvalidTotals
      ) {
        let errorMessage =
          "Please fix the following issues before proceeding:\n";

        if (hasServicesNeedingStaff) {
          errorMessage += `- ${servicesWithoutStaff.length} service(s) need staff assignment\n`;
        }

        if (hasOffersNeedingStaff) {
          errorMessage += `- ${offersWithoutStaff.length} offer(s) need staff assignment\n`;
        }

        if (hasInvalidTotals) {
          errorMessage += "- Some staff contributions don't total 100%\n";
        }

        toast.error(errorMessage, "error");
        return;
      }

      setActiveStep("Product Consumption");
    } else if (activeStep === "Product Consumption") {
      // Create appointment with steps 1-3 data
      const appointmentData = await handleSubmitStep3();
      if (appointmentData) {
        setActiveStep("Purchase Product");
      }
    } else if (activeStep === "Purchase Product") {
      setActiveStep("Checkout");
    } else if (activeStep === "Customer Details") {
      setActiveStep("Service Details");
    }
  };
  useEffect(() => {
    if (splitPaymentMode && splitPaymentDetails.length > 0) {
      const totalPaid = splitPaymentDetails.reduce(
        (sum, d) => sum + d.amount,
        0,
      );
      const total = parseFloat(finalAmountWithTax) || 0;

      const due = Math.max(0, total - totalPaid);
      const credit = Math.max(0, totalPaid - total);

      setDueAmount(due.toFixed(2));
      setCreditAmount(credit.toFixed(2));
      setRemainingAmount(due.toFixed(2));

      // Update payment status
      if (totalPaid >= total) {
        setPaymentStatus("paid");
      } else if (totalPaid > 0 && totalPaid < total) {
        setPaymentStatus("partial");
      } else if (totalPaid === 0 && total > 0) {
        setPaymentStatus("unpaid");
      }
    }
  }, [splitPaymentDetails, splitPaymentMode, finalAmountWithTax]);

  // Initialize from existing appointment data
  useEffect(() => {
    if (appointment) {
      // Initialize detailed fields from existing appointment data
      if (
        appointment.appointment_discount_percentage !== undefined &&
        appointment.appointment_discount_percentage !== null
      ) {
        setAppointmentDiscountPercentage(
          parseFloat(appointment.appointment_discount_percentage),
        );
      }
      if (
        appointment.appointment_discount_amount !== undefined &&
        appointment.appointment_discount_amount !== null
      ) {
        setAppointmentDiscountAmount(
          parseFloat(appointment.appointment_discount_amount),
        );
      }
      if (
        appointment.appointment_tax_percentage !== undefined &&
        appointment.appointment_tax_percentage !== null
      ) {
        setAppointmentTaxPercentage(
          parseFloat(appointment.appointment_tax_percentage),
        );
      }
      if (
        appointment.appointment_tax_amount !== undefined &&
        appointment.appointment_tax_amount !== null
      ) {
        setAppointmentTaxAmount(parseFloat(appointment.appointment_tax_amount));
      }
      if (
        appointment.product_discount_percentage !== undefined &&
        appointment.product_discount_percentage !== null
      ) {
        setProductDiscountPercentage(
          parseFloat(appointment.product_discount_percentage),
        );
      }
      if (
        appointment.product_discount_amount !== undefined &&
        appointment.product_discount_amount !== null
      ) {
        setProductDiscountAmount(
          parseFloat(appointment.product_discount_amount),
        );
      }
      if (
        appointment.product_tax_percentage !== undefined &&
        appointment.product_tax_percentage !== null
      ) {
        setProductTaxPercentage(parseFloat(appointment.product_tax_percentage));
      }
      if (
        appointment.product_tax_amount !== undefined &&
        appointment.product_tax_amount !== null
      ) {
        setProductTaxAmount(parseFloat(appointment.product_tax_amount));
      }

      // Initialize calculated fields if they exist
      if (
        appointment.final_total_appointment_amount_after_discount !==
          undefined &&
        appointment.final_total_appointment_amount_after_discount !== null
      ) {
        setFinalTotalAppointmentAmountAfterDiscount(
          parseFloat(appointment.final_total_appointment_amount_after_discount),
        );
      }
      if (
        appointment.final_total_product_sell_amount_after_discount !==
          undefined &&
        appointment.final_total_product_sell_amount_after_discount !== null
      ) {
        setFinalTotalProductSellAmountAfterDiscount(
          parseFloat(
            appointment.final_total_product_sell_amount_after_discount,
          ),
        );
      }
      if (
        appointment.final_total_appointment_amount_after_tax_discount !==
          undefined &&
        appointment.final_total_appointment_amount_after_tax_discount !== null
      ) {
        setFinalTotalAppointmentAmountAfterTaxDiscount(
          parseFloat(
            appointment.final_total_appointment_amount_after_tax_discount,
          ),
        );
      }
      if (
        appointment.final_total_product_sell_amount_after_discount_tax !==
          undefined &&
        appointment.final_total_product_sell_amount_after_discount_tax !== null
      ) {
        setFinalTotalProductSellAmountAfterDiscountTax(
          parseFloat(
            appointment.final_total_product_sell_amount_after_discount_tax,
          ),
        );
      }

      // Also set basic totals if they exist
      if (
        appointment.total_appointment_amount !== undefined &&
        appointment.total_appointment_amount !== null
      ) {
        setTotalFinalAmount(parseFloat(appointment.total_appointment_amount));
      }
      if (
        appointment.total_product_sell_amount !== undefined &&
        appointment.total_product_sell_amount !== null
      ) {
        setProductFormData((prev) => ({
          ...prev,
          final_total: parseFloat(appointment.total_product_sell_amount),
        }));
      }
    }
  }, [appointment]);

  // Auto-calculate when base amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [totalFinalAmount, productFormData.final_total]);

  // Also call calculateDetailedAmounts when component mounts
  useEffect(() => {
    calculateDetailedAmounts();
  }, []);
  useEffect(() => {
    if (appointment) {
      // Set basic payment data if not already set
      if (totalFinalAmount === 0 && appointment.final_amount !== undefined) {
        setTotalFinalAmount(appointment.final_amount);
      }

      if (amountPaid === 0 && appointment.amount_paid !== undefined) {
        setAmountPaid(appointment.amount_paid);
      }

      if (!paymentStatus && appointment.payment_status !== undefined) {
        setPaymentStatus(appointment.payment_status);
      }

      if (!paymentMode && appointment.payment_mode !== undefined) {
        setPaymentMode(appointment.payment_mode);
      }

      if (dueAmount === 0 && appointment.due_amount !== undefined) {
        setDueAmount(appointment.due_amount);
      }

      if (creditAmount === 0 && appointment.credit_amount !== undefined) {
        setCreditAmount(appointment.credit_amount);
      }

      // Initialize tax only if taxValue is not already set
      // if (!taxEnabled) {
      //   if (
      //     appointment.tax_percentage !== undefined &&
      //     appointment.tax_percentage > 0
      //   ) {
      //     setTaxEnabled(true);
      //     setTaxType("percentage");
      //     setTaxValue(appointment.tax_percentage);
      //   } else if (
      //     appointment.tax_amount !== undefined &&
      //     appointment.tax_amount > 0
      //   ) {
      //     setTaxEnabled(true);
      //     setTaxType("amount");
      //     setTaxValue(appointment.tax_amount);
      //   }
      // }
    }
  }, [appointment, activeStep]);

  // Calculate all detailed amounts
  // Calculate all detailed amounts
  // UseEffect to automatically set tax values from vendor data
  useEffect(() => {
    if (vendorData) {
      // Set Appointment Tax from vendor data
      if (vendorData.is_gst) {
        if (vendorData.tax_percent) {
          setAppointmentTaxType("percentage");
          setAppointmentTaxValue(parseFloat(vendorData.tax_percent));
        } else if (vendorData.tax_amount) {
          setAppointmentTaxType("amount");
          setAppointmentTaxValue(parseFloat(vendorData.tax_amount));
        }
      }

      // Set Product Tax from vendor data
      if (vendorData.product_is_gst) {
        if (vendorData.product_tax_percent) {
          setProductTaxType("percentage");
          setProductTaxValue(parseFloat(vendorData.product_tax_percent));
        } else if (vendorData.product_tax_amount) {
          setProductTaxType("amount");
          setProductTaxValue(parseFloat(vendorData.product_tax_amount));
        }
      }
    }
  }, [vendorData]);

  // Calculate detailed amounts for appointment and products separately

  // Update the calculateDetailedAmounts function
  // Update the calculateDetailedAmounts function to properly calculate amounts
  const calculateDetailedAmounts = () => {
    // Base amounts
    const appointmentBaseAmount = parseFloat(totalFinalAmount) || 0;
    const productBaseAmount = productFormData.final_total || 0;

    console.log("Base amounts:", { appointmentBaseAmount, productBaseAmount });

    // Appointment calculations
    let appointmentDiscount = 0;
    if (appointmentDiscountType === "percentage") {
      appointmentDiscount =
        appointmentBaseAmount * (appointmentDiscountValue / 100);
    } else {
      appointmentDiscount = Math.min(
        appointmentDiscountValue,
        appointmentBaseAmount,
      );
    }

    const appointmentAfterDiscount = Math.max(
      0,
      appointmentBaseAmount - appointmentDiscount,
    );

    let appointmentTax = 0;
    if (appointmentTaxType === "percentage") {
      appointmentTax = appointmentAfterDiscount * (appointmentTaxValue / 100);
    } else {
      appointmentTax = appointmentTaxValue;
    }

    const appointmentAfterTax = appointmentAfterDiscount + appointmentTax;

    // Product calculations
    let productDiscount = 0;
    if (productDiscountType === "percentage") {
      productDiscount = productBaseAmount * (productDiscountValue / 100);
    } else {
      productDiscount = Math.min(productDiscountValue, productBaseAmount);
    }

    const productAfterDiscount = Math.max(
      0,
      productBaseAmount - productDiscount,
    );

    let productTax = 0;
    if (productTaxType === "percentage") {
      productTax = productAfterDiscount * (productTaxValue / 100);
    } else {
      productTax = productTaxValue;
    }

    const productAfterTax = productAfterDiscount + productTax;

    console.log("Calculated amounts:", {
      appointmentDiscount,
      appointmentTax,
      productDiscount,
      productTax,
    });

    // Set states
    setAppointmentDiscountAmount(appointmentDiscount);
    setProductDiscountAmount(productDiscount);
    setAppointmentTaxAmount(appointmentTax);
    setProductTaxAmount(productTax);

    setFinalTotalAppointmentAmountAfterDiscount(appointmentAfterDiscount);
    setFinalTotalProductSellAmountAfterDiscount(productAfterDiscount);
    setFinalTotalAppointmentAmountAfterTaxDiscount(appointmentAfterTax);
    setFinalTotalProductSellAmountAfterDiscountTax(productAfterTax);

    // Calculate combined amounts for legacy fields
    const totalActualAmount = appointmentBaseAmount + productBaseAmount;
    const totalDiscountAmount = appointmentDiscount + productDiscount;
    const totalTaxAmount = appointmentTax + productTax;

    setActualAmount(totalActualAmount);
    setCombinedDiscountAmount(totalDiscountAmount);
    setCombinedTaxAmount(totalTaxAmount);

    // Calculate percentages for combined fields
    const combinedDiscountPercent =
      totalActualAmount > 0
        ? (totalDiscountAmount / totalActualAmount) * 100
        : 0;
    const combinedTaxPercent =
      appointmentAfterDiscount + productAfterDiscount > 0
        ? (totalTaxAmount / (appointmentAfterDiscount + productAfterDiscount)) *
          100
        : 0;

    setCombinedDiscountPercentage(combinedDiscountPercent);
    setCombinedTaxPercentage(combinedTaxPercent);
  };

  // Update the useEffect that sets tax values from vendor data
  useEffect(() => {
    if (vendorData) {
      // Set Appointment Tax from vendor data
      if (vendorData.is_gst) {
        if (vendorData.tax_percent) {
          setAppointmentTaxType("percentage");
          setAppointmentTaxValue(parseFloat(vendorData.tax_percent));
        } else if (vendorData.tax_amount) {
          setAppointmentTaxType("amount");
          setAppointmentTaxValue(parseFloat(vendorData.tax_amount));
        }
      }

      // Set Product Tax from vendor data
      if (vendorData.product_is_gst) {
        if (vendorData.product_tax_percent) {
          setProductTaxType("percentage");
          setProductTaxValue(parseFloat(vendorData.product_tax_percent));
        } else if (vendorData.product_tax_amount) {
          setProductTaxType("amount");
          setProductTaxValue(parseFloat(vendorData.product_tax_amount));
        }
      }
    }
  }, [vendorData]);

  // Update the useEffect that calculates when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountType,
    appointmentDiscountValue,
    appointmentTaxType,
    appointmentTaxValue,
    productDiscountType,
    productDiscountValue,
    productTaxType,
    productTaxValue,
  ]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountPercentage,
    appointmentTaxPercentage,
    productDiscountPercentage,
    productTaxPercentage,
  ]);

  // Initialize from appointment data
  useEffect(() => {
    if (appointment) {
      // Set appointment tax from vendor data
      if (vendorData?.is_gst) {
        if (vendorData.tax_percent) {
          setAppointmentTaxPercentage(parseFloat(vendorData.tax_percent));
        }
      }

      // Set product tax from vendor data
      if (vendorData?.product_is_gst) {
        if (vendorData.product_tax_percent) {
          setProductTaxPercentage(parseFloat(vendorData.product_tax_percent));
        }
      }

      // Set discount values from appointment data if available
      if (appointment.appointment_discount_percentage) {
        setAppointmentDiscountPercentage(
          parseFloat(appointment.appointment_discount_percentage),
        );
      }
      if (appointment.product_discount_percentage) {
        setProductDiscountPercentage(
          parseFloat(appointment.product_discount_percentage),
        );
      }
    }
  }, [appointment, vendorData]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountType,
    appointmentDiscountValue,
    appointmentTaxType,
    appointmentTaxValue,
    productDiscountType,
    productDiscountValue,
    productTaxType,
    productTaxValue,
  ]);

  // Update the useEffect that sets tax values from vendor data
  useEffect(() => {
    if (vendorData) {
      console.log("Vendor Data for Tax:", vendorData);

      // Set Appointment Tax from vendor data
      if (vendorData.is_gst) {
        if (vendorData.tax_percent) {
          setAppointmentTaxType("percentage");
          setAppointmentTaxValue(parseFloat(vendorData.tax_percent));
          console.log(
            "Set appointment tax percentage:",
            vendorData.tax_percent,
          );
        } else if (vendorData.tax_amount) {
          setAppointmentTaxType("amount");
          setAppointmentTaxValue(parseFloat(vendorData.tax_amount));
          console.log("Set appointment tax amount:", vendorData.tax_amount);
        }
      }

      // Set Product Tax from vendor data
      if (vendorData.product_is_gst) {
        if (vendorData.product_tax_percent) {
          setProductTaxType("percentage");
          setProductTaxValue(parseFloat(vendorData.product_tax_percent));
          console.log(
            "Set product tax percentage:",
            vendorData.product_tax_percent,
          );
        } else if (vendorData.product_tax_amount) {
          setProductTaxType("amount");
          setProductTaxValue(parseFloat(vendorData.product_tax_amount));
          console.log("Set product tax amount:", vendorData.product_tax_amount);
        }
      }
    }
  }, [vendorData]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountType,
    appointmentDiscountValue,
    appointmentTaxType,
    appointmentTaxValue,
    productDiscountType,
    productDiscountValue,
    productTaxType,
    productTaxValue,
  ]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountType,
    appointmentDiscountValue,
    appointmentTaxType,
    appointmentTaxValue,
    productDiscountType,
    productDiscountValue,
    productTaxType,
    productTaxValue,
  ]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountType,
    appointmentDiscountValue,
    appointmentTaxType,
    appointmentTaxValue,
    productDiscountType,
    productDiscountValue,
    productTaxType,
    productTaxValue,
  ]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountPercentage,
    appointmentTaxPercentage,
    productDiscountPercentage,
    productTaxPercentage,
  ]);

  // UseEffect to calculate when amounts change
  useEffect(() => {
    calculateDetailedAmounts();
  }, [
    totalFinalAmount,
    productFormData.final_total,
    appointmentDiscountPercentage,
    appointmentTaxPercentage,
    productDiscountPercentage,
    productTaxPercentage,
  ]);

  // Add this useEffect near your other useEffects
  useEffect(() => {
    // Initialize amounts when checkout step becomes active
    if (activeStep === "Checkout") {
      const total =
        parseFloat(
          finalTotalAppointmentAmountAfterTaxDiscount +
            finalTotalProductSellAmountAfterDiscountTax,
        ) || 0;
      const paid = parseFloat(amountPaid) || 0;

      // Calculate due amount (total - paid)
      const due = Math.max(0, total - paid);
      setDueAmount(Math.round(due * 100) / 100);

      // Calculate credit amount (paid - total, but only if positive)
      const credit = Math.max(0, paid - total);
      setCreditAmount(Math.round(credit * 100) / 100);

      setRemainingAmount(Math.round(due * 100) / 100);

      console.log("Initialized:", { total, paid, due, credit });
    }
  }, [
    activeStep,
    finalTotalAppointmentAmountAfterTaxDiscount,
    finalTotalProductSellAmountAfterDiscountTax,
  ]);

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");

  return (
    <div className=" lg:max-w-[1000px] flex gap-2 h-full">
      <div className=" max-h-full sticky top-0">
        <div className=" max-h-full flex flex-col gap-3 mt-12 h-full border-r border-solid pr-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex w-48 items-center gap-2 px-3 py-1 ${
                // Disable click for Service Details if Customer Details not filled
                (step === "Service Details" &&
                  (!customerPhone ||
                    !customerName ||
                    !customerGender ||
                    !selectedManager)) ||
                // Disable click for steps after Service Details if Customer Details not filled
                (index > 0 &&
                  (!customerPhone ||
                    !customerName ||
                    !customerGender ||
                    !selectedManager))
                  ? "cursor-not-allowed opacity-50"
                  : activeStep === step
                  ? "text-gray-700 border-l-4 font-semibold border-solid border-gray-700 cursor-pointer"
                  : "text-gray-500 cursor-pointer"
              }`}
              onClick={() => {
                // Prevent navigation to Service Details and beyond if Customer Details not complete
                if (
                  index > 0 &&
                  (!customerPhone ||
                    !customerName ||
                    !customerGender ||
                    !selectedManager)
                ) {
                  return;
                }
                setActiveStep(step);
              }}
            >
              <span>{step}</span>
              {step === "Service Details" &&
                (!customerPhone ||
                  !customerName ||
                  !customerGender ||
                  !selectedManager) && (
                  <Tooltip title="Complete Customer Details first">
                    <InfoIcon fontSize="small" color="disabled" />
                  </Tooltip>
                )}
            </div>
          ))}
        </div>
      </div>
      <div className=" mb-6 mt-10 h-fit overflow-y-auto  rounded-lg bg-white grid gap-x-6 gap-y-6 grid-cols-2 mx-auto py-5 md:py-4 lg:px-10 lg:w-[800px]">
        {activeStep === "Customer Details" && (
          <>
            {/* Date and Time Picker Section */}
            <div className="col-span-2 grid grid-cols-2 gap-4 mb-4">
              {/* Date Field */}
              <div className="w-full">
                <TextField
                  id="appointment-date"
                  label="Appointment Date"
                  type="date"
                  variant="standard"
                  fullWidth
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              {/* Time Field */}
              <div className="w-full">
                <TextField
                  id="appointment-time"
                  label="Appointment Time"
                  type="time"
                  variant="standard"
                  fullWidth
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 minute increments
                  }}
                />
              </div>
            </div>

            {/* Reset to Current Button */}

            <div className="col-span-2 -mb-2 mt-1">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold">Customer Details</h1>
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                    fullWidth
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {showMoreDetails ? "Hide" : "Add"} More Details
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <TextField
                id="phone"
                label="Customer Phone"
                type="text"
                variant="standard"
                fullWidth
                value={customerPhone}
                onChange={handlePhoneChange}
                onBlur={handleBlur}
                disabled={isFetchingCustomer}
                InputProps={{
                  endAdornment: isFetchingCustomer ? (
                    <InputAdornment position="end">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    </InputAdornment>
                  ) : null,
                }}
                error={!customerPhone}
              />
              <ToastContainer position="top-right" autoClose={3000} />
            </div>

            <div className="w-full">
              <TextField
                id="name"
                label="Customer Name"
                type="text"
                variant="standard"
                fullWidth
                value={customerName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    setCustomerName(value);
                  }
                }}
                disabled={isFetchingCustomer}
                error={!customerName}
              />
            </div>

            {/* Customer Gender Field */}
            <div className="w-full">
              <FormControl fullWidth variant="standard" error={!customerGender}>
                <InputLabel id="customer-gender-label">
                  Customer Gender
                </InputLabel>
                <Select
                  labelId="customer-gender-label"
                  id="customer-gender"
                  value={customerGender}
                  label="Customer Gender"
                  onChange={(e) => setCustomerGender(e.target.value)}
                  disabled={isFetchingCustomer}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="w-full">
              <FormControl
                fullWidth
                variant="standard"
                error={!selectedManager}
              >
                <InputLabel id="demo-simple-select-label">
                  Manager Name
                </InputLabel>
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

            {/* === MORE DETAILS BUTTON & EXPANDABLE SECTION === */}
            <div className="col-span-2 mt-4">
              {/* Expandable Additional Details */}
              {showMoreDetails && (
                <div className="mt-4 grid grid-cols-2 gap-4 animate-fadeIn">
                  {/* Birth Date */}
                  <div>
                    <TextField
                      label="Birth Date"
                      type="date"
                      variant="standard"
                      fullWidth
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>

                  {/* Anniversary Date */}
                  <div>
                    <TextField
                      label="Anniversary Date"
                      type="date"
                      variant="standard"
                      fullWidth
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-2 -mb-2 mt-6">
              <h1 className="text-base font-semibold">Membership Details</h1>
            </div>

            {/* Membership Field */}
            <div className="w-full relative">
              <FormControl
                fullWidth
                variant="standard"
                className={
                  hasMembership
                    ? "bg-blue-50 rounded-md p-2 border border-blue-200"
                    : ""
                }
              >
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
                    // Reset OTP changing selection
                    setOtp("");
                  }}
                >
                  <MenuItem value="N/A">No Membership applied</MenuItem>
                  {membershipData?.map((item) => (
                    <MenuItem key={item.id} value={item?.membership_code}>
                      {item.membership_code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* OTP - appears only when membership is selected (not N/A) */}
              {membershipUsed && membershipUsed !== "N/A" && (
                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-sm font-medium mb-2 text-gray-700">
                    Enter 6-digit OTP Sent to {customerPhone || "customer"}
                  </div>

                  <input
                    type="text"
                    maxLength={4}
                    placeholder="____"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ""); // only numbers
                      setOtp(val);
                    }}
                    className="w-full max-w-[180px] text-center text-lg tracking-widest font-mono 
                   border border-gray-400 rounded-md px-3 py-2 focus:outline-none 
                   focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />

                  <div className="mt-2 text-xs text-gray-500">
                    {otp.length === 6 ? (
                      <span className="text-green-600">
                        OTP entered — ready to verify
                      </span>
                    ) : (
                      "Enter 6 digit OTP"
                    )}
                  </div>

                  {/* Optional: Resend link */}
                  <button
                    type="button"
                    className="mt-2 text-blue-600 hover:underline text-sm"
                    onClick={() =>
                      alert("OTP resent! (add your resend logic here)")
                    }
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {/* Membership Status Display */}
              <div className="flex items-center mt-3">
                {hasMembership && customerPhone && (
                  <>
                    <Chip
                      icon={<LoyaltyIcon />}
                      label="Membership available"
                      color="success"
                      size="small"
                      variant="standard"
                    />
                    <Tooltip title="View membership details">
                      <IconButton
                        size="small"
                        onClick={handleOpenMembershipModal}
                        className="ml-2 text-blue-500"
                      >
                        <InfoIcon fontSize="small" />
                        <span className="ml-1 text-sm">Membership Details</span>
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                {!hasMembership && customerPhone && (
                  <Chip
                    icon={<InfoIcon />}
                    label="No membership available for this number"
                    color="default"
                    size="small"
                    variant="standard"
                  />
                )}

                {!customerPhone && (
                  <Chip
                    icon={<InfoIcon />}
                    label="Enter phone number to check membership"
                    color="default"
                    size="small"
                    variant="standard"
                  />
                )}
              </div>
            </div>

            <div className="w-full">
              {customerPhone && hasMembership ? (
                <div className="text-green-600 text-sm italic flex items-center h-full">
                  Membership available for {customerPhone}
                </div>
              ) : customerPhone ? (
                <div className="text-red-600 text-sm italic flex items-center h-full">
                  No membership available for {customerPhone}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic flex items-center h-full">
                  Please enter customer phone number to check membership
                </div>
              )}
            </div>
            {/* Wallet Selection */}
            <div className="w-full">
              <FormControl fullWidth variant="standard">
                <InputLabel id="wallet-select-label">
                  Select Wallet {wallets.length > 0 && "(Available)"}
                </InputLabel>
                <Select
                  labelId="wallet-select-label"
                  id="wallet-select"
                  label={`Select Wallet ${
                    wallets.length > 0 ? "(Available)" : ""
                  }`}
                  value={selectedWallet || ""}
                  onChange={(e) => {
                    const walletId = e.target.value;
                    const selectedWalletData = wallets.find(
                      (w) => w.id === walletId,
                    );

                    if (
                      selectedWalletData &&
                      selectedWalletData.status === "inactive"
                    ) {
                      toast.error(
                        "This wallet has expired. Please create a new wallet.",
                        "error",
                      );
                      return;
                    }

                    setSelectedWallet(walletId);
                    setIstWalletApplied(!!walletId);

                    const wallet = wallets.find((w) => w.id === walletId);
                    if (wallet) {
                      setWalletDetails(wallet);
                    } else {
                      if (!walletId) {
                        setIstWalletApplied(false);
                      }
                    }
                  }}
                  disabled={walletLoading || wallets.length === 0}
                  sx={{
                    border: wallets.length > 0 ? "2px solid #4CAF50" : "none",
                    backgroundColor:
                      wallets.length > 0 ? "#f0fff0" : "transparent",
                  }}
                >
                  <MenuItem value="">
                    <em>No Wallet Selected</em>
                  </MenuItem>
                  {wallets.map((wallet) => (
                    <MenuItem
                      key={wallet.id}
                      value={wallet.id}
                      disabled={wallet.status === "inactive"}
                      sx={{
                        opacity: wallet.status === "inactive" ? 0.6 : 1,
                        backgroundColor:
                          wallet.status === "inactive"
                            ? "#fff3f3"
                            : "transparent",
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                          <span
                            className={
                              wallet.status === "inactive" ? "line-through" : ""
                            }
                          >
                            {wallet.wallet_name} - ₹
                            {wallet.remaining_price_benefits}
                          </span>
                          {wallet.status === "inactive" && (
                            <span className="text-red-500 text-xs font-medium">
                              Wallet expired - Create new wallet
                            </span>
                          )}
                        </div>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWalletDetails(wallet);
                            setOpenWalletModal(true);
                          }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {wallets.length === 0 && customerPhone && (
                <Typography variant="caption" color="textSecondary">
                  No wallets available for this customer
                </Typography>
              )}
              {wallets.length > 0 && (
                <Typography variant="caption" color="success.main">
                  Wallet balance available for this customer
                </Typography>
              )}
            </div>
          </>
        )}

        {activeStep === "Service Details" && (
          <>
            <div className="col-span-2 mb-1 mt-1">
              <h1 className="text-base font-semibold">Service Details</h1>
            </div>
            {(Object.keys(staffContributionErrors).some(
              (k) => staffContributionErrors[k],
            ) ||
              services.some(
                (s) =>
                  s.id &&
                  (!staffContributions[s.id] ||
                    !staffContributions[s.id].length),
              ) ||
              selectedOffers.some(
                (o) =>
                  o.id &&
                  (!offerStaffContributions[o.id] ||
                    !offerStaffContributions[o.id].length),
              )) && (
              <div className="col-span-2 mb-3">
                <Alert severity="error">
                  All services/offers need staff with 100% contribution.
                </Alert>
              </div>
            )}

            {services.map((s, i) => (
              <div className="col-span-2 flex flex-col gap-1" key={`s-${i}`}>
                <div className="flex gap-2 items-center">
                  <div className="w-2/5">
                    <Autocomplete
                      disablePortal
                      options={allServices}
                      disabled={serviceLoading}
                      getOptionLabel={(o) => `${o.service_name} (${o.gender})`}
                      getOptionKey={(o) => o.id}
                      fullWidth
                      renderInput={(p) => (
                        <TextField {...p} variant="standard" label="Service" />
                      )}
                      value={s.id ? s : null}
                      onChange={(e, v) => {
                        const temp = [...services];
                        if (!v) {
                          temp[i] = {
                            id: "",
                            service_name: "",
                            service_time: "",
                            gender: "",
                            discount: "",
                            price: "",
                            from_membership: false,
                            membership_id: 0,
                          };
                          setServices(temp);
                          return;
                        }
                        if (membershipUsed !== "N/A") {
                          const mf = membershipData?.filter(
                            (m) => m.membership_code === membershipUsed,
                          );
                          if (!mf?.length) {
                            temp[i] = {
                              ...v,
                              discount: v.price,
                              price: v.price,
                              from_membership: false,
                              membership_id: 0,
                            };
                            setServices(temp);
                            return;
                          }
                          const md = mf[0];
                          if (md.membership_data.whole_service) {
                            temp[i] = {
                              ...v,
                              discount:
                                v.price *
                                (1 -
                                  md.membership_data.discount_percentage / 100),
                              price: v.price,
                              from_membership: true,
                              membership_id: md.id,
                            };
                          } else {
                            const inc = md.membership_data.included_services;
                            const inMem = inc.length && inc.includes(v.id);
                            const dp =
                              md.membership_data.discount_percentage / 100;
                            temp[i] = {
                              ...v,
                              discount: inMem ? v.price * (1 - dp) : v.price,
                              price: v.price,
                              from_membership: inMem,
                              membership_id: inMem ? md.id : 0,
                            };
                          }
                        } else {
                          temp[i] = {
                            ...v,
                            discount: v.price,
                            price: v.price,
                            from_membership: false,
                            membership_id: 0,
                          };
                        }
                        setServices(temp);
                      }}
                    />
                  </div>
                  <div className="w-1/5">
                    <TextField
                      label="Final Price"
                      type="number"
                      variant="standard"
                      fullWidth
                      value={s.price}
                      readOnly
                      disabled
                      sx={{ bgcolor: "#f9f9f9", cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="w-1/5">
                    <TextField
                      label="Discounted"
                      type="number"
                      variant="standard"
                      fullWidth
                      value={s.discount}
                      readOnly
                      disabled
                      sx={{ bgcolor: "#f9f9f9", cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="w-12 flex justify-center">
                    {i === services.length - 1 ? (
                      <div
                        className="w-9 h-9 bg-emerald-500 rounded flex items-center justify-center cursor-pointer"
                        onClick={() =>
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
                            },
                          ])
                        }
                      >
                        <AddIcon className="text-white !text-2xl" />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 bg-red-500 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          const t = [...services];
                          t.length === 1
                            ? (t[i] = {
                                id: "",
                                service_name: "",
                                service_time: "",
                                gender: "",
                                discount: "",
                                price: "",
                                from_membership: false,
                                membership_id: 0,
                              })
                            : t.splice(i, 1);
                          setServices(t);
                        }}
                      >
                        <DeleteOutlineIcon className="text-white !text-xl" />
                      </div>
                    )}
                  </div>
                </div>

                {s.id && (
                  <div className="ml-3 p-2 bg-gray-50 rounded text-sm mt-2">
                    <div className="font-medium mb-1">Staff Contribution:</div>
                    <FormControl fullWidth variant="standard" className="mb-2">
                      <Autocomplete
                        multiple
                        options={staffList}
                        getOptionLabel={(o) => o.staffname}
                        value={staffList.filter((st) =>
                          staffContributions[s.id]?.some(
                            (c) => c.staff_id === st.id,
                          ),
                        )}
                        onChange={(e, nv) => {
                          if (!staffContributions[s.id])
                            setStaffContributions((p) => ({
                              ...p,
                              [s.id]: [],
                            }));
                          const cur =
                            staffContributions[s.id]?.map((c) => c.staff_id) ||
                            [];
                          const add = nv.filter((st) => !cur.includes(st.id));
                          const rem = cur.filter(
                            (id) => !nv.some((st) => st.id === id),
                          );
                          setStaffContributions((p) => {
                            const up = { ...p };
                            add.forEach((st) => {
                              if (!up[s.id]) up[s.id] = [];
                              up[s.id].push({
                                staff_id: st.id,
                                staff_name: st.staffname,
                                staff_role: st.staff_role || "Unknown",
                                percent: nv.length === 1 ? 100 : 0,
                              });
                            });
                            if (up[s.id]) {
                              up[s.id] = up[s.id].filter(
                                (c) => !rem.includes(c.staff_id),
                              );
                              if (up[s.id].length === 1)
                                up[s.id][0].percent = 100;
                            }
                            const valid = validateStaffContributions(
                              s.id,
                              up[s.id],
                            );
                            setStaffContributionErrors((pe) => ({
                              ...pe,
                              [s.id]: !valid,
                            }));
                            return up;
                          });
                        }}
                        renderInput={(p) => (
                          <TextField
                            {...p}
                            variant="standard"
                            label="Select Staff *"
                            placeholder="Staff"
                            error={s.id && !staffContributions[s.id]?.length}
                            helperText={
                              s.id && !staffContributions[s.id]?.length
                                ? "Select at least one staff"
                                : ""
                            }
                          />
                        )}
                      />
                    </FormControl>
                    {staffContributions[s.id]?.map((c) => {
                      const single = staffContributions[s.id].length === 1;
                      return (
                        <div
                          key={c.staff_id}
                          className="flex items-center gap-1 mb-1"
                        >
                          <span className="w-28 text-xs">
                            {getStaffName(c.staff_id)}:
                          </span>
                          {single ? (
                            <div className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border text-xs font-medium min-w-12">
                                100
                              </span>
                              <span className="text-xs">%</span>
                            </div>
                          ) : (
                            <>
                              <TextField
                                size="small"
                                type="number"
                                variant="standard"
                                value={c.percent ?? ""}
                                onChange={(e) => {
                                  const v =
                                    e.target.value === ""
                                      ? ""
                                      : Math.max(
                                          0,
                                          Math.min(100, Number(e.target.value)),
                                        );
                                  handleStaffPercentageChange(
                                    s.id,
                                    c.staff_id,
                                    v,
                                  );
                                }}
                                inputProps={{
                                  min: 0,
                                  max: 100,
                                  step: 1,
                                  style: { width: "60px" },
                                }}
                                className="w-16"
                                error={staffContributionErrors[s.id]}
                              />
                              <span className="text-xs">%</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className={`mt-1 text-xs font-bold ${
                        getTotalPercentage(s.id) === 100
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Total: {getTotalPercentage(s.id)}%
                    </div>
                    {getTotalPercentage(s.id) !== 100 && (
                      <div className="text-xs text-red-600">Must be 100%</div>
                    )}
                  </div>
                )}
                {s.id && (
                  <div className="text-gray-500 text-xs pl-2">
                    Time: {formateTime(s.service_time)}
                    {s.from_membership && (
                      <span>
                        , <u className="text-black">Membership: Yes</u>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="col-span-2 mb-1 mt-2">
              <h1 className="text-base font-semibold">Offer Details</h1>
            </div>
            {selectedOffers.map((o, i) => (
              <div className="col-span-2 flex flex-col gap-1" key={`o-${i}`}>
                <div className="flex gap-2 items-center">
                  <div className="w-2/5">
                    <Autocomplete
                      disablePortal
                      options={offers}
                      disabled={offerLoading}
                      getOptionLabel={(x) =>
                        `${x.name || x.offer_name || "Offer"} (${
                          x.discount_price || 0
                        })`
                      }
                      getOptionKey={(x) => x.id}
                      fullWidth
                      renderInput={(p) => (
                        <TextField
                          {...p}
                          variant="standard"
                          label="Select Offer"
                        />
                      )}
                      value={o.id ? o : null}
                      onChange={(e, v) => {
                        const t = [...selectedOffers];
                        if (!v) {
                          t[i] = {
                            id: "",
                            offer_name: "",
                            offer_time: "",
                            actual_price: "",
                            discount_price: "",
                          };
                        } else {
                          t[i] = v;
                        }
                        setSelectedOffers(t);
                      }}
                    />
                  </div>
                  <div className="w-1/5">
                    <TextField
                      label="Actual"
                      type="number"
                      variant="standard"
                      fullWidth
                      value={o.actual_price}
                      readOnly
                      disabled
                      sx={{ bgcolor: "#f9f9f9", cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="w-1/5">
                    <TextField
                      label="Discounted"
                      type="number"
                      variant="standard"
                      fullWidth
                      value={o.discount_price}
                      readOnly
                      disabled
                      sx={{ bgcolor: "#f9f9f9", cursor: "not-allowed" }}
                    />
                  </div>
                  <div className="w-12 flex justify-center">
                    {i === selectedOffers.length - 1 ? (
                      <div
                        className="w-9 h-9 bg-emerald-500 rounded flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          setSelectedOffers([
                            ...selectedOffers,
                            {
                              id: "",
                              offer_name: "",
                              offer_time: "",
                              actual_price: "",
                              discount_price: "",
                            },
                          ])
                        }
                      >
                        <AddIcon className="text-white !text-2xl" />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 bg-red-500 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          const t = [...selectedOffers];
                          t.length === 1
                            ? (t[i] = {
                                id: "",
                                offer_name: "",
                                offer_time: "",
                                actual_price: "",
                                discount_price: "",
                              })
                            : t.splice(i, 1);
                          setSelectedOffers(t);
                        }}
                      >
                        <DeleteOutlineIcon className="text-white !text-xl" />
                      </div>
                    )}
                  </div>
                </div>

                {o.id && (
                  <div className="ml-3 p-2 bg-gray-50 rounded text-sm mt-2">
                    <div className="font-medium mb-1">Staff Contribution:</div>
                    <FormControl fullWidth variant="standard" className="mb-2">
                      <Autocomplete
                        multiple
                        options={staffList}
                        getOptionLabel={(x) => x.staffname}
                        value={staffList.filter((st) =>
                          offerStaffContributions[o.id]?.some(
                            (c) => c.staff_id === st.id,
                          ),
                        )}
                        onChange={(e, nv) => {
                          if (!offerStaffContributions[o.id])
                            setOfferStaffContributions((p) => ({
                              ...p,
                              [o.id]: [],
                            }));
                          const cur =
                            offerStaffContributions[o.id]?.map(
                              (c) => c.staff_id,
                            ) || [];
                          const add = nv.filter((st) => !cur.includes(st.id));
                          const rem = cur.filter(
                            (id) => !nv.some((st) => st.id === id),
                          );
                          setOfferStaffContributions((p) => {
                            const up = { ...p };
                            add.forEach((st) => {
                              if (!up[o.id]) up[o.id] = [];
                              up[o.id].push({
                                staff_id: st.id,
                                staff_name: st.staffname,
                                staff_role: st.staff_role || "Unknown",
                                percent: nv.length === 1 ? 100 : 0,
                              });
                            });
                            if (up[o.id]) {
                              up[o.id] = up[o.id].filter(
                                (c) => !rem.includes(c.staff_id),
                              );
                              if (up[o.id].length === 1)
                                up[o.id][0].percent = 100;
                            }
                            const valid = validateStaffContributions(
                              o.id,
                              up[o.id],
                              true,
                            );
                            setStaffContributionErrors((pe) => ({
                              ...pe,
                              [`offer_${o.id}`]: !valid,
                            }));
                            return up;
                          });
                        }}
                        renderInput={(p) => (
                          <TextField
                            {...p}
                            variant="standard"
                            label="Select Staff *"
                            placeholder="Staff"
                            error={
                              o.id && !offerStaffContributions[o.id]?.length
                            }
                            helperText={
                              o.id && !offerStaffContributions[o.id]?.length
                                ? "Select at least one"
                                : ""
                            }
                          />
                        )}
                      />
                    </FormControl>
                    {offerStaffContributions[o.id]?.map((c) => {
                      const single = offerStaffContributions[o.id].length === 1;
                      return (
                        <div
                          key={c.staff_id}
                          className="flex items-center gap-1 mb-1"
                        >
                          <span className="w-28 text-xs">
                            {getStaffName(c.staff_id)}:
                          </span>
                          {single ? (
                            <div className="flex items-center gap-1">
                              <span className="bg-white px-1.5 py-0.5 rounded border text-xs font-medium min-w-12">
                                100
                              </span>
                              <span className="text-xs">%</span>
                            </div>
                          ) : (
                            <>
                              <TextField
                                size="small"
                                type="number"
                                variant="standard"
                                value={c.percent || ""}
                                onChange={(e) => {
                                  const v =
                                    e.target.value === ""
                                      ? ""
                                      : Math.max(
                                          0,
                                          Math.min(
                                            100,
                                            parseInt(e.target.value),
                                          ),
                                        );
                                  handleOfferStaffPercentageChange(
                                    o.id,
                                    c.staff_id,
                                    v,
                                  );
                                }}
                                inputProps={{
                                  min: 0,
                                  max: 100,
                                  step: 1,
                                  style: { width: "60px" },
                                }}
                                className="w-16"
                                error={staffContributionErrors[`offer_${o.id}`]}
                              />
                              <span className="text-xs">%</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className={`mt-1 text-xs font-bold ${
                        getTotalPercentage(o.id, true) === 100
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Total: {getTotalPercentage(o.id, true)}%
                    </div>
                    {getTotalPercentage(o.id, true) !== 100 && (
                      <div className="text-xs text-red-600">Must be 100%</div>
                    )}
                  </div>
                )}
                {o.id && (
                  <div className="text-gray-500 text-xs pl-2">
                    Time: {formateTime(o.offer_time)}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {activeStep === "Product Consumption" && (
          <>
            <ToastContainer />
            <div className="col-span-2 -mb-2 mt-1">
              <h1 className="text-base font-semibold">Product Consumption</h1>
              {appointment?.product_details &&
                appointment.product_details.length > 0 && (
                  <div className="text-sm text-blue-600 mt-1">
                    Showing previously used products
                  </div>
                )}
            </div>

            {productConsumption?.map((product, index) => (
              <div
                key={index}
                className="flex flex-col w-full col-span-2 gap-[6px]"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-[30%] grow shrink">
                    <Autocomplete
                      disablePortal
                      id="product-options"
                      options={InUseProductData}
                      getOptionLabel={(option) =>
                        `${option?.name} (${option?.remaining_quantity} ${option?.measure_unit})`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      loading={isLoadingProducts}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Product"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingProducts ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      value={product.id ? product : null}
                      onChange={(e, value) => {
                        let temp = [...productConsumption];

                        if (value === null || value === undefined) {
                          temp[index] = {
                            id: "",
                            name: "",
                            per_use_consumption: "",
                            remaining_quantity: "",
                            measure_unit: "",
                            total_use_times: "",
                            staff_id: "",
                            staff_name: "",
                          };
                          setProductConsumption(temp);
                          return;
                        }
                        temp[index] = {
                          id: value.id,
                          name: value.name,
                          per_use_consumption: value.per_use_consumption,
                          remaining_quantity: value.remaining_quantity,
                          measure_unit: value.measure_unit,
                          total_use_times: product.total_use_times || 1,
                          staff_id: product.staff_id || "",
                          staff_name: product.staff_name || "",
                        };
                        setProductConsumption(temp);
                      }}
                      disabled={
                        isLoadingProducts || isSubmitting || isUpdatingWallet
                      }
                    />
                  </div>

                  <div className="w-[15%]">
                    <TextField
                      id={`final-amount-${index}`}
                      label={`Consumption per use (${product?.measure_unit})`}
                      type="number"
                      variant="standard"
                      fullWidth
                      value={product.per_use_consumption}
                      onWheel={() => document.activeElement.blur()}
                      onKeyDownCapture={(event) => {
                        if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                        }
                      }}
                      disabled
                    />
                  </div>

                  <div className="w-[15%]">
                    <TextField
                      id={`total-use-times-${index}`}
                      label="Total Use Times"
                      type="number"
                      variant="standard"
                      fullWidth
                      value={product.total_use_times}
                      onWheel={() => document.activeElement.blur()}
                      onKeyDownCapture={(event) => {
                        if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let temp = [...productConsumption];
                        temp[index].total_use_times =
                          parseInt(e.target.value) || 1;
                        setProductConsumption(temp);
                      }}
                      disabled={
                        isLoadingProducts || isSubmitting || isUpdatingWallet
                      }
                    />
                  </div>

                  {/* Staff Selection for Product */}
                  <div className="w-[30%]">
                    <Autocomplete
                      disablePortal
                      id={`staff-options-${index}`}
                      options={staffList}
                      getOptionLabel={(option) =>
                        `${option?.staffname} - ${
                          option?.staff_role || "Staff"
                        }`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Sold By Staff"
                          placeholder="Select staff"
                        />
                      )}
                      value={
                        product.staff_id
                          ? staffList.find(
                              (staff) => staff.id === product.staff_id,
                            ) || null
                          : null
                      }
                      onChange={(e, value) => {
                        let temp = [...productConsumption];
                        if (value) {
                          temp[index].staff_id = value.id;
                          temp[index].staff_name = value.staffname; // Using staffname field
                        } else {
                          temp[index].staff_id = "";
                          temp[index].staff_name = "";
                        }
                        setProductConsumption(temp);
                      }}
                      disabled={
                        isLoadingProducts ||
                        isSubmitting ||
                        isUpdatingWallet ||
                        !product.id
                      }
                    />
                  </div>

                  <div className="h-full w-[60px] shrink-0 flex items-center justify-center">
                    {index == productConsumption?.length - 1 ? (
                      <div
                        className="w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                        onClick={() => {
                          if (
                            !isLoadingProducts &&
                            !isSubmitting &&
                            !isUpdatingWallet
                          ) {
                            setProductConsumption([
                              ...productConsumption,
                              {
                                id: "",
                                name: "",
                                per_use_consumption: "",
                                remaining_quantity: "",
                                measure_unit: "",
                                total_use_times: 1,
                                staff_id: "",
                                staff_name: "",
                              },
                            ]);
                          }
                        }}
                        style={{
                          cursor:
                            isLoadingProducts ||
                            isSubmitting ||
                            isUpdatingWallet
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            isLoadingProducts ||
                            isSubmitting ||
                            isUpdatingWallet
                              ? 0.6
                              : 1,
                        }}
                      >
                        <AddIcon className="h-full w-full text-white !text-[40px]" />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                        onClick={() => {
                          if (
                            !isLoadingProducts &&
                            !isSubmitting &&
                            !isUpdatingWallet
                          ) {
                            if (productConsumption.length === 1) {
                              let temp = [...productConsumption];
                              temp[index] = {
                                id: "",
                                name: "",
                                per_use_consumption: "",
                                remaining_quantity: "",
                                measure_unit: "",
                                total_use_times: "",
                                staff_id: "",
                                staff_name: "",
                              };
                              setProductConsumption(temp);
                              return;
                            }
                            let temp = [...productConsumption];
                            temp.splice(index, 1);
                            setProductConsumption(temp);
                          }
                        }}
                        style={{
                          cursor:
                            isLoadingProducts ||
                            isSubmitting ||
                            isUpdatingWallet
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            isLoadingProducts ||
                            isSubmitting ||
                            isUpdatingWallet
                              ? 0.6
                              : 1,
                        }}
                      >
                        <DeleteOutlineIcon className="h-full w-full !text-[32px] text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Show previous usage information if available */}
                {product.id &&
                  appointment?.product_details &&
                  appointment.product_details.some(
                    (p) => p.id === product.id,
                  ) && (
                    <div className="text-xs text-gray-500 ml-4">
                      Previously used:{" "}
                      {appointment.product_details.find(
                        (p) => p.id === product.id,
                      )?.total_use_times || 1}{" "}
                      times
                    </div>
                  )}
              </div>
            ))}

            {/* Next Button with Loading State */}
            <div className="col-span-2 flex justify-end mt-4">
              <Button
                // onClick={handleSubmitStep3}
                disabled={isLoadingProducts || isSubmitting || isUpdatingWallet}
                startIcon={
                  isSubmitting || isUpdatingWallet ? (
                    <CircularProgress size={30} color="inherit" />
                  ) : null
                }
              ></Button>
            </div>
          </>
        )}

        {activeStep === "Purchase Product" && (
          <>
            <ToastContainer />
            <div className="col-span-2 -mb-2 mt-1">
              <h1 className="text-base font-semibold">Purchase Products</h1>
            </div>

            {/* Main container with fixed height and no vertical scrolling */}
            <div className="col-span-2 flex flex-col md:flex-row h-[600px] gap-4">
              {/* Left Section: Product Selection */}
              <div className="w-full md:w-[60%] border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Sell Product
                  </Typography>
                </div>

                <TextField
                  variant="outlined"
                  fullWidth
                  value={searchProductTerm}
                  onChange={(e) => setSearchProductTerm(e.target.value)}
                  placeholder="Search products"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  className="mb-4"
                />

                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Products
                </Typography>

                {/* Product grid with internal scrolling */}
                <div className="flex-grow overflow-y-auto pr-2">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredProducts.map((item, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer transition-all h-full ${
                            productFormData.product_list.some(
                              (product) => product.product_id === item.product,
                            )
                              ? "bg-gray-100 border-2 border-blue-400"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => {
                            if (
                              productFormData.product_list.some(
                                (product) =>
                                  product.product_id === item.product,
                              )
                            ) {
                              return;
                            }

                            setProductFormData((prev) => ({
                              ...prev,
                              product_list: [
                                ...prev.product_list,
                                {
                                  product_id: item.product,
                                  product_name:
                                    item.product_details?.product_name,
                                  product_brand:
                                    item.product_details?.brand_name,
                                  PIN: item.product_details
                                    ?.product_indentification_number,
                                  qauntity: 1,
                                  price_per_unit: item.retail_price_per_unit,
                                  discount: 0,
                                  discount_unit: "percentage",
                                  tax: 0,
                                  net_sub_total: item.retail_price_per_unit,
                                },
                              ],
                            }));
                          }}
                        >
                          <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                              {item?.product_details?.product_name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <Typography
                                variant="body2"
                                className="font-medium truncate"
                              >
                                {item?.product_details?.product_name || "N/A"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                ₹{item.retail_price_per_unit || "0.00"}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="flex items-center justify-center h-full">
                      <CardContent className="text-center">
                        <Typography
                          variant="h6"
                          className="font-bold text-gray-700"
                        >
                          No Products Found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try a different search term or check if products are
                          available.
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Right Section: Shopping Cart */}
              <div className="w-full md:w-[40%] border border-gray-200 rounded-lg p-4 flex flex-col">
                <Card className="mb-4">
                  <CardContent className="flex justify-between items-center p-3">
                    <div>
                      <Typography variant="subtitle2" className="font-semibold">
                        {productFormData.customerName ||
                          productFormData.customerNumber ||
                          "Customer"}
                      </Typography>
                      {productFormData.customerName &&
                        productFormData.customerNumber && (
                          <Typography variant="caption" color="textSecondary">
                            {productFormData.customerNumber}
                          </Typography>
                        )}
                    </div>
                    <div className="bg-purple-100 p-2 rounded-full">
                      <PersonIcon
                        className="text-purple-600"
                        fontSize="small"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Typography variant="subtitle2" className="font-semibold mb-2">
                  Cart Items
                </Typography>

                {/* Cart items with internal scrolling */}
                <div className="flex-grow overflow-y-auto pr-2 mb-4">
                  {productFormData?.product_list.length > 0 ? (
                    productFormData.product_list.map((item, index) => (
                      <Card
                        key={index}
                        className="group hover:bg-gray-50 mb-2"
                        onClick={() => {
                          setEditProductData({
                            product_id: item.product_id,
                            qauntity: item.qauntity,
                            price_per_unit: item.price_per_unit,
                            discount: item.discount,
                            discount_unit: item.discount_unit,
                            tax: item.tax,
                            net_sub_total: item.net_sub_total,
                            product_name: item.product_name,
                            product_brand: item.product_brand,
                            PIN: item.PIN,
                          });
                          setOpenEditModal(true);
                        }}
                      >
                        <CardContent className="flex justify-between items-center p-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-1 h-8 bg-gray-300 rounded group-hover:w-2 transition-all"></div>
                            <div className="min-w-0 flex-1">
                              <Typography
                                variant="body2"
                                className="font-medium truncate"
                              >
                                {item.product_name || "Product Name"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {item.PIN || "-"}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Typography
                              variant="body2"
                              className="group-hover:hidden whitespace-nowrap"
                            >
                              ₹{item?.net_sub_total?.toFixed(2) || "0.00"}
                            </Typography>
                            <div className="hidden group-hover:flex gap-1">
                              <Tooltip title="Edit">
                                <IconButton size="small">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedProductList =
                                      productFormData.product_list.filter(
                                        (product) =>
                                          product.product_id !==
                                          item.product_id,
                                      );
                                    setProductFormData((prev) => ({
                                      ...prev,
                                      product_list: updatedProductList,
                                    }));
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <Typography variant="body2" color="textSecondary">
                        Your cart is empty
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Order summary - fixed at bottom */}
                <div className="mt-auto border-t pt-4">
                  <div className="flex justify-between mb-1">
                    <Typography variant="caption">Subtotal:</Typography>
                    <Typography variant="caption">
                      ₹
                      {productFormData.product_list
                        .reduce(
                          (acc, item) =>
                            acc + item.qauntity * item.price_per_unit,
                          0,
                        )
                        ?.toFixed(2)}
                    </Typography>
                  </div>
                  <div className="flex justify-between mb-1">
                    <Typography variant="caption">Discount:</Typography>
                    <Typography variant="caption">
                      ₹
                      {productFormData.product_list
                        .reduce((acc, item) => {
                          return (
                            acc +
                            (item.discount_unit === "percentage"
                              ? item.qauntity *
                                item.price_per_unit *
                                (item.discount / 100)
                              : parseFloat(item.discount))
                          );
                        }, 0)
                        ?.toFixed(2)}
                    </Typography>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Typography variant="caption">Tax:</Typography>
                    <Typography variant="caption">
                      ₹
                      {productFormData.product_list
                        .reduce((acc, item) => acc + item.tax, 0)
                        ?.toFixed(2)}
                    </Typography>
                  </div>
                  <Divider />
                  <div className="flex justify-between mt-2 mb-3">
                    <Typography variant="subtitle2" className="font-bold">
                      Total:
                    </Typography>
                    <Typography variant="subtitle2" className="font-bold">
                      ₹{productFormData?.final_total?.toFixed(2) || "0.00"}
                    </Typography>
                  </div>

                  {/* <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSellProduct}
                    disabled={productFormData.product_list.length === 0}
                    size="small"
                  >
                    Add Products to Sale
                  </Button> */}
                </div>
              </div>
            </div>
          </>
        )}

        {activeStep === "Checkout" && (
          <>
            <div className="col-span-2 -mb-2">
              <h1 className="text-base font-semibold">Payment Details</h1>
            </div>

            {/* Totals Row - 3 in one line */}
            <div className="grid grid-cols-3 gap-3 w-full col-span-2">
              <TextField
                label="Appointment Total"
                type="number"
                variant="standard"
                fullWidth
                value={Math.round(totalFinalAmount * 100) / 100}
                InputProps={{ readOnly: true }}
                sx={{
                  cursor: "not-allowed",
                  backgroundColor: "#e8f5e8",
                  "& .MuiInputBase-input": {
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  },
                }}
              />

              {(productFormData.final_total > 0 ||
                appointment?.selled_product_details) && (
                <TextField
                  label="Product Total"
                  type="number"
                  variant="standard"
                  fullWidth
                  value={
                    Math.round(
                      (appointment?.selled_product_details?.final_total ||
                        productFormData.final_total) * 100,
                    ) / 100
                  }
                  InputProps={{ readOnly: true }}
                  sx={{
                    cursor: "not-allowed",
                    backgroundColor: "#e8f5e8",
                    "& .MuiInputBase-input": {
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },
                  }}
                />
              )}

              <TextField
                label="Combined Total"
                type="number"
                variant="standard"
                sx={{
                  cursor: "not-allowed",
                  backgroundColor: "#e8f5e8",
                  "& .MuiInputBase-input": {
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  },
                }}
                fullWidth
                value={Math.round(actualAmount * 100) / 100}
                InputProps={{ readOnly: true }}
              />
            </div>

            {/* APPOINTMENT & PRODUCT SECTIONS COMBINED */}
            <div className="w-full col-span-2 mt-2">
              <Typography
                variant="h6"
                className="font-semibold mb-1 border-b pb-1"
              >
                Service & Product Details
              </Typography>
            </div>

            <div className="grid grid-cols-4 gap-3 w-full col-span-2">
              {/* Appointment Tax */}
              {vendorData?.is_gst && (
                <TextField
                  label={`Service Tax (${
                    appointmentTaxType === "percentage"
                      ? `${appointmentTaxValue}%`
                      : `₹${appointmentTaxValue}`
                  })`}
                  type="number"
                  variant="standard"
                  fullWidth
                  value={appointmentTaxValue}
                  InputProps={{ readOnly: true }}
                  sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }}
                />
              )}

              {/* Appointment Discount Type */}
              <FormControl fullWidth variant="standard">
                <InputLabel>Service Discount Type</InputLabel>
                <Select
                  value={appointmentDiscountType}
                  label="Service Discount Type"
                  onChange={(e) => {
                    setAppointmentDiscountType(e.target.value);
                    setAppointmentDiscountValue(0);
                  }}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </Select>
              </FormControl>

              {/* Appointment Discount Value */}
              <TextField
                label={
                  appointmentDiscountType === "percentage"
                    ? "Service Discount %"
                    : "Service Discount Amt"
                }
                type="number"
                variant="standard"
                fullWidth
                value={appointmentDiscountValue}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (appointmentDiscountType === "percentage") {
                    setAppointmentDiscountValue(
                      Math.min(100, Math.max(0, Math.round(value * 100) / 100)),
                    );
                  } else {
                    setAppointmentDiscountValue(
                      Math.max(0, Math.round(value * 100) / 100),
                    );
                  }
                }}
              />

              {/* Appointment Discount Amount */}
              <TextField
                label="Service Discount Amt"
                type="number"
                variant="standard"
                fullWidth
                value={Math.round(appointmentDiscountAmount * 100) / 100}
                InputProps={{ readOnly: true }}
                sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }}
              />

              {/* PRODUCT FIELDS - ONLY SHOW WHEN PRODUCT EXISTS */}
              {(productFormData.final_total > 0 ||
                appointment?.selled_product_details) && (
                <>
                  {/* Product Tax */}
                  {vendorData?.product_is_gst && (
                    <TextField
                      label={`Prod Tax (${
                        productTaxType === "percentage"
                          ? `${productTaxValue}%`
                          : `₹${productTaxValue}`
                      })`}
                      type="number"
                      variant="standard"
                      fullWidth
                      value={productTaxValue}
                      InputProps={{ readOnly: true }}
                      sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }}
                    />
                  )}

                  {/* Product Discount Type */}
                  <FormControl fullWidth variant="standard">
                    <InputLabel>Prod Discount Type</InputLabel>
                    <Select
                      value={productDiscountType}
                      label="Prod Discount Type"
                      onChange={(e) => {
                        setProductDiscountType(e.target.value);
                        setProductDiscountValue(0);
                      }}
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="amount">Amount</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Product Discount Value */}
                  <TextField
                    label={
                      productDiscountType === "percentage"
                        ? "Prod Discount %"
                        : "Prod Discount Amt"
                    }
                    type="number"
                    variant="standard"
                    fullWidth
                    value={productDiscountValue}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      if (productDiscountType === "percentage") {
                        setProductDiscountValue(
                          Math.min(
                            100,
                            Math.max(0, Math.round(value * 100) / 100),
                          ),
                        );
                      } else {
                        setProductDiscountValue(
                          Math.max(0, Math.round(value * 100) / 100),
                        );
                      }
                    }}
                  />

                  {/* Product Discount Amount */}
                  <TextField
                    label="Prod Discount Amt"
                    type="number"
                    variant="standard"
                    fullWidth
                    value={Math.round(productDiscountAmount * 100) / 100}
                    InputProps={{ readOnly: true }}
                    sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }}
                  />
                </>
              )}
            </div>

            {/* FINAL CALCULATIONS & LEGACY FIELDS COMBINED */}
            <div className="w-full col-span-2 mt-2">
              <Typography
                variant="h6"
                className="font-semibold mb-1 border-b pb-1"
              >
                Final Calculations & Legacy Fields
              </Typography>
            </div>

            <div className="grid grid-cols-4 gap-3 w-full col-span-2">
              {/* Final Calculations */}
              <TextField
                label="Final Service (After Disc)"
                type="number"
                variant="standard"
                fullWidth
                value={
                  Math.round(finalTotalAppointmentAmountAfterDiscount * 100) /
                  100
                }
                InputProps={{ readOnly: false }}
                sx={{
                  cursor: "not-allowed",
                  backgroundColor: "#f0f8ff",
                  "& .MuiInputBase-input": { fontWeight: "bold" },
                }}
              />

              {/* Product Final Calculation - ONLY SHOW WHEN PRODUCT EXISTS */}
              {(productFormData.final_total > 0 ||
                appointment?.selled_product_details) && (
                <TextField
                  label="Final Prod (After Disc)"
                  type="number"
                  variant="standard"
                  fullWidth
                  value={
                    Math.round(finalTotalProductSellAmountAfterDiscount * 100) /
                    100
                  }
                  InputProps={{ readOnly: false }}
                  sx={{
                    cursor: "not-allowed",
                    backgroundColor: "#f0f8ff",
                    "& .MuiInputBase-input": { fontWeight: "bold" },
                  }}
                />
              )}
            </div>

            {/* Combined Final Total */}
            <div className="w-full col-span-2 mt-1">
              <TextField
                label="Combined Final Total (After Tax)"
                type="number"
                variant="standard"
                fullWidth
                value={
                  Math.round(
                    (finalTotalAppointmentAmountAfterTaxDiscount +
                      finalTotalProductSellAmountAfterDiscountTax) *
                      100,
                  ) / 100
                }
                InputProps={{ readOnly: false }}
                sx={{
                  cursor: "not-allowed",
                  backgroundColor: "#e8f5e8",
                  "& .MuiInputBase-input": {
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  },
                }}
              />
            </div>

            {/* PAYMENT INFORMATION */}
            <div className="w-full col-span-2 mt-2">
              <Typography
                variant="h6"
                className="font-semibold mb-1 border-b pb-1"
              >
                Payment Information
              </Typography>
            </div>

            <div className="grid grid-cols-4 gap-3 w-full col-span-2">
              {/* Payment Status */}
              <FormControl fullWidth variant="standard">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentStatus}
                  label="Payment Status"
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setPaymentStatus(newStatus);

                    const total =
                      parseFloat(
                        finalTotalAppointmentAmountAfterTaxDiscount +
                          finalTotalProductSellAmountAfterDiscountTax,
                      ) || 0;

                    if (newStatus === "unpaid") {
                      setAmountPaid(0);
                      setDueAmount(Math.round(total * 100) / 100);
                      setCreditAmount(0);
                    } else if (newStatus === "paid") {
                      setAmountPaid(Math.round(total * 100) / 100);
                      setDueAmount(0);
                      setCreditAmount(0);
                    } else if (newStatus === "partial") {
                      const currentPaid = parseFloat(amountPaid) || 0;
                      const due = Math.max(0, total - currentPaid);
                      const credit = Math.max(0, currentPaid - total);
                      setDueAmount(Math.round(due * 100) / 100);
                      setCreditAmount(Math.round(credit * 100) / 100);
                    }

                    // Reset split payment if unpaid
                    if (newStatus === "unpaid") {
                      setSplitPaymentMode(false);
                      setSelectedPaymentModes([]);
                      setSplitPaymentDetails([]);
                    }
                  }}
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                </Select>
              </FormControl>

              {/* Payment Mode */}
              <FormControl fullWidth variant="standard">
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={paymentMode}
                  label="Payment Mode"
                  onChange={(e) => {
                    const newMode = e.target.value;
                    setPaymentMode(newMode);
                    if (
                      splitPaymentMode &&
                      newMode === "wallet" &&
                      !selectedPaymentModes.includes("wallet")
                    ) {
                      const updatedModes = [...selectedPaymentModes, "wallet"];
                      setSelectedPaymentModes(updatedModes);
                      const updatedDetails = [...splitPaymentDetails];
                      if (!updatedDetails.find((d) => d.mode === "wallet")) {
                        updatedDetails.push({ mode: "wallet", amount: 0 });
                      }
                      setSplitPaymentDetails(updatedDetails);
                    }
                  }}
                  disabled={paymentStatus === "unpaid" && !splitPaymentMode}
                >
                  {paymentMethods
                    .filter((method) => method.status === "Active")
                    .map((method, index) => (
                      <MenuItem key={`payment-${index}`} value={method.type}>
                        {method.name} - {method.type}
                        {method.description && ` (${method.description})`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* Split Payment Toggle */}
              <div className="col-span-2 flex items-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={splitPaymentMode}
                      onChange={(e) => {
                        const isSplit = e.target.checked;
                        setSplitPaymentMode(isSplit);
                        if (isSplit) {
                          const initialModes = [];
                          if (paymentMode) initialModes.push(paymentMode);
                          if (
                            isWalletApplied &&
                            selectedWallet &&
                            !initialModes.includes("wallet")
                          )
                            initialModes.push("wallet");
                          if (initialModes.length === 0)
                            initialModes.push("cash");

                          setSelectedPaymentModes(initialModes);
                          const totalPaid = parseFloat(amountPaid) || 0;
                          setSplitPaymentDetails(
                            initialModes.map((mode) => ({
                              mode: mode,
                              amount:
                                mode === "wallet"
                                  ? 0
                                  : Math.round(
                                      (totalPaid / initialModes.length) * 100,
                                    ) / 100,
                            })),
                          );
                        } else {
                          setSelectedPaymentModes([]);
                          setSplitPaymentDetails([]);
                        }
                      }}
                      disabled={paymentStatus === "unpaid"}
                    />
                  }
                  label="Split Payment"
                />
              </div>

              {/* Amount Paid - Always Visible */}
              <TextField
                label="Amount Paid"
                placeholder="Enter amount"
                type="number"
                variant="standard"
                fullWidth
                value={amountPaid}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  const paid = parseFloat(e.target.value) || 0;
                  const total =
                    parseFloat(
                      finalTotalAppointmentAmountAfterTaxDiscount +
                        finalTotalProductSellAmountAfterDiscountTax,
                    ) || 0;

                  // Wallet restriction
                  if (
                    isWalletApplied &&
                    selectedWallet &&
                    paymentMode === "wallet"
                  ) {
                    const walletData = wallets.find(
                      (w) => w.id === selectedWallet,
                    );
                    if (
                      walletData &&
                      paid > walletData.remaining_price_benefits
                    )
                      return;
                  }

                  setAmountPaid(paid);

                  const due = Math.max(0, total - paid);
                  const credit = Math.max(0, paid - total);

                  setDueAmount(Math.round(due * 100) / 100);
                  setCreditAmount(Math.round(credit * 100) / 100);
                  setRemainingAmount(Math.round(due * 100) / 100);

                  // Auto-update payment status
                  if (paid >= total && total > 0) setPaymentStatus("paid");
                  else if (paid > 0 && paid < total)
                    setPaymentStatus("partial");
                  else if (paid === 0 && total > 0) setPaymentStatus("unpaid");
                }}
                disabled={splitPaymentMode} // Disable if split mode is on
              />

              {/* Due Amount */}
              <TextField
                label="Due Amount"
                type="number"
                variant="standard"
                fullWidth
                value={Math.round(dueAmount * 100) / 100}
                InputProps={{ readOnly: true }}
                sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
              />

              {/* Credit Amount */}
              <TextField
                label="Credit Amount"
                type="number"
                variant="standard"
                fullWidth
                value={Math.round(creditAmount * 100) / 100}
                InputProps={{ readOnly: true }}
                sx={{
                  cursor: "not-allowed",
                  backgroundColor: creditAmount > 0 ? "#e8f5e8" : "#f9f9f9",
                  "& .MuiInputBase-input": {
                    fontWeight: creditAmount > 0 ? "bold" : "normal",
                    color: creditAmount > 0 ? "#2e7d32" : "inherit",
                  },
                }}
              />
            </div>
            {/* Split Payment Mode Selection - CHECKBOX DROPDOWN */}
            {splitPaymentMode && (
              <div className="w-full col-span-2">
                <FormControl fullWidth variant="standard">
                  <InputLabel>Select Payment Modes for Split</InputLabel>
                  <Select
                    multiple
                    value={selectedPaymentModes}
                    open={isDropdownOpen}
                    onOpen={() => setIsDropdownOpen(true)}
                    onClose={() => setIsDropdownOpen(false)}
                    onChange={(e) => {
                      const newModes = e.target.value;
                      let finalModes = newModes;
                      if (
                        isWalletApplied &&
                        selectedWallet &&
                        !newModes.includes("wallet")
                      ) {
                        finalModes = [...newModes, "wallet"];
                      }
                      setSelectedPaymentModes(finalModes);

                      const currentDetails = [...splitPaymentDetails];
                      const updatedDetails = finalModes.map((mode) => {
                        const existing = currentDetails.find(
                          (d) => d.mode === mode,
                        );
                        return existing || { mode: mode, amount: 0 };
                      });

                      setSplitPaymentDetails(updatedDetails);
                      const totalPaid = updatedDetails.reduce(
                        (sum, d) => sum + d.amount,
                        0,
                      );
                      setAmountPaid(Math.round(totalPaid * 100) / 100);
                    }}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {/* Static payment options */}
                    <MenuItem value="cash">
                      <Checkbox
                        checked={selectedPaymentModes.includes("cash")}
                      />
                      <ListItemText primary="Cash" />
                    </MenuItem>
                    <MenuItem value="wallet">
                      <Checkbox
                        checked={selectedPaymentModes.includes("wallet")}
                      />
                      <ListItemText primary="Wallet" />
                    </MenuItem>

                    {/* Dynamic payment options from API - central_payment_method */}
                    {paymentMethods
                      .filter((method) => method.status === "Active")
                      .map((method, index) => (
                        <MenuItem key={`split-${index}`} value={method.type}>
                          <Checkbox
                            checked={selectedPaymentModes.includes(method.type)}
                          />
                          <ListItemText
                            primary={`${method.name} - ${method.type}`}
                            secondary={method.description || ""}
                          />
                        </MenuItem>
                      ))}

                    {/* DONE BUTTON TO CLOSE DROPDOWN */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-2 flex justify-end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="textSecondary">
                  {isWalletApplied && selectedWallet
                    ? "Wallet is automatically included. Select additional payment modes."
                    : "Select all payment modes you want to split the payment across"}
                </Typography>
              </div>
            )}

            {/* Split Payment Amount Inputs with MANUAL CONTROL */}
            {splitPaymentMode && selectedPaymentModes.length > 0 && (
              <div className="w-full col-span-2 mt-2">
                <Typography variant="subtitle2" className="font-semibold mb-2">
                  Split Payment Amounts
                </Typography>
                <div className="space-y-3">
                  {splitPaymentDetails.map((detail, index) => {
                    const isWalletMode = detail.mode === "wallet";
                    const walletBalance =
                      wallets.find((w) => w.id === selectedWallet)
                        ?.remaining_price_benefits || 0;
                    const totalAmount =
                      Math.round(
                        (finalTotalAppointmentAmountAfterTaxDiscount +
                          finalTotalProductSellAmountAfterDiscountTax) *
                          100,
                      ) / 100;
                    const isLastField =
                      index === splitPaymentDetails.length - 1;

                    // Get method name from paymentMethods for dynamic options
                    const methodInfo = paymentMethods.find(
                      (m) => m.type === detail.mode,
                    );
                    const displayName = methodInfo
                      ? `${methodInfo.name} - ${methodInfo.type}`
                      : detail.mode;

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-1/3">
                          <TextField
                            label={`${displayName} Amount${
                              isWalletMode
                                ? ` (Max: ₹${
                                    Math.round(walletBalance * 100) / 100
                                  })`
                                : ""
                            }`}
                            type="number"
                            variant="standard"
                            fullWidth
                            value={detail.amount}
                            onChange={(e) => {
                              const newAmount = parseFloat(e.target.value) || 0;
                              const roundedAmount =
                                Math.round(newAmount * 100) / 100;

                              // Validation checks
                              if (isWalletMode && roundedAmount > walletBalance)
                                return;
                              if (roundedAmount > totalAmount) return;

                              // Update only the current field
                              const updatedDetails = [...splitPaymentDetails];
                              updatedDetails[index].amount = roundedAmount;

                              setSplitPaymentDetails(updatedDetails);

                              // Calculate total paid
                              const totalPaid = updatedDetails.reduce(
                                (sum, d) => sum + d.amount,
                                0,
                              );
                              setAmountPaid(Math.round(totalPaid * 100) / 100);

                              // Update payment status
                              if (totalPaid >= totalAmount)
                                setPaymentStatus("paid");
                              else if (totalPaid > 0 && totalPaid < totalAmount)
                                setPaymentStatus("partial");
                              else if (totalPaid === 0)
                                setPaymentStatus("unpaid");
                            }}
                          />
                        </div>
                        <Typography
                          variant="body2"
                          className="text-gray-600 min-w-20"
                        >
                          {displayName}
                          {isWalletMode &&
                            ` (Balance: ₹${
                              Math.round(walletBalance * 100) / 100
                            })`}
                        </Typography>

                        {/* MANUAL AUTO-FILL REMAINING BUTTON - Only fills current field */}
                        {isLastField && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const totalAmount =
                                Math.round(
                                  (finalTotalAppointmentAmountAfterTaxDiscount +
                                    finalTotalProductSellAmountAfterDiscountTax) *
                                    100,
                                ) / 100;
                              const currentTotal = splitPaymentDetails.reduce(
                                (sum, d) => sum + d.amount,
                                0,
                              );
                              const remainingAmount = Math.max(
                                0,
                                totalAmount - currentTotal,
                              );

                              if (remainingAmount > 0) {
                                const updatedDetails = [...splitPaymentDetails];

                                if (isWalletMode) {
                                  // For wallet, use minimum of remaining amount and wallet balance
                                  updatedDetails[index].amount =
                                    Math.round(
                                      Math.min(
                                        updatedDetails[index].amount +
                                          remainingAmount,
                                        walletBalance,
                                      ) * 100,
                                    ) / 100;
                                } else {
                                  // For other modes, add the full remaining amount to THIS FIELD ONLY
                                  updatedDetails[index].amount =
                                    Math.round(
                                      (updatedDetails[index].amount +
                                        remainingAmount) *
                                        100,
                                    ) / 100;
                                }

                                setSplitPaymentDetails(updatedDetails);

                                const totalPaid = updatedDetails.reduce(
                                  (sum, d) => sum + d.amount,
                                  0,
                                );
                                setAmountPaid(
                                  Math.round(totalPaid * 100) / 100,
                                );
                                if (totalPaid >= totalAmount)
                                  setPaymentStatus("paid");
                              }
                            }}
                            disabled={
                              splitPaymentDetails.reduce(
                                (sum, d) => sum + d.amount,
                                0,
                              ) >= totalAmount ||
                              (isWalletMode && walletBalance <= 0)
                            }
                          >
                            Fill Remaining
                          </Button>
                        )}
                      </div>
                    );
                  })}

                  {/* Validation Summary */}
                  {splitPaymentDetails.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <div className="flex justify-between text-sm">
                        <span>Total Paid:</span>
                        <span className="font-semibold">
                          ₹
                          {Math.round(
                            splitPaymentDetails.reduce(
                              (sum, d) => sum + d.amount,
                              0,
                            ) * 100,
                          ) / 100}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Final Amount:</span>
                        <span className="font-semibold">
                          ₹
                          {Math.round(
                            (finalTotalAppointmentAmountAfterTaxDiscount +
                              finalTotalProductSellAmountAfterDiscountTax) *
                              100,
                          ) / 100}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining Amount:</span>
                        <span
                          className={`font-semibold ${
                            splitPaymentDetails.reduce(
                              (sum, d) => sum + d.amount,
                              0,
                            ) <
                            Math.round(
                              (finalTotalAppointmentAmountAfterTaxDiscount +
                                finalTotalProductSellAmountAfterDiscountTax) *
                                100,
                            ) /
                              100
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          ₹
                          {Math.round(
                            (Math.round(
                              (finalTotalAppointmentAmountAfterTaxDiscount +
                                finalTotalProductSellAmountAfterDiscountTax) *
                                100,
                            ) /
                              100 -
                              splitPaymentDetails.reduce(
                                (sum, d) => sum + d.amount,
                                0,
                              )) *
                              100,
                          ) / 100}
                        </span>
                      </div>

                      {splitPaymentDetails.reduce(
                        (sum, d) => sum + d.amount,
                        0,
                      ) <
                        Math.round(
                          (finalTotalAppointmentAmountAfterTaxDiscount +
                            finalTotalProductSellAmountAfterDiscountTax) *
                            100,
                        ) /
                          100 && (
                        <Alert severity="warning" className="mt-1">
                          Amount not fully allocated. Remaining amount will be
                          added to due.
                        </Alert>
                      )}

                      {splitPaymentDetails.reduce(
                        (sum, d) => sum + d.amount,
                        0,
                      ) >
                        Math.round(
                          (finalTotalAppointmentAmountAfterTaxDiscount +
                            finalTotalProductSellAmountAfterDiscountTax) *
                            100,
                        ) /
                          100 && (
                        <Alert severity="error" className="mt-1">
                          Total paid amount exceeds final amount! Please adjust
                          the amounts.
                        </Alert>
                      )}
                    </div>
                  )}
                </div>

                {/* QUICK ACTION BUTTONS */}
                {splitPaymentDetails.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const totalAmount =
                          Math.round(
                            (finalTotalAppointmentAmountAfterTaxDiscount +
                              finalTotalProductSellAmountAfterDiscountTax) *
                              100,
                          ) / 100;
                        const nonWalletDetails = splitPaymentDetails.filter(
                          (d) => d.mode !== "wallet",
                        );
                        const walletDetail = splitPaymentDetails.find(
                          (d) => d.mode === "wallet",
                        );

                        const walletBalance =
                          wallets.find((w) => w.id === selectedWallet)
                            ?.remaining_price_benefits || 0;
                        const walletMaxAmount = walletDetail
                          ? Math.min(totalAmount, walletBalance)
                          : 0;

                        let remainingForNonWallet =
                          totalAmount - walletMaxAmount;
                        const equalAmount =
                          nonWalletDetails.length > 0
                            ? remainingForNonWallet / nonWalletDetails.length
                            : 0;

                        const updatedDetails = splitPaymentDetails.map(
                          (detail) => {
                            if (detail.mode === "wallet") {
                              return {
                                ...detail,
                                amount: Math.round(walletMaxAmount * 100) / 100,
                              };
                            } else {
                              return {
                                ...detail,
                                amount: Math.round(equalAmount * 100) / 100,
                              };
                            }
                          },
                        );

                        setSplitPaymentDetails(updatedDetails);
                        const totalPaid = updatedDetails.reduce(
                          (sum, d) => sum + d.amount,
                          0,
                        );
                        setAmountPaid(totalPaid);
                        setPaymentStatus(
                          totalPaid >= totalAmount ? "paid" : "partial",
                        );
                      }}
                    >
                      DISTRIBUTE EQUALLY
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        if (isWalletApplied && selectedWallet) {
                          const walletBalance =
                            wallets.find((w) => w.id === selectedWallet)
                              ?.remaining_price_benefits || 0;
                          const totalAmount =
                            Math.round(
                              (finalTotalAppointmentAmountAfterTaxDiscount +
                                finalTotalProductSellAmountAfterDiscountTax) *
                                100,
                            ) / 100;
                          const walletAmount = Math.min(
                            walletBalance,
                            totalAmount,
                          );

                          const updatedDetails = splitPaymentDetails.map(
                            (detail) => ({
                              ...detail,
                              amount:
                                detail.mode === "wallet"
                                  ? Math.round(walletAmount * 100) / 100
                                  : 0,
                            }),
                          );

                          setSplitPaymentDetails(updatedDetails);
                          const totalPaid = updatedDetails.reduce(
                            (sum, d) => sum + d.amount,
                            0,
                          );
                          setAmountPaid(totalPaid);
                          setPaymentStatus(
                            totalPaid >= totalAmount ? "paid" : "partial",
                          );
                        }
                      }}
                      disabled={!isWalletApplied || !selectedWallet}
                    >
                      USE MAX WALLET
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const totalAmount =
                          Math.round(
                            (finalTotalAppointmentAmountAfterTaxDiscount +
                              finalTotalProductSellAmountAfterDiscountTax) *
                              100,
                          ) / 100;
                        const nonWalletDetails = splitPaymentDetails.filter(
                          (d) => d.mode !== "wallet",
                        );
                        const walletDetail = splitPaymentDetails.find(
                          (d) => d.mode === "wallet",
                        );

                        let remainingAmount = totalAmount;
                        const updatedDetails = [...splitPaymentDetails];

                        // First fill wallet if present
                        if (walletDetail) {
                          const walletBalance =
                            wallets.find((w) => w.id === selectedWallet)
                              ?.remaining_price_benefits || 0;
                          const walletAmount = Math.min(
                            walletBalance,
                            remainingAmount,
                          );
                          const walletIndex = updatedDetails.findIndex(
                            (d) => d.mode === "wallet",
                          );
                          updatedDetails[walletIndex].amount =
                            Math.round(walletAmount * 100) / 100;
                          remainingAmount -= walletAmount;
                        }

                        // Distribute remaining equally among non-wallet methods
                        if (
                          nonWalletDetails.length > 0 &&
                          remainingAmount > 0
                        ) {
                          const equalAmount =
                            remainingAmount / nonWalletDetails.length;
                          nonWalletDetails.forEach((detail, idx) => {
                            const detailIndex = updatedDetails.findIndex(
                              (d) => d.mode === detail.mode,
                            );
                            updatedDetails[detailIndex].amount =
                              Math.round(equalAmount * 100) / 100;
                          });
                        }

                        setSplitPaymentDetails(updatedDetails);
                        const totalPaid = updatedDetails.reduce(
                          (sum, d) => sum + d.amount,
                          0,
                        );
                        setAmountPaid(totalPaid);
                        setPaymentStatus("paid");
                      }}
                    >
                      FILL ALL
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        const updatedDetails = splitPaymentDetails.map(
                          (detail) => ({
                            ...detail,
                            amount: 0,
                          }),
                        );
                        setSplitPaymentDetails(updatedDetails);
                        setAmountPaid(0);
                        setPaymentStatus("unpaid");
                      }}
                    >
                      CLEAR ALL
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Wallet Alert */}
            {isWalletApplied && selectedWallet && (
              <div className="w-full col-span-2 mt-1">
                <Alert
                  severity={
                    wallets.find((w) => w.id === selectedWallet)
                      ?.remaining_price_benefits === 0
                      ? "error"
                      : "info"
                  }
                  className="text-sm py-1"
                >
                  Wallet Balance: ₹
                  {Math.round(
                    (wallets.find((w) => w.id === selectedWallet)
                      ?.remaining_price_benefits || 0) * 100,
                  ) / 100}
                  {wallets.find((w) => w.id === selectedWallet)
                    ?.remaining_price_benefits === 0 && " - Please recharge"}
                </Alert>
              </div>
            )}
          </>
        )}

        <div className="col-span-2 flex w-full justify-between items-center">
          {/* Previous button */}
          <button
            className={`block border border-black text-black py-2 rounded-md px-4 w-fit ${
              activeStep === "Customer Details"
                ? "cursor-not-allowed opacity-30"
                : ""
            }`}
            onClick={() => {
              if (activeStep === "Service Details") {
                setActiveStep("Customer Details");
              } else if (activeStep === "Product Consumption") {
                setActiveStep("Service Details");
              } else if (activeStep === "Purchase Product") {
                setActiveStep("Product Consumption");
              } else if (activeStep === "Checkout") {
                setActiveStep("Purchase Product");
              }
            }}
            disabled={activeStep === "Customer Details"}
          >
            Previous
          </button>

          {/* Checkout button - only visible on Checkout step */}
          <button
            className={`
    block py-2 rounded-md px-6 w-fit font-medium transition-all flex items-center justify-center gap-2 min-w-[160px]
    ${activeStep === "Checkout" ? "visible" : "invisible"}
    ${
      !paymentStatus || isCheckingOut
        ? "bg-gray-400 cursor-not-allowed text-white opacity-70"
        : "bg-black text-white hover:bg-gray-800"
    }
  `}
            onClick={handleFinalCheckout}
            disabled={!paymentStatus || isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Checking out...
              </>
            ) : (
              "Checkout"
            )}
          </button>

          <button
            className={`block border py-2 rounded-md px-4 w-fit transition-all ${
              activeStep === "Product Consumption"
                ? "bg-green-500 text-white border-green-500"
                : "border-black text-black"
            } ${
              // Customer Details validation
              (activeStep === "Customer Details" &&
                (!customerPhone ||
                  !customerName ||
                  !customerGender ||
                  !selectedManager)) ||
              // Service Details validation - at least one service or offer must be selected
              (activeStep === "Service Details" &&
                (services.length === 0 ||
                  services.every((service) => !service.id)) &&
                (selectedOffers.length === 0 ||
                  selectedOffers.every((offer) => !offer.id))) ||
              // Other conditions
              activeStep === "Checkout" ||
              isLoadingProducts ||
              isSubmitting ||
              isUpdatingWallet
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
            onClick={handleNextButton}
            disabled={
              // Customer Details validation
              (activeStep === "Customer Details" &&
                (!customerPhone ||
                  !customerName ||
                  !customerGender ||
                  !selectedManager)) ||
              // Service Details validation - at least one service or offer must be selected
              (activeStep === "Service Details" &&
                (services.length === 0 ||
                  services.every((service) => !service.id)) &&
                (selectedOffers.length === 0 ||
                  selectedOffers.every((offer) => !offer.id))) ||
              // Other conditions
              activeStep === "Checkout" ||
              isLoadingProducts ||
              isSubmitting ||
              isUpdatingWallet
            }
          >
            {activeStep === "Product Consumption"
              ? "Book Appointment & Next"
              : "Next"}
          </button>
        </div>
      </div>

      {invoicePage && (
        <>
          <ToastContainer />
          <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-green-600"
                  >
                    {appointment?.appointment_status?.charAt(0).toUpperCase() +
                      appointment?.appointment_status?.slice(1) || "Completed"}
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    startIcon={
                      <img
                        src={whatsapp_image}
                        alt="WhatsApp"
                        className="w-5 h-5"
                      />
                    }
                    onClick={sendWhatsAppInvoice}
                  >
                    Send On WhatsApp
                  </Button>
                </div>
              </div>

              {/* Invoice Title */}
              <div className="text-center mb-6">
                <Typography variant="h4" className="font-bold">
                  Invoice
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  • {vendorData?.salon_name || "Salon"}
                </Typography>
              </div>

              {/* Customer Details */}
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold">
                  {appointment?.customer_name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {appointment?.customer_phone}
                  {appointment?.customer_email &&
                    ` • ${appointment.customer_email}`}
                </Typography>
                {membershipUsed !== "N/A" && (
                  <Typography variant="body2" className="mt-2">
                    Membership: {membershipUsed}
                  </Typography>
                )}
              </div>

              <Divider className="my-4" />

              {/* Services */}
              {services.filter((s) => s.id).length > 0 && (
                <div className="mb-4">
                  <Typography variant="h6" className="font-semibold mb-2">
                    Services
                  </Typography>
                  {services
                    .filter((s) => s.id)
                    .map((service, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <Typography variant="body1">
                            {service.service_name}
                          </Typography>
                          <Typography variant="body1">
                            ₹{service.discount}
                          </Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                          {formateTime(service.service_time)}
                        </Typography>
                      </div>
                    ))}
                </div>
              )}

              {/* Offers */}
              {selectedOffers.filter((o) => o.id).length > 0 && (
                <div className="mb-4">
                  <Typography variant="h6" className="font-semibold mb-2">
                    Offers
                  </Typography>
                  {selectedOffers
                    .filter((o) => o.id)
                    .map((offer, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between">
                          <Typography variant="body1">
                            {offer.offer_name || offer.name}
                            {offer.staff && offer.staff.length > 0 && (
                              <Typography
                                variant="caption"
                                component="span"
                                className="ml-2 text-gray-500"
                              >
                                (Staff:{" "}
                                {offer.staff
                                  .map((staffId) => {
                                    const staffMember = staffList.find(
                                      (s) => s.id === staffId,
                                    );
                                    return staffMember
                                      ? staffMember.staffname
                                      : "";
                                  })
                                  .filter(Boolean)
                                  .join(", ")}
                                )
                              </Typography>
                            )}
                          </Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                          {formateTime(offer.offer_time)}
                        </Typography>
                      </div>
                    ))}
                </div>
              )}

              {/* Products */}
              {productFormData.product_list.length > 0 && (
                <div className="mb-4">
                  <Typography variant="h6" className="font-semibold mb-2">
                    Products
                  </Typography>
                  {productFormData.product_list.map((product, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between">
                        <Typography variant="body1">
                          {product.product_name}
                        </Typography>
                        <Typography variant="body1">
                          ₹{product.net_sub_total}
                        </Typography>
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        Qty: {product.qauntity} × ₹{product.price_per_unit}
                        {product.discount > 0 &&
                          ` - Discount: ₹${product.discount}`}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}

              <Divider className="my-4" />

              {/* Totals */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <Typography variant="body1">Subtotal (Services):</Typography>
                  <Typography variant="body1">₹ {totalFinalAmount}</Typography>
                </div>
                <div className="flex justify-between mb-2">
                  <Typography variant="body1">Subtotal (Products):</Typography>
                  <Typography variant="body1">
                    ₹ {productFormData.final_total}
                  </Typography>
                </div>
                {calculatedTaxAmount > 0 && (
                  <div className="flex justify-between mb-2">
                    <Typography variant="body1">
                      {vendorData?.tax_percent
                        ? `Tax (${vendorData.tax_percent}%)`
                        : vendorData?.tax_amount
                        ? "Tax"
                        : "Tax"}
                      :
                    </Typography>
                    <Typography variant="body1">
                      ₹ {calculatedTaxAmount}
                    </Typography>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <Typography variant="body1" className="font-semibold">
                    Total:
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    ₹ {finalAmountWithTax}
                  </Typography>
                </div>
                <div className="flex justify-between mb-2">
                  <Typography variant="body1">Amount Paid:</Typography>
                  <Typography variant="body1">₹{amountPaid}</Typography>
                </div>

                {creditAmount > 0 && (
                  <div className="flex justify-between mb-2">
                    <Typography variant="body1">Credit Amount:</Typography>
                    <Typography variant="body1">₹ {creditAmount}</Typography>
                  </div>
                )}

                {/* Conditional Payment Method Display */}
                {/* Conditional Payment Method Display */}
                {!splitPaymentMode || splitPaymentDetails.length === 0 ? (
                  // Single Payment Mode Display
                  <>
                    <div className="flex justify-between mb-2">
                      <Typography variant="body1">Payment Method:</Typography>
                      <Typography variant="body1">
                        {(() => {
                          if (
                            paymentMode === "cash" ||
                            paymentMode === "wallet"
                          ) {
                            return (
                              paymentMode.charAt(0).toUpperCase() +
                              paymentMode.slice(1)
                            );
                          }
                          const methodInfo = paymentMethods.find(
                            (m) => m.type === paymentMode,
                          );
                          return methodInfo
                            ? `${methodInfo.name} - ${methodInfo.type}`
                            : paymentMode;
                        })()}
                      </Typography>
                    </div>
                    {paymentMode && amountPaid > 0 && (
                      <div className="flex justify-between mb-2">
                        <Typography variant="body1">
                          {(() => {
                            if (
                              paymentMode === "cash" ||
                              paymentMode === "wallet"
                            ) {
                              return `${
                                paymentMode.charAt(0).toUpperCase() +
                                paymentMode.slice(1)
                              } Amount:`;
                            }
                            const methodInfo = paymentMethods.find(
                              (m) => m.type === paymentMode,
                            );
                            return methodInfo
                              ? `${methodInfo.name} Amount:`
                              : `${paymentMode} Amount:`;
                          })()}
                        </Typography>
                        <Typography variant="body1">₹{amountPaid}</Typography>
                      </div>
                    )}
                  </>
                ) : (
                  // Split Payment Mode Display
                  <div className="mb-4">
                    <Typography variant="h6" className="font-semibold mb-2">
                      Payment Split
                    </Typography>
                    {splitPaymentDetails.map((detail, index) => {
                      const methodInfo = paymentMethods.find(
                        (m) => m.type === detail.mode,
                      );
                      const displayName = methodInfo
                        ? `${methodInfo.name} - ${methodInfo.type}`
                        : detail.mode;

                      return (
                        <div key={index} className="flex justify-between mb-1">
                          <Typography variant="body1">
                            {displayName}:
                          </Typography>
                          <Typography variant="body1">
                            ₹{detail.amount.toFixed(2)}
                          </Typography>
                        </div>
                      );
                    })}
                    <div className="flex justify-between mt-2 pt-2 border-t">
                      <Typography variant="body1" className="font-semibold">
                        Total Paid:
                      </Typography>
                      <Typography variant="body1" className="font-semibold">
                        ₹
                        {splitPaymentDetails
                          .reduce((sum, d) => sum + d.amount, 0)
                          .toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mb-2">
                  <Typography variant="body1">Payment Status:</Typography>
                  <Typography variant="body1" className="capitalize">
                    {paymentStatus}
                  </Typography>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex justify-center mt-6">
                <Button variant="contained" onClick={closeDrawer}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-product-modal-title"
      >
        <Box sx={style}>
          <h2 id="edit-product-modal-title" className="text-xl font-bold mb-4">
            Edit Product
          </h2>

          {editProductData && (
            <div className="flex flex-col gap-4">
              {/* ── Added Product Name Field ── */}
              <TextField
                label="Product Name"
                value={editProductData.product_name || ""}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    product_name: e.target.value,
                  })
                }
                fullWidth
                placeholder="e.g. Hair Care Serum"
              />

              <TextField
                label="Quantity"
                type="number"
                value={editProductData.quantity ?? ""} // fixed typo
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                fullWidth
              />

              <TextField
                label="Price per Unit"
                type="number"
                value={editProductData.price_per_unit ?? ""}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    price_per_unit: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth
              />

              <TextField
                label="Discount"
                type="number"
                value={editProductData.discount ?? ""}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    discount: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Discount Unit</InputLabel>
                <Select
                  value={editProductData.discount_unit || "percentage"}
                  label="Discount Unit"
                  onChange={(e) =>
                    setEditProductData({
                      ...editProductData,
                      discount_unit: e.target.value,
                    })
                  }
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Tax"
                type="number"
                value={editProductData.tax ?? ""}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    tax: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth
              />

              <Button
                variant="contained"
                onClick={() => {
                  const qty = editProductData.quantity || 0;
                  const price = editProductData.price_per_unit || 0;
                  const disc = editProductData.discount || 0;
                  const isPercent =
                    editProductData.discount_unit === "percentage";

                  const discountAmount = isPercent
                    ? (qty * price * disc) / 100
                    : disc;

                  handleProductEdit({
                    ...editProductData,
                    net_sub_total: qty * price - discountAmount,
                  });
                }}
                fullWidth
              >
                Update Product
              </Button>
            </div>
          )}
        </Box>
      </Modal>

      <Modal
        open={openMembershipModal}
        onClose={() => setOpenMembershipModal(false)}
        aria-labelledby="membership-details-modal"
        aria-describedby="membership-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedMembershipDetails && (
            <>
              <div className="flex justify-between items-center mb-2">
                <h2 id="membership-details-modal" className="text-xl font-bold">
                  Membership Details
                </h2>
                <IconButton onClick={() => setOpenMembershipModal(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              <Divider className="my-3 mb-2" />

              <div className="space-y-5">
                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Membership Code :</div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.membership_code}{" "}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Customer Name :</div>{" "}
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.customer_name ||
                        "No Customer Name Available"}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Customer Phone :</div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.customer_number}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Membership Price :</div>
                    <Typography className="font-normal text-gray-600">
                      ₹ {selectedMembershipDetails.membership_price || 0}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">
                      Amount Paid By Customer :
                    </div>
                    <Typography className="font-normal text-gray-600">
                      ₹ {selectedMembershipDetails.amount_paid || 0}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Discount Percentage :</div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.membership_data
                        .discount_percentage || 0}
                      %
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">Validity :</div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.membership_data
                        .validity_in_month || "No Data Of Validity"}{" "}
                      Months
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-row gap-2">
                    <div className="font-semibold">Terms And Conditions :</div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.terms_and_conditions.replace(
                        /<[^>]*>/g,
                        "",
                      ) || "Not Available T&C"}
                    </Typography>
                  </Typography>
                </div>

                <div>
                  <Typography className="flex flex-raw gap-2">
                    <div className="font-semibold">
                      Applied to All Services :
                    </div>
                    <Typography className="font-normal text-gray-600">
                      {selectedMembershipDetails.membership_data.whole_service
                        ? "Yes"
                        : "No"}
                    </Typography>
                  </Typography>
                </div>

                {!selectedMembershipDetails.membership_data.whole_service && (
                  <div>
                    <Typography className="flex flex-raw gap-2 mb-2">
                      <div className="font-semibold">Included Services :</div>
                      <List dense>
                        {selectedMembershipDetails.membership_data.included_services.map(
                          (serviceId, index) => {
                            const service = allServices.find(
                              (s) => s.id === serviceId,
                            );
                            return (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <LoyaltyIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    service
                                      ? service.service_name
                                      : `Service #${serviceId}`
                                  }
                                  secondary={service ? `₹${service.price}` : ""}
                                />
                              </ListItem>
                            );
                          },
                        )}
                      </List>
                    </Typography>
                  </div>
                )}
              </div>

              <Divider className="my-4" />

              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenMembershipModal(false)}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Wallet Details Modal */}
      <Modal
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        aria-labelledby="wallet-details-modal"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 id="wallet-details-modal" className="text-xl font-bold">
              Wallet Details
            </h2>
            <IconButton onClick={() => setOpenWalletModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          {walletDetails && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Wallet Name:
                </Typography>
                <Typography variant="body2">
                  {walletDetails.wallet_name}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Customer:
                </Typography>
                <Typography variant="body2">
                  {walletDetails.customer_name}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Phone:
                </Typography>
                <Typography variant="body2">
                  {walletDetails.customer_phone}
                </Typography>
              </div>
              {/* <div className="flex justify-between">
                          <Typography variant="body2" className="font-semibold">
                            Purchase Price:
                          </Typography>
                          <Typography variant="body2">
                            ₹{walletDetails.purchase_price}
                          </Typography>
                        </div> */}
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Total Benefits:
                </Typography>
                <Typography variant="body2">
                  ₹{walletDetails.total_price_benefits}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Remaining Benefits:
                </Typography>
                <Typography
                  variant="body2"
                  className="font-semibold text-green-600"
                >
                  ₹{walletDetails.remaining_price_benefits}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Amount Paid:
                </Typography>
                <Typography variant="body2">
                  ₹{walletDetails.amount_paid}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Remaining Amount:
                </Typography>
                <Typography variant="body2">
                  ₹{walletDetails.remaining_amount_to_paid}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" className="font-semibold">
                  Valid Until:
                </Typography>
                <Typography variant="body2">
                  {new Date(walletDetails.end_date).toLocaleDateString()}
                </Typography>
              </div>
              {walletDetails.Benefits &&
                typeof walletDetails.Benefits === "object" && (
                  <div className="mt-2">
                    <Typography variant="body2" className="font-semibold mb-1">
                      Benefits:
                    </Typography>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      {Object.values(walletDetails.Benefits).map(
                        (benefit, index) => (
                          <li key={index} className="flex items-center">
                            <span className="ml-1 text-sm">{benefit}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Checkout;