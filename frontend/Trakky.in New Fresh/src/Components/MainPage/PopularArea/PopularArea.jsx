import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./populararea.css";

const PopularArea = () => {
  const params = useParams();

  const [areas, setAreas] = useState(null);
  const [showAllAreas, setShowAllAreas] = useState(false);

  const city = params?.city;

  const getAreas = async () => {
    await fetch(`https://backendapi.trakky.in/salons/city/?name=${city}`)
      .then((res) => res.json())
      .then((data) => {
        setAreas(data.payload[0]?.area_names);
      });
  };

  useEffect(() => {
    getAreas();
  }, [city]);

  const handleShowMore = () => {
    setShowAllAreas(true);
  };

  return (
    <>
      {areas && (
        <div className="popular-area-section">
          <div className="popular-area-header">
            <h2>
              List Of Best Salons In{" "}
              {city.charAt(0).toUpperCase() + city.slice(1)}
            </h2>
          </div>
          <div className="popular-area-body">
            {areas &&
              areas
                .slice(
                  0,
                  showAllAreas ? areas.length : Math.min(12, areas.length)
                )
                .map((area, index) => {
                  return (
                    <Link
                      to={`/${encodeURIComponent(
                        city
                      )}/salons/${encodeURIComponent(area.toLowerCase())}`}
                    >
                      <div className="popular-area-item" key={index}>
                        <div className="item-area">Salons in {area}</div>
                        <div className="item-city">{city}</div>
                      </div>
                    </Link>
                  );
                })}
          </div>
          {!showAllAreas && areas.length > 12 && (
            <button className="show-more-button" onClick={handleShowMore}>
              Show More
            </button>
          )}
          {showAllAreas && (
            <button
              className="show-more-button"
              onClick={() => setShowAllAreas(false)}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default PopularArea;