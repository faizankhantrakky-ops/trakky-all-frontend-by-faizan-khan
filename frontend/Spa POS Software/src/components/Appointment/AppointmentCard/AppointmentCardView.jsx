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


function AppointmentCardView({startDate,endDate}) {
  const params = useParams();
  const { authTokens } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/appointments-new/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      if (response.ok) {
        setAppointments([]);

        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [startDate,endDate]);

  return (
    <div className="cards-container relative h-[calc(100%-64px)] overflow-auto">
      {appointments &&
        appointments?.map((ele) => {
          return (
            <>
              <AppointmentListCard
                appointment={ele}
              />
            </>
          );
        })}
    </div>
  );
}


export default AppointmentCardView;
