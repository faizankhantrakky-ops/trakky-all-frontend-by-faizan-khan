import React, { useState, useContext, useEffect } from "react";
import Header from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import { Modal } from "@mui/material";
import CityAreaModal from "../Common/Navbar/CityAreaModal";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  capitalizeAndFormat,
  getCoordinateByCity,
} from "../functions/generalFun";
import { Swiper, SwiperSlide } from "swiper/react";
import "./citypage.css";

import heart_svg from "../../Assets/images/icons/like.svg";
import reviewSvg from "../../Assets/images/icons/rating_svg.svg";
import RatingSvg from "../../Assets/images/icons/new_star_svg.svg";
import { FcLike } from "react-icons/fc";

import "swiper/css";
import "swiper/css/pagination";

import SwiperCore, { Pagination,Autoplay } from "swiper";
import Spaservices from "./SpaServices/Spaservices";
import AuthContext from "../../context/Auth";

import { useDispatch, useSelector } from "react-redux";
import { fetchspasByCategoryAsync } from "../../Store/spaSlices";
import { fetchNearBySpas } from "../../Store/nearbySlice";
import OtherListCard from "../listpage/listcard/OtherListCard";
import SpaCard from "./SpaCard";
import { ArrowRight, KeyboardArrowRightOutlined } from "@mui/icons-material";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import FAQ from "../faq/faq";
import CheckoutBestCategory from "./CheckoutBestCategory/CheckoutBestCategory";
import { Helmet } from "react-helmet";
import smallAndFormat from "../../Components/Common/functions/smallAndFormat";
// import { Pagination }from 'swiper/modules';
import OfferPng from "../../Assets/images/icons/offer_svg.svg";

const CityPage = () => {
  const [cityAreaOpen, setCityAreaOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const params = useParams();

  return (
    <>
      <Helmet>
        <title>
          Checkout Best Spa To Visit In {capitalizeAndFormat(params?.city)} -
          Trakky
        </title>
        <meta
          name="description"
          content={`Checkout the best spas in ${capitalizeAndFormat(
            params?.city
          )}. Get best massage therapies in top spas in ${capitalizeAndFormat(
            params?.city
          )}. Click here to find out the body spas and massage therapy spas in ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
      </Helmet>
      <Toaster />
      <div className=" bg-[#CBC7F0] rounded-b-xl">
        <Header isCityPage={true} />
        <BestSpaCity />
      </div>
      <CityOffer1 />
      <Spaservices />
      <AreasWithFamousSpa />
      <CityOffer2 />
      <SpaNearYou />
      <CheckoutBestCategory />

      <h2 className=" text-center text-lg font-light pt-3">
        "Find the best spa massage"
      </h2>

      <BodyMassageSpa />
      <BodyMassageCenter />

      <CityOffer3 />
      <MensSpas />
      <WomensSpas />

      <PopularArea />
      <FAQ />
      <AboutUs />

      {/* <AreasWithFamousSpa /> */}

      <FooterN city={"ahmedabad"} />

      <Modal
        open={cityAreaOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          border: "none",
          outline: "none",
        }}
      >
        <CityAreaModal
          onClose={() => setCityAreaOpen(false)}
          toastMessage={toastMessage}
        />
      </Modal>
    </>
  );
};

export default CityPage;

const BestSpaCity = () => {
  const params = useParams();

  const navigate = useNavigate();
  SwiperCore.use([Autoplay]);

  const dispatch = useDispatch();

  const bestSpaState = useSelector((state) => state.bestSpas);

  useEffect(() => {
    if (
      bestSpaState?.city == null ||
      bestSpaState?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "best",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [params?.city, dispatch]);

  return (
    <div className=" px-4 sm:pl-4 sm:pr-0 md:pl-10">
      <div className=" flex gap-1 items-center justify-center sm:-ml-4 md:-ml-10">
        <span className=" bg-gradient-to-r grow h-[2px] from-[#00000000] to-[#00000020] max-w-[150px]"></span>
        <h1 className=" text-lg font-medium md:text-xl md:2xl">
          Best spas in {smallAndFormat(params?.city)}{" "}
        </h1>
        <span className=" bg-gradient-to-l grow h-[2px] from-[#00000000] to-[#00000020] max-w-[150px]"></span>
      </div>
      <div className=" Best-spa-city pt-3 pb-7 md:pt-5 md:pb-9">
        <Swiper
          slidesPerView={window.innerWidth > 640 ? "auto" : 1}
          spaceBetween={15}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          // slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 2000, // Adjust delay for smoother scrolling
            disableOnInteraction: false,
          }}
          speed={1000}
          lazy={true} 
          className=""
        >
          {bestSpaState?.data?.length > 0 ? (
            bestSpaState?.data?.map((item, index) => {
              return (
                <SwiperSlide
                  key={index}
                  onClick={() => {
                    navigate(
                      `/${encodeURIComponent(item?.city)}/${encodeURIComponent(
                        item?.area
                      )}/spas/${item?.slug}`
                    );
                  }}
                  className=" cursor-pointer relative last:mr-4 snap-start block bg-slate-100 w-full min-w-[min(calc(100%-32px),320px)] sm:max-w-[320px] overflow-hidden rounded-xl"
                >
                  {item?.main_image && (
                    <img
                      src={item?.main_image}
                      className=" h-auto w-full aspect-video object-cover rounded-t-xl"
                      alt="spa image"
                    />
                  )}
                  {item?.premium && (
                    <div className="premium_div-x absolute !left-3 !top-3 !rounded-md">
                      <div className="premium-text !text-xs">Premium</div>
                    </div>
                  )}
                  <div className=" h-[70px] w-full p-[10px]">
                    <h2 className=" text-sm flex justify-between font-medium  gap-1 h-[22px] leading-4 w-full line-clamp-1 text-black">
                      <span className=" line-clamp-1 leading-4 h-4">
                        {item?.area}, {item?.city}
                      </span>
                      <span className=" font-normal text-xs min-w-max">
                        &#8377;{item?.price} Onwards
                      </span>
                    </h2>
                    <div className=" h-7 w-full bg-[#512DC8] rounded-md flex gap-1 items-center px-[6px]">
                      <img
                        src={OfferPng}
                        alt="heart"
                        className=" w-4 h-4 invert brightness-0"
                      />
                      {item?.spa_profile_offer_details?.length > 0 ? (
                        <div className=" flex items-center justify-between w-full font-medium">
                          <span className="text-white text-xs line-clamp-1 grow">
                            {item?.spa_profile_offer_details[0]?.offer_name}
                          </span>

                          {item?.spa_profile_offer_details?.length > 1 ? (
                            <span className=" text-white text-xs line-clamp-1 min-w-max">
                              +{item?.spa_profile_offer_details?.length - 1}{" "}
                              more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className=" text-white text-xs line-clamp-1">
                          Best offers available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className=" p-2 px-3 absolute bottom-[70px] left-0 w-full h-auto flex gap-1 justify-between items-center bg-gradient-to-t from-[#000000f6] to-[#00000000]">
                    <h2 className=" text-lg leading-5 line-clamp-1 text-white font-semibold">
                      {item?.name}
                    </h2>
                    {item?.avg_review && (
                      <button className=" text-white bg-gradient-to-r from-[#9B6DFC] items-center flex gap-[2px] to-[#5732CC] text-xs rounded-md px-[8px] py-[4px] min-w-max">
                        <img
                          src={RatingSvg}
                          alt="heart"
                          className=" w-3 h-3 invert brightness-0"
                        />
                        {item?.avg_review
                          ? String(item?.avg_review).slice(0, 3)
                          : "0"}
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              );
            })
          ) : bestSpaState?.loading ? (
            <div className=" flex gap-4 overflow-scroll snap-x snap-mandatory">
              {[0, 1, 2, 3, 4, 5]?.map((item, index) => {
                return (
                  <div className=" cursor-pointer relative  last:mr-4 snap-start block bg-slate-100 w-full min-w-[100%] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] overflow-hidden rounded-lg animate-pulse">
                    <div key={index} className="aspect-video w-full"></div>
                    <div className=" w-full h-[70px]"></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </Swiper>
      </div>
    </div>
  );
};

const AreasWithFamousSpa = () => {
  const { userFavorites, user } = useContext(AuthContext);

  const navigate = useNavigate();

  const params = useParams();

  const [topSpaOfPopularArea, setTopSpaOfPopularArea] = useState([]);
  const [topSpaActiveArea, setTopSpaActiveArea] = useState("");
  const [topSpaActiveAreaData, setTopSpaActiveAreaData] = useState([]);
  const [topSpaActiveAreaDataLoading, setTopSpaActiveAreaDataLoading] =
    useState(true);

  const getTopSpaByArea = async (city) => {
    setTopSpaActiveAreaDataLoading(true);

    let url = `https://backendapi.trakky.in/spas/topspabycityarea/?city=${city}&verified=true`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setTopSpaOfPopularArea(data[0]?.areas);
        setTopSpaActiveArea(data[0]?.areas[0]?.area);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setTopSpaActiveAreaDataLoading(false);
    }
  };

  useEffect(() => {
    if (params?.city) {
      getTopSpaByArea(params?.city);
    }
  }, [params?.city]);

  useEffect(() => {
    if (topSpaActiveArea) {
      let spa = topSpaOfPopularArea.filter(
        (item) => item.area.toLowerCase() == topSpaActiveArea.toLowerCase()
      );

      setTopSpaActiveAreaData(spa[0]?.spas);
    } else {
      setTopSpaActiveAreaData([]);
    }
  }, [topSpaActiveArea]);

  return (
    (topSpaActiveAreaData?.length > 0 || topSpaActiveAreaDataLoading) && (
      <div className="pt-6 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            {/* Areas with famous spa */}
            Best spas of different areas
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max"
            onClick={() => {
              navigate(`/${params?.city}/spas/${topSpaActiveArea}`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className="mt-3 flex overflow-x-scroll gap-3 ml-4 md:ml-10 snap-x snap-proximity">
          {topSpaOfPopularArea?.length > 0
            ? topSpaOfPopularArea?.map((item, index) => (
                <button
                  className={` flex items-center px-5 rounded-lg min-w-max text-sm h-10 font-semibold snap-start last:mr-4 ${
                    item?.area.toLowerCase() == topSpaActiveArea.toLowerCase()
                      ? "text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC]"
                      : "border border-slate-800 border-solid"
                  }`}
                  onClick={() => setTopSpaActiveArea(item?.area)}
                  key={index}
                >
                  {item?.area}
                </button>
              ))
            : [0, 1, 2].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center shrink-0 w-24 px-5 rounded-lg min-w-max text-sm h-10 font-semibold snap-start last:mr-4 animate-pulse bg-slate-100"
                ></div>
              ))}
        </div>
        <div className=" ml-4 md:ml-10 mt-3">
          <SwiperComp
            data={topSpaActiveAreaData}
            loading={topSpaActiveAreaDataLoading}
          />
        </div>
      </div>
    )
  );
};

const SpaNearYou = () => {
  const params = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location } = useContext(AuthContext);

  const nearBySpaState = useSelector((state) => state.nearbySpas);

  const getNearBySpaData = async () => {
    let latLong = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    if (latLong.latitude == 0 && latLong.longitude == 0) {
      latLong = await getCoordinateByCity(
        capitalizeAndFormat(params?.city).toLowerCase()
      );
    }

    if (
      nearBySpaState?.data?.length == 0 ||
      nearBySpaState?.data == null ||
      nearBySpaState?.latitude !== latLong.latitude ||
      nearBySpaState?.longitude !== latLong.longitude
    ) {
      dispatch(
        fetchNearBySpas({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: 1,
        })
      );
    }
  };

  useEffect(() => {
    if (
      nearBySpaState?.data?.length == 0 ||
      nearBySpaState?.data == null ||
      nearBySpaState?.preferableCity?.toLowerCase() !==
        params?.city.toLowerCase() ||
      nearBySpaState?.latitude !== location.latitude
    ) {
      getNearBySpaData();
    }
  }, [params?.city, location]);

  return (
    (nearBySpaState?.data?.length > 0 || nearBySpaState?.loading) && (
      <div className="pt-6 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            Best spas near you
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max "
            onClick={() => {
              navigate(`/${params?.city}/nearby`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className=" ml-4 md:ml-10 my-3">
          <SwiperComp
            data={nearBySpaState?.data}
            loading={nearBySpaState?.loading}
          />
        </div>
      </div>
    )
  );
};

const BodyMassageSpa = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const bodyMassageSpaState = useSelector((state) => state.bodyMassageSpas);

  useEffect(() => {
    if (
      bodyMassageSpaState?.city == null ||
      bodyMassageSpaState?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassage",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [params?.city, dispatch]);

  return (
    (bodyMassageSpaState?.data?.length > 0 || bodyMassageSpaState?.loading) && (
      <div className="pt-5 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            Body massage spas in {smallAndFormat(params?.city)}
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max"
            onClick={() => {
              navigate(`/${params?.city}/bodyMassagespas`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className=" ml-4 md:ml-10 mt-3">
          <SwiperComp
            data={bodyMassageSpaState?.data}
            loading={bodyMassageSpaState?.loading}
          />
        </div>
      </div>
    )
  );
};

const BodyMassageCenter = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const bodyMassageCenterState = useSelector(
    (state) => state.bodyMassageCenters
  );

  useEffect(() => {
    if (
      bodyMassageCenterState?.city == null ||
      bodyMassageCenterState?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassageCenters",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [params?.city, dispatch]);

  return (
    (bodyMassageCenterState?.data?.length > 0 ||
      bodyMassageCenterState?.loading) && (
      <div className="pt-6 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            Body massage centers in {smallAndFormat(params?.city)}
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max"
            onClick={() => {
              navigate(`/${params?.city}/bodyMassagecenter`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className=" ml-4 md:ml-10 mt-3">
          <SwiperComp
            data={bodyMassageCenterState?.data}
            loading={bodyMassageCenterState?.loading}
          />
        </div>
      </div>
    )
  );
};

const MensSpas = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const mensSpaState = useSelector((state) => state.mensSpas);

  useEffect(() => {
    if (
      mensSpaState?.city == null ||
      mensSpaState?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "mens",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [params?.city, dispatch]);

  return (
    (mensSpaState?.data?.length > 0 || mensSpaState?.loading) && (
      <div className="pt-6 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            Spas for men in {smallAndFormat(params?.city)}
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max"
            onClick={() => {
              navigate(`/${params?.city}/menspas`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className=" ml-4 md:ml-10 mt-3">
          <SwiperComp
            data={mensSpaState?.data}
            loading={mensSpaState?.loading}
          />
        </div>
      </div>
    )
  );
};

const WomensSpas = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const womensSpaState = useSelector((state) => state.womensSpas);

  useEffect(() => {
    if (
      womensSpaState?.city == null ||
      womensSpaState?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "womens",
          page: 1,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  }, [params?.city, dispatch]);

  return (
    (womensSpaState?.data?.length > 0 || womensSpaState?.loading) && (
      <div className="pt-6 lg:pt-10">
        <div className="mx-4 flex justify-between gap-1 md:mx-10">
          <h2 className="text-lg font-semibold md:text-xl md:2xl">
            Spas for women in {smallAndFormat(params?.city)}
          </h2>
          <button
            className=" text-[#512DC8] text-sm flex items-center min-w-max"
            onClick={() => {
              navigate(`/${params?.city}/womenspas`);
            }}
          >
            See more{" "}
            <KeyboardArrowRightOutlined
              sx={{
                fontWeight: "300",
                fontSize: "1.2rem",
                width: "20px",
              }}
            />
          </button>
        </div>
        <div className=" ml-4 md:ml-10 mt-3">
          <SwiperComp
            data={womensSpaState?.data}
            loading={womensSpaState?.loading}
          />
        </div>
      </div>
    )
  );
};

const SwiperComp = ({ data, loading }) => {
  SwiperCore.use([Autoplay]);
  return (
    <Swiper
      spaceBetween={15}
      className=""
      // autoplay={true}
      slidesPerView={"auto"}
      modules={[Pagination]}
      loop={true}
      autoplay={{
        delay: 2000, // Adjust delay for smoother scrolling
        disableOnInteraction: false,
      }}
      speed={1000}
      lazy={true}
      style={{
        paddingRight: "16px",
      }}
      // navigation={true}
    >
      {data?.length > 0 ? (
        data?.map((item, index) => {
          return (
            <SwiperSlide className=" !w-full !max-w-[320px]">
              <SpaCard data={item} key={index} />
            </SwiperSlide>
          );
        })
      ) : loading ? (
        [0, 0, 0, 0, 0].map((item, index) => {
          return (
            <SwiperSlide className={`!w-full !max-w-[320px]`}>
              <div className=" animate-pulse bg-slate-100 w-full h-[298px] rounded-2xl"></div>
            </SwiperSlide>
          );
        })
      ) : (
        <></>
      )}
    </Swiper>
  );
};

const CityOffer1 = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cityOfferData, setCityOfferData] = useState([]);

  const [cityOfferLoading, setCityOfferLoading] = useState(true);

  const getCityOffer = async (city) => {
    let url = `https://backendapi.trakky.in/spas/city-offer-1/?city=${encodeURIComponent(
      city
    )}`;

    setCityOfferLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setCityOfferData(data);
        setCityOfferLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setCityOfferLoading(false);
    }
  };

  useEffect(() => {
    if (params?.city) {
      getCityOffer(params?.city);
    }
  }, [params?.city]);

  return (
    (cityOfferLoading || cityOfferData?.length > 0) && (
      <div className=" pl-4 mt-4 sm:pl-4 sm:pr-0 md:pl-10 lg:mt-6">
        <div className=" flex gap-1 items-center justify-center -ml-4 md:-ml-10">
          <h2 className=" text-lg font-semibold md:text-xl md:2xl">
            Best spa offers in {smallAndFormat(params?.city)}
          </h2>
        </div>
        <div className=" pt-4 flex gap-4 overflow-x-scroll snap-x snap-mandatory">
          {cityOfferData?.length > 0 ? (
            cityOfferData?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    navigate(
                      `/${encodeURIComponent(
                        item?.spa_city
                      )}/${encodeURIComponent(item?.spa_area)}/spas/${
                        item?.spa_slug
                      }`
                    );
                  }}
                  className="last:mr-4 snap-start w-36 aspect-[15/22] lg:w-44 cursor-pointer "
                >
                  <div className=" aspect-[15/22] bg-slate-100 w-36 overflow-hidden rounded-lg lg:w-44 drop-shadow shadow-sm">
                    {item?.offer_img && (
                      <img
                        src={item?.offer_img}
                        className=" w-full h-full object-cover "
                        alt="offer image"
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : cityOfferLoading ? (
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="last:mr-4 aspect-[15/22] snap-start w-36 lg:w-44"
                >
                  <div className=" aspect-[15/22] bg-slate-100 w-36 overflow-hidden rounded-lg lg:w-44"></div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  );
};

const CityOffer2 = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cityOfferData, setCityOfferData] = useState([]);
  const [cityOfferLoading, setCityOfferLoading] = useState(true);

  const getCityOffer = async (city) => {
    let url = `https://backendapi.trakky.in/spas/city-offer-2/?city=${encodeURIComponent(
      city
    )}`;

    setCityOfferLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setCityOfferData(data);
        setCityOfferLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setCityOfferLoading(false);
    }
  };

  useEffect(() => {
    if (params?.city) {
      getCityOffer(params?.city);
    }
  }, [params?.city]);

  return (
    (cityOfferLoading || cityOfferData?.length > 0) && (
      <div className=" pl-4 mt-6 sm:pl-4 sm:pr-0 md:pl-10 lg:mt-10">
        <div className=" flex gap-4 overflow-x-scroll snap-x snap-mandatory">
          {cityOfferData?.length > 0 ? (
            cityOfferData?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    navigate(
                      `/${encodeURIComponent(
                        item?.spa_city
                      )}/${encodeURIComponent(item?.spa_area)}/spas/${
                        item?.spa_slug
                      }`
                    );
                  }}
                  className="last:mr-4 snap-start w-80 aspect-[5/2] lg:w-96 cursor-pointer"
                >
                  <div className=" aspect-[5/2] bg-slate-100 w-80 overflow-hidden rounded-lg lg:w-96 drop-shadow shadow-sm">
                    {item?.offer_img && (
                      <img
                        src={item?.offer_img}
                        className=" w-full h-full object-cover "
                        alt="offer"
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : cityOfferLoading ? (
            [0, 1, 2, 3, 4, 5]?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="last:mr-4 aspect-[5/2] snap-start w-80 lg:w-96"
                >
                  <div className=" aspect-[5/2] bg-slate-100 w-80 overflow-hidden rounded-lg lg:w-96"></div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  );
};

const CityOffer3 = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [offersData, setOffersData] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const getOffers = async (city) => {
    let url = `https://backendapi.trakky.in/spas/city-offer-3/?city=${encodeURIComponent(
      city
    )}`;

    setOffersLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setOffersData(data);
        setOffersLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setOffersLoading(false);
    }
  };

  useEffect(() => {
    if (params?.city) {
      getOffers(params?.city);
    }
  }, [params?.city]);

  return (
    (offersData?.length > 0 || offersLoading) && (
      <div className=" mt-6 lg:mt-10">
        <div className=" ml-4 md:ml-10">
          <div className=" mt-3 flex gap-4 overflow-x-scroll snap-mandatory snap-x">
            {offersData?.length > 0 ? (
              offersData?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(
                        `/${encodeURIComponent(
                          item?.spa_city
                        )}/${encodeURIComponent(item?.spa_area)}/spas/${
                          item?.spa_slug
                        }`
                      );
                    }}
                    className=" cursor-pointer relative aspect-square min-w-[min(calc(100%-16px),370px)] w-full max-w-[370px] bg-slate-100 overflow-hidden rounded-lg snap-start last:mr-4"
                  >
                    {item?.offer_img && (
                      <img
                        src={item?.offer_img}
                        className=" h-full w-full aspect-square object-cover rounded-lg"
                        alt="offer"
                      />
                    )}
                    <div className=" p-3 absolute bottom-0 left-0 w-full h-auto flex gap-1 justify-between items-center bg-gradient-to-t from-[#000000f6] to-[#00000000]">
                      <h2 className=" text-lg leading-5 line-clamp-2 text-white">
                        {item?.spa_name}
                      </h2>
                      <button className=" text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC] text-[15px] rounded-md px-[10px] py-[5px] min-w-max">
                        Book now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : offersLoading ? (
              [0, 1, 2, 3, 4, 5]?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className=" cursor-pointer relative aspect-square min-w-[min(calc(100%-32px),300px)] w-full max-w-[300px] bg-slate-100 overflow-hidden rounded-lg snap-start last:mr-4"
                  ></div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    )
  );
};

const AboutUs = () => {
  return (
    <div className="N-about-us-section">
      <h1 className="px-4">About Us</h1>
      <div className="about-us-content">
        <p className="px-4">
          Welcome to Trakky, your gateway to a world of relaxation and
          rejuvenation. We're here to make your journey to wellness as seamless
          and soothing as possible.
        </p>
        <p className="px-4">
          At Trakky, we realize the value of self-care and its significance in
          improving your overall well-being. That is why we have designed a
          simple and convenient method for you to obtain the top spa services in
          your area.
        </p>
        <p className="px-4">
          Our purpose is to easily access you the finest spa experiences in your
          nearby area, promoting not only physical relaxation but also mental
          well-being.
        </p>
      </div>
    </div>
  );
};
