import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import AsyncSelect from "react-select/async";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

import "./css/spaelist.css";
import { Link } from "react-router-dom";
import AddService from "./Forms/ServiceForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

const Services = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [servicesData, setservicesData] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({});

  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [selectedSpaId, setSelectedSpaId] = useState("");
  const [selectedSpas, setSelectedSpas] = useState([]);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");

  //pagination
  const [page, setPage] = useState(1);

  const servicesPerPage = 30;
  const totalPages = Math.ceil(serviceDetails?.count / servicesPerPage);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  useEffect(() => {
    if (selectedCity || selectedAreaName) {
      getServices(selectedAreaName, selectedCity, selectedSpaId, page);
    }
  }, [page, updateFormOpened]);

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/city/`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCityPayload(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (error) {
      console.error(error);
      toast.error(`Error : ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const loadSpas = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
            inputValue
          )}&city=${selectedCity}&area=${selectedAreaName}`
        );
        const data = await response.json();

        const options = data?.results?.map((spa) => ({
          value: spa.id,
          label: spa.name,
        }));

        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error);
        callback([]);
      }
    }
  };

  useEffect(() => {
    getCity();
  }, []);

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

  const getServices = async (
    selectedAreaName,
    selectedCity,
    selectedSpaId,
    pageCount
  ) => {
    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });
    if (pageCount === undefined) {
      pageCount = page;
    }
    console.log("page : ", page);
    console.log("pagec : ", pageCount);
    let url = `https://backendapi.trakky.in/spas/service/?page=${pageCount}`;

    if (selectedCity) {
      url += `&city=${selectedCity}`;
    }
    if (selectedAreaName) {
      url += `&area=${selectedAreaName}`;
    }
    if (selectedSpaId) {
      url += `&spa_id=${selectedSpaId}`;
    }

    try {
      const res = await fetch(url);

      toast.dismiss();

      if (res.status === 200) {
        const data = await res.json();
        setServiceDetails(data);
        setservicesData(data?.results);
      }
    } catch (error) {
      toast.dismiss();

      setservicesData([]);
      setServiceDetails({});

      console.error("Error fetching services:", error);
      toast.error(`Error : ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return [];
    }
  };

  useEffect(() => {
    if (selectedSpaId === "") {
      setservicesData([]);
      return;
    } else {
      getServices(selectedAreaName, selectedCity, selectedSpaId, page);
    }
  }, [selectedSpaId]);

  const deleteServices = async (id) => {
    try {
      await confirm({
        description: "The service will be deleted permanently",
      });

      let res = await fetch(`https://backendapi.trakky.in/spas/service/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer  ${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        toast.success("Service deleted successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "white",
            backgroundColor: "#333",
          },
        });
        getServices(selectedAreaName, selectedCity, selectedSpaId);
      } else if (res.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Failed to delete service ${res.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined) return;

      toast.error(`Failed to delete service ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    setSelectedSpaId("");
    setSelectedSpas("");

    if (selectedCity != "" || selectedAreaName != "") {
      getServices(selectedAreaName, selectedCity, "", page);
    }
  }, [selectedAreaName, selectedCity]);

  const tableHeaders = [
    "Sr No.",
    "Service Name",
    "Spa Name",
    "Price",
    "Time",
    "Discount",
    "City",
    "Area",
    "Description",
    "Image",
    "Action",
  ];

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
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
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
              <div className="input-box inp-salon  relative min-w-[200px] z-10 ">
                <AsyncSelect
                  defaultOptions
                  loadOptions={loadSpas}
                  value={selectedSpas}
                  onChange={(selectedSpas) => {
                    setSelectedSpas(selectedSpas);
                    setSelectedSpaId(selectedSpas.value);
                  }}
                  noOptionsMessage={() => "No spas found"}
                  isDisabled={selectedAreaName === ""}
                  placeholder="Search Spa..."
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
                {selectedCity?.length === 0 &&
                selectedAreaName?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={11}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Please select a City and an Area before searching for
                        Spas.
                      </div>
                    </td>
                  </tr>
                ) : servicesData?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={11}>
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
                        <td>{service.service_names || "-"}</td>
                        <td>{service.spa_name}</td>
                        <td>{service.price}</td>
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
                        <td>{service.discount}</td>
                        <td>{service.city || "-"}</td>
                        <td>{service.area || "-"}</td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          />
                        </td>
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
                          <td colSpan={11} style={{ padding: 0 }}>
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
                                  // setUpdateFormOpened(null);
                                  setTimeout(() => {
                                    setUpdateFormOpened(null);
                                  }, 1000);
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
            showing {servicesData.length} of {serviceDetails?.count} entries
          </div>
          {(selectedCity || selectedAreaName) && (
            <div className="tb-more-results">
              <div className="tb-pagination">
                <span id={parseInt(1)} onClick={handlePageChange}>
                  «
                </span>
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
                {
                  <span id={parseInt(totalPages)} onClick={handlePageChange}>
                    »
                  </span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
