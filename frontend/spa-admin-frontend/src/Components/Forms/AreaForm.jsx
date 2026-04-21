import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const AddArea = ({ areaData, setAreaData , closeModal}) => {
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
    fetch("https://backendapi.trakky.in/spas/city/", requestOption)
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

    const url = areaData
      ? `https://backendapi.trakky.in/spas/area/${areaData.id}/`
      : "https://backendapi.trakky.in/spas/area/";

    try {
      const response = await fetch(url, {
        method: areaData ? "PATCH" : "POST",
        headers: {
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: data,
      });

      if (!response.ok) {
        let errorMessage = `Error submitting form! Status: ${response.status}`;

        // Customize error message based on status code
        if (response.status === 401) {
          errorMessage = "Unauthorized access! Please login again.";
        }

        throw new Error(errorMessage);
      }

      const resp = await response.json();
      if (resp.detail === "Authentication credentials were not provided.") {
        toast.error("You're logged out", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        logoutUser();
      } else {
        let message = areaData
          ? "Area updated successfully"
          : "Area added successfully";
        toast.success(message, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        if (areaData) {
          closeModal();
        } else {
          setAreaName("");
          setCity("not-select");
          setAreaImage(null);
        }

        // Delay the navigation until after the toast is closed
        // setTimeout(() => {
        //   let ask = window.confirm("Redirect to list");
        //   if (ask) {
        //     navigate("/listareas");
        //   }
        // }, 4100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message, {
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
              <label htmlFor="areaname">Area Name</label>
              <input
                type="text"
                name="areaname"
                id="areaname"
                placeholder="Enter Area Name"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
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
                {/* <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option> */}
                {CitiesData.map((city) => {
                  return <option value={city.id}>{city.name}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-priority col-1 col-2">
              <label>Area Image</label>
              <input
                type="file"
                name="image"
                id="image"
                placeholder="Enter Image"
                onChange={(e) => setAreaImage(e.target.files)}
                style={{width:"fit-content",cursor:"pointer"}}
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
