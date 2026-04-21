import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";

//MUI____
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const AddTherapy = ({ therapyData, setTherapyData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(therapyData?.name || "");
  const [slug, setSlug] = useState(therapyData?.slug || "");
  const [img, setImg] = useState(null);
  const [spasData, setSpasData] = useState([]);
  const [cityPayload, setCityPayload] = useState([]);
  const [selectedCity, setSelectedCity] = useState(therapyData?.city || "");
  const [city, setCity] = useState([]);

  const [selectedSpaIds, setSelectedSpaIds] = useState([]);

  useEffect(() => {
    if (therapyData) {
      //map key of data
      const spaDatas = Object.keys(therapyData?.spa_names || {}).map((key) => {
        return { value: key, label: therapyData?.spa_names[key] };
      });
      setSelectedSpaIds(spaDatas);
    }
  }, [therapyData]);

  const getCity = async () => {
    let url = `https://backendapi.trakky.in/spas/city/`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityPayload(data?.payload);
        let city = data?.payload.map((item) => item.name);

        setCity(city);
      })
      .catch((err) =>
        toast.error(err, {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      );
  };

  useEffect(() => {
    getCity();
  }, []);

  const loadSpas = async (inputValue, callback) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/?name=${encodeURIComponent(
          inputValue
        )}&city=${selectedCity}`
      );
      const data = await response.json();

      const options = data?.results?.map((spa) => ({
        value: spa.id,
        label: spa.name,
      }));

      callback(options);
    } catch (error) {
      console.error("Error fetching spas:", error);
      toast.error("Error fetching spas", {
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

  const getSpas = () => {
    const requestOption = {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + `${authTokens.access}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    fetch("https://backendapi.trakky.in/spas/spaadmin/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpasData(data);
        // setIsLoading(false);
      })
      .catch((err) => alert(err));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setIsLoading(true);
    if (selectedSpaIds?.length === 0) {
      toast.error("Please select at least one spa.", {
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    // formData.append("priority", priority);
    formData.append("city", selectedCity);

    if (img || !therapyData) formData.append("image_url", img);
    for (var i = 0; i < selectedSpaIds.length; i++) {
      formData.append("spa", selectedSpaIds[i].value);
    }

    if (therapyData) {
      try {
        let resp = await fetch(
          `https://backendapi.trakky.in/spas/therapy/${therapyData.id}/`,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );
        let data = await resp.json();
        if (resp.status === 200) {
          setTherapyData(data);
          toast.success("Therapy Updated successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else if (resp.status === 401) {
          toast.success("You're logged out.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else {
          console.log("Error occured", data);
          toast.success("error occured.", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.log("Error occured", error);
        toast.success("Error occured.", {
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
        let response = await fetch("https://backendapi.trakky.in/spas/therapy/", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });
        if (response.status === 201) {
          toast.success("Therapy added successfully/", {
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setSelectedCity("");
          setSelectedSpaIds([]);
          setName("");
          setImg(null);
          setName("");
          setSlug("");
          event.target.querySelector("#img").value = "";
        } else if (response.status === 401) {
          toast.error("Authentication credentials were not provided.", {
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
            errorData.image_url !== undefined ? errorData.image_url : "";
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
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedSpaIds(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Therapy</h3>
          </div>
          <div className="row">
            <div className="input-box inp-id col-1 col-2">
              <label htmlFor="id">Select City</label>
              <select
                name="id"
                id="id"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedSpaIds([]);
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
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select spa</label>
              <AsyncSelect
                isMulti
                defaultOptions
                loadOptions={loadSpas}
                value={selectedSpaIds}
                onChange={(selectedOptions) => {
                  setSelectedSpaIds(selectedOptions);
                  // const selectedSpaIds = selectedOptions.map((option) => option.value);
                  // setSelectedSpaIds(selectedSpaIds);
                }}
                noOptionsMessage={() => "No spas found"}
                placeholder="Search Spas..."
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
            {/* <div className="input-box inp-spa col-1 col-2">
            <label htmlFor="spas">Select Spa</label>
            <div className="spa-list">
              {spasData &&
                spasData.map((s, index) => (
                  <div className="spa-item-wrapper" key={index}>
                    <label htmlFor={s.id} className="spa-item-label">
                      {s.name}
                    </label>

                    <input
                      type="checkbox"
                      name="spas"
                      className="spa-item"
                      id={spa.id}
                      value={s.id}
                      checked={spa.includes(s.id.toString())}
                      onChange={handleSpaSelect}
                    />
                  </div>
                ))}
            </div>
          </div> */}
            {/* <div className="input-box inp-spa col-1 col-2">
            <FormControl sx={{ width: "100%" }}>
              <label htmlFor="spas" onClick={handleOpen}>
                Select spa
              </label>
              <Select
                labelId="spas"
                id="spas"
                multiple
                displayEmpty
                value={selectedSpaIds}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={handleChange}
                sx={{
                  width: "100%",
                  "& .MuiSelect-select": {
                    padding: "4.5px 8px",
                  },
                  "& .MuiMenuItem-root": {
                    padding: "0px 16px",
                  },
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <span style={{ color: "#a9a9a9" }}>Select Spas</span>
                    );
                  }
                  return selected
                    .map((id) => {
                      const selectedSpa = spasData.find((spa) => spa.id === id);
                      return selectedSpa.name;
                    })
                    .join(", ");
                }}
              >
                {spasData.map((spa) => (
                  <MenuItem key={spa.id} value={spa.id}>
                    <Checkbox checked={selectedSpaIds.indexOf(spa.id) > -1} />
                    <ListItemText primary={spa.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}
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
            <div className="input-box inp-img col-1 col-2">
              <label htmlFor="img">Image</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                {...(therapyData && { required: false })}
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

export default AddTherapy;
