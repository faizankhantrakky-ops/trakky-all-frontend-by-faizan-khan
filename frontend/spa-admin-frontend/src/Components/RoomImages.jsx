import React, { useContext, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "../Components/generalmodal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "./css/spaelist.css";
import "./css/roomimages.css";

const RoomImages = () => {
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

  // edit image

  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState("");
  const [roomImageId, setRoomImageId] = useState("");

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
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Error : ${error.message}`, {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  const tableHeaders = [
    "Priority",
    "Name",
    "Phone No.",
    "Address",
    "Room Images",
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

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(`Error : ${error.message}`, {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSpas / spasPerPage);

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      handleSearch();
    } else {
      getSpas();
    }
  }, [page, searchTerm]); 
  

  useEffect(() => {
    setSearchTerm(""); 
    setPage(1); 
    getSpas(); 
  }, [filterField]);

  const handleDeleteRoomImage = async (id) => {
    try {
      await fetch(
        `https://backendapi.trakky.in/spas/roomspaimage/${id}/
      `,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      ).then((result) => {
        if (result.status === 204) {
          getSpas();
          toast.success("Room Image Deleted Successfully", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setShowModal(false);
        }
      });
    } catch (error) {
      alert("Error occured", error);
    }
  };

  const handleEditDetails = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("room_name", roomName);
    if (roomImage) {
      formData.append("image", roomImage);
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/roomspaimage/${roomImageId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );
      if (response.ok) {
        toast.success("Room Image Updated Successfully", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowEditModal(false);
        getSpas();
        setShowModal(false);
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        let errorMessage =
          errorData.image !== undefined ? errorData.image : "";
        errorMessage += " ";
        if (errorMessage === " ") {
          errorMessage += `Something Went Wrong : ${response.status}`;
        }
        toast.error(`${errorMessage}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "white",
          },
        });
      } else {
        toast.error(`HTTP error! Status: ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      alert("Error occured", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select onChange={handleFilterChange}>
                  <option value={"name"}> Name</option>
                  <option value={"mobile_number"}>phone number</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={
                      filterField === "mobilenumber" ||
                      filterField === "priority"
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
              <Link to="/addroomimages">
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
                ) : spasData && spasData?.length > 0 ? (
                  spasData?.map((spa, index) => {
                    return (
                      <>
                        <tr>
                          <td>{spa.priority}</td>
                          <td>{spa.name}</td>
                          <td>{spa.mobile_number}</td>
                          <td className="address-field-s">{spa.address}</td>
                          <td>
                            <span
                              className="view-icon"
                              onClick={() => {
                                setModalData(spa);
                                setShowModal(true);
                              }}
                            >
                              <VisibilityIcon />
                            </span>
                          </td>
                        </tr>
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
      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <div>
          <h2 className="RI-modal-spa-dht">Spa Room Images</h2>
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
          {modalData?.room_mul_images?.length > 0 ? (
            <div className="RI-modal-room-images">
              <table>
                <tr>
                  <th className="px-3">Room Images</th>
                  <th className="px-3">Room Name</th>
                  <th className="px-3">Edit</th>
                  <th className="px-3">Delete</th>
                </tr>

                {modalData?.room_mul_images?.map((image, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={image?.image}
                          alt="room image"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{image?.room_name || " - "}</td>
                      <td>
                        <span
                          onClick={() => {
                            setRoomName(image?.room_name);
                            setRoomImageId(image?.id);
                            setShowEditModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {/* Edit */}
                          <EditIcon />
                        </span>
                      </td>
                      <td>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            handleDeleteRoomImage(image?.id);
                          }}
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
                No Images Found
              </h3>
            </div>
          )}
        </div>
      </GeneralModal>
      <GeneralModal
        open={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <div>
          <form method="PATCH" onSubmit={handleEditDetails}>
            <div className="row">
              <div className="input-box inp-name col-1 col-2">
                <label htmlFor="cityname">Room Name</label>
                <input
                  type="text"
                  name="roomname"
                  id="roomname"
                  placeholder="Enter Room Name"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label htmlFor="img">Room Image</label>
                <input
                  type="file"
                  name="img"
                  id="img"
                  placeholder="Enter Image"
                  accept="image/*"
                  onChange={(e) => setRoomImage(e.target.files[0])}
                />
              </div>
            </div>
            <div className="submit-btn row">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </GeneralModal>
    </>
  );
};

export default RoomImages;
