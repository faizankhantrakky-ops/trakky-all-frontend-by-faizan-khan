import React, { useState, useEffect, useContext, useRef } from "react";
import AsyncSelect from "react-select/async";
import AuthContext from "../Context/AuthContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GeneralModal from "./generalModal/GeneralModal";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const OfferServicesReqPage = () => {

  const { authTokens } = useContext(AuthContext);
  const confirm = useConfirm();

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");
  const [page, setPage] = useState(1);
  const [OfferDataLoading, setOfferDataLoading] = useState(false);
  const [OfferrequestData, setOfferRequestData] = useState([]);
  const [openOfferApproveModal, setOpenOfferApproveModal] = useState(false);
  const [approvalOfferReqData, setApprovalOfferReqData] = useState({});
  const totalPages = 1;

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setCityPayload(data?.payload);
        let cityNames = data?.payload.map((item) => item.name);
        setCity(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      let cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas = selectedAreas?.concat(city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  const getOfferRequestData = async () => {
    try {
      setOfferDataLoading(true);

      let url = `https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests-admin/`;

      if (selectedCity) {
        url += `&city=${encodeURIComponent(selectedCity)}`;
      }

      if (selectedAreaName) {
        url += `&area=${encodeURIComponent(selectedAreaName)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${authTokens.access}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setOfferRequestData(data);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching offer request data:", error);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setOfferDataLoading(false);
    }
  };

  const handleRejectService = async (id) => {
    try {
      let url = `https://backendapi.trakky.in/salonvendor/salon-profile-offer-requests-admin/${id}/`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          service_status: "rejected",
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Category rejected successfully");
        getOfferRequestData();
      } else {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        toast.error("Failed to reject category. Please try again later");
      }
    } catch (error) {
      console.error("Error rejecting category:", error);
      toast.error("Failed to reject category. Please try again later");
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    setSelectedSalons("");

    if ((selectedCity !== "" || selectedAreaName !== "") && page === 1) {
    } else {
      setPage(1);
    }
  }, [selectedAreaName, selectedCity]);

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCity);
    setSelectedAreaName("");
    setAvailableAreaName(selectedAreas);
  }, [selectedCity, cityPayload]);

  useEffect(() => {
    getOfferRequestData();
  }, [selectedCity, selectedAreaName, page]);

  const tableHeaders = [
    "Index",
    "Offer name",
    "Salon city",
    "Gender",
    "Service time",
    "Description",
    "Price",
    "Status",
    "Action",
  ];


  // approved-salon-profile-offer
  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div
              className="tb-body-src-fil"
              style={{
                alignItems: "center",
              }}
            >
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              // onMouseEnter={() => setHovered(true)}
              // onMouseLeave={() => setHovered(false)}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    // disabled={dateFilter}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
                      setSelectedSalons([]);
                      setSelectedCity(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: 110 }}
                  size="small"
                //   disabled={!selectedCity}
                >
                  <InputLabel id="demo-simple-select-label">Area</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAreaName}
                    label="Area"
                    onChange={(e) => {
                      setSelectedAreaName(e.target.value);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableAreaName?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="input-box inp-salon col-1 col-2 relative min-w-[200px] z-10">
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadSalons}
                  value={selectedSalons}
                  onChange={(selectedSalon) => {
                    setSelectedSalons(selectedSalon);
                    setSelectSalonId(selectedSalon.value);
                  }}
                  noOptionsMessage={() => "No salons found"}
                  isDisabled={selectedCity === ""}
                  placeholder="Search Salon..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#ccc",
                      },
                    }),
                  }}
                />
              </div>

              <div className="min-w-max text-sm">
                ( City & Area filter for search salon )
              </div>
            </div>
          </div>

          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    style={
                      header === "Description"
                        ? { maxWidth: "356px", minWidth: "356px" }
                        : {}
                    }
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {OfferDataLoading ? (
                  <tr>
                    <td colSpan={13} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : OfferrequestData?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={13}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No data found
                      </div>
                    </td>
                  </tr>
                ) : (
                  OfferrequestData?.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>{service?.name}</td>
                        <td>
                          {service?.city}
                        </td>

                        <td>{service?.gender}</td>
                        <td>
                          hours : {service?.offer_timing?.hours}
                          <br />
                          minutes : {service?.offer_timing?.minutes}
                          seating : {service?.offer_timing?.seating}
                        </td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: service?.terms_and_conditions,
                            }}
                          />
                        </td>
                        <td>{service?.actual_price}</td>
                        <td>
                          {service?.status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Pending
                            </span>
                          ) : service?.status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Approved
                            </span>
                          ) : service?.status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {service?.status === "pending" ? (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              <Tooltip
                                title="Approve"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    setOpenOfferApproveModal(true);
                                    setApprovalOfferReqData(service);
                                  }}
                                >
                                  <AddTaskIcon
                                    sx={{
                                      color: "green",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                              <Tooltip
                                title="Reject"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    confirm({
                                      description: `Are you sure you want to reject service ${service?.service_name}?`,
                                    })
                                      .then(() => {
                                        handleRejectService(service?.id);
                                      })
                                      .catch(() => { });
                                  }}
                                >
                                  <DeleteForeverIcon
                                    sx={{
                                      color: "red",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            </div>
                          ) : (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              -
                            </div>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      <GeneralModal open={openOfferApproveModal}
        handleClose={() => {
          setOpenOfferApproveModal(false);
          setApprovalOfferReqData({});
        }}
      >
        <OfferRequestApproveModal
          handleClose={() => {
            setOpenOfferApproveModal(false);
            setApprovalOfferReqData({});
          }}
          OfferData={approvalOfferReqData}
          refreshData={getOfferRequestData}
        />
      </GeneralModal>
    </>
  )
}

export default OfferServicesReqPage

const OfferRequestApproveModal = ({ OfferData, handleClose, refreshData }) => {
  const { authTokens } = useContext(AuthContext);
  const [offerPrice, setOfferPrice] = useState(OfferData?.actual_price);
  const [offerTime, setOfferTime] = useState({
    hours: OfferData?.offer_timing?.hours || 0,
    minutes: OfferData?.offer_timing?.minutes || 0,
    seating: OfferData?.offer_timing?.seating || 0,
  });
  const [handleOfferApproveLoading, setHandleOfferApproveLoading] = useState(false);
  const [approvalOfferReqData, setApprovalOfferReqData] = useState(OfferData);
  const [masterServiceImage, setMasterServiceImage] = useState(OfferData?.image);

  const editorRef = useRef(null);
  const editorRef2 = useRef(null);

  useEffect(() => {

    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }],
        ],
      },
    });

    editorRef2.current = new Quill("#editor2", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }],
        ],
      },
    });
    if (approvalOfferReqData?.from_masteroffer) {
      editorRef.current.root.innerHTML = approvalOfferReqData?.terms_and_conditions;
    }
    else {
      editorRef.current.root.innerHTML = approvalOfferReqData?.terms_and_conditions;
    }
  }, []);

  const handleOfferApprove = async () => {
    let url = `https://backendapi.trakky.in/salonvendor/approved-salon-profile-offer/${approvalOfferReqData?.id}/`;

    try {
      const formData = new FormData();

      formData.append("salon", approvalOfferReqData?.salon);
      formData.append("name", approvalOfferReqData?.name);
      formData.append("gender", approvalOfferReqData?.gender);
      formData.append("discounted_price", approvalOfferReqData?.discounted_price || "0");
      formData.append("actual_price", offerPrice);
      formData.append("image", masterServiceImage);
      formData.append("offer_timing",
        JSON.stringify({
          hours: offerTime.hours,
          minutes: offerTime.minutes,
          seating: offerTime.seating,
        })
      );
      formData.append("terms_and_conditions", editorRef.current.root.innerHTML);

      // let payload = {
      //   salon: approvalOfferReqData?.salon,
      //   name: approvalOfferReqData?.name,
      //   gender: approvalOfferReqData?.gender,
      //   discounted_price: approvalOfferReqData?.discounted_price|| "0",
      //   actual_price: offerPrice,
      //   image: masterServiceImage,
      //   offer_timing: offerTime,
      //   terms_and_conditions: editorRef.current.root.innerHTML,
      // };


      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Service approved successfully");
        refreshData();
        handleClose();
      }
    }
    catch (error) {
      console.error("Error approving service:", error);
      toast.error("Failed to approve service. Please try again later");
    }
    finally {
      setHandleOfferApproveLoading(false);
    }
  }

  return (
    <>

      <div className="p-2">
        <h3 className=" font-semibold text-center w-full h-8">
          Offer Approval form
        </h3>
        <hr className=" bg-black" />
        <div className=" p-2">
          <div className="">
            <span className=" font-semibold">Salon name : </span>{" "}
            {approvalOfferReqData?.salon_name},{" "}
            {approvalOfferReqData?.salon_area},{" "}
            {approvalOfferReqData?.salon_city}
          </div>
          {/* <div className="">
              <ul className=" list-disc pl-5 italic pt-1">
                <li>
                  Service belongs to master service , fill the below details to
                  approve the service
                </li>
              </ul>
            </div> */}
          <hr className=" bg-black my-4" />
          <div className=" grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div className=" w-full flex flex-col lg:col-span-3">
              <label className=" font-semibold">Offer name</label>
              <input
                type="text"
                value={approvalOfferReqData?.name}
                disabled
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-3">
              <label className=" font-semibold">Discount</label>
              <input
                type="text"
                value={approvalOfferReqData?.discounted_price}
                className=" bg-transparent"
                onChange={(e) => {
                  setApprovalOfferReqData({
                    ...approvalOfferReqData,
                    discounted_price: e.target.value,
                  });
                }}
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-3">
              <label className=" font-semibold">Gender</label>
              <input
                type="text"
                value={approvalOfferReqData?.gender}
                disabled
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-3">
              <label className=" font-semibold">Service price</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="Enter service price"
                className=" bg-transparent"
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-2">
              <label htmlFor="service-time-houurs">Hours</label>
              <input
                type="number"
                value={offerTime.hours}
                onChange={(e) =>
                  setOfferTime({
                    ...offerTime,
                    hours: e.target.value,
                  })
                }
                placeholder="Enter hours"
                className=" bg-transparent"
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-2">
              <label htmlFor="service-time-minutes">Minutes</label>
              <input
                type="number"
                value={offerTime.minutes}
                onChange={(e) =>
                  setOfferTime({
                    ...offerTime,
                    minutes: e.target.value,
                  })
                }
                placeholder="Enter minutes"
                className=" bg-transparent"
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-2">
              <label htmlFor="service-time-seating">Seating</label>
              <input
                type="number"
                value={offerTime.seating}
                onChange={(e) =>
                  setOfferTime({
                    ...offerTime,
                    seating: e.target.value,
                  })
                }
                placeholder="Enter seating"
                className=" bg-transparent"
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className=" w-full flex flex-col lg:col-span-3">
              <label className=" font-semibold">Offer image</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                accept="image/*"
                onChange={(e) => {
                  setMasterServiceImage(e.target.files[0]);
                }}
                style={{ width: "fit-content", cursor: "pointer" }}
              />
            </div>
            <div className="  w-full flex flex-col lg:col-span-6">
              <label htmlFor="content">Description</label>
              <div
                id="editor"
                style={{ width: "100%", height: "100px" }}
              ></div>
            </div>

            <div className=" w-full flex flex-col lg:col-span-6">
              <button
                className={`bg-green-500 text-white px-4 py-1 rounded-md ${handleOfferApproveLoading ? "opacity-50" : ""
                  }`}
                onClick={() => {
                  if (handleOfferApproveLoading) {
                    return;
                  }

                  handleOfferApprove();
                }}
              >
                {handleOfferApproveLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}