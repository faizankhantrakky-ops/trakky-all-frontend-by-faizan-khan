import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import MiniHeader from "./MiniHeader";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PercentIcon from "@mui/icons-material/Percent";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import EventIcon from "@mui/icons-material/Event";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import DescriptionIcon from "@mui/icons-material/Description";
import SpaIcon from "@mui/icons-material/Spa";
import DiscountIcon from "@mui/icons-material/Discount";

const MassagesList = () => {
  const { vendorData } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);

  const fetchOffers = async () => {
    setOfferLoading(true);

    if (!vendorData?.spa) return;

    let url = `https://backendapi.trakky.in/spas/spa-profile-page-offer/?spa=${vendorData?.spa}`;

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
      } else {
        toast.error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setOfferLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchOffers();
  }, [vendorData]);

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
      
      {/* <MiniHeader title="Special Offers" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className=" mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                Current Offers & Promotions
              </h1>
            </div>
            <p className="text-gray-600">
              View and manage all your special offers and discounts
            </p>
            
            {/* Stats Summary */}
            {offers?.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <PercentIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Offers</p>
                      <p className="text-xl font-semibold text-gray-900">{offers.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <PriceCheckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Discounts</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {offers.filter(offer => offer.offer_percentage).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <LoyaltyIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Coupon Codes</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {offers.filter(offer => offer.coupon_code).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <EventIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Latest Offer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {offers[0]?.created_at ? formatDate(offers[0].created_at) : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Offers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Offers ({offers.length})
                </h3>
                <button
                  onClick={fetchOffers}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* Loading State */}
            {offerLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={50}
                />
                <p className="text-gray-600 font-medium">Loading offers...</p>
              </div>
            ) : offers?.length > 0 ? (
              /* Offers Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span>#</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <LocalOfferIcon className="h-4 w-4" />
                          Offer Details
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <PercentIcon className="h-4 w-4" />
                          Discount
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <SpaIcon className="h-4 w-4" />
                          Massage
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <PriceCheckIcon className="h-4 w-4" />
                          Pricing
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <DescriptionIcon className="h-4 w-4" />
                          Terms
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <EventIcon className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <LoyaltyIcon className="h-4 w-4" />
                          Coupon Code
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {offers?.map((item, index) => {
                      const savings = item?.massage_price && item?.discount_price 
                        ? item.massage_price - item.discount_price 
                        : 0;
                      
                      return (
                        <tr 
                          key={item?.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Index */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-center">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-medium">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Offer Details */}
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item?.offer_name || "Unnamed Offer"}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {item?.offer_type || "General Offer"}
                              </p>
                              {item?.how_to_avial && (
                                <p className="text-xs text-gray-600 mt-2">
                                  <span className="font-medium">How to avail:</span> {item.how_to_avial}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Discount */}
                          <td className="px-6 py-4">
                            {item?.offer_percentage ? (
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                  <span className="text-red-700 font-bold">
                                    {item.offer_percentage}%
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-sm font-medium text-gray-900">
                                    {item.offer_percentage}% OFF
                                  </span>
                                  <span className="text-xs text-gray-500">Discount</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>

                          {/* Massage Details */}
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {item?.massage_details?.service_names || "-"}
                              </p>
                              {item?.massage_details?.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {item.massage_details.description.replace(/<[^>]*>/g, '')}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Pricing */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Original:</span>
                                <span className="font-medium text-gray-700">
                                  ₹{item?.massage_price || "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">Discounted:</span>
                                <span className="font-bold text-green-600">
                                  ₹{item?.discount_price || "-"}
                                </span>
                              </div>
                              {savings > 0 && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <DiscountIcon className="h-3 w-3 mr-1" />
                                    Save ₹{savings}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Terms and Conditions */}
                          <td className="px-6 py-4 max-w-xs">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item?.term_and_condition || "No terms specified",
                              }}
                              className="dangerous-html text-sm text-gray-600 line-clamp-3"
                            />
                          </td>

                          {/* Created Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <EventIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {formatDate(item?.created_at)}
                              </span>
                            </div>
                          </td>

                          {/* Coupon Code */}
                          <td className="px-6 py-4">
                            {item?.coupon_code ? (
                              <div className="inline-block">
                                <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                                  <div className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">
                                    Coupon Code
                                  </div>
                                  <div className="font-mono font-bold text-purple-700 text-center">
                                    {item.coupon_code}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                  Copy and use at checkout
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <LocalOfferIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Offers Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  There are no special offers or promotions configured yet. Create your first offer to attract more customers.
                </p>
                <button
                  onClick={fetchOffers}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Refresh Offers
                </button>
              </div>
            )}

            {/* Table Footer */}
            {offers?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Showing {offers.length} offers</span>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span>Total Savings: ₹
                      {offers.reduce((total, offer) => {
                        const savings = offer?.massage_price && offer?.discount_price 
                          ? offer.massage_price - offer.discount_price 
                          : 0;
                        return total + savings;
                      }, 0)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassagesList;