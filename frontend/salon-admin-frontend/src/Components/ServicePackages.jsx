import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./UpdateModal";
import PackageForm from "./Forms/ServicePackageForm";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const ServicePackages = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setfilteredPackages] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("Search Salon");

  // === Fetch Packages ===
  const getPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/packages/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authTokens.access,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setPackages(data);
      } else if (response.status === 401) {
        logoutUser();
        toast.error("Unauthorized: Please log in again", {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages. Please try again later", {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false);
    }
  };

  // === Delete Package ===
  const deletePackage = async (packageId) => {
    if (!packageId) {
      toast.error("Invalid package ID!", { style: { background: "#f97316", color: "#fff" } });
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this package?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://backendapi.trakky.in/salons/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok || response.status === 204) {
        setPackages((prev) => prev.filter((p) => p.id !== packageId));
        toast.success("Package deleted successfully!", {
          style: { background: "#22c55e", color: "#fff", borderRadius: "8px" },
        });
      } else if (response.status === 401) {
        toast.error("Unauthorized! Please log in again.", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else if (response.status === 404) {
        toast.error("Package not found!", {
          style: { background: "#ef4444", color: "#fff" },
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Unexpected error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting. Please try again.", {
        style: { background: "#ef4444", color: "#fff" },
      });
    }
  };

  // === Get Service Names ===
  const getServiceIncludedNames = (packageItem) => {
    if (packageItem.service_included_names && Object.keys(packageItem.service_included_names).length > 0) {
      return Object.values(packageItem.service_included_names);
    }
    if (packageItem.custom_service_field && packageItem.custom_service_field.length > 0) {
      return packageItem.custom_service_field;
    }
    if (packageItem.service_included && packageItem.service_included.length > 0) {
      return packageItem.service_included.map((s) => s.service_name);
    }
    return [];
  };

  // === Search Logic ===
  useEffect(() => {
    const filtered = packages.filter((pkg) => {
      const term = searchTerm.toLowerCase();
      switch (searchOption) {
        case "Search Salon":
          return pkg.salon_name.toLowerCase().includes(term);
        case "Search Package Name":
          return pkg.package_name.toLowerCase().includes(term);
        case "Search Service":
          const serviceNames = getServiceIncludedNames(pkg);
          return serviceNames.some((name) => name.toLowerCase().includes(term));
        default:
          return true;
      }
    });
    setfilteredPackages(filtered);
  }, [searchTerm, packages, searchOption]);

  useEffect(() => {
    setSearchTerm("");
  }, [searchOption]);

  // === Effects ===
  useEffect(() => {
    if (updateFormOpened === null) {
      getPackages();
    }
  }, [updateFormOpened]);

  useEffect(() => {
    getPackages();
  }, []);

  const displayData = searchTerm ? filteredPackages : packages;
  const tableHeaders = [
    "Package Name",
    "Salon Name",
    "Actual Price",
    "Discount Price",
    "Services Included",
    "Package Time",
    "Actions",
  ];

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className="max-w-7xl mx-auto">

          {/* === Header === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Packages</h1>
                <p className="mt-1 text-sm text-gray-600">Manage salon service packages</p>
              </div>
              <Link to="/addservicepackages">
                <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  <AddIcon className="w-5 h-5" />
                  Add Package
                </button>
              </Link>
            </div>
          </div>

          {/* === Filters === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 flex gap-3">
                {/* Search By */}
                <select
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="Search Salon">Search Salon</option>
                  <option value="Search Package Name">Search Package Name</option>
                  <option value="Search Service">Search Service</option>
                </select>

                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Search by ${searchOption.replace("Search ", "").toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <svg className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* === Table === */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Loading packages...</p>
              </div>
            ) : displayData.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-lg font-medium text-gray-600">
                  {searchTerm ? "No packages match your search" : "No packages available"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {displayData.map((pkg, index) => {
                      const serviceNames = getServiceIncludedNames(pkg);
                      return (
                        <React.Fragment key={pkg.id}>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{pkg.package_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{pkg.salon_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">₹{pkg.actual_price}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{pkg.discount_price}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {serviceNames.length > 0 ? (
                                <ul className="list g-disc space-y-1">
                                  {serviceNames.map((name, i) => (
                                    <li key={i} className="flex items-center">
                                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                                      {name}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400 italic">No services</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-line">
                              {pkg.package_time.days > 0 && `${pkg.package_time.days} days\n`}
                              {pkg.package_time.hours > 0 && `${pkg.package_time.hours} hours\n`}
                              {pkg.package_time.minutes > 0 && `${pkg.package_time.minutes} mins\n`}
                              {pkg.package_time.seating > 0 && `${pkg.package_time.seating} Seating`}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 justify-center">
                                <button
                                  onClick={() => deletePackage(pkg.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Package"
                                >
                                  <AiFillDelete className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => setUpdateFormOpened(index)}
                                  className="text-indigo-600 hover:text-indigo-800"
                                  title="Edit Package"
                                >
                                  <FaEdit className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Edit Modal */}
                          {updateFormOpened === index && (
                            <tr>
                              <td colSpan={7} className="p-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="p-6">
                                  <Modal closeModal={() => setUpdateFormOpened(null)}>
                                    <PackageForm
                                      packages={pkg}
                                      setPackages={(data) => {
                                        setPackages((prev) =>
                                          prev.map((p) => (p.id === data.id ? data : p))
                                        );
                                        setUpdateFormOpened(null);
                                      }}
                                      closeModal={() => setUpdateFormOpened(null)}
                                    />
                                  </Modal>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePackages;