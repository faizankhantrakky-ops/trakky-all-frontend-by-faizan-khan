import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import authcontext from "../../../context/Auth";

import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import axios from "axios";

import trakkyWhite from "./../../../Assets/images/logos/Trakky logo white.png";
import trakkyPurple from "./../../../Assets/images/logos/Trakky logo purple.png";
import userlogowhite from "../../../Assets/logos/user.svg";
import userlogoblack from "../../../Assets/logos/user_black.svg";
import Search from "../../../Assets/images/icons/search.svg";
import SigninForms from "./signupsigninforms/SigninForms";

import Filters from "../../../Assets/images/icons/filters.svg";

import Account from "./Account";

import { Link, useNavigate } from "react-router-dom";
import Signup from "../Navbar/SignUp2/Signup";

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
// default prop of page = "other": which represents navbar of all other pages except home page.

// Rendering Home page Navbar prop of page = "some random text" needs to be passed.

const Header = ({ page = "other" }) => {
  const navigate = useNavigate();
  const { user, authTokens, logoutUser } = React.useContext(authcontext);
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

  const isMobile = window.matchMedia("(max-width: 600px)").matches;


  // show determines whether navbar on scroll is visible or not.
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY < lastScrollY && lastScrollY >= 330) {
          setShow(true);
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

  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  const [username, setUsername] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResultList, setSearchResultList] = useState([{}]);
  const [showdropdown, setshowdropdown] = useState(false);

  // getting search result
  const getSearchResult = (text) => {
    axios
      .get(`https://backendapi.trakky.in/spas/search/?query=${text}&verified=true`)
      .then((res) => setSearchResultList(res.data.data))
      .catch((err) => console.log(err));
  };
  const get_user_data = async () => {
    if (user) {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/spauser/${user.user_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setUsername(data.username);
    }
  };
  React.useEffect(() => {
    get_user_data();
  }, [user, authTokens]);

  return (
    <div>
      <div
        className={`navbar__container ${show && "OH-hidden"}`}
        style={{
          background: !navState && show ? "#FFF" : "",
          position: show ? "fixed" : !navState ? "relative" : "absolute",
        }}
      >
        <div className="logo__container">
          {
            <Link to="/">
              {(show && { windowDimensions }.windowDimensions.width >= 631) ||
              ((show || navState) &&
                { windowDimensions }.windowDimensions.width < 631) ? (
                <img src={trakkyPurple} draggable="false" alt="trakky logo" />
              ) : (
                <img
                  src={navState ? trakkyWhite : trakkyPurple}
                  draggable="false"
                  alt="trakky logo"
                />
              )}
            </Link>
          }
        </div>
        {/* <div
        className="nav-links__container"
        style={{ display: navState ? "" : "none" }}
      >
        <li>Trakky Sentence</li>
        <li>Experiences</li>
        <li>Online Experiences</li>
      </div> */}

        <div
          className={`search__container navbar_search-top ${
            navState ? "" : "none-other"
          }`}
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
          <img draggable="false" src={Search} alt="search icon" />
          <form className="search-bar">
            <label
              htmlFor="search"
              id="searchLabel"
              style={{
                fontWeight: "bold",
                display:
                  isFocused || searchText.length !== 0 ? "none" : "block",
              }}
            >
              What to?
            </label>
            <input
              ref={ref}
              type="text"
              placeholder="Spa name • Area • City • Therapy"
              name="search"
              autoComplete="off"
              id="search"
              onChange={(e) => {
                setSearchText(e.target.value);
                getSearchResult(e.target.value);
              }}
              style={{
                fontSize: isFocused || searchText.length !== 0 ? "larger" : "",
              }}
            />
          </form>
          <img
            draggable="false"
            src={Filters}
            alt="filter icon"
            style={{ height: "2.5rem" }}
          />
          <div
            className="search_result__container max-h-[20rem] overflow-y-auto "
            style={{
              position: "absolute",
              display: searchText === "" ? "none" : "block",
              width: "90%",
              top: "100%",
              left: "5%",
              zIndex: '9999'
            }}
          >
           {isFocused&&<ul>
              {searchResultList.map((spa, index) => {
                return (
               
                    <div className="flex flex-col py-2 mx-5 border-b-2 border-gray-300 "  key={index}>
                      <Link
                      to={`/${spa?.city?.toLowerCase().replaceAll(' ','-')}/${spa?.area?.toLowerCase().replaceAll(' ','-')}/spas/${spa.slug}`}
                      onMouseDownCapture={() => {
                        navigate(`/${spa?.city?.toLowerCase().replaceAll(' ','-')}/${spa?.area?.toLowerCase().replaceAll(' ','-')}/spas/${spa.slug}`);
                        window.location.reload();
                      }}
                      className="font-bold"
                    >
                      {spa.name}
                    </Link>
                      <p className="text-sm text-gray-500">{`${spa.city} • ${spa.area} • ${spa.offer_tag} `  }</p>
                    </div> 
                 
                );
              })}
            </ul>}
          </div>
        </div>
        <div className=" register-div">
          
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
              outline: "none",
            }}
          >
            <Signup fun={handleClose} />
          </Box>
        ) : (
          <Box sx={{ ...style, outline: "none" }}>
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
              <div className="register-salon">
                <button>
                  <Link to={"/spaRegistration"}>
                    <div
                      className={`ring-1 text-sm ${
                        !show && navState && windowDimensions.width >= 631
                          ? "ring-white text-white  "
                          : "ring-black text-black "
                      } rounded-3xl px-3 py-1  md:px-3 md:py-1  `}
                    >
                      Register Spa
                    </div>
                  </Link>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="register-salon">
                <button>
                  <Link to={"/spaRegistration"}>
                    <div
                      className={`ring-1 text-sm ${
                        !show && navState && windowDimensions.width >= 631
                          ? "ring-white text-white  "
                          : "ring-black text-black "
                      } rounded-3xl px-3 py-1  md:px-3 md:py-1  `}
                    >
                      Register Spa
                    </div>
                  </Link>
                </button>
              </div>
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
    </div>
  );
};

export default Header;
