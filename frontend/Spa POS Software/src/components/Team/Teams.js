import React, { useState } from 'react';
import { Link, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { Typography, Box, Modal, Button } from '@mui/material'; // Import Material-UI components
import 'react-date-range/dist/styles.css'; // Main css file for DateRangePicker
import 'react-date-range/dist/theme/default.css'; // Default theme for DateRangePicker
import { DateRangePicker } from "react-date-range";
import DailySheet from './DailySheet';
import RegisterStaff from './RegisterStaff';
import StaffRecord from './StaffRecord';
import DateFilter from './DateFilter';
import "./Teams.css";
import { Toaster } from 'react-hot-toast';

function Teams() {
  const [dateFilter, setDateFilter] = useState({ startDate: '2024-04-30', endDate: '2024-04-30' });
  const [openDateModal, setOpenDateModal] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const location = useLocation();

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDateModal = () => {
    setOpenDateModal(true);
  };

  const handleCloseDateModal = () => {
    setOpenDateModal(false);
  };

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const filterTableData = () => {
    // Implement filtering logic using dateFilter or selectionRange
  };

  const resetFilter = () => {
    // Implement reset logic
  };

  return (
    <div className="teamsTableContainer">
      <Toaster />
      <div className="teamsTableNavigationAndFilter">
        <div className='teamsTableNavigation'>
          {/* <div className={location.pathname === '/team/daily-sheet' ? 'activeTeamsLink' : ''}>
            <Link to="/team/daily-sheet">Daily Sheet</Link>
          </div> */}
          <div className={location.pathname === '/team/register-staff' ? 'activeTeamsLink' : ''}>
            <Link to="/team/register-staff">Register Staff</Link>
          </div>
          <div className={location.pathname === '/team/staff-record' ? 'activeTeamsLink' : ''}>
            <Link to="/team/staff-record">Staff Record</Link>
          </div>
        </div>
        <div onClick={handleOpenDateModal} className='hidden'>
          <Typography
            variant="body1"
            style={{
              backgroundColor: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px"
            }}
          >
            {`${selectionRange.startDate.toDateString()} - ${selectionRange.endDate.toDateString()}`}
          </Typography>
        </div>
        <Modal open={openDateModal} onClose={handleCloseDateModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h5" mb={2}>
              Select Dates
            </Typography>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                filterTableData();
                handleCloseDateModal();
              }}
              sx={{ mt: 2, mr: 2 }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                resetFilter();
                handleCloseDateModal();
              }}
              sx={{ mt: 2 }}
            >
              See All
            </Button>
          </Box>
        </Modal>
      </div>
      <Outlet />
    </div>
  );
}

export default Teams;