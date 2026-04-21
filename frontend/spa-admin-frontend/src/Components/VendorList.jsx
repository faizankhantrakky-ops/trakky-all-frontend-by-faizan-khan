import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./css/spaelist.css";
import { Link } from "react-router-dom";
import AddVendor from "./Forms/VendorForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";

const VendorList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [vendorsData, setVendorsData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredVendors, setfilteredVendors] = useState([]);
  const [filterField, setFilterField] = useState("ownername");

  const [searchTerm, setSearchTerm] = useState("");

  const getVendors = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/spavendor/vendor/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (!response.ok) {
        let errorMessage = `Error fetching vendors! Status: ${response.status}`;

        // Customize error message based on status code
        if (response.status === 401) {
          errorMessage = "Unauthorized access! Please login again.";
        } else if (response.status === 404) {
          errorMessage = "Vendors not found!";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setVendorsData(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);

      toast.error(error.message, {
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
    getVendors();
  }, [authTokens]);

  const deleteVendor = async (id) => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/spavendor/vendor/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
  
      if (response.ok) {
        toast.success("Vendor deleted successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        // Refresh the vendors data after successful deletion
        getVendors();
      } else {
        let errorMessage = `Error: ${response.status}`;
        if (response.status === 401) {
          errorMessage = "Unauthorized access! Please login again.";
          logoutUser();
        } else if (response.status === 404) {
          errorMessage = "Vendor not found!";
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error(error.message, {
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
  

  const tableHeaders = [
    "User",
    "Vendor Name",
    "Business Name",
    "Phone Number",
    "Password",
    "Spa Name",
    "Action",
  ];

  useEffect(() => {
    if (searchTerm === "") {
      return setfilteredVendors(vendorsData);
    }

    setfilteredVendors(
      vendorsData.filter((spa) => {
        return spa[filterField]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}>
                  {/* <option disabled>Select Filter</option> */}
                  <option value={"ownername"}>Name</option>
                  <option value={"ph_number"}>phone number</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={filterField === "ownername" ? "text" : "number"}
                    name="search-inp"
                    placeholder="search here.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit">Search</button>
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addvendor">
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
                {searchTerm ? (
                  filteredVendors.length !== 0 ? (
                    filteredVendors?.map((vendor, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{vendor.user}</td>
                            <td>{vendor.ownername}</td>
                            <td>{vendor.businessname}</td>
                            <td>{vendor.ph_number}</td>
                            <td>{vendor.password}</td>
                            <td>{vendor.spa_name}</td>
                            {/* <td>{vendor.description}</td> */}
                            <td>
                            <AiFillDelete onClick={() => deleteVendor(vendor.id)} />

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
                                  <AddVendor
                                    vendorData={vendor}
                                    setVendorData={(data) => {
                                      setVendorsData(
                                        vendorsData?.map((vendor) =>
                                          vendor.user === data.user
                                            ? data
                                            : vendor
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
                      );
                    })
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
                ) : (
                  vendorsData?.map((vendor, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{vendor.user}</td>
                          <td>{vendor.ownername}</td>
                          <td>{vendor.businessname}</td>
                          <td>{vendor.ph_number}</td>
                          <td>{vendor.password}</td>
                          <td>{vendor.spa_name}</td>
                          {/* <td>{vendor.description}</td> */}
                          <td>
                            <AiFillDelete
                             onClick={() => deleteVendor(vendor.id)}
                              style={{
                                cursor: "pointer",
                              }}
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
                                <AddVendor
                                  vendorData={vendor}
                                  setVendorData={(data) => {
                                    setVendorsData(
                                      vendorsData?.map((vendor) =>
                                        vendor.user === data.user
                                          ? data
                                          : vendor
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {vendorsData?.length} of {vendorsData?.length} entries
          </div>
          {/* <div className="tb-more-results">
                        <div className="tb-pagination">
                            <a href="#">«</a>
                            <a href="#">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a className="active">
                                5
                            </a>
                            <a href="#">6</a>
                            <a href="#">7</a>
                            <a href="#">»</a>
                        </div>
                    </div> */}
        </div>
      </div>
    </>
  );
};

export default VendorList;
