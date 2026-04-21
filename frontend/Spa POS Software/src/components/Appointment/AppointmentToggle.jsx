import React, { cloneElement } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";
import { Switch } from "@mui/material";
import { CalendarMonth, AddCircleOutline, CalendarViewMonth, CalendarToday, FilterList } from "@mui/icons-material";

const AppointmentToggle = (props) => {
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

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const isActiveTab = (path) => {
    return location.pathname.split("/").includes(path);
  };

  return (
    <>
      <div className="bg-white w-full min-h-[calc(100vh-52px)] esm:min-h-[calc(100vh-70px)] esm:pl-[72px]">
        {/* Main Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-full mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Management</h1>
                <p className="text-gray-600">
                  Schedule and manage client appointments
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <CalendarToday className="w-4 h-4 mr-2" />
                  <span>Current Date: {formatDate(new Date())}</span>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Navigation Tabs */}
              <div className="w-full lg:w-auto">
                <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-white shadow-sm">
                  <button
                    className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                      isActiveTab("list-appointment")
                        ? "bg-gradient-to-r from-[#482DBC] to-[#5D46E0] text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      navigate("/appointment/list-appointment/calender");
                    }}
                  >
                    <CalendarMonth className={`w-5 h-5 mr-2 ${isActiveTab("list-appointment") ? "text-white" : "text-gray-500"}`} />
                    Appointments
                  </button>
                  
                  <div className="w-px h-6 bg-gray-300 my-auto mx-1"></div>
                  
                  <button
                    className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                      isActiveTab("create-appointment")
                        ? "bg-gradient-to-r from-[#482DBC] to-[#5D46E0] text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      navigate("/appointment/create-appointment");
                    }}
                  >
                    <AddCircleOutline className={`w-5 h-5 mr-2 ${isActiveTab("create-appointment") ? "text-white" : "text-gray-500"}`} />
                    New Appointment
                  </button>
                </div>
              </div>

              {/* Controls Section */}
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* View Toggle */}
                  {location.pathname.includes("list-appointment") && (
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm">
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          <CalendarToday className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Calendar</span>
                        </div>
                        <Switch
                          size="small"
                          checked={!location.pathname.includes("calender")}
                          onChange={() => {
                            if (location.pathname.includes("calender")) {
                              navigate(location.pathname.replace("calender", "card"));
                            } else {
                              navigate(location.pathname.replace("card", "calender"));
                            }
                          }}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#482DBC',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#482DBC',
                            },
                          }}
                        />
                        <div className="flex items-center ml-2">
                          <CalendarViewMonth className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Card</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date Filter */}
                  {location.pathname.includes("card") && (
                    <div className="relative">
                      <button 
                        className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#482DBC] group"
                        onClick={() => setShowDateSelectionModal(true)}
                      >
                        <FilterList className="w-5 h-5 text-gray-500 mr-3 group-hover:text-[#482DBC] transition-colors" />
                        <div className="text-left">
                          <div className="text-xs text-gray-600">Date Range</div>
                          <div className="text-sm font-semibold text-gray-900 flex items-center">
                            {formatDate(dateState[0].startDate)}
                            <span className="mx-2 text-gray-400">→</span>
                            {formatDate(dateState[0]?.endDate)}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 ml-3 group-hover:text-[#482DBC] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-full mx-auto px-3 py-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {cloneElement(props.children, {
              startDate: `${dateState[0].startDate.getFullYear()}-${
                (dateState[0].startDate.getMonth() + 1).toString().padStart(2, '0')
              }-${dateState[0].startDate.getDate().toString().padStart(2, '0')}`,
              endDate: `${dateState[0].endDate.getFullYear()}-${
                (dateState[0].endDate.getMonth() + 1).toString().padStart(2, '0')
              }-${dateState[0].endDate.getDate().toString().padStart(2, '0')}`,
            })}
          </div>
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

export default AppointmentToggle;