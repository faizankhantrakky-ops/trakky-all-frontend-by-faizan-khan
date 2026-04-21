import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Avatar,
  IconButton,
  FormHelperText,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AddMembership = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    packageName: "",
    type: "",
    price: "",
    duration: "",
    maxBookings: "",
    status: "Active",
    services: "",
    image: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});

  const membershipTypes = [
    "Monthly",
    "Quarterly",
    "Annual",
    "Lifetime",
    "Weekend",
    "One-Time",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please upload a valid image" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image must be under 5MB" }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.packageName) newErrors.packageName = "Package name is required";
    if (!formData.type) newErrors.type = "Please select a type";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Enter a valid price";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.maxBookings || isNaN(formData.maxBookings))
      newErrors.maxBookings = "Enter valid max bookings";
    if (!formData.services) newErrors.services = "List at least one service";
    if (!formData.image) newErrors.image = "Please upload an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate API call
    console.log("New Membership Package:", formData);
    alert("Membership package added successfully!");

    // Reset form
    setFormData({
      packageName: "",
      type: "",
      price: "",
      duration: "",
      maxBookings: "",
      status: "Active",
      services: "",
      image: null,
      imagePreview: null,
    });

    // Navigate back
    navigate("/membership-list");
  };

  const handleReset = () => {
    setFormData({
      packageName: "",
      type: "",
      price: "",
      duration: "",
      maxBookings: "",
      status: "Active",
      services: "",
      image: null,
      imagePreview: null,
    });
    setErrors({});
  };

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      backgroundColor: "#f5f7fa", 
      minHeight: "100vh" 
    }}>
      <Card elevation={4} sx={{ 
        mx: "auto", 
        borderRadius: { xs: 2, sm: 3 },
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              background: "linear-gradient(135deg, #2c3e50 0%, #502DA6 100%)",
              color: "white",
              borderRadius: { xs: "8px 8px 0 0", sm: "12px 12px 0 0" },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: { xs: 1, sm: 1.5, md: 2 } 
            }}>
              <IconButton
                onClick={() => navigate("/membership-list")}
                sx={{ 
                  color: "white",
                  p: { xs: 0.5, sm: 0.75, md: 1 },
                }}
              >
                <ArrowBackIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
              <Box>
                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {isMobile ? 'Add Package' : 'Add New Membership Package'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                    mt: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  {isMobile 
                    ? 'Create new membership plan' 
                    : 'Create a new membership plan for customers'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form */}
          <Box sx={{ 
            p: { xs: 2, sm: 3, md: 4 } 
          }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {/* Package Name */}
                <TextField
                  fullWidth
                  label="Package Name"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  error={!!errors.packageName}
                  helperText={errors.packageName}
                  placeholder="e.g. Gold Annual"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiInputLabel-root': { 
                      fontSize: { xs: '0.8rem', sm: '1rem' } 
                    },
                    '& .MuiInputBase-input': { 
                      fontSize: { xs: '0.8rem', sm: '1rem' } 
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    },
                  }}
                />

                {/* Type & Price */}
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  spacing={{ xs: 2, sm: 2 }}
                >
                  <FormControl 
                    fullWidth 
                    error={!!errors.type}
                    size={isMobile ? "small" : "medium"}
                  >
                    <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                      Membership Type
                    </InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Membership Type"
                      sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                    >
                      {membershipTypes.map((type) => (
                        <MenuItem 
                          key={type} 
                          value={type}
                          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                        >
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.type && (
                      <FormHelperText sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        {errors.type}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Price (₹)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={!!errors.price}
                    helperText={errors.price || (isMobile ? "e.g. 12000" : "e.g. 12000")}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{ inputProps: { min: 0 } }}
                    sx={{
                      '& .MuiInputLabel-root': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      },
                    }}
                  />
                </Stack>

                {/* Duration & Max Bookings */}
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  spacing={{ xs: 2, sm: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    error={!!errors.duration}
                    helperText={errors.duration || (isMobile ? "e.g. 365 days" : "e.g. 365 days")}
                    placeholder="365 days"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiInputLabel-root': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Max Bookings"
                    name="maxBookings"
                    type="number"
                    value={formData.maxBookings}
                    onChange={handleInputChange}
                    error={!!errors.maxBookings}
                    helperText={errors.maxBookings || (isMobile ? "e.g. 60" : "e.g. 60 or 'Unlimited'")}
                    placeholder="60"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      '& .MuiInputLabel-root': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: '0.8rem', sm: '1rem' } 
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      },
                    }}
                  />
                </Stack>

                {/* Services */}
                <TextField
                  fullWidth
                  label="Services Included"
                  name="services"
                  multiline
                  rows={isMobile ? 2 : 3}
                  value={formData.services}
                  onChange={handleInputChange}
                  error={!!errors.services}
                  helperText={
                    errors.services ||
                    (isMobile 
                      ? "Comma-separated services" 
                      : "Comma-separated: Haircut, Spa, Facial, etc."
                    )
                  }
                  placeholder="Haircut, Spa, Facial, Massage"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiInputLabel-root': { 
                      fontSize: { xs: '0.8rem', sm: '1rem' } 
                    },
                    '& .MuiInputBase-input': { 
                      fontSize: { xs: '0.8rem', sm: '1rem' } 
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    },
                  }}
                />

                {/* Status */}
                <FormControl 
                  size={isMobile ? "small" : "medium"}
                >
                  <InputLabel sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                    Status
                  </InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                    sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                  >
                    <MenuItem 
                      value="Active"
                      sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                    >
                      Active
                    </MenuItem>
                    <MenuItem 
                      value="Pending"
                      sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                    >
                      Pending
                    </MenuItem>
                    <MenuItem 
                      value="Inactive"
                      sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                    >
                      Inactive
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Image Upload */}
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600} 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } 
                    }}
                  >
                    Package Image
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      textAlign: "center",
                      borderStyle: "dashed",
                      borderColor: errors.image ? "error.main" : "grey.400",
                      bgcolor: "grey.50",
                    }}
                  >
                    {formData.imagePreview ? (
                      <Box>
                        <Avatar
                          src={formData.imagePreview}
                          variant="rounded"
                          sx={{ 
                            width: { xs: 80, sm: 100, md: 120 }, 
                            height: { xs: 80, sm: 100, md: 120 }, 
                            mx: "auto", 
                            mb: { xs: 1, sm: 2 } 
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                            wordBreak: 'break-all',
                            px: { xs: 1, sm: 2 },
                          }}
                        >
                          {formData.image.name.length > 30 
                            ? `${formData.image.name.substring(0, 25)}...` 
                            : formData.image.name
                          }
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <PhotoCamera sx={{ 
                          fontSize: { xs: 36, sm: 40, md: 48 }, 
                          color: "grey.500" 
                        }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 1,
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          }}
                        >
                          {isMobile 
                            ? 'Tap to upload' 
                            : 'Drag & drop or click to upload'
                          }
                        </Typography>
                      </Box>
                    )}
                    <input
                      accept="image/*"
                      type="file"
                      id="image-upload"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCamera sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                        sx={{ 
                          mt: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 1.5, sm: 2 },
                        }}
                        fullWidth={isMobile}
                      >
                        {isMobile ? 'Upload' : 'Choose Image'}
                      </Button>
                    </label>
                    {errors.image && (
                      <FormHelperText 
                        error 
                        sx={{ 
                          mt: 1,
                          fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        }}
                      >
                        {errors.image}
                      </FormHelperText>
                    )}
                  </Paper>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction={{ xs: 'column-reverse', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2 }}
                  justifyContent="flex-end"
                  sx={{ mt: { xs: 3, sm: 4 } }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ 
                      textTransform: "none",
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1, sm: 1.5 },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    fullWidth={isMobile}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      textTransform: "none",
                      px: { xs: 2, sm: 3, md: 4 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      py: { xs: 1, sm: 1.5 },
                      backgroundColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1565c0" },
                      width: { xs: '100%', sm: 'auto' },
                    }}
                    fullWidth={isMobile}
                  >
                    {isMobile ? 'Add' : 'Add Package'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddMembership;