import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";

const AddOffer = ({ offerData, setOfferData }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(offerData?.name || "");
  const [slug, setSlug] = useState(offerData?.slug || "");
  const [img, setImg] = useState(null);

  const [city, setCity] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(offerData?.city || "");
  const [selectedAreaName, setSelectedAreaName] = useState(
    offerData?.area || ""
  );
  const [availableAreaName, setAvailableAreaName] = useState([]);

  const [selectedSpaIds, setSelectedSpas] = useState([]);

  useEffect(() => {
    if (offerData) {
      const spaDatas = Object.keys(offerData?.spa_names || {}).map((key) => {
        return { value: key, label: offerData?.spa_names[key] };
      });
      setSelectedSpas(spaDatas);
    }
  }, [offerData]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/spas/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) => alert(err));
  };

  function getAreaNames(cityList) {
    if (!cityList) {
      return cityPayload?.flatMap((city) => city?.area_names);
    } else {
      let selectedAreas = [];
      let cityName = selectedCity.toLowerCase();
      for (let city of cityPayload) {
        if (city?.name.toLowerCase() === cityName) {
          selectedAreas = selectedAreas?.concat(city.area_names);
          break;
        }
      }
      return selectedAreas;
    }
  }

  useEffect(() => {
    setAvailableAreaName(getAreaNames(selectedCity));
  }, [selectedCity, cityPayload]);

  useEffect(() => {
    getCity();
  }, []);

  const loadspas = async (inputValue, callback) => {
    try {
      if (!selectedCity) {
        callback([]);
        return;
      }

      let url = `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
        inputValue
      )}&city=${selectedCity}`;

      if (selectedAreaName?.length > 0) {
        url += `&area=${selectedAreaName}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const options = data?.results?.map((spa) => ({
        value: spa.id,
        label: spa.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      toast.error("Something went wrong !", {
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
    // setIsLoading(true);

    if (selectedSpaIds.length === 0) {
      // alert("Please select at least one spa");
      toast.error("Please select at least one spa", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const offerModel = new FormData();
    offerModel.append("name", name);
    offerModel.append("slug", slug);
    offerModel.append("city", selectedCity);
    if (selectedAreaName) offerModel.append("area", selectedAreaName);

    if (img || !offerData) offerModel.append("img_url", img);
    for (var i = 0; i < selectedSpaIds.length; i++) {
      offerModel.append("spa", selectedSpaIds[i]?.value);
    }

    if (offerData) {
      try {
        const response = await fetch(`https://backendapi.trakky.in/spas/offer/${offerData.id}/`, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: offerModel,
        })
        if (response.ok) {
          // response.json().then((resp))
          setOfferData(response.json());
          toast.success("Offer updated successfully.", {
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
          let errorMessage = errorData.slug !== undefined ? errorData.slug : "";
          errorMessage += " ";
          errorMessage +=
            errorData.img_url !== undefined ? errorData.img_url : "";
          if (errorMessage.length === 0) {
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
        console.error("Error uploading image", error);
        toast.error("Error uploading image.", {
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
        const response = await fetch(`https://backendapi.trakky.in/spas/offer/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: offerModel,
        });
        if (response.ok) {
          toast.success("Offer added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedCity("");
          setSelectedAreaName("");
          setSlug("");
          setName("");
          setSelectedSpas("");
          setImg("");
          document.getElementById("img").value = "";
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
          let errorMessage = errorData.slug !== undefined ? errorData.slug : "";
          errorMessage += " ";
          errorMessage +=
            errorData.img_url !== undefined ? errorData.img_url : "";
          if (errorMessage.length === 0) {
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
        console.error("Error uploading image", error);
        toast.error(`Error uploading image ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "white",
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
            <h3 className="form-title">{offerData ? "Update" : "Add"} Offer</h3>
          </div>

          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedAreaName("");
                  setSelectedSpas([]);
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
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select Area</label>
              <select
                name="id"
                id="id"
                value={selectedAreaName}
                onChange={(e) => {
                  setSelectedSpas([]);
                  setSelectedAreaName(e.target.value);
                }}
                // required
              >
                <option value="">Select Area</option>
                {availableAreaName.map((item, index) => (
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
          <div className="row">
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="spas">Select spa</label>
              <AsyncSelect
                isMulti
                defaultOptions
                loadOptions={loadspas}
                value={selectedSpaIds}
                onChange={(selectedOptions) => {
                  setSelectedSpas(selectedOptions);
                }}
                noOptionsMessage={() => "No spas found"}
                placeholder="Search spa..."
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

          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>Image</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                {...(offerData ? {} : { required: true })}
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                style={{ cursor: "pointer", width: "fit-content" }}
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

export default AddOffer;
