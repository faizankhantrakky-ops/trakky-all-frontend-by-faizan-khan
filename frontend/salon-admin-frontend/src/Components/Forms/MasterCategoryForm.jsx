import React, { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AddOffer = ({ masterCategoryData, setmasterCategoryData, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(masterCategoryData?.name || "");
  const [gender, setGender] = useState(masterCategoryData?.gender || "");
  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    toast.loading("Please wait...", { duration: 10000 });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);

    if (img || !masterCategoryData) {
      formData.append("mastercategory_image", img);
    }

    try {
      const url = masterCategoryData
        ? `https://backendapi.trakky.in/salons/mastercategory/${masterCategoryData.id}/`
        : `https://backendapi.trakky.in/salons/mastercategory/`;

      const response = await fetch(url, {
        method: masterCategoryData ? "PATCH" : "POST",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: formData,
      });

      toast.dismiss();

      if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else if (response.status === (masterCategoryData ? 200 : 201)) {
        const data = await response.json();
        if (masterCategoryData) {
          setmasterCategoryData(data);
        }
        toast.success(
          masterCategoryData
            ? "Master category updated successfully"
            : "Master category added successfully",
          {
            duration: 4000,
            position: "top-center",
            style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
          }
        );
        closeModal();
      } else if (response.status === 409) {
        const data = await response.json();
        toast.error(`${data?.error || "Conflict"}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        toast.error(`Something went wrong: ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }

      // Reset form
      setName("");
      setGender("");
      setImg(null);
      if (!masterCategoryData) {
        document.getElementById("img").value = "";
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Something went wrong: ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  return (
    <>
      <Toaster position="top-center " />
      <div className="p-5 mx-auto bg-white rounded-xl shadow-sm m-5">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {masterCategoryData ? "Update" : "Add"} Master Category
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {masterCategoryData
              ? "Edit the details below to update the category"
              : "Fill in the details to create a new master category"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                --- Select Gender ---
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image{" "}
              <span className="text-xs font-normal text-gray-500">
                (Recommended: 1:1 ratio)
              </span>
              {!masterCategoryData && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id="img"
              accept="image/*"
              {...(!masterCategoryData ? { required: true } : {})}
              onChange={(e) => setImg(e.target.files[0])}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
            />
            {masterCategoryData?.mastercategory_image && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-500">Current:</span>
                <img
                  src={masterCategoryData.mastercategory_image}
                  alt="Current category"
                  className="h-16 w-16 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="h-11 px-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-8 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
            >
              {masterCategoryData ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOffer;