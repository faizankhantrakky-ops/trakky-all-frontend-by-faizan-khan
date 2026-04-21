import React, {
  useState,
  useRef,
  useLayoutEffect,
  useContext,
  useEffect,
} from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Quill from "quill";
import "quill/dist/quill.snow.css";

const MasterService = ({ masterServiceData, setMasterServiceData }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [service, setService] = useState(masterServiceData?.service_name || "");
  const [img, setImg] = useState(null);
  const [description, setDescription] = useState(
    masterServiceData?.description || ""
  );

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

    if (masterServiceData) {
      editorRef.current.root.innerHTML = masterServiceData.description;
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("service_name", service);
    formData.append("description", editorRef.current.root.innerHTML);
    if (img || !masterServiceData) formData.append("service_image", img);
    // formData.append("description", description);

    if (masterServiceData) {
      try {
        let url = `https://backendapi.trakky.in/spas/masterservice/${masterServiceData.id}/`;

        let response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        });

        if (response.status === 200) {
          let data = await response.json();
          setMasterServiceData(data);
          toast.success("Service updated successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
        } else if (response.status === 401) {
          toast.error("Unauthorized access. Please log in again.", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
        } else if (response.status === 409) {
          toast.error(
            "This name for the specified gender already exists. Please check service name as it is already exist.",
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#fff",
              },
            }
          );
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

        setService("");
        editorRef.current.root.innerHTML = "";

        // setDescription("");
      } catch (error) {
        toast.error("Failed to update service. Please try again later.", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
            color: "#fff",
          },
        });
      }
    } else {
      try {
        let url = `https://backendapi.trakky.in/spas/masterservice/`;

        let response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + `${authTokens.access}`,
          },
          body: formData,
        });

        if (response.status === 201) {
          toast.success("Service added successfully", {
            duration: 4000,
            position: "top-center",
            style: {
              background: "green",
              color: "#fff",
            },
          });
          setService("");
          editorRef.current.root.innerHTML = "";
          setImg(null);
          document.getElementById("img").value = "";
        } else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 409) {
          toast.error(
            "This name for the specified gender already exists. Please check service name as it is already exist.",
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#fff",
              },
            }
          );
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
        toast.error("Failed to add service. Please try again later.", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "red",
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
            <h3 className="form-title">Add Master Services</h3>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Service Name</label>
              <input
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Enter Service Name"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
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
            <div className="input-box inp-main-img col-1 col-2">
              <label>
                Image
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 1:1
                </span>
              </label>
              <input
                type="file"
                name="img"
                id="img"
                required={!masterServiceData}
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

export default MasterService;
