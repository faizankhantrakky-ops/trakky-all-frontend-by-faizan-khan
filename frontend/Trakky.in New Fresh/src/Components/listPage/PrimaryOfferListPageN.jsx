import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [offerData, setOfferData] = useState({ loading: true, data: [] });

  const getOfferData = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/salon-city-offer/?city=${params.city}&slug=${params.slug}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Find the offer that matches our slug
      const matchingOffer = data.find(
        (offer) => offer.slug.toLowerCase() === slug.toLowerCase()
      );

      if (matchingOffer) {
        // Get the full salon details for each salon in the offer
        const salonDetailsPromises = matchingOffer.salon.map((salonId) =>
          fetch(`https://backendapi.trakky.in/salons/${salonId}/`).then((res) =>
            res.json()
          )
        );

        const salonsData = await Promise.all(salonDetailsPromises);

        setOfferData({ loading: false, data: salonsData });
        setOfferName(matchingOffer.name || "Best Offers");
      } else {
        setOfferData({ loading: false, data: [] });
      }
    } catch (err) {
      console.error("Error fetching offer data:", err);
      setOfferData({ loading: false, data: [] });
    }
  };

  useEffect(() => {
    if (slug) {
      getOfferData();
    }
  }, [slug]);

  useEffect(() => {
    if (
      offerState?.city == null ||
      offerState.city.toLowerCase() !==
        capitalizeAndFormat(params.city).toLowerCase()
    ) {
      dispatch(fetchOffer({ city: params.city }));
    }
  }, [params.city]);

  return (
    <>
      <Helmet>
        <title>
          Checkout exclusive {OfferName} in {capitalizeAndFormat(params?.city)}{" "}
          only on trakky.
        </title>
        <meta
          name="description"
          content={`Book now ${OfferName} salon in ${capitalizeAndFormat(
            params?.city
          )}. Book trusted salon services with trakky near your location with best exclusive ${OfferName} available on trakky.`}
        />
        <meta
          name="keywords"
          content={`premium salon offers in ${params?.city}, hair and beauty salon in ${params?.city}, salon discount in ${params?.city}, best bridal makeup and hair cut offers in ${params?.city} `}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://trakky.in/${params?.city}/salons/special-offers/${slug}`}
        />
      </Helmet>

      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />
        <OfferComponentN title={"Grab The Best Offers"} />
        <div className="N-listpage-heading">
          <h1>
            List of {OfferName} in {capitalizeAndFormat(params?.city)}
          </h1>
        </div>

        {offerData.loading ? (
          <div className="N-lp-load-more">
            <div className="N-lp-loader"></div>
          </div>
        ) : offerData?.data.length > 0 ? (
          <>
            <div className="N-lp-card-listing-container">
              {offerData.data.map((item, index) => (
                <OtherListCard key={index} data={item} />
              ))}
            </div>
            {hasMore && (
              <div className="N-lp-load-more">
                <button onClick={() => getOfferData(page + 1)}>
                  View More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="N-no-offers-found">
            <p>No offers found for this category.</p>
          </div>
        )}

        <PopularArea />
        <FooterN city={params?.city || "ahmedabad"} />
      </div>
    </>
  );
};

export default ListPage;
