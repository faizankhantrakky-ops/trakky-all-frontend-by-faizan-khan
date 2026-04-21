import React, { useState, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";

const AddTrustedSpas = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [city, setCity] = useState([]);
  const [selectedSpas, setSelectedSpas] = useState(null);
  const [selectedSpaId, setSelectedSpaId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("spa", selectedSpaId);
    formData.append("city", selectedCity);
    try {
      let response = await fetch(
        `https://backendapi.trakky.in/spas/trusted-spa/`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        }
      );
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
        setSelectedSpaId("");
        setSelectedSpas(null);
        setSelectedCity("");
      } else if (
        response.status === 400 &&
        responseData.spa &&
        responseData.spa.length > 0
      ) {
        toast.error(responseData.spa[0], {
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
    let url = `https://backendapi.trakky.in/spas/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let city = data?.payload.map((item) => item.name);
        setCity(city);
      })
      .catch((err) => alert(err));
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
  useEffect(() => {
    getCity();
  }, []);
  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Trusted Spas</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                name="id"
                id="id"
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
                  Spa Must belongs to Selected city
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
                  setSelectedSpaId(selectedSpa.value);
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
          <div className="submit-btn row">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTrustedSpas;
