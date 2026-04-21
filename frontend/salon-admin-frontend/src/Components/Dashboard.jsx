import React, { useState, useEffect } from "react";

import "../input.css";
import Card from "./Dashbord_cards";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import toast, { Toaster } from "react-hot-toast";
import { formatDate } from "./DateRange/formatDate";
import AuthContext from "../Context/AuthContext";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

let cardAccessData = {
  "Total Salons": "salons-permission",
  "Total Collaborated Salons": "salons-permission",
  "Total Salon Requests": "salons-permission",
  "Total Scores": "general-permission",
  "Total Users": "general-permission",
  "Total Inquiries": "inquiry-permission",
  "Total POS Vendors": "vendor-permission",
  "Total National Categories": "category-permission",
  "Total Cities": "city-area-permission",
  "Total Areas": "city-area-permission",
  "Total Categories": "category-permission",
  "Total Services": "service-permission",
  "Total Packages": "salon-specific-permission",
  "Total Salon Client Images": "client-work-photos-permission",
  "Total Salon Profile Offers": "salon-specific-permission",
  "Total Master Categories": "master-permission",
  "Total Master Services": "master-permission",
  "Total Blogs": "blogs-permission",
  "Total Daily Updates": "daily-updates-permission",
  "Total National Hero Offers": "national-city-hero-offers-permission",
  "Total Features This Week": "national-specific-permission",
  "Total Salon City Offers": "city-offers-permission",
  "Total Bridal Salons": "salons-category-permission",
  "Total Makeup Salons": "salons-category-permission",
  "Total Unisex Salons": "salons-category-permission",
  "Total Top Rated Salons": "salons-category-permission",
  "Total Academy Salons": "salons-category-permission",
  "Total Female Beauty Parlours": "salons-category-permission",
  "Total Kids Salons": "salons-category-permission",
  "Total Male Salons": "salons-category-permission",
};

const Dashboard = () => {
  const { userPermissions, user, authTokens } = React.useContext(AuthContext);

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

  const fetchdashboardCardData = async (id) => {
    if (!id) return;

    try {
      const [{ startDate, endDate }] = dateState;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const apiUrl = `https://backendapi.trakky.in/salons/dashboard/?start_date=${formattedStartDate}&end_date=${formattedEndDate}&user=${id}`;
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
          filteredCardData = cardData.filter((item) =>
            userPermissions?.data?.[0]?.access?.includes(item.access)
          );
        } else if (userPermissions.status === 404) {
          filteredCardData = cardData.filter(
            (item) => item.access === "general-permission"
          );
        }

        setCardData(filteredCardData);
      } else {
        const errorMsg =
          response.status === 400
            ? "Bad request. Please check your input."
            : response.status === 401
            ? "Unauthorized. Please log in again."
            : `Error: ${response.status}`;
        toast.error(errorMsg, {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "8px", background: "#1f2937", color: "#fff", fontSize: "14px" },
        });
      }
    } catch (error) {
      toast.error("Failed to load data.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "8px", background: "#1f2937", color: "#fff", fontSize: "14px" },
      });
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
        setUserData(result.filter((user) => user.is_superuser));
      }
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };

  useEffect(() => {
    if (userPermissions?.data?.[0]?.access?.includes("super-permission")) {
      getUsersData();
    }
  }, [userPermissions]);

  return (
    <>
      <Toaster />
      <div className="w-full bg-gray-50 min-h-screen flex flex-col overflow-auto">
        {/* === PROFESSIONAL TAILWIND HEADER === */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-7 bg-white border-b border-gray-300 rounded-b-3xl shadow-sm gap-5">
          {/* Title Section */}
          <div className="flex flex-col ">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DASHBOARD</h1>
            <p className="text-sm font-medium text-gray-600 mt-1">Welcome, SHIKHAR</p>
          </div>

          {/* Controls: User Select + Date Range */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {/* Superuser Dropdown */}
            {userPermissions?.data?.[0]?.access?.includes("super-permission") && (
              <FormControl
                variant="outlined"
                size="small"
                className="min-w-[160px]"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1f2937" },
                  },
                  "& .MuiInputLabel-root": { fontSize: "13px", color: "#4b5563", fontWeight: 500 },
                }}
              >
                <InputLabel id="user-select-label">Select User</InputLabel>
                <Select
                  labelId="user-select-label"
                  label="Select User"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {userData?.map((user, index) => (
                    <MenuItem key={index} value={user.id} sx={{ fontSize: "14px" }}>
                      {user?.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Date Range Picker */}
            <div
              onClick={() => setShowDateSelectionModal(true)}
              className="flex items-center bg-white px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 hover:shadow transition-all cursor-pointer min-w-[240px] sm:min-w-[260px]"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <span className="">
                  {String(dateState[0].startDate.getDate()).padStart(2, "0")}-
                  {String(dateState[0].startDate.getMonth() + 1).padStart(2, "0")}-
                  {dateState[0].startDate.getFullYear()}
                </span>
                <span className="text-gray-400">~</span>
                <span className="">
                  {String(dateState[0].endDate.getDate()).padStart(2, "0")}-
                  {String(dateState[0].endDate.getMonth() + 1).padStart(2, "0")}-
                  {dateState[0].endDate.getFullYear()}
                </span>
              </div>
              {/* Calendar Icon */}
              <svg
                className="w-4 h-4 text-gray-500 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
        </header>

        {/* === CARD LAYOUT (UNCHANGED) === */}
        <div className=" mt-5 w-full gap-2 md:overflow-auto h-[40%] md:h-[50%] bg-gray-50 justify-around items-center flex flex-wrap px-4">
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