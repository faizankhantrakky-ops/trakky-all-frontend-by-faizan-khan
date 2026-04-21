import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import AddPrimaryCityOffers from "./Forms/AddPrimaryCityOffers";
import "./css/salonelist.css";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalModal/GeneralModal";

import { useConfirm } from "material-ui-confirm";

const PrimaryCityOffers = () => {
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

  useEffect(() => {
    getOffers();
  }, [updateFormOpened]);

  const getOffers = async (selectedCity) => {
    let url = "https://backendapi.trakky.in/salons/salon-city-offer/";

    if (selectedCity !== "" && selectedCity !== undefined) {
      url = url + `?city=${selectedCity}`;
    }

    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setoffersData(data);
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
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers. Please try again later", {
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
        description: "Are you sure you want to delete this offer?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/salon-city-offer/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Offer Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        getOffers(selectedCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancle") {
        return;
      }
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const tableHeaders = [
    "Priority",
    "Offer Name",
    "Salon Name",
    "City",
    "Area",
    "Slug",
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
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) => alert(err));
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
        `https://backendapi.trakky.in/salons/salon-city-offer/${id}/update-priority/`,
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
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityOfferId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
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
                    placeholder="search name.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* <div>
                  <button type="submit">Search</button>
                </div> */}
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addcityOffers">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="pl-6">
            <p className="text-gray-500 font-bold">(Note : First select the City then you will uapdate the priority)</p>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={header === "Address" ? "address-field-s" : ""}
                  >
                    {header}
                  </th>
                ))}
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
                            <td>
                              {Object.values(offer.salon_name).join(", ")}
                            </td>
                            <td>{offer.city ? offer.city : "-"}</td>
                            <td>{offer.area ? offer.area : "-"}</td>
                            <td>{offer.slug}</td>
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
                                <img src={offer.offer_image} alt="" />
                              </div>
                            </div>
                          ) : null}
                          {updateFormOpened === index && (
                            <tr>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(null)}
                                >
                                  <AddPrimaryCityOffers
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
                          <td>{Object.values(offer.salon_name).join(", ")}</td>
                          <td>{offer.city ? offer.city : "-"}</td>
                          <td>{offer.area ? offer.area : "-"}</td>
                          <td>{offer.slug}</td>
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
                              <img src={offer.offer_image} alt="" />
                            </div>
                          </div>
                        ) : null}
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddPrimaryCityOffers
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

                {/* {
                                    (offersData).map(
                                        (offer, index) => {
                                            return (<>
                                                < tr >
                                                    <td>{offer.priority}</td>
                                                    <td>{offer.name}</td>
                                                    <td>{Object.values(offer.salon_names).join(', ')}</td>
                                                    <td>{offer.slug}</td>
                                                    <td>  {isDropdown !== index ? (
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
                                                    )}</td>
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
                                                </tr >
                                                {expandedRow === index ? (
                                                    <div className="more_salon_detail__container">
                                                        <div className="image__container">
                                                            <img src={offer.offer_image} alt="" />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {
                                                    updateFormOpened === index && (
                                                        <tr>
                                                            <td style={{padding:0}}>
                                                                <Modal closeModal={() => setUpdateFormOpened(null)}>
                                                                    <AddOffer offerData={offer} setOfferData = {
                                                                        (data) => {
                                                                            setoffersData(offersData.map((offer) => offer.id === data.id ? data : offer));
                                                                            setUpdateFormOpened(null);
                                                                        }

                                                                    } />
                                                                </Modal>
                                                        
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </>
                                            );
                                        }
                                    )
                                } */}
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
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                }
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

export default PrimaryCityOffers;
