import React, { useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import { capitalizeAndFormat } from "../functions/generalFun";
import OfferComponentN from "./OfferComponentN";
import { useSelector, useDispatch } from "react-redux";

import { fetchOffer } from "../../Store/offerSlice";
import FooterN from "../Common/Footer/FooterN";
import Header from "../Common/Navbar/Header";
import "./listpagen.css";
import OtherListCard from "./listCard/OtherListCard";
import { Helmet} from "react-helmet";

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
      <Helmet>
        <title>{`Book best ${OfferName} salons in ${capitalizeAndFormat(
          params?.city
        )}.`}</title>
        <meta
          name="description"
          content={`Checkout ${OfferName} salon in ${capitalizeAndFormat(
            params?.city
          )}. Book trusted salon services with trakky near your location with best exclusive offers available on trakky.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/offers/${slug}`}
        />
      </Helmet>
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />
        <OfferComponentN title={"Grab The Best Offers"} />
        <div className="N-listpage-heading">
          {OfferName ? (
            <h1> List of best {OfferName} </h1>
          ) : (
            <h1> List of Offers </h1>
          )}
        </div>

        {offerData?.data.length > 0 && (
          <div className="N-lp-card-listing-container">
            {offerData?.data.map((item, index) => {
              return <OtherListCard key={index} data={item} />;
            })}
          </div>
        )}

        {hasMore &&
          (!offerData.loading ? (
            <div className="N-lp-load-more">
              <button
                onClick={() => {
                  getOfferData(page + 1);
                }}
              >
                View More
              </button>
            </div>
          ) : (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ))}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default ListPage;
