import "./Reviews.css";
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import AuthContext from "../../../context/Auth";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import SigninForms from "../../Common/Header/signupsigninforms/SigninForms";

function Reviews({
  salondata,
  data,
  setAverageRating,
  setTotalReviews,
  reloadData,
  averageRating,
  totalReviews,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const { user, authTokens, userData } = React.useContext(AuthContext);
  const [openRate, setOpenRate] = useState(false);
  const [ratingVal, setRatingVal] = useState(0);
  // const [reviewsdata, setReviewsdata] = useState([]);

  const handleOpen = () => setOpenRate(true);
  const handleClose = () => setOpenRate(false);

  const reviewsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://backendapi.trakky.in/salons/review/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
      body: JSON.stringify({
        salon: salondata?.id,
        rating: e.target.rating.value,
        review: e.target.review.value,
      }),
    });
    const data = await res.json();

    if (res.status === 201) {
      handleClose();
      reloadData();
    } else {
      alert("error while sending your review please try again");
      return;
    }
  };

  // React.useEffect(() => {
  //   setTotalReviews(reviewsdata?.length);
  //   setAverageRating(
  //     parseFloat(salonoverallreview / reviewsdata?.length).toFixed(1)
  //   );
  // }, [salonoverallreview]);

  // Sign In Forms

  const [open, setOpen] = React.useState(false);
  const handleSignInOpen = () => setOpen(true);
  const handleSignInClose = () => setOpen(false);

  const signInFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      {/* Sign In Forms */}
      <Modal
        open={open}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          zIndex: 999999,
        }}
      >
        <Box sx={signInFormStyle}>
          <SigninForms fun={handleSignInClose} />
        </Box>
      </Modal>

      <div className="rating-container">
        <div className="salon-rating-heading">
          <div className="salon-name">{salondata?.name}</div>
          <div className="salon-rating-btn">
            <button
              onClick={() => (user ? setOpenRate(true) : handleSignInOpen())}
            >
              Give Rating
            </button>
          </div>
        </div>
        <div className="salon-address">{salondata?.address}</div>
        <div className="overall-salon-rating">
          <span className="rating-number">
            {
              // salondata?.avg_rating.toFixed(1)
              averageRating
            }
          </span>
          <span className="rating-star">
            <Rating
              name="read-only"
              value={averageRating}
              readOnly
              precision={0.5}
            />
          </span>
          <span className="total-review">{totalReviews} reviews</span>
        </div>
        <div className="salon-rating-list">
          {data?.map((item, i) => (
            <div className="salon-rating-list-item">
              <div className="rating-user-info">
                <div className="user-avtar">
                  <Avatar style={{ backgroundColor: "blue" }}>
                    {item?.username[0]}
                  </Avatar>
                </div>
                <div className="user-name-n-rate">
                  <div className="username">{item.username}</div>
                  <div className="user-rating">
                    <Rating
                      name="read-only"
                      value={item.rating}
                      readOnly
                      precision={0.5}
                    />
                  </div>
                </div>
              </div>
              <div className="user-rating-disc">{item.review}</div>
            </div>
          ))}
        </div>
      </div>

      {/* model */}
      <Modal
        open={openRate}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="model-box">
          <h2 className="rating-modal-heading">{salondata?.name}</h2>
          <form
            onSubmit={reviewsubmit}
            method="POST"
            action=" "
            className="rating-container-model"
          >
            <div className="user-information">
              <Avatar style={{ backgroundColor: "blue" }}></Avatar>
              <span style={{ paddingLeft: "15px", color: "black" }}>
                {userData?.name || "Anonymous"}
              </span>
            </div>
            <div className="user-rating">
              <Rating
                name="rating"
                value={ratingVal}
                onChange={(event, newValue) => {
                  setRatingVal(newValue);
                }}
                defaultValue={2.5}
                precision={0.5}
                size="large"
              />
            </div>
            <div className="user-rating-disc">
              <textarea
                name="review"
                placeholder="Write your review here..."
              ></textarea>
              <span>Posting Publicly</span>
            </div>
            <div className="user-submit-rating-btn">
              <button
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </button>
              <button type="submit">Post Review!</button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default Reviews;
