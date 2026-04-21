import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Phone,
  WhatsApp,
  LocationOn,
  CloudUpload,
  AccessTime,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DialpadIcon from "@mui/icons-material/Dialpad";
import { ToastContainer, toast } from "react-toastify";

const SalonSetupForm = () => {
  const main_imageInputRef = useRef(null);
  const other_imagesInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    whatsapp_no: "",
    owner_name: "",
    owner_contact_no: "",
    address: "",
    area: "",
    city: "",
    googleMapLink: "",
    openingTime: "",
    closingTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlemain_imageClick = (e) => {
    e.stopPropagation();
    main_imageInputRef.current.click();
  };

  const handleother_imagesClick = (e) => {
    e.stopPropagation();
    other_imagesInputRef.current.click();
  };

  const validateForm = () => {
    const {
      name,
      contact_no,
      whatsapp_no,
      owner_name,
      owner_contact_no,
      address,
      googleMapLink,
      openingTime,
      closingTime,
      city,
      area,
    } = formData;

    if (!name) {
      toast.error("Please input salon name.");
      return false;
    }
    if (!owner_name) {
      toast.error("Please input owner's name.");
      return false;
    }
    if (!address) {
      toast.error("Please input salon address.");
      return false;
    }

    if (!openingTime) {
      toast.error("Please input opening time.");
      return false;
    }
    if (!closingTime) {
      toast.error("Please input closing time.");
      return false;
    }

    // Validate phone numbers
    const isContactValid = contact_no.length === 10;
    const isWhatsAppValid = whatsapp_no.length === 10;
    const isOwnerContactValid = owner_contact_no.length === 10;

    if (!isContactValid) {
      toast.error("Contact number must be 10 digits.");
      return false;
    }

    if (!isWhatsAppValid) {
      toast.error("WhatsApp number must be 10 digits.");
      return false;
    }

    if (!isOwnerContactValid) {
      toast.error("Owner contact number must be 10 digits.");
      return false;
    }

    const main_image = main_imageInputRef.current.files[0];

    if (!main_image) {
      toast.error("main image must required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    setIsLoading(true);

    const main_image = main_imageInputRef.current.files[0];
    const other_images = other_imagesInputRef.current.files;
    const data = new FormData();

    // Append form data to the FormData object
    data.append("name", formData.name);
    data.append("contact_no", formData.contact_no);
    data.append("whatsapp_no", formData.whatsapp_no);
    data.append("owner_name", formData.owner_name);
    data.append("owner_contact_no", formData.owner_contact_no);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("area", formData.area);
    data.append("googleMapLink", formData.googleMapLink);
    data.append("openingTime", formData.openingTime);
    data.append("closingTime", formData.closingTime);

    const salonTimings = {
      monday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      tuesday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      wednesday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      thursday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      friday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      saturday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
      sunday: {
        open_time: formData.openingTime,
        close_time: formData.closingTime,
      },
    };
    data.append("salon_timings", JSON.stringify(salonTimings));

    // Check if images are selected and append them
    if (main_image) {
      data.append("main_image", main_image);
    }

    for (let i = 0; i < other_images.length; i++) {
      data.append("uploaded_images", other_images[i]);
    }
    console.log(other_images);
    console.log(data);

    // Log FormData content for debugging
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      let response = await fetch(
        `https://backendapi.trakky.in/salonvendor/salon-request/`,
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        toast.success("Salon setup request sent successfully.");
        // Reset form
        setFormData({
          name: "",
          contact_no: "",
          whatsapp_no: "",
          owner_name: "",
          owner_contact_no: "",
          address: "",
          city: "",
          area: "",
          googleMapLink: "",
          openingTime: "",
          closingTime: "",
        });
        main_imageInputRef.current.value = null;
        other_imagesInputRef.current.value = null;
      } else {
        toast.error(
          "Failed to send salon setup request: " + response.statusText
        );
      }
    } catch (error) {
      toast.error("Failed to send salon setup request: " + error.message);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          padding: { sx: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            width: "100%",
            background: "white",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            boxShadow: 6,
            p: 4,
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            mb={4}
            color="text.primary"
            sx={{
              color: "#333333", // Dark gray color
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Setup Your Salon
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Salon Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salon Name"
                  variant="outlined"
                  name="name"
                  onChange={handleInputChange}
                  value={formData.name}
                  placeholder="Enter salon name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DialpadIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Salon Contact No */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salon Contact No."
                  variant="outlined"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleInputChange}
                  placeholder="Enter salon contact number"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Salon WhatsApp No */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salon WhatsApp No."
                  variant="outlined"
                  name="whatsapp_no"
                  value={formData.whatsapp_no}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp number"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WhatsApp />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Salon Owner Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salon Owner Name"
                  variant="outlined"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  placeholder="Enter owner's name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Salon Owner's Contact No */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Owner's Contact No."
                  variant="outlined"
                  name="owner_contact_no"
                  value={formData.owner_contact_no}
                  onChange={handleInputChange}
                  placeholder="Enter owner's contact number"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Salon Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Salon Address"
                  variant="outlined"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter salon address"
                  multiline
                  rows={3}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="city"
                  variant="outlined"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city "
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              {/* Area */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Area"
                  variant="outlined"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Enter area "
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              {/* Google Map Link */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Map Link"
                  variant="outlined"
                  name="googleMapLink"
                  value={formData.googleMapLink}
                  onChange={handleInputChange}
                  placeholder="Enter Google Map link"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Opening Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Opening Time"
                  variant="outlined"
                  name="openingTime"
                  value={formData.openingTime}
                  type="time"
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Closing Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Closing Time"
                  variant="outlined"
                  name="closingTime"
                  value={formData.closingTime}
                  type="time"
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTime />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  color="text.primary"
                >
                  Salon Profile Images
                </Typography>

                <Grid container spacing={3}>
                  {/* Main Image Upload */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={handlemain_imageClick}
                    >
                      <IconButton
                        component="label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="file" hidden ref={main_imageInputRef} />
                        <CloudUpload
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />
                      </IconButton>
                      <Typography ml={2} color="text.secondary">
                        Main Image
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Other Images Upload */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                      onClick={handleother_imagesClick}
                    >
                      <IconButton
                        component="label"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="file"
                          multiple
                          hidden
                          ref={other_imagesInputRef}
                        />
                        <CloudUpload
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />
                      </IconButton>
                      <Typography ml={2} color="text.secondary">
                        Other Images
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Submiting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default SalonSetupForm;
