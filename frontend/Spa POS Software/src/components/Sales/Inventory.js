import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const Inventory = () => {
  
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // If the current path is '/inventory', redirect to 'Available-products' by default
    if (location.pathname === '/sales') {
      navigate('Available-products');
    }
  }, [location.pathname, navigate]);

  const sidebarOptionsServices = [
    {
      name: "Product Menu",
      link: "Available-products",
    },
    {
      name: "Sales Inventory",
      link: "Inventory-Sales",
    },
    {
      name: "Use Inventory",
      link: "Inventory-Use",
    },
    {
      name: "In use Product",
      link: "In-Inventory-Use",
    },
    {
      name: "Product Order",
      link: "stock-order",
    },
    {
      name: "Distributor",
      link: "supplier",
    },
    {
      name: "Sell Products",
      link: "sell-product",
    },
  ];

  console.log(location.pathname.split("/"));
  return (
    <>
         <div className=" md:pl-[72px] w-full h-[calc(100vh-52px)] md:h-[calc(100vh-70px)]">
      <div className=" flex overflow-hidden w-full h-full gap-2">
        {(window.innerWidth > 768 || location.pathname == "/sales") && (
          <div className=" overflow-auto w-full md:w-52 shrink-0 h-full min-h-full bg-white p-3 custom-scrollbar">
            <div className="pb-3 w-full flex flex-col gap-[6px]">
              <h2 className=" text-lg font-semibold">Product Management</h2>
              <div className=" flex flex-col gap-1">
                {sidebarOptionsServices.map((option) => (
                  <div
                    className={` cursor-pointer rounded-md py-2 px-2 ${
                      location.pathname.split("/").includes(option.link)
                        ? "bg-[#EFECFF]"
                        : "bg-transparent hover:bg-gray-100"
                    }`}
                    onClick={() => navigate(`/sales/${option.link}`)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {window.innerWidth > 768 ? (
          <div className=" w-full shrink gorw min-h-full">
            <div className=" w-full h-full bg-white">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>

    </>
  );
};

export default Inventory;
