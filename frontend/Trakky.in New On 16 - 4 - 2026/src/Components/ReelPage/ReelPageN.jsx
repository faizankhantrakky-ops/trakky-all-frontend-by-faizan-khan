import React, { useState, useRef, useEffect, useContext } from "react";
import { X, ShoppingCart, Volume2, VolumeX, Share2 } from "lucide-react";
import AuthContext from "../../context/Auth";
import { useNavigate, useParams } from "react-router-dom";
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
    <div className="fixed inset-0 bg-white z-[999] flex flex-col">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-white bg-black bg-opacity-50 p-2 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {productImages.length > 0 && (
          <>
            <div className="w-full">
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
    </div>
  );
};

const FullScreenReel = ({ product, onClose, onShopNow }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Disable background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleShare = () => {
    if (!product) return;

    const domain = window.location.hostname;
    const city = product.category_data?.city?.toLowerCase() || "ahmedabad";
    const reelId = product.id;

    const shareUrl = `http://${domain}/${city}/trakkyreel/${reelId}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col">
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={handleShare}
          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full"
        >
          <Share2 size={20} />
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 p-2 bg-black/50 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {product.video ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
            No media available
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0">
            {product.service_data?.service_image ||
            product.category_data?.category_image ? (
              <img
                src={
                  product.service_data?.service_image ||
                  product.category_data?.category_image
                }
                alt=""
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="text-black text-xs">No image</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white text-base font-medium mb-1">
              {product.service_data?.service_name ||
                product.category_data?.category_name}
            </h3>
            {product.service_data?.price && (
              <p className="text-white text-lg font-bold">
                ₹ {product.service_data.price}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onShopNow}
          className="w-full bg-white text-black py-2.5 rounded font-medium flex items-center justify-center"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

const ReelCarousel = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFullscreenReel, setShowFullscreenReel] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authTokens, isAuthenticated, logoutUser } = useContext(AuthContext);
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

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

  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (!carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleReelClick = (product) => {
    setSelectedProduct(product);
    setShowFullscreenReel(true);
  };

  const handleShopNowClick = () => {
    setShowFullscreenReel(false);
    setShowProductModal(true);
  };

  const handleCloseFullscreenReel = () => {
    setShowFullscreenReel(false);
    setSelectedProduct(null);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchend", stopDragging);
    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchend", stopDragging);
    };
  }, []);

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
    <div className="px-4 py-6">
      <h1 className="text-center text-xl font-bold mb-6">
        TRUSTED BY ENTHUSIASTS
      </h1>

      <div
        ref={carouselRef}
        className="overflow-x-auto hide-scrollbar relative flex lg:justify-center"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={stopDragging}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="flex space-x-3 pb-4 min-w-max">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="relative w-44 shrink-0 cursor-pointer"
              onClick={() => handleReelClick(product)}
            >
              <div className="relative aspect-[9/16] rounded-lg overflow-hidden">
                {product.video ? (
                  <video
                    className="w-full h-full object-cover"
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
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-center p-1">
                    No media
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
                      {product.service_data?.service_image ||
                      product.category_data?.category_image ? (
                        <img
                          src={
                            product.service_data?.service_image ||
                            product.category_data?.category_image
                          }
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="text-black text-xs">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-xs font-medium mb-1 line-clamp-1">
                        {product.service_data?.service_name ||
                          product.category_data?.category_name ||
                          "Untitled"}
                      </h3>
                      {product.service_data?.price && (
                        <p className="text-white text-sm font-bold">
                          ₹ {product.service_data.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showFullscreenReel && selectedProduct && (
        <FullScreenReel
          product={selectedProduct}
          onClose={handleCloseFullscreenReel}
          onShopNow={handleShopNowClick}
        />
      )}

      {showProductModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseProductModal}
        />
      )}
    </div>
  );
};

export default ReelCarousel;
