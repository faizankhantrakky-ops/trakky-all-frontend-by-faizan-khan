import React, { useContext, useEffect, useState } from "react";
import { Modal, Typography, Box, Button, TextField, Tab, Tabs } from "@mui/material";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AuthContext from "../Context/Auth";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import AsyncSelect from "react-select/async";
import { DateRange } from 'react-date-range';
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Lucide React Icons
import {
  Search,
  User,
  Phone,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Edit2,
  X,
  Users,
  FileText,
  Award,
  ChevronDown,
  BarChart3,
  Tag,
  Clock,
  IndianRupee,
  CheckCircle,
  UserPlus,
  UserCheck,
  CalendarDays,
  Download,
  Mail,
  MapPin
} from 'lucide-react';

const Clients = () => {
  const { authTokens } = useContext(AuthContext);

  const [itemCustomerName, setItemCustomerName] = useState('');
  const [itemCustomerPhone, setItemCustomerPhone] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateFilterType, setDateFilterType] = useState('all');
  const [filterStats, setFilterStats] = useState({
    totalCustomers: 0,
    totalAppointments: 0,
    totalMemberships: 0
  });
  const [appointmentDate, setAppointmentDate] = useState(dayjs());

  const customerTypeOptions = [
    { value: 'all', label: 'All Customer Types' },
    { value: 'new', label: 'New Customers' },
    { value: 'regular', label: 'Regular Customers' }
  ];

  const datePresetOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const filterCustomerTypes = (inputValue) => {
    return customerTypeOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue) =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(filterCustomerTypes(inputValue));
      }, 300);
    });

  const handleCustomerTypeFilter = (selectedOption) => {
    setCustomerTypeFilter(selectedOption);
  };

  const applyDateFilter = (type) => {
    const today = new Date();
    let startDate, endDate;

    switch (type) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = subDays(today, 1);
        endDate = subDays(today, 1);
        break;
      case 'last7':
        startDate = subDays(today, 7);
        endDate = new Date(today);
        break;
      case 'last30':
        startDate = subDays(today, 30);
        endDate = new Date(today);
        break;
      case 'thisWeek':
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case 'thisMonth':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      default:
        startDate = null;
        endDate = null;
    }

    if (startDate && endDate) {
      setDateFilter({ startDate, endDate });
      setDateRange([{ startDate, endDate, key: 'selection' }]);
    }
  };

  const applyCustomDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
  };

  const formatDateRangeDisplay = () => {
    if (!dateFilter) return "All Dates";

    if (dateFilterType === 'today' || dateFilterType === 'yesterday') {
      return format(dateFilter.startDate, 'MMM dd, yyyy');
    }

    if (dateFilterType === 'thisWeek' || dateFilterType === 'last7') {
      return `${format(dateFilter.startDate, 'MMM dd')} - ${format(dateFilter.endDate, 'MMM dd, yyyy')}`;
    }

    if (dateFilterType === 'thisMonth' || dateFilterType === 'last30') {
      return `${format(dateFilter.startDate, 'MMM dd')} - ${format(dateFilter.endDate, 'MMM dd, yyyy')}`;
    }

    if (dateFilterType === 'custom') {
      return `${format(dateFilter.startDate, 'MMM dd, yyyy')} - ${format(dateFilter.endDate, 'MMM dd, yyyy')}`;
    }

    return "All Dates";
  };

  const calculateFilterStats = (filteredData) => {
    let totalAppointments = 0;
    let totalMemberships = 0;

    filteredData.forEach(client => {
      totalAppointments += client.appointments_count || 0;
      totalMemberships += client.memberships_count || 0;
    });

    setFilterStats({
      totalCustomers: filteredData.length,
      totalAppointments,
      totalMemberships
    });
  };

  useEffect(() => {
    let filtered = customer;

    if (customerTypeFilter && customerTypeFilter.value !== "all") {
      filtered = filtered.filter(client => client.customer_type === customerTypeFilter.value);
    }

    if (dateFilter) {
      filtered = filtered.filter(client => {
        if (!client.appointments || client.appointments.length === 0) return false;

        return client.appointments.some(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= dateFilter.startDate &&
            appointmentDate <= dateFilter.endDate;
        });
      });
    }

    if (search !== "") {
      filtered = filtered.filter((cust) =>
        cust?.customer_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterData(filtered);
    calculateFilterStats(filtered);
  }, [search, customer, customerTypeFilter, dateFilter]);

  const filteredAppointments = selectedClient?.appointments?.filter(item => {
    if (!appointmentDate) return true;
    const itemDate = dayjs(item.date).format("YYYY-MM-DD");
    return itemDate === appointmentDate.format("YYYY-MM-DD");
  }) || [];

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedClient(null);
  };

  const handleClickOpen = (client) => {
    setSelectedClient(client);
    setViewModalOpen(true);
  }

  const handleClickClose = () => {
    setViewModalOpen(false);
    setSelectedClient(null);
    setSelectedTab(0);
  }

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    setCustomer((prevData) =>
      prevData.map((client) =>
        client.number === selectedClient.number ? selectedClient : client
      )
    );
    handleEditModalClose();
  };

  const getCustomerData = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/customer-table/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        setFilterData(data);
        calculateFilterStats(data);
        setSelectedClient(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlEditDdetails = async (e) => {
    e.preventDefault();

    const data = {
      customer_name: itemCustomerName,
      customer_phone: itemCustomerPhone,
    };

    try {
      const res = await fetch(`https://backendapi.trakky.in/spavendor/customer-table/${selectedClient?.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access_token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Client Details Updated Successfully");
        setItemCustomerName('');
        setItemCustomerPhone('');
        setSelectedClient(null);
        getCustomerData();
        handleEditModalClose();
      }
      else {
        toast.error('Please give proper credentials')
      }

    }
    catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  }

  useEffect(() => {
    getCustomerData();
  }, []);

  useEffect(() => {
    setItemCustomerName(selectedClient?.customer_name);
    setItemCustomerPhone(selectedClient?.customer_phone);
  }, [selectedClient]);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderCategoryTable = () => {
    if (!selectedClient) return null;

    if (selectedTab === 0) {
      return (
        <div className="w-full overflow-hidden">
          <div className="flex justify-end mb-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="relative">
                <DatePicker
                  sx={{
                    backgroundColor: "white",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '40px'
                    }
                  }}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e)}
                />
              </div>
            </LocalizationProvider>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Customer Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Appointment Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actual Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Final Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Paid</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-800">{appointment.customer_name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.customer_type === 'new' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appointment.customer_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{appointment.date}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{appointment.actual_amount}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{appointment.final_amount}</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-700">₹{appointment.amount_paid}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.appointment_status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : appointment.appointment_status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.appointment_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p>No appointments found for this date</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    else if (selectedTab === 1) {
      return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Membership Plan</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Start Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Total Points</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Remaining Points</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Validity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedClient.membership && selectedClient.membership.length > 0 ? (
                selectedClient.membership.map((membership, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-purple-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{membership.membership_type_detail?.membership_name}</div>
                          <div className="text-xs text-gray-500">Code: {membership.membership_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{membership.created_at?.split("T")?.[0]}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{membership?.membership_type_detail?.total_point}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{membership?.remaining_point}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {membership?.membership_type_detail?.validity_in_months} months
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <Award className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No membership found for this client</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pl-0 md:pl-[72px]">
      {/* Main Header */}
      <div className="">
        <div className="px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Customer Management</h1>
              <p className="">Manage and analyze your client relationships</p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#482DBC] focus:border-transparent"
              placeholder="Search by customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex flex-wrap gap-3">
           

            <div className="relative w-48">
              <select
                className="w-full h-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#482DBC] focus:border-transparent appearance-none"
                value={dateFilterType}
                onChange={(e) => {
                  setDateFilterType(e.target.value);
                  if (e.target.value === 'all') {
                    setDateFilter(null);
                    setShowDatePicker(false);
                  } else if (e.target.value === 'custom') {
                    setShowDatePicker(true);
                  } else {
                    setShowDatePicker(false);
                    applyDateFilter(e.target.value);
                  }
                }}
              >
                {datePresetOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <button
              className="flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => {
                setSearch("");
                setCustomerTypeFilter(null);
                setDateFilter(null);
                setDateFilterType('all');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Stats Cards */}
     <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">

    {/* Clients */}
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
          <Users className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Clients
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {filterStats.totalCustomers}
          </p>
        </div>
      </div>

      <span className="text-xs text-blue-600 font-medium">
        Active
      </span>
    </div>

    {/* Appointments */}
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100">
          <Calendar className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Appointments
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {filterStats.totalAppointments}
          </p>
        </div>
      </div>

      <span className="text-xs text-emerald-600 font-medium">
        Today
      </span>
    </div>

    {/* Memberships */}
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-violet-100">
          <Award className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Memberships
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {filterStats.totalMemberships}
          </p>
        </div>
      </div>

      <span className="text-xs text-violet-600 font-medium">
        Premium
      </span>
    </div>

  </div>
</div>


        {/* Date Range Display */}
        {dateFilterType !== 'all' && (
          <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-700">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-2">Date Range:</span>
              <span className="text-gray-900">{formatDateRangeDisplay()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Picker */}
      {showDatePicker && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
          <DateRange
            editableDateInputs={true}
            onChange={item => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setShowDatePicker(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-[#482DBC] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => {
                applyCustomDateFilter(dateRange[0].startDate, dateRange[0].endDate);
                setShowDatePicker(false);
              }}
            >
              Apply Date Range
            </button>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Sr. No</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Client Details</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Customer Type</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Appointments</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Memberships</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <CircularProgress
                        sx={{
                          color: "#482DBC",
                        }}
                      />
                      <p className="mt-2 text-gray-600">Loading client data...</p>
                    </td>
                  </tr>
                ) : filterData?.length > 0 ? (
                  filterData?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#482DBC] to-[#5D46E0] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {item?.customer_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item?.customer_name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {item?.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item?.customer_type === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item?.customer_type === 'new' ? (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              New
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Regular
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{item?.appointments_count}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{item?.memberships_count}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleClickOpen(item)}
                            className="p-2 text-gray-500 hover:text-[#482DBC] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-gray-500 hover:text-[#482DBC] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Client"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">No clients found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Edit2 className="h-6 w-6 text-[#482DBC]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Client Details</h2>
            </div>
            <button
              onClick={handleEditModalClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {selectedClient && (
            <form onSubmit={handlEditDdetails}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={itemCustomerName}
                    onChange={(e) => setItemCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482DBC] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={itemCustomerPhone}
                    onChange={(e) => {
                      if (e.target.value.length <= 10) {
                        setItemCustomerPhone(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482DBC] focus:border-transparent"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">Previous: {selectedClient?.customer_phone}</p>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-[#482DBC] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={viewModalOpen} onClose={handleClickClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-[#482DBC] to-[#5D46E0] rounded-lg mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Client Details</h2>
                <p className="text-sm text-gray-600">Complete profile and activity history</p>
              </div>
            </div>
            <button
              onClick={handleClickClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedClient && (
            <div className="p-8">
              {/* Client Info Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-3">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#482DBC]" />
                    Basic Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Full Name</div>
                        <div className="font-medium text-gray-900">{selectedClient?.customer_name}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Phone Number</div>
                        <div className="font-medium text-gray-900">{selectedClient?.customer_phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-500 mr-3" />
                      <div>
                        <div className="text-sm text-gray-600">Customer Type</div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          selectedClient?.customer_type === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedClient?.customer_type === 'new' ? 'New Customer' : 'Regular Customer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-[#482DBC]" />
                    Activity Summary
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">Total Appointments</div>
                          <div className="font-medium text-gray-900">{selectedClient?.appointments_count}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Bookings</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-gray-500 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">Total Memberships</div>
                          <div className="font-medium text-gray-900">{selectedClient?.memberships_count}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Active Plans</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setSelectedTab(0)}
                    className={`pb-4 px-1 text-sm font-medium relative ${
                      selectedTab === 0
                        ? 'text-[#482DBC] border-b-2 border-[#482DBC]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointments
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedTab(1)}
                    className={`pb-4 px-1 text-sm font-medium relative ${
                      selectedTab === 1
                        ? 'text-[#482DBC] border-b-2 border-[#482DBC]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Membership
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {renderCategoryTable()}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Clients;