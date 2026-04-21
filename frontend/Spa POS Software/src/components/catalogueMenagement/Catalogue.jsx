  import React, { useEffect } from "react";
  import { Outlet, useLocation, useNavigate } from "react-router-dom";

  const Catalogue = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (window.innerWidth > 500 && location.pathname == "/catalogue") {
        navigate("/catalogue/massages");
      }
    }, []);

    const sidebarOptionsServices = [
      {
        name: "Massages",
        link: "massages",
      },
      {
        name: "Massage Request",
        link: "massage-request",
      },
      {
        name: "Membership Package",
        link: "membership-packages",
      },
      {
        name: "Membership Request",
        link: "membership-packages-request",
      },
    ];

    const sidebarOptionsOffers = [
      {
        name: "Offers",
        link: "offers",
      },
      {
        name: "Offers Request",
        link: "offers-Request",
      },
    ];

    const sidebarOptionsMemberships = [
      {
        name: "Membership Type",
        link: "membership-type",
      },
      {
        name: "Customer Membership",
        link: "membership-customer",
      },
      {
        name: "Create Membership",
        link: "create-customer-membership",
        link2: "create-membership-type",
      },
    ];

    const isActive = (option) => {
      return location.pathname.split("/").includes(option.link) ||
            location.pathname.split("/").includes(option.link2);
    };

    return (
      <div className="md:pl-[72px] w-full min-h-[calc(100vh-52px)] md:min-h-[calc(100vh-70px)] bg-gradient-to-br from-gray-50 to-white">
        <div className="flex w-full h-full">
          {/* Sidebar - Fixed Position */}
          {(window.innerWidth > 768 || location.pathname == "/catalogue") && (
            <div className="w-full md:w-64 lg:w-72 shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto fixed md:relative">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-900">Spa Catalogue</h2>
                <p className="text-sm text-gray-600 mt-1">Manage Dashboard</p>
              </div>

              {/* Navigation Sections */}
              <div className="p-4 space-y-8">
                {/* Service List */}
                <div>
                  <div className="mb-3 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Service Management</h3>
                  </div>
                  <div className="space-y-1">
                    {sidebarOptionsServices.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/catalogue/${option.link}`)}
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

                {/* Offers */}
                <div>
                  <div className="mb-3 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Offers & Promotions</h3>
                  </div>
                  <div className="space-y-1">
                    {sidebarOptionsOffers.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/catalogue/${option.link}`)}
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

                {/* Memberships */}
                <div>
                  <div className="mb-3 pb-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Membership Management</h3>
                  </div>
                  <div className="space-y-1">
                    {sidebarOptionsMemberships.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/catalogue/${option.link}`)}
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
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 mt-auto">
                <div className="text-xs text-gray-500 text-center">
                  <p>Catalogue Version 2.1</p>
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
                  {sidebarOptionsServices.find(opt => isActive(opt))?.name ||
                  sidebarOptionsOffers.find(opt => isActive(opt))?.name ||
                  sidebarOptionsMemberships.find(opt => isActive(opt))?.name ||
                  "Spa Catalogue Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your spa services, offers, and memberships
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

  export default Catalogue;