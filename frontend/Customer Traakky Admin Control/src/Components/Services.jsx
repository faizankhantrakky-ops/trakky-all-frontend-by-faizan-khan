import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import AsyncSelect from "react-select/async";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { formatDate } from "./DateRange/formatDate";
import "./css/salonelist.css";
import { Link } from "react-router-dom";
import AddService from "./Forms/ServiceForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { IoMdInformationCircleOutline } from "react-icons/io";
import InfoIcon from "@mui/icons-material/Info";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import DateRange from "./DateRange/DateRange";
import GeneralModal from "./generalModal/GeneralModal";

const Services = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [servicesData, setservicesData] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");
  const [hovered, setHovered] = useState(false);

  const [dateFilter, setDateFilter] = useState(true);

  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      {
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      },
    ];
  } else {
    initialDateState = [
      {
        startDate: dateState2[0].startDate,
        endDate: dateState2[0].endDate,
        key: "selection",
      },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  // Pagination
  const [page, setPage] = useState(1);
  const servicesPerPage = 30;
  const totalPages = Math.ceil(serviceDetails?.count / servicesPerPage);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  // Sort servicesData by priority in ascending order
  // const sortServicesByPriority = (data) => {
  //   return data.sort((a, b) => {
  //     const priorityA = a.master_service_data?.priority || Infinity; // Default to Infinity if priority is missing
  //     const priorityB = b.master_service_data?.priority || Infinity; // Default to Infinity if priority is missing
  //     return priorityA - priorityB; // Ascending order
  //   });
  // };

  useEffect(() => {
    if (dateFilter) {
      getDatedServices();
    } else if (selectedCity || selectedAreaName) {
      getServices(
        selectedAreaName,
        selectedCity,
        selectedSalonId,
        selectedCategory,
        page
      );
    }
  }, [page]);

  useEffect(() => {
    setservicesData([]);
    setServiceDetails({});
    setSelectedCity("");
    setSelectedAreaName("");
    setSelectedCategory("");
    setSelectedSalons([]);
    setSelectSalonId("");
    setPage(1);
    setDateState(initialDateState);
  }, [dateFilter]);

  const loadSalons = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
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

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    if (selectedSalons.length === 0) {
      setservicesData([]);
      return;
    } else {
      getServices(
        selectedAreaName,
        selectedCity,
        selectedSalonId,
        selectedCategory,
        page
      );
    }
  }, [selectedSalons, selectedCategory]);

  useEffect(() => {
    setSelectedSalons("");
    setSelectedCategory("");

    if ((selectedCity != "" || selectedAreaName != "") && page === 1) {
      getServices(selectedAreaName, selectedCity, "", "", page);
    } else {
      setPage(1);
    }
  }, [selectedAreaName, selectedCity]);

  const sortServicesByPriority = (data) => {
    if (!Array.isArray(data)) return []; // Return empty array if data is not an array

    return data?.sort((a, b) => {
      const categoryPriorityA = a.master_service_data?.category?.priority || Infinity;
      const categoryPriorityB = b.master_service_data?.category?.priority || Infinity;

      const priorityA = a.master_service_data?.priority || Infinity;
      const priorityB = b.master_service_data?.priority || Infinity;

      if (categoryPriorityA !== categoryPriorityB) {
        return categoryPriorityA - categoryPriorityB;
      }

      return priorityA - priorityB;
    });
  };

  const getServices = async (
    selectedAreaName,
    selectedCity,
    salonId,
    selectedCategory,
    pageCount
  ) => {
    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });

    let url = `https://backendapi.trakky.in/salons/service/?page=${pageCount || page}`;

    if (selectedCity) {
      url += `&city=${selectedCity}`;
    }
    if (selectedAreaName) {
      url += `&area=${selectedAreaName}`;
    }
    if (salonId) {
      url += `&salon_id=${salonId}`;
    }
    if (selectedCategory) {
      url += `&category_id=${selectedCategory}`;
    }

    try {
      const response = await fetch(url);

      toast.dismiss();

      if (response.status === 200) {
        const data = await response.json();
        // console.log("data", data);

        // Ensure data.results exists before sorting
        const results = data || [];
        // console.log("result", data);
        // Sort the data by category priority and then by service priority
        const sortedData = sortServicesByPriority(results);
        // console.log("sorteddata", sortedData);
        setservicesData(sortedData);
        setServiceDetails(data);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
        setservicesData([]);
        setServiceDetails({});
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching services:", error);
      setservicesData([]);
      setServiceDetails({});
      return [];
    }
  };

  useEffect(() => {
    getDatedServices();
  }, [dateState]);

  const getDatedServices = async () => {
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });

    let url = `https://backendapi.trakky.in/salons/service/?end_date=${formattedEndDate}&page=${page}&start_date=${formattedStartDate}`;

    try {
      const response = await fetch(url);

      toast.dismiss();

      if (response.status === 200) {
        const data = await response.json();

        // Ensure data.results exists before sorting
        const results = data || [];

        // Sort the data by category priority and then by service priority
        const sortedData = sortServicesByPriority(results);
        setservicesData(sortedData);
        setServiceDetails(data);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
        setservicesData([]);
        setServiceDetails({});
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error fetching services:", error);
      setservicesData([]);
      setServiceDetails({});
      return [];
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

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCity);
    setSelectedAreaName("");
    setAvailableAreaName(selectedAreas);
  }, [selectedCity, cityPayload]);

  const getCategories = async (selectedSalonId) => {
    const requestOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/category/?salon_id=${selectedSalonId}`,
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again later.");
    }
  };

  useEffect(() => {
    if (selectedSalonId !== "") {
      getCategories(selectedSalonId);
    }
  }, [selectedSalons, selectedSalonId]);

  const deleteServices = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this service?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/service/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Service Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        if (dateFilter) {
          getDatedServices();
        } else {
          getServices(
            selectedAreaName,
            selectedCity,
            selectedSalonId,
            selectedCategory,
            page
          );
        }
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong : ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
      }
    } catch (error) {
      if (error == undefined || error === "cancel") return;
      toast.error(`Something went wrong : ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleDateFilterChange = () => {
    // Toggle the state of dateFilter
    setDateFilter(!dateFilter);
  };

  const tableHeaders = [
    "Index",
    "category priority",
    "Master Service priority",
    "Service Name",
    "Service Image",
    "gender",
    "Category",
    "Salon Name",
    "Price",
    "Discount Price",
    "Time",
    "Description",
    "city",
    "Area",
    "Action",
  ];

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        {hovered && dateFilter && (
          <div className="custom-dialog-box">
            <InfoIcon style={{ margin: "auto", height: "18px" }} />
            <p>Disable Date Filter to Select City.</p>
          </div>
        )}
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
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    disabled={dateFilter}
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
                  disabled={!selectedCity}
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
                  isDisabled={selectedAreaName === ""}
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

              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl
                  sx={{ margin: "8px 0", width: 110 }}
                  size="small"
                  disabled={selectedSalons.length === 0}
                >
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCategory}
                    label="Area"
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categoryList?.map((category, index) => (
                      <MenuItem value={category.id} key={index}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addservice">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p style={{ paddingLeft: "20px" }}>
              Date Filter :
              <Switch
                checked={dateFilter}
                inputProps={{ "aria-label": "controlled" }}
                onClick={handleDateFilterChange}
              />{" "}
            </p>
            {dateFilter ? (
              <div
                className="custom-main-date-range "
                style={{ width: "fit-content", marginLeft: "10px" }}
              >
                <div
                  className="custom-Date-Range-Button"
                  onClick={() => {
                    setShowDateSelectionModal(true);
                  }}
                >
                  <input
                    type="text"
                    value={`${dateState[0].startDate.getDate()}-${dateState[0].startDate.getMonth() + 1
                      }-${dateState[0].startDate.getFullYear()}`}
                    style={{
                      width: "80px",
                      cursor: "auto",
                      border: "transparent",
                      paddingLeft: "10px",
                    }}
                    readOnly
                    disabled={!dateFilter}
                  />
                  <span style={{ paddingRight: "5px" }}> ~ </span>
                  <input
                    type="text"
                    value={`${dateState[0]?.endDate?.getDate()}-${dateState[0]?.endDate?.getMonth() + 1
                      }-${dateState[0]?.endDate?.getFullYear()}`}
                    style={{
                      width: "80px",
                      cursor: "auto",
                      border: "transparent",
                    }}
                    readOnly
                    disabled={!dateFilter}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
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
                {dateFilter ? (
                  servicesData.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={10}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          No entries for selected date.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    servicesData?.map((service, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                          <td>{service.master_service_data?.category.priority}</td>
                          <td>{service.master_service_data?.priority}</td>
                          <td>{service.service_name}</td>
                          <td>
                            {service?.service_image ? (
                              <img
                                src={service.service_image}
                                alt="category"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  borderRadius: "5px",
                                  objectFit: "contain",
                                  margin: "0 auto",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td>{service.gender || "-"}</td>
                          <td>{service.category_data?.category_name || "-"}</td>
                          <td>{service.salon_name}</td>
                          <td>{service.price}</td>
                          <td>{service.discount}</td>
                          <td
                            style={{
                              textAlign: "left",
                            }}
                          >
                            hours : {service.service_time.hours} <br />
                            minutes : {service.service_time.minutes} <br />
                            Seating : {service.service_time.seating} <br />
                            days : {service.service_time.days} <br />
                          </td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: service.description,
                              }}
                            />
                          </td>
                          <td>{service.city || "-"}</td>
                          <td>{service.area || "-"}</td>

                          <td>
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteServices(service.id)}
                            />
                            &nbsp;&nbsp;
                            <FaEdit
                              onClick={() => setUpdateFormOpened(index)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr key={`modal-${index}`}>
                            <td colSpan={10} style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddService
                                  serviceData={service}
                                  setServiceData={(data) => {
                                    setservicesData((prevServices) =>
                                      prevServices.map((prevService) =>
                                        prevService.id === data.id
                                          ? data
                                          : prevService
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )
                ) : selectedCity?.length === 0 &&
                  selectedAreaName?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={10}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Please select a City and an Area before searching for
                        Salons.
                      </div>
                    </td>
                  </tr>
                ) : servicesData?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={10}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Not Found
                      </div>
                    </td>
                  </tr>
                ) : (
                  servicesData?.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>{service.master_service_data?.category.priority}</td>
                        <td>{service.master_service_data?.priority}</td>
                        <td>{service.service_name}</td>
                        <td>
                          {service?.service_image ? (
                            <img
                              src={service.service_image}
                              alt="category"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "5px",
                                objectFit: "contain",
                                margin: "0 auto",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{service.gender || "-"}</td>
                        <td>{service.category_data?.category_name || "-"}</td>
                        <td>{service.salon_name}</td>
                        <td>{service.price}</td>
                        <td>{service.discount}</td>
                        <td
                          style={{
                            textAlign: "left",
                          }}
                        >
                          hours : {service.service_time.hours} <br />
                          minutes : {service.service_time.minutes} <br />
                          Seating : {service.service_time.seating} <br />
                          days : {service.service_time.days} <br />
                        </td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          />
                        </td>
                        <td>{service.city || "-"}</td>
                        <td>{service.area || "-"}</td>

                        <td>
                          <AiFillDelete
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteServices(service.id)}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setUpdateFormOpened(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr key={`modal-${index}`}>
                          <td colSpan={10} style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddService
                                serviceData={service}
                                setServiceData={(data) => {
                                  setservicesData((prevServices) =>
                                    prevServices.map((prevService) =>
                                      prevService.id === data.id
                                        ? data
                                        : prevService
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            Showing {servicesData?.length} of {serviceDetails?.count} entries
          </div>
          {(selectedCity || selectedAreaName || servicesData.length !== 0) && (
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
        open={showDateSelectionModal}
        handleClose={() => setShowDateSelectionModal(false)}
      >
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          setShowDateSelectionModal={setShowDateSelectionModal}
        />
      </GeneralModal>
    </>
  );
};

export default Services;