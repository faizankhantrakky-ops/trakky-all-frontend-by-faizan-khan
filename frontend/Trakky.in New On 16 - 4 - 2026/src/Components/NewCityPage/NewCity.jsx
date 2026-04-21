import React, { useState, useEffect, useContext, Suspense } from "react";
// import CheckoutBestCategory from "./components/CheckoutBestCategory/CheckoutBestCategory.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


import Salonservices from "./components/SalonServices/Salonservices.jsx";
import "./components/MediaQueries.css";
import Header from "../Common/Navbar/Header.jsx";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { fetchSalonsByCategoryAsync } from "../../Store/salonSlices.js";
import percentage_offer_tag from "../../Assets/images/offers/Trakky website graphics.svg";
import "../SalonPage/SalonProfilePage/salonprofilepage.css";
// import ReelCarousel1 from "../ReelPage/ReelPageN.jsx";
import ReelCarousel from "../ReelPage/GroomingStories.jsx";
import {
  capitalizeAndFormat,
  getCoordinateByCity,
} from "../functions/generalFun.js";
import { fetchNearBySalons } from "../../Store/nearbySlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Score_svg from "../../Assets/images/icons/score_svg.svg";
import heart_svg from "../../Assets/images/icons/heart_2.svg";
import FooterN from "../Common/Footer/FooterN.jsx";
import FAQ from "../Faq/FAQ.jsx";
import OtherListCard from "../listPage/listCard/OtherListCard.jsx";

import { useNavigate } from "react-router-dom";
// import { MdFavoriteBorder } from "react-icons/md";
import AuthContext from "../../context/Auth.jsx";
import { FcLike } from "react-icons/fc";
import PopularArea from "../MainPage/PopularArea/PopularArea.jsx";
import loading_gif from "../../Assets/images/logos/Trakky website graphics.gif";

import pocket_hero_png from "../../Assets/images/category/pocket_hero_png.png";
import offer_zone_png from "../../Assets/images/category/offer_zone_png.png";
import top_rated_png from "../../Assets/images/category/top_rated_icon.png";
import near_me_png from "../../Assets/images/category/near_me_png.png";
import ScrollToTop from "../Common/ScrollToTop.jsx";
import { Helmet} from "react-helmet";
import { animations } from "framer-motion";
import { AnimationRounded } from "@mui/icons-material";
import ChatBot from "../MainPage/ChatBot/ChatBot.js";
import MemberShipList from "./components/MemberShipList/MemberShipList.jsx";
const CheckoutBestCategory = React.lazy(() =>
  import("./components/CheckoutBestCategory/CheckoutBestCategory.jsx")
);


// Add this component definition near your other components
const AnimatedHeading = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { userFavorites, location } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const handleClick = () => {
    navigate(`/${params.city}/offerpage`, {
      state: { fromCityPage: true },
    }); // This will navigate to the offer page
  };

  // const [offersData, setOffersData] = useState([]);
  const [heroOffer, setHeroOffer] = useState([]);
  const nearBySalonsState = useSelector((state) => state.nearBySalons);
  const topRatedSalonsState = useSelector((state) => state.topRatedSalons);

  const [topSalonOfPopularArea, setTopSalonOfPopularArea] = useState([]);
  const [topSalonActiveArea, setTopSalonActiveArea] = useState(null);
  const [topSalonActiveAreaData, setTopSalonActiveAreaData] = useState([]);

  const [primaryOfferData, setPrimaryOfferData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  // // document.addEventListener('contextmenu', event => event.preventDefault());
  // document.onkeydown = function (e) {
  //   if (e.ctrlKey && e.shiftKey && (e.keyCode === 'C'.charCodeAt(0) || e.keyCode === 'J'.charCodeAt(0))) {
  //     return false; // Block Ctrl+Shift+C and Ctrl+Shift+J
  //   }
  //   // if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
  //   //   return false; // Block Ctrl+U (view source)
  //   // }
  // };
  // // Add a transparent overlay to block interaction with a sensitive section
  // const protectedElement = document.querySelector('.protected');
  // if (protectedElement) {
  //   protectedElement.style.pointerEvents = 'none';
  // }

  useEffect(() => {
    if (!window.history.state?.fromOfferPage) {
      window.history.replaceState({ fromCityPage: true }, "");
    }
  }, []);

  const styles = {
    button: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      border: "none",
      background: "white",
      color: "linear-gradient(135deg, #b46ef4 0%, #9818f2 100%)",
      fontWeight: "600",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: isHovered
        ? "0 8px 20px rgba(180, 110, 244, 0.6)"
        : "0 4px 15px rgba(180, 110, 244, 0.4)",
      overflow: "visible",
      textTransform: "uppercase",
      letterSpacing: "1px",
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
    },
    text: {
      position: "relative",
      zIndex: "2",
    },
  };

  const keyframes = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(100%) rotate(45deg); }
    }
  `;

  const list_filter_options = [
    {
      name: "Offer Zone",
      link: `/${params?.city}/list/?discount=50_up`,
      image: offer_zone_png,
    },
    {
      name: "Pocket Hero",
      link: `/${params?.city}/list/?price_range=0_1000`,
      image: pocket_hero_png,
    },
    {
      name: "Top Rated",
      link: `/${params?.city}/list/?salon_category=top_rated`,
      image: top_rated_png,
    },
    {
      name: "Near Me",
      link: `/${params?.city}/list/?distance=within_10`,
      image: near_me_png,
    },
  ];

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

  const getPrimaryOffer = async (city) => {
    let url = `https://backendapi.trakky.in/salons/salon-city-offer/?city=${city}`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      setPrimaryOfferData(data);
    } catch (err) {
      console.log(err);
    }
  };

const getHeroOffers = async (city) => {
  const requestOption = {
    method: "GET",
    headers: {  // Fixed: 'header' should be 'headers'
      "Content-Type": "application/json",
    },
  };
  let url = `https://backendapi.trakky.in/salons/national-hero-offers/?city=${city}`;
  try {
    let res = await fetch(url, requestOption);
    let data = await res.json();
    // Sort the data by priority in ascending order (1 first, then 2, etc.)
    const sortedData = data.sort((a, b) => a.priority - b.priority);
    setHeroOffer(sortedData);
  } catch (err) {
    console.log(err);
  }
};




const DEFAULT_LAT = 23.0386;
const DEFAULT_LNG = 72.5118;

const getNearBySalonData = () => {

  let lat = location?.latitude;
  let lng = location?.longitude;

  // Agar user location nahi hai → Sindhubhavan use karo
  if (!lat || !lng || lat === 0 || lng === 0) {
    lat = 23.0386;
    lng = 72.5118;
  }

  console.log("Calling Nearby API with:", lat, lng);

  dispatch(
    fetchNearBySalons({
      latitude: lat,
      longitude: lng,
      page: 1,
    })
  );
};

useEffect(() => {
  getNearBySalonData();
}, []);

  useEffect(() => {
    if (params?.city) {
      getHeroOffers(params?.city);
    }
    getPrimaryOffer(params?.city);
  }, [params?.city]);

  useEffect(() => {
    console.log("nearBySalonsState :: ", nearBySalonsState.preferableCity);
    console.log("params :: ", params?.city);
    if (
      nearBySalonsState?.data?.length === 0 ||
      nearBySalonsState?.data == null ||
      nearBySalonsState?.preferableCity?.toLowerCase() !==
        params?.city.toLowerCase() ||
      nearBySalonsState?.latitude !== location.latitude
    ) {
      getNearBySalonData();
    }
  }, [params?.city, location]);

  useEffect(() => {
    if (
      topRatedSalonsState?.city == null ||
      topRatedSalonsState.city.toLowerCase() !== params.city.toLowerCase()
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "topRated",
          page: 1,
          city: params.city,
        })
      );
    }
  }, [params?.city, dispatch, topRatedSalonsState.city]);

  useEffect(() => {
    if (params.city) {
      fetch(
        `https://backendapi.trakky.in/salons/topsalonbycityarea/?city=${params.city.toUpperCase()}`,
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
          setTopSalonActiveArea(data[0]?.areas[0]?.area);
        })
        .catch((err) => console.log(err));
    }
  }, [params?.city]);

  useEffect(() => {
    if (topSalonActiveArea) {
      let salon = topSalonOfPopularArea.filter(
        (item) => item.area.toLowerCase() === topSalonActiveArea.toLowerCase()
      );

      setTopSalonActiveAreaData(salon[0]?.salons);
    } else {
      setTopSalonActiveAreaData([]);
    }
  }, [topSalonActiveArea, topSalonOfPopularArea]);

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


  const [visible, setVisible] = useState(5);   // start with 10 salons


  const getNewOfferFormat = (new_offer_tag, custom_offer_tag) => {
    // { lable: "₹ off above ₹", type: "type_1" } // ₹150 off above ₹600,
    // { lable: "% off upto ₹", type: "type_2" } //39% off upto ₹25,
    // { lable: "get % off on services", type: "type_3" } //get 20% off on services,
    // { lable: "get ₹ off", type: "type_4" } //get ₹20 off,
    // { lable: "get ₹ off on services", type: "type_5" } //get ₹200 off on services,
    // { lable: "service at ₹", type: "type_6" } //service at ₹2000,

    let offerFormat = ""; // Variable to store the offer format
    let offerContent = ""; // Variable to store the content after the first word

    if (new_offer_tag === null || new_offer_tag === undefined) {
      offerContent = custom_offer_tag;
      return { offerFormat, offerContent };
    }
    // Splitting the offer tag by space
    const offerParts = new_offer_tag?.split(" ");

    if (offerParts.includes("off") && offerParts.includes("above")) {
      offerFormat = "type_1"; // Format: Get ₹${any_amount} off above ₹${any_amount}
      offerContent = new_offer_tag;
    } else if (offerParts.includes("off") && offerParts.includes("upto")) {
      offerFormat = "type_2"; // Format: Get ₹${any_amount} off upto ₹${any_amount}
      offerContent = new_offer_tag;
    } else if (
      offerParts.includes("off") &&
      offerParts.includes("on") &&
      offerParts.includes("services")
    ) {
      offerFormat = "type_3"; // Format: Get ₹${any_amount} off on services
      offerContent = new_offer_tag;
    }
    // check get off & includes ₹  & length <= 3
    else if (
      offerParts.includes("off") &&
      offerParts[1].includes("₹") &&
      offerParts.length <= 3
    ) {
      offerFormat = "type_4"; // Format: Get ₹${any_amount} off
      offerContent = new_offer_tag;
    }
    // check get off & includes ₹  & includes on & includes services & length > 3
    else if (
      offerParts.includes("off") &&
      offerParts.includes("₹") &&
      offerParts.includes("on") &&
      offerParts.includes("services") &&
      offerParts.length > 3
    ) {
      offerFormat = "type_5"; // Format: Get ₹${any_amount} off on services
      offerContent = new_offer_tag;
    }
    // check includes at & includes ₹
    else if (offerParts.includes("at") && offerParts[2].includes("₹")) {
      offerFormat = "type_6"; // Format: service at ₹${any_amount}
      offerContent = new_offer_tag;
    }

    return { offerFormat, offerContent };
  };

  return nearBySalonsState?.loading ||
    topRatedSalonsState?.loading ||
    loading ? (
    <>
      <Helmet>
        <title>{`Checkout Best Salon To Visit In ${capitalizeAndFormat(
          params?.city
        )} - Trakky`}</title>
        <meta
          name="description"
          content={`Checkout the top salons in ${capitalizeAndFormat(
            params?.city
          )}. Get best offers in top salons in ${capitalizeAndFormat(
            params?.city
          )}. Click here to find out the beauty salons and hair salons in ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/salons/`}
        />
      </Helmet>
      <div className="protected w-full h-[100vh] flex justify-center items-center">
        <img
          src={loading_gif} 
          className="h-[200px] w-[200px]"
          alt="Loading... please wait"
        />
      </div>
    </>
  ) : (
    <div className="protected N-list-page-container relative">
      <Helmet>
        <title>{`Checkout Best Salon To Visit In ${capitalizeAndFormat(
          params?.city
        )} - Trakky`}</title>
        <meta
          name="description"
          content={`Checkout the top salons in ${capitalizeAndFormat(
            params?.city
          )}. Get best offers in top salons in ${capitalizeAndFormat(
            params?.city
          )}. Click here to find out the beauty salons and hair salons in ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/salons/`}
        />
      </Helmet>
      <ScrollToTop />
      {/* <ChatBot /> */}
      <div className="protected N-list-page-background-color"></div>
      <Header />
      {/* Hero Section Offer */}
      <div className="protected max-w-[100%] mt-5 mx-[15px] md:max-w-[600px] md:mx-auto lg:max-w-[700px] clg:max-w-[800px]">
        <Swiper
          slidesPerView={1}
          navigation
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
       {heroOffer?.map((item, index) => {
  // Check if the file is a video or image
  const isVideo = item?.video?.match(
    /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i
  );
  const isImage = item?.image?.match(
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
  );
  return (
    <SwiperSlide key={index} className="">
      <div
        className="protected h-auto w-full cursor-pointer"
        onClick={() => {
          if (
            item?.salon_slug &&
            item?.salon_city &&
            item?.salon_area
          ) {
            navigate(
              `/${encodeURIComponent(
                item?.salon_city
              )}/${encodeURIComponent(
                item?.salon_area
              )}/salons/${encodeURIComponent(
                item?.salon_slug
              )}?offer=${item.id}&offer-type=national-offer`
            );
          }
        }}
      >
        {isVideo ? (
          <video
            style={{ borderRadius: "11px" }}
            className="h-auto w-full object-contain rounded-lg"
            src={item?.video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : isImage ? (
          <img
            style={{ borderRadius: "11px" }}
            className="h-auto w-full object-contain rounded-lg"
            src={item?.image}
            alt="Hero offer"
          />
        ) : (
          <div className="h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center">
            No media available
          </div>
        )}
      </div>
    </SwiperSlide>
  );
})}
        </Swiper>
      </div>

      <style>{keyframes}</style>
      <div className="p-6 flex justify-center relative">
        <button
          style={{
            ...styles.button,
            padding: window.innerWidth < 768 ? "6px 10px" : "10px 16px",
            fontSize: window.innerWidth < 768 ? "12px" : "16px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          className="offers-button"
        >
          <div className="offers-icon flex items-center">
            <img
              src={percentage_offer_tag}
              alt="Exclusive percentage discount offer tag"
              className={`${
                window.innerWidth < 768 ? "w-10 h-10" : "w-10 h-10"
              } rounded-full`}
            />
          </div>
          <span style={styles.text}>Exclusive Salon Offers</span>
          <div
            style={{
              position: "absolute",
              top: window.innerWidth < 768 ? "-8px" : "-10px",
              right: window.innerWidth < 768 ? "10px" : "10px",
              backgroundColor: "#ff4d94",
              color: "white",
              fontSize: window.innerWidth < 768 ? "0.65rem" : "0.75rem",
              padding: window.innerWidth < 768 ? "3px 6px" : "4px 8px",
              borderRadius: "12px",
              fontWeight: "700",
              boxShadow: "0 2px 5px rgba(255, 77, 148, 0.4)",
              animation: "pulse 2s infinite",
              zIndex: 10,
            }}
          >
            NEW
          </div>
        </button>
      </div>
      <Salonservices />


      {/* <MemberShipList/> */}

   {topRatedSalonsState?.loading ||
  (topRatedSalonsState?.data?.length > 0 && (
    <div className="pt-5 lg:pt-10">
      <div className="protected mx-4 flex justify-between md:mx-10 md:mb-0 mb-4">
        <h1 className="text-xl font-semibold">
          Best Salons in {capitalizeAndFormat(params?.city)}
        </h1>
        <button
          className=" font-light text-slate-800 underline"
          onClick={() => {
            navigate(`/${params?.city}/topratedsalons`);
          }}
        >
          More
        </button>
      </div>
      {window.innerWidth < 768 ? (
        <>
          <div className="mt-3 flex flex-col gap-4">
            {topRatedSalonsState?.data?.slice(0, visible)?.map((item, index) => {
              const { offerFormat, offerContent } = getOfferFormat(
                item?.custom_offer_tag,
                item?.offer_tag
              );
              return (
                <Link
                  to={`/${encodeURIComponent(
                    item?.city
                  )}/${encodeURIComponent(
                    item?.area
                  )}/salons/${encodeURIComponent(item?.slug)}`}
                  className="flex gap-3 mx-4 md:mx-10 cursor-pointer"
                  key={index}
                >
                  <div className="w-[150px] h-[170px] shadow-xl drop-shadow rounded-xl relative bg-gray-200 shrink-0">
                    <div className="absolute rounded-b-xl block bottom-0 left-0 w-full h-14 bg-gradient-to-t from-[#000000da] to-[#00000000] z-10"></div>
                    <div className="absolute rounded-t-xl block top-0 left-0 w-full h-10 bg-gradient-to-b from-[#000000bf] to-[#00000000] z-10"></div>
                    {item?.main_image && (
                      <img
                        src={item?.main_image}
                        className="w-full h-full object-cover rounded-xl blur-[0.1px] "
                        alt=""
                      />
                    )}
                    {!userFavorites?.some((item1) => {
                      let res = item1?.salon === item?.id;
                      return res;
                    }) ? (
                      <div className=" absolute top-2 right-2 z-10 h-6 w-6">
                        <img
                          src={heart_svg}
                          alt="Added to favorites"
                          className="h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className=" absolute top-[5px] right-[6px] z-10 h-7 w-7">
                        <FcLike className="w-full h-full" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 z-10">
                      <span>
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
                              {offerContent.split(" ")[1].toUpperCase()} OFF
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
                              {offerContent.split(" ").slice(-2)[0].toUpperCase()}{" "}
                              {offerContent.split(" ").slice(-1)[0].toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                    {item?.premium && (
                      <div className="premium_div-x absolute">
                        <div className="premium-text">Premium</div>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <h3 className="text-lg font-semibold">{item?.name}</h3>
                    <div className="flex gap-2">
                      <img
                        src={Score_svg}
                        className=" invert-[0.5]"
                        alt="Customer rating score"
                      />
                      <span className="font-semibold">
                        {item?.avg_score?.toFixed(1) || 0}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {item?.area} , {item?.city}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          {topRatedSalonsState?.data?.length > visible && (
            <div
              className="whitespace-nowrap border border-slate-600 px-3 py-1 rounded-3xl w-fit mx-auto mt-5 drop-shadow-sm shadow-sm min-w-max cursor-pointer text-center"
              onClick={() => {
                setVisible((prev) => prev + 5);
              }}
            >
              See All Salons
            </div>
          )}
        </>
      ) : (
        <div className="protected N-Profile-page-suggested-salons ml-[5px] snap-x snap-proximity md:ml-[30px]">
          {topRatedSalonsState?.data?.map((item, index) => {
            const { offerFormat, offerContent } = getOfferFormat(
              item?.custom_offer_tag,
              item?.offer_tag
            );
            // const { offerFormat, offerContent } = getNewOfferFormat(item?.latest_offer_display_name, item?.offer_tag)
            return (
              <Link
                to={`/${encodeURIComponent(
                  item?.city
                )}/${encodeURIComponent(
                  item?.area
                )}/salons/${encodeURIComponent(item?.slug)}`}
                className="N-Profile-page-saggested-salon-card snap-start first:!ml-0 last:!mr-4"
                key={index}
              >
                <div className="protected N-Profile-page-suggested-salon-card-img drop-shadow shadow rounded-2xl">
                  <img src={item?.main_image} alt="" className="" />
                  {!userFavorites?.some((item1) => {
                    let res = item1?.salon === item?.id;
                    return res;
                  }) ? (
                    <div className=" absolute top-2 right-2 z-10 h-6 w-6">
                      <img
                        src={heart_svg}
                        alt="Added to favorites"
                        className="h-full w-full !object-contain !rounded-none"
                      />
                    </div>
                  ) : (
                    <div className=" absolute top-[5px] right-[6px] z-10 h-7 w-7">
                      <FcLike className="w-full h-full" />
                    </div>
                  )}
                  <div className="protected offer-tag-p-s-s">
                    <span>
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
                            {offerContent.split(" ")[1].toUpperCase()} OFF
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
                      {offerFormat === "type_1" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className=" text-[18px] font-bold leading-[18px]">
                            {offerContent.split(" ")[0].toUpperCase()} OFF
                          </span>
                          <span className=" text-sm font-normal">
                            above {offerContent.split(" ")[3].toUpperCase()}
                          </span>
                        </div>
                      ) : offerFormat === "type_2" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className="text-[18px] font-bold leading-[18px]">
                            {offerContent.split(" ")[0].toUpperCase()} OFF
                          </span>
                          <span className="text-sm font-medium">
                            upto {offerContent.split(" ")[3].toUpperCase()}
                          </span>
                        </div>
                      ) : offerFormat === "type_3" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className=" text-[14px] leading-4 font-bold">
                            GET
                          </span>
                          <span className=" text-[18px] font-bold">
                            {offerContent.split(" ")[1].toUpperCase()} OFF
                          </span>
                          <span className="text-[12px] leading-4 font-normal line-clamp-1">
                            ON{" "}
                            {offerContent
                              .split(" ")
                              .slice(4)
                              .join(" ")
                              .toUpperCase()}
                          </span>
                        </div>
                      ) : offerFormat === "type_4" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className="text-xs leading-4 font-bold">
                            GET
                          </span>
                          <span className=" text-lg font-bold line-clamp-1 leading-5">
                            {offerContent.split(" ")[1].toUpperCase()} OFF
                          </span>
                        </div>
                      ) : offerFormat === "type_5" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className=" text-[14px] leading-4 font-bold">
                            GET
                          </span>
                          <span className="text-[18px] font-bold">
                            {offerContent.split(" ")[1].toUpperCase()} OFF
                          </span>
                          <span className=" text-[12px] leading-4 font-normal line-clamp-1">
                            ON{" "}
                            {offerContent
                              .split(" ")
                              .slice(4)
                              .join(" ")
                              .toUpperCase()}
                          </span>
                        </div>
                      ) : offerFormat === "type_6" ? (
                        <div className=" pl-1 flex flex-col pb-1">
                          <span className=" text-[14px] font-semibold leading-4">
                            SERVICE AT
                          </span>
                          <span className=" text-[19px] font-bold">
                            {offerContent.split(" ")[2].toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                  {item?.premium && (
                    <div className="premium_div-x absolute">
                      <div className="premium-text">Premium</div>
                    </div>
                  )}
                </div>
                <div className="N-Profile-page-suggested-salon-card-content">
                  <h2>{item?.name}</h2>
                  <p className="N-P-S-S-score">
                    <img src={Score_svg} alt="Customer rating score" />
                    <span>
                      {item?.avg_score
                        ? String(item?.avg_score).slice(0, 3)
                        : 0}
                    </span>
                  </p>
                  <p className="N-P-S-S-addr">
                    {item?.area} , {item?.city}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  ))}


      <ReelCarousel />
      {/* <ReelCarousel1 /> <section id="reels">
        <ReelCarousel />
      </section>c */}
      {/* 2 offer 2 category */}
      <div className="protected grid grid-cols-2 gap-[15px] my-6 px-[15px] esm:grid-cols-4 md:max-w-[min(550px,70%)] md:mx-auto lg:max-w-900px] lg:mt-10 lg:mb-8">
        {primaryOfferData.slice(0, 4)?.map((item, index) => (
          <div
            className="protected aspect-square bg-white rounded-xl drop-shadow-sm cursor-pointer"
            onClick={() => {
              if (item?.salon.length === 1) {
                navigate(
                  `/${item?.city}/${item?.area}/salons/${
                    item?.salon_slug[item?.salon[0]]
                  }`
                );
              } else if (item?.salon.length > 1) {
                navigate(`/${item?.city}/salons/special-offers/${item?.slug}`);
              }
            }}
          >
            <img
              src={item?.offer_image}
              className=" h-full w-full aspect-square rounded-xl"
              alt=""
            />
          </div>
        ))}
      </div>
      {/* mini salon promote */}
      {window.innerWidth < 768 ? (
        <>
          <div className="protected w-fit m-auto max-w-full overflow-x-scroll">
            <div className="protected ml-4 pt-2 pb-4 max-w-full overflow-x-scroll snap-x snap-proximity flex gap-3 md:mt-6 md:ml-10">
              {list_filter_options?.map((item, index) => (
                <Link
                  to={item?.link}
                  className="border overflow-hidden border-slate-300 w-20 rounded-2xl pt-3 px-3 min-w-[70px] sm:min-w-[80px] flex flex-col gap-1 items-center capitalize text-center snap-start last:mr-[15px] bg-gradient-to-t from-[#e6e6e699] to-[#fafafade] "
                >
                  <span className=" text-xs font-extrabold leading-3 text-slate-600 h-8">
                    {item?.name}
                  </span>
                  <div className="protected h-9 sm:h-10 w-full flex justify-center mb-1">
                    <img src={item.image} className=" h-full w-auto" alt="" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <NearBySalons nearBySalonsState={nearBySalonsState} />
        </>
      ) : (
        <>
          <NearBySalons nearBySalonsState={nearBySalonsState} />
          <div className="protected w-fit m-auto max-w-full overflow-scroll">
            <div className="protected ml-4 pt-2 pb-4 max-w-full overflow-x-scroll snap-x snap-proximity flex gap-3 md:mt-6 md:ml-10 md:gap-5 lg:gap-6">
              {list_filter_options?.map((item, index) => (
                <Link
                  to={item?.link}
                  className="border overflow-hidden border-slate-300 w-20 rounded-2xl pt-3 px-5 min-w-[80px] flex flex-col gap-1 items-center capitalize text-center snap-start last:mr-[15px] bg-gradient-to-t from-[#e6e6e699] to-[#fafafade] "
                >
                  <span className=" text-xs font-extrabold leading-3 text-slate-600 h-8">
                    {/* {item?.name?.split(" ")[0]}
                    <br />
                    {item?.name?.split(" ").slice(1).join(" ")} */}
                    {item?.name}
                  </span>
                  <div className=" h-10 w-full flex justify-center mb-1">
                    <img src={item.image} className=" h-full w-auto" alt="" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutBestCategory />
      </Suspense> 
      {topSalonActiveAreaData?.length > 0 && (
        <div className="protected pt-5 lg:pt-10">
          <div className="mx-4 flex justify-between md:mx-10">
            <h1 className="text-xl font-semibold">
              Top Rated Salons Of Different Areas
            </h1>
          </div>
          <div className="mt-3 flex overflow-x-scroll gap-3 ml-4 md:ml-10 snap-x snap-proximity">
            {topSalonOfPopularArea?.map((item, index) => (
              <button
                className={`py-3 px-5 rounded-lg min-w-max text-sm font-semibold snap-start last:mr-4 ${
                  item?.area.toLowerCase() === topSalonActiveArea.toLowerCase()
                    ? "text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC]"
                    : "border border-slate-800 border-solid"
                }`}
                onClick={() => setTopSalonActiveArea(item?.area)}
                key={index}
              >
                {item?.area}
              </button>
            ))}
          </div>
          <div className="N-Profile-page-suggested-salons snap-x snap-proximity ml-[5px] md:ml-[30px] md:mt-2">
            {topSalonActiveAreaData?.map((item, index) => {
              const { offerFormat, offerContent } = getOfferFormat(
                item?.custom_offer_tag,
                item?.offer_tag
              );

              return (
                <Link
                  to={`/${encodeURIComponent(item?.city)}/${encodeURIComponent(
                    item?.area
                  )}/salons/${encodeURIComponent(item?.slug)}`}
                  className="N-Profile-page-saggested-salon-card snap-start first:!ml-0 last:!mr-4"
                  key={index}
                >
                  <div className="N-Profile-page-suggested-salon-card-img shadow rounded-2xl drop-shadow">
                    <img src={item?.main_image} alt="" />
                    {!userFavorites?.some((item1) => {
                      let res = item1?.salon === item?.id;
                      return res;
                    }) ? (
                      <div className=" absolute top-2 right-2 z-10 h-6 w-6">
                        <img
                          src={heart_svg}
                          alt="Added to favorites"
                          className="h-full w-full !object-contain !rounded-none"
                        />
                      </div>
                    ) : (
                      <div className=" absolute top-[5px] right-[6px] z-10 h-7 w-7">
                        <FcLike className="w-full h-full" />
                      </div>
                    )}
                    <div className="offer-tag-p-s-s">
                      <span>
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
                              {offerContent.split(" ")[1].toUpperCase()} OFF
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
                        )}{" "}
                      </span>
                    </div>
                    {item?.premium && (
                      <div className="premium_div-x absolute">
                        <div className="premium-text">Premium</div>
                      </div>
                    )}
                  </div>
                  <div className="N-Profile-page-suggested-salon-card-content">
                    <h2>{item?.name}</h2>
                    <p className="N-P-S-S-score">
                      <img src={Score_svg} alt="Customer rating score" />
                      <span>
                        {item?.avg_score
                          ? String(item?.avg_score).slice(0, 3)
                          : 0}
                      </span>
                    </p>
                    <p className="N-P-S-S-addr">
                      {item?.area} , {item?.city}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {topSalonActiveAreaData?.length > 0 && (
        <div
          className="protected mx-[15px] my-3 text-[#512DC8] text-center py-3 text-xl cursor-pointer font-semibold border-y border-slate-200 md:mx-10"
          onClick={() => {
            navigate(`/${params?.city}/salons/${topSalonActiveArea}`);
          }}
        >
          See more salons &gt;
        </div>
      )}
      <SalonsListInfi />
      <PopularArea />
      <FAQ />
      <AboutUs />
      <FooterN city={params?.city} />
    </div>
  );
}

export default App;


const NearBySalons = ({ nearBySalonsState }) => {
  const navigate = useNavigate();
  const { userFavorites, location } = useContext(AuthContext);

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

  // Always show skeleton when loading OR when there's an error (to handle retries)
 // show skeleton only when loading AND no data
if (nearBySalonsState?.loading && !nearBySalonsState?.data?.length) {
  return (
    <div className="pt-3 lg:pt-10">
      <div className="mx-4 flex justify-between md:mx-10">
        <Skeleton height={28} width={200} />
        <Skeleton height={20} width={50} />
      </div>

      <div className="N-Profile-page-suggested-salons md:ml-[35px] ml-0 snap-x snap-proximity ">
        {[1,2,3,4,5,6,7,8].map((item) => (
          <div
            className="N-Profile-page-saggested-salon-card snap-start"
            key={item}
          >
            <Skeleton height={200} width="100%" borderRadius="1rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

  // No data state - keep showing skeleton if we expect retries
if (!nearBySalonsState?.data || nearBySalonsState?.data?.length === 0) {

  // If retry is happening show skeleton
  if (nearBySalonsState?.retryCount !== undefined) {
    return (
      <div className="pt-3 lg:pt-10">

        <div className="mx-4 flex justify-between md:mx-10">
          <h1 className="text-xl font-semibold">Best salons near you</h1>
          <Skeleton height={20} width={50} />
        </div>

        <div className="N-Profile-page-suggested-salons ml-[5px] snap-x snap-proximity md:ml-[30px]">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="N-Profile-page-saggested-salon-card snap-start last:!mr-4"
              key={item}
            >
              <div className="N-Profile-page-suggested-salon-card-img relative rounded-2xl drop-shadow shadow">

                <Skeleton height={200} width="100%" borderRadius="1rem" />

                <div className="absolute top-2 right-2 z-10 h-6 w-6">
                  <Skeleton circle height={24} width={24} />
                </div>

                <div className="offer-tag-p-s-s">
                  <Skeleton height={40} width={120} />
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            {nearBySalonsState?.retryCount
              ? `Loading... (Attempt ${nearBySalonsState.retryCount})`
              : "Loading..."}
          </p>
        </div>

      </div>
    );
  }

  // If no data and no retry → still show section (DO NOT RETURN NULL)
  return (
    <div className="pt-3 lg:pt-10">

      <div className="mx-4 flex justify-between md:mx-10">
        <h1 className="text-xl font-semibold">Best salons near you</h1>
      </div>

      <div className="text-center py-10 text-gray-400">
        No salons available nearby
      </div>

    </div>
  );
}

  return (
    <div className="pt-3 lg:pt-10">
      <div className="mx-4 flex justify-between md:mx-10">
        <h1 className="text-xl font-semibold">Best salons near you</h1>
        <button
          className=" font-light text-slate-800 underline"
          onClick={async () => {
           let latLong = {
  latitude: location?.latitude || nearBySalonsState.latitude,
  longitude: location?.longitude || nearBySalonsState.longitude,
};
            console.log("latLong :: ", latLong);
            if (latLong.latitude === 0 && latLong.longitude === 0) {
              latLong = await getCoordinateByCity(
                nearBySalonsState?.preferableCity
              );
              console.log("latLong after city :: ", latLong);
            }
            navigate(
              `/${nearBySalonsState?.preferableCity?.toLowerCase()}/list/?distance=within_5&latitude=${
                latLong.latitude
              }&longitude=${latLong.longitude}`
            );
          }}
        >
          More
        </button>
      </div>
      <div className="N-Profile-page-suggested-salons ml-[5px] snap-x snap-proximity md:ml-[30px]">
        {nearBySalonsState?.data?.map((item, index) => {
          const { offerFormat, offerContent } = getOfferFormat(
            item?.custom_offer_tag,
            item?.offer_tag
          );
          return (
            <Link
              to={`/${encodeURIComponent(item?.city)}/${encodeURIComponent(
                item?.area
              )}/salons/${encodeURIComponent(item?.slug)}`}
              className="N-Profile-page-saggested-salon-card snap-start last:!mr-4"
              key={index}
            >
              <div className="N-Profile-page-suggested-salon-card-img relative rounded-2xl drop-shadow shadow">
                <img src={item?.main_image} alt="" />
                {!userFavorites?.some((item1) => {
                  let res = item1?.salon === item?.id;
                  return res;
                }) ? (
                  <div className=" absolute top-2 right-2 z-10 h-6 w-6">
                    <img
                      src={heart_svg}
                      alt="Added to favorites"
                      className="h-full w-full !object-contain !rounded-none"
                    />
                  </div>
                ) : (
                  <div className=" absolute top-[5px] right-[6px] z-10 h-7 w-7">
                    <FcLike className="w-full h-full" />
                  </div>
                )}
                <div className="offer-tag-p-s-s">
                  <span>
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
                          {offerContent.split(" ")[1].toUpperCase()} OFF
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
                          {offerContent.split(" ").slice(-2)[0].toUpperCase()}{" "}
                          {offerContent.split(" ").slice(-1)[0].toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </span>
                </div>
                {item?.premium && (
                  <div className="premium_div-x absolute">
                    <div className="premium-text">Premium</div>
                  </div>
                )}
              </div>
              <div className="N-Profile-page-suggested-salon-card-content">
                <h2>{item?.name}</h2>
                <p className="N-P-S-S-score">
                  <img src={Score_svg} alt="Customer rating score" />
                  <span>
                    {item?.avg_score ? String(item?.avg_score).slice(0, 3) : 0}
                  </span>
                </p>
                <p className="N-P-S-S-addr">
                  {item?.area} , {item?.city}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};


const SalonsListInfi = () => {
  const params = useParams();
  const { userFavorites } = useContext(AuthContext);

  const navigate = useNavigate();

  const [salonData, setSalonData] = useState([]);
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [visible, setVisible] = useState(() => {
    if (window.innerWidth < 768) {
      return 6;
    } else {
      return 6;
    }
  });

  const getSalonByCity = async (city, pageCount) => {
    // const capitalizeString = (str) => {
    //   if (!str) return '';
    //   // Step 1: Remove any non-alphabetic characters (except spaces and dashes)
    //   const cleanedStr = str.replace(/[^a-zA-Z -]/g, '');
    //   // Step 2: Replace multiple spaces or dashes with a single dash
    //   const dashedStr = cleanedStr.replace(/[\s-]+/g, '-');
    //   // Step 3: Capitalize each word
    //   return dashedStr.toLowerCase()
    //     .split('-')
    //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    //     .join('-');
    // };

    // // Format all parameters
    // const formattedCity = capitalizeString(params.city);
    // const formattedArea = capitalizeString(params.area);
    let url = `https://backendapi.trakky.in/salons/filter/?page=${pageCount}&city=${city}&verified=true`;

    setIsLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (res.ok) {
        if (pageCount === 1) {
          setSalonData(data?.results);
          setIsNext(data?.next);
        } else {
          let newData = [...salonData, ...data?.results];

          setSalonData(newData);
          setIsNext(data?.next);
          setVisible(newData?.length);
        }
      }
      setIsLoading(false);
    } catch {
      console.log("Error in fetching salon data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params?.city) {
      getSalonByCity(params?.city, page);
    }
  }, [params?.city, page]);

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

  return (
    <div className="pt-5 lg:pt-10">
      {salonData?.length > 0 && (
        <div className="mx-4 flex justify-between md:mx-10">
          <h1 className="text-xl font-semibold">
            Salons in {capitalizeAndFormat(params?.city)}
          </h1>
        </div>
      )}
      {window.innerWidth < 768 ? (
        <div className="mt-3 flex flex-col gap-4">
          {salonData?.slice(0, visible)?.map((item, index) => {
            const { offerFormat, offerContent } = getOfferFormat(
              item?.custom_offer_tag,
              item?.offer_tag
            );

            return (
              <div
                className="flex gap-3 mx-4 md:mx-10 cursor-pointer"
                onClick={() => {
                  navigate(`/${item?.city}/${item?.area}/salons/${item?.slug}`);
                }}
              >
                <div className="w-[150px] h-[170px] shadow-xl drop-shadow rounded-xl relative bg-gray-200 shrink-0">
                  <div className="absolute rounded-b-xl block bottom-0 left-0 w-full h-14 bg-gradient-to-t from-[#000000da] to-[#00000000] z-10"></div>
                  <div className="absolute rounded-t-xl block top-0 left-0 w-full h-10 bg-gradient-to-b from-[#000000bf] to-[#00000000] z-10"></div>
                  {item?.main_image && (
                    <img
                      src={item?.main_image}
                      className="w-full h-full object-cover rounded-xl blur-[0.1px] "
                      alt=""
                    />
                  )}
                  {!userFavorites?.some((item1) => {
                    let res = item1?.salon === item?.id;
                    return res;
                  }) ? (
                    <div className=" absolute top-2 right-2 z-10 h-6 w-6">
                      <img
                        src={heart_svg}
                        alt="Added to favorites"
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className=" absolute top-[5px] right-[6px] z-10 h-7 w-7">
                      <FcLike className="w-full h-full" />
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 z-10">
                    <span>
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
                            {offerContent.split(" ")[1].toUpperCase()} OFF
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
                            {offerContent.split(" ").slice(-2)[0].toUpperCase()}{" "}
                            {offerContent.split(" ").slice(-1)[0].toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
                  {item?.premium && (
                    <div className="premium_div-x absolute">
                      <div className="premium-text">Premium</div>
                    </div>
                  )}
                </div>

                <div className="">
                  <h3 className="text-lg font-semibold">{item?.name}</h3>
                  <div className="flex gap-2">
                    <img
                      src={Score_svg}
                      className=" invert-[0.5]"
                      alt="Customer rating score"
                    />
                    <span className="font-semibold">
                      {item?.avg_score?.toFixed(1) || 0}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {item?.area} , {item?.city}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="N-lp-card-listing-container !mt-1 lg:!mt-3 ">
          {salonData?.slice(0, visible)?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })}
        </div>
      )}
      {isLoading ? (
        <div className="w-full h-20 flex justify-center items-center">
          <div className=" loader"></div>
        </div>
      ) : (
        (isNext || visible < salonData?.length) && (
          <div
            className=" whitespace-nowrap border border-slate-600 px-3 py-1 rounded-3xl w-fit mx-auto mt-5 drop-shadow-sm shadow-sm min-w-max cursor-pointer text-center"
            onClick={() => {
              if (visible < salonData?.length) {
                setVisible(salonData?.length);
              } else {
                setPage(page + 1);
              }
            }}
          >
            See All Salons
          </div>
        )
      )}
    </div>
  );
};

const AboutUs = () => {
  let param = useParams();
  let city = param.city.charAt(0).toUpperCase() + param.city.slice(1);

  return (
    <div className="mx-[15px] mt-4 shadow drop-shadow-sm rounded-xl p-3 md:mx-10">
      {/* <AnimatedHeading> */}
      <h3 className="px-2 pb-3 text-xl font-semibold">About Us</h3>
      {/* </AnimatedHeading> */}
      <div className="text-sm">
        <p className="px-2">
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