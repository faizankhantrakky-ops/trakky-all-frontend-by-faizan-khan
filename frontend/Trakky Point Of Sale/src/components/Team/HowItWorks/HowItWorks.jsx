import React, { useState } from "react";
import {
  Calendar,
  Users,
  Scissors,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Home,
  ShoppingBag,
  Menu as MenuIcon,
  Heart,
  User,
  IndianRupee,
  Shield,
  BarChart3,
  Search,
  Grid,
  Bookmark,
  Star,
  Clock,
  CheckCircle,
  Settings,
  FileText,
  Bell,
  Gift,
  Package,
  Tag,
  Truck,
  TrendingUp,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  Lock,
  Eye,
  Edit,
  Delete,
  Plus,
  Minus,
  Download,
  Upload,
  Printer,
  Camera,
  Video,
  Music,
  Coffee,
  MoreHorizontal,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  Check,
  Menu,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  DownloadCloud,
  UploadCloud,
  Cloud,
  CloudOff,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Sun as SunIcon,
  Moon as MoonIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Award as AwardIcon,
  Gift as GiftIcon,
  Package as PackageIcon,
  Truck as TruckIcon,
  Tag as TagIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  X as XIcon,
  Check as CheckIcon,
  Menu as MenuIcon2,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  Bell as BellIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Printer as PrinterIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Coffee as CoffeeIcon,
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedSteps, setBookmarkedSteps] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Dashboard & Overview",
      icon: Home,
      category: "overview",
      popular: true,
      description: [
        "Once the user logs into the system, the dashboard is displayed as the main control panel.",
        "The dashboard shows today's appointments, upcoming bookings, and pending actions.",
        "Revenue summaries are automatically calculated and displayed in real time.",
        "Key performance indicators help track overall business health instantly.",
        "Notifications and alerts highlight important updates and reminders.",
      ],
      stats: {
        users: "10K+",
        rating: "4.8",
        timeSaved: "15hrs/week",
      },
    },
    {
      id: 2,
      title: "Appointment Booking",
      icon: Calendar,
      category: "booking",
      popular: true,
      description: [
        "A new appointment is created by selecting the client or adding a new one.",
        "The desired service is selected, and available time slots are shown automatically.",
        "Staff availability is checked before assigning the appointment.",
        "Once confirmed, the appointment is saved in the system calendar.",
        "Automatic reminders are sent to both the client and staff.",
      ],
      stats: {
        users: "8K+",
        rating: "4.9",
        timeSaved: "10hrs/week",
      },
    },
    {
      id: 3,
      title: "Customer Management",
      icon: Users,
      category: "customers",
      popular: true,
      description: [
        "Client profiles are created with basic personal and contact details.",
        "Each visit and service is automatically added to the client's history.",
        "Preferences and special notes are stored for personalized service.",
        "All communication and visit records remain accessible at any time.",
        "Repeat clients can be quickly identified and managed efficiently.",
      ],
      stats: {
        users: "12K+",
        rating: "4.7",
        timeSaved: "12hrs/week",
      },
    },
    {
      id: 4,
      title: "Services Management",
      icon: Scissors,
      category: "services",
      description: [
        "Services are added to the system with name, duration, and pricing.",
        "Each service can be edited or updated whenever required.",
        "Service duration helps the system calculate available time slots.",
        "Multiple services can be grouped into packages.",
        "Changes are reflected instantly across booking and billing.",
      ],
      stats: {
        users: "7K+",
        rating: "4.6",
        timeSaved: "8hrs/week",
      },
    },
    {
      id: 5,
      title: "Product Management",
      icon: ShoppingBag,
      category: "products",
      popular: true,
      description: [
        "Products are added with quantity, cost, and selling price.",
        "The system automatically tracks stock levels after each sale.",
        "Low stock alerts notify staff when replenishment is needed.",
        "Supplier details are maintained for easy reordering.",
        "Product sales are linked with billing and reports.",
      ],
      stats: {
        users: "6K+",
        rating: "4.5",
        timeSaved: "20hrs/week",
      },
    },
    {
      id: 6,
      title: "Menu Management",
      icon: MenuIcon,
      category: "menu",
      description: [
        "Services are organized into clear and structured categories.",
        "Menu details such as pricing and duration are defined.",
        "Different pricing tiers can be created for selected services.",
        "Packages and combo offers are configured from the menu.",
        "The updated menu is used across booking and billing.",
      ],
      stats: {
        users: "5K+",
        rating: "4.8",
        timeSaved: "6hrs/week",
      },
    },
    {
      id: 7,
      title: "Customer Loyalty",
      icon: Heart,
      category: "loyalty",
      popular: true,
      description: [
        "Loyalty programs are configured based on visits or spending.",
        "Points are automatically added after each completed service.",
        "Customers can redeem rewards during billing.",
        "Membership levels provide additional benefits.",
        "Promotions help increase repeat visits and retention.",
      ],
      stats: {
        users: "9K+",
        rating: "4.9",
        retention: "+45%",
      },
    },
    {
      id: 8,
      title: "Staff Management",
      icon: User,
      category: "staff",
      description: [
        "Staff members are added with roles and permissions.",
        "Working schedules are assigned for each staff member.",
        "Appointments are linked to staff automatically.",
        "Performance is tracked based on services completed.",
        "Commissions and attendance records are maintained.",
      ],
      stats: {
        users: "7K+",
        rating: "4.7",
        efficiency: "+35%",
      },
    },
    {
      id: 9,
      title: "Payment Processing",
      icon: CreditCard,
      category: "payments",
      description: [
        "Bills are generated automatically after service completion.",
        "Multiple payment options are available for customer convenience.",
        "Payments are securely recorded in the system.",
        "Digital invoices and receipts are generated instantly.",
        "Tax calculations are applied as per configured rules.",
      ],
      stats: {
        users: "11K+",
        rating: "4.8",
        speed: "2sec",
      },
    },
    {
      id: 10,
      title: "Daily Expenses",
      icon: IndianRupee,
      category: "finance",
      description: [
        "Daily expenses are entered with category and amount.",
        "Supporting receipts can be attached for records.",
        "Supplier and miscellaneous payments are logged.",
        "Expenses are automatically included in financial reports.",
        "Budget tracking helps control operational costs.",
      ],
      stats: {
        users: "6K+",
        rating: "4.6",
        savings: "+25%",
      },
    },
    {
      id: 11,
      title: "Permissions & Access",
      icon: Shield,
      category: "security",
      popular: true,
      description: [
        "User roles are defined based on responsibilities.",
        "Each role is assigned specific access permissions.",
        "Sensitive data is protected through restricted access.",
        "Admin users can modify permissions anytime.",
        "System activity is logged for security audits.",
      ],
      stats: {
        users: "8K+",
        rating: "4.9",
        security: "256-bit",
      },
    },
    {
      id: 12,
      title: "Reports & Analytics",
      icon: BarChart3,
      category: "analytics",
      description: [
        "Reports are generated automatically from system data.",
        "Sales and revenue trends are analyzed over time.",
        "Staff and service performance is evaluated.",
        "Client behavior and visit patterns are identified.",
        "Financial statements help with business decisions.",
      ],
      stats: {
        users: "10K+",
        rating: "4.8",
        insights: "Real-time",
      },
    },
  ];

  const categories = [
    { id: "all", name: "All Features", icon: Grid, count: steps.length },
    { id: "overview", name: "Overview", icon: Home, count: 1 },
    { id: "booking", name: "Booking", icon: Calendar, count: 1 },
    { id: "customers", name: "Customers", icon: Users, count: 1 },
    { id: "services", name: "Services", icon: Scissors, count: 1 },
    { id: "products", name: "Products", icon: ShoppingBag, count: 1 },
    { id: "menu", name: "Menu", icon: MenuIcon, count: 1 },
    { id: "loyalty", name: "Loyalty", icon: Heart, count: 1 },
    { id: "staff", name: "Staff", icon: User, count: 1 },
    { id: "payments", name: "Payments", icon: CreditCard, count: 1 },
    { id: "finance", name: "Finance", icon: IndianRupee, count: 1 },
    { id: "security", name: "Security", icon: Shield, count: 1 },
    { id: "analytics", name: "Analytics", icon: BarChart3, count: 1 },
  ];

  // Filter steps based on search and category
  const filteredSteps = steps.filter((step) => {
    const matchesSearch = searchTerm === "" || 
      step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.some(desc => desc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || step.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get bookmarked steps
  const bookmarkedStepsList = steps.filter(step => bookmarkedSteps.includes(step.id));

  const toggleBookmark = (stepId) => {
    setBookmarkedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getCurrentIcon = () => {
    const IconComponent = steps[activeTab].icon;
    return <IconComponent size={20} />;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className=" mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                How It Works
              </h1>
              <p className="text-gray-600 mt-1">
                Streamline your salon operations with our comprehensive management system
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Search"
              >
                <Search size={18} className="text-gray-600" />
              </button>
              
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className={`p-2 border rounded-lg ${
                  showBookmarks 
                    ? "border-yellow-500 bg-yellow-50" 
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                title="Bookmarks"
              >
                <Bookmark size={18} className={showBookmarks ? "text-yellow-600" : "text-gray-600"} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A2DBE] focus:border-transparent"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                    isActive
                      ? "bg-[#4A2DBE] border-[#4A2DBE] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-[#4A2DBE]" : "bg-gray-200"
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookmarks Bar */}
        {showBookmarks && bookmarkedStepsList.length > 0 && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Bookmarked Features</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmarkedStepsList.map((step) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(steps.findIndex(s => s.id === step.id))}
                    className="flex items-center gap-1 px-2 py-1 bg-white border border-yellow-300 rounded-md text-sm hover:bg-yellow-100"
                  >
                    <Icon size={14} />
                    {step.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Features List */}
          <div className="lg:w-1/3">
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Grid size={18} className="text-[#4A2DBE]" />
                    Features
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredSteps.length} of {steps.length}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredSteps.length > 0 ? (
                  filteredSteps.map((step) => {
                    const originalIndex = steps.findIndex(s => s.id === step.id);
                    const isActive = originalIndex === activeTab;
                    const isBookmarked = bookmarkedSteps.includes(step.id);
                    const Icon = step.icon;
                    
                    return (
                      <div
                        key={step.id}
                        onClick={() => setActiveTab(originalIndex)}
                        className={`px-4 py-3 cursor-pointer ${
                          isActive ? "bg-indigo-50 border-l-4 border-l-[#4A2DBE]" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            isActive ? "bg-[#4A2DBE] text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            <Icon size={18} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`text-sm font-medium ${
                                isActive ? "text-[#4A2DBE]" : "text-gray-900"
                              }`}>
                                {step.title}
                              </h3>
                              {step.popular && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-0.5">
                                  <Star size={10} />
                                  Popular
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {step.description[0]}
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(step.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Bookmark 
                              size={14} 
                              className={isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-gray-400"} 
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No features found</p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="mt-2 text-[#4A2DBE] text-sm hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Feature Details */}
          <div className="lg:w-2/3">
            <div className="border border-gray-200 rounded-lg bg-white">
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#4A2DBE] text-white rounded-lg">
                    {getCurrentIcon()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">
                        Step {steps[activeTab].id}
                      </span>
                      <span className="text-gray-300">/</span>
                      <span className="text-gray-500">
                        {steps.length}
                      </span>
                      {steps[activeTab].popular && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                          <Star size={10} />
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {steps[activeTab].title}
                    </h2>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-[#4A2DBE]">
                        {steps[activeTab].stats.users}
                      </div>
                      <div className="text-xs text-gray-500">Users</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <div className="text-sm font-bold text-yellow-600 flex items-center gap-0.5">
                        <Star size={12} />
                        {steps[activeTab].stats.rating}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#4A2DBE] rounded-full" />
                    How it works
                  </h3>
                  
                  <div className="space-y-3">
                    {steps[activeTab].description.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 bg-[#4A2DBE] text-white text-xs rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
                        disabled={activeTab === 0}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ArrowLeft size={16} />
                        <span className="text-sm hidden sm:inline">Previous</span>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab(prev => Math.min(steps.length - 1, prev + 1))}
                        disabled={activeTab === steps.length - 1}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <span className="text-sm hidden sm:inline">Next</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      {activeTab + 1} of {steps.length}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                        <Download size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add line-clamp utility */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks;