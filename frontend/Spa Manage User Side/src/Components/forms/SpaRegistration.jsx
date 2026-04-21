import React from "react";
import "../forms/form.css";
import { useState } from "react";
import Footer from "../Common/Footer/FooterN";
import Header from "../Common/Navbar/ProfilepageHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Link , useNavigate } from 'react-router-dom'; 
// import { Helmet } from "react-helmet";
import Signup from "../Common/Navbar/SignUp2/Signup";
import NSpaRagisterFrom from "./NSpaRagisterFrom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const SpaRegistration = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const [openSignIn, setOpenSignIn] = useState(false);

  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  document.title = "Spa Registration | Trakky";
  const [formData, setFormData] = useState({
    businessName: "",
    contactDetails: "",
    ownerName: "",
    ownerContact: "",
    whatsappNumber: "",
    city: "",
    address: "",
    otherCity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();

    const form = new FormData();
    form.append("spa_name", formData.businessName);
    form.append("spa_contact_number", formData.contactDetails);
    form.append("owner_name", formData.ownerName);
    form.append("owner_contact_number", formData.ownerContact);
    form.append("whatsapp_number", formData.whatsappNumber);
    form.append("address", formData.address);
    form.append(
      "city",
      formData.city === "other" ? formData.otherCity : formData.city
    );

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/register-spa/",
        {
          method: "POST",
          body: form,
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          toast.success("Spa registered successfully. Our team will contact you soon");
          setFormData({
            businessName: "",
            contactDetails: "",
            ownerName: "",
            ownerContact: "",
            whatsappNumber: "",
            city: "",
            address: "",
            otherCity: "",
          });

          navigate('/')
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          toast.error("An error occurred while registering the spa");
        });
    } catch (error) {
      console.log(error);
    }finally
    {
      setLoading(false);
    }
  };

  return (
    <>
      <Header handleOpenLogin={handleSignInOpen} />
      <NSpaRagisterFrom/>

      <Footer />
      <ToastContainer position="top-right" />
      <Modal
        open={openSignIn}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
      </Modal>
    </>
  );
};

export default SpaRegistration;
