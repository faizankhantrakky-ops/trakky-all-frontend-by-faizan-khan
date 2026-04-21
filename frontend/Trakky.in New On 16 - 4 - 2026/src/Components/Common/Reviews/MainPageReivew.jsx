import React from "react";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const MainPageReivew = ({ review }) => {
  return (
    <div className="flex items-center justify-center w-[100%] h-[18rem] md:h-[30rem]">
      <div className=" bg-black w-[312px] md:w-[600px] h-[126px] md:h-[252px] p-[14px] md:p-[30px] rounded-md md:rounded-xl relative flex justify-center items-center ">
        <div className="  w-[85%] h-[100%] flex flex-col gap-[4%]  drop-shadow-xl ">
          <div className="w-[100%] h-[20%] md:h-[10%]  text-[.4rem] text-white flex justify-start items-center md:gap-2   ">
            <Rating
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "white",
                },
              }}
              emptyIcon={
                <StarBorderIcon sx={{ color: "#fff", borderColor: "#fff" }} />
              }
              name="read-only"
              value={review.rating}
              readOnly
            />
            <span className="text-[.4rem] md:text-[1rem] md:tracking-widest font-[100] ">
              {review.rating} rating
            </span>
          </div>
          <div className="w-[100%] h-[40%]  bg-black text-white text-[.6rem] tracking-wider font-[300] text-ellipsis md:text-xs md:mt-2 flex justify-center items-center  ">
            <q>{review.review}</q>
          </div>
          <div className="w-[100%] h-[40%]  flex flex-col justify-center items-start ">
            <div className="w-[100%] h-[60%] text-[.5rem] md:text-sm md:tracking-widest font-[600] text-white flex justify-start items-center ">
              <p>{review.username}</p>
            </div>
            <div className="w-[100%] h-[40%]  text-[.5rem] md:text-sm font-[100] text-white tracking-wide  flex justify-start items-center ">
              <span>From {review.salon_name}</span>
            </div>
          </div>
        </div>
        <div className=" absolute w-[23%]  h-[61%] bg-[#5D5DFF] rounded-[11.5%] -top-[34%] -right-[3.8%] -z-10 drop-shadow-md "></div>
        <div className=" absolute bg-[#B9C8F3] w-[52%] h-[61%] rounded-xl  md:rounded-2xl -bottom-[28%] -left-[10%] -z-10 drop-shadow-md "></div>
        <div className="absolute w-[5.7%] h-[10.3%] shadow-2xl    drop-shadow-md   top-[20%] -right-[2.5%] bg-[#FFFF] rounded-[8px] md:rounded-3xl px-[1px] flex justify-evenly items-center    ">
          <div className=" w-[4px] md:w-[6px] md:h-[6px] h-[4px] bg-[#5D5DFF] rounded-2xl "></div>
          <div className=" w-[4px]  md:w-[6px] md:h-[6px] h-[4px] bg-[#5D5DFF] rounded-2xl "></div>
          <div className=" w-[4px]  md:w-[6px] md:h-[6px] h-[4px] bg-[#5D5DFF] rounded-2xl "></div>
        </div>
      </div>
    </div>
  );
};

export default MainPageReivew;
