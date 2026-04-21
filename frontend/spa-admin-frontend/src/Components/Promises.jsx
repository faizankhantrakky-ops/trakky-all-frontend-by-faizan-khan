import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";

import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/spaelist.css";
import AddPromises from "./Forms/AddPromises";
import Modal from "./UpdateModal";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const Promises = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [promises, setPromises] = useState([]);
  const [updateFormOpened, setUpdateFormOpened] = useState(null);

  const [filteredPromises, setfilteredPromises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getPromises = async () => {
    try {
      const response = await fetch("https://backendapi.trakky.in/spas/promises/");
      if (!response.ok) {
        const errorMessage = await response.text();
        if (response.status >= 400 && response.status < 500) {
          // Client-side error
          throw new Error(`Client Error: ${response.status} - ${errorMessage}`);
        } else if (response.status >= 500 && response.status < 600) {
          // Server-side error
          throw new Error(`Server Error: ${response.status}`);
        } else {
          // Other errors
          throw new Error(
            `Unexpected Error: ${response.status} - ${errorMessage}`
          );
        }
      }
      const data = await response.json();
      setPromises(data);
    } catch (err) {
      console.log("Error : ", err);
      toast.error(err.message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#ffffff",
        },
      });
    }
  };

  const deletePromise = async (id) => {
    try {
      await confirm({
        description: "This will delete the promises permanently.",
      });
      const resp = await fetch(
        `https://backendapi.trakky.in/spas/promises/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 204) {
        toast.success("Promises deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#ffffff",
          },
        });
        getPromises();
      } else if (resp.status === 401) {
        alert("You'r logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong ${resp.status}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#ffffff",
          },
        });
      }
    } catch (err) {
      if (err === undefined) {
        return;
      }
      toast.error(`Something went wrong : ${err}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#ffffff",
        },
      });
    }
  };

  useEffect(() => {
    getPromises();
  }, [updateFormOpened]);

  const tableHeaders = ["Index", "Promises", "Action"];

  useEffect(() => {
    setfilteredPromises(
      promises.filter((spa) => {
        // Check if the promise contains the searchTerm
        return spa.promise.toLowerCase().includes(searchTerm.toLowerCase());
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
              <div className="tb-body-filter">
                <select>
                  <option>Promise</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
                    name="search-inp"
                    placeholder="search here.."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="tb-add-item">
              <Link to="/addpromises">
                {" "}
                <button type="submit">
                  <AddIcon />
                  <span> Add Item</span>
                </button>
              </Link>
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
                {searchTerm ? (
                  filteredPromises.length !== 0 ? (
                    filteredPromises.map((promises, index) => {
                      return (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td className="description-td-quill">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: promises.promise,
                                }}
                              />
                            </td>
                            <td>
                              <AiFillDelete
                                onClick={() => deletePromise(promises.id)}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                              &nbsp;&nbsp;
                              <FaEdit
                                onClick={() => setUpdateFormOpened(index)}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </td>
                          </tr>

                          {updateFormOpened === index && (
                            <tr>
                              <td style={{ padding: 0 }}>
                                <Modal
                                  closeModal={() => setUpdateFormOpened(false)}
                                >
                                  <AddPromises
                                    promisesData={promises}
                                    setPromisesData={(data) => {
                                      console.log("promises : ", promises);
                                      setPromises(
                                        promises.map((promises) =>
                                          promises.id === data.id
                                            ? data
                                            : promises
                                        )
                                      );
                                      setUpdateFormOpened(null);
                                    }}
                                    closeModal={() =>
                                      setUpdateFormOpened(false)
                                    }
                                  />
                                </Modal>
                              </td>
                            </tr>
                          )}
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
                ) : promises.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={17}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        Not Entries
                      </div>
                    </td>
                  </tr>
                ) : (
                  promises.map((promises, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td className="description-td-quill">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: promises.promise,
                              }}
                            />
                          </td>
                          <td>
                            <AiFillDelete
                              onClick={() => deletePromise(promises.id)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                            &nbsp;&nbsp;
                            <FaEdit
                              onClick={() => setUpdateFormOpened(index)}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>

                        {updateFormOpened === index && (
                          <tr>
                            <td style={{ padding: 0 }}>
                              <Modal
                                closeModal={() => setUpdateFormOpened(false)}
                              >
                                <AddPromises
                                  promisesData={promises}
                                  setPromisesData={(data) => {
                                    setPromises(
                                      promises.map((promises) =>
                                        promises.id === data.id
                                          ? data
                                          : promises
                                      )
                                    );
                                    setUpdateFormOpened(null);
                                  }}
                                  closeModal={() => setUpdateFormOpened(false)}
                                />
                              </Modal>
                            </td>
                          </tr>
                        )}
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
            showing 1 to {promises.length} of {promises.length} entries
          </div>
        </div>
      </div>
    </>
  );
};

export default Promises;
