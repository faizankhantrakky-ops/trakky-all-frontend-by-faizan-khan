import React, { useContext, useEffect, useState } from "react";
import ListCard from "./listCard/ListCard";
import Hero from "../SalonPage/Hero/Hero";
import "./listpage.css";
import "./listpagen.css";
import { Link, useParams } from "react-router-dom";
import PopularArea from "../MainPage/PopularArea/PopularArea";
import Slider from "../Common/Slider/Slider";
import {
  capitalizeAndFormat,
  getCoordinateByCity,
} from "../functions/generalFun";
import FooterN from "../Common/Footer/FooterN";
import filter_svg from "../../Assets/images/icons/filter_icon.svg";
import down_arrow from "../../Assets/images/icons/downArrow.png";
import { Modal } from "@mui/material";
import FilterModal from "./FilterModal";
import Header from "../Common/Navbar/Header";
import OtherListCard from "./listCard/OtherListCard";
import OfferComponentN from "./OfferComponentN";

import { useSearchParams } from "react-router-dom";
import AuthContext from "../../context/Auth";

import { useNavigate } from "react-router-dom";

const ListPage = ({ title, subtitle, name }) => {
  const params = useParams();

  const navigate = useNavigate();

  const { location } = useContext(AuthContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [salonData, SetSalonData] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [handleFilterOpen, setHandleFilterOpen] = useState(false);
  const [areaData, setAreaData] = useState({});
  const [categoryData, setCategoryData] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({});

  const [activeFilterSection, setActiveFilterSection] =
    useState("Quick_Selection");

  const [filterOptionValue, setFilterOptionValue] = useState({});

  const [QuickOptions, setQuickOptions] = useState([
    {
      value: "within_5",
      name: "Within 5km",
      type: "checkbox",
    },
    {
      value: "7_9",
      name: "Score 7-9",
      type: "checkbox",
    },
    {
      value: "50_up",
      name: "50% off or more",
      type: "checkbox",
    },
  ]);

  const filterOptions = [
    {
      name: "Quick Selection",
      value: "Quick_Selection",
    },
    {
      name: "Area",
      value: "Area",
    },
    {
      name: "Service Category",
      value: "Service_Category",
    },
    {
      name: "Salon Category",
      value: "Salon_Category",
    },
    {
      name: "Price Range",
      value: "Price_Range",
    },
    {
      name: "Distance",
      value: "Distance",
    },
    {
      name: "Score",
      value: "Score",
    },
    {
      name: "Discount",
      value: "Discount",
    },
    {
      name: "Amenities",
      value: "Amenities",
    },
  ];

  const filterKeyPair = {
    Area: "exact_area",
    Service_Category: "service_category",
    Salon_Category: "salon_category",
    Score: "score",
    Amenities: "amenities",
    Discount: "discount",
    Price_Range: "price_range",
    Distance: "distance",
  };

  useEffect(() => {
    let FilterOptionValue = {
      Quick_Selection: [
        {
          value: "within_5",
          name: "Within 5km",
          type: "checkbox",
        },
        {
          value: "7_9",
          name: "Score 7-9",
          type: "checkbox",
        },
        {
          value: "50_up",
          name: "50% off or more",
          type: "checkbox",
        },
        {
          value: "cost_low_high",
          name: "Cost : Low to High",
          type: "radio",
          id: "cost",
        },
        {
          value: "cost_high_low",
          name: "Cost : High to Low",
          type: "radio",
          id: "cost",
        },
        {
          value: "popularity_high_low",
          name: "Popularity : High to Low",
          type: "radio",
          id: "popularity",
        },
        {
          value: "popularity_low_high",
          name: "Popularity : Low to High",
          type: "radio",
          id: "popularity",
        },
      ],
      Salon_Category: [
        {
          value: "top_rated",
          name: "Top Rated Salons",
          type: "checkbox",
        },
        {
          value: "bridal",
          name: "Bridal Salons",
          type: "checkbox",
        },
        {
          value: "unisex_salon",
          name: "Unisex Salons",
          type: "checkbox",
        },
        {
          value: "female_beauty_parlour",
          name: "Female Beauty Parlours",
          type: "checkbox",
        },
        {
          value: "male_salons",
          name: "Male Salons",
          type: "checkbox",
        },
        {
          value: "kids_special_salons",
          name: "Kids Special Salons",
          type: "checkbox",
        },
        {
          value: "makeup",
          name: "Mackup Salons",
          type: "checkbox",
        },
        {
          value: "salon_academy",
          name: "Salon Academy",
          type: "checkbox",
        },
      ],
      Distance: [
        // {
        //   value: "All",
        //   name: "All",
        //   type: "radio",
        //   id: "distance",
        // },
        {
          value: "within_2",
          name: "Within 2km",
          type: "radio",
          id: "distance",
        },
        {
          value: "within_5",
          name: "Within 5km",
          type: "radio",
          id: "distance",
        },
        {
          value: "within_10",
          name: "Within 10km",
          type: "radio",
          id: "distance",
        },
        {
          value: "within_15",
          name: "Within 15km",
          type: "radio",
          id: "distance",
        },
        {
          value: "within_999",
          name: "Distance : Nearby to Far",
          type: "radio",
          id: "distance",
        },
      ],
      Score: [
        {
          value: "9_up",
          name: "Score 9+",
          type: "radio",
          id: "score",
        },
        {
          value: "7_9",
          name: "Score 7-9",
          type: "radio",
          id: "score",
        },
        {
          value: "down_7",
          name: "Below 7",
          type: "radio",
          id: "score",
        },
      ],
      Discount: [
        {
          value: "down_10",
          name: "Upto 10% Off",
          type: "radio",
          id: "discount",
        },
        {
          value: "15_25",
          name: "15% to 25% off",
          type: "radio",
          id: "discount",
        },
        {
          value: "30_45",
          name: "30% to 45% off",
          type: "radio",
          id: "discount",
        },

        {
          value: "50_up",
          name: "50% off or more",
          type: "radio",
          id: "discount",
        },
      ],
      Amenities: [
        {
          value: "Washroom",
          name: "Washroom",
          type: "checkbox",
        },
        {
          value: "Parking",
          name: "Parking",
          type: "checkbox",
        },
        {
          value: "Sanitization",
          name: "Hygiene",
          type: "checkbox",
        },
        {
          value: "Air conditioning",
          name: "Air conditioning",
          type: "checkbox",
        },
        {
          value: "Music",
          name: "Music",
          type: "checkbox",
        },
      ],
      Price_Range: [
        {
          value: "0_1000",
          name: "Less than ₹1000",
          type: "checkbox",
        },
        {
          value: "1000_2000",
          name: "₹1000 to ₹2000",
          type: "checkbox",
        },
        {
          value: "2000_3000",
          name: "₹2000 to ₹3000",
          type: "checkbox",
        },
        {
          value: "3000_4000",
          name: "₹3000 to ₹4000",
          type: "checkbox",
        },
        {
          value: "4000_99999",
          name: "₹4000 or more",
          type: "checkbox",
        },
      ],
    };
    setFilterOptionValue(FilterOptionValue);
  }, []);

  useEffect(() => {
    let area = areaData[0]?.area_names?.map((item) => {
      return {
        value: item,
        name: item,
        type: "radio",
        id: "area",
      };
    });

    let serviceCategory = categoryData?.map((item) => {
      return {
        value: item?.id,
        name: item?.name + " (" + item?.category_gender + ")",
        type: "checkbox",
      };
    });

    setFilterOptionValue((prevState) => ({
      ...prevState,
      Area: area,
      Service_Category: serviceCategory,
    }));
  }, [areaData, categoryData]);

  const getSalonData = async (pageCount) => {
    setLoading(true);

    if (pageCount === 1) {
      setIsNextPage(false);
    }

    let url = `https://backendapi.trakky.in/salons/list/?page=${pageCount}&city=${params?.city}`;

    if (searchParams) {
      let params = new URLSearchParams(searchParams);

      let filter_str = "";

      if (params.has("area") && !params.has("exact_area")) {
        filter_str += `&nearby_area=${params.get("area")}`;
      }

      if (params.has("exact_area")) {
        params.delete("area");
      }

      params.forEach((value, key) => {
        filter_str += `&${key}=${value}`;
      });

      url += filter_str;
    }

    try {
      let res = await fetch(url);

      let data = await res.json();
      setIsNextPage(data?.next);
      if (pageCount === 1) {
        SetSalonData(data?.results);
      }
      if (pageCount > 1) {
        SetSalonData([...salonData, ...data?.results]);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getAresData = async () => {
    let url = `https://backendapi.trakky.in/salons/city/?name=${params?.city}`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      setAreaData(data?.payload);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const serviceCategoryData = async () => {
    let url = `https://backendapi.trakky.in/salons/category/?city=${params?.city}`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (res?.status === 200) {
        setCategoryData(data);
      }
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    getAresData();
    serviceCategoryData();
  }, []);

  useEffect(() => {
    if (searchParams) {
      let params = new URLSearchParams(searchParams);

      let selected_filter_obj = {};

      params.forEach((value, key) => {
        if (key === "exact_area") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Area: [
              {
                value: value,
                name: value,
              },
            ],
          };
        } else if (key === "service_category") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Service_Category: value.split(",").map((item) => {
              return {
                value: item,
                name: filterOptionValue?.Service_Category?.filter((item1) => {
                  return item1.value == item;
                })?.[0]?.name,
              };
            }),
          };
        } else if (key === "salon_category") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Salon_Category: value.split(",").map((item) => {
              return {
                value: item,
                name: filterOptionValue?.Salon_Category?.filter((item1) => {
                  return item1.value == item;
                })?.[0]?.name,
              };
            }),
          };
        } else if (key === "score") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Score: [
              {
                value: value,
                name: filterOptionValue?.Score?.filter((item1) => {
                  return item1.value == value;
                })?.[0]?.name,
              },
            ],
          };

          // remove score from quick selection
          setQuickOptions((prevState) => {
            return prevState.filter((item) => item.value !== value);
          });
        } else if (key === "amenities") {
          selected_filter_obj = {
            ...selected_filter_obj,

            Amenities: value.split(",").map((item) => {
              return {
                value: item,
                name: filterOptionValue?.Amenities?.filter((item1) => {
                  return item1.value == item;
                })?.[0]?.name,
              };
            }),
          };
        } else if (key === "discount") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Discount: [
              {
                value: value,
                name: filterOptionValue?.Discount?.filter((item1) => {
                  return item1.value == value;
                })?.[0]?.name,
              },
            ],
          };

          // remove discount from quick selection
          setQuickOptions((prevState) => {
            return prevState.filter((item) => item.value !== value);
          });
        } else if (key === "price_range") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Price_Range: value.split(",").map((item) => {
              return {
                value: item,
                name: filterOptionValue?.Price_Range?.filter((item1) => {
                  return item1.value == item;
                })?.[0]?.name,
              };
            }),
          };
        } else if (key === "distance") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Distance: [
              {
                value: value,
                name: filterOptionValue?.Distance?.filter((item1) => {
                  return item1.value == value;
                })?.[0]?.name,
              },
            ],
          };

          // remove distance from quick selection
          setQuickOptions((prevState) => {
            return prevState.filter((item) => item.value !== value);
          });
        } else if (key === "cost") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Quick_Selection: [
              {
                value: `cost_${value}`,
                name: filterOptionValue?.Quick_Selection?.filter((item1) => {
                  return item1.value == `cost_${value}`;
                })?.[0]?.name,
              },
            ],
          };
        } else if (key === "popularity") {
          selected_filter_obj = {
            ...selected_filter_obj,
            Quick_Selection: [
              {
                value: `popularity_${value}`,
                name: filterOptionValue?.Quick_Selection.filter((item1) => {
                  return item1.value == `popularity_${value}`;
                })?.[0]?.name,
              },
            ],
          };
        }
      });

      setSelectedFilters(selected_filter_obj);
    }
  }, [filterOptionValue]);

  useEffect(() => {
    getSalonData(page);
  }, [params?.city, page, searchParams]);

  const addOrUpdateQueryParam = (arr) => {
    const params = new URLSearchParams();

    arr.forEach((item) => {
      params.set(item.key, item.value);
    });

    setSearchParams(params.toString());
  };

  const deleteSpecificQueryParam = (key, value, isCoordinate = false) => {
    const params = new URLSearchParams(searchParams);

    if (key === "Quick_Selection") {
      if (value === "cost_low_high" || value === "cost_high_low") {
        params.delete("cost");
      }
      if (value === "popularity_high_low" || value === "popularity_low_high") {
        params.delete("popularity");
      }
    }

    if (isCoordinate) {
      params.delete("latitude");
      params.delete("longitude");
    }

    let queryValue = params.get(filterKeyPair[key]);

    if (queryValue?.includes(",")) {
      let queryValueArr = queryValue.split(",");
      queryValueArr = queryValueArr.filter((item) => item !== value);
      queryValue = queryValueArr.join(",");
    } else {
      queryValue = "";
    }

    if (queryValue) {
      params.set(filterKeyPair[key], queryValue);
    } else {
      params.delete(filterKeyPair[key]);
    }

    setSearchParams(params.toString());
  };

  const clearAllQueryParams = () => {
    setSearchParams("");
    setQuickOptions([
      {
        value: "within_5",
        name: "Within 5km",
        type: "checkbox",
      },
      {
        value: "7_9",
        name: "Score 7-9",
        type: "checkbox",
      },
      {
        value: "50_up",
        name: "50% off or more",
        type: "checkbox",
      },
    ]);
  };

  const applyFilters = async () => {
    let filter_str = "";
    let params_arr = [];

    if (selectedFilters?.["Area"]) {
      filter_str += `&exact_area=${selectedFilters?.["Area"][0]?.value}`;

      params_arr.push({
        key: "exact_area",
        value: selectedFilters?.["Area"][0]?.value,
      });
    }

    if (selectedFilters?.["Service_Category"]) {
      if (selectedFilters?.["Service_Category"].length > 0) {
        let serviceCategory = selectedFilters?.["Service_Category"]
          ?.map((item) => item.value)
          .join(",");

        filter_str += `&service_category=${serviceCategory}`;

        params_arr.push({
          key: "service_category",
          value: serviceCategory,
        });
      }
    }

    if (selectedFilters?.["Salon_Category"]) {
      if (selectedFilters?.["Salon_Category"].length > 0) {
        filter_str += `&salon_category=${selectedFilters?.["Salon_Category"]
          .map((item) => item.value)
          .join(",")}`;

        params_arr.push({
          key: "salon_category",
          value: selectedFilters?.["Salon_Category"]
            .map((item) => item.value)
            .join(","),
        });
      }
    }

    if (selectedFilters?.["Score"]) {
      filter_str += `&score=${selectedFilters?.["Score"][0]?.value}`;

      params_arr.push({
        key: "score",
        value: selectedFilters?.["Score"][0]?.value,
      });
    }

    if (selectedFilters?.["Amenities"]) {
      if (selectedFilters?.["Amenities"].length > 0) {
        filter_str += `&amenities=${selectedFilters?.["Amenities"]
          .map((item) => item.value)
          .join(",")}`;

        params_arr.push({
          key: "amenities",
          value: selectedFilters?.["Amenities"]
            .map((item) => item.value)
            .join(","),
        });
      }
    }

    if (selectedFilters?.["Discount"]) {
      filter_str += `&discount=${selectedFilters?.["Discount"][0]?.value}`;

      params_arr.push({
        key: "discount",
        value: selectedFilters?.["Discount"][0]?.value,
      });
    }

    if (selectedFilters?.["Price_Range"]) {
      if (selectedFilters?.["Price_Range"].length > 0) {
        filter_str += `&price_range=${selectedFilters?.["Price_Range"]
          .map((item) => item.value)
          .join(",")}`;

        params_arr.push({
          key: "price_range",
          value: selectedFilters?.["Price_Range"]
            .map((item) => item.value)
            .join(","),
        });
      }
    }

    if (selectedFilters?.["Distance"]) {
      if (selectedFilters?.["Distance"].length > 0) {
        let latLong = {
          latitude: location?.latitude,
          longitude: location?.longitude,
        };

        if (latLong?.latitude == 0 && latLong?.longitude == 0) {
          latLong = await getCoordinateByCity(
            capitalizeAndFormat(params?.city) || "ahmedabad"
          );
        }

        filter_str += `&distance=${selectedFilters?.["Distance"][0]?.value}&latitude=${latLong?.latitude}&longitude=${latLong?.longitude}`;

        params_arr.push({
          key: "distance",
          value: selectedFilters?.["Distance"][0]?.value,
        });
        params_arr.push({
          key: "latitude",
          value: latLong?.latitude,
        });
        params_arr.push({
          key: "longitude",
          value: latLong?.longitude,
        });
      }
    }

    if (selectedFilters?.["Quick_Selection"]) {
      if (selectedFilters?.["Quick_Selection"].length > 0) {
        if (
          selectedFilters?.["Quick_Selection"].some(
            (item) => item.value === "cost_low_high"
          )
        ) {
          filter_str += `&cost=low_high`;
          params_arr.push({
            key: "cost",
            value: "low_high",
          });
        }
        if (
          selectedFilters?.["Quick_Selection"].some(
            (item) => item.value === "cost_high_low"
          )
        ) {
          filter_str += `&cost=high_low`;
          params_arr.push({
            key: "cost",
            value: "high_low",
          });
        }
        if (
          selectedFilters?.["Quick_Selection"].some(
            (item) => item.value === "popularity_high_low"
          )
        ) {
          filter_str += `&popularity=high_low`;
          params_arr.push({
            key: "popularity",
            value: "high_low",
          });
        }
        if (
          selectedFilters?.["Quick_Selection"].some(
            (item) => item.value === "popularity_low_high"
          )
        ) {
          filter_str += `&popularity=low_high`;
          params_arr.push({
            key: "popularity",
            value: "low_high",
          });
        }
      }
    }

    addOrUpdateQueryParam(params_arr);
  };

  // window.onpopstate = (e) => {
  //   setSearchParams("");
  //   setSelectedFilters({});
  //   setQuickOptions([
  //     {
  //       value: "within_5",
  //       name: "Within 5km",
  //       type: "checkbox",
  //     },
  //     {
  //       value: "7_9",
  //       name: "Score 7-9",
  //       type: "checkbox",
  //     },
  //     {
  //       value: "50_up",
  //       name: "50% off or more",
  //       type: "checkbox",
  //     },
  //   ]);

  // };

  return (
    <>
      <div className="N-list-page-container relative">
        <div className="N-list-page-background-color"></div>
        <Header />

        <div className="L-list-page-option-n-filter">
          <div
            className="filter-box"
            onClick={() => {
              setHandleFilterOpen(true);
            }}
          >
            <span>Filters</span>
            <img src={filter_svg} alt="Apply Filters" />
          </div>
          {Object.keys(selectedFilters).length > 0 &&
            Object.keys(selectedFilters).map((key, index) => {
              return (
                selectedFilters[key].length > 0 &&
                selectedFilters[key].map((item, index) => {
                  return (
                    (!(key == "Quick_Selection") ||
                      !(
                        item.value == "within_5" ||
                        item.value == "7_9" ||
                        item.value == "50_up"
                      )) && (
                      <div
                        className="sort-box !bg-[#512DC8] text-white text-sm"
                        key={index}
                      >
                        <span className=" text-sm max-w-[125px] line-clamp-1">
                          {item?.name}
                        </span>
                        <button
                          className="bg-none outline-none font-semibold rotate-45 text-[22px] leading-5 ml-2 active:scale-90"
                          onClick={() => {
                            if (item && item.value === "within_5") {
                              setSelectedFilters((prevFilters) => ({
                                ...prevFilters,
                                ["Quick_Selection"]: Array.isArray(
                                  prevFilters["Quick_Selection"]
                                )
                                  ? prevFilters["Quick_Selection"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                                ["Distance"]: Array.isArray(
                                  prevFilters["Distance"]
                                )
                                  ? prevFilters["Distance"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                              }));

                              setQuickOptions((prevState) => {
                                return [
                                  ...prevState,
                                  {
                                    value: "within_5",
                                    name: "Within 5km",
                                    type: "checkbox",
                                  },
                                ];
                              });
                            } else if (item && item.value === "7_9") {
                              setSelectedFilters((prevFilters) => ({
                                ...prevFilters,
                                ["Quick_Selection"]: Array.isArray(
                                  prevFilters["Quick_Selection"]
                                )
                                  ? prevFilters["Quick_Selection"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                                ["Score"]: Array.isArray(prevFilters["Score"])
                                  ? prevFilters["Score"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                              }));

                              setQuickOptions((prevState) => {
                                return [
                                  ...prevState,
                                  {
                                    value: "7_9",
                                    name: "Score 7-9",
                                    type: "checkbox",
                                  },
                                ];
                              });
                            } else if (item && item.value === "50_up") {
                              setSelectedFilters((prevFilters) => ({
                                ...prevFilters,
                                ["Quick_Selection"]: Array.isArray(
                                  prevFilters["Quick_Selection"]
                                )
                                  ? prevFilters["Quick_Selection"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                                ["Discount"]: Array.isArray(
                                  prevFilters["Discount"]
                                )
                                  ? prevFilters["Discount"].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                              }));

                              setQuickOptions((prevState) => {
                                return [
                                  ...prevState,
                                  {
                                    value: "50_up",
                                    name: "50% off or more",
                                    type: "checkbox",
                                  },
                                ];
                              });
                            } else {
                              setSelectedFilters((prevFilters) => ({
                                ...prevFilters,
                                [key]: Array.isArray(prevFilters[key])
                                  ? prevFilters[key].filter(
                                      (i) => i && i.value !== item.value
                                    )
                                  : [],
                              }));
                            }

                            if (key == "Distance" || item.value == "within_5") {
                              deleteSpecificQueryParam(
                                key,
                                item && item.value,
                                true
                              );
                            } else {
                              deleteSpecificQueryParam(
                                key,
                                item && item.value,
                                false
                              );
                            }
                          }}
                        >
                          +
                        </button>
                      </div>
                    )
                  );
                })
              );
            })}

          {QuickOptions.map((item, index) => {
            return (
              <div className="sort-box" key={index}>
                <button
                  className=""
                  onClick={async () => {
                    let sparams = new URLSearchParams(searchParams);

                    if (item.value == "within_5") {
                      let latLong = {
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                      };

                      if (latLong?.latitude == 0 && latLong?.longitude == 0) {
                        latLong = await getCoordinateByCity(
                          capitalizeAndFormat(params?.city) || "ahmedabad"
                        );
                      }

                      setSelectedFilters({
                        ...selectedFilters,
                        ["Quick_Selection"]: [
                          ...(selectedFilters["Quick_Selection"] || []),
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                        ["Distance"]: [
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                      });

                      sparams.set("distance", "within_5");
                      sparams.set("latitude", latLong?.latitude);
                      sparams.set("longitude", latLong?.longitude);
                    } else if (item.value == "7_9") {
                      setSelectedFilters({
                        ...selectedFilters,
                        ["Quick_Selection"]: [
                          ...(selectedFilters["Quick_Selection"] || []),
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                        ["Score"]: [
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                      });

                      sparams.set("score", "7_9");
                    } else if (item.value == "50_up") {
                      setSelectedFilters({
                        ...selectedFilters,
                        ["Quick_Selection"]: [
                          ...(selectedFilters["Quick_Selection"] || []),
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                        ["Discount"]: [
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                      });
                      sparams.set("discount", "50_up");
                    } else {
                      setSelectedFilters({
                        ...selectedFilters,
                        ["Quick_Selection"]: [
                          ...(selectedFilters["Quick_Selection"] || []),
                          {
                            value: item.value,
                            name: item.name,
                          },
                        ],
                      });
                    }

                    setQuickOptions((prevState) => {
                      return prevState?.filter(
                        (item1) => item1.value != item.value
                      );
                    });

                    setSearchParams(sparams.toString());
                  }}
                >
                  <span>{item.name}</span>
                </button>
              </div>
            );
          })}
        </div>

        <OfferComponentN title={"Grab The Best Offers"} />

      <div className="N-listpage-heading">
  <h1>Best Salons Near You In {capitalizeAndFormat(params?.city)}</h1>
</div>
        <div className="N-lp-card-listing-container">
          {loading ? (
            <div className="N-lp-load-more">
              <div className="N-lp-loader"></div>
            </div>
          ) : salonData?.length > 0 ? (
            salonData?.map((item, index) => {
              return <OtherListCard key={index} data={item} showBool={true} />;
            })
          ) : (
            <div className=" w-fit mx-auto my-9 text-lg font-semibold">
              No salon found
            </div>
          )}
        </div>
        {isNextPage &&
          (!loading ? (
            <div className="N-lp-load-more">
              <button
                onClick={() => {
                  setPage(page + 1);
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

      <Modal open={handleFilterOpen}>
        <FilterModal
          onClose={() => {
            setHandleFilterOpen(false);
          }}
          areaData={areaData}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          applyFilters={applyFilters}
          clearAllQueryParams={clearAllQueryParams}
          filterOptionValue={filterOptionValue}
          filterOptions={filterOptions}
          activeFilterSection={activeFilterSection}
          setActiveFilterSection={setActiveFilterSection}
          QuickOptions={QuickOptions}
          setQuickOptions={setQuickOptions}
        />
      </Modal>
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
