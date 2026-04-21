import React, { useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import Hero from "../SalonPage/Hero/Hero";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";
import {
  getSalonsNearYou,
  getTopRatedSalons,
  getBridalSalons,
  getUnisexSalons,
  getKidsSalons,
  gettheFemaleBeautySalons,
  getAcademySalons,
  getMakeupSalons,
  getAllAreaSalons,
} from "./pageapi";

const AreaListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const path = window.location?.pathname?.split("/")[2];
  const [city, setCity] = useState(params?.city);
  const [area, setArea] = useState(params?.area);

  const NavOptions = [
    {
      tag: "All",
      link: "salons",
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

  const handleTopRatedSalons = async () => {
    setIsDataLoading(true);
    let data = await getTopRatedSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleBridalSalons = async () => {
    setIsDataLoading(true);
    let data = await getBridalSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleUnisexSalons = async () => {
    setIsDataLoading(true);
    let data = await getUnisexSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleKidsSalons = async () => {
    setIsDataLoading(true);
    let data = await getKidsSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleFemaleBeautySalons = async () => {
    setIsDataLoading(true);
    let data = await gettheFemaleBeautySalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleAcademySalons = async () => {
    setIsDataLoading(true);
    let data = await getAcademySalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleMakeupSalons = async () => {
    setIsDataLoading(true);
    let data = await getMakeupSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  const handleSalonAreaWise = async () => {
    setIsDataLoading(true);
    let data = await getAllAreaSalons(
      capitalizeAndFormat(city),
      capitalizeAndFormat(area),
      page
    );
    setListData((prevValue) => [...prevValue, ...data.results]);
    !data.next && setHasMore(false);
    setIsDataLoading(false);
  };

  useEffect(() => {
    if (page == 1) {
      setListData([]);
    }

    name == "topRatedSalons" && handleTopRatedSalons();
    name == "bridalSalons" && handleBridalSalons();
    name == "unisexSalons" && handleUnisexSalons();
    name == "kidsSpecialSalons" && handleKidsSalons();
    name == "femaleBeautyParlour" && handleFemaleBeautySalons();
    name == "academySalons" && handleAcademySalons();
    name == "makeupSalons" && handleMakeupSalons();
    name == "areaPage" && handleSalonAreaWise();
  }, [page, city, area, path]);

  useEffect(() => {
    setArea(params?.area);
    setListData([]);
  }, [params?.area]);
  useEffect(() => {
    setCity(params?.city);
  }, [params?.city]);

  return (
    <>
      <Hero />
      <div className="listpage-nav-links">
        <ul>
          {city &&
            area &&
            NavOptions.map((item, index) => {
              return (
                <li key={index} className={item.link == path ? "active" : ""}>
                  <Link
                    to={`/${encodeURIComponent(city)}/${
                      item.link
                    }/${encodeURIComponent(area)}`}
                  >
                    {item.tag}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="listpage-heading">
        <h1>{area && (title += " " + capitalizeAndFormat(area))}</h1>
      </div>
      {
        <div className="listpage-offer-container">
          <OfferContainer />
        </div>
      }

      {!isDataLoading && (
        <div className="listpage-sub-heading">
          <h2>{area && (subtitle += " " + capitalizeAndFormat(area))}</h2>
        </div>
      )}
      <div className="lp-card-listing-container">
        {listData.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>
      {hasMore &&
        (!isDataLoading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                setPage((prevValue) => prevValue + 1);
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
      <PopularArea />
      <Footer city={params?.city || "ahmedabad"} />
    </>
  );
};

export default AreaListPage;

const OfferContainer = React.memo(() => {
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const city = capitalizeAndFormat(params?.city);
  const area = capitalizeAndFormat(params?.area);

  let path = window.location.pathname.split("/")[3];

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      `https://backendapi.trakky.in/salons/offer/?city=${city}&area=${area}`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOffer();
  }, [path]);

  return (
    offersData.length > 0 && (
      <div className="slider__outer-container offer__container">
        <div className="slider__header" style={{ margin: 0 }}>
          <h2 className="lp-offer-header">Grab the best deals</h2>
        </div>
        {!loading ? <Slider cardList={offersData} _name={"offer"} /> : <></>}
      </div>
    )
  );
});
