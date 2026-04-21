import React, { useEffect, useState, useContext } from "react";
import Card from "../Dashbord_cards";
import AuthContext from "../../Context/Auth";

const DashboardClientDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState({});

  const getData = async () => {
    fetch(
      `https://backendapi.trakky.in/salonvendor/dashboard/customer/?start_date=${startDate}&end_date=${endDate}`,
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
      <div className=" w-[100%] max-w-[73rem] mx-auto py-[2rem]  flex flex-wrap px-3 gap-6  justify-center items-center   ">
        {data?.fields?.length > 0 &&
          data?.fields.map((item, index) => (
            <Card name={item} number={data[item]} key={index} />
          ))}
      </div>
    </div>
  );
};

export default DashboardClientDetails;
