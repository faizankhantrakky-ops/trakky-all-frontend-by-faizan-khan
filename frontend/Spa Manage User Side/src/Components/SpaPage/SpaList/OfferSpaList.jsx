import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./SpaList.css";

import Hero from "../Hero/Hero";
import Footer from "../../Common/Footer/Footer";
import Slider from "../../Common/Slider/Slider";
import { popularLocations } from "../../../data";
import SpaCard from "../SpaCard/SpaCard";
import { SpaCardMini } from "../SpaCard/SpaCard";

const OfferSpaList = () => {
  const params = useParams();
  const { slug } = params;

  const [spas, setSpas] = useState([]);


  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function getWindowDimensions() {
    const width = window.innerWidth,
      height = window.innerHeight;
    return { width, height };
  }

  const getSpas = async () => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    await fetch("https://backendapi.trakky.in/spas/?offer_slug=" + slug, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpas(data?.results)
      })

      .catch((err) => console.log(err));
  };

 

  useEffect(() => {
    getSpas();
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Hero />
      <div className="spa_list__header">
        <h1>Best Offers For You</h1>
      </div>
      <div className="spa_list_main__container">
        <div className="spa_list__container">
          {{ windowDimensions }.windowDimensions.width >= 765 ? (
            <div className="spa_list">
              { spas?.length > 0 &&   spas?.map((data, index) => {
                return (
                  <>
                    <>
                      <SpaCard
                        key={index}
                        name={data.name}
                        img={data.main_image}
                        address={data.address}
                        landmark={data.landmark}
                        openTime={data.open_time}
                        closeTime={data.close_time}
                        city={data.city}
                        area={data.area}
                        mobileNumber={data.mobile_number}
                        bookingNumber={data.booking_number}
                        slug={data.slug}
                        premium={data.premium}
                        facilities={data.facilities}
                        offer_tag={data.offer_tag}
                        price={data.price}
                      />
                      {/* {index === 2 ? <OfferContainer /> : <></>} */}
                    </>
                  </>
                );
              })}
            </div>
          ) : (
            <>
              {spas?.map((data, index) => {
                return (
                  <>
                    <SpaCardMini
                      key={index}
                      name={data.name}
                      img={data.main_image}
                      address={data.address}
                      landmark={data.landmark}
                      openTime={data.open_time}
                      closeTime={data.close_time}
                      city={data.city}
                      area={data.area}
                      mobileNumber={data.mobile_number}
                      bookingNumber={data.booking_number}
                      slug={data.slug}
                      premium={data.premium}
                      facilities={data.facilities}
                      offer_tag={data.offer_tag}
                      price={data.price}
                    />
                    {/* {index === 2 ? <OfferContainer /> : null} */}
                  </>
                );
              })}
            </>
          )}
        </div>

      </div>
      <Footer city={params?.city || "ahmedabad"} />
    </div>
  );
};

const OfferContainer = () => {
  const [offers, setOffers] = useState([]);

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };
    fetch("https://backendapi.trakky.in/spas/offer/", requestOption)
      .then((res) => res.json())
      .then((data) => setOffers(data.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOffer();
  }, []);

  return (
    <div
      className="slider__outer-container offer__container"
      style={{ width: "100%" }}
    >
      <div className="slider__header">
        <h2>Grab the best deals</h2>
      </div>
      <Slider cardList={offers} _name={"offer"} />
    </div>
  );
};

const PopularLocations = () => {
  return (
    <div className="popular_location__container">
      <div className="popular_location__header">
        <h3>Searched Popular Localities</h3>
      </div>

      <div className="popular_location_list">
        <ul>
          {popularLocations.map((city, index) => {
            return (
              <li key={index}>
                <Link to={"/city"}>{city}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default OfferSpaList;
