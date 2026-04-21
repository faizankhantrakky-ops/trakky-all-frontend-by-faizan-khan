import React, { useState, cloneElement } from "react";
// import "../input.css";
import { Link, useLocation } from "react-router-dom";
// import "react-datepicker/dist/react-datepicker.css";
import DateRange from "./dateModal/DateRange";
import GeneralModal from "./generalModal/GeneralModal";
import { useNavigate } from "react-router-dom";


const Dashboard = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
   <>
      <div className="bg-[#EFECFF] w-full h-[calc(100vh-52px)] esm:h-[calc(100vh-70px)] esm:pl-[72px]">
  <div className="h-[64px] w-full p-3 lg:pl-10 flex flex-wrap lg:flex-nowrap justify-center md:justify-between items-center mb-10 gap-2 md:gap-0 lg:mb-0" >
    <div className="flex items-center h-full w-full lg:w-fit bg-[#CACFFF] rounded-lg mb-2 lg:mb-0">
      <button
        className={`h-full rounded-lg px-3 py-1 transition-all duration-500 w-1/3 text-sm md:text-base lg:w-auto ${
          location.pathname === "/"
            ? "bg-white shadow-md"
            : "bg-transparent cursor-pointer"
        }`}
        onClick={() => {
          navigate("/");
        }}
      >
        Sales Details
      </button>
      <div className="h-3/5 w-[0.5px] bg-white hidden lg:block"></div>
      <button
        className={`h-full rounded-lg px-3 py-1 transition-all duration-500 w-1/3 text-sm md:text-base lg:w-auto ${
          location.pathname.split("/").includes("staffdetails")
            ? "bg-white shadow-md"
            : "bg-transparent cursor-pointer"
        }`}
        onClick={() => {
          navigate("/dashboard/staffdetails");
        }}
      >
        Staff Details
      </button>
      <div className="h-3/5 w-[0.5px] bg-white hidden lg:block"></div>
      <button
        className={`h-full rounded-lg px-3 py-1 transition-all duration-500 w-1/3 text-sm md:text-base lg:w-auto ${
          location.pathname.split("/").includes("clientdetails")
            ? "bg-white shadow-md"
            : "bg-transparent cursor-pointer"
        }`}
        onClick={() => {
          navigate("/dashboard/clientdetails");
        }}
      >
        Client Details
      </button>
    </div>
    <div
      className="px-4 min-h-[2rem] relative shadow-xl text-center rounded-lg flex items-center bg-white cursor-pointer border-none"
      onClick={() => {
        setShowDateSelectionModal(true);
      }}
    >
      <input
        type="text"
        value={`${dateState[0].startDate.getDate()}-${
          dateState[0].startDate.getMonth() + 1
        }-${dateState[0].startDate.getFullYear()}`}
        style={{ width: "80px", cursor: "auto" }}
        readOnly
        className="cursor-pointer outline-none border-none focus:outline-none"
      />
      <span className="px-2">~</span>
      <input
        type="text"
        value={`${dateState[0]?.endDate?.getDate()}-${
          dateState[0]?.endDate?.getMonth() + 1
        }-${dateState[0]?.endDate?.getFullYear()}`}
        style={{ width: "80px", cursor: "auto" }}
        readOnly
        className="cursor-pointer outline-none border-none focus:outline-none"
      />
    </div>
  </div>

  {cloneElement(props.children, {
    startDate: `${dateState[0].startDate.getFullYear()}-${
      dateState[0].startDate.getMonth() + 1
    }-${dateState[0].startDate.getDate()}`,
    endDate: `${dateState[0].endDate.getFullYear()}-${
      dateState[0].endDate.getMonth() + 1
    }-${dateState[0].endDate.getDate()}`,
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
};

export default Dashboard;
