import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./mainhome.css";
import flagImg from "../../Assets/images/other/flag.png";
import arrowSvg from "../../Assets/images/icons/right_arrow_N.svg";
// import Footer from "../Common/Footer/Footer";
import FooterN from "../Common/Footer/FooterN";
import { Link } from "react-router-dom";
// import TopAreaOfCityDashboard frzom "../Common/toparea/TopAreaOfCityDashboard";
import "./Main.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WhatsAppButton from "../Common/whatsapp/WhatsappButton";
import FAQ from "../Faq/FAQ";
import BestSalons from "./BestSalons";
import Header from "../Common/Navbar/Header";
// import HeroOfferPng from "../../Assets/images/icons/hero_offer.png";
import Note_icon from "../../Assets/images/icons/note_icon.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import PopularLocations from "./PopularLocations";

import right_arrow from "../../Assets/images/icons/right_arrow.svg";
import ScrollToTop from "../Common/ScrollToTop";
import BangaloreImg from "../../Assets/images/city/bangalore.svg";
import AhmedabadImg from "../../Assets/city/2.jpg";
import Gandhinagar from "../../Assets/city/5.jpg";
import PuneImg from "../../Assets/city/6.jpg";
import DelhiImg from "../../Assets/city/3.jpg";
import MumbaiImg from "../../Assets/city/7.jpg";
import loading_gif from "../../Assets/images/logos/Trakky website graphics.gif";
import ChatBot from "./ChatBot/ChatBot";

const MainHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [popularcity, setPopularCity] = React.useState([]);
  const [expandedCities, setExpandedCities] = useState({});
  const [displayNo, setDisplayNo] = useState(6);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  // const [popularCityName, setPopularCityName] = useState([]);
  // const [topAreas, setTopAreas] = useState([]);
  const [city, setCity] = useState([]);
  const [featureThisWeekData, setFeatureThisWeekData] = useState([]);
  const [isLoadingFeatureThisWeek, setIsLoadingFeatureThisWeek] =
    useState(true);
  const featureAbortController = useRef(null);
  const [heroNationalOffer, setHeroNationalOffer] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Add loading state for categories

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // const getAreas = async () => {
  //   await fetch(`https://backendapi.trakky.in/salons/areaimage/`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPopularCity(data);

  //       data?.map((item) => {
  //         setPopularCityName((prev) => [...prev, item.city]);
  //       });
  //     });
  // };

  const getOfferFormat = (custom_offer_tag, offer_tag) => {
    let offerFormat = ""; // Variable to store the offer format
    let offerContent = ""; // Variable to store the content after the first word

    if (custom_offer_tag === null || custom_offer_tag === undefined) {
      offerContent = offer_tag;
      return { offerFormat, offerContent };
    }
    // Splitting the offer tag by space
    const offerParts = custom_offer_tag?.split(" ");
    if (offerParts[0] === "Get") {
      if (offerParts[1].endsWith("%")) {
        offerFormat = "percentage"; // Format: Get ${any_%} % off on ${servicename}
        offerContent = custom_offer_tag;
      } else if (offerParts[offerParts.length - 1] === "off") {
        offerFormat = "fixed-amount"; // Format: Get ₹${any_amount} off
        offerContent = custom_offer_tag;
      } else {
        offerFormat = "fixed-amount-service"; // Format: Get ₹${any_amount} off on ${servicename}
        offerContent = custom_offer_tag;
      }
    } else {
      offerFormat = "service-price"; // Format: ${servicename} at ₹${any_amount}
      offerContent = custom_offer_tag;
    }
    return { offerFormat, offerContent };
  };

  const getFeatureThisWeek = async () => {
    setIsLoadingFeatureThisWeek(true);

    if (featureAbortController.current) {
      featureAbortController.current.abort();
    }

    featureAbortController.current = new AbortController();
    const signal = featureAbortController.current.signal;

    try {
      const url = `https://backendapi.trakky.in/salons/feature-this-week/`;
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setFeatureThisWeekData(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Featured this week fetch failed:", err);
      }
      setFeatureThisWeekData([]);
    } finally {
      setIsLoadingFeatureThisWeek(false);
    }
  };

  // useEffect(() => {
  //   const areasByCity = popularcity.map((city) => {
  //     const areas = city.areas;
  //     return { city: city.city, areas };
  //   });
  //   setTopAreas(areasByCity);
  // }, [popularcity]);

  const handleShowMoreArea = (cityId) => {
    setExpandedCities((prevExpandedCities) => ({
      ...prevExpandedCities,
      [cityId]: true,
    }));
  };

  useEffect(() => {
    if (window.innerWidth < 540) {
      setDisplayNo(3);
    }
    // getAreas();
    getCategories();
    getOffer();
    getFeatureThisWeek();
  }, []);

  // Getting Category Data - UPDATED WITH SKELETON LOADING
  const getCategories = () => {
    const requestOption = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    setCategoriesLoading(true); // Start loading
    fetch(
      "https://backendapi.trakky.in/salons/national-category/",
      requestOption,
    )
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data);
        setCategoriesLoading(false); // Stop loading when data arrives
      })
      .catch((err) => {
        console.log(err);
        setCategoriesLoading(false); // Stop loading even on error
      });
  };

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/national-offers/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
      })
      .catch((err) => console.log(err));
  };

  const handleScroll = () => {
    const startDiv = document.getElementById("start");
    if (startDiv) {
      startDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCities = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/city/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setCity(data.payload);
      })
      .catch((err) => console.log(err));
  };

  const getHeroOffers = async (city) => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    let url = `https://backendapi.trakky.in/salons/national-hero-offers/?is_national=true`;

    try {
      let res = await fetch(url, requestOption);
      let data = await res.json();
      setHeroNationalOffer(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHeroOffers();
    getCities();
  }, []);

  // Skeleton component for categories
  const CategorySkeleton = () => (
    <div className="flex flex-col gap-2 snap-start last:mr-4">
      <div className="bg-gray-300 h-28 w-28 rounded-full lg:h-32 lg:w-32 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
      <div className="h-3 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
    </div>
  );

  return loading ? (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <img
        src={loading_gif}
        className="h-[200px] w-[200px]"
        alt="Loading... Please wait"
      />
    </div>
  ) : (
    <div className="">
      <ScrollToTop />
      {/* <div className="fixed bottom-6 right-6 z-50"> */}
      {/* <ChatBot /> */}
      <WhatsAppButton />
      {/* </div> */}

      <div className="bg-[#CBC7F0] rounded-b-3xl">
        <Header />

        <div className="max-w-[100%]  mt-5 mx-[25px] md:max-w-[600px] md:mx-auto lg:max-w-[700px] clg:max-w-[800px]">
          <Swiper
            slidesPerView="1"
            navigation
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {heroNationalOffer?.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-auto w-full cursor-pointer"
                  onClick={() => {
                    if (
                      !item?.salon_slug ||
                      !item?.salon_city ||
                      !item?.salon_area
                    ) {
                      return;
                    }
                    navigate(
                      `/${encodeURIComponent(
                        item?.salon_city,
                      )}/${encodeURIComponent(
                        item?.salon_area,
                      )}/salons/${encodeURIComponent(item?.salon_slug)}?offer=${
                        item.id
                      }&offer-type=national-offer`,
                    );
                  }}
                >
                  <img
                    src={item?.image}
                    className="h-auto w-full object-contain rounded-lg"
                    alt="Exclusive Salon Offers"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CATEGORIES SECTION WITH SKELETON EFFECT */}
        <div className="ml-4 mt-4 py-4 flex gap-5 overflow-x-scroll snap-x snap-mandatory md:ml-10">
          {categoriesLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 12 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : CategoriesData?.length > 0 ? (
            // Show actual data when loaded
            CategoriesData?.map((category, index) => (
              <div
                className="flex flex-col gap-2 snap-start last:mr-4 cursor-pointer"
                onClick={handleScroll}
                key={index}
              >
                <div className=" bg-gray-200 h-28 w-28 rounded-full lg:h-32 lg:w-32">
                  {category?.image && (
                    <img
                      src={category?.image}
                      alt={category?.title}
                      className="h-full w-full object-cover rounded-full shadow-sm drop-shadow-sm"
                    />
                  )}
                </div>
                <div className=" line-clamp-2 font-semibold text-center">
                  {category?.title}
                </div>
              </div>
            ))
          ) : (
            // Show empty state if no categories
            <div className="w-full text-center py-4 text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>

      <div className=" mx-4">
        <div className=" w-fit max-w-full border-y border-gray-200 my-4 text-[11px] text-gray-500 flex items-center gap-2 mx-auto py-2 lg:text-sm">
          <img
            src={Note_icon}
            alt="Tip: Exclusive salon booking discounts"
            className="h-6 w-6 object-contain"
          />
          Refresh your look for less with exclusive discounts on salon bookings!
        </div>
      </div>

      {/* {popularcity && popularcity.length > 0 && topAreas.length > 0 && (
          <TopAreaOfCityDashboard
            cityname={popularCityName.slice(0, 5)}
            areas={topAreas}
          />
        )} */}

      <div className="flex flex-col gap-2 items-center mt-[12px] lg:gap-3">
        <h2 className="!text-xl font-bold">Choose a city for salon booking</h2>
        <p className="text-sm pb-1 text-gray-700 lg:text-sm">
          Popular locations in India
        </p>

        {/* Magic Container */}
        <div
          className="
    w-full px-4
    grid grid-cols-3 gap-4
    md:flex md:justify-center md:gap-6 md:flex-wrap md:overflow-x-auto
    md:px-0
  "
        >
          {/* 1. Ahmedabad */}
          <img
            src={AhmedabadImg}
            alt="Ahmedabad"
            className="h-28 w-full object-cover rounded-xl cursor-pointer
                 md:h-28 md:w-28 md:shrink-0"
            onClick={() => navigate("/ahmedabad/salons/")}
          />
          <img
            src={Gandhinagar}
            alt="Gandhinagar"
            className="h-28 w-full object-cover rounded-xl cursor-pointer
                 md:h-28 md:w-28 md:shrink-0"
            onClick={() => navigate("/gandhinagar/salons/")}
          />

          {/* 2. Delhi */}
          <img
            src={DelhiImg}
            alt="Delhi"
            className="h-28 w-full object-cover rounded-xl cursor-pointer
                 md:h-28 md:w-28 md:shrink-0"
            onClick={() => navigate("/delhi/salons/")}
          />

          {/* 3. Gandhinagar */}

          {/* Empty cell – sirf mobile pe dikhega (second row ko center karega) */}
          <div className="hidden md:hidden"></div>

          {/* <img
      src={PuneImg}
      alt="Pune"
      className="h-28 w-full object-cover rounded-xl cursor-pointer
                 md:h-28 md:w-28 md:shrink-0"
      onClick={() => navigate("/pune/salons")}
    />

    <img
      src={MumbaiImg}
      alt="Mumbai"
      className="h-28 w-full object-cover rounded-xl cursor-pointer
                 md:h-28 md:w-28 md:shrink-0"
      onClick={() => navigate("/mumbai/salons")}
    /> */}
        </div>
      </div>

      <BestSalons cities={city} />

      {offersData?.length > 0 && (
        <div className="">
          <h2 className=" text-xl font-bold ml-[15px] pt-5 pb-3 md:ml-10 md:pt-8 ">
            Offers For You
          </h2>
          <div className="max-w-full mx-[15px] md:ml-10">
            <Swiper
              spaceBetween="20"
              slidesPerView={
                window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
              }
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
            >
              {offersData?.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="last:mr-[15px] md:last:mr-10 clg:last:mr-[calc((100vw-1360px)/2)]"
                >
                  <img
                    src={item?.image}
                    className="w-auto object-contain"
                    alt="Best Exclusive Salon Offers Available For You"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {(isLoadingFeatureThisWeek || featureThisWeekData?.length > 0) && (
        <div className="mt-3">
          <h2 className="text-xl font-bold ml-[15px] pt-5 pb-3 md:ml-10 md:pt-8">
            Featured This Week
          </h2>

          <div className="max-w-full ml-[15px] md:ml-10">
            <Swiper spaceBetween={20} slidesPerView="auto" navigation>
              {isLoadingFeatureThisWeek
                ? // ── SKELETON SLIDES ───────────────────────────────────────
                  Array.from({ length: 5 }).map((_, i) => (
                    <SwiperSlide
                      key={`skeleton-${i}`}
                      className="last:mr-[15px] md:last:mr-10 !w-[300px] !h-[350px] rounded-3xl"
                    >
                      <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        {/* Background / image area */}
                        <Skeleton className="w-full h-full rounded-3xl" />

                        {/* Gradient + content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 pt-5 rounded-b-3xl bg-gradient-to-t from-black to-transparent z-10 flex items-center justify-between">
                          <div className="flex-1 space-y-2.5">
                            {/* Offer tag – trying to mimic 3 lines */}
                            <div className="space-y-1.5">
                              <Skeleton height={26} width="55%" />
                              <Skeleton height={22} width="45%" />
                              <Skeleton height={18} width="70%" />
                            </div>

                            {/* Salon name */}
                            <Skeleton
                              height={22}
                              width="75%"
                              className="mt-3"
                            />

                            {/* Area , City */}
                            <Skeleton height={16} width="60%" />
                          </div>

                          {/* Arrow icon placeholder */}
                          <Skeleton circle height={36} width={36} />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                : // ── REAL CONTENT ───────────────────────────────────────────
                  featureThisWeekData?.map((item, index) => {
                    const { offerFormat, offerContent } = getOfferFormat(
                      item?.custom_offer_tag,
                      item?.salon_offer_tag,
                    );

                    return (
                      <SwiperSlide
                        key={index}
                        className="last:mr-[15px] md:last:mr-10 !w-[300px] !h-[350px] rounded-3xl"
                        onClick={() =>
                          navigate(
                            `/${encodeURIComponent(item?.salon_city)}/${encodeURIComponent(
                              item?.salon_area,
                            )}/salons/${encodeURIComponent(item?.salon_slug)}`,
                          )
                        }
                      >
                        <div className="relative h-full w-full">
                          <img
                            src={item?.salon_image}
                            className="w-full h-full object-cover rounded-3xl"
                            alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Services"
                          />
                          <div className="absolute bottom-0 left-0 right-0 text-white p-4 pt-5 rounded-b-3xl bg-gradient-to-t from-[#000000] to-[#00000000] z-10 flex gap-1 items-center justify-between">
                            <div className="">
                              <div className="text-xl font-bold leading-6 pb-[10px] -ml-[5px]">
                                {offerFormat === "fixed-amount" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span className="custom-offer-tag-text1">
                                      {offerContent.split(" ")[0].toUpperCase()}
                                    </span>
                                    <span className="custom-offer-tag-text2">
                                      {" "}
                                      {offerContent
                                        .split(" ")
                                        .slice(1)
                                        .join(" ")
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                ) : offerFormat === "percentage" ||
                                  offerFormat === "fixed-amount-service" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span className="custom-offer-tag-text1">
                                      {offerContent.split(" ")[0].toUpperCase()}
                                    </span>
                                    <span className="custom-offer-tag-text2">
                                      {" "}
                                      {offerContent
                                        .split(" ")[1]
                                        .toUpperCase()
                                        ?.replace("RS", "₹")}{" "}
                                      OFF
                                    </span>
                                    <span className="custom-offer-tag-text3 line-clamp-1">
                                      {" "}
                                      ON{" "}
                                      {offerContent
                                        .split(" ")
                                        .slice(4)
                                        .join(" ")
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                ) : offerFormat === "service-price" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span className="custom-offer-tag-text1 line-clamp-1">
                                      {offerContent
                                        .split(" ")
                                        .slice(0, -2)
                                        .join(" ")
                                        .toUpperCase()}
                                    </span>{" "}
                                    <span className="custom-offer-tag-text2">
                                      {offerContent
                                        .split(" ")
                                        .slice(-2)[0]
                                        .toUpperCase()}{" "}
                                      {offerContent
                                        .split(" ")
                                        .slice(-1)[0]
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="text-base font-medium line-clamp-1">
                                {item?.salon_name}
                              </div>
                              <div className="text-xs font-light line-clamp-1">
                                {item?.salon_area} , {item?.salon_city}
                              </div>
                            </div>
                            <div className="">
                              <img
                                src={right_arrow}
                                alt="Click To More Details"
                              />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
            </Swiper>
          </div>
        </div>
      )}

      <PopularLocations />
      {/* Top Areas By City */}

      <div className="homepage-main-title" id="start">
        Popular locations in
        <span>
          <img src={flagImg} alt="indian flag" />
        </span>
        Bharat
      </div>
      <div className="homepage-disc">
        Ready to glam up in the hottest cities across India? We have got you
        covered with our curated list of top-notch salons in the most happening
        spots!
        <br />
        Whether you're in the vibrant streets of Mumbai, soaking in the culture
        of Delhi, embracing the tech-savvy vibes of Bangalore, savoring the
        culinary delights of Ahmedabad, or enjoying the serene beauty of
        Gandhinagar, Trakky brings the best salons in India right to your
        service.
      </div>

      {/* popular city */}

      <div className="main-area-links">
        {city?.map((item) => {
          return (
            <Link
              to={`/${encodeURIComponent(item?.name.toLowerCase())}/salons`}
              key={item.id}
            >
              <div className="area-group-item">
                {item.name}
                <span>
                  <img src={arrowSvg} alt="View More Details" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* popular area */}

      {city &&
        city.map((item) => {
          return (
            <>
              {item?.area_names && item?.area_names.length > 0 && (
                <>
                  <div className="homepage-main-title">{item.name}</div>
                  <div className="main-area-links">
                    {item?.area_names
                      .slice(
                        0,
                        expandedCities[item.id]
                          ? item.area_names.length
                          : Math.min(displayNo, item.area_names.length),
                      )
                      .map((area, index) => {
                        return (
                          <Link
                            to={`/${encodeURIComponent(
                              item.name.toLowerCase(),
                            )}/salons/${encodeURIComponent(
                              area.toLowerCase(),
                            )}`}
                            key={index}
                          >
                            <div className="area-group-item">
                              {area}
                              <span>
                                <img src={arrowSvg} alt="View More Details" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  {!expandedCities[item.id] &&
                    item?.area_names.length > displayNo && (
                      <button
                        className="show-more-button-area"
                        onClick={() => handleShowMoreArea(item.id)}
                      >
                        Show More
                      </button>
                    )}
                  {expandedCities[item.id] && (
                    <button
                      className="show-more-button-area"
                      onClick={() =>
                        setExpandedCities((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }))
                      }
                    >
                      Show Less
                    </button>
                  )}
                </>
              )}
            </>
          );
        })}

      <FAQ />
      <AboutUs />
      <FooterN city={"ahmedabad"} />
    </div>
  );
};

export default MainHome;

const AboutUs = () => {
  return (
    <div className="about-us-section">
      <h1 className="px-4">About Us</h1>
      <div className="about-us-content">
        <p className="px-4 ">
          Welcome to Trakky, your one-stop destination for all things beauty and
          relaxation. We are more than simply an online booking platform; we are
          your dependable partner in looking and feeling your best.
        </p>
        <p className="px-4 ">
          At Trakky, we realize the value of self-care and its significance in
          improving your overall well-being. That is why we have designed a
          simple and convenient method for you to obtain the top salon and spa
          services in your area.
        </p>
        <p className="px-4 ">
          Our purpose is to inspire you to prioritize self-care and incorporate
          it into your daily routine. We believe that everyone has the right to
          look and feel their best, and we're here to help.
        </p>
      </div>
    </div>
  );
};
