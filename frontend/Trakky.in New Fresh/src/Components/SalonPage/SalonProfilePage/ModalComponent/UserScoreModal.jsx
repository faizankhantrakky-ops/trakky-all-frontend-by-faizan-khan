import React, { useEffect, useState } from "react";
import Score_svg from "./../../../../Assets/images/icons/score_svg.svg";
import AuthContext from "./../../../../context/Auth";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import Avatar from "@mui/material/Avatar";
import toast, { Toaster } from "react-hot-toast";

const UserScoreModal = ({
  handleClose,
  scoreData,
  getScoreData,
  openSignIn,
  salonData,
  openUserNameChangeModal,
  activeScoreS,
}) => {
  const { user, authTokens, userData } = React.useContext(AuthContext);

  const [activeSocre, setActiveScore] = useState(5);

  const swiperRef = React.useRef(null);

  const handleUserScore = async (e) => {
    let url = `https://backendapi.trakky.in/salons/score/`;

    if (!authTokens?.access_token || !user?.user_id) {
      openSignIn();
      return;
    }

    if (user?.user_id && userData) {
      if (!userData?.name) {
        openUserNameChangeModal();
        activeScoreS(activeSocre);
        return;
      }
    }

    let Scoredata = {
      salon: salonData?.id,
      score: activeSocre,
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

      let data = await res.json();

      if (res.status === 201) {
        toast.success("Score Submitted Successfully", {
          duration: 2000,
        });
      }
      getScoreData();
    } catch (err) {
      console.log(err);
    }
  };

  const setMiddleScore = () => {
    const swiper = swiperRef.current.swiper;
    setActiveScore(swiper.activeIndex + 1);
    swiperRef.current.swiper.slideTo(swiper.activeIndex, 0);
  };

  useEffect(() => {
    swiperRef.current.swiper.slideTo(activeSocre - 1, 0);
  }, [activeSocre]);

  const calculateScore = (scoreData) => {
    let totalScore = 0;
    scoreData?.map((item) => {
      totalScore += item.score;
    });

    if (scoreData.length === 0) {
      return 0;
    }

    return parseFloat(totalScore / scoreData.length).toFixed(1) || 0;
  };

  return (
    <>
      <Toaster />
      <div className="ND-score-container-modal-div relative">
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "#00000020",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          X
        </button>
        <div className="ND-score-container">
          <div className="ND-score-count-total">
            <span>{calculateScore(scoreData)}/10 Score </span>{" "}
            <span>{scoreData?.length || 0} user Scored</span>
          </div>
          <div className="ND-score-give-sec">
            <div className="ND-user-score-giving">
              <Swiper
                slidesPerView={5}
                spaceBetween={30}
                centeredSlides={true}
                // modules={[Pagination]}
                className="Score-swiper-container"
                ref={swiperRef}
                onSlideChange={setMiddleScore}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`score-swiper-c-item 
                    ${activeSocre === item ? "active" : ""}
                    `}
                      onClick={() => setActiveScore(item)}
                      score-value={item}
                    >
                      {item}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              className="ND-score-sub-btn"
              onClick={() => {
                handleUserScore();
              }}
            >
              Submit
            </button>
          </div>
          <div className="ND-user-score-list ND-u-s-l-m">
            {scoreData?.map((item, index) => (
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
                    <img src={Score_svg} alt="" />
                    <span>{item?.score}/10 Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserScoreModal;
