import React, { useRef, useEffect } from "react";
import "./salonprofilemodal.css";

const SalonTimingModal = ({ salon, handleSalonTimingClose }) => {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleSalonTimingClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleSalonTimingClose]);

  const formateTime = (time) => {
    if (!time) return "Closed";

    let [hour, minute, second] = time.split(":");
    let formatedTime = "";

    if (parseInt(hour) > 12) {
      formatedTime = `${parseInt(hour) - 12}:${minute} PM`;
    } else {
      formatedTime = `${parseInt(hour)}:${minute} AM`;
    }
    if (parseInt(hour) === 12) {
      formatedTime = `${hour}:${minute} PM`;
    }
    if (parseInt(hour) === 0) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(hour) === 24) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(minute) === 0) {
      formatedTime = parseInt(hour) > 12
        ? `${parseInt(hour) - 12} PM`
        : parseInt(hour) === 0
          ? `12 AM`
          : `${parseInt(hour)} AM`;
    }

    return formatedTime;
  };

  const days = [
    { name: "Monday", key: "monday" },
    { name: "Tuesday", key: "tuesday" },
    { name: "Wednesday", key: "wednesday" },
    { name: "Thursday", key: "thursday" },
    { name: "Friday", key: "friday" },
    { name: "Saturday", key: "saturday" },
    { name: "Sunday", key: "sunday" }
  ];

  return (
    <div className="salon-timing-modal-container">
      <div className="salon-timing-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Opening Hours</h2>
          <button
            className="close-btn"
            onClick={handleSalonTimingClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="timing-grid">
          {days.map((day) => {
            const timing = salon?.salon_timings?.[day.key];
            const isClosed = !timing?.open_time;

            return (
              <React.Fragment key={day.key}>
                <div className="day-name">{day.name}</div>
                <div className={`day-time ${isClosed ? "closed" : ""}`}>
                  {isClosed
                    ? "Closed"
                    : `${formateTime(timing.open_time)} - ${formateTime(timing.close_time)}`
                  }
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalonTimingModal;