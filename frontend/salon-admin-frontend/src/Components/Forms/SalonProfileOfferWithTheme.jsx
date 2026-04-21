import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import AddSalonProfileOfferWithTheme from './AddSalonProfileOfferWithTheme'
import toast, { Toaster } from "react-hot-toast";

const SalonProfileOfferWithTheme = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTheme, setEditingTheme] = useState(null);
  const [deleteTheme, setDeleteTheme] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchThemes = async (page = 1, search = "") => {
    try {
      setLoading(true);
      let url = `https://backendapi.trakky.in/salons/offer-themes/?page=${page}`;

      if (search) {
        url += `&theme_name=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
      });

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let themesData = data.results || data;

      // Sort newest first by created_at
      themesData = themesData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setThemes(themesData);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast.error("Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchThemes(1, searchTerm);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchThemes(page, searchTerm);
    }
  };

  const handleEditTheme = (theme) => {
    setEditingTheme(theme);
  };

  const handleUpdateTheme = async (formData) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/offer-themes/${editingTheme.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (response.ok) {
        toast.success("Theme updated successfully");
        setEditingTheme(null);
        fetchThemes(currentPage, searchTerm);
      } else {
        throw new Error("Failed to update theme");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme");
    }
  };

  const handleDeleteTheme = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/offer-themes/${deleteTheme.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
        }
      );

      if (response.status === 401) {
        logoutUser();
        return;
      }

      if (response.ok) {
        toast.success("Theme deleted successfully");
        setDeleteTheme(null);
        fetchThemes(currentPage, searchTerm);
      } else {
        throw new Error("Failed to delete theme");
      }
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Toaster />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Offer Themes</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add New Theme
          </button>
        </div>
        <div className="p-4 mb-2">
          <div onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search by theme name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] p-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                fetchThemes(1, "");
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading themes...</div>
          ) : themes.length === 0 ? (
            <div className="p-8 text-center">
              {searchTerm
                ? "No themes found matching your search"
                : "No themes available"}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Master Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Theme Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {themes.map((theme) => (
                      <tr key={theme.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {theme.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {theme.master_category_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {theme.theme_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {theme.image ? (
                            <img
                              src={theme.image}
                              alt={theme.theme_name}
                              className="h-full w-full object-cover rounded"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(theme.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {theme.updated_by || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(theme.updated_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditTheme(theme)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTheme(theme)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{" "}
                        <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {editingTheme && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Edit Theme</h2>
                <ThemeForm
                  theme={editingTheme}
                  onSubmit={handleUpdateTheme}
                  onCancel={() => setEditingTheme(null)}
                />
              </div>
            </div>
          </div>
        )}
        {deleteTheme && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">
                  Are you sure you want to delete the theme "
                  {deleteTheme.theme_name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteTheme(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteTheme}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {showAddModal && (
            <AddSalonProfileOfferWithTheme 
                  onSuccess={() => {
                    setShowAddModal(false);
                    fetchThemes(currentPage, searchTerm);
                  }}
                  onCancel={() => setShowAddModal(false)}
            />
        )} */}
      </div>
    </>
  );
};
const ThemeForm = ({ theme, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    theme_name: theme.theme_name || "",
    master_category: theme.master_category?.id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="theme_name"
        >
          Theme Name
        </label>
        <input
          type="text"
          id="theme_name"
          name="theme_name"
          value={formData.theme_name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="master_category"
        >
          Master Category
        </label>
        <input
          type="text"
          id="master_category"
          name="master_category"
          value={formData.master_category}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Theme
        </button>
      </div>
    </form>
  );
};

export default SalonProfileOfferWithTheme;
