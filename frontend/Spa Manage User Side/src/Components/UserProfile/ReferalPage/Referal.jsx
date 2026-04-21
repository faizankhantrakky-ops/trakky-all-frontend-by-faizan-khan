import React, { useContext } from "react";
import "./ReferalPage.css";
import TrakkyBox from "../trakky-box.png";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AuthContext from "../../../context/Auth";

const ReferralPage = () => {
  const { user, authTokens, userData, fetchUserData } = useContext(AuthContext);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userData?.referral_code);
    toast.success("Referral code copied to clipboard!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    alert("Referral code copied to clipboard!");
  };

  const referralCodeSection = (
    <div className="referral-code-section" onClick={handleCopyCode}>
      <div className="code-section">
        <p>Copy Your Code</p>
        <span className="code"> {userData?.referral_code} </span>
      </div>
      <span className="copy-icon">
        <ContentCopyIcon fontSize="large" />
      </span>
    </div>
  );

  return (
    <div className="referral-container">
      <h1>Referral</h1>
      <div className="referral-details">
        <div className="count-earnings">
          <div className="referral-count">
            <p className="number">{userData?.referrals_made?.length || 0}</p>
            <p>Referrals</p>
          </div>
          <div className="referral-earnings">
            <p className="number">{userData?.coin_wallet?.coin_balance || 0}</p>
            <p>Coins earned</p>
          </div>
        </div>
        {window.innerWidth > 768 ? referralCodeSection : null}
      </div>
      <p style={{ color: "#838383" }}>Refer a friend and get rewards</p>
      <img src={TrakkyBox} alt="" />
      <div className="referral-share">
        {window.innerWidth <= 768 ? referralCodeSection : null}
        <button
          className="share-friends"
          onClick={() => {
            let message = `Hey! I am using Trakky and I think you should too. Use my referral code ${userData?.referral_code} to get started and earn coins. Visit https://spa.trakky.in/ to avail the offer.`;

            if (!navigator.share) {
              document.execCommand("copy", true, message);
              alert("Message copied to clipboard");
              return;
            }

            navigator
              .share({
                title: "Trakky",
                text: message,
                url: "https://spa.trakky.in/",
              })
              .catch((error) => console.log("Error sharing", error));
          }}
        >
          Invite Friends
        </button>
      </div>

      <div className=" flex flex-col gap-3 px-5 w-full ">
        <h2 className=" font-semibold text-lg my-2">Referral history</h2>
        <div className=" w-full grid-cols-1 grid gap-3">
          {userData?.referrals_made?.map((referral) => (
            <div className="w-full bg-gray-100 rounded-md p-4">
              <div className="flex flex-col gap-2">
                <div>
                  <p className=" font-semibold">
                    <span className="text-gray-400">Referred user:</span>{" "}
                    {referral.referred_user_phone}
                  </p>
                </div>

                <div>
                  <p className=" font-semibold">
                    <span className="text-gray-400">Coins assigned:</span>{" "}
                    {referral.coins_assigned}
                  </p>
                </div>

                <div>
                  <p className=" font-semibold">
                    <span className="text-gray-400">Date:</span>{" "}
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
