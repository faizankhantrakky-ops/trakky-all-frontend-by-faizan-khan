import React, { useEffect, useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import { Search } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AuthContext from "../Context/Auth";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./DailyExpense.css";
import Divider from "@mui/material/Divider";
const Dailyexpense = () => {
  const { authTokens } = useContext(AuthContext);
  const bearerToken = authTokens.access_token;
  const [expenseDate, setExpenseDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paid_to, setPaid_to] = useState("");
  const [paid_from, setPaid_from] = useState("");
  const salon = 44;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/daily-expensis/",
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${bearerToken}`,
            "content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error("Error while fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [bearerToken]);

  const handleSave = async () => {
    const expenseData = {
      name,
      amount,
      paid_to,
      paid_from,
      salon,
    };

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/daily-expensis/",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${bearerToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );
      if (response.ok) {
        toast.success("Expense added successfully");
        setOpen(false);
        setName("");
        setAmount("");
        setPaid_from("");
        setPaid_to("");
        fetchData();
      } else {
        toast.error("Error while adding expense");
      }
    } catch (error) {
      toast.error("Error while adding expense");
    }
  };

  useEffect(() => {
    console.log(expenseDate.format("YYYY-MM-DD"));
  }, [expenseDate]);

  const filteredData = data.filter((item) => {
    const itemDate = dayjs(item.created_at).format("YYYY-MM-DD");
    return itemDate === expenseDate.format("YYYY-MM-DD");
  });

  return (
    <div
      style={{ padding: "10px 10px 25px 82px" }}
      className="outerdailyexpensePOS w-full flex flex-col max-lg:!pl-[10px]"
    >
      <div className="pr-1 flex items-center mb-4 justify-between">
        <button
          className="bg-black text-white px-[10px] py-[8px] rounded-xl"
          onClick={handleOpen}
        >
          Add Expense
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              sx={{ backgroundColor: "white" }}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <Divider
        sx={{ marginBottom: "2rem", borderColor: "#b8b8b8", border: "2px" }}
      />
      <div
        className="listAppointmentPOS w-full flex justify-center"
        style={{ maxWidth: "-webkit-fill-available", width: "100%" }}
      >
        {filteredData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>From</th>
                <th>To</th>
                <th>Expense details</th>
                <th>Created at</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.amount}</td>
                  <td>{item.paid_from}</td>
                  <td>{item.paid_to}</td>
                  <td>{item.name}</td>
                  <td>{String(item.created_at).slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="flex justify-center">No expense for today</p>
        )}
      </div>
      <Toaster />
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            color: "black",
            width: "450px",
            padding: "25px",
            maxWidth: "-webkit-fill-available",
            display: "flex",
            flexFlow: "column",
            gap: "15px",
          }}
        >
          <div className=" grid grid-cols-3">
            <TextField
              id="outlined-basic"
              label="Expense"
              sx={{ width: "50%" }}
              variant="outlined"
              type="number"
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                }
              }}
              // value={amount}
              // onChange={(e) => setAmount(e.target.value)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="To"
              sx={{ width: "50%" }}
              variant="outlined"
              value={paid_to}
              onChange={(e) => setPaid_to(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="From"
              sx={{ width: "50%" }}
              variant="outlined"
              value={paid_from}
              onChange={(e) => setPaid_from(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Name"
              sx={{ width: "50%" }}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" col-span-3"
            />
            <button
              className="w-full bg-[blue] text-white py-[8px] rounded-xl col-span-3"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Dailyexpense;
