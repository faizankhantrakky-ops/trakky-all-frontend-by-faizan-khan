import React, { useContext } from "react";
import TrakkyBox from "../trakky-box.png";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HistoryIcon from "@mui/icons-material/History";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AuthContext from "../../../context/Auth";

const ReferralPage = () => {
  const { userData } = useContext(AuthContext);

  const handleCopyCode = () => {
    navigator?.clipboard?.writeText(userData?.referral_code);
    toast.success("Referral code copied!");
  };

  const handleShare = async () => {
    const message = `Join me on Trakky! Use my referral code: ${userData?.referral_code}. Visit: https://trakky.in/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trakky Referral",
          text: message,
        });
      } catch (error) {
        navigator?.clipboard?.writeText(message);
        toast.success("Message copied!");
      }
    } else {
      navigator?.clipboard?.writeText(message);
      toast.success("Message copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:px-4 px-2">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className=" mb-12">
          <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-3 ">Referral Program</h1>
          <div className="w-20 h-1 bg-[#502DA6] mb-4"></div>
          <p className="text-gray-600 max-w-md ">
            Invite friends to join Trakky and earn rewards together
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Left Column - Referral Actions */}
          <div className="lg:w-2/5 space-y-3">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg border border-gray-200 p-5 text-center shadow-sm">
                <div className="w-12 h-12 bg-[#502DA6] rounded-full flex items-center justify-center mx-auto mb-3">
                  <PeopleIcon className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{userData?.referrals_made?.length || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Total Referrals</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5 text-center shadow-sm">
                <div className="w-12 h-12 bg-[#502DA6] rounded-full flex items-center justify-center mx-auto mb-3">
                  <AccountBalanceWalletIcon className="text-white" />
                </div>
                {/* <div className="text-2xl font-bold text-gray-900 mb-1">{userData?.coin_wallet?.coin_balance || 0}</div> */}
                <div className="text-2xl font-bold text-gray-900 mb-1">{200}</div>
                <div className="text-sm text-gray-600 font-medium">Coins Earned</div>
              </div>
            </div>

            {/* Referral Code Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-center mb-5">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Your Referral Code</h3>
                <p className="text-gray-600 text-sm">Share this unique code with your friends</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
                <p className="text-2xl font-bold text-[#502DA6] text-center font-mono tracking-wider">
                  {userData?.referral_code}
                </p>
              </div>
              
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-3 bg-[#502DA6] text-white py-3.5 rounded-lg hover:bg-[#41248C] transition-colors font-medium"
              >
                <ContentCopyIcon style={{ fontSize: 20 }} />
                Copy Referral Code
              </button>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-center mb-5">
                <img 
                  src={TrakkyBox} 
                  alt="Refer and earn" 
                  className="w-28 mx-auto mb-4"
                />
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Invite Friends</h3>
                <p className="text-gray-600 text-sm">Share via message or social media</p>
              </div>
              
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#502DA6] text-[#502DA6] py-3.5 rounded-lg hover:bg-[#502DA6] hover:text-white transition-all font-medium"
              >
                <ShareIcon style={{ fontSize: 20 }} />
                Share Invitation
              </button>
            </div>

          </div>

          {/* Right Column - History */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#502DA6] rounded-lg flex items-center justify-center">
                    <HistoryIcon className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Referral History</h2>
                    <p className="text-sm text-gray-600">Track your referral activity</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {userData?.referrals_made?.length > 0 ? (
                  userData.referrals_made.map((referral) => (
                    <div key={referral.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#502DA6] bg-opacity-10 rounded-full flex items-center justify-center">
                            <PersonAddIcon className="text-[#502DA6]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              +{referral.referred_user_phone}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <CalendarTodayIcon className="text-gray-400" style={{ fontSize: 16 }} />
                              <p className="text-sm text-gray-500">
                                {new Date(referral.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#502DA6] text-lg">
                            +{referral.coins_assigned}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">COINS EARNED</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HistoryIcon className="text-gray-400" style={{ fontSize: 32 }} />
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">No referral history</p>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                      Your referral activity will appear here once you start inviting friends
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReferralPage;