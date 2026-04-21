import React, { useEffect, useState, useContext, useCallback } from "react";
import "./Settings.css";
import AuthContext from "../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CircularProgress from "@mui/material/CircularProgress"; // Corrected import
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

const SettingsManager = () => {
  const { authTokens } = useContext(AuthContext);
  const [managers, setManagers] = useState([]);
  const [newManagerName, setNewManagerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = "https://backendapi.trakky.in/spavendor/manager/";

  const fetchManagers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const responseData = await response.json();
        setManagers(responseData);
      } else {
        toast.error("Failed to fetch managers. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      console.error("Fetch managers error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authTokens]);

  useEffect(() => {
    if (authTokens) {
      fetchManagers();
    }
  }, [authTokens, fetchManagers]);

  const handleAddManager = async () => {
    if (!newManagerName.trim()) {
      toast.error("Please enter a manager name");
      return;
    }

    setIsAdding(true);
    const managerData = { managername: newManagerName.trim() };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(managerData),
      });

      if (response.ok) {
        toast.success(`${newManagerName.trim()} added successfully`);
        setNewManagerName("");
        await fetchManagers();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to add manager");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Add manager error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteManager = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(`${name} deleted successfully`);
        await fetchManagers();
      } else {
        toast.error("Failed to delete manager. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Delete manager error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddManager();
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200  p-8 w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 rounded-full">
              <PeopleAltRoundedIcon className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manager Management</h2>
              <p className="text-gray-600 text-sm">Add and manage your managers</p>
            </div>
          </div>

          {/* Add Manager Form */}
          <div className="mb-8">
            <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-2">
              Add New Manager
            </label>
            <div className="flex shadow-sm rounded-lg overflow-hidden">
              <input
                type="text"
                id="managerName"
                value={newManagerName}
                onChange={(e) => setNewManagerName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter manager name"
                className="flex-grow px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isAdding}
              />
              <button
                onClick={handleAddManager}
                disabled={isAdding || !newManagerName.trim()}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 font-medium rounded-r-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAdding ? (
                  <CircularProgress size={20} className="text-white" />
                ) : (
                  <>
                    <PersonAddAltRoundedIcon />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter or click Add to save
            </p>
          </div>

          {/* Managers List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Current Managers</h3>
              <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                {managers.length} managers
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CircularProgress className="text-indigo-600 mb-4" size={40} />
                <p className="text-gray-600">Loading managers...</p>
              </div>
            ) : managers.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {manager.managername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{manager.managername}</p>
                        <p className="text-xs text-gray-500">ID: {manager.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteManager(manager.id, manager.managername)}
                      disabled={deletingId === manager.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      aria-label={`Delete ${manager.managername}`}
                    >
                      {deletingId === manager.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteRoundedIcon />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                <PeopleAltRoundedIcon className="text-gray-400 text-4xl mb-4 mx-auto" />
                <h4 className="text-gray-500 font-medium mb-2">No managers yet</h4>
                <p className="text-gray-400 text-sm">Add your first manager using the form above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;