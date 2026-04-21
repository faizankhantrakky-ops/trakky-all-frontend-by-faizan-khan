import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddPrimaryCityOffers = ({ offerData, setOfferData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(offerData?.name || "");
  const [slug, setSlug] = useState(offerData?.slug || "");
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(offerData?.offer_image || null);

  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(offerData?.city || "");

  const [selectedSalonIds, setSelectedSalons] = useState([]);

  // === Initialize salons on edit ===
  useEffect(() => {
    if (offerData) {
      const salonDatas = Object.keys(offerData?.salon_name || {}).map((key) => ({
        value: key,
        label: offerData?.salon_name[key],
      }));
      setSelectedSalons(salonDatas);
    }
  }, [offerData]);

  // === Load Cities ===
  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/salons/city/`;
      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        const cityNames = data?.payload.map((item) => item.name);
        setCityPayload(data?.payload);
        setCity(cityNames);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      toast.error("Failed to fetch cities. Please try again later.", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // === Load Salons (Updated with Salon Name - Area format) ===
  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}&city=${selectedCity}`;
      const response = await fetch(url);
      const data = await response.json();
      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: `${salon.name} - ${salon.area}`, // Changed to include area
        originalName: salon.name,
        area: salon.area
      })) || [];

      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  // === Handle Image Change ===
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreviewImg(file ? URL.createObjectURL(file) : offerData?.offer_image);
  };

  // === Submit Form ===
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedSalonIds.length === 0) {
      toast.error("Please select at least one salon", {
        style: { background: "#f97316", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    const offerModel = new FormData();
    offerModel.append("name", name);
    offerModel.append("slug", slug);
    offerModel.append("city", selectedCity);

    if (img || !offerData) offerModel.append("offer_image", img);
    selectedSalonIds.forEach((salon) => offerModel.append("salon", salon.value));

    const isUpdate = !!offerData;
    const url = isUpdate
      ? `https://backendapi.trakky.in/salons/salon-city-offer/${offerData.id}/`
      : `https://backendapi.trakky.in/salons/salon-city-offer/`;

    try {
      const response = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: { Authorization: "Bearer " + authTokens.access },
        body: offerModel,
      });

      if (response.ok) {
        const result = await response.json();
        if (isUpdate) {
          setOfferData(result);
          toast.success("Offer updated successfully.", {
            style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
          });
        } else {
          toast.success("Offer added successfully.", {
            style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
          });
          // Reset form
          setName("");
          setSlug("");
          setImg(null);
          setPreviewImg(null);
          setSelectedCity("");
          setSelectedSalons([]);
          document.getElementById("img").value = "";
        }
      } else if (response.status === 401) {
        toast.error("Authentication credentials were not provided.", {
          style: { background: "#ef4444", color: "#fff" },
        });
        logoutUser();
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        let errorMessage = "";
        errorMessage += errorData.name ? errorData.name + " " : "";
        errorMessage += errorData.slug ? errorData.slug + " " : "";
        errorMessage += errorData.offer_image ? errorData.offer_image + " " : "";
        errorMessage += errorData.salon ? errorData.salon + " " : "";
        if (!errorMessage.trim()) errorMessage = `Something Went Wrong: ${response.status}`;
        toast.error(errorMessage, { style: { background: "#ef4444", color: "#fff" } });
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Error uploading offer", error);
      toast.error("Network error. Please try again.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className=" mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {offerData ? "Update" : "Add"} Primary City Offer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {offerData ? "Modify featured city offer" : "Create a new primary city-level offer"}
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
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedSalons([]);
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Select City</option>
                {city.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter offer name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Salons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Salons <span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                isDisabled={!selectedCity}
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalonIds}
                onChange={setSelectedSalons}
                placeholder="Search salons..."
                noOptionsMessage={() =>
                  selectedCity ? "No salons found" : "Select city first"
                }
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

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="unique-city-offer-slug"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">Recommended: 500×200px</span>
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
                        {...(!offerData ? { required: true } : {})}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              {previewImg && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <img src={previewImg} alt="Preview" className="max-h-48 mx-auto rounded-md shadow-sm" />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                {offerData ? "Update Offer" : "Create Offer"}
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
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#eef2ff",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#4f46e5",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#4f46e5",
    ":hover": { backgroundColor: "#c7d2fe", color: "#312e81" },
  }),
};

export default AddPrimaryCityOffers;