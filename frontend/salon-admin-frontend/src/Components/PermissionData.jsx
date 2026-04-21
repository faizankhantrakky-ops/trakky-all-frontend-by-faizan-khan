import React, { useState, useEffect, useContext } from "react";

import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

import "./css/salonelist.css";
import { Modal } from "@mui/material";
import CustomPermissions from "./CustomPermissions";

const PermissionData = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const confirm = useConfirm();

  const [permissionData, setPermissionData] = useState([]);
  const [filterField, setFilterField] = useState("username");
  const [filteredPermissionData, setFilteredPermissionData] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPermissionData, setEditPermissionData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const tableHeaders = [
    "Index",
    "Username",
    "Permissions",
    "Is superuser",
    "Action",
  ];

  const getPermissionData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salons/custom-user-permissions/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setPermissionData(data);
      } else {
        toast.error(`Error Fetching Data With Status ${response.status}`, {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const deletePermission = async (id) => {
    try {
      await confirm({
        description: "This will delete the access data permanently",
      });

      const response = await fetch(
        `https://backendapi.trakky.in/salons/custom-user-permissions/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("Access Data Deleted Successfully", {
          duration: 4000,
          position: "top-center",
        });
        setSearchTerm("");
        getPermissionData();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(
          `Error Deleting Access Data with status code ${response.status}`,
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;

      toast.error(`${error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };
  useEffect(() => {
    getPermissionData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredPermissionData(permissionData);
    }
    setFilteredPermissionData(
      permissionData.filter((permission) => {
        return permission[filterField]
          .toString()
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, filterField]);

  useEffect(() => {
    setSearchTerm("");
  }, [filterField]);

  const toastMessageHandler = (message, type) => {

    if (type === "error") {
      toast.error(message, {
        duration: 4000,
        position: "top-center",
      });
    } else if (type === "success") {
      toast.success(message, {
        duration: 4000,
        position: "top-center",
      });
    } else {
      toast(message, {
        duration: 4000,
        position: "top-center",
      });
    }
  };


  return (
    <>
      <div className="tb-body-content">
        <Toaster />
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select onChange={(e) => setFilterField(e.target.value)}>
                  <option value={"username"}>User name</option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type={"text"}
                    name="search-inp"
                    placeholder="search here.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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
                  filteredPermissionData.length !== 0 ? (
                    filteredPermissionData.map((permission, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{permission?.username ?? "-"}</td>
                            <td>{permission.access.join(",")}</td>
                            <td>{permission?.is_superuser ? "Yes" : "No"}</td>
                            <td>
                              <AiFillDelete
                                onClick={() => deletePermission(permission.id)}
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
                      <td colSpan={4}>
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
                  permissionData.map((permission, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{permission?.username ?? "-"}</td>
                          <td>{permission?.access?.join(",")}</td>
                          <td>{permission?.is_superuser ? "Yes" : "No"}</td>
                          <td>
                            <button
                              onClick={() => {
                                setEditPermissionData(permission);
                                setEditModalOpen(true);
                              }}
                              className=" underline mb-2"
                            >
                              Edit
                            </button>
                            <AiFillDelete
                              onClick={() => deletePermission(permission.id)}
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
            showing 1 to {permissionData?.length} of {permissionData?.length}{" "}
            entries
          </div>
        </div>


      </div>
      <Modal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditPermissionData({});
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          maxWidth: 900,
          maxHeight: "90vh",
          margin: "auto",
          overflowY: "auto",
          backgroundColor: "white",

        }}
      >
        <CustomPermissions
          permissionsData={editPermissionData?.access}
          selectedUserData={editPermissionData?.user}
          objId={editPermissionData?.id}
          closeEditModal={() => {
            setEditModalOpen(false);
            setEditPermissionData({});
          }
          }
          toastMessageHandler={toastMessageHandler}
        />
      </Modal>
    </>
  );
};

export default PermissionData;