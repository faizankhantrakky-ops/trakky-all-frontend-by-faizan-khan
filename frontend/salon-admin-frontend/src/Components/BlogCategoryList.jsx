import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import GeneralModal from "../Components/generalModal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import "./css/salonelist.css";
import "./css/category.css";
import BlogCategory from "./Forms/BlogCategory";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const BlogCategoryList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [CategoryData, setCategoryData] = useState([]);
  const [filteredCategory, setfilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      } else if (response.status === 401) {
        // Unauthorized access
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        // Other errors
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch city data. Please try again later.", {
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

  const getCategory = async (selectedCity) => {
    try {
      let url = `https://backendapi.trakky.in/salons/blogcategory/`;

      if (selectedCity !== "" && selectedCity !== undefined) {
        url = url + `?city=${selectedCity}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          // Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setCategoryData(data.results);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories. Please try again later.", {
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

  const deleteCategory = (id) => {
    try {
      fetch(`https://backendapi.trakky.in/salons/blogcategory/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (result) => {
          if (result.status === 204) {
            toast.success("Category Deleted Successfully", {
              duration: 4000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            getCategory();
          } else if (result.status === 401) {
            // Unauthorized access
            toast.error("You're logged out", {
              duration: 4000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            logoutUser();
          } else {
            const resp = await result.json();
            if (
              resp.detail === "Authentication credentials were not provided."
            ) {
              toast.error("You're logged out", {
                duration: 4000,
                position: "top-center",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
              logoutUser();
            } else {
              getCategory();
              alert("Category Deleted Successfully");
            }
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete category. Please try again later.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category. Please try again later.", {
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
    getCategory();
  }, []);

  useEffect(() => {
    getCategory(selectedCity);
  }, [selectedCity]);

  const tableHeaders = ["Name", "Slug", "City", "Actions"];

  useEffect(() => {
    // setfilteredCategory(
    //   CategoryData?.filter((spa) => {
    //     return spa.name.toLowerCase().includes(searchTerm.toLowerCase());
    //   })
    // );
    setfilteredCategory(
      CategoryData?.filter((spa) => {
        return spa.name?.toLowerCase().includes(searchTerm.toLowerCase());
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
                    placeholder="search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <button type="submit">Search</button>
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addblogcategory">
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
                  filteredCategory?.length !== 0 ? (
                    filteredCategory.map((category, index) => (
                      <>
                        <tr>
                          <td>{category.name}</td>
                          <td>{category.slug}</td>
                          <td>{category.city ? category.city : "-"}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteCategory(category.id)}
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
                                <BlogCategory
                                  CategoryData={category}
                                  setCategoryData={(data) => {
                                    setCategoryData(
                                      CategoryData.map((item) =>
                                        item.id === category.id ? data : item
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
                ) : (
                  CategoryData?.map((category, index) => (
                    <>
                      <tr>
                        <td>{category.name}</td>
                        <td>{category.slug}</td>
                        <td>{category.city ? category.city : "-"}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteCategory(category.id)}
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
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <BlogCategory
                                CategoryData={category}
                                setCategoryData={(data) => {
                                  setCategoryData(
                                    CategoryData?.map((item) =>
                                      item.id === category.id ? data : item
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {CategoryData.length} of {CategoryData.length} entries
          </div>
        </div>
      </div>
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div>
          <h2 className="RI-modal-salon-dht">Salons</h2>
        </div>
      </GeneralModal>
    </>
  );
};

export default BlogCategoryList;
