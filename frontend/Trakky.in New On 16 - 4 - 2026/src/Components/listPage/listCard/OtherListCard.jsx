import React, { useState, useEffect, useRef, useContext } from "react";
import "./otherlistcard.css";
import ScoreSvg from "../../../Assets/images/icons/score_svg.svg";
import { Link } from "react-router-dom";
import FavoriteSvg from "../../../Assets/images/icons/heart_2.svg";
import AuthContext from "../../../context/Auth";
import { FcLike } from "react-icons/fc";

const OtherListCard = ({ data }) => {
  const { userFavorites, location, user } = useContext(AuthContext);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const imageRef = useRef(null);

  const navigationLink = `/${encodeURIComponent(
    data?.city?.toLowerCase()
  )}/${encodeURIComponent(data?.area?.toLowerCase())}/salons/${data?.slug}`;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      });
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  const createLog = (salonName, urlSlug, service = "None") => {
    const reqBody = {
      name: salonName,
      category: "salon",
      urlSlug: urlSlug,
      service: service,
      location,
    };

    if (user != null) {
      reqBody.salon_user = user?.user_id || null;
    }

    fetch("https://backendapi.trakky.in/salons/log-entry/", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleBookNowBtn = () => {
    if (!data?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      data?.name
    )}%2C%20${encodeURIComponent(data?.area)}%2C%20${encodeURIComponent(
      data?.city
    )}%3F`;

    window.open(link, "_blank");
  };

  return (
    <div
      ref={imageRef}
      className={`OL-lc-main-container ${
        isIntersecting ? "OL-image-animation" : ""
      }`}
    >
      <Link to={navigationLink}>
        <div className="OL-lc-image-container">
          <div className="OL-lc-image">
            {data?.main_image && (
              <img src={data?.main_image} alt="List of salons" />
            )}
          </div>
          {data?.premium && (
            <div className="premium_div-x absolute !left-3 !top-3 !rounded-md">
              <div className="premium-text">Premium</div>
            </div>
          )}
          {!userFavorites.some((fav) => fav.salon === data?.id) ? (
            <div className="OL-lc-image-like">
              <img src={FavoriteSvg} alt="Add to favorites" />
            </div>
          ) : (
            <div className="OL-lc-image-like !right-[10px]">
              <FcLike style={{ height: "100%", width: "100%" }} />
            </div>
          )}
          {data?.offer_tag && (
            <div className="OL-lc-image-offer-tag">{data?.offer_tag}</div>
          )}
          {/* <div className="absolute bottom-0 left-0 h-1/3 bg-gradient-to-t from-[#1c1c1c] to-transparent w-full z-[1]"></div> */}
        </div>
      </Link>
      <div className="OL-lc-info-container">
        <div className="OL-lc-info-slice-outer">
          <Link to={navigationLink}>
            <div className="OL-lc-info-slices">
              <div className="OL-lc-basic-info-panel">
                <div className="OL-lc-basic-info-name-addr">
                  <div className="OL-lc-basic-info-name">{data?.name}</div>
                  <div className="OL-lc-basic-info-addr">
                    {data?.area + ", " + data?.city}
                  </div>
                </div>
                <div className="OL-lc-basic-info-rating-onward">
                  <div className="OL-lc-basic-info-rating">
                    <div className="OL-lc-basic-info-rating-stars">
                      <img src={ScoreSvg} alt="Customer rating score" />
                    </div>
                    <div className="OL-lc-basic-info-rating-num">
                      {data?.avg_score
                        ? String(data?.avg_score).slice(0, 3)
                        : "0"}
                    </div>
                  </div>

                  {data?.price && (
                    <div className="OL-lc-offer-price-section">
                      {"₹ " + data?.price + " Onwards"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
          <div className="OL-lc-book-now-btn">
            <button
              onClick={() => {
                handleBookNowBtn();
              }}
            >
              Book Now
            </button>
            <button>
              <a
                href={`tel:${data?.mobile_number}`}
                onClick={() => createLog(data?.name, data?.slug)}
              >
                Call Now
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherListCard;
