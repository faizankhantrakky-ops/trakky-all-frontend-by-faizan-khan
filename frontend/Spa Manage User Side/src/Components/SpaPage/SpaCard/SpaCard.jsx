import React, { useState } from "react";

import "./SpaCard.css";
import { Link } from "react-router-dom";
import CardIcons from "../../../Assets/images/icons/card_icons.png";
import LikeIcon from "../../../Assets/images/icons/like.svg";
import ManIcon from "../../../Assets/images/icons/man.svg";
// import { FaStar, FaStarHalfAlt } from "react-icons/fa";
// import { AiOutlineStar } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import { FcLike } from "react-icons/fc";
// SpaCard will appear when screen is large
const SpaCard = ({
  img,
  name,
  // offers,
  address,
  landmark,
  bookingNumber,
  mobileNumber,
  city,
  area,
  openTime,
  closeTime,
  premium,
  slug,
  facilities,
  offer_tag,
  price,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  // creating logs
  // const createLog = (spaName, urlSlug, service="None") => {
  //   fetch("https://backendapi.trakky.in/api/v1/logs", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       spaName: spaName,
  //       urlSlug: urlSlug,
  //       service: service,
  //     }),
  //   })
  //   .then((res) => res)
  //   .catch(err => console.log(err))
  // };

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

  return (
    <div className="spa_card">
      <div className="image__container">
        {premium && <p className="spa_tag">Premium</p>}
        {offer_tag && (
          <>
            <img src={img} alt="Spa" draggable="false" />
            <p className="spa_offer_tag">{offer_tag}</p>
          </>
        )}
      </div>

      <div className="spa_information__container">
        <div className="row1">
          <div className="spa_name">
            <h2>
              <Link to={`/${city.toLowerCase().replaceAll(' ','-')}/${area.toLowerCase().replaceAll(' ','-')}/spas/${slug}`}>{name}</Link>
            </h2>
            {/* <p>{location}</p> */}

            <p>
              {/* {address}  */}
              {/* {landmark} <br /> */}
              {area} , {city}
            </p>
          </div>
          <div className="spa_offer_tag__box">
            {isLiked ? (
              <FcLike
                onClick={() => setIsLiked(false)}
                style={{ width: "2rem", height: "2rem" }}
              />
            ) : (
              <BiHeart
                onClick={() => setIsLiked(true)}
                style={{ width: "2rem", height: "2rem" }}
              />
            )}
          </div>
        </div>

        <div className="row2">
          <div className="spa_icon__box">
            {/* <img src={CardIcons} draggable="false" alt="" /> */}
            <ul style={{ display: "flex", alignItems: "center" }}>
              {facilities &&
                facilities.map((data, index) => {
                  var iconNumber;
                  if (data === "Washroom") {
                    iconNumber = 6;
                  } else if (data === "Parking") {
                    iconNumber = 7;
                  } else if (data === "Sanitization") {
                    iconNumber = 8;
                  } else if (data === "Air conditioning") {
                    iconNumber = 9;
                  } else if (data === "Music") {
                    iconNumber = 10;
                  } else {
                    iconNumber = null;
                  }

                  return (
                    iconNumber && (
                      <li key={index}>
                        <div
                          // TODO className="spa_facility_icon"
                          style={{ height: "3rem" , paddingBlock:"5px" }}
                        >
                          <img
                            src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                            alt="facility icon"
                          />
                        </div>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>
          <div className="spa_price_tag">
            <img src={ManIcon} alt="price" draggable="false" />
            <p>
              &nbsp;₹ <span id="spa-price">{price}</span> Onwards
            </p>
          </div>
        </div>
        <div className="row3">
          <div className="spa_rating__box">
            {/* <Star stars={ratings} reviews={reviewsCount} /> */}
            <p className="time_tag">
              {openTime ? (
                <>
                  {openTime.slice(0, 5)}&nbsp;-&nbsp;{closeTime.slice(0, 5)}
                </>
              ) : (
                <></>
              )}
            </p>
          </div>
          <div className="spa_booking_buttons">
            <a href={`https://wa.me/+91${bookingNumber}`}>Book Now</a>
            <a
              href={`tel:+${mobileNumber}`}
              onClick={() => createLog(name, slug)}
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const Star = ({ stars, reviews }) => {
//   const ratingStar = Array.from({ length: 5 }, (_, index) => {
//     let number = index + 0.5;

//     return (
//       <span key={index}>
//         {stars >= index + 1 ? (
//           <FaStar className="icon" />
//         ) : stars >= number ? (
//           <FaStarHalfAlt className="icon" />
//         ) : (
//           <AiOutlineStar className="icon" />
//         )}
//       </span>
//     );
//   });

//   return (
//     <div>
//       <span>{stars}</span>&nbsp;{ratingStar}
//       <div
//         style={{
//           display: "inline-block",
//         }}
//       >
//         &nbsp;({reviews}&nbsp;reviews)
//       </div>
//     </div>
//   );
// };

// SpaCardMini will appear when screen is of mobile size
export const SpaCardMini = ({
  img,
  name,
  address,
  landmark,
  bookingNumber,
  mobileNumber,
  city,
  area,
  openTime,
  closeTime,
  premium,
  slug,
  facilities,
  offer_tag,
  price,
  // location,
  // ratings,
  // reviewsCount,
}) => {
  // creating logs
  const createLog = (spaName, urlSlug, service = "None") => {
    fetch("https://backendapi.trakky.in/spas/log-entry/", {
      method: "POST",
      body: JSON.stringify({
        spaName: spaName,
        urlSlug: urlSlug,
        service: service,
      }),
    })
      .then((res) => res)
      .catch((err) => console.log(err));
  };
  return (
    <div className="mini_spa_card">
      <div className="main_mini_spa__container">
        <div className="mini_spa_image__container">
          {premium && <p className="spa_tag">Premium</p>}
          {offer_tag && (
            <>
              <img src={img} alt="Spa" draggable="false" />
              <p
                className="spa_offer_tag"
                style={{
                  width: "98%",
                  // bottom: "1%",
                  margin: "0 1%",
                }}
              >
                {offer_tag}
              </p>
            </>
          )}
        </div>

        <div className="mini_spa_information__container">
          <div className="spa_name">
            <Link to={`/${city.toLowerCase().replaceAll(' ','-')}/${area.toLowerCase().replaceAll(' ','-')}/spas/${slug}`}>
              <h2>{name}</h2>
              {/* <p>{location}</p> */}
              {/* <p>{address}</p> */}
              {/* <p>{landmark}</p> */}
              <p>
                {area}, {city}
              </p>
            </Link>
          </div>

          <div className="spa_icon__box">
            {/* <img src={CardIcons} draggable="false" alt="" /> */}
            <ul style={{ display: "flex", alignItems: "center" }}>
              {facilities &&
                facilities.map((data, index) => {
                  var iconNumber;
                  if (data === "Washroom") {
                    iconNumber =6;
                  } else if (data === "Parking") {
                    iconNumber = 7;
                  } else if (data === "Sanitization") {
                    iconNumber = 8;
                  } else if (data === "Air conditioning") {
                    iconNumber = 9;
                  } else if (data === "Music") {
                    iconNumber = 10;
                  } else {
                    iconNumber = null;
                  }

                  return (
                    iconNumber && (
                      <li key={index}>
                        <div
                          className="spa_facility_icon"
                          style={{ height: "3rem"  , padding:"5px"}}
                        >
                          <img
                            src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                            alt="facility icon"
                          />
                        </div>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>

          <div className="mini_spa_rating__box spa_rating__box">
            {/* <Star stars={ratings} reviews={reviewsCount} /> */}
          </div>
          <div className="mini_spa_price__box">
            <div className="mini_spa_price_tag">
              <img src={ManIcon} alt="men" draggable="false" />
              <p>
                &nbsp;₹ <span id="spa-price">{price}</span> Onwards
              </p>
              {openTime ? (
                <p className="time_tag">
                  {openTime.slice(0, 5)}&nbsp;-&nbsp;{closeTime.slice(0, 5)}
                </p>
              ) : (
                <></>
              )}
            </div>

            <div className="spa_like__box">
              {/* <img src={LikeIcon} alt="" /> */}
            </div>
          </div>
        </div>
      </div>

      <div className="mini_spa_buttons">
        <div style={{ borderRight: "1px solid gray" }}>
          <a href={`https://wa.me/+91${bookingNumber}`}>Book Now</a>
        </div>
        <div>
          <a href={`tel:${mobileNumber}`} onClick={() => createLog(name, slug)}>
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpaCard;
