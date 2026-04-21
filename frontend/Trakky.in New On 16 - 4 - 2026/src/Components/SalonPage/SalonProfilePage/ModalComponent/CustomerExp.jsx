import React, { useEffect, useRef, useState } from "react";
import "./salonprofilemodal.css";
import leftArrow from "../../../../Assets/images/icons/long_left.svg";
import share_svg from "../../../../Assets/images/icons/share_icon_n.svg";
import moment from "moment";
import { ChevronLeft, ChevronRight, VolumeOff, VolumeUp, Fullscreen, Favorite, FavoriteBorder } from "@mui/icons-material";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

const CustomerExp = ({
  category,
  closeModal,
  salonData,
  workData,
  tempSelectedCategory,
  tempSelectedImage,
  isMobile,
  currentIndex,
  onNext,
  onPrev
}) => {
  const videoRefs = useRef([]);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likedItems, setLikedItems] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const reelContainerRef = useRef(null);

  useEffect(() => {
    const counts = {};
    workData.forEach((item) => {
      counts[item.id] = Math.floor(Math.random() * 51); // Random like count between 0 and 50
    });
    setLikeCounts(counts);
  }, [workData]);

  // Instagram-style scroll to play only one video at a time
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            if (index) {
              setCurrentReelIndex(parseInt(index));
              
              // Pause all videos
              videoRefs.current.forEach((video, idx) => {
                if (video) {
                  if (idx === parseInt(index)) {
                    video.play().catch(e => console.log("Play failed:", e));
                  } else {
                    video.pause();
                  }
                }
              });
            }
          }
        });
      },
      { threshold: 0.7 } // 70% visibility triggers play
    );

    // Observe all reel items
    const reelItems = document.querySelectorAll('.CE-reel-item');
    reelItems.forEach((item, index) => {
      item.dataset.index = index;
      observer.observe(item);
    });

    return () => {
      reelItems.forEach(item => observer.unobserve(item));
    };
  }, [isMobile, workData]);

  const toggleLike = (id) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [id]: Math.max(0, (prevCounts[id] || 0) - 1),
        }));
      } else {
        newSet.add(id);
        setLikeCounts((prevCounts) => ({
          ...prevCounts,
          [id]: (prevCounts[id] || 0) + 1,
        }));
      }
      return newSet;
    });
  };

  function categorizeData(data, activeCategoryId) {
    const categorizedData = {};

    data.forEach((item) => {
      const categoryName = item.category_data.name;
      const categoryGender = item.category_data.category_gender;
      const objId = item.id;
      const categoryId = item.category_data.id;
      const uniqueKey = `${categoryName}_${categoryGender}_${categoryId}_${objId}`;

      if (!categorizedData[uniqueKey]) {
        categorizedData[uniqueKey] = [];
      }
      categorizedData[uniqueKey].push(item);
    });

    let result = Object.entries(categorizedData).map(([uniqueKey, catData]) => {
      const [catName, catGender, catId, objId] = uniqueKey.split("_");
      return {
        cat_name: catName,
        cat_gender: catGender,
        cat_id: catId,
        cat_data: catData,
        id: objId,
      };
    });

    result.sort((a, b) => {
      const isActiveA = a.id == tempSelectedImage;
      const isActiveB = b.id == tempSelectedImage;

      if (isActiveA === isActiveB) return 0;
      if (isActiveA) return -1;
      if (isActiveB) return 1;
    });

    if (activeCategoryId === "all") {
      return result.sort((a, b) => {
        const isActiveA = parseInt(a.cat_id) === tempSelectedCategory;
        const isActiveB = parseInt(b.cat_id) === tempSelectedCategory;

        if (isActiveA === isActiveB) return 0;
        if (isActiveA) return -1;
        if (isActiveB) return 1;
      });
    }

    return result.sort((a, b) => {
      const isActiveA = parseInt(a.cat_id) === activeCategoryId;
      const isActiveB = parseInt(b.cat_id) === activeCategoryId;

      if (isActiveA === isActiveB) return 0;
      if (isActiveA) return -1;
      if (isActiveB) return 1;
    });
  }

  const handleVideoRef = (el, idx) => {
    if (el) {
      videoRefs.current[idx] = el;
    }
  };

  const handleShare = () => {
    if (!navigator.share) {
      document.execCommand("copy", true, window.location.href);
      alert("Link copied to clipboard");
      return;
    }

    navigator
      .share({
        title: salonData?.name || "Trakky",
        text: "Check out this salon",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  const handleBookNowBtn = (serviceName) => {
    if (!salonData?.name || !serviceName) {
      return;
    }

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=As%20I%20watched%20customer%20experience%20of%20${encodeURIComponent(
      serviceName
    )}%20of%20${encodeURIComponent(
      salonData?.name
    )}%2C%20${encodeURIComponent(salonData?.area || '')}%2C%20${encodeURIComponent(
      salonData?.city || ''
    )}%2C%20I%20want%20to%20book%20${encodeURIComponent(serviceName)}`;

    window.open(link, "_blank");
  };

  const formatTime = (dateTime) => {
    const now = moment();
    const createdAt = moment(dateTime);
    const duration = moment.duration(now.diff(createdAt));
    const hours = duration.asHours();

    return hours < 24
      ? `${Math.floor(hours)} hours ago`
      : createdAt.format("MMM DD, YYYY");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = !isMuted;
    });
  };

  const handleNext = async () => {
    if (isLoading || !onNext) return;
    
    setIsLoading(true);
    try {
      await onNext();
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async () => {
    if (isLoading || !onPrev) return;
    
    setIsLoading(true);
    try {
      await onPrev();
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  let categoryData = categorizeData(workData, category?.id);

  const currentItem = workData && workData.length > 0 ? workData[currentIndex] : null;
  const productImages = currentItem ? [
    currentItem.service_data?.service_image || currentItem.category_data?.category_image,
    currentItem.client_image,
  ].filter(Boolean) : [];

  if (isMobile) {
    const allEntries = categoryData.flatMap((item) => item.cat_data);
    return (
      <div className="CE-main-container mobile-reels-container">
        <div className="CE-modal-header sticky top-0 z-50">
          <img
            src={leftArrow}
            alt="Back"
            onClick={closeModal}
            className="!cursor-pointer"
          />
          <h2 className="header-title">Customer's experience</h2>
        </div>
        <div className="CE-reels-container" ref={reelContainerRef}>
          {allEntries.map((entry, idx) => (
            <div className="CE-reel-item" key={entry.id || idx}>
              <div className="CE-media-container">
                {entry?.video ? (
                  <video
                    ref={(el) => handleVideoRef(el, idx)}
                    className="video-player instagram-reel-video"
                    muted={isMuted}
                    loop
                    playsInline
                    poster={entry?.video_thumbnail_image || entry?.client_image}
                  >
                    <source src={entry?.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={entry?.client_image}
                    alt="Client"
                    className="object-contain instagram-reel-image"
                  />
                )}
                
                {/* Instagram-style Right Action Buttons */}
                <div className="CE-overlay-right instagram-actions">
                  <button className="CE-action-btn" onClick={() => toggleLike(entry.id)}>
                    {likedItems.has(entry.id) ? 
                      <Favorite className="action-icon-white" style={{ fontSize: '28px' }} /> : 
                      <FavoriteBorder className="action-icon-white" style={{ fontSize: '28px' }} />
                    }
                    <span className="action-count-white">{likeCounts[entry.id] || 0}</span>
                  </button>
                  
                  <button className="CE-action-btn" onClick={handleShare}>
                    <img src={share_svg} alt="Share" className="share-icon-white w-6 h-6" />
                    <span className="action-count-white">Share</span>
                  </button>
                  
                  <button className="CE-action-btn" onClick={() => handleBookNowBtn(entry?.service)}>
                    <div className="book-now-icon-white">B</div>
                    <span className="action-count-white">Book</span>
                  </button>
                </div>

                {/* Instagram-style Bottom Content - Reduced gap */}
                <div className="CE-overlay-bottom instagram-content compact-bottom">
                  <div className="CE-salon-info compact-info">
                    <img src={salonData?.main_image} alt="Salon" className="salon-avatar" />
                    <h4 className="salon-name">{salonData?.name}</h4>
                    <button className="follow-btn">Follow</button>
                  </div>
                  
                  <div className="CE-service-name compact-service">{entry?.service}</div>
                  
                  <div className="CE-description-container compact-description">
                    <p className="CE-description">
                      {showFullDescription ? 
                        entry?.description : 
                        truncateDescription(entry?.description)
                      }
                      {entry?.description && entry.description.length > 100 && (
                        <button 
                          className="read-more-btn"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                          {showFullDescription ? " ...Show less" : " ...more"}
                        </button>
                      )}
                    </p>
                  </div>
                  
                  <div className="CE-time compact-time">{formatTime(entry?.created_at)}</div>
                </div>

                {/* Mute Button */}
                <button className="CE-mute-btn instagram-mute" onClick={toggleMute}>
                  {isMuted ? 
                    <VolumeOff className="text-white" style={{ fontSize: '20px' }} /> : 
                    <VolumeUp className="text-white" style={{ fontSize: '20px' }} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handlePrev}
        disabled={isLoading}
        className="desktop-nav-button desktop-nav-button-left fixed-nav-button"
      >
        {isLoading ? (
          <div className="loader-spinner-small"></div>
        ) : (
          <WestIcon fontSize="medium" />
        )}
      </button>
      
      <button
        onClick={handleNext}
        disabled={isLoading}
        className="desktop-nav-button desktop-nav-button-right fixed-nav-button"
      >
        {isLoading ? (
          <div className="loader-spinner-small"></div>
        ) : (
          <EastIcon fontSize="medium" />
        )}
      </button>

      <div className="desktop-customer-exp">
        {currentItem && (
          <div className="flex h-full">
            {/* Left Side - Media */}
            <div
              className="w-[40%] h-full flex items-center justify-center relative bg-black instagram-reel-container"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {currentItem.video ? (
                <>
                  <video
                    src={currentItem.video}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="instagram-reel-video-desktop"
                  />
                  {showControls && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-opacity duration-300"
                      >
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                      </button>
                      <button
                        onClick={() => {
                          const videoElem = document.querySelector('.instagram-reel-video-desktop');
                          if (videoElem.requestFullscreen) {
                            videoElem.requestFullscreen();
                          }
                        }}
                        className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full transition-opacity duration-300"
                      >
                        <Fullscreen />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <img
                  src={currentItem.client_image}
                  alt={currentItem.service || "Customer experience"}
                  className="instagram-reel-image-desktop"
                />
              )}
            </div>

            {/* Right Side - Details */}
            <div className="w-[58%] h-full bg-white flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    {salonData?.main_image ? (
                      <img
                        src={salonData.main_image}
                        alt={salonData?.name}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-black text-xs text-center">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{salonData?.name}</h3>
                    <p className="text-gray-600">{currentItem.service}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">
                    {currentItem.description || "No description available"}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{currentItem.category_data?.category_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{currentItem.category_data?.category_gender}</p>
                    </div>
                    <div className="absolute bottom-28">
                      <p className="text-sm text-gray-600">{formatTime(currentItem.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleLike(currentItem.id)}
                    className="flex-1 border border-red-500 py-3 rounded-md flex items-center justify-center gap-2"
                  >
                    {likedItems.has(currentItem.id) ? <Favorite /> : <FavoriteBorder />}
                    Like ({likeCounts[currentItem.id] || 0})
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 border border-black py-3 rounded-md flex items-center justify-center gap-2"
                  >
                    <img src={share_svg} alt="Share" className="w-5 h-5" />
                    Share
                  </button>
                  <button
                    onClick={() => handleBookNowBtn(currentItem.service)}
                    className="flex-1 bg-black text-white py-3 rounded-md"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerExp;