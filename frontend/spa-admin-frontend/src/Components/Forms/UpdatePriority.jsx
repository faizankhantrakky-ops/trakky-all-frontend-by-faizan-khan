import React, { useRef } from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import toast from "react-hot-toast";

const UpdatePriority = ({ getSpas, handleRefreshData, closeModal }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    city: "",
    area: "",
    priorityType: null,
  });
  const [cityPriority, setCityPriority] = useState(false);
  const [areaPriority, setAreaPriority] = useState(false);
  const [selectedSpa1, setSelectedSpa1] = useState(null);
  const [selectedSpa2, setSelectedSpa2] = useState(null);

  useEffect(() => {
    if (formData.priorityType === "city") {
      setCityPriority(true);
      setAreaPriority(false);
    } else if (formData.priorityType === "area") {
      setCityPriority(false);
      setAreaPriority(true);
    } else {
      setCityPriority(false);
      setAreaPriority(false);
    }
    setSelectedSpa1(null);
    setSelectedSpa2(null);
  }, [formData.priorityType]);
  useEffect(() => {
    if (selectedSpa1) {
      // console.log("selected salon : ", selectedSalon1.value.city);
      setFormData({
        ...formData,
        city: selectedSpa1.value.city,
        area: selectedSpa1.value.area,
      });
    }
  }, [selectedSpa1]);

  const loadSpas1 = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(inputValue)}`
      );
      const data = await response.json();

      const options = data?.results
        ?.filter((spa) => {
          if (selectedSpa2) {
            return selectedSpa2.value.id !== spa.id;
          }
          return true;
        })
        .map((spa) => ({
          value: spa,
          label: spa.name,
        }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      toast.error("Error fetching spas.", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      callback([]);
    }
  };

  const loadSpas2 = async (inputValue, callback) => {
    console.log("load spa 2 : ", formData.city, formData.area);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
          inputValue
        )}&city=${formData.city}&${areaPriority ? `area=${formData.area}` : ""}`
      );
      const data = await response.json();

      const options = data?.results
        ?.filter((spa) => {
          if (selectedSpa1) {
            return selectedSpa1.value.id !== spa.id;
          }
          return true;
        })
        .map((spa) => ({
          value: spa,
          label: spa.name,
        }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      toast.error("Error fetching spas.", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      callback([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to exchange the priority?"
    );
    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("other_spa_id", selectedSpa2.value.id);
    if (cityPriority) formData.append("change_priority", true);
    else if (areaPriority) formData.append("change_area_priority", true);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${selectedSpa1.value.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );
      if (response.ok) {
        const responseData = await response.json(); // Parse JSON response
        toast.success(responseData.success, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }); // Display success message
        handleRefreshData();
        closeModal();
      } else {
        const responseData = await response.json();
        toast.error(responseData.error || "Error occurred.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }); // Display error message
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Error occurred: " + error.message); // Display error alert
    }
  };

  const handleSwap = () => {
    const temp = selectedSpa1;
    setSelectedSpa1(selectedSpa2);
    setSelectedSpa2(temp);
  };

  return (
    <>
      <div
        className="form-container"
        style={{
          padding: "0px",
        }}
      >
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Exchange Priority</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1">
              <label htmlFor="priority">Select Priority Type</label>
              <select
                id="priority"
                name="priority"
                onChange={(e) => {
                  setFormData({ ...formData, priorityType: e.target.value });
                }}
                required
              >
                <option value="">Select Priority</option>
                <option value="city">City</option>
                <option value="area">Area</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1">
              <label htmlFor="priority">From</label>
              <AsyncSelect
                isDisabled={!cityPriority && !areaPriority}
                cacheOptions
                defaultOptions
                loadOptions={loadSpas1}
                onChange={(selectedOption) => setSelectedSpa1(selectedOption)}
                value={selectedSpa1}
                isClearable
                placeholder="Search Spa"
                noOptionsMessage={() => "No spas found"}
                required
              />
            </div>
            <SwapHorizIcon fontSize="medium" onClick={handleSwap} />
            <div className="input-box inp-name col-2 relative">
              <label htmlFor="priority">To</label>
              <AsyncSelect
                isDisabled={!cityPriority && !areaPriority}
                cacheOptions
                defaultOptions
                loadOptions={loadSpas2}
                onChange={(selectedOption) => setSelectedSpa2(selectedOption)}
                value={selectedSpa2}
                isClearable
                placeholder="Search Spa"
                noOptionsMessage={() => "No spas found"}
                required
              />
            </div>
          </div>
          {formData.priorityNumber === 0 && (
            <span className="error" style={{ color: "red" }}>
              Priority cannot be 0.
            </span>
          )}
          <div className="submit-btn row">
            <button type="submit" disabled={formData.priorityNumber === 0}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const ChangePriority = ({ spaData, closeModal, handleRefreshData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    priorityType: null,
    priorityNumber: "",
  });

  const [cityPriority, setCityPriority] = useState(false);
  const [areaPriority, setAreaPriority] = useState(false);

  useEffect(() => {
    if (formData.priorityType === "city") {
      setCityPriority(true);
      setAreaPriority(false);
    } else if (formData.priorityType === "area") {
      setCityPriority(false);
      setAreaPriority(true);
    } else {
      setCityPriority(false);
      setAreaPriority(false);
    }
  }, [formData.priorityType]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to change the priority?"
    );
    if (!confirmed) {
      return;
    }

    const bodyData = new FormData();
    if (cityPriority) bodyData.append("priority", formData.priorityNumber);
    else if (areaPriority)
      bodyData.append("area_priority", formData.priorityNumber);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${spaData.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: bodyData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Priority Changed Successfully.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        handleRefreshData();
        closeModal();
      } else {
        if (result.detail === "Authentication credentials were not provided.") {
          alert("You're logged out");
          logoutUser();
        } else {
          throw new Error(result.detail);
        }
      }
    } catch (error) {
      toast.error("Error occurred: ", error.message, {
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
      <div
        className="form-container"
        style={{
          marginBottom: "50px",
        }}
      >
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Change Priority</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1">
              <label htmlFor="priority">Select Priority Type</label>
              <select
                id="priority"
                name="priority"
                onChange={(e) => {
                  setFormData({ ...formData, priorityType: e.target.value });
                }}
                required
              >
                <option value="">Select Priority</option>
                <option value="city">City</option>
                <option value="area">Area</option>
              </select>
            </div>
            <div className="input-box inp-name col-2 relative">
              <label htmlFor="priority">Set Priority</label>
              <input
                type="number"
                name="priority"
                id="priority"
                onChange={(e) => {
                  const priorityValue = parseInt(e.target.value);
                  setFormData({ ...formData, priorityNumber: priorityValue });
                }}
                required
              />
            </div>
          </div>
          {formData.priorityNumber <= 0 && (
            <span className="error" style={{ color: "red" }}>
              Priority cannot be less than or equals to 0.
            </span>
          )}
          <div className="submit-btn row">
            <button type="submit" disabled={formData.priorityNumber <= 0}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePriority;
export { ChangePriority };
