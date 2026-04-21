import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { FiImage, FiCalendar, FiClock, FiSearch, FiUpload } from "react-icons/fi";

const DailyUpdates = ({ dailyData, closeModal }) => {
  const { authTokens } = useContext(AuthContext);

  const [selectSalonId, setSelectSalonId] = useState(dailyData?.salon_id || "");
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [updateDesc, setUpdateDesc] = useState(dailyData?.daily_update_description || "");
  const [img, setImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(dailyData?.daily_update_img || null);

  // Date & Time
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const tenYearsLater = new Date();
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
  const formattedTenYearsLater = tenYearsLater.toISOString().split("T")[0];
  const currentTime = today.toLocaleTimeString("en-IN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const [startingDate, setStartingDate] = useState(dailyData?.starting_date || formattedToday);
  const [expireDate, setExpireDate] = useState(dailyData?.expire_date || formattedTenYearsLater);
  const [activeStatus, setActiveStatus] = useState(
    dailyData?.active_status !== undefined ? dailyData.active_status : true
  );
  const [activeTime, setActiveTime] = useState(dailyData?.active_time || currentTime);

  // Helper: 5 days before
  const getFiveDaysBefore = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - 5);
    return d.toISOString().split("T")[0];
  };

  // Reset file input
  const resetFileInput = () => {
    const input = document.getElementById("img");
    if (input) input.value = "";
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImg(null);
      setImagePreview(dailyData?.daily_update_img || null);
    }
  };

  // Load salons with Name - Area format
  const loadSalons = async (inputValue, callback) => {
    if (!inputValue) return callback([]);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(inputValue)}`
      );
      const data = await res.json();
      
      const options = data?.results?.map((s) => ({
        value: s.id,
        label: `${s.name} - ${s.area}`,
        originalName: s.name,
        area: s.area
      })) || [];
      
      callback(options);
    } catch (err) {
      console.error(err);
      callback([]);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeStatus && startingDate && expireDate && new Date(startingDate) > new Date(expireDate)) {
      toast.error("Expire date must be after or equal to start date for Active status.", {
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("daily_update_description", updateDesc);
    if (img) formData.append("daily_update_img", img);
    formData.append("salon_id", selectSalonId);
    formData.append("starting_date", startingDate);
    formData.append("expire_date", activeStatus ? expireDate : getFiveDaysBefore(startingDate));
    formData.append("active_time", activeTime);

    const loadingId = toast.loading("Submitting...", {
      style: { background: "#333", color: "#fff", borderRadius: "8px" },
    });

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const isEdit = !!dailyData;
      const url = isEdit
        ? `https://backendapi.trakky.in/salons/daily-updates/${dailyData.id}/`
        : `https://backendapi.trakky.in/salons/daily-updates/`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (res.ok) {
        toast.success(isEdit ? "Daily Work Updated Successfully." : "Daily Work Added Successfully.", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });

        // Reset
        setUpdateDesc("");
        setImg(null);
        setImagePreview(null);
        resetFileInput();
        setSelectSalonId("");
        setSelectedSalons(null);
        setStartingDate(formattedToday);
        setExpireDate(formattedTenYearsLater);
        setActiveStatus(true);
        setActiveTime(currentTime);

        closeModal?.();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      toast.error("An error occurred while processing the request.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      submitBtn.disabled = false;
      toast.dismiss(loadingId);
    }
  };

  // Sync dailyData
  useEffect(() => {
    if (dailyData) {
      // Create label with Name - Area format for edit mode
      const label = dailyData.salon_name && dailyData.salon_area 
        ? `${dailyData.salon_name} - ${dailyData.salon_area}`
        : dailyData.salon_name || "";
      
      setSelectedSalons({ 
        value: dailyData.salon_id, 
        label: label,
        originalName: dailyData.salon_name,
        area: dailyData.salon_area
      });
      setStartingDate(dailyData.starting_date || formattedToday);
      setExpireDate(dailyData.expire_date || formattedTenYearsLater);
      setActiveStatus(dailyData.active_status ?? true);
      setActiveTime(dailyData.active_time || currentTime);
      setUpdateDesc(dailyData.daily_update_description || "");
      setImagePreview(dailyData.daily_update_img || null);
    }
  }, [dailyData]);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className=" mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {dailyData ? "Update" : "Add"} Daily Update
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {dailyData ? "Modify existing update" : "Share today's salon progress"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Salon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salon <span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(opt) => {
                  setSelectedSalons(opt);
                  setSelectSalonId(opt?.value || "");
                }}
                placeholder="Search salon..."
                isDisabled={!!dailyData}
                noOptionsMessage={() => "Type to search salons..."}
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Update Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={updateDesc}
                onChange={(e) => setUpdateDesc(e.target.value)}
                rows={6}
                required
                placeholder="Describe today's work, progress, or highlights..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Image {dailyData ? "(Optional)" : <span className="text-red-500">*</span>}
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="img"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiImage className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">{img ? img.name : "Click to upload"}</p>
                      <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                        <FiUpload className="w-3 h-3" /> Recommended: 2:1 ratio
                      </p>
                    </div>
                    <input
                      id="img"
                      type="file"
                      accept="image/*"
                      {...(!dailyData && { required: true })}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-64 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <FiUpload className="w-4 h-4" />
                {dailyData ? "Update" : "Add"} Update
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
  option: (base) => ({
    ...base,
    padding: "8px 12px",
    fontSize: "0.875rem",
  }),
};

export default DailyUpdates;