import React from "react";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/form.css";
import AsyncSelect from "react-select/async";
import toast, { Toaster } from "react-hot-toast";

const AddClientWorkPhoto = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [salonsData, setSalonsData] = useState([]);
  const [selectSalonId, setSelectSalonId] = useState("");
  const [salonSearch, setSalonSearch] = useState("");

  const [selectedCity, setSelectedCity] = useState("");
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [service_name, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [img, setImg] = useState("");

  // video & video thumbnail
  const [video, setVideo] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");

  const [selectedSalons, setSelectedSalons] = useState([]);

  // State to track if salon is selected
  const [isSalonSelected, setIsSalonSelected] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (salonSearch.length > 0) {
          const requestOption = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + `${authTokens.access}`,
              "Content-Type": "application/json",
            },
          };

          const response = await fetch(
            `https://backendapi.trakky.in/salons/search/?query=${salonSearch}`,
            requestOption
          );

          if (response.ok) {
            const data = await response.json();
            setSalonsData(data?.data);
          } else {
            throw new Error("Failed to fetch salons data");
          }
        }
      } catch (error) {
        console.error("Network error:", error.message);
        toast.error("Failed to fetch salon data. Please try again later.", {
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

    fetchData();
  }, [salonSearch]);

  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) => alert(err));
  };

  // Effect to filter categories when city changes
  useEffect(() => {
    if (selectedCity && selectedGender && categoryList.length > 0) {
      const filtered = categoryList.filter(
        (category) =>
          category.city === selectedCity &&
          category.category_gender.toLowerCase() === selectedGender.toLowerCase()
      );
      setFilteredCategoryList(filtered);

      // Reset category selection when city or gender changes
      setCategoryId("");
    } else {
      setFilteredCategoryList([]);
    }
  }, [selectedCity, selectedGender, categoryList]);

  const getCategories = async () => {
    try {
      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://backendapi.trakky.in/salons/category/",
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
        setFilteredCategoryList(data);
      } else if (response.status === 401) {
        toast.error("Unauthorized access. Please log in again.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to fetch category list. Please try again later.", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if image is selected
    if (!img && !video) {
      toast.error("Please select an image or video", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading("Submitting...", {
      duration: null,
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
      const formData = new FormData();
      formData.append("category", categoryId);
      formData.append("service", service_name);
      formData.append("client_image", img);
      formData.append("description", description);
      formData.append("salon", selectSalonId);

      if (video) {
        formData.append("video", video);
      }

      if (videoThumbnail) {
        formData.append("video_thumbnail_image", videoThumbnail);
      }

      const requestOption = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
        },
        body: formData,
      };

      const response = await fetch(
        `https://backendapi.trakky.in/salons/client-image/`,
        requestOption
      );
      const data = await response.json();

      if (response.ok) {
        setData(formData);
        toast.success("Client Work Photo Added Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setCategoryId("");
        setServiceName("");
        setDescription("");
        setImg("");
        setSelectSalonId("");
        setSelectedSalons([]);
        setSelectedCity("");
        setIsSalonSelected(false);
        e.target.querySelector("#img").value = "";
        if (e.target.querySelector("#video").value) {
          e.target.querySelector("#video").value = "";
        }
        if (e.target.querySelector("#videoThumbnail").value) {
          e.target.querySelector("#videoThumbnail").value = "";
        }
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to add client work photo. Please try again later.", {
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
    getCategories();
  }, []);

  const loadSalons = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`
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

  const handleCityChange = (e) => {
    const cityValue = e.target.value;
    setSelectedCity(cityValue);
    setIsCitySelected(true);
    // Reset salon, gender, and category when city changes
    setSelectedSalons([]);
    setSelectSalonId("");
    setSelectedGender("");
    setCategoryId("");
  };

  const handleGenderChange = (e) => {
    const genderValue = e.target.value;
    setSelectedGender(genderValue);
    // Reset category when gender changes
    setCategoryId("");
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Client Work</h3>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="city">Select City</label>
              <select
                name="city"
                id="city"
                value={selectedCity || "not-select"}
                onChange={handleCityChange}
              >
                <option value="not-select" disabled hidden>
                  ---Select City---
                </option>
                {city.map((cityName, index) => (
                  <option value={cityName} key={index}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Salon <span className="Note_Inp_Classs">
                Salon Must belong to Selected city
              </span></label>
              <AsyncSelect
                required
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalon) => {
                  setSelectedSalons(selectedSalon);
                  setSelectSalonId(selectedSalon.value);
                  setIsSalonSelected(true);
                  // setSelectedCity("");
                  setSelectedGender("");
                  setCategoryId(""); // Set salon as selected
                }}
                noOptionsMessage={() => "No salons found"}
                placeholder={!isCitySelected ? "---Select City First---" : "Search Salon..."}
                isDisabled={!isCitySelected}
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

          {/* City Selection with Salon Dependency */}
          {/* <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="city">Select City</label>
              <select
                name="city"
                id="city"
                value={selectedCity || "not-select"}
                onChange={handleCityChange}
                disabled={!isSalonSelected} // Disable if salon not selected
              >
                <option value="not-select" disabled hidden>
                  {!isSalonSelected
                    ? "---Select Salon First---"
                    : "---Select City---"}
                </option>
                {city.map((cityName, index) => (
                  <option value={cityName} key={index}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* New Gender Selection */}
          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="gender">Select Gender<span className="Note_Inp_Classs">
                Please first select city and salon
              </span></label>
              <select
                name="gender"
                id="gender"
                value={selectedGender || "not-select"}
                onChange={handleGenderChange}
                disabled={!selectedCity}
              >
                <option value="not-select" disabled hidden>
                  {!isSalonSelected
                    ? "---Select Salon First---"
                    : !selectedCity
                      ? "---Select City First---"
                      : "---Select Gender---"}
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="category">Select Category<span className="Note_Inp_Classs">
                Category Must belong to Selected Salon and Gender
              </span></label>
              <select
                name="category"
                id="category"
                required
                value={categoryId || "not-select"}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!selectedGender}
              >
                <option value="not-select" disabled hidden>
                  {!isSalonSelected
                    ? "---Select Salon First---"
                    : !selectedCity
                      ? "---Select City First---"
                      : !selectedGender
                        ? "---Select Gender First---"
                        : filteredCategoryList.length === 0
                          ? "---No Categories Available---"
                          : "---Select Category---"}
                </option>

                {filteredCategoryList.map((category, index) => (
                  <option value={category.id} key={index}>
                    {category.name +
                      " ( " +
                      category.category_gender +
                      " ) " +
                      " ( " +
                      category.city +
                      " )"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="service_name">Service Name</label>
              <input
                type="text"
                name="service_name"
                placeholder="Enter Service Name"
                id="service_name"
                value={service_name}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="aboutus">Description</label>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="3"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="img">
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 1:1
                </span>
              </label>
              <input
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
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="video">
                Video ( Optional )
                <span className="Note_Inp_Classs">
                  Recommended Video Format: MP4
                </span>
              </label>
              <input
                type="file"
                name="video"
                id="video"
                placeholder="Enter CLient Work Video"
                accept="video/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="videoThumbnail">
                Video Thumbnail ( Optional )
              </label>
              <input
                type="file"
                name="videoThumbnail"
                id="videoThumbnail"
                placeholder="Enter CLient Work Video Thumbnail"
                accept="image/*"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setVideoThumbnail(e.target.files[0])}
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

export default AddClientWorkPhoto;