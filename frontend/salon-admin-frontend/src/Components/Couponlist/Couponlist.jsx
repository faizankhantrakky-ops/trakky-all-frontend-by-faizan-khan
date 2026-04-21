// CouponList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, Calendar, Copy, CheckCircle2, XCircle, Trash2, Edit, X, Tag, Info, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthContext from "../../Context/AuthContext";

const API_URL = 'https://backendapi.trakky.in/salons/coupon';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const today = new Date().toISOString().split('T')[0]; // Today for default

  const [formData, setFormData] = useState({
    couponname: '',
    couponcode: '',
    description: '',
    coupon_choice: 'flat',
    discount_value: '',
    final_price: '',
    starting_date: today,
    expire_date: '',
    active_status: true,
  });

  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      const mapped = data.map(item => ({
        id: item.id,
        code: item.couponcode || 'N/A',
        title: item.couponname || 'No Name',
        discount: item.coupon_choice === 'flat'
          ? `₹${item.discount_value} OFF`
          : `${item.discount_value}% OFF`,
        minPurchase: item.final_price > 0 ? `₹${item.final_price}` : 'No min',
        start: item.starting_date ? parseISO(item.starting_date) : null,
        expiry: item.expire_date ? parseISO(item.expire_date) : new Date('2099-12-31'),
        active: item.active_status,
        raw: item
      }));

      setCoupons(mapped);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    toast.loading("Deleting...");
    try {
      const res = await fetch(`${API_URL}/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authTokens?.access}` },
      });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        toast.dismiss();
        toast.success("Coupon deleted!");
      }
    } catch {
      toast.dismiss();
      toast.error("Delete failed");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      couponname: coupon.raw.couponname || '',
      couponcode: coupon.raw.couponcode || '',
      description: coupon.raw.description || '',
      coupon_choice: coupon.raw.coupon_choice || 'flat',
      discount_value: coupon.raw.discount_value || '',
      final_price: coupon.raw.final_price || '',
      starting_date: coupon.raw.starting_date ? coupon.raw.starting_date.split('T')[0] : today,
      expire_date: coupon.raw.expire_date ? coupon.raw.expire_date.split('T')[0] : '',
      active_status: coupon.raw.active_status ?? true,
    });
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingCoupon(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    toast.loading("Updating coupon...");

    try {
      const res = await fetch(`${API_URL}/${editingCoupon.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authTokens?.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          discount_value: parseFloat(formData.discount_value) || 0,
          final_price: parseFloat(formData.final_price) || 0,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        toast.dismiss();
        toast.success("Coupon updated!");

        setCoupons(prev => prev.map(c =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: updated.couponcode,
                title: updated.couponname,
                discount: updated.coupon_choice === 'flat'
                  ? `₹${updated.discount_value} OFF`
                  : `${updated.discount_value}% OFF`,
                minPurchase: updated.final_price > 0 ? `₹${updated.final_price}` : 'No min',
                start: updated.starting_date ? parseISO(updated.starting_date) : null,
                expiry: updated.expire_date ? parseISO(updated.expire_date) : c.expiry,
                active: updated.active_status,
                raw: updated
              }
            : c
        ));

        closeModal();
      } else throw new Error();
    } catch {
      toast.dismiss();
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="mx-auto ">

          <div className="bg-white border border-gray-200 rounded-t-lg px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#502DA6] tracking-tight">Coupon Management</h1>
              <p className="text-gray-600 text-sm mt-1">View and manage all discount coupons</p>
            </div>
           <div className='flex items-center gap-2'>
             <button
              onClick={() => navigate('/add-coupon?mode=marketing')}
              className="flex items-center gap-2 bg-[#502DA6] hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-lg transition shadow-sm hover:shadow"
            >
              <Plus className="w-5 h-5" />
              Add New Coupon
            </button>
            <button
              onClick={() => navigate('/personal-add-coupon?mode=marketing')}
              className="flex items-center gap-2 bg-[#502DA6] hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-lg transition shadow-sm hover:shadow"
            >
              <Plus className="w-5 h-5" />
              Add Personal Coupon
            </button>
           </div>
          </div>

          <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#502DA6] text-white text-left text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Offer</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5 font-mono text-blue-700 font-bold text-lg">{c.code}</td>
                    <td className="px-6 py-5 font-semibold text-gray-700">{c.title}</td>
                    <td className="px-6 py-5">
                      <span className="inline-block bg-[#502DA6] text-white px-4 py-2 rounded text-sm font-bold">
                        {c.discount}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-sm">
                      {c.start ? format(c.start, 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{format(c.expiry, 'dd MMM yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {c.active ? (
                        <div className="flex items-center justify-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <XCircle className="w-5 h-5" /> Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => copyCode(c.code)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Copy className="w-5 h-5 text-[#502DA6]" />
                        </button>
                        <button onClick={() => openEditModal(c)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            Total Active: <strong className="text-[#502DA6]">{coupons.filter(c => c.active).length}</strong>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#502DA6]">Edit Coupon</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2 text-[#502DA6]" /> Coupon Code
                  </label>
                  <input name="couponcode" value={formData.couponcode} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none text-lg font-mono font-bold tracking-wider" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Name</label>
                  <input name="couponname" value={formData.couponname} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select name="coupon_choice" value={formData.coupon_choice} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none">
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Percent className="w-4 h-4 inline mr-2 text-[#502DA6]" /> Discount Value
                  </label>
                  <input type="number" name="discount_value" value={formData.discount_value} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2 text-green-600" /> Start Date
                  </label>
                  <input
                    type="date"
                    name="starting_date"
                    value={formData.starting_date}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2 text-red-600" /> Expiry Date
                  </label>
                  <input type="date" name="expire_date" value={formData.expire_date} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Info className="w-4 h-4 inline mr-2 text-[#502DA6]" /> Description
                </label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#502DA6] outline-none resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" name="active_status" checked={formData.active_status} onChange={handleChange}
                  className="w-5 h-5 text-[#502DA6] rounded" />
                <label className="text-sm font-semibold text-gray-700">Active Coupon</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex items-center gap-2 bg-[#502DA6] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition">
                  Update Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponList;