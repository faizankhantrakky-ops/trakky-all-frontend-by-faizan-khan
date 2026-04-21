import React, { useContext } from "react";
import crossIcon from "../../../Assets/images/icons/crossIcon_svg.svg";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import camera_Icon from "../../../Assets/images/icons/camera_icon.svg";
import AuthContext from "../../../context/Auth";
import toast, { Toaster } from "react-hot-toast";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#512DC8",
  },
  "& .MuiRating-iconHover": {
    color: "#512DC8",
  },
});

const ReviewPostModal = ({
  onClose,
  spa,
  setUserNameChangeModal,
  getReviews,
}) => {
  const { authTokens, user, userData } = useContext(AuthContext);

  const [ratingCount, setRatingCount] = useState({
    hygiene: 3,
    valueForMoney: 3,
    behaviour: 3,
    staff: 3,
    massageTherapy: 3,
  });

  const [review, setReview] = useState("");
  const [images, setImages] = useState(null);

  const handleSubmitReview = async () => {
    if (!authTokens || !user) {
      toast.error("Please login to submit review");
      return;
    }

    if (user?.user_id && userData) {
      if (!userData?.name) {
        setUserNameChangeModal(true);
        return;
      }
    }

    if (!userData?.name) {
      toast.error("Please Submit your name to submit review");
      return;
    }

    let url = `https://backendapi.trakky.in/spas/review/`;

    let formData = new FormData();
    formData.append("spa", spa.id);
    formData.append("hygiene", ratingCount.hygiene || 0);
    formData.append("value_for_money", ratingCount.valueForMoney || 0);
    formData.append("behavior", ratingCount.behaviour || 0);
    formData.append("staff", ratingCount.staff || 0);
    formData.append("massage_therapy", ratingCount.massageTherapy || 0);

    formData.append("review", review);
    // multiple images upto 3
    if (images && images.length > 0) {
      for (let i = 0; i < images?.length; i++) {
        formData.append("uploaded_images", images[i]);
      }
    }

    try {
      let res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Review submitted successfully");
        if (spa?.id) {
          getReviews(spa?.id);
        }
        onClose();
      } else {
        toast.error("Failed to submit review : ", res.statusText);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review : ", error);
    }
  };

  return (
    <div
      className={` m-auto max-h-[90vh] overflow-y-scroll h-fit py-3 px-4 relative top-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white ${
        window.innerWidth > 400 ? "rounded-lg" : ""
      }`}
    >
      <Toaster />
      <div className=" flex justify-between gap-1 items-center">
        <h2 className=" text-xl font-semibold line-clamp-1">{spa?.name}</h2>
        <button onClick={onClose} className=" h-5 w-5">
          <img
            src={crossIcon}
            alt="crossIcon"
            className=" h-5 aspect-square object-cover brightness-50"
          />
        </button>
      </div>
      <div className=" flex gap-3 justify-start items-center pt-5">
        <div className=" flex flex-col gap-1 items-start justify-center  grow-0">
          <div className=" h-10 flex items-center leading-5 font-medium">
            Value for money
          </div>
          <div className=" h-10 flex items-center leading-5 font-medium">
            Hyegine
          </div>
          <div className=" h-10 flex items-center leading-5 font-medium">
            Behaviour
          </div>
          <div className=" h-10 flex items-center leading-5 font-medium">
            Staff
          </div>
          <div className=" h-10 flex items-center leading-5 font-medium">
            Massage Therapy
          </div>
        </div>
        <div className="  flex flex-col gap-1 items-start justify-center grow">
          <div className=" h-10 w-full">
            <StyledRating
              name="simple-controlled"
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              min={1}
              value={ratingCount.hygiene}
              onChange={(event, newValue) => {
                setRatingCount({ ...ratingCount, hygiene: newValue });
              }}
              size="large"
            />
          </div>
          <div className=" h-10 w-full">
            <StyledRating
              name="simple-controlled"
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              value={ratingCount.valueForMoney}
              onChange={(event, newValue) => {
                setRatingCount({ ...ratingCount, valueForMoney: newValue });
              }}
              size="large"
            />
          </div>
          <div className=" h-10 w-full">
            <StyledRating
              name="simple-controlled"
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              value={ratingCount.behaviour}
              onChange={(event, newValue) => {
                setRatingCount({ ...ratingCount, behaviour: newValue });
              }}
              size="large"
            />
          </div>
          <div className=" h-10 w-full">
            <StyledRating
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              name="simple-controlled "
              value={ratingCount.staff}
              onChange={(event, newValue) => {
                setRatingCount({ ...ratingCount, staff: newValue });
              }}
              size="large"
            />
          </div>
          <div className=" h-10 w-full">
            <StyledRating
              sx={{
                width: "100%",
                height: "100%",
                fontSize: "2rem",
              }}
              name="simple-controlled"
              value={ratingCount.massageTherapy}
              onChange={(event, newValue) => {
                setRatingCount({ ...ratingCount, massageTherapy: newValue });
              }}
              size="large"
            />
          </div>
        </div>
      </div>
      <div className=" mt-4 flex w-full justify-center items-center">
        <textarea
          name=""
          id=""
          className=" bg-slate-50 py-2 px-3 h-32 rounded-lg text-slate-800 !outline-none  border border-slate-100"
          placeholder="Tell us about it..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
      </div>
      <label
        htmlFor="image-vd"
        className=" mt-4 gap-6 h-12 flex w-full justify-center items-center rounded-lg bg-slate-50 border border-slate-100"
      >
        <img src={camera_Icon} alt="camera" className=" h-5 w-5" />
        <span className=" text-xs !text-slate-500 font-medium">
          Add photos and Videos{" "}
          {images && images.length > 0 ? `(${images.length} selected)` : ""}
        </span>
        <input
          type="file"
          name="image-vd"
          id="image-vd"
          className=" hidden"
          multiple
          onChange={(e) => {
            // if user selects more than 3 images, only first 3 images will be selected
            if (e.target.files.length > 3) {
              let temp = [];
              for (let i = 0; i < 3; i++) {
                temp.push(e.target.files[i]);
              }
              setImages(temp);
            } else {
              // setImages(e.target.files)
              let temp = [];
              for (let i = 0; i < e.target.files.length; i++) {
                temp.push(e.target.files[i]);
              }
              setImages(temp);
            }
          }}
        />
      </label>
      <button
        className=" bg-gradient-to-r from-[#9E70FF] to-[#512DC8] text-white text-center text-lg font-medium rounded-xl w-full py-2 px-4 mt-4"
        onClick={handleSubmitReview}
      >
        Submit review
      </button>
    </div>
  );
};

export default ReviewPostModal;
