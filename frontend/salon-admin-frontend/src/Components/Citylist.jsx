import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
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
import DateRange from "./DateRange/DateRange";
import { useLocation } from "react-router-dom";

const Citylist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const confirm = useConfirm();

  const [cityData, setCityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <-- LOADING STATE
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityCityId, setPriorityCityId] = useState("");
  const [dateSelected, setDateSelected] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      { startDate: currentDate, endDate: currentDate, key: "selection" },
    ];
  } else {
    initialDateState = [
      { startDate: dateState2[0].startDate, endDate: dateState2[0].endDate, key: "selection" },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  // Fetch cities with loading
  const getCity = async (date) => {
    setIsLoading(true);
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
        setCityData(data.payload || []);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch city data. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCity(false);
  }, []);

  useEffect(() => {
    if (updateFormOpened === false) {
      getCity(dateSelected);
    }
  }, [updateFormOpened]);

  const deleteCity = async (id) => {
    try {
      await confirm({ description: "Are you sure you want to delete this city?" });

      const response = await fetch(`https://backendapi.trakky.in/salons/city/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("City Deleted Successfully", { duration: 3000 });
        getCity(dateSelected);
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
    let searched = searchTerm
      ? cityData.filter((city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...cityData];

    if (activeFilter === "active") {
      return searched.filter((city) => city.is_active);
    } else if (activeFilter === "inactive") {
      return searched.filter((city) => !city.is_active);
    }
    return searched;
  };

  const toggleCityActive = async (id, isActive) => {
    const originalState = [...cityData];
    try {
      setCityData((prev) =>
        prev.map((city) =>
          city.id === id ? { ...city, is_active: !isActive } : city
        )
      );

      const response = await fetch(`https://backendapi.trakky.in/salons/city/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.status !== 200) throw new Error("Failed to update city status");
    } catch (error) {
      setCityData(originalState);
      toast.error(error.message, { duration: 3000 });
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/city/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (response.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
        });
        getCity(dateSelected);
      } else {
        throw new Error(`Failed to update priority: ${response.status}`);
      }
    } catch (error) {
      toast.error(error.message, { duration: 4000 });
    } finally {
      setNewPriority("");
      setPriorityCityId("");
      setShowEditPriorityModal(false);
      setIsLoading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
                <p className="mt-1 text-sm text-gray-600">Manage salon cities with priority and status</p>
              </div>
              <Link to="/addcity">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add City
                </button>
              </Link>
            </div>
          </div>

          {/* === Filters & Search === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex gap-3">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    label="Status"
                    disabled={isLoading}
                  >
                    <MenuItem value="all">All Cities</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="inactive">Inactive Only</MenuItem>
                  </Select>
                </FormControl>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50"
                  />
                  <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {dateSelected && (
                <DateRange
                  dateState={dateState}
                  setDateState={setDateState}
                  onDateChange={() => getCity(true)}
                />
              )}

              <button
                onClick={() => setShowDateSelectionModal(true)}
                disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {dateSelected ? "Reset Date" : "Filter by Date"}
              </button>
            </div>
          </div>

          {/* === Table with Loading Overlay === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-600">Loading cities...</p>
                </div>
              </div>
            )}

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="cities">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={isLoading ? "opacity-50" : ""}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableHeaders.map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city, index) => (
                            <Draggable
                              key={city.id}
                              draggableId={city.id.toString()}
                              index={index}
                              isDragDisabled={isLoading}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${snapshot.isDragging ? "dragging" : ""} ${!city.is_active ? "inactive-city" : ""}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: snapshot.isDragging ? "#f4f4f4" : !city.is_active ? "#f9f9f9" : "#fff",
                                    color: !city.is_active ? "#999" : "inherit",
                                  }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      #{city.priority}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => {
                                        setPriorityCityId(city.id);
                                        setNewPriority(city.priority);
                                        setShowEditPriorityModal(true);
                                      }}
                                      disabled={isLoading}
                                      className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                      title="Update Priority"
                                    >
                                      <LowPriorityIcon className="w-5 h-5" />
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{city.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Switch
                                      checked={city.is_active}
                                      onChange={() => toggleCityActive(city.id, city.is_active)}
                                      color="primary"
                                      disabled={isLoading}
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => deleteCity(city.id)}
                                        disabled={isLoading}
                                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                        title="Delete City"
                                      >
                                        <AiFillDelete className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => setUpdateFormOpened(index)}
                                        disabled={isLoading}
                                        className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                        title="Edit City"
                                      >
                                        <FaEdit className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={tableHeaders.length} className="p-8 text-center">
                              <div className="text-lg font-medium text-gray-600">
                                {searchTerm
                                  ? `No cities found matching "${searchTerm}"`
                                  : activeFilter === 'active'
                                    ? "No active cities"
                                    : activeFilter === 'inactive'
                                      ? "No inactive cities"
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

          {/* === Footer === */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <p>
              Showing 1 to {filteredCities.length} of {cityData.length} entries
            </p>
          </div>
        </div>
      </div>

      {/* === Date Modal === */}
      <GeneralModal open={showDateSelectionModal} handleClose={() => setShowDateSelectionModal(false)}>
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          onDateChange={() => getCity(true)}
          closeModal={() => setShowDateSelectionModal(false)}
        />
      </GeneralModal>

      {/* === Priority Modal === */}
      <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Update Priority</h3>
          <div className="flex justify-center mb-6">
            <input
              type="number"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
              }}
              placeholder="Enter new priority"
              className="w-32 px-4 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowEditPriorityModal(false)}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdatePriority(priorityCityId, newPriority)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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