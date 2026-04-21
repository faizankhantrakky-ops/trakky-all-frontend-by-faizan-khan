import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

import { Link } from "react-router-dom";
// import AddService from "./Forms/ServiceForm";
import MasterServiceForm from "./Forms/MasterServiceForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";

import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";

import LowPriorityIcon from "@mui/icons-material/LowPriority";

import GeneralModal from "./generalModal/GeneralModal";

import "./css/salonelist.css";

const MasterServices = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [masterServicesData, setmasterServicesData] = useState([]);
  const [masterServices, setmasterServices] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  // const [masterCategoryData, setmasterCategoryData] = useState([]);
  const [filteredCategory, setfilteredCategory] = useState([]);
  const [filteredServices, setfilteredServices] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("service_name");

  // priority change
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityMasterServiceId, setPriorityMasterServiceId] = useState("");

  const [page, setPage] = useState(1);
  const masterServicesPerPage = 50;
  const totalPages = Math.ceil(
    masterServicesData?.count / masterServicesPerPage
  );

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [salonByServiceLoading, setSalonByServiceLoading] = useState(false);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  useEffect(() => {
    if (searchTerm !== "") {
      handleSearch();
    } else {
      getServices();
    }
  }, [page]);

  const getServices = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterservice/?page=${page}`,
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
        setmasterServicesData(data);
        setmasterServices(data.results);
        console.log("seach : ", masterServices);
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
      console.error("Error fetching services:", error);
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
        `https://backendapi.trakky.in/salons/masterservice/${id}/`,
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

  const tableHeaders = [
    "Priority",
    "Shift Priority",
    "Service Name",
    "category name",
    "gender",
    "Image",
    "Salon Name",
    "description",
    "Action",
  ];
  // useEffect(() => {
  //   if (updateFormOpened === null) {
  //     getMasterCategory();
  //   }
  // }, [updateFormOpened]);


  useEffect(() => {
    const filtered = masterServices.filter((service) => {
      // Filter by search term
      const matchesSearch = service.service_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by gender
      const matchesGender =
        genderFilter === "all" ||
        service.gender === genderFilter.toLowerCase();

      return matchesSearch && matchesGender;
    });

    setfilteredCategory(filtered);
  }, [searchTerm, genderFilter, masterServices]);

  const handleSearch = async () => {
    let url = `https://backendapi.trakky.in/salons/masterservice/?page=${page}`;

    // Add the appropriate search parameter based on the selected search type
    if (searchTerm.trim() !== "") {
      if (searchType === "service_name") {
        url += `&service_name=${searchTerm.trim()}`;
        // } else if (searchType === "category_name") {
        //   url += `&category__name=${searchTerm.trim()}`;
      }
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setmasterServicesData(data);
        setmasterServices(data.results);
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
      console.error("Error occurred during search:", error);
      toast.error("Failed to perform search. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      console.log("search : ", masterServices, "searchterm : ", searchTerm, "searchtype : ", searchType);
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      let res = await fetch(
        `https://backendapi.trakky.in/salons/masterservice/${id}/update-priority/`,
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
        setPriorityMasterServiceId(null);
        getServices();
      } else {
        toast.error(`Something Went Wrong ${res.status}`);
        setNewPriority(null);
        setPriorityMasterServiceId(null);
      }
    } catch (err) {
      toast.error(`Error : ${err}`, {
        duration: 4000,
        position: "top-center",
      });
      setNewPriority(null);
      setPriorityMasterServiceId(null);
    }
  };

  const handleGetSalonByMasterService = async (id) => {
    setSalonByServiceLoading(true);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/unique-salons/?master_service_id=${id}`,
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
        setModalData(data);
        setShowModal(true);
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching salons:", error);
      toast.error("Failed to fetch salons. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setSalonByServiceLoading(false);
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
                <select onChange={(e) => setSearchType(e.target.value)}>
                  <option value="service_name">Search Service</option>
                  {/* <option value="category_name">Search Category</option> */}
                  {/* <option value="gender">Search Gender</option> */}
                </select>
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
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder={`Search ${searchType === "service_name" ? "service" : "gender"}...`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    onClick={
                      page === 1
                        ? handleSearch
                        : () => {
                          setPage(1);
                        }
                    }
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/masterservicesform">
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
                {searchTerm || genderFilter !== "all" ? (
                  filteredCategory.length !== 0 ? (
                    filteredCategory.map((service, index) => {
                      return (
                        <>
                          <tr>
                            <td>{service.priority}</td>
                            <td>
                              <LowPriorityIcon
                                onClick={() => {
                                  setPriorityMasterServiceId(service.id);
                                  setShowEditPriorityModal(true);
                                }}
                              />
                            </td>
                            <td>{service.service_name}</td>
                            <td>{service.category.name}</td>
                            <td>{service.gender}</td>
                            <td>
                              {service?.service_image ? (
                                <img
                                  src={service.service_image}
                                  alt="service"
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
                              <span
                                className="view-icon"
                                onClick={() => {
                                  handleGetSalonByMasterService(service.id);
                                  setShowModal(true);
                                }}
                              >
                                <FaInfoCircle />
                              </span>
                            </td>
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: service.description,
                                }}
                              />
                            </td>

                            <td>
                              <AiFillDelete
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
                                      setmasterServices(
                                        masterServices.map((service) =>
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
                  masterServices?.map((service, index) => {
                    return (
                      <>
                        <tr>
                          <td>{service.priority}</td>
                          <td>
                            <LowPriorityIcon
                              onClick={() => {
                                setPriorityMasterServiceId(service.id);
                                setShowEditPriorityModal(true);
                              }}
                            />
                          </td>
                          <td>{service.service_name}</td>
                          <td>{service.category?.name}</td>
                          <td>{service.gender}</td>
                          <td>
                            {service?.service_image ? (
                              <img
                                src={service.service_image}
                                alt="service"
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
                            <span
                              className="view-icon cursor-pointer"
                              onClick={() => {
                                handleGetSalonByMasterService(service.id);
                                setShowModal(true);
                              }}
                            >
                              <FaInfoCircle />
                            </span>
                          </td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: service.description,
                              }}
                            />
                          </td>
                          <td>
                            <AiFillDelete
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
                                    setmasterServices(
                                      masterServices.map((service) =>
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
            Showing {50 * (page - 1) + 1} to{" "}
            {50 * (page - 1) + (searchTerm || genderFilter !== "all" ? filteredCategory.length : masterServices?.length)} of{" "}
            {searchTerm || genderFilter !== "all" ? filteredCategory.length : masterServicesData?.count} entries
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id={parseInt(1)} onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  «
                </span>
              )}
              {page > 2 && (
                <span id={parseInt(page - 2)} onClick={handlePageChange}>
                  {page - 2}
                </span>
              )}
              {page > 1 && (
                <span id={parseInt(page - 1)} onClick={handlePageChange}>
                  {page - 1}
                </span>
              )}
              <span
                id={parseInt(page)}
                onClick={handlePageChange}
                className="active"
              >
                {page}
              </span>
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  {page + 1}
                </span>
              )}
              {page < totalPages - 1 && (
                <span id={parseInt(page + 2)} onClick={handlePageChange}>
                  {page + 2}
                </span>
              )}
              {page < totalPages && (
                <span id={parseInt(page + 1)} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={parseInt(totalPages)} onClick={handlePageChange}>
                »»
              </span>
            </div>
          </div>
        </div>
      </div>
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div>
          <h2 className="RI-modal-salon-dht">Salons</h2>
        </div>
        {salonByServiceLoading ? (
          <div className="RI-modal-salon-table">
            <table className=" w-full">
              <tr>
                <td className="RI-modal-salon-table-td text-center w-full">
                  Loading...
                </td>
              </tr>
            </table>
          </div>
        ) : modalData && modalData.length !== 0 ? (
          modalData?.map((item, index) => (
            <div className="RI-modal-salon-table">
              <table>
                <tr>
                  <th>{index + 1}.</th>
                  <td className="RI-modal-salon-table-td">
                    {item?.name} ( {item?.area} - {item?.city} )
                  </td>
                </tr>
              </table>
            </div>
          ))
        ) : (
          <div className="RI-modal-salon-table">
            <table className=" w-full">
              <tr>
                <td className="RI-modal-salon-table-td text-center w-full">
                  No Salon Found
                </td>
              </tr>
            </table>
          </div>
        )}
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
                handleUpdatePriority(priorityMasterServiceId, newPriority);
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

export default MasterServices;