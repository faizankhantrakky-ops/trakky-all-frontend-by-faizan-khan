import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import toast, {Toaster} from "react-hot-toast";

const Logs = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logsData, setLogsData] = useState([]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getLogs = async (pageNumber) => {
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
        setLogsData(data.results);
        setTotalLogs(data.count);
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
        throw new Error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch logs. Please try again later", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      logoutUser();
    }
  };

  useEffect(() => {
    getLogs(page);
  }, [page, authTokens.access]);

  const LogsPerPage = 100;
  const totalPages = Math.ceil(totalLogs / LogsPerPage);

  const tableHeaders = ["TimeStamp", "User", "Action", "Details"];

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum visible page numbers

    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          className={page === i ? "active" : ""}
        >
          {i}
        </span>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <span key={1} onClick={() => handlePageChange(1)}>
          «
        </span>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <span key={totalPages} onClick={() => handlePageChange(totalPages)}>
          »
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <>
    <Toaster/>
      <div className="tb-body-content">
        <table className="tb-table">
          <thead className="tb-table-head">
            <tr className="tb-table-row">
              {tableHeaders.map((head, index) => (
                <th className="tb-table-header" key={index}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tb-table-body">
            {logsData.map((log, index) => (
              <tr className="tb-table-row" key={index}>
                <td className="tb-table-data">{log.timestamp}</td>
                <td className="tb-table-data">{log.user}</td>
                <td className="tb-table-data">{log.action}</td>
                <td className="tb-table-data">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing {logsData.length} of {totalLogs} entries
          </div>
          <div className="tb-more-results">
            <div className="tb-pagination">{renderPageNumbers()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
