import React from "react";
import "./Review.css";
import comma from "../../Assets/images/contactus/comma_review.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Review() {
  const items = [
    {
      review:
        "The best salon-supporting brand we ever had for our business expansion. Thanks, Trakky for offering our salon the best support 24x7. The Trakky team and marketing team are among the best in the business. It is recommended that all salon owners give this brand a try at least once.",
      name: "Ajay Mashiyava",
    },
    {
      review:
        "Best platform to get more clients for salon & spa now. We are getting 4-5 clients everyday. Thanks alot Trakky",
      name: "THE MOON SALON AND SPA",
    },
    {
      review:
        "Time saver App.All the functions and coupons are worth it.Great experience and I would love to use regularly.",
      name: "Aesha Soni",
    },
  ];

  return (
    <div className="Vendor_review_main">
      <div className="Vendor_review_heading">Our Happy partners</div>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        spaceBetween={50}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {items.map((item, index) => {
          return (
            <>
              <SwiperSlide key={index}>
                <div className="Vendor_review_slide">
                  <img src={comma} alt="" className="Vendor_review_comma" />
                  <div className="Vendor_review_reviews">
                    <p className="Vendor_review_review">{item.review}</p>
                  </div>
                  <div className="Vendor_review_name">
                    <p className="Vendor_review_owner_name">{item.name}</p>
                  </div>
                </div>
              </SwiperSlide>
            </>
          );
        })}
      </Swiper>
    </div>
  );
}

export default Review;
