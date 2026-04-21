import React, { useContext, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";
import MiniHeader from "./MiniHeader";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const MassagesList = () => {
  const { vendorData } = useContext(AuthContext);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [page, setPage] = useState(1);

  const fetchMassages = async () => {
    setServiceLoading(true);
    if (!vendorData?.spa) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/service/?page=${page}&spa_id=${vendorData?.spa}`
      );
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setTempAllServices(data?.results);
        } else {
          setTempAllServices([...tempAllServices, ...data?.results]);
        }

        if (data?.next) {
          setPage(page + 1);
        }
      } else {
        toast.error(`Something went wrong: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setServiceLoading(false);
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

  useEffect(() => {
    if (tempAllServices?.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchMassages();
  }, [vendorData?.spa, page]);

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
      
      {/* <MiniHeader title="Our Massages" /> */}
      
      <div className="w-full h-[calc(100%-68px)] p-4 md:p-6 overflow-auto">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl md:text-xl font-semibold text-gray-800">
              Massage Services
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all your massage services
            </p>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Service Name</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Price</div>
            </div>

            {/* Loading State */}
            {serviceLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <CircularProgress
                  sx={{
                    color: "#4F46E5",
                    marginBottom: "16px",
                  }}
                  size={40}
                />
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : allServices?.length > 0 ? (
              /* Services List */
              <div className="divide-y divide-gray-100">
                {allServices?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Index */}
                    <div className="col-span-1 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>

                    {/* Service Name */}
                    <div className="col-span-3 flex items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {item?.service_names || "No massage name"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {item?.id || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center text-gray-700">
                        <AccessTimeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">
                          {formatTime(item?.service_time)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-span-4">
                      <div className="flex items-start">
                        <InfoOutlinedIcon className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div
                          dangerouslySetInnerHTML={{ __html: item?.description }}
                          className="dangerous-html text-sm text-gray-600 line-clamp-2"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center">
                      <div className="text-right">
                        {item?.discount ? (
                          <>
                            <div className="flex items-center justify-end">
                              <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                              <span className="text-lg font-semibold text-gray-900 ml-1">
                                {item.discount}
                              </span>
                            </div>
                            <div className="flex items-center justify-end mt-1">
                              <CurrencyRupeeIcon className="h-3 w-3 text-gray-400" />
                              <del className="text-sm text-gray-500 ml-1">
                                {item?.price}
                              </del>
                              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                Save ₹{item?.price - item?.discount}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-end">
                            <CurrencyRupeeIcon className="h-4 w-4 text-gray-700" />
                            <span className="text-lg font-semibold text-gray-900 ml-1">
                              {item?.price || "-"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Massages Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no massage services available at the moment.
                </p>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {allServices?.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <p>Showing {allServices.length} massage services</p>
              <button
                onClick={fetchMassages}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MassagesList;