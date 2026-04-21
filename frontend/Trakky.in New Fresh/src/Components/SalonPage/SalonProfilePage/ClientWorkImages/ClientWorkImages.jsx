import React, { useEffect, useState, useRef } from "react";
import "./clientworkimages.css";
import leftArrow from "../../../../Assets/images/icons/oui_arrow-left.svg";
import Modal from "@mui/material/Modal";
import CustomerExp from "../ModalComponent/CustomerExp";
import { useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const ClientWorkPhoto = (props) => {
  const [clientWorkData, setClientWorkData] = useState(props?.workData);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [tempSelectedCategory, setTempSelectedCategory] = useState("all");
  const [tempSelectedImage, setTempSelectedImage] = useState("");
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const thumbnailRefs = useRef([]);
  const playTimeoutRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    let uniqueCategoryArray = [];
    clientWorkData?.forEach((work) => {
      const CatId = work?.category;
      const CatName = work?.category_data?.category_name;
      const CategoryPair = { id: CatId, name: CatName };
      if (!uniqueCategoryArray.some((category) => category.id === CatId)) {
        uniqueCategoryArray.push(CategoryPair);
      }
    });
    setCategoryOptions([{ id: "all", name: "All" }, ...uniqueCategoryArray]);
  }, [clientWorkData]);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredData(clientWorkData);
    } else {
      setFilteredData(clientWorkData.filter(work => work?.category === activeCategory));
    }
  }, [activeCategory, clientWorkData]);

  // Auto-play videos in sequence when they're in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const videoIndex = Array.from(videoRefs.current).indexOf(entry.target);
            if (videoIndex !== -1) {
              startVideoPlaybackSequence(videoIndex);
            }
          } else {
            entry.target.pause();
            entry.target.currentTime = 0;
            if (thumbnailRefs.current[index]) {
              thumbnailRefs.current[index].style.opacity = '1';
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
      clearTimeout(playTimeoutRef.current);
    };
  }, [filteredData]);

  const startVideoPlaybackSequence = (startIndex = 0) => {
    clearTimeout(playTimeoutRef.current);

    // Hide all thumbnails and pause all videos first
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
        if (thumbnailRefs.current[index]) {
          thumbnailRefs.current[index].style.opacity = '1';
        }
      }
    });

    const playNextVideo = (index) => {
      if (index >= videoRefs.current.length || !videoRefs.current[index]) return;

      setCurrentPlayingIndex(index);

      // Show the current video and hide its thumbnail
      const video = videoRefs.current[index];
      const thumbnail = thumbnailRefs.current[index];

      if (thumbnail) {
        thumbnail.style.opacity = '0';
        thumbnail.style.transition = 'opacity 0.5s ease';
      }

      video.play().catch(error => console.error("Auto-play failed:", error));

      // Schedule next video after 5 seconds
      playTimeoutRef.current = setTimeout(() => {
        // Hide current video and show its thumbnail
        if (thumbnail) {
          thumbnail.style.opacity = '1';
        }
        video.pause();
        video.currentTime = 0;

        // Move to next video
        const nextIndex = (index + 1) % videoRefs.current.length;
        playNextVideo(nextIndex);
      }, 5000);
    };

    playNextVideo(startIndex);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (props?.openClientExp) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [props?.openClientExp]);

  // Handle click outside modal content (desktop only)
  // const handleBackdropClick = (event) => {
  //   if (!isMobile && modalContentRef.current && !modalContentRef.current.contains(event.target)) {
  //     props?.handleClientExpClose();
  //   }
  // };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredData.length) % filteredData.length);
  };

  return (
    <>
      <div className="N-sp-room-main-container">
        <div className="N-sp-room-category-container">
          {categoryOptions?.length > 1 ? (
            categoryOptions.map((item) => (
              <span
                key={item?.id}
                onClick={() => setActiveCategory(item?.id)}
                className={activeCategory === item?.id ? "active" : ""}
              >
                {item.name}
              </span>
            ))
          ) : null}
        </div>
        <div className="N-sp-room-item-container">
          {filteredData?.length ? (
            filteredData.map((work, index) => (
              <div
                className="N-sp-room-item-div"
                key={work.id || index}
                onClick={() => {
                  setTempSelectedCategory(work?.category);
                  setTempSelectedImage(work?.id);
                  setCurrentIndex(index);
                  props?.handleClientExpOpen();
                }}
              >
                <div className="N-sp-room-img">
                  {work?.video ? (
                    <>
                      <img
                        ref={el => thumbnailRefs.current[index] = el}
                        src={work?.video_thumbnail_image || work?.client_image}
                        className="video-thumbnail"
                        alt="video-thumbnail"
                      />
                      <video
                        ref={el => videoRefs.current[index] = el}
                        className="video-element"
                        src={work.video}
                        muted
                        loop
                        playsInline
                      />
                    </>
                  ) : (
                    <img
                      src={work?.client_image || work?.video_thumbnail_image || work?.service_image}
                      alt="service-img"
                    />
                  )}
                </div>
                <div className="N-sp-room-item-details">
                  {work?.service || "Service Name"}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results-message">No results found for this category</div>
          )}
        </div>
        <div
          className="N-sp-room-item-see-more cursor-pointer ml-auto"
          onClick={props?.handleClientExpOpen}
        >
          see more <img src={leftArrow} alt="" />
        </div>
        <div className="N-sp-room-divider"></div>
      </div>
      <Modal
        open={props?.openClientExp}
        aria-labelledby="customer-experience-modal"
        aria-describedby="customer-experience-modal"
        sx={{
          zIndex: 11,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
        onClose={props?.handleClientExpClose}
        // onClick={handleBackdropClick}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <>
          {!isMobile && (
            <button
              onClick={props?.handleClientExpClose}
              style={{
                position: 'fixed',
                top: '20px',
                right: '230px',
                zIndex: 12,
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <CloseIcon />
            </button>
          )}
          <div
            ref={modalContentRef}
            style={{
              width: isMobile ? '100%' : '60%',
              maxWidth: '1200px',
              height: isMobile ? '100vh' : '89vh',
              maxHeight: isMobile ? 'none' : '90vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              outline: 'none',
              position: 'relative',
              borderRadius: isMobile ? '0' : '8px',
              backgroundColor: '#fff',
            }}
          >
            <CustomerExp
              closeModal={props?.handleClientExpClose}
              salonData={props?.salonData}
              tempSelectedCategory={tempSelectedCategory}
              tempSelectedImage={tempSelectedImage}
              workData={filteredData}
              category={categoryOptions.find((item) => item.id === activeCategory) || {}}
              isMobile={isMobile}
              currentIndex={currentIndex}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </>
      </Modal>
    </>
  );
};

export default ClientWorkPhoto;