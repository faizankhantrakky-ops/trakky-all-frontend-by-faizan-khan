import React, { useContext } from "react";
import "../input.css";
import { HiOutlineShare } from "react-icons/hi2";
import { AiFillDelete } from "react-icons/ai";
import AuthContext from "../Context/AuthContext";
import GeneralModal from "./generalModal/GeneralModal";
import BlogForm from "./Forms/BlogForm";
import toast, { Toaster } from "react-hot-toast";
import "./css/salonelist.css";

const BlogCard = ({ blog }) => {
  const { authTokens } = useContext(AuthContext);

  const [showModal, setShowModal] = React.useState(false);
  const [blogModalData, setBlogModalData] = React.useState(null);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://backendapi.trakky.in/salons/blogs/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + `${authTokens.access}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        toast.success("Deleted Successfully", {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        window.location.reload();
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to delete. Please try again later.", {
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

  return (
    <>
      <Toaster />
      <div className="blog-card-container">
        <div className="blog-card-image">
          <img src={blog.image_blog.url} alt="" />
        </div>
        <div className="blog-card-title">
          <p>{blog.title}</p>
        </div>
        <div className="blog-card-description">
          <p>{blog.meta_description}</p>
        </div>
        <div className="blog-card-date-author">
          <p>{blog.date}</p>
          <span></span>
          <p>{blog.author}</p>
          <span></span>
          <p>{blog.read_time + " min read"}</p>
        </div>
        <div className="blog-card-other-details">
          <ul>
            <li>
              <span>Category : </span>{" "}
              {blog.categories_names.map((item) => item + ", ")}
            </li>
            <li>
              <span>City : </span> {blog.city}
            </li>
            <li>
              <span>Meta Title : </span> {blog.meta_title}
            </li>
            <li>
              <span>Meta Keywords : </span> {blog.meta_keywords}
            </li>
          </ul>
        </div>
        <div className="blog-card-edit-delete-btn">
          <button
            onClick={() => {
              setBlogModalData(blog);
              setShowModal(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => handleDelete(blog?.id)}>Delete</button>
        </div>

        <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
          <BlogForm blogData={blog} closeModal={() => setShowModal(false)} />
        </GeneralModal>
      </div>
    </>
  );
};

export default BlogCard;
