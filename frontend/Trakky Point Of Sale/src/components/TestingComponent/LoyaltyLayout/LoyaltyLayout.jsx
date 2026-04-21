import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  MessageSquare,
  Users,
  Star,
  AlertCircle,
  Search,
  Filter,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const LoyaltyLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const tabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: BarChart3,
      path: "/loyalty/dashboard",
    },
    
     {
      id: "staff",
      name: "Staff Performances",
      icon: Users,
      path: "/loyalty/staff-performance",
    },

    {
      id: "feedback",
      name: "All Feedback",
      icon: MessageSquare,
      path: "/loyalty/feedback",
    },
    
    {
      id: "loyalty",
      name: "Customer Loyalty",
      icon: Star,
      path: "/loyalty/customer-loyalty",
    },

   


    {
      id: "complaints",
      name: "Complaints Trackings",
      icon: AlertCircle,
      path: "/loyalty/customers-complains-tracking",
    },
    
  ];

  // Check if current path matches tab path
  const ActiveRoute = (path) => {
    if (path === "/loyalty/dashboard") {
      return (
        location.pathname === "/loyalty" ||
        location.pathname === "/loyalty/dashboard"
      );
    }
    return location.pathname.startsWith(path);
  };

  // Handle mobile menu toggle
  const ToggleMenuMobileView = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle dropdown toggle
  const ItDropdowntoggle = (tabId) => {
    setActiveDropdown(activeDropdown === tabId ? null : tabId);
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Mobile Menu Button */}
      <button
        onClick={ToggleMenuMobileView}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar for mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-700">Menu</h2>
              <button onClick={ToggleMenuMobileView}>
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const active = ActiveRoute(tab.path);

                return (
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    onClick={ToggleMenuMobileView}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      active
                        ? "bg-[#492DBD] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span>{tab.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="md:pl-20 w-full">
        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto p-1 md:p-2 lg:p-3">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Customer Satisfaction
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Collect, trace, analyze and respond to customers feedback to
                  improve service quality
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 bg-gray-100 rounded-lg hidden md:block">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>

                <button className="p-2 bg-gray-100 rounded-lg hidden md:block">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Tab Navigation - Desktop */}
            <div className="hidden md:block mt-6">
              <div className="flex space-x-1 border-b border-gray-300 overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const active = ActiveRoute(tab.path);

                  return (
                    <NavLink
                      key={tab.id}
                      to={tab.path}
                      className={`flex items-center space-x-2 px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                        active
                          ? "border-[#492DBD] text-[#492DBD]"
                          : "border-transparent text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Tab Navigation - Mobile Dropdown */}
            <div className="md:hidden mt-4">
              <div className="relative">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const active = ActiveRoute(tab.path);

                  if (active) {
                    return (
                      <button
                        key={tab.id}
                        onClick={() => ItDropdowntoggle(tab.id)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{tab.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            activeDropdown === tab.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    );
                  }
                  return null;
                })}

                {/* Dropdown Menu */}
                {activeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {tabs
                      .filter((tab) => !ActiveRoute(tab.path))
                      .map((tab) => {
                        const IconComponent = tab.icon;

                        return (
                          <NavLink
                            key={tab.id}
                            to={tab.path}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center space-x-2 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <span>{tab.name}</span>
                          </NavLink>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-[calc(100vh-200px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyLayout;
