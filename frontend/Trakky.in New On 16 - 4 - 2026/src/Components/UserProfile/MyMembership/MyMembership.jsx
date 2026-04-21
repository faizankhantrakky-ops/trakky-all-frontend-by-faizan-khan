import React, { useState } from "react";
import {
  CardMembership,
  CheckCircle,
  AccessTime,
  LocationOn,
  Spa,
  CalendarToday,
  Star,
  EmojiEvents,
} from "@mui/icons-material";

const MyMembership = () => {
  const [activeTab, setActiveTab] = useState("active");

  const activeMembership = {
    name: "Elite Annual Pass",
    salon: "Luxe Signature Salon",
    validity: "Valid until 31 Mar 2026",
    benefits: [
      "12 Premium Haircuts",
      "6 Facial Treatments",
      "Unlimited Styling",
      "Priority Booking",
      "25% Discount on Products",
      "Free Consultation"
    ],
    price: "₹12,999",
    status: "Active",
    joinedDate: "15 Mar 2024"
  };

  const usedMemberships = [
     {
      id: 3,
      name: "Spa Day Pass",
      salon: "Serene Spa & Wellness",
      usedOn: "20 Aug 2024",
      service: "Full Body Massage",
      value: "₹4,999"
    },
    {
      id: 1,
      name: "Glow Facial Package",
      salon: "Luxe Signature Salon",
      usedOn: "15 Oct 2024",
      service: "HydraFacial + Cleanup",
      value: "₹3,499"
    },
   
   
     {
      id: 2,
      name: "Hair Color Voucher",
      salon: "City Trends Salon",
      usedOn: "02 Sep 2024",
      service: "Global Hair Color",
      value: "₹2,199"
    },
  ];

  return (
    <div className="bg-gray-50 py-8 md:px-4 px-2">
      <div className="">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-3 ">My Memberships</h1>
          <div className="w-20 h-1 bg-[#502DA6] mb-4"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-md">
            Manage your salon memberships and track your benefits
          </p>
        </div>

        {/* Classic Tabs */}
        <div className="flex border-b border-gray-300 mb-8 bg-white rounded-t-lg">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium relative flex-1 justify-center ${
              activeTab === "active"
                ? "text-[#502DA6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CardMembership className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Active Membership</span>
            <span className="sm:hidden">Active</span>
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#502DA6]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("used")}
            className={`flex items-center gap-2 px-4 md:px-8 py-3 md:py-4 text-xs md:text-sm font-medium relative flex-1 justify-center ${
              activeTab === "used"
                ? "text-[#502DA6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Membership History</span>
            <span className="sm:hidden">History</span>
            {activeTab === "used" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#502DA6]"></span>
            )}
          </button>
        </div>

        {/* Active Membership Card */}
        {activeTab === "active" && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#502DA6] to-[#6B46C1] text-white p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <EmojiEvents className="text-yellow-300 w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                      PREMIUM
                    </span>
                  </div>
                  <h2 className="text-lg md:text-2xl font-bold mb-1">{activeMembership.name}</h2>
                  <p className="text-purple-100 text-sm">{activeMembership.salon}</p>
                </div>
                <div className="text-right">
                  <div className="bg-green-500 text-white text-xs px-2 md:px-3 py-1 rounded-full font-medium mb-2">
                    {activeMembership.status}
                  </div>
                  <p className="text-xs md:text-sm text-purple-100">Member since {activeMembership.joinedDate}</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-6">
              {/* Validity */}
              <div className="flex items-center gap-3 mb-4 md:mb-6 p-3 bg-blue-50 rounded-lg">
                <AccessTime className="text-[#502DA6] w-4 h-4 md:w-5 md:h-5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">{activeMembership.validity}</p>
                  <p className="text-xs md:text-sm text-gray-600">Membership period</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Star className="text-[#502DA6] w-4 h-4 md:w-5 md:h-5" />
                  Membership Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {activeMembership.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 md:gap-3 p-1 md:p-2 hover:bg-gray-50 rounded">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#502DA6] rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-4 md:pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Value</p>
                  <p className="text-xl md:text-2xl font-bold text-[#502DA6]">{activeMembership.price}</p>
                </div>
                <button className="bg-[#502DA6] text-white px-4 md:px-6 py-2 rounded-lg hover:bg-[#41248C] transition-colors font-medium text-sm md:text-base w-full md:w-auto">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Used Memberships */}
        {activeTab === "used" && (
          <div className="space-y-4">
            {usedMemberships.length > 0 ? (
              usedMemberships.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0 md:mb-4">
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                        <LocationOn className="w-3 h-3 md:w-4 md:h-4" />
                        {item.salon}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 md:px-3 py-1 rounded-full font-medium mb-1 md:mb-2">
                        Used
                      </span>
                      <p className="text-sm font-semibold text-[#502DA6]">{item.value}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarToday className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span><strong className="text-xs md:text-sm">Used on:</strong> {item.usedOn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Spa className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span><strong className="text-xs md:text-sm">Service:</strong> {item.service}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 md:py-16 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-gray-500 mb-2">No Membership History</h3>
                <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto">
                  Your used memberships and packages will appear here once you start using them
                </p>
              </div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 md:mt-8 bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CardMembership className="text-[#502DA6] w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-2">About Your Membership</h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                Your membership provides exclusive access to premium services and benefits. 
                All services must be used within the validity period. For any queries regarding 
                your membership benefits, please contact our customer support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMembership;