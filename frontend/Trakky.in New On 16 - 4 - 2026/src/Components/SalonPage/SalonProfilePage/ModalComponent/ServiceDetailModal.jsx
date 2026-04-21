import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  padding: "0px",
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          padding: "0px",
          fontSize: "0.9rem",
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: "0px",
  borderBottom: "1px solid rgba(0, 0, 0, .125)",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles("dark", {
    backgroundColor: "rgba(255, 255, 255, .05)",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "8px 2px",
}));

const ServiceDetailsModal = ({
  main_salon_data,
  handleServiceDetailsClose,
  serviceId,
  salon,
  main_salon_data1,
}) => {
  const [serviceDetails, setServiceDetails] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'reviews'
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    name: "",
    email: "",
  });
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const modalRef = useRef(null);
  const progressRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Handle click outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleServiceDetailsClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleServiceDetailsClose]);

  const getServiceDetails = async (servId) => {
    if (!servId) {
      return;
    }
    let url = `https://backendapi.trakky.in/salons/service-details/?master_service_id=${servId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch service details");
      }
      const data = await response.json();
      console.log(data[0]);
      setServiceDetails(data[0]);
      // Fetch reviews for this service
      fetchReviews(servId);
    } catch (error) {
      console.error("Error fetching service details:", error.message);
    }
  };

  const fetchReviews = async (serviceId) => {
    try {
      // This is a mock API call - replace with your actual API endpoint
      const mockReviews = [
        {
          id: 1,
          name: "Aarav Sharma",
          rating: 5,
          comment: "Excellent service! The staff was very professional and the results were amazing. Highly recommended for anyone looking for quality service.",
          date: "15 Jan 2024",
          verified: true
        },
        {
          id: 2,
          name: "Priya Patel",
          rating: 4,
          comment: "Good experience overall. The service was good and the staff was courteous. Would recommend to friends.",
          date: "10 Jan 2024",
          verified: true
        },
        {
          id: 3,
          name: "Rohan Singh",
          rating: 5,
          comment: "Best salon experience ever! The attention to detail was impressive. Will definitely come back for more services.",
          date: "05 Jan 2024",
          verified: false
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    getServiceDetails(serviceId);
  }, [serviceId]);

  const handleBookNowBtn = (item) => {
    const message = `I want to book the ${item?.service_name} available at ${salon?.name} in ${salon?.area}, ${salon?.city}.
    
Please book it for me.`;
    const link = `https://api.whatsapp.com/send?phone=916355167304&text=${encodeURIComponent(
      message
    )}`;
    window.open(link, "_blank");
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.rating) {
      alert("Please select a rating");
      return;
    }
    
    if (!reviewData.comment.trim()) {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call - replace with your actual API endpoint
      setTimeout(() => {
        const newReview = {
          id: reviews.length + 1,
          name: reviewData.name || "Anonymous",
          rating: reviewData.rating,
          comment: reviewData.comment,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          verified: false
        };
        
        setReviews([newReview, ...reviews]);
        setSubmitSuccess(true);
        setIsSubmitting(false);
        
        // Reset form
        setReviewData({
          rating: 0,
          comment: "",
          name: "",
          email: "",
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-[#502DA6]">
        {index < rating ? (
          <StarIcon style={{ fontSize: "1rem" }} />
        ) : (
          <StarBorderIcon style={{ fontSize: "1rem" }} />
        )}
      </span>
    ));
  };

  const renderRatingStars = (rating, setRating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={() => setRating(index + 1)}
      >
        {index < rating ? (
          <StarIcon style={{ fontSize: "1.8rem", color: "#FFC91F" }} />
        ) : (
          <StarBorderIcon style={{ fontSize: "1.8rem", color: "#E5E7EB" }} />
        )}
      </span>
    ));
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
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

  const startProgress = useCallback(() => {
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      progressRef.current.style.transition = 'none';
      requestAnimationFrame(() => {
        progressRef.current.style.transition = 'width 4000ms linear';
        progressRef.current.style.width = '100%';
      });
    }
  }, []);

  const renderDetailsContent = () => (
    <div ref={contentRef} className="relative">
      {(serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "PRIME"
      ) ||
        serviceDetails?.salons_with_service?.some(
          (salon) => salon.salon_type === "LUXURIOUS"
        )) &&
        serviceDetails?.swiper_images?.length > 0 && (
          <>
            <div className="h-[1px] w-full bg-gray-100 mt-2"></div>
            <Swiper
              slidesPerView={1}
              spaceBetween={1}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation
              on={{
                init: startProgress,
                slideChange: startProgress,
              }}
            >
              {serviceDetails?.swiper_images?.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={item?.image}
                    alt="service"
                    className="w-full h-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-full h-[1px] bg-black overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-white w-0"
                style={{ transition: "width 4000ms linear" }}
              />
            </div>
          </>
        )}
      {serviceDetails?.description_image && (
        <>
          <div className="h-[1px] w-full bg-gray-100 mt-2"></div>
          <div className="w-full">
            <img
              src={serviceDetails?.description_image}
              alt="description"
              className="w-full h-auto"
            />
          </div>
        </>
      )}
      {serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "LUXURIOUS"
      ) &&
        serviceDetails?.benefit_meta_info_image && (
          <>
            <div className="h-[8px] w-full bg-gray-100"></div>
            <div className="w-full">
              <img
                src={serviceDetails?.benefit_meta_info_image}
                alt="benefit-meta-info"
                className="w-full h-auto"
              />
            </div>
          </>
        )}
      {(serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "PRIME"
      ) ||
        serviceDetails?.salons_with_service?.some(
          (salon) => salon.salon_type === "LUXURIOUS"
        )) &&
        serviceDetails?.key_ingredients && (
          <>
            <div className="h-[8px] w-full bg-gray-100"></div>
            <div className="w-full">
              <img
                src={serviceDetails?.key_ingredients}
                alt="key-ingredients"
                className="w-full h-auto"
              />
            </div>
          </>
        )}
      {(serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "PRIME"
      ) ||
        serviceDetails?.salons_with_service?.some(
          (salon) => salon.salon_type === "LUXURIOUS"
        )) &&
        serviceDetails?.things_salon_use && (
          <>
            <div className="h-[8px] w-full bg-gray-100"></div>
            <div className="w-full">
              <img
                src={serviceDetails?.things_salon_use}
                alt="things-salon-use"
                className="w-full h-auto"
              />
            </div>
          </>
        )}
      <div className="h-[8px] w-full bg-gray-100"></div>
      <div className="">
        <div className="w-full">
          {serviceDetails?.overview_details?.map((item, index) => (
            <div key={index} className="aspect-square w-full">
              <img
                src={item?.image}
                alt="overview"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "LUXURIOUS"
      ) &&
        serviceDetails?.lux_exprience_image && (
          <>
            <div className="h-[8px] w-full bg-gray-100"></div>
            <div className="w-full">
              <img
                src={serviceDetails?.lux_exprience_image}
                alt="lux-exprience"
                className="w-full h-auto"
              />
            </div>
          </>
        )}
      {serviceDetails?.steps && (
        <>
          <div className="h-[8px] w-full bg-white my-3"></div>
          <div className="flex flex-col gap-2 px-5 mb-3 bg-white">
            <h2 className="font-semibold text-lg my-2">How it works</h2>
            <div className="w-full pl-4 flex flex-col gap-7 border-l-2 border-gray-200 ">
              {serviceDetails?.step_details?.map((step, index) => (
                <div className="flex flex-col gap-2 relative" key={index}>
                  <p className="text-[15px] font-medium">{step?.step_name}</p>
                  <p className="text-[15px] text-gray-700">
                    {step?.instruction}
                  </p>
                  <div className="w-full aspect-auto">
                    <img
                      src={step?.image}
                      alt="step"
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                  <div className="h-6 w-6 bg-gray-200 top-0 absolute -left-[30px] rounded-full border border-white leading-5 text-xs flex justify-center items-center text-gray-800">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[8px] w-full bg-gray-100"></div>
        </>
      )}
      {/* Aftercare Tips Section */}
      {serviceDetails?.salons_with_service?.some(
        (salon) => salon.salon_type === "LUXURIOUS"
      ) &&
        serviceDetails?.aftercare_tips && (
          <>
            <div className="h-[8px] w-full bg-gray-100"></div>
            <div className="w-full">
              <img
                src={serviceDetails?.aftercare_tips}
                alt="aftercare-tips"
                className="w-full h-auto"
              />
            </div>
          </>
        )}
      {(serviceDetails?.do_and_dont?.do?.length > 0 ||
        serviceDetails?.do_and_dont?.["don't"]?.length > 0) && (
        <>
          <div className="h-[8px] w-full bg-gray-100 my-3"></div>
          <div className="flex flex-col gap-2 px-5">
            <h2 className="font-semibold text-lg my-2">Do's and dont's</h2>
            <div className="w-full SD-do-desc">
              <ul>
                {serviceDetails?.do_and_dont?.do?.map((ite, index) => (
                  <li key={index}>{ite}</li>
                ))}
              </ul>
            </div>
            <div className="w-full SD-dont-desc">
              <ul>
                {serviceDetails?.do_and_dont?.["don't"]?.map((ite, index) => (
                  <li key={index}>{ite}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {serviceDetails?.faqs?.length > 0 && (
        <>
          <div className="h-[8px] w-full bg-gray-100 my-3"></div>
          <div className="flex flex-col gap-2 px-5">
            <h2 className="font-semibold text-lg my-2">
              Frequently asked questions
            </h2>
            <div className="w-full ">
              {serviceDetails?.faqs?.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography
                      sx={{
                        fontWeight: "500",
                        color: "black",
                      }}
                    >
                      {faq?.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq?.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderReviewsContent = () => (
    <div className="px-4 sm:px-5 py-4 pt-0 bg-white">
      {/* Review Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="text-center mb-4 sm:mb-0">
            <div className="text-3xl font-bold text-gray-800">
              {calculateAverageRating()}
            </div>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(calculateAverageRating()))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {reviews.length} reviews
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-base font-semibold text-gray-800 line-clamp-1">
              {serviceDetails?.master_service_info?.service_name}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              at {salon?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Write Your Review</h3>
        
        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200 text-sm">
            ✓ Thank you for your review! It has been submitted successfully.
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center space-x-1">
            {renderRatingStars(reviewData.rating, (rating) =>
              setReviewData({ ...reviewData, rating })
            )}
            <span className="ml-2 text-sm text-gray-600">
              {reviewData.rating > 0 ? `${reviewData.rating}/5` : "Select rating"}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#502DA6] focus:border-[#502DA6] resize-none text-sm"
            rows="3"
            placeholder="Share your experience with this service..."
            value={reviewData.comment}
            onChange={(e) =>
              setReviewData({ ...reviewData, comment: e.target.value })
            }
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#502DA6] focus:border-[#502DA6] text-sm"
              placeholder="Enter your name"
              value={reviewData.name}
              onChange={(e) =>
                setReviewData({ ...reviewData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#502DA6] focus:border-[#502DA6] text-sm"
              placeholder="Enter your email"
              value={reviewData.email}
              onChange={(e) =>
                setReviewData({ ...reviewData, email: e.target.value })
              }
            />
          </div>
        </div>
        
        <button
          onClick={handleReviewSubmit}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#502DA6] hover:bg-[#41258C] text-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <SendIcon className="mr-2" style={{ fontSize: "1rem" }} />
              Submit Review
            </>
          )}
        </button>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-base font-semibold mb-4 text-gray-800">
          Customer Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-3xl mb-2">✍️</div>
            <p className="text-gray-600 text-sm">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <PersonIcon style={{ fontSize: "1rem", color: "#6B7280" }} />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium text-gray-800 text-sm">{review.name}</h4>
                          {review.verified && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded border border-green-200">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white w-full mt-[10vh] sm:w-[min(500px,90%)] m-auto h-auto pb-4 rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-auto sm:mt-5 relative"
        style={
          isDesktop
            ? {
                position: "fixed",
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)",
              }
            : {}
        }
      >
        {/* Mobile close button (centered at top) */}
        {!isDesktop && (
          <div
            className="!w-8 !h-8 !bg-white fixed flex items-center justify-center -translate-x-1/2 cursor-pointer top-4 left-1/2 z-[10000] rounded-full shadow-md border border-gray-200"
            onClick={handleServiceDetailsClose}
          >
            <CloseIcon
              sx={{
                fontSize: "1rem",
              }}
            />
          </div>
        )}
        
        {/* Header with Service Name and Actions - FIXED POSITION */}
        <div 
          ref={headerRef}
          className="flex justify-between items-center px-4 sm:px-5 bg-white pt-4 pb-3 border-b border-gray-200 shadow-sm "
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}
        >
          <div className="h-full flex font-semibold items-center justify-start line-clamp-1 text-sm sm:text-base pr-2">
            {serviceDetails?.master_service_info?.service_name}
          </div>
          
          {/* Desktop close button and action buttons */}
          {isDesktop && (
            <div className="flex items-center gap-3">
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors min-w-[70px] ${
                    activeTab === "details"
                      ? "bg-white text-[#502DA6] shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                {/* <button
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors min-w-[70px] ${
                    activeTab === "reviews"
                      ? "bg-white text-[#502DA6] shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button> */}
              </div>
              
              <button
                className="bg-[#502DA6] hover:bg-[#41258C] text-white py-2 px-4 text-sm rounded-lg font-medium transition-colors"
                onClick={() => {
                  handleBookNowBtn(serviceDetails?.master_service_info);
                }}
              >
                Book Now
              </button>
              <div
                className="!w-8 !h-8 flex items-center justify-center cursor-pointer rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                onClick={handleServiceDetailsClose}
              >
                <CloseIcon
                  sx={{
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Mobile Action Buttons */}
          {!isDesktop && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex bg-gray-100 p-0.5 rounded">
                <button
                  className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] ${
                    activeTab === "details"
                      ? "bg-white text-[#502DA6] shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                {/* <button
                  className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] ${
                    activeTab === "reviews"
                      ? "bg-white text-[#502DA6] shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button> */}
              </div>
              <button
                className="bg-[#502DA6] text-white py-1.5 px-3 text-xs rounded-lg font-medium whitespace-nowrap"
                onClick={() => {
                  handleBookNowBtn(serviceDetails?.master_service_info);
                }}
              >
                Book Now
              </button>
            </div>
          )}
        </div>

        {/* Tab Content Container */}
        <div className="relative z-0">
          {activeTab === "details" ? renderDetailsContent() : renderReviewsContent()}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;