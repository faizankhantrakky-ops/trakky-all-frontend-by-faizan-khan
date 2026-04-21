import React from "react";
import "./Preview.css";
import Score from "../../assets/score_vector.png";
import Ibtn from "../../assets/Ibutton_vector.png";
import morePhotos from "../../assets/MorePhotosIcon.png";
import Share from "../../assets/ShareVector.png";
import Heart from "../../assets/HeartVector.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Samplephoto from "../../assets/SamplePhotoServices.png";
import Diffcolor from "../../assets/DiffcolorBackground.png";
import moment from "moment";
const Preview = ({
  area,
  city,
  name,
  profOffer,
  start,
  end,
  image,
  custExp,
  CustTit,
  DailyUpdateimg,
  DailyupdCap,
}) => {
  return (
    <>
      {/* <div
        className="topPOSpreview"
        style={{
          backgroundImage: `url(${
            image ? URL.createObjectURL(image) : Diffcolor
          })`,
        }}
      >
        <div className="p-[10px]">
          <div className=" flex  items-center justify-between">
            <div className="flex gap-[5px] items-center scorePOSProfilePreview">
              {" "}
              <img className="h-[15px] w-[15px]" src={Score} alt="" /> Score 9 /
              10{" "}
            </div>
            <div className="IbtnPOSPreview">
              <img src={Ibtn} alt="" className="h-[25px] w-[25px]" />
            </div>
          </div>
          <div className="w-full h-[200px] flex items-end justify-end ">
            <div className=" flex w-full  gap-[5px] scorePOSProfilePreview">
              <img className="h-[15px] w-[15px]" src={morePhotos} alt="" /> More
              photos
            </div>
          </div>
        </div>
        <div className="GrediantBackgroundPOS">
          <div className="bg-white w-full h-[100%] rounded-[10px] p-[8px] flex flex-col gap-[8px]">
            <div className="flex justify-between">
              <span>
                <p className="text-[12px]">
                  Opens{" "}
                  {start ? moment(start, "HH:mm").format("hh:mm A") : "9 AM"}-{" "}
                  {end ? moment(end, "HH:mm").format("hh:mm A") : "6PM"}
                </p>
              </span>
              <span className="flex gap-[5px]">
                <img className="h-[15px] w-[12px]" src={Share} alt="" />
                <img className="h-[15px] w-[16px]" src={Heart} alt="" />
              </span>
            </div>
            <div className="w-[150px] h-auto">
              <p className="text-[16px] text-[wrap] leading-none font-semibold">
                {name ? name : "Sample Spa Name"}
              </p>
            </div>
            <div>
              <p className="text-[12px]">
                {area ? area : "area"}, {city ? city : "city"}
              </p>
            </div>
            <div>
              <p className="text-[12px]"> ₹ 999 Onwards </p>
            </div>
            <div className="BtnsGrpPOSCall_bookProfilePreview flex w-full justify-center gap-[2px]">
              <button className="Callnowbtn_POSprofilepreview text-[12px] text-white py-[5px] px-[10px]">
                Call now
              </button>
              <button className="Callnowbtn_POSprofilepreview text-[12px] text-white py-[5px] px-[10px]">
                Book now
              </button>
            </div>
            <div className="w-full flex justify-center">
              <p className="text-[12px]">Luxurious | Premium | Trending</p>
            </div>
            <div className="flex gap-[3px] items-center leading-none pt-[5px] justify-center">
              <span className="linestraightPOSprofilePreviewright"></span>
              <p className="text-[10px] w-max">
                {profOffer ? profOffer : "Sample Profile Offer"}
              </p>
              <span className="linestraightPOSprofilePreviewleft"></span>
            </div>
          </div>
        </div>
        <div className="CustomerExperiancePOSprofilePreview flex flex-col gap-[10px]">
          <div className="px-[15px]">
            <p className="flex font-semibold pt-[25px]">
              Customer's Experiance
            </p>
            <div className="dividerPOSprofilepreview"></div>
          </div>
          <div
            className="px-[10px] overflow-scroll"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="flex text-[12px] w-[250px] gap-[10px]">
              <p className="w-max">All</p>
              <p>Face treatment</p>
              <p>Makeup</p>
              <p>Skin treatment</p>
            </span>
          </div>
          <div
            className="px-[15px] flex overflow-x-auto space-x-[10px]"
            style={{ scrollbarWidth: "none" }}
          >
            <span
              className="cardsProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]"
              style={{
                backgroundImage: `url(${
                  custExp ? URL.createObjectURL(custExp) : Diffcolor
                })`,
              }}
            >
              <p className="flex w-full items-end h-full text-[12px] text-white">
                {CustTit ? CustTit : "Demo title"}
              </p>
            </span>
            <span className="cardsProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]">
              <p className="flex w-full items-end h-full text-[12px] text-white">
                Hairstyle
              </p>
            </span>
            <span className="cardsProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]">
              <p className="flex w-full items-end h-full text-[12px] text-white">
                Hairstyle
              </p>
            </span>
          </div>
          <div className="flex items-center px-[10px] w-full justify-end">
            <p className="text-[12px]">See more</p>{" "}
            <ArrowForwardIosIcon style={{ height: "12px", width: "12px" }} />
          </div>
        </div>
        <div className="CustomerExperiancePOSprofilePreview flex flex-col gap-[10px]">
          <div className="px-[15px]">
            <p className="flex font-semibold pt-[15px]">Offers</p>
            <div className="dividerPOSprofilepreview"></div>
          </div>
          <div
            className="px-[15px] flex overflow-x-auto space-x-[10px]"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="cardsOfferProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]"></span>
            <span className="cardsOfferProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]"></span>
            <span className="cardsOfferProfilePreviewPOS p-[5px] flex-shrink-0 w-[150px]"></span>
          </div>
        </div>
        <div className="CustomerExperiancePOSprofilePreview flex flex-col gap-[10px]">
          <div className="px-[15px] flex flex-col gap-[5px]">
            <p className="flex font-semibold pt-[15px]">Spa Services</p>
            <div className="dividerPOSprofilepreview"></div>
            <div className="w-full flex justify-center">
              <button className="btngrpMaleprofilepreview">Male</button>
              <button className="btngrpfemaleprofilepreview">Female</button>
            </div>
            <div className="dividerPOSprofilepreview"></div>
          </div>
          <div
            className="px-[10px] overflow-scroll"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="flex items-center text-[12px] w-auto gap-[10px] flex-nowrap whitespace-nowrap">
              <p className="px-[12px] py-[5px] bg-[#512DC8] text-white rounded-[8px]">
                All services
              </p>
              <p>Haricut</p>
              <p>Facial</p>
              <p>Beard</p>
              <p>Hair Color</p>
            </span>
          </div>
          <div className="flex px-[15px] flex-col gap-[15px]">
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[10px] shrink-0 w-full">
                <div className="flex flex-col gap-[10px]">
                  <div>
                    <p className="font-semibold">Hair Cut</p>
                  </div>
                  <div
                    className="text-[12px] text-[#383838]"
                    style={{ opacity: "0.5" }}
                  >
                    <p className="w-max">• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                  </div>
                </div>
                <div className="flex flex-col items-center wholeSampleImgPOSprofilepreview">
                  <img className="h-[70px] w-[80px]" src={Samplephoto} alt="" />
                  <button className="BooknowbtnprofilepreviewPOS">
                    Book now
                  </button>
                </div>
              </div>
              <div className="flex text-[12px] items-center">
                <p className="font-semibold">₹ 900 • </p>{" "}
                <span
                  className="ml-[4px] text-[#383838]"
                  style={{ opacity: "0.5" }}
                >
                  <p> 2 Days, 3 Seatings, 90 Min</p>
                </span>
              </div>
              <div className="">
                <p className="text-[#512DC8] underline">Show details</p>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[10px] shrink-0 w-full">
                <div className="flex flex-col gap-[10px]">
                  <div>
                    <p className="font-semibold">Hair Cut</p>
                  </div>
                  <div
                    className="text-[12px] text-[#383838]"
                    style={{ opacity: "0.5" }}
                  >
                    <p className="w-max">• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                  </div>
                </div>
                <div className="flex flex-col items-center wholeSampleImgPOSprofilepreview">
                  <img className="h-[70px] w-[80px]" src={Samplephoto} alt="" />
                  <button className="BooknowbtnprofilepreviewPOS">
                    Book now
                  </button>
                </div>
              </div>
              <div className="flex text-[12px] items-center">
                <p className="font-semibold">₹ 900 • </p>{" "}
                <span
                  className="ml-[4px] text-[#383838]"
                  style={{ opacity: "0.5" }}
                >
                  <p> 2 Days, 3 Seatings, 90 Min</p>
                </span>
              </div>
              <div className="">
                <p className="text-[#512DC8] underline">Show details</p>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center gap-[10px] shrink-0 w-full">
                <div className="flex flex-col gap-[10px]">
                  <div>
                    <p className="font-semibold">Hair Cut</p>
                  </div>
                  <div
                    className="text-[12px] text-[#383838]"
                    style={{ opacity: "0.5" }}
                  >
                    <p className="w-max">• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                    <p>• Best for body relaxation</p>
                  </div>
                </div>
                <div className="flex flex-col items-center wholeSampleImgPOSprofilepreview">
                  <img className="h-[70px] w-[80px]" src={Samplephoto} alt="" />
                  <button className="BooknowbtnprofilepreviewPOS">
                    Book now
                  </button>
                </div>
              </div>
              <div className="flex text-[12px] items-center">
                <p className="font-semibold">₹ 900 • </p>{" "}
                <span
                  className="ml-[4px] text-[#383838]"
                  style={{ opacity: "0.5" }}
                >
                  <p> 2 Days, 3 Seatings, 90 Min</p>
                </span>
              </div>
              <div className="">
                <p className="text-[#512DC8] underline">Show details</p>
              </div>
            </div>
          </div>
          <div className="px-[15px] flex-col flex gap-[10px] pb-[20px]">
            <div className="flex items-center gap-[5px]">
              <div className="w-[30px] h-[28px] border-2 border-[black] rounded-full"></div>
              <div
                className="flex flex-col w-full"
                style={{ lineHeight: "normal" }}
              >
                <p className="text-[16px]" style={{ lineHeight: "normal" }}>
                  Aroma the luurious spa
                </p>
                <span className="text-[10px] text-[#383838] flex justify-between">
                  {" "}
                  <p>Daily updates</p>{" "}
                  <p>
                    See more{" "}
                    <KeyboardDoubleArrowRightIcon
                      style={{ height: "15px", width: "15px" }}
                    />
                  </p>{" "}
                </span>
              </div>
            </div>
            <div
              className="flex overflow-x-auto w-full gap-[5px]"
              style={{ scrollbarWidth: "none" }}
            >
              <div className=" w-[150px] border-[0.2px] border-[#00000021] rounded-[10px] flex flex-col shrink-0" style={{maxHeight:'180px',lineBreak:'anywhere'}}>
                <div
                  className="DailyupadtesPOSprofilepreview h-[90px] w-full"
                  style={{
                    backgroundImage: `url(${
                      DailyUpdateimg
                        ? URL.createObjectURL(DailyUpdateimg)
                        : Diffcolor
                    })`,
                  }}
                ></div>
                <div className="px-[3px] flex flex-col gap-[3px]">
                  <p className="text-[10px]">
                  {DailyupdCap ? DailyupdCap.slice(0,80)+"..." : "Sample Caption" }
                  </p>
                  <p className="text-[9px]">1 min ago</p>
                  <p className="pb-[2px] text-[#512DC8] cursor-pointer text-[14px]">
                    Book now
                  </p>
                </div>
              </div>
              <div className="h-[180px] w-[150px] border-[0.2px] border-[#00000021] rounded-[10px] flex flex-col shrink-0">
                <div className="DailyupadtesPOSprofilepreview h-[90px] w-full"></div>
                <div className="px-[3px] flex flex-col gap-[3px]">
                  <p className="text-[10px]">
                  Lorem ipsum dolor sit amet hi, adipisicing elit. Quidem,
                    perspic...
                  </p>
                  <p className="text-[9px]">1 min ago</p>
                  <p className="pb-[2px] text-[#512DC8] cursor-pointer text-[14px]">
                    Book now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Preview;
