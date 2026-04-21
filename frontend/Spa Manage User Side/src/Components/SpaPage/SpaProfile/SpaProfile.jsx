import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./SpaProfile.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// import Star from "./../../../Assets/images/icons/star.svg";
import Phone from "./../../../Assets/images/icons/phone.svg";
import Man from "./../../../Assets/images/icons/man.svg";
import Grids from "./../../../Assets/images/icons/four-grids.svg";

import reviewdiv from "../../Common/Reviews/Reviews.jsx";
import Hero from "./../Hero/Hero";
import Footer from "./../../Common/Footer/Footer";

import { MdFavoriteBorder } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { RiShareBoxLine } from "react-icons/ri";
import Slider from "../../Common/Slider/Slider";

import Popup from "../../Common/Popup/Popup";
import Gallery from "../../Common/Gallery/Gallery";
import Reviews from "../../Common/Reviews/Reviews.jsx";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import AuthContext from "../../../context/Auth";

import SigninForms from "../../Common/Header/signupsigninforms/SigninForms";

import WhatsAppButton from "../../Common/whatsapp/WhatsappButton";

import {
  EmailShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";

import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";

import Dialog from "@mui/material/Dialog";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { format } from "timeago.js";
import ProfileReview from "../../Common/Reviews/ProfileReview.jsx";
import Signup from "../../Common/Navbar/SignUp2/Signup.jsx";

// window dimensions
function getWindowDimensions() {
  const width = window.innerWidth,
    height = window.innerHeight;
  return { width, height };
}

const SpaProfile = () => {
  const params = useParams();
  const { slug } = params;

  const [spas, setSpas] = useState([{}]);
  const [spa, setSpa] = useState({});

  const { user, authTokens, location } = useContext(AuthContext);

  const [mainimageskeleton, setMainimageskeleton] = useState(true);

  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isLiked, setIsLiked] = useState(false);
  const [availableTherapy, setAvailableTherapy] = useState([]);

  // category
  const [therapyActive, settherapyActive] = useState(0);
  const [therapyId, settherapyId] = useState(
    spa?.therapy && spa.therapy[0]?.id
  );
  const [therapyServices, settherapyServices] = useState([]);

  useEffect(() => {
    if (spa && spa.services) {
      settherapyServices(
        spa?.services?.filter((service) => service.therapies === therapyId)
      );
    }
  }, [spa, therapyId, therapyActive, availableTherapy]);

  useEffect(() => {
    if (spa && spa.therapy) {
      settherapyId(spa?.therapy[0]?.id);
    }
  }, [spa]);

  const [imagesUrl, setImagesUrl] = useState([]);
  // const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [likeId, setLikeId] = useState(null);

  // share material dialog
  const [openshare, setOpenShare] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleClickOpenShare = () => {
    setOpenShare(true);
  };

  //for new share button
  const handleShare = () => {
    navigator
      .share({
        title: spa?.name || "Trakky",
        text: "Check out this spa",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  const handleCloseShare = (value) => {
    setOpenShare(false);
    setSelectedValue(value);
  };
  const log_adder = async (name, type) => {
    const requestBody = {
      category: "spa",
      name: name,
      location,
      actiontype: type,
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
  // const getreviews = async () => {
  //   let res = await fetch(`https://backendapi.trakky.in/spas/review/?spa=${spa?.id}`, {
  //     method: "GET",
  //     "content-type": "application/json",
  //   });
  //   let data = await res.json();
  //   if (res.ok) {
  //     setReviews(data);
  //   }
  // };

  const handlelike = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/spas/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          spa: spa.id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLiked(true);
      })
      .catch((err) => {
        setIsLiked(false);
      });
  };

  const getliked = async (e) => {
    // e.preventDefault();
    const response = await fetch(
      "https://backendapi.trakky.in/spas/userfavorite/",
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
          if (item.spa == spa.id) {
            setIsLiked(true);
            setLikeId(item.id);
          }
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getliked();
  }, [spa, isLiked]);

  const handledislike = async (e) => {
    if (!likeId) return;

    const response = await fetch(
      `https://backendapi.trakky.in/spas/userfavorite/${likeId}/`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(true);
      });

    setIsLiked(false);
  };

  useEffect(() => {
    fetch(`https://backendapi.trakky.in/spas/?slug=${slug}&verified=true`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSpas(data.results[0]);
        let spaData = data.results[0];
        document.title = `${spaData.name}: ${
          spaData.luxurious
            ? "Luxurious Spa"
            : spaData.premium
            ? "Premium Spa"
            : "Spa"
        } in ${spaData.area}, ${spaData.city}`;
        document
          .querySelector('meta[name="description"]')
          .setAttribute(
            "content",
            `Book the Best Spa Deal with ${spaData.name}, ${spaData.area}, ${spaData.city}. ${spaData.about_us}`
          );
        setSpa(spaData);

        setImagesUrl([
          spaData.main_image,
          ...spaData.mul_images.map((url) => url.image),
        ]);
      })

      .catch((err) => console.log(err));
  }, []);
  const [spaProfilePhotosTrigger, setSpaProfilePhotosTrigger] = useState(false);

  // const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const uniqueTherapyArray = [];

    spa?.services?.forEach((entry) => {
      const therapyId = entry.therapies;
      const therapyName = entry.therapy_name;
      const therapyPair = { id: therapyId, name: therapyName };

      if (!uniqueTherapyArray.some((pair) => pair.id === therapyId)) {
        uniqueTherapyArray.push(therapyPair);
      }

      setAvailableTherapy(uniqueTherapyArray);
    });
  }, [spa]);

  useEffect(() => {
    if (spa && availableTherapy?.length) {
      settherapyId(availableTherapy?.[0].id);
    }
  }, [spa, availableTherapy]);

  // useEffect(() => {
  //   if(availableTherapy?.length){
  //     settherapyId(availableTherapy?.[0].id)
  //   }
  // }
  // , [])

  //
  const get_reviews = async () => {
    const res = await fetch(
      `https://backendapi.trakky.in/spas/review/?spa=${spa?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    let total = 0;
    data.length !== 0 &&
      data?.map((item, i) => {
        total += item.rating;
        return item;
      });

    setReviews(data);
    setAverageRating(parseFloat(total / data.length).toFixed(1));
    setTotalReviews(data.length);
  };

  // MUI Modal

  const [reviewModal, setReviewModal] = React.useState(false);
  const handleOpen = () => setReviewModal(true);
  const handleClose = () => setReviewModal(false);

  useEffect(() => {
    spa.id && get_reviews();
  }, [spa]);

  const [open, setOpen] = React.useState(false);
  const handleSignInOpen = () => setOpen(true);
  const handleSignInClose = () => setOpen(false);

  const signInFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  // categories

  const handleBookNowBtn = () => {
    if (!spa?.name) {
      return;
    }

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20spa%20services%20of%20${encodeURIComponent(
      spa?.name
    )}%2C%20${encodeURIComponent(spa?.area)}%2C%20${encodeURIComponent(
      spa?.city
    )}%3F`;

    window.open(link, "_blank");
  };

  return (
    <>
      <WhatsAppButton />
      <Hero />
      <div className="showPhotos">
        <Popup trigger={spaProfilePhotosTrigger}>
          <div
            className="topbar"
            style={{
              width: "98%",
              margin: "1rem 1%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setSpaProfilePhotosTrigger(false)}
              style={{
                padding: "0.7rem 1.2rem",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "#512DC8",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <Gallery spa={spa} />
        </Popup>
      </div>
      <div className="spa_main_container my-container">
        {/* Altering Grid layout for smaller devices */}
        {{ windowDimensions }.windowDimensions.width >= 900 ? (
          <div className="spa-profile__container">
            <div class=" w-[100%]   h-[500px]  max-h-[500px] gap-3  grid grid-cols-2 mb-3 ">
              <div class=" w-[100%]  h-[500px] ">
                <img
                  src={spa.main_image}
                  onLoad={() => {
                    setMainimageskeleton(false);
                  }}
                  className={`${
                    mainimageskeleton ? "hidden" : "block"
                  } object-fit  w-[100%]  h-[100%] `}
                  alt=""
                />

                {mainimageskeleton && (
                  <Skeleton
                    variant="rectangle"
                    className=" w-[100%] h-[100%] "
                  />
                )}
              </div>
              <div class="  grid grid-cols-2  grid-rows-2 h-[500px] gap-3 min-h-[500px]  max-h-[500px] ">
                {spa.mul_images ? (
                  spa.mul_images.map((url, index) => {
                    return index < 4 ? (
                      <div className="w-[100%] h-[100%]  ">
                        <img
                          src={url.image}
                          className={` ${
                            mainimageskeleton ? "hidden" : "block"
                          } h-[100%] w-[100%] object-fit`}
                          alt=""
                        />
                        {mainimageskeleton && (
                          <Skeleton
                            variant="rectangle"
                            className=" w-[100%] h-[100%] "
                          />
                        )}
                      </div>
                    ) : (
                      <></>
                    );
                  })
                ) : (
                  <>
                    <Skeleton
                      className=" w-[100%] h-[100%] "
                      variant="rectangle"
                    />
                    <Skeleton
                      className=" w-[100%] h-[100%] "
                      variant="rectangle"
                    />
                    <Skeleton
                      className=" w-[100%] h-[100%] "
                      variant="rectangle"
                    />
                    <Skeleton
                      className=" w-[100%] h-[100%] "
                      variant="rectangle"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="spa-information__container relative">
              <div className="show-all-photos">
                <button onClick={() => setSpaProfilePhotosTrigger(true)}>
                  <img
                    src={Grids}
                    style={{
                      height: "unset",
                      width: "unset",
                    }}
                    alt=""
                  />
                  Show all photos
                </button>
              </div>
              <div className="spa-information-title">
                <h1>{spa.name}</h1>
                <div className="spa-information-like-share">
                  <Modal
                    open={open}
                    onClose={handleSignInClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={signInFormStyle}>
                      {/* <SigninForms fun={handleSignInClose} /> */}
                      <Signup fun={handleSignInClose} />
                    </Box>
                  </Modal>
                  <li
                    className="spa-like"
                    style={{
                      fontSize: "smaller",
                    }}
                  >
                    {isLiked ? (
                      <>
                        <FcLike
                          onClick={() => {
                            user ? handledislike() : handleSignInOpen();
                          }}
                        />
                        Liked
                      </>
                    ) : (
                      <>
                        <MdFavoriteBorder
                          onClick={() => {
                            user ? handlelike() : handleSignInOpen();
                          }}
                        />
                        Like
                      </>
                    )}
                  </li>
                  <li
                    className="spa-share"
                    style={{
                      fontSize: "smaller",
                    }}
                    // onClick={handleClickOpenShare}
                    onClick={handleShare}
                  >
                    <RiShareBoxLine />
                    Share
                    {/* <FacebookShareCount url={"http://google.com"} /> */}
                  </li>
                  <ShareDialog open={openshare} onClose={handleCloseShare} />
                </div>
              </div>
              <div className="spa-information-subtitle">
                <p
                  style={{
                    color: "#6B7280",
                    fontWeight: "400",
                    lineHeight: "30px",
                    width: "70%",
                  }}
                >
                  {/* 203, Sarthak Pulse Mall, Second Floor, PDPU Circle, Bhajipura,
                  Service Rd, Kudasan, Gandhinagar, Gujarat 382421 */}
                  {spa.address} <br />
                  {/* {spa.landmark} */}
                </p>
                <div className="spa-information-ratings-reviews">
                  {/* <li className="spa-ratings">
                    <img src={Star} alt="" draggable="false" />
                    5.0
                  </li>
                  <li className="spa-reviews">(318 Reviews)</li> */}

                  {averageRating && totalReviews ? (
                    <div
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      ⭐{averageRating}
                      <span className="text-gray-500 text-[16px]">
                        {" "}
                        ({totalReviews} Reviews)
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      0
                      <span className="text-gray-500 text-[16px]">
                        (No Reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="spa-information-tags-offers">
                <div className="spa-information-tags">
                  {spa.premium && <li>Premium</li>}
                  {spa.luxurious && <li>Luxurious</li>}
                  {/* <li>{spa.trending && "Trending"}</li> */}
                </div>
                {spa.offer_tag ? (
                  <div className="spa-information-offer">
                    {/* <li className="spa-profile-card-offers"> */}
                    {spa.offer_tag}
                    {/* </li> */}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="spa-information-contact">
                <div className="spa-information-bookings">
                  <button
                    // href={`https://wa.me/+91${spa.booking_number}`}
                    // onClick={() => {
                    // log_adder(spa.name, "book_now");
                    // }}
                    // target="_blank"
                    className="spa_info_btn"
                    onClick={() => {
                      handleBookNowBtn();
                    }}
                  >
                    Book Now
                  </button>

                  <a
                    className="spa_info_btn"
                    href={`tel:${spa.mobile_number}`}
                    onClick={() => {
                      log_adder(spa.name, "call_now");
                    }}
                  >
                    Call Now
                  </a>

                  {/* <li className="block ">
                    <button
                      className="px-2 py-1 text-white bg-black rounded-lg "
                      onClick={() => setShowReviews(!showReviews)}
                    >
                      {showReviews ? "Hide Reviews" : "Show Reviews"}
                    </button>
                  </li> */}

                  <Link
                    className="spa_info_btn"
                    style={{ width: "150px" }}
                    to={spa.gmap_link}
                  >
                    Get Directions
                  </Link>
                </div>
                <div
                  className="spa-information-phone-price"
                  style={{ fontSize: "1rem" }}
                >
                  <li className="spa-phone">
                    <img
                      src={Phone}
                      alt=""
                      draggable="false"
                      style={{ height: "1rem" }}
                    />
                    {spa.mobile_number}
                  </li>
                  <li className="spa-price">
                    <img
                      src={Man}
                      alt=""
                      draggable="false"
                      style={{ height: "1rem" }}
                    />
                    &#8377; {spa.price} onwards
                  </li>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="spa-profile-mini__container">
            <div
              className="spa-information-title"
              style={{ margin: "0 .8rem" }}
            >
              <div
                className="spa-information-ratings-reviews"
                style={{ fontSize: "1rem", gap: ".5rem" }}
              >
                {/* <li className="spa-ratings">
                <img src={Star} alt="" />
                5.0
              </li>
              <li className="spa-reviews">(318 Reviews)</li> */}

                {averageRating && totalReviews ? (
                  <div
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    ⭐{averageRating}
                    <span className="text-gray-500 text-[16px]">
                      {" "}
                      ({totalReviews} Reviews)
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    0
                    <span className="text-gray-500 text-[16px]">
                      (No Reviews)
                    </span>
                  </div>
                )}
              </div>
              <div
                className="spa-information-like-share"
                style={{ fontSize: "1rem", gap: ".5rem" }}
              >
                <li className="spa-like">
                  {isLiked ? (
                    <>
                      <FcLike
                        onClick={() => {
                          handledislike();
                        }}
                      />
                      Liked
                    </>
                  ) : (
                    <>
                      <MdFavoriteBorder
                        onClick={() => {
                          handlelike();
                        }}
                      />
                      Like
                    </>
                  )}
                </li>
                <li className="spa-share" onClick={handleShare}>
                  <RiShareBoxLine />
                  Share
                  {/* <FacebookShareCount url={"http://google.com"} /> */}
                </li>
                <ShareDialog open={openshare} onClose={handleCloseShare} />
              </div>
            </div>

            <Slider cardList={imagesUrl} _name="spaProfile" isprofile={true} />
            {spa.offer_tag && spa?.mobile_number ? (
              <a
                href={`tel:${spa?.mobile_number}`}
                onClick={() => {
                  log_adder(spa?.name);
                }}
                className="spa-profile-card-offers"
              >
                {spa.offer_tag}
              </a>
            ) : (
              <></>
            )}

            <div className="spa-information-mini-title">
              <a
                href={`tel:${spa.mobile_number}`}
                onClick={() => {
                  log_adder(spa.name);
                }}
              >
                <h2>{spa.name}</h2>
                <p
                  style={{
                    color: "#6B7280",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  {spa.address}
                </p>
                <div
                  className="spa-information-tags"
                  style={{ justifyContent: "flex-start" }}
                >
                  {spa.premium && <li>Premium</li>}
                  {spa.luxurious && <li>Luxurious</li>}
                  {/* <li>{spa.trending && "Trending"}</li> */}
                </div>

                <div
                  className="spa-information-phone-price"
                  style={{ justifyContent: "space-between" }}
                >
                  <li className="spa-phone" style={{ fontSize: "1rem" }}>
                    <img
                      src={Phone}
                      alt=""
                      draggable="false"
                      style={{ width: "1rem", height: "1rem" }}
                    />
                    {spa.mobile_number}
                  </li>
                  <li className="spa-price" style={{ fontSize: "1rem" }}>
                    <img
                      src={Man}
                      alt=""
                      draggable="false"
                      style={{ width: "1rem", height: "1rem" }}
                    />
                    {spa.price} Onwards
                  </li>
                </div>
              </a>
              <div
                className="spa-information-contact"
                style={{ padding: "7.5px 0" }}
              >
                <div className="spa-information-bookings">
                  <li>
                    <button
                      // href={`https://wa.me/+91${spa.booking_number}`}

                      onClick={() => {
                        handleBookNowBtn();
                      }}
                    >
                      Book Now
                    </button>
                  </li>
                  <li>
                    <a
                      href={`tel:${spa.mobile_number}`}
                      onClick={() => {
                        log_adder(spa.name);
                      }}
                    >
                      Call Now
                    </a>
                  </li>
                  <li>
                    <Link to={spa.gmap_link}>Get Directions</Link>
                  </li>
                </div>
              </div>

              <ul
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "-5px",
                  marginBottom: "-40px",
                }}
              >
                {spa.facilities &&
                  spa.facilities.map((data, index) => {
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
                            className="spa_facility_icon profile-page-facility-icon"
                            // style={{ height: "3rem" }}
                          >
                            <img
                              style={{
                                // width: "auto",
                                // height: "auto",
                                margin: "0.5rem 0.5rem 1.5rem ",
                              }}
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
          </div>
        )}
        <div className="flex min-w-[320px] max-w-[1450px] w-full  lg:mt-[15px] overflow-scroll ">
          <div className=" w-[100%] h-[100%] my-[1rem] md:mt-[15px]  overflow-scroll    flex flex-col justify-start items-center service-profile-div">
            <div className="category-list-outer-container  ">
              <div className="category-list-spa-p">
                {availableTherapy?.length &&
                  availableTherapy.map((item, index) => {
                    return (
                      <span
                        key={index}
                        style={{
                          backgroundColor:
                            therapyActive === index ? "#493E6C" : "",
                          color: therapyActive === index ? "white" : "",
                        }}
                        onClick={() => {
                          settherapyActive(index);
                          settherapyId(item?.id);
                        }}
                      >{`${item?.name}`}</span>
                    );
                  })}
              </div>
              <div className="mt-[1rem] " style={{ fontSize: "20px" }}>
                <strong>Services</strong>
              </div>
            </div>

            <Services
              salonname={spa.name}
              mobile_number={spa.mobile_number}
              // servicesData={spa.services}
              servicesData={therapyServices}
            />
          </div>
          <div className="md:w-[35%] right_hidden  md:block">
            <SpaFacilities facilities={spa.facilities ? spa.facilities : []} />
          </div>
        </div>
        {spa?.room_mul_images && spa?.room_mul_images.length > 0 && (
          <RoomPhotos roomData={spa?.room_mul_images} />
        )}
        {averageRating && totalReviews ? (
          <ProfileReview
            data={reviews}
            averageRating={averageRating}
            totalReviews={totalReviews}
            openReviewModal={handleOpen}
          />
        ) : (
          <></>
        )}
        <SpaDailyUpdates spaData={spa} />
        <AboutUsSpa about={spa.about_us} />
        <hr className="hr_line" />
        {/* <SpaRooms /> */}
        <Modal
          open={reviewModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            className="review-model-box"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              height: "500px",
              transform: "translate(-50%, -50%)",
              width: "75%",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "10px",
              overflowY: "scroll",
              py: 2,
            }}
          >
            <Reviews
              spadata={spa}
              data={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
              setAverageRating={setAverageRating}
              setTotalReviews={setTotalReviews}
              reloadData={() => {
                get_reviews();
              }}
            />
          </Box>
        </Modal>{" "}
      </div>

      <Footer city={params?.city || spa?.city || "ahmedabad"} />
    </>
  );
};

// const SpaRooms = () => {
//   return (
//     <div className="spa_rooms_slider__container">
//       <div className="servos__header">
//         <h2>Our Room Photos</h2>
//       </div>

//       <Slider cardList={spaRoomPhotos} _name={"spaRooms"} />
//     </div>
//   );
// };

// I'm giving 'servos' as classname to some divs because there are some
// properties of services and offers are same, so for them I'm using
// 'servos' as a common name

const RoomPhotos = (props) => {
  const RoomsDetails = props?.roomData;

  return (
    <div className="sp-room-main-container">
      <div className="sp-room-main-heading">Our Room Photos</div>
      <div className="sp-room-item-container">
        {RoomsDetails?.length ? (
          RoomsDetails.map((room, index) => {
            return (
              <div className="sp-room-item-div">
                <div className="sp-room-img">
                  {" "}
                  {room?.image && <img src={room?.image} alt="room-img" />}
                </div>
                <div className="sp-room-item-details">
                  {room?.room_name || "Room Name"}
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const Services = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleServices, setVisibleServices] = useState(null);

  useEffect(() => {
    if (window.innerWidth >= 900) {
      setVisibleServices(5);
    } else {
      setVisibleServices(3);
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      console.log("expanded", props.servicesData.length);
      setVisibleServices(props.servicesData.length);
    } else {
      if (window.innerWidth >= 900) {
        setVisibleServices(5);
      } else {
        setVisibleServices(3);
      }
    }
  }, [isExpanded]);

  const toggleScroll = () => {
    setIsExpanded(!isExpanded);
  };

  const { location } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const log_adder = async () => {
    const requestBody = {
      category: "spa",
      name: props.salonname,
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
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  return (
    <div
      className={`w-[100%]  pr-2  md:pr-4 services__container service-c-div overflow-scroll ${
        isExpanded ? "expanded" : ""
      }`}
    >
      <div className="servos__list">
        <ul>
          {props.servicesData
            .slice(0, visibleServices)
            ?.map((service, index) => {
              return (
                <div key={index}>
                  <li>
                    <div className="services_list__container">
                      {{ windowDimensions }.windowDimensions.width >= 765 ? (
                        <>
                          <div className="service_list__left_container">
                            <div className="service_name">
                              <p
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                }}
                              >
                                {service.service_name}
                              </p>
                            </div>
                            <div className="service_description">
                              <p>{service.description}</p>
                            </div>
                          </div>
                          <div className="service_list__right_container">
                            <div className="service_price">
                              <p>
                                <span>₹ {service.price}</span> /{" "}
                                {service.service_time}{" "}
                              </p>
                            </div>
                            <div className="services__button">
                              <a
                                href={`tel:${props.mobile_number}`}
                                onClick={() => {
                                  log_adder();
                                }}
                                className="float-right"
                              >
                                Call Now
                              </a>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {" "}
                          <div className="service_list__left_container">
                            <div className="service_name">
                              <p
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                }}
                              >
                                {service.service_name}
                              </p>
                            </div>
                            <div
                              className="service_description"
                              style={{ margin: ".5rem 0" }}
                            >
                              <p>{service.description}</p>
                            </div>
                          </div>
                          <div
                            className="service_list__right_container"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "3fr 1fr",
                            }}
                          >
                            <div className="service_price">
                              <p>
                                <span>₹ {service.price}</span> /{" "}
                                {service.service_time}{" "}
                              </p>
                            </div>
                            <div className="services__button">
                              <a
                                href={`tel:${props.mobile_number}`}
                                onClick={() => {
                                  log_adder(service.salonname);
                                }}
                                style={{
                                  padding: " auto 4px",
                                  fontSize: "12px",
                                }}
                              >
                                Call Now
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </div>
              );
            })}
        </ul>
        {props.servicesData?.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <h1>We will add menu soon!</h1>
          </div>
        )}
      </div>
      {props.servicesData.length > visibleServices && (
        <div className="view-more-button-container">
          <button onClick={toggleScroll}>
            {isExpanded ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
    
  );
};

// const Offers = (props) => {
//   const [offerCounter, setOfferCounter] = useState(0);
//   const { location } = useContext(AuthContext);
//   const log_adder = async () => {
//     await fetch("https://backendapi.trakky.in/spas/log-entry/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         category: "spa",
//         name: props.spaname,
//         location,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data));
//   };
//   return (
//     <div className="spa_offers__container">
//       <div className="servos__header">
//         <h2>Offers</h2>
//       </div>
//       <div className="servos__list">
//         <ul>
//           {props.offerData.map((offer, index) => {
//             return (
//               <>
//                 <li key={index}>
//                   {() => {
//                     setOfferCounter(++offerCounter);
//                   }}
//                   <div className="offers_list__container">
//                     <div className="offers_list__upper_container">
//                       <div className="offers_name">
//                         <p
//                           style={{
//                             fontSize: "18px",
//                             fontWeight: "500",
//                           }}
//                         >
//                           {offer.name}
//                         </p>
//                       </div>
//                       <div className="offers_description">
//                         {/* <p>{offer.discount}</p> */}
//                       </div>
//                     </div>

//                     <div className="offers_list__bottom_container">
//                       <div className="offers_price">
//                         <p>
//                           <span>Discount {offer.discount} %</span>
//                         </p>
//                       </div>
//                       <div className="offers__button">
//                         <a
//                           href={`tel:${props.mobile_number}`}
//                           onClick={() => {
//                             log_adder();
//                           }}
//                         >
//                           Call Now
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               </>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// };

const SpaFacilities = ({ facilities }) => {
  return (
    <div className="spa_facility__container">
      <div className="servos__header">
        <h2
          style={{
            fontWeight: "500",
          }}
        >
          What this place offers
        </h2>
      </div>

      <div className="spa_facility_list">
        <ul>
          {facilities.map((data, index) => {
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
                  <div className="spa_facility_icon">
                    <img
                      src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                      alt=""
                      style={{
                        margin: "1rem 1rem 1rem 0",
                      }}
                    />
                  </div>
                  <div className="spa_facility__name">
                    <p>{data}</p>
                  </div>
                </li>
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const SpaDailyUpdates = (props) => {
  const { location } = React.useContext(AuthContext);

  const [dailyUpdates, setDailyUpdates] = useState([]);

  const handleBookNowBtn = () => {
    if (!props?.spaData?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20spa%20services%20of%20${encodeURIComponent(
      props?.spaData?.name
    )}%2C%20${encodeURIComponent(
      props?.spaData?.area
    )}%2C%20${encodeURIComponent(props?.spaData?.city)}%3F`;

    window.open(link, "_blank");
  };
  const { user } = useContext(AuthContext);

  const log_adder = async (name, type) => {
    const requestBody = {
      category: "spa",
      name: name,
      location,
      actiontype: type,
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [viewMore, setViewMore] = useState({});
  const [isMoreData, setIsMoreData] = useState(false);
  const [page, setPage] = useState(1);

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
      console.log("error");
      return;
    }
    setIsMoreData(data?.next == null ? false : true);
    setDailyUpdates((prev) => [...prev, ...data?.results]);
  };

  useEffect(() => {
    props?.spaData?.id && getDailyUpdates();
  }, [props?.spaData?.id, page]);

  return (
    <>
      {dailyUpdates?.length > 0 && (
        <div className="daily_update_main" onClick={handleOpen}>
          <div className="daily_update_spa_details">
            <img src={props?.spaData?.main_image} alt="" />
            <div className="d-u-spa-name">
              <h2>{props?.spaData?.name}</h2>
              <p>Daily Updates</p>
            </div>
          </div>
          <Swiper slidesPerView={"auto"} className="daily_update_container-ss">
            {dailyUpdates?.map((post, index) => (
              <SwiperSlide className="daily_update_card" key={index}>
                <div className="daily_update_card_img">
                  <img src={post?.daily_update_img} alt="" />
                </div>
                <div className="daily_update_card_content">
                  <p>
                    {post?.daily_update_description.length > 70
                      ? post?.daily_update_description.slice(0, 70) + "..."
                      : post?.daily_update_description}
                  </p>
                </div>
                <p className="time-ago-daily-update">
                  {format(post?.created_at)}
                </p>
                <a
                  href={`tel:${props?.spaData?.mobile_number}`}
                  onClick={() => log_adder(props?.spaData?.name, "call_now")}
                >
                  Call Now
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ border: "none", outline: "none" }}
      >
        <div className="daily-update-popup">
          <div className="daily-update-popup-header">
            <button onClick={handleClose}>
              <img
                src={require("../../../Assets/images/icons/backarrow.png")}
                alt="back"
              />
              <span>Updates</span>
            </button>
            <button onClick={handleClose}>+</button>
          </div>
          {dailyUpdates?.length > 0 &&
            dailyUpdates?.map((item, index) => (
              <div className="du-main-modal-item">
                <div className="daily_update_spa_details">
                  <img src={props?.spaData?.main_image} alt="" />
                  <div className="d-u-spa-name">
                    <h2>{props?.spaData?.name}</h2>
                  </div>
                </div>
                <div className="modal-daily_update_card">
                  <div className="modal-daily_update_card_img">
                    <img src={item?.daily_update_img} alt="" />
                  </div>
                  <div className="modal-daily_update_card_content">
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
                  <p className="modal-time-ago-daily-update">
                    {format(item?.created_at)}
                  </p>
                  <a
                    href={`tel:${props?.spaData?.mobile_number}`}
                    onClick={() => log_adder(props?.spaData?.name, "call_now")}
                    className="modal-daily-update-book-now"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            ))}

          {isMoreData && (
            <div
              className="view-more-button-container"
              style={{
                width: "max-content",
                margin: "auto",
                padding: "3px 10px",
                cursor: "pointer",
                borderRadius: "20px",
                border: "1px solid #000",
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
    </>
  );
};

const AboutUsSpa = (props) => {
  const [showMore, setShowMore] = useState(false);

  const handleClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div
      className="spa_about_us__container my-container"
      style={{
        display: props.about !== "" ? "block" : "none",
      }}
    >
      <div className="servos__header">
        <h2>About Us</h2>
      </div>

      <div className="spa_about_us__description">
        <p>
          {showMore
            ? props.about
            : props.about?.length > 300
            ? `${props.about.substring(0, 300)}...`
            : props.about}
        </p>
        <button onClick={handleClick}>
          {showMore ? "show Less" : "show More"}
        </button>
      </div>

      <div className="spa_show_more__button">
        {/* <Link>Show more</Link> */}
      </div>
    </div>
  );
};
export default SpaProfile;

const ShareDialog = (props) => {
  const { onClose, open } = props;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "10px",
        },
      }}
    >
      <div style={{ display: "flex", gap: "30px", padding: "40px" }}>
        <EmailShareButton url={window.location.href}>
          <EmailIcon style={{ fontSize: "35px" }} />
        </EmailShareButton>
        <WhatsappShareButton url={window.location.href}>
          <WhatsAppIcon style={{ fontSize: "35px" }} />
        </WhatsappShareButton>
        <TwitterShareButton url={window.location.href}>
          <TwitterIcon style={{ fontSize: "35px" }} />
        </TwitterShareButton>
        <TelegramShareButton url={window.location.href}>
          <TelegramIcon style={{ fontSize: "35px" }} />
        </TelegramShareButton>
      </div>
    </Dialog>
  );
};

//  <div className="grid-container">
//             <div className="vertical-div">
//             <img src={spa.main_image} onLoad={()=>{setMainimageskeleton(false)}} style={{display:`${mainimageskeleton?"none":"block"}`,width:"100%",height:"100%"}}  alt="" />
//               {mainimageskeleton&& <Skeleton variant="rectangle" className="vertical-div"   />}
//             </div>
//             {spa.mul_images ? (
//               spa.mul_images.map((url, index) => {
//                 return index < 3 ? (
//                   <div className={`div-${index + 1}`}>
//                     <img src={url.image} className="grid-image" alt="" />
//                   </div>
//                 ) : (
//                   <></>
//                 );
//               })
//             ) : (
//               < >
//               <Skeleton className="grid-image" variant="rectangle"  />
//               <Skeleton className="grid-image" variant="rectangle"  />
//               <Skeleton className="grid-image" variant="rectangle"  />

//               </>
//             )}
//             <div className="div-4">
//               <>
//                 {spa.mul_images &&
//                 spa.mul_images[3] &&
//                 spa.mul_images[3].image ? (
//                   <>
//                     <img
//                       src={spa.mul_images[3].image}
//                       className="grid-image"
//                       alt=""
//                     />
//                     <div className="show-all-photos">
//                       <button
//                         onClick={() => setSpaProfilePhotosTrigger(true)}
//                       >
//                         <img
//                           src={Grids}
//                           style={{
//                             height: "unset",
//                             width: "unset",
//                           }}
//                           alt=""
//                         />
//                         Show all photos
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <>

//                   </>

//                 )

//                 }
//                 <Skeleton className="div-3" variant="rectangle"  />
//                 {/* {!spa.mul_images &&  } */}
//               </>
//             </div>
//           </div>
