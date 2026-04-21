import React, { useContext, useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import Hero from "../SalonPage/Hero/Hero";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import {
  capitalizeAndFormat,
  getCoordinateByCity,
} from "../functions/generalFun";

import { useSelector, useDispatch } from "react-redux";
import { fetchSalonsByCategoryAsync } from "../../Store/salonSlices";
import { fetchNearBySalons } from "../../Store/nearbySlice";
import FooterN from "../Common/Footer/FooterN";
import Header from "../Common/Navbar/Header";
import OfferComponentN from "./OfferComponentN";
import OtherListCard from "./listCard/OtherListCard";
import AuthContext from "../../context/Auth";
import { Helmet} from "react-helmet";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const { location } = useContext(AuthContext);

  const path = window.location.pathname.split("/").pop();

  console.log("path", path);

  const NavOptions = [
    {
      tag: "Nearby Salons",
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
      link: "kidsspecialsalons",
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

  const reorderedNavOptions = React.useMemo(() => {
    if (!path) return NavOptions;

    const selectedIndex = NavOptions.findIndex(
      (option) => option.link === path
    );

    if (selectedIndex === -1) return NavOptions;

    return [
      NavOptions[selectedIndex],
      ...NavOptions.slice(0, selectedIndex),
      ...NavOptions.slice(selectedIndex + 1),
    ];
  }, [path]);

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
  if (name == "kidsSpecialSalons") {
    card = <KidsSpecialSalonsListCard />;
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
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        <div className="L-list-page-option-n-filter">
          {reorderedNavOptions.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item.link == path
                    ? " !bg-[#512DC8] !text-white text-sm sort-box"
                    : "sort-box"
                }
              >
                <Link
                  to={`/${encodeURIComponent(params?.city)}/${item.link}`}
                  className=" text-inherit"
                >
                  {item.tag}
                </Link>
              </div>
            );
          })}
        </div>

        <OfferComponentN title={"Grab The Best Offers"} />

        {React.cloneElement(card, { subtitle: subtitle })}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
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
  const { location } = useContext(AuthContext);

  const params = useParams();
  const dispatch = useDispatch();
  const nearBySalons = useSelector((state) => state.nearBySalons);

  const getData = async (viewmore = false) => {
    if (nearBySalons?.data.length === 0 || viewmore) {
      let latLong = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };

      if (latLong.latitude === 0 && latLong.longitude === 0) {
        latLong = await getCoordinateByCity(
          capitalizeAndFormat(params?.city).toLowerCase() || "Ahmedabad"
        );
      }

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
    if (nearBySalons?.data.length === 0 || nearBySalons?.page !== 1) {
      getData();
    }
  }, [params?.city, location]);

  return (
    <>
      <Helmet>
        <title>Book trusted salons near you only on trakky</title>
        <meta
          name="description"
          content={`Book trusted & best salon services with trakky near you with best exclusive offers available on trakky.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/nearby`}
        />
      </Helmet>
      {!nearBySalons.loading && (
        <div className="N-listpage-heading">
          <h1> Salons near you </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {nearBySalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : nearBySalons?.data?.length > 0 ? (
          nearBySalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
      <Helmet>
        <title>{`${capitalizeAndFormat(
          params?.city
        )} Top Rated Salons Expert Beauty & Hair Services`}</title>
        <meta
          name="description"
          content={`Are you looking for top rated salon in ${capitalizeAndFormat(
            params?.city
          )}? your search results are here! Book salon services in top rated salons of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/topratedsalons`}
        />
      </Helmet>
      {!topRatedSalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of top rated salons in {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {topRatedSalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : topRatedSalons?.data?.length > 0 ? (
          topRatedSalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
      <Helmet>
        <title>{`Top Bridal Salons in ${capitalizeAndFormat(
          params?.city
        )} Best Bridal Makeup & Hair`}</title>
        <meta
          name="description"
          content={`Are you looking for bridal salon in ${capitalizeAndFormat(
            params?.city
          )}? Checkout best bridal salons here, Book bridal services in top bridal salons of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/bridalsalons`}
        />
      </Helmet>
      {!bridalSalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of bridal salons in {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {bridalSalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : bridalSalons?.data?.length > 0 ? (
          bridalSalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
    dispatch(
      fetchSalonsByCategoryAsync({
        category: "unisex",
        page: viewmore ? unisexSalons?.page : 1, // Reset to page 1 if not viewmore
        city: capitalizeAndFormat(params?.city),
      })
    );
  };

  useEffect(() => {
    // Always refresh data when city changes
    getData();
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>{`Top Unisex Salons ${capitalizeAndFormat(
          params?.city
        )} Best Hair & Beauty`}</title>
        <meta
          name="description"
          content={`Are you looking for best unisex salon in ${capitalizeAndFormat(
            params?.city
          )}? Checkout best bridal salons here, Book salon services in best unisex salons of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/unisexsalons`}
        />
      </Helmet>
      {!unisexSalons.loading && (
        <div className="N-listpage-heading">
          <h1>List of unisex salons in {capitalizeAndFormat(params?.city)}</h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {unisexSalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : unisexSalons?.data?.length > 0 ? (
          unisexSalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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

const KidsSpecialSalonsListCard = ({ subtitle }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const kidsSalons = useSelector((state) => state.kidsSalons);

  const getData = async (viewmore = false) => {
    dispatch(
      fetchSalonsByCategoryAsync({
        category: "kids",
        page: viewmore ? kidsSalons?.page : 1, // Reset to page 1 if not viewmore
        city: capitalizeAndFormat(params?.city),
      })
    );
  };

  useEffect(() => {
    // Always refresh data when city changes
    getData();
  }, [params?.city]);

  return (
    <>
      <Helmet>
        <title>{`Best Kids Salons in ${capitalizeAndFormat(
          params?.city
        )} Haircuts & Styling `}</title>
        <meta
          name="description"
          content={`Are you looking for best kids salon in ${capitalizeAndFormat(
            params?.city
          )}? Checkout best kids salons here, Book salon services in best kids special salons of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/kidsspecialsalons/`}
        />
      </Helmet>
      {!kidsSalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            List of best kids salons in {capitalizeAndFormat(params?.city)}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {kidsSalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : kidsSalons?.data?.length > 0 ? (
          kidsSalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
      <Helmet>
        <title>{`Best Female Beauty Parlours in ${capitalizeAndFormat(
          params?.city
        )} Top Beauty Care`}</title>
        <meta
          name="description"
          content={`Are you looking for female beauty parlours in ${capitalizeAndFormat(
            params?.city
          )}? Checkout female beauty parlours here, Book female beauty parlours services in female beauty parlours of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/femalebeautyparlour/`}
        />
      </Helmet>

      {!femaleBeautySalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of female beauty parlours in{" "}
            {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {femaleBeautySalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : femaleBeautySalons?.data?.length > 0 ? (
          femaleBeautySalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
      <Helmet>
        <title>{`Top Salon Academies in ${capitalizeAndFormat(
          params?.city
        )} Hair & Beauty Training`}</title>
        <meta
          name="description"
          content={`Are you looking for best salon academy in ${capitalizeAndFormat(
            params?.city
          )}? Checkout best salon academy here, Select salon academy course in best salon academy of ${capitalizeAndFormat(
            params?.city
          )} with trakky.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/academysalons/`}
        />
      </Helmet>
      {!academySalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of salon academy in {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {academySalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : academySalons?.data?.length > 0 ? (
          academySalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
      <Helmet>
        <title>{`Top Makeup Salons in ${capitalizeAndFormat(
          params?.city
        )} Bridal & Beauty Makeup`}</title>
        <meta
          name="description"
          content={`Are you looking for makeup salon in ${capitalizeAndFormat(
            params?.city
          )}? Checkout best makeup salons here, Book makeup services in top salons of ${capitalizeAndFormat(
            params?.city
          )}.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/makeupsalons/`}
        />
      </Helmet>
      {!makeupSalons.loading && (
        <div className="N-listpage-heading">
          <h1>
            {" "}
            List of makeup salons in {capitalizeAndFormat(params?.city)}{" "}
          </h1>
        </div>
      )}
      <div className="N-lp-card-listing-container">
        {makeupSalons.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : makeupSalons?.data?.length > 0 ? (
          makeupSalons?.data?.map((item, index) => {
            return <OtherListCard key={index} data={item} />;
          })
        ) : (
          <div>No salon found</div>
        )}
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
