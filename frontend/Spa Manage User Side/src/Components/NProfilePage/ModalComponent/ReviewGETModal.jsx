import React, { useEffect, useState } from "react";
import leftArrow from "../../../Assets/images/icons/back-left-arrow.svg";
import reviewIcon from "../../../Assets/images/icons/rating_svg.svg";
import { MenuItem, Rating, Select } from "@mui/material";

import ReviewPen from "../../../Assets/images/icons/Review_pen.svg";
import ReviewPerson from "../../../Assets/images/icons/Review_person.svg";

import HygieneSvg from "../../../Assets/images/review/Hygiene.svg";
import ValueForMoneySvg from "../../../Assets/images/review/ValueForMoney.svg";
import staffSvg from "../../../Assets/images/review/staff.svg";
import massageTherapySvg from "../../../Assets/images/review/MassageTherapy.svg";
import behaviourSvg from "../../../Assets/images/review/Behavior.svg";
import crossIcon from "../../../Assets/images/icons/crossIcon_svg.svg";

import moment from "moment";

const ReviewGETModal = ({ onClose, spa, handleReviewPostOpen, spaReviews }) => {
  const [filterSelected, setFilterSelected] = useState("Most recent");
  const [spaReviewStatistics, setSpaReviewStatistics] = useState(null);
  const [categorizedSpaReviewsState, setCategorizedSpaReviewsState] =
    useState(null);
  const [visibleStateCategory, setVisibleStateCategory] = useState({
    start : 0,
    end : 2
  });

  let sortedReviews = spaReviews?.sort((a, b) => {
    if (filterSelected === "Most recent") {
      return moment(b.created_at) - moment(a.created_at);
    } else if (filterSelected === "High rated") {
      return b.overall_rating - a.overall_rating;
    } else if (filterSelected === "low rated") {
      return a.overall_rating - b.overall_rating;
    }
  });

  const GetSpaReviewStatistics = async (id) => {
    let url = `https://backendapi.trakky.in/spas/spareviewcalculation/${id}/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSpaReviewStatistics(data?.[0]);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (spa?.id) {
      GetSpaReviewStatistics(spa?.id);
    }
  }, [spa?.id]);

  useEffect(() => {
    let states = [
      {
        name: "Hygiene",
        icon: HygieneSvg,
        avg: spaReviewStatistics?.review?.avg_hygiene?.toFixed(1) || 0,
      },
      {
        name: "Value for Money",
        icon: ValueForMoneySvg,
        avg: spaReviewStatistics?.review?.avg_value_for_money?.toFixed(1) || 0,
      },
      {
        name: "Staff",
        icon: staffSvg,
        avg: spaReviewStatistics?.review?.avg_staff?.toFixed(1) || 0,
      },
      {
        name: "Massage Therapy",
        icon: massageTherapySvg,
        avg: spaReviewStatistics?.review?.avg_massage_therapy?.toFixed(1) || 0,
      },
      {
        name: "Behaviour",
        icon: behaviourSvg,
        avg: spaReviewStatistics?.review?.avg_behavior?.toFixed(1) || 0,
      },
    ];

    setCategorizedSpaReviewsState(states);
  }, [spaReviewStatistics]);

  useEffect(() => {
    // change in three option every 3 seconds
    const interval = setInterval(() => {
      setVisibleStateCategory((prev) => {
        let start = prev.start + 2;
        let end = prev.end + 2;
        if (end > 7) {
          start = 0;
          end = 2;
        }
        return {
          start,
          end
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" h-full w-full bg-white p-4 overflow-scroll mx-auto sm:max-w-[600px] sm:max-h-[90vh] sm:mx-auto sm:-translate-y-1/2 sm:relative sm:top-1/2 sm:rounded-xl ">
      <div className=" flex gap-3 justify-start items-center" onClick={onClose}>
        <img src={leftArrow} alt="left arrow" className=" h-4 aspect-square " />
        <h1 className="text-xl font-semibold grow">{spa?.name}</h1>
        <div className=" invisible sm:!visible flex cursor-pointer w-7 h-7 rounded-full bg-gray-200 text-white items-center justify-center" onClick={
          onClose
        }>
          <img src={crossIcon} alt="cross arrow" className=" h-3 w-3" />
        </div>
      </div>
      <div className=" flex justify-between items-center gap-1 py-4">
        <div className=" flex gap-1 justify-start items-center">
          <img
            src={reviewIcon}
            alt="review icon"
            className=" h-6 aspect-square object-cover"
          />
          <span className=" text-xl font-semibold">
            {spa?.avg_review?.toFixed(1) || "NA"}
          </span>
        </div>
        <button
          className=" border-none flex items-center gap-2 outline-none rounded-md px-[10px] py-[6px] bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white text-center"
          onClick={handleReviewPostOpen}
        >
          <img src={ReviewPen} className=" h-3 w-3" alt="review pen" />
          Write a review
        </button>
      </div>
      <div className=" flex gap-2 items-center">
        <div className=" basis-1/2 shrink-0 grow-0 p-1 flex gap-2">
          <div className=" w-10/12">
            <div className=" h-6 leading-6">
              <span className=" text-base font-medium leading-6">
                Overall rating
              </span>
            </div>
            <div className=" h-[110px] mt-1">
              <div className=" flex gap-2 items-center h-[22px]">
                <span className=" text-xs text-slate-700">5</span>
                <div className=" w-full h-[6px] rounded-lg bg-gray-200 relative">
                  <div
                    className={`absolute left-0 top-0 h-[6px] rounded-s-lg z-10 bg-black opacity-80`}
                    style={{
                      width: `${
                        (spaReviewStatistics?.count?.count_rating_5 /
                          spaReviewStatistics?.count
                            ?.count_rating_total_users) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className=" flex gap-2 items-center h-[22px]">
                <span className=" text-xs text-slate-700">4</span>
                <div className=" w-full h-[6px] rounded-lg bg-gray-200 relative">
                  <div
                    className=" absolute left-0 top-0 h-[6px] rounded-s-lg z-10 bg-black opacity-80"
                    style={{
                      width: `${
                        (spaReviewStatistics?.count?.count_rating_4 /
                          spaReviewStatistics?.count
                            ?.count_rating_total_users) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className=" flex gap-2 items-center h-[22px]">
                <span className=" text-xs text-slate-700">3</span>
                <div className=" w-full h-[6px] rounded-lg bg-gray-200 relative">
                  <div
                    className=" absolute left-0 top-0 h-[6px] rounded-s-lg z-10 bg-black opacity-80"
                    style={{
                      width: `${
                        (spaReviewStatistics?.count?.count_rating_3 /
                          spaReviewStatistics?.count
                            ?.count_rating_total_users) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className=" flex gap-2 items-center h-[22px]">
                <span className=" text-xs text-slate-700">2</span>
                <div className=" w-full h-[6px] rounded-lg bg-gray-200 relative">
                  <div
                    className=" absolute left-0 top-0 h-[6px] rounded-s-lg z-10 bg-black opacity-80"
                    style={{
                      width: `${
                        (spaReviewStatistics?.count?.count_rating_2 /
                          spaReviewStatistics?.count
                            ?.count_rating_total_users) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className=" flex gap-2 items-center h-[22px]">
                <span className=" text-xs text-slate-700">1</span>
                <div className=" w-full h-[6px] rounded-lg bg-gray-200 relative">
                  <div
                    className=" absolute left-0 top-0 h-[6px] rounded-s-lg z-10 bg-black opacity-80"
                    style={{
                      width: `${
                        (spaReviewStatistics?.count?.count_rating_1 /
                          spaReviewStatistics?.count
                            ?.count_rating_total_users) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-2/12">
            <div className=" h-6 flex items-center justify-center">
              <img src={ReviewPerson} className=" h-3 aspect-square" alt="" />
            </div>
            <div className=" h-[110px] mt-1">
              <div className=" flex items-center justify-center h-[22px] text-xs text-slate-700">
                {spaReviewStatistics?.count?.count_rating_5 || 0}
              </div>
              <div className=" flex items-center justify-center h-[22px] text-xs text-slate-700">
                {spaReviewStatistics?.count?.count_rating_4 || 0}
              </div>
              <div className=" flex items-center justify-center h-[22px] text-xs text-slate-700">
                {spaReviewStatistics?.count?.count_rating_3 || 0}
              </div>
              <div className=" flex items-center justify-center h-[22px] text-xs text-slate-700">
                {spaReviewStatistics?.count?.count_rating_2 || 0}
              </div>
              <div className=" flex items-center justify-center h-[22px] text-xs text-slate-700">
                {spaReviewStatistics?.count?.count_rating_1 || 0}
              </div>
            </div>
          </div>
        </div>
        {categorizedSpaReviewsState?.slice(visibleStateCategory?.start , visibleStateCategory?.end).map((item) => {
          return (
            <div className=" basis-1/4 h-fit shrink grow p-1 border-l border-slate-200">
              <div className="pl-3 pr-2 flex flex-col gap-3">
                <div className=" ">
                  <div className=" text-xs font-light leading-4 h-8 line-clamp-2">
                    {item?.name}
                  </div>
                  <div className=" text-sm font-semibold">
                    {item?.avg || 0}
                  </div>
                </div>
                <div className=" h-7 aspect-square">
                  <img
                    src={item?.icon}
                    alt="reivew"
                    className=" h-7 aspect-square object-contain"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className=" flex justify-between items-center py-4">
        <div className=" text-lg font-semibold">
          {spaReviews?.length || "No"} reviews
        </div>
        <Select
          onChange={(e) => setFilterSelected(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          value={filterSelected || "Most recent"}
          size="small"
          sx={{
            border: "none",
            outline: "none",
            fontSize: "14px",
            paddingBlock: "0px",
            borderRadius: "25px",
            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray",
              borderWidth: "1px",
            },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "gray",
                borderWidth: "1px",
              },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "10px",
                marginTop: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.20)",
                paddingTop: "0px",
              },
            },
          }}
        >
          <MenuItem value="Most recent">Most recent</MenuItem>
          <MenuItem value="High rated">High rated</MenuItem>
          <MenuItem value="low rated">Low rated</MenuItem>
        </Select>
      </div>
      <div className=" w-full flex flex-col gap-5 p-1">
        {sortedReviews?.map((item) => (
          <div className=" flex flex-col gap-2">
            <div className=" flex gap-2 items-center">
              <div className=" h-12 w-12 rounded-full bg-gray-200"></div>
              <div className=" flex flex-col justify-center items-start">
                <h2 className=" text-lg font-medium leading-5 line-clamp-1">
                  {item?.name || "Anonymous"}
                </h2>
                <p className=" text-sm text-slate-600">
                  {item?.area || spa?.area} , {item?.city || spa?.city}
                </p>
              </div>
            </div>
            <div className=" flex gap-1 items-center">
              <Rating
                name="read-only"
                value={item?.overall_rating || 0}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#512DC8",
                  },
                }}
              />
              <span className=" h-1 w-1 bg-[#000] rounded-full block"></span>
              <span className=" text-xs text-slate-600">
                {moment(item?.created_at)?.format("MMM DD, YYYY")}
              </span>
            </div>
            <div className=" flex flex-col gap-[2px]">
              <p>{item?.review}</p>
              {
                item?.mul_images?.length > 0 && (
                  <div className=" flex h-24 mt-1 w-full gap-2 overflow-scroll">
                    {item?.mul_images?.map((img) => {
                      return (
                        <div className=" w-24 bg-slate-100 aspect-square">
                          <img
                            src={img?.image}
                            alt="review"
                            className=" w-full h-full object-cover rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewGETModal;
