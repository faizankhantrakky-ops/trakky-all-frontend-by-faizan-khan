import React, { useEffect, useState } from "react";
import "../Forms/form.css";
import Footer from "../Common/Footer/FooterN";
import Header from "../Common/Navbar/ProfilepageHeader.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NSalonRegistra from "./NSalonRegistra";
import Signup from "../Common/Header/SignUp2/Signup.jsx";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const SalonRegistration = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 786);
  const [openSignIn, setOpenSignIn] = useState(false);

  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 786);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  document.title = "Salon Registration | Trakky";

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
    e.preventDefault();

    const form = new FormData();
    form.append("salon_name", formData.businessName);
    form.append("salon_contact_number", formData.contactDetails);
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
        "https://backendapi.trakky.in/salons/register-salon/",
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      toast.success(
        "Salon registered successfully. Our team will contact you soon",
        {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        }
      );

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

      setTimeout(() => {
        navigate("/");
      }, 3001);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      toast.error("An error occurred while registering the salon");
    }
  };

  return (
    <>
      {isDesktop && <Header handleOpenLogin={handleSignInOpen} />}
      <NSalonRegistra />
      {isDesktop && <Footer />}

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

export default SalonRegistration;
