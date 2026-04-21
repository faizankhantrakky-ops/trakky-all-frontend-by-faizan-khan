import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

const CollaboratedSalons = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collaboratedSalons, setCollaboratedSalons] = useState([]);
  const [filteredCollaboratedSalons, setFilteredCollaboratedSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("Search Salon");

  useEffect(() => {
    getCollaboratedSalons();
  }, []);

  const getCollaboratedSalons = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setCollaboratedSalons(data);
        setFilteredCollaboratedSalons(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching collaborated salons:", error);
      toast.error("Failed to fetch salons. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCollaboratedSalons = async (collaboratedId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this collaboration?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/collaborated/${collaboratedId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        const updated = collaboratedSalons.filter((p) => p.id !== collaboratedId);
        setCollaboratedSalons(updated);
        setFilteredCollaboratedSalons(updated);
        toast.success("Deleted Successfully!", {
          duration: 4000,
          position: "top-center",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      } else if (response.status === 401) {
        logoutUser();
      } else {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, {
        duration: 4000,
        position: "top-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    }
  };

  // Real-time Search
  useEffect(() => {
    const filtered = collaboratedSalons.filter((salon) => {
      const searchValue = searchTerm.toLowerCase().trim();
      if (!searchValue) return true;

      switch (searchOption) {
        case "Search Salon":
          return salon.salon.name.toLowerCase().includes(searchValue);
        case "Search Area":
          return salon.salon.area.toLowerCase().includes(searchValue);
        case "Search City":
          return salon.salon.city.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });
    setFilteredCollaboratedSalons(filtered);
  }, [searchTerm, searchOption, collaboratedSalons]);

  const tableHeaders = ["Index", "Salon Name", "City", "Area", "Slug", "Action"];

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3">

          {/* === PROFESSIONAL HEADER === */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Collaborated Salons
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage salons with active collaborations
                </p>
              </div>
              <Link to="/addcollaborated">
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Collaboration
                </button>
              </Link>
            </div>
          </div>

          {/* === SEARCH BAR – 40% Select | 60% Input === */}
          <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6 -mt-1 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 40% → Select */}
              <div className="lg:col-span-5">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="Search Salon">Search by Salon</option>
                  <option value="Search Area">Search by Area</option>
                  <option value="Search City">Search by City</option>
                </select>
              </div>

              {/* 60% → Search Input */}
              <div className="lg:col-span-7">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${searchOption.replace("Search ", "").toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === TABLE WITH CIRCULAR LOADER === */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                {/* Circular Spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading collaborations...</p>
              </div>
            ) : filteredCollaboratedSalons.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="text-lg font-medium">
                  {searchTerm ? "No results found" : "No collaborated salons"}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCollaboratedSalons.map((service, index) => (
                      <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.salon.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {service.salon.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {service.salon.area}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                          {service.salon.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => deleteCollaboratedSalons(service.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Collaboration"
                          >
                            <AiFillDelete className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* === FOOTER === */}
          <div className="mt-6 bg-white rounded-lg shadow-sm px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing {filteredCollaboratedSalons.length} of {collaboratedSalons.length} collaboration{collaboratedSalons.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaboratedSalons;