import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Settings,
  Search,
  Filter,
  Download,
  Mail,
  MessageCircle,
  CheckCircle,
  X,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Eye,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// Mock Data
const MOCK_DATA = {
  success: true,
  vendor: {
    id: 1,
    business_name: "Luxury Salon & Spa",
    email: "contact@luxurysalon.com",
    phone: "+91 9876543210"
  },
  feedback_stats: {
    total_feedbacks: 284,
    average_rating: 4.2,
    satisfaction_rate: 78.5,
    rating_distribution: {
      "5_star": 145,
      "4_star": 78,
      "3_star": 35,
      "2_star": 18,
      "1_star": 8
    }
  },
  complaints: {
    total: 26,
    open: 8,
    in_progress: 12,
    resolved: 6,
    by_category: {
      "Service Quality": 12,
      "Staff Behavior": 6,
      "Waiting Time": 5,
      "Billing Issues": 3
    }
  },
  reward_points: {
    active_reward_customers: 156,
    total_points_issued: 12500,
    points_redeemed: 8900
  },
  recent_feedbacks: [
    {
      id: 1,
      customer_name: "Priya Sharma",
      customer_phone: "+91 9876543210",
      appointment: "APT001",
      appointment_date: "2024-03-15T10:30:00",
      rating: 5,
      feedback: "Excellent service! Really loved the haircut and the staff was very professional.",
      remark: "Very happy customer, will definitely come back",
      tip: 500,
      services: [
        { service_name: "Haircut", final_price: 800 },
        { service_name: "Hair Wash", final_price: 300 }
      ],
      staff_names: ["Raj", "Neha"]
    },
    {
      id: 2,
      customer_name: "Amit Kumar",
      customer_phone: "+91 9876543211",
      appointment: "APT002",
      appointment_date: "2024-03-14T15:45:00",
      rating: 3,
      feedback: "Average experience. The service was okay but waiting time was too long.",
      remark: "Need to improve waiting time management",
      tip: 0,
      services: [
        { service_name: "Manicure", final_price: 600 }
      ],
      staff_names: ["Meera"]
    },
    {
      id: 3,
      customer_name: "Sneha Patel",
      customer_phone: "+91 9876543212",
      appointment: "APT003",
      appointment_date: "2024-03-14T11:15:00",
      rating: 5,
      feedback: "Amazing experience! Best salon in town. The stylist understood exactly what I wanted.",
      remark: "Highly satisfied with the service",
      tip: 300,
      services: [
        { service_name: "Hair Color", final_price: 2500 },
        { service_name: "Hair Cut", final_price: 800 },
        { service_name: "Styling", final_price: 500 }
      ],
      staff_names: ["Raj", "Priya"]
    },
    {
      id: 4,
      customer_name: "Rahul Mehta",
      customer_phone: "+91 9876543213",
      appointment: "APT004",
      appointment_date: "2024-03-13T16:30:00",
      rating: 2,
      feedback: "Disappointed with the service. The stylist was rude and the haircut wasn't good.",
      remark: "Customer complained about staff behavior",
      tip: 0,
      services: [
        { service_name: "Beard Trim", final_price: 200 },
        { service_name: "Haircut", final_price: 500 }
      ],
      staff_names: ["Vikram"]
    },
    {
      id: 5,
      customer_name: "Anjali Desai",
      customer_phone: "+91 9876543214",
      appointment: "APT005",
      appointment_date: "2024-03-13T12:00:00",
      rating: 4,
      feedback: "Good service overall. The facial was very relaxing. Could improve on punctuality.",
      remark: "Satisfied but need to work on timing",
      tip: 200,
      services: [
        { service_name: "Facial", final_price: 1500 },
        { service_name: "Threading", final_price: 100 }
      ],
      staff_names: ["Neha"]
    },
    {
      id: 6,
      customer_name: "Vikram Singh",
      customer_phone: "+91 9876543215",
      appointment: "APT006",
      appointment_date: "2024-03-12T14:00:00",
      rating: 5,
      feedback: "Best massage ever! Very professional staff and clean environment.",
      remark: "Will recommend to friends",
      tip: 400,
      services: [
        { service_name: "Swedish Massage", final_price: 2000 }
      ],
      staff_names: ["Rajesh"]
    },
    {
      id: 7,
      customer_name: "Neha Gupta",
      customer_phone: "+91 9876543216",
      appointment: "APT007",
      appointment_date: "2024-03-12T10:45:00",
      rating: 3,
      feedback: "Okay experience. The pedicure was good but the staff seemed rushed.",
      remark: "Staff needs to be more attentive",
      tip: 100,
      services: [
        { service_name: "Pedicure", final_price: 800 },
        { service_name: "Nail Art", final_price: 400 }
      ],
      staff_names: ["Meera"]
    },
    {
      id: 8,
      customer_name: "Rajesh Khanna",
      customer_phone: "+91 9876543217",
      appointment: "APT008",
      appointment_date: "2024-03-11T17:30:00",
      rating: 4,
      feedback: "Good salon. Reasonable prices and good service.",
      remark: "Regular customer, satisfied",
      tip: 150,
      services: [
        { service_name: "Haircut", final_price: 500 },
        { service_name: "Shave", final_price: 200 }
      ],
      staff_names: ["Vikram"]
    },
    {
      id: 9,
      customer_name: "Pooja Malhotra",
      customer_phone: "+91 9876543218",
      appointment: "APT009",
      appointment_date: "2024-03-11T09:30:00",
      rating: 5,
      feedback: "Absolutely love this place! Great ambiance and skilled staff.",
      remark: "Very happy customer",
      tip: 350,
      services: [
        { service_name: "Bridal Makeup", final_price: 5000 },
        { service_name: "Hair Styling", final_price: 1000 }
      ],
      staff_names: ["Priya", "Neha"]
    },
    {
      id: 10,
      customer_name: "Sunil Verma",
      customer_phone: "+91 9876543219",
      appointment: "APT010",
      appointment_date: "2024-03-10T13:15:00",
      rating: 2,
      feedback: "Not happy with the service. The haircut was not as requested and they charged extra.",
      remark: "Billing issue and poor service",
      tip: 0,
      services: [
        { service_name: "Haircut", final_price: 600 },
        { service_name: "Beard Styling", final_price: 250 }
      ],
      staff_names: ["Raj"]
    }
  ]
};

// Skeleton Components
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

const SkeletonStatCard = () => (
  <div className="animate-pulse bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const SkeletonFeedbackItem = () => (
  <div className="animate-pulse border border-gray-200 rounded-lg p-4">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <div className="flex items-center justify-between mb-3">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
    </div>
  </div>
);

const SkeletonFilterBar = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
        <div className="flex items-center space-x-4 mt-2">
          <div className="h-3 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="h-10 bg-gray-200 rounded w-28"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  </div>
);

const MainDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchMockData = () => {
      setLoading(true);
      setTimeout(() => {
        setApiData(MOCK_DATA);
        setLoading(false);
      }, 1500); // Simulate network delay
    };

    fetchMockData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentFromRating = (rating) => {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  };

  const getSentimentIcon = (rating) => {
    const sentiment = getSentimentFromRating(rating);
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getComplaintStatus = (count) => {
    if (count === 0) return 'resolved';
    if (count > 0 && count <= 5) return 'in-progress';
    return 'pending';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const GetformatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateSatisfactionRate = () => {
    if (!apiData?.feedback_stats?.rating_distribution) return 0;
    
    const { rating_distribution } = apiData.feedback_stats;
    const positive = (rating_distribution["5_star"] || 0) + (rating_distribution["4_star"] || 0);
    const total = apiData.feedback_stats.total_feedbacks || 1;
    
    return Math.round((positive / total) * 100);
  };

  const calculateComplaintRate = () => {
    if (!apiData?.complaints?.total || !apiData?.feedback_stats?.total_feedbacks) return 0;
    
    const totalFeedbacks = apiData.feedback_stats.total_feedbacks || 1;
    const totalComplaints = apiData.complaints.total || 0;
    
    return Math.round((totalComplaints / totalFeedbacks) * 100);
  };

  const calculateNeutralRate = () => {
    if (!apiData?.feedback_stats?.rating_distribution || !apiData?.feedback_stats?.total_feedbacks) return 0;
    
    const total = apiData.feedback_stats.total_feedbacks || 1;
    const neutral = apiData.feedback_stats.rating_distribution["3_star"] || 0;
    
    return Math.round((neutral / total) * 100);
  };

  const filteredFeedback = apiData?.recent_feedbacks?.filter(feedback => {
    if (!feedback) return false;
    
    const matchesSearch = feedback.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        feedback.services?.some(service => 
                          service.service_name?.toLowerCase().includes(searchTerm.toLowerCase())
                        ) ||
                        feedback.staff_names?.some(staff => 
                          staff?.toLowerCase().includes(searchTerm.toLowerCase())
                        );
    
    const matchesRating = ratingFilter === 'all' || 
                        (ratingFilter === 'positive' && feedback.rating >= 4) ||
                        (ratingFilter === 'negative' && feedback.rating <= 2) ||
                        (ratingFilter === 'neutral' && feedback.rating === 3);

    return matchesSearch && matchesRating;
  }) || [];

  const getServiceNames = (services) => {
    return services?.map(service => service.service_name).join(', ') || 'No services';
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div>
        {/* Header Skeleton */}
        <SkeletonHeader />
        
        {/* Filter Bar Skeleton */}
        <SkeletonFilterBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Stats Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Complaints Summary Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
              
              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonStatCard key={i} />
                ))}
              </div>

              {/* Recent Feedback Skeleton */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonFeedbackItem key={i} />
                  ))}
                </div>
              </div>

              {/* Rating Distribution Skeleton */}
              <div className="mb-6">
                <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
                      <div className="flex justify-center space-x-0.5 mt-1">
                        {[...Array(5-i)].map((_, j) => (
                          <div key={j} className="w-3 h-3 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-12 mx-auto mt-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Data</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline-block mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">No data available</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors"
        >
          <RefreshCw className="w-4 h-4 inline-block mr-2" />
          Load Data
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Satisfactions Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Collect, trace, analyze and respond to customers feedback to improve service quality
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>{apiData.vendor?.business_name || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, services, staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              />
            </div>
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
          >
            <option value="all">All Ratings</option>
            <option value="positive">Positive (4-5 Stars)</option>
            <option value="neutral">Neutral (3 Stars)</option>
            <option value="negative">Negative (1-2 Stars)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Feedback</span>
                <span className="font-semibold text-gray-900">
                  {apiData.feedback_stats?.total_feedbacks || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center space-x-1">
                  {renderStars(Math.round(apiData.feedback_stats?.average_rating || 0))}
                  <span className="font-semibold text-gray-900 ml-2">
                    {apiData.feedback_stats?.average_rating?.toFixed(1) || '0.0'}/5
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Satisfaction Rate</span>
                <span className="font-semibold text-green-600">
                  {apiData.feedback_stats?.satisfaction_rate?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open Complaints</span>
                <span className="font-semibold text-red-600">
                  {apiData.complaints?.open || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Reward Customers</span>
                <span className="font-semibold text-[#492DBD]">
                  {apiData.reward_points?.active_reward_customers || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Complaints Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Complaints</span>
                <span className="font-semibold">{apiData.complaints?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open</span>
                <span className="font-semibold text-red-600">{apiData.complaints?.open || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">In Progress</span>
                <span className="font-semibold text-yellow-600">{apiData.complaints?.in_progress || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resolved</span>
                <span className="font-semibold text-green-600">{apiData.complaints?.resolved || 0}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">By Category:</h4>
              <div className="space-y-2">
                {apiData.complaints?.by_category && Object.entries(apiData.complaints.by_category).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-[#492DBD]" />
                <span className="text-gray-700">Send Feedback Request</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#492DBD]" />
                <span className="text-gray-700">Broadcast Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Feedback Dashboard</h3>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-900">
                      {calculateSatisfactionRate()}%
                    </div>
                    <div className="text-green-700 text-sm">Satisfaction Rate</div>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {calculateNeutralRate()}%
                    </div>
                    <div className="text-yellow-700 text-sm">Neutral Feedback</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-900">
                      {calculateComplaintRate()}%
                    </div>
                    <div className="text-red-700 text-sm">Complaints Rate</div>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Rating Distribution</h4>
              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {apiData.feedback_stats?.rating_distribution?.[`${stars}_star`] || 0}
                    </div>
                    <div className="flex justify-center space-x-0.5 mt-1">
                      {renderStars(stars)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stars} Star</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Recent Feedback</h4>
                <span className="text-sm text-gray-500">
                  Showing {filteredFeedback.length} of {apiData.recent_feedbacks?.length || 0}
                </span>
              </div>
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-500">No feedback matches your filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#492DBD] transition-colors cursor-pointer"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#492DBD] rounded-full flex items-center justify-center text-white font-semibold">
                            {feedback.customer_name?.split(' ').map(n => n[0]).join('') || 'C'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{feedback.customer_name || 'Customer'}</div>
                            <div className="text-sm text-gray-500">
                              {getServiceNames(feedback.services)} • {feedback.staff_names?.join(', ') || 'No staff'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(feedback.rating)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.tip > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {feedback.tip > 0 ? `Tip: ₹${feedback.tip}` : 'No Tip'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {renderStars(feedback.rating)}
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {feedback.rating}/5
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {GetformatDate(feedback.appointment_date)}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 text-sm">{feedback.feedback || 'No feedback provided'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#492DBD] rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedFeedback.customer_name?.split(' ').map(n => n[0]).join('') || 'C'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedFeedback.customer_name || 'Customer'}</div>
                    <div className="text-sm text-gray-500">
                      {selectedFeedback.customer_phone} • Appointment #{selectedFeedback.appointment}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {GetformatDate(selectedFeedback.appointment_date)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Services:</span>
                  <div className="mt-1">
                    {selectedFeedback.services?.map((service, index) => (
                      <div key={index} className="text-gray-700">
                        • {service.service_name} - ₹{service.final_price}
                      </div>
                    )) || 'No services'}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Staff:</span>
                  <div className="mt-1">
                    {selectedFeedback.staff_names?.map((staff, index) => (
                      <div key={index} className="text-gray-700">• {staff}</div>
                    )) || 'No staff'}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tip Amount:</span>
                  <span className="ml-2 text-green-600 font-semibold">₹{selectedFeedback.tip || '0.00'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Services:</span>
                  <span className="ml-2 font-semibold">{selectedFeedback.services?.length || 0}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Feedback:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedFeedback.feedback || 'No feedback provided'}
                </p>
              </div>

              {selectedFeedback.remark && selectedFeedback.remark !== selectedFeedback.feedback && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Remark:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedFeedback.remark}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;