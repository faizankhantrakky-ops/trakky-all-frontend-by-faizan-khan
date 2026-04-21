import React from "react";
import "../css/form.css";
import { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddNationalCategory = ({ categoryData, closeModal, updateCategory }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [title, setTitle] = useState(categoryData?.title || "");

  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryModal = new FormData();
    categoryModal.append("title", title);

    if (img || !categoryData) categoryModal.append("image", img);

    if (categoryData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/national-category/${categoryData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: categoryModal,
          }
        );

        if (response.status === 200) {
          toast.success("Category Updated Successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          setImg("");
          setTitle("");
          updateCategory();
          closeModal();
        } else if (response.status === 400) {
          toast.error(`National category with this title already exists.`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        } else {
          console.error(response);
          toast.error(`Something went wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
          setImg("");
          setTitle("");
        }
      } catch (error) {
        toast.error(`Error : ${error}`, {
          duration: 4000,
          position: "top-center",
        });
        setImg("");
        setTitle("");
      }
    } else {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/national-category/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: categoryModal,
          }
        );

        if (response.ok) {
          toast.success("Category Added Successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          setImg("");
          setTitle("");
          document.getElementById("img").value = "";
        } else if (response.status === 400) {
          const responseData = await response.json();
          let errorMessage = "";
          if (responseData.title) {
            errorMessage += "National category with this title already exists.";
          }
          if (responseData.image) {
            errorMessage += "Upload a valid image.";
          }
          toast.error(`${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        } else {
          toast.error(`Something Went Wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error(`Error : ${error}`, {
          duration: 4000,
          position: "top-center",
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
            {categoryData ? "Update" : "Add"} National Category
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
              {...(categoryData ? {} : { required: true })}
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
  );
};

export default AddNationalCategory;
