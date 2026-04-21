import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { Modal, Typography, Box, Button } from "@mui/material";
import { tableData } from "./DummyData";
import { Link } from "react-router-dom";
import moment from "moment"; // Import moment library
import AuthContext from "../../Context/Auth";
import AppointmentCard from "./AppointmentCard";

function Appointment() {
  const { authTokens } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [month, setMonth] = useState("");
  const [monthNum, setMonthNum] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [cancappointments, setCancelAppointments] = useState([]);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [filteredData, setFilteredData] = useState(tableData.data);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const token = authTokens.access_token;

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filterTableData = () => {
    const filtered = tableData.data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate >= selectionRange.startDate &&
        itemDate <= selectionRange.endDate
      );
    });
    setFilteredData(filtered);
  };

  const resetFilter = () => {
    setFilteredData(tableData.data);
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });
  };

  useEffect(() => {
    const newMonth = String(selectionRange.startDate).substring(4).slice(0, 3);
    setMonth(newMonth);
  }, [selectionRange.startDate]);

  useEffect(() => {
    if (month) {
      const newMonthNum = months.indexOf(month) + 1;
      setMonthNum(newMonthNum);
      console.log(newMonthNum);
    }
  }, [month]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/appointments/filter-by-month/?month=${monthNum}&year=2024&vendor=6`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAppointments(data);
        console.log(data.length === 0 ? "no data available" : data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    if (monthNum) {
      fetchData();
    }
  }, [monthNum, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salonvendor/appointments/cancelled/filter-by-month/?month=${monthNum}&year=2024&vendor=6`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCancelAppointments(data);
        console.log(data.length === 0 ? "no data available" : data);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    if (monthNum) {
      fetchData();
    }
  }, [monthNum, token]);

  return (
    <>
      <div className="daterangPickerPOS">
        <div
          onClick={handleOpenModal}
          className="TitleDaterangepickerPOSappointment"
        >
          <Typography
            variant="body1"
            style={{
              backgroundColor: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {`${moment(selectionRange.startDate).format(
              "YYYY-MM-DD"
            )} - ${moment(selectionRange.endDate).format("YYYY-MM-DD")}`}
          </Typography>
        </div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          className="modalPOSappointmentDaterangepicker"
        >
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
                handleCloseModal();
              }}
              sx={{ mt: 2, mr: 2 }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                resetFilter();
                handleCloseModal();
              }}
              sx={{ mt: 2 }}
            >
              See All
            </Button>
          </Box>
        </Modal>
      </div>
      <AppointmentCard
        startDate={moment(selectionRange.startDate).format("YYYY-MM-DD")}
        endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
      />
    </>
  );
}

export default Appointment;
