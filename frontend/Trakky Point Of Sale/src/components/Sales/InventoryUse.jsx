import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useConfirm } from "material-ui-confirm"; // <-- Added
import {
  Search,
  X,
  Filter,
  Package,
  Tag,
  TrendingUp,
  AlertCircle,
  Loader2,
  BarChart3,
  ShoppingBag,
  IndianRupee,
  Trash2, // <-- Added for delete icon
} from "lucide-react";

const InventorySales = () => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens?.access_token;
  const navigate = useNavigate();
  const confirm = useConfirm(); // <-- Confirm hook
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterData, setFilteredData] = useState([]);
  const [inventoryUse, setInventoryUse] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const tableRef = useRef(null);

  // Fetch inventory data
  const fetchData = async () => {
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
        setInventoryUse(sortedData);
        setFilteredData(sortedData);
      } else {
        throw new Error("Failed to fetch inventory data");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteInventoryItem = async (id, productName) => {
    try {
      await confirm({
        title: "Delete Inventory Item?",
        description: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
        confirmationText: "Delete",
        cancellationText: "Cancel",
        confirmationButtonProps: { color: "error" },
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/use-inventory/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Inventory item deleted successfully");
        // Remove from state
        const updatedData = inventoryUse.filter((item) => item.id !== id);
        setInventoryUse(updatedData);
        setFilteredData(updatedData);
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      if (error === "cancel") return; // User cancelled
      toast.error("Failed to delete inventory item");
    }
  };

  // Initial data fetching
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Search functionality
  useEffect(() => {
    if (!Array.isArray(inventoryUse)) return;

    if (search === "") {
      setFilteredData(inventoryUse);
      if (activeFilters.includes(`search: ${search}`)) {
        setActiveFilters(activeFilters.filter(f => !f.startsWith('search:')));
      }
    } else {
      const filtered = inventoryUse.filter((item) =>
        item?.product_details?.product_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredData(filtered || []);

      if (!activeFilters.includes(`search: ${search}`)) {
        setActiveFilters([...activeFilters.filter(f => !f.startsWith('search:')), `search: ${search}`]);
      }
    }

    if (search && tableRef.current) {
      setTimeout(() => {
        tableRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [search, inventoryUse]);

  // Chart data
  const getChartData = () => {
    if (!Array.isArray(filterData)) return { topProducts: [], usageData: [] };

    const topProducts = [...filterData]
      .sort(
        (a, b) =>
          (b?.retail_price_per_unit || 0) - (a?.retail_price_per_unit || 0)
      )
      .slice(0, 5)
      .map((item) => ({
        name:
          item?.product_details?.product_name?.substring(0, 15) || "Unknown",
        retail: item?.retail_price_per_unit || 0,
        supply: item?.supply_price_per_unit || 0,
      }));

    const usageData = [...filterData]
      .sort((a, b) => (b?.quantity || 0) - (a?.quantity || 0))
      .slice(0, 5)
      .map((item) => ({
        name:
          item?.product_details?.product_name?.substring(0, 15) || "Unknown",
        quantity: item?.quantity || 0,
      }));

    return { topProducts, usageData };
  };

  const { topProducts, usageData } = getChartData();

  // Stats
  const stats = [
    {
      title: "Total Products",
      value: Array.isArray(filterData) ? filterData.length : 0,
      change: "+12%",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: <Package className="w-4 h-4" />
    },
    {
      title: "Average Retail Price",
      value:
        Array.isArray(filterData) && filterData.length > 0
          ? `₹${(
              filterData.reduce(
                (sum, item) =>
                  sum + (parseFloat(item?.retail_price_per_unit) || 0),
                0
              ) / filterData.length
            ).toFixed(2)}`
          : "₹0.00",
      change: "+5%",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      icon: <IndianRupee className="w-4 h-4" />
    },
    {
      title: "Low Stock Items",
      value: Array.isArray(filterData)
        ? filterData.filter(
            (item) =>
              item?.product_details?.low_stock_level &&
              item?.quantity &&
              parseFloat(item.quantity) <=
                parseFloat(item.product_details.low_stock_level)
          ).length
        : 0,
      change: "-2%",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      title: "Total Inventory Value",
      value:
        Array.isArray(filterData) && filterData.length > 0
          ? `₹${filterData
              .reduce((sum, item) => {
                const retailPrice =
                  parseFloat(item?.retail_price_per_unit) || 0;
                const quantity = parseFloat(item?.quantity) || 0;
                return Number(sum) + Number(retailPrice) * Number(quantity);
              }, 0)
              .toFixed(2)}`
          : "₹0.00",
      change: "+8%",
      color: "bg-gradient-to-r from-purple-500 to-[#492DBD]",
      icon: <ShoppingBag className="w-4 h-4" />
    },
  ];

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

  const LoadingSpinner = () => (
    <div className="w-6 h-6 border-2 border-[#492DBD] border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#492DBD] pl-3">
              Inventory Use Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track Your Inventory Usage
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
                  Quantity Used
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Retail Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Low Stock Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <LoadingSpinner />
                      <span className="ml-2 text-gray-600">Loading inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : filterData?.length > 0 ? (
                filterData.map((item) => {
                  const isLowStock = 
                    item?.product_details?.low_stock_level &&
                    item?.quantity &&
                    parseFloat(item.quantity) <=
                      parseFloat(item.product_details.low_stock_level);

                  return (
                    <tr key={item?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                            <span className="font-medium text-gray-700">
                              {item?.product_details?.product_name
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item?.product_details?.product_name || "N/A"}
                            </div>
                            {item?.product_details?.category && (
                              <div className="text-xs text-gray-500">
                                {item.product_details.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item?.product_details?.brand_name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item?.quantity || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          ₹{item?.supply_price_per_unit || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{item?.retail_price_per_unit || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item?.product_details?.low_stock_level || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isLowStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isLowStock ? "bg-red-500" : "bg-green-500"
                          }`}></div>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteInventoryItem(item.id, item?.product_details?.product_name || "this item")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No inventory data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 mt-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Top Products by Retail Price
            </h3>
          </div>
          <div className="h-48">
            {topProducts.length > 0 ? (
              <div className="space-y-2">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-gray-700 truncate max-w-[120px]">
                        {product.name}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      ₹{product.retail}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No chart data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Most Used Products
            </h3>
          </div>
          <div className="h-48">
            {usageData.length > 0 ? (
              <div className="space-y-2">
                {usageData.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-xs text-gray-700 truncate max-w-[120px]">
                        {product.name}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {product.quantity} units
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No chart data available
              </div>
            )}
          </div>
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
            Inventory Use
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
      </div>
    </div>
  );
};

export default InventorySales;