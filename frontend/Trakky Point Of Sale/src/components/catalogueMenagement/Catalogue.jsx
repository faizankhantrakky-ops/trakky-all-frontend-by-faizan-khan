import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Package, 
  Star, 
  FolderOpen,
  Send,
  Layers
} from "lucide-react";

const Catalogue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpenNew] = useState(false);

  // Auto redirect on desktop if only /catalogue
  useEffect(() => {
    if (window.innerWidth > 500 && location.pathname === "/catalogue") {
      navigate("/catalogue/services");
    }
  }, [navigate, location.pathname]);  

  // Extract current active route
  const currentPath = location.pathname.split("/").pop();

  const sidebarOptionsServices = [
    { name: "Categories", link: "categories", icon: FolderOpen },
    { name: "Category Request", link: "category-request", icon: Send },
    { name: "Grooming Packages", link: "packages", icon: Layers },
    { name: "Grooming Packages Request", link: "packages-request-from-vendor", icon: Send },
    { name: "Service Requests", link: "service-request", icon: Send },
     { name: "Services", link: "services", icon: Package },
   
  ];

  const sidebarOptionsOffers = [
    { name: "Salon Profile Offers", link: "offers", icon: Star },
    { name: "Salon Profile Offers Request", link: "offers-Request", icon: Send },
  ];

  // Helper: Check if current route matches exactly
  const isActiveCheck = (link, link2) => {
    return currentPath === link || (link2 && currentPath === link2);
  };

  return (
    <>
      <div className="md:pl-[72px] w-full h-[calc(100vh-52px)] md:h-[calc(100vh-70px)] bg-gray-50">
        <div className="flex w-full h-full">

          {/* Mobile: Menu Button */}
          <div className="md:hidden fixed top-16 left-4 z-50">
            <button
              onClick={() => setMobileMenuOpenNew(!mobileMenuOpen)}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
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
              w-80 bg-white border-r border-gray-200
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              md:w-64
              overflow-y-auto
            `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
               
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Catalogue</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Services Management</p>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="p-4 space-y-6">

              {/* Service List Section */}
              <div>
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 px-2">
                    Services Management
                  </h3>
                <div className="space-y-1">
                  {sidebarOptionsServices.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/catalogue/${option.link}`);
                          setMobileMenuOpenNew(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200
                          ${isActiveCheck(option.link)
                            ? "bg-[#492DBD] text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isActiveCheck(option.link) ? "text-white" : "text-gray-600"
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Offers Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Promotion
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsOffers.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/catalogue/${option.link}`);
                          setMobileMenuOpenNew(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200
                          ${isActiveCheck(option.link)
                            ? "bg-[#492DBD] text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`w-4 h-4 mr-3 ${
                            isActiveCheck(option.link) ? "text-white" : "text-gray-500"
                          }`} />
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isActiveCheck(option.link) ? "text-white" : "text-gray-600"
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white mt-8">
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Salon Management Portal
                </p>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setMobileMenuOpenNew(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 w-full h-full overflow-auto bg-white">
            <div className="h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalogue;