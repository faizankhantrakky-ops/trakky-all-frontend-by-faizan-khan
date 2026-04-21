import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./css/salonelist.css";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from 'react-hot-toast';
import { useConfirm } from "material-ui-confirm";
import GeneralModal from "./generalModal/GeneralModal";
import AddNationalCategory from "./Forms/AddNationalCategory";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

const ListNationalCategory = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDropdown, setIsDropdown] = useState(null);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [filteredCategories, setfilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState(null);
  const [priorityOfferId, setPriorityOfferId] = useState(null);

  const getCategories = () => {
    fetch("https://backendapi.trakky.in/salons/national-category/")
      .then((res) => res.json())
      .then((data) => {
        setCategoriesData(data);
      })
      .catch((err) => {
        toast.error(`Error : ${err}`, {
          duration: 4000,
          position: "top-center",
        })
      });
  };

  const deleteCategory = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this category?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salons/national-category/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        });

      if (response.status === 204) {
        toast.success("Category Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getCategories();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    }
    catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error(`Something went wrong`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const tableHeaders = [
    "Priority",
    "Update Priority",
    "Category Name",
    "More",
    "Action",
  ];

  useEffect(() => {
    setfilteredCategories(
      categoriesData.filter((Category) => {
        return Category.title.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, categoriesData]);

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/national-category/${id}/update-priority/`,
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
        getCategories();
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
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categoriesData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the new order
    setCategoriesData(items);

    // Update the priority of the dragged item
    const draggedItemId = result.draggableId;
    const newPriority = result.destination.index + 1;
    await handleUpdatePriority(draggedItemId, newPriority);
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
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addnationalcategory">
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="tb-row-data">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <table
                    className="tb-table"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <thead>
                      <tr>
                        {tableHeaders.map((header, index) => (
                          <th key={index} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {searchTerm ? (
                        filteredCategories.length !== 0 ? (
                          filteredCategories.map((Category, index) => (
                            <Draggable
                              key={Category.id}
                              draggableId={Category.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <React.Fragment>
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}

                                    style={{
                                      ...provided.draggableProps.style,
                                      backgroundColor: snapshot.isDragging
                                        ? "#f4f4f4"
                                        : "#fff",
                                      boxShadow: snapshot.isDragging
                                        ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                                        : "none",
                                      ...(snapshot.isDragging && { height: provided.draggableProps.style.height }),

                                      display: snapshot.isDragging ? "flex" : "",
                                      justifyContent: snapshot.isDragging ? "space-between" : "",
                                      alignItems: snapshot.isDragging ? "center" : "",
                                    }}

                                  >
                                    <td>{Category.priority}</td>
                                    <td>
                                      <LowPriorityIcon
                                        onClick={() => {
                                          setPriorityOfferId(Category.id);
                                          setShowEditPriorityModal(true);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      />
                                    </td>
                                    <td>{Category.title}</td>
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
                                        onClick={() => deleteCategory(Category.id)}
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      />
                                      &nbsp;&nbsp;
                                      <FaEdit
                                        onClick={() => {
                                          setEditCategoryData(Category);
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
                                        <img src={Category.image} alt="" />
                                      </div>
                                    </div>
                                  ) : null}
                                </React.Fragment>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <tr className="not-found">
                            <td colSpan={5}>
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
                        categoriesData.map((Category, index) => (
                          <Draggable
                            key={Category.id}
                            draggableId={Category.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <React.Fragment>
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}

                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: snapshot.isDragging
                                      ? "#f4f4f4"
                                      : "#fff",
                                    boxShadow: snapshot.isDragging
                                      ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                                      : "none",
                                    ...(snapshot.isDragging && { height: provided.draggableProps.style.height }),

                                    display: snapshot.isDragging ? "flex" : "",
                                    justifyContent: snapshot.isDragging ? "space-between" : "",
                                    alignItems: snapshot.isDragging ? "center" : "",
                                  }}
                                >
                                  <td>{Category.priority}</td>
                                  <td>
                                    <LowPriorityIcon
                                      onClick={() => {
                                        setPriorityOfferId(Category.id);
                                        setShowEditPriorityModal(true);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    />
                                  </td>
                                  <td>{Category.title}</td>
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
                                      onClick={() => deleteCategory(Category.id)}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    />
                                    &nbsp;&nbsp;
                                    <FaEdit
                                      onClick={() => {
                                        setEditCategoryData(Category);
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
                                      <img src={Category.image} alt="" />
                                    </div>
                                  </div>
                                ) : null}
                              </React.Fragment>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {categoriesData.length} of {categoriesData.length} entries
          </div>
        </div>
      </div>
      <GeneralModal open={showEditModal} handleClose={() => setShowEditModal(false)}>
        <AddNationalCategory categoryData={editCategoryData} closeModal={() => setShowEditModal(false)} updateCategory={() => { getCategories() }} />
      </GeneralModal>
      <GeneralModal
        open={showEditPriorityModal}
        handleClose={() => setShowEditPriorityModal(false)}
      >
        <div style={{
          backgroundColor: "#fff",
          padding: "20px 0",
        }}>
          <center style={{
            fontSize: "1.1rem",
            fontWeight: "600"
          }}>Update Priority</center>
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
              style={{ width: "200px" }}
              onWheel={() => document.activeElement.blur()}
              onKeyDownCapture={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                }
              }}
            />
          </div>
          <div className="submit-btn row" style={{
            padding: "0 0 20px 0",
            margin: "0"
          }}>
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

export default ListNationalCategory;
