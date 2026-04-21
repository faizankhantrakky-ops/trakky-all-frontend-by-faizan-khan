import React, { useState, useContext } from "react";
import "./css/form.css";
import AuthContext from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ErrorIcon from "@mui/icons-material/Error";

const AddUser = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
        username: username,
        first_name: name,
        is_superuser: false,
        password: password,
    };

    const submitForm = async (data) => {

      try {
        let response = await fetch(
          `https://backendapi.trakky.in/salons/users/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {

            let data = await response.json();
        
            setName("");
            setUserName("");
            setPassword("");
            toast.success("User added successfully", {
              duration: 4000,
              position: "top-center",
            });            
        }
      } catch (error) {
        toast.error("Error occurred: " + error.message, {
          duration: 4000,
          position: "top-center",
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
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter User Name"
                required
                value={
                    username
                }
                onChange={(e) => {
                    setUserName(e.target.value);
                }}
              />
            </div>
            </div>
            <div className="row">
            <div className="input-box inp-phonenum col-2 relative">
                <label htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    }}
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

export default AddUser;
