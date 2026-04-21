import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Navigation, EffectCoverflow, Pagination, Mousewheel, Keyboard } from "swiper";
import {
  FiShare2,
  FiVolume2,
  FiVolumeX,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn
} from "react-icons/fi";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./GroomingStories.css";
import { Close } from "@mui/icons-material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const ReelCarousel = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showFullscreenReel, setShowFullscreenReel] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const verticalSwiperRef = useRef(null);
  const horizontalSwiperRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Video refs for controlling playback
  const videoRefs = useRef({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await axios.get(
          `https://backendapi.trakky.in/salons/client-image-site/?is_city=true&city=${params?.city}`
        );
        const filteredData = response.data.filter(
          (item) => item.is_city === true && (item.video || item.client_image)
        );
        setReels(filteredData);
        setLoading(false);

        if (params.reelId) {
          const foundReel = filteredData.find(
            (r) => r.id.toString() === params.reelId
          );
          if (foundReel) {
            setSelectedReel(foundReel);
            setShowFullscreenReel(true);
            const reelIndex = filteredData.findIndex((r) => r.id.toString() === params.reelId);
            setActiveIndex(reelIndex);
          }
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReels();
  }, [params.reelId, params?.city]);

  // Handle slide change for horizontal swiper
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    
    // Pause all videos except the active one
    reels.forEach((reel, index) => {
      const video = videoRefs.current[reel.id];
      if (video) {
        if (index === newIndex) {
          video.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
          video.pause();
        }
      }
    });
  };

  // Handle vertical slide change for mobile
  const handleVerticalSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    setSelectedReel(reels[newIndex]);
    
    // Update URL
    navigate(`/${params.city}/salons/reel/${reels[newIndex].id}`, {
      replace: true,
    });

    // Play the current video and pause others
    reels.forEach((reel, index) => {
      const video = videoRefs.current[reel.id];
      if (video) {
        if (index === newIndex) {
          video.play().catch(e => console.log("Autoplay prevented:", e));
          setIsPlaying(true);
        } else {
          video.pause();
        }
      }
    });
  };

  const handleReelClick = (reel, index) => {
    setSelectedReel(reel);
    setActiveIndex(index);
    setShowFullscreenReel(true);
    
    // If horizontal swiper exists, slide to the clicked reel
    if (horizontalSwiperRef.current && horizontalSwiperRef.current.swiper) {
      horizontalSwiperRef.current.swiper.slideTo(index);
    }
    
    navigate(`/${params.city}/salons/reel/${reel.id}`, { replace: true });
  };

  // Add this useEffect for back button handling
  useEffect(() => {
    if (!showFullscreenReel) return;

    const handleBackButton = (event) => {
      event.preventDefault();
      handleCloseFullscreenReel();
    };

    window.addEventListener("popstate", handleBackButton);
    window.history.pushState({ type: "reel" }, "");

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      if (window.history.state?.type === "reel") {
        window.history.back();
      }
    };
  }, [showFullscreenReel]);

  // Update the close function
  const handleCloseFullscreenReel = () => {
    setShowFullscreenReel(false);
    setShowDetailsModal(false);
    
    // Pause all videos when closing
    reels.forEach(reel => {
      const video = videoRefs.current[reel.id];
      if (video) {
        video.pause();
      }
    });
    
    setIsPlaying(false);
    navigate(`/${params.city}/salons`, { replace: true });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlayPause = (reelId) => {
    const video = videoRefs.current[reelId];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleShare = async () => {
    if (!selectedReel) return;

    const reelUrl = `${window.location.origin}/${params.city}/salons/reel/${selectedReel.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title:
            selectedReel.service_data?.service_name ||
            selectedReel.category_data?.category_name,
          text: "Check out this salon service!",
          url: reelUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(reelUrl);
        toast.success("Link copied to clipboard!");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = reelUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to share:", err);
      toast.error("Failed to share link");
    }
  };

  const handleBookNow = (reel) => {
    const salonName =
      reel.service_data?.salon_name ||
      reel.category_data?.salon_name ||
      "the salon";
    const area = reel.service_data?.area || reel.category_data?.area || "";
    const city = reel.category_data?.city || "Ahmedabad";

    const link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      salonName
    )}%2C%20${encodeURIComponent(area)}%2C%20${encodeURIComponent(city)}%3F`;

    window.open(link, "_blank");
  };

  const toggleDetailsModal = () => {
    setShowDetailsModal(!showDetailsModal);
  };

  const productImages = selectedReel
    ? [
        selectedReel.service_data?.service_image ||
          selectedReel.category_data?.category_image,
        selectedReel.client_image,
      ].filter(Boolean)
    : [];

  const handleNextReel = () => {
    const nextIndex = (activeIndex + 1) % reels.length;
    setActiveIndex(nextIndex);
    setSelectedReel(reels[nextIndex]);
    
    // Update swiper position
    if (horizontalSwiperRef.current && horizontalSwiperRef.current.swiper) {
      horizontalSwiperRef.current.swiper.slideTo(nextIndex);
    }
    
    navigate(`/${params.city}/salons/reel/${reels[nextIndex].id}`, {
      replace: true,
    });
  };

  const handlePrevReel = () => {
    const prevIndex = (activeIndex - 1 + reels.length) % reels.length;
    setActiveIndex(prevIndex);
    setSelectedReel(reels[prevIndex]);
    
    // Update swiper position
    if (horizontalSwiperRef.current && horizontalSwiperRef.current.swiper) {
      horizontalSwiperRef.current.swiper.slideTo(prevIndex);
    }
    
    navigate(`/${params.city}/salons/reel/${reels[prevIndex].id}`, {
      replace: true,
    });
  };

  const handleMoreInfoClick = (reel) => {
    const salonSlug =
      reel.service_data?.salon_slug || reel.category_data?.salon_slug;
    const city =
      reel.service_data?.city || reel.category_data?.city || params.city;
    const area =
      reel.service_data?.area || reel.category_data?.area || params.area;

    if (salonSlug) {
      navigate(
        `/${encodeURIComponent(city)}/${encodeURIComponent(
          area
        )}/salons/${encodeURIComponent(salonSlug)}#customer-experience`
      );
    } else {
      toast.error("Salon information not available");
    }
  };

  // Handle video click to play/pause
  const handleVideoClick = (reelId, event) => {
    event.stopPropagation();
    togglePlayPause(reelId);
  };

  // Don't show anything while loading
  if (loading) {
    return null; // Don't show anything while loading
  }

  // Don't show anything if there's an error
  if (error) {
    return null; // Don't show anything if there's an error
  }

  // Don't show anything if no reels are available
  if (!reels.length) {
    return null; // Don't show anything if no reels found
  }

  // Only render the component if we have reels data
  return (
    <>
      <div className="w-full">
        {isMobileView ? (
          <>
            <h2 className="text-xl font-semibold text-start px-4 py-4">
              Grooming Stories
            </h2>
            <div className="flex overflow-x-auto gap-3 px-4 pb-4">
              {reels.map((reel, index) => (
                <div
                  key={reel.id}
                  className="relative flex flex-col items-center w-44 flex-shrink-0 cursor-pointer"
                  onClick={() => handleReelClick(reel, index)}
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden">
                    {reel.video ? (
                      <video
                        ref={el => videoRefs.current[reel.id] = el}
                        className="w-full h-full object-cover"
                        autoPlay={false}
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={(e) => handleVideoClick(reel.id, e)}
                      >
                        <source src={reel.video} type="video/mp4" />
                      </video>
                    ) : reel.client_image ? (
                      <img
                        src={reel.client_image}
                        alt={
                          reel.service_data?.service_name ||
                          reel.category_data?.category_name
                        }
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-xs text-center p-1">
                        No media
                      </div>
                    )}
                    
                    {/* Zoom Icon for Mobile */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-black/50 rounded-full p-1.5">
                        <FiZoomIn className="text-white text-sm" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
                          {reel.service_data?.service_image ||
                          reel.category_data?.category_image ? (
                            <img
                              src={
                                reel.service_data?.service_image ||
                                reel.category_data?.category_image
                              }
                              alt={
                                reel.service_data?.service_image ||
                                reel.category_data?.category_image
                              }
                              className="w-8 h-8 object-contain rounded-md"
                            />
                          ) : (
                            <div className="text-black text-xs">No image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white text-xs font-bold mb-1 line-clamp-1">
                            {reel.service_data?.service_name ||
                              reel.category_data?.category_name ||
                              "Untitled"}
                          </h3>
                          {reel.service_data?.price && (
                            <p className="text-white text-sm ">
                              ₹ {reel.service_data.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-center text-xl sm:text-2xl font-bold mb-6">
              Grooming Stories
            </h2>
            <Swiper
              ref={horizontalSwiperRef}
              loop={reels.length > 4}
              spaceBetween={30}
              slidesPerView={Math.min(4, reels.length)}
              effect="coverflow"
              centeredSlides={true}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: true,
              }}
              navigation
              onSlideChange={handleSlideChange}
              initialSlide={activeIndex}
              modules={[EffectCoverflow, Navigation]}
              onSwiper={(swiper) => setSwiperInstance(swiper)}
            >
              {reels.map((reel, index) => (
                <SwiperSlide key={reel.id}>
                  <div
                    className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleReelClick(reel, index)}
                    onMouseEnter={() => {
                      if (index === activeIndex) {
                        setShowControls(true);
                      }
                    }}
                    onMouseLeave={() => setShowControls(false)}
                  >
                    {reel.video ? (
                      <video
                        ref={el => videoRefs.current[reel.id] = el}
                        className="w-full h-full object-cover"
                        autoPlay={index === activeIndex}
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={(e) => handleVideoClick(reel.id, e)}
                      >
                        <source src={reel.video} type="video/mp4" />
                      </video>
                    ) : reel.client_image ? (
                      <img
                        src={reel.client_image}
                        alt={
                          reel.service_data?.service_name ||
                          reel.category_data?.category_name
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-center p-1">
                        No media
                      </div>
                    )}

                    {/* Zoom Icon for Desktop - Always Visible */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-all duration-300">
                        <FiZoomIn className="text-white text-lg" />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReelClick(reel, index);
                        }}
                        className="text-white hover:text-gray-300 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-all"
                      >
                        <FullscreenIcon size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        className="text-white hover:text-gray-300 p-2 ml-1 rounded-full bg-black/60 hover:bg-black/80 transition-all"
                      >
                        {isMuted ? (
                          <FiVolumeX size={20} />
                        ) : (
                          <FiVolume2 size={20} />
                        )}
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 to-transparent p-2">
                      <div className="flex items-start space-x-2 mb-2">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0">
                          {reel.service_data?.service_image ||
                          reel.category_data?.category_image ? (
                            <img
                              src={
                                reel.service_data?.service_image ||
                                reel.category_data?.category_image
                              }
                              alt={
                                reel.service_data?.service_image ||
                                reel.category_data?.category_image
                              }
                              className="w-12 h-12 object-contain rounded-md"
                            />
                          ) : (
                            <div className="text-black text-xs">No image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white text-md font-bold mb-1 line-clamp-1">
                            {reel.service_data?.service_name ||
                              reel.category_data?.category_name ||
                              "Untitled"}
                          </h3>
                          {reel.service_data?.price && (
                            <p className="text-white text-sm">
                              ₹ {reel.service_data.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Fullscreen Reel Player - Updated with reduced opacity */}
      {showFullscreenReel && selectedReel && (
        <div className="fixed inset-0 z-[999] flex flex-col">
          {isMobileView ? (
            <div className="h-full w-full">
              <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={0}
                mousewheel={true}
                keyboard={true}
                className="h-full w-full"
                initialSlide={activeIndex}
                onSlideChange={handleVerticalSlideChange}
                modules={[Mousewheel, Keyboard]}
                ref={verticalSwiperRef}
              >
                {reels.map((reel, index) => (
                  <SwiperSlide key={reel.id} className="relative">
                    <div className="relative w-full h-full flex justify-center items-center">
                      {reel.video ? (
                        <video
                          ref={el => videoRefs.current[reel.id] = el}
                          src={reel.video}
                          autoPlay={index === activeIndex}
                          muted={isMuted}
                          loop
                          playsInline
                          className="absolute w-full h-full object-cover"
                          onClick={(e) => handleVideoClick(reel.id, e)}
                        />
                      ) : reel.client_image ? (
                        <img
                          src={reel.client_image}
                          alt={
                            reel.service_data?.service_name ||
                            reel.category_data?.category_name
                          }
                          className="absolute w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                          No media available
                        </div>
                      )}

                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full backdrop-blur-sm"
                        >
                          {isMuted ? (
                            <FiVolumeX size={20} />
                          ) : (
                            <FiVolume2 size={20} />
                          )}
                        </button>
                        <button
                          onClick={handleShare}
                          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full backdrop-blur-sm"
                        >
                          <FiShare2 size={20} />
                        </button>
                        <button
                          onClick={handleCloseFullscreenReel}
                          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full backdrop-blur-sm"
                        >
                          <FiArrowLeft size={20} />
                        </button>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0">
                            {reel.service_data?.service_image ||
                            reel.category_data?.category_image ? (
                              <img
                                src={
                                  reel.service_data?.service_image ||
                                  reel.category_data?.category_image
                                }
                                alt={
                                  reel.service_data?.service_image ||
                                  reel.category_data?.category_image
                                }
                                className="w-12 h-12 object-contain rounded-md"
                              />
                            ) : (
                              <div className="text-black text-xs">No image</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white text-base font-bold mb-1">
                              {reel.service_data?.service_name ||
                                reel.category_data?.category_name}
                            </h3>
                            {reel.service_data?.price && (
                              <p className="text-white text-lg ">
                                ₹ {reel.service_data.price}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={toggleDetailsModal}
                          className="w-full bg-white text-black py-2.5 rounded font-medium hover:bg-gray-100 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            // Desktop View - Side by Side with Navigation Buttons
            <div className="flex h-full pl-80 pr-80 pt-14 pb-14 relative">
              <button
                onClick={handleCloseFullscreenReel}
                className="absolute right-4 top-[5%] z-10 text-white bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <Close size={24} />
              </button>
              {/* Navigation Buttons */}
<button
  onClick={handlePrevReel}
  className="fixed left-4 top-1/2 -translate-y-1/2 z-50 
             text-white bg-black/50 p-3 rounded-full 
             hover:bg-black/70 transition-colors backdrop-blur-sm
             select-none"
>
  <FiChevronLeft size={24} />
</button>

<button
  onClick={handleNextReel}
  className="fixed right-4 top-1/2 -translate-y-1/2 z-50 
             text-white bg-black/50 p-3 rounded-full 
             hover:bg-black/70 transition-colors backdrop-blur-sm
             select-none"
>
  <FiChevronRight size={24} />
</button>


              {/* Left Side - Video */}
              <div
                className="w-[38%] h-full flex items-center justify-center relative rounded-l-lg bg-white/5 backdrop-blur-sm"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                {selectedReel.video ? (
                  <video
                    ref={el => videoRefs.current[selectedReel.id] = el}
                    src={selectedReel.video}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-l-lg"
                    onClick={(e) => handleVideoClick(selectedReel.id, e)}
                  />
                ) : selectedReel.client_image ? (
                  <img
                    src={selectedReel.client_image}
                    alt={
                      selectedReel.service_data?.service_name ||
                      selectedReel.category_data?.category_name
                    }
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                    No media available
                  </div>
                )}

                {/* Hover Controls */}
                {showControls && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-opacity duration-300 backdrop-blur-sm"
                    >
                      {isMuted ? (
                        <FiVolumeX size={20} />
                      ) : (
                        <FiVolume2 size={20} />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-opacity duration-300 backdrop-blur-sm"
                    >
                      <FiShare2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side - Product Details */}
              <div className="w-[62%] h-full bg-white/95 backdrop-blur-sm overflow-y-auto p-6 rounded-r-lg border border-white/20">
                {productImages.length > 0 && (
                  <>
                    <div className="w-full overflow-x-auto mx-auto">
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={1.5}
                        onSlideChange={(swiper) =>
                          setSelectedImage(swiper.activeIndex)
                        }
                        initialSlide={selectedImage}
                        modules={[Navigation, Pagination]}
                        navigation
                        className="mb-4"
                      >
                        {productImages.map((img, index) => (
                          <SwiperSlide key={index}>
                            <div className="relative aspect-square">
                              <img
                                src={img}
                                alt={`${
                                  selectedReel.service_data?.service_name ||
                                  selectedReel.category_data?.category_name
                                } - ${index + 1}`}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 border border-black rounded-md flex items-center justify-center">
                        {selectedReel.service_data?.service_image ||
                        selectedReel.category_data?.category_image ? (
                          <img
                            src={
                              selectedReel.service_data?.service_image ||
                              selectedReel.category_data?.category_image
                            }
                            alt={
                              selectedReel.service_data?.service_name ||
                              selectedReel.category_data?.category_name
                            }
                            className="w-14 h-14 object-contain"
                          />
                        ) : (
                          <div className="text-black text-xs text-center">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">
                          {selectedReel.service_data?.service_name ||
                            selectedReel.category_data?.category_name}
                        </h3>
                        {selectedReel.service_data?.price && (
                          <p className="text-2xl">
                            ₹ {selectedReel.service_data.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700">
                        {selectedReel.service_data?.description?.replace(
                          /<[^>]*>/g,
                          ""
                        ) ||
                          selectedReel.description ||
                          "No description available"}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={() => handleBookNow(selectedReel)}
                        className="w-auto bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Details Modal */}
      {showDetailsModal && selectedReel && isMobileView && (
        <div className="fixed inset-0 z-[1000] bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b">
            <button onClick={toggleDetailsModal} className="text-black p-2">
              <FiArrowLeft size={24} />
            </button>
            <h2 className="text-lg font-bold">Service Details....</h2>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          <div className="p-4">
            {productImages.length > 0 && (
              <>
                <div className="w-full">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1.2}
                    centeredSlides={true}
                    onSlideChange={(swiper) =>
                      setSelectedImage(swiper.activeIndex)
                    }
                    initialSlide={selectedImage}
                    modules={[Navigation, Pagination]}
                    className="mb-4"
                  >
                    {productImages.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative aspect-square">
                          <img
                            src={img}
                            alt={`${
                              selectedReel.service_data?.service_name ||
                              selectedReel.category_data?.category_name
                            } - ${index + 1}`}
                            className="w-full h-64 object-contain rounded-lg mx-auto"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {productImages.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto py-2">
                      {productImages.map((img, index) => (
                        <div
                          key={index}
                          className={`shrink-0 cursor-pointer w-12 h-12 ${
                            selectedImage === index
                              ? "border-2 border-black"
                              : ""
                          }`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center">
                      {selectedReel.service_data?.service_image ||
                      selectedReel.category_data?.category_image ? (
                        <img
                          src={
                            selectedReel.service_data?.service_image ||
                            selectedReel.category_data?.category_image
                          }
                          alt={
                            selectedReel.service_data?.service_image ||
                            selectedReel.category_data?.category_image
                          }
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <div className="text-black text-xs">No image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {selectedReel.service_data?.service_name ||
                          selectedReel.category_data?.category_name}
                      </h3>
                      {selectedReel.service_data?.price && (
                        <p className="text-xl font-semibold">
                          ₹ {selectedReel.service_data.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-md mb-2">Description</h3>
                    <p className="text-gray-700">
                      {selectedReel.service_data?.description?.replace(
                        /<[^>]*>/g,
                        ""
                      ) ||
                        selectedReel.description ||
                        "No description available"}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleBookNow(selectedReel)}
                      className="w-auto bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReelCarousel;