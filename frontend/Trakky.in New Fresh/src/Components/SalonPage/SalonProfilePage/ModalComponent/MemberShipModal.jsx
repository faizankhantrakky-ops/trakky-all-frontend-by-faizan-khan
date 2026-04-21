import React from "react";
import "./salonprofilemodal.css";
import salon_logo from "./../../../../Assets/images/logos/Trakky logo purple.png";
import { Close } from "@mui/icons-material";

const MemberShipModal = ({ data, handleClose, salon }) => {
  const handleBookNowBtn = () => {
    if (!salon?.name) {
      return;
    }

    let link = "";

    if (data?.whole_service) {
      let message = `Can you provide more details about the membership at ${salon?.name} in ${salon?.area}, ${salon?.city}? It comes with a discounted price of ${data?.price} rupees and includes all services.`;
      link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
        message
      )}`;
    } else {
      let message = `Can you provide more details about the membership at ${salon?.name} in ${salon?.area}, ${salon?.city}? It comes with a discounted price of ${data?.price} rupees and includes services like ${data?.service_data
        .map((item) => item?.service_name)
        .join(", ")}.`;
      link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
        message
      )}`;
    }

    window.open(link, "_blank");
  };

  return (
    <>
      <div className="Membership-Modal-main-container">
        <div className="MSM-details">
          {/* Header with Title and Close Icon (X) on the right */}
          <div className="MSM-Title-header flex items-center justify-between">
            <span className="membership-title">Membership Details</span>
            <button
              type="button"
              onClick={handleClose}
              className="membership-close-icon"
              aria-label="Close modal"
            >
              {/* X */}
              <Close/>
            </button>
          </div>

          <div className="MSM-trakky-x-salon">
            <img src={salon_logo} alt="Trakky logo" />
            <span>X</span>
            <span>{salon?.name}</span>
          </div>

          <div className="MSM-membership-meta-info">
            <div className="MSM-m-m-info-offer">
              <h4>Buy Membership for ₹{data?.price}</h4>
              <h3>
                and get discount of {parseInt(data?.discount_percentage)}%
              </h3>
            </div>
            <div className="MSM-m-m-btn">
              <div>Show All Membership</div>
              <button onClick={handleBookNowBtn}>BUY MEMBERSHIP</button>
            </div>
          </div>

          <div className="MSM-membership-desc">
            <h2 className="font-semibold text-center text-[18px] mb-2 mt-0">
              Terms & conditions
            </h2>
            {data?.whole_service ? (
              <ul>
                <li>Get all services</li>
              </ul>
            ) : (
              <ul>
                {data?.service_data?.map((item, index) => (
                  <li key={index}>
                    <span></span>
                    {item?.service_name} included
                  </li>
                ))}
              </ul>
            )}
            <div
              dangerouslySetInnerHTML={{
                __html: data?.term_and_conditions,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberShipModal;