import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaInfoCircle, FaFileUpload, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import MasterServiceForm from "./Forms/MasterServiceForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import GeneralModal from "./generalModal/GeneralModal";

const MasterServices = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [masterServicesData, setmasterServicesData] = useState([]);
  const [masterServices, setmasterServices] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredServices, setfilteredServices] = useState([]);
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("service_name");

  // Priority Modal
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false);
  const [newPriority, setNewPriority] = useState("");
  const [priorityMasterServiceId, setPriorityMasterServiceId] = useState("");

  // CSV Upload Modal
  const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const [page, setPage] = useState(1);
  const masterServicesPerPage = 50;
  const totalPages = Math.ceil(masterServicesData?.count / masterServicesPerPage);

  // Salons by Service Modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [salonByServiceLoading, setSalonByServiceLoading] = useState(false);

  const handlePageChange = (e) => {
    const selectedPage = e.target.id;
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
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  const deleteServices = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
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
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        getServices();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Service Not Deleted ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      toast.error(`Service Not Deleted: ${error.message}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  useEffect(() => {
    const filtered = masterServices.filter((service) => {
      const matchesSearch = service.service_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGender =
        genderFilter === "all" || service.gender === genderFilter.toLowerCase();
      return matchesSearch && matchesGender;
    });
    setfilteredServices(filtered);
  }, [searchTerm, genderFilter, masterServices]);

  const handleSearch = async () => {
    let url = `https://backendapi.trakky.in/salons/masterservice/?page=${page}`;
    if (searchTerm.trim() !== "") {
      if (searchType === "service_name") {
        url += `&service_name=${searchTerm.trim()}`;
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
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error occurred during search:", error);
      toast.error("Failed to perform search. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/masterservice/${id}/update-priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: JSON.stringify({ priority: parseInt(priority) }),
        }
      );

      if (res.status === 200) {
        toast.success("Priority Updated Successfully", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        setNewPriority("");
        setPriorityMasterServiceId("");
        getServices();
      } else {
        toast.error(`Something Went Wrong ${res.status}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
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
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setSalonByServiceLoading(false);
    }
  };

  // Handle CSV file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid CSV file", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      setSelectedFile(null);
    }
  };

  // Handle CSV upload
  const handleCsvUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file first", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    setUploadingCsv(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/masterservice/upload-csv/",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        toast.success(data.message || "CSV uploaded successfully!", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        setShowCsvUploadModal(false);
        setSelectedFile(null);
        getServices(); // Refresh the services list
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to upload CSV. Please check the file format.", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload CSV. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setUploadingCsv(false);
    }
  };

  // Download sample CSV template
  const downloadSampleCsv = () => {
    const sampleData = [
      ["service_name", "category_id", "gender", "description", "priority"],
      ["Hair Cut", "1", "male", "Professional hair cutting service", "1"],
      ["Facial", "2", "female", "Skin rejuvenation facial", "2"],
      ["Manicure", "3", "all", "Nail care and polishing", "3"],
    ];

    const csvContent = sampleData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "master_service_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Sample CSV downloaded successfully!", {
      duration: 3000,
      position: "top-center",
      style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
    });
  };

  const tableHeaders = [
    "Priority",
    "Shift Priority",
    "Service Name",
    "Category Name",
    "Gender",
    "Image",
    "Salon Name",
    "Description",
    "Action",
  ];

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="px-5 py-5">
            <h1 className="text-xl font-bold text-gray-900">Master Services</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all master services with priority, search, and filtering
            </p>
          </div>
        </div>

        {/* Filters + Add Button */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search Type */}
              <div className="w-full sm:w-48">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="service_name">Search Service</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder={`Search ${searchType === "service_name" ? "service" : "gender"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-11 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                />
                <button
                  onClick={page === 1 ? handleSearch : () => setPage(1)}
                  className="h-11 px-6 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Add Service and Upload CSV Buttons */}
            <div className="flex gap-2">
              <Link to="/masterservicesform">
                <button className="flex items-center gap-2 h-11 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition">
                  <AddIcon className="h-5 w-5" />
                  Add Service
                </button>
              </Link>
              <button
                onClick={() => setShowCsvUploadModal(true)}
                className="flex items-center gap-2 h-11 px-4 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition"
              >
                <FaFileUpload className="h-4 w-4" />
                Upload CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10"
                    >
                      {header}
                    </th>
                  ))}
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchTerm || genderFilter !== "all" ? (
                  filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <React.Fragment key={index}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {service.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setPriorityMasterServiceId(service.id);
                                setShowEditPriorityModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Change Priority"
                            >
                              <LowPriorityIcon className="h-5 w-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.service_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{service.category?.name || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 capitalize">{service.gender}</td>
                          <td className="px-6 py-4 text-center">
                            {service?.service_image ? (
                              <img
                                src={service.service_image}
                                alt="service"
                                className="w-20 h-20 object-contain rounded-md mx-auto"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleGetSalonByMasterService(service.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="View Salons"
                            >
                              <FaInfoCircle className="h-5 w-5" />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            <div dangerouslySetInnerHTML={{ __html: service.description }} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => deleteServices(service.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <AiFillDelete className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setUpdateFormOpened(index)}
                              className="p-2 ml-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>

                        {updateFormOpened === index && (
                          <tr>
                            <td colSpan={9} className="p-0 bg-gray-50">
                              <Modal closeModal={() => setUpdateFormOpened(null)}>
                                <MasterServiceForm
                                  masterServiceData={service}
                                  setMasterServiceData={(data) => {
                                    setmasterServices(
                                      masterServices.map((s) => (s.id === data.id ? data : s))
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">No services found</p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : masterServices.length > 0 ? (
                  masterServices.map((service, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {service.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setPriorityMasterServiceId(service.id);
                              setShowEditPriorityModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Change Priority"
                          >
                            <LowPriorityIcon className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.service_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{service.category?.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{service.gender}</td>
                        <td className="px-6 py-4 text-center">
                          {service?.service_image ? (
                            <img
                              src={service.service_image}
                              alt="service"
                              className="w-20 h-20 object-contain rounded-md mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleGetSalonByMasterService(service.id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="View Salons"
                          >
                            <FaInfoCircle className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          <div dangerouslySetInnerHTML={{ __html: service.description }} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteServices(service.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <AiFillDelete className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setUpdateFormOpened(index)}
                            className="p-2 ml-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>

                      {updateFormOpened === index && (
                        <tr>
                          <td colSpan={9} className="p-0 bg-gray-50">
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <MasterServiceForm
                                masterServiceData={service}
                                setMasterServiceData={(data) => {
                                  setmasterServices(
                                    masterServices.map((s) => (s.id === data.id ? data : s))
                                  );
                                  setUpdateFormOpened(null);
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-sm font-medium">Loading services...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <strong>
                  {50 * (page - 1) + 1} to{" "}
                  {50 * (page - 1) +
                    (searchTerm || genderFilter !== "all"
                      ? filteredServices.length
                      : masterServices?.length)}
                </strong>{" "}
                of{" "}
                <strong>
                  {searchTerm || genderFilter !== "all"
                    ? filteredServices.length
                    : masterServicesData?.count}
                </strong>{" "}
                entries
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button id={1} onClick={handlePageChange} disabled={page === 1}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    First
                  </button>
                  {page > 1 && (
                    <button id={page - 1} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition">
                      Previous
                    </button>
                  )}
                  {page > 3 && <span className="px-2 text-sm text-gray-500">...</span>}
                  {page > 2 && (
                    <button id={page - 2} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                      {page - 2}
                    </button>
                  )}
                  {page > 1 && (
                    <button id={page - 1} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                      {page - 1}
                    </button>
                  )}
                  <button disabled className="px-3 py-1.5 text-sm rounded-md border border-blue-500 bg-blue-50 text-blue-700 font-medium cursor-default">
                    {page}
                  </button>
                  {page < totalPages && (
                    <button id={page + 1} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                      {page + 1}
                    </button>
                  )}
                  {page < totalPages - 1 && (
                    <button id={page + 2} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                      {page + 2}
                    </button>
                  )}
                  {page < totalPages - 2 && <span className="px-2 text-sm text-gray-500">...</span>}
                  {page < totalPages && (
                    <button id={page + 1} onClick={handlePageChange}
                      className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition">
                      Next
                    </button>
                  )}
                  <button id={totalPages} onClick={handlePageChange} disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Salons by Service Modal */}
        <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Salons Offering This Service</h2>
            {salonByServiceLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : modalData && modalData.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {modalData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{index + 1}.</span>
                    <span className="text-sm text-gray-800">
                      {item?.name} <span className="text-gray-500">({item?.area} - {item?.city})</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No salons found offering this service</p>
            )}
          </div>
        </GeneralModal>

        {/* Priority Update Modal */}
        <GeneralModal open={showEditPriorityModal} handleClose={() => setShowEditPriorityModal(false)}>
          <div className="p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">Update Priority</h3>
            <div className="space-y-4">
              <input
                type="number"
                value={newPriority}
                placeholder="Enter new priority"
                onChange={(e) => setNewPriority(e.target.value)}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
                }}
                className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleUpdatePriority(priorityMasterServiceId, newPriority);
                    setShowEditPriorityModal(false);
                  }}
                  disabled={!newPriority}
                  className="flex-1 h-11 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Update Priority
                </button>
                <button
                  onClick={() => setShowEditPriorityModal(false)}
                  className="h-11 px-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </GeneralModal>

        {/* CSV Upload Modal */}
        <GeneralModal open={showCsvUploadModal} handleClose={() => {
          setShowCsvUploadModal(false);
          setSelectedFile(null);
        }}>
          <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Upload Master Services CSV
            </h2>
            
            {/* Download Sample Button */}
            <button
              onClick={downloadSampleCsv}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
            >
              <FaDownload className="h-4 w-4" />
              Download Sample CSV Template
            </button>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <FaFileUpload className="h-12 w-12 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to select CSV file"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Supported format: .csv
                </span>
              </label>
            </div>

            {/* Upload Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCsvUpload}
                disabled={!selectedFile || uploadingCsv}
                className="flex-1 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {uploadingCsv ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </div>
                ) : (
                  "Upload CSV"
                )}
              </button>
              <button
                onClick={() => {
                  setShowCsvUploadModal(false);
                  setSelectedFile(null);
                }}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">CSV Format Instructions:</p>
              <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                <li>First row must contain headers: service_name, category_id, gender, description, priority</li>
                <li>category_id must match existing category IDs</li>
                <li>gender values: male, female, all</li>
                <li>priority must be a number (higher number = higher priority)</li>
                <li>description supports HTML tags</li>
              </ul>
            </div>
          </div>
        </GeneralModal>
      </div>
    </>
  );
};

export default MasterServices;