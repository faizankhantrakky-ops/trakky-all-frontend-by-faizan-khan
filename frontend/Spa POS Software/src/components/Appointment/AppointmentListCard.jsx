import React, { useEffect, useState, useContext, useRef } from "react";
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
import { set } from "date-fns";
import TempForm from "./Temp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import EditAppointment from "./Temp";

const AppointmentListCard = ({ appointment }) => {
  console.log("appointment : ", appointment);
  const { authTokens } = useContext(AuthContext);

  const [appointmentData, setAppointmentData] = useState(appointment);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isReviewed, setIsReviewed] = useState(appointmentData?.is_reviewed);

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
        `https://backendapi.trakky.in/spavendor/appointments-new/${appointmentData?.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            appointment_start_time: currentTime,
            appointment_status: "running",
          }),
        }
      );

      const data = await res.json();

      if (res?.ok) {
        setAppointmentData(data);
        toast.success("Service started successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to start service");
    }
  };

  const handleEndTimer = async () => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spavendor/appointments-new/${appointmentData?.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            appointment_end_time: getCurrentTime(),
            appointment_status: "completed",
          }),
        }
      );

      let data = await res.json();

      if (res?.ok) {
        setAppointmentData(data);
        toast.success("Service ended successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to end service");
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <Box style={{ width: "fit-content" }} role="presentation">
      <EditAppointment
        appointment={appointmentData}
        closeDrawer={() => setDrawerOpen(false)}
        handleToastMessage={setToastMessage}
        setAppointmentData={(data) => setAppointmentData(data)}
      />
    </Box>
  );

  const setToastMessage = (message, status) => {
    if (status === "success") {
      toast.success(message);
    }
    if (status === "error") {
      toast.error(message);
    }
  };

  return (
    <>
      <div
        className={`alc-main-card h-fit `}
        style={
          appointmentData?.appointment_status == "running"
            ? { outlineColor: "green" }
            : appointmentData?.appointment_status == "cancelled"
            ? { outlineColor: "red" }
            : appointmentData?.appointment_status == "completed"
            ? { outlineColor: "blue", outlineWidth: "2px" }
            : {}
        }
      >
        <div className="alc-main-card-header ">
          <div className="alc-main-card-header-title">
            <div className=" flex gap-1 !text-sm">
              <span className=" font-semibold !text-sm">Date : </span>
              <span className=" text-gray-600 !font-normal !text-sm">
                {" "}
                {appointmentData?.date}
              </span>
            </div>
            <div className=" text-sm text-gray-600">
              <span className=" text-black font-medium !text-sm">
                Status:&nbsp;
              </span>{" "}
              {appointmentData.appointment_status == "running" ? (
                <span className=" text-green-600 !text-sm !font-light">
                  On Going
                </span>
              ) : appointmentData.appointment_status == "completed" ? (
                <span className=" !text-sm text-blue-800 !font-light">
                  Completed
                </span>
              ) : appointmentData.appointment_status == "cancelled" ? (
                <span className="!text-sm text-red-600 !font-light">
                  Cancelled
                </span>
              ) : (
                appointmentData.appointment_status == "not_started" && (
                  <span className=" !text-sm text-gray-700 !font-light">
                    Not Started
                  </span>
                )
              )}
            </div>
          </div>
          <div className=" ">
            <span className=" text-sm font-semibold ">Username / PN : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.customer_name} /{" "}
              {appointmentData?.customer_phone}
            </span>
          </div>
        </div>
        <div className="border-b border-slate-600 flex flex-col gap-1">
          <div className=" ">
            <span className=" text-sm font-semibold ">Services : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.included_services
                ?.map((service) => service.service_name)
                .join(", ") ?? "No services included"}
            </span>
          </div>
          {/* <div className=" ">
            <span className=" text-sm font-semibold ">Offers : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.included_offers
                ?.map((service) => service.offer_name)
                .join(", ") ?? "No offers included"}
            </span>
          </div> */}
        </div>
        <div className=" flex justify-between gap-1 border-b border-slate-600">
          <div className=" ">
            <span className=" text-sm font-semibold ">Start time : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.appointment_start_time ?? "N/A"}
            </span>
          </div>
          <div className=" ">
            <span className=" text-sm font-semibold ">End time : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.appointment_end_time ?? "N/A"}
            </span>
          </div>
        </div>
        <div className=" flex justify-between gap-1 border-b border-slate-600">
          <div className=" ">
            <span className=" text-sm font-semibold ">Stylist : </span>
            <span className=" text-sm text-gray-600 ">{appointmentData?.staff_name}</span>
          </div>
          <div className=" ">
            <span className=" text-sm font-semibold ">Manager : </span>
            <span className=" text-sm text-gray-600 ">{appointmentData?.manager_name}</span>
          </div>
        </div>
        <div className=" flex  flex-col gap-1 border-b border-slate-600">
          <div className=" ">
            <span className=" text-sm font-semibold ">Customer type : </span>
            <span className=" text-sm text-gray-600 ">
              {appointmentData?.customer_type ?? "N/A"}
            </span>
          </div>
          <div className=" flex justify-between gap-1">
            <div className=" ">
              <span className=" text-sm font-semibold ">Total amount : </span>
              <span className=" text-sm text-gray-600 ">
                {appointmentData?.final_amount ?? "-"}
              </span>
            </div>
            <div className=" ">
              <span className=" text-sm font-semibold ">Paid amount : </span>
              <span className=" text-sm text-gray-600 ">
                {appointmentData?.amount_paid ?? "-"}
              </span>
            </div>
          </div>
          <div className=" flex justify-between gap-1">
            <div className=" ">
              <span className=" text-sm font-semibold ">Payment status : </span>
              <span className=" text-sm text-gray-600 ">
                {appointmentData?.payment_status
                  ? appointmentData?.payment_status
                  : "N/A"}
              </span>
            </div>
            <div className=" ">
              <span className=" text-sm font-semibold ">Payment mode : </span>
              <span className=" text-sm text-gray-600 ">
                {appointmentData?.payment_mode
                  ? appointmentData?.payment_mode
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
        {appointmentData?.is_reviewed &&
        appointmentData.appointment_status == "completed" ? (
          <div className="alc-main-card-footer-btn">
            <button className="alc-card-thank-btn-mini">Thank You</button>
          </div>
        ) : appointmentData.appointment_status == "cancelled" ? (
          <div className="alc-main-card-footer-btn">
            <button className="alc-card-thank-btn-mini">Cancelled</button>
          </div>
        ) : appointmentData.appointment_status == "running" ? (
          <div className=" flex gap-2 justify-around">
            <button
              className=" bg-blue-900 grow text-sm rounded-lg text-white px-2 py-[6px]"
              onClick={() => {
                handleEndTimer();
              }}
            >
              End service
            </button>
            <button
              className=" bg-red-600 text-sm grow rounded-lg text-white px-2 py-1"
              onClick={() => {
                setShowCancelModal(true);
              }}
            >
              Cancel service
            </button>
          </div>
        ) : !appointmentData?.is_reviewed &&
          appointmentData.appointment_status == "completed" &&
          !appointmentData.checkout_appointment ? (
          <div className=" flex gap-2 w-full">
            <div
              className=" bg-white text-center max-w-[50%] grow py-1 px-2 text-blue-700 border border-blue-700 rounded-md cursor-pointer"
              onClick={() => {
                setShowReviewModal(true);
              }}
            >
              Review
            </div>
            <div
              className=" bg-white text-center max-w-[50%] grow py-1 px-2 text-blue-700 border border-blue-700 rounded-md"
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              Checkout
            </div>
          </div>
        ) : !appointmentData?.is_reviewed &&
          appointmentData.appointment_status == "completed" &&
          appointmentData?.checkout_appointment ? (
          <div className=" flex gap-2 w-full">
            <div
              className=" bg-white text-center max-w-[50%] grow py-1 px-2 text-blue-700 border border-blue-700 rounded-md cursor-pointer"
              onClick={() => {
                setShowReviewModal(true);
              }}
            >
              Review
            </div>
            <div
              className=" bg-white text-center max-w-[50%] grow py-1 px-2 text-blue-700 border border-blue-700 rounded-md"
            >
              Thank You
            </div>
          </div>
        ) : (
          appointmentData.appointment_status == "not_started" && (
            <div className=" flex gap-2 justify-around">
              <button
                className=" bg-green-600 grow text-sm rounded-lg text-white px-2 py-[6px]"
                // onClick={toggleDrawer(true)}
                onClick={() => {
                  handleStartTimer();
                }}
              >
                Start Service
              </button>

              <button
                className=" bg-red-600 text-sm grow rounded-lg text-white px-2 py-1"
                onClick={() => {
                  setShowCancelModal(true);
                }}
              >
                Cancel service
              </button>
            </div>
          )
        )}
      </div>

      <ToastContainer  />


      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>

      <GeneralModal
        open={showCancelModal}
        handleClose={() => setShowCancelModal(false)}
      >
        <CancelModal
          id={appointmentData?.id}
          customer={appointmentData?.customer_name}
          service={appointmentData?.service_offer_name}
          setShowCancelModal={setShowCancelModal}
          // appointmentData={appointmentData}
          setAppointmentData={setAppointmentData}
        />
      </GeneralModal>
      <GeneralModal
        open={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
      >
        <ReviewModal
          id={appointmentData?.id}
          customer={appointmentData?.customer_name}
          service={appointmentData?.service_offer_name}
          setIsReviewed={setIsReviewed}
          setShowReviewModal={setShowReviewModal}
        />
      </GeneralModal>
    </>
  );
};

export default AppointmentListCard;
