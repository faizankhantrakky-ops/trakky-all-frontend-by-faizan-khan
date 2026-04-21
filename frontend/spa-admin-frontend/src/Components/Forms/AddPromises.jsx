import React, {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  useEffect,
} from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";

import Quill from "quill";
import "quill/dist/quill.snow.css";

import toast, { Toaster } from "react-hot-toast";

const AddPromises = ({ promisesData, setPromisesData, closeModal }) => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [promises, setPromises] = useState(promisesData?.promise || "");

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

    if (promisesData) {
      editorRef.current.root.innerHTML = promisesData.promise;
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("promise", editorRef.current.root.innerHTML);

    if (promisesData) {
      try {
        let response = await fetch(
          `https://backendapi.trakky.in/spas/promises/${promisesData.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: formData,
          }
        );

        if (response.status === 401) {
          toast.error("You're logged out", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
          logoutUser();
        } else if (response.status === 200) {
          toast.success("Promises updated successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "green",
              color: "#FFFFFF",
            },
          });
          closeModal();
        } else if (response.status === 400) {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(
            `Error : This master promises is already associated with this spa.`,
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#FFFFFF",
              },
            }
          );
        } else {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(`Error : ${response.status} - ${response.statusText}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
        }
      } catch (error) {
        console.error("Error occured : ", error);
        toast.error("Error occured : ", error, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "red",
            color: "#FFFFFF",
          },
        });
      }
    } else {
      try {
        let response = await fetch(`https://backendapi.trakky.in/spas/promises/`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: formData,
        });

        if (response.status === 401) {
          toast.error("You're logged out", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
          logoutUser();
        } else if (response.status === 201) {
          let data = await response.json();
          toast.success("Promises added successfully.", {
            duration: 2000,
            position: "top-center",
            style: {
              background: "green",
              color: "#FFFFFF",
            },
          });
          editorRef.current.root.innerHTML = "";
        } else if (response.status === 400) {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(
            `Error : This master promises is already associated with this spa.`,
            {
              duration: 4000,
              position: "top-center",
              style: {
                background: "red",
                color: "#FFFFFF",
              },
            }
          );
        } else {
          console.error(`Error : ${response.status} - ${response.statusText}`);
          toast.error(`Error : ${response.status} - ${response.statusText}`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "red",
              color: "#FFFFFF",
            },
          });
        }
      } catch (error) {
        toast.error("Error occured : ", error, {
          duration: 2000,
          position: "top-center",
          style: {
            background: "red",
            color: "#FFFFFF",
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
            <h3 className="form-title">Add Promises</h3>
          </div>
          <div className="row">
            <div className="input-box inp-name col-1 col-2">
              <label htmlFor="content">Promises</label>
              <div id="editor" style={{ width: "100%", height: "100px" }}></div>
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

export default AddPromises;
