import React, { useState, useEffect, useContext } from "react";
import StarsIcon from "@mui/icons-material/Stars";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon1 from "@mui/icons-material/Star";
import AuthContext from "../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";

const RateUs = () => {
  const { user, authTokens, userData, fetchUserData } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarHover = (starIndex) => {
    setHoveredStar(starIndex);
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarSubmit = async () => {
    let url = `https://backendapi.trakky.in/salons/ratings/`;
    console.log("Rating:", rating);

    if (rating > 0 || rating <= 5) {
      let payload = {
        rating: rating,
        salon_user: user?.user_id,
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
  };

  return (
    <>
      <div className="w-full flex   ">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Left Section - Rating Card */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 ">
                Feel Free To Rate
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Tell Us About Your Experience
              </p>
            </div>

            {/* Stars Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                  onMouseEnter={() => handleStarHover(index + 1)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => handleStarClick(index + 1)}
                >
                  <StarIcon1
                    className={`w-24 h-24 ${
                      index < rating || index < hoveredStar
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    } transition-colors duration-200 `}
                  />
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleStarSubmit}
              className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Submit Rating
            </button>
          </div>

          {/* Right Section - Brand Message */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-700 to-indigo-800 p-8 lg:p-12 flex flex-col items-center justify-center text-center text-white">
            <div className="space-y-6">
              <div className="mb-8">
                <StarsIcon className="w-20 h-20 text-yellow-300 mb-4 opacity-90" />
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 ">
                  Your Opinion Matters
                </h2>
                <p className="text-lg text-purple-100 opacity-90 leading-relaxed">
                  Help us improve our services by sharing your valuable feedback. 
                  We're committed to providing you with the best experience possible.
                </p>
              </div>
              
              <div className="border-t border-purple-400 pt-6">
                <p className="text-2xl font-light italic text-yellow-200 ">
                  Trakky Loves You ❤️
                </p>
                <p className="text-sm text-purple-200 mt-2">
                  Thank you for being part of our journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RateUs;