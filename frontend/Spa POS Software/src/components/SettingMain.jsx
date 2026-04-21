import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const SettingMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/settings") {
      navigate("manager");
    }
  }, [location.pathname, navigate]);

  const sidebarOptions = [
    {
      name: "Manager",
      link: "manager",
    },
    {
      name: "Change Password",
      link: "Chnage-Password",
    },
  ];

  const isActive = (option) => {
    return location.pathname.split("/").includes(option.link);
  };

  return (
    <div className="md:pl-[72px] w-full min-h-[calc(100vh-52px)] md:min-h-[calc(100vh-70px)] bg-gradient-to-br from-gray-50 to-white">
      <div className="flex w-full h-full">
        {/* Sidebar - Fixed Position */}
        {(window.innerWidth > 768 || location.pathname === "/settings") && (
          <div className="w-full md:w-64 lg:w-72 shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto fixed md:relative">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-600 mt-1">System Configuration</p>
            </div>

            {/* Navigation Sections */}
            <div className="p-4 space-y-8">
              {/* Settings Management */}
              <div>
                <div className="mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">System Settings</h3>
                </div>
                <div className="space-y-1">
                  {sidebarOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(`/settings/${option.link}`)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive(option)
                          ? "bg-gradient-to-r from-[#482DBC] to-[#5D46E0] text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          isActive(option) ? "bg-white" : "bg-gray-300"
                        }`} />
                        <span className="text-sm font-medium">{option.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Settings Status</span>
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Security Level</span>
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Last Backup</span>
                    <span className="text-xs font-medium text-gray-900">24 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <div className="text-xs text-gray-500 text-center">
                <p>Settings Version 2.1</p>
                <p className="mt-1">© 2024 Spa Management</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-hidden ml-0 ">
          <div className="bg-white h-full">
            {/* Content Header - Fixed */}
            <div className="border-b border-gray-200 bg-white px-6 py-4 sticky top-0 z-10">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {sidebarOptions.find(opt => isActive(opt))?.name || "Settings Dashboard"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {sidebarOptions.find(opt => isActive(opt))?.name === "Manager" 
                  ? "Manage system administrators and permissions" 
                  : "Change your account password and security settings"}
              </p>
            </div>
            
            {/* Content Area - Scrollable */}
            <div className="h-[calc(100vh-52px-80px)] md:h-[calc(100vh-70px-80px)] overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingMain;