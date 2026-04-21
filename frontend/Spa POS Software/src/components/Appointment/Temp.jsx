import React, { useContext, useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../Context/Auth";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import GeneralModal from "../generalModal/GeneralModal";
import CloseIcon from "@mui/icons-material/Close";

const steps = ["customer details", "service details", "checkout"];

const EditAppointment = ({
  appointment,
  handleToastMessage,
  closeDrawer,
  setAppointmentData,
}) => {
  const { authTokens, vendorData } = useContext(AuthContext);

  // const [membershipCode, setMembershipCode] = useState("");
  // const [membershipUsed, setMembershipUsed] = useState("N/A");
  const [membershipData, setMembershipData] = useState([]);
  const [services, setServices] = useState(
    appointment?.included_services || [
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
    ]
  );
  const [allServices, setAllServices] = useState([]);
  const [tempAllServices, setTempAllServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [offerLoading, setOfferLoading] = useState(false);

  // const [selectedOffers, setSelectedOffers] = useState([]);
  const [customerName, setCustomerName] = useState(appointment?.customer_name);
  const [customerPhone, setCustomerPhone] = useState(
    appointment?.customer_phone
  );
  const [customerType, setCustomerType] = useState(appointment?.customer_type);
  const [customerEmail, setCustomerEmail] = useState(
    appointment?.customer_email
  );
  const [actualAmount, setActualAmount] = useState(appointment?.actual_amount);
  const [finalAmount, setFinalAmount] = useState(appointment?.final_amount);
  const [amountPaid, setAmountPaid] = useState(appointment?.amount_paid);
  const [paymentStatus, setPaymentStatus] = useState(
    appointment?.payment_status
  );
  const [paymentMode, setPaymentMode] = useState(appointment?.payment_mode);

  const [page, setPage] = useState(1);

  const [activeStep, setActiveStep] = useState("customer details");

  const [serviceEditModalOpen, setServiceEditModalOpen] = useState(false);
  const [serviceEditData, setServiceEditData] = useState(null);

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
        `something went wrong while fetching service : ${error?.message}`
      );
    } finally {
      setServiceLoading(false);
    }
  };

  const fetchOffers = async () => {
    setOfferLoading(true);

    if (!vendorData?.spa) return;

    let url = `https://backendapi.trakky.in/spas/spa-profile-page-offer/?spa_id=${vendorData?.spa}`;

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
            offer_id: offer?.id,
            offer_name: offer?.offer_name,
            discount_price: offer?.discount_price,
            actual_price: offer?.massage_price,
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
    if (customerPhone.length === 10) {
      getMembershipData(customerPhone);
      if (!customerName) {
        getCustomerNameByNumber(customerPhone);
      }
    } else {
      setMembershipData([]);
      // setMembershipUsed("N/A");
    }
  }, [customerPhone]);

  useEffect(() => {
    if (tempAllServices.length > 0) {
      setAllServices(tempAllServices);
    }
  }, [tempAllServices]);

  useEffect(() => {
    fetchServices(page);
    fetchOffers();
  }, [vendorData]);

  const handlePriceChange = () => {
    let actual_amount = 0;
    let final_amount = 0;

    services.forEach((service) => {
      actual_amount =
        parseFloat(actual_amount) + parseFloat(service.actual_price);
      final_amount = parseFloat(final_amount) + parseFloat(service.final_price);
    });

    setActualAmount(actual_amount);
    setFinalAmount(final_amount);
  };

  useEffect(() => {
    handlePriceChange();
  }, [services]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let SS = services.filter((service) => {
      return service.service_id !== "";
    });

    let payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      payment_mode: paymentMode,
      final_amount: finalAmount,
      actual_amount: actualAmount,
      payment_status: paymentStatus,
      amount_paid: amountPaid,
      checkout_appointment: true,
      included_services: SS,
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/appointments-new/${appointment.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        handleToastMessage("Appointment Updated Successfully", "success");
        setAppointmentData(data);

        closeDrawer();
      } else {
        handleToastMessage(
          `An error occured : ${response.statusText}`,
          "error"
        );
      }
    } catch (error) {
      handleToastMessage("An error occured", "error");
    }
  };

  return (
    <>
      <div className=" lg:max-w-[1000px] flex gap-2 h-full">
        <div className=" max-h-full sticky top-0">
          <div className=" max-h-full flex flex-col gap-3 mt-12 h-full border-r border-solid pr-1">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex w-48 items-center gap-2 px-3 py-1 cursor-pointer ${
                  activeStep === step
                    ? "text-gray-700 border-l-4 font-semibold border-solid border-gray-700"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveStep(step)}
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className=" mb-6 mt-10 h-fit overflow-y-auto  rounded-lg bg-white grid gap-x-6 gap-y-6 grid-cols-2 mx-auto py-5 md:py-4 lg:px-10 lg:w-[800px]">
          {activeStep === "customer details" && (
            <>
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Customer Details</h1>
              </div>
              <div className=" w-full   ">
                <TextField
                  id="name"
                  label="Customer Name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={customerName}
                  readOnly
                  // disabled
                />
              </div>

              <div className=" w-full   ">
                <TextField
                  id="phone"
                  label="Customer Phone"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={customerPhone}
                  readOnly
                  // disabled
                />
              </div>

              <div className=" w-full   ">
                <TextField
                  id="email"
                  label="Customer Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className=" w-full   ">
                <TextField
                  id="customer-type"
                  label="Customer Type"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={customerType}
                  readOnly
                  // disabled
                />
              </div>
            </>
          )}
          {activeStep === "service details" && (
            <>
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
                        sx={{
                          cursor: "not-allowed",
                          backgroundColor: "#f9f9f9",
                        }}
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
                        sx={{
                          cursor: "not-allowed",
                          backgroundColor: "#f9f9f9",
                        }}
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
            </>
          )}

          {activeStep === "checkout" && (
            <>
              <div className=" col-span-2 -mb-2 mt-1">
                <h1 className=" text-base font-semibold">Payment Details</h1>
              </div>

              <div className=" w-full">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Payment Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={paymentStatus}
                    label="Payment Status"
                    onChange={(e) => {
                      setPaymentStatus(e.target.value);
                    }}
                  >
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className=" w-full">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Payment mode
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={paymentMode}
                    label="Payment Mode"
                    onChange={(e) => {
                      setPaymentMode(e.target.value);
                    }}
                    disabled={paymentStatus === "unpaid"}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="credit-card">Credit card</MenuItem>
                    <MenuItem value="debit-card">Debit card</MenuItem>
                    <MenuItem value="net-banking">Net Banking</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className=" w-full ">
                <TextField
                  id="final-amount"
                  label="Total Final Amount"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={finalAmount}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) => setFinalAmount(e.target.value)}
                />
              </div>
              <div className=" w-full ">
                <TextField
                  id="amount-paid"
                  label="Amount Paid"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={amountPaid}
                  onWheel={() => document.activeElement.blur()}
                  onKeyDownCapture={(event) => {
                    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>
            </>
          )}
          <div className=" col-span-2 flex w-full justify-between items-center">
            {/* prev */}
            <button
              className={` block border border-black text-black py-2 rounded-md px-4 w-fit ${
                activeStep === "customer details"
                  ? "cursor-not-allowed opacity-30"
                  : ""
              } `}
              onClick={() => {
                if (activeStep === "service details") {
                  setActiveStep("customer details");
                }else if (activeStep === "checkout") {
                  setActiveStep("service details");
                }
              }}
              disabled={activeStep === "customer details"}
            >
              Previous
            </button>
            {/* checkout */}
            <button
              className={` block bg-black text-white py-2 rounded-md px-4 w-fit ${
                activeStep === "checkout" ? "visible" : "invisible"
              }`}
              onClick={handleSubmit}
            >
              Checkout
            </button>
            {/* next */}
            <button
              className={` block border border-black text-black py-2 rounded-md px-4 w-fit ${
                activeStep === "checkout"
                  ? " cursor-not-allowed opacity-30"
                  : ""
              }`}
              onClick={() => {
                if (activeStep === "customer details") {
                  setActiveStep("service details");
                } else if (activeStep === "service details") {
                  setActiveStep("checkout");
                }
              }}
              disabled={activeStep === "checkout"}
            >
              Next
            </button>
          </div>
        </div>
      </div>

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
                label="Approx Actual Amount"
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
                label="Approx Final Amount"
                type="number"
                variant="outlined"
                fullWidth
                value={serviceEditData?.final_price}
                readOnly
              />
            </div>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default EditAppointment;
