import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";

import toast, { Toaster } from "react-hot-toast";
import { selectClasses } from "@mui/material";

const AddCategory = ({ CategoryData, setCategoryData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [slug, setSlug] = useState(CategoryData?.slug || "");
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    CategoryData?.city.charAt(0).toUpperCase() +
    CategoryData?.city.slice(1).toLowerCase() || ""
  );
  const [city, setCity] = useState([]);

  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(
    CategoryData?.master_category_id || ""
  );
  const [categoryName, setCategoryName] = useState(
    CategoryData?.category_name || ""
  );

  console.log("CategoryData", CategoryData?.master_category_id);

  const [selectedSalonIds, setSelectedSalons] = useState([]);

  useEffect(() => {
    if (CategoryData) {
      const salonDatas = Object.keys(CategoryData?.salon_names || {}).map(
        (key) => ({
          value: key,
          label: CategoryData?.salon_names[key],
        })
      );
      setSelectedSalons(salonDatas);
      setCategoryId(CategoryData.master_category_id);
    }
  }, [CategoryData, cityPayload]);

  useEffect(() => {
    console.log(selectedCity);
  }, [selectedCity]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map(
          (item) =>
            item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
        );
        setCity(city);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    console.log("Cities : ", city);
  }, [city]);

  useEffect(() => {
    getCity();
    getCategories();
  }, []);

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
        "https://backendapi.trakky.in/salons/mastercategory/",
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
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
        toast.error(`Error : ${response.status} - ${response.statusText}`, {
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
      console.error("Network error:", error.message);
      toast.error("Failed to fetch categories. Please try again later.", {
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

  const [salonSearch, setSalonSearch] = useState("");

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

  console.log("selectedSalonIds", categoryId);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("master_category_id", categoryId);
    formData.append("city", selectedCity);
    for (var i = 0; i < selectedSalonIds.length; i++) {
      formData.append("salon", selectedSalonIds[i].value);
    }

    if (CategoryData) {
      try {
        let url = `https://backendapi.trakky.in/salons/category/${CategoryData.id}/`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 200) {
          const data = await response.json();
          setCategoryData(data);
          toast.success("Category updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "green",
            },
          });
        } else if (response.status === 409) {
          let data = await response.json();
          toast.error(`${data?.error}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        } else {
          toast.error(`Something went wrong , ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        }
      } catch (error) {
        toast.error(`Something went wrong : ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            color: "white",
            backgroundColor: "red",
          },
        });
      }
    } else {
      try {
        let url = `https://backendapi.trakky.in/salons/category/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 201) {
          const data = await response.json();
          toast.success("Category added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "green",
            },
          });
          setSelectedCity("");
          setSelectedSalons([]);
          setCategoryId("");
          setCategoryName("");
          setSlug("");
        } else if (response.status === 409) {
          let data = await response.json();
          toast.error(`${data?.error}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        } else {
          toast.error(`Something went wrong , ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        }
      } catch (error) {
        toast.error(`Something went wrong : ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            color: "white",
            backgroundColor: "red",
          },
        });
      }
    }
  };

  useEffect(() => {
    if (CategoryData === undefined) {
      let temp = categoryName + "-" + selectedCity;
      setSlug(temp.replace(" ", "-").toLowerCase());
    }
  }, [selectedCity, categoryName]);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Category</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">
                Select City
                <span className="Note_Inp_Classs">
                  City is required to Add Category
                </span>
              </label>
              <select
                disabled={CategoryData}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                }}
                required
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
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="category">
                Select Category
                <span className="Note_Inp_Classs">
                  Make Sure Category is not already added in the selected city
                </span>
              </label>
              <select
                disabled={CategoryData}
                name="category"
                id="category"
                required
                value={
                  categoryId !== "" && categoryName !== ""
                    ? [categoryId, categoryName]
                    : "not-select"
                }
                onChange={(e) => {
                  const [id, name] = e.target.value.split(",");
                  setCategoryId(id);
                  setCategoryName(name);
                }}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>

                {categoryList?.map((category, index) => (
                  <option value={[category.id, category.name]} key={index}>
                    {category.name + " (" + category.gender + ") "}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Salon</label>
              <AsyncSelect
                isMulti
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalonIds}
                onChange={(selectedOptions) => {
                  setSelectedSalons(selectedOptions);
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
            <div className="input-box inp-slug col-1 col-2">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                name="slug"
                id="slug"
                placeholder="Enter Slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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

export default AddCategory;
