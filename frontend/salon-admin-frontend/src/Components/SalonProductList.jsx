import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import SalonProductForm from "./Forms/SalonProductFrom";

const SalonProductList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [salonProduct, setSalonProduct] = useState([]);
  const [masterProduct, setMasterProduct] = useState({ count: 0, next: null, previous: null });
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [prioritySalonProductId, setPrioritySalonProductId] = useState(null);
  const [newPriority, setNewPriority] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const productsPerPage = 12;
  const totalPages = Math.ceil(masterProduct.count / productsPerPage) || 1;

  const tableHeaders = [
    "Priority",
    "Shift Priority",
    "Salon Name",
    "Product Name",
    "Product Image",
    "Action",
  ];

  useEffect(() => {
    fetchSalonProduct();
  }, [page, searchTerm]);

  const fetchSalonProduct = async () => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `https://backendapi.trakky.in/salons/productofsalon/?search=${encodeURIComponent(searchTerm)}&page=${page}&page_size=${productsPerPage}`
        : `https://backendapi.trakky.in/salons/productofsalon/?page=${page}&page_size=${productsPerPage}`;

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSalonProduct(data.results || []);
        setMasterProduct({
          count: data.count || 0,
          next: data.next,
          previous: data.previous,
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
        });
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load products. Please try again.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#ef4444", color: "#fff" },
      });
      setSalonProduct([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/productofsalon/${id}/`,
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
        fetchSalonProduct();
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
        `https://backendapi.trakky.in/salons/productofsalon/${id}/update-priority/`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setSalonProduct((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
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
                <h1 className="text-xl font-semibold text-gray-900">
                  Salon Products
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage products offered by salons
                </p>
              </div>
              <Link to="/SalonProductFrom">
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Product
                </button>
              </Link>
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
                    placeholder="Search by salon or product name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* 40% → Add Button */}
             
            </div>
          </div>

          {/* === TABLE === */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading products...</p>
              </div>
            ) : salonProduct.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-lg font-medium">
                  {searchTerm ? "No products found" : "No salon products"}
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
                    {salonProduct.map((salon, index) => (
                      <React.Fragment key={salon.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {salon.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                setPrioritySalonProductId(salon.id);
                                setNewPriority(salon.priority.toString());
                                setShowEditPriorityModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Priority"
                            >
                              <LowPriorityIcon className="w-5 h-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {salon.salon_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {salon.product_name}
                          </td>
                          <td className="px-6 py-4">
                            {salon.product_image ? (
                              <img
                                src={salon.product_image}
                                alt={salon.product_name}
                                className="h-16 w-16 object-contain rounded-md mx-auto"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleDeleteService(salon.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <AiFillDelete className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(salon.id)}
                                className="text-green-600 hover:text-green-800"
                                title="Edit"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Edit Form Row */}
                        {updateFormOpened === salon.id && (
                          <tr>
                            <td colSpan={6} className="p-0 bg-gray-50">
                              <div className="p-6">
                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                  <SalonProductForm
                                    salonProductDataList={salon}
                                    setSalonProductDataList={(data) => {
                                      setSalonProduct((prev) =>
                                        prev.map((p) => (p.id === data.id ? data : p))
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
                Showing {(page - 1) * productsPerPage + 1} to{" "}
                {Math.min(page * productsPerPage, masterProduct.count)} of{" "}
                {masterProduct.count} entries
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
                    disabled={pageNum === "..."}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : pageNum === "..."
                        ? "cursor-default text-gray-400"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                handleUpdatePriority(prioritySalonProductId, newPriority);
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

export default SalonProductList;