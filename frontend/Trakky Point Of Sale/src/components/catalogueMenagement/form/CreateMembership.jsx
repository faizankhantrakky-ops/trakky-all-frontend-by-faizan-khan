import React, { cloneElement, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Shield, Plus, Settings, Menu, X, ChevronDown } from "lucide-react";

const CreateMembership = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationTabs = [
    {
      label: "Create Membership",
      path: "/customer-loyalty/create-customer-membership",
      icon: Users,
    },
    {
      label: "Create Membership Type",
      path: "/customer-loyalty/create-membership-type",
      icon: Shield,
    },
  ];

  const isActive = (path) => {
    if (path === "/customer-loyalty/create-customer-membership") {
      return location.pathname.includes("create-customer-membership");
    }
    if (path === "/customer-loyalty/create-membership-type") {
      return location.pathname.includes("create-membership-type");
    }
    return false;
  };

  // Get active tab label for mobile dropdown
  const activeTab = navigationTabs.find(tab => isActive(tab.path));

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header with tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Header */}
          {isMobile ? (
            <>
              {/* Mobile Top Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showMobileMenu ? (
                      <X className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Menu className="h-5 w-5 text-gray-600" />
                    )}
                  </button>

                  {/* Membership Icon & Title */}
                  <div className="flex items-center space-x-2">
                    
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                      New Membership Setup
                    </h1>
                  </div>
                </div>
              </div>

              {/* Mobile Tabs Dropdown */}
              <div className="relative mb-3">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {activeTab ? (
                      <>
                        <activeTab.icon className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-gray-900">
                          {activeTab.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Select tab...</span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Dropdown Menu */}
                {showMobileMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {navigationTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const active = isActive(tab.path);
                      return (
                        <button
                          key={tab.path}
                          onClick={() => {
                            navigate(tab.path);
                            setShowMobileMenu(false);
                          }}
                          className={`
                            w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                            ${active 
                              ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                              : 'hover:bg-gray-50 text-gray-700'
                            }
                          `}
                        >
                          <IconComponent className={`h-4 w-4 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                          <span className="font-medium">{tab.label}</span>
                          {active && (
                            <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Status Indicator */}
              <div className="flex items-center justify-center space-x-2 py-2 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isActive("/customer-loyalty/create-customer-membership") ? "bg-indigo-500" : "bg-indigo-400"}`}></div>
                <span className="text-xs font-medium text-gray-700 truncate">
                  {isActive("/customer-loyalty/create-customer-membership")
                    ? "Creating Customer Membership"
                    : "Configuring Membership Type"}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Desktop Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-6 gap-4">
                {/* Left: Heading section */}
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    {/* Membership Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 flex-shrink-0">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                        New Membership Setup
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">
                        Configure membership plans, pricing, duration, and access permissions for users.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active status indicator (Desktop) */}
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg self-start lg:self-center">
                  <div
                    className={`w-2 h-2 rounded-full ${isActive("/customer-loyalty/create-customer-membership") ? "bg-indigo-500" : "bg-indigo-400"}`}
                  ></div>
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                    {isActive("/customer-loyalty/create-customer-membership")
                      ? "Creating Customer Membership"
                      : "Configuring Membership Type"}
                  </span>
                </div>
              </div>

              {/* Desktop Tab Navigation */}
              <div className="flex items-center justify-between">
                <div className="inline-flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  {navigationTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const active = isActive(tab.path);
                    return (
                      <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        className={`
                          relative flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap
                          ${
                            active
                              ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }
                        `}
                      >
                        <IconComponent
                          className={`w-4 h-4 ${
                            active ? "text-indigo-600" : "text-gray-500"
                          }`}
                        />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>

                        {/* Active indicator */}
                        {active && (
                          <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100%-150px)] sm:h-[calc(100%-180px)] w-full overflow-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 md:p-6">
            {cloneElement(props?.children)}
          </div>
        </div>
      </div>

      {/* Mobile overlay when menu is open */}
      {isMobile && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <style jsx global>{`
        @media (max-width: 640px) {
          /* Improve touch targets on mobile */
          button {
            min-height: 44px;
          }
        }
        
        /* Ensure content fits on mobile */
        @media (max-width: 767px) {
          .h-\[calc\(100\%-150px\)\] {
            height: calc(100% - 140px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateMembership;