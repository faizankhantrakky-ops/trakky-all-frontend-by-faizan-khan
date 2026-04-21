import React, { useState, useEffect } from 'react';
import logoScrolled from "../../../Assets/images/logos/Trakky logo purple.png";
import logo from "../../../Assets/images/logos/Trakky logo white.png";
import './Navbar.css';
import Signup from '../../Common/Header/SignUp2/Signup'
import { FaUser } from "react-icons/fa";
import { Modal, Box } from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import authcontext from "../../../context/Auth";

const Navbar = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const { user, authTokens, logoutUser, userData } =
  React.useContext(authcontext);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      handleSignInOpen();
    }
  };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };



  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80 && !isMobile) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial state
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <>
      <nav className={`navbar-main-parter-page ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-parter-page">
          <div className="back-icon-parter-page">
            <IoChevronBackOutline  onClick={() => {
                navigate("/");
              }} />
          </div>
          <div className="nav-image-container-parter-page">
            <img src={isMobile || isScrolled ? logoScrolled : logo} alt="Logo"  onClick={() => {
                navigate("/");
              }}/>
          </div>
          <div className="profile-icon-parter-page">
            <div className="navback-color-iocn-parter-page">
              <FaUser className='user-nav-icon-parter-page' onClick={handleClick}/>
            </div>
          </div>
        </div>
      </nav>
      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        // onClick={setOpenSignIn}
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
    </>
  );
}

export default Navbar;
