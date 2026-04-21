import React, { useState, useEffect, useRef, useContext } from "react";
import RatingSvg from "../../Assets/images/icons/new_star_svg.svg";
import { Link } from "react-router-dom";
import FavoriteSvg from "../../Assets/images/icons/heart_2.svg";
import AuthContext from "../../context/Auth";
import { FcLike } from "react-icons/fc";

const SpaCard = ({ data }) => {
  const { userFavorites, location, user } = useContext(AuthContext);

  const navigationLink = `/${encodeURIComponent(
    data?.city?.toLowerCase()
  )}/${encodeURIComponent(data?.area?.toLowerCase())}/spas/${data?.slug}`;

  const createLog = (spaName, urlSlug, service = "None") => {
    const reqBody = {
      name: spaName,
      category: "spa",
      urlSlug: urlSlug,
      service: service,
      location,
    };

    if (user != null) {
      reqBody.spa_user = user?.user_id || null;
    }

    fetch("https://backendapi.trakky.in/spas/log-entry/", {
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
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20spa%20services%20of%20${encodeURIComponent(
      data?.name
    )}%2C%20${encodeURIComponent(data?.area)}%2C%20${encodeURIComponent(
      data?.city
    )}%3F`;

    window.open(link, "_blank");
  };

  return (
    <div className={`SP-lc-main-container`}>
      <Link to={navigationLink}>
        <div className="SP-lc-image-container select-none">
          <div className="SP-lc-image">
            {data?.main_image && <img src={data?.main_image} alt="spa image" />}
          </div>
          {data?.premium && (
            <div className="premium_div-x absolute !left-3 !top-3 !rounded-md">
              <div className="premium-text">Premium</div>
            </div>
          )}
          {!userFavorites.some((fav) => fav.spa === data?.id) ? (
            <div className="SP-lc-image-like">
              <img src={FavoriteSvg} alt="favorite" />
            </div>
          ) : (
            <div className="SP-lc-image-like !right-[10px]">
              <FcLike style={{ height: "100%", width: "100%" }} />
            </div>
          )}
          {data?.offer_tag && (
            <div className="SP-lc-image-offer-tag">{data?.offer_tag}</div>
          )}
          <div className="absolute bottom-0 left-0 h-1/3 bg-gradient-to-t from-[#1c1c1c] to-transparent w-full z-[1]"></div>
        </div>
      </Link>
      <div className="SP-lc-info-container">
        <div className="SP-lc-info-slice-outer">
          <Link to={navigationLink}>
            <div className="SP-lc-info-slices">
              <div className="SP-lc-basic-info-panel">
                <div className="SP-lc-basic-info-name-addr">
                  <h2 className="SP-lc-basic-info-name">{data?.name}</h2>
                  <div className="SP-lc-basic-info-addr">
                    {data?.area + ", " + data?.city}
                  </div>
                </div>
                <div className="SP-lc-basic-info-rating-onward">
                  <div className="SP-lc-basic-info-rating">
                    <div className="SP-lc-basic-info-rating-stars">
                      <img src={RatingSvg} alt="rating" height={20}/>
                    </div>
                    <div className="SP-lc-basic-info-rating-num">
                      {data?.avg_review
                        ? String(data?.avg_review).slice(0, 2)
                        : "0"}
                    </div>
                  </div>

                  {data?.price && (
                    <div className="SP-lc-offer-price-section">
                      {"₹ " + data?.price + " Onwards"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
          <div className="SP-lc-book-now-btn">
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

export default SpaCard;
