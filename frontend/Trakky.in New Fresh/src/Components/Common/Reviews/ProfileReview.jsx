import React, { useEffect, useState, useCallback } from "react";
import "./profilereview.css";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
// import penSvg from "../../../Assets/images/icons/writeicon.svg"

const ProfileReview = ({
  data,
  averageRating,
  totalReviews,
  openReviewModal,
}) => {
  const [visibleReviews, setVisibleReviews] = useState(4);

  const [expandedReviews, setExpandedReviews] = useState([]);

  const handleExpandReview = useCallback((index) => {
    setExpandedReviews((prevExpandedReviews) => [
      ...prevExpandedReviews,
      index,
    ]);
  }, []);

  const handleCollapseReview = useCallback((index) => {
    setExpandedReviews((prevExpandedReviews) =>
      prevExpandedReviews.filter((i) => i !== index)
    );
  }, []);

  function isReviewExpanded(index) {
    return expandedReviews.includes(index);
  }

  function getReviewContent(review) {
   
    if (review.length > 100) {
      return (
        <>
          {review.slice(0, 100)}
          <span>...</span>
        </>
      );
    } else {
      return review;
    }
  }

 
  useEffect(() => {
    if (window.innerWidth < 540) {
      setVisibleReviews(3);
    } else if (window.innerWidth > 540 && window.innerWidth < 1024) {
      setVisibleReviews(4);
    } else if (window.innerWidth > 1024) {
      // setVisibleReviews(6);
      setVisibleReviews(8);
    }
  }, []);

  const formatDate = (dateString) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString)
    const year = date?.getFullYear();
    const month = months[date?.getMonth()];
  
    return `${month} ${year}`;
  };

  return (
    <>
      <div className="pr-container">
        <div className="pr-header">
          <div className="pr-average-rating">
            <StarRoundedIcon className="pr-star" style={{ color: "#DE3151" }} />
            <div className="pr-rating">
              {averageRating ? averageRating : "NA"}
            </div>
          </div>
          <span className="pr-dot">.</span>
          <div className="pr-total-reviews">
            {totalReviews ? totalReviews + " Reviews" : "NA"}
          </div>
          {/* <h3>Reviews</h3>
          <button 
          onClick={()=>{
            openReviewModal()
          }}>
            <img src={penSvg} alt="pen" />
            Write a Review</button> */}
        </div>
        <div className="pr-body">
          {data?.slice(0, visibleReviews).map((review, index) => {
            return (
              <div className="pr-review" key={index}>
                <div className="pr-review-header">
                  <div className="pr-reviewer-name">{review?.username}</div>
                  <div className="pr-reviewe-date">{formatDate(review?.created_at)}</div>
                </div>
                <div className="pr-review-body">
                  {getReviewContent(review?.review)}
                </div>
              </div>
            );
          })}
        </div>
        {totalReviews > visibleReviews && (
          <div className="pr-footer show-all-reviews">
            <button onClick={openReviewModal}>See All Reviews</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileReview;
