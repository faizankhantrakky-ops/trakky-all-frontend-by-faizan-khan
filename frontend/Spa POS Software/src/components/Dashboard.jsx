import React, { useState, cloneElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DateRange from "./dateModal/DateRange";
import GeneralModal from "./generalModal/GeneralModal";

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

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  const isActiveTab = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.split("/").includes(path);
  };

  return (
    <>
      <div className="bg-white w-full min-h-[calc(100vh-52px)] esm:min-h-[calc(100vh-70px)] esm:pl-[72px]">
        {/* Main Header */}
      <div className="bg-white text-gray-900 border-b border-gray-200 shadow-sm">
  <div className="max-w-full mx-auto px-6 py-5 md:px-8">
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
          Dashboard Analytics
        </h1>
        <p className="mt-1.5 text-sm text-gray-600">
          Comprehensive overview of your business performance metrics
        </p>
      </div>


      {/* Date Range Selector - adapted for light theme */}
      <div className="w-full lg:w-auto">
        <div className="relative group">
          <div 
            className="flex items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer group-hover:border-gray-300 shadow-sm"
            onClick={() => setShowDateSelectionModal(true)}
          >
            <div className="px-5 py-2.5 border-r border-gray-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Select Period</span>
              </div>
            </div>
            
            <div className="px-5 py-3">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  {formatDate(dateState[0].startDate)}
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  {formatDate(dateState[0]?.endDate)}
                </div>
              </div>
            </div>
            
            <div className="px-4">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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
                  isActiveTab("/")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/")}
              >
                <span className="flex items-center">
                  <svg className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("/") ? "text-[#492DBD]" : "text-gray-400"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Businesses Overview
                </span>
                {isActiveTab("/") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>
              
               <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("clientdetails")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/dashboard/clientdetails")}
              >
                <span className="flex items-center">
                  <svg className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("clientdetails") ? "text-[#492DBD]" : "text-gray-400"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Daily Client
                </span>
                {isActiveTab("clientdetails") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>

              
              <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("staffdetails")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/dashboard/staffdetails")}
              >
               <span className="flex items-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 mr-3 transition-colors ${
      isActiveTab("staffdetails") ? "text-[#492DBD]" : "text-gray-400"
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
    />
    <circle cx="9" cy="7" r="4" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M23 20v-2a4 4 0 00-3-3.87"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 3.13a4 4 0 010 7.75"
    />
  </svg>
  <span className="text-sm font-medium">Team Management</span>
</span>

                {isActiveTab("staffdetails") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>

              <button
                className={`relative px-1 py-5 text-sm font-medium transition-all duration-300 ${
                  isActiveTab("membership")
                    ? "text-[#492DBD]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => navigate("/dashboard/membership")}
              >
                <span className="flex items-center">
                  <svg className={`w-5 h-5 mr-3 transition-colors ${
                    isActiveTab("membership") ? "text-[#492DBD]" : "text-gray-400"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Manage Membership
                </span>
                {isActiveTab("membership") && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#492DBD] rounded-t-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {isActiveTab("/") && "Sales Performance Overview"}
                {isActiveTab("staffdetails") && "Staff Performance Metrics"}
                {isActiveTab("clientdetails") && "Client Analytics Dashboard"}
                {isActiveTab("membership") && "Membership Management Overview"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isActiveTab("/") && "Detailed analysis of sales transactions and revenue trends"}
                {isActiveTab("staffdetails") && "Monitor team performance and productivity metrics"}
                {isActiveTab("clientdetails") && "Comprehensive view of client engagement and satisfaction"}
                {isActiveTab("membership") && "Manage and track membership subscriptions and renewals"}
              </p>
            </div>
            
            <div className="p-8">
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

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white py-4">
          <div className="max-w-full mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="flex items-center">
               
                <span className="font-medium text-gray-700">SPA Analytics</span>
                <span className="mx-2">•</span>
                <span>v2.1.4</span>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="text-gray-600">Data range: {formatDate(dateState[0].startDate)} - {formatDate(dateState[0]?.endDate)}</span>
              </div>
            </div>
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

export default Dashboard;