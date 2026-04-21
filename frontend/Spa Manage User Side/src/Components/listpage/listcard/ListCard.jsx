import React, { useState, useEffect, useRef } from "react";
import "./listcard.css";
import { Link } from "react-router-dom";

const ListCard = ({ data }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imageRef = useRef(null);

  const navigationLink = `/${data?.city
    ?.toLowerCase()
    .replaceAll(" ", "-")}/${data?.area
    ?.toLowerCase()
    .replaceAll(" ", "-")}/spas/${data?.slug}`;

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

  const createLog = (spaName, urlSlug, service = "None") => {
    fetch("https://backendapi.trakky.in/spas/log-entry/", {
      method: "POST",
      body: JSON.stringify({
        spaName: spaName,
        urlSlug: urlSlug,
        service: service,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response data
      })
      .catch((err) => {
        // Handle the error
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
    <div
      ref={imageRef}
      className={`lc-main-container ${isIntersecting ? "image-animation" : ""}`}
    >
      <Link to={navigationLink}>
        <div className="lc-image-container">
          <div className="lc-image">
            {data?.main_image && (
              <img src={data?.main_image} alt="spa image" />
            )}
          </div>
          {data?.premium && <div className="lc-image-premium">Premium</div>}
          {/* <div className="lc-image-like"></div> */}
          {data?.offer_tag && (
            <div className="lc-image-offer-tag">{data?.offer_tag}</div>
          )}
        </div>
      </Link>
      <div className="lc-info-container">
        <Link to={navigationLink}>
          <div className="lc-info-slices">
            <div className="lc-basic-info-panel">
              <div className="lc-basic-info-name-addr">
                <div className="lc-basic-info-name">{data?.name}</div>
                <div className="lc-basic-info-addr">
                  {data?.area + ", " + data?.city}
                </div>
              </div>
              <div className="lc-basic-info-rating">
                <div className="lc-basic-info-rating-stars">&#9733;</div>
                <div className="lc-basic-info-rating-num">
                  { data?.avg_rating ? String(data?.avg_rating).slice(0, 3) : '0'}
                </div>
              </div>
            </div>
            <div className="lc-facilities-panel">
              <div className="lc-facilities-section">
                {data?.facilities &&
                  data?.facilities.map((item, index) => {
                    var iconNumber;
                    if (item === "Washroom") {
                      iconNumber = 6;
                    } else if (item === "Parking") {
                      iconNumber = 7;
                    } else if (item === "Sanitization") {
                      iconNumber = 8;
                    } else if (item === "Air conditioning") {
                      iconNumber = 9;
                    } else if (item === "Music") {
                      iconNumber = 10;
                    } else {
                      iconNumber = null;
                    }

                    return (
                      iconNumber && (
                        <div key={index} className="lc-facilities-icon-box">
                          <img
                            src={require(`../../../Assets/images/icons/${iconNumber}.png`)}
                            alt="facility icon"
                          />
                        </div>
                      )
                    );
                  })}
              </div>
              {data?.price && (
                <div className="lc-offer-price-section">
                  {"₹ " + data?.price + " Onwards"}
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="lc-book-now-btn">
          <button
            onClick={() => {
              handleBookNowBtn();
            }}
          >
            Book Now
          </button>
          <button>
            <a
              href={`tel:+${data?.mobile_number}`}
              onClick={() => createLog(data?.name, data?.slug)}
            >
              Call Now
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
