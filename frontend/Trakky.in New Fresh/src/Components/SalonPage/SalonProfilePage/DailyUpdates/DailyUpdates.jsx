import React from "react";
import "./dailyupdate.css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import Modal from "@mui/material/Modal";
import AuthContext from "../../../../context/Auth";
import leftArrow from "../../../../Assets/images/icons/oui_arrow-left.svg";
import { ArrowRight } from "lucide-react";

const SalonDailyUpdates = (props) => {
  const { location } = React.useContext(AuthContext);
  const { user } = React.useContext(AuthContext);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [isMoreData, setIsMoreData] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMore, setViewMore] = useState({});
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false); // New state for view all modal

  const handleBookNowBtn = () => {
    if (!props?.salonData?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      props?.salonData?.name
    )}%2C%20${encodeURIComponent(
      props?.salonData?.area
    )}%2C%20${encodeURIComponent(props?.salonData?.city)}%3F`;

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
        requestOptions
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

  const getDailyUpdates = async () => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/daily-updates/?salon_id=${props?.salonData?.id}&page=1&active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        console.log("Error fetching daily updates");
        return;
      }

      const data = await res.json();
      setIsMoreData(data?.next != null);
      setDailyUpdates((prev) => [...(prev || []), ...(data?.results || [])]);
    } catch (error) {
      console.error("Error fetching daily updates:", error);
    }
  };

  const handleOpenModal = (index) => {
    setOpenModalIndex(index);
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
  };

  const handleOpenViewAllModal = () => {
    setViewAllModalOpen(true);
  };

  const handleCloseViewAllModal = () => {
    setViewAllModalOpen(false);
  };

  useEffect(() => {
    if (props?.salonData?.id) {
      getDailyUpdates();
    }
  }, [props?.salonData?.id, page]);

  return (
    <div className="N-daily-update-container">
      {(dailyUpdates || []).length > 0 && (
        <div className="N-daily_update_main">
          <div className="N-daily_update_salon_details">
            <img src={props?.salonData?.main_image} alt="" />
            <div className="N-d-u-salon-name">
              <h2>{props?.salonData?.name}</h2>
              <p>
                <span>Daily Updates</span>
                <div
                  className="N-daily-update-view-all-btn"
                  onClick={handleOpenViewAllModal}
                  style={{ 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                <div className="flex items-center gap-2 cursor-pointer mr-5">
  <span className="font-semibold">View All</span>
  <ArrowRight className="w-4 h-4" />
</div>
                </div>
              </p>
            </div>
          </div>
          <Swiper
            slidesPerView={"auto"}
            className="N-daily_update_container-ss"
          >
            {(dailyUpdates || []).map((post, index) => (
              <SwiperSlide 
                className="N-daily_update_card" 
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleOpenModal(index)}
              >
                <div className="N-daily_update_card_img">
                  <img src={post?.daily_update_img} alt="" />
                </div>
                <div className="N-daily_update_card_content">
                  <p>
                    {post?.daily_update_description?.length > 80
                      ? post?.daily_update_description?.slice(0, 80) + "..."
                      : post?.daily_update_description}
                  </p>
                </div>
                <p className="N-time-ago-daily-update">
                  {format(post?.created_at)}
                </p>
                <a
                  href={`tel:${props?.salonData?.mobile_number}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    log_adder(props?.salonData?.name, "call_now");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Book Now
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      
      {/* Modal for individual daily update (single card click) */}
      {openModalIndex !== null && dailyUpdates[openModalIndex] && (
        <Modal
          open={openModalIndex !== null}
          onClose={handleCloseModal}
          sx={{ border: "none", outline: "none" }}
        >
          <div className="N-daily-update-popup">
            <div className="N-daily-update-popup-header">
              <button onClick={handleCloseModal}>
                <img
                  src={require("../../../../Assets/images/icons/backarrow.png")}
                  alt="back"
                />
                <span>Update Details</span>
              </button>
              <button onClick={handleCloseModal}>+</button>
            </div>
            <div className="N-du-main-modal-item">
              <div className="N-daily_update_salon_details">
                <img src={props?.salonData?.main_image} alt="" />
                <div className="N-d-u-salon-name">
                  <h2>{props?.salonData?.name}</h2>
                  <p>Daily Update </p>
                </div>
              </div>
              <div className="N-modal-daily_update_card">
                <div className="N-modal-daily_update_card_img">
                  <img src={dailyUpdates[openModalIndex]?.daily_update_img} alt="" />
                </div>
                <div className="N-modal-daily_update_card_content">
                  <p>
                    {viewMore[openModalIndex]
                      ? dailyUpdates[openModalIndex]?.daily_update_description
                      : dailyUpdates[openModalIndex]?.daily_update_description?.length > 350
                      ? dailyUpdates[openModalIndex]?.daily_update_description?.slice(0, 350) + "..."
                      : dailyUpdates[openModalIndex]?.daily_update_description}
                  </p>
                  <span>
                    {dailyUpdates[openModalIndex]?.daily_update_description?.length > 350 && (
                      <button
                        onClick={() => {
                          setViewMore({
                            ...viewMore,
                            [openModalIndex]: !viewMore[openModalIndex],
                          });
                        }}
                        style={{
                          color: "#512DC8",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          paddingTop: "10px",
                        }}
                      >
                        {viewMore[openModalIndex] ? "View Less" : "View More"}
                      </button>
                    )}
                  </span>
                </div>
                <p className="N-modal-time-ago-daily-update">
                  {format(dailyUpdates[openModalIndex]?.created_at)}
                </p>
                <a
                  href={`tel:${props?.salonData?.mobile_number}`}
                  onClick={() => log_adder(props?.salonData?.name, "call_now")}
                  className="N-modal-daily-update-book-now"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for View All (shows all daily updates) */}
      <Modal
        open={viewAllModalOpen}
        onClose={handleCloseViewAllModal}
        sx={{ border: "none", outline: "none" }}
      >
        <div className="N-daily-update-popup">
          <div className="N-daily-update-popup-header">
            <button onClick={handleCloseViewAllModal}>
              <img
                src={require("../../../../Assets/images/icons/backarrow.png")}
                alt="back"
              />
              <span>All Updates</span>
            </button>
            <button onClick={handleCloseViewAllModal}>+</button>
          </div>
          
          {/* Show all daily updates in the view all modal */}
          {(dailyUpdates || []).map((item, index) => (
            <div className="N-du-main-modal-item" key={index}>
              <div className="N-daily_update_salon_details">
                <img src={props?.salonData?.main_image} alt="" />
                <div className="N-d-u-salon-name">
                  <h2>{props?.salonData?.name}</h2>
                  <p>Daily Updates </p>
                </div>
              </div>
              <div className="N-modal-daily_update_card">
                <div className="N-modal-daily_update_card_img">
                  <img src={item?.daily_update_img} alt="" />
                </div>
                <div className="N-modal-daily_update_card_content">
                  <p>
                    {viewMore[`all_${index}`]
                      ? item?.daily_update_description
                      : item?.daily_update_description?.length > 350
                      ? item?.daily_update_description?.slice(0, 350) + "..."
                      : item?.daily_update_description}
                  </p>
                  <span>
                    {item?.daily_update_description?.length > 350 && (
                      <button
                        onClick={() => {
                          setViewMore({
                            ...viewMore,
                            [`all_${index}`]: !viewMore[`all_${index}`],
                          });
                        }}
                        style={{
                          color: "#512DC8",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          paddingTop: "10px",
                        }}
                      >
                        {viewMore[`all_${index}`] ? "View Less" : "View More"}
                      </button>
                    )}
                  </span>
                </div>
                <p className="N-modal-time-ago-daily-update">
                  {format(item?.created_at)}
                </p>
                <a
                  href={`tel:${props?.salonData?.mobile_number}`}
                  onClick={() => log_adder(props?.salonData?.name, "call_now")}
                  className="N-modal-daily-update-book-now"
                >
                  Call Now
                </a>
              </div>
            </div>
          ))}

          {/* View More button for pagination in view all modal */}
          {isMoreData && (
            <div className="N-view-more-button-container">
              <button onClick={() => setPage(page + 1)}>View More</button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SalonDailyUpdates;