import React from "react";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import "../css/form.css";
import AsyncSelect from "react-select/async";
import toast, { Toaster } from "react-hot-toast";

const DailyUpdates = ({ dailyData, closeModal }) => {
  const { authTokens } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [selectSalonId, setSelectSalonId] = useState(dailyData?.salon_id || "");
  const [salonSearch, setSalonSearch] = useState(dailyData?.salon_name || "");

  const [updateDesc, setUpdateDesc] = useState(
    dailyData?.daily_update_description || ""
  );

  const [img, setImg] = useState("");

  const [selectedSalons, setSelectedSalons] = useState([]);

  useEffect(() => {
    if (salonSearch.length > 0) {
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      fetch(
        `https://backendapi.trakky.in/salons/search/?query=${salonSearch}`,
        requestOption
      )
        .then((res) => res.json())
        .then((data) => {
          setSalonsData(data?.data);
        });
    } else {
      // getSalons();
    }
  }, [salonSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("daily_update_description", updateDesc);
    img !== "" && formData.append("daily_update_img", img);
    formData.append("salon_id", selectSalonId);

    // Show loading toast
    const loadingToastId = toast.loading("Submitting...", {
      duration: null, // Duration set to null for indefinite display
      position: "top-center",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    // Disable the submit button to prevent multiple submissions
    e.target
      .querySelector('button[type="submit"]')
      .setAttribute("disabled", "true");

    try {
      let endpoint = "";
      let method = "";

      if (dailyData) {
        endpoint = `https://backendapi.trakky.in/salons/daily-updates/${dailyData?.id}/`;
        method = "PATCH";
      } else {
        endpoint = "https://backendapi.trakky.in/salons/daily-updates/";
        method = "POST";
      }

      const requestOption = {
        method: method,
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      };

      const res = await fetch(endpoint, requestOption);

      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }

      const data = await res.json();

      if (data) {
        if (dailyData) {
          // alert("Daily Work Update Successfully");
          toast.success("Daily Work Update Successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          // alert("Daily Work Added Successfully");
          toast.success("Daily Work Added Successfully.", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
        setImg("");
        e.target.querySelector("#img").value = "";
        setSelectSalonId("");
        setSalonSearch("");
        setUpdateDesc("");
        setSelectedSalons([]);
        if (typeof closeModal === "function") {
          closeModal();
        }
      } else {
        // alert("Something went wrong");
        toast.error("Something went wrong.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      // alert("An error occurred while processing the request");
      toast.error("An error occurred while processing the request.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      // Enable the submit button after submission process completes
      e.target
        .querySelector('button[type="submit"]')
        .removeAttribute("disabled");

      // Hide loading toast
      toast.dismiss(loadingToastId);
    }
  };

  useEffect(() => {
    if (dailyData) {
      setSelectedSalons({
        value: dailyData?.salon_id,
        label: dailyData?.salon_name,
      });
    }
  }, [dailyData]);

  const loadSalons = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}`
      );
      const data = await response.json();

      const options = data?.results?.map((salon) => ({
        value: salon.id,
        label: salon.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching salons:", error);
      callback([]);
    }
  };
  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {dailyData ? "Update" : "Add"} Daily Updates
            </h3>
          </div>

          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Salon</label>
              <AsyncSelect
                isDisabled={dailyData}
                required
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalon) => {
                  setSelectedSalons(selectedSalon);
                  setSelectSalonId(selectedSalon.value);
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
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="update_desc">Daily Update Description</label>
              <textarea
                required
                name="update_desc"
                id="update_desc"
                rows={10}
                value={updateDesc}
                onChange={(e) => setUpdateDesc(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="img">
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 2:1
                </span>
              </label>
              <input
                required={!dailyData}
                type="file"
                name="img"
                id="img"
                placeholder="Enter CLient Work Image"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setImg(e.target.files[0])}
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

export default DailyUpdates;
