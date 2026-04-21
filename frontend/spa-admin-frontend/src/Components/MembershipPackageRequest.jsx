import React, { useState, useEffect, useContext } from "react";
import AsyncSelect from "react-select/async";
import { useLocation } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Tooltip } from "@mui/material";
import GeneralModal from "./generalmodal/GeneralModal";

const MessagePackageRequest = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

 
  const [MembershipPackageDataLoading, setMembershipPackageDataLoading] = useState(false);

  const [membershipPackageRequestData, setMembershipPackageRequestData] = useState([]);

  const [approveMembershipModalOpen, setApproveMembershipModalOpen] = useState(false);
  const [approveMembershipData, setApproveMassageData] = useState({});

  const [approveLoadingBtn, setApproveLoadingBtn] = useState(false);


  const getMembershipPackageRequestData = async () => {
    setMembershipPackageDataLoading(true);

    let url = "https://backendapi.trakky.in/spavendor/membership-package-request-admin/";


    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setMembershipPackageRequestData(data);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch membership package request data. Please try again later."
      );
    } finally {
      setMembershipPackageDataLoading(false);
    }
  };


  const tableHeaders = [
    "Index",
    "Spa name",
    "Spa area,city",
    "Package name",
    "Include massage names",
    "Massage price",
    "Massage discount price",
    "Massage duration",
    "Status",
    "Action",
  ];

  const handleApproveMassage = async (payload , id) => {
    setApproveLoadingBtn(true);

    let url = `https://backendapi.trakky.in/spavendor/approved-grooming-packages/${id}/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("membereship package approved successfully.");
        getMembershipPackageRequestData();
      }
    } catch (error) {
      toast.error("Failed to approve membereship package. Please try again later.");
    } finally {
      setApproveLoadingBtn(false);
    }
  };

  useEffect(() => {
    getMembershipPackageRequestData();
  } , []);


  return (
    <>
      <Toaster />
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input"></div>

          <div className="tb-row-data">
            <table className="tb-table">
              <thead>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    style={
                      header === "Description"
                        ? { maxWidth: "356px", minWidth: "356px" }
                        : {}
                    }
                  >
                    {header}
                  </th>
                ))}
              </thead>
              <tbody>
                {MembershipPackageDataLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : membershipPackageRequestData?.length === 0 ? (
                  <tr className="not-found">
                    <td colSpan={8}>
                      <div
                        style={{
                          maxWidth: "82vw",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                        }}
                      >
                        No data found
                      </div>
                    </td>
                  </tr>
                ) : (
                  membershipPackageRequestData?.map((massage, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{massage?.spa_name}</td>
                        <td>
                          {massage?.spa_area}, {massage?.spa_city}
                        </td>
                        <td>{massage?.package_name}</td> 
                        <td>{massage?.service_names?.map((item , index) => {
                          return <span key={index}>{item}, </span>
                        })}</td>
                     
                        <td>{massage?.actual_price}</td>
                        <td>{massage?.discount_price}</td>
                        <td style={{ maxWidth: "150px" }}>
                          <div style={{ maxWidth: "150px" }}>
                            days : {massage?.offer_timing?.days ?? 0} <br />
                            hours : {massage?.offer_timing?.hours ?? 0} <br />
                            minutes : {massage?.offer_timing?.minutes ?? 0}{" "}
                            <br />
                            seating : {massage?.offer_timing?.seating ?? 0}
                          </div>
                        </td>
                     

                        <td>
                          {massage?.package_status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Pending
                            </span>
                          ) : massage?.package_status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Approved
                            </span>
                          ) : massage?.package_status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {massage?.package_status === "pending" ? (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              <Tooltip
                                title="Approve"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    confirm({
                                      description: `Are you sure you want to approve ${massage?.package_name} ( package )?`,
                                    }).then(() => {
                                      handleApproveMassage({
                                        spa: massage?.spa,
                                        package_name: massage?.package_name,
                                        actual_price: massage?.actual_price,
                                        discount_price: massage?.discount_price,
                                        offer_timing: JSON.stringify(massage?.offer_timing),
                                        service_ids: massage?.service_ids,
                                      } , massage?.id);
                                    }).catch(() => {});
                                  }}
                                >
                                  <AddTaskIcon
                                    sx={{
                                      color: "green",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                              <Tooltip
                                title="Reject"
                                arrow
                                sx={{
                                  backgroundColor: "black",
                                }}
                              >
                                <button
                                  className=""
                                  onClick={() => {
                                    confirm({
                                      description: `Are you sure you want to reject massage ${massage?.category_name}?`,
                                    })
                                      .then(() => {
                                        handleApproveMassage({
                                          package_status: "rejected",
                                          spa: massage?.spa,
                                          package_name: massage?.package_name,
                                          actual_price: massage?.actual_price,
                                          discount_price: massage?.discount_price,
                                          offer_timing: JSON.stringify(massage?.offer_timing),
                                          service_ids: massage?.service_ids,
                                          
                                        } , massage?.id);
                                      })
                                      .catch(() => {});

                                  }}
                                >
                                  <DeleteForeverIcon
                                    sx={{
                                      color: "red",
                                    }}
                                  />
                                </button>
                              </Tooltip>
                            </div>
                          ) : (
                            <div className="tb-action flex gap-5 w-full justify-center items-center ">
                              -
                            </div>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            Showing {membershipPackageRequestData?.length} of {membershipPackageRequestData?.length}{" "}
            entries
          </div>
         
        </div>
      </div>
      
    </>
  );
};

export default MessagePackageRequest;
