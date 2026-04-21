import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";
import ProductMasterFrom from "./Forms/ProductMasterFrom";
import "./css/salonelist.css";

const ProductMasterList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [productmaster, setProductMaster] = useState([]);
  const [masterProductDetails, setMasterProductDetails] = useState(null);
  // const [searchTerm, setSearchTerm] = useState("");
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [priorityMasterServiceId, setPriorityMasterServiceId] = useState(null);
  const [newPriority, setNewPriority] = useState("");


  const tableHeaders = [
    "Shift Priority",
    "Priority",
    "Name",
    "Slug",
    "Image",
    "Action",
  ];

  const [page, setPage] = useState(1);

  const servicesPerPage = 100;
  const totalPages = Math.ceil(masterProductDetails?.count / servicesPerPage);

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };


  useEffect(() => {
    fetchMasterServices();
  }, [page, searchTerm]);

  const fetchMasterServices = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterproducts/?page=${page}`,
        {
          headers: {
            Authorization: "Bearer " + authTokens.access,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setProductMaster(data.results || []);
        setMasterProductDetails(data)
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
        setProductMaster([]);
        setMasterProductDetails({});
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. ", {
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


  const handleDeleteService = async (id) => {
    confirm({
      description: "Are you sure you want to delete this service?",
    }).then(async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/masterproducts/${id}/`,
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
          setProductMaster(
            productmaster.filter((service) => service.id !== id)
          );
          setMasterProductDetails('');
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
        console.error("Error deleting service:", error);
        toast.error("An error occurred while deleting the service.");
      }
    });
  };

  const handleUpdatePriority = async (id, newPriority) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/masterproducts/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      );
      if (response.ok) {
        const updatedService = await response.json();
        setProductMaster((prevServices) =>
          prevServices.map((service) =>
            service.id === updatedService.id ? updatedService : service
          )
        );
        fetchMasterServices();
        setNewPriority("");
        toast.success("Priority updated successfully!");
      } else {
        toast.error("Failed to update priority.");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("An error occurred while updating the priority.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-search">
                {/* <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div> */}
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/productmasterservicesfrom">
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
                {productmaster.length ? (
                  productmaster.map((service, index) => (
                    <React.Fragment key={service.id}>
                      <tr>
                        <td>
                          <LowPriorityIcon
                            onClick={() => {
                              setPriorityMasterServiceId(service.id);
                              setShowEditPriorityModal(true);
                            }}
                          />
                        </td>
                        <td>{service.priority}</td>
                        <td>{service.name}</td>
                        <td>{service.slug}</td>
                        <td>
                          {service.image ? (
                            <img
                              src={service.image}
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
                          <AiFillDelete
                            onClick={() => handleDeleteService(service.id)}
                            style={{ cursor: "pointer" }}
                          />
                          &nbsp;&nbsp;
                          <FaEdit
                            onClick={() => setUpdateFormOpened(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr>
                          <td style={{ padding: 0 }}>
                            <Modal
                              closeModal={() => setUpdateFormOpened(false)}
                            >
                              <ProductMasterFrom
                                ProductmasterData={service}
                                setProductmasterData={(data) => {
                                  setProductMaster(
                                    productmaster.map((service) =>
                                      service.id === data.id ? data : service
                                    )
                                  );
                                  setUpdateFormOpened(false); // Close the modal after update
                                }}
                                closeModal={() => setUpdateFormOpened(false)} // Pass close function
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="not-found">
                    <td colSpan={tableHeaders.length}>
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
            Showing {100 * (page - 1) + 1} to{" "}
            {100 * (page - 1) + productmaster?.length} of {masterProductDetails?.length}{" "}
            entries
          </div>

          <div className="tb-more-results">
            <div className="tb-pagination">
              <span id={1} onClick={handlePageChange}>
                ««
              </span>
              {page > 1 && (
                <span id={page - 1} onClick={handlePageChange}>
                  «
                </span>
              )}
              {page > 2 && (
                <span id={page - 2} onClick={handlePageChange}>
                  {page - 2}
                </span>
              )}
              {page > 1 && (
                <span id={page - 1} onClick={handlePageChange}>
                  {page - 1}
                </span>
              )}
              <span id={page} onClick={handlePageChange} className="active">
                {page}
              </span>
              {page < totalPages && (
                <span id={page + 1} onClick={handlePageChange}>
                  {page + 1}
                </span>
              )}
              {page < totalPages - 1 && (
                <span id={page + 2} onClick={handlePageChange}>
                  {page + 2}
                </span>
              )}
              {page < totalPages && (
                <span id={page + 1} onClick={handlePageChange}>
                  »
                </span>
              )}
              <span id={totalPages} onClick={handlePageChange}>
                »»
              </span>
            </div>
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

export default ProductMasterList;
