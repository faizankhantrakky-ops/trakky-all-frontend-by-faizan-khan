import React, { useState, useEffect, useContext } from "react";
import { Image as ImageIcon, Plus, Calendar } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "../../Context/Auth";
import { Link } from "react-router-dom";

const DailyUpdates = () => {
  const { authTokens, vendorData } = useContext(AuthContext);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDailyUpdates();
  }, []);

  const getDailyUpdates = async () => {
    if (!navigator.onLine) {
              toast.error("No Internet Connection");
              return;
            }
            
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/salons/daily-updates-pos/?status=approved`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUpdates(data.results || []);
      } else if (response.status === 401) {
        toast.error("Unauthorized: Please check your authentication token.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                 
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Daily Updates
                  </h1>
                </div>
                <p className="text-gray-600">
                  View and manage your daily salon updates and announcements
                </p>
              </div>
              <Link
                to="/ProfilePreview/salon-profile-preview-page"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors duration-200 font-medium text-sm group"
              >
                <Plus className="w-4 h-4" />
                Add Daily Update
              </Link>
            </div>
          </div>

          {/* Updates Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading daily updates...</p>
              </div>
            </div>
          ) : updates && updates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updates.map((update, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image Section */}
                  <div className="relative aspect-square bg-gray-100">
                    {update.daily_update_img ? (
                      <img
                        src={update.daily_update_img}
                        alt={update.daily_update_description || "Daily update"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x400";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Daily Update #{index + 1}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {update.daily_update_description || "No description available"}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Approved
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {update.id || `#${index + 1}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Daily Updates Found
                </h3>
                <p className="text-gray-600 mb-8">
                  You haven't added any daily updates yet. Start sharing your salon's daily activities and announcements.
                </p>
                <Link
                  to="/ProfilePreview/salon-profile-preview-page"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors duration-200 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Update
                </Link>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {updates.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-semibold text-xl">
                      {updates.length}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Updates</p>
                    <p className="text-lg font-semibold text-gray-900">
                      All Approved Posts
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      All Active
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                    <ImageIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Media</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {updates.filter(u => u.daily_update_img).length} with Images
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Panel */}
          {updates.length > 0 && (
            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 text-indigo-600 mt-0.5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-900 mb-1">
                    About Daily Updates
                  </h4>
                  <p className="text-indigo-800 text-sm">
                    Daily updates help showcase your salon's activities, special offers, and events to potential customers. 
                    Keep your updates fresh and engaging to attract more clients.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DailyUpdates;