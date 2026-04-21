import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  LinearProgress,
  Checkbox,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  BusinessCenter,
  CalendarMonth,
  CheckCircle,
  Pending,
  Cancel,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  LocationCity,
  Place,
  Phone,
  Close,
  PlaylistAddCheck,
  CheckBoxOutlineBlank,
  CheckBox,
  Delete as DeleteIcon,
  Paid,
} from "@mui/icons-material";
// import AuthContext from "../Context/AuthContext";

import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
// import DateRange from "./DateRange/CustomDateRange";
import DateRange from "../DateRange/DateRange";
// import { formatDate } from "./DateRange/formatDate";
import { formatDate } from "../DateRange/formatDate";


import axios from "axios";
import { Avatar } from "antd";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  marginBottom: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: "12px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
  },
}));

const FilterCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  "& .MuiTable-root": {
    minWidth: 1200,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "#475569",
    borderBottom: "2px solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#fef3c7", color: "#d97706", border: "#fde68a" };
      case "cancelled":
        return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
      case "completed":
        return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
      default:
        return { bg: "#e2e8f0", color: "#64748b", border: "#cbd5e1" };
    }
  };

  const colors = getStatusColor(status);
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
    fontWeight: 600,
    fontSize: "0.75rem",
    "&:hover": {
      backgroundColor: colors.bg,
    },
  };
});

const AppointmentHistory = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchOption, setSearchOption] = useState("customerName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [appointmentDetailModal, setAppointmentDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const isSelectionMode = selectedAppointments.length > 0;

  const statusFilters = [
    { name: "all", label: "All Appointments", color: "primary", icon: <BusinessCenter /> },
    { name: "completed", label: "Completed", color: "success", icon: <CheckCircle /> },
    { name: "pending", label: "Pending", color: "warning", icon: <Pending /> },
    { name: "cancelled", label: "Cancelled", color: "error", icon: <Cancel /> },
  ];

  const searchOptions = [
    { value: "customerName", label: "Customer Name", icon: <BusinessCenter /> },
    { value: "city", label: "City", icon: <LocationCity /> },
    { value: "area", label: "Area", icon: <Place /> },
    { value: "phone", label: "Phone", icon: <Phone /> },
  ];

  // Fetch appointments from API
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://backendapi.trakky.in/salonvendor/appointments/admin",
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const sortedAppointments = response.data.sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );
        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again");
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle search and filters
  useEffect(() => {
    handleSearch();
  }, [searchTerm, dateState, isDateFilterOn, statusFilter, appointments]);

  const handleSearch = () => {
    let filtered = [...appointments];

    // Apply text search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((appointment) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchOption) {
          case "customerName":
            return (appointment.customer_name || "")
              .toLowerCase()
              .includes(searchValue);
          case "city":
            return (appointment.city || "")
              .toLowerCase()
              .includes(searchValue);
          case "area":
            return (appointment.area || "")
              .toLowerCase()
              .includes(searchValue);
          case "phone":
            return (appointment.customer_phone || "")
              .toLowerCase()
              .includes(searchValue);
          default:
            return true;
        }
      });
    }

    // Apply date range filter
    if (isDateFilterOn && dateState[0].startDate && dateState[0].endDate) {
      const startDate = new Date(dateState[0].startDate);
      const endDate = new Date(dateState[0].endDate);
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
      (appointment) => appointment.appointment_status.toLowerCase() === statusFilter
      );
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredAppointments(filtered);
    setPage(0);
  };

  // Selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedAppointments.map((appointment) => appointment.id);
      setSelectedAppointments(newSelected);
      return;
    }
    setSelectedAppointments([]);
  };

  const handleCheckboxClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selectedAppointments.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAppointments, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAppointments.slice(1));
    } else if (selectedIndex === selectedAppointments.length - 1) {
      newSelected = newSelected.concat(selectedAppointments.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAppointments.slice(0, selectedIndex),
        selectedAppointments.slice(selectedIndex + 1)
      );
    }

    setSelectedAppointments(newSelected);
  };

  const isSelected = (id) => selectedAppointments.indexOf(id) !== -1;

  const handleSelectedClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectedClose = () => {
    setAnchorEl(null);
  };

  const clearSelection = () => {
    setSelectedAppointments([]);
  };

  // Handle view appointment details
  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentDetailModal(true);
  };

  // Calculate statistics
  const getStatistics = () => {
    const total = filteredAppointments.length;
    const completed = filteredAppointments.filter(
      (a) => a.appointment_status.toLowerCase() === "completed"
    ).length;
    const pending = filteredAppointments.filter(
      (a) => a.appointment_status.toLowerCase() === "pending"
    ).length;
    const cancelled = filteredAppointments.filter(
      (a) => a.appointment_status.toLowerCase() === "cancelled"
    ).length;
    const totalRevenue = filteredAppointments.reduce((sum, appointment) => {
      return sum + (parseFloat(appointment.amount_paid) || 0);
    }, 0);

    return { total, completed, pending, cancelled, totalRevenue };
  };

  const stats = getStatistics();

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Clear date filter
  const clearDateFilter = () => {
    setDateState([{ startDate: null, endDate: null, key: "selection" }]);
    setIsDateFilterOn(false);
  };

  return (
    <StyledContainer maxWidth="xl">
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
<HeaderCard>
  <CardContent sx={{ 
    p: { xs: 1.5, sm: 2, md: 3, lg: 4 }
  }}>
    <Box 
      display="flex" 
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between" 
      alignItems={{ xs: 'stretch', sm: 'center' }}
      gap={{ xs: 2, sm: 2, md: 3 }}
    >
      {/* Left Section - Title and Selection Badge */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', xs: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={{ xs: 1.5, sm: 2, md: 3 }}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.125rem' },
              lineHeight: 1.2,
            }}
          >
            Appointment Management
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            }}
          >
            {window.innerWidth < 600 
              ? 'Manage salon appointments' 
              : 'Manage and monitor salon appointments'
            }
          </Typography>
        </Box>
        
        {isSelectionMode && (
          <Badge
            badgeContent={selectedAppointments.length}
            color="primary"
            sx={{ 
              cursor: "pointer",
              alignSelf: { xs: 'flex-start', sm: 'center' },
              '& .MuiBadge-badge': {
                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                height: { xs: 18, sm: 20 },
                minWidth: { xs: 18, sm: 20 },
              }
            }}
            onClick={handleSelectedClick}
          >
            <Chip
              label={window.innerWidth < 600 ? `${selectedAppointments.length} Selected` : "Selected"}
              color="primary"
              variant="outlined"
              icon={<PlaylistAddCheck sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              sx={{ 
                px: { xs: 1, sm: 2 },
                height: { xs: 28, sm: 32 },
                '& .MuiChip-label': {
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 1.5 },
                },
                '& .MuiChip-icon': { 
                  ml: { xs: 0.5, sm: 1 },
                  mr: { xs: -0.25, sm: 0 },
                }
              }}
            />
          </Badge>
        )}
      </Box>

      {/* Right Section - Action Buttons */}
      <Box 
        display="flex" 
        gap={{ xs: 1, sm: 1.5, md: 2 }}
        sx={{ 
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <Button
          variant="contained"
          startIcon={<RefreshIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
          onClick={fetchAppointments}
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            '&:hover': { backgroundColor: "rgba(255,255,255,0.3)" },
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            py: { xs: 0.75, sm: 1 },
            px: { xs: 1.5, sm: 2, md: 3 },
            minWidth: { xs: 'auto', sm: '100px' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {window.innerWidth < 600 ? 'Refresh' : 'Refresh'}
        </Button>
      </Box>
    </Box>
  </CardContent>
</HeaderCard>

      {/* Selected Appointments Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleSelectedClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 350 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Selected Appointments ({selectedAppointments.length})</Typography>
            <Button size="small" onClick={clearSelection} color="error">
              Clear
            </Button>
          </Box>
          <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
            {selectedAppointments.map((id) => {
              const appointment = appointments.find((a) => a.id === id);
              return appointment ? (
                <ListItem key={id} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox edge="start" checked tabIndex={-1} disableRipple size="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Appointment #${appointment.id}`}
                    secondary={`Customer: ${appointment.customer_name} - ${formatDate(new Date(appointment.date))}`}
                  />
                </ListItem>
              ) : null;
            })}
          </List>
          <Box display="flex" gap={1} mt={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                toast.error("Bulk delete not implemented yet");
                handleSelectedClose();
              }}
              fullWidth
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Appointments
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#3b82f6", width: 56, height: 56 }}>
                  <BusinessCenter />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.completed}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#10b981", width: 56, height: 56 }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Pending
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.pending}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#f59e0b", width: 56, height: 56 }}>
                  <Pending />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    ₹{stats.totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "#8b5cf6", width: 56, height: 56 }}>
                  <Paid />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filters Section */}
      <FilterCard>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Filters & Search
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  label="Search By"
                >
                  {searchOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder={`Search by ${searchOptions.find((o) => o.value === searchOption)?.label}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant={isDateFilterOn ? "contained" : "outlined"}
                startIcon={<CalendarMonth />}
                onClick={() => setShowDateSelectionModal(true)}
                color={isDateFilterOn ? "primary" : "inherit"}
                size="large"
              >
                {isDateFilterOn ? "Date Filter Active" : "Filter by Date"}
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              {isDateFilterOn && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={clearDateFilter}
                  color="error"
                  size="large"
                >
                  Clear Date Filter
                </Button>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-between">
            <Box display="flex" flexWrap="wrap" gap={1}>
              {statusFilters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={statusFilter === filter.name ? "contained" : "outlined"}
                  onClick={() => setStatusFilter(filter.name)}
                  color={filter.color}
                  startIcon={filter.icon}
                  sx={{ textTransform: "none", borderRadius: "20px", px: 3 }}
                >
                  {filter.label}
                </Button>
              ))}
            </Box>
          </Box>
        </CardContent>
      </FilterCard>

      {/* Table Section */}
      <Paper sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <StyledTableContainer>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <TableCell padding="checkbox" align="center" sx={{ width: 48 }}>
                  All
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedAppointments.length > 0 &&
                      selectedAppointments.length < paginatedAppointments.length
                    }
                    checked={
                      paginatedAppointments.length > 0 &&
                      selectedAppointments.length === paginatedAppointments.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell sx={{ width: 60 }}>Sr. No.</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Salon Name</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Customer Name</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Customer Phone</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Gender</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Customer Type</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Appointment Date</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Services</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Offers</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Amount Paid</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Payment Mode</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Status</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Details</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 8 }}>
                    <Box>
                      <LinearProgress sx={{ mb: 2 }} />
                      <Typography color="textSecondary">Loading appointments...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : paginatedAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="textSecondary">
                      No appointments found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppointments.map((appointment, index) => {
                  const isItemSelected = isSelected(appointment.id);
                  return (
                    <TableRow
                      key={appointment.id}
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                      sx={{
                        "&:hover": { backgroundColor: alpha("#667eea", 0.05) },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleCheckboxClick(event, appointment.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {page * rowsPerPage + index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {appointment.salon_name || "N/A"}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {appointment.city}, {appointment.area}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{appointment.customer_name || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{appointment.customer_phone || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{appointment.customer_gender || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{appointment.customer_type || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(new Date(appointment.date))}</Typography>
                      </TableCell>
                      <TableCell>
                        {appointment.included_services.length > 0 ? (
                          <Grid container spacing={1} sx={{ flexWrap: "wrap" }}>
                            {appointment.included_services.map((service, idx) => (
                              <Grid item xs={6} key={idx}>
                                <Typography variant="body2">{service.service_name || "N/A"}</Typography>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment.included_offers.length > 0 ? (
                          <Grid container spacing={1} sx={{ flexWrap: "wrap" }}>
                            {appointment.included_offers.map((offer, idx) => (
                              <Grid item xs={6} key={idx}>
                                <Typography variant="body2">
                                  Offer ID: {offer.offer_id}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ₹{appointment.amount_paid || "0.00"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{appointment.payment_mode || "N/A"}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={
                            appointment.appointment_status
                              ? appointment.appointment_status.charAt(0).toUpperCase() +
                                appointment.appointment_status.slice(1)
                              : "N/A"
                          }
                          status={appointment.appointment_status.toLowerCase()}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewAppointmentDetails(appointment)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid rgba(224, 224, 224, 1)",
            "& .MuiTablePagination-toolbar": { paddingLeft: 2, paddingRight: 2 },
          }}
        />
      </Paper>

      {/* Date Range Selection Modal */}
      <Dialog
        open={showDateSelectionModal}
        onClose={() => setShowDateSelectionModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setIsDateFilterOn={setIsDateFilterOn}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDateSelectionModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowDateSelectionModal(false);
              setIsDateFilterOn(true);
            }}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Appointment Details Modal */}
      <Dialog
        open={appointmentDetailModal}
        onClose={() => setAppointmentDetailModal(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div">
              Appointment Details #{selectedAppointment?.id}
            </Typography>
            <IconButton onClick={() => setAppointmentDetailModal(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedAppointment ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Salon Name:</strong> {selectedAppointment.salon_name || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Customer Name:</strong> {selectedAppointment.customer_name || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Customer Phone:</strong> {selectedAppointment.customer_phone || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Gender:</strong> {selectedAppointment.customer_gender || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Customer Type:</strong> {selectedAppointment.customer_type || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date:</strong> {formatDate(new Date(selectedAppointment.date))}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Amount Paid:</strong> ₹{selectedAppointment.amount_paid || "0.00"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Payment Mode:</strong> {selectedAppointment.payment_mode || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Status:</strong>{" "}
                {selectedAppointment.appointment_status
                  ? selectedAppointment.appointment_status.charAt(0).toUpperCase() +
                    selectedAppointment.appointment_status.slice(1)
                  : "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Services:</strong>
              </Typography>
              {selectedAppointment.included_services.length > 0 ? (
                <List dense>
                  {selectedAppointment.included_services.map((service, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={service.service_name || "N/A"}
                        secondary={`Duration: ${service.duration} min, Price: ₹${service.final_price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No services included
                </Typography>
              )}
              <Typography variant="subtitle1" gutterBottom>
                <strong>Offers:</strong>
              </Typography>
              {selectedAppointment.included_offers.length > 0 ? (
                <List dense>
                  {selectedAppointment.included_offers.map((offer, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={`Offer ID: ${offer.offer_id}`}
                        secondary={`Actual Price: ₹${offer.actual_price}, Discounted Price: ₹${offer.discounted_price}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No offers included
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No details available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentDetailModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AppointmentHistory;