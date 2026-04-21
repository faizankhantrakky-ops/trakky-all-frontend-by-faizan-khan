import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import { FaRupeeSign } from "react-icons/fa";
import CallIcon from "@mui/icons-material/Call";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StarIcon from "@mui/icons-material/Star";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import SegmentIcon from "@mui/icons-material/Segment";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChatIcon from "@mui/icons-material/Chat";
import SecurityIcon from "@mui/icons-material/Security";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import logo from "../trakky_logo.png";
import AuthContext from "../Context/AuthContext";
import { colors } from "@mui/material";

const New_Sidebar = (props) => {
  const { userPermissions } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [selectedbtn, setSelectedbtn] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const [list, setList] = useState([
    {
      type: "normal",
      title: "Dashboard",
      link: "/dashboard",
      link2: "/",
      number: 1,
      icon: <DashboardIcon fontSize="small" />
    },
  ]);

  useEffect(() => {
    if (userPermissions?.status == 200) {
      let temp_list = [];

      if (userPermissions?.data?.length > 0) {
        if (userPermissions?.data?.[0]?.access?.includes("ads-spend-permission")) {
          let ads_spend_permission = [
            {
              type: "dropdown",
              title: "Ads Spend",
              items: [
                {
                  title: "Ads Spend List",
                  link: "/CustomerInquires",
                  icon: <FormatListBulletedIcon fontSize="small" />,
                  number: 57,
                },
                {
                  title: "Ads Spend Form",
                  link: "/CustomerInquiresForm",
                  icon: <AddIcon fontSize="small" />,
                  number: 66,
                }
              ],
              icon: <FaRupeeSign size={18} />
            },
          ];
          temp_list.push(...ads_spend_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("inquiry-leads-permission")) {
          let inquiry_leads_permission = [
            {
              type: "dropdown",
              title: "Inquiry Leads",
              items: [
                {
                  title: "Inquires Leads",
                  link: "/inquiriesleads",
                  icon: <FormatListBulletedIcon fontSize="small" />,
                  number: 67,
                },
                {
                  title: "Inquires Leads Forms",
                  link: "/inquiriesleadsform",
                  icon: <AddIcon fontSize="small" />,
                  number: 68,
                }
              ],
              icon: <ContactMailIcon fontSize="small" />
            },
          ];
          temp_list.push(...inquiry_leads_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("converted-leads-permission")) {
          let converted_leads_permission = [
            {
              type: "dropdown",
              title: "Converted Lead",
              items: [
                {
                  title: "Converted Leads List",
                  link: "/convertedlead",
                  icon: <FormatListBulletedIcon fontSize="small" />,
                  number: 12,
                },
                {
                  title: "Add Converted Leads",
                  link: "/addconvertedlead",
                  icon: <AddIcon fontSize="small" />,
                  number: 13,
                },
              ],
              icon: <TrendingUpIcon fontSize="small" />
            },
          ];
          temp_list.push(...converted_leads_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("collaborated-salons-permission")) {
          let collaborated_salons_permission = [
            {
              type: "dropdown",
              title: "Collaborated Salons",
              items: [
                {
                  title: "Collaborated Salons",
                  link: "/collaborated",
                  icon: <FormatListBulletedIcon fontSize="small" />,
                  number: 12,
                },
                {
                  title: "Add Collaborated Salons",
                  link: "/addcollaborated",
                  icon: <AddIcon fontSize="small" />,
                  number: 13,
                },
              ],
              icon: <GroupIcon fontSize="small" />
            },
          ];
          temp_list.push(...collaborated_salons_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("customer-segmentation-permission")) {
          let customer_segmentation_permission = [
            {
              type: "normal",
              title: "Customer Segmentation",
              link: "/customersegmentation",
              number: 7,
              icon: <SegmentIcon fontSize="small" />
            },
          ];
          temp_list.push(...customer_segmentation_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("offerpage-booking-history-permission")) {
          let offerpage_booking_history_permission = [
            {
              type: "normal",
              title: "Offerpage Booking",
              link: "/salonofferbooking",
              number: 7,
              icon: <BookOnlineIcon fontSize="small" />
            },
            {
              type: "normal",
              title: "Customer Membership",
              link: "/customer-membership",
              number: 8,
              icon: <PeopleIcon fontSize="small" />
            },
          ];
          temp_list.push(...offerpage_booking_history_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("chatbot-user-data-permission")) {
          let chatbot_user_data_permission = [
            {
              type: "normal",
              title: "ChatBot User Data",
              link: "/chatbotuserhistory",
              number: 8,
              icon: <ChatIcon fontSize="small" />
            },
          ];
          temp_list.push(...chatbot_user_data_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("super-permission")) {
          let permissions_permission = [
            {
              type: "dropdown",
              title: "Permissions",
              items: [
                {
                  title: "List Permissions",
                  link: "/permissions-data",
                  icon: <FormatListBulletedIcon fontSize="small" />,
                  number: 66,
                },
                {
                  title: "Add Permission",
                  link: "/custompermissions",
                  icon: <AddIcon fontSize="small" />,
                  number: 67,
                },
              ],
              icon: <SecurityIcon fontSize="small" />
            },
          ];
          temp_list.push(...permissions_permission);
        }

        if (userPermissions?.data?.[0]?.access?.includes("create-user-permission")) {
          let user_creation_permission = [
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
              icon: <PersonAddIcon fontSize="small" />
            },
          ];
          temp_list.push(...user_creation_permission);
        }

        let appointment_permission = [
          {
            type: "dropdown",
            title: "Manage Appointment",
            items: [
              {
                title: "Manage Appointment",
                link: "/Appointments",
                icon: <FormatListBulletedIcon fontSize="small" />,
                number: 70,
              },
            ],
            icon: <CalendarTodayIcon fontSize="small" />
          },
        ];
        temp_list.push(...appointment_permission);

        // Add Manage Automation menu
        let manage_automation_menu = [
          {
            type: "dropdown",
            title: "Manage Automation",
            items: [
              {
                title: "Automation List",
                link: "/automation-list",
                icon: <FormatListBulletedIcon fontSize="small" />,
                number: 102,
              },
             
            ],
            icon: <SettingsIcon fontSize="small" />
          },
        ];
        temp_list.push(...manage_automation_menu);
      }

      let manage_membership_menu = [
        {
          type: "dropdown",
          title: "Manage Membership",
          items: [
            {
              title: "Membership List",
              link: "/membership-list",
              icon: <FormatListBulletedIcon fontSize="small" />,
              number: 100,
            },
            {
              title: "Add Membership",
              link: "/add-membership",
              icon: <AddIcon fontSize="small" />,
              number: 101,
            },
          ],
          icon: <CardMembershipIcon fontSize="small" />
        },
      ];
      temp_list.push(...manage_membership_menu);

      setList((prev) => [...prev, ...temp_list]);
    } else if (userPermissions?.status == 404) {
      let temp_list = [];

      let general_permission = [
        {
          type: "normal",
          title: "Customers",
          link: "/customers",
          number: 2,
          icon: <PeopleIcon fontSize="small" />
        },
        {
          type: "normal",
          title: "Create User",
          link: "/addnewuser",
          number: 3,
          icon: <PersonAddIcon fontSize="small" />
        },
        {
          type: "dropdown",
          title: "Salon Scores",
          items: [
            {
              title: "Salon Scores",
              icon: <FormatListBulletedIcon fontSize="small" />,
              link: "/userreviews",
              number: 4,
            },
            {
              title: "Add Salon Scores",
              link: "/addsalonscores",
              icon: <AddIcon fontSize="small" />,
              number: 5,
            },
          ],
          icon: <StarIcon fontSize="small" />
        },
        {
          type: "normal",
          title: "Trakky Ratings",
          link: "/ratings",
          number: 6,
          icon: <AssessmentIcon fontSize="small" />
        },
        {
          type: "normal",
          title: "Contact Us",
          link: "/usercontactus",
          number: 8,
          icon: <ContactMailIcon fontSize="small" />
        },
        {
          type: "dropdown",
          title: "Manage Appointment",
          items: [
            {
              title: "Manage Appointment",
              link: "/Appointments",
              icon: <FormatListBulletedIcon fontSize="small" />,
              number: 70,
            },
          ],
          icon: <CalendarTodayIcon fontSize="small" />
        },
        // Add Manage Automation menu for 404 status too
        {
          type: "dropdown",
          title: "Manage Automation",
          items: [
            {
              title: "Automation List",
              link: "/automation-list",
              icon: <FormatListBulletedIcon fontSize="small" />,
              number: 102,
            },
            {
              title: "Add Automation",
              link: "/add-automation",
              icon: <AddIcon fontSize="small" />,
              number: 103,
            },
            {
              title: "Automation Settings",
              link: "/automation-settings",
              icon: <SettingsIcon fontSize="small" />,
              number: 104,
            },
          ],
          icon: <SettingsIcon fontSize="small" />
        },
      ];

      temp_list.push(...general_permission);
      setList((prev) => [...prev, ...temp_list]);
    }
  }, [userPermissions]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(list);
      return;
    }

    const filtered = list.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      if (item.title.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      if (item.type === "dropdown" && item.items) {
        return item.items.some(subItem => 
          subItem.title.toLowerCase().includes(searchLower)
        );
      }
      
      return false;
    });

    setFilteredList(filtered);
  }, [searchTerm, list]);

  const handleClose = () => {
    props.change_hamburger_state(!props.hamburger_state);
  };

  return (
    <div className="sidebar-container" style={{ 
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.08)'
    }}>
      {props.hamburger_state && (
        <div className="sidebar-close-btn" onClick={handleClose} style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#374151'
        }}>
          <KeyboardDoubleArrowLeftIcon />
        </div>
      )}
      
      {/* Logo Section */}
      <div className="sidebar-item" style={{ 
        padding: '15px',
        borderBottom: '1px solid #f1f5f9',
        backgroundColor:"#502DA6"
      }}>
        <div className="logo" style={{ textAlign: 'center' }}>
          <img src={logo} alt="logo" style={{ 
            height: '40px',
            filter: 'brightness(0) invert(1)'
          }} />
          
        </div>
      </div>

      {/* Search Section */}
      <div className="sidebar-item" style={{ 
        padding: '10px ',
        borderBottom: '1px solid #f1f5f9',
        background: '#ffffff'
      }}>
        <div style={{ position: 'relative' }}>
        
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '5px ',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#1e293b',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#502DA6';
              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchTerm && (
            <CloseIcon 
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            />
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ 
        padding: '10px 0', 
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 180px)',
        background: '#ffffff',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
        '&::-webkit-scrollbar': {
          display: 'none' // Chrome, Safari and Opera
        }
      }}>
        {(searchTerm ? filteredList : list).map((item, index) => {
          if (item.type === "normal") {
            return (
              <SidebarItem
                number={item.number}
                link2={item.link2}
                selectedbtn={selectedbtn}
                setSelectedbtn={setSelectedbtn}
                title={item.title}
                link={item.link}
                icon={item.icon}
                key={index}
                handleClose={handleClose}
                hamburger_state={props.hamburger_state}
                searchTerm={searchTerm}
              />
            );
          } else {
            return (
              <SidebarDropdown
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
                selectedbtn={selectedbtn}
                setSelectedbtn={setSelectedbtn}
                title={item.title}
                items={item.items}
                key={index}
                index={index}
                handleClose={handleClose}
                hamburger_state={props.hamburger_state}
                searchTerm={searchTerm}
              />
            );
          }
        })}
        
        {searchTerm && filteredList.length === 0 && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
            background: '#ffffff'
          }}>
            No menu items found
          </div>
        )}
      </div>
    </div>
  );
};

export default New_Sidebar;

const SidebarItem = (props) => {
  const location = useLocation();
  const isActive = location.pathname === props.link || location.pathname === props.link2;

  const handleClick = () => {
    if (props.hamburger_state) {
      props.handleClose();
    }
    props.setSelectedbtn(props.number);
  };

  // Highlight search matches
  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ 
              background: 'rgba(79, 70, 229, 0.15)', 
              color: '#502DA6',
              padding: '0 2px',
              borderRadius: '3px',
              fontWeight: '600'
            }}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className="sidebar-item"
      style={{
        background: isActive 
          ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.08) 0%, rgba(79, 70, 229, 0.04) 100%)' 
          : 'transparent',
        borderRight: isActive ? '4px solid #502DA6' : '4px solid transparent',
        margin: '2px 0',
        transition: 'all 0.2s ease'
      }}
    >
      <Link
        to={props.link}
        className="link"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          textDecoration: 'none',
          color: isActive ? '#502DA6' : '#374151',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s ease',
          background: 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.color = '#502DA6';
            e.target.parentElement.style.background = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.color = '#374151';
            e.target.parentElement.style.background = 'transparent';
          }
        }}
      >
        <div style={{ 
          marginRight: '12px',
          color: isActive ? '#502DA6' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.2s ease'
        }}>
          {props.icon}
        </div>
        <div className="single" style={{ 
          fontSize: '14px',
          letterSpacing: '0.2px'
        }}>
          {props.searchTerm 
            ? getHighlightedText(props.title, props.searchTerm)
            : props.title
          }
        </div>
      </Link>
    </div>
  );
};

const SidebarDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.searchTerm && props.items.some(item => 
      item.title.toLowerCase().includes(props.searchTerm.toLowerCase())
    )) {
      setIsOpen(true);
      props.setSelected(props.index);
    }
  }, [props.searchTerm]);

  const handleClick = () => {
    if (props.selected === props.index) {
      props.setSelected(null);
      setIsOpen(false);
    } else {
      setIsOpen(true);
      props.setSelected(props.index);
    }
  };

  const isActive = props.selected === props.index;

  return (
    <div className="sidebar-item sidebar-dropdown" style={{ 
      margin: '2px 0',
      background: '#ffffff'
    }}>
      <div 
        className="dropdown-title" 
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          cursor: 'pointer',
          color: isActive ? '#502DA6' : '#374151',
          fontWeight: isActive ? '600' : '500',
          background: isActive ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
          transition: 'all 0.2s ease',
          borderRight: isActive ? '4px solid #502DA6' : '4px solid transparent'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.color = '#502DA6';
            e.target.style.background = '#f8fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.color = '#374151';
            e.target.style.background = 'transparent';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            marginRight: '12px',
            color: isActive ? '#502DA6' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s ease'
          }}>
            {props.icon}
          </div>
          <div className="dropdown-item-title" style={{ 
            fontSize: '14px',
            letterSpacing: '0.2px'
          }}>
            {props.title}
          </div>
        </div>
        <div className="dropdown-icon" style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          <KeyboardArrowDownIcon style={{ 
            color: isActive ? '#502DA6' : '#64748b', 
            fontSize: '18px' 
          }} />
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="dropdown-description"
          style={{
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {props.items.map((item, key) => (
            <DropdownItem
              selectedbtn={props.selectedbtn}
              setSelectedbtn={props.setSelectedbtn}
              icon={item.icon}
              title={item.title}
              link={item.link}
              key={key}
              handleClose={props.handleClose}
              hamburger_state={props.hamburger_state}
              number={item.number}
              searchTerm={props.searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DropdownItem = (props) => {
  const location = useLocation();
  const isActive = location.pathname === props.link;

  const handleClick = () => {
    if (props.hamburger_state) {
      props.handleClose();
    }
    props.setSelectedbtn(props.number);
  };

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ 
              background: 'rgba(79, 70, 229, 0.15)', 
              color: '#502DA6',
              padding: '0 2px',
              borderRadius: '3px',
              fontWeight: '600'
            }}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className="dropdown-item"
      style={{
        background: isActive 
          ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)' 
          : 'transparent',
        borderRight: isActive ? '4px solid #502DA6' : '4px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      <Link
        to={props.link}
        className="link"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px 10px 52px',
          textDecoration: 'none',
          color: isActive ? '#502DA6' : '#475569',
          fontSize: '13px',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s ease',
          letterSpacing: '0.1px'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.color = '#502DA6';
            e.target.parentElement.style.background = '#f1f5f9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.color = '#475569';
            e.target.parentElement.style.background = 'transparent';
          }
        }}
      >
        <div className="dropdown-item-icon" style={{ 
          marginRight: '12px',
          color: isActive ? '#502DA6' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.2s ease'
        }}>
          {props.icon}
        </div>
        <div className="dropdown-item-title">
          {props.searchTerm 
            ? getHighlightedText(props.title, props.searchTerm)
            : props.title
          }
        </div>
      </Link>
    </div>
  );
};