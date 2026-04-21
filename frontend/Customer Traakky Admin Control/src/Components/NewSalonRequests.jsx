import React from "react";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
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
        // Initially, filtered salons are the same as all salons
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
    // Reset search when page changes
    if (isSearchApplied) {
      setIsSearchApplied(false);
      setSearchTerm("");
    }
  }, [page]);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleDelete = async (salonId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to move this salon to trash?"
      );
      if (!confirmed) {
        toast.error("Cancelled !!", {
          duration: 1000,
          position: "top-center",
        });
        return; // User cancelled the operation
      }

      const response = await fetch(
        `https://backendapi.trakky.in/salons/register-salon/${salonId}/soft-delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Salon moved to trash successfully!");
        // Update both the main list and filtered list
        const updatedSalons = pendingSalon.filter((salon) => salon.id !== salonId);
        setPendingSalon(updatedSalons);
        setFilteredSalons(filteredSalons.filter((salon) => salon.id !== salonId));
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
      // If search term is empty, reset to show all salons
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
        // case "owner_name":
        //   return salon.owner_name.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });

    setFilteredSalons(results);
    setIsSearchApplied(true);

    // Show toast notification based on results
    if (results.length === 0) {
      toast.info("No matching salons found", {
        duration: 2000,
        position: "top-center",
      });
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

  // Allow search to be triggered by pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input" style={{ display: "flex", alignItems: "center", padding: "15px 0" }}>
            <div className="tb-body-src-fil" style={{ display: "flex", alignItems: "center" }}>
              <div className="tb-body-filter" style={{ marginRight: "10px" }}>
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    height: "38px",
                  }}
                >
                  <option value="salon_name">Search by Salon Name</option>
                  <option value="city">Search by City</option>
                  {/* <option value="owner_name">Search by Owner Name</option> */}
                </select>
              </div>
              <div className="tb-body-search" style={{ display: "flex", alignItems: "center" }}>
                <div className="tb-search-field" style={{ position: "relative", marginRight: "10px" }}>
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                  />
                  <input
                    type="text"
                    name="search-inp"
                    value={searchTerm}
                    placeholder={`Search by ${searchOption === "salon_name" ? "salon name" : searchOption === "city" ? "city" : "owner name"}...`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                      padding: "8px 10px 8px 35px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      width: "250px",
                      height: "38px",
                    }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    height: "38px",
                    marginRight: "10px",
                  }}
                >
                  Search
                </button>
                {isSearchApplied && (
                  <button
                    onClick={handleClearSearch}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      height: "38px",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "0px",
              }}
            >
              <Link to="/trash">
                <button
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f44336",
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    height: "38px",
                  }}
                >
                  <AiFillDelete style={{ marginRight: "5px" }} />
                  <div>View Trash</div>
                </button>
              </Link>
            </div>
          </div>
          <div className="tb-row-data">
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
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
                  {filteredSalons.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={9}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            textAlign: "center",
                            padding: "20px 0",
                          }}
                        >
                          {isSearchApplied ? "No results found" : "No Entries"}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSalons.map((salon) => (
                      <tr key={salon?.id}>
                        <td>{formatDateTime(salon?.created_at)}</td>
                        <td>{salon?.salon_name}</td>
                        <td>{salon?.salon_contact_number}</td>
                        <td>{salon?.owner_name}</td>
                        <td>{salon?.owner_contact_number}</td>
                        <td>{salon?.whatsapp_number}</td>
                        <td>{salon?.address}</td>
                        <td>{salon?.city}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => handleDelete(salon.id)}
                            style={{ cursor: "pointer", color: "red" }}
                            size={20}
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
            {isSearchApplied ?
              `Showing ${filteredSalons.length} filtered results` :
              `Showing 1 to ${filteredSalons.length} of ${pendingSalonData?.count || 0} entries`
            }
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id="1" onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={page - 1} onClick={handlePageChange}>
                  «
                </span>
              )}
              {page > 2 && (
                <span id={page - 2} onClick={handlePageChange}>
                  {page - 2}
                </span>
              )}
              {page > 1 && (
                <span id={page - 1} onClick={handlePageChange}>
                  {page - 1}
                </span>
              )}
              <span
                id={page}
                onClick={handlePageChange}
                className="active"
              >
                {page}
              </span>
              {page < totalPages && (
                <span id={page + 1} onClick={handlePageChange}>
                  {page + 1}
                </span>
              )}
              {page < totalPages - 1 && (
                <span id={page + 2} onClick={handlePageChange}>
                  {page + 2}
                </span>
              )}
              {page < totalPages && (
                <span id={page + 1} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={totalPages} onClick={handlePageChange}>
                »»
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewSalonRequests;