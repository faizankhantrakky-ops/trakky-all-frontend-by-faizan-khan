import React, { useRef, useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  OutlinedInput,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { CloudUpload, SpeakerNotesOffRounded } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/pagination";
import "./SpaFrom.css";
import Score_svg from "../../../assets/Scrore.svg";
import Share_svg from "../../../assets/Share_Svg.svg";
import Info_svg from "../../../assets/info_i_svg.svg";
import Grids from "../../../assets/Grids.svg";
import Info from "../../../assets/Info.svg";
import leftArrow from "../../../assets/LeftArrow.svg";
import { FcLike, FcShare } from "react-icons/fc";
import { MdFavoriteBorder } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../../Context/Auth";
import Modal from "@mui/material/Modal";
import ReviewImg from "../../../assets/rating_svg.svg";

const SpaForm = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  console.log(vendorData);
  const main_imageInputRef = useRef(null);
  const swiper_imageInputRef = useRef(null);
  const Daily_main_imageInputRef = useRef(null);
  const [loding, setLoding] = useState();

  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [previewImage, setPreviewImage] = useState([]);
  const [activeIndexSwiper, setActiveIndexSwiper] = useState(null);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300, // Adjust width for a cleaner look
      },
    },
  };

  const handleHeroImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      // To preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        // setPreviewImage(reader.result); // Store the preview URL in state
        // setPreviewImage([...previewImage, reader.result]); // Store the preview URL in state
        // store at the first index
        setPreviewImage([reader.result, ...previewImage]);
        setActiveIndexSwiper(0); // Set the active index to the first image
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleHeroSubmit = async () => {
    setLoding(true);
    const fromDataMain = new FormData();

    fromDataMain.append("name", name);
    fromDataMain.append("area", area);
    fromDataMain.append("city", city);
    // fromDataMain.append("main_image", heroImage);
    if (heroImage) {
      fromDataMain.append("main_image", heroImage);
    }
    fromDataMain.append("price", price);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/vendor-spa-update/${vendorData.spa}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: fromDataMain,
        }
      );

      if (!response.ok) {
        throw new Error("Error updating the spa");
      }

      const data = await response.json();

      // Update the state with the API response data for live preview
      setName(data.name || name);
      setArea(data.area || area);
      setCity(data.city || city);

      toast.success("Hero Section Added Successfully");
      setHeroImage(null);
      main_imageInputRef.current.value = "";
      getHeroData("");
    } catch (error) {
      toast.error("Error Adding Hero Section");
    } finally {
      setLoding(false);
    }
  };

  const getHeroData = async () => {
    setLoding(true);
    if (!vendorData || !vendorData.spa) {
      console.error("Spa ID is missing");
      toast.error("Spa ID is missing");
      setLoding(false);
      return; // Early return if spa ID is not available
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/vendor-spa-update/${vendorData.spa}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setArea(data.area);
        setCity(data.city);
        setPrice(data.price);
        let images = [];
        if (data?.main_image) {
          images.push(data.main_image);
        }
        if (data?.mul_images) {
          let imgUrl = data?.mul_images?.map((img) => img?.image);

          images = [...images, ...imgUrl];
        }
        setPreviewImage(images);
        console.log("Data:", images);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching spa data:", error);
      toast.error("Error fetching spa details");
    } finally {
      setLoding(false);
    }
  };

  useEffect(() => {
    if (vendorData && vendorData.spa) {
      getHeroData();
    }
  }, [vendorData]); // Dependency on vendorData

  const dailyUpdates = [
    {
      main_image: "https://via.placeholder.com/150", // Default image URL
      name: "Default Spa Name",
      mobile_number: "1234567890", // Default mobile number
    },
  ];
  const defaultDailyUpdates = [
    {
      daily_update_img: "https://via.placeholder.com/150", // Default update image URL
      daily_update_description: "Default daily update description.",
      created_at: "Just now", // Default creation time
    },
    {
      daily_update_img: "https://via.placeholder.com/150", // Default update image URL
      daily_update_description: "Another default update description.",
      created_at: "2 minutes ago", // Default creation time
    },
  ];
  const [viewMore, setViewMore] = useState();
  const [isMoreData, setIsMoreData] = useState();
  const [page, setPage] = useState();
  const [spaData, setSpaData] = useState();

  const handlemain_imageClick = () => {
    main_imageInputRef.current.click();
  };

  const Daily_handlemain_imageClick = () => {
    Daily_main_imageInputRef.current.click();
  };

  // Daliy Update From Request
  const [spaName, setSpaName] = useState("");
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleDailyUpdateRequest = async () => {
    setLoding(true);
    const formData = new FormData();
    formData.append("daily_update_description", caption);
    if (imageFile) {
      formData.append("daily_update_img", imageFile);
    }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/daily-updates-pos/",
        {
          method: "POST",
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access_token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSpaName(""); // Clear spa name
        setCaption(""); // Clear caption
        setImageFile(null); // Clear image file
        Daily_main_imageInputRef.current.value = "";
      } else {
        toast.error("Error:", response.statusText);
      }
    } catch (error) {
      toast.error("Fetch error:", error);
    } finally {
      setLoding(false);
    }
  };


  return (
    <div className="flex flex-col gap-10 w-full profile-preview-scroll">
      <Toaster />
      {/* Spa details */}
      <div className="flex flex-col gap-10 lg:flex-row">
        <div
          className="p-4 bg-white border border-gray-300 rounded-xl shadow-md w-full lg:w-2/3"
          style={{ minHeight: "500px" }}
        >
          <h3 className="text-lg font-semibold mb-4">Spa detail's</h3>
          <div className="mb-4">
            <TextField
              label="Spa Name"
              value={name}
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)} // Handle area input change
                fullWidth
              />
              {/* City TextField */}
              <TextField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)} // Handle city input change
                fullWidth
              />
            </div>
          </div>

          <div className="grid gap-4 mb-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center cursor-pointer hover:border-purple-500 transition duration-200"
              onClick={handlemain_imageClick}
              style={{ minHeight: "150px" }}
            >
              <IconButton
                component="label"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="file"
                  hidden
                  ref={main_imageInputRef}
                  onChange={handleHeroImage}
                />
                <CloudUpload style={{ fontSize: 40, color: "#888" }} />
              </IconButton>
              <span className="ml-3 text-gray-500">Main Image</span>
            </div>
          </div>

        
          <div className="mb-4">
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
          </div>
          <div className="grid ">
            <button
              className="bg-black text-white rounded-sm p-2"
              onClick={HandleHeroSubmit}
            >
              {loding ? "Savings..." : "Save"}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[400px] py-4 px-2 h-fit bg-white border border-gray-300 rounded-xl shadow-md shrink-0">
          <div className=" relative w-full aspect-video overflow-hidden shadow-[0_2px_3px] shadow-gray-300  h-auto">
            {previewImage?.length > 0 && (
              <Swiper
                ref={swiper_imageInputRef}
                slidesPerView={1}
                navigation
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                // modules={[Pagination , Navigation]}
                className=" NProfileSwiper"
                onSlideChange={(swiper) => {
                  setActiveIndexSwiper(swiper.realIndex);
                }}

              >
                {previewImage?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt="spa image"
                      className=" h-full w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <div className="N-spa-p-main-info-icon">
              <img src={Info_svg} alt="information" />
            </div>
            <div className="N-spa-p-more-photo-btn">
              <button>
                <img src={Grids} alt="grid" />
                more photos
              </button>
            </div>
            <div className=" h-[6px] flex items-center justify-center gap-1 w-full px-3 flex-nowrap absolute bottom-1 z-20">
              {Array.from({ length: previewImage?.length }, (_, index) => (
                <div
                  className={`bg-[#ffffff30] h-[3px] w-full grow rounded-md transition-all relative`}
                >
                  <div
                    className={` absolute top-0 left-0 grow h-[3px] rounded-md bg-white ${
                      activeIndexSwiper > index ? "w-full" : "w-0"
                    }`}
                  ></div>
                  {
                    <div
                      className={`absolute top-0 left-0 h-[3px] rounded-md bg-white  ${
                        activeIndexSwiper === index
                          ? "progress-bar-animation"
                          : ""
                      }`}
                    ></div>
                  }
                </div>
              ))}
            </div>
          </div>
          <div className=" px-4 py-2 flex flex-col gap-1 items-start justify-center">
            <div className=" flex items-center justify-between w-full">
              <span className=" text-[13px] text-gray-700 font-normal">
                {/* {timing} */}
                Opens 12:59 PM - 12:59 AM
              </span>
              <div className=" flex gap-2 h-7 justify-center items-center">
                <button className="  h-7 w-7 flex justify-center items-center">
                  <img
                    src={Share_svg}
                    className=" h-6 object-cover"
                    alt="share"
                  />
                </button>
                <button className=" h-7 w-7 flex justify-center items-center">
                  <MdFavoriteBorder className=" h-7 w-7 text-[#62656a] -mt-[2px]" />
                </button>
              </div>
            </div>
            <div className=" w-full">
              <h1 className=" text-[20px] leading-6 text-gray-800 font-semibold">
                {/* {spaData?.name} */}
                {name}
              </h1>
            </div>
            <div className=" w-full">
              <span className=" text-[15px] text-gray-700 font-light">
                {/* {spaData?.area}, {spaData?.city} */}
                {area}, {city}
              </span>
            </div>
            <div className=" w-full">
              <span className=" text-[14px] text-gray-700 font-light">
                {/* ₹ {spaData?.price} Onwards */}₹ {price} Onwards
              </span>
            </div>
            <div className="w-full flex gap-1 text-slate-600 text-sm pt-2">
              <img src={ReviewImg} alt="review" />
              <span>4</span>
              <span>(91 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Updates */}
      <div className="flex flex-col gap-10 lg:flex-row">
        <div
          className="p-4 bg-white border border-gray-300 rounded-xl shadow-md w-full lg:w-2/3"
          style={{ minHeight: "400px" }}
        >
          <h3 className="text-lg font-semibold mb-4">Daily updates</h3>
          <div className="grid gap-4 mb-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center cursor-pointer hover:border-purple-500 transition duration-200"
              onClick={Daily_handlemain_imageClick}
              style={{ minHeight: "150px" }}
            >
              <IconButton
                component="label"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="file"
                  hidden
                  ref={Daily_main_imageInputRef}
                  onChange={handleImageChange}
                />
                <CloudUpload style={{ fontSize: 40, color: "#888" }} />
              </IconButton>
              <span className="ml-3 text-gray-500">Image</span>
            </div>
          </div>
          <div className="mb-4">
            <TextField
              label="Caption"
              fullWidth
              multiline
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="grid mb-4">
            <button
              className="bg-black text-white rounded-sm p-2"
              onClick={handleDailyUpdateRequest}
            >
              {loding ? "Savings..." : "Save"}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[400px] ">
          <div className="bg-white border border-gray-300 rounded-2xl shadow-md h-fit pb-[20px]">
            <div className="N-daily-update-container">
              {dailyUpdates?.length > 0 && (
                <div className="N-daily_update_main">
                  <div className="N-daily_update_spa_details">
                    <img src={spaData?.main_image} alt="" />
                    <div className="N-d-u-spa-name">
                      <h2>{spaData?.name}</h2>
                      <p>
                        <span>Daily updates</span>
                        <div
                          className="N-daily-update-item-see-more"
                          style={{ cursor: "pointer" }}
                        >
                          {/* see more <img src={leftArrow} alt="" />{" "} */}
                        </div>
                      </p>
                    </div>
                  </div>
                  <Swiper
                    slidesPerView={"auto"}
                    className="N-daily_update_container-ss"
                  >
                    <SwiperSlide className="N-daily_update_card" key={999}>
                      <div className="N-daily_update_card_img">
                        <img
                          src={
                            imageFile
                              ? URL.createObjectURL(imageFile)
                              : "https://via.placeholder.com/150"
                          }
                          alt=""
                        />
                      </div>
                      <div className="N-daily_update_card_content">
                        <p style={{ wordWrap: "break-word" }}>
                          {caption.length > 80
                            ? caption.slice(0, 80) + "..."
                            : caption}
                        </p>
                      </div>
                      <p className="N-time-ago-daily-update">{"Just now"}</p>
                      <a href={`#`}>Book Now</a>
                    </SwiperSlide>
                    {defaultDailyUpdates?.map((post, index) => (
                      <SwiperSlide className="N-daily_update_card" key={index}>
                        <div className="N-daily_update_card_img">
                          <img src={post?.daily_update_img} alt="" />
                        </div>
                        <div className="N-daily_update_card_content">
                          <p>
                            {post?.daily_update_description.length > 80
                              ? post?.daily_update_description.slice(0, 80) +
                                "..."
                              : post?.daily_update_description}
                          </p>
                        </div>
                        <p className="N-time-ago-daily-update">
                          {post?.created_at}
                        </p>
                        <a href={`#`}>Book Now</a>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaForm;
