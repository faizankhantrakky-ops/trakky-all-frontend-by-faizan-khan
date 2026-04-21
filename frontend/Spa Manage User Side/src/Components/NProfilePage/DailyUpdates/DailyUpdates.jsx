import React from "react";
import "./dailyupdate.css";
import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import Modal from "@mui/material/Modal";
import AuthContext from "../../../context/Auth";
import leftArrow from "../../../Assets/images/icons/oui_arrow-left.svg";
import { KeyboardArrowLeft } from "@mui/icons-material";

const DailyUpdates = (props) => {
  const { location } = React.useContext(AuthContext);
  const { user } = React.useContext(AuthContext);
  const [dailyUpdates, setDailyUpdates] = useState([]);



  const handleBookNowBtn = () => {
    if (!props?.spaData?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      props?.spaData?.name
    )}%2C%20${encodeURIComponent(
      props?.spaData?.area
    )}%2C%20${encodeURIComponent(props?.spaData?.city)}%3F`;

    window.open(link, "_blank");
  };

  const log_adder = async (name, type) => {
    const requestBody = {
      category: "spa",
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
        "https://backendapi.trakky.in/spas/log-entry/",
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


  const [isMoreData, setIsMoreData] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMore, setViewMore] = useState({});

  const getDailyUpdates = async () => {
    const res = await fetch(
      `https://backendapi.trakky.in/spas/daily-updates/?spa_id=${props?.spaData?.id}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (res.status !== 200) {
      console.log("Error");

      return;
    }
    setIsMoreData(data?.next == null ? false : true);
    setDailyUpdates((prev) => [...prev, ...data?.results]);
  };

  useEffect(() => {
    props?.spaData?.id && getDailyUpdates();
  }, [props?.spaData?.id, page]);

  return (
    <div className="N-daily-update-container">
      {dailyUpdates?.length > 0 && (
        <div className="N-daily_update_main" onClick={props?.handleOpen}>
          <div className="N-daily_update_salon_details">
            <img src={props?.spaData?.main_image} alt="spa image" />
            <div className="N-d-u-salon-name">
              <h2>{props?.spaData?.name}</h2>
              <p>
                <span>Daily Updates</span>
                <div
                  className="N-daily-update-item-see-more"
                  style={{ cursor: "pointer" }}
                >
                  see more <img src={leftArrow} alt="arrow" />{" "}
                </div>
              </p>
            </div>
          </div>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween="16"
            className="N-daily_update_container-ss"
          >
            {dailyUpdates?.map((post, index) => (
              <SwiperSlide className="N-daily_update_card" key={index}>
                <div className="N-daily_update_card_img">
                  <img src={post?.daily_update_img} alt="daily updates" />
                </div>
                <div className="N-daily_update_card_content">
                  <p>
                    {post?.daily_update_description.length > 80
                      ? post?.daily_update_description.slice(0, 80) + "..."
                      : post?.daily_update_description}
                  </p>
                </div>
                <p className="N-time-ago-daily-update">
                  {format(post?.created_at)}
                </p>
                <a
                  href={`tel:${props?.spaData?.mobile_number}`}
                  onClick={() => log_adder(props?.spaData?.name, "call_now")}
                >
                  Book Now
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <Modal
        open={props?.open}
        onClose={props?.handleClose}
        sx={{ border: "none", outline: "none" }}
      >
        <div className="N-daily-update-popup">
          <div className="N-daily-update-popup-header">
            <button onClick={props?.handleClose}>
              {/* <img
                src={require("../../../Assets/images/icons/backarrow.png")}
                alt="back"
              /> */}
              <KeyboardArrowLeft />
              <span>Updates</span>
            </button>
            <button onClick={props?.handleClose}>+</button>
          </div>
          {dailyUpdates?.map((item, index) => (
            <div className="N-du-main-modal-item">
              <div className="N-daily_update_salon_details">
                <img src={props?.spaData?.main_image} alt="daily update" />
                <div className="N-d-u-salon-name">
                  <h2>{props?.spaData?.name}</h2>
                  <p>Daily Updates </p>
                </div>
              </div>
              <div className="N-modal-daily_update_card">
                <div className="N-modal-daily_update_card_img">
                  <img src={item?.daily_update_img} alt="daily update" />
                </div>
                <div className="N-modal-daily_update_card_content">
                  <p>
                    {viewMore[index]
                      ? item?.daily_update_description
                      : item?.daily_update_description.length > 350
                      ? item?.daily_update_description.slice(0, 350) + "..."
                      : item?.daily_update_description}
                  </p>
                  <span>
                    {item?.daily_update_description.length > 350 ? (
                      <button
                        onClick={() => {
                          setViewMore({
                            [index]: !viewMore[index],
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
                        {viewMore[index] ? "View Less" : "View More"}
                      </button>
                    ) : (
                      <></>
                    )}
                  </span>
                </div>
                <p className="N-modal-time-ago-daily-update">
                  {format(item?.created_at)}
                </p>
                <a
                  href={`tel:${props?.spaData?.mobile_number}`}
                  onClick={() => log_adder(props?.spaData?.name, "call_now")}
                  className="N-modal-daily-update-book-now"
                >
                  Call Now
                </a>
              </div>
            </div>
          ))}

          {isMoreData && (
            <div
              className="N-view-more-button-container"
              style={{
                width: "max-content",
                margin: "auto",
                padding: "3px 10px",
                cursor: "pointer",
              }}
            >
              <button
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                View More
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DailyUpdates;
