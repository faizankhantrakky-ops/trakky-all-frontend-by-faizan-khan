import React, { useState, useEffect, useContext } from "react";

import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";

import "./css/spaelist.css";

import toast, { Toaster } from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const UserReviews = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const confirm = useConfirm();

  const [allReviews, setAllReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);

  const tableHeaders = [
    "Sr no.",
    "Spa Name",
    "User Name",
    "Phone Number",
    "Review",
    "Hygiene",
    "Value for Money",
    "Behavior",
    "Staff",
    "Massage Therapy",
    "Overall Rating",
    "Action",
  ];

  const getReviews = async () => {
    let url = "https://backendapi.trakky.in/spas/review/";

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (response.status === 200) {
        setAllReviews(data);
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const deleteReview = async (id) => {
    try {
      await confirm({
        description: "Are you sure you want to delete this review?",
      });

      let url = `https://backendapi.trakky.in/spas/review/${id}/`;

      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        toast.success("Review Deleted Successfully", {
          position: "top-center",
          duration: 4000,
          style: {
            color: "white",
            backgroundColor: "#333",
          },
        });
        getReviews();
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Something went wrong ${response.status}`, {
          position: "top-center",
          duration: 4000,
        });
      }
    } catch (error) {
      if (error === undefined) return;

      toast.error(error, {
        position: "top-center",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      return setFilteredReviews(allReviews);
    }
    setFilteredReviews(
      allReviews.filter((review) => {
        return review.spa_name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm]);

  return (
    <>
      <div className="tb-body-content">
        <div className="tb-body-data">
          <div className="tb-body-input">
            <div className="tb-body-src-fil">
              <div className="tb-body-filter">
                <select value={"spa name"}>
                  <option value={"spaname"} selected disabled>
                    Spa Name
                  </option>
                </select>
              </div>
              <div className="tb-body-search">
                <div className="tb-search-field">
                  <input
                    type="text"
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
                {searchTerm.length > 0 ? (
                  filteredReviews?.length > 0 ? (
                    filteredReviews?.map((review, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{review.spa_name || "-"}</td>
                            <td>{review.name || "-"}</td>
                            <td>{review.phone_number || "-"}</td>
                            <td>{review.review || "-"}</td>
                            <td>{review.hygiene || "-"}</td>
                            <td>{review.value_for_money || "-"}</td>
                            <td>{review.behavior || "-"}</td>
                            <td>{review.staff || "-"}</td>
                            <td>{review.massage_therapy || "-"}</td>
                            <td>{review.overall_rating || "-"}</td>
                            <td>
                              <AiFillDelete
                                onClick={() => deleteReview(review.id)}
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
                    <tr>
                      <td colSpan={6}>No data found</td>
                    </tr>
                  )
                ) : allReviews ? (
                  allReviews?.map((review, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{review.spa_name || "-"}</td>
                          <td>{review.name || "-"}</td>
                          <td>{review.phone_number || "-"}</td>
                          <td>{review.review || "-"}</td>
                          <td>{review.hygiene || "-"}</td>
                          <td>{review.value_for_money || "-"}</td>
                          <td>{review.behavior || "-"}</td>
                          <td>{review.staff || "-"}</td>
                          <td>{review.massage_therapy || "-"}</td>
                          <td>{review.overall_rating || "-"}</td>
                          <td>
                            <AiFillDelete
                              onClick={() => deleteReview(review.id)}
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
                  <tr>
                    <td colSpan={6}>No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tb-body-footer">
          <div className="tb-reasult-count">
            showing 1 to {allReviews.length} of {allReviews.length} entries
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default UserReviews;
