import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import axios from "axios";

import authcontext from "../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";

import trakkyWhite from "../../../Assets/images/logos/Trakky logo white.png";
import trakkyPurple from "../../../Assets/images/logos/Trakky logo purple.png";
import userlogowhite from "../../../Assets/logos/user.svg";
import userlogoblack from "../../../Assets/logos/user_black.svg";
import Search from "../../../Assets/images/icons/search.svg";
import SigninForms from "./signupsigninforms/SigninForms";
import Filters from "../../../Assets/images/icons/filters.svg";

import Account from "./Account";

import Signup from "./SignUp2/Signup";

import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

// window dimensions
function getWindowDimensions() {
  const width = window.innerWidth,
    height = window.innerHeight;
  return { width, height };
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;

// default prop of page = "other": which represents navbar of all other pages except home page.

const Header = ({ page = "other", isSalonP = false }) => {
  const navigate = useNavigate();
  const { user, authTokens, logoutUser, userData } =
    React.useContext(authcontext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // show determines whether navbar on scroll is visible or not.
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY < lastScrollY && lastScrollY >= 330) {
          setShow(false);
        } else {
          setShow(false);
        }

        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  // navState determines whether it is navbar of home page or of other pages
  // If navState is true => navbar of home page is rendered.
  const navState = page !== "other";

  const [Focused, setIsFocused] = useState(false);
  const ref = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [searchResultList, setSearchResultList] = useState([]);
  const [showdropdown, setshowdropdown] = useState(false);
  const [searchloadingstate, setSearchloadingstate] = useState(false);

  // getting search result
  const getSearchResult = (text) => {
    setSearchloadingstate(true);
    axios
      .get(`https://backendapi.trakky.in/salons/search/?query=${text}`)
      .then((res) => {
        if (res.data) {
          setSearchResultList(res.data);
          setSearchloadingstate(false);
        } else {
          setSearchloadingstate(false);
          setSearchResultList([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSearchbar = (e) => {
    e.preventDefault();
    if (searchResultList.length !== 0) {
      const firstSalon = searchResultList[0];
      const safeCity = (firstSalon?.city || "").toLowerCase();
      const safeArea = (firstSalon?.area || "").toLowerCase();
      const safeSlug = firstSalon?.slug || "";
      navigate(
        `/${encodeURIComponent(safeCity)}/${encodeURIComponent(safeArea)}/salons/${safeSlug}`
      );
      window.location.reload();
    } else {
      toast.error("please enter a valid input");
    }
  };

  return (
    <div>
      <Toaster
        className="absolute top-0 right-0"
        position="top-right"
        reverseOrder={false}
      />
      <div
        className={`navbar__container ${show && "hidden"}`}
        style={{
          position: show ? "fixed" : !navState ? "absolute" : "absolute",
        }}
      >
        <div className="logo__container">
          <Link to="/">
            {(show && windowDimensions.width >= 631) ||
            ((show || navState) && windowDimensions.width < 631) ? (
              <img
                src={trakkyPurple}
                draggable="false"
                alt="Trakky salon booking platform logo"
              />
            ) : (
              <img
                src={navState ? trakkyWhite : trakkyPurple}
                draggable="false"
                alt="Trakky salon booking platform logo"
              />
            )}
          </Link>
        </div>

        <div
          className={`search__container navbar_search-top ${
            navState ? "" : "none-other"
          } `}
          style={{
            position: "relative",
          }}
          tabIndex={0}
          onFocus={() => {
            setIsFocused(true);
            ref.current.focus();
          }}
          onBlur={() => setIsFocused(false)}
        >
          <img
            draggable="false"
            src={Search}
            alt="Search for salons, city and area"
          />
          <form className="search-bar" onSubmit={handleSearchbar}>
            <label
              htmlFor="search"
              id="searchLabel"
              style={{
                fontWeight: "bold",
                display:
                  Focused || searchText.length !== 0 ? "none" : "block",
              }}
            >
              What to?
            </label>
            <input
              ref={ref}
              type="text"
              placeholder="Salon name • Area • City • Category"
              name="search"
              autoComplete="off"
              id="search"
              onChange={(e) => {
                setSearchText(e.target.value);
                getSearchResult(e.target.value);
              }}
              style={{
                fontSize:
                  Focused || searchText.length !== 0 ? "larger" : "10px",
              }}
            />
          </form>
          <img
            draggable="false"
            src={Filters}
            alt="Apply Filters"
            style={{ height: "2.5rem" }}
          />
          <div
            className="search_result__container shadow-2xl max-h-[20rem] z-50 overflow-y-auto"
            style={{
              position: "absolute",
              display: searchText === "" ? "none" : "block",
              top: "100%",
              width: "90%",
              left: "5%",
              zIndex: 9999,
            }}
          >
            {Focused && (
              <div>
                {searchloadingstate ? (
                  <div className="flex items-center justify-center h-[3rem]">
                    <div className="loader"></div>
                  </div>
                ) : searchResultList.length !== 0 ? (
                  searchResultList.map((salon, index) => {
                    const safeCity = (salon?.city || "").toLowerCase();
                    const safeArea = (salon?.area || "").toLowerCase();
                    const safeSlug = salon?.slug || "";
                    return (
                      <div
                        className="flex flex-col py-2 mx-5 border-b-2 border-gray-300 "
                        key={index}
                      >
                        <Link
                          to={`/${encodeURIComponent(safeCity)}/${encodeURIComponent(safeArea)}/salons/${safeSlug}`}
                          onMouseDownCapture={() => {
                            navigate(`/${encodeURIComponent(safeCity)}/${encodeURIComponent(safeArea)}/salons/${safeSlug}`);
                            window.location.reload();
                          }}
                          className="font-bold"
                        >
                          {salon.name}
                        </Link>
                        <p className="text-sm text-gray-500">{`${salon?.city || "Unknown"} • ${salon?.area || "Unknown"} • ${salon?.offer_tag || ""}`}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-[3rem]">
                    <p className="font-bold ">No results found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="register-div flex items-center gap-2">
          {/* Home Icon Button - Added beside Register Salon */}
          <button
  onClick={() => navigate("/")}
  className="flex items-center justify-center p-2 rounded-full border-2 bg-[#3F2385] text-white bg-transparent  
             transition-all duration-200 ease-in-out  hover:text-white shadow-sm"
  title="Go to Home"
>
  <HomeIcon className="text-xl md:text-2xl transition-colors duration-200" />
</button>


          <Modal
            open={open}
            onClose={handleClose}
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
                }}
              >
                <Signup fun={handleClose} />
              </Box>
            ) : (
              <Box sx={style}>
                <Signup fun={handleClose} />
              </Box>
            )}
          </Modal>

          {windowDimensions.width >= 631 ? (
            <>
              <Account
                user={user}
                logoutUser={logoutUser}
                openSigin={handleOpen}
                white={
                  !show && navState && windowDimensions.width >= 631
                    ? true
                    : false
                }
              />
              {!isSalonP && (
                <div className="register-salon">
                  <button>
                    <Link to={"/salonRegistration"}>
                      <div
                        className={`ring-1 text-sm ${
                          !show && navState && windowDimensions.width >= 631
                            ? "ring-white text-white"
                            : "ring-black text-black"
                        } rounded-3xl px-3 py-1 md:px-4 md:py-1.5`}
                      >
                        Register Salon
                      </div>
                    </Link>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {!isSalonP && (
                <div className="register-salon">
                  <button>
                    <Link to={"/salonRegistration"}>
                      <div
                        className={`ring-1 text-sm ${
                          !show && navState && windowDimensions.width >= 631
                            ? "ring-white text-white"
                            : "ring-black text-black"
                        } rounded-3xl px-3 py-1 md:px-4 md:py-1.5`}
                      >
                        Register Salon
                      </div>
                    </Link>
                  </button>
                </div>
              )}
              <Account
                user={user}
                logoutUser={logoutUser}
                openSigin={handleOpen}
                white={
                  !show && navState && windowDimensions.width >= 631
                    ? true
                    : false
                }
              />
            </>
          )}
        </div>
      </div>
      {!navState && !show && (
        <div
          style={{
            width: "100%",
            height: "4.9375rem",
          }}
        />
      )}
    </div>
  );
};

export default Header;