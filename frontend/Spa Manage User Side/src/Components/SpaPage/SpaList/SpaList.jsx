import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./SpaList.css";

import Hero from "../Hero/Hero";
import Footer from "../../Common/Footer/Footer";
import Slider from "../../Common/Slider/Slider";
import { popularLocations } from "../../../data";
import SpaCard from "../SpaCard/SpaCard";
import { SpaCardMini } from "../SpaCard/SpaCard";

const SpaNearMeList = ({ name, url, title, description }) => {
  const params = useParams();

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function getWindowDimensions() {
    const width = window.innerWidth,
      height = window.innerHeight;
    return { width, height };
  }
  // Getting Spa Details
  const [TherapiesData, setTherapiesData] = useState([]);
  const [SpasData, setSpasData] = useState([]);
  const [topRatedSpas, setTopRatedSpas] = useState([]);
  const [luxuriousSpas, setLuxuriousSpas] = useState([]);
  const [spaNearYou, setSpaNearYou] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [listValue, setListValue] = useState([]);

  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  const getSpas = async () => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (params.city && params.area) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      let area = params.area.charAt(0).toUpperCase() + params.area.slice(1);

      city = city.replace(/-/g, " ");
      area = area.replace(/-/g, " ");

      // TO capitalize first letter after "-"
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      area = area.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );


      url += `?city=${city}&area=${area}`;
    } else if (params.city) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      city = city.replace(/-/g, " ");
      url += `?city=${city}`;
    } else {
      url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpasData(data);
        const toprated = data.filter((spa) => spa.top_rated);
        const luxurious = data.filter((spa) => spa.luxurious);


        setTopRatedSpas(toprated);
        setLuxuriousSpas(luxurious);
      })
      .catch((err) => console.log(err));
  };

  const getNearBySpas = async () => {
     fetch("https://backendapi.trakky.in/spas/nearby-spa/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longitude: Number(longitude),
        latitude: Number(latitude),
      }),
    })
      .then((res) => res.json())
      .then((data) => {setSpaNearYou(data); setListValue(data)})
      .catch((err) => console.log(err));
  };

  const getTopRatedSpas = async () => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (params.city && params.area) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      let area = params.area.charAt(0).toUpperCase() + params.area.slice(1);

      city = city.replace(/-/g, " ");
      area = area.replace(/-/g, " ");

      // TO capitalize first letter after "-"
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      area = area.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );


      url += `?city=${city}&area=${area}`;
    } else if (params.city) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      city = city.replace(/-/g, " ");
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      url += `?city=${city}`;
    } else {
      url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    url += "&top_rated=true&verified=true&page=1";

    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setTopRatedSpas(data.results);
        setListValue(data.results);
      })
      .catch((err) => console.log(err));
  };

  const getLuxuriosSpas = async () => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (params.city && params.area) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      let area = params.area.charAt(0).toUpperCase() + params.area.slice(1);

      city = city.replace(/-/g, " ");
      area = area.replace(/-/g, " ");

      // TO capitalize first letter after "-"
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      area = area.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );


      url += `?city=${city}&area=${area}`;
    } else if (params.city) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      city = city.replace(/-/g, " ");
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      url += `?city=${city}`;
    } else {
      url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    url += "&luxurious=true&verified=true&page=1";

    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setLuxuriousSpas(data.results);
        setListValue(data.results);
      })
      .catch((err) => console.log(err));
  };

  const getAllSpas = async () => {
    let url = "https://backendapi.trakky.in/spas/filter/";

    if (params.city && params.area) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      let area = params.area.charAt(0).toUpperCase() + params.area.slice(1);

      city = city.replace(/-/g, " ");
      area = area.replace(/-/g, " ");

      // TO capitalize first letter after "-"
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      area = area.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );


      url += `?city=${city}&area=${area}`;
    } else if (params.city) {
      let city = params.city.charAt(0).toUpperCase() + params.city.slice(1);
      city = city.replace(/-/g, " ");
      city = city.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase()
      );
      url += `?city=${city}`;
    } else {
      url = "https://backendapi.trakky.in/spas/?verified=true";
    }

    url += "&verified=true&page=1";

    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpasData(data.results);
        setListValue(data.results);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    description =
      description ||
      `Checkout the top spas in ${(
        params.area.charAt(0).toUpperCase() + params.area.slice(1)
      ).replaceAll("-", " ")}. Get upto 50% off in top spa in ${(
        params.area.charAt(0).toUpperCase() + params.area.slice(1)
      ).replaceAll(
        "-",
        " "
      )}. Click here to find out the best massage spa therapy near ${(
        params.area.charAt(0).toUpperCase() + params.area.slice(1)
      ).replaceAll("-", " ")}. `;

    document.title =
      title ||
      `List Of Top Spas In ${(
        params.area.charAt(0).toUpperCase() + params.area.slice(1)
      ).replaceAll("-", " ")} - Trakky`;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", description);

    // Getting offers starts
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };
    
    // Getting therapy starts
    fetch("https://backendapi.trakky.in/spas/therapy/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setTherapiesData(data);
      })
      .catch((err) => console.log(err));

    url === "topRatedSpas" && getTopRatedSpas();
    url === "luxuriousSpas" && getLuxuriosSpas();
    url === "areapage" && getAllSpas();
  }, []);

  useEffect(() => {
     if(latitude && longitude){
      setTimeout(() => {
        getNearBySpas();
      }, 1000);
     }
     else{
      getNearBySpas();
     }
  } , [latitude, longitude])

  let ListValue = [{}];
  if (url === "luxuriousSpas") {
    ListValue = luxuriousSpas;
  } else if (url === "topRatedSpas") {
    ListValue = topRatedSpas;
  } else if (url === "areapage") {
    name =
      "Spas in " + params.area.charAt(0).toUpperCase() + params.area.slice(1);
    name = name.replace(/-/g, " ");
    ListValue = SpasData;
  } else {
    ListValue = spaNearYou;
    // ListValue = topRatedSpas;
  }
  

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [visible, setVisible] = useState(5);
  // const [show, setShow] = useState(true);
  // const length = ListValue.length;

  // const showMoreItems = () => {
  //   if (visible < length) {
  //     setVisible((prevValue) => prevValue + 4);
  //   } else {
  //     setShow(false);
  //   }
  // };

  return (
    <div>
      <Hero />
      <div className="spa_list__header">
        <h1>{name}</h1>
      </div>
      <div className="spa_list_main__container">
        <div className="spa_list__container">
          {/* Displays list of cards according to window size */}
          {{ windowDimensions }.windowDimensions.width >= 765 ? (
            <div className="spa_list">
              {ListValue.slice(0, visible).map((data, index) => {
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
                        // location={data.location}
                        offer_tag={data.offer_tag}
                        price={data.price}
                        // ratings={data.ratings}
                        // reviewsCount={data.reviewsCount}
                      />
                    </>
                    {index === 1 ? <OfferContainer /> : <></>}
                  </>
                );
              })}
            </div>
          ) : (
            <>
              {ListValue.map((data, index) => {
                return (
                  <>
                    {index === 2 ? <OfferContainer /> : null}
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
                      premium={data.premium}
                      slug={data.slug}
                      facilities={data.facilities}
                      offer_tag={data.offer_tag}
                      price={data.price}
                      // location={data.location}
                      // ratings={data.ratings}
                      // reviewsCount={data.reviewsCount}
                    />
                  </>
                );
              })}
            </>
          )}
          {ListValue.length > visible ? (
            <div className="view_more__button">
              <button
                onClick={() => {
                  setVisible((prevValue) => prevValue + 5);
                }}
                style={{ cursor: "pointer" }}
              >
                View More
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* <PopularLocations /> */}
      </div>
      <Footer city={params?.city || "ahmedabad"} />
    </div>
  );
};

const OfferContainer = () => {
  // Getting offers starts
  const [offersData, setOffersData] = useState([]);

  const getOffer = () => {
    const requestOption = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/spas/offer/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setOffersData(data);
      })
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
      <Slider cardList={offersData} _name={"offer"} />
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
export default SpaNearMeList;
