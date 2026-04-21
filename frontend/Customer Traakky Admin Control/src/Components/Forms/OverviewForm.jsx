import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddOverview = ({ overviewData, setOverviewData, handleClose }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [overviewName, setOverviewName] = useState(overviewData?.name || "");
  const [overviewImg, setOverviewImg] = useState(null);


  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = new FormData();
    data.append("name", overviewName);
    if (overviewImg) {
      data.append("image", overviewImg[0]);
    }

    try {
      let response;
      if (overviewData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/overviews/${overviewData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: data,
          }
        );
      } else {
        response = await fetch(`https://backendapi.trakky.in/salons/overviews/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: data,
        });
      }

      if (response.ok) {
        const resp = await response.json();
        if (resp.detail === "Authentication credentials were not provided.") {
          alert("You're logged out");
          logoutUser();
        } else {
          let successMessage = overviewData
            ? "Overview updated successfully"
            : "Overview added successfully";
          toast.success(successMessage, {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          if (!overviewData) {
            setOverviewName("");
            setOverviewImg(null);
            document.getElementById("image").value = "";
          }
          if (overviewData) {
            handleClose();
          }
        }
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please log in again", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        logoutUser();
      } else if (response.status === 409) {
        toast.error("Overview already exist", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status >= 400 && response.status < 500) {
        const errorMessage = await response.text();
        toast.error(`Client Error: ${response.status} - ${errorMessage}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(
          `Server Error: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      toast.error("Error occurred: " + error.message, {
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



  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">{overviewData ? "Update" : "Add"} Overview</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="overviewname">Overview Name

              </label>
              <input
                type="text"
                name="overviewname"
                id="overviewname"
                placeholder="Enter Overview Name"
                value={overviewName}
                onChange={(e) => setOverviewName(e.target.value)}

                required
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-priority col-1 col-2">
              <label htmlFor="image">Overview Image</label>
              <input
                type="file"
                name="image"
                id="image"
                placeholder="Enter Image"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setOverviewImg(e.target.files)}
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit" onSubmit={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOverview;
