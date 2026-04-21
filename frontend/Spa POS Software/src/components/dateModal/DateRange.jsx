import * as React from "react";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./daterange.css";

const DateRange = ({
  dateState , setDateState , setShowDateSelectionModal 
}) => {

  const [tempState, setTempState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSubmitSelection = () => {
    // setIsDatefileron(true);
    setDateState([{
      startDate: tempState[0].startDate,
      endDate: tempState[0].endDate,
      key: "selection",
    
    }]);
    setShowDateSelectionModal(false)
  }

  return (
    <div className="date-range-parent-container">
      <DateRangePicker
        onChange={(item) => {
          setTempState([item.selection]);
        }}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={tempState}
        direction="horizontal"
        preventSnapRefocus={true}
        calendarFocus="backwards"
      />
      <div className="appointment-form-btn modal-submit-btn w-full" style={{padding:"10px"}}>
        <button type="submit" className=" bg-emerald-600 rounded-md shadow-sm mx-auto block w-fit text-white px-4 py-1" onClick={()=> handleSubmitSelection()}>Apply</button>
      </div>
    </div>
  );
}

export default DateRange;