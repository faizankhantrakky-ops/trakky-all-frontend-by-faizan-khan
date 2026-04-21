import React, { useEffect, useState, useContext } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/Auth";
const SelectSupplier = () => {
  const [supplier, setSupplier] = useState("");
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salonvendor/supplier/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setSupplier(responseData);
        } else {
          console.log("Error while fetching data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  return (
    <div className="pt-[100px] pb-[10px] pl-[82px] pr-[10px] flex justify-center items-center w-full max-sm:pl-[10px]">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-[#757676] text-[16px]">Create a stock order</span>
        <span className="text-[28px]">Select a supplier</span>
        <span className="text-[18px] text-[#414141]">
          Choose which supplier to order products from
        </span>
        {supplier && supplier.length > 0 ? (
          supplier.map((item, index) => (
            <span
              key={index}
              className="flex items-center w-full justify-between border-2 p-[15px] border-black rounded-xl cursor-pointer"
              onClick={() => {
                navigate(`/sales/stock-order/${item.name}/Select-products`);
              }}
            >
              <span className="flex flex-col">
                <span>{item.name}</span>
                <span>{item.supplier_description}</span>
              </span>
              <span>
                <ChevronRightIcon />
              </span>
            </span>
          ))
        ) : (
          <span>No suppliers available</span>
        )}
      </div>
    </div>
  );
};

export default SelectSupplier;
