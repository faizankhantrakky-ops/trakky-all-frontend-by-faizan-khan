import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  Plus,
  Edit,
  Trash2,
  Package,
  Tag,
  AlertCircle,
  Loader2,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Hash,
  AlertTriangle
} from "lucide-react";

const InUseProduct = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [useInventory, setUseInventory] = useState([]);
  const [filterListData, setFilterListData] = useState([]);
  const [editProductData, setEditProductData] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const tableRef = useRef(null);

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    consumption: "",
    measure_unit: "",
    measure_amount: "",
  });

  // Stats with safe calculations
  const stats = [
    {
      title: "Total In Use Products",
      value: Array.isArray(filterListData) ? filterListData.length : 0,
      change: "+8%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <Package className="w-4 h-4" />
    },
    {
      title: "Average Consumption",
      value:
        Array.isArray(filterListData) && filterListData.length > 0
          ? `${(
              filterListData.reduce(
                (sum, item) =>
                  sum + (parseFloat(item?.per_use_consumption) || 0),
                0
              ) / filterListData.length
            ).toFixed(2)} ${filterListData[0]?.measure_unit || "units"}`
          : "0 units",
      change: "+3%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      title: "Low Quantity Items",
      value: Array.isArray(filterListData)
        ? filterListData.filter(
            (item) =>
              item?.remaining_quantity &&
              parseFloat(item.remaining_quantity) <= 10
          ).length
        : 0,
      change: "-5%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      title: "Active Products",
      value: Array.isArray(filterListData)
        ? new Set(
            filterListData
              .map(
                (item) =>
                  item?.use_inventory_details?.product_details?.product_name
              )
              .filter((name) => name !== undefined && name !== null)
          ).size
        : 0,
      change: "+7%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <Tag className="w-4 h-4" />
    },
  ];

  useEffect(() => {
    if (search === "") {
      const sortedData = [...useInventory].sort((a, b) => b.id - a.id);
      setFilterData(sortedData);
      if (activeFilters.includes(`search: ${search}`)) {
        setActiveFilters(activeFilters.filter(f => !f.startsWith('search:')));
      }
    } else {
      const filtered = useInventory.filter((item) =>
        item?.use_inventory_details?.product_details?.product_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
      const sortedFiltered = [...filtered].sort((a, b) => b.id - a.id);
      setFilterData(sortedFiltered);
      if (!activeFilters.includes(`search: ${search}`)) {
        setActiveFilters([...activeFilters.filter(f => !f.startsWith('search:')), `search: ${search}`]);
      }
    }

    if (search && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [search, useInventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (useInventory.length > 0 && formData.product) {
      const selectProduct = useInventory.find(
        (item) => item.id === formData.product
      );
      if (selectProduct) {
        setFormData((prev) => ({
          ...prev,
          measure_unit: selectProduct?.product_details?.measure_unit || "",
          measure_amount: selectProduct?.product_details?.measure_amount || "",
        }));
      }
    }
  }, [formData.product, useInventory]);

  const fetchUseInventoryList = async () => {

               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }

    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/currentuse/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const sortedData = Array.isArray(responseData)
          ? responseData.sort((a, b) => b.id - a.id)
          : [];
        setFilterListData(sortedData);
      } else {
        throw new Error("Failed to fetch use inventory list");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUseInventory = async () => {
               if (!navigator.onLine) {
    toast.error("No Internet Connection");
    return;
  }
  
    setLoading(true);
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/use-inventory/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        const sortedData = Array.isArray(responseData)
          ? responseData.sort((a, b) => b.id - a.id)
          : [];
        setUseInventory(sortedData);
        setFilterData(sortedData);
      } else {
        throw new Error("Failed to fetch use inventory");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUseInventoryList();
      fetchUseInventory();
    }
  }, [token]);

  const handleOpen = (product = null) => {
    setEditProductData(product);
    setOpen(true);
    if (product) {
      setFormData({
        product: product?.use_inventory || "",
        quantity: product.total_available_quantity || "",
        consumption: product.per_use_consumption || "",
        measure_unit: product.measure_unit || "",
        measure_amount: product.remaining_quantity || "",
      });
    } else {
      setFormData({
        product: "",
        quantity: "",
        consumption: "",
        measure_unit: "",
        measure_amount: "",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      product: "",
      quantity: "",
      consumption: "",
      measure_unit: "",
      measure_amount: "",
    });
  };

  const resetSearch = () => {
    setSearch("");
  };

  const resetFilters = () => {
    setSearch("");
    setActiveFilters([]);
    setShowFilterMenu(false);
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("search:")) {
      setSearch("");
    }
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
  };

  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = useInventory.find(
      (product) => product.id === selectedProductId
    );

    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        product: selectedProductId,
        measure_unit: selectedProduct?.product_details?.measure_unit || "",
        measure_amount: selectedProduct?.product_details?.measure_amount || "",
        quantity: 1,
      }));
    }
  };

  const handleSubmit = async () => {
   

    const payload = {
      use_inventory: formData.product,
      total_available_quantity: formData.measure_amount,
      remaining_quantity: formData.measure_amount,
      per_use_consumption: formData.consumption,
      measure_unit: formData.measure_unit,
      quantity: formData.quantity,
    };

    try {
      const endpoint = editProductData
        ? `https://backendapi.trakky.in/salonvendor/currentuse/${editProductData.id}/`
        : `https://backendapi.trakky.in/salonvendor/currentuse/`;

      const method = editProductData ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          editProductData
            ? "Product updated successfully"
            : "Product added to use inventory successfully"
        );
        handleClose();
        fetchUseInventoryList();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/currentuse/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchUseInventoryList();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const LoadingSpinner = () => (
    <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header - Desktop */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              In Use Products
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Products Currently In Use
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] transition-colors"
              />
              {search && (
                <button
                  onClick={resetSearch}
                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFilterMenu ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"} transition-colors`}
            >
              <Filter className={`w-4 h-4 ${showFilterMenu ? "text-blue-600" : "text-gray-600"}`} />
              Filters
            </button>

            <button
              onClick={() => handleOpen(null)}
              className="flex items-center gap-2 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`${stat.color} rounded-lg p-3 text-white shadow-md relative overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-14 h-14 opacity-10">
              {React.cloneElement(stat.icon, { className: "w-full h-full" })}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
                <div className="p-1.5 bg-white bg-opacity-20 rounded-md">
                  {React.cloneElement(stat.icon, { className: "w-3 h-3" })}
                </div>
              </div>
              
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-200" : "text-red-200"}`}>
                {stat.change} vs last month
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="mb-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-800">Filter Options</h3>
              </div>
              <button
                onClick={() => setShowFilterMenu(false)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm bg-white"
                />
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="flex-1 py-2 rounded-lg bg-[#492DBD] text-white hover:bg-purple-700 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={tableRef}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Brand Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Per Use
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-gray-600">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filterListData?.length > 0 ? (
                filterListData.map((item) => {
                  const isLowQuantity = item?.remaining_quantity && parseFloat(item.remaining_quantity) <= 10;
                  
                  return (
                    <tr key={item?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                            <span className="font-medium text-gray-700">
                              {item?.use_inventory_details?.product_details?.product_name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item?.use_inventory_details?.product_details
                                ?.product_name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item?.use_inventory_details?.product_details
                            ?.brand_name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.total_available_quantity || "-"} {item?.measure_unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isLowQuantity
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isLowQuantity ? "bg-red-500" : "bg-green-500"
                          }`}></div>
                          {item?.remaining_quantity || "-"} {item?.measure_unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item?.per_use_consumption || "-"} {item?.measure_unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpen(item)}
                            className="p-1.5 rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(item?.id)}
                            className="p-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            In Use Products
          </h3>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="p-2 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={() => handleOpen(null)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-purple-700 mb-4"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <h2 className="text-base font-bold text-gray-900">
                    {editProductData ? "Edit Product" : "Add New Product"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Product *
                    </label>
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleProductSelect}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                    >
                      <option value="">Select Product</option>
                      {useInventory?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item?.product_details?.product_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                        placeholder="Enter quantity"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Measure Unit
                      </label>
                      <select
                        name="measure_unit"
                        value={formData.measure_unit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                      >
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="measure_amount"
                        value={formData.measure_amount}
                        onChange={handleChange}
                        className="w-full pl-3 pr-12 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                        placeholder="Amount"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {formData.measure_unit || "units"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Per Use Consumption *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="consumption"
                        value={formData.consumption}
                        onChange={handleChange}
                        className="w-full pl-3 pr-12 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none text-sm"
                        placeholder="Enter consumption"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {formData.measure_unit || "units"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-[#492DBD] text-white hover:bg-purple-700 text-xs font-medium"
                >
                  {editProductData ? "Update" : "Submit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InUseProduct;