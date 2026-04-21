import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../../Context/Auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import "./Appointment.css";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Delete, PriceChange } from "@mui/icons-material";

import { FormControl, InputLabel, Menu, MenuItem, Select } from "@mui/material";
import { set } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

import GeneralModal from "../../generalModal/GeneralModal";

const AppointmentForm = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [showSidecard, setShowSidecard] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [staff, setStaff] = useState([]);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  const [managerData, setManagerData] = useState([]);
  const [services, setServices] = useState([
    {
      service_id: "",
      service_name: "",
      actual_price: "",
      final_price: "",
      from_membership: false,
      membership_id: "",
      duration: "",
      offer_id: "",
      offer_type: "",
      from_offer: false,
    },
  ]);
  const [selectedOffers, setSelectedOffers] = useState([
    {
      id: "",
      offer_name: "",
      offer_time: "",
      actual_price: "",
      discount_price: "",
      staff: [],
    },
  ]);
  const [membershipUsed, setMembershipUsed] = useState("N/A");

  const [date, setDate] = useState(dayjs());
  const [bookingTime, setBookingTime] = useState(dayjs());
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [gender, setgender] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [selectedStylist, setSelectedStylist] = useState("");
  const [membershipData, setMembershipData] = useState([]);
  const [serviceEditModalOpen, setServiceEditModalOpen] = useState(false);
  const [serviceEditData, setServiceEditData] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [amountPaidError, setAmountPaidError] = useState("");

  const [
    changeServiceMembershipModalOpen,
    setChangeServiceMembershipModalOpen,
  ] = useState(false);
  const [
    changeServiceMembershipModalData,
    setChangeServiceMembershipModalData,
  ] = useState(null);

  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [page, setPage] = useState(1);

  const formateTime = (time) => {
    let str = "";

    if (time?.days && time?.days !== "0") {
      str += time.days + " Days, ";
    }
    if (time?.seating && time?.seating !== "0") {
      str += time.seating + " Seating, ";
    }
    if (time?.hours && time?.hours !== "0") {
      str += time.hours + " Hours, ";
    }
    if (time?.minutes && time?.minutes !== "0") {
      str += time.minutes + " Minutes, ";
    }

    str = str.slice(0, -2);

    return str;
  };

  const toggleSidecard = () => {
    setShowSidecard(!showSidecard);
  };

  const handleViewClick = (membership) => {
    setSelectedMembership(membership);
    toggleSidecard(); // Open sidecard
  };
  const fetchOffers = async () => {
    setOfferLoading(true);

    if (!vendorData?.spa) return;

    let url = `https://backendapi.trakky.in/spas/spa-profile-page-offer/?spa=${vendorData?.spa}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        let tempData = data?.map((offer) => {
          return {
            id: offer?.id,
            offer_name: offer?.offer_name,
            offer_time: offer?.massage_details?.service_time || null,
            actual_price: offer?.massage_price || "",
            discount_price: offer?.discount_price || "",
            offer_type: offer?.offer_type,
            offer_percentage: offer?.offer_percentage,
            massage: offer?.massage,
            massage_details: offer?.massage_details,
          };
        });

        setOffers(tempData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setOfferLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/spavendor/staff/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response?.data) {
        setStaff(response?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/manager/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setManagerData(data);
      } else {
        toast.error("An error occured :" + response.statusText);
      }
    } catch (error) {
      toast.error("An error occured");
    }
  };

  const fetchServices = async (page) => {
    setServiceLoading(true);

    if (!vendorData?.spa) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/service/?page=${page}&spa_id=${vendorData?.spa}`,
        {}
      );
      const data = await response.json();

      if (response.ok) {
        if (page === 1) {
          let reducedData = await data?.results.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_names,
              service_time: service?.service_time,
              discount: service?.discount,
              price: service?.price,
            };
          });
          setTempAllServices(reducedData);
        } else {
          let reducedData = await data?.results.map((service) => {
            return {
              id: service?.id,
              service_name: service?.service_names,
              service_time: service?.service_time,
              discount: service?.discount,
              price: service?.price,
            };
          });
          setTempAllServices([...tempAllServices, ...reducedData]);
        }

        if (data?.next) {
          setPage(page + 1);
        }
      } else {
        toast.error(
          `something went wrong while fetching service : ${response.statusText}`
        );
      }
    } catch (error) {
      toast.error(
        `something went wrong while fetching service : ${error.message}`
      );
    } finally {
      setServiceLoading(false);
    }
  };

  const getMembershipData = async (ph_no) => {
    let url = `https://backendapi.trakky.in/spavendor/customer-membership-new/`;

    if (ph_no) {
      url += `?customer_phone=${ph_no}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMembershipData(data);
      } else {
        toast.error("An error occured :" + response.statusText);
      }
    } catch (error) {
      toast.error("An error occured");
    }
  };

  const getCustomerNameByNumber = async (number) => {
    try {
      const response = await axios.get(
        `https://backendapi.trakky.in/spavendor/customer-table/?customer_phone=${number}`,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response?.data?.length > 0) {
        setCustomerName(response?.data[0]?.customer_name);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchStaff();
    fetchManagers();
  }, []);

  useEffect(() => {
    fetchOffers();
    fetchServices(page);
  }, [vendorData]);

  useEffect(() => {
    if (customerNumber.length === 10) {
      getMembershipData(customerNumber);
      getCustomerNameByNumber(customerNumber);
    } else {
      setMembershipData([]);
    }
  }, [customerNumber]);

  // Validate amount paid field
  useEffect(() => {
    if (amountPaid && finalAmount) {
      const paid = parseFloat(amountPaid) || 0;
      const final = parseFloat(finalAmount) || 0;
      
      if (paid < final) {
        const remaining = final - paid;
        setAmountPaidError(`Amount Remaining: ₹${remaining}`);
      } else {
        setAmountPaidError("");
      }
    }
  }, [amountPaid, finalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount paid
    if (!amountPaid || amountPaid.trim() === "") {
      setAmountPaidError("Amount Paid field required hai");
      toast.error("Amount Paid field required hai");
      return;
    }

    // Validate amount paid is not greater than final amount
    const paid = parseFloat(amountPaid) || 0;
    const final = parseFloat(finalAmount) || 0;
    if (paid > final) {
      setAmountPaidError("Amount Paid final amount se zyada nahi ho sakta");
      toast.error("Amount Paid final amount se zyada nahi ho sakta");
      return;
    }

    let SS = await services.filter((service) => {
      return service.service_id !== "";
    });

    let OO = await selectedOffers.filter((offer) => {
      return offer.id !== "";
    });

    let payload = {
      customer_name: customerName,
      customer_phone: customerNumber,
      amount_paid: amountPaid,
      staff: selectedStylist,
      included_services: SS,
      actual_amount: actualAmount,
      final_amount: finalAmount,
      manager: selectedManager,
      date: date.format("YYYY-MM-DD"),
      time_in: bookingTime.format("HH:mm:ss"),
    };

    if (membershipUsed !== "N/A") {
      payload.membership_used = membershipUsed;
    }

    if (OO.length > 0) {
      payload.included_offers = OO;
    }

    try {
      const response = await axios.post(
        "https://backendapi.trakky.in/spavendor/appointments-new/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Appointment created successfully");
        setCustomerName("");
        setCustomerNumber("");
        setgender("");
        setActualAmount("");
        setFinalAmount("");
        setSelectedStylist("");
        setSelectedManager("");
        setServices([
          {
            service_id: "",
            service_name: "",
            actual_price: "",
            final_price: "",
            from_membership: false,
            membership_id: "",
            duration: "",
            offer_id: "",
            offer_type: "",
            from_offer: false,
          },
        ]);
        setSelectedOffers([
          {
            id: "",
            offer_name: "",
            offer_time: "",
            actual_price: "",
            discount_price: "",
            staff: [],
          },
        ]);
        setMembershipUsed("N/A");

        setDate(dayjs());
        setBookingTime(dayjs());
        setAmountPaid("");
        setAmountPaidError("");
      } else {
        toast.error("Error creating appointment");
      }
    } catch (error) {
      toast.error("Error creating appointment");
    }
  };

  const handlePriceChange = () => {
    let actual_amount = 0;
    let final_amount = 0;

    services.forEach((service) => {
      actual_amount += parseFloat(service.actual_price || 0);
      final_amount += parseFloat(service.final_price || 0);
    });

    selectedOffers.forEach((offer) => {
      actual_amount += parseFloat(offer.actual_price || 0);
      final_amount += parseFloat(offer.discount_price || 0);
    });

    setActualAmount(actual_amount);
    setFinalAmount(final_amount);
  };

  useEffect(() => {
    handlePriceChange();
  }, [services, selectedOffers]);

  // check if the service is from membership or from general offer or from specific offer and then update the price accordingly
  const handleServiceChange = (value, index) => {
    let temp = [...services];

    if (value === null || value === undefined) {
      temp[index] = {
        service_id: "",
        service_name: "",
        actual_price: "",
        final_price: "",
        from_membership: false,
        membership_id: "",
        duration: "",
        offer_id: "",
        offer_type: "",
        from_offer: false,
      };
      setServices(temp);
      return;
    }

    temp[index] = {
      service_id: value?.id,
      service_name: value?.service_name,
      actual_price: value?.price,
      final_price: value?.price,
      from_membership: false,
      membership_id: "",
      duration: value?.service_time,
      offer_id: "",
      offer_type: "",
      from_offer: false,
    };

    setServices(temp);
  };

  const [mobileError, setMobileError] = useState(false);
  // Function to handle customer name input - allow only characters
  const handleCustomerNameChange = (e) => {
    const value = e.target.value;
    // Only allow alphabets and spaces
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setCustomerName(value);
    }
  };

  return (
    <div className=" h-[calc(100%-64px)] w-full py-2 px-4 ">
      <ToastContainer />
      <div className=" custom-scrollbar h-20 w-full rounded-lg bg-white shadow-sm overflow-auto">
        <div className=" flex gap-4 w-full h-full">
          {staff?.map((item, index) => (
            <div
              key={index}
              className=" h-full w-fit min-w-24 lg:min-w-32 gap-1 flex items-center flex-col justify-center"
            >
              <p className=" text-base font-semibold ">{item?.staffname}</p>
              <p className=" text-sm ">{item?.is_busy ? "Busy" : "Free"}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col esm:flex-row gap-4 w-full esm:w-auto mt-3">
        <div className="sm-auto sm:w-[calc(100%-340px)] border rounded-md h-auto bg-white shadow-sm p-3">
          <div className=" mb-6  rounded-lg bg-white grid gap-x-6 gap-y-6 grid-cols-2 mx-auto py-5 md:py-4 lg:px-10">
            <div className=" col-span-2 -mb-2">
              <h1 className=" text-base font-semibold">
                Appointment Date & Time
              </h1>
            </div>

            <div className=" w-full   ">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{
                  width: "100%",
                }}
              >
                <DatePicker
                  label="Date"
                  value={date}
                  sx={{
                    width: "100%",
                  }}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </div>
            <div className=" w-full   ">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{
                  width: "100%",
                }}
              >
                <TimePicker
                  label="Booking Time"
                  value={bookingTime}
                  onChange={setBookingTime}
                  referenceDate={date}
                  sx={{
                    width: "100%",
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className=" col-span-2 -mb-2 mt-1">
              <h1 className=" text-base font-semibold">Customer Details</h1>
            </div>




<div className=" w-full   ">
  <TextField
    id="number"
    label="customer number"
    type="tel"
    onWheel={() => document.activeElement.blur()}
    onKeyDownCapture={(event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    }}
    variant="outlined"
    fullWidth
    value={customerNumber}
    onChange={(e) => {
      // Only allow digits
      const value = e.target.value.replace(/\D/g, '');
      // Only update if the input length is 10 or less
      if (value.length <= 10) {
        setCustomerNumber(value);
      }
    }}
    onBlur={() => {
      // Jab user field se bahar aaye to check karo
      if (customerNumber.length > 0 && customerNumber.length < 10) {
        toast.error("10 digits required hain");
        setMobileError(true);
      } else {
        setMobileError(false);
      }
    }}
    onFocus={() => {
      // Jab field mein click kare to error hatado
      setMobileError(false);
    }}
    error={mobileError}
    inputProps={{ 
      maxLength: 10,
      inputMode: 'numeric'
    }}
  />
</div>


            <div className=" w-full   ">
              <TextField
                fullWidth
                id="customer-name"
                label="customer name"
                variant="outlined"
                value={customerName}
                onChange={handleCustomerNameChange}
              />
            </div>
            <div className=" w-full">
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
            </div>

            <div className=" w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Manager name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedManager}
                  label="Manager Name"
                  onChange={(e) => setSelectedManager(e.target.value)}
                >
                  {managerData?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.managername}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className=" col-span-2 -mb-2 mt-1">
              <h1 className=" text-base font-semibold">Membership Details</h1>
            </div>

            <div className=" w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Membership used
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Membership used"
                  value={membershipUsed}
                  onChange={(e) => {
                    setMembershipUsed(e.target.value);
                  }}
                >
                  <MenuItem value="N/A" selected>
                    No Membership applied
                  </MenuItem>
                  {membershipData?.map((item) => (
                    <MenuItem key={item.id} value={item?.membership_code}>
                      {item.membership_code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className=" col-span-2 -mb-2 mt-1">
              <h1 className=" text-base font-semibold">Service Details</h1>
            </div>
            {services.map((service, index) => (
              <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                <div className="  flex gap-2 items-center">
                  <div className=" w-[40%] grow shrink  ">
                    <Autocomplete
                      disablePortal
                      id="service-options"
                      options={allServices}
                      disabled={serviceLoading}
                      getOptionLabel={(option) => `${option?.service_name}`}
                      getOptionKey={(option) => option.service_id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="service" />
                      )}
                      value={service.service_id ? service : null}
                      onChange={(e, value) => {
                        handleServiceChange(value, index);
                      }}
                    />
                  </div>

                  <div className=" w-1/4">
                    <TextField
                      id={`actial-amount-${index}`}
                      label="Service Final Amount"
                      type="number"
                      variant="outlined"
                      onWheel={() => document.activeElement.blur()}
                      onKeyDownCapture={(event) => {
                        if (
                          event.key === "ArrowUp" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                        }
                      }}
                      fullWidth
                      value={service.actual_price}
                      readOnly
                      disabled
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                      InputLabelProps={{
                        shrink: service.actual_price ? true : false,
                      }}
                    />
                  </div>
                  <div className=" w-1/4">
                    <TextField
                      id={`final-amount-${index}`}
                      label="Service Final Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={service.final_price}
                      readOnly
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                      disabled
                      // lable active
                      InputLabelProps={{
                        shrink: service.service_id ? true : false,
                      }}
                    />
                  </div>
                  <div className=" flex">
                    <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                      <div
                        className={` w-10 h-10 flex items-center justify-center bg-blue-500 rounded-md ${
                          service.service_id ? "flex" : "hidden"
                        }`}
                      >
                        <EditIcon
                          className=" h-full w-full !text-[32px] text-white"
                          onClick={() => {
                            setServiceEditModalOpen(true);
                            setServiceEditData(service);
                          }}
                        />
                      </div>
                    </div>
                    <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                      {index == services?.length - 1 ? (
                        <div
                          className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                          onClick={() => {
                            setServices([
                              ...services,
                              {
                                service_id: "",
                                service_name: "",
                                actual_price: "",
                                final_price: "",
                                from_membership: false,
                                membership_id: "",
                                duration: "",
                                offer_id: "",
                                offer_type: "",
                                from_offer: false,
                              },
                            ]);
                          }}
                        >
                          <AddIcon className=" h-full w-full text-white !text-[40px]" />
                        </div>
                      ) : (
                        <div
                          className=" w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                          onClick={() => {
                            if (services.length === 1) {
                              let temp = [...services];
                              temp[index] = {
                                service_id: "",
                                service_name: "",
                                actual_price: "",
                                final_price: "",
                                from_membership: false,
                                membership_id: "",
                                duration: "",
                                offer_id: "",
                                offer_type: "",
                                from_offer: false,
                              };
                            }

                            let temp = [...services];
                            temp.splice(index, 1);
                            setServices(temp);
                          }}
                        >
                          <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {service?.service_id && (
                  <div className=" text-gray-500 text-[13px] pl-2">
                    Approx Time : {formateTime(service?.duration)}, &nbsp;
                    <span className=" h-full">
                      {service?.from_membership ? (
                        <span className=" underline text-black">
                          Membership applied
                        </span>
                      ) : service?.from_offer ? (
                        <span className=" underline text-black">
                          {service?.offer_type === "general"
                            ? "General Offer applied"
                            : "Specific Offer applied"}
                        </span>
                      ) : (
                        <span className=" underline text-black"></span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div className=" col-span-2 -mb-2 mt-1">
              <h1 className=" text-base font-semibold">Offer Details</h1>
            </div>
            {selectedOffers.map((offer, index) => (
              <div className=" flex flex-col w-full col-span-2 gap-[6px]">
                <div className=" flex gap-2 items-center">
                  <div className=" w-[40%] grow shrink ">
                    <Autocomplete
                      disablePortal
                      id="offers-options"
                      options={offers}
                      disabled={offerLoading}
                      getOptionLabel={(option) =>
                        `${option?.offer_name} (${option?.discount_price})`
                      }
                      getOptionKey={(option) => option.id}
                      fullWidth
                      renderInput={(params) => (
                        <TextField {...params} label="Select Offer" />
                      )}
                      value={offer.id ? offer : null}
                      onChange={(e, value) => {
                        let temp = [...selectedOffers];
                        if (value === null || value === undefined) {
                          temp[index] = {
                            id: "",
                            offer_name: "",
                            offer_time: "",
                            actual_price: "",
                            discount_price: "",
                            staff: [],
                          };
                        } else {
                          temp[index] = {
                            id: value.id,
                            offer_name: value.offer_name,
                            offer_time: value.offer_time,
                            actual_price: value.actual_price,
                            discount_price: value.discount_price,
                            staff:
                              temp[index]?.staff?.length > 0
                                ? temp[index].staff
                                : [],
                          };
                        }
                        setSelectedOffers(temp);
                      }}
                    />
                  </div>
                  <div className="w-1/4">
                    <FormControl
                      fullWidth
                      sx={{
                        backgroundColor: offer?.id ? "inherit" : "#f9f9f9",
                        cursor: offer?.id ? "auto" : "not-allowed",
                      }}
                    >
                      <InputLabel id={`staff-label-${index}`}>Staff</InputLabel>
                      <Select
                        labelId={`staff-label-${index}`}
                        id={`staff-select-${index}`}
                        value={offer.staff || []} // Use offer.staff instead of selectedStaff
                        multiple
                        disabled={!offer?.id}
                        label="Staff"
                        onChange={(e) => {
                          let temp = [...selectedOffers];
                          temp[index] = {
                            ...temp[index],
                            staff: e.target.value,
                          };
                          setSelectedOffers(temp);
                        }}
                        renderValue={(selected) =>
                          selected
                            .map((id) => {
                              const staffMember = staff.find(
                                (s) => s.id === id
                              );
                              return staffMember ? staffMember.staffname : "";
                            })
                            .join(", ")
                        }
                      >
                        {staff.map((staffMember) => (
                          <MenuItem
                            key={staffMember.id}
                            value={staffMember.id}
                            disabled={staffMember.is_busy}
                            style={{
                              color: staffMember.is_busy ? "#ccc" : "inherit",
                              opacity: staffMember.is_busy ? 0.7 : 1,
                            }}
                          >
                            <Checkbox
                              checked={
                                offer.staff?.includes(staffMember.id) || false
                              }
                            />{" "}
                            {/* Check against offer.staff */}
                            <ListItemText
                              primary={`${staffMember.staffname} (${staffMember.staff_role
                                }) - ${staffMember.is_busy ? "Busy" : "Free"}`}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className=" w-1/4">
                    <TextField
                      id={`actual-amount-${index}`}
                      label="Actual Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={offer.actual_price}
                      // onChange={(e) => setFinalAmount(e.target.value)}
                      readOnly
                      disabled
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                    />
                  </div>
                  <div className=" w-1/4">
                    <TextField
                      id={`final-amount-${index}`}
                      label="Final Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={offer.discount_price}
                      readOnly
                      sx={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                      disabled
                    // onChange={(e) => setFinalAmount(e.target.value)}
                    />
                  </div>
                  <div className=" h-full w-[60px] shrink-0 flex items-center justify-center">
                    {index == selectedOffers?.length - 1 ? (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-emerald-500 rounded-md"
                        onClick={() => {
                          setSelectedOffers([
                            ...selectedOffers,
                            {
                              id: "",
                              offer_name: "",
                              offer_time: "",
                              actual_price: "",
                              discount_price: "",
                              staff: [],
                            },
                          ]);
                        }}
                      >
                        <AddIcon className=" h-full w-full text-white !text-[40px]" />
                      </div>
                    ) : (
                      <div
                        className=" w-10 h-10 flex items-center justify-center bg-red-500 rounded-md"
                        onClick={() => {
                          if (selectedOffers.length === 1) {
                            let temp = [...selectedOffers];
                            temp[index] = {
                              id: "",
                              offer_name: "",
                              offer_time: "",
                              actual_price: "",
                              discount_price: "",
                            };
                            setSelectedOffers(temp);
                            return;
                          }
                          let temp = [...selectedOffers];
                          temp.splice(index, 1);
                          setSelectedOffers(temp);
                        }}
                      >
                        <DeleteOutlineIcon className=" h-full w-full !text-[32px] text-white" />
                      </div>
                    )}
                  </div>
                </div>
                {offer?.id && (
                  <div className=" text-gray-500 text-[13px] pl-2">
                    Approx Time : {formateTime(offer?.offer_time)}
                  </div>
                )}
              </div>
            ))}

            <div className=" col-span-2 -mb-2 mt-1">
              <h1 className=" text-base font-semibold">Amount Details</h1>
            </div>

            <div className=" w-full ">
              <TextField
                id="actual-amount"
                label="Actual Actual Amount"
                type="number"
                variant="outlined"
                fullWidth
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value)}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full ">
              <TextField
                id="final-amount"
                label="Actual Final Amount"
                type="number"
                variant="outlined"
                fullWidth
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full ">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Stylist
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Manager Name"
                  value={selectedStylist}
                  onChange={(e) => setSelectedStylist(e.target.value)}
                >
                  {staff?.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                      disabled={item.is_busy}
                    >
                      {item.staffname}&nbsp;{item.is_busy ? "(Busy)" : "(Free)"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className=" w-full ">
              <TextField
                id="amount-paid"
                label="Amount Paid"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={amountPaid}
                onChange={(e) => {
                  setAmountPaid(e.target.value);
                  if (e.target.value.trim() === "") {
                    setAmountPaidError("Amount Paid field required");
                  } else {
                    setAmountPaidError("");
                  }
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
                error={!!amountPaidError}
                helperText={amountPaidError}
              />
            </div>
            <div className=" col-span-2">
              <button
                className=" mx-auto block bg-black text-white py-2 rounded-md px-4 w-fit"
                onClick={handleSubmit}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
        <div className=" w-[340px] h-full flex flex-col gap-3 md:sticky md:top-[75px]">
          <div className=" w-full h-auto  bg-white rounded-md shadow-sm p-2">
            <div className=" font-semibold text-lg border-b border-gray-400">
              Offers available
            </div>
            <div className=" h-auto max-h-60 flex gap-1 flex-col overflow-auto custom-scrollbar">
              {offerLoading ? (
                <div className=" h-20 flex items-center justify-center">
                  <CircularProgress
                    sx={{
                      color: "#000",
                      margin: "auto",
                      display: "block",
                    }}
                  />
                </div>
              ) : offers?.length > 0 ? (
                offers?.map((item, index) => (
                  <div key={index} className=" w-full flex gap-1 flex-col p-1">
                    <div className=" w-full text-sm font-medium text-gray-900 line-clamp-1">
                      {item?.offer_name}
                    </div>
                    <div className=" w-full text-sm">
                      Offer name : {item?.offer_name}
                    </div>
                    <div className=" w-full text-sm">
                      Offer percentage : {item?.offer_percentage}%
                    </div>
                    <div className=" w-full text-sm">
                      Offer type : {item?.offer_type}
                    </div>
                    <div className=" w-full text-sm">
                      Offer price : {item?.discount_price ?? "-"}
                    </div>
                    <div className=" w-full text-sm">
                      Actual price : {item?.actual_price ?? "-"}
                    </div>

                    <div className=" h-[1px] w-11/12 bg-gray-300 mx-auto"></div>
                  </div>
                ))
              ) : (
                <div className=" w-full h-20 flex items-center justify-center">
                  <h1 className=" text-lg font-bold">No Offers Found</h1>
                </div>
              )}
            </div>
          </div>
          <div className=" w-full h-auto  bg-white rounded-md shadow-sm p-2">
            <div className=" font-semibold text-lg border-b border-gray-400">
              Membership available
            </div>
            <div>
              <div className="h-auto max-h-60 flex gap-1 flex-col overflow-auto custom-scrollbar">
                {membershipData?.length > 0 ? (
                  membershipData.map((item, index) => (
                    <div
                      key={index}
                      className="w-full flex gap-1 p-1 items-center"
                    >
                      <div className="w-full text-sm font-medium text-gray-900 line-clamp-1">
                        {item?.membership_type_detail?.membership_name} -{" "}
                        {item?.membership_code}
                      </div>
                      <div className="flex gap-1 items-center">
                        <button
                          className="border border-black px-3 py-[2px] rounded-md w-fit"
                          onClick={() => handleViewClick(item)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-20 flex items-center justify-center">
                    <h1 className="text-base font-normal">
                      No Membership Found
                    </h1>
                  </div>
                )}
              </div>

              {/* Sidebar Component */}
              {showSidecard && selectedMembership && (
                <div
                  className={`fixed right-0 top-16 w-100 h-[calc(100%-4rem)] bg-white shadow-lg border-l border-gray-300 transform transition-transform duration-300 ${
                    showSidecard ? "translate-x-0" : "translate-x-full"
                  } z-50 rounded-lg overflow-auto`}
                >
                  <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-t-lg">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Membership Details
                    </h2>
                    <button
                      onClick={toggleSidecard}
                      className="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors duration-200"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <div className="p-6 pr-[80px] space-y-4">
                    <ul className="space-y-3">
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Membership Code:
                        </strong>{" "}
                        {selectedMembership?.membership_code}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Customer Name:
                        </strong>{" "}
                        {selectedMembership?.customer?.customer_name}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Customer Phone:
                        </strong>{" "}
                        {selectedMembership?.customer?.customer_phone}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Membership Price:
                        </strong>{" "}
                        ₹
                        {
                          selectedMembership?.membership_type_detail
                            ?.membership_price
                        }
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">Amount Paid:</strong>{" "}
                        ₹{selectedMembership?.amount_paid}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">Branch Name:</strong>{" "}
                        {selectedMembership?.branch_name}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">Manager Name:</strong>{" "}
                        {selectedMembership?.manager_detail?.managername}
                      </li>

                      <li className="text-gray-700">
                        <strong className="text-gray-900">Validity:</strong>{" "}
                        {
                          selectedMembership?.membership_type_detail
                            ?.validity_in_months
                        }{" "}
                        Months
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Included Services:
                        </strong>
                        {selectedMembership?.membership_type_detail?.service_ids?.map(
                          (service, index) => (
                            <span key={index} className="block">
                              {service?.name} :-{" "}
                              <span className=" text-blue-600">
                                {service?.points_per_massage} Points
                              </span>
                              ,
                            </span>
                          )
                        )}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">Date Created:</strong>{" "}
                        {selectedMembership?.created_at?.split("T")[0]}
                      </li>
                      <li className="text-gray-700">
                        <strong className="text-gray-900">
                          Terms and Conditions:
                        </strong>
                        <div
                          className="terms-and-conditions dangerous-html w-full"
                          dangerouslySetInnerHTML={{
                            __html: selectedMembership?.terms_and_conditions,
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <GeneralModal
        open={changeServiceMembershipModalOpen}
        handleClose={() => {
          // replace the service with the original service with serviceEditData

          setChangeServiceMembershipModalOpen(false);
          setChangeServiceMembershipModalData(null);
        }}
      >
        <div className=" p-5">
          <div className=" flex gap-1">
            <span className=" font-semibold">Service name : </span>
            <span>
              {changeServiceMembershipModalData?.service?.service_name} ({" "}
              {changeServiceMembershipModalData?.service?.gender} )
            </span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Price : </span>
            <span>{changeServiceMembershipModalData?.service?.price}</span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Discount : </span>
            <span>{changeServiceMembershipModalData?.service?.discount}</span>
          </div>
          <div className=" flex gap-1">
            <span className=" font-semibold">Service Time : </span>
            <span>
              {formateTime(
                changeServiceMembershipModalData?.service?.service_time
              )}
            </span>
          </div>
          <hr />
          {/* dropdown of yes / no */}
          {changeServiceMembershipModalData?.service?.id ==
            services[changeServiceMembershipModalData?.index]?.id && (
            <div className=" w-full mt-10">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Membership Applied
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Membership Applied"
                  value={
                    services[changeServiceMembershipModalData?.index]
                      ?.from_membership
                  }
                  onChange={(e) => {
                    let temp = [...services];
                    temp[changeServiceMembershipModalData?.index] = {
                      ...temp[changeServiceMembershipModalData?.index],
                      from_membership: e.target.value,
                    };
                    setServices(temp);
                    handlePriceChange();
                  }}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      </GeneralModal>

      <GeneralModal
        open={serviceEditModalOpen}
        handleClose={() => {
          let temp = [...services];
          // replace item with edited item using service_id
          temp.forEach((item, index) => {
            if (item?.service_id == serviceEditData?.service_id) {
              temp[index] = serviceEditData;
            }
          });

          setServices(temp);
          setServiceEditModalOpen(false);
        }}
      >
        <div className=" p-5 flex flex-col gap-2">
          {/* service name input readonly */}

          <div className="my-2 flex justify-between items-center">
            <h1 className=" text-base font-semibold">Service Details</h1>
            <button
              onClick={() => {
                setServiceEditModalOpen(false);
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <div className=" flex w-full">
            <TextField
              id="service-name"
              label="Service Name"
              variant="outlined"
              fullWidth
              value={serviceEditData?.service_name}
              disabled
            />
          </div>

          {/* membership */}

          <div className="my-3">
            <h1 className=" text-base font-semibold">Membership Details</h1>
          </div>

          <div className=" flex gap-2">
            <div className=" w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Membership used
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Membership used"
                  value={serviceEditData?.membership_id}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      let temp = { ...serviceEditData };
                      temp.membership_id = e.target.value;
                      temp.from_membership = false;
                      temp.final_price = temp.actual_price;
                      temp.offer_id = "";
                      temp.offer_type = "";
                      temp.from_offer = false;
                      setServiceEditData(temp);
                      return;
                    }

                    // reCalculateServicePrice();
                    let temp = { ...serviceEditData };
                    temp.membership_id = e.target.value;
                    temp.from_membership = true;
                    temp.final_price = 0;
                    temp.offer_id = "";
                    temp.offer_type = "";
                    temp.from_offer = false;
                    setServiceEditData(temp);
                  }}
                >
                  <MenuItem value="" selected>
                    No Membership applied
                  </MenuItem>
                  {membershipData?.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item?.id}
                      disabled={
                        !item?.membership_type_detail?.service_ids
                          ?.map((service) => service.service_id)
                          .includes(serviceEditData?.service_id)
                      }
                    >
                      {item.membership_code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className=" w-full   ">
              {membershipData?.length > 0 ? (
                <div
                  className=""
                  style={{
                    color: "green",
                    fontStyle: "italic",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  *Membership available for this contact number
                </div>
              ) : (
                <div
                  className=""
                  style={{
                    color: "red",
                    fontStyle: "italic",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  *No membership available for this contact number
                </div>
              )}
            </div>
          </div>

          {/* Offer details */}

          <div className=" my-3">
            <h1 className=" text-base font-semibold">Offer Details</h1>
          </div>

          <div className=" flex gap-2">
            <div className=" w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Offer type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Offer type"
                  value={serviceEditData?.offer_type}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      let temp = { ...serviceEditData };
                      temp.offer_type = e.target.value;
                      temp.from_offer = false;
                      temp.offer_id = "";
                      temp.final_price = temp.actual_price;
                      temp.membership_id = "";
                      temp.from_membership = false;
                      setServiceEditData(temp);
                      return;
                    }

                    let temp = { ...serviceEditData };
                    temp.offer_type = e.target.value;
                    temp.offer_id = "";
                    temp.from_offer = false;
                    temp.final_price = temp.actual_price;
                    temp.membership_id = "";
                    temp.from_membership = false;

                    setServiceEditData(temp);
                  }}
                >
                  <MenuItem
                    value=""
                    className="flex items-center justify-between"
                  >
                    No Offer
                  </MenuItem>
                  <MenuItem
                    value="massage specific"
                    className="flex items-center justify-between"
                  >
                    Massage specific
                  </MenuItem>
                  <MenuItem
                    value="general"
                    className="flex items-center justify-between"
                  >
                    General
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className=" w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Offer
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Offer"
                  disabled={serviceEditData?.offer_type === ""}
                  value={serviceEditData?.offer_id}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      let temp = { ...serviceEditData };
                      temp.offer_id = e.target.value;
                      temp.from_offer = false;
                      temp.final_price = temp.actual_price;
                      temp.membership_id = "";
                      temp.from_membership = false;
                      setServiceEditData(temp);
                      return;
                    }

                    if (serviceEditData?.offer_type === "massage specific") {
                      // check if the offer is for the same service
                      let filteredOffer = offers?.filter(
                        (offer) => offer.offer_id === e.target.value
                      );

                      if (
                        filteredOffer[0]?.massage !==
                        serviceEditData?.service_id
                      ) {
                        toast.error(
                          "This offer is not available for this service"
                        );
                        return;
                      }

                      let temp = { ...serviceEditData };
                      temp.offer_id = e.target.value;
                      temp.from_offer = true;
                      temp.membership_id = "";
                      temp.from_membership = false;
                      temp.final_price = filteredOffer[0]?.discount_price;
                      setServiceEditData(temp);
                    } else if (serviceEditData?.offer_type === "general") {
                      let filteredOffer = offers?.filter(
                        (offer) => offer.offer_id === e.target.value
                      );

                      if (!filteredOffer[0]?.offer_percentage) {
                        toast.error(
                          "This offer is not available for this service"
                        );
                        return;
                      }

                      let temp = { ...serviceEditData };
                      temp.offer_id = e.target.value;
                      temp.from_offer = true;
                      temp.membership_id = "";
                      temp.from_membership = false;
                      temp.final_price =
                        (parseInt(serviceEditData?.actual_price) *
                          (100 -
                            parseInt(filteredOffer[0]?.offer_percentage))) /
                        100;
                      setServiceEditData(temp);
                      return;
                    }
                  }}
                >
                  <MenuItem value="" selected>
                    No Offer
                  </MenuItem>
                  {offers
                    ?.filter(
                      (offer) =>
                        offer.offer_type === serviceEditData?.offer_type
                    )
                    .map((item) => (
                      <MenuItem
                        key={item.offer_id}
                        value={item.offer_id}
                        disabled={
                          (item.offer_type === "massage specific" &&
                            item?.massage !== serviceEditData?.service_id) ||
                          (item.offer_type === "general" &&
                            !item?.offer_percentage)
                        }
                      >
                        {item.offer_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* actual price & final price */}
          <div className=" my-3">
            <h1 className=" text-base font-semibold">Amount Details</h1>
          </div>

          <div className=" flex gap-2">
            <div className=" w-full">
              <TextField
                id="actual-amount"
                label="Actual Actual Amount"
                type="number"
                variant="outlined"
                fullWidth
                value={serviceEditData?.actual_price}
                disabled
              />
            </div>
            <div className=" w-full">
              <TextField
                id="final-amount"
                label="Actual Final Amount"
                type="number"
                variant="outlined"
                fullWidth
                value={serviceEditData?.final_price}
                // onChange={(e) => {
                //   let temp = { ...serviceEditData };
                //   temp.final_price = e.target.value;
                //   setServiceEditData(temp);
                // }}
                readOnly
              />
            </div>
          </div>
        </div>
      </GeneralModal>
    </div>
  );
};

export default AppointmentForm;