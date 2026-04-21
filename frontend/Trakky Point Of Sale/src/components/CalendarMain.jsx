import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../src/Context/Auth";
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

const EnhancedCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("month");

  const { authTokens } = useContext(AuthContext);

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
        className="flex justify-between items-center mb-4 text-white p-4 rounded-lg"
        style={{ background: "linear-gradient(to bottom, #502DC7, #022F59)" }}
      >
        <button
          onClick={() => {
            if (view === "month") {
              setCurrentDate(subMonths(currentDate, 1));
            } else if (view === "week") {
              setCurrentDate(addDays(currentDate, -7));
            } else if (view === "day") {
              setCurrentDate(addDays(currentDate, -1));
            }
          }}
          className="text-white hover:bg-blue-700 p-2 rounded"
        >
          &lt;
        </button>
        <h2 className="text-xl font-bold">{headerText}</h2>
        <button
          onClick={() => {
            if (view === "month") {
              setCurrentDate(addMonths(currentDate, 1));
            } else if (view === "week") {
              setCurrentDate(addDays(currentDate, 7));
            } else if (view === "day") {
              setCurrentDate(addDays(currentDate, 1));
            }
          }}
          className="text-white hover:bg-blue-700 p-2 rounded"
        >
          &gt;
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
                ? "bg-[#EFECFF]"
                : "bg-white"
            } ${
              selectedDate && isSameDay(day, selectedDate) ? "bg-blue-100" : ""
            } cursor-pointer hover:bg-gray-50`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="text-sm">{format(day, "d")}</span>
            {dayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white text-xs p-1 mt-1 rounded truncate"
                title={appointment.customer_name}
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
                      className="bg-blue-500 text-white text-xs p-1 mt-1 rounded"
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
                    className="bg-blue-500 text-white text-xs p-1 mt-1 rounded"
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

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="p-4 ml-0 md:ml-20 w-full">
      {renderHeader()}
      <div className="flex mb-4 space-x-4">
        <button
          onClick={() => handleViewChange("month")}
          className={`${
            view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
          } p-2 rounded`}
        >
          Monthly View
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
  );
};

export default EnhancedCalendar;
