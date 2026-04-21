import React from "react";
import { Link , useParams } from "react-router-dom";

const TopSalonOfArea = ({
  // topDestinationsLocations,
  // topSalonOfPopularArea,
  // setActive,
  // active,
  topSalonOfPopularArea
}) => {

  const params = useParams();

  const [active , setActive] = React.useState(0);

  return (
    <div>
      <div className="top-destinations__container overflow-hidden">
        <div className="top-destinations__header">
          <h2>Top Salons {params?.city ? "In " + params.city.charAt(0).toUpperCase() + params.city.slice(1) : ""}</h2>
          <p>Checkout the list of best salons {params?.city ? "In " + params.city.charAt(0).toUpperCase() + params.city.slice(1) : ""}</p>
          <div style={{ overflow: 'hidden' }}>
  <div
    className="top-dest-tag-outer"
    style={{
      width: "fit-content",
      maxWidth: "100vw",
      margin: "auto",
      overflowX: "scroll",
      paddingBottom: '30px', // Add space for the scrollbar
      marginBottom: '-30px', // Push the scrollbar out of view
    }}
  >
    <div className="top-destinations__tags">
      {/* Location tags */}
      {topSalonOfPopularArea?.map((location, index) => {
        return (
          <li
            onClick={() => {
              setActive(index);
            }}
            style={{
              color: active === index ? "white" : "#2D3134",
              backgroundColor: active === index ? "#2D3134" : "",
            }}
            key={index}
          >
            {location?.area}
          </li>
        );
      })}
    </div>
  </div>
</div>
        </div>
      </div>

      {topSalonOfPopularArea.length > 0 && (
        <div className="spa_popular_area_container">
          <div className="spa_popular_area_left">
            <div className="spa_popular_top">
              <Link
                to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                style={{ width: "100%", height: "100%" }}
              >
                <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
              </Link>
              <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
            </div>
            <div className="spa_popular_bottom">
              <div className="spa_popular_bottom_left">
                {topSalonOfPopularArea[active].salons[1]?.slug ? (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[1].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[1].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[1]?.main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[1]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
                  </>
                )}
              </div>
              <div className="spa_popular_bottom_right">
                {topSalonOfPopularArea[active].salons[2]?.slug ? (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[2].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[2].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[2]?.main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[2]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="spa_popular_area_right">
            <div className="spa_popular_tight_top">
              <div className="spa_popular_top_left">
                {topSalonOfPopularArea[active].salons[3]?.slug ? (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[3].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[3].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[3]?.main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[3]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
                  </>
                )}
              </div>
              <div className="spa_popular_top_right">
                {topSalonOfPopularArea[active].salons[4]?.slug ? (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[4].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[4].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[4]?.main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[4]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
                    </Link>
                    <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
                  </>
                )}
              </div>
            </div>
            <div className="spa_popular_right_bottom">
              {topSalonOfPopularArea[active].salons[5]?.slug ? (
                <>
                  <Link
                    to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[5].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[5].slug}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <img src={topSalonOfPopularArea[active].salons[5]?.main_image} alt="" />
                  </Link>
                  <h3>{topSalonOfPopularArea[active].salons[5]?.name}</h3>
                </>
              ) : (
                <>
                  <Link
                    to={`/${encodeURIComponent(params.city.toLowerCase())}/${encodeURIComponent(topSalonOfPopularArea[active].salons[0].area.toLowerCase())}/salons/${topSalonOfPopularArea[active].salons[0].slug}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <img src={topSalonOfPopularArea[active].salons[0].main_image} alt="" />
                  </Link>
                  <h3>{topSalonOfPopularArea[active].salons[0]?.name}</h3>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSalonOfArea;
