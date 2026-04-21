import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import AddNationalHeroOffers from "./Forms/AddNationalHeroOffers";
import Modal from "./UpdateModal";
import "./css/salonelist.css";

const NationalHeroOffers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nationalHeroOffers, setNationalHeroOffers] = useState([]);
  const [filteredNationalHeroOffers, setFilteredNationalHeroOffers] = useState(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (updateFormOpened === null) {
      getNationalHeroOffers();
    }
  }, [updateFormOpened]);

  const getNationalHeroOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/national-hero-offers/`,
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
        console.log("API Response:", data);
        setNationalHeroOffers(data);
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

  const deleteOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/national-hero-offers/${offerId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        setNationalHeroOffers(
          nationalHeroOffers.filter((p) => p.id !== offerId)
        );
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
    "Priority",
    "Salon Name",
    "City",
    "Image",
    // "Video",
    // "Video thumbnail",
    "Is National?",
    "Action",
  ];

  const [searchOption, setSearchOption] = useState("Search City");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    // Filter nationalHeroOffers based on the search term and selected option
    const filteredNationalHeroOffers = nationalHeroOffers.filter((service) => {
      switch (searchOption) {
        case "Search City":
          return service.city.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return true; // Return true for unknown search option
      }
    });
    setFilteredNationalHeroOffers(filteredNationalHeroOffers);
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
                  <option value="Search City">Search City</option>
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
              <Link to="/addnationalherooffers">
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
                  filteredNationalHeroOffers.length === 0 ? (
                    <tr className="not-found">
                      <td colSpan={4}>
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
                    filteredNationalHeroOffers.map((service, index) => (
                      <>
                        <tr key={index}>
                          <td>{service.priority}</td>
                          <td>{service.salon_name}</td>
                          <td>{service.city}</td>
                          <td>
                            {service?.image ? (
                              <img
                                src={service.image}
                                alt="category"
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
                          {/* <td>
                            {service.video ? (
                              <video width="120" height="80" controls>
                                <source src={service.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              "No Video"
                            )}
                          </td>
                          <td>
                            {service?.video_thumbnail_image ? (
                              <img src={service.video_thumbnail_image} alt="thumbnail" style={{ width: "80px", height: "80px" }} />
                            ) : (
                              "No Video thumbnail"
                            )}
                          </td> */}
                          <td>{service?.is_national ? "Yes" : "No"}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteOffer(service.id)}
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
                                <AddNationalHeroOffers
                                  nationalHeroOfferData={service}
                                  setNationalHeroOfferData={(data) => {
                                    setNationalHeroOffers(
                                      nationalHeroOffers.map((service) =>
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
                  )
                ) : nationalHeroOffers.length !== 0 ? (
                  nationalHeroOffers.map((service, index) => (
                    <>
                      <tr key={index}>
                        <td>{service.priority}</td>
                        <td>{service.salon_name}</td>
                        <td>{service.city}</td>
                        <td>
                          {service?.image ? (
                            <img
                              src={service.image}
                              alt="category"
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
                        {/* <td>
                          {service.video ? (
                            <video width="120" height="80" controls>
                              <source src={service.video} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            "No Video"
                          )}
                        </td>
                        <td>
                          {service.video_thumbnail_image ? (
                            <img src={service.video_thumbnail_image} alt="thumbnail" style={{ width: "80px", height: "80px" }} />
                          ) : (
                            "No Video thumbnail"
                          )}
                        </td> */}
                        <td>{service?.is_national ? "Yes" : "No"}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteOffer(service.id)}
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
                              <AddNationalHeroOffers
                                nationalHeroOfferData={service}
                                setNationalHeroOfferData={(data) => {
                                  setNationalHeroOffers(
                                    nationalHeroOffers.map((service) =>
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
                ) : (
                  <tr className="not-found">
                    <td colSpan={4}>
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
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NationalHeroOffers;
