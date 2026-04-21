import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Close,
  CalendarToday,
  FlashOn,
  Lightbulb,
  Star,
} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthContext from "../../Context/Auth";
// import { CalendarToday } from '@mui/icons-material';

const DrawerDesign = ({ toggleDrawer4 }) => {
  // State to track active section

  const { authTokens } = useContext(AuthContext);

  const [activeSection, setActiveSection] = useState("appointments");
  const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const notificationDrawerRef = useRef(null);
  // Data for different sections
  // const data = {
  //   appointments: [
  //     { title: "Haircut (New appointment)", time: "30th May, Monday, 1:00 pm", bookedBy: "Priyansh" },
  //     { title: "Haircut (New appointment)", time: "30th May, Monday, 1:00 pm", bookedBy: "Priyansh" },
  //     { title: "Haircut (New appointment)", time: "30th May, Monday, 1:00 pm", bookedBy: "Priyansh" },
  //   ],
  //   scores: [
  //     { name: "Priyansh Bhavsar", score: "8/10", time: "7 hours ago" },
  //     { name: "Priyansh Bhavsar", score: "8/10", time: "5 days ago" },
  //     { name: "Priyansh Bhavsar", score: "8/10", time: "1 week ago" },
  //   ],
  //   tips: [
  //     { name: "Priyansh Bhavsar", tip: "₹200", time: "7 hours ago" },
  //     { name: "Vedant Thakkar", tip: "₹200", time: "7 hours ago" },
  //     { name: "Jinay Mehta", tip: "₹200", time: "7 hours ago" },
  //     { name: "Axay Vacher", tip: "₹200", time: "7 hours ago" },
  //     { name: "Bhavik", tip: "₹200", time: "7 hours ago" },
  //   ]
  // };

  const [data, setData] = useState({
    appointments: [],
    scores: [],
    tips: [],
  });

  const sectionTitles = {
    appointments: "Appointments",
    scores: "Staff Rating",
    tips: "Tips",
  };

  const getAppointmentNotification = async () => {
    let url = `https://backendapi.trakky.in/spavendor/appointment-notifications-view/`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });

      let result = await response.json();

      if (response.ok) {
        console.log(result);
        // setData({ ...data, appointments: result });
        setData((prevData) => ({
          ...prevData,
          appointments: result,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getScoreNotification = async () => {
    let url = `https://backendapi.trakky.in/spavendor/score-notifications-view/`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });

      let result = await response.json();

      if (response.ok) {
        console.log(result);
        setData((prevData) => ({
          ...prevData,
          scores: result,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTipNotification = async () => {
    let url = `https://backendapi.trakky.in/spavendor/tip-notifications-view/`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });

      let result = await response.json();

      if (response.ok) {
        console.log(result);
        setData((prevData) => ({
          ...prevData,
          tips: result,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointmentNotification().then(() => {
      getScoreNotification().then(() => {
        getTipNotification();
      });
    });
  }, []);

  useEffect(() => {
    // Handler to close the notification drawer when clicking outside of it
    const handleClickOutside = (event) => {
      if (
        notificationDrawerRef.current &&
        !notificationDrawerRef.current.contains(event.target)
      ) {
        setNotificationDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Main content rendering based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case "appointments":
        return (
          <>
            {data?.appointments?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item?.service?.join(", ")}
                  </h3>
                  <p className="text-gray-500">{
                    item?.created_at?.split("T")[0]
                    }, {item?.created_at?.split("T")[1].split(".")[0]}
                    </p>
                  <p className="text-gray-700">
                    booked by{" "}
                    <span className="font-bold">{item?.customer_name}</span>
                  </p>
                </div>
                <div className="relative bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-purple-700 font-bold">
                    {item?.customer_name.charAt(0)}
                  </span>

                  <CalendarToday
                    className="absolute bottom-0 right-0 text-purple-500"
                    style={{ fontSize: 14 }}
                  />
                </div>
              </div>
            ))}
          </>
        );

      case "scores":
        return (
          <>
            {data.scores.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-800">
                    {item?.customer_name}
                  </h3>
                  <p className="text-gray-500">
                    {item?.created_at?.split("T")[0]}
                  </p>
                  <div className="">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-default">
                      Score {item?.score}
                    </button>
                  </div>
                </div>
                <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-purple-700 font-bold">
                    {item?.customer_name?.charAt(0)}
                  </span>
                </div>
              </div>
            ))}
          </>
        );

      case "tips":
        // Define an array of color classes for backgrounds and text
        const avatarColors = [
          { bg: "bg-purple-100", text: "text-purple-700" },
          { bg: "bg-green-100", text: "text-green-700" },
          { bg: "bg-blue-100", text: "text-blue-700" },
          { bg: "bg-yellow-100", text: "text-yellow-700" },
          { bg: "bg-red-100", text: "text-red-700" },
        ];

        return (
          <>
            {data.tips.map((item, index) => {
              // Use modulus to cycle through the color array
              const color = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={index}
                  className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item?.customer_name}
                    </h3>
                    <p className="text-gray-500">
                      {item?.created_at?.split("T")[0]} {item?.created_at?.split("T")[1].split(".")[0]}
                    </p>
                    <p className="text-gray-700">
                      Gave a tip of{" "}
                      <span className="font-bold">{item?.tip}</span>
                    </p>
                  </div>
                  {/* Dynamic avatar background and text color */}
                  <div
                    className={`${color.bg} rounded-full w-10 h-10 flex items-center justify-center`}
                  >
                    <span className={`${color.text} font-bold`}>
                      {item?.customer_name?.charAt(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-48 bg-white h-full pt-4 border-r relative flex-shrink-0">
        <nav className="pt-4">
          <ul>
            <li className="mb-4">
              <a
                href="#"
                className={`flex flex-col gap-2 text-gray-800 pl-4 ${
                  activeSection === "appointments"
                    ? "border-l-4 border-purple-600"
                    : ""
                }`}
                onClick={() => setActiveSection("appointments")}
              >
                <CalendarToday className="mr-2" /> Appointments
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className={`flex flex-col gap-2 text-gray-600 pl-4 ${
                  activeSection === "scores"
                    ? "border-l-4 border-purple-600"
                    : ""
                }`}
                onClick={() => setActiveSection("scores")}
              >
                <Star className="mr-2" /> Staff Rating
              </a>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className={`flex flex-col gap-2 text-gray-600 pl-4 ${
                  activeSection === "tips" ? "border-l-4 border-purple-600" : ""
                }`}
                onClick={() => setActiveSection("tips")}
              >
                <Lightbulb className="mr-2" /> Tips
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content - Scrollable */}
      <main
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
        style={{ width: "400px" }}
      >
        <div className="max-w-3xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold capitalize">
            {sectionTitles[activeSection]} 
            </h2>
            {/* <button
              className="border px-2 py-2 rounded-md text-gray-600 relative cursor-pointer"
              onClick={() =>
                setNotificationDrawerOpen(!isNotificationDrawerOpen)
              }
            >
              <MoreVertIcon />
              {isNotificationDrawerOpen && (
                <div
                  ref={notificationDrawerRef}
                  className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                  style={{ zIndex: "10000" }}
                >
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
              )}
            </button> */}
          </header>

          <div className="space-y-4">{renderMainContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default DrawerDesign;
