import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// importing other stuff
import "./Main.css";
import axios from "axios";
// importing components
import Hero from "./Hero/Hero";
import Slider from "../Common/Slider/Slider";
import Footer from "../Common/Footer/Footer";
// import Reviews from "../Common/Reviews/Reviews";
import MainPageReviewDiv from "../Common/Reviews/MainPageReviewDiv";

import PopularArea from "./PopularArea/PopularArea";
import TopSalonOfArea from "../Common/topsalon/TopSalonOfArea";
import WhatsappButton from "../Common/whatsapp/WhatsappButton";
import FAQ from "../Faq/FAQ";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalonsByCategoryAsync } from "../../Store/salonSlices.js";

// spinner
// import DotLoader from "react-spinners/DotLoader";

import {
  SalonServicesSkeleton,
  OfferSkeleton,
  CardSkeleton,
} from "../Common/cardSkeleton/CardSkeleton";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";

import {
  capitalizeAndFormat,
  getNearByCoordinates,
} from "../functions/generalFun";
import { fetchCategories } from "../../Store/categorySlice";
import { fetchOffer } from "../../Store/offerSlice";
import { fetchNearBySalons } from "../../Store/nearbySlice";
import { Skeleton } from "@mui/material";

// import the intersection obserfor the lazy loading
import { useInView } from "react-intersection-observer";

// window dimensions
function getWindowDimensions() {
  const width = window.innerWidth,
    height = window.innerHeight;
  return { width, height };
}

function useComponentInView() {
  const [ref, inView] = useInView({
    rootMargin: "100px",
    threshold: 0,
    triggerOnce: true,
  });

  return [ref, inView];
}

// import of redux

const Home = () => {
  // references for the different sections of the page for lazy loading

  const [categoryRef, isCategoryInView] = useComponentInView();
  const [nearByRef, isNearByInView] = useComponentInView();
  const [topRatedRef, isTopRatedInView] = useComponentInView();
  const [bridalRef, isBridalInView] = useComponentInView();
  const [unisexRef, isUnisexInView] = useComponentInView();
  const [kidsRef, isKidsInView] = useComponentInView();
  const [femaleBeautyRef, isFemaleBeautyInView] = useComponentInView();
  const [maleSalonsRef, isMaleSalonsInView] = useComponentInView();
  const [academyRef, isAcademyInView] = useComponentInView();
  const [makeupRef, isMakeupInView] = useComponentInView();
  const [offersRef, isOffersInView] = useComponentInView();
  const [reviewsRef, isReviewsInView] = useComponentInView();

  const params = useParams();

  const dispatch = useDispatch();

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [reviews, setReviews] = useState([]);

  const topRatedSalonsState = useSelector((state) => state.topRatedSalons);
  const unisexSalonsState = useSelector((state) => state.unisexSalons);
  const bridalSalonsState = useSelector((state) => state.bridalSalons);
  const kidsSalonsState = useSelector((state) => state.kidsSalons);
  const femaleBeautySalonsState = useSelector(
    (state) => state.femaleBeautySalons
  );
  const academySalonsState = useSelector((state) => state.academySalons);
  const makeupSalonsState = useSelector((state) => state.makeupSalons);
  const maleSalonsState = useSelector((state) => state.maleSalons);
  const categoryState = useSelector((state) => state.categories);
  const offersState = useSelector((state) => state.offers);
  const nearBySalonsState = useSelector((state) => state.nearBySalons);

  // top destinations
  const [topSalonOfPopularArea, setTopSalonOfPopularArea] = useState([]);

  // meta title and description
  useEffect(() => {
    document.title = `List Of Best Salons In ${
      params.city.charAt(0).toUpperCase() + params.city.slice(1)
    } - Trakky `;
    document
      .querySelector('meta[name="description"]')
      .setAttribute(
        "content",
        ` Checkout the list of Best Salons in ${
          capitalizeAndFormat(params.city) || "India"
        }, where you can get amazing DISCOUNTS and DEALS. Click to see the list of Top Salons In ${
          capitalizeAndFormat(params.city) || "India"
        }. `
      );
  }, [params.city]);

  // Getting Reviews
  const getReviews = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/review/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => console.log(err));
  };

  const getNearBySalonData = async () => {
    let latLong = await getNearByCoordinates(
      capitalizeAndFormat(params?.city).toLowerCase() || "ahmedabad"
    );

    if (
      nearBySalonsState?.data?.length == 0 ||
      nearBySalonsState?.data == null ||
      nearBySalonsState?.latitude !== latLong.latitude ||
      nearBySalonsState?.longitude !== latLong.longitude
    ) {
      dispatch(
        fetchNearBySalons({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: 1,
        })
      );
    }
  };

  useEffect(() => {
    if (
      isCategoryInView &&
      (categoryState?.city == null ||
        categoryState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(fetchCategories({ city: params.city }));
    }
  }, [isCategoryInView, params.city, dispatch]);

  useEffect(() => {
    if (
      (isNearByInView &&
        (nearBySalonsState?.data?.length == 0 ||
          nearBySalonsState?.data == null)) ||
      nearBySalonsState?.preferableCity?.toLowerCase() !==
        params?.city.toLowerCase()
    ) {
      getNearBySalonData();
    }
  }, [params?.city, isNearByInView]);

  useEffect(() => {
    if (isReviewsInView) {
      getReviews();
    }
  }, [isReviewsInView, params.city, params.area]);

  useEffect(() => {
    if (
      isOffersInView &&
      (offersState?.city == null ||
        offersState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(fetchOffer({ city: params.city }));
    }
  }, [isOffersInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isTopRatedInView &&
      (topRatedSalonsState?.city == null ||
        topRatedSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "topRated",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isTopRatedInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isUnisexInView &&
      (unisexSalonsState?.city == null ||
        unisexSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "unisex",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isUnisexInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isBridalInView &&
      (bridalSalonsState?.city == null ||
        bridalSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "bridal",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isBridalInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isKidsInView &&
      (kidsSalonsState?.city == null ||
        kidsSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "kids",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isKidsInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isFemaleBeautyInView &&
      (femaleBeautySalonsState?.city == null ||
        femaleBeautySalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "femaleBeauty",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isFemaleBeautyInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isAcademyInView &&
      (academySalonsState?.city == null ||
        academySalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "academy",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isAcademyInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isMakeupInView &&
      (makeupSalonsState?.city == null ||
        makeupSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "makeup",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isMakeupInView, params.city, dispatch]);

  useEffect(() => {
    if (
      isMaleSalonsInView &&
      (maleSalonsState?.city == null ||
        maleSalonsState.city.toLowerCase() != params.city.toLowerCase())
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "male",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [isMaleSalonsInView, params.city, dispatch]);

  const getlinks = (list) => {
    if (params.city && params.area) {
      return `/${encodeURIComponent(
        params.city.toLowerCase()
      )}/${encodeURIComponent(params.area.toLowerCase())}/${list}`;
    }
    if (params.city) {
      return `/${encodeURIComponent(params.city.toLowerCase())}/${list}`;
    }
    return `/${list}`;
  };

  useEffect(() => {
    if (params.city) {
      fetch(
        `https://backendapi.trakky.in/salons/topsalonbycityarea/?city=${params.city}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setTopSalonOfPopularArea(data[0]?.areas);
        })
        .catch((err) => console.log(err));
    }
  }, [params.city]);

  return (
    <div className="main__container">
      <WhatsappButton />
      <Hero />

      {/* Category Starts------------------- */}
      <div
        ref={categoryRef}
        className="category__container my-container"
        id="categories"
      >
        {categoryState?.loading ? (
          <div className="slider__outer-container">
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Salon Services In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="slider__inner-container "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
              style={{
                marginBlock: "20px 30px",
              }}
            >
              {[0, 0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide
                    className={`__card`}
                    key={index}
                    style={{
                      marginInline: "10px",
                      padding: "0",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={140}
                      height={140}
                      style={{
                        borderRadius: "80px",
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          categoryState?.data?.length > 0 && (
            <div
              className="slider__outer-container"
              style={{
                padding: "0px 0px 0px 0px",
              }}
            >
              <Slider
                cardList={categoryState?.data || []}
                _name={"category"}
                heading={`Salon Services In ${
                  params.city ? capitalizeAndFormat(params.city) : "India"
                }`}
                isMainHeading={true}
                subheading={`Best-Selling Salon Services For ${
                  params.city ? capitalizeAndFormat(params.city) : "You"
                }`}
              />
            </div>
          )
        )}
      </div>
      {/* Category Ends */}
      {/* Offer Starts------------------- */}

      <div ref={offersRef} className="slider__outer-container my-container">
        {offersState?.loading ? (
          <div className="">
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              Checkout The Best Deals & Offers
            </div>
            <Swiper
              className="slider__inner-container "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
              style={{
                marginBlock: "20px 30px",
              }}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide
                    className={`__card `}
                    key={index}
                    style={{
                      marginInline: "10px",
                      padding: "0",
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={240}
                      height={300}
                      style={{
                        borderRadius: "10px",
                      }}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          offersState?.data.length > 0 && (
            <div
              className="slider__outer-container offer__container"
              style={{
                padding: "0px 0px 0px 0px",
              }}
              id="offers"
            >
              <Slider
                cardList={offersState?.data || []}
                _name={"offer"}
                heading={"Checkout The Best Deals & Offers"}
              />
            </div>
          )
        )}
      </div>

      {/* Offer Ends */}

      {/* Salon Near You Starts------------------- */}
      <div ref={nearByRef} className="slider__outer-container my-container">
        {/* Salon Near You <----> Top Rated Salons <----> Error in getting IP of user */}

        {nearBySalonsState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Salons Near You
            </div>
            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          nearBySalonsState?.data.length > 0 && (
            <Slider
              cardList={nearBySalonsState?.data || []}
              _name={"salon"}
              heading={`Salon Near you`}
              navigatelink={getlinks("nearby")}
            />
          )
        )}
      </div>
      {/* Salon Near You Ends */}

      {/* Top Destinations Starts-------------------------- */}
      {topSalonOfPopularArea && topSalonOfPopularArea?.length > 0 ? (
        <TopSalonOfArea topSalonOfPopularArea={topSalonOfPopularArea} />
      ) : null}

      {/* Top Destinations Ends */}
      {/* Top Rated Salon Starts --------------------------------------*/}
      <div ref={topRatedRef} className="slider__outer-container my-container">
        {topRatedSalonsState?.loading ? (
          <>
            {/* for title */}
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Top Rated Salons In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="loading-heading"
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          topRatedSalonsState?.data?.length > 0 && (
            <Slider
              cardList={topRatedSalonsState?.data}
              _name={"salon"}
              heading={`Top Rated Salon ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("topratedsalons")}
            />
          )
        )}
      </div>
      {/* Top Rated Salon Ends */}

      <div className="explore">
        <p id="quotes">“Find the perfect Salon Service for your needs.”</p>
      </div>

      {/* Bridal Salon Starts --------------------------------------*/}
      <div ref={bridalRef} className="slider__outer-container my-container">
        {bridalSalonsState?.loading ? (
          <>
            {/* for title */}
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Bridal Salons In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          bridalSalonsState?.data?.length > 0 && (
            <Slider
              cardList={bridalSalonsState?.data}
              _name={"salon"}
              heading={`Bridal Salons ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("bridalsalons")}
            />
          )
        )}
      </div>
      {/* Bridal Salon Ends */}

      {/* Unisex Salon Starts --------------------------------------*/}
      <div ref={unisexRef} className="slider__outer-container my-container">
        {unisexSalonsState?.loading ? (
          <>
            {/* for title */}
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Unisex Salons In {capitalizeAndFormat(params.city)}
            </div>

            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          unisexSalonsState?.data?.length > 0 && (
            <Slider
              cardList={unisexSalonsState?.data}
              _name={"salon"}
              heading={`Unisex Salons ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("unisexsalons")}
            />
          )
        )}
      </div>
      {/* Unisex Salon Ends */}

      {/* Kids Special Salon Starts --------------------------------------*/}
      <div ref={kidsRef} className="slider__outer-container my-container">
        {kidsSalonsState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Kids Special Salons In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          kidsSalonsState?.data?.length > 0 && (
            <Slider
              cardList={kidsSalonsState?.data}
              _name={"salon"}
              heading={`Kids Special Salons ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("kidsspecialsalons")}
            />
          )
        )}
      </div>
      {/* Kids Salon Ends */}

      {/* Female Salon Starts --------------------------------------*/}
      <div
        ref={femaleBeautyRef}
        className="slider__outer-container my-container"
      >
        {femaleBeautySalonsState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Female Beauty Parlour In {capitalizeAndFormat(params.city)}
            </div>

            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          femaleBeautySalonsState?.data?.length > 0 && (
            <Slider
              cardList={femaleBeautySalonsState?.data}
              _name={"salon"}
              heading={`Female Beauty Parlour
            ${
              params.city
                ? "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
                : ""
            }`}
              navigatelink={getlinks("femalebeautyparlour")}
            />
          )
        )}
      </div>
      {/* Female Salon Ends */}

      {/* Male Salon Starts --------------------------------------*/}
      <div ref={maleSalonsRef} className="slider__outer-container my-container">
        {maleSalonsState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{ margin: "30px 0px 0px 10px" }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Male Salons In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="loading-heading"
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          maleSalonsState?.data?.length > 0 && (
            <Slider
              cardList={maleSalonsState?.data || []}
              _name={"salon"}
              heading={`Male Salons ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("malesalons")}
            />
          )
        )}
      </div>
      {/* Male Salon Ends */}

      {/* academy salons start */}
      <div ref={academyRef} className="slider__outer-container my-container">
        {academySalonsState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Popular Salon Academy In {capitalizeAndFormat(params.city)}
            </div>

            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          academySalonsState?.data?.length > 0 && (
            <Slider
              cardList={academySalonsState?.data}
              _name={"salon"}
              heading={`Popular Salon Academy ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("academysalons")}
            />
          )
        )}
      </div>
      {/* makeup salon starts */}
      <div ref={makeupRef} className="slider__outer-container my-container">
        {makeupSalonsState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Makeup Salons In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="slider__inner-container mySwiper "
              autoplay={false}
              slidesPerView={"auto"}
              modules={[Autoplay, Pagination]}
              navigation={true}
            >
              {[0, 0, 0, 0, 0].map((data, index) => {
                return (
                  <SwiperSlide className={`__card`} key={index}>
                    <CardSkeleton />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          makeupSalonsState?.data?.length > 0 && (
            <Slider
              cardList={makeupSalonsState?.data}
              _name={"salon"}
              heading={`Makeup Salons ${
                params.city
                  ? "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                  : ""
              }`}
              navigatelink={getlinks("makeupsalons")}
            />
          )
        )}
      </div>

      {/*   <div ref={reviewsRef} className="slider__outer-container my-container">
        <Slider
          cardList={reviews}
          _name={"salonReviews"}
          heading={`User's experience on Trakky`}
          navigatelink={getlinks("reviews")}
          moreBtn={false}
        />
      </div>
      */}

      {/* Popular Area Section */}
      <PopularArea />
      <FAQ />
      {/* About Us Section */}
      <AboutUs />

      <Footer city={params?.city || "ahmedabad"} />
    </div>
  );
};
export default Home;

const AboutUs = () => {
  let param = useParams();
  let city = param.city.charAt(0).toUpperCase() + param.city.slice(1);

  return (
    <div className="about-us-section">
      <h1 className="px-4">About Us</h1>
      <div className="about-us-content">
        <p className="px-4 ">
          Welcome to Trakky, your premier destination for discovering the finest
          salons in {city}. Our mission is to connect you with the city's
          top-notch salons and beauty professionals, ensuring you always look
          and feel your best. Whether you're in search of a hair salon, nail
          spa, skincare clinic, or any other beauty service, our comprehensive
          listings are here to guide you.
          <div style={{ height: "12px", display: "block" }}></div>
          At Trakky, we take pride in offering a curated selection of salons
          that provide exceptional services and use the latest trends and
          techniques to pamper you. With our extensive database of {city}'s best
          salons, you'll easily find a perfect fit for your beauty needs. We
          understand that finding the right salon can be a time-consuming
          process, but with our user-friendly platform, you can search and
          discover best salons in {city} quickly and effortlessly.
        </p>
      </div>
    </div>
  );
};
