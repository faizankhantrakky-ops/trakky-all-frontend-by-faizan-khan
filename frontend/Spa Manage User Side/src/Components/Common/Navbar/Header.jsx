import React, { useEffect, useRef, useContext } from "react";
import "./header.css";
import Avtar from "@mui/material/Avatar";
import Trakky_logo from "../../../Assets/images/logos/Trakky logo purple.png";
import Down_arrow from "../../../Assets/images/icons/downArrow.png";
import Search_icon from "../../../Assets/images/icons/search_gray.svg";
import { Modal, Box } from "@mui/material";
import { useState } from "react";
import Signup from "./SignUp2/Signup";
import Menu from "@mui/material/Menu";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import profile from "./profile.png";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { ListItemIcon } from "@mui/material";
import { Logout } from "@mui/icons-material";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import authcontext from "../../../context/Auth";
import ReviewIcon from "../../../Assets/images/icons/rating_svg.svg";
import CityAreaModal from "./CityAreaModal";
import { capitalizeAndFormat } from "../../functions/generalFun";
import toast, { Toaster } from "react-hot-toast";

import BestOfferIcon from "../../../Assets/images/icons/discount_coupen_svg.svg";
import TrustedIcon from "../../../Assets/images/icons/trusted_icon.svg";

import OfferPercentSvg from "../../../Assets/images/icons/offer_percent_svg.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const Header = ({ isCityPage }) => {
  const { user, authTokens, logoutUser, userData } = useContext(authcontext);

  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const [area, setArea] = useState(params?.area);

  const abortControllerRef = useRef(new AbortController());

  const [openSignIn, setOpenSignIn] = useState(false);
  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [searchResultList, setSearchResultList] = useState([]);
  const [searchFunLoading, setSearchFunLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [focus, setFocus] = useState(false);

  const [cityAreaOpen, setCityAreaOpen] = useState(false);

  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      handleSignInOpen();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSearchResult = async (text) => {
    if (text.trim() === "") {
      setSearchResultList([]);

      return;
    }

    let url = `https://backendapi.trakky.in/spas/search/?query=${text}&verified=true`;

    abortControllerRef.current.abort();

    setSearchFunLoading(true);

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      let data = await response.json();

      if (response.ok) {
        setSearchResultList(data?.data);
      } else {
        console.log(data);
      }
      setSearchFunLoading(false);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      setSearchFunLoading(false);

      console.log(error);
    }
  };

  // const handleBookNowBtn = () => {

  //   let link = `https://api.whatsapp.com/send?phone=916355167304&text=Hi%20I%20want%20to%20book%20an%20appointment%20at%20your%20salon.%20Please%20help%20me%20with%20the%20details.`;

  //   window.open(link, "_blank");
  // };

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResultList([]);
      return;
    }
  }, [searchText]);

  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  // useEffect(() => {
  //   setArea(searchParams?.get("area"));
  // }, [searchParams]);

  const toastMessage = (message, status) => {
    if (status === "success") {
      toast.success(message, {
        duration: 3000,
        position: "top-right",
      });
    } else if (status === "error") {
      toast.error(message, {
        duration: 3000,
        position: "top-right",
      });
    } else {
      toast.info(message, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className="N-header-container">
        <div className="N-header-logo-links">
          <div className="N-header-logo-area">
            <img
              src={Trakky_logo}
              alt="Trakky Logo"
              className="N-header-logo cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
            <div
              className="N-header-area-city cursor-pointer"
              onClick={() => setCityAreaOpen(true)}
            >
              {params?.city && !area ? (
                <span className="city">
                  {capitalizeAndFormat(params?.city)}
                </span>
              ) : params?.city && area ? (
                <>
                  <span className="area">{capitalizeAndFormat(area)}</span>
                  <span className="city">
                    &nbsp;{capitalizeAndFormat(params?.city)}
                  </span>
                </>
              ) : (
                <span className=" text-gray-500 font-medium">
                  Select location
                </span>
              )}
              <img src={Down_arrow} alt="down-arrow" />
            </div>
          </div>
          <div className="N-profile-book-btn">
            {/* <div className="N-header-book-btn relative cursor-pointer" onClick={handleBookNowBtn}>
              <span>salon</span>
              <span className="top">BOOK</span>
            </div> */}
            <div
              className="N-header-profile-btn cursor-pointer"
              onClick={handleClick}
            >
              <Avtar sx={{ color: "black", background: "white" }} />
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-5 md:flex-row  ">
          <div className="N-header-search-bar relative">
            <input
              type="text"
              name=""
              id=""
              placeholder="Search for spas, categories and massages"
              onChange={(e) => {
                getSearchResult(e.target.value);
                setSearchText(e.target.value);
              }}
            />
            <img src={Search_icon} alt="search" />
            <div className="Header-search-result">
              {searchFunLoading && searchText.trim() !== "" ? (
                <div className="h-[65px] w-full flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              ) : (
                searchResultList?.length > 0 &&
                searchText.trim() !== "" &&
                searchResultList?.map((item, index) => {
                  return (
                    <Link
                      to={`/${item?.city}/${item?.area}/spas/${item?.slug}`}
                      className="Header-search-result-item"
                    >
                      <div className="Header-search-result-item-image !relative">
                        {item?.main_image && (
                          <img
                            src={item.main_image}
                            alt="spa image"
                            className="!relative !left-auto !right-auto !bottom-auto"
                          />
                        )}
                      </div>
                      <div className="Header-search-result-item-details">
                        <div className="Header-search-result-item-name">
                          {item?.name}
                        </div>
                        <div className="Header-search-result-item-location">
                          {item?.area}, {item?.city}
                        </div>
                        <div className="Header-search-result-offer-score">
                          <span>
                            <img
                              src={ReviewIcon}
                              alt="review"
                              className="!static !transform-none"
                            />
                            {item?.avg_review
                              ? String(item?.avg_review).slice(0, 3)
                              : 0}
                          </span>
                          <span className="text-[10px] font-semibold	text-slate-500	">
                            |
                          </span>
                          <span>{item?.offer_tag}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
              {!searchFunLoading &&
                searchResultList?.length === 0 &&
                searchText.trim() !== "" && (
                  <div className="h-[65px] flex items-center justify-center w-full">
                    <span className="text-slate-500">No result found</span>
                  </div>
                )}
            </div>
          </div>
          {isCityPage ? (
            <div className="min-w-[250px] h-20 flex gap-3 grid-cols-2 max-w-[440px] mx-auto esm:min-w-[350px] w-full md:max-w-[250px] lg:max-w-[400px]">
              <div className=" bg-[#ffffff40] w-full h-full rounded-xl flex items-center gap-2 justify-evenly px-1 cursor-pointer"
                onClick={() => {
                  navigate(`/${params?.city}/walk-in-offers`);
                }}
                  >
                <div className=" flex flex-col gap-1">
                  <p className=" text-xs font-semibold text-slate-500 pl-1">
                    Walk-in offers
                  </p>
                  <div className=" bg-gradient-to-r from-[#E1D9FA] to-[#B9A5F7] text-[#512DC8] text-xs p-1 rounded-md font-semibold flex gap-1 items-center pl-1">
                    <img src={OfferPercentSvg} className=" h-3 w-3" alt="offer" />
                    <span className=" text-[10px]">UP TO 40% OFF</span>
                  </div>
                </div>
                <div className=" w-7 h-7 ">
                  <img
                    src={BestOfferIcon}
                    className=" h-full w-full object-contain"
                    alt="offer"
                  />
                </div>
              </div>
              <div
                className=" bg-[#ffffff40] w-full h-full rounded-xl flex items-center gap-2 justify-evenly px-2 cursor-pointer"
                onClick={() => {
                  navigate(`/${params?.city}/spas-we-trust`);
                }}
              >
                <div className="text-[14px] font-semibold text-slate-600 pl-1">
                  Trusted Spa
                </div>
                <div className=" w-7 h-7 ">
                  <img
                    src={TrustedIcon}
                    className=" h-full w-full object-contain"
                    alt="trust"
                  />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            gap: 1,
            background: "#ffffff",
            boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className=" w-64 min-w-[240px] h-auto px-2 pt-2">
          <div
            className=" flex justify-between gap-2 items-center cursor-pointer h-14 pb-4 border-b border-gray-200"
            onClick={() => {
              navigate("/userProfile");
            }}
          >
            <div className=" flex gap-2 items-center h-12">
              <img
                className=" h-10 w-10 rounded-full object-cover"
                src={profile}
                alt="profile"
              />
              <div className=" flex flex-col justify-evenly items-start ">
                {userData?.name && (
                  <p className=" text-xl line-clamp-1 font-semibold">
                    {userData?.name}
                  </p>
                )}
                <p className=" text-xs font-normal line-clamp-1">
                  Complete your profile setup
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center">
              <ArrowForwardIosIcon
                sx={{
                  margin: "auto",
                  height: "20px",
                  width: "20px",
                }}
              />
            </div>
          </div>
          <div className=" pt-2 flex w-full items-center h-14">
            <div
              className=" flex items-center justify-center gap-2 w-2/5 px-2 h-full cursor-pointer"
              onClick={() => {
                let link = `https://api.whatsapp.com/send?phone=916355167304&text=Hi%20I%20need%20help%20with%20my%20account.`;

                window.open(link, "_blank");
              }}
            >
              <HelpOutlineIcon
                sx={{
                  margin: "auto",
                  width: "26px",
                  height: "26px",
                  fontWeight: 300,
                  flexShrink: 0,
                  flexGrow: 0,
                  margin: 0,
                }}
              />
              <p className=" font-medium text-base w-auto"> Help</p>
            </div>
            <div
              className=" flex items-center justify-center gap-4 w-3/5 px-2 h-full border-l border-gray-200 cursor-pointer"
              onClick={() => {
                logoutUser();
              }}
            >
              <LogoutIcon
                sx={{
                  margin: "auto",
                  width: "26px",
                  height: "26px",
                  fontWeight: 300,
                  flexShrink: 0,
                  flexGrow: 0,
                  margin: 0,
                }}
              />
              <p className=" font-medium text-base w-max min-w-max">Sign out</p>
            </div>
          </div>
        </div>
      </Menu>

      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          border: "none",
          outline: "none",
        }}
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
              border: "none",
              outline: "none",
            }}
          >
            <Signup fun={handleSignInClose} />
          </Box>
        ) : (
          <Box sx={{ ...style, border: "none", outline: "none" }}>
            <Signup fun={handleSignInClose} />
          </Box>
        )}
      </Modal>
      <Modal
        open={cityAreaOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          border: "none",
          outline: "none",
        }}
      >
        <CityAreaModal
          onClose={() => setCityAreaOpen(false)}
          toastMessage={toastMessage}
        />
      </Modal>
    </>
  );
};

export default Header;
