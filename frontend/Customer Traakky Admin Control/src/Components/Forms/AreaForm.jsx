import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddArea = ({ areaData, setAreaData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [CitiesData, setCitiesData] = useState([]);
  const [areaName, setAreaName] = useState(areaData?.name || "");
  const [city, setCity] = useState(areaData?.city || "not-select");
  const [areaImage, setAreaImage] = useState(null);

  const getCities = () => {
    const requestOption = {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/salons/city/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setCitiesData(data.payload);
        // setIsLoading(false);
      })
      .catch((err) => alert(err));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = new FormData();
    data.append("name", areaName);
    data.append("city", city);
    if (areaImage) {
      data.append("image_area", areaImage[0]);
    }

    try {
      let response;
      if (areaData) {
        response = await fetch(
          `https://backendapi.trakky.in/salons/area/${areaData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: data,
          }
        );
      } else {
        response = await fetch(`https://backendapi.trakky.in/salons/area/`, {
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
          let successMessage = areaData
            ? "Area updated successfully"
            : "Area added successfully";
          toast.success(successMessage, {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          if (!areaData) {
            setAreaName("");
            setCity("not-select");
            setAreaImage(null);
            document.getElementById("image").value = "";
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
        toast.error("Area of this City already exist", {
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

  useEffect(() => {
    // setIsLoading(true);
    getCities();
  }, []);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">{areaData ? "Update" : "Add"} Area</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="areaname">Area Name
                <span className="Note_Inp_Classs">
                  Area Name must not include space (e.g. prahlad-nagar instead of prahlad nagar)
                </span>
              </label>
              <input
                type="text"
                name="areaname"
                id="areaname"
                placeholder="Enter Area Name"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                onKeyDownCapture={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-city col-1 col-2">
              <label htmlFor="city">City</label>

              <select
                name="city"
                id="city"
                defaultValue="not-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                {CitiesData.map((city) => {
                  return <option value={city.id}>{city.name}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-priority col-1 col-2">
              <label htmlFor="image">Area Image</label>
              <input
                type="file"
                name="image"
                id="image"
                placeholder="Enter Image"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setAreaImage(e.target.files)}
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

export default AddArea;
