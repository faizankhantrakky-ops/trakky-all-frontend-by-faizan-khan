import React, { useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import Hero from "../SalonPage/Hero/Hero";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";

import { getNearByCoordinates } from "../functions/generalFun";

import { useSelector, useDispatch } from "react-redux";
import { fetchSalonsByCategoryAsync } from "../../Store/salonSlices";
import { fetchNearBySalons } from "../../Store/nearbySlice";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const path = window.location.pathname.split("/").pop();

  const NavOptions = [
    {
      tag: "Nearby",
      link: "nearby",
    },
    {
      tag: "Top Rated Salons",
      link: "topratedsalons",
    },
    {
      tag: "Bridal Salons",
      link: "bridalsalons",
    },
    {
      tag: "Unisex Salons",
      link: "unisexsalons",
    },
    {
      tag: "Kids Salons",
      link: "childrenspecialsalon",
    },
    {
      tag: "Female Beauty Parlour",
      link: "femalebeautyparlour",
    },
    {
      tag: "Academy Salons",
      link: "academysalons",
    },
    {
      tag: "Makeup Salons",
      link: "makeupsalons",
    },
  ];

  let card = <></>;

  if (name == "nearby") {
    card = <NearBySalonsListCard />;
  }
  if (name == "topRatedSalons") {
    card = <TopRatedsalonsListCard />;
  }
  if (name == "bridalSalons") {
    card = <BridalSalonsListCard />;
  }
  if (name == "unisexSalons") {
    card = <UnisexSalonsListCard />;
  }
  if (name == "childrenspecialsalon") {
    card = <childrenspecialsalonListCard />;
  }
  if (name == "femaleBeautyParlour") {
    card = <FemaleBeautyParlourListCard />;
  }
  if (name == "academySalons") {
    card = <AcademySalonsListCard />;
  }
  if (name == "makeupSalons") {
    card = <MakeupSalonsListCard />;
  }

  return (
    <>
      <Hero />
      <div className="listpage-nav-links">
        <ul>
          {NavOptions.map((item, index) => {
            return (
              <li key={index} className={item.link == path ? "active" : ""}>
                <Link to={`/${encodeURIComponent(params?.city)}/${item.link}`}>
                  {item.tag}
                </Link>
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

const NearBySalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const nearBySalons = useSelector((state) => state.nearBySalons);

  const getData = async (viewmore = false) => {
    if (nearBySalons?.data.length == 0 || viewmore) {
      let latLong = await getNearByCoordinates(
        capitalizeAndFormat(params?.city).toLowerCase() || "ahmedabad"
      );
      dispatch(
        fetchNearBySalons({
          latitude: latLong.latitude,
          longitude: latLong.longitude,
          page: nearBySalons?.page,
        })
      );
    }
  };

  useEffect(() => {
    if (nearBySalons?.data.length == 0 || nearBySalons?.page != 1) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!nearBySalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {nearBySalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {nearBySalons?.isNextPage &&
        (!nearBySalons.loading ? (
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

const TopRatedsalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const topRatedSalons = useSelector((state) => state.topRatedSalons);

  const getData = async (viewmore = false) => {
    if (
      topRatedSalons?.city == null ||
      topRatedSalons?.city.toLowerCase() !==
        capitalizeAndFormat(params?.city).toLowerCase() ||
      topRatedSalons?.page === 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "topRated",
          page: topRatedSalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      topRatedSalons?.data.length === 0 ||
      topRatedSalons?.city.toLowerCase() !==
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!topRatedSalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {topRatedSalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {topRatedSalons?.isNextPage &&
        (!topRatedSalons.loading ? (
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

const BridalSalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const bridalSalons = useSelector((state) => state.bridalSalons);

  const getData = async (viewmore = false) => {
    if (
      bridalSalons?.city == null ||
      bridalSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      bridalSalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "bridal",
          page: bridalSalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      bridalSalons?.data.length == 0 ||
      bridalSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!bridalSalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {bridalSalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {bridalSalons?.isNextPage &&
        (!bridalSalons.loading ? (
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

const UnisexSalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const unisexSalons = useSelector((state) => state.unisexSalons);

  const getData = async (viewmore = false) => {
    if (
      unisexSalons?.city == null ||
      unisexSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      unisexSalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "unisex",
          page: unisexSalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      unisexSalons?.data.length == 0 ||
      unisexSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!unisexSalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {unisexSalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {unisexSalons?.isNextPage &&
        (!unisexSalons.loading ? (
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

const childrenspecialsalonListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const kidsSalons = useSelector((state) => state.kidsSalons);

  const getData = async (viewmore = false) => {
    if (
      kidsSalons?.city == null ||
      kidsSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      kidsSalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "kids",
          page: kidsSalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      kidsSalons?.data.length == 0 ||
      kidsSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!kidsSalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {kidsSalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {kidsSalons?.isNextPage &&
        (!kidsSalons.loading ? (
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

const FemaleBeautyParlourListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const femaleBeautySalons = useSelector((state) => state.femaleBeautySalons);

  const getData = async (viewmore = false) => {
    if (
      femaleBeautySalons?.city == null ||
      femaleBeautySalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      femaleBeautySalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "femaleBeauty",
          page: femaleBeautySalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      femaleBeautySalons?.data.length == 0 ||
      femaleBeautySalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!femaleBeautySalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {femaleBeautySalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {femaleBeautySalons?.isNextPage &&
        (!femaleBeautySalons.loading ? (
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

const AcademySalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const academySalons = useSelector((state) => state.academySalons);

  const getData = async (viewmore = false) => {
    if (
      academySalons?.city == null ||
      academySalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      academySalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "academy",
          page: academySalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      academySalons?.data.length == 0 ||
      academySalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!academySalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {academySalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {academySalons?.isNextPage &&
        (!academySalons.loading ? (
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

const MakeupSalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const makeupSalons = useSelector((state) => state.makeupSalons);

  const getData = async (viewmore = false) => {
    if (
      makeupSalons?.city == null ||
      makeupSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase() ||
      makeupSalons?.page == 1 ||
      viewmore
    ) {
      dispatch(
        fetchSalonsByCategoryAsync({
          category: "makeup",
          page: makeupSalons?.page,
          city: capitalizeAndFormat(params?.city),
        })
      );
    }
  };

  useEffect(() => {
    if (
      makeupSalons?.data.length == 0 ||
      makeupSalons?.city.toLowerCase() !=
        capitalizeAndFormat(params?.city).toLowerCase()
    ) {
      getData();
    }
  }, [params?.city]);

  return (
    <>
      {!makeupSalons.loading && (
        <div className="listpage-sub-heading">
          <h2>{subtitle}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {makeupSalons.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {makeupSalons?.isNextPage &&
        (!makeupSalons.loading ? (
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
