import React, { useContext, useEffect, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import AuthContext from "../../Context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import GeneralModal from "../generalModal/GeneralModal";
import RegisterStaff from "./RegisterStaff";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  Briefcase,
  Clock,
  Edit2,
  Trash2,
  Users,
  Award,
  TrendingUp,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { Link } from "react-router-dom";

function StaffRecord({ startDate, endDate }) {
  const { authTokens } = useContext(AuthContext);
  const token = authTokens.access_token;
  const [staffData, setStaffData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStaff: 0,
    permanent: 0,
    temporary: 0,
    activeStaff: 0
  });
  const confirm = useConfirm();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalOpenData, setEditModalOpenData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/staff/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStaffData(data);
        setFilteredData(data);
        calculateStats(data);
      } else {
        throw new Error("Error fetching staff data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const permanent = data.filter(staff => staff.is_permanent).length;
    const temporary = data.length - permanent;
    
    setStats({
      totalStaff: data.length,
      permanent,
      temporary,
      activeStaff: data.filter(staff => staff.appointments > 0).length
    });
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    let filtered = staffData;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(staff =>
        staff.staffname.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(staff => 
        selectedFilter === "permanent" ? staff.is_permanent : !staff.is_permanent
      );
    }
    
    setFilteredData(filtered);
  }, [search, selectedFilter, staffData]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/staff/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStaffData(staffData.filter((staff) => staff.id !== id));
        toast.success("Staff Deleted Successfully");
      } else {
        const responseData = await response.json();
        console.log("Error deleting staff", responseData);
        throw new Error("Error deleting staff");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete staff");
    }
  };

  const handleDeleteConfirmation = (id) => {
    confirm({ description: "Are you sure you want to delete this staff?" })
      .then(() => handleDelete(id))
      .catch(() => console.log("Deletion cancelled."));
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <Toaster position="top-right" />
      
      {/* Header and Controls */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Records</h1>
            <p className="text-gray-600">
              Comprehensive staff database and management
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
           
           <Link to={'/staffmanagement/staffform'}>
            <button className="px-4 py-2 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center">
              <User className="w-4 h-4 mr-2" />
              Add Staff
            </button>
           </Link>
          </div>
        </div>

       

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                placeholder="Search by staff name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#492DBD] focus:border-transparent"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Staff</option>
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg">
              Showing {filteredData.length} of {staffData.length} staff
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Staff Details
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Employment
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Performance
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Compensation
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </div>
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <CircularProgress
                      sx={{
                        color: "#492DBD",
                      }}
                    />
                    <p className="mt-2 text-gray-600">Loading staff records...</p>
                  </td>
                </tr>
              ) : filteredData?.length > 0 ? (
                filteredData?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* Staff Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {item?.staffname?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item?.staffname}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {item?.ph_number || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {item?.email || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{item?.gender}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Employment */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item?.is_permanent 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item?.is_permanent ? "Permanent" : "Temporary"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined: {item?.joining_date || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item?.address ? (
                            <span className="truncate max-w-[150px]" title={item.address}>
                              {item.address}
                            </span>
                          ) : "N/A"}
                        </div>
                      </div>
                    </td>
                    
                    {/* Performance */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Appointments:</span>
                          <span className="text-sm font-medium text-gray-900">{item?.appointments || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Attendance:</span>
                          <span className="text-sm font-medium text-gray-900">{item?.staff_attendance || "N/A"}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((item?.appointments || 0) * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Compensation */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Salary:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {item?.salary ? `₹${item.salary}` : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Amount Paid:</span>
                          <span className="text-sm font-medium text-green-700">
                            {item?.amount_paid ? `₹${item.amount_paid}` : "N/A"}
                          </span>
                        </div>
                        {item?.salary && item?.amount_paid && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min((item.amount_paid / item.salary) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Documents */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center">
                        {item?.id_proof ? (
                          <>
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mb-2">
                              <img
                                src={item.id_proof}
                                alt="ID Proof"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              <Eye className="h-3 w-3 inline mr-1" />
                              View
                            </button>
                          </>
                        ) : (
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">No ID Proof</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditModalOpenData(item);
                            setEditModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-[#492DBD] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Staff"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(item?.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Staff"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No staff records found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {search ? "Try adjusting your search" : "Add staff members to see records"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GeneralModal
        open={editModalOpen}
        handleClose={() => {
          setEditModalOpenData({});
          setEditModalOpen(false);
        }}
      >
        <RegisterStaff 
          staffData={editModalOpenData} 
          handleClose={() => {
            setEditModalOpenData({});
            setEditModalOpen(false);
          }}
          fetchData={fetchData}
        />
      </GeneralModal>
    </div>
  );
}

export default StaffRecord;