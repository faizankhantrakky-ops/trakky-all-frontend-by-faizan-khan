import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

const AddOffer = ({
  masterCategoryData,
  setmasterCategoryData,
  closeModal,
}) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [name, setName] = useState(masterCategoryData?.name || "");
  const [gender, setGender] = useState(masterCategoryData?.gender || "");
  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    toast.loading("Please wait...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);

    if (img || !masterCategoryData) {
      formData.append("mastercategory_image", img);
    }

    if (masterCategoryData) {
      try {
        let url = `https://backendapi.trakky.in/salons/mastercategory/${masterCategoryData.id}/`;

        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        toast.dismiss();

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 200) {
          const data = await response.json();
          // setmasterCategoryData(data);
          toast.success("Master category updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "green",
            },
          });
          closeModal();
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

        setGender("");
        setName("");
        setImg(null);
      } catch (error) {
        toast.dismiss();
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
        let url = `https://backendapi.trakky.in/salons/mastercategory/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        toast.dismiss();

        if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 201) {
          const data = await response.json();
          toast.success("Master category added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "green",
            },
          });
          setGender("");
          setName("");
          setImg(null);
          document.getElementById("img").value = "";
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
          toast.error(`Something went wrong ${response.status} `, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        }
      } catch (error) {
        toast.dismiss();
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

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">
              {masterCategoryData ? "Update" : "Add"} Master Category
            </h3>
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
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="gender">Select Gender</label>
              <select
                name="gender"
                id="gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" selected>
                  ---Select---
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Image{" "}
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 1:1
                </span>
              </label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                {...(masterCategoryData ? {} : { required: true })}
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
                style={{ width: "fit-content", cursor: "pointer" }}
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
