
import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FiChevronRight } from "react-icons/fi";
import Modal from "react-modal";
import { FiStar } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { Helmet } from "react-helmet";

// Skeleton Loading Components
const HeroBannerSkeleton = () => (
  <div className="protected h-48 md:h-64 w-full bg-gray-200 rounded-lg animate-pulse"></div>
);

const OfferCardSkeleton = () => (
  <div className="protected aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
);

const SalonCardSkeleton = () => (
  <div className="border border-slate-300 rounded-lg overflow-hidden">
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="w-3/4">
          <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>
    <div className="px-4 pb-4">
      <div className="flex space-x-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-64 h-40 bg-gray-200 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    </div>
    <div className="flex justify-center px-4 pb-4">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </div>
  </div>
);

const Offerpage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllOffersModal, setShowAllOffersModal] = useState(false);
  const [salonsWithOffers, setSalonsWithOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [heroOffer, setHeroOffer] = useState([]);
  const [primaryOfferData, setPrimaryOfferData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllSalonsModal, setShowAllSalonsModal] = useState(false);
  const [loadingMoreSalons, setLoadingMoreSalons] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const modalRef = useRef(null);
  const [showRemainingSalons, setShowRemainingSalons] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(params.city || "All");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [loadingCities, setLoadingCities] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedArea) {
      setSelectedArea(location.state.selectedArea);
      // Trigger the area filter immediately
      fetchSalonsWithOffers(params.city, false, location.state.selectedArea);
    }

    if (location.state?.scrollToSalons) {
      setTimeout(() => {
        const element = document.getElementById("all-salons-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [location.state]);

  useEffect(() => {
    const handleBackButton = (e) => {
      if (
        document.referrer === "" ||
        !document.referrer.includes(window.location.host)
      ) {
        e.preventDefault();
        navigate(`/${params.city}/salons`);
      } else if (window.location.pathname.includes("/offerpage")) {
        e.preventDefault();
        navigate(`/${params.city}/salons`);
      }
    };

    if (window.history.state === null || window.history.state.idx === 0) {
      window.history.replaceState({ isOfferPage: true }, "");
      window.history.pushState({ isOfferPage: true }, "");
    }

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, params.city]);

  useEffect(() => {
    const fetchCitiesAndAreas = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/city/?area=true`
        );
        const data = await response.json();
        if (data.payload) {
          setCities(data.payload);

          // Find the current city in the response
          const currentCity = data.payload.find(
            (city) => city.name.toLowerCase() === params.city?.toLowerCase()
          );

          if (currentCity) {
            // Set areas for the current city
            const cityAreas = currentCity.area_names || [];
            setAreas([
              { id: "all", name: "All" },
              ...cityAreas.map((area) => ({ id: area, name: area })),
            ]);
          } else {
            setAreas([{ id: "all", name: "All" }]);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCitiesAndAreas();
  }, [params.city]);

  const cityOptions = ["All", "Ahmedabad", "Gandhinagar"];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showAllOffersModal || showAllSalonsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAllOffersModal, showAllSalonsModal]);

  const customStyles = {
    content: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "auto",
      transform: showAllOffersModal ? "translateX(0)" : "translateX(100%)",
      width: isMobile ? "100%" : "450px",
      maxWidth: isMobile ? "100%" : "90%",
      height: "100vh",
      padding: "20px",
      border: "none",
      borderRadius: isMobile ? "0" : "12px 0 0 12px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      overflowY: "auto",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      margin: "0",
      opacity: showAllOffersModal ? "1" : "0",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      transition: "opacity 0.3s ease",
      opacity: showAllOffersModal ? "1" : "0",
    },
  };

  const categories = ["All", "Hair", "Spa", "Waxing", "Facial", "Manicure"];

  const getHeroOffers = async (city) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/national-hero-offers/?city=${city}`
      );
      const data = await response.json();
      setHeroOffer(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getPrimaryOffer = async (city) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon-city-offer/?city=${city}`
      );
      const data = await response.json();
      setPrimaryOfferData(data);
      setInitialLoadComplete(true);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSalonsWithOffers = async (
    city,
    initialLoad = false,
    area = selectedArea
  ) => {
    try {
      setLoading(true);
      let url = `https://backendapi.trakky.in/salons/salons-with-offers/?city=${city}`;

      // Only add area filter if it's not 'All'
      if (area && area !== "All") {
        url += `&area=${encodeURIComponent(area)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        const sortedSalons = initialLoad
          ? data
              .sort((a, b) => (a.priority || 0) - (b.priority || 0))
              .slice(0, 3)
          : data.sort((a, b) => (a.priority || 0) - (b.priority || 0));

        setSalonsWithOffers(sortedSalons);
      } else {
        console.error("Salons with offers API response is not an array:", data);
        setSalonsWithOffers([]);
      }
    } catch (error) {
      console.error("Error fetching salons with offers:", error);
      setSalonsWithOffers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - minimal data
  useEffect(() => {
    const areaToFilter = location.state?.selectedArea || "All";
    fetchSalonsWithOffers(params?.city, true, areaToFilter);
    getHeroOffers(params?.city);
    getPrimaryOffer(params?.city);
  }, [params?.city, location.state?.selectedArea]);

  // Full load after initial render
  useEffect(() => {
    if (initialLoadComplete) {
      fetchSalonsWithOffers(params?.city);
    }
  }, [params?.city, initialLoadComplete]);

  const processedData = React.useMemo(() => {
    return salonsWithOffers
      .map((salon) => {
        const activeOffers = salon.profile_offers.map((offer) => ({
          id: offer.id,
          image: offer.image || "https://via.placeholder.com/280x210",
          category: offer.name || "",
          actual_price: offer.actual_price,
          discount_price: offer.discount_price,
        }));

        return {
          salon_details: {
            id: salon.id,
            salon_name: salon.name,
            city: salon.city,
            area: salon.area,
            slug: salon.slug,
            priority: salon.priority || 0,
            score: "4.0",
          },
          offers: activeOffers,
        };
      })
      .filter((salon) => salon.offers.length > 0);
  }, [salonsWithOffers]);

  const filteredData =
    activeCategory === "All"
      ? processedData
      : processedData.filter((salon) =>
          salon.offers.some((offer) =>
            offer.category?.toLowerCase().includes(activeCategory.toLowerCase())
          )
        );

  const salonsModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: showAllSalonsModal
        ? "translate(-50%, -50%)"
        : "translate(-50%, -150%)",
      width: isMobile ? "100%" : "80%",
      maxWidth: isMobile ? "100%" : "1200px",
      maxHeight: isMobile ? "100%" : "90vh",
      padding: "20px",
      border: "none",
      borderRadius: isMobile ? "0" : "8px",
      boxShadow: isMobile ? "none" : "0 5px 15px rgba(0,0,0,0.3)",
      overflowY: "auto",
      backgroundColor: "#f8f9fa",
      transition: "transform 0.3s ease-out",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
    },
  };

  const loadMoreSalons = useCallback(async () => {
    if (loadingMoreSalons || !hasMore) return;

    setLoadingMoreSalons(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (page >= 3) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
        setSalonsWithOffers((prev) => [...prev, ...prev.slice(0, 2)]);
      }
    } catch (error) {
      console.error("Error loading more salons:", error);
    } finally {
      setLoadingMoreSalons(false);
    }
  }, [page, loadingMoreSalons, hasMore]);

  const handleScroll = useCallback(() => {
    if (!modalRef.current || loadingMoreSalons || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      loadMoreSalons();
    }
  }, [loadMoreSalons, loadingMoreSalons, hasMore]);

  useEffect(() => {
    if (showAllSalonsModal && modalRef.current) {
      modalRef.current.addEventListener("scroll", handleScroll);
      return () => {
        if (modalRef.current) {
          modalRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [showAllSalonsModal, handleScroll]);

  useEffect(() => {
    if (filteredData.length > 2) {
      const timer = setTimeout(() => {
        setShowRemainingSalons(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [filteredData.length]);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setLoading(true);
    fetchSalonsWithOffers(params.city, false, area === "All" ? null : area);
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>
          Exclusive salon offers in Ahmedabad, checkout Hair and beauty salon
          services.
        </title>
        <meta
          name="description"
          content="Discover the latest salon offers in Ahmedabad! Enjoy amazing discounts on haircuts, bridal makeup, beauty salon services, and hair salon services. Best offer available, book your salon appointment today!"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/offerpage`}
        />
      </Helmet>

      <div className="protected N-list-page-background-color !h-[100vh]"></div>
      <Navbar />

      {/* Hero Banner Swiper */}
      <div className="protected max-w-[100%] mt-5 mx-[15px] md:max-w-[600px] md:mx-auto lg:max-w-[700px] clg:max-w-[800px]">
        {heroOffer.length > 0 ? (
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
        ) : (
          <HeroBannerSkeleton />
        )}
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          opacity: 1;
          background-color: #e9d5ff;
        }
        .swiper-pagination-bullet-active {
          background-color: #7e22ce !important;
          width: 20px;
          border-radius: 4px;
        }
        .swiper-button-prev,
        .swiper-button-next {
          color: #7e22ce;
          background: rgba(255, 255, 255, 0.7);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          --swiper-navigation-size: 16px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 16px;
          font-weight: bold;
        }
        @media (min-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 40px;
            height: 40px;
            --swiper-navigation-size: 20px;
          }
        }
        @media (min-width: 1024px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 50px;
            height: 50px;
            --swiper-navigation-size: 24px;
          }
        }
      `}</style>

      {/* Primary Offers Section */}
      <div className="px-4 mt-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Special Offers</h2>
        </div>
      </div>

      <div className="protected grid grid-cols-2 gap-[15px] my-6 px-[20px] esm:grid-cols-4 md:max-w-[min(550px,70%)] md:mx-auto lg:max-w-[750px] lg:mt-5 lg:mb-8">
        {primaryOfferData.length > 0
          ? primaryOfferData.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="protected aspect-square rounded-xl cursor-pointer"
                onClick={() => {
                  if (item?.salon.length == 1) {
                    navigate(
                      `/${item?.city}/${item?.area}/salons/${
                        item?.salon_slug[item?.salon[0]]
                      }`
                    );
                  } else if (item?.salon.length > 1) {
                    navigate(
                      `/${item?.city}/salons/special-offers/${item?.slug}`
                    );
                  }
                }}
              >
                <img
                  src={item?.offer_image}
                  className="h-full w-full aspect-square rounded-xl"
                  alt="Best Salon Offers Available For You"
                />
              </div>
            ))
          : [1, 2, 3, 4].map((i) => <OfferCardSkeleton key={i} />)}
      </div>

      {primaryOfferData.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAllOffersModal(true)}
            className="text-purple-600 text-sm font-medium flex items-center px-4 py-2 border-2 border-gradient-to-r from-[#AE86D0] to-[#512DC8] rounded-full hover:bg-purple-50 transition-colors ring-2 ring-purple-300 ring-offset-2 focus:outline-none focus:ring-purple-500"
          >
            View more special offers <FiChevronRight className="ml-1" />
          </button>
        </div>
      )}

      <div id="all-salons-section" className="px-4 mt-6 max-w-6xl mx-auto">
        <div className="flex flex-col mb-4">
          <h2 className="text-xl font-bold text-gray-800 md:text-2xl mb-2">
            All Salons
          </h2>
        </div>

        {loadingCities ? (
          <div className="flex space-x-2 overflow-x-auto py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              className="area-swiper w-full"
              grabCursor={true}
              touchStartPreventDefault={false}
              resistanceRatio={0}
            >
              {areas.map((area) => (
                <SwiperSlide key={area.id} className="!w-auto">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${
                      selectedArea === area.name
                        ? "text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC]"
                        : "border border-slate-800 border-solid"
                    }`}
                    onClick={() => handleAreaSelect(area.name)}
                  >
                    {area.name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <SalonCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedArea === "All"
                ? `No salons found in ${params.city}`
                : `No salons found in ${selectedArea}, ${params.city}`}
            </p>
            {selectedArea !== "All" && (
              <button
                onClick={() => handleAreaSelect("All")}
                className="mt-2 text-purple-600 text-sm font-medium px-4 py-2 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Show all salons in {params.city}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* First show only 2 complete salons */}
            {filteredData.slice(0, 2).map((salon, index) => (
              <div
                key={index}
                className="border border-slate-300 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {/* Salon Header - Clickable for salon profile */}
                <div
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => {
                    const { city, area, slug } = salon.salon_details;
                    if (city && area && slug) {
                      navigate(`/${city}/${area}/salons/${slug}`);
                    }
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg md:text-xl truncate">
                      {salon.salon_details?.salon_name ||
                        "Salon Name Not Available"}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 truncate">
                      <span>
                        {salon.salon_details?.area}, {salon.salon_details?.city}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full whitespace-nowrap ml-2 md:text-sm">
                    {salon.offers.length}{" "}
                    {salon.offers.length === 1 ? "offer" : "offers"}
                  </div>
                </div>

                {/* Offers Swiper - Auto-swipe for these first 2 salons */}
                <div className="relative">
                  <Swiper
                    spaceBetween={12}
                    slidesPerView="auto"
                    className="salon-offers-swiper px-4 pb-4"
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                  >
                    {salon.offers.map((offer, idx) => (
                      <SwiperSlide key={idx} className="!w-[280px]">
                        <div
                          className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                          onClick={(e) => {
                            // ✅ Stop event from bubbling to parent
                            e.stopPropagation();
                            const { city, area, slug } = salon.salon_details;
                            if (city && area && slug) {
                              navigate(
                                `/${city}/${area}/salons/${slug}?offer=${offer.id}&offer-type=offer`
                              );
                            }
                          }}
                        >
                          <div className="relative pb-[64%]">
                            <img
                              src={
                                offer.image ||
                                "https://via.placeholder.com/280x210"
                              }
                              className="absolute top-0 left-0 w-full h-full rounded-2xl"
                              alt="Best Salons Offers available For You"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* View full menu link */}
                <div className="flex justify-center px-4 pb-4">
                  <button
                    onClick={(e) => {
                      // ✅ Stop event from bubbling
                      e.stopPropagation();
                      const { city, area, slug } = salon.salon_details;
                      if (city && area && slug) {
                        navigate(`/${city}/${area}/salons/${slug}`);
                      }
                    }}
                    className="flex items-center justify-center text-sm text-gray-600 hover:text-purple-600 md:text-base"
                  >
                    View full menu <FiChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            ))}

            {/* Then show the remaining salons in a compact view */}
            {showRemainingSalons && filteredData.length > 2 && (
              <div className="space-y-4">
                {filteredData.slice(2).map((salon, index) => (
                  <div
                    key={index + 2}
                    className="border border-slate-300 rounded-lg overflow-hidden"
                  >
                    {/* Salon Header - Clickable for salon profile */}
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => {
                        const { city, area, slug } = salon.salon_details;
                        if (city && area && slug) {
                          navigate(`/${city}/${area}/salons/${slug}`);
                        }
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg md:text-xl truncate">
                          {salon.salon_details?.salon_name ||
                            "Salon Name Not Available"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1 truncate">
                          <span>
                            {salon.salon_details?.area},{" "}
                            {salon.salon_details?.city}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full whitespace-nowrap ml-2 md:text-sm">
                        {salon.offers.length}{" "}
                        {salon.offers.length === 1 ? "offer" : "offers"}
                      </div>
                    </div>

                    <div className="relative">
                      <Swiper
                        spaceBetween={12}
                        slidesPerView="auto"
                        className="salon-offers-swiper px-4 pb-4"
                        loop={true}
                      >
                        {salon.offers.map((offer, idx) => (
                          <SwiperSlide key={idx} className="!w-[280px]">
                            <div
                              className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                              onClick={(e) => {
                                // ✅ Stop event from bubbling to parent
                                e.stopPropagation();
                                const { city, area, slug } =
                                  salon.salon_details;
                                if (city && area && slug) {
                                  navigate(
                                    `/${city}/${area}/salons/${slug}?offer=${offer.id}&offer-type=offer`
                                  );
                                }
                              }}
                            >
                              <div className="relative pb-[64%]">
                                <img
                                  src={
                                    offer.image ||
                                    "https://via.placeholder.com/280x210"
                                  }
                                  className="absolute top-0 left-0 w-full h-full rounded-2xl"
                                  alt="Best Salon Offers Available For You"
                                />
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    <div className="flex justify-center px-4 pb-4">
                      <button
                        onClick={(e) => {
                          // ✅ Stop event from bubbling
                          e.stopPropagation();
                          const { city, area, slug } = salon.salon_details;
                          if (city && area && slug) {
                            navigate(`/${city}/${area}/salons/${slug}`);
                          }
                        }}
                        className="flex items-center justify-center text-sm text-gray-600 hover:text-purple-600 md:text-base"
                      >
                        View full menu <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .salon-offers-swiper {
          overflow: visible;
        }
        .salon-offers-swiper .swiper-slide {
          width: 280px;
          padding-left: 10px;
          padding-bottom: 10px;
        }

        @media (min-width: 768px) {
          .border-slate-300 {
            border-radius: 0.75rem;
          }
        }
      `}</style>

      <FooterN city={params?.city} />

      {/* All Special Offers Modal */}
      <Modal
        isOpen={showAllOffersModal}
        onRequestClose={() => setShowAllOffersModal(false)}
        style={customStyles}
        contentLabel="All Special Offers"
        closeTimeoutMS={300}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <div className="flex gap-2 items-center mb-4">
          <button
            onClick={() => setShowAllOffersModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Special Offers</h2>
        </div>

        <div className="border border-b-slate-300 mb-4"></div>

        <div className="flex flex-col gap-4 items-center">
          {primaryOfferData.length > 0
            ? primaryOfferData.map((item, index) => (
                <div
                  key={index}
                  className="w-72 h-72 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                    setShowAllOffersModal(false);
                    if (item?.salon.length == 1) {
                      navigate(
                        `/${item?.city}/${item?.area}/salons/${
                          item?.salon_slug[item?.salon[0]]
                        }`
                      );
                    } else if (item?.salon.length > 1) {
                      navigate(
                        `/${item?.city}/salons/special-offers/${item?.slug}`
                      );
                    }
                  }}
                >
                  <img
                    src={item?.offer_image}
                    className="w-72 h-72 object-cover rounded-lg"
                    alt="Exclusive Offers Available For You"
                  />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full max-w-xs h-72 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </Modal>

      {/* All Salon Offers Modal */}
      <Modal
        isOpen={showAllSalonsModal}
        onRequestClose={() => setShowAllSalonsModal(false)}
        style={salonsModalStyles}
        contentLabel="All Salon Offers"
        closeTimeoutMS={300}
      >
        <div className="flex items-center mb-6 sticky top-0  bg-[#f8f9fa] pt-2 z-50">
          <button
            onClick={() => setShowAllSalonsModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <ChevronLeft className="mr-1" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
            All Salon Offers
          </h2>
        </div>

        <div className="border border-b-slate-300 mb-2"></div>

        <div
          className="space-y-6 p-2"
          ref={modalRef}
          style={{
            maxHeight: isMobile ? "calc(100vh - 80px)" : "calc(90vh - 80px)",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <SalonCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No salons found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredData.map((salon, index) => (
                <div
                  key={index}
                  className="border border-slate-300 rounded-lg overflow-hidden"
                >
                  {/* Salon Header */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg md:text-xl">
                          {salon.salon_details?.salon_name ||
                            "Salon Name Not Available"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>
                            {salon.salon_details?.area},{" "}
                            {salon.salon_details?.city}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs bg-purple-100 text-purple-800 px-4 py-1 rounded md:text-sm">
                        {salon.offers.length}{" "}
                        {salon.offers.length === 1 ? "offer" : "offers"}
                      </div>
                    </div>
                  </div>

                  {/* Offers Swiper */}
                  <div className="relative">
                    <Swiper
                      spaceBetween={12}
                      slidesPerView="auto"
                      className="salon-offers-swiper px-4 pb-4"
                    >
                      {salon.offers.map((offer, idx) => (
                        <SwiperSlide key={idx} className="!w-[280px]">
                          <div
                            className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                            onClick={() => {
                              const { city, area, slug } = salon.salon_details;
                              if (city && area && slug) {
                                navigate(
                                  `/${city}/${area}/salons/${slug}?offer=${offer.id}&offer-type=offer`
                                );
                              }
                            }}
                          >
                            <div className="relative pb-[63%]">
                              <img
                                src={
                                  offer.image ||
                                  "https://via.placeholder.com/280x210"
                                }
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                                alt="Best Salons Offers Available For You"
                              />
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* View full menu link */}
                  <div className="flex justify-center px-4 pb-4">
                    <button
                      onClick={() => {
                        const { city, area, slug } = salon.salon_details;
                        if (city && area && slug) {
                          navigate(`/${city}/${area}/salons/${slug}`);
                        }
                      }}
                      className="flex items-center justify-center text-sm text-gray-600 hover:text-purple-600 md:text-base"
                    >
                      View full menu <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loadingMoreSalons && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No more salons to show
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Offerpage;