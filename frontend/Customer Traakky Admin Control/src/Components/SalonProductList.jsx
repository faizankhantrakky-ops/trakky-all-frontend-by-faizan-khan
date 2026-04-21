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
import "./css/salonelist.css";
import SalonProductForm from "./Forms/SalonProductFrom";

const SalonProductList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [salonProduct, setSalonProduct] = useState([]);
  const [masterProduct, setMasterProduct] = useState({ count: 0, next: null, previous: null });
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [prioritySalonProductId, setPrioritySalonProductId] = useState(null);
  const [newPriority, setNewPriority] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const productsPerPage = 12;
  const totalPages = Math.ceil(masterProduct.count / productsPerPage);

  const tableHeaders = [
    "Priority",
    "Shift Priority",
    "Salon name",
    "Product name",
    "Product image",
    "Action",
  ];

  useEffect(() => {
    fetchSalonProduct();
  }, [page]);

  const fetchSalonProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/productofsalon/?page=${page}&page_size=${productsPerPage}`,
        {
          headers: {
            Authorization: "Bearer " + authTokens.access,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSalonProduct(data.results);
        setMasterProduct({
          count: data.count,
          next: data.next,
          previous: data.previous
        });
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Session expired. Please login again.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load salon products. Please try again.");
      setSalonProduct([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    confirm({
      description: "Are you sure you want to delete this Salon Product?",
    }).then(async () => {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/productofsalon/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 204) {
          fetchSalonProduct();
          toast.success("Salon Product deleted successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
        else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else {
          toast.error(`Salon Product Not Deleted ${response.status}`, {
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
        `https://backendapi.trakky.in/salons/productofsalon/${id}/update-priority/`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + authTokens.access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: newPriority }),
        }
      )
      if (response.ok) {
        const updatedProduct = await response.json();
        setSalonProduct((prevSalon) =>
          prevSalon.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        setNewPriority("");
        toast.success("Priority updated successfully!");
      }
      else {
        toast.error("Failed to update priority.");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("An error occurred while updating the priority.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-search">
                {/* Search input can be added here if needed */}
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/SalonProductFrom">
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
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                ) : salonProduct.length ? (
                  salonProduct.map((salon, index) => (
                    <React.Fragment key={salon.id}>
                      <tr>
                        <td>{salon.priority}</td>
                        <td>
                          <LowPriorityIcon
                            onClick={() => {
                              setPrioritySalonProductId(salon.id);
                              setShowEditPriorityModal(true);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td>{salon.salon_name}</td>
                        <td>{salon.product_name}</td>
                        <td>
                          {salon.product_image ? (
                            <img
                              src={salon.product_image}
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
                            onClick={() => handleDeleteService(salon.id)}
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
                          <td style={{ padding: 0 }} colSpan={tableHeaders.length}>
                            <Modal
                              closeModal={() => setUpdateFormOpened(false)}
                            >
                              <SalonProductForm
                                salonProductDataList={salon}
                                setSalonProductDataList={(data) => {
                                  setSalonProduct(
                                    salonProduct.map((salon) =>
                                      salon.id === data.id ? data : salon
                                    )
                                  );
                                  setUpdateFormOpened(false);
                                }}
                                closeModal={() => setUpdateFormOpened(false)}
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
                        No products found
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
            Showing {(page - 1) * productsPerPage + 1} to{" "}
            {Math.min(page * productsPerPage, masterProduct.count)} of{" "}
            {masterProduct.count} entries
          </div>

          <div className="tb-more-results">
            <div className="tb-pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="pagination-button"
              >
                ««
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="pagination-button"
              >
                «
              </button>

              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' ? handlePageChange(pageNumber) : null}
                  className={`pagination-button ${pageNumber === page ? "active" : ""}`}
                  disabled={pageNumber === '...'}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                className="pagination-button"
              >
                »
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages || totalPages === 0}
                className="pagination-button"
              >
                »»
              </button>
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
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div
            className="submit-btn row"
            style={{
              padding: "0 0 20px 0",
              margin: "0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                handleUpdatePriority(prioritySalonProductId, newPriority);
                setShowEditPriorityModal(false);
              }}
              style={{
                padding: "8px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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

export default SalonProductList;