import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaSearch } from "react-icons/fa";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";
import AddNationalCategory from "./Forms/AddNationalCategory";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

const ListNationalCategory = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState(null);
  const [loading, setLoading] = useState(false);

  const tableHeaders = ["Priority", "Update Priority", "Category Name", "More", "Action"];

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/national-category/");
      if (response.ok) {
        const data = await response.json();
        setCategoriesData(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (err) {
      toast.error("Failed to load categories.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/national-category/${id}/`,
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
        getCategories();
      } else if (response.status === 401) {
        logoutUser();
      } else {
        toast.error("Failed to delete category.", {
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("An error occurred.", {
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    if (!priority || isNaN(priority)) {
      toast.error("Please enter a valid priority.");
      return;
    }

    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/national-category/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authTokens.access,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (res.ok) {
        toast.success("Priority updated!", {
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        setShowEditPriorityModal(false);
        setNewPriority("");
        getCategories();
      } else {
        toast.error("Failed to update priority.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categoriesData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategoriesData(items);

    const newPriority = result.destination.index + 1;
    await handleUpdatePriority(result.draggableId, newPriority);
  };

  const filteredCategories = categoriesData.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  National Categories
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and reorder national salon categories
                </p>
              </div>
              
            </div>
          </div>

          {/* === SEARCH BAR – 60% Input | 40% Add Button === */}
          <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6 -mt-1 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 60% → Search Input */}
              <div className="lg:col-span-7">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by category name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* 40% → Add Button */}
              <div className="lg:col-span-5 flex justify-end">
                <Link to="/addnationalcategory">
                  <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <AddIcon className="w-5 h-5" />
                    Add New Category
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* === TABLE === */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-lg font-medium">
                  {searchTerm ? "No categories found" : "No categories available"}
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="overflow-x-auto"
                    >
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
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
                          {filteredCategories.map((Category, index) => (
                            <Draggable
                              key={Category.id}
                              draggableId={Category.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <React.Fragment>
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging
                                        ? "bg-blue-50 shadow-lg"
                                        : "hover:bg-gray-50"
                                    } transition-colors`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {Category.priority}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <button
                                        onClick={() => {
                                          setPriorityOfferId(Category.id);
                                          setNewPriority(Category.priority.toString());
                                          setShowEditPriorityModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit Priority"
                                      >
                                        <LowPriorityIcon className="w-5 h-5" />
                                      </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                      {Category.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <button
                                        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                        className="text-gray-600 hover:text-gray-800"
                                      >
                                        {expandedRow === index ? (
                                          <IoIosArrowDropup className="w-5 h-5" />
                                        ) : (
                                          <IoIosArrowDropdown className="w-5 h-5" />
                                        )}
                                      </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <div className="flex items-center gap-3">
                                        <button
                                          onClick={() => deleteCategory(Category.id)}
                                          className="text-red-600 hover:text-red-800"
                                          title="Delete"
                                        >
                                          <AiFillDelete className="w-5 h-5" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditCategoryData(Category);
                                            setShowEditModal(true);
                                          }}
                                          className="text-green-600 hover:text-green-800"
                                          title="Edit"
                                        >
                                          <FaEdit className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Expanded Row - Image */}
                                  {expandedRow === index && (
                                    <tr>
                                      <td colSpan={5} className="p-0 bg-gray-50">
                                        <div className="p-6 flex justify-center">
                                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <img
                                              src={Category.image}
                                              alt={Category.title}
                                              className="h-48 w-48 object-contain rounded-md"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* === FOOTER === */}
          <div className="mt-6 bg-white rounded-lg shadow-sm px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing 1 to {categoriesData.length} of {categoriesData.length} entries
            </div>
          </div>
        </div>
      </div>

      {/* === EDIT MODAL === */}
      <GeneralModal open={showEditModal} handleClose={() => setShowEditModal(false)}>
        <AddNationalCategory
          categoryData={editCategoryData}
          closeModal={() => setShowEditModal(false)}
          updateCategory={getCategories}
        />
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
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                handleUpdatePriority(priorityOfferId, newPriority);
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

export default ListNationalCategory;