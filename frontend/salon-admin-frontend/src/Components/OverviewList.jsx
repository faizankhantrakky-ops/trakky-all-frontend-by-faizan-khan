import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddArea from "./Forms/AreaForm";
import Modal from "./UpdateModal";
import "./css/salonelist.css";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddOverview from "./Forms/OverviewForm";

const OverviewList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [overviewData, setOverviewData] = useState([]);
  const [filteredOverview, setFilteredOverview] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (updateFormOpened === null) {
      getOverviews();
    }
  }, [updateFormOpened]);

  const deleteOverview = async (id) => {
    try {
      await confirm({
        description: `Are you sure you want to delete this Overview?`,
      });

      let url = `https://backendapi.trakky.in/salons/overviews/${id}/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("Overview Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#FFFFFF",
          },
        });
        getOverviews();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error("Error Deleting Overview", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#FFFFFF",
          },
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error("Error Deleting Area : " + error, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#FFFFFF",
        },
      });
    }
  };

  const getOverviews = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/overviews/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        setOverviewData(data);
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
      toast.error("Failed to fetch areas. Please try again later.", {
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

  const tableHeaders = ["Index", "Overview Name", "Actions"];

  useEffect(() => {
    setFilteredOverview(
      overviewData?.filter((ove) => {
        return ove?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, overviewData]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search name here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/add-master-overview">
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
                    <th key={index} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchTerm ? (
                  filteredOverview.length !== 0 ? (
                    filteredOverview.map((area, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}. </td>
                          <td>{area.name}</td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={area.image}
                              alt="overview"
                              style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteOverview(area.id)}
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
                          {updateFormOpened === index && (
                            <tr>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(null)}
                                >
                                  <AddOverview
                                    handleClose={() => setUpdateFormOpened(null)}
                                    overviewData={area}
                                    setOverviewData={(updatedOverview) => {
                                      setOverviewData(
                                        overviewData?.map((area) =>
                                          area.id === updatedOverview.id
                                            ? updatedOverview
                                            : area
                                        )
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                  />
                                </Modal>
                              </td>
                            </tr>
                          )}
                        </tr>
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
                ) : overviewData?.length > 0 ? (
                  overviewData?.map((area, index) => (
                    <tr key={index}>
                      <td>{index + 1}. </td>
                      <td>{area.name}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={area.image}
                          alt="overview"
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>
                        <AiFillDelete
                          onClick={() => deleteOverview(area.id)}
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
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddOverview
                                handleClose={() => setUpdateFormOpened(null)}
                                overviewData={area}
                                setOverviewData={(updatedOverview) => {
                                  setOverviewData(
                                    overviewData?.map((area) =>
                                      area.id === updatedOverview.id
                                        ? updatedOverview
                                        : area
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </tr>
                  ))
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {filteredOverview?.length} of {overviewData?.length || 0} entries
          </div>
        </div>
      </div>

    </>
  );
};

export default OverviewList;
