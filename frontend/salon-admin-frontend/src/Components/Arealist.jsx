import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddArea from "./Forms/AreaForm";
import Modal from "./UpdateModal";
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
  const [isLoading, setIsLoading] = useState(true);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityAreaId, setPriorityAreaId] = useState("");
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);

  // Fetch Cities
  const getCity = async () => {
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/city/`);
      if (response.status === 200) {
        const data = await response.json();
        setCityPayload(data?.payload || []);
        setCity(data?.payload.map((item) => item.name) || []);
      } else if (response.status === 401) {
        toast.error("Unauthorized. Please log in again.", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch cities.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  // Fetch Areas
  const getAreas = async (cityName) => {
    setIsLoading(true);
    try {
      let url = `https://backendapi.trakky.in/salons/area/`;
      if (cityName) url += `?city=${cityName}`;

      const response = await fetch(url);
      if (response.status === 200) {
        const data = await response.json();
        setAreaData(data.payload || []);
      } else if (response.status === 401) {
        toast.error("Unauthorized access.", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to fetch areas.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Area
  const deleteArea = async (id) => {
    try {
      await confirm({ description: "Are you sure you want to delete this Area?" });
      const response = await fetch(`https://backendapi.trakky.in/salons/area/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });

      if (response.status === 204) {
        toast.success("Area Deleted Successfully", {
          style: { background: "#22c55e", color: "#fff" },
        });
        getAreas(selectedCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Error Deleting Area", {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      if (error === "cancel") return;
      toast.error("Error: " + error.message, {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  // Update Priority
  const handleUpdatePriority = async (id, priority) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/area/${id}/update-priority/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ priority: parseInt(priority) }),
      });

      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          style: { background: "#22c55e", color: "#fff" },
        });
        getAreas(selectedCity);
      } else {
        toast.error(`Error: ${res.status}`, {
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`, {
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      setNewPriority("");
      setPriorityAreaId("");
      setShowEditPriorityModal(false);
      setIsLoading(false);
    }
  };

  // Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(areaData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));
    setAreaData(updatedItems);

    const newPriority = result.destination.index + 1;
    await handleUpdatePriority(reorderedItem.id, newPriority);
  };

  // Filter by search
  useEffect(() => {
    const filtered = areaData.filter((area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAreas(filtered);
  }, [searchTerm, areaData]);

  // Initial loads
  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    getAreas(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (updateFormOpened === null) {
      getAreas(selectedCity);
    }
  }, [updateFormOpened]);

  const headers = selectedCity
    ? ["Change Priority", "Priority", "Area Name", "City", "Actions"]
    : ["Priority", "Area Name", "City", "Actions"];

  const displayData = searchTerm ? filteredAreas : areaData;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Areas</h1>
                <p className="mt-1 text-sm text-gray-600">Manage areas by city with drag & drop priority</p>
              </div>
              <Link to="/addarea">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Area
                </button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex gap-3">
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    label="City"
                    disabled={isLoading}
                  >
                    <MenuItem value=""><em>All Cities</em></MenuItem>
                    {city.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search areas..."
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
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-gray-600">Loading areas...</p>
                </div>
              </div>
            )}

            {selectedCity ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="areas">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={isLoading ? "opacity-50" : ""}>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {headers.map((h) => (
                              <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {displayData.length > 0 ? (
                            displayData.map((area, index) => (
                              <Draggable key={area.id} draggableId={area.id.toString()} index={index} isDragDisabled={isLoading}>
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={snapshot.isDragging ? "bg-gray-50" : ""}
                                    style={{
                                      ...provided.draggableProps.style,
                                      backgroundColor: snapshot.isDragging ? "#f4f4f4" : "#fff",
                                    }}
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <button
                                        onClick={() => {
                                          setPriorityAreaId(area.id);
                                          setNewPriority(area.priority);
                                          setShowEditPriorityModal(true);
                                        }}
                                        disabled={isLoading}
                                        className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                        title="Change Priority"
                                      >
                                        <LowPriorityIcon className="w-5 h-5" />
                                      </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        #{area.priority}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{area.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{area.city_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                        <button onClick={() => deleteArea(area.id)} disabled={isLoading} className="text-Red-600 hover:text-red-800 disabled:opacity-50" title="Delete">
                                          <AiFillDelete className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setUpdateFormOpened(index)} disabled={isLoading} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50" title="Edit">
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
                              <td colSpan={headers.length} className="p-8 text-center text-gray-500">
                                {searchTerm ? `No areas found for "${searchTerm}"` : "No areas in this city"}
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
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {displayData.length > 0 ? (
                    displayData.map((area, index) => (
                      <tr key={area.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            #{area.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{area.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{area.city_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button onClick={() => deleteArea(area.id)} disabled={isLoading} className="text-red-600 hover:text-red-800 disabled:opacity-50">
                              <AiFillDelete className="w-5 h-5" />
                            </button>
                            <button onClick={() => setUpdateFormOpened(index)} disabled={isLoading} className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
                              <FaEdit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headers.length} className="p-8 text-center text-gray-500">
                        {searchTerm ? `No areas found for "${searchTerm}"` : "No areas available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Inline Edit Modal Row */}
            {updateFormOpened !== null && (
              <tr>
                <td colSpan={headers.length} className="p-0 bg-gray-50">
                  <Modal closeModal={() => setUpdateFormOpened(null)}>
                    <AddArea
                      areaData={displayData[updateFormOpened]}
                      setAreaData={(updatedArea) => {
                        setAreaData((prev) =>
                          prev.map((a) => (a.id === updatedArea.id ? updatedArea : a))
                        );
                        setUpdateFormOpened(null);
                      }}
                    />
                  </Modal>
                </td>
              </tr>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-sm text-gray-600">
            Showing 1 to {displayData.length} of {areaData.length} entries
          </div>
        </div>
      </div>

      {/* Priority Modal */}
      <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
        <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Update Priority</h3>
          <div className="flex justify-center mb-6">
            <input
              type="number"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
              onKeyDown={(e) => ["ArrowUp", "ArrowDown"].includes(e.key) && e.preventDefault()}
              placeholder="Enter priority"
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
              onClick={() => handleUpdatePriority(priorityAreaId, newPriority)}
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

export default Arealist;