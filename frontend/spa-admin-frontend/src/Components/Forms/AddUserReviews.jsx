import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import "quill/dist/quill.snow.css";

const AddUserReviews = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedSpas, setSelectedSpas] = useState(null);
  const [selectedSpaId, setSelectedSpaId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [hygiene, setHygiene] = useState("");
  const [valueForMoney, setValueForMoney] = useState("");
  const [behavior, setBehavior] = useState("");
  const [staff, setStaff] = useState("");
  const [massageTherapy, setMassageTherapy] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    const calculateOverallRating = () => {
      const sum = hygiene + valueForMoney + behavior + staff + massageTherapy;
      const average = sum / 5;
      setOverallRating(parseFloat(average.toFixed(1))); // Round to 1 decimal place
    };

    calculateOverallRating();
  }, [hygiene, valueForMoney, behavior, staff, massageTherapy]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const reviewData = {
      spa: selectedSpaId,
      user: selectedUserId,
      hygiene: hygiene,
      value_for_money: valueForMoney,
      behavior: behavior,
      staff: staff,
      massage_therapy: massageTherapy,
      overall_rating: overallRating,
      review: review, // Include the review field
    };

    const method = "POST";
    const url = `https://backendapi.trakky.in/spas/fake-review/`;
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
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
        setSelectedSpaId("");
      } else if (response.status === 400) {
        toast.error(responseData, {
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
    const url = `https://backendapi.trakky.in/spas/city/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const city = data?.payload.map((item) => item.name);
      setCity(city);
    } catch (err) {
      alert(err);
    }
  };

  const loadSpas = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
            inputValue
          )}&city=${selectedCity}`
        );
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        const data = await response.json();
        const options = data?.results?.map((spa) => ({
          value: spa.id,
          label: spa.name,
        }));
        callback(options);
      } catch (error) {
        console.error("Error fetching spas:", error.message);
        callback([]);
      }
    }
  };

  const getAllUsers = async () => {
    const url = `https://backendapi.trakky.in/spas/spauser/?verified=False`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
      });
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
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
            <h3 className="form-title">Add Spa Review</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="user">Select User</label>
              <Select
                required
                options={formatUserOptions(allUsers)}
                onChange={(selectedOption) => {
                  setSelectedUserId(selectedOption ? selectedOption.value : "");
                }}
                isClearable
                placeholder="Search User..."
              />
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
                  setSelectedSpas("");
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
            <div className="input-box inp-spa col-1 col-2 relative">
              <label htmlFor="spas">
                Select Spa
                <span className="Note_Inp_Classs">
                  Spa Must belong to Selected city
                </span>
              </label>
              <AsyncSelect
                required
                isDisabled={!selectedCity}
                defaultOptions
                loadOptions={loadSpas}
                value={selectedSpas}
                onChange={(selectedSpa) => {
                  setSelectedSpas(selectedSpa);
                  setSelectedSpaId(selectedSpa ? selectedSpa.value : "");
                }}
                noOptionsMessage={() => "No spas found"}
                placeholder="Search Spa..."
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
              <label htmlFor="hygiene">Hygiene</label>
              <input
                required
                type="number"
                name="hygiene"
                id="hygiene"
                value={hygiene}
                min="1"
                max="5"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 5) {
                    setHygiene(value);
                  } else {
                    setHygiene("");
                  }
                }}
              />
            </div>
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="value_for_money">Value for Money</label>
              <input
                required
                type="number"
                name="value_for_money"
                id="value_for_money"
                value={valueForMoney}
                min="1"
                max="5"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 5) {
                    setValueForMoney(value);
                  } else {
                    setValueForMoney("");
                  }
                }}
              />
            </div>
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="behavior">Behavior</label>
              <input
                required
                type="number"
                name="behavior"
                id="behavior"
                value={behavior}
                min="1"
                max="5"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 5) {
                    setBehavior(value);
                  } else {
                    setBehavior("");
                  }
                }}
              />
            </div>
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="staff">Staff</label>
              <input
                required
                type="number"
                name="staff"
                id="staff"
                value={staff}
                min="1"
                max="5"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 5) {
                    setStaff(value);
                  } else {
                    setStaff("");
                  }
                }}
              />
            </div>
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="massage_therapy">Massage Therapy</label>
              <input
                required
                type="number"
                name="massage_therapy"
                id="massage_therapy"
                value={massageTherapy}
                min="1"
                max="5"
                step="1"
                placeholder="Enter here.."
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 5) {
                    setMassageTherapy(value);
                  } else {
                    setMassageTherapy("");
                  }
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="overall_rating">Overall Rating</label>
              <input
                disabled
                required
                type="number"
                name="overall_rating"
                id="overall_rating"
                value={overallRating}
                min="1"
                max="5"
                step="0.1"
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="review">Review</label>
              <textarea
                required
                name="review"
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Enter your review here.."
              ></textarea>
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

export default AddUserReviews;
