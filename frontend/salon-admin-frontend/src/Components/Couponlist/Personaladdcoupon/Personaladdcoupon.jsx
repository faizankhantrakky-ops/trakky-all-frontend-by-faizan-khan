import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ArrowLeft, Plus, Calendar, Info, Percent, IndianRupee, Users, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../../Context/AuthContext';

const API_URL = 'https://backendapi.trakky.in/salons/coupon/';
const USERS_API_URL = 'https://backendapi.trakky.in/salons/salonuser/';

const Personaladdcoupon = () => {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    couponname: '',
    description: '',
    coupon_choice: 'flat',
    discount_value: '',
    final_price: '',
    starting_date: today,
    expire_date: '',
    active_status: true,
    min_price_to_avail: '',
    max_user: '',
    user_id: '',
  });

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(USERS_API_URL, {
        headers: { Authorization: `Bearer ${authTokens?.access}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to load users');
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Filter users based on search term (name or phone number)
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(user => 
      (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
      user.phone_number.includes(searchTerm)
    ).slice(0, 10); // Limit suggestions to 10 for performance
  }, [users, searchTerm]);

  const handleUserSelect = (user) => {
    setFormData(prev => ({ ...prev, user_id: user.id }));
    setSearchTerm(user.name || user.phone_number);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_id) {
      toast.error('Please select a user');
      return;
    }
    setLoading(true);
    toast.loading('Creating...');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          discount_value: parseFloat(formData.discount_value) || 0,
          final_price: parseFloat(formData.final_price) || 0,
          min_price_to_avail: parseFloat(formData.min_price_to_avail) || 0,
          max_user: parseInt(formData.max_user) || 0,
          user_id: parseInt(formData.user_id),
        }),
      });

      if (res.ok) {
        toast.dismiss();
        toast.success('Personal Coupon created!');
        navigate('/coupon-list');
      } else {
        const error = await res.json();
        throw new Error(error.detail || 'Create failed');
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const selectedUserName = users.find(u => u.id === parseInt(formData.user_id))?.name || 
                         users.find(u => u.id === parseInt(formData.user_id))?.phone_number || 
                         'Select a user';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-t-lg px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#502DA6]">
              Create Personal Coupon
            </h1>
            <p className="text-sm text-gray-600">
              Add a personal discount coupon for a specific user
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-t-0 rounded-b-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Coupon Name */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Name</label>
                <input
                  name="couponname"
                  value={formData.couponname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none"
                />
              </div>
            </div>

            {/* User Selection with Search Suggestions */}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 text-[#502DA6]" /> Select User
                </label>

                {usersLoading ? (
                  <div className="flex items-center justify-center p-8 border border-gray-300 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-[#502DA6] mr-2" />
                    <span className="text-gray-600">Loading users...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#502DA6]">
                      <Search className="w-5 h-5 text-gray-400 ml-3" />
                      <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(true);
                          if (!e.target.value) {
                            setFormData(prev => ({ ...prev, user_id: '' }));
                          }
                        }}
                        onFocus={() => searchTerm && setShowSuggestions(true)}
                        className="w-full px-3 py-2.5 pl-10 outline-none rounded-lg"
                      />
                    </div>

                    {/* Selected User Display */}
                    {formData.user_id && !showSuggestions && (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                        Selected: <span className="font-medium">{selectedUserName}</span>
                      </div>
                    )}

                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredUsers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium">{user.name || 'No Name'}</div>
                              <div className="text-sm text-gray-500">{user.phone_number}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showSuggestions && searchTerm && filteredUsers.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg text-center text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the form remains same */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="coupon_choice"
                  value={formData.coupon_choice}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6]"
                >
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Percent className="w-4 h-4 text-[#502DA6]" /> Discount
                </label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <IndianRupee className="w-4 h-4 text-[#502DA6]" /> Min Order
                </label>
                <input
                  type="number"
                  name="min_price_to_avail"
                  value={formData.min_price_to_avail}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 text-[#502DA6]" /> Max Users
                </label>
                <input
                  type="number"
                  name="max_user"
                  value={formData.max_user}
                  onChange={handleChange}
                  placeholder="Unlimited"
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 text-green-600" /> Start Date
                </label>
                <input
                  type="date"
                  name="starting_date"
                  value={formData.starting_date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 text-red-600" /> Expiry Date
                </label>
                <input
                  type="date"
                  name="expire_date"
                  value={formData.expire_date}
                  onChange={handleChange}
                  min={formData.starting_date}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Info className="w-4 h-4 text-[#502DA6]" /> Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="active_status"
                  checked={formData.active_status}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#502DA6] rounded"
                />
                <span className="font-medium text-gray-700">Active Coupon</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.user_id}
                  className="flex items-center gap-2 bg-[#502DA6] hover:bg-[#3f2388] disabled:opacity-70 text-white font-medium px-6 py-2.5 rounded-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Personal Coupon
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Personaladdcoupon;