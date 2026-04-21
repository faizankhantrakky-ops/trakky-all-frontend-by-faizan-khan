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
  import "swiper/css/pagination";
  import "./SalonFrom.css";
  import Score_svg from "../../../assets/Scrore.svg";
  import Share_svg from "../../../assets/Share_Svg.svg";
  import Grids from "../../../assets/Grids.svg";
  import Info from "../../../assets/Info.svg";
  import leftArrow from "../../../assets/LeftArrow.svg";
  import { FcLike, FcShare } from "react-icons/fc";
  import { MdFavoriteBorder } from "react-icons/md";
  import toast, { Toaster } from "react-hot-toast";
  import AuthContext from "../../../Context/Auth";
  import Modal from "@mui/material/Modal";
  import dayjs from "dayjs";
  import { useSnackbar } from "notistack";

  const SalonForm = () => {
    const { authTokens, vendorData } = useContext(AuthContext);
    console.log(vendorData);
    const main_imageInputRef = useRef(null);
    const customer_main_imageInputRef = useRef(null);
    const Daily_main_imageInputRef = useRef(null);
    const [loding, setLoding] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [area, setArea] = useState("");
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [offer, setOffer] = useState("");
    const [price, setPrice] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

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
          setPreviewImage(reader.result); // Store the preview URL in state
        };
        reader.readAsDataURL(file);
      }
    };

    const getRemainingTime = (createdAt) => {
      const now = dayjs();
      const createdAtDate = dayjs(createdAt);
      const hoursDiff = now.diff(createdAtDate, "hour");
      const remainingHours = 48 - hoursDiff;

      if (remainingHours <= 0) return "0 hours";
      return `${remainingHours} hours`;
    };

      let branchId = localStorage.getItem("branchId") || "";

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
      fromDataMain.append("offer_tag", offer);
      fromDataMain.append("price", price);
      // fromDataMain.append("branchId", branchId);

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/vendor-salon-update/${vendorData.salon}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authTokens.access_token}`,
            },
            body: fromDataMain,
          }
        );

        if (!response.ok) {
          throw new Error("Error updating the salon");
        }

        const data = await response.json();

        // Update the state with the API response data for live preview
        setName(data.name || name);
        setArea(data.area || area);
        setCity(data.city || city);
        setOffer(data.offer_tag || offer);
        setOffer(data.price || price);

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

        if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }

      setLoding(true);
      if (!vendorData || !vendorData.salon) {
        console.error("Salon ID is missing");
        toast.error("Salon ID is missing");
        setLoding(false);
        return; // Early return if salon ID is not available
      }

      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/vendor-salon-update/${vendorData.salon}/`,
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
          setOffer(data.offer_tag);
          setPrice(data.price);
          setPreviewImage(data.main_image); // Update the preview image state
          setSalonData(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching salon data:", error);
        toast.error("Error fetching salon details");
      } finally {
        setLoding(false);
      }
    };

    // UseEffect to fetch data when vendorData.salon is defined
    useEffect(() => {
      if (vendorData && vendorData.salon) {
        getHeroData();
      }
    }, [vendorData]); // Dependency on vendorData

    const [categories, setCategories] = useState("");

    const [categoryOptions, setCategoryOptions] = useState([
      { id: 1, name: "Default Category 1" },
      { id: 2, name: "Default Category 2" },
    ]);

    const filteredData = [
      {
        client_image: "https://via.placeholder.com/150", // Default image URL
        service: "Default Service 1",
      },
      {
        client_image: "https://via.placeholder.com/150", // Default image URL
        service: "Default Service 2",
      },
      {
        client_image: "https://via.placeholder.com/150", // Default image URL
        service: "Default Service 3",
      },
    ];
    const [activeCategory, setActiveCategory] = useState("");
    const [TempSelectedCategory, setTempSelectedCategory] = useState("");
    const salon = [
      {
        img: "https://content.jdmagicbox.com/comp/ahmedabad/u5/079pxx79.xx79.211007185044.k3u5/catalogue/hd-unisex-salon-bodakdev-ahmedabad-salons-wi3cav4w33.jpg",
      },
    ];
    const dailyUpdates = [
      {
        main_image: "https://via.placeholder.com/150", // Default image URL
        name: "Default Salon Name",
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
    const [salonData, setSalonData] = useState();

    const handlemain_imageClick = () => {
      main_imageInputRef.current.click();
    };
    const customer_handlemain_imageClick = () => {
      customer_main_imageInputRef.current.click();
    };
    const Daily_handlemain_imageClick = () => {
      Daily_main_imageInputRef.current.click();
    };

    // Customer Experience
    const [defaultCategories, setDefaultCategories] = useState();

    const [customerName, setCustomerName] = useState("");
    const [customercategory, setCustomerCategory] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [customermainImage, setCustomerMainImage] = useState(null);
    const [description, setDescription] = useState("");

    const handleCustomerImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setCustomerMainImage(file);
      }
    };

    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };

    const handleCategoryChange = (event) => {
      setCategories(event.target.value);

      if (event.target.value === "") {
        setCategoryOptions([
          { id: 1, name: "Default Category 1" },
          { id: 2, name: "Default Category 2" },
        ]);
        return;
      }

      let filterData = defaultCategories.filter(
        (cat) => cat.id === event.target.value
      );

      setCategoryOptions([
        { id: 1, name: filterData[0]?.name },
        { id: 2, name: "Default Category 2" },
      ]);
    };

    const handleServiceNameChange = (event) => {
      setServiceName(event.target.value);

      const filteredData = defaultCategories.filter(
        (cat) => cat.id === categories
      );
      setTempSelectedCategory(filteredData[0]?.name);
    };

    useEffect(() => {
      if (!navigator.onLine) {
            toast.error("No Internet Connection");
            return;
          }
          
      // Fetch available categories for the given salon ID
      const fetchSalons = async () => {
        try {
          if (vendorData && vendorData.salon) {
            const response = await fetch(
              `https://backendapi.trakky.in/salons/category/?salon=${vendorData.salon}`,
              {
                method: "GET",
              }
            );

            if (response.ok) {
              const data = await response.json();
              setDefaultCategories(data);
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            console.error("Salon ID is missing");
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchSalons();
    }, [vendorData]);

    const handleCustomerExperienceChange = async () => {
      setLoding(true);
      const FromDataSend = new FormData();

      if (vendorData && vendorData.salon) {
        FromDataSend.append("salon", vendorData.salon);
      } else {
        console.error("vendorData is missing or doesn't contain salon_id");
      }

      if (categories) {
        FromDataSend.append("category", categories);
      } else {
        console.error("Category is missing or invalid");
        return;
      }

      FromDataSend.append("service", serviceName);
      FromDataSend.append("description", description);

      if (customermainImage) {
        FromDataSend.append("client_image", customermainImage);
      }

      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/clientwork-pos-request/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access_token}`,
            },
            body: FromDataSend,
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Show notification
          enqueueSnackbar("Experience request submitted for admin approval", {
            variant: "success",
            persist: true,
          });

          // Reset form
          setCategories("");
          setServiceName("");
          setDescription("");
          setCustomerMainImage(null);
          customer_main_imageInputRef.current.value = "";
        } else {
          throw new Error("Error submitting request");
        }
      } catch (error) {
        enqueueSnackbar("Failed to submit experience request", {
          variant: "error",
          persist: true,
        });
      } finally {
        setLoding(false);
      }
    };

    // Daliy Update From Request
    const [salonName, setSalonName] = useState("");
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
      formData.append("salon", vendorData.salon); // Add salon ID

      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/daily-update-request/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authTokens.access_token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          enqueueSnackbar("Daily update submitted for admin approval", {
            variant: "success",
            persist: true,
          });

          // Reset form
          setCaption("");
          setImageFile(null);
          Daily_main_imageInputRef.current.value = "";
        } else {
          throw new Error("Error submitting daily update");
        }
      } catch (error) {
        enqueueSnackbar("Failed to submit daily update", {
          variant: "error",
          persist: true,
        });
      } finally {
        setLoding(false);
      }
    };

    return (
      <div className="flex flex-col gap-10 w-full profile-preview-scroll">
        <Toaster />
        {/* Salon details */}
        <div className="flex flex-col gap-10 lg:flex-row">
          <div
            className="p-4 bg-white border border-gray-300 rounded-xl shadow-md w-full lg:w-2/3"
            style={{ minHeight: "500px" }}
          >
            <h3 className="text-lg font-semibold mb-5">Salon details</h3>
            <div className="mb-5">
              <TextField
                label="Salon Name"
                value={name}
                fullWidth
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only alphabets + spaces
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    setName(value);
                  }
                }}
                placeholder="Enter salon name"
              />

            </div>
            <div className="grid gap-4 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Area"
                  value={area}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) {
                      setArea(value);
                    }
                  }}
                  fullWidth
                  placeholder="Enter area"
                />

                <TextField
                  label="City"
                  value={city}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) {
                      setCity(value);
                    }
                  }}
                  fullWidth
                  placeholder="Enter city"
                />

              </div>
            </div>

            <div className="grid gap-4 mb-5">
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

            <div className="mb-5">
              <TextField
                label="Profile Offer Text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                fullWidth
              />
            </div>
            <div className="mb-5">
              <TextField
                label="Price"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only numbers
                  if (/^[0-9]*$/.test(value)) {
                    setPrice(value);
                  }
                }}
                fullWidth
                placeholder="Enter price"
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

          <div className="w-full lg:w-[430px]">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-5 h-fit pb-[20px] mx-auto">
              <div className="salon-profile-hero-section">
                <div className="salon-profile-main-images">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                  >
                    <SwiperSlide>
                      <img src={previewImage || salon[0].img} alt="Salon Image" />
                    </SwiperSlide>

                    {salon?.mul_images &&
                      salon?.mul_images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img src={image?.img} alt="" />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                  <div className="salon-p-main-score-tag">
                    <img src={Score_svg} alt="" />
                    <span>Score 10</span>
                  </div>
                  <div className="salon-p-main-info-icon">
                    <img src={Info} alt="" />
                  </div>
                  <div className="salon-p-more-photo-btn">
                    <button>
                      <img src={Grids} alt="" />
                      More Photos
                    </button>
                  </div>
                </div>
                <div className="salon-p-main-content">
                  <div className="salon-p-main-content-inner">
                    <div className="s-p-hero-opening">
                      <span>{"Opens 10 AM - 5 AM"}</span>
                      <div className="s-p-h-share-like-btn">
                        <button>
                          <img src={Share_svg} alt="" />
                        </button>
                      </div>
                    </div>
                    <h1 className="salon-p-hero-name">{name || "Salon Name"}</h1>
                    <div className="salon-p-hero-addr">
                      <div>
                        {area || "Area"}, {city || "City"}
                      </div>
                    </div>
                    <div className="salon-p-hero-price-tag">
                      <div>
                        <span>₹ {price || "0"} Onwards</span>
                      </div>
                    </div>
                    <div className="salon-p-hero-call-book-btn">
                      <a href="" className="salon-p-hero-call-btn">
                        Call now
                      </a>
                      <button className="salon-p-hero-book-btn">Book now</button>
                    </div>
                    <div className="salon-p-hero-special-tag">
                      {<span>Premium</span>}
                      {<span>Bridal</span>}
                      {<span>Make up</span>}
                    </div>
                    <div className="salon-p-hero-offer-tag">
                      <span></span>
                      <span>{offer || "Best Offer Available"}</span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Experience */}
        <div className="flex flex-col gap-10 lg:flex-row">
          <div
            className="p-4 bg-white border border-gray-300 rounded-xl shadow-md w-full lg:w-2/3"
            style={{ minHeight: "500px" }}
          >
            <h3 className="text-lg font-semibold mb-5">Customer's experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <FormControl>
                <Select
                  value={categories}
                  onChange={handleCategoryChange}
                  displayEmpty
                  fullWidth
                  MenuProps={MenuProps}
                >
                  {" "}
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {defaultCategories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Service Name"
                value={serviceName}
                fullWidth
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only letters + spaces
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    handleServiceNameChange(e);
                  }
                }}
                placeholder="Enter service name"
              />

            </div>

            <div className="grid gap-4 mb-5">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center items-center cursor-pointer hover:border-purple-500 transition duration-200"
                onClick={customer_handlemain_imageClick}
                style={{ minHeight: "150px" }}
              >
                <IconButton
                  component="label"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="file"
                    hidden
                    ref={customer_main_imageInputRef}
                    onChange={handleCustomerImageChange}
                  />
                  <CloudUpload style={{ fontSize: 40, color: "#888" }} />
                </IconButton>
                <span className="ml-3 text-gray-500">Image</span>
              </div>
            </div>
            <div className="mb-5">
              <TextField
                label="Caption"
                fullWidth
                multiline
                rows={4}
                onChange={handleDescriptionChange}
                value={description}
              />
            </div>
            <div className="grid mb-5">
              <button
                className="bg-black text-white rounded-sm p-2"
                onClick={handleCustomerExperienceChange}
              >
                {loding ? "Savings..." : "Save"}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[430px]">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-5 pl-0 h-fit pb-[20px] mx-auto">
              <div className="N-Profile-page-main-heading">
                <span>Customer's experience </span>
              </div>
              <div className="N-sp-room-main-container">
                <div className="N-sp-room-category-container">
                  {categoryOptions?.length > 1 ? (
                    categoryOptions.map((item, index) => {
                      return (
                        <span
                          key={item?.id}
                          className={
                            item?.id === categories || "Default Category 1"
                          }
                        >
                          {item.name}
                        </span>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
                <div className="N-sp-room-item-container">
                  <div className="N-sp-room-item-div" onClick={() => { }}>
                    <div className="N-sp-room-img">
                      <img
                        src={
                          customermainImage
                            ? URL.createObjectURL(customermainImage)
                            : "https://via.placeholder.com/150"
                        }
                        alt="service-img"
                      />
                    </div>
                    <div className="N-sp-room-item-details">
                      {serviceName || "Service Name"}
                    </div>
                  </div>
                  {filteredData?.length ? (
                    filteredData.map((work, index) => {
                      return (
                        <div className="N-sp-room-item-div" onClick={() => { }}>
                          <div className="N-sp-room-img">
                            {" "}
                            {work?.client_image && (
                              <img src={work?.client_image} alt="service-img" />
                            )}
                          </div>
                          <div className="N-sp-room-item-details">
                            {work?.service || "Service Name"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div></div>
                  )}
                </div>
                {/* <div className="N-sp-room-item-see-more cursor-pointer !w-fit ml-auto">
                  see more <img src={leftArrow} alt="" />
                </div> */}
                <div className=" h-2"></div>
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
            <h3 className="text-lg font-semibold mb-5">Daily updates</h3>
            <div className="grid gap-4 mb-5">
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
            <div className="mb-5">
              <TextField
                label="Caption"
                fullWidth
                multiline
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <div className="grid mb-5">
              <button
                className="bg-black text-white rounded-sm p-2"
                onClick={handleDailyUpdateRequest}
              >
                {loding ? "Savings..." : "Save"}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[430px] ">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-md h-fit pb-[20px]">
              <div className="N-daily-update-container">
                {dailyUpdates?.length > 0 && (
                  <div className="N-daily_update_main">
                    <div className="N-daily_update_salon_details">
                      <img src={salonData?.main_image} alt="" />
                      <div className="N-d-u-salon-name">
                        <h2>{salonData?.name}</h2>
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
                        <a href={`#`}>Book Now.</a>
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

  export default SalonForm;