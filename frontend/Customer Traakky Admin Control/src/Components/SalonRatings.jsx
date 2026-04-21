import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";

import "./css/salonelist.css";

const Ratings = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getRatings();
  }, []);

  const getRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/ratings/`,
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
        setRatings(data);
      } else if (response.status === 401) {
        logoutUser();
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
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

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
        toast.success("Deleted Successfully !!", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
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

  const tableHeaders = ["Rating", "Phone Number", "Action"];

  const [searchOption, setSearchOption] = useState("Seach Phone Number");

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

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option value="Seach Phone Number">Seach Phone Number</option>
                  <option value="Search Rating">Search Rating</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="number"
                    name="search-inp"
                    value={searchTerm}
                    placeholder="search number..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onWheel={() => document.activeElement.blur()}
                    onKeyDownCapture={(event) => {
                      if (
                        event.key === "ArrowUp" ||
                        event.key === "ArrowDown"
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tb-row-data">
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
                ) : searchTerm !== "" ? (
                  filteredRatings.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={17}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          No results found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRatings.map((service, index) => (
                      <>
                        <tr key={index}>
                          <td>{service.rating}</td>
                          <td>{service?.phone_no || "Not available"}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteRating(service.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      </>
                    ))
                  )
                ) : ratings.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No results found
                      </div>
                    </td>
                  </tr>
                ) : (
                  ratings.map((service, index) => (
                    <>
                      <tr key={index}>
                        <td>{service.rating}</td>
                        <td>{service?.phone_no || "Not available"}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteRating(service.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ratings;
