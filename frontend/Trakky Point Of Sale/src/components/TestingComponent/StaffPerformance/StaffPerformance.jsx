import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Star,
  Users,
  MoreVertical,
  X,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Menu,
  Eye,
  BarChart3,
  Calendar,
  ExternalLink
} from 'lucide-react';

// Skeleton Components
const SkeletonStaffCard = () => (
  <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-14"></div>
      </div>
    </div>
  </div>
);

const SkeletonStaffRow = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-3 md:py-4 md:px-4">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32 mb-1 md:mb-2"></div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-16 md:w-24"></div>
        </div>
      </div>
    </td>
    <td className="py-3 px-3 md:py-4 md:px-4">
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="flex space-x-0.5 md:space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-6 md:w-8"></div>
      </div>
    </td>
    <td className="py-3 px-3 md:py-4 md:px-4">
      <div className="space-y-1">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-12 md:w-16"></div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className="h-2 md:h-3 bg-gray-200 rounded w-8 md:w-12"></div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-8 md:w-12"></div>
        </div>
      </div>
    </td>
    <td className="py-3 px-3 md:py-4 md:px-4">
      <div className="flex items-center space-x-1 md:space-x-2">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-10 md:w-12"></div>
      </div>
    </td>
    <td className="py-3 px-3 md:py-4 md:px-4 hidden md:table-cell">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20"></div>
    </td>
    <td className="py-3 px-3 md:py-4 md:px-4 hidden md:table-cell">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-6"></div>
    </td>
  </tr>
);

const StaffPerformance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [performancePeriod, setPerformancePeriod] = useState('monthly');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const mockData = {
    success: true,
    staff_performance: [
      {
        staff_member: 'Rajesh Kumar',
        staff_role: 'Senior Hair Stylist',
        rating: 4.9,
        feedback: { total: 78, positive: 76, negative: 2 },
        performance: '+18%'
      },
      {
        staff_member: 'Sunita Sharma',
        staff_role: 'Bridal Makeup Artist',
        rating: 4.8,
        feedback: { total: 92, positive: 88, negative: 4 },
        performance: '+25%'
      },
      {
        staff_member: 'Deepak Verma',
        staff_role: 'Massage Therapist',
        rating: 4.7,
        feedback: { total: 56, positive: 52, negative: 4 },
        performance: '+12%'
      },
      {
        staff_member: 'Pooja Singh',
        staff_role: 'Nail Art Specialist',
        rating: 4.6,
        feedback: { total: 45, positive: 41, negative: 4 },
        performance: '+8%'
      },
      {
        staff_member: 'Vikram Rathore',
        staff_role: 'Barber',
        rating: 4.5,
        feedback: { total: 67, positive: 60, negative: 7 },
        performance: '+5%'
      },
      {
        staff_member: 'Neha Gupta',
        staff_role: 'Facial Specialist',
        rating: 4.4,
        feedback: { total: 53, positive: 46, negative: 7 },
        performance: '+3%'
      },
      {
        staff_member: 'Arjun Reddy',
        staff_role: 'Color Expert',
        rating: 4.3,
        feedback: { total: 49, positive: 42, negative: 7 },
        performance: '+2%'
      },
      {
        staff_member: 'Kavita Joshi',
        staff_role: 'Senior Stylist',
        rating: 4.2,
        feedback: { total: 84, positive: 70, negative: 14 },
        performance: '0%'
      },
      {
        staff_member: 'Manoj Tiwari',
        staff_role: 'Hair Stylist',
        rating: 4.1,
        feedback: { total: 38, positive: 31, negative: 7 },
        performance: '-2%'
      },
      {
        staff_member: 'Ritu Patel',
        staff_role: 'Waxing Specialist',
        rating: 4.0,
        feedback: { total: 42, positive: 33, negative: 9 },
        performance: '-3%'
      },
      {
        staff_member: 'Sachin More',
        staff_role: 'Spa Therapist',
        rating: 3.9,
        feedback: { total: 29, positive: 22, negative: 7 },
        performance: '-5%'
      },
      {
        staff_member: 'Anjali Deshmukh',
        staff_role: 'Beautician',
        rating: 3.8,
        feedback: { total: 34, positive: 25, negative: 9 },
        performance: '-6%'
      }
    ],
    staff_count: 12
  };

  useEffect(() => {
    fetchStaffPerformanceData();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchStaffPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiData(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching staff Performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceTrend = (performance) => {
    if (!performance) return 'neutral';
    const value = parseFloat(performance.replace('%', '').replace('+', ''));
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  const getPerformanceTrendIcon = (performance) => {
    const trend = getPerformanceTrend(performance);
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-600" />;
      default: return <Activity className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />;
    }
  };

  const renderStars = (rating) => {
    if (!rating) rating = 0;
    const roundedRating = Math.round(rating * 10) / 10;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(roundedRating) ? 'text-yellow-400 fill-current' :
            i === Math.floor(roundedRating) && roundedRating % 1 > 0.5 ? 'text-yellow-400 fill-current' :
              'text-gray-300'
          }`}
      />
    ));
  };

  const getColorForName = (name) => {
    if (!name) return 'bg-gray-500';
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-green-500',
      'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-amber-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getEfficiency = (feedback) => {
    if (!feedback || !feedback.total || feedback.total === 0) return 0;
    return Math.round((feedback.positive / feedback.total) * 100);
  };

  const filteredStaff = apiData?.staff_performance?.filter(staff =>
    staff?.staff_member?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff?.staff_role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Filter Skeleton */}
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

        {/* Header Skeleton */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 mb-4 md:mb-6">
            <div>
              <div className="h-6 md:h-8 bg-gray-200 rounded w-48 md:w-64 mb-2"></div>
              <div className="h-3 md:h-4 bg-gray-200 rounded w-64 md:w-96"></div>
            </div>
            <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32"></div>
          </div>

          {/* Mobile Card Skeleton */}
          {isMobile ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonStaffCard key={i} />
              ))}
            </div>
          ) : (
            /* Desktop Table Skeleton */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[...Array(6)].map((_, i) => (
                      <th key={i} className="py-2 md:py-3 px-3 md:px-4">
                        <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-24"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonStaffRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
            <h3 className="text-sm md:text-base font-semibold text-red-800">Error Loading Staff Performance Data</h3>
            <p className="text-xs md:text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchStaffPerformanceData}
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
  if (!apiData || !apiData.staff_performance || apiData.staff_performance.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No Staff Performance Data</h3>
        <p className="text-sm md:text-gray-600 mb-4 md:mb-6">No staff performance data is available.</p>
        <button
          onClick={fetchStaffPerformanceData}
          className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors flex items-center mx-auto"
        >
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Staff-specific filters - Responsive */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        {/* Mobile Search Row */}
        {isMobile && (
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
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
                  placeholder="Search staff by name or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={performancePeriod}
              onChange={(e) => setPerformancePeriod(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] min-w-[120px]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>

            <button
              onClick={fetchStaffPerformanceData}
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
              onClick={fetchStaffPerformanceData}
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={performancePeriod}
                  onChange={(e) => setPerformancePeriod(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Header */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 mb-4 md:mb-6">
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900">Staff Performance</h3>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Track and analyze staff performance metrics</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 text-sm text-gray-600">
            <span>{filteredStaff.length} of {apiData.staff_count || 0} staff</span>
            <select
              value={performancePeriod}
              onChange={(e) => setPerformancePeriod(e.target.value)}
              className="px-2 py-1 text-xs md:px-3 md:py-2 md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-base font-semibold text-gray-900 mb-2">No matching staff found</h4>
                <p className="text-sm text-gray-600">Try adjusting your search</p>
              </div>
            ) : (
              filteredStaff.slice(0, 6).map((staff) => {
                const efficiency = getEfficiency(staff.feedback);
                const trend = getPerformanceTrend(staff.performance);

                return (
                  <div
                    key={staff.staff_member}
                    className="border border-gray-200 rounded-lg p-3 hover:border-[#492DBD] transition-colors cursor-pointer"
                    onClick={() => setSelectedStaff(staff)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorForName(staff.staff_member)}`}>
                          <span className="text-white font-semibold text-sm">
                            {staff.staff_member?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{staff.staff_member}</div>
                          <div className="text-xs text-gray-500">{staff.staff_role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{staff.rating?.toFixed(1) || '0.0'}</div>
                        <div className="flex items-center space-x-0.5">
                          {renderStars(staff.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-600">Feedback</div>
                        <div className="font-semibold text-gray-900">
                          {staff.feedback?.total || 0} total
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-600">{staff.feedback?.positive || 0} pos</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-red-600">{staff.feedback?.negative || 0} neg</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Performance</div>
                        <div className="flex items-center gap-1">
                          {getPerformanceTrendIcon(staff.performance)}
                          <span className={`font-medium ${trend === 'up' ? 'text-green-600' :
                              trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                            {staff.performance || '0%'}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {staff.staff_role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {filteredStaff.length > 6 && (
              <div className="text-center text-sm text-gray-600 py-2">
                + {filteredStaff.length - 6} more staff members
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Staff Member</th>
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Rating</th>
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Feedback</th>
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Performance</th>
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Role</th>
                  <th className="py-2 md:py-3 px-3 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 md:py-12 text-center">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">No matching staff found</h4>
                      <p className="text-sm text-gray-600">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => {
                    const efficiency = getEfficiency(staff.feedback);
                    const trend = getPerformanceTrend(staff.performance);

                    return (
                      <tr
                        key={staff.staff_member}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${getColorForName(staff.staff_member)}`}>
                              <span className="text-white font-semibold text-xs md:text-sm">
                                {staff.staff_member?.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">{staff.staff_member}</div>
                              <div className="text-xs text-gray-500">{staff.staff_role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <div className="flex items-center space-x-0.5 md:space-x-1">
                              {renderStars(staff.rating)}
                            </div>
                            <span className="font-semibold text-sm text-gray-900">{staff.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 font-medium">
                              {staff.feedback?.total || 0} total
                            </div>
                            <div className="flex items-center space-x-1 md:space-x-2 text-xs">
                              <span className="text-green-600">
                                {staff.feedback?.positive || 0} positive
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-red-600">
                                {staff.feedback?.negative || 0} negative
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            {getPerformanceTrendIcon(staff.performance)}
                            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' :
                                trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                              {staff.performance || '0%'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                          <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium inline-block">
                            {staff.staff_role}
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                          <button
                            className="p-1 md:p-2 text-gray-400 hover:text-[#492DBD] hover:bg-gray-100 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStaff(staff);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Staff Detail Modal - Responsive */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl w-full max-w-full md:max-w-4xl max-h-[90vh] md:max-h-[95vh] overflow-y-auto">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Staff Details</h3>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {/* Staff Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${getColorForName(selectedStaff.staff_member)}`}>
                      <span className="text-white font-bold text-base md:text-xl">
                        {selectedStaff.staff_member?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-2xl font-bold text-gray-900">{selectedStaff.staff_member}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-2 py-1 text-xs md:text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                          {selectedStaff.staff_role}
                        </span>
                        <span className="px-2 py-1 text-xs md:text-sm bg-purple-100 text-purple-800 rounded-full font-medium">
                          Staff Member
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">{selectedStaff.rating?.toFixed(1) || '0.0'}</div>
                    <div className="flex items-center justify-center sm:justify-end space-x-0.5 md:space-x-1 mt-1">
                      {renderStars(selectedStaff.rating)}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-gray-600">Total Feedback</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                      {selectedStaff.feedback?.total || 0}
                    </div>
                    <div className="text-xs md:text-sm text-green-600 mt-1">
                      <span className="font-semibold">{selectedStaff.feedback?.positive || 0}</span> Positive
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-gray-600">Efficiency</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                      {getEfficiency(selectedStaff.feedback)}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      Based on feedback
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-gray-600">Rating</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                      {selectedStaff.rating?.toFixed(1) || '0.0'}/5
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      Average rating
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-gray-600">Performance</div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900 mt-1">
                      {selectedStaff.performance || '0%'}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1 flex items-center space-x-1">
                      {getPerformanceTrendIcon(selectedStaff.performance)}
                      <span>Trend</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Breakdown */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Feedback Breakdown</h5>
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="text-xs md:text-sm text-gray-600">Positive Feedback</span>
                      <span className="font-semibold text-green-600 text-xs md:text-sm">
                        {selectedStaff.feedback?.positive || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 mb-3 md:mb-4">
                      <div
                        className="bg-green-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${selectedStaff.feedback?.total ? ((selectedStaff.feedback.positive / selectedStaff.feedback.total) * 100) : 0}%`
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <span className="text-xs md:text-sm text-gray-600">Negative Feedback</span>
                      <span className="font-semibold text-red-600 text-xs md:text-sm">
                        {selectedStaff.feedback?.negative || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                      <div
                        className="bg-red-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${selectedStaff.feedback?.total ? ((selectedStaff.feedback.negative / selectedStaff.feedback.total) * 100) : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Performance Summary</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs md:text-sm text-blue-600">Role</div>
                          <div className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                            {selectedStaff.staff_role}
                          </div>
                        </div>
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs md:text-sm text-green-600">Rating</div>
                          <div className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                            {selectedStaff.rating?.toFixed(1) || '0.0'}/5
                          </div>
                        </div>
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 md:p-4 ${getPerformanceTrend(selectedStaff.performance) === 'up' ? 'bg-green-50' :
                        getPerformanceTrend(selectedStaff.performance) === 'down' ? 'bg-red-50' : 'bg-yellow-50'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-xs md:text-sm ${getPerformanceTrend(selectedStaff.performance) === 'up' ? 'text-green-600' :
                              getPerformanceTrend(selectedStaff.performance) === 'down' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                            Performance Trend
                          </div>
                          <div className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                            {selectedStaff.performance || '0%'}
                          </div>
                        </div>
                        {getPerformanceTrendIcon(selectedStaff.performance)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 md:pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#492DBD] text-white py-2 md:py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors text-sm md:text-base flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </button>
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 md:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPerformance;