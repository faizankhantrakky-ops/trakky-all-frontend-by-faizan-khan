import React, { useState, useEffect } from "react";

import "../input.css";
import Card from "./Dashbord_cards";
import toast, { Toaster } from "react-hot-toast";

import GeneralModal from "./generalmodal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import "./css/dashboard.css";

// nothing
const Dashboard = () => {
  const [dashboardCardData1, setDashboardCardData1] = React.useState();
  const [dashboardCardData2, setDashboardCardData2] = React.useState();

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
      startDate: currentDate,
      endDate: currentDate,
      key: "selection",
    },
  ]);

  useEffect(() => {
    fetchdashboardCardData();
  }, [dateState]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchdashboardCardData = async () => {
    const [{ startDate, endDate }] = dateState;

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    console.log("start : ", formattedStartDate);
    console.log("end : ", formattedEndDate);

    try {
      const apiUrl = `https://backendapi.trakky.in/spas/dashboard/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.status === 200) {
        setDashboardCardData2(Object.values(data));
        setDashboardCardData1(Object.keys(data));
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log("Error : ", error);
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  React.useEffect(() => {
    fetchdashboardCardData();
  }, []);

  return (
    <>
      <div className="w-[100%] h-[130%] bg-[#F4F5F7]  flex flex-col overflow-scroll no-scrollbar ">
        <Toaster />
        <div className="DB-main-header">
          <div className="DB-main-header-title">
            <p className="DB-Dashboard">DASHBOARD</p>
            <p className="DB-UserName">Welcome SHIKHAR</p>
          </div>
          <div className="DB-main-date-range ">
            <div
              className="DB-Date-Range-Button"
              onClick={() => {
                setShowDateSelectionModal(true);
              }}
            >
              <input
                type="text"
                value={`${dateState[0].startDate.getDate()}-${
                  dateState[0].startDate.getMonth() + 1
                }-${dateState[0].startDate.getFullYear()}`}
                style={{
                  width: "80px",
                  cursor: "auto",
                  border: "transparent",
                  paddingLeft: "5px",
                }}
                readOnly
              />
              <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>
                {" "}
                ~{" "}
              </span>
              <input
                type="text"
                value={`${dateState[0]?.endDate?.getDate()}-${
                  dateState[0]?.endDate?.getMonth() + 1
                }-${dateState[0]?.endDate?.getFullYear()}`}
                style={{ width: "80px", cursor: "auto", border: "transparent" }}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className=" w-[100%]  gap-2 md:overflow-visible  h-[40%] md:h-[50%] bg-[#F4F5F7] justify-around items-center  flex flex-wrap px-4  ">
          {dashboardCardData1?.map((item, index) => {
            return (
              <Card
                key={index}
                name={item}
                number={dashboardCardData2[index]}
                percent=""
              />
            );
          })}
        </div>
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
};

export default Dashboard;
