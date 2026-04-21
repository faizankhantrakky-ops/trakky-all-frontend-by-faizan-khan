import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const BlogCategory = ({ CategoryData, setCategoryData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(CategoryData?.name || "");
  const [selectedCity, setSelectedCity] = useState(CategoryData?.city || "");
  const [city, setCity] = useState([]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/salons/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    getCity();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", selectedCity);

    if (CategoryData) {
      try {
        let response = await fetch(
          `https://backendapi.trakky.in/salons/blogcategory/${CategoryData.id}/`,

          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 400) {
          toast.error(`Error : Blog category with this name already exists.`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        } else if (response.ok) {
          toast.success("Category updated successfully");
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
        alert("Error occured", error);
      }
    } else {
      try {
        const response = await fetch(
          "https://backendapi.trakky.in/salons/blogcategory/",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 409) {
          toast.error(`This category already exists.`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        } else if (response.ok) {
          toast.success("Category added successfully");
          setName("");
          setSelectedCity("");
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
        alert("Error occured", error);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Blog Category</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
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
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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

export default BlogCategory;
