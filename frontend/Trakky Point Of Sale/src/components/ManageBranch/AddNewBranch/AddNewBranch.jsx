import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#492DBD';

const AddNewBranch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    newbranchName: '',
    branchCode: '',
    branchType: '',
    region: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    
    // Contact Information
    phone: '',
    phoneSecondary: '',
    email: '',
    emailSecondary: '',
    website: '',
    
    // Management Information
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerTitle: '',
    establishedDate: '',
    employees: '',
    
    // Operational Details
    workingHours: '',
    timezone: '',
    languages: [],
    facilities: [],
    
    // Financial Information
    currency: 'USD',
    annualRevenue: '',
    taxId: '',
    bankAccount: '',
    
    // Status
    status: 'active',
    
    // Additional
    description: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});


let branchId = localStorage.getItem("branchId") || "";

  const handleinputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.newbranchName) newErrors.newbranchName = 'Branch name is required';
      if (!formData.branchCode) newErrors.branchCode = 'Branch code is required';
      if (!formData.branchType) newErrors.branchType = 'Branch type is required';
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }
    
    if (step === 2) {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.email) newErrors.email = 'Email is required';
    }
    
    if (step === 3) {
      if (!formData.managerName) newErrors.managerName = 'Manager name is required';
      if (!formData.managerEmail) newErrors.managerEmail = 'Manager email is required';
      if (!formData.employees) newErrors.employees = 'Number of employees is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Here you would typically make an API call

      // let branchId = localStorage.getItem("branchId") || "";

      // For the Add Multiple Branch
      console.log('Form submitted:', formData);
      // Show success message and navigate
      alert('Branch added successfully!');
      navigate('/');
    }
  };

  const branchTypes = [
    'Headquarter',
    'Regional Office',
    'Branch Office',
    'R&D Center',
    'Sales Office',
    'Service Center',
    'Manufacturing Plant',
    'Warehouse',
    'Retail Store',
    'Corporate Office'
  ];

  const regions = [
    'North America',
    'South America',
    'Europe',
    'Asia Pacific',
    'Middle East',
    'Africa',
    'Australia',
    'Global'
  ];

  const timezones = [
    'EST (UTC-5)',
    'PST (UTC-8)',
    'GMT (UTC+0)',
    'CET (UTC+1)',
    'IST (UTC+5:30)',
    'SGT (UTC+8)',
    'JST (UTC+9)',
    'AEST (UTC+10)'
  ];

  const currencies = [
    'USD - US Dollar',
    'EUR - Euro',
    'GBP - British Pound',
    'JPY - Japanese Yen',
    'CNY - Chinese Yuan',
    'SGD - Singapore Dollar',
    'AUD - Australian Dollar',
    'CAD - Canadian Dollar'
  ];

  const facilityOptions = [
    'Parking',
    'Cafeteria',
    'Gym',
    'Conference Room',
    'Medical Center',
    'Child Care',
    'Library',
    'Rooftop Garden',
    'Game Room',
    'Showers',
    'EV Charging',
    'Bike Storage'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
         
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Branch</h1>
              <p className="text-gray-500 mt-2">Fill in the details to create a new branch</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 relative">
            <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
              <div 
                className="transition-all duration-500 ease-out"
                style={{ 
                  width: `${(currentStep / 5) * 100}%`,
                  backgroundColor: PRIMARY_COLOR 
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {['Basic', 'Contact', 'Management', 'Operations', 'Review'].map((step, index) => (
                <div 
                  key={step}
                  className={`text-xs font-medium ${
                    currentStep > index + 1 ? 'text-gray-900' : 
                    currentStep === index + 1 ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Colored Header Bar */}
          <div className="h-2" style={{ backgroundColor: PRIMARY_COLOR }} />
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Basic Information</h2>
                  <p className="text-sm text-gray-600 mb-6">Enter the fundamental details about the branch</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="newbranchName"
                      value={formData.newbranchName}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.newbranchName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., Main Headquarters"
                    />
                    {errors.newbranchName && (
                      <p className="mt-1 text-xs text-red-500">{errors.newbranchName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="branchCode"
                      value={formData.branchCode}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.branchCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., HQ-001"
                    />
                    {errors.branchCode && (
                      <p className="mt-1 text-xs text-red-500">{errors.branchCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Branch Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="branchType"
                      value={formData.branchType}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.branchType ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                    >
                      <option value="">Select branch type</option>
                      {branchTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.branchType && (
                      <p className="mt-1 text-xs text-red-500">{errors.branchType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.region ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                    >
                      <option value="">Select region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-xs text-red-500">{errors.region}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., United States"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., New York"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleinputChange}
                      rows="2"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="Enter full street address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., 10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={handleinputChange}
                          className="w-4 h-4"
                          style={{ accentColor: PRIMARY_COLOR }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={handleinputChange}
                          className="w-4 h-4"
                          style={{ accentColor: PRIMARY_COLOR }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Contact Information</h2>
                  <p className="text-sm text-gray-500 mb-6">Add contact details for the branch</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="+1 (212) 555-0123"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Phone
                    </label>
                    <input
                      type="tel"
                      name="phoneSecondary"
                      value={formData.phoneSecondary}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="+1 (212) 555-0456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="branch@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Email
                    </label>
                    <input
                      type="email"
                      name="emailSecondary"
                      value={formData.emailSecondary}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="backup@company.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="https://www.company.com/branch"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Management Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Management Information</h2>
                  <p className="text-sm text-gray-500 mb-6">Details about branch management and staff</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.managerName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="Full name"
                    />
                    {errors.managerName && (
                      <p className="mt-1 text-xs text-red-500">{errors.managerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Title
                    </label>
                    <input
                      type="text"
                      name="managerTitle"
                      value={formData.managerTitle}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., Regional Director"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="managerEmail"
                      value={formData.managerEmail}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.managerEmail ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="manager@company.com"
                    />
                    {errors.managerEmail && (
                      <p className="mt-1 text-xs text-red-500">{errors.managerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Phone
                    </label>
                    <input
                      type="tel"
                      name="managerPhone"
                      value={formData.managerPhone}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="+1 (212) 555-0789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="employees"
                      value={formData.employees}
                      onChange={handleinputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.employees ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., 50"
                      min="0"
                    />
                    {errors.employees && (
                      <p className="mt-1 text-xs text-red-500">{errors.employees}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Date
                    </label>
                    <input
                      type="date"
                      name="establishedDate"
                      value={formData.establishedDate}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Operational Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Operational Details</h2>
                  <p className="text-sm text-gray-500 mb-6">Configure operational settings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                    >
                      <option value="">Select timezone</option>
                      {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages.join(', ')}
                      onChange={(e) => handleArrayChange('languages', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="English, Spanish, French"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facilities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {facilityOptions.map(facility => (
                        <label key={facility} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={facility}
                            checked={formData.facilities.includes(facility)}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...formData.facilities, facility]
                                : formData.facilities.filter(f => f !== facility);
                              setFormData({ ...formData, facilities: updated });
                            }}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: PRIMARY_COLOR }}
                          />
                          <span className="text-sm text-gray-700">{facility}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency*
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Revenue*
                    </label>
                    <input
                      type="text"
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tax ID 
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="e.g., 12-3456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="Bank account details"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Review & Submit</h2>
                  <p className="text-sm text-gray-500 mb-6">Please review all information before submitting</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Basic Information</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Branch Name:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.newbranchName || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Branch Code:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.branchCode || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Type:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.branchType || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Region:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.region || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Address:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.address || '-'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Phone:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.phone || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Email:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.email || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Website:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.website || '-'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Management</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Manager:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.managerName || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Employees:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.employees || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Established:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.establishedDate || '-'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Operations</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Working Hours:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.workingHours || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Timezone:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.timezone || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Revenue:</dt>
                          <dd className="text-sm font-medium text-gray-900">{formData.annualRevenue || '-'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleinputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="Any additional notes about the branch..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleinputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: PRIMARY_COLOR }}
                      placeholder="important, new, priority"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Please verify all information is correct before submitting. You can edit the branch details later if needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={currentStep === 1 ? () => navigate('/') : handlePrevious}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleToNext}
                  className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Branch</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact <span style={{ color: PRIMARY_COLOR }} className="font-medium">support@company.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddNewBranch;