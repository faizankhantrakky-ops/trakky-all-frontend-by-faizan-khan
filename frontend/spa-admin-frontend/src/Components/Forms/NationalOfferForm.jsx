import React from "react";
import "../css/form.css";
import { useState, useContext } from "react";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const NationalOfferForm = ({ offerData, closeModal, updateOffer }) => {
  const { authTokens } = useContext(AuthContext);
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
          `https://backendapi.trakky.in/spas/national-offers/${offerData.id}/`,
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
          `https://backendapi.trakky.in/spas/national-offers/`,
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
        } else if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json();
          let errorMessage =
            errorData.title !== undefined ? errorData.title : "";
          errorMessage += " ";
          errorMessage += errorData.image !== undefined ? errorData.image : "";
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
              {...(offerData ? {} : { required: true })}
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
              style={{cursor:"pointer",width:"fit-content"}}
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

export default NationalOfferForm;
