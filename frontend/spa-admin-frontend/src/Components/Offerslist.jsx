import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import AddOffer from "./Forms/OfferForm";
import "./css/spaelist.css";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

import GeneralModal from "./generalmodal/GeneralModal";

const Offerslist = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [offersData, setoffersData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredOffers, setfilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");

  const getOffers = async () => {
    try {
      let url = "https://backendapi.trakky.in/spas/offer/";

      if (selectedCity !== "" && selectedCity !== undefined) {
        url = url + `?city=${selectedCity}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setoffersData(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in getOffers : ", error);
      toast.error(`Error : ${error.message}`, {
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

  const deleteOffer = async (id) => {
    try {
      await confirm({
        description: "This will delete the offer permanently",
      });

      let res = await fetch(`https://backendapi.trakky.in/spas/offer/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        toast.success("Offer Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getOffers();
      } else if (res.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (err) {
      if (err === undefined) return;

      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    getOffers();
  }, [updateFormOpened]);

  const tableHeaders = [
    "Priority",
    "Offer Name",
    "Spa Name",
    "Slug",
    "City",
    "Area",
    "More",
    "Action",
  ];

  useEffect(() => {
    setfilteredOffers(
      offersData.filter((offer) => {
        return offer.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/city/`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in Get City : ", error);
      toast.error(`Error : ${error.message}`, {
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

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    getOffers(selectedCity);
  }, [selectedCity]);

  if (selectedCity && selectedCity !== "") {
    tableHeaders.unshift("Change Priority");
  }

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/offer/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({
            priority: parseInt(priority),
          }),
        }
      );
      let data = await res.json();
      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityOfferId(null);
        getOffers(selectedCity);
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityOfferId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setNewPriority(null);
      setPriorityOfferId(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCity}
                    label="City"
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {city?.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search offer name .."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addoffer">
                {" "}
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
                {searchTerm ? (
                  filteredOffers.length !== 0 ? (
                    filteredOffers.map((offer, index) => {
                      return (
                        <>
                          <tr>
                            {selectedCity && selectedCity !== "" && (
                              <td>
                                <LowPriorityIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setPriorityOfferId(offer.id);
                                    setShowEditPriorityModal(true);
                                  }}
                                />
                              </td>
                            )}
                            <td>{offer.priority}</td>
                            <td>{offer.name}</td>
                            <td>{Object.values(offer.spa_names).join(", ")}</td>
                            <td>{offer.slug}</td>
                            <td>{offer.city}</td>
                            <td>{offer?.area ? offer.area : "-"}</td>
                            <td>
                              {" "}
                              {isDropdown !== index ? (
                                <IoIosArrowDropdown
                                  onClick={() => {
                                    setExpandedRow(index);
                                    setIsDropdown(index);
                                  }}
                                />
                              ) : (
                                <IoIosArrowDropup
                                  onClick={() => {
                                    setExpandedRow(null);
                                    setIsDropdown(null);
                                  }}
                                />
                              )}
                            </td>
                            <td>
                              <AiFillDelete
                                onClick={() => deleteOffer(offer.id)}
                                style={{
                                  cursor: "pointer",
                                }}
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
                          {expandedRow === index ? (
                            <div className="more_spa_detail__container">
                              <div className="image__container">
                                <img src={offer.img_url} alt="" />
                              </div>
                            </div>
                          ) : null}
                          {updateFormOpened === index && (
                            <tr>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(null)}
                                >
                                  <AddOffer
                                    offerData={offer}
                                    setOfferData={(data) => {
                                      setoffersData(
                                        offersData.map((offer) =>
                                          offer.id === data.id ? data : offer
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
                      );
                    })
                  ) : (
                    <tr className="not-found">
                      <td colSpan={17}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          Not Found
                        </div>
                      </td>
                    </tr>
                  )
                ) : offersData?.length > 0 ? (
                  offersData.map((offer, index) => {
                    return (
                      <>
                        <tr>
                          {selectedCity && selectedCity !== "" && (
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setPriorityOfferId(offer.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                          )}
                          <td>{offer.priority}</td>
                          <td>{offer.name}</td>
                          <td>{Object.values(offer.spa_names).join(", ")}</td>
                          <td>{offer.slug}</td>
                          <td>{offer.city}</td>
                          <td>{offer?.area ? offer.area : "-"}</td>
                          <td>
                            {" "}
                            {isDropdown !== index ? (
                              <IoIosArrowDropdown
                                onClick={() => {
                                  setExpandedRow(index);
                                  setIsDropdown(index);
                                }}
                              />
                            ) : (
                              <IoIosArrowDropup
                                onClick={() => {
                                  setExpandedRow(null);
                                  setIsDropdown(null);
                                }}
                              />
                            )}
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteOffer(offer.id)}
                              style={{
                                cursor: "pointer",
                              }}
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
                        {expandedRow === index ? (
                          <div className="more_spa_detail__container">
                            <div className="image__container">
                              <img src={offer.img_url} alt="" />
                            </div>
                          </div>
                        ) : null}
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddOffer
                                  offerData={offer}
                                  setOfferData={(data) => {
                                    setoffersData(
                                      offersData.map((offer) =>
                                        offer.id === data.id ? data : offer
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
                    );
                  })
                ) : (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Not Found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {offersData.length} of {offersData.length} entries
          </div>
          {/* <div className="tb-more-results">
                        <div className="tb-pagination">
                            <a href="#">«</a>
                            <a href="#">1</a>
                            <a href="#">2</a>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a className="active">
                                5
                            </a>
                            <a href="#">6</a>
                            <a href="#">7</a>
                            <a href="#">»</a>
                        </div>
                    </div> */}
        </div>
      </div>
      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => setShowEditPriorityModal(false)}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 0",
          }}
        >
          <center
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Update Priority
          </center>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px  20px",
            }}
          >
            <input
              type="number"
              value={newPriority}
              placeholder="Enter New Priority"
              onChange={(e) => setNewPriority(e.target.value)}
              style={{
                width: "200px",
              }}
            />
          </div>
          <div
            className="submit-btn row"
            style={{
              padding: "0 0 20px 0",
              margin: "0",
            }}
          >
            <button
              onClick={() => {
                handleUpdatePriority(priorityOfferId, newPriority);
                setShowEditPriorityModal(false);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default Offerslist;
