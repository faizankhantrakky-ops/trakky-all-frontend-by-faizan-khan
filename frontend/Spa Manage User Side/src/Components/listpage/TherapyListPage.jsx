import React, { useEffect, useState } from "react";
import ListCard from "./listcard/ListCard";
import Hero from "../SpaPage/Hero/Hero";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";


import { useSelector, useDispatch } from "react-redux";
import { fetchTherapy } from "../../Store/therapySlice";


const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const dispatch = useDispatch();

  const slug = params?.slug;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const therapyState = useSelector((state) => state.therapy);
  const [TherapyName, setTherapyName] = useState("Services");

  useEffect(() => {
    
    if (slug) {
      let Therapy = therapyState?.data?.find((item) => {
        return item.slug?.toLowerCase() === slug.toLowerCase();
      })?.name;
      setTherapyName(Therapy);
    }
  }, [slug, therapyState]);

  const [therapyData, setTherapyData] = useState({ loading: true, data: [] });

  const getTherapyData = async (pageCount) => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    await fetch(
      `https://backendapi.trakky.in/spas/?therapy_slug=${slug}&page=${
        pageCount || page
      }&verified=true`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => {
        setTherapyData({ loading: false, data: data?.results });
        !data?.next ? setHasMore(false) : setHasMore(true);
      })
      .catch((err) => {
        setTherapyData({ loading: false, data: [] });
      });

    setTherapyData((prev) => {
      return { loading: false, data: [...prev.data] };
    });
  };

  useEffect(() => {
    getTherapyData(page);
  }, [slug]);

  
  useEffect(() => {
    if (
  
      (therapyState?.city == null ||
        therapyState.city.toLowerCase() !=
          capitalizeAndFormat(params.city).toLowerCase())
    ) {
      dispatch(fetchTherapy({ city: capitalizeAndFormat(params.city) }));
    }
  }
  , [ params?.city ]);

  return (
    <>
      <Hero />
      {!therapyData?.loading && (
      <div className="listpage-heading">
        <h1> {TherapyName} </h1>
      </div>
      
      )}
      {/* {
        <div className="listpage-offer-container">
          <OfferContainer />
        </div>
      } */}

      
         {/* <div className="listpage-sub-heading">
           <h2>{TherapyName}</h2>
         </div> */}
      
      {

      therapyData?.data.length > 0 &&
      (<div className="lp-card-listing-container">
        {therapyData?.data.map((item, index) => {
          return <ListCard key={index} data={item} />;
        })}
      </div>)

}
      {hasMore &&
        (!therapyData.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getTherapyData(page + 1);
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
    fetch(`https://backendapi.trakky.in/spas/offer/?city=${city}`, requestOption)
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
