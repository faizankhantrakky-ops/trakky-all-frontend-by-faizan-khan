import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero/Hero";
import "./mainhome.css";
import flagImg from "../../Assets/images/other/flag.png";
import arrowSvg from "../../Assets/images/icons/right_arrow_N.svg";
import Footer from "../Common/Footer/Footer";
import { Link } from "react-router-dom";
import Slider from "../Common/Slider/Slider";
import TopAreaOfCityDashboard from "../Common/toparea/TopAreaOfCityDashboard";
import "./Main.css";
import WhatsAppButton from "../Common/whatsapp/WhatsappButton";
import FAQ from "../Faq/FAQ";
const MainHome = () => {
  const navigate = useNavigate();

  const [popularcity, setPopularCity] = React.useState([]);
  const [expandedCities, setExpandedCities] = useState({});
  const [displayNo, setDisplayNo] = useState(6);
  const [CategoriesData, setCategoriesData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [popularCityName, setPopularCityName] = useState([]);
  const [topAreas, setTopAreas] = useState([]);
  const [city, setCity] = useState([]);

  const getAreas = async () => {
    await fetch(`https://backendapi.trakky.in/salons/areaimage/`)
      .then((res) => res.json())
      .then((data) => {
        setPopularCity(data);

        data?.map((item) => {
          setPopularCityName((prev) => [...prev, item.city]);
        });
      });
  };

  useEffect(() => {
    const areasByCity = popularcity.map((city) => {
      const areas = city.areas;
      return { city: city.city, areas };
    });
    setTopAreas(areasByCity);
  }, [popularcity]);

  const handleShowMoreArea = (cityId) => {
    setExpandedCities((prevExpandedCities) => ({
      ...prevExpandedCities,
      [cityId]: true,
    }));
  };

  useEffect(() => {
    if (window.innerWidth < 540) {
      setDisplayNo(3);
    }
    getAreas();
    getCategories();
    getOffer();
  }, []);

  // Getting Category Data
  const getCategories = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/national-category/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data);
      })
      .catch((err) => console.log(err));
  };

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/national-offers/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
      })
      .catch((err) => console.log(err));
  };

  const handleScroll = () => {
    navigate("/");

    const startDiv = document.getElementById("start");
    startDiv.scrollIntoView({ behavior: "smooth" });
  };

  const getCities = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/city/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setCity(data.payload);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <div className="main__container">
      <WhatsAppButton />
      <Hero />

      {/* Service Starts------------------- */}
      <div className="category__container  " id="categories">
        <div
          className="slider__outer-container my-container"
          onClick={handleScroll}
        >
          <Slider
            cardList={CategoriesData}
            _name={"nationalcategory"}
            heading={"Salon Services"}
            isMainHeading={true}
            // subheading={"Select best Salon Services"}
            subheading={
              "Explore, Book, and Beautify Yourself with Various Beauty Salon Services"
            }
          />
        </div>
      </div>

      {/* Offer Starts------------------- */}
      {offersData?.length > 0 && (
        <div
          className="slider__outer-container offer__container my-container"
          id="offers"
          onClick={handleScroll}
        >
          <Slider
            cardList={offersData}
            _name={"nationaloffer"}
            heading={"Grab the best deals"}
          />
        </div>
      )}

      {/* Top Areas By City */}

      {/* {popularcity && popularcity.length > 0 && topAreas.length > 0 && (
        <TopAreaOfCityDashboard
          cityname={popularCityName.slice(0, 5)}
          areas={topAreas}
        />
      )} */}

      <div className="homepage-main-title" id="start">
        Popular locations in
        <span>
          <img src={flagImg} alt="indian flag" />
        </span>
        Bharat
      </div>
      <div className="homepage-disc">
        {/* Indulge in the ultimate relaxation and rejuvenation with Trakky,
        dedicated to featuring the best salons in India. We've meticulously
        curated a collection of serene wellness sanctuaries across the country,
        known for their holistic therapies and tranquil ambiance. Explore our
        recommendations and embark on a journey towards blissful relaxation and
        inner harmony. */}
        Ready to glam up in the hottest cities across India? We have got you
        covered with our curated list of top-notch salons in the most happening
        spots!
        <br />
        Whether you're in the vibrant streets of Mumbai, soaking in the culture
        of Delhi, embracing the tech-savvy vibes of Bangalore, savoring the
        culinary delights of Ahmedabad, or enjoying the serene beauty of
        Gandhinagar, Trakky brings the best salons in India right to your
        service.
      </div>

      {/* popular city */}

      <div className="main-area-links">
        {city?.map((item) => {
          return (
            <Link
              to={`/${encodeURIComponent(item?.name.toLowerCase())}/salons`}
            >
              <div className="area-group-item" key={item.id}>
                {item.name}
                <span>
                  <img src={arrowSvg} alt="arrow" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* popular area */}

      {city &&
        city.map((item) => {
          return (
            <>
              {item?.area_names && item?.area_names.length > 0 && (
                <>
                  <div className="homepage-main-title">{item.name}</div>
                  <div className="main-area-links">
                    {item?.area_names
                      .slice(
                        0,
                        expandedCities[item.id]
                          ? item.area_names.length
                          : Math.min(displayNo, item.area_names.length)
                      )
                      .map((area, index) => {
                        return (
                          <Link
                            to={`/${encodeURIComponent(
                              item.name.toLowerCase()
                            )}/salons/${encodeURIComponent(
                              area.toLowerCase()
                            )}`}
                          >
                            <div className="area-group-item" key={index}>
                              {area}
                              <span>
                                <img src={arrowSvg} alt="arrow" />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  {!expandedCities[item.id] &&
                    item?.area_names.length > displayNo && (
                      <button
                        className="show-more-button-area"
                        onClick={() => handleShowMoreArea(item.id)}
                      >
                        Show More
                      </button>
                    )}
                  {expandedCities[item.id] && (
                    <button
                      className="show-more-button-area"
                      onClick={() =>
                        setExpandedCities((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }))
                      }
                    >
                      Show Less
                    </button>
                  )}
                </>
              )}
            </>
          );
        })}

      <FAQ />
      <AboutUs />
      <Footer city={"ahmedabad"} />
    </div>
  );
};

export default MainHome;

const AboutUs = () => {
  return (
    <div className="about-us-section">
      <h1 className="px-4">About Us</h1>
      <div className="about-us-content">
        <p className="px-4 ">
          Welcome to Trakky, your one-stop destination for all things beauty and
          relaxation. We are more than simply an online booking platform; we are
          your dependable partner in looking and feeling your best.
        </p>
        <p className="px-4 ">
          At Trakky, we realize the value of self-care and its significance in
          improving your overall well-being. That is why we have designed a
          simple and convenient method for you to obtain the top salon and spa
          services in your area.
        </p>
        <p className="px-4 ">
          Our purpose is to inspire you to prioritize self-care and incorporate
          it into your daily routine. We believe that everyone has the right to
          look and feel their best, and we're here to help.
        </p>
      </div>
    </div>
  );
};
