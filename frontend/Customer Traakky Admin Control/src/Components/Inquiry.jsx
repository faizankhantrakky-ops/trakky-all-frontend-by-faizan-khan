import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [inquiryData, setInquiryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const inquiriesPerPage = 50;
  const totalPages = Math.ceil(totalInquiries / inquiriesPerPage);

  const getInquiry = async () => {
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
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTotalInquiries(data.count);
      setInquiryData(data.results);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
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

  const setTimeFormate = (time) => {
    let hours = new Date(time).getHours();
    let minutes = new Date(time).getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const setDateFormat = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    var strDate = [day, month, year].join("-");
    return strDate;
  };

  const handlePageChange = (e) => {
    let selectedPage = e.target.id;
    setPage(parseInt(selectedPage));
  };

  useEffect(() => {
    getInquiry();
  }, [page]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select>
                  <option selected>Salon name</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="Search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    if (page !== 1) {
                      setPage(1);
                    } else {
                      getInquiry();
                    }
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={header === "Address" ? "address-field-s" : ""}
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {inquiryData.length !== 0 ? (
                  inquiryData.map((inquiry, index) => (
                    <>
                      <tr key={index}>
                        <td>{50 * (page - 1) + index + 1}</td>
                        <td>{inquiry.name}</td>
                        <td>
                          {inquiry.salon_user !== null
                            ? inquiry.user_name || "-"
                            : "-"}
                        </td>
                        <td>
                          {inquiry.salon_user !== null
                            ? inquiry.user_phonenumber || "-"
                            : "-"}
                        </td>
                        <td>{inquiry.category}</td>
                        <td>{inquiry.actiontype}</td>
                        <td>{setDateFormat(inquiry.time)}</td>
                        <td>{setTimeFormate(inquiry.time)}</td>
                        <td>
                          {inquiry.location.latitude ||
                            inquiry.location.lattitude}
                        </td>
                        <td>{inquiry.location.longitude}</td>
                      </tr>
                    </>
                  ))
                ) : (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        {searchTerm === "" ? "No Entries" : "Not found"}
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
            Showing {50 * (page - 1) + 1} to{" "}
            {50 * (page - 1) + inquiryData?.length} of {totalInquiries} entries
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
    </>
  );
};

export default Inquiry;
