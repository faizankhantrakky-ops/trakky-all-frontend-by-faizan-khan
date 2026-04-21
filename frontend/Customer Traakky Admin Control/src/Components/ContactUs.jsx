import React, { useState, useEffect, useContext } from "react";

import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

import "./css/salonelist.css";

const ContactUs = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [contactUsData, setContactUsData] = useState([]);
  const [filterField, setFilterField] = useState("email");
  const [filteredContactUs, setFilteredContactUs] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const tableHeaders = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone number",
    "Message",
    "Action",
  ];

  const getContactUs = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/salons/contact-us/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        let FilterData = await data.contacts.filter((contactUs) => {
          return (
            contactUs.platform === "salon" || contactUs.platform === "Salon"
          );
        });
        setContactUsData(FilterData);
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
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
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setSearchTerm("");
        getContactUs();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(
          `Error Deleting ContactUs with status code ${response.status}`,
          {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error(`${error}`, {
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
  useEffect(() => {
    getContactUs();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredContactUs(contactUsData);
    }
    setFilteredContactUs(
      contactUsData.filter((customer) => {
        return customer[filterField]
          .toString()
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  return (
    <div className="tb-body-content">
      <Toaster />
      <div className="tb-body-data">
        <div className="tb-body-input">
          <div className="tb-body-src-fil">
            <div className="tb-body-filter">
              <select onChange={(e) => setFilterField(e.target.value)}>
                <option value={"email"}> Email</option>
                <option value={"phone_no"}>phone number</option>
              </select>
            </div>
            <div className="tb-body-search">
              <div className="tb-search-field">
                <input
                  type={filterField === "email" ? "text" : "number"}
                  name="search-inp"
                  placeholder="search here.."
                  value={searchTerm}
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
              <tr>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={header === "Address" ? "address-field-s" : ""}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchTerm ? (
                filteredContactUs.length !== 0 ? (
                  filteredContactUs.map((contactUs, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{contactUs.id}</td>
                          <td>{contactUs.first_name}</td>
                          <td>{contactUs.last_name}</td>
                          <td>{contactUs.email}</td>
                          <td>{contactUs.phone_no}</td>
                          <td>{contactUs.message}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteContactUs(contactUs.id)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                      </>
                    );
                  })
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
                        Not Found
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                contactUsData.map((contactUs, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>{contactUs.id}</td>
                        <td>{contactUs.first_name}</td>
                        <td>{contactUs.last_name}</td>
                        <td>{contactUs.email}</td>
                        <td>{contactUs.phone_no}</td>
                        <td>{contactUs.message}</td>
                        <td>
                          <AiFillDelete
                            onClick={() => deleteContactUs(contactUs.id)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tb-body-footer">
        <div className="tb-reasult-count">
          showing 1 to {contactUsData.length} of {contactUsData.length} entries
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
