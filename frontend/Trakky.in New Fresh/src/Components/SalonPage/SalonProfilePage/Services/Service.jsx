import React from "react";
import { useState, useEffect, useMemo } from "react";
import AuthContext from "../../../../context/Auth";
import "./service.css";
import OfferSalonModal from "../ModalComponent/OfferSalonModal";
import Modal from "@mui/material/Modal";

const Services = (props) => {
  // Context for user authentication
  const { user } = React.useContext(AuthContext);
  
  // State management for UI interactions and data
  const [visibleServices, setVisibleServices] = useState(null); // Controls how many services are visible initially
  const [isExpanded, setIsExpanded] = useState(false); // Tracks if "See all" is expanded
  const [msg, setMsg] = useState(""); // Unused message state (consider removing if not needed)
  const [quantities, setQuantities] = useState({}); // Tracks quantities for each service
  const [addedServices, setAddedServices] = useState([]); // Tracks added services (unused in current logic)
  const [isLoading, setIsLoading] = useState(true); // Loading state for skeleton
  
  // States for offer modal functionality
  const [offerModalOpen, setOfferModalOpen] = useState(false); // Controls offer modal visibility
  const [offerModalData, setOfferModalData] = useState(null); // Data passed to offer modal
  const [openModalType, setOpenModalType] = useState(""); // Type of modal (e.g., "service")

  // Log salon data on mount (for debugging)
  useEffect(() => {
    console.log(props.main_salon_data1);
  }, []);

  // Initialize loading, quantities, and visible services on serviceData change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading delay

    setVisibleServices(5); // Default visible services count
    const initialQuantities = {};
    props?.serviceData?.forEach((service) => {
      initialQuantities[service.id] = 1; // Set default quantity to 1 for each service
    });
    setQuantities(initialQuantities);

    return () => clearTimeout(timer); // Cleanup timer
  }, [props?.serviceData]);

  // Update visible services when expanded state or search query changes
  useEffect(() => {
    if (isExpanded) {
      setVisibleServices(filteredServices?.length); // Show all when expanded
    } else {
      setVisibleServices(5); // Show 5 by default
    }
  }, [isExpanded, props.searchQuery]);

  // Memoized filtered services based on search query - with robust type checking to prevent crashes
  const filteredServices = useMemo(() => {
    if (!props.searchQuery || !props.serviceData || props.serviceData.length === 0) {
      return props.serviceData || [];
    }
    
    const query = props.searchQuery.toLowerCase().trim();
    return (props.serviceData || []).filter(service => {
      if (!service) return false;
      
      // Search in service name (ensure string type)
      if (typeof service.service_name === 'string' && service.service_name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in description (ensure string type)
      if (typeof service.description === 'string' && service.description.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in categories (handle string, array, or object types)
      if (service.categories) {
        if (typeof service.categories === 'string' && service.categories.toLowerCase().includes(query)) {
          return true;
        }
        // If categories is an array, check each item
        if (Array.isArray(service.categories)) {
          const found = service.categories.some(cat => {
            if (typeof cat === 'string' && cat.toLowerCase().includes(query)) {
              return true;
            }
            // If cat is an object with a name property
            if (cat && typeof cat === 'object' && cat.name && typeof cat.name === 'string') {
              return cat.name.toLowerCase().includes(query);
            }
            return false;
          });
          if (found) return true;
        }
        // If categories is an object with name property
        if (typeof service.categories === 'object' && service.categories.name && typeof service.categories.name === 'string') {
          if (service.categories.name.toLowerCase().includes(query)) {
            return true;
          }
        }
      }
      
      // Search in master service name if exists (ensure string type)
      if (service.master_service_data?.master_service_details?.name && 
          typeof service.master_service_data.master_service_details.name === 'string' &&
          service.master_service_data.master_service_details.name.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    });
  }, [props.serviceData, props.searchQuery]);

  // Toggle expand/collapse and scroll to services section
  const toggleScroll = () => {
    if (isExpanded) {
      window.scrollTo({
        top: document.getElementById("salon-services").offsetTop,
      });
    }
    setIsExpanded(!isExpanded);
  };

  // Check if a service is already added to selection
  const isServiceAdded = (serviceId) => {
    return props.selectedServices?.some((service) => service.id === serviceId);
  };

  // Get current quantity of a selected service
  const getServiceQuantity = (serviceId) => {
    const service = props.selectedServices?.find((s) => s.id === serviceId);
    return service?.quantity || 1;
  };

  // Helper to extract length name (e.g., "Medium") from service lengths
  const getLengthInfo = (item) => {
    if (item?.lengths?.length > 0) {
      const firstLength = item.lengths[0];
      const lengthName = Object.keys(firstLength).find(key => key !== '[[Prototype]]');
      if (lengthName) {
        return lengthName; // e.g., "Medium"
      }
    }
    return null;
  };

  // Handle adding a service to booking
  const handleAddService = (item) => {
    if (props.onBookService) {
      props.onBookService(item, 1, "add", "services");
      // On small devices (mobile), scroll to the added service smoothly
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const element = document.getElementById(`service-${item.id}`);
          if (element)
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  };

  // Handle quantity changes (increment/decrement)
  const handleQuantityChange = (serviceId, change) => {
    const service = filteredServices.find((s) => s.id === serviceId);
    if (!service) return;

    const currentQuantity = getServiceQuantity(serviceId);
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      props.onBookService(service, 0, "remove", "services"); // Remove if quantity becomes 0
    } else {
      props.onBookService(service, newQuantity, "update", "services"); // Update quantity
    }

    // Haptic feedback on small devices
    if (window.innerWidth <= 768 && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  // Get location from auth context
  const { location } = React.useContext(AuthContext);

  // Open offer modal for a service
  const handleBookNowBtn = (item) => {
    // Pass the full original item to include lengths in modal
    setOfferModalData(item);
    setOpenModalType("service");
    setOfferModalOpen(true);
  };

  // Close offer modal
  const handleModalClose = () => {
    setOfferModalOpen(false);
    setOfferModalData(null);
    setOpenModalType("");
  };

  // Handle booking from offer modal
  const onBookOffer = (offerData) => {
    console.log("Booking offer from modal:", offerData);
    
    if (props.onBookService) {
      props.onBookService(offerData, 1, "add", "offer-modal");
    }
    
    handleModalClose();
  };

  // Log user interaction (e.g., for analytics)
  const log_adder = async (name) => {
    const requestBody = {
      category: "salon",
      name: name,
      location,
    };

    if (user != null) {
      requestBody.salon_user = user?.user_id || null;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/log-entry/",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to log entry");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error logging entry:", error.message);
    }
  };

  // Format service duration (e.g., "2 Days, 1 Hour")
  const formateTime = (time) => {
    let str = "";

    if (time?.days && time.days > 0) {
      str += time.days + " Days, ";
    }
    if (time?.seating && time.seating > 0) {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time.hours > 0) {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time.minutes > 0) {
      str += time.minutes + " Minutes, ";
    }

    if (str === "") return null; // Return null if no duration

    str = str.slice(0, -2); // Remove trailing comma and space
    return str;
  };

  // Reset expanded state when filtered services change
  useEffect(() => {
    setIsExpanded(false);
  }, [filteredServices]);

  // Calculate total selected services
  const totalSelected = props.selectedServices?.length || 0;

  // Skeleton loader component for services
  const ServiceSkeleton = () => {
    return (
      <div className="N-Service-main-container">
        {[...Array(5)].map((_, index) => (
          <div className="N-Main-Service-Item skeleton-item" key={index}>
            <div className="N-Service-Image-Div">
              <div className="N-Service-Image-container skeleton-image"></div>
              <div className="skeleton-button"></div>
            </div>
            <div className="N-Service-Content-Div">
              <div className="N-Service-Title-Div skeleton-text" style={{ width: "70%" }}></div>
              <div className="N-Service-Description-Div">
                <div className="skeleton-text" style={{ width: "90%" }}></div>
                <div className="skeleton-text" style={{ width: "80%" }}></div>
                <div className="skeleton-text" style={{ width: "60%" }}></div>
              </div>
              <div className="N-Service-price-book-Div">
                <div className="N-Service-pricing-Div">
                  <span className="skeleton-text" style={{ width: "50px" }}></span>
                  <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>●</span>
                  <span className="skeleton-text" style={{ width: "80px" }}></span>
                </div>
              </div>
              <div className="skeleton-text" style={{ width: "100px", marginTop: "10px" }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Determine if no results should be shown during search
  const shouldShowNoResults = props.searchQuery && filteredServices.length === 0;

  return (
    <div className="N-service-main-outer-container" id="salon-services">
      {/* Offer Modal */}
      <Modal 
        open={offerModalOpen} 
        onClose={handleModalClose}
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
      >
        <div>
          <OfferSalonModal
            open={offerModalOpen}
            data={offerModalData}
            handleClose={handleModalClose}
            salon={props.salon}
            type={openModalType}
            onBookNow={onBookOffer}
          />
        </div>
      </Modal>

      {/* Search Results Info - FIXED FOR SMALL DEVICES: Removed ml-10 and used responsive mx-4 for better mobile layout */}
      {props.searchQuery && props.searchQuery.trim() && (
        <div className="mb-4 px-4 py-2 mx-4 bg-gray-50 rounded-lg border border-gray-200 md:mx-10">
          <p className="text-sm text-gray-600">
            Found <span className="font-semibold text-purple-600">{filteredServices.length}</span> 
            service{filteredServices.length !== 1 ? 's' : ''} for 
            <span className="font-semibold text-gray-800"> "{props.searchQuery}"</span>
          </p>
          {filteredServices.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Try different keywords or check spelling
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <ServiceSkeleton />
      ) : shouldShowNoResults ? (
        <div className="N-service-no-data">
          <div className="flex flex-col justify-center items-center h-[200px]">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600 mb-2">No services found</p>
            <p className="text-gray-500 text-center">
              No results for "<span className="font-medium">{props.searchQuery}</span>"
            </p>
            <p className="text-sm text-gray-400 mt-2">Try different keywords</p>
          </div>
        </div>
      ) : filteredServices?.length > 0 ? (
        <div className={`w-[100%]`}>
          <div className="N-Service-main-container">
            {filteredServices
              ?.slice(0, visibleServices)
              .map((item, index) => {
                const isAdded = isServiceAdded(item.id);
                const quantity = getServiceQuantity(item.id);
                const lengthName = getLengthInfo(item); // "Medium" or null
                const hasLengths = lengthName !== null;
                const durationText = formateTime(item?.service_time);

                return (
                  <div
                    className="N-Main-Service-Item"
                    key={item.id || index}
                    id={`service-${item.id}`}
                    data-service-cateogry={item?.categories}
                  >
                    <div className="N-Service-Image-Div">
                      <div className="N-Service-Image-container">
                        {item?.service_image && (
                          <img src={item.service_image} alt="not found" />
                        )}
                      </div>
                      {!isAdded ? (
                        totalSelected > 0 ? (
                          <button
                            className="N-Service-call-now-btn-md bg-white text-black"
                            onClick={() => handleAddService(item)}
                          >
                            Add More
                          </button>
                        ) : (
                          <button
                            className="N-Service-call-now-btn-md bg-white text-black"
                            onClick={() => handleBookNowBtn(item)}
                          >
                            Book Now
                          </button>
                        )
                      ) : (
                        <div className="quantity-selector flex items-center bg-gradient-to-r from-[#AE86D0] to-[#512DC8] rounded-lg">
                          <button
                            className="quantity-btn minus text-white px-3 py-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(item.id, -1);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              handleQuantityChange(item.id, -1);
                            }}
                          >
                            -
                          </button>
                          <span className="text-white px-2">{quantity}</span>
                          <button
                            className="quantity-btn plus text-white px-3 py-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(item.id, 1);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              handleQuantityChange(item.id, 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="N-Service-Content-Div">
                      <div className="N-Service-Title-Div">
                        {item?.service_name}
                        {/* Highlight search term in service name */}
                        {props.searchQuery && item?.service_name && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded ml-2">
                            Match
                          </span>
                        )}
                      </div>
                      <div className="N-Service-Description-Div">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                        />
                      </div>
                      <div className="N-Service-price-book-Div">
                        <div className="N-Service-pricing-Div">
                          {/* Price / Choose Length Section */}
                          {hasLengths ? (
                            <span 
                              className="text-base font-medium text-[#512DC8] cursor-pointer"
                              onClick={() => handleBookNowBtn(item)}
                              style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              View Details
                            </span>
                          ) : (
                            <>
                              {item?.discount > 0 ? (
                                <>
                                  <span className="N-s-p-d-actual-p">
                                    ₹{item?.price}
                                  </span>
                                  <span className="pl-[6px] text-gray-500 flex">
                                    ₹
                                    <del>
                                      <span>{item?.discount}</span>
                                    </del>
                                  </span>
                                </>
                              ) : (
                                <span className="N-s-p-d-actual-p">
                                  ₹{item?.price}
                                </span>
                              )}
                            </>
                          )}

                          {/* Only show ● and duration if there is actual duration AND no lengths */}
                          {!hasLengths && durationText && (
                            <>
                              <span
                                style={{
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                }}
                              >
                                ●
                              </span>
                              <span style={{ color: "#646464" }}>
                                {durationText}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {item?.master_service_data?.master_service_details && (
                        <div
                          className="text-[#512dc8] font-medium text-sm cursor-pointer"
                          onClick={() => {
                            props?.handleServiceDetailsOpen(item.master_service);
                          }}
                        >
                          View details
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* View More/Less Button */}
          {(filteredServices.length > visibleServices || isExpanded) && (
            <div className="N-view-more-button-container">
              <button onClick={toggleScroll}>
                {isExpanded ? "View Less" : "See all Services"}
                {props.searchQuery && ` (${filteredServices.length} found)`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="N-service-no-data">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-[200px]">
              <div
                className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-4 text-[18px] font-medium text-gray-600">Loading...</p>
            </div>
          ) : (
            <h2 className="text-[20px] font-medium h-[100px] w-full flex justify-center items-center">
              We will add menu soon!
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;