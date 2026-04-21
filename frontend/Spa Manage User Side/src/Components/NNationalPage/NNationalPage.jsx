import React, { useEffect, useState } from "react";
import Header from "../Common/Navbar/Header";
import WomenSpa from "../../Assets/images/national/women_spa_png.png";
import MenSpa from "../../Assets/images/national/men_spa_png.png";
import LuxuriousSpa from "../../Assets/images/national/luxury_spa_png.png";
import PremiumSpa from "../../Assets/images/national/premium_spa_png.png";
import BestSpa from "../../Assets/images/national/best_spa_png.png";
import SpaNearYou from "../../Assets/images/national/Spa_near_you_png.png";
import MassageSpa from "../../Assets/images/national/massage_spa_png.png";

import BangaloreImg from "../../Assets/images/city/bangalore.svg";
import AhmedabadImg from "../../Assets/images/city/ahmedabad.svg";
import Gandhinagar from "../../Assets/images/city/gandhinagar.svg";
import MumbaiImg from "../../Assets/images/city/mumbai.svg";
import DelhiImg from "../../Assets/images/city/delhi.svg";
import { useNavigate } from "react-router-dom";

import flagImg from "../../Assets/images/other/flag.png";
import arrowSvg from "../../Assets/images/logos/arrow.svg";
import Footer from "../Common/Footer/Footer";
import { Link } from "react-router-dom";

import StaticImage1 from "../../Assets/images/national/static_image_3_4.png";
import StaticImage2 from "../../Assets/images/national/static_image_16_9_1.png";
import StaticImage3 from "../../Assets/images/national/static_image_16_9_2.png";

import FAQ from "../faq/faq";
import FooterN from "../Common/Footer/FooterN";

import CityAreaModal from "../Common/Navbar/CityAreaModal";
import { Modal } from "@mui/material";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import arrowSvgN from "../../Assets/images/icons/right_arrow_N.svg";

import "./nnationalpage.css";

const NNationalPage = () => {
  const navigate = useNavigate();

  const [expandedCities, setExpandedCities] = useState({});
  const [displayNo, setDisplayNo] = useState(6);
  const [city, setCity] = useState([]);

  const [cityAreaOpen, setCityAreaOpen] = useState(false);

  const handleShowMoreArea = (cityId) => {
    setExpandedCities((prevExpandedCities) => ({
      ...prevExpandedCities,
      [cityId]: true,
    }));
  };

  useEffect(() => {
    if (window.innerWidth < 540) {
      setDisplayNo(3);
    }
  }, []);

  const toastMessage = (message, status) => {
    if (status === "success") {
      toast.success(message, {
        duration: 3000,
        position: "top-right",
      });
    } else if (status === "error") {
      toast.error(message, {
        duration: 3000,
        position: "top-right",
      });
    } else {
      toast.info(message, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleScroll = () => {
    const startDiv = document.getElementById("start");
    startDiv.scrollIntoView({ behavior: "smooth" });
  };

  const getCities = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/spas/city/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setCity(data.payload);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <>
      <Toaster />
      <div className=" bg-[#CBC7F0] rounded-b-xl">
        <Header />
        <div className=" w-full md:grid md:gap-10 md:px-10 md:grid-cols-2 md:place-items-center lg:pb-5">
          <div
            className=" flex flex-col gap-7 py-4 px-4 cursor-pointer"
            onClick={() => {
              setCityAreaOpen(true);
            }}
          >
            <div className=" flex nowrap gap-4">
              <div className=" w-full flex flex-col gap-1">
                <div className="w-auto h-auto bg-[#4D275D10] p-1 rounded-md ">
                  <img
                    src={WomenSpa}
                    className=" w-full aspect-[5/3] object-contain"
                    alt="women spa"
                  />
                </div>
                <h2 className=" text-xs text-center line-clamp-1 ">
                  Women's Spa
                </h2>
              </div>
              <div className=" w-full flex flex-col gap-1">
                <div className="w-auto h-auto bg-[#4D275D10] p-1 rounded-md ">
                  <img
                    src={MenSpa}
                    className=" w-full aspect-[5/3] object-contain"
                    alt="men spa"
                  />
                </div>
                <h2 className=" text-xs text-center line-clamp-1">Men's Spa</h2>
              </div>
              <div className=" w-full flex flex-col gap-1">
                <div className="w-auto h-auto bg-[#4D275D10] p-1 rounded-md ">
                  <img
                    src={LuxuriousSpa}
                    className=" w-full aspect-[5/3] object-contain"
                    alt="luxuriou spa"
                  />
                </div>
                <h2 className=" text-xs text-center line-clamp-1">
                  Luxurious's Spa
                </h2>
              </div>
            </div>
            <div className=" grid grid-cols-2 gap-4 grid-rows-2 mb-1">
              <div className=" bg-[rgba(77,39,93,0.06)] rounded-md min-h-[70px] flex justify-between items-center p-3 ">
                <h3 className=" text-sx line-clamp-1">Premium Spa</h3>
                <img
                  src={PremiumSpa}
                  className=" h-8 w-8 object-contain"
                  alt="premium spa"
                />
              </div>
              <div className=" bg-[#4D275D10] rounded-md min-h-[70px] flex justify-between items-center p-3 ">
                <h3 className=" text-sx line-clamp-1">Best Spa</h3>
                <img
                  src={BestSpa}
                  className=" h-8 w-8 object-contain"
                  alt="best spa"
                />
              </div>
              <div className=" bg-[#4D275D10] rounded-md min-h-[70px] flex justify-between items-center p-3 ">
                <h3 className=" text-sx line-clamp-1">Spa near you</h3>
                <img
                  src={SpaNearYou}
                  className=" h-8 w-8 object-contain"
                  alt="near you"
                />
              </div>
              <div className=" bg-[#4D275D10] rounded-md min-h-[70px] flex justify-between items-center p-3 ">
                <h3 className=" text-sx line-clamp-1">Massage Spa</h3>
                <img
                  src={MassageSpa}
                  className=" h-8 w-8 object-contain"
                  alt="massage spa"
                />
              </div>
            </div>
          </div>
          <div className=" hidden aspect-video md:grid md:aspect-[16/10] lg:aspect-video xl:aspect-[16/8] w-auto h-auto  grid-cols-11 grid-rows-2 gap-2 my-4 rounded-lg overflow-hidden">
            <div className=" col-span-6 bg-slate-100 w-full h-full">
              <img
                src={StaticImage2}
                className=" object-cover h-full w-full"
                alt="spa"
              />
            </div>
            <div className=" col-span-5 row-span-2 bg-slate-100">
              <img
                src={StaticImage1}
                alt="spa"
                className="object-cover h-full w-full"
              />
            </div>
            <div src={StaticImage3} className=" col-span-6 bg-slate-100">
              <img
                src={StaticImage3}
                alt="spa"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className=" aspect-video w-[calc(100%-32px)] grid grid-cols-11 grid-rows-2 gap-2 mx-4 my-4 rounded-lg overflow-hidden md:hidden">
        <div className=" col-span-6 bg-slate-100 w-full h-full">
          <img
            src={StaticImage2}
            className=" object-cover h-full w-full"
            alt="spa"
          />
        </div>
        <div className=" col-span-5 row-span-2 bg-slate-100">
          <img
            src={StaticImage1}
            alt="spa"
            className="object-cover h-full w-full"
          />
        </div>
        <div src={StaticImage3} className=" col-span-6 bg-slate-100">
          <img
            src={StaticImage3}
            alt="spa"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
      <div className="">
        <PopularLocationIndia />
      </div>
      <div className="">
        <BestSpaCityWise />
      </div>
      <div className=" my-3 h-2 bg-slate-100 w-full" />
      <BestMassages handleScroll={handleScroll} />
      <div className=" my-3 h-2 bg-slate-100 w-full" />
      <NationalPageOffers />
      <div className="homepage-main-title" id="start">
        Popular locations in
        <span>
          <img src={flagImg} alt="indian flag" />
        </span>
        Bharat
      </div>
      <div className="homepage-disc">
        Indulge in the ultimate relaxation and rejuvenation with Trakky,
        dedicated to featuring the best spas in India. We've meticulously
        curated a collection of serene wellness sanctuaries across the country,
        known for their holistic therapies and tranquil ambiance. Explore our
        recommendations and embark on a journey towards blissful relaxation and
        inner harmony.
      </div>

      {/* popular city */}

      <div className="homepage-main-title">Select your city</div>
      <div className="main-area-links">
        {city?.map((item) => {
          return (
            <Link to={`/${item?.name.toLowerCase().replaceAll(" ", "")}/spas`}>
              <div className="area-group-item" key={item.id}>
                Spa in {item.name}
                <span>
                  <img src={arrowSvgN} alt="arrow" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* popular area */}

      {city &&
        city.map((item) => {
          return (
            <>
              {item?.area_names && item?.area_names.length > 0 && (
                <>
                  <div className="homepage-main-title">{item.name}</div>
                  <div className="main-area-links">
                    {item?.area_names
                      .slice(
                        0,
                        expandedCities[item.id]
                          ? item.area_names.length
                          : Math.min(displayNo, item.area_names.length)
                      )
                      .map((area, index) => {
                        return (
                          <Link
                            to={`/${item.name
                              .toLowerCase()
                              .replaceAll(" ", "-")}/spas/${area
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            <div className="area-group-item" key={index}>
                              Spa in&nbsp;
                              {area}
                              <span>
                                <img src={arrowSvgN} alt="arrow" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  {!expandedCities[item.id] &&
                    item?.area_names.length > displayNo && (
                      <button
                        className="show-more-button-area"
                        onClick={() => handleShowMoreArea(item.id)}
                      >
                        Show More
                      </button>
                    )}
                  {expandedCities[item.id] && (
                    <button
                      className="show-more-button-area"
                      onClick={() => {
                        setExpandedCities((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                        handleScroll();
                      }}
                    >
                      Show Less
                    </button>
                  )}
                </>
              )}
            </>
          );
        })}
      {/*Faqs Section*/}
      <FAQ />
      <AboutUs />
      <FooterN city={"ahmedabad"} />

      <Modal
        open={cityAreaOpen}
        onClose={() => setCityAreaOpen(false)} 
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

export default NNationalPage;

const PopularLocationIndia = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 items-center my-3 md:mt-6 md:mb-4 lg:gap-3 lg:mt-8 lg:mb-6">
      <h2 className=" text-xl font-bold md:text-2xl lg:text-3xl md:font-medium">
        Popular locations in India{" "}
      </h2>
      <p className=" text-sm md:text-base lg:text-lg pb-1 text-gray-700 ">
        choose a city for spa booking
      </p>
      <div className="flex gap-3  overflow-x-scroll ml-4 snap-x snap-mandatory lg:gap-8">
        <img
          src={AhmedabadImg}
          alt="Ahmedabad"
          className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl cursor-pointer snap-start"
          onClick={() => navigate("/ahmedabad/spas")}
        />
        <img
          src={Gandhinagar}
          alt="Gandhinagar"
          className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl cursor-pointer snap-start"
          onClick={() => navigate("/gandhinagar/spas")}
        />
        <img
          src={BangaloreImg}
          alt="Bangalore"
          className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl cursor-pointer snap-start"
          onClick={() => navigate("/bangalore/spas")}
        />
      </div>
    </div>
  );
};

const BestSpaCityWise = () => {
  const navigate = useNavigate();

  const [bestSpaData, setBestSpaData] = useState([]);
  const [bestSpaLoading, setBestSpaLoading] = useState(true);

  const getBestSpa = async () => {
    let url =
      "https://backendapi.trakky.in/spas/filter/?city=Ahmedabad&best_spa=true";

    setBestSpaLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setBestSpaData(data?.results);
        setBestSpaLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setBestSpaLoading(false);
    }
  };

  useEffect(() => {
    getBestSpa();
  }, []);

  return (
    (bestSpaData?.length > 0 || bestSpaLoading) && (
      <div className=" mt-6 mb-4 md:mt-8 md:mb-6 lg:mt-10 lg:mb-8">
        <h3 className="text-lg ml-4 font-semibold md:text-xl md:mb-2 lg:mb-4 lg:text-2xl md:ml-10">
          Best spas in ahmedabad
        </h3>
        <div className=" ml-4 md:ml-10">
          <div className=" my-3 flex gap-4 overflow-x-scroll snap-mandatory snap-x">
            {bestSpaData?.length > 0 ? (
              bestSpaData?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      navigate(
                        `/${encodeURIComponent(
                          item?.city
                        )}/${encodeURIComponent(item?.area)}/spas/${item?.slug}`
                      );
                    }}
                    className=" cursor-pointer relative aspect-video last:mr-4 snap-start block bg-slate-100 w-full min-w-[min(calc(100%-32px),320px)] max-w-[320px] overflow-hidden rounded-lg"
                  >
                    {item?.main_image && (
                      <img
                        src={item?.main_image}
                        className=" h-full w-full aspect-video object-cover rounded-lg"
                        alt="spa main"
                      />
                    )}
                    <div className=" p-3 absolute bottom-0 left-0 w-full h-auto flex gap-1 justify-between items-center bg-gradient-to-t from-[#000000f6] to-[#00000000]">
                      <h2 className=" text-lg leading-5 line-clamp-2 text-white">
                        {item?.name}
                      </h2>
                      <button className=" text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC] text-[15px] rounded-md px-[10px] py-[5px] min-w-max">
                        Book now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : bestSpaLoading ? (
              [0, 1, 2, 3, 4, 5]?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className=" cursor-pointer relative aspect-video last:mr-4 snap-start block bg-slate-100 w-full min-w-[min(calc(100%-32px),320px)] max-w-[320px] overflow-hidden rounded-lg"
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

const BestMassages = ({ handleScroll }) => {
  const [bestMassageData, setBestMassageData] = useState([]);
  const [bestMassageLoading, setBestMassageLoading] = useState(true);

  const getBestMassage = async () => {
    let url = "https://backendapi.trakky.in/spas/masterservice/";

    setBestMassageLoading(true);

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (res.status === 200) {
        setBestMassageData(data?.results);
        setBestMassageLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching data", error);
    } finally {
      setBestMassageLoading(false);
    }
  };

  useEffect(() => {
    getBestMassage();
  }, []);

  return (
    <div className=" mt-5 mb-4 md:mt-7 md:mb-6 lg:mb-8">
      <h3 className=" text-lg ml-4 font-semibold md:text-xl md:mb-2 lg:mb-4 lg:text-2xl md:ml-10">
        Best massage spas in india
      </h3>
      <div className=" ml-4 md:ml-10">
        <div className="my-3 flex gap-4 overflow-x-scroll snap-mandatory snap-x lg:gap-5 ">
          {bestMassageData?.length > 0 ? (
            bestMassageData?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="last:mr-4 snap-start flex gap-1 flex-col w-28 lg:w-32 cursor-pointer"
                  onClick={handleScroll}
                >
                  <div className=" aspect-square bg-slate-100 w-28 h-28 overflow-hidden rounded-lg lg:w-32 lg:h-32">
                    {item?.service_image && (
                      <img
                        src={item?.service_image}
                        className=" w-full h-full object-cover"
                        alt="service image"
                      />
                    )}
                  </div>
                  <div className=" text-sm text-center line-clamp-2">
                    {item?.service_name}
                  </div>
                </div>
              );
            })
          ) : bestMassageLoading ? (
            [0, 1, 2, 3, 4, 5]?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="last:mr-4 snap-start flex gap-1 flex-col w-28 lg:w-32"
                >
                  <div className=" aspect-square bg-slate-100 w-28 h-28 overflow-hidden rounded-lg lg:w-32 lg:h-32"></div>
                  <div className=" text-sm text-center line-clamp-2"></div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

const NationalPageOffers = () => {
  const navigate = useNavigate();

  const [offersData, setOffersData] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const getOffers = async () => {
    let url = "https://backendapi.trakky.in/spas/national-page-offer/";

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
    getOffers();
  }, []);

  return (
    (offersData?.length > 0 || offersLoading) && (
      <div className=" mt-6 mb-4 md:mt-8 md:mb-6 lg:mt-10 lg:mb-8">
        <div className=" ml-4 md:ml-10">
          <div className=" my-3 flex gap-4 overflow-x-scroll snap-mandatory snap-x">
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
                    className=" cursor-pointer relative aspect-square min-w-[min(calc(100%-32px),300px)] w-full max-w-[300px] bg-slate-100 overflow-hidden rounded-lg snap-start last:mr-4"
                  >
                    {item?.offer_img && (
                      <img
                        src={item?.offer_img}
                        className=" h-full w-full aspect-square object-cover rounded-lg"
                        alt="offer image"
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
        <p className="px-4 ">
          Welcome to Trakky, your one-stop destination for all things beauty and
          relaxation. We are more than simply an online booking platform; we are
          your dependable partner in looking and feeling your best.
        </p>
        <p className="px-4 ">
          At Trakky, we realize the value of self-care and its significance in
          improving your overall well-being. That is why we have designed a
          simple and convenient method for you to obtain the top salon and spa
          services in your area.
        </p>
        <p className="px-4 ">
          Our purpose is to inspire you to prioritize self-care and incorporate
          it into your daily routine. We believe that everyone has the right to
          look and feel their best, and we're here to help.
        </p>
      </div>
    </div>
  );
};
