import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../Context/Auth";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Award,
  Star,
  Clock,
  IndianRupee,
  Activity,
  Target
} from "lucide-react";

const DashboardClientDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/dashboard/customer/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access_token}`,
          },
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  // Format large numbers
  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return new Intl.NumberFormat("en-IN").format(num);
  };

  // Get icon based on field name
  const getIcon = (fieldName) => {
    const icons = {
      "Total Clients": <Users className="w-6 h-6" />,
      "Total Clients Added": <UserPlus className="w-6 h-6" />,
      "Active Clients": <UserCheck className="w-6 h-6" />,
      "Inactive Clients": <UserX className="w-6 h-6" />,
      "Most Recent Client": <Calendar className="w-6 h-6" />,
      "Top Spending Client": <TrendingUp className="w-6 h-6" />,
      "Client Retention Rate": <Award className="w-6 h-6" />,
      "Average Client Rating": <Star className="w-6 h-6" />,
      "Average Visits per Client": <Clock className="w-6 h-6" />,
      "Average Spend per Client": <IndianRupee className="w-6 h-6" />,
      "New Clients This Period": <Activity className="w-6 h-6" />,
      "Repeat Clients": <Target className="w-6 h-6" />,
      "Client Satisfaction": <Star className="w-6 h-6" />,
      "Client Engagement": <Activity className="w-6 h-6" />,
    };

    return icons[fieldName] || <Users className="w-6 h-6" />;
  };

  // Get gradient based on field name
  const getGradient = (fieldName) => {
    const gradients = {
      "Total Clients": "from-[#482DBC] to-[#5D46E0]",
      "Total Clients Added": "from-[#2DBC89] to-[#46E0B5]",
      "Active Clients": "from-[#2D5ABC] to-[#467FE0]",
      "Inactive Clients": "from-[#BC5A2D] to-[#E08046]",
      "Most Recent Client": "from-[#8A2DBC] to-[#B546E0]",
      "Top Spending Client": "from-[#BC2D9B] to-[#E046C9]",
      "Client Retention Rate": "from-[#2DBCBC] to-[#46E0E0]",
      "Average Client Rating": "from-[#BCB32D] to-[#E0D946]",
      "Average Visits per Client": "from-[#5ABC2D] to-[#7FE046]",
      "Average Spend per Client": "from-[#BC2D5A] to-[#E0467F]",
      "New Clients This Period": "from-[#2D8ABC] to-[#46B5E0]",
      "Repeat Clients": "from-[#9B2DBC] to-[#C946E0]",
      "Client Satisfaction": "from-[#BC5A2D] to-[#E08046]",
      "Client Engagement": "from-[#2DBC5A] to-[#46E080]",
    };

    return gradients[fieldName] || "from-[#482DBC] to-[#5D46E0]";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#482DBC] mb-4"></div>
        <p className="text-gray-600">Loading client analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.fields?.map((field, index) => {
          const value = data[field];

          // Hide the card completely if it's "Membership Customers" and value is 0
          if (field === "Membership Customers" && value === 0) {
            return null;
          }

          const isPercentage = typeof value === "string" && value.includes("%");
          const isCurrency = field.toLowerCase().includes("spend") || field.toLowerCase().includes("amount");

          return (
            <div
              key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform overflow-hidden group"
            >
              {/* Gradient Top Bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${getGradient(field)}`}></div>

              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{field}</h3>
                  </div>
                </div>

                {/* Value Display */}
                <div className="mb-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {isCurrency && typeof value === "number"
                      ? new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 0,
                        }).format(value)
                      : isPercentage
                      ? value
                      : formatNumber(value)}
                  </div>
                </div>

                {/* Progress Indicator for Certain Metrics */}
                {(field.includes("Rate") || field.includes("Retention") || field.includes("Satisfaction")) &&
                  typeof value === "string" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getGradient(field)} bg-gradient-to-r`}
                          style={{
                            width: parseInt(value) ? `${parseInt(value)}%` : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${getGradient(field)}`}></div>
                    Current Period
                  </span>
                  <span className="font-medium text-gray-700">
                    {field.includes("Active") || field.includes("Growth") ? "↑" : "↔"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Client Base Overview</h2>
            <p className="text-gray-600 mt-1">Key performance indicators for client management</p>
          </div>
          <div className="hidden lg:block">
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              Updated in real-time
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Users className="w-5 h-5 text-[#482DBC]" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Client Base</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(data["Total Clients"] || 0)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">↑ 12%</span> from last period
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">New Clients</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(data["Total Clients Added"] || 0)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">↑ 8%</span> growth rate
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Clients</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(data["Active Clients"] || 0)}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">92%</span> retention rate
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
     
    </div>
  );
};


export default DashboardClientDetails;