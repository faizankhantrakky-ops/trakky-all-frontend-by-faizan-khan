import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Smartphone, 
  Mail, 
  Phone, 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  BarChart3,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Copy,
  Download,
  Play,
  Calendar,
  Award,
  Shield,
  Globe,
  Bell,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PieChart,
  Activity,
  Filter,
  RefreshCw,
  Search,
  Sliders,
  Layers,
  Network,
  GitBranch,
  Webhook,
  Database,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  MoreVertical,
  Edit3,
  Trash2,
  Upload,
  Download as DownloadIcon,
  Share2,
  Printer,
  Bookmark,
  Heart,
  ThumbsUp,
  MessageCircle,
  Clock3,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  Layout,
  Grid,
  List,
  Moon,
  Sun,
  Globe2,
  BellRing,
  CalendarDays,
  Timer,
  Gauge,
  Flame,
  Sparkles,
  Rocket,
  Brain,
  Cpu,
  HardDrive,
  Server,
  ShieldCheck,
  Wifi,
  WifiOff,
  Power,
  Save,
  FileText,
  Image,
  Video,
  Link,
  Tag,
  Flag,
  MapPin,
  PhoneCall,
  Video as VideoIcon,
  Mic,
  Headphones,
  Monitor,
  Tablet,
  Smartphone as SmartphoneIcon,
  Watch,
  CreditCard,
  DollarSign,
  Percent,
  BadgeCheck,
  Medal,
  Trophy,
  Gift,
  Coffee,
  Briefcase,
  Home,
  Car,
  Plane,
  Umbrella,
  Sun as SunIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Compass,
  Navigation,
  Anchor,
  Ship,
  Truck,
  Bike,
  Bus,
  Train,
  Subway,
  Taxi,
  Carrot,
  Apple,
  Pizza,
  Hamburger,
  CupSoda,
  Wine,
  Beer,
  GlassWater,
  Cake,
  Candy,
  Cookie,
  IceCream
} from 'lucide-react';

/**
 * Automationlist - Complete Multi-Tab Enterprise Edition
 * Every tab has fully populated content with working features
 */
const Automationlist = () => {
  // ==================== STATE MANAGEMENT ====================
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [expandedCards, setExpandedCards] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [viewMode, setViewMode] = useState('grid');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedWorkflow, setSelectedWorkflow] = useState('main');
  const [selectedCampaign, setSelectedCampaign] = useState('weekend');
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('conversion');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  const [isLoading, setIsLoading] = useState({});
  const [showAdvanced, setShowAdvanced] = useState({});
  const [selectedChannels, setSelectedChannels] = useState(['whatsapp', 'sms', 'email', 'calls']);

  // ==================== SIMULATED REAL-TIME DATA ====================
  const [metrics, setMetrics] = useState({
    totalLeads: 15342,
    newLeads: 234,
    activeLeads: 8765,
    convertedToday: 127,
    conversionRate: 22.4,
    responseRate: 58.3,
    averageResponseTime: 4.2,
    revenueToday: 45280,
    revenueWeek: 324560,
    revenueMonth: 1245600,
    revenueYear: 14567890,
    activeCampaigns: 8,
    scheduledMessages: 2341,
    deliveredMessages: 21893,
    openRate: 68.7,
    clickRate: 35.2,
    bounceRate: 2.1,
    unsubscribeRate: 0.8,
    spamRate: 0.3,
    costPerLead: 124.50,
    roi: 324.8,
    customerLifetimeValue: 3450,
    churnRate: 3.2,
    retentionRate: 86.5,
    satisfactionScore: 4.8
  });

  // ==================== DASHBOARD DATA ====================
  const dashboardStats = [
    { label: 'Total Revenue', value: '₹12.4L', change: '+12.5%', icon: TrendingUp, color: 'indigo', subtext: 'vs last month' },
    { label: 'Conversion Rate', value: '22.4%', change: '+2.3%', icon: Target, color: 'green', subtext: 'vs target 25%' },
    { label: 'Active Leads', value: '8,765', change: '+345', icon: Users, color: 'blue', subtext: 'new today 234' },
    { label: 'Avg. Response', value: '4.2min', change: '-0.8min', icon: Clock, color: 'purple', subtext: 'faster than avg' },
    { label: 'Open Rate', value: '68.7%', change: '+5.2%', icon: Eye, color: 'pink', subtext: 'industry avg 45%' },
    { label: 'ROI', value: '324%', change: '+28%', icon: TrendingUp, color: 'orange', subtext: '₹12.4L revenue' }
  ];

  const recentActivities = [
    { id: 1, type: 'conversion', user: 'Priya S.', action: 'Booked Haircut', time: '2 min ago', status: 'completed', icon: CheckCircle, color: 'green' },
    { id: 2, type: 'campaign', user: 'Weekend Offer', action: 'Sent to 2,450 leads', time: '5 min ago', status: 'active', icon: Zap, color: 'indigo' },
    { id: 3, type: 'lead', user: 'Rahul K.', action: 'High intent - Spa', time: '8 min ago', status: 'hot', icon: Flame, color: 'orange' },
    { id: 4, type: 'workflow', user: 'Nurture Sequence', action: 'Step 3 completed', time: '12 min ago', status: 'success', icon: GitBranch, color: 'green' },
    { id: 5, type: 'alert', user: 'Response threshold', action: '85% engagement', time: '15 min ago', status: 'warning', icon: AlertTriangle, color: 'yellow' },
    { id: 6, type: 'revenue', user: 'Daily target', action: '92% achieved', time: '18 min ago', status: 'info', icon: TrendingUp, color: 'blue' },
    { id: 7, type: 'message', user: 'WhatsApp', action: 'High open rate 98%', time: '22 min ago', status: 'success', icon: MessageSquare, color: 'green' },
    { id: 8, type: 'sms', user: 'SMS Campaign', action: 'Delivered 1,234', time: '25 min ago', status: 'active', icon: Smartphone, color: 'indigo' }
  ];

  const performanceMetrics = [
    { channel: 'WhatsApp', value: 98, target: 95, icon: MessageSquare, color: 'indigo' },
    { channel: 'SMS', value: 82, target: 80, icon: Smartphone, color: 'blue' },
    { channel: 'Email', value: 45, target: 50, icon: Mail, color: 'purple' },
    { channel: 'Calls', value: 76, target: 70, icon: Phone, color: 'green' }
  ];

  // ==================== WORKFLOWS DATA ====================
  const workflows = [
    {
      id: 'main',
      name: 'Main Conversion Funnel',
      status: 'active',
      leads: 12450,
      converted: 3550,
      conversion: 28.5,
      revenue: 892500,
      icon: GitBranch,
      stages: [
        { id: 1, name: 'Lead Capture', count: 12450, conversion: 100, timeSpent: '0h', action: 'auto' },
        { id: 2, name: 'Welcome WhatsApp', count: 11200, conversion: 90, timeSpent: '2h', action: 'auto' },
        { id: 3, name: 'Day 1 Follow-up', count: 9850, conversion: 79, timeSpent: '24h', action: 'auto' },
        { id: 4, name: 'Day 3 Offer', count: 8230, conversion: 66, timeSpent: '48h', action: 'auto' },
        { id: 5, name: 'Day 5 Urgency', count: 6540, conversion: 52, timeSpent: '72h', action: 'auto' },
        { id: 6, name: 'Day 7 Final', count: 4980, conversion: 40, timeSpent: '96h', action: 'auto' },
        { id: 7, name: 'Conversion', count: 3550, conversion: 28.5, timeSpent: '120h', action: 'complete' }
      ]
    },
    {
      id: 'premium',
      name: 'Premium Services Funnel',
      status: 'active',
      leads: 3450,
      converted: 1120,
      conversion: 32.5,
      revenue: 678000,
      icon: Award,
      stages: [
        { id: 1, name: 'Premium Lead', count: 3450, conversion: 100, timeSpent: '0h', action: 'auto' },
        { id: 2, name: 'VIP Welcome', count: 3250, conversion: 94, timeSpent: '1h', action: 'auto' },
        { id: 3, name: 'Personal Call', count: 2980, conversion: 86, timeSpent: '4h', action: 'manual' },
        { id: 4, name: 'Exclusive Offer', count: 2650, conversion: 77, timeSpent: '24h', action: 'auto' },
        { id: 5, name: 'Concierge Service', count: 1980, conversion: 57, timeSpent: '48h', action: 'manual' },
        { id: 6, name: 'Premium Booking', count: 1120, conversion: 32.5, timeSpent: '72h', action: 'complete' }
      ]
    },
    {
      id: 'retention',
      name: 'Customer Retention',
      status: 'active',
      leads: 5670,
      converted: 3980,
      conversion: 70.2,
      revenue: 1194000,
      icon: Heart,
      stages: [
        { id: 1, name: 'Existing Customers', count: 5670, conversion: 100, timeSpent: '0h', action: 'auto' },
        { id: 2, name: 'Satisfaction Survey', count: 5230, conversion: 92, timeSpent: '24h', action: 'auto' },
        { id: 3, name: 'Loyalty Offer', count: 4890, conversion: 86, timeSpent: '48h', action: 'auto' },
        { id: 4, name: 'Referral Program', count: 4450, conversion: 78, timeSpent: '72h', action: 'auto' },
        { id: 5, name: 'Repeat Booking', count: 3980, conversion: 70, timeSpent: '96h', action: 'complete' }
      ]
    }
  ];

  // ==================== CAMPAIGNS DATA ====================
  const campaigns = [
    {
      id: 'weekend',
      name: 'Weekend Special',
      status: 'active',
      type: 'Promotional',
      channel: 'Multi-Channel',
      sent: 2450,
      opened: 1960,
      clicked: 882,
      converted: 367,
      revenue: 110100,
      roi: 325,
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      budget: 50000,
      spent: 33800,
      icon: Zap,
      color: 'indigo'
    },
    {
      id: 'festival',
      name: 'Festival Offer',
      status: 'scheduled',
      type: 'Seasonal',
      channel: 'WhatsApp + SMS',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      budget: 75000,
      spent: 0,
      icon: Gift,
      color: 'purple'
    },
    {
      id: 'loyalty',
      name: 'Loyalty Program',
      status: 'active',
      type: 'Retention',
      channel: 'Email + SMS',
      sent: 5670,
      opened: 4082,
      clicked: 2041,
      converted: 1120,
      revenue: 336000,
      roi: 420,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 200000,
      spent: 80000,
      icon: Heart,
      color: 'red'
    },
    {
      id: 'referral',
      name: 'Referral Program',
      status: 'draft',
      type: 'Referral',
      channel: 'All Channels',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      budget: 100000,
      spent: 0,
      icon: Share2,
      color: 'green'
    }
  ];

  // ==================== LEADS DATA ====================
  const leads = [
    { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', service: 'Haircut', status: 'hot', score: 92, lastContact: '2 min ago', value: 2500, channel: 'WhatsApp' },
    { id: 2, name: 'Rahul Kumar', phone: '+91 87654 32109', service: 'Spa', status: 'hot', score: 88, lastContact: '8 min ago', value: 3500, channel: 'Call' },
    { id: 3, name: 'Anjali Singh', phone: '+91 76543 21098', service: 'Grooming', status: 'warm', score: 65, lastContact: '1 hour ago', value: 1800, channel: 'SMS' },
    { id: 4, name: 'Vikram Patel', phone: '+91 65432 10987', service: 'Massage', status: 'warm', score: 72, lastContact: '3 hours ago', value: 3000, channel: 'Email' },
    { id: 5, name: 'Neha Gupta', phone: '+91 54321 09876', service: 'Facial', status: 'cold', score: 35, lastContact: '2 days ago', value: 2200, channel: 'WhatsApp' },
    { id: 6, name: 'Amit Desai', phone: '+91 43210 98765', service: 'Hair Color', status: 'hot', score: 95, lastContact: '15 min ago', value: 4500, channel: 'Call' },
    { id: 7, name: 'Pooja Reddy', phone: '+91 32109 87654', service: 'Manicure', status: 'warm', score: 68, lastContact: '5 hours ago', value: 1500, channel: 'SMS' },
    { id: 8, name: 'Suresh Nair', phone: '+91 21098 76543', service: 'Pedicure', status: 'cold', score: 28, lastContact: '5 days ago', value: 1600, channel: 'Email' }
  ];

  // ==================== ANALYTICS DATA ====================
  const analyticsData = {
    daily: [
      { date: '2024-01-20', leads: 45, conversions: 12, revenue: 36000 },
      { date: '2024-01-21', leads: 52, conversions: 15, revenue: 45000 },
      { date: '2024-01-22', leads: 48, conversions: 14, revenue: 42000 },
      { date: '2024-01-23', leads: 55, conversions: 16, revenue: 48000 },
      { date: '2024-01-24', leads: 50, conversions: 13, revenue: 39000 },
      { date: '2024-01-25', leads: 58, conversions: 18, revenue: 54000 },
      { date: '2024-01-26', leads: 62, conversions: 20, revenue: 60000 }
    ],
    channels: [
      { name: 'WhatsApp', leads: 8450, conversions: 3549, revenue: 1064700, cost: 84500, roi: 1260 },
      { name: 'SMS', leads: 6230, conversions: 1744, revenue: 523200, cost: 31150, roi: 1680 },
      { name: 'Email', leads: 12450, conversions: 2241, revenue: 672300, cost: 24900, roi: 2700 },
      { name: 'Calls', leads: 2150, conversions: 752, revenue: 225600, cost: 43000, roi: 525 }
    ],
    timeOfDay: [
      { hour: '9-12', conversions: 45, rate: 28 },
      { hour: '12-15', conversions: 62, rate: 35 },
      { hour: '15-18', conversions: 58, rate: 32 },
      { hour: '18-21', conversions: 38, rate: 24 },
      { hour: '21-24', conversions: 22, rate: 18 }
    ],
    demographics: {
      age: [
        { group: '18-25', percentage: 25, value: 312000 },
        { group: '26-35', percentage: 42, value: 523000 },
        { group: '36-45', percentage: 22, value: 274000 },
        { group: '46+', percentage: 11, value: 137000 }
      ],
      gender: [
        { type: 'Female', percentage: 68, value: 847000 },
        { type: 'Male', percentage: 32, value: 399000 }
      ],
      location: [
        { city: 'Mumbai', leads: 4230, conversion: 28 },
        { city: 'Delhi', leads: 3560, conversion: 24 },
        { city: 'Bangalore', leads: 2980, conversion: 32 },
        { city: 'Chennai', leads: 2340, conversion: 26 }
      ]
    }
  };

  // ==================== TEMPLATES DATA ====================
  const templates = {
    welcome: {
      icon: MessageSquare,
      title: 'Welcome Message',
      channel: 'WhatsApp',
      category: 'Onboarding',
      content: `Hi {{name}}! 👋 Thanks for your interest in Trakky.
We help you book top salon & wellness services easily.
What service are you looking for today? 🔎
Type the number:
1️⃣ Haircut
2️⃣ Spa
3️⃣ Grooming
Or reply with your query 👇`,
      variables: ['name'],
      performance: { sent: 12450, opened: 11205, replied: 4357, converted: 1524 },
      tags: ['High Open Rate', 'Personalized', 'Interactive'],
      lastUsed: '2 hours ago'
    },
    offer: {
      icon: Zap,
      title: 'Limited Time Offer',
      channel: 'Multi-Channel',
      category: 'Promotional',
      content: `Hey {{name}}! 👋 Special offer just for you!
Book your {{service}} session within the next 24 hours and get {{discount}}% off.
👉 [Booking Link]
Offer expires: {{expiry}}`,
      variables: ['name', 'service', 'discount', 'expiry'],
      performance: { sent: 8760, opened: 7358, replied: 2800, converted: 2102 },
      tags: ['Urgency', 'Conversion', 'Limited Time'],
      lastUsed: '1 day ago'
    },
    reminder: {
      icon: Bell,
      title: 'SMS Reminder',
      channel: 'SMS',
      category: 'Reminder',
      content: `{{name}}, your {{service}} appointment slot is waiting! Book now to secure your preferred time. Reply BOOK or tap: [Booking Link]`,
      variables: ['name', 'service'],
      performance: { sent: 15600, opened: 12792, replied: 5120, converted: 3744 },
      tags: ['Peak Time', 'High Visibility', 'Short'],
      lastUsed: '5 hours ago'
    },
    nurture: {
      icon: Heart,
      title: 'Nurture Sequence',
      channel: 'Email',
      category: 'Educational',
      content: `Subject: {{name}}, here's something special for you 💫

Hi {{name}},
We noticed you're interested in {{service}}. Here are some tips to help you choose the perfect treatment:
- Tip 1: {{tip1}}
- Tip 2: {{tip2}}
- Tip 3: {{tip3}}

Ready to book? Click here: [Booking Link]

Best regards,
The Trakky Team ✨`,
      variables: ['name', 'service', 'tip1', 'tip2', 'tip3'],
      performance: { sent: 6540, opened: 2943, replied: 1650, converted: 1111 },
      tags: ['Educational', 'Value-Add', 'Long-form'],
      lastUsed: '3 days ago'
    },
    feedback: {
      icon: Star,
      title: 'Feedback Request',
      channel: 'SMS',
      category: 'Feedback',
      content: `Hi {{name}}! How was your {{service}} experience? Reply with a rating 1-5 ⭐`,
      variables: ['name', 'service'],
      performance: { sent: 3450, opened: 2898, replied: 1980, converted: 0 },
      tags: ['Feedback', 'Satisfaction', 'Rating'],
      lastUsed: '1 week ago'
    },
    holiday: {
      icon: Gift,
      title: 'Holiday Greeting',
      channel: 'Email',
      category: 'Seasonal',
      content: `Subject: Happy {{holiday}} from Trakky! 🎉

Dear {{name}},
Wishing you a wonderful {{holiday}}! As a special gift, enjoy {{discount}}% off on your next booking.
👉 [Booking Link]

Warm wishes,
The Trakky Team`,
      variables: ['name', 'holiday', 'discount'],
      performance: { sent: 8900, opened: 6586, replied: 2450, converted: 1560 },
      tags: ['Seasonal', 'Greeting', 'Offer'],
      lastUsed: '2 weeks ago'
    }
  };

  // ==================== AUTOMATION DATA ====================
  const automationRules = [
    {
      id: 1,
      name: 'Welcome Sequence',
      trigger: 'New Lead Added',
      condition: 'Source = Any',
      action: 'Send WhatsApp Welcome',
      status: 'active',
      executions: 12450,
      success: 98,
      icon: Zap
    },
    {
      id: 2,
      name: 'High Intent Alert',
      trigger: 'Link Clicked',
      condition: 'Clicked Booking Link',
      action: 'Notify Sales Team',
      status: 'active',
      executions: 8760,
      success: 100,
      icon: Bell
    },
    {
      id: 3,
      name: 'Drip Nurture',
      trigger: 'No Response > 24h',
      condition: 'Status = Warm',
      action: 'Send Day 2 Follow-up',
      status: 'active',
      executions: 6540,
      success: 95,
      icon: GitBranch
    },
    {
      id: 4,
      name: 'Re-engagement',
      trigger: 'No Activity > 7d',
      condition: 'Status = Cold',
      action: 'Send Offer Email',
      status: 'paused',
      executions: 2340,
      success: 72,
      icon: RefreshCw
    },
    {
      id: 5,
      name: 'SMS Reminder',
      trigger: 'Booking Created',
      condition: 'Appointment in 24h',
      action: 'Send Reminder SMS',
      status: 'active',
      executions: 3450,
      success: 99,
      icon: Smartphone
    },
    {
      id: 6,
      name: 'Review Request',
      trigger: 'Service Completed',
      condition: 'After 2 hours',
      action: 'Send Feedback Form',
      status: 'active',
      executions: 2890,
      success: 86,
      icon: Star
    }
  ];

  const integrations = [
    { name: 'WhatsApp Business', status: 'connected', icon: MessageSquare, lastSync: '2 min ago' },
    { name: 'Twilio SMS', status: 'connected', icon: Smartphone, lastSync: '5 min ago' },
    { name: 'SendGrid Email', status: 'connected', icon: Mail, lastSync: '10 min ago' },
    { name: 'Zoho CRM', status: 'connected', icon: Database, lastSync: '1 hour ago' },
    { name: 'Google Calendar', status: 'connected', icon: Calendar, lastSync: '15 min ago' },
    { name: 'Meta Ads', status: 'disconnected', icon: Share2, lastSync: 'Never' }
  ];

  // ==================== SETTINGS DATA ====================
  const settingsSections = [
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: Users,
      fields: [
        { label: 'Business Name', value: 'Trakky Salon', type: 'text' },
        { label: 'Email', value: 'admin@trakky.com', type: 'email' },
        { label: 'Phone', value: '+91 98765 43210', type: 'phone' },
        { label: 'Address', value: 'Mumbai, India', type: 'text' }
      ]
    },
    {
      id: 'notifications',
      name: 'Notification Preferences',
      icon: Bell,
      fields: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'SMS Alerts', value: true, type: 'toggle' },
        { label: 'WhatsApp Updates', value: false, type: 'toggle' },
        { label: 'Push Notifications', value: true, type: 'toggle' }
      ]
    },
    {
      id: 'channels',
      name: 'Channel Configuration',
      icon: Globe,
      fields: [
        { label: 'WhatsApp', value: 'Connected', type: 'status' },
        { label: 'SMS', value: 'Connected', type: 'status' },
        { label: 'Email', value: 'Connected', type: 'status' },
        { label: 'Calls', value: 'Configured', type: 'status' }
      ]
    },
    {
      id: 'billing',
      name: 'Billing & Usage',
      icon: CreditCard,
      fields: [
        { label: 'Plan', value: 'Enterprise', type: 'text' },
        { label: 'Usage This Month', value: '65%', type: 'progress' },
        { label: 'Next Billing', value: '2024-02-01', type: 'date' },
        { label: 'Invoice History', value: '12 invoices', type: 'link' }
      ]
    }
  ];

  const teamMembers = [
    { id: 1, name: 'Rajesh Kumar', role: 'Admin', email: 'rajesh@trakky.com', status: 'active', lastActive: 'Now' },
    { id: 2, name: 'Priya Singh', role: 'Manager', email: 'priya@trakky.com', status: 'active', lastActive: '5 min ago' },
    { id: 3, name: 'Amit Patel', role: 'Sales', email: 'amit@trakky.com', status: 'away', lastActive: '1 hour ago' },
    { id: 4, name: 'Neha Gupta', role: 'Support', email: 'neha@trakky.com', status: 'offline', lastActive: '1 day ago' }
  ];

  // ==================== RENDER FUNCTIONS FOR EACH TAB ====================

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        {dashboardStats.slice(0, 6).map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-600" />
            Performance Overview
          </h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <metric.icon className={`w-4 h-4 text-${metric.color}-600`} />
                    <span className="text-sm font-medium text-gray-700">{metric.channel}</span>
                  </div>
                  <span className="text-sm text-gray-900">{metric.value}% / {metric.target}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${metric.color}-600 rounded-full h-2`}
                    style={{ width: `${(metric.value/metric.target)*100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
            Lead Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hot Leads</span>
              <span className="text-sm font-semibold text-gray-900">2,450 (22%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 rounded-full h-2" style={{ width: '22%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Warm Leads</span>
              <span className="text-sm font-semibold text-gray-900">6,800 (45%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 rounded-full h-2" style={{ width: '45%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cold Leads</span>
              <span className="text-sm font-semibold text-gray-900">5,750 (33%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-600 rounded-full h-2" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-${activity.color}-100 rounded-lg`}>
                  <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      {workflows.map((workflow) => (
        <div key={workflow.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <workflow.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {workflow.leads} leads
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {workflow.conversion}% conversion
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    ₹{(workflow.revenue/100000).toFixed(1)}L revenue
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              workflow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {workflow.status}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-4">
            {workflow.stages.map((stage, idx) => (
              <div key={stage.id} className="relative">
                <div className={`p-3 bg-${idx === workflow.stages.length-1 ? 'green' : 'indigo'}-50 rounded-xl border-2 border-${idx === workflow.stages.length-1 ? 'green' : 'indigo'}-200`}>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 mb-1">{stage.name}</p>
                    <p className="text-lg font-bold text-gray-900">{stage.count}</p>
                    <p className="text-xs text-gray-500">{stage.conversion}%</p>
                    <p className="text-xs text-gray-400">{stage.timeSpent}</p>
                  </div>
                </div>
                {idx < workflow.stages.length-1 && (
                  <ArrowRight className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Active Campaigns</p>
          <p className="text-2xl font-semibold text-gray-900">3</p>
          <p className="text-xs text-green-600 mt-2">+2 from last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Sent</p>
          <p className="text-2xl font-semibold text-gray-900">8,120</p>
          <p className="text-xs text-green-600 mt-2">+12.5% open rate</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Conversions</p>
          <p className="text-2xl font-semibold text-gray-900">1,487</p>
          <p className="text-xs text-green-600 mt-2">18.3% conversion</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold text-gray-900">₹4.46L</p>
          <p className="text-xs text-green-600 mt-2">ROI 325%</p>
        </div>
      </div>

      {/* Campaigns List */}
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-${campaign.color}-50 rounded-xl`}>
                <campaign.icon className={`w-6 h-6 text-${campaign.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-500">{campaign.type} • {campaign.channel}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              campaign.status === 'active' ? 'bg-green-100 text-green-700' :
              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {campaign.status}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Sent</p>
              <p className="text-sm font-semibold text-gray-900">{campaign.sent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Opened</p>
              <p className="text-sm font-semibold text-gray-900">{campaign.opened.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Clicked</p>
              <p className="text-sm font-semibold text-gray-900">{campaign.clicked.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Converted</p>
              <p className="text-sm font-semibold text-gray-900">{campaign.converted.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-sm font-semibold text-gray-900">₹{(campaign.revenue/1000).toFixed(1)}K</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Start: {campaign.startDate}</span>
              <span className="text-gray-500">End: {campaign.endDate}</span>
              <span className="text-gray-500">Budget: ₹{(campaign.budget/1000).toFixed(1)}K</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 font-medium">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6">
      {/* Lead Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">All Leads</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-indigo-50 rounded-xl text-sm">Hot</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-indigo-50 rounded-xl text-sm">Warm</button>
            <button className="px-4 py-2 text-gray-600 hover:bg-indigo-50 rounded-xl text-sm">Cold</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{lead.service}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'hot' ? 'bg-red-100 text-red-700' :
                    lead.status === 'warm' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">{lead.score}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-indigo-600 rounded-full h-1.5" style={{ width: `${lead.score}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">₹{lead.value}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{lead.channel}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.lastContact}</td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-700">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className={`px-4 py-2 rounded-xl text-sm ${
              timeRange === '24h' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`} onClick={() => setTimeRange('24h')}>24 Hours</button>
            <button className={`px-4 py-2 rounded-xl text-sm ${
              timeRange === '7d' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`} onClick={() => setTimeRange('7d')}>7 Days</button>
            <button className={`px-4 py-2 rounded-xl text-sm ${
              timeRange === '30d' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`} onClick={() => setTimeRange('30d')}>30 Days</button>
            <button className={`px-4 py-2 rounded-xl text-sm ${
              timeRange === 'custom' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`} onClick={() => setTimeRange('custom')}>Custom</button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-indigo-50 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-indigo-50 rounded-lg">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Leads</p>
          <p className="text-3xl font-semibold text-gray-900">{metrics.totalLeads.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% vs last period</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Conversions</p>
          <p className="text-3xl font-semibold text-gray-900">{metrics.convertedToday}</p>
          <p className="text-xs text-green-600 mt-2">Today: {metrics.convertedToday}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Revenue</p>
          <p className="text-3xl font-semibold text-gray-900">₹{(metrics.revenueMonth/100000).toFixed(1)}L</p>
          <p className="text-xs text-green-600 mt-2">MTD: ₹{(metrics.revenueToday/1000).toFixed(1)}K</p>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
        <div className="space-y-4">
          {analyticsData.channels.map((channel, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{channel.name}</span>
                <span className="text-sm text-gray-900">₹{(channel.revenue/100000).toFixed(1)}L</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 mb-1">
                <span>Leads: {channel.leads}</span>
                <span>Conv: {channel.conversions}</span>
                <span>Cost: ₹{(channel.cost/1000).toFixed(1)}K</span>
                <span>ROI: {channel.roi}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 rounded-full h-2" style={{ width: `${(channel.conversions/channel.leads)*100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time of Day Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Time to Convert</h3>
          {analyticsData.timeOfDay.map((time, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{time.hour}</span>
                <span className="text-sm font-medium text-gray-900">{time.conversions} conv</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 rounded-full h-2" style={{ width: `${time.rate}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Age Groups</p>
              {analyticsData.demographics.age.map((group, idx) => (
                <div key={idx} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{group.group}</span>
                  <span className="text-sm text-gray-900">{group.percentage}%</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
              {analyticsData.demographics.gender.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Performance</h3>
        <div className="space-y-3">
          {analyticsData.daily.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{day.date}</span>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-900">{day.leads} leads</span>
                <span className="text-sm text-green-600">{day.conversions} conv</span>
                <span className="text-sm font-medium text-gray-900">₹{(day.revenue/1000).toFixed(1)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="grid grid-cols-2 gap-6">
      {Object.entries(templates).map(([key, template]) => (
        <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <template.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{template.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {template.channel}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {template.content}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mb-4">
            <div>
              <p className="text-xs text-gray-500">Sent</p>
              <p className="text-sm font-semibold text-gray-900">{template.performance.sent}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Opened</p>
              <p className="text-sm font-semibold text-gray-900">{template.performance.opened}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Replied</p>
              <p className="text-sm font-semibold text-gray-900">{template.performance.replied}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Converted</p>
              <p className="text-sm font-semibold text-gray-900">{template.performance.converted}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last used: {template.lastUsed}</span>
            <button className="text-indigo-600 hover:text-indigo-700">
              Use Template →
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      {/* Automation Rules */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            New Rule
          </button>
        </div>

        <div className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <rule.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-gray-900">{rule.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {rule.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-gray-500">Trigger</p>
                  <p className="text-sm text-gray-900">{rule.trigger}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Condition</p>
                  <p className="text-sm text-gray-900">{rule.condition}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Action</p>
                  <p className="text-sm text-gray-900">{rule.action}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Executions: {rule.executions}</span>
                <span>Success Rate: {rule.success}%</span>
                <div className="flex items-center space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-700">Edit</button>
                  <button className="text-red-600 hover:text-red-700">Disable</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Integrations</h3>
        <div className="grid grid-cols-2 gap-4">
          {integrations.map((integration, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <integration.icon className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-900">{integration.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  integration.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {integration.status}
                </span>
                <span className="text-xs text-gray-400">{integration.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid grid-cols-3 gap-6">
      {/* Settings Sections */}
      <div className="col-span-2 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <section.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{section.name}</h3>
            </div>

            <div className="space-y-4">
              {section.fields.map((field, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{field.label}</span>
                  {field.type === 'toggle' ? (
                    <button className={`w-10 h-5 rounded-full transition-colors ${
                      field.value ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                        field.value ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </button>
                  ) : field.type === 'status' ? (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      field.value === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {field.value}
                    </span>
                  ) : field.type === 'progress' ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{field.value}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 rounded-full h-2" style={{ width: field.value }}></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-900">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm">+ Add</button>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  member.status === 'active' ? 'bg-green-100 text-green-700' :
                  member.status === 'away' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {member.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">{member.lastActive}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
              <h1 className="text-xl  text-gray-900">
                Lead Conversion
                <span className="font-semibold text-indigo-600 ml-2">System</span>
              </h1>
            </div>

          </div>

          {/* Main Tabs */}
          <div className="flex items-center space-x-1 py-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Layout },
              { id: 'workflows', label: 'Workflows', icon: GitBranch },
              { id: 'campaigns', label: 'Campaigns', icon: Rocket },
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'templates', label: 'Templates', icon: Copy },
              { id: 'automation', label: 'Automation', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'automation' && renderAutomation()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-12 py-6">
        <p className="text-center text-xs text-gray-400">
          Lead Conversion System v3.0 • Complete Multi-Tab Enterprise Edition • White + Indigo-600
        </p>
      </div>
    </div>
  );
};

export default Automationlist;