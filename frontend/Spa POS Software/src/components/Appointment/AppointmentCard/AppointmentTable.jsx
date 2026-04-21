import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentListCard from "../AppointmentListCard";
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
} from "date-fns";
import EditAppointment from "../Temp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Drawer, Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

// function AppointmentTable({startDate,endDate}) {
//   const params = useParams();
//   const { authTokens } = useContext(AuthContext);

//   const [appointments, setAppointments] = useState([]);
//   const getAppointments = async () => {
//     try {
//       const response = await fetch(
//         `https://backendapi.trakky.in/spavendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${authTokens?.access_token}`,
//           },
//         }
//       );
//       if (response.ok) {
//         setAppointments([]);

//         const data = await response.json();
//         setAppointments(data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getAppointments();
//   }, [startDate,endDate]);

//   return (
//     <div className="cards-container relative h-[calc(100%-64px)] overflow-auto">
//       {appointments &&
//         appointments?.map((ele) => {
//           return (
//             <>
//               <AppointmentListCard
//                 appointment={ele}
//               />
//             </>
//           );
//         })}
//     </div>
//   );
// }

function AppointmentTable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("month");

  const { authTokens } = useContext(AuthContext);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [openAppointmentData, setOpenAppointmentData] = useState({});

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

    getAppointments(startDate, endDate);
    console.log("Date Range:", startDate, "to", endDate);
  }, [currentDate, authTokens.access_token, view]);

  const getAppointments = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
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
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const setToastMessage = (message, status) => {
    if (status === "success") {
      toast.success(message);
    }
    if (status === "error") {
      toast.error(message);
    }
  };

  const renderHeader = () => {
    let headerText;
    if (view === "month") {
      headerText = format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      headerText = `${format(weekStart, "MMM d")} - ${format(
        weekEnd,
        "MMM d, yyyy"
      )}`;
    } else if (view === "day") {
      headerText = format(currentDate, "EEEE, MMMM d, yyyy");
    }

    return (
    <div
  className="flex justify-between items-center mb-4 text-white p-3 rounded-lg"
  style={{ background: "#502DC7" }}
>
  <button
    aria-label="Previous"
    onClick={() => {
      if (view === "month") setCurrentDate(subMonths(currentDate, 1));
      else if (view === "week") setCurrentDate(addDays(currentDate, -7));
      else if (view === "day") setCurrentDate(addDays(currentDate, -1));
    }}
    className="text-white hover:bg-blue-700 p-2 rounded"
  >
    <ChevronLeft size={24} />
  </button>

  <h2 className="text-xl font-bold">{headerText}</h2>

  <button
    aria-label="Next"
    onClick={() => {
      if (view === "month") setCurrentDate(addMonths(currentDate, 1));
      else if (view === "week") setCurrentDate(addDays(currentDate, 7));
      else if (view === "day") setCurrentDate(addDays(currentDate, 1));
    }}
    className="text-white hover:bg-blue-700 p-2 rounded"
  >
    <ChevronRight size={24} />
  </button>
</div>

    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];

    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold p-2 bg-gray-200">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 mb-1 min-w-[250px]">{days}</div>
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

        const dayAppointments = appointments.filter(
          (appointment) =>
            formatDate(parseISO(appointment.created_at)) === formattedDate
        );

        days.push(
          <div
            key={day.toISOString()}
            className={`min-h-[100px] p-2 border border-gray-200 ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-100 text-gray-400"
                : isSameDay(day, new Date())
                ? "bg-yellow-100"
                : "bg-white"
            } ${
              selectedDate && isSameDay(day, selectedDate) ? "bg-blue-100" : ""
            } hover:bg-gray-50`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="text-sm">{format(day, "d")}</span>
            {dayAppointments.map((appointment, index) => (
              <div
                key={index}
                className={`bg-blue-500 text-white text-xs p-1 mt-1 rounded truncate cursor-pointer ${
                  appointment?.appointment_status === "completed" &&
                  "bg-green-500"
                } ${
                  appointment?.appointment_status === "cancelled" &&
                  "bg-red-500"
                }`}
                title={appointment.customer_name}
                onClick={() => {
                  if (appointment?.appointment_status === "cancelled") {
                    setToastMessage("This appointment is cancelled", "error");
                    return;
                  }
                  if (appointment?.appointment_status === "completed") {
                    setToastMessage("This appointment is completed", "error");
                    return;
                  }
                  setDrawerOpen(true);
                  setOpenAppointmentData(appointment);
                }}
              >
                {appointment.customer_name}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="mb-4">{rows}</div>;
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

    return (
      <div className="grid grid-cols-8 gap-1">
        <div className="bg-gray-200 p-2 font-bold">Time</div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="bg-gray-200 p-2 font-bold text-center"
          >
            {format(day, "EEE dd")}
          </div>
        ))}
        {Array.from({ length: 24 }).map((_, hour) => (
          <React.Fragment key={hour}>
            <div className="bg-gray-100 p-2 text-sm">{`${hour
              .toString()
              .padStart(2, "0")}:00`}</div>
            {days.map((day) => {
              const dateStr = formatDate(day);
              const dayAppointments = appointments.filter((appointment) => {
                const appointmentDate = parseISO(appointment.created_at);
                return (
                  formatDate(appointmentDate) === dateStr &&
                  appointmentDate.getHours() === hour
                );
              });

              return (
                <div
                  key={day.toISOString()}
                  className="min-h-[50px] border border-gray-200 bg-white"
                  onClick={() => handleDateClick(day)}
                >
                  {dayAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className={`bg-blue-500 text-white text-xs p-1 mt-1 rounded truncate cursor-pointer ${
                        appointment?.appointment_status === "completed" &&
                        "bg-green-500"
                      } ${
                        appointment?.appointment_status === "cancelled" &&
                        "bg-red-500"
                      }`}
                      title={appointment.customer_name}
                      onClick={() => {
                        if (appointment?.appointment_status === "cancelled") {
                          setToastMessage(
                            "This appointment is cancelled",
                            "error"
                          );
                          return;
                        }
                        if (appointment?.appointment_status === "completed") {
                          setToastMessage(
                            "This appointment is completed",
                            "error"
                          );
                          return;
                        }
                        setDrawerOpen(true);
                        setOpenAppointmentData(appointment);
                      }}
                    >
                      {appointment.customer_name}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = formatDate(currentDate);
    const dayAppointments = appointments.filter(
      (appointment) => formatDate(parseISO(appointment.created_at)) === dateStr
    );

    return (
      <div className="grid grid-cols-8 gap-1">
        <div className="bg-gray-200 p-2 font-bold">Time</div>
        <div className="col-span-7 bg-gray-200 p-2 font-bold text-center">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </div>
        {Array.from({ length: 24 }).map((_, hour) => (
          <React.Fragment key={hour}>
            <div className="bg-gray-100 p-2 text-sm">{`${hour
              .toString()
              .padStart(2, "0")}:00`}</div>
            <div
              className="col-span-7 min-h-[50px] border border-gray-200 bg-white"
              onClick={() => handleDateClick(currentDate)}
            >
              {dayAppointments
                .filter(
                  (appointment) =>
                    parseISO(appointment.created_at).getHours() === hour
                )
                .map((appointment, index) => (
                  <div
                    key={index}
                    className={`bg-blue-500 text-white text-xs p-1 mt-1 rounded truncate cursor-pointer ${
                      appointment?.appointment_status === "completed" &&
                      "bg-green-500"
                    } ${
                      appointment?.appointment_status === "cancelled" &&
                      "bg-red-500"
                    }`}
                    title={appointment.customer_name}
                    onClick={() => {
                      if (appointment?.appointment_status === "cancelled") {
                        setToastMessage(
                          "This appointment is cancelled",
                          "error"
                        );
                        return;
                      }
                      if (appointment?.appointment_status === "completed") {
                        setToastMessage(
                          "This appointment is completed",
                          "error"
                        );
                        return;
                      }
                      setDrawerOpen(true);
                      setOpenAppointmentData(appointment);
                    }}
                  >
                    {appointment.customer_name}
                  </div>
                ))}
            </div>
          </React.Fragment>
        ))}
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
    <Box style={{ width: "fit-content" }} role="presentation">
      <EditAppointment
        appointment={openAppointmentData}
        closeDrawer={() => setDrawerOpen(false)}
        handleToastMessage={setToastMessage}
        setAppointmentData={(data) => {
          setAppointments(
            appointments.map((appointment) =>
              appointment.id === data.id ? data : appointment
            )
          );
        }}
      />
    </Box>
  );

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <>
      <div className="p-4 w-full">
        {renderHeader()}
        <div className="flex mb-4 space-x-4">
          <button
            onClick={() => handleViewChange("month")}
            className={`${
              view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 rounded`}
          >
            Month View
          </button>
          <button
            onClick={() => handleViewChange("week")}
            className={`${
              view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 rounded`}
          >
            Week View
          </button>
          <button
            onClick={() => handleViewChange("day")}
            className={`${
              view === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 rounded`}
          >
            Day View
          </button>
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
    </>
  );
}

export default AppointmentTable;
