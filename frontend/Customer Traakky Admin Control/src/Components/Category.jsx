import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import GeneralModal from "../Components/generalModal/GeneralModal";

import "./css/salonelist.css";
import "./css/category.css";
import AddCategory from "./Forms/CategoryForm";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

import toast, { Toaster } from "react-hot-toast";

import { useConfirm } from "material-ui-confirm";

const Category = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [CategoryData, setCategoryData] = useState([]);
  const [filteredCategory, setfilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");

  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityOfferId, setPriorityOfferId] = useState("");

  const getCity = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/city/`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setCityPayload(data?.payload);
      let city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (error) {
      console.error("Network error:", error.message);
      alert("Failed to fetch city data. Please try again later.");
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  const getCategory = async (selectedCity, selectedGender) => {
    try {
      let url = `https://backendapi.trakky.in/salons/category/`;

      // if (selectedCity !== "" && selectedCity !== undefined) {
      //   url = url + `?city=${selectedCity}`;
      // }
      if (selectedCity || selectedGender) {
        url += "?";
        if (selectedCity) url += `city=${selectedCity}&`;
        if (selectedGender) url += `gender=${selectedGender.toLowerCase()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setCategoryData(data);
      } else if (response.status === 401) {
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch category data. Please try again later.", {
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

  // useEffect(() => {
  //   getCategory(selectedCity);
  // }, [selectedCity]);

  useEffect(() => {
    if (selectedCity) {
      setCategoryData([]);
      getCategory(selectedCity, selectedGender);
    }
  }, [selectedCity, selectedGender]);

  const deleteCategory = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this category?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/category/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Category Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getCategory(selectedCity);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong : ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error(`Error : ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getCategory();
  }, []);


  const tableHeaders = [
    "Priority",
    "City",
    "Name",
    "Gender",
    "Slug",
    "Salon Name",
    "Image",
    "Actions",
  ];

  if (selectedCity && selectedCity !== "") {
    tableHeaders.unshift("Change Priority");
  }

  useEffect(() => {
    setfilteredCategory(
      CategoryData?.filter((cat) => {
        return cat?.category_name
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase());
      })
    );
  }, [searchTerm]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/category/${id}/update-priority/`,
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
        getCategory(selectedCity);
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
              <div
                className="tb-body-filter"
                style={{ padding: 0, minWidth: "auto" }}
              >
                <FormControl sx={{ margin: "8px 0", width: 110 }} size="small">
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    value={selectedGender}
                    disabled={!selectedCity}
                    label="Gender"
                    onChange={(e) => setSelectedGender(e.target.value.toLowerCase())}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    {/* <MenuItem value="unisex">Unisex</MenuItem> */}
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
                {/* <div>
                  <button type="submit">Search</button>
                </div> */}
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addcategory">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-start pl-2">
            <p className="text-gray-500 font-bold ">(Note : First select city then you can select gender)</p>

          </div>
          <div className="flex justify-start pl-2">
            <p className="text-gray-500 font-bold">(Note : Please first select city then you can change priority)</p>
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
                  filteredCategory.length !== 0 ? (
                    filteredCategory.map((category, index) => (
                      <>
                        <tr>
                          {selectedCity && selectedCity !== "" && (
                            <td>
                              <LowPriorityIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setPriorityOfferId(category.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                          )}
                          <td>{category.priority}</td>
                          <td>{category.city ? category.city : "-"}</td>
                          <td>{category.category_name || "-"}</td>
                          <td> {category.category_gender || "-"} </td>
                          <td>{category.slug}</td>
                          <td>
                            <span
                              className="view-icon"
                              onClick={() => {
                                setModalData(
                                  Object.values(category?.salon_names).join(
                                    ", "
                                  )
                                );
                                setShowModal(true);
                              }}
                            >
                              <FaInfoCircle />
                            </span>
                          </td>
                          <td>
                            {category?.category_image ? (
                              <img
                                src={category.category_image}
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
                              onClick={() => deleteCategory(Category.id)}
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
                                <AddCategory
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
                        {selectedCity && selectedCity !== "" && (
                          <td>
                            <LowPriorityIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPriorityOfferId(category.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                        )}
                        <td>{category.priority}</td>
                        <td>{category.city ? category.city : "-"}</td>
                        <td>{category.category_name || "-"}</td>
                        <td> {category.category_gender || "-"} </td>
                        <td>{category.slug}</td>
                        <td>
                          <span
                            className="view-icon"
                            onClick={() => {
                              setModalData(
                                Object.values(category.salon_names).join(", ")
                              );
                              setShowModal(true);
                            }}
                          >
                            <FaInfoCircle />
                          </span>
                        </td>
                        <td>
                          {category?.category_image ? (
                            <img
                              src={category.category_image}
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
                              <AddCategory
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
        {modalData &&
          modalData?.split(",").map((item, index) => (
            <div className="RI-modal-salon-table">
              <table>
                <tr>
                  <th>{index + 1}.</th>
                  <td className="RI-modal-salon-table-td">{item}</td>
                </tr>
              </table>
            </div>
          ))}
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

export default Category;
