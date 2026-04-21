import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Packages_svg from "./../../../../Assets/images/icons/Packages_svg.svg";
import PackagesModal from "../ModalComponent/PackagesModal";
import Modal from "@mui/material/Modal";

const GrommingPackages = ({ salon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openPackagesModal, setOpenPackagesModal] = useState(false);

  const handlePackagesModalOpen = () => {
    setOpenPackagesModal(true);
  };
  const handlePackagesModalClose = () => {
    setOpenPackagesModal(false);
  };

  const getPackagesData = async (salonId) => {
    let url = `https://backendapi.trakky.in/salons/packages/?salon_id=${salonId}`;

    try {
      let response = await fetch(url);
      let data = await response.json();
      setPackagesData(data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (salon) {
      getPackagesData(salon?.id);
    }
  }, [salon]);

  const handleBookNowBtn = (packageData) => {
    if (!salon?.name) {
      return;
    }

    let serviceList = Object.keys(packageData?.service_included_names)
      .map((key, index) => {
        return packageData?.service_included_names[key];
      })
      .join(", ");

    let message = `Can you provide more details about the services Package named '${packageData?.package_name}' at ${salon?.name} in ${salon?.area}, ${salon?.city}? It comes with a discounted price of ${packageData?.discount_price} rupees and included ${packageData?.service_included?.length} service (${serviceList}).`;

    let link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;

    window.open(link, "_blank");
  };

  const togglePackagesVisibility = () => {
    setIsExpanded(!isExpanded);
  };

  const formateTime = (time) => {
    let str = "";

    if (time?.days) {
      str += time.days + " Days, ";
    }
    if (time?.seating) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes) {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  // Handle swipe gestures
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      // Swiped right
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (info.offset.x < -100) {
      // Swiped left
      setActiveIndex((prev) => Math.min(prev + 1, packagesData.length - 1));
    }
  };

  // Calculate visible packages based on expanded state
  const visiblePackages = isExpanded ? packagesData.length : 3;

  return (
    <>
      {packagesData?.length > 0 && (
        <>
          <hr className="m-5" />
          <div className="text-2xl font-bold mb-6 text-[#512dc8] text-center">
            <span>Grooming Packages</span>
          </div>

          {/* Stacked Cards Container */}
          <div className="relative h-64 md:h-80 w-[250px] max-w-2xl mx-auto mb-8">
            {packagesData.slice(0, visiblePackages).map((item, index) => {
              const position = index - activeIndex;
              const isActive = position === 0;
              const isBehind = position > 0;

              return (
                <motion.div
                  key={item.id || index}
                  className="absolute w-full h-full rounded-xl shadow-lg overflow-hidden"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  initial={{
                    scale: 1 - Math.abs(position) * 0.05,
                    opacity: 1 - Math.abs(position) * 0.3,
                    x: position * 30,
                    y: Math.abs(position) * 10,
                    zIndex: 10 - Math.abs(position),
                  }}
                  animate={{
                    scale: 1 - Math.abs(position) * 0.05,
                    opacity: 1 - Math.abs(position) * 0.3,
                    x: position * 30,
                    y: Math.abs(position) * 10,
                    zIndex: 10 - Math.abs(position),
                    backgroundColor: isActive ? "#F0E8FF" : "#FFFFFF",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  whileTap={{ cursor: "grabbing" }}
                  style={{
                    cursor: isActive ? "grab" : "auto",
                  }}
                >
                  <div className="p-3 h-full flex flex-col">
                    {/* <div className="flex items-center text-sm font-semibold text-indigo-600 mb-4">
                      <img src={Packages_svg} alt="" className="mr-2 h-5 w-5" />
                      PACKAGE
                    </div> */}

                    <div className="flex flex-col items-center text-gray-600">
                      <h2 className="text-xl font-bold text-gray-800">
                        {item?.package_name}
                      </h2>
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{parseInt(item?.discount_price)}
                        </span>
                        <span className="ml-2 text-gray-500 text-sm flex items-center">
                          ₹<del>{parseInt(item?.actual_price)}</del>
                        </span>
                      </div>
                      {/* <span className="mx-2 text-gray-400">●</span> */}
                      <span className="text-sm">
                        {formateTime(item?.package_time)}
                      </span>
                    </div>

                    <div className="mb-2 ml-7 flex flex-grow items-center">
                      <ul className="list-disc list-inside text-xs font-medium text-[#333333] space-y-1">
                        {Object.keys(item?.service_included_names).map(
                          (key, index) => {
                            return (
                              <li key={key}>
                                {item?.service_included_names[key]}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <div
                        className="text-black bg-white font-medium text-sm cursor-pointer px-2 py-2 rounded-lg "
                        onClick={() => {
                          setSelectedPackageData(item);
                          handlePackagesModalOpen();
                        }}
                      >
                        Show Details
                      </div>
                      <button
                        onClick={() => handleBookNowBtn(item)}
                        className="bg-[#D4BCFF] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Navigation Dots */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2">
              {packagesData.slice(0, visiblePackages).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to package ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {packagesData?.length > 3 && (
            <div className="text-center mt-12">
              <button
                className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                onClick={togglePackagesVisibility}
              >
                {isExpanded ? "See less packages" : "See all packages"}
              </button>
            </div>
          )}
        </>
      )}

      <Modal open={openPackagesModal} onClose={handlePackagesModalClose}>
        <div>
          <PackagesModal
            data={selectedPackageData}
            handleClose={handlePackagesModalClose}
          />
        </div>
      </Modal>
    </>
  );
};

export default GrommingPackages;
