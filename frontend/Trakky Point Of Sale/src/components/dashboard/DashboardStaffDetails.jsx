import React, { useContext, useEffect, useState } from "react";
// import "../css/staffmanagement.css";
import "./dashboard_style.css";
import GeneralModal from "../generalModal/GeneralModal";
import StaffRatingModal from "./StaffRatingModal";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AuthContext from "../../Context/Auth";

const DashboardStaffDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);

  const [staffData, setStaffData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // function to get staff data
  const getStaffData = async () => {
    let url;

    if (startDate === null || endDate === null) {
      url = `https://backendapi.trakky.in/salonvendor/staff-monthly-detail/`;
    } else {
      url = `https://backendapi.trakky.in/salonvendor/staff-monthly-detail/?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
    });
    const data = await response.json();
    setStaffData(data);
  };

  // function to formate date string
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${day}-${month}-${year}`;
  };

  //

  useEffect(() => {
    getStaffData();
  }, [startDate, endDate]);

  return (
    <div className="table-container overflow-auto w-full py-6 px-3">
      <table
        className="DashboardTable bg-white !rounded-lg !shadow-sm min-w-[825px] m-auto "
        rules="all"
      >
        <thead className="font-medium leading-8 border-b-2 ">
          <tr key={0}>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Staff Name
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Phone Number
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Joining Date
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Attendence
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Appointments
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 border-e-2">
                Rating
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3  border-e-2">
                Comission
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3  border-e-2">
                Amount Paid
              </span>
            </th>
            <th>
              <span className="flex justify-center items-center my-3 ">
                Salary
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {staffData?.map((item) => {
            return (
              <>
                <tr key={item.staff.id}>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center p-4">
                      {item.staff.staffname}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center ">
                      {item.staff.ph_number}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {formatDate(item.staff.joining_date)}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {item.attendance_data[0]?.total_attendance || "-"}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {item?.attendance_data[0]?.num_services_total || "-"}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {item?.average_rating || "-"}
                      {item?.average_rating !== 0 && (
                        <InfoOutlinedIcon
                          sx={{ fontSize: "16px" }}
                          className="ml-1 cursor-pointer"
                          onClick={
                            item?.average_rating
                              ? () => {
                                  setShowModal(true);
                                  setSelectedStaff(item);
                                }
                              : {}
                          }
                        />
                      )}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {item?.attendance_data[0]?.commission_total || "-"}
                    </span>
                  </td>
                  <td className="border-e-2">
                    <span className="flex justify-center items-center">
                      {item?.attendance_data[0]?.amount_paid_total || "-"}
                    </span>
                  </td>
                  <td className="">
                    <span className="flex justify-center items-center">
                      {item.staff.salary}
                    </span>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>

      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <StaffRatingModal staff={selectedStaff} />
      </GeneralModal>
    </div>
  );
};

export default DashboardStaffDetails;
