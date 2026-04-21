import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddOffer = ({ offerData, setOfferData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(offerData?.name || "");
  const [slug, setSlug] = useState(offerData?.slug || "");
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(offerData?.img_url || null);

  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(offerData?.city || "");
  const [selectedAreaName, setSelectedAreaName] = useState(offerData?.area || "");
  const [availableAreaName, setAvailableAreaName] = useState([]);

  const [selectedSalonIds, setSelectedSalons] = useState([]);

  const [offerType, setOfferType] = useState(
    offerData ? (offerData.area === null ? "city" : "area") : "city"
  );

  // === Initialize salons on edit ===
  useEffect(() => {
    if (offerData) {
      const salonDatas = Object.keys(offerData?.salon_names || {}).map((key) => ({
        value: key,
        label: offerData?.salon_names[key],
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

  // === Load Areas ===
  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names || []);
    } else {
      const selectedAreas = [];
      const cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas.push(...city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  useEffect(() => {
    setAvailableAreaName(getAreaNames(selectedCity));
  }, [selectedCity, cityPayload]);

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
      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

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

  // === Generate Slug Automatically ===
  const generateSlug = () => {
    let base = "";

    // Add Offer Name
    if (name.trim()) {
      base += name.trim();
    }

   

    // Add Area (only if offerType is area and area is selected)
    if (offerType === "area" && selectedAreaName) {
      base += ` ${selectedAreaName}`;
    }

     // Add City
    if (selectedCity) {
      base += ` ${selectedCity}`;
    }
    // Clean and format slug
    const cleaned = base
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single

    // Only update if not in edit mode OR if slug hasn't been manually changed
    if (!offerData || slug === offerData.slug || slug === "") {
      setSlug(cleaned);
    }
  };

  // Trigger slug generation on change
  useEffect(() => {
    generateSlug();
  }, [name, selectedCity, selectedAreaName, offerType]);

  // === Handle Image Change ===
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreviewImg(file ? URL.createObjectURL(file) : offerData?.img_url);
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
    if (selectedAreaName) offerModel.append("area", selectedAreaName);

    if (img || !offerData) offerModel.append("img_url", img);
    selectedSalonIds.forEach((salon) => offerModel.append("salon", salon.value));

    const isUpdate = !!offerData;
    const url = isUpdate
      ? `https://backendapi.trakky.in/salons/offer/${offerData.id}/`
      : `https://backendapi.trakky.in/salons/offer/`;

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
          setSelectedAreaName("");
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
        errorMessage += errorData.slug ? errorData.slug + " " : "";
        errorMessage += errorData.city ? errorData.city + " " : "";
        errorMessage += errorData.area ? errorData.area + " " : "";
        errorMessage += errorData.img_url ? errorData.img_url + " " : "";
        errorMessage += errorData.salon ? errorData.salon + " " : "";
        if (!errorMessage) errorMessage = `Something Went Wrong: ${response.status}`;
        toast.error(errorMessage, { style: { background: "#ef4444", color: "#fff" } });
      } else if (response.status === 500) {
        toast.error(`Error: ${response.status} - Server Side Error, try again later.`, {
          style: { background: "#ef4444", color: "#fff" },
        });
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

      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {offerData ? "Update" : "Add"} City/Area Offer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {offerData ? "Modify existing offer" : "Create a new salon offer"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Offer Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Offer Type <span className="text-red-500">*</span>
              </label>
              <select
                value={offerType}
                onChange={(e) => {
                  setOfferType(e.target.value);
                  if (e.target.value === "city") {
                    setSelectedAreaName("");
                  }
                  // Slug will auto-update via useEffect
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="city">City Offer</option>
                <option value="area">Area Offer</option>
              </select>
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
                  setSelectedAreaName("");
                  setSelectedSalons([]);
                  // Slug updates via useEffect
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

            {/* Area (Conditional) */}
            {offerType === "area" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedAreaName}
                  onChange={(e) => {
                    setSelectedAreaName(e.target.value);
                    setSelectedSalons([]);
                    // Slug updates via useEffect
                  }}
                  required
                  disabled={!selectedCity}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="">Select Area</option>
                  {availableAreaName.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            )}

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
                isDisabled={!selectedCity || (offerType === "area" && !selectedAreaName)}
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalonIds}
                onChange={setSelectedSalons}
                placeholder="Search salons..."
                noOptionsMessage={() =>
                  selectedCity
                    ? "No salons found"
                    : "Select city and area first"
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
                <span className="text-xs text-gray-500 ml-2">(Auto-generated)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="unique-offer-slug"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              {slug && (
                <p className="mt-1 text-xs text-gray-500">
                  Auto-generated from Name + City {offerType === "area" && "+ Area"}
                </p>
              )}
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

export default AddOffer;