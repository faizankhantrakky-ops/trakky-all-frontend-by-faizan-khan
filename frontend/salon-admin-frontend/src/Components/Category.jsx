import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { FaInfoCircle, FaSearch } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import GeneralModal from "../Components/generalModal/GeneralModal";
import AddCategory from "./Forms/CategoryForm";
import AuthContext from "../Context/AuthContext";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const Category = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [CategoryData, setCategoryData] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");
  const [loading, setLoading] = useState(false);

  const tableHeaders = [
    "Priority",
    "City",
    "Name",
    "Gender",
    "Slug",
    "Salon Name",
    "Image",
    "Actions",
  ];

  // === Fetch Cities ===
  const getCity = async () => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/city/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setCityPayload(data?.payload || []);
      const cityNames = data?.payload?.map((item) => item.name) || [];
      setCity(cityNames);
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to load cities.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  // === Fetch Categories ===
  const getCategory = async (selectedCity = "", selectedGender = "") => {
    setLoading(true);
    try {
      let url = `https://backendapi.trakky.in/salons/category/`;
      const params = new URLSearchParams();
      if (selectedCity) params.append("city", selectedCity);
      if (selectedGender) params.append("gender", selectedGender.toLowerCase());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const data = await response.json();
        setCategoryData(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to load categories.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load + filter change
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (selectedCity || selectedGender) {
      setCategoryData([]);
      getCategory(selectedCity, selectedGender);
    }
  }, [selectedCity, selectedGender]);

  // === Delete Category ===
  const deleteCategory = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this category?",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/category/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Category deleted successfully!", {
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        getCategory(selectedCity, selectedGender);
      } else if (response.status === 401) {
        logoutUser();
      } else {
        toast.error("Failed to delete category.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error("An error occurred.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    }
  };

  // === Update Priority ===
  const handleUpdatePriority = async (id, priority) => {
    if (!priority || isNaN(priority)) {
      toast.error("Please enter a valid priority.");
      return;
    }

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/category/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authTokens.access,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (res.status === 200) {
        toast.success("Priority updated!", {
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        setShowEditPriorityModal(false);
        setNewPriority("");
        getCategory(selectedCity, selectedGender);
      } else {
        toast.error("Failed to update priority.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  // === Search Filter ===
  useEffect(() => {
    const filtered = CategoryData.filter((cat) =>
      cat?.category_name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setFilteredCategory(filtered);
  }, [searchTerm, CategoryData]);

  const displayData = searchTerm ? filteredCategory : CategoryData;

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3">

          {/* === HEADER === */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Categories
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage salon categories by city and gender
                </p>
              </div>
              
            </div>
          </div>

          {/* === FILTERS & SEARCH === */}
          <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6 -mt-1 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Filters: City + Gender */}
              <div className="lg:col-span-7 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedGender("");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    >
                      <option value="">All Cities</option>
                      {city.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      disabled={!selectedCity}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-50"
                    >
                      <option value="">All Genders</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by category name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Add Button */}
              <div className="lg:col-span-5 flex justify-end">
                <Link to="/addcategory">
                  <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <AddIcon className="w-5 h-5" />
                    Add New Category
                  </button>
                </Link>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4 space-y-1 text-xs text-gray-600">
              <p><strong>Note:</strong> First select city then you can select gender.</p>
              <p><strong>Note:</strong> Please first select city then you can change priority.</p>
            </div>
          </div>

          {/* === TABLE === */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : displayData.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-lg font-medium">
                  {searchTerm ? "No categories found" : "No categories available"}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedCity && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change Priority
                        </th>
                      )}
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayData.map((category, index) => (
                      <React.Fragment key={category.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          {selectedCity && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => {
                                  setPriorityOfferId(category.id);
                                  setNewPriority(category.priority?.toString() || "");
                                  setShowEditPriorityModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit Priority"
                              >
                                <LowPriorityIcon className="w-5 h-5" />
                              </button>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.priority || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.city || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {category.category_name || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.category_gender || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                            {category.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                setModalData(Object.values(category.salon_names || {}).join(", "));
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Salons"
                            >
                              <FaInfoCircle className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            {category.category_image ? (
                              <img
                                src={category.category_image}
                                alt={category.category_name}
                                className="h-20 w-20 object-contain rounded-md mx-auto"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => deleteCategory(category.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="text-green-600 hover:text-green-800"
                                title="Edit"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Form Row */}
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={selectedCity ? 9 : 8} className="p-0 bg-gray-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <AddCategory
                                    CategoryData={category}
                                    setCategoryData={(data) => {
                                      setCategoryData((prev) =>
                                        prev.map((item) => (item.id === data.id ? data : item))
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                  />
                                </Modal>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* === FOOTER === */}
          <div className="mt-6 bg-white rounded-lg shadow-sm px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing 1 to {CategoryData.length} of {CategoryData.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* === SALONS MODAL === */}
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-center mb-4">Associated Salons</h3>
          <div className="max-h-64 overflow-y-auto">
            {modalData ? (
              modalData.split(",").map((salon, idx) => (
                <div key={idx} className="py-1 text-sm text-gray-700">
                  {idx + 1}. {salon.trim()}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No salons</p>
            )}
          </div>
        </div>
      </GeneralModal>

      {/* === PRIORITY MODAL === */}
      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => {
          setShowEditPriorityModal(false);
          setNewPriority("");
        }}
      >
        <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-semibold text-center mb-4">Update Priority</h3>
          <div className="flex justify-center mb-4">
            <input
              type="number"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              placeholder="Enter priority"
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                handleUpdatePriority(priorityOfferId, newPriority);
                setShowEditPriorityModal(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Update
            </button>
            <button
              onClick={() => {
                setShowEditPriorityModal(false);
                setNewPriority("");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Category;