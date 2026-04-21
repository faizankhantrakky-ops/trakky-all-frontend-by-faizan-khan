import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AppointmentListCard from "../AppointmentListCard";
import AuthContext from "../../../Context/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  Drawer,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import {
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Status Guide Dropdown (Reusable)
const StatusGuideMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const guide = [
    { status: "upcoming", label: "Upcoming", color: "bg-yellow-100 text-yellow-800 border-yellow-300", desc: "Upcoming Appointment" },
    { status: "not_started", label: "PENDING", color: "bg-gray-100 text-gray-700 border-gray-300", desc: "Appointment booked" },
    { status: "running", label: "IN PROGRESS", color: "bg-green-100 text-green-800 border-green-300", desc: "Service is currently running" },
    { status: "completed", label: "COMPLETED", color: "bg-blue-100 text-blue-800 border-blue-300", desc: "Service finished" },
    { status: "cancelled", label: "CANCELLED", color: "bg-red-100 text-red-800 border-red-300", desc: "Appointment cancelled" },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="Status Guide"
        title="View Status Guide"
        sx={{
          ml: 1,
          color: "gray.600",
          "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 420,
            p: 1,
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            py: 1.5,
            fontWeight: 600,
            color: "gray.800",
            borderBottom: "1px solid #e5e7eb",
            mb: 1,
            fontSize: "0.875rem",
          }}
        >
          Status Guide
        </Typography>

        {guide.map((item) => (
          <MenuItem
            key={item.status}
            disableGutters
            sx={{
              py: 1.2,
              px: 2,
              borderRadius: "8px",
              mb: 0.5,
              "&:hover": { bgcolor: "gray.50" },
            }}
          >
            <ListItemIcon sx={{ minWidth: "auto", mr: 1.5 }}>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${item.color}`}
              >
                {item.label}
              </span>
            </ListItemIcon>
            <ListItemText
              primary={item.desc}
              primaryTypographyProps={{
                fontSize: "0.8125rem",
                color: "gray.700",
                fontWeight: 500,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

function AppointmentCardView({ startDate, endDate }) {
  const params = useParams();
  const { authTokens } = useContext(AuthContext);
const [isDeleting, setIsDeleting] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffWithAppointmentCounts, setStaffWithAppointmentCounts] = useState([]);
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [filters, setFilters] = useState({
    customerPhone: "",
    customerName: "",
    status: "",
    staffId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Fetch appointments
  const getAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const nonDeleted = data.filter(appt => appt.is_delete === false);
        setAppointments(nonDeleted);
        setFilteredAppointments(nonDeleted);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch staff list
  const getStaffList = async () => {
    setIsLoadingStaff(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/staff/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStaffList(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load staff list");
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Calculate appointment counts for each staff
  useEffect(() => {
    if (staffList.length > 0 && appointments.length > 0) {
      const staffCounts = staffList.map(staff => {
        const appointmentCount = appointments.filter(appt => {
          if (appt.staff && Array.isArray(appt.staff)) {
            return appt.staff.some(staffId => staffId.toString() === staff.id.toString());
          }
          return false;
        }).length;
        
        return {
          ...staff,
          appointmentCount: appointmentCount
        };
      });
      
      setStaffWithAppointmentCounts(staffCounts);
    } else if (staffList.length > 0) {
      // If no appointments yet, set all counts to 0
      const staffCounts = staffList.map(staff => ({
        ...staff,
        appointmentCount: 0
      }));
      setStaffWithAppointmentCounts(staffCounts);
    }
  }, [staffList, appointments]);

  // Update selected staff name when staff filter changes
  useEffect(() => {
    if (filters.staffId && staffList.length > 0) {
      const selectedStaff = staffList.find(staff => staff.id.toString() === filters.staffId);
      if (selectedStaff) {
        setSelectedStaffName(selectedStaff.staffname);
      } else {
        setSelectedStaffName("");
      }
    } else {
      setSelectedStaffName("");
    }
  }, [filters.staffId, staffList]);

  useEffect(() => {
    getAppointments();
    getStaffList();
  }, [startDate, endDate]);

  useEffect(() => {
    let result = appointments;

    if (filters.customerPhone) {
      result = result.filter((appt) =>
        appt.customer_phone?.includes(filters.customerPhone)
      );
    }

    if (filters.customerName) {
      result = result.filter((appt) =>
        appt.customer_name
          ?.toLowerCase()
          .includes(filters.customerName.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter((appt) => appt.appointment_status === filters.status);
    }

    if (filters.staffId) {
      result = result.filter((appt) => {
        // Check if appointment has staff array and if it contains the selected staff id
        if (appt.staff && Array.isArray(appt.staff)) {
          return appt.staff.some(staffId => staffId.toString() === filters.staffId);
        }
        return false;
      });
    }

    setFilteredAppointments(result);
  }, [filters, appointments]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilter = (name) => {
    setFilters((prev) => ({ ...prev, [name]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({ customerPhone: "", customerName: "", status: "", staffId: "" });
    setSelectedStaffName("");
  };

  const refreshAppointments = useCallback(() => {
    getAppointments();
  }, [startDate, endDate]);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(appointments.map((a) => a.appointment_status))];
    return statuses.filter(Boolean);
  }, [appointments]);

  const hasActiveFilters =
    filters.customerPhone || filters.customerName || filters.status || filters.staffId;

  // Get display text based on selected staff
  const getDisplayDataForText = () => {
    if (isLoading) {
      return "...";
    }
    
    if (filters.staffId && selectedStaffName) {
      return `${selectedStaffName}'s: ${filteredAppointments.length} Appointments`;
    } else if (filters.staffId) {
      return `${filteredAppointments.length} Appointments`;
    } else {
      return `${appointments.length} Appointments`;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="appointment-container p-6 bg-gray-50 min-h-screen">
        {/* Header: Filters + Summary */}
        <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <TextField
                label="Mobile"
                size="small"
                value={filters.customerPhone}
                onChange={(e) => handleFilterChange("customerPhone", e.target.value)}
                InputProps={{
                  endAdornment: filters.customerPhone && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter("customerPhone")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 180 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  },
                }}
              />

              <TextField
                label="Customer Name"
                size="small"
                value={filters.customerName}
                onChange={(e) => handleFilterChange("customerName", e.target.value)}
                InputProps={{
                  endAdornment: filters.customerName && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter("customerName")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 200 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  },
                }}
              />

              <FormControl size="small" sx={{ width: { xs: "100%", sm: 170 } }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Staff Filter - Added after Status */}
              <FormControl size="small" sx={{ width: { xs: "100%", sm: 250 } }}>
                <InputLabel>Staff</InputLabel>
                <Select
                  value={filters.staffId}
                  label="Staff"
                  onChange={(e) => handleFilterChange("staffId", e.target.value)}
                  disabled={isLoadingStaff || isLoading}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  <MenuItem value="">
                    <em>All Staff</em>
                  </MenuItem>
                  {staffWithAppointmentCounts.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>
                          {staff.staffname} 
                        </span>
                        {staff.appointmentCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                            {staff.appointmentCount}
                          </span>
                        )}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition"
                >
                  <ClearIcon fontSize="small" />
                  Clear All
                </button>
              )}
            </div>

            {/* Summary + Icons (Status Guide + History Icon at the end) */}
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-300">
                {getDisplayDataForText()}
              </span>

              {/* Status Guide (Three Dots) */}
              <StatusGuideMenu />

              {/* History Icon - Last Position */}
              <Link to={'/appointment/list-appointment/history'}>
                <IconButton
                  size="small"
                  title="Appointment History"
                  sx={{
                    color: "gray.600",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.09)" },
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </IconButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CircularProgress size={40} thickness={4} />
            <p className="mt-3 text-sm text-gray-600 font-medium">Loading appointments...</p>
          </div>
        ) : (
          /* Appointments Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <AppointmentListCard key={appt.id} appointment={appt} onRefresh={refreshAppointments} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700">No appointments found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {hasActiveFilters ? "Try adjusting your filters" : "No appointments for selected date range"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AppointmentCardView;