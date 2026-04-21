import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiClock, FiUser, FiActivity, FiInfo, FiSearch, FiCalendar } from "react-icons/fi";
import { CircularProgress, Chip, Avatar } from "@mui/material";
import { format } from "date-fns";

const Logs = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const LogsPerPage = 12;

  const getLogs = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/audit-log/?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setLogsData(data.results || []);
        setTotalLogs(data.count || 0);
      } else if (response.status === 401) {
        toast.error("Session expired. Logging out...", {
          duration: 4000,
          position: "top-center",
          style: { background: "#ef4444", color: "#fff", borderRadius: "10px" },
        });
        logoutUser();
      } else {
        throw new Error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load activity logs", {
        duration: 4000,
        position: "top-center",
        style: { background: "#333", color: "#fff", borderRadius: "10px" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authTokens?.access) {
      getLogs(page);
    }
  }, [page, authTokens?.access]);

  const totalPages = Math.ceil(totalLogs / LogsPerPage);

  // Filter logs by search
  const filteredLogs = logsData.filter(log =>
    log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("add")) return "bg-green-100 text-green-800 border-green-200";
    if (act.includes("update") || act.includes("edit")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (act.includes("delete") || act.includes("remove")) return "bg-red-100 text-red-800 border-red-200";
    if (act.includes("login") || act.includes("auth")) return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button key={1} onClick={() => setPage(1)} className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
          1
        </button>
      );
      if (startPage > 2) pageNumbers.push(<span key="start-ellipsis" className="px-2">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            page === i
              ? "bg-[#502DA6] text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push(<span key="end-ellipsis" className="px-2">...</span>);
      pageNumbers.push(
        <button key={totalPages} onClick={() => setPage(totalPages)} className="px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  // Improved safe date formatting helper for IST timestamps
  const safeFormatDate = (timestamp, dateFormat) => {
    if (!timestamp) return "-";
    try {
      // Parse the timestamp string like "2025-12-01 11:39:59 IST"
      const date = new Date(timestamp.replace(" IST", "+05:30")); // Handle IST timezone
      if (isNaN(date.getTime())) {
        // Fallback: try without timezone
        const fallbackDate = new Date(timestamp);
        if (isNaN(fallbackDate.getTime())) return timestamp; // Return raw if still invalid
        return format(fallbackDate, dateFormat);
      }
      return format(date, dateFormat);
    } catch (error) {
      console.error("Date formatting error:", error, timestamp);
      return timestamp || "-"; // Return raw timestamp if formatting fails
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 f ont-sans antialiased">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FiActivity className="text-[#502DA6]" />
              Activity Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track all system activities and user actions in real-time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by user, action, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502DA6] transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiClock className="text-gray-500" />
              <span>Total Logs: <strong className="text-gray-900">{totalLogs}</strong></span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <CircularProgress size={48} thickness={4} />
                <p className="mt-4 text-base font-medium">Loading activity logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-500">
                  {searchTerm ? "No logs match your search." : "No activity logs found."}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      {/* Timestamp */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <FiClock className="text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {safeFormatDate(log.timestamp, "dd MMM yyyy")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {safeFormatDate(log.timestamp, "hh:mm:ss a")}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar sx={{ width: 36, height: 36, bgcolor: "#502DA6", fontSize: "0.9rem" }}>
                            {log.user?.[0]?.toUpperCase() || "U"}
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log.user || "System"}</div>
                            <div className="text-xs text-gray-500">User Action</div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <Chip
                          label={log.action}
                          size="small"
                          className={`font-medium ${getActionColor(log.action)} border`}
                        />
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                        <div className="flex items-start gap-2">
                          <FiInfo className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{log.details || "No additional details"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {!loading && totalLogs > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing <strong>{filteredLogs.length}</strong> of <strong>{totalLogs}</strong> logs
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {renderPageNumbers()}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Logs;