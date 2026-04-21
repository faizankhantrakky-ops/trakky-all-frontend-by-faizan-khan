import React, { useState, useRef ,useEffect} from "react";
import "./Hero.css";
import { Link,useNavigate ,useParams } from "react-router-dom";
import axios from "axios";
import Search from "./../../../Assets/images/icons/search.svg";
import Filters from "./../../../Assets/images/icons/filters.svg";


import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

const SearchBar = () => {

  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);
 
  const params = useParams();

  const [searchText, setSearchText] = useState("");
  const [searchResultList, setSearchResultList] = useState([{}]);


    const [locationActive, setLocationActive] = useState(false);
  const [cities, setcities] = useState([]);
  
  // getting search result
  const getSearchResult = (text) => {
    axios
      .get(`https://backendapi.trakky.in/spas/search/?query=${text}&verified=true`)
      .then((res) => setSearchResultList(res.data.data))
      .catch((err) => console.log(err));
  };


    const getAreas = async () => {
    await fetch(`https://backendapi.trakky.in/spas/city/`)
      .then((res) => res.json())
      .then((data) => {
        setcities(data.payload);
      });
  };

  useEffect(() => {
    getAreas();
  }, []);
  return (
    <div className="main__search_container">
      <div
        className="search__container"
        style={{
          position: "relative",
        }}
        tabIndex={0}
        onFocus={() => {
          setIsFocused(true);
          ref.current.focus();
        }}
        onBlur={() => setIsFocused(false)}
      >
        <img draggable="false" src={Search} alt="search" />

        <form className="search-bar">
          <label
            htmlFor="search"
            id="searchLabel"
            style={{
              fontWeight: "bold",
              display: isFocused || searchText.length !== 0 ? "none" : "block",
            }}
          >
            What to?
          </label>
          <input
            ref={ref}
            type="text"
            placeholder="Spa name • Area • City • Therapy"
            name="search"
            autoComplete="off"
            id="search"
            onChange={(e) => {
              setSearchText(e.target.value);
              getSearchResult(e.target.value);
            }}
            style={{
              fontSize: isFocused || searchText.length !== 0 ? "larger" : "",
            }}
          />
        </form>

         <div
          className="location-dialog"
          onClick={() => {
            return;
          }}
        >
          <div
            className="selected-location-div"
            onClick={() => {
              setLocationActive(!locationActive);
            }}
          >
            <FmdGoodOutlinedIcon /> { params.city ?( params.city.charAt(0).toUpperCase() + params.city.slice(1)) : "City" } <ExpandMoreOutlinedIcon />{" "}
          </div>
          {cities && cities.length > 0 && (
            <div
              className={`location-dialog-box ${
                locationActive ? "l-d-active" : ""
              }`}
            >
              {cities.map((item) => {
                return (
                  <Link to={`/${item?.name.toLowerCase().replaceAll(' ','-')}/spas`} onClick={() => { setLocationActive(!locationActive)}}><p className="location-item" key={item.id}>
                  {item.name}
                </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* <img
          draggable="false"
          src={Filters}
          alt=""
          style={{ height: "2.5rem" }}
        /> */}

        <div
          className="search_result__container  max-h-[20rem] overflow-y-auto "
          style={{
            position: "absolute",
            display: searchText === "" || !isFocused ? "none" : "block",
            top: "100%",
            width: "90%",
            left: "5%",
            zIndex: "9999",
          }}
        >
           {isFocused&&<ul>
              {searchResultList.map((spa, index) => {
                return (
               
                    <div className="flex flex-col py-2 mx-5 border-b-2 border-gray-300 "  key={index}>
                      <Link
                      to={`/${spa?.city?.toLowerCase().replaceAll(' ','-')}/${spa?.area?.toLowerCase().replaceAll(' ','-')}/spas/${spa.slug}`}
                      onMouseDownCapture={() => {
                        navigate(`/${spa?.city?.toLowerCase().replaceAll(' ','-')}/${spa?.area?.toLowerCase().replaceAll(' ','-')}/spas/${spa.slug}`);
                        window.location.reload();
                      }}
                      className="font-bold"
                    >
                      {spa.name}
                    </Link>
                      <p className="text-sm text-gray-500">{`${spa.city} • ${spa.area} • ${spa.offer_tag} `  }</p>
                    </div> 
                 
                );
              })}
            </ul>}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
