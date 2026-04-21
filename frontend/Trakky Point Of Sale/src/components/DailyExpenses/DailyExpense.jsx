import React, { cloneElement, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";

function DailyExpenses(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: currentMonthStartDate,
      endDate: currentMonthEndDate,
      key: "selection",
    },
  ]);

  const [date, setDate] = useState(
    new Date()
      .toLocaleString("en-CA", { timeZone: "Asia/Kolkata" })
      .slice(0, 10)
  );

  return (
    <>
      <div className="bg-[#EFECFF] w-full h-[calc(100vh-52px)] esm:h-[calc(100vh-70px)] esm:pl-[72px]">
        {/* Responsive header section */}
       

        {dateState[0]?.startDate === null
          ? cloneElement(props.children, {
            startDate: currentMonthStartDate.toISOString().slice(0, 10),
            endDate: currentMonthEndDate.toISOString().slice(0, 10),
          })
          : cloneElement(props.children, {
            startDate: `${dateState[0]?.startDate?.getFullYear()}-${dateState[0]?.startDate?.getMonth() + 1
              }-${dateState[0]?.startDate?.getDate()}`,
            endDate: `${dateState[0]?.endDate?.getFullYear()}-${dateState[0]?.endDate?.getMonth() + 1
              }-${dateState[0]?.endDate?.getDate()}`,
          })}
      </div>

     
    </>
  );
}

export default DailyExpenses;