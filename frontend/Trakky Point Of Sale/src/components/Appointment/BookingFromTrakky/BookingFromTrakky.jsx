import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
import InputAdornment from "@mui/material/InputAdornment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../../Context/Auth";

const BookingFromTrakky = () => {
  const { authTokens } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [bookings, setBooking] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [printLoading, setPrintLoading] = useState(false);
  const [printLoadingId, setPrintLoadingId] = useState(null);

  // Fetch booking data from API
  const getBookingColletdata = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pageNumber,
        page_size: rowsPerPage,
      });

      if (searchQuery.trim()) params.append("customer_name", searchQuery.trim());
      if (phoneSearch.trim()) params.append("customer_phone", phoneSearch.trim());
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `https://backendapi.trakky.in/salons/booking-pos/?${params.toString()}`,
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
        setBooking(data.results || []);
        setFilterData(data.results || []);
        setTotalPages(Math.ceil(data.count / rowsPerPage) || 1);
        setPage(pageNumber);
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    getBookingColletdata(1);
  }, [searchQuery, phoneSearch, statusFilter, rowsPerPage]);

  // Handle WhatsApp invoice sending
  const handleSendWhatsappinvoice = async (booking) => {
    setPrintLoading(true);
    setPrintLoadingId(booking.id);

    try {
      const invoiceResponse = await fetch(
        `https://backendapi.trakky.in/salonvendor/generate-invoice-details/${booking.id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );


      
  let branchId = localStorage.getItem("branchId") || "";
      if (invoiceResponse.ok) {
        const data = await invoiceResponse.json();
        const whatsappPayload = {
          phone_numbers: [`91${booking.customer_phone}`],
          filename: `invoice_${booking.id}`,
          file_url: data.invoice_url,
          body_values: [
            booking.customer_name,
            "Booking",
            "Trakky Salon",
            "Trakky Salon",
          ],
          // branchId:branchId
        };

        const whatsappResponse = await fetch(
          "https://backendapi.trakky.in/salonvendor/send-invoice-whatsapp/",
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
          toast.success("Invoice sent successfully via WhatsApp!");
        } else {
          throw new Error("Failed to send invoice via WhatsApp");
        }
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating or sending invoice");
    } finally {
      setPrintLoading(false);
      setPrintLoadingId(null);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#EFECFF",
        overflowX: "hidden",
      }}
    >
      <ToastContainer />


      <Box
        sx={{
          width: "100%",
          height: { xs: "auto", md: "calc(100% - 60px)" },
          mt: 1,
          px: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Search and Filter Controls */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "auto", sm: "56px" },
              px: 2,
              py: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 1,
              alignItems: "center",
            }}
          >
            <TextField
              type="text"
              name="searchQuery"
              id="searchQuery"
              placeholder="Search Name..."
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                },
                width: { xs: "100%", sm: "auto" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              type="text"
              name="phoneSearch"
              id="phoneSearch"
              placeholder="Search Phone..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                },
                width: { xs: "100%", sm: "auto" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size={isMobile ? "small" : "medium"}
            />
            <FormControl
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                },
                width: { xs: "100%", sm: 180 },
              }}
            >
              <InputLabel
                id="status-filter-label"
                size={isMobile ? "small" : "medium"}
              >
                Status
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                size={isMobile ? "small" : "medium"}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => {
                setSearch("");
                setPhoneSearch("");
                setStatusFilter("all");
                getBookingColletdata(1);
              }}
              sx={{
                bgcolor: "#512Dc8",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                height: isMobile ? "40px" : "46px",
                width: { xs: "100%", sm: "auto" },
                minWidth: "80px",
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: "#3a1e9c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Reset
            </Button>
          </Box>

          {/* Booking Table */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              pb: 2,
              px: { xs: 1, md: 1 },
              overflow: "auto",
            }}
          >
            <TableContainer
              sx={{
                bgcolor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Table className="w-full">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                    >
                      Sr. no
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                    >
                      Phone
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Appointment Date
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Appointment Time
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Service
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Final Amount
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                        >
                          Amount Paid
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : 10} sx={{ textAlign: "center" }}>
                        <CircularProgress sx={{ color: "#000", margin: "auto" }} />
                      </TableCell>
                    </TableRow>
                  ) : filterData.length > 0 ? (
                    filterData.map((booking, index) => (
                      <TableRow key={booking.id}>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                          {booking.customer_name || "N/A"}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                          {booking.customer_phone || "N/A"}
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              {booking.appointment_date || "N/A"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              {booking.appointment_time || "N/A"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              {booking.service_name || "N/A"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              {booking.status || "N/A"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              ₹{booking.final_amount || "0"}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                              ₹{booking.amount_paid || "0"}
                            </TableCell>
                          </>
                        )}
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                          <Tooltip title="Send Invoice via WhatsApp">
                            <IconButton
                              onClick={() => handleSendWhatsappinvoice(booking)}
                              disabled={printLoading && printLoadingId === booking.id}
                              size="small"
                            >
                              {printLoading && printLoadingId === booking.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <PrintIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : 10} sx={{ textAlign: "center" }}>
                        No Booking Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">Rows per page:</Typography>
                <Select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value)}
                  size="small"
                  sx={{ height: "36px" }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Box>
              <Typography variant="body2">
                Page {page} of {totalPages}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === 1}
                  onClick={() => getBookingColletdata(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => getBookingColletdata(page + 1)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingFromTrakky;