import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentListCard from "./AppointmentListCard";
import AuthContext from "../../Context/Auth";
function AppointmentCard({ startDate, endDate }) {
  const params = useParams();
  const { authTokens } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  console.log(startDate, endDate, "start Date");
  const getAppointments = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments/?start_date=${startDate}&end_date=${endDate}`,
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
  }, [startDate, endDate]);

  return (
    <div className="cards-container relative ">
      {appointments &&
        appointments?.map((ele) => {
          return (
            <>
              <AppointmentListCard
                appointment={ele}
                // isDateInRange={isDateInRange}
              />
            </>
          );
        })}
    </div>
  );
}

export default AppointmentCard;
