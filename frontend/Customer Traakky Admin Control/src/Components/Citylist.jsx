import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import DateRange from "./DateRange/DateRange";
import { useLocation } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/salonelist.css";
import AddCity from "./Forms/CityForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { formatDate } from "./DateRange/formatDate";
import Switch from "@mui/material/Switch";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Citylist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const confirm = useConfirm();

  const [cityData, setCityData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityCityId, setPriorityCityId] = useState("");
  const [dateSelected, setDateSelected] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

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
    getCity(false);
  }, []);

  useEffect(() => {
    if (updateFormOpened === false) {
      getCity(true);
    }
  }, [updateFormOpened]);

  const getCity = async (date) => {
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    let url;
    if (date) {
      url = `https://backendapi.trakky.in/salons/city/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      setDateSelected(true);
    } else {
      url = "https://backendapi.trakky.in/salons/city/";
      setDateSelected(false);
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setCityData(data.payload);
      } else {
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

  const deleteCity = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this city?",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/city/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("City Deleted Successfully", { duration: 3000 });
        getCity();
      } else if (response.status === 401) {
        logoutUser();
      } else {
        throw new Error("Failed to delete city");
      }
    } catch (error) {
      toast.error(error.message, { duration: 3000 });
    }
  };

  const tableHeaders = ["Priority", "Shift Priority", "City Name", "Active", "Actions"];

  const getFilteredCities = () => {
    // First apply search filter to ALL cities
    let searched = searchTerm
      ? cityData.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : [...cityData];

    // Then apply active/inactive filter
    if (activeFilter === 'active') {
      return searched.filter(city => city.is_active);
    } else if (activeFilter === 'inactive') {
      return searched.filter(city => !city.is_active);
    }

    return searched;
  };

  const toggleCityActive = async (id, isActive) => {
    const originalState = [...cityData];
    try {
      // Optimistic update
      setCityData(prevCities =>
        prevCities.map(city =>
          city.id === id ? { ...city, is_active: !isActive } : city
        )
      );

      const response = await fetch(
        `https://backendapi.trakky.in/salons/city/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({
            is_active: !isActive,
          }),
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update city status");
      }
    } catch (error) {
      // Revert on error
      setCityData(originalState);
      toast.error(error.message, { duration: 3000 });
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/city/${id}/update-priority/`,
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

      if (response.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
        });
        getCity();
      } else {
        throw new Error(`Failed to update priority: ${response.status}`);
      }
    } catch (error) {
      toast.error(error.message, { duration: 4000 });
    } finally {
      setNewPriority("");
      setPriorityCityId("");
      setShowEditPriorityModal(false);
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(cityData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setCityData(updatedItems);

    const draggedItemId = reorderedItem.id;
    const newPriority = result.destination.index + 1;
    await handleUpdatePriority(draggedItemId, newPriority);
  };

  const filteredCities = getFilteredCities();

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Cities</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addcity">
                <button type="submit">
                  <AddIcon />
                  <span>Add Item</span>
                </button>
              </Link>
            </div>
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="cities">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <table className="tb-table">
                    <thead>
                      <tr>
                        {tableHeaders.map((header, index) => (
                          <th key={index} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city, index) => (
                          <Draggable
                            key={city.id}
                            draggableId={city.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? "dragging" : ""} ${!city.is_active ? "inactive-city" : ""
                                  }`}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging
                                    ? "#f4f4f4"
                                    : !city.is_active
                                      ? "#f9f9f9"
                                      : "#fff",
                                  color: !city.is_active ? "#999" : "inherit",
                                }}
                              >
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
                                  <Switch
                                    checked={city.is_active}
                                    onChange={() =>
                                      toggleCityActive(city.id, city.is_active)
                                    }
                                    color={city.is_active ? "primary" : "default"}
                                  />
                                </td>
                                <td>
                                  <AiFillDelete
                                    onClick={() => deleteCity(city.id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                  &nbsp;&nbsp;
                                  <FaEdit
                                    onClick={() => setUpdateFormOpened(index)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <tr className="not-found">
                          <td colSpan={tableHeaders.length}>
                            <div>
                              {searchTerm
                                ? `No cities found matching "${searchTerm}"`
                                : activeFilter === 'active'
                                  ? "No active cities found"
                                  : activeFilter === 'inactive'
                                    ? "No inactive cities found"
                                    : "No cities available"}
                            </div>
                          </td>
                        </tr>
                      )}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            Showing 1 to {filteredCities.length} of {cityData.length} entries
          </div>
        </div>
      </div>

      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => setShowEditPriorityModal(false)}
      >
        <div className="priority-modal-content">
          <h3>Update Priority</h3>
          <input
            type="number"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            placeholder="Enter new priority"
          />
          <button
            onClick={() => handleUpdatePriority(priorityCityId, newPriority)}
          >
            Update Priority
          </button>
        </div>
      </GeneralModal>
    </>
  );
};

export default Citylist;