import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Feedback submitted successfully!");

    // Reset the form
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="mt-2 max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Header */}
      <div className="w-full flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-black p-3 rounded shadow-sm">
          Feedback
        </h1>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Row: Name and Phone in a single row on larger screens */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <TextField
              label="Phone no."
              variant="outlined"
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Second Row: Email */}
        <div className="w-full">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Message Field */}
        <div className="w-full">
          <TextField
            label="Message..."
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            variant="contained"
            className="w-full md:w-1/3"
            style={{
              background:
                "linear-gradient(90deg, #9E70FF 0%, #9E70FF 0.01%, #522EC9 100%)",
            }}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
