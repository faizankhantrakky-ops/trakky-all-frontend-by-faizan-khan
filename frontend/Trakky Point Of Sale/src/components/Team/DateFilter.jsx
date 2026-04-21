import React from 'react';

function DateFilter({ dateFilter, onDateChange }) {
  return (
    <div className="date-filter">
      <input
        type="date"
        name="startDate"
        value={dateFilter.startDate}
        onChange={onDateChange}
      />
      <input
        type="date"
        name="endDate"
        value={dateFilter.endDate}
        onChange={onDateChange}
      />
    </div>
  );
}

export default DateFilter;
