import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const SelectLocation = () => {
  const { supplier } = useParams();
  const Navigate = useNavigate();
  return (
    <div className="pt-[100px] pb-[10px] pl-[82px] pr-[10px] flex justify-center items-center w-full max-sm:pl-[10px] ">
      <div className="flex flex-col gap-2 items-center">
        <span className="text-[#757676] text-[16px]">Create a stock order</span>
        <span className="text-[28px]">Select delivery location</span>
        <span className="text-[18px] text-[#414141]">
          Choose where you want your products delivered
        </span>
        <span
          className="flex items-center w-full justify-between border-2 p-[15px] border-black rounded-xl cursor-pointer"
          id="Spa1"
          onClick={(e) => {
            Navigate(`/sales/stock-order/${supplier}/${e.target.id}/select-products`)
          }}
        >
          <span>Spa 1</span>
          <span>
            <ChevronRightIcon />
          </span>
        </span>
        <span className="flex items-center w-full justify-between border-2 p-[15px] border-black rounded-xl cursor-pointer"
        id="Spa1"
        onClick={(e) => {
          Navigate(`/sales/stock-order/${supplier}/${e.target.id}/select-products`)
        }}
        >
          <span>Spa 2</span>
          <span>
            <ChevronRightIcon />
          </span>
        </span>
      </div>
    </div>
  );
};

export default SelectLocation;
