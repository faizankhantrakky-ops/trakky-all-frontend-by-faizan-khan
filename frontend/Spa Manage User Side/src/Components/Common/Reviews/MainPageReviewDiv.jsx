import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// import 'swiper/css/navigation';
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import MainPageReivew from "./MainPageReivew";
const MainPageReviewDiv = () => {
  const [swiper, setSwiper] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);
  const get_reviews = async () => {
    let res = await fetch("https://backendapi.trakky.in/spas/review/", {
      method: "GET",
      "content-type": "application/json",
    });
    let data = await res.json();
    setReviews(data);
  };
  React.useEffect(() => {
    get_reviews();
  }, []);

  const handleSlideChangeTransitionEnd = () => {
    if (swiper) {
      swiper.autoplay.start();
    }
  };

  return (
    <Swiper
      pagination={{ clickable: true }}
      rewind={false}
      slidesPerView={1}
      autoplay={true}
      onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
      onSwiper={setSwiper}
    >
      {reviews.map((review , index) => {
        return (
          <SwiperSlide key={index} >
            <MainPageReivew review={review} />
          </SwiperSlide>
        );
      })}
      {/* <SwiperSlide>
      <MainPageReivew /></SwiperSlide>
      <SwiperSlide>
      <MainPageReivew/></SwiperSlide> */}
    </Swiper>
  );
};

export default MainPageReviewDiv;
