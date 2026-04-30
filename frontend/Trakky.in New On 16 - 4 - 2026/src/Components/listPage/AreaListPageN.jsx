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
import FooterN from "../Common/Footer/FooterN";
import OtherListCard from "./listCard/OtherListCard";
import Header from "../Common/Navbar/Header";
import OfferComponentN from "./OfferComponentN";
import { Helmet} from "react-helmet";

const AreaListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  useEffect(() => {
    const pathname = window.location.pathname;
    if (/%[0-9A-Fa-f]{2}/.test(pathname) || pathname.includes(" ")) {
      const cleanPath = pathname
        .split("/")
        .map((segment) => {
          try {
            return decodeURIComponent(segment).replace(/\s+/g, "-");
          } catch {
            return segment.replace(/%20/gi, "-");
          }
        })
        .join("/");
      if (cleanPath !== pathname) {
        window.history.replaceState(
          null,
          "",
          cleanPath + window.location.search + window.location.hash
        );
      }
    }
  }, [params?.city, params?.area]);

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
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
    let data = await getTopRatedSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // data.next && setHasMore(true);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleBridalSalons = async () => {
    setIsDataLoading(true);
    let data = await getBridalSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // data.next && setHasMore(true);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleUnisexSalons = async () => {
    setIsDataLoading(true);
    let data = await getUnisexSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // !data.next && setHasMore(false);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleKidsSalons = async () => {
    setIsDataLoading(true);
    let data = await getKidsSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // !data.next && setHasMore(false);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleFemaleBeautySalons = async () => {
    setIsDataLoading(true);
    let data = await gettheFemaleBeautySalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleAcademySalons = async () => {
    setIsDataLoading(true);
    let data = await getAcademySalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // !data.next && setHasMore(false);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setIsDataLoading(false);
  };

  const handleMakeupSalons = async () => {
    setIsDataLoading(true);
    let data = await getMakeupSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // !data.next && setHasMore(false);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    setIsDataLoading(false);
  };

  const handleSalonAreaWise = async () => {
    setIsDataLoading(true);
    let data = await getAllAreaSalons(city, area, page);
    setListData((prevValue) => [...prevValue, ...data.results]);
    // !data.next && setHasMore(false);
    if (data?.next) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
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

  const getMetaTitleDetails = () => {
    if (name === "areaPage") {
      return `Checkout Top salons in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)} with trakky`;
    } else if (
      name === "topRatedSalons" ||
      name === "bridalSalons" ||
      name === "unisexSalons" ||
      name === "kidsSpecialSalons" ||
      name === "femaleBeautyParlour"
    ) {
      return `Checkout Top ${subtitle} salons in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)} and book services now.`;
    } else if (name === "academySalons") {
      return `Checkout Top salon academy in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)} and book now.`;
    } else if (name === "makeupSalons") {
      return `Checkout Top makeup salons in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)} and book makeup services now.`;
    } else {
      return "";
    }
  };

  const getMetaDescDetails = () => {
    if (name === "areaPage") {
      return `Discover top-rated salons in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )} on Trakky. Book your favorite salon services easily and enjoy professional haircuts, styling, facials, and more near you.`;
    } else if (name === "topRatedSalons") {
      return `Are you looking for top rated salon in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? your search results are here! Book salon services in top rated salons of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else if (name === "bridalSalons") {
      return `Are you looking for bridal salon in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout best bridal salons here, Book bridal services in top bridal salons of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else if (name === "academySalons") {
      return `Are you looking for best salon academy in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout best salon academy here, Select salon academy course in best salon academy of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)} with trakky.`;
    } else if (name === "makeupSalons") {
      return `Are you looking for makeup salon in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout best makeup salons here, Book makeup services in top salons of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else if (name === "unisexSalons") {
      return `Are you looking for best unisex salon in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout best unisex salons here, Book salon services in best unisex salons of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else if (name === "kidsSpecialSalons") {
      return `Are you looking for best kids salon in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout best kids salons here, Book salon services in best kids salons of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else if (name === "femaleBeautyParlour") {
      return `Are you looking for female beauty parlours in ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(
        params?.city
      )}? Checkout female beauty parlours here, Book female beauty parlours services in female beauty parlours of ${capitalizeAndFormat(
        params?.area
      )}, ${capitalizeAndFormat(params?.city)}.`;
    } else {
      return "";
    }
  };
  return (
    <>
      <Helmet>
        <title>{getMetaTitleDetails()}</title>
        <meta name="description" content={getMetaDescDetails()} />
        {name === "areaPage" && (
          <meta
            name="keywords"
            content={`salons in ${params?.area} ${params?.city}, best ${params?.area} salon ${params?.city}, top beauty salon ${params?.city}, salon near you`}
          />
        )}
        {name === "topRatedSalons" && (
          <meta
            name="keywords"
            content={`Top rated salons in ${params?.area} ${params?.city}, best salons in ${params?.area} ${params?.city}, salon services in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "bridalSalons" && (
          <meta
            name="keywords"
            content={`bridal salons in ${params?.area} ${params?.city}, best bridal makeup in ${params?.area} ${params?.city}, top bridal salon in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "academySalons" && (
          <meta
            name="keywords"
            content={`salons academy in ${params?.area} ${params?.city}, best salon academy in ${params?.area} ${params?.city}, professional salon academy in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "makeupSalons" && (
          <meta
            name="keywords"
            content={`makeup salon in ${params?.area} ${params?.city}, best makeup salon in ${params?.area} ${params?.city}, top makeup salon in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "unisexSalons" && (
          <meta
            name="keywords"
            content={`best unisexsalons in ${params?.area} ${params?.city}, top unisexsalons in ${params?.area} ${params?.city}, professional salon unisex in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "femaleBeautyParlour" && (
          <meta
            name="keywords"
            content={`best female beauty parlour in ${params?.area} ${params?.city}, ladies beauty parlour services in ${params?.area} ${params?.city}, top beauty parlour for women in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        {name === "kidsSpecialSalons" && (
          <meta
            name="keywords"
            content={`best kids salons in ${params?.area} ${params?.city}, childern's hair salon service in ${params?.area} ${params?.city}, kids friendly salon in ${params?.area} ${params?.city}, salon near you`}
          />
        )}
        <meta name="robots" content="index, follow" />
        {name === "areaPage" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/salons/${params?.area}`}
          />
        )}
        {name === "topRatedSalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/topratedsalons/${params?.area}`}
          />
        )}
        {name === "bridalSalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/bridalsalons/${params?.area}`}
          />
        )}
        {name === "academySalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/academysalons/${params?.area}`}
          />
        )}
        {name === "makeupSalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/makeupsalons/${params?.area}`}
          />
        )}
        {name === "unisexSalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/unisexsalons/${params?.area}`}
          />
        )}
        {name === "femaleBeautyParlour" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/femalebeautyparlour/${params?.area}`}
          />
        )}
        {name === "kidsSpecialSalons" && (
          <link
            rel="canonical"
            href={`https://trakky.in/${params?.city}/kidsspecialsalons/${params?.area}`}
          />
        )}
      </Helmet>
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />
        <div className="L-list-page-option-n-filter">
          {city &&
            area &&
            NavOptions.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    item.link == path
                      ? "!bg-[#512DC8] !text-white text-sm sort-box "
                      : " sort-box"
                  }
                >
                  <Link
                    to={`/${encodeURIComponent(city)}/${
                      item.link
                    }/${encodeURIComponent(area)}`}
                    className=" text-inherit"
                  >
                    {item.tag}
                  </Link>
                </div>
              );
            })}
        </div>

        <OfferComponentN title={"Grab The Best Offers"} area={params?.area} />

        {
          <div className="N-listpage-heading">
            <h1>
              {name === "areaPage"
                ? `List of Salons In ${capitalizeAndFormat(area)}`
                : `List of ${subtitle} salons in ${capitalizeAndFormat(
                    params?.area
                  )}, ${capitalizeAndFormat(params?.city)}`}
            </h1>
          </div>
        }
        <div className="N-lp-card-listing-container">
          {isDataLoading ? (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ) : listData?.length > 0 ? (
            listData?.map((item, index) => {
              return <OtherListCard key={index} data={item} />;
            })
          ) : (
            <div className=" mx-auto h-20 flex items-center font-semibold">
              No salon found
            </div>
          )}
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
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default AreaListPage;