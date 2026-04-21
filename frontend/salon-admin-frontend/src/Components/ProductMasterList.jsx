import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import ProductMasterFrom from "./Forms/ProductMasterFrom";
import { FaSearch } from "react-icons/fa";

const ProductMasterList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [productmaster, setProductMaster] = useState([]);
  const [masterProductDetails, setMasterProductDetails] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [priorityMasterServiceId, setPriorityMasterServiceId] = useState(null);
  const [newPriority, setNewPriority] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const servicesPerPage = 100;
  const totalPages = Math.ceil(masterProductDetails?.count / servicesPerPage) || 1;

  const tableHeaders = ["Shift Priority", "Priority", "Name", "Slug", "Image", "Action"];

  useEffect(() => {
    fetchMasterServices();
  }, [page]);

  const fetchMasterServices = async () => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `https://backendapi.trakky.in/salons/masterproducts/?search=${encodeURIComponent(searchTerm)}&page=${page}`
        : `https://backendapi.trakky.in/salons/masterproducts/?page=${page}`;

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setProductMaster(data.results || []);
        setMasterProductDetails(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch products.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e) => {
    const selectedPage = parseInt(e.target.id);
    setPage(selectedPage);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterproducts/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Product deleted successfully!", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        setProductMaster(productmaster.filter((s) => s.id !== id));
      } else if (response.status === 401) {
        logoutUser();
      } else {
        toast.error("Failed to delete product.", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      toast.error("An error occurred.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    if (!priority || isNaN(priority)) {
      toast.error("Please enter a valid priority number.");
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterproducts/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setProductMaster((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        toast.success("Priority updated!", {
          duration: 3000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#22c55e", color: "#fff" },
        });
        setShowEditPriorityModal(false);
        setNewPriority("");
      } else {
        toast.error("Failed to update priority.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3">

          {/* === HEADER === */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Product Master List
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all product master entries
                </p>
              </div>
              {/* <Link to="/productmasterservicesfrom">
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Product
                </button>
              </Link> */}
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name or slug..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* 40% → Add Button (aligned right) */}
              <div className="lg:col-span-5 flex justify-end">
                <Link to="/productmasterservicesfrom">
                  <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    <AddIcon className="w-5 h-5" />
                    Add New Product
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
                <p className="mt-4 text-sm text-gray-500">Loading products...</p>
              </div>
            ) : productmaster.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-lg font-medium">
                  {searchTerm ? "No products found" : "No products available"}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {productmaster.map((service, index) => (
                      <React.Fragment key={service.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                setPriorityMasterServiceId(service.id);
                                setNewPriority(service.priority.toString());
                                setShowEditPriorityModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Priority"
                            >
                              <LowPriorityIcon className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                            {service.slug}
                          </td>
                          <td className="px-6 py-4">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.name}
                                className="h-16 w-16 object-contain rounded-md mx-auto"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(service.id)}
                                className="text-green-600 hover:text-green-800"
                                title="Edit"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Form Row */}
                        {updateFormOpened === service.id && (
                          <tr>
                            <td colSpan={6} className="p-0 bg-gray-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <ProductMasterFrom
                                    ProductmasterData={service}
                                    setProductmasterData={(data) => {
                                      setProductMaster((prev) =>
                                        prev.map((s) => (s.id === data.id ? data : s))
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                    closeModal={() => setUpdateFormOpened(null)}
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

          {/* === FOOTER + PAGINATION === */}
          <div className="mt-6 bg-white rounded-lg shadow-sm px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * servicesPerPage + 1} to{" "}
                {Math.min(page * servicesPerPage, masterProductDetails?.count || 0)} of{" "}
                {masterProductDetails?.count || 0} entries
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="1"
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  First
                </button>
                {page > 1 && (
                  <button
                    id={page - 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Prev
                  </button>
                )}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, page - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      id={pageNum}
                      onClick={handlePageChange}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        pageNum === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {page < totalPages && (
                  <button
                    id={page + 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                )}
                <button
                  id={totalPages}
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                handleUpdatePriority(priorityMasterServiceId, newPriority);
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

export default ProductMasterList;