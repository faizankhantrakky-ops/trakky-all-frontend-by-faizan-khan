import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../../../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import { Add, Close } from "@mui/icons-material";

const FormForGiftCard = ({ giftCard, onClose, isEdit = false }) => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state (unchanged)
  const [form, setForm] = useState({
    giftcard_purchase_customer_name: "",
    giftcard_purchase_customer_phone: "",
    giftcard_purchase_Customer_gender: "Male",
    giftcard_benefitted_customer_name: "",
    giftcard_benefitted_customer_phone: "",
    giftcard_benefitted_Customer_gender: "Male",
    giftcard_name: "",
    purchase_price: "",
    discount_percentage: "",
    purchase_discounted_price: "",
    final_amount: "",
    total_price_benefits: "",
    remaining_price_benefits: "",
    amount_paid: "",
    remaining_amount_to_paid: "",
    Start_date: "",
    end_date: "",
    Benefits: [],
    giftcard_use_history: [],
    giftcard_payment_mode: [],
    service_includes: [],
    terms_and_conditions: "",
    giftcard_is_gst: false,
    giftcard_tax_amount: "",
    giftcard_tax_percent: "",
    vendor_user: null,
    card_code: null,
  });

  const [loading, setLoading] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [serviceIncludes, setServiceIncludes] = useState([]);

  // Populate on edit (unchanged)
  useEffect(() => {
    if (isEdit && giftCard) {
      setForm({
        giftcard_purchase_customer_name: giftCard.giftcard_purchase_customer_name || "",
        giftcard_purchase_customer_phone: giftCard.giftcard_purchase_customer_phone || "",
        giftcard_purchase_Customer_gender: giftCard.giftcard_purchase_Customer_gender || "Male",
        giftcard_benefitted_customer_name: giftCard.giftcard_benefitted_customer_name || "",
        giftcard_benefitted_customer_phone: giftCard.giftcard_benefitted_customer_phone || "",
        giftcard_benefitted_Customer_gender: giftCard.giftcard_benefitted_Customer_gender || "Male",
        giftcard_name: giftCard.giftcard_name || "",
        purchase_price: giftCard.purchase_price || "",
        discount_percentage: giftCard.discount_percentage || "",
        purchase_discounted_price: giftCard.purchase_discounted_price || "",
        final_amount: giftCard.final_amount || "",
        total_price_benefits: giftCard.total_price_benefits || "",
        remaining_price_benefits: giftCard.remaining_price_benefits || "",
        amount_paid: giftCard.amount_paid || "",
        remaining_amount_to_paid: giftCard.remaining_amount_to_paid || "",
        Start_date: giftCard.Start_date ? new Date(giftCard.Start_date).toISOString().split("T")[0] : "",
        end_date: giftCard.end_date ? new Date(giftCard.end_date).toISOString().split("T")[0] : "",
        Benefits: giftCard.Benefits || [],
        giftcard_use_history: giftCard.giftcard_use_history || [],
        giftcard_payment_mode: giftCard.giftcard_payment_mode || [],
        service_includes: giftCard.service_includes || [],
        terms_and_conditions: giftCard.terms_and_conditions || "",
        giftcard_is_gst: giftCard.giftcard_is_gst || false,
        giftcard_tax_amount: giftCard.giftcard_tax_amount || "",
        giftcard_tax_percent: giftCard.giftcard_tax_percent || "",
        vendor_user: giftCard.vendor_user,
        card_code: giftCard.card_code,
      });
      setBenefits(giftCard.Benefits || []);
      setPaymentModes(giftCard.giftcard_payment_mode || []);
      setServiceIncludes(giftCard.service_includes || []);
    }
  }, [isEdit, giftCard]);

  // All handlers unchanged (same as before)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addBenefit = () => setBenefits([...benefits, { service: "", value: "" }]);
  const updateBenefit = (i, field, val) => {
    const updated = [...benefits];
    updated[i][field] = val;
    setBenefits(updated);
    setForm((p) => ({ ...p, Benefits: updated }));
  };
  const removeBenefit = (i) => {
    setBenefits(benefits.filter((_, idx) => idx !== i));
    setForm((p) => ({ ...p, Benefits: benefits.filter((_, idx) => idx !== i) }));
  };

  const addPaymentMode = () => setPaymentModes([...paymentModes, ""]);
  const updatePaymentMode = (i, val) => {
    const updated = [...paymentModes];
    updated[i] = val;
    setPaymentModes(updated);
    setForm((p) => ({ ...p, giftcard_payment_mode: updated }));
  };
  const removePaymentMode = (i) => {
    setPaymentModes(paymentModes.filter((_, idx) => idx !== i));
    setForm((p) => ({ ...p, giftcard_payment_mode: paymentModes.filter((_, idx) => idx !== i) }));
  };

  const addServiceInclude = () => setServiceIncludes([...serviceIncludes, ""]);
  const updateServiceInclude = (i, val) => {
    const updated = [...serviceIncludes];
    updated[i] = val;
    setServiceIncludes(updated);
    setForm((p) => ({ ...p, service_includes: updated }));
  };
  const removeServiceInclude = (i) => {
    setServiceIncludes(serviceIncludes.filter((_, idx) => idx !== i));
    setForm((p) => ({ ...p, service_includes: serviceIncludes.filter((_, idx) => idx !== i) }));
  };

  const getDiscountedPrice = () => {
    const price = parseFloat(form.purchase_price) || 0;
    const disc = parseFloat(form.discount_percentage) || 0;
    return (price - (price * disc) / 100).toFixed(2);
  };
  useEffect(() => {
    if (form.purchase_price && form.discount_percentage) {
      const discounted = getDiscountedPrice();
      setForm((p) => ({ ...p, purchase_discounted_price: discounted, final_amount: discounted }));
    }
  }, [form.purchase_price, form.discount_percentage]);

  const getTaxAmount = () => {
    const final = parseFloat(form.final_amount) || 0;
    if (!form.giftcard_is_gst) return "0.00";
    const pct = parseFloat(form.giftcard_tax_percent) || 0;
    return ((final * pct) / 100).toFixed(2);
  };
  useEffect(() => {
    if (form.giftcard_is_gst && form.giftcard_tax_percent && form.final_amount) {
      setForm((p) => ({ ...p, giftcard_tax_amount: getTaxAmount() }));
    }
  }, [form.giftcard_is_gst, form.giftcard_tax_percent, form.final_amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    

    let branchId = localStorage.getItem("branchId") || "";

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (["Benefits", "giftcard_payment_mode", "service_includes", "branchId"].includes(key)) {
        formData.append(key, JSON.stringify(form[key]));
      } else if (form[key] !== null && form[key] !== undefined && key !== "giftcard_use_history") {
        formData.append(key, form[key]);
      }
    });

    const url = isEdit
      ? `https://backendapi.trakky.in/salonvendor/giftcards/${giftCard.id}/`
      : "https://backendapi.trakky.in/salonvendor/giftcards";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${authTokens?.access_token}` },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(isEdit ? "Updated!" : "Created!");
        onClose ? onClose() : navigate("/catalogue/gift-card-list");
      } else {
        toast.error(data.detail || "Failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white p-4 md:p-8 overflow-y-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Gift Card" : "Create New Gift Card"}
        </h2>
        <button onClick={onClose || (() => navigate(-1))} className="text-gray-500 hover:text-gray-800">
          <Close fontSize="large" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ===================== LEFT COLUMN ===================== */}
          <div className="space-y-6">

            {/* Purchase Customer */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Purchase Customer</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="giftcard_purchase_customer_name"
                    value={form.giftcard_purchase_customer_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) handleChange(e);
                    }}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="giftcard_purchase_customer_phone"
                    value={form.giftcard_purchase_customer_phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value) && value.length <= 10) handleChange(e);
                    }}
                    required
                    maxLength="10"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="10-digit phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="giftcard_purchase_Customer_gender"
                    value={form.giftcard_purchase_Customer_gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Benefitted Customer */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Benefitted Customer</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="giftcard_benefitted_customer_name"
                    value={form.giftcard_benefitted_customer_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) handleChange(e);
                    }}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="giftcard_benefitted_customer_phone"
                    value={form.giftcard_benefitted_customer_phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value) && value.length <= 10) handleChange(e);
                    }}
                    required
                    maxLength="10"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="giftcard_benefitted_Customer_gender"
                    value={form.giftcard_benefitted_Customer_gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gift Card Name & Pricing */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Gift Card Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gift Card Name</label>
                  <input
                    name="giftcard_name"
                    value={form.giftcard_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) handleChange(e);
                    }}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
                  <input type="number" step="0.01" name="purchase_price" value={form.purchase_price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input type="number" step="0.01" name="discount_percentage" value={form.discount_percentage} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Auto)</label>
                  <input value={getDiscountedPrice()} disabled className="w-full px-4 py-2 border bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Validity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" name="Start_date" value={form.Start_date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

          </div>

          {/* ===================== RIGHT COLUMN ===================== */}
          <div className="space-y-6">

            {/* Benefits */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-indigo-700">Benefits</h3>
                <button type="button" onClick={addBenefit} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">+ Add</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <input placeholder="Service" value={b.service} onChange={e => updateBenefit(i, "service", e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" />
                    <input type="number" step="0.01" placeholder="₹" value={b.value} onChange={e => updateBenefit(i, "value", e.target.value)} className="w-24 px-3 py-2 border rounded text-sm" />
                    <button type="button" onClick={() => removeBenefit(i)} className="text-red-600 hover:text-red-800">×</button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-gray-600">Total Benefits (₹)</label>
                  <input type="number" step="0.01" name="total_price_benefits" value={form.total_price_benefits} onChange={handleChange} required className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Remaining (₹)</label>
                  <input type="number" step="0.01" name="remaining_price_benefits" value={form.remaining_price_benefits} onChange={handleChange} required className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">Payment Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                  <input type="number" step="0.01" name="amount_paid" value={form.amount_paid} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining to Pay (₹)</label>
                  <input type="number" step="0.01" name="remaining_amount_to_paid" value={form.remaining_amount_to_paid} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Payment Modes</h4>
                  <button type="button" onClick={addPaymentMode} className="text-xs text-indigo-600 hover:underline">+ Add</button>
                </div>
                <div className="space-y-2">
                  {paymentModes.map((m, i) => (
                    <div key={i} className="flex gap-4">
                      <input value={m} onChange={e => updatePaymentMode(i, e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" placeholder="Cash, UPI..." />
                      <button type="button" onClick={() => removePaymentMode(i)} className="text-red-600">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Includes */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-indigo-700">Service Includes</h3>
                <button type="button" onClick={addServiceInclude} className="text-xs text-indigo-600 hover:underline">+ Add</button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {serviceIncludes.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <input value={s} onChange={e => updateServiceInclude(i, e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" placeholder="Hair Cut, Spa..." />
                    <button type="button" onClick={() => removeServiceInclude(i)} className="text-red-600">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & GST */}
            <div className="bg-gray-50 p-5 rounded-xl border space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                <textarea name="terms_and_conditions" rows={4} value={form.terms_and_conditions} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" name="giftcard_is_gst" checked={form.giftcard_is_gst} onChange={handleChange} className="h-5 w-5 text-indigo-600" />
                <label className="font-medium">Include GST</label>
              </div>

              {form.giftcard_is_gst && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percent (%)</label>
                    <input type="text" name="giftcard_tax_percent" value={form.giftcard_tax_percent} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount (Auto)</label>
                    <input value={getTaxAmount()} disabled className="w-full px-4 py-2 border bg-gray-200 rounded-lg" />
                  </div>
                </div>
              )}
            </div>

            {/* Read-only Fields (Edit Mode) */}
            {isEdit && (
              <div className="bg-gray-100 p-5 rounded-xl border">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Card Info (Read Only)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium">Card Code</label>
                    <p className="mt-1 text-gray-600">{form.card_code || "-"}</p>
                  </div>
                  <div>
                    <label className="font-medium">Vendor</label>
                    <p className="mt-1 text-gray-600">{giftCard?.vendor_name || "-"}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-8 border-t mt-8">
          <button type="button" onClick={onClose || (() => navigate(-1))} className="px-8 py-3 border rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white rounded-xl flex items-center gap-4 hover:bg-gray-800 disabled:opacity-50 font-medium"
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : <><Add /> {isEdit ? "Update Gift Card" : "Create Gift Card"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormForGiftCard;