import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";

const PosSpaREquest = () => {
  const tableHeaders = [
    "Spa Name",
    "Spa Contact Number",
    "Owner Name",
    "Owner Contact Number",
    "Whatsapp Number",
    "Address",
    "City",
    "area",
    "Action",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSpa, setPendingSpa] = useState([]);

  const getPendingSpa = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/spa-request/`
      );
      if (response.ok) {
        const data = await response.json();
        setPendingSpa(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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

  useEffect(() => {
    getPendingSpa();
  }, []);

  const handleDelete = async (spaId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete spa pos request?"
      );
      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return;
      }

      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/spa-request/${spaId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Spa pos request deleted successfully");
        getPendingSpa();
      } else {
        throw new Error("Failed to delete spa pos request");
      }
    } catch (error) {
      console.error("Error deleting spa:", error);
      toast.error("Failed to delete spa pos request", {
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
                {pendingSpa.map((spa) => (
                  <>
                    <tr key={spa?.id}>
                      <td>{spa?.name}</td>
                      <td>{spa?.contact_no}</td>
                      <td>{spa?.owner_name}</td>
                      <td>{spa?.owner_contact_no}</td>
                      <td>{spa?.whatsapp_no}</td>
                      <td>{spa?.address}</td>
                      <td>{spa?.city}</td>
                      <td>{spa?.area}</td>
                    
                      <td>
                        <AiFillDelete
                          onClick={() => handleDelete(spa.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {pendingSpa?.length > 0 ? 1 : 0} to {pendingSpa?.length} of {pendingSpa?.count} entries
          </div>
         
        </div>
      </div>
    </>
  );
};

export default PosSpaREquest;
