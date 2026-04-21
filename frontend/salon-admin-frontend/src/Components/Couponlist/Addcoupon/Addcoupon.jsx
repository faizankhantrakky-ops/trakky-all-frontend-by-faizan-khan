// CouponForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Plus, Calendar, Tag, Info, Percent, IndianRupee, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from '../../../Context/AuthContext';

const API_URL = 'https://backendapi.trakky.in/salons/coupon/';

const CouponForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
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
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${authTokens?.access}` },
      });
      const data = await res.json();
      setFormData({
        couponname: data.couponname || '',
        description: data.description || '',
        coupon_choice: data.coupon_choice || 'flat',
        discount_value: data.discount_value || '',
        final_price: data.final_price || '',
        starting_date: data.starting_date?.split('T')[0] || today,
        expire_date: data.expire_date?.split('T')[0] || '',
        active_status: data.active_status ?? true,
        min_price_to_avail: data.min_price_to_avail || '',
        max_user: data.max_user || '',
      });
    } catch {
      toast.error('Failed to load coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading(isEdit ? 'Updating...' : 'Creating...');

    const url = isEdit ? `${API_URL}/${id}` : API_URL;
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
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
        }),
      });

      if (res.ok) {
        toast.dismiss();
        toast.success(isEdit ? 'Coupon updated!' : 'Coupon created!');
        navigate('/coupon-list');
      } else throw new Error();
    } catch {
      toast.dismiss();
      toast.error(isEdit ? 'Update failed' : 'Create failed');
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

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-t-lg px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#502DA6]">
              {isEdit ? 'Edit Coupon' : 'Create New Coupon'}
            </h1>
            <p className="text-sm text-gray-600">
              {isEdit ? 'Update coupon details' : 'Add a new discount coupon'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-t-0 rounded-b-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Name */}
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

            {/* Row 2: Type, Discount, Min Price, Max Users */}
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

            {/* Row 3: Dates */}
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
              <div className="md:col-span-2"></div>
            </div>

            {/* Description */}
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

            {/* Active + Buttons */}
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
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#502DA6] hover:bg-[#3f2388] disabled:opacity-70 text-white font-medium px-6 py-2.5 rounded-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  {isEdit ? 'Update' : 'Create'} Coupon
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;