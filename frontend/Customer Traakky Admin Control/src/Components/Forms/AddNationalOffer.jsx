import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddNationalOffer = ({ offerData, closeModal, updateOffer }) => {
  const navigate = useNavigate();
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [title, setTitle] = useState(offerData?.title || "");

  const [img, setImg] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const offerModel = new FormData();
    offerModel.append("title", title);

    if (img || !offerData) offerModel.append("image", img);

    if (offerData) {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/national-offers/${offerData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: offerModel,
          }
        );

        if (response.status == 200) {
          toast.success("Offer Updated Successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          setImg("");
          setTitle("");
          updateOffer();
          closeModal();
        } else {
          toast.error(`some thing went wrong : ${response.status}`, {
            duration: 4000,
            position: "top-center",
          });
          setImg("");
          setTitle("");
          document.getElementById("img").value = "";
        }
      } catch (error) {
        toast.error(`Error : ${error}`, {
          duration: 4000,
          position: "top-center",
        });
        setImg("");
        setTitle("");
        document.getElementById("img").value = "";
      }
    } else {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/national-offers/`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: offerModel,
          }
        );

        if (response.ok) {
          toast.success("Offer Added Successfully", {
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
            {offerData ? "Update" : "Add"} National Offer
          </h3>
        </div>

        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="title">title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-main-img col-1 col-2">
            <label htmlFor="img">
              Image{" "}
              <span className="Note_Inp_Classs">Recommended Image Ratio 5:1</span>
            </label>
            <input
              type="file"
              name="img"
              id="img"
              placeholder="Enter Image"
              {...(offerData ? {} : { required: true })}
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

export default AddNationalOffer;
