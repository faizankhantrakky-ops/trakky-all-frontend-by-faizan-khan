import React from "react";
import "../css/form.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AddCity = ({ cityData, setCityData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [cityName, setCityName] = useState(cityData?.name || "");
  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name: cityName,
    };
    if (cityData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/city/${cityData.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: JSON.stringify(data),
          }
        );
        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.ok) {
          setCityData(response.json());
          toast.success("City updated.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage = errorData.name !== undefined ? errorData.name : "";
          if (errorMessage.length === 0) {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        } else {
          toast.error(`Something Went Wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        }
      } catch (error) {
        console.log("Error : ", error);
        toast.error(`Error : ${error}`, {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } else {
      try {
        const response = await fetch(`https://backendapi.trakky.in/spas/city/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(data),
        });
        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.ok) {
          toast.success("City added.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setCityName("");
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage = errorData.name !== undefined ? errorData.name : "";
          if (errorMessage.length === 0) {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        } else {
          toast.error(`Something Went Wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        }
      } catch (error) {
        console.log("Error : ", error);
        toast.error(`Error : ${error}`, {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
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
              <label htmlFor="cityname">City Name</label>
              <input
                type="text"
                name="cityname"
                id="cityname"
                placeholder="Enter Name"
                required
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
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
