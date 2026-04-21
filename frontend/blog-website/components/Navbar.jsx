import style from "../styles/navbar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = ({ blogs, cities, categories }) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [city, setCity] = useState("");
  const cityList = cities;

  const [locationActive, setLocationActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [serchCategoryExist, setSearchCategoryExist] = useState([]);
  const list = [
    "beauty",
    "beauty-salon",
    "unisex-salon",
    "salon-in-ahmedabad",
    "salon-in-prahlad-nagar",
    "male-salon",
    "female-salon",
    "salon-in-sindhu-bhavan",
    "beauty-salon-in-bopal",
    "beauty-salon-in-sindhu-bhavan",
    "salon-in-bopal",
    "spa-in-bopal",
    "spa-in-sindhu-bhavan",
    "spa-in-gota",
    "salon-in-gota",
    "spa-in-prahlad-nagar",
    "salon-near-ashram-road",
    "spa-near-ashram-road",
    "best-salon-in-ahmedabad",
    "spa-in-ahmedabad",
    "best-spa-in-ahmedabad",
    "spa-in-gandhinagar",
    "best-spa-in-gandhinagar",
  ];

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    // if enter click then redirect to search page

    const filteredBlogs = blogs?.filter((blog) => {
      if (city === "") {
        return (
          blog.title.toLowerCase().includes(inputValue.toLowerCase()) ||
          blog.categories_names.some((category) =>
            category.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      }

      const includesTitle =
        blog.title.toLowerCase().includes(inputValue.toLowerCase()) &&
        blog.city.toLowerCase() === city.toLowerCase();
      const includesCategory = blog.categories_names.some(
        (category) =>
          category.toLowerCase().includes(inputValue.toLowerCase()) &&
          blog.city.toLowerCase() === city.toLowerCase()
      );

      return includesTitle || includesCategory;
    });

    let categoryExist = categories?.filter((category) => {
      return category?.name.toLowerCase().includes(inputValue.toLowerCase());
    });


    setSearchCategoryExist(categoryExist?.splice(0, 3));
    setSearchResults(filteredBlogs);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };
  return (
    <>
      <div className={style.nav}>
        <div className={style.headerTitle}>
          <Link
            href="/"
            style={{
              height: "100%",
            }}
          >
            <img
              className={style.trakkyLogo}
              src="/logo-text-white-1@2x.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className={style.searchSection}>
          <div className={style.navHeroText}>
            Best salon & spa booking platform of india
          </div>
          <div className={style.searchBarDiv}>
            <div className={style.searchBar}>
              <img src="/search.svg" alt="search" />
              <input
                className={style.searchInput}
                type="text"
                placeholder="Search for a blog..."
                value={query}
                onChange={handleSearch}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (list.includes(query.split(" ").join("-"))) {
                      setQuery("");
                      router.push(`/search/${query.split(" ").join("-")}`);
                    }
                  }
                }}
              />
              {query !== "" && (
                <div className={style.searchResults}>
                  {searchResults.length > 0 ||
                  serchCategoryExist?.length > 0 ? (
                    <>
                      {serchCategoryExist?.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className={
                            style.resultLink + " " + style.categoryLinkSearch
                          }
                          style={{
                            paddingBlock: "10px",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            height: "40px",
                            lineHeight: "20px",
                            paddingRight: "5px",
                            minHeight: "40px",
                          }}
                          onClick={() => setQuery("")}
                        >
                          <span
                            style={{
                              height: "12px",
                              maxHeight: "12px",
                              paddingLeft: "15px",
                            }}
                          >
                            <img
                              src="/double-arrow-right-icon.svg"
                              alt=""
                              style={{
                                height: "12px",
                              }}
                            />
                          </span>
                          {category?.name}
                        </Link>
                      ))}
                      {searchResults?.map((result) => (
                        <Link
                          key={result.slug}
                          href={`/${result.slug}`}
                          className={style.resultLink}
                        >
                          <div className={style.searchResult}>
                            <img
                              src={result.image_blog.url}
                              alt="blog image"
                              width={100}
                              height={100}
                            />
                            <div className={style.searchResultText}>
                              <div className={style.searchResultTitle}>
                                {result.title}
                              </div>
                              <div className={style.searchResultCategory}>
                                {result.categories_names.map(
                                  (category, index) => (
                                    <div key={index}>{category}</div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div className={style.noResult}>No results found</div>
                  )}
                </div>
              )}
            </div>

            <div className={style.searchCity}>
              <img src="/location_on.svg" alt="" />

              {windowWidth < 768 ? (
                <>
                  <div className={style.cityName}>
                    <select
                      onChange={handleCity}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <option value="" style={{}}>
                        Select City
                      </option>
                      {cityList?.map((city, index) => (
                        <option key={index} value={city} style={{}}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={style.cityNameWindow}
                    onClick={() => setLocationActive(!locationActive)}
                  >
                    {city === "" ? "Select City" : city}
                  </div>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => setLocationActive(!locationActive)}
                  >
                    <img src="/arrow.png" alt="" />
                  </span>
                  <div
                    className={
                      style.location_dialog_box +
                      " " +
                      (locationActive ? style.l_d_active : "")
                    }
                  >
                    {cityList.map((item) => {
                      return (
                        <button
                          onClick={() => {
                            setCity(item);
                            setLocationActive(!locationActive);
                          }}
                        >
                          <p className="location-item" key={item.id}>
                            {item}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      display: locationActive ? "block" : "none",
                      zIndex: "999",
                    }}
                    onClick={() => setLocationActive(!locationActive)}
                  ></div>
                </>
              )}

              {/* <img src="/arrow.png" alt="" /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
