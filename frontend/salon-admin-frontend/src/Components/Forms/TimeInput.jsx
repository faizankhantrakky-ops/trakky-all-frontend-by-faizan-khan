import React from "react";
import "../css/timings.css";

const TimeInput = ({ label, value, onChange, type, closed }) => {
  const handleTimeChange = (e, type) => {
    onChange(e, type, label);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", marginBottom: "5px" }}>
      <label className="from-to-label" htmlFor={`${label}-open`}>
        {type === "open" ? "From" : "To"}
      </label>
      <input
        className="custom-input"
        disabled={closed}
        type="time"
        name={`${label}-${type}`}
        id={`${label}-${type}`}
        placeholder="Enter Open Time"
        required
        value={value}
        onChange={(e) => handleTimeChange(e, "open")}
      />
    </div>
  );
};

export default TimeInput;
