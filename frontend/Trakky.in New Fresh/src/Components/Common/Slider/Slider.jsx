import React, { useRef, useState, useEffect } from "react";
import SalonCard, {
  OfferCard,
  NationalOfferCard,
  CategoryCard,
  SalonProfile,
  SalonRoom,
  ImageCard,
  ReviewCard,
  NationalCategoryCard,
} from "../../MainPage/Cards/Cards";

import {
  SalonServicesSkeleton,
  OfferSkeleton,
  CardSkeleton,
} from "../cardSkeleton/CardSkeleton";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./Slider.css";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import SwiperCore, { Pagination, Autoplay } from "swiper";

const Slider = (props) => {
  // using autoplay feature
  SwiperCore.use([Autoplay]);

  // for without autoplay slider
  const [width, setWidth] = useState(0);
  const carousel = useRef();
  // useEffect(() => {
  //   setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  // }, []);

  let card; // card contains the type of card to be fetched
  const sliderType = props._name;
  // deciding the type of card
  if (sliderType === "salon") {
    card = <SalonCard />;
  } else if (sliderType === "offer") {
    card = <OfferCard />;
  } else if (sliderType == "nationaloffer") {
    card = <NationalOfferCard />;
  } else if (sliderType === "nationalcategory") {
    card = <NationalCategoryCard />;
  }
  else if (sliderType === "category") {
    card = <CategoryCard />;
  } else if (sliderType === "salonProfile") {
    card = <SalonProfile />;
  } else if (sliderType === "salonRooms") {
    card = <SalonRoom />;
  } else if (sliderType === "salonImages") {
    card = <ImageCard />;
  } else if (sliderType === "salonReviews") {
    card = <ReviewCard />;
  }

  let loaderSkeleton; 
  if (sliderType === "offer") {
    loaderSkeleton = <OfferSkeleton />;
  } else if (sliderType === "category") {
    loaderSkeleton = <SalonServicesSkeleton />;
  } else if (sliderType === "salon") {
    loaderSkeleton = <CardSkeleton />;
  }

  // including styles
  const styles = {
    slider__inner_container: {
      display: "flex",
      transition: ".5s",
    },
    slider__container: {
      overflow: "hidden",
    },
    __card: {
      padding: props.isprofile ? "0.7rem 0" : `1rem 0.5rem`,
    },

    slideIn: {
      display: "none",
    },
  };

  // for autoplay slider: only when present on viewport.
  const [isIntersecting, setIsIntersecting] = useState(true);
  const ref = useRef(null);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       setIsIntersecting(entry.isIntersecting);
  //     },
  //     { rootMargin: "-100px" }
  //   );
  //   observer.observe(ref.current);

  //   return () => observer.disconnect();
  // }, []);

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (isIntersecting) {
      ref.current.querySelectorAll("div").forEach((el) => {
        el.classList.remove("slideIn");
      });
    }
  }, [isIntersecting]);
  return (
    <div
      className="slider__container"
      ref={ref}
      style={styles.slider__container}
    >
     { props?.heading && 
      <div className="slider__header">
        {/* <h2>{props.heading}</h2> */}
        {
        props?.isMainHeading ? <h1>{props.heading}</h1> : <h2>{props.heading}</h2>
      }
        {props.subheading && (
          <>
            <div></div>
            <p>{props.subheading}</p>
          </>
        )}
        {props.navigatelink && (
          <div className="slider_buttons">
            {props.moreBtn !== false &&
              (props.moreBtn || <Link to={props.navigatelink}>More</Link>)}
            <span
              className="slider-left-icon"
              onClick={() => swiper && swiper.slidePrev()}
            >
              <KeyboardArrowLeftIcon />
            </span>
            <span
              className="slider-right-icon"
              onClick={() => swiper && swiper.slideNext()}
            >
              <KeyboardArrowRightIcon />
            </span>
          </div>
        )}
      </div>}
      {/* if component is intersecting then render autoplay else render without autoplay. */}
      {isIntersecting ? (
        <div>
          <Swiper
            onSwiper={(swiper) => setSwiper(swiper)}
            className="slider__inner-container mySwiper "
            style={styles.slider__inner_container}
            autoplay={{
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              delay: 1500,
              stopOnLastSlide: true,
            }}
            slidesPerView={"auto"}
            modules={[Autoplay, Pagination]}
            navigation={true}
          >
            {props.cardList.map((data, index) => {
              return (
                <SwiperSlide
                  className={`${
                    props.isprofile == true ? "swiper-slide-bw" : ""
                  } __card`}
                  style={styles.__card}
                  key={index}
                >
                  <div>
                    {React.cloneElement(card, {
                      cardData: data,
                      isprofile: props.isprofile,
                    })}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        // <motion.div
        //   className="slider__container"
        //   style={styles.slider__container}
        // >
        //   <motion.div
        //     drag="x"
        //     dragConstraints={{ right: 0, left: -width }}
        //     ref={carousel}
        //     className="slider__inner-container"
        //     style={styles.slider__inner_container}
        //   >
        //     {props.cardList.map((data, index) => {
        //       return (
        //         <motion.div
        //           className="__card"
        //           style={styles.__card}
        //           key={index}
        //         >
        //           <React.Fragment>
        //             {React.cloneElement(card, { cardData: data })}
        //           </React.Fragment>
        //         </motion.div>
        //       );
        //     })}
        //   </motion.div>
        // </motion.div>
        <></>
      )}
    </div>
  );
};
export default Slider;
