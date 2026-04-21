import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// importing other stuff
import "./Main.css";
// importing components
import Hero from "./Hero/Hero";
import Slider from "../Common/Slider/Slider";
import Footer from "../Common/Footer/Footer";

import {
  TherapySkeleton,
  CardSkeleton,
} from "../Common/cardSkeleton/CardSkeleton";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Autoplay } from "swiper";

import PopularArea from "./PopularArea/PopularArea";
import TopspaOfArea from "../Common/TopSpa/TopSpaPopularArea";

import WhatsappButton from "../Common/whatsapp/WhatsappButton";

import { useSelector, useDispatch } from "react-redux";
import { fetchspasByCategoryAsync } from "../../Store/spaSlices";
import {
  capitalizeAndFormat,
  getNearByCoordinates,
} from "../functions/generalFun";
import { fetchNearBySpas } from "../../Store/nearbySlice";
import { fetchTherapy } from "../../Store/therapySlice";
import { fetchOffer } from "../../Store/offerSlice";
import Skeleton from "@mui/material/Skeleton";
import FAQ from "../faq/faq";
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

const Home = () => {
  const [therapyRef, istherapyInView] = useComponentInView();
  const [luxuriousRef, isLuxuriousInView] = useComponentInView();
  const [beautyRef, isBeautyInView] = useComponentInView();
  const [bodyMassageCenterRef, isbodyMassageCenterInView] =
    useComponentInView();
  const [menRef, isMenInView] = useComponentInView();
  const [womenRef, isWomenInView] = useComponentInView();
  const [bodyMassageRef, isBodyMassageInView] = useComponentInView();
  const [nearByRef, isNearByInView] = useComponentInView();
  const [topRatedRef, isTopRatedInView] = useComponentInView();
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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // top destinations
  const [topspaOfPopularArea, setTopspaOfPopularArea] = useState([]);

  const topRatedSpaState = useSelector((state) => state.topRatedSpas);
  const luxuriousSpaState = useSelector((state) => state.luxuriousSpas);
  const beautySpaState = useSelector((state) => state.beautySpas);
  const bodyMassageSpaState = useSelector((state) => state.bodyMassageSpas);
  const bodyMassageCenterState = useSelector(
    (state) => state.bodyMassageCenters
  );
  const mensSpaState = useSelector((state) => state.mensSpas);
  const womensSpaState = useSelector((state) => state.womensSpas);
  const nearbySpaState = useSelector((state) => state.nearbySpas);
  const therapyState = useSelector((state) => state.therapy);
  const offersState = useSelector((state) => state.offers);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  useEffect(() => {}, [latitude, longitude]);

  // Getting Therapy Data

  // Getting Reviews
  const getReviews = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/spas/review/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => console.log(err));
  };

  const getNearBySpaData = async () => {
    let latLong = await getNearByCoordinates(
      capitalizeAndFormat(params?.city).toLowerCase() || "ahmedabad"
    );

    if (
      nearbySpaState?.data?.length == 0 ||
      nearbySpaState?.data == null ||
      nearbySpaState?.latitude != latLong.latitude ||
      nearbySpaState?.longitude != latLong.longitude
    ) {
      dispatch(
        fetchNearBySpas({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: 1,
        })
      );
    }
  };

  useEffect(() => {
    if (isNearByInView &&
      (
        nearbySpaState?.data?.length == 0 ||
        nearbySpaState?.data == null ||
        nearbySpaState?.preferableCity?.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase()
      )) {
      getNearBySpaData();
    }
  }, [params?.city, isNearByInView]);

  useEffect(() => {
    document.title = `List Of Best Spas In ${
      params.city.charAt(0).toUpperCase() + params.city.slice(1)
    } - Trakky `;
    document
      .querySelector('meta[name="description"]')
      .setAttribute(
        "content",
        ` Checkout the list of Best Spas in ${
          params.city.charAt(0).toUpperCase() + params.city.slice(1)
        }, where you can get amazing DISCOUNTS and DEALS. Click to see the list of Top Spas In ${
          params.city.charAt(0).toUpperCase() + params.city.slice(1)
        }. `
      );
  }, [params.city]);

  useEffect(
    () => {
      if (isReviewsInView) getReviews();
    },
    [params.city],
    isReviewsInView
  );

  const getlinks = (list) => {
    if (params.city && params.area) {
      return `/${params.city.toLowerCase().replaceAll(" ", "-")}/${params.area
        .toLowerCase()
        .replaceAll(" ", "-")}/${list}`;
    }
    if (params.city) {
      return `/${params.city.toLowerCase().replaceAll(" ", "-")}/${list}`;
    }
    return `/${list}`;
  };

  useEffect(() => {
    if (params.city) {
      fetch(`https://backendapi.trakky.in/spas/topspabycityarea/?city=${params.city}&verified=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTopspaOfPopularArea(data[0]?.areas);
        })
        .catch((err) => console.log(err));
    }
  }, [params.city]);

  useEffect(() => {
    if (
      istherapyInView &&
      (therapyState?.city == null ||
        therapyState.city.toLowerCase() !=
          capitalizeAndFormat(params.city).toLowerCase())
    ) {
      dispatch(fetchTherapy({ city: capitalizeAndFormat(params.city) }));
    }
  }
  , [istherapyInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isOffersInView &&
      (offersState?.city == null ||
        offersState.city.toLowerCase() !=
          capitalizeAndFormat(params.city).toLowerCase())
    ) {
      dispatch(fetchOffer({ city: capitalizeAndFormat(params.city) }));
    }

  }, [isOffersInView, params?.city, dispatch]);

  useEffect(() => {

    if (
      isTopRatedInView &&
      (topRatedSpaState?.city == null ||
        topRatedSpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "topRated",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isTopRatedInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isLuxuriousInView &&
      (luxuriousSpaState?.city == null ||
        luxuriousSpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "luxurios",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isLuxuriousInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isBeautyInView &&
      (beautySpaState?.city == null ||
        beautySpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "beauty",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isBeautyInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isBodyMassageInView &&
      (bodyMassageSpaState?.city == null ||
        bodyMassageSpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassage",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isBodyMassageInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isbodyMassageCenterInView &&
      (bodyMassageCenterState?.city == null ||
        bodyMassageCenterState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassageCenters",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isbodyMassageCenterInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isMenInView &&
      (mensSpaState?.city == null ||
        mensSpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "mens",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }

  }, [isMenInView, params?.city, dispatch]);

  useEffect(() => {
    if (
      isWomenInView &&
      (womensSpaState?.city == null ||
        womensSpaState?.city.toLowerCase() !=
          capitalizeAndFormat(params?.city).toLowerCase())
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "womens",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [isWomenInView, params?.city, dispatch]);


  return (
    <div className="main__container">
      <WhatsappButton />
      <Hero />

      {/* Therapy Starts------------------- */}
      <div ref={therapyRef} className="therapy__container " id="therapies">
        {therapyState?.loading ? (
          <div className="slider__outer-container my-container">
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Spa Therapies In {capitalizeAndFormat(params.city)}
            </div>
            <Swiper
              className="slider__inner-container mySwiper "
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
                    className={`__card my-container`}
                    key={index}
                    style={{
                      marginInline: "10px",
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
          <div className="slider__outer-container my-container">
            {therapyState?.data?.length > 0 && (
              <Slider
                cardList={therapyState?.data || []}
                _name={"therapy"}
                heading={`Spa Therapies ${
                  params?.city &&
                  "In " +
                    params.city.charAt(0).toUpperCase() +
                    params.city.slice(1)
                } `}
                isMainHeading={true}
                subheading={`Best-Selling Spa Therapies For ${params.city ? capitalizeAndFormat(params.city) : "You"}`}
              />
            )}
          </div>
        )}
      </div>
      {/* Therapy Ends */}

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
              className="slider__outer-container offer__container my-container"
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

      {/* Spa Near You Starts------------------- */}
      <div ref={nearByRef} className="slider__outer-container my-container">
        {nearbySpaState?.loading ? (
          <>
            <div
              className="loading-heading "
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              Spas Near You
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
          nearbySpaState?.data?.length > 0 && (
            <Slider
              cardList={nearbySpaState?.data || []}
              _name={"spa"}
              heading={"Spa Near You"}
              navigatelink={getlinks("nearby")}
            />
          )
        )}
      </div>
      {/* Spa Near You Ends */}

      {/* Top Destinations Starts-------------------------- */}
      {topspaOfPopularArea && topspaOfPopularArea.length > 0 ? (
        <TopspaOfArea
          // topDestinationsLocations={topDestinationsLocations}
          topspaOfPopularArea={topspaOfPopularArea}
          // setActive={setActive}
          // active={active}
        />
      ) : null}
      {/* Top Destinations Ends */}

      {/* Top Rated Spa Starts --------------------------------------*/}
      <div ref={topRatedRef} className="slider__outer-container my-container">
        {topRatedSpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Top Rated Spas In {capitalizeAndFormat(params.city)}
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
          topRatedSpaState?.data?.length > 0 && (
            <Slider
              cardList={topRatedSpaState?.data}
              _name={"spa"}
              heading={`Top Rated Spa ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("topratedspas")}
            />
          )
        )}
      </div>
      {/* Top Rated Spa Ends */}

      <div className="explore">
        <p id="quotes">“Find the perfect spa therapy for your needs.”</p>
      </div>

      {/* Luxurious Spa Starts --------------------------------------*/}
      <div ref={luxuriousRef} className="slider__outer-container my-container">
        {luxuriousSpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Luxurious Spa In {capitalizeAndFormat(params.city)}
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
          luxuriousSpaState?.data?.length > 0 && (
            <Slider
              cardList={luxuriousSpaState?.data}
              _name={"spa"}
              heading={`Luxurious Spa ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("luxuriousspas")}
            />
          )
        )}
      </div>
      {/* Luxurious Spa Ends */}
      {/* Beauty Spa Starts --------------------------------------*/}
      <div ref={beautyRef} className="slider__outer-container my-container">
        {beautySpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Beauty Spa In {capitalizeAndFormat(params.city)}
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
          beautySpaState?.data?.length > 0 && (
            <Slider
              cardList={beautySpaState?.data}
              _name={"spa"}
              heading={`Beauty Spa ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("beautyspas")}
            />
          )
        )}
      </div>

      <div
        ref={bodyMassageRef}
        className="slider__outer-container my-container"
      >
        {bodyMassageSpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Body Massage Spa In {capitalizeAndFormat(params.city)}
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
          bodyMassageSpaState?.data?.length > 0 && (
            <Slider
              cardList={bodyMassageSpaState?.data}
              _name={"spa"}
              heading={`Body Massage Spa ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("bodyMassagespas")}
            />
          )
        )}
      </div>

      <div
        ref={bodyMassageCenterRef}
        className="slider__outer-container my-container"
      >
        {bodyMassageCenterState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Body Massage Center In {capitalizeAndFormat(params.city)}
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
          bodyMassageCenterState?.data?.length > 0 && (
            <Slider
              cardList={bodyMassageCenterState?.data}
              _name={"spa"}
              heading={`Body Massage Center ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("bodyMassagecenter")}
            />
          )
        )}
      </div>

      <div ref={menRef} className="slider__outer-container my-container">
        {mensSpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Spas For Men In {capitalizeAndFormat(params.city)}
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
          mensSpaState?.data?.length > 0 && (
            <Slider
              cardList={mensSpaState?.data}
              _name={"spa"}
              heading={`Spas for Men ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("menspas")}
            />
          )
        )}
      </div>

      <div ref={womenRef} className="slider__outer-container my-container">
        {womensSpaState?.loading ? (
          <>
            <div
              className="loading-heading"
              style={{
                margin: "30px 0px 0px 10px",
              }}
            >
              {/* <Skeleton variant="text" width={200} height={30} /> */}
              Spas for Women In {capitalizeAndFormat(params.city)}
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
          womensSpaState?.data?.length > 0 && (
            <Slider
              cardList={womensSpaState?.data}
              _name={"spa"}
              heading={`Spas for Women ${
                params?.city &&
                "In " +
                  params.city.charAt(0).toUpperCase() +
                  params.city.slice(1)
              } `}
              navigatelink={getlinks("womenspas")}
            />
          )
        )}
      </div>

      {/* Luxurious Spa Ends */}
      {/* <div className="flex flex-col justify-center p-0 m-0 fleitems-center slider__outer-container">
        <p className="w-[100%] text-center text-[24px] font-[500]">
          Trakky's Expreriences
        </p>

        <MainPageReviewDiv />
      </div> */}

      {reviews.length > 0 && reviews !== undefined && (
        <div ref={reviewsRef} className="slider__outer-container my-container">
          <Slider
            cardList={reviews}
            _name={"spaReviews"}
            heading={`User's experience on Trakky`}
            navigatelink={getlinks("reviews")}
            moreBtn={false}
          />
        </div>
      )}

      {/* Discover Trakky Experiences Starts --------------------------------------*/}
      {/* <div className="trakky_experiences">
        <h1>Discover Trakky Experiences</h1>
        <div className="trakky_experiences_image__container">
          <div className="left__">
            <img src={Image} alt="" />
            <div className="content_on_image">
              <p>Things to do on your trip</p>
              <Link>Experiences</Link>
            </div>
          </div>
          <div className="right__">
            <img src={Image} alt="" />
            <div className="content_on_image">
              <p>Things to do on your trip</p>
              <Link>Experiences</Link>
            </div>
          </div>
        </div>
      </div> */}
      {/* Discover Trakky Experiences Ends */}

      {/* Upper Footer Desktop  Starts --------------------------------------*/}
      {/* <div className="upper__footer_desktop">
        <div className="left__container">
          <h1>Trakky Experience</h1>
          <Link to={"/learn-more"}>Learn more</Link>
        </div>
        <div className="right__container">
          <img src={GiftCard} alt="" />
        </div>
      </div> */}
      {/* Upper Footer Desktop Ends */}

      {/* Upper Footer Mobile Starts---------------------------- */}
      {/* <div className="upper__footer_mobile">
        <h1>Trakky Experience</h1>
        <img src={GiftCard} alt="" />
        <Link to={"/learn-more"}>Learn more</Link>
      </div> */}
      {/* Upper Footer Mobile Ends */}

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
  return (
    <div className="about-us-section">
      <h1 className="px-4">About Us</h1>
      <div className="about-us-content">
        <p className="px-4">
          Welcome to Trakky, your gateway to a world of relaxation and
          rejuvenation. We're here to make your journey to wellness as seamless
          and soothing as possible.
        </p>
        <p className="px-4">
          At Trakky, we realize the value of self-care and its significance in
          improving your overall well-being. That is why we have designed a
          simple and convenient method for you to obtain the top spa services in
          your area.
        </p>
        <p className="px-4">
          Our purpose is to easily access you the finest spa experiences in your
          nearby area, promoting not only physical relaxation but also mental
          well-being.
        </p>
      </div>
    </div>
  );
};
