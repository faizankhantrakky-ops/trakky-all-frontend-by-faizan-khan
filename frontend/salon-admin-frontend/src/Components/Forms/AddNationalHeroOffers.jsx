import React, { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddNationalHeroOffers = ({
  nationalHeroOfferData,
  closeModal,
  onUpdateSuccess,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  // === FILE STATES ===
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  const [previewImg, setPreviewImg] = useState(nationalHeroOfferData?.image || null);
  const [previewVideo, setPreviewVideo] = useState(nationalHeroOfferData?.video || null);
  const [previewThumbnail, setPreviewThumbnail] = useState(nationalHeroOfferData?.video_thumbnail_image || null);

  // Refs for file input reset
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // === FORM FIELDS ===
  const [name, setName] = useState(nationalHeroOfferData?.name || "");
  const [actualPrice, setActualPrice] = useState(nationalHeroOfferData?.actual_price || "");
  const [discountPrice, setDiscountPrice] = useState(nationalHeroOfferData?.discount_price || "");
  const [terms, setTerms] = useState(nationalHeroOfferData?.terms_and_conditions || "");
  const [selectedCity, setSelectedCity] = useState(nationalHeroOfferData?.city || "");
  const [city, setCity] = useState([]);
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (nationalHeroOfferData) {
      return {
        value: nationalHeroOfferData.salon,
        label: nationalHeroOfferData.salon_name,
      };
    }
    return null;
  });
  const [selectSalonId, setSelectSalonId] = useState(nationalHeroOfferData?.salon || "");
  const [isNationalOffers, setIsNationalOffers] = useState(nationalHeroOfferData?.is_national || false);

  // === FILE HANDLERS ===
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setPreviewImg(URL.createObjectURL(file));
    } else {
      setImg(null);
      setPreviewImg(nationalHeroOfferData?.image || null);
    }
    if (imgInputRef.current) imgInputRef.current.value = "";
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreviewVideo(URL.createObjectURL(file));
    } else {
      setVideo(null);
      setPreviewVideo(nationalHeroOfferData?.video || null);
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    } else {
      setVideoThumbnail(null);
      setPreviewThumbnail(nationalHeroOfferData?.video_thumbnail_image || null);
    }
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // === REMOVE HANDLERS ===
  const removeImage = () => {
    setImg(null);
    setPreviewImg(null);
    if (imgInputRef.current) imgInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideo(null);
    setPreviewVideo(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeThumbnail = () => {
    setVideoThumbnail(null);
    setPreviewThumbnail(null);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("city", selectedCity);
    formData.append("salon", selectSalonId);
    formData.append("is_national", isNationalOffers);
    formData.append("name", name);
    formData.append("actual_price", actualPrice || 0);
    formData.append("discount_price", discountPrice);
    formData.append("terms_and_conditions", terms);

    // Only append if new file is selected
    if (img) formData.append("image", img);
    if (video) formData.append("video", video);
    if (videoThumbnail) formData.append("video_thumbnail_image", videoThumbnail);

    // If user removed existing media, send empty string to clear it on backend
    if (!img && previewImg === null && nationalHeroOfferData?.image) {
      formData.append("image", "");
    }
    if (!video && previewVideo === null && nationalHeroOfferData?.video) {
      formData.append("video", "");
    }
    if (!videoThumbnail && previewThumbnail === null && nationalHeroOfferData?.video_thumbnail_image) {
      formData.append("video_thumbnail_image", "");
    }

    const isUpdate = !!nationalHeroOfferData;
    const method = isUpdate ? "PATCH" : "POST";
    const url = isUpdate
      ? `https://backendapi.trakky.in/salons/national-hero-offers/${nationalHeroOfferData.id}/`
      : `https://backendapi.trakky.in/salons/national-hero-offers/`;

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(isUpdate ? "Updated successfully!" : "Added successfully!", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
        if (isUpdate && onUpdateSuccess) onUpdateSuccess(result);
        if (!isUpdate) resetForm();
        if (closeModal) closeModal();
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired.", { style: { background: "#ef4444", color: "#fff" } });
      } else {
        const err = await response.json().catch(() => ({}));
        const msg = Object.values(err).flat().join(" ") || "Something went wrong.";
        toast.error(msg, { style: { background: "#ef4444", color: "#fff" } });
      }
    } catch (err) {
      toast.error("Network error. Try again.", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  const resetForm = () => {
    setImg(null); setVideo(null); setVideoThumbnail(null);
    setPreviewImg(null); setPreviewVideo(null); setPreviewThumbnail(null);
    setName(""); setActualPrice(""); setDiscountPrice(""); setTerms("");
    setIsNationalOffers(false);

    [imgInputRef, videoInputRef, thumbInputRef].forEach(ref => {
      if (ref.current) ref.current.value = "";
    });
  };

  // Load Cities
  const getCity = async () => {
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/city/`);
      const data = await res.json();
      setCity(data?.payload?.map((c) => c.name) || []);
    } catch (err) {
      toast.error("Failed to load cities");
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // === Async Load Salons (Updated with Salon Name - Area format) ===
  const loadSalons = async (inputValue, callback) => {
    if (!inputValue || !selectedCity) return callback([]);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}&city=${selectedCity}`
      );
      const data = await res.json();
      const options = data?.results?.map((s) => ({
        value: s.id,
        label: `${s.name} - ${s.area}`, // Changed to include area
        originalName: s.name,
        area: s.area
      })) || [];
      callback(options);
    } catch (err) {
      callback([]);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {nationalHeroOfferData ? "Update" : "Add"} National Hero Offer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {nationalHeroOfferData ? "Modify existing offer" : "Create a new featured promotion"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Offer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Independence Day Special"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual Price</label>
                <input
                  type="number"
                  value={actualPrice}
                  onChange={(e) => setActualPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="2999"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select City <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedSalons(null);
                  setSelectSalonId("");
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Choose City</option>
                {city.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Salon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Salon</label>
              <AsyncSelect
                isDisabled={!selectedCity}
                cacheOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                }}
                placeholder="Search salon by name..."
                noOptionsMessage={() => (selectedCity ? "No salons found" : "Select a city first")}
                className="text-sm"
                styles={selectStyles}
                formatOptionLabel={(option, { context }) => (
                  <div>
                    {context === "menu" ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{option.originalName}</span>
                        <span className="text-xs text-gray-500">Area: {option.area}</span>
                      </div>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </div>
                )}
              />
            </div>

            {/* National Offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is National Offer?</label>
              <select
                value={isNationalOffers ? "Yes" : "No"}
                onChange={(e) => setIsNationalOffers(e.target.value === "Yes")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image (4:1 Recommended)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="img" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload image</span>
                      <input
                        id="img"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        ref={imgInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Preview + Remove */}
              {previewImg && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <img src={previewImg} alt="Preview" className="max-h-48 mx-auto rounded-md shadow-sm" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path d="M15 8C8.925 8 4 12.925 4 19v10c0 6.075 4.925 11 11 11h10c6.075 0 11-4.925 11-11V19c0-6.075-4.925-11-11-11H15z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 18l6 4-6 4V18z" fill="currentColor" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="video" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload video</span>
                      <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="sr-only"
                        ref={videoInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                </div>
              </div>

              {/* Preview + Remove */}
              {previewVideo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <video controls className="max-h-48 mx-auto rounded-md shadow-sm w-full">
                    <source src={previewVideo} />
                  </video>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Video Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Thumbnail</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="videoThumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload thumbnail</span>
                      <input
                        id="videoThumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="sr-only"
                        ref={thumbInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Preview + Remove */}
              {previewThumbnail && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                  <img src={previewThumbnail} alt="Thumb" className="max-h-48 mx-auto rounded-md shadow-sm" />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={terms}
                  onChange={setTerms}
                  placeholder="Enter terms and conditions..."
                  className="bg-white"
                  style={{ height: "180px" }}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                {nationalHeroOfferData ? "Update Offer" : "Create Offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const selectStyles = {
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
};

export default AddNationalHeroOffers;