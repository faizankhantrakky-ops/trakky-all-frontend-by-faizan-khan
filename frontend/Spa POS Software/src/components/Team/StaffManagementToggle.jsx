import React, { cloneElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";
import { Calendar, Users, UserPlus, FileText } from 'lucide-react';

function DailyStaffmanage(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the start date of the current month
  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);

  // Calculate the end date of the current month
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  // Date filter states
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

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="bg-white w-full min-h-[calc(100vh-52px)] esm:min-h-[calc(100vh-70px)] esm:pl-[72px]">
        
        {/* Main Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-full mx-auto px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Management</h1>
                <p className="text-gray-600">
                  Manage staff schedules, records, and registrations
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Today: {formatDate(new Date())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Section */}
        <div className="border-b border-gray-100 bg-white shadow-sm">
          <div className="max-w-full mx-auto px-8">
            <div className="flex space-x-8">
             
              <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/staffmanagement/staffrecord")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/staffmanagement/staffrecord")}
              >
                <span className="flex items-center">
                  <Users className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("/staffmanagement/staffrecord") ? "text-[#492DBD]" : "text-gray-400"
                  }`} />
                  Staff Record
                </span>
                {isActiveTab("/staffmanagement/staffrecord") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>
              
              <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/staffmanagement/staffform")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/staffmanagement/staffform")}
              >
                <span className="flex items-center">
                  <UserPlus className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("/staffmanagement/staffform") ? "text-[#492DBD]" : "text-gray-400"
                  }`} />
                  Register Staff
                </span>
                {isActiveTab("/staffmanagement/staffform") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>
               <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("/staffmanagement/stafftable")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/staffmanagement/stafftable")}
              >
                <span className="flex items-center">
                  <FileText className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("/staffmanagement/stafftable") ? "text-[#492DBD]" : "text-gray-400"
                  }`} />
                  Daily Sheet
                </span>
                {isActiveTab("/staffmanagement/stafftable") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>
              

              
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-full mx-auto px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              
              {/* Date Controls */}
              <div className="w-full lg:w-auto">
                <div className="flex items-center gap-4">
                  {/* Single Date Picker for Staff Table */}
                  {location.pathname === "/staffmanagement/stafftable" && (
                    <div className="relative">
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-[#492DBD]/30">
                        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                        <div className="text-sm font-medium text-gray-700">Select Date:</div>
                        <input
                          type="date"
                          className="ml-3 outline-none text-sm font-semibold text-gray-900 bg-transparent"
                          onChange={(e) => setDate(e.target.value)}
                          value={date}
                        />
                      </div>
                    </div>
                  )}

                  {/* Date Range Picker for Staff Record */}
                  {location.pathname === "/staffmanagement/staffrecord" && (
                    <div className="relative group">
                      <button 
                        className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#492DBD]/30"
                        onClick={() => setShowDateSelectionModal(true)}
                      >
                        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                        <div className="text-left">
                          <div className="text-xs text-gray-600">Date Range</div>
                          <div className="text-sm font-semibold text-gray-900 flex items-center">
                            {formatDate(dateState[0].startDate)}
                            <span className="mx-2 text-gray-400">→</span>
                            {formatDate(dateState[0]?.endDate)}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 ml-3 group-hover:text-[#492DBD] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="w-full lg:w-auto mt-4 lg:mt-0">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                  <span className="font-medium">Current View:</span> 
                  <span className="ml-2 font-semibold text-gray-900">
                    {location.pathname === "/staffmanagement/stafftable" && "Daily Sheet"}
                    {location.pathname === "/staffmanagement/staffrecord" && "Staff Records"}
                    {location.pathname === "/staffmanagement/staffform" && "Staff Registration"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-full mx-auto px-8 py-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {location.pathname === "/staffmanagement/stafftable"
              ? cloneElement(props.children, {
                  date: date,
                })
              : dateState[0]?.startDate === null
              ? cloneElement(props.children, {
                  startDate: currentMonthStartDate.toISOString().slice(0, 10),
                  endDate: currentMonthEndDate.toISOString().slice(0, 10),
                })
              : cloneElement(props.children, {
                  startDate: `${dateState[0]?.startDate?.getFullYear()}-${
                    (dateState[0]?.startDate?.getMonth() + 1).toString().padStart(2, '0')
                  }-${dateState[0]?.startDate?.getDate().toString().padStart(2, '0')}`,
                  endDate: `${dateState[0]?.endDate?.getFullYear()}-${
                    (dateState[0]?.endDate?.getMonth() + 1).toString().padStart(2, '0')
                  }-${dateState[0]?.endDate?.getDate().toString().padStart(2, '0')}`,
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
}

export default DailyStaffmanage;