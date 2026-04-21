import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./SpaList.css";

import Hero from "../Hero/Hero";
import Footer from "../../Common/Footer/Footer";
import Slider from "../../Common/Slider/Slider";
import { popularLocations } from "../../../data";
import SpaCard from "../SpaCard/SpaCard";
import { SpaCardMini } from "../SpaCard/SpaCard";

const TherapySpaList = () => {
  const params = useParams();
  const { slug } = params;


  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function getWindowDimensions() {
    const width = window.innerWidth,
      height = window.innerHeight;
    return { width, height };
  }
  // Getting Spa Details
  const [spasId, setSpasId] = useState();
  const [spas, setSpas] = useState();

  useEffect(() => {
    // Getting offers starts
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };
    // Getting therapy starts
    fetch("https://backendapi.trakky.in/spas/therapy/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        const selectedOffer = data.filter((obj) => obj.slug === slug)[0];
        document.title = `${selectedOffer.name} - Find ${selectedOffer.name} on Trakky`;
        document
          .querySelector('meta[name="description"]')
          .setAttribute(
            "content",
            `Looking for Best ${selectedOffer.name} in town? it's near you with Trakky`
          );
        const spaList = Object.keys(selectedOffer.spa_names);
        setSpasId(spaList);
      })

      .catch((err) => console.log(err));

    // Getting spas starts
    fetch("https://backendapi.trakky.in/spas/?verified=true/", requestOption)
      .then((res) => res.json())
      .then((data) => setSpas(data))
      .catch((err) => console.log(err));
  }, []);

  var ListValue = [];

  if (spasId && spas) {
    ListValue = spas.results.filter((obj) => spasId.includes(obj.id.toString()));
  }


  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [visible, setVisible] = useState(4);
  const [show, setShow] = useState(true);
  const length = ListValue.length;

  return (
    <div>
      <Hero />
      <div className="spa_list__header">
        <h1>Best Therapies For You</h1>
      </div>
      <div className="spa_list_main__container">
        <div className="spa_list__container">
          {/* Displays list of cards according to window size */}
          {{ windowDimensions }.windowDimensions.width >= 765 ? (
            <div className="spa_list">
              {ListValue.length > 0 && ListValue.map((data, index) => {
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
                      {index === 2 ? <OfferContainer /> : <></>}
                    </>
                  </>
                );
              })}
            </div>
          ) : (
            <>
              {ListValue.map((data, index) => {
                return (
                  <>
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
                      {index === 2 ? <OfferContainer /> : <></>}
                    </>
                  </>
                );
              })}
            </>
          )}
        </div>

        <PopularLocations />
      </div>
      <Footer city={params?.city || "ahmedabad"} />
    </div>
  );
};

const OfferContainer = () => {
  // Getting offers starts
  const [offers, setOffers] = useState([]);
  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };
    fetch("https://backendapi.trakky.in/spas/offer", requestOption)
      .then((res) => res.json())
      .then((data) => setOffers(data.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOffer();
  }, []);
  // Getting offers ends

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
  const params = useParams();
  return (
    <div className="popular_location__container">
      <div className="popular_location__header">
        <h3>Searched Popular Localities</h3>
      </div>

      <div className="popular_location_list">
        <ul>
          {popularLocations.map((city, index) => {
            const area = city.substring(7).toLowerCase().replaceAll(' ','-');
            return (
              <li key={index}>
                <Link to={`/${params.city.toLowerCase().replaceAll(' ','-')}/spas/${area}`}>{city}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default TherapySpaList;
