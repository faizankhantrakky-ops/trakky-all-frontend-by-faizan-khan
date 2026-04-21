import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { InputLabel, Select, MenuItem, OutlinedInput, FormControl } from "@mui/material";
import "./css/spaelist.css";
import GeneralModal from "./generalmodal/GeneralModal";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TrustedSpas = () => {
  const scrollTopRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());
  const [selectedCityName, setSelectedCityName] = useState("");
  const [cityPayloadData, setCityPayloadData] = useState(null);
  const [cityName, setCityName] = React.useState([]);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [trustedSpas, setTrustedSpas] = useState([]);
  const [totalTrustedSpas, setTotalTrustedSpas] = useState(0);
  const [page, setPage] = useState(1);

  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalTrustedSpas / spasPerPage);

  useEffect(() => {
    console.log("page : ", page);
    handleSearch(selectedCityName, page);
  }, [page]);

  const handleCityFilter = (event) => {
    setSelectedCityName(event.target.value);
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/trusted-spa/${id}/update-priority/`,
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
        handleSearch(selectedCityName, page);

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
        setPriorityOfferId(null);
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
      setPriorityOfferId(null);
      handleSearch(selectedCityName, page);
    }
  };

  const deleteTrustedSpas = async (spaid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/trusted-spa/${spaid}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        toast.success("Deleted Successfully !!", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        if (page === 1) {
          handleSearch(selectedCityName, page);
        } else {
          setPage(1);
        }
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

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const tableHeaders = [
    "Priority",
    "Spa Name",
    "Spa City",
    "Spa Area",
    "Action",
  ];
  if (selectedCityName) {
    tableHeaders.unshift("Change Priority");
  }

  const handleSearch = async (city, pageCount) => {
    let url = `https://backendapi.trakky.in/spas/trusted-spa/?page=${pageCount}`;

    if (city) {
      url = url + `&city=${city}`;
    }

    setLoading(true);
    abortControllerRef.current.abort();

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();

      setTrustedSpas(data.results);
      setTotalTrustedSpas(data.count);
      if (scrollTopRef.current) {
        scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.name !== "AbortError") {
        toast.error(`Error: ${error.message}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    if (page === 1 && selectedCityName !== undefined) {
      handleSearch(selectedCityName, page);
    } else {
      setPage(1);
    }
  }, [selectedCityName]);

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/city/`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCityPayloadData(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCityName(city);
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(trustedSpas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities locally
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setTrustedSpas(updatedItems);

    // Get the ID of the dragged item and its new priority
    const draggedItemId = reorderedItem.id;
    const newPriority = result.destination.index + 1;

    // Use handleUpdatePriority to update the priority
    await handleUpdatePriority(draggedItemId, newPriority);
  };



  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-src-input">
                <FormControl
                  FormControl
                  sx={{
                    margin: "8px 2px",
                    minWidth: 100,
                    width: "fit-content",
                  }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCityName}
                    label="Select City"
                    input={<OutlinedInput label="Tag" />}
                    onChange={handleCityFilter}
                  >
                    <MenuItem                       value="">
                      <em>None</em>
                    </MenuItem>
                    {cityName?.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addtrustedspas">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="tb-row-data">
            {selectedCityName ? (
              <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="trustedSpas">
                {(provided) => (
                  <table className="tb-table" {...provided.droppableProps} ref={provided.innerRef}>
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
                      ) : trustedSpas.length === 0 ? (
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
                        trustedSpas.map((spas, index) => (
                          <Draggable key={spas.id} draggableId={spas.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                key={index}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging
                                    ? "#f4f4f4"
                                    : "#fff",
                                  boxShadow: snapshot.isDragging
                                    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                                    : "none",
                                  ...(snapshot.isDragging && { height: provided.draggableProps.style.height }),
                                  display: snapshot.isDragging ? "flex" : "",
                                  justifyContent: snapshot.isDragging ? "space-between" : "",
                                  alignItems: snapshot.isDragging ? "center" : "",
                                }}
                              >
                                {selectedCityName && (
                                  <td>
                                    <LowPriorityIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setPriorityOfferId(spas.id);
                                        setShowEditPriorityModal(true);
                                      }}
                                    />
                                  </td>
                                )}
                                <td>{spas.priority}</td>
                                <td>{spas.spa.name}</td>
                                <td>{spas.spa.city}</td>
                                <td>{spas.spa.area}</td>
                                <td>
                                  <AiFillDelete
                                    onClick={() => deleteTrustedSpas(spas.id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
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
                  ) : trustedSpas.length === 0 ? (
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
                    trustedSpas.map((spas, index) => (
                      <tr key={index}>
                        <td>{spas.priority}</td>
                        <td>{spas.spa.name}</td>
                        <td>{spas.spa.city}</td>
                        <td>{spas.spa.area}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteTrustedSpas(spas.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {trustedSpas?.length} of {totalTrustedSpas} entries
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

export default TrustedSpas;

