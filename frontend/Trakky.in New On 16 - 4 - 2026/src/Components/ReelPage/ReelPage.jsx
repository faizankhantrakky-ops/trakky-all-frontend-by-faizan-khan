import React, { useState, useEffect, useRef, useContext } from "react";
import {
  X,
  ShoppingCart,
  ChevronUp,
  Share2,
  ChevronDown,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AuthContext from "../../context/Auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const productImages = [
    product.service_data?.service_image ||
      product.category_data?.category_image,
    product.service_data?.service_image ||
      product.category_data?.category_image,
    product.client_image,
    product.client_image,
  ].filter(Boolean);
  const params = useParams();
  const navigate = useNavigate();

  const handleBackButton = (e) => {
    e.preventDefault();
    // Navigate to city page instead of going back
    // navigate(`/${params?.city}/salons`);
    onClose();
  };

  const handleShare = async () => {
    const reelUrl = `${window.location.origin}/${params.city}/salons/reel/${product.id}`;

    try {
      if (navigator.share) {
        // Use the Web Share API if available (mobile devices)
        await navigator.share({
          title:
            product.service_data?.service_name ||
            product.category_data?.category_name,
          text: "Check out this salon service!",
          url: reelUrl,
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(reelUrl);
        toast.success("Link copied to clipboard!");
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = reelUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to share:", err);
      toast.error("Failed to share link");
    }
  };

  // Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleBookNow = (product) => {
    const salonName =
      product.service_data?.salon_name ||
      product.category_data?.salon_name ||
      "the salon";
    const area =
      product.service_data?.area || product.category_data?.area || "";
    const city = product.category_data?.city || "Ahmedabad";

    const link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      salonName
    )}%2C%20${encodeURIComponent(area)}%2C%20${encodeURIComponent(city)}%3F`;

    window.open(link, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50">
      <button
        onClick={handleBackButton}
        className="absolute top-4 right-4 z-10"
      >
        <X className="w-6 h-6" />
      </button>
      <button
        onClick={handleShare}
        className="absolute top-4 left-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {productImages.length > 0 && (
        <>
          <div className="w-full p-4">
            <img
              src={productImages[selectedImage]}
              alt={`${
                product.service_data?.service_name ||
                product.category_data?.category_name
              }`}
              className="w-full h-64 object-contain mx-auto"
            />

            {productImages.length > 1 && (
              <div className="overflow-x-auto py-4">
                <div className="flex gap-3">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      className={`shrink-0 cursor-pointer w-16 h-16 ${
                        selectedImage === index ? "border-2 border-black" : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="py-4 px-4">
            <h2 className="text-xl font-bold">
              {product.service_data?.service_name ||
                product.category_data?.category_name}
            </h2>
            {product.service_data?.price && (
              <div className="text-lg font-semibold mt-1">
                ₹ {product.service_data.price}
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600 mt-1 text-sm">
                {product.service_data?.description?.replace(/<[^>]*>/g, "") ||
                  product.description ||
                  "No description available"}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 border border-black py-3 rounded-md">
                More info
              </button>
              <button
                onClick={() => handleBookNow(product)}
                className="flex-1 bg-black text-white py-3 rounded-md flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Book now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ReelPlayer = ({ products, initialIndex, onClose, onShopNow }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showSwipeGuide, setShowSwipeGuide] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const totalVideos = products.length;
  const params = useParams();
  const navigate = useNavigate();
  // const [selectedImage, setSelectedImage] = useState(0);
  // const productImages = [
  //     product.service_data?.service_image || product.category_data?.category_image,
  //     product.service_data?.service_image || product.category_data?.category_image,
  //     product.client_image,
  //     product.client_image
  // ].filter(Boolean);

  const handleBookNow = (product) => {
    const salonName =
      product.service_data?.salon_name ||
      product.category_data?.salon_name ||
      "the salon";
    const area =
      product.service_data?.area || product.category_data?.area || "";
    const city = product.category_data?.city || "Ahmedabad";

    const link = `https://api.whatsapp.com/send?phone=916355167304&text=Can%20I%20know%20more%20about%20Offers%20%26%20salon%20services%20of%20${encodeURIComponent(
      salonName
    )}%2C%20${encodeURIComponent(area)}%2C%20${encodeURIComponent(city)}%3F`;

    window.open(link, "_blank");
  };

  const handleShare = async () => {
    const currentProduct = products[currentIndex];
    const reelUrl = `${window.location.origin}/${params.city}/salons/reel/${currentProduct.id}`;

    try {
      if (navigator.share) {
        // Use the Web Share API if available (mobile devices)
        await navigator.share({
          title:
            currentProduct.service_data?.service_name ||
            currentProduct.category_data?.category_name,
          text: "Check out this salon service!",
          url: reelUrl,
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(reelUrl);
        toast.success("Link copied to clipboard!");
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = reelUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to share:", err);
      toast.error("Failed to share link");
    }
  };
  // Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, totalVideos);
  }, [totalVideos]);

  useEffect(() => {
    videoRefs.current.forEach((videoRef, idx) => {
      if (videoRef) {
        videoRef.muted = isMuted;
        if (idx !== currentIndex) {
          videoRef.pause();
        }
      }
    });

    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].play().catch((error) => {
        console.error("Video play error:", error);
      });
    }
  }, [currentIndex, isMuted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeGuide(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // // Handle browser back button
  // useEffect(() => {
  //     // Push a new entry into the history stack
  //     window.history.pushState(null, '', window.location.pathname);

  const handleBackButton = (e) => {
    e.preventDefault();
    // Navigate to city page instead of going back
    navigate(`/${params?.city}/salons`);
  };

  //     window.addEventListener('popstate', handleBackButton);

  //     return () => {
  //         window.removeEventListener('popstate', handleBackButton);
  //     };
  // }, [navigate, params.city]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    setIsSwiping(false);
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      goToNext();
    } else if (isDownSwipe) {
      goToPrevious();
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalVideos);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalVideos) % totalVideos);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const currentProduct = products[currentIndex];
  const productImages = [
    currentProduct.service_data?.service_image ||
      currentProduct.category_data?.category_image,
    currentProduct.client_image,
  ].filter(Boolean);

  return (
    <div
      className="fixed inset-0 backdrop-brightness-50 z-50 flex lg:justify-center flex-col lg:flex-row lg:pl-64 lg:pr-56 lg:pt-10 lg:pb-10"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={handleBackButton}
        className="p-2 absolute top-4 right-4 z-30 text-white bg-black bg-opacity-50 rounded-full lg:mr-56"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        onClick={toggleMute}
        className={`p-2 absolute z-30 text-white bg-black bg-opacity-50 rounded-full ${
          isDesktop ? "top-20 right-[56%]" : "top-16 right-4"
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={handleShare}
        className={`p-2 absolute z-30 text-white bg-black bg-opacity-50 rounded-full ${
          isDesktop ? "top-32 right-[56%]" : "top-28 right-4"
        }`}
      >
        <Share2 className="w-6 h-6" />
      </button>

      {isDesktop && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 text-white bg-black bg-opacity-50 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 text-white bg-black bg-opacity-50 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {isDesktop ? (
        <>
          <div className="lg:w-[33%] lg:h-full relative overflow-hidden lg:rounded-l-lg">
            {products.map((product, index) => {
              let position;
              if (index === currentIndex) {
                position = "translate-x-0";
              } else if (
                index === (currentIndex + 1) % totalVideos ||
                (currentIndex === totalVideos - 1 && index === 0)
              ) {
                position = "translate-x-full";
              } else if (
                index === (currentIndex - 1 + totalVideos) % totalVideos ||
                (currentIndex === 0 && index === totalVideos - 1)
              ) {
                position = "-translate-x-full";
              } else {
                position = "translate-x-full";
              }

              return (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${position} ${
                    isSwiping ? "transition-none" : ""
                  }`}
                >
                  {product.video ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      playsInline
                      muted={isMuted}
                    >
                      <source src={product.video} type="video/mp4" />
                    </video>
                  ) : product.client_image ? (
                    <img
                      src={product.client_image}
                      alt={
                        product.service_data?.service_name ||
                        product.category_data?.category_name
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">
                      No media available
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:w-1/2 lg:h-full bg-white p-8 overflow-y-auto lg:rounded-r-lg">
            <div className="w-full p-4">
              {/* Main Image */}
              <img
                src={productImages[selectedImage]}
                alt={`Product view ${selectedImage + 1}`}
                className="w-full h-64 object-contain mx-auto"
              />

              {/* Thumbnail Swiper */}
              {productImages.length > 1 && (
                <div className="relative py-4">
                  <div
                    className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#888 transparent",
                      msOverflowStyle: "none" /* IE and Edge */,
                    }}
                  >
                    {productImages.map((img, index) => (
                      <div
                        key={index}
                        className={`shrink-0 cursor-pointer w-16 h-16 snap-start ${
                          selectedImage === index
                            ? "border-2 border-black"
                            : "border border-gray-200"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Custom scrollbar indicator */}
                  <div className="h-1 bg-gray-200 mt-2 rounded-full">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{
                        width: `${100 / productImages.length}%`,
                        transform: `translateX(${selectedImage * 100}%)`,
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 border border-black rounded-md flex items-center justify-center">
                {currentProduct.service_data?.service_image ||
                currentProduct.category_data?.category_image ? (
                  <img
                    src={
                      currentProduct.service_data?.service_image ||
                      currentProduct.category_data?.category_image
                    }
                    alt={
                      currentProduct.service_data?.service_name ||
                      currentProduct.category_data?.category_name
                    }
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <div className="text-black text-xs text-center">No image</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl">
                  {currentProduct.service_data?.service_name ||
                    currentProduct.category_data?.category_name}
                </h3>
                {currentProduct.service_data?.price && (
                  <p className="text-2xl">
                    ₹ {currentProduct.service_data.price}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">
                {currentProduct.service_data?.description?.replace(
                  /<[^>]*>/g,
                  ""
                ) ||
                  currentProduct.description ||
                  "No description available"}
              </p>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 border border-black py-3 rounded-md">
                More info
              </button>
              <button
                onClick={() => handleBookNow(currentProduct)}
                className="flex-1 bg-black text-white py-3 rounded-md flex items-center justify-center gap-2"
              >
                {/* <ShoppingCart className="w-5 h-5" /> */}
                Book Now
              </button>
            </div>
            {/* {productImages.length > 1 && (
                            <div className="mt-8">
                                <h3 className="font-semibold text-lg mb-3">Gallery</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedImage && productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
          </div>
        </>
      ) : (
        <>
          {/* Mobile Layout */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
            {products.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-6 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 relative overflow-hidden">
            {products.map((product, index) => {
              let position;
              if (index === currentIndex) {
                position = "translate-y-0";
              } else if (
                index === (currentIndex + 1) % totalVideos ||
                (currentIndex === totalVideos - 1 && index === 0)
              ) {
                position = "translate-y-full";
              } else if (
                index === (currentIndex - 1 + totalVideos) % totalVideos ||
                (currentIndex === 0 && index === totalVideos - 1)
              ) {
                position = "-translate-y-full";
              } else {
                position = "translate-y-full";
              }

              return (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${position} ${
                    isSwiping ? "transition-none" : ""
                  }`}
                >
                  {product.video ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      playsInline
                      muted={isMuted}
                    >
                      <source src={product.video} type="video/mp4" />
                    </video>
                  ) : product.client_image ? (
                    <img
                      src={product.client_image}
                      alt={
                        product.service_data?.service_name ||
                        product.category_data?.category_name
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">
                      No media available
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-all duration-300 ${
              showDetails ? "h-2/3" : "h-1/4"
            }`}
          >
            <div className="flex justify-center mb-2">
              <button
                onClick={toggleDetails}
                className="bg-black bg-opacity-50 rounded-full text-white flex items-center justify-center"
                style={{ width: "44px", height: "44px" }}
              >
                {showDetails ? (
                  <ChevronDown className="w-6 h-6" />
                ) : (
                  <ChevronUp className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center">
                  {currentProduct.service_data?.service_image ||
                  currentProduct.category_data?.category_image ? (
                    <img
                      src={
                        currentProduct.service_data?.service_image ||
                        currentProduct.category_data?.category_image
                      }
                      alt={
                        currentProduct.service_data?.service_name ||
                        currentProduct.category_data?.category_name
                      }
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="text-black text-xs text-center">
                      No image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {currentProduct.service_data?.service_name ||
                      currentProduct.category_data?.category_name}
                  </h3>
                  {currentProduct.service_data?.price && (
                    <p className="text-xl">
                      ₹ {currentProduct.service_data.price}
                    </p>
                  )}
                </div>
              </div>

              {showDetails && (
                <div className="mt-4">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-300 mt-1 text-sm">
                    {currentProduct.service_data?.description?.replace(
                      /<[^>]*>/g,
                      ""
                    ) ||
                      currentProduct.description ||
                      "No description available"}
                  </p>

                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 border border-white text-white py-3 rounded-md">
                      More info
                    </button>
                    <button
                      onClick={() => onShopNow(currentProduct)}
                      className="flex-1 bg-white text-black py-3 rounded-md flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      View Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!isDesktop && showSwipeGuide && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white z-20 pointer-events-none">
          <div className="text-center px-8 py-6 rounded-lg">
            <div className="text-2xl font-bold mb-2">Swipe to browse</div>
            <p className="text-lg opacity-80">
              Swipe up and down to navigate between videos
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ReelCarousel = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens, isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // If we have a reelId in params, open that reel directly
    if (params.reelId) {
      const foundIndex = products.findIndex(
        (p) => p.id.toString() === params.reelId
      );
      if (foundIndex !== -1) {
        setSelectedProduct(products[foundIndex]);
        setSelectedProductIndex(foundIndex);
        setShowProductModal(false);
      }
    }
  }, [params.reelId, products]);

  useEffect(() => {
    const handleBackButton = (e) => {
      if (params.reelId) {
        e.preventDefault();
        navigate(`/${params.city}/salons`);
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, params.city, params.reelId]);

  const handleVideoClick = (product, index) => {
    setSelectedProduct(product);
    setSelectedProductIndex(index);
    setShowProductModal(false);
    // Update URL when a reel is opened
    navigate(`/${params.city}/salons/reel/${product.id}`, { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/client-image-site/?is_city=true",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const filteredData = data.filter(
          (item) => item.is_city === true && (item.video || item.client_image)
        );
        setProducts(filteredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // const handleVideoClick = (product, index) => {
  //     setSelectedProduct(product);
  //     setSelectedProductIndex(index);
  //     setShowProductModal(false);
  // };

  const handleShopNow = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseFullScreen = () => {
    setSelectedProduct(null);
    setShowProductModal(false);
  };

  if (loading) {
    return <div className="w-full py-8 px-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="w-full py-8 px-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-8 px-4 text-center">No reels available</div>
    );
  }

  return (
    <div className="w-full py-8 px-4">
      <h1 className="text-xl font-semibold text-start lg:text-center lg:mb-6 mb-2">
        Grooming Stories
      </h1>

      <div className="flex justify-center">
        <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex flex-col items-center w-24 flex-shrink-0 cursor-pointer"
              onClick={() => handleVideoClick(product, index)}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-400 p-1">
                {product.video ? (
                  <video
                    className="w-full h-full object-cover rounded-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={product.video} type="video/mp4" />
                  </video>
                ) : product.client_image ? (
                  <img
                    src={product.client_image}
                    alt={
                      product.service_data?.service_name ||
                      product.category_data?.category_name
                    }
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs text-center p-1">
                    No media
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className="font-bold text-xs">
                  {product.service_data?.service_name ||
                    product.category_data?.category_name ||
                    "Untitled"}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && !showProductModal && (
        <ReelPlayer
          products={products}
          initialIndex={selectedProductIndex}
          onClose={handleCloseFullScreen}
          onShopNow={handleShopNow}
        />
      )}

      {selectedProduct && showProductModal && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseFullScreen}
        />
      )}
    </div>
  );
};

export default ReelCarousel;
