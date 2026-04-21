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

const Gallary = ({ spa, onClose }) => {
  const data = [spa?.main_image, ...spa?.mul_images.map((obj) => obj.image)];
  const swiperRef = useRef();
  const swiperRef2 = useRef();
  const [model, setModel] = useState(false);
  const [tempimgSrc, setTempimgSrc] = useState("");

  const getImg = (imgSrc , index) => {
    // setTempimgSrc(imgSrc);
    setModel(true);

    swiperRef2.current.swiper.slideTo(index);
  }; 

  return (
    <>
      <div className={model ? "model open" : "model"}>
        {/* <img src={tempimgSrc} alt="spa image" /> */}
        <IoMdClose className=" cursor-pointer" onClick={() => setModel(false)} />
 {/* <img src={tempimgSrc} alt="" /> */}
 <Swiper
          ref={swiperRef2}
          // autoplay={{ delay: 3000 }}
          loop={true}
          navigation={{
            prevEl: ".custom-prev-button",
            nextEl: ".custom-next-button",
          }}
          className=" flex !items-center !h-full"
          // onSlideChange={() => setModel(false)}
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index} className="Gl-swiper-class-slide !flex !items-center !h-full">
              <img
                className="scroll-image"
                key={index}
                src={item}
                alt={`Image ${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <IoMdClose onClick={() => setModel(false)} className=" z-50"/>
      </div>
      <div className="Gl-image-m-container">
        <div className="Gl-spa-name-close-btnm">
          <h4>Image of {spa?.name}</h4>
          <div className="Gl-close-btn-a-s cursor-pointer">
            <IoMdClose onClick={onClose} />
          </div>
        </div>

        <div className="Gl-gallery-container">
          <div className="Gl-left-gallery">
            {data.map((item, index) => (
              <div
                className="GL-le-g-item"
                key={index}
                onClick={() => getImg(item , index)}
              >
                <img
                 className="GL-gallery-image-best"
                  src={item}
                  alt="spa image"
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
              // onSlideChange={() => setModel(false)}
            >
              {data.map((item, index) => (
                <SwiperSlide key={index} className="Gl-swiper-class-slide">
                  <img
                    className="scroll-image"
                    key={index}
                    src={item}
                    alt={`Image ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-prev-button">
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12.8379"
                  cy="12.8379"
                  r="12.8379"
                  transform="matrix(-1 0 0 1 26.625 0.453125)"
                  fill="white"
                  fill-opacity="0.6"
                />
                <path
                  d="M15.7704 18.5407L10.0547 12.825L15.7704 7.10938L17.1152 8.45423L12.7444 12.825L17.1152 17.1958L15.7704 18.5407Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="custom-next-button">
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="13.2071"
                  cy="13.2911"
                  r="12.8379"
                  fill="white"
                  fill-opacity="0.6"
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
