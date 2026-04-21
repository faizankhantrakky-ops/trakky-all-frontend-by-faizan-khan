import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../Context/Auth";
import { Box, Modal, TextField } from "@mui/material";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  UserCheck,
  User,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  PieChart,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { confirm } from "material-ui-confirm";

const DailyExpensesBody = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    paid_to: "",
    paid_from: ""
  });
  const [errors, setErrors] = useState({});
  const [dailyExpensData, setDailyExpensData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [editDailyExpense, setEditDailyExpense] = useState(null);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    averageExpense: 0,
    highestExpense: 0,
    recentExpenses: 0
  });

  const fetchData = async () => {
    setLoading(true);
    if (!authTokens) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/daily-expensis/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setDailyExpensData(responseData);
        calculateStats(responseData);
      } else {
        toast.error("Error while fetching data");
      }
    } catch (error) {
      toast.error("Error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const average = data.length > 0 ? total / data.length : 0;
    const highest = data.length > 0 ? Math.max(...data.map(item => item.amount || 0)) : 0;
    
    // Count recent expenses (today's expenses)
    const today = dayjs().format('YYYY-MM-DD');
    const recentExpenses = data.filter(item => 
      dayjs(item.created_at).format('YYYY-MM-DD') === today
    ).length;

    setTotalAmount(total);
    setStats({
      totalExpenses: data.length,
      averageExpense: Math.round(average),
      highestExpense: highest,
      recentExpenses: recentExpenses
    });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleOpen = () => {
    setOpen(true);
    setEditDailyExpense(null);
    setFormData({ name: "", amount: "", paid_to: "", paid_from: "" });
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setEditDailyExpense(null);
    setFormData({ name: "", amount: "", paid_to: "", paid_from: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid positive amount";
    } else if (parseFloat(formData.amount) > 10000000000) {
      newErrors.amount = "Amount is too large";
    }
    
    // Paid to validation (only characters allowed)
    if (!formData.paid_to.trim()) {
      newErrors.paid_to = "Paid to is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.paid_to)) {
      newErrors.paid_to = "Only letters and spaces allowed";
    } else if (formData.paid_to.length > 100) {
      newErrors.paid_to = "Maximum 100 characters allowed";
    }
    
    // Paid from validation (only characters allowed)
    if (!formData.paid_from.trim()) {
      newErrors.paid_from = "Paid by is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.paid_from)) {
      newErrors.paid_from = "Only letters and spaces allowed";
    } else if (formData.paid_from.length > 100) {
      newErrors.paid_from = "Maximum 100 characters allowed";
    }
    
    // Expense details validation
    if (!formData.name.trim()) {
      newErrors.name = "Expense details are required";
    } else if (formData.name.length > 200) {
      newErrors.name = "Maximum 200 characters allowed";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isEdit = false) => {
    if (!validateForm()) {
      toast.error("Please fix the error's in the form");
      return;
    }

    const expenseData = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      paid_to: formData.paid_to.trim(),
      paid_from: formData.paid_from.trim(),
    };

    try {
      const url = isEdit 
        ? `https://backendapi.trakky.in/spavendor/daily-expensis/${editDailyExpense?.id}/`
        : "https://backendapi.trakky.in/spavendor/daily-expensis/";
      
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          authorization: `Bearer ${authTokens.access_token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        toast.success(isEdit ? "Expense updated successfully" : "Expense added successfully");
        handleClose();
        fetchData();
      } else {
        toast.error(`Error while ${isEdit ? 'updating' : 'adding'} expense`);
      }
    } catch (error) {
      toast.error(`Error while ${isEdit ? 'updating' : 'adding'} expense`);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/daily-expensis/${id}/`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${authTokens.access_token}`,
            "content-type": "application/json",
          },
        }
      );

      if (response.ok) {
        setDailyExpensData(dailyExpensData.filter((item) => item.id !== id));
        toast.success("Expense Deleted Successfully");
        fetchData();
      } else {
        toast.error("Error deleting expense");
      }
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const handleEditClick = (item) => {
    setEditDailyExpense(item);
    setFormData({
      name: item.name || "",
      amount: item.amount || "",
      paid_to: item.paid_to || "",
      paid_from: item.paid_from || ""
    });
    setOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  const formatDateRange = () => {
    const start = dayjs(startDate).format("DD MMM YYYY");
    const end = dayjs(endDate).format("DD MMM YYYY");
    return `${start} - ${end}`;
  };

  return (
    <div className="w-full px-6 lg:px-4 py-6 bg-white">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Expenses</h1>
            <p className="text-gray-600">Track and manage all your business expenses</p>
          </div>
          
          <div className="flex items-center space-x-3">
          
            <button 
              onClick={handleOpen}
              className="px-4 py-2 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
{/* Stats Cards */}


<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">

  {/* Total Expenses */}
  <div className="bg-white border border-gray-200 border-b-4 border-b-blue-500 
                  rounded-lg p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Total Expenses
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">
          ₹{totalAmount.toLocaleString()}
        </p>
      </div>
      <TrendingUp className="h-6 w-6 text-blue-500" />
    </div>
  </div>

  {/* Total Transactions */}
  <div className="bg-white border border-gray-200 border-b-4 border-b-green-500 
                  rounded-lg p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Total Transactions
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">
          {stats.totalExpenses}
        </p>
      </div>
      <PieChart className="h-6 w-6 text-green-500" />
    </div>
  </div>

  {/* Highest Expense */}
  <div className="bg-white border border-gray-200 border-b-4 border-b-purple-500 
                  rounded-lg p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Highest Expense
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">
          ₹{stats.highestExpense.toLocaleString()}
        </p>
      </div>
      <IndianRupee className="h-6 w-6 text-purple-500" />
    </div>
  </div>

  {/* Average Expense */}
  <div className="bg-white border border-gray-200 border-b-4 border-b-amber-500 
                  rounded-lg p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">
          Average Expense
        </p>
        <p className="text-2xl font-semibold text-gray-900 mt-2">
          ₹{stats.averageExpense.toLocaleString()}
        </p>
      </div>
      <FileText className="h-6 w-6 text-amber-500" />
    </div>
  </div>

</div>



        {/* Date Range Display */}
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">Selected Period:</span>
            <span className="ml-2 font-semibold text-gray-900">{formatDateRange()}</span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">#</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Expense Details</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Amount</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Paid To</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Paid By</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Date</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <CircularProgress
                      sx={{
                        color: "#492DBD",
                      }}
                    />
                    <p className="mt-2 text-gray-600">Loading expenses data...</p>
                  </td>
                </tr>
              ) : dailyExpensData?.length > 0 ? (
                dailyExpensData?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-bold text-gray-900">₹{item.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700">{item.paid_to}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-sm text-gray-700">{item.paid_from}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{formatDate(item.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-gray-500 hover:text-[#492DBD] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(item.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No expenses found for this period</p>
                    <p className="text-sm text-gray-400 mt-1">Add expenses to start tracking</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] rounded-lg mr-3">
                {editDailyExpense ? (
                  <Edit2 className="h-6 w-6 text-white" />
                ) : (
                  <Plus className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editDailyExpense ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p className="text-sm text-gray-600">
                  {editDailyExpense ? "Update expense details" : "Enter new expense details"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
                  Amount *
                </label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              </div>

              {/* Paid To Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                  Paid To *
                </label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter recipient name"
                  value={formData.paid_to}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                    handleFormChange('paid_to', value);
                  }}
                  error={!!errors.paid_to}
                  helperText={errors.paid_to}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
                {formData.paid_to && !/^[A-Za-z\s]+$/.test(formData.paid_to) && (
                  <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed</p>
                )}
              </div>

              {/* Paid By Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Paid By *
                </label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter payer name"
                  value={formData.paid_from}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                    handleFormChange('paid_from', value);
                  }}
                  error={!!errors.paid_from}
                  helperText={errors.paid_from}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
                {formData.paid_from && !/^[A-Za-z\s]+$/.test(formData.paid_from) && (
                  <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed</p>
                )}
              </div>
            </div>

            {/* Expense Details Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Expense Details *
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter expense description"
                multiline
                rows={3}
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>

            {/* Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                </div>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(!!editDailyExpense)}
                className="px-4 py-2 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {editDailyExpense ? "Update Expense" : "Save Expense"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailyExpensesBody;