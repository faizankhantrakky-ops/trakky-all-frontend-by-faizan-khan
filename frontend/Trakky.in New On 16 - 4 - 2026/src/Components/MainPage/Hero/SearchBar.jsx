import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Search from "../../../Assets/images/icons/search.svg";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { toast } from "react-hot-toast";

const SearchBar = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [searchResultList, setSearchResultList] = useState([]);
  const [searchloadingstate, setSearchloadingstate] = useState(false);

  const [locationActive, setLocationActive] = useState(false);
  const [city, setCity] = useState([]);

  // getting search result
  const getSearchResult = (text) => {
    setSearchloadingstate(true);
    axios
      .get(`https://backendapi.trakky.in/salons/search/?query=${text}`)
      .then((res) => {
        if (res.data) {
          setSearchResultList(res.data);
          setSearchloadingstate(false);
        } else {
          setSearchloadingstate(false);
          setSearchResultList([]);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleSearchbarSubmit = (e) => {
    e.preventDefault();
    if (searchResultList.length !== 0) {
      navigate(
        `/${encodeURIComponent(
          searchResultList[0]?.city?.toLowerCase()
        )}/${encodeURIComponent(
          searchResultList[0]?.area?.toLowerCase()
        )}/salons/${searchResultList[0].slug}`
      );
      window.location.reload();
    } else {
      toast.error("please enter a valid input");
    }
  };

  const getAreas = async () => {
    await fetch(`https://backendapi.trakky.in/salons/city/`)
      .then((res) => res.json())
      .then((data) => {
        setCity(data.payload);
      });
  };

  useEffect(() => {
    getAreas();
  }, []);

  return (
    <div className=" main__search_container">
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
        <img
          draggable="false"
          src={Search}
          alt="Search for salons, area and city"
        />

        <form className="search-bar" onSubmit={handleSearchbarSubmit}>
          <label
            htmlFor="search"
            id="searchLabel"
            style={{
              fontWeight: "bold",
              display: isFocused || searchText.length !== 0 ? "none" : "block",
            }}
          >
            What to Search?
          </label>
          <input
            ref={ref}
            type="text"
            placeholder="Salon name • Area • City • Category"
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
            <FmdGoodOutlinedIcon />{" "}
            {params.city
              ? params.city.charAt(0).toUpperCase() + params.city.slice(1)
              : "City"}{" "}
            <ExpandMoreOutlinedIcon />{" "}
          </div>
          {city && city.length > 0 && (
            <div
              className={`location-dialog-box ${
                locationActive ? "l-d-active" : ""
              }`}
            >
              {city &&
                city.map((item) => {
                  return (
                    <Link
                      to={`/${encodeURIComponent(
                        item?.name.toLowerCase()
                      )}/salons`}
                      onClick={() => {
                        setLocationActive(!locationActive);
                      }}
                    >
                      <p className="location-item" key={item.id}>
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
          className="search_result__container shadow-2xl  max-h-[20rem] overflow-y-auto"
          style={{
            position: "absolute",
            display: searchText === "" || !isFocused ? "none" : "block",
            top: "100%",
            width: "90%",
            left: "5%",
            zIndex: "100",
          }}
        >
          {isFocused && (
            <div>
              {searchloadingstate ? (
                <div className="flex items-center justify-center h-[3rem]">
                  <div class="loader"></div>
                </div>
              ) : searchResultList.length !== 0 ? (
                searchResultList.map((salon, index) => {
                  return (
                    <div
                      className="flex flex-col py-2 mx-5 border-b-2 border-gray-300 "
                      key={index}
                    >
                      <Link
                        to={`/${encodeURIComponent(
                          salon?.city?.toLowerCase()
                        )}/${encodeURIComponent(
                          salon?.area?.toLowerCase()
                        )}/salons/${salon.slug}`}
                        onMouseDownCapture={() => {
                          navigate(
                            `/${encodeURIComponent(
                              salon?.city?.toLowerCase()
                            )}/${encodeURIComponent(
                              salon?.area?.toLowerCase()
                            )}/salons/${salon.slug}`
                          );
                          window.location.reload();
                        }}
                        className="font-bold"
                      >
                        {salon.name}
                      </Link>
                      <p className="text-sm text-gray-500">{`${salon?.city} • ${salon?.area} • ${salon?.offer_tag} `}</p>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-[3rem]">
                  <p className="font-bold ">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
