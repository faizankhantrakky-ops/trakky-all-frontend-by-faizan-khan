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

import { fetchCategories } from "../../Store/categorySlice";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const dispatch = useDispatch();

  const slug = params?.slug;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const categoryState = useSelector((state) => state.categories);
  const [CategoryName, setCategoryName] = useState("Services");

  useEffect(() => {
    if (slug) {
      let Category = categoryState?.data?.find((item) => {
        return item.slug?.toLowerCase() === slug.toLowerCase();
      })?.category_name;
      setCategoryName(Category);
    }
  }, [slug, categoryState]);

  const [categoryData, setCategoryData] = useState({ loading: true, data: [] });

  const getCategoryData = async (pageCount) => {
    const requestOption = {
      method: "GET",
      header: { "Content-Type": "application/json" },
    };

    await fetch(
      `https://backendapi.trakky.in/salons/?category_slug=${slug}&page=${
        pageCount || page
      }`,
      requestOption
    )
      .then((res) => res.json())
      .then((data) => {
        setCategoryData((prev) => {
          return { loading: false, data: [...prev.data, ...data?.results] };
        });
        !data?.next ? setHasMore(false) : setHasMore(true);
      })
      .catch((err) => {
        setCategoryData({ loading: false, data: [] });
      });

    setCategoryData((prev) => {
      return { loading: false, data: [...prev.data] };
    });
  };

  useEffect(() => {
    getCategoryData(page);
  }, [slug]);

  useEffect(() => {
    if (
      categoryState?.city == null ||
      categoryState.city.toLowerCase() !=
        capitalizeAndFormat(params.city).toLowerCase()
    ) {
      dispatch(fetchCategories({ city: capitalizeAndFormat(params.city) }));
    }
  }, [params.city]);

  return (
    <>
      <Hero />
      {!categoryData?.loading && (
        <div className="listpage-heading">
          <h1> {CategoryName} </h1>
        </div>
      )}
      {/* {
        <div className="listpage-offer-container">
          <OfferContainer />
        </div>
      } */}

      {/* <div className="listpage-sub-heading">
           <h2>{CategoryName}</h2>
         </div> */}

      {categoryData?.data.length > 0 && (
        <div className="lp-card-listing-container">
          {categoryData?.data.map((item, index) => {
            return <ListCard key={index} data={item} />;
          })}
        </div>
      )}
      {hasMore &&
        (!categoryData.loading ? (
          <div className="lp-load-more">
            <button
              onClick={() => {
                getCategoryData(page + 1);
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
    fetch(`https://backendapi.trakky.in/salons/offer/?city=${city}`, requestOption)
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
