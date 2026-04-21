import React, { useEffect, useState, useContext } from "react";
import "./Services/service.css";
import "./salonprofilepage.css";
import Skeleton from "react-loading-skeleton";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../../../context/Auth";
import Grids from "../../../Assets/images/icons/white_grid.svg";
import Gallery2 from "../../Common/Gallery2/Gallary.jsx";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FcLike } from "react-icons/fc";
import { MdFavoriteBorder } from "react-icons/md";
import Services from "./Services/Service";
import ClientWorkPhoto from "./ClientWorkImages/ClientWorkImages";
import SalonDailyUpdates from "./DailyUpdates/DailyUpdates";
import AboutUsSalon from "./AboutUs/AboutUs";
import Score_svg from "../../../Assets/images/icons/score_svg.svg";
import Info_svg from "../../../Assets/images/icons/info_i_svg.svg";
import share_svg from "../../../Assets/images/icons/share_svg.svg";
import share_w_svg from "../../../Assets/images/icons/share_w-svg.svg";
import MemberShip from "./membership/MemberShip";
import FooterN from "../../Common/Footer/FooterN";
import CustomerExp from "./ModalComponent/CustomerExp";
import MemberShipModal from "./ModalComponent/MemberShipModal";
import AboutUsModal from "./ModalComponent/AboutUsModal";
import UserScoreModal from "./ModalComponent/UserScoreModal";
import GrommingPackages from "./GroomingPackages/GrommingPackages";
import OfferSalon from "./OfferSalon/OfferSalon.jsx";
import { Avatar } from "@mui/material";
import Signup from "../../Common/Header/SignUp2/Signup.jsx";
import toast, { Toaster } from "react-hot-toast";
import loading_gif from "../../../Assets/images/logos/Trakky website graphics.gif";
import ProfilepageHeader from "../../Common/Navbar/ProfilepageHeader.jsx";
import SalonTimingModal from "./ModalComponent/SalonTimingModal.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Close,
  InfoSharp,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { capitalizeAndFormat } from "../../functions/generalFun.js";
import moment from "moment";
import ServiceDetailsModal from "./ModalComponent/ServiceDetailModal.jsx";
import AddToCartBar from "../../BookingModule/AddToCartBar";
import BookingModule from "../../BookingModule/BookingModule.jsx";

// Import OfferSalonModal
import OfferSalonModal from "./ModalComponent/OfferSalonModal.jsx";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const SalonProfile = () => {
  const {
    user,
    authTokens,
    location,
    userFavorites,
    fetchUserFavorites,
    userData,
    fetchUserData,
  } = useContext(AuthContext);

  // Add this state to your component
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();
  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  const swiperRef = React.useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mainImageSkeleton, setMainImageSkeleton] = useState(true);
  const [salon, setSalon] = useState(null);
  const [main_salon_data, setMainSalonData] = useState(null);
  const [main_salon_data1, setMainSalonData1] = useState([]);
  const [main_salon_data2, setMainSalonData2] = useState([]);

  // BOOKING MODULE STATES
  const [selectedServices, setSelectedServices] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [lastUpdatedFrom, setLastUpdatedFrom] = useState(null);

  // Service related states
  const [allServices, setAllServices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [activeServiceGender, setActiveServiceGender] = useState("male");
  const [categoryListOfGender, setCategoryListOfGender] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [genderFilteredServices, setGenderFilteredServices] = useState([]);
  const [activeServiceData, setActiveServiceData] = useState([]);
  const [desktopVisibleScore, setDesktopVisibleScore] = useState(5);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [userNameOfUser, setUserNameOfUser] = useState("");
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);

  const [suggestedSalonData, setSuggestedSalonData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [activeScore, setActiveScore] = useState(5);
  const [salonOfferData, setSalonOfferData] = useState([]);
  const [salonOfferDataMain, setSalonOfferDataMain] = useState([]);
  const [timings, setTimings] = useState("");

  // Modal states
  const [salonProfilePhotosTrigger, setSalonProfilePhotosTrigger] =
    useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openAboutUs, setOpenAboutUs] = useState(false);
  const [openServiceDetails, setOpenServiceDetails] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [openSalonTiming, setOpenSalonTiming] = useState(false);
  const [userNameChangeModal, setUserNameChangeModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [dailyUpdatesOpen, setDailyUpdatesOpen] = useState(false);
  const [userScoreModal, setUserScoreModal] = useState(false);
  const [clientExpOpen, setClientExpOpen] = useState(false);
  const [offerrModalOpen, setOfferModalOpen] = useState(false);
  const [offerModalData, setOfferModalData] = useState({});
  const [openModalType, setOpenModalType] = useState("");
  const [firstTimeUser, setFirstTimeUser] = useState(false);

  // Search params
  const [searchParams, setSearchParams] = useSearchParams();

  // Zoom image states
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  // Get URL parameters
  const offerId = searchParams.get("offer");
  const offerType = searchParams.get("offer-type");

  useEffect(() => {
    if (salonProfilePhotosTrigger) {
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;

      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [salonProfilePhotosTrigger]);

  useEffect(() => {
    if (salonProfilePhotosTrigger) {
      // Lock kar do
      disableBodyScroll(document.body);
    } else {
      // Unlock kar do
      enableBodyScroll(document.body);
    }

    // Cleanup – important hai
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [salonProfilePhotosTrigger]);

  // Handle book service function - UPDATED
  const handleBookService = (service, quantity, action, source) => {
    if (!user) {
      handleSignInOpen();
      return;
    }

    setLastUpdatedFrom(source);
    setSelectedServices((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === service.id);

      if (action === "add") {
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
          return updated;
        }
        return [...prev, { ...service, quantity: 1 }];
      } else if (action === "update") {
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: quantity,
          };
          return updated;
        }
        return prev;
      } else if (action === "remove") {
        return prev.filter((s) => s.id !== service.id);
      }
      return prev;
    });

    // Open booking module when service is added
    if (action === "add") {
      setIsBookingOpen(true);
    }
  };

  // Handle book offer function
  const handleBookOffer = (offer) => {
    if (!user) {
      localStorage.setItem("pendingOffer", JSON.stringify(offer));
      handleSignInOpen();
      return;
    }

    const offerAsService = {
      id: offer.id,
      name: offer.name || offer.display_name,
      price: offer.discount_price || offer.price,
      actual_price: offer.actual_price || offer.price,
      description: offer.display_sub_name || offer.name,
      terms_and_conditions: offer.terms_and_conditions,
      image: offer.image,
      isOffer: true,
      expire_date: offer.expire_date,
      service_time: offer.offer_time
        ? JSON.parse(offer.offer_time)
        : { hours: 0, minutes: 30 },
    };

    setSelectedServices((prev) => [...prev, offerAsService]);
    setIsBookingOpen(true);
  };

  // Modal handlers
  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);

  const handleSalonProfilePhotosClose = () => {
    window.history.back();
    setSalonProfilePhotosTrigger(false);
  };

  const handleSalonProfilePhotosOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setSalonProfilePhotosTrigger(true);
  };

  const handleAboutUsOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setOpenAboutUs(true);
  };

  const handleAboutUsClose = () => {
    window.history.back();
    setOpenAboutUs(false);
  };

  const handleServiceDetailsOpen = (servId, direct = false) => {
    if (!direct) {
      window.history.pushState(null, null, window.location.href);
    }
    setServiceId(servId);
    setOpenServiceDetails(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("master_service", servId);
    setSearchParams(newParams);
  };

  const handleServiceDetailsClose = () => {
    setOpenServiceDetails(false);
    if (!firstTimeUser) {
      window.history.back();
      setSearchParams("");
    } else {
      setSearchParams("");
      setFirstTimeUser(false);
    }
  };

  const handleDailyUpdatesOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setDailyUpdatesOpen(true);
  };

  const handleDailyUpdatesClose = () => {
    window.history.back();
    setDailyUpdatesOpen(false);
  };

  const handleUserScoreOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setUserScoreModal(true);
  };

  const handleUserScoreClose = () => {
    window.history.back();
    setUserScoreModal(false);
  };

  const handleClientExpOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setClientExpOpen(true);
  };

  const handleClientExpClose = () => {
    window.history.back();
    setClientExpOpen(false);
  };

  const handleOfferOpen = (data, type, direct = false) => {
    if (!direct) {
      window.history.pushState(null, null, window.location.href);
    }
    setOfferModalData(data);
    setOfferModalOpen(true);
    setOpenModalType(type);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("offer", data?.id);
    newParams.set("offer-type", type);
    setSearchParams(newParams);
  };

  const handleModalClose = () => {
    setOfferModalOpen(false);
    setOfferModalData({});
    setOpenModalType("");

    // Clear offer parameters from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("offer");
    newParams.delete("offer-type");
    setSearchParams(newParams);
    setFirstTimeUser(false);
  };

  // Effect to open offer modal from URL parameters - with better logic
  useEffect(() => {
    // Only proceed if we have an offer ID and valid offer type
    if (!offerId || !offerType) return;

    if (offerType !== "offer" && offerType !== "national-offer") return;

    // Check if offer data is loaded
    const areOffersLoaded =
      salonOfferData.length > 0 || salonOfferDataMain.length > 0;

    if (areOffersLoaded) {
      const foundOffer = findOfferById(offerId);
      if (foundOffer) {
        // Use a small timeout to ensure state updates properly
        const timer = setTimeout(() => {
          setOfferModalData(foundOffer);
          setOpenModalType(offerType);
          setOfferModalOpen(true);
        }, 300);

        return () => clearTimeout(timer);
      } else {
        console.warn(`Offer with ID ${offerId} not found in loaded data`);
      }
    }
  }, [salonOfferData, salonOfferDataMain, offerId, offerType]);

  // API functions
  const getScoreBySalon = async (salonId) => {
    let url = `https://backendapi.trakky.in/salons/score/?salon=${salonId}&salon_slug=${slug}`;
    try {
      let res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      setScoreData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserScore = async (e) => {
    if (!user?.user_id) {
      setOpenSignIn(true);
      return;
    }
    if (user?.user_id && userData) {
      if (!userData?.name) {
        setUserNameChangeModal(true);
        return;
      }
    }
    if (user?.user_id && activeScore) {
      handleSubmitScore();
    }
  };

  const handleSubmitScore = async (e) => {
    let url = `https://backendapi.trakky.in/salons/score/`;
    let Scoredata = {
      salon: main_salon_data?.id,
      score: activeScore,
    };
    try {
      let res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify(Scoredata),
      });
      getScoreBySalon(main_salon_data?.id);
      if (res.status === 201) {
        toast.success("Score added successfully.", {
          duration: 2000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setMiddleScore = () => {
    const swiper = swiperRef.current?.swiper;
    if (swiper) {
      setActiveScore(swiper.activeIndex + 1);
      swiper.slideTo(swiper.activeIndex, 0);
    }
  };

  const calculateScore = (scoreData) => {
    let totalScore = 0;
    scoreData?.map((item) => {
      totalScore += item.score;
    });
    if (scoreData.length === 0) {
      return 0;
    }
    let finalVal = (totalScore / scoreData.length).toFixed(1);
    if (finalVal === "NaN") {
      return 0;
    }
    if (finalVal % 1 === 0) {
      return parseInt(finalVal);
    }
    return finalVal;
  };

  const handleShare = () => {
    if (!navigator.share) {
      document.execCommand("copy", true, window.location.href);
      alert("Link copied to clipboard");
      return;
    }
    navigator
      .share({
        title: main_salon_data?.name || "Trakky",
        text: "Check out this salon",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  const getSalonTimings = async () => {
    let weeklytiming = main_salon_data?.salon_timings;
    if (!weeklytiming) {
      return;
    }
    let today = await moment().format("dddd").toLowerCase();
    if (weeklytiming[today] === "closed") {
      return "Closed today";
    }
    let openTime = weeklytiming[today]?.open_time;
    let closeTime = weeklytiming[today]?.close_time;
    let formatedOpenTime = formateTime(openTime);
    let formatedCloseTime = formateTime(closeTime);
    return `Opens ${formatedOpenTime} - ${formatedCloseTime}`;
  };

  const formateTime = (time) => {
    if (!time) {
      return;
    }
    let [hour, minute] = time.split(":");
    let formatedTime = "";
    if (parseInt(hour) > 12) {
      formatedTime = `${parseInt(hour) - 12}:${minute} PM`;
    } else {
      formatedTime = `${parseInt(hour)}:${minute} AM`;
    }
    if (parseInt(hour) === 12) {
      formatedTime = `${hour}:${minute} PM`;
    }
    if (parseInt(hour) === 0) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(hour) === 24) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(minute) === 0) {
      formatedTime =
        parseInt(hour) > 12
          ? `${parseInt(hour) - 12} PM`
          : parseInt(hour) === 0
            ? `12 AM`
            : `${parseInt(hour)} AM`;
    }
    return formatedTime;
  };

  const handleBookNowBtn = () => {
    if (!main_salon_data?.name) {
      return;
    }
    logBookNowEntry(main_salon_data?.name);
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20salon%20services%20%26%20offers%20of%20${encodeURIComponent(
      main_salon_data?.name,
    )}%2C%20${encodeURIComponent(main_salon_data?.area)}%2C%20${encodeURIComponent(
      main_salon_data?.city,
    )}%3F`;
    window.open(link, "_blank");
  };

  const log_adder = async (name, type) => {
    const requestBody = {
      category: "salon",
      name: name,
      location,
      actiontype: type,
    };
    if (user != null) {
      requestBody.salon_user = user?.user_id || null;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/log-entry/",
        requestOptions,
      );
      if (!response.ok) {
        throw new Error("Failed to log entry");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error logging entry:", error.message);
    }
  };

  const logBookNowEntry = async (salonName) => {
    const requestBody = {
      category: "salon",
      name: salonName,
      location,
      actiontype: "book_now",
    };
    if (user != null) {
      requestBody.salon_user = user?.user_id || null;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/book-now-log-entry/",
        requestOptions,
      );
      if (!response.ok) {
        throw new Error("Failed to log book now entry");
      }
      const data = await response.json();
      console.log("Book now log entry:", data);
    } catch (error) {
      console.error("Error logging book now entry:", error.message);
    }
  };

  const handlelike = async (id) => {
    if (!authTokens || !id) {
      return;
    }
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          salon: id,
        }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        fetchUserFavorites();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledislike = async (id) => {
    let likeId = userFavorites?.find((item) => item.salon === id)?.id;
    if (!likeId) {
      return;
    }
    const response = await fetch(
      `https://backendapi.trakky.in/salons/userfavorite/${likeId}/`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
    fetchUserFavorites();
  };

  const getSuggestedSalon = async (city, area) => {
    let url = `https://backendapi.trakky.in/salons/suggested-salon/?city=${encodeURIComponent(
      city,
    )}&area=${encodeURIComponent(area)}&verified=true`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      let data1 = await data?.filter((item) => item.slug !== params?.slug);
      setSuggestedSalonData(data1);
    } catch (error) {
      console.log(error);
    }
  };

  const get_main_data = async () => {
    setIsLoading(true);
    let url = `https://backendapi.trakky.in/salons/list/?slug=${slug}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const salon_data = data?.results[0];
      if (!salon_data) {
        throw new Error("Salon not found");
      }
      setMainSalonData(salon_data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const get_main_data1 = async (city, area, salonId) => {
    let url = `https://backendapi.trakky.in/salons/service/?city=${city}&salon_id=${salonId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMainSalonData1(data);
      setAllServices(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load services");
    }
  };

  const fetchSalonCategories = async (salonId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/category/?salon_id=${salonId}`,
      );
      const data = await response.json();
      console.log("category_data", data);
      setAllCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const get_main_data2 = async () => {
    const url = `https://backendapi.trakky.in/salons/client-image-site/?salon_slug=${slug}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        console.log("Error fetching main data");
        return;
      }

      let filteredData = [];
      if (Array.isArray(data?.results)) {
        filteredData = data.results;
      } else if (Array.isArray(data)) {
        filteredData = data;
      } else if (data && typeof data === "object") {
        filteredData = [data];
      }

      setMainSalonData2(filteredData);
    } catch (error) {
      console.error("Error fetching salon data:", error);
    }
  };

  const getOfferFormat = (custom_offer_tag, offer_tag) => {
    let offerFormat = "";
    let offerContent = "";
    if (custom_offer_tag === null || custom_offer_tag === undefined) {
      offerContent = offer_tag;
      return { offerFormat, offerContent };
    }
    const offerParts = custom_offer_tag?.split(" ");
    if (offerParts[0] === "Get") {
      if (offerParts[1].endsWith("%")) {
        offerFormat = "percentage";
        offerContent = custom_offer_tag;
      } else if (offerParts[offerParts.length - 1] === "off") {
        offerFormat = "fixed-amount";
        offerContent = custom_offer_tag;
      } else {
        offerFormat = "fixed-amount-service";
        offerContent = custom_offer_tag;
      }
    } else {
      offerFormat = "service-price";
      offerContent = custom_offer_tag;
    }
    return { offerFormat, offerContent };
  };

  const getOfferOfSalonProfile = async (salonId) => {
    let url = `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_id=${salonId}&active_only`;
    try {
      let res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      setSalonOfferData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMainOfferOfSalonProfile = async () => {
    let url = `https://backendapi.trakky.in/salons/national-hero-offers/?salon_slug=${slug}`;
    try {
      let res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await res.json();
      setSalonOfferDataMain(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to find offer by ID
  const findOfferById = (offerId) => {
    let foundOffer = null;

    // First search in the appropriate array based on offerType
    if (offerType === "national-offer") {
      // For national offers, search in salonOfferDataMain first
      foundOffer = salonOfferDataMain.find(
        (offer) => offer.id === parseInt(offerId),
      );
      // If not found, try salonOfferData as fallback
      if (!foundOffer) {
        foundOffer = salonOfferData.find(
          (offer) => offer.id === parseInt(offerId),
        );
      }
    } else {
      // For regular offers, search in salonOfferData first
      foundOffer = salonOfferData.find(
        (offer) => offer.id === parseInt(offerId),
      );
      // If not found, try salonOfferDataMain as fallback
      if (!foundOffer) {
        foundOffer = salonOfferDataMain.find(
          (offer) => offer.id === parseInt(offerId),
        );
      }
    }

    return foundOffer;
  };

  // Function to automatically open offer modal based on URL
  const openOfferFromURL = () => {
    if (offerId && (offerType === "offer" || offerType === "national-offer")) {
      const foundOffer = findOfferById(offerId);
      if (foundOffer) {
        // Small delay to ensure all data is loaded
        setTimeout(() => {
          setOfferModalData(foundOffer);
          setOpenModalType(offerType); // Use the actual offerType from URL
          setOfferModalOpen(true);
        }, 500);
      }
    }
  };

  // Effect to open offer modal from URL parameters
  useEffect(() => {
    // Check if we have offer data loaded and URL has offer parameters
    if (
      (salonOfferData.length > 0 || salonOfferDataMain.length > 0) &&
      offerId &&
      (offerType === "offer" || offerType === "national-offer")
    ) {
      openOfferFromURL();
    }
  }, [salonOfferData, salonOfferDataMain, offerId, offerType]);

  // Add debugging log
  useEffect(() => {
    if (offerId && offerType) {
      console.log(
        `Detected URL parameters - Offer ID: ${offerId}, Type: ${offerType}`,
      );
    }
  }, [offerId, offerType]);

  const handleSubmitUserName = async (e) => {
    e.preventDefault();
    setNameUpdateLoading(true);
    if (!userNameOfUser) {
      toast.error("Please enter your name.");
      setNameUpdateLoading(false);
      return;
    }
    if (!user) {
      toast.error("User not found. Please login.");
      setNameUpdateLoading(false);
      return;
    }
    let url = `https://backendapi.trakky.in/salons/salonuser/${user?.user_id}/`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
      body: JSON.stringify({
        name: userNameOfUser,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserNameOfUser("");
        setUserNameChangeModal(false);
        toast.success("Name updated successfully.", {
          duration: 2000,
        });
        handleSubmitScore();
        setNameUpdateLoading(false);
        fetchUserData();
      })
      .catch((error) => {
        toast.error("Failed to update Name. Please try again.");
        setNameUpdateLoading(false);
      });
  };

  const getProductOfSalon = async (salon_slug) => {
    let url = `https://backendapi.trakky.in/salons/productofsalon/?salon_slug=${salon_slug}`;
    try {
      let res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        let data = await res.json();
        setProductData(data?.results || []);
      } else {
        console.error("Error fetching products:", res.status, res.statusText);
        setProductData([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Image zoom handlers
  const handleImageClick = (image, index) => {
    const imagesArray = [
      main_salon_data?.main_image,
      ...(main_salon_data?.mul_images?.map((img) => img.image) || []),
    ];
    setAllImages(imagesArray);
    setCurrentImageIndex(index);
    setZoomedImage(image);
  };

  const handleNextImage = () => {
    if (allImages.length > 0) {
      const nextIndex = (currentImageIndex + 1) % allImages.length;
      setCurrentImageIndex(nextIndex);
      setZoomedImage(allImages[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (allImages.length > 0) {
      const prevIndex =
        (currentImageIndex - 1 + allImages.length) % allImages.length;
      setCurrentImageIndex(prevIndex);
      setZoomedImage(allImages[prevIndex]);
    }
  };

  // Effects
  useEffect(() => {
    if (main_salon_data1?.length === 0) {
      return;
    }
    let filterservice = main_salon_data1?.filter((service) => {
      return service?.gender?.toLowerCase() === "male";
    });
    if (filterservice?.length === 0) {
      setActiveServiceGender("female");
    }
  }, [main_salon_data1]);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(activeScore - 1, 0);
    }
  }, [activeScore]);

  useEffect(() => {
    if (slug) {
      getProductOfSalon(slug);
      get_main_data();
      get_main_data2();
      getMainOfferOfSalonProfile();
    }
  }, [slug]);

  useEffect(() => {
    if (main_salon_data) {
      getScoreBySalon(main_salon_data?.id);
      getOfferOfSalonProfile(main_salon_data?.id);
      fetchSalonCategories(main_salon_data?.id);
    }
  }, [main_salon_data]);

  useEffect(() => {
    if (params?.city && params?.area) {
      getSuggestedSalon(params?.city, params?.area);
    }
  }, [params?.city, params?.area]);

  useEffect(() => {
    if (params?.city && params?.area && main_salon_data) {
      get_main_data1(params?.city, params?.area, main_salon_data?.id);
    }
  }, [params?.city, params?.area, main_salon_data]);

  // Service filtering effects
  useEffect(() => {
    if (allCategories.length > 0) {
      let filteredCategories = allCategories.filter((category) => {
        return (
          category?.category_gender?.toLowerCase() ===
          activeServiceGender.toLowerCase()
        );
      });
      filteredCategories.sort((a, b) => a.priority - b.priority);
      filteredCategories.unshift({ id: "all", name: "All Services" });
      setActiveCategory(filteredCategories[0]?.id);
      setCategoryListOfGender(filteredCategories);
    }
  }, [allCategories, activeServiceGender]);

  useEffect(() => {
    if (main_salon_data1.length > 0) {
      let filteredServices = main_salon_data1.filter((service) => {
        return (
          service?.gender?.toLowerCase() ===
            activeServiceGender.toLowerCase() && service?.salon_slug === slug
        );
      });
      const groupedByCategoryPriority = {};
      filteredServices.forEach((service) => {
        const categoryPriority =
          service.master_service_data?.category?.priority || 0;
        if (!groupedByCategoryPriority[categoryPriority]) {
          groupedByCategoryPriority[categoryPriority] = [];
        }
        groupedByCategoryPriority[categoryPriority].push(service);
      });
      const sortedCategoryPriorities = Object.keys(
        groupedByCategoryPriority,
      ).sort((a, b) => a - b);
      const sortedServices = [];
      sortedCategoryPriorities.forEach((categoryPriority) => {
        groupedByCategoryPriority[categoryPriority].sort((a, b) => {
          const servicePriorityA = a.master_service_data?.priority || 0;
          const servicePriorityB = b.master_service_data?.priority || 0;
          return servicePriorityA - servicePriorityB;
        });
        sortedServices.push(...groupedByCategoryPriority[categoryPriority]);
      });
      setGenderFilteredServices(sortedServices);
    }
  }, [main_salon_data1, activeServiceGender, slug]);

  useEffect(() => {
    getSalonTimings().then((data) => {
      setTimings(data);
    });
  }, [main_salon_data]);

  useEffect(() => {
    if (activeCategory === "all") {
      setActiveServiceData(genderFilteredServices);
    } else {
      let filteredServices = genderFilteredServices.filter((service) => {
        return service?.categories === activeCategory;
      });
      setActiveServiceData(filteredServices);
    }
  }, [activeCategory, genderFilteredServices]);

  useEffect(() => {
    if (user) {
      const pending = localStorage.getItem("pendingOffer");
      if (pending) {
        localStorage.removeItem("pendingOffer");
        const offer = JSON.parse(pending);
        const offerAsService = {
          id: offer.id,
          name: offer.name || offer.display_name,
          price: offer.discount_price || offer.price,
          actual_price: offer.actual_price || offer.price,
          description: offer.display_sub_name || offer.name,
          terms_and_conditions: offer.terms_and_conditions,
          image: offer.image,
          isOffer: true,
          expire_date: offer.expire_date,
          service_time: offer.offer_time
            ? JSON.parse(offer.offer_time)
            : { hours: 0, minutes: 30 },
        };
        setSelectedServices((prev) => [...prev, offerAsService]);
        setIsBookingOpen(true);
      }
    }
  }, [user]);

  // Keyboard navigation for zoomed images
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (zoomedImage) {
        if (e.key === "ArrowRight") {
          handleNextImage();
        } else if (e.key === "ArrowLeft") {
          handlePrevImage();
        } else if (e.key === "Escape") {
          setZoomedImage(null);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomedImage, currentImageIndex, allImages]);

  // Effect to open offer modal from URL parameters
  useEffect(() => {
    // Check if we have offer data loaded and URL has offer parameters
    if (
      (salonOfferData.length > 0 || salonOfferDataMain.length > 0) &&
      offerId &&
      (offerType === "offer" || offerType === "national-offer")
    ) {
      openOfferFromURL();
    }
  }, [salonOfferData, salonOfferDataMain, offerId, offerType]);

  // Popstate handler
  // Popstate handler
  useEffect(() => {
    const handlePopState = () => {
      console.log("Popstate detected");
      if (dailyUpdatesOpen) {
        setDailyUpdatesOpen(false);
      }
      if (clientExpOpen) {
        setClientExpOpen(false);
      }
      if (salonProfilePhotosTrigger) {
        setSalonProfilePhotosTrigger(false);
      }
      if (userScoreModal) {
        setUserScoreModal(false);
      }
      if (openAboutUs) {
        setOpenAboutUs(false);
      }
      if (offerrModalOpen) {
        setOfferModalOpen(false);
        // Clear only offer-related parameters
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("offer");
        newParams.delete("offer-type");
        setSearchParams(newParams);
      }
      if (openServiceDetails) {
        setOpenServiceDetails(false);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("master_service");
        setSearchParams(newParams);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    dailyUpdatesOpen,
    clientExpOpen,
    salonProfilePhotosTrigger,
    userScoreModal,
    openAboutUs,
    offerrModalOpen,
    openServiceDetails,
  ]);

  return isLoading ? (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <img
          src={loading_gif}
          className="h-[200px] w-[200px]"
          alt="Loading... please wait"
        />
      </div>
    </>
  ) : (
    <div className="w-full">
      <Helmet>
        <title>
          {main_salon_data?.name}, {capitalizeAndFormat(params?.area)},{" "}
          {capitalizeAndFormat(params?.city)} | Trakky
        </title>
        <meta
          name="description"
          content={`${main_salon_data?.name}, ${capitalizeAndFormat(
            params?.area,
          )}, ${capitalizeAndFormat(params?.city)}, view reviews, ${
            main_salon_data?.name
          } offers,  menu of ${main_salon_data?.name}, contact detail of ${
            main_salon_data?.name
          }, location of ${main_salon_data?.name},`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/${params?.area}/salons/${params?.slug}`}
        />
      </Helmet>
      <Toaster />
      <ProfilepageHeader handleOpenLogin={handleSignInOpen} />

      {/* Desktop View */}
      {window.innerWidth > 768 ? (
        <>
          <div className="NW-salon-main-container">
            <div className="NW-salon-main-data">
              <div className="NW-image-main-container">
                <div className=" w-[100%]   h-[270px]  max-h-[270px] lg:h-[370px] lg:max-h-[370px] gap-3  grid grid-cols-2  ">
                  <div className=" w-[100%] h-[370px] lg:h-[370px] ">
                    <img
                      src={main_salon_data?.main_image}
                      onLoad={() => {
                        setMainImageSkeleton(false);
                      }}
                      className={`${
                        mainImageSkeleton ? "hidden" : "block"
                      } object-fit  w-[100%]  h-[100%] cursor-pointer`}
                      alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Service"
                      onClick={() =>
                        handleImageClick(main_salon_data?.main_image, 0)
                      }
                    />
                    {mainImageSkeleton && (
                      <Skeleton
                        variant="rectangle"
                        className=" w-[100%] h-[100%] "
                      />
                    )}
                  </div>
                  <div className="   grid grid-cols-2  grid-rows-2 h-[280px] lg:h-[360px] gap-3 min-h-[270px]  max-h-[270px] lg:min-h-[370px]  lg:max-h-[370px] ">
                    {main_salon_data?.mul_images ? (
                      main_salon_data.mul_images
                        .slice(0, 4)
                        .map((url, index) => {
                          return (
                            <div className="w-[100%] h-[100%]  " key={index}>
                              <img
                                src={url?.image}
                                className={` ${
                                  mainImageSkeleton ? "hidden" : "block"
                                } h-[100%] w-[100%] object-fit cursor-pointer`}
                                alt="Top Salons In Ahmedabad For Beauty, Hair, And Bridal Services images"
                                onClick={() =>
                                  handleImageClick(url?.image, index + 1)
                                }
                              />
                              {mainImageSkeleton && (
                                <Skeleton
                                  variant="rectangle"
                                  className=" w-[100%] h-[100%] "
                                />
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <>
                        <Skeleton
                          className=" w-[100%] h-[100%] "
                          variant="rectangle"
                        />
                        <Skeleton
                          className=" w-[100%] h-[100%] "
                          variant="rectangle"
                        />
                        <Skeleton
                          className=" w-[100%] h-[100%] "
                          variant="rectangle"
                        />
                        <Skeleton
                          className=" w-[100%] h-[100%] "
                          variant="rectangle"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="NW-salon-information__container relative">
                  <div className="NW-show-all-photos">
                    <button onClick={handleSalonProfilePhotosOpen}>
                      <img
                        src={Grids}
                        style={{
                          height: "unset",
                          width: "unset",
                        }}
                        alt="Top Salons In Ahmedabad For Beauty, Hair, And Bridal Services images"
                      />
                      Show all photos
                    </button>
                  </div>
                </div>
                {userFavorites?.some((item) => {
                  let res = item?.salon === main_salon_data?.id;
                  return res;
                }) ? (
                  <div
                    className="NW-salon-liked-btn"
                    onClick={() => {
                      user
                        ? handledislike(main_salon_data?.id)
                        : handleSignInOpen();
                    }}
                  >
                    <FcLike />
                  </div>
                ) : (
                  <div
                    className="NW-salon-liked-btn"
                    onClick={() => {
                      user
                        ? handlelike(main_salon_data?.id)
                        : handleSignInOpen();
                    }}
                  >
                    <MdFavoriteBorder />
                  </div>
                )}

                <div className="NW-salon-share-btn" onClick={handleShare}>
                  <img src={share_w_svg} alt="Share With Friends" />
                </div>
              </div>
              <div className=" text-sm leading-4 h-6 flex items-end font-light cursor-pointer">
                <span
                  onClick={() => {
                    setOpenSalonTiming(true);
                  }}
                >
                  {timings}
                </span>
              </div>
              <div className="NW-salon-name-address-container">
                <div className="NW-salon-name-container">
                  <h1 className="NW-name">
                    {main_salon_data && main_salon_data.name}
                  </h1>
                  <div className="NW-address">
                    {main_salon_data?.area}, {main_salon_data?.city}
                  </div>
                  <div className="NW-Price-onward-tag">
                    <span>
                      {" "}
                      &#8377; {main_salon_data && main_salon_data?.price}{" "}
                      Onwards
                    </span>
                  </div>
                </div>
                <div className="NW-salon-offer-tag-container">
                  <div className="NW-salon-special-tag">
                    {main_salon_data?.premium && <span>Premium</span>}
                    {main_salon_data?.bridal && <span>Bridal</span>}
                    {main_salon_data?.salon_academy && (
                      <span>Academy Salon</span>
                    )}
                  </div>
                  <div
                    className="p-3 bg-gray-400 text-white rounded-xl flex items-center gap-2 cursor-pointer"
                    onClick={handleUserScoreOpen}
                  >
                    {/* Image Parent */}
                    <div className="w-6 h-6 flex items-center justify-center">
                      <img
                        src={Score_svg}
                        alt="Customer Review Score"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Text */}
                    <span className="text-sm font-medium">
                      Score{" "}
                      {main_salon_data?.avg_score
                        ? String(main_salon_data?.avg_score).slice(0, 3)
                        : 0}
                      /10
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="NW-main-facilities-container">
              <div className="NW-contact-btn">
                <a
                  href={`tel:${main_salon_data?.mobile_number}`}
                  onClick={() => log_adder(main_salon_data?.name, "call_now")}
                >
                  Call Now
                </a>
                <button
                  onClick={() => {
                    handleBookNowBtn();
                  }}
                >
                  Book Now
                </button>
              </div>
              <div className="NW-offer-tag-salon">
                <span></span>
                <span>{main_salon_data?.offer_tag}</span>
                <span></span>
              </div>
              <div className="NW-facilities-desktop">
                {main_salon_data?.facilities &&
                  main_salon_data.facilities.map((data, index) => {
                    var iconNumber;
                    if (data === "Washroom") {
                      iconNumber = 6;
                    } else if (data === "Parking") {
                      iconNumber = 7;
                    } else if (data === "Sanitization") {
                      iconNumber = 8;
                    } else if (data === "Air conditioning") {
                      iconNumber = 9;
                    } else if (data === "Music") {
                      iconNumber = 10;
                    } else {
                      iconNumber = null;
                    }

                    return (
                      iconNumber && (
                        <div className="NW-facilities-icon" key={index}>
                          <img
                            src={require(
                              `./../../../Assets/images/icons/${iconNumber}.png`,
                            )}
                            alt="Facility available at salons in ahmedabad"
                          />
                        </div>
                      )
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Mobile View
        <div className="salon-profile-hero-section">
          <div className="salon-profile-main-images">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              <SwiperSlide>
                <img
                  src={main_salon_data?.main_image}
                  alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Services"
                  className="cursor-pointer"
                  onClick={() =>
                    handleImageClick(main_salon_data?.main_image, 0)
                  }
                />
              </SwiperSlide>

              {main_salon_data?.mul_images &&
                main_salon_data?.mul_images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image?.image}
                      alt="Top Salons In Ahmedabad For Beauty, Hair, And Bridal Services images"
                      className="cursor-pointer"
                      onClick={() => handleImageClick(image?.image, index + 1)}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
            <div
              className="salon-p-main-score-tag"
              onClick={handleUserScoreOpen}
            >
              <img src={Score_svg} alt="Customer Review Score" />
              <span>
                Score
                {main_salon_data?.avg_score
                  ? String(main_salon_data?.avg_score).slice(0, 3)
                  : 0}
                /10
              </span>
            </div>
            <div
              className="salon-p-main-info-icon"
              onClick={() => {
                handleAboutUsOpen();
              }}
            >
              <img src={Info_svg} alt="Click to view salon details" />
            </div>
            <div className="salon-p-more-photo-btn">
              <button onClick={handleSalonProfilePhotosOpen}>
                <img
                  src={Grids}
                  alt="Top Salons In Ahmedabad For Beauty, Hair, And Bridal Services images"
                />
                More Photos
              </button>
            </div>
          </div>
          <div className="salon-p-main-content">
            <div className="salon-p-main-content-inner">
              <div className="s-p-hero-opening">
                <span
                  onClick={() => {
                    setOpenSalonTiming(true);
                  }}
                >
                  {timings}
                </span>
                <div className="s-p-h-share-like-btn">
                  <button onClick={handleShare}>
                    <img src={share_svg} alt="Share with friends" />
                  </button>
                  {userFavorites?.some((item) => {
                    let res = item?.salon === main_salon_data?.id;
                    return res;
                  }) ? (
                    <button
                      onClick={() => {
                        user
                          ? handledislike(main_salon_data?.id)
                          : handleSignInOpen();
                      }}
                    >
                      <FcLike />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        user
                          ? handlelike(main_salon_data?.id)
                          : handleSignInOpen();
                      }}
                    >
                      <MdFavoriteBorder />
                    </button>
                  )}
                </div>
              </div>
              <h1 className="salon-p-hero-name">{main_salon_data?.name}</h1>
              <div className="salon-p-hero-addr">
                <div>
                  {main_salon_data?.area}, {main_salon_data?.city}
                </div>
              </div>
              <div className="salon-p-hero-price-tag">
                <div>
                  <span>₹ {main_salon_data?.price} Onwards</span>
                </div>
              </div>
              <div className="salon-p-hero-call-book-btn">
                <a
                  href={`tel:${main_salon_data?.mobile_number}`}
                  className="salon-p-hero-call-btn"
                  onClick={() => {
                    log_adder(main_salon_data?.name, "call_now");
                  }}
                >
                  Call now
                </a>
                <button
                  className="salon-p-hero-book-btn"
                  onClick={handleBookNowBtn}
                >
                  Book now
                </button>
              </div>
              <div className="salon-p-hero-special-tag">
                {main_salon_data?.premium && <span>Premium</span>}
                {main_salon_data?.bridal && <span>Bridal</span>}
                {main_salon_data?.makeup && <span>Make up</span>}
              </div>
              <div className="salon-p-hero-offer-tag">
                <span></span>
                <span>{main_salon_data?.offer_tag}</span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Experience Section */}
      {main_salon_data2 && main_salon_data2.length > 0 && (
        <>
          <div className="N-Profile-page-main-heading">
            <span>Customer's experience </span>
          </div>
          <ClientWorkPhoto
            workData={main_salon_data2}
            salonData={main_salon_data}
            handleClientExpOpen={handleClientExpOpen}
            openClientExp={clientExpOpen}
            handleClientExpClose={handleClientExpClose}
          />
        </>
      )}

      {/* Offers Section */}
      {(salonOfferData?.length > 0 || salonOfferDataMain?.length > 0) && (
        <>
          <div className="N-Profile-page-main-heading">
            <span>Offers</span>
          </div>
          <OfferSalon
            salon={main_salon_data}
            offerData={salonOfferData}
            mainOfferData={salonOfferDataMain}
            handleOfferOpen={handleOfferOpen}
            handleModalClose={handleModalClose}
            offerrModalOpen={offerrModalOpen}
            offerModalData={offerModalData}
            openModalType={openModalType}
            setOpenModalType={setOpenModalType}
            onBookOffer={handleBookOffer}
          />
        </>
      )}

      <MemberShip salon={main_salon_data} />

      {/* Services Section - UPDATED with proper booking integration */}
      <div id="salon-services">
        {main_salon_data1 && (
          <>
            <div className="N-Profile-page-main-heading">
              <span>Salon Services </span>
            </div>
            <div className="N-salon-service-main-header">
              <div className="flex items-center justify-between flex-wrap">
                <div className="N-salon-service-gender">
                  <div className="N-gender-btn-container">
                    <button
                      className={`N-gender-male ${
                        activeServiceGender == "male" ? "active" : ""
                      }`}
                      onClick={() => setActiveServiceGender("male")}
                    >
                      MALE
                    </button>
                    <button
                      className={`N-gender-female ${
                        activeServiceGender == "female" ? "active" : ""
                      }
            `}
                      onClick={() => setActiveServiceGender("female")}
                    >
                      FEMALE
                    </button>
                  </div>
                </div>

                <div className="paddingleft">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {categoryListOfGender?.length > 1 && (
                <div className="N-salon-service-category">
                  <div className="N-category-list-salon-p">
                    {categoryListOfGender?.map((item, index) => {
                      return (
                        <span
                          key={item?.id}
                          style={{
                            background:
                              activeCategory === item?.id
                                ? "linear-gradient(to right, #AE86D0 , #512DC8)"
                                : "",
                            border: activeCategory === item?.id && "none",
                            color: activeCategory === item?.id ? "white" : "",
                          }}
                          onClick={() => {
                            setActiveCategory(item?.id);
                          }}
                        >{`${item.name}`}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {window.innerWidth > 768 ? (
              <div className="N-profile-p-ser-score">
                <div className="ND-p-p-service-container">
                  {/* Services Component with booking integration */}
                  <Services
                    serviceData={activeServiceData}
                    mobile_number={main_salon_data?.mobile_number}
                    salonname={main_salon_data?.name}
                    salon={main_salon_data}
                    handleServiceDetailsOpen={handleServiceDetailsOpen}
                    main_salon_data1={main_salon_data1}
                    onBookService={handleBookService}
                    selectedServices={selectedServices}
                    searchQuery={searchQuery}
                  />
                  <GrommingPackages salon={main_salon_data} />
                </div>
                <div className="ND-score-container-outer">
                  <div className="ND-score-container">
                    <div className="ND-score-count-total">
                      <span>{calculateScore(scoreData)}/10 Score </span>{" "}
                      <span>{scoreData?.length || "0"} user Scored</span>
                    </div>
                    <div className="ND-score-give-sec">
                      <div className="ND-user-score-giving">
                        <Swiper
                          slidesPerView={5}
                          spaceBetween={30}
                          centeredSlides={true}
                          className="Score-swiper-container"
                          ref={swiperRef}
                          onSlideChange={setMiddleScore}
                          onSwiper={(swiper) => {
                            swiper.slideTo(activeScore - 1, 0);
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                            (item, index) => (
                              <SwiperSlide key={index}>
                                <div
                                  className={`score-swiper-c-item 
                    ${activeScore === item ? "active" : ""}
                    `}
                                  onClick={() => setActiveScore(item)}
                                  score-value={item}
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  {item}
                                </div>
                              </SwiperSlide>
                            ),
                          )}
                        </Swiper>
                      </div>
                      <button
                        className="ND-score-sub-btn"
                        onClick={handleUserScore}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="ND-user-score-list">
                      {scoreData
                        .slice(0, desktopVisibleScore)
                        ?.map((item, index) => (
                          <div className="ND-user-score-list-item">
                            <div className="ND-user-avtar-img">
                              <Avatar style={{ backgroundColor: "#532FCA" }}>
                                {item?.name?.[0] || "A"}
                              </Avatar>
                            </div>
                            <div className="ND-user-score-name">
                              <div className="ND-user-name-s">
                                {item?.name || "Anonymous"}
                              </div>
                              <div className="ND-user-score-s">
                                <img
                                  src={Score_svg}
                                  alt="Customer Review Score"
                                />
                                <span>{item?.score}/10 Score</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {scoreData.length > desktopVisibleScore && (
                      <div
                        className=" w-fit px-4 py-[2px] mx-auto mt-3 border border-gray-700 rounded-2xl shadow-sm cursor-pointer "
                        onClick={() => {
                          setDesktopVisibleScore(desktopVisibleScore + 5);
                        }}
                      >
                        See more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile Services Component with booking integration */}
                <Services
                  serviceData={activeServiceData}
                  mobile_number={main_salon_data?.mobile_number}
                  salonname={main_salon_data?.name}
                  salon={main_salon_data}
                  handleServiceDetailsOpen={handleServiceDetailsOpen}
                  main_salon_data1={main_salon_data1}
                  onBookService={handleBookService} // Pass the booking handler
                  selectedServices={selectedServices}
                  searchQuery={searchQuery}
                />
                <GrommingPackages salon={main_salon_data} />
              </>
            )}
          </>
        )}
      </div>

      {/* Products Section */}
      {productData?.length > 0 && (
        <div className="bg-gradient-to-r from-[#512DC8] to-[#512dc842] my-5 py-1 md:my-7">
          <div className="font-medium text-base pl-4 py-3 text-white md:pl-10 md:py-5 md:text-xl">
            <h3>Products used by salon</h3>
          </div>
          <div className="flex overflow-x-auto w-full snap-mandatory snap-x gap-4 pb-4 md:gap-6 md:pb-6 ">
            {productData?.map((item, index) => (
              <div
                key={index}
                className="h-20 w-20 rounded-full object-cover snap-center first:ml-4 last:mr-4 shrink-0 md:first:ml-10 md:last:mr-10 md:h-24 md:w-24 relative"
              >
                <img
                  src={item?.product_image || "https://via.placeholder.com/100"}
                  alt={item?.product_name || "Salon product"}
                  className="rounded-full w-full h-full object-cover border-2 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Updates */}
      {main_salon_data && (
        <SalonDailyUpdates
          salonData={main_salon_data}
          open={dailyUpdatesOpen}
          handleOpen={handleDailyUpdatesOpen}
          handleClose={handleDailyUpdatesClose}
        />
      )}

      {/* Suggested Salons */}
      {suggestedSalonData?.length > 0 && (
        <>
          <div
            className="N-Profile-page-main-heading"
            style={{
              borderBottom: "none",
            }}
          >
            <span>Suggested Salons</span>
          </div>
          <div className="N-Profile-page-suggested-salons">
            {suggestedSalonData?.map((item, index) => {
              const { offerFormat, offerContent } = getOfferFormat(
                item?.custom_offer_tag,
                item?.offer_tag,
              );
              return (
                <Link
                  to={`/${encodeURIComponent(
                    item?.salon_city,
                  )}/${encodeURIComponent(
                    item?.salon_area,
                  )}/salons/${encodeURIComponent(item?.salon_slug)}`}
                  className="N-Profile-page-saggested-salon-card"
                  key={index}
                >
                  <div className="N-Profile-page-suggested-salon-card-img">
                    <img
                      src={item?.salon_main_image}
                      alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Services"
                    />
                    <div className="like-salon-p-s-s">
                      {userFavorites?.some((item1) => {
                        let res = item1?.salon === item?.id;
                        return res;
                      }) ? (
                        <div
                          className="like-salon-p-s-s-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            handledislike(item?.id);
                          }}
                        >
                          <FcLike />
                        </div>
                      ) : (
                        <div
                          className="like-salon-p-s-s-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            handlelike(item?.id);
                          }}
                        >
                          <MdFavoriteBorder />
                        </div>
                      )}
                    </div>
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
                        )}
                      </span>
                    </div>
                    {item?.salon_premium && (
                      <div className="premium_div-x absolute">
                        <div className="premium-text">Premium</div>
                      </div>
                    )}
                  </div>
                  <div className="N-Profile-page-suggested-salon-card-content">
                    <h2>{item?.salon_name}</h2>
                    <p className="N-P-S-S-score">
                      <img src={Score_svg} alt="Customer Review Score" />
                      <span>
                        {item?.avg_score
                          ? String(item?.avg_score).slice(0, 3)
                          : 0}
                      </span>
                    </p>
                    <p className="N-P-S-S-addr">
                      {item?.salon_area}, {item?.salon_city}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* About Us Section */}
      {window.innerWidth > 768 && (
        <>
          <div
            className="N-Profile-page-main-heading"
            style={{
              borderBottom: "none",
              alignItems: "end",
            }}
          >
            <span>About Us </span>
          </div>
          <AboutUsSalon about={main_salon_data?.about_us} />
        </>
      )}

      <FooterN city={params?.city || main_salon_data?.city || "ahmedabad"} />

      {/* All Modals */}
      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {isMobile ? (
          <Box
            sx={{
              ...style,
              bottom: 0,
              top: "auto",
              left: 0,
              right: 0,
              width: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              transform: "none",
            }}
          >
            <Signup fun={handleSignInClose} />
          </Box>
        ) : (
          <Box sx={style}>
            <Signup fun={handleSignInClose} />
          </Box>
        )}
      </Modal>

      <Modal
        open={salonProfilePhotosTrigger}
        onClose={handleSalonProfilePhotosClose}
        disableScrollLock={false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={handleSalonProfilePhotosClose} // ← Yeh important line: backdrop pe click → close
        >
          <div
            className="relative h-dvh w-full max-w-none md:h-[90vh] md:max-w-7  xl md:rounded-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} // ← Yeh line: andar click hone pe close nahi hoga
          >
            <Gallery2
              salon={main_salon_data}
              onClose={handleSalonProfilePhotosClose}
              setZoomedImage={setZoomedImage}
            />
          </div>
        </div>
      </Modal>

      {/* About Us Modal */}
      <Modal
        open={openAboutUs}
        onClose={handleUserScoreClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AboutUsModal
          salon={main_salon_data}
          handleAboutUsClose={handleAboutUsClose}
        />
      </Modal>

      {/* Service Details Modal */}
      <Modal
        open={openServiceDetails}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <ServiceDetailsModal
            salon={main_salon_data}
            handleServiceDetailsClose={handleServiceDetailsClose}
            serviceId={serviceId}
          />
        </div>
      </Modal>

      {/* Salon Timing Modal */}
      <Modal
        open={openSalonTiming}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <SalonTimingModal
            salon={main_salon_data}
            handleSalonTimingClose={() => {
              setOpenSalonTiming(false);
            }}
          />
        </div>
      </Modal>

      {/* User Score Modal */}
      <Modal
        open={userScoreModal}
        onClose={handleSalonProfilePhotosClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <UserScoreModal
          handleClose={() => handleUserScoreClose()}
          scoreData={scoreData}
          getScoreData={() => {
            if (main_salon_data?.id) {
              getScoreBySalon(main_salon_data?.id);
            }
          }}
          openSignIn={() => {
            setOpenSignIn(true);
          }}
          salonData={main_salon_data}
          openUserNameChangeModal={() => setUserNameChangeModal(true)}
          activeScoreS={setActiveScore}
        />
      </Modal>

      {/* Offer Salon Modal */}
      <Modal
        open={offerrModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <OfferSalonModal
            data={offerModalData}
            handleClose={handleModalClose}
            salon={main_salon_data}
            type={openModalType}
            onBookNow={handleBookOffer}
          />
        </div>
      </Modal>

      {/* User Name Change Modal */}
      <Modal
        open={userNameChangeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className=" bg-white w-4/5 max-w-[400px] h-auto rounded-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
          <div className="flex justify-between flex-col gap-3 relative">
            <div className=" italic font-medium text-sm w-full text-red-600 flex gap-2 items-center">
              <InfoSharp
                sx={{
                  height: "20px",
                  width: "20px",
                }}
              />
              Your Name is mandatory to submit score
            </div>
            <label className=" text-lg font-semibold py-2" htmlFor="user-name">
              Enter Your Name
            </label>
            <button
              onClick={() => {
                setUserNameChangeModal(false);
              }}
              className="absolute -top-16 bg-white rounded-full right-1 p-1"
            >
              <Close />
            </button>
          </div>
          <div className="flex justify-between items-center flex-col gap-3">
            <input
              type="text"
              value={userNameOfUser}
              onChange={(e) => {
                setUserNameOfUser(e.target.value);
              }}
              id="user-name"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-[#532FCA]"
              placeholder="Your Name here"
            />
            <button
              onClick={(e) => {
                handleSubmitUserName(e);
              }}
              className={`w-full bg-[#532FCA] text-white p-2 rounded-lg ${
                nameUpdateLoading && "opacity-70"
              }`}
              disabled={nameUpdateLoading}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

      {/* BOOKING MODULE - ADDED */}
      <BookingModule
        isOpen={isBookingOpen}
        closeModal={() => setIsBookingOpen(false)}
        onBookService={handleBookService}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        salon={main_salon_data}
      />

      {/* ADD TO CART BAR - ADDED */}
      <AddToCartBar
        selectedServices={selectedServices}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Enhanced Zoom Image Modal */}
      <Modal
        open={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        sx={{
          zIndex: 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1500,
          }}
          onClick={() => setZoomedImage(null)}
        >
          {/* Left Navigation Arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "24px",
                zIndex: 1501,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <ChevronLeft />
            </button>
          )}

          {/* Image Container */}
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed Salon Image"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Right Navigation Arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "24px",
                zIndex: 1501,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <ChevronRight />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setZoomedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              fontSize: "20px",
              zIndex: 1501,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ×
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SalonProfile;
