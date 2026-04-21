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

const OfferRequestList = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [MembershipPackageDataLoading, setMembershipPackageDataLoading] =
    useState(false);

  const [membershipPackageRequestData, setMembershipPackageRequestData] =
    useState([]);

  const [approveMembershipModalOpen, setApproveMembershipModalOpen] =
    useState(false);
  const [approveMembershipData, setApproveMassageData] = useState({});

  const [approveLoadingBtn, setApproveLoadingBtn] = useState(false);

  const getMembershipPackageRequestData = async () => {
    setMembershipPackageDataLoading(true);

    let url = "https://backendapi.trakky.in/spavendor/offer-request-admin/";

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
        "Failed to fetch offer request data. Please try again later."
      );
    } finally {
      setMembershipPackageDataLoading(false);
    }
  };

  const tableHeaders = [
    "Index",
    "Spa name",
    "Spa area,city",
    "Offer name",
    "Offer type",
    "Service name",
    "Actual price",
    "Discount price",
    "Offer percentage",
    "terms and conditions",
    "coupon_code",
    "how_to_avail",
    "Status",
    "Action",
  ];

  const handleApproveOffer = async (payload, id) => {
    setApproveLoadingBtn(true);

    let url = `https://backendapi.trakky.in/spavendor/approved-offer/${id}/`;

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
        toast.success("offer approved successfully.");
        getMembershipPackageRequestData();
      }
    } catch (error) {
      toast.error(
        "Failed to approve offer. Please try again later."
      );
    } finally {
      setApproveLoadingBtn(false);
    }
  };

  useEffect(() => {
    getMembershipPackageRequestData();
  }, []);

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
                  membershipPackageRequestData?.map((offer, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{offer?.spa_name}</td>
                        <td>
                          {offer?.spa_area}, {offer?.spa_city}
                        </td>
                        <td>{offer?.offer_name}</td>
                        <td>{offer?.offer_type}</td>
                        <td>{offer?.service_name}</td>
                        <td>{offer?.actual_price}</td>
                        <td>{offer?.discount_price}</td>
                        <td>{offer?.offer_percentage}</td>
                        <td>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: offer?.terms_and_conditions,
                            }}
                          />
                        </td>
                        <td>{offer?.coupon_code}</td>
                        <td>{offer?.how_to_avail}</td>
                        <td>
                          {offer?.offer_status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Pending
                            </span>
                          ) : offer?.offer_status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Approved
                            </span>
                          ) : offer?.offer_status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {offer?.offer_status === "pending" ? (
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
                                      description: `Are you sure you want to approve ${offer?.offer_name} ( package )?`,
                                    })
                                      .then(() => {
                                     
                                      
                                        handleApproveOffer(
                                          {
                                            spa: offer?.spa,
                                            offer_name: offer?.offer_name,
                                            discount_price: offer?.discount_price,
                                            offer_percentage: offer?.offer_percentage,
                                            offer_type: offer?.offer_type,
                                            service: offer?.service,
                                            terms_and_conditions: offer?.terms_and_conditions,
                                            coupon_code: offer?.coupon_code,
                                            how_to_avail: offer?.how_to_avail,
                                            offer_status: "approved",
                                          },
                                          offer?.id
                                        );
                                      })
                                      .catch(() => {});
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
                                      description: `Are you sure you want to reject offer ${offer?.offer_name}?`,
                                    })
                                      .then(() => {
                                        handleApproveOffer(
                                          {
                                            spa: offer?.spa,
                                            offer_name: offer?.offer_name,
                                            discount_price: offer?.discount_price,
                                            offer_percentage: offer?.offer_percentage,
                                            offer_type: offer?.offer_type,
                                            service: offer?.service,
                                            terms_and_conditions: offer?.terms_and_conditions,
                                            offer_status: "rejected",
                                          },
                                          offer?.id
                                        );
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
            Showing {membershipPackageRequestData?.length} of{" "}
            {membershipPackageRequestData?.length} entries
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferRequestList;
