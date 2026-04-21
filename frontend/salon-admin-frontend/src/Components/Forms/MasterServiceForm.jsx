import React, { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddService = ({ masterServiceData, setMasterServiceData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [gender, setGender] = useState(masterServiceData?.gender || "");
  const [service, setService] = useState(masterServiceData?.service_name || "");
  const [hsnCode, setHsnCodeservice] = useState(masterServiceData?.hsn_code || ""); // ← NEW FIELD
  const [img, setImg] = useState(null);
  const [description, setDescription] = useState(masterServiceData?.description || "");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(masterServiceData?.categories || "");

  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "bullet" }],
          ],
        },
      });

      if (masterServiceData?.description) {
        editorRef.current.root.innerHTML = masterServiceData.description;
      }

      editorRef.current.on("text-change", () => {
        setDescription(editorRef.current.root.innerHTML);
      });
    }
  }, [masterServiceData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("service_name", service);
    formData.append("description", editorRef.current.root.innerHTML);
    formData.append("gender", gender);
    formData.append("categories", categoryId);
    formData.append("hsn_code", hsnCode.trim()); // ← Added HSN Code

    if (img || !masterServiceData) {
      formData.append("service_image", img);
    }

    try {
      let url = masterServiceData
        ? `https://backendapi.trakky.in/salons/masterservice/${masterServiceData.id}/`
        : `https://backendapi.trakky.in/salons/masterservice/`;

      let response = await fetch(url, {
        method: masterServiceData ? "PATCH" : "POST",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });

      if (response.status === (masterServiceData ? 200 : 201)) {
        const data = await response.json();
        if (masterServiceData) {
          setMasterServiceData(data);
        }
        toast.success(
          masterServiceData ? "Service updated successfully" : "Service added successfully",
          {
            duration: 4000,
            position: "top-center",
            style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
          }
        );

        // Reset form
        setCategoryId("");
        setGender("");
        setService("");
        setHsnCodeservice("");           // ← reset HSN
        setImg(null);
        editorRef.current.root.innerHTML = "";
        document.getElementById("img").value = "";
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else if (response.status === 409) {
        const responseData = await response.json();
        toast.error(`Error: ${responseData.error}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      toast.error("Failed to save service. Please try again later.");
    }
  };

  const getMasterCategories = async (selectedGender) => {
    try {
      let url = "https://backendapi.trakky.in/salons/mastercategory/";
      if (selectedGender) {
        url += `?gender=${selectedGender}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
      } else {
        toast.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch categories. Please try again later.");
    }
  };

  useEffect(() => {
    getMasterCategories(gender);
  }, [gender]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-sans antialiased">
        <div className="mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5">
              <h3 className="text-xl font-bold text-gray-900">
                {masterServiceData ? "Edit Master Service" : "Add Master Service"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details to {masterServiceData ? "update" : "add"} a master service
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-sm p-6 space-y-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender || "not-select"}
                onChange={(e) => {
                  setCategoryId("");
                  setGender(e.target.value);
                }}
                required
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="not-select" disabled hidden>
                  --- Select Gender ---
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId || "not-select"}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                disabled={!gender}
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="not-select" disabled hidden>
                  {gender ? "--- Select Category ---" : "--- Select Gender First ---"}
                </option>
                {categoryList?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Enter service name"
                required
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
              />
            </div>

            {/* ★★★ HSN Code - New Field ★★★ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HSN Code <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCodeservice(e.target.value)}
                placeholder="Enter HSN Code (e.g. 998719)"
                required
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Usually 6-8 digits for services (SAC code)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div
                id="editor"
                className="h-32 border border-gray-300 rounded-lg overflow-hidden"
                style={{ backgroundColor: "#fff" }}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image{" "}
                <span className="text-xs font-normal text-gray-500">
                  (Recommended: 1:1 ratio)
                </span>
                {!masterServiceData && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                id="img"
                accept="image/*"
                {...(!masterServiceData ? { required: true } : {})}
                onChange={(e) => setImg(e.target.files[0])}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
              />
              {masterServiceData?.service_image && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-500">Current:</span>
                  <img
                    src={masterServiceData.service_image}
                    alt="Current"
                    className="h-16 w-16 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="h-12 px-8 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
              >
                {masterServiceData ? "Update Service" : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddService;