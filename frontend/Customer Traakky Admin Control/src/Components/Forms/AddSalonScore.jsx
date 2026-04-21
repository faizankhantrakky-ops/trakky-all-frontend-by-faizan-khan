import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import Select from "react-select";

const AddSalonScore = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [score, setScore] = useState("");
  const [selectedSalons, setSelectedSalons] = useState(null);
  const [selectSalonId, setSelectSalonId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("salon", selectSalonId);
    formData.append("user", selectedUserId);
    formData.append("score", score);
    const method = "POST";
    const url = `https://backendapi.trakky.in/salons/fakescore/`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      });
      const responseData = await response.json();

      if (response.status === 201) {
        toast.success("Added successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "green",
            color: "#fff",
          },
        });
        setSelectedCity("");
        setSelectSalonId("");
        setSelectedSalons(null);
      } else if (
        response.status === 400 &&
        responseData.salon &&
        responseData.salon.length > 0
      ) {
        toast.error(responseData.salon[0], {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      } else if (response.status === 401) {
        alert("You're logged out");
        logoutUser();
      } else {
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to add. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "red",
          color: "#fff",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCity = async () => {
    const url = `https://backendapi.trakky.in/salons/city/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (err) {
      alert(err);
    }
  };

  const loadSalons = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
            inputValue
          )}&city=${selectedCity}`
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));
        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };

  const getAllUsers = async () => {
    const url = `https://backendapi.trakky.in/salons/salonuser/?verified=False`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
      });
      const data = await response.json();
      setAllUsers(data);
      setLoadingUsers(false); // Users have loaded
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setLoadingUsers(false); // Handle the error case as well
    }
  };

  const formatUserOptions = (users) => {
    // Separate users with and without names
    const usersWithName = users.filter((user) => user.name);
    const usersWithoutName = users.filter((user) => !user.name);

    // Sort users with names alphabetically by name
    const sortedUsersWithName = usersWithName.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // Sort users without names numerically by phone number
    const sortedUsersWithoutName = usersWithoutName.sort((a, b) => {
      const phoneA = a.phone_number;
      const phoneB = b.phone_number;
      if (phoneA < phoneB) return -1;
      if (phoneA > phoneB) return 1;
      return 0;
    });

    // Combine both sorted arrays
    const sortedUsers = [...sortedUsersWithName, ...sortedUsersWithoutName];

    return sortedUsers.map((user) => ({
      value: user.id,
      label: user.name
        ? `${user.name} (${user.phone_number})`
        : user.phone_number,
    }));
  };

  useEffect(() => {
    getCity();
    getAllUsers();
  }, []);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Salon Score</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="user">Select User</label>
              {loadingUsers ? (
                <Select
                  options={[{ label: "Users are loading...", value: "" }]}
                  placeholder="Search User..."
                />
              ) : (
                <Select
                  required
                  options={formatUserOptions(allUsers)}
                  onChange={(selectedOption) => {
                    setSelectedUserId(
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  isClearable
                  placeholder="Search User..."
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="city">Select City</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSalons("");
                  setSelectedCity(e.target.value);
                }}
              >
                <option value="">Select City</option>
                {city.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">
                Select Salon
                <span className="Note_Inp_Classs">
                  Salon Must belong to Selected city
                </span>
              </label>
              <AsyncSelect
                required
                isDisabled={!selectedCity}
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalon) => {
                  setSelectedSalons(selectedSalon);
                  setSelectSalonId(selectedSalon ? selectedSalon.value : "");
                }}
                noOptionsMessage={() => "No salons found"}
                placeholder="Search Salon..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ccc",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#ccc",
                    },
                  }),
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="score">Enter Score</label>
              <input
                required
                type="number"
                name="score"
                id="score"
                value={score}
                min="0"
                max="10"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 && value <= 10) {
                    setScore(value);
                  } else if (value === "") {
                    setScore("");
                  }
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
              />
            </div>
          </div>

          <div className="submit-btn row">
            <button disabled={isSubmitting} type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSalonScore;
