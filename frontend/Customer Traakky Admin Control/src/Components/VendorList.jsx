import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import { useLocation } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { formatDate } from "./DateRange/formatDate";
import "./css/salonelist.css";
import { Link } from "react-router-dom";
import AddVendor from "./Forms/VendorForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const VendorList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredVendors, setfilteredVendors] = useState([]);
  const [filterField, setFilterField] = useState("ownername");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateSelected, setDateSelected] = useState(true);

  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
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
    getVendors(true);
  }, [dateState]);

  const handleViewAll = () => {
    setSearchTerm("");
    getVendors(false);
  };

  const getVendors = async (date) => {
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    let url;
    if (date) {
      url = `https://backendapi.trakky.in/salonvendor/vendor/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      setDateSelected(true);
    } else {
      url = "https://backendapi.trakky.in/salonvendor/vendor/";
      setDateSelected(false);
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setVendorsData(data);
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
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors. Please try again later", {
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

  const deleteVendor = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        toast.success(
          "Vendor deleted successfully. The page will be reloaded to see updates."
        );
        getVendors(false);
      } else if (response.status === 401) {
        toast.error("You're logged out. Please log in again.");
        logoutUser();
      } else {
        const responseData = await response.json();
        console.error("Error deleting vendor:", responseData);
        toast.error(
          "An error occurred while deleting the vendor. Please try again later."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error(
        "Failed to delete the vendor. Please check your internet connection and try again."
      );
    }
  };

  const tableHeaders = [
    "User",
    "Vendor Name",
    "Business Name",
    "Phone Number",
    "Email",
    "Password",
    "Salon Name",
    "Branch Name",
    "Branch Code",
    "Logo",
    "Action",
  ];

  useEffect(() => {
    if (searchTerm === "") {
      return setfilteredVendors(vendorsData);
    }

    setfilteredVendors(
      vendorsData.filter((salon) => {
        return salon[filterField]
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
            <div className="DB-main-date-range ">
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
                  filteredVendors.length !== 0 ? (
                    filteredVendors?.map((vendor, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{vendor.user || "-"}</td>
                            <td>{vendor.ownername || "-"}</td>
                            <td>{vendor.businessname || "-"}</td>
                            <td>{vendor.ph_number || "-"}</td>
                            <td>{vendor.email || "-"}</td>
                            <td>{vendor.password || "-"}</td>
                            <td>{vendor.salon_name || "-"}</td>
                            <td>{vendor.branchname || "-"}</td>
                            <td>{vendor.branchcode || "-"}</td>
                            <td>
                              {vendor?.logo ? (
                                <img
                                  src={vendor.logo}
                                  alt="image"
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
                            <td>
                              <AiFillDelete
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteVendor(vendor.user)}
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
                  ) : (
                    <tr className="not-found">
                      <td colspan={11}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                        >
                          Not Found
                        </div>
                      </td>
                    </tr>
                  )
                ) : vendorsData?.length > 0 ? (
                  vendorsData?.map((vendor, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{vendor.user || "-"}</td>
                          <td>{vendor.ownername || "-"}</td>
                          <td>{vendor.businessname || "-"}</td>
                          <td>{vendor.ph_number || "-"}</td>
                          <td>{vendor.email || "-"}</td>
                          <td>{vendor.password || "-"}</td>
                          <td>{vendor.salon_name || "-"}</td>
                          <td>{vendor.branchname || "-"}</td>
                          <td>{vendor.branchcode || "-"}</td>
                          <td>
                            {vendor?.logo ? (
                              <img
                                src={vendor.logo}
                                alt="image"
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
                          <td>
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteVendor(vendor.user)}
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
                ) : (
                  <tr className="not-found">
                    <td colSpan={11}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        {dateSelected === true
                          ? "No entries with given date"
                          : "Not Found"}
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
            showing 1 to {vendorsData?.length} of {vendorsData?.length} entries
          </div>
          <div className="inquiryViewAllButton" onClick={handleViewAll}>
            <button type="submit">
              <div> View all </div>
            </button>
          </div>
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
    </>
  );
};

export default VendorList;
