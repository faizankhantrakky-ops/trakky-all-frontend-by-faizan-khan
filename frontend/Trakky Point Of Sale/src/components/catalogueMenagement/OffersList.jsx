import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  RefreshCw,
  Clock,
  Calendar,
  FileText,
  X,
  Filter,
  Tag,
  Info,
  AlertCircle,
  Loader2,
  ChevronRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const OffersList = () => {
  const { vendorData } = useContext(AuthContext);

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [filters, setFilters] = useState({
    offerName: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchOffers = async () => {
                if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }
          
    setOfferLoading(true);

    if (!vendorData?.salon) return;

    let url = `https://backendapi.trakky.in/salons/salon-profile-offer/?salon_id=${vendorData?.salon}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOffers(data);
        setFilteredOffers(data);
      } else {
        toast.error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setOfferLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [vendorData]);

  useEffect(() => {
    let result = [...offers];

    if (filters.offerName) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(filters.offerName.toLowerCase())
      );
    }

    setFilteredOffers(result);
  }, [filters, offers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      offerName: "",
    });
    setShowFilters(false);
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    let str = "";

    if (time?.days && time?.days !== "0") {
      str += `${time.days}d `;
    }
    if (time?.seating && time?.seating !== "0") {
      str += `${time.seating}s `;
    }
    if (time?.hours && time?.hours !== "0") {
      str += `${time.hours}h `;
    }
    if (time?.minutes && time?.minutes !== "0") {
      str += `${time.minutes}m `;
    }

    return str.trim() || "N/A";
  };

  const calculateDiscountPercentage = (actualPrice, discountPrice) => {
    if (!actualPrice || !discountPrice) return 0;
    const actual = parseFloat(actualPrice);
    const discount = parseFloat(discountPrice);
    return Math.round(((actual - discount) / actual) * 100);
  };

  const getStats = () => {
    const total = offers.length;
    const activeOffers = offers.filter(
      (item) =>
        item.offer_time &&
        (item.offer_time.days > 0 ||
          item.offer_time.hours > 0 ||
          item.offer_time.minutes > 0)
    ).length;

    let totalSavings = 0;
    offers.forEach((item) => {
      if (item.actual_price && item.discount_price) {
        const actual = parseFloat(item.actual_price);
        const discount = parseFloat(item.discount_price);
        if (!isNaN(actual) && !isNaN(discount)) {
          totalSavings += actual - discount;
        }
      }
    });

    return { total, activeOffers, totalSavings };
  };

  const stats = getStats();

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

      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-4 border-l-4 border-[#492DBD] pl-3">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Our Offers</h1>
                <p className="text-xs text-gray-600">
                  Manage salon offers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border ${showFilters ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
              title="Filter Offers"
            >
              <Filter className={`w-4 h-4 ${showFilters ? "text-indigo-600" : "text-gray-600"}`} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <h3 className="text-sm font-medium text-gray-800">Filter Offers</h3>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded-md"
                    >
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
                        name="offerName"
                        value={filters.offerName}
                        onChange={handleFilterChange}
                        placeholder="Search offers..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* Active Filters */}
                  {filters.offerName && (
                    <div className="mt-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600">Active:</span>
                      <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs border border-indigo-200">
                        <span>{filters.offerName}</span>
                        <button
                          onClick={() => setFilters((prev) => ({ ...prev, offerName: "" }))}
                          className="ml-1 hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={fetchOffers}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              title="Refresh Offers"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Offers</p>
                <p className="text-base font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-1.5 rounded-md bg-indigo-50">
                <Tag className="w-3 h-3 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Offers</p>
                <p className="text-base font-bold text-green-600">{stats.activeOffers}</p>
              </div>
              <div className="p-1.5 rounded-md bg-green-50">
                <CheckCircle className="w-3 h-3 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Content */}
      <div className="p-4 md:p-6">
        {offerLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm text-gray-600 font-medium">Loading offers...</p>
          </div>
        ) : filteredOffers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((item, index) => {
              const discountPercentage = calculateDiscountPercentage(
                item.actual_price,
                item.discount_price
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden group"
                >
                  {/* Offer Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-orange-100">
                          <Sparkles className="w-3 h-3 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {item?.name || "No Name"}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {formatTime(item?.offer_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {discountPercentage > 0 && (
                        <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          {discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offer Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* Pricing Section */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div>
                          <p className="text-xs text-gray-600">
                            Original
                          </p>
                          <p className="text-sm font-medium text-gray-900 line-through">
                            ₹{item?.actual_price || "-"}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-600">
                            Discounted
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{item?.discount_price || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <h4 className="text-xs font-medium text-gray-800">
                            Terms & Conditions
                          </h4>
                        </div>
                        <div
                          className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md max-h-24 overflow-y-auto"
                          dangerouslySetInnerHTML={{
                            __html:
                              item?.terms_and_conditions ||
                              "No terms and conditions available.",
                          }}
                        />
                      </div>

                      {/* Offer Details */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Info className="w-3 h-3" />
                            <span>Offer #{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No Offers Found
            </h3>
            <p className="text-gray-600 text-center text-sm max-w-xs mb-4">
              {filters.offerName
                ? `No offers match "${filters.offerName}"`
                : "No offers available"}
            </p>
            <div className="flex gap-2">
              {filters.offerName ? (
                <>
                  <button
                    onClick={() => setShowFilters(true)}
                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-medium"
                  >
                    Adjust Search
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowFilters(true)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium"
                >
                  Search Offers
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersList;