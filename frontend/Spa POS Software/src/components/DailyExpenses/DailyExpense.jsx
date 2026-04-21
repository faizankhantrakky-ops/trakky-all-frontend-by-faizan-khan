import React, { cloneElement, useRef, useState } from "react";
// import "./css/staffmanagement.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";

function DailyExpenses(props) {
  const location = useLocation();

  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the start date of the current month
  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);

  // Calculate the end date of the current month
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  //  new date filter
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
      <div className="bg-white w-full h-[calc(100vh-52px)] esm:h-[calc(100vh-70px)] esm:pl-[72px]">
        <div className="h-[64px] w-full p-3 px-4 flex flex-wrap lg:flex-nowrap justify-center md:justify-between items-center mb-10 gap-2 md:gap-0 lg:mb-0">
          <div className=" flex items-center h-full w-fit">
            <h2 className="text-lg font-bold md:text-xl">
              Daily expenses
            </h2>
          </div>

          <div
            className="px-4 min-h-[2rem] relative shadow-xl text-center rounded-lg flex items-center  bg-white outline-none cursor-pointer border-none focus:outline-none"
            onClick={() => {
              setShowDateSelectionModal(true);
            }}
          >
            <input
              type="text"
              value={`${dateState[0].startDate.getDate()}-${dateState[0].startDate.getMonth() + 1
                }-${dateState[0].startDate.getFullYear()}`}
              style={{ width: "95px", cursor: "auto" }}
              readOnly
              className="cursor-pointer outline-none border-none focus:outline-none"
            />
            <span style={{ padding: "0 10px" }}> ~ </span>
            <input
              type="text"
              value={`${dateState[0]?.endDate?.getDate()}-${dateState[0]?.endDate?.getMonth() + 1
                }-${dateState[0]?.endDate?.getFullYear()}`}
              style={{ width: "95px", cursor: "auto" }}
              readOnly
              className="cursor-pointer outline-none border-none focus:outline-none"
            />
          </div>
        </div>

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

      <GeneralModal
        open={showDateSelectionModal}
        handleClose={() => setShowDateSelectionModal(false)}
      >
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          setShowDateSelectionModal={setShowDateSelectionModal}
        />
      </GeneralModal>
    </>
  );
}

export default DailyExpenses;
