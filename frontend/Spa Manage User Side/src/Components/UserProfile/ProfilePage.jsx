import React, { useState, useEffect, useRef, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Switch,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Header from "../Common/Header/Header";
import "./UserProfile.css";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import RedeemIcon from "@mui/icons-material/Redeem";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import SummarizeIcon from "@mui/icons-material/CalendarMonthOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Image from "./background.png";
import female from "./female.png";
import male from "./male.png";
import Image2 from "./profile.png";
import Image3 from "./Nothing.png";

import MyInfo from "./MyInfo/MyInfo";

import Footer from "../Common/Footer/FooterN";
import AuthContext from "../../context/Auth";
const ProfilePage = () => {
  const { user, authTokens, userData } = useContext(AuthContext);
  const [gender, setGender] = useState("");
  const [coins, setCoins] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("my-info"); // Initial active navigation item

  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location.pathname;
  const screenWidth = window.innerWidth;

  const [clicked, setClicked] = useState(false);
  const savedScrollPosition = useRef(0);
  const targetRef = useRef(null);
  const { pathname } = location;

  let imageSrc;
  if (userData?.gender === "male") {
    imageSrc = male;
  } else if (userData?.gender === "female") {
    imageSrc = female;
  } else {
    imageSrc = Image2;
  }

  const handleNavItemClick = (navItem) => {
    savedScrollPosition.current = window.scrollY;
    setClicked(true);
    setActiveNavItem(navItem);
  };

  const handleBackButtonClick = () => {
    navigate("/userProfile");
  };

  useEffect(() => {
    if (screenWidth >= 768) navigate("/userProfile/my-info");
    if (screenWidth < 768) navigate("/userProfile");
  }, []);
  useEffect(() => {
    if (clicked && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
      setClicked(false);
    } else {
      window.scrollTo(0, savedScrollPosition.current);
    }
  }, [pathname]);

  return (
    <div>
      <Header />
      {(currentPathname === "/userProfile" || screenWidth > 768) && (
        <div
          style={{ backgroundImage: `url(${Image})` }}
          className="profilebanner"
        >
          <div className="PP-hero">
            <div className="PP-userDetails">
              <img
                src={imageSrc}
                alt=""
                // style={{ width: "180px", height: "180px" }}
              />
              <div class="PP-detail">
                <h3>{userData?.name ? userData.name : "Name"}</h3>
                <p>
                  <LocationOnIcon /> {userData?.area ? userData.area : "area"},{" "}
                  {userData?.city ? userData.city : "city"}
                </p>
              </div>
            </div>

            <div
              className="PP-trakkycoins"
             
            >
              <Link
                to="redeem-coupon"
                onClick={() => handleNavItemClick("redeem-coupon")}
                className={
                  activeNavItem === "redeem-coupon"
                    ? "active-redeem-coupon"
                    : ""
                }
              >
                <div className="PP-coins">
                  <div className="coinCount">
                    {/* <CurrencyRupeeIcon /> */}
                    {userData?.coin_wallet?.coin_balance || 0}
                  </div>
                  Trakky Coins
                </div>
              </Link>

              <Link
                to="refer"
                onClick={() => handleNavItemClick("refer")}
                className={activeNavItem === "refer" ? "active-refer" : ""}
              >
                <div className="PP-refers">
                  <RedeemIcon />
                  Refer & Earn
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="profileNavigation"></div>

      <div className="main-container">
        {(currentPathname === "/userProfile" || screenWidth > 768) && (
          <div className="PP-navigation">
            <div className="profileoptions">
              <h1>Profile Options</h1>
              <Link
                to="my-info"
                onClick={() => handleNavItemClick("my-info")}
                className={activeNavItem === "my-info" ? "active" : ""}
              >
                <PersonOutlineOutlinedIcon />
                <h3>My info</h3>
              </Link>
              <Link
                to="my-bookings"
                onClick={() => handleNavItemClick("my-bookings")}
                className={activeNavItem === "my-bookings" ? "active" : ""}
              >
                <EventNoteIcon />
                <h3>My bookings</h3>
              </Link>
              {/* <Link
                to="my-bookings"
                onClick={() => handleNavItemClick("my-bookings")}
                className={activeNavItem === "my-bookings" ? "active" : ""
              >
                <LockIcon />
                <h3>My bookings</h3>
              </Link> 
              
              {/* <Link
                to="faqs"
                onClick={() => handleNavItemClick("faqs")}
                className={activeNavItem === "faqs" ? "active" : ""}
              >
                <SummarizeIcon />
                <h3>FAQs</h3>
              </Link> 
              <Link
                to="privacy"
                onClick={() => handleNavItemClick("privacy")}
                className={activeNavItem === "privacy" ? "active" : ""}
              >
                <LockIcon />
                <h3>Privacy</h3>
              </Link>
              <Link
                to="terms-of-use"
                onClick={() => handleNavItemClick("terms-of-use")}
                className={activeNavItem === "terms-of-use" ? "active" : ""}
              >
                <DescriptionOutlinedIcon />
                <h3>Terms of use</h3>
              </Link>
            </div>

            <div className="PP-support">
              <div className="heading">
                <h1>Support</h1>
              </div>
              */}

              <Link
                to="report-spa"
                onClick={() => handleNavItemClick("report-spa")}
                className={activeNavItem === "report-spa" ? "active" : ""}
              >
                <ErrorOutlineIcon />
                <h3>Report Spa</h3>
              </Link>
              <Link
                to="feedback"
                onClick={() => handleNavItemClick("feedback")}
                className={activeNavItem === "feedback" ? "active" : ""}
              >
                <CommentRoundedIcon />
                <h3>Feedback</h3>
              </Link>
              <Link
                to="rate-us"
                onClick={() => handleNavItemClick("rate-us")}
                className={activeNavItem === "rate-us" ? "active" : ""}
              >
                <StarOutlineRoundedIcon />
                <h3>Rate us</h3>
              </Link>
            </div>
            <div className="PP-contact">
              <div className="heading">
                <h1>Contact</h1>
              </div>
              <Link
                to="tel:6355167304"
                onClick={() => handleNavItemClick("call")}
                className={activeNavItem === "call" ? "active" : ""}
              >
                <CallRoundedIcon />
                <h3>Call</h3>
              </Link>
              <a
                href="https://wa.me/6355167304"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                <h3>WhatsApp</h3>
              </a>
              <a
                href="mailto:customercare@trakky.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <EmailIcon />
                <h3>Email</h3>
              </a>
            </div>
          </div>
        )}

        {screenWidth > 768 ? (
          <div className="PP-content">
            <Outlet />
          </div>
        ) : (
          currentPathname !== "/userProfile" && (
            <div className="mobile-content">
              <button className="back-button" onClick={handleBackButtonClick}>
                <ArrowBackIcon />
              </button>
              <Outlet />
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
