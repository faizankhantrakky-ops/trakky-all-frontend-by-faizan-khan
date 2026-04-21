import React from "react";
import "../ModalComponent/salonprofilemodal.css";
import "./offersalon.css";
import OfferSalonModal from "../ModalComponent/OfferSalonModal";
import Modal from "@mui/material/Modal";

const OfferSalon = ({
  salon,
  offerData,
  handleOfferOpen,
  handleModalClose,
  offerModalData,
  offerrModalOpen,
  mainOfferData,
  openModalType,
  setOpenModalType,
  onBookOffer
}) => {
  // Combine all offers into one array
  const allOffers = [
    ...(offerData?.map(item => ({ ...item, type: "offer" })) || []),
    ...(mainOfferData?.map(item => ({ ...item, type: "national-offer" })) || []),
  ];

  return (
    <>
      <div className="N-Profile-page-offers">

        {allOffers.map((item, index) => (
          <div
            key={index}
            className="N-Profile-page-offer-card"
            onClick={() => {
              setOpenModalType();
              handleOfferOpen(item, item.type);
            }}
          >
            <div className="N-Profile-page-offer-card-img">
              <img src={item?.image || item?.video_thumbnail_image} alt="" />
            </div>
          </div>
        ))}

      </div>

      <Modal open={offerrModalOpen}>
        <OfferSalonModal
          open={offerrModalOpen}
          data={offerModalData}
          handleClose={() => {
            handleModalClose();
          }}
          salon={salon}
          type={openModalType}
          onBookNow={onBookOffer}
        />
      </Modal>
    </>
  );
};

export default OfferSalon;