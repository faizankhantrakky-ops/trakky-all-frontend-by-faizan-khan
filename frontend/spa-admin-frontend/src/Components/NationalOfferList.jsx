import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import "./css/spaelist.css";
import AuthContext from "../Context/AuthContext";

import toast, { Toaster } from "react-hot-toast";
import GeneralModal from "./generalmodal/GeneralModal";
import AddNationalOffer from "./Forms/NationalOfferForm";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

import { useConfirm } from "material-ui-confirm";

const NationalOfferList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [offersData, setoffersData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editOfferData, setEditOfferData] = useState(null);

  const [filteredOffers, setfilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState(null);
  const [priorityOfferId, setPriorityOfferId] = useState(null);

  const getOffers = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/national-offers/"
      );
      if (response.ok) {
        const data = await response.json();
        setoffersData(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
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
        description: "This will delete the offer",
      });

      let res = await fetch(
        `https://backendapi.trakky.in/spas/national-offers/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 204) {
        toast.success("offer Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getOffers();
      } else if (res.status === 401) {
        alert("you are logged out");
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
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  const tableHeaders = [
    "Priority",
    "Update Priority",
    "Offer Title",
    "More",
    "Action",
  ];

  useEffect(() => {
    setfilteredOffers(
      offersData.filter((offer) => {
        return offer.title.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/spas/national-offers/${id}/update-priority/`,
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
        toast.success("Priority Updated Successfully.", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        setNewPriority(null);
        setPriorityOfferId(null);
        getOffers();
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
              <div className="tb-body-filter">
                <select>
                  <option>Name</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* <div>
                  <button type="submit">Search</button>
                </div> */}
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addnationaloffer">
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
                {tableHeaders.map((header, index) => (
                  <th key={index} scope="col">
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
                            <td>{offer.priority}</td>
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setPriorityOfferId(offer.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                            <td>{offer.title}</td>
                            <td>
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
                                onClick={() => {
                                  setEditOfferData(offer);
                                  setShowEditModal(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                          </tr>
                          {expandedRow === index ? (
                            <div className="more_spa_detail__container">
                              <div className="image__container">
                                <img src={offer.image} alt="" />
                              </div>
                            </div>
                          ) : null}
                        </>
                      );
                    })
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
                          Not Found
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  offersData.map((offer, index) => {
                    return (
                      <>
                        <tr>
                          <td>{offer.priority}</td>
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityOfferId(offer.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                          <td>{offer.title}</td>
                          <td>
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
                              onClick={() => {
                                setEditOfferData(offer);
                                setShowEditModal(true);
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                        {expandedRow === index ? (
                          <div className="more_spa_detail__container">
                            <div className="image__container">
                              <img src={offer.image} alt="" />
                            </div>
                          </div>
                        ) : null}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {offersData.length} of {offersData.length} entries
          </div>
        </div>
      </div>
      <GeneralModal
        open={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <AddNationalOffer
          offerData={editOfferData}
          closeModal={() => setShowEditModal(false)}
          updateOffer={() => {
            getOffers();
          }}
        />
      </GeneralModal>
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

export default NationalOfferList;
