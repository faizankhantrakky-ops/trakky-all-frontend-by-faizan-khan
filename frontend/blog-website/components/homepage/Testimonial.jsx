import React, { useState, useEffect } from "react";

import style from "../../styles/testimonial.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Testimonial = () => {
  const [swiper, setSwiper] = useState(null);

  // auto slide

  useEffect(() => {
   if (swiper && swiper !== null) {
      const interval = setInterval(() => {
        swiper?.slideNext();
      }, 2500);

      return () => {
        clearInterval(interval);
      };
    }
  }
  , [swiper]);

  return (
    <div className={style.testimonialDiv}>
      <div className={style.addCommentDIv}>
        <h2> Comments</h2>
        <div className={style.addComment}>
          <input type="text" name="" id="" placeholder="Write a comment..." />
          <button className={style.commentBtn}>SUBMIT</button>
        </div>
      </div>
        <Swiper slidesPerView={"auto"} className={style.userReview} onSwiper={(swiper) => setSwiper(swiper)}
        // spaceBetween={20}
        >
          {[0, 0, 0, 0, 0, 0,0, 0].map((item, index) => (
            <SwiperSlide key={index} className={`${style.reviewCard}`}>

            <div className={style.cardUser}>
              <img src="./Rectangle 2260.png" alt="" />
            </div>
            <div className={style.cardReview}>
              <div className={style.cardName}>Gaurang Khambhaliya</div>
              {/* logic to max character */}
              <div className={style.cardReviewText}>Lorem ipsum, Lorem ipsum, dolor sit amet consectetursssssssssssssssssssssssssssssss adipisicing elit. Temporibus, consectetur? Ipsam itaque reiciendis odit! dolor sit amet consectetur adipisicing elit. Eum ex id atque.</div>
              <div className={style.cardDate}>18 august 2019  &nbsp; 4:32 am</div>
            </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
};

export default Testimonial;
