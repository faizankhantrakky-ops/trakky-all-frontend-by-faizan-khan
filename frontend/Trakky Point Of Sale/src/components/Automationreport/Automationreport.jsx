import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Calendar, 
  MessageCircle, 
  CheckCircle, 
  Settings,
  Users,
  IndianRupee,
  BarChart3,
  FileText,
  Bell,
  Smartphone,
  Mail,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  X,
  Info,
  Activity,
  AlertCircle,
  Download,
  Send,
  CreditCard
} from 'lucide-react';

const Automationreport = () => {
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: "Daily Sales Summary",
      description: "Automatically sends daily sales performance report",
      trigger: "daily",
      time: "21:00",
      days: [],
      recipients: ["+91 91234 56789"],
      reports: ["sales-summary", "payment-report"],
      status: "active",
      lastSent: "2024-02-20 21:00",
      nextSchedule: "2024-02-21 21:00",
      createdAt: "2024-01-15",
      successRate: 98,
      totalSent: 36
    },
    {
      id: 2,
      name: "Weekly Revenue Overview",
      description: "Weekly revenue and profit analytics report",
      trigger: "weekly",
      time: "10:30",
      days: ["Monday"],
      recipients: ["+91 99887 66554", "+91 90123 45678"],
      reports: ["revenue-report", "expense-report"],
      status: "active",
      lastSent: "2024-02-19 10:30",
      nextSchedule: "2024-02-26 10:30",
      createdAt: "2024-01-10",
      successRate: 100,
      totalSent: 5
    },
    {
      id: 3,
      name: "Month-End Inventory Audit",
      description: "Detailed month-end stock and inventory audit report",
      trigger: "monthly",
      time: "17:00",
      days: ["Last"],
      recipients: ["+91 90909 80808"],
      reports: ["inventory", "low-stock-alert"],
      status: "inactive",
      lastSent: "2024-01-31 17:00",
      nextSchedule: "2024-02-29 17:00",
      createdAt: "2024-01-05",
      successRate: 95,
      totalSent: 1
    }
  ]);

  const [selectedRule, setSelectedRule] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    trigger: "salon-close",
    time: "21:00",
    days: [],
    recipients: [""],
    reports: []
  });

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const TypesOfreports = [
    { id: "sales-summary", name: "Sales Report", description: "Daily sales and transactions", icon: BarChart3 },
    { id: "appointments", name: "Appointments", description: "Bookings and cancellations", icon: Calendar },
    { id: "revenue-report", name: "Revenue Summary", description: "Income and expense breakdown", icon: IndianRupee },
    { id: "staff-performance", name: "Staff Performance", description: "Employee productivity metrics", icon: Users },
    { id: "inventory", name: "Inventory Status", description: "Stock levels and alerts", icon: FileText },
    { id: "expense-report", name: "Daily Expenses", description: "Operational costs", icon: IndianRupee },
    { id: "payment-report", name: "Payment Report", description: "Transaction and payment details", icon: CreditCard },
    { id: "low-stock-alert", name: "Low Stock Alert", description: "Products below threshold", icon: AlertCircle }
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // View rule details
  const viewRuleDetails = (rule) => {
    setSelectedRule(rule);
    setShowViewModal(true);
  };

  const toggleRuleStatus = (id) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === id 
          ? { ...rule, status: rule.status === "active" ? "inactive" : "active" }
          : rule
      )
    );
  };

  const addNewRecipient = () => {
    setNewRule(prev => ({
      ...prev,
      recipients: [...prev.recipients, ""]
    }));
  };

  const updateRecipient = (index, value) => {
    const updatedRecipients = [...newRule.recipients];
    updatedRecipients[index] = value;
    setNewRule(prev => ({
      ...prev,
      recipients: updatedRecipients
    }));
  };

  const removeRecipient = (index) => {
    const updatedRecipients = newRule.recipients.filter((_, i) => i !== index);
    setNewRule(prev => ({
      ...prev,
      recipients: updatedRecipients
    }));
  };

  const toggleReport = (reportId) => {
    setNewRule(prev => ({
      ...prev,
      reports: prev.reports.includes(reportId)
        ? prev.reports.filter(id => id !== reportId)
        : [...prev.reports, reportId]
    }));
  };

  const toggleDay = (day) => {
    setNewRule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const createNewRule = () => {
    const rule = {
      id: Date.now(),
      ...newRule,
      status: "active",
      lastSent: "Never",
      nextSchedule: `2024-01-${new Date().getDate() + 1} ${newRule.time}`,
      createdAt: new Date().toISOString().split('T')[0],
      successRate: 100,
      totalSent: 0
    };
    setAutomationRules(prev => [...prev, rule]);
    setShowCreateModal(false);
    setNewRule({
      name: "",
      description: "",
      trigger: "salon-close",
      time: "21:00",
      days: [],
      recipients: [""],
      reports: []
    });
  };

  const sendTestReport = (ruleId) => {
    alert(`Test report sent for rule #${ruleId}`);
  };

  const downloadReport = (ruleId) => {
    alert(`Downloading report for rule #${ruleId}`);
  };

  // Get status color class
  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get trigger icon
  const getTriggerIcon = (trigger) => {
    switch(trigger) {
      case 'daily':
        return <Clock className="w-4 h-4" />;
      case 'weekly':
        return <Calendar className="w-4 h-4" />;
      case 'monthly':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
                Automated Report System
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Schedule automatic reports to be sent via WhatsApp when salon closes.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center space-x-2 bg-[#492DBD] text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-[#3a2199] transition-colors w-full sm:w-auto"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Create New Rule's</span>
            </button>
          </div>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Reports Today</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">1</p>
              </div>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">Active Rules</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {automationRules.filter(r => r.status === "active").length}
                </p>
              </div>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Recipients</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {automationRules.reduce((acc, rule) => acc + rule.recipients.length, 0)}
                </p>
              </div>
              <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Success Rate</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">94%</p>
              </div>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Automation Rules List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Scheduled Report Rules</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {automationRules.map((rule) => (
              <div key={rule.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                      rule.status === "active" ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        rule.status === "active" ? "text-green-600" : "text-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{rule.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit border ${getStatusColor(rule.status)}`}>
                          {rule.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{rule.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Time: {rule.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>Days: {rule.days.length > 0 ? rule.days.join(", ") : "Daily"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{rule.recipients.length} recipient{rule.recipients.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-9 sm:ml-12 lg:ml-0">
                    <button
                      onClick={() => viewRuleDetails(rule)}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => sendTestReport(rule.id)}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                      title="Send Test"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Test</span>
                    </button>
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
                        rule.status === "active"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                      title={rule.status === "active" ? "Pause" : "Activate"}
                    >
                      {rule.status === "active" ? 
                        <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      }
                      <span className="hidden sm:inline">{rule.status === "active" ? "Pause" : "Activate"}</span>
                    </button>
                  </div>
                </div>

                {/* Reports Selection */}
                <div className="mb-3 sm:mb-4 ml-9 sm:ml-12 lg:ml-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Reports to Include:</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {rule.reports.map(reportId => {
                      const report = TypesOfreports.find(r => r.id === reportId);
                      return report ? (
                        <span key={reportId} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#492DBD] text-white rounded-full text-xs flex items-center gap-1">
                          {report.icon && <report.icon className="w-3 h-3" />}
                          {report.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600 ml-9 sm:ml-12 lg:ml-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Last Sent:</span> {rule.lastSent}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Next Schedule:</span> {rule.nextSchedule}
                  </div>
                </div>

                {/* Recipients */}
                <div className="mt-3 ml-9 sm:ml-12 lg:ml-0">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Recipients:</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {rule.recipients.map((recipient, index) => (
                      <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {recipient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Rule Details Modal */}
        {showViewModal && selectedRule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedRule.status === "active" ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <Zap className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      selectedRule.status === "active" ? "text-green-600" : "text-gray-400"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {selectedRule.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Created on {selectedRule.createdAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-700">{selectedRule.description}</p>
                </div>

                {/* Status and Schedule Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Status & Schedule
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRule.status)}`}>
                          {selectedRule.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trigger Type</span>
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          {getTriggerIcon(selectedRule.trigger)}
                          {selectedRule.trigger.charAt(0).toUpperCase() + selectedRule.trigger.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Send Time</span>
                        <span className="text-sm font-medium text-gray-900">{selectedRule.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Days</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedRule.days.length > 0 ? selectedRule.days.join(", ") : "Every day"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Performance Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="text-sm font-medium text-green-600">{selectedRule.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Reports Sent</span>
                        <span className="text-sm font-medium text-gray-900">{selectedRule.totalSent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Sent</span>
                        <span className="text-sm font-medium text-gray-900">{selectedRule.lastSent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next Schedule</span>
                        <span className="text-sm font-medium text-gray-900">{selectedRule.nextSchedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reports List */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Included Reports ({selectedRule.reports.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRule.reports.map(reportId => {
                      const report = TypesOfreports.find(r => r.id === reportId);
                      return report ? (
                        <div key={reportId} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-[#492DBD] bg-opacity-10 rounded-lg">
                            <report.icon className="w-4 h-4 text-[#492DBD]" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{report.name}</h5>
                            <p className="text-xs text-gray-500">{report.description}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Recipients List */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Recipients ({selectedRule.recipients.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRule.recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{recipient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => sendTestReport(selectedRule.id)}
                  className="px-3 sm:px-4 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Test Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Rule Modal - Responsive */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Create New Automation Rule</h3>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Rule Name & Description */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Rule Name
                    </label>
                    <input
                      type="text"
                      value={newRule.name}
                      onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      placeholder="e.g., Daily Closing Report"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Description
                    </label>
                    <textarea
                      value={newRule.description}
                      onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                      placeholder="Describe what this automation does..."
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Send Time
                    </label>
                    <input
                      type="time"
                      value={newRule.time}
                      onChange={(e) => setNewRule(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                    />
                  </div>
                </div>

                {/* Reports Selection - Responsive Grid */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Select Reports to Include
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {TypesOfreports.map(report => (
                      <div
                        key={report.id}
                        onClick={() => toggleReport(report.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          newRule.reports.includes(report.id)
                            ? 'border-[#492DBD] bg-[#492DBD] bg-opacity-5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            newRule.reports.includes(report.id)
                              ? 'bg-[#492DBD] border-[#492DBD]'
                              : 'border-gray-300'
                          }`}>
                            {newRule.reports.includes(report.id) && (
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{report.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{report.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      WhatsApp Recipients
                    </label>
                    <button
                      type="button"
                      onClick={addNewRecipient}
                      className="flex items-center space-x-1 text-xs sm:text-sm text-[#492DBD] hover:text-[#3a2199]"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Add Recipient</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newRule.recipients.map((recipient, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => updateRecipient(index, e.target.value)}
                          placeholder="+91 98765 43210"
                          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#492DBD] focus:border-[#492DBD]"
                        />
                        {newRule.recipients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRecipient(index)}
                            className="px-2 sm:px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewRule}
                  className="px-3 sm:px-4 py-2 text-sm bg-[#492DBD] text-white rounded-lg hover:bg-[#3a2199] transition-colors order-1 sm:order-2"
                >
                  Create Automation Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Automationreport;