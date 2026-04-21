import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import AuthContext from "../../Context/Auth";
import { Toaster, toast } from "react-hot-toast";
import validator from "validator";
import TextField from "@mui/material/TextField";

const AddSupplier = ({ supplier }) => {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [validate, setValidate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    supplier_description: "",
    first_name: "",
    last_name: "",
    mobile_no: "",
    telephone: "",
    email: "",
    website: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    country: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.supplier) {
      setFormData(location.state.supplier); // Pre-fill data if available
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      supplier_description,
      first_name,
      last_name,
      mobile_no,
      telephone,
      email,
      website,
      address,
      state,
      city,
      pincode,
      country,
    } = formData;

    // Validate required fields
    if (
      !name ||
      !supplier_description ||
      !first_name ||
      !last_name ||
      !mobile_no ||
      !email
    ) {
      setValidate("Please fill in all required fields.");
      return;
    }

    // Validate email
    if (!validator.isEmail(email)) {
      setValidate("Invalid email address.");
      return;
    }

    // Determine if it's an edit or a new submission
    const isEdit = !!location.state?.supplier;
    const method = isEdit ? "PUT" : "POST"; // Use PUT for editing and POST for new submissions
    const url = isEdit
      ? `https://backendapi.trakky.in/salonvendor/supplier/${formData.id}/` // Edit existing supplier
      : "https://backendapi.trakky.in/salonvendor/supplier/"; // Create new supplier

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const successMessage = isEdit
          ? "Supplier edited successfully!"
          : "Supplier submitted successfully!";
        toast.success(successMessage);

        // Clear the form after successful submission
        setFormData({
          name: "",
          supplier_description: "",
          first_name: "",
          last_name: "",
          mobile_no: "",
          telephone: "",
          email: "",
          website: "",
          address: "",
          state: "",
          city: "",
          pincode: "",
          country: "",
        });

        // Optional: Redirect to supplier list after successful operation
        // navigate('/supplier-list');
      } else {
        const errorData = await response.json();
        toast.error(
          `Error saving supplier: ${errorData.detail || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("An error occurred while saving the supplier");
    }
  };

  useEffect(() => {
    if (supplier) {
      setFormData({
        ...supplier,
      });
    }
  }, [supplier]);

  {
    /* <button className='bg-[red] text-[white] px-[15px] rounded-[10px] py-[8px]' onClick={handleSave}>Save</button> */
  }
  return (
    <>
      <div className="w-full overflow-y-auto">
        <div className="flex justify-around px-5 mt-4 gap-8 max-sm:px-0 max-sm:flex-col max-sm:items-center">
          <div className="w-full max-w-lg space-y-6 px-5 py-5 rounded-lg">
            {/* Distributor Details */}
            <div className="space-y-4 bg-white shadow-sm p-5 rounded-lg">
              <p className="font-semibold text-lg">Distributor Details</p>
              <div className="flex flex-col gap-3">
                <span className="flex flex-col">
                  <p className="font-medium">Distributor Name</p>
                  <TextField
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Distributor Name"
                    variant="outlined"
                    className="w-full"
                    InputProps={{ style: { fontSize: 16 } }}
                  />
                </span>
                <span className="flex flex-col">
                  <p className="font-medium">Distributor Description</p>
                  <TextField
                    name="supplier_description"
                    value={formData.supplier_description}
                    onChange={handleChange}
                    placeholder="Enter Distributor Description"
                    variant="outlined"
                    className="w-full"
                    InputProps={{ style: { fontSize: 16 } }}
                  />
                </span>
              </div>
            </div>

            {/* Physical Address */}
            <div className="space-y-4 bg-white shadow-sm p-5 rounded-lg">
              <p className="font-semibold text-lg">Physical Address</p>
              <div className="flex flex-col gap-3">
                <span className="flex flex-col">
                  <p className="font-medium">Address</p>
                  <TextField
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    multiline
                    rows={2}
                    variant="outlined"
                    className="w-full"
                    InputProps={{ style: { fontSize: 16 } }}
                  />
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <span className="flex flex-col">
                    <p className="font-medium">State</p>
                    <TextField
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter State"
                      variant="outlined"
                      className="w-full"
                      InputProps={{ style: { fontSize: 16 } }}
                    />
                  </span>

                  <span className="flex flex-col">
                    <p className="font-medium">City</p>
                    <TextField
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter City"
                      variant="outlined"
                      className="w-full"
                      InputProps={{ style: { fontSize: 16 } }}
                    />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <span className="flex flex-col">
                    <p className="font-medium">Country</p>
                    <TextField
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter Country"
                      variant="outlined"
                      className="w-full"
                      InputProps={{ style: { fontSize: 16 } }}
                    />
                  </span>

                  <span className="flex flex-col">
                    <p className="font-medium">PinCode</p>
                    <TextField
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter Pincode"
                      variant="outlined"
                      className="w-full"
                      InputProps={{ style: { fontSize: 16 } }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}

          {/* Contact Information */}
          <div className="w-full max-w-lg space-y-6 px-5 py-5 bg-white rounded-lg shadow-md">
            <p className="font-semibold text-lg">Contact Information</p>
            <div className="space-y-4">
              <span className="flex flex-col">
                <p className="font-medium">First Name</p>
                <TextField
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  variant="outlined"
                  className="w-full"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>

              <span className="flex flex-col">
                <p className="font-medium">Last Name</p>
                <TextField
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  variant="outlined"
                  className="w-full"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>

              <span className="flex flex-col">
                <p className="font-medium">Mobile Number</p>
                <TextField
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter Number"
                  variant="outlined"
                  className="w-full"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>

              <span className="flex flex-col">
                <p className="font-medium">Alternate Mobile Number</p>
                <TextField
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter Alternate Number"
                  variant="outlined"
                  className="w-full"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>

              <span className="flex flex-col">
                <p className="font-medium">E-mail</p>
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter Email"
                  variant="outlined"
                  className="w-full"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>

              <span className="flex flex-col">
                <p className="font-medium">Website (Optional)</p>
                <TextField
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  variant="outlined"
                  className="w-full"
                  placeholder="Enter Website (Optional)"
                  InputProps={{ style: { fontSize: 16 } }}
                />
              </span>
            </div>
            <div className="flex justify-center w-full mt-4 max-sm:mt-6">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default AddSupplier;
