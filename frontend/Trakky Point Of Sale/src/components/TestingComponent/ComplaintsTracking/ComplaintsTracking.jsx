import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  XCircle,
  X,
  Plus,
  BarChart2,
  MessageSquare,
  Calendar,
  User,
  Shield,
  Bell,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

// Skeleton Components
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-6">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-48"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-12"></div>
    </td>
    <td className="py-4 px-6">
      <div className="flex space-x-2">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const ComplaintsTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockData = [
    {
      id: 1,
      complaint_id: "CMP-101",
      customer: "Rajesh Kumar",
      subject: "Hair Color Damage",
      issue_type: "service_quality",
      priority: "high",
      assigned_to: "Priya Sharma",
      status: "open",
      created: "2024-03-10T09:15:00Z",
      updated_at: "2024-03-10T09:15:00Z",
      resolved_at: null,
      description: "The hair color applied has caused severe damage and breakage. My hair feels brittle and has started falling out. Request immediate compensation and treatment.",
      staff: "Vikram Singh"
    },
    {
      id: 2,
      complaint_id: "CMP-102",
      customer: "Sunita Patel",
      subject: "Wrong Service Charged",
      issue_type: "billing_issue",
      priority: "medium",
      assigned_to: "Amit Mehta",
      status: "in_progress",
      created: "2024-03-09T14:30:00Z",
      updated_at: "2024-03-10T10:20:00Z",
      resolved_at: null,
      description: "I was charged for premium facial but received basic service. The bill shows ₹2500 but the actual service was worth only ₹1200. Manager promised to look into it.",
      staff: "Neha Gupta"
    },
    {
      id: 3,
      complaint_id: "CMP-103",
      customer: "Anita Desai",
      subject: "Unhygienic Tools Used",
      issue_type: "cleanliness", 
      priority: "high",
      assigned_to: "Rajesh Kumar",
      status: "open",
      created: "2024-03-09T11:45:00Z",
      updated_at: "2024-03-09T11:45:00Z",
      resolved_at: null,
      description: "The scissors and combs used were not properly sanitized. Noticed hair from previous customer on the tools. Very concerned about hygiene standards.",
      staff: "Kavita Joshi"
    },
    {
      id: 4,
      complaint_id: "CMP-104",
      customer: "Vikram Rathore",
      subject: "Rude Staff Behavior",
      issue_type: "staff_behavior",
      priority: "medium",
      assigned_to: "Sneha Reddy",
      status: "resolved",
      created: "2024-03-08T16:20:00Z",
      updated_at: "2024-03-09T15:30:00Z",
      resolved_at: "2024-03-09T15:30:00Z",
      description: "The receptionist was very rude when I asked about delay. Spoke in disrespectful tone and ignored my concerns. Staff needs customer service training.",
      staff: "Manoj Tiwari"
    },
    {
      id: 5,
      complaint_id: "CMP-105",
      customer: "Deepa Sharma",
      subject: "Long Waiting Time",
      issue_type: "waiting_time",
      priority: "low",
      assigned_to: "Ritu Patel",
      status: "closed",
      created: "2024-03-08T10:00:00Z",
      updated_at: "2024-03-09T12:00:00Z",
      resolved_at: "2024-03-09T12:00:00Z",
      description: "Had appointment at 10 AM but was asked to wait until 11:30 AM. No explanation or apology given. Wasted my entire morning.",
      staff: "Anjali Singh"
    },
    {
      id: 6,
      complaint_id: "CMP-106",
      customer: "Arjun Nair",
      subject: "Wrong Product Used",
      issue_type: "service_quality",
      priority: "high",
      assigned_to: "Meera Krishnan",
      status: "in_progress",
      created: "2024-03-07T13:15:00Z",
      updated_at: "2024-03-08T09:45:00Z",
      resolved_at: null,
      description: "They used a different hair serum than what I requested. Caused allergic reaction on my scalp. Need immediate medical consultation and compensation.",
      staff: "Suresh Iyer"
    },
    {
      id: 7,
      complaint_id: "CMP-107",
      customer: "Kavita Menon",
      subject: "Overcharging Issue",
      issue_type: "billing_issue",
      priority: "medium",
      assigned_to: "Pooja Singh",
      status: "resolved",
      created: "2024-03-07T11:30:00Z",
      updated_at: "2024-03-08T14:20:00Z",
      resolved_at: "2024-03-08T14:20:00Z",
      description: "Charged for two services but only received one. Billing counter refused to listen initially. Had to escalate to manager for refund.",
      staff: "Raj Kapoor"
    },
    {
      id: 8,
      complaint_id: "CMP-108",
      customer: "Rohan Deshpande",
      subject: "Equipment Malfunction",
      issue_type: "cleanliness",
      priority: "low",
      assigned_to: "Anil Kumar",
      status: "open",
      created: "2024-03-06T15:45:00Z",
      updated_at: "2024-03-06T15:45:00Z",
      resolved_at: null,
      description: "The hair dryer was not working properly and felt very hot. Concerned about safety standards and equipment maintenance.",
      staff: "Divya Sharma"
    },
    {
      id: 9,
      complaint_id: "CMP-109",
      customer: "Meera Nambiar",
      subject: "Unprofessional Stylist",
      issue_type: "staff_behavior",
      priority: "high",
      assigned_to: "Kiran Rao",
      status: "in_progress",
      created: "2024-03-06T09:30:00Z",
      updated_at: "2024-03-07T10:15:00Z",
      resolved_at: null,
      description: "Stylist was on phone throughout the service. Made several mistakes in haircut. When pointed out, became argumentative.",
      staff: "Lakshmi Prasad"
    },
    {
      id: 10,
      complaint_id: "CMP-110",
      customer: "Prakash Joshi",
      subject: "Booking System Error",
      issue_type: "waiting_time",
      priority: "medium",
      assigned_to: "Sunil Verma",
      status: "resolved",
      created: "2024-03-05T12:00:00Z",
      updated_at: "2024-03-06T11:30:00Z",
      resolved_at: "2024-03-06T11:30:00Z",
      description: "Online booking showed available slots but when I arrived, they had no record. System glitch wasted my time.",
      staff: "Nisha Gupta"
    }
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiData(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching complaints Data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format issue type from snake_case to Title Case
  const formatIssueType = (issueType) => {
    if (!issueType) return 'Unknown';
    return issueType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get time ago from date
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate stats from API data
  const stats = {
    total: apiData.length || 0,
    open: apiData.filter(c => c.status === 'open').length,
    inProgress: apiData.filter(c => c.status === 'in_progress').length,
    resolved: apiData.filter(c => c.status === 'closed' || c.status === 'resolved').length,
    avgResolutionTime: "Calculating..."
  };

  const filteredComplaints = apiData.filter(complaint => {
    const matchesSearch =
      complaint.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaint_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'Open' && complaint.status === 'open') ||
      (statusFilter === 'In Progress' && complaint.status === 'in_progress') ||
      (statusFilter === 'Resolved' && (complaint.status === 'closed' || complaint.status === 'resolved'));

    const matchesPriority = priorityFilter === 'all' ||
      complaint.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filter Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
            ))}
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="animate-pulse flex items-center justify-between">
              <div>
                <div className="h-7 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-96"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[...Array(8)].map((_, i) => (
                    <th key={i} className="py-3 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-semibold text-red-600">Error Loading Complaints Data</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchComplaints}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Complaints-specific filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints by ID, customer, or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>


          <button
            onClick={fetchComplaints}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Complaints Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-900">{stats.open}</div>
              <div className="text-red-700 text-sm">Open Complaints</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-900">{stats.inProgress}</div>
              <div className="text-yellow-700 text-sm">In Progress</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
              <div className="text-green-700 text-sm">Resolved</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-blue-700 text-sm">Total Complaints</div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Complaints Trackings</h3>
              <p className="text-gray-600 mt-1">Track, manage, and resolve customer complaints efficiently</p>
            </div>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h4>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{complaint.complaint_id}</div>
                      <div className="text-xs text-gray-500">{getTimeAgo(complaint.created)}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-700 text-sm font-medium">
                            {complaint.customer?.split(' ').map(n => n[0]).join('') || 'C'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{complaint.customer || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{complaint.subject?.substring(0, 30)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatIssueType(complaint.issue_type)}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {complaint.description?.substring(0, 50) || 'No description'}...
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority ? complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1) : 'Not Set'}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{complaint.assigned_to || 'Unassigned'}</div>
                      <div className="text-xs text-gray-500">{complaint.staff || 'No staff assigned'}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                        {formatStatus(complaint.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.created)}
                      <div className="text-xs text-gray-400">
                        {complaint.created ? new Date(complaint.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(complaint);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Complaint Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedComplaint.complaint_id}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                        {selectedComplaint.priority ? selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1) : 'Not Set'} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.status)}`}>
                        {formatStatus(selectedComplaint.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Created</div>
                    <div className="font-semibold text-gray-900">{formatDate(selectedComplaint.created)}</div>
                    <div className="text-sm text-gray-500">{getTimeAgo(selectedComplaint.created)}</div>
                  </div>
                </div>

                {/* Customer & Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Customer Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Name</span>
                        <span className="font-medium text-gray-900">{selectedComplaint.customer || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Issue Type</span>
                        <span className="font-medium text-gray-900">{formatIssueType(selectedComplaint.issue_type)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Staff</span>
                        <span className="font-medium text-gray-900">{selectedComplaint.staff || 'Not assigned'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Assigned To</span>
                        <span className="font-medium text-gray-900">{selectedComplaint.assigned_to || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Complaint Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Subject</span>
                        <span className="font-medium text-gray-900">{selectedComplaint.subject || 'No subject'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedComplaint.created)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Updated</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedComplaint.updated_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Resolved At</span>
                        <span className="font-medium text-gray-900">{selectedComplaint.resolved_at ? formatDate(selectedComplaint.resolved_at) : 'Not resolved'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Description</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans">{selectedComplaint.description || 'No description provided'}</pre>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Complaint</h3>
                <button
                  onClick={() => setShowNewComplaint(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="service_quality">Service Quality</option>
                      <option value="staff_behavior">Staff Behavior</option>
                      <option value="waiting_time">Waiting Time</option>
                      <option value="cleanliness">Cleanliness</option>
                      <option value="billing_issue">Billing Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Staff name" />
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Brief complaint subject" />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Detailed description of the complaint..." />
                </div>

                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#492DBD] text-white py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors">
                    Create Complaint
                  </button>
                  <button
                    onClick={() => setShowNewComplaint(false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
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

export default ComplaintsTracking;