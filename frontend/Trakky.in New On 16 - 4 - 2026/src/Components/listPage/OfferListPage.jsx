import React, { useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import Hero from "../SalonPage/Hero/Hero";
import "./listpage.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Footer from "../Common/Footer/Footer";
import Slider from "../Common/Slider/Slider";
import { capitalizeAndFormat } from "../functions/generalFun";

import { useSelector, useDispatch } from "react-redux";

import { fetchOffer } from "../../Store/offerSlice";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const dispatch = useDispatch();

  const slug = params?.slug;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const offerState = useSelector((state) => state.offers);
  const [OfferName, setOfferName] = useState("Best Offers");

  useEffect(() => {
    if (slug) {
      let Offer = offerState?.data?.find((item) => {
        return item.slug?.toLowerCase() === slug.toLowerCase();
      })?.name;
      setOfferName(Offer);
    }
  }, [slug, offerState]);

  const [offerData, setOfferData] = useState({ loading: true, data: [] });

  const getOfferData = async (pageCount) => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    await fetch(
      `https://backendapi.trakky.in/salons/?offer_slug=${slug}&page=${
        pageCount || page
      }`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => {
        setOfferData({ loading: false, data: data?.results });
        !data?.next ? setHasMore(false) : setHasMore(true);
      })
      .catch((err) => {
        setOfferData({ loading: false, data: [] });
      });

    setOfferData((prev) => {
      return { loading: false, data: [...prev.data] };
    });
  };

  useEffect(() => {
    getOfferData(page);
  }, [slug]);

  useEffect(() => {
    if (
      offerState?.city == null ||
      offerState.city.toLowerCase() !=
        capitalizeAndFormat(params.city).toLowerCase()
    ) {
      dispatch(fetchOffer({ city: params.city }));
    }
  }, [params.city]);

  return (
    <>
      <Hero />
      {!offerData?.loading && (
        <div className="listpage-heading">
          <h1> {OfferName} </h1>
        </div>
      )}
      {/* {
        <div className="listpage-offer-container">
          <OfferContainer />
        </div>
      } */}

      {/* <div className="listpage-sub-heading">
           <h2>{OfferName}</h2>
         </div> */}

      {offerData?.data.length > 0 && (
        <div className="lp-card-listing-container">
          {offerData?.data.map((item, index) => {
            return <ListCard key={index} data={item} />;
          })}
        </div>
      )}
      {hasMore &&
        (!offerData.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getOfferData(page + 1);
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
