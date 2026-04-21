import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../../Context/Auth";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from "date-fns";
import { Drawer, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import AppointmentForm from "../AppointmentForm/AppointmentForm";
import EditAppointment from "../Temp";

function AppointmentTable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("day");
  const { authTokens } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAppointmentData, setOpenAppointmentData] = useState({});
  const [addAppointmentModalOpen, setAddAppointmentModalOpen] = useState(false);
  const [selectedFormDate, setSelectedFormDate] = useState(dayjs());
  const [invalidDateModalOpen, setInvalidDateModalOpen] = useState(false);
  const [visitConfirmationModalOpen, setVisitConfirmationModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isVisit, setIsVisit] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonHistory, setReasonHistory] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [invalidTimeModalOpen, setInvalidTimeModalOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [selectedStaffForNewAppointment, setSelectedStaffForNewAppointment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const timeSlotRefs = useRef({});
  const navigate = useNavigate();

  // Detect screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreenSize('small');
      else if (window.innerWidth < 1024) setScreenSize('medium');
      else setScreenSize('large');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive staff count
  const displayedStaff = useMemo(() => {
    if (screenSize === 'small') return staff.slice(0, 1);
    if (screenSize === 'medium') return staff.slice(0, 3);
    return staff.slice(0, 7);
  }, [staff, screenSize]);

  // Fetch staff data
  useEffect(() => {

  if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }


   const fetchStaff = async () => {
  try {
    const response = await fetch("https://backendapi.trakky.in/salonvendor/staff/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // ✅ Apply Condition: is_permanent === true AND is_present === true
      const filteredStaff = Array.isArray(data)
        ? data.filter(
            staff =>
              staff.is_permanent === true && staff.is_present === true
          )
        : [];

      setStaff(filteredStaff);
    } else {
      toast.error("Failed to fetch staff");
    }
  } catch (error) {
    console.error("Error fetching staff:", error);
    toast.error("Error fetching staff");
  }
};


    fetchStaff();
  }, [authTokens.access_token]);

  // Fetch appointments and Trakky bookings
  useEffect(() => {
    let startDate, endDate;
    if (view === "month") {
      startDate = formatDate(startOfMonth(currentDate));
      endDate = formatDate(endOfMonth(currentDate));
    } else if (view === "week") {
      startDate = formatDate(startOfWeek(currentDate));
      endDate = formatDate(endOfWeek(currentDate));
    } else if (view === "day") {
      startDate = formatDate(currentDate);
      endDate = formatDate(currentDate);
    }

    getAppointmentsAndBookings(startDate, endDate);
  }, [currentDate, authTokens.access_token, view]);

  // Scroll to current time on initial load for day or week view
  useEffect(() => {
    if ((view === "day" || view === "week") && !loading && appointments.length >= 0) {
      const now = new Date();
      const currentHour = getHours(now);
      const timeSlotKey = currentHour >= 8 && currentHour <= 23 ? currentHour : 8;
      const timeSlotElement = timeSlotRefs.current[timeSlotKey];
      if (timeSlotElement) {
        timeSlotElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [view, loading, appointments]);

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Fetch appointments from appointments-new endpoint
  const fetchAppointments = async (startDate, endDate) => {
     if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Filter out deleted appointments (only show is_delete: false)
        const activeAppointments = data.filter(appt => appt.is_delete === false);

        return activeAppointments.map((appt) => ({
          ...appt,
          source: "appointments-new",
        }));
      } else {
        throw new Error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error fetching appointments");
      return [];
    }
  };

  // Fetch all bookings from Trakky endpoint (handle pagination)
  const fetchTrakkyBookings = async (startDate, endDate) => {
     if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }

    try {
      let allBookings = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const params = new URLSearchParams({
          page: page,
          page_size: 100,
          start_date: startDate,
          end_date: endDate,
        });

        const response = await fetch(
          `https://backendapi.trakky.in/salons/booking-pos/?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const normalizedBookings = data.results.map((booking) => ({
            id: booking.id,
            customer_name: booking.customer_name || "N/A",
            customer_phone: booking.customer_phone || "N/A",
            date: booking.appointment_date || formatDate(new Date()),
            time_in: booking.appointment_time || "00:00:00",
            included_services: [
              {
                service_name: booking.service_name || "N/A",
                staff: [],
                final_price: booking.final_amount || 0,
                duration: 30,
              },
            ],
            included_offers: [],
            staff: [],
            staff_contributions: [],
            final_amount: booking.final_amount || 0,
            amount_paid: booking.amount_paid || 0,
            appointment_status: booking.status || "Scheduled",
            source: "trakky",
          }));

          allBookings = [...allBookings, ...normalizedBookings];

          if (!data.next) {
            hasNextPage = false;
          } else {
            page += 1;
          }
        } else {
          throw new Error("Failed to fetch Trakky bookings");
        }
      }

      return allBookings;
    } catch (error) {
      return [];
    }
  };

  // Combine appointments and bookings
  const getAppointmentsAndBookings = async (startDate, endDate) => {

     if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
  
    setLoading(true);
    try {
      const [newAppointments, trakkyBookings] = await Promise.all([
        fetchAppointments(startDate, endDate),
        fetchTrakkyBookings(startDate, endDate),
      ]);

      const combinedAppointments = [...newAppointments, ...trakkyBookings];
      const uniqueAppointments = Array.from(
        new Map(combinedAppointments.map((item) => [item.id, item])).values()
      );

      setAppointments(uniqueAppointments);
    } catch (error) {
      console.error("Error combining appointments:", error);
      toast.error("Error loading appointments and bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDateClick = (day) => {
    if (isBefore(day, new Date()) && !isSameDay(day, new Date())) {
      setInvalidDateModalOpen(true);
      return;
    }

    setSelectedDate(day);
    setSelectedFormDate(dayjs(day));
    setAddAppointmentModalOpen(true);
  };

  // Redirect to add-new-appointment page (no query params)
  const handleTimeSlotClick = (day, hour, staffId) => {
    const now = new Date();
    const selectedDateTime = new Date(day);
    selectedDateTime.setHours(hour, 0, 0, 0);

    // Disable past time slots
    if (selectedDateTime < now) {
      setInvalidTimeModalOpen(true);
      return;
    }

    // Redirect using react-router-dom
    navigate('/appointment/add-new-appointment');
  };

  const getAppointmentColor = (appointment) => {
    if (appointment?.for_consultation) return "bg-yellow-500";
    const isCheckedOut = appointment?.checkout;
    const isPastAppointment = isBefore(parseISO(appointment.date), new Date());
    const isToday = isSameDay(parseISO(appointment.date), new Date());
    const didNotVisit = isPastAppointment && appointment.is_visit === false;

    if (appointment.source === "trakky") {
      switch (appointment.appointment_status?.toLowerCase()) {
        case "completed":
          return "bg-green-500";
        case "cancelled":
          return "bg-red-500";
        case "not_started":
          return isToday ? "bg-[#3a1aa2]" : "bg-blue-500";
        default:
          return "bg-blue-500";
      }
    }

    if (isCheckedOut) return "bg-green-500";
    if (isToday) return "bg-[#3a1aa2]";
    if (didNotVisit) return "bg-red-500";
    return "bg-blue-500";
  };

  const getStaffNames = (appointment) => {
    const allStaffIds = [
      ...(appointment.staff || []),
      ...(appointment.included_services?.flatMap((service) => service.staff || []) || []),
      ...(appointment.included_offers?.flatMap((offer) => offer.staff || []) || []),
    ];

    const uniqueStaffIds = [...new Set(allStaffIds)];
    return uniqueStaffIds.map((staffId) => {
      const staffMember = staff.find((s) => s.id === staffId);
      return staffMember ? staffMember.staffname : "Unknown Staff";
    });
  };

  const handleAppointmentClick = (appointment, e) => {
    e.stopPropagation();

    if (appointment?.for_consultation) {
      setDrawerOpen(false);
      return;
    }

    const isCheckedOut = appointment?.checkout || (appointment.source === "trakky" && appointment.appointment_status?.toLowerCase() === "completed");
    const appointmentDate = parseISO(appointment.date);
    const isPastAppointment = isBefore(appointmentDate, new Date()) && !isSameDay(appointmentDate, new Date());
    const isTodayAppointment = isSameDay(appointmentDate, new Date());

    if (isCheckedOut) {
      setSelectedAppointment(appointment);
      setDrawerOpen(true);
      setOpenAppointmentData(appointment);
    } else if (isPastAppointment && !isCheckedOut) {
      setSelectedAppointment(appointment);
      setVisitConfirmationModalOpen(true);
      setReasonHistory(appointment.reason_history || []);
    } else if (isTodayAppointment && !isCheckedOut) {
      setSelectedAppointment(appointment);
      setDrawerOpen(true);
      setOpenAppointmentData(appointment);
    } else {
      setDrawerOpen(true);
      setOpenAppointmentData(appointment);
    }
  };

  const handleVisitConfirmation = async () => {
    try {
      const payload = {
        is_visit: isVisit,
        reason: reason,
        reason_history: [
          ...reasonHistory,
          {
            date: new Date().toISOString(),
            is_visit: isVisit,
            reason: reason,
          },
        ],
      };

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments-new/${selectedAppointment.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Appointment updated successfully");
        const startDate = formatDate(view === "month" ? startOfMonth(currentDate) : view === "week" ? startOfWeek(currentDate) : currentDate);
        const endDate = formatDate(view === "month" ? endOfMonth(currentDate) : view === "week" ? endOfWeek(currentDate) : currentDate);
        getAppointmentsAndBookings(startDate, endDate);
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      toast.error("Error updating appointment");
    } finally {
      setVisitConfirmationModalOpen(false);
      setIsVisit(false);
      setReason("");
      setSelectedAppointment(null);
    }
  };

  const setToastMessage = (message, status) => {
    if (status === "success") {
      toast.success(message);
    }
    if (status === "error") {
      toast.error(message);
    }
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center font-bold p-2 sm:p-3 bg-gray-100 border-r last:border-r-0 min-w-[80px] sm:min-w-[120px] text-xs sm:text-sm"
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 mb-0 min-w-max font-poppins bg-gray-50 border-b overflow-x-auto">
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = formatDate(cloneDay);
        const isToday = isSameDay(cloneDay, new Date());
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        const dayAppointments = appointments.filter((appointment) => {
          return formatDate(parseISO(appointment.date)) === formattedDate;
        });

        days.push(
          <div
            key={cloneDay.toISOString()}
            className={`min-h-[80px] sm:min-h-[120px] font-poppins p-1 sm:p-2 border-r border-b border-gray-200 min-w-[80px] sm:min-w-[120px] text-xs ${!isCurrentMonth
              ? "bg-gray-50 text-gray-400"
              : isToday
                ? "bg-[#e0daff]"
                : "bg-white"
              } ${selectedDate && isSameDay(cloneDay, selectedDate)
                ? "ring-2 ring-blue-500 ring-inset"
                : ""
              } hover:bg-gray-50 cursor-pointer transition-colors duration-150`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-xs sm:text-sm font-semibold ${isToday ? "text-blue-600" : ""
                  }`}
              >
                {format(cloneDay, "d")}
              </span>
              {isToday && (
                <span className="text-xs bg-blue-500 text-white px-1 rounded hidden sm:inline">
                  Today
                </span>
              )}
            </div>

            <div className="space-y-1 max-h-[60px] sm:max-h-[80px] overflow-y-auto">
              {dayAppointments.slice(0, screenSize === 'small' ? 2 : 3).map((appointment, index) => (
                <div
                  key={`${appointment.id}-${appointment.source}-${index}`}
                  className={`${getAppointmentColor(
                    appointment
                  )} text-white text-xs p-1 rounded cursor-pointer truncate`}
                  onClick={(e) => handleAppointmentClick(appointment, e)}
                >
                  <span className="font-medium">
                    {appointment.customer_name}
                    {appointment.source === "trakky" && " (Trakky)"}
                  </span>
                </div>
              ))}
              {dayAppointments.length > (screenSize === 'small' ? 2 : 3) && (
                <div className="text-gray-500 text-xs">+{dayAppointments.length - (screenSize === 'small' ? 2 : 3)}</div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div
          key={day.toISOString()}
          className="grid grid-cols-7 gap-0 min-w-max"
        >
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        {rows}
      </div>
    );
  };

  // Helper function for time slot filtering (used in both week and day views)
  const isAppointmentInTimeSlot = (appointment, hour) => {
    try {
      let timeToUse = appointment.time_in;
      if (!timeToUse && appointment.created_at) {
        const createdTime = appointment.created_at.split("T")[1];
        timeToUse = createdTime.split(".")[0];
      }
      if (!timeToUse && appointment.source === "trakky") {
        timeToUse = appointment.time_in || "00:00:00";
      }
      if (!timeToUse) return true;

      const appointmentTime = parseISO(`${appointment.date}T${timeToUse}`);
      return getHours(appointmentTime) === hour;
    } catch (e) {
      console.error("Error parsing appointment time:", e);
      return true;
    }
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = [];
    let day = weekStart;

    while (day <= weekEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    const timeSlots = Array.from({ length: 16 }, (_, index) => {
      const hour = index + 8;
      const displayHour = hour % 12 || 12;
      const period = hour >= 12 ? "PM" : "AM";
      return {
        hour,
        displayHour,
        period,
        label: `${displayHour}:00 ${period}`,
      };
    });

    const colWidth = screenSize === 'small' ? 'minmax(120px, 1fr)' : screenSize === 'medium' ? 'minmax(200px, 1fr)' : 'minmax(300px, 1fr)';
    const timeColWidth = screenSize === 'small' ? '80px' : '120px';
    const dayCellWidth = screenSize === 'small' ? 'min-w-[30px]' : 'min-w-[40px]';

    return (
      <div className="font-poppins bg-white rounded-lg shadow relative mt-4 sm:mt-8">
        <div className={`w-full sm:w-[1270px] max-h-[70vh] overflow-y-auto overflow-x-auto mt-2 sm:mt-5`}>
          {/* Staff Header Row */}
          <div
            className="grid gap-1 border-b pb-1 bg-gray-100 sticky top-0 z-30"
            style={{
              gridTemplateColumns: `${timeColWidth} repeat(${displayedStaff.length}, ${colWidth})`,
            }}
          >
            <div className="p-1 sm:p-3 font-bold border-r sticky left-0 z-40 bg-gray-100 flex items-center justify-center text-xs sm:text-sm">
              Time/Staff
            </div>
            {displayedStaff.map((staffMember) => {
              // Safe name and role
              const name = staffMember?.staffname || "";
              const role = staffMember?.staff_role || "";

              // Limit name & role length
              const shortName = name.length > 10 ? name.slice(0, 10) + "..." : name;
              const shortRole = role.length > 15 ? role.slice(0, 15) + "..." : role;

              return (
                <div
                  key={staffMember.id}
                  className="p-1 sm:p-2 text-center border-r last:border-r-0"
                >
                  {/* Staff Name + Role */}
                  <div
                    className="font-bold mb-1 sm:mb-2 text-xs sm:text-sm truncate"
                    title={`${name} (${role})`}
                  >
                    {shortName} ({shortRole})
                  </div>

                  {/* Week View */}
                  {view === "week" && (
                    <div className={`grid grid-cols-${days.length} gap-0.5 sm:gap-1`}>
                      {days.map((day) => (
                        <div
                          key={day.toISOString()}
                          className={`p-1 sm:p-2 font-semibold text-center cursor-pointer bg-gray-200 rounded ${dayCellWidth} text-xs`}
                          onClick={() => handleDateClick(day)}
                        >
                          <div>{format(day, "EEE")}</div>
                          <div className="text-xs sm:text-sm font-normal">
                            {format(day, "MMM d")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}


          </div>

          {/* Time Slots and Appointment Grid */}
          <div>
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.hour}
                className="grid gap-0.5 sm:gap-1 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                style={{
                  gridTemplateColumns: `${timeColWidth} repeat(${displayedStaff.length}, ${colWidth})`,
                }}
                ref={(el) => (timeSlotRefs.current[timeSlot.hour] = el)}
              >
                <div className="bg-gray-50 p-1 sm:p-3 text-xs sm:text-sm font-semibold sticky left-0 z-20 min-h-[60px] sm:min-h-[80px] flex items-center justify-center border-r">
                  {timeSlot.label}
                </div>
                {displayedStaff.map((staffMember) => {
                  const staffAppointments = appointments.filter((appointment) => {
                    const allStaffIds = [];
                    if (appointment.staff && appointment.staff.length > 0) {
                      allStaffIds.push(...appointment.staff);
                    }
                    if (
                      appointment.staff_contributions &&
                      appointment.staff_contributions.length > 0
                    ) {
                      appointment.staff_contributions.forEach((contribution) => {
                        if (
                          contribution.staff_distribution &&
                          contribution.staff_distribution.length > 0
                        ) {
                          contribution.staff_distribution.forEach((staff) => {
                            if (staff.staff_id) {
                              allStaffIds.push(staff.staff_id);
                            }
                          });
                        }
                      });
                    }
                    if (
                      appointment.included_services &&
                      appointment.included_services.length > 0
                    ) {
                      appointment.included_services.forEach((service) => {
                        if (service.staff && service.staff.length > 0) {
                          allStaffIds.push(...service.staff);
                        }
                      });
                    }
                    if (
                      appointment.included_offers &&
                      appointment.included_offers.length > 0
                    ) {
                      appointment.included_offers.forEach((offer) => {
                        if (offer.staff && offer.staff.length > 0) {
                          allStaffIds.push(...offer.staff);
                        }
                      });
                    }
                    if (appointment.source === "trakky") {
                      return true;
                    }
                    return allStaffIds.includes(staffMember.id);
                  });

                  return (
                    <div
                      key={staffMember.id}
                      className={`grid grid-cols-${days.length} gap-0.5 sm:gap-1 min-h-[60px] sm:min-h-[80px] border-r last:border-r-0 p-0.5 sm:p-1`}
                    >
                      {days.map((day) => {
                        const dateStr = formatDate(day);
                        const timeSlotAppointments = staffAppointments.filter(
                          (appointment) => formatDate(parseISO(appointment.date)) === dateStr && isAppointmentInTimeSlot(appointment, timeSlot.hour)
                        );

                        const now = new Date();
                        const slotTime = new Date(day);
                        slotTime.setHours(timeSlot.hour, 0, 0, 0);
                        const isPast = slotTime < now;

                        return (
                          <div
                            key={`${staffMember.id}-${day.toISOString()}-${timeSlot.hour}`}
                            className={`min-h-[60px] sm:min-h-[80px] p-0.5 sm:p-1 bg-white relative group border-r last:border-r-0 ${dayCellWidth} text-xs ${isPast
                              ? "opacity-50 cursor-not-allowed bg-gray-100"
                              : "cursor-pointer hover:bg-blue-50"
                              }`}
                            onClick={() =>
                              !isPast &&
                              handleTimeSlotClick(day, timeSlot.hour, staffMember.id)
                            }
                          >
                            <div className="flex flex-col gap-0.5 sm:gap-1 h-full">
                              {timeSlotAppointments.slice(0, screenSize === 'small' ? 1 : 2).map((appointment, index) => {
                                const now = new Date();
                                let timeToUse = appointment.time_in;
                                if (!timeToUse && appointment.created_at) {
                                  const createdTime = appointment.created_at.split("T")[1];
                                  timeToUse = createdTime.split(".")[0];
                                }
                                if (!timeToUse && appointment.source === "trakky") {
                                  timeToUse = appointment.time_in || "00:00:00";
                                }
                                const appointmentTime = parseISO(
                                  `${appointment.date}T${timeToUse}`
                                );
                                const isPastAppt = isBefore(appointmentTime, now);

                                return (
                                  <div
                                    key={`${appointment.id}-${appointment.source}-${index}`}
                                    className={`${getAppointmentColor(
                                      appointment
                                    )} text-white text-xs p-0.5 sm:p-1 rounded relative flex flex-col justify-center min-h-[15px] sm:min-h-[20px] ${screenSize === 'small' ? 'hidden md:block' : ''
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isPastAppt) handleAppointmentClick(appointment, e);
                                    }}
                                  >
                                    <div className="font-semibold truncate text-xs">
                                      {appointment.customer_name}
                                      {appointment.source === "trakky" && " (Trakky)"}
                                    </div>
                                    {screenSize !== 'small' && (
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-64 bg-gray-100 text-black p-3 rounded-lg shadow-md">
                                        <div className="text-sm font-semibold mb-2">
                                          Appointment Details
                                        </div>
                                        <div className="space-y-1 text-xs">
                                          <div>
                                            <strong>Customer:</strong>{" "}
                                            {appointment.customer_name}
                                          </div>
                                          <div>
                                            <strong>Phone:</strong>{" "}
                                            {appointment.customer_phone}
                                          </div>
                                          <div>
                                            <strong>Services:</strong>{" "}
                                            {appointment.included_services
                                              ?.map((s) => s.service_name)
                                              .join(", ") || "None"}
                                          </div>
                                          <div>
                                            <strong>Offers:</strong>{" "}
                                            {appointment.included_offers
                                              ?.map((o) => o.offer_name || `Offer ID: ${o.offer_id}`)
                                              .join(", ") || "None"}
                                          </div>
                                          <div>
                                            <strong>Staff:</strong>{" "}
                                            {appointment.source === "trakky"
                                              ? "N/A"
                                              : getStaffNames(appointment).join(", ")}
                                          </div>
                                          <div>
                                            <strong>Price:</strong> ₹
                                            {appointment.final_amount}
                                          </div>
                                          <div>
                                            <strong>Status:</strong>{" "}
                                            {appointment.appointment_status || "Scheduled"}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {timeSlotAppointments.length > (screenSize === 'small' ? 1 : 2) && (
                                <div className="text-gray-500 text-xs">+{timeSlotAppointments.length - (screenSize === 'small' ? 1 : 2)}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            No appointments scheduled for this week
          </div>
        )}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDate(currentDate);
    const dayAppointments = appointments.filter((appointment) => {
      try {
        const appointmentDate = formatDate(parseISO(appointment.date));
        return appointmentDate === dateStr;
      } catch (e) {
        console.error("Error parsing appointment date:", e);
        return false;
      }
    });

    const timeSlots = Array.from({ length: 16 }, (_, index) => {
      const hour = index + 8;
      const displayHour = hour % 12 || 12;
      const period = hour >= 12 ? "PM" : "AM";
      return {
        hour,
        displayHour,
        period,
        label: `${displayHour}:00 ${period}`,
      };
    });

    const colWidth = screenSize === 'small' ? 'minmax(100px, 1fr)' : screenSize === 'medium' ? 'minmax(120px, 1fr)' : 'minmax(150px, 1fr)';
    const timeColWidth = screenSize === 'small' ? '80px' : '120px';

    return (
      <div className="font-poppins bg-white rounded-lg shadow relative">
        <div className={`w-full sm:w-[1270px] max-h-[70vh] overflow-y-auto overflow-x-auto  mt-5 sm:mt-3`}>
          {/* Staff Header Row */}
          <div
            className="grid gap-1 border-b pb-1 bg-gray-100 sticky top-0 z-30"
            style={{
              gridTemplateColumns: `${timeColWidth} repeat(${displayedStaff.length}, ${colWidth})`,
            }}
          >
            <div className="p-1 sm:p-3 font-bold border-r sticky left-0 z-40 bg-gray-100 flex items-center justify-center text-xs sm:text-sm">
              Time/Staff
            </div>
            {displayedStaff.map((staffMember) => {
              const name = staffMember?.staffname || "";
              const role = staffMember?.staff_role || "";

              // Truncate logic
              const shortName = name.length > 10 ? name.slice(0, 10) + "..." : name;
              const shortRole = role.length > 15 ? role.slice(0, 15) + "..." : role;

              return (
                <div
                  key={staffMember.id}
                  className="p-1 sm:p-3 font-bold text-center border-r last:border-r-0 min-w-[100px] sm:min-w-[150px] flex flex-col items-center justify-center text-xs sm:text-sm"
                  title={`${name} (${role})`} // Tooltip with full text
                >
                  {/* Staff Name */}
                  <div className="truncate w-full">{shortName}</div>

                  {/* Staff Role */}
                  <div className="text-xs sm:text-sm font-normal text-gray-600 hidden sm:block">
                    ({shortRole})
                  </div>
                </div>
              );
            })}

          </div>

          {/* Time Slots and Appointment Grid */}
          <div>
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.hour}
                className="grid gap-0.5 sm:gap-1 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                style={{
                  gridTemplateColumns: `${timeColWidth} repeat(${displayedStaff.length}, ${colWidth})`,
                }}
                ref={(el) => (timeSlotRefs.current[timeSlot.hour] = el)}
              >
                <div className="bg-gray-50 p-1 sm:p-3 text-xs sm:text-sm font-semibold sticky left-0 z-20 min-h-[60px] sm:min-h-[80px] flex items-center justify-center border-r">
                  {timeSlot.label}
                </div>
                {displayedStaff.map((staffMember) => {
                  const staffAppointments = dayAppointments.filter((appointment) => {
                    try {
                      const allStaffIds = [];
                      if (appointment.staff && appointment.staff.length > 0) {
                        allStaffIds.push(...appointment.staff);
                      }
                      if (
                        appointment.staff_contributions &&
                        appointment.staff_contributions.length > 0
                      ) {
                        appointment.staff_contributions.forEach((contribution) => {
                          if (
                            contribution.staff_distribution &&
                            contribution.staff_distribution.length > 0
                          ) {
                            contribution.staff_distribution.forEach((staff) => {
                              if (staff.staff_id) {
                                allStaffIds.push(staff.staff_id);
                              }
                            });
                          }
                        });
                      }
                      if (
                        appointment.included_services &&
                        appointment.included_services.length > 0
                      ) {
                        appointment.included_services.forEach((service) => {
                          if (service.staff && service.staff.length > 0) {
                            allStaffIds.push(...service.staff);
                          }
                        });
                      }
                      if (
                        appointment.included_offers &&
                        appointment.included_offers.length > 0
                      ) {
                        appointment.included_offers.forEach((offer) => {
                          if (offer.staff && offer.staff.length > 0) {
                            allStaffIds.push(...offer.staff);
                          }
                        });
                      }
                      if (appointment.source === "trakky") {
                        return true;
                      }
                      return allStaffIds.includes(staffMember.id);
                    } catch (e) {
                      console.error("Error parsing appointment time:", e);
                      return true;
                    }
                  });

                  const now = new Date();
                  const slotTime = new Date(currentDate);
                  slotTime.setHours(timeSlot.hour, 0, 0, 0);
                  const isPast = slotTime < now;

                  return (
                    <div
                      key={`${staffMember.id}-${timeSlot.hour}`}
                      className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 relative group border-r last:border-r-0 text-xs ${isPast
                        ? "opacity-50 cursor-not-allowed bg-gray-100"
                        : "cursor-pointer hover:bg-blue-50"
                        }`}
                      onClick={() =>
                        !isPast &&
                        handleTimeSlotClick(currentDate, timeSlot.hour, staffMember.id)
                      }
                    >
                      <div className="flex flex-col gap-0.5 sm:gap-1 h-full">
                        {staffAppointments
                          .filter(appointment => isAppointmentInTimeSlot(appointment, timeSlot.hour))
                          .slice(0, screenSize === 'small' ? 1 : 2)
                          .map((appointment, index) => {
                            const now = new Date();
                            let timeToUse = appointment.time_in;
                            if (!timeToUse && appointment.created_at) {
                              const createdTime = appointment.created_at.split("T")[1];
                              timeToUse = createdTime.split(".")[0];
                            }
                            if (!timeToUse && appointment.source === "trakky") {
                              timeToUse = appointment.time_in || "00:00:00";
                            }
                            const appointmentTime = parseISO(
                              `${appointment.date}T${timeToUse}`
                            );
                            const isPastAppt = isBefore(appointmentTime, now);

                            return (
                              <div
                                key={`${appointment.id}-${appointment.source}-${index}`}
                                className={`${getAppointmentColor(
                                  appointment
                                )} text-white text-xs p-0.5 sm:p-2 rounded relative flex flex-col justify-center ${isPastAppt ? "opacity-50 cursor-not-allowed" : "cursor-pointer group/appointment"
                                  } ${screenSize === 'small' ? 'hidden md:block' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isPastAppt) handleAppointmentClick(appointment, e);
                                }}
                              >
                                <div className="font-semibold truncate text-xs sm:text-sm">
                                  {appointment.customer_name}
                                  {appointment.source === "trakky" && " (Trakky)"}
                                </div>
                                {screenSize !== 'small' && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-64 bg-gray-100 text-black p-3 rounded-lg shadow-md">
                                    <div className="text-sm font-semibold mb-2">
                                      Appointment Details
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      <div>
                                        <strong>Customer:</strong>{" "}
                                        {appointment.customer_name}
                                      </div>
                                      <div>
                                        <strong>Phone:</strong>{" "}
                                        {appointment.customer_phone}
                                      </div>
                                      <div>
                                        <strong>Services:</strong>{" "}
                                        {appointment.included_services
                                          ?.map((s) => s.service_name)
                                          .join(", ") || "None"}
                                      </div>
                                      <div>
                                        <strong>Offers:</strong>{" "}
                                        {appointment.included_offers
                                          ?.map((o) => o.offer_name || `Offer ID: ${o.offer_id}`)
                                          .join(", ") || "None"}
                                      </div>
                                      <div>
                                        <strong>Staff:</strong>{" "}
                                        {appointment.source === "trakky"
                                          ? "N/A"
                                          : getStaffNames(appointment).join(", ")}
                                      </div>
                                      <div>
                                        <strong>Price:</strong> ₹
                                        {appointment.final_amount}
                                      </div>
                                      <div>
                                        <strong>Time:</strong>{" "}
                                        {appointment.time_in || "N/A"}
                                      </div>
                                      <div>
                                        <strong>Status:</strong>{" "}
                                        {appointment.appointment_status || "Scheduled"}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        {staffAppointments
                          .filter(appointment => isAppointmentInTimeSlot(appointment, timeSlot.hour))
                          .length > (screenSize === 'small' ? 1 : 2) && (
                            <div className="text-gray-500 text-xs">+{staffAppointments
                              .filter(appointment => isAppointmentInTimeSlot(appointment, timeSlot.hour))
                              .length - (screenSize === 'small' ? 1 : 2)}</div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        {dayAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            No appointments scheduled for {format(currentDate, "EEEE, MMMM d, yyyy")}
          </div>
        )}
      </div>
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box style={{ width: screenSize === 'small' ? "100vw" : "fit-content" }} role="presentation">
      <EditAppointment
        appointment={openAppointmentData}
        closeDrawer={() => setDrawerOpen(false)}
        handleToastMessage={setToastMessage}
        setAppointmentData={setOpenAppointmentData}
      />
    </Box>
  );

  const handleAppointmentFormSubmitSuccess = () => {
    setAddAppointmentModalOpen(false);
    const startDate = formatDate(view === "month" ? startOfMonth(currentDate) : view === "week" ? startOfWeek(currentDate) : currentDate);
    const endDate = formatDate(view === "month" ? endOfMonth(currentDate) : view === "week" ? endOfWeek(currentDate) : currentDate);
    getAppointmentsAndBookings(startDate, endDate);
    setSelectedStaffForNewAppointment([]);
  };

  let headerText;
  if (view === "month") {
    headerText = format(currentDate, "MMMM yyyy");
  } else if (view === "week") {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    headerText = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  } else if (view === "day") {
    headerText = format(currentDate, "EEEE, MMMM d, yyyy");
  }

  const handlePrev = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  return (
    <>
      <div className="p-2 sm:p-4 w-full font-poppins">
        {loading && (
          <div className=" fixed inset-0 flex items-center justify-center z-50 w-[50%] mx-auto">
            <div className=" w-1/2 h-1/2 flex flex-col items-center justify-center ">
              <div
                className="w-12 h-12 rounded-full animate-spin
          border-8 border-solid border-purple-500 border-t-transparent"
              ></div>
              <span className="mt-4 text-black text-lg font-medium">
                Loading Appointmnets
              </span>
            </div>
          </div>
        )}
          <div
            className="sticky top-24 z-[99] bg-white p-2 sm:p-4 rounded-lg shadow z-5 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 sm:gap-4"
            style={{ width: "100%" }}
          >
            {/* Left Section - Color Guide */}
            <div className="font-poppins flex-1 min-w-0">
              <h3 className="font-semibold mb-1 text-xs sm:text-sm">Appointment Color Guide:</h3>
              <div className="flex flex-wrap lg:flex-nowrap gap-x-2 sm:gap-x-3 gap-y-1">
                <div className="flex items-center whitespace-nowrap text-xs">
                  <div className="w-3 h-3 bg-green-500 mr-1 rounded"></div>
                  <span>Checked Out</span>
                </div>
                <div className="flex items-center whitespace-nowrap text-xs">
                  <div className="w-3 h-3 bg-[#3a1aa2] mr-1 rounded"></div>
                  <span>Today's Appt.</span>
                </div>
                <div className="flex items-center whitespace-nowrap text-xs">
                  <div className="w-3 h-3 bg-red-500 mr-1 rounded"></div>
                  <span>Missed/Cancel</span>
                </div>
                <div className="flex items-center whitespace-nowrap text-xs">
                  <div className="w-3 h-3 bg-blue-500 mr-1 rounded"></div>
                  <span>Upcoming</span>
                </div>
                <div className="flex items-center whitespace-nowrap text-xs">
                  <div className="w-3 h-3 bg-yellow-500 mr-1 rounded"></div>
                  <span>Consult Only</span>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 bg-[#6B4CD1] text-white px-2 py-1 rounded-md font-poppins select-none">
                <button
                  onClick={handlePrev}
                  className="text-white hover:bg-blue-700 p-1 rounded text-sm"
                >
                  &lt;
                </button>
                <h2 className="text-base sm:text-lg px-1 sm:px-2">{headerText}</h2>
                <button
                  onClick={handleNext}
                  className="text-white hover:bg-blue-700 p-1 rounded text-sm"
                >
                  &gt;
                </button>
              </div>

              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <button
                  onClick={() => handleViewChange("day")}
                  className={`${view === "day" ? "bg-[#4D2DC3] text-white" : "bg-gray-200"
                    } px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm`}
                >
                  Day View
                </button>
                <button
                  onClick={() => handleViewChange("month")}
                  className={`${view === "month" ? "bg-[#4D2DC3] text-white" : "bg-gray-200"
                    } px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm`}
                >
                  Monthly View
                </button>
                <button
                  onClick={() => handleViewChange("week")}
                  className={`${view === "week" ? "bg-[#4D2DC3] text-white" : "bg-gray-200"
                    } px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm`}
                >
                  Weekly View
                </button>

              </div>
            </div>
          </div>

        {view === "month" && (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}

        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>
      <ToastContainer />

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>

      <Modal
        open={addAppointmentModalOpen}
        onClose={() => setAddAppointmentModalOpen(false)}
        aria-labelledby="add-appointment-modal"
        aria-describedby="add-new-appointment"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="font-poppins"
      >
        <div className="relative flex items-center p-2 sm:p-0">
          <IconButton
            onClick={() => setAddAppointmentModalOpen(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: screenSize === 'small' ? "-10px" : "-70px",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>

          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto font-poppins mx-auto">
            <AppointmentForm
              initialDate={selectedFormDate}
              initialTime={selectedTimeSlot}
              initialStaff={selectedStaffForNewAppointment}
              onSuccess={handleAppointmentFormSubmitSuccess}
              onCancel={() => {
                setAddAppointmentModalOpen(false);
                setSelectedStaffForNewAppointment([]);
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={invalidDateModalOpen}
        onClose={() => setInvalidDateModalOpen(false)}
        aria-labelledby="invalid-date-modal"
        aria-describedby="invalid-date-selection"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="font-poppins"
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md text-center mx-4 sm:mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-4">
            Invalid Date Selection
          </h2>
          <p className="mb-6 text-sm">
            You can't choose previous dates for your appointment.
          </p>
          <button
            onClick={() => setInvalidDateModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            OK
          </button>
        </div>
      </Modal>

      <Modal
        open={invalidTimeModalOpen}
        onClose={() => setInvalidTimeModalOpen(false)}
        aria-labelledby="invalid-time-modal"
        aria-describedby="invalid-time-selection"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="font-poppins"
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md text-center mx-4 sm:mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-4">
            Time Slot Not Available
          </h2>
          <p className="mb-6 text-sm">
            You can't book appointments for past time slots. Please select a
            current or future time.
          </p>
          <button
            onClick={() => setInvalidTimeModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            OK
          </button>
        </div>
      </Modal>

      <Modal
        open={visitConfirmationModalOpen}
        onClose={() => setVisitConfirmationModalOpen(false)}
        aria-labelledby="visit-confirmation-modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="font-poppins"
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Appointment Follow-up</h2>

          <div className="mb-4">
            <label className="block mb-2 text-sm">
              Did the customer visit the salon?
            </label>
            <select
              className="w-full p-2 border rounded text-sm"
              value={isVisit}
              onChange={(e) => setIsVisit(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {isVisit && (
            <div className="mb-4">
              <label className="block mb-2 text-sm">
                Reason for not checking out (if applicable):
              </label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason if appointment wasn't properly checked out"
              />
            </div>
          )}

          {!isVisit && (
            <div className="mb-4">
              <label className="block mb-2 text-sm">Reason for not visiting:</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason why the customer didn't visit"
              />
            </div>
          )}

          {reasonHistory.length > 0 && (
            <div className="mb-4">
              <label className="block mb-2 text-sm">Previous Reasons:</label>
              <div className="border rounded p-2 max-h-40 overflow-y-auto text-sm">
                {reasonHistory.map((item, index) => (
                  <div
                    key={index}
                    className="mb-2 pb-2 border-b last:border-b-0"
                  >
                    <div className="text-sm font-semibold">
                      {item.is_visit ? "Visited" : "Did not visit"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(item.date), "MMM d, yyyy h:mm a")}
                    </div>
                    <div className="text-sm mt-1">
                      {item.reason || "No reason provided"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setVisitConfirmationModalOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleVisitConfirmation}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AppointmentTable;