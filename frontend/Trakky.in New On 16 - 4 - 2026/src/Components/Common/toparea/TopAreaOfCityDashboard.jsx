import React, { useEffect, useState } from "react";
import image from "../../../Assets/images/salon/salon-image1.png";
import { Link, redirect, useNavigate } from "react-router-dom";
import BangaloreImg from "../../../Assets/images/city/bangalore.svg";
import AhmedabadImg from "../../../Assets/images/city/ahmedabad.svg";
import Gandhinagar from "../../../Assets/images/city/gandhinagar.svg";
import MumbaiImg from "../../../Assets/images/city/mumbai.svg";
import DelhiImg from "../../../Assets/images/city/delhi.svg";

const TopAreaOfCityDashboard = ({ cityname, areas }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(cityname[0]);
  const [activeCityArea, setActiveCityArea] = useState({});

  useEffect(() => {
    setActiveCityArea(areas.filter((item) => item.city === active));
  }, [active, areas]);

  const handleScroll = () => {
    const startDiv = document.getElementById("start");
    startDiv.scrollIntoView({ behavior: "smooth" });
  };

  const colorPalette = ["#C2D1C8", "#DDD5CB", "#F5C8C8"];



  return (
    <div>
      <div className="top-destinations__container">
        <div className="flex flex-col gap-2 items-center lg:gap-3">
          <h2 className=" !text-xl font-bold">Popular locations in India </h2>
          <p className=" text-sm pb-1 text-gray-700 lg:text-sm">
            Choose an area for salon services
          </p>

          <div className="flex gap-3  overflow-x-scroll ml-4 ">
            {cityname.map((location, index) => {
              return (
                <div
                  onClickCapture={() => {
                    setActive(cityname[index]);
                  }}
                  key={index}
                  className={`shrink-0 last:mr-4 rounded-3xl cursor-pointer relative h-28`}
                >
                 
                  {location.toLowerCase() === "bangalore" ? (
                    <>
                     {location.toLowerCase() === active.toLowerCase() && (
                    <div className=" absolute h-[3px] rounded-md mt-[3px] mb-[6px] w-1/2 left-1/2 -translate-x-1/2 top-[100px] bg-[#b39d7550] z-20"></div>
                  )}
                    <img
                      src={BangaloreImg}
                      alt="Bangalore"
                      className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl"
                    />
                    </>
                  ) : location.toLowerCase() === "ahmedabad" ? (
                    <>
                     {location.toLowerCase() === active.toLowerCase() && (
                    <div className=" absolute h-[3px] rounded-md mt-[3px] mb-[6px] w-1/2 left-1/2 -translate-x-1/2 top-[100px] bg-[#709a8250] z-20"></div>
                  )}
                    <img
                      src={AhmedabadImg}
                      alt="Ahmedabad"
                      className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl"
                    />

                    </>
                  ) : location.toLowerCase() === "gandhinagar" ? (
                    <>
                     {location.toLowerCase() === active.toLowerCase() && (
                    <div className=" absolute h-[3px] rounded-md mt-[3px] mb-[6px] w-1/2 left-1/2 -translate-x-1/2 top-[100px] bg-[#d9cee950] z-20"></div>
                  )}
                    <img
                      src={Gandhinagar}
                      alt="Gandhinagar"
                      className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl"
                    />
                    </>
                  ) : location.toLowerCase() === "mumbai" ? (
                    <>
                     {location.toLowerCase() === active.toLowerCase() && (
                    <div className=" absolute h-[3px] rounded-md mt-[3px] mb-[6px] w-1/2 left-1/2 -translate-x-1/2 top-[100px] bg-[#fa6c6c50] z-20"></div>
                  )}
                    <img
                      src={MumbaiImg}
                      alt="Mumbai"
                      className=" !h-24 !w-24 object-contain shrink-0 rounded-3xl"
                    />
                    </>
                  ) : location.toLowerCase() === "delhi" ? (
                    <>
                     {location.toLowerCase() === active.toLowerCase() && (
                    <div className=" absolute h-[3px] rounded-md mt-[3px] mb-[6px] w-1/2 left-1/2 -translate-x-1/2 top-[100px] bg-[#d2613950] z-20"></div>
                  )}
                    <img
                      src={DelhiImg}
                      alt="Delhi"
                      className=" !h-24 !w-24 object-contain shrink-0  rounded-3xl"
                    />
                    </>
                  ) : (
                    <div
                      className={`!h-24 !w-24 rounded-3xl text-lg font-bold transform flex items-center justify-center`}
                      style={{
                        backgroundColor:
                          colorPalette[index % colorPalette.length],
                      }}
                    >
                      {location}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeCityArea.length > 0 && (
        <div className="spa_popular_area_container">
          <div className="spa_popular_area_left">
            <div className="spa_popular_top">
              <Link
                style={{ width: "100%", height: "100%" }}
                to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
              >
                <img src={activeCityArea[0]?.areas[0]?.image_area} alt="" />
                <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
              </Link>
            </div>
            <div className="spa_popular_bottom">
              <div className="spa_popular_bottom_left">
                {activeCityArea[0]?.areas[1]?.image_area ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[1]?.name.toLowerCase()}`}
                    >
                      <img
                        src={activeCityArea[0]?.areas[1].image_area}
                        alt=""
                      />
                      <h3>{activeCityArea[0]?.areas[1]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
                    </Link>
                  </>
                )}
              </div>
              <div className="spa_popular_bottom_right">
                {activeCityArea[0]?.areas[2]?.image_area ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[2]?.name.toLowerCase()}`}
                    >
                      <img
                        src={activeCityArea[0]?.areas[2]?.image_area}
                        alt=""
                      />
                      <h3>{activeCityArea[0]?.areas[2]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="spa_popular_area_right">
            <div className="spa_popular_tight_top">
              <div className="spa_popular_top_left">
                {activeCityArea[0]?.areas[3]?.image_area ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[3]?.name.toLowerCase()}`}
                    >
                      <img
                        src={activeCityArea[0]?.areas[3]?.image_area}
                        alt=""
                      />
                      <h3>{activeCityArea[0]?.areas[3]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
                    </Link>
                  </>
                )}
              </div>
              <div className="spa_popular_top_right">
                {activeCityArea[0]?.areas[4]?.image_area ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[4]?.name.toLowerCase()}`}
                    >
                      <img
                        src={activeCityArea[0]?.areas[4]?.image_area}
                        alt=""
                      />
                      <h3>{activeCityArea[0]?.areas[4]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="spa_popular_right_bottom">
              {activeCityArea[0]?.areas[5]?.image_area ? (
                <>
                  <Link
                    style={{ width: "100%", height: "100%" }}
                    to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[5]?.name.toLowerCase()}`}
                  >
                    <img src={activeCityArea[0]?.areas[5]?.image_area} alt="" />
                    <h3>{activeCityArea[0]?.areas[5]?.name}</h3>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    style={{ width: "100%", height: "100%" }}
                    to={`/${active.toLowerCase()}/salons/${activeCityArea[0]?.areas[0]?.name.toLowerCase()}`}
                  >
                    <img src={image} alt="" />
                    <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopAreaOfCityDashboard;
