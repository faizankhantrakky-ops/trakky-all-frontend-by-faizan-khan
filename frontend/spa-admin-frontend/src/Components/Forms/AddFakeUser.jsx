import React, { useState, useContext } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ErrorIcon from "@mui/icons-material/Error";

const AddUser = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const generatePhoneNumber = () => {
    const randomPhoneNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );
    return randomPhoneNumber.toString();
  };

  const [phoneNumber, setPhoneNumber] = useState(generatePhoneNumber());
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      phone_number: phoneNumber,
      name: name,
    };

    const submitForm = async (data) => {
      const toastId = toast.loading("Submitting...");

      try {
        let response = await fetch(`https://backendapi.trakky.in/spas/spauser/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const resp = await response.json();
          if (resp.detail === "Authentication credentials were not provided.") {
            alert("You're logged out");
            logoutUser();
          } else {
            let successMessage = "Added successfully";
            toast.success(successMessage, {
              id: toastId,
              duration: 2000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            setPhoneNumber(generatePhoneNumber());
            setName("");
          }
        } else if (response.status === 401) {
          toast.error("Unauthorized: Please log in again", {
            id: toastId,
            duration: 2000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          logoutUser();
        } else if (response.status === 400) {
          const errorResponse = await response.json();
          if (
            errorResponse.phone_number &&
            errorResponse.phone_number.includes(
              "spa user with this phone number already exists."
            )
          ) {
            // Generate a new phone number and try again
            setPhoneNumber(generatePhoneNumber());
            submitForm({
              phone_number: generatePhoneNumber(),
              name: name,
            });
          } else {
            toast.error("This already exists", {
              id: toastId,
              duration: 4000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        } else if (response.status >= 400 && response.status < 500) {
          const errorMessage = await response.text();
          toast.error(`Client Error: ${response.status} - ${errorMessage}`, {
            id: toastId,
            duration: 4000,
            position: "top-center",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          throw new Error(
            `Server Error: ${response.status} - ${response.statusText}`
          );
        }
      } catch (error) {
        toast.error("Error occurred: " + error.message, {
          id: toastId,
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

    submitForm(data);
  };

  return (
    <>
      <Toaster />
      <div className="form-container">
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <h3 className="form-title">Add User</h3>
          </div>
          <div className="row">
            <div className="input-box inp-phonenum col-2 relative">
              <label htmlFor="name">Name </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-phonenum col-2 relative">
              <label htmlFor="phonenum">
                Phone Number{" "}
                <span className="Note_Inp_Classs">
                  Phone Number Must be of 10 Digits
                </span>
              </label>
              <input
                type="text"
                name="phonenum"
                id="phonenum"
                placeholder="Enter Phone Number"
                required
                value={phoneNumber}
                disabled
              />
              {phoneNumber.length !== 10 && phoneNumber.length !== 0 && (
                <ErrorIcon
                  className="error-icon absolute right-[20px] bottom-[5px] hidden"
                  color="error"
                />
              )}
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

export default AddUser;
