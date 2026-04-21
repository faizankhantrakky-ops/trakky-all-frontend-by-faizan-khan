import React, { useState } from "react";
import whatsappIcon from "../../../Assets/images/icons/whatsapp_icon2.svg";
import "./WhatsAppButton.css"; // Your WhatsApp button styles
import SigninForms from "../Header/signupsigninforms/SigninForms";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthContext from "../../../context/Auth";
import WhatsappForm from "./WhatsappForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "none",
  outline: "none",
};

const WhatsAppButton = () => {
  let { isAuthenticated } = React.useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="whatsapp-button" onClick={handleOpen}>
        <img src={whatsappIcon} alt="Connect with trakky" />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <WhatsappForm />
        </Box>
      </Modal>
    </>
  );
};

export default WhatsAppButton;
