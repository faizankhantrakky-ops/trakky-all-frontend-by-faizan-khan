import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterServiceForm from "./Forms/MasterService";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

import "./css/spaelist.css";

const MasterServiceList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [masterServicesData, setmasterServicesData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredServices, setfilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getServices = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spas/masterservice/",
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
        setmasterServicesData(data.results);
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
      toast.error("Failed to fetch services. Please try again later", {
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

  const deleteServices = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this service?",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/spas/masterservice/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Service Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        getServices();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Service Not Deleted ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined) {
        return;
      }
      toast.error(`Service Not Deleted ${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const tableHeaders = [
    "Priority",
    // "Shift Priority",
    "Service Name",
    "Description",
    "Image",
    "Action",
  ];

  useEffect(() => {
    setfilteredServices(
      masterServicesData.filter((service) => {
        return service.service_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  // const handleUpdatePriority = async (id, priority) => {
  //   try {
  //     let res = await fetch(
  //       `https://backendapi.trakky.in/salons/masterservice/${id}/update-priority/`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + `${authTokens.access}`,
  //         },
  //         body: JSON.stringify({
  //           priority: parseInt(priority),
  //         }),
  //       }
  //     );
  //     let data = await res.json();
  //     if (res.status === 200) {
  //       toast.success("Priority Updated Successfully", {
  //         duration: 4000,
  //         position: "top-center",
  //         style: {
  //           background: "#333",
  //           color: "#fff",
  //         },
  //       });
  //       setNewPriority(null);
  //       setPriorityMasterServiceId(null);
  //       getServices();
  //     } else {
  //       toast.error(`Something Went Wrong ${res.status}`);
  //       setNewPriority(null);
  //       setPriorityMasterServiceId(null);
  //     }
  //   } catch (err) {
  //     toast.error(`Error : ${err}`, {
  //       duration: 4000,
  //       position: "top-center",
  //     });
  //     setNewPriority(null);
  //     setPriorityMasterServiceId(null);
  //   }
  // };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select>
                  <option selected>Search Service</option>
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
              <Link to="/addmasterservices">
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
                  filteredServices.length !== 0 ? (
                    filteredServices.map((service, index) => {
                      return (
                        <>
                          <tr>
                            <td>{service.priority}</td>
                            {/* <td>
                              <LowPriorityIcon
                                onClick={() => {
                                  setPriorityMasterServiceId(service.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td> */}
                            <td>{service.service_name}</td>
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: service.description,
                                }}
                              />
                            </td>
                            <td>
                              {service?.service_image ? (
                                <img
                                  src={service.service_image}
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
                            {/* <td>{service?.description}</td> */}

                            <td>
                              <AiFillDelete
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteServices(service.id)}
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
                                  <MasterServiceForm
                                    masterServiceData={service}
                                    setMasterServiceData={(data) => {
                                      setmasterServicesData(
                                        masterServicesData.map((service) =>
                                          service.id === data.id
                                            ? data
                                            : service
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
                ) : masterServicesData.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={5}>
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
                  masterServicesData?.map((service, index) => {
                    return (
                      <>
                        <tr>
                          <td>{service.priority}</td>
                          {/* <td>
                            <LowPriorityIcon
                              onClick={() => {
                                setPriorityMasterServiceId(service.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td> */}
                          <td>{service.service_name}</td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: service.description,
                              }}
                            />
                          </td>
                          <td>
                              {service?.service_image ? (
                                <img
                                  src={service.service_image}
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
                          {/* <td>{service?.description}</td> */}
                          <td>
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteServices(service.id)}
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
                                <MasterServiceForm
                                  masterServiceData={service}
                                  setMasterServiceData={(data) => {
                                    setmasterServicesData(
                                      masterServicesData.map((service) =>
                                        service.id === data.id ? data : service
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
            showing 1 to {masterServicesData.length} of{" "}
            {masterServicesData.length} entries
          </div>
        </div>
      </div>
      {/* <GeneralModal
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
                handleUpdatePriority(priorityMasterServiceId, newPriority);
                setShowEditPriorityModal(false);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </GeneralModal> */}
    </>
  );
};

export default MasterServiceList;
