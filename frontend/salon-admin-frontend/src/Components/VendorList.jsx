import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import GeneralModal from "./generalModal/GeneralModal";
import DateRange from "./DateRange/DateRange";
import { useLocation } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { formatDate } from "./DateRange/formatDate";
import "./css/salonelist.css";
import { Link } from "react-router-dom";
import AddVendor from "./Forms/VendorForm";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiSearch, FiCalendar, FiUser, FiPhone, FiMail, FiBriefcase, FiBuilding, FiCode, FiImage } from "react-icons/fi";
import { CircularProgress, Avatar, Chip } from "@mui/material";

const VendorList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [filteredVendors, setfilteredVendors] = useState([]);
  const [filterField, setFilterField] = useState("ownername");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateSelected, setDateSelected] = useState(true);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      {
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      },
    ];
  } else {
    initialDateState = [
      {
        startDate: dateState2[0].startDate,
        endDate: dateState2[0].endDate,
        key: "selection",
      },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  useEffect(() => {
    getVendors(true);
  }, [dateState]);

  const handleViewAll = () => {
    setSearchTerm("");
    getVendors(false);
  };

  const getVendors = async (date) => {
    setLoading(true);
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    let url;
    if (date) {
      url = `https://backendapi.trakky.in/salonvendor/vendor/?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      setDateSelected(true);
    } else {
      url = "https://backendapi.trakky.in/salonvendor/vendor/";
      setDateSelected(false);
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setVendorsData(data);
        setfilteredVendors(data);
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
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors. Please try again later", {
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

  const deleteVendor = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 204) {
        toast.success(
          "Vendor deleted successfully. The page will be reloaded to see updates."
        );
        getVendors(false);
      } else if (response.status === 401) {
        toast.error("You're logged out. Please log in again.");
        logoutUser();
      } else {
        const responseData = await response.json();
        console.error("Error deleting vendor:", responseData);
        toast.error(
          "An error occurred while deleting the vendor. Please try again later."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error(
        "Failed to delete the vendor. Please check your internet connection and try again."
      );
    }
  };

  const tableHeaders = [
    "User",
    "Vendor Name",
    "Business Name",
    "Phone Number",
    "Email",
    "Password",
    "Salon Name",
    "Branch Name",
    "Branch Code",
    "Logo",
    "Action",
  ];

  useEffect(() => {
    if (searchTerm === "") {
      return setfilteredVendors(vendorsData);
    }

    setfilteredVendors(
      vendorsData.filter((salon) => {
        return salon[filterField]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 font-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Vendor Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all registered vendors and their access
              </p>
            </div>
            <Link to="/addvendor">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#502DA6] text-white font-medium rounded-lg hover:bg-[#401c94] transition shadow-md">
                <AddIcon fontSize="small" />
                Add Vendor
              </button>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={filterField === "ownername" ? "text" : "number"}
                  placeholder="search here.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] transition"
                />
              </div>
              <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)} className="h-11 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6]">
                  <option value={"ownername"}>Name</option>
                  <option value={"ph_number"}>phone number</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleViewAll}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                View All
              </button>
              <div className="DB-main-date-range">
                <div
                  className="DB-Date-Range-Button flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setShowDateSelectionModal(true);
                  }}
                >
                  <FiCalendar className="text-gray-500" />
                  <span>
                    {dateState[0].startDate.getDate()}/{dateState[0].startDate.getMonth() + 1}/{dateState[0].startDate.getFullYear()} ~ {dateState[0].endDate.getDate()}/{dateState[0].endDate.getMonth() + 1}/{dateState[0].endDate.getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <CircularProgress size={48} thickness={4} />
                <p className="mt-4 text-base font-medium">Loading vendors...</p>
              </div>
            ) : filteredVendors.length !== 0 ? (
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky top-0 bg-gray-50 z-10 ${header === "Logo" ? "text-center" : ""}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors?.map((vendor, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700">{vendor.user || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar sx={{ width: 36, height: 36, bgcolor: "#502DA6" }}>
                              {vendor.ownername?.[0]?.toUpperCase() || "V"}
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900">{vendor.ownername || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{vendor.businessname || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-gray-400" />
                            <span>{vendor.ph_number || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiMail className="text-gray-400" />
                            <span className="text-sm">{vendor.email || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{vendor.password || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{vendor.salon_name || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{vendor.branchname || "-"}</td>
                        <td className="px-6 py-4">
                          <Chip label={vendor.branchcode || "-"} size="small" className="bg-gray-100" />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {vendor?.logo ? (
                            <img
                              src={vendor.logo}
                              alt="Logo"
                              className="w-16 h-16 object-contain rounded-lg border mx-auto"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                              <FiImage className="text-gray-400 h-8 w-8" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setUpdateFormOpened(index)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                              title="Edit Vendor"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this vendor?")) {
                                  deleteVendor(vendor.id);
                                }
                              }}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                              title="Delete Vendor"
                            >
                              <AiFillDelete className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {updateFormOpened === index && (
                        <tr>
                          <td colSpan={11} style={{ padding: 0 }} className="bg-gray-50">
                            <Modal closeModal={() => setUpdateFormOpened(null)}>
                              <AddVendor
                                vendorData={vendor}
                                setVendorData={(data) => {
                                  setVendorsData(
                                    vendorsData?.map((vendor) =>
                                      vendor.user === data.user
                                        ? data
                                        : vendor
                                    )
                                  );
                                  setUpdateFormOpened(null);
                                }}
                              />
                            </Modal>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-500">
                  {searchTerm ? "No vendors match your search." : dateSelected ? "No entries with given date" : "Not Found"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-sm border-t border-gray-200 px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              showing 1 to {vendorsData?.length} of {vendorsData?.length} entries
            </div>
            <div className="inquiryViewAllButton">
              <button onClick={handleViewAll} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                <div>View all</div>
              </button>
            </div>
          </div>
        </div>

        <GeneralModal
          open={showDateSelectionModal}
          handleClose={() => setShowDateSelectionModal(false)}
        >
          <DateRange
            dateState={dateState}
            setDateState={setDateState}
            setShowDateSelectionModal={setShowDateSelectionModal}
          />
        </GeneralModal>
      </div>
    </>
  );
};

export default VendorList;