import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/spaelist.css";
import AddCity from "./Forms/CityForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import GeneralModal from "./generalmodal/GeneralModal";

const Citylist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [cityData, setcityData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredCities, setfilteredCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityCityId, setPriorityCityId] = useState("");

  const getCity = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/spas/city/");
      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status >= 400 && response.status < 500) {
          // Client-side error
          throw new Error(`Client Error: ${response.status} - ${errorMessage}`);
        } else if (response.status >= 500 && response.status < 600) {
          // Server-side error
          throw new Error(`Server Error: ${response.status} - ${errorMessage}`);
        } else {
          // Other errors
          throw new Error(
            `Unexpected Error: ${response.status} - ${errorMessage}`
          );
        }
      }
      const data = await response.json();
      setcityData(data.payload);
    } catch (err) {
      console.log("Error : ", err);
      toast.error(err.message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#ffffff",
        },
      });
    }
  };

  const deleteCity = async (id) => {
    try {
      await confirm({
        description: "This will delete the city permanently",
      });
      const resp = await fetch(`https://backendapi.trakky.in/spas/city/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (resp.status === 204) {
        toast.success("City deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#ffffff",
          },
        });
        getCity();
      } else if (resp.status === 401) {
        alert("You'r logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong ${resp.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#ffffff",
          },
        });
      }
    } catch (err) {
      if (err === undefined) {
        return;
      }
      toast.error(`Something went wrong : ${err}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#ffffff",
        },
      });
    }
  };

  useEffect(() => {
    getCity();
  }, [updateFormOpened]);

  const tableHeaders = ["Priority", "Shift Priority", "City Name", "Actions"];

  useEffect(() => {
    setfilteredCities(
      cityData.filter((spa) => {
        return spa.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/city/${id}/update-priority/`,
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
        setPriorityCityId(null);
        getCity();
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityCityId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setNewPriority(null);
      setPriorityCityId(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select>
                  <option>City</option>
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
            <div className="tb-add-item">
              <Link to="/addcity">
                {" "}
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
                  filteredCities.length !== 0 ? (
                    filteredCities.map((city, index) => {
                      return (
                        <>
                          <tr>
                            <td>{city.priority}</td>
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setPriorityCityId(city.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                            <td>{city.name}</td>
                            <td>
                              <AiFillDelete
                                onClick={() => deleteCity(city.id)}
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
                                  closeModal={() => setUpdateFormOpened(false)}
                                >
                                  <AddCity
                                    cityData={city}
                                    setCityData={(data) => {
                                      setcityData(
                                        cityData.map((city) =>
                                          city.id === data.id ? data : city
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
                  cityData.map((city, index) => {
                    return (
                      <>
                        <tr>
                          <td>{city.priority}</td>
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityCityId(city.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                          <td>{city.name}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteCity(city.id)}
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
                                closeModal={() => setUpdateFormOpened(false)}
                              >
                                <AddCity
                                  cityData={city}
                                  setCityData={(data) => {
                                    setcityData(
                                      cityData.map((city) =>
                                        city.id === data.id ? data : city
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
            showing 1 to {cityData.length} of {cityData.length} entries
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
                handleUpdatePriority(priorityCityId, newPriority);
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

export default Citylist;
