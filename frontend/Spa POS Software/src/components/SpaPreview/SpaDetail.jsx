import React, { useEffect, useState, useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer } from "react-toastify";
import { Skeleton } from "@mui/material";
import AuthContext from "../../Context/Auth";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@mui/material/Modal";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
const SpaDetails = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  console.log(vendorData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [spaDetails, setSpaDetails] = useState(null);
  const [singleImage, setSingleImage] = useState(null);
  const [spaImages, setSpaImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditingSingle, setIsEditingSingle] = useState(false);
  const token = authTokens.access_token;

  const handleOpen = (isEditingSingle = false) => {
    setIsEditingSingle(isEditingSingle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditingSingle(false);
  };

  useEffect(() => {
    console.log("Vendor Data in useEffect:", vendorData); // Log vendor data for debugging
    if (vendorData && vendorData.spa) {
      fetchSpaData();
    }
  }, [vendorData]);

  const fetchSpaData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/?spa_id=${vendorData.spa}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSpaDetails(data.results[0]);
      setSpaImages(data.results[0]?.mul_images || []);
    } catch (e) {
      setError("Failed to fetch spa details. Please try again later.");
      toast.error("Failed to fetch spa details");
    } finally {
      setIsLoading(false);
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const [multipleImages, setMultipleImages] = useState([]);

  const handleSingleFileChange = (event) => {
    const file = event.target.files[0];
    setSingleImage(file);
  };

  const handleMultipleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMultipleImages(files);
  };

  const handleAdd = () => {
    if (singleImage) {
      // Handle single image submission
      handleSubmit(singleImage, "single");
      setSingleImage(null); // Clear the selected single image
    }
    if (multipleImages.length > 0) {
      // Handle multiple images submission
      handleSubmit(multipleImages, "multiple");
      setMultipleImages([]); // Clear the selected multiple images
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    // formData.append("main_image", singleImage);
    if (singleImage) {
      formData.append("main_image", singleImage);
    }
    if (multipleImages.length > 0) {
      multipleImages.forEach((image, index) => {
        formData.append(`uploaded_images`, image);
      });
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/vendor-spa-update/${vendorData.spa}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      fetchSpaData();
      toast.success("Image uploaded successfully");
      setSingleImage(null);
      setMultipleImages([]);
      handleClose();
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSingleImageDelete = async (imageId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${vendorData.spa}/delete_main_image-pos/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify({ main_image: imageId }), // Pass the image ID to delete
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally refresh the spa details after deletion
      fetchSpaData();
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };
  const handleMulImageDelete = async (imageId) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/spa/${vendorData.spa}/mulimage-pos/${imageId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: JSON.stringify({ mul_images: [imageId] }), // Pass the image ID to delete
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally refresh the spa details after deletion
      fetchSpaData();
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="w-full p-4 bg-white profile-preview-scroll">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold">Spa details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={256} />
          ) : (
            spaDetails && (
              <div className="mt-[5px]">
                <h2 className="font-semibold mb-2">Main Image</h2>
                <div className="relative">
                  <img
                    src={spaDetails.main_image}
                    alt="Main spa"
                    className="w-full h-64 object-cover rounded-lg"
                    onClick={() => openImageModal(spaImages[0]?.image)}
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      className="text-sm bg-gray-200 bg-opacity-70 text-black rounded-full p-2"
                      onClick={() => handleOpen(true)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="text-sm bg-gray-200 bg-opacity-70 text-black rounded-full p-2"
                      onClick={() => handleSingleImageDelete(spaDetails.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={150}
                          height={20}
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name</span>
                          <span>{spaDetails.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area</span>
                          <span>{spaDetails.area || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">City</span>
                          <span>{spaDetails.city || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Offer</span>
                          <span>{spaDetails.offer_tag || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span>{spaDetails.discount || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hours</span>
                          <span>
                            {spaDetails.spa_timings ? "Opens 9am -11pm" : "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Other Images</h2>
              <button
                className="bg-black text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  handleOpen(null);
                }}
              >
                Upload image
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width="100%"
                      height={128}
                    />
                  ))
                : spaImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image}
                        alt={`Spa ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onClick={() => openImageModal(image.image)}
                      />
                      <div className="absolute top-2 right-2 space-x-2">
                        <button className="w-6 h-6 bg-gray-200 bg-opacity-70 text-black rounded-full p-2 flex items-center justify-center">
                          <DeleteIcon
                            className="w-2 h-2"
                            style={{ fontSize: "15px" }}
                            onClick={() => handleMulImageDelete(image.id)}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 profile-preview-scroll">
          <div className="relative p-5 rounded-lg shadow-lg">
            <img
              src={selectedImage}
              alt="Full view"
              className="w-auto h-auto max-w-full max-h-[80vh] p-5 rounded-lg object-contain"
            />
            <button
              className="absolute top-2 right-2 text-white rounded-full p-2 focus:outline-none"
              onClick={closeImageModal}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }} // Start position
          animate={{ y: 0, opacity: 1 }} // End position
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className="flex justify-center items-center w-full h-[50vh] p-4 sm:p-8">
            <div className="w-full max-w-[768px] p-8 bg-white shadow-lg rounded-lg">
              <div className="pb-2 flex justify-between items-center">
                <p className="text-xl font-bold text-center">
                  {isEditingSingle ? "Edit Main Image" : "Upload New Image"}
                </p>
                <span onClick={handleClose} className="cursor-pointer">
                  <CloseIcon />
                </span>
              </div>
              <div className="space-y-4 mt-3">
                <div className="space-y-4">
                  <div className="flex gap-4 flex-col">
                    <FormControl fullWidth variant="outlined">
                      <TextField
                        id="single-image-input"
                        type="file"
                        inputProps={{ accept: "image/*" }} // Accept only image files
                        onChange={handleSingleFileChange}
                        InputLabelProps={{ shrink: true }} // Keeps the label above the input
                        InputProps={{
                          // Change to endAdornment
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body2" color="textSecondary">
                                Single Image
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>

                    {isEditingSingle ? (
                      ""
                    ) : (
                      <FormControl fullWidth variant="outlined">
                        <TextField
                          id="multiple-image-input"
                          type="file"
                          inputProps={{ accept: "image/*", multiple: true }} // Accept only image files
                          onChange={handleMultipleFileChange}
                          InputLabelProps={{ shrink: true }} // Keeps the label above the input
                          InputProps={{
                            // Change to endAdornment
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Multiple Images
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => {
                          handleClose();
                        }}
                        s
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        Cancel
                      </button>

                      <button
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                        onClick={handleSubmit}
                        style={{ borderRadius: "6px", minWidth: "100px" }}
                      >
                        {isLoading ? "Uploading..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Toaster />
            </div>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default SpaDetails;
