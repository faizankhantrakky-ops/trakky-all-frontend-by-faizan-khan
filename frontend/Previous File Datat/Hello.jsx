import React, { useContext, useEffect, useState, useRef } from "react";
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
  FormControlLabel,
  ListItemText,
} from "@mui/material";
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
import { Checkbox } from "@mui/material";
import whatsapp_image from "../../assets/whatsapp_logo.png";
import InfoIcon from "@mui/icons-material/Info";

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

const EditAppointment = ({
  appointment,
  handleToastMessage,
  closeDrawer,
  setAppointmentData,
}) => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [membershipUsed, setMembershipUsed] = useState("N/A");
  const [membershipData, setMembershipData] = useState([]);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(
    appointment?.due_amount || 0
  );
  const [dueAmount, setDueAmount] = useState(appointment?.due_amount || 0);
  const [creditAmount, setCreditAmount] = useState(
    appointment?.credit_amount || 0
  );
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [customerName, setCustomerName] = useState(appointment?.customer_name);
  const [customerPhone, setCustomerPhone] = useState(
    appointment?.customer_phone
  );
  const [customerType, setCustomerType] = useState(appointment?.customer_type);
  const [customerEmail, setCustomerEmail] = useState(
    appointment?.customer_email
  );
  const [totalFinalAmount, setTotalFinalAmount] = useState(
    appointment?.final_amount
  );
  const [amountPaid, setAmountPaid] = useState(appointment?.amount_paid);
  const [paymentStatus, setPaymentStatus] = useState(
    appointment?.payment_status
  );
  const [paymentMode, setPaymentMode] = useState(appointment?.payment_mode);

  const [page, setPage] = useState(1);
  const [activeStep, setActiveStep] = useState("Customer Details");
  const [InUseProductData, setInUseProductData] = useState([]);
  // In your useState initialization (around line 100):
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

  const [appointmentDiscountPercentage, setAppointmentDiscountPercentage] = useState(0);
  const [appointmentTaxPercentage, setAppointmentTaxPercentage] = useState(0);
  const [productDiscountPercentage, setProductDiscountPercentage] = useState(0);
  const [productTaxPercentage, setProductTaxPercentage] = useState(0);
  
  // Calculated amounts
  
  // Add these state variables to your component
  // Tax states - automatically set from vendor data
  
  // Discount states (user input)
  const [appointmentDiscountType, setAppointmentDiscountType] = useState('percentage');
  const [appointmentDiscountValue, setAppointmentDiscountValue] = useState(0);
  const [productDiscountType, setProductDiscountType] = useState('percentage');
  const [productDiscountValue, setProductDiscountValue] = useState(0);
  
  // Calculated amounts
  const [appointmentDiscountAmount, setAppointmentDiscountAmount] = useState(0);
  const [productDiscountAmount, setProductDiscountAmount] = useState(0);
  
  // Final calculated amounts
  const [finalTotalAppointmentAmountAfterDiscount, setFinalTotalAppointmentAmountAfterDiscount] = useState(0);
  const [finalTotalProductSellAmountAfterDiscount, setFinalTotalProductSellAmountAfterDiscount] = useState(0);
  const [finalTotalAppointmentAmountAfterTaxDiscount, setFinalTotalAppointmentAmountAfterTaxDiscount] = useState(0);
  const [finalTotalProductSellAmountAfterDiscountTax, setFinalTotalProductSellAmountAfterDiscountTax] = useState(0);

 const [actualAmount, setActualAmount] = useState(0);
const [combinedDiscountPercentage, setCombinedDiscountPercentage] = useState(0);
const [combinedDiscountAmount, setCombinedDiscountAmount] = useState(0);
const [combinedTaxPercentage, setCombinedTaxPercentage] = useState(0);
const [combinedTaxAmount, setCombinedTaxAmount] = useState(0);


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
  const [createdSaleId, setCreatedSaleId] = useState(null);
  const [offerStaffContributions, setOfferStaffContributions] = useState({});
  // const [taxEnabled, setTaxEnabled] = useState(false);
  // const [taxType, setTaxType] = useState("percentage");
  // const [taxValue, setTaxValue] = useState(0);
  // const [taxAmount, setTaxAmount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage"); // "percentage" or "amount"
  const [discountValue, setDiscountValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [calculatedTaxAmount, setCalculatedTaxAmount] = useState(0);

  const [splitPaymentMode, setSplitPaymentMode] = useState(false);
  const [splitPaymentDetails, setSplitPaymentDetails] = useState([]);
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);

  // Get tax settings from vendorData
  const taxEnabled = vendorData?.is_gst || false;
  const taxType = vendorData?.tax_percent
    ? "percentage"
    : vendorData?.tax_amount
    ? "amount"
    : "percentage";
  const taxValue = vendorData?.tax_percent || vendorData?.tax_amount || 0;

  const [productFormData, setProductFormData] = useState({
    product_list: [],
    customerName: appointment?.customer_name || "",
    customerNumber: appointment?.customer_phone || "",
    final_total: 0,
  });

  const [wallets, setWallets] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(
    appointment?.customer_wallet || null
  );
  const [walletDetails, setWalletDetails] = useState(null);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [isWalletApplied, setIstWalletApplied] = useState(
    appointment?.is_wallet_applied || false
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
        `https://trakky.in:8000/salonvendor/wallets/?customer_phone=${phoneNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        }
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
        `https://trakky.in:8000/salonvendor/wallets/${walletId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            remaining_price_benefits: integerBalance,
          }),
        }
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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          `https://trakky.in:8000/salonvendor/staff/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStaffList(data);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [authTokens]);

  // useEffect(() => {
  //   if (appointment?.staff_contributions) {
  //     const contributions = {};

  //     appointment.staff_contributions.forEach(contribution => {
  //       contributions[contribution.service_id] = contribution.staff_distribution;
  //     });

  //     setStaffContributions(contributions);
  //   }
  // }, [appointment]);

  // Add this useEffect to properly initialize staff assignments
  // Add this useEffect to properly initialize staff assignments for both services and offers
  useEffect(() => {
    if (appointment?.staff_contributions) {
      const serviceContributions = {};
      const offerContributions = {};

      appointment.staff_contributions.forEach((contribution) => {
        if (contribution.service_id) {
          serviceContributions[contribution.service_id] =
            contribution.staff_distribution.map((dist) => ({
              ...dist,
              staff_name: dist.staff_name || getStaffName(dist.staff_id),
              staff_role: dist.staff_role || "Unknown",
            }));

          // Also update the service staff array
          setServices((prevServices) =>
            prevServices.map((service) => {
              if (service.id === contribution.service_id) {
                return {
                  ...service,
                  staff: contribution.staff_distribution.map(
                    (dist) => dist.staff_id
                  ),
                };
              }
              return service;
            })
          );
        } else if (contribution.offer_id) {
          offerContributions[contribution.offer_id] =
            contribution.staff_distribution.map((dist) => ({
              ...dist,
              staff_name: dist.staff_name || getStaffName(dist.staff_id),
              staff_role: dist.staff_role || "Unknown",
            }));

          // Also update the offer staff array
          setSelectedOffers((prevOffers) =>
            prevOffers.map((offer) => {
              if (offer.id === contribution.offer_id) {
                return {
                  ...offer,
                  staff: contribution.staff_distribution.map(
                    (dist) => dist.staff_id
                  ),
                };
              }
              return offer;
            })
          );
        }
      });

      setStaffContributions(serviceContributions);
      setOfferStaffContributions(offerContributions);
    }
  }, [appointment, staffList]);

  const validateStaffContributions = (id, contributions, isOffer = false) => {
    const totalPercentage = contributions.reduce(
      (sum, contrib) => sum + contrib.percent,
      0
    );
    return totalPercentage === 100;
  };

  const handleStaffPercentageChange = (serviceId, staffId, newValue) => {
    setStaffContributions((prev) => {
      const updatedContributions = { ...prev };

      if (!updatedContributions[serviceId]) {
        // Initialize if not exists
        updatedContributions[serviceId] = [];
      }

      const existingIndex = updatedContributions[serviceId].findIndex(
        (contrib) => contrib.staff_id === staffId
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
        updatedContributions[serviceId]
      );

      setStaffContributionErrors((prev) => ({
        ...prev,
        [serviceId]: !isValid,
      }));

      return updatedContributions;
    });
  };

  // When adding a staff member to a service
  const addStaffToService = (serviceId, staffId) => {
    setStaffContributions((prev) => {
      const currentStaff = prev[serviceId] || [];
      const newStaffList = [...currentStaff, { staff_id: staffId, percent: 0 }];

      // If this is the first staff member being added, set to 100%
      if (newStaffList.length === 1) {
        newStaffList[0].percent = 100;
      }

      return {
        ...prev,
        [serviceId]: newStaffList,
      };
    });
  };

  // When removing a staff member from a service
  const removeStaffFromService = (serviceId, staffIdToRemove) => {
    setStaffContributions((prev) => {
      const currentStaff = prev[serviceId] || [];
      const newStaffList = currentStaff.filter(
        (contrib) => contrib.staff_id !== staffIdToRemove
      );

      // If only one staff member remains after removal, set to 100%
      if (newStaffList.length === 1) {
        newStaffList[0].percent = 100;
      }

      return {
        ...prev,
        [serviceId]: newStaffList,
      };
    });
  };

  const handleOfferStaffPercentageChange = (offerId, staffId, percentage) => {
    setOfferStaffContributions((prev) => {
      const newContributions = { ...prev };
      const staff = staffList.find((s) => s.id === staffId);

      if (!newContributions[offerId]) {
        newContributions[offerId] = [];
      }

      const existingIndex = newContributions[offerId].findIndex(
        (item) => item.staff_id === staffId
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
        true
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
        `https://trakky.in:8000/salonvendor/generate-invoice/${appointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
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

        handleToastMessage("Invoice downloaded successfully", "success");
      } else {
        handleToastMessage("Failed to generate invoice", "error");
      }
    } catch (error) {
      handleToastMessage("Error generating invoice", "error");
      console.error("Error generating invoice:", error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const sendWhatsAppInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      // First, generate the invoice to get the URL
      const invoiceResponse = await fetch(
        `https://trakky.in:8000/salonvendor/generate-invoice-details/${appointment.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();

        // Prepare the WhatsApp payload
        const whatsappPayload = {
          phone_numbers: [`91${appointment.customer_phone}`],
          filename: `invoice_${appointment.id}`,
          file_url: data.invoice_url,
          body_values: [
            appointment.customer_name,
            "Appointment",
            vendorData?.salon_name,
            vendorData?.salon_name,
          ],
        };

        // Send invoice via WhatsApp
        const whatsappResponse = await fetch(
          "https://trakky.in:8000/salonvendor/send-invoice-whatsapp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
            body: JSON.stringify(whatsappPayload),
          }
        );

        if (whatsappResponse.ok) {
          toast.success("Invoice sent successfully via WhatsApp!", "success");
          setOpenModal(false);
        } else {
          throw new Error("Failed to send invoice via WhatsApp");
        }
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      toast.error("Error sending invoice via WhatsApp", "error");
      console.error("Error sending invoice via WhatsApp:", error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://trakky.in:8000/salonvendor/selling-inventory/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        }
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
        .includes(searchProductTerm.toLowerCase())
  );

  // Calculate product totals
  useEffect(() => {
    const productTotal = productFormData.product_list.reduce(
      (total, product) => total + (product.net_sub_total || 0),
      0
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
        : product
    );

    setProductFormData((prev) => ({
      ...prev,
      product_list: updatedList,
    }));
    setOpenEditModal(false);
  };

  const handleSellProduct = async () => {
    try {
      const response = await fetch(
        "https://trakky.in:8000/salonvendor/sells/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            ...productFormData,
            customer_id: appointment.customer_id,
            customer_name: appointment.customer_name,
            customer_phone: appointment.customer_phone,
            appointment_id: appointment.id,
          }),
        }
      );

      if (response.ok) {
        const saleData = await response.json();
        setCreatedSaleId(saleData.id); // Store the created sale ID
        handleToastMessage("Products sold successfully", "success");
        return saleData.id; // Return the sale ID
      } else {
        handleToastMessage("Failed to sell products", "error");
        return null;
      }
    } catch (error) {
      handleToastMessage("Error selling products", "error");
      console.error("Error selling products:", error);
      return null;
    }
  };

  // Calculate combined total (appointment + products)
  const productTotal = appointment?.selled_product_details
    ? parseFloat(appointment.selled_product_details.final_total)
    : productFormData.final_total || 0;

  const combinedTotal = (parseFloat(totalFinalAmount) || 0) + productTotal;

  const UseInvertoryListData = async () => {
    try {
      const response = await fetch(
        "https://trakky.in:8000/salonvendor/currentuse/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
            "Content-Type": "application/json",
          },
        }
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
    let url = `https://trakky.in:8000/salonvendor/customer-memberships/`;

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
        if (appointment?.membership?.length > 0) {
          let memb = data?.filter(
            (membership) => membership.id === appointment?.membership?.[0]
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
        `https://trakky.in:8000/salons/service/?page=${page}&salon_id=${vendorData?.salon}`,
        {}
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
          `something went wrong while fetching service : ${response.statusText}`
        );
      }
    } catch (error) {
      toast.error(
        `something went wrong while fetching service : ${error.message}`
      );
    } finally {
      setServiceLoading(false);
    }
  };

  const fetchOffers = async () => {
    setOfferLoading(true);

    if (!vendorData?.salon) return;

    let url = `https://trakky.in:8000/salons/salon-profile-offer/?salon_id=${vendorData?.salon}`;

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
        // Find staff specifically assigned to this service from staff_contributions
        const serviceStaff =
          appointment.staff_contributions
            ?.find((contrib) => contrib.service_id === service.service_id)
            ?.staff_distribution?.map((dist) => dist.staff_id) || [];

        return {
          id: service.service_id,
          service_name: service.service_name,
          service_time: service.duration,
          gender: service?.gender,
          discount: service.final_price,
          price: service.actual_price,
          from_membership: service.from_membership,
          membership_id: service.membership_id,
          staff: serviceStaff, // Only staff assigned to this specific service
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
          staff: [],
        },
      ]);
    }

    if (appointment?.included_offers?.length > 0) {
      const appointmentOffers = appointment.included_offers.map((offer) => {
        return {
          id: offer.offer_id,
          name: offer.offer_name,
          offer_time: offer.offer_time,
          actual_price: offer.actual_price,
          discount_price: offer.discounted_price,
          staff: [], // Initialize empty staff for offers
        };
      });

      setSelectedOffers(appointmentOffers);
    } else {
      setSelectedOffers([
        {
          id: "",
          name: "",
          offer_time: "",
          actual_price: "",
          discount_price: "",
          staff: [],
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
    Math.max(0, combinedTotal - discountAmount)
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
    Number(finalAmountAfterDiscount) + Number(calculatedTaxAmount)
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

 

  useEffect(() => {
    if (splitPaymentMode && splitPaymentDetails.length > 0) {
      const totalPaid = splitPaymentDetails.reduce(
        (sum, d) => sum + d.amount,
        0
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

  const taxAppliedRef = useRef(false);

  // Auto-populate staff contributions when staff is assigned to a service
  useEffect(() => {
    services.forEach((service) => {
      if (service.id && service.staff && service.staff.length > 0) {
        // If staff contributions don't exist for this service, create them
        if (!staffContributions[service.id]) {
          const contributions = service.staff.map((staffId) => {
            const staffMember = staffList.find((s) => s.id === staffId);
            return {
              staff_id: staffId,
              staff_name: staffMember?.staffname || `Staff #${staffId}`,
              staff_role: staffMember?.staff_role || "Unknown",
              percent: service.staff.length === 1 ? 100 : 0, // Auto 100% if single staff
            };
          });

          setStaffContributions((prev) => ({
            ...prev,
            [service.id]: contributions,
          }));
        }
      }
    });
  }, [services, staffList]);

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

      // Tax is now handled globally via vendorData, no need to initialize from appointment
    }
  }, [appointment, activeStep]);


  // Tax states - automatically set from vendor data
const [appointmentTaxType, setAppointmentTaxType] = useState('percentage');
const [appointmentTaxValue, setAppointmentTaxValue] = useState(0);
const [productTaxType, setProductTaxType] = useState('percentage');
const [productTaxValue, setProductTaxValue] = useState(0);

// Calculated tax amounts
const [appointmentTaxAmount, setAppointmentTaxAmount] = useState(0);
const [productTaxAmount, setProductTaxAmount] = useState(0);

// Final calculated amounts
const [finalTotalAppointmentAmountAfterTax, setFinalTotalAppointmentAmountAfterTax] = useState(0);
const [finalTotalProductAmountAfterTax, setFinalTotalProductAmountAfterTax] = useState(0);



// UseEffect to automatically set tax values from vendor data
useEffect(() => {
  if (vendorData) {
    console.log("Vendor Data:", vendorData);
    
    // Set Appointment Tax from vendor data
    if (vendorData.is_gst) {
      if (vendorData.tax_percent) {
        setAppointmentTaxType('percentage');
        setAppointmentTaxValue(parseFloat(vendorData.tax_percent));
        console.log("Appointment Tax Percentage:", vendorData.tax_percent);
      } else if (vendorData.tax_amount) {
        setAppointmentTaxType('amount');
        setAppointmentTaxValue(parseFloat(vendorData.tax_amount));
        console.log("Appointment Tax Amount:", vendorData.tax_amount);
      }
    }

    // Set Product Tax from vendor data
    if (vendorData.product_is_gst) {
      if (vendorData.product_tax_percent) {
        setProductTaxType('percentage');
        setProductTaxValue(parseFloat(vendorData.product_tax_percent));
        console.log("Product Tax Percentage:", vendorData.product_tax_percent);
      } else if (vendorData.product_tax_amount) {
        setProductTaxType('amount');
        setProductTaxValue(parseFloat(vendorData.product_tax_amount));
        console.log("Product Tax Amount:", vendorData.product_tax_amount);
      }
    }
  }
}, [vendorData]);

// Calculate tax amounts
const calculateTaxAmounts = () => {
  const appointmentBaseAmount = parseFloat(totalFinalAmount) || 0;
  const productBaseAmount = productFormData.final_total || 0;

  // Calculate appointment tax
  let appointmentTax = 0;
  if (appointmentTaxType === 'percentage') {
    appointmentTax = appointmentBaseAmount * (appointmentTaxValue / 100);
  } else {
    appointmentTax = Math.min(appointmentTaxValue, appointmentBaseAmount);
  }

  // Calculate product tax
  let productTax = 0;
  if (productTaxType === 'percentage') {
    productTax = productBaseAmount * (productTaxValue / 100);
  } else {
    productTax = Math.min(productTaxValue, productBaseAmount);
  }

  // Set tax amounts
  setAppointmentTaxAmount(appointmentTax);
  setProductTaxAmount(productTax);

  // Calculate final amounts after tax
  setFinalTotalAppointmentAmountAfterTax(appointmentBaseAmount + appointmentTax);
  setFinalTotalProductAmountAfterTax(productBaseAmount + productTax);
};

// UseEffect to calculate tax when amounts change
useEffect(() => {
  calculateTaxAmounts();
}, [
  totalFinalAmount,
  productFormData.final_total,
  appointmentTaxType,
  appointmentTaxValue,
  productTaxType,
  productTaxValue
]);




const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// UseEffect to automatically set tax values from vendor data
useEffect(() => {
  if (vendorData) {
    console.log("Vendor Data:", vendorData);
    
    // Set Appointment Tax from vendor data
    if (vendorData.is_gst) {
      if (vendorData.tax_percent) {
        setAppointmentTaxType('percentage');
        setAppointmentTaxValue(parseFloat(vendorData.tax_percent));
        console.log("Appointment Tax Percentage:", vendorData.tax_percent);
      } else if (vendorData.tax_amount) {
        setAppointmentTaxType('amount');
        setAppointmentTaxValue(parseFloat(vendorData.tax_amount));
        console.log("Appointment Tax Amount:", vendorData.tax_amount);
      }
    }

    // Set Product Tax from vendor data
    if (vendorData.product_is_gst) {
      if (vendorData.product_tax_percent) {
        setProductTaxType('percentage');
        setProductTaxValue(parseFloat(vendorData.product_tax_percent));
        console.log("Product Tax Percentage:", vendorData.product_tax_percent);
      } else if (vendorData.product_tax_amount) {
        setProductTaxType('amount');
        setProductTaxValue(parseFloat(vendorData.product_tax_amount));
        console.log("Product Tax Amount:", vendorData.product_tax_amount);
      }
    }
  }
}, [vendorData]);

// Calculate all amounts
useEffect(() => {
  // Calculate actual amount (appointment + product totals)
  const appointmentTotal = parseFloat(totalFinalAmount) || 0;
  const productTotal = productFormData.final_total || 0;
  const actualAmt = appointmentTotal + productTotal;
  setActualAmount(actualAmt);

  // Calculate appointment discount amount
  let apptDiscountAmt = 0;
  if (appointmentDiscountType === 'percentage') {
    apptDiscountAmt = appointmentTotal * (appointmentDiscountValue / 100);
  } else {
    apptDiscountAmt = Math.min(appointmentDiscountValue, appointmentTotal);
  }
  setAppointmentDiscountAmount(apptDiscountAmt);

  // Calculate product discount amount
  let prodDiscountAmt = 0;
  if (productDiscountType === 'percentage') {
    prodDiscountAmt = productTotal * (productDiscountValue / 100);
  } else {
    prodDiscountAmt = Math.min(productDiscountValue, productTotal);
  }
  setProductDiscountAmount(prodDiscountAmt);

  // Calculate appointment tax amount
  let apptTaxAmt = 0;
  const apptAfterDiscount = Math.max(0, appointmentTotal - apptDiscountAmt);
  if (appointmentTaxType === 'percentage') {
    apptTaxAmt = apptAfterDiscount * (appointmentTaxValue / 100);
  } else {
    apptTaxAmt = Math.min(appointmentTaxValue, apptAfterDiscount);
  }
  setAppointmentTaxAmount(apptTaxAmt);

  // Calculate product tax amount
  let prodTaxAmt = 0;
  const prodAfterDiscount = Math.max(0, productTotal - prodDiscountAmt);
  if (productTaxType === 'percentage') {
    prodTaxAmt = prodAfterDiscount * (productTaxValue / 100);
  } else {
    prodTaxAmt = Math.min(productTaxValue, prodAfterDiscount);
  }
  setProductTaxAmount(prodTaxAmt);

  // Set final amounts
  setFinalTotalAppointmentAmountAfterDiscount(apptAfterDiscount);
  setFinalTotalProductSellAmountAfterDiscount(prodAfterDiscount);
  setFinalTotalAppointmentAmountAfterTaxDiscount(apptAfterDiscount + apptTaxAmt);
  setFinalTotalProductSellAmountAfterDiscountTax(prodAfterDiscount + prodTaxAmt);

  // Calculate combined percentages and amounts
  const totalDiscountAmt = apptDiscountAmt + prodDiscountAmt;
  const totalTaxAmt = apptTaxAmt + prodTaxAmt;
  
  setCombinedDiscountAmount(totalDiscountAmt);
  setCombinedTaxAmount(totalTaxAmt);
  
  const combinedDiscPercentage = actualAmt > 0 ? (totalDiscountAmt / actualAmt) * 100 : 0;
  const combinedTaxPercentage = actualAmt > 0 ? (totalTaxAmt / actualAmt) * 100 : 0;
  
  setCombinedDiscountPercentage(combinedDiscPercentage);
  setCombinedTaxPercentage(combinedTaxPercentage);

}, [
  totalFinalAmount,
  productFormData.final_total,
  appointmentDiscountType,
  appointmentDiscountValue,
  productDiscountType,
  productDiscountValue,
  appointmentTaxType,
  appointmentTaxValue,
  productTaxType,
  productTaxValue
]);

// Update the handleSubmit function to include the new payload structure
const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  // Calculate wallet amount from split payments or single payment
  let walletAmount = 0;
  if (isWalletApplied && selectedWallet) {
    if (splitPaymentMode) {
      // Get wallet amount from split payment details
      const walletDetail = splitPaymentDetails.find(
        (d) => d.mode === "wallet"
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
        selectedWalletData.remaining_price_benefits
      );

      if (walletAmount > currentBalance) {
        handleToastMessage("Insufficient wallet balance", "error");
        return;
      }

      // Convert to integer to match API requirements
      const newBalance = Math.round(currentBalance - walletAmount);
      const walletUpdated = await updateWalletBalance(
        selectedWallet,
        newBalance
      );

      if (!walletUpdated) {
        handleToastMessage("Failed to update wallet balance", "error");
        return;
      }
    }
  }

  // First, create the product sale if there are products
  let saleId = null;
  if (productFormData.product_list.length > 0) {
    saleId = await handleSellProduct();
    if (!saleId) {
      handleToastMessage("Failed to create product sale", "error");
      return;
    }
  }

  let SO = selectedOffers.filter((offer) => {
    return offer.id !== "";
  });

  let SS = services.filter((service) => {
    return service.id !== "";
  });

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
    })
  );

  const formattedOfferContributions = Object.keys(
    offerStaffContributions
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

  // Calculate due and credit amounts based on current values
  const totalPaid = splitPaymentMode 
    ? splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0)
    : parseFloat(amountPaid) || 0;
    
  const total = parseFloat(finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) || 0;
  const due = parseFloat(Math.max(0, total - totalPaid)).toFixed(2);
  const credit = parseFloat(Math.max(0, totalPaid - total)).toFixed(2);

  // Build payload for final update with new structure
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
    staff: services.flatMap((service) => service.staff || []).filter(Boolean),
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
    appointment_discount_percentage: appointmentDiscountType === "percentage" ? parseFloat(appointmentDiscountValue.toFixed(2)) : 0,
    appointment_discount_amount: parseFloat(appointmentDiscountAmount.toFixed(2)),
    appointment_tax_type: appointmentTaxType,
    appointment_tax_percentage: appointmentTaxType === "percentage" ? parseFloat(appointmentTaxValue.toFixed(2)) : 0,
    appointment_tax_amount: parseFloat(appointmentTaxAmount.toFixed(2)),
    
    product_discount_type: productDiscountType,
    product_discount_percentage: productDiscountType === "percentage" ? parseFloat(productDiscountValue.toFixed(2)) : 0,
    product_discount_amount: parseFloat(productDiscountAmount.toFixed(2)),
    product_tax_type: productTaxType,
    product_tax_percentage: productTaxType === "percentage" ? parseFloat(productTaxValue.toFixed(2)) : 0,
    product_tax_amount: parseFloat(productTaxAmount.toFixed(2)),
    
    final_total_appointment_amount_after_discount: parseFloat(finalTotalAppointmentAmountAfterDiscount.toFixed(2)),
    final_total_product_sell_amount_after_discount: parseFloat(finalTotalProductSellAmountAfterDiscount.toFixed(2)),
    final_total_appointment_amount_after_tax_discount: parseFloat(finalTotalAppointmentAmountAfterTaxDiscount.toFixed(2)),
    final_total_product_sell_amount_after_discount_tax: parseFloat(finalTotalProductSellAmountAfterDiscountTax.toFixed(2)),

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
      (product) => product.id && product.id !== ""
    ),
    product_consumption: productConsumption
      .filter((product) => product.id && product.id !== "")
      .map((product) => product.id),
    product_consume: false,
    due_amount: due,
    credit_amount: credit,
    appointment_status: "completed",
    final_amount: parseFloat((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax).toFixed(2)),
    customer_wallet: selectedWallet || null,
    is_wallet_applied: isWalletApplied,
  };

  // Add sale ID to the payload if we have one
  if (saleId) {
    payload.selled_product = saleId;
  }

  // Add membership if used
  if (membershipUsed !== "N/A") {
    const membershipfilter = membershipData?.filter((item) => item?.membership_code === membershipUsed);
    if (membershipfilter?.length > 0) {
      payload.membership = [membershipfilter[0]?.id];
    }
  } else {
    payload.membership = [];
  }

  try {
    const response = await fetch(
      `https://trakky.in:8000/salonvendor/appointments-new/${appointment.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Appointment Updated and Checked Out Successfully", "success");
      setAppointmentData(data);
      setInvoicePage(true);
    } else {
      toast.error(`An error occurred: ${response.statusText}`, "error");
    }
  } catch (error) {
    toast.error("An error occurred", "error");
  }
};

// Update split payment effect
useEffect(() => {
  if (splitPaymentMode && splitPaymentDetails.length > 0) {
    const totalPaid = splitPaymentDetails.reduce(
      (sum, d) => sum + d.amount,
      0
    );
    const total = parseFloat(finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) || 0;

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
}, [splitPaymentDetails, splitPaymentMode, finalTotalAppointmentAmountAfterTaxDiscount, finalTotalProductSellAmountAfterDiscountTax]);


  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-center md:mt-5">
          Checkout Appointment
        </h2>
        <hr className="mt-5 mx-5" />
        <div className=" lg:max-w-[1000px] flex gap-2 h-full">
          <div className=" max-h-full sticky top-0">
            <div className=" max-h-full flex flex-col gap-3 mt-5 h-full border-r border-solid pr-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex w-48 items-center gap-2 px-3 py-1 cursor-pointer ${
                    activeStep === step
                      ? "text-gray-700 border-l-4 font-semibold border-solid border-gray-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveStep(step)}
                >
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className=" mb-6  mt-5 h-fit overflow-y-auto  rounded-lg bg-white grid gap-x-6 gap-y-6 grid-cols-2 mx-auto py-5 md:py-4 lg:px-10 lg:w-[800px]">
            {activeStep === "Customer Details" && (
              <>
                <div className=" col-span-2 -mb-2 mt-1">
                  <h1 className=" text-base font-semibold">Customer Details</h1>
                </div>
                <div className=" w-full   ">
                  <TextField
                    id="name"
                    label="Customer Name"
                    type="text"
                    variant="standard"
                    fullWidth
                    value={customerName}
                    readOnly
                    // disabled
                  />
                </div>

                <div className=" w-full   ">
                  <TextField
                    id="phone"
                    label="Customer Phone"
                    type="text"
                    variant="standard"
                    fullWidth
                    value={customerPhone}
                    readOnly
                    // disabled
                  />
                </div>

                <div className=" w-full   ">
                  <TextField
                    id="email"
                    label="Customer Email"
                    type="email"
                    variant="standard"
                    fullWidth
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className=" w-full   ">
                  <TextField
                    id="customer-type"
                    label="Customer Type"
                    type="text"
                    variant="standard"
                    fullWidth
                    value={customerType}
                    readOnly
                    // disabled
                  />
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
                          (w) => w.id === walletId
                        );

                        // Prevent selecting expired wallets
                        if (
                          selectedWalletData &&
                          selectedWalletData.status === "inactive"
                        ) {
                          handleToastMessage(
                            "This wallet has expired. Please create a new wallet.",
                            "error"
                          );
                          return;
                        }

                        setSelectedWallet(walletId);
                        setIstWalletApplied(!!walletId);

                        // Find selected wallet details
                        const wallet = wallets.find((w) => w.id === walletId);
                        if (wallet) {
                          setWalletDetails(wallet);

                          // Don't auto-fill amount when wallet is selected
                          // Let user decide how much to use from wallet in checkout
                        } else {
                          // Reset if no wallet selected
                          if (!walletId) {
                            setIstWalletApplied(false);
                          }
                        }
                      }}
                      disabled={walletLoading || wallets.length === 0}
                      sx={{
                        border:
                          wallets.length > 0 ? "2px solid #4CAF50" : "none",
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
                                  wallet.status === "inactive"
                                    ? "line-through"
                                    : ""
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
                <div className=" col-span-2 -mb-2 mt-1">
                  <h1 className=" text-base font-semibold">
                    Membership Details
                  </h1>
                </div>
                <div className=" w-full">
                  <FormControl fullWidth variant="standard">
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
                <div className=" w-full   ">
                  {appointment?.customer_phone && membershipData?.length > 0 ? (
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
                  ) : appointment?.customer_phone ? (
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
                <div className=" col-span-2 -mb-2 mt-1">
                  <h1 className=" text-base font-semibold">Service Details</h1>
                </div>
                {services.map((service, index) => (
                  <div
                    className=" flex flex-col w-full col-span-2 gap-[6px]"
                    key={index}
                  >
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
                            <TextField
                              {...params}
                              variant="standard"
                              label="service"
                            />
                          )}
                          value={service.id ? service : null}
                          onChange={(e, value) => {
                            let temp = [...services];

                            if (value === null || value === undefined) {
                              temp[index] = {
                                id: "",
                                service_name: "",
                                service_time: "",
                                gender: "",
                                discount: "",
                                price: "",
                                from_membership: false,
                                membership_id: 0,
                                staff: [], // Add staff field
                              };
                              setServices(temp);
                              setStaffContributions((prev) => {
                                const updated = { ...prev };
                                delete updated[temp[index].id];
                                return updated;
                              });
                              return;
                            }

                            if (membershipUsed !== "N/A") {
                              let membershipfilter = membershipData?.filter(
                                (item) => {
                                  return (
                                    item?.membership_code == membershipUsed
                                  );
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
                                  staff: temp[index]?.staff || [], // Preserve existing staff
                                };

                                setServices(temp);
                                return;
                              }
                              if (membershipfilter?.length > 0) {
                                let membershipDataItem = membershipfilter[0];

                                if (
                                  membershipDataItem.membership_data
                                    .whole_service
                                ) {
                                  temp[index] = {
                                    id: value.id,
                                    service_name: value.service_name,
                                    service_time: value.service_time,
                                    gender: value.gender,
                                    discount:
                                      value.price *
                                      (1 -
                                        membershipDataItem.membership_data
                                          .discount_percentage /
                                          100),
                                    price: value.price,
                                    from_membership: true,
                                    membership_id: membershipDataItem.id,
                                    staff: temp[index]?.staff || [], // Preserve existing staff
                                  };
                                  setServices(temp);
                                  return;
                                } else {
                                  const servicesInMembership =
                                    membershipDataItem.membership_data
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
                                      staff: temp[index]?.staff || [], // Preserve existing staff
                                    };
                                    setServices(temp);
                                    return;
                                  } else {
                                    const isInMembership =
                                      servicesInMembership.includes(value.id);
                                    const discountPercentage =
                                      membershipDataItem.membership_data
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
                                        ? membershipDataItem.id
                                        : 0,
                                      staff: temp[index]?.staff || [], // Preserve existing staff
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
                                  staff: temp[index]?.staff || [], // Preserve existing staff
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
                                staff: temp[index]?.staff || [], // Preserve existing staff
                              };
                              setServices(temp);

                              setStaffContributions((prev) => {
                                const updated = { ...prev };
                                delete updated[value.id];
                                return updated;
                              });

                              return;
                            }
                          }}
                        />
                      </div>

                      {/* Staff Selection for Service */}
                      <div className="w-1/4">
                        <FormControl
                          fullWidth
                          variant="standard"
                          sx={{
                            backgroundColor: service?.id
                              ? "inherit"
                              : "#f9f9f9",
                            cursor: service?.id ? "auto" : "not-allowed",
                          }}
                        >
                          <InputLabel id={`service-staff-label-${index}`}>
                            Staff{" "}
                            {service.staff?.length > 0 &&
                              `(${service.staff.length} assigned)`}
                          </InputLabel>
                          <Select
                            labelId={`service-staff-label-${index}`}
                            id={`service-staff-select-${index}`}
                            multiple
                            value={service.staff || []}
                            label={`Staff ${
                              service.staff?.length > 0
                                ? `(${service.staff.length} assigned)`
                                : ""
                            }`}
                            disabled={!service?.id}
                            onChange={(e) => {
                              const selectedStaffIds = e.target.value;
                              let temp = [...services];
                              temp[index] = {
                                ...temp[index],
                                staff: selectedStaffIds,
                              };
                              setServices(temp);

                              // Auto-create staff contributions when staff is assigned
                              if (selectedStaffIds.length > 0) {
                                const newContributions = selectedStaffIds.map(
                                  (staffId) => {
                                    const staffMember = staffList.find(
                                      (s) => s.id === staffId
                                    );
                                    return {
                                      staff_id: staffId,
                                      staff_name:
                                        staffMember?.staffname ||
                                        `Staff #${staffId}`,
                                      staff_role:
                                        staffMember?.staff_role || "Unknown",
                                      percent:
                                        selectedStaffIds.length === 1 ? 100 : 0, // Auto 100% if single staff
                                    };
                                  }
                                );

                                setStaffContributions((prev) => ({
                                  ...prev,
                                  [service.id]: newContributions,
                                }));
                              } else {
                                // Remove contributions if no staff is selected
                                setStaffContributions((prev) => {
                                  const updated = { ...prev };
                                  delete updated[service.id];
                                  return updated;
                                });
                              }
                            }}
                            renderValue={(selected) => {
                              if (selected.length === 0) return "Select Staff";
                              return selected
                                .map((id) => {
                                  const staffMember = staffList.find(
                                    (s) => s.id === id
                                  );
                                  return staffMember
                                    ? staffMember.staffname
                                    : "";
                                })
                                .join(", ");
                            }}
                          >
                            {/* Show only assigned staff for this specific service */}
                            {service.staff?.map((staffId) => {
                              const staffMember = staffList.find(
                                (s) => s.id === staffId
                              );
                              if (!staffMember) return null;

                              return (
                                <MenuItem
                                  key={staffMember.id}
                                  value={staffMember.id}
                                  style={{
                                    backgroundColor: "#f0f8ff", // Light blue background for assigned staff
                                  }}
                                >
                                  <Checkbox
                                    checked={
                                      service.staff?.includes(staffMember.id) ||
                                      false
                                    }
                                  />
                                  <ListItemText
                                    primary={`${staffMember.staffname} (${staffMember.staff_role}) - Assigned`}
                                  />
                                </MenuItem>
                              );
                            })}

                            {/* Separator */}
                            {service.staff?.length > 0 && <Divider />}

                            {/* Available staff to add - filter out staff already assigned to this service */}
                            {staffList
                              .filter(
                                (staffMember) =>
                                  !service.staff?.includes(staffMember.id)
                              )
                              .map((staffMember) => (
                                <MenuItem
                                  key={staffMember.id}
                                  value={staffMember.id}
                                  disabled={staffMember.is_busy}
                                  style={{
                                    color: staffMember.is_busy
                                      ? "#ccc"
                                      : "inherit",
                                    opacity: staffMember.is_busy ? 0.7 : 1,
                                  }}
                                >
                                  <Checkbox checked={false} />
                                  <ListItemText
                                    primary={`${staffMember.staffname} (${
                                      staffMember.staff_role
                                    }) - ${
                                      staffMember.is_busy ? "Busy" : "Free"
                                    }`}
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className=" w-1/4">
                        <TextField
                          id={`actial-amount-${index}`}
                          label="Service Final Amount"
                          type="number"
                          variant="standard"
                          fullWidth
                          value={service.price}
                          readOnly
                          disabled
                          sx={{
                            cursor: "not-allowed",
                            backgroundColor: "#f9f9f9",
                          }}
                        />
                      </div>
                      <div className=" w-1/4">
                        <TextField
                          id={`final-amount-${index}`}
                          label="Service Final Amount"
                          type="number"
                          variant="standard"
                          fullWidth
                          value={service.discount}
                          readOnly
                          sx={{
                            cursor: "not-allowed",
                            backgroundColor: "#f9f9f9",
                          }}
                          disabled
                        />
                      </div>
                      <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                        {index == services?.length - 1 ? (
                          <div
                            className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
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
                                  staff: [], // Add empty staff array for new service
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
                                  staff: [],
                                };
                              }

                              let temp = [...services];
                              temp.splice(index, 1);
                              setServices(temp);
                            }}
                          >
                            <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Staff Contribution Section */}
                    {service.id && staffContributions[service.id] && (
                      <div className="ml-4 mt-2 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium mb-2">
                          Staff Contribution for this Service:
                        </h4>

                        {staffContributions[service.id].map((contrib) => {
                          const staffId = contrib.staff_id;
                          const isSingleStaff =
                            staffContributions[service.id].length === 1;

                          return (
                            <div
                              key={staffId}
                              className="flex items-center gap-2 mb-2"
                            >
                              <span className="text-sm w-32">
                                {getStaffName(staffId)}:
                              </span>

                              {isSingleStaff ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium bg-white px-2 py-1 rounded border border-gray-300 min-w-[80px]">
                                    100
                                  </span>
                                  <span className="text-sm">%</span>
                                </div>
                              ) : (
                                <>
                                  <TextField
                                    size="small"
                                    type="number"
                                    variant="standard"
                                    value={contrib.percent ?? ""}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const newValue =
                                        inputValue === ""
                                          ? ""
                                          : Math.max(
                                              0,
                                              Math.min(100, Number(inputValue))
                                            );

                                      handleStaffPercentageChange(
                                        service.id,
                                        staffId,
                                        newValue
                                      );
                                    }}
                                    inputProps={{
                                      min: 0,
                                      max: 100,
                                      step: 1,
                                      style: { width: "80px" },
                                    }}
                                    placeholder="0-100%"
                                    error={Boolean(
                                      staffContributionErrors[service.id]
                                    )}
                                  />
                                  <span className="text-sm">%</span>
                                </>
                              )}
                            </div>
                          );
                        })}

                        <div className="mt-2 text-sm text-gray-600">
                          Total: {getTotalPercentage(service.id)}%
                        </div>

                        {getTotalPercentage(service.id) !== 100 && (
                          <div className="mt-1 text-sm text-red-600">
                            Total must be exactly 100%
                          </div>
                        )}
                      </div>
                    )}

                    {service?.id && (
                      <div className=" text-gray-500 text-[13px] pl-2">
                        Approx Time : {formateTime(service?.service_time)}
                        {service.from_membership && (
                          <span className=" h-full">
                            {" "}
                            &nbsp;,
                            <span className=" underline text-black">
                              Membership applied (Yes)
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className=" col-span-2 -mb-2 mt-1">
                  <h1 className=" text-base font-semibold">Offer Details</h1>
                </div>
                {selectedOffers.map((offer, index) => (
                  <div
                    className=" flex flex-col w-full col-span-2 gap-[6px]"
                    key={index}
                  >
                    <div className="  flex gap-2 items-center">
                      <div className=" w-[40%] grow shrink  ">
                        <Autocomplete
                          disablePortal
                          id="offers-options"
                          options={offers}
                          disabled={offerLoading}
                          getOptionLabel={(option) =>
                            `${option?.name || "uk"} (${
                              option?.discount_price || 0
                            })`
                          }
                          getOptionKey={(option) => option.id}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="select offer (only for new customer & Regular)"
                            />
                          )}
                          value={offer.id ? offer : null}
                          onChange={(e, value) => {
                            let temp = [...selectedOffers];

                            if (value === null || value === undefined) {
                              temp[index] = {
                                id: "",
                                name: "",
                                offer_time: "",
                                actual_price: "",
                                discount_price: "",
                                staff: [], // Add staff field
                              };
                              setSelectedOffers(temp);
                              setOfferStaffContributions((prev) => {
                                const updated = { ...prev };
                                delete updated[temp[index].id];
                                return updated;
                              });
                              return;
                            }
                            temp[index] = {
                              ...value,
                              staff: temp[index]?.staff || [], // Preserve existing staff
                            };
                            setSelectedOffers(temp);
                          }}
                        />
                      </div>

                      {/* Staff Selection for Offer */}
                      <div className="w-1/4">
                        <FormControl
                          fullWidth
                          variant="standard"
                          sx={{
                            backgroundColor: offer?.id ? "inherit" : "#f9f9f9",
                            cursor: offer?.id ? "auto" : "not-allowed",
                          }}
                        >
                          <InputLabel id={`offer-staff-label-${index}`}>
                            Staff{" "}
                            {offer.staff?.length > 0 &&
                              `(${offer.staff.length} assigned)`}
                          </InputLabel>
                          <Select
                            labelId={`offer-staff-label-${index}`}
                            id={`offer-staff-select-${index}`}
                            multiple
                            value={offer.staff || []}
                            label={`Staff ${
                              offer.staff?.length > 0
                                ? `(${offer.staff.length} assigned)`
                                : ""
                            }`}
                            disabled={!offer?.id}
                            onChange={(e) => {
                              const selectedStaffIds = e.target.value;
                              let temp = [...selectedOffers];
                              temp[index] = {
                                ...temp[index],
                                staff: selectedStaffIds,
                              };
                              setSelectedOffers(temp);

                              // Auto-create staff contributions when staff is assigned to offer
                              if (selectedStaffIds.length > 0) {
                                const newContributions = selectedStaffIds.map(
                                  (staffId) => {
                                    const staffMember = staffList.find(
                                      (s) => s.id === staffId
                                    );
                                    return {
                                      staff_id: staffId,
                                      staff_name:
                                        staffMember?.staffname ||
                                        `Staff #${staffId}`,
                                      staff_role:
                                        staffMember?.staff_role || "Unknown",
                                      percent:
                                        selectedStaffIds.length === 1 ? 100 : 0, // Auto 100% if single staff
                                    };
                                  }
                                );

                                setOfferStaffContributions((prev) => ({
                                  ...prev,
                                  [offer.id]: newContributions,
                                }));
                              } else {
                                // Remove contributions if no staff is selected
                                setOfferStaffContributions((prev) => {
                                  const updated = { ...prev };
                                  delete updated[offer.id];
                                  return updated;
                                });
                              }
                            }}
                            renderValue={(selected) => {
                              if (selected.length === 0) return "Select Staff";
                              return selected
                                .map((id) => {
                                  const staffMember = staffList.find(
                                    (s) => s.id === id
                                  );
                                  return staffMember
                                    ? staffMember.staffname
                                    : "";
                                })
                                .join(", ");
                            }}
                          >
                            {/* Show only assigned staff for this specific offer */}
                            {offer.staff?.map((staffId) => {
                              const staffMember = staffList.find(
                                (s) => s.id === staffId
                              );
                              if (!staffMember) return null;

                              return (
                                <MenuItem
                                  key={staffMember.id}
                                  value={staffMember.id}
                                  style={{
                                    backgroundColor: "#f0fff0", // Light green background for assigned staff
                                  }}
                                >
                                  <Checkbox
                                    checked={
                                      offer.staff?.includes(staffMember.id) ||
                                      false
                                    }
                                  />
                                  <ListItemText
                                    primary={`${staffMember.staffname} (${staffMember.staff_role}) - Assigned`}
                                  />
                                </MenuItem>
                              );
                            })}

                            {/* Separator */}
                            {offer.staff?.length > 0 && <Divider />}

                            {/* Available staff to add - filter out staff already assigned to this offer */}
                            {staffList
                              .filter(
                                (staffMember) =>
                                  !offer.staff?.includes(staffMember.id)
                              )
                              .map((staffMember) => (
                                <MenuItem
                                  key={staffMember.id}
                                  value={staffMember.id}
                                  disabled={staffMember.is_busy}
                                  style={{
                                    color: staffMember.is_busy
                                      ? "#ccc"
                                      : "inherit",
                                    opacity: staffMember.is_busy ? 0.7 : 1,
                                  }}
                                >
                                  <Checkbox checked={false} />
                                  <ListItemText
                                    primary={`${staffMember.staffname} (${
                                      staffMember.staff_role
                                    }) - ${
                                      staffMember.is_busy ? "Busy" : "Free"
                                    }`}
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className=" w-1/4">
                        <TextField
                          id={`actial-amount-${index}`}
                          label="Service Final Amount"
                          type="number"
                          variant="standard"
                          fullWidth
                          value={offer.actual_price}
                          readOnly
                          disabled
                          sx={{
                            cursor: "not-allowed",
                            backgroundColor: "#f9f9f9",
                          }}
                        />
                      </div>
                      <div className=" w-1/4">
                        <TextField
                          id={`final-amount-${index}`}
                          label="Service Final Amount"
                          type="number"
                          variant="standard"
                          fullWidth
                          value={offer.discount_price}
                          readOnly
                          sx={{
                            cursor: "not-allowed",
                            backgroundColor: "#f9f9f9",
                          }}
                          disabled
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
                                  staff: [], // Add empty staff array for new offer
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
                                  staff: [],
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

                    {/* Staff Contribution Section for Offer */}
                    {offer.id && offerStaffContributions[offer.id] && (
                      <div className="ml-4 mt-2 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium mb-2">
                          Staff Contribution for {offer.name || "this Offer"}:
                        </h4>

                        {offerStaffContributions[offer.id].map((contrib) => {
                          const staffId = contrib.staff_id;
                          const isSingleStaff =
                            offerStaffContributions[offer.id].length === 1;

                          return (
                            <div
                              key={staffId}
                              className="flex items-center gap-2 mb-2"
                            >
                              <span className="text-sm w-32">
                                {getStaffName(staffId)}:
                              </span>

                              {isSingleStaff ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium bg-white px-2 py-1 rounded border border-gray-300 min-w-[80px]">
                                    100
                                  </span>
                                  <span className="text-sm">%</span>
                                </div>
                              ) : (
                                <>
                                  <TextField
                                    size="small"
                                    type="number"
                                    variant="standard"
                                    value={contrib.percent ?? ""}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const newValue =
                                        inputValue === ""
                                          ? ""
                                          : Math.max(
                                              0,
                                              Math.min(100, Number(inputValue))
                                            );

                                      handleOfferStaffPercentageChange(
                                        offer.id,
                                        staffId,
                                        newValue
                                      );
                                    }}
                                    inputProps={{
                                      min: 0,
                                      max: 100,
                                      step: 1,
                                      style: { width: "80px" },
                                    }}
                                    placeholder="0-100%"
                                    error={Boolean(
                                      staffContributionErrors[
                                        `offer_${offer.id}`
                                      ]
                                    )}
                                  />
                                  <span className="text-sm">%</span>
                                </>
                              )}
                            </div>
                          );
                        })}

                        <div className="mt-2 text-sm text-gray-600">
                          Total: {getTotalPercentage(offer.id, true)}%
                        </div>

                        {getTotalPercentage(offer.id, true) !== 100 && (
                          <div className="mt-1 text-sm text-red-600">
                            Total must be exactly 100%
                          </div>
                        )}
                      </div>
                    )}

                    {offer?.id && (
                      <div className=" text-gray-500 text-[13px] pl-2">
                        Approx Time : {formateTime(offer?.offer_time)}
                      </div>
                    )}
                  </div>
                ))}

                {/* Validation Alert */}
                {(Object.keys(staffContributionErrors).some(
                  (key) => staffContributionErrors[key]
                ) ||
                  Object.keys(staffContributionErrors).some(
                    (key) =>
                      key.startsWith("offer_") && staffContributionErrors[key]
                  )) && (
                  <div className="col-span-2 mt-4">
                    <Alert severity="error">
                      Please ensure all staff contributions total exactly 100%
                      before proceeding to the next step.
                    </Alert>
                  </div>
                )}
              </>
            )}

            {activeStep === "Product Consumption" && (
              <>
                <div className=" col-span-2 -mb-2 mt-1">
                  <h1 className=" text-base font-semibold">
                    Product Consumption
                  </h1>
                  {appointment?.product_details &&
                    appointment.product_details.length > 0 && (
                      <div className="text-sm text-blue-600 mt-1">
                        Showing previously used products
                      </div>
                    )}
                </div>

                {productConsumption?.map((product, index) => (
                  <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                    <div className="flex gap-2 items-center">
                      <div className=" w-[40%] grow shrink">
                        <Autocomplete
                          disablePortal
                          id="product-options"
                          options={InUseProductData}
                          getOptionLabel={(option) =>
                            `${option?.name} (${option?.remaining_quantity} ${option?.measure_unit})`
                          }
                          getOptionKey={(option) => option.id}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Product"
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
                              total_use_times: product.total_use_times || 1, // Keep existing use times
                            };
                            setProductConsumption(temp);
                          }}
                        />
                      </div>

                      <div className=" w-1/4">
                        <TextField
                          id={`final-amount-${index}`}
                          label={`Product Consumption per use ( in ${product?.measure_unit} )`}
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
                      <div className=" w-1/4">
                        <TextField
                          id={`final-amount-${index}`}
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
                            temp[index].total_use_times = parseInt(
                              e.target.value
                            );
                            setProductConsumption(temp);
                          }}
                        />
                      </div>
                      <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                        {index == productConsumption?.length - 1 ? (
                          <div
                            className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                            onClick={() => {
                              setProductConsumption([
                                ...productConsumption,
                                {
                                  id: "",
                                  name: "",
                                  per_use_consumption: "",
                                  remaining_quantity: "",
                                  measure_unit: "",
                                  total_use_times: 1,
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
                              if (productConsumption.length === 1) {
                                let temp = [...productConsumption];
                                temp[index] = {
                                  id: "",
                                  name: "",
                                  per_use_consumption: "",
                                  remaining_quantity: "",
                                  measure_unit: "",
                                  total_use_times: "",
                                };

                                setProductConsumption(temp);

                                return;
                              }

                              let temp = [...productConsumption];
                              temp.splice(index, 1);
                              setProductConsumption(temp);
                            }}
                          >
                            <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Show previous usage information if available */}
                    {product.id &&
                      appointment?.product_details &&
                      appointment.product_details.some(
                        (p) => p.id === product.id
                      ) && (
                        <div className="text-xs text-gray-500 ml-4">
                          Previously used:{" "}
                          {appointment.product_details.find(
                            (p) => p.id === product.id
                          )?.total_use_times || 1}{" "}
                          times
                        </div>
                      )}
                  </div>
                ))}
              </>
            )}

            {activeStep === "Purchase Product" && (
              <>
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

                    <Typography
                      variant="subtitle1"
                      className="font-semibold mb-2"
                    >
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
                                  (product) =>
                                    product.product_id === item.product
                                )
                                  ? "bg-gray-100 border-2 border-blue-400"
                                  : "hover:shadow-md"
                              }`}
                              onClick={() => {
                                if (
                                  productFormData.product_list.some(
                                    (product) =>
                                      product.product_id === item.product
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
                                      price_per_unit:
                                        item.retail_price_per_unit,
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
                                    {item?.product_details?.product_name ||
                                      "N/A"}
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
                              Try a different search term or check if products
                              are available.
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
                          <Typography
                            variant="subtitle2"
                            className="font-semibold"
                          >
                            {productFormData.customerName ||
                              productFormData.customerNumber ||
                              "Customer"}
                          </Typography>
                          {productFormData.customerName &&
                            productFormData.customerNumber && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
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

                    <Typography
                      variant="subtitle2"
                      className="font-semibold mb-2"
                    >
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
                                              item.product_id
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
                              0
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

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSellProduct}
                        disabled={productFormData.product_list.length === 0}
                        size="small"
                      >
                        Add Products to Sale
                      </Button>
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
      <TextField label="Appointment Total" type="number" variant="standard" fullWidth value={Math.round(totalFinalAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }} />
      
      {(productFormData.final_total > 0 || appointment?.selled_product_details) && (
        <TextField label="Product Total" type="number" variant="standard" fullWidth value={Math.round((appointment?.selled_product_details?.final_total || productFormData.final_total) * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }} />
      )}
      
      <TextField label="Combined Total" type="number" variant="standard" fullWidth value={Math.round(actualAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }} />
    </div>

    {/* APPOINTMENT & PRODUCT SECTIONS COMBINED */}
    <div className="w-full col-span-2 mt-2">
      <Typography variant="h6" className="font-semibold mb-1 border-b pb-1">Appointment & Product Details</Typography>
    </div>

    <div className="grid grid-cols-4 gap-3 w-full col-span-2">
      {/* Appointment Tax */}
      {vendorData?.is_gst && (
        <TextField label={`Appt Tax (${appointmentTaxType === "percentage" ? `${appointmentTaxValue}%` : `₹${appointmentTaxValue}`})`} type="number" variant="standard" fullWidth value={appointmentTaxValue} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }} />
      )}

      {/* Appointment Discount Type */}
      <FormControl fullWidth variant="standard">
        <InputLabel>Appt Discount Type</InputLabel>
        <Select value={appointmentDiscountType} label="Appt Discount Type" onChange={(e) => { setAppointmentDiscountType(e.target.value); setAppointmentDiscountValue(0); }}>
          <MenuItem value="percentage">Percentage</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
        </Select>
      </FormControl>

      {/* Appointment Discount Value */}
      <TextField label={appointmentDiscountType === "percentage" ? "Appt Discount %" : "Appt Discount Amt"} type="number" variant="standard" fullWidth value={appointmentDiscountValue} onChange={(e) => {
        const value = parseFloat(e.target.value) || 0;
        if (appointmentDiscountType === "percentage") {
          setAppointmentDiscountValue(Math.min(100, Math.max(0, Math.round(value * 100) / 100)));
        } else {
          setAppointmentDiscountValue(Math.max(0, Math.round(value * 100) / 100));
        }
      }} />

      {/* Appointment Discount Amount */}
      <TextField label="Appt Discount Amt" type="number" variant="standard" fullWidth value={Math.round(appointmentDiscountAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }} />

      {/* Product Tax */}
      {vendorData?.product_is_gst && (
        <TextField label={`Prod Tax (${productTaxType === "percentage" ? `${productTaxValue}%` : `₹${productTaxValue}`})`} type="number" variant="standard" fullWidth value={productTaxValue} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }} />
      )}

      {/* Product Discount Type */}
      <FormControl fullWidth variant="standard">
        <InputLabel>Prod Discount Type</InputLabel>
        <Select value={productDiscountType} label="Prod Discount Type" onChange={(e) => { setProductDiscountType(e.target.value); setProductDiscountValue(0); }}>
          <MenuItem value="percentage">Percentage</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
        </Select>
      </FormControl>

      {/* Product Discount Value */}
      <TextField label={productDiscountType === "percentage" ? "Prod Discount %" : "Prod Discount Amt"} type="number" variant="standard" fullWidth value={productDiscountValue} onChange={(e) => {
        const value = parseFloat(e.target.value) || 0;
        if (productDiscountType === "percentage") {
          setProductDiscountValue(Math.min(100, Math.max(0, Math.round(value * 100) / 100)));
        } else {
          setProductDiscountValue(Math.max(0, Math.round(value * 100) / 100));
        }
      }} />

      {/* Product Discount Amount */}
      <TextField label="Prod Discount Amt" type="number" variant="standard" fullWidth value={Math.round(productDiscountAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }} />
    </div>

    {/* FINAL CALCULATIONS & LEGACY FIELDS COMBINED */}
    <div className="w-full col-span-2 mt-2">
      <Typography variant="h6" className="font-semibold mb-1 border-b pb-1">Final Calculations & Legacy Fields</Typography>
    </div>

    <div className="grid grid-cols-4 gap-3 w-full col-span-2">
      {/* Final Calculations */}
      <TextField label="Final Appt (After Disc)" type="number" variant="standard" fullWidth value={Math.round(finalTotalAppointmentAmountAfterDiscount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff", "& .MuiInputBase-input": { fontWeight: "bold" } }} />
      <TextField label="Final Appt (After Tax)" type="number" variant="standard" fullWidth value={Math.round(finalTotalAppointmentAmountAfterTaxDiscount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#e8f5e8", "& .MuiInputBase-input": { fontWeight: "bold" } }} />
      <TextField label="Final Prod (After Disc)" type="number" variant="standard" fullWidth value={Math.round(finalTotalProductSellAmountAfterDiscount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff", "& .MuiInputBase-input": { fontWeight: "bold" } }} />
      <TextField label="Final Prod (After Tax)" type="number" variant="standard" fullWidth value={Math.round(finalTotalProductSellAmountAfterDiscountTax * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#e8f5e8", "& .MuiInputBase-input": { fontWeight: "bold" } }} />

      {/* Legacy Fields */}
      <TextField label="Combined Disc %" type="number" variant="standard" fullWidth value={Math.round(combinedDiscountPercentage * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }} />
      <TextField label="Combined Tax %" type="number" variant="standard" fullWidth value={Math.round(combinedTaxPercentage * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }} />

      <TextField label="Combined Disc Amt" type="number" variant="standard" fullWidth value={Math.round(combinedDiscountAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#fff9e6" }} />
      <TextField label="Combined Tax Amt" type="number" variant="standard" fullWidth value={Math.round(combinedTaxAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f0f8ff" }} />
    </div>

    {/* Combined Final Total */}
    <div className="w-full col-span-2 mt-1">
      <TextField label="Combined Final Total (After Tax)" type="number" variant="standard" fullWidth value={Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#e8f5e8", "& .MuiInputBase-input": { fontWeight: "bold", fontSize: "1.1rem" } }} />
    </div>

    {/* PAYMENT INFORMATION */}
    <div className="w-full col-span-2 mt-2">
      <Typography variant="h6" className="font-semibold mb-1 border-b pb-1">Payment Information</Typography>
    </div>

    <div className="grid grid-cols-4 gap-3 w-full col-span-2">
      {/* Amount Paid */}
      {!splitPaymentMode && (
        <TextField label="Amount Paid" type="number" variant="standard" fullWidth value={amountPaid} 
          onChange={(e) => {
            const paid = parseFloat(e.target.value) || 0;
            const total = parseFloat(finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) || 0;

            if (isWalletApplied && selectedWallet && paymentMode === "wallet") {
              const walletData = wallets.find((w) => w.id === selectedWallet);
              if (walletData && paid > walletData.remaining_price_benefits) return;
            }

            setAmountPaid(paid);
            const due = Math.max(0, total - paid);
            const credit = Math.max(0, paid - total);
            setDueAmount(Math.round(due * 100) / 100);
            setCreditAmount(Math.round(credit * 100) / 100);
            setRemainingAmount(Math.round(due * 100) / 100);

            if (paid >= total) setPaymentStatus("paid");
            else if (paid > 0 && paid < total) setPaymentStatus("partial");
            else if (paid === 0 && total > 0) setPaymentStatus("unpaid");
          }}
        />
      )}

      {/* Due Amount */}
      <TextField label="Due Amount" type="number" variant="standard" fullWidth value={Math.round(dueAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }} />

      {/* Credit Amount */}
      <TextField label="Credit Amount" type="number" variant="standard" fullWidth value={Math.round(creditAmount * 100) / 100} InputProps={{ readOnly: true }} sx={{ cursor: "not-allowed", backgroundColor: creditAmount > 0 ? "#e8f5e8" : "#f9f9f9" }} />

      {/* Payment Status */}
      <FormControl fullWidth variant="standard">
        <InputLabel>Payment Status</InputLabel>
        <Select value={paymentStatus} label="Payment Status" onChange={(e) => {
          setPaymentStatus(e.target.value);
          if (e.target.value === "unpaid") setAmountPaid(0);
          if (e.target.value === "paid") setAmountPaid(Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100);
        }}>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="unpaid">Unpaid</MenuItem>
          <MenuItem value="partial">Partial</MenuItem>
        </Select>
      </FormControl>

      {/* Payment Mode */}
      <FormControl fullWidth variant="standard">
        <InputLabel>Payment Mode</InputLabel>
        <Select value={paymentMode} label="Payment Mode" onChange={(e) => {
          const newMode = e.target.value;
          setPaymentMode(newMode);
          if (splitPaymentMode && newMode === "wallet" && !selectedPaymentModes.includes("wallet")) {
            const updatedModes = [...selectedPaymentModes, "wallet"];
            setSelectedPaymentModes(updatedModes);
            const updatedDetails = [...splitPaymentDetails];
            if (!updatedDetails.find((d) => d.mode === "wallet")) {
              updatedDetails.push({ mode: "wallet", amount: 0 });
            }
            setSplitPaymentDetails(updatedDetails);
          }
        }} disabled={paymentStatus === "unpaid" && !splitPaymentMode}>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="wallet">Wallet</MenuItem>
          <MenuItem value="credit-card">Credit Card</MenuItem>
          <MenuItem value="debit-card">Debit Card</MenuItem>
          <MenuItem value="net-banking">Net Banking</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      {/* Split Payment Toggle */}
      <div className="col-span-2 flex items-center">
        <FormControlLabel control={<Checkbox checked={splitPaymentMode} onChange={(e) => {
          const isSplit = e.target.checked;
          setSplitPaymentMode(isSplit);
          if (isSplit) {
            const initialModes = [];
            if (paymentMode) initialModes.push(paymentMode);
            if (isWalletApplied && selectedWallet && !initialModes.includes("wallet")) initialModes.push("wallet");
            if (initialModes.length === 0) initialModes.push("cash");
            setSelectedPaymentModes(initialModes);
            setSplitPaymentDetails(initialModes.map((mode) => ({ mode: mode, amount: mode === "wallet" ? 0 : Math.round(parseFloat(amountPaid) || 0 * 100) / 100 })));
          } else {
            setSelectedPaymentModes([]);
            setSplitPaymentDetails([]);
          }
        }} />} label="Split Payment" />
      </div>
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
                if (isWalletApplied && selectedWallet && !newModes.includes('wallet')) {
                  finalModes = [...newModes, 'wallet'];
                }
                setSelectedPaymentModes(finalModes);

                const currentDetails = [...splitPaymentDetails];
                const updatedDetails = finalModes.map((mode) => {
                  const existing = currentDetails.find((d) => d.mode === mode);
                  return existing || { mode: mode, amount: 0 };
                });

                setSplitPaymentDetails(updatedDetails);
                const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
                setAmountPaid(Math.round(totalPaid * 100) / 100);
              }}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {[
                { value: 'cash', label: 'Cash' },
                { value: 'upi', label: 'UPI' },
                { value: 'wallet', label: 'Wallet' },
                { value: 'credit-card', label: 'Credit Card' },
                { value: 'debit-card', label: 'Debit Card' },
                { value: 'net-banking', label: 'Net Banking' },
                { value: 'other', label: 'Other' },
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={selectedPaymentModes.includes(option.value)} />
                  <ListItemText primary={option.label} />
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
              ? 'Wallet is automatically included. Select additional payment modes.'
              : 'Select all payment modes you want to split the payment across'}
          </Typography>
        </div>
      )}

    {/* Split Payment Amount Inputs with MANUAL CONTROL */}
   {splitPaymentMode && selectedPaymentModes.length > 0 && (
  <div className="w-full col-span-2 mt-2">
    <Typography variant="subtitle2" className="font-semibold mb-2">Split Payment Amounts</Typography>
    <div className="space-y-3">
      {splitPaymentDetails.map((detail, index) => {
        const isWalletMode = detail.mode === "wallet";
        const walletBalance = wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits || 0;
        const totalAmount = Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100;
        const isLastField = index === splitPaymentDetails.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-1/3">
              <TextField
                label={`${detail.mode} Amount${isWalletMode ? ` (Max: ₹${Math.round(walletBalance * 100) / 100})` : ""}`}
                type="number"
                variant="standard"
                fullWidth
                value={detail.amount}
                onChange={(e) => {
                  const newAmount = parseFloat(e.target.value) || 0;
                  const roundedAmount = Math.round(newAmount * 100) / 100;
                  
                  // Validation checks
                  if (isWalletMode && roundedAmount > walletBalance) return;
                  if (roundedAmount > totalAmount) return;
                  
                  // Update only the current field
                  const updatedDetails = [...splitPaymentDetails];
                  updatedDetails[index].amount = roundedAmount;
                  
                  setSplitPaymentDetails(updatedDetails);
                  
                  // Calculate total paid
                  const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
                  setAmountPaid(Math.round(totalPaid * 100) / 100);
                  
                  // Update payment status
                  if (totalPaid >= totalAmount) setPaymentStatus("paid");
                  else if (totalPaid > 0 && totalPaid < totalAmount) setPaymentStatus("partial");
                  else if (totalPaid === 0) setPaymentStatus("unpaid");
                }}
                onBlur={(e) => {
                  // Optional: You can add auto-balancing on blur if needed
                  // But for now, we're keeping it manual as per your requirement
                }}
              />
            </div>
            <Typography variant="body2" className="text-gray-600 capitalize min-w-20">
              {detail.mode}
              {isWalletMode && ` (Balance: ₹${Math.round(walletBalance * 100) / 100})`}
            </Typography>

            {/* MANUAL AUTO-FILL REMAINING BUTTON - Only fills current field */}
            {isLastField && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  const totalAmount = Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100;
                  const currentTotal = splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0);
                  const remainingAmount = Math.max(0, totalAmount - currentTotal);

                  if (remainingAmount > 0) {
                    const updatedDetails = [...splitPaymentDetails];
                    
                    if (isWalletMode) {
                      // For wallet, use minimum of remaining amount and wallet balance
                      updatedDetails[index].amount = Math.round(
                        Math.min(updatedDetails[index].amount + remainingAmount, walletBalance) * 100
                      ) / 100;
                    } else {
                      // For other modes, add the full remaining amount to THIS FIELD ONLY
                      updatedDetails[index].amount = Math.round(
                        (updatedDetails[index].amount + remainingAmount) * 100
                      ) / 100;
                    }
                    
                    setSplitPaymentDetails(updatedDetails);

                    const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
                    setAmountPaid(Math.round(totalPaid * 100) / 100);
                    if (totalPaid >= totalAmount) setPaymentStatus("paid");
                  }
                }}
                disabled={
                  splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0) >= totalAmount ||
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
              ₹{Math.round(splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0) * 100) / 100}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Final Amount:</span>
            <span className="font-semibold">
              ₹{Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining Amount:</span>
            <span className={`font-semibold ${splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0) < Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{Math.round((
                Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100 -
                splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0)
              ) * 100) / 100}
            </span>
          </div>

          {splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0) < Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100 && (
            <Alert severity="warning" className="mt-1">
              Amount not fully allocated. Remaining amount will be added to due.
            </Alert>
          )}
          
          {splitPaymentDetails.reduce((sum, d) => sum + d.amount, 0) > Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100 && (
            <Alert severity="error" className="mt-1">
              Total paid amount exceeds final amount! Please adjust the amounts.
            </Alert>
          )}
        </div>
      )}
    </div>

    {/* IMPROVED Quick Action Buttons */}
    {splitPaymentDetails.length > 0 && (
      <div className="mt-3 flex gap-2 flex-wrap">
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const totalAmount = Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100;
            const nonWalletDetails = splitPaymentDetails.filter(d => d.mode !== "wallet");
            const walletDetail = splitPaymentDetails.find(d => d.mode === "wallet");
            
            const walletBalance = wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits || 0;
            const walletMaxAmount = walletDetail ? Math.min(totalAmount, walletBalance) : 0;
            
            let remainingForNonWallet = totalAmount - walletMaxAmount;
            const equalAmount = nonWalletDetails.length > 0 ? remainingForNonWallet / nonWalletDetails.length : 0;
            
            const updatedDetails = splitPaymentDetails.map((detail) => {
              if (detail.mode === "wallet") {
                return {
                  ...detail,
                  amount: Math.round(walletMaxAmount * 100) / 100
                };
              } else {
                return {
                  ...detail,
                  amount: Math.round(equalAmount * 100) / 100
                };
              }
            });
            
            setSplitPaymentDetails(updatedDetails);
            const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
            setAmountPaid(totalPaid);
            setPaymentStatus(totalPaid >= totalAmount ? "paid" : "partial");
          }}
        >
          Distribute Equally
        </Button>

        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            if (isWalletApplied && selectedWallet) {
              const walletBalance = wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits || 0;
              const totalAmount = Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100;
              const walletAmount = Math.min(walletBalance, totalAmount);
              
              const updatedDetails = splitPaymentDetails.map((detail) => ({
                ...detail,
                amount: detail.mode === "wallet" ? Math.round(walletAmount * 100) / 100 : 0
              }));
              
              setSplitPaymentDetails(updatedDetails);
              const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
              setAmountPaid(totalPaid);
              setPaymentStatus(totalPaid >= totalAmount ? "paid" : "partial");
            }
          }}
          disabled={!isWalletApplied || !selectedWallet}
        >
          Use Max Wallet
        </Button>

        {/* NEW: Fill All Button - Fills all fields to cover total amount */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const totalAmount = Math.round((finalTotalAppointmentAmountAfterTaxDiscount + finalTotalProductSellAmountAfterDiscountTax) * 100) / 100;
            const nonWalletDetails = splitPaymentDetails.filter(d => d.mode !== "wallet");
            const walletDetail = splitPaymentDetails.find(d => d.mode === "wallet");
            
            let remainingAmount = totalAmount;
            const updatedDetails = [...splitPaymentDetails];
            
            // First fill wallet if present
            if (walletDetail) {
              const walletBalance = wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits || 0;
              const walletAmount = Math.min(walletBalance, remainingAmount);
              const walletIndex = updatedDetails.findIndex(d => d.mode === "wallet");
              updatedDetails[walletIndex].amount = Math.round(walletAmount * 100) / 100;
              remainingAmount -= walletAmount;
            }
            
            // Distribute remaining equally among non-wallet methods
            if (nonWalletDetails.length > 0 && remainingAmount > 0) {
              const equalAmount = remainingAmount / nonWalletDetails.length;
              nonWalletDetails.forEach((detail, idx) => {
                const detailIndex = updatedDetails.findIndex(d => d.mode === detail.mode);
                updatedDetails[detailIndex].amount = Math.round(equalAmount * 100) / 100;
              });
            }
            
            setSplitPaymentDetails(updatedDetails);
            const totalPaid = updatedDetails.reduce((sum, d) => sum + d.amount, 0);
            setAmountPaid(totalPaid);
            setPaymentStatus("paid");
          }}
        >
          Fill All
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => {
            const updatedDetails = splitPaymentDetails.map((detail) => ({
              ...detail,
              amount: 0
            }));
            setSplitPaymentDetails(updatedDetails);
            setAmountPaid(0);
            setPaymentStatus("unpaid");
          }}
        >
          Clear All
        </Button>
      </div>
    )}
  </div>
)}

    {/* Wallet Alert */}
    {isWalletApplied && selectedWallet && (
      <div className="w-full col-span-2 mt-1">
        <Alert severity={wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits === 0 ? "error" : "info"} className="text-sm py-1">
          Wallet Balance: ₹{Math.round((wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits || 0) * 100) / 100}
          {wallets.find((w) => w.id === selectedWallet)?.remaining_price_benefits === 0 && " - Please recharge"}
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
                className={`block bg-black text-white py-2 rounded-md px-4 w-fit ${
                  activeStep === "Checkout" ? "visible" : "invisible"
                }`}
                onClick={(e) => {
                  if (appointment?.checkout) {
                    // If already checked out, just show the invoice
                    setInvoicePage(true);
                  } else {
                    // If not checked out, process the checkout
                    handleSubmit(e);
                    setInvoicePage(true);
                  }
                }}
              >
                {appointment?.checkout ? "View Invoice" : "Checkout"}
              </button>

              {/* Next button */}
              <button
                className={`block border border-black text-black py-2 rounded-md px-4 w-fit ${
                  activeStep === "Checkout" ||
                  (activeStep === "Service Details" &&
                    (Object.keys(staffContributionErrors).some(
                      (key) => staffContributionErrors[key]
                    ) ||
                      Object.keys(staffContributionErrors).some(
                        (key) =>
                          key.startsWith("offer_") &&
                          staffContributionErrors[key]
                      )))
                    ? "cursor-not-allowed opacity-30"
                    : ""
                }`}
                onClick={() => {
                  if (activeStep === "Customer Details") {
                    setActiveStep("Service Details");
                  } else if (activeStep === "Service Details") {
                    // Check if all staff contributions are valid before proceeding
                    const hasServiceErrors = Object.keys(
                      staffContributionErrors
                    ).some(
                      (key) =>
                        !key.startsWith("offer_") &&
                        staffContributionErrors[key]
                    );
                    const hasOfferErrors = Object.keys(
                      staffContributionErrors
                    ).some(
                      (key) =>
                        key.startsWith("offer_") && staffContributionErrors[key]
                    );

                    if (!hasServiceErrors && !hasOfferErrors) {
                      setActiveStep("Product Consumption");
                    } else {
                      handleToastMessage(
                        "Please fix all staff contribution errors before proceeding",
                        "error"
                      );
                    }
                  } else if (activeStep === "Product Consumption") {
                    setActiveStep("Purchase Product");
                  } else if (activeStep === "Purchase Product") {
                    setActiveStep("Checkout");
                  }
                }}
                disabled={
                  activeStep === "Checkout" ||
                  (activeStep === "Service Details" &&
                    (Object.keys(staffContributionErrors).some(
                      (key) => staffContributionErrors[key]
                    ) ||
                      Object.keys(staffContributionErrors).some(
                        (key) =>
                          key.startsWith("offer_") &&
                          staffContributionErrors[key]
                      )))
                }
              >
                Next
              </button>
            </div>
          </div>

          {invoicePage && (
            <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Typography
                      variant="h6"
                      className="font-semibold text-green-600"
                    >
                      {appointment?.appointment_status
                        ?.charAt(0)
                        .toUpperCase() +
                        appointment?.appointment_status?.slice(1) ||
                        "Completed"}
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
                              {service.staff && service.staff.length > 0 && (
                                <Typography
                                  variant="caption"
                                  component="span"
                                  className="ml-2 text-gray-500"
                                >
                                  (Staff:{" "}
                                  {service.staff
                                    .map((staffId) => {
                                      const staffMember = staffList.find(
                                        (s) => s.id === staffId
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
                            <Typography variant="body1">
                              ₹{service.discount}
                            </Typography>
                          </div>
                          <Typography variant="body2" color="textSecondary">
                            {formateTime(service.service_time)}
                            {service.from_membership && " • Membership Applied"}
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
                                        (s) => s.id === staffId
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
                            <Typography variant="body1">
                              ₹{offer.discount_price}
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
                    <Typography variant="body1">
                      Subtotal (Services):
                    </Typography>
                    <Typography variant="body1">
                      ₹ {totalFinalAmount}
                    </Typography>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Typography variant="body1">
                      Subtotal (Products):
                    </Typography>
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
                  {dueAmount > 0 && (
                    <div className="flex justify-between mb-2">
                      <Typography variant="body1">Due Amount:</Typography>
                      <Typography variant="body1">₹ {dueAmount}</Typography>
                    </div>
                  )}
                  {creditAmount > 0 && (
                    <div className="flex justify-between mb-2">
                      <Typography variant="body1">Credit Amount:</Typography>
                      <Typography variant="body1">₹ {creditAmount}</Typography>
                    </div>
                  )}

                  {/* Conditional Payment Method Display */}
                  {!splitPaymentMode || splitPaymentDetails.length === 0 ? (
                    // Single Payment Mode Display
                    <>
                      <div className="flex justify-between mb-2">
                        <Typography variant="body1">Payment Method:</Typography>
                        <Typography variant="body1" className="capitalize">
                          {paymentMode}
                        </Typography>
                      </div>
                      {paymentMode && amountPaid > 0 && (
                        <div className="flex justify-between mb-2">
                          <Typography variant="body1">
                            {paymentMode} Amount:
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
                      {splitPaymentDetails.map((detail, index) => (
                        <div key={index} className="flex justify-between mb-1">
                          <Typography variant="body1" className="capitalize">
                            {detail.mode}:
                          </Typography>
                          <Typography variant="body1">
                            ₹{detail.amount.toFixed(2)}
                          </Typography>
                        </div>
                      ))}
                      {/* Total of Split Payments */}
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
          )}

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
                  {/* <div className="flex justify-between">
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
                  </div> */}
                  <div className="flex justify-between">
                    <Typography variant="body2" className="font-semibold">
                      Valid Until:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(walletDetails.end_date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2" className="font-semibold">
                      Status:
                    </Typography>
                    <Typography
                      variant="body2"
                      className={
                        walletDetails.status === "active"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {walletDetails.status === "active" ? "Active" : "Expired"}
                    </Typography>
                  </div>
                  {walletDetails.Benefits &&
                    typeof walletDetails.Benefits === "object" && (
                      <div className="mt-2">
                        <Typography
                          variant="body2"
                          className="font-semibold mb-1"
                        >
                          Benefits:
                        </Typography>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          {Object.values(walletDetails.Benefits).map(
                            (benefit, index) => (
                              <li key={index} className="flex items-center">
                                <span className="ml-1 text-sm">{benefit}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </Box>
          </Modal>

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="invoice-modal-title"
            aria-describedby="invoice-modal-description"
          >
            <Box sx={style}>
              <h2 id="invoice-modal-title" className="text-xl font-bold mb-4">
                Generate Invoice
              </h2>

              <div className="flex flex-col gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MoreVertIcon />}
                  onClick={downloadInvoice}
                  disabled={isGeneratingInvoice}
                  fullWidth
                >
                  Download Invoice
                </Button>

                <div className="mt-4">
                  <p className="text-sm mb-2">Message to send with invoice:</p>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Ex : Thank you for visiting our salon! Here's your invoice. Thank you again for visiting our salon."
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  onClick={sendWhatsAppInvoice}
                  disabled={isGeneratingInvoice}
                  fullWidth
                >
                  Send via WhatsApp
                </Button>
              </div>
            </Box>
          </Modal>

          <Modal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            aria-labelledby="edit-product-modal-title"
          >
            <Box sx={style}>
              <h2
                id="edit-product-modal-title"
                className="text-xl font-bold mb-4"
              >
                Edit Product
              </h2>
              {editProductData && (
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Quantity"
                    type="number"
                    value={editProductData.qauntity}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        qauntity: parseInt(e.target.value),
                      })
                    }
                    fullWidth
                  />
                  <TextField
                    label="Price per Unit"
                    type="number"
                    value={editProductData.price_per_unit}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        price_per_unit: parseFloat(e.target.value),
                      })
                    }
                    fullWidth
                  />
                  <TextField
                    label="Discount"
                    type="number"
                    value={editProductData.discount}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        discount: parseFloat(e.target.value),
                      })
                    }
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Discount Unit</InputLabel>
                    <Select
                      value={editProductData.discount_unit}
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
                    value={editProductData.tax}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        tax: parseFloat(e.target.value),
                      })
                    }
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleProductEdit({
                        ...editProductData,
                        net_sub_total:
                          editProductData.qauntity *
                            editProductData.price_per_unit -
                          (editProductData.discount_unit === "percentage"
                            ? editProductData.qauntity *
                              editProductData.price_per_unit *
                              (editProductData.discount / 100)
                            : editProductData.discount),
                      })
                    }
                    fullWidth
                  >
                    Update Product
                  </Button>
                </div>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default EditAppointment;
