import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddOfferTags from "./Forms/AddOfferTags";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaInfo, FaInfoCircle } from "react-icons/fa";

import "./css/salonelist.css";
import AddMainSalonOffers from "./Forms/AddMainSalonOffers";
import GeneralModal from "./generalModal/GeneralModal";
import AddServiceDetails from "./Forms/AddServiceDetails";

const ListServiceDetails = () => {
  const [cityName, setCityName] = useState([]);
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");
  const [cityOnceSelected, setCityOnceSelected] = useState(false);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [filteredServiceDetails, setFilteredServiceDetails] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [faqModal, setFaqModal] = useState(false);
  const [faqModalData, setFaqModalData] = useState([]);
  const [stepModal, setStepModal] = useState(false);
  const [stepModalData, setStepModalData] = useState([]);
  const [overviewModal, setOverviewModal] = useState(false);
  const [overviewModalData, setOverviewModalData] = useState(null);
  const [descriptionImgModal, setDescriptionImgModal] = useState(false);
  const [descriptionImgModalData, setDescriptionImgModalData] = useState(null);

  useEffect(() => {
    if (updateFormOpened === null) {
      getServicesDetails(selectedCityName, selectedAreaName);
    }
  }, [updateFormOpened]);

  useEffect(() => {
    if (selectedCityName !== undefined && cityOnceSelected === true) {
      getServicesDetails(selectedCityName, selectedAreaName);
    }
  }, [selectedCityName, selectedAreaName]);

  function getAreaNames(cityName) {
    try {
      if (!cityPayloadData) {
        throw new Error("City payload data is not available.");
      }

      if (!cityName) {
        return cityPayloadData.flatMap((city) => city?.area_names || []);
      } else {
        const selectedCity = cityPayloadData.find(
          (city) => city.name === cityName
        );
        if (!selectedCity) {
          throw new Error(`City '${cityName}' not found in the payload data.`);
        }
        return selectedCity.area_names || [];
      }
    } catch (error) {
      console.error("Error in getAreaNames function:", error.message);
      return [];
    }
  }

  useEffect(() => {
    let selectedAreas = getAreaNames(selectedCityName);
    setAvailableAreaName(selectedAreas);
  }, [selectedCityName, cityPayloadData]);

  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    try {
      let url = "https://backendapi.trakky.in/salons/city/";

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        const payload = data?.payload || [];
        const cityNames = payload.map((item) => item.name);

        setCityPayloadData(payload);
        setCityName(cityNames);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching city data:", error.message);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  const getServicesDetails = async (city, area) => {
    setLoading(true);
    let url;
    if (city !== "" && area !== "") {
      url = `https://backendapi.trakky.in/salons/service-details/?city=${city}&area=${area}`;
    } else if (city !== "") {
      url = `https://backendapi.trakky.in/salons/service-details/?city=${city}`;
    } else {
      url = `https://backendapi.trakky.in/salons/service-details/`;
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setServiceDetails(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching offer:", error);
      toast.error("Failed to fetch service Details. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceDetail = async (serviceDetailId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service detail?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/service-details/${serviceDetailId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setServiceDetails(
          serviceDetails.filter((p) => p.id !== serviceDetailId)
        );
        toast.success("Service Details Deleted Successfully !!", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const tableHeaders = [
    "Name",
    "Salon type",
    "Service name",
    "Do's",
    "Dont's",
    "FAQ's",
    "Steps",
    "Overviews",
    "Description Img",
    "Key-ingrediants Img",
    "Things Salon Use",
    "Lux Experience Image",
    "Benefit Meta Info Img",
    "Aftercare Tips Img",
    "Main swiper Img",
    "Actions",
  ];

  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleCityFilter = (event) => {
    setSelectedAreaName("");
    setCityOnceSelected(true);
    setSelectedCityName(event.target.value);
  };

  const handleAreaFilter = (event) => {
    setSelectedAreaName(event.target.value);
  };

  const handleSearch = () => {
    const tempFiltered = serviceDetails.filter((serveD) => {
      switch (searchOption) {
        case "Search Salon":
          return serveD?.service_info?.salon_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search service":
          return serveD?.service_info?.service_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredServiceDetails(tempFiltered);
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-src-fil">
                <div className="tb-src-input">
                  <FormControl
                    FormControl
                    sx={{
                      margin: "8px 2px",
                      minWidth: 100,
                      width: "fit-content",
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedCityName}
                      label="Select City"
                      input={<OutlinedInput label="Tag" />}
                      onChange={handleCityFilter}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {cityName?.map((city, index) => (
                        <MenuItem key={index} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="tb-src-input">
                  <FormControl
                    FormControl
                    sx={{
                      margin: "8px 2px",
                      minWidth: 100,
                      width: "fit-content",
                    }}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">Area</InputLabel>
                    <Select
                      disabled={!selectedCityName}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedAreaName}
                      label="Select Area"
                      input={<OutlinedInput label="Tag" />}
                      onChange={handleAreaFilter}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {availableAreaName?.map((area, index) => (
                        <MenuItem key={index} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="tb-body-filter">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option value="Search Salon">Search Salon</option>
                  <option value="Search service">Search service</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    value={searchTerm}
                    placeholder="Search hear.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/add-service-details">
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
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="not-found">
                    <td colSpan={tableHeaders.length}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Loading
                      </div>
                    </td>
                  </tr>
                ) : searchTerm !== "" ? (
                  filteredServiceDetails.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={tableHeaders.length}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          No results found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredServiceDetails.map((serviD, index) => (
                      <>
                        <tr key={index}>
                          <td>
                            <div className=" min-w-max block w-full">
                              {serviD?.service_info?.salon_name} ({" "}
                              {serviD?.service_info?.salon_area} ) ({" "}
                              {serviD?.service_info?.salon_city} )
                            </div>
                          </td>
                          <td>{serviD?.service_info?.salon_type}</td>
                          <td>
                            <div className=" min-w-max block w-full">
                              {serviD?.service_info?.service_name}
                            </div>
                          </td>
                          <td>
                            <ul className="list-disc pl-8">
                              {serviD?.do_and_dont?.do?.map((item, index) => {
                                return (
                                  <li key={index} className=" min-w-max">
                                    {item}
                                  </li>
                                );
                              })}
                            </ul>
                          </td>
                          <td>
                            <ul className="list-disc pl-8">
                              {serviD?.do_and_dont?.["don't"]?.map(
                                (item, index) => {
                                  return (
                                    <li key={index} className=" min-w-max">
                                      {item}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </td>
                          <td
                            onClick={() => {
                              setFaqModal(true);
                              setFaqModalData(serviD?.faqs);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaInfoCircle />
                          </td>
                          <td
                            onClick={() => {
                              setStepModal(true);
                              setStepModalData(serviD?.steps);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaInfoCircle />
                          </td>
                          <td
                            onClick={() => {
                              setOverviewModal(true);
                              setOverviewModalData(serviD?.overview);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaInfoCircle />
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.description_image && (
                                <img
                                  src={serviD?.description_image}
                                  alt="description_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.key_ingredients && (
                                <img
                                  src={serviD?.key_ingredients}
                                  alt="key_ingrediants_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.things_salon_use && (
                                <img
                                  src={serviD?.things_salon_use}
                                  alt="things_salon_use_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.lux_exprience_image && (
                                <img
                                  src={serviD?.lux_exprience_image}
                                  alt="lux_experience_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.benefit_meta_info_image && (
                                <img
                                  src={serviD?.benefit_meta_info_image}
                                  alt="benefit_meta_info_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className=" w-20 h-20 rounded-md bg-gray-100">
                              {serviD?.aftercare_tips && (
                                <img
                                  src={serviD?.aftercare_tips}
                                  alt="aftercare_tips_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              )}
                            </div>
                          </td>
                          <td
                            onClick={() => {
                              setDescriptionImgModal(true)
                              setDescriptionImgModalData(serviD?.swiper_images)
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <FaInfoCircle />
                          </td>

                          <td>
                            <AiFillDelete
                              onClick={() => deleteServiceDetail(serviD.id)}
                              style={{ cursor: "pointer" }}
                            />
                            &nbsp;&nbsp;
                            <FaEdit
                              onClick={() => setUpdateFormOpened(index)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                sx={{
                                  margin: "8px 2px",
                                  minWidth: 100,
                                  width: "90vw",
                                }}
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddServiceDetails
                                  serviceDetailsData={serviD}
                                  setServiceDetails={(data) => {
                                    setServiceDetails(
                                      serviceDetails.map((off) =>
                                        off.id === data.id ? data : off
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                  refreshData={() => getServicesDetails(selectedCityName, selectedAreaName)}
                                  closeModal={() => setUpdateFormOpened(null)}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )
                ) : serviceDetails.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={tableHeaders.length}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No Entries
                      </div>
                    </td>
                  </tr>
                ) : (
                  serviceDetails.map((serviD, index) => (
                    <>
                      <tr key={index}>
                        <td>
                          <div className=" min-w-max block w-full">
                            {serviD?.service_info?.salon_name} ({" "}
                            {serviD?.service_info?.salon_area} ) ({" "}
                            {serviD?.service_info?.salon_city} )
                          </div>
                        </td>
                        <td>{serviD?.service_info?.salon_type}</td>
                        <td>
                          <div className=" min-w-max block w-full">
                            {serviD?.service_info?.service_name}
                          </div>
                        </td>
                        <td>
                          <ul className="list-disc pl-8">
                            {serviD?.do_and_dont?.do?.map((item, index) => {
                              return (
                                <li key={index} className=" min-w-max">
                                  {item}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                        <td>
                          <ul className="list-disc pl-8">
                            {serviD?.do_and_dont?.["don't"]?.map(
                              (item, index) => {
                                return (
                                  <li key={index} className=" min-w-max">
                                    {item}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </td>
                        <td
                          onClick={() => {
                            setFaqModal(true);
                            setFaqModalData(serviD?.faqs);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FaInfoCircle />
                        </td>
                        <td
                          onClick={() => {
                            setStepModal(true);
                            setStepModalData(serviD?.steps);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FaInfoCircle />
                        </td>
                        <td
                          onClick={() => {
                            setOverviewModal(true);
                            setOverviewModalData(serviD?.overview);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FaInfoCircle />
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.description_image && (
                              <img
                                src={serviD?.description_image}
                                alt="description_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.key_ingredients && (
                              <img
                                src={serviD?.key_ingredients}
                                alt="key_ingrediants_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.things_salon_use && (
                              <img
                                src={serviD?.things_salon_use}
                                alt="things_salon_use_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.lux_exprience_image && (
                              <img
                                src={serviD?.lux_exprience_image}
                                alt="lux_experience_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.benefit_meta_info_image && (
                              <img
                                src={serviD?.benefit_meta_info_image}
                                alt="benefit_meta_info_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className=" w-20 h-20 rounded-md bg-gray-100">
                            {serviD?.aftercare_tips && (
                              <img
                                src={serviD?.aftercare_tips}
                                alt="aftercare_tips_img"
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            setDescriptionImgModal(true)
                            setDescriptionImgModalData(serviD?.swiper_images)
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FaInfoCircle />
                        </td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteServiceDetail(serviD.id)}
                            style={{ cursor: "pointer" }}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setUpdateFormOpened(index)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0, width: "100%" }}>
                            <GeneralModal
                              open={updateFormOpened !== null}
                              handleClose={() => setUpdateFormOpened(null)}
                              sx={{
                              }}
                            >
                              <AddServiceDetails
                                serviceDetailsData={serviD}
                                setServiceDetails={(data) => {
                                  setServiceDetails(
                                    serviceDetails.map((off) =>
                                      off.id === data.id ? data : off
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                                refreshData={() => getServicesDetails(selectedCityName, selectedAreaName)}
                                closeModal={() => setUpdateFormOpened(null)}
                              />
                            </GeneralModal>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <GeneralModal open={faqModal} handleClose={() => setFaqModal(false)}>
          {/* faqs : [
    {
        "answer": "This is a beauty treatment.",
        "question": "What is this service?"
    }
] */}
          <div
            className="modal-body bg-white"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
            }}
          >
            <div className=" flex justify-between">
              <h2 className=" text-lg font-semibold pb-2 border-b">FAQ's</h2>
              <button onClick={() => setFaqModal(false)}>X</button>
            </div>
            <div className="modal-content">
              {faqModalData?.map((faq, index) => {
                return (
                  <div key={index} className=" pt-2">
                    <p>
                      <strong>Que {index + 1}. </strong> {faq.question}
                    </p>
                    <p>
                      <strong>Ans {index + 1}. </strong> {faq.answer}
                    </p>
                    <div className=" border-dashed border border-gray mt-2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </GeneralModal>

        <GeneralModal open={stepModal} handleClose={() => setStepModal(false)}>
          <div
            className="modal-body bg-white"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
            }}
          >
            {/* data.append("steps", JSON.stringify(steps.map((step) => ({
      step: step.step,
      instruction: step.instruction,
      image: step.image_url,
    })))); */}
            <div
              className="
            flex justify-between
            "
            >
              <h2 className=" text-lg font-semibold">Steps</h2>
              <button onClick={() => setStepModal(false)}>X</button>
            </div>
            <div className="modal-content">
              {stepModalData?.map((step, index) => {
                return (
                  <div key={index} className=" pt-2">
                    <p>
                      <strong>Step {step.step}. </strong>
                    </p>
                    <p>{step.instruction}</p>
                    <div className="mt-2">
                      {step.image && (
                        <img
                          src={step.image}
                          alt="step_img"
                          className="w-28 h-28 object-cover rounded-md"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GeneralModal>

        <GeneralModal
          open={overviewModal}
          handleClose={() => setOverviewModal(false)}
        >
          <div
            className="modal-body bg-white"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
            }}
          >
            <div className=" flex justify-between">
              <h2 className=" text-lg font-semibold">Overviews</h2>
              <button onClick={() => setOverviewModal(false)}>X</button>
            </div>
            <div className="modal-content">
              <p>Overviews</p>
            </div>
          </div>
        </GeneralModal>

        <GeneralModal
          open={descriptionImgModal}
          handleClose={() => setDescriptionImgModal(false)}
        >
          <div
            className="modal-body bg-white"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
            }}
          >
            <div
              className="
            flex justify-between
            "
            >
              <h2 className=" text-lg font-semibold">Description Swiper Img</h2>
              <button onClick={() => setDescriptionImgModal(false)}>X</button>
            </div>
            <div className="modal-content flex flex-wrap gap-2">
              {
                descriptionImgModalData?.map((img, index) => {
                  return (
                    <div key={index} className="mt-2">
                      <img
                        src={img.image}
                        alt="description_img"
                        className="w-28 h-28 object-cover rounded-md"
                      />
                    </div>
                  );
                })
              }
            </div>
          </div>
        </GeneralModal>
      </div>
    </>
  );
};

export default ListServiceDetails;
