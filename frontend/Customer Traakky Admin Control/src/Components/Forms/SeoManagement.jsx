import React from "react";
import "../css/form.css";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthContext";

const SeoManagement = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [pageName, setPageName] = useState("");
  const [existingData, setExistingData] = useState(null);

  const getExistingData = async () => {
    try {
      let url = `https://backendapi.trakky.in/salons/seo/${pageName}/`;
      if (pageName === "") return;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      setExistingData(data);
    } catch (error) {
      console.error("Error fetching existing data:", error.message);
      alert("An error occurred while fetching existing data");
    }
  };

  useEffect(() => {
    getExistingData();
  }, [pageName]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirm = window.confirm("Are you sure you want to update?");
    if (!confirm) return;

    const formData = new FormData();
    formData.append("meta_title", existingData.meta_title);
    formData.append("meta_description", existingData.meta_description);
    formData.append("meta_keywords", existingData.meta_keywords);

    try {
      await fetch(
        `https://backendapi.trakky.in/salons/seo/${pageName}/`,

        {
          method: "PATCH",

          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },

          body: formData,
        }
      ).then((result) => {
        result.json().then((resp) => {
          if (resp.detail === "Authentication credentials were not provided.") {
            alert("You're logged out");

            logoutUser();
          } else {
            setExistingData(resp);
            alert("Updated Successfully");
          }
        });
      });
    } catch (error) {
      alert("Error occured", error);
    }
  };

  return (
    <div className="form-container">
      <form method="post" onSubmit={handleSubmit}>
        <div className="row">
          <h3 className="form-title">SEO Management</h3>
        </div>
        <div className="row">
          <div className="input-box inp-id col-1 col-2">
            <label htmlFor="page-name">Select Page</label>
            <select
              name="page-name"
              id="page-name"
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value);
              }}
              required
            >
              <option value="">Select Page</option>
              <option value="home">Home Page</option>
              <option value="categoryList">Category List Page</option>
              <option value="cityList">City List Page</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="meta-title">Meta Title</label>
            <input
              type="text"
              name="meta-title"
              id="meta-title"
              placeholder="Enter Meta Title"
              required
              value={existingData ? existingData.meta_title : metaTitle}
              onChange={(e) => {
                if (existingData) {
                  setExistingData({
                    ...existingData,
                    meta_title: e.target.value,
                  });
                } else {
                  setMetaTitle(e.target.value);
                }
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="meta-keywords">Meta Keywords</label>
            <input
              type="text"
              name="meta-keywords"
              id="meta-keywords"
              placeholder="Enter Meta Keywords"
              required
              value={existingData ? existingData.meta_keywords : metaKeywords}
              onChange={(e) => {
                if (existingData) {
                  setExistingData({
                    ...existingData,
                    meta_keywords: e.target.value,
                  });
                } else {
                  setMetaKeywords(e.target.value);
                }
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-box inp-name col-1 col-2">
            <label htmlFor="meta-description">Meta Description</label>
            <textarea
              rows={5}
              type="text"
              name="meta-description"
              id="meta-description"
              placeholder="Enter Meta Description"
              required
              value={
                existingData ? existingData.meta_description : metaDescription
              }
              onChange={(e) => {
                if (existingData) {
                  setExistingData({
                    ...existingData,
                    meta_description: e.target.value,
                  });
                } else {
                  setMetaDescription(e.target.value);
                }
              }}
            />
          </div>
        </div>
        <div className="submit-btn row">
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default SeoManagement;
