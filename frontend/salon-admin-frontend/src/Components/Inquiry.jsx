import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Inquiry = () => {
  const tableHeaders = [
    "Index",
    "Salon Name",
    "User Name",
    "User Phone Number",
    "Category",
    "Action Type",
    "Date",
    "Time",
    "Latitude",
    "Longitude",
  ];

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const inquiriesPerPage = 50;
  const totalPages = Math.ceil(totalInquiries / inquiriesPerPage);

  /* --------------------------------------------------------------
     API – GET INQUIRIES
  -------------------------------------------------------------- */
  const getInquiry = async () => {
    setLoading(true);
    let url;
    if (searchTerm === "") {
      url = `https://backendapi.trakky.in/salons/log-entry/?page=${page}`;
    } else {
      url = `https://backendapi.trakky.in/salons/log-entry/?page=${page}&query=${encodeURIComponent(
        searchTerm.trim()
      )}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setTotalInquiries(result.count);
      setData(result.results || []);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with the backend fetch", {
        duration: 4000,
        position: "top-center",
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------------
     DATE & TIME FORMATTERS
  -------------------------------------------------------------- */
  const setTimeFormate = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const setDateFormat = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* --------------------------------------------------------------
     PAGINATION & SEARCH
  -------------------------------------------------------------- */
  const handlePageChange = (e) => {
    const selectedPage = parseInt(e.target.id);
    setPage(selectedPage);
  };

  useEffect(() => {
    getInquiry();
  }, [page, searchTerm]);

  const handleSearch = () => {
    if (page !== 1) setPage(1);
    else getInquiry();
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 p-3 font-sans antialiased">
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header + Search */}
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Inquiry Logs
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-48">
                  <select className="w-full h-11 px-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="salon_name">Salon Name</option>
                  </select>
                </div>

                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      placeholder="Search by salon name..."
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`h-11 px-5 text-sm font-medium text-white rounded-md transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] table-auto">
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
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                          <p className="text-sm font-medium">Loading inquiries...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3"></div>
                          <p className="text-base font-medium">
                            {searchTerm ? "No results found" : "No entries"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((inquiry, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiriesPerPage * (page - 1) + index + 1}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">
                          {inquiry.name || "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.salon_user ? inquiry.user_name || "-" : "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.salon_user ? inquiry.user_phonenumber || "-" : "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.category || "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.actiontype || "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {setDateFormat(inquiry.time)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {setTimeFormate(inquiry.time)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.location?.latitude || inquiry.location?.lattitude || "-"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {inquiry.location?.longitude || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-600">
                Showing <strong>{loading ? "—" : inquiriesPerPage * (page - 1) + 1}</strong> to{" "}
                <strong>{loading ? "—" : Math.min(inquiriesPerPage * page, totalInquiries)}</strong> of{" "}
                <strong>{loading ? "—" : totalInquiries}</strong> entries
              </p>

              {/* Pagination */}
              <div className="flex items-center gap-1">
                <button
                  id="1"
                  onClick={handlePageChange}
                  disabled={loading || page === 1}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  First
                </button>

                {page > 1 && (
                  <button
                    id={page - 1}
                    onClick={handlePageChange}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                )}

                {page > 3 && <span className="px-2 text-sm text-gray-500">...</span>}

                {page > 2 && (
                  <button id={page - 2} onClick={handlePageChange} disabled={loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                    {page - 2}
                  </button>
                )}

                {page > 1 && (
                  <button id={page - 1} onClick={handlePageChange} disabled={loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                    {page - 1}
                  </button>
                )}

                <button disabled className="px-3 py-1.5 text-sm rounded-md border border-blue-500 bg-blue-50 text-blue-700 font-medium cursor-default">
                  {page}
                </button>

                {page < totalPages && (
                  <button id={page + 1} onClick={handlePageChange} disabled={loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                    {page + 1}
                  </button>
                )}

                {page < totalPages - 1 && (
                  <button id={page + 2} onClick={handlePageChange} disabled={loading} className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">
                    {page + 2}
                  </button>
                )}

                {page < totalPages - 2 && <span className="px-2 text-sm text-gray-500">...</span>}

                {page < totalPages && (
                  <button
                    id={page + 1}
                    onClick={handlePageChange}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Next
                  </button>
                )}

                <button
                  id={totalPages}
                  onClick={handlePageChange}
                  disabled={loading || page === totalPages}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inquiry;