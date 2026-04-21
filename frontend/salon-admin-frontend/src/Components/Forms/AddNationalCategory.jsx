import React, { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast from "react-hot-toast";

const AddNationalCategory = ({ categoryData, closeModal, updateCategory }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [title, setTitle] = useState(categoryData?.title || "");
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(categoryData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      return;
    }

    if (!img && !categoryData) {
      toast.error("Image is required for new category.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    if (img) formData.append("image", img);

    try {
      let response;
      if (categoryData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/national-category/${categoryData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + authTokens.access,
            },
            body: formData,
          }
        );
      } else {
        response = await fetch("https://backendapi.trakky.in/salons/national-category/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + authTokens.access,
          },
          body: formData,
        });
      }

      const result = await response.json();

      if (response.ok) {
        toast.success(
          categoryData
            ? "Category updated successfully!"
            : "Category added successfully!",
          {
            style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
          }
        );

        // Reset form
        setTitle("");
        setImg(null);
        setPreviewImg(null);
        document.getElementById("img-input")?.value && (document.getElementById("img-input").value = "");

        if (updateCategory) updateCategory();
        if (closeModal) closeModal();
      } else if (response.status === 400) {
        const errors = [];
        if (result.title) errors.push("Category with this title already exists.");
        if (result.image) errors.push("Please upload a valid image.");
        toast.error(errors.join(" "), {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit. Please try again.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm m-3">
      {/* === HEADER === */}
      <div className="px-5 py-5 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          {categoryData ? "Update National Category" : "Add National Category"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details to {categoryData ? "update" : "create"} a category
        </p>
      </div>

      {/* === FORM BODY === */}
      <form onSubmit={handleSubmit} className="p-3 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter category title"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image {categoryData ? "" : <span className="text-red-500">*</span>}
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
                id="img-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                {...(!categoryData && { required: true })}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3">
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
                {categoryData ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>{categoryData ? "Update Category" : "Add Category"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNationalCategory;