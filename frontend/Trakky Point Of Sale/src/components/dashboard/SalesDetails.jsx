import React from "react";
import Card from "../Dashbord_cards";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../../Context/Auth";

const SalesDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState({});

  const getData = async () => {
    fetch(
      `https://backendapi.trakky.in/salonvendor/dashboard/sales/?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  return (
    <div>
      <div className=" w-[100%]   py-[2rem] max-w-[73rem] mx-auto flex flex-wrap px-3 gap-6  justify-center items-center   ">
        {data?.fields?.length > 0 &&
          data?.fields.map((item, index) => (
            <Card name={item} number={data[item]} key={index} />
          ))}
      </div>
    </div>
  );
};

export default SalesDetails;
