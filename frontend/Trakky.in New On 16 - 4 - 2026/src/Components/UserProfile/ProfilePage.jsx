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
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";

import Image from "./background.png";
import female from "./female.png";
import male from "./male.png";
import Image2 from "./profile.png";
import Image3 from "./Nothing.png";

import MyInfo from "./MyInfo/MyInfo";
import Bookings from "./Booking/Bookings";
import MyMembership from "./MyMembership/MyMembership";
import Privacy from "./Privacy/Privacy";
import TermsOfUse from "./TermsOfUse/TermsOfUse";
import Report from "./Report/Report";
import Feedback from "./Feedback/Feedback";
import RateUs from "./RateUs/RateUs";
import RedeemCoupon from "./RedeemPage/RedeemCoupon";
import ReferralPage from "./ReferalPage/Referal";
import CallSupport from "./CallSupport/CallSupport";

import Footer from "../Common/Footer/FooterN";
import AuthContext from "../../context/Auth";

const ProfilePage = () => {
  const { user, authTokens, userData } = useContext(AuthContext);
  const [gender, setGender] = useState("");
  const [coins, setCoins] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("my-info");
  const [hasBookings, setHasBookings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState("menu"); // 'menu' or 'content'
  const [mobileContent, setMobileContent] = useState(null);
  const [currentMobileTitle, setCurrentMobileTitle] = useState("Profile Menu");
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location.pathname;
  const screenWidth = window.innerWidth;

  const [clicked, setClicked] = useState(false);
  const savedScrollPosition = useRef(0);
  const targetRef = useRef(null);
  const { pathname } = location;
  const tabsScrollRef = useRef(null);

  let imageSrc;
  if (userData?.image) {
    imageSrc = userData.image;
  } else if (userData?.gender === "male") {
    imageSrc = male;
  } else if (userData?.gender === "female") {
    imageSrc = female;
  } else {
    imageSrc = Image2;
  }

  // Tab configuration with titles and breadcrumbs
  const tabConfig = {
    "my-info": {
      title: "Personal Information",
      breadcrumb: "Personal Info",
      description: "Manage your personal details and contact information",
      component: <MyInfo />
    },
    "my-bookings": {
      title: "Booking History",
      breadcrumb: "Bookings",
      description: "View and manage your appointment history",
      component: <Bookings />
    },
    "my-membership": {
      title: "Membership Plan",
      breadcrumb: "Membership",
      description: "Manage your subscription and benefits",
      component: <MyMembership />
    },
    // "payment-list": {
    //   title: "Payment History",
    //   breadcrumb: "Payments",
    //   description: "View your payment transactions and history",
    //   component: <div>Payment History Component (Coming Soon)</div>
    // },
    // "gift-card": {
    //   title: "Gift Cards",
    //   breadcrumb: "Gift Cards",
    //   description: "Manage your gift cards and balances",
    //   component: <div>Gift Card Component (Coming Soon)</div>
    // },
    // "products": {
    //   title: "My Products",
    //   breadcrumb: "Products",
    //   description: "View your purchased products and orders",
    //   component: <div>Products Component (Coming Soon)</div>
    // },
    "privacy": {
      title: "Privacy Settings",
      breadcrumb: "Privacy",
      description: "Control your privacy and data preferences",
      component: <Privacy />
    },
    "terms-of-use": {
      title: "Terms of Service",
      breadcrumb: "Terms",
      description: "Review our terms and conditions",
      component: <TermsOfUse />
    },
    "report-salon": {
      title: "Report Issue",
      breadcrumb: "Report",
      description: "Report any issues with our services",
      component: <Report />
    },
    "feedback": {
      title: "Customer Feedback",
      breadcrumb: "Feedback",
      description: "Share your experience with us",
      component: <Feedback />
    },
    "rate-us-now": {
      title: "Rate Our Service",
      breadcrumb: "Ratings",
      description: "Rate and review our services",
      component: <RateUs />
    },
    "redeem-coupon-list": {
      title: "Redeem Rewards",
      breadcrumb: "Rewards",
      description: "Redeem your Trakky coins for rewards",
      component: <RedeemCoupon />
    },
    "refer": {
      title: "Referral Program",
      breadcrumb: "Referral",
      description: "Invite friends and earn rewards",
      component: <ReferralPage />
    },
    "call": {
      title: "Customer Support",
      breadcrumb: "Support",
      description: "Get help from our support team",
      component: <CallSupport />
    }
  };

  const getCurrentTabConfig = () => {
    const tabId = pathname.split('/').pop() || 'my-info';
    return tabConfig[tabId] || {
      title: "Account Management",
      breadcrumb: "Dashboard",
      description: "Manage your profile, bookings, and preferences",
      component: <MyInfo />
    };
  };

  const currentTab = getCurrentTabConfig();

  const handleNavItemClick = (navItem) => {
    savedScrollPosition.current = window.scrollY;
    setClicked(true);
    setActiveNavItem(navItem);
    
    // For mobile devices, show content view with back button
    if (window.innerWidth <= 768) {
      setMobileContent(tabConfig[navItem]?.component || <MyInfo />);
      setCurrentMobileTitle(tabConfig[navItem]?.title || "Profile");
      setMobileView("content");
    } else {
      // For larger devices, use normal navigation
      navigate(navItem);
    }
    
    setIsMobileMenuOpen(false);
  };

  const handleBackToMenu = () => {
    setMobileView("menu");
    setCurrentMobileTitle("Profile Menu");
  };

  const handleBackButtonClick = () => {
    navigate("/userProfile");
  };

  const scrollTabs = (direction) => {
    if (tabsScrollRef.current) {
      const scrollAmount = 200;
      tabsScrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Initialize mobile content on component mount for mobile devices
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobileContent(currentTab.component);
    }
    if (screenWidth >= 768) navigate("/userProfile/my-info");
  }, []);

  useEffect(() => {
    if (clicked && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
      setClicked(false);
    } else {
      window.scrollTo(0, savedScrollPosition.current);
    }
  }, [pathname]);

  // Update mobile content when route changes (for cases where user directly navigates)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobileContent(currentTab.component);
    }
  }, [pathname]);

  // Navigation tabs data
  const profileTabs = [
    { id: "my-info", label: "Personal Info", icon: PersonOutlineOutlinedIcon },
    { id: "my-bookings", label: "Bookings", icon: EventNoteIcon },
    { id: "my-membership", label: "Membership", icon: CardMembershipIcon },
    // { id: "payment-list", label: "Payment History", icon: ReceiptIcon },
    // { id: "gift-card", label: "Gift Card", icon: CardGiftcardIcon },
    // { id: "products", label: "Products", icon: InventoryIcon },
   
    { id: "feedback", label: "Feedback", icon: CommentRoundedIcon },
    { id: "report-salon", label: "Report", icon: ErrorOutlineIcon },
    { id: "refer", label: "Referral", icon: CurrencyRupeeIcon },
    { id: "rate-us-now", label: "Ratings", icon: StarOutlineRoundedIcon },
    
    
     { id: "privacy", label: "Privacy", icon: LockIcon },
    { id: "terms-of-use", label: "Terms", icon: DescriptionOutlinedIcon },
    { id: "redeem-coupon-list", label: "Rewards", icon: RedeemIcon },
    
  ];

  const contactTabs = [
    { id: "call", label: "Support", icon: CallRoundedIcon },
    { id: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, external: true, href: "https://wa.me/6355167304" },
    { id: "email", label: "Email", icon: EmailIcon, external: true, href: "mailto:customercare@trakky.in" },
  ];

  // Function to render mobile content based on current view
  const renderMobileContent = () => {
    if (window.innerWidth <= 768) {
      if (mobileView === "menu") {
        return (
          <div className="mobile-menu-view">
            {/* Mobile Quick Navigation */}
            <div className="mobile-quick-nav-container">
              <div className="mobile-quick-nav-header">
                <h3>Quick Navigation</h3>
              </div>
              <div className="mobile-quick-nav-list">
                {profileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`mobile-quick-nav-item ${activeNavItem === tab.id ? 'active' : ''}`}
                    onClick={() => handleNavItemClick(tab.id)}
                  >
                    <div className="mobile-quick-nav-content">
                      <div className="mobile-quick-nav-icon-text">
                        <tab.icon className="mobile-quick-nav-icon" />
                        <span className="mobile-quick-nav-label">{tab.label}</span>
                      </div>
                      <ArrowForwardIosIcon className="mobile-quick-nav-arrow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Section for Mobile */}
            <div className="mobile-contact-section-main">
              <h4>Need Help?</h4>
              <div className="mobile-contact-buttons-main">
                {contactTabs.map((tab) => (
                  tab.external ? (
                    <a
                      key={tab.id}
                      href={tab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-contact-btn-main"
                    >
                      <tab.icon className="mobile-contact-icon" />
                      <span>{tab.label}</span>
                    </a>
                  ) : (
                    <button
                      key={tab.id}
                      className="mobile-contact-btn-main"
                      onClick={() => handleNavItemClick(tab.id)}
                    >
                      <tab.icon className="mobile-contact-icon" />
                      <span>{tab.label}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        // Content view with back button
        return (
          <div className="mobile-content-view">
            <div className="mobile-content-header">
              <button className="mobile-back-button" onClick={handleBackToMenu}>
                <ArrowBackIcon />
                <span>Back to Menu</span>
              </button>
            </div>
            <div className="mobile-content-area">
              {mobileContent}
            </div>
          </div>
        );
      }
    } else {
      // Desktop: Use normal routing
      return <Outlet />;
    }
  };

  return (
    <div className="profile-page-container">
      <Header />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Profile Menu</h3>
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            
            {/* Quick Navigation Section in Mobile Menu */}
            <div className="mobile-quick-navigation">
              <h4>Quick Navigation</h4>
              <div className="mobile-nav-list">
                {profileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`mobile-nav-item ${activeNavItem === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      handleNavItemClick(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="mobile-nav-item-content">
                      <div className="mobile-nav-icon-text">
                        <tab.icon className="mobile-nav-icon" />
                        <span className="mobile-nav-label">{tab.label}</span>
                      </div>
                      <ArrowForwardIosIcon className="mobile-nav-arrow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-contact-section">
              <h4>Contact Support</h4>
              <div className="mobile-contact-buttons">
                {contactTabs.map((tab) => (
                  tab.external ? (
                    <a
                      key={tab.id}
                      href={tab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-contact-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <tab.icon className="mobile-contact-icon" />
                      <span>{tab.label}</span>
                    </a>
                  ) : (
                    <button
                      key={tab.id}
                      className="mobile-contact-btn"
                      onClick={() => {
                        handleNavItemClick(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <tab.icon className="mobile-contact-icon" />
                      <span>{tab.label}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <div className="professional-header">
        <div className="header-content">
          {/* Mobile Menu Button */}
          <div className="mobile-menu-button">
            <button className="menu-toggle-btn" onClick={toggleMobileMenu}>
              <MenuIcon />
            </button>
          </div>
          
          <div className="breadcrumb">
          <Link to={'/'}>  <span className="text-white">Home</span></Link>
            <span className="divider">/</span>
            <span>User Profile</span>
            <span className="divider">/</span>
            <span className="current">{currentTab.breadcrumb}</span>
          </div>
          <h1 className="page-title">{currentTab.title}</h1>
          <p className="page-subtitle">{currentTab.description}</p>
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="profile-main-section">
        <div className="profile-container">
          {/* User Profile Card */}
                  <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img src={imageSrc} alt="Profile" className="profile-avatar" />
                <div className="online-status"></div>
              </div>
              <div className="profile-details">
                <h2 className="user-name">{userData?.name ? userData.name : "Guest User"}</h2>
                <p className="user-role">Premium Member</p>
                <div className="user-location">
                  <LocationOnIcon className="location-icon" />
                  <span>{userData?.area ? userData.area : "Area"}, {userData?.city ? userData.city : "City"}</span>
                </div>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon coin-icon">
                  <CurrencyRupeeIcon />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{userData?.coin_wallet?.coin_balance || 0}</div>
                  <div className="stat-label">Trakky Coins</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon booking-icon">
                  <EventNoteIcon />
                </div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
              </div>
            </div>

         
          </div>

          {/* Main Content Area */}
          <div className="content-section">
            {/* Horizontal Navigation Tabs with Scroll - Hidden on Mobile */}
            <div className="navigation-tabs-container desktop-only">
              <div className="tabs-header">
                <h3>Quick Navigation</h3>
                <div className="scroll-controls">
                  <button className="scroll-btn" onClick={() => scrollTabs('left')}>
                    <ChevronLeftIcon />
                  </button>
                  <button className="scroll-btn" onClick={() => scrollTabs('right')}>
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              
              <div className="tabs-scroll-wrapper">
                <div className="navigation-tabs" ref={tabsScrollRef}>
                  {profileTabs.map((tab) => (
                    <Link
                      key={tab.id}
                      to={tab.id}
                      className={`nav-tab ${activeNavItem === tab.id ? 'active' : ''}`}
                      onClick={() => handleNavItemClick(tab.id)}
                    >
                      <div className="tab-icon-container">
                        <tab.icon className="tab-icon" />
                      </div>
                      <span className="tab-label">{tab.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Display Area */}
            <div className="content-display-area">
                <div className="desktop-content">
                  <div className="content-card">
                    {renderMobileContent()}
                  </div>
                </div>
            </div>

            {/* Contact Section - Hidden on Mobile */}
            <div className="contact-section desktop-only">
              <h4>Need Help?</h4>
              <div className="contact-buttons">
                {contactTabs.map((tab) => (
                  tab.external ? (
                    <a
                      key={tab.id}
                      href={tab.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-btn"
                    >
                      <tab.icon className="contact-icon" />
                      <span>{tab.label}</span>
                    </a>
                  ) : (
                    <Link
                      key={tab.id}
                      to={tab.id}
                      className="contact-btn"
                      onClick={() => handleNavItemClick(tab.id)}
                    >
                      <tab.icon className="contact-icon" />
                      <span>{tab.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;