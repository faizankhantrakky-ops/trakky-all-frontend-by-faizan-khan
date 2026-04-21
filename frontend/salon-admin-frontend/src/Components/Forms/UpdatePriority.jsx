import React, { useRef } from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import toast from "react-hot-toast";

const UpdatePriority = ({ refreshData, closeModal }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    city: "",
    area: "",
    priorityType: null,
  });
  const [cityPriority, setCityPriority] = useState(false);
  const [areaPriority, setAreaPriority] = useState(false);
  const [selectedSalon1, setSelectedSalon1] = useState(null);
  const [selectedSalon2, setSelectedSalon2] = useState(null);

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
    setSelectedSalon1(null);
    setSelectedSalon2(null);
  }, [formData.priorityType]);

  useEffect(() => {
    if (selectedSalon1) {
      console.log("selected salon : ", selectedSalon1.value.city);
      setFormData({
        ...formData,
        city: selectedSalon1.value.city,
        area: selectedSalon1.value.area,
      });
    }
  }, [selectedSalon1]);

  useEffect(() => {
    console.log("Form data : ", formData);
  }, [formData]);

  const loadSalons1 = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/?name=${encodeURIComponent(
          inputValue
        )}`
      );
      const data = await response.json();

      const options = data?.results
        ?.filter((salon) => {
          if (selectedSalon2) {
            return selectedSalon2.value.id !== salon.id;
          }
          return true;
        })
        .map((salon) => ({
          value: salon,
          label: salon.name,
        }));

      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      toast.error("Error fetching salons.", {
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

  const loadSalons2 = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/?name=${encodeURIComponent(
          inputValue
        )}&city=${formData.city}&${areaPriority ? `area=${formData.area}` : ""}`
      );
      const data = await response.json();

      const options = data?.results
        ?.filter((salon) => {
          if (selectedSalon1) {
            return selectedSalon1.value.id !== salon.id;
          }
          return true;
        })
        .map((salon) => ({
          value: salon,
          label: salon.name,
        }));

      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      toast.error("Error fetching salons.", {
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
    formData.append("other_salon_id", selectedSalon2.value.id);
    if (cityPriority) formData.append("change_priority", true);
    else if (areaPriority) formData.append("change_area_priority", true);

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/${selectedSalon1.value.id}/`,
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
        });
        refreshData();
        closeModal();
      } else {
        const responseData = await response.json();
        toast.error(responseData.error || "Error occurred."); // Display error message
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Error occurred: " + error.message); // Display error alert
    }
  };

  const handleSwap = () => {
    const temp = selectedSalon1;
    setSelectedSalon1(selectedSalon2);
    setSelectedSalon2(temp);
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
                loadOptions={loadSalons1}
                onChange={(selectedOption) => setSelectedSalon1(selectedOption)}
                value={selectedSalon1}
                isClearable
                placeholder="Search Salon"
                noOptionsMessage={() => "No salons found"}
                required
              />
            </div>
            <SwapHorizIcon fontSize="medium" onClick={handleSwap} />
            <div className="input-box inp-name col-2 relative">
              <label htmlFor="priority">To</label>
              <AsyncSelect
                isDisabled={selectedSalon1 === null}
                cacheOptions
                defaultOptions
                loadOptions={loadSalons2}
                onChange={(selectedOption) => setSelectedSalon2(selectedOption)}
                value={selectedSalon2}
                isClearable
                placeholder="Search Salon"
                noOptionsMessage={() => "No salons found"}
                required
              />
            </div>
          </div>
          <div className="submit-btn row">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

const ChangePriority = ({ salonData, closeModal, refreshData }) => {
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
        `https://backendapi.trakky.in/salons/${salonData.id}/`,
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
        refreshData();
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
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
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
