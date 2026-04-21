import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddSpaProfileOffer from "./Forms/AddSpaProfileOffer";
import "./css/spaelist.css";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const SpaProfileOffers = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [profileOffers, setProfileOffers] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredOffers, setfilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getProfileOffers = async () => {
    try {
      let url = "https://backendapi.trakky.in/spas/spa-profile-page-offer/";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProfileOffers(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in getProfileOffers : ", error);
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

  const deleteProfileOffer = async (id) => {
    try {
      await confirm({
        description: "This will delete the profileOffer permanently",
      });

      let res = await fetch(
        `https://backendapi.trakky.in/spas/spa-profile-page-offer/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 204) {
        toast.success("Profile Offer Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getProfileOffers();
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
    getProfileOffers();
  }, [updateFormOpened]);

  const tableHeaders = [
    "Profile Offer Name",
    "Spa Name",
    "Slug",
    "City",
    "Area",
    "Offer Type",
    "Offer Percentage",
    "Discounted Price",
    "Massage",
    "Massage Price",
    "Terms & Conditions",
    "Coupan Code",
    "How to Avail",
    "Action",
  ];

  useEffect(() => {
    setfilteredOffers(
      profileOffers.filter((profileOffer) => {
        return profileOffer.offer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  const [searchOption, setSearchOption] = useState("Search Spa");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    const filteredData = profileOffers.filter((profileOffers) => {
      switch (searchOption) {
        case "Search Spa":
          return profileOffers.spa_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search Name":
          return profileOffers.offer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search City":
          return profileOffers.spa_city
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setfilteredOffers(filteredData);
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
                  <option value="Search Spa">Search Spa</option>
                  <option value="Search Name">Search Name</option>
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
              <Link to="/addprofileoffer">
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
                    filteredOffers.map((profileOffer, index) => {
                      return (
                        <>
                          <tr>
                            <td>{profileOffer.offer_name || "-"}</td>
                            <td>{profileOffer.spa_name || "-"}</td>
                            <td>{profileOffer.spa_slug || "-"}</td>
                            <td>{profileOffer.spa_city || "-"}</td>
                            <td>
                              {profileOffer?.spa_area
                                ? profileOffer.spa_area
                                : "-"}
                            </td>
                            <td>{profileOffer.offer_type || "-"}</td>
                            <td>{profileOffer.offer_percentage || "-"}</td>
                            <td>{profileOffer.discount_price || "-"}</td>
                            <td>
                              {profileOffer.massage_details?.service_names ||
                                "-"}
                            </td>
                            <td>{profileOffer.massage_price || "-"}</td>
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: profileOffer.term_and_condition,
                                }}
                              />
                            </td>
                            <td>{profileOffer.coupon_code || "-"}</td>
                            <td>{profileOffer.how_to_avial || "-"}</td>
                            <td>
                              <AiFillDelete
                                onClick={() =>
                                  deleteProfileOffer(profileOffer.id)
                                }
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
                                  <AddSpaProfileOffer
                                    profileOfferData={profileOffer}
                                    setProfileOfferData={(data) => {
                                      setSearchTerm("");
                                      setfilteredOffers([]);
                                      setProfileOffers(
                                        profileOffers.map((profileOffer) =>
                                          profileOffer.id === data.id
                                            ? data
                                            : profileOffer
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
                ) : profileOffers?.length > 0 ? (
                  profileOffers.map((profileOffer, index) => {
                    return (
                      <>
                        <tr>
                          <td>{profileOffer.offer_name || "-"}</td>
                          <td>{profileOffer.spa_name || "-"}</td>
                          <td>{profileOffer.spa_slug || "-"}</td>
                          <td>{profileOffer.spa_city || "-"}</td>
                          <td>
                            {profileOffer?.spa_area
                              ? profileOffer.spa_area
                              : "-"}
                          </td>
                          <td>{profileOffer.offer_type || "-"}</td>
                          <td>{profileOffer.offer_percentage || "-"}</td>
                          <td>{profileOffer.discount_price || "-"}</td>
                          <td>
                            {profileOffer?.massage_details.service_names || "-"}
                          </td>
                          <td>{profileOffer.massage_price || "-"}</td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: profileOffer.term_and_condition,
                              }}
                            />
                          </td>
                          <td>{profileOffer.coupon_code || "-"}</td>
                          <td>{profileOffer.how_to_avial || "-"}</td>
                          <td>
                            <AiFillDelete
                              onClick={() =>
                                deleteProfileOffer(profileOffer.id)
                              }
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
                                <AddSpaProfileOffer
                                  profileOfferData={profileOffer}
                                  setProfileOfferData={(data) => {
                                    setProfileOffers(
                                      profileOffers.map((profileOffer) =>
                                        profileOffer.id === data.id
                                          ? data
                                          : profileOffer
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
            showing 1 to {profileOffers.length} of {profileOffers.length}{" "}
            entries
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaProfileOffers;
