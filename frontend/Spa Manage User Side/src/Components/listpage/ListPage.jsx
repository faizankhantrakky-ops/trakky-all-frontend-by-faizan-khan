import React, { useEffect, useState } from "react";
import Hero from "../SpaPage/Hero/Hero";
import ListCard from "./listcard/ListCard";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";
import { useDispatch, useSelector } from "react-redux";

import { getNearByCoordinates } from "../functions/generalFun";
import { fetchNearBySpas } from "../../Store/nearbySlice";
import { fetchspasByCategoryAsync } from "../../Store/spaSlices";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const path = window.location.pathname.split("/").pop();

  const NavOptions = [
    {
      tag: "Nearby",
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
      tag: "Men Spas",
      link: "menspas",
    },
    {
      tag: "Women Spas",
      link: "womenspas",
    },
  ];

  let card = <></>;

  if (name == "nearby") {
    card = <NearBySpasListCard />;
  }

  if (name == "topRatedSpas") {
    card = <TopRatedspasListCard />;
  }

  if (name == "luxuriousSpas") {
    card = <LuxuriousSpasListCard />;
  }

  if (name == "beautySpas") {
    card = <BeautySpasListCard />;
  }

  if (name == "bodyMassageSpas") {
    card = <BodyMassageSpasListCard />;
  }

  if (name == "bodyMassageCenters") {
    card = <BodyMassageCentersListCard />;
  }

  if (name == "menSpas") {
    card = <MenSpasListCard />;
  }

  if (name == "womenSpas") {
    card = <WomenSpasListCard />;
  }

  return (
    <>
      <Hero />
      <div className="listpage-nav-links">
        <ul>
          {NavOptions.map((item, index) => {
            return (
              <li key={index} className={item.link == path ? "active" : ""}>
                <Link to={`/${params?.city}/${item.link}`}>{item.tag}</Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="listpage-heading">
        <h1> {title}</h1>
      </div>
      {
        <div className="listpage-offer-container">
          <OfferContainer />
        </div>
      }

      {React.cloneElement(card, { subtitle: subtitle })}

      <PopularArea />
      <Footer city={params?.city || "ahmedabad"} />
    </>
  );
};

export default ListPage;

const OfferContainer = () => {
  const [offersData, setOffersData] = useState([]);

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
    fetch(`https://backendapi.trakky.in/spas/offer/?city=${city}`, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOffer();
  }, [path, params?.city]);

  return (
    offersData.length > 0 &&
   ( <div
      className="slider__outer-container offer__container"
      style={{ width: "100%" }}
    >
      <div className="slider__header" style={{ margin: 0 }}>
        <h2>Grab the best deals</h2>
      </div>
      <Slider cardList={offersData} _name={"offer"} />
    </div>)
  );
};

const NearBySpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const nearBySpas = useSelector((state) => state.nearbySpas);

  const getData = async (viewmore = false) => {
    if (nearBySpas?.data.length == 0 || viewmore) {
      let latLong = await getNearByCoordinates(
        capitalizeAndFormat(params?.city).toLowerCase() || "ahmedabad"
      );
      dispatch(
        fetchNearBySpas({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: nearBySpas?.page,
        })
      );
    }
  };

  useEffect(() => {
    if (nearBySpas?.data.length == 0 || nearBySpas?.page != 1) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!nearBySpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {nearBySpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {nearBySpas?.isNextPage &&
        (!nearBySpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const TopRatedspasListCard = ({ subtitle }) => {
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
      {!topRatedSpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {topRatedSpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {topRatedSpas?.isNextPage &&
        (!topRatedSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const LuxuriousSpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const luxuriosSpas = useSelector((state) => state.luxuriosSpas);

  const getData = async (viewmore = false) => {
    if (
      luxuriosSpas?.city == null ||
      luxuriosSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      luxuriosSpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "luxurios",
          page: luxuriosSpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      luxuriosSpas?.data.length == 0 ||
      luxuriosSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!luxuriosSpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {luxuriosSpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {luxuriosSpas?.isNextPage &&
        (!luxuriosSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const BeautySpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const beautySpas = useSelector((state) => state.beautySpas);

  const getData = async (viewmore = false) => {
    if (
      beautySpas?.city == null ||
      beautySpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      beautySpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "beauty",
          page: beautySpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      beautySpas?.data.length == 0 ||
      beautySpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!beautySpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {beautySpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {beautySpas?.isNextPage &&
        (!beautySpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const BodyMassageSpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bodyMassageSpas = useSelector((state) => state.bodyMassageSpas);

  const getData = async (viewmore = false) => {
    if (
      bodyMassageSpas?.city == null ||
      bodyMassageSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bodyMassageSpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassage",
          page: bodyMassageSpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bodyMassageSpas?.data.length == 0 ||
      bodyMassageSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!bodyMassageSpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {bodyMassageSpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {bodyMassageSpas?.isNextPage &&
        (!bodyMassageSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const BodyMassageCentersListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bodyMassageCenters = useSelector((state) => state.bodyMassageCenters);

  const getData = async (viewmore = false) => {
    if (
      bodyMassageCenters?.city == null ||
      bodyMassageCenters?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bodyMassageCenters?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "bodyMassageCenters",
          page: bodyMassageCenters?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bodyMassageCenters?.data.length == 0 ||
      bodyMassageCenters?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!bodyMassageCenters.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {bodyMassageCenters.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {bodyMassageCenters?.isNextPage &&
        (!bodyMassageCenters.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const MenSpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const mensSpas = useSelector((state) => state.mensSpas);

  const getData = async (viewmore = false) => {
    if (
      mensSpas?.city == null ||
      mensSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      mensSpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "mens",
          page: mensSpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      mensSpas?.data.length == 0 ||
      mensSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!mensSpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {mensSpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {mensSpas?.isNextPage &&
        (!mensSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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

const WomenSpasListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const womensSpas = useSelector((state) => state.womensSpas);

  const getData = async (viewmore = false) => {
    if (
      womensSpas?.city == null ||
      womensSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      womensSpas?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchspasByCategoryAsync({
          category: "womens",
          page: womensSpas?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      womensSpas?.data.length == 0 ||
      womensSpas?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!womensSpas.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {womensSpas.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {womensSpas?.isNextPage &&
        (!womensSpas.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getData(true);
              }}
            >
              View More
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
