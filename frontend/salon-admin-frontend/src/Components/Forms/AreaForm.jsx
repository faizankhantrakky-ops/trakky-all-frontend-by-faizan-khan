import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiMapPin, FiImage, FiCheck, FiX, FiLoader, FiAlertCircle } from "react-icons/fi";

const AddArea = ({ areaData, setAreaData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [CitiesData, setCitiesData] = useState([]);
  const [areaName, setAreaName] = useState(areaData?.name || "");
  const [city, setCity] = useState(areaData?.city || "not-select");
  const [areaImage, setAreaImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(areaData?.image_area || null);
  const [loading, setLoading] = useState(false);

  const getCities = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/city/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setCitiesData(data.payload || []);
      }
    } catch (err) {
      toast.error("Failed to load cities", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city === "not-select") return;

    setLoading(true);
    const data = new FormData();
    data.append("name", areaName);
    data.append("city", city);
    if (areaImage) data.append("image_area", areaImage[0]);

    try {
      let response;
      if (areaData) {
        response = await fetch(`https://backendapi.trakky.in/salons/area/${areaData.id}/`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${authTokens.access}` },
          body: data,
        });
      } else {
        response = await fetch(`https://backendapi.trakky.in/salons/area/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${authTokens.access}` },
          body: data,
        });
      }

      if (response.ok) {
        const resp = await response.json();
        if (resp.detail?.includes("Authentication")) {
          toast.error("Session expired", { style: { background: "#ef4444", color: "#fff" } });
          logoutUser();
        } else {
          const msg = areaData ? "Area updated successfully" : "Area added successfully";
          toast.success(msg, { icon: <FiCheck className="w-5 h-5" />, style: { background: "#22c55e", color: "#fff" } });

          if (setAreaData) {
            setAreaData(resp);
          }

          if (!areaData) {
            setAreaName("");
            setCity("not-select");
            setAreaImage(null);
            setImagePreview(null);
            document.getElementById("image").value = "";
          }
        }
      } else if (response.status === 401) {
        toast.error("Unauthorized", { style: { background: "#ef4444", color: "#fff" } });
        logoutUser();
      } else if (response.status === 409) {
        toast.error("Area of this City already exist", { icon: <FiAlertCircle />, style: { background: "#f59e0b", color: "#fff" } });
      } else if (response.status >= 400 && response.status < 500) {
        const error = await response.text();
        toast.error(`Error ${response.status}: ${error}`, { style: { background: "#ef4444", color: "#fff" } });
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Network error: " + error.message, { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAreaImage([file]);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiMapPin className="w-6 h-6 text-indigo-600" />
              {areaData ? "Update Area" : "Add New Area"}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Use hyphens instead of spaces (e.g., <code className="bg-gray-100 px-1 rounded">prahlad-nagar</code>)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Area Name */}
            <div>
              <label htmlFor="areaname" className="block text-sm font-medium text-gray-700 mb-2">
                Area Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="areaname"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  required
                  placeholder="e.g., prahlad-nagar"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-indigo-600">
                Spaces are not allowed. Use <code className="bg-indigo-50 px-1 rounded">hyphens</code> instead.
              </p>
            </div>

            {/* City Select */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="not-select" disabled>
                    --- Select City ---
                  </option>
                  {CitiesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Area Image
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                >
                  <FiImage className="w-5 h-5" />
                  Choose Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setAreaImage(null);
                        setImagePreview(null);
                        document.getElementById("image").value = "";
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {areaData && (
                <button
                  type="button"
                  onClick={() => {
                    if (setAreaData) setAreaData(null);
                  }}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !areaName.trim() || city === "not-select"}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    {areaData ? "Update" : "Add"} Area
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

export default AddArea;