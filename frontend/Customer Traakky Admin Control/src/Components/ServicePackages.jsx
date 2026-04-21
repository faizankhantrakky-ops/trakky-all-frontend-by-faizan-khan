import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import PackageForm from "./Forms/ServicePackageForm";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

import "./css/salonelist.css";

const ServicePackages = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setfilteredPackages] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (updateFormOpened === null) {
      getPackages();
    }
  }, [updateFormOpened]);

  const getPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/packages/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setPackages(data);
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
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again later", {
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

  const deletePackage = async (packageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/packages/${packageId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setPackages(packages.filter((p) => p.id !== packageId));
        toast.success("Package Deleted Successfully !!", {
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
    "Package Name",
    "Salon Name",
    "Actual Price",
    "Discount Price",
    "Service Included Names",
    "Package Time",
    "Actions",
  ];

  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    // Filter packages based on the search term and selected option
    const filteredPackages = packages.filter((service) => {
      switch (searchOption) {
        case "Search Salon":
          return service.salon_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search Package Name":
          return service.package_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search Service":
          return Object.values(service.service_included_names).some((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        default:
          return true; // Return true for unknown search option
      }
    });
    setfilteredPackages(filteredPackages);
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option value="Search Salon">Search Salon</option>
                  <option value="Search Package Name">
                    Search Package Name
                  </option>
                  <option value="Search Service">Search Service</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    value={searchTerm}
                    placeholder="search hear.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addservicepackages">
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
                {loading ? (
                  <tr className="not-found">
                    <td colSpan={17}>
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
                  filteredPackages.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={17}>
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
                    filteredPackages.map((service, index) => (
                      <>
                        <tr key={index}>
                          <td>{service.package_name}</td>
                          <td>{service.salon_name}</td>
                          <td>{service.actual_price}</td>
                          <td>{service.discount_price}</td>
                          <td>
                            <ul>
                              {Object.values(
                                service.service_included_names
                              ).map((includedName, idx) => (
                                <li key={idx}>{includedName}</li>
                              ))}
                            </ul>
                          </td>
                          <td
                            style={{
                              whiteSpace: "pre-line",
                              lineHeight: "0.7",
                            }}
                          >
                            {`${service.package_time.days} days\n
              ${service.package_time.hours} hours\n
              ${service.package_time.minutes} minutes\n
              ${service.package_time.seating} Seating`}
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deletePackage(service.id)}
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
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <PackageForm
                                  packages={service}
                                  setPackages={(data) => {
                                    setPackages(
                                      packages.map((service) =>
                                        service.id === data.id ? data : service
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )
                ) : packages.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={17}>
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
                  packages.map((service, index) => (
                    <>
                      <tr key={index}>
                        <td>{service.package_name}</td>
                        <td>{service.salon_name}</td>
                        <td>{service.actual_price}</td>
                        <td>{service.discount_price}</td>
                        <td>
                          <ul>
                            {Object.values(service.service_included_names).map(
                              (includedName, idx) => (
                                <li key={idx}>{includedName}</li>
                              )
                            )}
                          </ul>
                        </td>
                        <td
                          style={{ whiteSpace: "pre-line", lineHeight: "0.7" }}
                        >
                          {`${service.package_time.days} days\n
            ${service.package_time.hours} hours\n
            ${service.package_time.minutes} minutes\n
            ${service.package_time.seating} Seating`}
                        </td>
                        <td>
                          <AiFillDelete
                            onClick={() => deletePackage(service.id)}
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
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <PackageForm
                                packages={service}
                                setPackages={(data) => {
                                  setPackages(
                                    packages.map((service) =>
                                      service.id === data.id ? data : service
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                                closeMOdal={() => setUpdateFormOpened(null)}
                              />
                            </Modal>
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
      </div>
    </>
  );
};

export default ServicePackages;
