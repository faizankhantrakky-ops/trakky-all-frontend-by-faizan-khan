import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiGlobe, FiEdit3, FiTag, FiFileText, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";

const SeoManagement = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [pageName, setPageName] = useState("");
  const [existingData, setExistingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageOptions = [
    { value: "home", label: "Home Page" },
    { value: "categoryList", label: "Category List Page" },
    { value: "cityList", label: "City List Page" },
  ];

  const getExistingData = async () => {
    if (!pageName) {
      setExistingData(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/seo/${pageName}/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setExistingData(data);
    } catch (error) {
      toast.error("Failed to load SEO data. Please try again.", {
        icon: <FiAlertCircle />,
        style: { background: "#ef4444", color: "#fff" },
      });
      setExistingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExistingData();
  }, [pageName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to update SEO settings?")) return;

    if (!existingData) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("meta_title", existingData.meta_title);
    formData.append("meta_description", existingData.meta_description);
    formData.append("meta_keywords", existingData.meta_keywords);

    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/seo/${pageName}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      const resp = await response.json();

      if (resp.detail?.includes("Authentication")) {
        toast.error("Session expired. Logging out...", { style: { background: "#ef4444", color: "#fff" } });
        logoutUser();
      } else if (response.ok) {
        setExistingData(resp);
        toast.success("SEO updated successfully!", {
          icon: <FiCheck className="w-5 h-5" />,
          style: { background: "#22c55e", color: "#fff" },
        });
      } else {
        throw new Error(resp.detail || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed: " + error.message, {
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    if (existingData) {
      setExistingData({ ...existingData, [field]: value });
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className=" mx-auto">

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
                <p className="text-sm text-gray-600">Optimize meta tags for better search visibility</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Page Selector */}
              <div>
                <label htmlFor="page-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Page <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="page-name"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white disabled:bg-gray-50"
                  >
                    <option value="">Select Page</option>
                    {pageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading SEO data...</span>
                </div>
              )}

              {existingData && !isLoading && (
                <>
                  {/* Meta Title */}
                  <div>
                    <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="meta-title"
                        value={existingData.meta_title || ""}
                        onChange={(e) => updateField("meta_title", e.target.value)}
                        required
                        maxLength={70}
                        placeholder="e.g., Best Salons in Ahmedabad | Book Now"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <FiEdit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Recommended: 50–60 characters</span>
                      <span className={existingData.meta_title?.length > 70 ? "text-red-600" : ""}>
                        {existingData.meta_title?.length || 0}/70
                      </span>
                    </div>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="meta-keywords"
                        value={existingData.meta_keywords || ""}
                        onChange={(e) => updateField("meta_keywords", e.target.value)}
                        required
                        placeholder="e.g., salon, spa, beauty, ahmedabad"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="meta-description"
                        rows={5}
                        value={existingData.meta_description || ""}
                        onChange={(e) => updateField("meta_description", e.target.value)}
                        required
                        maxLength={160}
                        placeholder="Brief description for search engines..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                      <FiFileText className="absolute left-3 top-6 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Recommended: 150–160 characters</span>
                      <span className={existingData.meta_description?.length > 160 ? "text-red-600" : ""}>
                        {existingData.meta_description?.length || 0}/160
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading || !existingData}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-4 h-4" />
                          Update SEO
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {!pageName && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <FiGlobe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a page to manage SEO</p>
                  <p className="text-sm mt-1">Choose from Home, Category List, or City List</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeoManagement;