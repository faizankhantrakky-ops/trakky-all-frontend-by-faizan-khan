import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import toast, { Toaster } from "react-hot-toast";
import { FiImage, FiVideo, FiUploadCloud, FiCheck, FiX, FiLoader, FiAlertCircle } from "react-icons/fi";

const AddClientWorkPhoto = () => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [categoryList, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [service_name, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectSalonId, setSelectSalonId] = useState("");

  const [isCitySelected, setIsCitySelected] = useState(false);
  const [isSalonSelected, setIsSalonSelected] = useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // File states
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  const [previewImg, setPreviewImg] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  // Error states for file sizes
  const [fileErrors, setFileErrors] = useState({
    image: null,
    video: null,
    thumbnail: null
  });

  // Refs for file inputs
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // Load cities
  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    setIsLoadingCities(true);
    let url = `https://backendapi.trakky.in/salons/city/`;

    try {
      const response = await fetch(url);
      
      // Check for 413 error
      if (response.status === 413) {
        toast.error("Response payload too large. Please contact support.", {
          duration: 5000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" }
        });
        setCity([]);
        setCityPayload([]);
        return;
      }

      const data = await response.json();
      
      // Check if payload is too large
      if (data?.payload && data.payload.length > 1000) {
        toast.warning("Large city list detected. Showing first 100 cities.", {
          duration: 4000,
          position: "top-center"
        });
        const limitedCities = data.payload.slice(0, 100);
        setCityPayload(limitedCities);
        let city = limitedCities.map((item) => item.name);
        setCity(city);
      } else {
        setCityPayload(data?.payload || []);
        let city = data?.payload?.map((item) => item.name) || [];
        setCity(city);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      toast.error("Failed to load cities. Please refresh the page.", {
        duration: 4000,
        position: "top-center"
      });
      setCity([]);
      setCityPayload([]);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Load categories
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://backendapi.trakky.in/salons/category/",
        requestOption
      );

      // Handle 413 error
      if (response.status === 413) {
        toast.error("Category data too large. Please refine your search.", {
          duration: 5000,
          position: "top-center"
        });
        setCategoryList([]);
        return;
      }

      if (response.status === 200) {
        const data = await response.json();
        
        // Check if categories array is too large
        if (Array.isArray(data) && data.length > 500) {
          toast.warning("Large category list. Some categories may be limited.", {
            duration: 4000,
            position: "top-center"
          });
          setCategoryList(data.slice(0, 500));
        } else {
          setCategoryList(data);
        }
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
        logoutUser();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch category list. Please try again.", {
        duration: 4000,
        position: "top-center"
      });
      setCategoryList([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Filter categories based on city and gender
  useEffect(() => {
    if (selectedCity && selectedGender && categoryList.length > 0) {
      try {
        const filtered = categoryList.filter(
          (category) =>
            category.city === selectedCity &&
            category.category_gender?.toLowerCase() === selectedGender.toLowerCase()
        );
        
        if (filtered.length === 0) {
          toast.info("No categories found for selected city and gender", {
            duration: 3000,
            position: "top-center",
            icon: "🔍"
          });
        }
        
        setFilteredCategoryList(filtered);
        setCategoryId(""); // Reset category
      } catch (error) {
        console.error("Error filtering categories:", error);
        setFilteredCategoryList([]);
        toast.error("Error loading categories. Please refresh.");
      }
    } else {
      setFilteredCategoryList([]);
    }
  }, [selectedCity, selectedGender, categoryList]);

  // Load salons with error handling for large responses
  const loadSalons = async (inputValue, callback) => {
    if (!selectedCity) {
      callback([]);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      // Handle 413 error
      if (response.status === 413) {
        toast.error("Salon list too large. Please be more specific in your search.", {
          duration: 4000,
          position: "top-center"
        });
        callback([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Limit results if too many
      let results = data?.results || [];
      if (results.length > 50) {
        toast.warning(`Found ${results.length} salons. Showing first 50 results.`, {
          duration: 3000,
          position: "top-center"
        });
        results = results.slice(0, 50);
      }

      const options = results.map((salon) => ({
        value: salon.id,
        label: salon.name,
      }));

      callback(options);
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Request timeout. Please try again.", {
          duration: 3000,
          position: "top-center"
        });
      } else {
        console.error("Error fetching salons:", error);
        toast.error("Failed to load salons. Please try again.", {
          duration: 3000,
          position: "top-center"
        });
      }
      callback([]);
    }
  };

  const handleCityChange = (e) => {
    const cityValue = e.target.value;
    setSelectedCity(cityValue);
    setIsCitySelected(true);
    resetDependentFields();
  };

  const handleGenderChange = (e) => {
    const genderValue = e.target.value;
    setSelectedGender(genderValue);
    setCategoryId("");
  };

  const resetDependentFields = () => {
    setSelectedSalons(null);
    setSelectSalonId("");
    setSelectedGender("");
    setCategoryId("");
    setIsSalonSelected(false);
  };

  // File validation with size limits
  const validateFile = (file, type) => {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      video: 50 * 1024 * 1024, // 50MB
      thumbnail: 5 * 1024 * 1024 // 5MB
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      video: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
      thumbnail: ['image/jpeg', 'image/png', 'image/jpg']
    };

    if (file.size > maxSizes[type]) {
      const sizeInMB = maxSizes[type] / (1024 * 1024);
      return `File too large. Maximum size is ${sizeInMB}MB`;
    }

    if (!allowedTypes[type].includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`;
    }

    return null;
  };

  // === FILE HANDLERS ===
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'image');
      if (error) {
        setFileErrors(prev => ({ ...prev, image: error }));
        toast.error(error);
        if (imgInputRef.current) imgInputRef.current.value = "";
        return;
      }

      setFileErrors(prev => ({ ...prev, image: null }));
      setImg(file);
      setPreviewImg(URL.createObjectURL(file));
      
      // Reset video and thumbnail when image is selected
      setVideo(null);
      setPreviewVideo(null);
      setVideoThumbnail(null);
      setPreviewThumbnail(null);
      
      // Clear file inputs
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    } else {
      setImg(null);
      setPreviewImg(null);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'video');
      if (error) {
        setFileErrors(prev => ({ ...prev, video: error }));
        toast.error(error);
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      setFileErrors(prev => ({ ...prev, video: null }));
      setVideo(file);
      setPreviewVideo(URL.createObjectURL(file));
    } else {
      setVideo(null);
      setPreviewVideo(null);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateFile(file, 'thumbnail');
      if (error) {
        setFileErrors(prev => ({ ...prev, thumbnail: error }));
        toast.error(error);
        if (thumbInputRef.current) thumbInputRef.current.value = "";
        return;
      }

      setFileErrors(prev => ({ ...prev, thumbnail: null }));
      setVideoThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    } else {
      setVideoThumbnail(null);
      setPreviewThumbnail(null);
    }
  };

  // === REMOVE HANDLERS ===
  const removeImage = () => {
    setImg(null);
    setPreviewImg(null);
    setFileErrors(prev => ({ ...prev, image: null }));
    if (imgInputRef.current) imgInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideo(null);
    setPreviewVideo(null);
    setFileErrors(prev => ({ ...prev, video: null }));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeThumbnail = () => {
    setVideoThumbnail(null);
    setPreviewThumbnail(null);
    setFileErrors(prev => ({ ...prev, thumbnail: null }));
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // Submit handler with enhanced error handling for 413
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: At least one media (image or video)
    if (!img && !video) {
      toast.error("Please select an image or video", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" }
      });
      return;
    }

    // Check if category is selected
    if (!categoryId) {
      toast.error("Please select a category", {
        duration: 4000,
        position: "top-center"
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Submitting... Please wait", {
      position: "top-center",
    });

    try {
      const formData = new FormData();
      formData.append("category", categoryId);
      formData.append("service", service_name || "");
      formData.append("description", description || "");
      formData.append("salon", selectSalonId);

      // Only append image if selected
      if (img) {
        formData.append("client_image", img);
      }

      // Only append video and thumbnail if video is selected
      if (video) {
        formData.append("video", video);
        if (videoThumbnail) {
          formData.append("video_thumbnail_image", videoThumbnail);
        }
      }

      formData.append("active_status", true);

      const requestOption = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      };

      const response = await fetch(
        `https://backendapi.trakky.in/salons/client-image/`,
        requestOption
      );

      // Handle 413 error specifically
      if (response.status === 413) {
        toast.error("File size too large. Please compress your files and try again.", {
          duration: 5000,
          position: "top-center"
        });
        throw new Error("Payload too large");
      }

      const data = await response.json();

      if (response.ok) {
        toast.success("Client Work Photo Added Successfully", {
          duration: 3000,
          position: "top-center",
        });

        // Clear only these fields
        setServiceName("");
        setDescription("");

        // File & Previews
        setImg(null);
        setVideo(null);
        setVideoThumbnail(null);
        setPreviewImg(null);
        setPreviewVideo(null);
        setPreviewThumbnail(null);
        setFileErrors({ image: null, video: null, thumbnail: null });

        // Clear file inputs
        if (imgInputRef.current) imgInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (thumbInputRef.current) thumbInputRef.current.value = "";

        // Keep these fields (no clear)
        // selectedCity, selectedSalons, selectSalonId, selectedGender, categoryId
        // isCitySelected, isSalonSelected remain

      } else {
        // Handle specific error messages
        if (data.message) {
          toast.error(data.message);
        } else if (data.error) {
          toast.error(data.error);
        } else {
          throw new Error("Submission failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      
      if (error.message === "Payload too large") {
        toast.error("Files are too large. Please reduce file sizes and try again.", {
          duration: 5000,
          position: "top-center"
        });
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast.error("Network error. Please check your connection and try again.", {
          duration: 4000,
          position: "top-center"
        });
      } else {
        toast.error("Failed to submit. Please try again.", {
          duration: 4000,
          position: "top-center"
        });
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }} 
      />

      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiImage className="w-6 h-6 text-indigo-600" />
              Add Client Work Photo
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Upload images or videos of client work. Ensure salon and category match the selected city and gender.
            </p>
            <p className="mt-1 text-xs text-red-500">
              Note: Maximum image size: 10MB | Maximum video size: 50MB | Maximum thumbnail size: 5MB
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                required
                disabled={isLoadingCities}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingCities ? "Loading cities..." : "Choose City"}
                </option>
                {city.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {isLoadingCities && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <FiLoader className="animate-spin" />
                  Loading cities...
                </div>
              )}
            </div>

            {/* Salon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Salon <span className="text-red-500">*</span>
                <p className="text-xs text-gray-500 mt-1">Salon must belong to selected city</p>
              </label>
              <AsyncSelect
                isDisabled={!selectedCity}
                cacheOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                  setIsSalonSelected(true);
                  setSelectedGender("");
                  setCategoryId("");
                }}
                placeholder={selectedCity ? "Search salon by name..." : "Select a city first"}
                noOptionsMessage={() => (selectedCity ? "No salons found" : "Select a city first")}
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    padding: "0.125rem",
                    fontSize: "0.875rem",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#6366f1" },
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                  option: (base, state) => ({
                    ...base,
                    fontSize: "0.875rem",
                    backgroundColor: state.isSelected ? "#6366f1" : state.isFocused ? "#eef2ff" : "white",
                    color: state.isSelected ? "white" : "#374151",
                  }),
                }}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Gender <span className="text-red-500">*</span>
                <p className="text-xs text-gray-500 mt-1">Select city and salon first</p>
              </label>
              <select
                value={selectedGender}
                onChange={handleGenderChange}
                disabled={!isSalonSelected}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category <span className="text-red-500">*</span>
                <p className="text-xs text-gray-500 mt-1">Category must belong to selected salon and gender</p>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!selectedGender || filteredCategoryList.length === 0 || isLoadingCategories}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingCategories 
                    ? "Loading categories..." 
                    : filteredCategoryList.length === 0 
                      ? "No categories available" 
                      : "Choose Category"}
                </option>
                {filteredCategoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.category_gender}) ({category.city})
                  </option>
                ))}
              </select>
              {isLoadingCategories && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <FiLoader className="animate-spin" />
                  Loading categories...
                </div>
              )}
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name (Optional)
              </label>
              <input
                type="text"
                value={service_name}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Haircut Special"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work..."
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image <span className="text-red-500">* (Either Image or Video required)</span>
                <p className="text-xs text-gray-500">Recommended 1:1 Ratio | Max size: 10MB</p>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="img" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload image</span>
                      <input
                        id="img"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                        ref={imgInputRef}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
              {fileErrors.image && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle /> {fileErrors.image}
                </div>
              )}
              {previewImg && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <img src={previewImg} alt="Preview" className="max-h-40 mx-auto rounded-md shadow-sm" />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video (Optional)
                <p className="text-xs text-gray-500">Max size: 50MB | Recommended: MP4</p>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiVideo className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="video" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload video</span>
                      <input
                        id="video"
                        type="file"
                        accept="video/mp4,video/mov,video/avi,video/webm"
                        onChange={handleVideoChange}
                        className="sr-only"
                        ref={videoInputRef}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4, MOV, AVI, WEBM up to 50MB</p>
                </div>
              </div>
              {fileErrors.video && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle /> {fileErrors.video}
                </div>
              )}
              {previewVideo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <video controls className="max-h-40 mx-auto rounded-md shadow-sm">
                    <source src={previewVideo} />
                  </video>
                  <button
                    type="button"
                    onClick={removeVideo}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Video Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Thumbnail (Optional)
                <p className="text-xs text-gray-500">Max size: 5MB</p>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiImage className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="videoThumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload thumbnail</span>
                      <input
                        id="videoThumbnail"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleThumbnailChange}
                        className="sr-only"
                        ref={thumbInputRef}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
              {fileErrors.thumbnail && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle /> {fileErrors.thumbnail}
                </div>
              )}
              {previewThumbnail && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <img src={previewThumbnail} alt="Thumb" className="max-h-40 mx-auto rounded-md shadow-sm" />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || (!img && !video)}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 mr-2" />
                    Add Client Work
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddClientWorkPhoto;