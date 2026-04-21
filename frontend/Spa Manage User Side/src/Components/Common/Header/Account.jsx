import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, ListItemIcon, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import account from "../../../Assets/images/icons/account.svg";
import accountWhite from "../../../Assets/images/icons/account-white.svg";
import { useNavigate } from "react-router-dom";

const Account = ({ user, logoutUser, openSigin, white }) => {
  const [menu, setMenu] = useState(false);

  const navigate = useNavigate();

  const handleClick = (event) => {
    if (user) {
      setMenu(event.currentTarget);
    } else {
      openSigin(true);
    }
  };

  const handleClose = () => {
    setMenu(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* for desktop */}
      {!isMobile ? (
        <div
          onClick={handleClick}
          color="inherit"
          className="account register-salon"
          aria-controls={menu ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menu ? "true" : undefined}
        >
          {/* <button>
            <div
              className={`ring-1 text-sm ${
                white ? "ring-white text-white  " : "ring-black text-black "
              } rounded-3xl px-3 py-1  md:px-3 md:py-1  `}
            >
              Login / Signup
            </div>
          </button> */}
          {/* <AccountCircleOutlinedIcon fontSize='large' /> */}
          {/* <img src={white ? accountWhite : account} alt='account-logo' width="30px" ></img> */}
        </div>
      ) : (
        <IconButton
          onClick={handleClick}
          color="inherit"
          className="account"
          aria-controls={menu ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menu ? "true" : undefined}
        >
          {/* <AccountCircleOutlinedIcon fontSize="large" /> */}
          <img
            src={white ? accountWhite : account}
            alt="account-logo"
            width="30px"
          ></img>
        </IconButton>
      )}

      <Menu
        anchorEl={menu}
        id="account-menu"
        open={Boolean(menu)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
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
        <MenuItem>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <span>Help</span>
        </MenuItem>
        <MenuItem onClick={()=>{
          navigate("/userprofile")
        }}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <span>Profile</span>
        </MenuItem>
        <MenuItem onClick={logoutUser}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <span>Logout</span>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Account;
