import React from "react";
import { useState } from "react";
import "./membership.css";
import OfferSvg from "../../../../Assets/images/icons/iconamoon_discount-fill.svg";
import MemberShipModal from "../ModalComponent/MemberShipModal";
import Modal from "@mui/material/Modal";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const MemberShip = ({ salon }) => {
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState({});
  const handleModalOpen = (data) => {
    setMemberModalData(data);
    setMemberModalOpen(true);
  };

  const [membershipData, setMembershipData] = useState([]);

  const handleModalClose = () => {
    setMemberModalOpen(false);
    setMemberModalData({});
  };

  // http://127.0.0.1:8000/salons/memberships/?salon_id=62

  const getMembership = async () => {
    try {
      let response = await fetch(
        `https://backendapi.trakky.in/salons/memberships/?salon_id=${salon.id}`
      );
      if (response.ok) {
        let data = await response.json();
        setMembershipData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (salon) {
      getMembership();
    }
  }, [salon]);

  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
      >
        {membershipData?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="Membership-main-container">
              <div
                className="MS-item-container"
                onClick={() => {
                  handleModalOpen(item);
                }}
              >
                <div className="MS-item-decorator">
                  <span></span>
                  <img src={OfferSvg} alt="" />
                  <span></span>
                </div>
                <div className="MS-content">
                  <span>Buy Membership for ₹{item?.price} </span>
                  <span>
                    and get discount of {parseInt(item?.discount_percentage)}%
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Modal open={memberModalOpen}>
        <div>
          <MemberShipModal
            data={memberModalData}
            handleClose={() => {
              handleModalClose();
            }}
            salon={salon}
          />
        </div>
      </Modal>
    </>
  );
};

export default MemberShip;
