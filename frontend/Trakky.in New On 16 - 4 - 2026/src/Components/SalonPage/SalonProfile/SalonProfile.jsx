import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./SalonProfile.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Phone from "../../../Assets/images/icons/phone.svg";
import Man from "../../../Assets/images/icons/man.svg";
import Grids from "../../../Assets/images/icons/four-grids.svg";
import DUC from "../../../Assets/images/hero/3.jpg";
import Hero from "../Hero/Hero";
import Footer from "../../Common/Footer/Footer";

import { MdFavoriteBorder } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { RiShareBoxLine } from "react-icons/ri";
import Slider from "../../Common/Slider/Slider";

import Popup from "../../Common/Popup/Popup";
import Gallery from "../../Common/Gallery/Gallery";
import Gallery2 from "../../Common/Gallery2/Gallary.jsx";
import Reviews from "../../Common/Reviews/Reviews.jsx";
import ProfileReview from "../../Common/Reviews/ProfileReview";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import AuthContext from "../../../context/Auth";

import SigninForms from "../../Common/Header/signupsigninforms/SigninForms";

import WhatsAppButton from "../../Common/whatsapp/WhatsappButton";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { format } from "timeago.js";

// window dimensions
function getWindowDimensions() {
  const width = window.innerWidth,
    height = window.innerHeight;
  return { width, height };
}

const SalonProfile = () => {
  const { user, authTokens, location } = useContext(AuthContext);
  const [mainimageskeleton, setMainimageskeleton] = useState(true);

  const params = useParams();
  const { slug } = params;

  const [salons, setSalons] = useState([{}]);
  const [salon, setSalon] = useState({});

  const [isLiked, setIsLiked] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [likeId, setLikeId] = useState(null);

  // category
  const [categoryActive, setCategoryActive] = useState(0);
  const [categoryId, setcategoryId] = useState(
    salon?.category && salon.category[0]?.id
  );

  const [categoryServices, setCategoryServices] = useState([]);
  const [categoryname, setCategoryname] = useState([]);

  const [availableCategory, setAvailableCategory] = useState([]);

  useEffect(() => {
    const uniqueCategoryArray = [];

    salon?.services?.forEach((entry) => {
      const CategoryId = entry.categories;
      const CategoryName = entry.category_data?.category_name;
      const CategoryPair = { id: CategoryId, name: CategoryName };

      if (!uniqueCategoryArray.some((pair) => pair.id === CategoryId)) {
        uniqueCategoryArray.push(CategoryPair);
      }

      setAvailableCategory(uniqueCategoryArray);
    });
  }, [salon]);

  useEffect(() => {
    if (salon && salon.services) {
      setCategoryServices(
        salon?.services?.filter((service) => service.categories === categoryId)
      );
    }
  }, [salon, categoryId, categoryActive, availableCategory]);

  useEffect(() => {
    if (salon && availableCategory?.length) {
      setcategoryId(availableCategory?.[0].id);
    }
  }, [salon, availableCategory]);

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

  const [imagesUrl, setImagesUrl] = useState([]);

  const [reviews, setReviews] = useState([]);

  const handlelike = async (e) => {
    const response = await fetch(
      "https://backendapi.trakky.in/salons/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          salon: salon.id,
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
          if (item.salon == salon.id) {
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
  }, [salon, isLiked, authTokens]);

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

  useEffect(() => {
    fetch(`https://backendapi.trakky.in/salons/?slug=${slug}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.results[0], "salon");
        setCategoryname(data?.results[0]?.category?.[0]?.name);

        document.title = `${data.results[0].name} , ${data.results[0].city} - Trakky`;
        document
          .querySelector('meta[name="description"]')
          .setAttribute(
            "content",
            `Discover the Ultimate Salon & Beauty Experience at ${data?.results[0]?.name} Elevate Your Look with Expert Stylists. Book Your Appointment Now for Luxurious Hair & Beauty Services.`
          );

        setSalon(data.results[0]);
        setImagesUrl([
          data.results[0].main_image,
          ...data.results[0].mul_images.map((url) => url.image),
        ]);
      })

      .catch((err) => console.log(err));
  }, []);

  const [salonProfilePhotosTrigger, setSalonProfilePhotosTrigger] =
    useState(false);

  const get_reviews = async () => {
    const res = await fetch(
      `https://backendapi.trakky.in/salons/review/?salon=${salon?.id}`,
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

  const log_adder = async (name, type) => {
    const requestBody = {
      category: "salon",
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

  useEffect(() => {
    salon.id && get_reviews();
  }, [salon]);

  const [open, setOpen] = React.useState(false);
  const handleSignInOpen = () => {
    setOpen(true);
  };
  const handleSignInClose = () => setOpen(false);

  const signInFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const handleShare = () => {
    navigator
      .share({
        title: salon?.name || "Trakky",
        text: "Check out this salon",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  const handleBookNowBtn = () => {
    if (!salon?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      salon?.name
    )}%2C%20${encodeURIComponent(salon?.area)}%2C%20${encodeURIComponent(
      salon?.city
    )}%3F`;

    window.open(link, "_blank");
  };

  return (
    <>
      <WhatsAppButton />
      <Hero />
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
      <div className="showPhotos">
        <Popup trigger={salonProfilePhotosTrigger}>
          <div
            className="topbar"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "1rem",
              marginTop: "15px",
              marginBottom: "5px",
            }}
          >
            <button
              className="button-mobile"
              onClick={() => setSalonProfilePhotosTrigger(false)}
              style={{
                // padding: "0.7rem 1.2rem",
                // borderRadius: "10px",
                marginTop: "1rem",
                borderRadius: "50%",
                color: "white",
                backgroundColor: "light gray",
                cursor: "pointer",
                // display:"none",
              }}
            >
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.54004 10.7339L0.999696 5.86719"
                  stroke="black"
                  stroke-width="0.997262"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M0.999695 5.86673L6.54004 1"
                  stroke="black"
                  stroke-width="0.997262"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <h2
              style={{
                textAlign: "center",
                fontWeight: "500",
                fontSize: "23.1261px",
                lineHeight: "31px",
                color: "#000000",
              }}
              className="gallery-heading"
            >
              Images from the best salons
            </h2>

            <button
              className="button-desktop"
              onClick={() => setSalonProfilePhotosTrigger(false)}
              style={{
                // padding: "0.7rem 1.2rem",
                // borderRadius: "10px",

                borderRadius: "50%",
                color: "white",
                backgroundColor: "lightgray",
                cursor: "pointer",
              }}
            >
              {/* Close */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.91134 27.1118L8.88867 26.0891L16.9776 18.0002L8.88867 9.91134L9.91134 8.88867L18.0002 16.9776L26.0891 8.88867L27.1118 9.91134L19.0229 18.0002L27.1118 26.0891L26.0891 27.1118L18.0002 19.0229L9.91134 27.1118Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

          {/* <Gallery salon={salon} /> */}

          <Gallery2 salon={salon} />
        </Popup>
      </div>
      <div className="spa_main_container my-container">
        {/* Altering Grid layout for smaller devices */}
        {{ windowDimensions }.windowDimensions.width >= 900 ? (
          <div className="salon-profile__container">
            <div class=" w-[100%]   h-[500px]  max-h-[500px] gap-3  grid grid-cols-2 mb-4 ">
              <div class=" w-[100%]  h-[500px] ">
                <img
                  src={salon.main_image}
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
              <div class="   grid grid-cols-2  grid-rows-2 h-[500px] gap-3 min-h-[500px]  max-h-[500px] ">
                {salon.mul_images ? (
                  salon.mul_images.map((url, index) => {
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

            <div className="salon-information__container relative">
              <div className="show-all-photos">
                <button onClick={() => setSalonProfilePhotosTrigger(true)}>
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
              <div className="salon-information-title">
                <h1>{salon.name}</h1>
                <div className="salon-information-like-share">
                  <li
                    className="salon-like"
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
                    className="salon-share"
                    style={{
                      fontSize: "smaller",
                    }}
                    onClick={handleShare}
                  >
                    <RiShareBoxLine />
                    Share
                    {/* <FacebookShareCount url={"http://google.com"} /> */}
                  </li>
                </div>
              </div>
              <div className="salon-information-subtitle">
                <p
                  style={{
                    color: "#6B7280",
                    fontWeight: "400",
                    lineHeight: "30px",
                    width: "70%",
                  }}
                >
                  {salon.address} <br />
                </p>
                <div className="salon-information-ratings-reviews">
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
                    <span
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      0 (No Reviews)
                    </span>
                  )}
                </div>
              </div>
              <div className="salon-information-tags-offers">
                <div className="salon-information-tags">
                  {salon.premium && <li>Premium</li>}
                  {salon.bridal && <li>Bridal</li>}
                  {salon.academy && <li>Acdemy Salon</li>}
                  {salon.makeup && <li>MakeUp</li>}
                </div>
                {salon.offer_tag ? (
                  <div className="salon-information-offer">
                    {salon.offer_tag}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="salon-information-contact">
                <div className="salon-information-bookings">
                  <li>
                    <button
                      onClick={() => {
                        handleBookNowBtn();
                      }}
                    >
                      Book Now
                    </button>
                  </li>
                  <li>
                    <a
                      href={`tel:${salon.mobile_number}`}
                      onClick={() => log_adder(salon.name, "call_now")}
                    >
                      Call Now
                    </a>
                  </li>

                  <li>
                    <Link to={salon.gmap_link}>Get Directions</Link>
                  </li>
                </div>
                <div
                  className="salon-information-phone-price"
                  style={{ fontSize: "1rem" }}
                >
                  <li className="salon-phone">
                    <img
                      src={Phone}
                      alt=""
                      draggable="false"
                      style={{ height: "1rem" }}
                    />
                    {salon.mobile_number}
                  </li>
                  <li className="salon-price">
                    <img
                      src={Man}
                      alt=""
                      draggable="false"
                      style={{ height: "1rem" }}
                    />
                    &#8377; {salon.price} onwards
                  </li>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="salon-profile-mini__container">
              <div
                className="salon-information-title"
                style={{ margin: "0 .8rem" }}
              >
                <div
                  className="salon-information-ratings-reviews"
                  style={{ fontSize: "1.2rem", gap: ".5rem" }}
                >
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
                  className="salon-information-like-share"
                  style={{ fontSize: "1rem" }}
                >
                  <li className="salon-like">
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
                  <li className="salon-share" onClick={handleShare}>
                    <RiShareBoxLine />
                    Share
                  </li>
                </div>
              </div>

              <Slider
                cardList={imagesUrl}
                _name="salonProfile"
                isprofile={true}
              />
              {salon.offer_tag ? (
                <p
                  className="salon-profile-card-offers"
                  onClick={() => {
                    handleBookNowBtn();
                  }}
                >
                  {salon.offer_tag}
                </p>
              ) : (
                <></>
              )}

              <div className="salon-information-mini-title">
                <div
                  onClick={() => {
                    handleBookNowBtn();
                  }}
                >
                  <h2>{salon.name}</h2>
                  <p
                    style={{
                      color: "#6B7280",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    {salon.address}
                  </p>
                  <div
                    className="salon-information-tags"
                    style={{ justifyContent: "flex-start" }}
                  >
                    {salon.premium && <li>Premium</li>}
                    {salon.bridal && <li>Bridal</li>}
                    {salon.academy && <li>Acdemy Salon</li>}
                    {salon.makeup && <li>MakeUp</li>}
                  </div>

                  <div
                    className="salon-information-phone-price"
                    style={{ justifyContent: "space-between" }}
                  >
                    <li className="salon-phone" style={{ fontSize: "1rem" }}>
                      <img
                        src={Phone}
                        alt=""
                        draggable="false"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      {salon.mobile_number}
                    </li>
                    <li className="salon-price" style={{ fontSize: "1rem" }}>
                      <img
                        src={Man}
                        alt=""
                        draggable="false"
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      &#8377; {salon.price} Onwards
                    </li>
                  </div>
                </div>
                <div
                  className="salon-information-contact"
                  style={{ padding: "7.5px 0" }}
                >
                  <div className="salon-information-bookings">
                    <li>
                      <button
                        onClick={() => {
                          handleBookNowBtn();
                        }}
                      >
                        Chat Now
                      </button>
                    </li>
                    <li>
                      <a
                        href={`tel:${salon.mobile_number}`}
                        onClick={() => log_adder(salon.name)}
                      >
                        Call Now
                      </a>
                    </li>
                    <li>
                      <Link to={salon.gmap_link}>Get Directions</Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ul
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".2rem",
                }}
              >
                {salon.facilities &&
                  salon.facilities.map((data, index) => {
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
                            className="salon_facility_icon profile-page-facility-icon"
                            // style={{ height: "3rem" }}
                          >
                            <img
                              style={{
                                //   width: "auto",
                                //   height: "auto",
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
          </>
        )}

        <div className="flex min-w-[320px] max-w-[1450px] w-full   lg:mt-[15px] overflow-scroll ">
          <div className=" w-[100%] h-[100%] my-[1rem] md:mt-[15px]  overflow-scroll    flex flex-col justify-start items-center service-profile-div">
            <div className="category-list-outer-container  ">
              <div className="category-list-salon-p">
                {availableCategory?.length ? (
                  availableCategory.map((item, index) => {
                    return (
                      <span
                        key={index}
                        style={{
                          backgroundColor:
                            categoryActive === index ? "#493E6C" : "",
                          color: categoryActive === index ? "white" : "",
                        }}
                        onClick={() => {
                          setCategoryActive(index);
                          setcategoryId(item?.id);
                          setCategoryname(item?.name);
                        }}
                      >{`${item?.name}`}</span>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
              <div className="mt-[1rem] " style={{ fontSize: "20px" }}>
                <strong>Services</strong>
              </div>
            </div>
            {
              <Services
                salonname={salon.name}
                mobile_number={salon.mobile_number}
                servicesData={categoryServices}
              />
            }
          </div>
          <div className="md:w-[35%] right_hidden  md:block">
            <SalonFacilities
              facilities={salon.facilities ? salon.facilities : []}
            />
          </div>
        </div>

        {/* {salon?.client_images && salon?.client_images.length > 0 && (
          <ClientWorkPhoto workData={salon?.client_images} />
        )} */}

        {/* Profile Review Section */}
        {averageRating && totalReviews ? (
          <ProfileReview
            salonData={salon}
            data={reviews}
            totalReviews={totalReviews}
            averageRating={averageRating}
            setTotalReviews={setTotalReviews}
            setAverageRating={setAverageRating}
            openReviewModal={handleOpen}
          />
        ) : (
          <></>
        )}

        <SalonDailyUpdates salonData={salon} />

        <AboutUsSalon about={salon.about_us} />
        <hr className="hr_line" />

        {/* <SalonRooms /> */}

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
              overflowY: "scroll",
              borderRadius: "10px",
              maxWidth: "750px",
              py: 2,
            }}
          >
            <Reviews
              salondata={salon}
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
        </Modal>
      </div>

      <Footer city={params?.city || salon?.city || "ahmedabad"} />
    </>
  );
};

const Services = (props) => {
  const { user } = useContext(AuthContext);
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

  const { location } = React.useContext(AuthContext);

  const log_adder = async (name) => {
    const requestBody = {
      category: "salon",
      name: name,
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
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const formateTime = (time) => {
    let str = "";

    if (time?.days) {
      str += time.days + " Days, ";
    }
    if (time?.seating) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes) {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  return (
    <div
      className={`w-[100%] services-container service-c-div overflow-scroll`}
    >
      {/* <div className="servos__list">
        <ul>
          {props.servicesData.slice(0, visibleServices).map((service, index) => {
            return (
              <>
                <li key={index}>
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
                              {service.service_time?.minutes}{" "}
                            </p>
                          </div>
                          <div className=" bg-black rounded-full px-1 text-white  flex justify-center items-center mt-3 w-[125px] float-right ">
                            <a
                              href={`tel:${props.mobile_number}`}
                              onClick={() => log_adder(props.salonname)}
                            >
                              <span className="text-white">Call Now</span>
                            </a>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
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
                              {service.service_time?.minutes}{" "}
                            </p>
                          </div>
                          <div className="services__button">
                            <a
                              href={`tel:${props.mobile_number}`}
                              onClick={() => log_adder(props.salonname)}
                              style={{
                                padding: "8px 12px",
                                fontSize: "12px",
                              }}
                              className=""
                            >
                              Call Now
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </>
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
       
      </div> */}

      <div className="Service-main-container">
        {props.servicesData.slice(0, visibleServices).map((item, index) => {
          return (
            <div className="Main-Service-Item">
              <div className="Service-Image-Div">
                <div className="Service-Image-container">
                  {item?.service_image && <img src={item.service_image} />}
                </div>
                <button className="Service-call-now-btn-md">
                  {" "}
                  <a
                    href={`tel:${props.mobile_number}`}
                    onClick={() => log_adder(props.salonname)}
                  >
                    Call Now
                  </a>
                </button>
              </div>
              <div className="Service-Content-Div">
                <div className="Service-Title-Div">{item?.service_name}</div>
                <div className="Service-Description-Div">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.description,
                    }}
                  />
                </div>
                <div className="Service-price-book-Div">
                  <div className="Service-pricing-Div">
                    ₹ {item?.price} /{" "}
                    <span
                      style={{
                        color: " #646464",
                      }}
                    >
                      {formateTime(item?.service_time)}
                    </span>
                  </div>
                  <button className="Service-call-now-btn">
                    {" "}
                    <a
                      href={`tel:${props.mobile_number}`}
                      onClick={() => log_adder(props.salonname)}
                      style={{
                        color: "white",
                      }}
                    >
                      Call Now
                    </a>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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

const SalonFacilities = ({ facilities }) => {
  return (
    <div className="salon_facility__container">
      <div className="servos__header">
        <h2
          style={{
            fontWeight: "500",
          }}
        >
          What this place offers
        </h2>
      </div>

      <div className="salon_facility_list">
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
                  <div className="salon_facility_icon">
                    <img
                      src={require(`./../../../Assets/images/icons/${iconNumber}.png`)}
                      alt=""
                      style={{
                        margin: "1rem 1rem 1rem 0",
                      }}
                    />
                  </div>
                  <div className="salon_facility__name">
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

const ClientWorkPhoto = (props) => {
  const ClientworkData = props?.workData;

  return (
    <div className="sp-room-main-container">
      <div className="sp-room-main-heading">Client Work Photos</div>
      <div className="sp-room-item-container">
        {ClientworkData?.length ? (
          ClientworkData.map((work, index) => {
            return (
              <div className="sp-room-item-div">
                <div className="sp-room-img">
                  {" "}
                  {work?.client_image && (
                    <img src={work?.client_image} alt="service-img" />
                  )}
                </div>
                <div className="sp-room-item-details">
                  {work?.service || "Service Name"}
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

const SalonDailyUpdates = (props) => {
  const { user } = useContext(AuthContext);
  const { location } = React.useContext(AuthContext);

  const [dailyUpdates, setDailyUpdates] = useState([]);

  const handleBookNowBtn = () => {
    if (!props?.salonData?.name) {
      return;
    }
    let link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      props?.salonData?.name
    )}%2C%20${encodeURIComponent(
      props?.salonData?.area
    )}%2C%20${encodeURIComponent(props?.salonData?.city)}%3F`;

    window.open(link, "_blank");
  };

  const log_adder = async (name, type) => {
    const requestBody = {
      category: "salon",
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isMoreData, setIsMoreData] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMore, setViewMore] = useState({});

  const getDailyUpdates = async () => {
  try {
    const res = await fetch(
      `https://backendapi.trakky.in/salons/daily-updates/?salon_id=${props?.salonData?.id}&page=1&active=${true}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (res.status !== 200) {
      console.log("Error fetching daily updates");
      return;
    }

    // Filter only active_status === true
    const activeData = Array.isArray(data?.results)
      ? data.results.filter((item) => item.active_status === true)
      : [];

    // Check if there is more data
    setIsMoreData(data?.next !== null);

    // Append only active updates
    setDailyUpdates((prev) => [...prev, ...activeData]);

  } catch (error) {
    console.error("Error fetching daily updates:", error);
  }
};


  useEffect(() => {
    props?.salonData?.id && getDailyUpdates();
  }, [props?.salonData?.id, page]);

  return (
    <>
      {dailyUpdates?.length > 0 && (
        <div className="daily_update_main" onClick={handleOpen}>
          <div className="daily_update_salon_details">
            <img src={props?.salonData?.main_image} alt="" />
            <div className="d-u-salon-name">
              <h2>{props?.salonData?.name}</h2>
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
                    {post?.daily_update_description.length > 80
                      ? post?.daily_update_description.slice(0, 80) + "..."
                      : post?.daily_update_description}
                  </p>
                </div>
                <p className="time-ago-daily-update">
                  {format(post?.created_at)}
                </p>
                <a
                  href={`tel:${props?.salonData?.mobile_number}`}
                  onClick={() => log_adder(props?.salonData?.name, "call_now")}
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
          {dailyUpdates?.map((item, index) => (
            <div className="du-main-modal-item">
              <div className="daily_update_salon_details">
                <img src={props?.salonData?.main_image} alt="" />
                <div className="d-u-salon-name">
                  <h2>{props?.salonData?.name}</h2>
                  <p>Daily Updates</p>
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
                  href={`tel:${props?.salonData?.mobile_number}`}
                  onClick={() => log_adder(props?.salonData?.name, "call_now")}
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

const AboutUsSalon = (props) => {
  const [showMore, setShowMore] = useState(false);
  const handleClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div
      className="salon_about_us__container my-container"
      style={{
        display: props.about !== "" ? "block" : "none",
      }}
    >
      <div className="servos__header">
        <h2>About Us</h2>
      </div>

      <div className="salon_about_us__description">
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

      <div className="salon_show_more__button">
        {/* <Link>Show more</Link> */}
      </div>
    </div>
  );
};

export default SalonProfile;
