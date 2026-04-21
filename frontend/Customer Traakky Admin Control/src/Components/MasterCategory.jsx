import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";

import "./css/salonelist.css";
// import AddCategory from "./Forms/CategoryForm";

import MasterCategoryForm from "./Forms/MasterCategoryForm";

import AuthContext from "../Context/AuthContext";

import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import GeneralModal from "./generalModal/GeneralModal";

const MasterCategory = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [masterCategoryData, setmasterCategoryData] = useState([]);
  const [filteredCategory, setfilteredCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name"); // Default filter is name
  const [genderFilter, setGenderFilter] = useState("all"); // New state for gender filter

  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityMasterCategoryId, setPriorityMasterCategoryId] = useState("");

  const getMasterCategory = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/mastercategory/",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setmasterCategoryData(data);
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
      console.error("Error fetching master categories:", error);
      toast.error("Failed to fetch master categories. Please try again later", {
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

  const deleteMasterCategory = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this category?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/mastercategory/${id}/`,
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
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        getMasterCategory();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong : ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === "cancel" || error === undefined) return;

      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (updateFormOpened === null) {
      getMasterCategory();
    }
  }, [updateFormOpened]);

  useEffect(() => {
    setfilteredCategory(
      masterCategoryData.filter((category) => {
        // Filter by search term
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by gender
        const matchesGender = genderFilter === "all" || category.gender === genderFilter;

        return matchesSearch && matchesGender;
      })
    );
  }, [masterCategoryData]);

  const tableHeaders = [
    "Priority",
    "Shift Priority",
    "Name",
    "Gender",
    "Image",
    "Actions",
  ];

  // Updated filter function combining search term and gender filter
  useEffect(() => {
    setfilteredCategory(
      masterCategoryData.filter((category) => {
        // Filter by search term
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by gender
        const matchesGender = genderFilter === "all" || category.gender === genderFilter.toLowerCase();

        return matchesSearch && matchesGender;
      })
    );
  }, [searchTerm, genderFilter, masterCategoryData]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/mastercategory/${id}/update-priority/`,
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
        setPriorityMasterCategoryId(null);
        getMasterCategory();
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityMasterCategoryId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setPriorityMasterCategoryId(null);
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
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="name">Search by Name</option>
                  {/* <option value="gender">Search by Gender</option> */}
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    value={searchTerm}
                    type="text"
                    name="search-inp"
                    placeholder={`Search by ${selectedFilter}...`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {/* Gender Filter Dropdown */}
              <div className="tb-body-filter" style={{ marginLeft: "10px" }}>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  {/* <option value="Unisex">Unisex</option> */}
                </select>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/mastercategoryform">
                <button type="submit">
                  <AddIcon />
                  <salonn> Add Item</salonn>
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
                {searchTerm || genderFilter !== "all" ? (
                  filteredCategory.length !== 0 ? (
                    filteredCategory.map((category, index) => (
                      <>
                        <tr key={category.id}>
                          <td>{category.priority}</td>
                          <td>
                            <LowPriorityIcon
                              onClick={() => {
                                setPriorityMasterCategoryId(category.id);
                                setShowEditPriorityModal(true);
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                          <td>{category.name}</td>
                          <td>{category.gender}</td>
                          <td>
                            {category?.mastercategory_image ? (
                              <img
                                src={category.mastercategory_image}
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
                              onClick={() => deleteMasterCategory(category.id)}
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
                          <div className="more_salon_detail__container">
                            <div className="image__container">
                              <img src={category.image_url} alt="" />
                            </div>
                          </div>
                        ) : null}
                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(null)}
                              >
                                <MasterCategoryForm
                                  masterCategoryData={category}
                                  setMasterCategoryData={(data) => {
                                    setmasterCategoryData(
                                      masterCategoryData.map((item) =>
                                        item.id === category.id ? data : item
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
                      <td colSpan={6}>
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
                  masterCategoryData.map((category, index) => (
                    <>
                      <tr key={category.id}>
                        <td>{category.priority}</td>
                        <td>
                          <LowPriorityIcon
                            onClick={() => {
                              setPriorityMasterCategoryId(category.id);
                              setShowEditPriorityModal(true);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td>{category.name}</td>
                        <td>{category.gender}</td>
                        <td>
                          {category?.mastercategory_image ? (
                            <img
                              src={category.mastercategory_image}
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
                            onClick={() => deleteMasterCategory(category.id)}
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
                        <div className="more_salon_detail__container">
                          <div className="image__container">
                            <img src={category.image_url} alt="" />
                          </div>
                        </div>
                      ) : null}
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <MasterCategoryForm
                                masterCategoryData={category}
                                setmasterCategoryData={(data) => {
                                  setmasterCategoryData(
                                    masterCategoryData.map((item) =>
                                      item.id === category.id ? data : item
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
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {filteredCategory.length > 0 ? filteredCategory.length : masterCategoryData.length} of{" "}
            {masterCategoryData.length} entries
          </div>
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
                handleUpdatePriority(priorityMasterCategoryId, newPriority);
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

export default MasterCategory;