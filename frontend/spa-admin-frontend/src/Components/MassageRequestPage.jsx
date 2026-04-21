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

const MassageRequestPage = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  // const [cityPayload, setCityPayload] = useState([]);
  // const [selectedCity, setSelectedCity] = useState("");
  // const [city, setCity] = useState([]);
  // const [availableAreaName, setAvailableAreaName] = useState([]);
  // const [selectedAreaName, setSelectedAreaName] = useState("");

  const [massageDataLoading, setMassageDataLoading] = useState(false);

  const [massageRequestData, setMassageRequestData] = useState([]);

  const [approveMassageModalOpen, setApproveMassageModalOpen] = useState(false);
  const [approveMassageData, setApproveMassageData] = useState({});

  const [approveLoadingBtn, setApproveLoadingBtn] = useState(false);

  const getMassageRequestData = async () => {
    setMassageDataLoading(true);

    let url = "https://backendapi.trakky.in/spavendor/massage-request-admin/";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setMassageRequestData(data);
      }
    } catch (error) {
      toast.error(
        "Failed to fetch massage request data. Please try again later."
      );
    } finally {
      setMassageDataLoading(false);
    }
  };

  useEffect(() => {
    getMassageRequestData();
  }, []);

  const tableHeaders = [
    "Index",
    "Spa name",
    "Spa area,city",
    "Massage name",
    "From master massage",
    "Massage price",
    "Massage discount price",
    "Gender",
    "Massage duration",
    "Description",
    "Status",
    "Action",
  ];

  const handleApproveMassage = async () => {
    setApproveLoadingBtn(true);

    let url = `https://backendapi.trakky.in/spavendor/massage-requests/approve/`;

    // {
    //   "spa_id": 10,
    //   "master_service_id": 26,
    //   "service_name": "Relaxing Massage",
    //   "price": 500.0,
    //   "discounted_price": 450.0,
    //   "service_status": "approved",
    //   "massage_time": {
    //     "hours": 1,
    //     "minutes": 30,
    //     "days": 0,
    //     "seating": 0
    //   },
    //   "description": "A relaxing full body massage to relieve stress and tension.",
    //   "gender": "Unisex",
    //   "service_image": "base64_encoded_image_data_here",  // Use base64 encoded image or file upload (Multipart/Form-data)
    //   "from_masterservice": true  // True if linking to an existing master service
    // }

    const form = new FormData();
    form.append("spa_id", approveMassageData?.spa);
    if (approveMassageData?.from_masterservice) {
      form.append("master_service_id", approveMassageData?.master_service);
    }
    form.append("service_name", approveMassageData?.service_name);
    form.append("price", approveMassageData?.price);
    form.append("discounted_price", approveMassageData?.discounted_price);
    form.append("service_status", "approved");
    form.append(
      "massage_time",
      JSON.stringify(approveMassageData?.massage_time)
    );
    form.append("description", approveMassageData?.description);
    form.append("gender", approveMassageData?.gender);
    if (approveMassageData?.image) {
      form.append("service_image", approveMassageData?.image);
    }
    form.append("from_masterservice", approveMassageData?.from_masterservice);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        setApproveMassageModalOpen(false);
        setApproveMassageData({});
        getMassageRequestData();
      }
    } catch (error) {
      toast.error("Failed to approve massage. Please try again later.");
    } finally {
      setApproveLoadingBtn(false);
    }
  };

  const handleResetMassage = async (massage) => {
    const form = new FormData();
    form.append("spa_id", massage?.spa);
    if (massage?.from_masterservice) {
      form.append("master_service_id", massage?.master_service);
    }
    form.append("service_name", massage?.service_name);
    form.append("price", massage?.price);
    form.append("discounted_price", massage?.discounted_price);
    form.append("service_status", "rejected");
    form.append(
      "massage_time",
      JSON.stringify(massage?.massage_time)
    );
    form.append("description", massage?.description);
    form.append("gender", massage?.gender);
    if (massage?.image) {
      form.append("service_image", massage?.image);
    }
    form.append("from_masterservice", massage?.from_masterservice);

    try {
      let url = `https://backendapi.trakky.in/spavendor/massage-requests/approve/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("massage reset successfully");
        getMassageRequestData();
      } else {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        toast.error("Failed to reset massage. Please try again later");
      }
    } catch (error) {
      console.error("Error resetting massage:", error);
      toast.error("Failed to reset massage. Please try again later");
    }
  };

  // const handleApproveMassageAndMaster = async (payload) => {

  //   let formData = new FormData();
  //   formData.append("image", payload.image);
  //   formData.append("slug", payload.slug);
  //   formData.append("spa", payload.spa);
  //   formData.append("gender", payload.gender);
  //   formData.append("category_name", payload.category_name);

  //   setApproveLoadingBtn(true);

  //   let url = `https://backendapi.trakky.in/salonvendor/create-master-massage-and-massage/`;

  //   try {
  //     let response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${authTokens.access}`,
  //       },
  //       body: formData,
  //     });

  //     if (response.status === 201) {
  //       const data = await response.json();
  //       // toast.success(data?.message);
  //       setApproveCategoryModalOpen(false);
  //       setApproveCategoryData({});
  //       setCategoryCreateImg(null);
  //       setCategoryCreateSlug(null);
  //       getMassageRequestData();
  //     } else {
  //       toast.error("Failed to approve massage. Please try again later.");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to approve massage. Please try again later.");
  //   } finally {
  //     setApproveLoadingBtn(false);
  //   }
  // };

  // const handleRejectMassage = async (id) => {
  //   try {
  //     let url = `https://backendapi.trakky.in/salonvendor/massage-request-admin/${id}/`;

  //     const response = await fetch(url, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authTokens.access}`,
  //       },
  //       body: JSON.stringify({
  //         category_status: "rejected",
  //       }),
  //     });

  //     if (response.status === 200) {
  //       const data = await response.json();
  //       toast.success("massage rejected successfully");
  //       getMassageRequestData();
  //     } else {
  //       // throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //       toast.error("Failed to reject massage. Please try again later");
  //     }
  //   } catch (error) {
  //     console.error("Error rejecting massage:", error);
  //     toast.error("Failed to reject massage. Please try again later");
  //   }
  // };

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
                {massageDataLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <div className=" text-center"> Loading...</div>
                    </td>
                  </tr>
                ) : massageRequestData?.length === 0 ? (
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
                  massageRequestData?.map((massage, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{massage?.spa_name}</td>
                        <td>
                          {massage?.spa_area}, {massage?.spa_city}
                        </td>
                        <td>{massage?.service_name}</td>
                        <td className="text-center">
                          {massage?.from_masterservice ? "Yes" : "No"}
                        </td>
                        <td>{massage?.price}</td>
                        <td>{massage?.discounted_price}</td>
                        <td>{massage?.gender ?? "-"}</td>
                        <td style={{ maxWidth: "150px" }}>
                          <div style={{ maxWidth: "150px" }}>
                            days : {massage?.massage_time?.days ?? 0} <br />
                            hours : {massage?.massage_time?.hours ?? 0} <br />
                            minutes : {massage?.massage_time?.minutes ?? 0}{" "}
                            <br />
                            seating : {massage?.massage_time?.seating ?? 0}
                          </div>
                        </td>
                        <td className="description-td-quill">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: massage?.description,
                            }}
                          />
                        </td>

                        <td>
                          {massage?.service_status === "pending" ? (
                            <span className=" text-blue-600 bg-blue-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Pending
                            </span>
                          ) : massage?.service_status === "approved" ? (
                            <span className=" text-emerald-600 bg-emerald-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Approved
                            </span>
                          ) : massage?.service_status === "rejected" ? (
                            <span className=" text-red-600 bg-red-200 py-1 px-3 text-sm rounded-md leading-5 block w-fit mx-auto">
                              Rejected
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {massage?.service_status === "pending" ? (
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
                                    setApproveMassageData(massage);
                                    setApproveMassageModalOpen(true);
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
                                      description: `Are you sure you want to reject massage ${massage?.service_name}?`,
                                    })
                                      .then(() => {
                                        handleResetMassage(massage);
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
            Showing {massageRequestData?.length} of {massageRequestData?.length}{" "}
            entries
          </div>
          {/* {(selectedCity ||
            selectedAreaName ||
            massageRequestData.length !== 0) && (
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
          )} */}
        </div>
      </div>
      <GeneralModal
        open={approveMassageModalOpen}
        handleClose={() => {
          setApproveMassageModalOpen(false);
          setApproveMassageData({});
        }}
      >
        <div className="">
          <div className="modal-header">
            <h2 className="modal-title text-center font-semibold leading-10 border-b border-gray-400">
              Approve Massage Request
            </h2>
          </div>
          <div className=" flex gap-1 py-2 px-5 flex-col">
            <div className=" ">
              <span className=" font-semibold">Spa name: </span>
              {approveMassageData?.spa_name}, {approveMassageData?.spa_area},{" "}
              {approveMassageData?.spa_city}
            </div>
            <div className="">
              <span className=" font-semibold">massage name: </span>
              {approveMassageData?.service_name}
            </div>

            <div className=" ">
              <span className=" font-semibold">Gender: </span>
              {approveMassageData?.gender}
            </div>
            <hr className=" bg-black my-2 " />
            {approveMassageData?.from_masterservice ? (
              <>
                <h3 className=" text-lg font-semibold text-center">
                  massage & master massage approval form
                </h3>

                <ul className=" list-disc pl-4 text-sm">
                  <li>
                    <span className=" font-semibold">
                      master massage name:{" "}
                    </span>
                    {approveMassageData?.service_name}
                  </li>
                  <li>
                    <span className=" font-semibold">
                      master massage price:{" "}
                    </span>
                    {approveMassageData
                      ? approveMassageData?.price
                      : "No price available"}
                  </li>
                  <li>
                    <span className=" font-semibold">
                      master massage discount price:{" "}
                    </span>
                    {approveMassageData
                      ? approveMassageData?.discounted_price
                      : "No discount price available"}
                  </li>
                  <li>
                    <span className=" font-semibold">duration: </span>
                    {approveMassageData
                      ? `${approveMassageData?.massage_time?.days} days, ${approveMassageData?.massage_time?.hours} hours, ${approveMassageData?.massage_time?.minutes} minutes, ${approveMassageData?.massage_time?.seating} seating`
                      : "No duration available"}
                  </li>
                </ul>

                <div className=" mt-2 !font-normal">
                  <label htmlFor="image">Upload image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      let file = e.target.files[0];
                      setApproveMassageData((prev) => ({
                        ...prev,
                        image: file,
                      }));
                    }}
                  />
                </div>

                <div className=" flex justify-center ">
                  <div className=" w-full flex flex-col gap-2 items-center">
                    <button
                      className={` bg-emerald-700 mt-2 px-3 rounded-md flex justify-center items-center text-white h-8 pb-1 ${
                        approveLoadingBtn ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      onClick={() => {
                        if (approveLoadingBtn) {
                          return;
                        }
                        handleApproveMassage(approveMassageData);
                      }}
                    >
                      {!approveLoadingBtn ? "Approve" : "Approving..."}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className=" w-full flex flex-col gap-2 items-center">
                <h3 className=" text-lg font-semibold text-center">
                  massage approval form
                </h3>
                <div className=" w-full flex italic">
                  <ul className=" list-disc pl-4 text-sm">
                    <li>
                      <span className=" font-semibold">massage name: </span>
                      {approveMassageData?.service_name}
                    </li>
                    <li>
                      <span className=" font-semibold">massage price: </span>
                      {approveMassageData
                        ? approveMassageData?.price
                        : "No price available"}
                    </li>
                    <li>
                      <span className=" font-semibold">
                        massage discount price:{" "}
                      </span>
                      {approveMassageData
                        ? approveMassageData?.discounted_price
                        : "No discount price available"}
                    </li>
                    <li>
                      <span className=" font-semibold">massage duration: </span>
                      {approveMassageData
                        ? `${approveMassageData?.massage_time?.days} days, ${approveMassageData?.massage_time?.hours} hours, ${approveMassageData?.massage_time?.minutes} minutes, ${approveMassageData?.massage_time?.seating} seating`
                        : "No duration available"}
                    </li>
                  </ul>
                </div>

                <button
                  className={` bg-emerald-700 mt-3  px-3 rounded-md flex justify-center items-center text-white h-8 pb-1 ${
                    approveLoadingBtn ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={() => {
                    if (approveLoadingBtn) {
                      return;
                    }
                    handleApproveMassage();
                  }}
                >
                  {!approveLoadingBtn ? "Approve" : "Approving..."}
                </button>
              </div>
            )}
          </div>
        </div>
      </GeneralModal>
    </>
  );
};

export default MassageRequestPage;
