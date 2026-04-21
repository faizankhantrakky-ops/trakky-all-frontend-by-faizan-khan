import React from "react";
import { Link , useParams} from "react-router-dom";

const TopspaOfArea = ({topspaOfPopularArea}) => {
    const params = useParams();

    const [active , setActive] = React.useState(0);
  
  return (
    <div>
      <div className="top-destinations__container">
        <div className="top-destinations__header">
          <h2>Top spas {params?.city && "In " + params?.city.charAt(0).toUpperCase() + params?.city.slice(1)}</h2>
          <p>Checkout the list of best spas {params?.city && "In " + params?.city.charAt(0).toUpperCase() + params?.city.slice(1) } </p>
          <div className="top-dest-tag-outer" style={{width:"fit-content",maxWidth:"100vw",margin:"auto",overflowX:"scroll"}}> 
          <div className="top-destinations__tags over">
              {/* Location tags */}
              {topspaOfPopularArea?.map((location, index) => {
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

      {topspaOfPopularArea.length > 0 && (
        <div className="spa_popular_area_container">
          <div className="spa_popular_area_left">
            <div className="spa_popular_top">
              <Link
                to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                style={{ width: "100%", height: "100%" }}
              >
                <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
              </Link>
              <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
            </div>
            <div className="spa_popular_bottom">
              <div className="spa_popular_bottom_left">
                {topspaOfPopularArea[active].spas[1]?.slug ? (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[1].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[1].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[1]?.main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[1]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
                  </>
                )}
              </div>
              <div className="spa_popular_bottom_right">
                {topspaOfPopularArea[active].spas[2]?.slug ? (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[2].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[2].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[2]?.main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[2]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="spa_popular_area_right">
            <div className="spa_popular_tight_top">
              <div className="spa_popular_top_left">
                {topspaOfPopularArea[active].spas[3]?.slug ? (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[3].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[3].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[3]?.main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[3]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
                  </>
                )}
              </div>
              <div className="spa_popular_top_right">
                {topspaOfPopularArea[active].spas[4]?.slug ? (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[4].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[4].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[4]?.main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[4]?.name}</h3>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
                    </Link>
                    <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
                  </>
                )}
              </div>
            </div>
            <div className="spa_popular_right_bottom">
              {topspaOfPopularArea[active].spas[5]?.slug ? (
                <>
                  <Link
                    to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[5].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[5].slug}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <img src={topspaOfPopularArea[active].spas[5]?.main_image} alt="spa image" />
                  </Link>
                  <h3>{topspaOfPopularArea[active].spas[5]?.name}</h3>
                </>
              ) : (
                <>
                  <Link
                    to={`/${params.city.toLowerCase().replaceAll(" ", "-")}/${topspaOfPopularArea[active].spas[0].area.toLowerCase().replaceAll(" ", "-")}/spas/${topspaOfPopularArea[active].spas[0].slug}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <img src={topspaOfPopularArea[active].spas[0].main_image} alt="spa image" />
                  </Link>
                  <h3>{topspaOfPopularArea[active].spas[0]?.name}</h3>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopspaOfArea;
