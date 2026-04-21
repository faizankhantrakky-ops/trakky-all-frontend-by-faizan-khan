import React, { useState, useEffect, useContext } from "react";
import "./Navbarpos.css";
import logo from "../assets/Trakky logo purple.png";
import RocketIcon from "@mui/icons-material/RocketOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/Close";
import Notification from "./Notfication/Notification";
import News from "./News/News";
import Sidebar from "./Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "../assets/Home Vector.png";
import Appointment from "../assets/Appointment.png";
import Settings from "../assets/Settings Vector.png";
import Menu from "../assets/Menu.png";
import SalonProfile from "../assets/Salon Profile Vector.png";
import Clients from "../assets/Client Vector.png";
import Staff from "../assets/Staff Vector.png";
import ProductManager from "../assets/Product Management.png";
import { Link } from "react-router-dom";
import AuthContext from "../Context/Auth";
import Popover from "@mui/material/Popover";
import whiteLogo from "../assets/trakky LOGO white.png";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Drawer from "@mui/material/Drawer";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CheckLineIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserIcon } from "lucide-react";
const MENU_ITEMS = [
  { path: "/", title: "Home", icon: Home, accessKey: "DashaBoard" },
  {
    path: "/appointment/list-appointment/calender",
    title: "Appointment",
    icon: Appointment,
    accessKey: "Appointment",
  },
  {
    path: "/sales",
    title: "Beauty products",
    icon: ProductManager,
    accessKey: "Inventory",
  },
  {
    path: "/client-directory",
    title: "Customer Management",
    icon: Clients,
    accessKey: "Clients",
    imgStyle: { width: "30px" },
  },
  {
    path: "/catalogue/services",
    title: "Salon Menu",
    icon: Menu,
    accessKey: "Menu",
  },
  {
    path: "/staffmanagement/stafftable",
    title: "Staff",
    icon: Staff,
    accessKey: "Staff",
    imgStyle: { width: "30px" },
  },
  {
    path: "/daily-expense-list",
    title: "Daily expenses",
    accessKey: "DailyExpenses",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-cash-stack"
        viewBox="0 0 16 16"
      >
        <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
        <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    path: "/ProfilePreview",
    title: "Trakky profile",
    icon: UserIcon,
    accessKey: "Profile",
  },
  {
    path: "/customer-segment",
    title: "Types Of  Customers",
    accessKey: "CustomerSegment",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-people"
        viewBox="0 0 16 16"
      >
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 1-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    ),
  },
  {
    path: "/user-permissions",
    title: "Login & Role Management",
    accessKey: "Permissions",
    svg: (
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4.5 8-11.8V6l-8-4-8 4v4.2C4 17.5 12 22 12 22z" />
          <rect x="9" y="12" width="6" height="6" rx="1" />
          <path d="M10.8 12V9a1.2 1.2 0 1 1 2.4 0v3" />
          <circle cx="12" cy="15" r="0.8" fill="white" />
        </svg>
      </div>
    ),
  },
  {
    path: "/settings/manager",
    title: "Settings",
    icon: Settings,
    accessKey: "Settings",
  },
  {
    path: "/daily-business-report",
    title: "All Report",
    accessKey: "Reports",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-file-earmark-text"
        viewBox="0 0 16 16"
      >
        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
      </svg>
    ),
  },

  {
    path: "/sticky-notes",
    title: "Notes Manager",
    accessKey: "Notes",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-journal-text"
        viewBox="0 0 16 16"
      >
        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1h1V2a2 2 0 0 1 2-2z" />
        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
      </svg>
    ),
  },
];

function NavbarPos() {
  const { user, vendorData, logoutUser, authTokens } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open2, setOpen2] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [vendorLogo, setVendorLogo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Fetch vendor logo from API
  useEffect(() => {
    const fetchVendorLogo = async () => {
      if (!vendorData?.id) return;

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/vendor-pos/${vendorData.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.logo) {
            setVendorLogo(data.logo);
          }
        }
      } catch (error) {
        console.error("Error fetching vendor logo:", error);
      }
    };

    fetchVendorLogo();
  }, [vendorData?.id, authTokens]);

  const toggleDrawer4 = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    console.log(user, "user");
  }, [user]);

  useEffect(() => {
    const active = localStorage.getItem("activeLink");
    setActiveLink(active);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);

  const toggleDrawer2 = (newOpen) => () => {
    setOpen2(newOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [open1, setOpen1] = useState(false);
  const toggleDrawer1 = (newOpen) => () => {
    setOpen1(newOpen);
  };

  const handleLinkClick = (link) => {
    if (windowWidth < 769) {
      setActiveLink(link);
      toggleDrawer2(false)();
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      {windowWidth < 769 ? (
        <div className="w-full flex">
          <div className="flex justify-between w-full items-center p-[10px] border-b-2 border-[#7e7e7e4f]  font-poppins">
            <button onClick={toggleDrawer2(true)}>
              <MenuIcon />
            </button>
            <p className="text-[20px] text-center ml-4">
              {vendorData?.salon_name}
            </p>

            <div className="flex items-center">
              <NotificationsIcon
                onClick={() => {
                  toggleDrawer4(true)();
                }}
                style={{ width: "1.5em", height: "1.2em", marginRight: "8px" }}
              />
              <AccountCircleRoundedIcon
                onClick={handlePopoverOpen}
                style={{ width: "1.5em", height: "1.2em" }}
              />
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div className="p-4 min-w-[250px]">
                  {" "}
                  {/* Added min-width for better layout */}
                  {/* New Customer Care Section */}
                  <div className="mb-6 text-sm border-b border-gray-200 pb-4">
                    <p className="font-semibold text-gray-700 mb-2">
                      Customer Care
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600">Phone:</span>
                      <a
                        href="tel:+916355167304"
                        className="text-indigo-600 hover:underline"
                      >
                        +91 6355167304
                      </a>
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600">Email:</span>
                      <a
                        href="mailto:customercare@trakky.in"
                        className="text-indigo-600 hover:underline"
                      >
                        customercare@trakky.in
                      </a>
                    </p>
                  </div>
                  {/* Existing Logout Option */}
                  <div
                    className="flex gap-[5px] cursor-pointer items-center hover:text-red-600 transition-colors"
                    onClick={logoutUser}
                  >
                    <p>Log out</p>
                    <span>
                      <LogoutIcon />
                    </span>
                  </div>
                </div>
              </Popover>
            </div>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer4(false)}
              sx={{
                overflowY: "visible !important",
              }}
              className="font-poppins"
            >
              <Notification toggleDrawer4={toggleDrawer4} />
              <button
                onClick={toggleDrawer4(false)}
                style={{
                  position: "absolute",
                  left: "-60px",
                  top: "15px",
                  zIndex: 10000,
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: "8px",
                  transition: "right 0.4s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <CloseIcon />
              </button>
            </Drawer>

            <Drawer
              open={open2}
              onClose={toggleDrawer2(false)}
              className="Drawer_NavbarmobilePOS"
            >
              <div className="flex flex-col px-[20px] gap-[40px] pt-[20px]">
                <span className="flex items-center w-full justify-between">
                  <span>
                    <img src={whiteLogo} className="h-auto w-[120px]" alt="" />
                  </span>
                  <span onClick={toggleDrawer2(false)}>
                    <CloseIcon />
                  </span>
                </span>

                <div className="flex flex-col mobileSidebarLinkContainer">
                  {MENU_ITEMS.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      location.pathname.startsWith(item.path + "/") ||
                      (item.path.includes("appointment") &&
                        location.pathname.includes("appointment"));

                    const IconComponent = item.icon;
                    const hasSvg = !!item.svg;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          navigate(item.path);
                          toggleDrawer2(false)();
                        }}
                        className={`flex items-center gap-[20px] py-[10px] px-[10px] transition-all duration-200 font-medium
                          ${
                            isActive
                              ? "bg-[#502DA6] text-white shadow-xl rounded-md"
                              : "text-gray-100"
                          }`}
                      >
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          {hasSvg ? (
                            item.svg
                          ) : typeof IconComponent === "string" ? (
                            <img
                              src={IconComponent}
                              alt={item.title}
                              style={
                                item.imgStyle || {
                                  width: "24px",
                                  height: "24px",
                                }
                              }
                              className={isActive ? "filter invert" : ""}
                            />
                          ) : IconComponent ? (
                            <IconComponent
                              style={{ fontSize: 24 }}
                              className="text-white"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded"></div>
                          )}
                        </span>
                        <p>{item.title}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      ) : (
        <>
          <div className="navbarpos !fixed font-poppins">
            <div className="logo cursor-pointer">
              <Link to={"/"}>
                <img
                  src={vendorLogo || logo}
                  alt="logo"
                  className="logotrakkypos"
                  onError={(e) => {
                    e.target.src = logo;
                  }}
                />
              </Link>
            </div>
            <div className="salonNamepos text-center">
              <h1 className="font-semibold text-[24px]">
                {vendorData?.salon_name}
              </h1>
            </div>
            <div className="optionspos">
              <div className="optionsinsidepos">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    alignItems: "center",
                  }}
                >
                  <NotificationsIcon
                    onClick={() => {
                      toggleDrawer4(true)();
                    }}
                  />
                  <AccountCircleRoundedIcon onClick={handlePopoverOpen} />
                  <Popover
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    style={{
                      marginTop: "25px",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <div className="p-4 min-w-[260px]">
                      {/* Customer Care Section */}
                      <div className="mb-5 pb-4 border-b border-gray-200 text-sm">
                        <p className="font-semibold text-gray-800 mb-3">
                          Customer Care
                        </p>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-600">Phone:</span>
                            <a
                              href="tel:+916355167304"
                              className="text-indigo-600 hover:underline font-medium"
                            >
                              +91 6355167304
                            </a>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-600">Email:</span>
                            <a
                              href="mailto:customercare@trakky.in"
                              className="text-indigo-600 hover:underline font-medium"
                            >
                              customercare@trakky.in
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Logout Option */}
                      <div
                        className="flex gap-[8px] cursor-pointer items-center py-2 px-3 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={logoutUser}
                      >
                        <span>
                          <LogoutIcon />
                        </span>
                        <p>Log out</p>
                      </div>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex font-poppins">
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer4(false)}
              sx={{
                overflowY: "visible !important",
              }}
              className="font-poppins"
            >
              <Notification toggleDrawer4={toggleDrawer4} />
              <button
                onClick={toggleDrawer4(false)}
                style={{
                  position: "absolute",
                  left: "-60px",
                  top: "15px",
                  zIndex: 10000,
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: "8px",
                  transition: "right 0.4s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <CloseIcon />
              </button>
            </Drawer>
          </div>
          <div className="h-[70px] w-full" />
        </>
      )}
    </>
  );
}

export default NavbarPos;
