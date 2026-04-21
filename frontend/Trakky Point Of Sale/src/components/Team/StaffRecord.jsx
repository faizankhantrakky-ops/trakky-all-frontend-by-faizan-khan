import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { useConfirm } from "material-ui-confirm";
import "./DailySheet.css";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import {
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Box,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
  Select,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import GeneralModal from "../generalModal/GeneralModal";
import RegisterStaff from "./RegisterStaff";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import jsPDF from "jspdf";

function StaffRecord({ startDate, endDate }) {
  const { authTokens, vendorData } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalOpenData, setEditModalOpenData] = useState({});
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const staffIdParam = searchParams.get("staff_id");
  // Modals
  const [eyeModalOpen, setEyeModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [idProofModalOpen, setIdProofModalOpen] = useState(false);
  const [currentIdProof, setCurrentIdProof] = useState("");
  const [staffDetailsModalOpen, setStaffDetailsModalOpen] = useState(false);
  const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
  // Date filters for appointments
  const [appointmentStartDate, setAppointmentStartDate] = useState(startDate);
  const [appointmentEndDate, setAppointmentEndDate] = useState(endDate);
  // For Staff Details Modal appointments
  const [staffDetailsAppointmentsData, setStaffDetailsAppointmentsData] =
    useState([]);
  const [staffDetailsAppointmentsLoading, setStaffDetailsAppointmentsLoading] =
    useState(false);

  // Totals
  const [serviceTotals, setServiceTotals] = useState({});
  const [productTotals, setProductTotals] = useState({});

  // Staff wise total appointments
  const [staffAppointmentCounts, setStaffAppointmentCounts] = useState({});
  const [staffAppointmentAmounts, setStaffAppointmentAmounts] = useState({});
  const [totalLoading, setTotalLoading] = useState(false);
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [presentFilter, setPresentFilter] = useState("");
  const staffRoles = [
    ...new Set(staffData.map((s) => s.staff_role).filter(Boolean)),
  ];
  /* ------------------------------------------------------------------ */
  /* FETCH STAFF LIST */
  /* ------------------------------------------------------------------ */
  const fetchData = async () => {
    setLoading(true);
    try {
      // 👉 Internet check first
      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }

      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        // 👉 Internet ON hai tabhi
        console.error("Failed to fetch staff:", res.status);
        toast.error("Something went wrong. Please try again");
        return;
      }

      const data = await res.json();
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => b.id - a.id)
        : [];

      setStaffData(sorted);
      fetchAppointmentTotals(sorted);
      fetchAllStaffAppointments(sorted);
    } catch (err) {
      // 👉 Internet OFF during request
      if (!navigator.onLine) {
        toast.error("No Internet Connection");
        return;
      }

      // 👉 Internet ON case
      console.error(err);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* FETCH SERVICE / PRODUCT TOTALS FOR EACH STAFF */
  /* ------------------------------------------------------------------ */
  const fetchAppointmentTotals = async (staffList) => {
    const serviceT = {},
      productT = {};

    // 👉 Internet check once (loop ke andar noise nahi)
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      staffList.forEach((staff) => {
        serviceT[staff.id] = 0;
        productT[staff.id] = 0;
      });
      setServiceTotals(serviceT);
      setProductTotals(productT);
      return;
    }

    for (const staff of staffList) {
      try {
        const res = await fetch(
          `https://backendapi.trakky.in/salonvendor/appointments-new/?staff_id=${staff.id}&start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        let serviceAmt = 0,
          productAmt = 0;

        data.forEach((appt) => {
          if (appt.is_delete !== true) {
            // 👉 Service calculation (main logic)
            if (
              appt.staff_contributions &&
              Array.isArray(appt.staff_contributions)
            ) {
              appt.staff_contributions.forEach((contribution) => {
                if (
                  contribution.staff_distribution &&
                  Array.isArray(contribution.staff_distribution)
                ) {
                  const isStaffInDistribution =
                    contribution.staff_distribution.some(
                      (s) => s?.staff_id === staff?.id
                    );

                  if (isStaffInDistribution) {
                    const service = (appt.included_services || []).find(
                      (s) => s?.service_id === contribution?.service_id
                    );

                    const offer = (appt.included_offers || []).find(
                      (o) => o?.offer_id === contribution?.offer_id
                    );

                    if (service) {
                      serviceAmt += parseFloat(service.final_price) || 0;
                    } else if (offer) {
                      serviceAmt += parseFloat(offer.discounted_price) || 0;
                    }
                  }
                }
              });
            }

            // 👉 Fallback logic (unchanged)
            if (serviceAmt === 0) {
              (appt.included_services || []).forEach((s) => {
                if (Array.isArray(s?.staff) && s.staff.includes(staff?.id)) {
                  serviceAmt += parseFloat(s.final_price) || 0;
                }
              });

              (appt.included_offers || []).forEach((o) => {
                if (Array.isArray(o?.staff) && o.staff.includes(staff?.id)) {
                  serviceAmt += parseFloat(o.discounted_price) || 0;
                }
              });
            }

            // 👉 Product amount
            productAmt += parseFloat(
              appt.selled_product_details?.total_amount || 0
            );
          }
        });

        serviceT[staff.id] = serviceAmt;
        productT[staff.id] = productAmt;
      } catch {
        // ❌ No console / toast here
        serviceT[staff.id] = 0;
        productT[staff.id] = 0;
      }
    }

    setServiceTotals(serviceT);
    setProductTotals(productT);
  };

  /* ------------------------------------------------------------------ */
  /* FETCH APPOINTMENTS FOR ALL STAFF - TOTAL COUNT & AMOUNT */
  /* ------------------------------------------------------------------ */

  const fetchAllStaffAppointments = async (staffList) => {
    setTotalLoading(true);

    const appointmentCounts = {};
    const appointmentAmounts = {};

    // 👉 Internet check once (global guard)
    if (!navigator.onLine) {
      toast.error("No Internet Connection");

      staffList.forEach((staff) => {
        appointmentCounts[staff.id] = 0;
        appointmentAmounts[staff.id] = 0;
      });

      setStaffAppointmentCounts(appointmentCounts);
      setStaffAppointmentAmounts(appointmentAmounts);
      setTotalLoading(false);
      return;
    }

    for (const staff of staffList) {
      try {
        const res = await fetch(
          `https://backendapi.trakky.in/salonvendor/appointments-new/?staff_id=${staff.id}&start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        // 👉 Filter deleted appointments (logic unchanged)
        const validAppointments = data.filter(
          (appt) => appt.is_delete !== true
        );

        // 👉 Count appointments
        appointmentCounts[staff.id] = validAppointments.length || 0;

        // 👉 Calculate total amount
        let totalAmount = 0;
        validAppointments.forEach((appt) => {
          totalAmount += parseFloat(appt.final_amount || 0);
        });

        appointmentAmounts[staff.id] = totalAmount;
      } catch {
        // ❌ No console / toast here
        appointmentCounts[staff.id] = 0;
        appointmentAmounts[staff.id] = 0;
      }
    }

    setStaffAppointmentCounts(appointmentCounts);
    setStaffAppointmentAmounts(appointmentAmounts);
    setTotalLoading(false);
  };

  /* ------------------------------------------------------------------ */
  /* FETCH APPOINTMENTS FOR A SINGLE STAFF (FOR MODAL) */
  /* ------------------------------------------------------------------ */
  const fetchAppointmentsData = async (staffId) => {
    setAppointmentsLoading(true);

    // 👉 Internet check first
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      setAppointmentsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?staff_id=${staffId}&start_date=${appointmentStartDate}&end_date=${appointmentEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAppointmentsData(data);
    } catch {
      // 👉 Internet ON but API issue
      toast.error("Something went wrong. Please try again");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* FETCH APPOINTMENTS FOR STAFF DETAILS MODAL */
  /* ------------------------------------------------------------------ */
  const fetchStaffDetailsAppointmentsData = async (staffId) => {
    setStaffDetailsAppointmentsLoading(true);

    // 👉 Internet check first
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      setStaffDetailsAppointmentsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setStaffDetailsAppointmentsData(data);
    } catch {
      // 👉 Internet ON but API / server issue
      toast.error("Something went wrong. Please try again");
    } finally {
      setStaffDetailsAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);
  useEffect(() => {
    if (staffIdParam && staffData.length) {
      const staff = staffData.find((s) => s.id.toString() === staffIdParam);
      if (staff) handleAppointmentsClick(staff);
    }
  }, [staffIdParam, staffData]);
  /* ------------------------------------------------------------------ */
  /* IMPROVED: COMMISSION CALCULATION FUNCTION */
  /* ------------------------------------------------------------------ */
  const calculateCommission = (slab, amount) => {
    if (!slab || amount === 0) return { commission: 0, percentage: 0 };

    // Check if slab is string (needs parsing) or already an object
    let commissionSlab;
    try {
      if (typeof slab === "string") {
        commissionSlab = JSON.parse(slab);
      } else if (typeof slab === "object") {
        commissionSlab = slab;
      } else {
        return { commission: 0, percentage: 0 };
      }
    } catch (error) {
      console.error("Error parsing commission slab:", error);
      return { commission: 0, percentage: 0 };
    }

    let commissionPercentage = 0;

    try {
      // Slab ko array mein convert karo
      const slabEntries = Object.entries(commissionSlab);

      // Har slab ke liye check karo
      for (const [percentageStr, range] of slabEntries) {
        // Percentage extract karo (e.g., "30%" -> 30)
        const percentage = parseFloat(percentageStr.replace("%", "").trim());

        // Range parse karo (e.g., "100-5000")
        if (range && typeof range === "string") {
          const [minStr, maxStr] = range.split("-");
          const min = parseFloat(minStr);
          const max = parseFloat(maxStr);

          // Check if amount is within range
          if (amount >= min && amount <= max) {
            commissionPercentage = percentage;
            break;
          }
        }
      }

      const commission = (amount * commissionPercentage) / 100;
      return {
        commission: parseFloat(commission.toFixed(2)),
        percentage: commissionPercentage,
      };
    } catch (error) {
      console.error("Error calculating commission:", error);
      return { commission: 0, percentage: 0 };
    }
  };
  /* ------------------------------------------------------------------ */
  /* CALCULATE TOTAL COMMISSION FROM APPOINTMENTS DATA */
  /* ------------------------------------------------------------------ */
  const calculateTotalCommissionFromAppointments = (appointments, staff) => {
    let totalServiceCommission = 0;
    let totalProductCommission = 0;
    let totalServiceAmount = 0;
    let totalProductAmount = 0;

    if (!appointments || !staff)
      return {
        totalServiceCommission: 0,
        totalProductCommission: 0,
        totalCommission: 0,
        totalServiceAmount: 0,
        totalProductAmount: 0,
      };

    appointments.forEach((appt) => {
      // Skip deleted appointments
      if (appt.is_delete === true) return;

      let serviceAmt = 0,
        productAmt = 0;

      // Calculate service amount for this specific staff
      if (appt.staff_contributions && Array.isArray(appt.staff_contributions)) {
        appt.staff_contributions.forEach((contribution) => {
          if (
            contribution.staff_distribution &&
            Array.isArray(contribution.staff_distribution)
          ) {
            const isStaffInDistribution = contribution.staff_distribution.some(
              (s) => s?.staff_id === staff?.id
            );

            if (isStaffInDistribution) {
              const service = (appt.included_services || []).find(
                (s) => s?.service_id === contribution?.service_id
              );

              const offer = (appt.included_offers || []).find(
                (o) => o?.offer_id === contribution?.offer_id
              );

              if (service) {
                serviceAmt += parseFloat(service.final_price) || 0;
              } else if (offer) {
                serviceAmt += parseFloat(offer.discounted_price) || 0;
              }
            }
          }
        });
      }

      // Fallback method
      if (serviceAmt === 0) {
        (appt.included_services || []).forEach((s) => {
          if (Array.isArray(s?.staff) && s.staff.includes(staff?.id))
            serviceAmt += parseFloat(s.final_price) || 0;
        });
        (appt.included_offers || []).forEach((o) => {
          if (Array.isArray(o?.staff) && o.staff.includes(staff?.id))
            serviceAmt += parseFloat(o.discounted_price) || 0;
        });
      }

      productAmt = parseFloat(appt.selled_product_details?.total_amount || 0);

      // Calculate commissions
      const { commission: sComm } = calculateCommission(
        staff?.commission_slab,
        serviceAmt
      );
      const { commission: pComm } = calculateCommission(
        staff?.commission_slab_for_product,
        productAmt
      );

      totalServiceCommission += sComm;
      totalProductCommission += pComm;
      totalServiceAmount += serviceAmt;
      totalProductAmount += productAmt;
    });

    const totalCommission = totalServiceCommission + totalProductCommission;

    return {
      totalServiceCommission,
      totalProductCommission,
      totalCommission,
      totalServiceAmount,
      totalProductAmount,
    };
  };
  /* ------------------------------------------------------------------ */
  /* TOGGLE ACTIVE / DEACTIVE */
  /* ------------------------------------------------------------------ */
  const togglePresentStatus = async (staff) => {
    const newVal = !staff.is_permanent;
    // 🗓️ Set exit_date = today + 2 years
    const today = new Date();
    const exitDate = new Date(today.setFullYear(today.getFullYear() + 2))
      .toISOString()
      .split("T")[0]; // Format: YYYY-MM-DD
    const formData = new FormData();
    formData.append("is_permanent", newVal);
    formData.append("exit_date", exitDate);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/${staff.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStaffData((prev) =>
        prev.map((s) =>
          s.id === staff.id
            ? {
                ...s,
                is_permanent: updated.is_permanent,
                exit_date: updated.exit_date,
              }
            : s
        )
      );
      toast.success(
        `${staff.staffname} is now ${
          newVal ? "Active" : "Deactive"
        } (Exit Date: ${exitDate})`
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };
  /* ------------------------------------------------------------------ */
  /* DELETE */
  /* ------------------------------------------------------------------ */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      setStaffData((prev) => prev.filter((s) => s.id !== id));
      toast.success("Staff deleted");
    } catch {
      toast.error("Delete failed");
    }
  };
  const handleDeleteConfirmation = (id) =>
    confirm({ description: "Delete this staff?" })
      .then(() => handleDelete(id))
      .catch(() => {});
  /* ------------------------------------------------------------------ */
  /* MODAL HANDLERS */
  /* ------------------------------------------------------------------ */
  const handleAppointmentsClick = (staff) => {
    setSelectedStaff(staff);
    setAppointmentStartDate(startDate);
    setAppointmentEndDate(endDate);
    fetchAppointmentsData(staff.id);
    setAppointmentsModalOpen(true);
  };
  const handleInfoClick = async (staff) => {
    setSelectedStaffForDetails(staff);
    setStaffDetailsModalOpen(true);
    // Fetch appointments data for staff details modal
    fetchStaffDetailsAppointmentsData(staff.id);
  };
  const handleEyeClick = (appt) => {
    setSelectedAppointment(appt);
    setEyeModalOpen(true);
  };
  const handleStaffDetailsEyeClick = (appt) => {
    setSelectedAppointment(appt);
    setEyeModalOpen(true);
  };
  const handleIdProofClick = (url) => {
    setCurrentIdProof(url);
    setIdProofModalOpen(true);
  };
  const downloadIdProof = () => {
    if (!currentIdProof) return;
    const a = document.createElement("a");
    a.href = currentIdProof;
    a.download = currentIdProof.split("/").pop() || "id_proof";
    a.click();
  };
  /* ------------------------------------------------------------------ */
  /* HELPERS */
  /* ------------------------------------------------------------------ */
  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amt || 0);
  const formatDate = (d) => format(new Date(d), "dd MMM yyyy");
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  /* ------------------------------------------------------------------ */
  /* RENDER APPOINTMENTS TABLE ROW - COMMON FUNCTION */
  /* ------------------------------------------------------------------ */
  const renderAppointmentRow = (appt, staff, handleEyeClickFunction) => {
    if (!staff || !appt) return null;

    // COMPLETELY SKIP (DO NOT RENDER) IF APPOINTMENT IS DELETED
    if (appt.is_delete === true) {
      return null; // ← This removes it from the table entirely
    }

    let serviceAmt = 0,
      productAmt = 0;

    // Method 1: Calculate from staff_contributions
    if (appt.staff_contributions && Array.isArray(appt.staff_contributions)) {
      appt.staff_contributions.forEach((contribution) => {
        if (
          contribution.staff_distribution &&
          Array.isArray(contribution.staff_distribution)
        ) {
          const isStaffInDistribution = contribution.staff_distribution.some(
            (s) => s?.staff_id === staff?.id
          );

          if (isStaffInDistribution) {
            const service = (appt.included_services || []).find(
              (s) => s?.service_id === contribution?.service_id
            );

            const offer = (appt.included_offers || []).find(
              (o) => o?.offer_id === contribution?.offer_id
            );

            if (service) {
              serviceAmt += parseFloat(service.final_price) || 0;
            } else if (offer) {
              serviceAmt += parseFloat(offer.discounted_price) || 0;
            }
          }
        }
      });
    }

    // Method 2: Fallback to included_services/included_offers
    if (serviceAmt === 0) {
      (appt.included_services || []).forEach((s) => {
        if (Array.isArray(s?.staff) && s.staff.includes(staff?.id))
          serviceAmt += parseFloat(s.final_price) || 0;
      });
      (appt.included_offers || []).forEach((o) => {
        if (Array.isArray(o?.staff) && o.staff.includes(staff?.id))
          serviceAmt += parseFloat(o.discounted_price) || 0;
      });
    }

    // Calculate product amount
    productAmt = parseFloat(appt.selled_product_details?.total_amount || 0);

    // Calculate commissions
    const { commission: sComm, percentage: sPct } = calculateCommission(
      staff?.commission_slab,
      serviceAmt
    );
    const { commission: pComm, percentage: pPct } = calculateCommission(
      staff?.commission_slab_for_product,
      productAmt
    );

    const totalCommission = sComm + pComm;

    return (
      <TableRow key={appt.id} hover>
        <TableCell>
          <Typography variant="body2" fontWeight="bold">
            #{appt.id}
          </Typography>
        </TableCell>
        <TableCell>{appt.customer_name}</TableCell>
        <TableCell>{appt.customer_phone}</TableCell>
        <TableCell>
          {(appt.included_services || []).map((s) => (
            <div key={s.service_id} style={{ fontSize: "12px" }}>
              {s.service_name}
            </div>
          ))}
          {(appt.included_offers || []).map((o) => (
            <div key={o.offer_id} style={{ fontSize: "12px" }}>
              {o.offer_name}
            </div>
          ))}
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="bold" color="green">
            {formatCurrency(serviceAmt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="blue">
            {formatCurrency(productAmt)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight="bold" color="orange">
            {sPct > 0 ? `${sPct}%` : "-"} → {formatCurrency(sComm)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="purple">
            {pPct > 0 ? `${pPct}%` : "-"} → {formatCurrency(pComm)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            fontWeight="bold"
            color="success.main"
            sx={{ backgroundColor: "#e8f5e9", px: 1, py: 0.5, borderRadius: 1 }}
          >
            {formatCurrency(totalCommission)}
          </Typography>
        </TableCell>
        <TableCell>{formatDate(appt.date)}</TableCell>
        <TableCell>
          <Chip
            label={appt.appointment_status?.toUpperCase() || "N/A"}
            color={getStatusColor(appt.appointment_status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Tooltip title="Full Details">
            <IconButton
              size="small"
              onClick={() => handleEyeClickFunction(appt)}
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };
  /* ------------------------------------------------------------------ */
  /* FILTERED DATA */
  /* ------------------------------------------------------------------ */
  const filteredStaffData = staffData
    .filter((s) => {
      const n = s.staffname?.toLowerCase().includes(nameFilter.toLowerCase());
      const r = !roleFilter || s.staff_role === roleFilter;
      const m = !mobileFilter || s.ph_number?.includes(mobileFilter);
      const st =
        !statusFilter ||
        (statusFilter === "permanent" && s.is_permanent) ||
        (statusFilter === "temporary" && !s.is_permanent);
      const p =
        presentFilter === "" ||
        (presentFilter === "present" && s.is_permanent) ||
        (presentFilter === "not_present" && !s.is_permanent);
      return n && r && m && st && p;
    })
    .sort((a, b) => b.id - a.id);
  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ---------- FILTERS ---------- */}
      <div className="w-full px-4 mt-5">
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Staff Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Staff Roles</InputLabel>
                <Select
                  value={roleFilter}
                  label="Staff Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {staffRoles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="permanent">Permanent</MenuItem>
                  <MenuItem value="temporary">Temporary</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={presentFilter}
                  label="Status"
                  onChange={(e) => setPresentFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="present">Active</MenuItem>
                  <MenuItem value="not_present">Deactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ textAlign: "right" }}>
              <Typography variant="h6" color="primary">
                Total: {filteredStaffData.length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
      {/* ---------- MAIN TABLE ---------- */}
      <div className="w-full pb-2 px-4 overflow-auto mt-5">
        <table className="border-collapse w-full bg-white rounded-lg text-center min-w-max">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">Sr. No.</th>
              <th className="border border-gray-200 p-2">Staff Name</th>
              <th className="border border-gray-200 p-2">Staff Role</th>
              <th className="border border-gray-200 p-2">Status</th>
              <th className="border border-gray-200 p-2">Active Status</th>
              <th className="border border-gray-200 p-2">Contact no.</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Gender</th>

              <th className="border border-gray-200 p-2 bg-blue-50">
                Appointments
              </th>
              <th className="border border-gray-200 p-2">More Info</th>
              <th className="border border-gray-200 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="h-40">
                <td colSpan="13">
                  <CircularProgress sx={{ color: "#000", margin: "auto" }} />
                </td>
              </tr>
            ) : filteredStaffData.length ? (
              filteredStaffData.map((item, idx) => {
                const serviceAmt = serviceTotals[item.id] || 0;

                return (
                  <tr key={item.id}>
                    <td className="border border-gray-200 p-2">{idx + 1}</td>
                    <td className="border border-gray-200 p-2">
                      {item.staffname}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.staff_role || "No Role"}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.is_permanent ? "Permanent" : "Temporary"}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <Chip
                        label={item.is_permanent ? "Active" : "Deactive"}
                        color={item.is_permanent ? "success" : "error"}
                        size="small"
                        icon={
                          item.is_permanent ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )
                        }
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.ph_number || "—"}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.email || "—"}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item.gender}
                    </td>

                    {/* Appointments (Eye Icon) */}
                    <td className="border border-gray-200 p-2">
                      <div className="flex items-center justify-center gap-2">
                        {totalLoading ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Tooltip title="Total appointments for selected date range">
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                staffAppointmentCounts[item.id] > 0
                                  ? "blue"
                                  : "gray"
                              }
                            >
                              {staffAppointmentCounts[item.id] || 0}
                            </Typography>
                          </Tooltip>
                        )}
                        <Tooltip title="View Appointments Details">
                          <IconButton
                            size="small"
                            onClick={() => handleAppointmentsClick(item)}
                          >
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                    {/* Info */}
                    <td className="border border-gray-200 p-2">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleInfoClick(item)}>
                          <InfoIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    {/* Action */}
                    <td className="border border-gray-200 p-2">
                      <Tooltip
                        title={
                          item.is_permanent ? "Mark Deactive" : "Mark Active"
                        }
                      >
                        <IconButton
                          onClick={() => togglePresentStatus(item)}
                          color={item.is_permanent ? "success" : "error"}
                        >
                          {item.is_permanent ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={() => {
                          setEditModalOpenData(item);
                          setEditModalOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirmation(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="h-40 text-center">
                <td colSpan="13">No staff data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Toaster position="top-center" />
      {/* ---------- EDIT MODAL ---------- */}
      <GeneralModal
        open={editModalOpen}
        handleClose={() => {
          setEditModalOpenData({});
          setEditModalOpen(false);
        }}
      >
        <RegisterStaff
          staffData={editModalOpenData}
          handleClose={() => {
            setEditModalOpenData({});
            setEditModalOpen(false);
          }}
          fetchData={fetchData}
        />
      </GeneralModal>
      {/* ---------- STAFF DETAILS MODAL ---------- */}
      <Dialog
        open={staffDetailsModalOpen}
        onClose={() => {
          setStaffDetailsModalOpen(false);
          setSelectedStaffForDetails(null);
          setStaffDetailsAppointmentsData([]);
        }}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ p: 3, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6" fontWeight={600}>
            Staff Details: {selectedStaffForDetails?.staffname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {selectedStaffForDetails?.id} • Date Range: {startDate} to{" "}
            {endDate}
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {/* Basic Information Section */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <strong>Name:</strong> {selectedStaffForDetails?.staffname}
              </Grid>
              <Grid item xs={6}>
                <strong>Role:</strong>{" "}
                {selectedStaffForDetails?.staff_role || "—"}
              </Grid>
              <Grid item xs={6}>
                <strong>Status:</strong>{" "}
                {selectedStaffForDetails?.is_permanent
                  ? "Permanent"
                  : "Temporary"}
              </Grid>
              <Grid item xs={6}>
                <strong>Active:</strong>{" "}
                <Chip
                  label={
                    selectedStaffForDetails?.is_permanent
                      ? "Active"
                      : "Deactive"
                  }
                  color={
                    selectedStaffForDetails?.is_permanent ? "success" : "error"
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <strong>Contact:</strong>{" "}
                {selectedStaffForDetails?.ph_number || "—"}
              </Grid>
              <Grid item xs={6}>
                <strong>Email:</strong> {selectedStaffForDetails?.email || "—"}
              </Grid>
              <Grid item xs={6}>
                <strong>Gender:</strong>{" "}
                {selectedStaffForDetails?.gender || "—"}
              </Grid>
              <Grid item xs={6}>
                <strong>Salary:</strong>{" "}
                {formatCurrency(
                  parseFloat(selectedStaffForDetails?.salary || 0)
                )}
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {/* Commission Slabs Display */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="info.main" gutterBottom>
              Commission Slabs
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="primary"
                    gutterBottom
                  >
                    Service Commission Slab
                  </Typography>
                  {selectedStaffForDetails?.commission_slab ? (
                    <Box>
                      {(() => {
                        let slab = selectedStaffForDetails.commission_slab;
                        try {
                          if (typeof slab === "string") {
                            slab = JSON.parse(slab);
                          }
                        } catch (e) {
                          console.error("Error parsing service slab:", e);
                        }

                        if (typeof slab === "object" && slab !== null) {
                          return Object.entries(slab).map(
                            ([percentage, range], idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="body2" fontWeight={600}>
                                  {percentage}
                                </Typography>
                                <Typography variant="body2">{range}</Typography>
                              </Box>
                            )
                          );
                        } else {
                          return (
                            <Typography variant="body2" color="error">
                              Invalid slab format
                            </Typography>
                          );
                        }
                      })()}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No service commission slab
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="primary"
                    gutterBottom
                  >
                    Product Commission Slab
                  </Typography>
                  {selectedStaffForDetails?.commission_slab_for_product ? (
                    <Box>
                      {(() => {
                        let slab =
                          selectedStaffForDetails.commission_slab_for_product;
                        try {
                          if (typeof slab === "string") {
                            slab = JSON.parse(slab);
                          }
                        } catch (e) {
                          console.error("Error parsing product slab:", e);
                        }

                        if (typeof slab === "object" && slab !== null) {
                          return Object.entries(slab).map(
                            ([percentage, range], idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="body2" fontWeight={600}>
                                  {percentage}
                                </Typography>
                                <Typography variant="body2">{range}</Typography>
                              </Box>
                            )
                          );
                        } else {
                          return (
                            <Typography variant="body2" color="error">
                              Invalid slab format
                            </Typography>
                          );
                        }
                      })()}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No product commission slab
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {/* Appointments Table - SAME AS APPOINTMENTS MODAL */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Appointments List ({startDate} to {endDate})
            </Typography>

            {staffDetailsAppointmentsLoading ? (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
              </Paper>
            ) : staffDetailsAppointmentsData.length ? (
              <Box sx={{ overflow: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>Appt ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Services</TableCell>
                      <TableCell>Service Amt</TableCell>
                      <TableCell>Product Amt</TableCell>
                      <TableCell>Service Comm.</TableCell>
                      <TableCell>Product Comm.</TableCell>
                      <TableCell>Total Comm.</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffDetailsAppointmentsData.map((appt) =>
                      renderAppointmentRow(
                        appt,
                        selectedStaffForDetails,
                        handleStaffDetailsEyeClick
                      )
                    )}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                No appointments found
              </Paper>
            )}
          </Box>
          {/* Total Commission Calculation */}
          {selectedStaffForDetails &&
            staffDetailsAppointmentsData.length > 0 && (
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#f8f9fa",
                  borderTop: "2px solid #dee2e6",
                }}
              >
                <Typography variant="h6" color="success.main" gutterBottom>
                  Commission Calculation Summary
                </Typography>

                {(() => {
                  const commissions = calculateTotalCommissionFromAppointments(
                    staffDetailsAppointmentsData,
                    selectedStaffForDetails
                  );
                  const salary = parseFloat(
                    selectedStaffForDetails.salary || 0
                  );
                  const totalPayable = salary + commissions.totalCommission;

                  return (
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        border: "2px solid #28a745",
                        borderRadius: 2,
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: "#e8f5e9",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>Total Service Amount</strong>
                            </Typography>
                            <Typography
                              variant="h6"
                              color="green"
                              fontWeight={700}
                            >
                              {formatCurrency(commissions.totalServiceAmount)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Service Commission</strong>
                            </Typography>
                            <Typography
                              variant="h5"
                              color="orange"
                              fontWeight={700}
                            >
                              {formatCurrency(
                                commissions.totalServiceCommission
                              )}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: "#e3f2fd",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>Total Product Amount</strong>
                            </Typography>
                            <Typography
                              variant="h6"
                              color="blue"
                              fontWeight={700}
                            >
                              {formatCurrency(commissions.totalProductAmount)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Product Commission</strong>
                            </Typography>
                            <Typography
                              variant="h5"
                              color="purple"
                              fontWeight={700}
                            >
                              {formatCurrency(
                                commissions.totalProductCommission
                              )}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: "#fff3e0",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              <strong>Fixed Salary</strong>
                            </Typography>
                            <Typography
                              variant="h5"
                              color="primary"
                              fontWeight={700}
                            >
                              {formatCurrency(salary)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Total Commission</strong>
                            </Typography>
                            <Typography
                              variant="h5"
                              color="success.main"
                              fontWeight={700}
                            >
                              {formatCurrency(commissions.totalCommission)}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper
                            elevation={3}
                            sx={{
                              p: 2,
                              backgroundColor: "#1b5e20",
                              borderRadius: 1,
                              mt: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography variant="h6" color="white">
                                  <strong>TOTAL PAYABLE AMOUNT</strong>
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="rgba(255,255,255,0.8)"
                                >
                                  Salary + Total Commission
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="h4"
                                  color="white"
                                  fontWeight={800}
                                >
                                  {formatCurrency(totalPayable)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="rgba(255,255,255,0.8)"
                                >
                                  Salary: {formatCurrency(salary)} + Commission:{" "}
                                  {formatCurrency(commissions.totalCommission)}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })()}
              </Box>
            )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setStaffDetailsModalOpen(false);
              setSelectedStaffForDetails(null);
              setStaffDetailsAppointmentsData([]);
            }}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedStaffForDetails) {
                handleAppointmentsClick(selectedStaffForDetails);
                setStaffDetailsModalOpen(false);
              }
            }}
            startIcon={<VisibilityIcon />}
          >
            Open in Full View
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (!selectedStaffForDetails || !vendorData) return;

              const staff = selectedStaffForDetails;
              const appointments = staffDetailsAppointmentsData.filter(
                (appt) => appt.is_delete !== true
              );
              const commissions = calculateTotalCommissionFromAppointments(
                staffDetailsAppointmentsData,
                staff
              );
              const salary = parseFloat(staff.salary || 0);
              const totalPayable = salary + commissions.totalCommission;

              const formatAmount = (amt) =>
                new Intl.NumberFormat("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(amt || 0);  

              const doc = new jsPDF("p", "mm", "a4");
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              let y = 20;

              // === CLASSIC PROFESSIONAL HEADER (Text Only - No Image) ===
              doc.setFillColor(248, 249, 250);
              doc.rect(0, 0, pageWidth, 60, "F");

              // Salon Name - Large & Bold
              doc.setFontSize(26);
              doc.setFont("helvetica", "bold");
              doc.setTextColor(30, 30, 30);
              doc.text(
                vendorData?.salon_name || "Trakky Salon",
                pageWidth / 2,
                25,
                { align: "center" }
              );

              // Subtitle
              doc.setFontSize(12);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(80, 80, 80);
              doc.text("Premium Hair & Beauty Salon", pageWidth / 2, 33, {
                align: "center",
              });

              // Title
              doc.setFontSize(18);
              doc.setFont("helvetica", "bold");
              doc.setTextColor(0, 0, 0);
              doc.text("STAFF PAY SLIP", pageWidth / 2, 48, {
                align: "center",
              });

              // Period
              doc.setFontSize(12);
              doc.text(
                `Pay Period: ${startDate} to ${endDate}`,
                pageWidth / 2,
                58,
                { align: "center" }
              );

              y = 75;

              // === STAFF INFORMATION TABLE ===
              doc.autoTable({
                startY: y,
                head: [["Employee Details", "Information"]],
                body: [
                  ["Name", staff.staffname || "-"],
                  ["Staff ID", staff.id || "-"],
                  ["Role", staff.staff_role || "-"],
                  ["Contact", staff.ph_number || "-"],
                  ["Email", staff.email || "-"],
                  ["Gender", staff.gender || "-"],
                  [
                    "Employment Type",
                    staff.is_permanent ? "Permanent" : "Temporary",
                  ],
                  ["Fixed Salary", +formatAmount(salary)],
                ],
                theme: "grid",
                headStyles: {
                  fillColor: [40, 60, 90],
                  textColor: 255,
                  fontStyle: "bold",
                  fontSize: 11,
                },
                bodyStyles: { fontSize: 10, cellPadding: 5 },
                alternateRowStyles: { fillColor: [245, 248, 250] },
                columnStyles: {
                  0: { fontStyle: "bold", cellWidth: 60 },
                  1: { cellWidth: "auto" },
                },
                margin: { left: 20, right: 20 },
              });

              y = doc.lastAutoTable.finalY + 20;

              // === EARNINGS SUMMARY TABLE ===
              doc.autoTable({
                startY: y,
                head: [["Description", "Amount (₹)"]],
                body: [
                  [
                    "Total Service Sales",
                    formatAmount(commissions.totalServiceAmount),
                  ],
                  [
                    "Service Commission",
                    formatAmount(commissions.totalServiceCommission),
                  ],
                  [
                    "Total Product Sales",
                    formatAmount(commissions.totalProductAmount),
                  ],
                  [
                    "Product Commission",
                    formatAmount(commissions.totalProductCommission),
                  ],
                  [
                    "Total Commission Earned",
                    formatAmount(commissions.totalCommission),
                  ],
                  ["Fixed Salary", formatAmount(salary)],
                  ["TOTAL PAYABLE", formatAmount(totalPayable)],
                ],
                theme: "grid",
                headStyles: {
                  fillColor: [0, 102, 102],
                  textColor: 255,
                  fontStyle: "bold",
                  fontSize: 12,
                },
                bodyStyles: { fontSize: 11, cellPadding: 6 },
                alternateRowStyles: { fillColor: [240, 250, 250] },
                columnStyles: {
                  0: { fontStyle: "bold", cellWidth: 110 },
                  1: { halign: "right", fontStyle: "bold" },
                },
                margin: { left: 20, right: 20 },
              });

              y = doc.lastAutoTable.finalY + 20;

              // === APPOINTMENTS DETAILS (Only if exists) ===
              if (appointments.length > 0) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Appointment Details", 20, y);
                y += 10;

                const tableData = appointments.map((appt) => {
                  let serviceAmt = 0,
                    productAmt = 0;
                  let sComm = 0,
                    pComm = 0;

                  // Your existing logic to calculate amounts
                  if (
                    appt.staff_contributions &&
                    Array.isArray(appt.staff_contributions)
                  ) {
                    appt.staff_contributions.forEach((contrib) => {
                      if (
                        contrib.staff_distribution?.some(
                          (s) => s?.staff_id === staff.id
                        )
                      ) {
                        const serv = (appt.included_services || []).find(
                          (s) => s.service_id === contrib.service_id
                        );
                        const off = (appt.included_offers || []).find(
                          (o) => o.offer_id === contrib.offer_id
                        );
                        if (serv)
                          serviceAmt += parseFloat(serv.final_price || 0);
                        if (off)
                          serviceAmt += parseFloat(off.discounted_price || 0);
                      }
                    });
                  }

                  if (serviceAmt === 0) {
                    (appt.included_services || []).forEach((s) => {
                      if (Array.isArray(s.staff) && s.staff.includes(staff.id))
                        serviceAmt += parseFloat(s.final_price || 0);
                    });
                    (appt.included_offers || []).forEach((o) => {
                      if (Array.isArray(o.staff) && o.staff.includes(staff.id))
                        serviceAmt += parseFloat(o.discounted_price || 0);
                    });
                  }

                  productAmt = parseFloat(
                    appt.selled_product_details?.total_amount || 0
                  );

                  const { commission: sc } = calculateCommission(
                    staff.commission_slab,
                    serviceAmt
                  );
                  const { commission: pc } = calculateCommission(
                    staff.commission_slab_for_product,
                    productAmt
                  );
                  sComm = sc;
                  pComm = pc;

                  return [
                    `#${appt.id}`,
                    appt.customer_name || "N/A",
                    formatDate(appt.date),
                    formatAmount(serviceAmt),
                    formatAmount(productAmt),
                    formatAmount(sComm),
                    formatAmount(pComm),
                    formatAmount(sComm + pComm),
                    appt.appointment_status?.toUpperCase() || "N/A",
                  ];
                });

                doc.autoTable({
                  startY: y,
                  head: [
                    [
                      "Appt ID",
                      "Customer",
                      "Date",
                      "Service",
                      "Product",
                      "Srv Comm",
                      "Prd Comm",
                      "Total Comm",
                      "Status",
                    ],
                  ],
                  body: tableData,
                  theme: "grid",
                  headStyles: {
                    fillColor: [70, 90, 120],
                    textColor: 255,
                    fontSize: 10,
                  },
                  styles: { fontSize: 9, cellPadding: 4 },
                  columnStyles: {
                    3: { halign: "right" },
                    4: { halign: "right" },
                    5: { halign: "right" },
                    6: { halign: "right" },
                    7: { halign: "right" },
                  },
                  margin: { left: 20, right: 20 },
                  pageBreak: "auto",
                  showHead: "everyPage",
                });
              }

              // === PROFESSIONAL FOOTER ===
              const pageCount = doc.getNumberOfPages();
              for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(180);
                doc.setLineWidth(0.5);
                doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.text(
                  `Generated on: ${new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`,
                  20,
                  pageHeight - 18
                );
                doc.text(
                  `Page ${i} of ${pageCount}`,
                  pageWidth - 40,
                  pageHeight - 18
                );
                doc.text(
                  "Confidential - For Internal Use Only",
                  pageWidth / 2,
                  pageHeight - 10,
                  { align: "center" }
                );
              }

              // Save PDF
              doc.save(
                `PaySlip_${(staff.staffname || "Staff").replace(
                  /\s+/g,
                  "_"
                )}_${startDate}_to_${endDate}.pdf`
              );
            }}
          >
            Download Staff Pay Slip
          </Button>
        </DialogActions>
      </Dialog>
      {/* ---------- APPOINTMENTS MODAL ---------- */}
      <Dialog
        open={appointmentsModalOpen}
        onClose={() => {
          setAppointmentsModalOpen(false);
          setSelectedStaff(null);
          setAppointmentsData([]);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ p: 3, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6" fontWeight={600}>
            {selectedStaff?.staffname}'s Appointments
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Showing all appointments from {appointmentStartDate} to{" "}
              {appointmentEndDate}
            </Typography>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              value={appointmentStartDate}
              onChange={(e) => setAppointmentStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={appointmentEndDate}
              onChange={(e) => setAppointmentEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => fetchAppointmentsData(selectedStaff?.id)}
              size="small"
            >
              Apply
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {appointmentsLoading ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress />
            </Paper>
          ) : appointmentsData.length ? (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Appt ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Service Amt</TableCell>
                  <TableCell>Product Amt</TableCell>
                  <TableCell>Service Comm.</TableCell>
                  <TableCell>Product Comm.</TableCell>
                  <TableCell>Total Comm.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointmentsData.map((appt) =>
                  renderAppointmentRow(appt, selectedStaff, handleEyeClick)
                )}
              </TableBody>
            </Table>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              No appointments found
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAppointmentsModalOpen(false);
              setSelectedStaff(null);
              setAppointmentsData([]);
            }}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* ---------- APPOINTMENT DETAIL (EYE) MODAL ---------- */}
      <Dialog
        open={eyeModalOpen}
        onClose={() => setEyeModalOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Appointment ID: {selectedAppointment?.id}
          </Typography>
          {selectedAppointment?.is_delete === true && (
            <Chip label="DELETED" color="error" size="small" sx={{ mt: 1 }} />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && selectedStaff ? (
            <Box sx={{ fontSize: "14px", lineHeight: 1.6 }}>
              {/* Customer */}
              <Box mb={3}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <strong>Name:</strong> {selectedAppointment.customer_name}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Phone:</strong> {selectedAppointment.customer_phone}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Email:</strong>{" "}
                    {selectedAppointment.customer_email || "—"}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Gender:</strong>{" "}
                    {selectedAppointment.customer_gender}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Type:</strong> {selectedAppointment.customer_type}
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              {/* Services & Offers Details */}
              <Box my={3}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Services & Offers
                </Typography>

                {/* Services */}
                {(selectedAppointment.included_services || []).length > 0 && (
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="green"
                      gutterBottom
                    >
                      Services:
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Service Name</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell>Staff Assigned</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(selectedAppointment.included_services || []).map(
                          (service, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{service.service_name}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(service.final_price)}
                              </TableCell>
                              <TableCell>
                                {Array.isArray(service.staff)
                                  ? service.staff.map((staffId, i) => (
                                      <Chip
                                        key={i}
                                        label={`Staff ID: ${staffId}`}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                        color={
                                          staffId === selectedStaff?.id
                                            ? "primary"
                                            : "default"
                                        }
                                      />
                                    ))
                                  : "No staff"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                )}
                {/* Offers */}
                {(selectedAppointment.included_offers || []).length > 0 && (
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="blue"
                      gutterBottom
                    >
                      Offers:
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Offer Name</TableCell>
                          <TableCell align="right">Discounted Price</TableCell>
                          <TableCell>Staff Assigned</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(selectedAppointment.included_offers || []).map(
                          (offer, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{offer.offer_name}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(offer.discounted_price)}
                              </TableCell>
                              <TableCell>
                                {Array.isArray(offer.staff)
                                  ? offer.staff.map((staffId, i) => (
                                      <Chip
                                        key={i}
                                        label={`Staff ID: ${staffId}`}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                        color={
                                          staffId === selectedStaff?.id
                                            ? "primary"
                                            : "default"
                                        }
                                      />
                                    ))
                                  : "No staff"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                )}
                {/* Staff Contributions */}
                {selectedAppointment.staff_contributions?.length > 0 && (
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="secondary"
                      gutterBottom
                    >
                      Staff Contributions:
                    </Typography>
                    {selectedAppointment.staff_contributions.map(
                      (contribution, idx) => {
                        const service = (
                          selectedAppointment.included_services || []
                        ).find(
                          (s) => s?.service_id === contribution?.service_id
                        );
                        const offer = (
                          selectedAppointment.included_offers || []
                        ).find((o) => o?.offer_id === contribution?.offer_id);
                        return (
                          <Paper
                            key={idx}
                            sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
                          >
                            <Typography fontWeight={600}>
                              {service?.service_name ||
                                offer?.offer_name ||
                                "Service/Offer"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Amount:{" "}
                              {formatCurrency(
                                service?.final_price ||
                                  offer?.discounted_price ||
                                  0
                              )}
                            </Typography>
                            <Box mt={1}>
                              <Typography variant="body2">
                                <strong>Assigned Staff:</strong>
                              </Typography>
                              {contribution.staff_distribution?.map(
                                (staff, sIdx) => (
                                  <Chip
                                    key={sIdx}
                                    label={`${
                                      staff?.staff_name || "Unknown"
                                    } (${staff?.staff_role || "Staff"})`}
                                    color={
                                      staff?.staff_id === selectedStaff?.id
                                        ? "primary"
                                        : "default"
                                    }
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                )
                              )}
                            </Box>
                          </Paper>
                        );
                      }
                    )}
                  </Box>
                )}
              </Box>
              <Divider />
              {/* Commission - ALWAYS SHOW FOR ALL STATUSES */}
              <Box my={3}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  COMMISSION CALCULATION
                </Typography>
                {(() => {
                  let serviceAmt = 0,
                    productAmt = 0;
                  // Calculate service amount for this specific staff
                  if (
                    selectedAppointment.staff_contributions &&
                    Array.isArray(selectedAppointment.staff_contributions)
                  ) {
                    selectedAppointment.staff_contributions.forEach(
                      (contribution) => {
                        if (
                          contribution.staff_distribution &&
                          Array.isArray(contribution.staff_distribution)
                        ) {
                          const isStaffInDistribution =
                            contribution.staff_distribution.some(
                              (s) => s?.staff_id === selectedStaff?.id
                            );

                          if (isStaffInDistribution) {
                            const service = (
                              selectedAppointment.included_services || []
                            ).find(
                              (s) => s?.service_id === contribution?.service_id
                            );

                            const offer = (
                              selectedAppointment.included_offers || []
                            ).find(
                              (o) => o?.offer_id === contribution?.offer_id
                            );

                            if (service) {
                              serviceAmt +=
                                parseFloat(service.final_price) || 0;
                            } else if (offer) {
                              serviceAmt +=
                                parseFloat(offer.discounted_price) || 0;
                            }
                          }
                        }
                      }
                    );
                  }
                  // Fallback method
                  if (serviceAmt === 0) {
                    (selectedAppointment.included_services || []).forEach(
                      (s) => {
                        if (
                          Array.isArray(s?.staff) &&
                          s.staff.includes(selectedStaff?.id)
                        )
                          serviceAmt += parseFloat(s.final_price) || 0;
                      }
                    );
                    (selectedAppointment.included_offers || []).forEach((o) => {
                      if (
                        Array.isArray(o?.staff) &&
                        o.staff.includes(selectedStaff?.id)
                      )
                        serviceAmt += parseFloat(o.discounted_price) || 0;
                    });
                  }
                  productAmt = parseFloat(
                    selectedAppointment.selled_product_details?.total_amount ||
                      0
                  );
                  const { commission: sComm, percentage: sPct } =
                    calculateCommission(
                      selectedStaff?.commission_slab,
                      serviceAmt
                    );
                  const { commission: pComm, percentage: pPct } =
                    calculateCommission(
                      selectedStaff?.commission_slab_for_product,
                      productAmt
                    );
                  const totalCommission = sComm + pComm;
                  return (
                    <Box
                      p={2}
                      border={1}
                      borderColor="success.main"
                      borderRadius={2}
                      bgcolor="success.50"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                          >
                            For Staff: {selectedStaff?.staffname}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <strong>Service Amount:</strong>{" "}
                          {formatCurrency(serviceAmt)}
                        </Grid>
                        <Grid item xs={6}>
                          <strong>Service Commission:</strong>{" "}
                          {sPct > 0
                            ? `${sPct}% → ${formatCurrency(sComm)}`
                            : "No Commission"}
                        </Grid>
                        <Grid item xs={6}>
                          <strong>Product Amount:</strong>{" "}
                          {formatCurrency(productAmt)}
                        </Grid>
                        <Grid item xs={6}>
                          <strong>Product Commission:</strong>{" "}
                          {pPct > 0
                            ? `${pPct}% → ${formatCurrency(pComm)}`
                            : "No Commission"}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            color="success.main"
                            sx={{
                              mt: 2,
                              p: 1,
                              backgroundColor: "white",
                              borderRadius: 1,
                            }}
                          >
                            <strong>Total Commission:</strong>{" "}
                            {formatCurrency(totalCommission)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, fontStyle: "italic" }}
                          >
                            Note: Commission is calculated based on service
                            amount, regardless of appointment status.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })()}
              </Box>
              <Divider />
              {/* Appointment Info */}
              <Box my={3}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Appointment Info
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <strong>Date:</strong>{" "}
                    {formatDate(selectedAppointment.date)}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Time In:</strong>{" "}
                    {selectedAppointment.time_in || "—"}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Time Out:</strong>{" "}
                    {selectedAppointment.appointment_end_time || "—"}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={
                        selectedAppointment.appointment_status?.toUpperCase() ||
                        "N/A"
                      }
                      color={getStatusColor(
                        selectedAppointment.appointment_status
                      )}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Deleted:</strong>{" "}
                    {selectedAppointment.is_delete ? "Yes" : "No"}
                  </Grid>
                  <Grid item xs={6}>
                    <strong>Checkout:</strong>{" "}
                    {selectedAppointment.checkout ? "Yes" : "No"}
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              {/* Payment */}
              {selectedAppointment.checkout && (
                <Box my={3}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Payment Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <strong>Actual Amount:</strong>{" "}
                      {formatCurrency(selectedAppointment.actual_amount)}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Final Amount:</strong>{" "}
                      {formatCurrency(selectedAppointment.final_amount)}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Paid Amount:</strong>{" "}
                      {formatCurrency(selectedAppointment.amount_paid)}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Due Amount:</strong>{" "}
                      {formatCurrency(
                        parseFloat(selectedAppointment.final_amount || 0) -
                          parseFloat(selectedAppointment.amount_paid || 0)
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Payment Mode:</strong>{" "}
                      {selectedAppointment.payment_mode || "—"}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="error">
                Appointment or staff data not available
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEyeModalOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* ---------- ID PROOF MODAL ---------- */}
      <Dialog
        open={idProofModalOpen}
        onClose={() => setIdProofModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Staff ID Proof</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <img
            src={currentIdProof}
            alt="ID"
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIdProofModalOpen(false)} variant="outlined">
            Close
          </Button>
          <Button
            onClick={downloadIdProof}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default StaffRecord;
