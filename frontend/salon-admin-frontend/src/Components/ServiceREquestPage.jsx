import React, { useState, useEffect, useContext, useRef } from "react";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";
import "./css/salonelist.css";
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

const ServiceRequestPage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");

  const [serviceDataLoading, setServiceDataLoading] = useState(false);

  const [servicerequestData, setServiceRequestData] = useState([]);

  //

  const [openServiceApproveModal, setOpenServiceApproveModal] = useState(false);
  const [approvalServiceData, setApprovalServiceData] = useState({});

  //pagination
  const [page, setPage] = useState(1);

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

  const getServiceRequestData = async () => {
    setServiceDataLoading(true);

    let url = "https://backendapi.trakky.in/salonvendor/service-request-admin/";

    // if (selectedCity && selectedAreaName && selectedSalonId) {
    //     url += `?city=${selectedCity}&area=${selectedAreaName}&salon_id=${selectedSalonId}`;
    // } else if (selectedCity && selectedAreaName) {
    //     url += `?city=${selectedCity}&area=${selectedAreaName}`;
    // } else if (selectedCity) {
    //     url += `?city=${selectedCity}`;
    // }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setServiceRequestData(data);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch service request data. Please try again later."
      );
    } finally {
      setServiceDataLoading(false);
    }
  };

  useEffect(() => {
    getServiceRequestData();
    getCity();
  }, []);

  useEffect(() => {
    setSelectedSalons("");

    if ((selectedCity != "" || selectedAreaName != "") && page === 1) {
    } else {
      setPage(1);
    }
  }, [selectedAreaName, selectedCity]);

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCity);
    setSelectedAreaName("");
    setAvailableAreaName(selectedAreas);
  }, [selectedCity, cityPayload]);

  const tableHeaders = [
    "Index",
    "Salon name",
    "Salon area,city",
    "Service name",
    "Category name",
    "Gender",
    "From master service",
    "Master service name",
    "Service time",
    "description",
    "Price",
    "Status",
    "Action",
  ];

  const handleRejectService = async (id) => {
    try {
      let url = `https://backendapi.trakky.in/salonvendor/service-request-admin/${id}/`;

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
        getServiceRequestData();
      } else {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        toast.error("Failed to reject category. Please try again later");
      }
    } catch (error) {
      console.error("Error rejecting category:", error);
      toast.error("Failed to reject category. Please try again later");
    }
  };

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
                {serviceDataLoading ? (
                  <tr>
                    <td colSpan={13} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : servicerequestData?.length === 0 ? (
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
                  servicerequestData?.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>{service?.salon_name}</td>
                        <td>
                          {service?.salon_area + ", " + service?.salon_city}
                        </td>
                        <td>{service?.service_name}</td>
                        <td>{service?.category_id}</td>
                        <td>{service?.gender}</td>
                        <td>{service?.from_masterservice ? "Yes" : "No"}</td>
                        <td>{service?.master_service_name ?? "-"}</td>
                        <td>
                          hours : {service?.service_time?.hours}
                          <br />
                          minutes : {service?.service_time?.minutes}
                          seating : {service?.service_time?.seating}
                        </td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: service?.description,
                            }}
                          />
                        </td>
                        <td>{service?.price}</td>
                        <td>
                          {service?.service_status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Pending
                            </span>
                          ) : service?.service_status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Approved
                            </span>
                          ) : service?.service_status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {service?.service_status === "pending" ? (
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
                                    setOpenServiceApproveModal(true);
                                    setApprovalServiceData(service);
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
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            Showing {servicerequestData?.length} of {servicerequestData?.length}{" "}
            entries
          </div>
          {(selectedCity ||
            selectedAreaName ||
            servicerequestData.length !== 0) && (
              <div className="tb-more-results">
                <div className="tb-pagination">
                  <span id={parseInt(1)} onClick={handlePageChange}>
                    ««
                  </span>
                  {page > 1 && (
                    <span id={parseInt(page - 1)} onClick={handlePageChange}>
                      «
                    </span>
                  )}
                  {page > 2 && (
                    <span id={parseInt(page - 2)} onClick={handlePageChange}>
                      {page - 2}
                    </span>
                  )}
                  {page > 1 && (
                    <span id={parseInt(page - 1)} onClick={handlePageChange}>
                      {page - 1}
                    </span>
                  )}
                  <span
                    id={parseInt(page)}
                    onClick={handlePageChange}
                    className="active"
                  >
                    {page}
                  </span>
                  {page < totalPages && (
                    <span id={parseInt(page + 1)} onClick={handlePageChange}>
                      {page + 1}
                    </span>
                  )}
                  {page < totalPages - 1 && (
                    <span id={parseInt(page + 2)} onClick={handlePageChange}>
                      {page + 2}
                    </span>
                  )}
                  {page < totalPages && (
                    <span id={parseInt(page + 1)} onClick={handlePageChange}>
                      »
                    </span>
                  )}
                  <span id={parseInt(totalPages)} onClick={handlePageChange}>
                    »»
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
      <GeneralModal
        open={openServiceApproveModal}
        handleClose={() => {
          setOpenServiceApproveModal(false);
          setApprovalServiceData({});
        }}
      >
        <ServiceRequestApproveModal
          closeModal={() => {
            setOpenServiceApproveModal(false);
            setApprovalServiceData({});
          }}
          serviceData={approvalServiceData}
        />
      </GeneralModal>
    </>
  );
};

export default ServiceRequestPage;

const ServiceRequestApproveModal = ({ serviceData, closeModal }) => {
  const { authTokens } = useContext(AuthContext);

  const [handleServiceApproveLoading, setHandleServiceApproveLoading] =
    useState(false);
  const [serviceApprovePrice, setServiceApprovePrice] = useState(
    serviceData?.price
  );
  const [serviceApproveTime, setServiceApproveTime] = useState({
    hours: serviceData?.service_time?.hours,
    minutes: serviceData?.service_time?.minutes,
    seating: serviceData?.service_time?.seating,
  });
  const [approvalServiceData, setApprovalServiceData] = useState(serviceData);
  const [masterServiceImage, setMasterServiceImage] = useState(null);

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

    // if (approvalServiceData?.description) {
    //   editorRef.current.root.innerHTML = approvalServiceData?.description;
    //   editorRef2.current.root.innerHTML = approvalServiceData?.description;
    // }
    if (approvalServiceData?.from_masterservice) {
      editorRef.current.root.innerHTML = approvalServiceData?.description;
    } else {
      editorRef.current.root.innerHTML = approvalServiceData?.description;
      editorRef2.current.root.innerHTML = approvalServiceData?.description;
    }
  }, []);

  const handleServiceApprove = async () => {
    setHandleServiceApproveLoading(true);

    let url = `https://backendapi.trakky.in/salonvendor/create-service/`;

    // gender
    // service_name
    // master_service_description
    // service_description
    // image
    // salon_id
    // price
    // category_id
    // master_service_id
    // from_masterservice

    try {
      const formData = new FormData();

      formData.append("gender", approvalServiceData?.gender);
      formData.append("service_name", approvalServiceData?.service_name);
      formData.append("service_description", editorRef.current.root.innerHTML);
      formData.append("salon_id", approvalServiceData?.salon);
      formData.append("price", serviceApprovePrice);
      formData.append("category_id", approvalServiceData?.category_id);
      formData.append("master_service_id", approvalServiceData?.master_service);
      formData.append("from_masterservice", true);
      formData.append("service_time", JSON.stringify(serviceApproveTime));

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Service approved successfully");
        // getServiceRequestData();
        // setOpenServiceApproveModal(false);
        // setApprovalServiceData({});

        closeModal();
      }
    } catch (error) {
      console.error("Error approving service:", error);
      toast.error("Failed to approve service. Please try again later");
    } finally {
      setHandleServiceApproveLoading(false);
    }
  };

  const handleServiceAndMasterServiceApprove = async () => {
    setHandleServiceApproveLoading(true);

    try {
      let url = `https://backendapi.trakky.in/salonvendor/create-service/`;

      const formData = new FormData();

      // gender
      // service_name
      // master_service_description
      // service_description
      // image
      // salon_id
      // price
      // category_id
      // master_service_id
      // from_masterservice

      formData.append("gender", approvalServiceData?.gender);
      formData.append("service_name", approvalServiceData?.service_name);
      formData.append(
        "master_service_description",
        editorRef2.current.root.innerHTML
      );
      formData.append("service_description", editorRef.current.root.innerHTML);
      formData.append("image", masterServiceImage);
      formData.append("salon_id", approvalServiceData?.salon);
      formData.append("price", serviceApprovePrice);
      formData.append("category_id", approvalServiceData?.category_id);
      formData.append("from_masterservice", false);
      formData.append("service_time", JSON.stringify(serviceApproveTime));

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Service approved successfully");
        // getServiceRequestData();
        // setOpenServiceApproveModal(false);
        // setApprovalServiceData({});
        closeModal();
      } else {
        toast.error("Failed to approve service. Please try again later");
      }
    } catch (error) {
      console.error("Error approving service:", error);
      toast.error("Failed to approve service. Please try again later");
    } finally {
      setHandleServiceApproveLoading(false);
    }
  };

  return (
    <div className="">
      {approvalServiceData?.from_masterservice ? (
        <div className="p-2">
          <h3 className=" font-semibold text-center w-full h-8">
            Service Approval form
          </h3>
          <hr className=" bg-black" />
          <div className=" p-2">
            <div className="">
              <span className=" font-semibold">Salon name : </span>{" "}
              {approvalServiceData?.salon_name},{" "}
              {approvalServiceData?.salon_area},{" "}
              {approvalServiceData?.salon_city}
            </div>
            <div className="">
              <ul className=" list-disc pl-5 italic pt-1">
                <li>
                  Service belongs to master service , fill the below details to
                  approve the service
                </li>
              </ul>
            </div>
            <hr className=" bg-black my-4" />
            <div className=" grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Service name</label>
                <input
                  type="text"
                  value={approvalServiceData?.service_name}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Category name</label>
                <input
                  type="text"
                  value={approvalServiceData?.category_id}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Gender</label>
                <input
                  type="text"
                  value={approvalServiceData?.gender}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Service price</label>
                <input
                  type="number"
                  value={serviceApprovePrice}
                  onChange={(e) => setServiceApprovePrice(e.target.value)}
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
                  value={serviceApproveTime.hours}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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
                  value={serviceApproveTime.minutes}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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
                  value={serviceApproveTime.seating}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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

              <div className="  w-full flex flex-col lg:col-span-6">
                <label htmlFor="content">Description</label>
                <div
                  id="editor"
                  style={{ width: "100%", height: "100px" }}
                ></div>
              </div>

              <div className=" w-full flex flex-col lg:col-span-6">
                <button
                  className={`bg-green-500 text-white px-4 py-1 rounded-md ${handleServiceApproveLoading ? "opacity-50" : ""
                    }`}
                  onClick={() => {
                    if (handleServiceApproveLoading) {
                      return;
                    }

                    handleServiceApprove();
                  }}
                >
                  {handleServiceApproveLoading ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <h3 className=" font-semibold text-center w-full h-8">
            Service And Master Service Approval form
          </h3>
          <hr className=" bg-black" />
          <div className=" p-2">
            <div className="">
              <span className=" font-semibold">Salon name : </span>{" "}
              {approvalServiceData?.salon_name},{" "}
              {approvalServiceData?.salon_area},{" "}
              {approvalServiceData?.salon_city}
            </div>
            <div className="">
              <ul className=" list-disc pl-5 italic pt-1">
                <li>
                  Service doesn't belongs to master service , fill the below
                  details to approve the service & create master service
                </li>
              </ul>
            </div>
            <hr className=" bg-black my-4" />
            <div className=" grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className=" w-full flex lg:col-span-6">
                <span className=" font-semibold underline underline-offset-8">
                  Form to create master service :
                </span>
              </div>

              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Master service name</label>
                <input
                  type="text"
                  value={approvalServiceData?.service_name}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Category name</label>
                <input
                  type="text"
                  value={approvalServiceData?.category_id}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Master service gender</label>
                <input
                  type="text"
                  value={approvalServiceData?.gender}
                  disabled
                />
              </div>
              <div className=" w-full flex flex-col lg:col-span-3">
                <label className=" font-semibold">Master service image</label>
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
                <label htmlFor="content">Master Service Description</label>
                <div
                  id="editor2"
                  style={{ width: "100%", height: "100px" }}
                ></div>
              </div>
              <div className=" w-full flex lg:col-span-6 mt-3">
                <span className=" font-semibold underline underline-offset-8">
                  Form to create service :
                </span>
              </div>
              <div className=" w-full flex flex-col lg:col-span-2">
                <label htmlFor="service-time-houurs">Hours</label>
                <input
                  type="number"
                  value={serviceApproveTime.hours}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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
                  value={serviceApproveTime.minutes}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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
                  value={serviceApproveTime.seating}
                  onChange={(e) =>
                    setServiceApproveTime({
                      ...serviceApproveTime,
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

              <div className="  w-full flex flex-col lg:col-span-6">
                <label htmlFor="content">Description</label>
                <div
                  id="editor"
                  style={{ width: "100%", height: "100px" }}
                ></div>
              </div>

              <div className=" w-full flex flex-col lg:col-span-6">
                <label htmlFor="price">Service price</label>
                <input
                  type="number"
                  value={serviceApprovePrice}
                  onChange={(e) => setServiceApprovePrice(e.target.value)}
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

              <div className=" w-full flex flex-col lg:col-span-6">
                <button
                  className={`bg-green-500 text-white px-4 py-1 rounded-md ${handleServiceApproveLoading ? "opacity-50" : ""
                    }`}
                  onClick={() => {
                    if (handleServiceApproveLoading) {
                      return;
                    }

                    handleServiceAndMasterServiceApprove();
                  }}
                >
                  {handleServiceApproveLoading ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
