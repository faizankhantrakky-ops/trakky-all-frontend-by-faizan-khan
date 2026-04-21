import React from "react";
import { useEffect, useState } from "react";

const PopularLocations = () => {
  const colors = [
    "linear-gradient(180deg, #DCEDFD 0%, #C5E3FF 100%)",
    "linear-gradient(180deg, #F9F6F1 0%, #F4EDDB 100%)",
    "linear-gradient(180deg, #EEE5F8 0%, #CCB9E7 100%)",
  ];

  const [salonNumberData, setSalonNumberData] = useState([]);

  const getPopularLocationsData = async () => {
    let url = `https://backendapi.trakky.in/salons/popular-locations/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        let filteredData = data.filter((item) => {
          let list_ = item?.Data?.split("+ ");
          let number = parseInt(list_[0]);

          return number > 0;
        });

        setSalonNumberData(filteredData);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPopularLocationsData();
  }, []);

  return (
    <div className=" mt-3">
      <h2 className=" text-xl font-bold ml-[15px] pt-5 pb-3 md:ml-10 md:pt-8 ">
        Popular Locations
      </h2>
      <div className="max-w-full ml-[15px] md:ml-10 snap-x snap-proximity flex gap-4 overflow-scroll">
        {salonNumberData?.map((item, index) => (
          <div
            key={index}
            className=" flex flex-col gap-2 snap-start last:mr-4 md:last:mr-10"
          >
            <div
              className="w-[130px] aspect-square rounded-[24px] py-2 px-3 flex items-center justify-center text-gray-700 text-center font-bold text-lg"
              style={{ background: colors[index % colors.length] }}
            >
              {item?.Data?.split(" ")[0]}
              <br />
              {item?.Data?.split(" ").slice(1).join(" ")}
            </div>
            <div className=" text-sm text-gray-800 font-semibold text-center capitalize">
              {item?.City}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularLocations;
