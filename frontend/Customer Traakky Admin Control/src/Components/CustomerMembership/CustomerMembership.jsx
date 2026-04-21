import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  People as PeopleIcon,
  CheckCircle as ActiveIcon,
  Cancel as ExpiredIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Schedule,
} from "@mui/icons-material";

// Expanded Sample Data with More Details
const mockMembers = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.in",
    phone: "+91 98765 43210",
    membership: "Premium",
    status: "active",
    joinDate: "2025-01-15",
    expiryDate: "2026-01-15",
    avatar: "AS",
    address: "12 MG Road, Bangalore, Karnataka 560001",
    lastPayment: "2025-01-10",
    amountPaid: "₹12,000",
    notes: "VIP customer, prefers email communication.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya.mehta@example.in",
    phone: "+91 98234 56789",
    membership: "Gold",
    status: "active",
    joinDate: "2025-03-10",
    expiryDate: "2026-03-10",
    avatar: "PM",
    address: "45 Andheri East, Mumbai, Maharashtra 400069",
    lastPayment: "2025-03-05",
    amountPaid: "₹8,000",
    notes: "Renewed automatically via credit card.",
  },
  {
    id: 3,
    name: "Rohan Patel",
    email: "rohan.patel@example.in",
    phone: "+91 98989 12345",
    membership: "Basic",
    status: "expired",
    joinDate: "2024-06-20",
    expiryDate: "2025-06-20",
    avatar: "RP",
    address: "78 Sector 18, Gurugram, Haryana 122015",
    lastPayment: "2024-06-15",
    amountPaid: "₹3,000",
    notes: "Expired – send renewal reminder.",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.in",
    phone: "+91 90123 45678",
    membership: "Premium",
    status: "active",
    joinDate: "2025-11-01",
    expiryDate: null,
    avatar: "SI",
    address: "34 Anna Nagar, Chennai, Tamil Nadu 600040",
    lastPayment: "2025-11-01",
    amountPaid: "₹12,000",
    notes: "New signup, pending full activation.",
  },
  {
    id: 5,
    name: "Aditya Verma",
    email: "aditya.verma@example.in",
    phone: "+91 91234 56780",
    membership: "Gold",
    status: "expired",
    joinDate: "2025-02-28",
    expiryDate: "2026-02-28",
    avatar: "AV",
    address: "56 Connaught Place, New Delhi 110001",
    lastPayment: "2025-02-20",
    amountPaid: "₹8,000",
    notes: "Missed renewal – follow up required.",
  },
  {
    id: 6,
    name: "Ishaan Gupta",
    email: "ishaan.gupta@example.in",
    phone: "+91 92345 67890",
    membership: "Basic",
    status: "active",
    joinDate: "2025-04-05",
    expiryDate: "2026-04-05",
    avatar: "IG",
    address: "89 Banjara Hills, Hyderabad, Telangana 500034",
    lastPayment: "2025-04-01",
    amountPaid: "₹3,000",
    notes: "Basic plan user, interested in upgrade.",
  },
  {
    id: 7,
    name: "Neha Singh",
    email: "neha.singh@example.in",
    phone: "+91 93456 78901",
    membership: "Premium",
    status: "pending",
    joinDate: "2025-10-20",
    expiryDate: null,
    avatar: "NS",
    address: "101 Park Street, Kolkata, West Bengal 700016",
    lastPayment: null,
    amountPaid: null,
    notes: "Payment in review – contact for confirmation.",
  },
  {
    id: 8,
    name: "Vikram Rao",
    email: "vikram.rao@example.in",
    phone: "+91 94567 89012",
    membership: "Gold",
    status: "active",
    joinDate: "2025-05-12",
    expiryDate: "2026-05-12",
    avatar: "VR",
    address: "23 Jubilee Hills, Hyderabad, Telangana 500033",
    lastPayment: "2025-05-10",
    amountPaid: "₹8,000",
    notes: "Loyal member since launch.",
  },
];

const CustomerMembership = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter members
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Pagination
  const paginatedMembers = useMemo(() => {
    return filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredMembers, page, rowsPerPage]);

  // Stats
  const stats = useMemo(() => {
    const total = mockMembers.length;
    const active = mockMembers.filter((m) => m.status === "active").length;
    const expired = mockMembers.filter((m) => m.status === "expired").length;
    const pending = mockMembers.filter((m) => m.status === "pending").length;

    return { total, active, expired, pending };
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setPage(0);
    setExpandedRows({});
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMenuOpen = (event, member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const getStatusChip = (status) => {
    const config = {
      active: { 
        label: "Active", 
        icon: <ActiveIcon fontSize="small" />, 
        bg: "#e8f5e9", 
        color: "#1b5e20" 
      },
      expired: { 
        label: "Expired", 
        icon: <ExpiredIcon fontSize="small" />, 
        bg: "#ffebee", 
        color: "#b71c1c" 
      },
      pending: { 
        label: "Pending", 
        icon: <PendingIcon fontSize="small" />, 
        bg: "#fff3e0", 
        color: "#e65100" 
      },
    };
    const { label, icon, bg, color } = config[status] || {};
    return (
      <Chip
        icon={icon}
        label={isMobile ? label.charAt(0) : label}
        size="small"
        sx={{ 
          fontWeight: 600, 
          fontSize: isMobile ? "0.675rem" : "0.75rem", 
          bgcolor: bg, 
          color, 
          height: isMobile ? 22 : 26,
          '& .MuiChip-icon': {
            fontSize: isMobile ? '0.75rem' : '1rem',
            marginLeft: isMobile ? '4px' : '6px',
          }
        }}
      />
    );
  };

  const getMembershipChip = (type) => {
    const config = {
      Premium: { bg: "#e3f2fd", color: "#1565c0" },
      Gold: { bg: "#fff8e1", color: "#ff8f00" },
      Basic: { bg: "#f5f5f5", color: "#424242" },
    };
    const { bg, color } = config[type] || config.Basic;
    return (
      <Chip
        label={isMobile ? type.charAt(0) : type}
        size="small"
        sx={{ 
          fontWeight: 600, 
          fontSize: isMobile ? "0.675rem" : "0.75rem", 
          bgcolor: bg, 
          color, 
          height: isMobile ? 22 : 24,
          minWidth: isMobile ? 40 : 'auto',
        }}
      />
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isMobile) {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    }
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tableHeaders = isMobile 
    ? ["", "User", "Status", ""]
    : isTablet
    ? ["", "User", "Membership", "Status", "Expiry", ""]
    : ["", "User", "Contact", "Membership", "Status", "Join Date", "Expiry Date", "Actions"];

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: '"Inter", "Roboto", sans-serif',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        mb: { xs: 2, sm: 3, md: 4 }, 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        gap: { xs: 1.5, sm: 0 }
      }}>
        <Box>
          <Typography
            variant="h2"
            sx={{ 
              fontWeight: 700, 
              color: "#111827", 
              fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" },
              lineHeight: 1.2,
            }}
          >
            Customer Management
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#6b7280", 
              mt: { xs: 0.5, sm: 1 },
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            {isMobile 
              ? "Manage all members" 
              : "Comprehensive view of all members with detailed profiles, payments, and actions."}
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton 
            onClick={handleRefresh} 
            sx={{ 
              color: "#6b7280",
              alignSelf: { xs: "flex-end", sm: "center" },
            }}
          >
            <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        {[
          { label: isMobile ? "Total" : "Total Members", value: stats.total, icon: PeopleIcon, color: "#3b82f6", bg: "#eff6ff", border: "#1976d2" },
          { label: "Active", value: stats.active, icon: ActiveIcon, color: "#2e7d32", bg: "#f0fdf4", border: "#2e7d32" },
          { label: "Expired", value: stats.expired, icon: ExpiredIcon, color: "#c62828", bg: "#fef2f2", border: "#c62828" },
          { label: "Pending", value: stats.pending, icon: PendingIcon, color: "#f57c00", bg: "#fff7ed", border: "#f9a825" },
        ].map((stat, idx) => (
          <Grid item xs={6} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                borderRadius: { xs: 1.5, sm: 2 },
                border: "1px solid #e5e7eb",
                borderBottom: { xs: `3px solid ${stat.border}`, sm: `4px solid ${stat.border}` },
                height: "100%",
                transition: "all 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: "0.625rem", sm: "0.75rem", md: "0.875rem" },
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: "#111827", 
                        mt: 0.25,
                        fontSize: { xs: "1.1rem", sm: "1.5rem", md: "2rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ 
                    bgcolor: stat.bg, 
                    color: stat.color, 
                    width: { xs: 32, sm: 40, md: 48 }, 
                    height: { xs: 32, sm: 40, md: 48 } 
                  }}>
                    <stat.icon sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Section */}
      <Paper elevation={0} sx={{ borderRadius: { xs: 1.5, sm: 2 }, border: "1px solid #e5e7eb", overflow: "hidden", bg: "#fff" }}>
        {/* Search & Results */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 2.5 },
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <TextField
            size="small"
            placeholder={isMobile ? "Search members..." : "Search by name, email, phone, address..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af", fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 360 },
              "& .MuiOutlinedInput-root": { 
                borderRadius: 1.5, 
                bgcolor: "#f9fafb", 
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              },
            }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              ml: { xs: 0, sm: "auto" },
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              textAlign: { xs: "right", sm: "right" },
            }}
          >
            {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: { xs: 500, sm: 600, md: 800 } }}>
          <Table stickyHeader size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      bgcolor: "#f8fafc",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      py: { xs: 1, sm: 1.5, md: 2 },
                      px: { xs: 1, sm: 1.5, md: 2 },
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <React.Fragment key={member.id}>
                    <TableRow
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#f8fafc" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ py: { xs: 0.5, sm: 1, md: 1.5 }, px: { xs: 0.5, sm: 1, md: 2 }, width: 40 }}>
                        <IconButton size="small" onClick={() => toggleExpand(member.id)}>
                          {expandedRows[member.id] ? 
                            <ExpandLessIcon fontSize={isMobile ? "small" : "medium"} /> : 
                            <ExpandMoreIcon fontSize={isMobile ? "small" : "medium"} />
                          }
                        </IconButton>
                      </TableCell>
                      
                      {/* User Column */}
                      <TableCell sx={{ py: { xs: 1, sm: 1.5, md: 2 }, px: { xs: 1, sm: 1.5, md: 2 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
                          <Avatar
                            sx={{
                              width: { xs: 28, sm: 32, md: 40 },
                              height: { xs: 28, sm: 32, md: 40 },
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                              fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.8125rem" },
                            }}
                          >
                            {member.avatar}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600, 
                                color: "#111827",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: { xs: 80, sm: 120, md: 150 },
                              }}
                            >
                              {member.name}
                            </Typography>
                            {!isMobile && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                                ID: #{member.id}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Contact Column - Hide on mobile/tablet */}
                      {!isTablet && (
                        <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" } }}>
                          <Stack direction="column" spacing={0.5}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <EmailIcon fontSize="small" color="action" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} />
                              <span style={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                                {isMobile ? member.email.substring(0, 10) + '...' : member.email}
                              </span>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <PhoneIcon fontSize="small" color="action" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} />
                              <span style={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{member.phone}</span>
                            </Box>
                          </Stack>
                        </TableCell>
                      )}

                      {/* Membership Column - Show on tablet/desktop */}
                      {!isMobile && (
                        <TableCell>
                          {getMembershipChip(member.membership)}
                        </TableCell>
                      )}

                      {/* Status Column - Always show */}
                      <TableCell>
                        {getStatusChip(member.status)}
                      </TableCell>

                      {/* Join Date - Only on desktop */}
                      {!isTablet && (
                        <TableCell sx={{ color: "#374151", fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                          {formatDate(member.joinDate)}
                        </TableCell>
                      )}

                      {/* Expiry Date - Show on tablet/desktop */}
                      {!isMobile && (
                        <TableCell sx={{ color: "#374151", fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                          {formatDate(member.expiryDate)}
                        </TableCell>
                      )}

                      {/* Actions Column */}
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 1, md: 2 } }}>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, member)}>
                          <MoreVertIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row Details */}
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : isTablet ? 6 : 8} sx={{ p: 0, borderBottom: "1px solid #e5e7eb" }}>
                        <Collapse in={expandedRows[member.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: "#fafafa" }}>
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Address
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                  {member.address}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Last Payment
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                  {member.lastPayment ? formatDate(member.lastPayment) : "—"}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Amount
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827", fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                  {member.amountPaid || "—"}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  Notes
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                  {member.notes || "No additional notes."}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: { xs: 1.5, sm: 2 }, display: "flex", gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                              >
                                {isMobile ? "Edit" : "Edit Profile"}
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="warning" 
                                startIcon={<Schedule sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                              >
                                {isMobile ? "Renew" : "Renew"}
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : isTablet ? 6 : 8} align="center" sx={{ py: { xs: 2, sm: 4 }, color: "#6b7280" }}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      No members found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10, 25] : [5, 10, 25, 50]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              color: "#374151",
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
            },
            ".MuiTablePagination-select": { 
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
            },
            ".MuiTablePagination-actions": {
              marginLeft: { xs: 0.5, sm: 1 },
            },
          }}
        />
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: { xs: 140, sm: 180 } } }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={isMobile ? "Edit" : "Edit"} />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "warning.main", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <ListItemIcon><Schedule fontSize="small" color="warning" /></ListItemIcon>
          <ListItemText primary="Renew" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Suspend" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CustomerMembership;