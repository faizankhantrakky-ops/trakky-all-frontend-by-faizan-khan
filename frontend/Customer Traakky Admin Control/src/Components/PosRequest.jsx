import React, { useState, useEffect, useContext, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import AuthContext from "../Context/AuthContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const PosRequest = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [page, setPage] = useState(1);
  const [availableAreaName, setAvailableAreaName] = useState([]);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [selectedSalonId, setSelectSalonId] = useState("");
  const totalPages = 1;
  const [salonRequsetDataLoading, setSalonRequstDataLoading] = useState(false);
  const [servicerequestData, setServiceRequestData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const tableHeaders = [
    "Index",
    "Owner name",
    "Salon name",
    "Salon area",
    "Salon city",
    "Contact No",
    "Owner number",
    "Whatsapp No",
    "Address",
  ];

  useEffect(() => {
    fetchSalonData();
  }, [])

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSalonData(query); // Fetch data based on the search query
  };


  useEffect(() => {
    // Filter the salon data locally whenever searchQuery changes
    if (searchQuery) {
      const filtered = servicerequestData.filter((service) => {
        return (
          service.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.city?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredData(filtered);
      if (filtered.length === 0) {
        setNoDataMessage("No salons available matching your search.");
      }
    } else {
      setFilteredData(servicerequestData); // Show all data if searchQuery is cleared
    }
  }, [searchQuery, servicerequestData]);

  const fetchSalonData = async (searchText = "") => {
    setSalonRequstDataLoading(true);
    setNoDataMessage("");

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/salon-request/`,
        {
          method: "GET",
        }
      );



      if (response.ok) {
        const data = await response.json();
        setServiceRequestData(data);
        if (data.length === 0) {
          setNoDataMessage("No salons available matching your search.");
        }
      } else {
        const errorData = await response.text(); // Log error response text for debugging
        console.error("Error response:", errorData); // Log the error
        toast.error("Failed to fetch salon requests. Please try again later.");
      }
    } catch (error) {
      console.error("Fetch error:", error); // Log fetch error for debugging
      toast.error("Failed to fetch salon requests. Please try again later.");
    } finally {
      setSalonRequstDataLoading(false);
    }
  };


  return (
    <>
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
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="Search here.."
                    value={searchQuery} // Set the value to controlled input
                    onChange={handleSearchChange}
                  />
                </div>
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
                {salonRequsetDataLoading ? (
                  <tr>
                    <td colSpan={13} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : filteredData?.length === 0 ? (
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
                  filteredData?.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{Math.floor((page - 1) * 30 + index + 1)}</td>
                        <td>{service?.owner_name}</td>
                        <td>{service?.name}</td>
                        <td>
                          {service?.area}
                        </td>
                        <td>
                          {service?.city}
                        </td>
                        <td>{service?.contact_no}</td>
                        <td>{service?.owner_contact_no}</td>
                        <td>{service?.whatsapp_no}</td>
                        <td>
                          {service?.address}
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
    </>
  );
};

export default PosRequest;
