import React, { useEffect, useState } from "react";
import image from "../../../Assets/images/salon/salon-image1.png";
import { Link } from "react-router-dom";

const TopAreaOfCity = ({ cityname, areas }) => {
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
                    onClick={() => {
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
                <img src={image} alt="" />
                <h3>{activeCityArea[0]?.areas[0]}</h3>
              </Link>
            </div>
            <div className="spa_popular_bottom">
              <div className="spa_popular_bottom_left">
                {activeCityArea[0]?.areas[1] ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[1]}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]}</h3>
                    </Link>
                  </>
                )}
              </div>
              <div className="spa_popular_bottom_right">
                {activeCityArea[0]?.areas[2] ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[2]}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]}</h3>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="spa_popular_area_right">
            <div className="spa_popular_tight_top">
              <div className="spa_popular_top_left">
                {activeCityArea[0]?.areas[3] ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[3]}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]}</h3>
                    </Link>
                  </>
                )}
              </div>
              <div className="spa_popular_top_right">
                {activeCityArea[0]?.areas[4] ? (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[4]}</h3>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      style={{ width: "100%", height: "100%" }}
                      onClick={handleScroll}
                    >
                      <img src={image} alt="" />
                      <h3>{activeCityArea[0]?.areas[0]}</h3>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="spa_popular_right_bottom">
              {activeCityArea[0]?.areas[5] ? (
                <>
                  <Link
                    style={{ width: "100%", height: "100%" }}
                    onClick={handleScroll}
                  >
                    <img src={image} alt="" />
                    <h3>{activeCityArea[0]?.areas[5]}</h3>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    style={{ width: "100%", height: "100%" }}
                    onClick={handleScroll}
                  >
                    <img src={image} alt="" />
                    <h3>{activeCityArea[0]?.areas[0]}</h3>
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

export default TopAreaOfCity;
