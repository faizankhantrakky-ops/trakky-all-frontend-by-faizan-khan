import React, { useState, useEffect, useContext } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import Switch from "@mui/material/Switch";

import "./css/spaelist.css";

const Customers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [customersData, setCustomersData] = useState([]);
  const [filterField, setFilterField] = useState("name");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

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

  const getCustomers = async () => {
    try {
      let url = "https://backendapi.trakky.in/spas/spauser/";

      // Apply verified filter if set to true/false
      if (verifiedFilter !== "all") {
        url += `?verified=${verifiedFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const modifiedData = data.map((customer) => ({
          ...customer,
          registrationDateTime: new Date(customer.created_at).toLocaleString(),
        }));
        setCustomersData(modifiedData);
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
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
      toast.error(`${error}`, {
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
        description: "This will delete the user permanently",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spas/spauser/${id}/`,
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
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setSearchTerm("");
        getCustomers();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error Deleting User with status code ${response.status}`, {
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
      if (error === undefined || error === "cancel") return;

      toast.error(`${error}`, {
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

  useEffect(() => {
    getCustomers();
  }, []);

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
    getCustomers(); // Reload data when filter changes
  }, [verifiedFilter]);

  return (
    <div className="tb-body-content">
      <Toaster />
      <div className="tb-body-data">
        <div className="tb-body-input">
          <div className="tb-body-src-fil">
            <div className="tb-body-filter">
              <select onChange={(e) => setFilterField(e.target.value)}>
                <option value="name">Name</option>
                <option value="phone_number">Phone Number</option>
              </select>
            </div>
            <div className="tb-body-search">
              <div className="tb-search-field">
                <input
                  type={filterField === "name" ? "text" : "number"}
                  name="search-inp"
                  placeholder="Search Here.."
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
              {filteredCustomers.length !== 0 ? (
                filteredCustomers.map((customer, index) => {
                  return (
                    <tr key={index}>
                      <td>{customer.registrationDateTime || "-"}</td>
                      <td>{customer.name || "-"}</td>
                      <td>{customer.phone_number || "-"}</td>
                      <td>{customer.email || "-"}</td>
                      <td>{customer.city || "-"}</td>
                      <td>{customer.area || "-"}</td>
                      <td>{customer.country || "-"}</td>{" "}
                      <td>
                        {customer.verified ? (
                          <CheckIcon />
                        ) : (
                          <ClearIcon /> || "-"
                        )}
                      </td>
                      <td>
                        {customer?.profile_image ? (
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
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="not-found">
                  <td colSpan={11}>
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
        <div className="tb-reasult-count">
          showing 1 to {customersData.length} of {customersData.length} entries
        </div>
      </div>
    </div>
  );
};

export default Customers;
