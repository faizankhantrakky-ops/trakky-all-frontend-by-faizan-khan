import React, { useState, useEffect } from "react";
import "./membership.css";
import Packages_svg from "./../../../Assets/images/icons/Packages_svg.svg";
import Modal from "@mui/material/Modal";
import MemberShipModal from "../ModalComponent/MembershipModal";

const MembershipComponent = ({ spa, setSectionHasData }) => {
  const [visibleMembership, setVisibleMembership] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [membershipData, setMembershipData] = useState([]);
  const [selectedMembershipData, setSelectedMembershipData] = useState(null);
  const [membLoading, setMembLoading] = useState(true);

  const [openMembershipModal, setOpenMembershipModal] = useState(false);
  const handleMembershipModalOpen = () => {
    setOpenMembershipModal(true);
  };
  const handleMembershipModalClose = () => {
    setOpenMembershipModal(false);
  };

  const getMembershipData = async (spaId) => {
    setMembLoading(true);

    let url = `https://backendapi.trakky.in/spas/member-ship/?spa=${spaId}`;

    try {
      let response = await fetch(url);
      let data = await response.json();
      setMembershipData(data);
      setMembLoading(false);
      if (data.length > 0) {
        setSectionHasData((prevState) => ({
          ...prevState,
          membershipSection: true,
        }));
      } else {
        setSectionHasData((prevState) => ({
          ...prevState,
          membershipSection: false,
        }));
      }
    } catch (error) {
      console.log("Error", error);
      setMembLoading(false);
      if (membershipData?.length > 0) {
        setSectionHasData((prevState) => ({
          ...prevState,
          membershipSection: true,
        }));
      } else {
        setSectionHasData((prevState) => ({
          ...prevState,
          membershipSection: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (spa) {
      getMembershipData(spa?.id);
    }
    setVisibleMembership(3);
  }, [spa]);

  useEffect(() => {
    if (isExpanded) {
      setVisibleMembership(membershipData?.length);
    } else {
      setVisibleMembership(3);
    }
  }, [isExpanded]);

  const handleBookNowBtn = (membershipData) => {
    if (!spa?.name) {
      return;
    }

    let serviceList = Object.keys(membershipData?.service_included_names)
      .map((key, index) => {
        return membershipData?.service_included_names[key];
      })
      .join(", ");

    let message = `Can you provide more details about the Membership named '${membershipData?.package_name}' at ${spa?.name} in ${spa?.area}, ${spa?.city}? It comes with a discounted price of ${membershipData?.discount_price} rupees and included ${membershipData?.service_included?.length} service (${serviceList}).`;

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;

    window.open(link, "_blank");
  };

  const formateTime = (time) => {
    let str = "";

    if (time?.days && time?.days != 0) {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating != 0) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours != 0) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes != 0) {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  const toggleMembershipVisibility = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      {membershipData?.length > 0 && (
        <>
          <div className="GP-list-container">
            {membershipData?.slice(0, visibleMembership).map((item, index) => {
              return (
                <div className="GP-list-item">
                  <div className="GP-package-image">
                    <img src={Packages_svg} alt="package" /> PACKAGE
                  </div>
                  <div className="GP-package-name-book">
                    <h2>{item?.package_name}</h2>
                    <button
                      onClick={() => {
                        handleBookNowBtn(item);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                  <div className="GP-package-price-time">
                    <span>₹{parseInt(item?.discount_price)}</span>
                    <span className=" pl-[6px] text-gray-500 flex text-[15px]">
                      ₹
                      <del>
                        <span>{parseInt(item?.actual_price)}</span>
                      </del>
                    </span>
                    <span>●</span>
                    <span>{formateTime(item?.package_time)}</span>
                  </div>
                  <div className="GP-package-service-inc">
                    <ul>
                      {Object.keys(item?.service_included_names).map(
                        (key, index) => {
                          return <li>{item?.service_included_names[key]}</li>;
                        }
                      )}
                    </ul>
                  </div>
                  <div
                    className="GP-package-show-details"
                    onClick={() => {
                      setSelectedMembershipData(item);
                      handleMembershipModalOpen();
                    }}
                  >
                    Show Details
                  </div>
                </div>
              );
            })}
          </div>
          {(membershipData?.length > visibleMembership || isExpanded) && (
            <div
              className="GP-show-all-p-btn"
              onClick={() => toggleMembershipVisibility()}
            >
              {isExpanded ? "See less" : "See all membership"}
            </div>
          )}
        </>
      )}
      <Modal open={openMembershipModal}>
        <MemberShipModal
          data={selectedMembershipData}
          handleClose={() => {
            handleMembershipModalClose();
          }}
        />
      </Modal>
    </>
  );
};

export default MembershipComponent;
