import "./Reviews.css";
import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import AuthContext from "../../../context/Auth";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import SigninForms from "../Header/signupsigninforms/SigninForms";
import Signup from "../Navbar/SignUp2/Signup";

function Reviews({ spadata, data, setAverageRating, setTotalReviews , reloadData , averageRating , totalReviews}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const { user, authTokens } = React.useContext(AuthContext);
  const [openRate, setOpenRate] = useState(false);
  const [ratingVal, setRatingVal] = useState(0);
  // const [reviewsdata, setReviewsdata] = useState([]);
  const [username, setUsername] = useState("");
  const [spaoverallreview, setSpaoverallreview] = useState(0);

  const get_user_data = async () => {
    if (user) {
      const response = await fetch(
        `https://backendapi.trakky.in/spas/spauser/${user.user_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      const data = await response.json();
      setUsername(data.username);
    }
  };
  React.useEffect(() => {
    get_user_data();
  }, [user]);

 

  const handleOpen = () => setOpenRate(true);
  const handleClose = () => setOpenRate(false);

  const reviewsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://backendapi.trakky.in/spas/review/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access_token}`,
      },
      body: JSON.stringify({
        spa: spadata?.id,
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
      <Modal
        open={open}
        onClose={handleSignInClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={signInFormStyle}>
          {/* <SigninForms fun={handleSignInClose} /> */}
          <Signup fun={handleSignInClose} />
        </Box>
      </Modal>
      <div className="rating-container">
        <div className="spa-rating-heading">
          <div className="spa-name">{spadata?.name}</div>
          <div className="spa-rating-btn">
            <button
              onClick={() => (user ? setOpenRate(true) : handleSignInOpen())}
            >
              Give Rating
            </button>
          </div>
        </div>
        <div className="spa-address">{spadata?.address}</div>
        <div className="overall-spa-rating">
          <span className="rating-number">
            {
              averageRating
            }
          </span>
          <span className="rating-star">
            <Rating
              name="read-only"
              value={
               averageRating
              }
              readOnly
              precision={0.5}
            />
          </span>
          <span className="total-review">{totalReviews} reviews</span>
        </div>
        <div className="spa-rating-list">
          { data?.map((item, i) => (
            <div className="spa-rating-list-item">
              <div className="rating-user-info">
                <div className="user-avtar">
                  <Avatar style={{ backgroundColor: "blue" }}>G</Avatar>
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
          <h2 className="rating-modal-heading">{spadata?.name}</h2>
          <form
            onSubmit={reviewsubmit}
            method="POST"
            action=" "
            className="rating-container-model"
          >
            <div className="user-information">
              <Avatar style={{ backgroundColor: "blue" }}></Avatar>
              <span style={{ paddingLeft: "15px", color: "black" }}>
                {username}
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
