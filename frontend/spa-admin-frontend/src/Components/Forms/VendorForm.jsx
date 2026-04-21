import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ErrorIcon from "@mui/icons-material/Error";

const AddVendor = ({ vendorData, setVendorData }) => {
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [vendorName, setVendorName] = useState(vendorData?.ownername || "");
  const [businessName, setBusinessName] = useState(
    vendorData?.businessname || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(vendorData?.ph_number || "");
  const [password, setPassword] = useState(vendorData?.password || "");
  const [user, setUser] = useState(vendorData?.user || "");
  const [spa, setSpa] = useState(vendorData?.spa || "");
  const [spaName, setSpaName] = useState(vendorData?.spa_name || "");
  const [spasData, setSpasData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [vendorlogo, setVendorLogo] = useState(null);

  const getVendors = () => {
    fetch("https://backendapi.trakky.in/spavendor/vendor/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVendorsData(data);
      })
      .catch((err) =>
        toast.error(err, {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      );
  };

  useEffect(() => {
    getVendors();
  }, [authTokens]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (phoneNumber.length !== 10) {
      toast.error("Phone number should be of 10 digits.", {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    let data = new FormData();
    data.append("ownername", vendorName);
    data.append("businessname", businessName);
    data.append("ph_number", phoneNumber);
    data.append("password", password);
    data.append("spa", spa);

    if (vendorlogo) {
      data.append("logo", vendorlogo[0]);
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/vendor/${vendorData?.id || ""}${
          vendorData ? "/" : ""
        }`,
        {
          method: vendorData ? "PATCH" : "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: data,
        }
      );
      if (response.ok) {
        const resp = await response.json();
        if (vendorData) {
          setVendorData(resp);
        }
        toast.success("Vendor added successfully.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setPhoneNumber("");
        setPassword("");
        setBusinessName("");
        setVendorLogo(null);
        setSpaName("");
        setVendorName("");
        document.getElementById("logo").value = "";

        // setTimeout(() => {
        //   let ask = window.confirm("Redirect to list");
        //   if (ask) {
        //     navigate("/listvendors");
        //   }
        // }, 2100);
      } else if (response.status === 401) {
        toast.error("You're logged out.", {
          duration: 2000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        logoutUser();
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        let errorMessage = errorData.logo !== undefined ? errorData.logo : "";
        errorMessage += " ";
        errorMessage += errorData.error !== undefined ? errorData.error : "";
        errorMessage += " ";
        errorMessage += errorData.ph_number !== undefined ? errorData.ph_number : "";
        errorMessage += " ";
        errorMessage += errorData.spa !== undefined ? errorData.spa : "";
        errorMessage += " ";
        if (errorMessage === "   ") {
          errorMessage += `Something Went Wrongs : ${response.status}`;
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
        throw new Error(response.statusText || "Error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error occured : ${error.message}`, {
        duration: 2000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const getSpas = () => {
    const requestOption = {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + `${authTokens.access}`,
        "Content-Type": "application/json",
      },
    };
    fetch("https://backendapi.trakky.in/spas/spaadmin/", requestOption)
      .then((res) => res.json())
      .then((data) => {
        setSpasData(data);
        // setIsLoading(false);
      })
      .catch((err) => alert(err));
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
            <h3 className="form-title">Add Vendor</h3>
          </div>
          <div className="row">
            <div className="input-box inp-spa col-1 col-2">
              <label htmlFor="spas">Select Spa</label>
              <select
                name="spas"
                id="spas"
                required
                value={spa || "not-select"}
                onChange={(e) => setSpa(e.target.value)}
              >
                <option value="not-select" disabled hidden>
                  ---Select---
                </option>
                {spasData.map((spa, index) => (
                  <option
                    value={spa.id}
                    key={index}
                    disabled={
                      vendorsData?.filter((vendor) => vendor.spa === spa.id)
                        .length > 0
                    }
                  >
                    {spa.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Vendor Name</label>
              <input
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Enter Vendor Name"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Business Name</label>
              <input
                type="text"
                name="service-name"
                id="service-name"
                placeholder="Enter Business Name"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          {/* <div className='row'>
          <div className='input-box inp-time col-1 col-2'>
            <label htmlFor="service-time">Select Service Time</label>
            <select name="service-time" id="service-time" required
            value={serviceTime||'not-select'}
            
              onChange={(e) => setServiceTime(e.target.value)}
            >
              <option value="not-select" disabled hidden >---Select---</option>
              <option value="30 min">30 min</option>
              <option value="30 min">45 min</option>
              <option value="60 min">60 min</option>
              <option value="90 min">90 min</option>
              <option value="120 min">120 min</option>
              <option value="180 min">180 min</option>
            </select>
          </div>
        </div> */}
          <div className="row">
            <div className="input-box inp-description col-1 col-2 relative">
              <label htmlFor="service-description">Phone Number</label>
              <input
                type="number"
                name="service-description"
                id="service-description"
                placeholder="Enter Phone Number"
                required
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber((val) => {
                    if (e.target.value.length > 10) {
                      return val;
                    } else if (e.target.value.length < 10) {
                      return e.target.value;
                    } else {
                      return e.target.value;
                    }
                  })
                }
              />
              {phoneNumber.length !== 10 && phoneNumber.length !== 0 && (
                <ErrorIcon
                  className="error-icon absolute right-[20px] bottom-[5px] hidden"
                  color="error"
                />
              )}
            </div>
          </div>
          {!vendorData && (
            <div className="row">
              <div className="input-box inp-discount col-1 col-2">
                <label htmlFor="discount">Password</label>
                <input
                  type="password"
                  name="discount"
                  id="discount"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
          {vendorData && (
            <div className="row">
              <div className="input-box inp-discount col-1 col-2">
                <label htmlFor="discount">User</label>
                <input
                  type="text"
                  name="discount"
                  id="discount"
                  placeholder="Enter User"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  disabled
                />
              </div>
            </div>
          )}
          {/* <div className='row'>
          <div className='input-box inp-price col-1 col-2'>
            <label htmlFor="price">Price</label>
            <input type="number" name='price' id='price' placeholder='Enter Price' required 
            value={price} onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div> */}
          {/* <div className='row'>
          <div className='input-box inp-time col-1 col-2'>
            <label htmlFor="therapy">Select Therapy</label>
            <select name="therapy" id="therapy" required
              value={therapyId || 'not-select'}
              onChange={(e) => setTherapyId(e.target.value)}
            >
              <option value="not-select" disabled hidden>---Select---</option>
              {/* <option value="abc">abc</option>
              <option value="pqr">pqr</option>
              <option value="xyz">xyz</option>
              <option value="lmn">lmn</option> }
              
              {therapyList.map((therapy,index) => (
                <option value={therapy.id} key={index} >{therapy.name}</option>
              ))}
            </select>
          </div>
        </div> */}
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="logo">Logo</label>
              <input
                type="file"
                name="logo"
                id="logo"
                onChange={(e) => setVendorLogo(e.target.files)}
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
    </>
  );
};

export default AddVendor;
