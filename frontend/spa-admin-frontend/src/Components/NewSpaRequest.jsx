import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";

const NewSpaRequest = () => {
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
  const [pendingSpaData, setPendingSpaData] = useState(null);
  const [pendingSpa, setPendingSpa] = useState([]);

  const [page, setPage] = useState(1);

  const spasPerPage = 12;
  const totalPages = Math.ceil(pendingSpaData?.count / spasPerPage);

  const getPendingSpa = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/register-spa/?page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setPendingSpaData(data);
        setPendingSpa(data?.results);
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
  }, [page]);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleDelete = async (spaId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to move this spa to trash?"
      );
      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/spas/register-spa/${spaId}/soft-delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Spa moved to trash successfully!");
        setPendingSpa((prevState) =>
          prevState.filter((spa) => spa.id !== spaId)
        );
      } else {
        throw new Error("Failed to move spa to trash");
      }
    } catch (error) {
      console.error("Error deleting spa:", error);
      toast.error("Failed to move spa to trash. Please try again later", {
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
              <Link to="/trash">
                <button style={{ padding: "10px", backgroundColor: "red" }}>
                  <AiFillDelete style={{ paddingRight: "2px" }} />
                  <div> View Trash</div>
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
                {pendingSpa.map((spa) => (
                  <>
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
            showing 1 to {pendingSpa?.length} of {pendingSpaData?.count} entries
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id={parseInt(1)} onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  «
                </span>
              )}
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
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={parseInt(totalPages)} onClick={handlePageChange}>
                »»
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSpaRequest;
