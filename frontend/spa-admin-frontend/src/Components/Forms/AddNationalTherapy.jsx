import React from "react";
import "../css/form.css";
import { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddNationalTherapy = ({ therapyData, closeModal, updateTherapy }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [title, setTitle] = useState(therapyData?.title || "");

  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const therapyModal = new FormData();
    therapyModal.append("title", title);

    if (img || !therapyData) therapyModal.append("image", img);

    if (therapyData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/national-therapy/${therapyData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: therapyModal,
          }
        );

        if (response.status == 200) {
          toast.success("Therapy Updated Successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          setImg("");
          setTitle("");
          updateTherapy();
          closeModal();
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.title !== undefined ? errorData.title : "";
          errorMessage += " ";
          errorMessage += errorData.image !== undefined ? errorData.image : "";
          if (errorMessage === " ") {
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
          toast.error(`some thing went wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "white",
            },
          });
          setImg("");
          setTitle("");
        }
      } catch (error) {
        toast.error(`Error : ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "white",
          },
        });
        setImg("");
        setTitle("");
      }
    } else {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/spas/national-therapy/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: therapyModal,
          }
        );

        if (response.ok) {
          toast.success("Therapy Added Successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          setImg("");
          setTitle("");
          event.target.querySelector("#img").value = "";
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json(); // Parse the JSON response
          let errorMessage =
            errorData.title !== undefined ? errorData.title : "";
          errorMessage += " ";
          errorMessage += errorData.image !== undefined ? errorData.image : "";
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
        toast.error(`Error : ${error}`, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
          },
        });
      }
    }
  };

  return (
    <div className="form-container">
      <Toaster />
      <form method="post" onSubmit={handleSubmit}>
        <div className="row">
          <h3 className="form-title">
            {therapyData ? "Update" : "Add"} National Therapy
          </h3>
        </div>

        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              {...(therapyData ? {} : { required: true })}
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
  );
};

export default AddNationalTherapy;
