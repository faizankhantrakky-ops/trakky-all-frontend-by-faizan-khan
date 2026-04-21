import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Truck,          // for suppliers
  Package,        // products/menu
  ShoppingCart,   // orders
  Archive,        // sales inventory
  Scissors,       // use inventory (grooming context)
  Box,            // in-use products
  IndianRupee      // sell products
} from "lucide-react";

const Inventory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto redirect to first tab on desktop when only /sales
  useEffect(() => {
    if (window.innerWidth > 500 && location.pathname === "/sales") {
      navigate("/sales/Available-products");
    }
  }, [navigate, location.pathname]);

  // Get current sub-path
  const currentPath = location.pathname.split("/").pop();

  // Helper: exact match for active state
  const isActive = (link) => currentPath === link;

  const sidebarOptionsSuppliers = [
    { name: "Distributor Details", link: "supplier", icon: Truck },
  ];

  const sidebarOptionsStock = [
    { name: "Distributor's Menu", link: "Available-products", icon: Package },
    { name: "Product Order", link: "stock-order", icon: ShoppingCart },
  ];

  const sidebarOptionsTracking = [
    { name: "Sales Inventory", link: "Inventory-Sales", icon: Archive },
    { name: "Use Inventory", link: "Inventory-Use", icon: Scissors },
    { name: "In Use Product", link: "In-Inventory-Use", icon: Box },
    { name: "Sell Products", link: "selling-product", icon: IndianRupee },
  ];

  return (
    <>
      <div className="w-full h-[calc(100vh-52px)] md:h-[calc(100vh-70px)] bg-gray-50 md:pl-[72px] w-full">
        <div className="flex w-full h-full">

          {/* Mobile: Menu Button - Adjusted position */}
          <div className="md:hidden fixed top-16 left-4 z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Sidebar - Made responsive width */}
          <div
            className={`
              fixed md:relative inset-y-0 left-0 z-40
              w-[280px] sm:w-80 bg-white border-r border-gray-200
              transform transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              md:w-64
              overflow-y-auto
            `}
          >
            {/* Header - unchanged */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Product & Stock Management's</p>
                </div>
              </div>
            </div>

            {/* Navigation Sections - unchanged */}
            <div className="p-4 space-y-6">

              {/* Suppliers Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Product Suppliers
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsSuppliers.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/sales/${option.link}`);
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
                          <Icon className={`w-4 h-4 mr-3 ${
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

              {/* Stock Management Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Stock Management's
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsStock.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/sales/${option.link}`);
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
                          <Icon className={`w-4 h-4 mr-3 ${
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

              {/* Inventory Tracking Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-3 px-2">
                  Inventory Tracking
                </h3>
                <div className="space-y-1">
                  {sidebarOptionsTracking.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.link}
                        onClick={() => {
                          navigate(`/sales/${option.link}`);
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
                          <Icon className={`w-4 h-4 mr-3 ${
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

            {/* Footer - unchanged */}
            <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white mt-8">
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Salon Inventory System
                </p>
              </div>
            </div>
          </div>

          {/* Overlay for mobile - unchanged */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Main Content - Added responsive padding for mobile */}
          <div className="flex-1 w-full h-full overflow-auto bg-white">
            <div className="h-full">
              {/* Added small top padding for mobile to account for menu button */}
              <div className="md:hidden h-0"></div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      {/* Added minimal responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .w-80 {
            width: 280px;
          }
        }
      `}</style>
    </>
  );
};

export default Inventory;