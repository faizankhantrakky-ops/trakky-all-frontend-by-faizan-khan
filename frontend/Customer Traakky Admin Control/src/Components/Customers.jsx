import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { formatDate } from "./DateRange/formatDate";
import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import "./css/salonelist.css";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

const Customers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const [customersData, setCustomersData] = useState([]);
  const [filterField, setFilterField] = useState("phone_number");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [verifiedFilter, setVerifiedFilter] = useState("all");

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

  useEffect(() => {
    getCustomers(false);
  }, []);

  const getCustomers = async (isDate) => {
    try {
      let url = "";
      if (isDate) {
        const [{ startDate, endDate }] = dateState;
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        url = `https://backendapi.trakky.in/salons/salonuser/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      } else {
        url = `https://backendapi.trakky.in/salons/salonuser/`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const modifiedData = data.map((customer) => ({
          ...customer,
          registrationDateTime: new Date(customer.created_at).toLocaleString(),
        }));
        setCustomersData(modifiedData);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch customers. Please try again later.", {
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

  const deleteUser = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this user?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/salonuser/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("User Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        getCustomers(false);
      } else if (response.status === 401) {
        toast.error("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredCustomers(customersData);
    }
    setFilteredCustomers(
      customersData.filter((customer) => {
        const fieldValue = customer[filterField];
        return (
          fieldValue &&
          fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [searchTerm, filterField, customersData]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  useEffect(() => {
    setFilteredCustomers(
      customersData.filter((customer) => {
        if (verifiedFilter === "all") return true;
        const isVerified = verifiedFilter === "true";
        return customer.verified === isVerified;
      })
    );
  }, [verifiedFilter, customersData]);

  const tableHeaders = [
    "Registration Date & Time",
    "Name",
    "Phone No.",
    "Email",
    "City",
    "Area",
    "Country",
    "Verified",
    "Profile Image",
    "DOB",
    "Action",
  ];

  return (
    <>
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}
                  value={filterField}
                >
                  <option value={"name"}>Name</option>
                  <option value={"phone_number"}>Phone Number</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={filterField === "name" ? "text" : "number"}
                    name="search-inp"
                    placeholder="search here.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="tb-body-filter">
                <select
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  value={verifiedFilter}
                >
                  <option value="all">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
            </div>
            <div
              className="DB-main-date-range"
              style={{ visibility: "hidden" }}
            >
              <div
                className="DB-Date-Range-Button"
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
                    paddingLeft: "5px",
                  }}
                  readOnly
                />
                <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>
                  {" "}
                  ~{" "}
                </span>
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
                />
              </div>
            </div>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={header === "Address" ? "address-field-s" : ""}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchTerm ? (
                  filteredCustomers.length !== 0 ? (
                    filteredCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td>{customer.registrationDateTime || "-"}</td>
                        <td>{customer.name || "-"}</td>
                        <td>{customer.phone_number || "-"}</td>
                        <td>{customer.email || "-"}</td>
                        <td>{customer.city || "-"}</td>
                        <td>{customer.area || "-"}</td>
                        <td>{customer.country || "-"}</td>
                        <td>
                          {customer.verified ? <CheckIcon /> : <ClearIcon />}
                        </td>
                        <td>
                          {customer.profile_image ? (
                            <img
                              src={customer.profile_image}
                              alt="profile_image"
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
                        <td>{customer.dob || "-"}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteUser(customer.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="not-found">
                      <td colSpan={17}>
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
                  )
                ) : filteredCustomers.length !== 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.registrationDateTime || "-"}</td>
                      <td>{customer.name || "-"}</td>
                      <td>{customer.phone_number || "-"}</td>
                      <td>{customer.email || "-"}</td>
                      <td>{customer.city || "-"}</td>
                      <td>{customer.area || "-"}</td>
                      <td>{customer.country || "-"}</td>
                      <td>
                        {customer.verified ? <CheckIcon /> : <ClearIcon />}
                      </td>
                      <td>
                        {customer.profile_image ? (
                          <img
                            src={customer.profile_image}
                            alt="profile_image"
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
                      <td>{customer.dob || "-"}</td>
                      <td>
                        <AiFillDelete
                          onClick={() => deleteUser(customer.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No entries
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-result-count">
            showing 1 to {filteredCustomers.length} of{" "}
            {filteredCustomers.length} entries
          </div>
          {/* <div
            className="inquiryViewAllButton"
            onClick={() => getCustomers(false)}
          >
            <button type="submit">
              <div> View all </div>
            </button>
          </div> */}
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
      </div>
      <Toaster />
    </>
  );
};

export default Customers;
