import React, { useContext, useEffect, useState } from "react";
import "./listpagen.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Slider from "../Common/Slider/Slider";
import {
  capitalizeAndFormat,
  getCoordinateByCity,
} from "../functions/generalFun";

import { useSelector, useDispatch } from "react-redux";
import { fetchspasByCategoryAsync } from "../../Store/spaSlices";
import { fetchNearBySpas } from "../../Store/nearbySlice";
import FooterN from "../Common/Footer/FooterN";
import Header from "../Common/Navbar/Header";
// import OfferComponentN from "./OfferComponentN";
import OtherListCard from "./listcard/OtherListCard";
import AuthContext from "../../context/Auth";
import smallAndFormat from "../Common/functions/smallAndFormat";
import { Helmet } from "react-helmet";
// import { Helmet } from "react-helmet";

const ListPageSpaCate = ({ title, subtitle, name }) => {
  const params = useParams();

  const { location } = useContext(AuthContext);

  const path = window.location.pathname.split("/").pop();

  console.log("path", path);

  const [navOptions , setNavOptions] = useState([
    {
      tag: "Nearby Spas",
      link: "nearby",
    },
    {
      tag: "Top Rated Spas",
      link: "topratedspas",
    },
    {
      tag: "Luxurious Spas",
      link: "luxuriousspas",
    },
    {
      tag: "Beauty Spas",
      link: "beautyspas",
    },
    {
      tag: "Body Massage Spas",
      link: "bodyMassagespas",
    },
    {
      tag: "Body Massage Centers",
      link: "bodyMassagecenter",
    },
    {
      tag: "Spas for Men",
      link: "menspas",
    },
    {
      tag: "Spas for Women",
      link: "womenspas",
    },
    {
      tag: "Thai Body Massage",
      link: "thaimassage",
    },
    {
      tag: "Best Spas",
      link: "bestspas",
    },
  ]);


  let card = <></>;

  if (name == "nearby") {
    card = <NearBySpasListCard />;
  }
  if (name == "topRatedSpas") {
    card = <TopRatedSpasListCard />;
  }
  if (name == "luxuriousSpas") {
    card = <LuxuriousSpas />;
  }
  if (name == "beautySpas") {
    card = <BeautySpas />;
  }
  if (name == "bodyMassageSpas") {
    card = <BodyMassageSpa />;
  }
  if (name == "bodyMassageCenters") {
    card = <BodyMassageCenter />;
  }
  if (name == "menSpas") {
    card = <MensSpas />;
  }
  if (name == "womenSpas") {
    card = <WomensSpas />;
  }
  if (name == "thaiBodyMassage") {
    card = <ThaiBodyMassage />;
  }
  if (name == "bestSpas") {
    card = <BestSpas />;
  }


      

  // useEffect(() => { 

  //   let currentActiveOption = navOptions.find((item) => item.link == path);

  //   // unshift the current active option to the start of the array

  //   console.log("currentActiveOption", currentActiveOption);

  //   let temp = navOptions.filter((item) => item.link != path);

  //   temp.unshift(currentActiveOption);

  //   setNavOptions(temp);


  // }, [path] );

  return (
    <>
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        <div className="L-list-page-option-n-filter">
          {navOptions?.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item?.link == path
                    ? " !bg-[#512DC8] !text-white text-sm sort-box"
                    : "sort-box"
                }
              >
                <Link
                  to={`/${encodeURIComponent(params?.city)}/${item?.link}`}
                  className=" text-inherit"
                >
                  {item?.tag}
                </Link>
              </div>
            );
          })}
        </div>

        {/* <OfferComponentN title={"Grab The Best Offers"} /> */}

        {React.cloneElement(card, { subtitle: subtitle })}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default ListPageSpaCate;

const OfferContainer = React.memo(() => {
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const city = capitalizeAndFormat(params?.city);

  const path = window.location.pathname.split("/").pop();

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch(`https://backendapi.trakky.in/salons/offer/?city=${city}`, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOffer();
  }, [path, params?.city]);

  return (
    offersData?.length > 0 && (
      <div className="slider__outer-container offer__container">
        <div className="slider__header" style={{ margin: 0 }}>
          <h2 className="lp-offer-header">Grab the best deals</h2>
        </div>
        {!loading ? <Slider cardList={offersData} _name={"offer"} /> : <></>}
      </div>
    )
  );
});

const NearBySpasListCard = ({ subtitle }) => {
  const { location } = useContext(AuthContext);

  const params = useParams();
  const dispatch = useDispatch();
  const nearbyspas = useSelector((state) => state.nearbySpas);

  const getData = async (viewmore = false) => {
    console.log(nearbyspas);

    if (nearbyspas?.data.length == 0 || viewmore) {
      let latLong = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };

      if (latLong.latitude == 0 && latLong.longitude == 0) {
        latLong = await getCoordinateByCity(
          capitalizeAndFormat(params?.city).toLowerCase() || "ahmedabad"
        );
      }

      dispatch(
        fetchNearBySpas({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: nearbyspas?.page,
        })
      );
    }
  };

  useEffect(() => {
    if (nearbyspas?.data.length == 0 || nearbyspas?.page != 1) {
      console.log(nearbyspas?.data.length, nearbyspas?.page);
      getData();
    }
  }, [params?.city, location]);

  return (
    <>
      <Helmet>
        <title>List of Spas Near Me in {capitalizeAndFormat(params?.city)} - Trakky</title>
        <meta
          name="description"
          content={`Spas near me in ${capitalizeAndFormat(params?.city)}. Find Now Best Spas, Best Spa Therapies, Best Spas in ${capitalizeAndFormat(params?.city)}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Spas near me in ${capitalizeAndFormat(params?.city)} on Trakky.`}

        />
      
      </Helmet>
      {!nearbyspas?.loading && (
        <div className="N-listpage-heading">
          <h1> List of spas near me in {smallAndFormat(params?.city)} </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {nearbyspas?.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : nearbyspas?.data?.length > 0 ? (
          nearbyspas?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {nearbyspas?.isNextPage &&
        (!nearbyspas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const TopRatedSpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const topRatedSpas = useSelector((state) => state.topRatedSpas);

  const getData = async (viewmore = false) => {
    if (
      topRatedSpas?.city == null ||
      topRatedSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      topRatedSpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "topRated",
          page: topRatedSpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      topRatedSpas?.data.length == 0 ||
      topRatedSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>{`List of Top Rated Spas in ${capitalizeAndFormat(
          params?.city
        )} - Trakky`}</title>
        <meta
          name="description"
          content={`Best Top Rated Spas in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Top Rated Spas, Top Rated Spa Therapies, Top Rated Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Top Rated Spas near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
      </Helmet>
      {!topRatedSpas.loading && (
        <div className="N-listpage-heading">
          <h1> List of top rated spas in {smallAndFormat(params?.city)} </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {topRatedSpas.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : topRatedSpas?.data?.length > 0 ? (
          topRatedSpas?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {topRatedSpas?.isNextPage &&
        (!topRatedSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const LuxuriousSpas = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const luxuriousSpa = useSelector((state) => state.luxuriosSpas);

  const getData = async (viewmore = false) => {
    if (
      luxuriousSpa?.city == null ||
      luxuriousSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      luxuriousSpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "luxurios",
          page: luxuriousSpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      luxuriousSpa?.data.length == 0 ||
      luxuriousSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>{`List of Luxurious Spas in ${capitalizeAndFormat(
          params?.city
        )} - Trakky`}</title>
        <meta
          name="description"
          content={`Best Luxurious Spas in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Luxurious Spas, Luxurious Spa Therapies, Luxurious Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Luxurious Spas near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
      </Helmet>
      {!luxuriousSpa.loading && (
        <div className="N-listpage-heading">
          <h1> List of luxurious spas in {smallAndFormat(params?.city)} </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {luxuriousSpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : luxuriousSpa?.data?.length > 0 ? (
          luxuriousSpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {luxuriousSpa?.isNextPage &&
        (!luxuriousSpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const BeautySpas = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const beautySpa = useSelector((state) => state.beautySpas);

  const getData = async (viewmore = false) => {
    if (
      beautySpa?.city == null ||
      beautySpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      beautySpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "beauty",
          page: beautySpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      beautySpa?.data.length == 0 ||
      beautySpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>{`Best Beauty Spas in ${capitalizeAndFormat(
          params?.city
        )} - Trakky`}</title>
        <meta
          name="description"
          content={`Best Beauty Spas in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Beauty Spas, Spa Therapies, Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Beauty Spas near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
        <meta
          name="keywords"
          content={`Beauty spas near me, spa near me, best spa near me, spa in ${capitalizeAndFormat(
            params?.city
          )} with trakky`}
        />
      </Helmet>
      {!beautySpa.loading && (
        <div className="N-listpage-heading">
          <h1>List of best beauty spas in {smallAndFormat(params?.city)} </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {beautySpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : beautySpa?.data?.length > 0 ? (
          beautySpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {beautySpa?.isNextPage &&
        (!beautySpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const BodyMassageSpa = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bodymassagespa = useSelector((state) => state.bodyMassageSpas);

  const getData = async (viewmore = false) => {
    if (
      bodymassagespa?.city == null ||
      bodymassagespa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bodymassagespa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassage",
          page: bodymassagespa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bodymassagespa?.data.length == 0 ||
      bodymassagespa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          Best Body Massage Spas in {smallAndFormat(params?.city)} - Trakky
        </title>
        <meta
          name="description"
          content={`Best Body Massage Spas in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Body Massage Spas,  Body Massage Spa Therapies, Body Massage Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Body Massage Spas near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
        <meta
          name="keywords"
          content={`Best Body Massage Spas, spa near me, best spa near me, spa in ${capitalizeAndFormat(
            params?.city
          )} with trakky`}
        />
      </Helmet>
      {!bodymassagespa.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of best body massage spas in {smallAndFormat(
              params?.city
            )}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {bodymassagespa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : bodymassagespa?.data?.length > 0 ? (
          bodymassagespa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {bodymassagespa?.isNextPage &&
        (!bodymassagespa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const BodyMassageCenter = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bodyMassageCenter = useSelector((state) => state.bodyMassageCenters);

  const getData = async (viewmore = false) => {
    if (
      bodyMassageCenter?.city == null ||
      bodyMassageCenter?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bodyMassageCenter?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassageCenters",
          page: bodyMassageCenter?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bodyMassageCenter?.data.length == 0 ||
      bodyMassageCenter?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          Best Body Massage centers in {capitalizeAndFormat(params?.city)} -
          Trakky
        </title>
        <meta
          name="description"
          content={`Best Body Massage centers in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Body Massage centers, Body Massage Center Therapies, Body Massage Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Body Massage Centers near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
        <meta
          name="keywords"
          content={`Best Body Massage centers, spa near me, best spa near me, spa in ${capitalizeAndFormat(
            params?.city
          )} with trakky`}
        />
      </Helmet>

      {!bodyMassageCenter.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of best body massage centers in{" "}
            {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {bodyMassageCenter.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : bodyMassageCenter?.data?.length > 0 ? (
          bodyMassageCenter?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {bodyMassageCenter?.isNextPage &&
        (!bodyMassageCenter.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const MensSpas = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const mensSpa = useSelector((state) => state.mensSpas);

  const getData = async (viewmore = false) => {
    if (
      mensSpa?.city == null ||
      mensSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      mensSpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "mens",
          page: mensSpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      mensSpa?.data.length == 0 ||
      mensSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          Best Spas for Men in {capitalizeAndFormat(params?.city)} - Trakky
        </title>
        <meta
          name="description"
          content={`Best Spas for Men in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Spas for Men, Body Massage Center Therapies, Body Spas for Men in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Spas for Men near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
      </Helmet>

      {!mensSpa.loading && (
        <div className="N-listpage-heading">
          <h1>List of best spas for men in {smallAndFormat(params?.city)}</h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {mensSpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : mensSpa?.data?.length > 0 ? (
          mensSpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {mensSpa?.isNextPage &&
        (!mensSpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const WomensSpas = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const womensSpa = useSelector((state) => state.womensSpas);

  const getData = async (viewmore = false) => {
    if (
      womensSpa?.city == null ||
      womensSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      womensSpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "womens",
          page: womensSpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      womensSpa?.data.length == 0 ||
      womensSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          List of Best Spas for Women in {capitalizeAndFormat(params?.city)} -
          Trakky
        </title>
        <meta
          name="description"
          content={`Best Spas for Women in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Spas for Women, Body Massage Center Therapies, Body Spas for Women in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Spas for Women near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
        <meta
          name="keywords"
          content={`Spas for Women, spa near me, best spa near me, spa in ${smallAndFormat(
            params?.city
          )} with trakky`}
        />
      </Helmet>
      {!womensSpa.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of best spas for womens in {smallAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {womensSpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : womensSpa?.data?.length > 0 ? (
          womensSpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No Spa found</div>
        )}
      </div>
      {womensSpa?.isNextPage &&
        (!womensSpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const BestSpas = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bestSpa = useSelector((state) => state.bestSpas);

  const getData = async (viewmore = false) => {
    if (
      bestSpa?.city == null ||
      bestSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bestSpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "best",
          page: bestSpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bestSpa?.data.length == 0 ||
      bestSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          List of Best spas in {capitalizeAndFormat(params?.city)} - Trakky
        </title>
        <meta
          name="description"
          content={`Best spas in ${capitalizeAndFormat(params?.city)}. Find Now Best Spas, Best Spa Therapies, Best Spas in ${capitalizeAndFormat(params?.city)}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Spas near me in ${capitalizeAndFormat(params?.city)} on Trakky.`}
        />
      
      </Helmet>
      {!bestSpa.loading && (
        <div className="N-listpage-heading">
          <h1> List of best spas in {smallAndFormat(params?.city)} </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {bestSpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : bestSpa?.data?.length > 0 ? (
          bestSpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {bestSpa?.isNextPage &&
        (!bestSpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};

const ThaiBodyMassage = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const thaiBodyMassageSpa = useSelector((state) => state.thaiBodyMassage);

  const getData = async (viewmore = false) => {
    if (
      thaiBodyMassageSpa?.city == null ||
      thaiBodyMassageSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      thaiBodyMassageSpa?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "thaiBodyMassage",
          page: thaiBodyMassageSpa?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      thaiBodyMassageSpa?.data.length == 0 ||
      thaiBodyMassageSpa?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>
          List of Best Thai Massage centers in{" "}
          {capitalizeAndFormat(params?.city)} - Trakky
        </title>
        <meta
          name="description"
          content={`Best Thai Massage Spas in ${capitalizeAndFormat(
            params?.city
          )}. Find Now Thai Massage Spas,  Thai Massage Spa Therapies, Thai Massage Spa Centres in ${capitalizeAndFormat(
            params?.city
          )}. Get Phone Numbers, Address, Reviews, Photos, Maps for Best Thai Massage Spas near me in ${capitalizeAndFormat(
            params?.city
          )} on Trakky.`}
        />
        <meta
          name="keywords"
          content={`Best thai massage, spa near me, best spa near me, spa in ${capitalizeAndFormat(
            params?.city
          )} with trakky`}
        />
      </Helmet>
      {!thaiBodyMassageSpa.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of best thai massage centers in {smallAndFormat(
              params?.city
            )}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {thaiBodyMassageSpa.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : thaiBodyMassageSpa?.data?.length > 0 ? (
          thaiBodyMassageSpa?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No spa found</div>
        )}
      </div>
      {thaiBodyMassageSpa?.isNextPage &&
        (!thaiBodyMassageSpa.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More spa
            </button>
          </div>
        ) : (
          <div className="lp-load-more">
            <div className="lp-loader"></div>
          </div>
        ))}
    </>
  );
};
