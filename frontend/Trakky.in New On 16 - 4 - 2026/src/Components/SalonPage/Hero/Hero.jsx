import React, { useState, useEffect } from "react";
import "./Hero.css";
import Header from "../../Common/Header/Header";
import SearchBar from "../../MainPage/Hero/SearchBar";

function getWindowDimensions() {
  const width = window.innerWidth,
    height = window.innerHeight;
  return { width, height };
}
const Hero = ({isSalonP}) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header isSalonP={isSalonP} />
      {{ windowDimensions }.windowDimensions.width <= 820 ? (
        <div className="search-hero__container">
          {/* <SearchBar /> */}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export const FilterTags = (props) => {
  return (
    <>
      <FilterCard Tag={props} />
    </>
  )
}
export const FilterCard = ({Tag}) => {
  return (
    <div className="filter__card">
        <p>{Tag}</p>
    </div>
  )
}
export default Hero;