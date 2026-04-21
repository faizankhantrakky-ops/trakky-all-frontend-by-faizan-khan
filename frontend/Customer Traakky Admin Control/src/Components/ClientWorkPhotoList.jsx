import React, { useContext, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import toast, { Toaster } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import { FaEdit } from "react-icons/fa";

import "./css/clientwork.css";

const ClientWorkPhotoList = () => {
  const scrollTopRef = useRef(null);

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterField, setFilterField] = useState("name");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalSalons, setTotalSalons] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);

  const [categoryList, setCategoryList] = useState([]);

  const [description, setDescription] = useState("");

  // edit image

  const [categories_id, setCategoriesId] = useState("");
  const [service_name, setServiceName] = useState("");
  const [img, setImg] = useState("");
  const [client_work_id, setClientWorkId] = useState("");
  const [video, setVideo] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");

  const getSalons = async () => {
    let url = `https://backendapi.trakky.in/salons/?page=${page}`;

    setLoading(true);

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSalonsData(data.results);
        setTotalSalons(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
      })
      .catch((err) => alert(err));

    setLoading(false);
  };

  const tableHeaders = [
    "Priority",
    "Name",
    "City",
    "Area",
    "Phone No.",
    "Address",
    "Client Work Images",
  ];

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  const handleSearch = async () => {
    let url = `https://backendapi.trakky.in/salons/${"search" + filterField.trim()
      }/?search=${searchTerm.trim()}&page=${page}`;

    setLoading(true);

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
        setSalonsData(data.results);
        setTotalSalons(data.count);
        if (scrollTopRef.current) {
          scrollTopRef.current.scrollIntoView({ behavior: "smooth" });
        }
        if (data.next === null) {
          setHasMore(false);
        }
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
      setLoading(false);
    }
  };

  const spasPerPage = 12;
  const totalPages = Math.ceil(totalSalons / spasPerPage);

  useEffect(() => {
    if (searchTerm !== "") {
      handleSearch();
    } else {
      getSalons();
    }
  }, [page]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  const getCategories = () => {
    const requestOption = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };

    fetch("https://backendapi.trakky.in/salons/category/", requestOption)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        } else {
          throw new Error("Failed to fetch categories");
        }
      })
      .then((data) => {
        setCategoryList(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories. Please try again later", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleDeleteClientWork = async (id) => {
    const loadingToastId = toast.loading("Deleting...", {
      duration: null, // Duration set to null for indefinite display
      position: "top-center",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    try {
      await fetch(`https://backendapi.trakky.in/salons/client-image/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
      }).then((result) => {
        if (result.status === 204) {
          if (searchTerm === "") {
            getSalons();
          } else {
            handleSearch();
          }
          toast.dismiss(loadingToastId);
          toast.success("Client Work Images Deleted Successfully", {
            duration: 4000,
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
      console.error("Error occurred during deletion:", error);
      toast.dismiss(loadingToastId); // Dismiss loading toast on error
      toast.error("Error occurred while deleting client work image", {
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

  const handleEditDetails = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("category", categories_id);
    formData.append("service", service_name);
    formData.append("description", description);
    if (img) {
      formData.append("client_image", img);
    }
    if (video) {
      formData.append("video", video);
    }
    if (videoThumbnail) {
      formData.append("video_thumbnail_image", videoThumbnail);
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/client-image/${client_work_id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Client Work Image Updated Successfully.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setShowEditModal(false);
        if (searchTerm === "") {
          getSalons();
        } else {
          handleSearch();
        }
        setShowModal(false);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Error occurred while updating client work image.", {
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

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data" ref={scrollTopRef}>
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}>
                  <option value={"name"}> Name</option>
                  <option value={"priority"}> Priority</option>
                  <option value={"mobilenumber"}>phone number</option>
                  <option value={"city"}>City</option>
                  <option value={"area"}>Area</option>
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
              <Link to="/addclientworkphotos">
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
                    <td colSpan={6}>
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
                ) : salonsData && salonsData?.length > 0 ? (
                  salonsData?.map((salon, index) => {
                    return (
                      <>
                        <tr>
                          <td>{salon?.priority}</td>
                          <td>{salon?.name}</td>
                          <td>{salon?.city}</td>
                          <td>{salon?.area}</td>
                          <td>{salon?.mobile_number}</td>
                          <td className="address-field-s">{salon?.address}</td>
                          <td>
                            <span
                              className="view-icon"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setModalData(salon);
                                setShowModal(true);
                              }}
                            >
                              <VisibilityIcon
                                style={{ width: "fit-content" }}
                              />
                            </span>
                          </td>
                        </tr>
                      </>
                    );
                  })
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {salonsData.length} of {totalSalons} entries
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
          <h2 className="CWP-modal-spa-dht">Client Work Images</h2>
          <div className="CWP-modal-spa-details">
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
          {modalData?.client_images?.length > 0 ? (
            <div className="CWP-modal-room-images">
              <table>
                <tr>
                  <th className="px-3">Client Work Images</th>
                  <th className="px-3">Category</th>
                  <th className="px-3">Service Name</th>
                  <th className="px-3">Description</th>
                  <th className="px-3">Video</th>
                  <th className="px-3">Video thumbnail</th>
                  <th className="px-3">Edit</th>
                  <th className="px-3">Delete</th>
                </tr>

                {modalData?.client_images?.map((image, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={image?.client_image}
                          alt="client work image"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{image?.category || " - "}</td>
                      <td>{image?.service || " - "}</td>
                      <td>{image?.description || " - "}</td>
                      {/* video
: 
"https://trakkynew.blob.core.windows.net/trakky-new-pics/salon_client_videos/eac4d11f-0244-4c8b-903a-99dc89e9c6a1.mp4"
video_thumbnail_image
: 
"https://trakkynew.blob.core.windows.net/trakky-new-pics/salon_client_images/e0497122-5536-4462-9a79-b67281ac5f7d.webp" */}
                      <td>
                        {image?.video ? (
                          <video
                            src={image?.video}
                            controls
                            style={{
                              width: "200px",
                              minWidth: "200px",
                            }}
                          />
                        ) : (
                          " - "
                        )}
                      </td>
                      <td>
                        {image?.video_thumbnail_image ? (
                          <img
                            src={image?.video_thumbnail_image}
                            alt="video thumbnail"
                            style={{ width: "100px" }}
                          />
                        ) : (
                          " - "
                        )}
                      </td>
                      <td>
                        <FaEdit
                          onClick={() => {
                            setCategoriesId(image?.category);
                            setServiceName(image?.service);
                            setDescription(image?.description);
                            setClientWorkId(image?.id);
                            setShowEditModal(true);
                          }}
                          style={{
                            cursor: "pointer",
                            margin: "auto",
                          }}
                        />
                      </td>
                      <td>
                        <span
                          onClick={() => {
                            handleDeleteClientWork(image?.id);
                          }}
                        >
                          <DeleteIcon style={{ cursor: "pointer" }} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          ) : (
            <div className="CWP-room-images">
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
              <div className="input-box inp-time col-1 col-2">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label htmlFor="video">Video ( optional )</label>
                <input
                  type="file"
                  name="video"
                  id="video"
                  placeholder="Enter Video"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-box inp-main-img col-1 col-2">
                <label htmlFor="videoThumbnail">Video Thumbnail ( optional )</label>
                <input
                  type="file"
                  name="videoThumbnail"
                  id="videoThumbnail"
                  placeholder="Enter Video Thumbnail"
                  accept="image/*"
                  onChange={(e) => setVideoThumbnail(e.target.files[0])}
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

export default ClientWorkPhotoList;
