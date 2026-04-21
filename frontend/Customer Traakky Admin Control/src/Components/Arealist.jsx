import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddArea from "./Forms/AreaForm";
import Modal from "./UpdateModal";
import "./css/salonelist.css";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Arealist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [areaData, setAreaData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredAreas, setfilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityAreaId, setPriorityAreaId] = useState("");
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);

  useEffect(() => {
    if (updateFormOpened === null) {
      getAreas();
    }
  }, [updateFormOpened]);

  const deleteArea = async (id) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this Area?`,
      });

      let url = `https://backendapi.trakky.in/salons/area/${id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("Area Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#FFFFFF",
          },
        });
        getAreas(selectedCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Error Deleting Area", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error("Error Deleting Area : " + error, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#FFFFFF",
        },
      });
    }
  };

  const getAreas = async (selectedCity) => {
    try {
      let url = `https://backendapi.trakky.in/salons/area/`;
      if (selectedCity !== "" && selectedCity !== undefined) {
        url = url + `?city=${selectedCity}`;
      }
      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setAreaData(data.payload);
      } else if (response.status === 401) {
        // Unauthorized access
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        // Other errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch areas. Please try again later.", {
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

  const tableHeaders = ["Priority", "Area Name", "City", "Actions"];

  useEffect(() => {
    setfilteredAreas(
      areaData.filter((spa) => {
        return spa.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, areaData]);

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      } else if (response.status === 401) {
        // Unauthorized access
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        // Other errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch city data. Please try again later.", {
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

  useEffect(() => {
    getAreas(selectedCity);
  }, [selectedCity]);

  if (selectedCity && selectedCity !== "") {
    tableHeaders.unshift("Change Priority");
  }

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/area/${id}/update-priority/`,
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(areaData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities locally
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setAreaData(updatedItems);

    // Get the ID of the dragged item and its new priority
    const draggedItemId = reorderedItem.id;
    const newPriority = result.destination.index + 1;

    // Use handleUpdatePriority to update the priority
    await handleUpdatePriority(draggedItemId, newPriority);
  };

  const updatePriorities = async (items) => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    try {
      for (const item of updatedItems) {
        await fetch(
          `https://backendapi.trakky.in/salons/area/${item.id}/update-priority/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + `${authTokens.access}`,
            },
            body: JSON.stringify({
              priority: item.priority,
            }),
          }
        );
      }
      setAreaData(updatedItems);
    } catch (err) {
      toast.error(`Error updating priorities: ${err.message}`, {
        duration: 4000,
        position: "top-center",
        style: {
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
                    placeholder="search Area here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
            {selectedCity && selectedCity !== "" ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="areas">
                  {(provided) => (
                    <table
                      className="tb-table"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <thead>
                        <tr>
                          {tableHeaders.map((header, index) => (
                            <th
                              key={index}
                              scope="col"
                              className={
                                header === "Address" ? "address-field-s" : ""
                              }
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {searchTerm ? (
                          filteredAreas.length !== 0 ? (
                            filteredAreas.map((area, index) => {
                              return (
                                <Draggable
                                  key={area.id}
                                  draggableId={area.id.toString()}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <tr
                                      key={index}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        backgroundColor: snapshot.isDragging
                                          ? "#f4f4f4"
                                          : "#fff",
                                        boxShadow: snapshot.isDragging
                                          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                                          : "none",
                                        ...(snapshot.isDragging && {
                                          height:
                                            provided.draggableProps.style
                                              .height,
                                        }),
                                        display: snapshot.isDragging
                                          ? "flex"
                                          : "",
                                        justifyContent: snapshot.isDragging
                                          ? "space-between"
                                          : "",
                                        alignItems: snapshot.isDragging
                                          ? "center"
                                          : "",
                                      }}
                                    >
                                      <td>
                                        <LowPriorityIcon
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setPriorityAreaId(area.id);
                                            setShowEditPriorityModal(true);
                                          }}
                                        />
                                      </td>
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
                                          onClick={() =>
                                            setUpdateFormOpened(index)
                                          }
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        />
                                      </td>
                                      {updateFormOpened === index && (
                                        <tr>
                                          <td style={{ padding: 0 }}>
                                            <Modal
                                              closeModal={() =>
                                                setUpdateFormOpened(null)
                                              }
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
                                              />
                                            </Modal>
                                          </td>
                                        </tr>
                                      )}
                                    </tr>
                                  )}
                                </Draggable>
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
                          areaData?.map((area, index) => (
                            <Draggable
                              key={area.id}
                              draggableId={area.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  key={index}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: snapshot.isDragging
                                      ? "#f4f4f4"
                                      : "#fff",
                                    boxShadow: snapshot.isDragging
                                      ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                                      : "none",
                                    ...(snapshot.isDragging && {
                                      height:
                                        provided.draggableProps.style.height,
                                    }),
                                    display: snapshot.isDragging ? "flex" : "",
                                    justifyContent: snapshot.isDragging
                                      ? "space-between"
                                      : "",
                                    alignItems: snapshot.isDragging
                                      ? "center"
                                      : "",
                                  }}
                                >
                                  <td>
                                    <LowPriorityIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setPriorityAreaId(area.id);
                                        setShowEditPriorityModal(true);
                                      }}
                                    />
                                  </td>
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
                                  {updateFormOpened === index && (
                                    <tr>
                                      <td style={{ padding: 0 }}>
                                        <Modal
                                          closeModal={() =>
                                            setUpdateFormOpened(null)
                                          }
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
                                          />
                                        </Modal>
                                      </td>
                                    </tr>
                                  )}
                                </tr>
                              )}
                            </Draggable>
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
                        {provided.placeholder}
                      </tbody>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <table className="tb-table">
                <thead>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={
                          header === "Address" ? "address-field-s" : ""
                        }
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searchTerm ? (
                    filteredAreas.length !== 0 ? (
                      filteredAreas.map((area, index) => {
                        return (
                          <tr key={index}>
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
                                    />
                                  </Modal>
                                </td>
                              </tr>
                            )}
                          </tr>
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
                    areaData?.map((area, index) => (
                      <tr key={index}>
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
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </tr>
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
            )}
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
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                }
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
