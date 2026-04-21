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
import { useConfirm } from "material-ui-confirm";
const SalonDetails = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  console.log(vendorData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [salonDetails, setSalonDetails] = useState(null);
  const [singleImage, setSingleImage] = useState(null);
  const [salonImages, setSalonImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditingSingle, setIsEditingSingle] = useState(false);
  const token = authTokens.access_token;
  const confirm = useConfirm();

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
    if (vendorData && vendorData.salon) {
      fetchSalonData();
    }
  }, [vendorData]);

  const fetchSalonData = async () => {

    if (!navigator.onLine) {
          toast.error("No Internet Connection");
          return;
        }
        
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/?salon=${vendorData.salon}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalonDetails(data.results[0]);
      setSalonImages(data.results[0]?.mul_images || []);
    } catch (e) {
      setError("Failed to fetch salon details. Please try again later.");
      toast.error("Failed to fetch salon details");
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
      Submitdata(singleImage, "single");
      setSingleImage(null); // Clear the selected single image
    }
    if (multipleImages.length > 0) {
      // Handle multiple images submission
      Submitdata(multipleImages, "multiple");
      setMultipleImages([]); // Clear the selected multiple images
    }
  };

  const Submitdata = async () => {
    const formData = new FormData();
    formData.append("main_image", singleImage);
    multipleImages.forEach((image, index) => {
      formData.append(`uploaded_images`, image); // Use the same key 'mul_images' for each image
    });

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/vendor-salon-update/${vendorData.salon}/`,
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
      setSalonImages(data.mul_images);
      toast.success("Image uploaded successfully");
      setSingleImage(null); // Clear the selected single image
      setMultipleImages([]); // Clear the selected multiple images
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSingleImageDelete = async (imageId) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this image ?`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/${vendorData.salon}/delete_main_image-pos/`,
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

      // Optionally refresh the salon details after deletion
      fetchSalonData();
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };
  const handleMulImageDelete = async (imageId) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this image?`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon/${vendorData.salon}/mulimage-pos/${imageId}/`,
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

      // Optionally refresh the salon details after deletion
      fetchSalonData();
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full p-4 bg-white profile-preview-scroll">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold">Salon Detail's</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 ">
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={256} />
          ) : (
            salonDetails && (
              <div className="mt-[5px] m-3">
                <h2 className="font-semibold mb-3">Main Image</h2>
                <div className="relative">
                  <img
                    src={salonDetails.main_image}
                    alt="Main salon"
                    className="w-full h-64 object-cover rounded-lg"
                    onClick={() => openImageModal(salonImages[0]?.image)}
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      className="text-sm bg-gray-200 bg-opacity-70 text-black rounded-full p-2"
                      onClick={() => handleOpen(true)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="text-sm bg-gray-200 bg-opacity-70 text-gray-800 rounded-full p-2"
                      onClick={() => handleSingleImageDelete(salonDetails.id)}
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
                          <span>{salonDetails.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area</span>
                          <span>{salonDetails.area || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">City</span>
                          <span>{salonDetails.city || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Offer</span>
                          <span>{salonDetails.offer_tag || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span>{salonDetails.discount || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hours</span>
                          <span>
                            {salonDetails.salon_timings
                              ? "Opens 9am -11pm"
                              : "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          <div className="m-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Other Images</h2>
              <button
                className="bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  handleOpen(null);
                }}
              >
                Upload Image
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
                : salonImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image}
                        alt={`Salon ${index + 1}`}
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
                        onClick={Submitdata}
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

export default SalonDetails;
