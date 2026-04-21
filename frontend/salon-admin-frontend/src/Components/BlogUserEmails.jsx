import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiMail, FiSearch, FiLoader } from "react-icons/fi";

const BlogUserEmails = () => {
  const [blogUserEmail, setBlogUserEmail] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmails, setFilterEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBlogUsersEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/email/");
      const data = await response.json();

      if (response.ok) {
        setBlogUserEmail(data.emails || []);
      } else {
        toast.error(`Failed to fetch emails: ${response.status}`, {
          style: { background: "#ef4444", color: "#fff" },
          icon: "Error",
        });
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`, {
        style: { background: "#ef4444", color: "#fff" },
        icon: "Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBlogUsersEmail();
  }, []);

  useEffect(() => {
    const filtered = blogUserEmail.filter((email) =>
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterEmails(filtered);
  }, [searchTerm, blogUserEmail]);

  const displayData = searchTerm ? filterEmails : blogUserEmail;

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-3">
        <div className=" mx-auto">

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Blog User Emails
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  List of all registered blog notification emails
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50"
              />
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
                  <p className="text-sm font-medium text-gray-600">Loading emails...</p>
                </div>
              </div>
            )}

            <div className={isLoading ? "opacity-50" : ""}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sr No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {displayData.length > 0 ? (
                    displayData.map((email, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            <FiMail className="w-4 h-4" />
                            {email}
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-12 text-center">
                        <div className="text-gray-500">
                          {searchTerm ? (
                            <>
                              <p className="text-lg font-medium">No emails found</p>
                              <p className="text-sm mt-1">Try adjusting your search</p>
                            </>
                          ) : (
                            <>
                              <p className="text-lg font-medium">No blog users yet</p>
                              <p className="text-sm mt-1">Emails will appear here when users subscribe</p>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-sm text-gray-600 text-center">
            Showing 1 to {displayData.length} of {blogUserEmail.length} entries
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogUserEmails;