import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Settings, ChevronRight, Menu, X } from "lucide-react";

const SettingMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/settings") {
      navigate("manager");
    }
  }, [location.pathname, navigate]);

  const sidebarOptionsServices = [
    { name: "Automation Report", link: "automation-report-genrattion" },
    { name: "Manager", link: "manager" },

    
    { name: "Change Tax", link: "custom-tax" },
    { name: "Payment Method", link: "payment-method" },
   
    { name: "Manage Templates", link: "template-manage" },

    { name: "Whatsapp Reminder", link: "whatsapp-message-remider" },

    { name: "Version Info", link: "version-info" },
    { name: "How It Works", link: "how-it-works" },
    { name: "Instant Report Genrate", link: "report-setting" },
    { name: "Manage Branch", link: "branch-management" },
    // { name: "Customer Loyalty", link: "loyalty" },
     { name: "Change Password", link: "chanage-password" },
  ];

  const isActive = (link) => location.pathname.includes(link);

  return (
    <>
      <div className="md:pl-[72px] w-full h-[calc(100vh-52px)] md:h-[calc(100vh-70px)] bg-gray-50">
        <div className="flex w-full h-full">

          {/* Mobile: Menu Button */}
          <div className="md:hidden fixed top-16 left-4 z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all border border-gray-300"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div
            className={`
              fixed md:relative inset-y-0 left-0 z-40
              w-80 bg-white border-r border-gray-300
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              md:w-64
              overflow-y-auto
            `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-300 bg-white">
              <div className="flex items-center space-x-3">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your preferences</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-1">
              {sidebarOptionsServices.map((option) => (
                <button
                  key={option.link}
                  onClick={() => {
                    navigate(`/settings/${option.link}`);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg text-left transition-all
                    ${isActive(option.link)
                      ? "bg-[#492DBD] text-white shadow-sm"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="font-medium text-sm">{option.name}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive(option.link) ? "text-white" : "text-gray-400"
                    }`} />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 bg-white">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Trakky Salon Management System
                </p>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 w-full h-full overflow-auto bg-gray-50">
            <div className="p-4 md:p-6 h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingMain;