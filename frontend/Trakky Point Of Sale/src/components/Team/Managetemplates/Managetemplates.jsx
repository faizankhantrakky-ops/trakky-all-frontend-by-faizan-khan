import React, { useState } from 'react';
import {
  Edit3,
  X,
  MessageCircle,
  Cake,
  Heart,
  Bell,
  Mail,
  Copy,
  CheckCircle,
  FileText,
  Palette,
  Type,
  Zap,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Shield,
  Eye,
} from 'lucide-react';

const defaultTemplates = [
  {
    id: '1',
    name: 'Classic Birthday Wish',
    type: 'birthday',
    category: 'Celebration',
    subject: 'Happy Birthday from {brand_name}! 🎉',
    body: `Dear {customer_name},

🎂 Wishing you a very Happy Birthday! 🎉

May this year bring you endless joy, glowing confidence, and beautiful moments.  
Thank you for letting us be part of your beauty journey.

With love and best wishes,  
The {brand_name} Team`,
    variables: ['customer_name', 'brand_name'],
    usageCount: 142,
    lastUsed: '2024-01-15',
    status: 'active',
  },

  {
    id: '2',
    name: 'Wedding Anniversary',
    type: 'anniversary',
    category: 'Celebration',
    subject: 'Happy Anniversary, {customer_name}! 💞',
    body: `Dear {customer_name},

💖 Happy Wedding Anniversary! 💖

Another beautiful year of love, laughter, and memories.  
We're truly honored to be part of your special journey.

Wishing you many more years of happiness and togetherness.

Warmest wishes,  
The {brand_name} Team`,
    variables: ['customer_name', 'brand_name'],
    usageCount: 89,
    lastUsed: '2024-01-14',
    status: 'active',
  },

  {
    id: '3',
    name: 'Appointment Reminder',
    type: 'reminder',
    category: 'Business',
    subject: 'Reminder: Your {service_name} tomorrow 📅',
    body: `Hello {customer_name},

This is a friendly reminder about your upcoming appointment:

🗓️ Date:     {appointment_date}
⏰ Time:     {appointment_time}
✂️ Service:  {service_name}

We're looking forward to pampering you!  
Please let us know if anything changes.

See you soon ♡  
{brand_name} Team`,
    variables: [
      'customer_name',
      'appointment_date',
      'appointment_time',
      'service_name',
      'brand_name'
    ],
    usageCount: 256,
    lastUsed: '2024-01-16',
    status: 'active',
  },

  {
    id: '4',
    name: 'Warm Welcome Message',
    type: 'welcome',
    category: 'Onboarding',
    subject: 'Welcome to the {brand_name} Family! ✨',
    body: `Hi {customer_name}! 👋

A very warm welcome to the {brand_name} family!  

We're so excited to have you with us and can't wait to help you look and feel your absolute best.

Your journey to beautiful hair, skin & confidence starts here 💫

Any questions? Just reply — we're here for you.

Happy pampering!  
The {brand_name} Team`,
    variables: ['customer_name', 'brand_name'],
    usageCount: 178,
    lastUsed: '2024-01-13',
    status: 'active',
  },
];

const ManageTemplates = () => {
  const [templates] = useState(defaultTemplates);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [copiedVariable, setCopiedVariable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['all', 'Celebration', 'Business', 'Onboarding', 'Marketing'];

  const handleEdit = (template) => {
    setSelected(template);
    setEditForm({ ...template });
    setIsEditing(true);
  };

  const handleSave = () => {
    // In real app → API call here
    setIsEditing(false);
    setEditForm(null);
    setSelected(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const getIcon = (type) => {
    const map = {
      birthday: Cake,
      anniversary: Heart,
      reminder: Bell,
      welcome: MessageCircle,
      followup: Eye,
      promotional: Zap,
    };
    const Icon = map[type] || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const getColor = (type) => {
    const map = {
      birthday: 'from-amber-500 to-orange-500',
      anniversary: 'from-rose-500 to-pink-500',
      reminder: 'from-blue-500 to-cyan-500',
      welcome: 'from-emerald-500 to-teal-500',
      followup: 'from-violet-500 to-indigo-500',
      promotional: 'from-red-500 to-rose-500',
    };
    return map[type] || 'from-slate-500 to-gray-600';
  };

  const getNowCategoryStyle = (category) => {
    const map = {
      Celebration: 'bg-amber-50 text-amber-700 border-amber-200',
      Business: 'bg-blue-50 text-blue-700 border-blue-200',
      Onboarding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Marketing: 'bg-violet-50 text-violet-700 border-violet-200',
    };
    return map[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const ForcopyVariable = (variable) => {
    navigator.clipboard.writeText(`{${variable}}`);
    setCopiedVariable(variable);
    setTimeout(() => setCopiedVariable(null), 1800);
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)) &&
      (selectedCategory === 'all' || t.category === selectedCategory)
    );
  });

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'active').length,
    usage: templates.reduce((sum, t) => sum + t.usageCount, 0),
    categories: categories.length - 1,
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-12">
      <div className=" mx-auto px-4 ">

        {/* Header */}
        <header className="pt-8 pb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Message Templates</h1>
          <p className="mt-2 text-lg text-gray-600">
            Create, manage and personalize WhatsApp & SMS communication templates
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Total Templates', value: stats.total, icon: FileText, color: 'blue' },
            { label: 'Active Templates', value: stats.active, icon: Shield, color: 'emerald' },
            { label: 'Total Usage', value: stats.usage, icon: Zap, color: 'violet' },
            { label: 'Categories', value: stats.categories, icon: Filter, color: 'amber' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 transition-all hover:shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1.5">{item.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${item.color}-50`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or content..."
                  className="w-full pl-11 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-200">
                <Filter className="w-4.5 h-4.5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-violet-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1 w-5 h-5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-violet-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="w-5 h-5 flex flex-col gap-1">
                    <div className="bg-current h-1 rounded-full"></div>
                    <div className="bg-current h-1 rounded-full"></div>
                    <div className="bg-current h-1 rounded-full w-3/4"></div>
                  </div>
                </button>
              </div>

              <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                <Plus size={18} />
                New Template
              </button>
            </div>
          </div>
        </div>

        {/* Templates */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelected(template)}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden cursor-pointer"
              >
                <div className="p-6 pb-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-xl bg-gradient-to-br ${getColor(template.type)} text-white shadow-sm flex-shrink-0`}>
                      {getIcon(template.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${getNowCategoryStyle(
                            template.category
                          )}`}
                        >
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{getTypeLabel(template.type)} template</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500 flex gap-4">
                    <span>Used {template.usageCount}×</span>
                    <span>•</span>
                    <span>Last: {template.lastUsed}</span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="bg-gray-50/70 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line line-clamp-3 leading-relaxed border border-gray-100">
                    {template.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelected(template)}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow hover:border-gray-300 transition-all duration-200 p-6 flex items-start gap-6 cursor-pointer"
              >
                <div className={`p-4 rounded-xl bg-gradient-to-br ${getColor(template.type)} text-white shadow-sm flex-shrink-0`}>
                  {getIcon(template.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">{template.name}</h3>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getNowCategoryStyle(
                        template.category
                      )}`}
                    >
                      {template.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{getTypeLabel(template.type)} template</p>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{template.body}</p>

                  <div className="flex gap-5 text-xs text-gray-500">
                    <span>Used {template.usageCount} times</span>
                    <span>•</span>
                    <span>Last used {template.lastUsed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center mt-8">
            <FileText className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Try adjusting your search term or category filter
            </p>
            <button className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 font-medium shadow-sm">
              <Plus size={18} />
              Create New Template
            </button>
          </div>
        )}

        {/* ────────────────────────────────────────────────
            PREVIEW MODAL
        ──────────────────────────────────────────────── */}
        {selected && !isEditing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="relative px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${getColor(selected.type)} text-white shadow-md`}>
                    {getIcon(selected.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selected.name}</h2>
                    <div className="flex items-center gap-3 mt-1 text-gray-600">
                      <span className="capitalize">{getTypeLabel(selected.type)} template</span>
                      <span className="text-gray-300">•</span>
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getNowCategoryStyle(
                          selected.category
                        )}`}
                      >
                        {selected.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {selected.subject && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                      <Mail className="w-4.5 h-4.5" />
                      SUBJECT
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium">
                      {selected.subject}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                    <Type className="w-4.5 h-4.5" />
                    MESSAGE BODY
                  </label>
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl whitespace-pre-line text-gray-800 leading-relaxed font-medium">
                    {selected.body}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Palette className="w-4.5 h-4.5" />
                    AVAILABLE VARIABLES
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selected.variables.map((v) => (
                      <button
                        key={v}
                        onClick={() => ForcopyVariable(v)}
                        className="group flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-violet-300 hover:shadow-sm transition-all"
                      >
                        <code className="text-sm font-mono text-gray-800">{`{${v}}`}</code>
                        {copiedVariable === v ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  {copiedVariable && (
                    <p className="text-center text-sm text-emerald-600 mt-4 font-medium">
                      Copied <code className="font-mono">{`{${copiedVariable}}`}</code>
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEdit(selected)}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-sm transition-all"
                >
                  Edit Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────
            EDIT MODAL
        ──────────────────────────────────────────────── */}
        {isEditing && editForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border border-gray-100">

              
              <div className="relative px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${getColor(editForm.type)} text-white shadow-md`}>
                    {getIcon(editForm.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Template</h2>
                    <p className="text-gray-600 mt-1">Customize content and variables</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-8 space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-300 outline-none transition-all"
                      placeholder="Template name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium">
                      {getTypeLabel(editForm.type)}
                    </div>
                  </div>
                </div>

                {editForm.subject !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-300 outline-none transition-all"
                      placeholder="Email/SMS subject line"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                  <textarea
                    rows={14}
                    value={editForm.body}
                    onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-300 outline-none transition-all leading-relaxed"
                    placeholder="Use {variable_name} for dynamic values..."
                  />
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                    <Zap size={14} />
                    Use curly braces for dynamic fields → <code className="bg-gray-100 px-1.5 rounded">{`{customer_name}`}</code>
                  </p>
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-7 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-7 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-sm transition-all"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTemplates;