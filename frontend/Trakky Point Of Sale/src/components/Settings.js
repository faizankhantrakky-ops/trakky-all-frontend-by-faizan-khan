import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthContext from "../Context/Auth";
import "./Settings.css";
import toast, { Toaster } from "react-hot-toast";
function Settings() {
  const { user, logoutUser } = useContext(AuthContext);
  const [otp, setotp] = useState("");
  const [userData, setUserData] = useState([]);
  const [text, setText] = useState("Save & send OTP");
  const [padding, setPadding] = useState("0");
  const [open, setOpen] = useState(false);
  const [visibility, setVisibility] = useState("none");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const toggleDrawer = (newOpen) => () => {
    setPadding(newOpen ? "260px" : "0");
    setOpen(!newOpen);
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const [showPassword2, setShowPassword2] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://backendapi.trakky.in//salonvendor/vendor/${user.user_id}/`
      );
      if (response.ok) {
        const jsonData = await response.json();
        setUserData(jsonData);
      } else {
        console.log("error");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ph_number: userData.ph_number }),
      });

      if (response.ok) {
        toast.success("OTP sent successfully");
      } else {
        toast.error("Please try again, failed to sent OTP");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sentOTP = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salonvendor/otp/", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ph_number: userData.ph_number,
          otp: otp,
          new_password: confPass,
        }),
      });
      if (response.ok) {
        toast.success("OTP verified");
        toast.success("Password changed successfully");
        setPass("");
        setConfPass("");
        setotp("");
        logoutUser();
      } else {
        toast.error("Please try again, some error occured");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <>
      <Toaster />
    

      <div
        className="settingsPOS"
        style={{ paddingBlock: "30px", overflow: "auto" }}
      >
        <div className="formMyinfoPOS_setting">
          <h2>Edit your information</h2>
          <span className="Input_fieldPOS_settings">
            <TextField
              value={userData.ownername}
              focused={true}
              id="outlined-basic"
              label="Username"
              variant="outlined"
            />
          </span>
          <span className="Input_fieldPOS_settings">
            <TextField
              focused={true}
              value={userData.email ? userData.email : "Not Provided"}
              id="outlined-basic"
              label="Email"
              variant="outlined"
            />
          </span>
          <span className="Input_fieldPOS_settings">
            <TextField
              focused={true}
              value={userData.ph_number ? userData.ph_number : "Not Provided"}
              id="outlined-basic"
              label="Mobile no"
              variant="outlined"
              type="number"
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                }
              }}
            />
          </span>
          <span className="Input_fieldPOS_settings">
            <FormControl variant="outlined" className="w-[400px]">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />

              {/* </FormControl>
          </span>
          <span className="Input_fieldPOS_settings">
          <FormControl variant="outlined" className="w-[400px]">
          <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
          <OutlinedInput
            value={confPass}
            onChange={(e)=>{setConfPass(e.target.value)}}
            id="outlined-adornment-password"
            type={showPassword2 ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword2}
                  edge="end"
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          /> */}
            </FormControl>
          </span>
          <span
            className="Input_fieldPOS_settings last_Input_fieldPOS_settings"
            style={{
              alignItems: "center",
              display: visibility,
              justifyContent: "space-between",
              width: "400px",
            }}
          >
            <TextField
              value={otp}
              onChange={(e) => {
                setotp(e.target.value);
              }}
              className="OTP_POS_settings"
              id="outlined-basic"
              label="OTP"
              variant="outlined"
              style={{ width: "200px" }}
            />{" "}
            <span
              style={{ color: "#512DC8", cursor: "pointer" }}
              onClick={handleSubmit}
            >
              Resend OTP
            </span>
          </span>
          <button
            className="btn_SaveEditProfilePOS"
            onClick={text === "Save & send OTP" ? handleSubmit : sentOTP}
          >
            {text}
          </button>
        </div>
      </div>
    </>
  );
}

export default Settings;
