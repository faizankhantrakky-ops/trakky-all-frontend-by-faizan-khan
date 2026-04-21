import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "./BlogCard";
import AuthContext from "../Context/AuthContext";
import PublishIcon from "@mui/icons-material/Publish";
import toast, { Toaster } from "react-hot-toast";
import "./css/salonelist.css";
import { formatDate } from "./DateRange/formatDate";
import DateRange from "./DateRange/DateRange";
import GeneralModal from "./generalModal/GeneralModal";

const BlogList = () => {
  const { authTokens } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [showDateSelectionModal, setShowDateSelectionModal] = useState(false);

  const location = useLocation();
  const dateState2 = location.state && location.state.dateState;
  const currentDate = new Date();
  let initialDateState;

  if (dateState2 === null) {
    initialDateState = [
      {
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      },
    ];
  } else {
    initialDateState = [
      {
        startDate: dateState2[0].startDate,
        endDate: dateState2[0].endDate,
        key: "selection",
      },
    ];
  }

  const [dateState, setDateState] = useState(initialDateState);

  const handleViewAll = () => {
    fetchBlogs(false);
  };

  const fetchBlogs = async (date) => {
    let url;
    const [{ startDate, endDate }] = dateState;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    toast.loading("Fetching Services...", {
      duration: 4000,
      position: "top-center",
    });
    if (date) {
      url = `https://backendapi.trakky.in/salons/blogs/?end_date=${formattedEndDate}&start_date=${formattedStartDate}`;
    } else {
      url = `https://backendapi.trakky.in/salons/blogs/`;
    }
    try {
      const res = await fetch(url);
      toast.dismiss();
      if (res.status === 200) {
        const data = await res.json();
        setBlogs(data.payload);
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      toast.dismiss();
      console.error("Network error:", error.message);
      toast.error("Failed to fetch blogs. Please try again later.", {
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
  useEffect(() => {
    fetchBlogs(true);
  }, [dateState]);

  const handlePublish = async () => {
    try {
      const res = await fetch(
        `https://backendapi.trakky.in/salons/trigger-jenkins-build/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success(data.status, {
          duration: 4000,
          position: "top-center",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Network error:", error.message);
      toast.error("Failed to trigger Jenkins build. Please try again later.", {
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
      <div className="w-[100%] h-[100%]">
        <div className="publish-btn-blog">
          <div className="custom-main-date-range">
            <div
              className="custom-Date-Range-Button"
              onClick={() => {
                setShowDateSelectionModal(true);
              }}
            >
              <input
                type="text"
                value={`${dateState[0].startDate.getDate()}-${dateState[0].startDate.getMonth() + 1
                  }-${dateState[0].startDate.getFullYear()}`}
                style={{
                  paddingLeft: "5px",
                }}
                readOnly
              />
              <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>
                {" "}
                ~{" "}
              </span>
              <input
                type="text"
                value={`${dateState[0]?.endDate?.getDate()}-${dateState[0]?.endDate?.getMonth() + 1
                  }-${dateState[0]?.endDate?.getFullYear()}`}
                readOnly
              />
            </div>
          </div>
          <div onClick={handleViewAll}>
            <button type="submit" style={{ width: "100px" }}>
              <div> View all </div>
            </button>
          </div>
          <button
            onClick={() => {
              handlePublish();
            }}
          >
            <PublishIcon />
            <div>Publish Site</div>
          </button>
        </div>
        <div className="blog-list">
          {blogs.length > 0 &&
            blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
        <div className="blog-list">
          {blogs.length === 0 && (
            <p>
              No blogs were found for the given date range. Please click on
              'View All' or try changing the date range.
            </p>
          )}
        </div>
      </div>
      <GeneralModal
        open={showDateSelectionModal}
        handleClose={() => setShowDateSelectionModal(false)}
      >
        <DateRange
          dateState={dateState}
          setDateState={setDateState}
          setShowDateSelectionModal={setShowDateSelectionModal}
        />
      </GeneralModal>
    </>
  );
};

export default BlogList;
