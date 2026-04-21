import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cards.css";
import "../../../index.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import Skeleton from '@mui/material/Skeleton';

import {
  TherapySkeleton,
  OfferSkeleton,
} from "../../Common/cardSkeleton/CardSkeleton";
// import cardIcons from "../../../Assets/images/icons/card_icons.png";
import AuthContext from "../../../context/Auth";
const SpaCard = (props) => {
  const { user } = React.useContext(AuthContext);
  const [skeleton, setSkeleton] = useState(true);
  const { location } = React.useContext(AuthContext);
  const log_adder = async () => {
    const requestBody = {
      category: "spa",
      name: props.cardData.name,
      location,
    };

    if (user != null) {
      requestBody.spa_user = user?.user_id || null;
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

  const getLink = () => {
    if (props.cardData.city && props.cardData.area && props.cardData.slug) {
      return `/${props.cardData.city
        .toLowerCase()
        .replaceAll(" ", "-")}/${props.cardData.area
        .toLowerCase()
        .replaceAll(" ", "-")}/spas/${props.cardData.slug}`;
    } else if (props.cardData.city && props.cardData.slug) {
      return `/${props.cardData.city.toLowerCase().replaceAll(" ", "-")}/spas/${
        props.cardData.slug
      }`;
    } else {
      return `/spas/${props.cardData.slug}`;
    }
  };

  return (
    <div className="card">
      <Link to={getLink()}>
        <div className="transition-all duration-200 card-image ">
          {props.cardData.premium && (
            <div className="premium_div">
              <p className="premium-text "> Premium</p>
            </div>
          )}
          <div className="absolute top-0 left-0 w-[100%] h-[100%] flex justify-center items-center  ">
            {/* {skeleton && (
              <Skeleton
                borderRadius={"1rem"}
                variant="rectangle"
                className=" w-[190px] h-[160px] "
              />
            )} */}
          </div>
          <img src={props.cardData.main_image} alt="spa" />
          {props.cardData.offer_tag ? (
            <div className="discount_tag">
              <p>{props.cardData.offer_tag}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Link>

      <div className="card_icons">
        <ul
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.cardData.facilities &&
            props.cardData.facilities.map((data, index) => {
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
                      className="spa_facility_icon"
                      style={{ height: "2rem", paddingInline: "5px" }}
                    >
                      <img
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                        src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                        alt="facility icon"
                      />
                    </div>
                  </li>
                )
              );
            })}
        </ul>{" "}
      </div>

      <div className="information__container">
        <Link to={getLink()}>
          <h3>
            {
              props.cardData.name
              //  || (
              //   <Skeleton
              //     variant="text"
              //     width={190}
              //     sx={{ fontSize: "2rem", borderRadius: ".5rem" }}
              //   />
              // )
            }
          </h3>
          <p>
            {
              props.cardData.area
              // || (
              //   <Skeleton
              //     variant="text"
              //     width={210}
              //     sx={{ fontSize: "1.5rem", borderRadius: ".5rem" }}
              //   />
              // )
            }
            ,&nbsp;{props.cardData.city}
          </p>
        </Link>
      </div>

      <div className="information__container_lower">
        <div>
          <p
            // style={{ display: skeleton ? "none" : "block" }}
            id="price-tag"
          >
            <span>&#8377;{props.cardData.price}</span> / Person
          </p>
          {/* {skeleton && (
            <Skeleton
              variant="rectangular"
              borderRadius={".8rem"}
              width={110}
              height={48}
            />
          )} */}
        </div>

        <div className="">
          <a
            // style={{ display: skeleton ? "none" : "block" }}
            href={`tel:${props.cardData.mobile_number}`}
            className=" card-btn-link"
            onClick={() => {
              log_adder();
              // createLog(props.cardData.name, props.cardData.slug, "null");
            }}
          >
            Call Now
          </a>
          {/* {skeleton && (
            <Skeleton
              variant="rounded"
              sx={{}}
              borderRadius={"3rem"}
              width={90}
              height={50}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export const OfferCard = (props) => {
  const getLink = () => {
    if (props.cardData.city && props.cardData.slug) {
      return `/${props.cardData.city
        .toLowerCase()
        .replaceAll(" ", "-")}/offers/${props.cardData.slug}`;
    } else {
      return `/offers/${props.cardData.slug}`;
    }
  };

  return (
    <div className="offer-card ">
      {props.cardData?.spa?.length > 1 ? (
        <Link to={getLink()}>
          {<img src={props.cardData.img_url} draggable="false" alt="offers" />}
        </Link>
      ) : (
        <Link
          to={`/${props.cardData?.city}/${props.cardData?.area}/spas/${
            props.cardData?.spa_slugs[props.cardData.spa?.[0]]
          }/`}
        >
          {<img src={props.cardData.img_url} draggable="false" alt="offers" />}
        </Link>
      )}
    </div>
  );
};

export const NationalOfferCard = (props) => {
  return (
    <div
      className="offer-card national-offer-card"
      style={{
        aspectRatio: "9/11",
        position: "relative",
      }}
    >
      <img
        src={props.cardData.image}
        draggable="false"
        alt="offers"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    </div>
  );
};

export const TherapyCard = (props) => {
  const getLink = () => {
    if (props.cardData.city && props.cardData.slug) {
      return `/${props.cardData.city
        .toLowerCase()
        .replaceAll(" ", "-")}/therapies/${props.cardData.slug}`;
    } else {
      return `/therapies/${props.cardData.slug}`;
    }
  };

  return (
    <div className="national-therapy-card">
      <Link to={getLink()}>
        <div className="absolute top-0 left-0 w-[100%] z-50 h-[100%] "></div>
        <img src={props.cardData.image_url} draggable="false" alt="therapy" />
        <p>{props.cardData.name}</p>
      </Link>
    </div>
  );
};

export const NationalTherapyCard = (props) => {
  return (
    <div className="national-therapy-card">
      <Link to={""}>
        <div className="absolute top-0 left-0 w-[100%] z-50 h-[100%] "></div>
        <img src={props.cardData.image} draggable="false" alt="therapy" />
        <p>{props.cardData.title}</p>
      </Link>
    </div>
  );
};

export const SpaProfile = (props) => {
  // const [skeleton, setSkeleton] = useState(true);
  return (
    <div
      className={`spa-profile-card ${
        props.isprofile == true ? "spa-profile-card-bw" : ""
      }`}
    >
      {/* {skeleton && (
        <Skeleton
          borderRadius={"1rem"}
          variant="rounded"
          className="spa-profile-card-img"
        />
      )} */}
      <img
        className={`spa-profile-card-img ${
          props.isprofile == true ? "spa-profile-card-img-bw" : ""
        } `}
        src={props.cardData}
        draggable={false}
        // style={{ display: skeleton ? "none" : "block" }}
        // onLoad={() => {
        //   setSkeleton(false);
        // }}
        alt="spa"
      />
    </div>
  );
};

export const SpaRoom = (props) => {
  return (
    <div className="spa_therapy_room">
      <img
        src={require(`../../../Assets/images/spa/${props.cardData.photo}`)}
        alt="spa room"
      />
      <p>{props.cardData.roomname}</p>
    </div>
  );
};

export default SpaCard;

export const ImageCard = (props) => {
  return (
    <div className="slider_image_card">
      <img
        src={require(`../../../Assets/images/spa/${props.cardData}`)}
        alt=""
      />
    </div>
  );
};

export const ReviewCard = (props) => {
  // Function to limit text length and add ellipsis

  const limitText = (text, maxLength) => {
    if (text === null || text === undefined || text == "") return "No Review";

    if (text?.length <= maxLength) {
      return text;
    }
    return text?.substring(0, maxLength) + "...";
  };

  const fullReview = props.cardData.review;
  const limitedReview = limitText(props.cardData?.review, 70); // Limiting review text to 50 characters

  return (
    props.cardData?.spa_slug && (
      <Link
        to={`/${props?.cardData?.spa_city
          .toLowerCase()
          .split(" ")
          .join("-")}/${props?.cardData?.spa_area
          .toLowerCase()
          .split(" ")
          .join("-")}/spas/${props?.cardData?.spa_slug}`}
        className="reviewCard"
      >
        <div className="rating-section">
          <Rating
            sx={{
              "& .MuiRating-iconFilled": {
                color: "black",
              },
            }}
            emptyIcon={
              <StarBorderIcon sx={{ color: "black", borderColor: "black" }} />
            }
            name="read-only"
            value={props.cardData.rating}
            readOnly
          />
          <span className="rating-text">{props.cardData.rating} rating</span>
        </div>
        <p className="review-text" title={fullReview}>
          {limitedReview}
        </p>
        <div className="text-wrapper-2">{props.cardData.username}</div>
        <p className="spa-info">Review For {props.cardData.spa_name}</p>
      </Link>
    )
  );
};
