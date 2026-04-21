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

const AdminUserList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [usersData, setUsersData] = useState([]);
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const [filteredSuperUser, setFilteredSuperUser] = useState([]);
  const getAdminUser = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/users/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUsersData(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch customers. Please try again later.", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getAdminUser();
  }, []);

  const deleteUser = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this user?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/users/${id}/`,
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
        });
        getAdminUser();
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

  const tableHeaders = [
    "Username",
    "password",
    "is superuser",
    "Name",
    "Action",
  ];

  useEffect(() => {
    if (verifiedFilter === "all") {
      setFilteredSuperUser(usersData);
    } else {
      let filteredSuperUser = usersData.filter(
        (user) => user.is_superuser === (verifiedFilter === "true")
      );
      setFilteredSuperUser(filteredSuperUser);
    }
  }, [verifiedFilter, usersData]);

  return (
    <>
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              {/* <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}>
                  <option value={"name"}>Name</option>
                  <option value={"phone_number"}>Phone Number</option>
                </select>
              </div> */}
              {/* <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={filterField === "name" ? "text" : "number"}
                    name="search-inp"
                    placeholder="search here.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div> */}
              <div className="tb-body-filter">
                <select
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  value={verifiedFilter}
                >
                  <option value="all">All</option>
                  <option value="true">super-user</option>
                  <option value="false">non super-user</option>
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
                {filteredSuperUser.length !== 0 ? (
                  filteredSuperUser.map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.username || "-"}</td>
                      <td>{"Encrypt"}</td>
                      <td>{customer.is_superuser ? "YES" : "NO"}</td>
                      <td>{customer.first_name || "-"}</td>
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
                    <td colSpan={5}>
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-result-count">
            showing 1 to {filteredSuperUser.length} of{" "}
            {filteredSuperUser.length} entries
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AdminUserList;
