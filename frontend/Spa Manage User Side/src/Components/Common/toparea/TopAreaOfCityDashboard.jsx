import React, { useEffect, useState } from "react";
import image from "../../../Assets/images/spa/spa-image1.png";
import { Link } from "react-router-dom";

const TopAreaOfCityDashboard = ({ cityname, areas }) => {
  const [active, setActive] = useState(cityname[0]);
  const [activeCityArea, setActiveCityArea] = useState({});

  useEffect(() => {
    setActiveCityArea(areas.filter((item) => item.city === active));
  }, [active, areas]);


  const handleScroll = () => {
    const startDiv = document.getElementById("start");
    startDiv.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="top-destinations__container">
        <div className="top-destinations__header">
          <h2>Top Area Of Popular Cities</h2>
          <p>Choose the best massage facility nearby your favourite place.</p>
          <div
            className="top-dest-tag-outer"
            style={{
              width: "fit-content",
              maxWidth: "100vw",
              margin: "auto",
              overflowX: "scroll",
            }}
          >
            {" "}
            <div className="top-destinations__tags">
              {/* Location tags */}
              {cityname.map((location, index) => {
                return (
                  <li
                    onClickCapture={() => {
                      setActive(cityname[index]);
                    }}
                    style={{
                      color: active === location ? "white" : "#2D3134",
                      backgroundColor: active === location ? "#2D3134" : "",
                    }}
                    key={index}
                  >
                    {location}
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {activeCityArea.length > 0 && (
        <div className="spa_popular_area_container">
          <div className="spa_popular_area_left">
            <div className="spa_popular_top">
              <Link
                style={{ width: "100%", height: "100%" }}
                onClick={handleScroll}
              >
                <img src={activeCityArea[0]?.areas[0]?.image_area} alt="area image" />
                <h3>{activeCityArea[0]?.areas[0]?.name}</h3>
              </Link>
            </div>
            <div className="spa_popular_bottom">
              <div className="spa_popular_bottom_left">
                {activeCityArea[0]?.areas[1]?.image_area ?(
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={activeCityArea[0]?.areas[1].image_area} alt="area image" />
                      <h3>{activeCityArea[0]?.areas[1]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="area image" />
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
                      onClick={handleScroll}
                    >
                      <img src={activeCityArea[0]?.areas[2]?.image_area} alt="area image" />
                      <h3>{activeCityArea[0]?.areas[2]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="area image" />
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
                {activeCityArea[0]?.areas[3]?.image_area? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={activeCityArea[0]?.areas[3]?.image_area} alt="area image" />
                      <h3>{activeCityArea[0]?.areas[3]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="area image" />
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
                      onClick={handleScroll}
                    >
                      <img src={activeCityArea[0]?.areas[4]?.image_area} alt="area image" />
                      <h3>{activeCityArea[0]?.areas[4]?.name}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="area image" />
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
                    onClick={handleScroll}
                  >
                    <img src={activeCityArea[0]?.areas[5]?.image_area} alt="area image" />
                    <h3>{activeCityArea[0]?.areas[5]?.name}</h3>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    style={{ width: "100%", height: "100%" }}
                    onClick={handleScroll}
                  >
                    <img src={image} alt="area image" />
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
