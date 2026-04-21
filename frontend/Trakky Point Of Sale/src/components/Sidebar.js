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

// Menu config: path, title, icon, accessKey (must match backend `access` array)
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
    title: "Beauty product",
    icon: ProductManager,
    accessKey: "Inventory",
  },
  {
    path: "/client-directory",
    title: "Clients",
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
    path: "/customer-loyalty",
    title: "Customer Menu",
    accessKey: "CustomerLoyalty",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-award"
        viewBox="0 0 16 16"
      >
        <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z" />
        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.099.106L8 13.579 6.099 11.9 4 11.894zM8 8.695c.533.023 1.06.048 1.564.088l.074.003.274.115a1.5 1.5 0 0 1 .37.3l.007.004.007.004a.5.5 0 0 0 .23.096l.004.001.004.001.009.001.001.001.001.001c.245.049.48.102.704.174l.004.001.006.001.008.001.006.002.007.001.007.002a1.5 1.5 0 0 0 .37.3l.274.115.074.003A3.5 3.5 0 0 1 8 8.695z" />
      </svg>
    ),
  },
  // === NEW MENU ITEM ADDED: Increase Customer Loyalty ===
  {
    path: "/loyalty/dashboard",
    title: "Customer Loyalty",
    accessKey: "CustomerLoyalty",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        <path d="M17 7h-3v3h-3v2h3v3h2v-3h3V10h-3V7z" fill="currentColor" />
      </svg>
    ),
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
    path: "/account-manager/main-dahbaord",
    title: "Financial Trackings",
    accessKey: "FinancialTracking",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 16 16"
        fill="white"
        aria-label="Calculator"
      >
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm0 1h12v4H2V2zm2 6h2v2H4V8zm0 3h2v2H4v-2zm3-3h2v2H7V8zm0 3h2v2H7v-2zm3-3h2v5h-2V8z" />
      </svg>
    ),
  },
  {
    path: "/ProfilePreview",
    title: "Trakky Profile",
    accessKey: "Profile",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        className="bi bi-person-circle"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
    ),
  },
  {
    path: "/customer-segment",
    title: "Types Of Customer",
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
    title: "All Reports",
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

function Sidebar() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [allowedMenus, setAllowedMenus] = useState([]);

  useEffect(() => {
    const path = location.pathname;
    const basePath = "/" + path.split("/")[1];
    setActiveLink(basePath);
  }, [location]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const userToken = localStorage.getItem("salonVendorAuthToken");
      // If no token → show all
      if (!userToken) {
        setAllowedMenus(MENU_ITEMS.map((m) => m.accessKey || m.title));
        return;
      }
      let tokenData, accessToken;
      try {
        tokenData = JSON.parse(userToken);
        accessToken = tokenData.access_token;
      } catch (err) {
        console.error("Invalid token JSON");
        setAllowedMenus(MENU_ITEMS.map((m) => m.accessKey || m.title));
        return;
      }
      if (!accessToken) {
        setAllowedMenus(MENU_ITEMS.map((m) => m.accessKey || m.title));
        return;
      }
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/custom-user-permissions-pos/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) throw new Error("Permission API failed");
        const permissions = await response.json();

        const userType = tokenData.user_type;
        const managerId = tokenData.manager_id;
        const staffId = tokenData.staff_id;

        let userPermission = null;
        if (userType === "Manager" && managerId != null) {
          userPermission = permissions.find(
            (p) => p.role_type === "manager" && p.manager == managerId,
          );
        } else if (userType === "Staff" && staffId != null) {
          userPermission = permissions.find(
            (p) => p.role_type === "staff" && p.staff == staffId,
          );
        }

        const accessList =
          userPermission?.access ||
          MENU_ITEMS.map((m) => m.accessKey || m.title);

        setAllowedMenus(accessList);
      } catch (error) {
        console.error("Permission fetch failed:", error);
        setAllowedMenus(MENU_ITEMS.map((m) => m.accessKey || m.title));
      }
    };

    fetchPermissions();
  }, []);

  const getBasePath = (path) => "/" + path.split("/")[1];

  return (
    <div className="sidebarpos pt-[10px] z-50">
      {MENU_ITEMS.map((item) => {
        const accessKey = item.accessKey || item.title;
        if (!allowedMenus.includes(accessKey)) return null;

        const basePath = getBasePath(item.path);
        const isActive = activeLink === basePath;

        return (
          <BootstrapTooltip
            key={item.path}
            title={item.title}
            placement="right"
            arrow
          >
            <Link to={item.path}>
              <li className={isActive ? "activeLink" : ""}>
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="IMGiconSideBar"
                    style={item.imgStyle || {}}
                  />
                ) : (
                  item.svg
                )}
              </li>
            </Link>
          </BootstrapTooltip>
        );
      })}
    </div>
  );
}

export default Sidebar;
