import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import "../css/form.css";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import ErrorIcon from "@mui/icons-material/Error";
import toast, { Toaster } from "react-hot-toast";

const AddVendor = ({ vendorData, setVendorData }) => {
  console.log("vendordata : ", vendorData);
  const navigate = useNavigate();

  const { authTokens, logoutUser } = useContext(AuthContext);
  const [vendorName, setVendorName] = useState(vendorData?.ownername || "");
  const [businessName, setBusinessName] = useState(
    vendorData?.businessname || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(vendorData?.ph_number || "");
  const [password, setPassword] = useState(vendorData?.password || "");
  const [user, setUser] = useState(vendorData?.user || "");
  const [salonName, setSalonName] = useState(vendorData?.salon_name || "");
  const [salonsData, setSalonsData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [vendorlogo, setVendorLogo] = useState(null);
  const [email, setEmail] = useState(vendorData?.email || "");
  const [branchname, setBranchname] = useState(vendorData?.branchname || "");
  const [branchcode, setBranchcode] = useState(vendorData?.branchcode || "");
  const [selectedSalonId, setSelectedSalonId] = useState(
    vendorData?.salon || ""
  );
  const [selectedSalons, setSelectedSalons] = useState(() => {
    if (vendorData) {
      return {
        value: vendorData?.salon,
        label: vendorData?.salon_name,
      };
    } else {
      return null;
    }
  });

  const getVendors = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/vendor/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setVendorsData(data);
      } else if (response.status === 401) {
        alert("Unauthorized access. Please log in again.");
      } else {
        console.error(`HTTP status ${response.status}`);
        alert(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error.message);
      alert("An error occurred while fetching vendors");
    }
  };

  useEffect(() => {
    getVendors();
  }, [authTokens]);

  const loadSalons = async (inputValue, callback) => {
    if (inputValue !== "") {
      try {
        const response = await fetch(
          `https://backendapi.trakky.in/salons/A1/search-salon/?name=${encodeURIComponent(
            inputValue
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();

        const options = data?.results?.map((salon) => ({
          value: salon.id,
          label: salon.name,
        }));

        callback(options);
      } catch (error) {
        console.error("Error fetching salons:", error.message);
        callback([]);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (phoneNumber.length !== 10) {
      toast.error("Phone number should be of 10 digits");
      return;
    }

    let data = new FormData();
    data.append("ownername", vendorName);
    data.append("businessname", businessName);
    data.append("ph_number", phoneNumber);
    data.append("password", password);
    data.append("salon", selectedSalonId);
    data.append("email", email);
    data.append("branchname", branchname);
    data.append("branchcode", branchcode);

    if (vendorlogo) {
      data.append("logo", vendorlogo[0]);
    }

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salonvendor/vendor/${vendorData?.id || ""}${vendorData ? "/" : ""
        }`,
        {
          method: vendorData ? "PATCH" : "POST",
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to ${vendorData ? "update" : "add"} vendor. Status: ${response.status
          }`
        );
      }

      const responseData = await response.json();

      if (
        responseData.detail === "Authentication credentials were not provided."
      ) {
        alert("You're logged out");
        logoutUser();
        return;
      }

      if (vendorData) {
        setVendorData(responseData);
        toast.success("Vendor updated successfully");
      } else {
        toast.success("Vendor added successfully");
        setBusinessName("");
        setVendorLogo(null);
        document.getElementById("logo").value = "";
        setVendorName("");
        setPassword("");
        setBranchcode("");
        setBranchname("");
        setEmail("");
        setPhoneNumber("");
        setSelectedSalonId("");
        setSelectedSalons(null);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      alert("Failed to process the request. Please try again later.");
    }
  };

  const getSalons = async () => {
    try {
      const requestOption = {
        method: "GET",
        headers: {
          // Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://backendapi.trakky.in/salons/salonadmin/",
        requestOption
      );

      if (response.status === 200) {
        const data = await response.json();
        setSalonsData(data);
      } else if (response.status === 401) {
        alert("Unauthorized access. Please log in again.");
        logoutUser();
      } else {
        console.error(`HTTP status ${response.status}`);
        alert(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching salons:", error.message);
      alert("An error occurred while fetching salons");
    }
  };

  useEffect(() => {
    getSalons();
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
            <div className="input-box inp-salon col-1 col-2 relative">
              <label htmlFor="salons">Select Salon</label>
              <AsyncSelect
                defaultOptions
                loadOptions={loadSalons}
                value={selectedSalons}
                onChange={(selectedSalon) => {
                  setSelectedSalons(selectedSalon);
                  setSelectedSalonId(selectedSalon.value);
                }}
                noOptionsMessage={() => "No salons found"}
                placeholder="Search Salon..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ccc",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#ccc",
                    },
                  }),
                }}
              />
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
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();

                  }
                }}
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
                  required
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
          {/* {vendorData && (
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
          )} */}
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Branch Name</label>
              <input
                type="text"
                name="branchname"
                id="branchname"
                placeholder="Enter Branch Name"
                value={branchname}
                onChange={(e) => setBranchname(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label htmlFor="service-name">Branch Code</label>
              <input
                type="text"
                name="branchcode"
                id="branchcode"
                placeholder="Enter Branch Code"
                value={branchcode}
                onChange={(e) => setBranchcode(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-box inp-service col-1 col-2">
              <label>Logo</label>
              <input
                type="file"
                name="logo"
                id="logo"
                style={{ width: "fit-content", cursor: "pointer" }}
                onChange={(e) => setVendorLogo(e.target.files)}
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
