import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const TrashNewSalonRequests = () => {
  const tableHeaders = [
    "Salon Name",
    "Salon Contact Number",
    "Owner Name",
    "Owner Contact Number",
    "Whatsapp Number",
    "Address",
    "City",
    "Approved",
    "Action",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSalonData, setPendingSalonData] = useState([]);

  const getTrashSalon = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/list-soft-deleted/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingSalonData(data);
        // setPendingSalon(data?.results);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching trash salons:", error);
      toast.error("Failed to fetch pending salon. Please try again later", {
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
    getTrashSalon();
  }, []);

  const handleDelete = async (salonId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to permanently delete this salon?"
      );

      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/${salonId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Salon permanently deleted !");

        // Remove the deleted salon from the state
        setPendingSalonData((prevState) =>
          prevState.filter((salon) => salon.id !== salonId)
        );
      } else {
        const statusCode = response.status;
        throw new Error(`Failed to delete ! Status code: ${statusCode}`);
      }
    } catch (error) {
      console.error("Error deleting salon:", error);
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

  const handleRestore = async (salonId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to restore this salon?"
      );

      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/${salonId}/restore/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Salon restored !");
        setPendingSalonData((prevState) =>
          prevState.filter((salon) => salon.id !== salonId)
        );
      } else {
        const statusCode = response.status;
        throw new Error(`Failed to restore ! Status code: ${statusCode}`);
      }
    } catch (error) {
      console.error("Error restoring salon:", error);
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
              <Link to="/newsalonrequests">
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
                {pendingSalonData.length === 0 ? (
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
                  pendingSalonData.map((salon) => (
                    <tr key={salon?.id}>
                      <td>{salon?.salon_name}</td>
                      <td>{salon?.salon_contact_number}</td>
                      <td>{salon?.owner_name}</td>
                      <td>{salon?.owner_contact_number}</td>
                      <td>{salon?.whatsapp_number}</td>
                      <td>{salon?.address}</td>
                      <td>{salon?.city}</td>
                      <td>
                        <Switch
                          checked={salon?.approved}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </td>
                      <td>
                        <AiFillDelete
                          onClick={() => handleDelete(salon.id)}
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
                          onClick={() => handleRestore(salon.id)}
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

export default TrashNewSalonRequests;
