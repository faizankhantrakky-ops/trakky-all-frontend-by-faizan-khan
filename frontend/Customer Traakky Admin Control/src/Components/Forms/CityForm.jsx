import React from "react";
import "../css/form.css";
import { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddCity = ({ cityData, setCityData, closeModal }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [cityName, setCityName] = useState(cityData?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name: cityName,
    };

    try {
      let response;
      if (cityData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/city/${cityData.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        response = await fetch(`https://backendapi.trakky.in/salons/city/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        const resp = await response.json();
        if (resp.detail === "Authentication credentials were not provided.") {
          alert("You're logged out");
          logoutUser();
        } else {
          let successMessage = cityData
            ? "City updated successfully"
            : "City added successfully";
          toast.success(successMessage, {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          if (!cityData) {
            setCityName("");
          }

          if (closeModal) {
            closeModal();
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
        toast.error("This city already exists", {
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
            <h3 className="form-title">{cityData ? "Update" : "Add"} City</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="cityname">
                City Name <span className="Note_Inp_Classs">
                  City Name must not include space (e.g. navi-mumbai instead of navi mumbai)
                </span>
              </label>
              <input
                type="text"
                name="cityname"
                id="cityname"
                placeholder="Enter Name"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                onKeyDownCapture={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
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

export default AddCity;
