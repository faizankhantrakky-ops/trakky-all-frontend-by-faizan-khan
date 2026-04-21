import React from "react";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./daterange.css";

const DateRange = ({
    dateState,
    setDateState,
    setShowDateSelectionModal
}) => {
    const [tempState, setTempState] = useState(dateState);

    const handleSubmitSelection = () => {
        setDateState(tempState);
        if (setShowDateSelectionModal) {
            setShowDateSelectionModal(false);
        }
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
            <div className="DR-modal-submit-btn" >
                <button type="submit" onClick={handleSubmitSelection}>Apply</button>
            </div>
        </div>
    );
}

export default DateRange;