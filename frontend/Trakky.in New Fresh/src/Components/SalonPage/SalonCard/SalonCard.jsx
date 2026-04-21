import React, { useState, useEffect, useContext } from "react";

import "./SalonCard.css";
import { Link } from "react-router-dom";
import CardIcons from "../../../Assets/images/icons/card_icons.png";
import LikeIcon from "../../../Assets/images/icons/like.svg";
import ManIcon from "../../../Assets/images/icons/man.svg";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
// import { AiOutlineStar } from "react-icons/ai";
import { BiHeart } from "react-icons/bi";
import { FcLike } from "react-icons/fc";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import AuthContext from "../../../context/Auth";

import SigninForms from "../../Common/Header/signupsigninforms/SigninForms";

// SalonCard will appear when screen is large
const SalonCard = ({
  id,
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
  const { user, authTokens, location } = useContext(AuthContext);

  // creating logs
  // const createLog = (salonName, urlSlug, service="None") => {
  //   fetch("https://backendapi.trakky.in/api/v1/logs", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       salonName: salonName,
  //       urlSlug: urlSlug,
  //       service: service,
  //     }),
  //   })
  //   .then((res) => res)
  //   .catch(err => console.log(err))
  // };

  const createLog = (salonName, urlSlug, service = "None") => {
    fetch("https://backendapi.trakky.in/salons/log-entry", {
      method: "POST",
      body: JSON.stringify({
        salonName: salonName,
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
        return data;
      })
      .catch((err) => {
        // Handle the error
        console.error(err);
      });
  };
  const signInFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleSignInOpen = () => {
    setOpen(true);
  };
  const handleSignInClose = () => setOpen(false);

  const handlelike = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          salon: id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(false);
      });
  };

  const getliked = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        data.map((item) => {
          if (item.salon == id) {
            setIsLiked(true);
            setLikeId(item.id);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(false);
      });
  };

  useEffect(() => {
    if (authTokens) {
      getliked();
    }
  }, [id, isLiked, authTokens]);

  const handledislike = async (e) => {
    // e.preventDefault();

    if (!likeId) {
      return;
    }

    const response = await fetch(
      `https://backendapi.trakky.in/salons/userfavorite/${likeId}/`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        setIsLiked(true);
      });

    setIsLiked(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={signInFormStyle}>
          <SigninForms fun={handleSignInClose} />
        </Box>
      </Modal>

      <div className="salon_card">
        <div className="image__container">
          {premium && <p className="salon_tag">Premium</p>}
          {offer_tag && (
            <>
              <Link
                to={`/${encodeURIComponent(
                  city?.toLowerCase()
                )}/${encodeURIComponent(area?.toLowerCase())}/salons/${slug}`}
              >
                <Link
                  to={`/${encodeURIComponent(
                    city?.toLowerCase()
                  )}/${encodeURIComponent(area?.toLowerCase())}/salons/${slug}`}
                >
                  <img src={img} alt="Salon" draggable="false" />
                  <p className="salon_offer_tag">{offer_tag}</p>
                </Link>
              </Link>
            </>
          )}
        </div>

        <div className="salon_information__container">
          <div className="row1">
            <div className="salon_name">
              <h2>
                <Link
                  to={`/${encodeURIComponent(
                    city?.toLowerCase()
                  )}/${encodeURIComponent(area?.toLowerCase())}/salons/${slug}`}
                >
                  {name}
                </Link>
              </h2>
              {/* <p>{location}</p> */}

              <p>
                {/* {address}  */}
                {/* {landmark} <br /> */}
                {area} , {city}
              </p>
            </div>
            <div className="salon_offer_tag__box">
              {isLiked ? (
                <FcLike
                  onClick={() => {
                    user ? handledislike() : handleSignInOpen();
                  }}
                  style={{ width: "2rem", height: "2rem" }}
                />
              ) : (
                <BiHeart
                  onClick={() => {
                    user ? handlelike() : handleSignInOpen();
                  }}
                  style={{ width: "2rem", height: "2rem" }}
                />
              )}
            </div>
          </div>

          <div className="row2">
            <div className="salon_icon__box">
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
                            className="salon_facility_icon"
                            style={{ height: "3rem" }}
                          >
                            <img
                              src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                              alt=""
                            />
                          </div>
                        </li>
                      )
                    );
                  })}
              </ul>
            </div>
            <div className="salon_price_tag">
              <img src={ManIcon} alt="" draggable="false" />
              <p>
                &nbsp;₹ <span id="salon-price">{price}</span> Onwards
              </p>
            </div>
          </div>
          <div className="row3">
            <div className="salon_rating__box">
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
            <div className="salon_booking_buttons">
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
    </>
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

// SalonCardMini will appear when screen is of mobile size
export const SalonCardMini = ({
  id,
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
  const { user, authTokens, location } = useContext(AuthContext);

  // creating logs
  const createLog = (salonName, urlSlug, service = "None") => {
    fetch("https://backendapi.trakky.in/salons/log-entry/", {
      method: "POST",
      body: JSON.stringify({
        salonName: salonName,
        urlSlug: urlSlug,
        service: service,
      }),
    })
      .then((res) => res)
      .catch((err) => console.log(err));
  };
  const signInFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);

  const [open, setOpen] = React.useState(false);

  const handleSignInOpen = () => {
    setOpen(true);
  };
  const handleSignInClose = () => setOpen(false);

  const handlelike = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          salon: id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLiked(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(false);
      });
  };

  const getliked = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        data.map((item) => {
          if (item.salon == id) {
            setIsLiked(true);
            setLikeId(item.id);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(false);
      });
  };

  useEffect(() => {
    if (authTokens) {
      getliked();
    }
  }, [id, isLiked, authTokens]);

  const handledislike = async (e) => {
    // e.preventDefault();

    if (!likeId) {
      return;
    }

    const response = await fetch(
      `https://backendapi.trakky.in/salons/userfavorite/${likeId}/`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        setIsLiked(true);
      });

    setIsLiked(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={signInFormStyle}>
          <SigninForms fun={handleSignInClose} />
        </Box>
      </Modal>
      <div className="w-[100%] h-[170px] max-w-[360px] rounded-xl overflow-hidden mb-[20px]  bg-white flex flex-col shadow-xl  border-[2px] border-[#dfdfdf] ">
        <div className="h-[calc(170px-35px)] w-full  flex">
          <div className="w-[50%] h-full mt-1 ml-1  flex flex-col  justify-start  ">
            <Link
              to={`/${encodeURIComponent(
                city?.toLowerCase()
              )}/${encodeURIComponent(area?.toLowerCase())}/salons/${slug}`}
            >
              <div className="w-[170px] h-[120px]  rounded-xl   overflow-hidden  relative">
                <div
                  className={`${
                    premium ? "inline-block" : "hidden"
                  } shadow-xl premium_div_anim `}
                >
                  <p className="premium_text">Premium</p>
                </div>
                <img
                  src={img}
                  className="w-[100%] h-[100%] rounded-xl overflow-hidden object-cover "
                  alt="Salon"
                  draggable="false"
                />
                <div className=" absolute bottom-0 w-full h-[1.1rem] bg-[#562da6] text-white text-[.6rem]  rounded-b-xl  text-center flex justify-center items-center font-[40] ">
                  <span> {offer_tag}</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-[50%] h-full  flex flex-col justify-start  items-start text-xs font-[80] text-ellipsis overflow-hidden  mt-1 ml-2   ">
            <p className=" line-clamp-1 text-[.85rem] mt-[4px]  font-[700] ">
              {name}
            </p>
            <p className=" text-[.65rem] font-[400] h-[16px] line-clamp-1 ">
              {" "}
              {area}, {city}
            </p>
            <div className="h-[30px] w-full flex  items-start  my-[3px] ">
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
                      <div
                        key={index}
                        className="salon_facility_icon"
                        style={{ height: "h-[30px]" }}
                      >
                        <img
                          className=" object-contain w-[22px] h-[30px]  "
                          src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                          alt=""
                        />
                      </div>
                    )
                  );
                })}
            </div>
            <p className="font-[400] flex items-center mt-[6px] gap-1 justify-start   ">
              <FaStar
                style={{ width: "1rem", height: "1rem", color: "#FFC107" }}
              />
              4.5 (10 reviews)
            </p>

            <div className="flex justify-between w-full mt-[6px] items-center font-[400] ">
              {" "}
              <div className="flex items-center ">
                {" "}
                <img
                  src={ManIcon}
                  className="w-[15px] h-[15px] object-contain  "
                  alt=""
                  draggable="false"
                />{" "}
                &nbsp;₹ <span>{price}</span> Onwards
              </div>
              <div className=" mr-[14px] cursor-pointer">
                {isLiked ? (
                  <FcLike
                    onClick={() => {
                      user ? handledislike() : handleSignInOpen();
                    }}
                    style={{ width: "1.3rem", height: "1.3rem" }}
                  />
                ) : (
                  <BiHeart
                    onClick={() => {
                      user ? handlelike() : handleSignInOpen();
                    }}
                    style={{ width: "1.3rem", height: "1.3rem" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[35px] w-full flex  ">
          <a
            href={`https://wa.me/+91${bookingNumber}`}
            className="w-[50%] h-full bg-[#F8F8F8] flex justify-center font-bold  items-center  border-r-[2px] border-r-gray-300 "
          >
            <span className="w-full text-center">Book Now</span>
          </a>
          <a
            href={`tel:${mobileNumber}`}
            onClick={() => createLog(name, slug)}
            className="w-[50%] h-full bg-[#F8F8F8] flex justify-center font-bold items-center "
          >
            <span className="w-full text-center">Call Now</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default SalonCard;
