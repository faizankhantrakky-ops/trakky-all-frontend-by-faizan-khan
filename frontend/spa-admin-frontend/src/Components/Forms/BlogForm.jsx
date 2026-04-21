import React from "react";
import "../css/form.css";

const AddBlogs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="form-container">
      <form method="post">
        <div className="row">
          <h3 className="form-title">Add Blog</h3>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter Name"
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="input-box inp-aboutus col-1 col-2">
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              id="content"
              cols="30"
              rows="3"
              placeholder="Enter Content"
              required
            ></textarea>
          </div>
        </div>
        <div className="submit-btn row">
          <button type="submit" onSubmit={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogs;
