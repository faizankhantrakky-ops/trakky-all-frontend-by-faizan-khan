import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

const Ratings = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("Seach Phone Number");

  /* --------------------------------------------------------------
     API – GET RATINGS (unchanged)
  -------------------------------------------------------------- */
  useEffect(() => {
    getRatings();
  }, []);

  const getRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/ratings/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setRatings(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to fetch ratings. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------------
     API – DELETE RATING (unchanged)
  -------------------------------------------------------------- */
  const deleteRating = async (ratingId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/ratings/${ratingId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setRatings(ratings.filter((p) => p.id !== ratingId));
        toast.success("Deleted Successfully!", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
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

  /* --------------------------------------------------------------
     SEARCH LOGIC (unchanged)
  -------------------------------------------------------------- */
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    const filtered = ratings.filter((rating) => {
      const phoneNumberMatch =
        typeof rating.phone_no === "string" && rating.phone_no !== null
          ? rating.phone_no.toLowerCase().includes(searchTerm.toLowerCase())
          : typeof rating.phone_no === "number" &&
            rating.phone_no.toString().includes(searchTerm.toLowerCase());

      const ratingMatch = rating.rating.toString().includes(searchTerm);

      switch (searchOption) {
        case "Seach Phone Number":
          return phoneNumberMatch;
        case "Search Rating":
          return ratingMatch;
        default:
          return true;
      }
    });

    setFilteredRatings(filtered);
  };

  const tableHeaders = ["Rating", "Phone Number", "Action"];

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-3 font-sans antialiased">
        {/* Full-Width Card */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header + Search */}
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Ratings Management
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Option */}
                <div className="w-full sm:w-48">
                  <select
                    value={searchOption}
                    onChange={(e) => setSearchOption(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="Seach Phone Number">Search by Phone</option>
                    <option value="Search Rating">Search by Rating</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={searchOption === "Search Rating" ? "number" : "text"}
                      value={searchTerm}
                      placeholder={
                        searchOption === "Search Rating"
                          ? "Search by rating (e.g. 4, 5)"
                          : "Search by phone number..."
                      }
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                          <p className="text-sm font-medium">Loading ratings...</p>
                        </div>
                      </td>
                    </tr>
                  ) : searchTerm !== "" ? (
                    filteredRatings.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                            <p className="text-base font-medium">No results found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRatings.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {r.rating}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {r?.phone_no || "Not available"}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => deleteRating(r.id)}
                              className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                              title="Delete Rating"
                            >
                              <AiFillDelete className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : ratings.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">No ratings found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    ratings.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {r.rating}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {r?.phone_no || "Not available"}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => deleteRating(r.id)}
                            className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Delete Rating"
                          >
                            <AiFillDelete className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Ratings: <strong>{ratings.length}</strong>
                {searchTerm && (
                  <> | Matches: <strong>{filteredRatings.length}</strong></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ratings;