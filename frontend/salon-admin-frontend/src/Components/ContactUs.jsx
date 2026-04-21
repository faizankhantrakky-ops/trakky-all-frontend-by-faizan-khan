import React, { useState, useEffect, useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const ContactUs = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [contactUsData, setContactUsData] = useState([]);
  const [filterField, setFilterField] = useState("email");
  const [filteredContactUs, setFilteredContactUs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // NEW: Loading state

  const tableHeaders = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone Number",
    "Message",
    "Action",
  ];

  /* --------------------------------------------------------------
     API – GET CONTACT US (now with loading state)
  -------------------------------------------------------------- */
  const getContactUs = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/contact-us/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        let FilterData = data.contacts.filter((contactUs) => {
          return contactUs.platform === "salon" || contactUs.platform === "Salon";
        });
        setContactUsData(FilterData);
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  /* --------------------------------------------------------------
     API – DELETE CONTACT US (unchanged)
  -------------------------------------------------------------- */
  const deleteContactUs = async (id) => {
    try {
      await confirm({
        description: "This will delete the contact us data permanently",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/contact-us/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("ContactUs Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
        });
        setSearchTerm("");
        getContactUs(); // Re-fetch with loading
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(
          `Error Deleting ContactUs with status code ${response.status}`,
          {
            duration: 4000,
            position: "top-center",
            style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
          }
        );
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
    }
  };

  useEffect(() => {
    getContactUs();
  }, []);

  /* --------------------------------------------------------------
     FILTER LOGIC (unchanged)
  -------------------------------------------------------------- */
  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredContactUs(contactUsData);
    }
    setFilteredContactUs(
      contactUsData.filter((customer) => {
        return customer[filterField]
          ?.toString()
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField, contactUsData]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-3 font-sans antialiased">
        {/* Full-Width Card */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header + Search */}
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Us Messages
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Filter Field */}
                <div className="w-full sm:w-48">
                  <select
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                    className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="email">Email</option>
                    <option value="phone_no">Phone Number</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={filterField === "email" ? "text" : "tel"}
                      value={searchTerm}
                      placeholder={`Search by ${filterField === "email" ? "email" : "phone"}...`}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {tableHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* LOADING STATE */}
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                          <p className="text-sm font-medium">Loading messages...</p>
                        </div>
                      </td>
                    </tr>
                  ) : searchTerm ? (
                    filteredContactUs.length !== 0 ? (
                      filteredContactUs.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 text-sm text-gray-700">{c.id}</td>
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">
                            {c.first_name}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">{c.last_name}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{c.email}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">{c.phone_no}</td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            <div className="max-w-xs truncate" title={c.message}>
                              {c.message || "-"}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button
                              onClick={() => deleteContactUs(c.id)}
                              className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                              title="Delete Message"
                            >
                              <AiFillDelete className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                            <p className="text-base font-medium">No results found</p>
                          </div>
                        </td>
                      </tr>
                    )
                  ) : contactUsData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">No contact messages</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contactUsData.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-700">{c.id}</td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {c.first_name}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">{c.last_name}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{c.email}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{c.phone_no}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          <div className="max-w-xs truncate" title={c.message}>
                            {c.message || "-"}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => deleteContactUs(c.id)}
                            className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Delete Message"
                          >
                            <AiFillDelete className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <strong>
                  {loading ? "—" : searchTerm ? filteredContactUs.length : contactUsData.length}
                </strong>{" "}
                of <strong>{loading ? "—" : contactUsData.length}</strong> entries
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;