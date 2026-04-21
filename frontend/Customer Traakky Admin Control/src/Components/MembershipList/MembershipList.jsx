import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const membershipPackages = [
  {
    id: 1,
    packageId: "PKG-001",
    name: "Basic Monthly",
    type: "Monthly",
    price: "₹999",
    duration: "30 days",
    services: "Haircut, Shave, Basic Facial",
    maxBookings: 5,
    status: "Active",
    createdOn: "2025-01-10",
  },
  {
    id: 2,
    packageId: "PKG-002",
    name: "Gold Annual",
    type: "Annual",
    price: "₹1,200",
    duration: "365 days",
    services: "All Hair Services, Spa, Massage",
    maxBookings: 60,
    status: "Active",
    createdOn: "2025-02-15",
  },
  {
    id: 3,
    packageId: "PKG-003",
    name: "Silver Quarterly",
    type: "Quarterly",
    price: "₹3,500",
    duration: "90 days",
    services: "Haircut, Coloring, Basic Spa",
    maxBookings: 15,
    status: "Expired",
    createdOn: "2025-03-01",
  },
  {
    id: 4,
    packageId: "PKG-004",
    name: "Platinum Lifetime",
    type: "Lifetime",
    price: "₹7,999",
    duration: "Unlimited",
    services: "VIP All Access, Priority Booking",
    maxBookings: "Unlimited",
    status: "Pending",
    createdOn: "2024-12-20",
  },
  {
    id: 5,
    packageId: "PKG-005",
    name: "Family Pack",
    type: "Annual",
    price: "₹1,800",
    duration: "365 days",
    services: "For 4 members – All Services",
    maxBookings: 80,
    status: "Active",
    createdOn: "2025-01-05",
  },
  {
    id: 6,
    packageId: "PKG-006",
    name: "Student Special",
    type: "Monthly",
    price: "₹599",
    duration: "30 days",
    services: "Haircut, Beard Trim",
    maxBookings: 3,
    status: "Active",
    createdOn: "2025-02-10",
  },
  {
    id: 7,
    packageId: "PKG-007",
    name: "Weekend Warrior",
    type: "Weekend",
    price: "₹1,499",
    duration: "Sat–Sun only",
    services: "Spa, Massage, Hair",
    maxBookings: 8,
    status: "Pending",
    createdOn: "2025-03-20",
  },
  {
    id: 8,
    packageId: "PKG-008",
    name: "Corporate Pack",
    type: "Annual",
    price: "₹4,500",
    duration: "365 days",
    services: "Team of 10 – Full Access",
    maxBookings: 200,
    status: "Active",
    createdOn: "2025-01-25",
  },
  {
    id: 9,
    packageId: "PKG-009",
    name: "Trial Pack",
    type: "One-Time",
    price: "₹2999",
    duration: "7 days",
    services: "Any 1 Service",
    maxBookings: 1,
    status: "Expired",
    createdOn: "2025-02-28",
  },
  {
    id: 10,
    packageId: "PKG-010",
    name: "Premium Spa",
    type: "Monthly",
    price: "₹2,999",
    duration: "30 days",
    services: "Full Body Spa, Facial, Hair",
    maxBookings: 10,
    status: "Active",
    createdOn: "2025-03-15",
  },
];

// ------------------- MAIN COMPONENT -------------------
const MembershipList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  // Filter & Pagination
  const filteredData = membershipPackages.filter((pkg) =>
    Object.values(pkg).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // === VIEW MODAL ===
  const handleView = (pkg) => {
    setSelectedPkg(pkg);
    setViewOpen(true);
  };

  // === EDIT MODAL ===
  const handleEdit = (pkg) => {
    setSelectedPkg(pkg);
    setEditForm({ ...pkg });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEdit = () => {
    const newErrors = {};
    if (!editForm.name) newErrors.name = "Required";
    if (!editForm.type) newErrors.type = "Required";
    if (!editForm.price) newErrors.price = "Required";
    if (!editForm.duration) newErrors.duration = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = () => {
    if (!validateEdit()) return;
    console.log("Updated Package:", editForm);
    alert("Package updated successfully!");
    setEditOpen(false);
  };

  // === DELETE MODAL ===
  const handleDelete = (pkg) => {
    setSelectedPkg(pkg);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleted Package ID:", selectedPkg.id);
    alert("Package deleted!");
    setDeleteOpen(false);
  };

  // Close all modals
  const closeAll = () => {
    setViewOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedPkg(null);
    setErrors({});
  };

  // Dynamic table headers based on screen size
  const getTableHeaders = () => {
    if (isMobile) {
      return [
        { id: 'name', label: 'Package' },
        { id: 'price', label: 'Price' },
        { id: 'status', label: 'Status' },
        { id: 'actions', label: 'Actions' }
      ];
    } else if (isTablet) {
      return [
        { id: 'packageId', label: 'ID' },
        { id: 'name', label: 'Name' },
        { id: 'type', label: 'Type' },
        { id: 'price', label: 'Price' },
        { id: 'status', label: 'Status' },
        { id: 'actions', label: 'Actions' }
      ];
    } else {
      return [
        { id: 'packageId', label: 'Package ID' },
        { id: 'name', label: 'Name' },
        { id: 'type', label: 'Type' },
        { id: 'price', label: 'Price' },
        { id: 'duration', label: 'Duration' },
        { id: 'services', label: 'Services' },
        { id: 'status', label: 'Status' },
        { id: 'created', label: 'Created' },
        { id: 'actions', label: 'Actions' }
      ];
    }
  };

  const tableHeaders = getTableHeaders();

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      backgroundColor: "#f5f7fa", 
      minHeight: "100vh" 
    }}>
      <Card elevation={4} sx={{ borderRadius: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              background: "linear-gradient(135deg, #2c3e50 0%, #502DA6 100%)",
              color: "white",
              borderRadius: { xs: "8px 8px 0 0", sm: "12px 12px 0 0" },
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
              Membership Packages
            </Typography>
            <Typography variant="body2" sx={{ 
              opacity: 0.9, 
              mt: 0.5,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
            }}>
              {isMobile 
                ? 'Manage membership plans' 
                : 'Manage all salon membership plans and packages'
              }
            </Typography>
          </Box>

          {/* Toolbar */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: "space-between",
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 1.5, sm: 2 },
              backgroundColor: "#fff",
              borderBottom: "1px solid #eee",
            }}
          >
            <TextField
              size="small"
              placeholder={isMobile ? "Search..." : "Search packages..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: '100%', sm: 250, md: 300 },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
              onClick={() => navigate("/add-membership")}
              fullWidth={isMobile}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "#502DA6",
                "&:hover": { backgroundColor: "#3a1f7a" },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 1, sm: 0.75 },
              }}
            >
              {isMobile ? 'Add' : 'Add Package'}
            </Button>
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: { xs: 400, sm: 500, md: 600 } }}>
            <Table stickyHeader size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableCell 
                      key={header.id}
                      align={header.id === 'actions' ? 'center' : 'left'}
                      sx={{ 
                        fontWeight: 600, 
                        backgroundColor: "#f8f9fa",
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                        py: { xs: 1, sm: 1.5 },
                        px: { xs: 1, sm: 1.5, md: 2 },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#f8f9ff" } }}
                    >
                      {/* Package ID - Only on desktop/tablet */}
                      {!isMobile && (
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                          {pkg.packageId}
                        </TableCell>
                      )}
                      
                      {/* Name - Always show */}
                      <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                        <Typography 
                          fontWeight={500} 
                          sx={{ 
                            fontSize: 'inherit',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: { xs: 100, sm: 150, md: 200 },
                          }}
                        >
                          {pkg.name}
                        </Typography>
                      </TableCell>
                      
                      {/* Type - Show on desktop/tablet */}
                      {!isMobile && (
                        <TableCell>
                          <Chip
                            label={isTablet ? pkg.type.charAt(0) : pkg.type}
                            size="small"
                            color={
                              pkg.type === "Lifetime"
                                ? "secondary"
                                : pkg.type === "Annual"
                                ? "primary"
                                : "default"
                            }
                            variant="outlined"
                            sx={{ 
                              height: { xs: 20, sm: 24 },
                              '& .MuiChip-label': {
                                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                                px: { xs: 0.5, sm: 1 },
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      
                      {/* Price - Always show */}
                      <TableCell>
                        <Typography 
                          color="primary" 
                          fontWeight={600}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                        >
                          {pkg.price}
                        </Typography>
                      </TableCell>
                      
                      {/* Duration - Only on desktop */}
                      {!isTablet && (
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                          {pkg.duration}
                        </TableCell>
                      )}
                      
                      {/* Services - Only on desktop */}
                      {!isTablet && (
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            }}
                            title={pkg.services}
                          >
                            {pkg.services}
                          </Typography>
                        </TableCell>
                      )}
                      
                      {/* Status - Always show */}
                      <TableCell>
                        <Chip
                          label={isMobile ? pkg.status.charAt(0) : pkg.status}
                          size="small"
                          color={
                            pkg.status === "Active"
                              ? "success"
                              : pkg.status === "Pending"
                              ? "warning"
                              : pkg.status === "Expired"
                              ? "error"
                              : "default"
                          }
                          sx={{ 
                            height: { xs: 20, sm: 24 },
                            minWidth: { xs: 30, sm: 'auto' },
                            '& .MuiChip-label': {
                              fontSize: { xs: '0.6rem', sm: '0.75rem' },
                              px: { xs: 0.5, sm: 1 },
                            }
                          }}
                        />
                      </TableCell>
                      
                      {/* Created On - Only on desktop */}
                      {!isTablet && (
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                          {pkg.createdOn}
                        </TableCell>
                      )}
                      
                      {/* Actions - Always show */}
                      <TableCell align="center">
                        <Stack 
                          direction="row" 
                          spacing={{ xs: 0.25, sm: 0.5 }} 
                          justifyContent="center"
                        >
                          <Tooltip title="View">
                            <IconButton 
                              size="small" 
                              color="info" 
                              onClick={() => handleView(pkg)}
                              sx={{ p: { xs: 0.5, sm: 0.75 } }}
                            >
                              <VisibilityIcon fontSize={isMobile ? "small" : "small"} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleEdit(pkg)}
                              sx={{ p: { xs: 0.5, sm: 0.75 } }}
                            >
                              <EditIcon fontSize={isMobile ? "small" : "small"} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDelete(pkg)}
                              sx={{ p: { xs: 0.5, sm: 0.75 } }}
                            >
                              <DeleteIcon fontSize={isMobile ? "small" : "small"} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={tableHeaders.length} 
                      align="center" 
                      sx={{ py: { xs: 3, sm: 4 } }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        No packages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
            sx={{ 
              borderTop: "1px solid #eee",
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
              },
              '.MuiTablePagination-select': {
                fontSize: { xs: '0.7rem', sm: '0.875rem' },
              },
              '.MuiTablePagination-actions': {
                marginLeft: { xs: 0.5, sm: 1 },
              }
            }}
          />
        </CardContent>
      </Card>

      {/* ==================== VIEW MODAL ==================== */}
      <Dialog 
        open={viewOpen} 
        onClose={closeAll} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Package Details
            </Typography>
            <IconButton onClick={closeAll}>
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          {selectedPkg && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Package ID
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.packageId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Name
                </Typography>
                <Typography fontWeight={600} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.name}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Type
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.type}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Price
                </Typography>
                <Typography color="primary" fontWeight={600} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.price}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Duration
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.duration}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Max Bookings
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.maxBookings}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Services
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.services}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Status
                </Typography>
                <Chip
                  label={selectedPkg.status}
                  size="small"
                  color={
                    selectedPkg.status === "Active"
                      ? "success"
                      : selectedPkg.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                  sx={{ 
                    height: { xs: 24, sm: 28 },
                    '& .MuiChip-label': {
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                  Created On
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                  {selectedPkg.createdOn}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={closeAll} size={isMobile ? "small" : "medium"}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== EDIT MODAL ==================== */}
      <Dialog 
        open={editOpen} 
        onClose={closeAll} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        <DialogTitle sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Edit Package
            </Typography>
            <IconButton onClick={closeAll}>
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Package Name"
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              error={!!errors.name}
              helperText={errors.name}
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '1rem' } },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.type} size={isMobile ? "small" : "medium"}>
                  <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Type</InputLabel>
                  <Select
                    name="type"
                    value={editForm.type || ""}
                    onChange={handleEditChange}
                    label="Type"
                    sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                  >
                    {["Monthly", "Quarterly", "Annual", "Lifetime", "Weekend", "One-Time"].map(
                      (t) => (
                        <MenuItem key={t} value={t} sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                          {t}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  {errors.type && <FormHelperText sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{errors.type}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  value={editForm.price || ""}
                  onChange={handleEditChange}
                  error={!!errors.price}
                  helperText={errors.price}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                    '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  value={editForm.duration || ""}
                  onChange={handleEditChange}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                    '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Bookings"
                  name="maxBookings"
                  value={editForm.maxBookings || ""}
                  onChange={handleEditChange}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                    '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Services (comma separated)"
              name="services"
              multiline
              rows={isMobile ? 2 : 3}
              value={editForm.services || ""}
              onChange={handleEditChange}
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiInputLabel-root': { fontSize: { xs: '0.8rem', sm: '1rem' } },
                '& .MuiInputBase-input': { fontSize: { xs: '0.8rem', sm: '1rem' } },
              }}
            />
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Status</InputLabel>
              <Select
                name="status"
                value={editForm.status || ""}
                onChange={handleEditChange}
                label="Status"
                sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
              >
                <MenuItem value="Active" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Active</MenuItem>
                <MenuItem value="Pending" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Pending</MenuItem>
                <MenuItem value="Inactive" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Inactive</MenuItem>
                <MenuItem value="Expired" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Expired</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={closeAll} size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditSubmit}
            size={isMobile ? "small" : "medium"}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================== DELETE CONFIRMATION ==================== */}
      <Dialog 
        open={deleteOpen} 
        onClose={closeAll} 
        maxWidth="xs" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        <DialogTitle sx={{ p: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            Are you sure you want to delete <strong>{selectedPkg?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={closeAll} size={isMobile ? "small" : "medium"}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={confirmDelete}
            size={isMobile ? "small" : "medium"}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipList;