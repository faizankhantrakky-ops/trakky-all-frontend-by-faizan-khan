import React, { useState, useLayoutEffect, useContext, useRef } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Quill from "quill";
import AsyncSelect from "react-select/async";
import "quill/dist/quill.snow.css";

const AddBestsellerMassage = ({ bestSellerData, setBestSellerData }) => {
  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(
    bestSellerData?.spa_city || ""
  );
  const [bestSellerName, setBestSellerName] = useState(
    bestSellerData?.name || ""
  );
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [spasData, setSpasData] = useState([]);
  const [selectedSpaId, setSelectedSpaId] = useState(bestSellerData?.spa || "");
  const [selectedSpas, setSelectedSpas] = useState(() => {
    if (bestSellerData) {
      return {
        value: bestSellerData?.spa,
        label: bestSellerData?.spa_name,
      };
    } else {
      return null;
    }
  });
  const [price, setPrice] = useState(bestSellerData?.price || "");
  const [img, setImg] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "bullet" }],
        ],
      },
    });

    if (bestSellerData) {
      editorRef.current.root.innerHTML = bestSellerData.description;
    }
  }, []);

  useEffect(() => {
    getCity();
  }, []);

  const loadSpas = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      const response = await fetch(url);
      const data = await response.json();

      const options = data?.results?.map((spa) => ({
        value: spa.id,
        label: spa.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      callback([]);
    }
  };

  const getCity = async () => {
    try {
      const url = `https://backendapi.trakky.in/spas/city/`;

      const response = await fetch(url);

      if (response.status === 200) {
        const data = await response.json();
        const cityNames = data?.payload.map((item) => item.name);

        setCityPayload(data?.payload);
        setCity(cityNames);
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
      toast.error("Failed to fetch cities. Please try again later.", {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("spa", selectedSpaId);
    formData.append("name", bestSellerName);
    formData.append("description", editorRef.current.root.innerHTML);
    formData.append("price", price);
    if (img !== null) {
      formData.append("image", img);
    }
    if (bestSellerData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/best-sellar-massage/${bestSellerData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          const updatedData = await response.json(); // Parse the JSON response
          setBestSellerData(updatedData);
          toast.success("Updated successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
          toast.error("You're logged out.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.image !== undefined ? errorData.image + " " : "";
          errorMessage +=
            errorData.detail !== undefined ? errorData.detail + " " : "";
          errorMessage +=
            errorData.spa !== undefined ? errorData.spa + " " : "";
          errorMessage +=
            errorData.spa_city !== undefined ? errorData.spa_city + " " : "";
          errorMessage +=
            errorData.name !== undefined ? errorData.name + " " : "";
          errorMessage +=
            errorData.price !== undefined ? errorData.price + " " : "";
          errorMessage +=
            errorData.description !== undefined
              ? errorData.description + " "
              : "";

          if (errorMessage === "") {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        } else {
          toast.error(`Something Went Wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        }
      } catch (error) {
        console.log("Error occured : ", error);
        toast.error("Error occured.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } else {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/best-sellar-massage/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        if (response.ok) {
          toast.success("Added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedSpas("");
          setSelectedCity("");
          setBestSellerName("");
          setPrice("");
          setImg(null);
          document.getElementById("img").value = "";
          editorRef.current.root.innerHTML = "";
        } else if (response.status === 401) {
          toast.error("You're logged out.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.image !== undefined ? errorData.image + " " : "";
          errorMessage +=
            errorData.detail !== undefined ? errorData.detail + " " : "";
          errorMessage +=
            errorData.spa !== undefined ? errorData.spa + " " : "";
          errorMessage +=
            errorData.spa_city !== undefined ? errorData.spa_city + " " : "";
          errorMessage +=
            errorData.name !== undefined ? errorData.name + " " : "";
          errorMessage +=
            errorData.price !== undefined ? errorData.price + " " : "";
          errorMessage +=
            errorData.description !== undefined
              ? errorData.description + " "
              : "";

          if (errorMessage === "") {
            errorMessage += `Something Went Wrong : ${response.status}`;
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        } else {
          toast.error(`Something Went Wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
        }
      } catch (error) {
        console.log("Error occured", error);
        toast.error("Error occured.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };
  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Bestseller Massage</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                disabled={city.length === 0}
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSpas("");
                  setSelectedCity(e.target.value);
                }}
                required
              >
                <option value="">
                  {city.length === 0
                    ? "Wait Cities are loading"
                    : "Select City"}
                </option>
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
              <label htmlFor="spas">
                Select Spa
                <span className="Note_Inp_Classs">
                  Spa Must belongs to Selected city
                </span>
              </label>
              <AsyncSelect
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
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="bestseller-name">Bestseller Massage Name</label>
              <input
                type="text"
                name="bestseller-name"
                id="bestseller-name"
                placeholder="Enter Name"
                required
                value={bestSellerName}
                onChange={(e) => setBestSellerName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Description</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="price">Starts with Price</label>
              <input
                type="number"
                name="price"
                id="price"
                min={0}
                placeholder="Enter Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 360px:200px
                </span>
              </label>
              <input
                type="file"
                name="img"
                id="img"
                required={!bestSellerData}
                placeholder="Enter Image"
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

export default AddBestsellerMassage;
