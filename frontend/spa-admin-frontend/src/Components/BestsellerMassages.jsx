import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddBestsellerMassage from "./Forms/AddBestsellerMassage";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

import "./css/spaelist.css";

const BestsellerMassages = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [bestSeller, setBestseller] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredBestSeller, setFilteredBestseller] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getBestseller = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/best-sellar-massage/",
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
        setBestseller(data);
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
      toast.error("Failed to fetch. Please try again later", {
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

  const deleteBestseller = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this bestseller?",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spas/best-sellar-massage/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getBestseller();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Not Deleted ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined) {
        return;
      }
      toast.error(`Not Deleted ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getBestseller();
  }, []);

  const tableHeaders = [
    "Index",
    "Spa Name",
    "City",
    "Name",
    "Description",
    "Price",
    "Image",
    "Action",
  ];

  //   useEffect(() => {
  //     setFilteredBestseller(
  //       bestSeller.filter((bestseller) => {
  //         return bestseller.name.toLowerCase().includes(searchTerm.toLowerCase());
  //       })
  //     );
  //   }, [searchTerm]);

  const [searchOption, setSearchOption] = useState("Search Spa");

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  const handleSearch = () => {
    const filteredData = bestSeller.filter((bestSeller) => {
      switch (searchOption) {
        case "Search Spa":
          return bestSeller.spa_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search Name":
          return bestSeller.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        case "Search City":
          return bestSeller.spa_city
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredBestseller(filteredData);
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
              <Link to="/addbestsellermassages">
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
                  filteredBestSeller.length !== 0 ? (
                    filteredBestSeller.map((bestseller, index) => {
                      return (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{bestseller.spa_name}</td>
                            <td>{bestseller.spa_city}</td>
                            <td>{bestseller.name}</td>
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: bestseller.description,
                                }}
                              />
                            </td>
                            <td>{bestseller.price}</td>
                            <td>
                              {bestseller?.image ? (
                                <img
                                  src={bestseller.image}
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
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteBestseller(bestseller.id)}
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
                                  <AddBestsellerMassage
                                    bestSellerData={bestseller}
                                    setBestSellerData={(data) => {
                                      setFilteredBestseller(
                                        filteredBestSeller.map((bestseller) =>
                                          bestseller.id === data.id
                                            ? data
                                            : bestseller
                                        )
                                      );
                                      setBestseller(
                                        bestSeller.map((bestseller) =>
                                          bestseller.id === data.id
                                            ? data
                                            : bestseller
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
                      <td colSpan={8}>
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
                ) : bestSeller.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={8}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Not Entries
                      </div>
                    </td>
                  </tr>
                ) : (
                  bestSeller?.map((bestseller, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{bestseller.spa_name}</td>
                          <td>{bestseller.spa_city}</td>
                          <td>{bestseller.name}</td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: bestseller.description,
                              }}
                            />
                          </td>
                          <td>{bestseller.price}</td>
                          <td>
                            {bestseller?.image ? (
                              <img
                                src={bestseller.image}
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
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteBestseller(bestseller.id)}
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
                                <AddBestsellerMassage
                                  bestSellerData={bestseller}
                                  setBestSellerData={(data) => {
                                    setBestseller(
                                      bestSeller.map((bestseller) =>
                                        bestseller.id === data.id
                                          ? data
                                          : bestseller
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {bestSeller.length} of {bestSeller.length} entries
          </div>
        </div>
      </div>
    </>
  );
};

export default BestsellerMassages;
