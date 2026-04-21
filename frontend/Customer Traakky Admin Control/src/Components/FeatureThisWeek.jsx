import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import AddFeatureThisWeek from "./Forms/AddFeatureThisWeek";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import "./css/salonelist.css";

const FeatureThisWeek = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [filteredFeatured, setFilteredFeatured] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  useEffect(() => {
    if (updateFormOpened === null) {
      getFeatured();
    }
  }, [updateFormOpened]);

  const getFeatured = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/feature-this-week/`,
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
        setFeatured(data);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/feature-this-week/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setFeatured(featured.filter((p) => p.id !== id));
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

  const tableHeaders = [
    "Salon Name",
    "Salon Image",
    "City",
    "Area",
    "Salon Offer Tag",
    "Custom Offer Tag",
    "Action",
  ];

  const [searchOption, setSearchOption] = useState("Search Salon Name");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    // Filter featured based on the search term and selected option
    const filteredFeature = featured.filter((service) => {
      switch (searchOption) {
        case "Search City":
          return service.salon_city
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search Salon Name":
          return service.salon_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true; // Return true for unknown search option
      }
    });
    setFilteredFeatured(filteredFeature);
  };
  console.log("Featured:", featured);
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
                  <option value="Search City">Search City</option>
                  <option value="Search Salon Name">Search Salon Name</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    value={searchTerm}
                    placeholder="search hear.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addfeaturedthisweek">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
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
                  filteredFeatured.length === 0 ? (
                    <>
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
                    </>
                  ) : (
                    filteredFeatured.map((service, index) => (
                      <>
                        <tr key={index}>
                          <td>{service.salon_name}</td>
                          <td>
                            {service?.salon_image ? (
                              <img
                                src={service.salon_image}
                                alt="salon_image"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  borderRadius: "5px",
                                  objectFit: "contain",
                                  margin: "0 auto",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td>{service.salon_city}</td>
                          <td>{service.salon_area}</td>
                          <td>{service.salon_offer_tag}</td>
                          <td>{service.custom_offer_tag}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => handleDelete(service.id)}
                              style={{ cursor: "pointer" }}
                            />
                            &nbsp;&nbsp;
                            <FaEdit
                              onClick={() => setUpdateFormOpened(index)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddFeatureThisWeek
                                  featured={service}
                                  setFeatured={(data) => {
                                    setFeatured(
                                      featured.map((service) =>
                                        service.id === data.id ? data : service
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )
                ) : featured.length === 0 ? (
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
                  featured.map((service, index) => (
                    <>
                      <tr key={index}>
                        <td>{service.salon_name}</td>
                        <td>
                          {service?.salon_image ? (
                            <img
                              src={service.salon_image}
                              alt="salon_image"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "5px",
                                objectFit: "contain",
                                margin: "0 auto",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{service.salon_city}</td>
                        <td>{service.salon_area}</td>
                        <td>{service.salon_offer_tag}</td>
                        <td>{service.custom_offer_tag}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => handleDelete(service.id)}
                            style={{ cursor: "pointer" }}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setUpdateFormOpened(index)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddFeatureThisWeek
                                featured={service}
                                setFeatured={(data) => {
                                  setFeatured(
                                    featured.map((service) =>
                                      service.id === data.id ? data : service
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                                closeModal={() => setUpdateFormOpened(null)}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
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

export default FeatureThisWeek;
