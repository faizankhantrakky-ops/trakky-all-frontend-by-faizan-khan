import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Shield,
  Users, 
  FileText,
  CreditCard, 
  Gift
} from "lucide-react";

const Customerloyalty_Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setMobileMenuOpen] = useState(false);

  // Auto redirect on desktop if only /customer-loyalty
  useEffect(() => {
    if (window.innerWidth > 500 && location.pathname === "/customer-loyalty") {
      navigate("/customer-loyalty/type-membership");
    }
  }, [navigate, location.pathname]);

  // Extract current active route
  const currentPath = location.pathname.split("/").pop();

  const sidebarOptionsMemberships = [
    { name: "Membership Types", link: "type-membership", icon: Shield },
    { name: "Customer Memberships", link: "membership-customer", icon: Users },
    { name: "Create Memberships", link: "create-customer-membership", link2: "create-membership-type", icon: FileText },
  ];

  const sidebarOptionsWallet = [
    { name: "Purchase Wallet", link: "purchase-wallet-list", icon: CreditCard },
    { name: "Create Purchase", link: "add-purchase-wallet-list", icon: CreditCard },
  ];

  const sidebarOptionsGiftCard = [
    { name: "Gift Card", link: "gift-card", icon: Gift },
    { name: "Gift Card List", link: "gift-card-list", icon: Gift },
  ];

  // Helper: Check if current route matches exactly
  const isActive = (link, link2) => {
    return currentPath === link || (link2 && currentPath === link2);
  };

  return (
    <>
      <div className="md:pl-[72px] w-full h-[calc(100vh-52px)] md:h-[calc(100vh-70px)] bg-gray-100">
        <div className="flex w-full h-full">

          {/* Mobile: Menu Button */}
          <div className="md:hidden fixed top-16 left-4 z-40">
            <button
              onClick={() => setMobileMenuOpen(!isMobile)}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              {isMobile ? (
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
              ${isMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              md:w-64
              overflow-y-auto
            `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-300 bg-white">
              <div className="flex items-center space-x-3">
               
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Customer Loyalty</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Loyalty Management System</p>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="p-4 space-y-6">

              {/* Membership Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Memberships
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsMemberships.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/customer-loyalty/${option.link}`);
                          setMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200
                          ${isActive(option.link, option.link2)
                            ? "bg-[#492DBD] text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`w-4 h-4 mr-3 ${
                            isActive(option.link, option.link2) ? "text-white" : "text-gray-500"
                          }`} />
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isActive(option.link, option.link2) ? "text-white" : "text-gray-600"
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wallet Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Wallet
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsWallet.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={`wallet-${index}`}
                        onClick={() => {
                          navigate(`/customer-loyalty/${option.link}`);
                          setMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200
                          ${isActive(option.link)
                            ? "bg-[#492DBD] text-white shadow-sm"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`w-4 h-4 mr-3 ${
                            isActive(option.link) ? "text-white" : "text-gray-500"
                          }`} />
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isActive(option.link) ? "text-white" : "text-gray-600"
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gift Card Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Gift Card
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsGiftCard.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={`giftcard-${index}`}
                        onClick={() => {
                          navigate(`/customer-loyalty/${option.link}`);
                          setMobileMenuOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-200
                          ${isActive(option.link)
                            ? "bg-[#492DBD] text-white shadow-sm"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <IconComponent className={`w-4 h-4 mr-3 ${
                            isActive(option.link) ? "text-white" : "text-gray-500"
                          }`} />
                          <span className="font-medium text-sm">{option.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isActive(option.link) ? "text-white" : "text-gray-600"
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
                  Loyalty Management System
                </p>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
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

export default Customerloyalty_Layout;