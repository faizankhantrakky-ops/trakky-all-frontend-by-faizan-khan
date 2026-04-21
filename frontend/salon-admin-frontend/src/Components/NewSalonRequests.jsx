import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

const NewSalonRequests = () => {
  const tableHeaders = [
    "Created At",
    "Salon Name",
    "Salon Contact Number",
    "Owner Name",
    "Owner Contact Number",
    "Whatsapp Number",
    "Address",
    "City",
    "Action",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSalonData, setPendingSalonData] = useState(null);
  const [pendingSalon, setPendingSalon] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [searchOption, setSearchOption] = useState("salon_name");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const spasPerPage = 12;
  const totalPages = Math.ceil(pendingSalonData?.count / spasPerPage) || 1;

  const getPendingSalon = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/?page=${page}`
      );

      if (response.ok) {
        const data = await response.json();
        setPendingSalonData(data);
        setPendingSalon(data?.results || []);
        if (!isSearchApplied) {
          setFilteredSalons(data?.results || []);
        }
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching pending salon:", error);
      toast.error("Failed to fetch pending salon. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPendingSalon();
  }, [page]);

  useEffect(() => {
    if (isSearchApplied) {
      setIsSearchApplied(false);
      setSearchTerm("");
    }
  }, [page]);

  const handlePageChange = (e) => {
    const selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleDelete = async (salonId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to move this salon to trash?"
      );
      if (!confirmed) {
        toast.error("Cancelled !!", { duration: 1000, position: "top-center" });
        return;
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/${salonId}/soft-delete/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        toast.success("Salon moved to trash successfully!");
        const updated = pendingSalon.filter((s) => s.id !== salonId);
        setPendingSalon(updated);
        setFilteredSalons(filteredSalons.filter((s) => s.id !== salonId));
      } else {
        throw new Error("Failed to move salon to trash");
      }
    } catch (error) {
      console.error("Error deleting salon:", error);
      toast.error("Failed to move salon to trash. Please try again later", {
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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredSalons(pendingSalon);
      setIsSearchApplied(false);
      return;
    }

    const searchValue = searchTerm.toLowerCase().trim();
    const results = pendingSalon.filter((salon) => {
      switch (searchOption) {
        case "salon_name":
          return salon.salon_name.toLowerCase().includes(searchValue);
        case "city":
          return salon.city.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });

    setFilteredSalons(results);
    setIsSearchApplied(true);

    if (results.length === 0) {
      toast.info("No matching salons found", { duration: 2000, position: "top-center" });
    } else {
      toast.success(`Found ${results.length} matching ${results.length === 1 ? 'salon' : 'salons'}`, {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredSalons(pendingSalon);
    setIsSearchApplied(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-3 ">

          {/* === PROFESSIONAL HEADER === */}
          <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
            <div className="px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  New Salon Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all pending salon registration requests
                </p>
              </div>
              <Link to="/trash">
                <button className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  <AiFillDelete className="w-5 h-5" />
                  View Trash
                </button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
         <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6 -mt-1 border-t border-gray-200">
  <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">

    {/* Dropdown - 40% */}
    <select
      value={searchOption}
      onChange={(e) => setSearchOption(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                 text-sm w-full lg:w-[40%]"
    >
      <option value="salon_name">Search by Salon Name</option>
      <option value="city">Search by City</option>
    </select>

    {/* Search Section - 60% */}
    <div className="flex-1 lg:w-[60%] flex gap-2">
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Search by ${searchOption === "salon_name" ? "salon name" : "city"}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>

      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
      >
        Search
      </button>

      {isSearchApplied && (
        <button
          onClick={handleClearSearch}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
        >
          Clear
        </button>
      )}
    </div>
  </div>
</div>


          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading salons...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header, index) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            header === "Address" ? "max-w-xs" : ""
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSalons.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                          <div className="text-lg font-medium">
                            {isSearchApplied ? "No results found" : "No pending salon requests"}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSalons.map((salon) => (
                        <tr key={salon.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(salon.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {salon.salon_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.salon_contact_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.owner_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.owner_contact_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.whatsapp_number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {salon.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {salon.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDelete(salon.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Move to Trash"
                            >
                              <AiFillDelete className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer: Results & Pagination */}
          <div className="bg-white rounded-lg shadow-sm px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                {isSearchApplied
                  ? `Showing ${filteredSalons.length} filtered result${filteredSalons.length !== 1 ? 's' : ''}`
                  : `Showing 1 to ${Math.min(filteredSalons.length, spasPerPage)} of ${pendingSalonData?.count || 0} entries`}
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="1"
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  First
                </button>

                {page > 1 && (
                  <button
                    id={page - 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Prev
                  </button>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, page - 2) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      id={pageNum}
                      onClick={handlePageChange}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        pageNum === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {page < totalPages && (
                  <button
                    id={page + 1}
                    onClick={handlePageChange}
                    className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                )}

                <button
                  id={totalPages}
                  onClick={handlePageChange}
                  className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSalonRequests;