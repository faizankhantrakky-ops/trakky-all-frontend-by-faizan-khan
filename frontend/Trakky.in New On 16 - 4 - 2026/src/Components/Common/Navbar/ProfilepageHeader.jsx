import React, { useState } from "react";
import "./header.css";
import Back_icon from "../../../Assets/images/icons/back-left-arrow.svg";
import trakk_logo from "../../../Assets/images/logos/Trakky logo purple.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { ListItemIcon } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import authcontext from "../../../context/Auth";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import profile from "./profile.png";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ProfilepageHeader = ({ handleOpenLogin }) => {
  const { user, authTokens, logoutUser, userData } =
    React.useContext(authcontext);

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  let params = useParams();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      handleOpenLogin();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="PPH-contaienr">
        <div
          className="back-icon"
          onClick={() => {
            navigate(`/${params?.city}/salons`);
          }}
        >
          <img src={Back_icon} alt="Go Back" />
        </div>
        <div
          className="trakky-logo"
          onClick={() => {
            navigate(`/${params?.city}/salons`);
          }}
        >
          <img src={trakk_logo} alt="Trakky salon booking platform logo" />
        </div>
        <div className="profile-page-icon" onClick={handleClick}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              backgroundColor: "transparent",
              color: "#000",
            }}
          />
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
                alt="View Your Profile details"
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
    </>
  );
};

export default ProfilepageHeader;
