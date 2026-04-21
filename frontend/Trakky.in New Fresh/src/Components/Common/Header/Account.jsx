import React, { useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import account from "../../../Assets/images/icons/account.svg";
import accountWhite from "../../../Assets/images/icons/account-white.svg";
import { useEffect } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import profile from "./profile.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AuthContext from "../../../context/Auth";

const Account = ({ user, logoutUser, openSigin, white }) => {
  const { userData } = useContext(AuthContext);

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
            alt="View Your Account"
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
            mt: 1.5,
            background: "#ffffff",
            boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
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
                alt="View Your Profile Details"
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
          <div
            className=" pt-2 flex w-full items-center h-14"
            onClick={() => {
              let link = `https://api.whatsapp.com/send?phone=916355167304&text=Hi%20I%20need%20help%20with%20my%20account.`;

              window.open(link, "_blank");
            }}
          >
            <div className=" flex items-center justify-center gap-2 w-2/5 px-2 h-full cursor-pointer">
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
              <p className=" font-medium text-base w-auto cursor-pointer">
                {" "}
                Help
              </p>
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
    </>
  );
};

export default Account;
