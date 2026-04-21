import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Close,
  CalendarToday,
  FlashOn,
  Lightbulb,
  Star,
  Menu as MenuIcon,
} from "@mui/icons-material";
import AuthContext from "../../Context/Auth";
import Drawer from "@mui/material/Drawer";
import notificationSound from "../../assets/bell-notification-337658.mp3";

const Notification = ({ toggleDrawer4 }) => {
  const { authTokens } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("appointments");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [data, setData] = useState({
    appointments: [],
    scores: [],
    tips: [],
    customer_experience: [],
    daily_updates: [],
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const notificationAudioRef = useRef(null);
  const [scheduledReminders, setScheduledReminders] = useState(new Set());
  const isMobile = windowWidth < 768;

  // Sound effects setup
  useEffect(() => {
    notificationAudioRef.current = new Audio(notificationSound);
    return () => {
      if (notificationAudioRef.current) {
        notificationAudioRef.current.pause();
        notificationAudioRef.current = null;
      }
    };
  }, []);

  // Check for upcoming appointments and schedule reminders
  useEffect(() => {
    if (activeSection !== "appointments" || !data.appointments.length) return;

    const now = new Date();
    const newScheduledReminders = new Set(scheduledReminders);

    data.appointments.forEach((app) => {
      // Skip if no start time
      if (!app.date || !app.appointment_start_time) return;

      // Create appointment datetime
      const [year, month, day] = app.date.split("-");
      const [hours, minutes] = app.appointment_start_time.split(":");
      const appTime = new Date(year, month - 1, day, hours, minutes);

      // Skip if appointment is in the past
      if (appTime < now) return;

      const reminderId = `reminder-${app.id}`;

      // Skip if already scheduled
      if (scheduledReminders.has(reminderId)) return;

      // Calculate reminder time (1 hour before appointment)
      const reminderTime = new Date(appTime.getTime() - 60 * 60 * 1000);

      // Skip if reminder time is in the past
      if (reminderTime < now) return;

      const timeout = reminderTime.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        playNotificationSound();
        showBrowserNotification(
          "Appointment Reminder",
          `You have an appointment with ${app.customer_name} in 1 hour`
        );
        // Remove from scheduled reminders after triggering
        newScheduledReminders.delete(reminderId);
        setScheduledReminders(new Set(newScheduledReminders));
      }, timeout);

      // Add to scheduled reminders
      newScheduledReminders.add(reminderId);
    });

    setScheduledReminders(new Set(newScheduledReminders));
  }, [data.appointments, activeSection]);

  const playNotificationSound = () => {
    if (notificationAudioRef.current) {
      notificationAudioRef.current.currentTime = 0;
      notificationAudioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));

      // Vibrate if on mobile
      if (isMobile && "vibrate" in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
    }
  };

  const showBrowserNotification = (title, body) => {
    if (
      "Notification" in window &&
      window.Notification.permission === "granted"
    ) {
      new window.Notification(title, { body });
    }
  };

  // Enhanced data fetching functions
  const fetchData = async () => {
    try {
      const [appointments, scores, tips, experience, dailyUpdates] =
        await Promise.all([
          fetchAppointments(),
          getScoreNotification(),
          getTipNotification(),
          fetchExperienceNotifications(),
          fetchDailyUpdateNotifications(),
        ]);

      // Sort appointments by created_at (newest first)
      const sortedAppointments =
        appointments?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ) || [];

      setData({
        appointments: sortedAppointments,
        scores: scores || [],
        tips: tips || [],
        customer_experience: experience || [],
        daily_updates: dailyUpdates || [],
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointment-notifications-view/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  const getScoreNotification = async () => {
    let url = `https://backendapi.trakky.in/salonvendor/score-notifications-view/`;

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
        return result;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getTipNotification = async () => {
    let url = `https://backendapi.trakky.in/salonvendor/tip-notifications-view/`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });

      let result = await response.json();
      console.log("result", result);

      if (response.ok) {
        console.log(result);
        return result;
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchExperienceNotifications = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/clientwork-pos-request/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error fetching experience notifications:", error);
      return [];
    }
  };

  const fetchDailyUpdateNotifications = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/daily-update-request/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error fetching daily updates:", error);
      return [];
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (
      "Notification" in window &&
      window.Notification.permission !== "granted"
    ) {
      window.Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all data on mount and periodically
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Render notification items
  const renderNotificationItem = (item, index) => {
    const getInitials = (name) => {
      if (!name) return "";
      const parts = name.split(" ");
      return parts
        .map((p) => p[0])
        .join("")
        .toUpperCase();
    };

    switch (activeSection) {
      case "appointments":
        return (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {item?.service?.join(", ") || "New Appointment"}
              </h3>
              <p className="text-gray-500">
                {item?.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "Recently"}
              </p>
              <div className="mt-2">
                <p className="text-gray-700">
                  <span className="font-bold">Customer:</span>{" "}
                  {item?.customer_name || "Customer"}
                </p>
                {item.date && item.appointment_start_time && (
                  <p className="text-gray-700">
                    <span className="font-bold">Time:</span> {item.date} at{" "}
                    {item.appointment_start_time}
                  </p>
                )}
              </div>
            </div>
            <div className="relative bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-[#4B2DC0] font-bold">
                {getInitials(item?.customer_name)}
              </span>
              <CalendarToday
                className="absolute bottom-0 right-0 text-indigo-500"
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
        );

      case "scores":
        return (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Customer : {item?.customer_name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {item?.created_at?.split("T")[0]}
                  </p>
                </div>
                <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 ml-2">
                  <span className="text-[#4B2DC0] font-bold">
                    {item?.customer_name?.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Staff information - handles both single and multiple staff */}
              {item?.staff_name && item.staff_name.length > 0 ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Rated staff members:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.staff_name.map((staff, staffIndex) => (
                      <div
                        key={staffIndex}
                        className="flex items-center flex-row gap-2 p-2 bg-blue-50 rounded-md"
                      >
                        <div className="bg-[#4B2DC0] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#4B2DC0] font-bold text-xs">
                            {staff?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#4B2DC0]">
                          {staff}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-sm text-gray-500 italic">
                    No specific staff member rated
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="px-4 py-2 bg-[#4B2DC0] text-white rounded-lg cursor-default">
                  Score: {item?.score}/5
                </div>

              </div>

              
            </div>
          </div>
        );

      case "tips":
        const avatarColors = [
          { bg: "bg-indigo-100", text: "text-[#4B2DC0]" },
          { bg: "bg-green-100", text: "text-green-700" },
          { bg: "bg-[#4B2DC0]", text: "text-[#4B2DC0]" },
          { bg: "bg-yellow-100", text: "text-yellow-700" },
          { bg: "bg-red-100", text: "text-red-700" },
        ];

        const color = avatarColors[index % avatarColors.length];

        return (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                Customer : {item?.customer_name}
              </h3>
              <p className="text-gray-500">
                {item?.created_at?.split("T")[0]}{" "}
                {item?.created_at?.split("T")[1].split(".")[0]}
              </p>
              {item?.staff_name && item.staff_name.length > 0 ? (
                <div className="mt-3 gap-2 mb-2">
                  <p className="text-sm text-gray-600">
                    Rated staff members:{" "}
                    <span className="text-sm font-medium">
                      {item.staff_name.join(", ")}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="mt-2 p-2">
                  <p className="text-sm text-gray-500 italic">
                    No specific staff member rated
                  </p>
                </div>
              )}
              <p className="text-gray-700">
                Gave a tip of <span className="font-bold">{item?.tip}</span>
              </p>
            </div>
            <div
              className={`${color.bg} rounded-full w-10 h-10 flex items-center justify-center`}
            >
              <span className={`${color.text} font-bold`}>
                {item?.customer_name?.charAt(0)}
              </span>
            </div>
          </div>
        );

      case "customer_experience":
        return (
          <div
            key={index}
            className={`border-l-4 ${
              item.is_approved ? "border-green-500" : "border-red-500"
            } rounded-lg bg-white p-4 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              {/* Client Image */}
              {/* {item.client_image && (
                <div className="flex-shrink-0">
                  <img
                    src={item.client_image}
                    alt="Client"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
              )} */}

              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold ${
                    item.is_approved ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {item.is_approved ? "Approved!" : "Request Rejected"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "Recently"}
                </p>

                {/* Services */}
                {item.services ? (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Services:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {typeof item.services === "string" ? (
                        <span className="inline-block bg-[#4B2DC0] rounded-full px-3 py-1 text-xs font-medium text-[#4B2DC0]">
                          {item.services}
                        </span>
                      ) : Array.isArray(item.services) ? (
                        item.services.map((service, serviceIndex) => (
                          <span
                            key={serviceIndex}
                            className="inline-block bg-[#4B2DC0] rounded-full px-3 py-1 text-xs font-medium text-[#4B2DC0]"
                          >
                            {service}
                          </span>
                        ))
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-2">
                    No services specified
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "daily_updates":
        return (
          <div
            key={index}
            className={`border-l-4 ${
              item.is_approved ? "border-green-500" : "border-red-500"
            } rounded-lg bg-white p-4 shadow-sm`}
          >
            <div className="flex flex-col gap-3">
              {/* Daily Update Image */}
              {item.daily_update_img && (
                <div className="w-full">
                  <img
                    src={item.daily_update_img}
                    alt="Daily Update"
                    className="w-full h-48 rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold ${
                    item.is_approved ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {item.is_approved ? "Approved!" : "Request Rejected"}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "Recently"}
                </p>
                {item.updated_date && (
                  <p className="text-xs text-gray-400 mt-2">
                    Updated: {new Date(item.updated_date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {item?.customer_name || "Notification"}
              </h3>
              <p className="text-gray-500">
                {item?.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "Recently"}
              </p>
            </div>
            <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-[#4B2DC0] font-bold">
                {getInitials(item?.customer_name)}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-48 bg-white h-full pt-4 border-r relative flex-shrink-0">
          <nav className="pt-4">
            <ul>
              {[
                {
                  key: "appointments",
                  title: "Appointments",
                  icon: <CalendarToday className="mr-2" />,
                },
                {
                  key: "scores",
                  title: "Staff Rating",
                  icon: <Star className="mr-2" />,
                },
                {
                  key: "tips",
                  title: "Tips",
                  icon: <Lightbulb className="mr-2" />,
                },
                {
                  key: "customer_experience",
                  title: "Customer Experience",
                  icon: <FlashOn className="mr-2" />,
                },
                {
                  key: "daily_updates",
                  title: "Daily Updates",
                  icon: <CalendarToday className="mr-2" />,
                },
              ].map(({ key, title, icon }) => (
                <li key={key} className="mb-4">
                  <button
                    className={`flex flex-col gap-2 w-full text-left ${
                      activeSection === key ? "text-gray-800" : "text-gray-600"
                    } pl-4 ${
                      activeSection === key
                        ? "border-l-4 border-[#4B2DC0]"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveSection(key);
                    }}
                  >
                    <span className="flex items-center">
                      {icon}
                      {title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        >
          <div className="w-64 bg-white h-full pt-4">
            <div className="flex justify-end px-4">
              <button onClick={() => setMobileSidebarOpen(false)}>
                <Close />
              </button>
            </div>
            <nav className="pt-4">
              <ul>
                {[
                  {
                    key: "appointments",
                    title: "Appointments",
                    icon: <CalendarToday className="mr-2" />,
                  },
                  {
                    key: "scores",
                    title: "Staff Rating",
                    icon: <Star className="mr-2" />,
                  },
                  {
                    key: "tips",
                    title: "Tips",
                    icon: <Lightbulb className="mr-2" />,
                  },
                  {
                    key: "customer_experience",
                    title: "Customer Experience",
                    icon: <FlashOn className="mr-2" />,
                  },
                  {
                    key: "daily_updates",
                    title: "Daily Updates",
                    icon: <CalendarToday className="mr-2" />,
                  },
                ].map(({ key, title, icon }) => (
                  <li key={key} className="mb-4">
                    <button
                      className={`flex flex-col gap-2 w-full text-left ${
                        activeSection === key
                          ? "text-gray-800"
                          : "text-gray-600"
                      } pl-4 ${
                        activeSection === key
                          ? "border-l-4 border-[#4B2DC0]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveSection(key);
                        setMobileSidebarOpen(false);
                      }}
                    >
                      <span className="flex items-center">
                        {icon}
                        {title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Drawer>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${
          isMobile ? "w-full" : ""
        }`}
        style={!isMobile ? { width: "400px" } : {}}
      >
        <div className="max-w-3xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            {isMobile && (
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="mr-4 text-gray-600"
              >
                <MenuIcon />
              </button>
            )}
            <h2 className="text-xl md:text-2xl font-semibold capitalize flex-1">
              {
                {
                  appointments: "Appointments",
                  scores: "Staff Rating",
                  tips: "Tips",
                  customer_experience: "Customer Experience",
                  daily_updates: "Daily Updates",
                }[activeSection]
              }
            </h2>
            <button
              onClick={toggleDrawer4(false)}
              className="text-gray-600 ml-4"
            >
              <Close />
            </button>
          </header>

          <div className="space-y-4">
            {data[activeSection]?.length > 0 ? (
              data[activeSection].map((item, index) =>
                renderNotificationItem(item, index)
              )
            ) : (
              <div className="text-center py-10 text-gray-500">
                No notifications found
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hidden audio element */}
      <audio
        ref={notificationAudioRef}
        src={notificationSound}
        preload="auto"
      />
    </div>
  );
};

export default Notification;
