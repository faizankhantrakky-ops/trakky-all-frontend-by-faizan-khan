import React, { useState, useEffect, useRef } from "react";
import "./Gallary.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { IoMdClose } from "react-icons/io";

// Install the necessary Swiper modules
SwiperCore.use([Navigation, Autoplay]);

const Gallary = ({ salon, onClose }) => {
  const data = [salon.main_image, ...salon.mul_images.map((obj) => obj.image)];
  const swiperRef = useRef();
  const swiperRef2 = useRef();
  const [model, setModel] = useState(false);

  const getImg = (imgSrc, index) => {
    setModel(true);
    // Small delay to ensure modal is rendered before sliding
    setTimeout(() => {
      if (swiperRef2.current && swiperRef2.current.swiper) {
        swiperRef2.current.swiper.slideTo(index, 300);
      }
    }, 150);
  };

  const closeModal = () => {
    setModel(false);
  };

  // Yeh sab delete kar dena
useEffect(() => {
  if (model) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [model]);


  return (
    <>
      {/* MODAL WITH HIGH Z-INDEX */}
      <div className={model ? "gallery-modal active" : "gallery-modal"}>
        <div className="modal-backdrop" onClick={closeModal}></div>
        <div className="modal-container">
          {/* Swiper for Modal */}
          <Swiper
            ref={swiperRef2}
            loop={true}
            navigation={{
              prevEl: ".modal-prev-btn",
              nextEl: ".modal-next-btn",
            }}
            className="modal-swiper"
            allowTouchMove={true}
          >
            {data?.map((item, index) => (
              <SwiperSlide key={index} className="modal-slide">
                <div className="modal-image-wrapper">
                  <img
                    src={item}
                    alt={`Best salons slide ${index + 1}`}
                    className="modal-image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Modal Navigation Buttons */}
          <div className="modal-nav">
            <div className="modal-prev-btn">
              <svg width="30" height="30" viewBox="0 0 27 27" fill="none">
                <circle
                  cx="12.8379"
                  cy="12.8379"
                  r="12.8379"
                  transform="matrix(-1 0 0 1 26.625 0.453125)"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M15.7704 18.5407L10.0547 12.825L15.7704 7.10938L17.1152 8.45423L12.7444 12.825L17.1152 17.1958L15.7704 18.5407Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="modal-next-btn">
              <svg width="30" height="30" viewBox="0 0 27 27" fill="none">
                <circle
                  cx="13.2071"
                  cy="13.2911"
                  r="12.8379"
                  fill="white"
                  fillOpacity="0.8"
                />
                <path
                  d="M11.2238 18.5407L16.9394 12.825L11.2238 7.10938L9.87891 8.45423L14.2497 12.825L9.87891 17.1958L11.2238 18.5407Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>

          {/* Close Button */}
          <button className="modal-close" onClick={closeModal}>
            <IoMdClose size={30} />
          </button>
        </div>
      </div>

      {/* MAIN GALLERY CONTAINER */}
      <div className="Gl-image-m-container">
        <div className="Gl-salon-name-close-btnm">
          <h4>Image of {salon.name}</h4>
          <div className="Gl-close-btn-a-s">
            <IoMdClose onClick={onClose} />
          </div>
        </div>

        <div className="Gl-gallery-container">
          <div className="Gl-left-gallery">
            {data.map((item, index) => (
              <div
                className="GL-le-g-item"
                key={index}
                onClick={() => getImg(item, index)}
              >
                <img
                  src={item}
                  alt="best salon images"
                  className="GL-gallery-image-best"
                />
              </div>
            ))}
          </div>

          <div className="Gl-r-swiper-container">
            <Swiper
              ref={swiperRef}
              autoplay={{ delay: 3000 }}
              loop={true}
              navigation={{
                prevEl: ".custom-prev-button",
                nextEl: ".custom-next-button",
              }}
            >
              {data.map((item, index) => (
                <SwiperSlide key={index} className="Gl-swiper-class-slide">
                  <img
                    className="scroll-image"
                    src={item}
                    alt={`Best Salons Slide ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-prev-button">
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                <circle
                  cx="12.8379"
                  cy="12.8379"
                  r="12.8379"
                  transform="matrix(-1 0 0 1 26.625 0.453125)"
                  fill="white"
                  fillOpacity="0.6"
                />
                <path
                  d="M15.7704 18.5407L10.0547 12.825L15.7704 7.10938L17.1152 8.45423L12.7444 12.825L17.1152 17.1958L15.7704 18.5407Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="custom-next-button">
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                <circle
                  cx="13.2071"
                  cy="13.2911"
                  r="12.8379"
                  fill="white"
                  fillOpacity="0.6"
                />
                <path
                  d="M11.2238 18.5407L16.9394 12.825L11.2238 7.10938L9.87891 8.45423L14.2497 12.825L9.87891 17.1958L11.2238 18.5407Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallary;