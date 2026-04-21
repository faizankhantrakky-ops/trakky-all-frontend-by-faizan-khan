import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const TrashNewSpaRequests = () => {
  const tableHeaders = [
    "Spa Name",
    "Spa Contact Number",
    "Owner Name",
    "Owner Contact Number",
    "Whatsapp Number",
    "Address",
    "City",
    "Approved",
    "Action",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSpaData, setPendingSpaData] = useState([]);

  const getTrashSpa = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/register-spa/list-soft-deleted/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingSpaData(data);
        // setPendingSalon(data?.results);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching trash spas:", error);
      toast.error("Failed to fetch pending spa. Please try again later", {
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
    getTrashSpa();
  }, []);

  const handleDelete = async (spaId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to permanently delete this spa?"
      );

      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/spas/register-spa/${spaId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Spa permanently deleted !");

        // Remove the deleted spa from the state
        setPendingSpaData((prevState) =>
          prevState.filter((spa) => spa.id !== spaId)
        );
      } else {
        const statusCode = response.status;
        throw new Error(`Failed to delete ! Status code: ${statusCode}`);
      }
    } catch (error) {
      console.error("Error deleting spa:", error);
      toast.error("Failed to delete. Please try again later", {
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

  const handleRestore = async (spaId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to restore this spa?"
      );

      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/spas/register-spa/${spaId}/restore/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Spa restored !");
        setPendingSpaData((prevState) =>
          prevState.filter((spa) => spa.id !== spaId)
        );
      } else {
        const statusCode = response.status;
        throw new Error(`Failed to restore ! Status code: ${statusCode}`);
      }
    } catch (error) {
      console.error("Error restoring spa:", error);
      toast.error("Failed to restore. Please try again later", {
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

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input" style={{ visibility: "hidden" }}>
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select>
                  <option>Select Filter</option>
                  <option>Select Name</option>
                  <option>Select User name</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit">Search</button>
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "0px",
                visibility: "visible",
              }}
            >
              <Link to="/newsparequests">
                <button style={{ padding: "10px", backgroundColor: "green" }}>
                  <div> View List</div>
                </button>
              </Link>
            </div>
            <div className="tb-add-item"></div>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={header === "Address" ? "address-field-s" : ""}
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {pendingSpaData.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={9}>
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
                  pendingSpaData.map((spa) => (
                    <tr key={spa?.id}>
                      <td>{spa?.spa_name}</td>
                      <td>{spa?.spa_contact_number}</td>
                      <td>{spa?.owner_name}</td>
                      <td>{spa?.owner_contact_number}</td>
                      <td>{spa?.whatsapp_number}</td>
                      <td>{spa?.address}</td>
                      <td>{spa?.city}</td>
                      <td>
                        <Switch
                          checked={spa?.approved}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </td>
                      <td>
                        <AiFillDelete
                          onClick={() => handleDelete(spa.id)}
                          style={{ cursor: "pointer" }}
                        />
                        <MdOutlineSettingsBackupRestore
                          style={{
                            paddingTop: "13px",
                            width: "33px",
                            height: "33px",
                            margin: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRestore(spa.id)}
                        />
                      </td>
                    </tr>
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

export default TrashNewSpaRequests;
