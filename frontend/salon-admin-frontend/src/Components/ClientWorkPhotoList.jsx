import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiImage,
  FiVideo,
  FiCalendar,
  FiClock,
  FiUpload,
} from "react-icons/fi";

const ClientWorkPhotoList = () => {
  const scrollTopRef = useRef(null);
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("name");
  const [page, setPage] = useState(1);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [description, setDescription] = useState("");
  const [categories_id, setCategoriesId] = useState("");
  const [service_name, setServiceName] = useState("");
  const [img, setImg] = useState(null);
  const [client_work_id, setClientWorkId] = useState("");
  const [video, setVideo] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [startingDate, setStartingDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const [activeTime, setActiveTime] = useState("");

  // New states for current media previews in edit
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");

  const spasPerPage = 12;

  // === Fetch Salons ===
  const getSalons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/?page=${page}`);
      const data = await res.json();
      setSalonsData(data.results || []);
      setTotalSalons(data.count || 0);
      scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) { 
      toast.error("Failed to load salons", { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  // === Search ===
  const handleSearch = async () => {
    if (!searchTerm.trim()) return getSalons();
    setLoading(true);
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/search${filterField}/?search=${searchTerm.trim()}&page=${page}`,
        {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        }
      );
      if (res.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", { style: { background: "#ef4444", color: "#fff" } });
        return;
      }
      const data = await res.json();
      setSalonsData(data.results || []);
      setTotalSalons(data.count || 0);
      scrollTopRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error("Search failed. Try again.", { style: { background: "#ef4444", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  // === Pagination ===
  const totalPages = Math.ceil(totalSalons / spasPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  // === Fetch Categories ===
  const getCategories = async () => {
    try {
      const res = await fetch("https://backendapi.trakky.in/salons/category/", {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategoryList(data);
      } else if (res.status === 401) {
        logoutUser();
      }
    } catch (err) {
      toast.error("Failed to load categories", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  // === Delete Client Work ===
  const handleDeleteClientWork = async (id) => {
    const loadingId = toast.loading("Deleting...");
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/client-image/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (res.status === 204) {
        toast.dismiss(loadingId);
        toast.success("Deleted successfully", { style: { background: "#22c55e", color: "#fff" } });
        setShowModal(false);
        searchTerm ? handleSearch() : getSalons();
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Delete failed", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  // === Edit Client Work ===
  const handleEditDetails = async (e) => {
    e.preventDefault();
    if (startingDate && expireDate && new Date(startingDate) > new Date(expireDate)) {
      toast.error("Expire date must be after start date.", { style: { background: "#ef4444", color: "#fff" } });
      return;
    }

    const formData = new FormData();
    formData.append("category", categories_id);
    formData.append("service", service_name);
    formData.append("description", description);
    formData.append("active_status", activeStatus);
    if (img) formData.append("client_image", img);
    if (video) formData.append("video", video);
    if (videoThumbnail) formData.append("video_thumbnail_image", videoThumbnail);

    const loadingId = toast.loading("Updating...");
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/client-image/${client_work_id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authTokens.access}` },
        body: formData,
      });
      if (res.ok) {
        toast.dismiss(loadingId);
        toast.success("Updated successfully", { style: { background: "#22c55e", color: "#fff" } });
        setShowEditModal(false);
        resetEditForm();
        setShowModal(false);
        searchTerm ? handleSearch() : getSalons();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Update failed", { style: { background: "#ef4444", color: "#fff" } });
    }
  };

  const resetEditForm = () => {
    setCategoriesId("");
    setServiceName("");
    setDescription("");
    setImg(null);
    setVideo(null);
    setVideoThumbnail(null);
    setStartingDate("");
    setExpireDate("");
    setActiveStatus(true);
    setActiveTime("");
    // Reset previews
    setCurrentImageUrl("");
    setCurrentVideoUrl("");
    setCurrentThumbnailUrl("");
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      getSalons();
    }
  }, [page]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div ref={scrollTopRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Work Photo's</h1>
                <p className="mt-1 text-sm text-gray-600">Manage salon client transformation images</p>
              </div>
              <Link to="/addclientworkphotos">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <FiPlus className="w-5 h-5" />
                  Add Work
                </button>
              </Link>
            </div>
          </div>

          {/* === Search & Filter === */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
  <div className="flex flex-col lg:flex-row gap-4">
    {/* 60% - Search Input */}
    <div className="lg:w-3/5 w-full">
      <div className="relative">
        <input
          type={filterField === "mobilenumber" || filterField === "priority" ? "number" : "text"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search salons..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>

    {/* 40% - Filter + Button */}
    <div className="lg:w-2/5 w-full flex gap-3">
      <select
        value={filterField}
        onChange={(e) => setFilterField(e.target.value)}
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
      >
        <option value="name">Name</option>
        <option value="priority">Priority</option>
        <option value="mobilenumber">Phone</option>
        <option value="city">City</option>
        <option value="area">Area</option>
      </select>

      <button
        onClick={page === 1 ? handleSearch : () => setPage(1)}
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium whitespace-nowrap"
      >
        Search
      </button>
    </div>
  </div>
</div>

          {/* === Table === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : salonsData.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-lg font-medium text-gray-600">No salons found</p>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Priority", "Name", "City", "Area", "Phone No.", "Address", "Client Work Images"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {salonsData.map((salon) => (
                      <tr key={salon.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            #{salon.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{salon.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{salon.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{salon.area}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{salon.mobile_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{salon.address}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setModalData(salon);
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="View Client Work"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* === Pagination === */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-1">
                <button onClick={() => handlePageChange(1)} className="p-2 rounded hover:bg-gray-100">
                  First
                </button>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50">
                  Previous
                </button>

                {page > 3 && <span className="px-3 py-1">...</span>}

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (p < page - 1 || p > page + 1) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-3 py-1 rounded ${p === page ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}
                    >
                      {p}
                    </button>
                  );
                })}

                {page < totalPages - 2 && <span className="px-3 py-1">...</span>}

                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-50">
                  Next
                </button>
                <button onClick={() => handlePageChange(totalPages)} className="p-2 rounded hover:bg-gray-100">
                  Last
                </button>
              </nav>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {salonsData.length} of {totalSalons} entries
          </div>
        </div>
      </div>

      {/* === Client Work Modal === */}
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Client Work Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div><strong>Name:</strong> {modalData.name}</div>
            <div><strong>Phone:</strong> {modalData.mobile_number}</div>
          </div>
          <hr className="mb-6" />

          {modalData.client_images?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {["Image", "Category", "Service", "Desc", "Start", "Expire", "Status", "Time", "Video", "Thumbnail", "Edit", "Delete"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {modalData.client_images.map((img) => (
                    <tr key={img.id}>
                      <td className="px-3 py-2">
                        {img.client_image ? (
                          <img src={img.client_image} alt="" className="h-16 w-16 object-cover rounded" />
                        ) : "-"}
                      </td>
                      <td className="px-3 py-2">{img.category || "-"}</td>
                      <td className="px-3 py-2">{img.service || "-"}</td>
                      <td className="px-3 py-2 max-w-xs truncate">{img.description || "-"}</td>
                      <td className="px-3 py-2">{img.starting_date || "-"}</td>
                      <td className="px-3 py-2">{img.expire_date || "-"}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${img.active_status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {img.active_status ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-3 py-2">{img.active_time || "-"}</td>
                      <td className="px-3 py-2">
                        {img.video ? (
                          <video src={img.video} controls className="h-16 w-32 object-cover rounded" />
                        ) : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {img.video_thumbnail_image ? (
                          <img src={img.video_thumbnail_image} alt="" className="h-16 w-16 object-cover rounded" />
                        ) : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => {
                            setCategoriesId(img.category || "");
                            setServiceName(img.service || "");
                            setDescription(img.description || "");
                            setClientWorkId(img.id);
                            setStartingDate(img.starting_date || "");
                            setExpireDate(img.expire_date || "");
                            setActiveStatus(img.active_status ?? true);
                            setActiveTime(img.active_time || "");
                            // Set current media URLs for preview
                            setCurrentImageUrl(img.client_image || "");
                            setCurrentVideoUrl(img.video || "");
                            setCurrentThumbnailUrl(img.video_thumbnail_image || "");
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDeleteClientWork(img.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No client work images found</p>
          )}
        </div>
      </GeneralModal>

      {/* === Edit Modal === */}
      <GeneralModal open={showEditModal} handleClose={() => setShowEditModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Client Work</h3>
          <form onSubmit={handleEditDetails} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={categories_id}
                onChange={(e) => setCategoriesId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                value={service_name}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Haircut + Color"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center">
                  <FiImage className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{img ? img.name : "Choose image"}</span>
                </div>
                <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} className="hidden" />
              </label>
              {/* Preview current image */}
              {currentImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img src={currentImageUrl} alt="Current" className="h-24 w-24 object-cover rounded border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video (Optional)</label>
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center">
                  <FiVideo className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{video ? video.name : "Choose video"}</span>
                </div>
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
              </label>
              {/* Preview current video */}
              {currentVideoUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current Video:</p>
                  <video src={currentVideoUrl} controls className="h-24 w-32 object-cover rounded border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail (Optional)</label>
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center">
                  <FiImage className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{videoThumbnail ? videoThumbnail.name : "Choose thumbnail"}</span>
                </div>
                <input type="file" accept="image/*" onChange={(e) => setVideoThumbnail(e.target.files[0])} className="hidden" />
              </label>
              {/* Preview current thumbnail */}
              {currentThumbnailUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Current Thumbnail:</p>
                  <img src={currentThumbnailUrl} alt="Current Thumbnail" className="h-24 w-24 object-cover rounded border" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <FiUpload className="w-4 h-4" />
                Update
              </button>
            </div>
          </form>
        </div>
      </GeneralModal>
    </>
  );
};

export default ClientWorkPhotoList;