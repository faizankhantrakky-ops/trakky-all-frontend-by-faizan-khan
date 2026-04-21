import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import GeneralModal from "../Components/generalmodal/GeneralModal";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import "./css/spaelist.css";
import "./css/therapy.css";
import AddTherapy from "./Forms/TherapyForm";
import AuthContext from "../Context/AuthContext";

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const Therapy = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [TherapyData, setTherapyData] = useState([]);
  const [filteredTherapy, setfilteredTherapy] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");

  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  // const [availableAreaName, setAvailableAreaName] = useState([]);
  // const [selectedAreaName, setSelectedAreaName] = useState("");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");

  const getCity = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/city/");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCityPayload(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (error) {
      console.error("Error fetching city data:", error);

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
    getCity();
  }, []);

  const getTherapy = async (selectedCity) => {
    let url = `https://backendapi.trakky.in/spas/therapy/`;

    if (selectedCity !== "" && selectedCity !== undefined) {
      url = url + `?city=${selectedCity}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Error fetching therapy data! Status: ${response.status}`;

        // Customize error message based on status code
        if (response.status === 401) {
          errorMessage = "Unauthorized access! Please login again.";
        } else if (response.status === 404) {
          errorMessage = "Therapy data not found!";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setTherapyData(data);
    } catch (error) {
      console.error("Error fetching therapy data:", error);

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

  const deleteTherapy = async (id) => {
    try {
      await confirm({
        description: `Do you want to delete this Therapy?`,
      });

      let res = await fetch(`https://backendapi.trakky.in/spas/therapy/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        toast.success("Therapy Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getTherapy();
      } else if (res.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error in deleting Therapy ${res.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (err) {
      if (err === undefined) return;

      toast.error(`Error in deleting Therapy ${err}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    getTherapy();
  }, []);

  useEffect(() => {
    getTherapy(selectedCity);
  }, [selectedCity]);

  const tableHeaders = [
    "Priority",
    "Name",
    "Slug",
    "Spa Name",
    "City",
    "More",
    "Actions",
  ];

  if (selectedCity && selectedCity !== "") {
    tableHeaders.unshift("Change Priority");
  }

  useEffect(() => {
    setfilteredTherapy(
      TherapyData.filter((spa) => {
        return spa.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/therapy/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({
            priority: parseInt(priority),
          }),
        }
      );
      let data = await res.json();
      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityOfferId(null);
        getTherapy(selectedCity);
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityOfferId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setPriorityOfferId(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">Area</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedAreaName}
                    label="Area"
                    onChange={(e) => {
                      setSelectedAreaName(e.target.value);
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {availableAreaName?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div> */}
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
            <div className="tb-add-item">
              <Link to="/addtherapy">
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
                {searchTerm ? (
                  filteredTherapy.length !== 0 ? (
                    filteredTherapy.map((therapy, index) => (
                      <>
                        <tr>
                          {selectedCity && selectedCity !== "" && (
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setPriorityOfferId(therapy.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                          )}
                          <td>{therapy.priority}</td>
                          <td>{therapy.name}</td>
                          <td>{therapy.slug}</td>
                          <td>
                            <span
                              className="view-icon"
                              onClick={() => {
                                setModalData(
                                  Object.values(therapy.spa_names).join(", ")
                                );
                                setShowModal(true);
                              }}
                            >
                              <FaInfoCircle />
                            </span>
                          </td>
                          <td>{therapy?.city || "-"}</td>
                          {/* <td>{therapy?.area || "-" }</td> */}
                          <td>
                            {isDropdown !== index ? (
                              <IoIosArrowDropdown
                                onClick={() => {
                                  setExpandedRow(index);
                                  setIsDropdown(index);
                                }}
                              />
                            ) : (
                              <IoIosArrowDropup
                                onClick={() => {
                                  setExpandedRow(null);
                                  setIsDropdown(null);
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteTherapy(therapy.id)}
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

                        {expandedRow === index ? (
                          <div className="more_spa_detail__container">
                            <div className="image__container">
                              <img src={therapy.image_url} alt="" />
                            </div>
                          </div>
                        ) : null}
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddTherapy
                                  therapyData={therapy}
                                  setTherapyData={(data) => {
                                    setTherapyData(
                                      TherapyData.map((item) =>
                                        item.id === therapy.id ? data : item
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
                ) : TherapyData.length === 0 ? (
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
                  TherapyData.map((therapy, index) => (
                    <>
                      <tr>
                        {selectedCity && selectedCity !== "" && (
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityOfferId(therapy.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                        )}
                        <td>{therapy.priority}</td>
                        <td>{therapy.name}</td>
                        <td>{therapy.slug}</td>
                        <td>
                          <span
                            className="view-icon"
                            onClick={() => {
                              setModalData(
                                Object.values(therapy.spa_names).join(", ")
                              );
                              setShowModal(true);
                            }}
                          >
                            <FaInfoCircle />
                          </span>
                        </td>
                        <td>{therapy?.city || "-"}</td>
                        {/* <td>{therapy?.area || "-" }</td> */}
                        <td>
                          {isDropdown !== index ? (
                            <IoIosArrowDropdown
                              onClick={() => {
                                setExpandedRow(index);
                                setIsDropdown(index);
                              }}
                            />
                          ) : (
                            <IoIosArrowDropup
                              onClick={() => {
                                setExpandedRow(null);
                                setIsDropdown(null);
                              }}
                            />
                          )}
                        </td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteTherapy(therapy.id)}
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

                      {expandedRow === index ? (
                        <div className="more_spa_detail__container">
                          <div className="image__container">
                            <img src={therapy.image_url} alt="" />
                          </div>
                        </div>
                      ) : null}
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddTherapy
                                therapyData={therapy}
                                setTherapyData={(data) => {
                                  setTherapyData(
                                    TherapyData.map((item) =>
                                      item.id === therapy.id ? data : item
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {TherapyData.length} of {TherapyData.length} entries
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
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div>
          <h2 className="RI-modal-spa-dht">Spa</h2>
        </div>
        {modalData &&
          modalData.split(",").map((item, index) => (
            <div className="RI-modal-spa-table">
              <table>
                <tr>
                  <th>{index + 1}.</th>
                  <td className="RI-modal-spa-table-td">{item}</td>
                </tr>
              </table>
            </div>
          ))}
      </GeneralModal>
      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => setShowEditPriorityModal(false)}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 0",
          }}
        >
          <center
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Update Priority
          </center>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px  20px",
            }}
          >
            <input
              type="number"
              value={newPriority}
              placeholder="Enter New Priority"
              onChange={(e) => setNewPriority(e.target.value)}
              style={{
                width: "200px",
              }}
            />
          </div>
          <div
            className="submit-btn row"
            style={{
              padding: "0 0 20px 0",
              margin: "0",
            }}
          >
            <button
              onClick={() => {
                handleUpdatePriority(priorityOfferId, newPriority);
                setShowEditPriorityModal(false);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Therapy;
