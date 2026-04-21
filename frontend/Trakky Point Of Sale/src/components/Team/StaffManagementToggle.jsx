import React, { cloneElement, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GeneralModal from "../generalModal/GeneralModal";
import DateRange from "../dateModal/DateRange";
import { 
  Calendar, 
  Users, 
  UserPlus, 
  ClipboardList,
  ChevronRight,
  Settings,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

function DailyStaffmanage(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Start and end of current month
  const currentMonthStartDate = new Date(currentYear, currentMonth, 1);
  const currentMonthEndDate = new Date(currentYear, currentMonth + 1, 0);

  // Date filter state for range (used in Staff Record & Attendance Details)
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: currentMonthStartDate,
      endDate: currentMonthEndDate,
      key: "selection",
    },
  ]);

  // Single date for Daily Sheet
  const [date, setDate] = useState(
    new Date()
      .toLocaleString("en-CA", { timeZone: "Asia/Kolkata" })
      .slice(0, 10)
  );

  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper: Check if current path is one of the staff management routes
  const isActive = (path) => location.pathname === path;

  const navigationTabs = [
    { 
      path: "/staffmanagement/stafftable", 
      label: "Daily Sheet", 
      icon: ClipboardList 
    },
    { 
      path: "/staffmanagement/staffrecord", 
      label: "Staff Record", 
      icon: Users 
    },
    { 
      path: "/staffmanagement/attendencedetails", 
      label: "Attendance Details", 
      icon: Calendar 
    },
    { 
      path: "/staffmanagement/staffform", 
      label: "Register Staff", 
      icon: UserPlus 
    },
  ];

  // Get active tab label
  const activeTab = navigationTabs.find(tab => isActive(tab.path))?.label || "Staff Management";

  // Format date range for display
  const formatDateRange = () => {
    if (isActive("/staffmanagement/stafftable")) {
      return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } else if (isActive("/staffmanagement/staffrecord") || isActive("/staffmanagement/attendencedetails")) {
      return `${dateState[0].startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${dateState[0].endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
    return null;
  };

  return (
    <>
      <div className="bg-white w-full h-[calc(100vh-52px)] pl-0 md:pl-[72px]">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          {/* Top Header - Always visible */}
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="truncate">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                    Staff Management
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {isMobile ? activeTab : "Manage your team's attendance"}
                  </p>
                </div>
              </div>
              
              {/* Mobile Menu Toggle Button */}
              <button 
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Toggle menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Date Picker - Always visible on mobile when applicable */}
            {isMobile && (isActive("/staffmanagement/stafftable") || 
              isActive("/staffmanagement/staffrecord") || 
              isActive("/staffmanagement/attendencedetails")) && (
              <div className="mt-3">
                {isActive("/staffmanagement/stafftable") ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] bg-white"
                      onChange={(e) => setDate(e.target.value)}
                      value={date}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDateSelectionModal(true)}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{formatDateRange()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs - Desktop */}
          {!isMobile && (
            <div className="px-6 pb-2">
              <div className="inline-flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                {navigationTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.path}
                      onClick={() => navigate(tab.path)}
                      className={`
                        relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200
                        ${isActive(tab.path)
                          ? "bg-white text-[#492DBD] shadow-sm border border-gray-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                      {isActive(tab.path) && (
                        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#492DBD] rounded-t-md" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desktop Date Picker - Beside tabs */}
          {!isMobile && (isActive("/staffmanagement/stafftable") || 
            isActive("/staffmanagement/staffrecord") || 
            isActive("/staffmanagement/attendencedetails")) && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
              {isActive("/staffmanagement/stafftable") ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] bg-white w-48"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowDateSelectionModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700 whitespace-nowrap">
                    {formatDateRange()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && showMobileMenu && (
          <div className="fixed inset-x-0 top-[calc(52px+theme(spacing.4))] mx-4 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              {navigationTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.path}
                    onClick={() => {
                      navigate(tab.path);
                      setShowMobileMenu(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive(tab.path)
                        ? "bg-[#492DBD] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {isActive(tab.path) && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-gray-50 h-[calc(100vh-124px)] lg:h-[calc(100vh-124px)] overflow-auto">
          {/* Render Child with Appropriate Props */}
          {isActive("/staffmanagement/stafftable") ? (
            cloneElement(props.children, { date })
          ) : isActive("/staffmanagement/staffrecord") || isActive("/staffmanagement/attendencedetails") ? (
            dateState[0]?.startDate && dateState[0]?.endDate ? (
              cloneElement(props.children, {
                startDate: `${dateState[0].startDate.getFullYear()}-${String(
                  dateState[0].startDate.getMonth() + 1
                ).padStart(2, "0")}-${String(dateState[0].startDate.getDate()).padStart(2, "0")}`,
                endDate: `${dateState[0].endDate.getFullYear()}-${String(
                  dateState[0].endDate.getMonth() + 1
                ).padStart(2, "0")}-${String(dateState[0].endDate.getDate()).padStart(2, "0")}`,
              })
            ) : (
              cloneElement(props.children, {
                startDate: currentMonthStartDate.toISOString().slice(0, 10),
                endDate: currentMonthEndDate.toISOString().slice(0, 10),
              })
            )
          ) : (
            cloneElement(props.children) // fallback for staffform
          )}
        </div>
      </div>

      {/* Date Range Modal */}
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