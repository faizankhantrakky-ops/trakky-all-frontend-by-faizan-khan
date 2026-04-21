import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import logo from "../trakky_logo.png";
import "./sidebar.css";

const New_Sidebar = (props) => {
  const [selected, setSelected] = useState(null);

  const [selecetedbtn, setSelectedbtn] = useState(1);

  const list = [
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
    },
    {
      type: "normal",
      title: "Customers",
      link: "/customers",
      number: 21,
    },
    {
      type: "normal",
      title: "Create User",
      link: "/createuser",
      number: 57,
    },
    {
      type: "normal",
      title: "Contact Us",
      link: "/usercontactus",
      number: 32,
    },
    {
      type: "dropdown",
      title: "Reviews",
      items: [
        {
          title: "User Reviews",
          link: "/userreviews",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 29,
        },
        {
          title: "Add User Reviews",
          link: "/adduserreviews",
          icon: <AddIcon fontSize="small" />,
          number: 29,
        },
        {
          title: "Spa Review Stats",
          icon: <FormatListBulletedIcon fontSize="small" />,
          link: "/spastats",
          number: 44,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Priority Management",
      items: [
        {
          title: "City and Area Priority",
          link: "/cityandareapriority",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 2,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Spas",
      items: [
        {
          title: "List Spas",
          link: "/listspas",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 2,
        },
        {
          title: "Add Spa",
          link: "/addspa",
          icon: <AddIcon fontSize="small" />,
          number: 3,
        },
        {
          title: "New Spa Requests",
          link: "/newsparequests",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 23,
        },
        {
          title: "Trusted Spas",
          link: "/trustedspas",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 53,
        },
        {
          title: "Add Trusted Spas",
          link: "/addtrustedspas",
          icon: <AddIcon fontSize="small" />,
          number: 54,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Spa Categories",
      items: [
        {
          title: "Best spa",
          link: "/list-best-spa",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 55,
        },
        {
          title: "Top rated spa",
          link: "/list-top-rated-spa",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 56,
        },
        {
          title: "Luxurious spa",
          link: "/list-luxurious-spa",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 58,
        },
        {
          title: "Body massage spa",
          link: "/list-body-massage-spa",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 59,
        },
        {
          title: "Body massage center",
          link: "/list-spa-body-massage-center",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 60,
        },
        {
          title: "Thai body massage",
          link: "/list-thai-body-massage",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 61,
        },
        {
          title: "Beauty spa",
          link: "/list-beauty-spa",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 62,
        },
        {
          title: "Spa for men",
          link: "/list-spa-for-men",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 63,
        },
        {
          title: "Spa for women",
          link: "/list-spa-for-women",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 64,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Trakky Promises",
      items: [
        {
          title: "List Promises",
          link: "/promises",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 33,
        },
        {
          title: "Add Promises",
          link: "/addpromises",
          icon: <AddIcon fontSize="small" />,
          number: 34,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Master",
      items: [
        {
          title: "Master Services",
          link: "/masterservices",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 35,
        },
        {
          title: "Add Master Services",
          link: "/addmasterservices",
          icon: <AddIcon fontSize="small" />,
          number: 36,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Therapies ( Not in use )",
      items: [
        {
          title: "List National Therapies",
          link: "/listnationaltherapies",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 30,
        },
        {
          title: "Add National Therapy",
          link: "/addnationaltherapy",
          icon: <AddIcon fontSize="small" />,
          number: 31,
        },
        {
          title: "List Therapies",
          link: "/listtherapies",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 4,
        },
        {
          title: "Add Therapy",
          link: "/addtherapy",
          icon: <AddIcon fontSize="small" />,
          number: 5,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Offers",
      items: [
        {
          title: "List National Offers",
          link: "/listnationaloffers",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 24,
        },
        {
          title: "Add National Offer",
          link: "/addnationaloffer",
          icon: <AddIcon fontSize="small" />,
          number: 25,
        },
        {
          title: "List Offers",
          link: "/listoffer",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 6,
        },
        {
          title: "Add Offer",
          link: "/addoffer",
          icon: <AddIcon fontSize="small" />,
          number: 7,
        },
      ],
    },
    {
      type: "dropdown",
      title: "City Page Offers",
      items: [
        {
          title: "City Page Offer 1",
          link: "/citypageoffer1",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 45,
        },
        {
          title: "Add City Page Offer 1",
          link: "/addcitypageoffer1",
          icon: <AddIcon fontSize="small" />,
          number: 46,
        },
        {
          title: "City Page Offer 2",
          link: "/citypageoffer2",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 47,
        },
        {
          title: "Add City Page Offer 2",
          link: "/addcitypageoffer2",
          icon: <AddIcon fontSize="small" />,
          number: 48,
        },
        {
          title: "City Page Offer 3",
          link: "/citypageoffer3",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 49,
        },
        {
          title: "Add City Page Offer 3",
          link: "/addcitypageoffer3",
          icon: <AddIcon fontSize="small" />,
          number: 50,
        },
      ],
    },
    {
      type: "dropdown",
      title: "National Page Offers",
      items: [
        {
          title: "National Page Offer",
          link: "/nationalpageoffer",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 51,
        },
        {
          title: "Add National Page Offer",
          link: "/addnationalpageoffer",
          icon: <AddIcon fontSize="small" />,
          number: 52,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Spa Profile Offers",
      items: [
        {
          title: "List Spa Profile Offers",
          link: "/listprofileoffers",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 42,
        },
        {
          title: "Add Spa Profile Offer",
          link: "/addprofileoffer",
          icon: <AddIcon fontSize="small" />,
          number: 43,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Services/Massages",
      items: [
        {
          title: "List Services",
          link: "/listservices",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 8,
        },
        {
          title: "Add Service",
          link: "/addservice",
          icon: <AddIcon fontSize="small" />,
          number: 9,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Memberships",
      items: [
        {
          title: "List Memberships",
          link: "/listmemberships",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 37,
        },
        {
          title: "Add Membership",
          link: "/addmembership",
          icon: <AddIcon fontSize="small" />,
          number: 38,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Bestseller Massages",
      items: [
        {
          title: "List Bestseller Massages",
          link: "/listbestsellermassages",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 39,
        },
        {
          title: "Add Best Seller Massages",
          link: "/addbestsellermassages",
          icon: <AddIcon fontSize="small" />,
          number: 40,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Cities",
      items: [
        {
          title: "List Cities",
          link: "/listcities",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 10,
        },
        {
          title: "Add City",
          link: "/addcity",
          icon: <AddIcon fontSize="small" />,
          number: 11,
        },
        {
          title: "List Areas",
          link: "/listareas",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 12,
        },
        {
          title: "Add Area",
          link: "/addarea",
          icon: <AddIcon fontSize="small" />,
          number: 13,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Daily Updates",
      items: [
        {
          title: "List Daily Updates",
          link: "/listdailyupdates",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 27,
        },
        {
          title: "Add Daily Updates",
          link: "/adddailyupdates",
          icon: <AddIcon fontSize="small" />,
          number: 28,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Spa pos",
      items: [
        {
          title: "Pos Massage Request",
          link: "/posmassagerequest",
          icon: <FormatListBulletedIcon fontSize="small" />,
        },
        {
          title: "Membership package request",
          link: "/membershippackagerequest",
          icon: <FormatListBulletedIcon fontSize="small" />,
        },
        {
          title: "Offer request",
          link: "/offerrequest",
          icon: <FormatListBulletedIcon fontSize="small" />,
        },
        {
          title: "Spa pos request",
          link: "/spaposrequest",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 14,
        },
      ],
    },

    {
      type: "dropdown",
      title: "Room Images",
      items: [
        {
          title: "List Room Images",
          link: "/listroomimages",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 21,
        },
        {
          title: "Add Room Images",
          link: "/addroomimages",
          icon: <AddIcon fontSize="small" />,
          number: 22,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Inquiries",
      items: [
        {
          title: "Inquiry",
          link: "/inquiry",
          icon: <InfoOutlinedIcon fontSize="small" />,
          number: 26,
        },
      ],
    },
    {
      type: "dropdown",
      title: "Vendors",
      items: [
        {
          title: "List Vendors",
          link: "/listvendors",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 19,
        },
        {
          title: "Add Vendor",
          link: "/addvendor",
          icon: <AddIcon fontSize="small" />,
          number: 20,
        },
      ],
    },
    {
      type: "normal",
      title: "Logs",
      link: "/logs",
      link2: "/",
      number: 1,
    },
    {
      type: "dropdown",
      title: "User Creation",
      items: [
        {
          title: "List Users",
          link: "/listadminuser",
          icon: <FormatListBulletedIcon fontSize="small" />,
          number: 68,
        },
        {
          title: "Add User",
          link: "/createadminuser",
          icon: <AddIcon fontSize="small" />,
          number: 69,
        },
      ],
    },
  ];

  const handleClose = () => {
    props.change_hamburger_state(!props.hamburger_state);
  };

  return (
    <>
      <div className="sidebar-container">
        {props.hamburger_state && (
          <div className="sidebar-close-btn" onClick={handleClose}>
            <KeyboardDoubleArrowLeftIcon />
          </div>
        )}
        <div className="sidebar-item">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </div>
        {list.map((item, index) => {
          if (item.type === "normal") {
            return (
              <SidebarItem
                number={item.number}
                link2={item.link2}
                selecetedbtn={selecetedbtn}
                setSelectedbtn={setSelectedbtn}
                title={item.title}
                link={item.link}
                key={index}
                handleClose={handleClose}
                hamburger_state={props.hamburger_state}
              />
            );
          } else {
            return (
              <SidebarDropdown
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                selecetedbtn={selecetedbtn}
                setSelectedbtn={setSelectedbtn}
                title={item.title}
                items={item.items}
                key={index}
                index={index}
                handleClose={handleClose}
                hamburger_state={props.hamburger_state}
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default New_Sidebar;

const SidebarItem = (props) => {
  const location = useLocation();

  const handleClick = () => {
    props.handleClose();
    props.setSelectedbtn(props.number);
  };

  return (
    <div
      className="sidebar-item"
      style={
        location.pathname === props.link || location.pathname === props.link2
          ? {
              backgroundColor: "rgb(141 201 255 / 36%)",
              borderRight: "5px solid rgb(0 0 255 / 70%)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      <Link
        to={props.link}
        className="link"
        onClick={
          props.hamburger_state
            ? handleClick
            : () => {
                props.setSelectedbtn(props.number);
              }
        }
      >
        <div className="single">{props.title}</div>
      </Link>
    </div>
  );
};

const SidebarDropdown = (props) => {
  const [showDescription, setShowDescription] = useState(false);

  const mountedStyle = { animation: "inAnimation 270ms ease-in" };

  const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards",
  };

  const handleClick = () => {
    if (props.selected === props.index) {
      props.setSelected(null);
      setShowDescription(false);
    } else {
      setShowDescription(true);
      props.setSelected(props.index);
    }
  };

  return (
    <div className="sidebar-item sidebar-dropdown">
      <div className="dropdown-title" onClick={handleClick}>
        <div className="dropdown-item-title">{props.title}</div>
        <div className="dropdown-icon">
          {props.selected === props.index ? (
            <KeyboardArrowUpIcon sx={{ color: "#474545" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: "#474545" }} />
          )}
        </div>
      </div>
      {props.selected === props.index && showDescription && (
        <div
          className="dropdown-description"
          style={
            props.selected === props.index && showDescription
              ? mountedStyle
              : unmountedStyle
          }
        >
          {props.items.map((item, key) => {
            return (
              <DropdownItem
                selecetedbtn={props.selecetedbtn}
                setSelectedbtn={props.setSelectedbtn}
                icon={item.icon}
                title={item.title}
                link={item.link}
                key={key}
                selected={props.selected}
                handleClose={props.handleClose}
                hamburger_state={props.hamburger_state}
                index={key}
                number={item.number}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DropdownItem = (props) => {
  const location = useLocation();

  const handleClick = () => {
    props.handleClose();
    props.setSelectedbtn(props.number);
  };

  return (
    <div
      className="dropdown-item"
      style={
        location.pathname === props.link
          ? {
              backgroundColor: "rgb(141 201 255 / 36%)",
              borderRight: "5px solid rgb(0 0 255 / 70%)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      <Link
        to={props.link}
        className="link"
        onClick={
          props.hamburger_state
            ? handleClick
            : () => {
                props.setSelectedbtn(props.number);
              }
        }
      >
        <div className="dropdown-item-icon">{props.icon}</div>
        <div className="dropdown-item-title">{props.title}</div>
      </Link>
    </div>
  );
};
