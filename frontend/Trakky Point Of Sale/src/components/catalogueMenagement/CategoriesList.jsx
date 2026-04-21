import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Filter,
  RefreshCw,
  User,
  Users,
  ChevronRight,
  AlertCircle,
  Loader2,
  Tag,
  ListFilter,
  X,
  Grid3x3,
  LayoutList,
  GripVertical,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const CategoriesList = () => {
  const { vendorData, authTokens } = useContext(AuthContext); // Correct token access

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [cateLoading, setCateLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState({
    categoryName: "",
    gender: "",
  });
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);

  // Get headers with Bearer token
  const getAuthHeaders = () => {
    const token = authTokens?.access_token;
    if (!token) {
      console.warn("No access token found. User may not be authenticated.");
      toast.warn("Session expired. Please log in again.");
    }
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchCategories = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    setCateLoading(true);

    if (!vendorData?.salon) {
      setCateLoading(false);
      return;
    }

    const url = `https://backendapi.trakky.in/salons/category/?salon_id=${vendorData?.salon}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        const sortedData = [...data].sort((a, b) => (a.priority || 0) - (b.priority || 0));
        setCategories(sortedData);
        setFilteredCategories(sortedData);
      } else {
        toast.error(data.detail || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    } finally {
      setCateLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [vendorData, authTokens]); // Re-fetch if token changes

  useEffect(() => {
    let result = [...categories];

    if (filters.categoryName) {
      result = result.filter((item) =>
        item.category_name
          .toLowerCase()
          .includes(filters.categoryName.toLowerCase())
      );
    }

    if (filters.gender) {
      result = result.filter(
        (item) =>
          item.category_gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    setFilteredCategories(result);
  }, [filters, categories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ categoryName: "", gender: "" });
    setShowFilters(false);
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <User className="w-4 h-4" />;
      case "female":
        return <Users className="w-4 h-4" />;
      case "unisex":
        return <User className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "female":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "unisex":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    // Optimistic UI update
    setFilteredCategories(updatedItems);
    setCategories(updatedItems);

    setUpdating(true);

    try {
      const updatePromises = updatedItems.map((item) =>
        fetch(`https://backendapi.trakky.in/salons/category/${item.id}/`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ priority: item.priority }),
        })
      );

      const responses = await Promise.all(updatePromises);

      if (responses.every((res) => res.ok)) {
        toast.success("Category order updated successfully!");
      } else {
    
      }
    } catch (error) {
      toast.error("Failed to save order. Reverting changes...");
      fetchCategories(); // Revert on error
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-4 border-l-4 border-[#492DBD] pl-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Categorie's</h1>
                <p className="text-xs text-gray-600">Manage all service categories</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
              >
                <LayoutList className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
              >
                <Grid3x3 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-lg border ${showFilters ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <Filter className={`w-4 h-4 ${showFilters ? "text-indigo-600" : "text-gray-600"}`} />
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-800">Filter Categories</h3>
                      </div>
                      <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-md">
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="categoryName"
                          value={filters.categoryName}
                          onChange={handleFilterChange}
                          placeholder="Search categories..."
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white"
                        />
                      </div>

                      <div className="relative">
                        <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="gender"
                          value={filters.gender}
                          onChange={handleFilterChange}
                          className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white appearance-none"
                        >
                          <option value="">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {(filters.categoryName || filters.gender) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-600">Active:</span>
                        {filters.categoryName && (
                          <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-200">
                            <span>Name: {filters.categoryName}</span>
                            <button onClick={() => setFilters(prev => ({ ...prev, categoryName: "" }))}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {filters.gender && (
                          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs border border-green-200">
                            <span>Gender: {filters.gender}</span>
                            <button onClick={() => setFilters(prev => ({ ...prev, gender: "" }))}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
                      <button onClick={resetFilters} className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium">
                        Reset
                      </button>
                      <button onClick={() => setShowFilters(false)} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchCategories}
              disabled={cateLoading || updating}
              className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${cateLoading || updating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-md">
                <Tag className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Male</p>
                <p className="text-lg font-bold text-gray-900">
                  {categories.filter(c => c.category_gender?.toLowerCase() === "male").length}
                </p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-md">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Female</p>
                <p className="text-lg font-bold text-gray-900">
                  {categories.filter(c => c.category_gender?.toLowerCase() === "female").length}
                </p>
              </div>
              <div className="p-2 bg-pink-50 rounded-md">
                <Users className="w-4 h-4 text-pink-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Unisex</p>
                <p className="text-lg font-bold text-gray-900">
                  {categories.filter(c => c.category_gender?.toLowerCase() === "unisex").length}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <User className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* List/Grid View */}
        {cateLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="mt-3 text-sm text-gray-600 font-medium">Loading categories...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          viewMode === "list" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase w-12">Drag & Drop</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Category Name</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Gender</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredCategories.map((item, index) => (
                            <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`hover:bg-gray-50 ${snapshot.isDragging ? 'bg-indigo-50' : ''}`}
                                >
                                  <td className="py-3 px-4" {...provided.dragHandleProps}>
                                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="w-7 h-7 flex items-center justify-center rounded bg-indigo-100">
                                      <span className="font-medium text-sm text-indigo-700">{item.priority || index + 1}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <p className="font-medium text-gray-900 text-sm">{item.category_name || "No Name"}</p>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${getGenderColor(item.category_gender)}`}>
                                      {getGenderIcon(item.category_gender)}
                                      <span className="font-medium capitalize">{item.category_gender || "Not specified"}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                      <span className="font-medium">Active</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden group relative">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-50">
                          <span className="font-bold text-indigo-700 text-sm">{item.priority || index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.category_name || "No Name"}</h3>
                      </div>
                      <GripVertical className="w-4 h-4 text-gray-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${getGenderColor(item.category_gender)}`}>
                        {getGenderIcon(item.category_gender)}
                        <span className="font-medium capitalize">{item.category_gender || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-600 text-center text-sm max-w-xs mb-4">Try adjusting your search or reset filters</p>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(true)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium">
                Adjust Filters
              </button>
              <button onClick={resetFilters} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium">
                Reset All
              </button>
            </div>
          </div>
        )}

        {filteredCategories.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
            <div>Showing <strong>{filteredCategories.length}</strong> of <strong>{categories.length}</strong> categories</div>
            <div className="flex items-center gap-1">
              {updating && <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span>{updating ? 'Updating order...' : 'All systems operational'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;