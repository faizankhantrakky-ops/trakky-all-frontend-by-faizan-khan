import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddCityPageOffer3 from "./Forms/AddCityPageOffer3";
import "./css/spaelist.css";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const CityPageOffer3 = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [offersData, setoffersData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredOffers, setfilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getOffers = async () => {
    try {
      let url = "https://backendapi.trakky.in/spas/city-offer-3/";
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

      let res = await fetch(
        `https://backendapi.trakky.in/spas/city-offer-3/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

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
        toast.error("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (err) {
      if (err === undefined) {
        toast.error(`Something Went Wrong`, {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
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
    "Index",
    "Spa Name",
    "Spa Slug",
    "Spa City",
    "Spa Area",
    "Spa Profile Offer Name",
    "Offer Image",
    "Action",
  ];

  useEffect(() => {
    setfilteredOffers(
      offersData.filter((offer) => {
        return offer.spa_name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

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
              ></div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    value={searchTerm}
                    type="text"
                    name="search-inp"
                    placeholder="Search Spa Name .."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addcitypageoffer3 ">
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
                            <td>{index + 1}</td>
                            <td>{offer.spa_name || "-"}</td>
                            <td>{offer.spa_slug || "-"}</td>
                            <td>{offer.spa_city || "-"}</td>
                            <td>{offer?.spa_area ? offer.spa_area : "-"}</td>
                            <td>{offer?.spa_profile_offer_name || "-"}</td>
                            <td>
                              {offer?.offer_img ? (
                                <img
                                  src={offer.offer_img}
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
                          {updateFormOpened === index && (
                            <tr>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(null)}
                                >
                                  <AddCityPageOffer3
                                    cityOfferData={offer}
                                    setCityOfferData={(data) => {
                                      setoffersData(
                                        offersData.map((offer) =>
                                          offer.id === data.id ? data : offer
                                        )
                                      );
                                      setUpdateFormOpened(null);
                                      setSearchTerm("");
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
                          <td>{index + 1}</td>
                          <td>{offer.spa_name || "-"}</td>
                          <td>{offer.spa_slug || "-"}</td>
                          <td>{offer.spa_city || "-"}</td>
                          <td>{offer?.spa_area ? offer.spa_area : "-"}</td>
                          <td>{offer?.spa_profile_offer_name || "-"}</td>
                          <td>
                            {offer?.offer_img ? (
                              <img
                                src={offer.offer_img}
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
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <AddCityPageOffer3
                                  cityOfferData={offer}
                                  setCityOfferData={(data) => {
                                    setoffersData(
                                      offersData.map((offer) =>
                                        offer.id === data.id ? data : offer
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                    setSearchTerm("");
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
                        No Entries
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
        </div>
      </div>
    </>
  );
};

export default CityPageOffer3;
