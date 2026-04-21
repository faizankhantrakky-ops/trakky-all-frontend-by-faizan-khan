import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Share2,
  Filter,
  Download,
  Mail,
  MessageCircle,
  CheckCircle,
  X,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  Send,
  Phone,
  MapPin,
  Clock,
  User,
  Settings,
  DownloadCloud,
  Award,
  Target,
  TrendingDown,
  BarChart2,
  Activity,
  ChevronRight,
  MoreVertical,
  Check,
  XCircle,
  Percent,
  Clock as ClockIcon,
  IndianRupee,
  Heart,
  Shield,
  Zap,
  Crown,
  Medal,
  Gift,
  Tag,
  Percent as PercentIcon,
  Ticket,
  ShoppingBag,
  RefreshCw,
  Coins,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  ShoppingCart,
  CreditCard,
  Calendar as CalendarIcon,
  PhoneCall,
  Mail as MailIcon,
  Map,
  Bell,
  ShieldCheck,
  Key,
  Gift as GiftIcon,
  Sparkles,
  Target as TargetIcon,
  Package,
  Award as AwardIcon
} from 'lucide-react';

const TestingComponent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [performancePeriod, setPerformancePeriod] = useState('monthly');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [pointsFilter, setPointsFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Sample data
 const feedbackData = [
  {
    id: 1,
    customerName: "Riya Malhotra",
    phone: "+91 91234 56789",
    email: "riya.m@example.com",
    rating: 4,
    service: "Full Body Massage",
    staff: "Kavita Rao",
    branch: "Andheri West",
    date: "2024-02-05",
    feedback:
      "Relaxing experience and good ambiance. Therapist was skilled, but booking confirmation was slightly delayed.",
    sentiment: "positive",
    status: "resolved",
    followUp: "completed",
    tags: ["relaxing", "skilled staff", "good ambiance"]
  },
  {
    id: 2,
    customerName: "Mohit Agarwal",
    phone: "+91 99876 54321",
    email: "mohit.a@example.com",
    rating: 2,
    service: "Pedicure",
    staff: "Sunita Devi",
    branch: "Borivali East",
    date: "2024-02-04",
    feedback:
      "The service was rushed and results were not satisfactory. Expected better hygiene.",
    sentiment: "negative",
    status: "in-progress",
    followUp: "urgent",
    tags: ["hygiene issue", "rushed service"]
  },
  {
    id: 3,
    customerName: "Neel Shah",
    phone: "+91 90909 80808",
    email: "neel.shah@example.com",
    rating: 5,
    service: "Hair Cut & Styling",
    staff: "Rohit Salvi",
    branch: "Thane",
    date: "2024-02-03",
    feedback:
      "Outstanding service! Loved the haircut and styling. Staff was very friendly and professional.",
    sentiment: "positive",
    status: "resolved",
    followUp: "completed",
    tags: ["excellent", "friendly", "professional"]
  },
  {
    id: 4,
    customerName: "Pooja Nair",
    phone: "+91 93456 78901",
    email: "pooja.nair@example.com",
    rating: 3,
    service: "Facial Cleanup",
    staff: "Meena Joseph",
    branch: "Navi Mumbai",
    date: "2024-02-02",
    feedback:
      "Service was decent, but the products used were not explained properly.",
    sentiment: "neutral",
    status: "pending",
    followUp: "pending",
    tags: ["average experience", "communication"]
  }
];


  // Loyalty Program Data
  const loyaltyProgram = {
    totalCustomers: 1248,
    totalPointsIssued: 456890,
    totalPointsRedeemed: 234560,
    activeCustomers: 892,
    avgPointsPerCustomer: 365,
    redemptionRate: "23.8%"
  };

  const loyaltyTiers = [
    { name: "Platinum", minPoints: 10000, color: "bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900", benefits: ["20% Discount", "Priority Booking", "Free Gifts", "VIP Events"], customers: 48 },
    { name: "Gold", minPoints: 5000, color: "bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900", benefits: ["15% Discount", "Free Services", "Birthday Bonus"], customers: 156 },
    { name: "Silver", minPoints: 2000, color: "bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800", benefits: ["10% Discount", "Points Bonus"], customers: 342 },
    { name: "Bronze", minPoints: 500, color: "bg-gradient-to-r from-orange-50 to-orange-200 text-orange-900", benefits: ["5% Discount"], customers: 346 }
  ];

  const loyaltyCustomers = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priyasharma@example.com",
      phone: "+91 98765 43210",
      tier: "Platinum",
      points: 12500,
      pointsEarned: 12500,
      pointsRedeemed: 3200,
      availablePoints: 9300,
      joinDate: "2022-03-15",
      lastVisit: "2024-01-15",
      totalVisits: 42,
      totalSpent: "₹2,85,000",
      favoriteServices: ["Hair Spa", "Facial", "Massage"],
      rewardsRedeemed: 12,
      pointsExpiring: 500,
      expiryDate: "2024-06-30",
      status: "active",
      imageColor: "bg-purple-500"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "+91 87654 32109",
      tier: "Gold",
      points: 6800,
      pointsEarned: 7800,
      pointsRedeemed: 1000,
      availablePoints: 6800,
      joinDate: "2022-08-20",
      lastVisit: "2024-01-14",
      totalVisits: 28,
      totalSpent: "₹1,65,000",
      favoriteServices: ["Facial", "Haircut"],
      rewardsRedeemed: 6,
      pointsExpiring: 300,
      expiryDate: "2024-05-15",
      status: "active",
      imageColor: "bg-blue-500"
    },
    {
      id: 3,
      name: "Sneha Patel",
      email: "sneha@example.com",
      phone: "+91 76543 21098",
      tier: "Silver",
      points: 3200,
      pointsEarned: 3500,
      pointsRedeemed: 300,
      availablePoints: 3200,
      joinDate: "2023-01-10",
      lastVisit: "2024-01-13",
      totalVisits: 15,
      totalSpent: "₹95,000",
      favoriteServices: ["Manicure", "Pedicure"],
      rewardsRedeemed: 2,
      pointsExpiring: 150,
      expiryDate: "2024-04-20",
      status: "active",
      imageColor: "bg-pink-500"
    },
    {
      id: 4,
      name: "Amit Joshi",
      email: "amit@example.com",
      phone: "+91 65432 10987",
      tier: "Bronze",
      points: 850,
      pointsEarned: 900,
      pointsRedeemed: 50,
      availablePoints: 850,
      joinDate: "2023-06-25",
      lastVisit: "2024-01-12",
      totalVisits: 8,
      totalSpent: "₹45,000",
      favoriteServices: ["Massage"],
      rewardsRedeemed: 1,
      pointsExpiring: 50,
      expiryDate: "2024-03-10",
      status: "active",
      imageColor: "bg-green-500"
    },
    {
      id: 5,
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 54321 09876",
      tier: "Platinum",
      points: 14200,
      pointsEarned: 15500,
      pointsRedeemed: 1300,
      availablePoints: 14200,
      joinDate: "2021-12-05",
      lastVisit: "2024-01-10",
      totalVisits: 58,
      totalSpent: "₹3,45,000",
      favoriteServices: ["Full Body Spa", "Facial", "Hair Treatment"],
      rewardsRedeemed: 18,
      pointsExpiring: 800,
      expiryDate: "2024-07-15",
      status: "active",
      imageColor: "bg-red-500"
    },
    {
      id: 6,
      name: "Raj Mehta",
      email: "raj@example.com",
      phone: "+91 43210 98765",
      tier: "Gold",
      points: 5200,
      pointsEarned: 6200,
      pointsRedeemed: 1000,
      availablePoints: 5200,
      joinDate: "2022-11-30",
      lastVisit: "2024-01-08",
      totalVisits: 22,
      totalSpent: "₹1,25,000",
      favoriteServices: ["Haircut", "Shave"],
      rewardsRedeemed: 4,
      pointsExpiring: 200,
      expiryDate: "2024-05-30",
      status: "inactive",
      imageColor: "bg-orange-500"
    }
  ];

  const rewardsCatalog = [
    {
      id: 1,
      name: "25% Off Hair Services",
      pointsRequired: 2000,
      category: "Discount",
      description: "Get 25% off on all hair services including haircut, coloring, and spa.",
      validity: "30 days",
      redemptionCount: 45,
      status: "active"
    },
    {
      id: 2,
      name: "Free Facial Session",
      pointsRequired: 3000,
      category: "Free Service",
      description: "Complimentary gold facial session worth ₹2500.",
      validity: "60 days",
      redemptionCount: 28,
      status: "active"
    },
    {
      id: 3,
      name: "Birthday Special Package",
      pointsRequired: 5000,
      category: "Package",
      description: "Special birthday package including massage, facial, and hair spa.",
      validity: "Birthday Month",
      redemptionCount: 15,
      status: "active"
    },
    {
      id: 4,
      name: "VIP Membership Upgrade",
      pointsRequired: 10000,
      category: "Membership",
      description: "Upgrade to VIP membership with exclusive benefits.",
      validity: "Permanent",
      redemptionCount: 8,
      status: "active"
    },
    {
      id: 5,
      name: "15% Off All Services",
      pointsRequired: 1500,
      category: "Discount",
      description: "15% discount on all salon services.",
      validity: "15 days",
      redemptionCount: 62,
      status: "active"
    }
  ];


  const staffPerformanceData = [
    { 
      id: 1,
      name: "Anita Verma", 
      role: "Senior Stylist",
      department: "Hair Care",
      rating: 4.8, 
      feedbackCount: 145, 
      positive: 138, 
      negative: 7,
      avgResponseTime: "2.5 hrs",
      retentionRate: "94%",
      revenue: "₹2,85,000",
      services: ["Hair Spa", "Haircut", "Coloring"],
      performanceTrend: "up",
      trendValue: "+12%",
      efficiency: "92%",
      customerSatisfaction: "96%",
      attendance: "98%",
      awards: ["Top Performer Q3", "Customer Choice Award"],
      joinDate: "2022-03-15",
      imageColor: "bg-purple-500"
    },
    { 
      id: 2,
      name: "Rajesh Kumar", 
      role: "Head Therapist",
      department: "Spa & Massage",
      rating: 4.5, 
      feedbackCount: 128, 
      positive: 120, 
      negative: 8,
      avgResponseTime: "3.2 hrs",
      retentionRate: "89%",
      revenue: "₹2,45,000",
      services: ["Swedish Massage", "Deep Tissue", "Aromatherapy"],
      performanceTrend: "up",
      trendValue: "+8%",
      efficiency: "88%",
      customerSatisfaction: "92%",
      attendance: "96%",
      awards: ["Best Therapist 2023"],
      joinDate: "2021-08-20",
      imageColor: "bg-blue-500"
    },
    { 
      id: 3,
      name: "Neha Singh", 
      role: "Senior Esthetician",
      department: "Skin Care",
      rating: 4.2, 
      feedbackCount: 112, 
      positive: 102, 
      negative: 10,
      avgResponseTime: "4.1 hrs",
      retentionRate: "85%",
      revenue: "₹1,95,000",
      services: ["Gold Facial", "Chemical Peel", "Microdermabrasion"],
      performanceTrend: "neutral",
      trendValue: "+2%",
      efficiency: "84%",
      customerSatisfaction: "88%",
      attendance: "94%",
      awards: [],
      joinDate: "2022-11-10",
      imageColor: "bg-pink-500"
    },
    { 
      id: 4,
      name: "Priya Mehta", 
      role: "Nail Specialist",
      department: "Nail Care",
      rating: 3.8, 
      feedbackCount: 98, 
      positive: 85, 
      negative: 13,
      avgResponseTime: "5.6 hrs",
      retentionRate: "78%",
      revenue: "₹1,65,000",
      services: ["Gel Manicure", "Nail Art", "Pedicure"],
      performanceTrend: "down",
      trendValue: "-5%",
      efficiency: "76%",
      customerSatisfaction: "82%",
      attendance: "91%",
      awards: [],
      joinDate: "2023-01-25",
      imageColor: "bg-green-500"
    },
    { 
      id: 5,
      name: "Arun Sharma", 
      role: "Junior Stylist",
      department: "Hair Care",
      rating: 4.6, 
      feedbackCount: 75, 
      positive: 70, 
      negative: 5,
      avgResponseTime: "3.8 hrs",
      retentionRate: "90%",
      revenue: "₹1,45,000",
      services: ["Haircut", "Blow Dry", "Basic Spa"],
      performanceTrend: "up",
      trendValue: "+15%",
      efficiency: "86%",
      customerSatisfaction: "91%",
      attendance: "97%",
      awards: ["Rising Star Award"],
      joinDate: "2023-06-15",
      imageColor: "bg-orange-500"
    },
    { 
      id: 6,
      name: "Meena Patel", 
      role: "Senior Esthetician",
      department: "Skin Care",
      rating: 4.7, 
      feedbackCount: 132, 
      positive: 127, 
      negative: 5,
      avgResponseTime: "2.8 hrs",
      retentionRate: "93%",
      revenue: "₹2,35,000",
      services: ["Hydrafacial", "LED Therapy", "Diamond Peel"],
      performanceTrend: "up",
      trendValue: "+10%",
      efficiency: "90%",
      customerSatisfaction: "94%",
      attendance: "99%",
      awards: ["Employee of the Month", "Perfect Attendance"],
      joinDate: "2021-05-30",
      imageColor: "bg-red-500"
    }
  ];

  // Filter functions
  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.staff.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'positive' && feedback.rating >= 4) ||
                         (ratingFilter === 'negative' && feedback.rating <= 2) ||
                         (ratingFilter === 'neutral' && feedback.rating === 3);

    return matchesSearch && matchesRating;
  });

  const filteredCustomers = loyaltyCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const matchesTier = tierFilter === 'all' || customer.tier.toLowerCase() === tierFilter.toLowerCase();
    
    const matchesPoints = pointsFilter === 'all' ||
                         (pointsFilter === 'high' && customer.points >= 5000) ||
                         (pointsFilter === 'medium' && customer.points >= 2000 && customer.points < 5000) ||
                         (pointsFilter === 'low' && customer.points < 2000);

    return matchesSearch && matchesTier && matchesPoints;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900';
      case 'Gold': return 'bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900';
      case 'Silver': return 'bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800';
      case 'Bronze': return 'bg-gradient-to-r from-orange-50 to-orange-200 text-orange-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getPerformanceTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderPerformanceBar = (value, max = 5) => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const CustomerLoyaltyTab = () => (
    <div className="space-y-6">
      {/* Loyalty Program Header */}
      <div className="bg-[#492DBD] rounded-xl shadow-sm text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Customer Loyalty's Program</h3>
            <p className="text-purple-100 mt-1">Reward loyal customers and boost retention with our points-based loyalty system</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-[#492DBD] rounded-lg hover:bg-purple-50">
              <Gift className="w-4 h-4" />
              <span>Add Reward</span>
            </button>
       
          </div>
        </div>

        {/* Loyalty Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{loyaltyProgram.totalCustomers.toLocaleString()}</div>
                <div className="text-sm text-purple-200">Total Customers</div>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{loyaltyProgram.totalPointsIssued.toLocaleString()}</div>
                <div className="text-sm text-purple-200">Points Issued</div>
              </div>
              <Coins className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{loyaltyProgram.totalPointsRedeemed.toLocaleString()}</div>
                <div className="text-sm text-purple-200">Points Redeemed</div>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{loyaltyProgram.redemptionRate}</div>
                <div className="text-sm text-purple-200">Redemption Rate</div>
              </div>
              <PercentIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

 

      {/* Loyalty Program Management */}
      <div className=" gap-6">
        {/* Customer Points Overview */}
        <div className=" bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Customer Points Overview</h4>
            <div className="flex items-center space-x-2">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              >
                <option value="all">All Tiers</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
              <select
                value={pointsFilter}
                onChange={(e) => setPointsFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              >
                <option value="all">All Points</option>
                <option value="high">High (5000+)</option>
                <option value="medium">Medium (2000-5000)</option>
                <option value="low">Low (0-2000)</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Tier</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Points</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Visits</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customer.imageColor}`}>
                          <span className="text-white font-semibold">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{customer.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Available: {customer.availablePoints.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{customer.totalVisits}</div>
                      <div className="text-xs text-gray-500">Last: {customer.lastVisit}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-[#492DBD]">
                          <Gift className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Coins className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

       
      </div>
    </div>
  );

  const CustomerDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Customer Loyalty Details</h3>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedCustomer.imageColor}`}>
                    <span className="text-white font-bold text-xl">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(selectedCustomer.tier)}`}>
                        {selectedCustomer.tier} Member
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{selectedCustomer.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700">Available Points</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">{selectedCustomer.availablePoints.toLocaleString()}</div>
                  <div className="text-xs text-blue-600 mt-1">Expiring: {selectedCustomer.pointsExpiring} pts</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-sm text-green-700">Total Visits</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">{selectedCustomer.totalVisits}</div>
                  <div className="text-xs text-green-600 mt-1">Last: {selectedCustomer.lastVisit}</div>
                </div>
                
               
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="text-sm text-orange-700">Rewards Redeemed</div>
                  <div className="text-2xl font-bold text-orange-900 mt-1">{selectedCustomer.rewardsRedeemed}</div>
                  <div className="text-xs text-orange-600 mt-1">Loyal Customer</div>
                </div>
              </div>

              {/* Points Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Points History</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Points Earned</div>
                      <div className="font-semibold text-gray-900">{selectedCustomer.pointsEarned.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Points Redeemed</div>
                      <div className="font-semibold text-gray-900">{selectedCustomer.pointsRedeemed.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Points Expiring</div>
                      <div className="font-semibold text-red-600">{selectedCustomer.pointsExpiring}</div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">Expiry Date</div>
                        <div className="text-sm text-gray-600">{selectedCustomer.expiryDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Favorite Services</h5>
                  <div className="space-y-2">
                    {selectedCustomer.favoriteServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{service}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Member since {selectedCustomer.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Regular customer at South Delhi branch</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-[#492DBD] text-white py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center space-x-2">
                  <Coins className="w-4 h-4" />
                  <span>Add Points</span>
                </button>
               
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RewardDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Reward Details</h3>
            <button
              onClick={() => setSelectedReward(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedReward && (
            <div className="space-y-6">
              {/* Reward Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedReward.name}</h4>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="px-3 py-1 bg-[#492DBD] text-white rounded-full text-sm font-medium">
                      {selectedReward.category}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{selectedReward.pointsRequired.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Points Required</div>
                </div>
              </div>

              {/* Reward Details */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedReward.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Validity Period</div>
                    <div className="font-semibold text-gray-900 mt-1">{selectedReward.validity}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Redemption Count</div>
                    <div className="font-semibold text-gray-900 mt-1">{selectedReward.redemptionCount} times</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-[#492DBD] text-white py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors">
                  Edit Reward
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Assign to Customers
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  View Redemptions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const StaffPerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Staff Performance </h3>
            <p className="text-gray-600 mt-1">Track and analyze staff performance metrics and customer feedback</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={performancePeriod}
              onChange={(e) => setPerformancePeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] bg-white"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Staff Performance Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Staff Performance Details</h4>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Staff Member</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Feedback</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Performance</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffPerformanceData.map((staff) => (
                  <tr 
                    key={staff.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedStaff(staff)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${staff.imageColor}`}>
                          <span className="text-white font-semibold">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(staff.rating)}
                        </div>
                        <span className="font-semibold text-gray-900">{staff.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 font-medium">{staff.feedbackCount} total</div>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-green-600">{staff.positive} positive</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-red-600">{staff.negative} negative</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getPerformanceTrendIcon(staff.performanceTrend)}
                        <span className={`text-sm font-medium ${
                          staff.performanceTrend === 'up' ? 'text-green-600' :
                          staff.performanceTrend === 'down' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {staff.trendValue}
                        </span>
                      </div>
                    </td>
                  
                    <td className="py-4 px-4">
                      <button className="p-2 text-gray-400 hover:text-[#492DBD] hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const StaffDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Staff Performance Details</h3>
            <button
              onClick={() => setSelectedStaff(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedStaff && (
            <div className="space-y-6">
              {/* Staff Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedStaff.imageColor}`}>
                    <span className="text-white font-bold text-xl">
                      {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {selectedStaff.role}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {selectedStaff.department}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{selectedStaff.rating.toFixed(1)}</div>
                  <div className="flex items-center justify-end space-x-1">
                    {renderStars(selectedStaff.rating)}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Feedback</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{selectedStaff.feedbackCount}</div>
                  <div className="text-sm text-green-600 mt-1">
                    <span className="font-semibold">{selectedStaff.positive}</span> Positive
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Efficiency</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{selectedStaff.efficiency}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Avg Response: {selectedStaff.avgResponseTime}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Satisfaction</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{selectedStaff.customerSatisfaction}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">{selectedStaff.attendance}</span> Attendance
                  </div>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Services Offered</h5>
                  <div className="space-y-2">
                    {selectedStaff.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{service}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Performance Metrics</h5>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Customer Satisfaction</span>
                        <span className="font-semibold text-gray-900">{selectedStaff.customerSatisfaction}</span>
                      </div>
                      {renderPerformanceBar(parseInt(selectedStaff.customerSatisfaction), 100)}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Efficiency</span>
                        <span className="font-semibold text-gray-900">{selectedStaff.efficiency}</span>
                      </div>
                      {renderPerformanceBar(parseInt(selectedStaff.efficiency), 100)}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Trend</span>
                        <div className="flex items-center space-x-1">
                          {getPerformanceTrendIcon(selectedStaff.performanceTrend)}
                          <span className={`font-semibold ${
                            selectedStaff.performanceTrend === 'up' ? 'text-green-600' :
                            selectedStaff.performanceTrend === 'down' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {selectedStaff.trendValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button className="flex-1 bg-[#492DBD] text-white py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Feedback</span>
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Plus icon component
  const Plus = ({ className = "w-6 h-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Satisfaction</h1>
              <p className="text-gray-600 mt-1">
                Collect, trace, analyze and respond to customers feedback to improve service quality
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            {[
              { id: 'dashboard', name: 'Dashboard', icaon: BarChart3 },
              { id: 'feedback', name: 'All Feedback', icon: MessageSquare },
              { id: 'staff', name: 'Staff Performance', icon: Users },
              { id: 'loyalty', name: 'Customer Loyalty', icon: Star },
              { id: 'complaints', name: 'Complaints Trackings', icon: AlertCircle }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#492DBD] text-[#492DBD]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
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
                  placeholder={activeTab === 'loyalty' ? "Search customers, email, phone..." : "Search customers, services, staff..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                />
              </div>
            </div>
            {activeTab !== 'loyalty' && (
              <>
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
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </>
            )}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Feedback</span>
                  <span className="font-semibold text-gray-900">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(4)}
                    <span className="font-semibold text-gray-900 ml-2">4.3/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Actions</span>
                  <span className="font-semibold text-red-600">8</span>
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
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Feedback Dashboard</h3>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-900">89%</div>
                        <div className="text-green-700 text-sm">Satisfaction Rate</div>
                      </div>
                      <ThumbsUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-yellow-900">8%</div>
                        <div className="text-yellow-700 text-sm">Neutral Feedback</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-900">3%</div>
                        <div className="text-red-700 text-sm">Complaints</div>
                      </div>
                      <ThumbsDown className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Feedback */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Feedback</h4>
                  <div className="space-y-4">
                    {filteredFeedback.slice(0, 5).map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#492DBD] transition-colors cursor-pointer"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#492DBD] rounded-full flex items-center justify-center text-white font-semibold">
                              {feedback.customerName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{feedback.customerName}</div>
                              <div className="text-sm text-gray-500">{feedback.service} • {feedback.staff}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(feedback.sentiment)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                              {feedback.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                          </div>
                       <div className="text-sm text-gray-500">
  {feedback?.date ? feedback.date.split("-").reverse().join("-") : ""}
</div>

                        </div>
                        <p className="text-gray-700 mt-2 text-sm">{feedback.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">All Customer Feedback</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(feedback.sentiment)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                              {feedback.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{feedback.date}</div>
                      </div>
                      
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{feedback.customerName}</div>
                          <div className="text-sm text-gray-600">{feedback.service} with {feedback.staff}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{feedback.branch}</div>
                          <div className="text-sm text-gray-500">{feedback.phone}</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {feedback.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-[#492DBD]">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'staff' && <StaffPerformanceTab />}
            {activeTab === 'loyalty' && <CustomerLoyaltyTab />}


            {activeTab === 'complaints' && (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Header with stats */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Complaints Trackings's</h3>
          <p className="text-gray-600 mt-1">Track, manage, and resolve customer complaints efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors">
            <AlertCircle className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Complaint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-900">12</div>
              <div className="text-red-700 text-sm">Open Complaints</div>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-900">8</div>
              <div className="text-yellow-700 text-sm">In Progress</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">24</div>
              <div className="text-green-700 text-sm">Resolved</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">2.4 hrs</div>
              <div className="text-blue-700 text-sm">Avg. Resolution Time</div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    {/* Complaints Table */}
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
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Sample Complaint Data */}
          {[
            {
              id: "COMP-00124",
              customer: "Priya Sharma",
              issue: "Service Quality",
              priority: "High",
              assignedTo: "Anita Verma",
              status: "Open",
              created: "2 hours ago",
              severity: "high"
            },
            {
              id: "COMP-00123",
              customer: "Rahul Kumar",
              issue: "Waiting Time",
              priority: "Medium",
              assignedTo: "Neha Singh",
              status: "In Progress",
              created: "1 day ago",
              severity: "medium"
            },
            {
              id: "COMP-00122",
              customer: "Sneha Patel",
              issue: "Staff Behavior",
              priority: "High",
              assignedTo: "Rajesh Kumar",
              status: "Resolved",
              created: "2 days ago",
              severity: "high"
            },
            {
              id: "COMP-00121",
              customer: "Amit Joshi",
              issue: "Cleanliness",
              priority: "Low",
              assignedTo: "Priya Mehta",
              status: "Open",
              created: "3 days ago",
              severity: "low"
            },
            {
              id: "COMP-00120",
              customer: "Neha Gupta",
              issue: "Billing Issue",
              priority: "Medium",
              assignedTo: "Arun Sharma",
              status: "Resolved",
              created: "5 days ago",
              severity: "medium"
            }
          ].map((complaint, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{complaint.id}</div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 text-sm font-medium">
                      {complaint.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{complaint.customer}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="text-sm text-gray-900">{complaint.issue}</div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                  complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.priority}
                </span>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="text-sm text-gray-900">{complaint.assignedTo}</div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  complaint.status === 'Open' ? 'bg-red-100 text-red-800' :
                  complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.status}
                </span>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                {complaint.created}
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Complaint Detail View */}
    <div className="p-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Complaint Analysis</h4>
          <p className="text-sm text-gray-600 mt-1">Track patterns and identify common issues</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last quarter</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  </div>
)}

            {/* Add other tabs content similarly */}
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
                      {selectedFeedback.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedFeedback.customerName}</div>
                      <div className="text-sm text-gray-500">{selectedFeedback.phone} • {selectedFeedback.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedFeedback.rating)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{selectedFeedback.date}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Service:</span> {selectedFeedback.service}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Staff:</span> {selectedFeedback.staff}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Branch:</span> {selectedFeedback.branch}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFeedback.status)}`}>
                      {selectedFeedback.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Feedback:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedFeedback.feedback}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Tags:</h4>
                  <div className="flex space-x-2">
                    {selectedFeedback.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-[#492DBD] text-white rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-[#492DBD] text-white py-2 px-4 rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Response</span>
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Detail Modal */}
        {selectedStaff && <StaffDetailModal />}
        
        {/* Customer Detail Modal */}
        {selectedCustomer && <CustomerDetailModal />}
        
        {/* Reward Detail Modal */}
        {selectedReward && <RewardDetailModal />}
      </div>
    </div>
  );
};

export default TestingComponent;