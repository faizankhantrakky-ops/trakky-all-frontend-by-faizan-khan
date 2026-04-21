import React, { useState, useEffect, useContext } from "react";
import "./RateUs.css";
import StarsIcon from '@mui/icons-material/Stars';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon1 from '@mui/icons-material/Star';
import AuthContext from "../../../context/Auth";

import toast, { Toaster } from "react-hot-toast";

const RateUs = () => {
  const { user, authTokens} = useContext(AuthContext);

  const [rating, setRating] = useState(0); // State to store the rating
  const [hoveredStar, setHoveredStar] = useState(0); // State to store the hovered star

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex); // Update the hovered star state
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex); // Save the rating when a star is clicked
  };

  const handleStarSubmit = async () => {
    let url = `https://backendapi.trakky.in/spas/ratings/`;
    console.log("Rating:", rating);
    console.log("token:", authTokens.access_token);
    console.log("User ID:", user?.user_id);


    if (rating > 0 || rating <= 5) {
      let payload = {
        rating: rating,
        spa_user: user?.user_id,
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Rating Submitted Successfully");
        setRating(0);
      } else {
        toast.error("Rating Submission Failed");
      }
    } else {
      toast.error("Rating Should Be Between 1 and 5");
    }
  }

  return (
    <div className='PPRateus'>
      <div className='PPRateUsOuterBox'>
        <div className='PPRateUS'>
          <StarsIcon className='StarRatePP' />
          <h1>Feel Free To Rate</h1>
          <h1>Tell Us About Your Experience</h1>
          <div className="starsPP">
            {[...Array(5)].map((_, index) => (
              <StarIcon1
                key={index}
                className={index < rating || index < hoveredStar ? 'rateStarsPP filled' : 'rateStarsPP'}
                onMouseEnter={() => handleStarHover(index + 1)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleStarClick(index + 1)}
              />
            ))}
          </div>
          <div className="btnrateUs" onClick={handleStarSubmit}>
            Submit
          </div>
        </div>
        <div className='TrakkyLovePP'>Trakky Loves You ❤️</div>
      </div>
    </div>
  );
};

export default RateUs;
