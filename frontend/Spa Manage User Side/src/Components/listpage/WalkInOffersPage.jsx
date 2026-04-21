import React, { useEffect, useState } from "react";
import "./listpage.css";
import { useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import { capitalizeAndFormat } from "../functions/generalFun";

import OtherListCard from "./listcard/OtherListCard";
import Header from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import smallAndFormat from "../Common/functions/smallAndFormat";
import { Helmet } from "react-helmet";

const WalkInOffers = ({ title, subtitle, name }) => {
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const getTrustedSpa = async (page) => {
    let url = `https://backendapi.trakky.in/spas/spa-profile-offer-filter/?offer_discount=40&city=${params?.city}&page=${page}&verified=true`;
    setIsDataLoading(true);
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();

      if (response.ok) {
        if (page === 1) {
          setListData(data?.results);
        } else {
          setListData((prevValue) => [...prevValue, ...data?.results]);
        }
        setHasMore(data?.next);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (page) {
      getTrustedSpa(page);
    }
  }, [page]);

  return (
    <>
      <Helmet>
        <title>
        Book best massage therapy with best spas in {smallAndFormat(params?.city)}.
        </title>
        <meta name="description" content={`Checkout exclusive offers of spas in ${smallAndFormat(params?.city)}. Book trusted spa massage therapies with trakky near your location with best exclusive offers available on trakky.`} />
      </Helmet>

      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        {
          <div className="N-listpage-heading">
            <h1>
            List of best exclusive offers of spas in {smallAndFormat(params?.city)}
            </h1>
          </div>
        }
        <div className="N-lp-card-listing-container">
          {(isDataLoading && listData.length == 0) ? (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ) : listData?.length > 0 ? (
            listData?.map((item, index) => {
              return <OtherListCard key={index} data={item} />;
            })
          ) : (
            <div className=" mx-auto h-20 flex items-center font-semibold">
              No spa found
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

export default WalkInOffers;
