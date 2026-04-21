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
// import SpaProfile from "../assets/Spa Profile Vector.png";
import Clients from "../assets/Client Vector.png";
import Staff from "../assets/Staff Vector.png";
import ProductManager from "../assets/Product Management.png";
import { Link } from "react-router-dom";
import AuthContext from "../Context/Auth";
import Popover from "@mui/material/Popover";
import whiteLogo from "../assets/trakky LOGO white.png";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Drawer from '@mui/material/Drawer';

function NavbarPos() {
  const { user, vendorData, logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open2, setOpen2] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

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
      toggleDrawer2(false)(); // Close the drawer after a link is clicked
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
          <div className="flex justify-between w-full items-center p-[10px] border-b-2 border-[#7e7e7e4f]">
            <button onClick={toggleDrawer2(true)}>
              <MenuIcon />
            </button>

            <p className="text-[20px]">{vendorData?.spa_name}</p>

            <span>
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
                <div className="p-4">
                  <span
                    className="flex gap-[5px] cursor-pointer items-center"
                    onClick={logoutUser}
                  >
                    {" "}
                    <p>Log out</p>{" "}
                    <span>
                      <LogoutIcon />
                    </span>{" "}
                  </span>
                </div>
              </Popover>
            </span>

            <Drawer
              open={open2}
              onClose={toggleDrawer2(false)}
              className="Drawer_NavbarmobilePOS"
            >
              <div className="flex flex-col px-[20px] gap-[40px] pt-[20px] ">
                <span className="flex items-center w-full justify-between">
                  <span>
                    <img src={whiteLogo} className="h-auto w-[120px]" alt="" />
                  </span>
                  <span onClick={toggleDrawer2(false)}>
                    <CloseIcon />
                  </span>
                </span>

                <div className="flex flex-col  mobileSidebarLinkContainer">
                  <Link
                    to="/dashboard1"
                    onClick={() => handleLinkClick("/dashboard1")}
                    className={activeLink === "/dashboard1" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Home} alt="" />
                      <p>Dashboard</p>
                    </span>
                  </Link>
                  <Link
                    to="/home"
                    onClick={() => handleLinkClick("/home")}
                    className={activeLink === "/home" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Home} alt="" />
                      <p>Home</p>
                    </span>
                  </Link>
                  <Link
                    to="/CalendarMain"
                    onClick={() => handleLinkClick("/CalendarMain")}
                    className={activeLink === "/CalendarMain" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Home} alt="" />
                      <p>Calendar</p>
                    </span>
                  </Link>
                  
                  <Link
                    to="/calendar"
                    onClick={() => handleLinkClick("/calendar")}
                    className={activeLink === "/calendar" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img
                        className="w-[20px] h-auto"
                        src={Appointment}
                        alt=""
                      />
                      <p>Appointment</p>
                    </span>
                  </Link>
                  <Link
                    to="/Salesmob"
                    onClick={() => handleLinkClick("/Salesmob")}
                    className={activeLink === "/Salesmob" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img
                        className="w-[20px] h-auto"
                        src={ProductManager}
                        alt=""
                      />
                      <p>Inventory</p>
                    </span>
                  </Link>
                  <Link
                    to="/clients"
                    onClick={() => handleLinkClick("/clients")}
                    className={activeLink === "/clients" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Clients} alt="" />
                      <p>Clients</p>
                    </span>
                  </Link>
                  <Link
                    to="/catalogue"
                    onClick={() => handleLinkClick("/catalogue")}
                    className={activeLink === "/catalogue" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Menu} alt="" />
                      <p>Menu</p>
                    </span>
                  </Link>
                  <Link
                    to="/team/register-staff"
                    onClick={() => handleLinkClick("/team/register-staff")}
                    className={
                      activeLink === "/team/register-staff" ? "activeLink" : ""
                    }
                  >
                    <span className="flex items-center gap-[20px] p-[10px]">
                      <img className="w-[20px] h-auto" src={Staff} alt="" />
                      <p>Staff</p>
                    </span>
                  </Link>
                  <Link
                    to="/DailyExpense"
                    onClick={() => handleLinkClick("/DailyExpense")}
                    className={
                      activeLink === "/DailyExpense" ? "activeLink" : ""
                    }
                  >
                    <span className="flex items-center gap-[20px] p-[10px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-cash-stack"
                        viewBox="0 0 16 16"
                      >
                        <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                        <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
                      </svg>
                      <p>Daily expense</p>
                    </span>
                  </Link>
                  <Link
                    to="/settings/manager"
                    onClick={() => handleLinkClick("/settings")}
                    className={activeLink === "/settings" ? "activeLink" : ""}
                  >
                    <span className="flex items-center gap-[20px] py-[10px] px-[10px]">
                      <img className="w-[20px] h-auto" src={Settings} alt="" />
                      <p>Settings</p>
                    </span>
                  </Link>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      ) : (
        <>
          <div className="navbarpos !fixed">
            <div className="logo">
              <img src={logo} alt="logo" className="logotrakkypos" />
            </div>
            <div className="spaNamepos">
              <h1 className="font-semibold text-[24px]">
                {vendorData?.spa_name}
              </h1>
            </div>
            <div className="optionspos">
              <div className="optionsinsidepos">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
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
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <div className="p-4">
                      <span
                        className="flex gap-[5px] cursor-pointer items-center"
                        onClick={logoutUser}
                      >
                        {" "}
                        <p>Log out</p>
                        <span>
                          <LogoutIcon />
                        </span>
                      </span>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex">
            {/* Close Icon positioned outside of the Drawer */}
            {/* {drawerOpen && (
              <button
                onClick={toggleDrawer4(false)}
                style={{
                  position: 'absolute',
                  right: drawerOpen ? '47%' : '-60px', // Adjusted based on drawer width
                  top: '15px',
                  zIndex: 10000, // Ensure the button is above the drawer
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  padding: '8px',
                  transition: 'right 0.4s ease', // Smooth transition when drawer opens
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Optional: subtle shadow for better visibility
                }}
              >
                <CloseIcon />
              </button>
            )} */}

            {/* Notification Drawer */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer4(false)}
              sx={{
                overflowY: 'visible !important',
              }}
            >
              <Notification toggleDrawer4={toggleDrawer4} />
              <button
                onClick={toggleDrawer4(false)}
                style={{
                  position: 'absolute',
                  left: '-60px', // Adjusted based on drawer width
                  top: '15px',
                  zIndex: 10000, // Ensure the button is above the drawer
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  padding: '8px',
                  transition: 'right 0.4s ease', // Smooth transition when drawer opens
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Optional: subtle shadow for better visibility
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
