import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiImage, FiUpload } from "react-icons/fi"; // Only React Icons

const AddNationalOffer = ({ offerData, closeModal, updateOffer }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [title, setTitle] = useState(offerData?.title || "");
  const [img, setImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(offerData?.image || null);

  // Reset file input
  const resetFileInput = () => {
    const fileInput = document.getElementById("img");
    if (fileInput) fileInput.value = "";
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImg(null);
      setImagePreview(offerData?.image || null);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required", { style: { background: "#ef4444", color: "#fff" } });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (img || !offerData) formData.append("image", img);

    const isEdit = !!offerData;
    const url = isEdit
      ? `https://backendapi.trakky.in/salons/national-offers/${offerData.id}/`
      : `https://backendapi.trakky.in/salons/national-offers/`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });

      if (response.ok) {
        toast.success(isEdit ? "Offer Updated Successfully" : "Offer Added Successfully", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });

        // Reset form
        setTitle("");
        setImg(null);
        setImagePreview(null);
        resetFileInput();

        if (isEdit) updateOffer();
        closeModal();
      } else {
        const text = await response.text();
        toast.error(`Something went wrong: ${response.status}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
        resetFileInput();
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { style: { background: "#ef4444", color: "#fff" } });
      resetFileInput();
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className=" mx-auto p-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {offerData ? "Update" : "Add"} National Offer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {offerData ? "Modify existing offer" : "Create a new nationwide promotion"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Offer Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 50% Off on All Services"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image{" "}
                {offerData ? (
                  <span className="text-gray-500 text-xs">(Leave empty to keep current)</span>
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </label>

              <div className="space-y-4">
                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="img"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiImage className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {img ? img.name : "Click to upload image"}
                      </p>
                      <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                        <FiUpload className="w-3 h-3" />
                        Recommended: 5:1 ratio
                      </p>
                    </div>
                    <input
                      id="img"
                      type="file"
                      accept="image/*"
                      {...(!offerData && { required: true })}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Offer preview"
                        className="max-w-full h-48 object-cover rounded-lg shadow-md border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                        <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Preview
                        </p>
                      </div>
                    </div>
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
                {offerData ? "Update Offer" : "Add Offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNationalOffer;