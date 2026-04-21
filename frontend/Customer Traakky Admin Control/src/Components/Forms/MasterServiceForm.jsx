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

const AddService = ({ masterServiceData, setMasterServiceData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);

  const [gender, setGender] = useState(masterServiceData?.gender || "");

  const [service, setService] = useState(masterServiceData?.service_name || "");

  const [img, setImg] = useState(null);

  const [description, setDescription] = useState(
    masterServiceData?.description || ""
  );
  const [categoryList, setCategoryList] = useState([]);
  const [categoryId, setCategoryId] = useState(
    masterServiceData?.categories || ""
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
    formData.append("gender", gender);
    formData.append("categories", categoryId);

    if (img || !masterServiceData) {
      formData.append("service_image", img);
    }

    if (masterServiceData) {
      try {
        let url = `https://backendapi.trakky.in/salons/masterservice/${masterServiceData.id}/`;

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

        setCategoryId("");
        setGender("");
        setService("");
        setImg(null);
        editorRef.current.root.innerHTML = "";

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
        let url = `https://backendapi.trakky.in/salons/masterservice/`;
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
          setCategoryId("");
          setGender("");
          setService("");
          setImg(null);
          editorRef.current.root.innerHTML = "";
          document.getElementById("img").value = "";

        } else if (response.status === 401) {
          alert("You're logged out");
          logoutUser();
        } else if (response.status === 409) {
          const responseData = await response.json();
          const errorMessage = responseData.error;
          toast.error(`Error: ${errorMessage}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#fff",
            },
          });
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

  const getMasterCategories = async (selectedgender) => {
    try {
      let url = "https://backendapi.trakky.in/salons/mastercategory/";

      if (selectedgender) {
        url += `?gender=${selectedgender}`;
      }

      const requestOption = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, requestOption);

      if (response.status === 200) {
        const data = await response.json();
        setCategoryList(data);
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
      toast.error("Failed to fetch categories. Please try again later.", {
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
    getMasterCategories(gender);
  }, [gender]);

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add Master Services</h3>
          </div>
          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="category">Select Gender</label>
              <select
                name="gender"
                id="gender"
                required
                value={gender || "not-select"}
                onChange={(e) => {
                  setCategoryId("");
                  setGender(e.target.value);
                }}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-time col-1 col-2">
              <label htmlFor="category">Select Category</label>
              <select
                name="category"
                id="category"
                required
                value={categoryId || "not-select"}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>

                {categoryList?.map((category, index) => (
                  <option value={category.id} key={index}>
                    {category.name + " (" + category.gender + ") "}
                  </option>
                ))}
              </select>
            </div>
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
                Service Image{" "}
                <span className="Note_Inp_Classs">
                  Recommended Image Ratio 1:1
                </span>
              </label>
              <input
                type="file"
                name="img"
                id="img"
                placeholder="Enter Image"
                {...(masterServiceData ? {} : { required: true })}
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

export default AddService;
