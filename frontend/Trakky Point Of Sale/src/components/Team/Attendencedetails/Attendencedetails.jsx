import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Chip,
  Box,
  MenuItem,
  Grid,
  InputLabel,
  FormControl,
  Select,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../../Context/Auth";

function Attendencedetails({ startDate, endDate }) {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Mobile states
  const [expandedStaff, setExpandedStaff] = useState(null);

  const staffRoles = [
    ...new Set(staffData.map((s) => s.staff_role).filter(Boolean)),
  ];

  // Fetch Staff Data
  const fetchData = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const sorted = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
        setStaffData(sorted);
      } else {
        throw new Error("Failed to fetch staff");
      }
    } catch (err) {
      toast.error("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Attendance
  const fetchAttendance = async (staffId) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    setAttendanceLoading(true);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/staff/attendance/?staff=${staffId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const sorted = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 30); // Reduced for mobile performance
        setAttendanceData(sorted);
      } else {
        setAttendanceData([]);
      }
    } catch {
      setAttendanceData([]);
      toast.error("Failed to load attendance");
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const openMoreDetails = (staff) => {
    setSelectedStaff(staff);
    setMoreDetailsOpen(true);
    fetchAttendance(staff.id);
  };

  const formatDate = (d) => (d ? format(new Date(d), "dd MMM yyyy") : "—");
  const formatTime = (t) => (t ? t.slice(0, 5) : "—");

  // Calculate Working Hours in Minutes
  const calculateMinutes = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);
    let diff = (outH * 60 + outM) - (inH * 60 + inM);
    if (diff < 0) diff += 24 * 60;
    return diff;
  };

  // Determine Day Type
  const getDayType = (record) => {
    if (!record.present) return { label: "Absent", color: "error" };
    if (!record.time_in || !record.time_out) return { label: "Present", color: "warning" };

    const minutes = calculateMinutes(record.time_in, record.time_out);
    if (minutes >= 480) {
      return { label: "Full Day", color: "success" };
    } else if (minutes > 0) {
      return { label: "Half Day", color: "info" };
    }
    return { label: "Present", color: "warning" };
  };

  // Format Working Hours
  const calculateHours = (inTime, outTime) => {
    const minutes = calculateMinutes(inTime, outTime);
    if (minutes === 0) return "—";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? mins + "m" : ""}`.trim();
  };

  // Filtered Data
  const filteredStaff = staffData
    .filter((s) => {
      const name = s.staffname?.toLowerCase().includes(nameFilter.toLowerCase());
      const role = !roleFilter || s.staff_role === roleFilter;
      const mobile = !mobileFilter || (s.ph_number && s.ph_number.includes(mobileFilter));
      const status =
        !statusFilter ||
        (statusFilter === "permanent" && s.is_permanent) ||
        (statusFilter === "temporary" && !s.is_permanent);
      return name && role && mobile && status;
    })
    .sort((a, b) => b.id - a.id);

  // Mobile Staff Card Component
  const MobileStaffCard = ({ staff, index }) => {
    const isExpanded = expandedStaff === staff.id;
    
    return (
      <Card 
        sx={{ 
          mb: 2, 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: staff.is_permanent ? 'success.main' : 'warning.main',
                  fontSize: '0.875rem'
                }}
              >
                {staff.staffname?.charAt(0) || 'S'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="600" fontSize="0.95rem">
                  {staff.staffname}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                  #{index + 1} • {staff.staff_role || "—"}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={staff.is_permanent ? "Permanent" : "Temporary"}
              color={staff.is_permanent ? "success" : "warning"}
              size="small"
              sx={{ height: 24, fontSize: '0.7rem' }}
            />
          </Box>

          <Grid container spacing={1} mb={1}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" fontSize="0.75rem">
                  {staff.ph_number || "—"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" fontSize="0.75rem">
                  {staff.gender || "—"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {staff.email && (
            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
              <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" fontSize="0.75rem" noWrap>
                {staff.email}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 1, pt: 0 }}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              size="small"
              variant="outlined"
              onClick={() => openMoreDetails(staff)}
              startIcon={<InfoIcon />}
              sx={{ 
                fontSize: '0.75rem',
                py: 0.5,
                minWidth: 'auto',
                flex: 1,
                mr: 1
              }}
            >
              Attendance
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => setExpandedStaff(isExpanded ? null : staff.id)}
              endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ 
                fontSize: '0.75rem',
                py: 0.5,
                minWidth: 'auto'
              }}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </Box>
        </CardActions>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent sx={{ pt: 1, pb: 1 }}>
            <Typography variant="caption" fontWeight="600" color="text.secondary" display="block" mb={1}>
              Recent Attendance
            </Typography>
            <List dense sx={{ p: 0 }}>
              {attendanceData.slice(0, 3).map((record) => {
                const dayType = getDayType(record);
                return (
                  <ListItem 
                    key={record.id} 
                    sx={{ 
                      px: 1, 
                      py: 0.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" fontSize="0.75rem">
                          {formatDate(record.date)}
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Chip
                            label={dayType.label}
                            color={dayType.color}
                            size="small"
                            sx={{ 
                              height: 20, 
                              fontSize: '0.65rem',
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                          {record.time_in && (
                            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                              {formatTime(record.time_in)} - {formatTime(record.time_out) || '—'}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Collapse>
      </Card>
    );
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Toaster position="top-center" />

      {/* Responsive Header */}
      <Box mb={3}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="600" 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
        >
          Staff Attendance Details
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {format(new Date(startDate), "dd MMM yyyy")} - {format(new Date(endDate), "dd MMM yyyy")}
        </Typography>
      </Box>

      {/* Filters - Responsive */}
      <Paper 
        elevation={isMobile ? 1 : 2} 
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          mb: 3,
          borderRadius: 2
        }}
      >
        <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Staff Name"
              size="small"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              InputProps={{
                sx: { fontSize: { xs: '0.875rem', sm: '0.9rem' } }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.875rem', sm: '0.9rem' } }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>All</MenuItem>
                {staffRoles.map((r) => (
                  <MenuItem key={r} value={r} sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Mobile"
              size="small"
              value={mobileFilter}
              onChange={(e) => setMobileFilter(e.target.value)}
              InputProps={{
                sx: { fontSize: { xs: '0.875rem', sm: '0.9rem' } }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.875rem', sm: '0.9rem' } }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>All</MenuItem>
                <MenuItem value="permanent" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>Permanent</MenuItem>
                <MenuItem value="temporary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>Temporary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography 
              variant="subtitle1" 
              color="primary" 
              fontWeight="600"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' } }}
            >
              Total: {filteredStaff.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Desktop Table View */}
          {!isMobile && (
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <TableContainer 
                component={Paper} 
                elevation={1}
                sx={{ 
                  borderRadius: 2,
                  minWidth: '100%',
                  maxHeight: isTablet ? '70vh' : 'auto'
                }}
              >
                <Table stickyHeader size={isTablet ? "small" : "medium"}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        whiteSpace: 'nowrap'
                      }}>Sr. No.</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Staff Name</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Staff Role</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Status</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Contact no.</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Email</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Gender</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff, i) => (
                        <TableRow key={staff.id} hover>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {i + 1}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            <Typography fontWeight="500">{staff.staffname}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {staff.staff_role || "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            <Chip
                              label={staff.is_permanent ? "Permanent" : "Temporary"}
                              color={staff.is_permanent ? "success" : "warning"}
                              size="small"
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                height: { xs: 24, sm: 28 }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {staff.ph_number || "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {staff.email || "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {staff.gender || "—"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            <Tooltip title="View Attendance Details">
                              <IconButton 
                                size="small" 
                                onClick={() => openMoreDetails(staff)} 
                                color="primary"
                                sx={{ p: { xs: 0.5, sm: 1 } }}
                              >
                                <InfoIcon fontSize={isTablet ? "small" : "medium"} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No staff found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <Box>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff, i) => (
                  <MobileStaffCard key={staff.id} staff={staff} index={i} />
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                  <Typography color="text.secondary">No staff found</Typography>
                </Paper>
              )}
            </Box>
          )}
        </>
      )}

      {/* ATTENDANCE DETAILS MODAL - RESPONSIVE */}
      <Dialog
        open={moreDetailsOpen}
        onClose={() => setMoreDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { 
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: { xs: 'none', sm: 24 },
            minHeight: { xs: '100vh', sm: '80vh' },
            maxHeight: { xs: '100vh', sm: '90vh' }
          },
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 }
        }}>
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="600"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              {selectedStaff?.staffname}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {selectedStaff?.staff_role} • Attendance Details
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setMoreDetailsOpen(false)}
            size={isMobile ? "small" : "medium"}
          >
            <CloseIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {attendanceLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
          ) : attendanceData.length > 0 ? (
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                maxHeight: { xs: 'calc(100vh - 180px)', sm: '70vh' },
                borderRadius: 0
              }}
            >
              <Table 
                stickyHeader 
                size={isMobile ? "small" : "medium"}
                sx={{ minWidth: { xs: 500, sm: '100%' } }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap',
                      px: { xs: 1, sm: 2 }
                    }}>Date</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}>Status</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}>In Time</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}>Out Time</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}>Hours</TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      px: { xs: 1, sm: 2 }
                    }}>Day Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((record) => {
                    const dayType = getDayType(record);
                    return (
                      <TableRow key={record.id} hover>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1, sm: 2 }
                        }}>
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1, sm: 2 } }}>
                          <Chip
                            label={record.present ? "Present" : "Absent"}
                            color={record.present ? "success" : "error"}
                            size="small"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 22, sm: 24 }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1, sm: 2 }
                        }}>
                          {formatTime(record.time_in)}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1, sm: 2 }
                        }}>
                          {formatTime(record.time_out)}
                        </TableCell>
                        <TableCell sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          px: { xs: 1, sm: 2 }
                        }}>
                          {record.present && record.time_in && record.time_out
                            ? calculateHours(record.time_in, record.time_out)
                            : "—"}
                        </TableCell>
                        <TableCell sx={{ px: { xs: 1, sm: 2 } }}>
                          <Chip
                            label={dayType.label}
                            color={dayType.color}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 22, sm: 24 }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">No attendance records found</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          justifyContent: "end",
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={() => setMoreDetailsOpen(false)} 
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{ 
              minWidth: { xs: 80, sm: 100 },
              fontSize: { xs: '0.875rem', sm: '0.9rem' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Attendencedetails;