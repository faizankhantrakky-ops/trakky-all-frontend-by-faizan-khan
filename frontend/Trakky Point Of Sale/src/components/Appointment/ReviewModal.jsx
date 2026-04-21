import React, { useState, useContext } from "react";
import "./allModal.css";
import { Tooltip } from "@mui/material";
import Rating from "@mui/material/Rating";
import AuthContext from "../../Context/Auth";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import toast from "react-hot-toast";
import ErrorIcon from "@mui/icons-material/Error";
import { ToastContainer } from "react-toastify";

const ReviewModal = ({
  id,
  customer,
  service,
  setIsReviewed,
  setShowReviewModal,
}) => {
  const { authTokens } = useContext(AuthContext);

  const [validation, setValidation] = useState({
    review: false,
    rating: false,
  });
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasError = Object.values(validation).some((v) => v === true);
    if (hasError) {
      return;
    }

    try {
      const response = await fetch(
        "https://backendapi.trakky.in/salonvendor/appointments/remarks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify({
            appointment: id,
            rating: rating,
            remark: review,
            tip: parseInt(tip) || 0,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Review Submitted Successfully");
        setIsReviewed(true);
        setShowReviewModal(false);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="rm-container">
          <h2 className="rm-title">Review & Rating</h2>

          <div className="row">
            <div className="appoint-input-field">
              <Tooltip title="Customer Name" placement="top" arrow>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customer}
                  readOnly
                />
              </Tooltip>
            </div>
          </div>
          <div className="row rm-rating-container">
            <Rating
              name="size-large"
              defaultValue={0}
              emptyIcon={<StarOutlineRoundedIcon sx={{ fontSize: 38 }} />}
              icon={<StarRoundedIcon sx={{ fontSize: 38 }} />}
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
              size="large"
            />
          </div>
          <div className="row">
            <div className="appoint-input-field" id="rm-textarea-container">
              <textarea
                type="text"
                placeholder="Share Your Experience.."
                required
                style={{
                  border: validation.review ? "1.5px solid red" : "",
                }}
                onBlur={() => {
                  if (review === "") {
                    setValidation({ ...validation, review: true });
                  } else {
                    setValidation({ ...validation, review: false });
                  }
                }}
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                }}
              />
              {validation.review && (
                <Tooltip title="Review is Required" placement="top" arrow>
                  <ErrorIcon
                    className="error-icon absolute right-[5px] bottom-[10px]"
                    color="error"
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="row">
            <div className="appoint-input-field">
              <input
                type="number"
                placeholder="Enter Tip Amount"
                value={tip}
                onChange={(e) => {
                  setTip(e.target.value);
                }}
                onWheel={() => document.activeElement.blur()}
                onKeyDownCapture={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
          </div>
          <div className="row" id="rm-btn-container">
            <button className="rm-btn">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ReviewModal;
