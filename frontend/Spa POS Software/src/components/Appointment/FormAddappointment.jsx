import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import moment from "moment";
// import toast, {Toaster} from "react-hot-toast";
import axios from "axios";
import AuthContext from "../../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
function FormAddappointment(prop) {
  const { authTokens } = useContext(AuthContext);
  const input_ref = useRef()
  const [amtpaid, setAmtPaid] = useState("");
  const [offer, setOffer] = useState([]);
  const [availStaff, setAvailStaff] = useState([]);
  const [amount, setAmount] = useState("");
  const [alloffer, setAlloffer] = useState("");
  const [allService, setAllService] = useState([]);
  const [duration, setduration] = useState("");
  const [staff, setStaff] = useState("");
  const [chair, setchair] = useState("");
  const [payment, setPaymenttype] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [gender, setgender] = useState("");
  const [categoriesedService, setCategoriesedService] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [bookingTime , setBookingTime] = useState(null);

  const [date, setDate] = useState(dayjs());
  const bearerToken = authTokens.access_token;

  useEffect(() => {
    setOffer(prop?.props);
  }, [prop?.props]);

  useEffect(() => {
    setAvailStaff(prop?.staff);
  }, [prop?.staff]);

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    const selectedServiceData = allService?.find(
      (item) => item.id === e.target.value
    );
    setAmount(selectedServiceData ? selectedServiceData.price : "");
    setduration(selectedServiceData ? selectedServiceData.service_time : "");
    setAlloffer("");
  };



  const fetchService = async () => {
    try {
      const response = await axios.get(
        "https://backendapi.trakky.in/spavendor/service/",
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      // setAvailService(response.data);
      setAllService(response.data);
      const categoryMap = await response?.data.reduce((acc, service) => {
        const categoryName = service.category_name || "Uncategorized";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push({
          servicename: service.service_name,
          servicetime: service.service_time,
          serviceprice: service.price,
          id: service.id,
        });
        return acc;
      }, {});

      const transformedData = Object.keys(categoryMap).map((category) => ({
        name: category,
        services: categoryMap[category],
      }));


      setCategoriesedService(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchService();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const payload = {
      customer_name: customerName,
      date: date?.format("YYYY-MM-DD"),
      customer_phone : customerNumber,
      time_in: bookingTime?.format("HH:mm:ss"),
      customer_gender : gender,
      service: selectedService,
      duration: duration,
      customer_type: customerType,
      payment: payment,
      amount: amount,
      amount_paid: amtpaid,
      staff: staff,
      payment_mode: payment,
    };

    try {
      const response = await axios.post(
        "https://backendapi.trakky.in/spavendor/appointments/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        })

      if (response.status === 201) {
        toast.success('Appointment created successfully');
        setCustomerName("");
        setCustomerNumber("");
        setgender("");
        setduration("");
        setCustomerType("");
        setPaymenttype("");
        setAmount("");
        setAmtPaid("");
        setStaff("");
        setchair("");
        setSelectedService("");
        setAlloffer("");
        setDate(dayjs());
        setBookingTime(null);
        
      }
      else {
      
        toast.error('Error creating appointment');

    }
    } catch (error) {
      toast.error('Error creating appointment');
    }

  };
  return (
    <>
    <ToastContainer />
    <div style={{ padding: "10px" }} className="OOBoxFormPOS">
      <div className="outerBoxFormAddAptPOS">
        <span className="IIBoxFormPOS">
          <TextField
            id="outlined-basic"
            label="Customer Name"
            variant="outlined"
            onChange={(e) => {
              setCustomerName(e.target.value);
            }}
            value={customerName}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </span>
        <span className="IIBoxFormPOS">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]} >
              <TimePicker label="Booking Time"
                ref={input_ref}
                value={bookingTime}
                onChange={
                  setBookingTime
                }
                referenceDate={date}
                
              />
            </DemoContainer>
          </LocalizationProvider>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              label="gender"
              onChange={(e) => {
                setgender(e.target.value);
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </span>
        <span className="IIBoxFormPOS">
          <TextField
            id="outlined-basic"
            label="Customer Number"
            variant="outlined"
            value={customerNumber}
            onChange={(e) => {
                const value = e.target.value;
                if(value.length <= 10){
                  setCustomerNumber(value)
                }
            }}
            type="number"
            onWheel={() => document.activeElement.blur()}
            onKeyDownCapture={(event) => {
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();

              }
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Service
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedService}
              label="Select Service"
              onChange={(e) => {
                setSelectedService(e.target.value);
                const selectedServiceData = allService?.find(
                  (item) => item.id === e.target.value
                );
                setAmount(selectedServiceData ? selectedServiceData.price : "");
                setduration(
                  selectedServiceData ? selectedServiceData.service_time : ""
                );
                setAlloffer("");
              }}
            >
              <MenuItem value="" disabled>
                Select service
              </MenuItem>
              {categoriesedService?.length > 0 &&
                categoriesedService.map((item, index) => {
                  return item?.services.map((service) => (
                    <MenuItem
                      className="text-gray-800"
                      key={service.id}
                      value={service.id}
                    >
                      {service.servicename + " ( " + item.name + " )"}
                    </MenuItem>
                  ));
                })}
            </Select>
          </FormControl>
        </span>
        {/* <span className="IIBoxFormPOS">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Offer</InputLabel>
              <Select

                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={alloffer}
                label="Select Offer"
                onChange={(e) => {
                  setAlloffer(e.target.value);
                  const selectedServiceData = offer.find((item) => item.offername === e.target.value);
                  setAmount(selectedServiceData ? selectedServiceData.price : "");
                  setduration(selectedServiceData ? selectedServiceData.duration : "")
                  setSelectedService('')
                }}
              >
                {!offer ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  offer.map((item) => (
                    <MenuItem key={item.offername} value={item.offername}>
                      {item.offername}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <TextField
              value="Membership2"
              id="outlined-basic"
              label="Membership"
              variant="outlined"
            />
          </span> */}
        <span className="IIBoxFormPOS">
          <TextField
            value={duration}
            id="outlined-basic"
            label="Duration"
            // onChange={(e) => {
            //   setduration(e.target.value);
            // }}
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Customer Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={customerType}
              label="Customer Type"
              onChange={(e) => {
                setCustomerType(e.target.value);
              }}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Regular">Regular</MenuItem>
            </Select>
          </FormControl>
        </span>
        <span className="IIBoxFormPOS">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Payment Mode
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={payment}
              label="Select Payment Mode"
              onChange={(e) => {
                setPaymenttype(e.target.value);
              }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              {/* <MenuItem value="card/online">Card/Online</MenuItem> */}
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Credit-card">Credit-card</MenuItem>
              <MenuItem value="Debit-card">Debit-card</MenuItem>
              <MenuItem value="Bank-transfer">Bank-transfer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            value={amount}
            id="outlined-basic"
            label="Totol Amount"
            variant="outlined"
          />
        </span>
        <span className="IIBoxFormPOS">
          <TextField
            value={amtpaid}
            id="outlined-basic"
            label="Amount Paid"
            variant="outlined"
            onChange={(e) => {
              setAmtPaid(e.target.value);
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Staff</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={staff}
              label="Select Staff"
              onChange={(e) => {
                setStaff(e.target.value);
              }}
            >
              {availStaff?.map((item) =>
                item.is_busy === false ? (
                  <MenuItem key={item.id} value={item.id}>
                    {item.staffname}
                  </MenuItem>
                ) : (
                  <MenuItem key={item.id} value={item.id} disabled>
                    {item.staffname} is busy
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </span>
        <span className="IIBoxFormPOS">
          <button className="SubmitbtnAppointment" onClick={handleSubmit}>Submit</button>
        </span>
      </div>
    </div>
    </>
  );
}

export default FormAddappointment;
