import React, { useState, useContext } from "react";
import "./Appointment.css";
import GeneralModal from "../generalModal/GeneralModal";
import CancelModal from "./CancelModal";
import ReviewModal from "./ReviewModal";
import AuthContext from "../../Context/Auth";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const AppointmentListCard = ({ appointment }) => {
  const { authTokens } = useContext(AuthContext);

  const [appointmentData, setAppointmentData] = useState(appointment);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to handle drawer

  const [isReviewed, setIsReviewed] = useState(appointmentData?.is_reviewed);
  const [isCompleted, setIsCompleted] = useState(appointmentData?.is_completed);
  const [isCancelled, setIsCancelled] = useState(appointmentData?.is_cancelled);
  const [isRunning, setIsRunning] = useState(appointmentData?.is_running);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };

  const timeStringToMs = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleStartTimer = async () => {
    let currentTime = getCurrentTime();

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments/${appointmentData?.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            time_in: currentTime,
            is_running: true,
          }),
        }
      );

      const data = await res.json();

      if (res?.ok) {
        setAppointmentData(data);
        setIsRunning(data?.is_running);
        setIsCompleted(data?.is_completed);
        setIsCancelled(data?.is_cancelled);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEndTimer = async () => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salonvendor/appointments/${appointmentData?.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            is_running: false,
            is_completed: true,
          }),
        }
      );

      let data = await res.json();

      if (res?.ok) {
        setAppointmentData(data);
        setIsRunning(data?.is_running);
        setIsCompleted(data?.is_completed);
        setIsCancelled(data?.is_cancelled);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Service 1", "Service 2", "Service 3", "Service 4"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["Service 5", "Service 6", "Service 7"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <div
        className={`alc-main-card `}
        style={
          isRunning
            ? { outlineColor: "green" }
            : isCancelled
            ? { outlineColor: "red" }
            : isCompleted
            ? { outlineColor: "blue", outlineWidth: "2px" }
            : {}
        }
      >
        <div className="alc-main-card-header">
          <div className="alc-main-card-header-title">
            <span>{appointmentData?.customer_name}</span>
            <div className=" text-sm text-gray-600">
              <span className=" text-black font-medium !text-sm">
                Status:&nbsp;
              </span>{" "}
              {isRunning ? (
                <span className=" text-green-600 !text-sm !font-light">
                  On Going
                </span>
              ) : isCompleted ? (
                <span className=" !text-sm text-blue-800 !font-light">
                  Completed
                </span>
              ) : isCancelled ? (
                <span className="!text-sm text-red-600 !font-light">
                  Cancelled
                </span>
              ) : (
                <span className=" !text-sm text-gray-700 !font-light">
                  Not Started
                </span>
              )}
            </div>
          </div>
          <div className="alc-main-card-header-services flex justify-between">
            <span>
              <span className="alc-card-dfont">Service:</span>
              <span className="alc-card-lfont">
                {appointmentData?.service_offer_name}
              </span>
            </span>
            <span>
              <span className="alc-card-dfont">Date:</span>
             <span className="alc-card-lfont">
  {appointmentData?.date
    ? appointmentData.date.split("-").reverse().join("-")
    : ""}
</span>

            </span>
          </div>
        </div>
        <div className="alc-main-card-time-details">
          <div>
            <span className="alc-card-dfont">Start Time: </span>
            <span className="alc-card-lfont">{appointmentData?.time_in}</span>
          </div>
          <div className=" text-sm">
            <span className="alc-card-dfont">Duration: </span>
            {appointmentData?.duration}
          </div>
          <div className=""></div>
        </div>
        <div className="alc-main-card-staff-details">
          <div>
            <span className="alc-card-dfont">Staff: </span>
            <span className="alc-card-lfont">
              {appointmentData?.staff_name}
            </span>
          </div>
        </div>
        <div className="alc-main-card-customer-details">
          <div>
            <span className="alc-card-dfont">Customer Type: </span>
            <span className="alc-card-lfont">
              {appointmentData?.customer_type}
            </span>
          </div>
          <div>
            <span className="alc-card-dfont">Paid Amount: </span>
            <span className="alc-card-lfont">
              ₹ {appointmentData?.amount_paid}
            </span>
          </div>
        </div>
        <div className="alc-main-card-footer-btn">
          <button
            className="alc-card-review-btn"
            onClick={() => setShowReviewModal(true)}
          >
            Review
          </button>
          <button
            className="alc-card-cancel-btn"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel
          </button>
          <button
            className="alc-card-extend-btn"
            onClick={() => setShowExtendModal(true)}
          >
            Extend
          </button>
          {isRunning ? (
            <button className="alc-card-end-timer-btn" onClick={handleEndTimer}>
              End Timer
            </button>
          ) : (
            <button
              className="alc-card-start-timer-btn"
              onClick={handleStartTimer}
            >
              Start Timer
            </button>
          )}
          <Button onClick={toggleDrawer(true)}>Select Services</Button>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {drawerList()}
          </Drawer>
        </div>
      </div>
      {showExtendModal && (
        <GeneralModal
          title="Extend Appointment"
          onClose={() => setShowExtendModal(false)}
        >
          <div className="alc-main-card-extend-modal">
            <div>
              <span>Extend Time:</span>
              <input type="text" placeholder="Enter duration in minutes" />
            </div>
            <button>Submit</button>
          </div>
        </GeneralModal>
      )}
      {showCancelModal && (
        <CancelModal
          onClose={() => setShowCancelModal(false)}
          appointmentId={appointmentData?.id}
        />
      )}
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          appointmentId={appointmentData?.id}
        />
      )}
    </>
  );
};

export default AppointmentListCard;
