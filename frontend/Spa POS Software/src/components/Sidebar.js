import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Home from "../assets/Home Vector.png";
import Logo from "../assets/icons8-list-30.png";
import Appointment from "../assets/Appointment.png";
import Settings from "../assets/Settings Vector.png";
import Menu from "../assets/Menu.png";
import Clients from "../assets/Client Vector.png";
import Staff from "../assets/Staff Vector.png";
import ProductManager from "../assets/Product Management.png";
import "./Sidebarpos.css";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    padding: "10px 15px",
    fontSize: "14px",
  },
}));

function Sidebar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith('/'+location.pathname.split('/')[1])) {
      setActiveLink('/'+location.pathname.split('/')[1]);
    }
  }, [location]);

  return (
      <div className="sidebarpos pt-[10px]">
        {/* <BootstrapTooltip title="Home" placement="right" arrow>
          <Link to="/">
            <li className={(activeLink === "/" || activeLink === "/dashboard" ) ? "activeLink" : ""}>
              <img src={Home} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip> */}
        <BootstrapTooltip title="Home" placement="right" arrow>
          <Link to="/">
            <li className={activeLink === "/" ? "activeLink" : ""}>
              <img src={Home} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip>
        {/* <BootstrapTooltip title="Home" placement="right" arrow>
          <Link to="/CalendarMain">
            <li className={activeLink === "/CalendarMain" ? "activeLink" : ""}>
              <img src={Home} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip> */}
      
        <BootstrapTooltip title="Appointment" placement="right" arrow>
          <Link to="/appointment/list-appointment/calender">
            <li className={activeLink === "/appointment" ? "activeLink" : ""}>
              <img src={Appointment} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip>
        {/* <BootstrapTooltip title="Inventory" placement="right" arrow>
          <Link to="/sales">
            <li className={activeLink === "/sales" ? "activeLink" : ""}>
              <img src={ProductManager} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip> */}
        <BootstrapTooltip title="Clients" placement="right" arrow>
          <Link to="/clients">
            <li className={activeLink === "/clients" ? "activeLink" : ""}>
              <img
                src={Clients}
                alt=""
                className="IMGiconSideBar"
                style={{ width: "30px" }}
              />
            </li>
          </Link>
        </BootstrapTooltip>
        <BootstrapTooltip title="Menu" placement="right" arrow>
          <Link to="/catalogue/massages">
            <li className={activeLink === "/catalogue" ? "activeLink" : ""}>
              <img src={Menu} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip>
        <BootstrapTooltip title="Staff" placement="right" arrow>
          <Link to="/staffmanagement/staffrecord">
            <li className={activeLink === "/staffmanagement" ? "activeLink" : ""}>
              <img
                src={Staff}
                alt=""
                className="IMGiconSideBar"
                style={{ width: "30px" }}
              />
            </li>
          </Link>
        </BootstrapTooltip>
        <BootstrapTooltip title="Daily expenses" placement="right" arrow>
          <Link to="/daily-expense">
            <li className={activeLink === "/daily-expense" ? "activeLink" : ""}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-cash-stack"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
              </svg>
            </li>
          </Link>
        </BootstrapTooltip>

        <BootstrapTooltip title="Profile" placement="right" arrow>
          <Link to="/ProfilePreview">
            <li className={activeLink === "/ProfilePreview" ? "activeLink" : ""}>
              <img src={Logo} alt="" className="IMGiconSideBar" />
            </li>
          </Link>
        </BootstrapTooltip>

        <BootstrapTooltip title="Settings" placement="right" arrow>
          <Link to="/settings/manager">
            <li
              style={{ marginBottom: "20px" }}
              className={activeLink === "/settings" ? "activeLink" : ""}
            >
              <img src={Settings} alt=""  className="IMGiconSideBar"/>
            </li>
          </Link>
        </BootstrapTooltip>
      </div>
  );
}

export default Sidebar;
