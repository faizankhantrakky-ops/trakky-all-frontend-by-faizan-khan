import React, { useState, useEffect, useContext } from "react";

import "./css/salonelist.css";
import toast, { Toaster } from "react-hot-toast";

const BlogUserEmails = () => {

  const [blogUserEmail, setBlogUserEmail] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmails, seetFilterEmails] = useState([]);


  const tableHeaders = [
    "Sr No.",
    "Email",
  ];

  const getBLogUSersEmail = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/email/");
      const data = await response.json();
      if (response.ok) {
        setBlogUserEmail(data.emails);
      }
      else {
        toast.error(`Failed to fetch blog users email : ${response.status} `,
          {
            duration: 4000,
            position: "top-center",
          });
      }
    } catch (error) {
      toast.error(`Error fetching blog users email : ${error} `,
        {
          duration: 4000,
          position: "top-center",
        });
    }
  };

  useEffect(() => {
    getBLogUSersEmail();
  }, []);

  useEffect(() => {
    seetFilterEmails(
      blogUserEmail?.filter((email) => {
        return email.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">


              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search Email.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* <div>
                  <button type="submit">Search</button>
                </div> */}
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
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {searchTerm ? (
                  filterEmails.length !== 0 ? (
                    filterEmails.map((email, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{email}</td>
                      </tr>
                    )
                    )) : (
                    <tr className="not-found">
                      <td colSpan={2}>
                        <div
                          style={{
                            maxWidth: "82vw",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          Not Found
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  blogUserEmail?.map((email, index) => (
                    <>
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{email}</td>
                      </tr>
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {blogUserEmail.length} of {blogUserEmail.length} entries
          </div>
        </div>
      </div>

    </>
  );
};

export default BlogUserEmails;
