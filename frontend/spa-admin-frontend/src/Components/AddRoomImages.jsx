import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AddRoomImages = () => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [spasData, setSpasData] = useState([]);
  const [selectSpaId, setSelectSpaId] = useState("");
  const [roomname, setRoomName] = useState("");
  const [img, setImg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!img) {
      toast.error("Please select an image.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return; // Exit function if image is not selected
    }

    const loadingToastId = toast.loading("Submitting...", {
      duration: null, // Duration set to null for indefinite display
      position: "top-center",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    const formData = new FormData();
    formData.append("room_name", roomname);
    formData.append("room_images", img);

    // Disable the submit button to prevent multiple submissions
    e.target
      .querySelector('button[type="submit"]')
      .setAttribute("disabled", "true");

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/${selectSpaId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        }
      );

      if (response.status === 200) {
        // setSelectSpaId("");
        setRoomName("");
        setImg("");
        e.target.querySelector("#img").value = "";
        const data = await response.json();
        console.log(data);
        toast.success("Room updated successfully.", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        let errorMessage =
          errorData.room_images !== undefined ? errorData.room_images : "";
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
        toast.error(`HTTP error! Status: ${response.status}`, {
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
      console.error("Error : ", error);
      toast.error("Failed to update room. Please try again later.", {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      // Enable the submit button after submission process completes
      e.target
        .querySelector('button[type="submit"]')
        .removeAttribute("disabled");

      // Hide loading toast
      toast.dismiss(loadingToastId);
    }
  };

  const getSpas = async () => {
    try {
      const requestOption = {
        method: "GET",
        headers: {
          // Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://backendapi.trakky.in/spas/spaadmin/",
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setSpasData(data);
      } else {
        let errorMessage = "Failed to fetch spas.";

        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please log in again.";
        } else if (response.status === 404) {
          errorMessage = "Spas not found.";
        } else {
          errorMessage = `HTTP error! Status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
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

  useEffect(() => {
    getSpas();
  }, []);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Room Images</h3>
          </div>
          <div className="row">
            <div className="input-box inp-spa col-1 col-2">
              <label htmlFor="spas">Select Spa</label>
              <select
                name="spas"
                id="spas"
                required
                value={selectSpaId || "not-select"}
                onChange={(e) => setSelectSpaId(e.target.value)}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                {spasData.map((spa, index) => (
                  <option value={spa.id} key={index}>
                    {spa.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="cityname">Room Name</label>
              <input
                type="text"
                name="roomname"
                id="roomname"
                placeholder="Enter Room Name"
                required
                value={roomname}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-box inp-main-img col-1 col-2">
              <label htmlFor="img">Image</label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                accept="image/*"
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

export default AddRoomImages;
