import React, { useContext, useEffect, useState } from "react";
import GeneralModal from "../generalModal/GeneralModal";
import StaffRatingModal from "./StaffRatingModal";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AuthContext from "../../Context/Auth";
import { 
  Person,
  Phone,
  CalendarToday,
  CheckCircle,
  EventNote,
  Star,
  AccountBalance,
  Payment,
} from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
const DashboardStaffDetails = ({ startDate, endDate }) => {
  const { authTokens } = useContext(AuthContext);

  const [staffData, setStaffData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // function to get staff data
  const getStaffData = async () => {
    setLoading(true);
    try {
      let url;

      if (startDate === null || endDate === null) {
        url = `https://backendapi.trakky.in/spavendor/staff-monthly-detail/`;
      } else {
        url = `https://backendapi.trakky.in/spavendor/staff-monthly-detail/?start_date=${startDate}&end_date=${endDate}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      });
      const data = await response.json();
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  // function to format date string
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  };

  // function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // function to sort data
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...staffData].sort((a, b) => {
      let aValue, bValue;

      if (key.includes('staff.')) {
        const nestedKey = key.split('.')[1];
        aValue = a.staff[nestedKey];
        bValue = b.staff[nestedKey];
      } else if (key.includes('attendance.')) {
        const nestedKey = key.split('.')[1];
        aValue = a.attendance_data?.[0]?.[nestedKey] || 0;
        bValue = b.attendance_data?.[0]?.[nestedKey] || 0;
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setStaffData(sortedData);
  };

  useEffect(() => {
    getStaffData();
  }, [startDate, endDate]);

  const tableHeaders = [
    { key: 'staff.staffname', label: 'Staff Member', icon: <Person className="w-4 h-4 mr-2" /> },
    { key: 'staff.ph_number', label: 'Contact', icon: <Phone className="w-4 h-4 mr-2" /> },
    { key: 'staff.joining_date', label: 'Joining Date', icon: <CalendarToday className="w-4 h-4 mr-2" /> },
    { key: 'attendance.total_attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4 mr-2" /> },
    { key: 'attendance.num_services_total', label: 'Services', icon: <EventNote className="w-4 h-4 mr-2" /> },
    { key: 'average_rating', label: 'Performance', icon: <Star className="w-4 h-4 mr-2" /> },
    { key: 'attendance.commission_total', label: 'Commission', icon: <AccountBalance className="w-4 h-4 mr-2" /> },
    { key: 'attendance.amount_paid_total', label: 'Amount Paid', icon: <Payment className="w-4 h-4 mr-2" /> },
    { key: 'staff.salary', label: 'Monthly Salary', icon: <CurrencyRupeeIcon className="w-4 h-4 mr-2" /> }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#482DBC] mb-4"></div>
        <p className="text-gray-600">Loading staff data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#482DBC] to-[#5D46E0] rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Team Management</h1>
            <p className="text-white/90">
              {staffData.length} staff members • Performance analytics for selected period
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="text-sm font-medium">Period: {formatDate(new Date(startDate))} - {formatDate(new Date(endDate))}</div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{staffData.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Person className="w-6 h-6 text-[#482DBC]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {staffData.reduce((sum, item) => sum + (item.attendance_data?.[0]?.num_services_total || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <EventNote className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(staffData.reduce((sum, item) => sum + (item.attendance_data?.[0]?.commission_total || 0), 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <AccountBalance className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Staff Performance Details</h2>
          <p className="text-sm text-gray-600 mt-1">Click on column headers to sort</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {tableHeaders.map((header) => (
                  <th 
                    key={header.key}
                    className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(header.key)}
                  >
                    <div className="flex items-center">
                      {header.icon}
                      {header.label}
                      {sortConfig.key === header.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffData.map((item) => {
                const attendanceData = item?.attendance_data?.[0] || {};
                const rating = item?.average_rating || 0;
                
                return (
                  <tr 
                    key={item.staff.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#482DBC] to-[#5D46E0] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {item.staff.staffname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.staff.staffname}</div>
                          <div className="text-sm text-gray-500">ID: {item.staff.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{item.staff.ph_number}</div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        <CalendarToday className="w-3 h-3 mr-1" />
                        {formatDate(item.staff.joining_date)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min((attendanceData.total_attendance || 0) * 10, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{attendanceData.total_attendance || 0}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{attendanceData.num_services_total || 0}</div>
                      <div className="text-sm text-gray-500">services</div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-lg font-semibold ${
                          rating >= 4 ? 'bg-green-100 text-green-800' :
                          rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rating.toFixed(1)}
                          <Star className="w-3 h-3 ml-1 inline" />
                        </div>
                        {rating > 0 && (
                          <InfoOutlinedIcon
                            className="ml-2 cursor-pointer text-gray-400 hover:text-[#482DBC] transition-colors"
                            onClick={() => {
                              setShowModal(true);
                              setSelectedStaff(item);
                            }}
                          />
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(attendanceData.commission_total || 0)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-semibold text-green-700">
                        {formatCurrency(attendanceData.amount_paid_total || 0)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-300">
                        {formatCurrency(item.staff.salary || 0)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold">{staffData.length}</span> staff members
            </div>
            <div className="mt-2 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Good Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>Average Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span>Needs Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeneralModal open={showModal} handleClose={() => setShowModal(false)}>
        <StaffRatingModal staff={selectedStaff} />
      </GeneralModal>
    </div>
  );
};

export default DashboardStaffDetails;