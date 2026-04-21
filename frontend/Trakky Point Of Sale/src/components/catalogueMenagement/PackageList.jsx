import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniHeader from "./MiniHeader";
import {
  Search,
  Filter,
  IndianRupee,
  Clock,
  Calendar,
  Tag,
  Package,
  RefreshCw,
  Percent,
  Users,
  ClockIcon,
  ChevronRight,
} from "lucide-react";

const PackageList = () => {
  const { vendorData } = useContext(AuthContext);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  const fetchPackages = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }

    setPackageLoading(true);

    if (!vendorData?.salon) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/packages/?salon_id=${vendorData?.salon}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setPackageData(data);
        applyFiltersAndSort(data);
      } else {
        toast.error(`Failed to fetch packages: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    } finally {
      setPackageLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [vendorData?.salon]);

  const applyFiltersAndSort = (data = packageData) => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((item) =>
        item.package_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.discount_price) - parseFloat(b.discount_price);
        case "price-high":
          return parseFloat(b.discount_price) - parseFloat(a.discount_price);
        case "name":
          return a.package_name.localeCompare(b.package_name);
        case "discount":
          const discountA =
            ((parseFloat(a.actual_price) - parseFloat(a.discount_price)) /
              parseFloat(a.actual_price)) *
            100;
          const discountB =
            ((parseFloat(b.actual_price) - parseFloat(b.discount_price)) /
              parseFloat(b.actual_price)) *
            100;
          return discountB - discountA;
        default:
          return 0;
      }
    });

    setFilteredPackages(result);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, sortBy]);

  const formatTime = (time) => {
    if (!time) return "N/A";

    const parts = [];
    if (time?.days && time.days !== "0") {
      parts.push(`${time.days} Day${time.days !== "1" ? "s" : ""}`);
    }
    if (time?.seating && time.seating !== "0") {
      parts.push(`${time.seating} Seating${time.seating !== "1" ? "s" : ""}`);
    }
    if (time?.hours && time.hours !== "0") {
      parts.push(`${time.hours} Hour${time.hours !== "1" ? "s" : ""}`);
    }
    if (time?.minutes && time.minutes !== "0") {
      parts.push(`${time.minutes} Min${time.minutes !== "1" ? "s" : ""}`);
    }

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const calculateDiscountPercentage = (actual, discount) => {
    if (!actual || !discount || parseFloat(actual) === 0) return 0;
    return Math.round(
      ((parseFloat(actual) - parseFloat(discount)) / parseFloat(actual)) * 100
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <MiniHeader title="Our Packages" />

      <div className="p-6">
        {/* Header Section */}
        <div className="mb-4 -mt-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mt-2">
                Browse and manage all salon packages with detailed service
                information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPackages}
                className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors text-sm font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Packages
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                  placeholder="Search by package name..."
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] appearance-none bg-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="discount">Highest Discount</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Packages List */}
        {packageLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#492DBD] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#492DBD] rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading packages...
            </p>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="space-y-6">
            {filteredPackages.map((packageItem, index) => {
              const discountPercentage = calculateDiscountPercentage(
                packageItem.actual_price,
                packageItem.discount_price
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Package Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#492DBD] text-white p-3 rounded-lg">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-bold text-gray-900">
                              {packageItem.package_name}
                            </h2>
                            {discountPercentage > 0 && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                Save {discountPercentage}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{packageItem.discount_price}
                              </span>
                            </div>
                            {packageItem.actual_price &&
                              packageItem.actual_price !==
                                packageItem.discount_price && (
                                <>
                                  <span className="text-gray-400">|</span>
                                  <del className="text-lg text-gray-500">
                                    ₹{packageItem.actual_price}
                                  </del>
                                </>
                              )}
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {packageItem.service_included?.length || 0}{" "}
                                services
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Package #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Services Included */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#492DBD]" />
                      Services Included
                    </h3>
                    <div className="space-y-3">
                      {packageItem.service_included?.map(
                        (service, serviceIndex) => (
                          <div
                            key={serviceIndex}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            {/* Service Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#492DBD] rounded-full"></div>
                                <h4 className="font-medium text-gray-900">
                                  {service.service_name || "Unnamed Service"}
                                </h4>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {service.gender || "Not specified"}
                                </span>
                              </div>
                              {service.category_name && (
                                <p className="text-sm text-gray-500 mt-1 ml-5">
                                  Category: {service.category_name}
                                </p>
                              )}
                            </div>

                            {/* Duration and Price */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                              {/* Duration */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                  {formatTime(service.service_time)}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{service.price || "0"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Package Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          Total Services:{" "}
                          {packageItem.service_included?.length || 0}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          Total Value: ₹{packageItem.actual_price}
                        </span>
                        {discountPercentage > 0 && (
                          <span className="ml-2 text-green-600">
                            • Save ₹
                            {parseFloat(packageItem.actual_price) -
                              parseFloat(packageItem.discount_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No packages found" : "No packages available"}
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-4">
              {searchTerm
                ? "Try adjusting your search to find what you're looking for."
                : "There are no packages available at the moment. Check back later."}
            </p>
            {searchTerm && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Stats Footer */}
        {!packageLoading && filteredPackages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
              <div>
                Showing{" "}
                <span className="font-semibold">{filteredPackages.length}</span>{" "}
                package
                {filteredPackages.length !== 1 ? "s" : ""}
              </div>
              <div className="text-gray-500">
                Total packages in system:{" "}
                <span className="font-semibold">{packageData.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;
