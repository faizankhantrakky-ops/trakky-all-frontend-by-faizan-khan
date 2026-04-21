import React, { useState, useEffect } from "react";
import "../input.css";
import Card from "./Dashbord_cards";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import toast, { Toaster } from "react-hot-toast";
import "./css/dashboard.css";
import { formatDate } from "./DateRange/formatDate";
import AuthContext from "../Context/AuthContext";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons for professional look
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';

let cardAccessData = {
  "Total Converted Leads": "salons-permission",
  "Total Inquiry Leads": "blogs-permission",
  "Total Collaborated Salons": "salons-permission",
  "Total Budget Spent": "general-permission",
  "Total Salons": "salons-permission",
};

const Dashboard = () => {
  const { userPermissions, user, authTokens } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardCardData1, setDashboardCardData1] = React.useState();
  const [dashboardCardData2, setDashboardCardData2] = React.useState();
  const [cardData, setCardData] = React.useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(user?.user_id);

  const currentDate = new Date();
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [dateState, setDateState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: "selection",
    },
  ]);

  useEffect(() => {
    fetchdashboardCardData(selectedUserId);
  }, [dateState, selectedUserId]);

  useEffect(() => {
    setSelectedUserId(user?.user_id);
  }, [user]);

  const handleFormButtonClick = (formType) => {
    const routes = {
      "adsSpend": "/CustomerInquiresForm",
      "inquiry": "/inquiriesleadsform",
      "convertedLead": "/addconvertedlead",
      "collaborated": "/addcollaborated"
    };
    if (routes[formType]) navigate(routes[formType]);
  };

  const fetchdashboardCardData = async (id) => {
    if (!id) return;
    try {
      const [{ startDate, endDate }] = dateState;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      const apiUrl = `https://backendapi.trakky.in/salons/customerdashboard/?start_date=${formattedStartDate}&end_date=${formattedEndDate}&user=${id}`;
      const response = await fetch(apiUrl);

      if (response.status === 200) {
        const data = await response.json();
        const cardData = Object.entries(data).map(([key, value]) => ({
          key,
          value,
          access: cardAccessData[key],
        }));

        let filteredCardData = [];
        if (userPermissions.status === 200) {
          filteredCardData = cardData.filter((item) => {
            if (userPermissions?.data?.length > 0) {
              return userPermissions?.data?.[0]?.access?.includes(item.access);
            }
          });
        } else if (userPermissions.status === 404) {
          filteredCardData = cardData.filter((item) => item.access === "general-permission");
        }
        setCardData(filteredCardData);
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
      toast.error("Failed to fetch dashboard data. Please try again later.");
    }
  };

  const getUsersData = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        let filteredUsers = result.filter((user) => user.is_superuser);
        setUserData(filteredUsers);
      } else {
        toast.error(`Error fetching users data: ${response.status}`);
      }
    } catch (error) {
      toast.error(`Error fetching users data: ${error.message}`);
    }
  };

  useEffect(() => {
    if (userPermissions?.data?.[0]?.access?.includes("super-permission")) {
      getUsersData();
    }
  }, []);

  return (
    <>
      <Toaster />
      <div className="professional-dashboard">
        {/* Header Section */}
        <div className="dashboard-header-professional">
          <div className="header-content">
            <div className="header-title-section">
             
              <div className="title-content">
                <p className="welcome-text">Welcome back, Shikhar</p>
              </div>
            </div>

            <div className="header-controls">
              {userPermissions?.data?.[0]?.access?.includes("super-permission") && (
                <div className="control-item user-selector">
                  <PersonIcon className="control-icon" />
                  <FormControl variant="outlined" size="small" className="custom-select">
                    <InputLabel>Select User</InputLabel>
                    <Select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      label="Select User"
                    >
                      {userData?.map((user, index) => (
                        <MenuItem key={index} value={user.id}>
                          {user?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="control-item date-selector">
                <CalendarTodayIcon className="control-icon" />
                <div 
                  className="date-range-display"
                  onClick={() => setShowDateSelectionModal(true)}
                >
                  <span className="date-text">
                    {dateState[0].startDate.toLocaleDateString()}
                  </span>
                  <span className="date-separator">to</span>
                  <span className="date-text">
                    {dateState[0]?.endDate?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <div className="section-divider"></div>
          </div>
          <div className="actions-grid">
            <button 
              className="action-card"
              onClick={() => handleFormButtonClick("adsSpend")}
            >
              <div className="action-icon">💰</div>
              <div className="action-content">
                <h3>Ads Spend</h3>
                <p>Manage advertising budget</p>
              </div>
            </button>

            <button 
              className="action-card"
              onClick={() => handleFormButtonClick("inquiry")}
            >
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h3>Inquiry Form</h3>
                <p>Handle customer inquiries</p>
              </div>
            </button>

            <button 
              className="action-card"
              onClick={() => handleFormButtonClick("convertedLead")}
            >
              <div className="action-icon">✅</div>
              <div className="action-content">
                <h3>Converted Lead</h3>
                <p>Track successful conversions</p>
              </div>
            </button>

            <button 
              className="action-card"
              onClick={() => handleFormButtonClick("collaborated")}
            >
              <div className="action-icon">🤝</div>
              <div className="action-content">
                <h3>Collaborated</h3>
                <p>Manage partnerships</p>
              </div>
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <div className="section-header">
            <h2 className="section-title">Performance Metrics</h2>
            <div className="section-divider"></div>
          </div>
          <div className="metrics-grid">
            {cardData?.map((item, index) => (
              <Card
                key={index}
                name={item.key}
                number={item.value}
                percent=""
                dateState={dateState}
              />
            ))}
          </div>
        </div>
      </div>

      <GeneralModal
        open={showDateSelectionModal}
        handleClose={() => setShowDateSelectionModal(false)}
      >
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          setShowDateSelectionModal={setShowDateSelectionModal}
        />
      </GeneralModal>
    </>
  );
};

export default Dashboard;