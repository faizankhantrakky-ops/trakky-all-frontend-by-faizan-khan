// src/pages/appointment/AppointmentHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../Context/Auth";
import { toast } from "react-toastify";
import {
  CircularProgress,
  IconButton,
  Divider,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const AppointmentHistory = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deletedAppointments, setDeletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [restoring, setRestoring] = useState(false);

  // Fetch appointments
  const fetchAppointments = async (startDate, endDate) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.map((appt) => ({ ...appt, source: "appointments-new" }));
      }
      throw new Error("Failed");
    } catch (err) {
      toast.error("Failed to load appointments");
      return [];
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const loadData = async () => {
      setLoading(true);
      const all = await fetchAppointments(today, today);
      const deleted = all
        .filter((appt) => appt.is_delete === true)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDeletedAppointments(deleted);
      setLoading(false);
    };
    loadData();
  }, [authTokens]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const formatTime = (t) => (t ? t.slice(0, 5) : "—");

  // Open Confirm Dialog
  const openRestoreConfirm = (apptId) => {
    setSelectedApptId(apptId);
    setConfirmOpen(true);
  };

  // Confirm Restore
  const handleRestoreConfirmed = async () => {
    if (!selectedApptId || !authTokens?.access_token) return;

    setRestoring(true);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/${selectedApptId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify({ is_delete: false }),
        }
      );

      if (res.ok) {
        toast.success(`Appointment #${selectedApptId} restored successfully!`);
        setDeletedAppointments((prev) => prev.filter((a) => a.id !== selectedApptId));
        setTimeout(() => navigate(-1), 1200);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Failed to restore");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setRestoring(false);
      setConfirmOpen(false);
      setSelectedApptId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Deleted Appointments</h1>
              <p className="text-sm text-gray-500">Restore any accidentally deleted appointment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Deleted Today</div>
            <div className="text-3xl font-bold text-red-700">
              {loading ? "..." : deletedAppointments.length}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {loading ? (
          // Professional Skeleton Loader
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-300 rounded-lg p-6">
                <Skeleton variant="rectangular" height={60} className="mb-4" />
                <div className="grid grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <Skeleton height={20} width="60%" />
                      <Skeleton height={24} width="80%" className="mt-2" />
                      <Skeleton height={20} width="50%" className="mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : deletedAppointments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
            <DeleteForeverIcon sx={{ fontSize: 80, color: "#94a3b8", mb: 3 }} />
            <h3 className="text-xl font-medium text-gray-700">No Deleted Appointments</h3>
            <p className="text-gray-500 mt-2">Everything is active and safe</p>
          </div>
        ) : (
          <div className="space-y-6">
            {deletedAppointments.map((appt) => (
              <div key={appt.id} className="border border-red-600 bg-white rounded-lg overflow-hidden">
                {/* Red Header */}
                <div className="bg-gray-100 border border-b-gray-100 text-black px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DeleteForeverIcon />
                    <span className="font-semibold text-lg">Appointment #{appt.id} — Deleted</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-90">
                      {new Date(appt.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <Tooltip title="Restore appointment" arrow>
                      <Button
                        variant="contained"
                        startIcon={<RestorePageIcon />}
                        onClick={() => openRestoreConfirm(appt.id)}
                        sx={{
                          bgcolor: "#10b981",
                          "&:hover": { bgcolor: "#059669" },
                          fontWeight: "bold",
                        }}
                      >
                        Restore
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    {/* Customer */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <PersonIcon fontSize="small" />
                        <span className="font-medium">Customer</span>
                      </div>
                      <div className="font-semibold text-gray-900">{appt.customer_name || "—"}</div>
                      <div className="text-gray-600">{appt.customer_phone}</div>
                    </div>

                    {/* Schedule */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <CalendarMonthIcon fontSize="small" />
                        <span className="font-medium">Scheduled</span>
                      </div>
                      <div className="font-semibold text-gray-900">{formatDate(appt.date)}</div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <AccessTimeIcon fontSize="small" /> {formatTime(appt.time_in)}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <ContentCutIcon fontSize="small" />
                        <span className="font-medium">Services</span>
                      </div>
                      <div className="space-y-1 text-gray-800">
                        {appt.included_services?.length > 0
                          ? appt.included_services.map((s, i) => (
                              <div key={i}>• {s.service_name} — ₹{s.final_price || s.actual_price || 0}</div>
                            ))
                          : appt.included_offers?.length > 0
                          ? appt.included_offers.map((o, i) => (
                              <div key={i}>• {o.offer_name} — ₹{o.discounted_price || o.actual_price || 0}</div>
                            ))
                          : "No services"}
                      </div>
                    </div>

                    {/* Staff & Amount */}
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <AccountCircleIcon fontSize="small" />
                        <span className="font-medium">Staff & Amount</span>
                      </div>
                      <div className="text-gray-700 mb-3">
                        {appt.staff_contributions?.length > 0
                          ? appt.staff_contributions.flatMap((c) =>
                              c.staff_distribution?.map((st) => (
                                <div key={st.staff_id}>• {st.staff_name}</div>
                              ))
                            )
                          : "—"}
                      </div>
                      <Divider sx={{ my: 1 }} />
                      <div className="mt-3 font-bold text-lg text-gray-900">
                        ₹{appt.final_amount || appt.actual_amount || "0"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Material-UI Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#f59e0b" }} />
          Confirm Restore
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>restore</strong> Appointment #{selectedApptId}?
            <br />
            It will re-appear in your active appointments list.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={restoring}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreConfirmed}
            disabled={restoring}
            startIcon={restoring ? <CircularProgress size={20} /> : <RestorePageIcon />}
          >
            {restoring ? "Restoring..." : "Yes, Restore"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentHistory;