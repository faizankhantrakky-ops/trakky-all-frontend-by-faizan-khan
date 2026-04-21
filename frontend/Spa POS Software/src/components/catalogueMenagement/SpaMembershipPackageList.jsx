import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import MiniHeader from "./MiniHeader";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DiscountIcon from "@mui/icons-material/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Link } from "react-router-dom";

const SpaMembershipPackageList = () => {
  const { vendorData } = useContext(AuthContext);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageData, setPackageData] = useState([]);

  const fetchPackages = async () => {
    setPackageLoading(true);

    if (!vendorData?.spa) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/member-ship/?spa=${vendorData?.spa}`,
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
      } else {
        toast.error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setPackageLoading(false);
    }
  };

  const formatTime = (time) => {
    let str = "";

    if (time?.days && time?.days !== "0") {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating !== "0") {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours !== "0") {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes !== "0") {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);
    return str || "Not specified";
  };

  const calculateDiscountPercentage = (actual, discount) => {
    if (!actual || !discount || actual <= 0) return 0;
    return Math.round(((actual - discount) / actual) * 100);
  };

  useEffect(() => {
    fetchPackages();
  }, [vendorData?.spa]);

  return (
    <div className="w-full h-full bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* <MiniHeader title="Membership Packages" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                Premium Membership Packages
              </h1>
            </div>
            <p className="text-gray-600">
              Browse and manage all your spa membership packages
            </p>
          </div>

          {/* Loading State */}
          {packageLoading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
              <CircularProgress
                sx={{
                  color: "#4F46E5",
                  marginBottom: "16px",
                }}
                size={50}
              />
              <p className="text-gray-600 font-medium">Loading packages...</p>
            </div>
          ) : packageData?.length > 0 ? (
            /* Packages List */
            <div className="space-y-6">
              {packageData?.map((packageItem, index) => {
                const discountPercentage = calculateDiscountPercentage(
                  packageItem?.actual_price,
                  packageItem?.discount_price
                );

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Package Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-700 font-bold text-xl">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl font-semibold text-gray-900">
                                {packageItem?.package_name || "Unnamed Package"}
                              </h2>
                              {discountPercentage > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  <DiscountIcon className="h-3 w-3 mr-1" />
                                  {discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Includes {packageItem?.service_included?.length || 0} services
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div>
                              {discountPercentage > 0 && (
                                <div className="flex items-center justify-end text-sm text-gray-500 mb-1">
                                  <CurrencyRupeeIcon className="h-3.5 w-3.5" />
                                  <del className="ml-0.5">{packageItem?.actual_price}</del>
                                </div>
                              )}
                              <div className="flex items-center">
                                <CurrencyRupeeIcon className="h-5 w-5 text-gray-900" />
                                <span className="text-2xl font-bold text-gray-900 ml-1">
                                  {packageItem?.discount_price || packageItem?.actual_price}
                                </span>
                                <span className="text-gray-600 ml-2">/package</span>
                              </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                            <div className="text-left">
                              {discountPercentage > 0 && (
                                <div className="text-sm font-medium text-green-600">
                                  Save ₹{packageItem?.actual_price - packageItem?.discount_price}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services List */}
                    <div className="p-1">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Included Services
                        </h3>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {packageItem?.service_included?.map((item, index1) => (
                          <div
                            key={index1}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              {/* Service Name */}
                              <div className="md:col-span-5 flex items-center gap-3">
                                <CheckCircleOutlineIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {item?.service_names || "Unnamed Service"}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <AccessTimeIcon className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {formatTime(item?.service_time)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Description Placeholder */}
                              <div className="md:col-span-5">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  Premium spa service included in your membership package
                                </p>
                              </div>

                              {/* Price */}
                              <div className="md:col-span-2 flex items-center justify-end">
                                <div className="text-right">
                                  <div className="flex items-center justify-end">
                                    <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                                    <span className="font-semibold text-gray-900 ml-1">
                                      {item?.price || "-"}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Individual price</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Package Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <LocalOfferIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Total Value: ₹
                            {packageItem?.service_included?.reduce(
                              (sum, service) => sum + (parseInt(service?.price) || 0),
                              0
                            )}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-indigo-600">
                          You save ₹
                          {packageItem?.service_included?.reduce(
                              (sum, service) => sum + (parseInt(service?.price) || 0),
                              0
                            ) - packageItem?.discount_price}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-16 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <LocalOfferIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Packages Available
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                There are no membership packages configured yet. Create your first package to get started.
              </p>
            <Link to={'/catalogue/membership-packages-request'}>
            
              <button
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Add New Packages
              </button>
            </Link>
            </div>
          )}

          {/* Summary Footer */}
          {packageData?.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-gray-50 rounded-xl border border-indigo-100">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Package Summary
                  </h3>
                  <p className="text-gray-600">
                    Showing {packageData.length} membership packages
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-700">
                      {packageData.reduce(
                        (total, pkg) => total + (pkg?.service_included?.length || 0),
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Total Services</div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₹
                      {packageData.reduce(
                        (total, pkg) => total + (pkg?.actual_price - pkg?.discount_price || 0),
                        0
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Total Savings</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaMembershipPackageList;