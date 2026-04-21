import React, { useContext, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import MenuIcon from "@mui/icons-material/Menu";
import MiniHeader from "./MiniHeader";

const GiftCardList = () => {
  const { vendorData } = useContext(AuthContext);

  const [gGiftCardData, setgGiftCardData] = useState([]);
  const [giftCardLoading, setGiftCardLoading] = useState(false);

  const fetchGiftCards = async () => {
    setGiftCardLoading(true);

    if (!vendorData?.salon) return;

    let url;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {

        setgGiftCardData(data);
      } else {
        toast.error(`something went wrong : ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`something went wrong : ${error.message}`);
    } finally {
      setGiftCardLoading(false);
    }
  };


  // useEffect(() => {
  //   fetchGiftCards();
  // }, [vendorData]);

  return (
    <div className=" w-full h-full">
      <ToastContainer />
      <MiniHeader title="Our Gift cards" />
      <div className=" w-full max-w-[100vw] md:max-w-[calc(100vw-288px)] h-[calc(100%-60px)] md:h-[calc(100%-68px)] p-3 overflow-auto mt-1 ">
        <div className=" w-full flex flex-col gap-2 items-center justify-center px-2 min-w-[1024px]">
          {giftCardLoading ? (
            <div className=" h-60 flex items-center justify-center">
              <CircularProgress
                sx={{
                  color: "#000",
                  margin: "auto",
                  display: "block",
                }}
              />
            </div>
          ) : gGiftCardData?.length > 0 ? (
            gGiftCardData?.map((item, index) => (
              <></>
            ))
          ) : (
            <div className=" w-full h-52 flex items-center justify-center">
              <h1 className=" text-lg font-bold">No Gift Card ( we will add features soon! )</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftCardList;
