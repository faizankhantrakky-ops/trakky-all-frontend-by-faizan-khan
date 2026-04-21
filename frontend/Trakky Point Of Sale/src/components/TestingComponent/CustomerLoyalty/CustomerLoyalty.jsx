import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Gift,
  Coins,
  Eye,
  Users as UsersIcon,
  ShoppingCart,
  Percent as PercentIcon,
  X,
  ChevronRight,
  Mail as MailIcon,
  PhoneCall,
  CalendarIcon,
  Map,
  Award,
  Crown,
  Medal,
  Star,
  IndianRupee,
  ClockIcon,
  TrendingUpIcon,
  Percent,
  Package,
  ShieldCheck,
  Key,
  ChevronDown,
  User,
  Download,
  MoreVertical,
  Plus
} from 'lucide-react';

const CustomerLoyalty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pointsFilter, setPointsFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900';
      case 'Gold': return 'bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900';
      case 'Silver': return 'bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800';
      case 'Bronze': return 'bg-gradient-to-r from-orange-50 to-orange-200 text-orange-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="space-y-3 md:space-y-6">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Customer Loyalty</h1>
            <button className="p-2 bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters - Responsive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-3 md:mb-6">
        {/* Mobile Search Row */}
        {isMobile && (
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
                  placeholder="Search customers, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                />
              </div>
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] min-w-[120px]"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD] min-w-[120px]"
            >
              <option value="all">All Points</option>
              <option value="high">High (5000+)</option>
              <option value="medium">Medium (2000-5000)</option>
              <option value="low">Low (0-2000)</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
              <Filter className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">More Filters</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] whitespace-nowrap">
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span>Add Reward</span>
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
            <button className="flex-1 px-3 py-1.5 text-xs bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199]">
              Add Points
            </button>
            <button className="flex-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add Reward
            </button>
          </div>
        )}

        {/* Mobile Filter Dropdown */}
        {isMobile && showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tier</label>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="all">All Tiers</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Points</label>
                <select
                  value={pointsFilter}
                  onChange={(e) => setPointsFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#492DBD] focus:border-[#492DBD]"
                >
                  <option value="all">All Points</option>
                  <option value="high">High (5000+)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low (0-2000)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loyalty Program Header - Responsive */}
      <div className="bg-[#492DBD] rounded-lg md:rounded-xl shadow-sm text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold">Customer Loyalty Program</h3>
            <p className="text-purple-100 mt-1 text-xs md:text-sm">
              Reward loyal customers and boost retention
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-white text-[#492DBD] rounded-lg hover:bg-purple-50">
              <Crown className="w-3 h-3 md:w-4 md:h-4" />
              <span>Tiers</span>
            </button>
            <button className="flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800">
              <Award className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </button>
          </div>
        </div>

        {/* Loyalty Stats - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg lg:text-2xl font-bold">{loyaltyProgram.totalCustomers.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-purple-200">Customers</div>
              </div>
              <UsersIcon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg lg:text-2xl font-bold">{loyaltyProgram.totalPointsIssued.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-purple-200">Points Issued</div>
              </div>
              <Coins className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg lg:text-2xl font-bold">{loyaltyProgram.totalPointsRedeemed.toLocaleString()}</div>
                <div className="text-xs md:text-sm text-purple-200">Points Redeemed</div>
              </div>
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg lg:text-2xl font-bold">{loyaltyProgram.redemptionRate}</div>
                <div className="text-xs md:text-sm text-purple-200">Redemption Rate</div>
              </div>
              <PercentIcon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Points Overview - Responsive Table */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
          <h4 className="text-base md:text-lg font-semibold text-gray-900">Customer Points</h4>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <span>{filteredCustomers.length} of {loyaltyCustomers.length} customers</span>
            <button className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredCustomers.slice(0, 5).map((customer) => (
              <div
                key={customer.id}
                className="border border-gray-200 rounded-lg p-3 hover:border-[#492DBD] transition-colors cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${customer.imageColor}`}>
                      <span className="text-white text-xs font-semibold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                    {customer.tier}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-600">Points</div>
                    <div className="font-semibold text-gray-900">{customer.points.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Visits</div>
                    <div className="font-semibold text-gray-900">{customer.totalVisits}</div>
                  </div>
                </div>
              </div>
            ))}
            {filteredCustomers.length > 5 && (
              <div className="text-center text-sm text-gray-600 py-2">
                + {filteredCustomers.length - 5} more customers
              </div>
            )}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Customer</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Tier</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Points</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Visits</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs md:text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${customer.imageColor}`}>
                          <span className="text-white text-xs md:text-sm font-semibold">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-xs md:text-sm text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="space-y-0.5 md:space-y-1">
                        <div className="font-semibold text-xs md:text-sm text-gray-900">{customer.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Available: {customer.availablePoints.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="text-xs md:text-sm text-gray-900">{customer.totalVisits}</div>
                      <div className="text-xs text-gray-500">Last: {customer.lastVisit}</div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-[#492DBD]"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add points functionality
                          }}
                        >
                          <Coins className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            // View details
                          }}
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rewards Catalog - Responsive Grid */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
          <h4 className="text-base md:text-lg font-semibold text-gray-900">Rewards Catalog</h4>
          <button className="flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199]">
            <Gift className="w-3 h-3 md:w-4 md:h-4" />
            <span>Add New Reward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {rewardsCatalog.map((reward) => (
            <div
              key={reward.id}
              className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-[#492DBD] transition-colors cursor-pointer"
              onClick={() => setSelectedReward(reward)}
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div>
                  <h5 className="font-semibold text-sm md:text-base text-gray-900">{reward.name}</h5>
                  <span className="text-xs text-gray-500">{reward.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg md:text-xl font-bold text-[#492DBD]">{reward.pointsRequired.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">{reward.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Validity: {reward.validity}</span>
                <span>{reward.redemptionCount} redeemed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Detail Modal - Responsive */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl w-full max-w-full md:max-w-4xl max-h-[90vh] md:max-h-[95vh] overflow-y-auto">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {/* Customer Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${selectedCustomer.imageColor}`}>
                      <span className="text-white font-bold text-base md:text-xl">
                        {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-2xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${getTierColor(selectedCustomer.tier)}`}>
                          {selectedCustomer.tier}
                        </span>
                        <span className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {selectedCustomer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCustomer.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-blue-700">Available Points</div>
                    <div className="text-lg md:text-2xl font-bold text-blue-900 mt-1">{selectedCustomer.availablePoints.toLocaleString()}</div>
                    <div className="text-xs text-blue-600 mt-1">Expiring: {selectedCustomer.pointsExpiring} pts</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-green-700">Total Visits</div>
                    <div className="text-lg md:text-2xl font-bold text-green-900 mt-1">{selectedCustomer.totalVisits}</div>
                    <div className="text-xs text-green-600 mt-1">Last: {selectedCustomer.lastVisit}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-purple-700">Total Spent</div>
                    <div className="text-lg md:text-2xl font-bold text-purple-900 mt-1">{selectedCustomer.totalSpent}</div>
                    <div className="text-xs text-purple-600 mt-1">Loyal Customer</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-2 md:p-4">
                    <div className="text-xs md:text-sm text-orange-700">Rewards Redeemed</div>
                    <div className="text-lg md:text-2xl font-bold text-orange-900 mt-1">{selectedCustomer.rewardsRedeemed}</div>
                    <div className="text-xs text-orange-600 mt-1">Loyal Customer</div>
                  </div>
                </div>

                {/* Points Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Points History</h5>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs md:text-sm text-gray-600">Points Earned</div>
                        <div className="font-semibold text-gray-900 text-sm md:text-base">{selectedCustomer.pointsEarned.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs md:text-sm text-gray-600">Points Redeemed</div>
                        <div className="font-semibold text-gray-900 text-sm md:text-base">{selectedCustomer.pointsRedeemed.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs md:text-sm text-gray-600">Points Expiring</div>
                        <div className="font-semibold text-red-600 text-sm md:text-base">{selectedCustomer.pointsExpiring}</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-xs md:text-sm font-medium text-gray-900">Expiry Date</div>
                          <div className="text-xs md:text-sm text-gray-600">{selectedCustomer.expiryDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Favorite Services</h5>
                    <div className="space-y-1 md:space-y-2">
                      {selectedCustomer.favoriteServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-xs md:text-sm text-gray-700">{service}</span>
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <h5 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Contact Information</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div className="flex items-center space-x-2">
                      <MailIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-700 truncate">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneCall className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-700">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-700">Since {selectedCustomer.joinDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Map className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-700">South Delhi branch</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 md:pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#492DBD] text-white py-2 md:py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center space-x-2">
                    <Coins className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-sm md:text-base">Add Points</span>
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <Gift className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-sm md:text-base">Assign Reward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Detail Modal - Responsive */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl w-full max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-3 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Reward Details</h3>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {/* Reward Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg md:text-2xl font-bold text-gray-900">{selectedReward.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs md:text-sm bg-[#492DBD] text-white rounded-full font-medium">
                        {selectedReward.category}
                      </span>
                      <span className="px-2 py-1 text-xs md:text-sm bg-green-100 text-green-800 rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">{selectedReward.pointsRequired.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Points Required</div>
                  </div>
                </div>

                {/* Reward Details */}
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Description</h5>
                    <p className="text-xs md:text-sm text-gray-700 bg-gray-50 p-3 md:p-4 rounded-lg">{selectedReward.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                      <div className="text-xs md:text-sm text-gray-600">Validity Period</div>
                      <div className="font-semibold text-gray-900 mt-1 text-sm md:text-base">{selectedReward.validity}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 md:p-4">
                      <div className="text-xs md:text-sm text-gray-600">Redemption Count</div>
                      <div className="font-semibold text-gray-900 mt-1 text-sm md:text-base">{selectedReward.redemptionCount} times</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 md:pt-6 border-t border-gray-200">
                  <button className="flex-1 bg-[#492DBD] text-white py-2 md:py-3 px-4 rounded-lg hover:bg-[#3a2199] transition-colors text-sm md:text-base">
                    Edit Reward
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base">
                    Assign to Customers
                  </button>
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 md:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
                    View Redemptions
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

export default CustomerLoyalty;