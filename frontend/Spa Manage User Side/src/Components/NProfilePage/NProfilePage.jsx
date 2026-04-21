import React, { useState, useContext, useEffect, useRef } from "react";
import ProfilepageHeader from "../Common/Navbar/ProfilepageHeader";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/Auth";
import Signup from "../Common/Navbar/SignUp2/Signup";
import "./NProfilePage.css";
import trakkyLoading from "../../Assets/images/logos/trakky_loading.gif";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import toast, { Toaster } from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/pagination";
// import 'swiper/css/navigation';

import Info_svg from "../../Assets/images/icons/info_i_svg.svg";
import Grids from "../../Assets/images/icons/white_grid.svg";
import rightArrow from "../../Assets/images/icons/right_black_arraw.svg";
import OfferPng from "../../Assets/images/icons/offer_svg.svg";
import ReviewSvg from "../../Assets/images/icons/rating_svg.svg";
import NewReviewSvg from "../../Assets/images/icons/new_star_svg.svg";
import TrakkyPromises from "../../Assets/images/icons/trakky_promises_png.png";
import ShareIcon from "../../Assets/images/icons/share_svg.svg";
import { MdFavoriteBorder } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import ReviewPen from "../../Assets/images/icons/Review_pen.svg";

import AboutUsModal from "./ModalComponent/AboutUsModal";
import Gallery2 from "../Common/Gallery2/Gallary";
import Services from "./Massages/Service";
import { Backdrop } from "@mui/material";
// import { Navigation, Pagination } from "swiper";
import MembershipComponent from "./Membership/MembershipComponent";
import DailyUpdates from "./DailyUpdates/DailyUpdates";
import SpaTimingModal from "./ModalComponent/SpaTimingModal";
import ReviewPostModal from "./ModalComponent/ReviewPostModal";
import ReviewGETModal from "./ModalComponent/ReviewGETModal";
import TrakkyPromisesModal from "./ModalComponent/TrakkyPromisesModal";
import FooterN from "../Common/Footer/FooterN";

import moment from "moment";
import OfferSpaModal from "./ModalComponent/OfferSpaModal";
import PromisesLogo from "../../Assets/images/icons/trakky_promises_png.png";

import ShareWhitePng from "../../Assets/images/icons/Share_white_png.png";
import {
  ArrowDownward,
  ArrowDownwardOutlined,
  ArrowDownwardRounded,
  ArrowDownwardSharp,
  ArrowDropDown,
  ArrowDropDownCircleOutlined,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoveDown,
} from "@mui/icons-material";

import { InfoSharp } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const NProfilePage = () => {
  const {
    user,
    authTokens,
    location,
    userFavorites,
    fetchUserFavorites,
    fetchUserData,
  } = useContext(AuthContext);

  const params = useParams();
  const { slug } = params;

  const [loadingState, setLoadingState] = useState(true);


  
  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  const [spa, setSpa] = useState({});
  const [targetServiceId, setTargetServiceId] = useState({ id: null });

  const [sectionHasData, setSectionHasData] = useState({
    topNavSection: true,
    bestSellerSection: true,
    massagesSection: true,
    membershipSection: true,
  });

  useEffect(() => {
    console.log("sectionHasData", sectionHasData);
  }, [sectionHasData]);

  const [spaOffers, setSpaOffers] = useState([]);
  const [desktopVisibleOffers, setDesktopVisibleOffers] = useState(1);
  const [offerModalData, setOfferModalData] = useState({});
  const [userNameChangeModal, setUserNameChangeModal] = useState(false);
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);
  const [userNameOfUser, setUserNameOfUser] = useState("");

  // spa timing modal
  const [openSpaTiming, setOpenSpaTiming] = useState(false);

  // sign in modal
  const [openSignIn, setOpenSignIn] = useState(false);
  const handleSignInOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setOpenSignIn(true);
  };
  const handleSignInClose = () => {
    window.history.back();
    setOpenSignIn(false);
  };

  // aboutUS modal
  const [openAboutUs, setOpenAboutUs] = useState(false);
  const handleAboutUsOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setOpenAboutUs(true);
  };
  const handleAboutUsClose = () => {
    window.history.back();
    setOpenAboutUs(false);
  };

  // spa profile photos
  const [spaProfilePhotosTrigger, setSpaProfilePhotosTrigger] = useState(false);
  const handleSpaProfilePhotosClose = () => {
    window.history.back();
    setSpaProfilePhotosTrigger(false);
  };
  const handleSpaProfilePhotosOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setSpaProfilePhotosTrigger(true);
  };

  // daily updates
  const [dailyUpdatesOpen, setDailyUpdatesOpen] = useState(false);
  const handleDailyUpdatesOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setDailyUpdatesOpen(true);
  };
  const handleDailyUpdatesClose = () => {
    window.history.back();
    setDailyUpdatesOpen(false);
  };

  // review get modal
  const [reviewGETModalOpen, setReviewGETModalOpen] = useState(false);
  const handleReviewGETModalOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setReviewGETModalOpen(true);
  };
  const handleReviewGETModalClose = () => {
    window.history.back();
    setReviewGETModalOpen(false);
  };

  // review post modal
  const [openReviewPost, setOpenReviewPost] = useState(false);
  const handleReviewPostOpen = () => {

    if (!authTokens) {
      handleSignInOpen();
      return;
    }

    window.history.pushState(null, null, window.location.href);
    setOpenReviewPost(true);
  };
  const handleReviewPostClose = () => {
    window.history.back();
    setOpenReviewPost(false);
  };

  // trakky promises
  const [trakkyPromisesOpen, setTrakkyPromisesOpen] = useState(false);
  const handleTrakkyPromisesOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setTrakkyPromisesOpen(true);
  };
  const handleTrakkyPromisesClose = () => {
    window.history.back();
    setTrakkyPromisesOpen(false);
  };

  // spa offers models
  const [spaOffersModal, setSpaOffersModal] = useState(false);
  const handleSpaOffersModalOpen = () => {
    window.history.pushState(null, null, window.location.href);
    setSpaOffersModal(true);
  };
  const handleSpaOffersModalClose = () => {
    window.history.back();
    setSpaOffersModal(false);
  };

  window.onpopstate = (e) => {
    if (spaProfilePhotosTrigger) {
      setSpaProfilePhotosTrigger(false);
    }
    if (dailyUpdatesOpen) {
      setDailyUpdatesOpen(false);
    }
    if (openReviewPost) {
      setOpenReviewPost(false);
    }
    if (reviewGETModalOpen) {
      setReviewGETModalOpen(false);
    }
    if (trakkyPromisesOpen) {
      setTrakkyPromisesOpen(false);
    }
    if (openAboutUs) {
      setOpenAboutUs(false);
    }
    if (spaOffersModal) {
      setSpaOffersModal(false);
    } 
    if (openSignIn) {
      setOpenSignIn(false);
    }
  };

  const fetchSpaOffers = async (id) => {
    let url = `https://backendapi.trakky.in/spas/spa-profile-page-offer/?spa=${id}`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (res.ok) {
        setSpaOffers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
const handleBookNowBtn = () => {
  if (!spa?.name || !spa?.mobile_number) {
    return;
  }

  const phoneNumber = `91${spa.mobile_number}`; // India code add if needed

  let link = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Can%20I%20know%20more%20about%20Offers%20%26%20spa%20massages%20of%20${encodeURIComponent(
    spa?.name
  )}%2C%20${encodeURIComponent(spa?.area)}%2C%20${encodeURIComponent(
    spa?.city
  )}%3F`;

  window.open(link, "_blank");
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

  const handleShare = () => {
    if (!navigator.share) {
      document.execCommand("copy", true, window.location.href);
      alert("Link copied to clipboard");
      return;
    }

    navigator
      .share({
        title: spa?.name || "Trakky",
        text: "Check out this spa",
        url: window.location.href,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  const handlelike = async (id) => {
    if (!authTokens || !id) {
      return;
    }

    const response = await fetch(
      "https://backendapi.trakky.in/spas/userfavorite/",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify({
          spa: id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        fetchUserFavorites();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledislike = async (id) => {
    let likeId = userFavorites?.find((item) => item.spa === id)?.id;

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
      .catch((err) => {
        console.log(err);
      });

    fetchUserFavorites();
  };

  const getSpaBySpaSlug = async (slug) => {
    let url = `https://backendapi.trakky.in/spas/?slug=${slug}&verified=true`;

    setLoadingState(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setSpa(data.results[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const handleSubmitUserName = async (e) => {
    e.preventDefault();

    setNameUpdateLoading(true);

    if (!userNameOfUser) {
      toast.error("Please enter your name.");
      setNameUpdateLoading(false);
      return;
    }

    if (!user) {
      toast.error("User not found. Please login.");
      setNameUpdateLoading(false);
      return;
    }

    let url = `https://backendapi.trakky.in/spas/spauser/${user?.user_id}/`;

    try {
      let res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify({
          name: userNameOfUser,
        }),
      });

      if (res.ok) {
        setUserNameOfUser("");
        setUserNameChangeModal(false);
        toast.success("Name updated successfully.", {
          duration: 2000,
        });
        setNameUpdateLoading(false);
        getReviews(spa?.id);
        fetchUserData();
      } else {
        toast.error("Failed to update Name. Please try again.");
        setNameUpdateLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update Name. Please try again.");
      setNameUpdateLoading(false);
    }
  };

  let [spaReviews, setSpaReviews] = useState([]);

  const getReviews = async (id) => {
    if (!id) {
      return;
    }

    let url = `https://backendapi.trakky.in/spas/review/?spa=${id}`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (response.ok) {
        setSpaReviews(data);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSpaTimings = async () => {
    let weeklytiming = spa?.spa_timings;

    if (!weeklytiming) {
      return;
    }

    let today = await moment().format("dddd").toLowerCase();

    console.log(today);

    if (weeklytiming[today] === "closed") {
      console.log("Closed today");
      return "Closed today";
    }

    let openTime = weeklytiming[today]?.open_time;
    let closeTime = weeklytiming[today]?.close_time;

    console.log(openTime, closeTime);

    // format time
    let formatedOpenTime = formateTime(openTime);
    let formatedCloseTime = formateTime(closeTime);

    console.log(formatedOpenTime, formatedCloseTime);

    return `Opens ${formatedOpenTime} - ${formatedCloseTime}`;
  };

  const formateTime = (time) => {
    if (!time) {
      return;
    }

    let [hour, minute, second] = time.split(":");

    let formatedTime = "";

    if (parseInt(hour) > 12) {
      formatedTime = `${parseInt(hour) - 12}:${minute} PM`;
    } else {
      formatedTime = `${parseInt(hour)}:${minute} AM`;
    }
    if (parseInt(hour) === 12) {
      formatedTime = `${hour}:${minute} PM`;
    }
    if (parseInt(hour) === 0) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(hour) === 24) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(minute) === 0) {
      formatedTime =
        parseInt(hour) > 12
          ? `${parseInt(hour) - 12} PM`
          : parseInt(hour) === 0
          ? `12 AM`
          : `${parseInt(hour)} AM`;
    }

    return formatedTime;
  };

  useEffect(() => {
    getSpaBySpaSlug(slug);
  }, [slug]);

  useEffect(() => {
    if (spa?.id) {
      fetchSpaOffers(spa?.id);
      getReviews(spa?.id);
    }

    if (spa?.services) {
      if (spa?.services.length > 0) {
        setSectionHasData((prev) => ({
          ...prev,
          massagesSection: true,
        }));
      }
    }
  }, [spa]);

  return loadingState ? (
    <div className=" h-[100vh] w-full flex items-center justify-center">
      <img src={trakkyLoading} className=" h-60 w-auto object-contain" alt="trakky loading" />
    </div>
  ) : (
    <div>
      {/* <Toaster /> */}
      <ProfilepageHeader handleOpenLogin={handleSignInOpen} />
      {window.innerWidth < 1024 ? (
        <>
          <HeroMobile
            spaData={spa}
            handleSpaTimingOpen={() => {
              setOpenSpaTiming(true);
            }}
            handleTrakkyPromisesOpen={handleTrakkyPromisesOpen}
            handleAboutUsOpen={handleAboutUsOpen}
            handleSpaProfilePhotosOpen={handleSpaProfilePhotosOpen}
            handleShare={handleShare}
            handledislike={handledislike}
            handlelike={handlelike}
            handleSignInOpen={handleSignInOpen}
            log_adder={log_adder}
            handleBookNowBtn={handleBookNowBtn}
            handleSpaOffersModalOpen={handleSpaOffersModalOpen}
            handleSpaOffersModalClose={handleSpaOffersModalClose}
            spaOffers={spaOffers}
            spaOffersModal={spaOffersModal}
            setOfferModalData={setOfferModalData}
            getSpaTimings={getSpaTimings}
            spaReviews={spaReviews}
          />
          <div className=" border-b-[8px] border-slate-50 w-full"></div>
          {spa?.services?.length > 3 && (
            <div className=" px-6 pt-6 pb-1 ">
              <TopServiceNavigation
                serviceData={spa?.services}
                setTargetServiceId={setTargetServiceId}
                setSectionHasData={setSectionHasData}
              />
            </div>
          )}
          {sectionHasData?.bestSellerSection && (
            <div className=" px-4 pt-4 pb-1">
              <BestSellerMassages
                spa={spa}
                setSectionHasData={setSectionHasData}
              />
            </div>
          )}
          {sectionHasData?.bestSellerSection && (
            <div className=" border-b-[8px] border-slate-50 w-full"></div>
          )}
          <div className=" px-4 pt-4 pb-1">
            <Massages spa={spa} targetServiceId={targetServiceId} />
          </div>

          <div className=" border-b-[8px] mt-2 border-slate-50 w-full"></div>

          {sectionHasData?.membershipSection && (
            <div className=" px-4 pt-4 pb-1">
              <Membership spa={spa} setSectionHasData={setSectionHasData} />
            </div>
          )}
          {sectionHasData?.membershipSection && (
            <div className=" border-b-[8px] border-slate-50 w-full my-2"></div>
          )}
          <div className=" pl-3 lg:pl-10">
            <DailyUpdates
              spaData={spa}
              open={dailyUpdatesOpen}
              handleOpen={handleDailyUpdatesOpen}
              handleClose={handleDailyUpdatesClose}
            />
          </div>
          <div className=" p-4">
            <div className=" w-full  rounded-xl shadow-[0_0_5px_4px_#00000010] p-3">
              <Reviews
                spa={spa}
                handleReviewGETModalOpen={handleReviewGETModalOpen}
                spaReviews={spaReviews}
                handleReviewPostOpen={handleReviewPostOpen}
                getReviews={getReviews}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <WindowHeroSection
            spaData={spa}
            handleSpaProfilePhotosOpen={handleSpaProfilePhotosOpen}
            handleSpaTimingOpen={() => {
              setOpenSpaTiming(true);
            }}
            handleShare={handleShare}
            handledislike={handledislike}
            handlelike={handlelike}
            handleSignInOpen={handleSignInOpen}
            spaReviews={spaReviews}
            getSpaTimings={getSpaTimings}
          />

          <div className=" mx-auto w-[min(100%,500px)]">
            <div className=" mx-4 grid grid-cols-3 max-w-[500px] gap-2 h-12 mt-6 mb-3 ">
              <a
                href={`tel:${spa?.mobile_number}`}
                className=" text-lg bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-lg w-full h-full text-center leading-[48px]"
                onClick={() => {
                  log_adder(spa?.name, "call_now");
                }}
              >
                Call now
              </a>
              <button
                className=" text-lg bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-lg"
                onClick={() => {
                  handleBookNowBtn();
                }}
              >
                Book now
              </button>
              {spa?.gmap_link ? (
                <a
                  href={spa?.gmap_link}
                  target="_blank"
                  className=" text-lg bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-lg w-full h-full text-center leading-[48px]"
                >
                  Directions
                </a>
              ) : (
                <button className=" text-lg bg-gradient-to-r from-[#9E70FF] to-[#512DC8] rounded-lg text-white rounded-r-lg leading-[48px]">
                  Directions
                </button>
              )}
            </div>
          </div>

          <div className=" px-10 grid grid-cols-12 gap-4 mt-5">
            <div className=" h-full w-full col-span-3 ">
              <div className=" w-full h-auto  border border-gray-300 rounded-xl sticky top-1 p-5">
                <TopServiceNavigation
                  serviceData={spa?.services}
                  setTargetServiceId={setTargetServiceId}
                  setSectionHasData={setSectionHasData}
                />
              </div>
            </div>
            <div className=" border border-gray-300 rounded-xl col-span-5 p-5">
              <div className="">
                <BestSellerMassages
                  spa={spa}
                  setSectionHasData={setSectionHasData}
                />
              </div>
              {sectionHasData?.bestSellerSection && (
                <div className=" border-t-[2px] border-slate-300 border-dashed mt-4 mb-4 w-full" />
              )}
              <div>
                <Massages spa={spa} targetServiceId={targetServiceId} />
              </div>

              {sectionHasData?.membershipSection && (
                <div className=" border-t-[2px] border-slate-300 border-dashed mt-4 mb-4 w-full" />
              )}

              {sectionHasData?.membershipSection && (
                <div className=" pt-2">
                  <Membership spa={spa} setSectionHasData={setSectionHasData} />
                </div>
              )}
            </div>
            <div className="h-full w-full col-span-4 flex flex-col gap-4">
              {spaOffers?.length > 0 && (
                <div className=" w-full h-auto  border border-gray-300 rounded-xl p-5">
                  <div className=" flex flex-col gap-5">
                    {spaOffers
                      .slice(0, desktopVisibleOffers)
                      ?.map((item, index) => {
                        return (
                          <div
                            className={`w-full shrink-0 h-16 rounded-xl flex gap-3 snap-start cursor-pointer`}
                            onClick={() => {
                              setOfferModalData(item);
                              handleSpaOffersModalOpen();
                            }}
                          >
                            <div className=" w-16 h-16 aspect-square shrink-0 rounded-xl bg-slate-100 flex items-center justify-center ">
                              <img
                                src={OfferPng}
                                alt="offer"
                                className=" h-10 w-10 shrink-0 aspect-square object-cover rounded-md"
                              />
                            </div>
                            <div className=" h-16 gap-1 flex flex-col grow justify-between items-start py-2">
                              <h3 className=" text-[17px] text-gray-800 font-medium leading-6 line-clamp-1">
                                {item?.offer_name}
                              </h3>
                              <span className=" text-[15px] text-gray-500 font-light leading-4 line-clamp-1">
                                Get discount now
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    {spaOffers.length > desktopVisibleOffers ? (
                      <div
                        className=" text-base text-[#512DC8] flex gap-1 items-center cursor-pointer transition-all "
                        onClick={() => {
                          setDesktopVisibleOffers(spaOffers.length);
                        }}
                      >
                        See more offers
                        <KeyboardArrowDown className=" text-[#512DC8]" />
                      </div>
                    ) : (
                      spaOffers.length > 1 && (
                        <div
                          className=" text-base text-[#512DC8] flex gap-1 items-center cursor-pointer transition"
                          onClick={() => {
                            setDesktopVisibleOffers(1);
                          }}
                        >
                          See less offers
                          <KeyboardArrowUp className=" text-[#512DC8]" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              <div className=" w-full h-auto  border border-gray-300 rounded-xl p-5">
                <div className=" TPM-trakky-promises w-full  bg-white !P-0 !m-0">
                  <div className=" w-full h-auto flex gap-3">
                    <div className=" flex flex-col gap-3 grow">
                      <h2 className=" text-xl font-semibold">
                        Trakky Promises
                      </h2>
                      {spa?.promise_description ? (
                        <div
                          className=" text-slate-600"
                          dangerouslySetInnerHTML={{
                            __html: spa?.promise_description,
                          }}
                        ></div>
                      ) : (
                        <div className=" text-slate-600">
                          No promises available
                        </div>
                      )}
                    </div>
                    <div className=" h-16 w-16 shrink-0 rounded-full">
                      <img
                        src={PromisesLogo}
                        className=" h-16 shrink-0 aspect-square rounded-full object-cover"
                        alt="promise logo"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full h-auto  border border-gray-300 rounded-xl sticky top-1 p-5">
                <Reviews
                  spa={spa}
                  handleReviewGETModalOpen={handleReviewGETModalOpen}
                  spaReviews={spaReviews}
                  handleReviewPostOpen={handleReviewPostOpen}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {window.innerWidth > 1024 && (
        <>
          <div className=" border-b-[8px] border-slate-50 w-full my-2"></div>
          <div className=" pl-3 lg:pl-10">
            <DailyUpdates
              spaData={spa}
              open={dailyUpdatesOpen}
              handleOpen={handleDailyUpdatesOpen}
              handleClose={handleDailyUpdatesClose}
            />
          </div>
        </>
      )}

      {window?.innerWidth > 1024 && (
        <div className=" px-10 mt-5 mb-3">
          <h1 className=" text-xl py-1 font-semibold">About us</h1>
          <p>{spa?.about_us}</p>
        </div>
      )}

      <div className="">
        <FooterN />
      </div>

      <Modal
        open={openSpaTiming}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SpaTimingModal
          spa_timings={spa?.spa_timings}
          handleSpaTimingClose={() => {
            setOpenSpaTiming(false);
          }}
        />
      </Modal>

      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {isMobile ? (
          <Box
            sx={{
              ...style,
              bottom: 0,
              top: "auto",
              left: 0,
              right: 0,
              width: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              transform: "none",
              outline: "none",
            }}
          >
            <Signup fun={handleSignInClose} />
          </Box>
        ) : (
          <Box sx={{ ...style, outline: "none" }}>
            <Signup fun={handleSignInClose} />
          </Box>
        )}
      </Modal>

      <Modal
        open={openAboutUs}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AboutUsModal spa={spa} handleAboutUsClose={handleAboutUsClose} />
      </Modal>

      <Modal
        open={spaProfilePhotosTrigger}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Gallery2 spa={spa} onClose={handleSpaProfilePhotosClose} />
      </Modal>

      <Modal
        open={openReviewPost}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReviewPostModal
          onClose={handleReviewPostClose}
          spa={spa}
          setUserNameChangeModal={setUserNameChangeModal}
          getReviews={getReviews}
        />
      </Modal>

      <Modal
        open={reviewGETModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ReviewGETModal
          onClose={handleReviewGETModalClose}
          handleReviewPostOpen={handleReviewPostOpen}
          spa={spa}
          spaReviews={spaReviews}
        />
      </Modal>

      <Modal
        open={trakkyPromisesOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 400,
          },
        }}
      >
        <TrakkyPromisesModal onClose={handleTrakkyPromisesClose} spa={spa} />
      </Modal>

      <Modal open={spaOffersModal}>
        <OfferSpaModal
          open={spaOffersModal}
          data={offerModalData}
          handleClose={() => {
            handleSpaOffersModalClose();
            setOfferModalData({});
          }}
          spa={spa}
        />
      </Modal>

      <Modal
        open={userNameChangeModal}
        // onClose={() => setUserNameChangeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className=" bg-white w-4/5 max-w-[400px] h-auto rounded-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
          <div className="flex justify-between flex-col gap-3 relative">
            <div className=" italic font-medium text-sm w-full text-red-600 flex gap-2 items-center">
              <InfoSharp
                sx={{
                  height: "20px",
                  width: "20px",
                }}
              />
              Your Name is mandatory to submit score
            </div>
            <label className=" text-lg font-semibold py-2" htmlFor="user-name">
              Enter Your Name
            </label>
            <button
              onClick={() => {
                setUserNameChangeModal(false);
              }}
              className="absolute -top-16 bg-white rounded-full right-1 p-1"
            >
              <Close />
            </button>
          </div>
          <div className="flex justify-between items-center flex-col gap-3">
            <input
              type="text"
              value={userNameOfUser}
              onChange={(e) => {
                setUserNameOfUser(e.target.value);
              }}
              id="user-name"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-[#532FCA]"
              placeholder="Your Name here"
            />
            <button
              onClick={(e) => {
                handleSubmitUserName(e);
              }}
              className={`w-full bg-[#532FCA] text-white p-2 rounded-lg ${
                nameUpdateLoading && "opacity-70"
              }`}
              disabled={nameUpdateLoading}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NProfilePage;

const HeroMobile = ({
  spaData,
  handleSpaTimingOpen,
  handleAboutUsOpen,
  handleTrakkyPromisesOpen,
  handleSpaProfilePhotosOpen,
  handleShare,
  handledislike,
  handlelike,
  handleSignInOpen,
  log_adder,
  handleSpaOffersModalOpen,
  setOfferModalData,
  handleBookNowBtn,
  spaOffersModal,
  getSpaTimings,
  spaOffers,
  spaReviews,
}) => {
  const { userFavorites, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [imagesUrl, setImagesUrl] = useState([]);

  const [activeIndexSwiper, setActiveIndexSwiper] = useState(0);

  const [timing, setTiming] = useState("");

  useEffect(() => {
    if (spaData?.name) {
      setImagesUrl([
        spaData?.main_image,
        ...spaData?.mul_images.map((url) => url?.image),
      ]);
    }
  }, [spaData]);

  useEffect(() => {
    getSpaTimings().then((res) => {
      setTiming(res);
    });

    console.log("timing", timing);
  }, [getSpaTimings]);

  return (
    <>
      <div className=" flex flex-col w-full h-auto pb-4">
        <div className=" relative w-full aspect-video overflow-hidden shadow-[0_2px_3px] shadow-gray-300  h-auto">
          {imagesUrl?.length > 0 && (
            <Swiper
              slidesPerView={1}
              navigation
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              style={{
                height: "100%",
                width: "100%",
              }}
              // modules={[Pagination , Navigation]}
              className=" NProfileSwiper"
              onSlideChange={(swiper) => {
                setActiveIndexSwiper(swiper.realIndex);
              }}
            >
              {imagesUrl?.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt="spa image"
                    className=" h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div
            className="N-spa-p-main-info-icon"
            onClick={() => {
              handleAboutUsOpen();
            }}
          >
            <img src={Info_svg} alt="information" />
          </div>
          <div className="N-spa-p-more-photo-btn">
            <button onClick={handleSpaProfilePhotosOpen}>
              <img src={Grids} alt="grid" />
              more photos
            </button>
          </div>
          <div className=" h-[6px] flex items-center justify-center gap-1 w-full px-3 flex-nowrap absolute bottom-1 z-20">
            {Array.from({ length: imagesUrl?.length }, (_, index) => (
              <div
                className={`bg-[#ffffff30] h-[3px] w-full grow rounded-md transition-all relative`}
              >
                <div
                  className={` absolute top-0 left-0 grow h-[3px] rounded-md bg-white ${
                    activeIndexSwiper > index ? "w-full" : "w-0"
                  }`}
                ></div>
                {
                  <div
                    className={`absolute top-0 left-0 h-[3px] rounded-md bg-white  ${
                      activeIndexSwiper === index
                        ? "progress-bar-animation"
                        : ""
                    }`}
                  ></div>
                }
              </div>
            ))}
          </div>
        </div>
        <div className=" px-4 py-2 flex flex-col gap-1 items-start justify-center">
          <div className=" flex items-center justify-between w-full">
            <span
              className=" text-[13px] text-gray-700 font-normal"
              onClick={handleSpaTimingOpen}
            >
              {/* Opens {formateTime(spaData?.open_time)} -{" "}
              {formateTime(spaData?.close_time)} */}
              {timing}
            </span>
            <div className=" flex gap-2 h-7 justify-center items-center">
              <button
                className="  h-7 w-7 flex justify-center items-center"
                onClick={handleShare}
              >
                <img src={ShareIcon} className=" h-6 object-cover" alt="share" />
              </button>
              <button className=" h-7 w-7 flex justify-center items-center">
                {userFavorites?.some((item) => {
                  let res = item?.spa === spaData?.id;
                  return res;
                }) ? (
                  <FcLike
                    className=" h-7 w-7 text-[#62656a] -mt-[2px]"
                    onClick={() => {
                      user ? handledislike(spaData?.id) : handleSignInOpen();
                    }}
                  />
                ) : (
                  <MdFavoriteBorder
                    className=" h-7 w-7 text-[#62656a] -mt-[2px]"
                    onClick={() => {
                      user ? handlelike(spaData?.id) : handleSignInOpen();
                    }}
                  />
                )}
              </button>
            </div>
          </div>
          <div className=" w-full">
            <h1 className=" text-[20px] leading-6 text-gray-800 font-semibold">
              {spaData?.name}
            </h1>
          </div>
          <div className=" w-full">
            <span className=" text-[15px] text-gray-700 font-light">
              {spaData?.area}, {spaData?.city}
            </span>
          </div>
          <div className=" w-full">
            <span className=" text-[14px] text-gray-700 font-light">
              ₹ {spaData?.price} Onwards
            </span>
          </div>
          <div className="w-full flex gap-1 text-slate-600 text-sm pt-2">
            <img src={ReviewSvg} alt="review" />
            <span>{spaData?.avg_review?.toFixed(2)}</span>
            <span>({spaReviews?.length} reviews)</span>
          </div>

          <div
            className=" w-full bg-gray-100 rounded-lg h-14 mt-4 flex gap-2 px-3 items-center"
            onClick={handleTrakkyPromisesOpen}
          >
            <div className=" aspect-square h-9 border border-solid rounded-full bg-gray-200">
              <img src={TrakkyPromises} alt="trakky promises" className="" />
            </div>
            <div className=" text-slate-800 text-sm font-normal grow">
              Trakky Promises
            </div>
            <div className=" h-6 w-6 flex items-center">
              <button className=" h-6 w-6 flex items-center justify-center">
                <img src={rightArrow} alt="arrow" />
              </button>
            </div>
          </div>
        </div>

        <div className=" ml-4 w-[calc(100% - 16px)] flex gap-4 overflow-scroll snap-x snap-mandatory">
          {spaOffers?.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setOfferModalData(item);
                  handleSpaOffersModalOpen();
                }}
                className={`${
                  spaOffers?.length != 1
                    ? "w-[min(320px,100%)]"
                    : "w-[calc(100%-16px)]"
                } shrink-0 h-19 border border-solid rounded-xl mt-3 mb-3 p-3 flex gap-3 snap-start last:mr-4`}
              >
                <div className=" w-6">
                  <img
                    src={OfferPng}
                    alt="offer"
                    className=" mt-1 h-6 w-6 object-cover"
                  />
                </div>
                <div className=" h-13 gap-[2px] flex flex-col grow justify-between items-start">
                  <h3 className=" text-[17px] text-gray-800 font-medium leading-6 line-clamp-1">
                    {item?.offer_name}
                  </h3>
                  <span className=" text-[16px] text-gray-500 font-light leading-6 line-clamp-1">
                    Get discount now
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className=" mx-auto w-[min(100%,400px)]">
          <div className=" mx-4 grid grid-cols-3 max-w-[400px] gap-[2px] h-10 mt-3 ">
            <a
              href={`tel:${spaData?.mobile_number}`}
              className=" text-sm bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-l-lg w-full h-full text-center leading-10"
              onClick={() => {
                log_adder(spaData?.name, "call_now");
              }}
            >
              Call now
            </a>
            <button
              className=" text-sm bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white"
              onClick={() => {
                handleBookNowBtn();
              }}
            >
              Book now
            </button>
            {spaData?.gmap_link ? (
              <a
                href={spaData?.gmap_link}
                target="_blank"
                className=" text-sm bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-r-lg w-full h-full text-center leading-10"
              >
                Directions
              </a>
            ) : (
              <button className=" text-sm bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white rounded-r-lg ">
                Directions
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const WindowHeroSection = ({
  spaData,
  handleSpaProfilePhotosOpen,
  handleSpaTimingOpen,
  handlelike,
  handledislike,
  handleShare,
  handleSignInOpen,
  spaReviews,
  getSpaTimings,
}) => {
  const { user, userFavorites } = useContext(AuthContext);

  const [imagesUrl, setImagesUrl] = useState([]);
  const swiperRef = useRef(null);

  const [activeIndexSwiper, setActiveIndexSwiper] = useState(null);

  const [timing, setTiming] = useState("");

  const formateTime = (time) => {
    if (!time) {
      return;
    }

    let [hour, minute, second] = time.split(":");

    let formatedTime = "";

    if (parseInt(hour) > 12) {
      formatedTime = `${parseInt(hour) - 12}:${minute} PM`;
    } else {
      formatedTime = `${parseInt(hour)}:${minute} AM`;
    }
    if (parseInt(hour) === 12) {
      formatedTime = `${hour}:${minute} PM`;
    }
    if (parseInt(hour) === 0) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(hour) === 24) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(minute) === 0) {
      formatedTime =
        parseInt(hour) > 12
          ? `${parseInt(hour) - 12} PM`
          : parseInt(hour) === 0
          ? `12 AM`
          : `${parseInt(hour)} AM`;
    }

    return formatedTime;
  };

  useEffect(() => {
    if (spaData?.name) {
      setImagesUrl([
        spaData?.main_image,
        ...spaData?.mul_images.map((url) => url?.image),
      ]);
    }
    setActiveIndexSwiper(0);
  }, [spaData]);

  useEffect(() => {
    getSpaTimings().then((res) => {
      setTiming(res);
    });

    console.log("timing", timing);
  }, [getSpaTimings]);

  return (
    <div className=" relative pt-3">
      <div className=" absolute h-4/5 w-full left-0 top-0 bg-[#F6F1FF] rounded-b-[40px] -z-10"></div>
      <div className=" w-[75%] mx-auto aspect-[32/15] border border-slate-200 rounded-xl overflow-hidden bg-slate-100 relative">
        <div className=" absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-[#00000000] to-[#000000e1] z-10 flex flex-col justify-end py-5 ">
          <div className=" flex justify-between gap-2 px-7">
            <div className=" flex flex-col gap-1 pb-3 items-start justify-center text-white">
              <div
                className=" font-light !cursor-pointer"
                onClick={handleSpaTimingOpen}
              >
                {timing}
              </div>
              <h1 className=" text-[28px] leading-8 line-clamp-1 font-semibold">
                {spaData?.name}
              </h1>
              <div className=" w-full">
                <span className=" text-[18px] text-white font-light">
                  {spaData?.area}, {spaData?.city}
                </span>
              </div>
              <div className=" w-full">
                <span className=" text-[16px] text-white font-light">
                  ₹ {spaData?.price} Onwards
                </span>
              </div>
              <div className=" flex gap-2 items-center font-light text-lg">
                <img src={ReviewSvg} className=" h-5 w-5" alt="review" />
                <span>{spaData?.avg_review?.toFixed(1) || "NA"}</span>
                <span>({spaReviews?.length} reviews)</span>
              </div>
            </div>
            <div className=" flex flex-col items-end justify-end select-none">
              <div className="N-spa-p-more-photo-btn !static !top-auto !left-auto ">
                <button onClick={handleSpaProfilePhotosOpen}>
                  <img src={Grids} alt="grid" />
                  More Photos
                </button>
              </div>
              <div className=" flex gap-4 py-3 justify-end items-center">
                {spaData?.facilities &&
                  spaData.facilities.map((data, index) => {
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
                          <div className="">
                            <img
                              className=" h-9 w-9 invert "
                              src={require(`./../../Assets/images/icons/${iconNumber}.png`)}
                              alt="facility icon"
                            />
                          </div>
                        </li>
                      )
                    );
                  })}
              </div>
            </div>
          </div>

          <div className=" h-2 flex items-center justify-center gap-2 w-full px-7 flex-nowrap">
            {Array.from({ length: imagesUrl?.length }, (_, index) => (
              <div
                className={`bg-[#ffffff30] h-1 w-full grow rounded-md transition-all relative`}
              >
                <div
                  className={` absolute top-0 left-0 grow h-1 rounded-md bg-white ${
                    activeIndexSwiper > index ? "w-full" : "w-0"
                  }`}
                ></div>
                {
                  <div
                    className={`absolute top-0 left-0 h-1 rounded-md bg-white  ${
                      activeIndexSwiper === index
                        ? "progress-bar-animation"
                        : ""
                    }`}
                  ></div>
                }
              </div>
            ))}
          </div>
        </div>
        <div className=" absolute z-10 flex gap-2 items-center right-4 top-4 ">
          <div
            className=" h-9 w-9 rounded-full flex justify-center items-center bg-[#00000030] text-white cursor-pointer"
            onClick={handleShare}
          >
            <img
              src={ShareWhitePng}
              alt="share"
              className=" h-5 pr-[3px] object-cover"
            />
          </div>

          {userFavorites?.some((item) => {
            console.log(item?.spa, spaData?.id);
            let res = item?.spa === spaData?.id;
            return res;
          }) ? (
            <div className=" h-9 w-9 rounded-full  text-white flex items-center justify-center">
              <FcLike
                className=" !h-7 w-7 text-[white] cursor-pointer"
                onClick={() => {
                  user ? handledislike(spaData?.id) : handleSignInOpen();
                }}
              />
            </div>
          ) : (
            <div className=" h-9 w-9 rounded-full bg-[#00000030] text-white flex items-center justify-center">
              <MdFavoriteBorder
                className=" !h-7 w-7 text-[white] cursor-pointer"
                onClick={() => {
                  user ? handlelike(spaData?.id) : handleSignInOpen();
                }}
              />
            </div>
          )}
        </div>
        {imagesUrl?.length > 0 && (
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            navigation
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            style={{
              height: "100%",
              width: "100%",
            }}
            className=" NProfileSwiper"
            onSlideChange={(swiper) => {
              setActiveIndexSwiper(swiper.realIndex);
            }}
          >
            {imagesUrl?.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt="spa image"
                  className=" h-full w-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

const TopServiceNavigation = ({
  serviceData,
  setTargetServiceId,
  setSectionHasData,
}) => {
  let visibleItem =
    serviceData?.length >= 8 ? 6 : serviceData?.length >= 4 ? 3 : 0;
  let sortedServiceData = serviceData?.sort((a, b) => {
    let preferableAprice = a?.discount || a?.price;
    let preferableBprice = b?.discount || b?.price;

    return preferableBprice - preferableAprice;
  });

  useEffect(() => {
    if (visibleItem > 0) {
      setSectionHasData((prev) => ({ ...prev, topNavSection: true }));
    } else {
      setSectionHasData((prev) => ({ ...prev, topNavSection: false }));
    }
  }, [visibleItem]);

  return (
    visibleItem > 0 && (
      <div className=" flex flex-col gap-2 h-fit">
        {window.innerWidth > 1024 && (
          <div className=" text-sm text-gray-500 flex gap-2 py-2 items-center">
            <span className=" min-w-max font-medium">Select a Service </span>
            <span className=" h-[1px] w-full grow shrink block bg-gray-300"></span>
          </div>
        )}
        <div className="  w-full h-auto grid grid-cols-3 gap-4">
          {sortedServiceData?.slice(0, visibleItem)?.map((item, index) => {
            return (
              <div
                className=" flex flex-col gap-2 h-fit"
                onClick={() => {
                  setTargetServiceId({ id: item?.id });
                }}
              >
                <div className=" w-full aspect-square bg-gray-50 rounded-lg">
                  {item?.service_image && (
                    <img
                      src={item?.service_image}
                      className=" h-full rounded-lg"
                      alt="service"
                    />
                  )}
                </div>
                <div className="text-gray-800 text-sm text-center font-medium line-clamp-2 px-[3px]">
                  {item?.service_names}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

const BestSellerMassages = ({ spa, setSectionHasData }) => {
  const [bestSellerMassagesData, setBestSellerMassagesData] = useState([]);
  const params = useParams();

  const [loadingState, setLoadingState] = useState(true);

  const getBestSellerMassages = async (slug) => {
    setLoadingState(true);

    if (!slug) {
      return;
    }

    let url = `https://backendapi.trakky.in/spas/best-sellar-massage/?slug=${slug}`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setBestSellerMassagesData(data);
        if (data?.length > 0) {
          setSectionHasData((prev) => ({ ...prev, bestSellerSection: true }));
        } else {
          setSectionHasData((prev) => ({ ...prev, bestSellerSection: false }));
        }
      }
    } catch (error) {
      console.log(error);
      setSectionHasData((prev) => ({ ...prev, bestSellerSection: false }));
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    getBestSellerMassages(params?.slug);
  }, [params?.slug]);

  const handleAddBtn = (item) => {
    let message = `I want to book the bestseller ${item?.name} available at ${spa?.name} in ${spa?.area}, ${spa?.city}.
    
As it is mentioned, it comes with starting price of ${item.price} rupees.
    
Please book it for me.`;

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;

    window.open(link, "_blank");
  };

  return (
    <div className=" w-full">
      {(loadingState || bestSellerMassagesData?.length > 0) && (
        <h2 className=" text-xl py-1 font-semibold">Bestseller massages</h2>
      )}
      <div className=" BSM-N-container flex flex-col gap-2">
        {bestSellerMassagesData?.map((item, index) => {
          return (
            <div className=" flex flex-col gap-2 mt-2 mb-2">
              <div className=" w-full aspect-video bg-gray-100 rounded-xl">
                <img
                  src={item?.image}
                  className=" w-full aspect-video rounded-xl"
                  alt="best seller massages"
                />
              </div>
              <div className=" flex flex-col gap-2 mt-2 pl-1 pr-[2px] pb-2 border-b-2 border-gray-50 border-dashed">
                <div className=" flex gap-2 justify-between items-start">
                  <h2 className=" text-gray-800 text-[17px] font-semibold grow leading-[22px] line-clamp-2">
                    {item?.name}
                  </h2>
                  <button
                    className=" min-w-[80px] text-[#512DC8] rounded-md shadow-[0_2px_4px_#00000020] h-9"
                    onClick={() => {
                      handleAddBtn(item);
                    }}
                  >
                    Book now
                  </button>
                </div>
                <div className=" text-sm">
                  Start at <span className=" font-medium">₹{item?.price}</span>
                </div>
              </div>
              <div className=" flex flex-col gap-1 items-start pl-1 pr-[2px]">
                <div
                  className=" text-[14px] text-gray-700"
                  dangerouslySetInnerHTML={{ __html: item?.description }}
                ></div>
                {/* <button className=" text-blue-800 underline text-[15px]">
                  Show details
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Massages = ({ spa, targetServiceId }) => {
  return (
    <div className=" w-full">
      <h2 className=" text-xl py-1 font-semibold">Massages</h2>
      <div className=" flex flex-col gap-2">
        <Services
          serviceData={spa?.services}
          spa={spa}
          targetServiceId={targetServiceId}
        />
      </div>
    </div>
  );
};

const Membership = ({ spa, setSectionHasData }) => {
  return (
    <div className=" w-full">
      <h2 className=" text-xl py-1 font-semibold">Membership</h2>
      <div className=" flex flex-col gap-2">
        <MembershipComponent spa={spa} setSectionHasData={setSectionHasData} />
      </div>
    </div>
  );
};

const Reviews = ({
  handleReviewPostOpen,
  handleReviewGETModalOpen,
  spaReviews,
  getReviews,
  spa,
}) => {
  let filterReview = spaReviews?.filter((item, index) => {
    return item?.review !== null;
  });

  return (
    <div className=" w-full">
      <div className=" w-full flex justify-between items-center">
        <div className=" flex gap-1 items-center">
          <img src={NewReviewSvg} className=" h-4" alt="review" />
          <span className=" text-lg font-semibold">
            {spa?.avg_review?.toFixed(1) || 0}{" "}
          </span>
          <span className=" h-[2px] aspect-square rounded-full bg-black"></span>
          <span className=" font-base text-slate-500">
            {spaReviews?.length || "No"} reviews
          </span>
        </div>
        <button
          className=" border-none outline-none flex items-center gap-2 rounded-md px-[10px] py-[6px] bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white text-center"
          onClick={handleReviewPostOpen}
        >
          <img src={ReviewPen} alt="review pen" className=" h-3 w-3" />
          Write a review
        </button>
      </div>
      <div className=" p-1 mt-2">
        {filterReview?.slice(0, 4)?.map((item, index) => {
          return (
            <div className=" flex flex-col gap-2 mt-3 pb-3 border-b border-slate-200 last:!border-none">
              <div className="">
                <div className=" text-base font-semibold">
                  {item?.name || "Anonymous"}
                </div>
                <div className=" text-slate-500 font-normal text-sm">
                  {/* December 2021 */}
                  {moment(item?.created_at)?.format("MMM DD, YYYY")}
                </div>
              </div>
              <div className=" line-clamp-3 text-[15px]">{item?.review}</div>
            </div>
          );
        })}
      </div>
      {spaReviews?.length > 0 && (
        <button
          className=" outline outline-slate-600 shadow-md rounded-md mb-1 py-1 px-2 text-sm text-slate-600 outline-1	"
          onClick={handleReviewGETModalOpen}
        >
          show all {spaReviews?.length} reviews
        </button>
      )}
    </div>
  );
};
