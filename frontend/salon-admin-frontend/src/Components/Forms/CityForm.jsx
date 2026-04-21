import React, { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiMapPin, FiCheck, FiX, FiAlertCircle, FiLoader } from "react-icons/fi";

const AddCity = ({ cityData, setCityData, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [cityName, setCityName] = useState(cityData?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    setLoading(true);
    const data = { name: cityName };

    try {
      let response;
      if (cityData) {
        response = await fetch(`https://backendapi.trakky.in/salons/city/${cityData.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch(`https://backendapi.trakky.in/salons/city/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        const resp = await response.json();
        if (resp.detail?.includes("Authentication")) {
          toast.error("Session expired", { style: { background: "#ef4444", color: "#fff" } });
          logoutUser();
        } else {
          const msg = cityData ? "City updated successfully" : "City added successfully";
          toast.success(msg, { icon: <FiCheck className="w-5 h-5" />, style: { background: "#22c55e", color: "#fff" } });

          if (!cityData) setCityName("");
          closeModal?.();
        }
      } else if (response.status === 401) {
        toast.error("Unauthorized", { style: { background: "#ef4444", color: "#fff" } });
        logoutUser();
      } else if (response.status === 409) {
        toast.error("This city already exists", { icon: <FiAlertCircle />, style: { background: "#f59e0b", color: "#fff" } });
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

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiMapPin className="w-6 h-6 text-indigo-600" />
              {cityData ? "Update City" : "Add New City"}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Use hyphens instead of spaces (e.g., <code className="bg-gray-100 px-1 rounded">navi-mumbai</code>)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="cityname" className="block text-sm font-medium text-gray-700 mb-2">
                City Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cityname"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  required
                  placeholder="e.g., mumbai"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-indigo-600">
                Spaces are not allowed. Use <code className="bg-indigo-50 px-1 rounded">hyphens</code> instead.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {cityData && (
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !cityName.trim()}
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
                    {cityData ? "Update" : "Add"} City
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

export default AddCity;