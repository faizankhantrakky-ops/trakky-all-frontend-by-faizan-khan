import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Cards.css";
import AuthContext from "../../../context/Auth";
// import cardIcons from "../../../Assets/images/icons/card_icons.png";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { capitalize } from "@mui/material";

const SalonCard = (props) => {
  const { user } = useContext(AuthContext);
  const { location } = React.useContext(AuthContext);

  const log_adder = async () => {
    const requestBody = {
      category: "salon",
      name: props.cardData.name,
      location,
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

  const getLink = () => {
    if (props.cardData.city && props.cardData.area && props.cardData.slug) {
      return `/${encodeURIComponent(
        props.cardData.city.toLowerCase()
      )}/${encodeURIComponent(props.cardData.area.toLowerCase())}/salons/${
        props.cardData.slug
      }`;
    } else if (props.cardData.city && props.cardData.slug) {
      return `/${encodeURIComponent(
        props.cardData.city.toLowerCase()
      )}/salons/${props.cardData.slug}`;
    } else {
      return `/salons/${props.cardData.slug}`;
    }
  };

  return (
    <div className="card">
      <Link to={getLink()}>
        <div className="card-image">
          {props.cardData.premium && (
            <div className="premium_div">
              <p className="premium-text "> Premium</p>
            </div>
          )}
          <img src={props.cardData.main_image} alt="salon" />
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
                      className="salon_facility_icon"
                      style={{ height: "2rem", paddingInline: "5px" }}
                    >
                      <img
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                        src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                        alt=""
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
          <h3>{props.cardData.name}</h3>
          <p>
            {props.cardData.area},&nbsp;{props.cardData.city}
          </p>
        </Link>
      </div>

      <div className="information__container_lower">
        <div>
          <p id="price-tag">
            <span> &#8377;{props.cardData.price}</span> / Person
          </p>
        </div>

        <div>
          <a
            href={`tel:${props.cardData.mobile_number}`}
            className="card-btn-link"
            onClick={() => {
              log_adder();
              // createLog(props.cardData.name, props.cardData.slug, "null");
            }}
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
};

export const OfferCard = (props) => {
  return (
    <div className="offer-card">
      {props.cardData?.salon.length > 1 ? (
        <Link
          to={`/${encodeURIComponent(
            props.cardData.city.toLowerCase()
          )}/offers/${props.cardData.slug}`}
        >
          <img src={props.cardData.img_url} draggable="false" alt="offers" />
        </Link>
      ) : (
        <Link
          to={`/${props.cardData.city}/${props.cardData.area}/salons/${
            props.cardData?.salon_slugs[props.cardData.salon[0]]
          }/`}
        >
          <img src={props.cardData.img_url} draggable="false" alt="offers" />
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

export const NationalCategoryCard = (props) => {
  return (
    <div className="national-category-card">
      <Link to={`/categories/${props.cardData.slug}`}>
        <img src={props.cardData.image} draggable="false" alt="category" />
        <p>{props.cardData.title}</p>
      </Link>
    </div>
  );
};

export const CategoryCard = (props) => {
  return (
    <div className="national-category-card">
      <Link
        to={`/${encodeURIComponent(
          props.cardData?.city.toLowerCase()
        )}/categories/${props.cardData.slug}`}
      >
        <img
          src={props.cardData.category_image}
          draggable="false"
          alt="category"
        />
        <p>{props.cardData.category_name}</p>
      </Link>
    </div>
  );
};

export const SalonProfile = (props) => {
  return (
    <div
      className={`salon-profile-card ${
        props.isprofile == true ? "salon-profile-card-bw" : ""
      }`}
    >
      <img
        className={`salon-profile-card-img ${
          props.isprofile == true ? "salon-profile-card-img-bw" : ""
        } `}
        src={props.cardData}
        draggable={false}
        alt="salon"
      />
    </div>
  );
};

export const SalonRoom = (props) => {
  return (
    <div className="salon_category_room">
      <img
        src={require(`../../../Assets/images/salon/${props.cardData.photo}`)}
        alt=""
      />
      <p>{props.cardData.roomname}</p>
    </div>
  );
};

export default SalonCard;

export const ImageCard = (props) => {
  return (
    <div className="slider_image_card">
      <img
        src={require(`../../../Assets/images/salon/${props.cardData}`)}
        alt=""
      />
    </div>
  );
};

export const ReviewCard = (props) => {
  // Function to limit text length and add ellipsis
  const limitText = (text, maxLength) => {
    if (text === null || text === undefined || text == "") return "No Review";

    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const fullReview = props.cardData.review;
  const limitedReview = limitText(props.cardData.review, 70); // Limiting review text to 50 characters

  return (
    props?.cardData?.salon_slug && (
      <Link
        to={`/${encodeURIComponent(
          props?.cardData?.salon_city.toLowerCase()
        )}/${encodeURIComponent(
          props?.cardData?.salon_area.toLowerCase()
        )}/salons/${props?.cardData?.salon_slug}`}
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
        <p className="salon-info">Review For {props.cardData.salon_name}</p>
      </Link>
    )
  );
};
