import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/Auth";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import toast, { Toaster } from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  TrendingUp,
  Edit2,
  Save
} from 'lucide-react';

function DailySheet({ date }) {
  const { authTokens } = useContext(AuthContext);
  const [staffData, setStaffData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formatisedData, setFormatisedData] = useState([]);
  const [stats, setStats] = useState({
    totalStaff: 0,
    present: 0,
    absent: 0,
    totalServices: 0
  });

  const getStaffData = async () => {
    try {
      const response = await fetch(
        "https://backendapi.trakky.in/spavendor/staff/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setStaffData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStaffAttendanceData = async () => {
    try {
      const response = await fetch(
        `https://backendapi.trakky.in/spavendor/staff/attendance/?date=${date}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );
      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStaffData();
    getStaffAttendanceData();
  }, [authTokens, date]);

  useEffect(() => {
    if (staffData?.length > 0) {
      const formatiseD = staffData.map((staff) => {
        const staffAttendance = attendanceData.find(
          (attendance) => attendance.staff === staff.id
        );
        if (staffAttendance) {
          return {
            id: staff.id,
            staffname: staff.staffname,
            present: staffAttendance.present,
            num_services: staffAttendance.num_services,
            time_in: staffAttendance.time_in,
            time_out: staffAttendance.time_out,
            attendance_id: staffAttendance.id,
          };
        } else {
          return {
            id: staff.id,
            staffname: staff.staffname,
            present: false,
            num_services: 0,
            time_in: "-",
            time_out: "-",
            attendance_id: null,
          };
        }
      });

      setFormatisedData(formatiseD);

      // Calculate stats
      const presentCount = formatiseD.filter(item => item.present).length;
      const absentCount = formatiseD.length - presentCount;
      const totalServices = formatiseD.reduce((sum, item) => sum + (item.num_services || 0), 0);

      setStats({
        totalStaff: formatiseD.length,
        present: presentCount,
        absent: absentCount,
        totalServices: totalServices
      });
    }
  }, [attendanceData, staffData]);

  const [editOpen, setEditOpen] = useState(false);
  const [editPresent, setEditPresent] = useState(false);
  const [editTimeIn, setEditTimeIn] = useState(null);
  const [editTimeOut, setEditTimeOut] = useState(null);
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [editStaffData, setEditStaffData] = useState(null);

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPresent(null);
    setEditTimeIn("");
    setEditTimeOut("");
    setEditAttendanceId(null);
    setEditStaffData(null);
  };

  const handleStaffAttendence = async () => {
    let errors = [];

    let formatedTimeIn = editTimeIn?.format("HH:mm:ss");
    let formatedTimeOut = editTimeOut?.format("HH:mm:ss");

    // if present is true, then time in must be provided
    // if time out is provided, then time in must be provided
    if (editPresent && (formatedTimeIn == "Invalid Date")) {
      errors.push("Time in is required");
    }

    if (formatedTimeOut != "Invalid Date" && formatedTimeIn == "Invalid Date") {
      errors.push("Time in is required");
    }

    // if absent, then time in and time out must be null
    if (!editPresent && (formatedTimeIn != "Invalid Date" || formatedTimeOut != "Invalid Date")) {
      errors.push("Time in and time out must be null");
    }

    if (errors.length > 0) {
      toast.error(errors.join(" "));
      return;
    }

    let payload = {};

    if (editPresent) {
      payload = {
        present: editPresent,
        time_in:
          editTimeIn?.format("HH:mm:ss") != "Invalid Date"
            ? editTimeIn.format("HH:mm:ss")
            : null,
        time_out:
          editTimeOut?.format("HH:mm:ss") != "Invalid Date"
            ? editTimeOut.format("HH:mm:ss")
            : null,
        date: date,
        staff: editStaffData?.id,
      };
    } else {
      payload = {
        present: editPresent,
        time_in: null,
        time_out: null,
        date: date,
        staff: editStaffData?.id,
      };
    }

    try {
      let resp = await fetch(
        `https://backendapi.trakky.in/spavendor/staff/attendance/${
          editAttendanceId ? editAttendanceId + "/" : ""
        }`,
        {
          method: editAttendanceId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      let data = await resp.json();

      if (resp.ok) {
        toast.success("Attendance updated successfully");
        getStaffAttendanceData();
        handleEditClose();
      } else {
        if (data.non_field_errors) {
          toast.error(data.non_field_errors.join(" "));
        } else {
          toast.error("You can only update today's attendance.");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update attendance");
    }
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <Toaster position="top-right" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStaff}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.present}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.absent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Display */}
      <div className="mb-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-medium">Attendance Date:</span>
          <span className="ml-2 font-semibold text-gray-900">{date}</span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Sr. No.</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Staff Member</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Status</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Services</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Time In</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Time Out</th>
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
                    <p className="mt-2 text-gray-600">Loading attendance data...</p>
                  </td>
                </tr>
              ) : formatisedData?.length > 0 ? (
                formatisedData?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-700 font-semibold mr-3">
                          {item?.staffname?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{item?.staffname}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item?.present 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item?.present ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Present
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Absent
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">{item?.num_services}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-700">{item?.time_in ?? "-"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-700">{item?.time_out ?? "-"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setEditOpen(true);
                          setEditPresent(item?.present);
                          setEditTimeOut(dayjs(item?.time_out, "HH:mm:ss"));
                          setEditTimeIn(dayjs(item?.time_in, "HH:mm:ss"));
                          setEditAttendanceId(item?.attendance_id);
                          setEditStaffData(item);
                        }}
                        className="p-2 text-gray-500 hover:text-[#492DBD] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Attendance"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No staff attendance data found</p>
                    <p className="text-sm text-gray-400 mt-1">Add staff members to see attendance records</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Edit2 className="h-6 w-6 text-[#492DBD]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Attendance</h2>
            </div>
            <button
              onClick={handleEditClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {editStaffData && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  value={editStaffData?.staffname}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Status</label>
                <FormControl fullWidth>
                  <Select
                    value={editPresent}
                    onChange={(e) => {
                      if (e.target.value == true) {
                        setEditPresent(true)
                      } else {
                        setEditPresent(false);
                        setEditTimeIn(null);
                        setEditTimeOut(null);
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }}
                  >
                    <MenuItem value={true}>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Present
                      </div>
                    </MenuItem>
                    <MenuItem value={false}>
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Absent
                      </div>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>

              {editPresent && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time In</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        value={editTimeIn}
                        onChange={setEditTimeIn}
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Out</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        value={editTimeOut}
                        onChange={setEditTimeOut}
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              )}

              <button
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-[#492DBD] to-[#5D46E0] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center"
                onClick={handleStaffAttendence}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DailySheet;