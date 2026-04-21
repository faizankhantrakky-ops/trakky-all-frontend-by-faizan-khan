import React, { useState, useEffect, useContext } from "react";
import { Search, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../Context/Auth";
import { Link } from "react-router-dom";

const CustomerEx = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    GetCustomerDetails();
  }, []);

  const GetCustomerDetails = async () => {

    if (!navigator.onLine) {
              toast.error("No Internet Connection");
              return;
            }

            
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/clientwork-pos-request/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.results || data);
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please check your authentication token.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const SearchQuery = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredExperiences = experiences.filter((exp) => {
    const name = exp?.service ? exp.service.toLowerCase() : "";
    const categoryName = exp?.category_data?.category_name
      ? exp.category_data.category_name.toLowerCase()
      : "";
    const description = exp?.description ? exp.description.toLowerCase() : "";

    const query = searchQuery.toLowerCase();
    return (
      name.includes(query) ||
      categoryName.includes(query) ||
      description.includes(query)
    );
  });

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Customer Experience
                </h1>
                <p className="text-gray-600 mt-1">
                  View and manage customer feedback and experience
                </p>
              </div>
              <Link
                to="/ProfilePreview/salon-profile-preview-page"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm group"
              >
                Add New Experience Request
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by service name, category, or description.."
                value={searchQuery}
                onChange={SearchQuery}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                          <p className="text-gray-600">Loading experiences..</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredExperiences && filteredExperiences.length > 0 ? (
                    filteredExperiences.map((exp, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={exp.client_image}
                              alt={exp.service}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64";
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {exp.service || "-"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                            {exp?.category_name || exp?.category_data?.category_name || "-"}
                          </span>
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {exp?.description || "No description provided"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              exp?.is_approved
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                            {exp?.is_approved ? "Approved" : "Rejected"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 px-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Experiences Found
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            {searchQuery
                              ? "No customer experiences match your search criteria. Try a different search term."
                              : "No customer experiences have been added yet. Add your first experience to get started."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Optional: Pagination would go here */}
            {filteredExperiences.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredExperiences.length}</span> experiences
                  </p>
                  {/* Add pagination buttons here if needed */}
                </div>
              </div>
            )}
          </div>

          {/* Stats Card (Optional) */}
          {filteredExperiences.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-semibold text-xl">
                      {filteredExperiences.length}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Experiences</p>
                    <p className="text-lg font-semibold text-gray-900">
                      All Records
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold text-xl">
                      {filteredExperiences.filter(exp => exp?.is_approved).length}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-lg font-semibold text-gray-900">
                      Positive Feedback
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-red-600 font-semibold text-xl">
                      {filteredExperiences.filter(exp => !exp?.is_approved).length}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-lg font-semibold text-gray-900">
                      Needs Review
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerEx;