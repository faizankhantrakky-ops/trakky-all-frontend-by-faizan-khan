import React, { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const ProductMasterForm = ({
  ProductmasterData,
  setProductmasterData,
  closeModal,
}) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(ProductmasterData?.name || "");
  const [slug, setSlug] = useState(ProductmasterData?.slug || "");
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(ProductmasterData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name
  const generateSlug = (inputName) => {
    return inputName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!ProductmasterData) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("slug", slug.trim());
    if (img) formData.append("image", img);

    try {
      let response;
      if (ProductmasterData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/masterproducts/${ProductmasterData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
            body: formData,
          }
        );
      } else {
        response = await fetch("https://backendapi.trakky.in/salons/masterproducts/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: formData,
        });
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(
          ProductmasterData
            ? "Product updated successfully!"
            : "Product added successfully!",
          {
            style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
          }
        );

        // Update parent list
        if (setProductmasterData && data) {
          setProductmasterData(data);
        }

        // Reset form
        setName("");
        setSlug("");
        setImg(null);
        setPreviewImg(null);

        if (closeModal) closeModal();
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        const errorMsg = data?.message || data?.slug?.[0] || "Something went wrong.";
        toast.error(`Error: ${errorMsg}`, {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to process. Please try again.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-sm m-3">
        {/* === HEADER === */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {ProductmasterData ? "Edit Product" : "Add New Product"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to {ProductmasterData ? "update" : "create"} a product.
          </p>
        </div>

        {/* === FORM BODY === */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              required
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
              placeholder="auto-generated-slug"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-mono"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {ProductmasterData
                ? "Slug can be edited manually."
                : "Auto-generated from name. You can edit it."}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
              <span className="block text-xs text-gray-500 mt-1">
                Recommended: 1:1 ratio (e.g., 300x300px)
              </span>
            </label>
            <div className="flex items-center gap-4">
              {previewImg ? (
                <div className="flex-shrink-0">
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-400">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {ProductmasterData ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{ProductmasterData ? "Update Product" : "Add Product"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductMasterForm;