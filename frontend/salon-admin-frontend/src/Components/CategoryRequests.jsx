import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import "./css/salonelist.css";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useConfirm } from "material-ui-confirm";
import toast, { Toaster } from "react-hot-toast";
// import CategoryRequestForm from "./Forms/CategoryRequestForm";
import Modal from "./UpdateModal";


const CategoryRequests = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();
  const [requests, setRequests] = useState([]);
  const [filterField, setFilterField] = useState("username");
  const [filteredRequests, setFilteredCustomers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    try {
      let url = `https://backendapi.trakky.in/salonvendor/category-requests/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setRequests(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
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
      console.error("Network error:", error.message);
      toast.error("Failed to fetch customers. Please try again later.", {
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

  const deleteRequests = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this?",
      });

      let response = await fetch(
        `https://backendapi.trakky.in/salonvendor/category-requests/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        toast.success("User Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            color: "#fff",
            backgroundColor: "#333",
          },
        });
        getRequests(false);
      } else if (response.status === 401) {
        toast.error("You're logged out");
        logoutUser();
      } else {
        toast.error("Something went wrong", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error === undefined || error === "cancel") return;
      toast.error("Something went wrong", {
        duration: 4000,
        position: "top-center",
      });
      console.log("Error: ", error);
    }
  };

  const tableHeaders = [
    "Vendor User",
    "Vendor Ownername",
    "Vendor Businessname",
    "Salon Name",
    "Master Category",
    "Category Name",
    "Gender",
    "Approved",
  ];

  const handleApprove = (request) => {
    console.log("Details : ", request);
    setSelectedRequest(request);
    setFormOpen(true);
  };

  return (
    <>
      <div className="tb-body-content">
        <div className="tb-body-data">
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
                {requests.length !== 0 ? (
                  <>
                    {requests.map((request, index) => (
                      <tr key={index}>
                        <td>{request.vendor_user || "-"}</td>
                        <td>{request.vendor_ownername || "-"}</td>
                        <td>{request.vendor_businessname || "-"}</td>
                        <td>{request.salon_name || "-"}</td>
                        <td>{request.master_category || "-"}</td>
                        <td>{request.category_name || "-"}</td>
                        <td>
                          {request.gender
                            ? request.gender === "male"
                              ? "Male"
                              : "Female"
                            : "-"}
                        </td>
                        <td>
                          {request?.is_approved ? (
                            <AssignmentTurnedInIcon />
                          ) : (
                            <PendingActionsIcon
                              onClick={() => handleApprove(request)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                    {formOpen && (
                      <tr>
                        <td style={{ padding: 0 }}>
                          <Modal closeModal={() => setFormOpen(false)}>
                            {/* <CategoryRequestForm requests={selectedRequest} /> */}
                          </Modal>
                        </td>
                      </tr>
                    )}
                  </>
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
                        No entries
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-result-count">
            showing 1 to {filteredRequests.length} of {filteredRequests.length}{" "}
            entries
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default CategoryRequests;
