import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

import "./css/salonelist.css";
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
  const [searchOption, setSearchOption] = useState("Search Salon");

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
      const salonName = serveD?.salons_with_service?.[0]?.salon_name || "";
      const serviceName = serveD?.master_service_info?.service_name || "";

      switch (searchOption) {
        case "Search Salon":
          return salonName.toLowerCase().includes(searchTerm.toLowerCase());
        case "Search service":
          return serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredServiceDetails(tempFiltered);
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 p-3 font-sans antialiased">
        <Toaster position="top-center" />
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header + Filters & Search */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 lg:mb-0">
                  Service Details Management
                </h2>
                <Link
                  to="/add-service-details"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <AddIcon className="mr-2 -ml-1 h-4 w-4" />
                  Add Item
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* City Filter */}
                <div className="w-full sm:w-48">
                  <FormControl
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
                      className="h-11"
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

                {/* Area Filter */}
                <div className="w-full sm:w-48">
                  <FormControl
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
                      className="h-11"
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

                {/* Search Option */}
                <div className="w-full sm:w-48">
                  <select
                    value={searchOption}
                    onChange={(e) => setSearchOption(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="Search Salon">Search Salon</option>
                    <option value="Search service">Search service</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="search-inp"
                      value={searchTerm}
                      placeholder="Search here..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px] table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, index) => (
                      <th key={index} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-4 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                          <p className="text-sm font-medium">Loading service details...</p>
                        </div>
                      </td>
                    </tr>
                  ) : searchTerm !== "" ? (
                    filteredServiceDetails.length === 0 ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="px-4 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                            <p className="text-base font-medium">No results found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredServiceDetails.map((serviD, index) => (
                        <>
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div className="min-w-max block w-full">
                                {serviD?.salons_with_service?.[0]?.salon_name || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{serviD?.salons_with_service?.[0]?.salon_type || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              <div className="min-w-max block w-full">
                                {serviD?.master_service_info?.service_name || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                              <ul className="list-disc pl-4 space-y-1 max-h-16 overflow-y-auto">
                                {serviD?.do_and_dont?.do?.map((item, idx) => (
                                  <li key={idx} className="min-w-max text-xs">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                              <ul className="list-disc pl-4 space-y-1 max-h-16 overflow-y-auto">
                                {serviD?.do_and_dont?.["don't"]?.map((item, idx) => (
                                  <li key={idx} className="min-w-max text-xs">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setFaqModal(true);
                                  setFaqModalData(serviD?.faqs || []);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <FaInfoCircle className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setStepModal(true);
                                  setStepModalData(serviD?.steps || []);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <FaInfoCircle className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setOverviewModal(true);
                                  setOverviewModalData(serviD?.overview_details || []);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <FaInfoCircle className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.description_image ? (
                                  <img
                                    src={serviD.description_image}
                                    alt="description_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.key_ingredients ? (
                                  <img
                                    src={serviD.key_ingredients}
                                    alt="key_ingrediants_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.things_salon_use ? (
                                  <img
                                    src={serviD.things_salon_use}
                                    alt="things_salon_use_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.lux_exprience_image ? (
                                  <img
                                    src={serviD.lux_exprience_image}
                                    alt="lux_experience_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.benefit_meta_info_image ? (
                                  <img
                                    src={serviD.benefit_meta_info_image}
                                    alt="benefit_meta_info_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                                {serviD?.aftercare_tips ? (
                                  <img
                                    src={serviD.aftercare_tips}
                                    alt="aftercare_tips_img"
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-400">N/A</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setDescriptionImgModal(true);
                                  setDescriptionImgModalData(serviD?.swiper_images || []);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <FaInfoCircle className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => deleteServiceDetail(serviD.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                                  style={{ cursor: "pointer" }}
                                >
                                  <AiFillDelete className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setUpdateFormOpened(index)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                  style={{ cursor: "pointer" }}
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {updateFormOpened === index && (
                            <tr>
                              <td colSpan={tableHeaders.length} style={{ padding: 0 }}>
                                <GeneralModal
                                  open={updateFormOpened !== null}
                                  handleClose={() => setUpdateFormOpened(null)}
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
                    )
                  ) : serviceDetails.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-4 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">No Entries</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    serviceDetails.map((serviD, index) => (
                      <>
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="min-w-max block w-full">
                              {serviD?.salons_with_service?.[0]?.salon_name || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{serviD?.salons_with_service?.[0]?.salon_type || "N/A"}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="min-w-max block w-full">
                              {serviD?.master_service_info?.service_name || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                            <ul className="list-disc pl-4 space-y-1 max-h-16 overflow-y-auto">
                              {serviD?.do_and_dont?.do?.map((item, idx) => (
                                <li key={idx} className="min-w-max text-xs">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                            <ul className="list-disc pl-4 space-y-1 max-h-16 overflow-y-auto">
                              {serviD?.do_and_dont?.["don't"]?.map((item, idx) => (
                                <li key={idx} className="min-w-max text-xs">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setFaqModal(true);
                                setFaqModalData(serviD?.faqs || []);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                              style={{ cursor: "pointer" }}
                            >
                              <FaInfoCircle className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setStepModal(true);
                                setStepModalData(serviD?.steps || []);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                              style={{ cursor: "pointer" }}
                            >
                              <FaInfoCircle className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setOverviewModal(true);
                                setOverviewModalData(serviD?.overview_details || []);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                              style={{ cursor: "pointer" }}
                            >
                              <FaInfoCircle className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.description_image ? (
                                <img
                                  src={serviD.description_image}
                                  alt="description_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.key_ingredients ? (
                                <img
                                  src={serviD.key_ingredients}
                                  alt="key_ingrediants_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.things_salon_use ? (
                                <img
                                  src={serviD.things_salon_use}
                                  alt="things_salon_use_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.lux_exprience_image ? (
                                <img
                                  src={serviD.lux_exprience_image}
                                  alt="lux_experience_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.benefit_meta_info_image ? (
                                <img
                                  src={serviD.benefit_meta_info_image}
                                  alt="benefit_meta_info_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                              {serviD?.aftercare_tips ? (
                                <img
                                  src={serviD.aftercare_tips}
                                  alt="aftercare_tips_img"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setDescriptionImgModal(true);
                                setDescriptionImgModalData(serviD?.swiper_images || []);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                              style={{ cursor: "pointer" }}
                            >
                              <FaInfoCircle className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => deleteServiceDetail(serviD.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <AiFillDelete className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setUpdateFormOpened(index)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                style={{ cursor: "pointer" }}
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={tableHeaders.length} style={{ padding: 0 }}>
                              <GeneralModal
                                open={updateFormOpened !== null}
                                handleClose={() => setUpdateFormOpened(null)}
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

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Service Details: <strong>{serviceDetails.length}</strong>
                {searchTerm && <> | Matches: <strong>{filteredServiceDetails.length}</strong></>}
              </p>
            </div>
          </div>
        </div>

        <GeneralModal open={faqModal} handleClose={() => setFaqModal(false)}>
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
              {faqModalData?.map((faq, index) => (
                <div key={index} className=" pt-2">
                  <p>
                    <strong>Que {index + 1}. </strong> {faq.question}
                  </p>
                  <p>
                    <strong>Ans {index + 1}. </strong> {faq.answer}
                  </p>
                  <div className=" border-dashed border border-gray mt-2"></div>
                </div>
              ))}
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
            <div className="flex justify-between">
              <h2 className=" text-lg font-semibold">Steps</h2>
              <button onClick={() => setStepModal(false)}>X</button>
            </div>
            <div className="modal-content">
              {stepModalData?.map((step, index) => (
                <div key={index} className=" pt-2">
                  <p>
                    <strong>Step {step.step_no || index + 1}. </strong>
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
              ))}
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
            <div className="modal-content flex flex-wrap gap-4">
              {overviewModalData?.map((ov, i) => (
                <div key={i}>
                  <p>{ov.name}</p>
                  <img src={ov.image} alt="overview" className="w-32 h-32 object-cover rounded" />
                </div>
              ))}
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
            <div className="flex justify-between">
              <h2 className=" text-lg font-semibold">Description Swiper Img</h2>
              <button onClick={() => setDescriptionImgModal(false)}>X</button>
            </div>
            <div className="modal-content flex flex-wrap gap-2">
              {
                descriptionImgModalData?.map((img, index) => (
                  <div key={index} className="mt-2">
                    <img
                      src={img.image}
                      alt="description_img"
                      className="w-28 h-28 object-cover rounded-md"
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </GeneralModal>
      </div>
    </>
  );
};

export default ListServiceDetails;