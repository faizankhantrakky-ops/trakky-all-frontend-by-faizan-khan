  import React, { useState, useRef, useEffect } from "react";
import "./salonprofilemodal.css";
import { IoMdClose } from "react-icons/io";
import {
  ShareOutlined,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { FaCheck, FaRegClock } from "react-icons/fa";

const OfferSalonModal = ({ data, handleClose, salon, type, onBookNow }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedLength, setSelectedLength] = useState(null);
  const [showLengthError, setShowLengthError] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const videoRef = useRef(null);
  const termsModalRef = useRef(null);

  const STYLIST_OPTIONS = [
    { name: "Junior Stylist", extra: 0 },
    { name: "Senior Stylist", extra: 100 },
    { name: "Master Stylist", extra: 250 },
  ];


  useEffect(()=>{
    console.log(data);
  })


  // Check if lengths exist in data
  const hasLengths = data?.lengths && Array.isArray(data.lengths) && data.lengths.length > 0;

  // Convert lengths to easy format
  const lengthOptions = hasLengths
    ? data.lengths.map((lengthObj) => {
        const lengthName = Object.keys(lengthObj)[0];
        const lengthData = lengthObj[lengthName];
        return {
          name: lengthName,
          price: lengthData.price,
          timing: lengthData.timing || { Total_seating: "60" },
        };
      })
    : [];

  // Auto select first length if available
  useEffect(() => {
    if (hasLengths && lengthOptions.length > 0 && !selectedLength) {
      setSelectedLength(lengthOptions[0]);
    }
  }, [hasLengths, lengthOptions]);

  // Auto select Junior Stylist by default
  useEffect(() => {
    if (!selectedStylist) {
      setSelectedStylist(STYLIST_OPTIONS[0]);
    }
  }, []);

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
  };

  const stylistExtra = selectedStylist?.extra || 0;
  const basePrice = hasLengths
    ? Number(selectedLength?.price || 0)
    : Number(data?.price || data?.discount_price || 0);
  const finalPrice = basePrice + stylistExtra;

  // Terms and Conditions
  const termsAndConditions = [
    "Prices may vary based on hair length, volume, texture, and service customization. Final pricing will be confirmed only after an in-person consultation at the salon.",
    "Offers are valid only on appointments booked through TRAKKY. Walk-in pricing and salon-direct rates may differ.",
    "Additional charges may apply for premium products, add-ons, or extra time required depending on the client's hair/skin condition.",
    "Color, chemical, and technical services require a patch test and consultation before final pricing and service confirmation.",
    "Offer validity is limited and subject to change at the discretion of TRAKKY or the partnered salon.",
    "Appointments are subject to availability. The salon may adjust or reschedule in case of operational requirements.",
    "Taxes (if applicable) are not included in the displayed offer price unless explicitly mentioned.",
    "Cancellation and no-show policies will follow the respective salon's rules listed on TRAKKY.",
    "Service results may vary based on individual hair or skin conditions. Neither TRAKKY nor the salon is responsible for results affected by prior treatments, damage, or unrealistic expectations.",
    "The salon reserves the right to refuse service if the client's hair/skin is unsuitable for the requested treatment.",
    "Images used in offers are for representation only and may not depict actual results.",
    "TRAKKY offers cannot be combined with any other deals, packages, or ongoing promotions unless stated.",
  ];

  const handleLengthSelect = (length) => {
    setSelectedLength(length);
    setShowLengthError(false);
  };

  const handleBookNowBtn = () => {
    if (hasLengths && !selectedLength) {
      setShowLengthError(true);
      return;
    }

    const name = data?.service_name || data?.name || "Service";

    let message = `Can you provide more details about '${name}' at ${salon?.name} in ${salon?.area}, ${salon?.city}?`;

    if (hasLengths) {
      message += ` I want the ${selectedLength.name} length (₹${basePrice}).`;
    } else {
      message += ` Price: ₹${basePrice}.`;
    }

    if (selectedStylist) {
      message += ` Preferred stylist: ${selectedStylist.name}${stylistExtra > 0 ? ` (+₹${stylistExtra})` : ""}.`;
    }

    message += ` Final price: ₹${finalPrice}.`;

    const link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
    handleClose();
  };

  const handleShareOffer = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${data?.service_name || data?.name} at ${salon?.name}`,
        text: `Check out this service at ${salon?.name}`,
        url: currentUrl,
      }).catch(console.log);
    } else {
      navigator.clipboard.writeText(currentUrl).then(() => alert("Link copied!"));
    }
  };

  const isVideo = data?.video && (data.video.includes(".mp4") || data.video.includes(".webm") || data.video.includes(".mov"));

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  const renderMediaContent = () => {
    if (isVideo) {
      return (
        <div className="media-container relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <video
            ref={videoRef}
            className="w-full object-cover rounded-md cursor-pointer"
            poster={data?.service_image || data?.image}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            muted={isMuted}
            loop
          >
            <source src={data.video} type="video/mp4" />
          </video>
          <div className={`video-overlay absolute inset-0 flex items-center justify-center ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`} onClick={toggleVideoPlay}>
            {!isPlaying && <div className="play-button bg-black bg-opacity-60 rounded-full p-4"><PlayArrow style={{ color: "white", fontSize: "40px" }} /></div>}
          </div>
        </div>
      );
    }
    return (
      <img
        src={data?.service_image || data?.image}
        alt={data?.service_name || data?.name}
        className="h-40 w-auto rounded-md object-cover mx-auto"
      />
    );
  };

const LengthOption = ({ item, isSelected, onClick }) => {
  const timing = item.timing || {};

  const days = parseInt(timing.Total_days) || 0;
  const hours = parseInt(timing.Total_hours) || 0;
  const minutes = parseInt(timing.Total_minutes) || 0;
  const seating = parseInt(timing.Total_seating) || 0;

  let timeParts = [];
  if (days > 0) timeParts.push(`${days} Day${days > 1 ? 's' : ''}`);
  if (hours > 0) timeParts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) timeParts.push(`${minutes} min`);
  if (seating > 0) timeParts.push(`${seating} Seating`);

  const displayTime = timeParts.length > 0 ? timeParts.join(" · ") : null;

  return (
    <div
      className={`length-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="length-card-accent" aria-hidden="true" />

      <div className="length-card-body">
        <div className="length-info">
          <h3 className="length-name">{item.name}</h3>
          <div className="length-meta-row">
            {displayTime && (
              <div className="length-time-badge">
                <FaRegClock className="length-time-icon" />
                <span>{displayTime}</span>
              </div>
            )}
            <div className="length-price-inline">
              <span className="length-price-currency">₹</span>
              <span className="length-price-value">
                {Number(item.price).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className={`length-radio ${isSelected ? 'checked' : ''}`} aria-hidden="true">
          <FaCheck className="length-radio-icon" />
        </div>
      </div>
    </div>
  );
};

  const StylistOption = ({ item, isSelected, onClick }) => {
    return (
      <div
        className={`length-card ${isSelected ? 'selected' : ''}`}
        onClick={() => onClick(item)}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
      >
        <div className="length-card-accent" aria-hidden="true" />

        <div className="length-card-body">
          <div className="length-info">
            <h3 className="length-name">{item.name}</h3>
            <div className="length-meta-row">
              <div className="length-price-inline">
                <span className="length-price-currency">
                  {item.extra > 0 ? "+₹" : "₹"}
                </span>
                <span className="length-price-value">
                  {item.extra > 0 ? item.extra.toLocaleString("en-IN") : "0"}
                </span>
              </div>
            </div>
          </div>

          <div className={`length-radio ${isSelected ? 'checked' : ''}`} aria-hidden="true">
            <FaCheck className="length-radio-icon" />
          </div>
        </div>
      </div>
    );
  };

  const TermsModal = () => (
    <div className="terms-modal-overlay">
      <div ref={termsModalRef} className="terms-modal-container">
        <div className="terms-modal-header">
          <h2 className="terms-modal-title">Terms & Conditions</h2>
          <button className="terms-modal-close-btn" onClick={() => setShowTermsModal(false)}>
            <IoMdClose />
          </button>
        </div>
        <div className="terms-modal-content">
          <ul className="terms-list">
            {termsAndConditions.map((term, index) => (
              <li key={index} className="terms-list-item">
                <span className="terms-list-number">{index + 1}</span>
                <span className="terms-list-text">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="Membership-Modal-main-container osm-modal">
        <button
          type="button"
          className="osm-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <IoMdClose />
        </button>

        <div className="MSM-details">
          <div className="MSM-Title-header flex items-center justify-center text-center !font-semibold">
            Service Details
          </div>

          <div className="MSM-membership-meta-info">
            <div className="osm-service-row">
              <div className="osm-service-media">
                {renderMediaContent()}
              </div>
              <div className="osm-service-name">
                <h2>{data?.service_name || data?.name || "Service"}</h2>
              </div>
            </div>

            {/* Lengths wala case */}
            {hasLengths ? (
              <>
                <div className="length-section">
                  <div className="length-section-header">
                    <div className="length-section-title-group">
                      <div className="length-section-title-row">
                        <h3 className="length-section-title">Choose your length</h3>
                      </div>
                      <p className="length-section-subtitle">
                        Pricing varies based on the length you select
                      </p>
                    </div>
                  </div>

                  <div className="length-options-list">
                    {lengthOptions.map((length, index) => (
                      <LengthOption
                        key={index}
                        item={length}
                        isSelected={selectedLength?.name === length.name}
                        onClick={() => handleLengthSelect(length)}
                      />
                    ))}
                  </div>
                </div>

                {showLengthError && (
                  <div className="price-selection-message mt-2">
                    <div className="price-selection-icon">!</div>
                    <span>Please select a length to continue</span>
                  </div>
                )}

              </>
            ) : (
              /* No lengths wala case – simple price */
              <div className="flex justify-between OSM-price-cart">
                {/* <div>
                  {data?.discount > 0 && (
                    <span className="flex text-gray-500 text-sm pl-1">
                      ₹ <del className="!mx-0">{data?.discount}</del>
                    </span>
                  )}
                  <div className="text-[18px] font-medium pl-1">
                    ₹{data?.price || data?.discount_price || "0"} only
                  </div>
                </div> */}
              </div>
            )}

            {/* Hair Stylist selection */}
            {/* <div className="length-section">
              <div className="length-section-header">
                <div className="length-section-title-group">
                  <div className="length-section-title-row">
                    <h3 className="length-section-title">Choose your stylist</h3>
                  </div>
                  <p className="length-section-subtitle">
                    Higher tiers have more experience and add a small extra charge
                  </p>
                </div>
              </div>

              <div className="length-options-list">
                {STYLIST_OPTIONS.map((stylist, index) => (
                  <StylistOption
                    key={index}
                    item={stylist}
                    isSelected={selectedStylist?.name === stylist.name}
                    onClick={handleStylistSelect}
                  />
                ))}
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="price-action-section ">
              <div className="selected-price-info">
                <div className="selected-price-label">Final Price</div>
                <div className="selected-price-value">
                  ₹{Number(finalPrice).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="action-buttons">
                <button className="share-btn" onClick={handleShareOffer}>
                  <ShareOutlined /> Share
                </button>
                <button
                  onClick={handleBookNowBtn}
                  className={`book-now-btn ${hasLengths && !selectedLength ? 'disabled' : ''}`}
                  disabled={hasLengths && !selectedLength}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="osm-terms-block">
            <div
              className="osm-terms-header"
              onClick={() => setShowTermsModal(true)}
            >
              <h3 className="osm-terms-title">Terms &amp; Conditions</h3>
              <span className="osm-terms-view-all">View All</span>
            </div>
            {(data?.description || data?.terms_and_conditions) && (
              <div
                className="osm-terms-body"
                onClick={() => setShowTermsModal(true)}
                dangerouslySetInnerHTML={{
                  __html: data?.description || data?.terms_and_conditions,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {showTermsModal && <TermsModal />}
    </>
  );
};

export default OfferSalonModal;





// import React, { useState, useRef, useEffect } from "react";
// import "./salonprofilemodal.css";
// import { IoMdClose } from "react-icons/io";
// import {
//   ShareOutlined,
//   PlayArrow,
//   Pause,
//   VolumeUp,
//   VolumeOff,
// } from "@mui/icons-material";

// const OfferSalonModal = ({ data, handleClose, salon, type, onBookNow }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [showControls, setShowControls] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const videoRef = useRef(null);
//   const termsModalRef = useRef(null);

//   // Terms and Conditions Data for Popup Modal
//   const termsAndConditions = [
//     "Prices may vary based on hair length, volume, texture, and service customization. Final pricing will be confirmed only after an in-person consultation at the salon.",
//     "Offers are valid only on appointments booked through TRAKKY. Walk-in pricing and salon-direct rates may differ.",
//     "Additional charges may apply for premium products, add-ons, or extra time required depending on the client's hair/skin condition.",
//     "Color, chemical, and technical services require a patch test and consultation before final pricing and service confirmation.",
//     "Offer validity is limited and subject to change at the discretion of TRAKKY or the partnered salon.",
//     "Appointments are subject to availability. The salon may adjust or reschedule in case of operational requirements.",
//     "Taxes (if applicable) are not included in the displayed offer price unless explicitly mentioned.",
//     "Cancellation and no-show policies will follow the respective salon's rules listed on TRAKKY.",
//     "Service results may vary based on individual hair or skin conditions. Neither TRAKKY nor the salon is responsible for results affected by prior treatments, damage, or unrealistic expectations.",
//     "The salon reserves the right to refuse service if the client's hair/skin is unsuitable for the requested treatment.",
//     "Images used in offers are for representation only and may not depict actual results.",
//     "TRAKKY offers cannot be combined with any other deals, packages, or ongoing promotions unless stated.",
//   ];

//   // Autoplay video when modal opens
//   useEffect(() => {
//     if (isVideo && videoRef.current) {
//       const playVideo = async () => {
//         try {
//           videoRef.current.muted = true;
//           await videoRef.current.play();
//           setIsPlaying(true);
//         } catch (error) {
//           console.log("Autoplay failed:", error);
//           setIsPlaying(false);
//         }
//       };
//       playVideo();
//     }
//   }, [data]);

//   // Handle terms modal open/close
//   const handleTermsClick = () => {
//     setShowTermsModal(true);
//   };

//   const handleCloseTermsModal = () => {
//     setShowTermsModal(false);
//   };

//   // Close terms modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         termsModalRef.current &&
//         !termsModalRef.current.contains(event.target)
//       ) {
//         handleCloseTermsModal();
//       }
//     };

//     if (showTermsModal) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = "unset";
//     };
//   }, [showTermsModal]);

//   const handleShareOffer = () => {
//     const currentUrl = window.location.href;
//     if (navigator.share) {
//       navigator
//         .share({
//           title: `${displayData?.name} Offer at ${salon?.name}`,
//           text: `Check out this ${displayData?.name} at ${
//             salon?.name
//           } for just ₹${displayData?.discount_price}`,
//           url: currentUrl,
//         })
//         .catch((err) => {
//           console.log("Error sharing:", err);
//           fallbackCopyToClipboard(currentUrl);
//         });
//     } else {
//       fallbackCopyToClipboard(currentUrl);
//     }
//   };

//   const fallbackCopyToClipboard = (text) => {
//     navigator.clipboard
//       .writeText(text)
//       .then(() => {
//         alert("Link copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Failed to copy:", err);
//         const textarea = document.createElement("textarea");
//         textarea.value = text;
//         document.body.appendChild(textarea);
//         textarea.select();
//         document.execCommand("copy");
//         document.body.removeChild(textarea);
//         alert("Link copied to clipboard!");
//       });
//   };

//   const handleBookNowBtn = (name, price) => {
//     if (type === "service") {
//       if (!salon?.name) return;

//       const discount =
//         displayData.actual_price &&
//         displayData.discount_price &&
//         displayData.actual_price > displayData.discount_price
//           ? Math.round(
//               ((displayData.actual_price - displayData.discount_price) / displayData.actual_price) *
//                 100
//             )
//           : 0;

//       let offerTime = { hours: 0, minutes: 30 };
//       try {
//         if (data.offer_time) {
//           offerTime =
//             typeof data.offer_time === "string"
//               ? JSON.parse(data.offer_time)
//               : data.offer_time;
//         } else if (data.service_time) {
//           offerTime =
//             typeof data.service_time === "string"
//               ? JSON.parse(data.service_time)
//               : data.service_time;
//         }
//       } catch (e) {
//         console.error("Error parsing offer time:", e);
//       }

//       const offerAsService = {
//         id: data.id,
//         name: displayData.name,
//         price: displayData.discount_price,
//         actual_price: displayData.actual_price,
//         discount: discount,
//         description: displayData.description,
//         terms_and_conditions: displayData.terms,
//         image: data?.service_image || data?.image,
//         isOffer: false,
//         expire_date: data?.expire_date,
//         service_time: offerTime,
//       };

//       if (onBookNow) {
//         onBookNow(offerAsService);
//       } else {
//         console.log("Service Book Now clicked, but onBookNow is not defined.");
//       }
//     } else if (type === "offer") {
//       if (!salon?.name) return;

//       const discount =
//         displayData.actual_price &&
//         displayData.discount_price &&
//         displayData.actual_price > displayData.discount_price
//           ? Math.round(
//               ((displayData.actual_price - displayData.discount_price) / displayData.actual_price) *
//                 100
//             )
//           : 0;

//       let offerTime = { hours: 0, minutes: 30 };
//       try {
//         if (data.offer_time) {
//           offerTime =
//             typeof data.offer_time === "string"
//               ? JSON.parse(data.offer_time)
//               : data.offer_time;
//         }
//       } catch (e) {
//         console.error("Error parsing offer time:", e);
//       }

//       const offerAsService = {
//         id: data.id,
//         name: displayData.name,
//         price: displayData.discount_price,
//         actual_price: displayData.actual_price,
//         discount: discount,
//         description: displayData.description,
//         terms_and_conditions: displayData.terms,
//         image: data?.image,
//         isOffer: true,
//         expire_date: data?.expire_date,
//         service_time: offerTime,
//       };

//       if (onBookNow) {
//         onBookNow(offerAsService);
//       } else {
//         console.log("Offer Book Now clicked, but onBookNow is not defined.");
//       }
//     }
//     handleClose();
//   };

//   // Check if content is video
//   const isVideo =
//     data?.video &&
//     (data.video.includes(".mp4") ||
//       data.video.includes(".webm") ||
//       data.video.includes(".mov") ||
//       data.video.includes("video/"));

//   const toggleVideoPlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play().catch((error) => {
//           console.log("Play failed:", error);
//         });
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleVideoEnd = () => setIsPlaying(false);
//   const handleVideoPlay = () => setIsPlaying(true);
//   const handleVideoPause = () => setIsPlaying(false);
//   const handleVideoClick = (e) => {
//     e.stopPropagation();
//     toggleVideoPlay();
//   };
//   const handleMouseEnter = () => setShowControls(true);
//   const handleMouseLeave = () => setShowControls(false);

//   const renderMediaContent = () => {
//     if (isVideo) {
//       return (
//         <div
//           className="media-container relative"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <video
//             ref={videoRef}
//             className="w-full object-cover rounded-md cursor-pointer"
//             poster={data?.video_thumbnail_image || data?.service_image || data?.image}
//             onEnded={handleVideoEnd}
//             onPlay={handleVideoPlay}
//             onPause={handleVideoPause}
//             onClick={handleVideoClick}
//             playsInline
//             muted={isMuted}
//             loop
//           >
//             <source src={data.video} type="video/mp4" />
//             <source src={data.video} type="video/webm" />
//             <source src={data.video} type="video/quicktime" />
//             Your browser does not support the video tag.
//           </video>

//           <div
//             className={`video-overlay absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
//               isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
//             }`}
//             onClick={handleVideoClick}
//           >
//             {!isPlaying && (
//               <div className="play-button bg-black bg-opacity-60 rounded-full p-4 transition-all duration-300 hover:bg-opacity-80 hover:scale-110">
//                 <PlayArrow style={{ color: "white", fontSize: "40px" }} />
//               </div>
//             )}
//           </div>  

//           <div
//             className={`video-controls-bar absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 transition-opacity duration-300 ${
//               showControls || !isPlaying ? "opacity-100" : "opacity-0"
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 <button
//                   className="control-btn text-white hover:text-gray-300 transition-colors"
//                   onClick={toggleVideoPlay}
//                 >
//                   {isPlaying ? <Pause /> : <PlayArrow />}
//                 </button>
//                 <button
//                   className="control-btn text-white hover:text-gray-300 transition-colors"
//                   onClick={toggleMute}
//                 >
//                   {isMuted ? <VolumeOff /> : <VolumeUp />}
//                 </button>
//                 <span className="text-white text-sm">
//                   {isPlaying ? "Playing" : "Paused"}
//                 </span>
//               </div>
//               <div className="text-white text-sm">
//                 {videoRef.current &&
//                   `${Math.floor(videoRef.current.currentTime || 0)}s`}
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     } else {
//       // Get image based on type
//       const imageSrc = type === "service" 
//         ? (data?.service_image || data?.image || data?.video_thumbnail_image)
//         : (data?.image || data?.video_thumbnail_image);
      
//       return (
//         <div className="flex justify-center items-center h-40 w-auto rounded-md">
//           <img
//             src={imageSrc}
//             alt={displayData?.name}
//             className="h-40 w-auto rounded-md object-cover"
//           />
//         </div>
//       );
//     }
//   };

//   // Terms Modal Component
//   const TermsModal = () => (
//     <div className="terms-modal-overlay">
//       <div ref={termsModalRef} className="terms-modal-container">
//         <div className="terms-modal-header">
//           <h2 className="terms-modal-title">Terms & Conditions</h2>
//           <button
//             className="terms-modal-close-btn"
//             onClick={handleCloseTermsModal}
//           >
//             <IoMdClose />
//           </button>
//         </div>
//         <div className="terms-modal-content">
//           <ul className="terms-list">
//             {termsAndConditions.map((term, index) => (
//               <li key={index} className="terms-list-item">
//                 <span className="terms-list-number">{index + 1}</span>
//                 <span className="terms-list-text">{term}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );

//   // CRITICAL FIX: Get display data based on type WITHOUT changing design
//   const getDisplayData = () => {
//     if (type === "service") {
//       // For services - map service fields to match expected structure
//       return {
//         name: data?.service_name || data?.name,
//         actual_price: data?.price || data?.actual_price,
//         discount_price: data?.price || data?.discount_price,
//         description: data?.description,
//         terms: data?.description || data?.terms_and_conditions,
//       };
//     } else if (type === "offer") {
//       // For offers
//       return {
//         name: data?.display_name || data?.name,
//         actual_price: data?.actual_price,
//         discount_price: data?.discount_price,
//         description: data?.display_sub_name,
//         terms: data?.terms_and_conditions,
//       };
//     } else if (type === "national-offer") {
//       // For national offers
//       return {
//         name: data?.name,
//         actual_price: data?.actual_price,
//         discount_price: data?.discount_price,
//         description: data?.description,
//         terms: data?.terms_and_conditions,
//       };
//     }
//     return {
//       name: data?.name || data?.display_name,
//       actual_price: data?.actual_price,
//       discount_price: data?.discount_price,
//       description: data?.description,
//       terms: data?.terms_and_conditions,
//     };
//   };

//   const displayData = getDisplayData();

//   return (
//     <>
//       {type === "offer" || type === "service" || type === "national-offer" ? (
//         <div className="Membership-Modal-main-container">
//           <div className="membership-close-btn">
//             <div className="button" onClick={handleClose}>
//               <IoMdClose sx={{ height: "30px", width: "30px" }} />
//             </div>
//           </div>
//           <div className="MSM-details">
//             <div className="MSM-Title-header flex items-center justify-center text-center !font-semibold">
//               {type === "offer" ? "Offer Details" : type === "service" ? "Service Details" : "Offers Details"}
//             </div>
//             <div className="MSM-membership-meta-info">
//               {renderMediaContent()}
//               <div className="MSM-m-m-info-offer flex justify-center">
//                 <h2 className="text-[20px] font-semibold ">
//                   {displayData?.name}
//                 </h2>
//               </div>
//               <div className="flex justify-between OSM-price-cart">
//                 <div>
//                   {displayData?.actual_price && displayData?.actual_price !== displayData?.discount_price && (
//                     <span className=" flex text-gray-500 text-sm pl-1">
//                       ₹ <del className=" !mx-0">{displayData?.actual_price}</del>
//                     </span>
//                   )}
//                   <div className="text-[18px] font-medium pl-1">
//                     ₹{displayData?.discount_price} only
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   {type !== "national-offer" && (
//                     <button className="share-btn" onClick={handleShareOffer}>
//                       <ShareOutlined />
//                       Share
//                     </button>
//                   )}
//                   <button
//                     onClick={() =>
//                       handleBookNowBtn(displayData?.name, displayData?.discount_price)
//                     }
//                   >
//                     Book Now
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Terms and Conditions Section - Keeping exact same design */}
//             <div className="MSM-membership-desc !pt-2 cursor-pointer">
//               <div className="flex items-center mb-6 justify-center m-4">
//                 <h2
//                   className="font-semibold text-center text-[18px] mb-2 mt-0 terms-clickable-section"
//                   onClick={handleTermsClick}
//                 >
//                   Terms & conditions  {" "}| 
//                 </h2>
//                 <h2
//                   className="font-semibold text-center text-[18px] mt-0 ml-2"
//                   onClick={() => setShowTermsModal(true)}
//                 >
//                    {" "}View All
//                 </h2>
//               </div>
//               <div
//                 className="terms-clickable-section"
//                 onClick={() => setShowTermsModal(true)}
//               >
//                 {displayData?.terms ? (
//                   <div
//                     dangerouslySetInnerHTML={{
//                       __html: displayData?.terms,
//                     }}
//                   />
//                 ) : (
//                   <div className="text-gray-500 text-center py-4">
//                     No terms and conditions available
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {/* Terms & Conditions Popup Modal */}
//       {showTermsModal && <TermsModal />}
//     </>
//   );
// };

// export default OfferSalonModal;
