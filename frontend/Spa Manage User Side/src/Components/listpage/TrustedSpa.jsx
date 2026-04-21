import React, { useEffect, useState } from "react";
import "./listpage.css";
import { useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import { capitalizeAndFormat } from "../functions/generalFun";

import OtherListCard from "./listcard/OtherListCard";
import Header from "../Common/Navbar/Header";
import FooterN from "../Common/Footer/FooterN";
import { Helmet } from "react-helmet";
import smallAndFormat from "../Common/functions/smallAndFormat";

const TrustedSpa = ({ title, subtitle, name }) => {
  const params = useParams();
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const getTrustedSpa = async (page) => {
    let url = `https://backendapi.trakky.in/spas/trusted-spa/?city=${params?.city}&page=${page}&verified=true`;
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

        data.results = data?.results.map((item) => {
          // need to convert item  is { id , city , spa : { spaData...}} i want map of only spaData
          return item.spa;
        }
      )
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
        <title>List of top trusted spas in {smallAndFormat(params?.city)}</title>
        <meta
          name="description"
          content={`Are you looking for top trusted spas in ${smallAndFormat(params?.city)}? your search results are here! Book spa massage therapies in top trusted spas of ${capitalizeAndFormat(params?.city)}.`}
        />
        <meta 
          name="keywords"
          content={`top trusted spa in ${smallAndFormat(params.city)}, best massage therapy spa, body massage spa`}
        />

      </Helmet>

      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        {
          <div className="N-listpage-heading">
            <h1>
            List of top trusted spas in {smallAndFormat(params?.city)}
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

export default TrustedSpa;
