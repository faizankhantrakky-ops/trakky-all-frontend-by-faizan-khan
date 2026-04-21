import React from "react";
import { useState } from "react";
import "./spaprofilemodal.css";

const SpaTimingModal = ({ spa_timings , handleSpaTimingClose }) => {

  
  const formateTime = (time) => {
    if (!time) {
      return;
    }

    let [hour, minute, second] = time.split(":");

    let formatedTime = "";

    if (parseInt(hour) > 12) {
      formatedTime = `${parseInt(hour) - 12}:${minute} PM`;
    } else {
      formatedTime = `${parseInt(hour)}:${minute} AM`;
    }
    if (parseInt(hour) === 12) {
      formatedTime = `${hour}:${minute} PM`;
    }
    if (parseInt(hour) === 0) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(hour) === 24) {
      formatedTime = `12:${minute} AM`;
    }
    if (parseInt(minute) === 0) {
      formatedTime = parseInt(hour) > 12 ? `${parseInt(hour) - 12} PM` : parseInt(hour) === 0 ? `12 AM` : `${parseInt(hour)} AM`;
    }

    return formatedTime;
  };

  return (
    <div className="SP-about-us-container ">
      <div className="SP-salon-facilities-close !flex !flex-col !gap-5">
        <div className="flex justify-between items-center">
          <h1 className=" text-xl font-semibold">Hours:</h1>
          <div className="SP-salon-close-btn" onClick={handleSpaTimingClose}>
            X
          </div>
        </div>
        <div className=" w-full flex justify-between pr-2 !text-gray-600">
            <div className=" flex flex-col gap-3 justify-center">
              <div className="">Monday</div>
              <div className="">Tuesday</div>
              <div className="">Wednesday</div>
              <div className="">Thursday</div>
              <div className="">Friday</div>
              <div className="">Saturday</div>
              <div className="">Sunday</div>
            </div>
            <div className=" flex flex-col gap-3 justify-center">
              { spa_timings?.["monday"]?.open_time ? <div className="">{formateTime(spa_timings?.["monday"]?.open_time)} - {formateTime(spa_timings?.["monday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["tuesday"]?.open_time ? <div className="">{formateTime(spa_timings?.["tuesday"]?.open_time)} - {formateTime(spa_timings?.["tuesday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["wednesday"]?.open_time ? <div className="">{formateTime(spa_timings?.["wednesday"]?.open_time)} - {formateTime(spa_timings?.["wednesday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["thursday"]?.open_time ? <div className="">{formateTime(spa_timings?.["thursday"]?.open_time)} - {formateTime(spa_timings?.["thursday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["friday"]?.open_time ? <div className="">{formateTime(spa_timings?.["friday"]?.open_time)} - {formateTime(spa_timings?.["friday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["saturday"]?.open_time ? <div className="">{formateTime(spa_timings?.["saturday"]?.open_time)} - {formateTime(spa_timings?.["saturday"]?.close_time)} </div> : <div className="">Closed</div>}
              { spa_timings?.["sunday"]?.open_time ? <div className="">{formateTime(spa_timings?.["sunday"]?.open_time)} - {formateTime(spa_timings?.["sunday"]?.close_time)} </div> : <div className="">Closed</div>}
              </div>
        </div>
      </div>
    </div>
  );
};

export default SpaTimingModal;
