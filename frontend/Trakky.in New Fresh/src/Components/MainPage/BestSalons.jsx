import React, { useEffect, useState, useContext, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import heart_svg from "../../Assets/images/icons/heart_2.svg";
import Score_svg from "../../Assets/images/icons/score_svg.svg";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import AuthContext from "../../context/Auth";
import { capitalizeAndFormat } from "../functions/generalFun";

const BestSalons = ({ cities }) => {
  const [activeCity, setActiveCity] = useState();
  const [salonData, setSalonData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { userFavorites } = useContext(AuthContext);
  const controllerRef = useRef();

  const getSalons = async () => {
    setIsFetching(true);
    setHasError(false);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await Promise.race([
        fetch(
          `https://backendapi.trakky.in/salons/filter/?city=${activeCity}&page=1&verified=true`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal,
          }
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 15000)
        ),
      ]);

      const data = await response.json();

      if (response.ok) {
        setSalonData(data?.results || []);
        setHasError(false);
      } else {
        throw new Error("Server responded with error");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("Fetch error:", error);
        setHasError(true);
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (cities?.length > 0) {
      setActiveCity(cities[0]?.name);
    }
  }, [cities]);

  useEffect(() => {
    if (activeCity) {
      getSalons();
    }
  }, [activeCity]);

  const getOfferFormat = (custom_offer_tag, offer_tag) => {
    let offerFormat = "";
    let offerContent = "";

    if (custom_offer_tag == null) {
      offerContent = offer_tag;
      return { offerFormat, offerContent };
    }

    const offerParts = custom_offer_tag?.split(" ");
    if (offerParts?.[0] === "Get") {
      if (offerParts[1]?.endsWith("%")) {
        offerFormat = "percentage";
        offerContent = custom_offer_tag;
      } else if (offerParts[offerParts.length - 1] === "off") {
        offerFormat = "fixed-amount";
        offerContent = custom_offer_tag;
      } else {
        offerFormat = "fixed-amount-service";
        offerContent = custom_offer_tag;
      }
    } else {
      offerFormat = "service-price";
      offerContent = custom_offer_tag;
    }
    return { offerFormat, offerContent };
  };

  return (
    <div className="pt-5 lg:pt-10">
      <div className="mx-4 flex justify-between md:mx-10">
        <h2 className="text-xl font-semibold">
          Best salons in {capitalizeAndFormat(activeCity)?.toLowerCase() || ""}
        </h2>
      </div>

      <div className="mt-3 flex overflow-x-scroll gap-3 ml-4 md:ml-10 snap-x snap-proximity">
        {cities?.map((item, index) => (
          <button
            key={index}
            className={`py-3 px-5 rounded-lg text-sm font-semibold snap-start last:mr-4 md:last:mr-10 ${
              item?.name.toLowerCase() === activeCity?.toLowerCase()
                ? "text-white bg-gradient-to-r from-[#9B6DFC] to-[#5732CC]"
                : "border border-slate-800 border-solid"
            }`}
            onClick={() => setActiveCity(item?.name)}
            disabled={isFetching}
          >
            {item?.name}
          </button>
        ))}
      </div>

      <div className="N-Profile-page-suggested-salons snap-x snap-proximity ml-[5px] md:ml-[30px] md:mt-2">
        {isFetching ? (
          <div className="flex overflow-x-auto gap-[inherit] snap-x snap-proximity">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="N-Profile-page-saggested-salon-card snap-start first:!ml-0 last:!mr-4 md:last:!mr-10"
              >
                <div className="N-Profile-page-suggested-salon-card-img shadow rounded-2xl drop-shadow relative">
                  <Skeleton className="w-full rounded-2xl" height={180} />
                  <div className="absolute top-2 right-2 z-10 h-6 w-6">
                    <Skeleton circle height={24} width={24} />
                  </div>
                  <div className="offer-tag-p-s-s">
                    <Skeleton height={55} width={90} />
                  </div>
                </div>
                <div className="N-Profile-page-suggested-salon-card-content mt-2">
                  <Skeleton height={22} width="80%" />
                  <p className="N-P-S-S-score flex items-center gap-1 mt-2">
                    <Skeleton circle width={18} height={18} />
                    <Skeleton width={40} height={18} />
                  </p>
                  <Skeleton height={18} width="90%" className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="flex justify-center items-center h-40 flex-col gap-3">
            <h2 className="text-lg font-semibold text-red-600">Network Error</h2>
            <p className="text-sm text-gray-600">Please check your internet connection</p>
            <button
              onClick={getSalons}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : salonData?.length > 0 ? (
          <div className="flex overflow-x-auto gap-[inherit] snap-x snap-proximity">
            {salonData.map((item, index) => {
              const { offerFormat, offerContent } = getOfferFormat(
                item?.custom_offer_tag,
                item?.offer_tag
              );

              return (
                <Link
                  to={`/${encodeURIComponent(item?.city)}/${encodeURIComponent(
                    item?.area
                  )}/salons/${encodeURIComponent(item?.slug)}`}
                  className="N-Profile-page-saggested-salon-card snap-start first:!ml-0 last:!mr-4 md:last:!mr-10"
                  key={index}
                >
                  <div className="N-Profile-page-suggested-salon-card-img shadow rounded-2xl drop-shadow relative">
                    <img
                      src={item?.main_image}
                      alt="Best Salon In Ahmedabad For Beauty, Hair, And Bridal Services"
                    />
                    {!userFavorites?.some((item1) => item1?.salon === item?.id) ? (
                      <div className="absolute top-2 right-2 z-10 h-6 w-6">
                        <img
                          src={heart_svg}
                          alt="Add To Favorites"
                          className="h-full w-full !object-contain !rounded-none"
                        />
                      </div>
                    ) : (
                      <div className="absolute top-[5px] right-[6px] z-10 h-7 w-7">
                        <FcLike className="w-full h-full" />
                      </div>
                    )}
                    {item?.premium && (
                      <div className="premium_div-x absolute">
                        <div className="premium-text">Premium</div>
                      </div>
                    )}
                    <div className="offer-tag-p-s-s">
                      <span>
                        {offerFormat === "fixed-amount" ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="custom-offer-tag-text1">
                              {offerContent.split(" ")[0].toUpperCase()}
                            </span>
                            <span className="custom-offer-tag-text2">
                              {" "}
                              {offerContent.split(" ").slice(1).join(" ").toUpperCase()}
                            </span>
                          </div>
                        ) : offerFormat === "percentage" || offerFormat === "fixed-amount-service" ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="custom-offer-tag-text1">
                              {offerContent.split(" ")[0].toUpperCase()}
                            </span>
                            <span className="custom-offer-tag-text2">
                              {" "}
                              {offerContent.split(" ")[1].toUpperCase()} OFF
                            </span>
                            <span className="custom-offer-tag-text3 line-clamp-1">
                              {" "}
                              ON{" "}
                              {offerContent.split(" ").slice(4).join(" ").toUpperCase()}
                            </span>
                          </div>
                        ) : offerFormat === "service-price" ? (
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="custom-offer-tag-text1 line-clamp-1">
                              {offerContent.split(" ").slice(0, -2).join(" ").toUpperCase()}
                            </span>{" "}
                            <span className="custom-offer-tag-text2">
                              {offerContent.split(" ").slice(-2)[0].toUpperCase()}{" "}
                              {offerContent.split(" ").slice(-1)[0].toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="N-Profile-page-suggested-salon-card-content">
                    <h2>{item?.name}</h2>
                    <p className="N-P-S-S-score">
                      <img src={Score_svg} alt="Customer Review Score" />
                      <span>
                        {item?.avg_score ? String(item?.avg_score).slice(0, 3) : 0}
                      </span>
                    </p>
                    <p className="N-P-S-S-addr">
                      {item?.area} , {item?.city}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-28">
            <h2 className="text-lg font-semibold">No Salons Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSalons;