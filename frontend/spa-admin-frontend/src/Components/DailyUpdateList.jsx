import React, { useContext, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalmodal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DailyUpdates from "./Forms/DailyUpdates";

const DailyUpdateList = () => {
  const scrollTopRef = useRef(null);

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [spasData, setSpasData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterField, setFilterField] = useState("name");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSpas, setTotalSpas] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);

  const [dailyUpdateData, setDailyUpdateData] = useState([]);

  // edit image

  const [categories_id, setCategoriesId] = useState("");
  const [service_name, setServiceName] = useState("");
  const [img, setImg] = useState("");
  const [client_work_id, setClientWorkId] = useState("");

  const [dailyEditData, setDailyEditData] = useState({});

  const getSpas = async () => {
    try {
      let url = `https://backendapi.trakky.in/spas/?page=${page}`;
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSpasData(data.results);
      setTotalSpas(data.count);
      if (scrollTopRef.current) {
        scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (data.next === null) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const tableHeaders = [
    "Priority",
    "Name",
    "Phone No.",
    "Address",
    "Daily Updates",
  ];

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If no search term, return early
      return;
    }
    
    try {
      let url = `https://backendapi.trakky.in/spas/?${filterField.trim()}=${searchTerm.trim()}&page=${page}`;
      
      setLoading(true);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setSpasData(data.results);
      setTotalSpas(data.count);
      if (scrollTopRef.current) {
        scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (data.next === null) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };
  

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSpas / spasPerPage);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      handleSearch();
    } else {
      getSpas();
    }
  }, [page, searchTerm, filterField]);
  

useEffect(() => {
  setSearchTerm(""); 
  setPage(1); 
  getSpas(); 
}, [filterField]);

  
  const getDailyUpdates = async (id, pageCount = 1) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/spas/daily-updates/?spa_id=${id}&page=${pageCount}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setDailyUpdateData((prevData) => [...prevData, ...data.results]);

        if (data?.next !== null) {
          await getDailyUpdates(id, pageCount + 1);
        }
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error : ", error);
      toast.error("Failed to fetch daily updates. Please try again later.", {
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

  const handleDeleteDailyUpdate = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/daily-updates/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        getSpas();
        toast.success("Daily Update Post Deleted Successfully", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowModal(false);
        setDailyUpdateData([]);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in delete daily update post : ", error);
      toast.error(
        "Failed to delete daily update post. Please try again later.",
        {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
    }
  };

  // const handleEditDetails = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();

  //   formData.append("category", categories_id);
  //   formData.append("service", service_name);
  //   if (img) {
  //     formData.append("client_image", img);
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://backendapi.trakky.in/spas/client-image/${client_work_id}/`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: "Bearer " + String(authTokens.access),
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (response.status === 200) {
  //       const data = await response.json();
  //       alert("Room Image Updated Successfully");
  //       setShowEditModal(false);
  //       getSpas();
  //       setShowModal(false);
  //       setDailyUpdateData([]);
  //     } else {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to update room image. Please try again later.", {
  //       duration: 4000,
  //       position: "top-center",
  //       style: {
  //         borderRadius: "10px",
  //         background: "#333",
  //         color: "#fff",
  //       },
  //     });
  //   }
  // };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select  onChange={handleFilterChange}>
                  <option value={"name"}> Name</option>
                  <option value={"mobile_number"}>phone number</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={
                      filterField === "mobilenumber"
                        ? "number"
                        : "text"
                    }
                    name="search-inp"
                    placeholder="search here.."
                    value={searchTerm}
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
              <Link to="/adddailyupdates">
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
                  <tr className="not-found">
                    <td colSpan={5}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Loading
                      </div>
                    </td>
                  </tr>
                ) : spasData?.length > 0 ? (
                  spasData.map((spa, index) => (    
                        <tr>
                          <td>{spa?.priority}</td>
                          <td>{spa?.name}</td>
                          <td>{spa?.mobile_number}</td>
                          <td className="address-field-s">{spa?.address}</td>
                          <td>
                            <span
                              className="view-icon"
                              onClick={async () => {
                                await getDailyUpdates(spa?.id);
                                setModalData(spa);
                                setShowModal(true);
                              }}
                            >
                              <VisibilityIcon />
                            </span>
                          </td>
                        </tr>
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {spasData.length} of {totalSpas} entries
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
      <GeneralModal
        open={showModal}
        handleClose={() => {
          setShowModal(false);
          setDailyUpdateData([]);
        }}
      >
        <div>
          <h2 className="RI-modal-spa-dht">Daily Updates</h2>
          <div className="RI-modal-spa-details">
            <table>
              <tr>
                <th className="min-w-[170px]">Name</th>

                <td style={{ textAlign: "start" }}>: {modalData?.name}</td>
              </tr>
              <tr>
                <th>Phone number</th>
                <td style={{ textAlign: "start" }}>
                  : {modalData?.mobile_number}
                </td>
              </tr>
            </table>
          </div>
          <hr />
          {dailyUpdateData?.length > 0 ? (
            <div className="RI-modal-room-images">
              <table>
                <tr>
                  <th className="px-3">Daily Update image</th>
                  <th className="px-3">Description</th>
                  <th className="px-3">Edit</th>
                  <th className="px-3">Delete</th>
                </tr>

                {dailyUpdateData?.map((updatesData, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={updatesData?.daily_update_img}
                          alt="Daily Updates"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{updatesData?.daily_update_description || " - "}</td>
                      <td>
                        <span
                          onClick={() => {
                            setDailyEditData({
                              ...updatesData,
                              spa_name: modalData?.name,
                            });
                            setShowEditModal(true);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {/* Edit */}
                          <EditIcon />
                        </span>
                      </td>
                      <td>
                        <span
                          onClick={() => {
                            handleDeleteDailyUpdate(updatesData?.id);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <DeleteIcon />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          ) : (
            <div className="RI-room-images">
              <h3 style={{ textAlign: "center", paddingBlock: "20px" }}>
                No Updates Found
              </h3>
            </div>
          )}
        </div>
      </GeneralModal>
      <GeneralModal
        open={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <DailyUpdates
          dailyData={dailyEditData}
          handleClose={() => setShowEditModal(false)}
          handleModalClose={() => setShowModal(false)}
        />
        {/* <div>
          <form method="PATCH" onSubmit={handleEditDetails}>
            <div className="row">
              <div className="input-box inp-time col-1 col-2">
                <label htmlFor="category">Select Category</label>
                <select
                  name="category"
                  id="category"
                  required
                  value={categories_id || "not-select"}
                  onChange={(e) => setCategoriesId(e.target.value)}
                >
                  <option value="not-select" disabled hidden>
                    ---Select---
                  </option>

                  {categoryList.map((category, index) => (
                    <option value={category?.id} key={index}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="input-box inp-time col-1 col-2">
                <label htmlFor="service_name">Service Name</label>
                <input
                  type="text"
                  name="service_name"
                  placeholder="Enter Service Name"
                  id="service_name"
                  value={service_name}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
          <div className="input-box inp-main-img col-1 col-2">
            <label htmlFor="img">Image</label>
            <input
              type="file"
              name="img"
              id="img"
              placeholder="Enter CLient Work Image"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>
        </div>
            <div className="submit-btn row">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div> */}
      </GeneralModal>
    </>
  );
};

export default DailyUpdateList;
