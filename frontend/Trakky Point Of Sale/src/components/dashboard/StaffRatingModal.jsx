import React from "react";
// import starImage from '../svg/starrating.svg'

const StaffRatingModal = ({ staff }) => {

    // function to formate date string
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
  
      return `${day}-${month}-${year}`;
    };

  return (
    <div className="table-container py-6 px-3">
      <div className="sr-header">
        <div className="sr-staff-name">
          <span className="sr-label">Staff Name :</span> {staff.staff.staffname}
        </div>
        <div className="sr-staff-rating">
          <span className="sr-label">Average Rating :</span>{" "}
          {staff.average_rating}
          {/* <img src={starImage} alt="star" width='15px' className="sr-star-image" /> */}
          {/* star code */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2l2.5 5.5H18l-4 4 1 7-5-3-5 3 1-7-4-4h5.5L10 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="sr-table-container">
        <table className="bg-white rounded m-auto " rules="all">
          <thead className="font-medium leading-8 border-b-2 ">
            <tr>
              <th>
                <span className="flex justify-center items-center my-3 px-6 border-e-2">
                  Customer Name
                </span>
              </th>
              <th>
                <span className="flex justify-center items-center my-3 px-6 border-e-2">
                  Appointment Date
                </span>
              </th>
             
              <th>
                <span className="flex justify-center items-center my-3 px-6 border-e-2">
                  Rating
                </span>
              </th>
              <th>
                <span className="flex justify-center items-center my-3 px-6">
                  Remark
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {staff?.comments_rating?.map((item, index) => {
              return (
                <>
                  <tr key={index}>
                    <td className="border-e-2">
                      <span className="flex justify-center items-center p-4">
                        {item.appointment__customer_name}
                      </span>
                    </td>
                    <td className="border-e-2">
                      <span className="flex justify-center items-center ">
                        {formatDate(item.appointment__date)}
                      </span>
                    </td>
                    
                    <td className="border-e-2">
                      <span className="flex justify-center items-center">
                        {item.rating || "-"}
                      </span>
                    </td>
                    <td className="">
                      <span className="flex justify-center items-center">
                        {item.remark || "-"}
                      </span>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffRatingModal;
