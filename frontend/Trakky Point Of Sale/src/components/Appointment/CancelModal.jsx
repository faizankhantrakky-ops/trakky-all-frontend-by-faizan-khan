import React, { useState, useContext } from "react";
import "./allModal.css";
import { Tooltip } from "@mui/material";
import AuthContext from "../../Context/Auth";
import toast from "react-hot-toast";
import ErrorIcon from "@mui/icons-material/Error";
import { ToastContainer } from "react-toastify";

const CancelModal = ({
  id,
  customer,
  service,
  setShowCancelModal,
  setAppointmentData,
}) => {
  const { authTokens } = useContext(AuthContext);

  const [reason, setReason] = useState("");
  const [validation, setValidation] = useState({
    reason: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasError = Object.values(validation).some((v) => v === true);
    if (hasError) {
      return;
    }
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/appointments/cancelled/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            appointment: id,
            reason: reason,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Appointment Cancelled Successfully");
        setAppointmentData((prevData) => ({
          ...prevData,
          appointment_status: "cancelled",
        }));

        setShowCancelModal(false);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="rm-container">
          <h2 className="rm-title"> Cancel Appointment </h2>

          <div className="row">
            <div className="appoint-input-field">
              <Tooltip title="Customer Name" placement="top" arrow>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customer}
                  readOnly
                />
              </Tooltip>
            </div>
          </div>

          <div className="row">
            <div className="appoint-input-field" id="rm-textarea-container">
              <textarea
                type="text"
                required
                style={{
                  border: validation.reason ? "1.5px solid red" : "",
                }}
                onBlur={() => {
                  if (reason === "") {
                    setValidation({ ...validation, reason: true });
                  } else {
                    setValidation({ ...validation, reason: false });
                  }
                }}
                placeholder="Mention Your Reason.."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
              {validation.reason && (
                <Tooltip title="Reason is Required" placement="top" arrow>
                  <ErrorIcon
                    className="error-icon absolute right-[5px] bottom-[10px]"
                    color="error"
                  />
                </Tooltip>
              )}
            </div>
          </div>

          <div className="row" id="rm-btn-container">
            <button className="rm-btn">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CancelModal;
