import React, { useEffect, useState } from "react";
import { Link , useParams } from "react-router-dom";
import "./populararea.css";
import smallAndFormat from "../../Common/functions/smallAndFormat";

const PopularArea = () => {

  const params = useParams();

  let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  city = city.replace(/-/g, " ");
  city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  
  const [areas, setAreas] = useState(null);
  const [showAllAreas, setShowAllAreas] = useState(false);


  const getAreas = async () => {
    await fetch(`https://backendapi.trakky.in/spas/city/?name=${city}`)
      .then((res) => res.json())
      .then((data) => {
        setAreas(data.payload[0].area_names);
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
        <div className="popular-area-section !mt-5 md:!mt-6 lg:!mt-10">
          <div className="popular-area-header">
            <h2 className=" !text-xl md:!text-2xl font-semibold">
              List of best spas in {smallAndFormat(params?.city)}
            </h2>
          </div>
          <div className="popular-area-body">
            {areas &&
              areas
                .slice(
                  0,
                  showAllAreas ? areas.length : Math.min(6, areas.length)
                )
                .map((area, index) => {
                  return (
                    <Link to={`/${city.toLowerCase().replaceAll(' ','-')}/spas/${area.toLowerCase().replaceAll(' ','-')}`} > 
                      <div className="popular-area-item" key={index}>
                        <div className="item-area">Spas in {area}</div>
                        <div className="item-city">{city}</div>
                      </div>
                    </Link>
                  );
                })}
          </div>
          {!showAllAreas && areas.length > 6 && (
            <button className="show-more-button" onClick={handleShowMore}>
              Show More
            </button>
          )}
          {
            showAllAreas && (
              <button className="show-more-button" onClick={() => setShowAllAreas(false)}>
                Show Less
              </button>
            ) 
          }
        </div>
      )}
    </>
  );
};

export default PopularArea;
