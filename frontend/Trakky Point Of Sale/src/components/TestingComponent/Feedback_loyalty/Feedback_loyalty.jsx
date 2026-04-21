import React, { useState, useEffect } from 'react';
import {
  Star,
  Eye,
  CheckCircle,
  Share2,
  MessageSquare,
  X,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  MoreVertical,
  User,
  Calendar,
  Phone,
  Tag
} from 'lucide-react';

// Skeleton Components
const SkeletonFeedbackItem = () => (
  <div className="animate-pulse p-4 md:p-6 border-b border-gray-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex space-x-0.5 md:space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 md:h-6 bg-gray-200 rounded w-16 md:w-20"></div>
      </div>
      <div className="h-3 md:h-4 bg-gray-200 rounded w-20 md:w-24"></div>
    </div>
    
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
      <div>
        <div className="h-4 md:h-5 bg-gray-200 rounded w-24 md:w-32 mb-1 md:mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-32 md:w-48"></div>
      </div>
      <div className="text-right">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20 mb-1 md:mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-12 md:w-16"></div>
      </div>
    </div>

    <div className="space-y-1 md:space-y-2 mb-3">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
    </div>
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
      <div className="flex space-x-1 md:space-x-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-4 md:h-6 bg-gray-200 rounded w-12 md:w-16"></div>
        ))}
      </div>
      <div className="flex space-x-1 md:space-x-2 self-end">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-4 h-4 md:w-6 md:h-6 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonFilterBar = () => (
  <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <div className="flex-1">
        <div className="h-9 md:h-10 bg-gray-200 rounded"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-9 md:h-10 bg-gray-200 rounded w-full md:w-32"></div>
      ))}
    </div>
  </div>
);

const Feedback_loyalty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const mockData = {
    success: true,
    feedbacks: [
      {
        id: 1,
        rating: 5,
        date: '2024-03-10T11:30:00Z',
        customer_name: 'Rajesh Kumar',
        customer_phone: '9876512345',
        feedback: 'Absolutely amazing service! The stylist Raj was very professional and gave me the perfect haircut. The salon atmosphere is very relaxing. Will definitely visit again!',
        service_names: ['Premium Haircut', 'Head Massage', 'Beard Styling'],
        salon_name: 'Royal Salon & Spa'
      },
      {
        id: 2,
        rating: 4,
        date: '2024-03-09T15:45:00Z',
        customer_name: 'Sunita Sharma',
        customer_phone: '9988771122',
        feedback: 'Good experience overall. The facial was refreshing and staff was courteous. Slight delay in service but quality was good.',
        service_names: ['Gold Facial', 'Manicure'],
        salon_name: 'Glow Beauty Lounge'
      },
      {
        id: 3,
        rating: 3,
        date: '2024-03-09T10:15:00Z',
        customer_name: 'Deepak Verma',
        customer_phone: '9765412345',
        feedback: 'Average service. The massage was okay but the room was too cold. Staff was polite though.',
        service_names: ['Swedish Massage', 'Steam Bath'],
        salon_name: 'Wellness Spa'
      },
      {
        id: 4,
        rating: 2,
        date: '2024-03-08T14:20:00Z',
        customer_name: 'Kavita Reddy',
        customer_phone: '9345678901',
        feedback: 'Disappointed with the nail art. The design was not as shown in the catalogue. Had to wait 30 minutes after appointment time.',
        service_names: ['Nail Art', 'Pedicure'],
        salon_name: 'Style Studio'
      },
      {
        id: 5,
        rating: 5,
        date: '2024-03-08T09:00:00Z',
        customer_name: 'Anil Joshi',
        customer_phone: '9456781234',
        feedback: 'Best salon in town! Very hygienic and professional. The staff uses premium products. Highly recommended for hair treatments.',
        service_names: ['Hair Spa', 'Hair Cut', 'Facial'],
        salon_name: 'Royal Salon & Spa'
      },
      {
        id: 6,
        rating: 1,
        date: '2024-03-07T16:30:00Z',
        customer_name: 'Meera Nair',
        customer_phone: '8899776655',
        feedback: 'Very poor experience. The waxing was painful and left redness. Staff was rushing through the service. Not coming back.',
        service_names: ['Waxing'],
        salon_name: 'Glow Beauty Lounge'
      },
      {
        id: 7,
        rating: 4,
        date: '2024-03-07T12:45:00Z',
        customer_name: 'Prakash Singh',
        customer_phone: '9988332211',
        feedback: 'Great haircut and shave. The barber understood exactly what I wanted. Reasonable prices. Will come again.',
        service_names: ['Haircut', 'Royal Shave'],
        salon_name: 'Style Studio'
      },
      {
        id: 8,
        rating: 5,
        date: '2024-03-06T13:15:00Z',
        customer_name: 'Neha Gupta',
        customer_phone: '9012345678',
        feedback: 'Excellent bridal makeup! The makeup artist Priya did a fantastic job. Everyone complimented my look at the wedding. Worth every rupee.',
        service_names: ['Bridal Makeup', 'Hair Styling', 'Draping'],
        salon_name: 'Glamour World'
      },
      {
        id: 9,
        rating: 3,
        date: '2024-03-06T10:30:00Z',
        customer_name: 'Rohan Desai',
        customer_phone: '8877665544',
        feedback: 'Decent experience. The massage was good but the therapist was talking on phone during service. Need more professionalism.',
        service_names: ['Aroma Massage'],
        salon_name: 'Wellness Spa'
      },
      {
        id: 10,
        rating: 4,
        date: '2024-03-05T17:00:00Z',
        customer_name: 'Anita Menon',
        customer_phone: '9654321098',
        feedback: 'Good service overall. The staff was friendly and the salon was clean. Would recommend to friends.',
        service_names: ['Manicure', 'Pedicure', 'Threading'],
        salon_name: 'Glow Beauty Lounge'
      }
    ],
    count: 10
  };

  useEffect(() => {
    fetchFeedbackData();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiData(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching feedback data:', err);
    } finally {
      setLoading(false);
    }
  };

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
      case 'positive': return <ThumbsUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />;
      case 'negative': return <ThumbsDown className="w-3 h-3 md:w-4 md:h-4 text-red-500" />;
      default: return <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />;
    }
  };

  const getStatusFromRating = (rating) => {
    if (rating >= 4) return 'resolved';
    if (rating === 3) return 'in-progress';
    return 'pending';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 md:w-4 md:h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString || 'Invalid date';
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Remove any non-digit characters and format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
  };

  // Get services text from service_names array
  const getServiceText = (serviceNames) => {
    if (!serviceNames || serviceNames.length === 0) return 'No services';
    
    // Remove duplicates
    const uniqueServices = [...new Set(serviceNames)];
    
    if (uniqueServices.length === 1) {
      return uniqueServices[0];
    } else if (uniqueServices.length <= 2) {
      return uniqueServices.join(', ');
    } else {
      return `${uniqueServices.slice(0, 2).join(', ')} +${uniqueServices.length - 2} more`;
    }
  };

  // Filter feedback data
  const filteredFeedback = apiData?.feedbacks?.filter(feedback => {
    if (!feedback) return false;
    
    // Search filter
    const matchesSearch = 
      feedback.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customer_phone?.includes(searchTerm) ||
      feedback.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.service_names?.some(service => 
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false;

    // Rating filter
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'positive' && feedback.rating >= 4) ||
                         (ratingFilter === 'negative' && feedback.rating <= 2) ||
                         (ratingFilter === 'neutral' && feedback.rating === 3);

    // Date filter (basic implementation)
    const matchesDate = dateFilter === 'all' || true; // You can implement actual date filtering here

    return matchesSearch && matchesRating && matchesDate;
  }) || [];

  // Loading state
  if (loading) {
    return (
      <div>
        <SkeletonFilterBar />
        
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4 md:mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-5 md:h-7 bg-gray-200 rounded w-32 md:w-40"></div>
              <div className="h-4 md:h-5 bg-gray-200 rounded w-24 md:w-32"></div>
            </div>
          </div>
          <div>
            {[...Array(4)].map((_, i) => (
              <SkeletonFeedbackItem key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
        <div className="flex items-start md:items-center space-x-3">
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm md:text-base font-semibold text-red-800">Error Loading Feedback Data</h3>
            <p className="text-xs md:text-sm text-red-600 mt-1">{error}</p>
            <button 
              onClick={fetchFeedbackData}
              className="mt-3 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!apiData || !apiData.feedbacks || apiData.feedbacks.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No Feedback Available</h3>
        <p className="text-sm md:text-gray-600 mb-4 md:mb-6">No customer feedback has been submitted yet.</p>
        <button 
          onClick={fetchFeedbackData}
          className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors flex items-center mx-auto"
        >
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Feedback-specific filters - Responsive */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        {/* Mobile Search Row */}
        {isMobile && (
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              />
            </div>
          </div>
        )}

        {/* Desktop Search Row */}
        {!isMobile && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers, services, feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                />
              </div>
            </div>
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] min-w-[120px]"
            >
              <option value="all">All Ratings</option>
              <option value="positive">Positive (4-5)</option>
              <option value="neutral">Neutral (3)</option>
              <option value="negative">Negative (1-2)</option>
            </select>
           
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] min-w-[120px]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <button 
              onClick={fetchFeedbackData}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        )}

        {/* Mobile Filter Row */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={fetchFeedbackData}
              className="flex-1 px-3 py-1.5 text-xs bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199]"
            >
              Refresh
            </button>
            <button className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Export
            </button>
          </div>
        )}

        {/* Mobile Filter Dropdown */}
        {isMobile && showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-bold">Rating</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="all">All Ratings</option>
                  <option value="positive">Positive (4-5)</option>
                  <option value="neutral">Neutral (3)</option>
                  <option value="negative">Negative (1-2)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">All Customer Feedback</h3>
            <div className="text-sm text-gray-600">
              Showing {filteredFeedback.length} of {apiData.count || 0} feedbacks
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredFeedback.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">No matching feedback found</h4>
              <p className="text-sm md:text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredFeedback.map((feedback) => {
              const status = getStatusFromRating(feedback.rating);
              const sentiment = getSentimentFromRating(feedback.rating);
              
              return (
                <div
                  key={feedback.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 md:mb-3 gap-2">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="flex items-center space-x-0.5 md:space-x-1">
                        {renderStars(feedback.rating)}
                        <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-gray-700">
                          {feedback.rating}/5
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2">
                        {getSentimentIcon(feedback.rating)}
                        <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {isMobile ? status.charAt(0).toUpperCase() : status}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 self-end md:self-auto">{formatDate(feedback.date)}</div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 md:mb-3 gap-2">
                    <div>
                      <div className="font-medium text-sm md:text-base text-gray-900">{feedback.customer_name || 'Customer'}</div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {getServiceText(feedback.service_names)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs md:text-sm text-gray-600">{feedback.salon_name}</div>
                      <div className="text-xs md:text-sm text-gray-500">
                        {formatPhoneNumber(feedback.customer_phone)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">{feedback.feedback || 'No feedback provided'}</p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {/* Service tags */}
                      {feedback.service_names && [...new Set(feedback.service_names)].slice(0, 2).map((service, index) => (
                        <span 
                          key={index} 
                          className="px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                        >
                          {isMobile && service.length > 8 ? `${service.substring(0, 8)}...` : service}
                        </span>
                      ))}
                      {/* Sentiment tag */}
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${
                        sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isMobile ? sentiment.charAt(0).toUpperCase() : sentiment}
                      </span>
                      {/* Show more indicator */}
                      {feedback.service_names && feedback.service_names.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{feedback.service_names.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1 md:space-x-2 self-end md:self-auto">
                      <button 
                        className="p-1 text-gray-400 hover:text-[#492DBD]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedback(feedback);
                        }}
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Mark as read functionality
                        }}
                      >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Feedback Detail Modal - Responsive */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-lg w-full max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#492DBD] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                    {selectedFeedback.customer_name?.split(' ').map(n => n[0]).join('') || 'C'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm md:text-base text-gray-900">{selectedFeedback.customer_name || 'Customer'}</div>
                    <div className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {formatPhoneNumber(selectedFeedback.customer_phone)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-0.5 md:space-x-1 justify-end">
                    {renderStars(selectedFeedback.rating)}
                    <span className="ml-1 md:ml-2 font-medium text-gray-700 text-sm md:text-base">
                      {selectedFeedback.rating}/5
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedFeedback.date)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Salon:</span>
                  <span className="text-gray-600">{selectedFeedback.salon_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Rating:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getSentimentFromRating(selectedFeedback.rating) === 'positive' ? 'bg-green-100 text-green-800' :
                    getSentimentFromRating(selectedFeedback.rating) === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getSentimentFromRating(selectedFeedback.rating)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Services:</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 md:gap-2">
                    {selectedFeedback.service_names && [...new Set(selectedFeedback.service_names)].map((service, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 md:px-3 md:py-1 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-1 md:mb-2 text-sm md:text-base">Feedback:</h4>
                <p className="text-sm md:text-base text-gray-700 bg-gray-50 p-2 md:p-3 rounded-lg">
                  {selectedFeedback.feedback || 'No feedback provided'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 md:pt-4 border-t border-gray-200">
                <button className="flex-1 bg-[#492DBD] text-white py-2 px-3 md:py-2.5 md:px-4 rounded-lg hover:bg-[#3a2199] transition-colors text-sm md:text-base flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Mark as Resolved
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 md:py-2.5 md:px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base flex items-center justify-center gap-2">
                  <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback_loyalty;