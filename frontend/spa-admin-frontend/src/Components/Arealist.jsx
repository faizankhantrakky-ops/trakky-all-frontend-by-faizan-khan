import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

import AddArea from "./Forms/AreaForm";
import Modal from "./UpdateModal";
import "./css/spaelist.css";
import AuthContext from "../Context/AuthContext";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

// import { Add } from '@mui/icons-material';

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import GeneralModal from "./generalmodal/GeneralModal";

const Arealist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [areaData, setAreaData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredAreas, setfilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityAreaId, setPriorityAreaId] = useState("");

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [city, setCity] = useState([]);

  const deleteArea = async (id) => {
    try {
      await confirm({
        description: `This will delete the area with id ${id}`,
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spas/area/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        getAreas();
        toast.success("Area deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error deleting area ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined) return;

      toast.error(`Error deleting area ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const getAreas = async (selectedCity) => {
    let url = "https://backendapi.trakky.in/spas/area/";
    if (selectedCity && selectedCity !== undefined && selectedCity !== "") {
      url += `?city=${selectedCity}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Areas not found.";
        }

        throw new Error(errorMessage);
      }
      const data = await response.json();
      setAreaData(data.payload);
    } catch (error) {
      console.error(error);
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
    getAreas();
  }, []);

  useEffect(() => {
    getAreas(selectedCity);
  }, [selectedCity]);

  const tableHeaders = ["Priority", "Area Name", "City", "Actions"];

  useEffect(() => {
    setfilteredAreas(
      areaData.filter((spa) => {
        return spa.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/spas/city/`;
      const response = await fetch(url);

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "City not found.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setCityPayload(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (error) {
      console.error(error);
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
    getCity();
  }, []);

  if (selectedCity && selectedCity !== "") {
    tableHeaders.unshift("Change Priority");
  }

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/area/${id}/update-priority/`,
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
        setPriorityAreaId(null);
        getAreas(selectedCity);
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityAreaId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setPriorityAreaId(null);
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
              <Link to="/addarea">
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
                  filteredAreas.length !== 0 ? (
                    filteredAreas.map((area, index) => {
                      return (
                        <>
                          <tr key={index}>
                            {selectedCity && selectedCity !== "" && (
                              <td>
                                <LowPriorityIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setPriorityAreaId(area.id);
                                    setShowEditPriorityModal(true);
                                  }}
                                />
                              </td>
                            )}
                            <td>{area.priority}</td>
                            <td>{area.name}</td>
                            <td>{area.city_name}</td>
                            <td>
                              <AiFillDelete
                                onClick={() => deleteArea(area.id)}
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
                                  <AddArea
                                    areaData={area}
                                    setAreaData={(updatedArea) => {
                                      setAreaData(
                                        areaData.map((area) =>
                                          area.id === updatedArea.id
                                            ? updatedArea
                                            : area
                                        )
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                    closeModal={() => {
                                      getAreas(selectedCity);
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
                ) : areaData?.length > 0 ? (
                  areaData.map((area, index) => (
                    <>
                      <tr key={index}>
                        {selectedCity && selectedCity !== "" && (
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityAreaId(area.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                        )}
                        <td>{area.priority}</td>
                        <td>{area.name}</td>
                        <td>{area.city_name}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteArea(area.id)}
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
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddArea
                                areaData={area}
                                setAreaData={(updatedArea) => {
                                  setAreaData(
                                    areaData.map((area) =>
                                      area.id === updatedArea.id
                                        ? updatedArea
                                        : area
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                                closeModal={() => {
                                  getAreas(selectedCity);
                                  setUpdateFormOpened(null)
                                }
                                }
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {areaData.length} of {areaData.length} entries
          </div>
        </div>
      </div>
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
                handleUpdatePriority(priorityAreaId, newPriority);
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

export default Arealist;
