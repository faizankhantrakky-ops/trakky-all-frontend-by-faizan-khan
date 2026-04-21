import React, { cloneElement } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";
import { Switch } from "@mui/material";
import { 
  Calendar, 
  Plus, 
  CalendarDays, 
  LayoutGrid, 
  ExternalLink,
  ChevronDown,
  Clock
} from "lucide-react";

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
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-full h-[calc(100vh-52px)] esm:h-[calc(100vh-70px)] esm:pl-[72px]">
        {/* Single Row Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full p-4 lg:pl-3">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Left Side - Title and Navigation */}
              <div className="flex items-center gap-6 w-full lg:w-auto">
                {/* Page Title */}
                <div className="flex items-center gap-3">
                 
                  <div>
                       <div className="flex items-center">
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                    <button
                      className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                        location.pathname.includes("list-appointment")
                          ? "bg-[#6B4CD1] shadow-sm text-white border border-[#6B4CD1] rounded-lg"
                          : "bg-transparent text-gray-700 hover:bg-white/80"
                      }`}
                      onClick={() => navigate("/appointment/list-appointment/calender")}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>View Appointments</span>
                    </button>
                    <button
                      className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                        location.pathname.includes("add-new-appointment")
                          ? "bg-[#6B4CD1] shadow-sm text-white border border-[#6B4CD1] rounded-lg"
                          : "bg-transparent text-gray-700 hover:bg-white/80"
                      }`}
                      onClick={() => navigate("/appointment/add-new-appointment")}
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Appointment</span>
                    </button>
                  </div>
                </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
           
              </div>

              {/* Right Side - All Controls in One Row */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
                
                {/* Calendar/Card Switch */}
                {location.pathname.includes("list-appointment") && (
                  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
                    <div className={`flex items-center gap-2 ${location.pathname.includes("calender") ? "text-[#502DA6]" : "text-gray-500"}`}>
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:block">Calendar</span>
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
                          color: '#502DA6',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#502DA6',
                        },
                      }}
                    />
                    <div className={`flex items-center gap-2 ${!location.pathname.includes("calender") ? "text-[#502DA6]" : "text-gray-500"}`}>
                      <LayoutGrid className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:block">Cards</span>
                    </div>
                  </div>
                )}

                {/* Date Range Filter */}
                {location.pathname.includes("card") && (
                  <div
                    className="px-3 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 text-sm flex items-center gap-2 border border-gray-200 hover:border-[#502DA6] group"
                    onClick={() => setShowDateSelectionModal(true)}
                  >
                    <CalendarDays className="w-4 h-4 text-gray-500 group-hover:text-[#502DA6]" />
                    <span className="text-gray-700 font-medium whitespace-nowrap">
                      {formatDate(dateState[0].startDate)} - {formatDate(dateState[0].endDate)}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#502DA6]" />
                  </div>
                )}

                {/* Booking from Trakky Button */}
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md flex items-center gap-2 group border ${
                    location.pathname.includes("booking-from-trakky")
                      ? "bg-[#502DA6] text-white border-[#502DA6]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#502DA6] hover:text-[#502DA6]"
                  }`}
                  onClick={() => navigate("/appointment/bookings-from-trakky-platform")}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:block">Trakky Bookings</span>
                  <span className="sm:hidden">Trakky</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full h-[calc(100%-100px)]">
          {/* Children with Date Props */}
          {cloneElement(props.children, {
            startDate: `${dateState[0].startDate.getFullYear()}-${String(
              dateState[0].startDate.getMonth() + 1
            ).padStart(2, "0")}-${String(dateState[0].startDate.getDate()).padStart(2, "0")}`,
            endDate: `${dateState[0].endDate.getFullYear()}-${String(
              dateState[0].endDate.getMonth() + 1
            ).padStart(2, "0")}-${String(dateState[0].endDate.getDate()).padStart(2, "0")}`,
          })}
        </div>
      </div>

      {/* Date Selection Modal */}
      <GeneralModal open={showDateSelectionModal} handleClose={() => setShowDateSelectionModal(false)}>
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